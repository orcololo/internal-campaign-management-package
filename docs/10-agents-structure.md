# Agents & Subagents - Claude Code Structure

## Arquitetura de Agents

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                        │
│              (Coordena todos os agents)                      │
└──────┬──────────────┬──────────────┬───────────────┬────────┘
       │              │              │               │
┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐
│ BACKEND     │ │ FRONTEND │ │ DATABASE   │ │ INFRA      │
│ AGENT       │ │ AGENT    │ │ AGENT      │ │ AGENT      │
└──────┬──────┘ └────┬─────┘ └─────┬──────┘ └─────┬──────┘
       │              │              │               │
    Subagents     Subagents      Subagents      Subagents
```

---

## 1. ORCHESTRATOR AGENT

**Responsabilidade**: Coordenar todos os agents e manter visão geral do projeto.

### Arquivo de Contexto

```markdown
# .claude/orchestrator.md

## Minha Função
Sou o Orchestrator Agent. Coordeno o desenvolvimento do sistema de gerenciamento eleitoral.

## Arquitetura do Sistema
- **Backend**: NestJS + Drizzle ORM + Keycloak
- **Frontend**: Next.js 14 + React 18
- **Database**: PostgreSQL + MongoDB + Redis
- **Automação**: n8n

## Princípios
- YAGNI: Implementar apenas o necessário
- KISS: Soluções simples sempre
- Modular: Features isoladas
- Type-safe: TypeScript em todo lugar

## Agents Disponíveis
1. Backend Agent (modules/*)
2. Frontend Agent (apps/web/*)
3. Database Agent (db/*)
4. Infra Agent (docker, CI/CD)

## Quando Delegar
- **Backend**: APIs, services, controllers
- **Frontend**: Components, pages, hooks
- **Database**: Schemas, migrations, queries
- **Infra**: Docker, deploy, monitoring

## Workflow
1. Receber task do usuário
2. Quebrar em subtasks
3. Delegar para agents específicos
4. Coordenar integração
5. Validar resultado final
```

### Tasks do Orchestrator

```yaml
# .claude/orchestrator-tasks.yml
tasks:
  - name: "Inicializar projeto"
    description: "Setup inicial do monorepo"
    delegates:
      - infra_agent: "Criar docker-compose.yml"
      - backend_agent: "Setup NestJS base"
      - frontend_agent: "Setup Next.js base"
      - database_agent: "Criar schemas iniciais"
  
  - name: "Implementar feature completa"
    description: "Nova feature end-to-end"
    workflow:
      1. database_agent: "Criar schema"
      2. backend_agent: "Criar module + API"
      3. frontend_agent: "Criar UI + integration"
      4. orchestrator: "Validar integração"
```

---

## 2. BACKEND AGENT

**Responsabilidade**: Desenvolvimento do backend NestJS.

### Subagents

#### 2.1 AUTH SUBAGENT

```markdown
# .claude/agents/backend/auth.md

## Minha Especialidade
Autenticação e autorização com Keycloak.

## O que eu faço
- Integração Keycloak
- Guards e decorators
- JWT validation
- RBAC implementation

## Arquivos sob minha responsabilidade
- src/modules/auth/*
- src/common/guards/*
- src/common/decorators/auth.decorator.ts

## Padrões que sigo
```typescript
// Guard padrão
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return roles.some(role => user.roles?.includes(role));
  }
}

// Decorator padrão
export const RequireRole = (...roles: string[]) => Roles(...roles);
```

## Checklist para nova feature
- [ ] Guard criado se necessário
- [ ] Decorator criado para facilitar uso
- [ ] Testes unitários
- [ ] Documentação de permissões
```

#### 2.2 VOTERS SUBAGENT

```markdown
# .claude/agents/backend/voters.md

## Minha Especialidade
Módulo de eleitores (CRUD + importação + segmentação).

## Estrutura de arquivos
```
modules/voters/
├── voters.module.ts
├── voters.controller.ts
├── voters.service.ts
├── dto/
│   ├── create-voter.dto.ts
│   ├── update-voter.dto.ts
│   └── filter-voter.dto.ts
└── voters.constants.ts
```

## Template de Service
```typescript
@Injectable()
export class VotersService {
  constructor(@Inject('DATABASE') private db: Database) {}

  async findAll(campaignId: string, filters: FilterVoterDto) {
    // Usar Drizzle
    const conditions = [];
    
    if (filters.search) {
      conditions.push(
        sql`${voters.name} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    return db.select().from(voters).where(and(...conditions));
  }
}
```

## Checklist
- [ ] DTOs com validação
- [ ] Service com Drizzle queries
- [ ] Controller com guards
- [ ] Testes unitários
- [ ] Soft delete implementado
```

#### 2.3 CALENDAR SUBAGENT

```markdown
# .claude/agents/backend/calendar.md

## Minha Especialidade
Módulo de agenda e eventos.

## Responsabilidades
- CRUD de eventos
- Validação de conflitos
- Notificações (via n8n)
- Sincronização Google Calendar (futuro)

## Estrutura
```
modules/calendar/
├── calendar.module.ts
├── calendar.controller.ts
├── calendar.service.ts
├── dto/
└── calendar.constants.ts
```

## Validação de Conflitos
```typescript
async checkConflicts(startTime: Date, endTime: Date): Promise<boolean> {
  const conflicts = await this.db
    .select()
    .from(events)
    .where(
      and(
        sql`${events.startTime} < ${endTime}`,
        sql`${events.endTime} > ${startTime}`
      )
    );
  
  return conflicts.length > 0;
}
```
```

#### 2.4 CANVASSING SUBAGENT

```markdown
# .claude/agents/backend/canvassing.md

## Minha Especialidade
Mobilização de rua (canvassing).

## Features
- Sessions de canvassing
- Door knocks tracking
- GPS tracking
- Offline sync

## Schema
- canvass_sessions
- door_knocks

## GeoJSON para rotas
```typescript
interface Route {
  type: 'LineString';
  coordinates: [number, number][];
}
```
```

#### 2.5 N8N INTEGRATION SUBAGENT

```markdown
# .claude/agents/backend/n8n.md

## Minha Especialidade
Integração com n8n para automações.

## Workflows que suporto
- Envio em massa (WhatsApp, Email, SMS)
- Análise de sentimento
- Relatórios agendados
- RAG-powered responses

## Padrões de Webhook
```typescript
// Outgoing: API -> n8n
async triggerWorkflow(name: string, payload: any) {
  return this.http.post(
    `${this.n8nUrl}/webhook/${name}`,
    payload,
    { headers: { Authorization: `Bearer ${this.secret}` } }
  );
}

// Incoming: n8n -> API
@Post('webhooks/n8n/:event')
async handleWebhook(@Param('event') event: string, @Body() data: any) {
  if (!this.validateSecret(req.headers.authorization)) {
    throw new UnauthorizedException();
  }
  // Process webhook
}
```
```

#### 2.6 ANALYTICS SUBAGENT

```markdown
# .claude/agents/backend/analytics.md

## Minha Especialidade
Analytics e dashboards com RAG.

## Features
- Métricas agregadas
- Dashboards em tempo real
- RAG queries
- Exportação de relatórios

## RAG Implementation
```typescript
async queryWithRAG(question: string): Promise<string> {
  // 1. Generate embedding
  const embedding = await this.openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });
  
  // 2. Vector search
  const docs = await this.db.execute(sql`
    SELECT * FROM document_embeddings
    ORDER BY embedding <=> ${embedding}::vector(1536)
    LIMIT 5
  `);
  
  // 3. Generate response with context
  const response = await this.openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Você é assistente da campanha.' },
      { role: 'user', content: `Contexto: ${docs}\n\nPergunta: ${question}` },
    ],
  });
  
  return response.choices[0].message.content;
}
```
```

---

## 3. FRONTEND AGENT

**Responsabilidade**: Desenvolvimento do frontend Next.js.

### Subagents

#### 3.1 UI COMPONENTS SUBAGENT

```markdown
# .claude/agents/frontend/ui.md

## Minha Especialidade
Componentes UI reutilizáveis.

## Estrutura
```
components/ui/
├── button.tsx
├── input.tsx
├── table.tsx
├── modal.tsx
├── select.tsx
└── card.tsx
```

## Padrão de Componente
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded font-medium transition',
        variants[variant],
        sizes[size]
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Guidelines
- TailwindCSS para styling
- Acessibilidade (a11y)
- Responsivo por padrão
- Dark mode ready
```

#### 3.2 VOTERS UI SUBAGENT

```markdown
# .claude/agents/frontend/voters.md

## Minha Especialidade
Interface de gestão de eleitores.

## Páginas
- `/voters` - Lista
- `/voters/[id]` - Detalhes
- `/voters/new` - Criar

## Componentes
```
components/features/voters/
├── voters-table.tsx
├── voter-form.tsx
├── voter-card.tsx
├── voter-filters.tsx
└── voter-import-modal.tsx
```

## Data Fetching Pattern
```typescript
// Server Component
async function VotersPage({ searchParams }: Props) {
  const voters = await fetchVoters(searchParams);
  return <VotersTable voters={voters} />;
}

// Client Component
'use client';
function VotersTable({ voters }: Props) {
  return <Table data={voters} />;
}
```
```

#### 3.3 CALENDAR UI SUBAGENT

```markdown
# .claude/agents/frontend/calendar.md

## Minha Especialidade
Interface de calendário e eventos.

## Componentes
- Calendar view (monthly/weekly/daily)
- Event form
- Event details modal
- Conflict warnings

## Libraries
- react-big-calendar
- date-fns para manipulação
```

#### 3.4 MAPS SUBAGENT

```markdown
# .claude/agents/frontend/maps.md

## Minha Especialidade
Visualizações de mapas com Mapbox.

## Features
- Heatmap de eleitores
- Zonas eleitorais
- Canvassing routes
- Real-time tracking

## Componentes
```
components/features/maps/
├── voter-heatmap.tsx
├── electoral-zones.tsx
├── canvass-route.tsx
└── location-picker.tsx
```

## Mapbox Pattern
```typescript
'use client';
import mapboxgl from 'mapbox-gl';

export function VoterHeatmap({ voters }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-46.6333, -23.5505],
      zoom: 11,
    });
    
    map.on('load', () => {
      // Add heatmap layer
    });
    
    return () => map.remove();
  }, [voters]);
  
  return <div ref={mapContainer} className="w-full h-[600px]" />;
}
```
```

#### 3.5 FORMS SUBAGENT

```markdown
# .claude/agents/frontend/forms.md

## Minha Especialidade
Formulários com validação.

## Stack
- react-hook-form
- zod para validação
- Error handling

## Pattern
```typescript
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: FormData) => {
    await api.create(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      {errors.name && <Error>{errors.name.message}</Error>}
    </form>
  );
}
```
```

---

## 4. DATABASE AGENT

**Responsabilidade**: Schemas, migrations e queries.

### Subagents

#### 4.1 SCHEMA DESIGN SUBAGENT

```markdown
# .claude/agents/database/schema.md

## Minha Especialidade
Design de schemas Drizzle.

## Padrões
```typescript
// Sempre usar:
- pgTable para tabelas
- uuid() para IDs (campaigns, users)
- integer().generatedAlwaysAsIdentity() para IDs (voters, events)
- timestamp('created_at').defaultNow() para timestamps
- Enums para valores fixos
- Indexes para campos pesquisados
- Relations para queries relacionais

// Evitar:
- any
- Campos sem NOT NULL definido
- Falta de indexes em foreign keys
```

## Checklist
- [ ] Enums criados se necessário
- [ ] Indexes em campos pesquisados
- [ ] Relations definidas
- [ ] Soft delete considerado
```

#### 4.2 MIGRATIONS SUBAGENT

```markdown
# .claude/agents/database/migrations.md

## Minha Especialidade
Gerenciar migrations Drizzle.

## Comandos
```bash
# Gerar migration
pnpm drizzle-kit generate:pg

# Aplicar migrations
pnpm drizzle-kit push:pg

# Studio (visualizar)
pnpm drizzle-kit studio
```

## Checklist
- [ ] Migration testada localmente
- [ ] Rollback plan definido
- [ ] Backup antes de aplicar em prod
```

#### 4.3 QUERIES OPTIMIZATION SUBAGENT

```markdown
# .claude/agents/database/queries.md

## Minha Especialidade
Otimização de queries Drizzle.

## Best Practices
```typescript
// ✅ GOOD: Select apenas campos necessários
const voters = await db
  .select({
    id: voters.id,
    name: voters.name,
  })
  .from(voters);

// ❌ BAD: Select tudo
const voters = await db.select().from(voters);

// ✅ GOOD: Prepared statements para queries repetidas
const getVoter = db.select().from(voters)
  .where(eq(voters.id, sql.placeholder('id')))
  .prepare('get_voter');

// ✅ GOOD: Batch operations
await db.insert(voters).values([...array]);
```
```

---

## 5. INFRA AGENT

**Responsabilidade**: Docker, CI/CD, deploy.

### Subagents

#### 5.1 DOCKER SUBAGENT

```markdown
# .claude/agents/infra/docker.md

## Minha Especialidade
Docker e docker-compose.

## Arquivos
- docker-compose.yml
- Dockerfile (backend)
- Dockerfile (frontend)
- .dockerignore

## Checklist
- [ ] Health checks configurados
- [ ] Volumes persistentes
- [ ] Networks isoladas
- [ ] Secrets via env vars
```

#### 5.2 CI/CD SUBAGENT

```markdown
# .claude/agents/infra/cicd.md

## Minha Especialidade
GitHub Actions para CI/CD.

## Pipelines
- `.github/workflows/api.yml` - Backend
- `.github/workflows/web.yml` - Frontend
- `.github/workflows/test.yml` - Tests

## Stages
1. Test (lint + unit tests)
2. Build (Docker image)
3. Deploy (SSH to server)
```

---

## TASK ASSIGNMENT MATRIX

| Task Type | Primary Agent | Supporting Agents |
|-----------|---------------|-------------------|
| Nova feature | Orchestrator | Backend, Frontend, Database |
| Bug fix | Feature-specific agent | - |
| Refactor | Feature-specific agent | - |
| Performance | Database Agent | Backend Agent |
| UI/UX | Frontend Agent | UI Subagent |
| Deployment | Infra Agent | - |
| Security | Auth Subagent | Orchestrator |

---

## COMMUNICATION PROTOCOL

### Entre Agents

```yaml
# agent-communication.yml
format: "AGENT_MESSAGE"
structure:
  from: "agent_name"
  to: "agent_name"
  task: "task_description"
  context:
    - "relevant_info_1"
    - "relevant_info_2"
  artifacts:
    - "file_path_1"
    - "file_path_2"
```

### Exemplo

```yaml
from: "orchestrator"
to: "backend_voters_subagent"
task: "Implementar importação CSV de eleitores"
context:
  - "Campos obrigatórios: name, phone"
  - "Validar duplicatas por phone"
  - "Max 1000 por batch"
artifacts:
  - "src/modules/voters/voters.service.ts"
  - "src/modules/voters/dto/import-voter.dto.ts"
```

---

## DIRECTORY STRUCTURE FOR AGENTS

```
.claude/
├── orchestrator.md
├── agents/
│   ├── backend/
│   │   ├── auth.md
│   │   ├── voters.md
│   │   ├── calendar.md
│   │   ├── canvassing.md
│   │   ├── n8n.md
│   │   └── analytics.md
│   ├── frontend/
│   │   ├── ui.md
│   │   ├── voters.md
│   │   ├── calendar.md
│   │   ├── maps.md
│   │   └── forms.md
│   ├── database/
│   │   ├── schema.md
│   │   ├── migrations.md
│   │   └── queries.md
│   └── infra/
│       ├── docker.md
│       └── cicd.md
├── tasks/
│   ├── backlog.yml
│   ├── in-progress.yml
│   └── completed.yml
└── context/
    ├── architecture.md
    ├── tech-stack.md
    └── conventions.md
```

---

## USAGE WITH CLAUDE CODE

### Comando: Iniciar Task

```bash
# Claude Code detecta contexto do agent
cd src/modules/voters
# Automaticamente carrega .claude/agents/backend/voters.md

# Ou explicitamente
claude --agent backend_voters_subagent "implementar busca full-text"
```

### Comando: Trocar Agent

```bash
claude --agent frontend_voters "criar tabela de eleitores"
```

### Comando: Multi-Agent Task

```bash
claude --orchestrate "implementar feature de doações"
# Orchestrator delega:
# 1. database_agent: criar schema
# 2. backend_agent: criar API
# 3. frontend_agent: criar UI
```

---

## AGENT INITIALIZATION CHECKLIST

Para cada novo agent/subagent:

- [ ] Criar arquivo .md em `.claude/agents/`
- [ ] Definir responsabilidades claras
- [ ] Listar arquivos sob responsabilidade
- [ ] Documentar padrões e templates
- [ ] Criar checklist de tasks
- [ ] Adicionar exemplos de código
- [ ] Definir comunicação com outros agents

---

## NEXT STEPS

1. Criar arquivos `.claude/agents/` no projeto
2. Configurar Claude Code para reconhecer agents
3. Testar workflow com task simples
4. Iterar baseado em feedback
