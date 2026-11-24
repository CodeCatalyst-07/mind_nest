/**
 * __tests__/insights.test.js
 * Unit tests for the reflective insights utility in MindNest.
 * Verifies non-clinical wording, threshold checks (sleep, tags, weekdays), and streak feedback.
 */

import { generateInsights } from '../src/utils/insights';

describe('Insights Generation Utility', () => {
  it('returns an encouraging onboarding insight when check-in list is empty', () => {
    const insights = generateInsights([]);
    expect(insights.length).toBe(1);
    expect(insights[0].id).toBe('empty_start');
    expect(insights[0].title).toBe('Start Your Journey');
    expect(insights[0].text).toContain('Complete daily check-ins');
  });

  it('triggers sleep & mood pattern only when both groups have at least 3 entries', () => {
    // Only 2 short sleep days and 3 good sleep days -> threshold not met
    const insufficientShort = [
      { date: '2026-11-20', sleepHours: 5, mood: 2 },
      { date: '2026-11-21', sleepHours: 5.5, mood: 2 },
      { date: '2026-11-22', sleepHours: 8, mood: 4 },
      { date: '2026-11-23', sleepHours: 7.5, mood: 5 },
      { date: '2026-11-24', sleepHours: 8, mood: 4 },
    ];
    let insights = generateInsights(insufficientShort);
    expect(insights.find((i) => i.id === 'sleep_mood_connection')).toBeUndefined();

    // Now add 1 more short sleep day to make it 3 and 3
    const sufficientData = [
      ...insufficientShort,
      { date: '2026-11-19', sleepHours: 4.5, mood: 2 },
    ];
    insights = generateInsights(sufficientData);
    const sleepInsight = insights.find(
      (i) => i.id === 'sleep_mood_connection' || i.id === 'sleep_mood_balance'
    );
    expect(sleepInsight).toBeDefined();
    expect(sleepInsight.text).toMatch(/tends to be higher|average a mood/i);
  });

  it('identifies the best weekday when enough multi-day data is provided', () => {
    const data = [
      { date: '2026-11-20', mood: 3 }, // Fri
      { date: '2026-11-21', mood: 5 }, // Sat
      { date: '2026-11-22', mood: 4 }, // Sun
      { date: '2026-11-23', mood: 2 }, // Mon
    ];
    const insights = generateInsights(data);
    const weekdayInsight = insights.find((i) => i.id === 'best_weekday');
    expect(weekdayInsight).toBeDefined();
    expect(weekdayInsight.text).toContain('Saturdays');
  });

  it('identifies top tag on low-mood days if there are at least 3 low-mood days', () => {
    const lowMoodData = [
      { date: '2026-11-20', mood: 2, tags: ['Exams', 'Study'] },
      { date: '2026-11-21', mood: 1, tags: ['Exams', 'Tired'] },
      { date: '2026-11-22', mood: 2, tags: ['Exams'] },
      { date: '2026-11-23', mood: 4, tags: ['Social'] },
    ];
    const insights = generateInsights(lowMoodData);
    const tagInsight = insights.find((i) => i.id === 'low_mood_tags');
    expect(tagInsight).toBeDefined();
    expect(tagInsight.text).toContain('Exams');
    expect(tagInsight.text).toContain('3 of your 3');
  });

  it('does not produce clinical or diagnostic language', () => {
    const demoData = [
      { date: '2026-11-20', mood: 1, sleepHours: 4, tags: ['Exams'] },
      { date: '2026-11-21', mood: 2, sleepHours: 5, tags: ['Exams'] },
      { date: '2026-11-22', mood: 1, sleepHours: 5, tags: ['Exams'] },
      { date: '2026-11-23', mood: 4, sleepHours: 8, tags: ['Rest'] },
      { date: '2026-11-24', mood: 5, sleepHours: 7.5, tags: ['Friends'] },
      { date: '2026-11-25', mood: 4, sleepHours: 8, tags: ['Exercise'] },
    ];
    const insights = generateInsights(demoData);
    const combinedText = insights.map((i) => `${i.title} ${i.text}`).join(' ').toLowerCase();

    // Ensure non-clinical framing
    expect(combinedText).not.toContain('depress');
    expect(combinedText).not.toContain('disorder');
    expect(combinedText).not.toContain('diagnos');
    expect(combinedText).not.toContain('illness');
  });
});
