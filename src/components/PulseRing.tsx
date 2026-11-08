import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

// Mirrors the design's `pulseRing` / `micPulse` CSS keyframes (an expanding,
// fading ring) using a transform + opacity animation, since RN can't animate
// box-shadow.
export function PulseRing({
  color,
  loop = true,
  duration = 2200,
}: {
  color: string;
  loop?: boolean;
  duration?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      { iterations: loop ? -1 : 1 }
    );
    animation.start();
    return () => animation.stop();
  }, [anim, duration, loop]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const opacity = anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.4, 0.25, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.ring,
        { borderColor: color, transform: [{ scale }], opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ring: { borderRadius: 9999, borderWidth: 3 },
});
