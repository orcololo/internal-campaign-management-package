# Campaign Platform - Backend Project Setup

Backend project has been initialized! Here's what has been created and how to get started.

## What Was Created

### Project Structure
```
campaign-platform-package/
├── apps/
│   └── api/                    # NestJS Backend API
│       ├── src/
│       │   ├── database/       # Database configuration & schemas
│       │   │   ├── schemas/
│       │   │   │   ├── tenant.schema.ts
│       │   │   │   ├── user.schema.ts
│       │   │   │   ├── voter.schema.ts
│       │   │   │   └── index.ts
│       │   │   ├── database.module.ts
│       │   │   └── database.service.ts
│       │   ├── app.controller.ts
│       │   ├── app.service.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── drizzle.config.ts   # Drizzle ORM configuration
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
├── packages/                   # Future shared packages
├── docker-compose.yml          # PostgreSQL container
├── package.json                # Root workspace config
└── pnpm-workspace.yaml         # pnpm workspace definition
```

### Tech Stack Configured
- ✅ **NestJS 10** - Backend framework
- ✅ **Drizzle ORM** - Type-safe database ORM
- ✅ **PostgreSQL 16** - Database (via Docker)
- ✅ **Swagger** - API documentation
- ✅ **Multi-tenant architecture** - Schema-per-tenant pattern
- ✅ **RBAC** - 4 user roles (CANDIDATO, ESTRATEGISTA, LIDERANCA, ESCRITORIO)

### Database Schemas Created
1. **Tenants** (public schema) - Manages campaign organizations
2. **Users** (tenant schemas) - User management with RBAC
3. **Voters** (tenant schemas) - Voter database with geolocation support

## Quick Start

### 1. Install Dependencies

```bash
# Make sure you have pnpm installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Start PostgreSQL Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Verify it's running
docker-compose ps
```

### 3. Configure Environment

```bash
# Navigate to API directory
cd apps/api

# Copy environment template
cp .env.example .env

# Edit .env if needed (defaults should work with Docker setup)
```

### 4. Setup Database Schema

```bash
# Push schema to database (from project root)
pnpm db:push

# Or navigate to apps/api and run
cd apps/api
pnpm db:push
```

### 5. Start Development Server

```bash
# From project root
pnpm dev

# Or from apps/api
cd apps/api
pnpm dev
```

The API will be available at:
- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001

## Useful Commands

### Development
```bash
pnpm dev                 # Start API in development mode
pnpm build              # Build for production
pnpm lint               # Lint code
pnpm test               # Run tests
```

### Database
```bash
pnpm db:generate        # Generate migrations from schema changes
pnpm db:push            # Push schema changes directly to database
pnpm db:migrate         # Run migrations
pnpm db:studio          # Open Drizzle Studio (database GUI)
```

### Docker
```bash
docker-compose up -d           # Start PostgreSQL in background
docker-compose down            # Stop PostgreSQL
docker-compose logs -f         # View PostgreSQL logs
docker-compose exec postgres psql -U postgres -d campaign_platform  # Connect to database
```

## Next Steps

### 1. Test the API
```bash
# Start the server
pnpm dev

# Visit Swagger docs
open http://localhost:3001/api/docs

# Test health endpoint
curl http://localhost:3001
```

### 2. Create Your First Module

You can now start building modules! Based on your documentation, you might want to:

- **Voters Module**: Voter management with geolocation
- **Calendar Module**: Event scheduling
- **Canvassing Module**: Door-to-door campaign tracking
- **Donations Module**: Donation management

### 3. Add Authentication (Future)

The project is ready for Keycloak integration:
- Environment variables are already configured
- User schema includes `keycloakId` field
- RBAC roles are defined

### 4. Use AI Tools to Build Features

As mentioned in your documentation, you can use:

**Claude Code**:
```
"Read .claude/INSTRUCTIONS.md and build the voters module"
```

**GitHub Copilot**: Already configured via `.github/copilot-instructions.md`

## Project Architecture

### Multi-Tenant Pattern
- Each campaign gets its own PostgreSQL schema
- Main `tenants` table tracks all campaigns
- Tenant-specific data (users, voters, etc.) isolated per schema

### RBAC Roles
1. **CANDIDATO** - Full access
2. **ESTRATEGISTA** - Strategic planning
3. **LIDERANCA** - Leadership coordination
4. **ESCRITORIO** - Basic office tasks

### Database Features
- ✅ Soft delete (deletedAt timestamp)
- ✅ Audit fields (createdAt, updatedAt)
- ✅ UUID primary keys
- ✅ Type-safe queries with Drizzle ORM
- ✅ Geolocation support (latitude/longitude)

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use
```bash
# API port (3001) in use
# Edit apps/api/.env and change PORT=3002

# PostgreSQL port (5432) in use
# Edit docker-compose.yml and change port mapping to 5433:5432
# Then update DB_PORT in apps/api/.env to 5433
```

### Dependencies Issues
```bash
# Clear pnpm store and reinstall
pnpm store prune
rm -rf node_modules apps/api/node_modules
pnpm install
```

## Resources

- **NestJS Docs**: https://docs.nestjs.com
- **Drizzle ORM Docs**: https://orm.drizzle.team
- **Your Documentation**: See `/docs` folder for detailed architecture

## Support

For questions about the project architecture, refer to:
- `docs/01-architecture.md` - System architecture
- `docs/02-backend.md` - Backend patterns
- `docs/09-database-drizzle.md` - Database setup
- `apps/api/README.md` - API specific docs

---

**You're ready to start building! 🚀**

The backend foundation is complete. Start by testing the health endpoint, then build your first module using the patterns in the documentation.
