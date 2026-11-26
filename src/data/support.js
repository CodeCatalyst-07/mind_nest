/**
 * src/data/support.js
 * Purpose: Centralized support resources, helplines, and conversation tips for MindNest.
 *
 * IMPORTANT: Verify all helpline phone numbers, availability, and regional details
 * before any public app store release.
 */

export const PRIMARY_HELPLINE = {
  id: 'tele_manas',
  name: 'Tele-MANAS',
  subtitle: 'National Mental Health Helpline (India)',
  description: 'Free, confidential mental health support available 24x7 in multiple languages.',
  primaryNumber: '14416',
  primaryDialUrl: 'tel:14416',
  altNumber: '1-800-891-4416',
  altDialUrl: 'tel:18008914416',
  availability: 'Free • 24x7',
};

export const EMERGENCY_RESOURCE = {
  id: 'emergency_112',
  name: 'Emergency Services',
  number: '112',
  dialUrl: 'tel:112',
  title: 'When to call 112',
  description:
    'If you or someone with you is in immediate physical danger, hurt, or in an urgent crisis where safety is at risk, call 112 right away or go to the nearest hospital emergency room.',
};

export const TRUSTED_PEOPLE = [
  {
    id: 'parent',
    label: 'Parent or Guardian',
    icon: '🏡',
    tip: 'Family members who care about your well-being and can help you find support.',
  },
  {
    id: 'friend',
    label: 'Close Friend',
    icon: '🤝',
    tip: 'Sometimes sharing what you are going through with a friend makes the load lighter.',
  },
  {
    id: 'teacher',
    label: 'Teacher or Mentor',
    icon: '📚',
    tip: 'Instructors and academic advisors can often help adjust deadlines when life gets heavy.',
  },
  {
    id: 'counsellor',
    label: 'Campus Counsellor',
    icon: '💬',
    tip: 'Most colleges offer free, confidential student counselling on campus.',
  },
];

export const CONVERSATION_STARTERS = [
  "I've been feeling off lately and I'd like to talk.",
  'College stress has been piling up this week—could we catch up for a bit?',
  "I'm having a rough time and just need someone to listen right now.",
  'Can I share something I have been struggling with lately?',
];

export const SUPPORT_DISCLAIMER =
  'MindNest is a student self-help and reflection app. It is not a diagnostic tool, medical advice, therapy, or an emergency service.';
