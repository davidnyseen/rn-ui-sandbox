import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { WordItem } from '../../data';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';
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
        {options.map((o, i) => {
          let bg: string = colors.white;
          let border: string = 'rgba(32,30,29,0.14)';
          let color: string = colors.text;
          let opacity = 1;
          if (answered) {
            if (o.correct) {
              bg = colors.success100; border = colors.success600; color = colors.success800;
            } else if (i === selected) {
              bg = colors.danger100; border = colors.danger600; color = colors.danger800;
            } else {
              opacity = 0.4;
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
            </Pressable>
          );
        })}
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
  options: { gap: 10, marginBottom: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    padding: 18, minHeight: 58, borderWidth: 1.5, borderRadius: 18, shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  optionText: { fontSize: 17, fontFamily: fonts.bodySemibold },
});
