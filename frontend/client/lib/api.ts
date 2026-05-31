/**
 * Centralized API configuration for the frontend.
 * Always points to the live backend for testing.
 */

export const getApiBaseUrl = () => {
  // Check if an environment variable is defined (e.g., in .env.production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Always fallback to the live server
  return 'https://thepropel2026.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();
