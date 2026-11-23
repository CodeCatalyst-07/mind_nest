/**
 * src/theme/ThemeContext.js
 * Purpose: Provides a ThemeContext, ThemeProvider, and useTheme hook.
 * Automatically adapts colors based on the user device's light/dark mode setting.
 */

import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';

// Create the Context with a default empty state
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Listen to system color scheme ('light' or 'dark')
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const theme = {
    isDark,
    colorScheme: systemColorScheme || 'light',
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
