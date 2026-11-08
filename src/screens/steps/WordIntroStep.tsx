import { useEffect } from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { CourseWord } from '../../courseTypes';
import { colors, fonts, textMuted } from '../../theme';
import { PlayIcon } from '../../components/icons';

// Teaches one or two new words/phrases before they're ever tested — reads
// each aloud in turn (word 0, then word 1) as soon as they're shown, same
// auto-play convention as McStep/SpeakStep, so a lesson's opening run of
// these functions like a vocab preview. A pair shares one screen (one card
// each, one Continue) instead of forcing two separate taps for words
// naturally taught together — a watchdog timeout keeps the sequence moving
// even if a given word's audio never calls back.
export function WordIntroStep({
  words,
  onPlayWord,
}: {
  words: CourseWord[];
  onPlayWord: (i: number, onDone?: () => void) => void;
}) {
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const playFrom = (i: number) => {
      if (cancelled || i >= words.length) return;
      let fired = false;
      const next = () => {
        if (fired || cancelled) return;
        fired = true;
        playFrom(i + 1);
      };
      timers.push(setTimeout(next, 3500));
      onPlayWord(i, next);
    };
    playFrom(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compact = words.length > 1;

  return (
    <View style={styles.screen}>
      <Text style={styles.instruction}>{compact ? 'New words' : 'New word'}</Text>
      <View style={compact && styles.cards}>
        {words.map((word, i) => (
          <View key={i} style={[styles.card, compact && styles.cardCompact]}>
            <Pressable onPress={() => onPlayWord(i)} style={[styles.sampleBtn, compact && styles.sampleBtnCompact]} accessibilityLabel="Hear pronunciation">
              <PlayIcon size={compact ? 22 : 30} color={colors.onAccent} />
            </Pressable>
            <Pressable onPress={() => onPlayWord(i)} accessibilityLabel="Hear pronunciation">
              <Text style={[styles.thai, compact && styles.thaiCompact]}>{word.thai}</Text>
              <Text style={[styles.roman, compact && styles.romanCompact]}>{word.roman}</Text>
            </Pressable>
            <Text style={styles.english}>{word.english}</Text>
          </View>
        ))}
      </View>
      <View style={styles.spacer} />
      <Image source={require('../../../assets/redesign/card-art.png')} style={styles.footerArt} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  instruction: { fontSize: 14, color: textMuted(0.55), marginBottom: 24 },
  spacer: { flex: 1, minHeight: 12 },
  cards: { gap: 12 },
  card: {
    alignItems: 'center', paddingVertical: 32, backgroundColor: colors.white, borderRadius: 24, overflow: 'hidden',
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 4,
  },
  // scenery along the bottom of the screen, above Continue — decoration only, the word is the thing to read
  footerArt: { width: '100%', height: 110, opacity: 0.5, marginBottom: -8 },
  cardCompact: {
    paddingVertical: 20, borderWidth: 2, borderColor: colors.divider, borderRadius: 16,
  },
  sampleBtn: {
    width: 64, height: 64, borderRadius: 9999, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  sampleBtnCompact: { width: 48, height: 48, marginBottom: 14 },
  thai: { fontSize: 48, color: colors.text, marginBottom: 10, textAlign: 'center' },
  thaiCompact: { fontSize: 28, marginBottom: 6 },
  roman: { fontFamily: fonts.heading, fontSize: 24, color: colors.accent700, marginBottom: 14, textAlign: 'center' },
  romanCompact: { fontSize: 17, marginBottom: 8 },
  english: { fontSize: 18, color: textMuted(0.7), textAlign: 'center' },
});
