# Sistema de Gerenciamento Eleitoral - Documentação Completa

## 📚 Índice de Documentação

### Core Architecture
1. **[01-architecture.md](01-architecture.md)** - Visão geral da arquitetura
   - Stack tecnológica completa
   - Multi-tenancy com Schema-per-Tenant
   - Decisões arquiteturais (ADRs)
   - Estrutura do monorepo

2. **[02-backend.md](02-backend.md)** - Backend NestJS
   - Estrutura modular de features
   - DTOs e validação
   - Guards e decorators
   - Jobs assíncronos com Bull
   - Templates de código

3. **[03-frontend.md](03-frontend.md)** - Frontend Next.js 14
   - App Router structure
   - Server e Client Components
   - Mapbox para georreferenciamento
   - Custom hooks
   - State management com Zustand

### Database & Auth
4. **[04-database.md](04-database.md)** - Database com Prisma *(versão original)*
   - Schemas PostgreSQL
   - pgvector para RAG
   - MongoDB para logs
   - Redis para cache

5. **[09-database-drizzle.md](09-database-drizzle.md)** - Database com Drizzle *(atualizado)*
   - ⭐ **USAR ESTA VERSÃO**
   - Schemas Drizzle ORM
   - Queries otimizadas
   - Migrations SQL-based
   - Type inference automático

6. **[05-auth.md](05-auth.md)** - Autenticação Keycloak
   - Setup Keycloak completo
   - RBAC com 4 níveis
   - JWT integration
   - Frontend + Backend auth
   - Multi-campaign context

### Integration & Automation
7. **[06-n8n-integration.md](06-n8n-integration.md)** - Integração n8n
   - Webhooks bidirecionais
   - Workflows de automação
   - WhatsApp, Email, SMS
   - RAG-powered chatbot
   - Error handling e retries

### Development & Deployment
8. **[07-development-guidelines.md](07-development-guidelines.md)** - Guidelines TypeScript
   - YAGNI e KISS principles
   - Naming conventions
   - Error handling
   - Testing patterns
   - Code review checklist

9. **[08-deployment.md](08-deployment.md)** - Deploy e Infraestrutura
   - Docker Compose
   - GitHub Actions CI/CD
   - Monitoring com Prometheus
   - Backup strategy
   - Scaling horizontal

### Agents System (Claude Code)
10. **[10-agents-structure.md](10-agents-structure.md)** - Estrutura de Agents
    - ⭐ **ESSENCIAL PARA CLAUDE CODE**
    - Orchestrator Agent
    - Backend Agents (Auth, Voters, Calendar, N8n, Analytics)
    - Frontend Agents (UI, Forms, Maps)
    - Database Agents (Schema, Migrations, Queries)
    - Infra Agents (Docker, CI/CD)

11. **[11-agents-practical-guide.md](11-agents-practical-guide.md)** - Guia Prático de Agents
    - ⭐ **WORKFLOWS COMPLETOS**
    - Como usar agents com Claude Code
    - Exemplos práticos de tasks
    - Workflow: Criar nova feature
    - Workflow: Bug fix e otimização
    - Comandos úteis
    - Troubleshooting

---

## 🚀 Quick Start

### 1. Setup do Projeto

```bash
# Criar monorepo
npx create-nx-workspace@latest campaign-platform --preset=empty

# Estrutura de agents
mkdir -p .claude/{agents/{backend,frontend,database,infra},tasks,context}

# Copiar arquivos de agents dos docs
# (arquivos 10-agents-structure.md e 11-agents-practical-guide.md)
```

### 2. Iniciar Infraestrutura

```bash
# Docker Compose (PostgreSQL, MongoDB, Redis, Keycloak, n8n)
docker-compose up -d

# Verificar
docker ps
```

### 3. Backend Setup

```bash
cd apps/api
pnpm install

# Drizzle setup
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit

# Criar schema (ver 09-database-drizzle.md)
# Aplicar migrations
pnpm drizzle-kit push:pg
```

### 4. Frontend Setup

```bash
cd apps/web
pnpm install

# Next.js 14 com App Router já configurado
pnpm dev
```

### 5. Usar Agents com Claude Code

```bash
# Implementar primeira feature
claude "implementar módulo de eleitores completo"

# Orchestrator delega para agents
# Ver 11-agents-practical-guide.md para detalhes
```

---

## 📊 Stack Resumida

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | Next.js | 14 |
| | React | 18 |
| | TailwindCSS | 3.x |
| | Zustand | 4.x |
| | Mapbox GL JS | 3.x |
| **Backend** | NestJS | 10+ |
| | Drizzle ORM | Latest |
| | Bull | 4.x |
| | Socket.io | 4.x |
| **Auth** | Keycloak | 23+ |
| **Database** | PostgreSQL | 16 |
| | pgvector | 0.8+ |
| | MongoDB | 7 |
| | Redis | 7 |
| **Automação** | n8n | Latest |
| **DevOps** | Docker | Latest |
| | pnpm | 9+ |
| | GitHub Actions | - |

---

## 🎯 Módulos Essenciais

### MVP Features

1. **Tenants/Campaigns** - Multi-campanha
2. **Voters** - Base de eleitores (CRUD + importação)
3. **Calendar** - Agenda do candidato
4. **Canvassing** - Mobilização de rua
5. **Donations** - Gestão financeira
6. **Analytics** - Dashboards + RAG
7. **n8n Integration** - Automações

### Futuras Features

- Pesquisas internas
- Gestão de conteúdo (posts, vídeos)
- Sincronização Google Calendar
- App mobile (React Native)
- Compliance TSE (futuro)

---

## 🏗️ Arquitetura Multi-Tenant

```
PostgreSQL
├── schema: public
│   ├── campaigns
│   ├── users
│   └── campaign_users
│
├── schema: campaign_silva_2024
│   ├── voters
│   ├── events
│   ├── donations
│   └── ...
│
└── schema: campaign_santos_2024
    ├── voters
    ├── events
    └── ...
```

**Vantagens:**
- Isolamento total de dados
- Backup/restore individual
- Performance > Row-Level Security
- Escalabilidade horizontal

---

## 🤖 Sistema de Agents

### Hierarquia

```
Orchestrator
├── Backend Agent
│   ├── Auth Subagent
│   ├── Voters Subagent
│   ├── Calendar Subagent
│   ├── Canvassing Subagent
│   ├── N8n Subagent
│   └── Analytics Subagent
│
├── Frontend Agent
│   ├── UI Subagent
│   ├── Forms Subagent
│   ├── Maps Subagent
│   └── Feature-specific Subagents
│
├── Database Agent
│   ├── Schema Design Subagent
│   ├── Migrations Subagent
│   └── Query Optimization Subagent
│
└── Infra Agent
    ├── Docker Subagent
    └── CI/CD Subagent
```

### Como Funciona

1. **User**: "Implementar módulo de doações"
2. **Orchestrator**: Analisa e quebra em subtasks
3. **Delega**: Database → Backend → Frontend
4. **Validação**: Orchestrator verifica integração
5. **Deploy**: Infra Agent cuida do deploy

---

## 📝 Convenções de Código

### TypeScript

```typescript
// ✅ GOOD
const voterCount = 10;
async function getVoters(filters: FilterDto) { }
interface CreateVoterDto { }

// ❌ BAD
const voter_count = 10;
function get_voters(filters: any) { }
```

### Estrutura de Módulos

```
modules/feature/
├── feature.module.ts
├── feature.controller.ts
├── feature.service.ts
├── dto/
└── feature.constants.ts
```

### Commits

```bash
feat: adicionar módulo de doações
fix: corrigir validação de CPF
refactor: simplificar voters service
docs: atualizar README
```

---

## 🔐 RBAC (4 Níveis)

| Papel | Permissões |
|-------|------------|
| **CANDIDATO** | Acesso total |
| **ESTRATEGISTA** | Analytics + Planejamento |
| **LIDERANÇA** | Coordenação regional |
| **ESCRITÓRIO** | Operações básicas |

---

## 🚢 Deploy

### Desenvolvimento

```bash
docker-compose up -d
pnpm dev
```

### Produção

```bash
# CI/CD automático via GitHub Actions
git push origin main

# Ou manual
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📈 Métricas Estimadas

- **Usuários simultâneos**: até 250
- **Eleitores por campanha**: até 100.000
- **Mensagens/dia**: até 10.000 (via n8n)
- **Custo mensal**: ~$200 (AWS/DO) ou ~$55 (Vercel+Supabase)

---

## 🎓 Recursos de Aprendizado

### Documentação Oficial
- [Next.js 14 Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Keycloak Docs](https://www.keycloak.org/documentation)
- [n8n Docs](https://docs.n8n.io)

### Exemplos de Uso
- Ver `11-agents-practical-guide.md` para workflows completos
- Ver `07-development-guidelines.md` para padrões de código
- Ver `06-n8n-integration.md` para automações

---

## 🐛 Troubleshooting

### Drizzle não encontra schema
```bash
# Verificar drizzle.config.ts
# Regenerar client
pnpm drizzle-kit generate:pg
```

### Keycloak não inicia
```bash
# Verificar se PostgreSQL está rodando
docker logs campaign_keycloak
```

### n8n webhooks não funcionam
```bash
# Verificar N8N_WEBHOOK_SECRET nas env vars
# Testar com curl
curl -H "Authorization: Bearer secret" http://localhost:5678/webhook/test
```

---

## ✅ Checklist de Implementação

### Fase 1: Setup (1-2 semanas)
- [ ] Monorepo criado (Nx)
- [ ] Docker Compose configurado
- [ ] Keycloak setup
- [ ] Drizzle schemas criados
- [ ] Agents estruturados

### Fase 2: MVP (4-6 semanas)
- [ ] Auth completo
- [ ] Módulo Voters
- [ ] Módulo Calendar
- [ ] Módulo Canvassing
- [ ] Dashboard básico

### Fase 3: Automação (2-3 semanas)
- [ ] n8n workflows
- [ ] WhatsApp integration
- [ ] Email automation
- [ ] RAG implementado

### Fase 4: Polish (2-3 semanas)
- [ ] Testes completos
- [ ] CI/CD configurado
- [ ] Monitoring ativo
- [ ] Documentação final

---

## 🤝 Contribuindo

Este é um projeto modular. Use o sistema de agents para:

1. **Adicionar features**: `claude "implementar feature X"`
2. **Corrigir bugs**: `claude "corrigir bug Y"`
3. **Otimizar**: `claude "otimizar performance de Z"`

Agents garantem consistência e qualidade!

---

## 📞 Próximos Passos

1. **Ler documentação completa** (especialmente agents)
2. **Configurar ambiente local** (Docker)
3. **Criar primeira feature** com Claude Code
4. **Iterar e melhorar**

**Ready to build! 🚀**

---

**Versão**: 1.0  
**Última atualização**: Janeiro 2025  
**Princípios**: YAGNI, KISS, Modular, Type-safe
