# Implementation Roadmap - Campaign Platform

**Data:** 12 de janeiro de 2026  
**Estratégia:** Core Features First → Authentication Last

---

## 🎯 Strategy Overview

**Philosophy:** Build and validate core functionality with mock auth, then integrate real authentication as the final layer.

**Benefits:**

- ✅ Faster iteration on features
- ✅ No auth blockers during development
- ✅ Test business logic independently
- ✅ Team can work in parallel
- ✅ Authentication becomes a "plug-in" at the end

---

## 📊 Implementation Phases (12 Weeks)

### **Phase 1: Database & Core Backend** (Weeks 1-2) ✅ **COMPLETE**

_Foundation - Get the data layer solid_

#### Week 1: Database Setup ✅

- [x] **Reports Tables Migration**

  - Create `0004_create_reports_tables.sql`
  - Add `saved_reports` table
  - Add `report_exports` table
  - Run migration and verify

- [x] **Schema Validation**

  - Review existing `voters` schema
  - Review `calendar_events` schema
  - Verify `geofences` schema exists
  - Document all table relationships

- [x] **Drizzle Schema Files**

  - Create `saved-report.schema.ts`
  - Create `report-export.schema.ts`
  - Update schema exports

- [x] **Mock Auth Helper**
  ```typescript
  // common/mock-auth.service.ts
  // Returns hardcoded user for development
  // Easy to swap with real auth later
  ```

**Deliverable:** ✅ Database ready, all schemas validated  
**Documentation:** See [WEEK-1-IMPLEMENTATION.md](docs/WEEK-1-IMPLEMENTATION.md)

---

#### Week 2: Core Backend Services ✅

- [x] **Reports Module Structure**

  ```
  reports/
  ├── reports.module.ts
  ├── reports.controller.ts
  ├── reports.service.ts
  ├── saved-reports.service.ts
  ├── query-builder.service.ts
  └── dto/
  ```

- [x] **Query Builder Service**

  - Implement all 15 filter operators
  - Build dynamic WHERE clauses
  - Build ORDER BY clauses
  - Build SELECT clauses
  - Unit tests for each operator

- [x] **Reports Service**

  - `executeReport()` method
  - `previewReport()` with pagination
  - Integration with QueryBuilder
  - Test with mock data

- [x] **Saved Reports Service**

  - CRUD operations (create, findAll, findOne, update, remove)
  - Soft delete implementation
  - Usage statistics tracking
  - Search and filtering

- [x] **Basic Controller**
  - POST `/reports` - Create
  - GET `/reports` - List (with pagination)
  - GET `/reports/:id` - Get one
  - PATCH `/reports/:id` - Update
  - DELETE `/reports/:id` - Delete
  - POST `/reports/:id/preview` - Preview data
  - **Mock auth decorator** (returns test user)

**Deliverable:** ✅ Reports CRUD API working, testable via Postman  
**Documentation:** See [WEEK-2-IMPLEMENTATION.md](docs/WEEK-2-IMPLEMENTATION.md) and [WEEK-2-COMPLETION-SUMMARY.md](docs/WEEK-2-COMPLETION-SUMMARY.md)

---

### **Phase 2: Export & Processing** (Weeks 3-4) ✅ **COMPLETE**

_Make reports downloadable_

#### Week 3: Export Services ✅

- [x] **Dependencies Installation**

  ```bash
  pnpm add puppeteer handlebars exceljs csv-writer
  pnpm add -D @types/puppeteer
  ```

- [x] **PDF Generator Service**

  - Setup Puppeteer
  - Create HTML template (`templates/report-template.hbs`)
  - Implement `generate()` method
  - Test with sample data
  - Handle charts/images if `includeCharts: true`

- [x] **CSV Generator Service**

  - Implement with csv-writer
  - Proper encoding (UTF-8 BOM for Excel)
  - Delimiter configuration (`;` for Brazil)
  - Test with special characters

- [x] **Excel Generator Service**

  - Implement with ExcelJS
  - Header styling (bold, colored)
  - Auto-filter on first row
  - Frozen header row
  - Auto-column width
  - Test with large datasets

- [x] **Export Controller Endpoint**
  - POST `/reports/:id/export`
  - Accept `format` parameter (pdf, csv, excel)
  - Return file as download
  - Proper headers (Content-Type, Content-Disposition)

**Deliverable:** ✅ Can export reports in all 3 formats

---

#### Week 4: Queue System ✅

- [x] **Redis Setup**

  ```yaml
  # Using external Redis cloud instance (not Docker)
  # REDIS_URL in .env
  ```

- [x] **Bull Integration**

  ```bash
  pnpm add @nestjs/bull bull
  pnpm add -D @types/bull
  ```

- [x] **Export Queue**

  - Configure Bull module
  - Create `ExportReportProcessor`
  - Handle job retries
  - Job progress tracking
  - Error handling

- [x] **Job Status Endpoint**

  - GET `/reports/exports/:jobId/status`
  - Return job state (pending, processing, completed, failed)
  - Return download URL when complete

- [x] **Threshold Logic**
  - If dataset > 5000 records → queue
  - If dataset ≤ 5000 records → generate immediately
  - Configurable via environment variable

**Deliverable:** ✅ Large exports handled asynchronously  
**Documentation:** See [PHASE-2-COMPLETION.md](docs/PHASE-2-COMPLETION.md)

---

### **Phase 3: Frontend Integration** (Week 5)

_Connect real APIs to replace mock data_

- [ ] **API Client Setup**

  ```typescript
  // lib/api/client.ts - Axios instance with interceptors
  // lib/api/reports.ts - Reports API methods
  ```

- [ ] **Reports Store Update**

  - Replace mock data with API calls
  - Add loading states
  - Add error handling
  - Implement optimistic updates

- [ ] **API Integration**

  - `fetchReports()` → GET `/reports`
  - `createReport()` → POST `/reports`
  - `updateReport()` → PATCH `/reports/:id`
  - `deleteReport()` → DELETE `/reports/:id`
  - `previewReport()` → POST `/reports/:id/preview`
  - `exportReport()` → POST `/reports/:id/export`

- [ ] **Error Handling**

  - Toast notifications for errors
  - Retry logic for network failures
  - Validation error display
  - Loading skeletons

- [ ] **Real Data Testing**
  - Test with actual voter data
  - Verify all 15 filters work
  - Verify sorting works
  - Verify pagination works
  - Test export downloads

**Deliverable:** Reports system fully functional end-to-end

---

### **Phase 4: Voters Module Enhancement** (Week 6) ✅ **COMPLETE**

_Complete the voters functionality_

- [x] **Backend Verification**

  - Ensure voters CRUD exists (24 endpoints verified)
  - Test all endpoints
  - Add missing endpoints if needed

- [x] **Google Maps Integration**

  - Address autocomplete component (NEW)
  - Map view with voter markers (MapLibre GL - already existed)
  - Color-coded markers by support level
  - Click marker to see voter details

- [x] **Import/Export**

  - CSV import endpoint (POST `/voters/import/csv`)
  - Parse CSV with validation
  - Bulk create voters
  - Return success/error report
  - CSV/Excel export of voters list

- [x] **Bulk Operations**

  - Select multiple voters (checkboxes)
  - Bulk delete (POST `/voters/bulk/delete`)
  - Bulk update (PATCH `/voters/bulk/update`)
  - Bulk assign to geofence

- [x] **Referral System**
  - Backend for referral tracking
  - Referral link generation
  - Track referral conversions
  - Referral analytics

**Deliverable:** ✅ Complete voters management system  
**Documentation:** See [PHASE-4-COMPLETION.md](docs/PHASE-4-COMPLETION.md) and [VOTERS-ALIGNMENT-ANALYSIS.md](docs/VOTERS-ALIGNMENT-ANALYSIS.md)

---

### **Phase 5: Geofences Implementation** (Week 7)

_Geographic segmentation_

- [ ] **Backend Schema**

  ```typescript
  // geofences table
  - id, name, description
  - geometry (PostGIS POLYGON or JSON)
  - color, fillOpacity
  - createdBy, createdAt, updatedAt
  ```

- [ ] **Geofences CRUD**

  - POST `/geofences` - Create
  - GET `/geofences` - List all
  - GET `/geofences/:id` - Get one
  - PATCH `/geofences/:id` - Update
  - DELETE `/geofences/:id` - Delete

- [ ] **Geographic Queries**

  - GET `/geofences/:id/voters` - Voters inside geofence
  - POST `/voters/filter-by-location` - Filter by coordinates
  - Use PostGIS or point-in-polygon algorithms

- [ ] **Frontend Drawing Tools**

  - Integrate Google Maps Drawing Manager
  - Draw polygon/circle on map
  - Edit existing geofences
  - Save geometry to backend

- [ ] **Voter-Geofence Assignment**
  - Auto-assign voters to geofences based on address
  - Manual assignment
  - Multiple geofences per voter
  - Display geofence on voter detail page

**Deliverable:** Full geofencing capability

---

### **Phase 6: Calendar & Events** (Week 8)

_Event management system_

- [ ] **Backend Schema Verification**

  ```typescript
  // calendar_events table (likely exists)
  -id,
    title,
    description - startDate,
    endDate,
    allDay - location,
    address - type,
    category - attendees,
    capacity;
  ```

- [ ] **Events CRUD**

  - POST `/events` - Create
  - GET `/events` - List (with date range filter)
  - GET `/events/:id` - Get one
  - PATCH `/events/:id` - Update
  - DELETE `/events/:id` - Delete

- [ ] **Calendar Views**

  - Month view (already implemented?)
  - Week view
  - Day view
  - List view

- [ ] **Event-Voter Linking**

  - Invite voters to events
  - Track RSVPs
  - Attendance tracking
  - Send reminders (n8n later)

- [ ] **Event Analytics**
  - Attendance rate
  - Popular event types
  - Timeline of events

**Deliverable:** Complete event management

---

### **Phase 7: Analytics Dashboard** (Weeks 9-10)

_Data insights and visualizations_

#### Week 9: Backend Analytics

- [ ] **Analytics Endpoints**

  - GET `/analytics/overview` - Dashboard summary
  - GET `/analytics/voters-by-support-level`
  - GET `/analytics/voters-by-city`
  - GET `/analytics/voters-by-age-group`
  - GET `/analytics/growth-over-time`
  - GET `/analytics/engagement-metrics`

- [ ] **Aggregation Queries**

  ```sql
  -- Support level distribution
  SELECT support_level, COUNT(*)
  FROM voters
  GROUP BY support_level

  -- Geographic distribution
  SELECT city, state, COUNT(*)
  FROM voters
  GROUP BY city, state
  ORDER BY COUNT(*) DESC

  -- Growth over time
  SELECT DATE(created_at), COUNT(*)
  FROM voters
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at)
  ```

- [ ] **Caching Strategy**
  - Cache expensive queries (Redis)
  - TTL: 5 minutes for dashboard
  - Invalidate on voter create/update/delete

---

#### Week 10: Frontend Charts

- [ ] **Chart Library**

  ```bash
  pnpm add recharts
  # or chart.js, victory, visx
  ```

- [ ] **Dashboard Widgets**

  - Total voters (Card)
  - Growth rate (Card with trend)
  - Support level distribution (Pie chart)
  - Geographic distribution (Bar chart / Map)
  - Engagement over time (Line chart)
  - Top cities (Table)
  - Recent activity (Timeline)

- [ ] **Real-time Updates** (Optional)

  - WebSocket connection
  - Live dashboard updates
  - Notification on new voters

- [ ] **Filters & Date Ranges**
  - Date range picker
  - Filter by region
  - Filter by support level
  - Compare time periods

**Deliverable:** Full analytics dashboard

---

### **Phase 8: n8n Integration & Workflows** (Week 11)

_Automation layer_

- [ ] **n8n Setup**

  ```yaml
  # docker-compose.yml - add n8n
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
  ```

- [ ] **Webhook Endpoints in API**

  - POST `/webhooks/voter-created`
  - POST `/webhooks/event-reminder`
  - POST `/webhooks/campaign-milestone`

- [ ] **n8n Workflows**

  1. **Welcome New Voter**

     - Trigger: Voter created webhook
     - Action: Send welcome email/WhatsApp
     - Action: Assign to onboarding list

  2. **Event Reminder**

     - Trigger: Scheduled (24h before event)
     - Fetch: Events tomorrow
     - Action: Send reminders to attendees

  3. **Birthday Messages**

     - Trigger: Daily at 9am
     - Fetch: Voters with birthday today
     - Action: Send birthday wishes

  4. **Inactive Voter Re-engagement**

     - Trigger: Weekly
     - Fetch: Voters not engaged in 30 days
     - Action: Send re-engagement message

  5. **Report Generation Automation**
     - Trigger: Weekly Monday 8am
     - Action: Generate weekly report
     - Action: Email to campaign team

- [ ] **Workflow Templates**
  - Export workflows as JSON
  - Document in `/docs/n8n-workflows.md`
  - Easy import for new instances

**Deliverable:** Automation framework ready

---

### **Phase 9: Testing & Bug Fixes** (Week 12)

_Quality assurance_

- [ ] **Backend Testing**

  - Unit tests for all services (>80% coverage)
  - Integration tests for controllers
  - E2E tests for critical flows
  - Load testing (k6 or Artillery)

- [ ] **Frontend Testing**

  - Component tests (Jest + React Testing Library)
  - E2E tests (Playwright or Cypress)
  - Visual regression tests (Chromatic)
  - Accessibility audit (a11y)

- [ ] **Bug Bash**

  - Manual testing of all features
  - Fix critical bugs
  - Fix high-priority bugs
  - Document known issues

- [ ] **Performance Optimization**

  - Database query optimization
  - Add missing indexes
  - Frontend bundle size optimization
  - Image optimization
  - Lazy loading

- [ ] **Documentation**
  - API documentation (Swagger/OpenAPI)
  - User guide
  - Developer setup guide
  - Deployment guide

**Deliverable:** Production-ready application (without auth)

---

### **Phase 10: Authentication Integration** (Weeks 13-14) 🔐

_Final layer - plug in real auth_

#### Week 13: Backend Auth

- [ ] **Keycloak Setup**

  - Configure realm
  - Create clients (api, web)
  - Setup roles (CANDIDATO, ESTRATEGISTA, LIDERANCA, ESCRITORIO)
  - Configure user federation (if needed)

- [ ] **NestJS JWT Guard**

  - Install `@nestjs/passport` `passport-jwt`
  - Create `JwtAuthGuard`
  - Validate tokens with Keycloak public key
  - Extract user from token

- [ ] **RBAC Guards**

  - Create `RolesGuard`
  - Create `@Roles()` decorator
  - Apply to all endpoints
  - Test each role's permissions

- [ ] **Replace Mock Auth**

  - Remove `MockAuthGuard`
  - Apply `JwtAuthGuard` to all controllers
  - Update `@CurrentUser()` decorator
  - Test all endpoints require auth

- [ ] **Multi-Tenancy Context**
  - Extract tenant ID from JWT
  - Create `TenantService`
  - Inject tenant context into all queries
  - Verify data isolation

---

#### Week 14: Frontend Auth

- [ ] **Keycloak Client Integration**

  ```bash
  pnpm add keycloak-js
  ```

- [ ] **Auth Context**

  ```typescript
  // context/auth-context.tsx
  // Manage login, logout, token refresh
  ```

- [ ] **Protected Routes**

  - Wrap routes with auth check
  - Redirect to login if not authenticated
  - Store return URL for after login

- [ ] **Login/Logout Flows**

  - Login page or redirect to Keycloak
  - Logout and clear tokens
  - Token refresh logic
  - Handle expired tokens

- [ ] **Role-Based UI**

  - Show/hide features based on role
  - `useAuth()` hook with `hasRole()`
  - Conditionally render admin features
  - Disable buttons for unauthorized actions

- [ ] **API Client Update**
  - Add Authorization header to all requests
  - Handle 401 responses (refresh or redirect)
  - Handle 403 responses (show error)

**Deliverable:** Fully authenticated, production-ready application

---

## 🎯 Implementation Status

### **Completed (January 12, 2026)**

✅ **Phase 1: Database & Core Backend** (Weeks 1-2)

- Database migrations created and run
- Drizzle schemas for saved_reports and report_exports
- Mock auth service implemented
- Query builder with 15 filter operators
- Reports CRUD API (15 endpoints)
- Saved reports service with soft delete

✅ **Phase 2: Export & Processing** (Weeks 3-4)

- PDF generation with Puppeteer + Handlebars
- CSV generation with UTF-8 BOM
- Excel generation with ExcelJS styling
- Bull queue system with external Redis
- Export threshold logic (5000 records)
- Job status and download endpoints

✅ **Phase 4: Voters Module Enhancement** (Week 6)

- Verified 24 existing voters endpoints
- Created Google Maps address autocomplete
- Confirmed MapLibre map visualization
- Verified bulk operations (delete/update)
- Verified CSV import/export
- Verified complete referral system

### **Next Steps: Phase 3 - Frontend Integration** (Week 5)

**Priority:** Connect frontend to backend APIs

```bash
# 1. Create API client
apps/web/lib/api/reports.ts

# 2. Update reports store
apps/web/store/reports-store.ts

# 3. Connect components
- ReportsTable → fetch real data
- ReportForm → create/update reports
- Export UI → trigger downloads

# 4. Test with real data
- All 15 filter operators
- Pagination
- Sorting
- Export downloads (PDF, CSV, Excel)
```

---

## 📦 Dependencies Checklist

### Backend ✅

```json
{
  "dependencies": {
    "@nestjs/bull": "^10.0.1", // ✅ Installed
    "bull": "^4.11.5", // ✅ Installed
    "puppeteer": "^21.6.1", // ✅ Installed
    "exceljs": "^4.4.0", // ✅ Installed
    "csv-writer": "^1.6.0", // ✅ Installed
    "handlebars": "^4.7.8" // ✅ Installed
  }
}
```

### Frontend

```json
{
  "dependencies": {
    "recharts": "^2.10.3", // For Phase 7 (Analytics)
    "keycloak-js": "^23.0.0" // For Phase 10 (Auth)
  }
}
```

### Infrastructure

- ✅ Redis (External cloud instance) - REDIS_URL configured
- ✅ PostgreSQL (already setup)
- ⏳ n8n (Docker) - Pending Phase 8
- ⏳ Keycloak (Docker) - Pending Phase 10

---

## 🔄 Development Workflow

### Without Authentication (Weeks 1-12)

```typescript
// Every request uses mock user
const user = mockAuthService.getMockUser();

// No login required
// Focus on feature development
// Fast iteration
```

### With Authentication (Weeks 13-14)

```typescript
// Replace mock guard with JWT guard
@UseGuards(JwtAuthGuard, RolesGuard)

// Add one decorator to enable real auth
// Minimal code changes needed
```

---

## 🎉 Success Criteria

### By Week 6 (Mid-point) ✅ **ACHIEVED**

- ✅ Reports system fully working (backend complete)
- ✅ Voters CRUD complete with import/export (24 endpoints)
- ✅ Geofences schema ready
- ✅ All features using mock auth
- ✅ No authentication blockers
- ✅ Export system (PDF, CSV, Excel) fully functional
- ✅ Background job processing with Bull/Redis

**Current Status:** Ahead of schedule! Phase 1, 2, and 4 complete.

### By Week 12 (Pre-Auth) 🎯 **IN PROGRESS**

- ⏳ Phase 3: Frontend integration (next)
- ⏳ Phase 5: Geofences implementation
- ⏳ Phase 6: Calendar & events
- ⏳ Phase 7: Analytics dashboard
- ⏳ Phase 8: n8n workflows
- ⏳ Phase 9: Testing & optimization
- ⏳ Ready for auth integration

### By Week 14 (Complete) 🎯 **PLANNED**

- ⏳ Keycloak integrated
- ⏳ Role-based access control working
- ⏳ Multi-tenancy validated
- ⏳ **Production ready**

---

## 💡 Key Principles

1. ✅ **Mock Auth Early** - Implemented in Phase 1
2. ✅ **Test with Real Data** - Backend tested with Postman
3. ✅ **Iterate Quickly** - Completed 3 phases efficiently
4. ✅ **Document as You Go** - Created comprehensive docs for each phase
5. ✅ **Auth is a Plugin** - MockAuthGuard ready to swap with JwtAuthGuard

---

## 📚 Documentation Generated

- [WEEK-1-IMPLEMENTATION.md](docs/WEEK-1-IMPLEMENTATION.md) - Database setup
- [WEEK-2-IMPLEMENTATION.md](docs/WEEK-2-IMPLEMENTATION.md) - Core backend services
- [WEEK-2-COMPLETION-SUMMARY.md](docs/WEEK-2-COMPLETION-SUMMARY.md) - Phase 1 summary
- [PHASE-2-COMPLETION.md](docs/PHASE-2-COMPLETION.md) - Export & processing (850+ lines)
- [PHASE-4-COMPLETION.md](docs/PHASE-4-COMPLETION.md) - Voters module (1000+ lines)
- [VOTERS-ALIGNMENT-ANALYSIS.md](docs/VOTERS-ALIGNMENT-ANALYSIS.md) - Voters module analysis
- [REFERRAL-SYSTEM-IMPLEMENTATION.md](docs/REFERRAL-SYSTEM-IMPLEMENTATION.md) - Referral system docs

---

**Next Action:** Begin Phase 3 (Frontend Integration) - Connect React components to backend APIs

Let me know when you're ready to start Phase 3! 🚀
