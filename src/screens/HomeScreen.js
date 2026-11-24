/**
 * src/screens/HomeScreen.js
 * Purpose: Home screen tab of MindNest.
 * Displays a time-aware greeting, a dynamic "Today" card (prompt or check-in summary),
 * and action cards to open the Daily Check-in and Weekly Questionnaire routes.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import AppButton from '../components/AppButton';

import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { getMoodByValue } from '../data/moods';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  return 'Good evening 🌙';
}

export default function HomeScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { checkIns, getTodayCheckIn } = useData();

  const todayCheckIn = getTodayCheckIn();
  const todayMood = todayCheckIn ? getMoodByValue(todayCheckIn.mood) : null;
  const moodColor = todayMood ? colors.mood[todayMood.colorKey] : colors.primary;

  return (
    <Screen scrollable>
      {/* Header Greeting */}
      <View style={styles.header}>
        <AppText variant="title">{getTimeGreeting()}</AppText>
        <AppText variant="caption" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Welcome to MindNest • Your student wellness sanctuary
        </AppText>
      </View>

      {/* Dynamic "Today" Card */}
      {!todayCheckIn ? (
        <Card style={[styles.todayCard, { borderColor: colors.primary, borderWidth: 1.5 }]}>
          <View style={styles.todayCardContent}>
            <View style={[styles.todayIconBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sparkles" size={24} color={colors.primary} />
            </View>
            <View style={styles.todayTextContainer}>
              <AppText variant="heading">How is your day going?</AppText>
              <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
                Take 60 seconds to reflect on your mood, energy, and sleep.
              </AppText>
            </View>
          </View>
          <AppButton
            title="Check in now"
            onPress={() => navigation.navigate('CheckIn')}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      ) : (
        <Card style={[styles.todayCard, { borderLeftColor: moodColor, borderLeftWidth: 5 }]}>
          <View style={styles.todayHeader}>
            <View style={styles.statusBadgeRow}>
              <Ionicons name="checkmark-circle" size={18} color={moodColor} />
              <AppText variant="caption" style={{ marginLeft: 6, fontWeight: '700', color: moodColor }}>
                TODAY'S CHECK-IN LOGGED
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('CheckIn')}
              style={styles.editLink}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Edit today's check-in"
            >
              <Ionicons name="pencil-outline" size={16} color={colors.primary} />
              <AppText variant="caption" color={colors.primary} style={{ marginLeft: 4, fontWeight: '600' }}>
                Edit
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Mood & Stats summary */}
          <View style={styles.summaryRow}>
            <View style={styles.moodSummaryCol}>
              <AppText style={{ fontSize: 32 }}>{todayMood.emoji}</AppText>
              <View style={{ marginLeft: 10 }}>
                <AppText variant="heading" style={{ color: moodColor }}>
                  {todayMood.label}
                </AppText>
                <AppText variant="caption" color={colors.mutedText}>
                  Energy: {todayCheckIn.energy}/5 • Sleep: {todayCheckIn.sleepHours}h
                </AppText>
              </View>
            </View>
          </View>

          {/* Tags */}
          {todayCheckIn.tags && todayCheckIn.tags.length > 0 ? (
            <View style={styles.tagWrap}>
              {todayCheckIn.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: colors.primaryLight,
                      borderRadius: borderRadius.round,
                    },
                  ]}
                >
                  <AppText variant="caption" color={colors.primary} style={{ fontWeight: '600' }}>
                    {tag}
                  </AppText>
                </View>
              ))}
            </View>
          ) : null}

          {/* Reflection note snippet */}
          {todayCheckIn.note ? (
            <AppText
              variant="caption"
              color={colors.mutedText}
              numberOfLines={2}
              style={styles.noteSnippet}
            >
              "{todayCheckIn.note}"
            </AppText>
          ) : null}
        </Card>
      )}

      {/* Storage Status Overview */}
      <Card style={{ backgroundColor: colors.primaryLight + '35' }}>
        <View style={styles.statsRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <AppText variant="caption" style={{ marginLeft: 8, color: colors.text, fontWeight: '600' }}>
            {checkIns.length} total {checkIns.length === 1 ? 'check-in' : 'check-ins'} recorded in MindNest
          </AppText>
        </View>
      </Card>

      {/* Action Navigation Cards */}
      <AppText variant="heading" style={[styles.sectionTitle, { color: colors.text }]}>
        Daily Activities
      </AppText>

      {/* Daily Check-in Shortcut */}
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
            <AppText variant="caption">
              {todayCheckIn ? "View or edit today's entry" : "Log today's mood and quick thoughts"}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </View>
      </Card>

      {/* Weekly Questionnaire Shortcut */}
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
    marginBottom: 16,
    marginTop: 4,
  },
  todayCard: {
    padding: 16,
    marginBottom: 16,
  },
  todayCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  todayTextContainer: {
    flex: 1,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  moodSummaryCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  noteSnippet: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginVertical: 12,
  },
  actionCard: {
    paddingVertical: 16,
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
