/**
 * src/context/DataContext.js
 * Purpose: Global data store for MindNest.
 * Manages check-ins, assessments, settings, and loading state.
 * Syncs automatically with AsyncStorage and exposes actions and selectors.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, saveData, loadData, removeData } from '../utils/storage';
import { toDateKey } from '../utils/dateUtils';
import { createCheckIn, createAssessment, DEFAULT_SETTINGS } from '../data/models';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [checkIns, setCheckIns] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load all saved data from AsyncStorage on initial app mount
  useEffect(() => {
    async function initializeData() {
      try {
        const [savedCheckIns, savedAssessments, savedSettings] = await Promise.all([
          loadData(STORAGE_KEYS.CHECKINS, []),
          loadData(STORAGE_KEYS.ASSESSMENTS, []),
          loadData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
        ]);

        setCheckIns(Array.isArray(savedCheckIns) ? savedCheckIns : []);
        setAssessments(Array.isArray(savedAssessments) ? savedAssessments : []);
        setSettings(savedSettings ? { ...DEFAULT_SETTINGS, ...savedSettings } : DEFAULT_SETTINGS);
      } catch (error) {
        console.error('[DataContext] Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeData();
  }, []);

  /**
   * Upserts a daily check-in (only 1 check-in allowed per date).
   * If a check-in for this date already exists, it is updated.
   *
   * @param {object} checkInData
   * @returns {Promise<object>} The saved check-in object
   */
  const saveCheckIn = useCallback(async (checkInData) => {
    const formatted = createCheckIn(checkInData);

    setCheckIns((prevCheckIns) => {
      const existingIndex = prevCheckIns.findIndex((c) => c.date === formatted.date);
      let updated;

      if (existingIndex >= 0) {
        // Update existing record, preserving the original id and createdAt
        updated = [...prevCheckIns];
        updated[existingIndex] = {
          ...prevCheckIns[existingIndex],
          ...formatted,
          id: prevCheckIns[existingIndex].id,
          createdAt: prevCheckIns[existingIndex].createdAt,
        };
      } else {
        // Append new check-in
        updated = [formatted, ...prevCheckIns];
      }

      // Persist to storage
      saveData(STORAGE_KEYS.CHECKINS, updated);
      return updated;
    });

    return formatted;
  }, []);

  /**
   * Deletes a check-in record by its unique ID.
   *
   * @param {string} id - check-in ID
   */
  const deleteCheckIn = useCallback(async (id) => {
    setCheckIns((prevCheckIns) => {
      const updated = prevCheckIns.filter((c) => c.id !== id);
      saveData(STORAGE_KEYS.CHECKINS, updated);
      return updated;
    });
  }, []);

  /**
   * Saves a new wellness assessment record.
   *
   * @param {object} assessmentData
   * @returns {Promise<object>}
   */
  const saveAssessment = useCallback(async (assessmentData) => {
    const formatted = createAssessment(assessmentData);

    setAssessments((prevAssessments) => {
      const updated = [formatted, ...prevAssessments];
      saveData(STORAGE_KEYS.ASSESSMENTS, updated);
      return updated;
    });

    return formatted;
  }, []);

  /**
   * Partially updates user settings and saves to storage.
   *
   * @param {object} partialSettings
   */
  const updateSettings = useCallback(async (partialSettings) => {
    setSettings((prevSettings) => {
      const updated = { ...prevSettings, ...partialSettings };
      saveData(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    });
  }, []);

  /**
   * Clears all MindNest local data from memory and AsyncStorage.
   */
  const clearAllData = useCallback(async () => {
    setCheckIns([]);
    setAssessments([]);
    setSettings(DEFAULT_SETTINGS);

    await Promise.all([
      removeData(STORAGE_KEYS.CHECKINS),
      removeData(STORAGE_KEYS.ASSESSMENTS),
      removeData(STORAGE_KEYS.SETTINGS),
    ]);
  }, []);

  /**
   * Selector: Finds a check-in for a given "YYYY-MM-DD" date key.
   *
   * @param {string} dateKey
   * @returns {object|null}
   */
  const getCheckInByDate = useCallback(
    (dateKey) => {
      return checkIns.find((c) => c.date === dateKey) || null;
    },
    [checkIns]
  );

  /**
   * Selector: Returns today's check-in if one exists, otherwise null.
   *
   * @returns {object|null}
   */
  const getTodayCheckIn = useCallback(() => {
    const todayKey = toDateKey(new Date());
    return getCheckInByDate(todayKey);
  }, [getCheckInByDate]);

  const value = {
    checkIns,
    assessments,
    settings,
    isLoading,
    saveCheckIn,
    deleteCheckIn,
    saveAssessment,
    updateSettings,
    clearAllData,
    getCheckInByDate,
    getTodayCheckIn,
    setCheckIns, // Exposed for loading demo data in Step 2.5
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Custom hook to consume the DataContext.
 * Throws an informative error if called outside a DataProvider.
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
