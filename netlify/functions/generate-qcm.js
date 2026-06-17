/* Synapse — Netlify Function : génération de QCM via Gemini Flash */

const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { subject, chapter, count, difficulty } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Clé API Gemini non configurée.' })
      };
    }

    const chapStr = chapter ? `, chapitre : "${chapter}"` : ' (tous chapitres)';
    const prompt = `Tu es un professeur de médecine qui crée des QCM pour des étudiants de première année (L1) à l'Université Protestante au Congo (UPC), Kinshasa.

Génère exactement ${count} questions QCM en français sur la matière : "${subject}"${chapStr}.
Niveau de difficulté : ${difficulty}.
- Facile : définitions, terminologie, mémorisation directe
- Moyen : mécanismes, relations cause-effet, application simple
- Difficile : intégration de plusieurs notions, cas cliniques simples, raisonnement

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni texte autour. Format exact :
{"questions":[{"q":"Texte de la question","opts":["Option 1","Option 2","Option 3","Option 4"],"correct":1,"exp":"Explication de 1 à 2 phrases : pourquoi c'est correct et brièvement pourquoi les autres sont faux.","src":"${subject} · ${chapter || subject}"}]}

Règles importantes :
- "correct" est l'index (0, 1, 2 ou 3) de la bonne réponse dans "opts"
- Les 4 options doivent être médicalement plausibles, bien formulées
- Varie la position de la bonne réponse entre les questions
- Langage médical précis mais accessible à L1
- Aucun markdown, aucun texte en dehors du JSON`;

    const requestBody = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
    });

       const geminiResponse = await callGemini(apiKey, requestBody);

    if (geminiResponse.error) {
      throw new Error('Gemini error: ' + geminiResponse.error.message + ' (code ' + geminiResponse.error.code + ')');
    }

    const rawText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawText) {
      throw new Error('Gemini no text — cle invalide ou quota depasse.');
    }

    // Nettoie les éventuels blocs markdown que Gemini ajoute parfois
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Format de réponse inattendu de Gemini');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: parsed.questions })
    };

  } catch (err) {
    console.error('generate-qcm error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

function callGemini(apiKey, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
     path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Réponse Gemini non parseable : ' + data.slice(0, 200))); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
