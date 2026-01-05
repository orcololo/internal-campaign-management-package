# Complete Example: Building the Voters Feature

This shows how to implement voters module end-to-end using the patterns.

## Step 1: Database Schema

Edit `apps/api/src/db/schema.ts`:

```typescript
import { pgTable, integer, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  zone: varchar('zone', { length: 100 }),
  
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('voters_email_idx').on(table.email),
  zoneIdx: index('voters_zone_idx').on(table.zone),
}));

// Export types
export type Voter = InferSelectModel<typeof voters>;
export type NewVoter = InferInsertModel<typeof voters>;
```

Run migration:
```bash
cd apps/api
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
```

## Step 2: Backend Module

Create `apps/api/src/modules/voters/`:

### voters.module.ts
```typescript
import { Module } from '@nestjs/common';
import { VotersController } from './voters.controller';
import { VotersService } from './voters.service';

@Module({
  controllers: [VotersController],
  providers: [VotersService],
})
export class VotersModule {}
```

### voters.service.ts
```typescript
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { Database } from '@/db';
import { voters } from '@/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { CreateVoterDto, UpdateVoterDto, FilterVoterDto } from './dto';

@Injectable()
export class VotersService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(filters: FilterVoterDto) {
    const { page = 1, perPage = 20, search } = filters;
    
    const where = [isNull(voters.deletedAt)];
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
      meta: {
        page,
        perPage,
        total: Number(count[0].count),
        totalPages: Math.ceil(Number(count[0].count) / perPage),
      },
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

### voters.controller.ts
```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VotersService } from './voters.service';
import { CreateVoterDto, UpdateVoterDto, FilterVoterDto } from './dto';
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

### dto/create-voter.dto.ts
```typescript
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

  @IsString()
  @IsOptional()
  zone?: string;
}
```

### dto/update-voter.dto.ts
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterDto } from './create-voter.dto';

export class UpdateVoterDto extends PartialType(CreateVoterDto) {}
```

### dto/filter-voter.dto.ts
```typescript
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
  perPage?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}
```

## Step 3: Frontend

### API Client

Create `apps/web/lib/api/voters.ts`:

```typescript
import { apiClient } from './client';

export const votersApi = {
  list: (campaignId: string, params?: any) =>
    apiClient.get(`/campaigns/${campaignId}/voters`, { params }),

  get: (campaignId: string, id: number) =>
    apiClient.get(`/campaigns/${campaignId}/voters/${id}`),

  create: (campaignId: string, data: any) =>
    apiClient.post(`/campaigns/${campaignId}/voters`, data),

  update: (campaignId: string, id: number, data: any) =>
    apiClient.patch(`/campaigns/${campaignId}/voters/${id}`, data),

  delete: (campaignId: string, id: number) =>
    apiClient.delete(`/campaigns/${campaignId}/voters/${id}`),
};
```

### List Page

Create `apps/web/app/(auth)/voters/page.tsx`:

```typescript
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
      <div className="flex justify-between">
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

### Table Component

Create `apps/web/components/features/voters/voters-table.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';

export function VotersTable({ data, pagination }: any) {
  const router = useRouter();

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Telefone</th>
            <th className="px-4 py-3 text-left">Zona</th>
          </tr>
        </thead>
        <tbody>
          {data.map((voter: any) => (
            <tr
              key={voter.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/voters/${voter.id}`)}
            >
              <td className="px-4 py-3">{voter.name}</td>
              <td className="px-4 py-3">{voter.email || '-'}</td>
              <td className="px-4 py-3">{voter.phone || '-'}</td>
              <td className="px-4 py-3">{voter.zone || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Form Page

Create `apps/web/app/(auth)/voters/new/page.tsx`:

```typescript
import { VoterForm } from '@/components/features/voters/voter-form';

export default function NewVoterPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Novo Eleitor</h1>
      <VoterForm campaignId="current" />
    </div>
  );
}
```

### Form Component

Create `apps/web/components/features/voters/voter-form.tsx`:

```typescript
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
  zone: z.string().optional(),
});

export function VoterForm({ campaignId }: any) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await api.voters.create(campaignId, data);
      toast.success('Eleitor criado');
      router.push('/voters');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao criar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Nome *</label>
        <input {...register('name')} className="border px-3 py-2 rounded w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input {...register('email')} type="email" className="border px-3 py-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1">Telefone</label>
        <input {...register('phone')} className="border px-3 py-2 rounded w-full" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Criar Eleitor'}
      </button>
    </form>
  );
}
```

## Done!

You now have a complete voters module with:
- ✅ Database schema with indexes
- ✅ Backend API with CRUD + validation + RBAC
- ✅ Frontend pages with forms + validation
- ✅ Type-safe end-to-end

Test it:
```bash
# Backend
cd apps/api && pnpm dev

# Frontend
cd apps/web && pnpm dev
```

Visit `http://localhost:3000/voters`
