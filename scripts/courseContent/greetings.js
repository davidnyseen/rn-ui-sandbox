// "Hello & Everyday Phrases" and "Names, Small Talk & Goodbyes" — two units
// split out of what used to be one 22-lesson "Everyday Greetings & Small
// Talk" subject. Split point matches the source textbook's own chapter
// break: Essential Thai: A Guide to the Basics of the Thai Language by
// James Higbie (2nd ed., Orchid Press), pp.22-25 (First Things: greetings,
// going places, yes/no questions, politeness) for unit A, pp.38-41
// (Questions and Expressions: names, how are you, where you're from,
// nationality, age, goodbye) for unit B. Every step still cites its exact
// source page. Thai script, romanization, and English meanings are all
// copied from the source, not invented.
//
// Romanization reuses the diacritic convention already used elsewhere in
// this app (à/á/â/ǎ for low/high/falling/rising tones, ɔ/ɛ/ɯ for open
// vowels) rather than Higbie's own plain-letter-plus-underline system.
// Words that recur from src/data.ts or scripts/courseContent/restaurant.js
// (sà-wàt-dii, khun, chɯ̂ɯ, à-rai, phǒm, chán, mɯang-thai, mii, mâi) reuse
// those exact spellings.
//
// Pacing rule (as of the 2026 rewrite): at most 5 new words per lesson, and
// no exercise sentence chains unrelated clauses together (e.g. no more
// "thanks a lot, AND it's very beautiful" mashups joining two full
// sentences with gàp/láew-gɔ̂ɔ just to reuse vocabulary). An earlier pass
// had merged the original 22 single-purpose lessons down to ~15-25-step
// lessons with invented cumulative sentences for review; those merges were
// unwound back toward the original per-lesson word counts, and any
// multi-clause "review" sentence was replaced with either a short real
// phrase straight from the cited textbook page or dropped. Connecting
// words (gàp/láew-gɔ̂ɔ) are still taught, but only tested in isolation or in
// the one real short phrase that needs them — not used to bolt lessons'
// vocabulary together into longer sentences. checkDictionary (run by
// generateSeedSqlGreetings.js) still verifies every single word/phrase part
// traces back to an earlier wordIntro, chained across both units so unit B
// can freely reuse unit A's vocabulary.
'use strict';

const { wordIntro, rule, mc, order, speak, reply, dialogue, lesson, subject } = require('../lib/courseBuilder');

const SRC = {
  hello: 'Essential Thai (Higbie), p.22',
  places: 'Essential Thai (Higbie), p.23',
  questions1: 'Essential Thai (Higbie), p.24',
  polite: 'Essential Thai (Higbie), p.25',
  name: 'Essential Thai (Higbie), p.38',
  howAreYou: 'Essential Thai (Higbie), p.39',
  nationality: 'Essential Thai (Higbie), p.40',
  goodbye: 'Essential Thai (Higbie), p.41',
  connector: 'Essential Thai (Higbie), general reference (connecting words)',
};

// =====================================================================
// UNIT A — "Hello & Everyday Phrases" (Higbie pp.22-25)
// =====================================================================

const helloLessons = [
  lesson('gh01', 'Hello!', [
    rule(
      'Polite particles',
      'Thai has polite words added to the end of a question, response, or statement: khráp for men; for women, khâ ' +
        'after statements and answers and khá after questions. They make ' +
        'it sound more polite. They are used with people older than you, or whenever you want to sound polite — for example, ' +
        'when first meeting someone.',
      SRC.hello
    ),
    wordIntro('สวัสดี', 'sà-wàt-dii', 'hello', SRC.hello),
    wordIntro('ค่ะ', 'khâ', 'polite particle (said by women)', SRC.hello),
    wordIntro('ครับ', 'khráp', 'polite particle (said by men)', SRC.hello),
    mc('สวัสดีค่ะ', 'sà-wàt-dii khâ', 'Hello. (said by a woman)', ['Thank you.', 'Excuse me.', 'Good luck.'], ['สวัสดี', 'ค่ะ'], SRC.hello),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
      ],
      [
        { thai: 'ครับ', roman: 'khráp', parts: ['ครับ'] },
        { thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', parts: ['สวัสดี', 'ครับ'] },
      ],
      SRC.hello
    ),
    speak('สวัสดีค่ะ', 'sà-wàt-dii khâ', 'Hello. (said by a woman)', ['สวัสดี', 'ค่ะ'], SRC.hello),
    mc('สวัสดีครับ', 'sà-wàt-dii khráp', 'Hello. (said by a man)', ['Good luck.', 'How are you?', 'Thank you.'], ['สวัสดี', 'ครับ'], SRC.hello),
    order('Hello. (said by a woman)', [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khâ', thai: 'ค่ะ' },
    ], SRC.hello),
    speak('สวัสดีครับ', 'sà-wàt-dii khráp', 'Hello. (said by a man)', ['สวัสดี', 'ครับ'], SRC.hello),
    mc('ค่ะ', 'khâ', 'Polite particle (said by a woman).', ['Polite particle (said by a man).', 'Hello.', 'Thank you.'], ['ค่ะ'], SRC.hello),
    mc('ครับ', 'khráp', 'Polite particle (said by a man).', ['Polite particle (said by a woman).', 'Hello.', 'Thank you.'], ['ครับ'], SRC.hello),
    // p.22 lists "Where are you going?" (pai nǎi) as greeting #2, right
    // under sà-wàt-dii (greeting #1) — same page, same SRC.hello already
    // cited above, not a foreign import. Introduced here now instead of in
    // gh02 so lesson 1 isn't 11 exercises drilling the same 2-3 words.
    wordIntro('ไป', 'pai', 'go', SRC.hello),
    wordIntro('ไหน', 'nǎi', 'where', SRC.hello),
    mc('ไปไหน', 'pai nǎi', 'Where are you going?', ['Hello.', 'Good luck.', "What's your name?"], ['ไป', 'ไหน'], SRC.hello),
    order('Where are you going?', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'nǎi', thai: 'ไหน' },
    ], SRC.hello),
  ]),

  lesson('gh02', 'Where are you going?', [
    wordIntro('เที่ยว', 'thîao', 'go out / travel around', SRC.hello),
    wordIntro('หา', 'hǎa', 'look for / see (someone)', SRC.hello),
    wordIntro('เพื่อน', 'phɯ̂an', 'friend', SRC.hello),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'ไปไหน', roman: 'pai nǎi', english: 'Where are you going?', parts: ['ไป', 'ไหน'] },
      ],
      [
        { thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', parts: ['สวัสดี', 'ครับ'] },
        { thai: 'ครับ', roman: 'khráp', parts: ['ครับ'] },
        { thai: 'ค่ะ', roman: 'khâ', parts: ['ค่ะ'] },
      ],
      SRC.hello
    ),
    order("I'm going out/traveling around.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'thîao', thai: 'เที่ยว' },
    ], SRC.hello),
    speak('ไปไหน', 'pai nǎi', 'Where are you going?', ['ไป', 'ไหน'], SRC.hello),
    mc('ไปเที่ยว', 'pai thîao', "I'm going out/traveling around.", ['Where are you going?', 'Hello.', 'Thank you.'], ['ไป', 'เที่ยว'], SRC.hello),
    speak('ไปเที่ยว', 'pai thîao', "I'm going out/traveling around.", ['ไป', 'เที่ยว'], SRC.hello),
    // Same textbook line-up as "pai thîao" above (p.22-23's list of "pai
    // ___" sentences) — "pai hǎa phɯ̂an" ("go see a friend") is real, not
    // invented, and keeps this lesson's "pai + verb" pattern going.
    order("I'm going to see a friend.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'hǎa', thai: 'หา' },
      { roman: 'phɯ̂an', thai: 'เพื่อน' },
    ], SRC.hello),
    mc('ไปหาเพื่อน', 'pai hǎa phɯ̂an', "I'm going to see a friend.", ['Where are you going?', "I'm going out/traveling around.", 'Hello.'], ['ไป', 'หา', 'เพื่อน'], SRC.hello),
    speak('ไปหาเพื่อน', 'pai hǎa phɯ̂an', "I'm going to see a friend.", ['ไป', 'หา', 'เพื่อน'], SRC.hello),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'ไปไหน', roman: 'pai nǎi', english: 'Where are you going?', parts: ['ไป', 'ไหน'] },
        { speaker: 'F', thai: 'ไปเที่ยว', roman: 'pai thîao', english: "I'm going out/traveling around.", parts: ['ไป', 'เที่ยว'] },
      ],
      [
        { thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', parts: ['สวัสดี', 'ค่ะ'] },
        { thai: 'ครับ', roman: 'khráp', parts: ['ครับ'] },
      ],
      SRC.hello
    ),
    mc('สวัสดีครับ', 'sà-wàt-dii khráp', 'Hello. (said by a man)', ['Where are you going?', "I'm going out.", 'Thank you.'], ['สวัสดี', 'ครับ'], SRC.hello),
    order('Hello. (said by a woman)', [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khâ', thai: 'ค่ะ' },
    ], SRC.hello),
    mc('เที่ยว', 'thîao', 'go out / travel around', ['go', 'where', 'hello'], ['เที่ยว'], SRC.hello),
    mc('หา', 'hǎa', 'look for / see (someone)', ['go out / travel around', 'go', 'friend'], ['หา'], SRC.hello),
    mc('เพื่อน', 'phɯ̂an', 'friend', ['look for / see (someone)', 'go out / travel around', 'home'], ['เพื่อน'], SRC.hello),
  ]),

  lesson('gh03', 'Good, or not?', [
    rule(
      'Yes/no questions with mái',
      'To make a simple question like "is it good?", put mái (high tone) after the word. Answer "yes" by repeating the word, ' +
        'or "no" by putting mâi (falling tone) before it.',
      SRC.places
    ),
    wordIntro('ดี', 'dii', 'good', SRC.places),
    // ไปไหน is "where are you going?" — asking about a trip that already happened is ไปไหนมา (Gemini review 2026-11-12)
    wordIntro('มา', 'maa', 'come (back) — pai nǎi maa: where have you been?', SRC.howAreYou),
    wordIntro('มั้ย', 'mái', 'question particle: is it ___?', SRC.places),
    mc('ดีมั้ย', 'dii mái', 'Is it good?', ['Is it fun?', 'Where are you going?', 'Hello.'], ['ดี', 'มั้ย'], SRC.places),
    order('Is it good?', [
      { roman: 'dii', thai: 'ดี' },
      { roman: 'mái', thai: 'มั้ย' },
    ], SRC.places),
    speak('ดีมั้ย', 'dii mái', 'Is it good?', ['ดี', 'มั้ย'], SRC.places),
    wordIntro('ไม่', 'mâi', 'not / no', SRC.places),
    mc('ไม่ดี', 'mâi dii', "No, it's not good.", ["Yes, it's good.", 'Is it good?', 'Where are you going?'], ['ไม่', 'ดี'], SRC.places),
    order("No, it's not good.", [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'dii', thai: 'ดี' },
    ], SRC.places),
    mc('ไม่', 'mâi', 'not / no', ['good', 'question particle: is it ___?', 'hello'], ['ไม่'], SRC.places),
    // Both reply()s below now open with the "where are you going / going
    // out" exchange from gh02 (verbatim) before asking how it was — a
    // longer, natural "how was your outing" conversation instead of "is it
    // good?" appearing with no lead-in.
    // Thai verbs carry no tense marking — "pai thîao" is exactly as valid
    // for "I went out" as "I'm going out"; glossed as past tense here (only
    // in this exchange) so the follow-up "dii mái?" reads as asking about a
    // trip that already happened, not one that hasn't started yet.
    reply(
      [
        { speaker: 'M', thai: 'ไปไหนมา', roman: 'pai nǎi maa', english: 'Where have you been?', parts: ['ไป', 'ไหน', 'มา'] },
        { speaker: 'F', thai: 'ไปเที่ยวมา', roman: 'pai thîao maa', english: 'I went out.', parts: ['ไป', 'เที่ยว', 'มา'] },
        { speaker: 'M', thai: 'ดีมั้ย', roman: 'dii mái', english: 'Was it good?', parts: ['ดี', 'มั้ย'] },
        { speaker: 'F', thai: 'ดี', roman: 'dii', english: 'Good.', parts: ['ดี'] },
      ],
      [
        { thai: 'ไม่ดี', roman: 'mâi dii', parts: ['ไม่', 'ดี'] },
        { thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', parts: ['สวัสดี', 'ครับ'] },
        { thai: 'ไปเที่ยว', roman: 'pai thîao', parts: ['ไป', 'เที่ยว'] },
      ],
      SRC.places
    ),
    mc('ดี', 'dii', 'good', ['not / no', 'question particle: is it ___?', 'hello'], ['ดี'], SRC.places),
    // Deliberately a different lead-in than the "dii" reply() above (not the
    // same pai nǎi/pai thîao exchange reused verbatim) so the two branches
    // of "dii mái?" don't open on an identical duplicated conversation.
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'ไปเที่ยวมาดีมั้ย', roman: 'pai thîao maa, dii mái', english: 'Was your trip good?', parts: ['ไป', 'เที่ยว', 'มา', 'ดี', 'มั้ย'] },
        { speaker: 'F', thai: 'ไม่ดี', roman: 'mâi dii', english: "No, it's not good.", parts: ['ไม่', 'ดี'] },
      ],
      [
        { thai: 'ดี', roman: 'dii', parts: ['ดี'] },
        { thai: 'ไปเที่ยว', roman: 'pai thîao', parts: ['ไป', 'เที่ยว'] },
        { thai: 'ไปไหน', roman: 'pai nǎi', parts: ['ไป', 'ไหน'] },
      ],
      SRC.places
    ),
    speak('ไม่ดี', 'mâi dii', "No, it's not good.", ['ไม่', 'ดี'], SRC.places),
  ]),

  // p.23: "I'm going to eat" (pai gin kao) / "I'm going home" (glap ban) —
  // bâan added so "glàp bâan" (go home) is the real 2-word textbook phrase
  // instead of bare "glàp". Split back down to 4 new words (was merged to
  // 6 with the connectors lesson below; re-split per the 5-word cap).
  lesson('gh04', 'Eating, and going home', [
    wordIntro('กิน', 'gin', 'eat', SRC.hello),
    wordIntro('ข้าว', 'khâao', 'rice', SRC.hello),
    wordIntro('กลับ', 'glàp', 'return / go back', SRC.hello),
    wordIntro('บ้าน', 'bâan', 'home / house', SRC.hello),
    mc('กิน', 'gin', 'eat', ['go', 'where', 'good'], ['กิน'], SRC.hello),
    mc('ข้าว', 'khâao', 'rice', ['eat', "go out / travel around", 'not / no'], ['ข้าว'], SRC.hello),
    order('Eat. (rice/food)', [
      { roman: 'gin', thai: 'กิน' },
      { roman: 'khâao', thai: 'ข้าว' },
    ], SRC.hello),
    speak('กินข้าว', 'gin khâao', 'eat (rice/food)', ['กิน', 'ข้าว'], SRC.hello),
    mc('กลับ', 'glàp', 'return / go back', ["go out / travel around", 'not / no', 'hello'], ['กลับ'], SRC.hello),
    mc('บ้าน', 'bâan', 'home / house', ['rice', 'return / go back', 'eat'], ['บ้าน'], SRC.hello),
    order("I'm going home.", [
      { roman: 'glàp', thai: 'กลับ' },
      { roman: 'bâan', thai: 'บ้าน' },
    ], SRC.hello),
    speak('กลับบ้าน', 'glàp bâan', "go home / I'm going home", ['กลับ', 'บ้าน'], SRC.hello),
    // Reuses "pai" (gh02) with this lesson's own gin/khâao — a real,
    // common Thai serial-verb phrase ("go eat").
    order('Go eat.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'khâao', thai: 'ข้าว' },
    ], SRC.hello),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'ไปไหน', roman: 'pai nǎi', english: 'Where are you going?', parts: ['ไป', 'ไหน'] },
        { speaker: 'F', thai: 'ไปกินข้าว', roman: 'pai gin khâao', english: "I'm going to eat.", parts: ['ไป', 'กิน', 'ข้าว'] },
      ],
      [
        { thai: 'ไปเที่ยว', roman: 'pai thîao', parts: ['ไป', 'เที่ยว'] },
        { thai: 'ไม่ดี', roman: 'mâi dii', parts: ['ไม่', 'ดี'] },
        { thai: 'กลับ', roman: 'glàp', parts: ['กลับ'] },
      ],
      SRC.hello
    ),
  ]),

  // gàp/láew-gɔ̂ɔ/mâak are connecting words (no single fixed textbook
  // phrase of their own), so they're taught as isolated words first — but
  // láew-gɔ̂ɔ is then immediately put to work chaining together real
  // phrases from every earlier lesson in this unit (pai/nǎi/thîao from
  // gh02, gin/khâao/glàp/bâan from gh04), building up to a real 6-word
  // sentence instead of stopping at an isolated word.
  lesson('gh05', 'And, and then, a lot', [
    wordIntro('กับ', 'gàp', 'and / with', SRC.connector),
    wordIntro('แล้วก็', 'láew-gɔ̂ɔ', 'and then / also', SRC.connector),
    wordIntro('มาก', 'mâak', 'very / a lot', SRC.questions1),
    mc('กับ', 'gàp', 'and / with', ['eat', 'rice', 'return / go back'], ['กับ'], SRC.connector),
    mc('แล้วก็', 'láew-gɔ̂ɔ', 'and then / also', ['and / with', 'very / a lot', 'eat'], ['แล้วก็'], SRC.connector),
    mc('มาก', 'mâak', 'very / a lot', ['and / with', 'and then / also', 'rice'], ['มาก'], SRC.questions1),
    speak('กับ', 'gàp', 'and / with', ['กับ'], SRC.connector),
    speak('แล้วก็', 'láew-gɔ̂ɔ', 'and then / also', ['แล้วก็'], SRC.connector),
    speak('มาก', 'mâak', 'very / a lot', ['มาก'], SRC.questions1),
    speak('ไปเที่ยวแล้วก็กลับบ้าน', 'pai thîao láew-gɔ̂ɔ glàp bâan', 'Go out, and then go home.', ['ไป', 'เที่ยว', 'แล้วก็', 'กลับ', 'บ้าน'], SRC.connector),
    order('Go eat, and then go home.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'khâao', thai: 'ข้าว' },
      { roman: 'láew-gɔ̂ɔ', thai: 'แล้วก็' },
      { roman: 'glàp', thai: 'กลับ' },
      { roman: 'bâan', thai: 'บ้าน' },
    ], SRC.connector),
    // Varies gh03's opener (not just "pai thîao" again) by chaining in this
    // lesson's own láew-gɔ̂ɔ sentence — the exact real phrase taught above —
    // and, like gh03's fix, glosses pai nǎi/pai thîao as past tense so
    // "dii mái?" reads as asking about a trip that already happened.
    // "[word] mâak" is the book's own intensifier pattern (p.24, taught
    // this lesson via sǔai mâak/a-roi mâak/chɔ̂ɔp mâak) applied to dii.
    reply(
      [
        { speaker: 'M', thai: 'ไปไหนมา', roman: 'pai nǎi maa', english: 'Where have you been?', parts: ['ไป', 'ไหน', 'มา'] },
        {
          speaker: 'F',
          thai: 'ไปเที่ยวแล้วก็กลับบ้าน',
          roman: 'pai thîao láew-gɔ̂ɔ glàp bâan',
          english: 'I went out, and then came home.',
          parts: ['ไป', 'เที่ยว', 'แล้วก็', 'กลับ', 'บ้าน'],
        },
        { speaker: 'M', thai: 'ดีมั้ย', roman: 'dii mái', english: 'Was it good?', parts: ['ดี', 'มั้ย'] },
        { speaker: 'F', thai: 'ดีมาก', roman: 'dii mâak', english: 'It was very good.', parts: ['ดี', 'มาก'] },
      ],
      [
        { thai: 'ไม่ดี', roman: 'mâi dii', parts: ['ไม่', 'ดี'] },
        { thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', parts: ['สวัสดี', 'ครับ'] },
        { thai: 'ไปกินข้าว', roman: 'pai gin khâao', parts: ['ไป', 'กิน', 'ข้าว'] },
      ],
      SRC.questions1
    ),
  ]),

  // p.23-24 "Eight Most Common Words" — sà-nùk/sǔai/ao apply the same
  // dii-mái yes/no pattern already taught in gh03 ("Suay mai?" and "sa-nook
  // dee" are both direct textbook quotes). The closing line chains
  // pai/thîao (gh02) + láew-gɔ̂ɔ/mâak (gh05) + sà-nùk (this lesson) into one
  // real 5-word sentence — every word in it was taught in an earlier
  // lesson, not just this one.
  lesson('gh06', 'Fun, beautiful, want', [
    wordIntro('สนุก', 'sà-nùk', 'fun / enjoyable', SRC.places),
    wordIntro('สวย', 'sǔai', 'beautiful', SRC.questions1),
    wordIntro('เอา', 'ao', 'want', SRC.questions1),
    mc('สนุก', 'sà-nùk', 'fun / enjoyable', ['and / with', 'and then / also', 'very / a lot'], ['สนุก'], SRC.places),
    mc('สวย', 'sǔai', 'beautiful', ['fun / enjoyable', 'want', 'rice'], ['สวย'], SRC.questions1),
    mc('เอา', 'ao', 'want', ['beautiful', 'fun / enjoyable', 'return / go back'], ['เอา'], SRC.questions1),
    speak('สนุก', 'sà-nùk', 'fun / enjoyable', ['สนุก'], SRC.places),
    speak('สวย', 'sǔai', 'beautiful', ['สวย'], SRC.questions1),
    speak('เอา', 'ao', 'want', ['เอา'], SRC.questions1),
    mc('สนุกดี', 'sà-nùk dii', "It's fun.", ['Is it good?', "It's not fun.", 'Thank you.'], ['สนุก', 'ดี'], SRC.places),
    mc('ไม่สนุก', 'mâi sà-nùk', "It's not fun.", ["It's fun.", 'Is it beautiful?', "I'm going home."], ['ไม่', 'สนุก'], SRC.places),
    mc('สวยมั้ย', 'sǔai mái', 'Is it beautiful?', ['Is it good?', 'Where are you going?', 'Thank you.'], ['สวย', 'มั้ย'], SRC.questions1),
    order('Is it beautiful?', [
      { roman: 'sǔai', thai: 'สวย' },
      { roman: 'mái', thai: 'มั้ย' },
    ], SRC.questions1),
    speak('สวยมาก', 'sǔai mâak', "It's very beautiful.", ['สวย', 'มาก'], SRC.questions1),
    order('Went out, and it was a lot of fun.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'thîao', thai: 'เที่ยว' },
      { roman: 'láew-gɔ̂ɔ', thai: 'แล้วก็' },
      { roman: 'sà-nùk', thai: 'สนุก' },
      { roman: 'mâak', thai: 'มาก' },
    ], SRC.places),
    // Varies the opener again — chains pai thîao with gin khâao (gh04)
    // instead of gh05's glàp bâan — and, same fix as gh03/gh05, glosses
    // the lead-in as past tense so "sà-nùk mái?" ("Sa-nook mai?", p.23
    // verbatim) reads as asking about a trip that already happened.
    reply(
      [
        { speaker: 'M', thai: 'ไปไหนมา', roman: 'pai nǎi maa', english: 'Where have you been?', parts: ['ไป', 'ไหน', 'มา'] },
        {
          speaker: 'F',
          thai: 'ไปเที่ยวแล้วก็กินข้าว',
          roman: 'pai thîao láew-gɔ̂ɔ gin khâao',
          english: 'I went out, and then ate.',
          parts: ['ไป', 'เที่ยว', 'แล้วก็', 'กิน', 'ข้าว'],
        },
        { speaker: 'M', thai: 'สนุกมั้ย', roman: 'sà-nùk mái', english: 'Was it fun?', parts: ['สนุก', 'มั้ย'] },
        { speaker: 'F', thai: 'สนุกมาก', roman: 'sà-nùk mâak', english: 'It was a lot of fun.', parts: ['สนุก', 'มาก'] },
      ],
      [
        { thai: 'ไม่สนุก', roman: 'mâi sà-nùk', parts: ['ไม่', 'สนุก'] },
        { thai: 'สวยมั้ย', roman: 'sǔai mái', parts: ['สวย', 'มั้ย'] },
        { thai: 'กลับบ้าน', roman: 'glàp bâan', parts: ['กลับ', 'บ้าน'] },
      ],
      SRC.places
    ),
  ]),

  // p.24-25: like/thank you/excuse me/that's alright/understand — 5 new
  // words, right at the per-lesson cap, so gh08 (below) can be a pure
  // review quiz instead of splitting this content across a 9th lesson.
  // "khɔ̀ɔp-khun mâak" and "mâi ao, khɔ̀ɔp-khun khâ" are both textbook
  // phrases, not invented combos. The new order() chains pai/thîao (gh02) +
  // sà-nùk/mâak (gh06/gh05) + khɔ̀ɔp-khun/khâ (this lesson + gh01) into one
  // real 6-word sentence.
  lesson('gh07', 'Like, thank you, excuse me', [
    wordIntro('ชอบ', 'chɔ̂ɔp', 'like', SRC.questions1),
    wordIntro('ขอบคุณ', 'khɔ̀ɔp-khun', 'thank you', SRC.polite),
    wordIntro('ขอโทษ', 'khɔ̌ɔ-thôot', 'excuse me / sorry', SRC.polite),
    wordIntro('ไม่เป็นไร', 'mâi-pen-rai', "that's alright / never mind", SRC.polite),
    wordIntro('เข้าใจ', 'khâo-jai', 'understand', SRC.polite),
    mc('ไม่เป็นไร', 'mâi-pen-rai', "that's alright / never mind", ['thank you', 'like', 'excuse me / sorry'], ['ไม่เป็นไร'], SRC.polite),
    speak('ไม่เป็นไร', 'mâi-pen-rai', "that's alright / never mind", ['ไม่เป็นไร'], SRC.polite),
    mc('เข้าใจ', 'khâo-jai', 'understand', ['want', 'like', "that's alright / never mind"], ['เข้าใจ'], SRC.polite),
    speak('เข้าใจ', 'khâo-jai', 'understand', ['เข้าใจ'], SRC.polite),
    mc('ไม่เป็นไรค่ะขอบคุณค่ะ', 'mâi-pen-rai khâ, khɔ̀ɔp-khun khâ', "That's alright, thank you.", ['Excuse me.', 'Hello.', 'Do you understand?'], ['ไม่เป็นไร', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'], SRC.polite),
    order('That\'s alright, thank you. (said by a man)', [
      { roman: 'mâi-pen-rai', thai: 'ไม่เป็นไร' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.polite),
    mc('ชอบมากค่ะขอบคุณค่ะ', 'chɔ̂ɔp mâak khâ, khɔ̀ɔp-khun khâ', 'I like it a lot, thank you.', ['Hello.', 'Excuse me.', 'Do you understand?'], ['ชอบ', 'มาก', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'], SRC.polite),
    order('(It was) very fun, thank you.', [
      { roman: 'sà-nùk', thai: 'สนุก' },
      { roman: 'mâak', thai: 'มาก' },
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.polite),
    mc('ขอบคุณมาก', 'khɔ̀ɔp-khun mâak', 'Thanks a lot.', ['Excuse me.', "It's very beautiful.", "I don't want it."], ['ขอบคุณ', 'มาก'], SRC.polite),
    order('Went out, it was a lot of fun, thank you.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'thîao', thai: 'เที่ยว' },
      { roman: 'sà-nùk', thai: 'สนุก' },
      { roman: 'mâak', thai: 'มาก' },
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'khâ', thai: 'ค่ะ' },
    ], SRC.polite),
    speak('ไม่เอาค่ะขอบคุณค่ะ', 'mâi ao khâ, khɔ̀ɔp-khun khâ', 'No thank you.', ['ไม่', 'เอา', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'], SRC.polite),
    mc('ขอโทษ', 'khɔ̌ɔ-thôot', 'excuse me / sorry', ['thank you', 'like', 'want'], ['ขอโทษ'], SRC.polite),
    speak('ขอโทษ', 'khɔ̌ɔ-thôot', 'excuse me / sorry', ['ขอโทษ'], SRC.polite),
    // Varies the opener a third time (pai gin khâao, gh04) — chosen
    // specifically because "chɔ̂ɔp mái?" ("Chawp mai?", p.24 verbatim) reads
    // naturally as "did you like it?" asked about a meal, unlike asking it
    // about an abstract trip. Past-tense-glossed like the gh03/05/06 fixes.
    reply(
      [
        { speaker: 'M', thai: 'ไปไหนมา', roman: 'pai nǎi maa', english: 'Where have you been?', parts: ['ไป', 'ไหน', 'มา'] },
        { speaker: 'F', thai: 'ไปกินข้าวมา', roman: 'pai gin khâao maa', english: 'I went to eat.', parts: ['ไป', 'กิน', 'ข้าว', 'มา'] },
        { speaker: 'M', thai: 'ชอบมั้ย', roman: 'chɔ̂ɔp mái', english: 'Did you like it?', parts: ['ชอบ', 'มั้ย'] },
        { speaker: 'F', thai: 'ชอบมากค่ะขอบคุณค่ะ', roman: 'chɔ̂ɔp mâak khâ, khɔ̀ɔp-khun khâ', english: 'I liked it a lot, thank you.', parts: ['ชอบ', 'มาก', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'] },
      ],
      [
        { thai: 'ไม่ดี', roman: 'mâi dii', parts: ['ไม่', 'ดี'] },
        { thai: 'ขอโทษ', roman: 'khɔ̌ɔ-thôot', parts: ['ขอโทษ'] },
        { thai: 'ไม่เอาค่ะขอบคุณค่ะ', roman: 'mâi ao khâ, khɔ̀ɔp-khun khâ', parts: ['ไม่', 'เอา', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'] },
      ],
      SRC.polite
    ),
  ]),

  // Pure review — no wordIntro/wordIntroGroup steps at all (mâi-pen-rai/
  // khâo-jai moved up into gh07, which is why gh07 sits at the 5-word cap).
  // Every exercise below re-tests a word or exact phrase already taught in
  // gh01-gh07; nothing new is introduced. Spans the whole unit (greeting,
  // going places, yes/no questions, eating/home, connectors, the
  // sà-nùk/sǔai/ao set, and this unit's own polite phrases) rather than
  // only re-drilling gh07's topic.
  lesson('gh08', 'Review', [
    mc('สวัสดีค่ะ', 'sà-wàt-dii khâ', 'Hello. (said by a woman)', ['Thank you.', 'Excuse me.', 'Good luck.'], ['สวัสดี', 'ค่ะ'], SRC.hello),
    order('Where are you going?', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'nǎi', thai: 'ไหน' },
    ], SRC.hello),
    mc('ดีมั้ย', 'dii mái', 'Is it good?', ['Is it fun?', 'Where are you going?', 'Hello.'], ['ดี', 'มั้ย'], SRC.places),
    order('Go eat.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'khâao', thai: 'ข้าว' },
    ], SRC.hello),
    mc('สนุกมาก', 'sà-nùk mâak', "It's a lot of fun.", ['Is it beautiful?', "It's not fun.", 'Thank you.'], ['สนุก', 'มาก'], SRC.places),
    mc('ไม่เป็นไรค่ะขอบคุณค่ะ', 'mâi-pen-rai khâ, khɔ̀ɔp-khun khâ', "That's alright, thank you.", ['Excuse me.', 'Hello.', 'Do you understand?'], ['ไม่เป็นไร', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'], SRC.polite),
    order('That\'s alright, thank you. (said by a man)', [
      { roman: 'mâi-pen-rai', thai: 'ไม่เป็นไร' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.polite),
    speak('ไม่เป็นไรค่ะขอบคุณค่ะ', 'mâi-pen-rai khâ, khɔ̀ɔp-khun khâ', "That's alright, thank you.", ['ไม่เป็นไร', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'], SRC.polite),
    mc('ขอโทษค่ะเข้าใจมั้ย', 'khɔ̌ɔ-thôot khâ, khâo-jai mái', 'Excuse me — do you understand?', ["That's alright.", 'Excuse me.', 'Thank you.'], ['ขอโทษ', 'ค่ะ', 'เข้าใจ', 'มั้ย'], SRC.polite),
    order("Sorry, I don't understand.", [
      { roman: 'khɔ̌ɔ-thôot', thai: 'ขอโทษ' },
      { roman: 'khâ', thai: 'ค่ะ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'khâo-jai', thai: 'เข้าใจ' },
      { roman: 'khâ', thai: 'ค่ะ' },
    ], SRC.polite),
    speak('เข้าใจแล้วก็ชอบมาก', 'khâo-jai láew-gɔ̂ɔ chɔ̂ɔp mâak', 'I understand, and I like it a lot.', ['เข้าใจ', 'แล้วก็', 'ชอบ', 'มาก'], SRC.polite),
    reply(
      [
        { speaker: 'F', thai: 'ขอโทษค่ะ', roman: 'khɔ̌ɔ-thôot khâ', english: 'Excuse me. (said by a woman)', parts: ['ขอโทษ', 'ค่ะ'] },
        { speaker: 'M', thai: 'ไม่เป็นไรครับ', roman: 'mâi-pen-rai khráp', english: "That's alright. (said by a man)", parts: ['ไม่เป็นไร', 'ครับ'] },
      ],
      [
        { thai: 'ขอบคุณครับ', roman: 'khɔ̀ɔp-khun khráp', parts: ['ขอบคุณ', 'ครับ'] },
        { thai: 'เข้าใจครับ', roman: 'khâo-jai khráp', parts: ['เข้าใจ', 'ครับ'] },
        { thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', parts: ['สวัสดี', 'ครับ'] },
      ],
      SRC.polite
    ),
    reply(
      [
        { speaker: 'F', thai: 'ขอโทษค่ะ', roman: 'khɔ̌ɔ-thôot khâ', english: 'Excuse me. (said by a woman)', parts: ['ขอโทษ', 'ค่ะ'] },
        { speaker: 'M', thai: 'ไม่เป็นไรครับ', roman: 'mâi-pen-rai khráp', english: "That's alright. (said by a man)", parts: ['ไม่เป็นไร', 'ครับ'] },
        { speaker: 'F', thai: 'ขอบคุณค่ะ', roman: 'khɔ̀ɔp-khun khâ', english: 'Thank you. (said by a woman)', parts: ['ขอบคุณ', 'ค่ะ'] },
      ],
      [
        { thai: 'เข้าใจมั้ย', roman: 'khâo-jai mái', parts: ['เข้าใจ', 'มั้ย'] },
        { thai: 'ขอโทษค่ะ', roman: 'khɔ̌ɔ-thôot khâ', parts: ['ขอโทษ', 'ค่ะ'] },
        { thai: 'ไม่เป็นไรครับ', roman: 'mâi-pen-rai khráp', parts: ['ไม่เป็นไร', 'ครับ'] },
      ],
      SRC.polite
    ),
  ]),
];

const helloSubject = subject(
  'greetings-hello',
  'Hello & Everyday Phrases',
  'thák-thaai',
  'Hello, going places, yes/no questions, and politeness — real phrases from Essential Thai, pp.22-25.',
  helloLessons
);

// =====================================================================
// UNIT B — "Names, Small Talk & Goodbyes" (Higbie pp.38-41)
// =====================================================================

const namesLessons = [
  // Merge of old g09 ("What's your name?") + g10 ("I am..., my name is
  // Lek").
  lesson('gn01', "What's your name?", [
    wordIntro('คุณ', 'khun', 'you', SRC.name),
    wordIntro('ชื่อ', 'chɯ̂ɯ', 'name', SRC.name),
    wordIntro('อะไร', 'à-rai', 'what', SRC.name),
    wordIntro('ผม', 'phǒm', 'I (male)', SRC.name),
    wordIntro('ฉัน', 'chán', 'I (female)', SRC.name),
    wordIntro('เล็ก', 'lék', 'Lek (a name)', SRC.name),
    mc('ขอโทษค่ะคุณชื่ออะไร', 'khɔ̌ɔ-thôot khâ, khun chɯ̂ɯ à-rai', "Excuse me, what's your name?", ['How are you?', 'Where are you from?', 'How old are you?'], ['ขอโทษ', 'ค่ะ', 'คุณ', 'ชื่อ', 'อะไร'], SRC.name),
    order("Hello, what's your name? (said by a man)", [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'à-rai', thai: 'อะไร' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.name),
    speak('สวัสดีครับไปไหนครับ', 'sà-wàt-dii khráp, pai nǎi khráp', 'Hello, where are you going? (said by a man)', ['สวัสดี', 'ครับ', 'ไป', 'ไหน', 'ครับ'], SRC.name),
    mc('ผม', 'phǒm', 'I (male)', ['you', 'name', 'what'], ['ผม'], SRC.name),
    mc('ฉัน', 'chán', 'I (female)', ['I (male)', 'name', 'what'], ['ฉัน'], SRC.name),
    mc('เล็ก', 'lék', 'Lek (a name)', ['I (male)', 'I (female)', 'name'], ['เล็ก'], SRC.name),
    order('My name is Lek. (said by a man)', [
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
    ], SRC.name),
    speak('ผมชื่อเล็กคุณชื่ออะไร', 'phǒm chɯ̂ɯ lék, khun chɯ̂ɯ à-rai', 'My name is Lek. What\'s your name?', ['ผม', 'ชื่อ', 'เล็ก', 'คุณ', 'ชื่อ', 'อะไร'], SRC.name),
    // Cumulative sentence: "sà-wàt-dii khâ" (gh01) + this lesson's name
    // question.
    order("Hello, what's your name? (said by a woman)", [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khâ', thai: 'ค่ะ' },
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'à-rai', thai: 'อะไร' },
    ], SRC.name),
    reply(
      [
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'M', thai: 'คุณชื่ออะไรครับ', roman: 'khun chɯ̂ɯ à-rai khráp', english: "What's your name?", parts: ['คุณ', 'ชื่อ', 'อะไร', 'ครับ'] },
      ],
      [
        { thai: 'ไปไหนครับ', roman: 'pai nǎi khráp', parts: ['ไป', 'ไหน', 'ครับ'] },
        { thai: 'ขอบคุณครับ', roman: 'khɔ̀ɔp-khun khráp', parts: ['ขอบคุณ', 'ครับ'] },
        { thai: 'ดีมั้ยครับ', roman: 'dii mái khráp', parts: ['ดี', 'มั้ย', 'ครับ'] },
      ],
      SRC.name
    ),
  ]),

  // Unchanged from the original g11 (already has its own reply()), merged
  // with old g12 ("Daeng").
  lesson('gn02', 'Nicknames', [
    wordIntro('น้อย', 'nɔ́ɔi', 'Noi (a name)', SRC.name),
    wordIntro('ชื่อเล่น', 'chɯ̂ɯ-lên', 'nickname', SRC.name),
    wordIntro('นิด', 'nít', 'Nit ("little bit", a nickname)', SRC.name),
    wordIntro('แดง', 'dɛɛng', 'Daeng ("red", a nickname)', SRC.name),
    order('Hello, my name is Noi. Thank you. (said by a woman)', [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khâ', thai: 'ค่ะ' },
      { roman: 'chán', thai: 'ฉัน' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'nɔ́ɔi', thai: 'น้อย' },
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'khâ', thai: 'ค่ะ' },
    ], SRC.name),
    mc('ผมชื่อเล็กชื่อเล่นนิดครับ', 'phǒm chɯ̂ɯ lék chɯ̂ɯ-lên nít khráp', 'My name is Lek, my nickname is Nit.', ['My name is Lek.', 'My nickname is Daeng.', "What's your name?"], ['ผม', 'ชื่อ', 'เล็ก', 'ชื่อเล่น', 'นิด', 'ครับ'], SRC.name),
    speak('ขอโทษครับคุณชื่อเล่นอะไรครับ', 'khɔ̌ɔ-thôot khráp, khun chɯ̂ɯ-lên à-rai khráp', 'Excuse me, what\'s your nickname?', ['ขอโทษ', 'ครับ', 'คุณ', 'ชื่อเล่น', 'อะไร', 'ครับ'], SRC.name),
    mc('แดง', 'dɛɛng', 'Daeng ("red", a nickname)', ['Nit ("little bit", a nickname)', 'nickname', 'name'], ['แดง'], SRC.name),
    speak('แดง', 'dɛɛng', 'Daeng ("red", a nickname)', ['แดง'], SRC.name),
    order('My name is Noi, my nickname is Daeng. (said by a woman)', [
      { roman: 'chán', thai: 'ฉัน' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'nɔ́ɔi', thai: 'น้อย' },
      { roman: 'chɯ̂ɯ-lên', thai: 'ชื่อเล่น' },
      { roman: 'dɛɛng', thai: 'แดง' },
      { roman: 'khâ', thai: 'ค่ะ' },
    ], SRC.name),
    mc('นิด', 'nít', 'Nit ("little bit", a nickname)', ['Daeng ("red", a nickname)', 'nickname', 'name'], ['นิด'], SRC.name),
    // Cumulative sentence: greeting (gh01) + full name + nickname intro.
    order('Hello, my name is Lek, my nickname is Nit. (said by a man)', [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'chɯ̂ɯ-lên', thai: 'ชื่อเล่น' },
      { roman: 'nít', thai: 'นิด' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.name),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับผมชื่อเล็กขอบคุณครับ', roman: 'sà-wàt-dii khráp, phǒm chɯ̂ɯ lék, khɔ̀ɔp-khun khráp', english: 'Hello, my name is Lek. Thank you. (said by a man)', parts: ['สวัสดี', 'ครับ', 'ผม', 'ชื่อ', 'เล็ก', 'ขอบคุณ', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะฉันชื่อน้อยขอบคุณค่ะ', roman: 'sà-wàt-dii khâ, chán chɯ̂ɯ nɔ́ɔi, khɔ̀ɔp-khun khâ', english: 'Hello, my name is Noi. Thank you. (said by a woman)', parts: ['สวัสดี', 'ค่ะ', 'ฉัน', 'ชื่อ', 'น้อย', 'ขอบคุณ', 'ค่ะ'] },
      ],
      [
        { thai: 'ขอโทษค่ะคุณชื่ออะไร', roman: 'khɔ̌ɔ-thôot khâ, khun chɯ̂ɯ à-rai', parts: ['ขอโทษ', 'ค่ะ', 'คุณ', 'ชื่อ', 'อะไร'] },
        { thai: 'ผมชื่อเล็กคุณชื่ออะไร', roman: 'phǒm chɯ̂ɯ lék, khun chɯ̂ɯ à-rai', parts: ['ผม', 'ชื่อ', 'เล็ก', 'คุณ', 'ชื่อ', 'อะไร'] },
      ],
      SRC.name
    ),
  ]),

  // Merge of old g13 ("Are you well?") + g14 ("Where are you from?").
  lesson('gn03', 'Are you well? Where are you from?', [
    wordIntro('สบาย', 'sà-baai', 'well', SRC.howAreYou),
    wordIntro('เหรอ', 'rə̌ə', 'really? (question particle)', SRC.howAreYou),
    wordIntro('หรือเปล่า', 'rɯ̌ɯ-plàao', 'or not?', SRC.howAreYou),
    wordIntro('มา', 'maa', 'come', SRC.howAreYou),
    wordIntro('จาก', 'jàak', 'from', SRC.howAreYou),
    wordIntro('อังกฤษ', 'ang-krìt', 'England', SRC.howAreYou),
    mc('คุณชื่ออะไรสบายดีมั้ย', 'khun chɯ̂ɯ à-rai, sà-baai dii mái', "What's your name? Are you well?", ["What's your name?", 'Where are you from?', "I'm going home."], ['คุณ', 'ชื่อ', 'อะไร', 'สบาย', 'ดี', 'มั้ย'], SRC.howAreYou),
    order('Hello, are you well or not?', [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'sà-baai', thai: 'สบาย' },
      { roman: 'dii', thai: 'ดี' },
      { roman: 'rɯ̌ɯ-plàao', thai: 'หรือเปล่า' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.howAreYou),
    speak('ขอบคุณมากครับสบายดีครับ', 'khɔ̀ɔp-khun mâak khráp, sà-baai dii khráp', "Thanks a lot, I'm fine.", ['ขอบคุณ', 'มาก', 'ครับ', 'สบาย', 'ดี', 'ครับ'], SRC.howAreYou),
    mc('เหรอ', 'rə̌ə', 'really? (question particle)', ['or not?', 'well', 'want'], ['เหรอ'], SRC.howAreYou),
    mc('หรือเปล่า', 'rɯ̌ɯ-plàao', 'or not?', ['really? (question particle)', 'well', 'like'], ['หรือเปล่า'], SRC.howAreYou),
    mc('มา', 'maa', 'come', ['well', 'really? (question particle)', 'or not?'], ['มา'], SRC.howAreYou),
    mc('จาก', 'jàak', 'from', ['come', 'well', 'good'], ['จาก'], SRC.howAreYou),
    mc('อังกฤษ', 'ang-krìt', 'England', ['from', 'come', 'thank you'], ['อังกฤษ'], SRC.howAreYou),
    order("Hello, I'm from England. (said by a man)", [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'maa', thai: 'มา' },
      { roman: 'jàak', thai: 'จาก' },
      { roman: 'ang-krìt', thai: 'อังกฤษ' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.howAreYou),
    // Cumulative sentence: name question (gn01) + this lesson's "are you
    // well" via "láew-gɔ̂ɔ" (gh04) — matches the exact phrasing Higbie
    // uses again later (see gn06's "sà-wàt-dii khâ, khun chɯ̂ɯ à-rai
    // láew-gɔ̂ɔ sà-baai dii rə̌ə" mc step).
    order("Hello, what's your name? Are you well? (said by a woman)", [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khâ', thai: 'ค่ะ' },
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'à-rai', thai: 'อะไร' },
      { roman: 'sà-baai', thai: 'สบาย' },
      { roman: 'dii', thai: 'ดี' },
      { roman: 'mái', thai: 'มั้ย' },
    ], SRC.howAreYou),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'สบายดีมั้ย', roman: 'sà-baai dii mái', english: 'Are you well?', parts: ['สบาย', 'ดี', 'มั้ย'] },
        { speaker: 'F', thai: 'ฉันสบายดีค่ะขอบคุณค่ะ', roman: 'chán sà-baai dii khâ, khɔ̀ɔp-khun khâ', english: "I'm well, thank you. (said by a woman)", parts: ['ฉัน', 'สบาย', 'ดี', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'] },
      ],
      [
        { thai: 'ไม่ดี', roman: 'mâi dii', parts: ['ไม่', 'ดี'] },
        { thai: 'ผมชื่อเล็กครับ', roman: 'phǒm chɯ̂ɯ lék khráp', parts: ['ผม', 'ชื่อ', 'เล็ก', 'ครับ'] },
        { thai: 'ดีมั้ยครับ', roman: 'dii mái khráp', parts: ['ดี', 'มั้ย', 'ครับ'] },
      ],
      SRC.howAreYou
    ),
  ]),

  // Merge of old g15 (already has its own reply()) + g16 ("Nationalities").
  lesson('gn04', "I'm American", [
    wordIntro('อเมริกา', 'à-me-rí-gaa', 'America', SRC.howAreYou),
    wordIntro('เป็น', 'pen', 'to be / is', SRC.nationality),
    wordIntro('คน', 'kon', 'person', SRC.nationality),
    wordIntro('เยอรมัน', 'yəə-rá-man', 'German', SRC.nationality),
    wordIntro('เค้า', 'kháo', 'he / she', SRC.nationality),
    wordIntro('ไทย', 'thai', 'Thai', SRC.nationality),
    mc('เป็น', 'pen', 'to be / is', ['come', 'from', 'America'], ['เป็น'], SRC.nationality),
    mc('คน', 'kon', 'person', ['to be / is', 'America', 'well'], ['คน'], SRC.nationality),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'F', thai: 'สวัสดีค่ะ', roman: 'sà-wàt-dii khâ', english: 'Hello. (said by a woman)', parts: ['สวัสดี', 'ค่ะ'] },
        { speaker: 'M', thai: 'สบายดีมั้ยครับคุณมาจากไหนครับ', roman: 'sà-baai dii mái khráp, khun maa jàak nǎi khráp', english: 'Are you well? Where are you from?', parts: ['สบาย', 'ดี', 'มั้ย', 'ครับ', 'คุณ', 'มา', 'จาก', 'ไหน', 'ครับ'] },
        { speaker: 'F', thai: 'ฉันมาจากอเมริกาค่ะ', roman: 'chán maa jàak à-me-rí-gaa khâ', english: "I'm from America. (said by a woman)", parts: ['ฉัน', 'มา', 'จาก', 'อเมริกา', 'ค่ะ'] },
      ],
      [
        { thai: 'ขอบคุณมากครับสบายดีครับ', roman: 'khɔ̀ɔp-khun mâak khráp, sà-baai dii khráp', parts: ['ขอบคุณ', 'มาก', 'ครับ', 'สบาย', 'ดี', 'ครับ'] },
        { thai: 'ผมชื่อเล็กคุณชื่ออะไร', roman: 'phǒm chɯ̂ɯ lék, khun chɯ̂ɯ à-rai', parts: ['ผม', 'ชื่อ', 'เล็ก', 'คุณ', 'ชื่อ', 'อะไร'] },
      ],
      SRC.howAreYou
    ),
    speak('สวัสดีค่ะฉันมาจากอเมริกาค่ะ', 'sà-wàt-dii khâ, chán maa jàak à-me-rí-gaa khâ', "Hello, I'm from America. (said by a woman)", ['สวัสดี', 'ค่ะ', 'ฉัน', 'มา', 'จาก', 'อเมริกา', 'ค่ะ'], SRC.howAreYou),
    mc('สวัสดีค่ะฉันเป็นคนเยอรมันค่ะ', 'sà-wàt-dii khâ, chán pen kon yəə-rá-man khâ', "Hello, I'm German. (said by a woman)", ["I'm from America.", "He's Thai.", 'Where are you from?'], ['สวัสดี', 'ค่ะ', 'ฉัน', 'เป็น', 'คน', 'เยอรมัน', 'ค่ะ'], SRC.nationality),
    mc('เค้า', 'kháo', 'he / she', ['German', 'Thai', 'person'], ['เค้า'], SRC.nationality),
    order("He's/she's Thai.", [
      { roman: 'kháo', thai: 'เค้า' },
      { roman: 'pen', thai: 'เป็น' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'thai', thai: 'ไทย' },
    ], SRC.nationality),
    speak('ผมเป็นคนอังกฤษเค้าเป็นคนไทย', 'phǒm pen kon ang-krìt, kháo pen kon thai', "I'm English, and he's Thai.", ['ผม', 'เป็น', 'คน', 'อังกฤษ', 'เค้า', 'เป็น', 'คน', 'ไทย'], SRC.nationality),
    // Cumulative sentence: name intro (gn01) + this lesson's "from
    // America".
    order("My name is Lek, and I'm from America. (said by a man)", [
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'maa', thai: 'มา' },
      { roman: 'jàak', thai: 'จาก' },
      { roman: 'à-me-rí-gaa', thai: 'อเมริกา' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.howAreYou),
  ]),

  // Merge of old g17 (already has its own reply()) + g18 + g19 + g20 —
  // the shortest, thinnest old lessons (3-4 steps each), consolidated
  // into one substantial lesson.
  lesson('gn05', 'How old are you? Have you eaten yet?', [
    wordIntro('อายุ', 'aa-yú', 'age', SRC.nationality),
    wordIntro('เท่าไหร่', 'thâo-rài', 'how much / how many', SRC.nationality),
    wordIntro('ยี่สิบห้า', 'yîi-sìp-hâa', 'twenty-five', SRC.nationality),
    order("Hello, my name is Lek, I'm 25. (said by a man)", [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'aa-yú', thai: 'อายุ' },
      { roman: 'yîi-sìp-hâa', thai: 'ยี่สิบห้า' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.nationality),
    speak('ขอโทษครับคุณชื่ออะไรอายุเท่าไหร่ครับ', 'khɔ̌ɔ-thôot khráp, khun chɯ̂ɯ à-rai, aa-yú thâo-rài khráp', "Excuse me, what's your name? How old are you?", ['ขอโทษ', 'ครับ', 'คุณ', 'ชื่อ', 'อะไร', 'อายุ', 'เท่าไหร่', 'ครับ'], SRC.nationality),
    reply(
      [
        { speaker: 'M', thai: 'สวัสดีครับ', roman: 'sà-wàt-dii khráp', english: 'Hello. (said by a man)', parts: ['สวัสดี', 'ครับ'] },
        { speaker: 'M', thai: 'ผมชื่อเล็กคุณอายุเท่าไหร่ครับ', roman: 'phǒm chɯ̂ɯ lék, khun aa-yú thâo-rài khráp', english: "My name is Lek. How old are you?", parts: ['ผม', 'ชื่อ', 'เล็ก', 'คุณ', 'อายุ', 'เท่าไหร่', 'ครับ'] },
        { speaker: 'F', thai: 'ฉันชื่อน้อยฉันอายุยี่สิบห้าค่ะ', roman: 'chán chɯ̂ɯ nɔ́ɔi, chán aa-yú yîi-sìp-hâa khâ', english: "My name is Noi, I'm 25.", parts: ['ฉัน', 'ชื่อ', 'น้อย', 'ฉัน', 'อายุ', 'ยี่สิบห้า', 'ค่ะ'] },
      ],
      [
        { thai: 'สวัสดีค่ะฉันมาจากอเมริกาค่ะ', roman: 'sà-wàt-dii khâ, chán maa jàak à-me-rí-gaa khâ', parts: ['สวัสดี', 'ค่ะ', 'ฉัน', 'มา', 'จาก', 'อเมริกา', 'ค่ะ'] },
        { thai: 'สวัสดีค่ะฉันชื่อน้อยขอบคุณค่ะ', roman: 'sà-wàt-dii khâ, chán chɯ̂ɯ nɔ́ɔi, khɔ̀ɔp-khun khâ', parts: ['สวัสดี', 'ค่ะ', 'ฉัน', 'ชื่อ', 'น้อย', 'ขอบคุณ', 'ค่ะ'] },
      ],
      SRC.nationality
    ),
    wordIntro('กินข้าว', 'gin-khâao', 'eat / have eaten', SRC.nationality),
    wordIntro('รึยัง', 'rɯ́-yang', '...yet?', SRC.nationality),
    wordIntro('แล้ว', 'láew', 'already', SRC.nationality),
    mc('สวัสดีครับผมชื่อเล็กคุณกินข้าวรึยังครับ', 'sà-wàt-dii khráp, phǒm chɯ̂ɯ lék, khun gin-khâao rɯ́-yang khráp', 'Hello, my name is Lek. Have you eaten yet?', ['How old are you?', "I'm German.", 'Are you well?'], ['สวัสดี', 'ครับ', 'ผม', 'ชื่อ', 'เล็ก', 'คุณ', 'กินข้าว', 'รึยัง', 'ครับ'], SRC.nationality),
    order("My name is Lek, I've already eaten.", [
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'khâao', thai: 'ข้าว' },
      { roman: 'láew', thai: 'แล้ว' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.nationality),
    mc('แล้ว', 'láew', 'already', ['...yet?', 'eat / have eaten', 'yet / still'], ['แล้ว'], SRC.nationality),
    wordIntro('ยัง', 'yang', 'yet / still', SRC.nationality),
    wordIntro('อยู่', 'yùu', 'be at / stay', SRC.nationality),
    wordIntro('เมืองไทย', 'mɯang-thai', 'Thailand', SRC.nationality),
    speak('คุณกินข้าวรึยังผมยังไม่กินข้าวครับ', 'khun gin-khâao rɯ́-yang, phǒm yang mâi gin khâao khráp', "Have you eaten yet? I haven't eaten yet.", ['คุณ', 'กินข้าว', 'รึยัง', 'ผม', 'ยัง', 'ไม่', 'กิน', 'ข้าว', 'ครับ'], SRC.nationality),
    mc('อยู่', 'yùu', 'be at / stay', ['yet / still', 'Thailand', 'already'], ['อยู่'], SRC.nationality),
    mc('เมืองไทย', 'mɯang-thai', 'Thailand', ['be at / stay', 'yet / still', 'England'], ['เมืองไทย'], SRC.nationality),
    speak('อยู่เมืองไทย', 'yùu mɯang-thai', 'stay in Thailand', ['อยู่', 'เมืองไทย'], SRC.nationality),
    wordIntro('นาน', 'naan', 'a long time', SRC.nationality),
    mc('สวัสดีครับคุณอยู่เมืองไทยนานรึยังครับ', 'sà-wàt-dii khráp, khun yùu mɯang-thai naan rɯ́-yang khráp', 'Hello, have you been in Thailand long?', ['Have you eaten yet?', "I'm from America.", 'How old are you?'], ['สวัสดี', 'ครับ', 'คุณ', 'อยู่', 'เมืองไทย', 'นาน', 'รึยัง', 'ครับ'], SRC.nationality),
    order("I've been in Thailand a long time, and I like Thailand a lot.", [
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'mɯang-thai', thai: 'เมืองไทย' },
      { roman: 'naan', thai: 'นาน' },
      { roman: 'láew', thai: 'แล้ว' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɔ̂ɔp', thai: 'ชอบ' },
      { roman: 'mɯang-thai', thai: 'เมืองไทย' },
      { roman: 'mâak', thai: 'มาก' },
    ], SRC.nationality),
    speak('ผมอยู่เมืองไทยไม่นานครับผมชอบเมืองไทยมาก', 'phǒm yùu mɯang-thai mâi naan khráp, phǒm chɔ̂ɔp mɯang-thai mâak', "I haven't been in Thailand long, I like Thailand a lot.", ['ผม', 'อยู่', 'เมืองไทย', 'ไม่', 'นาน', 'ครับ', 'ผม', 'ชอบ', 'เมืองไทย', 'มาก'], SRC.nationality),
    // Cumulative sentence: name intro (gn01) + age (this lesson).
    order('My name is Lek, I\'m 25 years old. (said by a man)', [
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'aa-yú', thai: 'อายุ' },
      { roman: 'yîi-sìp-hâa', thai: 'ยี่สิบห้า' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.nationality),
  ]),

  // Unchanged from the original g21+g22 — already substantial and each
  // has its own conversation (g22's reply()).
  lesson('gn06', 'Good luck, see you again', [
    rule(
      'Saying goodbye',
      "Thais don't make a big deal out of saying goodbye — sometimes they just leave. The formal way to say goodbye is the " +
        'same as hello. Informally, just tell the other person you\'re leaving, adding ná ("mind you"/"OK?") to soften it.',
      SRC.goodbye
    ),
    wordIntro('ก่อน', 'gɔ̀ɔn', 'first / before', SRC.goodbye),
    wordIntro('นะ', 'ná', 'softening particle', SRC.goodbye),
    wordIntro('คะ', 'khá', 'polite particle (women: after ná, and in questions)', SRC.goodbye),
    wordIntro('โชคดี', 'chôok-dii', 'good luck', SRC.goodbye),
    order("Thanks a lot, I'm going back now. (said by a woman)", [
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'mâak', thai: 'มาก' },
      { roman: 'khâ', thai: 'ค่ะ' },
      { roman: 'chán', thai: 'ฉัน' },
      { roman: 'glàp', thai: 'กลับ' },
      { roman: 'gɔ̀ɔn', thai: 'ก่อน' },
      { roman: 'ná', thai: 'นะ' },
      { roman: 'khá', thai: 'คะ' },
    ], SRC.goodbye),
    speak('ขอบคุณมากครับผมไปก่อนนะครับ', 'khɔ̀ɔp-khun mâak khráp, phǒm pai gɔ̀ɔn ná khráp', "Thanks a lot, I'm going now.", ['ขอบคุณ', 'มาก', 'ครับ', 'ผม', 'ไป', 'ก่อน', 'นะ', 'ครับ'], SRC.goodbye),
    order("Thanks a lot, I'm going now, good luck! (said by a man)", [
      { roman: 'khɔ̀ɔp-khun', thai: 'ขอบคุณ' },
      { roman: 'mâak', thai: 'มาก' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'pai', thai: 'ไป' },
      { roman: 'gɔ̀ɔn', thai: 'ก่อน' },
      { roman: 'ná', thai: 'นะ' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'chôok-dii', thai: 'โชคดี' },
      { roman: 'ná', thai: 'นะ' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.goodbye),
    mc('สวัสดีค่ะคุณชื่ออะไรสบายดีมั้ย', 'sà-wàt-dii khâ, khun chɯ̂ɯ à-rai, sà-baai dii mái', "Hello, what's your name? Are you well?", ["What's your name?", 'See you again.', 'Have you eaten yet?'], ['สวัสดี', 'ค่ะ', 'คุณ', 'ชื่อ', 'อะไร', 'สบาย', 'ดี', 'มั้ย'], SRC.hello),
    wordIntro('เจอ', 'jəə', 'meet', SRC.goodbye),
    wordIntro('กัน', 'gan', 'each other / together', SRC.goodbye),
    wordIntro('ใหม่', 'mài', 'new / again', SRC.goodbye),
    speak('โชคดีนะครับขอบคุณมากครับแล้วเจอกันใหม่นะครับ', 'chôok-dii ná khráp, khɔ̀ɔp-khun mâak khráp, láew jəə gan mài ná khráp', 'Good luck! Thanks a lot. See you again.', ['โชคดี', 'นะ', 'ครับ', 'ขอบคุณ', 'มาก', 'ครับ', 'แล้ว', 'เจอ', 'กัน', 'ใหม่', 'นะ', 'ครับ'], SRC.goodbye),
    reply(
      [
        { speaker: 'M', thai: 'สบายดีมั้ย', roman: 'sà-baai dii mái', english: 'Are you well?', parts: ['สบาย', 'ดี', 'มั้ย'] },
        { speaker: 'F', thai: 'ฉันสบายดีค่ะขอบคุณค่ะ', roman: 'chán sà-baai dii khâ, khɔ̀ɔp-khun khâ', english: "I'm well, thank you. (said by a woman)", parts: ['ฉัน', 'สบาย', 'ดี', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'] },
        { speaker: 'M', thai: 'ขอบคุณมากครับผมไปก่อนนะครับ', roman: 'khɔ̀ɔp-khun mâak khráp, phǒm pai gɔ̀ɔn ná khráp', english: "Thanks a lot, I'm going now. (goodbye)", parts: ['ขอบคุณ', 'มาก', 'ครับ', 'ผม', 'ไป', 'ก่อน', 'นะ', 'ครับ'] },
        { speaker: 'F', thai: 'แล้วเจอกันใหม่นะคะ', roman: 'láew jəə gan mài ná khá', english: 'See you again.', parts: ['แล้ว', 'เจอ', 'กัน', 'ใหม่', 'นะ', 'คะ'] },
      ],
      [
        { thai: 'ขอบคุณค่ะ', roman: 'khɔ̀ɔp-khun khâ', parts: ['ขอบคุณ', 'ค่ะ'] },
        { thai: 'ไปไหน', roman: 'pai nǎi', parts: ['ไป', 'ไหน'] },
        { thai: 'ดีมั้ย', roman: 'dii mái', parts: ['ดี', 'มั้ย'] },
      ],
      SRC.goodbye
    ),
    order("Hello, my name is Lek. I'm from England. (said by a man)", [
      { roman: 'sà-wàt-dii', thai: 'สวัสดี' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'chɯ̂ɯ', thai: 'ชื่อ' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'khráp', thai: 'ครับ' },
      { roman: 'phǒm', thai: 'ผม' },
      { roman: 'maa', thai: 'มา' },
      { roman: 'jàak', thai: 'จาก' },
      { roman: 'ang-krìt', thai: 'อังกฤษ' },
      { roman: 'khráp', thai: 'ครับ' },
    ], SRC.name),
    mc('ขอบคุณค่ะฉันไปก่อนนะคะแล้วเจอกันใหม่ค่ะ', 'khɔ̀ɔp-khun khâ, chán pai gɔ̀ɔn ná khá, láew jəə gan mài khâ', "Thank you, I'm going now, see you again!", ["I'm going home.", "How old are you?", "That's alright."], ['ขอบคุณ', 'ค่ะ', 'ฉัน', 'ไป', 'ก่อน', 'นะ', 'คะ', 'แล้ว', 'เจอ', 'กัน', 'ใหม่', 'ค่ะ'], SRC.goodbye),
    speak('สวัสดีค่ะสบายดีมั้ยคะฉันสบายดีค่ะขอบคุณค่ะ', 'sà-wàt-dii khâ, sà-baai dii mái khá? chán sà-baai dii khâ, khɔ̀ɔp-khun khâ', "Hello, are you well? I'm well, thank you.", ['สวัสดี', 'ค่ะ', 'สบาย', 'ดี', 'มั้ย', 'คะ', 'ฉัน', 'สบาย', 'ดี', 'ค่ะ', 'ขอบคุณ', 'ค่ะ'], SRC.howAreYou),
  ]),

  // Capstone — recombines vocab already taught above (unit A and unit B
  // together) — no new words.
  dialogue(
    'gn07',
    'Catching up',
    'Two people meet for the first time on the street',
    [
      { speaker: 'A', thai: 'สวัสดีค่ะ สบายดีมั้ยคะ', roman: 'sà-wàt-dii khâ, sà-baai dii mái khá', english: 'Hello, are you well?' },
      { speaker: 'B', thai: 'สบายดีครับ คุณมาจากไหนครับ', roman: 'sà-baai dii khráp, khun maa jàak nǎi khráp', english: "I'm fine. Where are you from?" },
      { speaker: 'A', thai: 'ฉันมาจากอเมริกาค่ะ เมืองไทยสนุกมากค่ะ', roman: 'chán maa jàak à-me-rí-gaa khâ, mɯang-thai sà-nùk mâak khâ', english: "I'm from America. Thailand is a lot of fun." },
      { speaker: 'B', thai: 'ครับ ผมชอบเมืองไทยมากครับ', roman: 'khráp, phǒm chɔ̂ɔp mɯang-thai mâak khráp', english: 'Yes, I like Thailand a lot.' },
      { speaker: 'A', thai: 'ขอบคุณค่ะ ฉันไปก่อนนะคะ โชคดีค่ะ', roman: 'khɔ̀ɔp-khun khâ, chán pai gɔ̀ɔn ná khá, chôok-dii khâ', english: 'Thank you. I\'m going now. Good luck.' },
    ],
    [
      { type: 'intro' },
      {
        type: 'comprehension', lineIndex: 0,
        options: [
          { text: 'Hello, are you well?', correct: true },
          { text: "What's your name?", correct: false },
          { text: 'Where are you going?', correct: false },
          { text: 'Thank you very much.', correct: false },
        ],
      },
      {
        type: 'comprehension', lineIndex: 2,
        options: [
          { text: "I'm from America. Thailand is a lot of fun.", correct: true },
          { text: "I'm from England.", correct: false },
          { text: 'Have you eaten yet?', correct: false },
          { text: "I'm going home.", correct: false },
        ],
      },
      {
        type: 'translate', lineIndex: 1,
        options: [
          { text: "I'm fine. Where are you from?", correct: true },
          { text: 'Where are you going?', correct: false },
          { text: 'Good luck.', correct: false },
          { text: 'Excuse me.', correct: false },
        ],
      },
      {
        type: 'translate', lineIndex: 3,
        options: [
          { text: 'Yes, I like Thailand a lot.', correct: true },
          { text: "I don't understand.", correct: false },
          { text: 'Is it delicious?', correct: false },
          { text: 'How old are you?', correct: false },
        ],
      },
      {
        type: 'blank', lineIndex: 4, before: 'khɔ̀ɔp-khun khâ, chán pai gɔ̀ɔn ná khá,', after: '',
        options: [
          { text: 'chôok-dii', correct: true, meaning: 'good luck' },
          { text: 'mâi-pen-rai', correct: false, meaning: "that's alright / never mind" },
          { text: 'khɔ̀ɔp-khun', correct: false, meaning: 'thank you' },
          { text: 'khâo-jai', correct: false, meaning: 'understand' },
        ],
      },
      { type: 'speak', lineIndex: 0 },
      { type: 'speak', lineIndex: 4 },
    ]
  ),
];

const namesSubject = subject(
  'greetings-names',
  'Names, Small Talk & Goodbyes',
  'khui-kan',
  'Names, how are you, where you\'re from, nationality, age, and goodbye — real phrases from Essential Thai, pp.38-41.',
  namesLessons
);

module.exports = { greetingsSubjects: [helloSubject, namesSubject] };
