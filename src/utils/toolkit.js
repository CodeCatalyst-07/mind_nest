/**
 * src/utils/toolkit.js
 * Purpose: Pure helper functions for the Coping Toolkit tab.
 * Determines mood-based tool recommendations and summarizes weekly toolkit session usage.
 */

import { toDateKey } from './dateUtils';

/**
 * Recommends a supportive coping tool based on the student's current mood rating.
 *
 * @param {number|null|undefined} todayMood - Today's mood (1-5) or null/undefined if not checked in
 * @returns {{ toolId: string, route: string, title: string, reason: string }}
 */
export function getRecommendation(todayMood) {
  if (todayMood === null || todayMood === undefined || typeof todayMood !== 'number') {
    return {
      toolId: 'breathing',
      route: 'Breathing',
      title: '1-Minute Breathing Reset',
      reason: 'Haven’t checked in yet today? Take a quick 1-minute breathing pause to center yourself.',
    };
  }

  if (todayMood <= 1) {
    return {
      toolId: 'breathing',
      route: 'Breathing',
      title: 'Guided Breathing',
      reason: 'On tough days, slowing down your exhale can help ease overwhelming tension.',
    };
  }

  if (todayMood === 2) {
    return {
      toolId: 'grounding',
      route: 'Grounding',
      title: '5-4-3-2-1 Grounding',
      reason: 'Feeling stressed or low? Tuning into your surroundings helps bring you back to the moment.',
    };
  }

  if (todayMood === 3) {
    return {
      toolId: 'grounding',
      route: 'Grounding',
      title: '5-4-3-2-1 Grounding',
      reason: 'A brief sensory reset is a great way to refresh focus between classes or study blocks.',
    };
  }

  // Mood 4 or 5
  return {
    toolId: 'gratitude',
    route: 'Gratitude',
    title: 'Gratitude Journal',
    reason: 'You’re in a good headspace today — jot down a small win to anchor that positive energy.',
  };
}

/**
 * Summarizes toolkit sessions within the past `days` calendar days.
 *
 * @param {Array<object>} [sessions=[]] - Array of ToolSession objects
 * @param {number} [days=7] - Window length in days
 * @param {Date|string} [referenceDate=new Date()] - End date of the window
 * @returns {{
 *   totalSessions: number,
 *   totalMinutes: number,
 *   counts: { breathing: number, grounding: number, gratitude: number }
 * }}
 */
export function summarizeSessions(sessions = [], days = 7, referenceDate = new Date()) {
  const emptySummary = {
    totalSessions: 0,
    totalMinutes: 0,
    counts: {
      breathing: 0,
      grounding: 0,
      gratitude: 0,
    },
  };

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return emptySummary;
  }

  const ref = referenceDate instanceof Date ? new Date(referenceDate) : new Date(referenceDate);
  ref.setHours(23, 59, 59, 999);

  const cutoff = new Date(ref);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  cutoff.setHours(0, 0, 0, 0);

  const cutoffKey = toDateKey(cutoff);
  const refKey = toDateKey(ref);

  const counts = {
    breathing: 0,
    grounding: 0,
    gratitude: 0,
  };

  let totalSessions = 0;
  let totalSeconds = 0;

  sessions.forEach((session) => {
    if (!session || !session.date) return;
    if (session.date < cutoffKey || session.date > refKey) return;

    totalSessions += 1;
    totalSeconds += Math.max(0, Number(session.durationSec) || 0);

    if (session.type && Object.prototype.hasOwnProperty.call(counts, session.type)) {
      counts[session.type] += 1;
    }
  });

  return {
    totalSessions,
    totalMinutes: Math.round(totalSeconds / 60),
    counts,
  };
}
