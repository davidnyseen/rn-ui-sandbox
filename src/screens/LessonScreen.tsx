import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { STEP_LABELS, VocabLesson } from '../data';
import { colors, fonts, radius } from '../theme';
import { CloseIcon, HeartIcon } from '../components/icons';
import { AppState } from '../state';
import { feedbackLabel, MAX_MISTAKES, stepStatus } from '../lessonLogic';
import { McStep } from './steps/McStep';
import { ListenChoiceStep } from './steps/ListenChoiceStep';
import { MatchStep } from './steps/MatchStep';
import { ListenStep } from './steps/ListenStep';
import { SpeakStep } from './steps/SpeakStep';
import { BankStep } from './steps/BankStep';

export function LessonScreen({
  lesson,
  state,
  onClose,
  onSelectMc1,
  onCheckMc1,
  onPlayMcSample1,
  onSelectMc2,
  onCheckMc2,
  onPlayMcSample2,
  onSelectMeaning1,
  onCheckMeaning1,
  onSelectMeaning2,
  onCheckMeaning2,
  onClickTile,
  onPlayListen1,
  onSelectListenScript1,
  onCheckListenScript1,
  onPlayListen2,
  onSelectListenScript2,
  onCheckListenScript2,
  onStartSpeak,
  onPlaySpeakSample,
  onAddBank,
  onRemoveBank,
  onCheckBank,
  onContinue,
}: {
  lesson: VocabLesson;
  state: AppState;
  onClose: () => void;
  onSelectMc1: (i: number) => void;
  onCheckMc1: () => void;
  onPlayMcSample1: () => void;
  onSelectMc2: (i: number) => void;
  onCheckMc2: () => void;
  onPlayMcSample2: () => void;
  onSelectMeaning1: (i: number) => void;
  onCheckMeaning1: () => void;
  onSelectMeaning2: (i: number) => void;
  onCheckMeaning2: () => void;
  onClickTile: (tileKey: string, pairId: number) => void;
  onPlayListen1: () => void;
  onSelectListenScript1: (i: number) => void;
  onCheckListenScript1: () => void;
  onPlayListen2: () => void;
  onSelectListenScript2: (i: number) => void;
  onCheckListenScript2: () => void;
  onStartSpeak: () => void;
  onPlaySpeakSample: () => void;
  onAddBank: (key: string) => void;
  onRemoveBank: (key: string) => void;
  onCheckBank: () => void;
  onContinue: () => void;
}) {
  const { answered, correct } = stepStatus(state, lesson);
  const heartsLeft = MAX_MISTAKES - state.mistakeCount;
  const [word1, word2] = lesson.words;

  const progressAnim = useRef(new Animated.Value(state.stepIndex / STEP_LABELS.length)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: state.stepIndex / STEP_LABELS.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [state.stepIndex, progressAnim]);

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
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
        {state.stepIndex === 0 && (
          <McStep
            word={word1}
            selected={state.mc1Selected}
            answered={state.mc1Answered}
            onSelect={onSelectMc1}
            onCheck={onCheckMc1}
            onPlaySample={onPlayMcSample1}
          />
        )}
        {state.stepIndex === 1 && (
          <ListenStep
            lesson={lesson}
            word={word1}
            playing={state.listenPlaying}
            selected={state.listenScript1Selected}
            answered={state.listenScript1Answered}
            onPlay={onPlayListen1}
            onSelect={onSelectListenScript1}
            onCheck={onCheckListenScript1}
          />
        )}
        {state.stepIndex === 2 && (
          <ListenChoiceStep
            word={word1}
            playing={state.listenPlaying}
            selected={state.meaning1Selected}
            answered={state.meaning1Answered}
            onPlay={onPlayListen1}
            onSelect={onSelectMeaning1}
            onCheck={onCheckMeaning1}
          />
        )}
        {state.stepIndex === 3 && (
          <McStep
            word={word2}
            selected={state.mc2Selected}
            answered={state.mc2Answered}
            onSelect={onSelectMc2}
            onCheck={onCheckMc2}
            onPlaySample={onPlayMcSample2}
          />
        )}
        {state.stepIndex === 4 && (
          <ListenStep
            lesson={lesson}
            word={word2}
            playing={state.listenPlaying}
            selected={state.listenScript2Selected}
            answered={state.listenScript2Answered}
            onPlay={onPlayListen2}
            onSelect={onSelectListenScript2}
            onCheck={onCheckListenScript2}
          />
        )}
        {state.stepIndex === 5 && (
          <ListenChoiceStep
            word={word2}
            playing={state.listenPlaying}
            selected={state.meaning2Selected}
            answered={state.meaning2Answered}
            onPlay={onPlayListen2}
            onSelect={onSelectMeaning2}
            onCheck={onCheckMeaning2}
          />
        )}
        {state.stepIndex === 6 && (
          <MatchStep
            tiles={lesson.tiles}
            matchedPairs={state.matchedPairs}
            matchSelected={state.matchSelected}
            matchWrong={state.matchWrong}
            onClickTile={onClickTile}
          />
        )}
        {(state.stepIndex === 7 || state.stepIndex === 8) && (
          <SpeakStep
            key={state.stepIndex}
            speak={lesson.speak[state.stepIndex === 7 ? 0 : 1]}
            speakState={state.speakState}
            correct={state.speakCorrect}
            onStart={onStartSpeak}
            onPlaySample={onPlaySpeakSample}
          />
        )}
        {state.stepIndex === 9 && (
          <BankStep
            bank={lesson.bank}
            built={state.bankBuilt}
            checked={state.bankChecked}
            onAdd={onAddBank}
            onRemove={onRemoveBank}
            onCheck={onCheckBank}
          />
        )}
      </ScrollView>
      {answered && (
        <View style={[styles.feedbackBar, correct ? styles.feedbackBarCorrect : styles.feedbackBarWrong]}>
          <Text style={[styles.feedbackLabel, correct ? styles.feedbackLabelCorrect : styles.feedbackLabelWrong]}>
            {feedbackLabel(state, lesson, correct)}
          </Text>
          <Pressable
            onPress={onContinue}
            style={[styles.continueBtn, correct ? styles.continueBtnCorrect : styles.continueBtnWrong]}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>
        </View>
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
  feedbackBar: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, marginHorizontal: -20,
    borderTopWidth: 2, borderTopColor: colors.divider, gap: 12,
  },
  feedbackBarCorrect: { backgroundColor: colors.success100 },
  feedbackBarWrong: { backgroundColor: colors.danger100 },
  feedbackLabel: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  feedbackLabelCorrect: { color: colors.success800 },
  feedbackLabelWrong: { color: colors.danger800 },
  continueBtn: { width: '100%', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.text, borderRadius: radius },
  continueBtnCorrect: { backgroundColor: colors.success },
  continueBtnWrong: { backgroundColor: colors.danger },
  continueBtnText: { fontFamily: fonts.heading, fontSize: 14, color: colors.white },
});
