import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'blue' | 'green' | 'purple';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  primary: string;
  headerBg: string;
  secondary: string;
  secondaryForeground: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'blue',
    label: 'Ocean',
    primary: '#0e92e4',
    headerBg: '#0e92e4',
    secondary: '#e8f5ff',
    secondaryForeground: '#0e92e4',
  },
  {
    id: 'green',
    label: 'Forêt',
    primary: '#16a34a',
    headerBg: '#15803d',
    secondary: '#dcfce7',
    secondaryForeground: '#16a34a',
  },
  {
    id: 'purple',
    label: 'Royal',
    primary: '#7c3aed',
    headerBg: '#6d28d9',
    secondary: '#ede9fe',
    secondaryForeground: '#7c3aed',
  },
];

const STORAGE_KEY = '@al_firdaous_theme';

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('blue');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && THEMES.find((t) => t.id === saved)) {
        setThemeId(saved as ThemeId);
      }
    });
  }, []);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    AsyncStorage.setItem(STORAGE_KEY, id);
  };

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
