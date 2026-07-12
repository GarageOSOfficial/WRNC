# Vehicle Workspace Architecture - v0.3

Complete system design for the Vehicle Workspace, establishing it as the center of the Garage OS application.

## Table of Contents

1. [Overview](#overview)
2. [Component Hierarchy](#component-hierarchy)
3. [Data Flow](#data-flow)
4. [React Query Integration](#react-query-integration)
5. [Activity Integration](#activity-integration)
6. [Navigation Architecture](#navigation-architecture)
7. [State Management](#state-management)
8. [Loading States](#loading-states)
9. [Empty States](#empty-states)
10. [Error Handling](#error-handling)

---

## Overview

### Purpose

The Vehicle Workspace is the primary working environment where builders manage a single vehicle. It is launched from Mission Control and serves as the hub for all vehicle-related activities, documentation, and progress tracking.

### Key Principles Applied

- **Builders Before Developers**: Focus on builder productivity and minimal friction
- **Less Typing. More Building.**: Optimize for quick interactions, not data entry
- **Photos Are the Hero.**: Photo display and management are prominent
- **Activities Are the Single Source of Truth**: All workspace data derives from Activities
- **Mobile First**: Primary experience designed for touch and mobile constraints
- **Native Feeling**: Smooth transitions, responsive interactions, platform conventions

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│         Vehicle Workspace Container             │
│  (Router, Auth, Loading, Error boundaries)      │
├─────────────────────────────────────────────────┤
│         Vehicle Workspace Layout                │
│  (Header, Tab Navigation, Footer)               │
├─────────────────────────────────────────────────┤
│    Tab Containers (Overview/Photos/About)       │
│  (Each manages its own queries and state)       │
├─────────────────────────────────────────────────┤
│      Data & Presentation Components             │
│  (Activity lists, photos, vehicle info)         │
├─────────────────────────────────────────────────┤
│      React Query / Supabase Data Layer          │
│  (Queries, mutations, subscriptions)            │
└─────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Root Level

```
VehicleWorkspaceContainer
├── VehicleWorkspaceLayout
│   ├── WorkspaceHeader
│   │   ├── VehicleIdentifier
│   │   ├── DocumentationScore
│   │   └── ActionMenu
│   ├── TabNavigation
│   ├── TabContent
│   │   ├── OverviewTab
│   │   ├── PhotosTab
│   │   └── AboutTab
│   └── WorkspaceFooter
└── Providers
    ├── QueryClientProvider
    ├── AuthProvider
    └── ErrorBoundary
```

### Component Details

#### **VehicleWorkspaceContainer**
- **Purpose**: Entry point for Vehicle Workspace
- **Responsibilities**:
  - Verify user authentication
  - Load vehicle ID from route params
  - Initialize error boundary
  - Set up query providers
  - Handle redirect to Mission Control if vehicle not found
- **Data Dependencies**:
  - Current user (auth)
  - Vehicle ID (route params)
  - Vehicle metadata (React Query)

#### **VehicleWorkspaceLayout**
- **Purpose**: Main layout structure and tab management
- **Responsibilities**:
  - Manage active tab state
  - Coordinate header, navigation, and content areas
  - Handle responsive breakpoints
  - Manage workspace-level loading and error states
- **Children**:
  - WorkspaceHeader
  - TabNavigation
  - TabContent (dynamic based on active tab)
  - WorkspaceFooter

#### **WorkspaceHeader**
- **Purpose**: Vehicle identification and quick actions
- **Responsibilities**:
  - Display vehicle name and year/make/model (from About tab data)
  - Show Documentation Score
  - Provide action menu (edit, share, archive, delete)
  - Display user initials/avatar
- **Data Dependencies**:
  - Vehicle details (name, year, make, model)
  - Documentation score
  - Current user

#### **VehicleIdentifier**
- **Purpose**: Display vehicle name and summary
- **Inputs**:
  - Vehicle name (string)
  - Vehicle year/make/model (string or object)
- **Outputs**:
  - Rendered vehicle identity
- **Styling**: Large, prominent, primary focus of header

#### **DocumentationScore**
- **Purpose**: Visual representation of documentation completeness
- **Inputs**:
  - Score (0-100)
  - Activities count
  - Photos count
- **Outputs**:
  - Score percentage display
  - Progress indicator
- **Calculation**: Derived from Activity data (immutable records present)

#### **ActionMenu**
- **Purpose**: Vehicle-level actions
- **Options**:
  - Edit vehicle details
  - Share vehicle workspace
  - Archive vehicle
  - Delete vehicle (archives, never actually deletes)
- **Triggers**: Modal dialogs for each action

#### **TabNavigation**
- **Purpose**: Tab switching interface
- **Tabs**:
  - Overview (Recent Activities, quick stats)
  - Photos (Photo gallery view)
  - About (Vehicle details and metadata)
- **Interactions**:
  - Swipe left/right (mobile)
  - Tap to switch (mobile/desktop)
  - Keyboard navigation (desktop)
- **Active state**: Visual indicator on current tab

#### **OverviewTab**
- **Purpose**: Dashboard view of vehicle workspace
- **Components**:
  - RecentActivityList
  - QuickStats
  - CTA to View Full Timeline
- **Data Sources**:
  - Activities (last 5-10)
  - Vehicle statistics
- **Interactions**:
  - Tap activity to navigate to Timeline
  - Pull to refresh

#### **RecentActivityList**
- **Purpose**: Display recent activities with photos
- **Responsibilities**:
  - Render activity items in reverse chronological order (newest first)
  - Show activity type, photo, description, timestamp
  - Provide tap target to view full activity
  - Handle loading and empty states
- **Data**:
  - Activities array (filtered to recent)
  - Associated photos
  - User information (who performed activity)
- **Interactions**:
  - Tap activity → Navigate to Timeline with activity highlighted
  - Pull to refresh → Invalidate activity query

#### **QuickStats**
- **Purpose**: High-level vehicle statistics
- **Data Displayed**:
  - Total activities count
  - Total photos count
  - Last activity timestamp
  - Documentation score
- **Visual**: Card layout with icons and numbers
- **Data Source**: Derived from Activities (single source of truth)

#### **PhotosTab**
- **Purpose**: Photo-centric view of vehicle history
- **Components**:
  - PhotoGrid
  - PhotoLightbox
  - PhotoTimeline
- **Data Sources**:
  - Activities with photos
  - Photo metadata
- **Interactions**:
  - Tap photo → Open lightbox
  - Swipe left/right in lightbox (desktop)
  - Pinch to zoom (mobile)

#### **PhotoGrid**
- **Purpose**: Display photos in masonry/grid layout
- **Responsibilities**:
  - Render photos from Activities
  - Optimize image loading (lazy load, thumbnails)
  - Maintain aspect ratio
  - Show activity date on each photo
- **Data**:
  - Photos from Activities
  - Thumbnail URLs
- **Interactions**:
  - Tap to open lightbox

#### **PhotoLightbox**
- **Purpose**: Full-screen photo viewing
- **Responsibilities**:
  - Display photo at full resolution
  - Show activity context (description, timestamp, activity type)
  - Navigate between photos
  - Close and return to grid
- **Interactions**:
  - Swipe left/right → Next/previous photo
  - Tap outside → Close lightbox
  - Double-tap → Zoom

#### **AboutTab**
- **Purpose**: Vehicle details and metadata
- **Components**:
  - VehicleDetailsForm (read-only display, edit mode optional)
  - OwnershipInfo
  - VehicleMetadata
- **Data Sources**:
  - Vehicle entity from database
  - Owner information
- **Edit Mode**:
  - Toggle to edit selected fields
  - Submit changes (creates Activity)
  - Cancel to return to read-only

#### **VehicleDetailsForm**
- **Purpose**: Display and optionally edit vehicle information
- **Fields** (read-only display):
  - Name
  - Year / Make / Model
  - VIN (if available)
  - Color (if available)
  - License plate (if available)
  - Notes/Description
- **Edit Mode**:
  - Allow editing of selected fields
  - Validation
  - Submit creates Activity record
- **Responsibilities**:
  - Display current vehicle data
  - Manage edit state
  - Validate inputs
  - Submit mutations

#### **OwnershipInfo**
- **Purpose**: Display owner and garage information
- **Data**:
  - Owner name
  - Owner email
  - Garage (if applicable)
  - Created date
- **Read-only display**

#### **WorkspaceFooter**
- **Purpose**: Bottom navigation and additional actions
- **Elements** (mobile):
  - CTA to create new Activity
  - Access to full Timeline
  - Vehicle settings
- **Elements** (desktop):
  - Optional, minimal or hidden
- **Actions**:
  - "New Activity" → Navigate to Activity creation flow
  - "View Timeline" → Navigate to full Timeline screen

---

## Data Flow

### Top-Level Data Architecture

```
┌─────────────────────────────────────────────────┐
│         User initiates Vehicle Workspace        │
│         (Via Mission Control → vehicle select)  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│    VehicleWorkspaceContainer loads Vehicle ID   │
│    Initializes route params and auth            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│   React Query: useVehicle(vehicleId)            │
│   - Fetch vehicle metadata                      │
│   - Cache vehicle data                          │
│   - Subscribe to real-time updates              │
└────────────────┬────────────────────────────────┘
                 │
      ┌──────────┴──────────────────┐
      │                             │
      ▼                             ▼
  ┌────────────┐          ┌──────────────────┐
  │  Vehicle  │          │  Recent Activities│
  │  Metadata │          │  Query            │
  │  Query    │          │  (limit 10)       │
  └────────────┘          └──────────────────┘
      │                            │
      └──────────────┬─────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │   VehicleWorkspaceLayout  │
        │   (Render with data)      │
        └───────────────────────────┘
```

### Per-Tab Data Flow

#### **Overview Tab**
```
Overview Tab Activated
         │
         ▼
useRecentActivities(vehicleId, limit: 10)
         │
    ┌────┴───────┐
    │             │
    ▼             ▼
Activities    Photos
Query         Query (from Activities)
    │             │
    └────┬────────┘
         │
         ▼
RecentActivityList
Renders with activity items + photos
```

#### **Photos Tab**
```
Photos Tab Activated
         │
         ▼
useActivitiesWithPhotos(vehicleId)
         │
         ▼
Filter activities that have photos
         │
         ▼
PhotoGrid
Renders masonry layout of photos
with thumbnail optimization
```

#### **About Tab**
```
About Tab Activated
         │
         ▼
useVehicle(vehicleId) [already loaded]
         │
         ▼
VehicleDetailsForm (read-only)
Display vehicle metadata
         │
    ┌────┴───────┐
    │             │
    ▼             ▼
 Edit          View
  Mode         Mode
    │             │
    ▼             ▼
Mutation      Static
Submit        Display
```

### Real-Time Updates

```
Activity Created/Updated
         │
    ┌────┴─────────┐
    │              │
    ▼              ▼
Supabase       React Query
Realtime       Invalidates:
Event          - Activities
    │          - Photos
    ▼          - Stats
Auto-           │
Refresh         ▼
Components   Queries
Refetch
```

---

## React Query Integration

### Query Hooks Architecture

```typescript
// Vehicle Queries
useVehicle(vehicleId)
  → /vehicles/{vehicleId}
  → Cache key: ['vehicles', vehicleId]
  → Stale time: 5 minutes
  → Subscribe to updates

useVehicleStats(vehicleId)
  → Computed from Activities
  → Cache key: ['vehicles', vehicleId, 'stats']
  → Stale time: 1 minute
  → Invalidate on Activity change

// Activity Queries
useRecentActivities(vehicleId, limit)
  → /activities?vehicleId={id}&limit={n}
  → Cache key: ['activities', vehicleId, limit]
  → Stale time: 30 seconds
  → Real-time subscription

useActivitiesWithPhotos(vehicleId)
  → /activities?vehicleId={id}&hasPhotos=true
  → Cache key: ['activities', vehicleId, 'photos']
  → Stale time: 1 minute
  → Include photo metadata

// Photo Queries
usePhotos(vehicleId)
  → /photos?vehicleId={id}
  → Cache key: ['photos', vehicleId]
  → Stale time: 5 minutes
  → Includes signed URLs
```

### Mutation Hooks Architecture

```typescript
// Vehicle Mutations
useUpdateVehicle()
  → PATCH /vehicles/{id}
  → Invalidates: ['vehicles', vehicleId]
  → Creates Activity record on success

useArchiveVehicle()
  → POST /vehicles/{id}/archive
  → Invalidates: ['vehicles', vehicleId]
  → Redirects to Mission Control

// Activity Mutations
useCreateActivity()
  → POST /activities
  → Invalidates: 
    - ['activities', vehicleId]
    - ['vehicles', vehicleId, 'stats']
  → Handles photo upload

useArchiveActivity()
  → POST /activities/{id}/archive
  → Invalidates: ['activities', vehicleId]
```

### Query Synchronization

**Sequential Data Load:**
1. Load vehicle metadata (required)
2. Load recent activities (parallel)
3. Load photos (parallel)
4. Derive statistics (computed)

**Invalidation Strategy:**
- Activity changes → Invalidate activities, photos, stats
- Vehicle changes → Invalidate vehicle, stats
- Photo uploads → Invalidate photos, stats

**Subscription Strategy:**
- Vehicle changes → Real-time subscription
- Activities → Real-time subscription
- Photos → Real-time subscription

---

## Activity Integration

### Activities as Source of Truth

Every piece of data displayed in Vehicle Workspace derives from Activities or is accompanied by Activity records.

```
┌──────────────────────────────────────┐
│  Activity Record (Immutable)         │
├──────────────────────────────────────┤
│ • What: Description of work          │
│ • When: Timestamp                    │
│ • Who: User who performed work       │
│ • Photos: Attached evidence          │
│ • Metadata: Tagged data              │
│ • Status: Active/Archived            │
└──────────────────────────────────────┘
         │
         ├─→ RecentActivityList (Overview)
         ├─→ PhotoGrid (Photos Tab)
         ├─→ Statistics (QuickStats)
         └─→ Timeline (Full view)
```

### Activity Display Components

#### **ActivityItem**
- **Displays**:
  - Activity type icon
  - Primary photo (hero image)
  - Activity description
  - Timestamp (relative, e.g., "2 hours ago")
  - User who performed activity
- **Interactions**:
  - Tap → Navigate to Timeline with activity highlighted
  - Long press → Activity options menu (archive, edit)

#### **ActivityPhoto**
- **Purpose**: Hero image for each activity
- **Optimization**:
  - Lazy load
  - Serve thumbnail for list view
  - Serve full resolution in lightbox
  - CDN caching

#### **ActivityMetadata**
- **Displays**:
  - Activity type/category
  - Additional tags or categorization
  - Related items (parts, records, etc.)
- **Data**: From Activity record

### Documentation Score Calculation

```
Score = (Activity Quality Metrics) / (Total Possible Points) × 100

Components:
├── Activity Count (30 points max)
│   └── 10+ activities = full 30 points
├── Photo Documentation (40 points max)
│   └── % of activities with photos
├── Description Completeness (20 points max)
│   └── Description length/detail
└── Recency (10 points max)
    └── Recent activity bonuses
```

All derived from Activities (single source of truth).

---

## Navigation Architecture

### Navigation Model

```
Mission Control
      │
      ▼
Vehicle Workspace
      │
      ├─→ Overview Tab (default)
      ├─→ Photos Tab
      ├─→ About Tab
      │
      ├─→ Timeline (separate screen)
      │   ├─→ Activity Detail (modal)
      │   └─→ Return to Workspace
      │
      ├─→ Activity Creation Flow
      │   ├─→ Photo Upload
      │   ├─→ Description
      │   ├─→ Create Activity
      │   └─→ Return to Workspace
      │
      └─→ Return to Mission Control
```

### Route Structure

```
/mission-control
  └── /vehicle/:vehicleId
      ├── /vehicle/:vehicleId (default → Overview)
      ├── /vehicle/:vehicleId?tab=overview
      ├── /vehicle/:vehicleId?tab=photos
      ├── /vehicle/:vehicleId?tab=about
      ├── /vehicle/:vehicleId/timeline
      │   └── /vehicle/:vehicleId/timeline?activity=:activityId
      ├── /vehicle/:vehicleId/activity/new
      └── /vehicle/:vehicleId/settings
```

### Navigation Patterns

**Mobile:**
- Swipe left/right → Tab switching
- Bottom navigation or tab bar
- Slide animation between tabs
- Back button → Mission Control

**Desktop:**
- Click tabs to switch
- Sidebar or top nav
- Smooth fade/slide transition
- Back link in header

**Responsive Breakpoints:**
- Mobile: < 768px → Swipe, bottom nav
- Tablet: 768px - 1024px → Tab bar with horizontal scroll
- Desktop: > 1024px → Tab bar or sidebar

---

## State Management

### Component State

**VehicleWorkspaceLayout:**
- `activeTab` (state: 'overview' | 'photos' | 'about')
- `isLoading` (derived from query states)
- `error` (derived from query errors)

**OverviewTab:**
- `isRefreshing` (for pull-to-refresh)
- `expandedActivityId` (optional, for expanded view)

**PhotosTab:**
- `selectedPhotoIndex` (for lightbox)
- `lightboxOpen` (state: boolean)
- `lightboxPhotoIds` (array of photo IDs in view order)

**AboutTab:**
- `isEditMode` (state: boolean)
- `editFormValues` (temporary form state while editing)
- `isSubmitting` (during mutation)

### Global Context (if needed)

**VehicleWorkspaceContext**
- `vehicleId` (current vehicle ID)
- `vehicle` (vehicle metadata)
- `userPermissions` (can user edit/delete?)
- `isOwner` (is current user the vehicle owner?)

---

## Loading States

### Initial Load

```
VehicleWorkspaceContainer loads
         │
    ┌────┴──────────┐
    │               │
    ▼               ▼
Vehicle       Recent Activities
Query         Query
Loading       Loading
    │               │
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │               │
    ▼               ▼
Complete:   Still Loading:
Show        Show skeleton
Data        placeholder
```

### Skeleton UI Components

**Header Skeleton:**
- Vehicle name placeholder (shimmer)
- Score placeholder (shimmer)

**OverviewTab Skeleton:**
- RecentActivityList with 5 activity item skeletons
- Each item: photo placeholder + title + description + timestamp

**PhotosTab Skeleton:**
- Photo grid with 6-9 photo placeholder tiles
- Each tile: aspect ratio maintained, shimmer effect

**AboutTab Skeleton:**
- Vehicle details fields with text placeholders
- Each field: label + value placeholder

### Loading UX Patterns

1. **Optimistic Loading**: Show last-cached data while refreshing
2. **Progressive Loading**: Load critical path first (vehicle metadata), then details
3. **Skeleton States**: Use skeleton screens, not spinners (mobile first)
4. **Lazy Loading**: Load photos on scroll, images on demand

---

## Empty States

### No Activities Yet

```
┌──────────────────────────────────┐
│   [Camera Icon]                  │
│                                  │
│   No Activities Yet              │
│                                  │
│   Start documenting your build   │
│   with photos and descriptions.  │
│                                  │
│   [+ New Activity] button        │
└──────────────────────────────────┘
```

**Components:**
- Illustration/icon
- Headline: "No Activities Yet"
- Subtext: "Start documenting..."
- CTA button: "+ New Activity"

**Applied in:**
- OverviewTab: Recent activities list
- PhotosTab: Photo grid
- Timeline: Activity list

### No Photos

```
┌──────────────────────────────────┐
│   [Photo Icon]                   │
│                                  │
│   No Photos Shared Yet           │
│                                  │
│   Add photos to activities to    │
│   build your visual history.     │
│                                  │
│   [View Activities] button       │
└──────────────────────────────────┘
```

**Applied in:**
- PhotosTab: When filtering activities with photos

### Empty Filter Results

```
┌──────────────────────────────────┐
│   [Search Icon]                  │
│                                  │
│   No Results Found               │
│                                  │
│   Try different search terms     │
│   or clear your filters.         │
│                                  │
│   [Clear Filters] button         │
└──────────────────────────────────┘
```

**Applied in:**
- Any filtered views (future)

---

## Error Handling

### Error Types & Handling

#### **Network Errors**

**Scenario**: Vehicle workspace fails to load due to network

```
┌──────────────────────────────────┐
│   ⚠ Connection Error             │
│                                  │
│   Unable to load vehicle.        │
│   Check your connection and      │
│   try again.                     │
│                                  │
│   [Retry] [Back to Mission      │
│            Control]              │
└──────────────────────────────────┘
```

**Handling:**
- Display error banner
- Provide retry button
- Disable tab switching
- Show offline indicator
- Automatic retry after 10 seconds (optional)

#### **Authentication Errors**

**Scenario**: Session expired or user not authorized

```
┌──────────────────────────────────┐
│   🔒 Access Denied               │
│                                  │
│   You don't have permission to   │
│   access this vehicle.           │
│                                  │
│   [Return to Mission Control]    │
└──────────────────────────────────┘
```

**Handling:**
- Redirect to login if session expired
- Show access denied if user doesn't have permission
- Prevent navigation to workspace

#### **Vehicle Not Found**

**Scenario**: Vehicle ID in URL doesn't exist

```
┌──────────────────────────────────┐
│   🚗 Vehicle Not Found           │
│                                  │
│   This vehicle doesn't exist or  │
│   has been archived.             │
│                                  │
│   [Return to Mission Control]    │
└──────────────────────────────────┘
```

**Handling:**
- Check vehicle exists in database
- Redirect to Mission Control
- Show notification: "Vehicle not found"

#### **Query Errors**

**Scenario**: Activity or photo query fails

```
Component-Level Error:
- Show error state specific to that component
- Provide retry button
- Don't block other tabs/components
- Log error for debugging

Example (Photos Tab):
┌──────────────────────────────────┐
│   ⚠ Failed to Load Photos        │
│                                  │
│   We encountered an error        │
│   loading photos.                │
│                                  │
│   [Retry] [Try Overview]         │
└──────────────────────────────────┘
```

**Handling:**
- Display error message
- Provide retry option
- Suggest alternative view
- Don't crash entire workspace

#### **Mutation Errors**

**Scenario**: Vehicle update fails

```
Error Toast (Bottom of screen):
┌────────────────────────────────────────┐
│ ❌ Failed to update vehicle details    │
│ Retry | Dismiss                        │
└────────────────────────────────────────┘
```

**Handling:**
- Show error toast
- Keep edit mode active (preserve user input)
- Provide retry button
- Log error for debugging

### Error Boundary

**VehicleWorkspaceErrorBoundary:**
- Catches React rendering errors
- Displays fallback UI
- Provides reset button
- Logs error to monitoring service
- Doesn't navigate away (preserve user context)

```
┌──────────────────────────────────┐
│   😅 Something Went Wrong        │
│                                  │
│   We encountered an unexpected   │
│   error. Please try again.       │
│                                  │
│   [Reload] [Back to Mission     │
│            Control]              │
└──────────────────────────────────┘
```

### Error Recovery Strategies

1. **Optimistic Error Recovery**: Cache last good state, revert on error
2. **Retry with Backoff**: Exponential backoff for transient errors
3. **Fallback Content**: Show cached data while attempting retry
4. **User Notification**: Toast messages for non-blocking errors
5. **Graceful Degradation**: Some features unavailable but workspace usable

---

## Performance Considerations

### Query Optimization

- **Pagination**: Load activities in batches
- **Lazy Loading**: Load photos on scroll
- **Caching**: Aggressive caching with smart invalidation
- **Compression**: Images compressed before upload

### Component Optimization

- **Memoization**: Memoize expensive components (ActivityItem lists)
- **Code Splitting**: Lazy load tab content
- **Image Optimization**: Serve thumbnails for lists, full-res for lightbox
- **Virtual Lists**: Large activity lists use virtualization

### Mobile Performance

- **Bundle Size**: Tree-shake unused code
- **Image Sizes**: Responsive images, multiple resolutions
- **Animations**: Use GPU-accelerated transforms
- **Network**: Minimize HTTP requests, use gzip compression

---

## Accessibility Considerations

- **Keyboard Navigation**: Full keyboard support for desktop
- **Screen Readers**: Semantic HTML, ARIA labels
- **Color Contrast**: WCAG AA compliance
- **Touch Targets**: 44px minimum on mobile
- **Focus Management**: Clear focus indicators, focus trap in modals

---

Last updated: 2024
Version: 1.0.0 - Architecture Design