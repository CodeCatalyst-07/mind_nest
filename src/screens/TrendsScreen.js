/**
 * src/screens/TrendsScreen.js
 * Purpose: Tab screen displaying student mood trends, weekly averages, and insights.
 * Features range switching (7 Days vs 30 Days), count-up summary cards, SVG charts,
 * pattern reflections, and recent check-in history with delete confirmation.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import SegmentedControl from '../components/SegmentedControl';
import StatCard from '../components/StatCard';
import MoodLineChart from '../components/MoodLineChart';
import MoodHeatmap from '../components/MoodHeatmap';
import SleepBarChart from '../components/SleepBarChart';
import TagFrequencyChart from '../components/TagFrequencyChart';
import AssessmentTrendChart from '../components/AssessmentTrendChart';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import {
  filterCheckInsByRange,
  calculateAverageMood,
  calculateAverageSleep,
  calculateStreak,
  getMoodEmoji,
} from '../utils/stats';
import { generateInsights } from '../utils/insights';
import { formatDisplayDate } from '../utils/dateUtils';

const RANGE_OPTIONS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
];

export default function TrendsScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const { checkIns, assessments, deleteCheckIn } = useData();
  const [range, setRange] = useState(7);

  // Filtered check-ins based on selected timeframe
  const filteredCheckIns = filterCheckInsByRange(checkIns, range);

  // Statistical calculations
  const avgMood = calculateAverageMood(filteredCheckIns);
  const avgSleep = calculateAverageSleep(filteredCheckIns);
  const streak = calculateStreak(checkIns);
  const moodEmoji = getMoodEmoji(avgMood);

  // Personalized non-clinical insights
  const insightsList = generateInsights(checkIns, assessments);

  // Recent check-ins sorted newest to oldest
  const recentCheckIns = [...checkIns]
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 10);

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Check-in',
      `Are you sure you want to delete your check-in for ${formatDisplayDate(item.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCheckIn(item.id),
        },
      ]
    );
  };

  return (
    <Screen scrollable>
      {/* Header & Range Switcher */}
      <View style={styles.header}>
        <AppText variant="title">Trends & Insights</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          See your well-being patterns over time and notice what helps you thrive.
        </AppText>

        <SegmentedControl
          options={RANGE_OPTIONS}
          selectedValue={range}
          onSelect={setRange}
          style={{ marginTop: spacing.md }}
        />
      </View>

      {/* 3 Summary Stat Cards */}
      <View style={[styles.statsRow, { gap: spacing.sm }]}>
        <StatCard
          title="Avg Mood"
          value={avgMood}
          decimals={1}
          icon={moodEmoji}
          subtitle="out of 5"
        />
        <StatCard
          title="Avg Sleep"
          value={avgSleep}
          decimals={1}
          unit="h"
          icon="🌙"
          subtitle="per night"
        />
        <StatCard
          title="Streak"
          value={streak}
          decimals={0}
          unit="days"
          icon="🔥"
          subtitle={streak > 0 ? 'keep going!' : 'start today'}
        />
      </View>

      {/* Mood Line Chart */}
      <MoodLineChart checkIns={filteredCheckIns} />

      {/* Monthly Mood Heatmap Calendar */}
      <MoodHeatmap checkIns={checkIns} />

      {/* Sleep Bar Chart (Coloured by Mood) */}
      <SleepBarChart checkIns={filteredCheckIns} />

      {/* Tag Frequency Horizontal Bars */}
      <TagFrequencyChart checkIns={filteredCheckIns} />

      {/* Well-Being Score Trend (WHO-5 Assessments) */}
      <AssessmentTrendChart assessments={assessments} />

      {/* Insights & Observations Section */}
      <View style={styles.sectionHeader}>
        <AppText variant="subheading" weight="bold">
          Reflective Patterns & Insights
        </AppText>
        <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
          Gentle observations from your self-check logs.
        </AppText>
      </View>

      <View style={[styles.insightsList, { gap: spacing.sm }]}>
        {insightsList.map((item) => (
          <View
            key={`insight-${item.id}`}
            style={[
              styles.insightCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
              },
            ]}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${item.title}: ${item.text}`}
          >
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: colors.primaryLight,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <AppText variant="title">{item.icon}</AppText>
            </View>

            <View style={styles.insightContent}>
              <AppText variant="body" weight="bold" color={colors.text}>
                {item.title}
              </AppText>
              <AppText
                variant="bodySmall"
                color={colors.mutedText}
                style={{ marginTop: 4, lineHeight: 18 }}
              >
                {item.text}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Check-ins List */}
      <View style={styles.sectionHeader}>
        <AppText variant="subheading" weight="bold">
          Recent Check-ins
        </AppText>
        <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
          Your latest recorded self-checks.
        </AppText>
      </View>

      {recentCheckIns.length === 0 ? (
        <View
          style={[
            styles.emptyCheckIns,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
            },
          ]}
        >
          <AppText variant="bodySmall" color={colors.mutedText} style={{ textAlign: 'center' }}>
            No check-in history yet.
          </AppText>
        </View>
      ) : (
        <View style={[styles.recentList, { gap: spacing.sm }]}>
          {recentCheckIns.map((item) => (
            <View
              key={`recent-${item.id}`}
              style={[
                styles.recentItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                },
              ]}
            >
              <View style={styles.recentLeft}>
                <View
                  style={[
                    styles.recentEmojiBox,
                    {
                      backgroundColor: colors.primaryLight,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  <AppText variant="title">{getMoodEmoji(item.mood)}</AppText>
                </View>

                <View style={styles.recentMeta}>
                  <AppText variant="bodySmall" weight="bold">
                    {formatDisplayDate(item.date)}
                  </AppText>
                  <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
                    Mood: {item.mood}/5 • Sleep: {item.sleepHours}h • Energy: {item.energy}/5
                  </AppText>

                  {item.note ? (
                    <AppText
                      variant="caption"
                      color={colors.text}
                      style={styles.recentNote}
                      numberOfLines={2}
                    >
                      "{item.note}"
                    </AppText>
                  ) : null}

                  {Array.isArray(item.tags) && item.tags.length > 0 ? (
                    <View style={styles.recentTags}>
                      {item.tags.map((t) => (
                        <View
                          key={`rt-${item.id}-${t}`}
                          style={[
                            styles.recentTagChip,
                            {
                              backgroundColor: colors.border,
                              borderRadius: borderRadius.xs,
                            },
                          ]}
                        >
                          <AppText variant="caption" color={colors.mutedText} style={{ fontSize: 10 }}>
                            {t}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.deleteButton}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel={`Delete check-in for ${formatDisplayDate(item.date)}`}
              >
                <Ionicons name="trash-outline" size={20} color={colors.mutedText} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  insightsList: {
    marginBottom: 20,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  recentList: {
    marginBottom: 24,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  recentEmojiBox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentMeta: {
    flex: 1,
  },
  recentNote: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  recentTagChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deleteButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckIns: {
    borderWidth: 1,
    marginBottom: 24,
  },
});
