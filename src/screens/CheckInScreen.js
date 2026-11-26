/**
 * src/screens/CheckInScreen.js
 * Purpose: Complete 5-step Daily Check-in flow for MindNest with designer-quality UI.
 * Guides the student through Mood, Energy, Sleep, Tags/Notes, and Review steps,
 * includes ambient mood gradient lighting, haptics, edit mode, and discard protection.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import AppButton from '../components/AppButton';
import MoodSelector from '../components/MoodSelector';
import EnergySelector from '../components/EnergySelector';
import SleepPicker from '../components/SleepPicker';
import TagChips from '../components/TagChips';

import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { getMoodByValue } from '../data/moods';
import { getSupportiveMessage } from '../data/messages';
import { toDateKey } from '../utils/dateUtils';
import { haptics } from '../utils/haptics';

const TOTAL_STEPS = 4; // Step 0: Mood, 1: Energy, 2: Sleep, 3: Note/Tags. Step 4 is Review.

export default function CheckInScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { getTodayCheckIn, saveCheckIn } = useData();

  // Check if user is editing an already completed check-in for today
  const existingCheckIn = getTodayCheckIn();
  const isEditing = Boolean(existingCheckIn);

  // Draft state
  const [draft, setDraft] = useState({
    mood: existingCheckIn ? existingCheckIn.mood : null,
    energy: existingCheckIn ? existingCheckIn.energy : null,
    sleepHours: existingCheckIn ? existingCheckIn.sleepHours : 7.0,
    note: existingCheckIn ? existingCheckIn.note || '' : '',
    tags: existingCheckIn ? existingCheckIn.tags || [] : [],
  });

  // Track initial snapshot to detect unsaved changes for discard prompt
  const initialSnapshot = useRef(JSON.stringify(draft)).current;

  // Navigation steps: 0 (Mood) -> 1 (Energy) -> 2 (Sleep) -> 3 (Notes) -> 4 (Review)
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Animations for success view
  const successScaleAnim = useRef(new Animated.Value(0.3)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;

  // Selected mood definition for color tinting
  const activeMoodObj = draft.mood ? getMoodByValue(draft.mood) : null;
  const activeMoodColor = activeMoodObj ? colors.mood[activeMoodObj.colorKey] : null;

  // Check if draft has unsaved edits
  const hasUnsavedChanges = JSON.stringify(draft) !== initialSnapshot;

  // Discard alert handler
  const handleClose = () => {
    if (isSuccess || !hasUnsavedChanges) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Discard check-in?',
      'You have unsaved changes that will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  // Step validation to enable/disable Next button
  const isNextDisabled = () => {
    if (currentStep === 0) return draft.mood === null;
    if (currentStep === 1) return draft.energy === null;
    return false; // Sleep and notes have defaults / are optional
  };

  const handleNext = () => {
    haptics.light();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    haptics.light();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Save Check-in handler
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveCheckIn({
        date: toDateKey(new Date()),
        mood: draft.mood,
        energy: draft.energy,
        sleepHours: draft.sleepHours,
        note: draft.note,
        tags: draft.tags,
      });

      haptics.success();
      setIsSuccess(true);

      // Trigger celebratory spring animation
      Animated.parallel([
        Animated.spring(successScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(successFadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } catch {
      Alert.alert('Save Error', 'Could not save check-in. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Tag chip toggle
  const handleToggleTag = (tag) => {
    setDraft((prev) => {
      const exists = prev.tags.includes(tag);
      const updatedTags = exists
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: updatedTags };
    });
  };

  return (
    <Screen style={styles.screen}>
      {/* Ambient Mood Gradient Tint */}
      {activeMoodColor && !isSuccess ? (
        <LinearGradient
          colors={[activeMoodColor + '20', colors.background]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          pointerEvents="none"
        />
      ) : null}

      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Close check-in"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <AppText variant="heading" style={styles.headerTitle}>
            {isSuccess
              ? 'Check-in Complete'
              : isEditing
              ? "Update Today's Check-in"
              : 'Daily Check-in'}
          </AppText>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* 4-Step Animated Progress Bar (hidden on review & success) */}
      {!isSuccess && currentStep < 4 ? (
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      ) : null}

      {/* Content Area */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isSuccess ? (
            /* =================== SUCCESS SCREEN =================== */
            <Animated.View
              style={[
                styles.successContainer,
                {
                  opacity: successFadeAnim,
                  transform: [{ scale: successScaleAnim }],
                },
              ]}
            >
              <View
                style={[
                  styles.successCheckCircle,
                  { backgroundColor: activeMoodColor || colors.primary },
                ]}
              >
                <Ionicons name="checkmark" size={48} color="#FFFFFF" />
              </View>

              <AppText variant="title" style={{ marginTop: 24, textAlign: 'center' }}>
                {getSupportiveMessage(draft.mood).headline}
              </AppText>

              <Card style={{ marginTop: 20, padding: 18, width: '100%' }}>
                <AppText
                  variant="body"
                  color={colors.mutedText}
                  style={{ textAlign: 'center', lineHeight: 24 }}
                >
                  {getSupportiveMessage(draft.mood).message}
                </AppText>
              </Card>

              <AppButton
                title="Back to Home"
                onPress={() => navigation.goBack()}
                style={{ width: '100%', marginTop: 24 }}
              />
            </Animated.View>
          ) : currentStep === 0 ? (
            /* =================== STEP 1: MOOD =================== */
            <View style={styles.stepContainer}>
              <AppText variant="title" style={styles.questionTitle}>
                How are you feeling today?
              </AppText>
              <AppText variant="caption" color={colors.mutedText} style={styles.questionSubtitle}>
                Select the emoji that best captures your mood right now.
              </AppText>

              <MoodSelector
                selectedMood={draft.mood}
                onSelectMood={(mood) => setDraft((prev) => ({ ...prev, mood }))}
              />

              {activeMoodObj ? (
                <View
                  style={[
                    styles.moodFeedbackCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: activeMoodColor,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  <AppText variant="heading" style={{ color: activeMoodColor }}>
                    {activeMoodObj.emoji} {activeMoodObj.label}
                  </AppText>
                  <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 4 }}>
                    {activeMoodObj.value <= 2
                      ? "It's completely okay to have difficult days. You are not alone."
                      : activeMoodObj.value === 3
                      ? 'A calm, steady day. Take things at your own pace.'
                      : 'Great to see you in good spirits! Keep that positive momentum.'}
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : currentStep === 1 ? (
            /* =================== STEP 2: ENERGY =================== */
            <View style={styles.stepContainer}>
              <AppText variant="title" style={styles.questionTitle}>
                How is your energy?
              </AppText>
              <AppText variant="caption" color={colors.mutedText} style={styles.questionSubtitle}>
                Tap the battery to rate your physical & mental vitality.
              </AppText>

              <EnergySelector
                selectedEnergy={draft.energy}
                onSelectEnergy={(energy) => setDraft((prev) => ({ ...prev, energy }))}
              />
            </View>
          ) : currentStep === 2 ? (
            /* =================== STEP 3: SLEEP =================== */
            <View style={styles.stepContainer}>
              <AppText variant="title" style={styles.questionTitle}>
                How did you sleep last night?
              </AppText>
              <AppText variant="caption" color={colors.mutedText} style={styles.questionSubtitle}>
                Adjust the stepper to log your approximate hours of rest.
              </AppText>

              <SleepPicker
                hours={draft.sleepHours}
                onChangeHours={(sleepHours) => setDraft((prev) => ({ ...prev, sleepHours }))}
              />
            </View>
          ) : currentStep === 3 ? (
            /* =================== STEP 4: NOTES & TAGS =================== */
            <View style={styles.stepContainer}>
              <AppText variant="title" style={styles.questionTitle}>
                Anything on your mind?
              </AppText>
              <AppText variant="caption" color={colors.mutedText} style={styles.questionSubtitle}>
                Select topics that influenced your day and jot down a reflection.
              </AppText>

              {/* Tag Chips */}
              <AppText variant="heading" style={{ marginTop: 8 }}>
                Context Tags
              </AppText>
              <TagChips selectedTags={draft.tags} onToggleTag={handleToggleTag} />

              {/* Multiline Note Input */}
              <View style={styles.noteSection}>
                <View style={styles.noteHeader}>
                  <AppText variant="heading">Journal Reflection</AppText>
                  <AppText variant="caption" color={colors.mutedText}>
                    {draft.note.length} / 200
                  </AppText>
                </View>

                <TextInput
                  value={draft.note}
                  onChangeText={(text) => {
                    if (text.length <= 200) {
                      setDraft((prev) => ({ ...prev, note: text }));
                    }
                  }}
                  placeholder="How was college today? Any wins or challenges? (Optional)"
                  placeholderTextColor={colors.mutedText + '99'}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.text,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                />
              </View>
            </View>
          ) : (
            /* =================== STEP 5: REVIEW =================== */
            <View style={styles.stepContainer}>
              <AppText variant="title" style={styles.questionTitle}>
                Looks good?
              </AppText>
              <AppText variant="caption" color={colors.mutedText} style={styles.questionSubtitle}>
                Review your entry before saving it to your daily log.
              </AppText>

              {/* Summary Card */}
              <Card style={styles.reviewCard}>
                {/* Mood Row */}
                <View style={styles.reviewRow}>
                  <AppText variant="heading">Mood</AppText>
                  <View style={styles.reviewBadge}>
                    <AppText style={{ fontSize: 20 }}>{activeMoodObj?.emoji}</AppText>
                    <AppText variant="heading" style={{ marginLeft: 6, color: activeMoodColor }}>
                      {activeMoodObj?.label}
                    </AppText>
                  </View>
                </View>

                {/* Energy Row */}
                <View style={[styles.reviewRow, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
                  <AppText variant="heading">Energy Level</AppText>
                  <AppText variant="body" color={colors.primary} style={{ fontWeight: '600' }}>
                    {draft.energy} / 5
                  </AppText>
                </View>

                {/* Sleep Row */}
                <View style={[styles.reviewRow, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
                  <AppText variant="heading">Sleep Rest</AppText>
                  <AppText variant="body" color={colors.accent} style={{ fontWeight: '600' }}>
                    {draft.sleepHours.toFixed(1)} hrs
                  </AppText>
                </View>

                {/* Tags Row */}
                {draft.tags.length > 0 ? (
                  <View style={[styles.reviewRowTags, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
                    <AppText variant="heading" style={{ marginBottom: 6 }}>
                      Tags
                    </AppText>
                    <View style={styles.tagWrap}>
                      {draft.tags.map((t) => (
                        <View
                          key={t}
                          style={[
                            styles.smallTag,
                            {
                              backgroundColor: colors.primaryLight,
                              borderRadius: borderRadius.round,
                            },
                          ]}
                        >
                          <AppText variant="caption" color={colors.primary} style={{ fontWeight: '600' }}>
                            {t}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                {/* Note Row */}
                {draft.note.trim() ? (
                  <View style={[styles.reviewRowNote, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
                    <AppText variant="heading" style={{ marginBottom: 4 }}>
                      Reflection
                    </AppText>
                    <AppText variant="body" color={colors.mutedText}>
                      "{draft.note.trim()}"
                    </AppText>
                  </View>
                ) : null}
              </Card>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      {!isSuccess ? (
        <View style={[styles.bottomBar, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
          {currentStep > 0 ? (
            <AppButton
              title="Back"
              variant="secondary"
              onPress={handleBack}
              style={styles.backButton}
            />
          ) : null}

          {currentStep < 4 ? (
            <AppButton
              title="Continue"
              variant="primary"
              disabled={isNextDisabled()}
              onPress={handleNext}
              style={styles.nextButton}
            />
          ) : (
            <AppButton
              title={isEditing ? 'Update Check-in' : 'Save Check-in'}
              variant="primary"
              loading={isSaving}
              onPress={handleSave}
              style={styles.nextButton}
            />
          )}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  flex: {
    flex: 1,
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  stepContainer: {
    width: '100%',
  },
  questionTitle: {
    marginBottom: 6,
  },
  questionSubtitle: {
    marginBottom: 16,
  },
  moodFeedbackCard: {
    padding: 16,
    borderWidth: 1.5,
    marginTop: 12,
  },
  noteSection: {
    marginTop: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  reviewCard: {
    padding: 18,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRowTags: {
    paddingVertical: 12,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  smallTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  reviewRowNote: {
    paddingVertical: 12,
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
  successContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  successCheckCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
});
