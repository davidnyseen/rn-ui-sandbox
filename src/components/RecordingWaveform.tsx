import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const BAR_COUNT = 5;

// A simple animated equalizer — not audio-reactive (expo-speech-recognition
// doesn't expose live levels), just a staggered pulse so the mic clearly
// reads as "recording" rather than only relying on the ring pulse.
export function RecordingWaveform({ color }: { color: string }) {
  const anims = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = anims.map((val, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 90),
          Animated.timing(val, { toValue: 1, duration: 260, useNativeDriver: false }),
          Animated.timing(val, { toValue: 0, duration: 260, useNativeDriver: false }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [anims]);

  return (
    <View style={styles.row}>
      {anims.map((val, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: val.interpolate({ inputRange: [0, 1], outputRange: [8, 26] }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 26 },
  bar: { width: 4, borderRadius: 2 },
});
