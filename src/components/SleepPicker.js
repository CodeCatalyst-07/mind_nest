/**
 * src/components/SleepPicker.js
 * Purpose: Interactive stepper for recording sleep duration in 0.5-hour increments.
 * Features a moon icon, large numerical display, and dynamic wellness hints based on sleep range.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { haptics } from '../utils/haptics';

export default function SleepPicker({ hours = 7, onChangeHours }) {
  const { colors, spacing, borderRadius } = useTheme();

  const handleDecrement = () => {
    if (hours > 0) {
      haptics.light();
      onChangeHours(Math.max(0, hours - 0.5));
    }
  };

  const handleIncrement = () => {
    if (hours < 12) {
      haptics.light();
      onChangeHours(Math.min(12, hours + 0.5));
    }
  };

  // Dynamic feedback hint for college students
  let hint = 'Optimal rest for college memory retention and mental focus!';
  let hintColor = colors.primary;

  if (hours < 6) {
    hint = 'Short rest — consider a quick 20-minute power nap between classes.';
    hintColor = '#F97316';
  } else if (hours > 9) {
    hint = 'Deep recovery sleep — ease gently into your morning routine.';
    hintColor = colors.accent;
  }

  return (
    <View style={styles.container}>
      {/* Icon Badge */}
      <View style={[styles.iconBadge, { backgroundColor: colors.accent + '20' }]}>
        <Ionicons name="moon" size={32} color={colors.accent} />
      </View>

      {/* Stepper Row */}
      <View style={styles.stepperRow}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={hours <= 0}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Decrease sleep by 30 minutes"
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: hours <= 0 ? 0.4 : 1,
            },
          ]}
        >
          <Ionicons name="remove" size={26} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <AppText style={[styles.valueText, { color: colors.text }]}>
            {hours.toFixed(1)}
          </AppText>
          <AppText variant="heading" color={colors.mutedText} style={styles.unitText}>
            hours
          </AppText>
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          disabled={hours >= 12}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Increase sleep by 30 minutes"
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: hours >= 12 ? 0.4 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Health Hint */}
      <View
        style={[
          styles.hintCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            marginTop: spacing.lg,
          },
        ]}
      >
        <Ionicons name="information-circle-outline" size={18} color={hintColor} style={{ marginRight: 8 }} />
        <AppText variant="caption" style={{ color: hintColor, flex: 1 }}>
          {hint}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  stepperButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 110,
  },
  valueText: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
  unitText: {
    marginTop: -4,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    width: '100%',
    maxWidth: 340,
  },
});
