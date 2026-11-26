/**
 * src/screens/SettingsScreen.js
 * Purpose: Settings tab screen organized into clean grouped sections:
 * Appearance, Feedback, Reminders, Privacy, Support, Data, Developer Tools, and About.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import SegmentedControl from '../components/SegmentedControl';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { toDateKey } from '../utils/dateUtils';
import { haptics } from '../utils/haptics';

const THEME_OPTIONS = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function SettingsScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { checkIns, settings, updateSettings, saveCheckIn, loadDemoData, clearAllData } = useData();

  const handleSelectTheme = (mode) => {
    haptics.selection();
    updateSettings({ themeMode: mode });
  };

  const handleToggleHaptics = (nextVal) => {
    updateSettings({ hapticsEnabled: nextVal });
    if (nextVal) {
      // Trigger light tap only after enabling
      setTimeout(() => haptics.light(), 50);
    }
  };

  // Developer tool handlers
  const handleAddTodayCheckIn = async () => {
    try {
      await saveCheckIn({
        date: toDateKey(new Date()),
        mood: 4,
        energy: 4,
        sleepHours: 7.5,
        note: 'Sample check-in created from developer tools!',
      });
      Alert.alert('Success', "Today's sample check-in has been saved!");
    } catch (error) {
      Alert.alert('Error', 'Failed to save sample check-in.');
    }
  };

  const handleLoadDemoData = async () => {
    try {
      await loadDemoData(14);
      Alert.alert('Demo Data Loaded', '14 days of sample student data have been generated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to load demo data.');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to permanently delete all check-ins, assessments, gratitude entries, and reset settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Reset Complete', 'All local storage has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <Screen scrollable>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="title">Settings</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Customize how MindNest looks, feels, and protects your privacy.
        </AppText>
      </View>

      {/* Section 1: Appearance */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        APPEARANCE
      </AppText>
      <Card>
        <AppText variant="bodySmall" weight="bold" style={{ marginBottom: spacing.sm }}>
          Theme Mode
        </AppText>
        <SegmentedControl
          options={THEME_OPTIONS}
          selectedValue={settings.themeMode || 'system'}
          onSelect={handleSelectTheme}
        />
      </Card>

      {/* Section 2: Feedback */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        FEEDBACK
      </AppText>
      <Card>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <AppText variant="bodySmall" weight="bold">
              Haptic Feedback
            </AppText>
            <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
              Subtle vibrations on taps, check-ins, and breathing cues.
            </AppText>
          </View>
          <Switch
            value={settings.hapticsEnabled !== false}
            onValueChange={handleToggleHaptics}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={settings.hapticsEnabled !== false ? colors.primary : colors.mutedText}
            accessibilityLabel="Toggle haptic feedback"
          />
        </View>
      </Card>

      {/* Section 3: Reminders */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        REMINDERS
      </AppText>
      <Card>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <AppText variant="bodySmall" weight="bold">
              Daily Check-in Reminder
            </AppText>
            <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
              Scheduled time: {settings.reminderTime || '20:00'}
            </AppText>
          </View>
          <Switch
            value={Boolean(settings.reminderEnabled)}
            onValueChange={(val) => updateSettings({ reminderEnabled: val })}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={settings.reminderEnabled ? colors.primary : colors.mutedText}
            accessibilityLabel="Toggle daily reminder"
          />
        </View>
      </Card>

      {/* Section 4: Privacy */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        PRIVACY & SECURITY
      </AppText>
      <Card>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <AppText variant="bodySmall" weight="bold">
              4-Digit PIN Lock
            </AppText>
            <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
              {settings.pinEnabled ? 'Active — locks when returning from background' : 'Off'}
            </AppText>
          </View>
          <Ionicons
            name={settings.pinEnabled ? 'lock-closed' : 'lock-open-outline'}
            size={20}
            color={settings.pinEnabled ? colors.primary : colors.mutedText}
          />
        </View>
      </Card>

      {/* Section 5: Support */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        SUPPORT
      </AppText>
      <Card onPress={() => navigation.navigate('Support')}>
        <View style={styles.navRow}>
          <Ionicons name="heart-outline" size={20} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <AppText variant="bodySmall" weight="bold">
              Support & Helplines
            </AppText>
            <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
              Free 24x7 Tele-MANAS helpline, 112 crisis info, and conversation tips.
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </View>
      </Card>

      {/* Section 6: Data */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        DATA
      </AppText>
      <Card>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: 'transparent',
              borderColor: colors.mood.level1,
              borderWidth: 1,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={handleClearAllData}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Clear all local data"
        >
          <Ionicons name="trash-outline" size={18} color={colors.mood.level1} />
          <AppText variant="bodySmall" weight="bold" style={{ color: colors.mood.level1, marginLeft: 8 }}>
            Clear All Local Data
          </AppText>
        </TouchableOpacity>
      </Card>

      {/* Temporary Developer Tools Card (hidden behind 5-tap version trigger in Commit 18) */}
      <Card style={{ borderColor: colors.primary, borderWidth: 1 }}>
        <View style={styles.navRow}>
          <Ionicons name="construct-outline" size={20} color={colors.primary} />
          <AppText variant="bodySmall" weight="bold" style={{ marginLeft: 8, color: colors.primary }}>
            Developer Tools ({checkIns.length} check-ins)
          </AppText>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: borderRadius.md, marginTop: spacing.sm }]}
          onPress={handleAddTodayCheckIn}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <AppText variant="bodySmall" style={styles.buttonText}>
            Add sample check-in for today
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent, borderRadius: borderRadius.md, marginTop: spacing.sm }]}
          onPress={handleLoadDemoData}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles-outline" size={18} color="#FFFFFF" />
          <AppText variant="bodySmall" style={styles.buttonText}>
            Load 14 days of demo data
          </AppText>
        </TouchableOpacity>
      </Card>

      {/* Section 7: About */}
      <AppText variant="caption" weight="bold" color={colors.mutedText} style={styles.sectionLabel}>
        ABOUT
      </AppText>
      <Card style={{ marginBottom: spacing.xl }}>
        <AppText variant="bodySmall" weight="bold">
          MindNest v1.0.0
        </AppText>
        <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 4 }}>
          Student well-being companion built with Expo & React Native.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 6,
    marginLeft: 4,
    letterSpacing: 0.6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});
