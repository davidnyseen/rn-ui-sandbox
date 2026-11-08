import { Image, View, StyleSheet } from 'react-native';

const FLOWER = require('../../assets/redesign/button-flower.png');

// The soft cream frangipani tucked into both ends of a big yellow button, as in ChatGPT's Continue button (user,
// 2026-11-08). Drawn inside its own clipped pill so the flowers are cut off by the button's rounded ends without
// clipping the button's shadow.
export function ButtonFlowers() {
  return (
    <View id="button-flowers" style={styles.clip} pointerEvents="none">
      <Image source={FLOWER} style={[styles.flower, styles.left]} resizeMode="contain" />
      <Image source={FLOWER} style={[styles.flower, styles.right]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 9999, overflow: 'hidden' },
  flower: { position: 'absolute', top: '50%', marginTop: -27, width: 84, height: 54, opacity: 0.9 }, // about the button's own height, like ChatGPT's
  left: { left: 4 },
  // mirrored, and pushed past the right end so the edge crops it
  right: { right: -20, transform: [{ scaleX: -1 }] },
});
