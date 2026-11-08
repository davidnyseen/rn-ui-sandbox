import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { CheckIcon, ChevronRightIcon, XIcon } from './icons';

// The "Correct!" / "Correct answer: …" bar that slides up after Check — ChatGPT's 'improve' pass (2026-11-08) on the
// user's phone screenshot: rounded top corners, the verdict with a tick or cross in a coloured circle, a faint lotus,
// and the app's yellow pill Continue (green/red stay in the bar's tint and the verdict, not the button).
export function FeedbackBar({
  correct,
  text,
  bottomInset,
  onContinue,
}: {
  correct: boolean;
  text: string;
  bottomInset: number;
  onContinue: () => void;
}) {
  return (
    <View
      id="feedback-bar"
      style={[styles.bar, correct ? styles.barCorrect : styles.barWrong, { paddingBottom: 24 + bottomInset }]}
    >
      <Image source={require('../../assets/redesign/lotus.png')} style={styles.lotus} resizeMode="contain" />
      <View id="feedback-verdict" style={styles.verdict}>
        <View style={[styles.mark, correct ? styles.markCorrect : styles.markWrong]}>
          {correct ? <CheckIcon size={14} color={colors.white} strokeWidth={3.5} /> : <XIcon size={12} color={colors.white} strokeWidth={3.5} />}
        </View>
        <Text style={[styles.label, correct ? styles.labelCorrect : styles.labelWrong]}>{text}</Text>
      </View>
      <Pressable onPress={onContinue} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Image source={require('../../assets/redesign/lotus.png')} style={styles.buttonFlower} resizeMode="contain" />
        <Text style={styles.buttonText}>Continue</Text>
        <View style={styles.chevron}><ChevronRightIcon size={18} color={colors.onAccent} /></View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20, paddingTop: 20, marginHorizontal: -20, gap: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden',
  },
  barCorrect: { backgroundColor: colors.success100 },
  barWrong: { backgroundColor: colors.danger100 },
  lotus: { position: 'absolute', right: 20, top: 12, width: 48, height: 32, opacity: 0.3 },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 56 },
  mark: { width: 26, height: 26, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  markCorrect: { backgroundColor: colors.success600 },
  markWrong: { backgroundColor: colors.danger600 },
  label: { flexShrink: 1, fontFamily: fonts.heading, fontSize: 18 },
  labelCorrect: { color: colors.success800 },
  labelWrong: { color: colors.danger800 },
  button: {
    width: '100%', paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 9999,
    backgroundColor: colors.accent,
    shadowColor: '#e6b000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 4,
  },
  buttonPressed: { backgroundColor: colors.accent600 },
  buttonText: { fontFamily: fonts.heading, fontSize: 17, color: colors.onAccent },
  chevron: { position: 'absolute', right: 22 },
  buttonFlower: { position: 'absolute', left: 18, width: 30, height: 20, tintColor: colors.white, opacity: 0.9 },
});
