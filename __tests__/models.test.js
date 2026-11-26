/**
 * __tests__/models.test.js
 * Unit tests for MindNest data model factory functions in src/data/models.js.
 * Verifies default values, numeric clamping, validation, and edge cases.
 */

import {
  DEFAULT_SETTINGS,
  createCheckIn,
  createAssessment,
  createGratitudeEntry,
  createToolSession,
} from '../src/data/models';

describe('Data Model Factories', () => {
  describe('DEFAULT_SETTINGS', () => {
    it('exposes safe default preferences for new and migrated users', () => {
      expect(DEFAULT_SETTINGS).toEqual({
        themeMode: 'system',
        hapticsEnabled: true,
        onboardingDone: false,
        reminderEnabled: false,
        reminderTime: '20:00',
        pinEnabled: false,
      });
    });
  });

  describe('createCheckIn', () => {
    it('applies safe defaults when optional fields are omitted', () => {
      const record = createCheckIn();
      expect(record.id).toMatch(/^checkin_/);
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.mood).toBe(3);
      expect(record.energy).toBe(3);
      expect(record.sleepHours).toBe(7);
      expect(record.note).toBe('');
      expect(record.tags).toEqual([]);
      expect(typeof record.createdAt).toBe('string');
    });

    it('clamps mood/energy between 1 and 5, prevents negative sleep, and trims note', () => {
      const record = createCheckIn({
        date: '2026-11-26',
        mood: 9,
        energy: -2,
        sleepHours: -4,
        note: '  Long study session  ',
        tags: 'not-an-array',
      });

      expect(record.date).toBe('2026-11-26');
      expect(record.mood).toBe(5);
      expect(record.energy).toBe(1);
      expect(record.sleepHours).toBe(0);
      expect(record.note).toBe('Long study session');
      expect(record.tags).toEqual([]);
    });
  });

  describe('createAssessment', () => {
    it('creates a formatted assessment with defaults when empty', () => {
      const assessment = createAssessment();
      expect(assessment.id).toMatch(/^assessment_/);
      expect(assessment.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(assessment.answers).toEqual([]);
      expect(assessment.score).toBe(0);
      expect(assessment.category).toBe('Weekly Well-being');
    });

    it('preserves provided answers, score, and category', () => {
      const assessment = createAssessment({
        date: '2026-11-26',
        answers: [4, 4, 3, 4, 5],
        score: 80,
        category: 'Thriving',
      });
      expect(assessment.answers).toEqual([4, 4, 3, 4, 5]);
      expect(assessment.score).toBe(80);
      expect(assessment.category).toBe('Thriving');
    });
  });

  describe('createGratitudeEntry', () => {
    it('trims whitespace and limits text to 100 characters', () => {
      const longText = `   ${'a'.repeat(130)}   `;
      const entry = createGratitudeEntry({ text: longText });

      expect(entry.id).toMatch(/^gratitude_/);
      expect(entry.text.length).toBe(100);
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('falls back to empty string for non-string input', () => {
      const entry = createGratitudeEntry({ text: 12345 });
      expect(entry.text).toBe('');
    });
  });

  describe('createToolSession', () => {
    it('accepts valid tool types and rounds duration seconds cleanly', () => {
      const session = createToolSession({
        type: 'grounding',
        durationSec: 95.6,
        date: '2026-11-26',
      });

      expect(session.id).toMatch(/^session_/);
      expect(session.type).toBe('grounding');
      expect(session.durationSec).toBe(96);
      expect(session.date).toBe('2026-11-26');
    });

    it('falls back to breathing for unrecognized tool types and clamps negative duration', () => {
      const session = createToolSession({
        type: 'invalid_tool',
        durationSec: -30,
      });

      expect(session.type).toBe('breathing');
      expect(session.durationSec).toBe(0);
    });
  });
});
