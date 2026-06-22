/* Synapse — Premium & Admin */

const PAYMENT_PHONE = '0815319253'; // ← mets ton numéro Mobile Money ici
const PAYMENT_PRICE = '5 USD';
const PAYMENT_DAYS = 30;

SCREENS.premium = function() {
  const used = getGenUsageToday();
  const left = Math.max(0, FREE_QCM_PER_DAY - used);

  const html = `
    <div class="greet" style="margin-bottom:8px">
      <div>
        <h1>${ic('star')} Synapse Premium</h1>
        <p class="lead">Révise sans limites avec le contenu réel de tes cours.</p>
      </div>
    </div>

    <div class="plan-grid">
      <div class="card plan-card plan-free">
        <div class="plan-label">Gratuit</div>
        <div class="plan-price">0 $</div>
        <ul class="plan-features">
          <li>${ic('check')} ${FREE_QCM_PER_DAY} QCM générés / jour</li>
          <li>${ic('check')} Bibliothèque PDF</li>
          <li>${ic('check')} Classement</li>
          <li class="dim">${ic('xCircle')} QCM illimités</li>
        </ul>
        <div class="plan-usage">Il te reste <b>${left}/${FREE_QCM_PER_DAY}</b> QCM aujourd'hui</div>
      </div>
      <div class="card plan-card plan-premium">
        <div class="plan-badge">Recommandé</div>
        <div class="plan-label">Premium</div>
        <div class="plan-price">${PAYMENT_PRICE} <span>/ ${PAYMENT_DAYS} jours</span></div>
        <ul class="plan-features">
          <li>${ic('check')} QCM illimités</li>
          <li>${ic('check')} QCM depuis tes PDFs</li>
          <li>${ic('check')} Bibliothèque PDF</li>
          <li>${ic('check')} Classement</li>
        </ul>
      </div>
    </div>

    <div class="card pay-card" style="margin-top:20px">
      <h2 style="margin-bottom:4px">Payer via Mobile Money</h2>
      <p style="color:var(--muted);font-size:14px;margin-bottom:20px">Envoie ${PAYMENT_PRICE} au numéro ci-dessous, puis entre ton code de transaction.</p>

      <div class="pay-number-box">
        <span style="font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Numéro de paiement</span>
        <div style="font-family:var(--font-display);font-size:26px;font-weight:700;margin-top:4px;color:var(--ink)">${PAYMENT_PHONE}</div>
        <div style="font-size:13px;color:var(--muted);margin-top:4px">Orange Money · Airtel Money · M-Pesa</div>
      </div>

      <div style="margin-top:22px">
        <div class="field">
          <label class="modal-label">Opérateur utilisé</label>
          <div class="opt-row" id="op-row">
            ${['Orange','Airtel','M-Pesa'].map(op =>
              `<button class="opt-pill" onclick="selectOperator(this,'${op}')">${op}</button>`
            ).join('')}
          </div>
        </div>

        <div class="field" style="margin-top:14px">
          <label class="modal-label">Ton numéro de téléphone</label>
          <input type="tel" id="pay-phone" class="modal-input" placeholder="0XX XXX XXXX">
        </div>

        <div class="field" style="margin-top:14px">
          <label class="modal-label">Code de transaction</label>
          <input type="text" id="pay-ref" class="modal-input" placeholder="Ex: MP240622XXXX">
        </div>

        <div class="field" style="margin-top:14px">
          <label class="modal-label">Montant envoyé</label>
          <input type="text" id="pay-amount" class="modal-input" placeholder="Ex: 5 USD ou 14000 CDF">
        </div>

        <button class="btn btn-accent btn-lg btn-block" style="margin-top:22px" onclick="submitPremiumPayment()">
          ${ic('check')} Soumettre mon paiement
        </button>
      </div>

      <div style="display:flex;align-items:center;gap:12px;margin:22px 0">
        <div style="flex:1;height:1px;background:var(--line)"></div>
        <span style="color:var(--muted);font-size:13px;font-weight:600">ou</span>
        <div style="flex:1;height:1px;background:var(--line)"></div>
      </div>

      <button class="btn btn-soft btn-lg btn-block" onclick="toast('CinetPay sera disponible très bientôt !','sparkle')" style="opacity:.7">
        Payer avec CinetPay (bientôt disponible)
      </button>
    </div>`;

  return { html };
};

let _selectedOp = '';
function selectOperator(btn, op) {
  _selectedOp = op;
  document.querySelectorAll('#op-row .opt-pill').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

async function submitPremiumPayment() {
  const phone = document.getElementById('pay-phone')?.value.trim();
  const ref = document.getElementById('pay-ref')?.value.trim();
  const amount = document.getElementById('pay-amount')?.value.trim();

  if (!_selectedOp) { toast('Choisis un opérateur', 'warn'); return; }
  if (!phone) { toast('Entre ton numéro de téléphone', 'warn'); return; }
  if (!ref) { toast('Entre le code de transaction', 'warn'); return; }
  if (!amount) { toast('Entre le montant envoyé', 'warn'); return; }
  if (!getPseudo()) { toast('Configure ton pseudo dans le Classement d\'abord', 'warn'); go('leaderboard'); return; }

  const btn = document.querySelector('.pay-card .btn-accent');
  if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }

  const result = await submitPayment(phone, _selectedOp, ref, amount);

  if (result.ok) {
    toast('Paiement soumis ! Activation sous 24h maximum.', 'check');
    document.querySelector('.pay-card').innerHTML = `
      <div style="text-align:center;padding:32px 16px">
        <div style="width:64px;height:64px;border-radius:20px;background:var(--accent-soft);color:var(--accent-strong);display:grid;place-items:center;margin:0 auto 16px">${ic('check')}</div>
        <h2>Paiement reçu !</h2>
        <p style="color:var(--muted);margin-top:8px">Ton compte sera activé sous 24h. Tu recevras une confirmation au prochain chargement de l'app.</p>
        <button class="btn btn-soft" style="margin-top:20px" onclick="go('dashboard')">Retour à l'accueil</button>
      </div>`;
  } else {
    toast('Erreur : ' + result.error, 'warn');
    if (btn) { btn.disabled = false; btn.innerHTML = ic('check') + ' Soumettre mon paiement'; }
  }
}

/* ── Admin Panel ── */

SCREENS.admin = function() {
  const adminKey = sessionStorage.getItem('synapse_admin_key');

  if (!adminKey) {
    const html = `
      <div style="max-width:400px;margin:60px auto 0">
        <div class="card" style="padding:32px">
          <h2 style="margin-bottom:4px">Admin Synapse</h2>
          <p style="color:var(--muted);font-size:14px;margin-bottom:20px">Accès réservé à l'administrateur</p>
          <label class="modal-label">Mot de passe</label>
          <input type="password" id="admin-pwd" class="modal-input" placeholder="••••••••"
            onkeydown="if(event.key==='Enter')adminLogin()">
          <button class="btn btn-accent btn-block" style="margin-top:16px" onclick="adminLogin()">
            ${ic('arrowRight')} Accéder
          </button>
        </div>
      </div>`;
    return { html };
  }

  const html = `
    <div class="greet" style="margin-bottom:8px">
      <div><h1>Admin · Paiements</h1></div>
      <button class="btn btn-ghost btn-sm" onclick="sessionStorage.removeItem('synapse_admin_key');render()">Déconnexion</button>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:16px">
      <button class="filter-chip active" onclick="adminFilter('all',this)">Tous</button>
      <button class="filter-chip" onclick="adminFilter('pending',this)">En attente</button>
      <button class="filter-chip" onclick="adminFilter('active',this)">Activés</button>
    </div>
    <div id="admin-payments"><div class="card pdf-loading">Chargement…</div></div>`;

  return { html, init: async function() {
    const payments = await fetchAllPayments();
    renderAdminPayments(payments, 'all');
  }};
};

function adminLogin() {
  const pwd = document.getElementById('admin-pwd')?.value;
  if (!pwd) return;
  sessionStorage.setItem('synapse_admin_key', pwd);
  render();
}

let _allPayments = [];
let _adminFilter = 'all';

async function adminFilter(filter, btn) {
  _adminFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAdminPayments(_allPayments, filter);
}

function renderAdminPayments(payments, filter) {
  _allPayments = payments;
  const container = document.getElementById('admin-payments');
  if (!container) return;

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  if (!filtered.length) {
    container.innerHTML = `<div class="card pdf-empty">${ic('check')} Aucun paiement ici.</div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const date = new Date(p.created_at).toLocaleDateString('fr-FR', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    const statusBadge = {
      pending: `<span style="color:#a9760a;font-weight:700;font-size:12px">En attente</span>`,
      active:  `<span style="color:var(--accent-strong);font-weight:700;font-size:12px">Actif</span>`,
      rejected:`<span style="color:var(--coral);font-weight:700;font-size:12px">Rejeté</span>`,
    }[p.status] || '';

    return `<div class="card admin-payment-row">
      <div class="ap-info">
        <div class="ap-pseudo">${p.pseudo} ${statusBadge}</div>
        <div class="ap-meta">${p.operator} · ${p.phone} · Réf: <b>${p.transaction_ref}</b> · ${p.amount}</div>
        <div class="ap-date">${date}</div>
      </div>
      ${p.status === 'pending' ? `
        <div style="display:flex;gap:8px;flex:none">
          <button class="btn btn-accent btn-sm" onclick="doActivate('${p.id}',true)">Activer</button>
          <button class="btn btn-ghost btn-sm" onclick="doActivate('${p.id}',false)">Rejeter</button>
        </div>` : ''}
    </div>`;
  }).join('');
}

async function doActivate(paymentId, activate) {
  const adminKey = sessionStorage.getItem('synapse_admin_key');
  const resp = await fetch('/.netlify/functions/activate-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, adminKey, action: activate ? 'activate' : 'reject' })
  });
  const data = await resp.json();
  if (data.ok) {
    toast(activate ? 'Compte activé pour 30 jours' : 'Paiement rejeté', activate ? 'check' : 'warn');
    const payments = await fetchAllPayments();
    renderAdminPayments(payments, _adminFilter);
  } else {
    toast('Erreur : ' + (data.error || 'Vérifier le mot de passe'), 'warn');
  }
}
