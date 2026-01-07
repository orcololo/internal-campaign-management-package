# Frontend Implementation TODO List

## Status: 15/26 Complete (58%)

---

## 🔧 RECENT FIXES (January 2026)

### Build & Runtime Fixes
1. **Zod Schema Type Inference**: Fixed `tags` field in voter form validation
   - Changed from `.default([])` to `z.array(z.string())` (required field)
   - Ensured form defaultValues always provides an array with `|| []` fallback
   - Files: `lib/validators/voters.ts`, `components/features/voters/voter-form.tsx`

2. **Next.js 16 Dynamic Routes**: Fixed params handling in dynamic routes
   - Changed `params: { id: string }` to `params: Promise<{ id: string }>`
   - Added `const { id } = await params;` to unwrap promise
   - Files: `app/(dashboard)/voters/[id]/page.tsx`, `app/(dashboard)/voters/[id]/edit/page.tsx`

3. **Resizable Component**: Temporarily disabled unused component
   - react-resizable-panels@4.2.2 has type definition issues with PanelGroup
   - Component not used anywhere in the codebase
   - File renamed: `components/ui/resizable.tsx.disabled`

### Build Status
- ✅ TypeScript compilation: **PASSING**
- ✅ Next.js build: **SUCCESS**
- ✅ All routes tested: **200 OK**
  - `/` - Homepage
  - `/voters` - Voters list
  - `/voters/voter-1` - Voter detail
  - `/voters/new` - Create voter
  - `/voters/voter-1/edit` - Edit voter

---

## ✅ COMPLETED TASKS (15)

### Phase 0: Setup & Infrastructure
- [x] **Install missing npm packages** (react-hook-form, @hookform/resolvers, zod, sonner, date-fns)
- [x] **Install all shadcn/ui components** (~30 components: form, dialog, alert-dialog, drawer, popover, breadcrumb, command, tabs, accordion, sonner, calendar, radio-group, switch, slider, carousel, toggle, etc.)
- [x] **Create API client infrastructure** (client.ts, mock-adapter.ts, types.ts)
- [x] **Create type definitions** (voters.ts, api.ts, campaign.ts)
- [x] **Create mock data files** (voters.ts with 100 records, analytics.ts)
- [x] **Create campaign store** (campaign-store.ts using Zustand)
- [x] **Create validators** (voters.ts with multi-step schemas, common.ts)
- [x] **Create voters API endpoints** (endpoints/voters.ts, endpoints/analytics.ts)

### Phase 1: Voters Management
- [x] **Build voters table component** (following leads-table pattern with search, filters, sorting, pagination, row selection)
- [x] **Create voters list page** (app/(dashboard)/voters/page.tsx)
- [x] **Build voter form** (multi-step with validation: basic info, location, political)
- [x] **Create voter detail pages** (detail, edit, new pages)
- [x] **Update sidebar** (added campaign navigation with Eleitores section)
- [x] **Fix TypeScript errors** (Zod schema types, Next.js 16 params handling)
- [x] **Test implementation** (build successful, all routes working)

---

## 🚧 IN PROGRESS (0)

_No tasks currently in progress_

---

## ⏳ PENDING TASKS (11)

### Phase 1: Voters Management (Remaining)
- [ ] **Build import/export dialogs for voters**
  - CSV import with field mapping
  - Preview before import
  - Export with filter options
  - Excel export support
  - Files: `bulk-import-dialog.tsx`, `export-dialog.tsx`

### Phase 2: Analytics Dashboard
- [ ] **Create metric card component**
  - Reusable card with title, value, change %
  - Trend indicator (up/down/neutral arrow)
  - Optional mini sparkline chart
  - Icon support
  - File: `components/composed/charts/metric-card.tsx`

- [ ] **Build analytics chart components**
  - Overview chart (multi-line: voters, events, engagement)
  - Voter demographics (pie/bar charts)
  - Engagement chart (time series)
  - Geographic heatmap (MapLibre integration)
  - Files: `overview-chart.tsx`, `voter-demographics.tsx`, `engagement-chart.tsx`, `geographic-heatmap.tsx`

- [ ] **Update dashboard homepage with campaign metrics**
  - Replace current maps view with campaign dashboard
  - 4 metric cards (voters, events, engagement, coverage)
  - Overview chart and recent activity
  - Tabs for different analytics views
  - File: Update `app/(dashboard)/page.tsx`

- [ ] **Create analytics page with detailed charts**
  - Comprehensive analytics view
  - Filters (date range, location, support level)
  - Export report button
  - Multiple chart types
  - File: `app/(dashboard)/analytics/page.tsx`

### Phase 3: Navigation & Layout
- [ ] **Create dashboard header**
  - Campaign switcher dropdown (left)
  - Breadcrumbs (center)
  - Search button (Cmd+K)
  - Notifications bell
  - User avatar dropdown
  - File: `components/dashboard/header.tsx`

- [ ] **Create campaign switcher component**
  - Dropdown with campaigns list
  - "Create Campaign" option
  - Show current campaign
  - File: `components/features/campaigns/campaign-switcher.tsx`

- [ ] **Update dashboard layout to include header**
  - Add DashboardHeader above children
  - Add Sonner Toaster for notifications
  - Proper spacing and structure
  - File: Update `app/(dashboard)/layout.tsx`

### Phase 4: Utilities & Infrastructure
- [ ] **Create utility functions**
  - Format functions (date, phone, name, truncate)
  - Validator functions (email, phone, CPF)
  - Files: `lib/utils/format.ts`, `lib/utils/validators.ts`

- [ ] **Create custom hooks**
  - use-debounce for search inputs
  - use-local-storage for preferences
  - use-voters for data fetching (optional)
  - Files: `lib/hooks/use-debounce.ts`, `lib/hooks/use-local-storage.ts`, `lib/hooks/use-voters.ts`

- [ ] **Create feedback components**
  - Empty state (no data with CTA)
  - Loading skeleton (table, card, page variants)
  - Error boundary (catch errors in tree)
  - Files: `empty-state.tsx`, `loading-skeleton.tsx`, `error-boundary.tsx`


---

## 📋 DETAILED TASK BREAKDOWN

### Import/Export Dialogs (High Priority)

**bulk-import-dialog.tsx:**
```typescript
Features needed:
- File upload (CSV)
- Field mapping interface
- Preview table (first 10 rows)
- Validation warnings
- Progress indicator
- Success/error messages
```

**export-dialog.tsx:**
```typescript
Features needed:
- Format selection (CSV, Excel)
- Field selection checkboxes
- Filter application
- Date range picker
- Download button
- Progress indicator
```

### Metric Card Component (Medium Priority)

**metric-card.tsx:**
```typescript
Props needed:
- title: string
- value: string | number
- change?: number (percentage)
- trend?: 'up' | 'down' | 'neutral'
- data?: Array<{ value: number }> (for sparkline)
- icon?: ReactNode
```

### Analytics Charts (Medium Priority)

**overview-chart.tsx:**
```typescript
Features needed:
- Multi-line chart (Recharts)
- Time period selector (week/month/quarter)
- Legend with toggles
- Responsive sizing
- Tooltip with formatting
```

**voter-demographics.tsx:**
```typescript
Charts needed:
- Support level pie chart
- State distribution bar chart
- City distribution bar chart
- Contact methods (email/phone/WhatsApp)
```

### Dashboard Header (High Priority)

**header.tsx:**
```typescript
Sections needed:
- Left: Campaign switcher dropdown
- Center: Dynamic breadcrumbs
- Right: Search (Cmd+K), Notifications, User menu
- Mobile: Hamburger menu
```

### Utility Functions (Low Priority)

**format.ts:**
```typescript
Functions needed:
- formatDate(date: Date | string, format?: string): string
- formatPhone(phone: string): string
- formatName(name: string): string (title case)
- truncate(text: string, length: number): string
```

**validators.ts:**
```typescript
Functions needed:
- isValidEmail(email: string): boolean
- isValidPhone(phone: string): boolean
- isValidCPF(cpf: string): boolean
```

### Custom Hooks (Low Priority)

**use-debounce.ts:**
```typescript
Hook signature:
- useDebounce<T>(value: T, delay: number): T
```

**use-local-storage.ts:**
```typescript
Hook signature:
- useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

---

## 🎯 PRIORITIES

### Must Have (Before Production)
1. Test current implementation (fix any bugs)
2. Dashboard header with navigation
3. Campaign switcher
4. Analytics dashboard with charts
5. Empty states and loading skeletons
6. Error handling

### Should Have (Phase 2)
1. Import/Export dialogs
2. Utility functions and hooks
3. Search command palette (Cmd+K)
4. Notifications system
5. User menu with settings

### Nice to Have (Future)
1. Advanced filters in voters table
2. Bulk actions for multiple voters
3. Export analytics reports
4. Mobile-optimized views
5. Keyboard shortcuts

---

## 📝 NOTES

### Current Blockers
- None! All infrastructure is in place

### Dependencies Between Tasks
- Dashboard homepage needs metric card component first
- Analytics page needs all chart components first
- Layout update needs header component first
- Import dialog needs utility functions (format, validate)

### Testing Strategy
1. **Unit Tests**: Not implemented yet (consider adding later)
2. **Manual Testing**: Test each feature in browser
3. **TypeScript**: Compile-time checks ensure type safety
4. **Mock Data**: Easy testing without backend

### Performance Considerations
- Use React.memo for expensive components
- Implement virtual scrolling if voter list > 1000
- Lazy load chart components
- Optimize bundle size (check with next build --profile)

### Accessibility TODO
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works everywhere
- Test with screen reader
- Check color contrast ratios
- Add focus indicators

---

## 🚀 QUICK START

### To Continue Development:

```bash
# Navigate to web app
cd apps/web

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# Open browser
http://localhost:3000/voters
```

### To Test Current Features:

1. **List Voters**: `/voters` - See all 100 mock voters
2. **Create Voter**: `/voters/new` - Test 3-step form
3. **View Voter**: `/voters/voter-1` - See detail page
4. **Edit Voter**: `/voters/voter-1/edit` - Test form with data
5. **Search**: Type in search box on voters page
6. **Filter**: Use filter dropdown (city, state, support level)
7. **Sort**: Click column headers or use sort dropdown
8. **Paginate**: Change page size and navigate pages

---

## 📊 PROGRESS TRACKING

### Overall Progress: 58%

```
██████████████░░░░░░░░░░  15/26 tasks complete
```

### By Phase:

**Phase 0 (Setup)**: 100% ████████████████████
- 8/8 tasks complete

**Phase 1 (Voters)**: 88% ██████████████████░░
- 7/8 tasks complete (import/export pending)

**Phase 2 (Analytics)**: 0% ░░░░░░░░░░░░░░░░░░░░
- 0/4 tasks complete

**Phase 3 (Navigation)**: 0% ░░░░░░░░░░░░░░░░░░░░
- 0/3 tasks complete

**Phase 4 (Utilities)**: 0% ░░░░░░░░░░░░░░░░░░░░
- 0/3 tasks complete

**Testing**: 0% ░░░░░░░░░░░░░░░░░░░░
- 0/1 tasks complete

---

## 🎉 COMPLETED MILESTONES

1. ✅ **Full Infrastructure** - API client, mock data, types, validation
2. ✅ **Voters CRUD** - Complete create, read, update functionality
3. ✅ **Advanced Table** - Search, filter, sort, paginate with 100 records
4. ✅ **Multi-Step Form** - 3-step form with validation
5. ✅ **Navigation** - Sidebar updated with campaign sections
6. ✅ **Build & Testing** - TypeScript compilation passing, all routes working

---

## 🎯 NEXT MILESTONES

1. ⏳ **Analytics Dashboard** - Metric cards and charts
2. ⏳ **Navigation Enhancement** - Header, breadcrumbs, search
3. ⏳ **Polish & UX** - Empty states, loading, error handling
4. ⏳ **Import/Export** - Bulk operations for voters

---

**Last Updated**: January 2026
**Current Sprint**: Testing & Bug Fixes → Analytics Dashboard
