import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { CheckIcon, XIcon } from './icons';
import { ButtonFlowers } from './ButtonFlowers';

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
  // ChatGPT's pass (2026-11-10): "Not quite" on its own line, so the red × reads as being about the picked answer,
  // and the right answer underneath with a small "Correct answer" label.
  const answer = !correct && text.startsWith('Correct answer: ') ? text.slice('Correct answer: '.length) : null;
  return (
    <View
      id="feedback-bar"
      style={[styles.bar, correct ? styles.barCorrect : styles.barWrong, { paddingBottom: 14 + bottomInset }]}
    >
      <View id="feedback-verdict" style={styles.verdict}>
        <View style={[styles.mark, correct ? styles.markCorrect : styles.markWrong]}>
          {correct ? <CheckIcon size={14} color={colors.white} strokeWidth={3.5} /> : <XIcon size={12} color={colors.white} strokeWidth={3.5} />}
        </View>
        <Text style={[styles.label, correct ? styles.labelCorrect : styles.labelWrong]}>{answer !== null ? 'Not quite' : text}</Text>
      </View>
      {answer !== null && (
        <View id="feedback-answer" style={styles.answerBlock}>
          <Text style={styles.answerLabel}>Correct answer</Text>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
      <Pressable onPress={onContinue} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <ButtonFlowers rightOnly />
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20, paddingTop: 14, marginHorizontal: -20, gap: 12,
    borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden',
  },
  barCorrect: { backgroundColor: colors.success100 },
  barWrong: { backgroundColor: colors.danger100 },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 22, height: 22, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  markCorrect: { backgroundColor: colors.success600 },
  markWrong: { backgroundColor: colors.danger600 },
  label: { flexShrink: 1, fontFamily: fonts.heading, fontSize: 17 },
  answerBlock: { marginTop: -4, gap: 1 },
  answerLabel: { fontFamily: fonts.bodySemibold, fontSize: 13, color: 'rgba(32,30,29,0.6)' },
  answerText: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  labelCorrect: { color: colors.success800 },
  labelWrong: { color: colors.danger800 },
  button: {
    width: '100%', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 9999,
    backgroundColor: colors.accent, borderBottomWidth: 3, borderBottomColor: colors.accent600,
    shadowColor: '#e6b000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 4,
  },
  buttonPressed: { backgroundColor: colors.accent600 },
  buttonText: { fontFamily: fonts.heading, fontSize: 17, color: colors.onAccent },
});
