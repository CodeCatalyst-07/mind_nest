/**
 * src/components/SegmentedControl.js
 * Purpose: A modern, animated horizontal segment switcher (e.g., 7 Days vs 30 Days).
 * Uses React Native's built-in Animated API to glide an active pill indicator between options.
 */

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function SegmentedControl({
  options = [],
  selectedValue,
  onSelect,
  style,
}) {
  const { colors, borderRadius, spacing } = useTheme();

  // Find active index
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => (opt.value !== undefined ? opt.value === selectedValue : opt === selectedValue))
  );

  // Animated position value (0 to options.length - 1)
  const animValue = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: activeIndex,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [activeIndex, animValue]);

  const numOptions = Math.max(1, options.length);
  const segmentWidthPercent = 100 / numOptions;

  const leftInterpolate = animValue.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => `${i * segmentWidthPercent}%`),
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.full,
          padding: 4,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {/* Animated Sliding Pill */}
      <Animated.View
        style={[
          styles.activePill,
          {
            width: `${segmentWidthPercent}%`,
            left: leftInterpolate,
            backgroundColor: colors.primary,
            borderRadius: borderRadius.full,
          },
        ]}
      />

      {/* Segment Buttons */}
      {options.map((option, index) => {
        const label = typeof option === 'object' ? option.label : option;
        const value = typeof option === 'object' ? option.value : option;
        const isSelected = index === activeIndex;

        return (
          <TouchableOpacity
            key={`seg-${index}-${label}`}
            style={styles.segment}
            activeOpacity={0.7}
            onPress={() => onSelect && onSelect(value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={label}
          >
            <AppText
              variant="bodySmall"
              weight={isSelected ? 'bold' : 'medium'}
              color={isSelected ? '#FFFFFF' : colors.mutedText}
              style={styles.label}
            >
              {label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    height: 48,
    alignItems: 'center',
    borderWidth: 1,
  },
  activePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    zIndex: 1,
  },
  segment: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  label: {
    textAlign: 'center',
  },
});
