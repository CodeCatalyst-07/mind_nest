/**
 * src/components/SleepBarChart.js
 * Purpose: Custom SVG vertical bar chart displaying sleep hours for each check-in.
 * Bars are dynamically colored based on that day's mood rating to reveal the
 * correlation between sleep duration and emotional well-being.
 * Includes a dashed reference line at 7 hours (student wellness guideline).
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function SleepBarChart({ checkIns = [] }) {
  const { colors, spacing, borderRadius } = useTheme();
  const [containerWidth, setContainerWidth] = useState(320);

  const height = 180;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 28;

  const graphWidth = Math.max(10, containerWidth - paddingLeft - paddingRight);
  const graphHeight = height - paddingTop - paddingBottom;
  const maxHours = 12;

  const getY = (hours) => {
    const clamped = Math.max(0, Math.min(maxHours, hours));
    return paddingTop + (maxHours - clamped) * (graphHeight / maxHours);
  };

  const moodColorMap = {
    1: colors.mood.level1,
    2: colors.mood.level2,
    3: colors.mood.level3,
    4: colors.mood.level4,
    5: colors.mood.level5,
  };

  const step = Math.max(1, Math.floor(checkIns.length / 6));
  const slotWidth = checkIns.length > 0 ? graphWidth / checkIns.length : graphWidth;
  const barWidth = Math.max(6, Math.min(24, slotWidth * 0.65));

  const y7h = getY(7);

  return (
    <View
      style={[
        styles.wrapper,
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
      accessibilityLabel={`Sleep duration chart for ${checkIns.length} check-ins, colored by daily mood`}
    >
      <View style={styles.header}>
        <AppText variant="subheading" weight="bold">
          Sleep Duration & Mood
        </AppText>
        <AppText variant="caption" color={colors.mutedText}>
          Target: 7+ hrs
        </AppText>
      </View>

      {checkIns.length === 0 ? (
        <View style={[styles.emptyContainer, { height: height - 20 }]}>
          <AppText variant="bodySmall" color={colors.mutedText}>
            No sleep logs recorded in this period.
          </AppText>
        </View>
      ) : (
        <Svg width={containerWidth} height={height}>
          {/* Y-axis Reference Gridlines: 0h, 4h, 8h, 12h */}
          {[0, 4, 8, 12].map((hrs) => {
            const y = getY(hrs);
            return (
              <React.Fragment key={`grid-hrs-${hrs}`}>
                <Line
                  x1={paddingLeft}
                  y1={y}
                  x2={containerWidth - paddingRight}
                  y2={y}
                  stroke={colors.border}
                  strokeDasharray="2 4"
                  strokeWidth="1"
                />
                <SvgText
                  x={paddingLeft - 6}
                  y={y + 4}
                  fontSize="10"
                  fill={colors.mutedText}
                  textAnchor="end"
                >
                  {hrs}h
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* 7-Hour Target Guideline */}
          <Line
            x1={paddingLeft}
            y1={y7h}
            x2={containerWidth - paddingRight}
            y2={y7h}
            stroke={colors.primary}
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <SvgText
            x={containerWidth - paddingRight}
            y={y7h - 4}
            fontSize="9"
            fill={colors.primary}
            textAnchor="end"
            fontWeight="bold"
          >
            7h goal
          </SvgText>

          {/* Sleep Bars */}
          {checkIns.map((item, index) => {
            const hours = typeof item.sleepHours === 'number' ? item.sleepHours : 0;
            const barH = (Math.min(maxHours, Math.max(0, hours)) / maxHours) * graphHeight;
            const barY = getY(hours);
            const barX = paddingLeft + index * slotWidth + (slotWidth - barWidth) / 2;
            const barColor = moodColorMap[item.mood] || colors.primary;

            return (
              <Rect
                key={`sleep-bar-${item.id || index}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={Math.max(2, barH)}
                rx={3}
                ry={3}
                fill={barColor}
              />
            );
          })}

          {/* X-axis Date Labels */}
          {checkIns.map((item, index) => {
            if (index !== 0 && index !== checkIns.length - 1 && index % step !== 0) {
              return null;
            }
            const barX = paddingLeft + index * slotWidth + slotWidth / 2;
            const shortDate = item.date ? item.date.slice(5) : '';

            return (
              <SvgText
                key={`lbl-sleep-${item.id || index}`}
                x={barX}
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
  wrapper: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
