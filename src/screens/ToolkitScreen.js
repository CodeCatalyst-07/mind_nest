/**
 * src/screens/ToolkitScreen.js
 * Purpose: Tab screen serving as the Coping Toolkit hub.
 * Displays a mood-based recommendation banner ("Suggested for you") and interactive
 * tool cards for Breathing, 5-4-3-2-1 Grounding, and Gratitude Journaling.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { TOOL_CATALOG, getToolkitAccentColor } from '../data/toolkit';
import { getRecommendation } from '../utils/toolkit';

export default function ToolkitScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { getTodayCheckIn } = useData();

  const todayCheckIn = getTodayCheckIn();
  const recommendation = getRecommendation(todayCheckIn?.mood);
  const recommendedTool =
    TOOL_CATALOG.find((item) => item.id === recommendation.toolId) || TOOL_CATALOG[0];
  const recAccent = getToolkitAccentColor(recommendedTool.colorKey, colors);

  return (
    <Screen scrollable>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="title">Coping Toolkit</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Quick, evidence-inspired self-help exercises when college life feels overwhelming.
        </AppText>
      </View>

      {/* Mood-based Recommendation Banner */}
      <View
        style={[
          styles.recBanner,
          {
            backgroundColor: `${recAccent}15`,
            borderColor: `${recAccent}55`,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
          },
        ]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Suggested for you: ${recommendation.title}. ${recommendation.reason}`}
      >
        <View style={styles.recHeader}>
          <View
            style={[
              styles.recPill,
              {
                backgroundColor: recAccent,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <AppText variant="caption" weight="bold" color="#FFFFFF">
              ✨ Suggested for you
            </AppText>
          </View>
          <AppText style={styles.recIcon}>{recommendedTool.icon}</AppText>
        </View>

        <AppText variant="heading" weight="bold" style={{ marginTop: spacing.sm }}>
          {recommendation.title}
        </AppText>
        <AppText
          variant="bodySmall"
          color={colors.mutedText}
          style={{ marginTop: 4, lineHeight: 20 }}
        >
          {recommendation.reason}
        </AppText>

        <AppButton
          title={`Start ${recommendedTool.title}`}
          variant="primary"
          onPress={() => navigation?.navigate?.(recommendation.route)}
          style={{ marginTop: spacing.md, backgroundColor: recAccent }}
        />
      </View>

      {/* Tool Cards List */}
      <View style={[styles.sectionHeader, { marginTop: spacing.md }]}>
        <AppText variant="subheading" weight="bold">
          All Self-Help Exercises
        </AppText>
      </View>

      <View style={{ gap: spacing.sm }}>
        {TOOL_CATALOG.map((tool) => {
          const accentColor = getToolkitAccentColor(tool.colorKey, colors);

          return (
            <TouchableOpacity
              key={tool.id}
              activeOpacity={0.75}
              onPress={() => navigation?.navigate?.(tool.route)}
              accessibilityRole="button"
              accessibilityLabel={`${tool.title}. ${tool.description}`}
            >
              <Card style={styles.toolCard}>
                <View style={styles.toolRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: `${accentColor}20`,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    <AppText style={styles.iconEmoji}>{tool.icon}</AppText>
                  </View>

                  <View style={styles.toolInfo}>
                    <View style={styles.titleRow}>
                      <AppText variant="heading" weight="bold" color={colors.text}>
                        {tool.title}
                      </AppText>
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: `${accentColor}1A`,
                            borderRadius: borderRadius.full,
                          },
                        ]}
                      >
                        <AppText variant="caption" weight="bold" color={accentColor}>
                          {tool.durationHint}
                        </AppText>
                      </View>
                    </View>

                    <AppText
                      variant="bodySmall"
                      color={colors.mutedText}
                      style={{ marginTop: 4, lineHeight: 19 }}
                    >
                      {tool.description}
                    </AppText>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Gentle supportive note */}
      <AppText
        variant="caption"
        color={colors.mutedText}
        style={{ marginTop: spacing.lg, textAlign: 'center', lineHeight: 18 }}
      >
        These tools are supportive self-help exercises, not medical treatment.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  recBanner: {
    borderWidth: 1,
    marginBottom: 8,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  recIcon: {
    fontSize: 22,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  toolCard: {
    marginBottom: 0,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 26,
  },
  toolInfo: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
