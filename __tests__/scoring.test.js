/**
 * __tests__/scoring.test.js
 * Purpose: Unit tests for the WHO-5 questionnaire scoring utility.
 * Verifies raw score summation, percentage calculation, and category boundary thresholds.
 */

import {
  calculateRawScore,
  calculatePercentage,
  getScoreCategory,
  scoreQuestionnaire,
} from '../src/utils/scoring';

describe('WHO-5 Scoring Utility', () => {
  describe('calculateRawScore', () => {
    it('sums answers correctly for 5 items', () => {
      expect(calculateRawScore([5, 5, 5, 5, 5])).toBe(25);
      expect(calculateRawScore([0, 0, 0, 0, 0])).toBe(0);
      expect(calculateRawScore([3, 2, 4, 1, 3])).toBe(13);
    });

    it('handles empty or missing answers gracefully', () => {
      expect(calculateRawScore([])).toBe(0);
      expect(calculateRawScore(null)).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('multiplies raw score by 4 to get 0-100%', () => {
      expect(calculatePercentage(25)).toBe(100);
      expect(calculatePercentage(0)).toBe(0);
      expect(calculatePercentage(13)).toBe(52);
    });

    it('clamps values within 0 and 100', () => {
      expect(calculatePercentage(-5)).toBe(0);
      expect(calculatePercentage(30)).toBe(100);
    });
  });

  describe('getScoreCategory', () => {
    it('classifies 72-100 as Thriving', () => {
      expect(getScoreCategory(100)).toBe('Thriving');
      expect(getScoreCategory(72)).toBe('Thriving');
    });

    it('classifies 50-71 as Doing okay', () => {
      expect(getScoreCategory(71)).toBe('Doing okay');
      expect(getScoreCategory(50)).toBe('Doing okay');
    });

    it('classifies 29-49 as Needs attention', () => {
      expect(getScoreCategory(49)).toBe('Needs attention');
      expect(getScoreCategory(29)).toBe('Needs attention');
    });

    it('classifies 0-28 as Low', () => {
      expect(getScoreCategory(28)).toBe('Low');
      expect(getScoreCategory(0)).toBe('Low');
    });
  });

  describe('scoreQuestionnaire', () => {
    it('returns a comprehensive scoring object', () => {
      const result = scoreQuestionnaire([4, 4, 4, 4, 4]); // 20 * 4 = 80
      expect(result.rawScore).toBe(20);
      expect(result.percentage).toBe(80);
      expect(result.category).toBe('Thriving');
      expect(result.isLowCategory).toBe(false);
      expect(result.color).toBeDefined();
    });

    it('flags isLowCategory for low scores', () => {
      const result = scoreQuestionnaire([1, 1, 1, 1, 1]); // 5 * 4 = 20
      expect(result.percentage).toBe(20);
      expect(result.category).toBe('Low');
      expect(result.isLowCategory).toBe(true);
    });
  });
});
