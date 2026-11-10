import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DialogueStep, dialogueStepOptions } from '../data';

// Structural, not imported from data.ts — both the legacy hand-authored
// DialogueLesson and courseTypes.ts's CourseDialogueLesson satisfy this
// shape, so this screen renders either without caring which content system
// it came from.
interface DialogueLessonLike {
  title: string;
  scene: string;
  lines: { speaker: string; thai: string; roman: string; english: string }[];
  steps: DialogueStep[];
}
import { colors } from '../theme';
import { CloseIcon, HeartIcon } from '../components/icons';
import { Button } from '../components/Button';
import { FeedbackBar } from '../components/FeedbackBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MAX_MISTAKES } from '../lessonLogic';
import { SpeakState } from '../state';
import { speakThai, stopSpeech } from '../tts';
import { playCorrectSound, playWrongSound } from '../audio';
import { matchesSpokenThai } from '../text';
import { isSpeechRecognitionAvailable, SpeechRecognitionModule, useSpeechRecognitionEvent } from '../stt';
import { McStep } from './steps/McStep';
import { ListenChoiceStep } from './steps/ListenChoiceStep';
import { SpeakStep } from './steps/SpeakStep';
import { DialogueIntroStep } from './steps/DialogueIntroStep';
import { DialogueBlankStep } from './steps/DialogueBlankStep';

// A dialogue lesson's own step machine — separate from the fixed 10-step
// vocab lesson in LessonScreen/lessonLogic.ts, since step count and step
// types vary per lesson here. Runs its own speech-recognition subscription
// for the "speak" steps rather than sharing RootApp's (which is scoped to
// vocab lessons — see activeVocabLesson there).
export function DialogueLessonScreen({
  lesson,
  onClose,
  onComplete,
  onFail,
}: {
  lesson: DialogueLessonLike;
  onClose: () => void;
  onComplete: (correctCount: number, mistakeCount: number) => void;
  onFail: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [listenPlaying, setListenPlaying] = useState(false);
  const [introPlayingIndex, setIntroPlayingIndex] = useState<number | null>(null);

  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const [speakHeardText, setSpeakHeardText] = useState<string | null>(null);
  const [speakCorrect, setSpeakCorrect] = useState(false);
  const speakTargetRef = useRef<string | null>(null);
  const speakFallbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSpeechRecognitionEvent('result', (event) => {
    const target = speakTargetRef.current;
    if (!target) return;
    const transcript = event.results[0]?.transcript ?? '';
    const correct = matchesSpokenThai(transcript, target);
    (correct ? playCorrectSound : playWrongSound)();
    setSpeakHeardText(transcript);
    setSpeakCorrect(correct);
  });
  useSpeechRecognitionEvent('end', () => setSpeakState('done'));
  useSpeechRecognitionEvent('error', () => setSpeakState('idle'));

  const step: DialogueStep = lesson.steps[stepIndex];
  const line = step.type !== 'intro' ? lesson.lines[step.lineIndex] : null;

  const progressAnim = useRef(new Animated.Value(stepIndex / lesson.steps.length)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stepIndex / lesson.steps.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [stepIndex, progressAnim]);

  // Leaving the lesson (X, or finishing) mid-clip mustn't leave it talking over the next screen.
  useEffect(() => () => stopSpeech(), []);

  const resetStepUi = () => {
    // Cut off whatever the step being left was saying/playing — otherwise
    // it keeps going into the next step's own auto-play, which can be a
    // different voice (see stopSpeech's comment in tts.ts).
    stopSpeech();
    setSelected(null);
    setAnswered(false);
    setListenPlaying(false);
    setSpeakState('idle');
    setSpeakHeardText(null);
    setSpeakCorrect(false);
  };

  const onSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };
  const onCheck = () => {
    if (answered || selected === null) return;
    const options = dialogueStepOptions(step);
    if (!options) return;
    (options[selected].correct ? playCorrectSound : playWrongSound)();
    setAnswered(true);
  };

  const onPlayLine = () => {
    if (!line || listenPlaying) return;
    setListenPlaying(true);
    speakThai(line.thai, () => setListenPlaying(false));
  };
  const onPlaySampleLine = () => {
    if (line) speakThai(line.thai);
  };
  const onPlayIntroLine = (i: number) => {
    if (introPlayingIndex !== null) return;
    setIntroPlayingIndex(i);
    speakThai(lesson.lines[i].thai, () => setIntroPlayingIndex(null));
  };

  const startSpeak = async () => {
    if (!line) return;
    if (speakState === 'recording') {
      if (speakFallbackTimeout.current) {
        clearTimeout(speakFallbackTimeout.current);
        speakFallbackTimeout.current = null;
        playCorrectSound();
        setSpeakState('done');
      } else if (isSpeechRecognitionAvailable && SpeechRecognitionModule) {
        SpeechRecognitionModule.stop();
      }
      return;
    }
    // Allow retrying after a failed attempt — only a correct 'done' locks
    // the mic (SpeakStep disables the button in that case).
    if (speakState !== 'idle' && !(speakState === 'done' && !speakCorrect)) return;
    speakTargetRef.current = line.thai;
    if (!isSpeechRecognitionAvailable || !SpeechRecognitionModule) {
      setSpeakState('recording');
      setSpeakHeardText(null);
      setSpeakCorrect(true);
      speakFallbackTimeout.current = setTimeout(() => {
        speakFallbackTimeout.current = null;
        playCorrectSound();
        setSpeakState('done');
      }, 1100);
      return;
    }
    const permission = await SpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) return;
    setSpeakState('recording');
    setSpeakHeardText(null);
    setSpeakCorrect(false);
    try {
      SpeechRecognitionModule.start({ lang: 'th-TH', interimResults: false, continuous: false });
    } catch {
      // The module loaded but the browser has no real speech recognizer to
      // back it (e.g. Safari, which never implemented the Web Speech API) —
      // `new SpeechRecognition()` throws synchronously in that case. Fall
      // back to the same ungraded "pass after a beat" behavior used when
      // the module isn't available at all, rather than leaving the mic
      // stuck in a 'recording' state forever with no events ever firing.
      setSpeakHeardText(null);
      setSpeakCorrect(true);
      speakFallbackTimeout.current = setTimeout(() => {
        speakFallbackTimeout.current = null;
        playCorrectSound();
        setSpeakState('done');
      }, 1100);
    }
  };

  // TEMPORARY: see CourseLessonScreen.tsx's speakSkippedOnWeb — same
  // browser speech-recognition workaround, applied here too since dialogue
  // capstone lessons also end in speak steps.
  const speakSkippedOnWeb = step.type === 'speak' && Platform.OS === 'web';
  const currentAnswered = step.type === 'intro' ? true : step.type === 'speak' ? speakSkippedOnWeb || speakState === 'done' : answered;
  const stepOptions = dialogueStepOptions(step);
  const currentCorrect =
    step.type === 'intro'
      ? true
      : step.type === 'speak'
        ? speakSkippedOnWeb || speakCorrect
        : selected !== null && !!stepOptions?.[selected].correct;

  const feedbackText = (() => {
    if (step.type === 'speak') {
      if (speakSkippedOnWeb) return 'Skipped — voice practice isn\'t available in this browser';
      if (currentCorrect) return 'Nice pronunciation!';
      return speakHeardText ? `We heard "${speakHeardText}" — try again` : 'Try again';
    }
    if (currentCorrect) return 'Correct!';
    const correctText = stepOptions?.find((o) => o.correct)?.text ?? '';
    return `Correct answer: ${correctText}`;
  })();

  const handleContinue = () => {
    if (step.type === 'intro') {
      setStepIndex(stepIndex + 1);
      resetStepUi();
      return;
    }
    if (!currentAnswered) return;
    // Speech recognition is unreliable enough (mic permissions, accents,
    // background noise) that a "wrong" here is often the recognizer's fault,
    // not the learner's — so speak steps never cost a heart.
    const missedGraded = !currentCorrect && step.type !== 'speak';
    const cc = correctCount + (currentCorrect ? 1 : 0);
    const mistakes = mistakeCount + (missedGraded ? 1 : 0);
    setCorrectCount(cc);
    setMistakeCount(mistakes);
    if (missedGraded && mistakes >= MAX_MISTAKES) {
      onFail();
      return;
    }
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      resetStepUi();
    } else {
      onComplete(cc, mistakes);
    }
  };

  const heartsLeft = MAX_MISTAKES - mistakeCount;

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={() => setConfirmQuit(true)} style={styles.closeBtn} accessibilityLabel="Close">
          <CloseIcon size={26} color={colors.text} />
        </Pressable>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
        <View style={styles.hearts}>
          {Array.from({ length: MAX_MISTAKES }, (_, i) => (
            <HeartIcon key={i} size={24} color={colors.accent} filled={i < heartsLeft} />
          ))}
        </View>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {step.type === 'intro' && <DialogueIntroStep lesson={lesson} onPlayLine={onPlayIntroLine} />}
        {step.type === 'comprehension' && line && (
          <ListenChoiceStep
            key={stepIndex}
            word={{ roman: line.roman, thai: line.thai, options: step.options }}
            playing={listenPlaying}
            selected={selected}
            answered={answered}
            onPlay={onPlayLine}
            onSelect={onSelect}
            onCheck={onCheck}
          />
        )}
        {step.type === 'translate' && line && (
          <McStep
            key={stepIndex}
            word={{ roman: line.roman, thai: line.thai, options: step.options }}
            selected={selected}
            answered={answered}
            onSelect={onSelect}
            onCheck={onCheck}
            onPlaySample={onPlaySampleLine}
          />
        )}
        {step.type === 'blank' && (
          <DialogueBlankStep
            key={stepIndex}
            before={step.before}
            after={step.after}
            options={step.options}
            selected={selected}
            answered={answered}
            onSelect={onSelect}
            onCheck={onCheck}
          />
        )}
        {step.type === 'speak' && line && (
          <SpeakStep
            key={stepIndex}
            speak={{ roman: line.roman, thai: line.thai, meaning: line.english }}
            speakState={speakState}
            correct={speakCorrect}
            onStart={startSpeak}
            onPlaySample={onPlaySampleLine}
          />
        )}
      </ScrollView>
      {step.type === 'intro' ? (
        <View style={[styles.introContinueWrap, { paddingBottom: 24 + insets.bottom }]}>
          <Button variant="primary" block onPress={handleContinue}>
            Continue
          </Button>
        </View>
      ) : (
        currentAnswered && (
          <FeedbackBar correct={currentCorrect} text={feedbackText} bottomInset={insets.bottom} onContinue={handleContinue} />
        )
      )}
      {confirmQuit && (
        <ConfirmDialog
          title="Quit this lesson?"
          body="Your progress on this attempt won't be saved."
          confirmLabel="Quit"
          cancelLabel="Keep going"
          onConfirm={onClose}
          onCancel={() => setConfirmQuit(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 56, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 10, borderRadius: 9999, backgroundColor: colors.neutral200, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 9999, backgroundColor: colors.accent },
  hearts: { flexDirection: 'row', gap: 3 },
  body: { flex: 1 },
  bodyContent: { flexGrow: 1, paddingBottom: 24 },
  introContinueWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, marginHorizontal: -20 },
});
