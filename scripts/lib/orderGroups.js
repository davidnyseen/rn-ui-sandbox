// Splits a multi-phrase "build the sentence" step into one labelled row per English phrase.
//
// Kuttika (native speaker, TestFlight 2026-11-12): "Hello, what's your name? Thank you." as one long row of
// blanks is confusing — show it as
//     Hello: ___ ___
//     What's your name: ___ ___ ___
//     Thank you: ___ ___
// The prompt's sentences become the row labels. Which tiles belong to which row is worked out, not hand-authored:
// each English sentence is looked up in a phrase book of every taught phrase in the course (word intros, speak and
// multiple-choice steps, chat lines, one-sentence build steps — all of which carry their Thai parts), and the
// tiles must split into consecutive runs that each match their sentence's Thai. When that fails, a trailing
// polite particle (ครับ/ค่ะ/คะ) ending each phrase is used instead, but only if it gives exactly one run per
// sentence. Anything still ambiguous stays a single row, as before.
'use strict';

const PARTICLES = new Set(['ครับ', 'ค่ะ', 'คะ']);

// "Hello, what's your name? Thank you. (said by a man)" -> ['Hello', "What's your name?", 'Thank you.']
// A leading "Hello," / "Excuse me," / "Sorry," greeting counts as its own phrase.
// Phrases break at . ? ! and commas; a bare "Yes," / "No," stays with what follows ("No, it's not good" is one
// Thai phrase), and "a.m." / "p.m." aren't sentence ends.
function splitPrompt(prompt) {
  const p = prompt
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/\b([ap])\.m\./gi, '$1m')
    .trim();
  const out = [];
  for (const chunk of p.match(/[^.?!,]+[.?!,]*/g) || []) {
    const s = chunk.trim().replace(/,$/, '');
    if (!s) continue;
    const prev = out[out.length - 1];
    if (prev && /^(yes|no|ok)$/i.test(prev)) out[out.length - 1] = prev + ', ' + s;
    else if (prev && /^please[.!]?$/i.test(s)) out[out.length - 1] = prev + ', ' + s.toLowerCase();
    else out.push(s[0].toUpperCase() + s.slice(1));
  }
  return out;
}

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/\((said by a (?:man|woman)|[^)]*)\)/g, '')
    .replace(/[“”"'’.?!,—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// english (normalised) -> Set of Thai strings with the polite particles removed, so "Hello." matches
// สวัสดีครับ and สวัสดีค่ะ alike.
function buildPhraseBook(subjects) {
  const book = new Map();
  const add = (english, parts) => {
    if (!english || !parts || !parts.length) return;
    const k = norm(english);
    const thai = parts.filter((t) => !PARTICLES.has(t)).join('');
    if (!thai) return;
    if (!book.has(k)) book.set(k, new Set());
    book.get(k).add(thai);
    // "excuse me / sorry" style glosses: each alternative is a key too
    for (const alt of english.split('/')) if (alt.trim() && alt !== english) add(alt.trim(), parts);
  };
  for (const subject of subjects) {
    for (const les of subject.lessons) {
      if (les.kind === 'dialogue') continue;
      for (const st of les.steps) {
        if (st.type === 'wordIntro') add(st.word.english, [st.word.thai]);
        else if (st.type === 'wordIntroGroup') st.words.forEach((w) => add(w.english, [w.thai]));
        else if (st.type === 'speak') add(st.meaning, st.__parts);
        else if (st.type === 'translationChoice') add((st.options.find((o) => o.correct) || {}).text, st.__parts);
        else if (st.type === 'reply') (st.context || []).forEach((c) => add(c.english, c.parts));
        else if (st.type === 'sentenceOrder' && splitPrompt(st.prompt).length === 1)
          add(st.prompt, st.correctOrder.map((k) => st.words[k].thai));
      }
    }
  }
  return book;
}

// Split tiles (Thai strings, in order) into consecutive runs matching each sentence. Returns run sizes or null.
// At most one sentence may be "unknown" (not in the phrase book) — it takes whatever run is left between the
// others, which all have to match exactly.
function segmentByBook(tiles, sentences, book) {
  const content = (a, b) => tiles.slice(a, b).filter((t) => !PARTICLES.has(t)).join('');
  const go = (i, si, wildUsed) => {
    if (si === sentences.length) return i === tiles.length ? [] : null;
    const want = book.get(norm(sentences[si]));
    for (const wild of wildUsed ? [false] : [false, true]) {
      if (!wild && !want) continue;
      for (let j = i + 1; j <= tiles.length; j++) {
        const thai = content(i, j);
        if (!thai) continue;
        if (!wild && !want.has(thai)) continue;
        // a phrase's own trailing particle(s) belong to it
        let k = j;
        while (k < tiles.length && PARTICLES.has(tiles[k])) k++;
        for (const end of k > j ? [k, j] : [j]) {
          const rest = go(end, si + 1, wildUsed || wild);
          if (rest) return [end - i, ...rest];
        }
      }
    }
    return null;
  };
  return go(0, 0, false);
}

function segmentByParticles(tiles, count) {
  const sizes = [];
  let start = 0;
  tiles.forEach((t, i) => {
    if (PARTICLES.has(t) && !(i + 1 < tiles.length && PARTICLES.has(tiles[i + 1]))) {
      sizes.push(i + 1 - start);
      start = i + 1;
    }
  });
  if (start < tiles.length) sizes.push(tiles.length - start);
  return sizes.length === count ? sizes : null;
}

// Adds `groups: [{ label, size }]` to every multi-phrase sentenceOrder step it can split. Mutates and returns
// the subjects; also returns stats so a generator can print what it couldn't split.
function addOrderGroups(subjects, book) {
  const stats = { grouped: 0, single: 0, unsplit: [] };
  for (const subject of subjects) {
    for (const les of subject.lessons) {
      if (les.kind === 'dialogue') continue;
      for (const st of les.steps) {
        if (st.type !== 'sentenceOrder') continue;
        const sentences = splitPrompt(st.prompt);
        if (sentences.length < 2) {
          stats.single++;
          continue;
        }
        const tiles = st.correctOrder.map((k) => st.words[k].thai);
        const sizes = segmentByBook(tiles, sentences, book) || segmentByParticles(tiles, sentences.length);
        if (!sizes) {
          stats.unsplit.push(`${subject.id}/${les.id}: ${st.prompt}`);
          continue;
        }
        // lists of single words ("Father, mother", "Eight, nine, ten") read fine as one row
        if (sizes.some((n) => n < 2)) {
          stats.single++;
          continue;
        }
        st.groups = sentences.map((s, i) => ({ label: s.replace(/[.,]+$/, ''), size: sizes[i] }));
        stats.grouped++;
      }
    }
  }
  return stats;
}

// The phrase book always covers the whole course (raw authoring content, which still has its __parts), so a
// unit can split a phrase taught in an earlier unit.
let courseBook = null;
function wholeCourseBook() {
  if (courseBook) return courseBook;
  const dir = '../courseContent/';
  const all = [
    ...require(dir + 'greetings').greetingsSubjects,
    require(dir + 'restaurant').restaurantSubject,
    require(dir + 'basics').basicsSubject,
    require(dir + 'family').familySubject,
    require(dir + 'numbers').numbersSubject,
    require(dir + 'travel').travelSubject,
  ];
  return (courseBook = buildPhraseBook(all));
}

// For the seed generators: group one finished subject's build steps (unit quiz copies included).
function withOrderGroups(subject) {
  const stats = addOrderGroups([subject], wholeCourseBook());
  if (stats.unsplit.length) console.log(`[${subject.id}] build steps left as one row: ${stats.unsplit.length}`);
  return subject;
}

module.exports = { splitPrompt, buildPhraseBook, addOrderGroups, withOrderGroups };
