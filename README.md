# MindNest 🌱

> An offline-first student mental well-being companion built with React Native and Expo (Expo Go).

MindNest was created for **College Problem Statement #222**: *"Mental health and well-being surveillance, assessment and tracking solution among children"* (**Ministry of Education — Smart Education**, software edition). It gives students a calm, private, stigma-free space on their own phone to reflect daily, complete a short weekly well-being self-check, spot sleep/mood patterns, practice calming exercises, and reach verified human support whenever life feels heavy.

---

## 🎯 The Problem It Solves

Academic pressure, irregular sleep, social transitions, and exam stress affect students every week—yet most either notice burnout only after it peaks or avoid formal tools due to privacy concerns and clinical stiffness. MindNest addresses this with four calm pillars:

- **Low-friction daily reflection**: A 60-second 5-step check-in instead of intimidating forms.
- **Structured self-checks**: Standardized weekly check-ins adapted from the WHO-5 Well-Being Index.
- **Actionable coping tools right beside the data**: Guided breathing, 5-4-3-2-1 sensory grounding, and gratitude journaling.
- **Privacy by default**: Everything lives locally on the student's phone with no accounts, analytics, or remote servers.

---

## ✨ Features

### 📋 Assess
- **Weekly Well-Being Check (`QuestionnaireScreen`)**: 5 positive reflection items adapted from the **WHO-5 Well-Being Index** (`QUESTIONNAIRE_ITEMS` in `src/data/questionnaire.js`), scored `0–5` (*Never* to *Always*).
- **Automated Scoring & Categorization (`src/utils/scoring.js`)**: Computes raw score (`0–25`), percentage (`rawScore * 4`, `0–100%`), and tier (*Thriving* `72–100%`, *Doing okay* `50–71%`, *Needs attention* `29–49%`, *Low* `0–28%`) displayed with an animated circular `ScoreGauge`.
- **Home Weekly Status (`HomeScreen`)**: Tracks days since the last assessment (`daysAgo`) and highlights a **WEEKLY CHECK DUE** badge after 7+ days.

### 📊 Track
- **5-Step Daily Check-in (`CheckInScreen`)**: Logs mood (`1–5`), energy (`1–5`), sleep (`0–12` hours in `0.5h` steps), context tags (`Studies`, `Friends`, `Family`, `Sleep`, `Health`, `Exercise`, `Social media`), and an optional reflection note, with edit-today support and discard protection.
- **Trends Dashboard (`TrendsScreen`)**: Switch between **Last 7 Days** and **Last 30 Days** (`SegmentedControl`), count-up summary cards (Average Mood, Average Sleep, Consecutive Streak), custom `react-native-svg` visualizations (`MoodLineChart`, `MoodHeatmap`, `SleepBarChart`, `TagFrequencyChart`, `AssessmentTrendChart`), and recent entry management with delete confirmation.
- **Non-Clinical Pattern Insights (`src/utils/insights.js`)**: Observes gentle patterns such as mood differences on `< 6h` vs `>= 7h` sleep nights (when $\ge 3$ entries exist in each group), best weekday for mood, top tag on low-mood days, and streak encouragement.

### 🧰 Improve
- **Mood-Based Recommendation (`src/utils/toolkit.js`)**: Suggests a tailored tool on the **Toolkit** tab based on today's mood (or a quick 1-minute breathing reset if today has not been logged yet).
- **Guided Breathing (`BreathingScreen` + `BreathingCircle`)**: Animated expanding/holding/shrinking guide across three rhythms (**Calm 4-6**, **Box 4-4-4-4**, **Relax 4-7-8**) for `1`, `2`, or `5` minutes with phase haptics and `expo-keep-awake`.
- **5-4-3-2-1 Sensory Grounding (`GroundingScreen`)**: Interactive step-by-step sensory counter (`5 See` → `4 Feel` → `3 Hear` → `2 Smell` → `1 Taste`) with tap bounce and haptic cues.
- **Gratitude Journal (`GratitudeScreen`)**: Rotating friendly prompts, `100`-character limit, `3`-entries-per-day cap, date-grouped history, and confirmed delete.
- **Weekly Practice Summary (`summarizeSessions`)**: Summarizes total sessions, minutes, and per-tool counts over the past 7 days.

### 🛡️ Safety & Privacy
- **Consecutive Low-Mood Safety Net (`detectLowMoodStreak`)**: Detects 3 consecutive low-mood days (`mood` `1` or `2`, anchoring on today or yesterday) and surfaces a calm, dismissible `SupportCard` on Home.
- **Helplines & Trusted Contacts (`SupportScreen` + `src/data/support.js`)**: Direct dial actions for **Tele-MANAS** (`14416` / `1-800-891-4416`, free 24x7) and **112** crisis guidance, trusted-person prompts, and conversation starters—accessible from Home (when triggered), low WHO-5 result screens, Toolkit, and Settings.
- **On-Device PIN Lock (`PinLockScreen` + `src/utils/pinLock.js`)**: Optional 4-digit passcode hashed with salted SHA-256 (`expo-crypto`) in `expo-secure-store`, plus automatic re-lock via `AppState` after `30` seconds in the background.
- **Customizable Preferences (`SettingsScreen`)**: `System` / `Light` / `Dark` theme switcher, global haptic toggle, local daily reminder (`expo-notifications`), 3-slide first-launch onboarding, root `ErrorBoundary`, and hidden developer tools (5 taps on version in About).
