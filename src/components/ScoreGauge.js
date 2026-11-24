/**
 * src/components/ScoreGauge.js
 * Purpose: Circular animated progress gauge built with react-native-svg.
 * Visualizes the 0-100% WHO-5 score with smooth animated stroke progression.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ScoreGauge({
  score = 0,
  size = 180,
  strokeWidth = 14,
  color = '#0D9488',
}) {
  const { colors } = useTheme();

  // Mathematical dimensions for the circle
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: clampedScore / 100,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [clampedScore]);

  // Interpolate dash offset from full circumference (0%) to remaining (score%)
  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - clampedScore / 100)],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Track Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Animated Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>

      {/* Centered Score Label */}
      <View style={styles.centerTextContainer}>
        <AppText style={[styles.scoreNumber, { color }]}>
          {Math.round(clampedScore)}%
        </AppText>
        <AppText variant="caption" color={colors.mutedText} style={styles.scoreSubtext}>
          Well-Being Score
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
  },
  scoreSubtext: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
