# Backend Patterns (NestJS + Drizzle)

## Module Structure

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

## 1. Module

```typescript
import { Module } from '@nestjs/common';
import { VotersController } from './voters.controller.ts';
import { VotersService } from './voters.service.ts';

@Module({
  controllers: [VotersController],
  providers: [VotersService],
  exports: [VotersService], // If used by other modules
})
export class VotersModule {}
```

## 2. Service (Drizzle ORM)

```typescript
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { Database } from '@/db';
import { voters } from '@/db/schema';
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
    where.push(isNull(voters.deletedAt)); // Soft delete
    
    const [data, count] = await Promise.all([
      this.db.select().from(voters)
        .where(and(...where))
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db.select({ count: sql<number>`count(*)` }).from(voters)
        .where(and(...where))
    ]);
    
    return { data, meta: { page, perPage, total: Number(count[0].count) } };
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

## 3. Controller

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

## 4. DTOs

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
  perPage?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}
```

## Key Points

- **Use Drizzle ORM**: `@Inject('DATABASE') private db: Database`
- **Soft Delete**: Always filter `isNull(deletedAt)`
- **Validation**: DTOs with `class-validator`
- **Guards**: `@UseGuards(JwtAuthGuard, RolesGuard)`
- **RBAC**: `@Roles('CANDIDATO', 'ESTRATEGISTA')`
- **Error Handling**: `NotFoundException`, `BadRequestException`
- **Pagination**: Include meta in response
