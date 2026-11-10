import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { WordItem } from '../../data';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { AnswerOption } from '../../components/AnswerOption';
import { PlayIcon } from '../../components/icons';
import { PulseRing } from '../../components/PulseRing';

export function ListenChoiceStep({
  word,
  playing,
  selected,
  answered,
  onPlay,
  onSelect,
  onCheck,
}: {
  word: WordItem;
  playing: boolean;
  selected: number | null;
  answered: boolean;
  onPlay: () => void;
  onSelect: (i: number) => void;
  onCheck: () => void;
}) {
  const options = word.options;

  // Read the new word/sentence aloud as soon as it's introduced.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onPlay(); }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Listen, then pick what it means.</Text>
      <View style={styles.btnWrap}>
        <Pressable onPress={onPlay} style={styles.playBtn}>
          {playing && <PulseRing color={colors.accent} loop={false} duration={500} />}
          <PlayIcon size={30} color={colors.onAccent} />
        </Pressable>
      </View>
      {answered && (
        <View style={styles.reveal}>
          <Text style={styles.revealRoman}>{word.roman}</Text>
          <Text style={styles.revealThai}>{word.thai}</Text>
        </View>
      )}
      <View style={styles.options}>
        {options.map((o, i) => (
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
        <Button variant="secondary" block disabled={selected === null} onPress={onCheck}>
          Check
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1, minHeight: 12 },
  instruction: { fontSize: 15, color: textMuted(0.6), marginBottom: 24 },
  btnWrap: { alignItems: 'center', marginBottom: 20 },
  playBtn: {
    width: 84, height: 84, borderRadius: 9999, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#e6b000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 22, elevation: 6,
  },
  reveal: { alignItems: 'center', marginBottom: 20 },
  revealRoman: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  revealThai: { fontSize: 16, color: textMuted(0.55), marginTop: 2 },
  options: { gap: 8, marginBottom: 12 },
});
