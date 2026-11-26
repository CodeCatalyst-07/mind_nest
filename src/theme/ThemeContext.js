/**
 * src/theme/ThemeContext.js
 * Purpose: Provides ThemeContext, ThemeProvider, and useTheme hook.
 * Respects user preference ('system' | 'light' | 'dark') from settings, falling back
 * to the device system appearance when set to 'system'.
 */

import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';

const ThemeContext = createContext();

export function ThemeProvider({ children, themeMode = 'system' }) {
  const systemColorScheme = useColorScheme();
  const effectiveScheme =
    themeMode === 'light' || themeMode === 'dark'
      ? themeMode
      : systemColorScheme || 'light';
  const isDark = effectiveScheme === 'dark';

  const theme = {
    isDark,
    themeMode,
    colorScheme: effectiveScheme,
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    borderRadius,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for screens and components to access the theme easily
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
