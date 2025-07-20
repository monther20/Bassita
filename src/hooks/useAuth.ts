import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, User } from '@/stores';
import { FirebaseAuthService } from '@/lib/firebaseAuth';

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    setUser,
    setLoading,
    setError,
    clearError,
    reset,
  } = useAuthStore();

  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    clearError();

    try {
      const result = await FirebaseAuthService.signInWithEmail(email, password);
      setUser(result.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      throw error;
    }
  }, [setUser, setLoading, setError, clearError]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    clearError();

    try {
      const result = await FirebaseAuthService.signUpWithEmail(email, password, displayName);
      setUser(result.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      setError(message);
      throw error;
    }
  }, [setUser, setLoading, setError, clearError]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const result = await FirebaseAuthService.signInWithGoogle();
      setUser(result.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google login failed';
      setError(message);
      throw error;
    }
  }, [setUser, setLoading, setError, clearError]);

  const loginWithGithub = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const result = await FirebaseAuthService.signInWithGithub();
      setUser(result.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GitHub login failed';
      setError(message);
      throw error;
    }
  }, [setUser, setLoading, setError, clearError]);

  const loginWithMicrosoft = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const result = await FirebaseAuthService.signInWithMicrosoft();
      setUser(result.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Microsoft login failed';
      setError(message);
      throw error;
    }
  }, [setUser, setLoading, setError, clearError]);

  const sendPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    clearError();

    try {
      await FirebaseAuthService.sendPasswordReset(email);
      setLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      setError(message);
      throw error;
    }
  }, [setLoading, setError, clearError]);

  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await FirebaseAuthService.signOut();
      reset();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      reset();
      router.push('/login');
    }
  }, [reset, setLoading, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login,
    signUp,
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft,
    sendPasswordReset,
    logout,
    clearError,
  };
}

export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  return { isAuthenticated, isLoading, isInitialized };
}

export function useRedirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  return { isAuthenticated, isLoading, isInitialized };
}