import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { PlayIcon } from '../../components/icons';
import { PulseRing } from '../../components/PulseRing';
import { AnswerMark } from '../../components/AnswerMark';

// Thai audio plays first, no text shown, and the learner picks the matching
// sentence — by ear — out of a few already-taught candidates (see
// ListenChoiceStep in courseTypes.ts). Options show roman + thai (not
// English), since the point is distinguishing what was said, not
// translating it — same option shape/coloring as McStep, just a different
// prompt (a play button instead of printed Thai).
export function ListenPickStep({
  meaning,
  options,
  playing,
  selected,
  answered,
  onPlay,
  onSelect,
  onCheck,
}: {
  meaning: string;
  options: { thai: string; roman: string; correct: boolean }[];
  playing: boolean;
  selected: number | null;
  answered: boolean;
  onPlay: () => void;
  onSelect: (i: number) => void;
  onCheck: () => void;
}) {
  // Read the target sentence aloud as soon as the step is shown, same as
  // every other new-content step (wordIntro, mc, reply).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onPlay(); }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Listen, then pick what you hear.</Text>
      <View style={styles.btnWrap}>
        <Pressable onPress={onPlay} style={styles.playBtn} accessibilityLabel="Play audio">
          {playing && <PulseRing color={colors.accent} loop={false} duration={500} />}
          <PlayIcon size={30} color={colors.onAccent} />
        </Pressable>
      </View>
      {answered && (
        <View style={styles.reveal}>
          <Text style={styles.revealMeaning}>“{meaning}”</Text>
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
              <View style={styles.optionText}>
                <Text style={[styles.optionRoman, { color }]}>{o.roman}</Text>
                <Text style={[styles.optionThai, { color }]}>{o.thai}</Text>
              </View>
              {answered && (o.correct || i === selected) && <AnswerMark right={o.correct} />}
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
  spacer: { flex: 1, minHeight: 12 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 24 },
  btnWrap: { alignItems: 'center', marginBottom: 20 },
  playBtn: {
    width: 72, height: 72, borderRadius: 9999, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  reveal: { alignItems: 'center', marginBottom: 20 },
  revealMeaning: { fontSize: 15, color: textMuted(0.55) },
  options: { gap: 8, marginBottom: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, paddingHorizontal: 16, minHeight: 56, borderWidth: 1.5, borderRadius: 14,
  },
  optionText: { flex: 1 },
  optionRoman: { fontSize: 16, fontFamily: fonts.bodySemibold },
  optionThai: { fontSize: 14, opacity: 0.7, marginTop: 2 },
});
