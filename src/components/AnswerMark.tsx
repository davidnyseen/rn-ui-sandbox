import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { CheckIcon, XIcon } from './icons';

// The small filled ✓ / × circle at the right end of an answer card after Check — the chat step's answer cards
// (ChatGPT's pass, 2026-11-10), reused on the other choice screens so all answers read the same way.
export function AnswerMark({ right }: { right: boolean }) {
  return (
    <View style={[styles.mark, { backgroundColor: right ? colors.success600 : colors.danger600 }]}>
      {right ? <CheckIcon size={13} color={colors.white} strokeWidth={3.5} /> : <XIcon size={11} color={colors.white} strokeWidth={3.5} />}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { width: 24, height: 24, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
