/**
 * __tests__/support.test.js
 * Unit tests for low-mood streak detection in MindNest.
 * Verifies consecutive-day checks, missing-today fallback to yesterday, gaps, and empty edge cases.
 */

import { detectLowMoodStreak } from '../src/utils/support';

describe('Low Mood Streak Detection', () => {
  const refDate = new Date('2026-11-26T12:00:00');

  it('returns true when the last 3 consecutive days ending today have mood 1 or 2', () => {
    const checkIns = [
      { date: '2026-11-24', mood: 2 },
      { date: '2026-11-25', mood: 1 },
      { date: '2026-11-26', mood: 2 },
    ];
    expect(detectLowMoodStreak(checkIns, refDate)).toBe(true);
  });

  it('returns true when today is missing and the 3 consecutive days ending yesterday have mood 1 or 2', () => {
    const checkIns = [
      { date: '2026-11-23', mood: 1 },
      { date: '2026-11-24', mood: 2 },
      { date: '2026-11-25', mood: 2 },
    ];
    expect(detectLowMoodStreak(checkIns, refDate)).toBe(true);
  });

  it('returns false when there are fewer than 3 check-ins', () => {
    expect(detectLowMoodStreak([], refDate)).toBe(false);
    expect(detectLowMoodStreak(null, refDate)).toBe(false);
    expect(
      detectLowMoodStreak(
        [
          { date: '2026-11-25', mood: 1 },
          { date: '2026-11-26', mood: 1 },
        ],
        refDate
      )
    ).toBe(false);
  });

  it('returns false when there is a gap in days despite 3 low-mood entries', () => {
    const gappedCheckIns = [
      { date: '2026-11-22', mood: 1 }, // gap on Nov 23
      { date: '2026-11-24', mood: 2 },
      { date: '2026-11-25', mood: 1 },
      { date: '2026-11-26', mood: 2 },
    ];
    // Wait: Nov 24, 25, 26 IS 3 consecutive days! Let's put the gap inside the last 3 days:
    const gappedRecent = [
      { date: '2026-11-23', mood: 1 },
      { date: '2026-11-24', mood: 2 }, // gap on Nov 25
      { date: '2026-11-26', mood: 1 },
    ];
    expect(detectLowMoodStreak(gappedCheckIns, refDate)).toBe(true);
    expect(detectLowMoodStreak(gappedRecent, refDate)).toBe(false);
  });

  it('returns false when any of the 3 most recent consecutive days has mood >= 3', () => {
    const mixedCheckIns = [
      { date: '2026-11-23', mood: 1 },
      { date: '2026-11-24', mood: 3 },
      { date: '2026-11-25', mood: 2 },
      { date: '2026-11-26', mood: 1 },
    ];
    expect(detectLowMoodStreak(mixedCheckIns, refDate)).toBe(false);
  });

  it('returns false when a 3-day low streak ended 2 or more days ago', () => {
    const staleStreak = [
      { date: '2026-11-21', mood: 1 },
      { date: '2026-11-22', mood: 2 },
      { date: '2026-11-23', mood: 1 },
    ];
    expect(detectLowMoodStreak(staleStreak, refDate)).toBe(false);
  });
});
