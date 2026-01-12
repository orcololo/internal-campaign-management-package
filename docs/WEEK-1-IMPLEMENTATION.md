# Week 1 Implementation - Database Setup

**Date:** 12 de janeiro de 2026  
**Status:** ✅ Complete  
**Phase:** 1 - Database & Core Backend

---

## 📋 Completed Tasks

### 1. ✅ Reports Tables Migration
**File:** `apps/api/drizzle/0004_create_reports_tables.sql`

Created comprehensive migration with:
- **saved_reports table** (14 columns, 5 indexes)
  - Report configurations (filters, sorting, columns as JSONB)
  - Ownership & sharing settings
  - Usage statistics tracking
  - Soft delete support
  
- **report_exports table** (15 columns, 5 indexes)
  - Export tracking (PDF, CSV, Excel)
  - Processing status (pending, processing, completed, failed)
  - File storage metadata
  - Auto-expiration for cleanup

**Comments added for documentation**

---

### 2. ✅ Drizzle Schema Files

#### saved-report.schema.ts
**Location:** `apps/api/src/database/schemas/saved-report.schema.ts`

**Features:**
- Full TypeScript types with Drizzle ORM
- `ReportFilter` interface (field, operator, value, logicalOperator)
- `ReportSort` interface (field, direction)
- `ReportConfig` interface for type safety
- References to `users` table (createdBy)
- JSONB columns for flexible data storage
- Type exports: `SavedReport`, `NewSavedReport`

#### report-export.schema.ts
**Location:** `apps/api/src/database/schemas/report-export.schema.ts`

**Features:**
- Export tracking with status enum
- Format enum (pdf, csv, excel)
- References to `savedReports` and `users` tables
- Applied filters snapshot for audit
- Processing metrics (time, file size)
- Type exports: `ReportExport`, `NewReportExport`, `ExportJobData`

---

### 3. ✅ Mock Authentication Service
**File:** `apps/api/src/common/mock-auth.service.ts`

**Purpose:** Development without Keycloak dependency

**Methods:**
- `getMockUser()` - Returns default CANDIDATO user
- `getMockUserWithRole(role)` - Get user with specific role
- `getMockTenantId()` - Get mock tenant ID
- `hasRole(user, allowedRoles)` - RBAC validation
- `getAllMockUsers()` - Get all role variations

**Mock User Interface:**
```typescript
{
  id: 'mock-user-123',
  email: 'candidato@example.com',
  name: 'João Silva',
  role: 'CANDIDATO',
  tenantId: 'mock-tenant-123',
  keycloakId: 'mock-keycloak-123'
}
```

---

### 4. ✅ Mock Authentication Guard
**File:** `apps/api/src/common/guards/mock-auth.guard.ts`

**Features:**
- `MockAuthGuard` - Injects mock user into request
- `MockRolesGuard` - Validates required roles
- `@Roles()` decorator - Specify allowed roles
- Full RBAC support during development
- Easy migration path to JwtAuthGuard

**Usage Example:**
```typescript
@Controller('reports')
@UseGuards(MockAuthGuard)
export class ReportsController {
  @Get()
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  async findAll(@CurrentUser() user: MockUser) {
    // user is automatically available
  }
}
```

---

### 5. ✅ Current User Decorator
**File:** `apps/api/src/common/decorators/current-user.decorator.ts`

**Purpose:** Extract user from request

**Usage:**
```typescript
@Get()
async findAll(@CurrentUser() user: MockUser) { }

// Extract specific property
@Get()
async findAll(@CurrentUser('id') userId: string) { }
```

---

### 6. ✅ Schema Exports Updated
**File:** `apps/api/src/database/schemas/index.ts`

Added exports:
- `export * from './saved-report.schema';`
- `export * from './report-export.schema';`

---

## 📊 Schema Validation

### ✅ Existing Schemas Verified

1. **users** (`user.schema.ts`)
   - Full RBAC with 4 roles
   - Keycloak integration ready
   - Soft delete support
   - ✅ Ready for reports integration

2. **voters** (`voter.schema.ts`)
   - 60+ fields for segmentation
   - Enums: gender, education, income, marital status, support level
   - Address & geolocation fields
   - AI engagement fields (added in migration 0003)
   - ✅ Ready for reports filtering

3. **events** (`event.schema.ts`)
   - Event types: COMICIO, REUNIAO, VISITA, etc.
   - Status: AGENDADO, EM_ANDAMENTO, CONCLUIDO, etc.
   - Date/time fields
   - Location information
   - ✅ Ready for calendar module

4. **geofences** (`geofence.schema.ts`)
   - Circle and Polygon types
   - GeoJSON support
   - Associated location data
   - ✅ Ready for geographic features

5. **analytics** (`analytics.schema.ts`)
   - Pre-built analytics tracking
   - ✅ Ready for dashboard

6. **canvassing** (`canvassing.schema.ts`)
   - Field operation tracking
   - ✅ Ready for campaign activities

---

## 🚀 Next Steps (Week 2)

### Reports Module Implementation

1. **Create Module Structure**
```bash
mkdir -p apps/api/src/reports/dto
mkdir -p apps/api/src/reports/export
mkdir -p apps/api/src/reports/processors
mkdir -p apps/api/src/reports/templates
```

2. **Implement DTOs**
   - `create-report.dto.ts`
   - `update-report.dto.ts`
   - `export-report.dto.ts`
   - `filter-report.dto.ts`

3. **Implement Services**
   - `query-builder.service.ts` - Convert filters to SQL
   - `reports.service.ts` - Execute queries
   - `saved-reports.service.ts` - CRUD operations

4. **Create Controller**
   - `reports.controller.ts` - REST endpoints
   - Apply `@UseGuards(MockAuthGuard)`
   - Add RBAC with `@Roles()`

---

## 🎯 Migration Instructions

### To Run Migration:

```bash
cd apps/api

# Option 1: Using Drizzle Kit
pnpm drizzle-kit push:pg

# Option 2: Manual SQL execution
psql -U postgres -d campaign_platform -f drizzle/0004_create_reports_tables.sql

# Verify with Drizzle Studio
pnpm db:studio
```

### Expected Results:
- ✅ `saved_reports` table created with 5 indexes
- ✅ `report_exports` table created with 5 indexes
- ✅ Foreign keys to `users` table
- ✅ All comments applied

---

## 📦 Files Created This Week

```
apps/api/
├── drizzle/
│   └── 0004_create_reports_tables.sql          ✅ NEW
├── src/
    ├── common/
    │   ├── mock-auth.service.ts                 ✅ NEW
    │   ├── decorators/
    │   │   └── current-user.decorator.ts        ✅ NEW
    │   └── guards/
    │       └── mock-auth.guard.ts               ✅ NEW
    └── database/
        └── schemas/
            ├── saved-report.schema.ts           ✅ NEW
            ├── report-export.schema.ts          ✅ NEW
            └── index.ts                         ✅ UPDATED
```

**Total:** 6 new files, 1 updated file

---

## 🧪 Testing Mock Auth

### Test the Mock Auth Service:

```typescript
// In any service or controller
constructor(private mockAuth: MockAuthService) {}

testMockAuth() {
  // Get default user
  const user = this.mockAuth.getMockUser();
  console.log(user.email); // candidato@example.com
  console.log(user.role);  // CANDIDATO

  // Get user with specific role
  const estrategista = this.mockAuth.getMockUserWithRole('ESTRATEGISTA');
  console.log(estrategista.email); // estrategista@example.com

  // Test RBAC
  const hasAccess = this.mockAuth.hasRole(user, ['CANDIDATO', 'ESTRATEGISTA']);
  console.log(hasAccess); // true
}
```

### Test the Guard:

```typescript
// Create a test controller
@Controller('test')
@UseGuards(MockAuthGuard)
export class TestController {
  @Get()
  @Roles('CANDIDATO')
  async test(@CurrentUser() user: MockUser) {
    return {
      message: 'Mock auth working!',
      user: user,
    };
  }
}
```

Test with curl:
```bash
curl http://localhost:3000/test
# Should return mock user data without authentication
```

---

## 🔄 Migration Path to Real Auth

When ready to implement Keycloak (Week 13-14):

### 1. Replace Guard:
```typescript
// Before (Development)
@UseGuards(MockAuthGuard)

// After (Production)
@UseGuards(JwtAuthGuard, RolesGuard)
```

### 2. Update User Type:
```typescript
// Before
import { MockUser } from '@/common/mock-auth.service';

// After
import { User } from '@/database/schemas/user.schema';
```

### 3. Replace Service:
```typescript
// Remove MockAuthService injection
// Add JwtStrategy and AuthService
```

**All business logic remains unchanged!**

---

## ✅ Week 1 Deliverables

- [x] Database migration created and documented
- [x] Drizzle schemas with full TypeScript types
- [x] Mock authentication service
- [x] Mock authentication guard with RBAC
- [x] Current user decorator
- [x] Schema exports updated
- [x] Existing schemas validated
- [x] Documentation complete

**Status:** Ready for Week 2 (Core Backend Services) 🚀

---

**Next Action:** Begin implementing reports module DTOs and services (Week 2)
