# MindNest Demo Guide & Viva Prep 🎤

Use this guide to run a smooth 5-minute live demonstration of MindNest for your instructor or project evaluation panel.

---

## Pre-Demo Checklist

- [ ] **Charge your phone and laptop** (at least 60%+ battery on both).
- [ ] **Check Wi-Fi & Expo Go connection**: Verify both laptop and phone are on the same Wi-Fi network (or start with `npx expo start --tunnel` if campus Wi-Fi blocks local ports).
- [ ] **Clear storage for onboarding demo** OR keep demo data handy: In Settings, tap **MindNest / v1.0.0** 5 times before the demo if you want quick access to **Developer Tools** (`Load 14 days of demo data`, `Seed 3-day low-mood streak`, `Replay onboarding`).
- [ ] **Disable notifications/Do Not Disturb** on your phone so pop-ups don't interrupt screen mirroring.
- [ ] **Prepare a backup screen recording**: Record one clean 2-minute walkthrough video on your phone beforehand in case live Wi-Fi fails in the classroom.
- [ ] **Verify automated checks**: Run `npm test` (all 7 suites / 63 tests pass) and `npm run lint` cleanly before presenting.

---

## 5-Minute Live Demo Script

### `0:00 – 0:40` • First-Launch Onboarding (`OnboardingScreen`)
- **What to tap**: Open MindNest freshly (or use Developer Tools → *Replay onboarding on next view*). Swipe slowly through all 3 slides, then tap **Get started**.
- **What to say**: *"MindNest opens with a short 3-screen introduction explaining what it tracks, how trends work, and our privacy promise: student data stays strictly on their phone, and this app is a self-help tool rather than medical diagnosis."*

### `0:40 – 1:30` • Daily Check-in Flow (`HomeScreen` → `CheckInScreen`)
- **What to tap**: On **Home**, tap **Check in now**. Select Mood (`4 - Good`), note the subtle background tint, tap **Continue**. Tap Energy (`4`), set Sleep (`7.5h`), select a tag like `Studies`, type a short reflection note, review, and tap **Save Check-in**. Tap **Done** back to Home.
- **What to say**: *"The daily check-in is designed to take under a minute—just mood, energy, sleep, context tags, and an optional note—and immediately updates Today's summary on the Home screen."*

### `1:30 – 2:20` • Weekly Well-Being Questionnaire (`QuestionnaireScreen`)
- **What to tap**: Tap **Start Weekly Check** (or **Retake**). Answer the 5 items one per page, tap **View Results**, show the animated `ScoreGauge`, tier badge, and disclaimer, then return Home.
- **What to say**: *"For weekly tracking, MindNest adapts the 5-item WHO-5 Well-Being Index from the World Health Organization. Answers from 0 to 5 sum to 25 and multiply by 4 for a 0–100% score across four tiers. Lower scores gently surface trusted-person encouragement."*

### `2:20 – 3:15` • Trends Dashboard (`TrendsScreen`)
- **What to tap**: Open **Settings** → tap `v1.0.0` 5 times → tap **Load 14 days of demo data**. Switch to the **Trends** tab. Toggle **Last 7 Days / Last 30 Days**, scroll down past the animated `MoodLineChart`, `MoodHeatmap`, `SleepBarChart`, `TagFrequencyChart`, `AssessmentTrendChart`, and **Reflective Patterns & Insights**.
- **What to say**: *"Trends turns raw entries into custom SVG charts built purely with `react-native-svg`—no third-party charting libraries. We also compute the current check-in streak and non-clinical insights like comparing mood on nights with 7+ hours of sleep versus under 6 hours."*

### `3:15 – 4:00` • Coping Toolkit (`ToolkitScreen` → `BreathingScreen`)
- **What to tap**: Switch to **Toolkit**. Point out the **Suggested for you** banner at the top, then open **Guided Breathing**. Select `Calm (4-6)` for `1 min`, tap **Start Session**, watch the expanding/shrinking `BreathingCircle` for ~10 seconds, then press Back to show timers stop cleanly.
- **What to say**: *"The Toolkit gives students actionable help based on today's mood. Guided Breathing uses React Native's `Animated` API with phase haptics and `expo-keep-awake` so the screen stays on while breathing, plus `Grounding 5-4-3-2-1` and a `Gratitude Journal` capped at 3 entries per day."*

### `4:00 – 4:30` • Safety Net & Support (`HomeScreen` → `SupportScreen`)
- **What to tap**: In hidden Developer Tools, tap **Seed 3-day low-mood streak**. Return to **Home** to show the calm `SupportCard`, then tap **More support options** to open **Support**.
- **What to say**: *"If a student logs 3 consecutive days of low mood (1 or 2), Home gently displays a dismissible `SupportCard` with a one-tap call button to India's free 24x7 Tele-MANAS helpline (`14416`), 112 crisis guidance, and simple conversation starters."*

### `4:30 – 5:00` • Privacy, Theme & Settings (`SettingsScreen`)
- **What to tap**: Open **Settings**. Toggle **Dark Mode** (`Light` → `Dark` → `System`), point out **Haptic Feedback**, **Daily Check-in Reminder**, and **4-Digit PIN Lock** (`expo-crypto` SHA-256 + `expo-secure-store`).
- **What to say**: *"Finally, students can switch themes, toggle haptics, set daily reminder times, and lock the app with a 4-digit PIN whose SHA-256 hash lives in `SecureStore` and locks again automatically 30 seconds after leaving the app."*

---

## 12 Likely Viva Questions & Honest Answers

1. **Why does MindNest have no backend or login?**
   Mental health entries are deeply personal, and requiring accounts or uploading mood logs to a remote database discourages students from being honest—and adds server hosting and data-protection liabilities. A local-first design lets students use MindNest immediately with zero Wi-Fi or sign-up friction.

2. **Why did you choose `AsyncStorage` instead of SQLite or Firebase?**
   Our data volume per student is small (a few hundred daily check-in objects, weekly assessments, gratitude entries, and tool sessions as JSON arrays under `@mindnest_*` keys in `src/utils/storage.js`). `AsyncStorage` works natively in Expo Go without extra native database setup and is easy to inspect, back up, or reset cleanly.

3. **Why use React Context (`DataContext`) instead of Redux or Zustand?**
   MindNest has a single global data store (`checkIns`, `assessments`, `gratitudeEntries`, `sessions`, `settings`) with straightforward async reads and array updates. React's built-in `createContext` + `useCallback` + `useState` in `src/context/DataContext.js` handles this with zero extra dependencies and stays simple to trace and explain.

4. **How does the weekly questionnaire scoring work?**
   Each of the 5 items in `src/data/questionnaire.js` scores `0` (*Never*) to `5` (*Always*), giving a `rawScore` between `0` and `25` (`calculateRawScore` in `src/utils/scoring.js`). Multiplying by `4` (`calculatePercentage`) yields a `0–100%` score mapped into four categories: `72–100` (*Thriving*), `50–71` (*Doing okay*), `29–49` (*Needs attention*), and `0–28` (*Low*).

5. **How clinically valid is this assessment?**
   MindNest's items and scoring formula are adapted from the World Health Organization's **WHO-5 Well-Being Index**, which is widely validated in clinical literature—however, our specific mobile adaptation has **not** undergone clinical validation. For that reason, `QuestionnaireScreen.js` and `SupportScreen.js` explicitly state it is an educational self-check, not a medical diagnosis.

6. **How is student privacy handled, and how strong is the PIN lock?**
   All check-ins, notes, gratitude entries, and assessment scores remain on-device inside `AsyncStorage` (unencrypted JSON, wiped if the app is uninstalled). For casual phone-sharing privacy, `src/utils/pinLock.js` hashes the optional 4-digit PIN using salted **SHA-256** via `expo-crypto` and stores only the digest in `expo-secure-store`, while `App.js` re-locks via `AppState` after `30` seconds in the background. It is a local convenience lock, not enterprise-grade encryption of the `AsyncStorage` database itself.

7. **How are the charts drawn without a third-party charting library?**
   Every chart (`MoodLineChart`, `SleepBarChart`, `AssessmentTrendChart`, `ScoreGauge`) is rendered directly using `react-native-svg` primitives (`Svg`, `Path`, `Rect`, `Circle`, `Line`, `LinearGradient`), while `MoodHeatmap` and `TagFrequencyChart` use themed React Native Flexbox grids and progress bars. We convert mood (`1–5`), sleep (`0–12h`), and scores (`0–100%`) into $(x, y)$ pixel coordinates relative to measured `onLayout` container width, inverting $Y$ because SVG `y = 0` starts at the top.

8. **How are your unit tests organised?**
   All 7 test suites live in `__tests__/` (`dateUtils`, `models`, `scoring`, `stats`, `insights`, `toolkit`, `support`) and run under `jest` with `jest-expo` (`npm test`). Because pure calculations and date/model logic are decoupled from React components inside `src/utils/` and `src/data/`, every formula, clamping rule, streak boundary, and threshold is tested deterministically.

9. **What was the hardest part to get right?**
   Handling **local calendar dates and streak/timer state reliably**. Early date arithmetic can easily shift check-ins across days due to UTC conversion, so `toDateKey()` in `src/utils/dateUtils.js` formats strictly in local time; similarly, the `BreathingScreen` interval had to use functional state updates plus `useEffect` unmount cleanup so phase countdowns, haptics, and `expo-keep-awake` never leak if the student leaves mid-session.

10. **What would you add next if this project continued?**
    Encrypted local database storage (such as encrypted SQLite), JSON/PDF export so students can optionally share a self-check summary with a campus counsellor, customizable coping exercises (such as audio-guided meditation or custom breathing durations), and institutional opt-in anonymous aggregate reporting for colleges.

11. **How does the app respond when a student seems to be struggling?**
    Two gentle triggers exist without being alarmist: (1) scoring **Needs attention** (`29–49%`) or **Low** (`0–28%`) on the WHO-5 questionnaire shows a supportive card recommending a trusted person plus a button to **View Support Resources**; and (2) `detectLowMoodStreak()` in `src/utils/support.js` detects `3` consecutive days of mood `1` or `2` and displays a dismissible `SupportCard` on **Home** with a one-tap dial to **Tele-MANAS (`14416`)**, **112** emergency guidance, and conversation starters on `SupportScreen`.

12. **How do animations and notifications stay compatible with Expo Go?**
    All animations (tab card press scale, screen entrance transitions, chart draw-ins, `BreathingCircle`, and wrong-PIN shake) use React Native's built-in `Animated` API rather than `react-native-reanimated` or custom native code. Hardware helpers (`expo-haptics`, `expo-notifications`, `expo-keep-awake`, `expo-secure-store`) wrap native calls in `try/catch` blocks so unsupported environments or Expo Go limitations degrade gracefully without crashing.
