/**
 * src/theme/colors.js
 * Purpose: Defines light, dark, and mood color palettes for MindNest.
 * Includes student-friendly soft tones for calm UI and 5 mood rating levels.
 */

export const moodColors = {
  level1: '#F87171', // Terrible - soft coral red
  level2: '#FB923C', // Bad - gentle orange
  level3: '#FACC15', // Okay - soft warm yellow
  level4: '#4ADE80', // Good - fresh light green
  level5: '#22C55E', // Great - vibrant green
};

export const lightColors = {
  background: '#F8FAFC',    // Soft off-white canvas
  card: '#FFFFFF',          // Clean white container
  text: '#1E293B',          // Deep slate text for high readability
  mutedText: '#64748B',     // Muted slate for secondary labels
  primary: '#0D9488',       // Calming teal accent
  primaryLight: '#CCFBF1',  // Very soft teal tint for highlights
  accent: '#8B5CF6',        // Gentle lavender accent
  border: '#E2E8F0',        // Subtle divider and border
  mood: moodColors,
};

export const darkColors = {
  background: '#0F172A',    // Deep midnight slate background
  card: '#1E293B',          // Slate container card
  text: '#F8FAFC',          // Crisp light text
  mutedText: '#94A3B8',     // Muted gray-blue text
  primary: '#2DD4BF',       // Lighter soft teal for dark contrast
  primaryLight: '#134E4A',  // Deep teal tint for dark mode badges
  accent: '#A78BFA',        // Light lavender accent
  border: '#334155',        // Slate border
  mood: moodColors,
};
