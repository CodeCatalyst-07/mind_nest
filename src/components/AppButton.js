/**
 * src/components/AppButton.js
 * Purpose: Reusable button component supporting primary, secondary, and outline variants.
 * Guarantees accessible minimum touch targets (>= 48px), disabled states, and spring press scale.
 */

import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, Animated } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) {
  const { colors, borderRadius } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  // Determine background and text colors based on variant
  let backgroundColor = colors.primary;
  let textColor = '#FFFFFF';
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (variant === 'secondary') {
    backgroundColor = colors.card;
    textColor = colors.text;
    borderWidth = 1;
    borderColor = colors.border;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
    borderWidth = 1.5;
    borderColor = colors.primary;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = colors.mutedText;
  }

  const {
    backgroundColor: customBg,
    borderColor: customBorderColor,
    borderWidth: customBorderWidth,
    ...layoutStyle
  } = StyleSheet.flatten(style) || {};

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, layoutStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.button,
          {
            backgroundColor: customBg || backgroundColor,
            borderColor: customBorderColor || borderColor,
            borderWidth: customBorderWidth !== undefined ? customBorderWidth : borderWidth,
            borderRadius: borderRadius.md,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <View style={styles.contentRow}>
            {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
            <AppText
              variant="heading"
              style={[
                styles.text,
                { color: textColor },
                textStyle,
              ]}
            >
              {title}
            </AppText>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
