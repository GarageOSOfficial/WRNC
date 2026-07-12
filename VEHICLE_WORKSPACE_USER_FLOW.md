# Vehicle Workspace User Flow - v0.3

Complete user interaction flows from Mission Control through Vehicle Workspace and back.

---

## Table of Contents

1. [Primary User Flow](#primary-user-flow)
2. [Mission Control → Vehicle Workspace](#mission-control--vehicle-workspace)
3. [Vehicle Workspace → Overview Tab](#vehicle-workspace--overview-tab)
4. [Recent Activity → Full Timeline](#recent-activity--full-timeline)
5. [Return to Mission Control](#return-to-mission-control)
6. [Tab Navigation Flows](#tab-navigation-flows)
7. [Action Menu Flows](#action-menu-flows)
8. [Error & Loading Flows](#error--loading-flows)

---

## Primary User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Mission Control                                           │
│  (View all vehicles)                                       │
│           │                                                │
│           │ User taps on vehicle                           │
│           ▼                                                │
│  Vehicle Workspace Loads                                  │
│  (Overview Tab shown by default)                          │
│           │                                                │
│           ├─→ Review Recent Activities                    │
│           │   ├─→ Tap activity → View Full Timeline      │
│           │   │   ├─→ Browse all activities              │
│           │   │   ├─→ View activity detail (modal)       │
│           │   │   └─→ Return to Workspace                │
│           │   │                                           │
│           │   └─→ Swipe to refresh                        │
│           │                                                │
│           ├─→ Tap Photos Tab                              │
│           │   ├─→ View photo grid                         │
│           │   ├─→ Tap photo → Lightbox                   │
│           │   │   ├─→ View full photo                    │
│           │   │   ├─→ Swipe to next/prev photo           │
│           │   │   ├─→ View activity context              │
│           │   │   └─→ Close lightbox                      │
│           │   │                                           │
│           │   └─→ Return to Photos Tab                    │
│           │                                                │
│           ├─→ Tap About Tab                               │
│           │   ├─→ View vehicle details (read-only)       │
│           │   ├─→ (Optional) Edit vehicle name           │
│           │   │   ├─→ Tap Edit button                    │
│           │   │   ├─→ Modify details                      │
│           │   │   ├─→ Tap Save → Activity created        │
│           │   │   └─→ Return to About Tab                │
│           │   │                                           │
│           │   └─→ View ownership info                     │
│           │                                                │
│           ├─→ Tap Action Menu (header)                    │
│           │   ├─→ Edit Vehicle                            │
│           │   ├─→ Share Vehicle                           │
│           │   ├─→ Archive Vehicle                         │
│           │   └─→ Delete Vehicle                          │
│           │                                                │
│           └─→ Tap back / Mission Control link             │
│               └─→ Return to Mission Control               │
│                   (All data refreshed)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Mission Control → Vehicle Workspace

### User Initiates Workspace Entry

**Trigger:** User taps vehicle card on Mission Control

**Visual State (Mission Control):**
```
┌─────────────────────────────────────┐
│  Mission Control                    │
├─────────────────────────────────────┤
│                                     │
│  My Vehicles                        │
│  ┌─────────────────────────────┐   │
│  │ 2015 Chevelle              │   │
│  │ ┌─────────────────────────┐ │   │
│  │ │ Photo                   │ │   │
│  │ │                         │ │   │
│  │ │                         │ │   │
│  │ └─────────────────────────┘ │   │
│  │ Last: Oil change • 2h ago   │   │
│  │ Activities: 12 • Score: 72% │   │
│  └─────────────────────────────┘   │ ← User taps
│                                     │
│ [+ New Vehicle] [Settings]          │
└─────────────────────────────────────┘
```

### Transition to Vehicle Workspace

**Action Sequence:**
1. User taps vehicle card
2. Mission Control shows loading indicator (optional)
3. Browser navigates to `/vehicle/{vehicleId}`
4. VehicleWorkspaceContainer begins loading vehicle data

**Loading State (Vehicle Workspace):**
```
┌─────────────────────────────────────┐
│  2015 Chevelle      [⋯ Menu]        │
│  ████████░░ 72%                     │
├─────────────────────────────────────┤
│  📊 Overview  📸 Photos  ℹ About    │
├─────────────────────────────────────┤
│                                     │
│  Loading Activities...              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Skeleton 1
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Skeleton 2
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Skeleton 3
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Skeleton 4
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Skeleton 5
│                                     │
└─────────────────────────────────────┘
```

### Data Loading (Parallel)

**Timeline:**
```
T=0ms   ├─ Browser navigates to /vehicle/{vehicleId}
T=50ms  ├─ VehicleWorkspaceContainer mounted
T=100ms ├─ Verify auth, load route params
T=150ms ├─ useVehicle() query initiated ┐
T=150ms ├─ useRecentActivities() query  ├─ Parallel
T=150ms ├─ useVehicleStats() query       ┤
T=200ms ├─ usePhotos() query (lazy)      ┘
T=400ms ├─ Vehicle metadata arrives
T=450ms ├─ Recent activities arrive
T=500ms ├─ Vehicle stats calculated
T=550ms ├─ All data loaded, render Overview Tab
T=600ms └─ Photos subscribed (realtime updates)
```

### Completed Load State (Overview Tab)

**Visual State:**
```
┌─────────────────────────────────────┐
│  2015 Chevelle      [⋯ Menu]        │ ← Header loaded
│  ████████░░ 72%                     │
├─────────────────────────────────────┤
│  📊 Overview  📸 Photos  ℹ About    │ ← Tabs ready
├─────────────────────────────────────┤
│  RECENT ACTIVITIES                  │
│  ┌─────────────────────────────────┐│
│  │ [Photo]  | Oil Change           ││ ← Activity 1
│  │          | By: John Smith       ││
│  │          | 2 hours ago          ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [Photo]  | New Exhaust System   ││ ← Activity 2
│  │          | By: John Smith       ││
│  │          | 5 hours ago          ││
│  └─────────────────────────────────┘│
│  [More activities...]               │
│                                     │
│  QUICK STATS                        │
│  ┌────────────┬────────────────┐   │
│  │ 📊 12      │ 📸 28          │   │
│  │ Activities │ Photos         │   │
│  ├────────────┼────────────────┤   │
│  │ 🕐 2h ago  │ 📈 72%         │   │
│  │ Last       │ Documentation  │   │
│  └────────────┴────────────────┘   │
│                                     │
│  [📅 View Full Timeline]            │
└─────────────────────────────────────┘
```

**Key Points:**
- Header displays immediately (vehicle name, score)
- Skeleton placeholders shown while activities load
- Real-time subscriptions established
- Tab navigation ready
- Pull-to-refresh enabled

---

## Vehicle Workspace → Overview Tab

### Default View (Already Shown)

**Overview Tab is the default landing view** when Vehicle Workspace loads.

**Purpose:**
- Quick overview of vehicle status
- Recent activity snapshot
- Key metrics at a glance
- Gateway to deeper views (Timeline, Photos)

### Overview Tab Components

```
Header
├── Vehicle Name: "2015 Chevelle"
├── Documentation Score: "72%"
└── Action Menu: [⋯]

Tab Navigation
├── 📊 Overview (ACTIVE)
├── 📸 Photos
└── ℹ About

Content Area
├── RECENT ACTIVITIES
│   ├── ActivityItem 1 (newest)
│   ├── ActivityItem 2
│   ├── ActivityItem 3
│   ├── ActivityItem 4
│   └── ActivityItem 5 (oldest shown)
│
├── QUICK STATS
│   ├── Total Activities: 12
│   ├── Total Photos: 28
│   ├── Last Activity: "2 hours ago"
│   └── Score: 72%
│
└── CTA
    └── [📅 View Full Timeline]

Footer
├── [+ New Activity]
└── [📅 Timeline]
```

### User Interactions in Overview

**Scenario 1: User taps on recent activity**

```
User Action:
  Tap on "Oil Change" activity item

System Response:
  1. Record tap interaction
  2. Navigate to /vehicle/{vehicleId}/timeline
  3. Load full Timeline screen
  4. Highlight tapped activity
  5. Optionally scroll to activity in view

Result:
  Timeline screen loads with:
  - All activities in chronological order
  - Tapped activity highlighted/expanded
  - Ability to view full activity details
  - Ability to view related photos
```

**Scenario 2: User pulls to refresh**

```
User Action:
  Pull down on activity list (mobile)

System Response:
  1. Show refresh spinner
  2. Invalidate React Query caches:
     - useRecentActivities
     - useVehicleStats
     - usePhotos
  3. Refetch all queries
  4. Animate refresh spinner

Visual State:
  ┌─────────────────────────────────┐
  │  ↓ Pull to refresh...           │
  │  (or: Release to refresh)       │
  │  (or: Refreshing...)            │
  ├─────────────────────────────────┤
  │  [Spinner] Loading...           │
  │  ┌─────────────────────────────┐│
  │  │ Activity 1                  ││
  │  │ Activity 2                  ││
  │  │ Activity 3 (faded)          ││
  │  └─────────────────────────────┘│

  Result:
  New activities appear, scores updated
  Spinner disappears (animation)
```

**Scenario 3: User taps "View Full Timeline"**

```
User Action:
  Tap [📅 View Full Timeline] button

System Response:
  1. Navigate to /vehicle/{vehicleId}/timeline
  2. Load full Timeline view
  3. Display all activities (paginated)
  4. No specific highlight (unlike tapping single activity)

Result:
  Timeline screen opens, ready to explore full history
```

**Scenario 4: User taps Quick Stats**

```
User Action:
  Tap on Quick Stats card (optional interaction)

System Behavior (if interactive):
  Option A: Show stat breakdown
    - Activities by type
    - Photos breakdown
    - Timeline view filtered
  
  Option B: Navigate to relevant tab
    - Tap photos stat → Go to Photos Tab
    - Tap activities stat → Go to Timeline
  
  Option C: No interaction (display-only)
    - Stats are informational only
    - No direct actions
```

---

## Recent Activity → Full Timeline

### Navigation Transition

**Route Change:**
```
From: /vehicle/{vehicleId}  (Overview Tab)
To:   /vehicle/{vehicleId}/timeline
```

**Data Transition:**
```
Overview (Limited Data):
├── Recent activities (10)
├── Photos (lazy loaded)
└── Stats (derived)

Timeline (Full Data):
├── All activities (paginated)
├── Activity details expandable
├── Photos associated with activities
└── Filters (optional)
```

### Timeline Screen Layout

```
┌─────────────────────────────────────┐
│  < Back | 2015 Chevelle            │ ← Back navigation
├─────────────────────────────────────┤
│  All Activities (12)                │
│  ┌─────────────────────────────────┐│
│  │ Jul 12 • Oil Change             ││ ← Activity 1
│  │ ┌─────────────────────────────┐ ││
│  │ │ [Photo]                     │ ││
│  │ │                             │ ││
│  │ └─────────────────────────────┘ ││
│  │ Changed oil, replaced filter... ││
│  │ By: John Smith                  ││
│  │ 🔧 Maintenance                  ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Jul 10 • New Exhaust System     ││ ← Activity 2
│  │ ┌─────────────────────────────┐ ││
│  │ │ [Photo]                     │ ││
│  │ │                             │ ││
│  │ └─────────────────────────────┘ ││
│  │ Installed custom exhaust...     ││
│  │ By: John Smith                  ││
│  │ ⚙ Modification                  ││
│  └─────────────────────────────────┘│
│  [More activities...]               │
│                                     │
│  [Load More]  or  [Infinite Scroll] │
└─────────────────────────────────────┘
```

### User Interactions in Timeline

**Scenario 1: User taps activity for details**

```
User Action:
  Tap on activity item in Timeline

System Response:
  Option A: Expand inline
    ├── Show full description
    ├── Show all photos
    ├── Show all metadata
    └── Collapse other activities
  
  Option B: Open modal
    ├── Full-screen activity detail
    ├── All photos in lightbox
    ├── Activity edit options (if owner)
    └── Close button to return

Visual State (Expanded):
  ┌─────────────────────────────────┐
  │ Jul 12 • Oil Change             │
  │ ┌─────────────────────────────┐ │
  │ │ [Photo 1]  [Photo 2]        │ │
  │ │ [Photo 3]  [Photo 4]        │ │
  │ └─────────────────────────────┘ │
  │                                 │
  │ Description: Changed oil,       │
  │ replaced filter, inspected      │
  │ suspension components...        │
  │                                 │
  │ By: John Smith                  │
  │ Category: 🔧 Maintenance       │
  │ Tags: #oil #maintenance         │
  │ Jul 12, 2:30 PM                 │
  │                                 │
  │ [Edit] [Archive] [Share]        │
  └─────────────────────────────────┘
```

**Scenario 2: User scrolls through timeline**

```
User Action:
  Scroll up/down in activity list

System Behavior:
  ├── Lazy load photos as scrolling
  ├── Pagination: fetch next batch when near end
  ├── Maintain scroll position on data update
  └── Show loading indicator for new batch

Loading More:
  Scroll to bottom
  └─> "Loading..." indicator appears
      └─> New activities fetched
          └─> Smooth scroll append
```

**Scenario 3: User opens photo from activity**

```
User Action:
  Tap on photo in activity item

System Response:
  1. Open PhotoLightbox
  2. Load full-resolution photo
  3. Disable background scroll
  4. Show activity context
  5. Enable photo navigation

Lightbox State:
  ┌─────────────────────────────────┐
  │  < | [Full Photo Display] | >   │
  │  ┌─────────────────────────────┐│
  │  │                             ││
  │  │       [Full Photo]          ││
  │  │                             ││
  │  │                             ││
  │  └─────────────────────────────┘│
  │                                 │
  │  Photo 1 of 4                   │
  │  Oil Change - Jul 12, 2:30 PM   │
  │  Changed oil, replaced filter   │
  │                                 │
  │  [X] Close                      │
  └─────────────────────────────────┘
```

**Scenario 4: User swipes to navigate photos**

```
User Action:
  Swipe left in lightbox (mobile)

System Response:
  1. Detect swipe gesture
  2. Load next photo
  3. Animate transition (slide)
  4. Update context (timestamp, description)
  5. Update counter ("Photo 2 of 4")

Animation:
  Current Photo:  [###########]
                      ↓ swipe left
  Next Photo:          [###########]
  
  Result:
  Photo index increments
  Context updates
  Navigation arrows update
```

---

## Return to Mission Control

### Navigation Back

**Trigger Options:**

1. **Back Button (Header)**
   ```
   User taps: < Back
   Route: /vehicle/{vehicleId}/timeline → /mission-control
   ```

2. **Back Gesture (Mobile)**
   ```
   User swipes: Right edge swipe
   Route: Current → Previous
   ```

3. **Mission Control Link (Footer)**
   ```
   User taps: [Home] or [Mission Control]
   Route: Any → /mission-control
   ```

### Data Refresh Before Return

**Before returning to Mission Control:**

```
1. Invalidate Mission Control caches
   ├── useVehicles() - list of all vehicles
   ├── useVehicleStats() - for each vehicle
   └── useRecentActivities() - for each vehicle

2. Prepare fresh data
   ├── Fetch updated vehicle list
   ├── Calculate updated stats
   └── Load recent activities per vehicle

3. Transition
   ├── Navigate to /mission-control
   ├── Show fresh vehicle cards
   └── Display updated metrics
```

### Returned Mission Control State

**Visual State (Back on Mission Control):**
```
┌─────────────────────────────────────┐
│  Mission Control                    │
├─────────────────────────────────────┤
│  My Vehicles                        │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 2015 Chevelle                   ││ ← Updated
│  │ ┌─────────────────────────────┐ ││
│  │ │ [Latest Photo]              │ ││
│  │ │                             │ ││
│  │ └─────────────────────────────┘ ││
│  │ Last: Oil change • Just now ✓   ││ ← Timestamp updated
│  │ Activities: 12 • Score: 74%     ││ ← Score updated
│  └─────────────────────────────────┘│
│                                     │
│  [+ New Vehicle] [Settings]         │
└─────────────────────────────────────┘
```

**Key Points:**
- Vehicle metrics are updated
- Latest activity shown
- Recent activity timestamp reflects new entries
- Score may have changed based on new activities
- All changes visible immediately

---

## Tab Navigation Flows

### Overview → Photos Tab

```
User Action:
  Tap [📸 Photos] tab

Transition:
  1. Verify photos data loaded
  2. Fade/slide to Photos tab
  3. Show photo grid (or skeleton)
  4. Initialize lightbox state

Result:
  Photos Tab active, grid visible, ready for interaction
```

### Photos → About Tab

```
User Action:
  Tap [ℹ About] tab

Transition:
  1. Verify vehicle data loaded
  2. Fade/slide to About tab
  3. Display vehicle details (read-only)
  4. Show ownership info

Result:
  About Tab active, showing vehicle metadata
```

### About → Overview Tab (Via Swipe)

```
User Action:
  Swipe right on About tab (mobile)

Transition:
  1. Detect swipe gesture
  2. Slide About tab to right
  3. Slide Photos tab from left
  4. Animate smooth transition

Result:
  Photos tab now active (middle), Overview on left
```

### Tab Switching on Desktop

```
User Action:
  Click [📊 Overview] tab

Transition:
  1. Highlight clicked tab
  2. Fade out current content
  3. Fade in Overview content
  4. Smooth 300ms animation

Result:
  Overview tab active, content displayed
```

---

## Action Menu Flows

### Edit Vehicle Details

```
User Action:
  Tap [⋯ Menu] → [Edit Vehicle]

System Response:
  1. Open EditVehicleModal
  2. Load current vehicle data
  3. Enable form fields for editing

Modal State:
  ┌─────────────────────────────────┐
  │  Edit Vehicle                   │
  ├─────────────────────────────────┤
  │  Name:           [My Chevelle] │ │ ← Editable
  │  Year:           [2015       ] │ │
  │  Make:           [Chevrolet  ] │ │
  │  Model:          [Chevelle   ] │ │
  │                                 │
  │  [Cancel]  [Save]              │
  └─────────────────────────────────┘

User edits and taps Save:
  1. Validate inputs
  2. Submit mutation
  3. Create Activity record
  4. Update vehicle data
  5. Close modal
  6. Show success toast

Result:
  Vehicle name changed
  Activity created
  Modal closed
  Return to Workspace
```

### Archive Vehicle

```
User Action:
  Tap [⋯ Menu] → [Archive Vehicle]

System Response:
  1. Open ArchiveVehicleModal
  2. Show warning message

Modal State:
  ┌─────────────────────────────────┐
  │  ⚠ Archive Vehicle?             │
  ├─────────────────────────────────┤
  │  You're about to archive this   │
  │  vehicle. It will be hidden     │
  │  from your garage but can be    │
  │  restored later.                │
  │                                 │
  │  2015 Chevelle                  │
  │                                 │
  │  [Cancel]  [Archive]            │
  └─────────────────────────────────┘

User confirms:
  1. Submit archiveVehicle mutation
  2. Update vehicle status
  3. Create Activity (vehicle archived)
  4. Close modal
  5. Navigate to Mission Control
  6. Show success message

Result:
  Vehicle archived
  Removed from main garage view
  Can be restored from archive section
```

---

## Error & Loading Flows

### Network Error During Load

```
Scenario:
  Vehicle Workspace tries to load but network fails

System Response:
  1. Activities query fails
  2. Catch error in component
  3. Continue loading other data
  4. Show error state in OverviewTab

Error State:
  ┌─────────────────────────────────┐
  │  2015 Chevelle      [⋯ Menu]    │
  │  ████████░░ 72%                 │
  ├─────────────────────────────────┤
  │  📊 Overview  📸 Photos  ℹ About│
  ├─────────────────────────────────┤
  │                                 │
  │  ⚠ Failed to Load Activities   │
  │                                 │
  │  Check your connection and      │
  │  try again.                     │
  │                                 │
  │  [Retry] [Try Photos]           │
  │                                 │
  └─────────────────────────────────┘

User Action:
  Tap [Retry] button

System Response:
  1. Invalidate activities query
  2. Refetch data
  3. Show skeleton loaders
  4. On success, display activities
  5. On error, show error again
```

### Vehicle Not Found

```
Scenario:
  User accesses /vehicle/invalid-id

System Response:
  1. VehicleWorkspaceContainer validates ID
  2. useVehicle() query fails with 404
  3. Detect "not found" error
  4. Navigate to Mission Control
  5. Show notification

Notification:
  ┌─────────────────────────────────┐
  │  ❌ Vehicle not found            │
  │                                 │
  │  This vehicle doesn't exist     │
  │  or has been archived.          │
  │                                 │
  │  [Return to Mission Control]    │
  └─────────────────────────────────┘

Result:
  User redirected to Mission Control
  Error notification displayed briefly
  User can return to vehicle list
```

### Loading Performance (Slow Network)

```
Scenario:
  User on slow 3G connection

Timeline:
  T=0ms    ├─ Route to /vehicle/{id}
  T=100ms  ├─ Show header (cached or instant)
  T=200ms  ├─ Show skeleton loaders
  T=1000ms ├─ Vehicle metadata arrives → Update header
  T=1200ms ├─ Activities arrive → Start showing items
  T=1500ms ├─ Photos metadata arrives → Lazy load images
  T=2000ms └─ All data loaded, animations complete

User Experience:
  1. Fast header appearance (reassuring)
  2. Progressive content loading
  3. Smooth skeleton → real content transitions
  4. No blank white screens
  5. Responsive to user interactions at each stage
```

---

Last updated: 2024
Version: 1.0.0 - User Flow Design