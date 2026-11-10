import { Image, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../theme';
import { Button } from '../components/Button';
import { StarIcon } from '../components/icons';

// ChatGPT's own art for this screen (2026-11-10, user: "use their icons"): the cheering elephant, laurel sprigs
// beside the stars, a sparkle on the XP card and a flame on the streak card.
const ELEPHANT = require('../../assets/redesign/complete-elephant.png');
const LAUREL = require('../../assets/redesign/laurel.png');
const FLAME = require('../../assets/redesign/flame.png');
const SPARKLE = require('../../assets/redesign/sparkle-burst.png');

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
        <Image source={ELEPHANT} style={styles.art} resizeMode="contain" />
        <Text style={styles.title}>Nice work.</Text>
        <View style={styles.titleRule} />
        <View id="star-row" style={styles.stars}>
          <Image source={LAUREL} style={[styles.laurel, styles.laurelLeft]} resizeMode="contain" />
          {[1, 2, 3].map((i) => (
            <StarIcon key={i} size={36} color={colors.accent} filled={i <= stars} />
          ))}
          <Image source={LAUREL} style={[styles.laurel, styles.laurelRight]} resizeMode="contain" />
        </View>
        <Text style={styles.subtitle}>
          Lesson complete — {correctCount} of {totalSteps} correct.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Image source={SPARKLE} style={styles.sparkle} resizeMode="contain" />
            <Text style={styles.statValue}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP earned</Text>
          </View>
          <View style={styles.statCell}>
            <View style={styles.streakValue}>
              <Image source={FLAME} style={styles.flame} resizeMode="contain" />
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
  art: { width: 240, height: 203, marginBottom: 12 },
  title: { fontFamily: fonts.heading, fontSize: 34, letterSpacing: -0.3, color: colors.text, marginBottom: 12, textAlign: 'center' },
  titleRule: { width: 44, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginTop: -4, marginBottom: 14 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  laurel: { width: 34, height: 34, opacity: 0.9 },
  laurelLeft: { marginRight: 6, transform: [{ scaleX: -1 }] }, // the sprig is drawn leaning right; mirror it on the left
  laurelRight: { marginLeft: 6 },
  sparkle: { position: 'absolute', top: 10, left: 22, width: 26, height: 17 },
  flame: { width: 22, height: 26 },
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
