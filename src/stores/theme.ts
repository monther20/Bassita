import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'neon' | 'pastel' | 'slate';

export interface ThemeMetadata {
  name: string;
  description: string;
  category: 'light' | 'dark';
  tags: string[];
}

export const themeMetadata: Record<Theme, ThemeMetadata> = {
  dark: {
    name: 'Dark Mode',
    description: 'The original cyberpunk-inspired dark theme',
    category: 'dark',
    tags: ['default', 'cyberpunk', 'purple']
  },
  light: {
    name: 'Light Mode',
    description: 'Clean and comfortable light theme',
    category: 'light',
    tags: ['minimal', 'comfortable', 'professional']
  },
  neon: {
    name: 'Neon City',
    description: 'Amplified cyberpunk with deeper blacks and neon highlights',
    category: 'dark',
    tags: ['cyberpunk', 'vibrant', 'futuristic']
  },
  pastel: {
    name: 'Pastel Dreams',
    description: 'Soft pastels that let colorful cards shine',
    category: 'light',
    tags: ['soft', 'gentle', 'creative']
  },
  slate: {
    name: 'Slate Professional',
    description: 'Modern dark theme that enhances color vibrancy',
    category: 'dark',
    tags: ['modern', 'professional', 'sophisticated']
  }
};

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getThemesByCategory: (category: 'light' | 'dark') => Theme[];
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default to dark theme to match current design
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document element
        document.documentElement.setAttribute('data-theme', theme);
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const currentCategory = themeMetadata[currentTheme].category;
        const availableThemes = get().getThemesByCategory(currentCategory);
        const currentIndex = availableThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        get().setTheme(availableThemes[nextIndex]);
      },
      getThemesByCategory: (category: 'light' | 'dark') => {
        return Object.entries(themeMetadata)
          .filter(([_, metadata]) => metadata.category === category)
          .map(([theme]) => theme as Theme);
      },
    }),
    {
      name: 'theme-storage',
      // Initialize theme on page load
      onRehydrate: (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);