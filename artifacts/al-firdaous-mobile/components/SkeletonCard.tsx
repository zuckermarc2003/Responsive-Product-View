import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';

function SkeletonPulse({ style }: { style?: object }) {
  const colors = useColors();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: colors.border, borderRadius: 4 }, style, animStyle]}
    />
  );
}

export function SkeletonCard({ width }: { width: number }) {
  const colors = useColors();

  return (
    <View style={[styles.card, { width, backgroundColor: colors.card }]}>
      <SkeletonPulse style={{ width: '100%', aspectRatio: 1, borderRadius: 0 }} />
      <View style={styles.info}>
        <SkeletonPulse style={{ height: 10, width: '50%', marginBottom: 6 }} />
        <SkeletonPulse style={{ height: 13, width: '90%', marginBottom: 4 }} />
        <SkeletonPulse style={{ height: 13, width: '70%', marginBottom: 8 }} />
        <SkeletonPulse style={{ height: 16, width: '55%' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginBottom: 4,
  },
  info: {
    padding: 10,
  },
});
