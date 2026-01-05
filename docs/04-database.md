# Database - Schemas e Modelagem

## PostgreSQL - Dados Estruturais

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// MULTI-TENANCY: CAMPAIGNS
// ============================================

model Campaign {
  id            String    @id @default(uuid())
  name          String
  candidateName String    @map("candidate_name")
  office        String    // prefeito, vereador, deputado
  electionYear  Int       @map("election_year")
  
  // Schema dedicado para isolamento
  schemaName    String    @unique @map("schema_name")
  
  status        CampaignStatus @default(ACTIVE)
  
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  // Relações
  users         CampaignUser[]
  
  @@map("campaigns")
}

enum CampaignStatus {
  ACTIVE
  PAUSED
  COMPLETED
}

// ============================================
// USERS & RBAC
// ============================================

model User {
  id            String    @id @default(uuid())
  keycloakId    String    @unique @map("keycloak_id")
  email         String    @unique
  name          String
  
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  // Relações
  campaigns     CampaignUser[]
  
  @@map("users")
}

model CampaignUser {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  campaignId String   @map("campaign_id")
  role       UserRole
  
  createdAt  DateTime @default(now()) @map("created_at")
  
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  
  @@unique([userId, campaignId])
  @@map("campaign_users")
}

enum UserRole {
  CANDIDATO      // Acesso total
  ESTRATEGISTA   // Analytics + planejamento
  LIDERANCA      // Coordenação regional
  ESCRITORIO     // Operações básicas
}

// ============================================
// VOTERS (Per-Campaign Schema)
// ============================================

model Voter {
  id          Int       @id @default(autoincrement())
  name        String
  email       String?
  phone       String?
  
  // Geolocalização
  address     String?
  zone        String?   // Zona eleitoral
  latitude    Float?
  longitude   Float?
  
  // Segmentação
  tags        String[]  @default([])
  segment     String?   // apoiador, neutro, oposição
  
  // Metadata flexível
  customFields Json?    @map("custom_fields")
  
  // Tracking
  lastContact  DateTime? @map("last_contact")
  contactCount Int       @default(0) @map("contact_count")
  
  // Soft delete
  deletedAt    DateTime? @map("deleted_at")
  
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  
  // Relações
  interactions Interaction[]
  canvassSessions CanvassSession[]
  
  @@index([email])
  @@index([phone])
  @@index([zone])
  @@index([segment])
  @@map("voters")
}

// ============================================
// CALENDAR & EVENTS
// ============================================

model Event {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  
  startTime   DateTime  @map("start_time")
  endTime     DateTime  @map("end_time")
  
  location    String?
  
  // Tipo de evento
  type        EventType
  isPublic    Boolean   @default(true) @map("is_public")
  
  // Geolocalização
  latitude    Float?
  longitude   Float?
  
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  @@index([startTime])
  @@map("events")
}

enum EventType {
  REUNIAO
  CAMINHADA
  DEBATE
  COMICIO
  VISITA
}

// ============================================
// CANVASSING (Mobilização de Rua)
// ============================================

model CanvassSession {
  id           Int       @id @default(autoincrement())
  volunteerId  String    @map("volunteer_id")
  volunteerName String   @map("volunteer_name")
  
  startedAt    DateTime  @map("started_at")
  endedAt      DateTime? @map("ended_at")
  
  zone         String?
  
  // Estatísticas
  doorsKnocked Int       @default(0) @map("doors_knocked")
  contactsMade Int       @default(0) @map("contacts_made")
  
  // GPS tracking
  route        Json?     // GeoJSON LineString
  
  createdAt    DateTime  @default(now()) @map("created_at")
  
  // Relações
  doorKnocks   DoorKnock[]
  
  @@map("canvass_sessions")
}

model DoorKnock {
  id        Int      @id @default(autoincrement())
  sessionId Int      @map("session_id")
  voterId   Int?     @map("voter_id")
  
  result    KnockResult
  notes     String?
  
  // Respostas de survey (JSON flexível)
  surveyData Json?   @map("survey_data")
  
  // Localização exata
  latitude   Float
  longitude  Float
  
  knockedAt  DateTime @default(now()) @map("knocked_at")
  
  session    CanvassSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  voter      Voter?         @relation(fields: [voterId], references: [id])
  
  @@index([sessionId])
  @@map("door_knocks")
}

enum KnockResult {
  CONTACT       // Conversou
  NOT_HOME      // Ninguém em casa
  REFUSED       // Recusou conversa
  MOVED         // Mudou-se
}

// ============================================
// INTERACTIONS & MESSAGING
// ============================================

model Interaction {
  id          Int      @id @default(autoincrement())
  voterId     Int      @map("voter_id")
  
  type        InteractionType
  channel     Channel
  
  // Mensagem/conteúdo
  content     String?
  metadata    Json?
  
  // Status (para mensagens enviadas)
  status      MessageStatus? @default(PENDING)
  
  // n8n tracking
  n8nExecutionId String?  @map("n8n_execution_id")
  
  createdAt   DateTime @default(now()) @map("created_at")
  
  voter       Voter    @relation(fields: [voterId], references: [id], onDelete: Cascade)
  
  @@index([voterId])
  @@index([type])
  @@index([createdAt])
  @@map("interactions")
}

enum InteractionType {
  INBOUND    // Eleitor contatou campanha
  OUTBOUND   // Campanha contatou eleitor
  DOOR_KNOCK // Canvassing
}

enum Channel {
  WHATSAPP
  EMAIL
  SMS
  PHONE
  IN_PERSON
}

enum MessageStatus {
  PENDING
  SENT
  DELIVERED
  READ
  FAILED
}

// ============================================
// DONATIONS (Financeiro)
// ============================================

model Donation {
  id          Int      @id @default(autoincrement())
  donorName   String   @map("donor_name")
  donorCpf    String?  @map("donor_cpf")
  donorEmail  String?  @map("donor_email")
  
  amount      Float
  method      PaymentMethod
  
  receiptNumber String? @map("receipt_number")
  
  donatedAt   DateTime @map("donated_at")
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@index([donorCpf])
  @@index([donatedAt])
  @@map("donations")
}

enum PaymentMethod {
  PIX
  BOLETO
  TRANSFER
  CASH
}

// ============================================
// ANALYTICS & INSIGHTS
// ============================================

model DailyMetric {
  id          Int      @id @default(autoincrement())
  date        DateTime @db.Date
  
  // Métricas
  newVoters   Int      @default(0) @map("new_voters")
  contacts    Int      @default(0)
  donations   Float    @default(0)
  events      Int      @default(0)
  
  // Metadata flexível
  customMetrics Json?  @map("custom_metrics")
  
  @@unique([date])
  @@index([date])
  @@map("daily_metrics")
}
```

---

## PostgreSQL: pgvector para RAG

### Schema de Embeddings

```sql
-- Habilitar extensão
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela de documentos vetorizados
CREATE TABLE document_embeddings (
    id SERIAL PRIMARY KEY,
    campaign_id UUID NOT NULL,
    
    -- Conteúdo original
    content TEXT NOT NULL,
    content_type VARCHAR(50), -- 'proposal', 'speech', 'news', 'law'
    
    -- Metadata
    title VARCHAR(255),
    source VARCHAR(255),
    tags TEXT[],
    
    -- Vector embedding (OpenAI text-embedding-3-small = 1536 dimensions)
    embedding vector(1536),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Índice para busca vetorial (HNSW é mais rápido que IVFFlat)
    CONSTRAINT fk_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Índice HNSW para similarity search
CREATE INDEX ON document_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Índice para full-text search
CREATE INDEX ON document_embeddings USING GIN (to_tsvector('portuguese', content));

-- Função para hybrid search (vetorial + full-text)
CREATE OR REPLACE FUNCTION hybrid_search(
    query_embedding vector(1536),
    query_text TEXT,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id INT,
    content TEXT,
    similarity FLOAT,
    rank FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH vector_search AS (
        SELECT 
            de.id,
            de.content,
            1 - (de.embedding <=> query_embedding) AS similarity,
            ROW_NUMBER() OVER (ORDER BY de.embedding <=> query_embedding) AS rank
        FROM document_embeddings de
        ORDER BY de.embedding <=> query_embedding
        LIMIT match_count * 2
    ),
    text_search AS (
        SELECT 
            de.id,
            de.content,
            ts_rank(to_tsvector('portuguese', de.content), plainto_tsquery('portuguese', query_text)) AS rank
        FROM document_embeddings de
        WHERE to_tsvector('portuguese', de.content) @@ plainto_tsquery('portuguese', query_text)
        ORDER BY rank DESC
        LIMIT match_count * 2
    )
    SELECT 
        COALESCE(vs.id, ts.id) AS id,
        COALESCE(vs.content, ts.content) AS content,
        COALESCE(vs.similarity, 0) AS similarity,
        -- Reciprocal Rank Fusion
        COALESCE(1.0 / (60 + vs.rank), 0) + COALESCE(1.0 / (60 + ts.rank), 0) AS rank
    FROM vector_search vs
    FULL OUTER JOIN text_search ts ON vs.id = ts.id
    ORDER BY rank DESC
    LIMIT match_count;
END;
$$;
```

### Exemplo de Uso RAG

```typescript
// Buscar documentos similares
const results = await prisma.$queryRaw`
    SELECT * FROM hybrid_search(
        ${embedding}::vector(1536),
        ${searchText},
        5
    )
`;
```

---

## MongoDB - Logs e Eventos

### Collections

```javascript
// logs_collection
{
  _id: ObjectId,
  campaignId: String,
  userId: String,
  action: String,      // "voter.created", "event.deleted"
  resource: String,    // "voters", "events"
  resourceId: String,
  
  changes: {           // Antes/depois para audit trail
    before: Object,
    after: Object
  },
  
  ipAddress: String,
  userAgent: String,
  
  timestamp: ISODate,
  
  // TTL index: deletar após 90 dias
  expiresAt: ISODate
}

// Índices
db.logs.createIndex({ campaignId: 1, timestamp: -1 });
db.logs.createIndex({ action: 1, timestamp: -1 });
db.logs.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

// n8n_executions
{
  _id: ObjectId,
  campaignId: String,
  workflowId: String,
  workflowName: String,
  
  status: String,      // "success", "failed", "running"
  
  input: Object,
  output: Object,
  error: Object,
  
  startedAt: ISODate,
  finishedAt: ISODate,
  duration: Number,    // milissegundos
  
  triggeredBy: {
    type: String,      // "manual", "webhook", "schedule"
    userId: String
  }
}

// Índices
db.n8n_executions.createIndex({ campaignId: 1, startedAt: -1 });
db.n8n_executions.createIndex({ status: 1 });
db.n8n_executions.createIndex({ workflowId: 1, startedAt: -1 });
```

---

## Redis - Cache e Sessions

### Estrutura de Keys

```
# Sessions (TTL: 24h)
session:{sessionId} → JSON do user

# Cache de queries (TTL: 5min)
voters:campaign:{id}:list:{filters_hash} → JSON array
voters:campaign:{id}:count:{filters_hash} → Number

# Rate limiting
ratelimit:{ip}:{endpoint} → Counter (TTL: 60s)

# Real-time stats (pub/sub)
campaign:{id}:stats → JSON
campaign:{id}:online_users → Set

# Job queues (Bull)
bull:voters:import → Queue
bull:messages:send → Queue
```

### Exemplos

```typescript
// Cache de lista de eleitores
const cacheKey = `voters:campaign:${campaignId}:list:${hash(filters)}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const voters = await db.voters.findMany(filters);
await redis.setex(cacheKey, 300, JSON.stringify(voters)); // 5min
return voters;

// Pub/Sub para stats em tempo real
await redis.publish(`campaign:${campaignId}:stats`, JSON.stringify({
  voters: 1523,
  events: 12,
  donations: 45200.00
}));
```

---

## Migrations Strategy

### Prisma Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name add_voters_table

# Aplicar em produção
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

### Multi-Tenant Migrations

Quando uma nova campanha é criada:

```typescript
async function onboardCampaign(campaignName: string) {
  const schemaName = `campaign_${generateSlug(campaignName)}`;
  
  // 1. Criar campaign no schema public
  const campaign = await prisma.campaign.create({
    data: {
      name: campaignName,
      schemaName,
      status: 'ACTIVE',
    },
  });
  
  // 2. Criar schema dedicado
  await prisma.$executeRaw`CREATE SCHEMA ${Prisma.raw(schemaName)}`;
  
  // 3. Copiar estrutura de tabelas
  await prisma.$executeRaw`
    CREATE TABLE ${Prisma.raw(schemaName)}.voters (LIKE public.voters INCLUDING ALL);
    CREATE TABLE ${Prisma.raw(schemaName)}.events (LIKE public.events INCLUDING ALL);
    -- ... outras tabelas
  `;
  
  // 4. Criar usuário admin da campanha
  // ...
  
  return campaign;
}
```

---

## Backup Strategy

### PostgreSQL

```bash
# Backup de campaign específica
pg_dump -n campaign_silva_2024 campaign_db > backup_silva.sql

# Restore
psql campaign_db < backup_silva.sql
```

### MongoDB

```bash
# Backup
mongodump --db campaign_logs --out /backups/

# Restore
mongorestore --db campaign_logs /backups/campaign_logs/
```

---

## Índices de Performance

### PostgreSQL

```sql
-- Voters
CREATE INDEX idx_voters_zone ON voters(zone);
CREATE INDEX idx_voters_segment ON voters(segment);
CREATE INDEX idx_voters_created_at ON voters(created_at);
CREATE INDEX idx_voters_email_phone ON voters(email, phone);

-- Full-text search
CREATE INDEX idx_voters_name_trgm ON voters USING gin(name gin_trgm_ops);

-- Geoespacial
CREATE INDEX idx_voters_location ON voters USING gist(
    ll_to_earth(latitude, longitude)
);

-- Events
CREATE INDEX idx_events_time_range ON events(start_time, end_time);

-- Interactions
CREATE INDEX idx_interactions_voter_created ON interactions(voter_id, created_at DESC);
```

---

## Seed Data (Desenvolvimento)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar campaign de teste
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Silva para Prefeito 2024',
      candidateName: 'João Silva',
      office: 'prefeito',
      electionYear: 2024,
      schemaName: 'campaign_silva_2024',
    },
  });

  // Criar usuário admin
  const user = await prisma.user.create({
    data: {
      email: 'admin@campaign.com',
      name: 'Admin',
      keycloakId: 'keycloak-id-123',
      campaigns: {
        create: {
          campaignId: campaign.id,
          role: 'CANDIDATO',
        },
      },
    },
  });

  // Criar eleitores de teste (no schema da campanha)
  // ... seed data
}

main();
```

---

## Próximo: Autenticação com Keycloak
