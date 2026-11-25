import { useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { CourseSubject, CourseWord, DictionaryEntry, subjectSentences, subjectWords } from '../courseTypes';
import { colors, fonts, textMuted } from '../theme';
import { BookIcon, ChevronRightIcon, PlayIcon } from '../components/icons';
import { COURSE_ICONS } from '../components/courseIcons';
import { speakThai } from '../tts';

// The app's dictionary, grouped by subject: every unit's whole word list
// (started or not, so it doubles as a preview of what's coming), and a
// Sentences tab with the full sentences the lessons use (subjectSentences).
// Each unit starts collapsed — tap its header to open it — and inside, the
// entries sit under the lesson that teaches them ("Asking for a menu…",
// "Days of the week…"), so the list reads by topic. A search opens every
// unit with a match. Search box since this list only grows. Each row is a flashcard, so the list
// works as self-testing rather than just a reference sheet; a toggle picks
// which side faces up — English first (the default, asked for 2026-11-24) or
// Thai first — and every flip reads the Thai aloud.
export function WordsReviewScreen({
  courseSubjects,
  courseProgress,
}: {
  courseSubjects: CourseSubject[];
  courseProgress: Record<string, { unlockedLessonIndex: number; stars: Record<number, number> }>;
}) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'words' | 'sentences'>('words');
  const [front, setFront] = useState<CardFront>('english');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggleUnit = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const noun = tab === 'words' ? 'word' : 'sentence';

  const groups = courseSubjects
    .map((s) => ({
      subject: s,
      started: (courseProgress[s.id]?.unlockedLessonIndex ?? 0) > 0,
      words: tab === 'words' ? subjectWords(s) : subjectSentences(s),
    }))
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
      <Text style={styles.kicker}>Dictionary</Text>
      <View style={styles.kickerRule} />
      <View id="dictionary-tabs" style={styles.tabRow}>
        {(['words', 'sentences'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.title, tab !== t && styles.titleInactive]}>{t === 'words' ? 'Words' : 'Sentences'}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.subtitle}>
        {totalCount > 0
          ? `${totalCount} ${noun}${totalCount === 1 ? '' : 's'} across ${groups.length} unit${groups.length === 1 ? '' : 's'}. Tap a card to see the ${front === 'english' ? 'Thai' : 'English'}.`
          : 'No course content loaded yet.'}
      </Text>

      {totalCount > 0 && (
        <View id="dictionary-front-toggle" style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show first</Text>
          {(['english', 'thai'] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFront(f)}
              accessibilityRole="button"
              accessibilityState={{ selected: front === f }}
              style={[styles.toggleBtn, front === f && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, front === f && styles.toggleTextActive]}>{f === 'english' ? 'English' : 'Thai'}</Text>
            </Pressable>
          ))}
        </View>
      )}

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
          const isOpen = q !== '' || open.has(g.subject.id);
          return (
            <View key={g.subject.id} style={styles.group}>
              <Pressable
                id={`dictionary-unit-${g.subject.id}`}
                onPress={() => toggleUnit(g.subject.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                style={styles.groupHeader}
              >
                <View style={styles.groupIcon}>
                  <Icon size={16} color={colors.accent700} />
                </View>
                <Text style={styles.groupTitle}>{g.subject.title}</Text>
                <Text style={styles.groupCount}>
                  {g.started ? '' : 'Not started · '}
                  {g.words.length}
                </Text>
                <View style={isOpen ? styles.chevronOpen : undefined}>
                  <ChevronRightIcon size={16} color={textMuted(0.45)} />
                </View>
              </Pressable>
              {isOpen &&
                byLesson(g.words).map(([lesson, entries]) => (
                  <View key={lesson} style={styles.lessonGroup}>
                    <Text style={styles.lessonTitle}>{lesson}</Text>
                    {entries.map((w) => (
                      // Keyed per subject so the same word appearing in two
                      // units keeps its own flip state in each.
                      <WordCard key={`${tab}:${front}:${g.subject.id}:${w.thai}`} word={w} front={front} />
                    ))}
                  </View>
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
type CardFront = 'english' | 'thai';

function WordCard({ word, front }: { word: CourseWord; front: CardFront }) {
  const [flipped, setFlipped] = useState(false);
  const turn = useRef(new Animated.Value(0)).current;

  const flip = () => {
    const next = !flipped;
    setFlipped(next);
    // Read the Thai aloud on every turn, either way over — hearing it as the
    // card flips is the point (asked for 2026-11-25).
    speakThai(word.thai);
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
      accessibilityLabel={`${front === 'english' ? word.english : word.roman}. Tap to flip and hear it in Thai.`}
      style={styles.cardWrap}
    >
      {/* The face-up side is in normal flow, so it sets the row height —
          sentences can wrap to a few lines; front's minHeight keeps a
          one-line card as tall as the two-line Thai side. The other side is
          absolutely positioned to match. */}
      <Animated.View style={[styles.face, styles.front, frontStyle]} pointerEvents={flipped ? 'none' : 'auto'}>
        {front === 'english' ? <EnglishSide word={word} /> : <ThaiSide word={word} />}
      </Animated.View>
      <Animated.View
        style={[styles.face, styles.back, StyleSheet.absoluteFill, backStyle]}
        pointerEvents={flipped ? 'auto' : 'none'}
      >
        {front === 'english' ? <ThaiSide word={word} /> : <EnglishSide word={word} />}
      </Animated.View>
    </Pressable>
  );
}

function EnglishSide({ word }: { word: CourseWord }) {
  return <Text style={styles.frontEnglish}>{word.english}</Text>;
}

function ThaiSide({ word }: { word: CourseWord }) {
  return (
    <>
      <View style={styles.rowText}>
        <Text style={styles.rowRoman} numberOfLines={2}>{word.roman}</Text>
        <Text style={styles.rowThai} numberOfLines={2}>{word.thai}</Text>
      </View>
      <Pressable
        onPress={() => speakThai(word.thai)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Hear ${word.roman}`}
      >
        <View style={styles.soundBtn}><PlayIcon size={17} color={colors.accent700} /></View>
      </Pressable>
    </>
  );
}

// Entries in teaching order, split into runs by the lesson that teaches them.
function byLesson(entries: DictionaryEntry[]): [string, DictionaryEntry[]][] {
  const out: [string, DictionaryEntry[]][] = [];
  for (const e of entries) {
    const last = out[out.length - 1];
    if (last && last[0] === e.lesson) last[1].push(e);
    else out.push([e.lesson, [e]]);
  }
  return out;
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
  tabRow: { flexDirection: 'row', gap: 18, alignItems: 'baseline' },
  titleInactive: { color: textMuted(0.3) },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -6, marginBottom: 14 },
  toggleLabel: { fontSize: 13, color: textMuted(0.55), marginRight: 2 },
  toggleBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 9999,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.4)', backgroundColor: colors.white,
  },
  toggleBtnActive: { backgroundColor: colors.accent100, borderColor: colors.accent },
  toggleText: { fontFamily: fonts.bodySemibold, fontSize: 13, color: textMuted(0.6) },
  toggleTextActive: { color: colors.accent700 },
  subtitle: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), marginBottom: 18 },
  search: {
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.4)', borderRadius: 9999, paddingHorizontal: 18, paddingVertical: 12,
    backgroundColor: colors.white,
    fontSize: 15, color: colors.text, marginBottom: 18,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  group: { marginBottom: 10 },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: colors.white, borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)',
  },
  chevronOpen: { transform: [{ rotate: '90deg' }] },
  lessonGroup: { marginTop: 12 },
  lessonTitle: {
    fontFamily: fonts.bodySemibold, fontSize: 12, letterSpacing: 0.4, color: textMuted(0.5), marginBottom: 6, marginLeft: 4,
  },
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 68,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)', backgroundColor: colors.white,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  // Tinted rather than neutral so a flipped card reads as "turned over" at a
  // glance while scrolling a long list.
  back: {
    backgroundColor: colors.accent100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
  },
  frontEnglish: { flex: 1, fontFamily: fonts.bodySemibold, fontSize: 16, lineHeight: 22, color: colors.text },
  rowText: { flex: 1, minWidth: 92 },
  soundBtn: { width: 36, height: 36, borderRadius: 9999, backgroundColor: colors.accent100, alignItems: 'center', justifyContent: 'center' },
  rowRoman: { fontFamily: fonts.bodySemibold, fontSize: 16, color: colors.text },
  rowThai: { fontSize: 15, color: textMuted(0.55), marginTop: 1 },
  empty: { fontSize: 14, color: textMuted(0.5), textAlign: 'center', marginTop: 24 },
});
