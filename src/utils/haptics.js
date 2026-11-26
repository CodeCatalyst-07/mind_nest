/**
 * src/utils/haptics.js
 * Purpose: Safe haptic feedback utility using expo-haptics.
 * Wraps device vibration calls in try/catch to fail silently on unsupported devices,
 * and respects the user's hapticsEnabled setting controlled via DataContext.
 */

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

/**
 * Updates whether haptic feedback should fire across the app.
 *
 * @param {boolean} enabled
 */
export function setHapticsEnabled(enabled) {
  hapticsEnabled = enabled !== false;
}

/**
 * Returns the current in-memory haptics state.
 *
 * @returns {boolean}
 */
export function getHapticsEnabled() {
  return hapticsEnabled;
}

export const haptics = {
  /**
   * Light tap feedback for micro-interactions
   */
  light: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
  },

  /**
   * Medium impact feedback
   */
  medium: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
  },

  /**
   * Soft selection feedback
   */
  selection: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.selectionAsync();
    } catch (_) {}
  },

  /**
   * Success notification vibration pattern
   */
  success: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
  },
};
