"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores';
import { FirebaseAuthService } from '@/lib/firebaseAuth';
import { FirestoreService } from '@/lib/firestore';

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

  // Handle new user setup (create user document and default workspace)
  const handleNewUser = async (user: any) => {
    try {

      // Validate user object - check both id (from mapped User) and uid (from Firebase User)
      const userId = user?.id || user?.uid;
      if (!user || !userId) {
        console.error('Invalid user object provided to handleNewUser:', user);
        return;
      }

      const userData = {
        email: user.email || '',
        name: user.displayName || user.name || user.email?.split('@')[0] || 'User',
        avatar: user.photoURL || user.avatar || null,
        workspaces: []
      };


      // Create user document if it doesn't exist
      await FirestoreService.createUserIfNotExists(userId, userData);

      // Check if user has any workspaces, if not create a default one
      const userWorkspaces = await FirestoreService.getUserWorkspaces(userId);

      if (userWorkspaces.length === 0) {
        const userName = userData.name || 'User';
        await FirestoreService.createDefaultWorkspaceForUser(userId, userName);
      }
    } catch (error) {
      console.error('Error setting up new user:', error);
      // Don't throw here - we don't want to break the auth flow
    }
  };

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

              // Create user document and default workspace if user is new
              await handleNewUser(user);
            } catch (error) {
              console.error('Error setting up user:', error);
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