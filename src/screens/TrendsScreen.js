/**
 * src/screens/TrendsScreen.js
 * Purpose: Tab screen displaying student mood trends, weekly averages, and insights.
 * Currently a placeholder showing the screen name in a Card.
 */

import React from 'react';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function TrendsScreen() {
  const { colors, spacing } = useTheme();

  return (
    <Screen scrollable>
      <Card>
        <AppText variant="title">Mood Trends & Insights</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Visual graphs and weekly trends will appear here to help you spot wellness patterns over time.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">Coming in Later Phases</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          • Weekly mood averages{'\n'}
          • High and low stress day tags{'\n'}
          • Questionnaire score history
        </AppText>
      </Card>
    </Screen>
  );
}
