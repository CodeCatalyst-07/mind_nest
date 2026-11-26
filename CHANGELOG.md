# Changelog

All notable phases and milestones in the development of **MindNest** (`v1.0.0`) are documented here.

---

## [1.0.0] - 2026-11-26

### Phase 8 — Cleanup, Testing, Linting & Release Documentation
- Removed unused imports, unused variables, and obsolete `.gitkeep` placeholders while preserving file purpose headers.
- Added Jest unit tests for `src/utils/dateUtils.js` (`__tests__/dateUtils.test.js`) and `src/data/models.js` (`__tests__/models.test.js`).
- Set up ESLint with `eslint-config-expo`, fixed all lint errors and warnings, and added `"lint": "expo lint"` alongside `"test": "jest"` in `package.json`.
- Updated `app.json` metadata (`slug`, `description`, `userInterfaceStyle: "automatic"`, `#F8FAFC` background, `#CCFBF1` adaptive icon background) while keeping `v1.0.0`.
- Rewrote `README.md` and added `docs/ARCHITECTURE.md` (5 Mermaid diagrams), `docs/PROBLEM_STATEMENT_MAPPING.md`, `docs/DEMO_GUIDE.md`, and `docs/screenshots/` placeholders.

### Phase 7 — Safety Net, Settings, PIN Lock & Onboarding
- Added verified helpline catalog (`Tele-MANAS 14416 / 1-800-891-4416`, `112` emergency note, trusted-person tips, and conversation starters) in `src/data/support.js`.
- Implemented `detectLowMoodStreak()` in `src/utils/support.js` with Jest unit tests (`__tests__/support.test.js`), a dismissible `SupportCard` on `HomeScreen`, and full `SupportScreen` route linked from Home, low WHO-5 results, Toolkit, and Settings.
- Extended `Settings` (`themeMode`, `hapticsEnabled`, `onboardingDone`), wired `ThemeContext` and `haptics.js`, rebuilt `SettingsScreen` into grouped sections, and integrated `expo-notifications` daily reminders with safe Expo Go fallbacks.
- Implemented optional 4-digit PIN security (`expo-crypto` salted SHA-256 hash stored in `expo-secure-store`) with `PinLockScreen` and 30-second background auto-lock via `AppState`.
- Added 3-slide first-launch `OnboardingScreen`, spring press scale and entrance animations (`Card`, `AppButton`, `Screen`), root `ErrorBoundary`, hidden Developer Tools (5 taps on version), and About credits.

### Phase 6 — Coping Toolkit
- Added `GratitudeEntry` and `ToolSession` factories (`src/data/models.js`), `@mindnest_gratitude` and `@mindnest_sessions` storage keys, and `DataContext` actions (`addGratitude`, `deleteGratitude`, `logSession`).
- Added mood-based recommendation and 7-day usage summary helpers (`src/utils/toolkit.js`, `__tests__/toolkit.test.js`) and exercise catalog (`src/data/toolkit.js`).
- Built `ToolkitScreen` recommendation banner and weekly usage summary, animated `BreathingScreen` + `BreathingCircle` (`Calm 4-6`, `Box 4-4-4-4`, `Relax 4-7-8` with `expo-keep-awake`), `GroundingScreen` (`5-4-3-2-1`), `GratitudeScreen` (100-char limit, 3/day cap, rotating prompts), and demo toolkit data.

### Phase 5 — Trends Dashboard & Insights
- Added `src/utils/stats.js` (range filtering, averages, consecutive streak, best/worst day) and `src/utils/insights.js` (non-clinical sleep, weekday, low-mood tag, and streak patterns) with Jest tests.
- Rebuilt `TrendsScreen` with `SegmentedControl` (7 / 30 days), count-up `StatCard`s, pure `react-native-svg` visualizations (`MoodLineChart` with animated draw-in, `SleepBarChart`, `AssessmentTrendChart`), `MoodHeatmap`, `TagFrequencyChart`, recent check-ins with delete confirmation, and `EmptyState`.

### Phase 4 — Weekly WHO-5 Assessment
- Added adapted WHO-5 items (`src/data/questionnaire.js`), `scoring.js` (`calculateRawScore`, `calculatePercentage`, `getScoreCategory`, `scoreQuestionnaire`), and unit tests (`__tests__/scoring.test.js`).
- Built `QuestionnaireScreen`, `OptionButton`, animated SVG `ScoreGauge`, non-diagnostic result view, `DataContext.saveAssessment` integration, and Home `Weekly Check` due card.

### Phase 3 — Polished Daily Check-in Flow
- Built the 5-step `CheckInScreen` (`Mood`, `Energy`, `Sleep`, `Tags & Note`, `Review`) with `ProgressBar`, `MoodSelector`, `EnergySelector`, `SleepPicker`, `TagChips`, ambient mood gradient, haptic feedback, edit-today support, and discard confirmation.

### Phase 2 — Data Model & Local Storage Architecture
- Implemented safe `AsyncStorage` helpers (`src/utils/storage.js`), local-time date utilities (`src/utils/dateUtils.js`), model factories (`src/data/models.js`), `DataContext`, and realistic demo data (`src/data/demoData.js`).

### Phase 1 — Setup, Theme & Navigation Skeleton
- Initialized the Expo React Native project with Nunito fonts, `ThemeContext` (light, dark, and 5-level mood palettes), `Screen`/`AppText`/`Card` primitives, and `AppNavigator` + `TabNavigator`.
