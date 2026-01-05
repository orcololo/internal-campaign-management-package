# Database - Drizzle ORM

## Por que Drizzle?

- **Type-safe**: TypeScript first, inferência automática
- **Zero overhead**: Queries próximas ao SQL puro
- **Migrations**: SQL-based, transparente
- **Performance**: Mais rápido que Prisma
- **Relational queries**: Suporte completo

---

## Setup

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

### Configuração

```typescript
// apps/api/drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## Schema Definition

### Core Schemas

```typescript
// src/db/schema.ts
import { 
  pgTable, 
  uuid, 
  varchar, 
  timestamp, 
  integer,
  text,
  boolean,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  real
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

export const campaignStatusEnum = pgEnum('campaign_status', ['ACTIVE', 'PAUSED', 'COMPLETED']);
export const userRoleEnum = pgEnum('user_role', ['CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA', 'ESCRITORIO']);
export const eventTypeEnum = pgEnum('event_type', ['REUNIAO', 'CAMINHADA', 'DEBATE', 'COMICIO', 'VISITA']);
export const knockResultEnum = pgEnum('knock_result', ['CONTACT', 'NOT_HOME', 'REFUSED', 'MOVED']);
export const interactionTypeEnum = pgEnum('interaction_type', ['INBOUND', 'OUTBOUND', 'DOOR_KNOCK']);
export const channelEnum = pgEnum('channel', ['WHATSAPP', 'EMAIL', 'SMS', 'PHONE', 'IN_PERSON']);
export const messageStatusEnum = pgEnum('message_status', ['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED']);
export const paymentMethodEnum = pgEnum('payment_method', ['PIX', 'BOLETO', 'TRANSFER', 'CASH']);

// ============================================
// CAMPAIGNS (Multi-tenant)
// ============================================

export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  candidateName: varchar('candidate_name', { length: 255 }).notNull(),
  office: varchar('office', { length: 100 }).notNull(),
  electionYear: integer('election_year').notNull(),
  schemaName: varchar('schema_name', { length: 100 }).notNull().unique(),
  status: campaignStatusEnum('status').default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// USERS & RBAC
// ============================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  keycloakId: varchar('keycloak_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaignUsers = pgTable('campaign_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueUserCampaign: uniqueIndex('unique_user_campaign').on(table.userId, table.campaignId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaignUsers),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  users: many(campaignUsers),
}));

export const campaignUsersRelations = relations(campaignUsers, ({ one }) => ({
  user: one(users, {
    fields: [campaignUsers.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [campaignUsers.campaignId],
    references: [campaigns.id],
  }),
}));

// ============================================
// VOTERS (Per-Campaign Schema - Template)
// ============================================

export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  
  // Geolocalização
  address: text('address'),
  zone: varchar('zone', { length: 100 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  
  // Segmentação
  tags: text('tags').array(),
  segment: varchar('segment', { length: 50 }),
  
  // Metadata
  customFields: jsonb('custom_fields'),
  
  // Tracking
  lastContact: timestamp('last_contact'),
  contactCount: integer('contact_count').default(0).notNull(),
  
  // Soft delete
  deletedAt: timestamp('deleted_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('voters_email_idx').on(table.email),
  phoneIdx: index('voters_phone_idx').on(table.phone),
  zoneIdx: index('voters_zone_idx').on(table.zone),
  segmentIdx: index('voters_segment_idx').on(table.segment),
}));

// ============================================
// CALENDAR & EVENTS
// ============================================

export const events = pgTable('events', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  
  location: varchar('location', { length: 255 }),
  type: eventTypeEnum('type').notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  
  latitude: real('latitude'),
  longitude: real('longitude'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  startTimeIdx: index('events_start_time_idx').on(table.startTime),
}));

// ============================================
// CANVASSING
// ============================================

export const canvassSessions = pgTable('canvass_sessions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  volunteerId: varchar('volunteer_id', { length: 255 }).notNull(),
  volunteerName: varchar('volunteer_name', { length: 255 }).notNull(),
  
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  
  zone: varchar('zone', { length: 100 }),
  
  doorsKnocked: integer('doors_knocked').default(0).notNull(),
  contactsMade: integer('contacts_made').default(0).notNull(),
  
  route: jsonb('route'), // GeoJSON
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const doorKnocks = pgTable('door_knocks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer('session_id').notNull().references(() => canvassSessions.id, { onDelete: 'cascade' }),
  voterId: integer('voter_id').references(() => voters.id),
  
  result: knockResultEnum('result').notNull(),
  notes: text('notes'),
  surveyData: jsonb('survey_data'),
  
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  
  knockedAt: timestamp('knocked_at').defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index('door_knocks_session_idx').on(table.sessionId),
}));

export const canvassSessionsRelations = relations(canvassSessions, ({ many }) => ({
  doorKnocks: many(doorKnocks),
}));

export const doorKnocksRelations = relations(doorKnocks, ({ one }) => ({
  session: one(canvassSessions, {
    fields: [doorKnocks.sessionId],
    references: [canvassSessions.id],
  }),
  voter: one(voters, {
    fields: [doorKnocks.voterId],
    references: [voters.id],
  }),
}));

// ============================================
// INTERACTIONS
// ============================================

export const interactions = pgTable('interactions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  voterId: integer('voter_id').notNull().references(() => voters.id, { onDelete: 'cascade' }),
  
  type: interactionTypeEnum('type').notNull(),
  channel: channelEnum('channel').notNull(),
  
  content: text('content'),
  metadata: jsonb('metadata'),
  
  status: messageStatusEnum('status').default('PENDING'),
  n8nExecutionId: varchar('n8n_execution_id', { length: 255 }),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  voterIdx: index('interactions_voter_idx').on(table.voterId),
  typeIdx: index('interactions_type_idx').on(table.type),
  createdAtIdx: index('interactions_created_at_idx').on(table.createdAt),
}));

export const interactionsRelations = relations(interactions, ({ one }) => ({
  voter: one(voters, {
    fields: [interactions.voterId],
    references: [voters.id],
  }),
}));

// ============================================
// DONATIONS
// ============================================

export const donations = pgTable('donations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  donorName: varchar('donor_name', { length: 255 }).notNull(),
  donorCpf: varchar('donor_cpf', { length: 14 }),
  donorEmail: varchar('donor_email', { length: 255 }),
  
  amount: real('amount').notNull(),
  method: paymentMethodEnum('method').notNull(),
  
  receiptNumber: varchar('receipt_number', { length: 100 }),
  
  donatedAt: timestamp('donated_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  cpfIdx: index('donations_cpf_idx').on(table.donorCpf),
  donatedAtIdx: index('donations_donated_at_idx').on(table.donatedAt),
}));

// ============================================
// ANALYTICS
// ============================================

export const dailyMetrics = pgTable('daily_metrics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  date: timestamp('date', { mode: 'date' }).notNull().unique(),
  
  newVoters: integer('new_voters').default(0).notNull(),
  contacts: integer('contacts').default(0).notNull(),
  donations: real('donations').default(0).notNull(),
  events: integer('events').default(0).notNull(),
  
  customMetrics: jsonb('custom_metrics'),
}, (table) => ({
  dateIdx: index('daily_metrics_date_idx').on(table.date),
}));

// ============================================
// DOCUMENT EMBEDDINGS (RAG)
// ============================================

export const documentEmbeddings = pgTable('document_embeddings', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 50 }),
  
  title: varchar('title', { length: 255 }),
  source: varchar('source', { length: 255 }),
  tags: text('tags').array(),
  
  // Vector embedding - usar extensão pgvector
  embedding: sql`vector(1536)`,
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## Database Connection

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Para migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// Para queries
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
```

---

## Usage Examples

### Basic CRUD

```typescript
// modules/voters/voters.service.ts
import { Injectable } from '@nestjs/common';
import { db } from '@/db';
import { voters } from '@/db/schema';
import { eq, and, like, isNull, desc, sql } from 'drizzle-orm';

@Injectable()
export class VotersService {
  // Listar com filtros
  async findAll(filters: any) {
    const { page = 1, perPage = 20, search, zone } = filters;
    
    const conditions = [];
    
    if (search) {
      conditions.push(
        sql`${voters.name} ILIKE ${`%${search}%`} OR ${voters.email} ILIKE ${`%${search}%`}`
      );
    }
    
    if (zone) {
      conditions.push(eq(voters.zone, zone));
    }
    
    // Soft delete
    conditions.push(isNull(voters.deletedAt));
    
    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(voters)
        .where(and(...conditions))
        .orderBy(desc(voters.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage),
      
      db
        .select({ count: sql<number>`count(*)` })
        .from(voters)
        .where(and(...conditions)),
    ]);
    
    const total = Number(countResult[0].count);
    
    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
  
  // Criar
  async create(data: any) {
    const [voter] = await db
      .insert(voters)
      .values(data)
      .returning();
    
    return voter;
  }
  
  // Buscar um
  async findOne(id: number) {
    const [voter] = await db
      .select()
      .from(voters)
      .where(eq(voters.id, id));
    
    if (!voter) {
      throw new NotFoundException(`Voter #${id} not found`);
    }
    
    return voter;
  }
  
  // Atualizar
  async update(id: number, data: any) {
    const [updated] = await db
      .update(voters)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(voters.id, id))
      .returning();
    
    if (!updated) {
      throw new NotFoundException(`Voter #${id} not found`);
    }
    
    return updated;
  }
  
  // Soft delete
  async remove(id: number) {
    const [deleted] = await db
      .update(voters)
      .set({ deletedAt: new Date() })
      .where(eq(voters.id, id))
      .returning();
    
    return deleted;
  }
}
```

### Relational Queries

```typescript
// Buscar usuário com suas campanhas
const usersWithCampaigns = await db.query.users.findMany({
  with: {
    campaigns: {
      with: {
        campaign: true,
      },
    },
  },
});

// Buscar session com door knocks
const sessions = await db.query.canvassSessions.findMany({
  with: {
    doorKnocks: {
      with: {
        voter: true,
      },
    },
  },
  where: eq(canvassSessions.volunteerId, 'user-123'),
});
```

### Transactions

```typescript
async createVoterWithInteraction(voterData: any, interactionData: any) {
  return await db.transaction(async (tx) => {
    const [voter] = await tx
      .insert(voters)
      .values(voterData)
      .returning();
    
    await tx
      .insert(interactions)
      .values({
        ...interactionData,
        voterId: voter.id,
      });
    
    return voter;
  });
}
```

### Raw SQL (quando necessário)

```typescript
// Hybrid search com pgvector
const results = await db.execute(sql`
  SELECT * FROM hybrid_search(
    ${embedding}::vector(1536),
    ${searchText},
    5
  )
`);
```

---

## Migrations

### Criar Migration

```bash
# Gerar migration baseado no schema
pnpm drizzle-kit generate:pg

# Aplicar migrations
pnpm drizzle-kit push:pg
```

### Migration Manual

```typescript
// drizzle/0001_add_voters_table.sql
CREATE TABLE IF NOT EXISTS "voters" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" varchar(255) NOT NULL,
  "email" varchar(255),
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "voters_email_idx" ON "voters" ("email");
```

---

## Multi-Tenant Context

### Middleware para Schema Dinâmico

```typescript
// src/common/middleware/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const campaignId = req.params.campaignId;
    
    if (!campaignId) {
      return next();
    }
    
    // Buscar schema da campanha
    const schemaName = `campaign_${campaignId}`;
    
    // Criar conexão com schema específico
    const client = postgres(process.env.DATABASE_URL!, {
      connection: {
        search_path: schemaName,
      },
    });
    
    req['tenantDb'] = drizzle(client);
    
    next();
  }
}
```

---

## Type Inference

```typescript
// Drizzle infere tipos automaticamente
import { voters } from '@/db/schema';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Voter = InferSelectModel<typeof voters>;
export type NewVoter = InferInsertModel<typeof voters>;

// Uso
const voter: Voter = await db.query.voters.findFirst();
const newVoter: NewVoter = {
  name: 'João',
  email: 'joao@email.com',
};
```

---

## Drizzle Studio

```bash
# Abrir Drizzle Studio para visualizar dados
pnpm drizzle-kit studio
```

Interface visual em `https://local.drizzle.studio`

---

## Performance Tips

### Prepared Statements

```typescript
const getVoterById = db
  .select()
  .from(voters)
  .where(eq(voters.id, sql.placeholder('id')))
  .prepare('get_voter_by_id');

// Reusar query
const voter = await getVoterById.execute({ id: 123 });
```

### Batch Insert

```typescript
await db
  .insert(voters)
  .values([
    { name: 'João', email: 'joao@email.com' },
    { name: 'Maria', email: 'maria@email.com' },
    // ...
  ]);
```

---

## Comparação: Drizzle vs Prisma

| Feature | Drizzle | Prisma |
|---------|---------|--------|
| Performance | 🟢 Mais rápido | 🟡 Overhead |
| Type Safety | 🟢 Excelente | 🟢 Excelente |
| Migrations | 🟢 SQL puro | 🟡 Abstrato |
| Learning Curve | 🟡 Média | 🟢 Fácil |
| Bundle Size | 🟢 Pequeno | 🔴 Grande |
| Relational | 🟢 Bom | 🟢 Excelente |

**Veredito**: Drizzle é melhor para performance e controle, Prisma para produtividade rápida.
