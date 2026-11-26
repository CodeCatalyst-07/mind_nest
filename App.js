/**
 * App.js
 * Purpose: Application root entry point.
 * Preloads Google Nunito fonts, initializes DataProvider, ThemeProvider (synced with
 * settings.themeMode), enforces PIN lock on startup & after 30s background resume,
 * and mounts NavigationContainer.
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
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
import OnboardingScreen from './src/screens/OnboardingScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import { hasPinSet } from './src/utils/pinLock';

const BACKGROUND_LOCK_TIMEOUT_MS = 30 * 1000; // 30 seconds

// Renders PIN lock gate or main navigation once fonts and AsyncStorage data are ready
function MainContent() {
  const { isDark } = useTheme();
  const { isLoading, settings } = useData();
  const [isLocked, setIsLocked] = useState(false);

  const checkedLaunchLockRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);
  const backgroundTimestampRef = useRef(null);

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

  // Re-lock app when returning from background after >= 30 seconds
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const prevState = appStateRef.current;

      if (prevState === 'active' && (nextState === 'background' || nextState === 'inactive')) {
        if (!backgroundTimestampRef.current) {
          backgroundTimestampRef.current = Date.now();
        }
      } else if (
        (prevState === 'background' || prevState === 'inactive') &&
        nextState === 'active'
      ) {
        const bgTime = backgroundTimestampRef.current;
        backgroundTimestampRef.current = null;

        if (
          settings.pinEnabled &&
          bgTime &&
          Date.now() - bgTime >= BACKGROUND_LOCK_TIMEOUT_MS
        ) {
          hasPinSet().then((exists) => {
            if (exists) {
              setIsLocked(true);
            }
          });
        }
      }

      appStateRef.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [settings.pinEnabled]);

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

  if (!settings.onboardingDone) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <OnboardingScreen />
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
    <ErrorBoundary>
      <DataProvider>
        <ThemedApp />
      </DataProvider>
    </ErrorBoundary>
  );
}
