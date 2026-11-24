/**
 * src/screens/CheckInScreen.js
 * Purpose: Multi-step daily wellness check-in screen for MindNest.
 * Features a custom top bar with close button, segmented progress bar,
 * dynamic multi-step content, and bottom action buttons.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { useTheme } from '../theme/ThemeContext';

export default function CheckInScreen({ navigation }) {
  const { colors, spacing } = useTheme();

  return (
    <Screen style={styles.screen}>
      {/* Custom Top Navigation Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Close check-in"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <AppText variant="heading" style={styles.headerTitle}>
            Daily Check-in
          </AppText>
        </View>

        {/* Empty 44px spacer for visual balance / optical centering */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content Shell (populated in steps 3.2 - 3.12) */}
      <View style={styles.contentArea}>
        {/* Placeholder content for step 3.1 */}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
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
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
