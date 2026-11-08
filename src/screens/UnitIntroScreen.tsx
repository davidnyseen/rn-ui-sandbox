import { ComponentType } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Unit, UNITS } from '../data';
import { colors, fonts, radius, textMuted } from '../theme';
import { Button } from '../components/Button';
import {
  ArrowRightIcon,
  BookIcon,
  ChatIcon,
  CloseIcon,
  HashIcon,
  IconProps,
  PlaneIcon,
  UsersIcon,
  UtensilsIcon,
} from '../components/icons';

// Deliberately duplicated from PathScreen's own UNIT_ICONS rather than
// importing it — keeps this screen's file changes isolated from PathScreen's
// so the two can be built/reviewed independently.
const UNIT_ICONS: Record<string, ComponentType<IconProps>> = {
  Basics: BookIcon,
  Greetings: ChatIcon,
  Family: UsersIcon,
  Numbers: HashIcon,
  Restaurant: UtensilsIcon,
  Travel: PlaneIcon,
};

export function UnitIntroScreen({
  unit,
  onContinue,
  onClose,
}: {
  unit: Unit;
  onContinue: () => void;
  onClose: () => void;
}) {
  const unitIndex = UNITS.findIndex((u) => u.id === unit.id);
  const Icon = UNIT_ICONS[unit.title] ?? BookIcon;

  return (
    <View style={styles.screen}>
      <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
        <CloseIcon size={26} color={colors.text} />
      </Pressable>

      <View style={styles.hero}>
        <Icon size={40} color={colors.onAccent} />
      </View>

      <Text style={styles.kicker}>{`Unit ${unitIndex + 1} of ${UNITS.length}`}</Text>
      <Text style={styles.title}>{unit.title}</Text>
      <Text style={styles.subtitle}>{unit.roman}</Text>
      <Text style={styles.body}>
        {`This unit has ${unit.lessons.length} lessons, ending with a short dialogue.`}
      </Text>

      <View style={styles.spacer} />
      <Button variant="primary" block onPress={onContinue} icon={<ArrowRightIcon color={colors.onAccent} />}>
        Start lesson 1
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  hero: {
    width: 88, height: 88, borderRadius: radius, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  kicker: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.accent700, marginBottom: 10 },
  title: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 15, color: textMuted(0.55), marginBottom: 16 },
  body: { fontSize: 15, lineHeight: 22, color: textMuted(0.6), maxWidth: 280 },
  spacer: { flex: 1, minHeight: 24 },
});
