/**
 * src/components/Screen.js
 * Purpose: Safe area wrapper component that sets the theme background color.
 * Ensures consistent padding and protects content from device notches and home bars.
 */

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export default function Screen({ children, style, scrollable = false, ...props }) {
  const { colors, spacing } = useTheme();

  const contentStyle = [
    styles.container,
    { paddingHorizontal: spacing.md },
    style,
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
      {...props}
    >
      {scrollable ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 12,
  },
});
