/**
 * src/utils/scoring.js
 * Purpose: Pure scoring functions for the adapted WHO-5 Well-Being Index.
 * Computes the raw score (0-25), percentage (0-100%), and classifies into
 * one of four student well-being categories: Thriving, Doing okay, Needs attention, or Low.
 */

/**
 * Calculates raw score by summing numeric answers.
 * Range: 0 to 25.
 *
 * @param {number[]} answers - Array of 5 numbers (each 0 to 5)
 * @returns {number}
 */
export function calculateRawScore(answers = []) {
  if (!Array.isArray(answers) || answers.length === 0) return 0;
  const sum = answers.reduce((total, val) => total + (Number(val) || 0), 0);
  return Math.max(0, Math.min(25, sum));
}

/**
 * Multiplies raw score (0-25) by 4 to convert into a 0-100% percentage score.
 *
 * @param {number} rawScore
 * @returns {number} 0 to 100
 */
export function calculatePercentage(rawScore = 0) {
  const score = Number(rawScore) || 0;
  return Math.max(0, Math.min(100, Math.round(score * 4)));
}

/**
 * Categorizes a percentage score (0-100) into WHO-5 adapted tiers:
 * - 72 to 100: "Thriving"
 * - 50 to 71:  "Doing okay"
 * - 29 to 49:  "Needs attention"
 * - 0 to 28:   "Low"
 *
 * @param {number} percentage
 * @returns {string} Category name
 */
export function getScoreCategory(percentage = 0) {
  const p = Number(percentage) || 0;
  if (p >= 72) return 'Thriving';
  if (p >= 50) return 'Doing okay';
  if (p >= 29) return 'Needs attention';
  return 'Low';
}

/**
 * Returns theme colors and supportive descriptions associated with each category.
 *
 * @param {string} category
 * @returns {{ color: string, description: string, isLowCategory: boolean }}
 */
export function getCategoryDetails(category) {
  switch (category) {
    case 'Thriving':
      return {
        color: '#10B981', // Fresh green
        description:
          'Your responses reflect positive emotional well-being and strong vitality over the past two weeks.',
        isLowCategory: false,
      };
    case 'Doing okay':
      return {
        color: '#0D9488', // Calm teal
        description:
          'You are experiencing moderate, stable well-being. Balance your academic goals with intentional rest.',
        isLowCategory: false,
      };
    case 'Needs attention':
      return {
        color: '#F59E0B', // Amber
        description:
          'Your scores suggest that stress or fatigue may be weighing on you right now.',
        isLowCategory: true,
      };
    case 'Low':
    default:
      return {
        color: '#EF4444', // Coral red
        description:
          'Your responses indicate notably reduced well-being over the past two weeks.',
        isLowCategory: true,
      };
  }
}

/**
 * Returns a gentle encouragement note for lower score categories.
 * Encourages college students to reach out to campus resources or trusted adults.
 *
 * @param {string} category
 * @returns {string|null}
 */
export function getSupportiveNote(category) {
  if (category === 'Low' || category === 'Needs attention') {
    return 'If you are feeling overwhelmed, remember that you do not have to carry this alone. Please consider talking to a campus counselor, academic advisor, or a trusted adult or friend.';
  }
  return null;
}

/**
 * Comprehensive helper that computes the full scoring breakdown from raw answers.
 *
 * @param {number[]} answers
 * @returns {{
 *   rawScore: number,
 *   percentage: number,
 *   category: string,
 *   color: string,
 *   description: string,
 *   isLowCategory: boolean
 * }}
 */
export function scoreQuestionnaire(answers = []) {
  const rawScore = calculateRawScore(answers);
  const percentage = calculatePercentage(rawScore);
  const category = getScoreCategory(percentage);
  const details = getCategoryDetails(category);

  return {
    rawScore,
    percentage,
    category,
    color: details.color,
    description: details.description,
    isLowCategory: details.isLowCategory,
  };
}
