/**
 * src/screens/OnboardingScreen.js
 * Purpose: First-launch 3-slide swipeable onboarding flow for MindNest.
 * Introduces MindNest's purpose, check-ins/trends, and privacy + non-medical scope,
 * then saves onboardingDone = true when finished or skipped.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { haptics } from '../utils/haptics';

const ONBOARDING_SLIDES = [
  {
    id: 'purpose',
    icon: '🌱',
    title: 'Welcome to MindNest',
    description:
      'Your personal student well-being space. Build healthy daily reflection habits, explore calming tools, and navigate stressful semesters at your own pace.',
  },
  {
    id: 'trends',
    icon: '📊',
    title: 'Check-ins & Insights',
    description:
      'Log your mood, sleep, energy, and tags in under a minute. Over time, MindNest turns your entries into clear charts and gentle insights about what helps you thrive.',
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Private & Supportive',
    description:
      'Your data stays strictly on your phone—never uploaded to any server. MindNest is a self-help companion, not a medical diagnosis or emergency service.',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { colors, spacing, borderRadius } = useTheme();
  const { updateSettings } = useData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const handleFinish = async () => {
    haptics.success();
    await updateSettings({ onboardingDone: true });
  };

  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
      return;
    }

    haptics.selection();
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    scrollRef.current?.scrollTo({ x: nextIdx * width, animated: true });
  };

  const handleMomentumEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / Math.max(1, width));
    if (index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <Screen style={styles.screenOverride}>
      {/* Top Skip Row */}
      <View style={styles.topRow}>
        {!isLastSlide ? (
          <TouchableOpacity
            onPress={handleFinish}
            style={styles.skipBtn}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <AppText variant="bodySmall" weight="bold" color={colors.mutedText}>
              Skip
            </AppText>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      {/* Horizontal Swipeable Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {ONBOARDING_SLIDES.map((slide) => (
          <View
            key={slide.id}
            style={[styles.slide, { width, paddingHorizontal: spacing.xl }]}
            accessible
            accessibilityLabel={`${slide.title}. ${slide.description}`}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.primaryLight,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <AppText style={styles.iconEmoji}>{slide.icon}</AppText>
            </View>

            <AppText variant="title" weight="bold" style={styles.slideTitle}>
              {slide.title}
            </AppText>

            <AppText
              variant="body"
              color={colors.mutedText}
              style={[styles.slideDesc, { marginTop: spacing.md }]}
            >
              {slide.description}
            </AppText>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls: Pagination Dots & CTA Button */}
      <View style={[styles.footer, { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }]}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((slide, idx) => {
            const active = idx === currentIndex;
            return (
              <View
                key={`dot-${slide.id}`}
                style={[
                  styles.dot,
                  {
                    width: active ? 24 : 8,
                    backgroundColor: active ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              />
            );
          })}
        </View>

        <AppButton
          title={isLastSlide ? 'Get started' : 'Next'}
          onPress={handleNext}
          variant="primary"
          style={{ width: '100%', marginTop: spacing.lg }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenOverride: {
    paddingHorizontal: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  skipBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skipPlaceholder: {
    height: 44,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 112,
    height: 112,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  iconEmoji: {
    fontSize: 52,
  },
  slideTitle: {
    textAlign: 'center',
    fontSize: 26,
  },
  slideDesc: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
  },
});
