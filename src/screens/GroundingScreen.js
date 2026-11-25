/**
 * src/screens/GroundingScreen.js
 * Purpose: Full-screen 5-4-3-2-1 sensory grounding exercise screen.
 * Helps students reconnect with the present moment through mindful sensory awareness.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function GroundingScreen({ navigation }) {
  const { colors, spacing } = useTheme();

  return (
    <Screen scrollable>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="heading" weight="bold">
          5-4-3-2-1 Grounding
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="body" color={colors.mutedText}>
          Sensory grounding exercise steps will appear here.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
});
