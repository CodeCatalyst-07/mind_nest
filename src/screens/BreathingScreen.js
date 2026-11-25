/**
 * src/screens/BreathingScreen.js
 * Purpose: Full-screen guided breathing timer screen.
 * Allows selecting a breathing pattern (Calm, Box, Relax) and duration (1, 2, or 5 min),
 * displaying the animated BreathingCircle, Start/Pause/Stop controls, and safety guidance.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import BreathingCircle from '../components/BreathingCircle';
import { useTheme } from '../theme/ThemeContext';
import { BREATHING_PATTERNS, BREATHING_DURATIONS } from '../data/toolkit';

export default function BreathingScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();

  // Setup selections
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [selectedDurationSec, setSelectedDurationSec] = useState(BREATHING_DURATIONS[0].seconds);

  // Session state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(selectedPattern.phases[0].seconds);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(BREATHING_DURATIONS[0].seconds);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const currentPhase = selectedPattern.phases[phaseIndex] || selectedPattern.phases[0];

  const handleSelectPattern = (pattern) => {
    if (isRunning) return;
    setSelectedPattern(pattern);
    setPhaseIndex(0);
    setPhaseSecondsLeft(pattern.phases[0].seconds);
  };

  const handleSelectDuration = (sec) => {
    if (isRunning) return;
    setSelectedDurationSec(sec);
    setTotalSecondsLeft(sec);
  };

  const handleStart = () => {
    setPhaseIndex(0);
    setPhaseSecondsLeft(selectedPattern.phases[0].seconds);
    setTotalSecondsLeft(selectedDurationSec);
    setCyclesCompleted(0);
    setIsPaused(false);
    setIsRunning(true);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setPhaseIndex(0);
    setPhaseSecondsLeft(selectedPattern.phases[0].seconds);
    setTotalSecondsLeft(selectedDurationSec);
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <Screen scrollable>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back to Toolkit"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="heading" weight="bold">
          Guided Breathing
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* Animated Breathing Guide */}
      <BreathingCircle
        phaseLabel={isRunning ? currentPhase.label : 'Ready'}
        action={isRunning ? currentPhase.action : 'idle'}
        phaseSeconds={currentPhase.seconds}
        secondsLeft={phaseSecondsLeft}
        isRunning={isRunning}
        isPaused={isPaused}
      />

      {/* Active Readout (Time Left & Cycles) */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statPill,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
          ]}
        >
          <AppText variant="caption" color={colors.mutedText}>
            Time Left
          </AppText>
          <AppText variant="subheading" weight="bold">
            {formatTime(isRunning ? totalSecondsLeft : selectedDurationSec)}
          </AppText>
        </View>

        <View
          style={[
            styles.statPill,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
          ]}
        >
          <AppText variant="caption" color={colors.mutedText}>
            Cycles
          </AppText>
          <AppText variant="subheading" weight="bold">
            {cyclesCompleted}
          </AppText>
        </View>
      </View>

      {/* Pattern & Duration Pickers (shown before session starts) */}
      {!isRunning ? (
        <View style={{ marginTop: spacing.md }}>
          <AppText variant="bodySmall" weight="bold" color={colors.text} style={styles.groupLabel}>
            Choose a Pattern
          </AppText>
          <View style={styles.patternList}>
            {BREATHING_PATTERNS.map((pattern) => {
              const isSelected = selectedPattern.id === pattern.id;
              return (
                <TouchableOpacity
                  key={pattern.id}
                  onPress={() => handleSelectPattern(pattern)}
                  activeOpacity={0.75}
                  style={[
                    styles.patternOption,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.sm,
                    },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <AppText
                    variant="bodySmall"
                    weight="bold"
                    color={isSelected ? colors.primary : colors.text}
                  >
                    {pattern.name}
                  </AppText>
                  <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
                    {pattern.subtitle}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText
            variant="bodySmall"
            weight="bold"
            color={colors.text}
            style={[styles.groupLabel, { marginTop: spacing.md }]}
          >
            Duration
          </AppText>
          <View style={styles.durationRow}>
            {BREATHING_DURATIONS.map((dur) => {
              const isSelected = selectedDurationSec === dur.seconds;
              return (
                <TouchableOpacity
                  key={dur.label}
                  onPress={() => handleSelectDuration(dur.seconds)}
                  activeOpacity={0.75}
                  style={[
                    styles.durationChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <AppText
                    variant="bodySmall"
                    weight="bold"
                    color={isSelected ? '#FFFFFF' : colors.text}
                  >
                    {dur.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      {/* Controls */}
      <View style={[styles.controlsContainer, { marginTop: spacing.lg }]}>
        {!isRunning ? (
          <AppButton title="Start Session" onPress={handleStart} variant="primary" />
        ) : (
          <View style={styles.activeControlsRow}>
            <AppButton
              title={isPaused ? 'Resume' : 'Pause'}
              onPress={handleTogglePause}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <AppButton
              title="Stop"
              onPress={handleStop}
              variant="outline"
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>

      {/* Safety Note */}
      <AppText
        variant="caption"
        color={colors.mutedText}
        style={{ marginTop: spacing.lg, textAlign: 'center' }}
      >
        If you feel dizzy, stop and breathe normally.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  groupLabel: {
    marginBottom: 8,
  },
  patternList: {
    gap: 8,
  },
  patternOption: {
    borderWidth: 1.5,
    minHeight: 52,
    justifyContent: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationChip: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    marginBottom: 8,
  },
  activeControlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
