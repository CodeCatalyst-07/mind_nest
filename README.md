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

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime & Framework** | React Native `0.88.1` + Expo `~58.0.26` | Cross-platform iOS & Android app running in Expo Go |
| **Language** | JavaScript (ES6+) | Simple, beginner-friendly single-language codebase |
| **Navigation** | `@react-navigation/native`, `bottom-tabs`, `native-stack` | 4-tab layout (`MainTabs`) plus 7 full-screen stack routes |
| **Local Storage** | `@react-native-async-storage/async-storage` | Persists check-ins, assessments, gratitude, sessions, and settings |
| **Security & Crypto** | `expo-secure-store`, `expo-crypto` | Encrypted storage of the salted SHA-256 PIN digest |
| **Charts & Graphics** | `react-native-svg` (`15.16.0`) | Pure SVG line, bar, heatmap, and circular gauge visualizations |
| **Animations & UI** | Built-in `Animated` API, `expo-linear-gradient` | Spring/timing transitions, chart draw-ins, and mood gradients |
| **Device Integrations** | `expo-haptics`, `expo-keep-awake`, `expo-notifications` | Tactile feedback, active breathing wake lock, and daily reminders |
| **Typography & Icons** | `@expo-google-fonts/nunito`, `@expo/vector-icons` (Ionicons) | Friendly typography and crisp vector iconography |
| **Testing & Linting** | `jest`, `jest-expo`, `eslint`, `eslint-config-expo` | Automated unit test suites and code-quality checks |

---

## 📁 Project Structure

```text
MindNest/
├── App.js                   # Root entry: loads Nunito fonts, ErrorBoundary, DataProvider, ThemeProvider, PIN/onboarding gates
├── app.json                 # Expo manifest: app name, slug, version 1.0.0, theme background & adaptive icon colors
├── eslint.config.js         # Flat ESLint configuration extending eslint-config-expo with Jest test globals
├── package.json             # Dependencies and npm scripts (start, android, ios, web, test, lint)
├── assets/                  # App icon, adaptive Android icons, favicon, and splash artwork
├── __tests__/               # Jest unit test suites for dates, models, scoring, stats, insights, toolkit, and support
├── docs/                    # Architecture diagrams, Problem Statement #222 mapping, viva demo guide, and screenshots
└── src/
    ├── components/          # Reusable UI primitives, selectors, SVG charts, animations, SupportCard, and ErrorBoundary
    ├── context/             # Global React Context (DataContext) syncing memory state with AsyncStorage
    ├── data/                # Static app catalogs, model factories, demo data generators, WHO-5 items, and helplines
    ├── navigation/          # AppNavigator (root native stack) and TabNavigator (4 primary bottom tabs)
    ├── screens/             # 12 screen views (Home, Trends, Toolkit, Settings, Onboarding, PinLock, CheckIn, Questionnaire, Breathing, Grounding, Gratitude, Support)
    ├── theme/               # Light, dark, and 5-level mood palettes, typography, spacing, and ThemeContext
    └── utils/               # Pure business logic (scoring, stats, insights, toolkit, support, dateUtils) and device helpers (storage, haptics, notifications, pinLock)
```

---

## 🚀 How to Run, Test & Lint

### 1. Run in Expo Go
```bash
git clone https://github.com/CodeCatalyst-07/mind_nest.git
cd mind_nest
npm install
npx expo start
```
Open the **Expo Go** app on Android (scan the QR code in the terminal) or use the iOS Camera app to open the link in Expo Go.

### 2. Run Unit Tests
```bash
npm test
```
Runs all 7 Jest test suites under `__tests__/` (`dateUtils`, `models`, `scoring`, `stats`, `insights`, `toolkit`, `support`).

### 3. Run Linter & Expo Health Check
```bash
npm run lint
npx expo-doctor
```

---

## 📚 Additional Documentation

- [Architecture & Mermaid Diagrams](docs/ARCHITECTURE.md)
- [Problem Statement #222 Mapping](docs/PROBLEM_STATEMENT_MAPPING.md)
- [5-Minute Demo Script & Viva Q&A](docs/DEMO_GUIDE.md)

---

## ⚠️ Limitations and Honest Notes

- **On-device storage only (uninstall deletes data)**: Because MindNest uses zero backend servers, all check-ins, gratitude entries, tool sessions, and assessments stay solely on your phone and will be lost if you uninstall the app or clear its storage.
- **`AsyncStorage` is not encrypted**: Records stored under `@mindnest_*` keys in `AsyncStorage` are plain JSON and are not encrypted at rest by `AsyncStorage`.
- **PIN lock is a convenience lock**: Although the 4-digit PIN itself is hashed with salted SHA-256 (`expo-crypto`) and stored in `expo-secure-store`, it serves as a casual screen-privacy barrier rather than strong full-database encryption.
- **Adapted WHO-5 is not clinically validated here**: The weekly reflection items and `0–100%` tiers are adapted from the WHO-5 Well-Being Index for educational self-reflection and have not undergone formal clinical validation inside MindNest.
- **Not a medical or emergency service**: MindNest is strictly a self-help companion. It does not diagnose conditions, provide clinical treatment, or replace campus counsellors, doctors, or emergency responders.
- **Reminders in Expo Go**: Daily notifications powered by `expo-notifications` depend on OS notification permissions and Expo Go runtime rules, so reminders may behave differently or fall back gracefully inside Expo Go.
- **Verify helpline numbers before release**: All helpline contacts in `src/data/support.js` (`Tele-MANAS 14416 / 1-800-891-4416` and `112`) should be re-verified before publishing to an app store.

---

## 🔮 Future Work

- **Encrypted local storage**: Migrate check-in and journal payloads from plain JSON `AsyncStorage` to an encrypted local SQLite store.
- **Optional summary export**: Let students export a read-only weekly PDF or JSON report to bring to a campus counsellor if they choose.
- **Expanded coping library**: Add customizable breathing durations, ambient audio/timer chimes, and short study-break stretch prompts.
- **Optional institutional check-in portal**: Support an opt-in, fully anonymized campus-level aggregate view for college wellness teams while keeping individual journals strictly private.

---

## 🙏 References and Credits

- **WHO-5 Well-Being Index**: Adapted from the 5-item positive well-being questionnaire published by the **World Health Organization (WHO)**.
- **Tele-MANAS (`14416` / `1-800-891-4416`) & Emergency (`112`)**: National Tele Mental Health Programme run by the **Ministry of Health and Family Welfare, Government of India**.
- **Expo & React Native**: Cross-platform mobile runtime (`expo`, `react-native`, `@react-navigation/*`, `AsyncStorage`, `expo-secure-store`, `expo-crypto`, `expo-haptics`, `expo-notifications`, `expo-keep-awake`, `expo-linear-gradient`).
- **Graphics & Typography**: `react-native-svg` for custom visualizations, `@expo-google-fonts/nunito` for typography, and `@expo/vector-icons` (`Ionicons`) for iconography.

---

## 📸 Screenshots

Once screenshots are captured from Expo Go and saved into `docs/screenshots/`, they display below (see [docs/screenshots/README.md](docs/screenshots/README.md) for capture instructions):

| Home | Daily Check-in | WHO-5 Result |
|------|----------------|--------------|
| ![Home Screen](docs/screenshots/home.png) | ![Daily Check-in Screen](docs/screenshots/checkin.png) | ![Assessment Result Screen](docs/screenshots/result.png) |

| Trends Dashboard | Guided Breathing | Support & Helplines |
|------------------|------------------|---------------------|
| ![Trends Dashboard](docs/screenshots/trends.png) | ![Guided Breathing Screen](docs/screenshots/breathing.png) | ![Support Screen](docs/screenshots/support.png) |
