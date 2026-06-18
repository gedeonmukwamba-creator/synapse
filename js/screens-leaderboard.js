/* Synapse — Classement réel via Supabase */

SCREENS.leaderboard = function() {
  const html = `
    <div class="greet" style="margin-bottom:18px">
      <div>
        <h1>Classement amical</h1>
        <p class="lead">Compare tes scores avec ta promo. Révise mieux, ensemble.</p>
      </div>
      <button class="btn btn-accent btn-lg" onclick="changePseudo()">${ic('users')} Mon pseudo</button>
    </div>
    <div id="lb-content">
      <div class="card card-pad" style="text-align:center;padding:48px">
        <div class="gen-spinner" style="margin:0 auto 16px"></div>
        <p style="color:var(--muted)">Chargement du classement…</p>
      </div>
    </div>`;

  return { html, async init() {
    const rows = await fetchLeaderboard();
    const el = document.getElementById('lb-content');
    if (el) { el.innerHTML = renderLeaderboard(rows); paintProgress(el); }
  }};
};

function aggregateUsers(rows) {
  const map = {};
  rows.forEach(r => {
    if (!map[r.pseudo]) map[r.pseudo] = { pseudo: r.pseudo, quizzes: 0, totalCorrect: 0, totalQuestions: 0, totalScore: 0 };
    map[r.pseudo].quizzes++;
    map[r.pseudo].totalCorrect += r.correct;
    map[r.pseudo].totalQuestions += r.total;
    map[r.pseudo].totalScore += r.score;
  });
  return Object.values(map)
    .map(u => ({ ...u, avg: Math.round(u.totalScore / u.quizzes), pts: u.totalCorrect * 100 }))
    .sort((a, b) => b.pts - a.pts || b.avg - a.avg);
}

function uColor(pseudo) {
  const cols = ['mint','blue','coral','violet','sky','gold'];
  let h = 0; for (const c of pseudo) h = (h * 31 + c.charCodeAt(0)) % cols.length;
  return cols[h];
}
function uInitials(pseudo) {
  return pseudo.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '??';
}

function renderLeaderboard(rows) {
  if (!rows.length) {
    return `<div class="card card-pad" style="text-align:center;padding:48px">
      <div style="font-size:48px;margin-bottom:12px">🏆</div>
      <h2 style="margin:0 0 8px">Aucun score encore</h2>
      <p style="color:var(--muted);margin:0 0 20px">Sois le premier à passer un QCM et apparaître ici !</p>
      <button class="btn btn-primary" onclick="go('quiz')">${ic('quiz')} Passer un QCM</button>
    </div>`;
  }

  const users = aggregateUsers(rows);
  const myPseudo = localStorage.getItem('synapse_pseudo');
  const myRank = users.findIndex(u => u.pseudo === myPseudo) + 1;
  const myData = users.find(u => u.pseudo === myPseudo);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);
  const podiumSlots = [top3[1], top3[0], top3[2]];
  const podiumClass = ['second', 'first', 'third'];
  const podiumLabel = [2, 1, 3];

  return `
    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:18px;align-items:start" class="lb-layout">
      <div>
        <div class="card card-pad" style="margin-bottom:18px">
          <div class="lb-podium">
            ${podiumSlots.map((p, i) => p ? `
              <div class="podium ${podiumClass[i]}">
                <div class="p-medal">${podiumLabel[i]}</div>
                <div class="p-av" style="background:${AVATAR_GRAD[uColor(p.pseudo)]}">${uInitials(p.pseudo)}</div>
                <div class="p-name">${p.pseudo.split(' ')[0]}${p.pseudo === myPseudo ? ' (toi)' : ''}</div>
                <div class="p-score">${p.avg}%</div>
                <div class="sub" style="font-size:11.5px;color:var(--muted);font-weight:600;margin-top:2px">${p.quizzes} QCM</div>
              </div>` : `<div class="podium ${podiumClass[i]}" style="opacity:.3"><div class="p-medal">${podiumLabel[i]}</div><div class="p-av">?</div><div class="p-name">–</div></div>`
            ).join('')}
          </div>
          <div style="margin-top:8px">
            ${rest.map((p, i) => `
              <div class="lb-row ${p.pseudo === myPseudo ? 'me' : ''}">
                <span class="lb-rank">${i + 4}</span>
                ${avatar(uInitials(p.pseudo), uColor(p.pseudo))}
                <div class="lb-name">${p.pseudo}${p.pseudo === myPseudo ? ' <span style="color:var(--accent-strong)">· toi</span>' : ''}<small>${p.quizzes} QCM · moy. ${p.avg}%</small></div>
                <span class="lb-pts">${p.pts.toLocaleString('fr')}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px">
        <div class="card hero card-pad" style="text-align:center">
          <div class="h-eyebrow">Ta position</div>
          <div class="h-pct" style="margin:6px 0">${myRank > 0 ? myRank + '<small>ᵉ</small>' : '—'}</div>
          <p style="color:rgba(255,255,255,.82);font-size:13.5px;margin:0 0 4px">${myPseudo || 'Non inscrit'} · ${myData ? myData.pts.toLocaleString('fr') + ' pts' : '0 pts'}</p>
          <p style="color:var(--mint-300);font-weight:700;font-size:13.5px;margin:0">
            ${myRank === 1 ? '🏆 Tu es en tête !' : myRank > 1 && users[myRank - 2] ? ic('arrowRight') + ' ' + (users[myRank - 2].pts - (myData?.pts || 0)) + ' pts pour la ' + (myRank - 1) + 'ᵉ place' : 'Passe un QCM pour apparaître ici !'}
          </p>
        </div>

        <div class="card share-card">
          <h3 style="font-size:17px;margin-bottom:4px">${ic('users')} Ton pseudo</h3>
          <p class="sub" style="color:var(--muted);font-size:13px;margin:0 0 10px">${myPseudo || 'Pas encore défini'}</p>
          <button class="btn btn-accent btn-sm" onclick="changePseudo()">${ic('edit')} Changer le pseudo</button>
        </div>

        <div class="card share-card">
          <h3 style="font-size:17px;margin-bottom:4px">${ic('share')} Partager Synapse</h3>
          <p class="sub" style="color:var(--muted);font-size:13px;margin:0 0 14px">Invite tes collègues de promo à rejoindre le classement.</p>
          <button class="btn btn-primary btn-sm" onclick="shareApp()">${ic('copy')} Copier le lien</button>
        </div>
      </div>
    </div>`;
}

function changePseudo() {
  const current = localStorage.getItem('synapse_pseudo') || '';
  const p = (prompt('Nouveau pseudo :', current) || '').trim();
  if (p) {
    localStorage.setItem('synapse_pseudo', p);
    toast('Pseudo mis à jour : ' + p, 'check');
    render();
  }
}

function shareApp() {
  const url = 'https://synapse-majeste.netlify.app';
  if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
  toast('Lien copié — partage-le à tes collègues !', 'copy');
}
