/**
 * src/components/TagChips.js
 * Purpose: Selectable tag chips for student life context (Studies, Friends, Sleep, etc.).
 * Supports multi-selection with smooth visual feedback and haptics.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { haptics } from '../utils/haptics';

export const AVAILABLE_TAGS = [
  'Studies',
  'Friends',
  'Family',
  'Sleep',
  'Health',
  'Exercise',
  'Social media',
];

export default function TagChips({ selectedTags = [], onToggleTag }) {
  const { colors, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      {AVAILABLE_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);

        return (
          <TouchableOpacity
            key={tag}
            activeOpacity={0.7}
            onPress={() => {
              haptics.selection();
              onToggleTag(tag);
            }}
            accessibilityRole="checkbox"
            accessibilityLabel={`Tag: ${tag}`}
            accessibilityState={{ checked: isSelected }}
            style={[
              styles.chip,
              {
                borderRadius: borderRadius.round,
                backgroundColor: isSelected ? colors.primaryLight : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: isSelected ? 1.5 : 1,
              },
            ]}
          >
            <AppText
              variant="caption"
              style={[
                styles.chipText,
                {
                  color: isSelected ? colors.primary : colors.text,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {tag}
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
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
  },
});
