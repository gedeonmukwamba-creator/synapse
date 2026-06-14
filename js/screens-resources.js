/* Synapse — Ressources & vidéos + favoris */

let resFilter = 'Tous';

SCREENS.resources = function(){
  const subjects = ['Tous', ...new Set(RESOURCES.videos.map(v=>v.subj))];
  const vids = resFilter==='Tous' ? RESOURCES.videos : RESOURCES.videos.filter(v=>v.subj===resFilter);
  const links = resFilter==='Tous' ? RESOURCES.links : RESOURCES.links.filter(l=>l.subj===resFilter||l.subj==='Tous');
  const favCount = App.favorites.size;

  const html = `
    <div class="greet" style="margin-bottom:16px">
      <div>
        <h1>Ressources & vidéos</h1>
        <p class="lead">Vidéos sélectionnées, atlas en ligne et sites de référence, organisés par matière. Mets en favori ce qui t'aide le plus.</p>
      </div>
      <button class="btn btn-ghost btn-lg" onclick="showFavs()">${ic('heart')} Mes favoris ${favCount?`<span class="nav-badge" style="background:var(--coral);color:#fff">${favCount}</span>`:''}</button>
    </div>

    <div class="filter-row">
      ${subjects.map(s=>`<button class="filter-chip ${s===resFilter?'active':''}" onclick="setResFilter('${s}')">${s}</button>`).join('')}
    </div>

    <div class="section-head"><div><h2>Vidéos</h2><div class="sub">${vids.length} vidéos · cliquer pour lancer</div></div></div>
    <div class="vid-grid">
      ${vids.map(v=>{ const on = App.favorites.has(v.id); return `
        <div class="card vid-card">
          <div class="vid-thumb" data-yt="${v.yt}" onclick="playVid(this)">
            <img src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="${v.title}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
            <div class="play"><span>${ic('play')}</span></div>
            <div class="v-dur">${v.dur}</div>
          </div>
          <div class="vid-body">
            <div class="v-src">${v.src}</div>
            <h4>${v.title}</h4>
            <p>${v.desc}</p>
            <div class="v-foot">
              ${chip(v.subj, 'blue')}
              <button class="fav-btn ${on?'on':''}" data-id="${v.id}" onclick="toggleFav('${v.id}',this)" title="Favori">${ic('heart')}</button>
            </div>
          </div>
        </div>`; }).join('')}
    </div>

    <div class="section-head" style="margin-top:30px"><div><h2>Liens & atlas</h2><div class="sub">Sites médicaux de référence</div></div></div>
    <div class="link-list">
      ${links.map(l=>`
        <div class="card link-item" onclick="toast('Ouverture de ${l.title}…','ext')">
          <div class="li-ic ${COLOR_CLASS[l.color]}">${ic(l.icon)}</div>
          <div class="li-body"><h4>${l.title}</h4><p>${l.url}</p></div>
          <span class="li-ext">${ic('ext')}</span>
        </div>`).join('')}
    </div>`;

  return { html };
};

function setResFilter(s){ resFilter = s; render(); }
function toggleFav(id, btn){
  event.stopPropagation();
  if(App.favorites.has(id)){ App.favorites.delete(id); btn.classList.remove('on'); toast('Retiré des favoris'); }
  else { App.favorites.add(id); btn.classList.add('on'); toast('Ajouté à tes favoris ❤️','heart'); }
  saveFavs();
}
function playVid(box){
  const yt = box.dataset.yt;
  box.innerHTML = `<iframe src="https://www.youtube.com/embed/${yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}
function showFavs(){
  const n = App.favorites.size;
  toast(n? `Tu as ${n} ressource${n>1?'s':''} en favori` : "Aucun favori pour l'instant — clique sur ♥", 'heart');
}
