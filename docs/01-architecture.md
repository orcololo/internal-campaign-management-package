# Arquitetura do Sistema - Gestão Eleitoral

## Princípios Fundamentais

### YAGNI (You Aren't Gonna Need It)
- Implementar apenas o necessário para o MVP
- Não criar abstrações prematuras
- Adicionar complexidade somente quando houver necessidade real

### KISS (Keep It Simple, Stupid)
- Código simples > Código inteligente
- Solução direta > Solução genérica
- Menos camadas = Menos bugs

---

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 14 + React 18 + TailwindCSS + Mapbox GL           │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST/GraphQL + WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                      API GATEWAY                             │
│                     NestJS + Keycloak                        │
└───┬──────────────┬──────────────┬──────────────┬───────────┘
    │              │              │              │
┌───▼───┐    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
│Voters │    │Campaigns│   │Calendar │   │Analytics│
│Module │    │ Module  │   │ Module  │   │ Module  │
└───┬───┘    └────┬────┘   └────┬────┘   └────┬────┘
    │              │              │              │
┌───▼──────────────▼──────────────▼──────────────▼───────────┐
│                    DATA LAYER                                │
│  PostgreSQL + pgvector  │  MongoDB  │  Redis  │  n8n       │
└─────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológica (Justificada)

### Frontend
- **Next.js 14**: App Router, Server Components, ISR
- **React 18**: Hooks, Context, Suspense
- **TailwindCSS**: Utility-first, sem CSS-in-JS desnecessário
- **Mapbox GL JS**: Visualização geoespacial de alta performance
- **Zustand**: State management simples (não precisa Redux)

### Backend
- **NestJS 10+**: Arquitetura modular nativa, TypeScript first
- **Prisma**: ORM type-safe, migrations declarativas
- **Bull/BullMQ**: Job queues para tarefas assíncronas
- **Socket.io**: Real-time para atualizações de dashboard

### Databases
- **PostgreSQL 16**: Dados relacionais + pgvector para embeddings
- **MongoDB 7**: Logs, eventos, dados semi-estruturados
- **Redis 7**: Cache, sessions, pub/sub

### DevOps
- **Docker Compose**: Desenvolvimento local
- **pnpm**: Gerenciador de pacotes (mais rápido que npm)
- **Nx**: Monorepo com builds inteligentes

---

## Estrutura do Monorepo

```
campaign-platform/
├── apps/
│   ├── web/                    # Next.js App
│   │   ├── app/
│   │   │   ├── (auth)/        # Grupo de rotas com auth
│   │   │   │   ├── dashboard/
│   │   │   │   ├── voters/
│   │   │   │   ├── campaigns/
│   │   │   │   └── calendar/
│   │   │   └── api/           # API routes (se necessário)
│   │   ├── components/
│   │   └── lib/
│   │
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── tenants/
│       │   │   ├── voters/
│       │   │   ├── campaigns/
│       │   │   ├── calendar/
│       │   │   ├── n8n/
│       │   │   └── analytics/
│       │   ├── common/
│       │   │   ├── guards/
│       │   │   ├── decorators/
│       │   │   └── filters/
│       │   └── main.ts
│       └── prisma/
│
├── packages/
│   ├── types/                  # Tipos TypeScript compartilhados
│   ├── config/                 # Configurações compartilhadas
│   └── utils/                  # Utilitários compartilhados
│
├── docker-compose.yml
├── nx.json
└── package.json
```

---

## Módulos do Sistema (MVP)

### 1. Tenants/Campaigns Module
**Responsabilidade**: Gerenciar múltiplas campanhas isoladas
- CRUD de campanhas
- Seleção de campanha ativa
- Isolamento de dados por schema

### 2. Voters Module
**Responsabilidade**: Base de eleitores
- CRUD de eleitores
- Importação CSV/Excel
- Segmentação por zona/bairro/perfil
- Busca full-text

### 3. Calendar Module
**Responsabilidade**: Agenda do candidato e eventos
- Eventos públicos vs privados
- Conflitos de horário
- Integração Google Calendar (futuro)

### 4. Canvassing Module
**Responsabilidade**: Mobilização de rua
- Walk lists por região
- Registro de visitas
- Tracking de voluntários

### 5. n8n Integration Module
**Responsabilidade**: Automação e workflows
- Webhooks para n8n
- Envio de mensagens (WhatsApp, SMS, Email)
- Triggers baseados em eventos

### 6. Analytics Module
**Responsabilidade**: Dashboards e insights
- Métricas em tempo real
- Gráficos de evolução
- RAG para consultas em linguagem natural

---

## Multi-Tenancy: Abordagem Simples

### Schema-per-Tenant com Prisma

**Por quê?** Melhor isolamento, backup individual, escalabilidade horizontal.

```typescript
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "campaign_1", "campaign_2"]
}

model Voter {
  id        Int      @id @default(autoincrement())
  name      String
  email     String?
  phone     String?
  zone      String?
  createdAt DateTime @default(now())
  
  @@schema("campaign_1")
}
```

### Tenant Resolver Middleware

```typescript
// src/common/middleware/tenant.middleware.ts
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extrair campaign_id do JWT ou header
    const campaignId = req.headers['x-campaign-id'] || req.user?.campaignId;
    
    if (!campaignId) {
      throw new UnauthorizedException('Campaign context required');
    }
    
    // Definir schema dinâmico
    req['tenantSchema'] = `campaign_${campaignId}`;
    next();
  }
}
```

---

## API Design: REST Simples

### Convenções de Rotas

```
# Voters
GET    /campaigns/:id/voters          # Listar
POST   /campaigns/:id/voters          # Criar
GET    /campaigns/:id/voters/:voterId # Detalhes
PATCH  /campaigns/:id/voters/:voterId # Atualizar
DELETE /campaigns/:id/voters/:voterId # Deletar

# Calendar
GET    /campaigns/:id/events
POST   /campaigns/:id/events
PATCH  /campaigns/:id/events/:eventId

# Canvassing
GET    /campaigns/:id/canvass/sessions
POST   /campaigns/:id/canvass/sessions/:id/door-knocks

# Analytics
GET    /campaigns/:id/analytics/summary
GET    /campaigns/:id/analytics/metrics/:metric
```

### Response Padrão

```typescript
// Sucesso
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-02T10:00:00Z",
    "requestId": "uuid"
  }
}

// Lista paginada
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Erro
{
  "error": {
    "code": "VOTER_NOT_FOUND",
    "message": "Eleitor não encontrado",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-01-02T10:00:00Z",
    "requestId": "uuid"
  }
}
```

---

## Real-time Updates

### WebSocket com Socket.io (Simples)

```typescript
// Gateway para atualizações em tempo real
@WebSocketGateway({ namespace: '/campaign' })
export class CampaignGateway {
  @WebSocketServer()
  server: Server;

  // Cliente entra em uma "sala" da campanha
  @SubscribeMessage('join-campaign')
  handleJoinCampaign(client: Socket, campaignId: string) {
    client.join(`campaign-${campaignId}`);
  }

  // Emitir atualizações para todos da campanha
  notifyNewVoter(campaignId: string, voter: any) {
    this.server.to(`campaign-${campaignId}`).emit('voter-created', voter);
  }
}
```

---

## Cache Strategy

### Redis para Performance

```typescript
// Exemplo: Cache de lista de eleitores
@Injectable()
export class VotersService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll(campaignId: string, filters: any) {
    const cacheKey = `voters:${campaignId}:${JSON.stringify(filters)}`;
    
    // Tentar cache primeiro
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    
    // Buscar do banco
    const voters = await this.prisma.voter.findMany({
      where: { ...filters },
    });
    
    // Cachear por 5 minutos
    await this.cache.set(cacheKey, voters, 300);
    
    return voters;
  }
}
```

---

## Logging e Monitoring (Mínimo Viável)

### Winston para Logs Estruturados

```typescript
// logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Em produção: adicionar transport para arquivo ou serviço externo
  ],
});
```

### Health Check Endpoint

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
```

---

## Segurança Básica (KISS)

### 1. Autenticação com Keycloak
- JWT Bearer tokens
- Refresh tokens via HttpOnly cookies
- Token validation em cada request

### 2. Autorização RBAC
- Guards do NestJS
- Decorators para roles
- Validação de tenant/campaign

### 3. Input Validation
- class-validator em todos DTOs
- Sanitização automática

### 4. Rate Limiting
- @nestjs/throttler: 100 req/min por IP

### 5. CORS
- Whitelist de domínios permitidos
- Credentials: true apenas para domínios conhecidos

---

## Próximos Passos

1. ✅ **Arquitetura definida**
2. 📝 Backend detalhado (NestJS modules)
3. 📝 Frontend detalhado (Next.js structure)
4. 📝 Database schemas (PostgreSQL + MongoDB)
5. 📝 Auth flow (Keycloak integration)
6. 📝 n8n Integration patterns
7. 📝 Development guidelines (TypeScript best practices)
8. 📝 Deployment strategy

---

## Decisões Arquiteturais (ADRs)

### ADR-001: Por que Next.js App Router?
- Server Components para melhor performance
- Layouts aninhados simplificam UI
- API Routes opcional (usamos backend separado)

### ADR-002: Por que Schema-per-Tenant?
- Isolamento total de dados entre campanhas
- Backup/restore individual
- Performance > Row-Level Security

### ADR-003: Por que Prisma sobre TypeORM?
- Type-safety superior
- Migrations mais claras
- Developer experience excelente

### ADR-004: Por que Zustand sobre Redux?
- Menos boilerplate (KISS)
- Performance sem Context hell
- Fácil integração com React Server Components
