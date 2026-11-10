// Compact, human-readable dump of every lesson for a language review: one line per item, Thai | roman | English.
const { lessons, subjects } = require('../src/generated/courseContent.json');
const out = {};
const order = subjects.sort((a, b) => a.sort_order - b.sort_order);
for (const s of order) {
  const ls = lessons.filter((l) => l.subject_id === s.id).sort((a, b) => a.sort_order - b.sort_order);
  const lines = [`# ${s.id} — ${s.title}`];
  for (const l of ls) {
    lines.push(`\n## L${l.sort_order} ${l.title}`);
    const st = l.steps;
    if (st && st.kind === 'dialogue') {
      lines.push(`scene: ${st.scene}`);
      st.lines.forEach((x, i) => lines.push(`  D${i} ${x.speaker}: ${x.thai} | ${x.roman} | ${x.english}`));
      for (const q of st.steps) {
        if (q.type === 'intro' || q.type === 'speak') continue;
        const opts = (q.options || []).map((o) => (o.correct ? '*' : '') + o.text + (o.meaning ? `(${o.meaning})` : '')).join(' / ');
        lines.push(`  ${q.type} D${q.lineIndex}${q.before !== undefined ? ` "${q.before} ___ ${q.after}"` : ''}: ${opts}`);
      }
      continue;
    }
    for (const q of (Array.isArray(st) ? st : st.steps || [])) {
      switch (q.type) {
        case 'rule': lines.push(`  RULE ${q.title}: ${q.body}`); break;
        case 'wordIntro': lines.push(`  NEW ${q.word.thai} | ${q.word.roman} | ${q.word.english}${q.word.note ? ' ('+q.word.note+')' : ''}`); break;
        case 'wordIntroGroup': q.words.forEach((w) => lines.push(`  NEW ${w.thai} | ${w.roman} | ${w.english}`)); break;
        case 'translationChoice': lines.push(`  CHOICE ${q.thai} | ${q.roman}: ${q.options.map((o) => (o.correct ? '*' : '') + o.text).join(' / ')}`); break;
        case 'listenChoice': lines.push(`  LISTEN ${q.meaning}: ${q.options.map((o) => (o.correct ? '*' : '') + o.thai + ' ' + o.roman).join(' / ')}`); break;
        case 'speak': lines.push(`  SPEAK ${q.thai} | ${q.roman} | ${q.meaning}`); break;
        case 'sentenceOrder': lines.push(`  BUILD "${q.prompt}" = ${q.correctOrder.map((k) => q.words[k].thai + '(' + q.words[k].roman + ')').join(' ')}  [extra: ${q.poolOrder.filter((k) => !q.correctOrder.includes(k)).map((k) => q.words[k].roman).join(', ')}]`); break;
        case 'reply': lines.push(`  CHAT ${q.context.map((c) => c.speaker + ':' + c.parts.join(' ') + '(' + c.roman + '=' + c.english + ')').join(' → ')} → reply as ${q.replySpeaker} "${q.english}": ${q.options.map((o) => (o.correct ? '*' : '') + o.thai + '(' + o.roman + ')').join(' / ')}`); break;
        case 'match': lines.push(`  MATCH ${q.pairs.map((p) => p.thai + '=' + p.english).join(', ')}`); break;
        default: lines.push(`  ${q.type} ${JSON.stringify(q).slice(0, 200)}`);
      }
    }
  }
  out[s.id] = lines.join('\n');
}
for (const [k, v] of Object.entries(out)) require('fs').writeFileSync(`${__dirname}/${k}.txt`, v + '\n');
console.log(Object.entries(out).map(([k, v]) => k + ' ' + v.split('\n').length).join('\n'));
