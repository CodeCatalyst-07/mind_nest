/**
 * src/utils/stats.js
 * Purpose: Pure calculation functions for student well-being statistics.
 * Computes date-range filtering, averages (mood, sleep, energy), consecutive
 * check-in streaks, and best/worst days of the week for mood.
 *
 * Designed to be simple, predictable, and 100% free of side effects.
 */

import { toDateKey } from './dateUtils';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Filters check-in entries that fall within the last `days` count relative to a reference date.
 * Returns entries sorted chronologically (oldest first) so charts can render left-to-right.
 *
 * @param {Array<object>} checkIns - Array of check-in objects
 * @param {number} [days=7] - Number of days to include (e.g., 7 or 30)
 * @param {Date|string} [referenceDate=new Date()] - End date of the window
 * @returns {Array<object>} Filtered check-in objects
 */
export function filterCheckInsByRange(checkIns = [], days = 7, referenceDate = new Date()) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return [];

  const ref = referenceDate instanceof Date ? new Date(referenceDate) : new Date(referenceDate);
  ref.setHours(23, 59, 59, 999);

  // Calculate cutoff date (inclusive of reference date)
  const cutoff = new Date(ref);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  cutoff.setHours(0, 0, 0, 0);

  const cutoffKey = toDateKey(cutoff);
  const refKey = toDateKey(ref);

  return checkIns
    .filter((item) => {
      if (!item || !item.date) return false;
      return item.date >= cutoffKey && item.date <= refKey;
    })
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

/**
 * Calculates the average mood rating across given check-ins.
 * Returns rounded to 1 decimal place (e.g. 3.8), or 0 if no valid records.
 *
 * @param {Array<object>} checkIns
 * @returns {number} Average mood (1.0 to 5.0) or 0
 */
export function calculateAverageMood(checkIns = []) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return 0;
  const valid = checkIns.filter((c) => typeof c?.mood === 'number' && c.mood >= 1 && c.mood <= 5);
  if (valid.length === 0) return 0;

  const sum = valid.reduce((acc, curr) => acc + curr.mood, 0);
  return Number((sum / valid.length).toFixed(1));
}

/**
 * Calculates the average sleep hours across given check-ins.
 * Returns rounded to 1 decimal place (e.g. 7.5), or 0 if no valid records.
 *
 * @param {Array<object>} checkIns
 * @returns {number} Average sleep hours or 0
 */
export function calculateAverageSleep(checkIns = []) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return 0;
  const valid = checkIns.filter((c) => typeof c?.sleepHours === 'number' && c.sleepHours >= 0);
  if (valid.length === 0) return 0;

  const sum = valid.reduce((acc, curr) => acc + curr.sleepHours, 0);
  return Number((sum / valid.length).toFixed(1));
}

/**
 * Calculates the average energy level across given check-ins.
 * Returns rounded to 1 decimal place (e.g. 3.2), or 0 if no valid records.
 *
 * @param {Array<object>} checkIns
 * @returns {number} Average energy (1.0 to 5.0) or 0
 */
export function calculateAverageEnergy(checkIns = []) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return 0;
  const valid = checkIns.filter((c) => typeof c?.energy === 'number' && c.energy >= 1 && c.energy <= 5);
  if (valid.length === 0) return 0;

  const sum = valid.reduce((acc, curr) => acc + curr.energy, 0);
  return Number((sum / valid.length).toFixed(1));
}

/**
 * Computes the consecutive daily check-in streak up to today.
 * If the user hasn't checked in yet today, an active streak from yesterday is preserved.
 *
 * @param {Array<object>} checkIns - All user check-ins
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {number} Active streak count in consecutive days
 */
export function calculateStreak(checkIns = [], referenceDate = new Date()) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return 0;

  const ref = referenceDate instanceof Date ? new Date(referenceDate) : new Date(referenceDate);
  const dateSet = new Set(checkIns.map((c) => c?.date).filter(Boolean));

  const todayKey = toDateKey(ref);

  const yesterday = new Date(ref);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  // If neither today nor yesterday has a check-in, streak is broken
  let startCursor = null;
  if (dateSet.has(todayKey)) {
    startCursor = new Date(ref);
  } else if (dateSet.has(yesterdayKey)) {
    startCursor = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(startCursor);

  while (true) {
    const key = toDateKey(cursor);
    if (dateSet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Finds the days of the week with the highest (best) and lowest (worst) average mood.
 * Returns null if there are fewer than 2 check-ins.
 *
 * @param {Array<object>} checkIns
 * @returns {{ bestDay: { day: string, avgMood: number }, worstDay: { day: string, avgMood: number } } | null}
 */
export function getBestAndWorstDay(checkIns = []) {
  if (!Array.isArray(checkIns) || checkIns.length < 2) return null;

  // Group moods by day of week index (0=Sun, 6=Sat)
  const dayGroups = {};
  checkIns.forEach((item) => {
    if (!item?.date || typeof item?.mood !== 'number') return;
    const parts = item.date.split('-');
    if (parts.length !== 3) return;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayIndex = d.getDay();
    if (!dayGroups[dayIndex]) {
      dayGroups[dayIndex] = [];
    }
    dayGroups[dayIndex].push(item.mood);
  });

  const dayIndices = Object.keys(dayGroups);
  if (dayIndices.length === 0) return null;

  const averages = dayIndices.map((idx) => {
    const moods = dayGroups[idx];
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    return {
      day: DAY_NAMES[parseInt(idx, 10)],
      avgMood: Number(avg.toFixed(1)),
      count: moods.length,
    };
  });

  averages.sort((a, b) => b.avgMood - a.avgMood);

  const best = averages[0];
  const worst = averages[averages.length - 1];

  return {
    bestDay: { day: best.day, avgMood: best.avgMood },
    worstDay: { day: worst.day, avgMood: worst.avgMood },
  };
}

/**
 * Maps a numeric mood score (1-5) to a friendly emoji character.
 *
 * @param {number} mood
 * @returns {string} Emoji
 */
export function getMoodEmoji(mood) {
  const rounded = Math.round(mood);
  switch (rounded) {
    case 1:
      return '😢';
    case 2:
      return '🙁';
    case 3:
      return '😐';
    case 4:
      return '🙂';
    case 5:
      return '😄';
    default:
      return '✨';
  }
}
