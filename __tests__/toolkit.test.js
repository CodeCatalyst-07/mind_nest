/**
 * __tests__/toolkit.test.js
 * Unit tests for Coping Toolkit helper utilities in MindNest.
 * Verifies mood-based recommendations and 7-day usage summary aggregation.
 */

import { getRecommendation, summarizeSessions } from '../src/utils/toolkit';

describe('Toolkit Utility Helpers', () => {
  describe('getRecommendation', () => {
    it('suggests quick 1-minute breathing when no check-in exists yet', () => {
      const recNull = getRecommendation(null);
      const recUndef = getRecommendation(undefined);

      expect(recNull.toolId).toBe('breathing');
      expect(recNull.reason).toContain('1-minute');
      expect(recUndef.toolId).toBe('breathing');
    });

    it('suggests breathing or grounding for low moods (1-2)', () => {
      const rec1 = getRecommendation(1);
      const rec2 = getRecommendation(2);

      expect(['breathing', 'grounding']).toContain(rec1.toolId);
      expect(['breathing', 'grounding']).toContain(rec2.toolId);
      expect(rec1.reason.length).toBeGreaterThan(10);
    });

    it('suggests grounding for neutral mood (3)', () => {
      const rec3 = getRecommendation(3);
      expect(rec3.toolId).toBe('grounding');
      expect(rec3.route).toBe('Grounding');
    });

    it('suggests gratitude for positive moods (4-5)', () => {
      const rec4 = getRecommendation(4);
      const rec5 = getRecommendation(5);

      expect(rec4.toolId).toBe('gratitude');
      expect(rec5.toolId).toBe('gratitude');
    });
  });

  describe('summarizeSessions', () => {
    const refDate = new Date('2026-11-25T12:00:00');
    const sampleSessions = [
      { id: '1', type: 'breathing', durationSec: 120, date: '2026-11-25' },
      { id: '2', type: 'grounding', durationSec: 90, date: '2026-11-24' },
      { id: '3', type: 'gratitude', durationSec: 60, date: '2026-11-20' },
      { id: '4', type: 'breathing', durationSec: 300, date: '2026-11-19' }, // Exactly day 7 (25 - 6 = 19)
      { id: '5', type: 'breathing', durationSec: 180, date: '2026-11-10' }, // Outside 7-day window
    ];

    it('summarizes total sessions, minutes, and counts per tool within the last 7 days', () => {
      const summary = summarizeSessions(sampleSessions, 7, refDate);
      // Sessions 1..4 are within Nov 19 - Nov 25: 120 + 90 + 60 + 300 = 570 sec -> 10 min (9.5 rounded)
      expect(summary.totalSessions).toBe(4);
      expect(summary.totalMinutes).toBe(10);
      expect(summary.counts).toEqual({
        breathing: 2,
        grounding: 1,
        gratitude: 1,
      });
    });

    it('handles custom range windows (e.g. 30 days)', () => {
      const summary = summarizeSessions(sampleSessions, 30, refDate);
      expect(summary.totalSessions).toBe(5);
      // 570 + 180 = 750 sec -> 12.5 -> 13 min
      expect(summary.totalMinutes).toBe(13);
      expect(summary.counts.breathing).toBe(3);
    });

    it('handles empty or null session arrays safely', () => {
      expect(summarizeSessions([])).toEqual({
        totalSessions: 0,
        totalMinutes: 0,
        counts: { breathing: 0, grounding: 0, gratitude: 0 },
      });
      expect(summarizeSessions(null)).toEqual({
        totalSessions: 0,
        totalMinutes: 0,
        counts: { breathing: 0, grounding: 0, gratitude: 0 },
      });
    });
  });
});
