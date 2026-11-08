import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Mirrors the design's `bounceNode` CSS keyframe (translateY(0) <->
// translateY(-6px), ease-in-out, 1.8s) — used on the map's current-lesson
// node so it reads as "tap me" without needing a label.
export function BounceNode({ children }: { children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  return <Animated.View style={{ transform: [{ translateY }] }}>{children}</Animated.View>;
}
