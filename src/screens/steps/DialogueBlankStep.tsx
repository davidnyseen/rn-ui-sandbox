import { Text, View, StyleSheet } from 'react-native';
import { DialogueOption } from '../../data';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { AnswerOption } from '../../components/AnswerOption';

export function DialogueBlankStep({
  before,
  after,
  options,
  selected,
  answered,
  onSelect,
  onCheck,
}: {
  before: string;
  after: string;
  options: DialogueOption[];
  selected: number | null;
  answered: boolean;
  onSelect: (i: number) => void;
  onCheck: () => void;
}) {
  const selectedOption = selected !== null ? options[selected] : null;
  // Reveal what the correct word actually means once checked — options here
  // are romanized Thai (unlike comprehension/translate, which show English
  // already), so without this, picking correctly teaches nothing beyond
  // matching a memorized shape.
  const correctOption = options.find((o) => o.correct);
  const revealMeaning = answered ? correctOption?.meaning : null;
  // Same empty-slot -> filled-chip pattern as BankStep's word-order build:
  // a dashed slot until something's picked, then select/success/danger
  // colors depending on check state.
  const blankStyle = !selectedOption
    ? styles.blankEmpty
    : !answered
      ? styles.blankSelected
      : selectedOption.correct
        ? styles.blankCorrect
        : styles.blankWrong;
  const blankTextStyle = !selectedOption
    ? styles.blankEmptyText
    : !answered
      ? styles.blankSelectedText
      : selectedOption.correct
        ? styles.blankCorrectText
        : styles.blankWrongText;

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Tap the missing word.</Text>
      <View style={styles.sentenceRow}>
        {before ? <Text style={styles.sentence}>{before}</Text> : null}
        <View style={[styles.blank, blankStyle]}>
          <Text style={[styles.blankText, blankTextStyle]}>{selectedOption ? selectedOption.text : ' '}</Text>
        </View>
        {after ? <Text style={styles.sentence}>{after}</Text> : null}
      </View>
      {revealMeaning && (
        <Text style={styles.meaning}>
          {correctOption!.text} = {revealMeaning}
        </Text>
      )}
      <View style={styles.options}>
        {options.map((o, i) => (
          <AnswerOption
            key={i}
            label={o.text}
            chip
            selected={i === selected}
            answered={answered}
            correct={o.correct}
            onPress={() => onSelect(i)}
          />
        ))}
      </View>
      <View style={styles.spacer} />
      {!answered && (
        <Button variant="secondary" block disabled={selected === null} onPress={onCheck}>
          Check
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 20 },
  spacer: { flex: 1, minHeight: 12 },
  sentenceRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 28 },
  sentence: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 32, color: colors.text },
  meaning: { fontSize: 14, color: textMuted(0.55), marginTop: -20, marginBottom: 16 },
  blank: { minWidth: 64, height: 40, paddingHorizontal: 12, borderWidth: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  blankText: { fontFamily: fonts.bodySemibold, fontSize: 16 },
  blankEmpty: { borderStyle: 'dashed', borderColor: colors.neutral300, backgroundColor: 'transparent' },
  blankEmptyText: { color: colors.neutral500 },
  blankSelected: { backgroundColor: colors.select100, borderColor: colors.select },
  blankSelectedText: { color: colors.text },
  blankCorrect: { backgroundColor: colors.success100, borderColor: colors.success600 },
  blankCorrectText: { color: colors.success800 },
  blankWrong: { backgroundColor: colors.danger100, borderColor: colors.danger600 },
  blankWrongText: { color: colors.danger800 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
});
