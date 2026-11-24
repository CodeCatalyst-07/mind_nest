/**
 * src/data/questionnaire.js
 * Purpose: Adapted WHO-5 Well-Being Index questions and standardized answer options.
 * The WHO-5 is a validated 5-question positive well-being self-assessment.
 * Each item is scored on a 0 (Never) to 5 (Always) frequency scale over the past two weeks.
 */

export const QUESTIONNAIRE_ITEMS = [
  {
    id: 'who5_1',
    text: 'Over the last two weeks, I have felt cheerful and in good spirits.',
    shortLabel: 'Cheerful & Spirits',
  },
  {
    id: 'who5_2',
    text: 'Over the last two weeks, I have felt calm and relaxed.',
    shortLabel: 'Calm & Relaxed',
  },
  {
    id: 'who5_3',
    text: 'Over the last two weeks, I have felt active and full of energy.',
    shortLabel: 'Active & Energetic',
  },
  {
    id: 'who5_4',
    text: 'Over the last two weeks, I woke up feeling fresh and rested.',
    shortLabel: 'Fresh & Rested',
  },
  {
    id: 'who5_5',
    text: 'Over the last two weeks, my daily life was filled with things that interest me.',
    shortLabel: 'Engaged & Interested',
  },
];

export const ANSWER_OPTIONS = [
  { value: 5, label: 'Always', description: 'All of the time' },
  { value: 4, label: 'Very often', description: 'Most of the time' },
  { value: 3, label: 'Often', description: 'More than half the time' },
  { value: 2, label: 'Sometimes', description: 'Less than half the time' },
  { value: 1, label: 'Rarely', description: 'Some of the time' },
  { value: 0, label: 'Never', description: 'At no time' },
];
