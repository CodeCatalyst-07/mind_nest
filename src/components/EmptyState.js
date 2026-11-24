/**
 * src/components/EmptyState.js
 * Purpose: A friendly, welcoming empty state component with an icon, title, description,
 * and call-to-action button. Displayed when no check-in records have been logged yet.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../theme/ThemeContext';

export default function EmptyState({
  icon = '🌱',
  title = 'No Data Yet',
  message = 'Complete your daily check-in to see your mood, sleep, and energy patterns appear here.',
  buttonTitle = 'Check In Now',
  onPress,
  style,
}) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.xl,
        },
        style,
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${message}`}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.primaryLight,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <AppText style={styles.iconText}>{icon}</AppText>
      </View>

      <AppText variant="title" weight="bold" style={styles.title}>
        {title}
      </AppText>

      <AppText
        variant="body"
        color={colors.mutedText}
        style={[styles.message, { marginTop: spacing.xs, marginBottom: spacing.lg }]}
      >
        {message}
      </AppText>

      {onPress && buttonTitle ? (
        <AppButton
          title={buttonTitle}
          onPress={onPress}
          variant="primary"
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    marginVertical: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    minWidth: 180,
  },
});
