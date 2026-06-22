/* Synapse — app core: state, router, helpers, theme */

const App = {
  view: 'dashboard',
  params: {},
  favorites: new Set(JSON.parse(localStorage.getItem('synapse_favs') || '[]')),
  theme: localStorage.getItem('synapse_theme') || 'light',
};

// QCM généré par l'IA — null tant qu'aucune génération n'a été faite
let GENERATED_QUIZ = null;

function el(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function $(s, r=document){ return r.querySelector(s); }
function $$(s, r=document){ return [...r.querySelectorAll(s)]; }

function avatar(initials, color, cls=''){
  return `<div class="avatar ${cls}" style="background:${AVATAR_GRAD[color]||AVATAR_GRAD.mint}">${initials}</div>`;
}
function subjIcon(sub, size){
  const s = size ? `style="width:${size}px;height:${size}px"` : '';
  return `<div class="subj-ic ${COLOR_CLASS[sub.color]}" ${s}>${ic(sub.icon)}</div>`;
}
function ring(pct, cls='', label){
  return `<div class="ring ${cls}" style="--p:${pct}">${ic ? '' : ''}<b>${label!=null?label:pct+'%'}</b></div>`;
}
function chip(text, cls='', icon){ return `<span class="chip ${cls}">${icon?ic(icon):''}${text}</span>`; }

let toastTimer;
function toast(msg, icon='check'){
  let t = $('#toast');
  if(!t){ t = el(`<div class="toast" id="toast"></div>`); document.body.appendChild(t); }
  t.innerHTML = `${ic(icon)}<span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

function saveFavs(){ localStorage.setItem('synapse_favs', JSON.stringify([...App.favorites])); }

const NAV = [
  { id:'dashboard', label:'Accueil', icon:'home' },
  { id:'library', label:'Bibliothèque', icon:'library' },
  { id:'quiz', label:'QCM', icon:'quiz', badge:'2' },
  { id:'generator', label:'Générateur IA', icon:'sparkle' },
  { id:'summary', label:'Résumés', icon:'doc' },
  { id:'resources', label:'Ressources', icon:'play' },
  { id:'leaderboard', label:'Classement', icon:'trophy' },
  { id:'premium', label:'Passer Premium', icon:'star' },
];

function go(view, params={}){
  App.view = view; App.params = params;
  document.body.classList.remove('nav-open');
  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
  render();
  syncNav();
  try { history.replaceState(null,'', '#'+view); } catch(e){}
}

function syncNav(){
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === App.view));
  $$('.bn-item').forEach(n => n.classList.toggle('active', n.dataset.view === App.view));
}

const SCREENS = {};

function paintProgress(root=document){
  root.querySelectorAll('.progress > span').forEach(s => {
    const w = s.parentElement.style.getPropertyValue('--w');
    if(w !== '') s.style.width = w + '%';
  });
  root.querySelectorAll('[data-ring]').forEach(r => r.style.setProperty('--p', r.dataset.ring));
}

function render(){
  const fn = SCREENS[App.view] || SCREENS.dashboard;
  const content = $('#content');
  const out = fn(App.params);
  content.innerHTML = `<div class="view">${out.html}</div>`;
  paintProgress(content);
  if(out.init) out.init();
}

function applyTheme(){
  document.documentElement.setAttribute('data-theme', App.theme);
  const btn = $('#themeBtn');
  if(btn) btn.innerHTML = App.theme === 'dark' ? ic('sun') : ic('moon');
}
function toggleTheme(){
  App.theme = App.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('synapse_theme', App.theme);
  applyTheme();
  toast(App.theme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé', App.theme==='dark'?'moon':'sun');
}

function buildShell(){
  const sidebar = `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${ic('logo')}</div>
        <div>
          <div class="brand-name">Syn<b>apse</b></div>
          <div class="brand-sub">Révision · L1 Médecine</div>
        </div>
      </div>
      <div class="nav-group-label">Naviguer</div>
      ${NAV.map(n => `
        <button class="nav-item" data-view="${n.id}" onclick="go('${n.id}')">
          ${ic(n.icon)}<span>${n.label}</span>
          ${n.badge ? `<span class="nav-badge">${n.badge}</span>`:''}
        </button>`).join('')}
      <div class="sidebar-foot">
        <button class="nav-item" data-view="settings" onclick="toast('Réglages — bientôt disponible','settings')">${ic('settings')}<span>Réglages</span></button>
        <div class="user-card" onclick="go('leaderboard')">
          ${avatar(USER.initials,'mint')}
          <div>
            <div class="u-name">${USER.firstName} ${USER.lastName}</div>
            <div class="u-meta">${USER.promo}</div>
          </div>
        </div>
      </div>
    </aside>`;

  const topbar = `
    <header class="topbar">
      <button class="icon-btn menu-btn" onclick="document.body.classList.toggle('nav-open')">${ic('menu')}</button>
      <div class="search">${ic('search')}<input placeholder="Rechercher un cours, un chapitre, un QCM…" id="globalSearch"></div>
      <div class="topbar-spacer"></div>
      <button class="icon-btn" id="themeBtn" onclick="toggleTheme()" title="Thème">${ic('moon')}</button>
      <button class="icon-btn" onclick="toast('3 nouvelles notifications','bell')" title="Notifications">${ic('bell')}<span class="dot"></span></button>
    </header>`;

  const bottomNav = `
    <nav class="bottom-nav">
      <button class="bn-item" data-view="dashboard" onclick="go('dashboard')">${ic('home')}<span>Accueil</span></button>
      <button class="bn-item" data-view="library" onclick="go('library')">${ic('library')}<span>Cours</span></button>
      <button class="bn-item fab" data-view="generator" onclick="go('generator')"><span class="bn-ic">${ic('sparkle')}</span><span>Générer</span></button>
      <button class="bn-item" data-view="resources" onclick="go('resources')">${ic('play')}<span>Ressources</span></button>
      <button class="bn-item" data-view="leaderboard" onclick="go('leaderboard')">${ic('trophy')}<span>Classement</span></button>
    </nav>`;

  document.body.innerHTML = `
    <div class="nav-scrim" onclick="document.body.classList.remove('nav-open')"></div>
    <div class="app">
      ${sidebar}
      <div class="main">
        ${topbar}
        <main class="content" id="content"></main>
      </div>
    </div>
    ${bottomNav}`;
}

window.addEventListener('DOMContentLoaded', () => {
  buildShell();
  applyTheme();
  const hash = (location.hash||'').replace('#','');
  if(hash && SCREENS[hash]) App.view = hash;
  render();
  syncNav();
});
