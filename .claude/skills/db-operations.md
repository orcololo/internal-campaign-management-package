# Database Operations Skill

Quick commands for common database operations.

## Generate Migration

When you add/modify a schema, generate a migration:

```bash
cd apps/api
pnpm drizzle-kit generate:pg
```

## Apply Migration to Database

Push the migration to the database:

```bash
cd apps/api
pnpm drizzle-kit push:pg
```

## Open Drizzle Studio

Visual database editor:

```bash
cd apps/api
pnpm drizzle-kit studio
```

Opens at: https://local.drizzle.studio

## Reset Database (DANGER)

Drop all tables and recreate:

```bash
cd apps/api
pnpm drizzle-kit drop
pnpm drizzle-kit push:pg
```

## Check Database Connection

Test if PostgreSQL is accessible:

```bash
nc -zv localhost 5432
```

## Common SQL Queries

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count voters
SELECT COUNT(*) FROM voters WHERE deleted_at IS NULL;

-- Recent voters
SELECT * FROM voters ORDER BY created_at DESC LIMIT 10;

-- Check indexes
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'voters';
```
