import { ComponentType } from 'react';
import { Image, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors, fonts, textMuted, PATH_PALETTE } from '../theme';
import { Button } from '../components/Button';
import { BottomSheetModal } from '../components/BottomSheetModal';
import { IconProps, StarIcon } from '../components/icons';

// The one place a lesson's name shows now — the map itself is just icons
// (see PathScreen), so tapping a node surfaces this instead of jumping
// straight in, and replaces the old subject-only "first lesson" intro
// screen (CourseUnitIntroScreen) with one consistent launcher for every
// lesson.
export function LessonSheet({
  lessonTitle,
  subjectRoman,
  Icon,
  paletteIndex,
  isDone,
  stars,
  onStart,
  onClose,
}: {
  lessonTitle: string;
  subjectRoman: string;
  Icon: ComponentType<IconProps>;
  paletteIndex: number;
  isDone: boolean;
  stars?: number;
  onStart: () => void;
  onClose: () => void;
}) {
  const pal = PATH_PALETTE[paletteIndex];
  const artW = Math.min(useWindowDimensions().width, 480); // RootApp caps the app at 480 wide
  return (
    <BottomSheetModal onClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        {/* Temple, palm and tuk-tuk strip across the top (assets/redesign: ChatGPT art, 2026-11-07) */}
        <Image source={require('../../assets/redesign/sheet-art.png')} style={[styles.art, { width: artW, height: (artW * 385) / 1200 * 0.8 }]} resizeMode="contain" />
        <View style={[styles.iconWrap, { backgroundColor: pal.tint }]}>
          <Icon size={26} color={pal.dark} />
        </View>
        <Text style={styles.roman} numberOfLines={1}>{subjectRoman}</Text>
        <Text style={styles.title} numberOfLines={2}>{lessonTitle}</Text>
        {isDone && (
          <View style={styles.stars}>
            {[1, 2, 3].map((n) => (
              <StarIcon key={n} size={16} color={pal.base} filled={n <= (stars ?? 0)} />
            ))}
          </View>
        )}
        <Button variant="primary" block onPress={onStart} style={styles.startBtn}>
          {isDone ? 'Review lesson' : 'Start lesson'}
        </Button>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40, alignItems: 'center',
  },
  grabber: { width: 36, height: 4, borderRadius: 9999, backgroundColor: colors.neutral300, marginBottom: 8 },
  art: { marginBottom: -30, opacity: 0.5 }, // decoration only: the lesson title is the thing to read
  iconWrap: {
    width: 56, height: 56, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    borderWidth: 3, borderColor: colors.white,
  },
  roman: { fontFamily: fonts.bodySemibold, fontSize: 13, letterSpacing: 0.4, color: textMuted(0.5), marginBottom: 4 },
  title: { fontFamily: fonts.heading, fontSize: 28, lineHeight: 32, color: colors.text, textAlign: 'center', marginBottom: 10 },
  stars: { flexDirection: 'row', gap: 4, marginBottom: 6 },
  startBtn: { marginTop: 14, width: '100%' },
});
