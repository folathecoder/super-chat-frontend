'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyles } from '@/styling/global-styles';
import { lightTheme, darkTheme } from '@/styling/themes';
import type { Theme } from '@/types/theme/theme';

const ThemeNames = {
  DARK: 'dark',
  LIGHT: 'light',
};

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const localThemeKey = 'theme';
  const [activeTheme, setActiveTheme] = useState<Theme>(lightTheme);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    setIsThemeLoaded(true);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(localThemeKey);

    if (storedTheme) {
      setActiveTheme(storedTheme === ThemeNames.DARK ? darkTheme : lightTheme);
    } else {
      const prefersDark = window.matchMedia(
        `(prefers-color-scheme: ${ThemeNames.DARK})`
      ).matches;
      setActiveTheme(prefersDark ? darkTheme : lightTheme);
    }

    setIsThemeLoaded(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = activeTheme === lightTheme ? darkTheme : lightTheme;
    setActiveTheme(newTheme);

    localStorage.setItem(
      localThemeKey,
      newTheme === darkTheme ? ThemeNames.DARK : ThemeNames.LIGHT
    );
  };

  if (!isThemeLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, toggleTheme }}>
      <StyledThemeProvider theme={activeTheme}>
        <GlobalStyles theme={activeTheme} />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
