# Deployment - Infraestrutura e CI/CD

## Stack de Infraestrutura

```
┌─────────────────────────────────────────────┐
│           Cloudflare / Route 53              │
│              (DNS + CDN)                     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Load Balancer (NGINX)               │
└──────┬─────────────────────┬─────────────────┘
       │                     │
┌──────▼──────┐      ┌──────▼──────┐
│  Next.js    │      │  NestJS     │
│  Frontend   │      │  Backend    │
│  (3 nodes)  │      │  (3 nodes)  │
└─────────────┘      └──────┬──────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
      ┌─────▼────┐   ┌─────▼────┐   ┌─────▼────┐
      │PostgreSQL│   │  MongoDB │   │  Redis   │
      │(Primary) │   │ (Logs)   │   │ (Cache)  │
      │+ Replica │   │          │   │          │
      └──────────┘   └──────────┘   └──────────┘
```

---

## Docker Compose (Desenvolvimento)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: campaign_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: campaign_db
      POSTGRES_USER: campaign
      POSTGRES_PASSWORD: changeme
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U campaign"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB
  mongodb:
    image: mongo:7
    container_name: campaign_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: changeme
      MONGO_INITDB_DATABASE: campaign_logs
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  # Redis
  redis:
    image: redis:7-alpine
    container_name: campaign_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # Keycloak
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    container_name: campaign_keycloak
    restart: unless-stopped
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: changeme
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: campaign
      KC_DB_PASSWORD: changeme
      KC_HOSTNAME: localhost
    ports:
      - "8080:8080"
    command: start-dev
    depends_on:
      postgres:
        condition: service_healthy

  # n8n
  n8n:
    image: n8nio/n8n:latest
    container_name: campaign_n8n
    restart: unless-stopped
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=campaign
      - DB_POSTGRESDB_PASSWORD=changeme
      - WEBHOOK_URL=http://localhost:5678/
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

  # Backend API (NestJS)
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: campaign_api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://campaign:changeme@postgres:5432/campaign_db
      REDIS_URL: redis://redis:6379
      MONGODB_URL: mongodb://admin:changeme@mongodb:27017/campaign_logs?authSource=admin
      KEYCLOAK_URL: http://keycloak:8080
      N8N_WEBHOOK_URL: http://n8n:5678
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
      - mongodb
      - keycloak
    volumes:
      - ./apps/api:/app
      - /app/node_modules

  # Frontend (Next.js)
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: campaign_web
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000/api/v1
      NEXTAUTH_URL: http://localhost:3001
      KEYCLOAK_CLIENT_ID: campaign-web
    ports:
      - "3001:3000"
    depends_on:
      - api
    volumes:
      - ./apps/web:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
  n8n_data:

networks:
  default:
    name: campaign_network
```

---

## Dockerfiles

### Backend (NestJS)

```dockerfile
# apps/api/Dockerfile

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build
RUN pnpm prisma generate
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copiar apenas necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Frontend (Next.js)

```dockerfile
# apps/web/Dockerfile

# Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

# Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## CI/CD com GitHub Actions

### Backend Pipeline

```yaml
# .github/workflows/api.yml
name: API - Build & Deploy

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/api/**'
      - 'packages/**'
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run Prisma migrations
        run: pnpm prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run tests
        run: pnpm test
      
      - name: Run lint
        run: pnpm lint

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./apps/api
          push: true
          tags: campaign/api:latest,campaign/api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/campaign
            docker compose pull api
            docker compose up -d api
            docker image prune -f
```

### Frontend Pipeline

```yaml
# .github/workflows/web.yml
name: Web - Build & Deploy

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Database Migrations

### Prisma Migration Strategy

```bash
# Desenvolvimento: Criar migration
pnpm prisma migrate dev --name add_voters_table

# CI/CD: Aplicar migrations
pnpm prisma migrate deploy

# Produção: Preview antes de aplicar
pnpm prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel postgresql://user:pass@prod-db/campaign
```

### Rollback Strategy

```bash
# Reverter última migration
pnpm prisma migrate resolve --rolled-back 20240102_add_voters_table

# Aplicar migration específica
pnpm prisma migrate resolve --applied 20240101_initial_schema
```

---

## Monitoramento e Logs

### Prometheus + Grafana

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=changeme
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
```

### Prometheus Config

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nestjs-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
  
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

---

## Backup Strategy

### Automated PostgreSQL Backup

```bash
#!/bin/bash
# scripts/backup-postgres.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="campaign_db"

# Backup completo
pg_dump -h localhost -U campaign -d $DB_NAME \
  --format=custom \
  --file=$BACKUP_DIR/full_${DATE}.dump

# Backup por schema (multi-tenant)
for schema in $(psql -h localhost -U campaign -d $DB_NAME -tAc \
  "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'campaign_%'")
do
  pg_dump -h localhost -U campaign -d $DB_NAME \
    --schema=$schema \
    --format=custom \
    --file=$BACKUP_DIR/${schema}_${DATE}.dump
done

# Limpar backups > 30 dias
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
```

### Cron Job

```cron
# Backup diário às 3h da manhã
0 3 * * * /opt/campaign/scripts/backup-postgres.sh

# Backup semanal MongoDB (domingos 4h)
0 4 * * 0 mongodump --out=/backups/mongodb/$(date +\%Y\%m\%d)
```

---

## Scaling Strategy

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
services:
  api:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
  
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
    depends_on:
      - api
```

### NGINX Load Balancer

```nginx
# nginx.conf
upstream api_backend {
    least_conn;
    server api_1:3000;
    server api_2:3000;
    server api_3:3000;
}

server {
    listen 80;
    
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Environment Variables Management

### Production .env Template

```bash
# .env.production
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@postgres.internal:5432/campaign_db
REDIS_URL=redis://redis.internal:6379
MONGODB_URL=mongodb://user:pass@mongodb.internal:27017/campaign_logs

# Keycloak
KEYCLOAK_URL=https://auth.campaign.com
KEYCLOAK_REALM=campaign-platform
KEYCLOAK_CLIENT_ID=campaign-api
KEYCLOAK_CLIENT_SECRET=xxx

# n8n
N8N_WEBHOOK_URL=https://n8n.campaign.com
N8N_WEBHOOK_SECRET=xxx

# API
API_PORT=3000
API_BASE_URL=https://api.campaign.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.campaign.com/api/v1
NEXTAUTH_URL=https://app.campaign.com
NEXTAUTH_SECRET=xxx

# Monitoring
SENTRY_DSN=xxx
PROMETHEUS_ENABLED=true

# Feature Flags
ENABLE_RAG=true
ENABLE_N8N_WORKFLOWS=true
```

---

## Health Checks

### Backend Health Endpoint

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 1000 }),
    ]);
  }
}
```

### Kubernetes Probes

```yaml
# k8s/api-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: campaign-api
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: campaign/api:latest
          ports:
            - containerPort: 3000
          
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

---

## Security Checklist

### Production Security

- [ ] HTTPS obrigatório (Let's Encrypt / Cloudflare)
- [ ] CORS configurado com whitelist
- [ ] Rate limiting ativo (100 req/min por IP)
- [ ] Helmet.js habilitado (NestJS)
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection (CSP headers)
- [ ] Secrets em variáveis de ambiente (nunca no código)
- [ ] Docker images vulnerabilidade scan
- [ ] Database backups automatizados
- [ ] Logs centralizados (ELK / CloudWatch)
- [ ] Monitoring ativo (Sentry / Datadog)
- [ ] WAF configurado (Cloudflare)

---

## Custo Estimado (AWS/DigitalOcean)

### Infraestrutura Mínima (até 250 usuários simultâneos)

| Serviço | Spec | Custo/mês (USD) |
|---------|------|-----------------|
| API Servers (2x) | 2 vCPU, 4GB RAM | $48 |
| PostgreSQL | 4 vCPU, 16GB RAM | $80 |
| Redis | 2 vCPU, 4GB RAM | $24 |
| MongoDB | 2 vCPU, 4GB RAM | $24 |
| Load Balancer | - | $12 |
| Backup Storage | 100GB | $10 |
| **Total** | | **~$200/mês** |

### Alternativa Serverless (Vercel + Supabase)

| Serviço | Plan | Custo/mês |
|---------|------|-----------|
| Vercel Pro | Frontend | $20 |
| Supabase Pro | Database | $25 |
| Upstash Redis | Cache | $10 |
| **Total** | | **~$55/mês** |

---

## Próximos Passos

1. ✅ Arquitetura definida
2. ✅ Backend estruturado (NestJS)
3. ✅ Frontend estruturado (Next.js)
4. ✅ Database schemas (PostgreSQL + MongoDB)
5. ✅ Auth flow (Keycloak)
6. ✅ n8n Integration
7. ✅ Development guidelines
8. ✅ Deployment strategy

**Ready to build! 🚀**
