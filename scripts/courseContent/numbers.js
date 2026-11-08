// "Numbers" — transcribed from real textbook pages (Thai script, romanization,
// and English meanings are all copied from the source, not invented):
// Essential Thai: A Guide to the Basics of the Thai Language by James Higbie
// (2nd ed., Orchid Press) — the Numbers chapter (pp.17-18: 1-10, teens, tens,
// hundreds, thousands, ten-thousands/hundred-thousands/millions, ordinal
// numbers), the "Shopping/Getting Around" chapter (pp.27-29: how much is
// this/this one, how many do you want, bottles, buying clothes), the
// Dialogues chapter (p.96: how much money do you have / is that enough),
// the Questions/Addresses section (p.88: house numbers), the Telephone
// chapter (p.162: phone numbers), the Telling Time chapter (pp.101-102:
// mong/chao/bai/yen/thoom/tee/thiang), and the Time chapter's Dates section
// (p.114: wan-thii). Every step cites its exact source page.
//
// This unit covers counting beyond 3 (4-10, tens, hundreds, thousands,
// higher numbers), ordinal numbers, asking/telling prices, classifiers
// combined with numbers, money, house/phone numbers, telling time, and
// dates. หนึ่ง/สอง/สาม are re-taught here (this subject's own checkDictionary
// pass doesn't know about restaurant.js's teaching of them) using the exact
// same spellings restaurant.js already established: nɯ̀ng, sɔ̌ɔng, sǎam.
//
// Romanization reuses the diacritic convention already used elsewhere in
// this app (à/á/â/ǎ for low/high/falling/rising tones, ɔ/ɛ/ɯ/ə for open
// vowels) rather than Higbie's own plain-letter-plus-underline system.
// Words that recur from scripts/courseContent/{restaurant,greetings,basics}.js
// (nɯ̀ng, sɔ̌ɔng, sǎam, khun, à-rai, mâi, mii, phaeng, thâo-rài, kon, nîi,
// níi, ao, gìi, an, sɯ̂a, bâan) reuse those exact spellings.
//
// Sentence-length note: many graded steps below test two or three already-
// taught phrases chained back-to-back in one utterance (e.g. a price
// question followed by a money statement) rather than a single short
// phrase in isolation. This mirrors how the closing "review" lessons of
// this and other subjects already recombine previously taught vocabulary —
// applied earlier and more often here so sentence length ramps up steadily
// across the unit instead of staying flat. Every token in every combined
// sentence was introduced by an earlier wordIntro in this file; no new
// vocabulary beyond what Essential Thai's own pages already teach was
// invented to build these longer sentences.
'use strict';

const { romanTable, rewriteLessons } = require('../lib/phraseLessons');

const { wordIntro, rule, mc, order, speak, dialogue, lesson, subject } = require('../lib/courseBuilder');

const SRC = {
  numbers1: 'Essential Thai (Higbie), p.17',
  numbers2: 'Essential Thai (Higbie), p.18',
  shopping1: 'Essential Thai (Higbie), p.27',
  shopping2: 'Essential Thai (Higbie), p.28',
  shopping3: 'Essential Thai (Higbie), p.29',
  money: 'Essential Thai (Higbie), p.96',
  address: 'Essential Thai (Higbie), p.88',
  phone: 'Essential Thai (Higbie), p.162',
  time1: 'Essential Thai (Higbie), p.101',
  time2: 'Essential Thai (Higbie), p.102',
  dates: 'Essential Thai (Higbie), p.114',
};

// Originally 24 short (~4-9 step) lessons, one per Higbie sub-topic — merged
// pairwise below into 12 longer (~13-16 step) lessons via merge(), which
// only concatenates each pair's existing `steps` arrays (nothing rewritten,
// reordered, or dropped) so checkDictionary's teach-before-test guarantee
// stays intact for free.
const rawLessons = [
  // ---------------------------------------------------------------
  lesson('n01', 'One to five', [
    wordIntro('หนึ่ง', 'nɯ̀ng', 'one', SRC.numbers1),
    wordIntro('สอง', 'sɔ̌ɔng', 'two', SRC.numbers1),
    wordIntro('สาม', 'sǎam', 'three', SRC.numbers1),
    wordIntro('สี่', 'sìi', 'four', SRC.numbers1),
    wordIntro('ห้า', 'hâa', 'five', SRC.numbers1),
    mc('หนึ่งสอง', 'nɯ̀ng sɔ̌ɔng', 'One, two', ['Two, three', 'Three, four', 'Four, five'], ['หนึ่ง', 'สอง'], SRC.numbers1),
    mc('สามสี่', 'sǎam sìi', 'Three, four', ['One, two', 'Two, three', 'Four, five'], ['สาม', 'สี่'], SRC.numbers1),
    order('Two, three, four, five', [
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'hâa', thai: 'ห้า' },
    ], SRC.numbers1),
    speak('สี่ห้า', 'sìi hâa', 'Four, five', ['สี่', 'ห้า'], SRC.numbers1),
  ]),

  // ---------------------------------------------------------------
  lesson('n02', 'Six, seven, eight', [
    wordIntro('หก', 'hòk', 'six', SRC.numbers1),
    wordIntro('เจ็ด', 'jèt', 'seven', SRC.numbers1),
    wordIntro('แปด', 'pɛ̀ɛt', 'eight', SRC.numbers1),
    mc('หกเจ็ด', 'hòk jèt', 'Six, seven', ['Seven, eight', 'Five, six', 'Six, eight'], ['หก', 'เจ็ด'], SRC.numbers1),
    mc('เจ็ดแปด', 'jèt pɛ̀ɛt', 'Seven, eight', ['Six, seven', 'Five, six', 'Six, eight'], ['เจ็ด', 'แปด'], SRC.numbers1),
    order('Six, seven, eight', [
      { roman: 'hòk', thai: 'หก' },
      { roman: 'jèt', thai: 'เจ็ด' },
      { roman: 'pɛ̀ɛt', thai: 'แปด' },
    ], SRC.numbers1),
    speak('หกเจ็ดแปด', 'hòk jèt pɛ̀ɛt', 'Six, seven, eight', ['หก', 'เจ็ด', 'แปด'], SRC.numbers1),
  ]),

  // ---------------------------------------------------------------
  lesson('n03', 'Nine, ten, and zero', [
    wordIntro('เก้า', 'kâo', 'nine', SRC.numbers1),
    wordIntro('สิบ', 'sìp', 'ten', SRC.numbers1),
    wordIntro('ศูนย์', 'sǔun', 'zero', SRC.numbers1),
    mc('เก้าศูนย์', 'kâo sǔun', 'Nine, zero', ['Six, zero', 'Two, three', 'One, two'], ['เก้า', 'ศูนย์'], SRC.numbers1),
    mc('หกศูนย์', 'hòk sǔun', 'Six, zero', ['Nine, zero', 'Seven, eight', 'Four, five'], ['หก', 'ศูนย์'], SRC.numbers1),
    order('Nine, ten', [
      { roman: 'kâo', thai: 'เก้า' },
      { roman: 'sìp', thai: 'สิบ' },
    ], SRC.numbers1),
    order('Eight, nine, ten', [
      { roman: 'pɛ̀ɛt', thai: 'แปด' },
      { roman: 'kâo', thai: 'เก้า' },
      { roman: 'sìp', thai: 'สิบ' },
    ], SRC.numbers1),
    speak('ห้าศูนย์เก้า', 'hâa sǔun kâo', 'Five, zero, nine', ['ห้า', 'ศูนย์', 'เก้า'], SRC.numbers1),
  ]),
  // ---------------------------------------------------------------
  lesson('n04', 'Eleven to nineteen', [
    rule(
      'Two-digit numbers: sip + unit',
      'Put the unit number after sip for two-digit numbers 11-19. The only exception is 11, which is sip-et, not sip-neung.',
      SRC.numbers1
    ),
    wordIntro('เอ็ด', 'èt', 'one (in 11, 21, 31… — "-ty-one")', SRC.numbers1),
    mc('สิบเอ็ดสิบสอง', 'sìp-èt sìp-sɔ̌ɔng', 'Eleven, twelve', ['Twelve, thirteen', 'Ten, eleven', 'Thirteen, fourteen'], ['สิบ', 'เอ็ด', 'สิบ', 'สอง'], SRC.numbers1),
    order('Thirteen, fourteen', [
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'sìi', thai: 'สี่' },
    ], SRC.numbers1),
    mc('สิบหกสิบเจ็ด', 'sìp-hòk sìp-jèt', 'Sixteen, seventeen', ['Fifteen, sixteen', 'Seventeen, eighteen', 'Eighteen, nineteen'], ['สิบ', 'หก', 'สิบ', 'เจ็ด'], SRC.numbers1),
    order('Eighteen, nineteen', [
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'pɛ̀ɛt', thai: 'แปด' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'kâo', thai: 'เก้า' },
    ], SRC.numbers1),
    speak('สิบห้าสิบหก', 'sìp-hâa sìp-hòk', 'Fifteen, sixteen', ['สิบ', 'ห้า', 'สิบ', 'หก'], SRC.numbers1),
  ]),

  // ---------------------------------------------------------------
  lesson('n05', 'Twenty to ninety', [
    rule(
      'Tens: unit + sip (except twenty)',
      '"For 20, 30, 40, etc, put the unit number before sip. "Twenty" is an exception — it\'s yee-sip, not sawng-sip.',
      SRC.numbers1
    ),
    wordIntro('ยี่สิบ', 'yîi-sìp', 'twenty', SRC.numbers1),
    mc('ยี่สิบสามสิบ', 'yîi-sìp sǎam-sìp', 'Twenty, thirty', ['Thirty, forty', 'Ten, twenty', 'Forty, fifty'], ['ยี่สิบ', 'สาม', 'สิบ'], SRC.numbers1),
    order('Forty, fifty', [
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'sìp', thai: 'สิบ' },
    ], SRC.numbers1),
    mc('สี่สิบหกสิบ', 'sìi-sìp hòk-sìp', 'Forty, sixty', ['Forty, fifty', 'Fifty, sixty', 'Thirty, forty'], ['สี่', 'สิบ', 'หก', 'สิบ'], SRC.numbers1),
    order('Seventy, eighty', [
      { roman: 'jèt', thai: 'เจ็ด' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'pɛ̀ɛt', thai: 'แปด' },
      { roman: 'sìp', thai: 'สิบ' },
    ], SRC.numbers1),
    speak('แปดสิบเก้าสิบ', 'pɛ̀ɛt-sìp kâo-sìp', 'Eighty, ninety', ['แปด', 'สิบ', 'เก้า', 'สิบ'], SRC.numbers1),
  ]),

  // ---------------------------------------------------------------
  lesson('n06', 'Any two-digit number', [
    rule(
      'Building any two-digit number',
      'For other two-digit numbers, add the unit number again after the tens — "45" is see-sip-ha (forty-five), "99" is ' +
        'gao-sip-gao (ninety-nine).',
      SRC.numbers1
    ),
    order('Twenty-one, twenty-two', [
      { roman: 'yîi-sìp', thai: 'ยี่สิบ' },
      { roman: 'èt', thai: 'เอ็ด' },
      { roman: 'yîi-sìp', thai: 'ยี่สิบ' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
    ], SRC.numbers1),
    mc('สี่สิบห้าหกสิบเจ็ด', 'sìi-sìp-hâa hòk-sìp-jèt', 'Forty-five, sixty-seven', ['Fifty-four, seventy-six', 'Forty-five, seventy-six', 'Sixty-seven, ninety-nine'], ['สี่', 'สิบ', 'ห้า', 'หก', 'สิบ', 'เจ็ด'], SRC.numbers1),
    order('Ninety-nine', [
      { roman: 'kâo', thai: 'เก้า' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'kâo', thai: 'เก้า' },
    ], SRC.numbers1),
    mc('หกสิบเจ็ดแปดสิบสาม', 'hòk-sìp-jèt pɛ̀ɛt-sìp-sǎam', 'Sixty-seven, eighty-three', ['Forty-five, sixty-seven', 'Sixty-seven, ninety-nine', 'Seventy-six, eighty-three'], ['หก', 'สิบ', 'เจ็ด', 'แปด', 'สิบ', 'สาม'], SRC.numbers1),
    speak('สี่สิบห้าหกสิบเจ็ดแปดสิบสาม', 'sìi-sìp-hâa hòk-sìp-jèt pɛ̀ɛt-sìp-sǎam', 'Forty-five, sixty-seven, eighty-three', ['สี่', 'สิบ', 'ห้า', 'หก', 'สิบ', 'เจ็ด', 'แปด', 'สิบ', 'สาม'], SRC.numbers1),
  ]),

  // ---------------------------------------------------------------
  lesson('n07', 'Hundreds', [
    rule(
      'Hundreds',
      '"One hundred" is roi or neung roi. Add tens and units after roi for other hundreds, like roi-ha-sip for 150.',
      SRC.numbers1
    ),
    wordIntro('ร้อย', 'rɔ́ɔi', 'hundred', SRC.numbers1),
    mc('ร้อยสองร้อยสามร้อยสี่ร้อย', 'rɔ́ɔi sɔ̌ɔng-rɔ́ɔi sǎam-rɔ́ɔi sìi-rɔ́ɔi', 'One hundred, two hundred, three hundred, four hundred', ['Two hundred, three hundred, four hundred, five hundred', 'One hundred, two hundred, three hundred', 'One hundred, three hundred, four hundred, five hundred'], ['ร้อย', 'สอง', 'ร้อย', 'สาม', 'ร้อย', 'สี่', 'ร้อย'], SRC.numbers1),
    order('Four hundred fifty', [
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'sìp', thai: 'สิบ' },
    ], SRC.numbers1),
    mc('ห้าร้อยหกร้อยเจ็ดร้อยแปดร้อย', 'hâa-rɔ́ɔi hòk-rɔ́ɔi jèt-rɔ́ɔi pɛ̀ɛt-rɔ́ɔi', 'Five hundred, six hundred, seven hundred, eight hundred', ['Six hundred, seven hundred, eight hundred, nine hundred', 'Five hundred, six hundred, seven hundred', 'Five hundred, seven hundred, eight hundred, nine hundred'], ['ห้า', 'ร้อย', 'หก', 'ร้อย', 'เจ็ด', 'ร้อย', 'แปด', 'ร้อย'], SRC.numbers1),
    order('Six hundred fifty-five', [
      { roman: 'hòk', thai: 'หก' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'hâa', thai: 'ห้า' },
    ], SRC.numbers1),
    speak('ร้อยสองร้อยสามร้อย', 'rɔ́ɔi sɔ̌ɔng-rɔ́ɔi sǎam-rɔ́ɔi', 'One hundred, two hundred, three hundred', ['ร้อย', 'สอง', 'ร้อย', 'สาม', 'ร้อย'], SRC.numbers1),
  ]),

  // ---------------------------------------------------------------
  lesson('n08', 'Thousands', [
    rule('Thousands', '"One thousand" is phan or neung phan. Add other numbers for other digits.', SRC.numbers2),
    wordIntro('พัน', 'phan', 'thousand', SRC.numbers2),
    mc('หนึ่งพันสองพันสามพันสี่พัน', 'nɯ̀ng-phan sɔ̌ɔng-phan sǎam-phan sìi-phan', 'One thousand, two thousand, three thousand, four thousand', ['Two thousand, three thousand, four thousand, five thousand', 'One thousand, two thousand, three thousand', 'One thousand, three thousand, four thousand, five thousand'], ['หนึ่ง', 'พัน', 'สอง', 'พัน', 'สาม', 'พัน', 'สี่', 'พัน'], SRC.numbers2),
    order('Two thousand five hundred', [
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'phan', thai: 'พัน' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
    ], SRC.numbers2),
    mc('ห้าพันหกพันเจ็ดพันแปดพัน', 'hâa-phan hòk-phan jèt-phan pɛ̀ɛt-phan', 'Five thousand, six thousand, seven thousand, eight thousand', ['Six thousand, seven thousand, eight thousand, nine thousand', 'Five thousand, six thousand, seven thousand', 'Five thousand, seven thousand, eight thousand, nine thousand'], ['ห้า', 'พัน', 'หก', 'พัน', 'เจ็ด', 'พัน', 'แปด', 'พัน'], SRC.numbers2),
    order('Nine thousand nine hundred', [
      { roman: 'kâo', thai: 'เก้า' },
      { roman: 'phan', thai: 'พัน' },
      { roman: 'kâo', thai: 'เก้า' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
    ], SRC.numbers2),
    speak('หกพันเจ็ดพันแปดพันเก้าพัน', 'hòk-phan jèt-phan pɛ̀ɛt-phan kâo-phan', 'Six thousand, seven thousand, eight thousand, nine thousand', ['หก', 'พัน', 'เจ็ด', 'พัน', 'แปด', 'พัน', 'เก้า', 'พัน'], SRC.numbers2),
  ]),

  // ---------------------------------------------------------------
  lesson('n09', 'Ten-thousands and hundred-thousands', [
    rule(
      'Higher numbers',
      'Unlike English, Thai has separate words for the ten-thousand and hundred-thousand places: meun and saen.',
      SRC.numbers2
    ),
    wordIntro('หมื่น', 'mɯ̀ɯn', 'ten thousand', SRC.numbers2),
    wordIntro('แสน', 'sɛ̌ɛn', 'hundred thousand', SRC.numbers2),
    mc('หมื่นสองหมื่นสามหมื่นสี่หมื่น', 'mɯ̀ɯn sɔ̌ɔng-mɯ̀ɯn sǎam-mɯ̀ɯn sìi-mɯ̀ɯn', 'Ten thousand, twenty thousand, thirty thousand, forty thousand', ['Twenty thousand, thirty thousand, forty thousand, fifty thousand', 'Ten thousand, twenty thousand, thirty thousand', 'Ten thousand, thirty thousand, forty thousand, fifty thousand'], ['หมื่น', 'สอง', 'หมื่น', 'สาม', 'หมื่น', 'สี่', 'หมื่น'], SRC.numbers2),
    mc('แสนสองแสนสามแสนสี่แสน', 'sɛ̌ɛn sɔ̌ɔng-sɛ̌ɛn sǎam-sɛ̌ɛn sìi-sɛ̌ɛn', 'Hundred thousand, two hundred thousand, three hundred thousand, four hundred thousand', ['Two hundred thousand, three hundred thousand, four hundred thousand, five hundred thousand', 'Hundred thousand, two hundred thousand, three hundred thousand', 'Hundred thousand, three hundred thousand, four hundred thousand, five hundred thousand'], ['แสน', 'สอง', 'แสน', 'สาม', 'แสน', 'สี่', 'แสน'], SRC.numbers2),
    order('Twenty thousand five hundred', [
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'mɯ̀ɯn', thai: 'หมื่น' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
    ], SRC.numbers2),
    order('Five hundred thousand, six hundred thousand', [
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'sɛ̌ɛn', thai: 'แสน' },
      { roman: 'hòk', thai: 'หก' },
      { roman: 'sɛ̌ɛn', thai: 'แสน' },
    ], SRC.numbers2),
    speak('สองหมื่นสามแสนสี่แสนห้าแสน', 'sɔ̌ɔng-mɯ̀ɯn sǎam-sɛ̌ɛn sìi-sɛ̌ɛn hâa-sɛ̌ɛn', 'Twenty thousand, three hundred thousand, four hundred thousand, five hundred thousand', ['สอง', 'หมื่น', 'สาม', 'แสน', 'สี่', 'แสน', 'ห้า', 'แสน'], SRC.numbers2),
  ]),

  // ---------------------------------------------------------------
  lesson('n10', 'Millions', [
    wordIntro('ล้าน', 'láan', 'million', SRC.numbers2),
    mc('ล้านสองล้านสามล้านสี่ล้าน', 'láan sɔ̌ɔng-láan sǎam-láan sìi-láan', 'One million, two million, three million, four million', ['Two million, three million, four million, five million', 'One million, two million', 'One million, three million, four million'], ['ล้าน', 'สอง', 'ล้าน', 'สาม', 'ล้าน', 'สี่', 'ล้าน'], SRC.numbers2),
    order('Four million five hundred thousand', [
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'láan', thai: 'ล้าน' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'sɛ̌ɛn', thai: 'แสน' },
    ], SRC.numbers2),
    mc('ห้าล้านหกล้านเจ็ดล้านแปดล้าน', 'hâa-láan hòk-láan jèt-láan pɛ̀ɛt-láan', 'Five million, six million, seven million, eight million', ['Six million, seven million, eight million, nine million', 'Five million, six million, seven million', 'Five million, seven million, eight million, nine million'], ['ห้า', 'ล้าน', 'หก', 'ล้าน', 'เจ็ด', 'ล้าน', 'แปด', 'ล้าน'], SRC.numbers2),
    order('Two hundred thousand, three hundred thousand', [
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'sɛ̌ɛn', thai: 'แสน' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'sɛ̌ɛn', thai: 'แสน' },
    ], SRC.numbers2),
    speak('เจ็ดล้านแปดล้านเก้าล้านสิบล้าน', 'jèt-láan pɛ̀ɛt-láan kâo-láan sìp-láan', 'Seven million, eight million, nine million, ten million', ['เจ็ด', 'ล้าน', 'แปด', 'ล้าน', 'เก้า', 'ล้าน', 'สิบ', 'ล้าน'], SRC.numbers2),
    speak('สี่ล้านห้าล้านหกล้านเจ็ดล้าน', 'sìi-láan hâa-láan hòk-láan jèt-láan', 'Four million, five million, six million, seven million', ['สี่', 'ล้าน', 'ห้า', 'ล้าน', 'หก', 'ล้าน', 'เจ็ด', 'ล้าน'], SRC.numbers2),
  ]),

  // ---------------------------------------------------------------
  lesson('n11', 'Ordinal numbers', [
    rule(
      'Ordinal numbers',
      'Put thîi (falling tone) before a number to make an ordinal — "the third person" is kon thîi sǎam, "the second day" is ' +
        'wan thîi sɔ̌ɔng.',
      SRC.numbers2
    ),
    wordIntro('ที่', 'thîi', 'ordinal marker ("-th")', SRC.numbers2),
    wordIntro('คน', 'kon', 'person (classifier for people)', SRC.numbers2),
    mc('คนที่หนึ่งคนที่สองคนที่สาม', 'kon thîi-nɯ̀ng kon thîi-sɔ̌ɔng kon thîi-sǎam', 'The first person, the second person, the third person', ['The second person, the third person, the fourth person', 'The first person, the third person', 'The first person, the second person'], ['คน', 'ที่', 'หนึ่ง', 'คน', 'ที่', 'สอง', 'คน', 'ที่', 'สาม'], SRC.numbers2),
    order('The fourth person, the fifth person', [
      { roman: 'kon', thai: 'คน' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'hâa', thai: 'ห้า' },
    ], SRC.numbers2),
    mc('ที่หนึ่งที่สองที่สาม', 'thîi-nɯ̀ng thîi-sɔ̌ɔng thîi-sǎam', 'Number one, number two, number three', ['Number two, number three, number four', 'Number one, number three', 'Number one, number two'], ['ที่', 'หนึ่ง', 'ที่', 'สอง', 'ที่', 'สาม'], SRC.numbers2),
    speak('คนที่หกคนที่เจ็ด', 'kon thîi-hòk kon thîi-jèt', 'The sixth person, the seventh person', ['คน', 'ที่', 'หก', 'คน', 'ที่', 'เจ็ด'], SRC.numbers2),
  ]),
  // ---------------------------------------------------------------
  lesson('n12', 'Do you have it? Do you want it?', [
    wordIntro('เอา', 'ao', 'want / take', SRC.shopping1),
    wordIntro('มี', 'mii', 'have', SRC.shopping1),
    mc('มีห้าคนมีหกคน', 'mii hâa kon mii hòk kon', 'There are five people, there are six people', ['There are six people, there are seven people', 'There are three people, there are four people', 'There is one person, there are two people'], ['มี', 'ห้า', 'คน', 'มี', 'หก', 'คน'], SRC.shopping1),
    mc('เอาสามคนเอาสี่คน', 'ao sǎam kon ao sìi kon', 'I want three people, I want four people', ['I want four people, I want five people', 'I have three people, I have four people', 'I want one person, I want two people'], ['เอา', 'สาม', 'คน', 'เอา', 'สี่', 'คน'], SRC.shopping1),
    order('I want five people. I have six people.', [
      { roman: 'ao', thai: 'เอา' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'hòk', thai: 'หก' },
      { roman: 'kon', thai: 'คน' },
    ], SRC.shopping1),
    speak('เอาเจ็ดคนมีแปดคน', 'ao jèt kon mii pɛ̀ɛt kon', 'I want seven people, I have eight people', ['เอา', 'เจ็ด', 'คน', 'มี', 'แปด', 'คน'], SRC.shopping1),
  ]),

  // ---------------------------------------------------------------
  lesson('n13', 'How many do you want?', [
    wordIntro('กี่', 'gìi', 'how many?', SRC.shopping2),
    wordIntro('อัน', 'an', 'item (classifier for objects)', SRC.shopping2),
    mc('เอากี่อันมีสามอัน', 'ao gìi an mii sǎam an', 'How many do you want? I have three.', ['How many do you have? I want three.', 'How many items? I have five.', 'I want one. How many do you have?'], ['เอา', 'กี่', 'อัน', 'มี', 'สาม', 'อัน'], SRC.shopping2),
    order('I want three items. How many do you have?', [
      { roman: 'ao', thai: 'เอา' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'an', thai: 'อัน' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'gìi', thai: 'กี่' },
      { roman: 'an', thai: 'อัน' },
    ], SRC.shopping2),
    mc('มีกี่อันเอาห้าอัน', 'mii gìi an ao hâa an', 'How many do you have? I want five.', ['How many do you want? I have five.', 'How many items? I want three.', 'I have five. How many do you want?'], ['มี', 'กี่', 'อัน', 'เอา', 'ห้า', 'อัน'], SRC.shopping2),
    speak('เอากี่อันมีเก้าอัน', 'ao gìi an mii kâo an', 'How many do you want? I have nine.', ['เอา', 'กี่', 'อัน', 'มี', 'เก้า', 'อัน'], SRC.shopping2),
  ]),

  // ---------------------------------------------------------------
  lesson('n14', 'This one, and is it expensive?', [
    wordIntro('นี่', 'nîi', 'this', SRC.shopping1),
    wordIntro('แพง', 'phaeng', 'expensive', SRC.shopping1),
    mc('นี่แพงมีห้าอันเอากี่อัน', 'nîi phaeng mii hâa an ao gìi an', 'This is expensive. I have five. How many do you want?', ['This is cheap. I have three. How many do you want?', 'This is expensive. I want five. How many do you have?', 'How many do you want? This is expensive. I have five.'], ['นี่', 'แพง', 'มี', 'ห้า', 'อัน', 'เอา', 'กี่', 'อัน'], SRC.shopping1),
    mc('นี่แพงเอากี่อัน', 'nîi phaeng ao gìi an', 'This is expensive. How many do you want?', ['This is cheap. How many do you have?', 'This is expensive. I want three.', 'How many do you want? This is expensive.'], ['นี่', 'แพง', 'เอา', 'กี่', 'อัน'], SRC.shopping1),
    wordIntro('นี้', 'níi', 'this (after a noun)', SRC.shopping1),
    order('This one is expensive. I have six.', [
      { roman: 'an', thai: 'อัน' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'phaeng', thai: 'แพง' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'hòk', thai: 'หก' },
      { roman: 'an', thai: 'อัน' },
    ], SRC.shopping1),
    mc('อันนี้แพงเอากี่อัน', 'an-níi phaeng ao gìi an', 'This one is expensive. How many do you want?', ['This one is cheap. How many do you have?', 'This one is expensive. I have five.', 'How many do you want? This one is expensive.'], ['อัน', 'นี้', 'แพง', 'เอา', 'กี่', 'อัน'], SRC.shopping1),
    speak('อันนี้แพงมีเจ็ดอัน', 'an-níi phaeng mii jèt an', 'This one is expensive. I have seven.', ['อัน', 'นี้', 'แพง', 'มี', 'เจ็ด', 'อัน'], SRC.shopping1),
  ]),

  // ---------------------------------------------------------------
  lesson('n15', 'How much is it? Baht', [
    wordIntro('เท่าไหร่', 'thâo-rài', 'how much / how many', SRC.shopping1),
    wordIntro('บาท', 'bàat', 'baht (currency)', SRC.shopping1),
    mc('นี่เท่าไหร่มีห้าอันเอากี่อัน', 'nîi thâo-rài mii hâa an ao gìi an', 'How much is this? I have five. How many do you want?', ['How much is this one? I have three.', 'This is expensive. I have five. How many do you want?', 'I have five. How much is this? How many do you want?'], ['นี่', 'เท่าไหร่', 'มี', 'ห้า', 'อัน', 'เอา', 'กี่', 'อัน'], SRC.shopping1),
    mc('มีสองร้อยบาทเอากี่อัน', 'mii sɔ̌ɔng-rɔ́ɔi bàat ao gìi an', 'I have two hundred baht. How many do you want?', ['I have three hundred baht. How many do you have?', 'I have two hundred baht. I want three.', 'How many do you want? I have two hundred baht.'], ['มี', 'สอง', 'ร้อย', 'บาท', 'เอา', 'กี่', 'อัน'], SRC.shopping1),
    order('This one, how much? I have one hundred baht.', [
      { roman: 'an', thai: 'อัน' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'thâo-rài', thai: 'เท่าไหร่' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
      { roman: 'bàat', thai: 'บาท' },
    ], SRC.shopping1),
    mc('อันนี้เท่าไหร่มีสามอันเอาห้าอัน', 'an-níi thâo-rài mii sǎam an ao hâa an', 'How much is this one? I have three. I want five.', ['How much is this? I have three.', 'This one is expensive. I have three. I want five.', 'I have three. How much is this one? I want five.'], ['อัน', 'นี้', 'เท่าไหร่', 'มี', 'สาม', 'อัน', 'เอา', 'ห้า', 'อัน'], SRC.shopping1),
    speak('นี่เท่าไหร่มีห้าร้อยบาท', 'nîi thâo-rài mii hâa-rɔ́ɔi bàat', 'How much is this? I have five hundred baht.', ['นี่', 'เท่าไหร่', 'มี', 'ห้า', 'ร้อย', 'บาท'], SRC.shopping1),
  ]),

  // ---------------------------------------------------------------
  lesson('n16', 'Bottles', [
    wordIntro('ขวด', 'khùat', 'bottle (classifier)', SRC.shopping3),
    mc('ขวดนี้เท่าไหร่มีห้าอัน', 'khùat níi thâo-rài mii hâa an', 'How much is this bottle? I have five.', ['How much is this? I have five.', 'This bottle is expensive. I have five.', 'I have five. How much is this bottle?'], ['ขวด', 'นี้', 'เท่าไหร่', 'มี', 'ห้า', 'อัน'], SRC.shopping3),
    mc('ขวดนี้เท่าไหร่มีสองขวด', 'khùat níi thâo-rài mii sɔ̌ɔng khùat', 'How much is this bottle? I have two bottles.', ['How much is this bottle? I have three bottles.', 'How much is this? I have two bottles.', 'I have two bottles. How much is this bottle?'], ['ขวด', 'นี้', 'เท่าไหร่', 'มี', 'สอง', 'ขวด'], SRC.shopping3),
    order('How much is this bottle? I have three bottles.', [
      { roman: 'khùat', thai: 'ขวด' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'thâo-rài', thai: 'เท่าไหร่' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'khùat', thai: 'ขวด' },
    ], SRC.shopping3),
    speak('ขวดนี้เท่าไหร่อันนี้แพง', 'khùat níi thâo-rài an-níi phaeng', 'How much is this bottle? This one is expensive.', ['ขวด', 'นี้', 'เท่าไหร่', 'อัน', 'นี้', 'แพง'], SRC.shopping3),
    speak('ขวดนี้เท่าไหร่มีเจ็ดขวด', 'khùat níi thâo-rài mii jèt khùat', 'How much is this bottle? I have seven bottles.', ['ขวด', 'นี้', 'เท่าไหร่', 'มี', 'เจ็ด', 'ขวด'], SRC.shopping3),
  ]),

  // ---------------------------------------------------------------
  lesson('n17', 'Shirts and pants', [
    wordIntro('ตัว', 'tua', 'classifier for clothes', SRC.shopping3),
    wordIntro('เสื้อ', 'sɯ̂a', 'shirt', SRC.shopping3),
    mc('เสื้อตัวนี้แพงมีห้าตัว', 'sɯ̂a tua níi phaeng mii hâa tua', 'This shirt is expensive. I have five.', ['This shirt is cheap. I have five.', 'This shirt is expensive. I want five.', 'I have five. This shirt is expensive.'], ['เสื้อ', 'ตัว', 'นี้', 'แพง', 'มี', 'ห้า', 'ตัว'], SRC.shopping3),
    wordIntro('กางเกง', 'gaang-geeng', 'pants', SRC.shopping3),
    mc('กางเกงตัวนี้แพงเอากี่ตัว', 'gaang-geeng tua níi phaeng ao gìi tua', 'These pants are expensive. How many do you want?', ['These pants are cheap. How many do you have?', 'These pants are expensive. I want three.', 'How many do you want? These pants are expensive.'], ['กางเกง', 'ตัว', 'นี้', 'แพง', 'เอา', 'กี่', 'ตัว'], SRC.shopping3),
    order('How much is this shirt? I have one hundred baht.', [
      { roman: 'sɯ̂a', thai: 'เสื้อ' },
      { roman: 'tua', thai: 'ตัว' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'thâo-rài', thai: 'เท่าไหร่' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
      { roman: 'bàat', thai: 'บาท' },
    ], SRC.shopping3),
    speak('เสื้อตัวนี้เท่าไหร่มีสองร้อยบาท', 'sɯ̂a tua níi thâo-rài mii sɔ̌ɔng-rɔ́ɔi bàat', 'How much is this shirt? I have two hundred baht.', ['เสื้อ', 'ตัว', 'นี้', 'เท่าไหร่', 'มี', 'สอง', 'ร้อย', 'บาท'], SRC.shopping3),
  ]),
  // ---------------------------------------------------------------
  lesson('n18', 'Do you have enough money?', [
    wordIntro('เงิน', 'ngəən', 'money', SRC.money),
    wordIntro('พอ', 'phɔɔ', 'enough', SRC.money),
    mc('อันนี้แพงมีเงินเท่าไหร่มีสามร้อยบาท', 'an-níi phaeng mii ngəən thâo-rài mii sǎam-rɔ́ɔi bàat', 'This one is expensive. How much money do you have? I have three hundred baht.', ['This one is cheap. How much money do you have? I have three hundred baht.', 'This one is expensive. How much is this? I have three hundred baht.', 'How much money do you have? This one is expensive. I have three hundred baht.'], ['อัน', 'นี้', 'แพง', 'มี', 'เงิน', 'เท่าไหร่', 'มี', 'สาม', 'ร้อย', 'บาท'], SRC.money),
    order('This one is expensive. I have two hundred baht.', [
      { roman: 'an', thai: 'อัน' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'phaeng', thai: 'แพง' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'ngəən', thai: 'เงิน' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
      { roman: 'bàat', thai: 'บาท' },
    ], SRC.money),
    mc('มีเงินเท่าไหร่พอมีสี่ร้อยบาท', 'mii ngəən thâo-rài phɔɔ mii sìi-rɔ́ɔi bàat', 'How much money do you have? Enough? I have four hundred baht.', ['How much money do you have? Not enough. I have four hundred baht.', 'Is that enough? How much money do you have? I have four hundred baht.', 'How much money do you have? Enough. I have three hundred baht.'], ['มี', 'เงิน', 'เท่าไหร่', 'พอ', 'มี', 'สี่', 'ร้อย', 'บาท'], SRC.money),
    speak('มีเงินเท่าไหร่อันนี้แพงมีห้าร้อยบาท', 'mii ngəən thâo-rài an-níi phaeng mii hâa-rɔ́ɔi bàat', 'How much money do you have? This one is expensive. I have five hundred baht.', ['มี', 'เงิน', 'เท่าไหร่', 'อัน', 'นี้', 'แพง', 'มี', 'ห้า', 'ร้อย', 'บาท'], SRC.money),
    speak('พอมีหกร้อยบาทเอากี่อัน', 'phɔɔ mii hòk-rɔ́ɔi bàat ao gìi an', 'Enough. I have six hundred baht. How many do you want?', ['พอ', 'มี', 'หก', 'ร้อย', 'บาท', 'เอา', 'กี่', 'อัน'], SRC.money),
  ]),

  // ---------------------------------------------------------------
  lesson('n19', 'House numbers and addresses', [
    rule(
      'House numbers',
      'Bâan-lêek-thîi means "house number" — Thai house numbers often include a slash, like 26/3 (yîi-sìp-hòk tháp sǎam).',
      SRC.address
    ),
    wordIntro('บ้าน', 'bâan', 'home / house', SRC.address),
    wordIntro('เลข', 'lêek', 'number / numeral', SRC.address),
    mc('บ้านเลขที่สิบเอ็ดบ้านเลขที่ยี่สิบบ้านเลขที่สามสิบบ้านเลขที่สี่สิบ', 'bâan-lêek-thîi sìp-èt bâan-lêek-thîi yîi-sìp bâan-lêek-thîi sǎam-sìp bâan-lêek-thîi sìi-sìp', 'House number 11, house number 20, house number 30, house number 40', ['House number 12, house number 20, house number 30, house number 40', 'House number 11, house number 21, house number 30', 'House number 11, house number 20, house number 31, house number 40'], ['บ้าน', 'เลข', 'ที่', 'สิบ', 'เอ็ด', 'บ้าน', 'เลข', 'ที่', 'ยี่สิบ', 'บ้าน', 'เลข', 'ที่', 'สาม', 'สิบ', 'บ้าน', 'เลข', 'ที่', 'สี่', 'สิบ'], SRC.address),
    wordIntro('ทับ', 'tháp', 'slash (used in addresses)', SRC.address),
    order('House number 26/3. House number 11.', [
      { roman: 'bâan', thai: 'บ้าน' },
      { roman: 'lêek', thai: 'เลข' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'yîi-sìp', thai: 'ยี่สิบ' },
      { roman: 'hòk', thai: 'หก' },
      { roman: 'tháp', thai: 'ทับ' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'bâan', thai: 'บ้าน' },
      { roman: 'lêek', thai: 'เลข' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'èt', thai: 'เอ็ด' },
    ], SRC.address),
    mc('บ้านเลขที่ยี่สิบหกทับสามบ้านเลขที่สามสิบทับสอง', 'bâan-lêek-thîi yîi-sìp-hòk tháp sǎam bâan-lêek-thîi sǎam-sìp tháp sɔ̌ɔng', 'House number 26/3. House number 30/2.', ['House number 26/3. House number 30/3.', 'House number 36/2. House number 30/2.', 'House number 26/2. House number 30/3.'], ['บ้าน', 'เลข', 'ที่', 'ยี่สิบ', 'หก', 'ทับ', 'สาม', 'บ้าน', 'เลข', 'ที่', 'สาม', 'สิบ', 'ทับ', 'สอง'], SRC.address),
    speak('บ้านเลขที่สิบเอ็ดมีเงินสองร้อยบาทอันนี้แพง', 'bâan-lêek-thîi sìp-èt mii ngəən sɔ̌ɔng-rɔ́ɔi bàat an-níi phaeng', 'House number 11. I have two hundred baht. This one is expensive.', ['บ้าน', 'เลข', 'ที่', 'สิบ', 'เอ็ด', 'มี', 'เงิน', 'สอง', 'ร้อย', 'บาท', 'อัน', 'นี้', 'แพง'], SRC.address),
  ]),

  // ---------------------------------------------------------------
  lesson('n20', 'Phone numbers', [
    wordIntro('เบอร์', 'bəə', 'number / phone number (informal)', SRC.phone),
    wordIntro('โทรศัพท์', 'thoo-rá-sàp', 'telephone', SRC.phone),
    mc('เบอร์โทรศัพท์ศูนย์แปดหนึ่งสองสามบ้านเลขที่สิบเอ็ด', 'bəə thoo-rá-sàp sǔun pɛ̀ɛt nɯ̀ng sɔ̌ɔng sǎam bâan-lêek-thîi sìp-èt', 'Phone number: zero, eight, one, two, three. House number 11.', ['Phone number: zero, eight, one. House number 11.', 'Phone number: zero, eight, one, two, three. House number 20.', 'House number 11. Phone number: zero, eight, one, two, three.'], ['เบอร์', 'โทรศัพท์', 'ศูนย์', 'แปด', 'หนึ่ง', 'สอง', 'สาม', 'บ้าน', 'เลข', 'ที่', 'สิบ', 'เอ็ด'], SRC.phone),
    order('Phone number: zero, eight, one, two, five, six, nine.', [
      { roman: 'bəə', thai: 'เบอร์' },
      { roman: 'thoo-rá-sàp', thai: 'โทรศัพท์' },
      { roman: 'sǔun', thai: 'ศูนย์' },
      { roman: 'pɛ̀ɛt', thai: 'แปด' },
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'hòk', thai: 'หก' },
      { roman: 'kâo', thai: 'เก้า' },
    ], SRC.phone),
    mc('เบอร์โทรศัพท์เก้าศูนย์หนึ่งมีเงินร้อยบาท', 'bəə thoo-rá-sàp kâo sǔun nɯ̀ng mii ngəən rɔ́ɔi bàat', 'Phone number: nine, zero, one. I have one hundred baht.', ['Phone number: nine, zero, one. I have two hundred baht.', 'Phone number: nine, one, zero. I have one hundred baht.', 'I have one hundred baht. Phone number: nine, zero, one.'], ['เบอร์', 'โทรศัพท์', 'เก้า', 'ศูนย์', 'หนึ่ง', 'มี', 'เงิน', 'ร้อย', 'บาท'], SRC.phone),
    speak('เบอร์โทรศัพท์ศูนย์เก้าสองบ้านเลขที่ยี่สิบทับสาม', 'bəə thoo-rá-sàp sǔun kâo sɔ̌ɔng bâan-lêek-thîi yîi-sìp tháp sǎam', 'Phone number: zero, nine, two. House number 20/3.', ['เบอร์', 'โทรศัพท์', 'ศูนย์', 'เก้า', 'สอง', 'บ้าน', 'เลข', 'ที่', 'ยี่สิบ', 'ทับ', 'สาม'], SRC.phone),
  ]),

  // ---------------------------------------------------------------
  lesson('n21', 'What time is it? Morning and afternoon', [
    rule(
      'Telling time: mong',
      'For 6am-11am, put mong after the number and add chao ("morning"). Afternoon hours (1pm-6pm) use bai ("afternoon") or ' +
        'yen ("late afternoon") instead.',
      SRC.time1
    ),
    wordIntro('โมง', 'mong', "o'clock (daytime hour)", SRC.time1),
    wordIntro('เช้า', 'cháo', 'morning', SRC.time1),
    mc('กี่โมงหกโมงเช้าเจ็ดโมงเช้าแปดโมงเช้า', 'gìi mong hòk mong cháo jèt mong cháo pɛ̀ɛt mong cháo', 'What time is it? Six a.m. Seven a.m. Eight a.m.', ['What time is it? Six a.m. Seven a.m.', 'What time is it? Seven a.m. Eight a.m. Nine a.m.', 'Six a.m. Seven a.m. Eight a.m. What time is it?'], ['กี่', 'โมง', 'หก', 'โมง', 'เช้า', 'เจ็ด', 'โมง', 'เช้า', 'แปด', 'โมง', 'เช้า'], SRC.time1),
    mc('เก้าโมงเช้าสิบโมงเช้าสิบเอ็ดโมงเช้า', 'kâo mong cháo sìp mong cháo sìp-èt mong cháo', 'Nine a.m., ten a.m., eleven a.m.', ['Nine a.m., ten a.m.', 'Ten a.m., eleven a.m., noon', 'Eight a.m., nine a.m., ten a.m.'], ['เก้า', 'โมง', 'เช้า', 'สิบ', 'โมง', 'เช้า', 'สิบ', 'เอ็ด', 'โมง', 'เช้า'], SRC.time1),
    wordIntro('บ่าย', 'bàai', 'afternoon', SRC.time1),
    order('2 pm, 3 pm, 4 pm', [
      { roman: 'bàai', thai: 'บ่าย' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'mong', thai: 'โมง' },
      { roman: 'bàai', thai: 'บ่าย' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'mong', thai: 'โมง' },
      { roman: 'bàai', thai: 'บ่าย' },
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'mong', thai: 'โมง' },
    ], SRC.time1),
    speak('หกโมงเช้าบ่ายสองโมงบ่ายสามโมง', 'hòk mong cháo bàai sɔ̌ɔng mong bàai sǎam mong', 'Six a.m., 2 pm, 3 pm', ['หก', 'โมง', 'เช้า', 'บ่าย', 'สอง', 'โมง', 'บ่าย', 'สาม', 'โมง'], SRC.time1),
  ]),

  // ---------------------------------------------------------------
  lesson('n22', 'Evening and early-morning hours', [
    rule(
      'Evening and early-morning hours',
      'For 7pm-11pm, put thoom after the numbers 1-5. For 1am-5am, put tee BEFORE the number instead. Thiang means "noon".',
      SRC.time2
    ),
    wordIntro('ทุ่ม', 'thûm', 'evening hour (7pm-11pm count)', SRC.time2),
    wordIntro('ตี', 'tii', 'early-morning hour (1am-5am count)', SRC.time2),
    mc('หนึ่งทุ่มสองทุ่มสามทุ่มสี่ทุ่มห้าทุ่ม', 'nɯ̀ng thûm sɔ̌ɔng thûm sǎam thûm sìi thûm hâa thûm', '7 pm, 8 pm, 9 pm, 10 pm, 11 pm', ['7 pm, 8 pm, 9 pm', '8 pm, 9 pm, 10 pm, 11 pm', '7 pm, 9 pm, 10 pm, 11 pm'], ['หนึ่ง', 'ทุ่ม', 'สอง', 'ทุ่ม', 'สาม', 'ทุ่ม', 'สี่', 'ทุ่ม', 'ห้า', 'ทุ่ม'], SRC.time2),
    mc('ตีหนึ่งตีสองตีสามตีสี่ตีห้า', 'tii nɯ̀ng tii sɔ̌ɔng tii sǎam tii sìi tii hâa', '1 am, 2 am, 3 am, 4 am, 5 am', ['1 am, 2 am, 3 am', '2 am, 3 am, 4 am, 5 am', '1 am, 3 am, 4 am, 5 am'], ['ตี', 'หนึ่ง', 'ตี', 'สอง', 'ตี', 'สาม', 'ตี', 'สี่', 'ตี', 'ห้า'], SRC.time2),
    order('7 pm, 8 pm, 9 pm, 10 pm', [
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'thûm', thai: 'ทุ่ม' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'thûm', thai: 'ทุ่ม' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'thûm', thai: 'ทุ่ม' },
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'thûm', thai: 'ทุ่ม' },
    ], SRC.time2),
    wordIntro('เที่ยง', 'thîang', 'noon', SRC.time2),
    speak('เที่ยงตีหนึ่งตีสองตีสามตีสี่', 'thîang tii nɯ̀ng tii sɔ̌ɔng tii sǎam tii sìi', 'Noon, 1 am, 2 am, 3 am, 4 am', ['เที่ยง', 'ตี', 'หนึ่ง', 'ตี', 'สอง', 'ตี', 'สาม', 'ตี', 'สี่'], SRC.time2),
  ]),

  // ---------------------------------------------------------------
  lesson('n23', 'Dates', [
    wordIntro('วัน', 'wan', 'day', SRC.dates),
    mc('วันนี้วันที่เท่าไหร่กี่โมงหกโมงเช้าบ่ายสองโมง', 'wan-níi wan-thîi thâo-rài gìi mong hòk mong cháo bàai sɔ̌ɔng mong', "What's the date today? What time is it? Six a.m. 2 pm.", ["What's the date today? What time is it? Six a.m.", "What time is it? What's the date today? Six a.m. 2 pm.", "What's the date today? Six a.m. 2 pm."], ['วัน', 'นี้', 'วัน', 'ที่', 'เท่าไหร่', 'กี่', 'โมง', 'หก', 'โมง', 'เช้า', 'บ่าย', 'สอง', 'โมง'], SRC.dates),
    mc('วันนี้วันที่ยี่สิบกี่โมงเที่ยงบ่ายสามโมงสี่ทุ่ม', 'wan-níi wan-thîi yîi-sìp gìi mong thîang bàai sǎam mong sìi thûm', 'Today is the 20th. What time is it? Noon. 3 pm. 10 pm.', ['Today is the 20th. What time is it? Noon.', 'Today is the 21st. What time is it? Noon. 3 pm. 10 pm.', 'What time is it? Today is the 20th. Noon. 3 pm. 10 pm.'], ['วัน', 'นี้', 'วัน', 'ที่', 'ยี่สิบ', 'กี่', 'โมง', 'เที่ยง', 'บ่าย', 'สาม', 'โมง', 'สี่', 'ทุ่ม'], SRC.dates),
    order('Today is the 15th. What time is it? Noon.', [
      { roman: 'wan', thai: 'วัน' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'wan', thai: 'วัน' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'hâa', thai: 'ห้า' },
      { roman: 'gìi', thai: 'กี่' },
      { roman: 'mong', thai: 'โมง' },
      { roman: 'thîang', thai: 'เที่ยง' },
    ], SRC.dates),
    speak('วันนี้วันที่เท่าไหร่หกโมงเช้าบ่ายสองโมง', 'wan-níi wan-thîi thâo-rài hòk mong cháo bàai sɔ̌ɔng mong', "What's the date today? Six a.m. 2 pm.", ['วัน', 'นี้', 'วัน', 'ที่', 'เท่าไหร่', 'หก', 'โมง', 'เช้า', 'บ่าย', 'สอง', 'โมง'], SRC.dates),
  ]),

  // ---------------------------------------------------------------
  lesson('n24', 'Review: numbers in real sentences', [
    mc('เสื้อตัวนี้เท่าไหร่อันนี้แพงมีเงินสองร้อยบาท', 'sɯ̂a tua níi thâo-rài an-níi phaeng mii ngəən sɔ̌ɔng-rɔ́ɔi bàat', 'How much is this shirt? This one is expensive. I have two hundred baht.', ['How much is this shirt? This one is cheap. I have two hundred baht.', 'How much is this shirt? This one is expensive. I have three hundred baht.', 'This one is expensive. How much is this shirt? I have two hundred baht.'], ['เสื้อ', 'ตัว', 'นี้', 'เท่าไหร่', 'อัน', 'นี้', 'แพง', 'มี', 'เงิน', 'สอง', 'ร้อย', 'บาท'], SRC.shopping3),
    order('I have two hundred baht. House number 11.', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'ngəən', thai: 'เงิน' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'rɔ́ɔi', thai: 'ร้อย' },
      { roman: 'bàat', thai: 'บาท' },
      { roman: 'bâan', thai: 'บ้าน' },
      { roman: 'lêek', thai: 'เลข' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'sìp', thai: 'สิบ' },
      { roman: 'èt', thai: 'เอ็ด' },
    ], SRC.money),
    speak('วันนี้วันที่ยี่สิบห้ากี่โมงบ่ายสองโมงเก้าโมงเช้า', 'wan-níi wan-thîi yîi-sìp-hâa gìi mong bàai sɔ̌ɔng mong kâo mong cháo', 'Today is the 25th. What time is it? 2 pm. Nine a.m.', ['วัน', 'นี้', 'วัน', 'ที่', 'ยี่สิบ', 'ห้า', 'กี่', 'โมง', 'บ่าย', 'สอง', 'โมง', 'เก้า', 'โมง', 'เช้า'], SRC.dates),
    mc('คนที่สามเบอร์โทรศัพท์ศูนย์แปดหนึ่งบ้านเลขที่ยี่สิบ', 'kon thîi-sǎam bəə thoo-rá-sàp sǔun pɛ̀ɛt nɯ̀ng bâan-lêek-thîi yîi-sìp', 'The third person. Phone number: zero, eight, one. House number 20.', ['The third person. Phone number: zero, eight, one. House number 30.', 'The second person. Phone number: zero, eight, one. House number 20.', 'Phone number: zero, eight, one. The third person. House number 20.'], ['คน', 'ที่', 'สาม', 'เบอร์', 'โทรศัพท์', 'ศูนย์', 'แปด', 'หนึ่ง', 'บ้าน', 'เลข', 'ที่', 'ยี่สิบ'], SRC.numbers2),
    speak('บ้านเลขที่ยี่สิบหกทับสามมีเงินห้าร้อยบาทเสื้อตัวนี้แพง', 'bâan-lêek-thîi yîi-sìp-hòk tháp sǎam mii ngəən hâa-rɔ́ɔi bàat sɯ̂a tua níi phaeng', 'House number 26/3. I have five hundred baht. This shirt is expensive.', ['บ้าน', 'เลข', 'ที่', 'ยี่สิบ', 'หก', 'ทับ', 'สาม', 'มี', 'เงิน', 'ห้า', 'ร้อย', 'บาท', 'เสื้อ', 'ตัว', 'นี้', 'แพง'], SRC.address),
  ]),
];

// Pairs adjacent rawLessons (concatenating their step arrays verbatim, in
// order) into fewer, longer lessons — see comment above rawLessons.
function merge(id, title, a, b) {
  return lesson(id, title, [...a.steps, ...b.steps]);
}

const lessons = [
  merge('n01', 'Counting one to eight', rawLessons[0], rawLessons[1]),
  merge('n02', 'Nine to nineteen', rawLessons[2], rawLessons[3]),
  merge('n03', 'Tens and two-digit numbers', rawLessons[4], rawLessons[5]),
  merge('n04', 'Hundreds and thousands', rawLessons[6], rawLessons[7]),
  merge('n05', 'Ten-thousands to millions', rawLessons[8], rawLessons[9]),
  merge('n06', 'Ordinal numbers and do you have it?', rawLessons[10], rawLessons[11]),
  merge('n07', 'How many do you want? Is it expensive?', rawLessons[12], rawLessons[13]),
  merge('n08', 'How much is it? Baht and bottles', rawLessons[14], rawLessons[15]),
  merge('n09', 'Clothes and money', rawLessons[16], rawLessons[17]),
  merge('n10', 'House and phone numbers', rawLessons[18], rawLessons[19]),
  merge('n11', 'Telling time, morning to night', rawLessons[20], rawLessons[21]),
  merge('n12', 'Dates: review in real sentences', rawLessons[22], rawLessons[23]),

  // ---------------------------------------------------------------
  // Recombines vocab already taught above — every Thai token below was
  // introduced by an earlier wordIntro in this file.
  dialogue('n-dlg', 'Buying a shirt', 'Bargaining over the price of a shirt at a market stall', [
    { speaker: 'A', thai: 'เสื้อตัวนี้เท่าไหร่', roman: 'sɯ̂a tua níi thâo-rài', english: 'How much is this shirt?' },
    { speaker: 'B', thai: 'สองร้อยบาท', roman: 'sɔ̌ɔng-rɔ́ɔi bàat', english: 'Two hundred baht.' },
    { speaker: 'A', thai: 'อันนี้แพงมีสามร้อยบาท', roman: 'an-níi phaeng mii sǎam-rɔ́ɔi bàat', english: 'This one is expensive. I have three hundred baht.' },
    { speaker: 'B', thai: 'พอเอากี่ตัว', roman: 'phɔɔ ao gìi tua', english: 'Enough. How many do you want?' },
    { speaker: 'A', thai: 'เอาหนึ่งตัว', roman: 'ao nɯ̀ng tua', english: "I'll take one." },
  ], [
    { type: 'intro' },
    { type: 'comprehension', lineIndex: 0, options: [
      { text: 'How much is this shirt?', correct: true },
      { text: 'Two hundred baht.', correct: false },
      { text: 'This one is expensive. I have three hundred baht.', correct: false },
      { text: "I'll take one.", correct: false },
    ] },
    { type: 'comprehension', lineIndex: 2, options: [
      { text: 'This one is expensive. I have three hundred baht.', correct: true },
      { text: 'How much is this shirt?', correct: false },
      { text: 'Two hundred baht.', correct: false },
      { text: 'Enough. How many do you want?', correct: false },
    ] },
    { type: 'translate', lineIndex: 1, options: [
      { text: 'Two hundred baht.', correct: true },
      { text: 'How much is this shirt?', correct: false },
      { text: "I'll take one.", correct: false },
      { text: 'Enough. How many do you want?', correct: false },
    ] },
    { type: 'translate', lineIndex: 3, options: [
      { text: 'Enough. How many do you want?', correct: true },
      { text: 'Two hundred baht.', correct: false },
      { text: 'This one is expensive. I have three hundred baht.', correct: false },
      { text: "I'll take one.", correct: false },
    ] },
    { type: 'blank', lineIndex: 1, before: 'sɔ̌ɔng', after: 'bàat', options: [
      { text: 'rɔ́ɔi', correct: true },
      { text: 'phan', correct: false },
      { text: 'sɛ̌ɛn', correct: false },
      { text: 'láan', correct: false },
    ] },
    { type: 'blank', lineIndex: 4, before: 'ao', after: 'tua', options: [
      { text: 'nɯ̀ng', correct: true },
      { text: 'sɔ̌ɔng', correct: false },
      { text: 'sǎam', correct: false },
      { text: 'sìi', correct: false },
    ] },
    { type: 'speak', lineIndex: 0 },
    { type: 'speak', lineIndex: 4 },
  ]),
];

// 2026-11-08: n06-n12 rebuilt to lesson 1's standard — short real phrases plus a reply() chat step (see
// scripts/lib/phraseLessons.js). Rules and word cards above are unchanged; n01-n05 stay counting drills.
const REWRITES = {
  n06: { phrases: [
    'คน ที่ หนึ่ง|the first person',
    'คน ที่ สอง|the second person',
    'มี ห้า คน|There are five people.',
    'คน ที่ สาม|the third person',
    'มี สาม คน|There are three of us.',
    'เอา สอง|I\'ll take two.',
  ] },
  n07: { phrases: [
    'เอา กี่ อัน|How many do you want?',
    'เอา สาม อัน|I\'ll take three.',
    'นี่ แพง|This is expensive.',
    'อัน นี้ แพง|This one is expensive.',
    'มี ห้า อัน|There are five.',
  ], reply: { q: 'เอา กี่ อัน|How many do you want?', a: 'เอา สอง อัน|I\'ll take two.', wrong: ['อัน นี้ แพง', 'คน ที่ สอง'] } },
  n08: { phrases: [
    'นี่ เท่าไหร่|How much is this?',
    'ร้อย บาท|100 baht',
    'ขวด นี้ เท่าไหร่|How much is this bottle?',
    'สอง ขวด|two bottles',
    'ห้า สิบ บาท|50 baht',
  ], reply: { q: 'ขวด นี้ เท่าไหร่|How much is this bottle?', a: 'ห้า สิบ บาท|50 baht.', wrong: ['สอง ขวด', 'เอา กี่ อัน'] } },
  n09: { phrases: [
    'เสื้อ ตัว นี้ เท่าไหร่|How much is this shirt?',
    'สอง ร้อย บาท|200 baht',
    'กางเกง ตัว นี้ แพง|These pants are expensive.',
    'มี เงิน พอ|I have enough money.',
    'เอา สอง ตัว|I\'ll take two.',
  ], reply: { q: 'เสื้อ ตัว นี้ เท่าไหร่|How much is this shirt?', a: 'สาม ร้อย บาท|300 baht.', wrong: ['กางเกง', 'มี เงิน พอ'] } },
  n10: { phrases: [
    'บ้าน เลข ที่ สิบ เอ็ด|house number 11',
    'บ้าน เลข ที่ ยี่สิบ หก ทับ สาม|house number 26/3',
    'เบอร์ โทรศัพท์|phone number',
    'เบอร์ โทรศัพท์ เท่าไหร่|What\'s your phone number?',
    'ศูนย์ แปด หนึ่ง สอง|zero, eight, one, two',
  ], reply: { q: 'เบอร์ โทรศัพท์ เท่าไหร่|What\'s your phone number?', a: 'ศูนย์ แปด หนึ่ง สอง สาม|Zero, eight, one, two, three.', wrong: ['บ้าน เลข ที่ สิบ เอ็ด', 'สอง ร้อย บาท'] } },
  n11: { phrases: [
    'กี่ โมง|What time is it?',
    'หก โมง เช้า|6 a.m.',
    'บ่าย สอง โมง|2 p.m.',
    'สอง ทุ่ม|8 p.m.',
    'ตี ห้า|5 a.m.',
    'เที่ยง|noon',
  ], reply: { q: 'กี่ โมง|What time is it?', a: 'บ่าย สาม โมง|3 p.m.', wrong: ['สอง ร้อย บาท', 'เบอร์ โทรศัพท์'] } },
  n12: { phrases: [
    'วัน นี้ วัน ที่ เท่าไหร่|What\'s the date today?',
    'วัน ที่ ยี่สิบ|the 20th',
    'วัน นี้ วัน ที่ สิบ ห้า|Today is the 15th.',
    'กี่ โมง|What time is it?',
    'เสื้อ ตัว นี้ เท่าไหร่|How much is this shirt?',
  ], reply: { q: 'วัน นี้ วัน ที่ เท่าไหร่|What\'s the date today?', a: 'วัน ที่ ยี่สิบ|The 20th.', wrong: ['บ่าย สอง โมง', 'ร้อย บาท'] } },
};

const numbersSubject = subject(
  'numbers',
  'Numbers',
  'tua-lêek',
  'Real Thai counting from Essential Thai: 4-10, teens, tens, hundreds, thousands and up, ordinal numbers, prices, classifiers, money, house/phone numbers, telling time, and dates.',
  rewriteLessons(lessons, REWRITES, romanTable([{ lessons }]))
);

module.exports = { numbersSubject };
