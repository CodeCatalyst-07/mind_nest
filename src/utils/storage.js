/**
 * src/utils/storage.js
 * Purpose: Safe local storage helper for MindNest using AsyncStorage.
 * Wraps saving, loading, and removing data in try/catch blocks with JSON serialization
 * so the application never crashes on storage errors.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Central definition of all storage keys used in MindNest
export const STORAGE_KEYS = {
  CHECKINS: '@mindnest_checkins',
  ASSESSMENTS: '@mindnest_assessments',
  SETTINGS: '@mindnest_settings',
};

/**
 * Saves any JavaScript value (object, array, primitive) to AsyncStorage under the given key.
 * Serializes the value to JSON.
 *
 * @param {string} key - Storage key from STORAGE_KEYS
 * @param {any} value - The data to store
 * @returns {Promise<boolean>} - Returns true if saved successfully, false on error
 */
export async function saveData(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`[storage.js] Error saving data for key "${key}":`, error);
    return false;
  }
}

/**
 * Loads data from AsyncStorage by key and parses the JSON.
 * Returns the provided fallback value if key doesn't exist or if an error occurs.
 *
 * @param {string} key - Storage key from STORAGE_KEYS
 * @param {any} fallback - Default value to return if nothing is stored or on error
 * @returns {Promise<any>} - The parsed data or fallback
 */
export async function loadData(key, fallback = null) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return fallback;
  } catch (error) {
    console.error(`[storage.js] Error loading data for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Removes data stored under a specific key in AsyncStorage.
 *
 * @param {string} key - Storage key to remove
 * @returns {Promise<boolean>} - Returns true if removed successfully, false on error
 */
export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[storage.js] Error removing data for key "${key}":`, error);
    return false;
  }
}
