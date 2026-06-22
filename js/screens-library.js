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
    </div>

    <div class="section-head" style="margin-top:28px">
      <div><h2>Cours PDF</h2><div class="sub">Documents partagés par les étudiants</div></div>
      <button class="btn btn-soft btn-sm" onclick="openPdfUpload('${sub.id}','${ch.id}')">
        ${ic('plus')} Ajouter
      </button>
    </div>
    <div id="chapter-pdfs"><div class="card pdf-loading">Chargement des cours...</div></div>`;

  return { html, init: async function(){ const pdfs = await fetchCourses(sub.id, ch.id); renderChapterPdfs(pdfs); } };
};

function renderChapterPdfs(pdfs) {
  const container = document.getElementById('chapter-pdfs');
  if (!container) return;
  if (!pdfs.length) {
    container.innerHTML = `<div class="card pdf-empty">${ic('doc')} Aucun cours PDF pour ce chapitre. Sois le premier à en partager un !</div>`;
    return;
  }
  container.innerHTML = pdfs.map(p => {
    const date = new Date(p.created_at).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'});
    return `<div class="card pdf-card">
      <div class="pdf-ic">${ic('doc')}</div>
      <div class="pdf-body">
        <div class="pdf-title">${p.title}</div>
        <div class="pdf-meta">Par ${p.uploaded_by} · ${date}</div>
      </div>
      <a href="${p.file_path}" target="_blank" rel="noopener" class="btn btn-soft btn-sm">${ic('arrowRight')} Ouvrir</a>
    </div>`;
  }).join('');
}

function openPdfUpload(subId, chId) {
  const existing = document.getElementById('pdf-modal');
  if (existing) existing.remove();
  const sub = SUBJECTS.find(s => s.id === subId);
  const allChaps = CHAPTERS[subId] || [];
  const ch = allChaps.find(c => c.id === chId) || {};
  const subName = sub ? sub.name : subId;
  const chTitle = ch.title || 'Chapitre';
  const modal = el(`<div id="pdf-modal" class="modal-overlay" onclick="if(event.target===this)closePdfModal()">
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <h3>Ajouter un cours PDF</h3>
        <button class="icon-btn" onclick="closePdfModal()" style="flex:none">${ic('xCircle')}</button>
      </div>
      <p style="color:var(--muted);margin:0 0 20px;font-size:13.5px">${subName} · ${chTitle}</p>
      <div>
        <label class="modal-label">Titre du document</label>
        <input type="text" id="pdf-title" placeholder="Ex: Résumé ostéologie Ch.1" class="modal-input">
      </div>
      <div style="margin-top:16px">
        <label class="modal-label">Fichier PDF (max 10 Mo)</label>
        <div class="pdf-drop-zone" onclick="document.getElementById('pdf-file-input').click()">
          <span id="pdf-drop-label" style="display:inline-flex;align-items:center;gap:7px">${ic('doc')} Cliquer pour choisir un PDF</span>
          <input type="file" id="pdf-file-input" accept=".pdf,application/pdf" style="display:none" onchange="onPdfFileChange(this)">
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:24px;justify-content:flex-end">
        <button class="btn btn-ghost" onclick="closePdfModal()">Annuler</button>
        <button class="btn btn-accent" id="pdf-upload-btn" onclick="submitPdfUpload('${subId}','${chId}')">${ic('arrowRight')} Uploader</button>
      </div>
    </div>
  </div>`);
  document.body.appendChild(modal);
}

function onPdfFileChange(input) {
  const label = document.getElementById('pdf-drop-label');
  if (label && input.files[0]) {
    const name = input.files[0].name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    label.innerHTML = ic('check') + ' ' + name;
    label.style.color = 'var(--accent-strong)';
  }
}

function closePdfModal() {
  const m = document.getElementById('pdf-modal');
  if (m) m.remove();
}

async function submitPdfUpload(subId, chId) {
  const titleEl = document.getElementById('pdf-title');
  const fileInput = document.getElementById('pdf-file-input');
  const title = titleEl ? titleEl.value.trim() : '';
  const file = fileInput ? fileInput.files[0] : null;
  if (!title) { toast('Ajoute un titre au document', 'warn'); return; }
  if (!file) { toast('Sélectionne un fichier PDF', 'warn'); return; }
  if (file.size > 10 * 1024 * 1024) { toast('Fichier trop grand (max 10 Mo)', 'warn'); return; }
  const btn = document.getElementById('pdf-upload-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Upload en cours…'; }
  const ok = await uploadCourse(file, subId, chId, title);
  closePdfModal();
  if (ok) {
    toast('Cours ajouté avec succès', 'check');
    const pdfs = await fetchCourses(subId, chId);
    renderChapterPdfs(pdfs);
  } else {
    toast("Erreur lors de l'upload", 'warn');
  }
}

function genericChapters(sub){
  const titles = ['Introduction & notions fondamentales','Structures et classification','Mécanismes principaux','Applications cliniques','Approfondissement & cas'];
  return Array.from({length: Math.min(sub.chapters,5)}, (_,i)=>({
    id: sub.id+'g'+(i+1), n:i+1, title: titles[i]||('Chapitre '+(i+1)),
    progress: Math.max(0, sub.progress - i*15), qcm: 14+i*2, hasVideo: i%2===0, mins: 28+i*5,
  }));
}
function animBars(){ /* progress bars painted by paintProgress() in render() */ }
