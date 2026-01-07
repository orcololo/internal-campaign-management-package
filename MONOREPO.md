# Monorepo Setup Guide

This project is configured as a pnpm monorepo with multiple workspaces.

## Structure

```
campaign-platform/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Next.js frontend dashboard
├── packages/         # Shared packages (future)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml    # Single lockfile for entire monorepo
└── package.json      # Root package with scripts
```

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

Install pnpm globally:
```bash
npm install -g pnpm
```

## Getting Started

### 1. Install Dependencies

**Always install from the monorepo root:**

```bash
pnpm install
```

This installs all dependencies for all workspace packages with a single lockfile at the root.

### 2. Run Development Servers

**Run API only:**
```bash
pnpm dev
```

**Run Web Dashboard only:**
```bash
pnpm dev:web
```

**Run both concurrently:**
```bash
pnpm dev:all
```

### 3. Build

**Build all packages:**
```bash
pnpm build
```

**Build specific package:**
```bash
pnpm --filter dashboard-4 build    # Web dashboard
pnpm --filter api build             # API
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run API dev server |
| `pnpm dev:web` | Run web dashboard dev server |
| `pnpm dev:all` | Run both API and web concurrently |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Test all packages |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Web Dashboard

The web dashboard is a Next.js 16 application at `apps/web`.

### Features

✅ **Tech Stack:**
- Next.js 16 with App Router
- React 19.2
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui (50+ components)
- Zustand for state management
- react-hook-form + Zod validation
- MapLibre GL for maps
- Recharts for charts

✅ **Implemented:**
- Voters management (list, create, edit, view)
- Advanced table (search, filter, sort, paginate)
- Multi-step forms with validation
- Mock API with 100 test voters
- Hybrid navigation (campaign + maps)

### Running

From root:
```bash
pnpm dev:web
```

From `apps/web`:
```bash
cd apps/web
pnpm dev
```

Access at: **http://localhost:3000**

### Routes

- `/` - Homepage (maps view)
- `/voters` - Voters list
- `/voters/new` - Create voter
- `/voters/[id]` - Voter detail
- `/voters/[id]/edit` - Edit voter

### Progress

**58% Complete (15/26 tasks)**

See `/frontend-impl/TODO.md` for detailed progress.

## Adding Dependencies

### To Web Dashboard

```bash
pnpm add <package> --filter dashboard-4
```

Example:
```bash
pnpm add axios --filter dashboard-4
```

### To API

```bash
pnpm add <package> --filter api
```

### Shared Dev Dependencies (root)

```bash
pnpm add -D <package> -w
```

Example:
```bash
pnpm add -D prettier -w
```

## Configuration Details

### pnpm Workspace

`pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This tells pnpm that `apps/*` and `packages/*` are workspace packages.

### Single Lockfile

- **Root lockfile**: `/pnpm-lock.yaml` (managed)
- **No package lockfiles**: `apps/*/pnpm-lock.yaml` removed
- **Prevents duplication**: `.npmrc` in each package

Configuration in `apps/web/.npmrc`:
```
shared-workspace-lockfile=true
```

### Dependency Hoisting

Dependencies are installed in root `node_modules` and symlinked to package `node_modules`.

Example:
```
/node_modules/.pnpm/react@19.2.3/node_modules/react
↓ (symlink)
/apps/web/node_modules/react
```

## Recent Changes

### Monorepo Setup (January 2026)

1. ✅ Removed duplicate lockfiles from `apps/web`
2. ✅ Created `.npmrc` in `apps/web` to prevent recreation
3. ✅ Updated `next.config.ts` for monorepo compatibility
4. ✅ Added web scripts to root `package.json`
5. ✅ Downgraded Zod from v4 to v3 for compatibility
6. ✅ Configured pnpm workspace properly
7. ✅ Tested build and dev servers

### Issues Fixed

**Zod v4 Incompatibility**
- @hookform/resolvers v5.2.2 requires Zod v3
- Downgraded `zod` from `^4.3.5` to `^3.23.8` (installed v3.25.76)
- All TypeScript errors resolved

**Next.js 16 Params Handling**
- Dynamic route params are now Promises
- Updated `app/(dashboard)/voters/[id]/page.tsx`
- Updated `app/(dashboard)/voters/[id]/edit/page.tsx`

**Resizable Component**
- Temporarily disabled unused component (type definition issues)
- File renamed to `resizable.tsx.disabled`

## Troubleshooting

### "No projects matched the filters"

Make sure you're in the monorepo root:
```bash
cd /path/to/campaign-platform-package
pnpm --filter dashboard-4 dev
```

### Module Not Found

Reinstall dependencies from root:
```bash
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Duplicate Lockfiles

Remove all package-level lockfiles:
```bash
rm apps/*/pnpm-lock.yaml apps/*/package-lock.json
pnpm install
```

### Build Errors

Clean build cache:
```bash
cd apps/web
rm -rf .next
pnpm build
```

## Best Practices

### ✅ DO

- Always run `pnpm install` from root
- Use workspace filters for package-specific commands
- Keep dependencies synchronized across packages
- Use shared dev tools in root package.json

### ❌ DON'T

- Don't create lockfiles in workspace packages
- Don't run `npm install` (use pnpm)
- Don't install different versions of shared dependencies
- Don't work in silos (leverage workspace benefits)

## Testing

### Build Test

```bash
pnpm build
```

Should compile without errors.

### Runtime Test

```bash
pnpm dev:web
curl http://localhost:3000/voters
```

Should return 200 OK.

## Documentation

- **Frontend Implementation**: `/frontend-impl/IMPLEMENTATION_PLAN.md`
- **TODO List**: `/frontend-impl/TODO.md`
- **Architecture**: `/docs/03-frontend.md`
- **Main README**: `/README.md`

## Support

For monorepo-related questions:
1. Check this guide first
2. Review pnpm workspace docs: https://pnpm.io/workspaces
3. Check Next.js monorepo guide: https://nextjs.org/docs/app/building-your-application/configuring/mdx#using-a-monorepo

---

**Status**: ✅ Fully configured and tested
**Last Updated**: January 6, 2026
