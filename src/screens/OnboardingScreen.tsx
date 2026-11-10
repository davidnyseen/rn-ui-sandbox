import { ComponentType, useState } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { GOALS, REASONS, Reason } from '../data';
import { colors, fonts, radius, textMuted } from '../theme';
import { Button } from '../components/Button';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  DotsIcon,
  GraduationCapIcon,
  IconProps,
  MusicIcon,
  PlaneIcon,
  UsersIcon,
} from '../components/icons';

const REASON_ICONS: Record<Reason, ComponentType<IconProps>> = {
  travel: PlaneIcon,
  school: GraduationCapIcon,
  work: BriefcaseIcon,
  family: UsersIcon,
  hobby: MusicIcon,
  other: DotsIcon,
};

type Step = 'reason' | 'goal';
// The "why are you learning Thai?" step is off for the MVP: everyone starts at the same lesson, so the answer changed
// nothing (user, 2026-11-10). Flip to true to bring it back, e.g. once it picks a starting topic.
const ASK_REASON = false;

export function OnboardingScreen({
  reason,
  onSelectReason,
  goal,
  onSelectGoal,
  onStart,
}: {
  reason: Reason | null;
  onSelectReason: (v: Reason) => void;
  goal: number;
  onSelectGoal: (v: number) => void;
  onStart: () => void;
}) {
  const [step, setStep] = useState<Step>(ASK_REASON ? 'reason' : 'goal');

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        {step === 'goal' && ASK_REASON ? (
          <Pressable onPress={() => setStep('reason')} style={styles.backBtn} accessibilityLabel="Back">
            <ArrowLeftIcon size={22} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        {ASK_REASON && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: step === 'reason' ? '50%' : '100%' }]} />
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {step === 'reason' ? (
          <>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>Why are you learning Thai?</Text>
            </View>
            <Text style={styles.subtitle}>Choose what best matches your reason.</Text>
            <View style={styles.chips}>
              {REASONS.map((r) => {
                const Icon = REASON_ICONS[r.id];
                const selected = reason === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => onSelectReason(r.id)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <View style={[styles.chipIcon, selected && styles.chipIconSelected]}>
                      {selected ? <CheckIcon size={15} color={colors.onAccent} /> : <Icon size={16} color={colors.accent700} />}
                    </View>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>Set a daily goal.</Text>
            </View>
            <Text style={styles.subtitle}>How much time can you commit each day?</Text>
            <View style={styles.grid}>
              {GOALS.map((g) => {
                const selected = goal === g.minutes;
                return (
                  <Pressable
                    key={g.minutes}
                    onPress={() => onSelectGoal(g.minutes)}
                    style={[styles.card, selected && styles.cardSelected]}
                  >
                    <Text style={[styles.cardPace, selected && styles.cardPaceSelected]}>{g.pace}</Text>
                    <Text style={[styles.cardNum, selected && styles.cardNumSelected]}>{g.minutes}</Text>
                    <Text style={styles.cardUnit}>min / day</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {step === 'reason' ? (
        <Button
          variant="primary"
          block
          disabled={reason === null}
          onPress={() => setStep('goal')}
          icon={<ArrowRightIcon color={colors.onAccent} />}
        >
          Next
        </Button>
      ) : (
        <Button variant="primary" block onPress={onStart} icon={<ArrowRightIcon color={colors.onAccent} />}>
          Get started
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 8, borderRadius: 9999, backgroundColor: colors.neutral200, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 9999, backgroundColor: colors.accent },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  questionCard: { backgroundColor: colors.accent100, borderRadius: 22, padding: 22, marginBottom: 20 },
  questionText: { fontFamily: fonts.heading, fontSize: 26, lineHeight: 30, color: colors.onAccent },
  subtitle: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), marginBottom: 24 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingLeft: 10, paddingRight: 16,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)', backgroundColor: colors.white, borderRadius: 18,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  chipIcon: { width: 32, height: 32, borderRadius: 9999, backgroundColor: colors.accent100, alignItems: 'center', justifyContent: 'center' },
  chipIconSelected: { backgroundColor: colors.white },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipText: { fontFamily: fonts.bodySemibold, fontSize: 15, color: colors.text },
  chipTextSelected: { color: colors.onAccent },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%', padding: 18, borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)', backgroundColor: colors.white, borderRadius: 20,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  cardSelected: { borderColor: colors.accent, backgroundColor: colors.accent100 },
  cardPace: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', color: textMuted(0.5), marginBottom: 4 },
  cardPaceSelected: { color: colors.accent700 },
  cardNum: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  cardNumSelected: { color: colors.accent800 },
  cardUnit: { fontSize: 12, color: textMuted(0.7), marginTop: 2 },
});
