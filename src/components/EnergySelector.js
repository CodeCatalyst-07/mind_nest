/**
 * src/components/EnergySelector.js
 * Purpose: 5-segment battery-style interactive bar for logging energy levels.
 * Features progressive animated fills and descriptive labels from "Drained" to "Fully Energised".
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { haptics } from '../utils/haptics';

const ENERGY_LEVELS = [
  { level: 1, label: 'Drained', color: '#EF4444' },
  { level: 2, label: 'Low Energy', color: '#F97316' },
  { level: 3, label: 'Moderate', color: '#EAB308' },
  { level: 4, label: 'Good Energy', color: '#10B981' },
  { level: 5, label: 'Fully Energised', color: '#0D9488' },
];

export default function EnergySelector({ selectedEnergy, onSelectEnergy }) {
  const { colors, spacing, borderRadius } = useTheme();
  const current = ENERGY_LEVELS.find((e) => e.level === selectedEnergy) || null;

  return (
    <View style={styles.container}>
      {/* Battery Container */}
      <View style={styles.batteryWrapper}>
        <View
          style={[
            styles.batteryBody,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {ENERGY_LEVELS.map((item) => (
            <BatterySegment
              key={item.level}
              level={item.level}
              isFilled={Boolean(selectedEnergy && selectedEnergy >= item.level)}
              fillColor={current ? current.color : colors.primary}
              onPress={() => {
                haptics.light();
                onSelectEnergy(item.level);
              }}
            />
          ))}
        </View>

        {/* Battery Terminal Tip */}
        <View
          style={[
            styles.batteryTip,
            {
              backgroundColor: colors.border,
              borderRadius: borderRadius.sm,
            },
          ]}
        />
      </View>

      {/* Energy Label */}
      <View style={[styles.labelContainer, { marginTop: spacing.md }]}>
        <AppText variant="heading" style={{ color: current ? current.color : colors.mutedText }}>
          {current ? `${current.level} / 5 — ${current.label}` : 'Tap a bar to select your energy'}
        </AppText>
      </View>
    </View>
  );
}

function BatterySegment({ level, isFilled, fillColor, onPress }) {
  const [fillAnim] = useState(() => new Animated.Value(isFilled ? 1 : 0));

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: isFilled ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFilled, fillAnim]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.segmentTouchArea}
      accessibilityRole="button"
      accessibilityLabel={`Energy level ${level}`}
    >
      <View style={styles.segmentBackground}>
        <Animated.View
          style={[
            styles.segmentFill,
            {
              backgroundColor: fillColor,
              opacity: fillAnim,
              transform: [{ scaleY: fillAnim }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  batteryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    maxWidth: 320,
  },
  batteryBody: {
    flex: 1,
    height: 60,
    borderWidth: 2,
    flexDirection: 'row',
    padding: 4,
    gap: 4,
  },
  batteryTip: {
    width: 8,
    height: 24,
    marginLeft: 3,
  },
  segmentTouchArea: {
    flex: 1,
    height: '100%',
  },
  segmentBackground: {
    flex: 1,
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#00000008',
  },
  segmentFill: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  labelContainer: {
    alignItems: 'center',
  },
});
