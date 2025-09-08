'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ThemeToggle({ size = 'md', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizeClasses = {
    sm: 'icon-sm',
    md: 'icon-md',
    lg: 'icon-lg'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        touch-target
        rounded-lg
        bg-background-secondary
        hover:bg-background-tertiary
        border border-background-tertiary
        hover:border-spotlight-purple
        transition-all
        duration-300
        hover:shadow-glow-purple
        flex
        items-center
        responsive-gap-xs
        cursor-pointer
        group
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Icon container with rotation animation */}
      <div className="relative overflow-hidden">
        {/* Sun icon - visible in dark mode */}
        <FiSun
          className={`
            ${iconSizeClasses[size]}
            text-spotlight-yellow
            transition-all
            duration-300
            transform
            ${theme === 'dark' 
              ? 'rotate-0 opacity-100 translate-y-0' 
              : 'rotate-90 opacity-0 translate-y-2'
            }
            absolute
            inset-0
          `}
        />
        
        {/* Moon icon - visible in light mode */}
        <FiMoon
          className={`
            ${iconSizeClasses[size]}
            text-spotlight-purple
            transition-all
            duration-300
            transform
            ${theme === 'light' 
              ? 'rotate-0 opacity-100 translate-y-0' 
              : '-rotate-90 opacity-0 -translate-y-2'
            }
          `}
        />
      </div>

      {/* Optional label */}
      {showLabel && (
        <span className="text-text-secondary group-hover:text-text-primary transition-colors text-sm font-medium">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}