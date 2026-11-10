import { ReactNode } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../theme';
import { CheckIcon, XIcon } from './icons';

// The one answer card every choice screen uses (multiple choice, listening, conversation questions, fill-in-the-blank,
// the chat reply) — ChatGPT's answer-card pass (2026-11-10). Its look and its idle / picked / right / wrong states live
// only here, so the screens can't drift apart again (user: "use one component everywhere").
//
// Content, top to bottom: an optional small line (`eyebrow`, e.g. romanization + sound icon), the main text, and an
// optional small line under it (`sub`). `leading` sits at the left behind a thin divider (the chat's speaker badge).
// `chip` makes it hug its text, for answers laid out in a wrapping row.
export function AnswerOption({
  label,
  sub,
  eyebrow,
  leading,
  big = false,
  chip = false,
  selected,
  answered,
  correct,
  pickedTint,
  onPress,
}: {
  label: string;
  sub?: string;
  eyebrow?: ReactNode;
  leading?: ReactNode;
  /** Thai script as the main text: larger and bolder than an English answer. */
  big?: boolean;
  chip?: boolean;
  selected: boolean;
  answered: boolean;
  correct: boolean;
  /** Background/border while picked but not yet checked; defaults to the app's yellow. */
  pickedTint?: { bg: string; border: string };
  onPress: () => void;
}) {
  const mark = answered && (correct || selected) ? (correct ? 'right' : 'wrong') : null;
  let bg: string = colors.white;
  let border: string = 'rgba(32,30,29,0.14)';
  if (mark === 'right') { bg = colors.success100; border = colors.success600; }
  else if (mark === 'wrong') { bg = colors.danger100; border = colors.danger600; }
  else if (!answered && selected) { bg = pickedTint?.bg ?? colors.select100; border = pickedTint?.border ?? colors.select; }

  return (
    <Pressable
      id="answer-option"
      disabled={answered}
      onPress={onPress}
      style={[styles.card, chip && styles.chip, leading ? styles.withLeading : null, { backgroundColor: bg, borderColor: border }]}
    >
      {leading}
      {leading && <View style={styles.divider} />}
      <View style={chip ? null : styles.text}>
        {eyebrow}
        <Text style={big ? styles.labelBig : styles.label}>{label}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      {mark && (
        <View style={[styles.mark, { backgroundColor: mark === 'right' ? colors.success600 : colors.danger600 }]}>
          {mark === 'right' ? <CheckIcon size={13} color={colors.white} strokeWidth={3.5} /> : <XIcon size={11} color={colors.white} strokeWidth={3.5} />}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56,
    paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1.5, borderRadius: 14,
  },
  chip: { minHeight: 0, alignSelf: 'flex-start', paddingHorizontal: 18 },
  withLeading: { paddingVertical: 8, paddingLeft: 8, paddingRight: 12 },
  divider: { width: 1, alignSelf: 'stretch', marginVertical: -8, backgroundColor: 'rgba(32,30,29,0.12)' },
  text: { flex: 1, gap: 1 },
  label: { fontSize: 17, fontFamily: fonts.bodySemibold, color: colors.text },
  labelBig: { fontSize: 18, fontFamily: fonts.bodySemibold, color: colors.text },
  sub: { fontSize: 14, color: textMuted(0.6), marginTop: 1 },
  mark: { width: 24, height: 24, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
