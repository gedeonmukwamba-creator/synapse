/* Synapse — Dashboard / Accueil */

SCREENS.dashboard = function(){
  const recent = [
    { sub: SUBJECTS[0], chap: CHAPTERS.anat[1], pct: 74 },
    { sub: SUBJECTS[1], chap: CHAPTERS.biochem[0], pct: 90 },
    { sub: SUBJECTS[2], chap: CHAPTERS.physio[0], pct: 70 },
  ];
  const ongoing = [
    { sub: SUBJECTS[0], title:'QCM — Système cardiovasculaire', meta:'6 questions · commencé il y a 2 j', pct: 50 },
    { sub: SUBJECTS[3], title:'QCM — Les 4 tissus fondamentaux', meta:'12 questions · à terminer', pct: 25 },
  ];

  const html = `
    <div class="greet">
      <div>
        <h1>Bonjour ${USER.firstName} <span class="wave">👋</span></h1>
        <p class="lead">Tu as révisé <em>${USER.studyThisWeek} h</em> cette semaine et tu gardes une série de <em>${USER.streak} jours</em>. Continue, l'examen se prépare aujourd'hui.</p>
      </div>
      <button class="btn btn-accent btn-lg" onclick="go('generator')">${ic('sparkle')} Générer un QCM</button>
    </div>

    <div class="dash">
      <div class="dash-col">
        <div class="card hero card-pad">
          <div class="h-top">
            <div>
              <div class="h-eyebrow">Progression globale</div>
              <h2>Programme L1 · Semestre 1</h2>
            </div>
            <div class="h-pct">${USER.globalProgress}<small>%</small></div>
          </div>
          <div class="progress" style="--w:${USER.globalProgress}"><span style="width:0"></span></div>
          <div class="h-foot">
            <div><b>${SUBJECTS.length}</b> matières</div>
            <div><b>${SUBJECTS.reduce((a,s)=>a+s.chapters,0)}</b> chapitres</div>
            <div><b>${SUBJECTS.reduce((a,s)=>a+s.qcm,0)}</b> QCM disponibles</div>
          </div>
        </div>

        <div class="stats">
          <div class="card stat"><div class="s-ic ic-mint">${ic('checkCircle')}</div><div class="s-val">${USER.qcmPassed}</div><div class="s-lbl">QCM réussis</div><div class="s-trend">${ic('arrowRight')} +8 cette semaine</div></div>
          <div class="card stat"><div class="s-ic ic-blue">${ic('target')}</div><div class="s-val">${USER.avgScore}%</div><div class="s-lbl">Score moyen</div><div class="s-trend">${ic('arrowRight')} +4 pts</div></div>
          <div class="card stat"><div class="s-ic ic-gold">${ic('clock')}</div><div class="s-val">${USER.studyHours}h</div><div class="s-lbl">Temps de révision</div><div class="s-trend">${ic('flame')} ${USER.streak} j de série</div></div>
        </div>

        <div class="card gen-cta">
          <div class="g-ic">${ic('sparkle')}</div>
          <div>
            <h3>Un QCM sur mesure en 10 secondes</h3>
            <p>Choisis ta matière, ton chapitre, la difficulté — l'IA fait le reste.</p>
          </div>
          <button class="btn btn-accent" onclick="go('generator')">Générer maintenant ${ic('arrowRight')}</button>
        </div>

        <div class="card card-pad">
          <div class="section-head" style="margin-top:0">
            <div><h2>QCM en cours</h2><div class="sub">Reprends là où tu t'es arrêté</div></div>
            <button class="link-btn" onclick="go('quiz')">Tout voir ${ic('chevR')}</button>
          </div>
          ${ongoing.map(o => `
            <div class="continue-row" onclick="go('quiz')">
              ${subjIcon(o.sub)}
              <div class="c-body">
                <div class="c-title">${o.title}</div>
                <div class="c-meta">${o.meta}</div>
              </div>
              <div class="progress" style="--w:${o.pct}"><span style="width:0"></span></div>
              <div class="c-pct">${o.pct}%</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="dash-col">
        <div class="card card-pad" style="text-align:center">
          <div class="section-head" style="justify-content:center;margin-bottom:18px"><h2>Objectif du jour</h2></div>
          <div style="display:flex;justify-content:center;margin-bottom:6px">
            <div class="ring" style="--p:0;--size:148px;--t:13px" data-ring="75"><b style="font-size:34px">3<small style="display:block;font-size:12px;color:var(--muted);font-weight:600">/ 4 QCM</small></b></div>
          </div>
          <p class="sub" style="color:var(--muted);font-size:13.5px;margin:4px 0 16px">Plus qu'un QCM pour valider ta journée 🎯</p>
          <button class="btn btn-primary btn-block" onclick="go('quiz')">${ic('quiz')} Lancer un QCM</button>
        </div>

        <div class="card card-pad">
          <div class="section-head" style="margin-top:0">
            <div><h2>Cours récents</h2></div>
            <button class="link-btn" onclick="go('library')">Bibliothèque ${ic('chevR')}</button>
          </div>
          ${recent.map(r => `
            <div class="continue-row" onclick="go('chapter',{subId:'${r.sub.id}',chId:'${r.chap.id}'})">
              ${subjIcon(r.sub)}
              <div class="c-body">
                <div class="c-title">${r.sub.name}</div>
                <div class="c-meta">Ch.${r.chap.n} · ${r.chap.title.slice(0,30)}…</div>
              </div>
              <div class="c-pct" style="color:var(--accent-strong)">${r.pct}%</div>
            </div>`).join('')}
        </div>

        <div class="card card-pad">
          <div class="section-head" style="margin-top:0">
            <div><h2>Ton classement</h2><div class="sub">Promo L1 · cette semaine</div></div>
            ${chip('2ᵉ / 24', 'gold', 'trophy')}
          </div>
          ${LEADERBOARD.slice(0,3).map(p => `
            <div class="continue-row" onclick="go('leaderboard')" style="cursor:pointer">
              <div class="lb-rank" style="width:24px;font-family:var(--font-display);font-weight:700;color:var(--muted)">${p.rank}</div>
              ${avatar(p.initials, p.color)}
              <div class="c-body"><div class="c-title">${p.name}${p.me?' <span style="color:var(--accent-strong)">· toi</span>':''}</div><div class="c-meta">${p.pts.toLocaleString('fr')} pts</div></div>
              ${p.rank===1?ic('trophy'):''}
            </div>`).join('')}
          <button class="btn btn-ghost btn-block" style="margin-top:12px" onclick="go('leaderboard')">Voir le classement complet</button>
        </div>
      </div>
    </div>`;

  return { html };
};
