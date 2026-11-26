/**
 * App.js
 * Purpose: Application root entry point.
 * Preloads Google Nunito fonts, initializes DataProvider, ThemeProvider (synced with
 * settings.themeMode), enforces PIN lock gate on startup, and mounts NavigationContainer.
 */

import React, { useState, useEffect, useRef } from 'react';
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
import PinLockScreen from './src/screens/PinLockScreen';
import { hasPinSet } from './src/utils/pinLock';

// Renders PIN lock gate or main navigation once fonts and AsyncStorage data are ready
function MainContent() {
  const { isDark } = useTheme();
  const { isLoading, settings } = useData();
  const [isLocked, setIsLocked] = useState(false);
  const checkedLaunchLockRef = useRef(false);

  // Check initial launch PIN lock once data finishes loading
  useEffect(() => {
    if (!isLoading && !checkedLaunchLockRef.current) {
      checkedLaunchLockRef.current = true;
      if (settings.pinEnabled) {
        hasPinSet().then((exists) => {
          if (exists) {
            setIsLocked(true);
          }
        });
      }
    }
  }, [isLoading, settings.pinEnabled]);

  if (isLoading) {
    return null;
  }

  if (isLocked) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <PinLockScreen mode="unlock" onUnlock={() => setIsLocked(false)} />
      </>
    );
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
