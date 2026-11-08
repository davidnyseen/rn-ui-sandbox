import { Reason } from './data';

export type Screen =
  | 'auth' | 'onboarding' | 'home' | 'lesson' | 'complete' | 'failed' | 'settings' | 'unitIntro' | 'progress'
  | 'courseLesson' | 'words';
export type SpeakState = 'idle' | 'recording' | 'done';

export interface AppState {
  screen: Screen;
  hasOnboarded: boolean;
  goal: number;
  // Asked once during onboarding, purely for personalization — see REASONS.
  reason: Reason | null;
  currentUnitIndex: number;
  currentLessonIndex: number;
  activeUnitId: number | null;
  activeLessonIndex: number;
  stepIndex: number;
  mistakeCount: number;
  // Multiple choice / Listening (script) / Meaning drills run once per word
  // taught this lesson — numbered 1/2 since each lesson now teaches two.
  mc1Selected: number | null;
  mc1Answered: boolean;
  mc2Selected: number | null;
  mc2Answered: boolean;
  listenScript1Selected: number | null;
  listenScript1Answered: boolean;
  listenScript2Selected: number | null;
  listenScript2Answered: boolean;
  meaning1Selected: number | null;
  meaning1Answered: boolean;
  meaning2Selected: number | null;
  meaning2Answered: boolean;
  matchSelected: string[];
  matchedPairs: number[];
  matchWrong: string[];
  listenPlaying: boolean;
  // Shared by both Speak-it steps (word-alone, then sentence) since they
  // run one after another, never simultaneously.
  speakState: SpeakState;
  speakHeardText: string | null;
  speakCorrect: boolean;
  bankBuilt: string[];
  bankChecked: boolean;
  correctCount: number;
  streak: number;
  xp: number;
  lastActiveDate: string | null;
  // Stars (1-3) earned the last time each unit's final lesson was cleared,
  // keyed by unit id — shown on the path map so a done unit's node shows
  // more than just a checkmark.
  unitStars: Record<number, number>;
  // Step indices missed during the current lesson attempt, so the "Review
  // mistakes" button on the complete screen knows what to re-drill.
  mistakeSteps: number[];
  // When set, the lesson screen is walking through `mistakeSteps` one at a
  // time (practice redo) instead of the normal 0..9 sequence — wrong
  // answers here don't cost hearts or affect the stats already shown.
  reviewQueue: number[] | null;
  // True when the current reviewQueue walk is a from-scratch practice-hub
  // drill (started with zeroed correctCount/mistakeCount, all 0..9 steps
  // queued) rather than a post-lesson mistake review — lets continueStep
  // route the finish back to the practice hub instead of the complete
  // screen, which would otherwise show a contradictory "0 correct, 3 stars".
  practiceRun: boolean;
  // DB-backed course subject currently open (see src/courseTypes.ts) — a
  // separate progress track from activeUnitId/activeLessonIndex above,
  // since CourseLessonScreen runs its own self-contained step machine
  // (like DialogueLessonScreen) rather than driving through stepIndex here.
  activeCourseSubjectId: string | null;
  activeCourseLessonIndex: number;
  // unlockedLessonIndex is "how many lessons of this subject are cleared",
  // i.e. the next lesson to start — same frontier convention as
  // currentUnitIndex/currentLessonIndex for the static path.
  courseProgress: Record<string, { unlockedLessonIndex: number; stars: Record<number, number> }>;
  // Set when a lesson node on the path was tapped — shows the launch sheet
  // (see LessonSheet) instead of jumping straight into the lesson. Cleared
  // on either Start or dismiss. Deliberately not persisted (see
  // PERSISTED_KEYS) — a relaunch should never resume with the sheet open.
  pendingCourseLesson: { subjectId: string; lessonIndex: number } | null;
}

export const initialState: AppState = {
  screen: 'onboarding',
  hasOnboarded: false,
  goal: 10,
  reason: null,
  currentUnitIndex: 0,
  currentLessonIndex: 0,
  activeUnitId: null,
  activeLessonIndex: 0,
  stepIndex: 0,
  mistakeCount: 0,
  mc1Selected: null,
  mc1Answered: false,
  mc2Selected: null,
  mc2Answered: false,
  listenScript1Selected: null,
  listenScript1Answered: false,
  listenScript2Selected: null,
  listenScript2Answered: false,
  meaning1Selected: null,
  meaning1Answered: false,
  meaning2Selected: null,
  meaning2Answered: false,
  matchSelected: [],
  matchedPairs: [],
  matchWrong: [],
  listenPlaying: false,
  speakState: 'idle',
  speakHeardText: null,
  speakCorrect: false,
  bankBuilt: [],
  bankChecked: false,
  correctCount: 0,
  streak: 0,
  xp: 0,
  lastActiveDate: null,
  unitStars: {},
  mistakeSteps: [],
  reviewQueue: null,
  practiceRun: false,
  activeCourseSubjectId: null,
  activeCourseLessonIndex: 0,
  courseProgress: {},
  pendingCourseLesson: null,
};

// Clears one step's interactive UI (selection/answered/etc) without
// touching stepIndex, mistakeCount, or correctCount — used both when
// starting a fresh lesson (folded into lessonResetFields below) and when
// jumping to a specific step during a mistake review.
export const stepResetFields: Partial<AppState> = {
  mc1Selected: null,
  mc1Answered: false,
  mc2Selected: null,
  mc2Answered: false,
  listenScript1Selected: null,
  listenScript1Answered: false,
  listenScript2Selected: null,
  listenScript2Answered: false,
  meaning1Selected: null,
  meaning1Answered: false,
  meaning2Selected: null,
  meaning2Answered: false,
  matchSelected: [],
  matchedPairs: [],
  matchWrong: [],
  listenPlaying: false,
  speakState: 'idle',
  speakHeardText: null,
  speakCorrect: false,
  bankBuilt: [],
  bankChecked: false,
};

export const lessonResetFields: Partial<AppState> = {
  stepIndex: 0,
  mistakeCount: 0,
  correctCount: 0,
  mistakeSteps: [],
  reviewQueue: null,
  practiceRun: false,
  ...stepResetFields,
};

// Fields worth persisting across app launches — deliberately excludes
// screen/step/in-progress-exercise state, so relaunching never strands the
// user mid-exercise on a screen that no longer makes sense.
export const PERSISTED_KEYS = [
  'hasOnboarded',
  'goal',
  'reason',
  'currentUnitIndex',
  'currentLessonIndex',
  'streak',
  'xp',
  'lastActiveDate',
  'unitStars',
  'courseProgress',
] as const satisfies readonly (keyof AppState)[];

export type PersistedState = Pick<AppState, (typeof PERSISTED_KEYS)[number]>;

export function toPersisted(state: AppState): PersistedState {
  const out = {} as PersistedState;
  for (const key of PERSISTED_KEYS) {
    (out as any)[key] = state[key];
  }
  return out;
}

// Combines this device's local courseProgress with whatever's on the
// server rather than letting either side blindly clobber the other —
// picks the further-along unlockedLessonIndex per subject (so neither an
// unsynced local lesson nor an already-synced remote one gets lost) and
// unions their stars (local wins a same-lesson conflict, since it's the
// device the learner is on right now).
export function mergeCourseProgress(
  local: AppState['courseProgress'],
  remote: AppState['courseProgress']
): AppState['courseProgress'] {
  const merged: AppState['courseProgress'] = { ...remote };
  for (const subjectId of Object.keys({ ...local, ...remote })) {
    const l = local[subjectId];
    const r = remote[subjectId];
    if (!l) continue;
    merged[subjectId] = r
      ? { unlockedLessonIndex: Math.max(l.unlockedLessonIndex, r.unlockedLessonIndex), stars: { ...r.stars, ...l.stars } }
      : l;
  }
  return merged;
}
