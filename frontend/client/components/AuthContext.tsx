"use client"; // Required for context and state in Next.js App Router
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
  syncUser: (supabaseUser: any) => Promise<void>;
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
  syncUser: async () => {},
});

/**
 * AuthProvider: A wrapper component that provides authentication state to the entire application.
 * Redesigned to utilize Firebase Auth as the primary session source of truth,
 * dynamically fetching full demographic profiles from Supabase.
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('userProfile', JSON.stringify(userData));
    }
    setRegisterModalOpen(false); // Close modal on success
    setLoginModalOpen(false);
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase sign out error:", err);
    }
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
      // Fetch full profile from the database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        // If profile doesn't exist yet, retry a few times (trigger might be running)
        if (retryCount < 3) {
          console.log(`Profile not found, retrying sync (${retryCount + 1}/3)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return syncUser(supabaseUser, retryCount + 1);
        }

        // Final fallback to metadata
        console.warn("Profile fetch failed after retries, using metadata fallback:", error.message);
        const fallbackData = {
          id: supabaseUser.id,
          firstName: supabaseUser.user_metadata?.first_name || supabaseUser.email?.split('@')[0],
          lastName: supabaseUser.user_metadata?.last_name || '',
          email: supabaseUser.email,
          picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${supabaseUser.id}`,
        };
        login(fallbackData);
      } else {
        // Successful profile fetch
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

  // Sync with Firebase Auth State (Primary Driver)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("[Firebase Auth] Active user detected:", firebaseUser.email || firebaseUser.phoneNumber);
        
        try {
          let profile = null;
          
          if (firebaseUser.email) {
            // Fetch profile by email
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', firebaseUser.email)
              .single();
            if (!error && data) profile = data;
          }
          
          if (!profile && firebaseUser.phoneNumber) {
            // Normalize phone formats to match mobile column
            const phone = firebaseUser.phoneNumber;
            const variants = [phone, phone.replace("+", ""), phone.replace("+91", "")];
            
            // Query with variants
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .in('mobile', variants);
            if (!error && data && data.length > 0) {
              profile = data[0];
            }
          }
          
          if (profile) {
            const userData = {
              ...profile,
              firstName: profile.first_name,
              lastName: profile.last_name,
            };
            login(userData);
          } else {
            // Fallback user metadata or create demo profile
            const fallbackData = {
              id: firebaseUser.uid,
              firstName: firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0] || 'User',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              email: firebaseUser.email || `${firebaseUser.phoneNumber}@propels.com`,
              mobile: firebaseUser.phoneNumber || '',
              picture: firebaseUser.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${firebaseUser.uid}`,
            };
            login(fallbackData);
          }
        } catch (err) {
          console.error("Error syncing profile with Firebase user:", err);
        }
      } else {
        console.log("[Firebase Auth] No active user session.");
        // Double check if there is an active Supabase user to keep logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsRegistered(false);
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('isRegistered');
            localStorage.removeItem('userProfile');
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isRegistered, user, 
      isRegisterModalOpen, setRegisterModalOpen, 
      isLoginModalOpen, setLoginModalOpen,
      login, logout, syncUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the AuthContext from any component
export const useAuth = () => useContext(AuthContext);
