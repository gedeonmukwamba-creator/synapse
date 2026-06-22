/* Synapse — Activation paiement Premium (admin only) */

const https = require('https');

const SUPA_URL = 'arkyptjxmecmqgcablvt.supabase.co';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { paymentId, adminKey, action } = JSON.parse(event.body);

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Non autorisé' }) };
    }

    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Service key manquante' }) };

    if (action === 'reject') {
      await patchPayment(serviceKey, paymentId, { status: 'rejected' });
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await patchPayment(serviceKey, paymentId, { status: 'active', expires_at: expiresAt });

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };

  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

function patchPayment(serviceKey, paymentId, patch) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(patch);
    const options = {
      hostname: SUPA_URL,
      path: `/rest/v1/payments?id=eq.${paymentId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey': serviceKey,
        'Authorization': 'Bearer ' + serviceKey,
        'Prefer': 'return=minimal'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
