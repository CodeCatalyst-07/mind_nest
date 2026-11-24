/**
 * src/data/demoData.js
 * Purpose: Generates realistic mock data for student mood check-ins.
 * Simulates a student's last N days with realistic correlations between
 * sleep duration, energy level, and mood, accompanied by relatable college notes.
 */

import { getLastNDays } from '../utils/dateUtils';
import { createCheckIn } from './models';

// Sample relatable student reflections for varying mood states
const LOW_MOOD_NOTES = [
  'Stayed up late studying for midterm exams, feeling exhausted.',
  'Could not fall asleep until 3 AM, campus lectures felt overwhelming.',
  'Stressed about assignment deadlines and group work.',
  'Low energy today, skipped the gym and rested in the dorm.',
];

const MID_MOOD_NOTES = [
  'Average day on campus. Studied at the library for a few hours.',
  'Normal lecture schedule. Took a walk in the afternoon sun.',
  'Quiet study day. Managed to finish part of the lab report.',
  'Felt okay today. Met friends for lunch at the student dining hall.',
];

const HIGH_MOOD_NOTES = [
  'Great night of sleep! Turned in my project early and feel relieved.',
  'Morning workout was great, felt super focused in class.',
  'Productive group study session and relaxing evening.',
  'Sunny weather, felt refreshed and caught up on all my readings.',
];

/**
 * Generates an array of realistic CheckIn records for the last N days.
 *
 * @param {number} [days=14] - Number of days of historical check-in data to generate
 * @returns {object[]} Array of CheckIn objects in chronological order (newest first for state)
 */
export function generateDemoCheckIns(days = 14) {
  const dateKeys = getLastNDays(days); // Oldest to newest
  const checkIns = [];

  dateKeys.forEach((dateKey, index) => {
    // Generate a pseudo-random sleep pattern (between 4.5 and 9 hours)
    // We add some variation based on the day index
    const baseSleep = 5.5 + ((index * 3) % 4);
    const sleepHours = Math.round(baseSleep * 2) / 2; // e.g. 5.5, 7.0, 8.5

    let mood;
    let energy;
    let note;
    let tags;

    if (sleepHours < 6) {
      // Lower sleep loosely correlates with lower energy and mood
      mood = Math.random() > 0.4 ? 2 : 1;
      energy = Math.random() > 0.3 ? 2 : 1;
      note = LOW_MOOD_NOTES[index % LOW_MOOD_NOTES.length];
      tags = ['Studies', 'Sleep'];
    } else if (sleepHours <= 7.5) {
      // Moderate sleep leads to average to good mood
      mood = Math.random() > 0.4 ? 4 : 3;
      energy = Math.random() > 0.5 ? 4 : 3;
      note = MID_MOOD_NOTES[index % MID_MOOD_NOTES.length];
      tags = index % 2 === 0 ? ['Friends', 'Studies'] : ['Health', 'Exercise'];
    } else {
      // Good sleep leads to high mood and energy
      mood = Math.random() > 0.3 ? 5 : 4;
      energy = Math.random() > 0.3 ? 5 : 4;
      note = HIGH_MOOD_NOTES[index % HIGH_MOOD_NOTES.length];
      tags = ['Exercise', 'Friends', 'Sleep'];
    }

    const checkIn = createCheckIn({
      date: dateKey,
      mood,
      energy,
      sleepHours,
      note,
      tags,
      createdAt: new Date(`${dateKey}T21:00:00.000Z`).toISOString(),
    });

    checkIns.push(checkIn);
  });

  // Return with newest dates first so lists display newest records at the top
  return checkIns.reverse();
}
