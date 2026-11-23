/**
 * src/screens/QuestionnaireScreen.js
 * Purpose: Full-screen stack route for the Weekly Questionnaire.
 * Placeholder screen for future self-assessment and mental wellness surveys.
 */

import React from 'react';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function QuestionnaireScreen() {
  const { colors, spacing } = useTheme();

  return (
    <Screen scrollable>
      <Card>
        <AppText variant="title">Weekly Questionnaire</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          A gentle weekly check on sleep, academic stress, social connection, and energy.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">Placeholder Notice</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          In Phase 2, this screen will contain guided questions with a clean rating scale and automatic scoring.
        </AppText>
      </Card>
    </Screen>
  );
}
