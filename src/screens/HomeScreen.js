/**
 * src/screens/HomeScreen.js
 * Purpose: Home screen tab of MindNest.
 * Displays a friendly greeting and placeholder action cards to open the
 * Daily Check-in and Weekly Questionnaire full-screen stack routes.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { colors, spacing } = useTheme();

  return (
    <Screen scrollable>
      {/* Header Greeting */}
      <View style={styles.header}>
        <AppText variant="title">Welcome to MindNest 🌱</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Your quiet space for student mental wellness
        </AppText>
      </View>

      {/* Overview Card */}
      <Card>
        <AppText variant="heading" style={{ marginBottom: spacing.xs }}>
          How are you feeling today?
        </AppText>
        <AppText variant="body" color={colors.mutedText}>
          Take a moment to pause, breathe, and reflect on your campus day.
        </AppText>
      </Card>

      {/* Action Navigation Cards */}
      <AppText variant="heading" style={[styles.sectionTitle, { color: colors.text }]}>
        Daily Activities
      </AppText>

      {/* Daily Check-in Button / Card */}
      <Card
        onPress={() => navigation.navigate('CheckIn')}
        style={[styles.actionCard, { borderLeftColor: colors.primary, borderLeftWidth: 5 }]}
      >
        <View style={styles.actionRow}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="sunny" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <AppText variant="heading">Daily Check-in</AppText>
            <AppText variant="caption">Log today's mood and quick thoughts</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </View>
      </Card>

      {/* Weekly Questionnaire Button / Card */}
      <Card
        onPress={() => navigation.navigate('Questionnaire')}
        style={[styles.actionCard, { borderLeftColor: colors.accent, borderLeftWidth: 5 }]}
      >
        <View style={styles.actionRow}>
          <View style={[styles.iconBadge, { backgroundColor: colors.accent + '25' }]}>
            <Ionicons name="clipboard-outline" size={24} color={colors.accent} />
          </View>
          <View style={styles.actionTextContainer}>
            <AppText variant="heading">Weekly Questionnaire</AppText>
            <AppText variant="caption">Review your stress levels and weekly reflection</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  sectionTitle: {
    marginVertical: 12,
  },
  actionCard: {
    paddingVertical: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
});
