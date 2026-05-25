# UM-Waze React Native Expo Go Prototype — Design Spec

**Date:** 2026-05-25
**Source Figma:** https://www.figma.com/design/Mczz6rTjUjlKXcrI9aafF2/UM-Waze

---

## Overview

A React Native prototype of UM-Waze, a campus navigation app for UM FSKTM (Faculty of Computer Science and Information Technology, Universiti Malaya). Runs on Expo Go (managed workflow, no ejecting). Data is hardcoded mock JSON. Navigation uses React Navigation with a bottom 4-tab structure.

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React Native (Expo managed workflow) |
| Runtime | Expo Go |
| Navigation | React Navigation v6 — `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack` |
| Map | `react-native-maps` (bundled in Expo Go) with OSM tiles + bundled floor-plan PNG overlay |
| Location | `expo-location` (GPS, for centering map on campus) |
| Icons | `@expo/vector-icons` (Ionicons / MaterialCommunityIcons) |
| Data | Hardcoded TypeScript arrays in `src/data/mockData.ts` |
| Language | TypeScript |

---

## Project Structure

```
um-waze/
├── App.tsx                          # Root: NavigationContainer + TabNavigator
├── src/
│   ├── navigation/
│   │   └── TabNavigator.tsx         # 4-tab bottom bar
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Home Dashboard
│   │   ├── MapScreen.tsx            # Map + floor plan + route
│   │   ├── SearchScreen.tsx         # Search rooms & staff
│   │   └── DirectoryScreen.tsx      # Faculty directory
│   ├── components/
│   │   ├── SearchBar.tsx            # Reusable search input (mic + QR icons)
│   │   ├── CategoryChip.tsx         # Pill filter button
│   │   ├── SectionCard.tsx          # Icon + title + description + arrow
│   │   ├── StaffCard.tsx            # Faculty/staff list item
│   │   └── UpcomingClassCard.tsx    # Dark navy card with navigate button
│   ├── data/
│   │   └── mockData.ts              # All hardcoded data
│   ├── assets/
│   │   └── fsktm-floorplan.png      # Building floor plan image
│   └── theme.ts                     # Colors, typography, spacing constants
├── app.json
└── package.json
```

---

## Navigation Structure

```
TabNavigator (bottom 4 tabs)
├── Home tab       → HomeScreen
├── Map tab        → MapScreen
├── Search tab     → SearchScreen
└── Directory tab  → DirectoryScreen
```

Bottom tab bar design:
- Active tab: icon + label, yellow highlight circle (`#F5C518`) behind icon
- Inactive: icon + label, `#6B7280` grey
- Background: white with top border

---

## Screens

### 1. Home Screen (`HomeScreen.tsx`)

**Header:** Logo ("UM FSKTM Navigator") left, profile icon right.

**Greeting section:**
- "Good morning, Navigator" (bold, large)
- "Where to in FSKTM today?" (grey subtitle)

**Search bar:** Full-width, placeholder "Search rooms, labs, or staff...", mic icon right, QR icon right.

**Quick category chips (horizontal scroll):**
- CAFE · LOBBY · SURAU · LIBRARY

**Upcoming Class card (dark navy `#1B3A6B`):**
- Label: "UPCOMING CLASS" (small caps)
- Badge: "STARTS IN 15 MINS" (yellow pill)
- Title: "Data Structures & Algorithms"
- Location: "DK1, Block A" (pin icon)
- Time: "10:00 AM – 12:00 PM" (clock icon)
- Button: "Navigate" (white outline, diamond/nav icon)

**Floor indicator:** Vertical number list on right edge (1–4 + G), current floor highlighted.

**Section list (3 items):**
- Computer Labs — "Find open workstations across all blocks." (laptop icon)
- Lecture Halls — "DK1, DK2, and other main lecture spaces." (graduation cap icon)
- Staff Offices — "Locate lecturers, admin, and support staff." (briefcase icon, blue arrow)

**Bottom tab bar:** active tab = Home.

---

### 2. Map Screen (`MapScreen.tsx`)

**Header:** Logo left, profile icon right.

**Search bar:** "Search destination", mic icon.

**Quick filter chips:** Labs · Restrooms · Stairs

**Map view (main area):**
- `react-native-maps` `MapView` centered on UM FSKTM campus (lat: 3.1209, lng: 101.6559)
- Bundled `fsktm-floorplan.png` rendered using `MapView.Overlay` (bounding box coordinates covering the FSKTM building footprint)
- Dotted blue route line drawn with `Polyline` between mock coordinates
- Blue dot = user position, yellow pin = destination

**Floor selector (right sidebar):** Floors 3, 2, 1 as tappable buttons; zoom +/− buttons.

**Bottom sheet (fixed, not draggable for prototype):**
- Destination label: "TO AI LAB 01"
- Distance/time: "350m · 5 mins" (bold)
- Turn icon (right arrow in circle)
- Nearby chips: "Cafe (80m)" · "Restrooms (45m)"
- "Find Route" button (full-width, dark navy, diamond icon)

**Bottom tab bar:** active tab = Map (yellow highlight).

---

### 3. Search Screen (`SearchScreen.tsx`)

**Header:** "UM FSKTM Navigator" logo + profile icon.

**Search input:** Autofocused on entry, back arrow, mic icon.

**Filter chips (horizontal scroll):** All · Rooms · Labs · Staff · Facilities

**Results list** (`FlatList`):
- Each result: icon (room/person), name, type tag, block/room number, distance
- Staff results show avatar circle with initials, name, department, room
- Tap navigates to MapScreen with that destination pre-selected

**Empty state:** "No results for '...'" with a magnifying glass illustration.

---

### 4. Directory Screen (`DirectoryScreen.tsx`)

**Header:** "UM FSKTM Navigator" logo + profile icon.

**Section title:** "Faculty Directory"

**Filter chips:** All · Lecturers · Admin · Support

**Staff list** (`FlatList`, grouped by department):
- Department header row (bold, grey background)
- Staff card per person:
  - Avatar (initials circle, navy background)
  - Name (bold)
  - Title/role (grey)
  - Room number (pin icon)
  - Course name (book icon)
  - "Navigate" button (small, outline style) — tapping navigates to MapScreen with that staff member's room pre-selected as destination

---

## Data Model (`mockData.ts`)

```typescript
export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  room: string;
  course: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'lab' | 'hall' | 'office' | 'facility';
  block: string;
  floor: number;
  lat: number;
  lng: number;
  description: string;
}

export const STAFF: StaffMember[] = [ /* ~10 mock entries */ ];
export const LOCATIONS: Location[] = [ /* ~15 mock entries */ ];
```

---

## Theme (`theme.ts`)

```typescript
export const colors = {
  primary: '#1B3A6B',       // dark navy
  accent: '#F5C518',        // yellow (active tab)
  background: '#F4F6FA',    // light grey page bg
  card: '#FFFFFF',
  border: '#E8EDF5',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  chipBg: '#EEF2FF',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 12, lg: 20, full: 9999 };
```

---

## Key Constraints

- **Expo Go compatibility:** No native modules beyond what Expo includes. `react-native-maps` is pre-bundled in Expo Go.
- **No backend:** All data is hardcoded. No network calls, no auth.
- **No real routing engine:** Route line is a hardcoded mock `Polyline` between fixed coordinates.
- **iOS + Android:** StyleSheet must avoid platform-specific APIs. Use `Platform.OS` only for safe area insets.
- **TypeScript strict:** All components and data types fully typed.

---

## Out of Scope

- Real-time location tracking / turn-by-turn navigation
- User authentication / profile
- Push notifications for class reminders
- Actual indoor positioning system
- Backend API integration
