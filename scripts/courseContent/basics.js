// "Basics: Everyday Sentences" — transcribed from real textbook pages (Thai
// script, romanization, and English meanings are all copied from the
// source, not invented): Essential Thai: A Guide to the Basics of the Thai
// Language by James Higbie (2nd ed., Orchid Press) — the Colors chapter
// (p.19), the "Shopping/Getting Around" chapter (pp.27-28, 31: this/this
// one/which one, how many do you want, where is/people & things), the
// "Step-by-Step Conversation" chapter (pp.46-49, 53-54, 56-59: describing
// people, to be, this/the, the same/not the same, who/which person, action
// verbs, yes/no questions, confirming with châi mái, want to/like to, have
// to/can), and the Time chapter (p.98: days of the week). Every step cites
// its exact source page.
//
// This unit covers foundational sentence-building patterns (this/that,
// adjectives, to be, yes/no and confirmation questions, question words,
// colors, days of the week, basic verbs) that the Greetings and Restaurant
// units don't already teach — sà-wàt-dii, ขอบคุณ, ชื่อ, ครับ/ค่ะ etc. are
// deliberately not re-taught here.
//
// Romanization reuses the diacritic convention already used elsewhere in
// this app (à/á/â/ǎ for low/high/falling/rising tones, ɔ/ɛ/ɯ/ə for open
// vowels) rather than Higbie's own plain-letter-plus-underline system.
// Words that recur from src/data.ts or scripts/courseContent/{restaurant,
// greetings}.js (khun, ao, mâi, mái, pai, gin, maa, chɔ̂ɔp, kháo, pen, kon,
// nǎi, thîi, yùu, tɔ̂ng, dâi, rong-raem, phaeng, mâak, lék, nɔ́ɔi, dɛɛng,
// sǔai, à-rai, gan, sǎam, gìi) reuse those exact spellings.
//
// 2026-11-08: b03-b10 rewritten to lesson 1's standard (Hello & Everyday Phrases): short real phrases instead of
// unrelated clauses chained with gàp/láew-gɔ̂ɔ, plus a reply() chat step in every lesson.
//
// Lessons are grouped two-original-topics-per-lesson (b01-b20 merged into
// b01-b10) so each lesson runs ~15-18 steps instead of ~7-9 — no step
// content was rewritten, only regrouped; interleaveWordIntros (run by
// generateSeedSqlBasics.js) re-flows each merged lesson's wordIntro/content
// steps to alternate teach/test rather than front-loading. b11 is a closing
// Conversation (dialogue) lesson recombining vocab already taught above.
'use strict';

const { wordIntro, rule, mc, order, speak, reply, dialogue, lesson, subject } = require('../lib/courseBuilder');

const SRC = {
  shopping1: 'Essential Thai (Higbie), p.27',
  shopping2: 'Essential Thai (Higbie), p.28',
  places: 'Essential Thai (Higbie), p.31',
  yesno: 'Essential Thai (Higbie), p.56',
  confirm: 'Essential Thai (Higbie), p.57',
  sentences1: 'Essential Thai (Higbie), p.46',
  sentences2: 'Essential Thai (Higbie), p.47',
  too: 'Essential Thai (Higbie), p.48',
  things: 'Essential Thai (Higbie), p.49',
  who: 'Essential Thai (Higbie), p.53',
  verbs: 'Essential Thai (Higbie), p.54',
  liketo: 'Essential Thai (Higbie), p.58',
  canmust: 'Essential Thai (Higbie), p.59',
  colors: 'Essential Thai (Higbie), p.19',
  days: 'Essential Thai (Higbie), p.98',
  connector: 'Essential Thai (Higbie), general reference (connecting words)',
};

const lessons = [
  // --------------------------------------------------------------- b01 (was b01+b02)
  lesson('b01', 'This one, and how many?', [
    rule(
      'This vs. this one',
      "Nîi (\"this\") alone has a falling tone. But when it's attached right after a classifier, as in \"this one\" (an-níi) or " +
        '"this person", it takes a high tone instead.',
      SRC.shopping1
    ),
    wordIntro('เอา', 'ao', 'want / take', SRC.shopping1),
    wordIntro('นี่', 'nîi', 'this', SRC.shopping1),
    wordIntro('อันนี้', 'an-níi', 'this one', SRC.shopping1),
    wordIntro('อันไหน', 'an-nǎi', 'which one?', SRC.shopping1),
    mc('เอาอันนี้', 'ao an-níi', 'I want this one.', ['Which one do you want?', "It's expensive.", "I don't want it."], ['เอา', 'อันนี้'], SRC.shopping1),
    order('Which one do you want?', [
      { roman: 'ao', thai: 'เอา' },
      { roman: 'an-nǎi', thai: 'อันไหน' },
    ], SRC.shopping1),
    mc('อันไหน', 'an-nǎi', 'Which one?', ['This one.', "I don't want it.", "It's beautiful."], ['อันไหน'], SRC.shopping1),
    speak('นี่', 'nîi', 'this', ['นี่'], SRC.shopping1),
    wordIntro('กี่', 'gìi', 'how many?', SRC.shopping2),
    wordIntro('อัน', 'an', 'item (classifier for objects)', SRC.shopping2),
    wordIntro('เดียว', 'diao', 'single / only one', SRC.shopping2),
    mc('เอากี่อัน', 'ao gìi an', 'How many do you want?', ['I want this one.', 'Which one?', 'I have one.'], ['เอา', 'กี่', 'อัน'], SRC.shopping2),
    order('I want just one.', [
      { roman: 'ao', thai: 'เอา' },
      { roman: 'an', thai: 'อัน' },
      { roman: 'diao', thai: 'เดียว' },
    ], SRC.shopping2),
    mc('อันเดียว', 'an diao', 'A single one / just one.', ['How many?', 'This one.', 'Two items.'], ['อัน', 'เดียว'], SRC.shopping2),
    speak('กี่อัน', 'gìi an', 'how many (items)?', ['กี่', 'อัน'], SRC.shopping2),
    speak('เอากี่อัน', 'ao gìi an', 'How many do you want?', ['เอา', 'กี่', 'อัน'], SRC.shopping2),
    reply(
      [
        { speaker: 'M', thai: 'เอาอันไหน', roman: 'ao an-nǎi', english: 'Which one do you want?', parts: ['เอา', 'อันไหน'] },
        { speaker: 'F', thai: 'เอาอันนี้', roman: 'ao an-níi', english: 'I want this one.', parts: ['เอา', 'อันนี้'] },
      ],
      [
        { thai: 'อันไหน', roman: 'an-nǎi', parts: ['อันไหน'] },
        { thai: 'เอากี่อัน', roman: 'ao gìi an', parts: ['เอา', 'กี่', 'อัน'] },
      ],
      SRC.shopping1
    ),
  ]),

  // --------------------------------------------------------------- b02 (was b03+b04)
  lesson('b02', 'Yes/no, and confirming', [
    rule(
      'Yes/no questions with mái',
      "Put mái after a verb to ask a yes/no question — it often works like an invitation (\"...mái?\" can mean \"want to...?\"). " +
        'Answer "yes" by repeating the verb, or "no" by putting mâi in front of it.',
      SRC.yesno
    ),
    wordIntro('มั้ย', 'mái', 'question particle (yes/no)', SRC.yesno),
    wordIntro('ไม่', 'mâi', 'not / no', SRC.yesno),
    mc('เอามั้ย', 'ao mái', 'Do you want it?', ['I want this one.', 'How many?', 'This one.'], ['เอา', 'มั้ย'], SRC.yesno),
    order("No, I don't want it.", [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'ao', thai: 'เอา' },
    ], SRC.yesno),
    mc('ไม่เอา', 'mâi ao', "No, I don't want it.", ['Do you want it?', 'Which one?', 'Just one.'], ['ไม่', 'เอา'], SRC.yesno),
    speak('มั้ย', 'mái', 'question particle (yes/no)', ['มั้ย'], SRC.yesno),
    speak('ไม่เอา', 'mâi ao', "No, I don't want it.", ['ไม่', 'เอา'], SRC.yesno),
    rule(
      'Confirming with châi mái',
      'Use châi mái at the end of a statement when you already think something is true and just want to confirm it, like ' +
        'English "right?". Answer châi ("right") or mâi châi ("no, that\'s not right").',
      SRC.confirm
    ),
    wordIntro('ใช่', 'châi', "right / that's correct", SRC.confirm),
    mc('ใช่มั้ย', 'châi mái', "Isn't that right?", ["No, that's not right.", 'I want this one.', 'How many?'], ['ใช่', 'มั้ย'], SRC.confirm),
    order("No, that's not right.", [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'châi', thai: 'ใช่' },
    ], SRC.confirm),
    mc('ไม่ใช่', 'mâi châi', "No, that's not right.", ["Yes, that's right.", 'Do you want it?', 'Just one.'], ['ไม่', 'ใช่'], SRC.confirm),
    speak('ใช่', 'châi', "Yes, that's right.", ['ใช่'], SRC.confirm),
    speak('ใช่มั้ย', 'châi mái', "Isn't that right?", ['ใช่', 'มั้ย'], SRC.confirm),
    reply(
      [
        { speaker: 'M', thai: 'เอามั้ย', roman: 'ao mái', english: 'Do you want it?', parts: ['เอา', 'มั้ย'] },
        { speaker: 'F', thai: 'ไม่เอา', roman: 'mâi ao', english: "No, I don't want it.", parts: ['ไม่', 'เอา'] },
      ],
      [
        { thai: 'ใช่มั้ย', roman: 'châi mái', parts: ['ใช่', 'มั้ย'] },
        { thai: 'อันไหน', roman: 'an-nǎi', parts: ['อันไหน'] },
      ],
      SRC.yesno
    ),
  ]),

  // --------------------------------------------------------------- b03 (was b05+b06)
  lesson('b03', "Tall, short, fat, thin", [
    rule(
      'Describing people',
      "To describe someone, just put the adjective right after their name or a pronoun like \"you\" — Thai doesn't use a word " +
        'for "to be" with adjectives.',
      SRC.sentences1
    ),
    wordIntro('คุณ', 'khun', 'you', SRC.sentences1),
    wordIntro('สูง', 'sǔung', 'tall', SRC.sentences1),
    wordIntro('เตี้ย', 'tîa', 'short', SRC.sentences1),
    mc('คุณสูงมั้ย', 'khun sǔung mái', 'Are you tall?', ["You're short.", 'Do you want it?', "That's right."], ['คุณ', 'สูง', 'มั้ย'], SRC.sentences1),
    order("You're not short.", [
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'tîa', thai: 'เตี้ย' },
    ], SRC.sentences1),
    mc('คุณเตี้ยมั้ย', 'khun tîa mái', 'Are you short?', ["You're tall.", 'Which one?', 'Just one.'], ['คุณ', 'เตี้ย', 'มั้ย'], SRC.sentences1),
    speak('คุณไม่เตี้ย', 'khun mâi tîa', "You're not short.", ['คุณ', 'ไม่', 'เตี้ย'], SRC.sentences1),
    wordIntro('อ้วน', 'ûan', 'fat / well-built', SRC.sentences1),
    wordIntro('ผอม', 'phɔ̌ɔm', 'thin', SRC.sentences1),
    wordIntro('มาก', 'mâak', 'very / a lot', SRC.sentences1),
    mc('คุณสูงมาก', 'khun sǔung mâak', "You're very tall.", ["You're very thin.", "You're not short.", 'Are you tall?'], ['คุณ', 'สูง', 'มาก'], SRC.sentences1),
    order('Very thin.', [
      { roman: 'phɔ̌ɔm', thai: 'ผอม' },
      { roman: 'mâak', thai: 'มาก' },
    ], SRC.sentences1),
    mc('ไม่อ้วน', 'mâi ûan', 'Not fat.', ['Very thin.', 'Very tall.', 'Not short.'], ['ไม่', 'อ้วน'], SRC.sentences1),
    speak('ผอมมาก', 'phɔ̌ɔm mâak', 'very thin', ['ผอม', 'มาก'], SRC.sentences1),
    reply(
      [
        { speaker: 'M', thai: 'คุณสูงมั้ย', roman: 'khun sǔung mái', english: 'Are you tall?', parts: ['คุณ', 'สูง', 'มั้ย'] },
        { speaker: 'F', thai: 'ไม่สูง', roman: 'mâi sǔung', english: 'No, not tall.', parts: ['ไม่', 'สูง'] },
      ],
      [
        { thai: 'ผอมมาก', roman: 'phɔ̌ɔm mâak', parts: ['ผอม', 'มาก'] },
        { thai: 'คุณเตี้ยมั้ย', roman: 'khun tîa mái', parts: ['คุณ', 'เตี้ย', 'มั้ย'] },
      ],
      SRC.sentences1
    ),
  ]),

  // --------------------------------------------------------------- b04 (was b07+b08)
  lesson('b04', 'Beautiful, clean, rich', [
    wordIntro('สวย', 'sǔai', 'beautiful', SRC.sentences1),
    wordIntro('หล่อ', 'lɔ̀ɔ', 'handsome', SRC.sentences1),
    wordIntro('น่ารัก', 'nâa-rák', 'cute / lovable', SRC.sentences1),
    mc('คุณสวยมาก', 'khun sǔai mâak', "You're very beautiful.", ["You're very tall.", 'Handsome.', 'Not fat.'], ['คุณ', 'สวย', 'มาก'], SRC.sentences1),
    order('Very handsome.', [
      { roman: 'lɔ̀ɔ', thai: 'หล่อ' },
      { roman: 'mâak', thai: 'มาก' },
    ], SRC.sentences1),
    mc('ไม่หล่อ', 'mâi lɔ̀ɔ', 'Not handsome.', ['Very cute.', 'Beautiful.', 'Tall.'], ['ไม่', 'หล่อ'], SRC.sentences1),
    speak('น่ารักมาก', 'nâa-rák mâak', 'very cute', ['น่ารัก', 'มาก'], SRC.sentences1),
    wordIntro('สะอาด', 'sà-àat', 'clean', SRC.sentences1),
    wordIntro('รวย', 'ruai', 'rich', SRC.sentences1),
    wordIntro('จน', 'jon', 'poor', SRC.sentences1),
    mc('สะอาดมั้ย', 'sà-àat mái', 'Is it clean?', ['Very poor.', 'Not clean.', 'Handsome.'], ['สะอาด', 'มั้ย'], SRC.sentences1),
    order('Not clean.', [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'sà-àat', thai: 'สะอาด' },
    ], SRC.sentences1),
    mc('คุณรวยมาก', 'khun ruai mâak', "You're very rich.", ["You're poor.", 'Very clean.', 'Very cute.'], ['คุณ', 'รวย', 'มาก'], SRC.sentences1),
    speak('สะอาดมาก', 'sà-àat mâak', 'very clean', ['สะอาด', 'มาก'], SRC.sentences1),
    reply(
      [
        { speaker: 'M', thai: 'สะอาดมั้ย', roman: 'sà-àat mái', english: 'Is it clean?', parts: ['สะอาด', 'มั้ย'] },
        { speaker: 'F', thai: 'ไม่สะอาด', roman: 'mâi sà-àat', english: "No, it's not clean.", parts: ['ไม่', 'สะอาด'] },
      ],
      [
        { thai: 'ไม่หล่อ', roman: 'mâi lɔ̀ɔ', parts: ['ไม่', 'หล่อ'] },
        { thai: 'คุณรวยมาก', roman: 'khun ruai mâak', parts: ['คุณ', 'รวย', 'มาก'] },
      ],
      SRC.sentences1
    ),
  ]),

  // --------------------------------------------------------------- b05 (was b09+b10)
  lesson('b05', "To be, and 'this ___'", [
    rule(
      'Two ways to say "is"',
      "Keu links two things that are exactly equivalent (it's usually left out in speech). Pen links a subject to a describing " +
        "noun, like a job or relationship — but not to an adjective. To say a noun sentence is false, use mâi châi, not mâi alone.",
      SRC.sentences2
    ),
    wordIntro('เป็น', 'pen', 'to be / is', SRC.sentences2),
    wordIntro('เค้า', 'kháo', 'he / she', SRC.sentences2),
    wordIntro('เพื่อน', 'phɯ̂an', 'friend', SRC.sentences2),
    mc('เค้าเป็นเพื่อน', 'kháo pen phɯ̂an', "He's/she's a friend.", ["He's not a friend.", "You're rich.", 'Is it clean?'], ['เค้า', 'เป็น', 'เพื่อน'], SRC.sentences2),
    order("She's not a friend.", [
      { roman: 'kháo', thai: 'เค้า' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'châi', thai: 'ใช่' },
      { roman: 'phɯ̂an', thai: 'เพื่อน' },
    ], SRC.sentences2),
    mc('เค้าไม่ใช่เพื่อน', 'kháo mâi châi phɯ̂an', "He's/she's not a friend.", ["He's a friend.", "You're very beautiful.", 'A single one.'], ['เค้า', 'ไม่', 'ใช่', 'เพื่อน'], SRC.sentences2),
    speak('เค้าเป็นเพื่อน', 'kháo pen phɯ̂an', "He's/she's a friend.", ['เค้า', 'เป็น', 'เพื่อน'], SRC.sentences2),
    rule(
      '"This ___"',
      "Put níi (high tone) right after a noun to say \"this ___\". There's no separate word for \"the\" in Thai — just say the " +
        'name of the thing.',
      SRC.things
    ),
    wordIntro('เสื้อ', 'sɯ̂a', 'shirt', SRC.things),
    wordIntro('นี้', 'níi', 'this (after a noun)', SRC.things),
    wordIntro('โรงแรม', 'rong-raem', 'hotel', SRC.things),
    wordIntro('แพง', 'phaeng', 'expensive', SRC.things),
    wordIntro('แล้วก็', 'láew-gɔ̂ɔ', 'and then / also', SRC.connector),
    mc('เสื้อนี้สวย', 'sɯ̂a níi sǔai', 'This shirt is beautiful.', ['This hotel is expensive.', "He's a friend.", 'Very rich.'], ['เสื้อ', 'นี้', 'สวย'], SRC.things),
    order('This hotel is expensive.', [
      { roman: 'rong-raem', thai: 'โรงแรม' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'phaeng', thai: 'แพง' },
    ], SRC.things),
    mc('โรงแรมนี้แพงมั้ย', 'rong-raem níi phaeng mái', 'Is this hotel expensive?', ['This shirt is beautiful.', "He's a friend.", 'Not clean.'], ['โรงแรม', 'นี้', 'แพง', 'มั้ย'], SRC.things),
    speak('เสื้อนี้สวยแล้วก็ไม่แพง', 'sɯ̂a níi sǔai láew-gɔ̂ɔ mâi phaeng', "This shirt is beautiful, and it's not expensive.", ['เสื้อ', 'นี้', 'สวย', 'แล้วก็', 'ไม่', 'แพง'], SRC.things),
    reply(
      [
        { speaker: 'M', thai: 'โรงแรมนี้แพงมั้ย', roman: 'rong-raem níi phaeng mái', english: 'Is this hotel expensive?', parts: ['โรงแรม', 'นี้', 'แพง', 'มั้ย'] },
        { speaker: 'F', thai: 'ไม่แพง', roman: 'mâi phaeng', english: "No, it's not expensive.", parts: ['ไม่', 'แพง'] },
      ],
      [
        { thai: 'เค้าเป็นเพื่อน', roman: 'kháo pen phɯ̂an', parts: ['เค้า', 'เป็น', 'เพื่อน'] },
        { thai: 'เสื้อนี้สวย', roman: 'sɯ̂a níi sǔai', parts: ['เสื้อ', 'นี้', 'สวย'] },
      ],
      SRC.things
    ),
  ]),

  // --------------------------------------------------------------- b06 (was b11+b12)
  lesson('b06', 'The same, or too much', [
    rule(
      'The same as',
      "Meuan means \"the same as\" or \"like\". Add gan (\"each other\") when you're saying two things are the same, " +
        'especially at the end of a sentence.',
      SRC.things
    ),
    wordIntro('เหมือน', 'mɯ̌an', 'the same as / like', SRC.things),
    wordIntro('กัน', 'gan', 'each other / together', SRC.things),
    mc('เหมือนกัน', 'mɯ̌an gan', "They're the same.", ["They're not the same.", 'This shirt is beautiful.', "He's a friend."], ['เหมือน', 'กัน'], SRC.things),
    order('Not the same.', [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'mɯ̌an', thai: 'เหมือน' },
      { roman: 'gan', thai: 'กัน' },
    ], SRC.things),
    mc('คุณเหมือนเค้า', 'khun mɯ̌an kháo', "You're like him/her.", ["They're the same.", 'This hotel is expensive.', 'A single one.'], ['คุณ', 'เหมือน', 'เค้า'], SRC.things),
    speak('ไม่เหมือนกัน', 'mâi mɯ̌an gan', 'not the same', ['ไม่', 'เหมือน', 'กัน'], SRC.things),
    rule(
      'Too ___',
      "Add pai right after an adjective to say \"too ___\" — the same word pai also means \"go\", but here it works as an " +
        'intensifier.',
      SRC.too
    ),
    wordIntro('ไป', 'pai', 'go / too (after an adjective)', SRC.too),
    wordIntro('เล็ก', 'lék', 'small', SRC.too),
    mc('เล็กไป', 'lék pai', "It's too small.", ['Very small.', 'Too expensive.', "That's not right."], ['เล็ก', 'ไป'], SRC.too),
    mc('แพงไป', 'phaeng pai', "It's too expensive.", ['Too small.', 'Not expensive.', 'Very beautiful.'], ['แพง', 'ไป'], SRC.too),
    order('This shirt is too small.', [
      { roman: 'sɯ̂a', thai: 'เสื้อ' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'pai', thai: 'ไป' },
    ], SRC.too),
    speak('แพงไป', 'phaeng pai', 'too expensive', ['แพง', 'ไป'], SRC.too),
    reply(
      [
        { speaker: 'M', thai: 'เอาอันนี้มั้ย', roman: 'ao an-níi mái', english: 'Do you want this one?', parts: ['เอา', 'อันนี้', 'มั้ย'] },
        { speaker: 'F', thai: 'ไม่เอาเล็กไป', roman: 'mâi ao, lék pai', english: "No, it's too small.", parts: ['ไม่', 'เอา', 'เล็ก', 'ไป'] },
      ],
      [
        { thai: 'เหมือนกัน', roman: 'mɯ̌an gan', parts: ['เหมือน', 'กัน'] },
        { thai: 'คุณเหมือนเค้า', roman: 'khun mɯ̌an kháo', parts: ['คุณ', 'เหมือน', 'เค้า'] },
      ],
      SRC.too
    ),
  ]),

  // --------------------------------------------------------------- b07 (was b13+b14)
  lesson('b07', 'Colors, have to, can', [
    rule(
      'Colors',
      'Put sǐi ("color") before any color word — then put the whole color word after the name of the object it describes.',
      SRC.colors
    ),
    wordIntro('สี', 'sǐi', 'color', SRC.colors),
    wordIntro('แดง', 'dɛɛng', 'red', SRC.colors),
    wordIntro('ดำ', 'dam', 'black', SRC.colors),
    wordIntro('ขาว', 'khǎao', 'white', SRC.colors),
    mc('เสื้อสีแดง', 'sɯ̂a sǐi dɛɛng', 'a red shirt', ['a black shirt', 'a white shirt', 'This shirt is beautiful.'], ['เสื้อ', 'สี', 'แดง'], SRC.colors),
    order('A black shirt.', [
      { roman: 'sɯ̂a', thai: 'เสื้อ' },
      { roman: 'sǐi', thai: 'สี' },
      { roman: 'dam', thai: 'ดำ' },
    ], SRC.colors),
    mc('เสื้อสีขาวสวย', 'sɯ̂a sǐi khǎao sǔai', 'The white shirt is beautiful.', ['The red shirt is expensive.', 'a black shirt', 'too small'], ['เสื้อ', 'สี', 'ขาว', 'สวย'], SRC.colors),
    speak('สีแดง', 'sǐi dɛɛng', 'red', ['สี', 'แดง'], SRC.colors),
    rule(
      'Have to / can',
      "Put tɔ̂ng right before a verb for \"have to/must\". Dâi means \"can\" for permission, availability, or ability — " +
        'answer mâi dâi for "can\'t".',
      SRC.canmust
    ),
    wordIntro('ต้อง', 'tɔ̂ng', 'have to / must', SRC.canmust),
    wordIntro('ได้', 'dâi', 'can / able to', SRC.canmust),
    mc('ต้องไป', 'tɔ̂ng pai', 'I have to go.', ["I can't go.", 'Too small.', 'A red shirt.'], ['ต้อง', 'ไป'], SRC.canmust),
    order("I can't go.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'dâi', thai: 'ได้' },
    ], SRC.canmust),
    mc('ไปได้มั้ย', 'pai dâi mái', 'Can you go?', ['I have to go.', 'A black shirt.', 'The color white.'], ['ไป', 'ได้', 'มั้ย'], SRC.canmust),
    speak('ไปไม่ได้', 'pai mâi dâi', "I can't go.", ['ไป', 'ไม่', 'ได้'], SRC.canmust),
    reply(
      [
        { speaker: 'M', thai: 'ไปได้มั้ย', roman: 'pai dâi mái', english: 'Can you go?', parts: ['ไป', 'ได้', 'มั้ย'] },
        { speaker: 'F', thai: 'ไปไม่ได้', roman: 'pai mâi dâi', english: "No, I can't go.", parts: ['ไป', 'ไม่', 'ได้'] },
      ],
      [
        { thai: 'เสื้อสีดำ', roman: 'sɯ̂a sǐi dam', parts: ['เสื้อ', 'สี', 'ดำ'] },
        { thai: 'สีขาว', roman: 'sǐi khǎao', parts: ['สี', 'ขาว'] },
      ],
      SRC.canmust
    ),
  ]),

  // --------------------------------------------------------------- b08 (was b15+b16)
  lesson('b08', 'Want to, like to, and doing what', [
    rule(
      'Want to / like to',
      '"Want to" before a verb is yàak, not ao — ao is only for wanting an object, not an action. Chɔ̂ɔp before a verb means ' +
        '"like to" (or "always do").',
      SRC.liketo
    ),
    wordIntro('อยาก', 'yàak', 'want to (+ verb)', SRC.liketo),
    wordIntro('ชอบ', 'chɔ̂ɔp', 'like to (+ verb) / like', SRC.liketo),
    mc('อยากไป', 'yàak pai', 'I want to go.', ['I like to go.', "I don't want to go.", 'I have to go.'], ['อยาก', 'ไป'], SRC.liketo),
    order("I don't want to go.", [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'yàak', thai: 'อยาก' },
      { roman: 'pai', thai: 'ไป' },
    ], SRC.liketo),
    mc('ไม่ชอบไป', 'mâi chɔ̂ɔp pai', "I don't like to go.", ['I want to go.', 'I like to go.', "I can't go."], ['ไม่', 'ชอบ', 'ไป'], SRC.liketo),
    speak('อยากไป', 'yàak pai', 'I want to go.', ['อยาก', 'ไป'], SRC.liketo),
    wordIntro('มา', 'maa', 'come', SRC.verbs),
    wordIntro('กิน', 'gin', 'eat', SRC.verbs),
    wordIntro('ทำ', 'tham', 'do / make', SRC.verbs),
    wordIntro('อะไร', 'à-rai', 'what', SRC.verbs),
    mc('มากิน', 'maa gin', 'Come and eat.', ['Going to eat.', 'What are you doing?', 'I want to go.'], ['มา', 'กิน'], SRC.verbs),
    order('What do you want to eat?', [
      { roman: 'yàak', thai: 'อยาก' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'à-rai', thai: 'อะไร' },
    ], SRC.verbs),
    mc('ทำอะไร', 'tham à-rai', 'What are you doing?', ['Come and eat.', 'I like to go.', 'What do you want to eat?'], ['ทำ', 'อะไร'], SRC.verbs),
    speak('ทำอะไร', 'tham à-rai', 'What are you doing?', ['ทำ', 'อะไร'], SRC.verbs),
    reply(
      [
        { speaker: 'M', thai: 'อยากไปมั้ย', roman: 'yàak pai mái', english: 'Do you want to go?', parts: ['อยาก', 'ไป', 'มั้ย'] },
        { speaker: 'F', thai: 'อยากไป', roman: 'yàak pai', english: 'Yes, I want to go.', parts: ['อยาก', 'ไป'] },
      ],
      [
        { thai: 'ทำอะไร', roman: 'tham à-rai', parts: ['ทำ', 'อะไร'] },
        { thai: 'มากิน', roman: 'maa gin', parts: ['มา', 'กิน'] },
      ],
      SRC.liketo
    ),
  ]),

  // --------------------------------------------------------------- b09 (was b17+b18)
  lesson('b09', 'Daily verbs: where and when', [
    wordIntro('ดู', 'duu', 'see / look at / watch', SRC.verbs),
    wordIntro('เดิน', 'dəən', 'walk', SRC.verbs),
    wordIntro('นอน', 'nɔɔn', 'sleep', SRC.verbs),
    mc('ไปนอน', 'pai nɔɔn', "I'm going to sleep.", ['I like to walk.', 'What are you doing?', 'Come and eat.'], ['ไป', 'นอน'], SRC.verbs),
    order('I want to sleep.', [
      { roman: 'yàak', thai: 'อยาก' },
      { roman: 'nɔɔn', thai: 'นอน' },
    ], SRC.verbs),
    mc('ชอบเดิน', 'chɔ̂ɔp dəən', 'I like to walk.', ["I'm going to sleep.", 'Come and eat.', 'I want to watch.'], ['ชอบ', 'เดิน'], SRC.verbs),
    speak('ไปนอน', 'pai nɔɔn', "I'm going to sleep.", ['ไป', 'นอน'], SRC.verbs),
    rule('Where is...?', 'Yùu means "to be at a place". Put thîi-nǎi ("where?") after yùu to ask where something is.', SRC.places),
    wordIntro('อยู่', 'yùu', 'be at / stay', SRC.places),
    wordIntro('ที่ไหน', 'thîi-nǎi', 'where?', SRC.places),
    wordIntro('เมื่อไหร่', 'mɯ̂a-rài', 'when?', SRC.places),
    mc('โรงแรมอยู่ที่ไหน', 'rong-raem yùu thîi-nǎi', 'Where is the hotel?', ['When are you going?', 'I want to go.', 'Come and eat.'], ['โรงแรม', 'อยู่', 'ที่ไหน'], SRC.places),
    order('Where is he?', [
      { roman: 'kháo', thai: 'เค้า' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'thîi-nǎi', thai: 'ที่ไหน' },
    ], SRC.places),
    mc('ไปเมื่อไหร่', 'pai mɯ̂a-rài', 'When are you going?', ["Where's the shirt?", 'Where is it?', 'I like to go.'], ['ไป', 'เมื่อไหร่'], SRC.places),
    speak('โรงแรมอยู่ที่ไหน', 'rong-raem yùu thîi-nǎi', 'Where is the hotel?', ['โรงแรม', 'อยู่', 'ที่ไหน'], SRC.places),
    reply(
      [
        { speaker: 'M', thai: 'อยากทำอะไร', roman: 'yàak tham à-rai', english: 'What do you want to do?', parts: ['อยาก', 'ทำ', 'อะไร'] },
        { speaker: 'F', thai: 'อยากนอน', roman: 'yàak nɔɔn', english: 'I want to sleep.', parts: ['อยาก', 'นอน'] },
      ],
      [
        { thai: 'ไปเมื่อไหร่', roman: 'pai mɯ̂a-rài', parts: ['ไป', 'เมื่อไหร่'] },
        { thai: 'อยู่ที่ไหน', roman: 'yùu thîi-nǎi', parts: ['อยู่', 'ที่ไหน'] },
      ],
      SRC.verbs
    ),
  ]),

  // --------------------------------------------------------------- b10 (was b19+b20)
  lesson('b10', 'Days of the week, and who', [
    rule(
      'Days of the week',
      'Every day name starts with wan ("day"). Wan-nǎi? ("what day?") or mɯ̂a-rài asks about the past, put at the end of the ' +
        'question.',
      SRC.days
    ),
    wordIntro('วันจันทร์', 'wan-jan', 'Monday', SRC.days),
    wordIntro('วันศุกร์', 'wan-sùk', 'Friday', SRC.days),
    wordIntro('วันอาทิตย์', 'wan-aa-thít', 'Sunday', SRC.days),
    wordIntro('วันไหน', 'wan-nǎi', 'what day?', SRC.days),
    mc('ไปวันจันทร์', 'pai wan-jan', "I'm going on Monday.", ["I'm going on Friday.", "I'm going on Sunday.", 'What day?'], ['ไป', 'วันจันทร์'], SRC.days),
    order("I'm going on Friday.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'wan-sùk', thai: 'วันศุกร์' },
    ], SRC.days),
    mc('ไปวันไหน', 'pai wan-nǎi', 'What day are you going?', ['Monday.', 'Sunday.', 'When?'], ['ไป', 'วันไหน'], SRC.days),
    speak('วันอาทิตย์', 'wan-aa-thít', 'Sunday', ['วันอาทิตย์'], SRC.days),
    reply(
      [
        { speaker: 'M', thai: 'ไปวันไหน', roman: 'pai wan-nǎi', english: 'What day are you going?', parts: ['ไป', 'วันไหน'] },
        { speaker: 'F', thai: 'ไปวันศุกร์', roman: 'pai wan-sùk', english: "I'm going on Friday.", parts: ['ไป', 'วันศุกร์'] },
      ],
      [
        { thai: 'วันไหน', roman: 'wan-nǎi', parts: ['วันไหน'] },
        { thai: 'ไปเมื่อไหร่', roman: 'pai mɯ̂a-rài', parts: ['ไป', 'เมื่อไหร่'] },
      ],
      SRC.days
    ),
    wordIntro('คน', 'kon', 'person (classifier for people)', SRC.who),
    wordIntro('ใคร', 'krai', 'who?', SRC.who),
    wordIntro('คนไหน', 'kon-nǎi', 'which person?', SRC.who),
    wordIntro('คนโน้น', 'kon-nóon', 'that person over there', SRC.who),
    mc('คนโน้นเป็นใคร', 'kon-nóon pen krai', "Who's that person over there?", ['Which person?', 'That person over there.', 'What day?'], ['คนโน้น', 'เป็น', 'ใคร'], SRC.who),
    order('Who is he?', [
      { roman: 'kháo', thai: 'เค้า' },
      { roman: 'pen', thai: 'เป็น' },
      { roman: 'krai', thai: 'ใคร' },
    ], SRC.who),
    mc('คนไหน', 'kon-nǎi', 'Which person?', ['Who?', 'That person over there.', 'Sunday.'], ['คนไหน'], SRC.who),
    speak('คนโน้นเป็นใคร', 'kon-nóon pen krai', "Who's that person over there?", ['คนโน้น', 'เป็น', 'ใคร'], SRC.who),
    reply(
      [
        { speaker: 'M', thai: 'คนโน้นเป็นใคร', roman: 'kon-nóon pen krai', english: "Who's that person over there?", parts: ['คนโน้น', 'เป็น', 'ใคร'] },
        { speaker: 'F', thai: 'เค้าเป็นเพื่อน', roman: 'kháo pen phɯ̂an', english: "He's a friend.", parts: ['เค้า', 'เป็น', 'เพื่อน'] },
      ],
      [
        { thai: 'คนไหน', roman: 'kon-nǎi', parts: ['คนไหน'] },
        { thai: 'วันอาทิตย์', roman: 'wan-aa-thít', parts: ['วันอาทิตย์'] },
      ],
      SRC.who
    ),
  ]),

  // --------------------------------------------------------------- b-dlg (new: Conversation)
  dialogue(
    'b-dlg',
    'Asking about a friend',
    'Two friends talking about someone they both know',
    [
      { speaker: 'A', thai: 'ใครคนโน้น', roman: 'krai kon-nóon', english: 'Who is that person over there?' },
      { speaker: 'B', thai: 'เค้าเป็นเพื่อน', roman: 'kháo pen phɯ̂an', english: "He's a friend." },
      { speaker: 'A', thai: 'เค้าหล่อมั้ย', roman: 'kháo lɔ̀ɔ mái', english: 'Is he handsome?' },
      { speaker: 'B', thai: 'ใช่แล้วก็รวยมาก', roman: 'châi láew-gɔ̂ɔ ruai mâak', english: 'Yes, and very rich.' },
      { speaker: 'A', thai: 'เค้าอยู่ที่ไหน', roman: 'kháo yùu thîi-nǎi', english: 'Where is he?' },
    ],
    [
      { type: 'intro' },
      {
        type: 'comprehension',
        lineIndex: 0,
        options: [
          { text: 'Who is that person over there?', correct: true },
          { text: "He's a friend.", correct: false },
          { text: 'Where is he?', correct: false },
          { text: 'Very rich.', correct: false },
        ],
      },
      {
        type: 'comprehension',
        lineIndex: 2,
        options: [
          { text: 'Is he handsome?', correct: true },
          { text: "He's a friend.", correct: false },
          { text: 'Where is he?', correct: false },
          { text: 'Yes, and very rich.', correct: false },
        ],
      },
      {
        type: 'translate',
        lineIndex: 1,
        options: [
          { text: "He's a friend.", correct: true },
          { text: 'Who is that person over there?', correct: false },
          { text: 'Where is he?', correct: false },
          { text: 'Very rich.', correct: false },
        ],
      },
      {
        type: 'translate',
        lineIndex: 3,
        options: [
          { text: 'Yes, and very rich.', correct: true },
          { text: "He's a friend.", correct: false },
          { text: 'Is he handsome?', correct: false },
          { text: 'Where is he?', correct: false },
        ],
      },
      {
        type: 'blank',
        lineIndex: 4,
        before: 'kháo yùu',
        after: '',
        options: [
          { text: 'thîi-nǎi', correct: true },
          { text: 'kon-nóon', correct: false },
          { text: 'phɯ̂an', correct: false },
          { text: 'rong-raem', correct: false },
        ],
      },
      { type: 'speak', lineIndex: 1 },
      { type: 'speak', lineIndex: 3 },
    ]
  ),
];

const basicsSubject = subject(
  'basics',
  'Basics: Everyday Sentences',
  'phɯ́ɯn-thǎan',
  'Real Thai sentence patterns from Essential Thai: this/that, adjectives, to be, yes/no and confirmation questions, colors, days of the week, and basic verbs.',
  lessons
);

module.exports = { basicsSubject };
