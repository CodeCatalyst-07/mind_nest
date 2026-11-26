/**
 * src/utils/notifications.js
 * Purpose: Safe local daily reminder helper using expo-notifications.
 * Wraps notification permissions and daily scheduling in try/catch blocks so Expo Go
 * limitations or denied permissions fall back gracefully without crashing the app.
 */

import { Platform } from 'react-native';

// Lazy-require expo-notifications inside try/catch so missing/restricted native drivers
// in Expo Go or Jest never break module evaluation.
function getNotificationsModule() {
  try {
    return require('expo-notifications');
  } catch (_) {
    return null;
  }
}

/**
 * Parses an "HH:mm" string into { hour, minute } numbers with safe fallback to 20:00.
 *
 * @param {string} timeStr - e.g. "20:00"
 * @returns {{ hour: number, minute: number }}
 */
export function parseReminderTime(timeStr = '20:00') {
  if (typeof timeStr !== 'string' || !timeStr.includes(':')) {
    return { hour: 20, minute: 0 };
  }
  const [h, m] = timeStr.split(':').map((n) => parseInt(n, 10));
  const hour = Number.isFinite(h) && h >= 0 && h <= 23 ? h : 20;
  const minute = Number.isFinite(m) && m >= 0 && m <= 59 ? m : 0;
  return { hour, minute };
}

/**
 * Requests permission and schedules a daily repeating local check-in reminder.
 *
 * @param {string} timeStr - "HH:mm"
 * @returns {Promise<{ ok: boolean, message: string }>}
 */
export async function scheduleDailyReminder(timeStr = '20:00') {
  const Notifications = getNotificationsModule();
  if (!Notifications || Platform.OS === 'web') {
    return {
      ok: false,
      message: 'Local reminders are not supported in this environment. Your time preference was still saved.',
    };
  }

  try {
    // Configure foreground presentation safely
    if (Notifications.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let finalStatus = existing?.status;

    if (finalStatus !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested?.status;
    }

    if (finalStatus !== 'granted') {
      return {
        ok: false,
        message: 'Notification permission was not granted. You can enable it later in your device settings.',
      };
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const { hour, minute } = parseReminderTime(timeStr);
    const triggerType = Notifications.SchedulableTriggerInputTypes?.DAILY || 'daily';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MindNest Daily Check-in 🌱',
        body: 'Take 60 seconds to check in with your mood, energy, and sleep.',
      },
      trigger: {
        type: triggerType,
        hour,
        minute,
      },
    });

    return {
      ok: true,
      message: `Daily reminder set for ${timeStr}.`,
    };
  } catch (_) {
    return {
      ok: false,
      message: 'Local reminders could not be scheduled in Expo Go on this device. Preference saved locally.',
    };
  }
}

/**
 * Cancels all scheduled daily reminders safely.
 *
 * @returns {Promise<boolean>}
 */
export async function cancelDailyReminders() {
  const Notifications = getNotificationsModule();
  if (!Notifications) return false;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (_) {
    return false;
  }
}
