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
