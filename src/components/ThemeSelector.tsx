'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Theme, themeMetadata } from '@/stores/theme';
import { FiCheck, FiSettings, FiX } from 'react-icons/fi';
import { useState } from 'react';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { theme: currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
  };

  const lightThemes = Object.entries(themeMetadata).filter(
    ([_, metadata]) => metadata.category === 'light'
  );
  const darkThemes = Object.entries(themeMetadata).filter(
    ([_, metadata]) => metadata.category === 'dark'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-dark">
      <div className="bg-background-primary border border-background-tertiary rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center responsive-gap-sm">
            <FiSettings className="icon-lg text-spotlight-purple" />
            <div>
              <h2 className="text-xl font-bold text-text-primary">Theme Selection</h2>
              <p className="text-text-secondary text-sm">Choose your perfect workspace theme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
            aria-label="Close theme selector"
          >
            <FiX className="icon-md text-text-secondary" />
          </button>
        </div>

        {/* Light Themes Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center responsive-gap-xs">
            <div className="w-3 h-3 bg-spotlight-yellow rounded-full"></div>
            Light Themes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightThemes.map(([themeKey, metadata]) => (
              <ThemePreviewCard
                key={themeKey}
                theme={themeKey as Theme}
                metadata={metadata}
                isSelected={selectedTheme === themeKey}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </div>

        {/* Dark Themes Section */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center responsive-gap-xs">
            <div className="w-3 h-3 bg-spotlight-purple rounded-full"></div>
            Dark Themes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {darkThemes.map(([themeKey, metadata]) => (
              <ThemePreviewCard
                key={themeKey}
                theme={themeKey as Theme}
                metadata={metadata}
                isSelected={selectedTheme === themeKey}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

interface ThemePreviewCardProps {
  theme: Theme;
  metadata: any;
  isSelected: boolean;
  onSelect: (theme: Theme) => void;
}

function ThemePreviewCard({ theme, metadata, isSelected, onSelect }: ThemePreviewCardProps) {
  // Get theme colors for preview
  const getThemeColors = (theme: Theme) => {
    switch (theme) {
      case 'dark':
        return {
          primary: '#1a1b26',
          secondary: '#24253a',
          tertiary: '#2e2f48',
          text: '#ffffff'
        };
      case 'light':
        return {
          primary: '#fdfdfd',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          text: '#0f172a'
        };
      case 'neon':
        return {
          primary: '#0a0a0f',
          secondary: '#141420',
          tertiary: '#1a1a2e',
          text: '#ffffff'
        };
      case 'pastel':
        return {
          primary: '#fefefe',
          secondary: '#f8f9ff',
          tertiary: '#f2f4ff',
          text: '#2d3748'
        };

      case 'slate':
        return {
          primary: '#0f172a',
          secondary: '#1e293b',
          tertiary: '#334155',
          text: '#f8fafc'
        };
      default:
        return {
          primary: '#1a1b26',
          secondary: '#24253a',
          tertiary: '#2e2f48',
          text: '#ffffff'
        };
    }
  };

  const colors = getThemeColors(theme);

  return (
    <button
      onClick={() => onSelect(theme)}
      className={`
        relative p-4 rounded-xl transition-all duration-300 group
        ${isSelected
          ? 'ring-2 ring-spotlight-purple shadow-glow-purple'
          : 'hover:ring-1 hover:ring-background-tertiary hover:shadow-lg'
        }
        bg-background-secondary hover:bg-background-tertiary
      `}
    >


      {/* Theme preview */}
      <div className="mb-3">
        <div
          className="w-full h-16 rounded-lg mb-2 relative overflow-hidden"
          style={{ backgroundColor: colors.primary }}
        >
          {/* Background layers */}
          <div
            className="absolute inset-x-0 bottom-0 h-8"
            style={{ backgroundColor: colors.secondary }}
          />
          <div
            className="absolute left-2 bottom-2 right-8 h-4 rounded"
            style={{ backgroundColor: colors.tertiary }}
          />

          {/* Colorful accent dots representing cards */}
          <div className="absolute top-2 left-2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-spotlight-purple opacity-80" />
            <div className="w-2 h-2 rounded-full bg-spotlight-pink opacity-80" />
            <div className="w-2 h-2 rounded-full bg-spotlight-blue opacity-80" />
          </div>

          {/* Text representation */}
          <div
            className="absolute top-2 right-2 w-8 h-1 rounded"
            style={{ backgroundColor: colors.text, opacity: 0.6 }}
          />
        </div>
      </div>

      {/* Theme info */}
      <div className="text-left">
        <h4 className="font-semibold text-text-primary text-sm mb-1">
          {metadata.name}
        </h4>
        <p className="text-text-secondary text-xs mb-2 line-clamp-2">
          {metadata.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {metadata.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-background-tertiary text-text-tertiary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}