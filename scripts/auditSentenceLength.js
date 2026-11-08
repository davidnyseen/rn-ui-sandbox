// Diagnostic-only: measures how sentence length (word count in the
// romanization) progresses across each lesson of each subject, to quantify
// whether early lessons are appropriately short and later lessons actually
// get longer, per the "ramp up to long sentences" pacing request.
const { restaurantSubject } = require('./courseContent/restaurant');
const { greetingsSubjects } = require('./courseContent/greetings');
const { basicsSubject } = require('./courseContent/basics');
const { familySubject } = require('./courseContent/family');
const { numbersSubject } = require('./courseContent/numbers');
const { travelSubject } = require('./courseContent/travel');

const subjects = [restaurantSubject, ...greetingsSubjects, basicsSubject, familySubject, numbersSubject, travelSubject];

function wordCount(roman) {
  return roman.trim().split(/\s+/).filter(Boolean).length;
}

// Longest "sentence-shaped" graded step per lesson: translationChoice.roman,
// sentenceOrder (count of tiles), speak.roman. wordIntro/rule excluded
// since those aren't sentences being tested.
function lessonSentenceLengths(lesson) {
  const lens = [];
  // Dialogue lessons reuse the 'speak' type name for a step shape with no
  // `.roman` field (see courseBuilder.js's checkDictionary comment) — skip
  // them the same way checkDictionary does.
  if (lesson.kind === 'dialogue') return lens;
  for (const step of lesson.steps) {
    if (step.type === 'translationChoice') lens.push(wordCount(step.roman));
    else if (step.type === 'sentenceOrder') lens.push(step.correctOrder.length);
    else if (step.type === 'speak') lens.push(wordCount(step.roman));
  }
  return lens;
}

for (const subject of subjects) {
  console.log(`\n=== ${subject.id} (${subject.lessons.length} lessons) ===`);
  subject.lessons.forEach((lesson, i) => {
    const lens = lessonSentenceLengths(lesson);
    const max = lens.length ? Math.max(...lens) : 0;
    const avg = lens.length ? (lens.reduce((a, b) => a + b, 0) / lens.length).toFixed(1) : '0';
    console.log(`  L${i + 1} ${lesson.id} — max:${max} avg:${avg} lens:[${lens.join(',')}]`);
  });
}
