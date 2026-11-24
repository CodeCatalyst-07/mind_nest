/**
 * src/data/messages.js
 * Purpose: Empathetic, mood-keyed affirmation messages for the check-in completion screen.
 * Tailored specifically to validate and uplift college students across all mood ratings.
 */

export const MOOD_MESSAGES = {
  1: {
    headline: 'We hear you. 💙',
    message:
      'College life can be intensely overwhelming at times. Acknowledging how you feel is a brave first step. Take today one gentle breath at a time.',
  },
  2: {
    headline: 'Hang in there. 🌿',
    message:
      'Tough days are part of the journey. Be extra kind to yourself today, drink some water, and take short pauses between classes.',
  },
  3: {
    headline: 'Steady & centered. ☕',
    message:
      'Taking a quiet minute to pause and check in is a wonderful habit. Wishing you a calm, balanced day ahead.',
  },
  4: {
    headline: 'Looking bright! ✨',
    message:
      'Glad to see you are feeling good! Carry this positive momentum into your study sessions and social connections.',
  },
  5: {
    headline: 'Wonderful energy! 🎉',
    message:
      'Amazing! Celebrate this high point today and take note of what contributed to this great feeling.',
  },
};

/**
 * Retrieves a supportive affirmation based on mood numeric rating (1-5).
 *
 * @param {number} mood - Mood rating 1-5
 * @returns {{ headline: string, message: string }}
 */
export function getSupportiveMessage(mood) {
  return MOOD_MESSAGES[mood] || MOOD_MESSAGES[3];
}
