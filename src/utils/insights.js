/**
 * src/utils/insights.js
 * Purpose: Analyzes check-in and assessment history to discover gentle,
 * plain-language wellness patterns and reflections for students.
 *
 * Strictly non-clinical: describes observations and tendencies ("your mood tends to be higher..."),
 * never diagnosing or making medical assertions.
 */

import { calculateStreak } from './stats';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Analyzes recorded check-ins and returns a list of supportive insight objects.
 *
 * @param {Array<object>} checkIns - All check-in records
 * @returns {Array<{ id: string, icon: string, title: string, text: string }>}
 */
export function generateInsights(checkIns = []) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) {
    return [
      {
        id: 'empty_start',
        icon: '🌱',
        title: 'Start Your Journey',
        text: 'Complete daily check-ins to discover your personal patterns around sleep, mood, and energy.',
      },
    ];
  }

  const insights = [];

  // 1. Sleep & Mood Connection (requires at least 3 days in both groups)
  const shortSleepDays = checkIns.filter(
    (c) => typeof c?.sleepHours === 'number' && c.sleepHours < 6 && typeof c?.mood === 'number'
  );
  const goodSleepDays = checkIns.filter(
    (c) => typeof c?.sleepHours === 'number' && c.sleepHours >= 7 && typeof c?.mood === 'number'
  );

  if (shortSleepDays.length >= 3 && goodSleepDays.length >= 3) {
    const avgShortMood =
      shortSleepDays.reduce((acc, c) => acc + c.mood, 0) / shortSleepDays.length;
    const avgGoodMood =
      goodSleepDays.reduce((acc, c) => acc + c.mood, 0) / goodSleepDays.length;

    const shortFormatted = avgShortMood.toFixed(1);
    const goodFormatted = avgGoodMood.toFixed(1);

    if (avgGoodMood > avgShortMood) {
      insights.push({
        id: 'sleep_mood_connection',
        icon: '🌙',
        title: 'Sleep & Mood Pattern',
        text: `Your mood tends to be higher (avg ${goodFormatted}) on days you get 7+ hours of sleep, compared to under 6 hours (avg ${shortFormatted}).`,
      });
    } else {
      insights.push({
        id: 'sleep_mood_balance',
        icon: '🌙',
        title: 'Sleep & Rest Overview',
        text: `You average a mood of ${goodFormatted} on 7+ hours of sleep and ${shortFormatted} on shorter nights.`,
      });
    }
  }

  // 2. Best Weekday for Mood (requires at least 4 check-ins across at least 2 distinct weekdays)
  const weekdayGroups = {};
  checkIns.forEach((item) => {
    if (!item?.date || typeof item?.mood !== 'number') return;
    const parts = item.date.split('-');
    if (parts.length !== 3) return;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayIdx = d.getDay();
    if (!weekdayGroups[dayIdx]) weekdayGroups[dayIdx] = [];
    weekdayGroups[dayIdx].push(item.mood);
  });

  const distinctDays = Object.keys(weekdayGroups);
  if (checkIns.length >= 4 && distinctDays.length >= 2) {
    const weekdayAverages = distinctDays.map((idx) => {
      const moods = weekdayGroups[idx];
      const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
      return {
        name: WEEKDAYS[parseInt(idx, 10)],
        avgMood: avg,
        count: moods.length,
      };
    });

    weekdayAverages.sort((a, b) => b.avgMood - a.avgMood);
    const topDay = weekdayAverages[0];

    if (topDay) {
      insights.push({
        id: 'best_weekday',
        icon: '🌟',
        title: 'Best Day of the Week',
        text: `You tend to feel best on ${topDay.name}s, averaging a mood rating of ${topDay.avgMood.toFixed(1)}.`,
      });
    }
  }

  // 3. Most common tag on low-mood days (mood <= 2, at least 3 such days)
  const lowMoodDays = checkIns.filter((c) => typeof c?.mood === 'number' && c.mood <= 2);
  if (lowMoodDays.length >= 3) {
    const tagCounts = {};
    lowMoodDays.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((tag) => {
          if (tag) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    const tagEntries = Object.entries(tagCounts);
    if (tagEntries.length > 0) {
      tagEntries.sort((a, b) => b[1] - a[1]);
      const [topTag, count] = tagEntries[0];

      insights.push({
        id: 'low_mood_tags',
        icon: '🏷️',
        title: 'Common Stressors',
        text: `The tag "${topTag}" was selected in ${count} of your ${lowMoodDays.length} lower-mood days. Planning extra self-care around this activity might help.`,
      });
    }
  }

  // 4. Streak encouragement
  const streak = calculateStreak(checkIns);
  if (streak >= 3) {
    insights.push({
      id: 'streak_win',
      icon: '🔥',
      title: 'Consistency Win',
      text: `You're on a ${streak}-day check-in streak! Taking time each day for self-reflection helps build long-term mindfulness.`,
    });
  } else if (streak >= 1) {
    insights.push({
      id: 'streak_progress',
      icon: '🌱',
      title: 'Building Your Habit',
      text: `Great job checking in! Consistency is key to unlocking deeper insights into what helps you study and feel your best.`,
    });
  } else {
    insights.push({
      id: 'streak_restart',
      icon: '✨',
      title: 'Daily Reflection',
      text: `Checking in daily only takes a minute and helps you notice what brings you energy throughout the week.`,
    });
  }

  return insights;
}
