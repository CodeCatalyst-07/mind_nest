/**
 * src/screens/ToolkitScreen.js
 * Purpose: Tab screen containing student coping strategies, breathing exercises, and relaxation tools.
 * Currently a placeholder showing the screen name in a Card.
 */

import React from 'react';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function ToolkitScreen() {
  const { colors, spacing } = useTheme();

  return (
    <Screen scrollable>
      <Card>
        <AppText variant="title">Coping Toolkit</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Quick exercises and grounding techniques when college life gets overwhelming.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">Toolkit Modules</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          • 4-7-8 Breathing Timer{'\n'}
          • Grounding 5-4-3-2-1 Technique{'\n'}
          • Campus Support Helpline Directory
        </AppText>
      </Card>
    </Screen>
  );
}
