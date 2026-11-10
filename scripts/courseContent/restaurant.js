// "Order at a Restaurant" — transcribed from real textbook pages (Thai
// script, romanization, and English meanings are all copied from the
// source, not invented): mostly the Food chapter of Essential Thai: A Guide
// to the Basics of the Thai Language by James Higbie (2nd ed., Orchid
// Press), pp.116-128, plus its Numbers (p.17) and Pronunciation (pp.8-9)
// chapters. Every step cites its exact source page.
//
// Romanization matches the diacritic convention already used elsewhere in
// this app's src/data.ts (khɔ̌ɔ, dûai, gɛ̂ɛo, phèt, gài, chék-bin, náam,
// nɯ̀ng, sɔ̌ɔng, sǎam, mii, à-rai, mâi are all reused verbatim from words
// data.ts already teaches in its own Restaurant/Numbers/Greetings/Family
// units) rather than Higbie's own plain-letter-plus-underline system, since
// that typographic system doesn't survive into plain text fields anyway.
//
// Lessons are paired up from the original 19 short (~7-8 step) lessons into
// 10 longer (~14-18 step) ones — no step content was rewritten, only
// regrouped — plus one closing Conversation lesson that recombines vocab
// already taught here into a short dialogue (see checkDictionary/
// interleaveWordIntros in scripts/lib/courseBuilder.js, which re-flow the
// merged wordIntro/content steps to alternate teach/test either way).
'use strict';

const { romanTable, rewriteLessons } = require('../lib/phraseLessons');

const { wordIntro, rule, mc, order, speak, dialogue, lesson, subject } = require('../lib/courseBuilder');

const SRC = {
  ordering: 'Essential Thai (Higbie), p.116',
  more: 'Essential Thai (Higbie), p.117',
  phrases: 'Essential Thai (Higbie), p.118',
  eating: 'Essential Thai (Higbie), p.119',
  drinks: 'Essential Thai (Higbie), p.120',
  beer: 'Essential Thai (Higbie), p.121',
  fried: 'Essential Thai (Higbie), p.126',
  vegetarian: 'Essential Thai (Higbie), p.132',
  market: 'Essential Thai (Higbie), p.134',
  numbers: 'Essential Thai (Higbie), p.17',
  pronunciation: 'Essential Thai (Higbie), pp.8-9',
  connector: 'Essential Thai (Higbie), general reference (connecting words)',
};

const lessons = [
  // --------------------------------------------------------------- r01+r02
  lesson('r01', 'Asking for a menu, and what they have', [
    rule(
      'Thai tones',
      'Thai has five tones: mid, low, falling, high, and rising. The same syllable changes meaning with its tone — ' +
        'mái (high) is "wood", mài (low) is "new", and mǎi (rising) is "silk". Getting the tone right changes the word.',
      SRC.pronunciation
    ),
    wordIntro('ขอ', 'khɔ̌ɔ', 'may I have / please give me', SRC.ordering),
    wordIntro('เมนู', 'menuu', 'menu', SRC.phrases),
    wordIntro('ด้วย', 'dûai', 'please / also', SRC.ordering),
    mc('ขอเมนูด้วย', 'khɔ̌ɔ menuu dûai', 'May I have a menu?', ['Check, please.', 'What do you have?', 'I like it very much.'], ['ขอ', 'เมนู', 'ด้วย'], SRC.phrases),
    order('May I have a menu?', [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'menuu', thai: 'เมนู' },
      { roman: 'dûai', thai: 'ด้วย' },
    ], SRC.phrases),
    speak('ขอเมนูด้วย', 'khɔ̌ɔ menuu dûai', 'May I have a menu?', ['ขอ', 'เมนู', 'ด้วย'], SRC.phrases),
    wordIntro('มี', 'mii', 'have / there is', SRC.phrases),
    wordIntro('อะไร', 'à-rai', 'what', SRC.phrases),
    wordIntro('บ้าง', 'bâang', 'some / any', SRC.phrases),
    mc('มีอะไรบ้าง', 'mii à-rai bâang', 'What do you have?', ['May I have a menu?', 'Check, please.', 'It is very good.'], ['มี', 'อะไร', 'บ้าง'], SRC.phrases),
    order('What do you have?', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'à-rai', thai: 'อะไร' },
      { roman: 'bâang', thai: 'บ้าง' },
    ], SRC.phrases),
    mc('ขอเมนูด้วย', 'khɔ̌ɔ menuu dûai', 'May I have a menu?', ['What do you have?', 'Check, please.', 'How much is it?'], ['ขอ', 'เมนู', 'ด้วย'], SRC.phrases),
    speak('มีอะไรบ้าง', 'mii à-rai bâang', 'What do you have?', ['มี', 'อะไร', 'บ้าง'], SRC.phrases),
  ]),

  // --------------------------------------------------------------- r03+r04
  lesson('r02', 'Numbers, plates, and water', [
    rule(
      'Counting in Thai',
      'Numbers in Thai go before the container or classifier word when they are more than one — but "one" can go either ' +
        'before or after it. Learn one to ten and you can build almost any number.',
      SRC.numbers
    ),
    wordIntro('หนึ่ง', 'nɯ̀ng', 'one', SRC.numbers),
    wordIntro('สอง', 'sɔ̌ɔng', 'two', SRC.numbers),
    wordIntro('สาม', 'sǎam', 'three', SRC.numbers),
    mc('หนึ่ง', 'nɯ̀ng', 'One', ['Two', 'Three', 'Menu'], ['หนึ่ง'], SRC.numbers),
    mc('สอง', 'sɔ̌ɔng', 'Two', ['One', 'Three', 'What do you have?'], ['สอง'], SRC.numbers),
    mc('สาม', 'sǎam', 'Three', ['One', 'Two', 'Please'], ['สาม'], SRC.numbers),
    order('One, two, three', [
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'sǎam', thai: 'สาม' },
    ], SRC.numbers),
    speak('หนึ่ง', 'nɯ̀ng', 'one', ['หนึ่ง'], SRC.numbers),
    speak('สอง', 'sɔ̌ɔng', 'two', ['สอง'], SRC.numbers),
    wordIntro('จาน', 'jaan', 'plate', SRC.ordering),
    wordIntro('แก้ว', 'gɛ̂ɛo', 'glass', SRC.ordering),
    wordIntro('น้ำ', 'náam', 'water', SRC.drinks),
    wordIntro('กับ', 'gàp', 'and / with', SRC.connector),
    mc('ขอน้ำด้วย', 'khɔ̌ɔ náam dûai', 'May I have some water?', ['May I have a menu?', 'What do you have?', 'One, please.'], ['ขอ', 'น้ำ', 'ด้วย'], SRC.drinks),
    order("I'd like a plate and a glass.", [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'jaan', thai: 'จาน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'gɛ̂ɛo', thai: 'แก้ว' },
    ], SRC.drinks),
    mc('ขอจานกับแก้ว', 'khɔ̌ɔ jaan gàp gɛ̂ɛo', "I'd like a plate and a glass.", ['May I have some water?', 'What do you have?', 'Two glasses, please.'], ['ขอ', 'จาน', 'กับ', 'แก้ว'], SRC.ordering),
    speak('ขอน้ำกับจาน', 'khɔ̌ɔ náam gàp jaan', 'May I have water and a plate?', ['ขอ', 'น้ำ', 'กับ', 'จาน'], SRC.drinks),
  ]),

  // --------------------------------------------------------------- r05+r06
  lesson('r03', 'Ordering fried rice, and more', [
    wordIntro('ข้าวผัด', 'khâao-phàt', 'fried rice', SRC.ordering),
    wordIntro('ไก่', 'gài', 'chicken', SRC.ordering),
    wordIntro('ใส่', 'sài', 'put / with', SRC.ordering),
    mc('ขอข้าวผัดไก่หนึ่งจาน', 'khɔ̌ɔ khâao-phàt gài nɯ̀ng jaan', "I'd like one plate of fried rice with chicken.", ['May I have some water?', 'What do you have?', 'I like fried rice.'], ['ขอ', 'ข้าวผัด', 'ไก่', 'หนึ่ง', 'จาน'], SRC.ordering),
    order('Fried rice with chicken, please.', [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'khâao-phàt', thai: 'ข้าวผัด' },
      { roman: 'gài', thai: 'ไก่' },
    ], SRC.ordering),
    mc('ใส่ไก่', 'sài gài', 'with chicken', ['without meat', 'two glasses', 'very spicy'], ['ใส่', 'ไก่'], SRC.ordering),
    speak('ข้าวผัดไก่', 'khâao-phàt gài', 'fried rice with chicken', ['ข้าวผัด', 'ไก่'], SRC.ordering),
    speak('ใส่', 'sài', 'put / with', ['ใส่'], SRC.ordering),
    wordIntro('อีก', 'ìik', 'more / another', SRC.more),
    wordIntro('ขวด', 'khùat', 'bottle', SRC.more),
    wordIntro('หมู', 'mǔu', 'pork', SRC.ordering),
    mc('ขอข้าวผัดอีกจานหนึ่งกับน้ำ', 'khɔ̌ɔ khâao-phàt ìik jaan nɯ̀ng gàp náam', "I'd like one more plate of fried rice, and water.", ["One plate of fried rice with chicken, please.", "Two more glasses of water, please.", "What do you have?"], ['ขอ', 'ข้าวผัด', 'อีก', 'จาน', 'หนึ่ง', 'กับ', 'น้ำ'], SRC.more),
    order('Two more glasses of water, please.', [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'náam', thai: 'น้ำ' },
      { roman: 'ìik', thai: 'อีก' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'gɛ̂ɛo', thai: 'แก้ว' },
    ], SRC.more),
    mc('ขอข้าวผัดหมูสองจานกับขวด', 'khɔ̌ɔ khâao-phàt mǔu sɔ̌ɔng jaan gàp khùat', "I'd like two plates of fried rice with pork, and a bottle.", ["One more plate, please.", "What do you have?", "May I have a menu?"], ['ขอ', 'ข้าวผัด', 'หมู', 'สอง', 'จาน', 'กับ', 'ขวด'], SRC.ordering),
    speak('อีก', 'ìik', 'more / another', ['อีก'], SRC.more),
    speak('ขวด', 'khùat', 'bottle', ['ขวด'], SRC.more),
  ]),

  // --------------------------------------------------------------- r07+r08
  lesson('r04', 'With, without, and spicy', [
    wordIntro('ไม่', 'mâi', 'not', SRC.more),
    wordIntro('เนื้อ', 'nɯ́a', 'beef', SRC.more),
    wordIntro('น้ำตาล', 'náam-taan', 'sugar', SRC.more),
    mc('ไม่ใส่เนื้อกับใส่น้ำตาล', 'mâi sài nɯ́a gàp sài náam-taan', 'without meat, and with sugar', ["with chicken, please.", "One more bottle, please.", "Two plates, please."], ['ไม่', 'ใส่', 'เนื้อ', 'กับ', 'ใส่', 'น้ำตาล'], SRC.more),
    order('with sugar, and without meat', [
      { roman: 'sài', thai: 'ใส่' },
      { roman: 'náam-taan', thai: 'น้ำตาล' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'sài', thai: 'ใส่' },
      { roman: 'nɯ́a', thai: 'เนื้อ' },
    ], SRC.more),
    mc('ใส่น้ำตาล', 'sài náam-taan', 'with sugar', ['without meat', 'more water', 'two plates'], ['ใส่', 'น้ำตาล'], SRC.more),
    speak('ไม่ใส่เนื้อกับใส่น้ำตาล', 'mâi sài nɯ́a gàp sài náam-taan', 'without meat, and with sugar', ['ไม่', 'ใส่', 'เนื้อ', 'กับ', 'ใส่', 'น้ำตาล'], SRC.more),
    speak('น้ำตาล', 'náam-taan', 'sugar', ['น้ำตาล'], SRC.more),
    wordIntro('เผ็ด', 'phèt', 'spicy / hot', SRC.more),
    wordIntro('พริก', 'phrík', 'chili pepper', SRC.more),
    wordIntro('เลย', 'loei', 'at all', SRC.more),
    mc('ไม่ใส่พริกกับไม่เผ็ดเลย', 'mâi sài phrík gàp mâi phèt loei', 'without pepper, and not spicy at all', ["with sugar, please.", "without meat, please.", "One more plate, please."], ['ไม่', 'ใส่', 'พริก', 'กับ', 'ไม่', 'เผ็ด', 'เลย'], SRC.more),
    order('not hot at all', [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'phèt', thai: 'เผ็ด' },
      { roman: 'loei', thai: 'เลย' },
    ], SRC.more),
    mc('ไม่เผ็ดเลย', 'mâi phèt loei', 'not hot at all', ['without pepper', 'with sugar', 'one more plate'], ['ไม่', 'เผ็ด', 'เลย'], SRC.more),
    speak('ไม่ใส่พริกกับไม่เผ็ดเลย', 'mâi sài phrík gàp mâi phèt loei', 'without pepper, and not spicy at all', ['ไม่', 'ใส่', 'พริก', 'กับ', 'ไม่', 'เผ็ด', 'เลย'], SRC.more),
    speak('พริก', 'phrík', 'chili pepper', ['พริก'], SRC.more),
  ]),

  // --------------------------------------------------------------- r09+r10
  lesson('r05', 'Hot and iced drinks', [
    wordIntro('กาแฟ', 'gaa-fɛɛ', 'coffee', SRC.drinks),
    wordIntro('ชา', 'chaa', 'tea', SRC.drinks),
    wordIntro('ร้อน', 'rɔ́ɔn', 'hot (temperature)', SRC.drinks),
    wordIntro('แล้วก็', 'láew-gɔ̂ɔ', 'and then / also', SRC.connector),
    mc('ขอกาแฟร้อนแล้วก็ชาร้อนด้วย', 'khɔ̌ɔ gaa-fɛɛ rɔ́ɔn láew-gɔ̂ɔ chaa rɔ́ɔn dûai', "I'd like hot coffee, and hot tea too.", ["I'd like fried rice with chicken.", "not hot at all", "Two more glasses of water, please."], ['ขอ', 'กาแฟ', 'ร้อน', 'แล้วก็', 'ชา', 'ร้อน', 'ด้วย'], SRC.drinks),
    order('May I have hot coffee, and tea too?', [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'gaa-fɛɛ', thai: 'กาแฟ' },
      { roman: 'rɔ́ɔn', thai: 'ร้อน' },
      { roman: 'láew-gɔ̂ɔ', thai: 'แล้วก็' },
      { roman: 'chaa', thai: 'ชา' },
      { roman: 'dûai', thai: 'ด้วย' },
    ], SRC.drinks),
    mc('ขอชาร้อนด้วย', 'khɔ̌ɔ chaa rɔ́ɔn dûai', 'May I have hot tea?', ['May I have a menu?', 'without meat', 'two glasses, please'], ['ขอ', 'ชา', 'ร้อน', 'ด้วย'], SRC.drinks),
    speak('กาแฟร้อน', 'gaa-fɛɛ rɔ́ɔn', 'hot coffee', ['กาแฟ', 'ร้อน'], SRC.drinks),
    speak('ชา', 'chaa', 'tea', ['ชา'], SRC.drinks),
    wordIntro('เย็น', 'yen', 'cold / iced', SRC.drinks),
    wordIntro('เปล่า', 'plào', 'plain', SRC.drinks),
    wordIntro('ที่', 'thîi', 'order (classifier)', SRC.ordering),
    mc('ขอกาแฟเย็นแล้วก็ชาเย็นด้วย', 'khɔ̌ɔ gaa-fɛɛ yen láew-gɔ̂ɔ chaa yen dûai', "I'd like iced coffee, and iced tea too.", ["hot coffee, please.", "plain water, please.", "two orders of fried rice with pork."], ['ขอ', 'กาแฟ', 'เย็น', 'แล้วก็', 'ชา', 'เย็น', 'ด้วย'], SRC.drinks),
    order("I'd like one bottle of plain water, and iced coffee.", [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'náam', thai: 'น้ำ' },
      { roman: 'plào', thai: 'เปล่า' },
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'khùat', thai: 'ขวด' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'gaa-fɛɛ', thai: 'กาแฟ' },
      { roman: 'yen', thai: 'เย็น' },
    ], SRC.drinks),
    mc('ขอข้าวผัดหมูสองที่', 'khɔ̌ɔ khâao-phàt mǔu sɔ̌ɔng thîi', "I'd like two orders of fried rice with pork.", ['One large bottle, please.', 'Iced coffee, please.', 'Not hot at all.'], ['ขอ', 'ข้าวผัด', 'หมู', 'สอง', 'ที่'], SRC.ordering),
    speak('น้ำเปล่า', 'náam plào', 'plain water', ['น้ำ', 'เปล่า'], SRC.drinks),
    speak('กาแฟเย็น', 'gaa-fɛɛ yen', 'iced coffee', ['กาแฟ', 'เย็น'], SRC.drinks),
  ]),

  // --------------------------------------------------------------- r11+r12
  lesson('r06', 'Beer sizes, and flavors', [
    wordIntro('เบียร์', 'bia', 'beer', SRC.beer),
    wordIntro('ใหญ่', 'yài', 'large', SRC.beer),
    wordIntro('เล็ก', 'lék', 'small', SRC.beer),
    mc('ขอเบียร์ขวดใหญ่กับข้าวผัดไก่หนึ่งจาน', 'khɔ̌ɔ bia khùat yài gàp khâao-phàt gài nɯ̀ng jaan', "I'd like one large bottle of beer, and one plate of fried rice with chicken.", ["One small bottle, please.", "Iced tea, please.", "Not spicy at all."], ['ขอ', 'เบียร์', 'ขวด', 'ใหญ่', 'กับ', 'ข้าวผัด', 'ไก่', 'หนึ่ง', 'จาน'], SRC.beer),
    order("I'd like one small bottle of beer, and water.", [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'bia', thai: 'เบียร์' },
      { roman: 'khùat', thai: 'ขวด' },
      { roman: 'lék', thai: 'เล็ก' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'náam', thai: 'น้ำ' },
    ], SRC.beer),
    mc('ขวดใหญ่', 'khùat yài', 'large bottle', ['small bottle', 'iced coffee', 'more water'], ['ขวด', 'ใหญ่'], SRC.beer),
    speak('ใหญ่', 'yài', 'large', ['ใหญ่'], SRC.beer),
    speak('เล็ก', 'lék', 'small', ['เล็ก'], SRC.beer),
    wordIntro('หวาน', 'wǎan', 'sweet', SRC.eating),
    wordIntro('เปรี้ยว', 'prîao', 'sour', SRC.eating),
    wordIntro('เค็ม', 'khem', 'salty', SRC.eating),
    mc('ขอข้าวผัดไก่เปรี้ยวหวานกับน้ำเปล่า', 'khɔ̌ɔ khâao-phàt gài prîao-wǎan gàp náam plào', "I'd like sweet and sour fried rice with chicken, and plain water.", ["Spicy fried rice with pork, please.", "One large bottle of beer, please.", "Iced coffee, please."], ['ขอ', 'ข้าวผัด', 'ไก่', 'เปรี้ยว', 'หวาน', 'กับ', 'น้ำ', 'เปล่า'], SRC.eating),
    order('sweet, sour, and not salty', [
      { roman: 'wǎan', thai: 'หวาน' },
      { roman: 'prîao', thai: 'เปรี้ยว' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'khem', thai: 'เค็ม' },
    ], SRC.eating),
    mc('ไม่เค็มกับไม่เผ็ดเลย', 'mâi khem gàp mâi phèt loei', 'not salty, and not spicy at all', ["without pepper, please.", "with sugar, please.", "One more plate, please."], ['ไม่', 'เค็ม', 'กับ', 'ไม่', 'เผ็ด', 'เลย'], SRC.eating),
    speak('หวาน', 'wǎan', 'sweet', ['หวาน'], SRC.eating),
    speak('เค็ม', 'khem', 'salty', ['เค็ม'], SRC.eating),
  ]),

  // --------------------------------------------------------------- r13+r14
  lesson('r07', 'Utensils, help, and the bill', [
    wordIntro('ช้อน', 'chɔ́ɔn', 'spoon', SRC.phrases),
    wordIntro('ส้อม', 'sɔ̂m', 'fork', SRC.phrases),
    wordIntro('ช่วยเช็ดโต๊ะหน่อย', 'chûai chét tó nɔ̀i', 'Please wipe off the table.', SRC.phrases),
    mc('ช่วยเช็ดโต๊ะหน่อยขอช้อนกับส้อมด้วย', 'chûai chét tó nɔ̀i, khɔ̌ɔ chɔ́ɔn gàp sɔ̂m dûai', 'Please wipe off the table, and may I have a spoon and fork?', ["May I have a menu, please?", "One more bottle, please.", "Not spicy, please."], ['ช่วยเช็ดโต๊ะหน่อย', 'ขอ', 'ช้อน', 'กับ', 'ส้อม', 'ด้วย'], SRC.phrases),
    order('Please wipe off the table, and may I have a spoon and fork?', [
      { roman: 'chûai chét tó nɔ̀i', thai: 'ช่วยเช็ดโต๊ะหน่อย' },
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'chɔ́ɔn', thai: 'ช้อน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'sɔ̂m', thai: 'ส้อม' },
      { roman: 'dûai', thai: 'ด้วย' },
    ], SRC.phrases),
    mc('ขอน้ำเปล่ากับขอเบียร์ขวดเล็ก', 'khɔ̌ɔ náam plào gàp khɔ̌ɔ bia khùat lék', 'May I have plain water, and a small bottle of beer?', ["May I have a menu, please?", "One large bottle of beer, please.", "Not salty at all."], ['ขอ', 'น้ำ', 'เปล่า', 'กับ', 'ขอ', 'เบียร์', 'ขวด', 'เล็ก'], SRC.phrases),
    speak('ช้อน', 'chɔ́ɔn', 'spoon', ['ช้อน'], SRC.phrases),
    speak('ส้อม', 'sɔ̂m', 'fork', ['ส้อม'], SRC.phrases),
    wordIntro('เช็คบิล', 'chék-bin', 'the bill', SRC.phrases),
    wordIntro('ต้อง', 'tɔ̂ng', 'have to / need to', SRC.phrases),
    wordIntro('ทอน', 'thɔɔn', 'give change', SRC.phrases),
    mc('ขอเช็คบิลด้วยกับไม่ต้องทอน', 'khɔ̌ɔ chék-bin dûai gàp mâi tɔ̂ng thɔɔn', 'May I have the check, and keep the change.', ["May I have a menu?", "Please wipe off the table.", "One more, please."], ['ขอ', 'เช็คบิล', 'ด้วย', 'กับ', 'ไม่', 'ต้อง', 'ทอน'], SRC.phrases),
    order('May I have the check, and keep the change.', [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'chék-bin', thai: 'เช็คบิล' },
      { roman: 'dûai', thai: 'ด้วย' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'tɔ̂ng', thai: 'ต้อง' },
      { roman: 'thɔɔn', thai: 'ทอน' },
    ], SRC.phrases),
    mc('ไม่ต้องทอน', 'mâi tɔ̂ng thɔɔn', 'Keep the change.', ['Check, please.', 'Please wipe off the table.', 'What do you have?'], ['ไม่', 'ต้อง', 'ทอน'], SRC.phrases),
    speak('ขอเช็คบิลด้วยกับไม่ต้องทอน', 'khɔ̌ɔ chék-bin dûai gàp mâi tɔ̂ng thɔɔn', 'May I have the check, and keep the change.', ['ขอ', 'เช็คบิล', 'ด้วย', 'กับ', 'ไม่', 'ต้อง', 'ทอน'], SRC.phrases),
    speak('ไม่ต้องทอน', 'mâi tɔ̂ng thɔɔn', 'Keep the change.', ['ไม่', 'ต้อง', 'ทอน'], SRC.phrases),
  ]),

  // --------------------------------------------------------------- r15+r16
  lesson('r08', "Vegetarian, and asking for tofu", [
    wordIntro('ฉัน', 'chán', 'I', SRC.vegetarian),
    wordIntro('กิน', 'gin', 'eat', SRC.vegetarian),
    wordIntro('เจ', 'jee', 'vegetarian (style of food)', SRC.vegetarian),
    mc('ฉันกินเจกับไม่กินเนื้อ', 'chán gin jee gàp mâi gin nɯ́a', "I'm a vegetarian, and I don't eat meat.", ["I'd like fried rice with chicken.", "Check, please.", "Not hot at all."], ['ฉัน', 'กิน', 'เจ', 'กับ', 'ไม่', 'กิน', 'เนื้อ'], SRC.vegetarian),
    order("I'm a vegetarian, and I don't eat pork.", [
      { roman: 'chán', thai: 'ฉัน' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'jee', thai: 'เจ' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'mǔu', thai: 'หมู' },
    ], SRC.vegetarian),
    mc('ฉันกินเจกับไม่ใส่พริก', 'chán gin jee gàp mâi sài phrík', "I'm a vegetarian, and no chili peppers.", ["Keep the change.", "May I have a menu?", "One more bottle, please."], ['ฉัน', 'กิน', 'เจ', 'กับ', 'ไม่', 'ใส่', 'พริก'], SRC.vegetarian),
    speak('ฉันกินเจกับไม่กินเนื้อ', 'chán gin jee gàp mâi gin nɯ́a', "I'm a vegetarian, and I don't eat meat.", ['ฉัน', 'กิน', 'เจ', 'กับ', 'ไม่', 'กิน', 'เนื้อ'], SRC.vegetarian),
    speak('กินเจ', 'gin jee', 'eat vegetarian food', ['กิน', 'เจ'], SRC.vegetarian),
    wordIntro('เต้าหู้', 'tâo-hûu', 'tofu', SRC.vegetarian),
    wordIntro('น้ำมันพืช', 'náam-man-phɯ̂ɯt', 'vegetable oil', SRC.vegetarian),
    wordIntro('มั้ย', 'mái', 'question particle (do you...?)', SRC.vegetarian),
    mc('ฉันกินเจไม่กินเนื้อมีเต้าหู้มั้ย', 'chán gin jee mâi gin nɯ́a mii tâo-hûu mái', "I'm a vegetarian, I don't eat meat — do you have tofu?", ["I like sweet and sour fried rice with chicken.", "One large bottle of beer, please.", "Please wipe off the table."], ['ฉัน', 'กิน', 'เจ', 'ไม่', 'กิน', 'เนื้อ', 'มี', 'เต้าหู้', 'มั้ย'], SRC.vegetarian),
    order("I'm a vegetarian — do you have tofu and vegetable oil?", [
      { roman: 'chán', thai: 'ฉัน' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'jee', thai: 'เจ' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'tâo-hûu', thai: 'เต้าหู้' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'náam-man-phɯ̂ɯt', thai: 'น้ำมันพืช' },
      { roman: 'mái', thai: 'มั้ย' },
    ], SRC.vegetarian),
    mc('มีเต้าหู้กับน้ำมันพืชมั้ย', 'mii tâo-hûu gàp náam-man-phɯ̂ɯt mái', 'Do you have tofu and vegetable oil?', ['Do you have tofu?', 'I’m a vegetarian.', 'Keep the change.'], ['มี', 'เต้าหู้', 'กับ', 'น้ำมันพืช', 'มั้ย'], SRC.vegetarian),
    speak('ฉันกินเจไม่กินเนื้อมีเต้าหู้มั้ย', 'chán gin jee mâi gin nɯ́a mii tâo-hûu mái', "I'm a vegetarian, I don't eat meat — do you have tofu?", ['ฉัน', 'กิน', 'เจ', 'ไม่', 'กิน', 'เนื้อ', 'มี', 'เต้าหู้', 'มั้ย'], SRC.vegetarian),
  ]),

  // --------------------------------------------------------------- r17+r18
  lesson('r09', 'Eggs, and price per kilo', [
    wordIntro('ไข่', 'khài', 'egg', SRC.vegetarian),
    wordIntro('ได้', 'dâi', 'can / able to', SRC.vegetarian),
    mc('ฉันกินเจไม่ใส่ไข่ได้มั้ย', 'chán gin jee mâi sài khài dâi mái', "I'm a vegetarian — can you make it without eggs?", ["without meat, please.", "Do you have tofu?", "Check, please."], ['ฉัน', 'กิน', 'เจ', 'ไม่', 'ใส่', 'ไข่', 'ได้', 'มั้ย'], SRC.vegetarian),
    order("I'm a vegetarian, without eggs, and without meat.", [
      { roman: 'chán', thai: 'ฉัน' },
      { roman: 'gin', thai: 'กิน' },
      { roman: 'jee', thai: 'เจ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'sài', thai: 'ใส่' },
      { roman: 'khài', thai: 'ไข่' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'sài', thai: 'ใส่' },
      { roman: 'nɯ́a', thai: 'เนื้อ' },
    ], SRC.vegetarian),
    mc('ไม่กินเนื้อใส่ไข่ได้มั้ย', 'mâi gin nɯ́a sài khài dâi mái', "I don't eat meat — can you put egg in it?", ["without eggs, please.", "Do you have tofu?", "Check, please."], ['ไม่', 'กิน', 'เนื้อ', 'ใส่', 'ไข่', 'ได้', 'มั้ย'], SRC.vegetarian),
    speak('ฉันกินเจไม่ใส่ไข่ได้มั้ย', 'chán gin jee mâi sài khài dâi mái', "I'm a vegetarian — can you make it without eggs?", ['ฉัน', 'กิน', 'เจ', 'ไม่', 'ใส่', 'ไข่', 'ได้', 'มั้ย'], SRC.vegetarian),
    speak('ใส่ไข่ได้', 'sài khài dâi', 'You can put eggs in it.', ['ใส่', 'ไข่', 'ได้'], SRC.vegetarian),
    wordIntro('โล', 'loo', 'kilogram', SRC.market),
    wordIntro('ละ', 'lá', 'per', SRC.market),
    wordIntro('เท่าไหร่', 'thâo-rài', 'how much', SRC.market),
    mc('ขอสองโลกับโลละเท่าไหร่', 'khɔ̌ɔ sɔ̌ɔng loo gàp loo lá thâo-rài', "I'd like two kilos — how much per kilo?", ["Do you have tofu?", "One plate, please.", "Not spicy at all."], ['ขอ', 'สอง', 'โล', 'กับ', 'โล', 'ละ', 'เท่าไหร่'], SRC.market),
    order("I'd like two kilos of chicken, and how much per kilo?", [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'gài', thai: 'ไก่' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'loo', thai: 'โล' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'loo', thai: 'โล' },
      { roman: 'lá', thai: 'ละ' },
      { roman: 'thâo-rài', thai: 'เท่าไหร่' },
    ], SRC.market),
    mc('ขอเต้าหู้สองโลกับน้ำมันพืชหนึ่งโล', 'khɔ̌ɔ tâo-hûu sɔ̌ɔng loo gàp náam-man-phɯ̂ɯt nɯ̀ng loo', "I'd like two kilos of tofu, and one kilo of vegetable oil.", ["How much is a kilo?", "One plate, please.", "May I have some water?"], ['ขอ', 'เต้าหู้', 'สอง', 'โล', 'กับ', 'น้ำมันพืช', 'หนึ่ง', 'โล'], SRC.market),
    speak('ขอสองโลกับโลละเท่าไหร่', 'khɔ̌ɔ sɔ̌ɔng loo gàp loo lá thâo-rài', "I'd like two kilos — how much per kilo?", ['ขอ', 'สอง', 'โล', 'กับ', 'โล', 'ละ', 'เท่าไหร่'], SRC.market),
  ]),

  // --------------------------------------------------------------- r19 (solo — already ~8 steps, a natural closer before the Conversation)
  lesson('r10', 'How many kilos do you want?', [
    wordIntro('เอา', 'ao', 'want / take', SRC.market),
    wordIntro('กี่', 'gìi', 'how many', SRC.market),
    wordIntro('ครึ่ง', 'khrɯ̂ng', 'half', SRC.market),
    mc('ฉันกินเจไม่กินเนื้อเอาเต้าหู้สองโล', 'chán gin jee mâi gin nɯ́a ao tâo-hûu sɔ̌ɔng loo', "I'm a vegetarian, I don't eat meat, I'll take two kilos of tofu.", ["How many kilos do you want?", "I'd like two kilos.", "Do you have tofu?"], ['ฉัน', 'กิน', 'เจ', 'ไม่', 'กิน', 'เนื้อ', 'เอา', 'เต้าหู้', 'สอง', 'โล'], SRC.market),
    order("I'd like fried rice with chicken, I'll take half a kilo of tofu, and how much per kilo?", [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'khâao-phàt', thai: 'ข้าวผัด' },
      { roman: 'gài', thai: 'ไก่' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'ao', thai: 'เอา' },
      { roman: 'tâo-hûu', thai: 'เต้าหู้' },
      { roman: 'khrɯ̂ng', thai: 'ครึ่ง' },
      { roman: 'loo', thai: 'โล' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'loo', thai: 'โล' },
      { roman: 'lá', thai: 'ละ' },
      { roman: 'thâo-rài', thai: 'เท่าไหร่' },
    ], SRC.market),
    mc('เอาเต้าหู้ครึ่งโลกับน้ำมันพืชหนึ่งโล', 'ao tâo-hûu khrɯ̂ng loo gàp náam-man-phɯ̂ɯt nɯ̀ng loo', "I'll take half a kilo of tofu, and one kilo of vegetable oil.", ["How many kilos do you want?", "I'd like two kilos.", "Not salty at all."], ['เอา', 'เต้าหู้', 'ครึ่ง', 'โล', 'กับ', 'น้ำมันพืช', 'หนึ่ง', 'โล'], SRC.market),
    speak('ฉันกินเจไม่กินเนื้อเอาเต้าหู้สองโล', 'chán gin jee mâi gin nɯ́a ao tâo-hûu sɔ̌ɔng loo', "I'm a vegetarian, I don't eat meat, I'll take two kilos of tofu.", ['ฉัน', 'กิน', 'เจ', 'ไม่', 'กิน', 'เนื้อ', 'เอา', 'เต้าหู้', 'สอง', 'โล'], SRC.market),
    speak('ฉันกินเจไม่กินเนื้อเอาเต้าหู้สองโลกับน้ำ', 'chán gin jee mâi gin nɯ́a ao tâo-hûu sɔ̌ɔng loo gàp náam', "I'm a vegetarian, I don't eat meat, I'll take two kilos of tofu, and water.", ['ฉัน', 'กิน', 'เจ', 'ไม่', 'กิน', 'เนื้อ', 'เอา', 'เต้าหู้', 'สอง', 'โล', 'กับ', 'น้ำ'], SRC.market),
  ]),

  // --------------------------------------------------------------- Conversation
  dialogue(
    'restaurant-dlg',
    'Ordering dinner',
    'Two friends order food, skip the spice, and ask for the check.',
    [
      { speaker: 'A', thai: 'ขอเมนูด้วย', roman: 'khɔ̌ɔ menuu dûai', english: 'May I have a menu?' },
      { speaker: 'B', thai: 'ขอข้าวผัดไก่หนึ่งจาน', roman: 'khɔ̌ɔ khâao-phàt gài nɯ̀ng jaan', english: "I'd like one plate of fried rice with chicken." },
      { speaker: 'A', thai: 'ไม่ใส่พริก ไม่เผ็ดเลย', roman: 'mâi sài phrík, mâi phèt loei', english: 'No chili — not spicy at all.' },
      { speaker: 'B', thai: 'ขอเช็คบิลด้วย', roman: 'khɔ̌ɔ chék-bin dûai', english: 'Check, please.' },
    ],
    [
      { type: 'intro' },
      {
        type: 'comprehension',
        lineIndex: 0,
        options: [
          { text: 'May I have a menu?', correct: true },
          { text: 'What do you have?', correct: false },
          { text: 'Check, please.', correct: false },
          { text: 'Not spicy at all.', correct: false },
        ],
      },
      {
        type: 'comprehension',
        lineIndex: 2,
        options: [
          { text: 'No chili — not spicy at all.', correct: true },
          { text: 'May I have a menu?', correct: false },
          { text: "I'd like one plate of fried rice with chicken.", correct: false },
          { text: 'Check, please.', correct: false },
        ],
      },
      {
        type: 'translate',
        lineIndex: 1,
        options: [
          { text: "I'd like one plate of fried rice with chicken.", correct: true },
          { text: 'May I have a menu?', correct: false },
          { text: 'Check, please.', correct: false },
          { text: 'Keep the change.', correct: false },
        ],
      },
      {
        type: 'translate',
        lineIndex: 3,
        options: [
          { text: 'Check, please.', correct: true },
          { text: 'May I have some water?', correct: false },
          { text: 'What do you have?', correct: false },
          { text: 'One more plate, please.', correct: false },
        ],
      },
      {
        type: 'blank',
        lineIndex: 2,
        before: 'mâi sài',
        after: ', mâi phèt loei',
        options: [
          { text: 'phrík', correct: true },
          { text: 'nɯ́a', correct: false },
          { text: 'khài', correct: false },
          { text: 'náam-taan', correct: false },
        ],
      },
      { type: 'speak', lineIndex: 1 },
      { type: 'speak', lineIndex: 3 },
    ]
  ),
];

// 2026-11-08: r03-r10 rebuilt to lesson 1's standard — short real phrases plus a reply() chat step (see
// scripts/lib/phraseLessons.js). Rules and word cards above are unchanged.
const REWRITES = {
  r03: { phrases: [
    'ขอ ข้าวผัด ไก่ หนึ่ง จาน|One chicken fried rice, please.',
    'ใส่ ไก่|with chicken',
    'ข้าวผัด หมู|pork fried rice',
    'ขอ อีก จาน หนึ่ง|One more plate, please.',
    'ขอ น้ำ อีก ขวด|Another bottle of water, please.',
  ], reply: { q: 'ใส่ อะไร|With what?', a: 'ใส่ ไก่|With chicken.', wrong: ['ขวด', 'ขอ เมนู ด้วย'] } },
  r04: { phrases: [
    'ไม่ ใส่ พริก|No chili, please.',
    'ไม่ เผ็ด เลย|Not spicy at all.',
    'ใส่ น้ำตาล|with sugar',
    'ไม่ ใส่ เนื้อ|No beef, please.',
    'ข้าวผัด ไม่ เผ็ด|fried rice, not spicy',
  ], reply: { q: 'ใส่ อะไร|What do you want in it?', a: 'ไม่ ใส่ พริก|No chili, please.', wrong: ['มี อะไร บ้าง', 'ขอ เมนู ด้วย'] } },
  r05: { phrases: [
    'ขอ กาแฟ ร้อน|A hot coffee, please.',
    'ชา เย็น|iced tea',
    'ขอ น้ำ เปล่า|Plain water, please.',
    'กาแฟ เย็น สอง ที่|two iced coffees',
    'ขอ ชา ร้อน แล้วก็ กาแฟ เย็น|A hot tea and an iced coffee, please.',
  ], reply: { q: 'มี อะไร บ้าง|What do you have?', a: 'มี กาแฟ แล้วก็ ชา|We have coffee and tea.', wrong: ['ขอ น้ำ เปล่า', 'ชา เย็น'] } },
  r06: { phrases: [
    'ขอ เบียร์ ขวด ใหญ่|A large bottle of beer, please.',
    'ขวด เล็ก|a small bottle',
    'เปรี้ยว หวาน|sweet and sour',
    'ไม่ หวาน|not sweet',
    'ไม่ เค็ม|not salty',
  ], reply: { q: 'มี อะไร บ้าง|What do you have?', a: 'มี เบียร์ ขวด ใหญ่ กับ ขวด เล็ก|We have large and small bottles of beer.', wrong: ['ไม่ หวาน', 'เปรี้ยว หวาน'] } },
  r07: { phrases: [
    'ขอ ช้อน กับ ส้อม|A spoon and fork, please.',
    'ช่วยเช็ดโต๊ะหน่อย|Please wipe the table.',
    'ขอ เช็คบิล ด้วย|The check, please.',
    'ไม่ ต้อง ทอน|Keep the change.',
    'ขอ ช้อน ด้วย|A spoon, please.',
  ] },
  r08: { phrases: [
    'ฉัน กิน เจ|I\'m vegetarian.',
    'ฉัน ไม่ กิน เนื้อ|I don\'t eat beef.',
    'มี เต้าหู้ มั้ย|Do you have tofu?',
    'กิน เผ็ด มั้ย|Do you eat spicy food?',
    'ใส่ น้ำมันพืช|with vegetable oil',
  ], reply: { q: 'มี เต้าหู้ มั้ย|Do you have tofu?', a: 'มี|Yes, we do.', wrong: ['ฉัน กิน เจ', 'ไม่ เผ็ด เลย'] } },
  r09: { phrases: [
    'ไม่ ใส่ ไข่ ได้ มั้ย|Can you make it without egg?',
    'ใส่ ไข่|with egg',
    'โล ละ เท่าไหร่|How much per kilo?',
    'ขอ สอง โล|Two kilos, please.',
    'ได้|Sure, I can.',
  ], reply: { q: 'ไม่ ใส่ ไข่ ได้ มั้ย|Can you make it without egg?', a: 'ได้|Sure, no problem.', wrong: ['ขอ สอง โล', 'ใส่ ไข่'] } },
  r10: { phrases: [
    'เอา กี่ โล|How many kilos do you want?',
    'เอา ครึ่ง โล|I\'ll take half a kilo.',
    'เอา เต้าหู้ สอง โล|I\'ll take two kilos of tofu.',
    'โล ละ เท่าไหร่|How much per kilo?',
    'เอา หนึ่ง โล|I\'ll take one kilo.',
  ], reply: { q: 'เอา กี่ โล|How many kilos do you want?', a: 'เอา ครึ่ง โล|Half a kilo.', wrong: ['โล ละ เท่าไหร่', 'มี เต้าหู้ มั้ย'] } },
};

const restaurantSubject = subject(
  'restaurant',
  'Order at a Restaurant',
  'ráan-aa-hǎan',
  'Real Thai ordered straight from a restaurant menu — every word and sentence here is copied from Essential Thai by James Higbie, not invented.',
  rewriteLessons(lessons, REWRITES, romanTable([{ lessons }]))
);

module.exports = { restaurantSubject };
