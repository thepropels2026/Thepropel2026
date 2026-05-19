"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  isRegistered: boolean;
  user: any;
  isRegisterModalOpen: boolean;
  setRegisterModalOpen: (isOpen: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
  login: (userData: any) => void;
  logout: () => void;
  syncUser: (supabaseUser: any) => Promise<void>;
  updateUser: (newData: any) => void;
};

const AuthContext = createContext<AuthContextType>({
  isRegistered: false,
  user: null,
  isRegisterModalOpen: false,
  setRegisterModalOpen: () => {},
  isLoginModalOpen: false,
  setLoginModalOpen: () => {},
  login: () => {},
  logout: () => {},
  syncUser: async () => {},
  updateUser: () => {},
});

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('userProfile', JSON.stringify(userData));
    }
    setRegisterModalOpen(false);
    setLoginModalOpen(false);
  };
  
  const updateUser = (newData: any) => {
    setUser((prev: any) => {
      const updated = { ...prev, ...newData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(updated));
      }
      return updated;
    });
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase sign out error:", err);
    }
    setIsRegistered(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isRegistered');
      localStorage.removeItem('userProfile');
    }
  };

  const syncUser = async (supabaseUser: any, retryCount = 0): Promise<void> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        if (retryCount < 3) {
          console.log(`Profile not found, retrying sync (${retryCount + 1}/3)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return syncUser(supabaseUser, retryCount + 1);
        }
        console.warn("Profile fetch failed after retries:", error.message);
      } else {
        const userData = {
          ...profile,
          firstName: profile.first_name,
          lastName: profile.last_name,
        };
        login(userData);
      }
    } catch (err: any) {
      console.error("Auth sync error:", err);
    }
  };

  // Sync state across tabs or initialization from localStorage
  useEffect(() => {
    const checkSession = async () => {
      const localUser = localStorage.getItem('userProfile');
      if (localUser) {
        // Assume active session
        const parsed = JSON.parse(localUser);
        if (!user || user.id !== parsed.id) {
          setUser(parsed);
          setIsRegistered(true);
        }
      } else {
        // Check Supabase session as fallback
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsRegistered(false);
          setUser(null);
        } else {
          syncUser(session.user);
        }
      }
    };
    
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isRegistered, user, 
      isRegisterModalOpen, setRegisterModalOpen, 
      isLoginModalOpen, setLoginModalOpen,
      login, logout, syncUser, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
