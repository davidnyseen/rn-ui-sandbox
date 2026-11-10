// Writes review/thai-review-sheet.csv: every distinct Thai line in the course (Thai, romanization, English, where it
// appears), for a native-speaker check. Items Claude was unsure about are flagged in the "Please check" column.
const fs = require('fs');
const { lessons, subjects } = require('../src/generated/courseContent.json');
const FLAGS = {
  'ไปเที่ยวแล้วก็สนุกมาก': 'Natural? Meant: "Went out, and it was a lot of fun."',
  'ขอโทษค่ะไม่เป็นไรค่ะ': 'Shown as one line, but it is really two people (sorry / never mind). OK as a learning item?',
  'ขอโทษครับไม่เป็นไรครับ': 'Same as above, male version.',
  'เค้าเป็นคนไทยแล้วก็สบายดี': 'Natural? Meant: "He/she is Thai and (is) well."',
  'คุณชื่ออะไรแล้วก็สบายดีเหรอ': 'Joining two questions with แล้วก็ — natural?',
  'คุณกินข้าวรึยังผมยังไม่กินข้าวครับ': 'Should it be ยังไม่ได้กินข้าว?',
  'เค้า': 'Colloquial spelling of เขา — fine for a beginner app, or teach เขา?',
  'กินเผ็ดมั้ย': 'Or กินเผ็ดได้มั้ย?',
  'เอาตั๋วไปกรุงเทพฯ': 'Or ขอตั๋วไปกรุงเทพฯ (more polite)?',
  'ไปรถเมล์': 'Natural for "I\'m going by bus", or นั่งรถเมล์ไป?',
  'เอาสอง': 'Needs a classifier (เอาสองอัน)?',
  'ไม่ใส่เนื้อ': 'Taught as "No beef" (เนื้อ = beef on menus). Correct?',
  'ฉันไม่กินเนื้อ': 'Taught as "I don\'t eat beef". Correct?',
  'แพง มีเงินสองร้อยบาท': 'Rewritten haggle line — natural?',
  'สองร้อยบาท เอากี่ตัว': 'Rewritten haggle line — natural?',
  'มี ห้องนี้ได้มั้ย': 'Rewritten hotel line — natural?',
  'หล่อ แล้วก็รวยมาก': 'Answering เค้าหล่อมั้ย by repeating หล่อ — natural?',
  'คะ': 'Taught as the women\'s particle after นะ and in questions (นะคะ, not นะค่ะ).',
};
const rows = new Map();
const add = (thai, roman, english, where) => {
  if (!thai) return;
  const r = rows.get(thai) || { thai, roman, english, where: new Set() };
  r.where.add(where);
  rows.set(thai, r);
};
const subjTitle = Object.fromEntries(subjects.map((s) => [s.id, s.title]));
const order = Object.fromEntries(subjects.map((s) => [s.id, s.sort_order]));
for (const l of [...lessons].sort((a, b) => order[a.subject_id] - order[b.subject_id] || a.sort_order - b.sort_order)) {
  const where = `${subjTitle[l.subject_id]} — lesson ${l.sort_order + 1}`;
  const st = l.steps;
  if (st && st.kind === 'dialogue') { st.lines.forEach((x) => add(x.thai, x.roman, x.english, where + ' (conversation)')); continue; }
  for (const q of st) {
    if (q.type === 'wordIntro') add(q.word.thai, q.word.roman, q.word.english, where);
    else if (q.type === 'translationChoice') add(q.thai, q.roman, (q.options.find((o) => o.correct) || {}).text, where);
    else if (q.type === 'speak') add(q.thai, q.roman, q.meaning, where);
    else if (q.type === 'sentenceOrder') add(q.correctOrder.map((k) => q.words[k].thai).join(''), q.correctOrder.map((k) => q.words[k].roman).join(' '), q.prompt, where);
    else if (q.type === 'reply') { q.context.forEach((c) => add(c.parts.join(''), c.roman, c.english, where + ' (chat)')); const o = q.options.find((x) => x.correct); add(o.thai, o.roman, q.english, where + ' (chat)'); }
    else if (q.type === 'match') q.pairs.forEach((p) => add(p.thai, p.roman, p.english, where));
  }
}
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const lines = [['Thai', 'Romanization', 'English (as taught)', 'Where', 'Please check', 'Reviewer: OK? / correction'].map(esc).join(',')];
for (const r of rows.values()) lines.push([r.thai, r.roman, r.english, [...r.where].join('; '), FLAGS[r.thai] || '', ''].map(esc).join(','));
fs.writeFileSync(`${__dirname}/thai-review-sheet.csv`, '﻿' + lines.join('\r\n') + '\r\n');
console.log(`${rows.size} lines, ${Object.keys(FLAGS).filter((k) => rows.has(k)).length}/${Object.keys(FLAGS).length} flags matched`);
console.log(Object.keys(FLAGS).filter((k) => !rows.has(k)).join(' | '));
