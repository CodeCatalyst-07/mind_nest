/**
 * src/screens/QuestionnaireScreen.js
 * Purpose: Interactive Weekly Questionnaire screen for student well-being (adapted WHO-5).
 * Displays one statement per page with 6 standardized answer options.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import OptionButton from '../components/OptionButton';
import { useTheme } from '../theme/ThemeContext';
import { QUESTIONNAIRE_ITEMS, ANSWER_OPTIONS } from '../data/questionnaire';

export default function QuestionnaireScreen({ navigation }) {
  const { colors, spacing } = useTheme();

  // Current question index (0 to 4)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers array holding selected values (0-5) for each of the 5 questions
  const [answers, setAnswers] = useState([null, null, null, null, null]);

  const currentQuestion = QUESTIONNAIRE_ITEMS[currentIndex];
  const selectedValue = answers[currentIndex];

  const handleSelectOption = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  return (
    <Screen style={styles.screen}>
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Close questionnaire"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <AppText variant="heading" style={styles.headerTitle}>
            Weekly Questionnaire
          </AppText>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Main Question Body */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <AppText variant="title" style={styles.questionText}>
            {currentQuestion.text}
          </AppText>
        </View>

        {/* Options List */}
        <View style={[styles.optionsContainer, { marginTop: spacing.md }]}>
          {ANSWER_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              isSelected={selectedValue === opt.value}
              onSelect={handleSelectOption}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 22,
    lineHeight: 32,
  },
  optionsContainer: {
    width: '100%',
  },
});
