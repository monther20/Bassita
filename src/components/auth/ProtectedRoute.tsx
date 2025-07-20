"use client";

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

interface ProtectedRouteProps {
  fallback?: ComponentType;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: ProtectedRouteProps = {}
) {
  const {
    fallback: Fallback,
    redirectTo = '/login',
    requireAuth = true,
  } = options;

  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (requireAuth && !isAuthenticated) {
          const currentPath = window.location.pathname;
          const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
          router.push(loginUrl);
        } else if (!requireAuth && isAuthenticated) {
          router.push('/dashboard');
        }
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      if (Fallback) {
        return <Fallback />;
      }
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotlight-purple"></div>
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    if (!requireAuth && isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

interface ProtectedRouteComponentProps extends ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
  fallback: Fallback,
  redirectTo = '/login',
  requireAuth = true,
}: ProtectedRouteComponentProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname;
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router, requireAuth, redirectTo]);

  if (isLoading) {
    if (Fallback) {
      return <Fallback />;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotlight-purple"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  );
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
}