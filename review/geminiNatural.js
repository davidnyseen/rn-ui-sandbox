// Second Gemini pass (2026-11-12): not "is it wrong" but "is this how a Thai person actually says it?".
// Saves review/gemini/<unit>.natural.md. Usage: node review/geminiNatural.js [unit ...]
const fs = require('fs');
const path = require('path');
const https = require('https');
const KEY = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
const PROMPT = `You are a native Thai speaker from Bangkok helping a beginner app for foreigners (tourists/expats) sound like real everyday spoken Thai. Below is one unit. Each line: Thai | romanization | English. NEW = word taught, RULE = grammar note, CHOICE/LISTEN = multiple choice (* = correct), BUILD = sentence built from tiles, CHAT = conversation then pick the reply, MATCH = pairs, D0..Dn = dialogue lines.

For EVERY Thai sentence or phrase, ask: would a Thai person really say exactly this, in this situation, to a stranger/shop owner/friend as described? Flag only lines where a native would clearly say it differently — stiff textbook phrasing, word order a Thai wouldn't use, missing or wrong particles (ครับ/ค่ะ/คะ/นะ), odd politeness level, unnatural combinations of two sentences, a translation that doesn't match how the Thai is used.

Rules for your fixes:
- Keep the same meaning and roughly the same words — the app can only use words the learner has been taught, so prefer changes that reorder, drop, or swap a particle over adding new vocabulary. If a new word is unavoidable, say so.
- Do NOT flag lines that are already natural, alternative-but-equally-natural phrasings, or romanization style.

Answer as a markdown table: Line (copy the Thai exactly) | Why a native wouldn't say it | Natural version (Thai + romanization + English) | New words needed (or "none"). If everything is natural, say so.

UNIT:

`;
function post(body) {
  return new Promise((resolve, reject) => {
    const req = https.request('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY }, timeout: 20 * 60 * 1000 }, (r) => {
        let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => resolve({ status: r.statusCode, json: JSON.parse(d) }));
      });
    req.on('timeout', () => req.destroy(new Error('timeout'))); req.on('error', reject);
    req.end(JSON.stringify(body));
  });
}
async function run(unit) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { status, json } = await post({ contents: [{ parts: [{ text: PROMPT + fs.readFileSync(path.join(__dirname, unit + '.txt'), 'utf8') }] }] });
    if (status < 300) {
      const text = json.candidates[0].content.parts.map((p) => p.text || '').join('');
      fs.writeFileSync(path.join(__dirname, 'gemini', unit + '.natural.md'), `# Naturalness pass (gemini-3-flash-preview) — ${unit}\n\n${text}\n`);
      return console.log('done', unit);
    }
    console.log(unit, status, json.error && json.error.message.slice(0, 80));
    await new Promise((r) => setTimeout(r, 30000));
  }
}
const units = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(__dirname).filter((f) => f.endsWith('.txt')).map((f) => f.slice(0, -4));
Promise.all(units.map(run));
