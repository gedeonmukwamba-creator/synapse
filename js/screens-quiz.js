/* Synapse — Module QCM interactif */

let QS = null;

SCREENS.quiz = function(){
  const list = [
    { ...QUIZ, started:true, prog:50 },
    { id:'q2', subject:'Histologie', subjectColor:'violet', chapter:'Les 4 tissus fondamentaux', difficulty:'Facile', questions:Array(12), started:true, prog:25, icon:'histo' },
    { id:'q3', subject:'Biochimie', subjectColor:'mint', chapter:'Les glucides', difficulty:'Moyen', questions:Array(16), started:false, icon:'biochem' },
    { id:'q4', subject:'Physiologie', subjectColor:'coral', chapter:"Potentiel d'action", difficulty:'Difficile', questions:Array(18), started:false, icon:'physio' },
  ];
  const subjOf = name => SUBJECTS.find(s=>s.name===name) || {icon:'quiz', color:'blue'};

  const html = `
    <div class="greet" style="margin-bottom:18px">
      <div>
        <h1>Module QCM</h1>
        <p class="lead">Une question à la fois, correction immédiate et analyse de tes points faibles. Choisis un QCM ou laisse l'IA t'en générer un.</p>
      </div>
      <button class="btn btn-accent btn-lg" onclick="go('generator')">${ic('sparkle')} Nouveau QCM</button>
    </div>

    <div class="card gen-cta" style="margin-bottom:22px;background:linear-gradient(120deg,var(--primary-soft),color-mix(in srgb,var(--primary) 10%,var(--surface)));border-color:color-mix(in srgb,var(--primary) 24%,transparent)">
      <div class="g-ic" style="background:linear-gradient(150deg,var(--blue-600),var(--blue-800))">${ic('quiz')}</div>
      <div><h3>QCM du jour · Système cardiovasculaire</h3><p>6 questions · Anatomie · difficulté moyenne · ~5 min</p></div>
      <button class="btn btn-primary" onclick="startQuiz()">Commencer ${ic('arrowRight')}</button>
    </div>

    <div class="section-head"><div><h2>Tes QCM</h2><div class="sub">En cours et suggérés</div></div></div>
    <div class="subj-grid">
      ${list.map(q => { const s = subjOf(q.subject); return `
        <div class="card subj-card" onclick="startQuiz()">
          <div class="sc-ic ${COLOR_CLASS[q.subjectColor]}">${ic(q.icon||s.icon)}</div>
          <h3 style="font-size:16px">${q.chapter}</h3>
          <div class="sc-meta">${q.subject} · ${q.questions.length} questions</div>
          <div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap">
            ${chip(q.difficulty, q.difficulty==='Facile'?'accent':q.difficulty==='Difficile'?'coral':'gold')}
            ${q.started?chip('En cours · '+q.prog+'%','blue'):chip('Nouveau','')}
          </div>
          <div class="sc-foot" style="margin-top:14px"><span>${q.started?'Reprendre':'Démarrer'}</span>${ic('arrowRight')}</div>
        </div>`; }).join('')}
    </div>`;
  return { html };
};

function startQuiz(useGenerated){
  const quizData = (useGenerated && GENERATED_QUIZ) ? GENERATED_QUIZ : QUIZ;
  QS = { idx:0, answers:[], answered:false, selected:null, start:Date.now(), quizData };
  go('quizplay');
}

SCREENS.quizplay = function(){
  if(!QS){ return SCREENS.quiz(); }
  const qd = QS.quizData;
  const total = qd.questions.length;
  const q = qd.questions[QS.idx];
  const progPct = Math.round((QS.idx)/total*100);
  const keys = ['A','B','C','D'];

  const html = `
    <div class="quiz-wrap">
      <div class="crumbs" style="margin-bottom:14px">
        <button onclick="quitQuiz()">${ic('arrowLeft')} Quitter</button>
        <span class="sep">${ic('chevR')}</span>
        <span class="cur">${qd.subject} · ${qd.chapter}</span>
      </div>
      <div class="quiz-top">
        <span class="q-count"><b>${QS.idx+1}</b> / ${total}</span>
        <div class="progress blue" style="--w:${progPct}"><span style="width:${progPct}%"></span></div>
        <span class="q-timer">${ic('clock')} <span id="qtimer">0:00</span></span>
      </div>

      <div class="card qcard">
        <span class="q-subj">${chip(qd.subject+' · '+qd.difficulty, 'blue', 'anatomy')}</span>
        <div class="q-text">${q.q}</div>
        <div class="q-options" id="qopts">
          ${q.opts.map((o,i)=>`
            <button class="q-opt" data-i="${i}" onclick="answer(${i})">
              <span class="q-key">${keys[i]}</span>
              <span class="q-label">${o}</span>
              <span class="q-mark"></span>
            </button>`).join('')}
        </div>
        <div class="q-explain" id="qexplain">
          <div class="qe-head" id="qehead">${ic('bulb')} Explication</div>
          <p>${fmt(q.exp)}</p>
          <div class="qe-src">${ic('doc')} Source : ${q.src}</div>
        </div>
      </div>

      <div class="quiz-foot">
        <button class="btn btn-ghost" onclick="quitQuiz()">${ic('arrowLeft')} Abandonner</button>
        <button class="btn btn-primary" id="nextBtn" style="visibility:hidden" onclick="nextQ()">
          ${QS.idx === total-1 ? 'Voir le résultat' : 'Question suivante'} ${ic('arrowRight')}
        </button>
      </div>
    </div>`;

  return { html, init(){ startTimer(); }};
};

function answer(i){
  if(QS.answered) return;
  QS.answered = true; QS.selected = i;
  const q = QS.quizData.questions[QS.idx];
  const correct = q.correct;
  const opts = $$('#qopts .q-opt');
  opts.forEach((btn,idx)=>{
    btn.disabled = true;
    if(idx === correct){ btn.classList.add('correct'); btn.querySelector('.q-mark').innerHTML = ic('checkCircle'); }
    else if(idx === i){ btn.classList.add('wrong'); btn.querySelector('.q-mark').innerHTML = ic('xCircle'); }
    else btn.classList.add('dimmed');
  });
  const ok = i === correct;
  QS.answers.push({ q: QS.idx, correct: ok, subject: QS.quizData.subject });
  const exp = $('#qexplain');
  exp.classList.add('show'); if(ok) exp.classList.add('ok');
  $('#qehead').innerHTML = ok ? ic('checkCircle')+' Bonne réponse !' : ic('bulb')+' Pas tout à fait — voici pourquoi';
  $('#nextBtn').style.visibility = 'visible';
  if(ok) burst(8);
}

function nextQ(){
  if(QS.idx < QS.quizData.questions.length-1){ QS.idx++; QS.answered=false; QS.selected=null; render(); }
  else {
    stopTimer();
    const correct = QS.answers.filter(a=>a.correct).length;
    submitScore(QS.quizData.subject, correct, QS.quizData.questions.length);
    go('quizresult');
  }
}
function quitQuiz(){ stopTimer(); go('quiz'); }

let qTimerInt;
function startTimer(){
  stopTimer();
  qTimerInt = setInterval(()=>{
    const t = $('#qtimer'); if(!t){ stopTimer(); return; }
    const s = Math.floor((Date.now()-QS.start)/1000);
    t.textContent = Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  }, 500);
}
function stopTimer(){ clearInterval(qTimerInt); }

SCREENS.quizresult = function(){
  if(!QS){ return SCREENS.quiz(); }
  const qd = QS.quizData;
  const total = qd.questions.length;
  const right = QS.answers.filter(a=>a.correct).length;
  const pct = Math.round(right/total*100);
  const secs = Math.floor((Date.now()-QS.start)/1000);
  const timeStr = Math.floor(secs/60)+' min '+(secs%60)+'s';
  const passed = pct >= 60;

  const themes = [
    { name:'Cavités & circulation', score: Math.min(100, pct+12) },
    { name:'Valves cardiaques', score: Math.max(20, pct-18) },
    { name:'Vascularisation', score: pct },
  ].sort((a,b)=>a.score-b.score);

  const html = `
    <div class="quiz-wrap">
      <div class="card result-hero" id="resHero">
        <div class="ring big-ring" style="--p:0;--size:168px;--t:14px" data-ring="${pct}"><b>${pct}%<small>${right}/${total} bonnes</small></b></div>
        <h1>${passed ? (pct>=85?'Excellent travail ! 🎉':'Bien joué ! 👏') : 'Continue, tu progresses 💪'}</h1>
        <p class="r-sub">${passed ? 'Tu maîtrises ce chapitre. Pousse vers les questions difficiles.' : 'Revois les points faibles ci-dessous puis retente le QCM.'}</p>
        <div class="result-stats">
          <div class="rs"><b style="color:var(--accent-strong)">${right}</b><span>Bonnes réponses</span></div>
          <div class="rs"><b style="color:var(--coral)">${total-right}</b><span>Erreurs</span></div>
          <div class="rs"><b style="color:var(--primary-strong)">${timeStr}</b><span>Temps total</span></div>
        </div>
      </div>

      <div class="card card-pad weak" style="margin-top:18px">
        <h3>${ic('target')} Analyse de tes points faibles</h3>
        ${themes.map(t=>`
          <div class="weak-row">
            <span class="w-name">${t.name}</span>
            <div class="progress ${t.score<55?'':'blue'}" style="--w:${t.score}"><span style="width:0;${t.score<55?'background:linear-gradient(90deg,#ef8a7f,#d2564c)':''}"></span></div>
            <span class="w-pct" style="color:${t.score<55?'var(--coral)':'var(--ink)'}">${t.score}%</span>
          </div>`).join('')}
        <p class="sub" style="color:var(--muted);font-size:13px;margin-top:14px">${ic('bulb')} Conseil : concentre ta prochaine session sur « ${themes[0].name} ».</p>
      </div>

      <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" style="flex:1" onclick="startQuiz()">${ic('refresh')} Recommencer</button>
        <button class="btn btn-accent btn-lg" style="flex:1" onclick="go('generator')">${ic('sparkle')} Nouveau QCM</button>
        <button class="btn btn-ghost btn-lg" onclick="shareQuiz()">${ic('share')} Partager</button>
      </div>
    </div>`;

  return { html, init(){
    if(passed) burst(60, true);
  }};
};

function shareQuiz(){
  const link = 'synapse-majeste.netlify.app/qcm/' + (QS.quizData.id || 'anat-cv');
  if(navigator.clipboard) navigator.clipboard.writeText('https://'+link).catch(()=>{});
  toast('Lien du QCM copié — partage-le à tes amis !', 'copy');
}

function fmt(s){ return (s||'').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
function burst(n, big){
  const host = big ? $('#resHero') : $('.qcard');
  if(!host) return;
  const cols = ['#2ecc8f','#1a3c5e','#f2b441','#41a0d6','#7c6bd6'];
  for(let k=0;k<n;k++){
    const c = el(`<span class="confetti"></span>`);
    c.style.left = Math.random()*100+'%';
    c.style.background = cols[k%cols.length];
    c.style.animationDelay = (Math.random()*0.3)+'s';
    host.appendChild(c);
    setTimeout(()=>c.remove(), 2600);
  }
}
