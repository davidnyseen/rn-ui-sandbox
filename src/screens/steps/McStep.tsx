import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { WordItem } from '../../data';
import { colors, fonts, radius, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { CheckIcon, PlayIcon } from '../../components/icons';
import { AnswerMark } from '../../components/AnswerMark';

// One word stays big; a whole sentence shrinks so it doesn't fill the screen (user, 2026-11-10: "isn't text a bit big").
function romanSize(roman: string) {
  if (roman.length <= 14) return { fontSize: 44, lineHeight: 46 };
  if (roman.length <= 28) return { fontSize: 32, lineHeight: 36 };
  return { fontSize: 26, lineHeight: 31 };
}

export function McStep({
  word,
  selected,
  answered,
  onSelect,
  onCheck,
  onPlaySample,
}: {
  word: WordItem;
  selected: number | null;
  answered: boolean;
  onSelect: (i: number) => void;
  onCheck: () => void;
  onPlaySample: () => void;
}) {
  // Read the new word/sentence aloud as soon as it's introduced.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onPlaySample(); }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Choose one option.</Text>
      <View style={styles.headerRow}>
        <Pressable onPress={onPlaySample} style={styles.sampleBtn} accessibilityLabel="Hear pronunciation">
          <PlayIcon size={26} color={colors.accent700} />
        </Pressable>
        <Pressable onPress={onPlaySample} style={styles.headerText} accessibilityLabel="Hear pronunciation">
          <Text style={[styles.roman, romanSize(word.roman)]}>{word.roman}</Text>
          <Text style={styles.thai}>{word.thai}</Text>
        </Pressable>
      </View>
      <View style={styles.options}>
        {word.options.map((o, i) => {
          let bg: string = colors.white;
          let border: string = 'rgba(32,30,29,0.14)';
          let color: string = colors.text;
          let opacity = 1;
          if (answered) {
            if (o.correct) {
              bg = colors.success100; border = colors.success600;
            } else if (i === selected) {
              bg = colors.danger100; border = colors.danger600;
            }
          } else if (i === selected) {
            bg = colors.select100; border = colors.select; color = colors.text;
          }
          return (
            <Pressable
              key={i}
              disabled={answered}
              onPress={() => onSelect(i)}
              style={[styles.option, { backgroundColor: bg, borderColor: border, opacity }]}
            >
              <Text style={[styles.optionText, { color }]}>{o.text}</Text>
              {answered && (o.correct || i === selected) && <AnswerMark right={o.correct} />}
              {!answered && i === selected && (
                <View style={styles.tick}><CheckIcon size={13} color={colors.white} strokeWidth={3.5} /></View>
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.spacer} />
      {!answered && (
        <Button variant={selected === null ? 'secondary' : 'primary'} block disabled={selected === null} onPress={onCheck}>
          Check
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 16 },
  spacer: { flex: 1, minHeight: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerText: { flex: 1 },
  sampleBtn: {
    width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.accent100,
  },
  roman: { fontFamily: fonts.heading, fontSize: 44, lineHeight: 46, color: colors.text, marginBottom: 6 },
  thai: { fontSize: 20, color: textMuted(0.55), marginBottom: 32 },
  options: { gap: 8, marginBottom: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    paddingVertical: 14, paddingHorizontal: 16, minHeight: 56, borderWidth: 1.5, borderRadius: 14,
  },
  tick: { width: 22, height: 22, borderRadius: 9999, backgroundColor: colors.accent700, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, fontSize: 17, fontFamily: fonts.bodySemibold },
});
