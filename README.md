# UM-Waze — FSKTM Campus Navigator

A mobile wayfinding app for the Faculty of Computer Science & Information Technology (FSKTM), Universiti Malaya. Built with **Expo** and **React Native**, it lets students and staff find rooms, labs, and people inside the FSKTM building without needing an internet connection to the university system.

---

## What it does

| Screen | What it shows |
|---|---|
| **Home** | Greeting, quick-search bar, category shortcuts (Cafe, Lobby, Surau, Library), an upcoming-class card with a one-tap "navigate" button, and section shortcuts to Labs, Lecture Halls, and Staff Offices. |
| **Map** | OpenStreetMap tiles centred on the real FSKTM GPS coordinates, a dashed route polyline, a "you are here" dot, floor selector (G/1/2/3), and filter chips for Labs / Restrooms / Stairs. A bottom sheet shows distance and a **Find Route** button. |
| **Search** | Live full-text search across all rooms, labs, and staff with filter chips (All / Rooms / Labs / Staff / Facilities). Tapping a result navigates directly to that pin on the Map screen. |
| **Directory** | Filterable list of FSKTM staff (Lecturers / Admin / Support) with name, department, room number, and a **Navigate to Office** button. |

The four screens sit inside a bottom-tab navigator. All data is mock/static — no backend or login is required to run the app.

---

## Is it like the Figma design?

Yes. The Figma file is named **UM-Waze** and the code implements the same concept: a Waze-style indoor-and-outdoor navigator scoped to FSKTM. The four screens, the blue primary colour (`#1A73E8`), the bottom-tab layout, the floor-selector overlay on the map, and the bottom-sheet route card all match the design intent described in the Figma spec. (The Figma MCP hit its free-tier rate limit during this session, so a pixel-by-pixel comparison was not possible — but the naming, structure, and feature set are directly aligned.)

---

## Is it functional?

Yes, with the following scope:

- All four tabs render and are navigable.
- The Map screen uses **real GPS coordinates** for FSKTM (lat 3.1209, lng 101.6556) and streams **live OpenStreetMap tiles** — you will see the actual campus map when online.
- Tapping "Navigate" on the Home screen or a Search result animates the map camera to that destination.
- Search filtering is live; results update as you type.
- Directory filtering by staff role is live.
- Route distance and time (350 m · 5 mins) are static placeholders — turn-by-turn routing is not implemented.
- Floor selector buttons toggle UI state but do not swap map layers (no indoor floor-plan assets are included).

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18 or 20 LTS |
| npm | 9+ (comes with Node) |
| Expo CLI | installed globally **or** used via `npx` |
| **iOS** | Xcode 15+ with an iOS 17 simulator **or** Expo Go on a physical device |
| **Android** | Android Studio with an emulator (API 33+) **or** Expo Go on a physical device |

> You do **not** need a paid Expo account. The app runs entirely in Expo Go.

---

## Running the app

### 1. Clone and install

```bash
git clone <repo-url>
cd um-waze
npm install
```

### 2. Start the dev server

```bash
npx expo start --tunnel
```

The terminal will show a QR code and a menu of options.

### 3. Open on a device or simulator

| Platform | Steps |
|---|---|
| **Physical phone (iOS or Android)** | Install **Expo Go** from the App Store / Play Store, then scan the QR code in the terminal. |
| **iOS Simulator** | Press `i` in the terminal (requires Xcode). |
| **Android Emulator** | Press `a` in the terminal (requires Android Studio with a running AVD). |
| **Web browser** | Press `w` in the terminal (map tiles render but `react-native-maps` is limited on web). |

### 4. Direct platform commands (alternative)

```bash
npm run ios       # opens iOS simulator directly
npm run android   # opens Android emulator directly
npm run web       # opens browser tab
```

---

## Running tests

```bash
npx jest            # run all tests once
npx jest --watch    # re-run on file changes
npx jest --coverage # generate coverage report
```

Tests live in `src/__tests__/` and cover all four screens and the search utility.

---

## Project structure

```
um-waze/
├── app.json                    # Expo config (name, icons, orientation)
├── index.ts                    # App entry point
├── assets/                     # Icons and splash images
└── src/
    ├── types.ts                # Shared TypeScript types (StaffMember, Location)
    ├── theme.ts                # Colour palette, spacing, and border-radius tokens
    ├── data/
    │   └── mockData.ts         # Static FSKTM locations and staff records
    ├── utils/
    │   └── search.ts           # Full-text search + filter logic
    ├── components/
    │   ├── SearchBar.tsx
    │   ├── CategoryChip.tsx
    │   ├── SectionCard.tsx
    │   ├── StaffCard.tsx
    │   └── UpcomingClassCard.tsx
    ├── navigation/
    │   └── TabNavigator.tsx    # Bottom-tab navigator wiring all 4 screens
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── MapScreen.tsx
    │   ├── SearchScreen.tsx
    │   └── DirectoryScreen.tsx
    └── __tests__/              # Jest + React Native Testing Library tests
```

---

## Key dependencies

| Package | Purpose |
|---|---|
| `expo ~56` | Managed workflow runtime |
| `react-native 0.85` | Core mobile framework |
| `react-native-maps` | MapView, Marker, Polyline, UrlTile (OpenStreetMap) |
| `@react-navigation/bottom-tabs` | Tab bar navigation |
| `@expo/vector-icons` | Ionicons icon set |
| `expo-location` | (Available for future GPS "locate me" feature) |

---

## Troubleshooting

**Metro bundler fails to start**
```bash
npx expo start --clear
```

**`react-native-maps` crash on Android emulator**
Make sure your AVD has Google Play Services. API 33 (Android 13) x86_64 image is recommended.

**Map tiles do not load**
The device or simulator must have internet access. OpenStreetMap tiles are fetched live from `tile.openstreetmap.org`.

**TypeScript errors after `npm install`**
```bash
npx tsc --noEmit
```
If errors appear, ensure you are on Node 18 or 20 — Node 22 can conflict with some Expo 56 native deps.
