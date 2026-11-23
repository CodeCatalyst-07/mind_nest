/**
 * App.js
 * Purpose: Application root entry point.
 * Preloads Google Nunito fonts, initializes the ThemeProvider and NavigationContainer,
 * and sets the dynamic StatusBar style.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

// Inner component that consumes useTheme so it can react to light/dark changes
function MainContent() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  // 1. Preload Google Nunito fonts
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  // 2. Show nothing (or splash) until custom fonts are fully loaded
  if (!fontsLoaded) {
    return null;
  }

  // 3. Wrap entire app with ThemeProvider so all children can access colors and fonts
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
