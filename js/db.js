/* Synapse — Supabase : scores et classement */

const SUPA_URL = 'https://arkyptjxmecmqgcablvt.supabase.co';
const SUPA_KEY = 'sb_publishable_H2aBUi9v0-EL6Zehqju4iA_Eu-sjS2V';

let _supa;
function getSupa() {
  if (!_supa) {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      _supa = supabase.createClient(SUPA_URL, SUPA_KEY);
    } else {
      throw new Error('Supabase SDK non chargé');
    }
  }
  return _supa;
}

function getPseudo() {
  return localStorage.getItem('synapse_pseudo') || null;
}

async function submitScore(subject, correct, total) {
  const pseudo = getPseudo();
  if (!pseudo) return;
  try {
    const score = Math.round(correct / total * 100);
    const { error } = await getSupa().from('score').insert({ pseudo, subject, score, correct, total });
    if (error) console.warn('submitScore:', error.message);
  } catch(e) {
    console.warn('Score non envoyé :', e.message);
  }
}

async function uploadCourse(file, subjectId, chapterId, title) {
  const pseudo = getPseudo() || 'Anonyme';
  try {
    const supa = getSupa();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${subjectId}/${chapterId}/${Date.now()}-${safeName}`;
    const { data: upload, error: uploadErr } = await supa.storage
      .from('course-pdfs')
      .upload(path, file, { contentType: 'application/pdf', upsert: false });
    if (uploadErr) throw uploadErr;
    const { data: urlData } = supa.storage.from('course-pdfs').getPublicUrl(upload.path);
    const { error: insertErr } = await supa.from('course_files').insert({
      subject: subjectId, chapter: chapterId, title,
      file_path: urlData.publicUrl, uploaded_by: pseudo
    });
    if (insertErr) throw insertErr;
    return true;
  } catch(e) {
    console.warn('Upload échoué :', e.message);
    return false;
  }
}

async function fetchCourses(subjectId, chapterId) {
  try {
    const supa = getSupa();
    const { data, error } = await supa
      .from('course_files')
      .select('id, subject, chapter, title, file_path, uploaded_by, created_at')
      .eq('subject', subjectId)
      .eq('chapter', chapterId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.warn('Cours non chargés :', e.message);
    return [];
  }
}

/* ── Freemium ── */

const FREE_QCM_PER_DAY = 3;
let _premiumCache = null;

async function checkPremium() {
  if (_premiumCache !== null) return _premiumCache;
  const pseudo = getPseudo();
  if (!pseudo) { _premiumCache = false; return false; }
  try {
    const { data } = await getSupa()
      .from('payments')
      .select('id')
      .eq('pseudo', pseudo)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .limit(1);
    _premiumCache = !!(data && data.length > 0);
    return _premiumCache;
  } catch(e) { _premiumCache = false; return false; }
}

function resetPremiumCache() { _premiumCache = null; }

function getGenUsageToday() {
  const stored = JSON.parse(localStorage.getItem('synapse_gen_today') || '{}');
  const today = new Date().toISOString().slice(0, 10);
  return stored.date === today ? (stored.count || 0) : 0;
}

function incrementGenUsage() {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('synapse_gen_today', JSON.stringify({ date: today, count: getGenUsageToday() + 1 }));
}

async function canGenQcm() {
  if (await checkPremium()) return true;
  return getGenUsageToday() < FREE_QCM_PER_DAY;
}

async function submitPayment(phone, operator, transactionRef, amount) {
  const pseudo = getPseudo();
  if (!pseudo) return { error: 'Pseudo requis — configure ton pseudo dans le classement d\'abord' };
  try {
    const { error } = await getSupa().from('payments').insert({ pseudo, phone, operator, transaction_ref: transactionRef, amount });
    if (error) throw error;
    return { ok: true };
  } catch(e) { return { error: e.message }; }
}

async function fetchAllPayments() {
  try {
    const { data, error } = await getSupa()
      .from('payments').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    return data || [];
  } catch(e) { console.warn('Paiements non chargés:', e.message); return []; }
}

async function fetchLeaderboard() {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout : classement non chargé en 8s')), 8000)
  );
  try {
    const supa = getSupa();
    const query = supa
      .from('score')
      .select('pseudo, subject, score, correct, total, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    const { data, error } = await Promise.race([query, timeoutPromise]);
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.warn('Classement non chargé :', e.message);
    return [];
  }
}
