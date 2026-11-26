/**
 * src/components/BreathingCircle.js
 * Purpose: Animated visual breathing guide using React Native's built-in Animated API.
 * Smoothly expands during inhale, pauses steady during hold, and shrinks during exhale,
 * with clear phase text and countdown seconds centered inside.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

const MIN_SCALE = 0.6;
const MAX_SCALE = 1.0;

export default function BreathingCircle({
  phaseLabel = 'Ready',
  action = 'idle',
  phaseSeconds = 4,
  secondsLeft = 0,
  isRunning = false,
  isPaused = false,
}) {
  const { colors } = useTheme();
  const [scaleAnim] = useState(() => new Animated.Value(MIN_SCALE));
  const activeAnimationRef = useRef(null);

  useEffect(() => {
    // Stop any previous animation before starting the next phase
    if (activeAnimationRef.current) {
      activeAnimationRef.current.stop();
      activeAnimationRef.current = null;
    }

    if (!isRunning) {
      Animated.timing(scaleAnim, {
        toValue: MIN_SCALE,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return undefined;
    }

    if (isPaused) {
      scaleAnim.stopAnimation();
      return undefined;
    }

    if (action === 'inhale') {
      const anim = Animated.timing(scaleAnim, {
        toValue: MAX_SCALE,
        duration: Math.max(300, phaseSeconds * 1000),
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });
      activeAnimationRef.current = anim;
      anim.start();
    } else if (action === 'exhale') {
      const anim = Animated.timing(scaleAnim, {
        toValue: MIN_SCALE,
        duration: Math.max(300, phaseSeconds * 1000),
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });
      activeAnimationRef.current = anim;
      anim.start();
    }

    return () => {
      if (activeAnimationRef.current) {
        activeAnimationRef.current.stop();
        activeAnimationRef.current = null;
      }
    };
  }, [action, phaseSeconds, isRunning, isPaused, scaleAnim]);

  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${phaseLabel}${isRunning ? `, ${secondsLeft} seconds remaining in phase` : ''}`}
    >
      {/* Outer soft breathing halo */}
      <Animated.View
        style={[
          styles.outerCircle,
          {
            backgroundColor: `${colors.primary}22`,
            borderColor: `${colors.primary}55`,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {/* Inner core breathing circle */}
      <Animated.View
        style={[
          styles.innerCircle,
          {
            backgroundColor: `${colors.primary}40`,
            borderColor: colors.primary,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {/* Crisp static center text overlay */}
      <View style={styles.centerContent} accessibilityLiveRegion="polite">
        <AppText variant="heading" weight="bold" color={colors.text} style={styles.phaseText}>
          {phaseLabel}
        </AppText>
        {isRunning ? (
          <AppText variant="title" weight="bold" color={colors.primary} style={styles.countdown}>
            {secondsLeft}
          </AppText>
        ) : (
          <AppText variant="caption" color={colors.mutedText} style={styles.readyHint}>
            Press Start
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  outerCircle: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1.5,
  },
  innerCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2.5,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  phaseText: {
    fontSize: 20,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 36,
    marginTop: 4,
  },
  readyHint: {
    marginTop: 4,
  },
});
