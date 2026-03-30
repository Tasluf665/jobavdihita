# Officials Page - Component Breakdown

## Page Layout Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          NAVBAR                                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────── PAGE CONTENT ─────────────────────────────────┐
│                                                                                │
│  HERO SECTION                                                                  │
│  ├─ Title: "Officials & Engineers"                                            │
│  └─ Subtitle: "Public accountability profile..."                              │
│                                                                                │
│  MAIN GRID (12-column)                                                         │
│  ├─ LEFT CONTENT (8 columns)                                                  │
│  │  ├─ Official Header Card                                                   │
│  │  │  ├─ Avatar (128×128 with initials)                                     │
│  │  │  ├─ Name & Role Badge                                                   │
│  │  │  └─ 2×2 Details Grid                                                    │
│  │  │                                                                          │
│  │  ├─ Official Stat Bar (6 cards)                                            │
│  │  │  ├─ Approved (7)                                                        │
│  │  │  ├─ Total Value (৳83.27L)                                               │
│  │  │  ├─ Completed (0)                                                       │
│  │  │  ├─ Ongoing (0)                                                         │
│  │  │  ├─ Overdue (1) [RED]                                                   │
│  │  │  └─ Rate (0%) [GRAY]                                                    │
│  │  │                                                                          │
│  │  └─ Project Lifecycle Bar                                                  │
│  │     ├─ Stacked bar visualization                                           │
│  │     ├─ "100% AT RISK" status message                                       │
│  │     ├─ Color legend (Green/Blue/Red)                                       │
│  │     └─ Accountability note callout                                         │
│  │                                                                             │
│  ├─ SIDEBAR (4 columns)                                                       │
│  │  ├─ Forensic Audit Summary                                                 │
│  │  │  ├─ Accountability Level (MODERATE, 50%)                                │
│  │  │  ├─ Completion Rate (0%, 100%)                                          │
│  │  │  └─ Flagged Issues List                                                 │
│  │  │     ├─ Impossible Timelines [01]                                        │
│  │  │     └─ Unverified Payments [00]                                         │
│  │  │                                                                          │
│  │  └─ (Pushes below on mobile)                                               │
│  │                                                                             │
│  ├─ CONTRACTS TABLE (12 columns)                                              │
│  │  ├─ Header with title + Filter/Export buttons                              │
│  │  └─ 7 contract rows                                                        │
│  │     ├─ ID | Description | Contractor | Value | Status | Audit             │
│  │     └─ First row highlighted (ALERT style)                                 │
│  │                                                                             │
│  └─ PATTERN CARDS SECTION (12 columns)                                        │
│     ├─ 3-column grid                                                          │
│     ├─ High Risk Pattern (RED border)                                         │
│     ├─ Financial Anomaly (YELLOW border)                                      │
│     └─ Payment Integrity (GREEN border)                                       │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Tree

```
Officials (Main Page)
├── Navbar (shared component)
├── PageWrapper (shared component)
├── Hero Section (inline)
├── Main Grid
│   ├── Left Content (8 cols)
│   │   ├── OfficialHeader
│   │   │   └── displays avatar, name, role, details
│   │   ├── OfficialStatBar
│   │   │   └── 6 stat cards in horizontal layout
│   │   └── ProjectLifecycleBar
│   │       ├── Stacked bar chart
│   │       └── AccountabilityNote (sub-component)
│   │
│   ├── Sidebar (4 cols)
│   │   └── ForensicAuditSummary
│   │       └── audit metrics, progress bars, flags
│   │
│   ├── Contracts Table (12 cols)
│   │   └── ApprovedContractsTable
│   │       └── data table with 7 rows
│   │
│   └── Pattern Cards (12 cols)
│       └── SystemicPatternCards
│           └── 3 pattern cards with badges
│
└── Footer (shared component)
```

## Color Scheme

| Element        | Color            | Hex     | Purpose                    |
| -------------- | ---------------- | ------- | -------------------------- |
| Primary Text   | --text-primary   | #171c1f | Headings, main content     |
| Secondary Text | --text-secondary | #424655 | Labels, captions           |
| Info           | --info           | #0d6efd | Ongoing status, links      |
| Success        | --success        | #198754 | Completed status, positive |
| Danger         | --danger         | #ba1a1a | Alerts, critical           |
| Danger Alt     | -                | #dc3545 | Overdue, errors            |
| Warning        | -                | #ffc107 | Moderate risk              |
| Background     | --bg-page        | #f6fafe | Page background            |
| Surface        | --bg-surface     | #ffffff | Cards, panels              |
| Soft BG        | --bg-soft        | #f0f4f8 | Secondary backgrounds      |

## Key Features

### Responsive Behavior

- **Desktop**: 8-col main + 4-col sidebar
- **Tablet**: Stacked layout
- **Mobile**: Full width, single column

### Interactive Elements

- Filter button (not yet implemented)
- Export CSV button (not yet implemented)
- External links to e-GP profile

### State Indicators

- **Red**: Critical/Alert (Overdue contracts)
- **Yellow**: Warning (Moderate audit level)
- **Green**: Success (Zero payment issues)
- **Blue**: Info (In-progress items)
- **Gray**: Inactive/Pending (0 completed)

### Data-Driven Components

- All components accept props
- Easy to connect to API data
- Mock data provided for development

## Styling Highlights

### Custom Properties Used

```css
--font-sans:
  Inter, -apple-system,
  etc. --bg-page: #f6fafe --bg-surface: #ffffff --text-primary: #171c1f
    --text-secondary: #424655 --text-link: #0057cd
    --border-soft: rgba(194, 198, 216, 0.25) --shadow-card: 0 12px 32px -4px
    rgba(23, 28, 31, 0.08) --radius-md: 8px --container-width: 1280px;
```

### Grid System

- 12-column grid throughout
- 32px gap between major sections
- 16-24px padding for cards
- Consistent border-radius: 8px

### Typography

- **Headings**: Inter Black (900 weight)
- **Body**: Inter Regular (400 weight)
- **Captions**: Inter Bold (700 weight)
- **Monospace**: Liberation Mono (IDs in table)

## How to Extend

### Adding New Data

1. Modify the mock data object in `Officials.jsx`
2. Update prop types in each component
3. Components will automatically re-render

### Adding Interactivity

1. Hook filter/export buttons to state management
2. Connect to backend API for contract data
3. Implement sorting/pagination on table

### Styling Changes

1. Edit `/frontend/src/pages/Officials/officials.css`
2. Respect CSS variable names for consistency
3. Test at different breakpoints

### Reusing Components

- All components are self-contained
- Can be imported into other pages
- Props-driven architecture enables flexibility
