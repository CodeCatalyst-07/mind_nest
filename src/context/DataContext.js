/**
 * src/context/DataContext.js
 * Purpose: Global data store for MindNest.
 * Manages check-ins, assessments, settings, gratitude entries, tool sessions, and loading state.
 * Syncs automatically with AsyncStorage and exposes actions and selectors.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, saveData, loadData, removeData } from '../utils/storage';
import { toDateKey } from '../utils/dateUtils';
import { setHapticsEnabled } from '../utils/haptics';
import {
  createCheckIn,
  createAssessment,
  createGratitudeEntry,
  createToolSession,
  DEFAULT_SETTINGS,
} from '../data/models';
import {
  generateDemoCheckIns,
  generateDemoAssessments,
  generateDemoGratitudeEntries,
  generateDemoToolSessions,
} from '../data/demoData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [checkIns, setCheckIns] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Keep haptics utility synchronized with user setting
  useEffect(() => {
    setHapticsEnabled(settings.hapticsEnabled !== false);
  }, [settings.hapticsEnabled]);

  // Load all saved data from AsyncStorage on initial app mount
  useEffect(() => {
    async function initializeData() {
      try {
        const [
          savedCheckIns,
          savedAssessments,
          savedGratitude,
          savedSessions,
          savedSettings,
        ] = await Promise.all([
          loadData(STORAGE_KEYS.CHECKINS, []),
          loadData(STORAGE_KEYS.ASSESSMENTS, []),
          loadData(STORAGE_KEYS.GRATITUDE, []),
          loadData(STORAGE_KEYS.SESSIONS, []),
          loadData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
        ]);

        setCheckIns(Array.isArray(savedCheckIns) ? savedCheckIns : []);
        setAssessments(Array.isArray(savedAssessments) ? savedAssessments : []);
        setGratitudeEntries(Array.isArray(savedGratitude) ? savedGratitude : []);
        setSessions(Array.isArray(savedSessions) ? savedSessions : []);
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
   * Adds a new gratitude journal entry (newest first).
   *
   * @param {string} text
   * @returns {Promise<object>}
   */
  const addGratitude = useCallback(async (text) => {
    const formatted = createGratitudeEntry({ text });

    setGratitudeEntries((prev) => {
      const updated = [formatted, ...prev];
      saveData(STORAGE_KEYS.GRATITUDE, updated);
      return updated;
    });

    return formatted;
  }, []);

  /**
   * Deletes a gratitude entry by its unique ID.
   *
   * @param {string} id
   */
  const deleteGratitude = useCallback(async (id) => {
    setGratitudeEntries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveData(STORAGE_KEYS.GRATITUDE, updated);
      return updated;
    });
  }, []);

  /**
   * Logs a completed Coping Toolkit exercise session.
   *
   * @param {'breathing'|'grounding'|'gratitude'} type
   * @param {number} durationSec
   * @returns {Promise<object>}
   */
  const logSession = useCallback(async (type, durationSec = 60) => {
    const formatted = createToolSession({ type, durationSec });

    setSessions((prev) => {
      const updated = [formatted, ...prev];
      saveData(STORAGE_KEYS.SESSIONS, updated);
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
    setGratitudeEntries([]);
    setSessions([]);
    setSettings(DEFAULT_SETTINGS);

    await Promise.all([
      removeData(STORAGE_KEYS.CHECKINS),
      removeData(STORAGE_KEYS.ASSESSMENTS),
      removeData(STORAGE_KEYS.GRATITUDE),
      removeData(STORAGE_KEYS.SESSIONS),
      removeData(STORAGE_KEYS.SETTINGS),
      removeData(STORAGE_KEYS.SUPPORT_DISMISSED_DATE),
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

  /**
   * Loads a realistic demo set of check-ins and weekly assessments into memory and AsyncStorage.
   *
   * @param {number} [days=14]
   */
  const loadDemoData = useCallback(async (days = 14) => {
    const demoSet = generateDemoCheckIns(days);
    const demoAssessments = generateDemoAssessments(4);
    const demoGratitude = generateDemoGratitudeEntries();
    const demoSessions = generateDemoToolSessions();

    setCheckIns(demoSet);
    setAssessments(demoAssessments);
    setGratitudeEntries(demoGratitude);
    setSessions(demoSessions);

    await Promise.all([
      saveData(STORAGE_KEYS.CHECKINS, demoSet),
      saveData(STORAGE_KEYS.ASSESSMENTS, demoAssessments),
      saveData(STORAGE_KEYS.GRATITUDE, demoGratitude),
      saveData(STORAGE_KEYS.SESSIONS, demoSessions),
    ]);

    return {
      checkIns: demoSet,
      assessments: demoAssessments,
      gratitudeEntries: demoGratitude,
      sessions: demoSessions,
    };
  }, []);

  const value = {
    checkIns,
    assessments,
    gratitudeEntries,
    sessions,
    settings,
    isLoading,
    saveCheckIn,
    deleteCheckIn,
    saveAssessment,
    addGratitude,
    deleteGratitude,
    logSession,
    updateSettings,
    clearAllData,
    loadDemoData,
    getCheckInByDate,
    getTodayCheckIn,
    setCheckIns,
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
