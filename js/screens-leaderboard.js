/* Synapse — Classement amical & partage */

let invited = [];

SCREENS.leaderboard = function(){
  const top3 = LEADERBOARD.slice(0,3);
  const rest = LEADERBOARD.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumClass = ['second','first','third'];

  const html = `
    <div class="greet" style="margin-bottom:18px">
      <div>
        <h1>Classement amical</h1>
        <p class="lead">Compare tes scores avec ta promo, garde ta série et grimpe le classement. Révise mieux, ensemble.</p>
      </div>
      <button class="btn btn-accent btn-lg" onclick="document.getElementById('inviteInput').focus()">${ic('users')} Inviter un ami</button>
    </div>

    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:18px;align-items:start" class="lb-layout">
      <div>
        <div class="card card-pad" style="margin-bottom:18px">
          <div class="lb-podium">
            ${podiumOrder.map((p,i)=>`
              <div class="podium ${podiumClass[i]}" onclick="toast('${p.name} · ${p.pts.toLocaleString('fr')} pts','trophy')">
                <div class="p-medal">${[2,1,3][i]}</div>
                <div class="p-av" style="background:${AVATAR_GRAD[p.color]}">${p.initials}</div>
                <div class="p-name">${p.name.split(' ')[0]}${p.me?' (toi)':''}</div>
                <div class="p-score">${(p.pts/1000).toFixed(2)}k</div>
                <div class="sub" style="font-size:11.5px;color:var(--muted);font-weight:600;margin-top:2px">${ic('flame')} ${p.streak} j</div>
              </div>`).join('')}
          </div>

          <div style="margin-top:8px">
            ${rest.map(p=>lbRow(p)).join('')}
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px">
        <div class="card hero card-pad" style="text-align:center">
          <div class="h-eyebrow">Ta position</div>
          <div class="h-pct" style="margin:6px 0">2<small>ᵉ</small></div>
          <p style="color:rgba(255,255,255,.82);font-size:13.5px;margin:0 0 4px">sur 24 étudiants · ${USER.points.toLocaleString('fr')} pts</p>
          <p style="color:var(--mint-300);font-weight:700;font-size:13.5px;margin:0">${ic('arrowRight')} Plus que 280 pts pour la 1ʳᵉ place !</p>
        </div>

        <div class="card share-card">
          <h3 style="font-size:17px;margin-bottom:4px">${ic('share')} Partager un QCM</h3>
          <p class="sub" style="color:var(--muted);font-size:13px;margin:0 0 14px">Envoie un lien à tes collègues pour réviser le même QCM.</p>
          <div class="share-link">
            <span style="color:var(--muted)">${ic('quiz')}</span>
            <input id="shareLink" value="synapse.upc/qcm/anat-cv-9f3" readonly onclick="this.select()">
            <button class="btn btn-primary btn-sm" onclick="copyShare()">${ic('copy')} Copier</button>
          </div>
        </div>

        <div class="card share-card">
          <h3 style="font-size:17px;margin-bottom:4px">${ic('users')} Inviter un ami</h3>
          <p class="sub" style="color:var(--muted);font-size:13px;margin:0 0 4px">Réviser ensemble, c'est mieux. Ajoute un collègue de promo.</p>
          <div class="invite-row">
            <input id="inviteInput" placeholder="prenom.nom@upc.ac.cd" type="email">
            <button class="btn btn-accent" onclick="doInvite()">${ic('send')} Inviter</button>
          </div>
          <div class="friends-invited" id="invitedList"></div>
        </div>
      </div>
    </div>`;

  return { html, init(){
    const input = $('#inviteInput');
    if(input) input.addEventListener('keydown', e=>{ if(e.key==='Enter') doInvite(); });
    renderInvited();
  }};
};

function lbRow(p){
  return `
    <div class="lb-row ${p.me?'me':''}">
      <span class="lb-rank">${p.rank}</span>
      ${avatar(p.initials, p.color)}
      <div class="lb-name">${p.name}${p.me?' <span style="color:var(--accent-strong)">· toi</span>':''}<small>${p.meta}</small></div>
      <span class="lb-streak">${ic('flame')} ${p.streak}</span>
      <span class="lb-pts">${p.pts.toLocaleString('fr')}</span>
    </div>`;
}

function copyShare(){
  const v = $('#shareLink').value;
  if(navigator.clipboard) navigator.clipboard.writeText('https://'+v).catch(()=>{});
  toast('Lien du QCM copié dans le presse-papier !','copy');
}
function doInvite(){
  const input = $('#inviteInput');
  const v = (input.value||'').trim();
  if(!v || !v.includes('@')){ toast('Entre une adresse e-mail valide','warn'); return; }
  const name = v.split('@')[0].replace(/[._]/g,' ');
  const initials = name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
  const cols=['blue','mint','coral','violet','sky','gold'];
  invited.push({ name, initials, color: cols[invited.length%cols.length] });
  input.value='';
  renderInvited();
  toast('Invitation envoyée à '+name+' ✉️','send');
}
function renderInvited(){
  const box = $('#invitedList'); if(!box) return;
  box.innerHTML = invited.map(f=>`<span class="fi-pill">${avatar(f.initials,f.color)}${f.name}</span>`).join('');
}
