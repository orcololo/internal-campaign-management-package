# Database Patterns (Drizzle ORM)

## Schema Definition

```typescript
// apps/api/src/db/schema.ts
import { pgTable, integer, varchar, text, timestamp, real, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const segmentEnum = pgEnum('segment', ['apoiador', 'neutro', 'oposicao']);

// Table
export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  
  address: text('address'),
  zone: varchar('zone', { length: 100 }),
  
  tags: text('tags').array().default([]),
  segment: segmentEnum('segment'),
  
  customFields: jsonb('custom_fields').$type<Record<string, any>>(),
  
  // Always include these
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('voters_email_idx').on(table.email),
  zoneIdx: index('voters_zone_idx').on(table.zone),
  createdAtIdx: index('voters_created_at_idx').on(table.createdAt),
}));
```

## Relations

```typescript
import { relations } from 'drizzle-orm';

export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
});

export const campaignUsers = pgTable('campaign_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaignUsers),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  users: many(campaignUsers),
}));
```

## Type Inference

```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Export types
export type Voter = InferSelectModel<typeof voters>;
export type NewVoter = InferInsertModel<typeof voters>;

// Usage in service
async function create(data: NewVoter): Promise<Voter> {
  const [voter] = await db.insert(voters).values(data).returning();
  return voter;
}
```

## Common Queries

```typescript
import { eq, and, or, like, isNull, desc, sql } from 'drizzle-orm';

// Select all (with soft delete filter)
const active = await db.select().from(voters)
  .where(isNull(voters.deletedAt));

// Find by ID
const [voter] = await db.select().from(voters)
  .where(eq(voters.id, id));

// Search
const results = await db.select().from(voters)
  .where(sql`${voters.name} ILIKE ${`%${search}%`}`);

// With pagination
const voters = await db.select().from(voters)
  .limit(20)
  .offset((page - 1) * 20);

// Count
const [{ count }] = await db.select({ count: sql<number>`count(*)` })
  .from(voters);

// Update
await db.update(voters)
  .set({ name: 'New Name', updatedAt: new Date() })
  .where(eq(voters.id, id));

// Soft delete
await db.update(voters)
  .set({ deletedAt: new Date() })
  .where(eq(voters.id, id));

// Insert
const [created] = await db.insert(voters)
  .values({ name: 'João', email: 'joao@email.com' })
  .returning();

// Bulk insert
await db.insert(voters)
  .values([
    { name: 'João' },
    { name: 'Maria' },
  ])
  .onConflictDoNothing(); // Skip duplicates
```

## Indexes

```typescript
// B-Tree (default) - for equality, range, sorting
index('idx_name').on(table.field)

// GIN - for arrays, JSONB
index('idx_tags').using('gin', table.tags)

// Composite index
index('idx_zone_segment').on(table.zone, table.segment)

// Unique index
uniqueIndex('idx_email_unique').on(table.email)
```

## Migrations

```bash
# Generate migration from schema changes
pnpm drizzle-kit generate:pg

# Apply migrations to database
pnpm drizzle-kit push:pg

# Open Drizzle Studio (visual editor)
pnpm drizzle-kit studio
```

## Field Types Reference

```typescript
// Strings
varchar('name', { length: 255 })
text('description')

// Numbers
integer('count')
real('amount')                    // For decimals
serial('id')                      // Auto-increment

// Booleans
boolean('is_active')

// Dates
timestamp('created_at')
date('birth_date')

// JSON
jsonb('metadata')

// Arrays
text('tags').array()

// Enums
pgEnum('status', ['active', 'inactive'])
```

## Key Points

- **Always include**: `id`, `createdAt`, `updatedAt`, `deletedAt`
- **Add indexes**: On fields used in WHERE, ORDER BY, JOIN
- **Soft delete**: Use `deletedAt`, filter with `isNull(deletedAt)`
- **Type-safe**: Export `InferSelectModel` and `InferInsertModel`
- **Migrations**: Run `drizzle-kit generate:pg` then `push:pg`
- **onDelete cascade**: For foreign keys to auto-delete related records
