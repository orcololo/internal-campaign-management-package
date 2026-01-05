# Campaign Platform - Claude Code Instructions

## Project Overview

**Electoral Campaign Management Platform** - Multi-tenant SaaS for managing political campaigns in Brazil.

### Tech Stack

**Backend:**
- NestJS 10+ (TypeScript)
- Drizzle ORM (PostgreSQL 16)
- Keycloak (Authentication/Authorization)
- Bull/BullMQ (Job Queues)
- Socket.io (Real-time)

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Zustand (State Management)
- Google Maps API

**Infrastructure:**
- PostgreSQL 16 (Multi-tenant: schema-per-tenant)
- Redis 7 (Cache, Sessions, Pub/Sub)
- MongoDB 7 (Logs, Events)
- n8n (Workflow Automation)
- Docker Compose (Development)

---

## Project Structure

```
campaign-platform/
├── apps/
│   ├── api/                      # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── tenants/
│   │   │   │   ├── voters/
│   │   │   │   ├── calendar/
│   │   │   │   ├── canvassing/
│   │   │   │   ├── geofences/
│   │   │   │   ├── maps/
│   │   │   │   ├── n8n/
│   │   │   │   └── analytics/
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   ├── database.service.ts
│   │   │   │   └── schemas/
│   │   │   │       ├── tenant.schema.ts
│   │   │   │       ├── user.schema.ts
│   │   │   │       └── voter.schema.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── filters/
│   │   │   │   ├── guards/
│   │   │   │   └── interceptors/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── web/                      # Next.js Frontend
│       ├── app/
│       │   ├── (auth)/           # Authenticated routes
│       │   │   ├── dashboard/
│       │   │   ├── voters/
│       │   │   ├── campaigns/
│       │   │   └── calendar/
│       │   ├── (public)/         # Public routes
│       │   └── api/
│       ├── components/
│       ├── lib/
│       └── package.json
│
├── packages/
│   ├── types/                    # Shared TypeScript types
│   ├── config/                   # Shared configs
│   └── utils/                    # Shared utilities
│
├── .claude/                      # Claude Code Configuration
├── docs/                         # Technical Documentation
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## Core Principles

### 1. YAGNI (You Aren't Gonna Need It)
- Implement only what's needed for MVP
- No premature abstractions
- Add complexity only when there's real need

### 2. KISS (Keep It Simple, Stupid)
- Simple code > Clever code
- Direct solution > Generic solution
- Fewer layers = Fewer bugs

### 3. Type Safety First
- TypeScript strict mode everywhere
- No `any` types
- Drizzle ORM for type-safe database queries
- DTOs with class-validator for validation

### 4. Multi-Tenant Isolation
- Schema-per-tenant architecture
- Complete data isolation between campaigns
- Each campaign has its own PostgreSQL schema

---

## Architecture Patterns

### Multi-Tenancy: Schema-per-Tenant

```typescript
// Each campaign gets its own schema
campaign_1/
  ├── voters
  ├── events
  ├── interactions
  └── donations

campaign_2/
  ├── voters
  ├── events
  └── ...
```

**Benefits:**
- Complete data isolation
- Individual backups per campaign
- Better performance than row-level security
- Easier to scale horizontally

---

## Backend Patterns (NestJS + Drizzle)

### Module Structure

Every feature module follows this pattern:

```
modules/voters/
├── voters.module.ts
├── voters.controller.ts
├── voters.service.ts
└── dto/
    ├── create-voter.dto.ts
    ├── update-voter.dto.ts
    └── filter-voter.dto.ts
```

### Service Pattern

```typescript
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { Database } from '@/database/database.service';
import { voters } from '@/database/schemas/voter.schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';

@Injectable()
export class VotersService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(filters: FilterVoterDto) {
    const { page = 1, perPage = 20, search } = filters;

    const where = [];
    if (search) {
      where.push(sql`${voters.name} ILIKE ${`%${search}%`}`);
    }
    where.push(isNull(voters.deletedAt)); // Always filter soft-deleted

    const [data, countResult] = await Promise.all([
      this.db.select().from(voters)
        .where(and(...where))
        .orderBy(desc(voters.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db.select({ count: sql<number>`count(*)` })
        .from(voters)
        .where(and(...where))
    ]);

    return {
      data,
      meta: {
        page,
        perPage,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / perPage)
      }
    };
  }

  async findOne(id: number) {
    const [voter] = await this.db.select().from(voters)
      .where(and(eq(voters.id, id), isNull(voters.deletedAt)));
    if (!voter) throw new NotFoundException(`Voter #${id} not found`);
    return voter;
  }

  async create(dto: CreateVoterDto) {
    const [voter] = await this.db.insert(voters).values(dto).returning();
    return voter;
  }

  async update(id: number, dto: UpdateVoterDto) {
    await this.findOne(id); // Verify exists
    const [updated] = await this.db.update(voters)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(voters.id, id))
      .returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.update(voters)
      .set({ deletedAt: new Date() })
      .where(eq(voters.id, id));
  }
}
```

### Controller Pattern

```typescript
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards
} from '@nestjs/common';
import { VotersService } from './voters.service';
import { CreateVoterDto, UpdateVoterDto, FilterVoterDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('voters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotersController {
  constructor(private service: VotersService) {}

  @Get()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO')
  findAll(@Query() filters: FilterVoterDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA')
  create(@Body() dto: CreateVoterDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  update(@Param('id') id: string, @Body() dto: UpdateVoterDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
```

### DTO Pattern

```typescript
// create-voter.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateVoterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

// update-voter.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterDto } from './create-voter.dto';

export class UpdateVoterDto extends PartialType(CreateVoterDto) {}

// filter-voter.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterVoterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}
```

---

## Database Patterns (Drizzle ORM)

### Schema Definition

```typescript
// database/schemas/voter.schema.ts
import {
  pgTable, integer, varchar, text, timestamp,
  real, jsonb, index, pgEnum
} from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', [
  'MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'
]);

export const supportLevelEnum = pgEnum('support_level', [
  'MUITO_FAVORAVEL', 'FAVORAVEL', 'NEUTRO',
  'DESFAVORAVEL', 'MUITO_DESFAVORAVEL', 'NAO_DEFINIDO'
]);

export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 14 }).unique(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),

  // Address
  address: text('address'),
  addressNumber: varchar('address_number', { length: 10 }),
  neighborhood: varchar('neighborhood', { length: 100 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 10 }),

  // Geolocation
  latitude: real('latitude'),
  longitude: real('longitude'),

  // Electoral info
  gender: genderEnum('gender').default('NAO_INFORMADO'),
  supportLevel: supportLevelEnum('support_level').default('NAO_DEFINIDO'),

  // Metadata
  tags: text('tags').array().default([]),
  notes: text('notes'),
  customFields: jsonb('custom_fields'),

  // Timestamps (ALWAYS INCLUDE)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
}, (table) => ({
  cpfIdx: index('voters_cpf_idx').on(table.cpf),
  emailIdx: index('voters_email_idx').on(table.email),
  phoneIdx: index('voters_phone_idx').on(table.phone),
  cityIdx: index('voters_city_idx').on(table.city),
  createdAtIdx: index('voters_created_at_idx').on(table.createdAt),
}));

// Type exports
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Voter = InferSelectModel<typeof voters>;
export type NewVoter = InferInsertModel<typeof voters>;
```

### Database Module Pattern

```typescript
// database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: any;
  public db: PostgresJsDatabase;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.getConnectionString();

    this.client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    this.db = drizzle(this.client);

    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('🔌 Database connection closed');
  }

  private getConnectionString(): string {
    const host = this.configService.get('DB_HOST', 'localhost');
    const port = this.configService.get('DB_PORT', '5432');
    const user = this.configService.get('DB_USER', 'postgres');
    const password = this.configService.get('DB_PASSWORD', 'postgres');
    const database = this.configService.get('DB_NAME', 'campaign_platform');

    return `postgres://${user}:${password}@${host}:${port}/${database}`;
  }

  getDb(): PostgresJsDatabase {
    return this.db;
  }
}
```

---

## RBAC (Role-Based Access Control)

### Four Roles

1. **CANDIDATO** - Campaign owner (full access)
2. **ESTRATEGISTA** - Campaign strategist (most features)
3. **LIDERANCA** - Local leader (limited write access)
4. **ESCRITORIO** - Office staff (read-only + data entry)

### Permission Matrix

| Feature | CANDIDATO | ESTRATEGISTA | LIDERANCA | ESCRITORIO |
|---------|-----------|--------------|-----------|------------|
| Voters CRUD | ✅ All | ✅ All | ✅ Create/Read | ✅ Read only |
| Delete voters | ✅ | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ✅ Limited | ❌ |
| Export data | ✅ | ✅ | ❌ | ❌ |
| n8n workflows | ✅ | ✅ | ❌ | ❌ |

---

## API Response Standards

### Success Response

```typescript
{
  "data": { ... } | [ ... ],
  "meta": {
    "timestamp": "2026-01-05T10:00:00Z",
    "requestId": "uuid"
  }
}
```

### Paginated Response

```typescript
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```typescript
{
  "error": {
    "code": "VOTER_NOT_FOUND",
    "message": "Eleitor não encontrado",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2026-01-05T10:00:00Z",
    "requestId": "uuid"
  }
}
```

---

## Google Maps Integration

All voters, events, and geofences can have geolocation:

- **Geocoding**: Convert address → lat/lng
- **Reverse Geocoding**: Convert lat/lng → address
- **Autocomplete**: Address suggestions as user types
- **Distance Calculation**: Between two points
- **Geofence Checking**: Point in circle/polygon
- **Nearby Search**: Find voters near location

See `.claude/MAPS-FEATURES.md` and `.claude/patterns/maps-location.md` for details.

---

## Development Guidelines

### When Implementing a New Feature

1. **Database First**: Define schema in `database/schemas/`
2. **Generate Migration**: Run `pnpm drizzle-kit generate:pg`
3. **Apply Migration**: Run `pnpm drizzle-kit push:pg`
4. **Create Module**: Service → Controller → DTOs
5. **Add Guards**: RBAC with `@Roles()` decorator
6. **Add Validation**: DTOs with `class-validator`
7. **Test**: Manual testing, then add tests

### Code Quality Checklist

- ✅ TypeScript strict mode (no `any`)
- ✅ Soft delete (use `deletedAt` field)
- ✅ Pagination for lists
- ✅ Proper error handling
- ✅ RBAC guards on all endpoints
- ✅ DTO validation
- ✅ Database indexes on search fields
- ✅ Comments only where logic isn't obvious

### Common Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm dev --filter api       # Start only backend
pnpm dev --filter web       # Start only frontend

# Database
pnpm drizzle-kit generate:pg    # Generate migration
pnpm drizzle-kit push:pg        # Apply to database
pnpm drizzle-kit studio         # Visual database editor

# Build
pnpm build                  # Build all apps
pnpm build --filter api     # Build only backend

# Testing
pnpm test                   # Run all tests
pnpm test:e2e              # End-to-end tests
```

---

## Environment Variables

```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=campaign_platform

# Google Maps (Optional)
GOOGLE_MAPS_API_KEY=your_key_here
```

---

## Key References

- **Architecture**: See `docs/01-architecture.md`
- **Backend Patterns**: See `.claude/patterns/backend.md`
- **Database Patterns**: See `.claude/patterns/database.md`
- **Maps Integration**: See `.claude/patterns/maps-location.md`
- **Complete Example**: See `.claude/examples/complete-feature.md`

---

## When Building Features

1. **Check existing patterns** in `.claude/patterns/`
2. **Follow RBAC** - use proper role restrictions
3. **Always soft delete** - never hard delete data
4. **Add pagination** for all list endpoints
5. **Type-safe everything** - export types from schemas
6. **Validate inputs** - use DTOs with decorators
7. **Error handling** - use NestJS exceptions
8. **Add indexes** - on fields used in WHERE clauses

---

## Current Database Connection Status

✅ **PostgreSQL**: Connected on localhost:5432
✅ **Database**: campaign_platform
✅ **Application**: Running on http://localhost:3001
✅ **API Docs**: http://localhost:3001/api/docs
✅ **Migrations**: Applied and up to date

---

**Remember:** Keep it simple, type-safe, and follow established patterns!
