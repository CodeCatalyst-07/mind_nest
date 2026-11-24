/**
 * src/components/AppButton.js
 * Purpose: Reusable button component supporting primary, secondary, and outline variants.
 * Guarantees accessible minimum touch targets (>= 48px) and a smooth disabled state.
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
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
}) {
  const { colors, borderRadius } = useTheme();

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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: borderRadius.md,
          opacity: disabled ? 0.45 : 1,
        },
        style,
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
