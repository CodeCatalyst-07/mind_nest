/**
 * src/screens/SupportScreen.js
 * Purpose: Full-screen Support & Resources page for MindNest.
 * Lists Tele-MANAS (14416 / 1-800-891-4416), India Emergency (112) guidance,
 * trusted-person reach-out options, conversation starters, and self-help disclaimers.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import { useTheme } from '../theme/ThemeContext';
import {
  PRIMARY_HELPLINE,
  EMERGENCY_RESOURCE,
  TRUSTED_PEOPLE,
  CONVERSATION_STARTERS,
  SUPPORT_DISCLAIMER,
} from '../data/support';
import { haptics } from '../utils/haptics';

export default function SupportScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();

  const handleDial = async (url, displayNumber, label) => {
    haptics.selection();
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(label, `Please dial ${displayNumber} on your phone.`);
      }
    } catch (_) {
      Alert.alert(label, `Please dial ${displayNumber} on your phone.`);
    }
  };

  return (
    <Screen scrollable>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="heading" weight="bold">
          Support & Helplines
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <AppText variant="body" color={colors.mutedText} style={{ marginBottom: spacing.md }}>
        You never have to go through difficult days on your own. Reach out anytime—it’s okay to ask
        for support.
      </AppText>

      {/* Primary Helpline: Tele-MANAS */}
      <Card style={{ borderColor: colors.primary, borderWidth: 1.5 }}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <AppText variant="heading" weight="bold" color={colors.primary}>
              {PRIMARY_HELPLINE.name}
            </AppText>
            <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
              {PRIMARY_HELPLINE.subtitle}
            </AppText>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.primaryLight, borderRadius: borderRadius.full },
            ]}
          >
            <AppText variant="caption" weight="bold" color={colors.primary}>
              {PRIMARY_HELPLINE.availability}
            </AppText>
          </View>
        </View>

        <AppText
          variant="bodySmall"
          color={colors.text}
          style={{ marginTop: spacing.sm, lineHeight: 20 }}
        >
          {PRIMARY_HELPLINE.description}
        </AppText>

        <View style={[styles.buttonStack, { marginTop: spacing.md }]}>
          <AppButton
            title={`Call ${PRIMARY_HELPLINE.primaryNumber}`}
            onPress={() =>
              handleDial(
                PRIMARY_HELPLINE.primaryDialUrl,
                PRIMARY_HELPLINE.primaryNumber,
                PRIMARY_HELPLINE.name
              )
            }
            variant="primary"
            icon={<Ionicons name="call-outline" size={18} color="#FFFFFF" />}
          />
          <AppButton
            title={`Toll-Free: ${PRIMARY_HELPLINE.altNumber}`}
            onPress={() =>
              handleDial(
                PRIMARY_HELPLINE.altDialUrl,
                PRIMARY_HELPLINE.altNumber,
                PRIMARY_HELPLINE.name
              )
            }
            variant="outline"
          />
        </View>
      </Card>

      {/* Emergency Guidance: 112 */}
      <Card style={{ borderColor: colors.mood.level1, borderWidth: 1 }}>
        <View style={styles.cardHeader}>
          <View style={styles.emergencyTitleRow}>
            <Ionicons name="alert-circle-outline" size={22} color={colors.mood.level1} />
            <AppText
              variant="heading"
              weight="bold"
              color={colors.mood.level1}
              style={{ marginLeft: 8 }}
            >
              {EMERGENCY_RESOURCE.title}
            </AppText>
          </View>
        </View>

        <AppText
          variant="bodySmall"
          color={colors.mutedText}
          style={{ marginTop: spacing.xs, lineHeight: 20 }}
        >
          {EMERGENCY_RESOURCE.description}
        </AppText>

        <AppButton
          title={`Call ${EMERGENCY_RESOURCE.number} (Emergency)`}
          onPress={() =>
            handleDial(
              EMERGENCY_RESOURCE.dialUrl,
              EMERGENCY_RESOURCE.number,
              EMERGENCY_RESOURCE.name
            )
          }
          variant="secondary"
          icon={<Ionicons name="call" size={16} color={colors.mood.level1} />}
          textStyle={{ color: colors.mood.level1 }}
          style={{
            marginTop: spacing.md,
            borderColor: colors.mood.level1,
            borderWidth: 1,
          }}
        />
      </Card>

      {/* Talk to Someone You Trust */}
      <Card>
        <AppText variant="heading" weight="bold">
          Talk to Someone You Trust
        </AppText>
        <AppText
          variant="bodySmall"
          color={colors.mutedText}
          style={{ marginTop: 4, marginBottom: spacing.md, lineHeight: 20 }}
        >
          Opening up to people in your everyday life can be a meaningful first step:
        </AppText>

        <View style={{ gap: spacing.sm }}>
          {TRUSTED_PEOPLE.map((person) => (
            <View
              key={person.id}
              style={[
                styles.personRow,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                },
              ]}
            >
              <AppText style={styles.personIcon}>{person.icon}</AppText>
              <View style={{ flex: 1 }}>
                <AppText variant="bodySmall" weight="bold">
                  {person.label}
                </AppText>
                <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
                  {person.tip}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        <AppText
          variant="bodySmall"
          weight="bold"
          style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}
        >
          Simple Ways to Start the Conversation
        </AppText>

        <View style={{ gap: spacing.xs }}>
          {CONVERSATION_STARTERS.map((quote, idx) => (
            <View
              key={`starter-${idx}`}
              style={[
                styles.quoteBox,
                {
                  backgroundColor: colors.primaryLight,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                },
              ]}
            >
              <AppText variant="caption" color={colors.text} style={{ fontStyle: 'italic', lineHeight: 18 }}>
                “{quote}”
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      {/* Self-Help Scope Disclaimer */}
      <Card style={{ backgroundColor: colors.card }}>
        <View style={styles.disclaimerRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.mutedText} />
          <AppText variant="caption" color={colors.mutedText} style={styles.disclaimerText}>
            {SUPPORT_DISCLAIMER}
          </AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonPlaceholder: {
    width: 44,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonStack: {
    gap: 10,
  },
  emergencyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 12,
  },
  personIcon: {
    fontSize: 22,
  },
  quoteBox: {},
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    lineHeight: 18,
  },
});
