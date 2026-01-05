# Quick Reference Guide

## Common Commands

### Development

```bash
# Start all services
pnpm dev

# Start only API
pnpm dev --filter api

# Start only frontend
pnpm dev --filter web

# Build all
pnpm build

# Install dependencies
pnpm install
```

### Database Operations

```bash
# Generate migration from schema changes
cd apps/api && pnpm drizzle-kit generate:pg

# Apply migrations to database
cd apps/api && pnpm drizzle-kit push:pg

# Open Drizzle Studio (visual editor)
cd apps/api && pnpm drizzle-kit studio

# Check PostgreSQL connection
nc -zv localhost 5432
```

### Git Workflow

```bash
# Check status
git status

# Create feature branch
git checkout -b feature/feature-name

# Stage and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name
```

## Project URLs

- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Frontend**: http://localhost:3000
- **Drizzle Studio**: https://local.drizzle.studio (after running `pnpm drizzle-kit studio`)

## File Locations

### Backend (NestJS)
- **Modules**: `apps/api/src/modules/`
- **Database Schemas**: `apps/api/src/database/schemas/`
- **Common (Guards, Decorators)**: `apps/api/src/common/`
- **Config**: `apps/api/drizzle.config.ts`
- **Environment**: `apps/api/.env`

### Frontend (Next.js)
- **Pages**: `apps/web/app/`
- **Components**: `apps/web/components/`
- **Lib/Utils**: `apps/web/lib/`

## Environment Variables

```env
# apps/api/.env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=campaign_platform

GOOGLE_MAPS_API_KEY=your_key_here
```

## User Roles & Permissions

1. **CANDIDATO** - Campaign owner (full access)
2. **ESTRATEGISTA** - Strategist (most features)
3. **LIDERANCA** - Local leader (limited write)
4. **ESCRITORIO** - Office staff (read-only + data entry)

## Database Schema Pattern

All tables should include:

```typescript
{
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // ... your fields ...

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
}
```

## Service Pattern (Drizzle)

```typescript
@Injectable()
export class YourService {
  constructor(@Inject(DatabaseService) private dbService: DatabaseService) {}

  private get db() {
    return this.dbService.getDb();
  }

  async findAll(filters: FilterDto) {
    const where = [isNull(yourTable.deletedAt)]; // Always filter soft-deleted

    const [data, count] = await Promise.all([
      this.db.select().from(yourTable).where(and(...where)).limit(20),
      this.db.select({ count: sql<number>`count(*)` }).from(yourTable).where(and(...where))
    ]);

    return { data, meta: { total: Number(count[0].count) } };
  }

  async findOne(id: number) {
    const [item] = await this.db.select().from(yourTable)
      .where(and(eq(yourTable.id, id), isNull(yourTable.deletedAt)));
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return item;
  }

  async create(dto: CreateDto) {
    const [item] = await this.db.insert(yourTable).values(dto).returning();
    return item;
  }

  async update(id: number, dto: UpdateDto) {
    await this.findOne(id);
    const [updated] = await this.db.update(yourTable)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(yourTable.id, id))
      .returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.update(yourTable)
      .set({ deletedAt: new Date() })
      .where(eq(yourTable.id, id));
  }
}
```

## Controller Pattern

```typescript
@Controller('resource')
@UseGuards(JwtAuthGuard, RolesGuard)
export class YourController {
  constructor(private service: YourService) {}

  @Get()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO')
  findAll(@Query() filters: FilterDto) {
    return this.service.findAll(filters);
  }

  @Post()
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA')
  create(@Body() dto: CreateDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
```

## DTO Pattern

```typescript
// create-resource.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

// update-resource.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

// filter-resource.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterResourceDto {
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

## Drizzle ORM Quick Reference

```typescript
// Import
import { eq, and, or, isNull, desc, sql } from 'drizzle-orm';

// Select all
const all = await db.select().from(table);

// With conditions
const filtered = await db.select().from(table)
  .where(and(eq(table.id, 1), isNull(table.deletedAt)));

// With pagination
const paginated = await db.select().from(table)
  .limit(20)
  .offset(0);

// Count
const [{ count }] = await db.select({ count: sql<number>`count(*)` })
  .from(table);

// Insert
const [created] = await db.insert(table)
  .values({ name: 'John' })
  .returning();

// Update
const [updated] = await db.update(table)
  .set({ name: 'Jane', updatedAt: new Date() })
  .where(eq(table.id, 1))
  .returning();

// Soft delete
await db.update(table)
  .set({ deletedAt: new Date() })
  .where(eq(table.id, 1));

// Search (case-insensitive)
const results = await db.select().from(table)
  .where(sql`${table.name} ILIKE ${`%${search}%`}`);
```

## Troubleshooting

### Database connection failed
```bash
# Check if PostgreSQL is running
nc -zv localhost 5432

# Check environment variables
cat apps/api/.env

# Restart the API
pnpm dev --filter api
```

### Migration failed
```bash
# Reset and regenerate
cd apps/api
pnpm drizzle-kit drop  # DANGER: drops all tables
pnpm drizzle-kit push:pg
```

### Port already in use
```bash
# Find process on port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

---

**For more details:**
- Architecture: `docs/01-architecture.md`
- Backend Patterns: `.claude/patterns/backend.md`
- Database: `.claude/patterns/database.md`
- Full Instructions: `.claude/INSTRUCTIONS.md`
