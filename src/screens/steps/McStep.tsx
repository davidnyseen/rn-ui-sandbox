import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { WordItem } from '../../data';
import { colors, fonts, radius, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { AnswerOption } from '../../components/AnswerOption';
import { PlayIcon } from '../../components/icons';
import { phraseSize } from '../../lib/phraseSize';

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
          <Text style={[styles.roman, phraseSize(word.roman)]}>{word.roman}</Text>
          <Text style={styles.thai}>{word.thai}</Text>
        </Pressable>
      </View>
      <View style={styles.options}>
        {word.options.map((o, i) => (
          <AnswerOption
            key={i}
            label={o.text}
            selected={i === selected}
            answered={answered}
            correct={o.correct}
            onPress={() => onSelect(i)}
          />
        ))}
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
});
