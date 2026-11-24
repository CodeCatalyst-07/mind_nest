/**
 * src/components/AssessmentTrendChart.js
 * Purpose: Custom SVG line chart illustrating the trajectory of weekly WHO-5 assessment scores.
 * Includes faint horizontal reference lines at the category thresholds (72% Thriving,
 * 50% Doing okay, 29% Needs attention) so students can track overall well-being.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function AssessmentTrendChart({ assessments = [] }) {
  const { colors, spacing, borderRadius } = useTheme();
  const [containerWidth, setContainerWidth] = useState(320);

  const height = 160;
  const paddingLeft = 36;
  const paddingRight = 20;
  const paddingTop = 16;
  const paddingBottom = 24;

  const graphWidth = Math.max(10, containerWidth - paddingLeft - paddingRight);
  const graphHeight = height - paddingTop - paddingBottom;

  // Sort assessments chronologically (oldest to newest)
  const sorted = [...assessments].sort((a, b) => {
    const dateA = a.date || a.createdAt || '';
    const dateB = b.date || b.createdAt || '';
    return dateA > dateB ? 1 : -1;
  });

  const getY = (percentage) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    return paddingTop + (100 - clamped) * (graphHeight / 100);
  };

  const getX = (index, total) => {
    if (total <= 1) return paddingLeft + graphWidth / 2;
    return paddingLeft + (index / (total - 1)) * graphWidth;
  };

  const getCategoryColor = (score) => {
    if (score >= 72) return colors.mood.level5;
    if (score >= 50) return colors.mood.level4;
    if (score >= 29) return colors.mood.level2;
    return colors.mood.level1;
  };

  // Generate SVG path string
  let linePath = '';
  if (sorted.length > 0) {
    const points = sorted.map((item, index) => ({
      x: getX(index, sorted.length),
      y: getY(item.score !== undefined ? item.score : 0),
    }));

    linePath =
      `M ${points[0].x} ${points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x} ${p.y}`)
        .join(' ');
  }

  // Threshold lines config
  const thresholds = [
    { value: 72, label: '72% Thriving', color: colors.mood.level5 },
    { value: 50, label: '50% Okay', color: colors.mood.level4 },
    { value: 29, label: '29% Attention', color: colors.mood.level2 },
  ];

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
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w - spacing.md * 2);
      }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`WHO-5 well-being assessment score trajectory showing ${sorted.length} weekly self-checks with category threshold guidelines`}
    >
      <View style={styles.header}>
        <AppText variant="subheading" weight="bold">
          Well-Being Score Trajectory
        </AppText>
        <AppText variant="caption" color={colors.mutedText}>
          WHO-5 Index (0–100%)
        </AppText>
      </View>

      {sorted.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant="bodySmall" color={colors.mutedText}>
            No weekly assessments logged yet. Take your first WHO-5 check from the Home screen.
          </AppText>
        </View>
      ) : (
        <Svg width={containerWidth} height={height}>
          {/* Threshold Lines */}
          {thresholds.map((th) => {
            const y = getY(th.value);
            return (
              <React.Fragment key={`thresh-${th.value}`}>
                <Line
                  x1={paddingLeft}
                  y1={y}
                  x2={containerWidth - paddingRight}
                  y2={y}
                  stroke={colors.border}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <SvgText
                  x={containerWidth - paddingRight}
                  y={y - 3}
                  fontSize="8"
                  fill={colors.mutedText}
                  textAnchor="end"
                >
                  {th.label}
                </SvgText>
                <SvgText
                  x={paddingLeft - 6}
                  y={y + 3}
                  fontSize="9"
                  fill={colors.mutedText}
                  textAnchor="end"
                >
                  {th.value}%
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Assessment Score Line */}
          {linePath ? (
            <Path
              d={linePath}
              stroke={colors.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Score Node Dots */}
          {sorted.map((item, index) => {
            const cx = getX(index, sorted.length);
            const cy = getY(item.score || 0);
            const dotColor = getCategoryColor(item.score || 0);

            return (
              <Circle
                key={`score-dot-${item.id || index}`}
                cx={cx}
                cy={cy}
                r={5}
                fill={dotColor}
                stroke={colors.card}
                strokeWidth={2}
              />
            );
          })}

          {/* X-axis Date Labels */}
          {sorted.map((item, index) => {
            const cx = getX(index, sorted.length);
            const shortDate = item.date ? item.date.slice(5) : '';

            return (
              <SvgText
                key={`score-lbl-${item.id || index}`}
                x={cx}
                y={height - 6}
                fontSize="10"
                fill={colors.mutedText}
                textAnchor="middle"
              >
                {shortDate}
              </SvgText>
            );
          })}
        </Svg>
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
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
