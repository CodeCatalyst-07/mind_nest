/**
 * src/components/SupportCard.js
 * Purpose: A calm, non-alarming support banner card for MindNest.
 * Surfaces a caring message, a direct Tele-MANAS call button (14416),
 * a link to full support options, and an optional dismiss button for today.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../theme/ThemeContext';
import { PRIMARY_HELPLINE } from '../data/support';
import { haptics } from '../utils/haptics';

export default function SupportCard({ onMoreOptions, onDismiss, style }) {
  const { colors, spacing, borderRadius } = useTheme();

  const handleCallHelpline = async () => {
    haptics.selection();
    try {
      const supported = await Linking.canOpenURL(PRIMARY_HELPLINE.primaryDialUrl);
      if (supported) {
        await Linking.openURL(PRIMARY_HELPLINE.primaryDialUrl);
      } else {
        Alert.alert(
          PRIMARY_HELPLINE.name,
          `Please dial ${PRIMARY_HELPLINE.primaryNumber} or ${PRIMARY_HELPLINE.altNumber} from your phone.`
        );
      }
    } catch (_) {
      Alert.alert(
        PRIMARY_HELPLINE.name,
        `Please dial ${PRIMARY_HELPLINE.primaryNumber} or ${PRIMARY_HELPLINE.altNumber} from your phone.`
      );
    }
  };

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: colors.accent,
          backgroundColor: `${colors.accent}10`,
        },
        style,
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Support check-in: Things have felt heavy lately. You can call Tele-MANAS at 14416 or view more support options."
    >
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: `${colors.accent}22`, borderRadius: borderRadius.full },
            ]}
          >
            <Ionicons name="heart-outline" size={20} color={colors.accent} />
          </View>
          <AppText variant="heading" weight="bold" color={colors.text} style={{ flex: 1 }}>
            Checking in on you
          </AppText>
        </View>

        {onDismiss ? (
          <TouchableOpacity
            onPress={() => {
              haptics.light();
              onDismiss();
            }}
            style={styles.dismissBtn}
            accessibilityRole="button"
            accessibilityLabel="Hide support card for today"
          >
            <Ionicons name="close" size={20} color={colors.mutedText} />
          </TouchableOpacity>
        ) : null}
      </View>

      <AppText
        variant="bodySmall"
        color={colors.mutedText}
        style={{ marginTop: spacing.xs, lineHeight: 20 }}
      >
        We noticed the past few days have felt tough. Talking to someone—whether a trusted friend,
        mentor, or free 24x7 counsellor—can really help lighten the load.
      </AppText>

      <View style={[styles.actionsRow, { marginTop: spacing.md }]}>
        <AppButton
          title={`Call ${PRIMARY_HELPLINE.primaryNumber}`}
          onPress={handleCallHelpline}
          variant="primary"
          icon={<Ionicons name="call-outline" size={18} color="#FFFFFF" />}
          style={[styles.callBtn, { backgroundColor: colors.accent }]}
          accessibilityLabel={`Call Tele-MANAS helpline ${PRIMARY_HELPLINE.primaryNumber}`}
        />
        <AppButton
          title="More support options"
          onPress={() => {
            haptics.selection();
            onMoreOptions?.();
          }}
          variant="secondary"
          style={styles.moreBtn}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flex: 1,
  },
  moreBtn: {
    flex: 1.2,
  },
});
