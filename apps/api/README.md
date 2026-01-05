# Campaign Platform API

Backend API for the Electoral Campaign Management Platform.

## Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Multi-tenant (schema-per-tenant)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 16+

### Installation

```bash
# Install dependencies (from project root)
pnpm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
```

### Database Setup

```bash
# Create database
createdb campaign_platform

# Push schema to database
pnpm db:push

# Or generate migrations
pnpm db:generate
pnpm db:migrate
```

### Running the Application

```bash
# Development mode
pnpm dev

# Production mode
pnpm build
pnpm start:prod
```

The API will be available at:
- API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

## Project Structure

```
src/
├── database/
│   ├── schemas/           # Drizzle ORM schemas
│   │   ├── tenant.schema.ts
│   │   ├── user.schema.ts
│   │   ├── voter.schema.ts
│   │   └── index.ts
│   ├── database.module.ts
│   └── database.service.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Multi-Tenant Architecture

This API uses a schema-per-tenant approach:
- Each campaign gets its own PostgreSQL schema
- The `tenants` table in the public schema tracks all campaigns
- Tenant-specific tables (users, voters, etc.) are created in each tenant schema

## API Documentation

Swagger documentation is automatically generated and available at `/api/docs` when the application is running.

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm lint` - Lint code
- `pnpm test` - Run tests
- `pnpm db:generate` - Generate database migrations
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Development Guidelines

- Follow NestJS conventions and best practices
- Use DTOs for request/response validation
- Implement proper error handling
- Write tests for critical functionality
- Document APIs using Swagger decorators

## RBAC Roles

The platform supports 4 user roles:
- `CANDIDATO` - Candidate (highest privileges)
- `ESTRATEGISTA` - Strategist
- `LIDERANCA` - Leadership
- `ESCRITORIO` - Office staff (basic access)
