import React from 'react';

/**
 * Reusable navigation buttons component for circular page navigation
 * @param {Function} onNavigate - Navigation handler function
 * @param {number} previousIndex - Index of previous page
 * @param {number} nextIndex - Index of next page
 * @param {string} previousLabel - Label for previous button
 * @param {string} nextLabel - Label for next button
 */
const NavigationButtons = ({ onNavigate, previousIndex, nextIndex, previousLabel, nextLabel }) => {
  return (
    <div className="flex justify-between items-center pt-4">
      <button
        onClick={() => onNavigate && onNavigate(previousIndex)}
        className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-all flex items-center gap-2 cursor-pointer"
      >
        ← {previousLabel}
      </button>
      <button
        onClick={() => onNavigate && onNavigate(nextIndex)}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-all flex items-center gap-2 cursor-pointer"
      >
        {nextLabel} →
      </button>
    </div>
  );
};

export default NavigationButtons;
