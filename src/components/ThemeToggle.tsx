'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { themeMetadata } from '@/stores/theme';
import { FiSun, FiMoon, FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import ThemeSelector from './ThemeSelector';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'cycle' | 'selector';
}

export default function ThemeToggle({
  size = 'md',
  showLabel = false,
  variant = 'selector'
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  const handleClick = () => {
    if (variant === 'selector') {
      setIsThemeSelectorOpen(true);
    } else {
      toggleTheme();
    }
  };

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

  const isLightCategory = themeMetadata[theme].category === 'light';

  return (
    <>
      <button
        onClick={handleClick}
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
        aria-label={variant === 'selector' ? 'Open theme selector' : `Switch to ${isLightCategory ? 'dark' : 'light'} theme`}
        title={variant === 'selector' ? 'Choose theme' : `Switch to ${isLightCategory ? 'dark' : 'light'} theme`}
      >
        {/* Icon container with animation */}
        <div className="relative overflow-hidden">
          {variant === 'selector' ? (
            <FiSettings
              className={`
                ${iconSizeClasses[size]}
                text-spotlight-purple
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-90
              `}
            />
          ) : (
            <>
              {/* Sun icon - visible for light category themes */}
              <FiSun
                className={`
                  ${iconSizeClasses[size]}
                  text-spotlight-yellow
                  transition-all
                  duration-300
                  transform
                  ${!isLightCategory
                    ? 'rotate-0 opacity-100 translate-y-0'
                    : 'rotate-90 opacity-0 translate-y-2'
                  }
                  absolute
                  inset-0
                `}
              />

              {/* Moon icon - visible for dark category themes */}
              <FiMoon
                className={`
                  ${iconSizeClasses[size]}
                  text-spotlight-purple
                  transition-all
                  duration-300
                  transform
                  ${isLightCategory
                    ? 'rotate-0 opacity-100 translate-y-0'
                    : '-rotate-90 opacity-0 -translate-y-2'
                  }
                `}
              />
            </>
          )}
        </div>

        {/* Optional label */}
        {showLabel && (
          <span className="text-text-secondary group-hover:text-text-primary transition-colors text-sm font-medium">
            {variant === 'selector'
              ? themeMetadata[theme].name
              : (isLightCategory ? 'Dark' : 'Light')
            }
          </span>
        )}
      </button>

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
      />
    </>
  );
}