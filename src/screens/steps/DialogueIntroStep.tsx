import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { PlayIcon } from '../../components/icons';

// Structural, not DialogueLesson from data.ts — courseTypes.ts's
// CourseDialogueLesson satisfies this shape too, so this step renders
// either without caring which content system it came from.
interface DialogueIntroLesson {
  scene: string;
  lines: { speaker: string; thai: string; roman: string; english: string }[];
}

export function DialogueIntroStep({
  lesson,
  onPlayLine,
}: {
  lesson: DialogueIntroLesson;
  onPlayLine: (lineIndex: number) => void;
}) {
  const firstSpeaker = lesson.lines[0]?.speaker;

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Read the conversation — tap a line to hear it.</Text>
      <View id="dialogue-scene" style={styles.sceneWrap}>
        <Text style={styles.scene}>{lesson.scene}</Text>
        <Image source={require('../../../assets/redesign/lotus.png')} style={styles.sceneLotus} resizeMode="contain" />
      </View>
      <View style={styles.sceneRule} />
      <View style={styles.lines}>
        {lesson.lines.map((line, i) => {
          const isRight = line.speaker !== firstSpeaker;
          return (
            <Pressable
              key={i}
              onPress={() => onPlayLine(i)}
              style={[styles.bubbleRow, isRight && styles.bubbleRowRight]}
            >
              <View style={[styles.bubble, isRight ? styles.bubbleRight : styles.bubbleLeft]}>
                <View style={[styles.tail, isRight ? styles.tailRight : styles.tailLeft]} />
                <View style={styles.bubbleHeader}>
                  <Text style={[styles.speaker, isRight && styles.textOnAccentMuted]}>{line.speaker}</Text>
                  <PlayIcon size={16} color={isRight ? colors.onAccent : colors.accent600} />
                </View>
                <Text style={[styles.roman, isRight && styles.textOnAccent]}>{line.roman}</Text>
                <Text style={[styles.thai, isRight && styles.textOnAccentMuted]}>{line.thai}</Text>
                <Text style={[styles.english, isRight && styles.textOnAccentMuted]}>{line.english}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  instruction: { fontSize: 15, color: textMuted(0.6), marginBottom: 4 },
  // ChatGPT's version (shared by the user 2026-11-08): the scene line in gold with a lotus and a soft gold rule under
  // it; bubbles with little tails; a warm, softer yellow for the second speaker.
  sceneWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  scene: { flex: 1, fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.accent700 },
  sceneLotus: { width: 34, height: 23, opacity: 0.7, marginTop: -6 },
  sceneRule: { width: '70%', height: 2, borderRadius: 1, backgroundColor: 'rgba(230,176,0,0.35)', marginTop: 10, marginBottom: 20 },
  tail: { position: 'absolute', bottom: -6, width: 12, height: 12, borderWidth: 1.5, borderTopWidth: 0, borderLeftWidth: 0, transform: [{ rotate: '45deg' }] },
  tailLeft: { left: 16, backgroundColor: colors.white, borderColor: 'rgba(32,30,29,0.12)' },
  tailRight: { right: 16, backgroundColor: '#ffd84a', borderColor: '#f2c230' },
  lines: { gap: 16 },
  bubbleRow: { flexDirection: 'row' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  // ChatGPT's 'improve' pass (2026-11-08): soft rounded bubbles with a light shadow instead of hard outlines
  bubble: { maxWidth: '82%', padding: 14, borderWidth: 1.5, borderRadius: 18, shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1, },
  bubbleLeft: { backgroundColor: colors.white, borderColor: 'rgba(32,30,29,0.12)' },
  bubbleRight: { backgroundColor: '#ffd84a', borderColor: '#f2c230' },
  bubbleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 10 },
  speaker: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: textMuted(0.5) },
  roman: { fontFamily: fonts.bodySemibold, fontSize: 17, color: colors.text },
  thai: { fontSize: 14, color: textMuted(0.55), marginTop: 1 },
  english: { fontSize: 12, color: textMuted(0.45), marginTop: 4 },
  textOnAccent: { color: colors.onAccent },
  textOnAccentMuted: { color: colors.onAccent, opacity: 0.7 },
});
