"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores';
import { FirebaseAuthService } from '@/lib/firebaseAuth';

interface FirebaseAuthContextType {
  // This context doesn't need to expose anything directly
  // The auth state is managed by Zustand store
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({});

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const { setUser, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Handle any pending redirect results first
        try {
          const redirectResult = await FirebaseAuthService.handleRedirectResult();
          if (redirectResult) {
            setUser(redirectResult.user);
            setInitialized(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Redirect result error:', error);
        }

        // Set up auth state listener
        unsubscribe = FirebaseAuthService.onAuthStateChange(async (user) => {
          setUser(user);
          
          // Set token cookie if user is authenticated
          if (user) {
            try {
              const token = await FirebaseAuthService.getCurrentToken();
              if (token) {
                FirebaseAuthService.setTokenCookie(token);
              }
            } catch (error) {
              console.error('Error getting token for cookie:', error);
            }
          } else {
            FirebaseAuthService.removeTokenCookie();
          }
          
          if (!useAuthStore.getState().isInitialized) {
            setInitialized(true);
          }
          setLoading(false);
        });

      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setInitialized(true);
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setUser, setLoading, setInitialized]);

  return (
    <FirebaseAuthContext.Provider value={{}}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}