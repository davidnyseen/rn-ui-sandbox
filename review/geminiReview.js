// Sends each unit dump (review/<unit>.txt, from dump.js) to Gemini for a native-speaker-style check and saves the
// answer to review/gemini/<unit>.md. Needs GEMINI_API_KEY in .env. Usage: node review/geminiReview.js [unit ...]
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const KEY = (env.match(/^GEMINI_API_KEY=(.*)$/m) || [])[1]?.trim();
if (!KEY) throw new Error('GEMINI_API_KEY missing from .env');
// The free key has no quota for the Pro models; the best Flash first, then a fallback.
const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.8-flash,gemini-3-flash-preview').split(',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PROMPT = `You are a native Thai speaker and an experienced teacher of Thai to English speakers. Below is one unit of a beginner Thai course app (spoken Thai for travellers/expats). Each line is: Thai | romanization | English. Line types: NEW = word taught, RULE = grammar note, CHOICE/LISTEN = multiple choice (* marks the correct option, the others are distractors), BUILD = sentence the learner assembles from word tiles [extra = decoy tiles], CHAT = short conversation then the learner picks the right reply, MATCH = word pairs, D0..Dn = lines of a dialogue with its quiz questions.

Go through EVERY line, one by one. List ONLY definite mistakes, i.e. things a native speaker would say are wrong:
- wrong or misspelled Thai
- wrong meaning / English translation
- romanization that gives the wrong tone or vowel length
- unnatural Thai that a Thai person would never say (including awkward joins with แล้วก็, odd question particles, things nobody says in that situation)
- wrong gender particle (ครับ/ค่ะ/คะ) for the speaker
- a quiz where a distractor is ALSO a correct answer, or the starred answer is wrong
- grammar rules that are incorrect

Do NOT list style preferences, romanization-system choices, or "could also say" alternatives.

Answer as a markdown table: Line (copy the Thai) | Problem | Exact fix (Thai + romanization + English). Then one line: how confident you are overall. If there are no definite errors, say so.

UNIT:

`;

function post(url, body) {
  const https = require('https');
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY }, timeout: 20 * 60 * 1000 }, (r) => {
      let data = '';
      r.on('data', (c) => (data += c));
      r.on('end', () => {
        try {
          resolve({ ok: r.statusCode < 300, status: r.statusCode, json: JSON.parse(data) });
        } catch (e) {
          reject(new Error('bad JSON, status ' + r.statusCode));
        }
      });
    });
    req.on('timeout', () => req.destroy(new Error('timed out after 20 min')));
    req.on('error', reject);
    req.end(JSON.stringify(body));
  });
}

async function review(unit) {
  const text = fs.readFileSync(path.join(__dirname, unit + '.txt'), 'utf8');
  let json, MODEL, lastErr;
  for (MODEL of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      // plain https, not fetch: fetch gives up after 5 minutes without response headers, and a big unit can
      // take Gemini longer than that to think through
      let res;
      try {
        res = await post(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
          contents: [{ role: 'user', parts: [{ text: PROMPT + text }] }],
        });
      } catch (e) {
        lastErr = `${MODEL}: ${e.message}`;
        continue;
      }
      json = res.json;
      if (res.ok) break;
      lastErr = `${MODEL} ${res.status}: ${json.error?.message?.slice(0, 120)}`;
      json = null;
      if (res.status === 404 || res.status === 400) break;
      await sleep(20000);
    }
    if (json) break;
  }
  if (!json) throw new Error(unit + ': ' + lastErr);
  const answer = json.candidates[0].content.parts.map((p) => p.text || '').join('');
  const out = path.join(__dirname, 'gemini', unit + '.md');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `# Gemini (${MODEL}) — ${unit}, ${new Date().toISOString().slice(0, 10)}\n\n${answer}\n`);
  console.log('done', unit, MODEL, answer.length, 'chars');
}

const units = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(__dirname).filter((f) => f.endsWith('.txt')).map((f) => f.slice(0, -4));
(async () => {
  for (const u of units) {
    try { await review(u); } catch (e) { console.error(e.message); }
  }
})();
