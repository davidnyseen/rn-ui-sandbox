import { Image, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { ChatBubble, Speaker } from '../../components/ChatBubble';

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
  const genderOf = speakerGenders(lesson.lines);

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Read the conversation — tap a line to hear it.</Text>
      <View id="dialogue-scene" style={styles.sceneWrap}>
        <Text style={styles.scene}>{lesson.scene}</Text>
        <Image source={require('../../../assets/redesign/lotus.png')} style={styles.sceneLotus} resizeMode="contain" />
      </View>
      <View style={styles.sceneRule} />
      <View style={styles.lines}>
        {lesson.lines.map((line, i) => (
          <ChatBubble
            key={i}
            speaker={genderOf[line.speaker] ?? 'F'}
            eyebrow={line.roman}
            main={line.thai}
            sub={line.english}
            onPress={() => onPlayLine(i)}
          />
        ))}
      </View>
    </View>
  );
}

// Conversation lines are written with speakers "A" / "B"; show each as a man or a woman instead, from the polite
// particle or pronoun they use (ครับ / ผม = man, ค่ะ / คะ / ฉัน = woman). If a speaker never says one, A is a woman and
// B a man, so the two still look different.
function speakerGenders(lines: { speaker: string; thai: string }[]): Record<string, Speaker> {
  const out: Record<string, Speaker> = {};
  for (const l of lines) {
    if (out[l.speaker]) continue;
    if (/ครับ|ผม/.test(l.thai)) out[l.speaker] = 'M';
    else if (/ค่ะ|คะ|ฉัน/.test(l.thai)) out[l.speaker] = 'F';
  }
  const ids = [...new Set(lines.map((l) => l.speaker))];
  ids.forEach((id, i) => {
    if (!out[id]) {
      const other = ids.find((x) => x !== id && out[x]);
      out[id] = other ? (out[other] === 'M' ? 'F' : 'M') : i === 0 ? 'F' : 'M';
    }
  });
  return out;
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
  lines: { gap: 10 },
});
