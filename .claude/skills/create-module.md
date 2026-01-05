# Create Module Skill

Template for creating a new NestJS module following the project patterns.

## Step 1: Create Module Structure

```bash
cd apps/api/src/modules
mkdir feature-name
cd feature-name
mkdir dto
```

## Step 2: Create Module File

```typescript
// feature-name.module.ts
import { Module } from '@nestjs/common';
import { FeatureNameController } from './feature-name.controller';
import { FeatureNameService } from './feature-name.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FeatureNameController],
  providers: [FeatureNameService],
  exports: [FeatureNameService],
})
export class FeatureNameModule {}
```

## Step 3: Create Service

```typescript
// feature-name.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { featureName } from '@/database/schemas/feature-name.schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { CreateFeatureNameDto, UpdateFeatureNameDto, FilterFeatureNameDto } from './dto';

@Injectable()
export class FeatureNameService {
  constructor(
    @Inject(DatabaseService) private dbService: DatabaseService
  ) {}

  private get db() {
    return this.dbService.getDb();
  }

  async findAll(filters: FilterFeatureNameDto) {
    const { page = 1, perPage = 20, search } = filters;

    const where = [];
    if (search) {
      where.push(sql`${featureName.name} ILIKE ${`%${search}%`}`);
    }
    where.push(isNull(featureName.deletedAt));

    const [data, countResult] = await Promise.all([
      this.db.select().from(featureName)
        .where(and(...where))
        .orderBy(desc(featureName.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db.select({ count: sql<number>`count(*)` })
        .from(featureName)
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
    const [item] = await this.db.select().from(featureName)
      .where(and(eq(featureName.id, id), isNull(featureName.deletedAt)));
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return item;
  }

  async create(dto: CreateFeatureNameDto) {
    const [item] = await this.db.insert(featureName).values(dto).returning();
    return item;
  }

  async update(id: number, dto: UpdateFeatureNameDto) {
    await this.findOne(id);
    const [updated] = await this.db.update(featureName)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(featureName.id, id))
      .returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.update(featureName)
      .set({ deletedAt: new Date() })
      .where(eq(featureName.id, id));
  }
}
```

## Step 4: Create Controller

```typescript
// feature-name.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards
} from '@nestjs/common';
import { FeatureNameService } from './feature-name.service';
import { CreateFeatureNameDto, UpdateFeatureNameDto, FilterFeatureNameDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('feature-name')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeatureNameController {
  constructor(private service: FeatureNameService) {}

  @Get()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO')
  findAll(@Query() filters: FilterFeatureNameDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA')
  create(@Body() dto: CreateFeatureNameDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  update(@Param('id') id: string, @Body() dto: UpdateFeatureNameDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
```

## Step 5: Create DTOs

```typescript
// dto/create-feature-name.dto.ts
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateFeatureNameDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

// dto/update-feature-name.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureNameDto } from './create-feature-name.dto';

export class UpdateFeatureNameDto extends PartialType(CreateFeatureNameDto) {}

// dto/filter-feature-name.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterFeatureNameDto {
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

## Step 6: Create Database Schema

```typescript
// database/schemas/feature-name.schema.ts
import {
  pgTable, integer, varchar, text, timestamp, index
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const featureName = pgTable('feature_name', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),

  // Always include these
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  nameIdx: index('feature_name_name_idx').on(table.name),
  createdAtIdx: index('feature_name_created_at_idx').on(table.createdAt),
}));

export type FeatureName = InferSelectModel<typeof featureName>;
export type NewFeatureName = InferInsertModel<typeof featureName>;
```

## Step 7: Register in App Module

```typescript
// app.module.ts
import { FeatureNameModule } from './modules/feature-name/feature-name.module';

@Module({
  imports: [
    // ... other modules
    FeatureNameModule,
  ],
})
export class AppModule {}
```

## Step 8: Generate and Apply Migration

```bash
cd apps/api
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
```

## Step 9: Test

```bash
# Start the server
pnpm dev

# Test the endpoints
curl http://localhost:3001/feature-name
curl -X POST http://localhost:3001/feature-name -H "Content-Type: application/json" -d '{"name":"Test"}'
```

Done! Your new module is ready.
