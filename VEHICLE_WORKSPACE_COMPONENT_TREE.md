# Vehicle Workspace Component Tree - v0.3

Complete component inventory with detailed descriptions, inputs, outputs, and responsibilities.

---

## Component Tree Structure

```
VehicleWorkspaceContainer (Page-level)
├── VehicleWorkspaceLayout (Main container)
│   ├── WorkspaceHeader
│   │   ├── VehicleIdentifier
│   │   ├── DocumentationScore
│   │   └── ActionMenu
│   │       ├── EditVehicleModal
│   │       ├── ShareVehicleModal
│   │       ├── ArchiveVehicleModal
│   │       └── DeleteVehicleModal
│   ├── TabNavigation
│   │   ├── TabButton (Overview)
│   │   ├── TabButton (Photos)
│   │   └── TabButton (About)
│   ├── TabContent
│   │   ├── OverviewTab
│   │   │   ├── RecentActivityList
│   │   │   │   └── ActivityItem (repeating)
│   │   │   │       ├── ActivityPhoto
│   │   │   │       ├── ActivityDescription
│   │   │   │       ├── ActivityMeta
│   │   │   │       └── ActivityTimestamp
│   │   │   ├── QuickStats
│   │   │   │   ├── StatCard (Activities)
│   │   │   │   ├── StatCard (Photos)
│   │   │   │   ├── StatCard (Last Activity)
│   │   │   │   └── StatCard (Score)
│   │   │   └── ViewTimelineCTA
│   │   │
│   │   ├── PhotosTab
│   │   │   ├── PhotoGrid
│   │   │   │   └── PhotoTile (repeating)
│   │   │   │       ├── PhotoThumbnail
│   │   │   │       └── PhotoActivityDate
│   │   │   ├── PhotoLightbox
│   │   │   │   ├── PhotoDisplay
│   │   │   │   ├── PhotoNavigation
│   │   │   │   ├── PhotoContext
│   │   │   │   └── PhotoClose
│   │   │   └── EmptyPhotosState
│   │   │
│   │   └── AboutTab
│   │       ├── VehicleDetailsForm
│   │       │   ├── VehicleNameField
│   │       │   ├── VehicleYearField
│   │       │   ├── VehicleMakeField
│   │       │   ├── VehicleModelField
│   │       │   ├── VehicleColorField
│   │       │   ├── VehicleVINField
│   │       │   ├── VehicleLicensePlateField
│   │       │   └── VehicleNotesField
│   │       ├── OwnershipInfo
│   │       │   ├── OwnerNameDisplay
│   │       │   ├── OwnerEmailDisplay
│   │       │   ├── GarageDisplay
│   │       │   └── CreatedDateDisplay
│   │       ├── EditButton / SaveButton
│   │       └── CancelButton
│   │
│   └── WorkspaceFooter
│       ├── NewActivityCTA
│       └── ViewTimelineLink
│
└── Providers
    ├── ErrorBoundary
    ├── QueryClientProvider
    └── AuthProvider
```

---

## Component Specifications

### **VehicleWorkspaceContainer**

**Category:** Page-level Container

**Purpose:** Entry point for Vehicle Workspace. Manages top-level routing, authentication, and provider setup.

**Inputs:**
- `vehicleId` (from URL params: `/vehicle/:vehicleId`)
- Current user (from auth context)

**Outputs:**
- Rendered Vehicle Workspace or error/loading state
- Navigation to Mission Control on errors

**Responsibilities:**
- Parse vehicle ID from route parameters
- Verify user authentication
- Check user has access to vehicle
- Load vehicle metadata
- Set up error boundary
- Provide query client context
- Handle redirect if vehicle not found
- Handle redirect if user unauthorized

**State:**
- Derived from React Router params
- Derived from auth context

**Children:**
- VehicleWorkspaceLayout (when loaded)
- Error state or loading state

---

### **VehicleWorkspaceLayout**

**Category:** Layout Container

**Purpose:** Main layout structure managing header, tabs, and content areas.

**Inputs:**
- `vehicleId` (string)
- `vehicleData` (Vehicle object)
- `activeTab` (string: 'overview' | 'photos' | 'about')

**Outputs:**
- Rendered layout with active tab content
- Tab switch events

**Responsibilities:**
- Manage active tab state
- Coordinate responsive layout
- Handle tab switching (local state)
- Manage loading/error states for entire workspace
- Calculate layout breakpoints
- Handle workspace-level loading skeletons

**State:**
- `activeTab` (managed locally, synced to URL)
- `isLoading` (derived from child query states)
- `error` (derived from child errors)

**Children:**
- WorkspaceHeader
- TabNavigation
- TabContent (dynamic)
- WorkspaceFooter

**Responsive Behavior:**
- Mobile: Full-width, vertical stack, swipeable tabs
- Tablet: Full-width with padding, same layout
- Desktop: Consider sidebar or wider layout (future enhancement)

---

### **WorkspaceHeader**

**Category:** Header Component

**Purpose:** Display vehicle identification, documentation score, and quick actions.

**Inputs:**
- `vehicleName` (string)
- `vehicleYear` (string or number)
- `vehicleMake` (string)
- `vehicleModel` (string)
- `documentationScore` (number 0-100)
- `onActionSelect` (callback function)

**Outputs:**
- Action menu selections (edit, share, archive, delete)
- Navigation commands

**Responsibilities:**
- Render vehicle identity
- Display documentation score
- Provide action menu
- Handle action selections
- Display user avatar/initials
- Responsive styling

**State:**
- `actionMenuOpen` (boolean)
- `selectedAction` (string or null)

**Children:**
- VehicleIdentifier
- DocumentationScore
- ActionMenu
- UserAvatar

---

### **VehicleIdentifier**

**Category:** Display Component

**Purpose:** Display vehicle name and basic identification.

**Inputs:**
- `vehicleName` (string)
- `vehicleYear` (string or number)
- `vehicleMake` (string)
- `vehicleModel` (string)

**Outputs:**
- Rendered vehicle name and summary

**Responsibilities:**
- Format and display vehicle identity
- Use bold/prominent styling
- Truncate long names on mobile

**State:** None (pure display)

**Example Output:**
```
2015 Chevrolet Chevelle
My Classic Ride
```

---

### **DocumentationScore**

**Category:** Display Component

**Purpose:** Visual representation of how well the vehicle is documented.

**Inputs:**
- `score` (number 0-100)
- `activityCount` (number)
- `photoCount` (number)

**Outputs:**
- Rendered score display with visual indicator

**Responsibilities:**
- Display score percentage
- Render progress bar or circular indicator
- Show breakdown: activities + photos
- Use color coding (low=red, medium=yellow, high=green)

**State:** None (pure display)

**Example Output:**
```
Documentation 72%
████████░░ 
Activities: 12  |  Photos: 28
```

---

### **ActionMenu**

**Category:** Interactive Component

**Purpose:** Provide vehicle-level actions (edit, share, archive, delete).

**Inputs:**
- `vehicleId` (string)
- `vehicleData` (Vehicle object)
- `onActionSelect` (callback)

**Outputs:**
- Action selection events
- Modal triggers

**Responsibilities:**
- Render menu button
- Handle menu open/close
- Render menu options
- Trigger action modals
- Handle action results (mutations)

**State:**
- `isMenuOpen` (boolean)
- `selectedAction` (string or null)

**Menu Options:**
1. Edit Vehicle Details → EditVehicleModal
2. Share Vehicle → ShareVehicleModal
3. Archive Vehicle → ArchiveVehicleModal
4. Delete Vehicle → DeleteVehicleModal

---

### **TabNavigation**

**Category:** Navigation Component

**Purpose:** Tab switching interface for Overview/Photos/About.

**Inputs:**
- `activeTab` (string)
- `onTabChange` (callback)

**Outputs:**
- Tab change events
- Tab indicator updates

**Responsibilities:**
- Render tab buttons
- Indicate active tab
- Handle tab clicks/swipes
- Scroll tab bar if needed (mobile)
- Keyboard navigation (desktop)

**State:**
- `activeTab` (managed by parent)

**Tabs:**
- Overview (default)
- Photos
- About

**Interactions:**
- Tap/click tab → onTabChange(tabName)
- Swipe left/right → onTabChange(nextTab)
- Arrow keys (desktop) → onTabChange(nextTab)

---

### **OverviewTab**

**Category:** Tab Container

**Purpose:** Dashboard view showing recent activities and quick stats.

**Inputs:**
- `vehicleId` (string)

**Outputs:**
- Navigation to Timeline
- Refresh events

**Responsibilities:**
- Load recent activities
- Display statistics
- Handle pull-to-refresh
- Route to Timeline on activity tap
- Display empty state if no activities

**State:**
- `isRefreshing` (boolean)

**Children:**
- RecentActivityList
- QuickStats
- ViewTimelineCTA

**Data Dependencies:**
- useRecentActivities(vehicleId, limit: 10)
- useVehicleStats(vehicleId)

---

### **RecentActivityList**

**Category:** List Component

**Purpose:** Display recent activities in reverse chronological order.

**Inputs:**
- `activities` (Activity[])
- `isLoading` (boolean)
- `error` (Error or null)
- `onActivitySelect` (callback)
- `onRefresh` (callback)

**Outputs:**
- Activity selection events
- Refresh events
- Navigation commands

**Responsibilities:**
- Render activity items
- Handle loading states (skeleton)
- Display error state
- Implement pull-to-refresh
- Handle activity tap → navigate to Timeline
- Show empty state if no activities

**State:**
- `isRefreshing` (boolean)
- `selectedActivityId` (string or null)

**Children:**
- ActivityItem (repeating for each activity)
- LoadingSkeletons (if loading)
- EmptyState (if no activities)
- ErrorState (if error)

---

### **ActivityItem**

**Category:** List Item Component

**Purpose:** Display single activity with photo, description, and metadata.

**Inputs:**
- `activity` (Activity object)
  - id, description, type, createdAt
- `photos` (Photo[])
- `user` (User object)
- `onSelect` (callback)
- `onContextMenu` (callback for options)

**Outputs:**
- Activity selection event
- Context menu events
- Archive/edit events

**Responsibilities:**
- Render hero photo (first photo from activity)
- Display activity description (truncated)
- Show activity type indicator
- Display timestamp (relative: "2 hours ago")
- Show user who performed activity
- Handle tap → onSelect
- Handle long-press → onContextMenu
- Provide context menu (archive, edit, etc.)

**State:**
- `isContextMenuOpen` (boolean)

**Children:**
- ActivityPhoto
- ActivityDescription
- ActivityMeta
- ActivityTimestamp
- ContextMenu (optional)

**Layout:**
```
┌─────────────────────────┐
│  [Photo]    | Type      │
│             | Title     │
│             | By: User  │
│             | 2h ago    │
└─────────────────────────┘
```

---

### **ActivityPhoto**

**Category:** Image Component

**Purpose:** Display hero photo from activity with optimization.

**Inputs:**
- `photoUrl` (string)
- `photoId` (string)
- `thumbnailUrl` (string)
- `alt` (string description)

**Outputs:**
- Photo click event (optional)

**Responsibilities:**
- Lazy load photo
- Serve thumbnail first, full-res on demand
- Maintain aspect ratio
- Handle loading state (skeleton)
- Handle error state (placeholder)
- Optimize for mobile (responsive image)

**State:**
- `isLoaded` (boolean)

**Image Optimization:**
- Thumbnail: 200px wide
- List view: 400px wide
- Lightbox: Full resolution
- Format: WebP with JPEG fallback
- CDN caching: 30 days

---

### **ActivityDescription**

**Category:** Text Display Component

**Purpose:** Display activity description (truncated in list).

**Inputs:**
- `description` (string)
- `maxLength` (number, default: 150)
- `isExpanded` (boolean)

**Outputs:**
- Expand/collapse event (optional)

**Responsibilities:**
- Display description text
- Truncate if too long
- Show "..." if truncated
- Handle expand/collapse

**State:** None (pure display if no expand/collapse)

**Example:**
```
"Installed new custom exhaust system. 
Sounds amazing! Had to..."
```

---

### **ActivityMeta**

**Category:** Display Component

**Purpose:** Display activity type and metadata tags.

**Inputs:**
- `activityType` (string)
- `tags` (string[])
- `metadata` (object)

**Outputs:** None (display only)

**Responsibilities:**
- Display activity type icon/label
- Display tags or categories
- Use consistent styling
- Color-code by type (if applicable)

**State:** None (pure display)

**Example:**
```
🔧 Maintenance  #exhaust #performance
```

---

### **ActivityTimestamp**

**Category:** Display Component

**Purpose:** Display when activity occurred (relative time).

**Inputs:**
- `createdAt` (ISO datetime string)
- `format` (string: 'relative' | 'absolute', default: 'relative')

**Outputs:** None (display only)

**Responsibilities:**
- Format timestamp
- Display relative time ("2 hours ago")
- Show absolute time on hover (tooltip)
- Update relative time as time passes
- Use user's timezone

**State:** None (pure display, but re-renders as time passes)

**Example:**
```
"2 hours ago" (tooltip: "Jul 12, 2:30 PM")
```

---

### **QuickStats**

**Category:** Stats Card Component

**Purpose:** Display high-level vehicle statistics.

**Inputs:**
- `stats` (object)
  - activityCount (number)
  - photoCount (number)
  - lastActivityAt (ISO datetime)
  - documentationScore (number)

**Outputs:** None (display only)

**Responsibilities:**
- Render stats in card layout
- Display icons + numbers
- Format large numbers (1.2k, etc.)
- Show timestamps
- Responsive grid (mobile: 2x2, tablet: 1x4)

**State:** None (pure display)

**Children:**
- StatCard (repeating, 4 instances)

**Layout:**
```
┌──────────────┬──────────────┐
│ 📊 12         │ 📸 28        │
│ Activities   │ Photos       │
├──────────────┼──────────────┤
│ 🕐 2h ago    │ 📈 72%       │
│ Last Update  │ Documentation│
└──────────────┴──────────────┘
```

---

### **StatCard**

**Category:** Card Component

**Purpose:** Display single statistic with icon and label.

**Inputs:**
- `icon` (string or React component)
- `label` (string)
- `value` (string or number)
- `trend` (optional: 'up' | 'down' | 'neutral')

**Outputs:** None (display only)

**Responsibilities:**
- Render stat in card format
- Display icon, value, label
- Optional trend indicator
- Responsive sizing

**State:** None (pure display)

**Example:**
```
    📸
    28
  Photos
```

---

### **ViewTimelineCTA**

**Category:** Call-to-Action Component

**Purpose:** Button to navigate to full Timeline.

**Inputs:**
- `vehicleId` (string)
- `onClick` (callback)

**Outputs:**
- Click event / navigation

**Responsibilities:**
- Render prominent button
- Navigate to Timeline screen
- Provide clear label

**State:** None

**Button Text:** "View Full Timeline" or "📅 All Activities"

---

### **PhotosTab**

**Category:** Tab Container

**Purpose:** Photo-centric view of vehicle history.

**Inputs:**
- `vehicleId` (string)

**Outputs:**
- Photo selection events
- Navigation events

**Responsibilities:**
- Load activities with photos
- Display photo grid
- Handle photo selection
- Open/close lightbox
- Show empty state if no photos
- Handle loading/error states

**State:**
- `selectedPhotoIndex` (number or null)
- `lightboxOpen` (boolean)

**Children:**
- PhotoGrid
- PhotoLightbox (conditional)
- EmptyPhotosState (conditional)

**Data Dependencies:**
- useActivitiesWithPhotos(vehicleId)

---

### **PhotoGrid**

**Category:** Grid Component

**Purpose:** Display photos in masonry/grid layout.

**Inputs:**
- `photos` (Photo[])
- `isLoading` (boolean)
- `error` (Error or null)
- `onPhotoSelect` (callback)

**Outputs:**
- Photo selection events
- Gallery navigation events

**Responsibilities:**
- Render masonry grid layout
- Lazy load photos on scroll
- Serve thumbnails for performance
- Handle loading states
- Display activity date on each photo
- Show empty state if no photos
- Handle error state

**State:**
- `loadingPhotoIds` (Set of IDs)

**Children:**
- PhotoTile (repeating)
- LoadingSkeletons (if loading)
- EmptyPhotosState (if no photos)

**Layout:**
- Mobile: 2 columns
- Tablet: 3-4 columns
- Desktop: 4-5 columns

---

### **PhotoTile**

**Category:** Tile Component

**Purpose:** Display single photo in grid with activity date.

**Inputs:**
- `photo` (Photo object)
  - id, url, thumbnailUrl, activityDate
- `onSelect` (callback)
- `activityDate` (string)

**Outputs:**
- Photo selection event

**Responsibilities:**
- Render photo thumbnail
- Maintain aspect ratio
- Display activity date label
- Handle click → onSelect
- Show loading skeleton while loading
- Lazy load image

**State:**
- `isLoaded` (boolean)

**Layout:**
```
┌──────────┐
│          │
│  Photo   │  Square aspect ratio
│          │  (1:1)
├──────────┤
│ Jul 12   │  Date label
└──────────┘
```

---

### **PhotoLightbox**

**Category:** Modal Component

**Purpose:** Full-screen photo viewing with context and navigation.

**Inputs:**
- `photos` (Photo[] in order)
- `initialIndex` (number)
- `onClose` (callback)
- `onNavigate` (callback, optional)

**Outputs:**
- Close event
- Navigation events

**Responsibilities:**
- Render full-screen photo display
- Display photo at full resolution
- Show activity context (description, type, timestamp)
- Navigate between photos
- Handle close button/swipe
- Keyboard navigation (desktop)
- Lock body scroll

**State:**
- `currentIndex` (number)
- `isZoomed` (boolean, for pinch-to-zoom)

**Children:**
- PhotoDisplay
- PhotoNavigation
- PhotoContext
- CloseButton

**Interactions:**
- Swipe left/right → next/previous photo
- Pinch (mobile) → zoom
- Double-tap → zoom
- Tap outside or close button → close
- Arrow keys (desktop) → navigate
- Escape key → close

---

### **PhotoDisplay**

**Category:** Image Component

**Purpose:** Display full-resolution photo.

**Inputs:**
- `photoUrl` (string)
- `alt` (string)
- `onZoomChange` (callback)

**Outputs:**
- Zoom state changes

**Responsibilities:**
- Load full-resolution image
- Support pinch-to-zoom (mobile)
- Support double-tap to zoom (mobile)
- Show loading indicator while loading
- Handle image errors

**State:**
- `isLoaded` (boolean)
- `zoomLevel` (number)

---

### **PhotoNavigation**

**Category:** Navigation Component

**Purpose:** Navigate between photos in lightbox.

**Inputs:**
- `currentIndex` (number)
- `totalCount` (number)
- `onNext` (callback)
- `onPrevious` (callback)

**Outputs:**
- Navigation events

**Responsibilities:**
- Render navigation buttons
- Show current position (e.g., "3 of 12")
- Handle next/previous clicks
- Disable buttons at start/end
- Support swipe gestures

**State:** None (managed by parent)

**Layout:**
```
< Photo 3 of 12 >
```

---

### **PhotoContext**

**Category:** Display Component

**Purpose:** Show activity context for current photo.

**Inputs:**
- `activity` (Activity object)
  - description, type, createdAt, user

**Outputs:** None (display only)

**Responsibilities:**
- Display activity description
- Show activity type
- Display timestamp
- Show user who performed activity

**State:** None (pure display)

**Layout:**
```
Description of the work done...

Type: 🔧 Maintenance
By: John Smith
Jul 12, 2:30 PM
```

---

### **AboutTab**

**Category:** Tab Container

**Purpose:** Display and optionally edit vehicle details.

**Inputs:**
- `vehicleId` (string)
- `vehicleData` (Vehicle object)

**Outputs:**
- Edit/save events
- Vehicle update mutations

**Responsibilities:**
- Load vehicle data
- Toggle edit mode
- Handle vehicle data mutations
- Validate form inputs
- Show loading/error states
- Create Activity on update

**State:**
- `isEditMode` (boolean)
- `editFormValues` (object, temporary state)
- `isSubmitting` (boolean)

**Children:**
- VehicleDetailsForm
- OwnershipInfo
- EditButton / SaveButton
- CancelButton (if editing)

**Data Dependencies:**
- useVehicle(vehicleId)
- useUpdateVehicle() (mutation)

---

### **VehicleDetailsForm**

**Category:** Form Component

**Purpose**: Display vehicle details in read-only or edit mode.

**Inputs:**
- `vehicleData` (Vehicle object)
- `isEditMode` (boolean)
- `onSubmit` (callback)
- `onCancel` (callback)
- `isSubmitting` (boolean)

**Outputs:**
- Form submission events
- Cancel events
- Form value changes

**Responsibilities:**
- Render vehicle detail fields
- Switch between read-only and edit modes
- Validate form inputs
- Submit mutations
- Handle errors
- Show loading state on submit

**State:**
- Managed by parent (AboutTab)

**Fields (Read-only Display):**
- Vehicle Name
- Year / Make / Model
- VIN
- Color
- License Plate
- Notes/Description

**Edit Mode:**
- Text inputs for each field
- Form validation
- Submit/Cancel buttons
- Error messages

---

### **OwnershipInfo**

**Category:** Display Component

**Purpose:** Display ownership and garage information.

**Inputs:**
- `owner` (User object)
  - name, email, avatar
- `garage` (Garage object, optional)
- `createdAt` (ISO datetime)

**Outputs:** None (display only)

**Responsibilities:**
- Display owner information
- Display garage assignment (if applicable)
- Show creation date
- Format information clearly

**State:** None (pure display)

**Layout:**
```
Owner: John Smith (john@example.com)
Garage: My Garage
Created: Jul 1, 2026
```

---

### **WorkspaceFooter**

**Category:** Footer Component

**Purpose:** Bottom navigation and quick actions.

**Inputs:**
- `vehicleId` (string)
- `onNewActivityClick` (callback)
- `onTimelineClick` (callback)

**Outputs:**
- Action events (navigation)

**Responsibilities:**
- Render footer with action buttons
- Handle New Activity CTA
- Handle View Timeline link
- Show vehicle settings access (optional)
- Responsive display (mobile: full width, desktop: minimal)

**State:** None

**Actions:**
- "+ New Activity" → Navigate to Activity creation flow
- "View Timeline" → Navigate to full Timeline
- Settings (optional) → Vehicle settings modal

**Mobile Layout:**
```
┌─────────────────────────────┐
│ + New Activity | 📅 Timeline│
└─────────────────────────────┘
```

---

### **Modal Components**

#### **EditVehicleModal**
- **Purpose**: Edit vehicle name and basic details
- **Inputs**: vehicleData, onSave, onCancel
- **Outputs**: Save event with updated data
- **Responsibilities**: Form for vehicle editing, validation, submit

#### **ShareVehicleModal**
- **Purpose**: Share vehicle workspace with others
- **Inputs**: vehicleId, onShare, onCancel
- **Outputs**: Share event with recipient emails
- **Responsibilities**: Email input, permission selection, send

#### **ArchiveVehicleModal**
- **Purpose**: Confirm vehicle archive
- **Inputs**: vehicleId, vehicleName, onConfirm, onCancel
- **Outputs**: Archive confirmation
- **Responsibilities**: Warning message, confirmation button

#### **DeleteVehicleModal**
- **Purpose**: Confirm vehicle deletion (archive)
- **Inputs**: vehicleId, vehicleName, onConfirm, onCancel
- **Outputs**: Delete confirmation
- **Responsibilities**: Strong warning, password confirmation, delete button

---

### **Loading & Error Components**

#### **ActivitySkeletons**
- **Purpose**: Placeholder while activities loading
- **Count**: 5 activity item skeletons
- **Animation**: Shimmer effect
- **Maintains**: Layout and spacing

#### **PhotoSkeletons**
- **Purpose**: Placeholder while photos loading
- **Count**: 6-9 photo tile skeletons
- **Animation**: Shimmer effect
- **Maintains**: Grid layout and aspect ratio

#### **EmptyState**
- **Purpose**: Display when no data available
- **Variants**: 
  - No activities
  - No photos
  - No results
- **Components**:
  - Icon/illustration
  - Headline
  - Description
  - CTA button

#### **ErrorState**
- **Purpose**: Display when query/mutation fails
- **Components**:
  - Error icon/indicator
  - Error message
  - Retry button
  - Alternative action

---

## Component Interactions Summary

| Component | Triggers | Actions |
|-----------|----------|---------|
| TabNavigation | Tap/swipe | Switch tabs, update activeTab state |
| ActivityItem | Tap | Navigate to Timeline with activity highlighted |
| ActionMenu | Click | Open menu, select action → Modal |
| PhotoTile | Tap | Select photo, open lightbox |
| PhotoLightbox | Swipe/navigate | Display next/previous photo |
| RecentActivityList | Pull | Refresh activities query |
| ViewTimelineCTA | Click | Navigate to Timeline page |
| EditButton | Click | Toggle isEditMode = true |
| SaveButton | Click | Submit form mutation |

---

## Data Flow Summary

```
VehicleWorkspaceContainer
    │
    ├─→ useVehicle(vehicleId)
    │   └─→ VehicleIdentifier
    │   └─→ DocumentationScore
    │   └─→ AboutTab
    │
    ├─→ useRecentActivities(vehicleId)
    │   └─→ OverviewTab
    │       └─→ RecentActivityList
    │           └─→ ActivityItem
    │
    ├─→ useActivitiesWithPhotos(vehicleId)
    │   └─→ PhotosTab
    │       └─→ PhotoGrid
    │           └─→ PhotoTile
    │
    └─→ useVehicleStats(vehicleId)
        └─→ QuickStats
            └─→ StatCard (×4)
```

---

Last updated: 2024
Version: 1.0.0 - Component Tree