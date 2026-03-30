# Officials Page - File Manifest

## Core Page Files

### `/frontend/src/pages/Officials/Officials.jsx`

**Purpose**: Main page component that orchestrates the entire Officials page layout.

**Responsibilities**:

- Imports and renders all sub-components
- Manages mock data structure for the page
- Constructs the 12-column grid layout
- Integrates Navbar, Footer, and PageWrapper

**Key Exports**: `default` (Officials component)

**Dependencies**:

- React
- Navbar, Footer, PageWrapper (layout components)
- All component children
- CSS styles

---

### `/frontend/src/pages/Officials/officials.css`

**Purpose**: Comprehensive CSS styling for the Officials page and all its components.

**Contains**:

- Layout styles (grid, flexbox)
- Component-specific styles (.official-header, .official-stat-bar, etc.)
- Responsive design adjustments
- Color and typography definitions
- Shadow and spacing utilities

**Key Classes**:

- `.officials-main` - Main container
- `.officials-grid` - 12-column grid layout
- `.officials-sidebar` - Sidebar container
- `.official-*` - Official-specific components
- `.stat-*` - Statistics display
- `.lifecycle-*` - Project lifecycle visualization
- `.audit-*` - Audit summary
- `.contract-*` - Table elements
- `.pattern-*` - Pattern analysis cards

---

### `/frontend/src/pages/Officials/index.jsx`

**Purpose**: Index file for clean imports from the Officials folder.

**Exports**: Default export of Officials component

---

## Component Files

### `/frontend/src/pages/Officials/components/OfficialHeader.jsx`

**Purpose**: Displays the official's profile card with avatar, name, title, and details.

**Props**:

```javascript
{
  official: {
    avatarInitials: string,      // e.g., "MMA"
    name: string,                // e.g., "MD. MENHAJUL ALAM"
    title: string,               // e.g., "Approving Engineer"
    designation: string,         // e.g., "Sub-Assistant Engineer"
    officeCode: string,          // e.g., "Munshiganj District (MN-01)"
    procuringEntity: string      // e.g., "Executive Engineer, LGED..."
  }
}
```

**Layout**: Horizontal (avatar on left, details on right)

---

### `/frontend/src/pages/Officials/components/OfficialStatBar.jsx`

**Purpose**: Renders 6 horizontal stat cards showing approval metrics.

**Props**:

```javascript
{
  stats: {
    approved: number,      // e.g., 7
    totalValue: string,    // e.g., "৳83.27L"
    completed: number,     // e.g., 0
    ongoing: number,       // e.g., 0
    overdue: number,       // e.g., 1
    rate: string           // e.g., "0%"
  }
}
```

**Cards**: 6 equal-width boxes with label and value

---

### `/frontend/src/pages/Officials/components/ProjectLifecycleBar.jsx`

**Purpose**: Visualizes project distribution and status with a stacked progress bar.

**Props**:

```javascript
{
  completedCount: number,
  inProgressCount: number,
  atRiskCount: number,
  lastUpdated: string,              // e.g., "May 20, 2024"
  legendItems: Array<{
    id: number,
    type: string,                   // 'completed', 'in-progress', 'at-risk'
    label: string,
    count: number
  }>
}
```

**Features**:

- Stacked bar with percentage-based widths
- Color-coded segments
- Legend below bar
- Accountability note callout

---

### `/frontend/src/pages/Officials/components/ForensicAuditSummary.jsx`

**Purpose**: Sidebar component showing audit metrics and flagged issues.

**Props**:

```javascript
{
  auditData: {
    accountabilityLevel: string,     // e.g., "MODERATE"
    accountabilityPercent: number,   // 0-100
    completionRate: string,          // e.g., "0%"
    completionPercent: number        // 0-100
  },
  flags: Array<{
    id: number,
    type: string,                    // 'alert' or 'success'
    number: string,                  // e.g., "01"
    label: string                    // e.g., "Impossible Timelines"
  }>
}
```

**Sections**:

- Accountability level with progress bar
- Completion rate with critical progress
- Alert/success flags list

---

### `/frontend/src/pages/Officials/components/ApprovedContractsTable.jsx`

**Purpose**: Data table displaying all approved contracts with statuses.

**Props**:

```javascript
{
  contracts: Array<{
    id: string,                      // e.g., "1244091"
    description: string,
    contractor: string,
    value: string,                   // e.g., "৳ 18,27,906"
    status: string,
    statusType: string,              // 'impossible', 'pending'
    isAlert: boolean,                // Highlights row
    isSecondary: boolean             // Dims text
  }>,
  totalCount: number
}
```

**Features**:

- Header with title and Filter/Export buttons
- 6-column table layout
- Status badges with type-specific styling
- Alert row highlighting (red left border)

---

### `/frontend/src/pages/Officials/components/SystemicPatternCards.jsx`

**Purpose**: 3-column grid displaying audit pattern analysis.

**Props**:

```javascript
{
  patterns: Array<{
    id: number,
    type: string,                    // 'high-risk', 'anomaly', 'integrity'
    badge: string,
    title: string,
    description: string,
    tag: string
  }>
}
```

**Cards**:

- Left border color-coded by type
- Badge label
- Title and description
- Tag/source indicator

---

### `/frontend/src/pages/Officials/components/AccountabilityNote.jsx`

**Purpose**: Reusable component for accountability callout messages.

**Props**:

```javascript
{
  message: string; // The accountability message to display
}
```

**Styling**: Gray background with left border

---

## Asset File

### `/frontend/src/assets/icons.js`

**Purpose**: Centralized icon URLs from Figma design.

**Exports**:

```javascript
export const externalLinkIcon = "...";
export const alertIcon = "...";
export const checkIcon = "...";
export const tableIcon = "...";
export const filterIcon = "...";
export const exportIcon = "...";
export const auditIcon = "...";
```

**Note**: These are Figma asset URLs (7-day expiration). Consider migrating to SVG imports or local PNG assets for production.

---

## Integration Files (Modified)

### `/frontend/src/router/AppRouter.jsx`

**Changes**:

- Added import: `import OfficialsPage from '../pages/Officials'`
- Added route case: `case '/officials': return <OfficialsPage />`

**Impact**: Enables navigation to `/officials` route

---

## Dependencies

### Required Imports (All Present)

- React (via JSX)
- Layout components (Navbar, Footer, PageWrapper)
- CSS styling system variables

### Browser APIs

- Standard DOM APIs (no special requirements)
- CSS Grid and Flexbox support

---

## File Statistics

| File                       | Lines      | Type      | Status       |
| -------------------------- | ---------- | --------- | ------------ |
| Officials.jsx              | ~220       | JSX       | ✅ Complete  |
| OfficialHeader.jsx         | ~43        | JSX       | ✅ Complete  |
| OfficialStatBar.jsx        | ~40        | JSX       | ✅ Complete  |
| ProjectLifecycleBar.jsx    | ~57        | JSX       | ✅ Complete  |
| ForensicAuditSummary.jsx   | ~50        | JSX       | ✅ Complete  |
| ApprovedContractsTable.jsx | ~58        | JSX       | ✅ Complete  |
| SystemicPatternCards.jsx   | ~27        | JSX       | ✅ Complete  |
| AccountabilityNote.jsx     | ~13        | JSX       | ✅ Complete  |
| officials.css              | ~650       | CSS       | ✅ Complete  |
| icons.js                   | ~10        | JS        | ✅ Complete  |
| **Total**                  | **~1,108** | **Mixed** | **✅ Ready** |

---

## Testing Checklist

- [ ] Navigate to `/officials` route - loads without errors
- [ ] All components render with mock data
- [ ] Styling matches Figma design (colors, spacing, typography)
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] All links and buttons visible
- [ ] No console errors or warnings
- [ ] CSS loads correctly (no style flickering)
- [ ] Accessibility: Can tab through interactive elements
- [ ] Performance: Page loads quickly

---

## Next Steps (Optional Enhancements)

### Data Integration

1. Replace mock data with API calls
2. Add loading and error states
3. Implement data pagination/filtering

### Interactivity

1. Hook Filter button to table filtering
2. Implement Export CSV functionality
3. Add sorting capabilities to table

### Assets

1. Replace Figma icon URLs with local assets
2. Optimize image loading
3. Add responsive image sizes

### Analytics

1. Track page views
2. Monitor component performance
3. Log user interactions

---

## Quick Reference

**Navigate to page**: `http://localhost:5173/officials`

**Build project**: `npm run build` (in frontend directory)

**Dev server**: `npm run dev` (in frontend directory)

**Lint code**: `npm run lint` (checks all files)

**Edit styles**: `src/pages/Officials/officials.css`

**Add mock data**: Update `Officials.jsx` officialData object

**Update components**: Edit files in `src/pages/Officials/components/`
