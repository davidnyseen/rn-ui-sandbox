import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { MaleIcon, FemaleIcon, PlayIcon } from './icons';

// The one chat bubble for every conversation in the app — the chat-reply step and the conversation lessons' intro
// (user, 2026-11-10: "use one component everywhere"). Soft tinted bubble with dark text (ChatGPT's pass) and a ♂/♀
// badge on the speaker's side, so who's talking is shown rather than labelled "A" / "B".
//
// Content: an optional small line on top (romanization) with the sound icon, the main line, and an optional small
// line under it (the English). With no `eyebrow`, the sound icon sits beside the main line instead.

export type Speaker = 'M' | 'F';

export const speakerColor = (speaker: Speaker) => (speaker === 'M' ? colors.maleSpeaker : colors.pink);
export const bubbleTint = (speaker: Speaker) => (speaker === 'M' ? '#dde9fc' : '#fce3ec');
const MUTED = 'rgba(32,30,29,0.6)';

export function SpeakerBadge({ speaker }: { speaker: Speaker }) {
  return (
    <View style={[styles.badge, { backgroundColor: speakerColor(speaker) }]}>
      {speaker === 'M' ? <MaleIcon size={15} color={colors.white} /> : <FemaleIcon size={15} color={colors.white} />}
    </View>
  );
}

export function ChatBubble({
  speaker,
  eyebrow,
  main,
  sub,
  onPress,
}: {
  speaker: Speaker;
  eyebrow?: string;
  main: string;
  sub?: string;
  onPress: () => void;
}) {
  const isRight = speaker === 'M';
  const sound = (
    <View style={styles.noShrink}>
      <PlayIcon size={14} color={MUTED} />
    </View>
  );
  return (
    <View id="chat-bubble-row" style={[styles.row, isRight ? styles.rowRight : styles.rowLeft]}>
      {!isRight && <SpeakerBadge speaker={speaker} />}
      <Pressable onPress={onPress} style={[styles.bubble, { backgroundColor: bubbleTint(speaker) }]}>
        {eyebrow ? (
          <>
            {/* the text shrinks and wraps; the icon never gets pushed out of the bubble */}
            <View style={styles.top}>
              <Text style={[styles.eyebrow, styles.shrink]}>{eyebrow}</Text>
              {sound}
            </View>
            <Text style={styles.main}>{main}</Text>
          </>
        ) : (
          <View style={styles.top}>
            <Text style={[styles.mainPlain, styles.shrink]}>{main}</Text>
            {sound}
          </View>
        )}
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </Pressable>
      {isRight && <SpeakerBadge speaker={speaker} />}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { width: 28, height: 28, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '74%', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 15, gap: 2 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shrink: { flexShrink: 1 },
  noShrink: { flexShrink: 0 },
  eyebrow: { fontFamily: fonts.bodySemibold, fontSize: 13, color: MUTED },
  main: { fontSize: 18, color: colors.text, fontFamily: fonts.bodySemibold },
  mainPlain: { fontSize: 16, color: colors.text, fontFamily: fonts.bodySemibold },
  sub: { fontSize: 12, color: MUTED, marginTop: 1 },
});
