import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet } from 'react-native';

// Backdrop and sheet animate independently: the dim fades in on its own
// while only the sheet slides up from off-screen. Modal's built-in
// animationType moves the whole native modal (backdrop included) as one
// transform, which reads as the entire dimmed screen sliding up rather
// than a sheet appearing over a steady backdrop — so the Modal itself
// stays animationType="none" and both pieces are driven here instead.
export function BottomSheetModal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.timing(backdropOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 220, mass: 0.9 }).start();
  }, [backdropOpacity, sheetY]);

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdropTouch} onPress={onClose} accessibilityLabel="Dismiss" />
      </Animated.View>
      <Animated.View style={[styles.sheetWrap, { transform: [{ translateY: sheetY }] }]} pointerEvents="box-none">
        <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(32,30,29,0.45)' },
  backdropTouch: { flex: 1 },
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
