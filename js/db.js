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
    const { error } = await getSupa().from('scores').insert({ pseudo, subject, score, correct, total });
    if (error) console.warn('submitScore:', error.message);
  } catch(e) {
    console.warn('Score non envoyé :', e.message);
  }
}

async function fetchLeaderboard() {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout : classement non chargé en 8s')), 8000)
  );
  try {
    const supa = getSupa();
    const query = supa
      .from('scores')
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
