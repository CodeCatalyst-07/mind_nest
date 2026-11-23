/**
 * src/components/Card.js
 * Purpose: Rounded surface card component with soft shadows and borders.
 * Can be used as a static content container or as a clickable card with onPress.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function Card({ children, style, onPress, ...props }) {
  const { colors, spacing, borderRadius, isDark } = useTheme();

  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    // Gentle subtle shadow that works on both iOS and Android
    Platform.select({
      ios: {
        shadowColor: isDark ? '#000000' : '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: isDark ? 2 : 2,
      },
    }),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={cardStyles}
        {...props}
      >
        {children}
      </TouchableOpacity>
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
