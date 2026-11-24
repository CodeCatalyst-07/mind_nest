/**
 * __tests__/stats.test.js
 * Unit tests for statistical calculation utilities in MindNest.
 * Verifies range filtering, averages, streak tracking, edge cases, and mood emoji mapping.
 */

import {
  filterCheckInsByRange,
  calculateAverageMood,
  calculateAverageSleep,
  calculateAverageEnergy,
  calculateStreak,
  getBestAndWorstDay,
  getMoodEmoji,
} from '../src/utils/stats';

describe('Stats Utility Functions', () => {
  const sampleCheckIns = [
    { date: '2026-11-20', mood: 3, sleepHours: 6.5, energy: 3 },
    { date: '2026-11-21', mood: 4, sleepHours: 7.0, energy: 4 },
    { date: '2026-11-22', mood: 5, sleepHours: 8.5, energy: 5 },
    { date: '2026-11-23', mood: 2, sleepHours: 5.0, energy: 2 },
    { date: '2026-11-24', mood: 4, sleepHours: 7.5, energy: 4 },
  ];

  describe('filterCheckInsByRange', () => {
    it('filters entries within the last 3 days and sorts chronologically', () => {
      const refDate = new Date('2026-11-24T12:00:00');
      const filtered = filterCheckInsByRange(sampleCheckIns, 3, refDate);
      expect(filtered.map((c) => c.date)).toEqual(['2026-11-22', '2026-11-23', '2026-11-24']);
    });

    it('returns empty array if checkIns is empty or invalid', () => {
      expect(filterCheckInsByRange([])).toEqual([]);
      expect(filterCheckInsByRange(null)).toEqual([]);
    });

    it('filters out future entries beyond reference date', () => {
      const refDate = new Date('2026-11-22T12:00:00');
      const filtered = filterCheckInsByRange(sampleCheckIns, 7, refDate);
      expect(filtered.map((c) => c.date)).toEqual(['2026-11-20', '2026-11-21', '2026-11-22']);
    });
  });

  describe('calculateAverageMood', () => {
    it('calculates average mood rounded to 1 decimal place', () => {
      // (3 + 4 + 5 + 2 + 4) / 5 = 18 / 5 = 3.6
      expect(calculateAverageMood(sampleCheckIns)).toBe(3.6);
    });

    it('handles empty or invalid data gracefully by returning 0', () => {
      expect(calculateAverageMood([])).toBe(0);
      expect(calculateAverageMood(null)).toBe(0);
      expect(calculateAverageMood([{ mood: 'invalid' }])).toBe(0);
    });
  });

  describe('calculateAverageSleep', () => {
    it('calculates average sleep hours correctly', () => {
      // (6.5 + 7.0 + 8.5 + 5.0 + 7.5) / 5 = 34.5 / 5 = 6.9
      expect(calculateAverageSleep(sampleCheckIns)).toBe(6.9);
    });

    it('returns 0 for empty array', () => {
      expect(calculateAverageSleep([])).toBe(0);
    });
  });

  describe('calculateAverageEnergy', () => {
    it('calculates average energy level correctly', () => {
      // (3 + 4 + 5 + 2 + 4) / 5 = 3.6
      expect(calculateAverageEnergy(sampleCheckIns)).toBe(3.6);
    });

    it('returns 0 for empty array', () => {
      expect(calculateAverageEnergy([])).toBe(0);
    });
  });

  describe('calculateStreak', () => {
    it('computes unbroken streak ending today', () => {
      const refDate = new Date('2026-11-24T12:00:00');
      // Consecutive from 2026-11-20 to 2026-11-24 = 5 days
      expect(calculateStreak(sampleCheckIns, refDate)).toBe(5);
    });

    it('preserves active streak if user has not yet checked in today but checked in yesterday', () => {
      const refDate = new Date('2026-11-25T09:00:00'); // Today is 25th, last checkin was 24th
      expect(calculateStreak(sampleCheckIns, refDate)).toBe(5);
    });

    it('returns 0 if streak was broken (missed yesterday and today)', () => {
      const refDate = new Date('2026-11-26T09:00:00'); // Today is 26th, last was 24th
      expect(calculateStreak(sampleCheckIns, refDate)).toBe(0);
    });

    it('returns 0 for empty check-ins', () => {
      expect(calculateStreak([])).toBe(0);
      expect(calculateStreak(null)).toBe(0);
    });

    it('handles single check-in today correctly as 1 day streak', () => {
      const single = [{ date: '2026-11-24', mood: 4 }];
      expect(calculateStreak(single, new Date('2026-11-24T10:00:00'))).toBe(1);
    });
  });

  describe('getBestAndWorstDay', () => {
    it('identifies best and worst days of the week', () => {
      // 2026-11-20 is Fri (3), 2026-11-21 is Sat (4), 2026-11-22 is Sun (5), 2026-11-23 is Mon (2), 2026-11-24 is Tue (4)
      const result = getBestAndWorstDay(sampleCheckIns);
      expect(result).not.toBeNull();
      expect(result.bestDay.day).toBe('Sun');
      expect(result.bestDay.avgMood).toBe(5);
      expect(result.worstDay.day).toBe('Mon');
      expect(result.worstDay.avgMood).toBe(2);
    });

    it('returns null if fewer than 2 entries exist', () => {
      expect(getBestAndWorstDay([])).toBeNull();
      expect(getBestAndWorstDay([{ date: '2026-11-24', mood: 4 }])).toBeNull();
    });
  });

  describe('getMoodEmoji', () => {
    it('returns appropriate emojis for all 5 mood ratings', () => {
      expect(getMoodEmoji(1)).toBe('😢');
      expect(getMoodEmoji(2)).toBe('🙁');
      expect(getMoodEmoji(3)).toBe('😐');
      expect(getMoodEmoji(4)).toBe('🙂');
      expect(getMoodEmoji(5)).toBe('😄');
    });

    it('rounds float mood scores to nearest emoji', () => {
      expect(getMoodEmoji(4.2)).toBe('🙂');
      expect(getMoodEmoji(4.8)).toBe('😄');
    });
  });
});
