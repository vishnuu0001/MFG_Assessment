import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Reusable loading spinner component
 * @param {string} message - Optional loading message
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader className="animate-spin text-red-600" size={48} />
      <span className="ml-3 text-lg font-semibold text-slate-600">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
