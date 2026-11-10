import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, textMuted } from '../../theme';
import { Button } from '../../components/Button';
import { AnswerOption } from '../../components/AnswerOption';
import { PlayIcon } from '../../components/icons';
import { PulseRing } from '../../components/PulseRing';

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
        {options.map((o, i) => (
          <AnswerOption
            key={i}
            label={o.roman}
            sub={o.thai}
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
});
