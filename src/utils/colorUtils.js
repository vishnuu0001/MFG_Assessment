import { COLORS } from './constants';

/**
 * Get gradient color for a specific maturity level
 * @param {number} level - Maturity level (1-5)
 * @returns {string} Tailwind gradient class
 */
export const getLevelColor = (level) => {
  return COLORS.level[level]?.gradient || 'from-gray-500 to-gray-600';
};

/**
 * Get badge color for a specific maturity level
 * @param {number} level - Maturity level (1-5)
 * @returns {string} Tailwind badge classes
 */
export const getLevelBadgeColor = (level) => {
  return COLORS.level[level]?.badge || 'bg-gray-100 text-gray-700 border-gray-200';
};

/**
 * Get dimension color based on index
 * @param {number} index - Dimension index
 * @returns {string} Tailwind gradient class
 */
export const getDimensionColor = (index) => {
  return COLORS.dimension[index % COLORS.dimension.length];
};

/**
 * Get category color classes
 * @param {string} colorName - Color name (red, slate)
 * @returns {object} Object with bg, border, icon, text classes
 */
export const getCategoryColors = (colorName) => {
  return COLORS.category[colorName] || COLORS.category.red;
};
