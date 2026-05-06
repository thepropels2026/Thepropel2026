"use client"; // Required for context and state in Next.js App Router
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  
  const logout = async () => {
    await supabase.auth.signOut();
    setIsRegistered(false);
    setUser(null);
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userProfile');
  };

  // Sync with Supabase Auth State
  useEffect(() => {
    // 1. Initial Check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        syncUser(session.user);
      }
    };
    checkSession();

    // 2. Listen for Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUser(session.user);
      } else {
        setIsRegistered(false);
        setUser(null);
        localStorage.removeItem('isRegistered');
        localStorage.removeItem('userProfile');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUser = (supabaseUser: any) => {
    const userData = {
      firstName: supabaseUser.user_metadata?.first_name || supabaseUser.email?.split('@')[0],
      lastName: supabaseUser.user_metadata?.last_name || '',
      email: supabaseUser.email,
      picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${supabaseUser.email}`,
    };
    setIsRegistered(true);
    setUser(userData);
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('userProfile', JSON.stringify(userData));
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
