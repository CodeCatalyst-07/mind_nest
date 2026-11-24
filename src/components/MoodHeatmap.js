/**
 * src/components/MoodHeatmap.js
 * Purpose: A calendar heatmap component showing daily check-in moods for the current month.
 * Days with check-ins are filled with their corresponding mood color; unlogged days remain muted.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { toDateKey } from '../utils/dateUtils';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MoodHeatmap({ checkIns = [] }) {
  const { colors, spacing, borderRadius } = useTheme();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString('default', { month: 'long' });

  // Number of days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Day of week index for the 1st day (0 = Sunday)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Create lookup dictionary for check-ins in this month
  const checkInMap = {};
  checkIns.forEach((item) => {
    if (item?.date && typeof item?.mood === 'number') {
      checkInMap[item.date] = item.mood;
    }
  });

  const todayKey = toDateKey(now);

  const moodColorMap = {
    1: colors.mood.level1,
    2: colors.mood.level2,
    3: colors.mood.level3,
    4: colors.mood.level4,
    5: colors.mood.level5,
  };

  // Build grid items (leading empty cells + days)
  const gridCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    gridCells.push({ key: `pad-${i}`, isPadding: true });
  }
  for (let d = 1; d <= totalDays; d++) {
    const dayStr = String(d).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;
    const mood = checkInMap[dateKey];
    const isToday = dateKey === todayKey;

    gridCells.push({
      key: dateKey,
      dayNumber: d,
      mood,
      isToday,
      isPadding: false,
    });
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Monthly mood heatmap for ${monthName} ${year}`}
    >
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="subheading" weight="bold">
          Monthly Mood Calendar
        </AppText>
        <AppText variant="caption" color={colors.mutedText}>
          {monthName} {year}
        </AppText>
      </View>

      {/* Weekday Column Headers */}
      <View style={styles.weekdayRow}>
        {DAY_LABELS.map((label, idx) => (
          <AppText
            key={`header-${idx}`}
            variant="caption"
            color={colors.mutedText}
            weight="bold"
            style={styles.cellLabel}
          >
            {label}
          </AppText>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {gridCells.map((cell) => {
          if (cell.isPadding) {
            return <View key={cell.key} style={styles.gridCell} />;
          }

          const hasMood = cell.mood !== undefined;
          const cellColor = hasMood ? moodColorMap[cell.mood] : colors.border;
          // Use dark text on yellow (mood 3) for optimal contrast, white on darker moods
          const textColor = hasMood ? (cell.mood === 3 ? '#1E293B' : '#FFFFFF') : colors.mutedText;

          return (
            <View
              key={cell.key}
              style={[
                styles.gridCell,
                styles.dayCell,
                {
                  backgroundColor: cellColor,
                  borderRadius: borderRadius.sm,
                  borderColor: cell.isToday ? colors.primary : 'transparent',
                  borderWidth: cell.isToday ? 2 : 0,
                  opacity: hasMood ? 1 : 0.4,
                },
              ]}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${monthName} ${cell.dayNumber}, mood rating: ${cell.mood ? cell.mood + ' out of 5' : 'unlogged'}`}
            >
              <AppText
                variant="caption"
                weight={hasMood || cell.isToday ? 'bold' : 'normal'}
                style={[styles.dayText, { color: textColor }]}
              >
                {cell.dayNumber}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* Mini Color Legend */}
      <View style={styles.legendRow}>
        <AppText variant="caption" color={colors.mutedText} style={{ marginRight: 8 }}>
          Mood:
        </AppText>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <View key={`legend-${lvl}`} style={styles.legendItem}>
            <View
              style={[
                styles.legendSquare,
                { backgroundColor: moodColorMap[lvl], borderRadius: borderRadius.xs },
              ]}
            />
            <AppText variant="caption" color={colors.mutedText} style={{ marginLeft: 3 }}>
              {lvl}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cellLabel: {
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 11,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  legendSquare: {
    width: 10,
    height: 10,
  },
});
