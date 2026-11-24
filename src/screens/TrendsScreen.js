/**
 * src/screens/TrendsScreen.js
 * Purpose: Tab screen displaying student mood trends, weekly averages, and insights.
 * Features range switching (7 Days vs 30 Days), summary stats, SVG charts,
 * pattern reflections, and recent check-in history.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import SegmentedControl from '../components/SegmentedControl';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { filterCheckInsByRange } from '../utils/stats';

const RANGE_OPTIONS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
];

export default function TrendsScreen() {
  const { colors, spacing } = useTheme();
  const { checkIns } = useData();
  const [range, setRange] = useState(7);

  // Filtered check-ins based on selected timeframe
  const filteredCheckIns = filterCheckInsByRange(checkIns, range);

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

      <Card>
        <AppText variant="subheading">Active Range: {range} Days</AppText>
        <AppText variant="caption" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Showing {filteredCheckIns.length} recorded check-in{filteredCheckIns.length === 1 ? '' : 's'}.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },
});
