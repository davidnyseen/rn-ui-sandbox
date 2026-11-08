import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { BottomSheetModal } from './BottomSheetModal';

// A custom bottom sheet — drag handle, left-aligned title/body, one big
// solid CTA in the app's own accent color, plain text Cancel below it.
// Used for anything destructive/losable enough to double-check first (e.g.
// quitting a lesson mid-attempt).
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: {
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <BottomSheetModal onClose={onCancel}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        {body && <Text style={styles.body}>{body}</Text>}
        <Pressable style={({ pressed }) => [styles.action, pressed && styles.actionPressed]} onPress={onConfirm}>
          <Text style={styles.actionText}>{confirmLabel}</Text>
        </Pressable>
        <Pressable style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  handle: { width: 36, height: 4, borderRadius: 9999, backgroundColor: colors.neutral300, alignSelf: 'center', marginBottom: 20 },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.text, marginBottom: 10 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.text, marginBottom: 28 },
  // The app's own accent yellow, not red — matches the rest of the app's
  // primary-button color rather than borrowing a system "danger" red.
  action: { backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  actionPressed: { backgroundColor: colors.accent600 },
  actionText: { fontFamily: fonts.heading, fontSize: 17, color: colors.onAccent },
  cancel: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
});
