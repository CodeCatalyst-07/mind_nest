/**
 * src/screens/BreathingScreen.js
 * Purpose: Full-screen guided breathing timer screen.
 * Guides students through rhythmic inhale, hold, and exhale phases with visual animation.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';

export default function BreathingScreen({ navigation }) {
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
          Guided Breathing
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="body" color={colors.mutedText}>
          Guided breathing exercises will appear here.
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
