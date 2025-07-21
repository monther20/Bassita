"use client";

import { ReactNode, useState } from 'react';
import { useAuth } from '@/hooks';
import { AuthGuard } from '@/components/auth/ProtectedRoute';
import Header from './header';
import Sidebar from './sidebar';

interface ProtectedLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}

export function ProtectedLayout({
  children,
  showHeader = true,
  showSidebar = true,
  className = '',
}: ProtectedLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Header height is h-18 which equals 72px (18 * 0.25rem * 16)
  const sidebarHeight = !showHeader ? "h-screen" : "h-[calc(100vh-4.2rem)]";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthGuard>
      <div className={`min-h-screen bg-background-tertiary ${className}`}>
        {showHeader && (
          <Header
            onToggleSidebar={toggleSidebar}
            showSidebarToggle={showSidebar}

          />
        )}
        <div className="flex relative">
          {showSidebar && (
            <>
              {/* Mobile overlay */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Sidebar */}
              <div className={`
                fixed lg:relative z-50 lg:z-auto
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}>
                <Sidebar
                  height={sidebarHeight}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            </>
          )}

          <main className={`
            flex-1  transition-all duration-300 ${sidebarHeight} overflow-y-auto
            ${showSidebar ? 'lg:ml-0' : ''}
          `}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default ProtectedLayout;