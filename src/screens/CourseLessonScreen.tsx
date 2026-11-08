import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CourseVocabLesson, CourseStep } from '../courseTypes';
import { bankBuiltMatches } from '../data';
import { colors } from '../theme';
import { CloseIcon, HeartIcon } from '../components/icons';
import { Button } from '../components/Button';
import { FeedbackBar } from '../components/FeedbackBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MAX_MISTAKES } from '../lessonLogic';
import { SpeakState } from '../state';
import { speakThai, speakEnglish, stopSpeech } from '../tts';
import { playCorrectSound, playWrongSound } from '../audio';
import { matchesSpokenThai } from '../text';
import { isSpeechRecognitionAvailable, SpeechRecognitionModule, useSpeechRecognitionEvent } from '../stt';
import { McStep } from './steps/McStep';
import { BankStep } from './steps/BankStep';
import { SpeakStep } from './steps/SpeakStep';
import { WordIntroStep } from './steps/WordIntroStep';
import { RuleStep } from './steps/RuleStep';
import { ReplyStep } from './steps/ReplyStep';
import { MatchGameStep } from './steps/MatchGameStep';
import { ListenPickStep } from './steps/ListenPickStep';

// The step machine for DB-backed course subjects (src/courseTypes.ts) —
// same self-contained pattern as DialogueLessonScreen (own stepIndex/
// mistake/correct counters, own speech-recognition subscription) since step
// count and the mix of step types varies per lesson here too, unlike the
// fixed 10-step vocab lesson driven by RootApp/lessonLogic.ts. wordIntro and
// rule steps don't count as graded attempts — only translationChoice,
// sentenceOrder, and speak do.
export function CourseLessonScreen({
  lesson,
  onClose,
  onComplete,
  onFail,
}: {
  lesson: CourseVocabLesson;
  onClose: () => void;
  onComplete: (correctCount: number, mistakeCount: number) => void;
  onFail: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);

  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [mcAnswered, setMcAnswered] = useState(false);

  const [bankBuilt, setBankBuilt] = useState<string[]>([]);
  const [bankChecked, setBankChecked] = useState(false);

  const [rulePlaying, setRulePlaying] = useState(false);
  const [listenPlaying, setListenPlaying] = useState(false);

  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [matchSelected, setMatchSelected] = useState<string[]>([]);
  const [matchWrong, setMatchWrong] = useState<string[]>([]);
  const [matchJustMatched, setMatchJustMatched] = useState<number[]>([]);

  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const [speakHeardText, setSpeakHeardText] = useState<string | null>(null);
  const [speakCorrect, setSpeakCorrect] = useState(false);
  const speakTargetRef = useRef<string | null>(null);
  const speakFallbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSpeechRecognitionEvent('result', (event) => {
    const target = speakTargetRef.current;
    if (!target) return;
    // Any of the recogniser's top guesses counts (it often has the right phrase second, behind a near-homophone).
    const transcripts = event.results.map((r) => r.transcript).filter(Boolean);
    const transcript = transcripts[0] ?? '';
    const correct = transcripts.some((t) => matchesSpokenThai(t, target));
    (correct ? playCorrectSound : playWrongSound)();
    setSpeakHeardText(transcript);
    setSpeakCorrect(correct);
  });
  useSpeechRecognitionEvent('end', () => setSpeakState('done'));
  useSpeechRecognitionEvent('error', () => setSpeakState('idle'));

  const step: CourseStep = lesson.steps[stepIndex];

  const progressAnim = useRef(new Animated.Value(stepIndex / lesson.steps.length)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stepIndex / lesson.steps.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [stepIndex, progressAnim]);

  const resetStepUi = () => {
    // Cut off whatever the step being left was saying/playing — otherwise
    // it keeps going into the next step's own auto-play, which can be a
    // different voice (see stopSpeech's comment in tts.ts).
    stopSpeech();
    setMcSelected(null);
    setMcAnswered(false);
    setBankBuilt([]);
    setBankChecked(false);
    setRulePlaying(false);
    setListenPlaying(false);
    setSpeakState('idle');
    setSpeakHeardText(null);
    setSpeakCorrect(false);
    setMatchedPairs([]);
    setMatchSelected([]);
    setMatchWrong([]);
    setMatchJustMatched([]);
  };

  // wordIntro/rule steps are "free" — always answered, never graded — so
  // Continue and the feedback bar treat them uniformly with graded steps.
  const isFreeStep = step.type === 'wordIntro' || step.type === 'wordIntroGroup' || step.type === 'rule';
  // TEMPORARY: browser speech recognition is unreliable enough in this dev
  // setup (mic permissions, no real recognizer in some browsers) that speak
  // steps can leave the learner stuck with no way to continue — so on web,
  // skip straight past them instead of gating Continue on speakState.
  const speakSkippedOnWeb = step.type === 'speak' && Platform.OS === 'web';
  const currentAnswered =
    step.type === 'wordIntro' || step.type === 'wordIntroGroup' || step.type === 'rule'
      ? true
      : step.type === 'speak'
        ? speakSkippedOnWeb || speakState === 'done'
        : step.type === 'translationChoice' || step.type === 'reply' || step.type === 'listenChoice'
          ? mcAnswered
          : step.type === 'match'
            ? matchedPairs.length === step.pairs.length
            : bankChecked;
  const currentCorrect =
    step.type === 'translationChoice' || step.type === 'reply' || step.type === 'listenChoice'
      ? mcSelected !== null && !!step.options[mcSelected]?.correct
      : step.type === 'sentenceOrder'
        ? bankBuiltMatches(step.words, bankBuilt, step.correctOrder)
        : step.type === 'speak'
          ? speakSkippedOnWeb || speakCorrect
          : true;

  const feedbackText = (() => {
    if (step.type === 'speak') {
      if (speakSkippedOnWeb) return 'Skipped — voice practice isn\'t available in this browser';
      if (currentCorrect) return 'Nice pronunciation!';
      return speakHeardText ? `We heard "${speakHeardText}" — try again` : 'Try again';
    }
    if (step.type === 'translationChoice') {
      if (currentCorrect) return 'Correct!';
      return `Correct answer: ${step.options.find((o) => o.correct)?.text ?? ''}`;
    }
    if (step.type === 'reply') {
      if (currentCorrect) return 'Correct!';
      return `Correct reply: ${step.roman} (${step.english})`;
    }
    if (step.type === 'sentenceOrder') {
      if (currentCorrect) return 'Correct!';
      const order = step.correctOrder.map((k) => step.words[k].roman).join(' · ');
      return `Correct order: ${order}`;
    }
    if (step.type === 'match') return 'Nice matching!';
    if (step.type === 'listenChoice') {
      if (currentCorrect) return 'Correct!';
      return `You heard: ${step.roman}`;
    }
    return '';
  })();

  const onSelectMc = (i: number) => {
    if (mcAnswered) return;
    setMcSelected(i);
  };
  const onCheckMc = () => {
    if (
      mcAnswered ||
      mcSelected === null ||
      (step.type !== 'translationChoice' && step.type !== 'reply' && step.type !== 'listenChoice')
    )
      return;
    const isCorrect = step.options[mcSelected].correct;
    (isCorrect ? playCorrectSound : playWrongSound)();
    setMcAnswered(true);
    if (!isCorrect) setMistakeCount((m) => m + 1);
  };
  const onPlayListen = () => {
    if (step.type !== 'listenChoice' || listenPlaying) return;
    setListenPlaying(true);
    speakThai(step.thai, () => setListenPlaying(false));
  };
  const onPlaySampleThai = () => {
    if (step.type === 'translationChoice') speakThai(step.thai);
    else if (step.type === 'speak') speakThai(step.thai);
  };
  const onPlayWordIntroWord = (i: number, onDone?: () => void) => {
    if (step.type === 'wordIntro') speakThai(step.word.thai, onDone);
    else if (step.type === 'wordIntroGroup') speakThai(step.words[i].thai, onDone);
  };
  const onPlayReplyLine = (i: number, onDone?: () => void) => {
    if (step.type === 'reply') speakThai(step.context[i].thai, onDone, step.context[i].speaker);
  };
  const onPlayReplyOption = (i: number) => {
    if (step.type === 'reply') speakThai(step.options[i].thai, undefined, step.replySpeaker);
  };
  const onPlayReplyEnglish = () => {
    if (step.type === 'reply') speakEnglish(step.english);
  };

  const onAddBank = (key: string) => {
    if (step.type !== 'sentenceOrder' || bankBuilt.length >= step.correctOrder.length || bankBuilt.includes(key)) return;
    speakThai(step.words[key].thai);
    setBankBuilt([...bankBuilt, key]);
  };
  const onRemoveBank = (key: string) => {
    if (bankChecked) return;
    setBankBuilt(bankBuilt.filter((k) => k !== key));
  };
  const onCheckBank = () => {
    if (bankChecked || step.type !== 'sentenceOrder' || bankBuilt.length < step.correctOrder.length) return;
    const isCorrect = bankBuiltMatches(step.words, bankBuilt, step.correctOrder);
    (isCorrect ? playCorrectSound : playWrongSound)();
    setBankChecked(true);
    if (!isCorrect) setMistakeCount((m) => m + 1);
  };

  const onClickMatchTile = (tileKey: string, pairId: number) => {
    if (step.type !== 'match') return;
    if (matchedPairs.includes(pairId) || matchWrong.length) return;
    if (matchSelected.includes(tileKey)) return;
    const kind = tileKey.startsWith('th-') ? 'th' : 'en';
    if (kind === 'th') speakThai(step.pairs[pairId].thai);
    if (matchSelected.length === 0) {
      setMatchSelected([tileKey]);
      return;
    }
    const firstKey = matchSelected[0];
    const firstKind = firstKey.startsWith('th-') ? 'th' : 'en';
    if (firstKind === kind) {
      // Tapped another tile in the same column — switch the pending pick
      // instead of treating it as a failed match attempt.
      setMatchSelected([tileKey]);
      return;
    }
    const firstPairId = Number(firstKey.split('-')[1]);
    if (firstPairId === pairId) {
      playCorrectSound();
      setMatchedPairs([...matchedPairs, pairId]);
      setMatchSelected([]);
      setMatchJustMatched([...matchJustMatched, pairId]);
      setTimeout(() => {
        setMatchJustMatched((prev) => prev.filter((id) => id !== pairId));
      }, 1000);
    } else {
      playWrongSound();
      const wrongKeys = [firstKey, tileKey];
      setMatchSelected(wrongKeys);
      setMatchWrong(wrongKeys);
      setTimeout(() => {
        setMatchSelected([]);
        setMatchWrong([]);
      }, 650);
    }
  };

  const onPlayRule = () => {
    if (step.type !== 'rule' || rulePlaying) return;
    setRulePlaying(true);
    speakEnglish(`${step.title}. ${step.body}`, () => setRulePlaying(false));
  };

  // Rule steps read themselves aloud the moment they're shown, same as a
  // word-intro card — the learner shouldn't have to reach for the play
  // button just to hear a grammar note that's on screen either way.
  useEffect(() => {
    if (step.type === 'rule') onPlayRule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const startSpeak = async () => {
    if (step.type !== 'speak') return;
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
    speakTargetRef.current = step.thai;
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
      // contextualStrings tells the recogniser which phrase to expect (a big help with learners' accents);
      // maxAlternatives gives the matcher its top few guesses instead of only the first.
      SpeechRecognitionModule.start({
        lang: 'th-TH', interimResults: false, continuous: false, maxAlternatives: 5, contextualStrings: [step.thai],
      });
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

  const handleContinue = () => {
    if (isFreeStep) {
      setStepIndex(stepIndex + 1);
      resetStepUi();
      return;
    }
    if (!currentAnswered) return;
    // Hearts are deducted immediately on a wrong Check (see onCheckMc/
    // onCheckBank) — mistakeCount is already up to date by the time
    // Continue is pressed, so this just decides whether that was the
    // lesson-ending mistake. Speak/match steps never route through those
    // handlers, so they still never cost a heart.
    const cc = correctCount + (currentCorrect ? 1 : 0);
    setCorrectCount(cc);
    if (mistakeCount >= MAX_MISTAKES) {
      onFail();
      return;
    }
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      resetStepUi();
    } else {
      onComplete(cc, mistakeCount);
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
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {step.type === 'wordIntro' && <WordIntroStep key={stepIndex} words={[step.word]} onPlayWord={onPlayWordIntroWord} />}
        {step.type === 'wordIntroGroup' && <WordIntroStep key={stepIndex} words={step.words} onPlayWord={onPlayWordIntroWord} />}
        {step.type === 'rule' && <RuleStep key={stepIndex} title={step.title} body={step.body} playing={rulePlaying} onPlay={onPlayRule} />}
        {step.type === 'translationChoice' && (
          <McStep
            key={stepIndex}
            word={{ roman: step.roman, thai: step.parts.join(' '), options: step.options }}
            selected={mcSelected}
            answered={mcAnswered}
            onSelect={onSelectMc}
            onCheck={onCheckMc}
            onPlaySample={onPlaySampleThai}
          />
        )}
        {step.type === 'sentenceOrder' && (
          <BankStep
            key={stepIndex}
            bank={{ prompt: step.prompt, words: step.words, poolOrder: step.poolOrder, correctOrder: step.correctOrder }}
            built={bankBuilt}
            checked={bankChecked}
            onAdd={onAddBank}
            onRemove={onRemoveBank}
            onCheck={onCheckBank}
          />
        )}
        {step.type === 'speak' && (
          <SpeakStep
            key={stepIndex}
            speak={{ roman: step.roman, thai: step.parts.join(' '), meaning: step.meaning }}
            speakState={speakState}
            correct={speakCorrect}
            onStart={startSpeak}
            onPlaySample={onPlaySampleThai}
          />
        )}
        {step.type === 'match' && (
          <MatchGameStep
            key={stepIndex}
            pairs={step.pairs}
            matchedPairs={matchedPairs}
            matchJustMatched={matchJustMatched}
            matchSelected={matchSelected}
            matchWrong={matchWrong}
            onClickTile={onClickMatchTile}
          />
        )}
        {step.type === 'reply' && (
          <ReplyStep
            key={stepIndex}
            context={step.context}
            replySpeaker={step.replySpeaker}
            english={step.english}
            options={step.options}
            selected={mcSelected}
            answered={mcAnswered}
            onSelect={onSelectMc}
            onCheck={onCheckMc}
            onPlayLine={onPlayReplyLine}
            onPlayOption={onPlayReplyOption}
            onPlayEnglish={onPlayReplyEnglish}
          />
        )}
        {step.type === 'listenChoice' && (
          <ListenPickStep
            key={stepIndex}
            meaning={step.meaning}
            options={step.options}
            playing={listenPlaying}
            selected={mcSelected}
            answered={mcAnswered}
            onPlay={onPlayListen}
            onSelect={onSelectMc}
            onCheck={onCheckMc}
          />
        )}
      </ScrollView>
      {isFreeStep ? (
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
