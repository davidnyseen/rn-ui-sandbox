// Rebuilds a lesson's exercises from a short list of real phrases (2026-11-08), so every unit matches lesson 1
// ("Hello!"): rules and new-word cards stay exactly as authored, then multiple choice, build-the-sentence and speak
// steps over short phrases, plus one reply() chat exchange — instead of unrelated clauses chained with gàp/láew-gɔ̂ɔ.
//
// A phrase is 'thai tokens separated by spaces|English', e.g. 'พ่อ แม่ อยู่ บ้าน|My parents are at home.'. Each token
// must be a word some wordIntro in the course teaches (checkDictionary still enforces "taught before tested"); its
// romanization is looked up from that wordIntro, so spellings can't drift from the word cards.
'use strict';

const { mc, order, speak, reply, lesson } = require('./courseBuilder');

function romanTable(subjects) {
  const table = new Map();
  for (const s of subjects) {
    for (const les of s.lessons) {
      for (const step of les.steps || []) {
        if (step.type === 'wordIntro') table.set(step.word.thai, step.word.roman);
        if (step.type === 'wordIntroGroup') for (const w of step.words) table.set(w.thai, w.roman);
      }
    }
  }
  return table;
}

function parse(spec, roman) {
  const [thaiPart, english] = spec.split('|');
  const tokens = thaiPart.trim().split(/\s+/);
  for (const t of tokens) if (!roman.has(t)) throw new Error(`phraseLessons: no word card teaches "${t}" (in "${spec}")`);
  return { tokens, thai: tokens.join(''), roman: tokens.map((t) => roman.get(t)).join(' '), english: english.trim() };
}

// rewrites: { lessonId: { phrases: [spec...], reply?: { q: spec, a: spec, wrong: [thaiSpec, thaiSpec] }, speaker? } }
function rewriteLessons(lessons, rewrites, roman) {
  return lessons.map((les) => {
    const plan = rewrites[les.id];
    if (!plan) return les;
    const kept = les.steps.filter((s) => s.type === 'rule' || s.type === 'wordIntro' || s.type === 'wordIntroGroup');
    const src = (kept.find((s) => s.source) || les.steps.find((s) => s.source) || {}).source;
    const ps = plan.phrases.map((p) => parse(p, roman));
    const pool = [...new Set([...ps.map((p) => p.english), ...(plan.extraEnglish || [])])];
    const wrongFor = (p) => {
      const others = pool.filter((e) => e !== p.english);
      while (others.length < 3) others.push(['Thank you.', 'Excuse me.', 'Good luck.'][others.length]);
      return others.slice(0, 3);
    };
    const out = [...kept];
    const kinds = ['mc', 'order', 'mc', 'speak', 'order', 'speak', 'mc'];
    ps.forEach((p, i) => {
      let kind = kinds[i % kinds.length];
      if (kind === 'order' && p.tokens.length < 2) kind = 'mc';
      if (kind === 'mc') out.push(mc(p.thai, p.roman, p.english, wrongFor(p), p.tokens, src));
      else if (kind === 'order') out.push(order(p.english, p.tokens.map((t) => ({ roman: roman.get(t), thai: t })), src));
      else out.push(speak(p.thai, p.roman, p.english, p.tokens, src));
    });
    out.push(speak(ps[0].thai, ps[0].roman, ps[0].english, ps[0].tokens, src));
    if (plan.reply) {
      const q = parse(plan.reply.q, roman);
      const a = parse(plan.reply.a, roman);
      const wrong = plan.reply.wrong.map((w) => parse(w + '|-', roman));
      out.push(reply(
        [
          { speaker: 'M', thai: q.thai, roman: q.roman, english: q.english, parts: q.tokens },
          { speaker: 'F', thai: a.thai, roman: a.roman, english: a.english, parts: a.tokens },
        ],
        wrong.map((w) => ({ thai: w.thai, roman: w.roman, parts: w.tokens })),
        src
      ));
    }
    const rebuilt = lesson(les.id, les.title, out);
    return rebuilt;
  });
}

module.exports = { romanTable, rewriteLessons };
