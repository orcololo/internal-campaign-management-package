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

### **Phase 1: Database & Core Backend** (Weeks 1-2)
*Foundation - Get the data layer solid*

#### Week 1: Database Setup
- [ ] **Reports Tables Migration**
  - Create `0004_create_reports_tables.sql`
  - Add `saved_reports` table
  - Add `report_exports` table
  - Run migration and verify

- [ ] **Schema Validation**
  - Review existing `voters` schema
  - Review `calendar_events` schema
  - Verify `geofences` schema exists
  - Document all table relationships

- [ ] **Drizzle Schema Files**
  - Create `saved-report.schema.ts`
  - Create `report-export.schema.ts`
  - Update schema exports

- [ ] **Mock Auth Helper**
  ```typescript
  // common/mock-auth.service.ts
  // Returns hardcoded user for development
  // Easy to swap with real auth later
  ```

**Deliverable:** Database ready, all schemas validated

---

#### Week 2: Core Backend Services
- [ ] **Reports Module Structure**
  ```
  reports/
  ├── reports.module.ts
  ├── reports.controller.ts
  ├── reports.service.ts
  ├── saved-reports.service.ts
  ├── query-builder.service.ts
  └── dto/
  ```

- [ ] **Query Builder Service**
  - Implement all 15 filter operators
  - Build dynamic WHERE clauses
  - Build ORDER BY clauses
  - Build SELECT clauses
  - Unit tests for each operator

- [ ] **Reports Service**
  - `executeReport()` method
  - `previewReport()` with pagination
  - Integration with QueryBuilder
  - Test with mock data

- [ ] **Saved Reports Service**
  - CRUD operations (create, findAll, findOne, update, remove)
  - Soft delete implementation
  - Usage statistics tracking
  - Search and filtering

- [ ] **Basic Controller**
  - POST `/reports` - Create
  - GET `/reports` - List (with pagination)
  - GET `/reports/:id` - Get one
  - PATCH `/reports/:id` - Update
  - DELETE `/reports/:id` - Delete
  - POST `/reports/:id/preview` - Preview data
  - **Mock auth decorator** (returns test user)

**Deliverable:** Reports CRUD API working, testable via Postman

---

### **Phase 2: Export & Processing** (Weeks 3-4)
*Make reports downloadable*

#### Week 3: Export Services
- [ ] **Dependencies Installation**
  ```bash
  pnpm add puppeteer handlebars exceljs csv-writer
  pnpm add -D @types/puppeteer
  ```

- [ ] **PDF Generator Service**
  - Setup Puppeteer
  - Create HTML template (`templates/report-template.html`)
  - Implement `generate()` method
  - Test with sample data
  - Handle charts/images if `includeCharts: true`

- [ ] **CSV Generator Service**
  - Implement with csv-writer
  - Proper encoding (UTF-8 BOM for Excel)
  - Delimiter configuration (`;` for Brazil)
  - Test with special characters

- [ ] **Excel Generator Service**
  - Implement with ExcelJS
  - Header styling (bold, colored)
  - Auto-filter on first row
  - Frozen header row
  - Auto-column width
  - Test with large datasets

- [ ] **Export Controller Endpoint**
  - POST `/reports/:id/export`
  - Accept `format` parameter (pdf, csv, excel)
  - Return file as download
  - Proper headers (Content-Type, Content-Disposition)

**Deliverable:** Can export reports in all 3 formats

---

#### Week 4: Queue System (Optional - for large exports)
- [ ] **Redis Setup**
  ```yaml
  # docker-compose.yml - add Redis service
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  ```

- [ ] **Bull Integration**
  ```bash
  pnpm add @nestjs/bull bull
  pnpm add -D @types/bull
  ```

- [ ] **Export Queue**
  - Configure Bull module
  - Create `ExportReportProcessor`
  - Handle job retries
  - Job progress tracking
  - Error handling

- [ ] **Job Status Endpoint**
  - GET `/reports/exports/:jobId/status`
  - Return job state (pending, processing, completed, failed)
  - Return download URL when complete

- [ ] **Threshold Logic**
  - If dataset > 5000 records → queue
  - If dataset ≤ 5000 records → generate immediately
  - Configurable via environment variable

**Deliverable:** Large exports handled asynchronously

---

### **Phase 3: Frontend Integration** (Week 5)
*Connect real APIs to replace mock data*

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

### **Phase 4: Voters Module Enhancement** (Week 6)
*Complete the voters functionality*

- [ ] **Backend Verification**
  - Ensure voters CRUD exists
  - Test all endpoints
  - Add missing endpoints if needed

- [ ] **Google Maps Integration**
  - Address autocomplete component
  - Map view with voter markers
  - Clustering for many voters
  - Click marker to see voter details

- [ ] **Import/Export**
  - CSV import endpoint (POST `/voters/import`)
  - Parse CSV with validation
  - Bulk create voters
  - Return success/error report
  - CSV/Excel export of voters list

- [ ] **Bulk Operations**
  - Select multiple voters (checkboxes)
  - Bulk delete
  - Bulk update (change support level, tags, etc.)
  - Bulk assign to geofence

- [ ] **Referral System** (já implementado no frontend)
  - Backend for referral tracking
  - Referral link generation
  - Track referral conversions
  - Referral analytics

**Deliverable:** Complete voters management system

---

### **Phase 5: Geofences Implementation** (Week 7)
*Geographic segmentation*

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
*Event management system*

- [ ] **Backend Schema Verification**
  ```typescript
  // calendar_events table (likely exists)
  - id, title, description
  - startDate, endDate, allDay
  - location, address
  - type, category
  - attendees, capacity
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
*Data insights and visualizations*

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
*Automation layer*

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
*Quality assurance*

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
*Final layer - plug in real auth*

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

## 🎯 Quick Start Action Plan

### **This Week (Week 1)**
**Day 1-2:** Database migration for reports tables
```bash
cd apps/api
# Create migration file
code drizzle/0004_create_reports_tables.sql
# Copy schema from docs/13-reports-backend-implementation.md
pnpm db:migrate
pnpm db:studio # Verify tables created
```

**Day 3-4:** Create mock auth service
```typescript
// apps/api/src/common/mock-auth.service.ts
@Injectable()
export class MockAuthService {
  getMockUser() {
    return {
      id: 'mock-user-123',
      email: 'candidato@example.com',
      role: 'CANDIDATO',
      tenantId: 'mock-tenant-123',
    };
  }
}

// Mock guard
@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: 'mock-user-123',
      email: 'candidato@example.com',
      role: 'CANDIDATO',
      tenantId: 'mock-tenant-123',
    };
    return true;
  }
}
```

**Day 5:** Reports module structure + DTOs
```bash
mkdir -p apps/api/src/reports/dto
mkdir -p apps/api/src/reports/export
# Create all DTO files
# Create basic module/controller/service files
```

### **Next Week (Week 2)**
Focus on QueryBuilderService and ReportsService implementation

---

## 📦 Dependencies Checklist

### Backend
```json
{
  "dependencies": {
    "@nestjs/bull": "^10.0.1",
    "bull": "^4.11.5",
    "puppeteer": "^21.6.1",
    "exceljs": "^4.4.0",
    "csv-writer": "^1.6.0",
    "handlebars": "^4.7.8"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "recharts": "^2.10.3",
    "keycloak-js": "^23.0.0"
  }
}
```

### Infrastructure
- Redis (Docker)
- PostgreSQL (already setup)
- n8n (Docker)
- Keycloak (Docker) - Week 13+

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

### By Week 6 (Mid-point)
- ✅ Reports system fully working (frontend + backend)
- ✅ Voters CRUD complete with import/export
- ✅ Geofences implemented
- ✅ All features using mock auth
- ✅ No authentication blockers

### By Week 12 (Pre-Auth)
- ✅ All core features complete
- ✅ Analytics dashboard working
- ✅ n8n workflows setup
- ✅ Tested and bug-free
- ✅ Ready for auth integration

### By Week 14 (Complete)
- ✅ Keycloak integrated
- ✅ Role-based access control working
- ✅ Multi-tenancy validated
- ✅ **Production ready**

---

## 💡 Key Principles

1. **Mock Auth Early** - Don't wait for Keycloak
2. **Test with Real Data** - Use production-like datasets
3. **Iterate Quickly** - Ship features incrementally
4. **Document as You Go** - Don't leave docs for later
5. **Auth is a Plugin** - Design so auth can be swapped easily

---

**Ready to start? Begin with Week 1, Day 1: Database Migration**

Let me know when you want to start implementing! 🚀
