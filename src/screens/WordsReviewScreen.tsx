import { useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { CourseSubject, CourseWord, subjectWords } from '../courseTypes';
import { colors, fonts, textMuted } from '../theme';
import { BookIcon, PlayIcon } from '../components/icons';
import { COURSE_ICONS } from '../components/courseIcons';
import { speakThai } from '../tts';

// A flat glossary grouped by subject — once a subject has been started at
// all, its whole word list shows here (not just lessons already finished),
// so it doubles as a preview of what's coming next in that unit. Search box
// since this list only grows. Each row is a flashcard: Thai on the front,
// English on the back, so the list works as self-testing rather than just a
// reference sheet.
export function WordsReviewScreen({
  courseSubjects,
  courseProgress,
}: {
  courseSubjects: CourseSubject[];
  courseProgress: Record<string, { unlockedLessonIndex: number; stars: Record<number, number> }>;
}) {
  const [query, setQuery] = useState('');

  const groups = courseSubjects
    .filter((s) => (courseProgress[s.id]?.unlockedLessonIndex ?? 0) > 0)
    .map((s) => ({ subject: s, words: subjectWords(s) }))
    .filter((g) => g.words.length > 0);

  const q = query.trim().toLowerCase();
  const filteredGroups = q
    ? groups
        .map((g) => ({ ...g, words: g.words.filter((w) => matchesQuery(w, q)) }))
        .filter((g) => g.words.length > 0)
    : groups;

  const totalCount = groups.reduce((n, g) => n + g.words.length, 0);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Review</Text>
      <View style={styles.kickerRule} />
      <Text style={styles.title}>Words you've learned</Text>
      <Text style={styles.subtitle}>
        {totalCount > 0
          ? `${totalCount} word${totalCount === 1 ? '' : 's'} across ${groups.length} unit${groups.length === 1 ? '' : 's'}. Tap a card to flip it.`
          : 'Finish a lesson and its words will show up here.'}
      </Text>

      {totalCount > 0 && (
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Thai, roman, or English…"
          placeholderTextColor={textMuted(0.4)}
          style={styles.search}
        />
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {filteredGroups.map((g) => {
          const Icon = COURSE_ICONS[g.subject.id] ?? BookIcon;
          return (
            <View key={g.subject.id} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={styles.groupIcon}>
                  <Icon size={16} color={colors.accent700} />
                </View>
                <Text style={styles.groupTitle}>{g.subject.title}</Text>
                <Text style={styles.groupCount}>{g.words.length}</Text>
              </View>
              {g.words.map((w) => (
                // Keyed per subject so the same word appearing in two units
                // keeps its own flip state in each.
                <WordCard key={`${g.subject.id}:${w.thai}`} word={w} />
              ))}
            </View>
          );
        })}
        {totalCount > 0 && filteredGroups.length === 0 && <Text style={styles.empty}>No matches for "{query}".</Text>}
      </ScrollView>
    </View>
  );
}

// Thai on the front, English on the back. Both faces sit on top of each
// other and rotate through opposite halves of the same turn, with
// backfaceVisibility hiding whichever one currently faces away — the
// two-sided card trick, so there's a real edge-on moment mid-flip rather
// than a crossfade. The front stays in normal flow so it sets the row
// height; the back is absolutely positioned to match it.
function WordCard({ word }: { word: CourseWord }) {
  const [flipped, setFlipped] = useState(false);
  const turn = useRef(new Animated.Value(0)).current;

  const flip = () => {
    const next = !flipped;
    setFlipped(next);
    // Speaking on the way to the answer costs nothing now that the flip
    // itself reveals it, and hearing the word as it turns is the point.
    if (next) speakThai(word.thai);
    Animated.spring(turn, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 55,
    }).start();
  };

  const frontStyle = {
    transform: [
      { perspective: 900 },
      { rotateY: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
    ],
  };
  const backStyle = {
    transform: [
      { perspective: 900 },
      { rotateY: turn.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }) },
    ],
  };

  return (
    <Pressable
      onPress={flip}
      accessibilityRole="button"
      accessibilityLabel={
        flipped ? `${word.roman}, ${word.english}. Tap to flip back.` : `${word.roman}. Tap to flip and hear it.`
      }
      style={styles.cardWrap}
    >
      <Animated.View style={[styles.face, styles.front, frontStyle]} pointerEvents={flipped ? 'none' : 'auto'}>
        <View style={styles.rowText}>
          <Text style={styles.rowRoman}>{word.roman}</Text>
          <Text style={styles.rowThai}>{word.thai}</Text>
        </View>
        <Pressable
          onPress={() => speakThai(word.thai)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Hear ${word.roman}`}
        >
          <View style={styles.soundBtn}><PlayIcon size={17} color={colors.accent700} /></View>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[styles.face, styles.back, StyleSheet.absoluteFill, backStyle]}
        pointerEvents={flipped ? 'auto' : 'none'}
      >
        <Text style={styles.backEnglish} numberOfLines={2}>
          {word.english}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function matchesQuery(w: CourseWord, q: string): boolean {
  return w.thai.includes(q) || w.roman.toLowerCase().includes(q) || w.english.toLowerCase().includes(q);
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  kicker: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.accent700, marginBottom: 10 },
  // a short gold bar under the label (ChatGPT's 'improve' pass, 2026-11-08)
  kickerRule: { width: 28, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginTop: -4, marginBottom: 12 },
  title: { fontFamily: fonts.heading, fontSize: 30, letterSpacing: -0.3, color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), marginBottom: 18 },
  search: {
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.4)', borderRadius: 9999, paddingHorizontal: 18, paddingVertical: 12,
    backgroundColor: colors.white,
    fontSize: 15, color: colors.text, marginBottom: 18,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  group: { marginBottom: 20 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  groupIcon: {
    width: 26, height: 26, borderRadius: 9999, backgroundColor: colors.accent100,
    alignItems: 'center', justifyContent: 'center',
  },
  groupTitle: { flex: 1, fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.text },
  groupCount: { fontSize: 12, color: textMuted(0.45) },
  cardWrap: { marginBottom: 8 },
  face: {
    borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16,
    backfaceVisibility: 'hidden',
  },
  front: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)', backgroundColor: colors.white,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  // Tinted rather than neutral so a flipped card reads as "turned over" at a
  // glance while scrolling a long list.
  back: { backgroundColor: colors.accent100, alignItems: 'center', justifyContent: 'center' },
  backEnglish: { fontFamily: fonts.bodySemibold, fontSize: 15, color: colors.text, textAlign: 'center' },
  rowText: { minWidth: 92 },
  soundBtn: { width: 36, height: 36, borderRadius: 9999, backgroundColor: colors.accent100, alignItems: 'center', justifyContent: 'center' },
  rowRoman: { fontFamily: fonts.bodySemibold, fontSize: 16, color: colors.text },
  rowThai: { fontSize: 15, color: textMuted(0.55), marginTop: 1 },
  empty: { fontSize: 14, color: textMuted(0.5), textAlign: 'center', marginTop: 24 },
});
