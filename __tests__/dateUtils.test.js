/**
 * __tests__/dateUtils.test.js
 * Unit tests for local-time date helpers in src/utils/dateUtils.js.
 * Covers YYYY-MM-DD padding, friendly formatting, and month/year boundary rollovers.
 */

import {
  toDateKey,
  formatDisplayDate,
  getLastNDays,
  isSameDay,
} from '../src/utils/dateUtils';

describe('Date Utilities', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('toDateKey', () => {
    it('formats local dates with zero-padded month and day', () => {
      const jan5 = new Date(2026, 0, 5, 14, 30);
      const nov26 = new Date(2026, 10, 26, 23, 59);
      expect(toDateKey(jan5)).toBe('2026-01-05');
      expect(toDateKey(nov26)).toBe('2026-11-26');
    });

    it('handles leap day and year-end dates accurately', () => {
      expect(toDateKey(new Date(2024, 1, 29, 10, 0))).toBe('2024-02-29');
      expect(toDateKey(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
    });
  });

  describe('formatDisplayDate', () => {
    it('formats a valid dateKey into readable weekday, day and month', () => {
      expect(formatDisplayDate('2026-11-23')).toBe('Mon, 23 Nov');
      expect(formatDisplayDate('2026-01-01')).toBe('Thu, 1 Jan');
    });

    it('handles empty or malformed inputs gracefully', () => {
      expect(formatDisplayDate('')).toBe('');
      expect(formatDisplayDate(null)).toBe('');
      expect(formatDisplayDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('getLastNDays', () => {
    it('crosses year boundary cleanly from December into January', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 0, 2, 12, 0, 0)); // Jan 2, 2026

      expect(getLastNDays(4)).toEqual([
        '2025-12-30',
        '2025-12-31',
        '2026-01-01',
        '2026-01-02',
      ]);
    });

    it('crosses leap-year February boundary cleanly', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 2, 1, 9, 0, 0)); // Mar 1, 2024

      expect(getLastNDays(3)).toEqual([
        '2024-02-28',
        '2024-02-29',
        '2024-03-01',
      ]);
    });
  });

  describe('isSameDay', () => {
    it('returns true for different times on the same local calendar day', () => {
      const morning = new Date(2026, 10, 26, 0, 5);
      const night = new Date(2026, 10, 26, 23, 55);
      expect(isSameDay(morning, night)).toBe(true);
    });

    it('returns false across midnight day boundaries', () => {
      const day1 = new Date(2026, 10, 26, 23, 59);
      const day2 = new Date(2026, 10, 27, 0, 1);
      expect(isSameDay(day1, day2)).toBe(false);
    });
  });
});
