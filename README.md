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
