import { Image, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { CourseSubject } from '../courseTypes';
import { colors, fonts, textMuted } from '../theme';
import { BookIcon, ChevronRightIcon, StarIcon } from '../components/icons';
import { COURSE_ICONS } from '../components/courseIcons';

export function ProgressScreen({
  xp,
  streak,
  courseSubjects,
  courseProgress,
  onSelectSubject,
}: {
  xp: number;
  streak: number;
  courseSubjects: CourseSubject[];
  courseProgress: Record<string, { unlockedLessonIndex: number; stars: Record<number, number> }>;
  onSelectSubject: (subjectId: string) => void;
}) {
  // A subject shows up here as soon as its first lesson is cleared —
  // subjects unlock independently (see PathScreen), so "started" is the
  // right bar rather than "fully finished".
  const startedSubjects = courseSubjects.filter((s) => (courseProgress[s.id]?.unlockedLessonIndex ?? 0) > 0);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Progress</Text>
      <View style={styles.kickerRule} />
      <Text style={styles.title}>Your progress</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <Text style={styles.statValue}>{xp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCell}>
          <View style={styles.streakValue}>
            <Image source={require('../../assets/redesign/flame.png')} style={{ width: 18, height: 21 }} resizeMode="contain" />
            <Text style={styles.statValueText}>{streak}</Text>
          </View>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Practice</Text>
      <View style={styles.kickerRule} />
      <Text style={styles.subtitle}>
        {startedSubjects.length > 0
          ? "Replay any unit you've started — mistakes here don't cost hearts or affect your stats."
          : "Finish a lesson and its unit will show up here to practice anytime."}
      </Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {startedSubjects.map((s) => {
          const Icon = COURSE_ICONS[s.id] ?? BookIcon;
          const progress = courseProgress[s.id];
          const starValues = Object.values(progress?.stars ?? {});
          const avgStars = starValues.length ? Math.round(starValues.reduce((a, b) => a + b, 0) / starValues.length) : 0;
          return (
            <Pressable key={s.id} onPress={() => onSelectSubject(s.id)} style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon size={22} color={colors.accent700} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{s.title}</Text>
                <Text style={styles.rowRoman}>{s.roman}</Text>
              </View>
              <View style={styles.rowStars}>
                {[1, 2, 3].map((n) => (
                  <StarIcon key={n} size={13} color={colors.accent} filled={n <= avgStars} />
                ))}
              </View>
              <ChevronRightIcon size={16} color={textMuted(0.4)} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  kicker: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.accent700, marginBottom: 10 },
  // a short gold bar under the label (ChatGPT's 'improve' pass, 2026-11-08)
  kickerRule: { width: 28, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginTop: -4, marginBottom: 12 },
  title: { fontFamily: fonts.heading, fontSize: 30, letterSpacing: -0.3, color: colors.text, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCell: {
    flex: 1, padding: 18, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.35)', backgroundColor: '#fffbf2',
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  statValue: { fontFamily: fonts.heading, fontSize: 28, color: colors.accent700 },
  streakValue: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statValueText: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  statLabel: { fontSize: 12, color: textMuted(0.6), marginTop: 2 },
  sectionLabel: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), marginBottom: 20 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 20, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: 'rgba(230,176,0,0.28)', backgroundColor: colors.white,
    shadowColor: '#7a5c00', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
  },
  rowIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accent100,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: fonts.bodySemibold, fontSize: 15, color: colors.text },
  rowRoman: { fontSize: 12, color: textMuted(0.55), marginTop: 1 },
  rowStars: { flexDirection: 'row', gap: 2, marginRight: 4 },
});
