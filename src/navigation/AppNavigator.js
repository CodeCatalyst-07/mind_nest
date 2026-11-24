/**
 * src/navigation/AppNavigator.js
 * Purpose: Root native stack navigator containing the main Bottom Tabs
 * as well as full-screen modal/stack routes (CheckIn and Questionnaire).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';

import TabNavigator from './TabNavigator';
import CheckInScreen from '../screens/CheckInScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';

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
          title: 'Weekly Questionnaire',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
