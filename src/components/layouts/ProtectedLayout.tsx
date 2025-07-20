"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/hooks';
import { AuthGuard } from '@/components/auth/ProtectedRoute';

interface ProtectedLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-text-primary text-sm">{user.name}</span>
      </div>
      <button
        onClick={logout}
        className="px-3 py-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-background-primary border-b border-gray-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-display text-text-primary">Bassita</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-background-secondary border-r border-gray-600 p-4">
      <nav className="space-y-2">
        <a
          href="/dashboard"
          className="block px-3 py-2 text-text-primary hover:bg-background-primary rounded-md transition-colors"
        >
          Dashboard
        </a>
        <a
          href="/tasks"
          className="block px-3 py-2 text-text-primary hover:bg-background-primary rounded-md transition-colors"
        >
          Tasks
        </a>
        <a
          href="/projects"
          className="block px-3 py-2 text-text-primary hover:bg-background-primary rounded-md transition-colors"
        >
          Projects
        </a>
        <a
          href="/settings"
          className="block px-3 py-2 text-text-primary hover:bg-background-primary rounded-md transition-colors"
        >
          Settings
        </a>
      </nav>
    </aside>
  );
}

export function ProtectedLayout({
  children,
  showHeader = true,
  showSidebar = true,
  className = '',
}: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <div className={`min-h-screen bg-background-tertiary ${className}`}>
        {showHeader && <Header />}
        <div className="flex">
          {showSidebar && <Sidebar />}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default ProtectedLayout;