import { useEffect } from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { SpeakItem } from '../../data';
import { colors, fonts, textMuted } from '../../theme';
import { MicIcon, PlayIcon } from '../../components/icons';
import { phraseSize } from '../../lib/phraseSize';
import { PulseRing } from '../../components/PulseRing';
import { RecordingWaveform } from '../../components/RecordingWaveform';
import { SpeakState } from '../../state';

export function SpeakStep({
  speak,
  speakState,
  correct,
  onStart,
  onPlaySample,
}: {
  speak: SpeakItem;
  speakState: SpeakState;
  correct: boolean;
  onStart: () => void;
  onPlaySample: () => void;
}) {
  // Read the new phrase aloud as soon as it's introduced.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onPlaySample(); }, []);

  // Mirrors the same correct/wrong check the feedback bar below uses — this
  // status line must never disagree with it (e.g. showing "Nice
  // pronunciation!" while the bar says "Try again" because recognition
  // ended with no transcript to grade).
  const statusText =
    speakState === 'idle'
      ? 'Tap to record'
      : speakState === 'recording'
        ? 'Tap to stop'
        : correct
          ? 'Nice pronunciation!'
          : 'Try again';

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>Listen, then tap the mic and say it.</Text>
      <View style={styles.headerRow}>
        <Pressable onPress={onPlaySample} style={styles.sampleBtn} accessibilityLabel="Hear pronunciation">
          <PlayIcon size={26} color={colors.accent700} />
        </Pressable>
        <Pressable onPress={onPlaySample} style={styles.headerText} accessibilityLabel="Hear pronunciation">
          <Text style={[styles.roman, phraseSize(speak.roman)]}>{speak.roman}</Text>
          <Text style={styles.thai}>{speak.thai}</Text>
        </Pressable>
      </View>
      <Text style={styles.meaning}>“{speak.meaning}”</Text>
      <View style={styles.controls}>
        <Pressable
          onPress={onStart}
          disabled={speakState === 'done' && correct}
          style={[styles.micBtn, speakState === 'done' && correct && styles.micBtnDone]}
        >
          {speakState === 'recording' && <PulseRing color={colors.accent} duration={1000} />}
          <MicIcon size={30} color={speakState === 'done' && correct ? colors.white : colors.onAccent} />
        </Pressable>
        {speakState === 'recording' ? (
          <RecordingWaveform color={colors.accent700} />
        ) : (
          <Text style={styles.status}>{statusText}</Text>
        )}
      </View>
      <View style={styles.spacer} />
      <Image source={require('../../../assets/redesign/card-art.png')} style={styles.footerArt} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1, minHeight: 12 },
  // scenery along the bottom of the screen, above Continue (as in ChatGPT's version of this page)
  footerArt: { width: '100%', height: 110, opacity: 0.5, marginBottom: -8 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerText: { flex: 1 },
  sampleBtn: {
    width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.accent100,
  },
  roman: { fontFamily: fonts.heading, fontSize: 36, lineHeight: 40, color: colors.text, marginBottom: 6 },
  thai: { fontSize: 18, color: textMuted(0.55), marginBottom: 8 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 16 },
  meaning: { fontSize: 16, fontFamily: fonts.bodySemibold, color: colors.text, marginTop: 8, marginBottom: 36 },
  controls: { alignItems: 'center', gap: 14 },
  micBtn: {
    width: 96, height: 96, borderRadius: 9999, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#e6b000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 22, elevation: 6,
  },
  micBtnDone: { backgroundColor: colors.accent800 },
  status: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.neutral600 },
});
