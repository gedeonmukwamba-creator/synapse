/* Synapse — Générateur de QCM par IA */

let GEN = { subId:'anat', chId:null, count:10, diff:'Moyen', phase:'form' };

SCREENS.generator = function(p){
  if(p && p.subId) GEN.subId = p.subId;
  const sub = SUBJECTS.find(s=>s.id===GEN.subId) || SUBJECTS[0];
  const chaps = CHAPTERS[sub.id] || genericChapters(sub);

  if(GEN.phase === 'loading') return genLoading();
  if(GEN.phase === 'ready') return genReady(sub);

  const html = `
    <div class="greet" style="margin-bottom:8px">
      <div>
        <h1>Générateur de QCM ${ic('sparkle')}</h1>
        <p class="lead">Décris ce que tu veux réviser, l'IA construit un QCM sur mesure avec corrections détaillées en quelques secondes.</p>
      </div>
    </div>

    <div class="gen-grid">
      <div class="card card-pad">
        <div class="field">
          <label>Matière</label>
          <div class="opt-row">
            ${SUBJECTS.map(s=>`
              <button class="opt-pill ${s.id===GEN.subId?'sel':''}" onclick="setGen('subId','${s.id}')">
                <span class="op-ic ${COLOR_CLASS[s.color]}" style="border-radius:7px">${ic(s.icon)}</span>${s.name}
              </button>`).join('')}
          </div>
        </div>

        <div class="field">
          <label>Chapitre <span class="hint">— ou laisse « Tous » pour un QCM mixte</span></label>
          <div class="opt-row">
            <button class="opt-pill ${!GEN.chId?'sel':''}" onclick="setGen('chId','')">Tous les chapitres</button>
            ${chaps.map(c=>`<button class="opt-pill ${GEN.chId===c.id?'sel':''}" onclick="setGen('chId','${c.id}')">Ch.${c.n} · ${c.title.slice(0,26)}${c.title.length>26?'…':''}</button>`).join('')}
          </div>
        </div>

        <div class="field">
          <label>Nombre de questions</label>
          <div class="range-wrap">
            <input type="range" min="5" max="30" step="5" value="${GEN.count}" oninput="setGenCount(this.value)">
            <span class="range-val" id="genCount">${GEN.count}</span>
          </div>
        </div>

        <div class="field" style="margin-bottom:8px">
          <label>Difficulté</label>
          <div class="seg diff">
            ${['Facile','Moyen','Difficile'].map(d=>`<button data-v="${d}" class="${d===GEN.diff?'sel':''}" onclick="setGen('diff','${d}')">${d}</button>`).join('')}
          </div>
        </div>
      </div>

      <button class="btn btn-accent btn-lg btn-block" style="padding:17px" onclick="runGen()">${ic('sparkle')} Générer le QCM</button>
      <p class="sub" style="text-align:center;color:var(--muted);font-size:13px;margin-top:-4px">L'IA s'appuie sur les cours validés de ${sub.name} · ${GEN.diff.toLowerCase()} · ${GEN.count} questions</p>
    </div>`;

  return { html };
};

function setGen(key, val){ GEN[key] = val; if(key==='subId') GEN.chId=null; render(); }
function setGenCount(v){ GEN.count = +v; const e=$('#genCount'); if(e) e.textContent=v; }

async function runGen(){
  if (!(await canGenQcm())) {
    toast(`Limite atteinte — ${FREE_QCM_PER_DAY} QCM gratuits/jour. Passe à Premium !`, 'star');
    go('premium');
    return;
  }
  incrementGenUsage();
  GEN.phase = 'loading';
  render();

  const steps = ['Analyse du chapitre…','Sélection des notions clés…','Rédaction des questions…','Génération des corrections…','Finalisation du QCM…'];
  let stepIdx = 0;
  const stepInt = setInterval(() => {
    stepIdx++;
    const e = document.getElementById('genStep');
    if (e && stepIdx < steps.length) e.textContent = steps[stepIdx];
  }, 700);

  const sub = SUBJECTS.find(s => s.id === GEN.subId) || SUBJECTS[0];
  const chaps = CHAPTERS[sub.id] || genericChapters(sub);
  const chap = GEN.chId ? chaps.find(c => c.id === GEN.chId) : null;

  try {
    const resp = await fetch('/.netlify/functions/generate-qcm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: sub.name,
        chapter: chap ? chap.title : null,
        count: GEN.count,
        difficulty: GEN.diff
      })
    });

    clearInterval(stepInt);
    if (!resp.ok) throw new Error('Erreur serveur ' + resp.status);

    const data = await resp.json();
    if (!data.questions?.length) throw new Error('Réponse invalide');

    GENERATED_QUIZ = {
      id: 'gen-' + Date.now(),
      subject: sub.name,
      subjectColor: sub.color,
      chapter: chap ? chap.title : 'Tous les chapitres',
      difficulty: GEN.diff,
      questions: data.questions
    };

    GEN.phase = 'ready';
    render();

  } catch(err) {
    clearInterval(stepInt);
    console.error('Génération QCM :', err);
    GEN.phase = 'form';
    render();
    toast('Génération échouée. Vérifie ta connexion et réessaie.', 'warn');
  }
}

function genLoading(){
  const html = `
    <div class="gen-grid">
      <div class="card gen-loading">
        <div class="gen-spinner"></div>
        <h2>L'IA construit ton QCM…</h2>
        <div class="gl-step" id="genStep">Analyse du chapitre…</div>
      </div>
    </div>`;
  return { html };
}

function genReady(sub){
  const html = `
    <div class="gen-grid">
      <div class="card gen-ready">
        <div class="gr-ic">${ic('checkCircle')}</div>
        <h1>Ton QCM est prêt ! 🎉</h1>
        <p class="r-sub" style="color:var(--muted);margin:8px 0 4px">${GEN.count} questions · ${sub.name} · difficulté ${GEN.diff.toLowerCase()}</p>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:18px 0 24px">
          ${chip(sub.name, 'blue', sub.icon)}
          ${chip(GEN.count+' questions','accent','quiz')}
          ${chip(GEN.diff, GEN.diff==='Difficile'?'coral':GEN.diff==='Facile'?'accent':'gold','gauge')}
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="startQuiz(true)">${ic('play')} Passer le QCM maintenant</button>
          <button class="btn btn-ghost btn-lg" onclick="shareGen()">${ic('share')} Partager</button>
        </div>
        <button class="link-btn" style="margin-top:18px" onclick="GEN.phase='form';render()">${ic('arrowLeft')} Générer un autre QCM</button>
      </div>
    </div>`;
  return { html };
}

function shareGen(){
  if(navigator.clipboard) navigator.clipboard.writeText('https://synapse.upc/qcm/ia-'+Math.random().toString(36).slice(2,7)).catch(()=>{});
  toast('Lien du QCM généré copié — invite tes amis !', 'copy');
}
