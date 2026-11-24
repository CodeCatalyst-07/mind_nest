/**
 * src/components/StatCard.js
 * Purpose: A compact, beautiful metric card featuring a count-up numerical animation.
 * Used in Trends to display Average Mood, Average Sleep, and Current Streak.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function StatCard({
  title,
  value = 0,
  decimals = 0,
  unit = '',
  icon = '📊',
  subtitle,
  style,
}) {
  const { colors, spacing, borderRadius } = useTheme();
  const [displayNumber, setDisplayNumber] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset and animate to target value
    animValue.setValue(0);
    const listenerId = animValue.addListener(({ value: current }) => {
      setDisplayNumber(current);
    });

    Animated.timing(animValue, {
      toValue: Number(value) || 0,
      duration: 800,
      useNativeDriver: false,
    }).start();

    return () => {
      animValue.removeListener(listenerId);
    };
  }, [value, animValue]);

  const formattedValue =
    decimals > 0 ? displayNumber.toFixed(decimals) : Math.round(displayNumber).toString();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.sm,
        },
        style,
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${formattedValue}${unit ? ' ' + unit : ''}`}
    >
      <View style={styles.header}>
        <AppText variant="caption" color={colors.mutedText} weight="medium" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="bodySmall">{icon}</AppText>
      </View>

      <View style={styles.valueRow}>
        <AppText variant="title" weight="bold" color={colors.text}>
          {formattedValue}
        </AppText>
        {unit ? (
          <AppText
            variant="caption"
            color={colors.mutedText}
            weight="medium"
            style={{ marginLeft: 2, marginBottom: 2 }}
          >
            {unit}
          </AppText>
        ) : null}
      </View>

      {subtitle ? (
        <AppText variant="caption" color={colors.mutedText} numberOfLines={1}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 88,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 2,
  },
});
