/**
 * src/screens/TrendsScreen.js
 * Purpose: Tab screen displaying student mood trends, weekly averages, and insights.
 * Features range switching (7 Days vs 30 Days), count-up summary cards, SVG charts,
 * pattern reflections, and recent check-in history.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import SegmentedControl from '../components/SegmentedControl';
import StatCard from '../components/StatCard';
import MoodLineChart from '../components/MoodLineChart';
import MoodHeatmap from '../components/MoodHeatmap';
import SleepBarChart from '../components/SleepBarChart';
import TagFrequencyChart from '../components/TagFrequencyChart';
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

const RANGE_OPTIONS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
];

export default function TrendsScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const { checkIns, assessments } = useData();
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
    marginBottom: 16,
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
});
