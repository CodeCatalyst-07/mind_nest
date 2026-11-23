/**
 * src/screens/CheckInScreen.js
 * Purpose: Full-screen stack route for Daily Mood Check-in.
 * Displays mood level color swatches (1-5) as a preview of the upcoming mood picker.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function CheckInScreen() {
  const { colors, spacing } = useTheme();

  const moodLevels = [
    { level: 1, label: 'Terrible', color: colors.mood.level1 },
    { level: 2, label: 'Bad', color: colors.mood.level2 },
    { level: 3, label: 'Okay', color: colors.mood.level3 },
    { level: 4, label: 'Good', color: colors.mood.level4 },
    { level: 5, label: 'Great', color: colors.mood.level5 },
  ];

  return (
    <Screen scrollable>
      <Card>
        <AppText variant="heading">Daily Mood Check-in</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          This screen will let students record their daily mood and optional notes.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading" style={{ marginBottom: spacing.sm }}>
          5-Level Mood Palette Preview
        </AppText>
        <View style={styles.paletteRow}>
          {moodLevels.map((item) => (
            <View key={item.level} style={styles.moodItem}>
              <View style={[styles.moodCircle, { backgroundColor: item.color }]} />
              <AppText variant="caption" style={{ marginTop: 4 }}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  moodItem: {
    alignItems: 'center',
  },
  moodCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
