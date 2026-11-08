import { Image, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../theme';
import { Button } from '../components/Button';
import { FlameIcon, StarIcon } from '../components/icons';

export function CompleteScreen({
  correctCount,
  totalSteps,
  stars,
  xpEarned,
  streak,
  hasMistakes,
  onReviewMistakes,
  onContinue,
}: {
  correctCount: number;
  totalSteps: number;
  stars: number;
  xpEarned: number;
  streak: number;
  hasMistakes: boolean;
  onReviewMistakes: () => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Image source={require('../../assets/redesign/complete-art.png')} style={styles.art} resizeMode="contain" />
        <Text style={styles.title}>Nice work.</Text>
        <View style={styles.titleRule} />
        <View style={styles.stars}>
          {[1, 2, 3].map((i) => (
            <StarIcon key={i} size={36} color={colors.accent} filled={i <= stars} />
          ))}
        </View>
        <Text style={styles.subtitle}>
          Lesson complete — {correctCount} of {totalSteps} correct.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP earned</Text>
          </View>
          <View style={styles.statCell}>
            <View style={styles.streakValue}>
              <FlameIcon size={20} color={colors.accent700} />
              <Text style={styles.statValueText}>{streak}</Text>
            </View>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
        </View>
      </View>
      {hasMistakes && (
        <Button variant="secondary" block onPress={onReviewMistakes} style={styles.reviewBtn}>
          Review mistakes
        </Button>
      )}
      <Button variant="primary" block onPress={onContinue}>
        Back to path
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 24, backgroundColor: colors.white },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  art: { width: 220, height: 220, marginBottom: 8 },
  title: { fontFamily: fonts.heading, fontSize: 34, letterSpacing: -0.3, color: colors.text, marginBottom: 12, textAlign: 'center' },
  titleRule: { width: 44, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginTop: -4, marginBottom: 14 },
  stars: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  subtitle: { fontSize: 15, color: textMuted(0.6), marginBottom: 28, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  statCell: {
    flex: 1, alignItems: 'center', backgroundColor: colors.white, padding: 18, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)',
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  statValue: { fontFamily: fonts.heading, fontSize: 28, color: colors.accent700 },
  streakValue: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statValueText: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  statLabel: { fontSize: 12, color: textMuted(0.6), marginTop: 2 },
  reviewBtn: { marginBottom: 10 },
});
