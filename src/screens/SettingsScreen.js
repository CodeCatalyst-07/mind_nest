/**
 * src/screens/SettingsScreen.js
 * Purpose: Tab screen for user preferences, appearance, and developer tools.
 * Includes developer controls to seed test data and clear AsyncStorage for verification.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { toDateKey } from '../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { colors, isDark, spacing, borderRadius } = useTheme();
  const { checkIns, saveCheckIn, loadDemoData, clearAllData } = useData();

  // Handler: Add a quick sample check-in for today
  const handleAddTodayCheckIn = async () => {
    try {
      await saveCheckIn({
        date: toDateKey(new Date()),
        mood: 4, // Good
        energy: 4,
        sleepHours: 7.5,
        note: 'Sample check-in created from developer tools!',
      });
      Alert.alert('Success', "Today's sample check-in has been saved!");
    } catch (error) {
      Alert.alert('Error', 'Failed to save sample check-in.');
    }
  };

  // Handler: Load 14 days of realistic sample data
  const handleLoadDemoData = async () => {
    try {
      await loadDemoData(14);
      Alert.alert('Demo Data Loaded', '14 days of sample student check-ins have been generated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to load demo data.');
    }
  };

  // Handler: Confirmation prompt before wiping local data
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to permanently delete all check-ins, assessments, and reset settings?',
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
      {/* Screen Title */}
      <Card>
        <AppText variant="title">Settings</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Manage your theme, notification reminders, and local app data.
        </AppText>
      </Card>

      {/* Appearance Card */}
      <Card>
        <AppText variant="heading">Appearance</AppText>
        <AppText variant="body" color={colors.mutedText} style={{ marginTop: spacing.xs }}>
          Current Mode: {isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'} (Matches device setting)
        </AppText>
      </Card>

      {/* Developer Tools Card (Phase 2 Verification) */}
      <Card style={{ borderColor: colors.primary, borderWidth: 1 }}>
        <View style={styles.devHeader}>
          <Ionicons name="construct-outline" size={20} color={colors.primary} />
          <AppText variant="heading" style={{ marginLeft: 8, color: colors.primary }}>
            Developer Tools
          </AppText>
        </View>
        <AppText variant="caption" style={{ marginBottom: spacing.md, marginTop: spacing.xs }}>
          Use these buttons to verify local storage persistence ({checkIns.length} check-ins stored).
        </AppText>

        {/* Button 1: Add sample check-in for today */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: borderRadius.md }]}
          onPress={handleAddTodayCheckIn}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <AppText variant="body" style={styles.buttonText}>
            Add sample check-in for today
          </AppText>
        </TouchableOpacity>

        {/* Button 2: Load 14 days of demo data */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.accent, borderRadius: borderRadius.md, marginTop: spacing.sm },
          ]}
          onPress={handleLoadDemoData}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles-outline" size={18} color="#FFFFFF" />
          <AppText variant="body" style={styles.buttonText}>
            Load 14 days of demo data
          </AppText>
        </TouchableOpacity>

        {/* Button 3: Clear all data */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: 'transparent',
              borderColor: '#EF4444',
              borderWidth: 1,
              borderRadius: borderRadius.md,
              marginTop: spacing.sm,
            },
          ]}
          onPress={handleClearAllData}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <AppText variant="body" style={[styles.buttonText, { color: '#EF4444' }]}>
            Clear all data
          </AppText>
        </TouchableOpacity>
      </Card>

      {/* About MindNest */}
      <Card>
        <AppText variant="heading">About MindNest</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Version 1.1.0 (Phase 2 Data Architecture) • Built with Expo & React Native for college students.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});
