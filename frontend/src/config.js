// API Configuration
// For local development, use localhost
// For production, use your deployed backend URL

// In development mode, use relative URLs to leverage Create React App proxy
// This allows other computers on the network to access the API through the dev server
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? '' // Use relative URLs in development (proxied by CRA to backend)
  : (import.meta.env.VITE_API_URL || 'https://mfg-assessmentapi.vercel.app');

// Helper function for making API calls - handles trailing/leading slashes automatically
export const apiUrl = (path) => {
  const base = API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`; // Ensure leading slash
  return `${base}${cleanPath}`;
};
