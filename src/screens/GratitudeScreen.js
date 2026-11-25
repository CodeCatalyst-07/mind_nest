/**
 * src/screens/GratitudeScreen.js
 * Purpose: Full-screen Gratitude Journal screen.
 * Allows students to add short positive reflections (max 100 characters),
 * logs a ToolSession per entry, groups entries by date, and supports confirmed deletion.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { formatDisplayDate } from '../utils/dateUtils';
import { haptics } from '../utils/haptics';

const MAX_CHARS = 100;

export default function GratitudeScreen({ navigation }) {
  const { colors, spacing, borderRadius } = useTheme();
  const { gratitudeEntries, addGratitude, deleteGratitude, logSession } = useData();
  const [text, setText] = useState('');

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  const handleAdd = async () => {
    if (!canSubmit) return;

    haptics.success();
    await addGratitude(trimmed);
    await logSession('gratitude', 60);
    setText('');
  };

  const handleDelete = (entry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to remove this gratitude entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            haptics.light();
            deleteGratitude(entry.id);
          },
        },
      ]
    );
  };

  // Group entries by calendar date (newest dates first)
  const groupedMap = {};
  gratitudeEntries.forEach((entry) => {
    const key = entry.date || 'Unknown';
    if (!groupedMap[key]) groupedMap[key] = [];
    groupedMap[key].push(entry);
  });

  const sortedDates = Object.keys(groupedMap).sort((a, b) => (a > b ? -1 : 1));

  return (
    <Screen scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back to Toolkit"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText variant="heading" weight="bold">
            Gratitude Journal
          </AppText>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {/* Add Entry Card */}
        <Card style={{ marginTop: spacing.sm }}>
          <AppText variant="subheading" weight="bold">
            What went well today?
          </AppText>
          <AppText variant="caption" color={colors.mutedText} style={{ marginTop: 2 }}>
            Noticing small good things builds resilience over time.
          </AppText>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write something you appreciate..."
            placeholderTextColor={colors.mutedText}
            maxLength={MAX_CHARS}
            multiline
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                marginTop: spacing.md,
                padding: spacing.sm,
              },
            ]}
            accessibilityLabel="Gratitude entry text input"
          />

          <View style={styles.inputFooter}>
            <AppText variant="caption" color={colors.mutedText}>
              {text.length}/{MAX_CHARS} characters
            </AppText>
          </View>

          <AppButton
            title="Save Gratitude"
            onPress={handleAdd}
            disabled={!canSubmit}
            variant="primary"
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        {/* Saved Entries Grouped by Date */}
        <View style={[styles.listHeader, { marginTop: spacing.lg }]}>
          <AppText variant="subheading" weight="bold">
            Your Reflections
          </AppText>
        </View>

        {sortedDates.length === 0 ? (
          <Card>
            <AppText variant="bodySmall" color={colors.mutedText} style={{ textAlign: 'center' }}>
              No gratitude entries yet. Add your first reflection above!
            </AppText>
          </Card>
        ) : (
          <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
            {sortedDates.map((dateKey) => (
              <View key={dateKey}>
                <AppText
                  variant="caption"
                  weight="bold"
                  color={colors.mutedText}
                  style={{ marginBottom: 6, marginLeft: 4 }}
                >
                  {formatDisplayDate(dateKey)}
                </AppText>

                <View style={{ gap: spacing.xs }}>
                  {groupedMap[dateKey].map((entry) => (
                    <View
                      key={entry.id}
                      style={[
                        styles.entryRow,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          borderRadius: borderRadius.md,
                          padding: spacing.md,
                        },
                      ]}
                    >
                      <AppText variant="body" style={styles.entryEmoji}>
                        ✨
                      </AppText>
                      <AppText variant="bodySmall" color={colors.text} style={styles.entryText}>
                        {entry.text}
                      </AppText>
                      <TouchableOpacity
                        onPress={() => handleDelete(entry)}
                        style={styles.deleteButton}
                        accessibilityRole="button"
                        accessibilityLabel="Delete gratitude entry"
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.mutedText} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  input: {
    minHeight: 84,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  listHeader: {
    marginBottom: 8,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  entryEmoji: {
    marginRight: 10,
  },
  entryText: {
    flex: 1,
    lineHeight: 20,
  },
  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
