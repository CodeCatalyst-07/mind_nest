/**
 * src/components/OptionButton.js
 * Purpose: Accessible radio-style option selector button for questionnaire answers.
 * Provides clear visual feedback, theme integration, and accessible touch targets.
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function OptionButton({
  label,
  description,
  value,
  isSelected = false,
  onSelect,
}) {
  const { colors, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onSelect(value)}
      accessibilityRole="radio"
      accessibilityLabel={`${label}${description ? `, ${description}` : ''}`}
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.button,
        {
          borderRadius: borderRadius.md,
          backgroundColor: isSelected ? colors.primaryLight + '35' : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 1.5 : 1,
        },
      ]}
    >
      {/* Radio Circle Indicator */}
      <View
        style={[
          styles.radioCircle,
          {
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isSelected ? colors.primary : 'transparent',
          },
        ]}
      >
        {isSelected ? <View style={styles.radioInnerDot} /> : null}
      </View>

      {/* Label and Description */}
      <View style={styles.textContainer}>
        <AppText
          variant="body"
          style={[
            styles.label,
            {
              color: isSelected ? colors.primary : colors.text,
              fontWeight: isSelected ? '700' : '500',
            },
          ]}
        >
          {label}
        </AppText>
        {description ? (
          <AppText variant="caption" color={colors.mutedText} style={styles.description}>
            {description}
          </AppText>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 5,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  description: {
    marginTop: 2,
  },
});
