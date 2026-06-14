/* Synapse — Bibliothèque : matières → chapitres → chapitre */

SCREENS.library = function(){
  const html = `
    <div class="greet" style="margin-bottom:18px">
      <div>
        <h1>Bibliothèque de cours</h1>
        <p class="lead">${SUBJECTS.length} matières du programme de première année. Choisis une matière pour accéder aux chapitres, résumés, fiches et QCM.</p>
      </div>
    </div>
    <div class="subj-grid">
      ${SUBJECTS.map(s => `
        <div class="card subj-card" onclick="go('subject',{subId:'${s.id}'})">
          ${subjIcon(s, 0).replace('subj-ic','sc-ic')}
          <h3>${s.name}</h3>
          <div class="sc-meta">${s.desc}</div>
          <div class="progress" style="--w:${s.progress}"><span style="width:0"></span></div>
          <div class="sc-foot"><span>${s.chapters} chapitres · ${s.qcm} QCM</span><span style="color:var(--accent-strong)">${s.progress}%</span></div>
        </div>`).join('')}
    </div>`;
  return { html, init: animBars };
};

SCREENS.subject = function(p){
  const sub = SUBJECTS.find(s => s.id === p.subId) || SUBJECTS[0];
  const chaps = CHAPTERS[sub.id] || genericChapters(sub);
  const html = `
    <div class="crumbs">
      <button onclick="go('library')">Bibliothèque</button>
      <span class="sep">${ic('chevR')}</span>
      <span class="cur">${sub.name}</span>
    </div>
    <div class="subject-hero">
      <div class="sh-ic ${COLOR_CLASS[sub.color]}">${ic(sub.icon)}</div>
      <div style="flex:1;min-width:200px">
        <h1>${sub.name}</h1>
        <p>${sub.desc}</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${chip(sub.chapters+' chapitres','blue','library')}
        ${chip(sub.qcm+' QCM','accent','quiz')}
        ${chip(sub.progress+'% complété','gold','target')}
      </div>
    </div>

    <div class="card gen-cta" style="margin-bottom:20px">
      <div class="g-ic">${ic('sparkle')}</div>
      <div><h3>Réviser toute la matière</h3><p>Génère un QCM mixte couvrant tous les chapitres de ${sub.name}.</p></div>
      <button class="btn btn-accent" onclick="go('generator',{subId:'${sub.id}'})">Générer ${ic('arrowRight')}</button>
    </div>

    <div class="section-head"><div><h2>Chapitres</h2><div class="sub">${chaps.length} chapitres disponibles</div></div></div>
    <div>
      ${chaps.map(c => `
        <div class="card chapter">
          <div class="ch-num">${String(c.n).padStart(2,'0')}</div>
          <div class="ch-body">
            <div class="ch-title">${c.title}</div>
            <div class="ch-tags">
              <span class="t">${ic('summary')} Résumé</span>
              <span class="t">${ic('flashcard')} Fiche</span>
              <span class="t">${ic('quiz')} ${c.qcm} QCM</span>
              ${c.hasVideo?`<span class="t">${ic('video')} Vidéos</span>`:''}
              <span class="t">${ic('clock')} ${c.mins} min</span>
            </div>
          </div>
          <div class="ch-prog">
            <span class="lab">${c.progress}%</span>
            <div class="progress" style="--w:${c.progress}"><span style="width:0"></span></div>
          </div>
          <div class="ch-actions">
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();go('chapter',{subId:'${sub.id}',chId:'${c.id}'})">Ouvrir</button>
            <button class="btn btn-soft btn-sm" onclick="event.stopPropagation();go('quiz')">QCM</button>
          </div>
        </div>`).join('')}
    </div>`;
  return { html, init: animBars };
};

SCREENS.chapter = function(p){
  const sub = SUBJECTS.find(s => s.id === p.subId) || SUBJECTS[0];
  const chaps = CHAPTERS[sub.id] || genericChapters(sub);
  const ch = chaps.find(c => c.id === p.chId) || chaps[0];

  const tiles = [
    { ic:'summary', col:'ic-blue', t:'Résumé de cours', d:'Le cours complet, structuré et illustré.', go:`go('summary',{subId:'${sub.id}',chId:'${ch.id}'})`, label:'Lire le cours' },
    { ic:'flashcard', col:'ic-mint', t:'Fiche synthèse', d:"L'essentiel à retenir, format mobile.", go:`go('summary',{subId:'${sub.id}',chId:'${ch.id}'})`, label:'Voir la fiche' },
    { ic:'quiz', col:'ic-violet', t:`QCM (${ch.qcm} questions)`, d:'Teste-toi avec correction détaillée.', go:`go('quiz')`, label:'Démarrer le QCM' },
    { ic:'video', col:'ic-coral', t:'Vidéos associées', d:'Explications visuelles sélectionnées.', go:`go('resources')`, label:'Regarder' },
  ];

  const html = `
    <div class="crumbs">
      <button onclick="go('library')">Bibliothèque</button><span class="sep">${ic('chevR')}</span>
      <button onclick="go('subject',{subId:'${sub.id}'})">${sub.name}</button><span class="sep">${ic('chevR')}</span>
      <span class="cur">Chapitre ${ch.n}</span>
    </div>
    <div class="subject-hero">
      <div class="sh-ic ${COLOR_CLASS[sub.color]}">${ic(sub.icon)}</div>
      <div style="flex:1;min-width:200px">
        <div class="ss-eyebrow" style="color:var(--accent-strong);font-weight:700;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase">${sub.name} · Chapitre ${ch.n}</div>
        <h1 style="margin-top:6px">${ch.title}</h1>
        <p>${ch.mins} min de lecture · ${ch.qcm} questions · progression ${ch.progress}%</p>
      </div>
    </div>
    <div class="section-head"><div><h2>Que veux-tu faire ?</h2><div class="sub">Tout le matériel de ce chapitre</div></div></div>
    <div class="res-tiles">
      ${tiles.map(t => `
        <div class="card res-tile" onclick="${t.go}">
          <div class="rt-ic ${t.col}">${ic(t.ic)}</div>
          <h4>${t.t}</h4>
          <p>${t.d}</p>
          <span class="rt-go">${t.label} ${ic('arrowRight')}</span>
        </div>`).join('')}
    </div>`;
  return { html };
};

function genericChapters(sub){
  const titles = ['Introduction & notions fondamentales','Structures et classification','Mécanismes principaux','Applications cliniques','Approfondissement & cas'];
  return Array.from({length: Math.min(sub.chapters,5)}, (_,i)=>({
    id: sub.id+'g'+(i+1), n:i+1, title: titles[i]||('Chapitre '+(i+1)),
    progress: Math.max(0, sub.progress - i*15), qcm: 14+i*2, hasVideo: i%2===0, mins: 28+i*5,
  }));
}
function animBars(){ /* progress bars painted by paintProgress() in render() */ }
