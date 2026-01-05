# Guia Prático - Agents com Claude Code

## Setup Inicial

### 1. Estrutura do Projeto

```bash
campaign-platform/
├── .claude/                    # Configurações dos agents
│   ├── orchestrator.md
│   ├── agents/
│   │   ├── backend/
│   │   ├── frontend/
│   │   ├── database/
│   │   └── infra/
│   ├── tasks/
│   └── context/
├── apps/
│   ├── api/                   # NestJS Backend
│   └── web/                   # Next.js Frontend
├── packages/
│   ├── types/
│   └── config/
└── docker-compose.yml
```

### 2. Inicializar Agents

```bash
# Criar estrutura de agents
mkdir -p .claude/{agents/{backend,frontend,database,infra},tasks,context}

# Copiar templates dos agents (dos arquivos .md anteriores)
# para .claude/agents/
```

---

## Workflows Práticos

### Workflow 1: Criar Nova Feature (Donations)

#### Passo 1: Orchestrator planeja

```bash
$ claude "Implementar módulo de doações completo"
```

**Orchestrator analisa e delega:**

```yaml
# .claude/tasks/donations-feature.yml
feature: "Donations Module"
status: "planned"

subtasks:
  - agent: "database_agent"
    task: "Criar schema de doações"
    files:
      - "src/db/schema.ts"
    requirements:
      - "Campos: donorName, donorCpf, amount, method, donatedAt"
      - "Enum: PaymentMethod (PIX, BOLETO, TRANSFER, CASH)"
      - "Index em donorCpf e donatedAt"
  
  - agent: "backend_agent"
    task: "Criar módulo de doações"
    files:
      - "src/modules/donations/"
    requirements:
      - "CRUD completo"
      - "Validação de CPF"
      - "Soma de doações por período"
      - "Exportação para TSE (futuro)"
    depends_on:
      - "database_agent"
  
  - agent: "frontend_agent"
    task: "Criar interface de doações"
    files:
      - "app/(auth)/donations/"
      - "components/features/donations/"
    requirements:
      - "Lista paginada"
      - "Formulário de cadastro"
      - "Dashboard com totais"
      - "Filtros por data e método"
    depends_on:
      - "backend_agent"
```

#### Passo 2: Database Agent executa

```bash
$ cd src/db
$ claude --agent database_schema "adicionar schema de doações"
```

**Database Agent cria:**

```typescript
// src/db/schema.ts
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
```

**Gera migration:**

```bash
$ pnpm drizzle-kit generate:pg
✓ Migration created: 0005_add_donations.sql
```

#### Passo 3: Backend Agent executa

```bash
$ cd src/modules
$ claude --agent backend "criar módulo donations com CRUD"
```

**Backend Agent cria estrutura:**

```
modules/donations/
├── donations.module.ts
├── donations.controller.ts
├── donations.service.ts
├── dto/
│   ├── create-donation.dto.ts
│   ├── update-donation.dto.ts
│   └── filter-donation.dto.ts
└── donations.constants.ts
```

**donations.service.ts:**

```typescript
@Injectable()
export class DonationsService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async create(campaignId: string, dto: CreateDonationDto) {
    // Validar CPF
    if (dto.donorCpf && !this.isValidCpf(dto.donorCpf)) {
      throw new BadRequestException('CPF inválido');
    }

    const [donation] = await this.db
      .insert(donations)
      .values(dto)
      .returning();

    return donation;
  }

  async findAll(campaignId: string, filters: FilterDonationDto) {
    const conditions = [];

    if (filters.startDate) {
      conditions.push(gte(donations.donatedAt, filters.startDate));
    }

    if (filters.endDate) {
      conditions.push(lte(donations.donatedAt, filters.endDate));
    }

    if (filters.method) {
      conditions.push(eq(donations.method, filters.method));
    }

    return this.db
      .select()
      .from(donations)
      .where(and(...conditions))
      .orderBy(desc(donations.donatedAt));
  }

  async getTotalByPeriod(startDate: Date, endDate: Date) {
    const [result] = await this.db
      .select({
        total: sql<number>`sum(${donations.amount})`,
        count: sql<number>`count(*)`,
      })
      .from(donations)
      .where(
        and(
          gte(donations.donatedAt, startDate),
          lte(donations.donatedAt, endDate)
        )
      );

    return result;
  }

  private isValidCpf(cpf: string): boolean {
    // Implementar validação de CPF
    return true; // Simplificado
  }
}
```

#### Passo 4: Frontend Agent executa

```bash
$ cd apps/web
$ claude --agent frontend "criar UI de doações"
```

**Frontend Agent cria:**

```
app/(auth)/donations/
├── page.tsx                 # Lista
├── new/
│   └── page.tsx            # Formulário
└── [id]/
    └── page.tsx            # Detalhes

components/features/donations/
├── donations-table.tsx
├── donation-form.tsx
├── donations-stats.tsx
└── donations-filters.tsx
```

**app/(auth)/donations/page.tsx:**

```typescript
import { DonationsTable } from '@/components/features/donations/donations-table';
import { DonationsStats } from '@/components/features/donations/donations-stats';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getDonations(searchParams: any) {
  const res = await fetch(
    `${process.env.API_URL}/campaigns/${campaignId}/donations?${new URLSearchParams(searchParams)}`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function DonationsPage({ searchParams }: Props) {
  const { data: donations, meta } = await getDonations(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doações</h1>
        <Link href="/donations/new">
          <Button>+ Nova Doação</Button>
        </Link>
      </div>

      <DonationsStats />
      <DonationsTable donations={donations} pagination={meta} />
    </div>
  );
}
```

#### Passo 5: Orchestrator valida

```bash
$ claude --orchestrator "validar feature de doações"
```

**Orchestrator checklist:**

```yaml
validation:
  - database:
      - schema_created: ✓
      - migration_applied: ✓
      - indexes_created: ✓
  
  - backend:
      - module_created: ✓
      - crud_working: ✓
      - validation_working: ✓
      - tests_passing: ✓
  
  - frontend:
      - pages_created: ✓
      - components_working: ✓
      - data_fetching: ✓
      - responsive: ✓
  
  - integration:
      - api_endpoints: ✓
      - type_safety: ✓
      - error_handling: ✓

status: "COMPLETED"
```

---

### Workflow 2: Bug Fix (Performance em Lista de Eleitores)

#### Passo 1: Identificar problema

```bash
$ claude "lista de eleitores está lenta, otimizar"
```

**Orchestrator analisa:**

```yaml
issue: "Voters list slow"
affected_agents:
  - "backend_voters_subagent"
  - "database_queries_subagent"

investigation:
  - "Verificar queries N+1"
  - "Checar indexes"
  - "Avaliar cache"
```

#### Passo 2: Database Agent investiga

```bash
$ claude --agent database_queries "analisar performance de voters queries"
```

**Database Agent identifica:**

```sql
-- Query problemática (sem indexes)
SELECT * FROM voters 
WHERE name ILIKE '%joão%' 
  OR email ILIKE '%joão%';

-- Problema: Full table scan, sem index para LIKE
```

**Solução:**

```typescript
// Adicionar índice trigram para busca parcial
import { sql } from 'drizzle-orm';

// Migration
await db.execute(sql`
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE INDEX voters_name_trgm_idx ON voters USING gin(name gin_trgm_ops);
  CREATE INDEX voters_email_trgm_idx ON voters USING gin(email gin_trgm_ops);
`);
```

#### Passo 3: Backend Agent otimiza

```bash
$ claude --agent backend_voters "otimizar query de busca com cache"
```

**Backend Agent melhora:**

```typescript
// Adicionar cache Redis
async findAll(filters: FilterVoterDto) {
  const cacheKey = `voters:${JSON.stringify(filters)}`;
  
  // Tentar cache
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query otimizada com select específico
  const voters = await this.db
    .select({
      id: voters.id,
      name: voters.name,
      email: voters.email,
      phone: voters.phone,
      zone: voters.zone,
    })
    .from(voters)
    .where(/* ... */)
    .limit(filters.perPage);
  
  // Cachear por 5 min
  await this.redis.setex(cacheKey, 300, JSON.stringify(voters));
  
  return voters;
}
```

#### Passo 4: Validar melhoria

```bash
$ claude --orchestrator "validar otimização de voters list"
```

**Resultado:**

```yaml
performance:
  before:
    - query_time: "2.5s"
    - full_table_scan: true
  
  after:
    - query_time: "150ms"
    - index_used: true
    - cache_hit_rate: "85%"

improvement: "94% faster"
status: "RESOLVED"
```

---

### Workflow 3: Adicionar n8n Workflow

#### Passo 1: Definir automação

```bash
$ claude "criar workflow n8n para enviar WhatsApp quando novo eleitor é criado"
```

**Orchestrator planeja:**

```yaml
feature: "WhatsApp notification on new voter"
agents:
  - "backend_n8n_subagent"
  - "infra_agent" (configurar n8n)
```

#### Passo 2: Backend Agent implementa trigger

```typescript
// modules/voters/voters.service.ts
@Injectable()
export class VotersService {
  constructor(
    private db: Database,
    private n8nService: N8nService, // Injetar
  ) {}

  async create(campaignId: string, dto: CreateVoterDto) {
    const [voter] = await this.db
      .insert(voters)
      .values(dto)
      .returning();

    // Trigger n8n workflow
    await this.n8nService.triggerWorkflow('new-voter-notification', {
      event: 'voter.created',
      campaignId,
      data: {
        voterId: voter.id,
        voterName: voter.name,
        voterPhone: voter.phone,
      },
    });

    return voter;
  }
}
```

#### Passo 3: Configurar n8n workflow

**n8n workflow JSON:**

```json
{
  "name": "New Voter WhatsApp Notification",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "new-voter-notification"
      }
    },
    {
      "name": "Format Message",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "return { phone: $json.data.voterPhone, message: `Bem-vindo(a) ${$json.data.voterName}!` };"
      }
    },
    {
      "name": "Send WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.whatsapp.com/send"
      }
    }
  ]
}
```

---

## Comandos Úteis

### Listar Tasks

```bash
$ claude tasks list
```

```yaml
backlog:
  - "Implementar módulo de pesquisas"
  - "Adicionar exportação PDF de relatórios"
  - "Integrar Google Calendar"

in_progress:
  - "Otimizar queries de analytics"
  - "Criar dashboard de canvassing"

completed:
  - "Módulo de doações" (2024-01-02)
  - "Importação CSV de eleitores" (2024-01-01)
```

### Status de Agent

```bash
$ claude --agent backend_voters status
```

```yaml
agent: "backend_voters_subagent"
status: "idle"
last_task: "Criar busca full-text"
files_modified:
  - "src/modules/voters/voters.service.ts"
  - "src/modules/voters/dto/filter-voter.dto.ts"
next_suggested_tasks:
  - "Adicionar testes unitários"
  - "Implementar exportação CSV"
```

### Gerar Documentação

```bash
$ claude docs generate
```

Gera documentação completa baseado nos agents e código.

---

## Troubleshooting

### Agent não encontrado

```bash
$ claude --agent backend_donations "criar service"
Error: Agent 'backend_donations' not found

# Solução: Criar arquivo do agent
$ touch .claude/agents/backend/donations.md
```

### Conflito entre agents

```yaml
error: "Database schema conflict"
agents_involved:
  - "backend_voters_subagent"
  - "database_schema_subagent"

resolution:
  1. "Orchestrator coordena merge"
  2. "Database agent aplica migration consolidada"
  3. "Backend agent atualiza queries"
```

---

## Best Practices

### 1. Sempre começar pelo Orchestrator

```bash
# ✅ GOOD
$ claude "implementar feature X"

# ❌ BAD
$ cd src/modules
$ # começar a codar direto sem planejar
```

### 2. Um agent, uma responsabilidade

```bash
# ✅ GOOD
$ claude --agent backend_voters "adicionar busca"

# ❌ BAD
$ claude --agent backend_voters "adicionar busca, criar UI, configurar n8n"
```

### 3. Validar após cada etapa

```bash
$ claude --agent database_schema "criar schema"
$ claude validate schema
$ claude --agent backend "criar module"
$ claude validate api
```

### 4. Manter context atualizado

```bash
# Atualizar após mudanças significativas
$ claude context update
```

---

## Exemplo Completo: Feature RAG

```bash
# 1. Orchestrator planeja
$ claude "implementar RAG para consultas sobre campanha"

# 2. Database cria embeddings table
$ claude --agent database_schema "criar tabela document_embeddings com pgvector"

# 3. Backend cria RAG service
$ claude --agent backend_analytics "criar RAG service com OpenAI"

# 4. Frontend cria chat interface
$ claude --agent frontend "criar componente de chat com RAG"

# 5. n8n cria workflow de indexação
$ claude --agent backend_n8n "criar workflow para indexar documentos automaticamente"

# 6. Validar tudo
$ claude --orchestrator "validar feature RAG completa"
```

**Resultado:**
- ✅ Embeddings gerados e armazenados
- ✅ Hybrid search (vector + full-text)
- ✅ Chat interface responsiva
- ✅ Indexação automática de novos docs
- ✅ Testes passando

---

## Próximos Passos

1. **Criar arquivos .claude/** no seu projeto
2. **Testar com task simples** (ex: adicionar campo em schema)
3. **Iterar e melhorar agents** baseado em uso real
4. **Expandir agents** conforme necessidade

O sistema de agents torna desenvolvimento modular, escalável e colaborativo! 🚀
