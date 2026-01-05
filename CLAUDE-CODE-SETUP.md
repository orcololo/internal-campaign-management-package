# Claude Code - Complete Setup Guide

## What is This?

**Use Claude (me!) to build your app** by providing custom instructions and patterns. Instead of building everything manually, you describe what you want and I build it following your established patterns.

**Think of it as:** Having an expert developer (me) who knows your entire codebase, follows your conventions, and implements features in minutes.

---

## Setup (3 Steps)

### Step 1: Copy `.claude` to Your Project

```bash
# From this package
cp -r .claude /path/to/campaign-platform/

# Your project should now have:
campaign-platform/
├── .claude/           # ← My instructions
├── apps/
│   ├── api/
│   └── web/
└── package.json
```

### Step 2: Start Coding with Me (Claude)

**Best Way: Use me directly on claude.ai**

1. Go to https://claude.ai (where you are now!)
2. In your conversation, mention `.claude/INSTRUCTIONS.md`
3. Ask me to build features
4. I'll reference `.claude/` patterns automatically

**Alternative: Upload files**
- Upload `.claude/` files to the conversation
- I'll read them and follow the patterns

**Alternative: VS Code with Claude**
- Use Anthropic's VS Code extension
- I'll read `.claude/` from your project automatically

### Step 3: Start Building

**In this conversation (claude.ai):**

```
"Read the instructions in .claude/INSTRUCTIONS.md and implement 
the voters module end-to-end"
```

Or simply:

```
"Implement the voters module following the patterns in .claude/"
"Add CSV import functionality to voters"
"Create a donations tracking module"
```

I'll automatically check `.claude/patterns/` for the right approach!

---

## How It Works

### 1. Claude Reads Your Instructions

When you ask for a feature, Claude:
1. **Reads** `.claude/INSTRUCTIONS.md` (your project context)
2. **Checks** pattern files (backend.md, frontend.md, database.md)
3. **Follows** your established conventions
4. **Implements** the feature using your patterns

### 2. Example: "Implement voters module"

**What Claude does:**

```
1. Checks .claude/examples/complete-feature.md for reference
2. Reads .claude/patterns/database.md for schema pattern
3. Creates database schema in apps/api/src/db/schema.ts
4. Reads .claude/patterns/backend.md for module pattern
5. Creates NestJS module in apps/api/src/modules/voters/
6. Reads .claude/patterns/frontend.md for page pattern
7. Creates Next.js pages in apps/web/app/(auth)/voters/
8. Ensures RBAC, validation, soft delete, type-safety
```

**Result:** Complete, production-ready module in ~5 minutes.

---

## What's in `.claude/`

```
.claude/
├── INSTRUCTIONS.md          # Main instructions Claude reads first
│                           # Contains: tech stack, principles, structure
│
├── patterns/               # Code patterns for different layers
│   ├── backend.md          # NestJS module structure
│   ├── frontend.md         # Next.js page structure
│   └── database.md         # Drizzle schema patterns
│
├── examples/               # Complete working examples
│   └── complete-feature.md # Full voters module implementation
│
└── README.md               # This guide
```

---

## Usage Examples

### Example 1: Complete Feature

**You:**
```
"Implement a calendar module for managing campaign events with CRUD operations"
```

**Claude:**
```
I'll create the calendar module following the established patterns.

1. Database schema (events table)
2. Backend module (NestJS)
3. Frontend pages (list, create, edit)

Starting with the schema in apps/api/src/db/schema.ts...

[Implements complete module with:
- Database: events table with indexes
- Backend: CalendarModule, CalendarService, CalendarController, DTOs
- Frontend: /calendar pages with forms and validation
- RBAC: Proper role restrictions
- Features: Search, filters, soft delete]

Done! You can now:
- Run migrations: cd apps/api && pnpm drizzle-kit push:pg
- Start backend: pnpm dev
- Visit: http://localhost:3000/calendar
```

### Example 2: Add Feature to Existing Module

**You:**
```
"Add CSV import to the voters module"
```

**Claude:**
```
I'll add bulk import functionality to voters:

1. Backend: bulkImport() method in VotersService
2. Backend: POST /voters/import endpoint in controller
3. Frontend: Import button and modal component
4. Validation: CSV format checking

[Implements feature with:
- Service method that handles batch inserts
- Endpoint with proper validation
- UI component for file upload
- Error handling for invalid CSVs]

Done! Users can now import voters via CSV.
```

### Example 3: Optimization

**You:**
```
"The voters list is slow, optimize it"
```

**Claude:**
```
I'll optimize the voters query:

1. Analysis: Missing indexes on search fields
2. Add trgm indexes for full-text search
3. Add pagination limit enforcement
4. Add Redis caching for frequent queries

[Implements optimizations:
- Migration: adds pg_trgm extension and indexes
- Service: updated query with proper indexes
- Cache layer: 5-minute TTL on list queries]

Performance improved:
- Before: 2.5s for 10,000 records
- After: 150ms for same query
```

### Example 4: Multi-Module Feature

**You:**
```
"Add WhatsApp notifications when a new voter is created"
```

**Claude:**
```
This requires coordination across multiple modules:

1. n8n workflow for WhatsApp sending
2. Webhook in voters service to trigger workflow
3. Configuration for n8n integration

[Implements:
- n8n workflow JSON configuration
- VotersService: triggerWorkflow() after create
- Environment variables for n8n URL
- Error handling for failed notifications]

Done! New voters will receive WhatsApp welcome messages.
```

---

## Key Concepts

### 1. Patterns vs. Code

Claude doesn't just copy code - it **understands patterns** and applies them:

**Pattern (from .claude/patterns/backend.md):**
```
Service Pattern:
- Inject Database
- Use Drizzle ORM
- Soft delete with deletedAt
- Proper error handling
```

**Claude applies this to ANY module:**
- VotersService
- CalendarService
- DonationsService
- etc.

### 2. Type Safety

Claude enforces TypeScript throughout:
- No `any` types
- DTOs with validation
- Drizzle type inference
- Zod schemas in frontend

### 3. Best Practices Built-In

Every feature Claude builds includes:
- ✅ RBAC (role-based access control)
- ✅ Validation (backend + frontend)
- ✅ Soft delete (deletedAt field)
- ✅ Pagination
- ✅ Error handling
- ✅ Loading states
- ✅ Type safety

---

## Customizing for Your Needs

### Add New Patterns

Create `.claude/patterns/notifications.md`:

```markdown
# Notification Pattern

When implementing notifications:

1. Use n8n for delivery
2. Store notification log in MongoDB
3. Support multiple channels (WhatsApp, Email, SMS)

## Implementation
[Your pattern details]
```

Then ask Claude:
```
"Implement notifications following the pattern in .claude/patterns/notifications.md"
```

### Modify Existing Patterns

Edit `.claude/patterns/backend.md` to change how modules are structured.

Claude will use the new pattern for all future modules.

### Project-Specific Guidelines

Add to `.claude/INSTRUCTIONS.md`:

```markdown
## Additional Guidelines

- Always log sensitive actions to audit trail
- Use UTC for all timestamps
- Brazilian phone numbers only (format: 11999999999)
```

---

## Tips for Best Results

### Be Specific

✅ **Good:**
```
"Add a donations module with CPF validation, PIX integration, and reporting dashboard"
```

❌ **Bad:**
```
"Add donations"
```

### Reference Patterns

✅ **Good:**
```
"Create a canvassing module following the same structure as voters"
```

❌ **Bad:**
```
"Make a canvassing thing"
```

### Provide Context

✅ **Good:**
```
"Add search to voters. It should search across name, email, and phone. 
Only CANDIDATO and ESTRATEGISTA can use it."
```

❌ **Bad:**
```
"Add search"
```

### Ask for Explanations

✅ **Good:**
```
"Why did you choose this approach for the voters query optimization?"
"What are the trade-offs of using schema-per-tenant?"
```

This helps you learn!

---

## Common Workflows

### 1. New Module From Scratch

```
You: "Create an events module for campaign activities"

Claude: [Creates complete module]

You: "Add ability to mark events as public or private"

Claude: [Adds field + UI toggle]

You: "Only CANDIDATO can create private events"

Claude: [Updates RBAC guards]
```

### 2. Extending Existing Module

```
You: "Add tags to voters for better categorization"

Claude: [Adds tags field, migration, UI component]

You: "Allow filtering voters by tags"

Claude: [Updates service query + UI filters]
```

### 3. Integration

```
You: "When a donation is received, send notification via n8n"

Claude: [Creates workflow + webhook integration]

You: "Also log it to MongoDB for audit trail"

Claude: [Adds MongoDB logging]
```

---

## Troubleshooting

### Claude Not Following Patterns?

**Problem:** Claude generates code that doesn't match your patterns.

**Solutions:**
1. Check `.claude/INSTRUCTIONS.md` exists in project root
2. Be explicit: "Follow the backend pattern in .claude/patterns/backend.md"
3. Provide example: "Similar to how voters module is structured"

### Claude Doesn't Know Project Structure?

**Problem:** Claude asks about file locations.

**Solutions:**
1. Remind: "Check .claude/INSTRUCTIONS.md for project structure"
2. Be explicit: "Put it in apps/api/src/modules/donations/"
3. Show example: "Same location as apps/api/src/modules/voters/"

### Need Different Approach?

**Problem:** Claude's solution doesn't fit your needs.

**Solutions:**
1. Explain constraint: "We need to use Redis for caching, not in-memory"
2. Reference docs: "Follow the caching pattern in .claude/patterns/caching.md"
3. Provide example: "Like how it's done in voters service"

---

## Advanced Usage

### Batch Operations

```
"Implement these 3 modules following the standard pattern:
1. Donations (with CPF validation)
2. Volunteers (with availability scheduling)
3. Materials (with inventory tracking)"
```

Claude will create all three consistently.

### Code Review Mode

```
"Review my implementation of the calendar module.
Check for:
- RBAC compliance
- Type safety
- Soft delete
- Validation
- Error handling"
```

Claude will audit your code against the patterns.

### Refactoring

```
"Refactor the voters service to use Redis caching
for the findAll query. Keep the same API interface."
```

Claude will modernize code while maintaining compatibility.

---

## What Claude Knows

From `.claude/INSTRUCTIONS.md`:

✅ **Tech Stack**: Next.js 14, NestJS, Drizzle, Keycloak, PostgreSQL, n8n  
✅ **Architecture**: Multi-tenant (schema-per-tenant)  
✅ **RBAC**: 4 roles with specific permissions  
✅ **Conventions**: File naming, code style, TypeScript rules  
✅ **Patterns**: Backend, Frontend, Database structures  
✅ **Principles**: YAGNI, KISS, Type-safe  

---

## Real-World Scenarios

### Scenario 1: MVP in 1 Week

**Goal:** Launch voters + calendar + basic analytics

**Approach:**
```
Day 1: "Implement voters module"
Day 2: "Implement calendar module"  
Day 3: "Add analytics dashboard with voter stats"
Day 4: "Add search and filters to all modules"
Day 5: "Deploy with Docker"
```

**Result:** Working MVP with 3 modules, ready to demo.

### Scenario 2: Feature Parity

**Goal:** Match competitor's features

**Approach:**
```
"Add these features to voters:
- Bulk SMS sending (via n8n)
- Voter segmentation by zone
- Export to Excel
- Import from Google Sheets"
```

**Result:** All features implemented following your patterns.

### Scenario 3: Performance Optimization

**Goal:** Handle 100k+ voters

**Approach:**
```
"Optimize voters module for 100k records:
- Add database indexes
- Implement pagination
- Add Redis caching
- Optimize queries"
```

**Result:** Performance improvements with minimal code changes.

---

## Success Metrics

After using Claude Code, you should see:

✅ **Speed**: Features in minutes vs hours  
✅ **Consistency**: All code follows same patterns  
✅ **Quality**: Built-in best practices  
✅ **Type-Safety**: Zero `any` types  
✅ **Documentation**: Claude explains its code  

---

## Next Steps

### Today
1. ✅ Copy `.claude/` to your project
2. ✅ Ask Claude to build voters module
3. ✅ Review generated code
4. ✅ Run and test locally

### This Week
- Build 2-3 more modules with Claude
- Customize patterns as needed
- Deploy first version

### This Month
- Complete MVP
- Add n8n automations
- Launch pilot campaign

---

## You're Ready! 🚀

Everything is set up for rapid, high-quality development with Claude Code.

**Start now:**
```
"Implement the voters module end-to-end following
the patterns in .claude/"
```

---

**Questions?** Check:
- `.claude/README.md` - Usage guide
- `.claude/patterns/` - Specific patterns
- `.claude/examples/` - Working examples
