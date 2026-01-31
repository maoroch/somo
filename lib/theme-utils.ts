// lib/theme.ts
export const THEME_STORAGE_KEY = 'somo-theme-preference';

export type Theme = 'dark' | 'light';

export const getDefaultTheme = (): Theme => {
  // Проверяем систему пользователя
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return 'dark'; // Default fallback
};

export const getSavedTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
    return null;
  }
};

export const saveTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const getInitialTheme = (): Theme => {
  const saved = getSavedTheme();
  if (saved) return saved;
  return getDefaultTheme();
};