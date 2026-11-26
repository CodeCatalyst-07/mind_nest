/**
 * src/utils/pinLock.js
 * Purpose: Secure 4-digit PIN storage utility for MindNest.
 * Hashes the PIN using SHA-256 (expo-crypto) with an app salt and stores ONLY
 * the hash inside encrypted device storage (expo-secure-store)—never the plain PIN.
 */

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const PIN_HASH_KEY = 'mindnest_pin_hash';
const PIN_SALT = 'mindnest_local_salt_v1_';

/**
 * Validates that a PIN consists of exactly 4 numeric digits.
 *
 * @param {string} pin
 * @returns {boolean}
 */
export function isValidPinFormat(pin) {
  return typeof pin === 'string' && /^\d{4}$/.test(pin);
}

/**
 * Computes a salted SHA-256 hex digest of a 4-digit PIN.
 *
 * @param {string} pin
 * @returns {Promise<string>}
 */
export async function hashPin(pin) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${PIN_SALT}${pin}`
  );
}

/**
 * Hashes and saves the user's 4-digit PIN inside SecureStore.
 *
 * @param {string} pin
 * @returns {Promise<boolean>}
 */
export async function savePin(pin) {
  if (!isValidPinFormat(pin)) return false;

  try {
    const hashed = await hashPin(pin);
    await SecureStore.setItemAsync(PIN_HASH_KEY, hashed);
    return true;
  } catch (error) {
    console.error('[pinLock.js] Error saving PIN hash:', error);
    return false;
  }
}

/**
 * Verifies an entered 4-digit PIN against the stored SHA-256 hash.
 *
 * @param {string} pin
 * @returns {Promise<boolean>}
 */
export async function verifyPin(pin) {
  if (!isValidPinFormat(pin)) return false;

  try {
    const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
    if (!storedHash) return false;

    const candidateHash = await hashPin(pin);
    return candidateHash === storedHash;
  } catch (error) {
    console.error('[pinLock.js] Error verifying PIN:', error);
    return false;
  }
}

/**
 * Checks whether a PIN hash currently exists in SecureStore.
 *
 * @returns {Promise<boolean>}
 */
export async function hasPinSet() {
  try {
    const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
    return Boolean(storedHash);
  } catch (_) {
    return false;
  }
}

/**
 * Removes the stored PIN hash from SecureStore.
 *
 * @returns {Promise<boolean>}
 */
export async function clearPin() {
  try {
    await SecureStore.deleteItemAsync(PIN_HASH_KEY);
    return true;
  } catch (error) {
    console.error('[pinLock.js] Error clearing PIN hash:', error);
    return false;
  }
}
