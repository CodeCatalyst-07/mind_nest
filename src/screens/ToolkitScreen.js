/**
 * src/screens/ToolkitScreen.js
 * Purpose: Tab screen serving as the Coping Toolkit hub.
 * Displays personalized tool cards for Breathing, 5-4-3-2-1 Grounding,
 * and Gratitude Journaling to help students manage daily stress.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { TOOL_CATALOG, getToolkitAccentColor } from '../data/toolkit';

export default function ToolkitScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <Screen scrollable>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="title">Coping Toolkit</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Quick, evidence-inspired self-help exercises when college life feels overwhelming.
        </AppText>
      </View>

      {/* Tool Cards List */}
      <View style={[styles.sectionHeader, { marginTop: spacing.sm }]}>
        <AppText variant="subheading" weight="bold">
          Self-Help Exercises
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
