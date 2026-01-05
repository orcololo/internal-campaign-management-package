# GitHub Copilot CLI - Campaign Platform Guide

Quick reference for using GitHub Copilot CLI with this project.

---

## Installation

```bash
# Install GitHub Copilot CLI
gh extension install github/gh-copilot

# Verify installation
gh copilot --version
```

---

## Common Commands

### Explain Code
```bash
# Explain what a file does
gh copilot explain "What does voters.service.ts do?"

# Explain a specific function
gh copilot explain "How does the findNearby method work in voters service?"

# Explain an error
gh copilot explain "Why am I getting 'NotFoundException' in voters service?"
```

### Suggest Commands
```bash
# Generate shell commands
gh copilot suggest "Create a new NestJS module for donations"
gh copilot suggest "Run Drizzle migration"
gh copilot suggest "Start backend and frontend in parallel"
gh copilot suggest "Find all TODO comments in the codebase"
```

---

## Project-Specific Commands

### Backend Development

```bash
# Create new module
gh copilot suggest "Create a NestJS module called donations with service, controller, and DTOs following the voters pattern"

# Database operations
gh copilot suggest "Generate and push Drizzle migration"
gh copilot suggest "Create a backup of PostgreSQL database"

# Testing
gh copilot suggest "Run tests for voters module"
gh copilot suggest "Generate test coverage report"
```

### Frontend Development

```bash
# Create new page
gh copilot suggest "Create a Next.js page for donations list at app/(auth)/donations/page.tsx"

# Component generation
gh copilot suggest "Create a form component for donations with react-hook-form and zod validation"

# Build and deploy
gh copilot suggest "Build frontend for production"
gh copilot suggest "Analyze Next.js bundle size"
```

### Database & Migrations

```bash
# Drizzle operations
gh copilot suggest "Generate Drizzle migration for new schema changes"
gh copilot suggest "Open Drizzle Studio"
gh copilot suggest "Reset database and run all migrations"

# PostgreSQL operations
gh copilot suggest "Connect to PostgreSQL database"
gh copilot suggest "Backup campaign_123 schema"
```

### Docker & Deployment

```bash
# Docker operations
gh copilot suggest "Build and start all Docker containers"
gh copilot suggest "View logs for API container"
gh copilot suggest "Restart PostgreSQL container"

# Deployment
gh copilot suggest "Deploy to production using Docker Compose"
gh copilot suggest "Run database migrations on production"
```

---

## Code Generation Examples

### Generate Backend Module

**Prompt:**
```bash
gh copilot suggest "Create a complete NestJS module for 'events' with:
- events.module.ts
- events.service.ts with CRUD operations using Drizzle
- events.controller.ts with RBAC guards
- DTOs for create, update, and filter
Following the same pattern as voters module"
```

### Generate Frontend Page

**Prompt:**
```bash
gh copilot suggest "Create a Next.js Server Component page for events list at app/(auth)/events/page.tsx with:
- Fetch data from API
- VotersTable-like component
- Link to create new event
Following the voters page pattern"
```

### Generate Database Schema

**Prompt:**
```bash
gh copilot suggest "Create a Drizzle schema for 'donations' table with:
- id, amount, donor_name, cpf, payment_method
- Timestamps (createdAt, updatedAt, deletedAt)
- Index on cpf and createdAt
Following the voters schema pattern"
```

---

## Debugging with Copilot CLI

```bash
# Understand errors
gh copilot explain "Why is my Drizzle query returning undefined?"

# Fix common issues
gh copilot suggest "Fix TypeScript error: 'any' type is not allowed"
gh copilot suggest "Resolve module not found error for @/db/schema"

# Performance issues
gh copilot explain "Why is my voters list query slow?"
gh copilot suggest "Add indexes to improve query performance"
```

---

## Git Operations

```bash
# Commit message suggestions
gh copilot suggest "Generate git commit message for changes in voters module"

# Branch operations
gh copilot suggest "Create a feature branch for donations module"
gh copilot suggest "Rebase current branch on main"

# Code review
gh copilot explain "What changed in the last commit?"
```

---

## Testing Commands

```bash
# Run tests
gh copilot suggest "Run unit tests for voters service"
gh copilot suggest "Run e2e tests for voters endpoints"

# Generate tests
gh copilot suggest "Create unit tests for voters.service.ts"
gh copilot suggest "Create integration tests for voters endpoints"

# Coverage
gh copilot suggest "Generate test coverage report and open in browser"
```

---

## Quick Aliases (Add to .bashrc or .zshrc)

```bash
# Copilot CLI aliases
alias ghc="gh copilot"
alias ghcs="gh copilot suggest"
alias ghce="gh copilot explain"

# Project-specific
alias dev-api="cd apps/api && pnpm dev"
alias dev-web="cd apps/web && pnpm dev"
alias migrate="cd apps/api && pnpm drizzle-kit push:pg"
alias studio="cd apps/api && pnpm drizzle-kit studio"
```

**Usage after aliases:**
```bash
ghcs "Create donations module"
ghce "How does geocoding work in voters service?"
```

---

## Context-Aware Prompts

Copilot CLI reads your current directory and recent files. Be specific:

### ❌ Vague
```bash
ghcs "Add validation"
```

### ✅ Specific
```bash
ghcs "Add email validation to CreateVoterDto in apps/api/src/modules/voters/dto/create-voter.dto.ts"
```

### ❌ Generic
```bash
ghcs "Fix the bug"
```

### ✅ Specific
```bash
ghce "Why is voters.findNearby returning empty array when coordinates are valid?"
```

---

## Project-Specific Patterns

When asking Copilot CLI to generate code, mention the pattern:

```bash
ghcs "Create a calendar module following the voters pattern with:
- Drizzle schema in apps/api/src/db/schema.ts
- NestJS module with service and controller
- DTOs with class-validator
- RBAC guards for routes
- Next.js pages with Server Components
- Form with react-hook-form and zod"
```

---

## Workflow Examples

### Add New Feature (Full Stack)

```bash
# 1. Plan
ghce "What files do I need to create for a donations feature?"

# 2. Backend
ghcs "Create Drizzle schema for donations"
ghcs "Generate migration"
ghcs "Create NestJS donations module with CRUD"

# 3. Frontend
ghcs "Create Next.js page for donations list"
ghcs "Create donation form component with validation"

# 4. Test
ghcs "Create tests for donations service"
ghcs "Run all tests"

# 5. Commit
ghcs "Generate commit message for donations feature"
```

### Debug Issue

```bash
# 1. Understand
ghce "Why is my voters query slow?"

# 2. Investigate
ghcs "Show me how to profile this database query"

# 3. Fix
ghcs "Add indexes to voters table for name and createdAt"

# 4. Verify
ghcs "Run query performance test"
```

### Refactor Code

```bash
# 1. Analyze
ghce "Is there duplicate code in voters and events services?"

# 2. Plan
ghcs "How can I extract common CRUD logic?"

# 3. Implement
ghcs "Create a base service class with common Drizzle operations"

# 4. Migrate
ghcs "Update voters service to extend base service"
```

---

## Tips for Better Results

1. **Be specific about file paths**
   ```bash
   ghcs "Update apps/api/src/modules/voters/voters.service.ts to add geocoding"
   ```

2. **Reference existing patterns**
   ```bash
   ghcs "Create donations module using the same structure as voters module"
   ```

3. **Specify tech stack**
   ```bash
   ghcs "Create a form with react-hook-form, zod validation, and TailwindCSS"
   ```

4. **Include context**
   ```bash
   ghcs "Add RBAC guard that allows only CANDIDATO and ESTRATEGISTA roles"
   ```

5. **Ask for explanations first**
   ```bash
   ghce "How does multi-tenant schema isolation work in this project?"
   ghcs "Create a new campaign schema following the multi-tenant pattern"
   ```

---

## Environment-Specific Commands

### Development
```bash
ghcs "Start development servers for API and web"
ghcs "Seed database with sample voters data"
ghcs "Clear Redis cache"
```

### Testing
```bash
ghcs "Run tests in watch mode"
ghcs "Generate test fixtures for voters"
ghcs "Mock Google Maps API in tests"
```

### Production
```bash
ghcs "Build production Docker images"
ghcs "Run database migrations on production"
ghcs "Check health of all services"
```

---

## Integration with Project Scripts

Reference package.json scripts:

```bash
ghcs "Run the 'dev' script from package.json"
ghcs "Execute 'test:e2e' for voters module"
ghcs "Run 'build' for both API and web"
```

---

## Limitations

GitHub Copilot CLI:
- ✅ Great for: Commands, explanations, suggestions
- ❌ Limited for: Complex multi-file code generation
- 💡 Tip: For complex features, use Claude (see `.claude/` directory)

For complex code generation:
- Use Claude with `.claude/INSTRUCTIONS.md`
- Use GitHub Copilot in VS Code with `.github/copilot-instructions.md`

---

## Quick Reference Card

```bash
# Most common commands for this project

# Explain
ghce "What does this function do?"

# Generate code
ghcs "Create NestJS module for X"

# Database
ghcs "Run Drizzle migration"
ghcs "Open Drizzle Studio"

# Development
ghcs "Start all dev servers"

# Testing
ghcs "Run tests for module X"

# Git
ghcs "Generate commit message"

# Debug
ghce "Why is X not working?"
```

---

Save this file as reference and use `gh copilot` to boost your development speed!
