"use client"; // Required for context and state in Next.js App Router
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the authentication context
type AuthContextType = {
  isRegistered: boolean;
  user: any;
  isRegisterModalOpen: boolean;
  setRegisterModalOpen: (isOpen: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
  login: (userData: any) => void;
  logout: () => void;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isRegistered: false,
  user: null,
  isRegisterModalOpen: false,
  setRegisterModalOpen: () => {},
  isLoginModalOpen: false,
  setLoginModalOpen: () => {},
  login: () => {},
  logout: () => {},
});

/**
 * AuthProvider: A wrapper component that provides authentication state to the entire application.
 * Uses local state to track whether the user is registered/logged in.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRegistered, setIsRegistered] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isRegistered') === 'true';
    }
    return false;
  });
  
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const login = (userData: any) => {
    setIsRegistered(true);
    setUser(userData);
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('userProfile', JSON.stringify(userData));
    setRegisterModalOpen(false); // Close modal on success
    setLoginModalOpen(false);
  };
  
  const logout = () => {
    setIsRegistered(false);
    setUser(null);
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userProfile');
  };

  return (
    // Provide the state and action functions to child components
    <AuthContext.Provider value={{ 
      isRegistered, user, 
      isRegisterModalOpen, setRegisterModalOpen, 
      isLoginModalOpen, setLoginModalOpen,
      login, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the AuthContext from any component
export const useAuth = () => useContext(AuthContext);
