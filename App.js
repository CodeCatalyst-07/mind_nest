/**
 * App.js
 * Purpose: Application root entry point.
 * Preloads Google Nunito fonts, initializes DataProvider, ThemeProvider (synced with
 * settings.themeMode), and NavigationContainer.
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

// Renders navigation once fonts and AsyncStorage data are ready
function MainContent() {
  const { isDark } = useTheme();
  const { isLoading } = useData();

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

// Connects DataContext settings.themeMode into ThemeProvider
function ThemedApp() {
  const { settings } = useData();

  return (
    <ThemeProvider themeMode={settings?.themeMode || 'system'}>
      <MainContent />
    </ThemeProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DataProvider>
      <ThemedApp />
    </DataProvider>
  );
}
