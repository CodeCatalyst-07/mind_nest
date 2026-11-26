/**
 * src/screens/ToolkitScreen.js
 * Purpose: Tab screen serving as the Coping Toolkit hub.
 * Displays a mood-based recommendation banner ("Suggested for you"), interactive tool cards
 * for Breathing, Grounding, and Gratitude, and a weekly toolkit usage summary card.
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
import { getRecommendation, summarizeSessions } from '../utils/toolkit';
import { haptics } from '../utils/haptics';

export default function ToolkitScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { getTodayCheckIn, sessions } = useData();

  const handleOpenTool = (route) => {
    haptics.selection();
    navigation.navigate(route);
  };

  const todayCheckIn = getTodayCheckIn();
  const recommendation = getRecommendation(todayCheckIn?.mood);
  const recommendedTool =
    TOOL_CATALOG.find((item) => item.id === recommendation.toolId) || TOOL_CATALOG[0];
  const recAccent = getToolkitAccentColor(recommendedTool.colorKey, colors);
  const recBadgeTextColor = recommendedTool.colorKey === 'moodLevel4' ? '#0F172A' : '#FFFFFF';

  const weeklySummary = summarizeSessions(sessions, 7);

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
            <AppText variant="caption" weight="bold" color={recBadgeTextColor}>
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
          onPress={() => handleOpenTool(recommendation.route)}
          style={{ marginTop: spacing.md, backgroundColor: recAccent }}
          textStyle={{ color: recBadgeTextColor }}
          accessibilityHint={`Opens ${recommendedTool.title}`}
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
              onPress={() => handleOpenTool(tool.route)}
              accessibilityRole="button"
              accessibilityLabel={`${tool.title}. ${tool.description}`}
              accessibilityHint={`Opens ${tool.title}`}
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

      {/* Weekly Usage Summary Card */}
      <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
        <AppText variant="subheading" weight="bold">
          This Week’s Practice
        </AppText>
      </View>

      <Card
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Weekly toolkit summary: ${weeklySummary.totalSessions} sessions totaling ${weeklySummary.totalMinutes} minutes. Breathing: ${weeklySummary.counts.breathing}, Grounding: ${weeklySummary.counts.grounding}, Gratitude: ${weeklySummary.counts.gratitude}.`}
      >
        <View style={styles.summaryTopRow}>
          <View style={[styles.summaryStatBox, { borderColor: colors.border, borderRadius: borderRadius.md }]}>
            <AppText variant="title" weight="bold" color={colors.primary}>
              {weeklySummary.totalSessions}
            </AppText>
            <AppText variant="caption" color={colors.mutedText}>
              {weeklySummary.totalSessions === 1 ? 'Session' : 'Sessions'} (7d)
            </AppText>
          </View>

          <View style={[styles.summaryStatBox, { borderColor: colors.border, borderRadius: borderRadius.md }]}>
            <AppText variant="title" weight="bold" color={colors.accent}>
              {weeklySummary.totalMinutes}
            </AppText>
            <AppText variant="caption" color={colors.mutedText}>
              {weeklySummary.totalMinutes === 1 ? 'Minute' : 'Minutes'} (7d)
            </AppText>
          </View>
        </View>

        {/* Per-tool breakdown */}
        <View
          style={[
            styles.breakdownRow,
            { borderTopColor: colors.border, marginTop: spacing.md, paddingTop: spacing.md },
          ]}
        >
          <View style={styles.breakdownItem}>
            <AppText variant="bodySmall">🌬️ {weeklySummary.counts.breathing}</AppText>
            <AppText variant="caption" color={colors.mutedText}>
              Breathing
            </AppText>
          </View>

          <View style={styles.breakdownItem}>
            <AppText variant="bodySmall">🌿 {weeklySummary.counts.grounding}</AppText>
            <AppText variant="caption" color={colors.mutedText}>
              Grounding
            </AppText>
          </View>

          <View style={styles.breakdownItem}>
            <AppText variant="bodySmall">✨ {weeklySummary.counts.gratitude}</AppText>
            <AppText variant="caption" color={colors.mutedText}>
              Gratitude
            </AppText>
          </View>
        </View>

        {weeklySummary.totalSessions === 0 ? (
          <AppText
            variant="caption"
            color={colors.mutedText}
            style={{ marginTop: spacing.sm, textAlign: 'center' }}
          >
            Complete any exercise above to track your self-care time this week.
          </AppText>
        ) : null}
      </Card>

      {/* Support Entry Point */}
      <Card
        onPress={() => handleOpenTool('Support')}
        style={{ marginTop: spacing.md, borderColor: colors.accent, borderWidth: 1 }}
        accessibilityLabel="Need someone to talk to? View free 24x7 support helplines and trusted options"
      >
        <View style={styles.toolRow}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: `${colors.accent}20`,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Ionicons name="heart-outline" size={24} color={colors.accent} />
          </View>
          <View style={styles.toolInfo}>
            <AppText variant="heading" weight="bold" color={colors.text}>
              Need Someone to Talk To?
            </AppText>
            <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
              Free 24x7 Tele-MANAS helpline and trusted support tips.
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </View>
      </Card>

      {/* Gentle supportive note */}
      <AppText
        variant="caption"
        color={colors.mutedText}
        style={{ marginTop: spacing.md, marginBottom: spacing.lg, textAlign: 'center', lineHeight: 18 }}
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
  summaryTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryStatBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
  },
  breakdownItem: {
    alignItems: 'center',
    gap: 2,
  },
});
