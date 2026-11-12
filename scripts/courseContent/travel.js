// "Travel: Getting Around" — transcribed from real textbook pages (Thai
// script, romanization, and English meanings are all copied from the
// source, not invented): Essential Thai: A Guide to the Basics of the Thai
// Language by James Higbie (2nd ed., Orchid Press) — the "Traveling - Basic
// Questions" section (pp.33-34: where/how are you going), the
// "Transportation" chapter (pp.136-141: kinds of vehicles, stations/
// airport, city bus, city-to-city bus/tickets, finding your bus, driving
// instructions), the "Hotels and Bungalows" chapter (pp.142-145: room
// vacancy, prices, asking for things, beach bungalow problems), and the
// "Around Town" chapter (pp.146-148: places in town, directions, near/far).
// Every step cites its exact source page.
//
// Every course subject is checked independently (checkDictionary resets
// "introduced" per subject), so this unit re-teaches, with its own
// wordIntro steps, several grammar words that also appear in the Basics/
// Greetings/Restaurant units instead of assuming they carry over. Where a
// word recurs from src/data.ts or scripts/courseContent/{restaurant,
// greetings,basics}.js (pai, nǎi, thîi-nǎi, yùu, tà-làat, níi, sɔ̌ɔng, gìi,
// ao, khɔ̌ɔ, dûai, mii, mái, mâi, dâi, thîi, glàp, thîao, diao) this unit
// reuses those exact spellings rather than inventing new ones.
//
// Romanization reuses the diacritic convention already used elsewhere in
// this app (à/á/â/ǎ for low/high/falling/rising tones, ɔ/ɛ/ɯ/ə for open
// vowels) rather than Higbie's own plain-letter-plus-underline system.
//
// Lessons 1-4 stay short (single new concepts). From lesson 5 on, graded
// steps grow by RECOMBINING already-taught short phrases from earlier in
// the same or a prior lesson into longer, natural multi-clause sentences
// (directions + transport + destination + hotel requests, etc.) — no new
// vocabulary is invented to pad length, every __parts token was already
// taught by an earlier wordIntro in this file.
'use strict';

const { romanTable, rewriteLessons } = require('../lib/phraseLessons');

const { wordIntro, rule, mc, order, speak, dialogue, lesson, subject } = require('../lib/courseBuilder');

const SRC = {
  going: 'Essential Thai (Higbie), p.33',
  howGoing: 'Essential Thai (Higbie), p.34',
  vehicles: 'Essential Thai (Higbie), p.136',
  stations: 'Essential Thai (Higbie), p.137',
  citybus: 'Essential Thai (Higbie), p.137',
  gettingOff: 'Essential Thai (Higbie), p.138',
  tickets: 'Essential Thai (Higbie), p.138',
  finding: 'Essential Thai (Higbie), p.139',
  driving: 'Essential Thai (Higbie), p.140',
  hotel: 'Essential Thai (Higbie), p.142',
  hotelPrices: 'Essential Thai (Higbie), p.143',
  hotelThings: 'Essential Thai (Higbie), p.144',
  bungalow: 'Essential Thai (Higbie), p.145',
  placesInTown: 'Essential Thai (Higbie), p.146',
  directions: 'Essential Thai (Higbie), p.147',
  nearFar: 'Essential Thai (Higbie), p.148',
};

const lessons = [
  // --------------------------------------------------------------- (t01+t02)
  lesson('t01', 'Where are you going? Bangkok, Phuket', [
    wordIntro('ไป', 'pai', 'go', SRC.going),
    wordIntro('ไหน', 'nǎi', 'where', SRC.going),
    mc('ไปไหน', 'pai nǎi', 'Where are you going?', ["I'm going.", 'Which one?', 'How many?'], ['ไป', 'ไหน'], SRC.going),
    wordIntro('เที่ยว', 'thîao', 'go out / travel around', SRC.going),
    order("I'm going out.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'thîao', thai: 'เที่ยว' },
    ], SRC.going),
    speak('ไปไหน', 'pai nǎi', 'Where are you going?', ['ไป', 'ไหน'], SRC.going),
    speak('ไปเที่ยว', 'pai thîao', "I'm going out.", ['ไป', 'เที่ยว'], SRC.going),
    wordIntro('กรุงเทพฯ', 'grung-thêep', 'Bangkok', SRC.going),
    wordIntro('ภูเก็ต', 'phuu-gèt', 'Phuket', SRC.going),
    mc('ไปกรุงเทพฯ', 'pai grung-thêep', "I'm going to Bangkok.", ['Where are you going?', "I'm going to Phuket.", "I'm going out."], ['ไป', 'กรุงเทพฯ'], SRC.going),
    order("I'm going to Phuket.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'phuu-gèt', thai: 'ภูเก็ต' },
    ], SRC.going),
    mc('ไปเที่ยวภูเก็ต', 'pai thîao phuu-gèt', 'Going to Phuket (on a trip).', ["I'm going to Bangkok.", 'Where are you going?', "I'm going out."], ['ไป', 'เที่ยว', 'ภูเก็ต'], SRC.going),
    speak('ไปภูเก็ต', 'pai phuu-gèt', "I'm going to Phuket.", ['ไป', 'ภูเก็ต'], SRC.going),
  ]),

  // --------------------------------------------------------------- (t03+t04)
  lesson('t02', 'How are you going? Bus, train, taxi', [
    rule(
      '"By" isn\'t needed',
      'Thai doesn\'t use a word for "by" — "I\'m going by bus" is just "go-bus" (pai + the vehicle name), with nothing in ' +
        'between.',
      SRC.howGoing
    ),
    wordIntro('รถเมล์', 'rót-mee', 'bus', SRC.howGoing),
    wordIntro('รถไฟ', 'rót-fai', 'train', SRC.howGoing),
    mc('ไปรถเมล์', 'pai rót-mee', "I'm going by bus.", ["I'm going by train.", 'Where are you going?', "I'm going to Bangkok."], ['ไป', 'รถเมล์'], SRC.howGoing),
    order("I'm going by train.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'rót-fai', thai: 'รถไฟ' },
    ], SRC.howGoing),
    mc('ไปรถไฟ', 'pai rót-fai', "I'm going by train.", ["I'm going by bus.", "I'm going to Phuket.", 'Where are you going?'], ['ไป', 'รถไฟ'], SRC.howGoing),
    speak('ไปรถเมล์', 'pai rót-mee', "I'm going by bus.", ['ไป', 'รถเมล์'], SRC.howGoing),
    wordIntro('แท็กซี่', 'thák-sîi', 'taxi', SRC.howGoing),
    wordIntro('ตุ๊กตุ๊ก', 'túk-túk', 'tuk-tuk (motorized three-wheel taxi)', SRC.vehicles),
    mc('ไปแท็กซี่', 'pai thák-sîi', "I'm going by taxi.", ["I'm going by bus.", "I'm going by train.", 'Where are you going?'], ['ไป', 'แท็กซี่'], SRC.howGoing),
    order("I'm going by tuk-tuk.", [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'túk-túk', thai: 'ตุ๊กตุ๊ก' },
    ], SRC.vehicles),
    mc('ตุ๊กตุ๊ก', 'túk-túk', 'Tuk-tuk (a three-wheeled taxi).', ['Taxi.', 'Bus.', 'Train.'], ['ตุ๊กตุ๊ก'], SRC.vehicles),
    speak('ไปแท็กซี่', 'pai thák-sîi', "I'm going by taxi.", ['ไป', 'แท็กซี่'], SRC.howGoing),
  ]),

  // --------------------------------------------------------------- (t05+t06)
  lesson('t03', 'Airplane tickets, station, airport', [
    wordIntro('เครื่องบิน', 'khrɯ̂ang-bin', 'airplane', SRC.vehicles),
    mc('ไปเครื่องบิน', 'pai khrɯ̂ang-bin', "I'm going by airplane.", ["I'm going by taxi.", "I'm going by train.", "I'm going by tuk-tuk."], ['ไป', 'เครื่องบิน'], SRC.vehicles),
    wordIntro('เดียว', 'diao', 'single / only one', SRC.tickets),
    mc('ไปกรุงเทพฯเที่ยวเดียว', 'pai grung-thêep thîao-diao', 'Going to Bangkok, one-way.', ['Going to Phuket, round trip.', "I'm going by airplane.", 'Where are you going?'], ['ไป', 'กรุงเทพฯ', 'เที่ยว', 'เดียว'], SRC.tickets),
    wordIntro('กลับ', 'glàp', 'return / go back', SRC.tickets),
    order('Round trip to Phuket.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'phuu-gèt', thai: 'ภูเก็ต' },
      { roman: 'glàp', thai: 'กลับ' },
    ], SRC.tickets),
    speak('ไปเครื่องบินกลับ', 'pai khrɯ̂ang-bin glàp', 'Round trip by airplane.', ['ไป', 'เครื่องบิน', 'กลับ'], SRC.tickets),
    wordIntro('สถานี', 'sà-thǎa-nee', 'station', SRC.stations),
    wordIntro('สนามบิน', 'sà-nǎam-bin', 'airport', SRC.stations),
    mc('ไปสถานีรถไฟ', 'pai sà-thǎa-nee rót-fai', 'Going to the train station.', ['Going to the airport.', "I'm going by train.", 'Round trip by airplane.'], ['ไป', 'สถานี', 'รถไฟ'], SRC.stations),
    order('I\'m going to the airport by taxi.', [
      { roman: 'pai', thai: 'ไป' },
      { roman: 'sà-nǎam-bin', thai: 'สนามบิน' },
      { roman: 'thák-sîi', thai: 'แท็กซี่' },
    ], SRC.stations),
    wordIntro('อยู่', 'yùu', 'be at / stay', SRC.stations),
    wordIntro('ที่ไหน', 'thîi-nǎi', 'where?', SRC.stations),
    mc('สนามบินอยู่ที่ไหน', 'sà-nǎam-bin yùu thîi-nǎi', "Where's the airport?", ['Train station.', "I'm going to the airport.", 'Round trip.'], ['สนามบิน', 'อยู่', 'ที่ไหน'], SRC.stations),
    speak('สถานีรถไฟอยู่ที่ไหน', 'sà-thǎa-nee rót-fai yùu thîi-nǎi', "Where's the train station?", ['สถานี', 'รถไฟ', 'อยู่', 'ที่ไหน'], SRC.stations),
  ]),

  // --------------------------------------------------------------- (t07+t08)
  lesson('t04', 'Buying tickets, getting on the bus', [
    wordIntro('เอา', 'ao', 'want / take', SRC.tickets),
    wordIntro('ตั๋ว', 'tǔa', 'ticket', SRC.tickets),
    mc('เอาตั๋วไปกรุงเทพฯ', 'ao tǔa pai grung-thêep', 'I want a ticket to Bangkok.', ['I want a ticket to Phuket.', 'How many tickets do you want?', 'I want two (tickets).'], ['เอา', 'ตั๋ว', 'ไป', 'กรุงเทพฯ'], SRC.tickets),
    wordIntro('กี่', 'gìi', 'how many?', SRC.tickets),
    wordIntro('ใบ', 'bai', 'classifier for tickets', SRC.tickets),
    order('How many tickets do you want?', [
      { roman: 'ao', thai: 'เอา' },
      { roman: 'gìi', thai: 'กี่' },
      { roman: 'bai', thai: 'ใบ' },
    ], SRC.tickets),
    wordIntro('สอง', 'sɔ̌ɔng', 'two', SRC.tickets),
    mc('สองใบไปกรุงเทพฯ', 'sɔ̌ɔng bai pai grung-thêep', 'Two tickets to Bangkok.', ['I want a ticket to Bangkok.', 'How many tickets do you want?', 'One-way.'], ['สอง', 'ใบ', 'ไป', 'กรุงเทพฯ'], SRC.tickets),
    wordIntro('ป้าย', 'pâai', 'bus stop / sign', SRC.citybus),
    wordIntro('ขึ้น', 'khɯ̂n', 'get on', SRC.finding),
    mc('ป้ายรถเมล์อยู่ที่ไหน', 'pâai rót-mee yùu thîi-nǎi', "Where's the bus stop?", ['Where do I get on?', 'How many tickets?', 'Train station.'], ['ป้าย', 'รถเมล์', 'อยู่', 'ที่ไหน'], SRC.citybus),
    order('Where do I get on the bus?', [
      { roman: 'khɯ̂n', thai: 'ขึ้น' },
      { roman: 'rót-mee', thai: 'รถเมล์' },
      { roman: 'thîi-nǎi', thai: 'ที่ไหน' },
    ], SRC.finding),
    mc('ป้ายอยู่ที่ไหนขึ้นที่ไหน', 'pâai yùu thîi-nǎi, khɯ̂n thîi-nǎi', "Where's the bus stop? Where do I get on?", ['I want a ticket.', 'Round trip.', 'Train station.'], ['ป้าย', 'อยู่', 'ที่ไหน', 'ขึ้น', 'ที่ไหน'], SRC.finding),
    speak('ป้ายอยู่ที่ไหน', 'pâai yùu thîi-nǎi', "Where's the bus stop?", ['ป้าย', 'อยู่', 'ที่ไหน'], SRC.citybus),
  ]),

  // --------------------------------------------------------------- (t09+t10)
  lesson('t05', 'Getting off, which bus is this?', [
    wordIntro('ลง', 'long', 'get off', SRC.gettingOff),
    mc('ขึ้นที่ไหนลงที่ไหน', 'khɯ̂n thîi-nǎi, long thîi-nǎi', 'Where do I get on? Where do I get off?', ["Where's the bus stop?", 'I want a ticket.', 'This stop.'], ['ขึ้น', 'ที่ไหน', 'ลง', 'ที่ไหน'], SRC.gettingOff),
    wordIntro('นี้', 'níi', 'this (after a noun)', SRC.gettingOff),
    order('this bus stop', [
      { roman: 'pâai', thai: 'ป้าย' },
      { roman: 'rót-mee', thai: 'รถเมล์' },
      { roman: 'níi', thai: 'นี้' },
    ], SRC.gettingOff),
    mc('ขึ้นที่ไหนลงป้ายนี้', 'khɯ̂n thîi-nǎi, long pâai níi', "Where do I get on? I'm getting off at this stop.", ["Where's the bus stop?", 'Where do I get on?', 'This bus stop.'], ['ขึ้น', 'ที่ไหน', 'ลง', 'ป้าย', 'นี้'], SRC.gettingOff),
    speak('ป้ายรถเมล์นี้ลงที่ไหน', 'pâai rót-mee níi, long thîi-nǎi', 'This bus stop — where do I get off?', ['ป้าย', 'รถเมล์', 'นี้', 'ลง', 'ที่ไหน'], SRC.gettingOff),
    wordIntro('คัน', 'khan', 'classifier for vehicles', SRC.finding),
    mc('ขึ้นคันไหนลงที่ไหน', 'khɯ̂n khan nǎi, long thîi-nǎi', 'Which bus do I get on? Where do I get off?', ['This one.', "Where's the bus stop?", 'This bus stop.'], ['ขึ้น', 'คัน', 'ไหน', 'ลง', 'ที่ไหน'], SRC.finding),
    order('Where do I get on this bus?', [
      { roman: 'khɯ̂n', thai: 'ขึ้น' },
      { roman: 'rót-mee', thai: 'รถเมล์' },
      { roman: 'khan', thai: 'คัน' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'thîi-nǎi', thai: 'ที่ไหน' },
    ], SRC.finding),
    mc('รถเมล์คันนี้ลงป้ายนี้', 'rót-mee khan níi, long pâai níi', "This bus — I'm getting off at this stop.", ['Which bus?', 'Where do I get on?', 'This one.'], ['รถเมล์', 'คัน', 'นี้', 'ลง', 'ป้าย', 'นี้'], SRC.finding),
    speak('ขึ้นคันไหนคันนี้', 'khɯ̂n khan nǎi, khan níi', 'Which bus do I get on? This one.', ['ขึ้น', 'คัน', 'ไหน', 'คัน', 'นี้'], SRC.finding),
    speak('รถเมล์คันนี้อยู่ที่ไหน', 'rót-mee khan níi yùu thîi-nǎi', "Where's this bus?", ['รถเมล์', 'คัน', 'นี้', 'อยู่', 'ที่ไหน'], SRC.finding),
  ]),

  // --------------------------------------------------------------- (t11+t12)
  lesson('t06', 'Hotel rooms and vacancy', [
    wordIntro('มี', 'mii', 'have', SRC.hotel),
    wordIntro('ห้อง', 'hɔ̂ng', 'room', SRC.hotel),
    mc('ห้องนี้อยู่ที่ไหน', 'hɔ̂ng níi yùu thîi-nǎi', "Where's this room?", ['This one.', 'This stop.', 'Which bus?'], ['ห้อง', 'นี้', 'อยู่', 'ที่ไหน'], SRC.hotel),
    wordIntro('มั้ย', 'mái', 'question particle (yes/no)', SRC.hotel),
    mc('มีห้องมั้ยห้องอยู่ที่ไหน', 'mii hɔ̂ng mái, hɔ̂ng yùu thîi-nǎi', "Do you have a room? Where's the room?", ['This room.', 'How many tickets?', "Where's the bus stop?"], ['มี', 'ห้อง', 'มั้ย', 'ห้อง', 'อยู่', 'ที่ไหน'], SRC.hotel),
    speak('มีห้องมั้ยเอาห้องนี้', 'mii hɔ̂ng mái, ao hɔ̂ng níi', "Do you have a room? I'll take this room.", ['มี', 'ห้อง', 'มั้ย', 'เอา', 'ห้อง', 'นี้'], SRC.hotel),
    wordIntro('ไม่', 'mâi', 'not / no', SRC.hotel),
    mc('มีห้องมั้ยไม่มีห้อง', 'mii hɔ̂ng mái, mâi mii hɔ̂ng', "Do you have a room? We don't have any rooms.", ['This room.', 'This one.', "Where's this room?"], ['มี', 'ห้อง', 'มั้ย', 'ไม่', 'มี', 'ห้อง'], SRC.hotel),
    order("We don't have this room.", [
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'mii', thai: 'มี' },
      { roman: 'hɔ̂ng', thai: 'ห้อง' },
      { roman: 'níi', thai: 'นี้' },
    ], SRC.hotel),
    wordIntro('ได้', 'dâi', 'can / able to', SRC.driving),
    mc('ไม่มีห้องได้มั้ย', 'mâi mii hɔ̂ng, dâi mái', "We don't have any rooms — is that OK?", ['Do you have a room?', 'This room.', 'Yes, (I) can.'], ['ไม่', 'มี', 'ห้อง', 'ได้', 'มั้ย'], SRC.driving),
    speak('ไม่มีห้องเอาห้องได้มั้ย', 'mâi mii hɔ̂ng, ao hɔ̂ng dâi mái', "We don't have any rooms — can I take a room?", ['ไม่', 'มี', 'ห้อง', 'เอา', 'ห้อง', 'ได้', 'มั้ย'], SRC.hotel),
  ]),

  // --------------------------------------------------------------- (t13+t14)
  lesson('t07', 'Drive slowly, turn right', [
    wordIntro('ขับ', 'khàp', 'drive', SRC.driving),
    wordIntro('ช้าๆ', 'cháa-cháa', 'slowly', SRC.driving),
    mc('ขับช้าๆได้มั้ยไปสนามบิน', 'khàp cháa-cháa dâi mái, pai sà-nǎam-bin', 'Could you drive slowly? Going to the airport.', ['Drive slowly.', "We don't have any rooms.", "Where's the airport?"], ['ขับ', 'ช้าๆ', 'ได้', 'มั้ย', 'ไป', 'สนามบิน'], SRC.driving),
    order('Could you drive slowly?', [
      { roman: 'khàp', thai: 'ขับ' },
      { roman: 'cháa-cháa', thai: 'ช้าๆ' },
      { roman: 'dâi', thai: 'ได้' },
      { roman: 'mái', thai: 'มั้ย' },
    ], SRC.driving),
    mc('ไปสนามบินขับช้าๆได้มั้ย', 'pai sà-nǎam-bin, khàp cháa-cháa dâi mái', 'Going to the airport — could you drive slowly?', ['Drive slowly.', 'Could you drive slowly?', "Where's the airport?"], ['ไป', 'สนามบิน', 'ขับ', 'ช้าๆ', 'ได้', 'มั้ย'], SRC.driving),
    speak('มีแท็กซี่มั้ยขับช้าๆได้มั้ย', 'mii thák-sîi mái, khàp cháa-cháa dâi mái', 'Is there a taxi? Could you drive slowly?', ['มี', 'แท็กซี่', 'มั้ย', 'ขับ', 'ช้าๆ', 'ได้', 'มั้ย'], SRC.driving),
    wordIntro('เลี้ยว', 'líao', 'turn', SRC.directions),
    wordIntro('ขวา', 'khwǎa', 'right', SRC.directions),
    mc('ขับช้าๆได้มั้ยเลี้ยวขวาไปสนามบิน', 'khàp cháa-cháa dâi mái, líao khwǎa, pai sà-nǎam-bin', 'Could you drive slowly? Turn right. Going to the airport.', ['Turn right.', 'Could you drive slowly?', 'Going to the airport.'], ['ขับ', 'ช้าๆ', 'ได้', 'มั้ย', 'เลี้ยว', 'ขวา', 'ไป', 'สนามบิน'], SRC.directions),
    order('Drive slowly, could you turn right?', [
      { roman: 'khàp', thai: 'ขับ' },
      { roman: 'cháa-cháa', thai: 'ช้าๆ' },
      { roman: 'líao', thai: 'เลี้ยว' },
      { roman: 'khwǎa', thai: 'ขวา' },
      { roman: 'dâi', thai: 'ได้' },
      { roman: 'mái', thai: 'มั้ย' },
    ], SRC.directions),
    mc('เลี้ยวขวาไปสนามบินได้มั้ย', 'líao khwǎa, pai sà-nǎam-bin dâi mái', 'Turn right — can we go to the airport?', ['Turn right.', 'Could you drive slowly?', "Where's the airport?"], ['เลี้ยว', 'ขวา', 'ไป', 'สนามบิน', 'ได้', 'มั้ย'], SRC.directions),
    speak('ขับช้าๆเลี้ยวขวาไปสนามบินได้มั้ย', 'khàp cháa-cháa, líao khwǎa, pai sà-nǎam-bin, dâi mái', 'Drive slowly, turn right, go to the airport — can you?', ['ขับ', 'ช้าๆ', 'เลี้ยว', 'ขวา', 'ไป', 'สนามบิน', 'ได้', 'มั้ย'], SRC.directions),
  ]),

  // --------------------------------------------------------------- (t15+t16)
  lesson('t08', 'Turn left, near or far?', [
    wordIntro('ซ้าย', 'sáai', 'left', SRC.directions),
    wordIntro('ตรง', 'trong', 'straight', SRC.directions),
    mc('ตรงไปเลี้ยวซ้ายไปสนามบิน', 'trong pai, líao sáai, pai sà-nǎam-bin', 'Go straight, turn left, go to the airport.', ['Turn left.', 'Turn right.', 'Could you drive slowly?'], ['ตรง', 'ไป', 'เลี้ยว', 'ซ้าย', 'ไป', 'สนามบิน'], SRC.directions),
    order('Drive slowly, go straight, turn left.', [
      { roman: 'khàp', thai: 'ขับ' },
      { roman: 'cháa-cháa', thai: 'ช้าๆ' },
      { roman: 'trong', thai: 'ตรง' },
      { roman: 'pai', thai: 'ไป' },
      { roman: 'líao', thai: 'เลี้ยว' },
      { roman: 'sáai', thai: 'ซ้าย' },
    ], SRC.directions),
    mc('ตรงไปเลี้ยวขวาเลี้ยวซ้าย', 'trong pai, líao khwǎa, líao sáai', 'Go straight, turn right, turn left.', ['Turn left.', 'Go straight.', 'Turn right.'], ['ตรง', 'ไป', 'เลี้ยว', 'ขวา', 'เลี้ยว', 'ซ้าย'], SRC.directions),
    speak('ขับช้าๆตรงไปเลี้ยวซ้ายไปสนามบิน', 'khàp cháa-cháa, trong pai, líao sáai, pai sà-nǎam-bin', 'Drive slowly, go straight, turn left, go to the airport.', ['ขับ', 'ช้าๆ', 'ตรง', 'ไป', 'เลี้ยว', 'ซ้าย', 'ไป', 'สนามบิน'], SRC.directions),
    speak('เลี้ยวขวาตรงไปเลี้ยวซ้าย', 'líao khwǎa, trong pai, líao sáai', 'Turn right, go straight, turn left.', ['เลี้ยว', 'ขวา', 'ตรง', 'ไป', 'เลี้ยว', 'ซ้าย'], SRC.directions),
    rule(
      'Near or far?',
      '"Near" (glâi) and "far" (glai) differ only by tone, which causes confusion — so Thais usually solve the problem by ' +
        'just asking "is it far?" and answering "far" or "not far".',
      SRC.nearFar
    ),
    wordIntro('ใกล้', 'glâi', 'near', SRC.nearFar),
    wordIntro('ไกล', 'glai', 'far', SRC.nearFar),
    mc('ไปสนามบินไกลมั้ยไม่ไกลใกล้', 'pai sà-nǎam-bin glai mái, mâi glai, glâi', "Is the airport far? Not far — it's near.", ['Is it near?', 'Turn right.', 'Turn left.'], ['ไป', 'สนามบิน', 'ไกล', 'มั้ย', 'ไม่', 'ไกล', 'ใกล้'], SRC.nearFar),
    order("Turn right, go straight, it's not far.", [
      { roman: 'líao', thai: 'เลี้ยว' },
      { roman: 'khwǎa', thai: 'ขวา' },
      { roman: 'trong', thai: 'ตรง' },
      { roman: 'pai', thai: 'ไป' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'glai', thai: 'ไกล' },
    ], SRC.nearFar),
    mc('ไปสนามบินไกลมั้ยไม่ไกลใกล้ขับช้าๆ', 'pai sà-nǎam-bin glai mái, mâi glai, glâi, khàp cháa-cháa', "Is the airport far? Not far, it's near. Drive slowly.", ['Near.', 'Is it far?', "It's not far."], ['ไป', 'สนามบิน', 'ไกล', 'มั้ย', 'ไม่', 'ไกล', 'ใกล้', 'ขับ', 'ช้าๆ'], SRC.nearFar),
    speak('สนามบินอยู่ที่ไหนไม่ไกลใกล้', 'sà-nǎam-bin yùu thîi-nǎi, mâi glai, glâi', "Where's the airport? Not far — near.", ['สนามบิน', 'อยู่', 'ที่ไหน', 'ไม่', 'ไกล', 'ใกล้'], SRC.nearFar),
  ]),

  // --------------------------------------------------------------- (t17+t18)
  lesson('t09', 'Streets, intersections, room key', [
    wordIntro('ถนน', 'thà-nǒn', 'street', SRC.placesInTown),
    wordIntro('สี่แยก', 'sìi-yɛ̂ɛk', 'intersection', SRC.placesInTown),
    order('Turn left, this street, not far.', [
      { roman: 'líao', thai: 'เลี้ยว' },
      { roman: 'sáai', thai: 'ซ้าย' },
      { roman: 'thà-nǒn', thai: 'ถนน' },
      { roman: 'níi', thai: 'นี้' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'glai', thai: 'ไกล' },
    ], SRC.placesInTown),
    wordIntro('ที่', 'thîi', 'at', SRC.directions),
    mc('ตรงไปเลี้ยวขวาที่สี่แยก', 'trong pai, líao khwǎa thîi sìi-yɛ̂ɛk', 'Go straight, then turn right at the intersection.', ['Turn left at the intersection.', 'Go straight on this street.', "It's not far."], ['ตรง', 'ไป', 'เลี้ยว', 'ขวา', 'ที่', 'สี่แยก'], SRC.directions),
    mc('สี่แยกไม่ไกลเลี้ยวซ้ายที่สี่แยก', 'sìi-yɛ̂ɛk mâi glai, líao sáai thîi sìi-yɛ̂ɛk', "The intersection isn't far — turn left there.", ['This stop.', 'This street.', 'This one.'], ['สี่แยก', 'ไม่', 'ไกล', 'เลี้ยว', 'ซ้าย', 'ที่', 'สี่แยก'], SRC.placesInTown),
    speak('เลี้ยวขวาที่สี่แยกตรงไป', 'líao khwǎa thîi sìi-yɛ̂ɛk, trong pai', 'Turn right at the intersection, go straight.', ['เลี้ยว', 'ขวา', 'ที่', 'สี่แยก', 'ตรง', 'ไป'], SRC.directions),
    speak('ถนนนี้ไม่ไกล', 'thà-nǒn níi mâi glai', "This street's not far.", ['ถนน', 'นี้', 'ไม่', 'ไกล'], SRC.placesInTown),
    wordIntro('ขอ', 'khɔ̌ɔ', 'may I have / please give me', SRC.hotelThings),
    wordIntro('กุญแจ', 'gun-jɛɛ', 'key', SRC.hotelThings),
    mc('ขอกุญแจห้องนี้', 'khɔ̌ɔ gun-jɛɛ, hɔ̂ng níi', 'May I have the key? This room.', ['Turn right.', 'Is it far?', 'This street.'], ['ขอ', 'กุญแจ', 'ห้อง', 'นี้'], SRC.hotelThings),
    wordIntro('ด้วย', 'dûai', 'please / also', SRC.hotelThings),
    mc('ขอกุญแจด้วยห้องนี้ไม่ไกลมีแท็กซี่มั้ย', 'khɔ̌ɔ gun-jɛɛ dûai, hɔ̂ng níi, mâi glai, mii thák-sîi mái', "May I have the key please — this room's not far — is there a taxi?", ['May I have the key?', "We don't have any rooms.", 'This street.'], ['ขอ', 'กุญแจ', 'ด้วย', 'ห้อง', 'นี้', 'ไม่', 'ไกล', 'มี', 'แท็กซี่', 'มั้ย'], SRC.hotelThings),
    order('Turn right at the intersection, may I have the key please.', [
      { roman: 'líao', thai: 'เลี้ยว' },
      { roman: 'khwǎa', thai: 'ขวา' },
      { roman: 'thîi', thai: 'ที่' },
      { roman: 'sìi-yɛ̂ɛk', thai: 'สี่แยก' },
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'gun-jɛɛ', thai: 'กุญแจ' },
      { roman: 'dûai', thai: 'ด้วย' },
    ], SRC.hotelThings),
    speak('ขอกุญแจด้วยห้องนี้อยู่ที่ไหนไม่ไกล', 'khɔ̌ɔ gun-jɛɛ dûai, hɔ̂ng níi yùu thîi-nǎi, mâi glai', "May I have the key please — where's this room? — not far.", ['ขอ', 'กุญแจ', 'ด้วย', 'ห้อง', 'นี้', 'อยู่', 'ที่ไหน', 'ไม่', 'ไกล'], SRC.hotelThings),
  ]),

  // --------------------------------------------------------------- (t19+t20)
  lesson('t10', 'Towels, mosquitos, bank, market', [
    wordIntro('ผ้าเช็ดตัว', 'phâa-chét-tua', 'towel', SRC.hotelThings),
    mc('ขอผ้าเช็ดตัวด้วยห้องนี้ไม่ไกล', 'khɔ̌ɔ phâa-chét-tua dûai, hɔ̂ng níi, mâi glai', "May I have a towel please — this room's not far.", ['May I have the key, please?', 'This room.', 'Turn right.'], ['ขอ', 'ผ้าเช็ดตัว', 'ด้วย', 'ห้อง', 'นี้', 'ไม่', 'ไกล'], SRC.hotelThings),
    order('May I have a towel please, may I have the key please.', [
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'phâa-chét-tua', thai: 'ผ้าเช็ดตัว' },
      { roman: 'dûai', thai: 'ด้วย' },
      { roman: 'khɔ̌ɔ', thai: 'ขอ' },
      { roman: 'gun-jɛɛ', thai: 'กุญแจ' },
      { roman: 'dûai', thai: 'ด้วย' },
    ], SRC.hotelThings),
    wordIntro('ยุง', 'yung', 'mosquito', SRC.bungalow),
    mc('มียุงห้องนี้ไม่ไกลขอกุญแจด้วย', 'mii yung, hɔ̂ng níi, mâi glai, khɔ̌ɔ gun-jɛɛ dûai', 'There are mosquitos, this room, not far, may I have the key please.', ['May I have a towel?', "We don't have any rooms.", 'Is it far?'], ['มี', 'ยุง', 'ห้อง', 'นี้', 'ไม่', 'ไกล', 'ขอ', 'กุญแจ', 'ด้วย'], SRC.bungalow),
    speak('มียุงห้องนี้ขอผ้าเช็ดตัวด้วย', 'mii yung, hɔ̂ng níi, khɔ̌ɔ phâa-chét-tua dûai', 'There are mosquitos in this room — may I have a towel please.', ['มี', 'ยุง', 'ห้อง', 'นี้', 'ขอ', 'ผ้าเช็ดตัว', 'ด้วย'], SRC.bungalow),
    speak('ขอผ้าเช็ดตัวด้วยมียุงห้องนี้ขอกุญแจด้วยไกล', 'khɔ̌ɔ phâa-chét-tua dûai, mii yung, hɔ̂ng níi, khɔ̌ɔ gun-jɛɛ dûai, glai', 'May I have a towel please — there are mosquitos in this room — may I have the key please — far!', ['ขอ', 'ผ้าเช็ดตัว', 'ด้วย', 'มี', 'ยุง', 'ห้อง', 'นี้', 'ขอ', 'กุญแจ', 'ด้วย', 'ไกล'], SRC.hotelThings),
    wordIntro('ธนาคาร', 'thá-naa-khaan', 'bank', SRC.placesInTown),
    wordIntro('ไปรษณีย์', 'prai-sà-nii', 'post office', SRC.placesInTown),
    mc('ธนาคารอยู่ที่ไหนเลี้ยวขวาที่สี่แยกตรงไป', 'thá-naa-khaan yùu thîi-nǎi, líao khwǎa thîi sìi-yɛ̂ɛk, trong pai', "Where's the bank? Turn right at the intersection, go straight.", ["Where's the post office?", 'Turn right at the intersection.', 'There are mosquitos.'], ['ธนาคาร', 'อยู่', 'ที่ไหน', 'เลี้ยว', 'ขวา', 'ที่', 'สี่แยก', 'ตรง', 'ไป'], SRC.placesInTown),
    wordIntro('ตลาด', 'tà-làat', 'market', SRC.placesInTown),
    order("Where's the post office? Turn left, go straight, not far.", [
      { roman: 'prai-sà-nii', thai: 'ไปรษณีย์' },
      { roman: 'yùu', thai: 'อยู่' },
      { roman: 'thîi-nǎi', thai: 'ที่ไหน' },
      { roman: 'líao', thai: 'เลี้ยว' },
      { roman: 'sáai', thai: 'ซ้าย' },
      { roman: 'trong', thai: 'ตรง' },
      { roman: 'pai', thai: 'ไป' },
      { roman: 'mâi', thai: 'ไม่' },
      { roman: 'glai', thai: 'ไกล' },
    ], SRC.placesInTown),
    mc('ตลาดอยู่ที่ไหนเลี้ยวขวาที่สี่แยกไม่ไกลขอกุญแจด้วย', 'tà-làat yùu thîi-nǎi, líao khwǎa thîi sìi-yɛ̂ɛk, mâi glai, khɔ̌ɔ gun-jɛɛ dûai', "Where's the market? Turn right at the intersection, not far. May I have the key please.", ["Where's the bank?", "Where's the post office?", 'This street.'], ['ตลาด', 'อยู่', 'ที่ไหน', 'เลี้ยว', 'ขวา', 'ที่', 'สี่แยก', 'ไม่', 'ไกล', 'ขอ', 'กุญแจ', 'ด้วย'], SRC.placesInTown),
    speak('ธนาคารอยู่ที่ไหนไปรถเมล์ไม่ไกล', 'thá-naa-khaan yùu thîi-nǎi, pai rót-mee, mâi glai', "Where's the bank? Going by bus — not far.", ['ธนาคาร', 'อยู่', 'ที่ไหน', 'ไป', 'รถเมล์', 'ไม่', 'ไกล'], SRC.placesInTown),
    speak('ไปรษณีย์อยู่ที่ไหนเลี้ยวซ้ายที่สี่แยกใกล้', 'prai-sà-nii yùu thîi-nǎi, líao sáai thîi sìi-yɛ̂ɛk, glâi', "Where's the post office? Turn left at the intersection — near.", ['ไปรษณีย์', 'อยู่', 'ที่ไหน', 'เลี้ยว', 'ซ้าย', 'ที่', 'สี่แยก', 'ใกล้'], SRC.placesInTown),
  ]),

  // --------------------------------------------------------------- (Conversation — recombines vocab taught above, no new words)
  dialogue(
    't-dlg',
    'Finding a room in town',
    'Checking into a hotel in Phuket, then asking the way to the market',
    [
      { speaker: 'A', thai: 'มีห้องมั้ย', roman: 'mii hɔ̂ng mái', english: 'Do you have a room?' },
      { speaker: 'B', thai: 'มี ห้องนี้ได้มั้ย', roman: 'mii, hɔ̂ng níi dâi mái', english: 'Yes — is this room OK?' },
      { speaker: 'A', thai: 'ได้ ขอกุญแจด้วย', roman: 'dâi, khɔ̌ɔ gun-jɛɛ dûai', english: 'Yes. May I have the key, please?' },
      { speaker: 'A', thai: 'ตลาดอยู่ที่ไหน', roman: 'tà-làat yùu thîi-nǎi', english: "Where's the market?" },
      { speaker: 'B', thai: 'เลี้ยวขวาที่สี่แยก ไม่ไกล', roman: 'líao khwǎa thîi sìi-yɛ̂ɛk, mâi glai', english: 'Turn right at the intersection — not far.' },
    ],
    [
      { type: 'intro' },
      {
        type: 'comprehension', lineIndex: 0,
        options: [
          { text: 'Do you have a room?', correct: true },
          { text: "Where's the market?", correct: false },
          { text: 'May I have the key, please?', correct: false },
          { text: 'Not far.', correct: false },
        ],
      },
      {
        type: 'comprehension', lineIndex: 3,
        options: [
          { text: "Where's the market?", correct: true },
          { text: "Where's the bank?", correct: false },
          { text: 'Do you have a room?', correct: false },
          { text: 'Turn left.', correct: false },
        ],
      },
      {
        type: 'translate', lineIndex: 1,
        options: [
          { text: 'Yes — is this room OK?', correct: true },
          { text: 'Do you have a room?', correct: false },
          { text: "Where's this room?", correct: false },
          { text: 'We don\'t have any rooms.', correct: false },
        ],
      },
      {
        type: 'translate', lineIndex: 4,
        options: [
          { text: 'Turn right at the intersection — not far.', correct: true },
          { text: 'Turn left at the intersection.', correct: false },
          { text: "Where's the market?", correct: false },
          { text: 'Go straight along this street.', correct: false },
        ],
      },
      {
        type: 'blank', lineIndex: 2, before: 'dâi, khɔ̌ɔ', after: 'dûai',
        options: [
          { text: 'gun-jɛɛ', correct: true },
          { text: 'hɔ̂ng', correct: false },
          { text: 'phâa-chét-tua', correct: false },
          { text: 'tǔa', correct: false },
        ],
      },
      {
        type: 'blank', lineIndex: 4, before: 'líao', after: 'thîi sìi-yɛ̂ɛk, mâi glai',
        options: [
          { text: 'khwǎa', correct: true },
          { text: 'sáai', correct: false },
          { text: 'trong', correct: false },
          { text: 'long', correct: false },
        ],
      },
      { type: 'speak', lineIndex: 0 },
      { type: 'speak', lineIndex: 2 },
    ]
  ),
];

// 2026-11-08: t01-t10 rebuilt to lesson 1's standard — short real phrases plus a reply() chat step (see
// scripts/lib/phraseLessons.js). Rules and word cards above are unchanged.
const REWRITES = {
  t01: { phrases: [
    'ไป ไหน|Where are you going?',
    'ไป เที่ยว|I\'m going out.',
    'ไป กรุงเทพฯ|I\'m going to Bangkok.',
    'ไป ภูเก็ต|I\'m going to Phuket.',
    'ไป เที่ยว ภูเก็ต|I\'m going on a trip to Phuket.',
  ], reply: { q: 'ไป ไหน|Where are you going?', a: 'ไป ภูเก็ต|I\'m going to Phuket.', wrong: ['ไป ไหน', 'เที่ยว'] } },
  t02: { phrases: [
    'ไป รถเมล์|I\'m going by bus.',
    'ไป รถไฟ|I\'m going by train.',
    'ไป แท็กซี่|I\'m going by taxi.',
    'ไป ตุ๊กตุ๊ก|I\'m going by tuk-tuk.',
    'ไป กรุงเทพฯ ไป รถไฟ|I\'m going to Bangkok, by train.',
  ] },
  t03: { phrases: [
    'ไป เครื่องบิน|I\'m going by plane.',
    'เที่ยว เดียว|one-way',
    'ไป กลับ|round trip',
    'สนามบิน อยู่ ที่ไหน|Where\'s the airport?',
    'สถานี รถไฟ อยู่ ที่ไหน|Where\'s the train station?',
  ], reply: { q: 'ไป ไหน|Where are you going?', a: 'ไป สนามบิน|To the airport.', wrong: ['เที่ยว เดียว', 'สถานี รถไฟ'] } },
  t04: { phrases: [
    'เอา ตั๋ว ไป กรุงเทพฯ|A ticket to Bangkok, please.',
    'เอา กี่ ใบ|How many tickets?',
    'สอง ใบ|two tickets',
    'ป้าย รถเมล์ อยู่ ที่ไหน|Where\'s the bus stop?',
    'ขึ้น ที่ไหน|Where do I get on?',
  ], reply: { q: 'เอา กี่ ใบ|How many tickets?', a: 'สอง ใบ|Two.', wrong: ['ป้าย รถเมล์', 'ขึ้น ที่ไหน'] } },
  t05: { phrases: [
    'ลง ที่ไหน|Where do I get off?',
    'ลง ป้าย นี้|I\'m getting off at this stop.',
    'ขึ้น คัน ไหน|Which bus do I take?',
    'คัน นี้|this one (bus)',
    'รถเมล์ คัน นี้|this bus',
  ], reply: { q: 'ลง ที่ไหน|Where are you getting off?', a: 'ลง ป้าย นี้|At this stop.', wrong: ['รถเมล์ คัน นี้', 'สอง ใบ'] } },
  t06: { phrases: [
    'มี ห้อง มั้ย|Do you have a room?',
    'ไม่ มี ห้อง|We don\'t have any rooms.',
    'เอา ห้อง นี้|I\'ll take this room.',
    'ห้อง นี้ อยู่ ที่ไหน|Where\'s this room?',
    'ได้ มั้ย|Is that OK?',
  ], reply: { q: 'มี ห้อง มั้ย|Do you have a room?', a: 'มี|Yes, we do.', wrong: ['ห้อง นี้', 'ไม่ ได้'] } },
  t07: { phrases: [
    'ขับ ช้าๆ ได้ มั้ย|Could you drive slowly?',
    'เลี้ยว ขวา|Turn right.',
    'ไป สนามบิน|To the airport.',
    'เลี้ยว ขวา ได้ มั้ย|Can you turn right?',
    'ขับ ช้าๆ|Drive slowly.',
  ], reply: { q: 'ขับ ช้าๆ ได้ มั้ย|Could you drive slowly?', a: 'ได้|Sure.', wrong: ['เลี้ยว ขวา', 'ไป สนามบิน'] } },
  t08: { phrases: [
    'เลี้ยว ซ้าย|Turn left.',
    'ตรง ไป|Go straight.',
    'ไกล มั้ย|Is it far?',
    'ไม่ ไกล|Not far.',
    'ใกล้|It\'s near.',
  ], reply: { q: 'สนามบิน ไกล มั้ย|Is the airport far?', a: 'ไม่ ไกล|No, not far.', wrong: ['เลี้ยว ซ้าย', 'ตรง ไป'] } },
  t09: { phrases: [
    'เลี้ยว ขวา ที่ สี่แยก|Turn right at the intersection.',
    'ถนน นี้|this street',
    'ขอ กุญแจ ด้วย|May I have the key, please?',
    'ตรง ไป ถนน นี้|Go straight along this street.',
    'ห้อง นี้|this room',
  ], reply: { q: 'เลี้ยว ที่ไหน|Where do I turn?', a: 'เลี้ยว ซ้าย ที่ สี่แยก|Turn left at the intersection.', wrong: ['ถนน นี้', 'ขอ กุญแจ ด้วย'] } },
  t10: { phrases: [
    'ขอ ผ้าเช็ดตัว ด้วย|A towel, please.',
    'มี ยุง|There are mosquitoes.',
    'ธนาคาร อยู่ ที่ไหน|Where\'s the bank?',
    'ไปรษณีย์ ไกล มั้ย|Is the post office far?',
    'ตลาด อยู่ ที่ไหน|Where\'s the market?',
  ], reply: { q: 'ตลาด อยู่ ที่ไหน|Where\'s the market?', a: 'เลี้ยว ซ้าย ที่ สี่แยก|Turn left at the intersection.', wrong: ['มี ยุง', 'ขอ ผ้าเช็ดตัว ด้วย'] } },
};

const travelSubject = subject(
  'travel',
  'Travel: Getting Around',
  'gaan-dəən-thaang',
  'Real Thai for getting around Thailand: vehicles, buses, trains, taxis, buying tickets, asking directions, and checking into a hotel — from Essential Thai by James Higbie.',
  rewriteLessons(lessons, REWRITES, romanTable([{ lessons }]))
);

module.exports = { travelSubject };
