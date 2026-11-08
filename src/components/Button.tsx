import { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, textMuted } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  block = false,
  style,
  labelColor,
}: {
  children: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: ReactNode;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
  labelColor?: string;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        block && styles.block,
        pressed && !disabled && variant === 'primary' && styles.primaryPressed,
        pressed && !disabled && variant === 'secondary' && styles.secondaryPressed,
        disabled && (variant === 'ghost' ? styles.disabled : styles.solidDisabled),
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'ghost' && styles.labelGhost,
          labelColor ? { color: labelColor } : null,
          disabled && variant !== 'ghost' && styles.labelDisabled,
        ]}
      >
        {children}
      </Text>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 9999,
  },
  primary: {
    backgroundColor: colors.accent,
    shadowColor: '#e6b000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 4,
  },
  primaryPressed: { backgroundColor: colors.accent600 },
  secondary: { borderWidth: 1, borderColor: colors.divider },
  secondaryPressed: { backgroundColor: 'rgba(32,30,29,0.07)' },
  ghost: { paddingHorizontal: 4 },
  block: { width: '100%', marginTop: 8 },
  disabled: { opacity: 0.45 },
  // A not-yet-available button (main or outline, e.g. Check before you pick) is solid light grey with readable grey text — fading the yellow to 45% left a
  // washed-out pill whose label was hard to read (user, 2026-11-08: button contrast).
  solidDisabled: { backgroundColor: colors.neutral200, borderWidth: 0, shadowOpacity: 0, elevation: 0 },
  labelDisabled: { color: textMuted(0.55) },
  label: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  labelPrimary: { color: colors.onAccent },
  // accent700, not accent: a ghost button's label sits directly on the
  // screen bg, and accent itself (bright yellow) is too low-contrast there.
  labelGhost: { color: colors.accent700 },
});
