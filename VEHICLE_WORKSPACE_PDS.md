# Vehicle Workspace - Product Design Specification (PDS)

The Vehicle Workspace is where builders spend their time. This specification defines exactly how it should feel and function.

---

## 1. Screen Purpose

### Primary Question

**"How is my vehicle coming along, and what happened since I last looked?"**

The Vehicle Workspace is a builder's command center—a living, visual record of their build journey. It answers:
- What's been done?
- What does it look like now?
- Am I on track?
- What's the next thing I should do?

### Secondary Questions

- Did someone else work on my vehicle?
- Where are all my photos?
- Do I have all the details recorded?
- How complete is my documentation?

---

## 2. Builder Goals

### Primary Goals

**Builders want to:**
1. **See their progress** - Visual confirmation that work is being done
2. **Remember what happened** - Access to activity history without scrolling endlessly
3. **Show off their vehicle** - Display beautiful photos of their work
4. **Stay informed** - Know instantly if something changed
5. **Feel accomplished** - See evidence of their builds coming together

### Secondary Goals

1. **Track details** - Access vehicle specifications and ownership info when needed
2. **Collaborate** - Know who did what and when
3. **Plan next steps** - Understand what's documented and what needs work
4. **Share progress** - Have materials ready to show others

### Micro Goals

- Find a specific activity quickly
- View a photo at full resolution
- Edit basic vehicle info
- Verify vehicle is still there (reassurance)

---

## 3. Emotional Goals

### How the Builder Should Feel

#### **Proud**
- "My vehicle looks amazing in these photos"
- "I've done a LOT of work—look at all this activity!"
- "My documentation is organized and complete"

#### **Motivated**
- "I want to do more work on this build"
- "This is coming together beautifully"
- "I'm making real progress"

#### **Confident**
- "I know exactly what's been done"
- "Nothing is lost or forgotten"
- "My work is safe and backed up"

#### **Organized**
- "Everything I need is in one place"
- "I can find what I'm looking for instantly"
- "My build is under control"

#### **Connected**
- "This is my vehicle workspace—my personal place"
- "My collaborators and I are building something together"
- "I'm part of a community of builders"

### Avoid These Feelings

- ❌ Overwhelmed (too much data, too many options)
- ❌ Frustrated (can't find what I need)
- ❌ Forgotten (my work is lost)
- ❌ Confused (what am I looking at?)
- ❌ Disconnected (this doesn't feel like mine)

---

## 4. Information Hierarchy

### Overview Tab (Landing View)

**Primary Section: Recent Activities**
1. Hero photo (largest visual element)
2. Activity description (what was done)
3. Meta information (who, when, what type)
4. Call-to-action (tap to see full timeline)

**Secondary Section: Quick Stats**
1. Total activities count
2. Total photos count
3. Last activity timestamp
4. Documentation score (visual progress indicator)

**Tertiary Section: Navigation Prompts**
1. "View Full Timeline" button
2. "Start New Activity" button

**Bottom Footer**
- Always-accessible action buttons
- Quick navigation

### Photos Tab

**Primary Section: Photo Grid**
1. Photos displayed in order (newest first)
2. Activity date label on each photo
3. Clear visual feedback on tap

**Secondary Section: Context**
1. Activity details (description, timestamp)
2. Related activities
3. Photo metadata (if applicable)

**Lightbox View (Full Photo)**
1. Photo fills screen
2. Activity context below (minimal)
3. Navigation (previous/next)
4. Close button

### About Tab

**Primary Section: Vehicle Identity**
1. Vehicle name (large, prominent)
2. Year / Make / Model
3. Visual identification (if image available)

**Secondary Section: Vehicle Details**
1. VIN
2. Color
3. License plate
4. Owner notes

**Tertiary Section: Ownership**
1. Owner name
2. Owner email
3. Garage assignment
4. Creation date

**Action Area**
1. Edit button (if owner)
2. More options menu

---

## 5. Primary Action

### ONE Clear Primary Action Per Screen

**Overview Tab:**
- **Tap a recent activity** → Opens Timeline with that activity focused
- (This is the most common user action)

**Photos Tab:**
- **Tap a photo** → Opens full-resolution lightbox
- (Photography is the hero)

**About Tab:**
- **Tap Edit** → Enter vehicle details editing mode
- (Record-keeping is the secondary action)

### Why Only One?

Too many primary actions overwhelm builders. One clear action per screen keeps focus and reduces cognitive load. Secondary and tertiary actions are available but not competing for attention.

---

## 6. Secondary Actions

### Overview Tab

**Secondary Actions (in priority order):**

1. **Pull down to refresh** (mobile)
   - Subtle visual feedback
   - Shows "Refreshing..." briefly
   - Updates all data in place

2. **Tap "View Full Timeline"** 
   - Navigate to dedicated Timeline screen
   - See all activities, not just recent
   - Access more powerful filtering (future)

3. **Tap "Start New Activity"**
   - Initiate activity creation flow
   - Record new work
   - Add photos

4. **Tap vehicle action menu** (header)
   - Edit vehicle details
   - Share vehicle workspace
   - Archive vehicle
   - (Settings and more)

### Photos Tab

**Secondary Actions:**

1. **Swipe left/right in lightbox** (mobile)
   - Navigate to previous/next photo
   - Quick browsing of photo history

2. **Double-tap to zoom** (mobile)
   - Inspect details in photo
   - See close-up work

3. **Pinch to zoom** (mobile)
   - Magnify to see details

4. **Close lightbox**
   - Tap X or swipe down
   - Return to grid

### About Tab

**Secondary Actions:**

1. **Tap to copy** (vehicle details)
   - Copy VIN to clipboard
   - Copy license plate
   - Copy notes

2. **Share vehicle info**
   - Generate shareable vehicle card
   - Share with collaborators

3. **Edit mode**
   - Modify vehicle details
   - Save creates Activity
   - Cancel discards changes

---

## 7. Activity Types

### Build Activities (User-Created Records)

Activities that builders intentionally create to document their work:

- **Purchased Part** - Record of parts bought or acquired
  - Example: "Ordered new fuel pump from Summit Racing"
  - Photos: Optional (receipt, packaging)
  - Visible in Overview and Timeline by default

- **Installed Part** - Record of components installed on the vehicle
  - Example: "Installed new water pump"
  - Photos: Encouraged (before/after, closeups)
  - Visible in Overview and Timeline by default

- **Maintenance** - Routine or preventive work
  - Example: "Oil change, rotated tires"
  - Photos: Optional (work in progress)
  - Visible in Overview and Timeline by default

- **Progress Update** - General progress notes without specific work
  - Example: "Made good progress on interior, still sanding"
  - Photos: Optional (general workspace shots)
  - Visible in Overview and Timeline by default

- **Journal Entry** - Personal notes, reflections, or thoughts on the build
  - Example: "Really happy with how the paint turned out!"
  - Photos: Optional (pride photos)
  - Visible in Overview and Timeline by default

- **Record Upload** - General documents, receipts, or files attached
  - Example: "Receipt from machine shop"
  - Photos: Optional (document scans)
  - Visible in Overview and Timeline by default

### System Activities (Auto-Generated Audit Trail)

Activities generated by the system to maintain audit trail and completeness:

- **Vehicle metadata edits** - Changes to vehicle name, year, make, model, color, VIN, etc.
  - Auto-created when About tab is saved
  - Records what changed and who changed it
  - **Hidden from default Recent Activity feed**
  - Visible in Timeline only through optional filtering

- **Garage metadata edits** - Changes to garage information or vehicle assignment
  - Auto-created when garage details are modified
  - Maintains governance and audit trail
  - **Hidden from default Recent Activity feed**
  - Visible in Timeline only through optional filtering

- **Administrative updates** - System-level changes, permissions, sharing adjustments
  - Auto-created for compliance and accountability
  - Records administrative actions
  - **Hidden from default Recent Activity feed**
  - Visible in Timeline only through optional filtering

### Why This Classification?

**Build Activities** are what builders care about—the *work they did*. These are celebrated and visible by default.

**System Activities** maintain an audit trail and historical record for reference and compliance. They're important but not the primary focus of the builder's attention. Hiding them by default keeps the Recent Activity feed clean and builder-focused, while keeping them accessible through Timeline filtering for when detailed investigation is needed.

**Future Enhancement:** Timeline screen may optionally expose System Activities through advanced filtering to support:
- Complete historical reconstruction
- Compliance audits
- Permission tracking
- Administrative review

---

## 8. Empty State

### When Vehicle Has No Activities

```
┌────────────────────────────────┐
│      📷 Hero Icon              │
│                                │
│   No Activities Yet            │
│                                │
│  Start documenting your build  │
│  with photos and descriptions. │
│                                │
│  [+ Create First Activity]     │
│                                │
│  OR                            │
│                                │
│  It's okay if nothing's ready  │
│  yet. You'll capture it when   │
│  the moment happens.           │
│                                │
└────────────────────────────────┘
```

**Purpose:** Not a failure state—an invitation. Builders just added a vehicle and haven't documented anything yet.

**Tone:** Encouraging, not alarming. Normalizes the empty state.

**Action:** CTA button to create first activity.

**Alternative Message:**
- "No activities to show yet"
- "Your build awaits. Ready?"
- "Nothing documented—yet!"

### When Photos Tab Has No Photos

```
┌────────────────────────────────┐
│      📸 Photo Icon             │
│                                │
│   No Photos Shared Yet         │
│                                │
│  Add photos to activities to   │
│  build your visual history.    │
│                                │
│  [Go to Overview] or           │
│  [Create New Activity]         │
│                                │
└────────────────────────────────┘
```

**Purpose:** Guides builder to add photos to activities.

**Tone:** Helpful, not judgmental.

**Action:** Two CTA options (context-dependent).

---

## 9. Loading State

### Initial Load (Vehicle Workspace Opening)

**Visual Pattern:**
- Header loads immediately (vehicle name visible instantly)
- Content area shows skeleton loaders
- Animated shimmer effect (not spinning spinner)

**Hierarchy:**
1. Vehicle name appears (instant reassurance)
2. Documentation score appears
3. Recent activities load (skeleton → real content)
4. Stats load
5. Full content visible

**Duration:** 0.5-2 seconds (most cases)

**Feeling:** Fast, smooth, progressive. Never a blank white screen.

### Per-Tab Loading

**Switching tabs:**
- Quick fade/slide transition
- If data not cached, show skeleton for new tab
- Cached data shows instantly

**Loading more activities:**
- "Loading..." indicator at bottom
- Seamless append to list
- No scroll jump

---

## 10. Error State

### Network Error (Can't Load Activities)

```
┌────────────────────────────────┐
│      ⚠ Error Icon              │
│                                │
│   Failed to Load Activities    │
│                                │
│  We couldn't reach the server. │
│  Check your connection and     │
│  try again.                    │
│                                │
│  [Retry]  [Try Photos]         │
│                                │
│  Still not working?            │
│  [Contact Support]             │
│                                │
└────────────────────────────────┘
```

**Tone:** Matter-of-fact, helpful. Not an emergency.

**Recovery Path:** Clear steps to fix (retry, try different tab, contact support).

**Data Shown:** Header still visible (vehicle name, navigation).

### Vehicle Not Found

```
┌────────────────────────────────┐
│      🚗 Vehicle Icon           │
│                                │
│   Vehicle Not Found            │
│                                │
│  This vehicle doesn't exist    │
│  or has been archived.         │
│                                │
│  [Back to My Vehicles]         │
│                                │
└────────────────────────────────┘
```

**Tone:** Straightforward. No alarm.

**Recovery:** Back to Mission Control (vehicle list).

### Mutation Error (Edit/Save Fails)

```
Toast Notification (bottom):
┌────────────────────────────────┐
│ ❌ Failed to save changes       │
│ [Retry]  [Dismiss]             │
└────────────────────────────────┘
```

**Tone:** Brief, clear.

**Data:** Form keeps values (not lost).

**Recovery:** Retry or discard.

### Shared Workspace (Conflict)

```
Notification:
┌────────────────────────────────┐
│ ℹ Another user is editing      │
│ Vehicle details have been      │
│ updated. Refresh to see        │
│ changes.                       │
│                                │
│ [Refresh]  [Keep Mine]         │
└────────────────────────────────┘
```

**Tone:** Informational.

**Options:** Merge/refresh or keep current changes.

---

## 11. Success State

### Activity Created Successfully

```
Toast Notification (top, auto-dismiss):
┌────────────────────────────────┐
│ ✅ Activity recorded!          │
│    Your work is now saved      │
│    and backed up.              │
└────────────────────────────────┘
```

**Duration:** 2-3 seconds

**Feeling:** Accomplished, confident

**Behavior:** 
- Auto-dismiss
- New activity appears in list (realtime)
- Notification toast fades
- Builder can continue

### Vehicle Details Updated

```
Toast Notification:
┌────────────────────────────────┐
│ ✅ Vehicle details updated     │
│    Activity created            │
└────────────────────────────────┘
```

**Behavior:**
- Header updates immediately
- Activity appears in overview (if visible)
- Form closes
- Return to About tab view

### Photos Uploaded Successfully

```
Toast Notification:
┌────────────────────────────────┐
│ ✅ Photos saved!               │
│    Added to your activity      │
│    and visible in Photos tab.  │
└────────────────────────────────┘
```

**Behavior:**
- Photos appear in grid (realtime)
- PhotosTab count updates
- Stats update
- Builder sees immediate visual feedback

### Real-Time Update Received

```
Subtle Notification (if another user updates):
┌────────────────────────────────┐
│ 🔄 New activity from John      │
│    "Oil change complete"       │
│    [View]                      │
└────────────────────────────────┘
```

**Tone:** Exciting, collaborative

**Behavior:**
- New activity appears in list
- Tap to view or dismiss
- Stats update

---

## 12. Accessibility Considerations

### Visual

- **Color Contrast:** All text > 4.5:1 contrast ratio
- **Large Text:** Headers minimum 18px on mobile
- **No Color Dependency:** Don't convey meaning by color alone
  - Use icons + color
  - Use text + background
- **Dark Mode:** Support dark mode for night builders

### Interaction

- **Touch Targets:** All buttons and tappable areas > 44px
- **Spacing:** Clear gap between touch targets (minimum 8px)
- **Keyboard Navigation:** Full keyboard support on desktop
  - Tab through tabs
  - Arrow keys for navigation
  - Enter/Space for actions
- **Focus Indicators:** Clear, visible focus ring on all interactive elements

### Screen Readers

- **Semantic HTML:** Use `<button>`, `<header>`, `<section>`, etc.
- **ARIA Labels:** Every icon has aria-label or associated text
- **Alt Text:** All photos have descriptive alt text
- **Headings:** Proper hierarchy (H1 → H2 → H3)
- **Form Labels:** Associated with inputs
- **Announcements:** Loading/success states announced

### Motor

- **No Time Limits:** No "swipe to dismiss" required—always provide button
- **Gesture Alternatives:** Swipe has button alternative
- **Double-Tap:** Always provide single-tap alternative
- **Pinch Zoom:** Browser default zoom supported

### Cognitive

- **Clear Language:** Avoid jargon
- **Consistent Patterns:** Same actions work same way everywhere
- **Undo Available:** Can undo accidental actions
- **Confirmation:** Destructive actions require confirmation

---

## 13. Performance Expectations

### Load Times

| Action | Target | Feeling |
|--------|--------|---------|
| Open Vehicle Workspace | 0.5-2s | Instant |
| Switch tabs | <300ms | Seamless |
| Tap activity → Timeline | <500ms | Responsive |
| Open photo lightbox | <1s | Smooth |
| Pull to refresh | <2s | Quick |
| Create activity | <1s | Satisfying |

### Perceived Performance

- **Hero Content First:** Vehicle name and score visible immediately
- **Progressive Loading:** Content appears as it loads
- **Smooth Animations:** No jank, 60fps transitions
- **Optimistic Updates:** Photos appear before upload completes
- **Smart Caching:** Returning user sees instant data

### Network Conditions

- **3G Network:** Full experience in <5 seconds
- **Slow Connections:** Graceful degradation, not crash
- **Offline:** Show cached data with "offline" indicator
- **Reconnect:** Automatic sync when connection returns

### Device Performance

- **Memory:** Works smoothly on 3-year-old devices
- **Battery:** Efficient use of battery (no constant polling)
- **CPU:** Smooth 60fps scrolling even with 200+ activities
- **Storage:** Reasonable storage footprint for app

---

## 14. Future Expansion

### Reserved Screen Space

The Vehicle Workspace is designed to grow without major redesigns.

#### **Timeline (Dedicated Screen)**
Currently exists as separate screen.

Future: Could be integrated as a tab or expanded view.

**Reserved for:** Deep activity exploration, filtering, bulk operations.

#### **Inventory**
Location: Right sidebar (desktop) or expandable drawer (mobile)

Purpose: See parts/components in current vehicle

Could show:
- Installed parts
- Pending parts
- Part costs
- Part relationships to activities

Visual: List or grid of items with status badges

#### **Budget**
Location: Expandable section in About tab or sidebar

Purpose: Financial tracking of the build

Could show:
- Total spent
- Budget vs. actual
- Cost per category
- ROI calculation

Visual: Charts and summary numbers

#### **Build Summary™**
Location: Card or modal accessible from Overview

Purpose: AI-generated or manual summary of vehicle progress

Could show:
- "2024 Chevelle restoration: 45% complete"
- "Recent work: Engine rebuild, paint prep"
- "Next priorities: Interior, electrical"
- "Time invested: 120 hours"
- "Team: 2 builders"

Visual: Narrative text + key metrics

### Design Principles for Future Features

1. **Don't Clutter the Core Flow**
   - New features are secondary or nested
   - Primary action (view activity) remains unchanged
   - Photos remain the hero

2. **Maintain Mobile-First**
   - Desktop can show more (sidebar, expanded)
   - Mobile stays focused (drawer, tabs, modals)

3. **Preserve Single Purpose**
   - Each screen/tab has one reason to exist
   - Information organized by builder need
   - No "everything on one screen"

4. **Keep Activities Sacred**
   - Activities remain single source of truth
   - All new data connects to activities
   - Timeline remains the authority on "what happened"

---

## Summary: Vehicle Workspace Design Philosophy

### It Should Feel Like...

A personal build journal that lives in your pocket. Not a database interface. Not a project management tool. A visual story of what you're creating, told through photos and activities.

### It Should Do...

Get out of the way. Let builders focus on what matters: seeing progress, remembering details, and celebrating their work.

### It Should Never Do...

- Ask for data you don't have
- Hide information behind menus
- Make you scroll endlessly
- Forget anything you've recorded
- Feel corporate or sterile

---

**Next Steps in Design Process:**
1. Validate design with builder interviews
2. Create interactive prototype (Figma)
3. Test with actual builders in the field
4. Iterate based on feedback
5. Prepare for implementation

---

Last updated: 2024
Version: 1.1.0 - Product Design Specification
