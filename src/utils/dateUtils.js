/**
 * src/utils/dateUtils.js
 * Purpose: Date manipulation and formatting utilities for MindNest.
 * Ensures consistent local-time date keys (YYYY-MM-DD) so data is never skewed by UTC timezones.
 */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Converts a Date object or timestamp into a local-time "YYYY-MM-DD" date key.
 * Never uses UTC so the user's local day boundaries are preserved accurately.
 *
 * @param {Date|string|number} [date=new Date()]
 * @returns {string} e.g. "2026-11-24"
 */
export function toDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a "YYYY-MM-DD" date key into a friendly readable string.
 * Example output: "Mon, 23 Nov"
 *
 * @param {string} dateKey - "YYYY-MM-DD" string
 * @returns {string} e.g. "Mon, 23 Nov"
 */
export function formatDisplayDate(dateKey) {
  if (!dateKey || typeof dateKey !== 'string') return '';
  const parts = dateKey.split('-');
  if (parts.length !== 3) return dateKey;

  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const d = new Date(year, monthIndex, day);
  const weekday = DAYS[d.getDay()] || '';
  const monthName = MONTHS[d.getMonth()] || '';

  return `${weekday}, ${day} ${monthName}`;
}

/**
 * Returns an array of dateKey strings for the last N days up to today (chronological order).
 *
 * @param {number} [n=7] - Number of days to retrieve
 * @returns {string[]} Array of "YYYY-MM-DD" strings (oldest to newest)
 */
export function getLastNDays(n = 7) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(toDateKey(d));
  }
  return dates;
}

/**
 * Compares two dates (Date instances or strings) to check if they represent the same calendar day.
 *
 * @param {Date|string|number} date1
 * @param {Date|string|number} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  return toDateKey(date1) === toDateKey(date2);
}
