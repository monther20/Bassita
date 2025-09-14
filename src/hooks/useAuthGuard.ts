import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { User } from '@/stores';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  onUnauthorized?: () => void;
}

interface UseAuthGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  user: User | null;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const {
    requireAuth = true,
    redirectTo,
    onUnauthorized,
  } = options;

  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const authorized = requireAuth ? isAuthenticated : !isAuthenticated;
    setIsAuthorized(authorized);

    if (!authorized) {
      if (onUnauthorized) {
        onUnauthorized();
      } else if (redirectTo) {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const url = requireAuth 
          ? `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
          : redirectTo;
        router.push(url);
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, requireAuth, redirectTo, onUnauthorized, router]);

  return {
    isAuthorized,
    isLoading: isLoading || !isInitialized,
    user: isAuthorized ? user : null,
  };
}

export function useRequireRole(requiredRoles: string | string[], redirectTo?: string) {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!isAuthenticated) {
      setHasPermission(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      return;
    }

    if (!user) {
      setHasPermission(false);
      return;
    }

    const userRoles = (user as User & { roles?: string[] }).roles || [];
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const hasRole = roles.some(role => userRoles.includes(role));
    
    setHasPermission(hasRole);

    if (!hasRole && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, isAuthenticated, isLoading, isInitialized, requiredRoles, redirectTo, router]);

  return {
    hasPermission,
    isLoading: isLoading || !isInitialized,
    user,
  };
}

export function usePermission(permission: string) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }

  const userPermissions = (user as User & { permissions?: string[] }).permissions || [];
  return userPermissions.includes(permission);
}