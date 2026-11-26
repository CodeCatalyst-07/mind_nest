# MindNest Architecture 📐

This document explains how MindNest is structured under the hood. Every diagram below reflects the actual files, hooks, routes, storage keys, and data models in the repository.

---

## 1. Layered Architecture

```mermaid
flowchart TD
    Root["App.js - Root Entry and Gatekeeper"] --> EB["ErrorBoundary - Crash Recovery"]
    EB --> DP["DataProvider - src/context/DataContext.js"]
    DP --> TP["ThemeProvider - src/theme/ThemeContext.js"]
    TP --> Nav["Navigation - AppNavigator and TabNavigator"]
    Nav --> Screens["Screens - 12 Feature Views in src/screens/"]
    Screens --> Components["Components - UI Primitives and SVG Charts in src/components/"]
    Screens --> Utils["Utils and Data - src/utils/ and src/data/"]
    Components --> Utils
    Utils --> Async["AsyncStorage via src/utils/storage.js"]
    Utils --> Secure["SecureStore and Crypto via src/utils/pinLock.js"]
```

MindNest follows a clean top-down layered architecture where `App.js` preloads the Nunito font, wraps everything in `ErrorBoundary`, and connects `DataProvider` into `ThemeProvider`. Screens never talk directly to device storage APIs; instead, they read state and invoke actions exposed by `useData()` and access colors, typography, and spacing via `useTheme()`. Pure business logic (scoring, stats, insights, streak detection, and recommendations) lives in stateless functions under `src/utils/`, making the math easy to unit-test independently from the React Native UI. Hardware-facing helpers (`storage.js`, `haptics.js`, `notifications.js`, `pinLock.js`) wrap `AsyncStorage`, `expo-secure-store`, `expo-crypto`, `expo-haptics`, and `expo-notifications` behind safe `try/catch` boundaries.

---
## 2. Unidirectional Data Flow

```mermaid
flowchart LR
    User["Student Action"] --> Screen["Screen - e.g. CheckInScreen or ToolkitScreen"]
    Screen --> Action["DataContext Action - saveCheckIn / saveAssessment / logSession"]
    Action --> Factory["Model Factory - src/data/models.js"]
    Factory --> State["React State Update in DataProvider"]
    Factory --> Storage["saveData in src/utils/storage.js"]
    Storage --> Disk["AsyncStorage - Persistent JSON"]
    State --> UI["Re-render Home, Trends, Toolkit, and Settings"]
```

Whenever a student completes a check-in, weekly assessment, gratitude entry, or coping session, the screen passes the raw input to an action in `DataContext`. That action validates and formats the record using a factory function in `src/data/models.js`, updates React state immediately so the UI stays responsive, and writes the updated array as JSON into `AsyncStorage`. Because `HomeScreen`, `TrendsScreen`, and `ToolkitScreen` all subscribe to `useData()`, any change automatically updates Today's summary, charts, streaks, and weekly tool counts without manual refreshing. On startup, `DataContext` reverses this once by reading all five keys from `AsyncStorage` in parallel with `Promise.all` before rendering navigation.

---

## 3. Sequence Diagram: Saving a Daily Check-in

```mermaid
sequenceDiagram
    actor Student
    participant CI as CheckInScreen
    participant DC as DataContext
    participant Model as createCheckIn
    participant Store as storage.js
    participant AS as AsyncStorage
    participant Hap as haptics.js

    Student->>CI: Tap "Save Check-in" on Review step
    CI->>DC: saveCheckIn(draft + dateKey)
    DC->>Model: createCheckIn(checkInData)
    Model-->>DC: Validated CheckIn object
    DC->>DC: Upsert into checkIns state (match by date)
    DC->>Store: saveData("@mindnest_checkins", updated)
    Store->>AS: AsyncStorage.setItem(key, JSON)
    AS-->>Store: Promise resolved
    DC-->>CI: Return formatted CheckIn
    CI->>Hap: haptics.success()
    CI-->>Student: Animate green checkmark and show Summary
```

On the Review step of `CheckInScreen`, tapping **Save Check-in** calls `saveCheckIn()` with today's local `YYYY-MM-DD` date key from `toDateKey()`. Inside `DataContext`, `createCheckIn()` validates the numeric mood/energy bounds (`1–5`), ensures `sleepHours` is non-negative, trims the note, and attaches an ID and ISO timestamp. `saveCheckIn` then performs an upsert by date—updating today's entry in place if the student is editing, or prepending a new entry—before persisting the array under `@mindnest_checkins`. Finally, `CheckInScreen` triggers `haptics.success()` and plays a spring checkmark animation while `HomeScreen` and `TrendsScreen` reflect the saved entry automatically.

---
