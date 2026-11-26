/**
 * src/screens/PinLockScreen.js
 * Purpose: 4-digit PIN lock and setup screen for MindNest.
 * Supports three modes:
 *   - 'unlock': Verifies entered PIN against the SHA-256 hash in SecureStore.
 *   - 'setup': Enter and confirm a new 4-digit PIN before saving.
 *   - 'disable': Requires current PIN before turning off the PIN lock.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { useTheme } from '../theme/ThemeContext';
import { useData } from '../context/DataContext';
import { savePin, verifyPin, clearPin } from '../utils/pinLock';
import { haptics } from '../utils/haptics';

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export default function PinLockScreen({
  navigation,
  route,
  mode: propMode,
  onUnlock,
}) {
  const { colors, spacing, borderRadius } = useTheme();
  const { updateSettings } = useData();

  const mode = propMode || route?.params?.mode || 'unlock';

  const [pin, setPin] = useState('');
  const [setupStage, setSetupStage] = useState('enter'); // 'enter' | 'confirm'
  const [firstPin, setFirstPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  // Horizontal shake animation for wrong PIN feedback
  const [shakeAnim] = useState(() => new Animated.Value(0));

  const triggerShake = (message) => {
    haptics.medium();
    setErrorMsg(message);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -12, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 12, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start(() => {
      setPin('');
    });
  };

  const handleCompletePin = async (enteredPin) => {
    setIsBusy(true);
    try {
      if (mode === 'unlock') {
        const isValid = await verifyPin(enteredPin);
        if (isValid) {
          haptics.success();
          setPin('');
          setErrorMsg('');
          onUnlock?.();
        } else {
          triggerShake('Incorrect PIN. Please try again.');
        }
      } else if (mode === 'setup') {
        if (setupStage === 'enter') {
          haptics.selection();
          setFirstPin(enteredPin);
          setPin('');
          setErrorMsg('');
          setSetupStage('confirm');
        } else {
          if (enteredPin === firstPin) {
            const saved = await savePin(enteredPin);
            if (saved) {
              await updateSettings({ pinEnabled: true });
              haptics.success();
              navigation?.goBack();
            } else {
              triggerShake('Could not save PIN on this device.');
            }
          } else {
            setSetupStage('enter');
            setFirstPin('');
            triggerShake('PINs did not match. Start again.');
          }
        }
      } else if (mode === 'disable') {
        const isValid = await verifyPin(enteredPin);
        if (isValid) {
          await clearPin();
          await updateSettings({ pinEnabled: false });
          haptics.success();
          navigation?.goBack();
        } else {
          triggerShake('Incorrect PIN. Try again.');
        }
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleDigitPress = (digit) => {
    if (isBusy || pin.length >= 4) return;
    haptics.light();
    setErrorMsg('');
    const nextPin = `${pin}${digit}`;
    setPin(nextPin);

    if (nextPin.length === 4) {
      handleCompletePin(nextPin);
    }
  };

  const handleBackspace = () => {
    if (isBusy || pin.length === 0) return;
    haptics.light();
    setPin((prev) => prev.slice(0, -1));
  };

  let headingText = 'Enter PIN';
  let subtitleText = 'Enter your 4-digit PIN to unlock MindNest.';

  if (mode === 'setup') {
    if (setupStage === 'enter') {
      headingText = 'Create a 4-Digit PIN';
      subtitleText = 'Choose a 4-digit passcode to protect your private reflections.';
    } else {
      headingText = 'Confirm Your PIN';
      subtitleText = 'Re-enter your 4-digit PIN to confirm.';
    }
  } else if (mode === 'disable') {
    headingText = 'Turn Off PIN Lock';
    subtitleText = 'Enter your current 4-digit PIN to remove the lock.';
  }

  return (
    <Screen>
      <View style={styles.container}>
        {/* Cancel button when opened from Settings stack */}
        {mode !== 'unlock' && navigation ? (
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelBtn}
              accessibilityRole="button"
              accessibilityLabel="Cancel PIN change"
            >
              <Ionicons name="close" size={26} color={colors.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.topSpacer} />
        )}

        {/* Lock Icon & Prompt */}
        <View style={styles.headerBlock}>
          <View
            style={[
              styles.lockBadge,
              { backgroundColor: colors.primaryLight, borderRadius: borderRadius.full },
            ]}
          >
            <Ionicons
              name={mode === 'disable' ? 'lock-open-outline' : 'lock-closed-outline'}
              size={30}
              color={colors.primary}
            />
          </View>

          <AppText variant="title" weight="bold" style={styles.heading}>
            {headingText}
          </AppText>
          <AppText
            variant="bodySmall"
            color={colors.mutedText}
            style={[styles.subtitle, { marginTop: spacing.xs }]}
          >
            {subtitleText}
          </AppText>
        </View>

        {/* 4-Dot Indicator with Shake Animation */}
        <Animated.View
          style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}
          accessible
          accessibilityLabel={`${pin.length} of 4 PIN digits entered`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const filled = idx < pin.length;
            return (
              <View
                key={`pin-dot-${idx}`}
                style={[
                  styles.pinDot,
                  {
                    backgroundColor: filled ? colors.primary : 'transparent',
                    borderColor: errorMsg ? colors.mood.level1 : colors.primary,
                  },
                ]}
              />
            );
          })}
        </Animated.View>

        {/* Inline Error Message */}
        <View style={styles.errorContainer}>
          {errorMsg ? (
            <AppText variant="caption" weight="bold" color={colors.mood.level1}>
              {errorMsg}
            </AppText>
          ) : null}
        </View>

        {/* Numeric Keypad */}
        <View style={styles.keypad}>
          {KEYPAD_ROWS.map((row, rIdx) => (
            <View key={`row-${rIdx}`} style={styles.keypadRow}>
              {row.map((keyVal, cIdx) => {
                if (keyVal === '') {
                  return <View key={`empty-${cIdx}`} style={styles.keyEmpty} />;
                }

                if (keyVal === 'del') {
                  return (
                    <TouchableOpacity
                      key="del"
                      onPress={handleBackspace}
                      style={[
                        styles.keyButton,
                        { backgroundColor: 'transparent', borderColor: 'transparent' },
                      ]}
                      activeOpacity={0.6}
                      accessibilityRole="button"
                      accessibilityLabel="Delete last digit"
                    >
                      <Ionicons name="backspace-outline" size={26} color={colors.text} />
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    key={`digit-${keyVal}`}
                    onPress={() => handleDigitPress(keyVal)}
                    style={[
                      styles.keyButton,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Digit ${keyVal}`}
                  >
                    <AppText variant="title" weight="bold" color={colors.text}>
                      {keyVal}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cancelBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topSpacer: {
    height: 32,
  },
  headerBlock: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  lockBadge: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 16,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  errorContainer: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypad: {
    gap: 14,
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 22,
  },
  keyButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyEmpty: {
    width: 72,
    height: 72,
  },
});
