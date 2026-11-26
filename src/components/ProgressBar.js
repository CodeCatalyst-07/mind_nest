/**
 * src/components/ProgressBar.js
 * Purpose: 4-segment animated progress bar for the Daily Check-in flow.
 * Visualizes the user's progress through Mood, Energy, Sleep, and Note steps.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function ProgressBar({ currentStep = 0, totalSteps = 4 }) {
  const { colors, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <ProgressSegment
          key={index}
          isFilled={index <= currentStep}
          primaryColor={colors.primary}
          trackColor={colors.border}
          borderRadius={borderRadius.round}
        />
      ))}
    </View>
  );
}

function ProgressSegment({ isFilled, primaryColor, trackColor, borderRadius }) {
  const [fillAnim] = useState(() => new Animated.Value(isFilled ? 1 : 0));

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: isFilled ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFilled, fillAnim]);

  const widthInterpolation = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.segmentTrack, { backgroundColor: trackColor, borderRadius }]}>
      <Animated.View
        style={[
          styles.segmentFill,
          {
            backgroundColor: primaryColor,
            borderRadius,
            width: widthInterpolation,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  segmentTrack: {
    flex: 1,
    height: 5,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
  },
});
