/**
 * src/data/toolkit.js
 * Purpose: Static catalog and exercise definitions for the Coping Toolkit.
 * Contains metadata for the 3 self-help tools, breathing pattern timings,
 * 5-4-3-2-1 sensory grounding steps, and gratitude journal prompts.
 */

// Tool catalog displayed on the Toolkit home screen
// Uses colorKey to dynamically look up colors from the active light/dark theme
export const TOOL_CATALOG = [
  {
    id: 'breathing',
    route: 'Breathing',
    title: 'Guided Breathing',
    description: 'Slow, rhythmic breathing timers to quiet your mind and ease study stress.',
    icon: '🌬️',
    durationHint: '1–5 min',
    colorKey: 'primary',
  },
  {
    id: 'grounding',
    route: 'Grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Step-by-step sensory check-in to reconnect with your surroundings.',
    icon: '🌿',
    durationHint: '2 min',
    colorKey: 'accent',
  },
  {
    id: 'gratitude',
    route: 'Gratitude',
    title: 'Gratitude Journal',
    description: 'Quick daily reflections to notice small wins and positive moments.',
    icon: '✨',
    durationHint: '1 min',
    colorKey: 'moodLevel4',
  },
];

// Supported breathing exercise rhythms
export const BREATHING_PATTERNS = [
  {
    id: 'calm',
    name: 'Calm (4-6)',
    subtitle: 'Longer exhale to release tension',
    phases: [
      { label: 'Breathe in', seconds: 4, action: 'inhale' },
      { label: 'Breathe out', seconds: 6, action: 'exhale' },
    ],
  },
  {
    id: 'box',
    name: 'Box (4-4-4-4)',
    subtitle: 'Even rhythm for calm focus',
    phases: [
      { label: 'Breathe in', seconds: 4, action: 'inhale' },
      { label: 'Hold', seconds: 4, action: 'hold' },
      { label: 'Breathe out', seconds: 4, action: 'exhale' },
      { label: 'Hold', seconds: 4, action: 'hold' },
    ],
  },
  {
    id: 'relax',
    name: 'Relax (4-7-8)',
    subtitle: 'Deep wind-down before sleep',
    phases: [
      { label: 'Breathe in', seconds: 4, action: 'inhale' },
      { label: 'Hold', seconds: 7, action: 'hold' },
      { label: 'Breathe out', seconds: 8, action: 'exhale' },
    ],
  },
];

export const BREATHING_DURATIONS = [
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
];

// 5-4-3-2-1 Sensory Grounding Steps
export const GROUNDING_STEPS = [
  {
    step: 1,
    count: 5,
    sense: 'See',
    icon: '👀',
    title: '5 things you can see',
    prompt: 'Look around slowly. Tap the circle each time you notice an object, color, or detail.',
  },
  {
    step: 2,
    count: 4,
    sense: 'Feel',
    icon: '✋',
    title: '4 things you can feel',
    prompt: 'Notice textures around you—your chair, your sleeves, your feet on the floor. Tap for each.',
  },
  {
    step: 3,
    count: 3,
    sense: 'Hear',
    icon: '👂',
    title: '3 things you can hear',
    prompt: 'Listen closely for background sounds—distant voices, a fan, birds, or your own breath.',
  },
  {
    step: 4,
    count: 2,
    sense: 'Smell',
    icon: '👃',
    title: '2 things you can smell',
    prompt: 'Take a gentle breath and notice two subtle scents nearby—fresh air, coffee, paper, or soap.',
  },
  {
    step: 5,
    count: 1,
    sense: 'Taste',
    icon: '👅',
    title: '1 thing you can taste',
    prompt: 'Notice one taste in your mouth, or take a mindful sip of water to anchor yourself.',
  },
];

// Rotating friendly placeholders for the Gratitude Journal input
export const GRATITUDE_PROMPTS = [
  'Something that made you smile today...',
  'A person who helped or encouraged you recently...',
  'One small win from your classes or study time...',
  'A cozy moment, meal, or song you enjoyed...',
  'Something about today you are glad happened...',
];

/**
 * Resolves a catalog item's colorKey against the active theme palette.
 *
 * @param {string} colorKey
 * @param {object} colors - Theme colors from useTheme()
 * @returns {string} Hex color string
 */
export function getToolkitAccentColor(colorKey, colors) {
  if (colorKey === 'accent') return colors.accent;
  if (colorKey === 'moodLevel4') return colors.mood.level4;
  return colors.primary;
}
