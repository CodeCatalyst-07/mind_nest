/**
 * src/screens/BreathingScreen.js
 * Purpose: Full-screen guided breathing timer screen.
 * Manages rhythmic phase countdowns, cycle tracking, phase-change haptics,
 * screen keep-awake during active sessions, and automatic ToolSession logging upon completion.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import BreathingCircle from '../components/BreathingCircle';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { BREATHING_PATTERNS, BREATHING_DURATIONS } from '../data/toolkit';
import { haptics } from '../utils/haptics';

const KEEP_AWAKE_TAG = 'mindnest-breathing';

export default function BreathingScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { logSession } = useData();

  // Setup selections
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [selectedDurationSec, setSelectedDurationSec] = useState(BREATHING_DURATIONS[0].seconds);

  // Session run state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerState, setTimerState] = useState({
    phaseIndex: 0,
    phaseSecondsLeft: BREATHING_PATTERNS[0].phases[0].seconds,
    totalSecondsLeft: BREATHING_DURATIONS[0].seconds,
    cyclesCompleted: 0,
  });

  const intervalRef = useRef(null);
  const hasLoggedRef = useRef(false);
  const phases = selectedPattern.phases;
  const currentPhase = phases[timerState.phaseIndex] || phases[0];

  // Keep screen awake strictly while actively running (and release on pause/stop/unmount)
  useEffect(() => {
    if (isRunning && !isPaused) {
      activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    } else {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    }

    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, [isRunning, isPaused]);

  // Haptic cue whenever a new breathing phase begins
  useEffect(() => {
    if (isRunning && !isPaused) {
      haptics.light();
    }
  }, [timerState.phaseIndex, isRunning, isPaused]);

  // Trigger session logging when countdown finishes cleanly
  useEffect(() => {
    if (timerState.totalSecondsLeft === 0 && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(true);
      haptics.success();
      logSession('breathing', selectedDurationSec);
    }
  }, [timerState.totalSecondsLeft, selectedDurationSec, logSession]);

  // 1-second session ticker using functional state updates to avoid stale closures
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        const nextTotalLeft = prev.totalSecondsLeft - 1;

        if (nextTotalLeft <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return {
            ...prev,
            totalSecondsLeft: 0,
            phaseSecondsLeft: 0,
          };
        }

        const nextPhaseLeft = prev.phaseSecondsLeft - 1;
        if (nextPhaseLeft <= 0) {
          const nextPhaseIdx = (prev.phaseIndex + 1) % phases.length;
          const completedCycle = nextPhaseIdx === 0 ? 1 : 0;
          return {
            phaseIndex: nextPhaseIdx,
            phaseSecondsLeft: phases[nextPhaseIdx].seconds,
            totalSecondsLeft: nextTotalLeft,
            cyclesCompleted: prev.cyclesCompleted + completedCycle,
          };
        }

        return {
          ...prev,
          phaseSecondsLeft: nextPhaseLeft,
          totalSecondsLeft: nextTotalLeft,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, phases]);

  const handleSelectPattern = (pattern) => {
    if (isRunning) return;
    haptics.selection();
    setSelectedPattern(pattern);
    setTimerState({
      phaseIndex: 0,
      phaseSecondsLeft: pattern.phases[0].seconds,
      totalSecondsLeft: selectedDurationSec,
      cyclesCompleted: 0,
    });
  };

  const handleSelectDuration = (sec) => {
    if (isRunning) return;
    haptics.selection();
    setSelectedDurationSec(sec);
    setTimerState((prev) => ({
      ...prev,
      totalSecondsLeft: sec,
    }));
  };

  const handleStart = () => {
    hasLoggedRef.current = false;
    setIsCompleted(false);
    setTimerState({
      phaseIndex: 0,
      phaseSecondsLeft: phases[0].seconds,
      totalSecondsLeft: selectedDurationSec,
      cyclesCompleted: 0,
    });
    setIsPaused(false);
    setIsRunning(true);
  };

  const handleTogglePause = () => {
    haptics.selection();
    setIsPaused((prev) => !prev);
  };

  const handleStop = () => {
    haptics.light();
    setIsRunning(false);
    setIsPaused(false);
    setTimerState({
      phaseIndex: 0,
      phaseSecondsLeft: phases[0].seconds,
      totalSecondsLeft: selectedDurationSec,
      cyclesCompleted: 0,
    });
  };

  const handleReset = () => {
    hasLoggedRef.current = false;
    setIsCompleted(false);
    setTimerState({
      phaseIndex: 0,
      phaseSecondsLeft: phases[0].seconds,
      totalSecondsLeft: selectedDurationSec,
      cyclesCompleted: 0,
    });
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

      {isCompleted ? (
        <Card style={[styles.completionCard, { marginTop: spacing.xl }]}>
          <View
            style={[
              styles.completeBadge,
              { backgroundColor: colors.primaryLight, borderRadius: borderRadius.full },
            ]}
          >
            <AppText style={styles.completeEmoji}>🌬️</AppText>
          </View>

          <AppText variant="title" weight="bold" style={styles.completeTitle}>
            Well Done
          </AppText>

          <AppText
            variant="body"
            color={colors.mutedText}
            style={[styles.completeMessage, { marginTop: spacing.sm, marginBottom: spacing.lg }]}
          >
            You took {Math.round(selectedDurationSec / 60)} minute
            {selectedDurationSec > 60 ? 's' : ''} for yourself with {selectedPattern.name}. Take a
            moment to notice how calm your shoulders and mind feel right now.
          </AppText>

          <AppButton
            title="Back to Toolkit"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={{ width: '100%' }}
          />
          <AppButton
            title="Practice Again"
            onPress={handleReset}
            variant="secondary"
            style={{ width: '100%', marginTop: spacing.sm }}
          />
        </Card>
      ) : (
        <>
          {/* Animated Breathing Guide */}
          <BreathingCircle
            phaseLabel={isRunning ? (isPaused ? 'Paused' : currentPhase.label) : 'Ready'}
            action={isRunning ? currentPhase.action : 'idle'}
            phaseSeconds={currentPhase.seconds}
            secondsLeft={timerState.phaseSecondsLeft}
            isRunning={isRunning}
            isPaused={isPaused}
          />

          {/* Active Readout (Time Left & Cycles) */}
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <AppText variant="caption" color={colors.mutedText}>
                Time Left
              </AppText>
              <AppText variant="subheading" weight="bold">
                {formatTime(isRunning ? timerState.totalSecondsLeft : selectedDurationSec)}
              </AppText>
            </View>

            <View
              style={[
                styles.statPill,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <AppText variant="caption" color={colors.mutedText}>
                Cycles
              </AppText>
              <AppText variant="subheading" weight="bold">
                {timerState.cyclesCompleted}
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
        </>
      )}
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
  completionCard: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  completeBadge: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  completeEmoji: {
    fontSize: 36,
  },
  completeTitle: {
    textAlign: 'center',
  },
  completeMessage: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
