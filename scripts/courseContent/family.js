// "Family" — transcribed from real textbook pages (Thai script, romanization,
// and English meanings are all copied from the source, not invented):
// Essential Thai: A Guide to the Basics of the Thai Language by James Higbie
// (2nd ed., Orchid Press), the "Conversation Topics" chapter's Family section
// (p.82: father/mother/parents/siblings word list and the phîi/nɔ́ɔng
// older/younger prefix rule), "talking about your family" and
// "grannies/aunties/etc" (p.83: how many siblings, where are your parents,
// grandparent/aunt/uncle terms, the Marriage word list), and "Are you
// married?" / "How many children do you have?" (p.84: married yet, faen,
// children questions).
//
// This unit reintroduces some everyday words already taught in the Greetings/
// Basics/Restaurant units (khun, mii, kháo, pen, gìi, kon, mâi, yùu, thîi-nǎi,
// rɯ́-yang, láew, yang, dâi, nɯ̀ng, sɔ̌ɔng, sǎam) since the dictionary check
// for this subject is self-contained — every spelling below is copied
// verbatim from wherever that word was first established in this codebase
// (scripts/courseContent/{greetings,basics,restaurant}.js), per each word's
// own source-page citation.
//
// Romanization reuses the diacritic convention already used elsewhere in
// this app (à/á/â/ǎ for low/high/falling/rising tones, ɔ/ɛ/ɯ/ə for open
// vowels, doubled vowel letters for long vowels). New family/relative words
// were not toned in Higbie's own plain romanization for this chapter, so
// their tones were derived from the printed Thai script using standard Thai
// tone rules by consonant class, then cross-checked against well-established
// pronunciations of these very common words.
'use strict';

const { romanTable, rewriteLessons } = require('../lib/phraseLessons');

const { wordIntro, rule, mc, order, speak, dialogue, lesson, subject } = require('../lib/courseBuilder');

const SRC = {
  family1: 'Essential Thai (Higbie), p.82',
  family2: 'Essential Thai (Higbie), p.83',
  family3: 'Essential Thai (Higbie), p.84',
  numbers: 'Essential Thai (Higbie), p.17',
  you: 'Essential Thai (Higbie), p.46',
  heShe: 'Essential Thai (Higbie), p.47',
  have: 'Essential Thai (Higbie), p.24',
  howMany: 'Essential Thai (Higbie), p.28',
  person: 'Essential Thai (Higbie), p.53',
  not: 'Essential Thai (Higbie), p.56',
  where: 'Essential Thai (Higbie), p.31',
  yet: 'Essential Thai (Higbie), p.40',
  can: 'Essential Thai (Higbie), p.59',
  connector: 'Essential Thai (Higbie), general reference (connecting words)',
};

const lessons = [
  // ---------------------------------------------------------------
  lesson('f01', 'Parents and brothers', [
    wordIntro('พ่อ', 'phɔ̂ɔ', 'father', SRC.family1),
    wordIntro('แม่', 'mɛ̂ɛ', 'mother', SRC.family1),
    mc('พ่อ', 'phɔ̂ɔ', 'Father.', ['Mother.', 'Family.', 'Older sister.'], ['พ่อ'], SRC.family1),
    mc('แม่', 'mɛ̂ɛ', 'Mother.', ['Father.', 'Older brother.', 'Siblings.'], ['แม่'], SRC.family1),
    order('father, mother', [
      { roman: 'phɔ̂ɔ', thai: 'พ่อ' },
      { roman: 'mɛ̂ɛ', thai: 'แม่' },
    ], SRC.family1),
    speak('พ่อ', 'phɔ̂ɔ', 'father', ['พ่อ'], SRC.family1),
    speak('แม่', 'mɛ̂ɛ', 'mother', ['แม่'], SRC.family1),
    wordIntro('พี่ชาย', 'phîi-chaai', 'older brother', SRC.family1),
    wordIntro('น้องชาย', 'nɔ́ɔng-chaai', 'younger brother', SRC.family1),
    mc('พี่ชาย', 'phîi-chaai', 'Older brother.', ['Younger brother.', 'Father.', 'Mother.'], ['พี่ชาย'], SRC.family1),
    mc('น้องชาย', 'nɔ́ɔng-chaai', 'Younger brother.', ['Older brother.', 'Mother.', 'Family.'], ['น้องชาย'], SRC.family1),
    order('older brother, younger brother', [
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'nɔ́ɔng-chaai', thai: 'น้องชาย' },
    ], SRC.family1),
    speak('พี่ชาย', 'phîi-chaai', 'older brother', ['พี่ชาย'], SRC.family1),
    speak('น้องชาย', 'nɔ́ɔng-chaai', 'younger brother', ['น้องชาย'], SRC.family1),
  ]),

  // ---------------------------------------------------------------
  lesson('f02', 'Sisters, siblings, and family', [
    rule(
      'Phîi and nɔ́ɔng',
      "In Thai, brothers and sisters are always identified as either older or younger. Phîi is the prefix for \"older\" and " +
        'nɔ́ɔng is for "younger". Phîi and nɔ́ɔng can also be used alone for "he/she" and "you", and phîi can be put before the ' +
        "names of older peers to show that they're older and respected.",
      SRC.family1
    ),
    wordIntro('พี่สาว', 'phîi-sǎao', 'older sister', SRC.family1),
    wordIntro('น้องสาว', 'nɔ́ɔng-sǎao', 'younger sister', SRC.family1),
    mc('พี่สาว', 'phîi-sǎao', 'Older sister.', ['Younger sister.', 'Older brother.', 'Father.'], ['พี่สาว'], SRC.family1),
    mc('น้องสาว', 'nɔ́ɔng-sǎao', 'Younger sister.', ['Older sister.', 'Younger brother.', 'Mother.'], ['น้องสาว'], SRC.family1),
    order('older sister, younger sister', [
      { roman: 'phîi-sǎao', thai: 'พี่สาว' },
      { roman: 'nɔ́ɔng-sǎao', thai: 'น้องสาว' },
    ], SRC.family1),
    speak('พี่สาว', 'phîi-sǎao', 'older sister', ['พี่สาว'], SRC.family1),
    speak('น้องสาว', 'nɔ́ɔng-sǎao', 'younger sister', ['น้องสาว'], SRC.family1),
    wordIntro('พี่น้อง', 'phîi-nɔ́ɔng', 'brothers and sisters / siblings', SRC.family1),
    wordIntro('ครอบครัว', 'khrɔ̂ɔp-khrua', 'family', SRC.family1),
    wordIntro('กับ', 'gàp', 'and / with', SRC.connector),
    mc('พี่น้อง', 'phîi-nɔ́ɔng', 'Brothers and sisters / siblings.', ['Parents.', 'Family.', 'Younger sister.'], ['พี่น้อง'], SRC.family1),
    mc('ครอบครัว', 'khrɔ̂ɔp-khrua', 'Family.', ['Siblings.', 'Older brother.', 'Mother.'], ['ครอบครัว'], SRC.family1),
    mc('พ่อแม่', 'phɔ̂ɔ-mɛ̂ɛ', 'Parents.', ['Siblings.', 'Family.', 'Younger brother.'], ['พ่อ', 'แม่'], SRC.family1),
    mc('พี่ชายกับน้องสาว', 'phîi-chaai gàp nɔ́ɔng-sǎao', 'Older brother and younger sister.', ['Older sister and younger brother.', 'Parents.', 'Family.'], ['พี่ชาย', 'กับ', 'น้องสาว'], SRC.family1),
    order('family and siblings', [
      { roman: 'khrɔ̂ɔp-khrua', thai: 'ครอบครัว' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'phîi-nɔ́ɔng', thai: 'พี่น้อง' },
    ], SRC.family1),
    speak('ครอบครัว', 'khrɔ̂ɔp-khrua', 'family', ['ครอบครัว'], SRC.family1),
    speak('พี่น้องกับครอบครัว', 'phîi-nɔ́ɔng gàp khrɔ̂ɔp-khrua', 'Siblings and family.', ['พี่น้อง', 'กับ', 'ครอบครัว'], SRC.family1),
  ]),

  // ---------------------------------------------------------------
  lesson('f03', 'He, she, you, and have', [
    wordIntro('เค้า', 'kháo', 'he / she', SRC.heShe),
    wordIntro('เป็น', 'pen', 'to be / is', SRC.heShe),
    mc('เค้าเป็นพี่ชาย', 'kháo pen phîi-chaai', "He's my older brother.", ["He's my younger brother.", "She's my mother.", 'Family.'], ['เค้า', 'เป็น', 'พี่ชาย'], SRC.heShe),
    order("He's my older sister.", [
      { roman: 'kháo', thai: 'เค้า' },
      { roman: 'pen', thai: 'เป็น' },
      { roman: 'phîi-sǎao', thai: 'พี่สาว' },
    ], SRC.heShe),
    mc('เค้าเป็นน้องสาว', 'kháo pen nɔ́ɔng-sǎao', "She's my younger sister.", ["She's my older sister.", "He's my father.", 'Siblings.'], ['เค้า', 'เป็น', 'น้องสาว'], SRC.heShe),
    speak('เค้าเป็นพ่อ', 'kháo pen phɔ̂ɔ', "He's my father.", ['เค้า', 'เป็น', 'พ่อ'], SRC.heShe),
    speak('เค้าเป็นแม่กับเค้าเป็นพี่น้อง', 'kháo pen mɛ̂ɛ gàp kháo pen phîi-nɔ́ɔng', "She's my mother, and they're my siblings.", ['เค้า', 'เป็น', 'แม่', 'กับ', 'เค้า', 'เป็น', 'พี่น้อง'], SRC.heShe),
    wordIntro('คุณ', 'khun', 'you', SRC.you),
    wordIntro('มี', 'mii', 'have / there is', SRC.have),
    mc('คุณมีครอบครัวกับพี่น้อง', 'khun mii khrɔ̂ɔp-khrua gàp phîi-nɔ́ɔng', 'You have a family and siblings.', ['You have a family.', "She's my mother.", 'Family.'], ['คุณ', 'มี', 'ครอบครัว', 'กับ', 'พี่น้อง'], SRC.family1),
    order('You have an older brother and a younger sister.', [
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'nɔ́ɔng-sǎao', thai: 'น้องสาว' },
    ], SRC.family1),
    mc('มีพี่สาวกับน้องชาย', 'mii phîi-sǎao gàp nɔ́ɔng-chaai', 'Have an older sister and a younger brother.', ['Have a family.', "He's my father.", 'You have siblings.'], ['มี', 'พี่สาว', 'กับ', 'น้องชาย'], SRC.have),
    speak('คุณมีพี่น้องกับเค้าเป็นน้องสาว', 'khun mii phîi-nɔ́ɔng gàp kháo pen nɔ́ɔng-sǎao', "You have siblings, and she's (my) younger sister.", ['คุณ', 'มี', 'พี่น้อง', 'กับ', 'เค้า', 'เป็น', 'น้องสาว'], SRC.family1),
  ]),

  // ---------------------------------------------------------------
  lesson('f04', 'How many? Numbers one and two', [
    wordIntro('กี่', 'gìi', 'how many?', SRC.howMany),
    wordIntro('คน', 'kon', 'person (classifier for people)', SRC.person),
    mc('คุณมีพี่น้องกี่คน', 'khun mii phîi-nɔ́ɔng gìi kon', 'How many siblings do you have?', ['How many people?', 'You have a family.', "She's my mother."], ['คุณ', 'มี', 'พี่น้อง', 'กี่', 'คน'], SRC.family2),
    order('How many older brothers and younger sisters do you have?', [
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'nɔ́ɔng-sǎao', thai: 'น้องสาว' },
      { roman: 'gìi', thai: 'กี่' },
      { roman: 'kon', thai: 'คน' },
    ], SRC.person),
    mc('กี่คน', 'gìi kon', 'How many people?', ['How many siblings?', 'Have a family.', 'Older sister.'], ['กี่', 'คน'], SRC.person),
    speak('คุณมีพี่น้องกี่คนเค้าเป็นพี่ชาย', 'khun mii phîi-nɔ́ɔng gìi kon, kháo pen phîi-chaai', "How many siblings do you have? He's (my) older brother.", ['คุณ', 'มี', 'พี่น้อง', 'กี่', 'คน', 'เค้า', 'เป็น', 'พี่ชาย'], SRC.family2),
    wordIntro('หนึ่ง', 'nɯ̀ng', 'one', SRC.numbers),
    wordIntro('สอง', 'sɔ̌ɔng', 'two', SRC.numbers),
    mc('มีพี่น้องคนหนึ่ง', 'mii phîi-nɔ́ɔng kon nɯ̀ng', 'I have one sibling.', ['I have two siblings.', 'How many people?', 'Have a family.'], ['มี', 'พี่น้อง', 'คน', 'หนึ่ง'], SRC.numbers),
    mc('มีพี่น้องสองคน', 'mii phîi-nɔ́ɔng sɔ̌ɔng kon', 'I have two siblings.', ['I have one sibling.', 'I have three siblings.', 'Family.'], ['มี', 'พี่น้อง', 'สอง', 'คน'], SRC.numbers),
    order('I have one older brother and two younger sisters.', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'nɔ́ɔng-sǎao', thai: 'น้องสาว' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'kon', thai: 'คน' },
    ], SRC.numbers),
    speak('หนึ่งคน', 'nɯ̀ng kon', 'one person', ['หนึ่ง', 'คน'], SRC.numbers),
    speak('มีน้องชายสองคนกับพี่สาวคนหนึ่ง', 'mii nɔ́ɔng-chaai sɔ̌ɔng kon gàp phîi-sǎao kon nɯ̀ng', 'I have two younger brothers and one older sister.', ['มี', 'น้องชาย', 'สอง', 'คน', 'กับ', 'พี่สาว', 'คน', 'หนึ่ง'], SRC.numbers),
  ]),

  // ---------------------------------------------------------------
  lesson('f05', 'Numbers three, four, and son', [
    wordIntro('สาม', 'sǎam', 'three', SRC.numbers),
    wordIntro('สี่', 'sìi', 'four', SRC.numbers),
    mc('มีพี่น้องสี่คนกับเค้าเป็นพี่ชาย', 'mii phîi-nɔ́ɔng sìi kon gàp kháo pen phîi-chaai', "I have four siblings, and he's (my) older brother.", ['I have three siblings.', 'How many siblings do you have?', 'You have a family.'], ['มี', 'พี่น้อง', 'สี่', 'คน', 'กับ', 'เค้า', 'เป็น', 'พี่ชาย'], SRC.family2),
    order('I have three older brothers and four younger sisters.', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'sǎam', thai: 'สาม' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'nɔ́ɔng-sǎao', thai: 'น้องสาว' },
      { roman: 'sìi', thai: 'สี่' },
      { roman: 'kon', thai: 'คน' },
    ], SRC.numbers),
    mc('สามคน', 'sǎam kon', 'Three people.', ['Four people.', 'Two people.', 'One person.'], ['สาม', 'คน'], SRC.numbers),
    speak('คุณมีพี่น้องกี่คนมีสามคน', 'khun mii phîi-nɔ́ɔng gìi kon, mii sǎam kon', 'How many siblings do you have? I have three.', ['คุณ', 'มี', 'พี่น้อง', 'กี่', 'คน', 'มี', 'สาม', 'คน'], SRC.family2),
    mc('มีพี่ชายคนหนึ่งกับน้องสาวสองคน', 'mii phîi-chaai kon nɯ̀ng gàp nɔ́ɔng-sǎao sɔ̌ɔng kon', 'I have one older brother and two younger sisters.', ['I have one younger sister.', 'How many siblings do you have?', 'You have a family.'], ['มี', 'พี่ชาย', 'คน', 'หนึ่ง', 'กับ', 'น้องสาว', 'สอง', 'คน'], SRC.family2),
    order('I have one older brother and two younger brothers.', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'nɔ́ɔng-chaai', thai: 'น้องชาย' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'kon', thai: 'คน' },
    ], SRC.family2),
    wordIntro('ลูก', 'lûuk', 'child / children', SRC.family3),
    wordIntro('ลูกชาย', 'lûuk-chaai', 'son', SRC.family3),
    mc('ลูก', 'lûuk', 'Child / children.', ['Son.', 'Daughter.', 'Family.'], ['ลูก'], SRC.family3),
    mc('มีลูกชายคนหนึ่ง', 'mii lûuk-chaai kon nɯ̀ng', 'I have one son.', ['Daughter.', 'Child.', 'Older brother.'], ['มี', 'ลูกชาย', 'คน', 'หนึ่ง'], SRC.family3),
    speak('มีลูกคนหนึ่งกับเค้าเป็นลูกชาย', 'mii lûuk kon nɯ̀ng gàp kháo pen lûuk-chaai', 'I have one child, and he is (my) son.', ['มี', 'ลูก', 'คน', 'หนึ่ง', 'กับ', 'เค้า', 'เป็น', 'ลูกชาย'], SRC.family3),
    speak('ลูก', 'lûuk', 'child / children', ['ลูก'], SRC.family3),
  ]),

  // ---------------------------------------------------------------
  lesson('f06', 'Daughters and where is home?', [
    wordIntro('ลูกสาว', 'lûuk-sǎao', 'daughter', SRC.family3),
    mc('ลูกสาว', 'lûuk-sǎao', 'Daughter.', ['Son.', 'Child.', 'Younger sister.'], ['ลูกสาว'], SRC.family3),
    mc('มีลูกชายคนหนึ่งกับลูกสาวสองคน', 'mii lûuk-chaai kon nɯ̀ng gàp lûuk-sǎao sɔ̌ɔng kon', 'I have one son and two daughters.', ['One daughter and two sons.', 'I have three siblings.', 'How many children?'], ['มี', 'ลูกชาย', 'คน', 'หนึ่ง', 'กับ', 'ลูกสาว', 'สอง', 'คน'], SRC.family3),
    order('I have two daughters and one son.', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'lûuk-sǎao', thai: 'ลูกสาว' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'lûuk-chaai', thai: 'ลูกชาย' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
    ], SRC.family3),
    speak('ลูกสาว', 'lûuk-sǎao', 'daughter', ['ลูกสาว'], SRC.family3),
    speak('มีลูกกี่คนมีลูกชายคนหนึ่ง', 'mii lûuk gìi kon, mii lûuk-chaai kon nɯ̀ng', 'How many children do you have? I have one son.', ['มี', 'ลูก', 'กี่', 'คน', 'มี', 'ลูกชาย', 'คน', 'หนึ่ง'], SRC.family3),
    wordIntro('อยู่', 'yùu', 'be at / stay', SRC.where),
    wordIntro('ที่ไหน', 'thîi-nǎi', 'where?', SRC.where),
    mc('พ่อแม่อยู่ที่ไหนมีพี่น้องกี่คน', 'phɔ̂ɔ-mɛ̂ɛ yùu thîi-nǎi, mii phîi-nɔ́ɔng gìi kon', 'Where are your parents? How many siblings do you have?', ["They're at home.", 'How many siblings?', 'I have one older brother.'], ['พ่อ', 'แม่', 'อยู่', 'ที่ไหน', 'มี', 'พี่น้อง', 'กี่', 'คน'], SRC.family2),
    order('Where are your older brother and younger sister?', [
      { roman: 'phîi-chaai', thai: 'พี่ชาย' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'nɔ́ɔng-sǎao', thai: 'น้องสาว' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'thîi-nǎi', thai: 'ที่ไหน' },
    ], SRC.family2),
    mc('เค้าอยู่ที่ไหน', 'kháo yùu thîi-nǎi', 'Where is he/she?', ['Have a family.', 'One older brother.', 'Younger sister.'], ['เค้า', 'อยู่', 'ที่ไหน'], SRC.where),
    speak('มีพี่น้องกี่คนพ่อแม่อยู่ที่ไหน', 'mii phîi-nɔ́ɔng gìi kon, phɔ̂ɔ-mɛ̂ɛ yùu thîi-nǎi', 'How many siblings do you have? Where are your parents?', ['มี', 'พี่น้อง', 'กี่', 'คน', 'พ่อ', 'แม่', 'อยู่', 'ที่ไหน'], SRC.family2),
  ]),

  // ---------------------------------------------------------------
  lesson('f07', 'Home, grandma, and grandpa', [
    wordIntro('ที่นี่', 'thîi-nîi', 'here', SRC.family2),
    wordIntro('บ้าน', 'bâan', 'home / house', SRC.family2),
    mc('น้องสาวอยู่ที่นี่กับพี่ชายอยู่บ้าน', 'nɔ́ɔng-sǎao yùu thîi-nîi gàp phîi-chaai yùu bâan', 'My younger sister is here, and my older brother is at home.', ['My older sister is here.', 'Where are your parents?', 'I have four siblings.'], ['น้องสาว', 'อยู่', 'ที่นี่', 'กับ', 'พี่ชาย', 'อยู่', 'บ้าน'], SRC.family2),
    order('My parents are at home, and my siblings are here.', [
      { roman: 'phɔ̂ɔ', thai: 'พ่อ' },
      { roman: 'mɛ̂ɛ', thai: 'แม่' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'bâan', thai: 'บ้าน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'phîi-nɔ́ɔng', thai: 'พี่น้อง' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'thîi-nîi', thai: 'ที่นี่' },
    ], SRC.family2),
    mc('พ่อแม่อยู่บ้านกับลูกอยู่ที่นี่', 'phɔ̂ɔ-mɛ̂ɛ yùu bâan gàp lûuk yùu thîi-nîi', 'Parents are at home, and the children are here.', ['Where are your parents?', 'My younger sister is here.', 'I have one older brother.'], ['พ่อ', 'แม่', 'อยู่', 'บ้าน', 'กับ', 'ลูก', 'อยู่', 'ที่นี่'], SRC.family2),
    speak('มีลูกกี่คนลูกอยู่ที่นี่', 'mii lûuk gìi kon, lûuk yùu thîi-nîi', 'How many children do you have? The children are here.', ['มี', 'ลูก', 'กี่', 'คน', 'ลูก', 'อยู่', 'ที่นี่'], SRC.family2),
    speak('พี่ชายอยู่บ้านกับน้องชาย', 'phîi-chaai yùu bâan gàp nɔ́ɔng-chaai', 'My older brother is at home with my younger brother.', ['พี่ชาย', 'อยู่', 'บ้าน', 'กับ', 'น้องชาย'], SRC.family2),
    rule(
      'One big family',
      "Some relationship terms are used to refer to people you're not related to — in Thai culture everyone is considered a " +
        "big family. Yaai and taa are used for a woman/man your grandmother's/grandfather's age (they literally refer to your " +
        "mother's mother/father), and lung, pâa, and náa are used the same way for an uncle or aunt's age.",
      SRC.family2
    ),
    wordIntro('ยาย', 'yaai', "grandmother (lit. mother's mother)", SRC.family2),
    wordIntro('ตา', 'taa', "grandfather (lit. mother's father)", SRC.family2),
    mc('ยายอยู่บ้าน', 'yaai yùu bâan', 'Grandmother is at home.', ['Grandfather.', 'Mother.', 'Aunt.'], ['ยาย', 'อยู่', 'บ้าน'], SRC.family2),
    mc('ตาอยู่ที่ไหน', 'taa yùu thîi-nǎi', 'Where is grandfather?', ['Grandmother.', 'Father.', 'Uncle.'], ['ตา', 'อยู่', 'ที่ไหน'], SRC.family2),
    order('Grandmother and grandfather are at home.', [
      { roman: 'yaai', thai: 'ยาย' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'taa', thai: 'ตา' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'bâan', thai: 'บ้าน' },
    ], SRC.family2),
    speak('ยายกับตาอยู่ที่นี่', 'yaai gàp taa yùu thîi-nîi', 'Grandmother and grandfather are here.', ['ยาย', 'กับ', 'ตา', 'อยู่', 'ที่นี่'], SRC.family2),
    speak('ตาอยู่บ้านมีพี่น้องกี่คน', 'taa yùu bâan, mii phîi-nɔ́ɔng gìi kon', 'Grandfather is at home. How many siblings do you have?', ['ตา', 'อยู่', 'บ้าน', 'มี', 'พี่น้อง', 'กี่', 'คน'], SRC.family2),
  ]),

  // ---------------------------------------------------------------
  lesson('f08', 'Uncles, aunts, and partners', [
    wordIntro('ลุง', 'lung', "uncle (lit. parents' older brother)", SRC.family2),
    wordIntro('ป้า', 'pâa', "aunt (lit. parents' older sister)", SRC.family2),
    mc('ลุงอยู่ที่ไหน', 'lung yùu thîi-nǎi', 'Where is uncle?', ['Aunt.', 'Grandfather.', 'Younger brother.'], ['ลุง', 'อยู่', 'ที่ไหน'], SRC.family2),
    mc('ป้าอยู่บ้าน', 'pâa yùu bâan', 'Aunt is at home.', ['Uncle.', 'Grandmother.', 'Older sister.'], ['ป้า', 'อยู่', 'บ้าน'], SRC.family2),
    order('Uncle and aunt are here.', [
      { roman: 'lung', thai: 'ลุง' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'pâa', thai: 'ป้า' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'thîi-nîi', thai: 'ที่นี่' },
    ], SRC.family2),
    speak('ลุงกับป้าอยู่บ้าน', 'lung gàp pâa yùu bâan', 'Uncle and aunt are at home.', ['ลุง', 'กับ', 'ป้า', 'อยู่', 'บ้าน'], SRC.family2),
    speak('ยายตาลุงกับป้าอยู่บ้าน', 'yaai taa lung gàp pâa yùu bâan', 'Grandmother, grandfather, uncle, and aunt are at home.', ['ยาย', 'ตา', 'ลุง', 'กับ', 'ป้า', 'อยู่', 'บ้าน'], SRC.family2),
    wordIntro('น้า', 'náa', "aunt/uncle (lit. mother's younger sibling)", SRC.family2),
    mc('น้าอยู่ที่ไหน', 'náa yùu thîi-nǎi', "Where is (your) aunt/uncle?", ['Aunt (older).', 'Uncle (older).', 'Grandmother.'], ['น้า', 'อยู่', 'ที่ไหน'], SRC.family2),
    speak('น้าอยู่บ้านกับยาย', 'náa yùu bâan gàp yaai', "(My) aunt/uncle is at home with grandmother.", ['น้า', 'อยู่', 'บ้าน', 'กับ', 'ยาย'], SRC.family2),
    wordIntro('แฟน', 'fɛɛn', 'girlfriend / boyfriend / husband / wife', SRC.family2),
    mc('คุณมีแฟน', 'khun mii fɛɛn', 'You have a girlfriend/boyfriend/husband/wife.', ['You have a family.', 'You have siblings.', "He's my father."], ['คุณ', 'มี', 'แฟน'], SRC.family2),
    speak('เค้าเป็นแฟนกับอยู่ที่นี่', 'kháo pen fɛɛn gàp yùu thîi-nîi', "He/she is (my) girlfriend/boyfriend/husband/wife, and (is) here.", ['เค้า', 'เป็น', 'แฟน', 'กับ', 'อยู่', 'ที่นี่'], SRC.family2),
  ]),

  // ---------------------------------------------------------------
  lesson('f09', 'Married yet? Already or not', [
    rule(
      'Married yet?',
      'Marriage is considered inevitable in Thai, so instead of asking "Are you married?" people ask "Are you married yet?" ' +
        'using rɯ́-yang at the end of the question.',
      SRC.family3
    ),
    wordIntro('แต่งงาน', 'tɛ̀ng-ngaan', 'to marry', SRC.family2),
    wordIntro('รึยัง', 'rɯ́-yang', '...yet?', SRC.yet),
    mc('คุณแต่งงานรึยังมีแฟนรึยัง', 'khun tɛ̀ng-ngaan rɯ́-yang, mii fɛɛn rɯ́-yang', 'Are you married yet? Do you have a girlfriend/boyfriend yet?', ['Do you have a family?', 'I have one older brother.', 'Where are your parents?'], ['คุณ', 'แต่งงาน', 'รึยัง', 'มี', 'แฟน', 'รึยัง'], SRC.family3),
    order('Are you married yet? Do you have children yet?', [
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'tɛ̀ng-ngaan', thai: 'แต่งงาน' },
      { roman: 'rɯ́-yang', thai: 'รึยัง' },
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'lûuk', thai: 'ลูก' },
      { roman: 'rɯ́-yang', thai: 'รึยัง' },
    ], SRC.family3),
    mc('คุณมีแฟนรึยังมีลูกกี่คน', 'khun mii fɛɛn rɯ́-yang, mii lûuk gìi kon', 'Do you have a girlfriend/boyfriend yet? How many children do you have?', ['Are you married yet?', 'How many children do you have?', 'My younger sister is here.'], ['คุณ', 'มี', 'แฟน', 'รึยัง', 'มี', 'ลูก', 'กี่', 'คน'], SRC.family3),
    speak('คุณแต่งงานรึยังมีแฟนรึยังมีลูกกี่คน', 'khun tɛ̀ng-ngaan rɯ́-yang, mii fɛɛn rɯ́-yang, mii lûuk gìi kon', 'Are you married yet? Do you have a girlfriend/boyfriend yet? How many children do you have?', ['คุณ', 'แต่งงาน', 'รึยัง', 'มี', 'แฟน', 'รึยัง', 'มี', 'ลูก', 'กี่', 'คน'], SRC.family3),
    wordIntro('แล้ว', 'láew', 'already', SRC.yet),
    wordIntro('ยัง', 'yang', 'yet / still', SRC.yet),
    mc('คุณแต่งงานแล้วกับมีลูกกี่คน', 'khun tɛ̀ng-ngaan láew gàp mii lûuk gìi kon', "You're already married, and how many children do you have?", ['Not married yet.', 'Are you married yet?', 'I have a family.'], ['คุณ', 'แต่งงาน', 'แล้ว', 'กับ', 'มี', 'ลูก', 'กี่', 'คน'], SRC.family3),
    mc('คุณยังอยู่ที่นี่', 'khun yang yùu thîi-nîi', 'Are you still here?', ['Already.', 'Married.', 'Have.'], ['คุณ', 'ยัง', 'อยู่', 'ที่นี่'], SRC.yet),
    order("You're already married, and (your) parents are at home.", [
      { roman: 'khun', thai: 'คุณ' },
      { roman: 'tɛ̀ng-ngaan', thai: 'แต่งงาน' },
      { roman: 'láew', thai: 'แล้ว' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'phɔ̂ɔ', thai: 'พ่อ' },
      { roman: 'mɛ̂ɛ', thai: 'แม่' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'bâan', thai: 'บ้าน' },
    ], SRC.family3),
    speak('คุณแต่งงานแล้วกับมีลูกชายคนหนึ่งลูกสาวสองคน', 'khun tɛ̀ng-ngaan láew gàp mii lûuk-chaai kon nɯ̀ng lûuk-sǎao sɔ̌ɔng kon', "You're already married, and (you) have one son and two daughters.", ['คุณ', 'แต่งงาน', 'แล้ว', 'กับ', 'มี', 'ลูกชาย', 'คน', 'หนึ่ง', 'ลูกสาว', 'สอง', 'คน'], SRC.family3),
    speak('พี่น้องยังอยู่ที่นี่', 'phîi-nɔ́ɔng yang yùu thîi-nîi', '(My) siblings are still here.', ['พี่น้อง', 'ยัง', 'อยู่', 'ที่นี่'], SRC.yet),
  ]),

  // ---------------------------------------------------------------
  lesson('f10', 'Not yet married; kids, how many?', [
    wordIntro('ไม่', 'mâi', 'not / no', SRC.not),
    wordIntro('ได้', 'dâi', 'have (done) — yang mâi dâi: not ... yet', SRC.can),
    mc('คุณแต่งงานรึยังยังไม่ได้แต่งงาน', 'khun tɛ̀ng-ngaan rɯ́-yang, yang mâi dâi tɛ̀ng-ngaan', "Are you married yet? Not married yet.", ['Married already.', 'Are you married yet?', 'How many children do you have?'], ['คุณ', 'แต่งงาน', 'รึยัง', 'ยัง', 'ไม่', 'ได้', 'แต่งงาน'], SRC.family3),
    order("I'm not married yet, and I don't have children yet.", [
      { roman: 'yang', thai: 'ยัง' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'dâi', thai: 'ได้' },
      { roman: 'tɛ̀ng-ngaan', thai: 'แต่งงาน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'yang', thai: 'ยัง' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'lûuk', thai: 'ลูก' },
    ], SRC.family3),
    mc('คุณมีแฟนรึยังไม่มี', 'khun mii fɛɛn rɯ́-yang, mâi mii', "Do you have a girlfriend/boyfriend yet? No, I don't.", ['Yes, have already.', 'Married already.', 'Family.'], ['คุณ', 'มี', 'แฟน', 'รึยัง', 'ไม่', 'มี'], SRC.family3),
    speak('มีลูกชายคนหนึ่งแล้วกับมีลูกสาวสองคนแล้ว', 'mii lûuk-chaai kon nɯ̀ng láew gàp mii lûuk-sǎao sɔ̌ɔng kon láew', 'I already have one son, and I already have two daughters.', ['มี', 'ลูกชาย', 'คน', 'หนึ่ง', 'แล้ว', 'กับ', 'มี', 'ลูกสาว', 'สอง', 'คน', 'แล้ว'], SRC.family3),
    speak('ยังไม่ได้แต่งงานกับยังไม่มีแฟน', 'yang mâi dâi tɛ̀ng-ngaan gàp yang mâi mii fɛɛn', "I'm not married yet, and I don't have a girlfriend/boyfriend yet.", ['ยัง', 'ไม่', 'ได้', 'แต่งงาน', 'กับ', 'ยัง', 'ไม่', 'มี', 'แฟน'], SRC.family3),
    mc('คุณแต่งงานรึยังคุณมีลูกรึยัง', 'khun tɛ̀ng-ngaan rɯ́-yang, khun mii lûuk rɯ́-yang', 'Are you married yet? Do you have any children yet?', ['How many children do you have?', 'Are you married yet?', 'I have one older brother.'], ['คุณ', 'แต่งงาน', 'รึยัง', 'คุณ', 'มี', 'ลูก', 'รึยัง'], SRC.family3),
    order('I have one son and two daughters, and (they) are at home.', [
      { roman: 'mii', thai: 'มี' },
      { roman: 'lûuk-chaai', thai: 'ลูกชาย' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'nɯ̀ng', thai: 'หนึ่ง' },
      { roman: 'lûuk-sǎao', thai: 'ลูกสาว' },
      { roman: 'sɔ̌ɔng', thai: 'สอง' },
      { roman: 'kon', thai: 'คน' },
      { roman: 'gàp', thai: 'กับ' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'bâan', thai: 'บ้าน' },
    ], SRC.family3),
    mc('มีลูกกี่คนมีลูกชายคนหนึ่งกับลูกสาวสองคน', 'mii lûuk gìi kon, mii lûuk-chaai kon nɯ̀ng gàp lûuk-sǎao sɔ̌ɔng kon', 'How many children do you have? I have one son and two daughters.', ['Do you have any children yet?', 'How many siblings do you have?', 'One son and two daughters.'], ['มี', 'ลูก', 'กี่', 'คน', 'มี', 'ลูกชาย', 'คน', 'หนึ่ง', 'กับ', 'ลูกสาว', 'สอง', 'คน'], SRC.family3),
    wordIntro('โสด', 'sòot', 'single / unmarried', SRC.family2),
    mc('คุณแต่งงานรึยังยังโสด', 'khun tɛ̀ng-ngaan rɯ́-yang, yang sòot', 'Are you married yet? Still single.', ['Married.', 'Have a family.', 'Already.'], ['คุณ', 'แต่งงาน', 'รึยัง', 'ยัง', 'โสด'], SRC.family2),
    speak('ยังไม่ได้แต่งงานยังโสด', 'yang mâi dâi tɛ̀ng-ngaan, yang sòot', "I'm not married yet, (I'm) still single.", ['ยัง', 'ไม่', 'ได้', 'แต่งงาน', 'ยัง', 'โสด'], SRC.family2),
    speak('พ่อแม่อยู่บ้านกับมีพี่ชายคนหนึ่งกับยังโสด', 'phɔ̂ɔ-mɛ̂ɛ yùu bâan gàp mii phîi-chaai kon nɯ̀ng gàp yang sòot', "(My) parents are at home, and I have one older brother, and I'm still single.", ['พ่อ', 'แม่', 'อยู่', 'บ้าน', 'กับ', 'มี', 'พี่ชาย', 'คน', 'หนึ่ง', 'กับ', 'ยัง', 'โสด'], SRC.family3),
  ]),

  // ---------------------------------------------------------------
  dialogue(
    'family-dlg',
    'Catching up on family',
    'Two old friends catching up about marriage and family.',
    [
      { speaker: 'A', thai: 'คุณแต่งงานรึยัง', roman: 'khun tɛ̀ng-ngaan rɯ́-yang', english: 'Are you married yet?' },
      { speaker: 'B', thai: 'ยังไม่ได้แต่งงานยังโสด', roman: 'yang mâi dâi tɛ̀ng-ngaan, yang sòot', english: "Not married yet, still single." },
      { speaker: 'A', thai: 'คุณมีพี่น้องกี่คน', roman: 'khun mii phîi-nɔ́ɔng gìi kon', english: 'How many siblings do you have?' },
      { speaker: 'B', thai: 'มีพี่ชายคนหนึ่งกับน้องสาวสองคน', roman: 'mii phîi-chaai kon nɯ̀ng gàp nɔ́ɔng-sǎao sɔ̌ɔng kon', english: 'I have one older brother and two younger sisters.' },
      { speaker: 'A', thai: 'พ่อแม่อยู่ที่ไหน', roman: 'phɔ̂ɔ-mɛ̂ɛ yùu thîi-nǎi', english: 'Where are your parents?' },
      { speaker: 'B', thai: 'อยู่บ้าน', roman: 'yùu bâan', english: 'At home.' },
    ],
    [
      { type: 'intro' },
      {
        type: 'comprehension', lineIndex: 1,
        options: [
          { text: 'Not married yet, still single.', correct: true },
          { text: 'How many siblings do you have?', correct: false },
          { text: 'Where are your parents?', correct: false },
          { text: 'I have a family.', correct: false },
        ],
      },
      {
        type: 'comprehension', lineIndex: 3,
        options: [
          { text: 'I have one older brother and two younger sisters.', correct: true },
          { text: 'How many siblings do you have?', correct: false },
          { text: 'Not married yet, still single.', correct: false },
          { text: 'At home.', correct: false },
        ],
      },
      {
        type: 'translate', lineIndex: 0,
        options: [
          { text: 'Are you married yet?', correct: true },
          { text: 'How many siblings do you have?', correct: false },
          { text: 'Where are your parents?', correct: false },
          { text: 'At home.', correct: false },
        ],
      },
      {
        type: 'translate', lineIndex: 4,
        options: [
          { text: 'Where are your parents?', correct: true },
          { text: 'Are you married yet?', correct: false },
          { text: 'I have one older brother and two younger sisters.', correct: false },
          { text: 'At home.', correct: false },
        ],
      },
      {
        type: 'blank', lineIndex: 2, before: 'khun mii phîi-nɔ́ɔng', after: 'kon',
        options: [
          { text: 'gìi', correct: true },
          { text: 'yang', correct: false },
          { text: 'mâi', correct: false },
          { text: 'dâi', correct: false },
        ],
      },
      {
        type: 'blank', lineIndex: 1, before: 'yang', after: 'dâi tɛ̀ng-ngaan, yang sòot',
        options: [
          { text: 'mâi', correct: true },
          { text: 'gìi', correct: false },
          { text: 'khun', correct: false },
          { text: 'yùu', correct: false },
        ],
      },
      { type: 'speak', lineIndex: 0 },
      { type: 'speak', lineIndex: 4 },
    ]
  ),
];

// 2026-11-08: f03-f10 rebuilt to lesson 1's standard — short real phrases plus a reply() chat step (see
// scripts/lib/phraseLessons.js). Rules and word cards above are unchanged.
const REWRITES = {
  f03: { phrases: [
    'เค้า เป็น พ่อ|He\'s my father.',
    'เค้า เป็น น้องสาว|She\'s my younger sister.',
    'มี พี่ชาย|I have an older brother.',
    'เค้า เป็น พี่ชาย|He\'s my older brother.',
    'มี พี่สาว กับ น้องชาย|I have an older sister and a younger brother.',
    'คุณ มี ครอบครัว|You have a family.',
  ] },
  f04: { phrases: [
    'คุณ มี พี่น้อง กี่ คน|How many siblings do you have?',
    'มี พี่น้อง สอง คน|I have two siblings.',
    'มี พี่ชาย คน หนึ่ง|I have one older brother.',
    'กี่ คน|How many people?',
    'มี น้องสาว สอง คน|I have two younger sisters.',
  ], reply: { q: 'คุณ มี พี่น้อง กี่ คน|How many siblings do you have?', a: 'มี พี่น้อง สอง คน|I have two siblings.', wrong: ['กี่ คน', 'เค้า เป็น พ่อ'] } },
  f05: { phrases: [
    'มี พี่น้อง สาม คน|I have three siblings.',
    'มี ลูกชาย คน หนึ่ง|I have one son.',
    'คุณ มี ลูก กี่ คน|How many children do you have?',
    'มี ลูก สี่ คน|I have four children.',
    'มี น้องชาย สาม คน|I have three younger brothers.',
  ], reply: { q: 'คุณ มี ลูก กี่ คน|How many children do you have?', a: 'มี ลูก สาม คน|I have three children.', wrong: ['มี พี่น้อง สี่ คน', 'กี่ คน'] } },
  f06: { phrases: [
    'มี ลูกสาว สอง คน|I have two daughters.',
    'พ่อ แม่ อยู่ ที่ไหน|Where are your parents?',
    'เค้า อยู่ ที่ไหน|Where is he/she?',
    'ลูกสาว อยู่ ที่ไหน|Where is your daughter?',
    'มี ลูกชาย คน หนึ่ง กับ ลูกสาว สอง คน|I have one son and two daughters.',
  ], reply: { q: 'คุณ มี ลูก กี่ คน|How many children do you have?', a: 'มี ลูกสาว สอง คน|I have two daughters.', wrong: ['เค้า อยู่ ที่ไหน', 'ลูกชาย'] } },
  f07: { phrases: [
    'ยาย อยู่ บ้าน|Grandma is at home.',
    'ตา อยู่ ที่ไหน|Where is grandpa?',
    'พ่อ แม่ อยู่ บ้าน|My parents are at home.',
    'ลูก อยู่ ที่นี่|The children are here.',
    'น้องชาย อยู่ ที่นี่|My younger brother is here.',
  ], reply: { q: 'ตา อยู่ ที่ไหน|Where is grandpa?', a: 'ตา อยู่ บ้าน|Grandpa is at home.', wrong: ['ยาย', 'มี ลูก สาม คน'] } },
  f08: { phrases: [
    'ลุง อยู่ ที่ไหน|Where is your uncle?',
    'ป้า อยู่ บ้าน|My aunt is at home.',
    'ลุง กับ ป้า อยู่ ที่นี่|My uncle and aunt are here.',
    'เค้า เป็น แฟน|He\'s/she\'s my partner.',
    'น้า อยู่ บ้าน|My aunt/uncle is at home.',
  ], reply: { q: 'ลุง อยู่ ที่ไหน|Where is your uncle?', a: 'ลุง อยู่ บ้าน|My uncle is at home.', wrong: ['เค้า เป็น แฟน', 'ป้า'] } },
  f09: { phrases: [
    'คุณ แต่งงาน รึยัง|Are you married yet?',
    'แต่งงาน แล้ว|Yes, I\'m married.',
    'มี แฟน รึยัง|Do you have a partner yet?',
    'มี ลูก รึยัง|Do you have children yet?',
    'มี ลูก แล้ว|I already have children.',
  ], reply: { q: 'คุณ แต่งงาน รึยัง|Are you married yet?', a: 'แต่งงาน แล้ว|Yes, I\'m married.', wrong: ['มี แฟน รึยัง', 'ลุง'] } },
  f10: { phrases: [
    'ยัง ไม่ ได้ แต่งงาน|I\'m not married yet.',
    'ยัง โสด|I\'m still single.',
    'ไม่ มี แฟน|I don\'t have a partner.',
    'ยัง ไม่ มี ลูก|I don\'t have children yet.',
    'มี ลูก รึยัง|Do you have children yet?',
  ], reply: { q: 'มี แฟน รึยัง|Do you have a partner yet?', a: 'ยัง โสด|Not yet, I\'m still single.', wrong: ['แต่งงาน แล้ว', 'มี ลูก สาม คน'] } },
};

const familySubject = subject(
  'family',
  'Family',
  'khrɔ̂ɔp-khrua',
  'Real Thai family vocabulary and sentences from Essential Thai: parents, older/younger siblings, grandparents and relatives, marriage, and children — how to introduce and ask about family members.',
  rewriteLessons(lessons, REWRITES, romanTable([{ lessons }]))
);

module.exports = { familySubject };
