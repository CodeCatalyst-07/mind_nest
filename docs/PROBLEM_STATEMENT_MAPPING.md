# Problem Statement Mapping 📋

**Problem Statement #222**: *"Mental health and well-being surveillance, assessment and tracking solution among children"*
**Domain**: Ministry of Education • Smart Education (Software Edition)

---

## Requirement-to-Code Mapping

| Problem Statement Requirement | How MindNest Addresses It | Exact Screens, Components & Files |
|-------------------------------|---------------------------|-----------------------------------|
| **Well-being Surveillance (Continuous Check-in)** | Low-friction 5-step daily self-check logging mood (`1–5`), energy (`1–5`), sleep (`0–12h`), student tags, and notes, plus consecutive low-mood streak detection (`3` days of mood `1–2`). | `src/screens/CheckInScreen.js`, `src/components/MoodSelector.js`, `src/components/EnergySelector.js`, `src/components/SleepPicker.js`, `src/components/TagChips.js`, `src/utils/support.js` (`detectLowMoodStreak`), `src/components/SupportCard.js` |
| **Well-being Assessment** | Structured weekly 5-item reflection adapted from the WHO-5 Well-Being Index (`0–5` frequency scale), yielding a raw score (`0–25`), percentage (`0–100%`), and 4 well-being tiers (*Thriving*, *Doing okay*, *Needs attention*, *Low*). | `src/data/questionnaire.js`, `src/utils/scoring.js`, `src/screens/QuestionnaireScreen.js`, `src/components/OptionButton.js`, `src/components/ScoreGauge.js`, `src/screens/HomeScreen.js` (7-day due status) |
| **Tracking Over Time** | 7-day and 30-day trend charts (mood line chart, monthly mood calendar heatmap, sleep bars colored by mood, tag frequency, WHO-5 trajectory), consecutive streaks, and plain-language observational insights. | `src/screens/TrendsScreen.js`, `src/utils/stats.js`, `src/utils/insights.js`, `src/components/MoodLineChart.js`, `src/components/MoodHeatmap.js`, `src/components/SleepBarChart.js`, `src/components/TagFrequencyChart.js`, `src/components/AssessmentTrendChart.js`, `src/components/StatCard.js` |
| **Solutions for Improvement** | Mood-aware Coping Toolkit offering three evidence-inspired exercises (Guided Breathing, 5-4-3-2-1 Sensory Grounding, and Gratitude Journaling) plus a 7-day practice summary and human helpline support. | `src/screens/ToolkitScreen.js`, `src/utils/toolkit.js`, `src/data/toolkit.js`, `src/components/BreathingCircle.js`, `src/screens/BreathingScreen.js`, `src/screens/GroundingScreen.js`, `src/screens/GratitudeScreen.js`, `src/screens/SupportScreen.js`, `src/data/support.js` |
| **Designed for Children & Students** | Friendly Nunito typography, non-clinical conversational copy, relatable campus tags (`Studies`, `Friends`, `Family`, `Sleep`, `Health`, `Exercise`, `Social media`), gentle daily reminders, and simple onboarding. | `src/theme/colors.js`, `src/theme/typography.js`, `src/data/messages.js`, `src/screens/OnboardingScreen.js`, `src/screens/SettingsScreen.js`, `src/utils/notifications.js` |
| **Privacy & Trustworthiness** | Offline-first storage under `@mindnest_*` AsyncStorage keys, salted SHA-256 PIN lock stored in `expo-secure-store`, 30s background auto-lock, and transparent non-diagnostic disclaimers. | `src/context/DataContext.js`, `src/utils/storage.js`, `src/utils/pinLock.js`, `src/screens/PinLockScreen.js`, `App.js` |

---

## Why MindNest Is Self-Reported and Local-First

In educational settings, central "surveillance" dashboards connected to school servers can create privacy anxiety and fear of judgment, which often causes students to skip check-ins or give socially desirable answers instead of honest ones. Making MindNest **self-reported** puts the student in charge of observing their own sleep, energy, and mood without feeling graded or watched. Making it **local-first** (storing all check-ins, journal notes, and scores directly on the phone via `AsyncStorage` and `expo-secure-store`) removes cloud exposure, eliminates login barriers, keeps the app usable even without campus Wi-Fi, and encourages genuine day-to-day self-awareness while gently pointing students toward trusted adults and free national helplines (`Tele-MANAS 14416`) when patterns stay low.
