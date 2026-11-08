import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, textMuted } from '../../theme';
import { PlayIcon } from '../../components/icons';

// A pronunciation/grammar rule screen — auto-plays (title + body) the
// moment it mounts, same as WordIntroStep, so the learner isn't stuck
// reaching for the play button just to hear a note that's already on
// screen. The button re-plays on demand afterward.
export function RuleStep({
  title,
  body,
  playing,
  onPlay,
}: {
  title: string;
  body: string;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Rule</Text>
      <Pressable style={styles.card} onPress={onPlay} accessibilityLabel="Read rule aloud">
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <Pressable
            onPress={(e) => { e.stopPropagation(); onPlay(); }}
            style={[styles.sampleBtn, playing && styles.sampleBtnActive]}
            accessibilityLabel="Read rule aloud"
          >
            <PlayIcon size={22} color={colors.onAccent} />
          </Pressable>
        </View>
        <Text style={styles.body}>{body}</Text>
      </Pressable>
      <View style={styles.spacer} />
      <Image source={require('../../../assets/redesign/card-art.png')} style={styles.footerArt} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 16 },
  spacer: { flex: 1, minHeight: 12 },
  // ChatGPT's 'improve' pass (2026-11-08): warm cream card, soft gold edge, the temple strip faint at its foot.
  card: {
    padding: 22, borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.45)', borderRadius: 22, backgroundColor: '#fffbf2',
    overflow: 'hidden', shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  // scenery along the bottom of the screen, above Continue — decoration only, the word is the thing to read
  footerArt: { width: '100%', height: 110, opacity: 0.5, marginBottom: -8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  title: { flex: 1, fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  sampleBtn: { width: 44, height: 44, borderRadius: 9999, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  sampleBtnActive: { backgroundColor: colors.accent600 },
  body: { fontSize: 17, lineHeight: 26, color: textMuted(0.8) },
});
