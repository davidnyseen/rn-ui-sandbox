'use strict';
const { checkDictionary } = require('./lib/courseBuilder');
const { restaurantSubject } = require('./courseContent/restaurant');
const { greetingsSubjects } = require('./courseContent/greetings');
const { basicsSubject } = require('./courseContent/basics');
const { familySubject } = require('./courseContent/family');
const { numbersSubject } = require('./courseContent/numbers');
const { travelSubject } = require('./courseContent/travel');

const subjects = [restaurantSubject, ...greetingsSubjects, basicsSubject, familySubject, numbersSubject, travelSubject];

try {
  // greetingsSubjects share a running vocabulary (the second was split out
  // of the same original subject as the first) — chain the check across
  // them the same way generateSeedSqlGreetings.js does; every other
  // subject here is still fully self-contained.
  let greetingsIntroduced = new Set();
  for (const subj of subjects) {
    if (greetingsSubjects.includes(subj)) {
      greetingsIntroduced = checkDictionary(subj, greetingsIntroduced);
    } else {
      checkDictionary(subj);
    }
    const lessonCount = subj.lessons.length;
    const stepCount = subj.lessons.reduce((n, l) => n + l.steps.length, 0);
    const gradedCount = subj.lessons.reduce(
      (n, l) => n + l.steps.filter((s) => s.type === 'translationChoice' || s.type === 'sentenceOrder' || s.type === 'speak').length,
      0
    );
    console.log(`OK: "${subj.title}" — ${lessonCount} lessons, ${stepCount} steps (${gradedCount} graded).`);
  }
} catch (err) {
  console.error('DICTIONARY CHECK FAILED:', err.message);
  process.exit(1);
}
