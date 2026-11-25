/**
 * src/screens/GroundingScreen.js
 * Purpose: Full-screen 5-4-3-2-1 sensory grounding exercise screen.
 * Presents one sensory step per page with a progress bar and an interactive tap circle
 * with spring feedback and haptics as the student notices items around them.
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import ProgressBar from '../components/ProgressBar';
import AppButton from '../components/AppButton';
import { useTheme } from '../theme/ThemeContext';
import { GROUNDING_STEPS } from '../data/toolkit';
import { haptics } from '../utils/haptics';

export default function GroundingScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();

  const [stepIndex, setStepIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const currentStep = GROUNDING_STEPS[stepIndex] || GROUNDING_STEPS[0];
  const isStepComplete = tapCount >= currentStep.count;
  const isLastStep = stepIndex === GROUNDING_STEPS.length - 1;

  const handleTapCircle = () => {
    if (isStepComplete) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    if (nextCount >= currentStep.count) {
      haptics.medium();
    } else {
      haptics.light();
    }
  };

  const handleNext = () => {
    if (!isStepComplete) return;
    haptics.selection();

    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      setTapCount(0);
    }
  };

  const handleBackStep = () => {
    if (stepIndex > 0) {
      haptics.selection();
      const prevStep = GROUNDING_STEPS[stepIndex - 1];
      setStepIndex((prev) => prev - 1);
      setTapCount(prevStep.count);
    }
  };

  return (
    <Screen scrollable>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Close grounding exercise"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="heading" weight="bold">
          5-4-3-2-1 Grounding
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* Progress Bar */}
      <ProgressBar currentStep={stepIndex} totalSteps={GROUNDING_STEPS.length} />

      <AppText
        variant="caption"
        color={colors.mutedText}
        style={{ textAlign: 'center', marginBottom: spacing.md }}
      >
        Step {stepIndex + 1} of {GROUNDING_STEPS.length}
      </AppText>

      {/* Step Instruction */}
      <View style={styles.instructionBox}>
        <AppText style={styles.stepEmoji}>{currentStep.icon}</AppText>
        <AppText variant="title" weight="bold" style={styles.stepTitle}>
          {currentStep.title}
        </AppText>
        <AppText
          variant="body"
          color={colors.mutedText}
          style={[styles.stepPrompt, { marginTop: spacing.xs }]}
        >
          {currentStep.prompt}
        </AppText>
      </View>

      {/* Interactive Sensory Tap Circle */}
      <View style={styles.circleContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleTapCircle}
            activeOpacity={0.85}
            disabled={isStepComplete}
            accessibilityRole="button"
            accessibilityLabel={`Tap to record noticing item ${tapCount + 1} of ${currentStep.count} for ${currentStep.sense}`}
            style={[
              styles.tapCircle,
              {
                backgroundColor: isStepComplete ? colors.accent : `${colors.accent}22`,
                borderColor: colors.accent,
              },
            ]}
          >
            <AppText
              variant="title"
              weight="bold"
              color={isStepComplete ? '#FFFFFF' : colors.accent}
              style={styles.counterText}
            >
              {tapCount} / {currentStep.count}
            </AppText>
            <AppText
              variant="bodySmall"
              weight="medium"
              color={isStepComplete ? '#FFFFFF' : colors.text}
              style={{ marginTop: 4 }}
            >
              {isStepComplete ? 'Ready!' : 'Tap as you notice'}
            </AppText>
          </TouchableOpacity>
        </Animated.View>

        {/* Visual Tap Dots */}
        <View style={[styles.dotsRow, { marginTop: spacing.lg }]}>
          {Array.from({ length: currentStep.count }).map((_, idx) => {
            const filled = idx < tapCount;
            return (
              <View
                key={`tap-dot-${idx}`}
                style={[
                  styles.dot,
                  {
                    backgroundColor: filled ? colors.accent : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Navigation Footer */}
      <View style={[styles.footerRow, { marginTop: spacing.xl }]}>
        {stepIndex > 0 ? (
          <AppButton
            title="Back"
            onPress={handleBackStep}
            variant="secondary"
            style={{ flex: 1 }}
          />
        ) : null}
        <AppButton
          title={isLastStep ? 'Finish' : 'Next'}
          onPress={handleNext}
          disabled={!isStepComplete}
          variant="primary"
          style={{ flex: 2, backgroundColor: colors.accent }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonPlaceholder: {
    width: 44,
  },
  instructionBox: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  stepEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  stepTitle: {
    textAlign: 'center',
  },
  stepPrompt: {
    textAlign: 'center',
    lineHeight: 22,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  tapCircle: {
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
