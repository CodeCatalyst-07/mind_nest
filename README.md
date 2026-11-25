# MindNest 🌱

> A student mental well-being companion app built with React Native and Expo (Expo Go).

MindNest helps college students track their daily moods, complete weekly wellness questionnaires, observe emotional trends, and access grounding coping tools during stressful academic periods.

---

## 📱 Tech Stack

- **Framework**: React Native with [Expo](https://expo.dev) (Expo Go compatible)
- **Language**: JavaScript (ES6+)
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Styling & Theme**: Custom ThemeContext supporting dynamic Light & Dark modes
- **Typography**: Google Fonts [Nunito](https://fonts.google.com/specimen/Nunito) (Regular, SemiBold, Bold)
- **Icons**: `@expo/vector-icons` (Ionicons)

---

## 📁 Project Structure

```text
MindNest/
├── App.js                     # Root entry point: loads fonts and providers
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
└── src/
    ├── components/            # Reusable UI primitives
    │   ├── Screen.js          # Safe area container with theme background
    │   ├── AppText.js         # Typography component supporting variants
    │   └── Card.js            # Rounded surface card with elevation/shadow
    ├── navigation/            # Navigation configuration
    │   ├── AppNavigator.js    # Root Native Stack (Tabs + full-screen routes)
    │   └── TabNavigator.js    # 4-tab bottom navigation
    ├── screens/               # Screen components
    │   ├── HomeScreen.js      # Welcome screen with daily activity shortcuts
    │   ├── CheckInScreen.js   # Daily mood check-in & 5-level mood preview
    │   ├── QuestionnaireScreen.js # Weekly reflection questions
    │   ├── TrendsScreen.js    # Mood history and trends
    │   ├── ToolkitScreen.js   # Coping mechanisms and breathing tools
    │   └── SettingsScreen.js  # Theme status and app info
    ├── theme/                 # Design tokens and context
    │   ├── colors.js          # Light, dark, and 5-level mood palettes
    │   ├── typography.js      # Font scales and families
    │   ├── spacing.js         # Spacing and border radii
    │   └── ThemeContext.js    # ThemeProvider and useTheme() hook
    ├── utils/                 # Helper functions (placeholder)
    └── data/                  # Static question and prompt data (placeholder)
```

---

## 📋 Weekly Well-Being Assessment (WHO-5)

MindNest's weekly self-reflection tool is adapted from the **WHO-5 Well-Being Index** developed by the World Health Organization. The WHO-5 is one of the most widely used questionnaires for assessing subjective psychological well-being.

### Questions & Scoring Method
Students evaluate 5 positive statements over the last two weeks on a 6-point scale:
- **Always** (5)
- **Very often** (4)
- **Often** (3)
- **Sometimes** (2)
- **Rarely** (1)
- **Never** (0)

The **raw score** ranges from 0 to 25. This raw score is multiplied by 4 to generate a standardized **percentage score** from 0% to 100%, classified into 4 tiers:
- **72% – 100%**: *Thriving* (High vitality and positive spirits)
- **50% – 71%**: *Doing okay* (Moderate, stable well-being)
- **29% – 49%**: *Needs attention* (Elevated stress or low vitality)
- **0% – 28%**: *Low* (Significantly reduced well-being)

> [!NOTE]
> **Non-Diagnostic Disclaimer**: The MindNest questionnaire is strictly an educational self-check and reflective tool for college students to monitor their personal trends. It is **not** a clinical diagnostic instrument. Students experiencing prolonged distress are warmly encouraged to consult campus counseling services, healthcare professionals, or trusted adults.

---

## 📊 Trends, Insights & Analytics

MindNest features an insights dashboard on the **Trends** tab that transforms raw daily check-ins and weekly assessment scores into visual charts and plain-language reflections.

### Pure SVG Data Visualizations (`react-native-svg`)
All charts are custom-rendered directly with `react-native-svg` and animated using React Native's built-in `Animated` API without heavy third-party chart libraries:
- **Mood Trajectory (`MoodLineChart`)**: A continuous trendline with smooth animated draw-in, gradient area fill, and mood-colored data nodes (levels 1–5).
- **Monthly Mood Calendar (`MoodHeatmap`)**: A 7-column calendar grid showing every day of the current month colored by that day's recorded mood rating.
- **Sleep Duration vs. Mood (`SleepBarChart`)**: Vertical duration bars (0–12h) dynamically colored by that day's mood rating, with a dashed reference line at 7 hours (recommended student sleep benchmark).
- **Tag Frequency Distribution (`TagFrequencyChart`)**: Horizontal bars showing the student's top contextual tags and activities.
- **WHO-5 Trajectory (`AssessmentTrendChart`)**: Long-term percentage trendline mapped alongside faint reference threshold lines (72% *Thriving*, 50% *Doing okay*, 29% *Needs attention*).

### Statistical Calculations (`stats.js`)
- **Range Filtering**: Slices data by calendar date boundaries (Last 7 Days vs. Last 30 Days).
- **Averages**: Calculates arithmetic means for mood rating, sleep hours, and energy level with 1 decimal precision.
- **Streak Logic**: Tracks consecutive check-in days up to today. If today has not been logged yet, an active streak ending yesterday remains intact so the streak is not prematurely lost before bedtime.

### Plain-Language Non-Clinical Insights (`insights.js`)
Reflective insights detect gentle correlational patterns in student life without medical or diagnostic assertions:
1. **Sleep & Mood Link**: Compares average mood on nights with 7+ hours of sleep against nights with under 6 hours (triggers when $\ge 3$ entries exist in both groups).
2. **Best Weekday**: Determines which day of the week exhibits the highest average mood score (requires $\ge 4$ multi-day entries).
3. **Common Stressors**: Identifies the most recurring context tags on lower-mood days ($\text{mood} \le 2$, $\ge 3$ days).
4. **Consistency Encouragement**: Celebrates multi-day check-in milestones to encourage habit formation.

---

## 🧰 Coping Toolkit

MindNest's **Toolkit** tab provides quick, practical self-help exercises tailored to college life and the student's daily mood rating.

### Included Tools
1. **Guided Breathing (`BreathingScreen` & `BreathingCircle`)**:
   - Features three paced rhythms: **Calm (4-6)**, **Box (4-4-4-4)**, and **Relax (4-7-8)** for **1, 2, or 5 minutes**.
   - Animated breathing circle expands on inhale, holds steady, and contracts smoothly on exhale with haptic cues at every phase change and `expo-keep-awake` keeping the screen active while running.
   - Displays a safety reminder (*"If you feel dizzy, stop and breathe normally."*) and cleans up all timers/animations automatically if exited mid-session.
2. **5-4-3-2-1 Grounding (`GroundingScreen`)**:
   - Interactive sensory check-in guiding the student through **5 things you can see**, **4 you can feel**, **3 you can hear**, **2 you can smell**, and **1 you can taste**.
   - Includes a progress bar and animated tap feedback for each noticed item before advancing.
3. **Gratitude Journal (`GratitudeScreen`)**:
   - Rotating friendly prompts (max 100 characters per reflection) with a **3 entries per day** limit to keep reflections intentional.
   - Groups entries by calendar date and supports confirmed deletion.

### Mood-Based Recommendations & Usage Summary
- **`getRecommendation(todayMood)`**: Automatically suggests Breathing or Grounding on low/stressed mood days (1–2), Grounding on neutral days (3), Gratitude on positive days (4–5), or a quick 1-minute breathing pause if today's check-in hasn't been logged yet.
- **Weekly Usage Summary (`summarizeSessions`)**: Tracks completed `ToolSession` records locally in AsyncStorage and totals sessions, minutes, and per-tool counts over the past 7 days.

> [!NOTE]
> **Self-Help Disclaimer**: All exercises in the Coping Toolkit are supportive self-help practices intended for everyday stress management and mindfulness. They are **not** medical or psychological treatment.

---

## 🚀 How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Expo development server**:
   ```bash
   npx expo start
   ```

3. **Open on your device**:
   - Install the **Expo Go** app on your iOS or Android phone.
   - Scan the QR code displayed in your terminal with your phone camera (iOS) or the Expo Go app (Android).
