/**
 * Centralized API configuration for the frontend.
 * Defaults to localhost for development, but can be overridden by environment variables for production.
 */

export const getApiBaseUrl = () => {
  // Check if an environment variable is defined (e.g., in .env.production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to the local backend port used in main.py
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
