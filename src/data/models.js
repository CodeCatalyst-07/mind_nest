/**
 * src/data/models.js
 * Purpose: Data models and factory functions for MindNest.
 * Defines the shapes for CheckIn, Assessment, and Settings, and provides
 * factory functions to instantiate them with unique IDs and timestamps.
 *
 * DATA SHAPES:
 *
 * CheckIn:
 * {
 *   id: string,             // Unique identifier (e.g. "checkin_1700000000_abc")
 *   date: string,           // Local date key "YYYY-MM-DD" (only 1 check-in per day)
 *   mood: number,           // Mood rating from 1 (Terrible) to 5 (Great)
 *   energy: number,         // Energy level from 1 (Exhausted) to 5 (Energized)
 *   sleepHours: number,     // Hours of sleep (e.g. 7.5)
 *   note: string,           // Optional user thoughts or reflections
 *   tags: string[],         // Optional student context tags (e.g. ["Studies", "Sleep"])
 *   createdAt: string       // ISO timestamp of creation
 * }
 *
 * Assessment:
 * {
 *   id: string,             // Unique identifier (e.g. "assessment_1700000000_xyz")
 *   date: string,           // Local date key "YYYY-MM-DD"
 *   answers: number[],      // Numeric responses to the questionnaire
 *   score: number,          // Calculated total score
 *   category: string,       // Assessment category (e.g. "Weekly Well-being")
 *   createdAt: string       // ISO timestamp
 * }
 *
 * Settings:
 * {
 *   themeMode: string,        // 'system' | 'light' | 'dark'
 *   hapticsEnabled: boolean,  // Whether tactile haptic feedback is enabled
 *   onboardingDone: boolean,  // Whether user completed initial onboarding
 *   reminderEnabled: boolean, // Daily check-in notification reminder toggle
 *   reminderTime: string,    // Reminder time in "HH:mm" (e.g. "20:00")
 *   pinEnabled: boolean      // Optional privacy PIN protection
 * }
 *
 * GratitudeEntry:
 * {
 *   id: string,             // Unique identifier (e.g. "gratitude_1700000000_abc")
 *   date: string,           // Local date key "YYYY-MM-DD"
 *   text: string,           // Short gratitude reflection (max 100 chars)
 *   createdAt: string       // ISO timestamp
 * }
 *
 * ToolSession:
 * {
 *   id: string,             // Unique identifier (e.g. "session_1700000000_xyz")
 *   type: string,           // Tool type: "breathing" | "grounding" | "gratitude"
 *   durationSec: number,    // Duration of session in seconds
 *   date: string,           // Local date key "YYYY-MM-DD"
 *   createdAt: string       // ISO timestamp
 * }
 */

import { toDateKey } from '../utils/dateUtils.js';

// Default user settings
export const DEFAULT_SETTINGS = {
  themeMode: 'system',
  hapticsEnabled: true,
  onboardingDone: false,
  reminderEnabled: false,
  reminderTime: '20:00', // 8:00 PM
  pinEnabled: false,
};

/**
 * Generates a unique, lightweight alphanumeric ID.
 * Works reliably in Expo Go without requiring external UUID libraries.
 *
 * @param {string} prefix - e.g. "checkin" or "assessment"
 * @returns {string} e.g. "checkin_1711200000_a1b2c"
 */
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Factory function to create a validated CheckIn object.
 *
 * @param {object} params
 * @param {string} [params.id]
 * @param {string} [params.date] - Date key "YYYY-MM-DD" (defaults to today)
 * @param {number} [params.mood=3] - 1 to 5
 * @param {number} [params.energy=3] - 1 to 5
 * @param {number} [params.sleepHours=7]
 * @param {string} [params.note='']
 * @param {string} [params.createdAt]
 * @returns {object} Formatted CheckIn record
 */
export function createCheckIn({
  id,
  date,
  mood = 3,
  energy = 3,
  sleepHours = 7,
  note = '',
  tags = [],
  createdAt,
} = {}) {
  return {
    id: id || generateId('checkin'),
    date: date || toDateKey(new Date()),
    mood: Math.max(1, Math.min(5, Number(mood) || 3)),
    energy: Math.max(1, Math.min(5, Number(energy) || 3)),
    sleepHours: Math.max(0, Number(sleepHours) || 0),
    note: typeof note === 'string' ? note.trim() : '',
    tags: Array.isArray(tags) ? tags : [],
    createdAt: createdAt || new Date().toISOString(),
  };
}

/**
 * Factory function to create a validated Assessment record.
 *
 * @param {object} params
 * @param {string} [params.id]
 * @param {string} [params.date] - Date key "YYYY-MM-DD" (defaults to today)
 * @param {number[]} [params.answers=[]]
 * @param {number} [params.score=0]
 * @param {string} [params.category='Weekly Well-being']
 * @param {string} [params.createdAt]
 * @returns {object} Formatted Assessment record
 */
export function createAssessment({
  id,
  date,
  answers = [],
  score = 0,
  category = 'Weekly Well-being',
  createdAt,
} = {}) {
  return {
    id: id || generateId('assessment'),
    date: date || toDateKey(new Date()),
    answers: Array.isArray(answers) ? answers : [],
    score: Number(score) || 0,
    category: typeof category === 'string' ? category : 'Weekly Well-being',
    createdAt: createdAt || new Date().toISOString(),
  };
}


const VALID_TOOL_TYPES = ['breathing', 'grounding', 'gratitude'];

/**
 * Factory function to create a validated GratitudeEntry record.
 *
 * @param {object} params
 * @param {string} [params.id]
 * @param {string} [params.date] - Date key "YYYY-MM-DD" (defaults to today)
 * @param {string} [params.text=''] - Short gratitude reflection (trimmed, max 100 chars)
 * @param {string} [params.createdAt]
 * @returns {object} Formatted GratitudeEntry record
 */
export function createGratitudeEntry({
  id,
  date,
  text = '',
  createdAt,
} = {}) {
  const cleanText = typeof text === 'string' ? text.trim().slice(0, 100) : '';
  return {
    id: id || generateId('gratitude'),
    date: date || toDateKey(new Date()),
    text: cleanText,
    createdAt: createdAt || new Date().toISOString(),
  };
}

/**
 * Factory function to create a validated ToolSession record.
 *
 * @param {object} params
 * @param {string} [params.id]
 * @param {'breathing'|'grounding'|'gratitude'} [params.type='breathing']
 * @param {number} [params.durationSec=60] - Duration in seconds
 * @param {string} [params.date] - Date key "YYYY-MM-DD" (defaults to today)
 * @param {string} [params.createdAt]
 * @returns {object} Formatted ToolSession record
 */
export function createToolSession({
  id,
  type = 'breathing',
  durationSec = 60,
  date,
  createdAt,
} = {}) {
  const safeType = VALID_TOOL_TYPES.includes(type) ? type : 'breathing';
  return {
    id: id || generateId('session'),
    type: safeType,
    durationSec: Math.max(0, Math.round(Number(durationSec) || 0)),
    date: date || toDateKey(new Date()),
    createdAt: createdAt || new Date().toISOString(),
  };
}
