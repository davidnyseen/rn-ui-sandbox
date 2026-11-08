// Small helper factories for authoring course_lessons content (see
// src/courseTypes.ts for the shapes these produce) plus the dictionary
// check: a mechanical guarantee that no step ever tests a Thai word/phrase
// the learner hasn't already been shown by an earlier wordIntro step.
//
// __parts on translationChoice/speak steps is authoring-only metadata (not
// part of the app's CourseStep type) — it's the list of already-introduced
// Thai tokens/phrases the step's sentence is built from, declared by
// whoever writes the lesson. checkDictionary() verifies every part was
// actually introduced earlier, and that concatenating the parts reproduces
// the sentence exactly (so the declaration can't drift from the truth).
// stripAuthoringFields() removes it before the content is seeded to
// Supabase, since the app never reads it.
'use strict';

let counter = 0;
function id(prefix) {
  counter += 1;
  return `${prefix}-${counter}`;
}

function wordIntro(thai, roman, english, source) {
  return { id: id('wi'), type: 'wordIntro', word: { thai, roman, english }, source };
}

// Teaches two words on one screen instead of two separate wordIntro taps —
// words: [{thai, roman, english}, ...] (2 max; keeps the screen readable).
function wordIntroGroup(words, source) {
  return { id: id('wig'), type: 'wordIntroGroup', words, source };
}

function rule(title, body, source) {
  return { id: id('rule'), type: 'rule', title, body, source };
}

// distractors: plain array of wrong English strings (pulled from meanings
// already taught earlier in the course, so they're plausible near-misses).
// Options are shuffled with a seed derived from the step's own id, so the
// correct answer doesn't always land in the same position (it used to
// always be first) — deterministic so regenerating seed SQL from unchanged
// content produces byte-identical output instead of reshuffling every run.
function mc(thaiFull, roman, correctText, distractors, parts, source) {
  const stepId = id('mc');
  let seed = hashStr(stepId);
  const nextRand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const options = [{ text: correctText, correct: true }, ...distractors.map((d) => ({ text: d, correct: false }))];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    id: stepId,
    type: 'translationChoice',
    thai: thaiFull,
    roman,
    options,
    source,
    __parts: parts,
  };
}

// tiles: [{ roman, thai }] in correct-order. Builds a deterministic
// scrambled pool (reversed, or rotated if reversing is a no-op).
function order(prompt, tiles, source, tileUnit = 'word') {
  const words = {};
  const correctOrder = [];
  tiles.forEach((t, i) => {
    const key = String.fromCharCode(97 + i);
    words[key] = { roman: t.roman, thai: t.thai };
    correctOrder.push(key);
  });
  let poolOrder = [...correctOrder].reverse();
  if (poolOrder.join('') === correctOrder.join('') && correctOrder.length > 1) {
    poolOrder = [...correctOrder.slice(1), correctOrder[0]];
  }
  return { id: id('so'), type: 'sentenceOrder', prompt, tileUnit, words, poolOrder, correctOrder, source };
}

function speak(thai, roman, meaning, parts, source) {
  return { id: id('sp'), type: 'speak', thai, roman, meaning, source, __parts: parts };
}

// Thai audio plays with no text shown; the learner picks the matching
// sentence by ear out of [correct, ...distractors]. Every distractor is
// {thai, roman, parts} — same shape as reply()'s distractors — so a
// distractor must be a real, already-taught phrase, never invented text.
// Meant for longer, later-lesson sentences (a one-word listen check isn't
// much of a listening exercise) — see LESSON_AUTHORING_GUIDE.md.
function listen(thai, roman, meaning, parts, distractors, source) {
  const stepId = id('ls');
  let seed = hashStr(stepId);
  const nextRand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const options = [{ thai, roman, correct: true }, ...distractors.map((d) => ({ thai: d.thai, roman: d.roman, correct: false }))];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    id: stepId,
    type: 'listenChoice',
    thai,
    roman,
    meaning,
    options,
    source,
    __parts: parts,
    __distractorParts: distractors.map((d) => ({ thai: d.thai, parts: d.parts })),
  };
}

// A short chat-style exchange: `lines` is the lead-in conversation — one or
// more {speaker, thai, roman, english, parts} lines, in order — and the
// learner picks how the LAST line would be answered, out of [correct reply,
// ...distractors]. Every line's `parts` is its own word/phrase breakdown,
// checked the same way as every other graded step's (every token must
// already be wordIntro'd). Each distractor is {thai, roman, parts} too, so a
// distractor can be any real, previously-taught phrase (a single word or a
// multi-word one) as long as it's the wrong fit for this particular
// exchange.
function reply(lines, distractors, source) {
  const stepId = id('rp');
  let seed = hashStr(stepId);
  const nextRand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const last = lines[lines.length - 1];
  const context = lines.slice(0, -1).map(({ speaker, thai, parts, roman, english }) => ({ speaker, thai, parts, roman, english }));
  const options = [{ thai: last.thai, roman: last.roman, correct: true }, ...distractors.map((d) => ({ thai: d.thai, roman: d.roman, correct: false }))];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    id: stepId,
    type: 'reply',
    context,
    replySpeaker: last.speaker,
    thai: last.thai,
    roman: last.roman,
    english: last.english,
    options,
    source,
    __linesParts: lines.map((l) => ({ thai: l.thai, parts: l.parts })),
    __distractorParts: distractors.map((d) => ({ thai: d.thai, parts: d.parts })),
  };
}

// A short multi-line exchange, meant to go at the end of a subject —
// recombines vocab already taught earlier rather than teaching anything new.
// Structurally identical to the legacy hand-authored dialogue units in
// src/data.ts (kind/title/scene/lines/steps) so DialogueLessonScreen renders
// it without any changes. Passes through checkDictionary/
// interleaveWordIntros/addOrderDistractors/stripAuthoringFields unchanged —
// none of those recognize `dialogue`'s step type names (intro/comprehension/
// translate/blank/speak), so they no-op on it exactly like they no-op on
// any other step type they don't special-case.
function dialogue(lessonId, title, scene, lines, steps) {
  return { id: lessonId, kind: 'dialogue', title, scene, lines, steps };
}

// FNV-1a-style string hash, used only to seed a deterministic pick of decoy
// tiles per step — not for anything security-sensitive. Deterministic (not
// Math.random) so regenerating seed SQL from unchanged content produces byte
// -identical output instead of shuffling distractors every run.
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Adds `count` already-taught decoy tiles to every sentenceOrder step's pool
// (never to correctOrder), so building a sentence means picking the right
// tiles out of a set that includes wrong ones — not just un-scrambling a
// pool that's guaranteed to be 100% correct tiles. Decoys are always pulled
// from words a wordIntro has already taught earlier in the same subject, so
// this can never surface an untaught word (checkDictionary already
// validates every value in step.words, decoys included, so run this before
// the final checkDictionary pass in a generator script).
// `introduced` (thai -> roman) may be passed in so a later subject in a
// chained sequence can draw decoy tiles from an earlier subject's vocab too
// — see checkDictionary's `introduced` param for the chaining convention.
function addOrderDistractors(courseSubject, count = 2, introduced = new Map()) {
  return {
    ...courseSubject,
    lessons: courseSubject.lessons.map((les) => ({
      ...les,
      steps: les.steps.map((step) => {
        if (step.type === 'wordIntro') {
          introduced.set(step.word.thai, step.word.roman);
          return step;
        }
        if (step.type !== 'sentenceOrder') return step;
        const usedThai = new Set(Object.values(step.words).map((w) => w.thai));
        const candidates = [...introduced.entries()].filter(([thai]) => !usedThai.has(thai));
        if (candidates.length === 0) return step;
        let seed = hashStr(`${les.id}/${step.id}`);
        const nextRand = () => {
          seed = (seed + 0x6d2b79f5) | 0;
          let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        const pool = [...candidates];
        const picked = [];
        while (picked.length < count && pool.length > 0) {
          const idx = Math.floor(nextRand() * pool.length);
          picked.push(pool.splice(idx, 1)[0]);
        }
        const words = { ...step.words };
        const decoyKeys = [];
        picked.forEach(([thai, roman]) => {
          let key = `x${decoyKeys.length}`;
          let n = 0;
          while (words[key]) {
            n += 1;
            key = `x${decoyKeys.length}${n}`;
          }
          words[key] = { thai, roman };
          decoyKeys.push(key);
        });
        const poolOrder = [...step.poolOrder, ...decoyKeys];
        for (let i = poolOrder.length - 1; i > 0; i -= 1) {
          const j = Math.floor(nextRand() * (i + 1));
          [poolOrder[i], poolOrder[j]] = [poolOrder[j], poolOrder[i]];
        }
        return { ...step, words, poolOrder };
      }),
    })),
  };
}

// Every non-dialogue lesson with 2+ new words automatically gets a
// tap-to-match review game appended at the end, built from exactly the
// words that lesson's own wordIntro/wordIntroGroup steps taught — no
// per-lesson authoring, and no way for it to drift out of sync with the
// lesson's actual vocabulary.
function matchGame(words, source) {
  return {
    id: id('match'),
    type: 'match',
    pairs: words.map(({ thai, roman, english }) => ({ thai, roman, english })),
    source,
  };
}

function lesson(lessonId, title, steps) {
  const words = [];
  let firstSource;
  for (const s of steps) {
    if (s.type === 'wordIntro') { words.push(s.word); firstSource = firstSource || s.source; }
    else if (s.type === 'wordIntroGroup') { words.push(...s.words); firstSource = firstSource || s.source; }
  }
  const withMatch = words.length >= 2 ? [...steps, matchGame(words, firstSource)] : steps;
  return { id: lessonId, title, steps: withMatch };
}

function subject(subjectId, title, roman, description, lessons) {
  return { id: subjectId, title, roman, description, lessons };
}

// Walks every lesson/step in course order, maintaining the set of Thai
// strings introduced so far, and throws with a precise location the first
// time a step tests something not yet taught. This is what makes the
// "introduce a word before testing it" rule an enforced invariant of the
// content rather than something hoped for during authoring.
//
// `introduced` may be passed in (and is mutated + returned) so a sequence of
// subjects that are meant to share one running vocabulary — e.g. two units
// split out of what used to be a single subject — can chain calls:
// `const seen = new Set(); checkDictionary(unitA, seen); checkDictionary(unitB, seen);`
// so unitB's steps can freely reuse words unitA already taught.
function checkDictionary(courseSubject, introduced = new Set()) {
  for (const les of courseSubject.lessons) {
    // Dialogue lessons (see dialogue()) reuse step type names ('speak' in
    // particular) that collide with the vocab-lesson step types below, but
    // carry no __parts declaration — same leniency as the legacy hand-
    // authored dialogue units in src/data.ts, which also aren't
    // dictionary-checked.
    if (les.kind === 'dialogue') continue;
    for (const step of les.steps) {
      if (step.type === 'wordIntro') {
        introduced.add(step.word.thai);
        continue;
      }
      if (step.type === 'wordIntroGroup') {
        for (const w of step.words) introduced.add(w.thai);
        continue;
      }
      if (step.type === 'rule') continue;
      if (step.type === 'sentenceOrder') {
        for (const tile of Object.values(step.words)) {
          if (!introduced.has(tile.thai)) {
            throw new Error(
              `[${courseSubject.id}/${les.id}/${step.id}] sentenceOrder tile "${tile.thai}" (${tile.roman}) used before any wordIntro taught it`
            );
          }
        }
        continue;
      }
      // Shared by every step type that declares a {thai, parts} pair —
      // verifies parts joins back to thai exactly and every part was
      // already taught. `label` is just for the error message.
      const checkParts = (label, thai, parts) => {
        if (!parts || parts.length === 0) {
          throw new Error(`[${courseSubject.id}/${les.id}/${step.id}] ${label} is missing a parts declaration`);
        }
        const joined = parts.join('');
        if (joined !== thai) {
          throw new Error(
            `[${courseSubject.id}/${les.id}/${step.id}] ${label} parts ${JSON.stringify(parts)} joins to "${joined}", not "${thai}"`
          );
        }
        for (const part of parts) {
          if (!introduced.has(part)) {
            throw new Error(`[${courseSubject.id}/${les.id}/${step.id}] ${label} uses "${part}" before any wordIntro taught it`);
          }
        }
      };
      if (step.type === 'translationChoice' || step.type === 'speak') {
        checkParts(step.type, step.thai, step.__parts);
        continue;
      }
      if (step.type === 'listenChoice') {
        checkParts(step.type, step.thai, step.__parts);
        for (const d of step.__distractorParts || []) {
          checkParts(`${step.type} distractor "${d.thai}"`, d.thai, d.parts);
        }
        continue;
      }
      if (step.type === 'reply') {
        const linesParts = step.__linesParts || [];
        if (linesParts.length === 0) {
          throw new Error(`[${courseSubject.id}/${les.id}/${step.id}] reply step is missing __linesParts declaration`);
        }
        for (const l of linesParts) checkParts('reply line', l.thai, l.parts);
        for (const d of step.__distractorParts || []) {
          checkParts(`reply distractor "${d.thai}"`, d.thai, d.parts);
        }
      }
    }
  }
  return introduced;
}

// __parts is renamed to `parts` here (not stripped) — the app displays it
// space-joined so a beginner can see word boundaries in Thai script, which
// has none natively. `thai` itself stays the continuous, authentic string
// (used for TTS/audio lookup and the dictionary-safety check).
function stripAuthoringFields(courseSubject) {
  return {
    ...courseSubject,
    lessons: courseSubject.lessons.map((les) => ({
      ...les,
      steps: les.steps.map(({ __parts, __linesParts, __distractorParts, ...rest }) => {
        const out = __parts ? { ...rest, parts: __parts } : rest;
        // reply()'s runtime `parts` is the last conversation line's breakdown
        // (the correct reply being tested) — everything before it only
        // exists to render `context`, already plain data on the step.
        return __linesParts ? { ...out, parts: __linesParts[__linesParts.length - 1].parts } : out;
      }),
    })),
  };
}

// Reorders each lesson's steps so no more than `maxConsecutive` wordIntro
// steps ever run back-to-back: as soon as enough new words are on the board
// to satisfy some later graded step's dependencies (its __parts, or its
// sentenceOrder tiles), that step is pulled forward — teach a couple of
// words, test them, teach a couple more, test again. `introduced` tracks
// words across the WHOLE subject (in final scheduled order) so a step can
// freely depend on words taught in earlier lessons; only within-lesson new
// words count toward the run limit. Falls back to flushing any stranded
// content steps if one depends on 3+ words never taught elsewhere (a sign
// that step's sentence itself needs to be split at authoring time — this
// function can only reorder, not invent easier sentences).
//
// `introduced` may be passed in (and is mutated as this subject's own words
// are taught) so a later subject in a chained sequence — see
// checkDictionary's `introduced` param — starts already knowing every word
// an earlier subject taught, and can schedule review content against it
// from lesson one instead of only its own new words.
function interleaveWordIntros(courseSubject, maxConsecutive = 2, introduced = new Set()) {
  const depsOf = (step) => {
    if (step.type === 'rule') return [];
    if (step.type === 'match') return step.pairs.map((p) => p.thai);
    if (step.type === 'sentenceOrder') return Object.values(step.words).map((w) => w.thai);
    if (step.type === 'reply' || step.type === 'listenChoice') {
      const lineDeps = (step.__linesParts || []).flatMap((l) => l.parts || []);
      const distractorDeps = (step.__distractorParts || []).flatMap((d) => d.parts || []);
      return [...(step.__parts || []), ...lineDeps, ...distractorDeps];
    }
    return step.__parts || [];
  };
  const wordsOf = (wi) => (wi.type === 'wordIntro' ? [wi.word.thai] : wi.words.map((w) => w.thai));
  const lessons = courseSubject.lessons.map((les) => {
    const wiQueue = les.steps.filter((s) => s.type === 'wordIntro' || s.type === 'wordIntroGroup');
    const contentQueue = les.steps
      .filter((s) => s.type !== 'wordIntro' && s.type !== 'wordIntroGroup')
      .map((step) => ({ step, deps: depsOf(step) }));
    const out = [];
    let streak = 0;
    while (wiQueue.length > 0 || contentQueue.length > 0) {
      const idx = contentQueue.findIndex(({ deps }) => deps.every((d) => introduced.has(d)));
      if (idx !== -1) {
        out.push(contentQueue.splice(idx, 1)[0].step);
        streak = 0;
        continue;
      }
      if (wiQueue.length > 0 && (streak < maxConsecutive || contentQueue.length === 0)) {
        const wi = wiQueue.shift();
        for (const thai of wordsOf(wi)) introduced.add(thai);
        out.push(wi);
        streak += 1;
        continue;
      }
      if (wiQueue.length > 0) {
        // Capped, but some content step is still stuck waiting on a word
        // that isn't coming until later steps place-lock — this can only
        // happen if a step's dependency set spans more than maxConsecutive
        // brand-new words. Relax the cap rather than deadlock.
        const wi = wiQueue.shift();
        for (const thai of wordsOf(wi)) introduced.add(thai);
        out.push(wi);
        streak += 1;
        continue;
      }
      // No word intros left and nothing placeable — dependency on a word
      // this subject never teaches; checkDictionary should already have
      // caught this earlier in the pipeline. Flush as a fallback.
      out.push(...contentQueue.map((c) => c.step));
      contentQueue.length = 0;
    }
    return { ...les, steps: out };
  });
  return { ...courseSubject, lessons };
}

module.exports = {
  wordIntro,
  wordIntroGroup,
  rule,
  mc,
  order,
  speak,
  listen,
  reply,
  dialogue,
  lesson,
  subject,
  checkDictionary,
  stripAuthoringFields,
  addOrderDistractors,
  interleaveWordIntros,
  hashStr,
};
