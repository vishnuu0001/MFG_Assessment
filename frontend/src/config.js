// API Configuration
// For local development, use localhost
// For production, use your deployed backend URL

// In development mode, use relative URLs to leverage Create React App proxy
// This allows other computers on the network to access the API through the dev server
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? '' // Use relative URLs in development (proxied by CRA to backend)
  : (import.meta.env.VITE_API_URL || 'https://mahindra-backend.vercel.app');

// Helper function for making API calls
export const apiUrl = (path) => `${API_BASE_URL}${path}`;

// Debug: Log the API URL being used (will show in browser console)
console.log('🔧 API Configuration Loaded');
console.log('🎯 Mode:', process.env.NODE_ENV || 'production');
console.log('🌐 API_BASE_URL:', API_BASE_URL || '(relative - using proxy)');
if (import.meta.env.VITE_API_URL) {
  console.log('🔗 VITE_API_URL:', import.meta.env.VITE_API_URL, '(from environment)');
}

// Verify API is accessible (only in browser)
if (typeof window !== 'undefined') {
  fetch(apiUrl('/api/mm/areas'))
    .then(response => {
      if (response.ok) {
        console.log('✅ API Connection: SUCCESS');
      } else {
        console.error('❌ API Connection: FAILED -', response.status, response.statusText);
        console.error('🔗 Attempted URL:', apiUrl('/api/mm/areas'));
      }
    })
    .catch(error => {
      console.error('❌ API Connection: ERROR -', error.message);
      console.error('🔗 Attempted URL:', apiUrl('/api/mm/areas'));
      console.error('💡 Check: 1) Backend running? 2) Proxy configured? 3) CORS enabled?');
    });
}
