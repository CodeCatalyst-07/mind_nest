/**
 * src/data/moods.js
 * Purpose: Defines the 5 standard mood levels used throughout MindNest.
 * Includes mood numeric value (1-5), user-friendly labels, emojis,
 * and the matching mood color key defined in src/theme/colors.js.
 */

export const MOODS = [
  {
    value: 1,
    label: 'Terrible',
    emoji: '😢',
    colorKey: 'level1',
  },
  {
    value: 2,
    label: 'Bad',
    emoji: '🙁',
    colorKey: 'level2',
  },
  {
    value: 3,
    label: 'Okay',
    emoji: '😐',
    colorKey: 'level3',
  },
  {
    value: 4,
    label: 'Good',
    emoji: '🙂',
    colorKey: 'level4',
  },
  {
    value: 5,
    label: 'Great',
    emoji: '😄',
    colorKey: 'level5',
  },
];

/**
 * Helper to get a mood object by its numeric value (1 to 5).
 * Defaults to 'Okay' (3) if not found.
 *
 * @param {number} value - Mood value 1-5
 * @returns {object} Mood definition
 */
export function getMoodByValue(value) {
  return MOODS.find((m) => m.value === value) || MOODS[2];
}
