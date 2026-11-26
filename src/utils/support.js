/**
 * src/utils/support.js
 * Purpose: Pure utility to detect consecutive low-mood days for MindNest's gentle safety net.
 * Helps surface non-alarming support options when a student logs multiple tough days in a row.
 */

import { toDateKey } from './dateUtils';

/**
 * Checks whether the most recent 3 consecutive days all have a low mood rating (1 or 2).
 * If today's check-in has not been logged yet, checks starting from yesterday so an
 * ongoing 3-day low-mood pattern is still recognized gently.
 *
 * @param {Array<object>} [checkIns=[]] - Array of check-in records
 * @param {Date|string} [referenceDate=new Date()] - Current date reference
 * @returns {boolean} True if 3 consecutive recent days have mood 1 or 2
 */
export function detectLowMoodStreak(checkIns = [], referenceDate = new Date()) {
  if (!Array.isArray(checkIns) || checkIns.length < 3) {
    return false;
  }

  // Map dateKey -> mood for O(1) lookup
  const moodByDate = {};
  checkIns.forEach((item) => {
    if (item && item.date && typeof item.mood === 'number') {
      moodByDate[item.date] = item.mood;
    }
  });

  const ref = referenceDate instanceof Date ? new Date(referenceDate) : new Date(referenceDate);
  const todayKey = toDateKey(ref);

  const yesterday = new Date(ref);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  // Use today as the latest day if logged; otherwise allow yesterday as the anchor
  let anchorDate = null;
  if (moodByDate[todayKey] !== undefined) {
    anchorDate = new Date(ref);
  } else if (moodByDate[yesterdayKey] !== undefined) {
    anchorDate = yesterday;
  } else {
    return false;
  }

  // Verify all 3 consecutive days up to anchorDate have mood 1 or 2
  for (let offset = 0; offset < 3; offset++) {
    const cursor = new Date(anchorDate);
    cursor.setDate(cursor.getDate() - offset);
    const key = toDateKey(cursor);
    const mood = moodByDate[key];

    if (typeof mood !== 'number' || mood < 1 || mood > 2) {
      return false;
    }
  }

  return true;
}
