// Color schemes for consistent theming across the application
export const COLORS = {
  level: {
    1: {
      gradient: 'from-red-600 to-red-700',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600'
    },
    2: {
      gradient: 'from-slate-600 to-slate-700',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600'
    },
    3: {
      gradient: 'from-red-500 to-red-600',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600'
    },
    4: {
      gradient: 'from-slate-500 to-slate-600',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600'
    },
    5: {
      gradient: 'from-red-700 to-red-800',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600'
    }
  },
  dimension: [
    'from-red-600 to-red-700',
    'from-slate-600 to-slate-700',
    'from-red-500 to-red-600',
    'from-slate-500 to-slate-600',
    'from-red-700 to-red-800',
    'from-slate-700 to-slate-800'
  ],
  category: {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600'
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      icon: 'bg-slate-100 text-slate-600',
      text: 'text-slate-600'
    }
  }
};

// Tab configuration
export const TAB_NAMES = [
  'Smart Factory Assessment',
  'Dashboard',
  'Rating Scales',
  'Matrices',
  'Road Map'
];

// Level names mapping
export const LEVEL_NAMES = {
  1: 'Basic',
  2: 'Medium',
  3: 'Advanced',
  4: 'Leading',
  5: 'Nirvana'
};

// API endpoints
export const API_ENDPOINTS = {
  maturityLevels: '/api/mm/maturity-levels',
  ratingScales: '/api/mm/rating-scales',
  assessments: '/api/mm/assessments',
  checksheetSelections: '/api/mm/checksheet-selections',
  refreshMaturityData: '/api/mm/refresh-simulated-data',
  refreshRatingScales: '/api/mm/refresh-rating-scales',
  refreshAllData: '/api/mm/refresh-all-data'
};
