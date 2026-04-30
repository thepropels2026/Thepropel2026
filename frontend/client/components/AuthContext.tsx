"use client"; // Required for context and state in Next.js App Router
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the authentication context
type AuthContextType = {
  isRegistered: boolean; // Indicates if the user is currently "logged in" or registered
  login: () => void;      // Function to trigger login state
  logout: () => void;     // Function to trigger logout state
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isRegistered: false,
  login: () => {},
  logout: () => {},
});

/**
 * AuthProvider: A wrapper component that provides authentication state to the entire application.
 * Uses local state to track whether the user is registered/logged in.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // State to track registration status
  const [isRegistered, setIsRegistered] = useState(false);

  // Function to set registered state to true
  const login = () => setIsRegistered(true);
  
  // Function to set registered state to false
  const logout = () => setIsRegistered(false);

  return (
    // Provide the state and action functions to child components
    <AuthContext.Provider value={{ isRegistered, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the AuthContext from any component
export const useAuth = () => useContext(AuthContext);
