/**
 * src/screens/SettingsScreen.js
 * Purpose: Tab screen for user preferences, theme details, and app information.
 * Currently a placeholder showing the screen name in a Card.
 */

import React from 'react';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark, spacing } = useTheme();

  return (
    <Screen scrollable>
      <Card>
        <AppText variant="title">Settings</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Manage your theme, notification reminders, and local app data.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">Appearance</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Current Mode: {isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'} (Matches device setting)
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">About MindNest</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Version 1.0.0 (Phase 1 Skeleton) • Built with Expo & React Native for college students.
        </AppText>
      </Card>
    </Screen>
  );
}
