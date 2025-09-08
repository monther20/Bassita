import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
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
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
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