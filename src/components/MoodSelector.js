/**
 * src/components/MoodSelector.js
 * Purpose: 5 large circular emoji buttons for selecting daily mood.
 * Uses spring animations for the selected state and applies theme mood colors.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import AppText from './AppText';
import { MOODS } from '../data/moods';
import { useTheme } from '../theme/ThemeContext';
import { haptics } from '../utils/haptics';

export default function MoodSelector({ selectedMood, onSelectMood }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {MOODS.map((mood) => (
        <MoodButton
          key={mood.value}
          mood={mood}
          isSelected={selectedMood === mood.value}
          moodColor={colors.mood[mood.colorKey]}
          onPress={() => {
            haptics.selection();
            onSelectMood(mood.value);
          }}
        />
      ))}
    </View>
  );
}

function MoodButton({ mood, isSelected, moodColor, onPress }) {
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1.18 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.18 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Mood: ${mood.label}`}
      accessibilityState={{ selected: isSelected }}
      style={styles.touchArea}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: moodColor + '30', // Soft pastel background
            borderColor: isSelected ? moodColor : 'transparent',
            borderWidth: isSelected ? 3 : 1.5,
            transform: [{ scale: scaleAnim }],
          },
          isSelected && styles.selectedGlow,
        ]}
      >
        <AppText style={styles.emoji}>{mood.emoji}</AppText>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 8,
  },
  touchArea: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  selectedGlow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
