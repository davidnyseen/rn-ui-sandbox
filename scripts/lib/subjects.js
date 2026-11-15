// Puts "I" into the Thai wherever the English says it (Kuttika, native-speaker tester, 2026-11-15: "in English
// there's a subject (I, you, we) but in Thai there's no subject ... my instinct looks for the same kind of word ...
// put 'I' in Thai like phǒm/chán (I) pai hǎa phɯ̂an").
//
// Everyday Thai drops "I" when it's obvious, and the course's sentences were written that way, so the English
// "I'm going to see a friend" sat over ไปหาเพื่อน with nothing to match "I". Rather than hand-edit ~90 sentences,
// this runs at build time over every drill: when the English starts with I / I'm / I'd / I'll / I've and the Thai
// has no ผม / ฉัน / เรา, it adds one at the front —
//   - ผม (phǒm) when the sentence ends in ครับ or the speaker is a man, ฉัน (chán) for ค่ะ/คะ or a woman;
//   - otherwise alternating, and a build-the-sentence prompt then says who is speaking ("(said by a man)"),
//     since its tiles have to add up to one answer.
// ผม and ฉัน are taught in the very first lessons (greetings gh02, with a rule card), so every unit can use them.
// Conversations (dialogue lessons) are left as written: there the speakers' lines are real speech, and their
// fill-in-the-blank questions are built from those exact lines. Listening steps are left too: adding a pronoun to
// the right answer alone would give it away.
'use strict';

const PRON = { M: { thai: 'ผม', roman: 'phǒm' }, F: { thai: 'ฉัน', roman: 'chán' } };
const SAYS_I = /^(I|I'm|I'd|I'll|I've)\b/;
const HAS_SUBJECT = /ผม|ฉัน|เรา/;

function genderOf(thai, speaker, flip) {
  if (speaker === 'M' || speaker === 'F') return speaker;
  if (/ครับ/.test(thai)) return 'M';
  if (/ค่ะ|คะ/.test(thai)) return 'F';
  return flip();
}

function addSubjects(subject) {
  let n = 0;
  const flip = () => (n++ % 2 === 0 ? 'M' : 'F');
  const needs = (thai, english) => !!thai && !!english && SAYS_I.test(english.trim()) && !HAS_SUBJECT.test(thai);
  const front = (obj, g) => {
    const p = PRON[g];
    obj.thai = p.thai + obj.thai;
    if (obj.roman) obj.roman = `${p.roman} ${obj.roman}`;
    if (Array.isArray(obj.parts)) obj.parts = [p.thai, ...obj.parts];
  };

  for (const les of subject.lessons) {
    if (les.kind === 'dialogue' || !Array.isArray(les.steps)) continue;
    for (const st of les.steps) {
      if (st.type === 'translationChoice') {
        const right = (st.options || []).find((o) => o.correct);
        if (needs(st.thai, right && right.text)) front(st, genderOf(st.thai, null, flip));
      } else if (st.type === 'speak') {
        if (needs(st.thai, st.meaning)) front(st, genderOf(st.thai, null, flip));
      } else if (st.type === 'sentenceOrder') {
        const thai = st.correctOrder.map((k) => st.words[k].thai).join('');
        if (!needs(thai, st.prompt)) continue;
        const g = genderOf(thai, null, flip);
        const key = 'subj';
        st.words[key] = { thai: PRON[g].thai, roman: PRON[g].roman };
        st.correctOrder = [key, ...st.correctOrder];
        // in the pool among the other tiles, not always first
        const at = Math.min(st.poolOrder.length, 1 + (st.poolOrder.length % 3));
        st.poolOrder = [...st.poolOrder.slice(0, at), key, ...st.poolOrder.slice(at)];
        if (!/\(said by/.test(st.prompt)) st.prompt = `${st.prompt} (said by a ${g === 'M' ? 'man' : 'woman'})`;
      } else if (st.type === 'reply') {
        for (const line of st.context || []) if (needs(line.thai, line.english)) front(line, genderOf(line.thai, line.speaker, flip));
        if (needs(st.thai, st.english)) {
          const g = genderOf(st.thai, st.replySpeaker, flip);
          const right = (st.options || []).find((o) => o.correct && o.thai === st.thai);
          front(st, g);
          if (right) front(right, g);
        }
      }
    }
  }
  return subject;
}

module.exports = { addSubjects };
