/**
 * src/utils/haptics.js
 * Purpose: Safe haptic feedback utility using expo-haptics.
 * Wraps device vibration calls in try/catch to fail silently on devices or platforms without haptic engines.
 */

import * as Haptics from 'expo-haptics';

export const haptics = {
  /**
   * Light tap feedback for micro-interactions (e.g. stepping sleep or selecting an energy segment)
   */
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
  },

  /**
   * Medium impact feedback
   */
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
  },

  /**
   * Soft selection feedback (e.g. tapping a mood or selecting a tag chip)
   */
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (_) {}
  },

  /**
   * Success notification vibration pattern upon saving check-in
   */
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
  },
};
