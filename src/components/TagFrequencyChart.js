/**
 * src/components/TagFrequencyChart.js
 * Purpose: Horizontal progress bar chart showing the frequency of tags recorded by the student.
 * Helps identify the most common stressors, activities, and wellness factors in their routine.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function TagFrequencyChart({ checkIns = [] }) {
  const { colors, spacing, borderRadius } = useTheme();

  // Aggregate tags
  const tagCounts = {};
  let totalTagsCount = 0;

  checkIns.forEach((item) => {
    if (Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        if (tag) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          totalTagsCount += 1;
        }
      });
    }
  });

  const sortedTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Display top 6 tags

  const maxCount = sortedTags.length > 0 ? sortedTags[0].count : 1;

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
      accessibilityLabel={`Tag frequency chart showing ${sortedTags.length} active tags`}
    >
      <View style={styles.header}>
        <AppText variant="subheading" weight="bold">
          Top Context Tags
        </AppText>
        <AppText variant="caption" color={colors.mutedText}>
          {totalTagsCount} logged
        </AppText>
      </View>

      {sortedTags.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant="bodySmall" color={colors.mutedText}>
            No tags selected in this time period.
          </AppText>
        </View>
      ) : (
        <View style={styles.list}>
          {sortedTags.map((item) => {
            const percentage = (item.count / maxCount) * 100;

            return (
              <View key={`tag-bar-${item.name}`} style={styles.tagRow}>
                <View style={styles.tagInfo}>
                  <AppText variant="bodySmall" weight="medium" style={styles.tagName}>
                    {item.name}
                  </AppText>
                  <AppText variant="caption" color={colors.mutedText}>
                    {item.count} {item.count === 1 ? 'time' : 'times'}
                  </AppText>
                </View>

                {/* Progress Bar Track */}
                <View
                  style={[
                    styles.track,
                    {
                      backgroundColor: colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.max(6, percentage)}%`,
                        backgroundColor: colors.primary,
                        borderRadius: borderRadius.full,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  emptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 12,
  },
  tagRow: {
    gap: 6,
  },
  tagInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagName: {
    textTransform: 'capitalize',
  },
  track: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
