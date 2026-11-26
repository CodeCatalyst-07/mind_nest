/**
 * src/components/Screen.js
 * Purpose: Safe area wrapper component that sets the theme background color.
 * Includes a subtle fade + slide entrance transition for calm screen transitions.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export default function Screen({ children, style, scrollable = false, disableEntrance = false, ...props }) {
  const { colors, spacing } = useTheme();
  const fadeAnim = useRef(new Animated.Value(disableEntrance ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(disableEntrance ? 0 : 10)).current;

  useEffect(() => {
    if (disableEntrance) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disableEntrance, fadeAnim, slideAnim]);

  const contentStyle = [
    scrollable ? styles.scrollContainer : styles.container,
    { paddingHorizontal: spacing.md },
    style,
  ];

  const animatedStyle = {
    flex: 1,
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

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
          <Animated.View style={animatedStyle}>{children}</Animated.View>
        </ScrollView>
      ) : (
        <Animated.View style={[contentStyle, animatedStyle]}>{children}</Animated.View>
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
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 12,
  },
});
