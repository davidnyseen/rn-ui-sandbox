import { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Session } from '@supabase/supabase-js';
import { RECORDING_SESSION_IOS, restorePlaybackAudio, isSpeechRecognitionAvailable, SpeechRecognitionModule, useSpeechRecognitionEvent } from './stt';
import { AppState, initialState, lessonResetFields, mergeCourseProgress, Screen, stepResetFields, toPersisted } from './state';
import { bankBuiltMatches, isDialogueLesson, listenScriptOptions, Reason, STEP_LABELS, UNITS } from './data';
import { MAX_MISTAKES, starsForMistakes, stepStatus } from './lessonLogic';
import { playCompleteSound, playCorrectSound, playWrongSound } from './audio';
import { colors, PATH_PALETTE } from './theme';
import { loadProgress, nextStreak, saveProgress, todayKey } from './persistence';
import { speakThai } from './tts';
import { matchesSpokenThai } from './text';
import { completeWebOAuthRedirect, isSupabaseConfigured, subscribeToNativeAuthRedirect, supabase } from './lib/supabase';
import { fetchRemoteCourseProgress, fetchRemoteProfile, pushRemoteCourseProgress, pushRemoteProfile } from './lib/progressSync';
import { fetchCourseSubjects } from './lib/courseContent';
import { lessonDisplayInfo } from './lib/lessonDisplay';
import { CourseSubject, isDialogueCourseLesson } from './courseTypes';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PathScreen } from './screens/PathScreen';
import { LessonScreen } from './screens/LessonScreen';
import { DialogueLessonScreen } from './screens/DialogueLessonScreen';
import { CourseLessonScreen } from './screens/CourseLessonScreen';
import { LessonSheet } from './screens/LessonSheet';
import { CompleteScreen } from './screens/CompleteScreen';
import { FailedScreen } from './screens/FailedScreen';
import { UnitIntroScreen } from './screens/UnitIntroScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { WordsReviewScreen } from './screens/WordsReviewScreen';
import { BottomTabBar, TAB_SCREENS } from './components/BottomTabBar';

// TESTING ONLY: mirrors PathScreen's TESTING_UNLOCK_ALL — lets openUnit jump
// to any unit regardless of progress. Flip back to false to restore normal
// sequential gating.
const TESTING_UNLOCK_ALL = false;

export function RootApp() {
  const [state, setState] = useState<AppState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(!isSupabaseConfigured);
  const [courseSubjects, setCourseSubjects] = useState<CourseSubject[]>([]);

  const patch = (p: Partial<AppState>) => setState((s) => ({ ...s, ...p }));

  // DB-backed course subjects (src/courseTypes.ts) load once at startup,
  // same local-first spirit as everything else here — an empty/unreachable
  // backend just means the course nodes don't appear on the path yet.
  useEffect(() => {
    fetchCourseSubjects().then(setCourseSubjects);
  }, []);

  // Local cache loads instantly so the app is usable offline / before any
  // backend is configured; a signed-in Supabase profile (below) then wins
  // over it once fetched, since the server is the source of truth.
  useEffect(() => {
    loadProgress().then((saved) => {
      if (saved) {
        setState((s) => ({ ...s, ...saved, screen: saved.hasOnboarded ? 'home' : 'onboarding' }));
      }
      loadedRef.current = true;
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    // Finish a Google sign-in redirect before checking for a session, so a
    // fresh OAuth callback is picked up on this very first check rather than
    // requiring a second load.
    completeWebOAuthRedirect().then(() => {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        setAuthChecked(true);
      });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    // Native's counterpart to completeWebOAuthRedirect above — a magic-link
    // email opened from outside the app arrives as a deep link rather than
    // a promise resolving in place, so it needs its own listener. This is a
    // no-op on web (completeWebOAuthRedirect already covers it there).
    const unsubscribeDeepLink = subscribeToNativeAuthRedirect();
    return () => {
      sub.subscription.unsubscribe();
      unsubscribeDeepLink();
    };
  }, []);

  // Merge in a linked Supabase profile once a session exists. Sign-in is
  // opt-in from the home screen (see openAuth) — an unauthenticated visitor
  // is never routed away from the local-first flow. courseProgress is
  // fetched and merged separately from the profile row (see
  // fetchRemoteCourseProgress) — mergeCourseProgress reconciles it with
  // whatever's already on this device instead of one side clobbering the
  // other, since either could be ahead depending on where the learner last
  // played.
  useEffect(() => {
    if (!isSupabaseConfigured || !authChecked || !session) return;
    const userId = session.user.id;
    Promise.all([fetchRemoteProfile(userId), fetchRemoteCourseProgress(userId)]).then(([remote, remoteCourseProgress]) => {
      if (remote) {
        setState((s) => ({
          ...s,
          ...remote,
          courseProgress: mergeCourseProgress(s.courseProgress, remoteCourseProgress),
          screen: remote.hasOnboarded ? 'home' : 'onboarding',
        }));
      } else {
        pushRemoteProfile(userId, toPersisted(state));
        for (const [subjectId, progress] of Object.entries(state.courseProgress)) {
          pushRemoteCourseProgress(userId, subjectId, progress);
        }
        setState((s) => (s.screen === 'auth' ? { ...s, screen: 'home' } : s));
      }
    });
    // Only re-run when the signed-in user actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupabaseConfigured, authChecked, session?.user.id]);

  useEffect(() => {
    if (!loadedRef.current) return;
    saveProgress(state);
    if (isSupabaseConfigured && session) {
      pushRemoteProfile(session.user.id, toPersisted(state));
    }
  }, [state.hasOnboarded, state.goal, state.currentUnitIndex, state.streak, state.xp, state.lastActiveDate, session?.user.id]);

  const signOut = () => supabase.auth.signOut();
  const openAuth = () => patch({ screen: 'auth' });
  const closeAuth = () => patch({ screen: 'home' });

  const activeUnit = UNITS.find((u) => u.id === state.activeUnitId) ?? null;
  const activeLesson = activeUnit?.lessons[state.activeLessonIndex] ?? null;
  // Narrowed to the vocab-lesson shape — used by the fixed 10-step vocab
  // lesson machinery below, which doesn't apply to dialogue lessons (those
  // run their own step machine in DialogueLessonScreen).
  const activeVocabLesson = activeLesson && !isDialogueLesson(activeLesson) ? activeLesson : null;
  const activeVocabLessonRef = useRef(activeVocabLesson);
  activeVocabLessonRef.current = activeVocabLesson;

  const activeCourseSubject = courseSubjects.find((s) => s.id === state.activeCourseSubjectId) ?? null;
  const activeCourseLesson = activeCourseSubject?.lessons[state.activeCourseLessonIndex] ?? null;
  const pendingSubject = state.pendingCourseLesson
    ? (courseSubjects.find((s) => s.id === state.pendingCourseLesson!.subjectId) ?? null)
    : null;

  const stepIndexRef = useRef(state.stepIndex);
  stepIndexRef.current = state.stepIndex;

  useSpeechRecognitionEvent('result', (event) => {
    const lesson = activeVocabLessonRef.current;
    if (!lesson) return;
    const target = lesson.speak[stepIndexRef.current === 7 ? 0 : 1];
    const transcript = event.results[0]?.transcript ?? '';
    const correct = matchesSpokenThai(transcript, target.thai);
    (correct ? playCorrectSound : playWrongSound)();
    patch({ speakHeardText: transcript, speakCorrect: correct });
  });
  useSpeechRecognitionEvent('end', () => {
    restorePlaybackAudio();
    patch({ speakState: 'done' });
  });
  useSpeechRecognitionEvent('error', () => {
    restorePlaybackAudio();
    patch({ speakState: 'idle' });
  });

  const setGoal = (v: number) => patch({ goal: v });
  const setReason = (v: Reason) => patch({ reason: v });
  const startOnboarding = () => patch({ screen: 'home', hasOnboarded: true });

  const openUnit = (unitId: number) => {
    const unit = UNITS.find((u) => u.id === unitId);
    const index = UNITS.findIndex((u) => u.id === unitId);
    if (!unit || (!TESTING_UNLOCK_ALL && index > state.currentUnitIndex)) return;
    // Resume where the frontier unit left off; replaying an already-cleared
    // unit always starts from its first lesson and never touches progress.
    const startLessonIndex = index === state.currentUnitIndex
      ? Math.min(state.currentLessonIndex, unit.lessons.length - 1)
      : 0;
    // Route through the unit-intro screen whenever the target is a unit's
    // first lesson (fresh start or replay alike) — otherwise go straight in.
    patch({
      screen: startLessonIndex === 0 ? 'unitIntro' : 'lesson',
      activeUnitId: unitId,
      activeCourseSubjectId: null,
      activeLessonIndex: startLessonIndex,
      ...lessonResetFields,
    });
  };
  const closeLesson = () => patch({ screen: 'home' });
  const continueFromUnitIntro = () => patch({ screen: 'lesson' });
  const closeUnitIntro = () => patch({ screen: 'home' });

  // Each lesson is its own node on the path now (see PathScreen), and the
  // map itself no longer shows lesson names — tapping a node opens the
  // launch sheet (see LessonSheet) instead of jumping straight in, so the
  // name/start-vs-review choice lives there. Re-validates the lock
  // server-side-style rather than trusting the tap came from an enabled
  // node.
  const openCourseLesson = (subjectId: string, lessonIndex: number) => {
    const subject = courseSubjects.find((s) => s.id === subjectId);
    if (!subject || lessonIndex < 0 || lessonIndex >= subject.lessons.length) return;
    if (!TESTING_UNLOCK_ALL) {
      const unlocked = state.courseProgress[subjectId]?.unlockedLessonIndex ?? 0;
      if (lessonIndex > unlocked) return;
    }
    patch({ pendingCourseLesson: { subjectId, lessonIndex } });
  };
  const closeLessonSheet = () => patch({ pendingCourseLesson: null });
  const confirmStartCourseLesson = () => {
    const pending = state.pendingCourseLesson;
    if (!pending) return;
    patch({
      screen: 'courseLesson',
      activeUnitId: null,
      activeCourseSubjectId: pending.subjectId,
      activeCourseLessonIndex: pending.lessonIndex,
      pendingCourseLesson: null,
      // Guards against a stale `true` left over from a practice run that was
      // closed mid-lesson (see closeCourseLesson/exitFailedLesson) — without
      // this, the next *real* lesson attempt would silently skip saving
      // progress.
      practiceRun: false,
    });
  };
  const closeCourseLesson = () => patch({ screen: state.practiceRun ? 'progress' : 'home', practiceRun: false });

  // Drills an already-started course subject ungraded, from its first
  // non-dialogue lesson. completeCourseLesson checks `practiceRun` to skip
  // saving courseProgress and land back on the practice hub instead of the
  // Complete screen; exitFailedLesson/retryLesson do the same for a run that
  // ends in Failed instead.
  const startCoursePractice = (subjectId: string) => {
    const subject = courseSubjects.find((s) => s.id === subjectId);
    if (!subject) return;
    const progress = state.courseProgress[subjectId];
    if (!progress || progress.unlockedLessonIndex <= 0) return;
    const lessonIndex = subject.lessons.findIndex((l) => !isDialogueCourseLesson(l));
    if (lessonIndex === -1) return;
    patch({
      screen: 'courseLesson',
      activeUnitId: null,
      activeCourseSubjectId: subjectId,
      activeCourseLessonIndex: lessonIndex,
      practiceRun: true,
    });
  };

  const selectMc1 = (i: number) => {
    if (state.mc1Answered) return;
    patch({ mc1Selected: i });
  };
  const checkMc1 = () => {
    if (state.mc1Answered || state.mc1Selected === null || !activeVocabLesson) return;
    (activeVocabLesson.words[0].options[state.mc1Selected].correct ? playCorrectSound : playWrongSound)();
    patch({ mc1Answered: true });
  };
  const playMcSample1 = () => {
    if (!activeVocabLesson) return;
    speakThai(activeVocabLesson.words[0].thai);
  };

  const selectMc2 = (i: number) => {
    if (state.mc2Answered) return;
    patch({ mc2Selected: i });
  };
  const checkMc2 = () => {
    if (state.mc2Answered || state.mc2Selected === null || !activeVocabLesson) return;
    (activeVocabLesson.words[1].options[state.mc2Selected].correct ? playCorrectSound : playWrongSound)();
    patch({ mc2Answered: true });
  };
  const playMcSample2 = () => {
    if (!activeVocabLesson) return;
    speakThai(activeVocabLesson.words[1].thai);
  };

  const selectMeaning1 = (i: number) => {
    if (state.meaning1Answered) return;
    patch({ meaning1Selected: i });
  };
  const checkMeaning1 = () => {
    if (state.meaning1Answered || state.meaning1Selected === null || !activeVocabLesson) return;
    const correct = activeVocabLesson.words[0].options[state.meaning1Selected].correct;
    (correct ? playCorrectSound : playWrongSound)();
    patch({ meaning1Answered: true });
  };

  const selectMeaning2 = (i: number) => {
    if (state.meaning2Answered) return;
    patch({ meaning2Selected: i });
  };
  const checkMeaning2 = () => {
    if (state.meaning2Answered || state.meaning2Selected === null || !activeVocabLesson) return;
    const correct = activeVocabLesson.words[1].options[state.meaning2Selected].correct;
    (correct ? playCorrectSound : playWrongSound)();
    patch({ meaning2Answered: true });
  };

  const clickTile = (tileKey: string, pairId: number) => {
    if (!activeVocabLesson) return;
    if (state.matchedPairs.includes(pairId) || state.matchWrong.length) return;
    if (state.matchSelected.includes(tileKey)) return;
    const tapped = activeVocabLesson.tiles.find((t) => t.tileKey === tileKey)!;
    if (tapped.kind === 'th') speakThai(tapped.label);
    if (state.matchSelected.length === 0) {
      patch({ matchSelected: [tileKey] });
      return;
    }
    const first = activeVocabLesson.tiles.find((t) => t.tileKey === state.matchSelected[0])!;
    if (first.kind === tapped.kind) {
      // Tapped another tile in the same column — switch the pending pick
      // instead of treating it as a failed match attempt.
      patch({ matchSelected: [tileKey] });
      return;
    }
    if (first.pairId === tapped.pairId) {
      playCorrectSound();
      patch({ matchedPairs: [...state.matchedPairs, first.pairId], matchSelected: [] });
    } else {
      playWrongSound();
      const wrongKeys = [state.matchSelected[0], tileKey];
      patch({ matchSelected: wrongKeys, matchWrong: wrongKeys });
      setTimeout(() => patch({ matchSelected: [], matchWrong: [] }), 650);
    }
  };

  const playListen1 = () => {
    if (!activeVocabLesson || state.listenPlaying) return;
    patch({ listenPlaying: true });
    speakThai(activeVocabLesson.words[0].thai, () => patch({ listenPlaying: false }));
  };
  const selectListenScript1 = (i: number) => {
    if (state.listenScript1Answered) return;
    patch({ listenScript1Selected: i });
  };
  const checkListenScript1 = () => {
    if (state.listenScript1Answered || state.listenScript1Selected === null || !activeVocabLesson) return;
    const correct = listenScriptOptions(activeVocabLesson, activeVocabLesson.words[0])[state.listenScript1Selected].correct;
    (correct ? playCorrectSound : playWrongSound)();
    patch({ listenScript1Answered: true });
  };

  const playListen2 = () => {
    if (!activeVocabLesson || state.listenPlaying) return;
    patch({ listenPlaying: true });
    speakThai(activeVocabLesson.words[1].thai, () => patch({ listenPlaying: false }));
  };
  const selectListenScript2 = (i: number) => {
    if (state.listenScript2Answered) return;
    patch({ listenScript2Selected: i });
  };
  const checkListenScript2 = () => {
    if (state.listenScript2Answered || state.listenScript2Selected === null || !activeVocabLesson) return;
    const correct = listenScriptOptions(activeVocabLesson, activeVocabLesson.words[1])[state.listenScript2Selected].correct;
    (correct ? playCorrectSound : playWrongSound)();
    patch({ listenScript2Answered: true });
  };

  const speakFallbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSpeak = async () => {
    if (state.speakState === 'recording') {
      // Tapping the mic again while recording stops it manually instead of
      // waiting for the automatic end-of-speech timeout.
      if (speakFallbackTimeout.current) {
        clearTimeout(speakFallbackTimeout.current);
        speakFallbackTimeout.current = null;
        playCorrectSound();
        patch({ speakState: 'done' });
      } else if (isSpeechRecognitionAvailable && SpeechRecognitionModule) {
        SpeechRecognitionModule.stop();
      }
      return;
    }
    // Allow retrying after a failed attempt — only a correct 'done' locks
    // the mic (SpeakStep disables the button in that case).
    if (state.speakState !== 'idle' && !(state.speakState === 'done' && !state.speakCorrect)) return;
    if (!isSpeechRecognitionAvailable || !SpeechRecognitionModule) {
      // No dev client / no native module available (e.g. Expo Go) — record
      // the attempt without grading it rather than dead-ending the lesson.
      patch({ speakState: 'recording', speakHeardText: null, speakCorrect: true });
      speakFallbackTimeout.current = setTimeout(() => {
        speakFallbackTimeout.current = null;
        playCorrectSound();
        patch({ speakState: 'done' });
      }, 1100);
      return;
    }
    const permission = await SpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) return;
    patch({ speakState: 'recording', speakHeardText: null, speakCorrect: false });
    try {
      SpeechRecognitionModule.start({ lang: 'th-TH', iosCategory: RECORDING_SESSION_IOS, interimResults: false, continuous: false });
    } catch {
      // The module loaded but the browser has no real speech recognizer to
      // back it (e.g. Safari, which never implemented the Web Speech API) —
      // `new SpeechRecognition()` throws synchronously in that case. Fall
      // back to the same ungraded "pass after a beat" behavior used when
      // the module isn't available at all, rather than leaving the mic
      // stuck in a 'recording' state forever with no events ever firing.
      patch({ speakHeardText: null, speakCorrect: true });
      speakFallbackTimeout.current = setTimeout(() => {
        speakFallbackTimeout.current = null;
        playCorrectSound();
        patch({ speakState: 'done' });
      }, 1100);
    }
  };

  const playSpeakSample = () => {
    if (!activeVocabLesson) return;
    speakThai(activeVocabLesson.speak[state.stepIndex === 7 ? 0 : 1].thai);
  };

  const addBankWord = (key: string) => {
    if (!activeVocabLesson) return;
    if (state.bankBuilt.length >= activeVocabLesson.bank.correctOrder.length || state.bankBuilt.includes(key)) return;
    speakThai(activeVocabLesson.bank.words[key].thai);
    patch({ bankBuilt: [...state.bankBuilt, key] });
  };
  const removeBankWord = (key: string) => {
    if (!activeVocabLesson || state.bankChecked) return;
    patch({ bankBuilt: state.bankBuilt.filter((k) => k !== key) });
  };
  const checkBank = () => {
    if (!activeVocabLesson || state.bankChecked) return;
    if (state.bankBuilt.length < activeVocabLesson.bank.correctOrder.length) return;
    const correct = bankBuiltMatches(activeVocabLesson.bank.words, state.bankBuilt, activeVocabLesson.bank.correctOrder);
    (correct ? playCorrectSound : playWrongSound)();
    patch({ bankChecked: true });
  };

  const continueStep = () => {
    if (!activeVocabLesson) return;
    const { answered, correct } = stepStatus(state, activeVocabLesson);
    if (!answered) return;

    // Reviewing missed steps is ungraded practice — it walks the recorded
    // queue instead of 0..5, and never touches hearts/xp/streak/stats.
    if (state.reviewQueue) {
      const remaining = state.reviewQueue.slice(1);
      if (remaining.length === 0) {
        patch({
          screen: state.practiceRun ? 'progress' : 'complete',
          reviewQueue: null,
          mistakeSteps: [],
          practiceRun: false,
        });
      } else {
        patch({ stepIndex: remaining[0], reviewQueue: remaining, ...stepResetFields });
      }
      return;
    }

    // Speech recognition is unreliable enough (mic permissions, accents,
    // background noise) that a "wrong" on the speak steps (7/8) is often the
    // recognizer's fault, not the learner's — so they never cost a heart.
    const isSpeakStep = state.stepIndex === 7 || state.stepIndex === 8;
    const missedGraded = !correct && !isSpeakStep;
    const cc = state.correctCount + (correct ? 1 : 0);
    const mistakes = state.mistakeCount + (missedGraded ? 1 : 0);
    const mistakeSteps = missedGraded ? [...state.mistakeSteps, state.stepIndex] : state.mistakeSteps;
    if (missedGraded && mistakes >= MAX_MISTAKES) {
      playWrongSound();
      patch({ screen: 'failed', correctCount: cc, mistakeCount: mistakes, mistakeSteps });
      return;
    }
    if (state.stepIndex < STEP_LABELS.length - 1) {
      patch({ stepIndex: state.stepIndex + 1, correctCount: cc, mistakeCount: mistakes, mistakeSteps });
    } else {
      playCompleteSound();
      const today = todayKey();
      patch({
        screen: 'complete',
        correctCount: cc,
        mistakeCount: mistakes,
        mistakeSteps,
        xp: state.xp + cc * 10,
        streak: nextStreak(state.lastActiveDate, state.streak, today),
        lastActiveDate: today,
      });
    }
  };

  // Dialogue lessons run their own step machine inside DialogueLessonScreen
  // and report back only the final tally, reusing the same xp/streak/star
  // bookkeeping as the vocab lesson's continueStep completion branch.
  const completeDialogueLesson = (correctCount: number, mistakeCount: number) => {
    playCompleteSound();
    const today = todayKey();
    patch({
      screen: 'complete',
      correctCount,
      mistakeCount,
      mistakeSteps: [],
      xp: state.xp + correctCount * 10,
      streak: nextStreak(state.lastActiveDate, state.streak, today),
      lastActiveDate: today,
    });
  };
  const failDialogueLesson = () => {
    playWrongSound();
    patch({ screen: 'failed' });
  };

  // Course lessons keep their own progress track (courseProgress, keyed by
  // subject id) rather than the currentUnitIndex/currentLessonIndex
  // frontier the static path uses, since the two are independent tracks —
  // see the courseFrontier comment in PathScreen.
  const completeCourseLesson = (correctCount: number, mistakeCount: number) => {
    playCompleteSound();
    // A practice run never touches courseProgress, XP, or streak — it's a
    // free replay of a lesson already cleared for real, so it goes straight
    // back to the practice hub instead of the celebratory Complete screen.
    if (state.practiceRun) {
      patch({ screen: 'progress', practiceRun: false });
      return;
    }
    const today = todayKey();
    const subjectId = state.activeCourseSubjectId;
    const lessonIndex = state.activeCourseLessonIndex;
    const prev = subjectId ? state.courseProgress[subjectId] : undefined;
    const courseProgress = subjectId
      ? {
          ...state.courseProgress,
          [subjectId]: {
            unlockedLessonIndex: Math.max(prev?.unlockedLessonIndex ?? 0, lessonIndex + 1),
            stars: { ...(prev?.stars ?? {}), [lessonIndex]: starsForMistakes(mistakeCount) },
          },
        }
      : state.courseProgress;
    if (subjectId && isSupabaseConfigured && session) {
      pushRemoteCourseProgress(session.user.id, subjectId, courseProgress[subjectId]);
    }
    patch({
      screen: 'complete',
      correctCount,
      mistakeCount,
      mistakeSteps: [],
      xp: state.xp + correctCount * 10,
      streak: nextStreak(state.lastActiveDate, state.streak, today),
      lastActiveDate: today,
      courseProgress,
    });
  };
  const failCourseLesson = () => {
    playWrongSound();
    patch({ screen: 'failed' });
  };

  const startReview = () => {
    if (state.mistakeSteps.length === 0) return;
    const queue = state.mistakeSteps;
    patch({ screen: 'lesson', reviewQueue: queue, stepIndex: queue[0], ...stepResetFields });
  };

  const retryLesson = () =>
    state.activeCourseSubjectId
      ? patch({ screen: 'courseLesson' })
      : patch({ screen: 'lesson', ...lessonResetFields });
  const exitFailedLesson = () => patch({ screen: state.practiceRun ? 'progress' : 'home', practiceRun: false });

  const selectTab = (screen: Screen) => patch({ screen });

  // A unit only counts as "done" once every lesson in it is cleared, so
  // finishing one lesson either advances to the next lesson in the same
  // unit or, on the last one, unlocks the next unit. Replaying an
  // already-cleared unit (review) never touches progress.
  const completeContinue = () => {
    if (state.activeCourseSubjectId) {
      // Each lesson is its own node on the path — always return to it after
      // finishing one, rather than auto-chaining into the next lesson, so
      // progress is visible and the next lesson is a deliberate tap.
      patch({ screen: 'home' });
      return;
    }
    if (!activeUnit) {
      patch({ screen: 'home' });
      return;
    }
    const unitIndex = UNITS.findIndex((u) => u.id === activeUnit.id);
    const isFrontier = unitIndex === state.currentUnitIndex;
    const isLastLessonInUnit = state.activeLessonIndex >= activeUnit.lessons.length - 1;
    if (!isFrontier) {
      patch({ screen: 'home' });
    } else if (isLastLessonInUnit) {
      patch({
        screen: 'home',
        currentUnitIndex: Math.min(state.currentUnitIndex + 1, UNITS.length),
        currentLessonIndex: 0,
        unitStars: { ...state.unitStars, [activeUnit.id]: starsForMistakes(state.mistakeCount) },
      });
    } else {
      patch({ screen: 'home', currentLessonIndex: state.activeLessonIndex + 1 });
    }
  };

  // Bottom excluded deliberately: screens with a full-bleed colored bottom
  // bar (feedback bar, ConfirmDialog) need to paint into the home-indicator
  // area themselves via useSafeAreaInsets, not have this reserve blank
  // white space there first — see CourseLessonScreen/DialogueLessonScreen.
  if (!loaded || !authChecked) return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <View style={styles.content}>
        {state.screen === 'auth' && <AuthScreen onClose={closeAuth} />}
        {state.screen === 'onboarding' && (
          <OnboardingScreen
            reason={state.reason}
            onSelectReason={setReason}
            goal={state.goal}
            onSelectGoal={setGoal}
            onStart={startOnboarding}
          />
        )}
        {state.screen === 'home' && (
          <PathScreen
            streak={state.streak}
            xp={state.xp}
            currentUnitIndex={state.currentUnitIndex}
            currentLessonIndex={state.currentLessonIndex}
            unitStars={state.unitStars}
            onOpenUnit={openUnit}
            courseSubjects={courseSubjects}
            courseProgress={state.courseProgress}
            onOpenCourseLesson={openCourseLesson}
          />
        )}
        {state.screen === 'unitIntro' && activeUnit && (
          <UnitIntroScreen unit={activeUnit} onContinue={continueFromUnitIntro} onClose={closeUnitIntro} />
        )}
        {pendingSubject && state.pendingCourseLesson && (
          <LessonSheet
            lessonTitle={lessonDisplayInfo(pendingSubject, state.pendingCourseLesson.lessonIndex).title}
            subjectRoman={pendingSubject.roman}
            Icon={lessonDisplayInfo(pendingSubject, state.pendingCourseLesson.lessonIndex).Icon}
            paletteIndex={courseSubjects.indexOf(pendingSubject) % PATH_PALETTE.length}
            isDone={state.pendingCourseLesson.lessonIndex < (state.courseProgress[pendingSubject.id]?.unlockedLessonIndex ?? 0)}
            stars={state.courseProgress[pendingSubject.id]?.stars?.[state.pendingCourseLesson.lessonIndex]}
            onStart={confirmStartCourseLesson}
            onClose={closeLessonSheet}
          />
        )}
        {state.screen === 'settings' && (
          <SettingsScreen
            goal={state.goal}
            onSelectGoal={setGoal}
            onSignIn={isSupabaseConfigured && !session ? openAuth : undefined}
            onSignOut={isSupabaseConfigured && session ? signOut : undefined}
          />
        )}
        {state.screen === 'progress' && (
          <ProgressScreen
            xp={state.xp}
            streak={state.streak}
            courseSubjects={courseSubjects}
            courseProgress={state.courseProgress}
            onSelectSubject={startCoursePractice}
          />
        )}
        {state.screen === 'words' && (
          <WordsReviewScreen courseSubjects={courseSubjects} courseProgress={state.courseProgress} />
        )}
        {state.screen === 'lesson' && activeVocabLesson && (
          <LessonScreen
            lesson={activeVocabLesson}
            state={state}
            onClose={closeLesson}
            onSelectMc1={selectMc1}
            onCheckMc1={checkMc1}
            onPlayMcSample1={playMcSample1}
            onSelectMc2={selectMc2}
            onCheckMc2={checkMc2}
            onPlayMcSample2={playMcSample2}
            onSelectMeaning1={selectMeaning1}
            onCheckMeaning1={checkMeaning1}
            onSelectMeaning2={selectMeaning2}
            onCheckMeaning2={checkMeaning2}
            onClickTile={clickTile}
            onPlayListen1={playListen1}
            onSelectListenScript1={selectListenScript1}
            onCheckListenScript1={checkListenScript1}
            onPlayListen2={playListen2}
            onSelectListenScript2={selectListenScript2}
            onCheckListenScript2={checkListenScript2}
            onStartSpeak={startSpeak}
            onPlaySpeakSample={playSpeakSample}
            onAddBank={addBankWord}
            onRemoveBank={removeBankWord}
            onCheckBank={checkBank}
            onContinue={continueStep}
          />
        )}
        {state.screen === 'lesson' && activeLesson && isDialogueLesson(activeLesson) && (
          <DialogueLessonScreen
            lesson={activeLesson}
            onClose={closeLesson}
            onComplete={completeDialogueLesson}
            onFail={failDialogueLesson}
          />
        )}
        {state.screen === 'courseLesson' && activeCourseLesson && !isDialogueCourseLesson(activeCourseLesson) && (
          <CourseLessonScreen
            lesson={activeCourseLesson}
            onClose={closeCourseLesson}
            onComplete={completeCourseLesson}
            onFail={failCourseLesson}
          />
        )}
        {state.screen === 'courseLesson' && activeCourseLesson && isDialogueCourseLesson(activeCourseLesson) && (
          <DialogueLessonScreen
            lesson={activeCourseLesson}
            onClose={closeCourseLesson}
            onComplete={completeCourseLesson}
            onFail={failCourseLesson}
          />
        )}
        {state.screen === 'complete' && (
          <CompleteScreen
            correctCount={state.correctCount}
            totalSteps={
              activeCourseLesson
                ? isDialogueCourseLesson(activeCourseLesson)
                  ? activeCourseLesson.steps.filter((s) => s.type !== 'intro').length
                  : activeCourseLesson.steps.filter((s) => s.type !== 'wordIntro' && s.type !== 'rule').length
                : activeLesson && isDialogueLesson(activeLesson)
                  ? activeLesson.steps.filter((s) => s.type !== 'intro').length
                  : STEP_LABELS.length
            }
            stars={starsForMistakes(state.mistakeCount)}
            xpEarned={state.correctCount * 10}
            streak={state.streak}
            hasMistakes={state.mistakeSteps.length > 0}
            onReviewMistakes={startReview}
            onContinue={completeContinue}
          />
        )}
        {state.screen === 'failed' && <FailedScreen onRetry={retryLesson} onExit={exitFailedLesson} />}
        </View>
        {TAB_SCREENS.includes(state.screen) && <BottomTabBar active={state.screen} onSelect={selectTab} backdrop={colors.white} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  shell: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: colors.white },
  content: { flex: 1 },
});
