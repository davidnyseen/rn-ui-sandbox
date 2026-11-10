import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { VocabLesson, WordItem, listenScriptOptions } from '../../data';
import { colors, fonts, radius, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { PlayIcon } from '../../components/icons';
import { PulseRing } from '../../components/PulseRing';

export function ListenStep({
  lesson,
  word,
  playing,
  selected,
  answered,
  onPlay,
  onSelect,
  onCheck,
}: {
  lesson: VocabLesson;
  word: WordItem;
  playing: boolean;
  selected: number | null;
  answered: boolean;
  onPlay: () => void;
  onSelect: (i: number) => void;
  onCheck: () => void;
}) {
  const options = listenScriptOptions(lesson, word);

  // Read the new word aloud as soon as it's introduced.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onPlay(); }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Listen, then pick the word you hear.</Text>
      <View style={styles.btnWrap}>
        <Pressable onPress={onPlay} style={styles.playBtn}>
          {playing && <PulseRing color={colors.accent} loop={false} duration={500} />}
          <PlayIcon size={30} color={colors.onAccent} />
        </Pressable>
      </View>
      {answered && (
        <View style={styles.reveal}>
          <Text style={styles.revealMeaning}>
            “{word.options.find((o) => o.correct)!.text}”
          </Text>
        </View>
      )}
      <View style={styles.options}>
        {options.map((o, i) => {
          let bg: string = colors.white;
          let border: string = colors.divider;
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
              <Text style={[styles.optionRoman, { color }]}>{o.roman}</Text>
              <Text style={[styles.optionThai, { color }]}>{o.thai}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.spacer} />
      {!answered && (
        <Button
          variant="secondary"
          block
          disabled={selected === null}
          onPress={onCheck}
          style={selected !== null ? styles.checkBtnSelected : undefined}
          labelColor={selected !== null ? colors.text : undefined}
        >
          Check
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1, minHeight: 12 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 24 },
  btnWrap: { alignItems: 'center', marginBottom: 20 },
  playBtn: {
    width: 72, height: 72, borderRadius: 9999, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  reveal: { alignItems: 'center', marginBottom: 20 },
  revealMeaning: { fontSize: 15, color: textMuted(0.55) },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  option: {
    width: '48%', paddingVertical: 16, paddingHorizontal: 10, minHeight: 68, borderWidth: 2, borderRadius: radius,
    alignItems: 'center', justifyContent: 'center',
  },
  optionRoman: { fontSize: 20, fontFamily: fonts.bodySemibold, textAlign: 'center' },
  optionThai: { fontSize: 13, opacity: 0.65, marginTop: 3, textAlign: 'center' },
  checkBtnSelected: { backgroundColor: colors.select100, borderColor: colors.select },
});
