/**
 * Centralized API configuration for the frontend.
 * Defaults to localhost for development, but can be overridden by environment variables for production.
 */

export const getApiBaseUrl = () => {
  // Check if an environment variable is defined (e.g., in .env.production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // If running in browser, resolve URL dynamically
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // 1. Local development fallbacks
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.')) {
      return 'http://localhost:8000';
    }
    
    // 2. Render subdomains (e.g., frontend: thepropels.onrender.com -> backend: thepropels-backend.onrender.com)
    if (hostname.endsWith('.onrender.com')) {
      const prefix = hostname.replace('.onrender.com', '');
      if (prefix === 'thepropels') {
        return 'https://thepropels-backend.onrender.com';
      }
      // If it ends with -frontend, -web, or -client, strip and append -backend
      const cleanPrefix = prefix.replace(/-frontend|-web|-client$/, '');
      return `https://${cleanPrefix}-backend.onrender.com`;
    }
    
    // 3. Custom domain configuration
    if (hostname === 'thepropels.com' || hostname === 'www.thepropels.com') {
      return 'https://thepropels-backend.onrender.com';
    }
  }
  
  // Default production fallback
  return 'https://thepropels-backend.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();
