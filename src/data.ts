export type Tile = { tileKey: string; pairId: number; kind: 'en' | 'th'; label: string; sub?: string };
export type Word = { roman: string; thai: string };
export type WordItem = { roman: string; thai: string; options: { text: string; correct: boolean }[] };
export type SpeakItem = { roman: string; thai: string; meaning: string };

export interface VocabLesson {
  // Two vocab items taught per lesson — each gets its own Multiple choice /
  // Listening / Meaning drill before Match, Speak, and Word bank.
  words: [WordItem, WordItem];
  tiles: Tile[];
  // [0] = second word spoken alone, [1] = the lesson's sentence/phrase —
  // pronunciation practice at both the word level and in context.
  speak: [SpeakItem, SpeakItem];
  bank: {
    prompt: string;
    words: Record<string, Word>;
    poolOrder: string[];
    correctOrder: string[];
    // Multi-phrase prompts: one labelled row of slots per phrase (see scripts/lib/orderGroups.js).
    groups?: { label: string; size: number }[];
  };
}

// A short multi-line exchange, always the final lesson in its unit —
// re-teaches nothing new, only recombines vocab already taught (in this
// unit or earlier) so the focus is on understanding full sentences in
// context rather than isolated words.
export interface DialogueLine {
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
export type DialogueOption = { text: string; correct: boolean; meaning?: string };

export type DialogueStep =
  | { type: 'intro' }
  | { type: 'comprehension'; lineIndex: number; options: DialogueOption[] }
  | { type: 'translate'; lineIndex: number; options: DialogueOption[] }
  // `before`/`after` are the romanization on either side of the blanked word.
  | { type: 'blank'; lineIndex: number; before: string; after: string; options: DialogueOption[] }
  | { type: 'speak'; lineIndex: number };

export interface DialogueLesson {
  kind: 'dialogue';
  title: string;
  scene: string;
  lines: DialogueLine[];
  steps: DialogueStep[];
}

export type LessonContent = VocabLesson | DialogueLesson;

export function isDialogueLesson(lesson: LessonContent): lesson is DialogueLesson {
  return (lesson as DialogueLesson).kind === 'dialogue';
}

// Conversation questions are written with the right answer first; shuffle each step's options once per lesson
// attempt so its position gives nothing away (user, 2026-11-10: "The first is always the correct answer").
export function shuffleDialogueSteps(steps: DialogueStep[]): DialogueStep[] {
  return steps.map((step) => {
    const options = dialogueStepOptions(step);
    if (!options) return step;
    const out = [...options];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return { ...step, options: out } as DialogueStep;
  });
}

export function dialogueStepOptions(step: DialogueStep): DialogueOption[] | null {
  return step.type === 'comprehension' || step.type === 'translate' || step.type === 'blank' ? step.options : null;
}

export interface Unit {
  id: number;
  title: string;
  roman: string;
  // Full graduated sequence for the unit: words -> short phrases ->
  // sentence-building -> a closing dialogue lesson that recombines
  // everything taught into full sentences and a short conversation.
  lessons: LessonContent[];
}

export const UNITS: Unit[] = [
];

// Each daily-goal option paired with a pace label — turns a bare minute
// count into a felt sense of commitment, the way most habit-building apps
// pair a duration with a plain-language pace word.
export const GOALS = [
  { minutes: 5, pace: 'Light' },
  { minutes: 10, pace: 'Steady' },
  { minutes: 15, pace: 'Committed' },
  { minutes: 20, pace: 'All in' },
] as const;

// Asked once during onboarding purely to personalize the welcome — nothing
// downstream branches on it yet. Icon is looked up by id in OnboardingScreen
// since this file stays free of React/RN imports.
export const REASONS = [
  { id: 'travel', label: 'Travel' },
  { id: 'school', label: 'School/University' },
  { id: 'work', label: 'Work' },
  { id: 'family', label: 'Family/Friends' },
  { id: 'hobby', label: 'Hobby/Interest' },
  { id: 'other', label: 'Other' },
] as const;
export type Reason = (typeof REASONS)[number]['id'];
export const STEP_LABELS = [
  'Multiple choice',
  'Listening',
  'Meaning',
  'Multiple choice',
  'Listening',
  'Meaning',
  'Match pairs',
  'Speak it',
  'Speak it',
  'Word bank',
];

// Word-bank tile keys are position-indexed, not content-indexed — a
// sentence that repeats a word (two tiles with identical thai/roman text
// but different keys) would make a plain per-position key comparison
// wrongly reject a learner who placed the "other" identical-looking tile in
// a slot, even though the sentence they built reads exactly right. Compares
// the resolved Thai text at each position instead.
export function bankBuiltMatches(words: Record<string, { thai: string }>, built: string[], correctOrder: string[]): boolean {
  return built.length === correctOrder.length && built.every((key, i) => words[key]?.thai === words[correctOrder[i]]?.thai);
}

// Script-recognition distractors for the "Listening" step: plays `word.thai`
// aloud (a word just taught via its own Multiple choice step) and asks the
// learner to pick the matching written word. Distractors are other real
// Thai vocab already introduced in this lesson (tiles + bank words), not
// random noise. Correct answer always first, matching the no-shuffle
// convention used for word.options.
export function listenScriptOptions(lesson: VocabLesson, word: WordItem): { thai: string; roman: string; correct: boolean }[] {
  const correctThai = word.thai;
  const pool = [
    ...lesson.tiles.filter((t) => t.kind === 'th' && t.sub).map((t) => ({ thai: t.label, roman: t.sub! })),
    ...Object.values(lesson.bank.words).map((w) => ({ thai: w.thai, roman: w.roman })),
  ];
  const seen = new Set<string>([correctThai]);
  const distractors: { thai: string; roman: string }[] = [];
  for (const candidate of pool) {
    if (seen.has(candidate.thai)) continue;
    seen.add(candidate.thai);
    distractors.push(candidate);
    if (distractors.length === 3) break;
  }
  return [
    { thai: correctThai, roman: word.roman, correct: true },
    ...distractors.map((d) => ({ ...d, correct: false })),
  ];
}
