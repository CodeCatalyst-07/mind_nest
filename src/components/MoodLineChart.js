/**
 * src/components/MoodLineChart.js
 * Purpose: Custom SVG line chart displaying mood trajectory over time.
 * Features a gradient area fill under the line, mood-colored node circles,
 * subtle background reference gridlines, and day labels.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function MoodLineChart({ checkIns = [] }) {
  const { colors, spacing, borderRadius } = useTheme();
  const [containerWidth, setContainerWidth] = useState(320);

  const height = 180;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 28;

  const graphWidth = Math.max(10, containerWidth - paddingLeft - paddingRight);
  const graphHeight = height - paddingTop - paddingBottom;

  const getY = (mood) => {
    const clamped = Math.max(1, Math.min(5, mood));
    return paddingTop + (5 - clamped) * (graphHeight / 4);
  };

  const getX = (index, total) => {
    if (total <= 1) return paddingLeft + graphWidth / 2;
    return paddingLeft + (index / (total - 1)) * graphWidth;
  };

  const moodColorMap = {
    1: colors.mood.level1,
    2: colors.mood.level2,
    3: colors.mood.level3,
    4: colors.mood.level4,
    5: colors.mood.level5,
  };

  // Generate path string
  let linePath = '';
  let areaPath = '';

  if (checkIns.length > 0) {
    const points = checkIns.map((item, index) => ({
      x: getX(index, checkIns.length),
      y: getY(item.mood),
    }));

    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');

    const bottomY = paddingTop + graphHeight;
    areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }

  // Generate X-axis short date labels (show max ~7 labels evenly)
  const step = Math.max(1, Math.floor(checkIns.length / 6));

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
      accessibilityLabel={`Mood trajectory chart showing ${checkIns.length} check-ins`}
    >
      <View style={styles.header}>
        <AppText variant="subheading" weight="bold">
          Mood Trajectory
        </AppText>
        <AppText variant="caption" color={colors.mutedText}>
          Scale: 1 (Low) to 5 (Great)
        </AppText>
      </View>

      {checkIns.length === 0 ? (
        <View style={[styles.emptyContainer, { height: height - 20 }]}>
          <AppText variant="bodySmall" color={colors.mutedText}>
            No check-ins logged for this time period yet.
          </AppText>
        </View>
      ) : (
        <Svg width={containerWidth} height={height}>
          <Defs>
            <LinearGradient id="moodAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity="0.4" />
              <Stop offset="1" stopColor={colors.primary} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Horizontal Gridlines for Mood 1 to 5 */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const y = getY(lvl);
            return (
              <React.Fragment key={`grid-${lvl}`}>
                <Line
                  x1={paddingLeft}
                  y1={y}
                  x2={containerWidth - paddingRight}
                  y2={y}
                  stroke={colors.border}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <SvgText
                  x={paddingLeft - 8}
                  y={y + 4}
                  fontSize="11"
                  fill={colors.mutedText}
                  textAnchor="end"
                >
                  {lvl}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Area Fill */}
          {areaPath ? <Path d={areaPath} fill="url(#moodAreaGrad)" /> : null}

          {/* Connecting Line */}
          {linePath ? (
            <Path
              d={linePath}
              stroke={colors.primary}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Mood Node Dots */}
          {checkIns.map((item, index) => {
            const cx = getX(index, checkIns.length);
            const cy = getY(item.mood);
            const dotColor = moodColorMap[item.mood] || colors.primary;

            return (
              <Circle
                key={`dot-${item.id || index}`}
                cx={cx}
                cy={cy}
                r={index === checkIns.length - 1 ? 6 : 4.5}
                fill={dotColor}
                stroke={colors.card}
                strokeWidth={2}
              />
            );
          })}

          {/* X-axis Date Labels */}
          {checkIns.map((item, index) => {
            // Show label for first, last, and every step
            if (index !== 0 && index !== checkIns.length - 1 && index % step !== 0) {
              return null;
            }

            const cx = getX(index, checkIns.length);
            const shortDate = item.date ? item.date.slice(5) : ''; // "11-24"

            return (
              <SvgText
                key={`lbl-${item.id || index}`}
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
