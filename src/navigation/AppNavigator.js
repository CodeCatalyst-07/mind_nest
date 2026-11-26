/**
 * src/navigation/AppNavigator.js
 * Purpose: Root native stack navigator containing the main Bottom Tabs
 * as well as full-screen routes (CheckIn, Questionnaire, Breathing, Grounding, Gratitude).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';

import TabNavigator from './TabNavigator';
import CheckInScreen from '../screens/CheckInScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import BreathingScreen from '../screens/BreathingScreen';
import GroundingScreen from '../screens/GroundingScreen';
import GratitudeScreen from '../screens/GratitudeScreen';
import SupportScreen from '../screens/SupportScreen';
import PinLockScreen from '../screens/PinLockScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { colors, typography } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: typography.heading.fontFamily,
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      {/* Primary tab bar screens (header managed inside tabs or hidden) */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Full-screen / Modal activity routes */}
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Coping Toolkit activity routes */}
      <Stack.Screen
        name="Breathing"
        component={BreathingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Grounding"
        component={GroundingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Gratitude"
        component={GratitudeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PinSetup"
        component={PinLockScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
