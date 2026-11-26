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
