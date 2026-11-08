// Content model for DB-backed "real course" subjects (as opposed to the
// static, hand-authored UNITS in data.ts). Every step here traces back to a
// specific page in a source textbook — see `source` fields — since the
// whole point of this content is that it's copied from real books, not
// invented. Kept in its own file since it has nothing to do with the RN
// rendering layer and is shared with the Node authoring/seed scripts under
// scripts/, which can't import React Native code.

export interface CourseWord {
  thai: string;
  roman: string;
  english: string;
}

interface StepBase {
  id: string;
}

// A flashcard-style intro: shows one new word/phrase, reads it aloud, and
// requires nothing but "Continue" — this is what makes every later
// mc/sentenceOrder/speak step in the lesson answerable, since a word only
// ever gets tested after one of these has taught it (see
// scripts/lib/dictionaryCheck.js).
export interface WordIntroStep extends StepBase {
  type: 'wordIntro';
  word: CourseWord;
  source: string;
}

// Same idea as WordIntroStep, but for two closely-related words taught
// together on one screen (one Continue, not two) — both are read aloud in
// turn. Used sparingly (a pair, never more) so a lesson's new-word count
// stays readable at a glance without forcing an artificial one-word-per-tap
// pace for words naturally taught as a pair.
export interface WordIntroGroupStep extends StepBase {
  type: 'wordIntroGroup';
  words: CourseWord[];
  source: string;
}

// A pronunciation/grammar rule screen — read aloud on demand rather than
// auto-played, since these are longer than a single word/sentence.
export interface RuleStep extends StepBase {
  type: 'rule';
  title: string;
  body: string;
  source: string;
}

// Thai sentence shown -> pick the correct English translation from a list.
export interface TranslationChoiceStep extends StepBase {
  type: 'translationChoice';
  thai: string;
  // Word/phrase breakdown of `thai` (joins back to it exactly) — displayed
  // space-separated, since Thai script has no spaces between words and a
  // beginner can't otherwise tell where one word ends and the next begins.
  parts: string[];
  roman: string;
  options: { text: string; correct: boolean }[];
  source: string;
}

// English sentence shown -> arrange Thai tiles (whole words, or single
// syllables/characters when tileUnit is 'syllable') into the correct order.
export interface SentenceOrderStep extends StepBase {
  type: 'sentenceOrder';
  prompt: string;
  tileUnit: 'word' | 'syllable';
  words: Record<string, { roman: string; thai: string }>;
  poolOrder: string[];
  correctOrder: string[];
  source: string;
}

export interface SpeakCourseStep extends StepBase {
  type: 'speak';
  roman: string;
  thai: string;
  // See TranslationChoiceStep.parts.
  parts: string[];
  meaning: string;
  source: string;
}

export interface ReplyContextLine {
  speaker: 'M' | 'F';
  thai: string;
  // Word/phrase breakdown of `thai`, displayed space-separated — see
  // TranslationChoiceStep.parts.
  parts: string[];
  roman: string;
  english: string;
}

// A short chat-style exchange: `context` is a lead-in conversation (one or
// more lines, shown in full — Thai/roman/English — so the learner
// understands what was said), then the learner picks how the last speaker's
// line would be answered, out of a few already-taught Thai phrases — only
// one of which actually fits the exchange.
export interface ReplyStep extends StepBase {
  type: 'reply';
  context: ReplyContextLine[];
  replySpeaker: 'M' | 'F';
  thai: string;
  roman: string;
  english: string;
  // Word/phrase breakdown of `thai` (the correct reply) — see
  // TranslationChoiceStep.parts.
  parts: string[];
  options: { thai: string; roman: string; correct: boolean }[];
  source: string;
}

// Thai audio plays first, with no text shown, and the learner picks the
// matching sentence — by ear — out of a few already-taught candidates.
// Options carry roman + thai (not English), since the point is
// distinguishing what was said, not translating it. `meaning` is revealed
// once answered, same as SpeakCourseStep.
export interface ListenChoiceStep extends StepBase {
  type: 'listenChoice';
  thai: string;
  roman: string;
  // Word/phrase breakdown of `thai` (joins back to it exactly) — see
  // TranslationChoiceStep.parts.
  parts: string[];
  meaning: string;
  options: { thai: string; roman: string; correct: boolean }[];
  source: string;
}

// Auto-appended to every non-dialogue lesson by lesson() in
// scripts/lib/courseBuilder.js from that lesson's own wordIntro/
// wordIntroGroup words — never hand-authored. A tap-to-match review game
// over the words just taught, same interaction as the legacy MatchStep
// (src/screens/steps/MatchStep.tsx) but built from this lesson's own pairs
// instead of a src/data.ts VocabLesson's fixed tiles.
export interface MatchGameStep extends StepBase {
  type: 'match';
  pairs: { thai: string; roman: string; english: string }[];
  source: string;
}

export type CourseStep =
  | WordIntroStep
  | WordIntroGroupStep
  | RuleStep
  | TranslationChoiceStep
  | SentenceOrderStep
  | SpeakCourseStep
  | ReplyStep
  | MatchGameStep
  | ListenChoiceStep;

export interface CourseVocabLesson {
  id: string;
  title: string;
  steps: CourseStep[];
}

// A short multi-line exchange — recombines vocab already taught earlier in
// the subject (never introduces new words) so the focus is on understanding
// full sentences in context. Structurally identical to data.ts's
// DialogueLesson/DialogueStep on purpose, so DialogueLessonScreen can render
// either without modification — see its `lesson` prop type.
export interface CourseDialogueLine {
  speaker: string;
  thai: string;
  roman: string;
  english: string;
}

// `meaning` is only ever set on a 'blank' step's options (text there is a
// romanized Thai word, not English, unlike comprehension/translate options
// which are already English) — the English gloss shown once answered so
// picking correctly reinforces what the word actually means instead of
// just matching a memorized shape.
export type CourseDialogueOption = { text: string; correct: boolean; meaning?: string };

export type CourseDialogueStep =
  | { type: 'intro' }
  | { type: 'comprehension'; lineIndex: number; options: CourseDialogueOption[] }
  | { type: 'translate'; lineIndex: number; options: CourseDialogueOption[] }
  // `before`/`after` are the romanization on either side of the blanked word.
  | { type: 'blank'; lineIndex: number; before: string; after: string; options: CourseDialogueOption[] }
  | { type: 'speak'; lineIndex: number };

export interface CourseDialogueLesson {
  id: string;
  kind: 'dialogue';
  title: string;
  scene: string;
  lines: CourseDialogueLine[];
  steps: CourseDialogueStep[];
}

export type CourseLesson = CourseVocabLesson | CourseDialogueLesson;

export function isDialogueCourseLesson(lesson: CourseLesson): lesson is CourseDialogueLesson {
  return (lesson as CourseDialogueLesson).kind === 'dialogue';
}

export interface CourseSubject {
  id: string;
  title: string;
  roman: string;
  description: string;
  lessons: CourseLesson[];
}

// Every Thai word/phrase a step tests the learner on, keyed so the
// dictionary check can compare "tested" against "introduced so far".
export function testedThaiInStep(step: CourseStep): string[] {
  switch (step.type) {
    case 'translationChoice':
    case 'listenChoice':
      return [step.thai];
    case 'sentenceOrder':
      return Object.values(step.words).map((w) => w.thai);
    case 'speak':
      return [step.thai];
    case 'reply':
      return [...step.context.map((l) => l.thai), step.thai];
    default:
      return [];
  }
}

// Every word a wordIntro/wordIntroGroup step teaches across a subject's
// whole lesson list — for the Words page, once a subject has been started
// at all it shows its complete vocabulary (including lessons not reached
// yet), not just what's been formally unlocked. Dialogue lessons never
// introduce new words (see isDialogueCourseLesson), so they're skipped.
// Deduped by thai text, first occurrence wins, in teaching order.
export function subjectWords(subject: CourseSubject): CourseWord[] {
  const seen = new Set<string>();
  const words: CourseWord[] = [];
  for (const lesson of subject.lessons) {
    if (isDialogueCourseLesson(lesson)) continue;
    for (const step of lesson.steps) {
      const stepWords = step.type === 'wordIntro' ? [step.word] : step.type === 'wordIntroGroup' ? step.words : [];
      for (const w of stepWords) {
        if (seen.has(w.thai)) continue;
        seen.add(w.thai);
        words.push(w);
      }
    }
  }
  return words;
}
