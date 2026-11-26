/**
 * src/components/Card.js
 * Purpose: Rounded surface card component with soft shadows, borders, and subtle press animation.
 * Can be used as a static content container or as an interactive clickable card with onPress.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function Card({ children, style, onPress, onPressIn, onPressOut, ...props }) {
  const { colors, spacing, borderRadius, isDark } = useTheme();
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = (e) => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 150,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    Platform.select({
      ios: {
        shadowColor: isDark ? '#000000' : '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyles}
          {...props}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
