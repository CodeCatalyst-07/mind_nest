/**
 * App.js
 * Purpose: Application root entry point.
 * Preloads Google Nunito fonts, initializes ThemeProvider, DataProvider,
 * and NavigationContainer, and ensures nothing renders until fonts & data finish loading.
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
import { DataProvider, useData } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

// Inner component that consumes both theme and data contexts
function MainContent() {
  const { isDark } = useTheme();
  const { isLoading } = useData();

  // Keep showing nothing (or splash) until data has finished loading from AsyncStorage
  if (isLoading) {
    return null;
  }

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

  // 3. Wrap entire app with ThemeProvider and DataProvider
  return (
    <ThemeProvider>
      <DataProvider>
        <MainContent />
      </DataProvider>
    </ThemeProvider>
  );
}
