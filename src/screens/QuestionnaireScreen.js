/**
 * src/screens/QuestionnaireScreen.js
 * Purpose: Interactive Weekly Questionnaire screen for student well-being (adapted WHO-5).
 * Features one question per page, animated transitions, score calculation,
 * and an animated result screen with category, feedback, and non-diagnostic disclaimer.
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import OptionButton from '../components/OptionButton';
import AppButton from '../components/AppButton';
import ScoreGauge from '../components/ScoreGauge';

import { useTheme } from '../theme/ThemeContext';
import { QUESTIONNAIRE_ITEMS, ANSWER_OPTIONS } from '../data/questionnaire';
import { scoreQuestionnaire } from '../utils/scoring';

export default function QuestionnaireScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();

  // Current question index (0 to 4)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers array holding selected values (0-5) for each of the 5 questions
  const [answers, setAnswers] = useState([null, null, null, null, null]);

  // Shows results view after question 5 is submitted
  const [showResult, setShowResult] = useState(false);

  // Transition animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = QUESTIONNAIRE_ITEMS[currentIndex];
  const selectedValue = answers[currentIndex];
  const isAnswered = selectedValue !== null;
  const isLastQuestion = currentIndex === QUESTIONNAIRE_ITEMS.length - 1;

  // Computed score breakdown
  const scoringResult = scoreQuestionnaire(answers);

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
    if (isLastQuestion) {
      setShowResult(true);
    } else {
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
            {showResult ? 'Assessment Results' : 'Weekly Questionnaire'}
          </AppText>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {showResult ? (
        /* =================== RESULTS SCREEN =================== */
        <ScrollView contentContainerStyle={styles.resultScrollContent} showsVerticalScrollIndicator={false}>
          {/* Animated SVG Score Gauge */}
          <ScoreGauge
            score={scoringResult.percentage}
            color={scoringResult.color}
            size={190}
            strokeWidth={16}
          />

          {/* Category Badge & Headline */}
          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: scoringResult.color + '20',
                  borderColor: scoringResult.color,
                  borderRadius: borderRadius.round,
                },
              ]}
            >
              <AppText variant="caption" style={[styles.categoryBadgeText, { color: scoringResult.color }]}>
                {scoringResult.category.toUpperCase()}
              </AppText>
            </View>

            <AppText variant="title" style={styles.resultHeadline}>
              {scoringResult.category}
            </AppText>

            <AppText variant="body" color={colors.mutedText} style={styles.resultDescription}>
              {scoringResult.description}
            </AppText>
          </View>

          {/* Non-Diagnostic Disclaimer Card */}
          <Card style={[styles.disclaimerCard, { borderColor: colors.border }]}>
            <View style={styles.disclaimerRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              <AppText variant="caption" color={colors.mutedText} style={styles.disclaimerText}>
                This is a self-check, not a diagnosis. It is designed to encourage gentle student reflection on your well-being patterns.
              </AppText>
            </View>
          </Card>

          {/* Done Button */}
          <AppButton
            title="Return to Home"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={{ width: '100%', marginTop: spacing.lg }}
          />
        </ScrollView>
      ) : (
        /* =================== QUESTION FLOW =================== */
        <>
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
        </>
      )}
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
  resultScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  categoryContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  resultHeadline: {
    fontSize: 26,
    textAlign: 'center',
  },
  resultDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  disclaimerCard: {
    width: '100%',
    padding: 14,
    marginTop: 10,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 18,
  },
});
