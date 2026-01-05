# GitHub Copilot Instructions - Campaign Platform

## Project Context

Multi-tenant electoral campaign management system for Brazilian elections.

**Stack:**
- Backend: NestJS 10 + Drizzle ORM + PostgreSQL 16
- Frontend: Next.js 14 (App Router) + React 18 + TailwindCSS
- Auth: Keycloak (OAuth2/OIDC)
- Automation: n8n
- Maps: Google Maps API + Places API

**Architecture:**
- Multi-tenant: Schema-per-tenant (PostgreSQL)
- RBAC: 4 roles (CANDIDATO, ESTRATEGISTA, LIDERANCA, ESCRITORIO)
- Monorepo: apps/api (backend) + apps/web (frontend)

---

## Code Generation Guidelines

### TypeScript Standards
- **Always** use strict types, never `any`
- **Prefer** type inference when obvious
- **Use** utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
- **Export** types with `InferSelectModel` and `InferInsertModel` from Drizzle

### Naming Conventions
```typescript
// Files: kebab-case
voters-service.ts
create-voter.dto.ts

// Components: PascalCase
VoterForm, VotersTable

// Functions/variables: camelCase
getVoters, voterCount

// Constants: UPPER_SNAKE_CASE
MAX_VOTERS, API_URL

// Booleans: is/has/should prefix
isActive, hasPermission, shouldValidate
```

### Import Order
```typescript
// 1. External libraries
import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

// 2. Internal modules
import { Database } from '@/db';
import { voters } from '@/db/schema';

// 3. Types
import type { Voter, NewVoter } from '@/db/schema';

// 4. Constants
import { VOTER_STATUSES } from './constants';
```

---

## Backend Patterns (NestJS + Drizzle)

### Module Structure
```typescript
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
import type { Database } from '@/db';
import { voters } from '@/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';

@Injectable()
export class VotersService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(filters: FilterVoterDto) {
    const { page = 1, perPage = 20, search } = filters;
    
    const where = [isNull(voters.deletedAt)]; // Soft delete
    if (search) {
      where.push(sql`${voters.name} ILIKE ${`%${search}%`}`);
    }
    
    const [data, count] = await Promise.all([
      this.db.select().from(voters)
        .where(and(...where))
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db.select({ count: sql<number>`count(*)` })
        .from(voters)
        .where(and(...where))
    ]);
    
    return {
      data,
      meta: { page, perPage, total: Number(count[0].count) }
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
    await this.findOne(id);
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
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('campaigns/:campaignId/voters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotersController {
  constructor(private service: VotersService) {}

  @Get()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO')
  findAll(@Query() filters: FilterVoterDto) {
    return this.service.findAll(filters);
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
import { IsString, IsEmail, IsOptional, MinLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

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
}

export class UpdateVoterDto extends PartialType(CreateVoterDto) {}

export class FilterVoterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
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
import { pgTable, integer, varchar, text, timestamp, real, jsonb, index } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  
  // Location fields
  address: varchar('address', { length: 500 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  placeId: varchar('place_id', { length: 255 }),
  
  // Always include these
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('voters_email_idx').on(table.email),
  createdAtIdx: index('voters_created_at_idx').on(table.createdAt),
}));

// Export types
export type Voter = InferSelectModel<typeof voters>;
export type NewVoter = InferInsertModel<typeof voters>;
```

### Common Queries
```typescript
// Select with soft delete filter
const active = await db.select().from(voters)
  .where(isNull(voters.deletedAt));

// Find by ID
const [voter] = await db.select().from(voters)
  .where(eq(voters.id, id));

// Search
const results = await db.select().from(voters)
  .where(sql`${voters.name} ILIKE ${`%${search}%`}`);

// Pagination
const voters = await db.select().from(voters)
  .limit(20)
  .offset((page - 1) * 20);

// Update
await db.update(voters)
  .set({ name: 'New', updatedAt: new Date() })
  .where(eq(voters.id, id));

// Soft delete
await db.update(voters)
  .set({ deletedAt: new Date() })
  .where(eq(voters.id, id));
```

---

## Frontend Patterns (Next.js 14)

### Page Structure
```typescript
app/(auth)/voters/
├── page.tsx              # List (Server Component)
├── [id]/page.tsx         # Detail (Server Component)
└── new/page.tsx          # Create (Server Component)

components/features/voters/
├── voters-table.tsx      # Client Component
├── voter-form.tsx        # Client Component
└── voters-filters.tsx    # Client Component
```

### Server Component (List Page)
```typescript
// app/(auth)/voters/page.tsx
import { VotersTable } from '@/components/features/voters/voters-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getVoters(searchParams: any) {
  const params = new URLSearchParams(searchParams);
  const res = await fetch(
    `${process.env.API_URL}/campaigns/current/voters?${params}`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function VotersPage({ searchParams }: any) {
  const { data, meta } = await getVoters(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Eleitores</h1>
        <Link href="/voters/new">
          <Button>+ Novo</Button>
        </Link>
      </div>
      <VotersTable data={data} pagination={meta} />
    </div>
  );
}
```

### Client Component (Form)
```typescript
// components/features/voters/voter-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function VoterForm({ voter, campaignId }: any) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: voter,
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (voter?.id) {
        await api.voters.update(campaignId, voter.id, data);
        toast.success('Atualizado');
      } else {
        await api.voters.create(campaignId, data);
        toast.success('Criado');
      }
      router.push('/voters');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Nome *</label>
        <input {...register('name')} className="border px-3 py-2 rounded w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} type="email" className="border px-3 py-2 rounded w-full" />
      </div>

      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

---

## Google Maps Integration

### Address Autocomplete
```typescript
'use client';

import { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function AddressAutocomplete({ value, onChange }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'br' },
        fields: ['formatted_address', 'geometry', 'place_id'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onChange(place.formatted_address, {
            latitude: place.geometry.location?.lat(),
            longitude: place.geometry.location?.lng(),
            placeId: place.place_id,
          });
        }
      });
    });
  }, []);

  return <input ref={inputRef} value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

### Map with Markers
```typescript
import { Map, Marker } from '@vis.gl/react-google-maps';

export function VotersMap({ voters }: any) {
  const center = { lat: -23.5505, lng: -46.6333 };

  return (
    <div className="w-full h-[600px]">
      <Map defaultCenter={center} defaultZoom={12}>
        {voters.map((v: any) => (
          <Marker key={v.id} position={{ lat: v.latitude, lng: v.longitude }} />
        ))}
      </Map>
    </div>
  );
}
```

---

## RBAC Permissions

| Role | Permissions |
|------|-------------|
| CANDIDATO | Full access (campaign owner) |
| ESTRATEGISTA | Analytics + planning, no user management |
| LIDERANCA | Regional scope only, can't delete |
| ESCRITORIO | Basic operations, read-only on sensitive data |

**Apply in controllers:**
```typescript
@Get()
@Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA')
findAll() { /* ... */ }
```

**Apply in frontend:**
```typescript
const { hasRole } = useAuth();

{hasRole('CANDIDATO') && <DeleteButton />}
```

---

## Code Quality Checklist

When generating code, ensure:
- [ ] TypeScript types defined (no `any`)
- [ ] DTOs have validation decorators
- [ ] Guards applied to protected endpoints
- [ ] Soft delete implemented (deletedAt)
- [ ] Indexes on frequently queried fields
- [ ] Error handling (try/catch, NotFoundException)
- [ ] Loading states in UI
- [ ] Form validation (backend + frontend)
- [ ] Imports organized (external → internal → types)

---

## Principles

- **YAGNI**: Don't add features "just in case"
- **KISS**: Simplest solution that works
- **DRY**: Extract repeated code
- **Type-safe**: TypeScript strict everywhere
- **Test**: Write tests for critical paths

---

## Git Commit Format

```
type(scope): subject

feat(voters): add CSV import
fix(auth): correct role validation
refactor(db): migrate to Drizzle
docs: update README
test: add voters service tests
```

---

When writing code for this project, follow these patterns exactly. Prioritize type safety, code reusability, and consistency with existing patterns.
