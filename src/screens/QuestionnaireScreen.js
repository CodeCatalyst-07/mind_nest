/**
 * src/screens/QuestionnaireScreen.js
 * Purpose: Interactive Weekly Questionnaire screen for student well-being (adapted WHO-5).
 * Features one question per page, animated transitions, back navigation, and answer validation.
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import ProgressBar from '../components/ProgressBar';
import OptionButton from '../components/OptionButton';
import AppButton from '../components/AppButton';
import { useTheme } from '../theme/ThemeContext';
import { QUESTIONNAIRE_ITEMS, ANSWER_OPTIONS } from '../data/questionnaire';

export default function QuestionnaireScreen({ navigation }) {
  const { colors, spacing } = useTheme();

  // Current question index (0 to 4)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers array holding selected values (0-5) for each of the 5 questions
  const [answers, setAnswers] = useState([null, null, null, null, null]);

  // Transition animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = QUESTIONNAIRE_ITEMS[currentIndex];
  const selectedValue = answers[currentIndex];
  const isAnswered = selectedValue !== null;
  const isLastQuestion = currentIndex === QUESTIONNAIRE_ITEMS.length - 1;

  /**
   * Smoothly animates question content out, updates state, and animates new content in.
   */
  const animateToQuestion = (newIndex) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: newIndex > currentIndex ? -15 : 15, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(newIndex);
      slideAnim.setValue(newIndex > currentIndex ? 15 : -15);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleSelectOption = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (!isAnswered) return;
    if (!isLastQuestion) {
      animateToQuestion(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      animateToQuestion(currentIndex - 1);
    }
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

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <AppText variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
            QUESTION {currentIndex + 1} OF {QUESTIONNAIRE_ITEMS.length}
          </AppText>
        </View>
        <ProgressBar currentStep={currentIndex} totalSteps={QUESTIONNAIRE_ITEMS.length} />
      </View>

      {/* Main Question Body with Slide / Fade Animation */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.questionContainer}>
            <AppText variant="title" style={styles.questionText}>
              {currentQuestion.text}
            </AppText>
          </View>

          {/* Options List */}
          <View style={[styles.optionsContainer, { marginTop: spacing.sm }]}>
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
        </Animated.View>
      </ScrollView>

      {/* Bottom Bar: Back Navigation and Answer Validation */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
        {currentIndex > 0 ? (
          <AppButton
            title="Back"
            variant="secondary"
            onPress={handleBack}
            style={styles.backButton}
          />
        ) : null}

        <AppButton
          title={isLastQuestion ? 'View Results' : 'Next'}
          variant="primary"
          disabled={!isAnswered}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
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
  progressSection: {
    paddingTop: 8,
  },
  progressHeader: {
    paddingHorizontal: 20,
    marginBottom: -4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  animatedContainer: {
    width: '100%',
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
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
