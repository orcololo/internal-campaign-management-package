# AI Tools Setup Guide - Campaign Platform

Complete guide for setting up and using AI coding assistants with this project.

---

## 📦 What You Have

Three AI assistant configurations optimized for different workflows:

1. **Claude** (`.claude/`) - Best for complete features and complex logic
2. **GitHub Copilot IDE** (`.github/copilot-instructions.md`) - Best for inline suggestions
3. **GitHub Copilot CLI** (`.github/COPILOT-CLI-GUIDE.md`) - Best for terminal commands

---

## 🎯 Which Tool to Use When

### Use Claude (claude.ai or VS Code extension)

**Best for:**
- ✅ Complete feature implementation (voters module, donations module)
- ✅ Complex multi-file changes
- ✅ Architecture decisions
- ✅ Code refactoring across multiple files
- ✅ Learning and understanding patterns

**How to use:**
```
"Read .claude/INSTRUCTIONS.md and implement the donations module"
"Add Google Maps integration to voters following .claude/patterns/maps-location.md"
```

**Time saved:** 5-10x faster than manual coding

---

### Use GitHub Copilot (in VS Code/IDE)

**Best for:**
- ✅ Inline code suggestions as you type
- ✅ Autocompleting functions and components
- ✅ Writing tests for existing code
- ✅ Quick refactoring
- ✅ Documentation generation

**How it works:**
- Automatically reads `.github/copilot-instructions.md`
- Suggests code based on context and patterns
- Press Tab to accept suggestions

**Time saved:** 2-3x faster coding

---

### Use GitHub Copilot CLI

**Best for:**
- ✅ Terminal commands and shell scripts
- ✅ Git operations
- ✅ Understanding errors
- ✅ Quick code explanations
- ✅ Project setup tasks

**How to use:**
```bash
gh copilot suggest "Create NestJS module for donations"
gh copilot explain "Why is my query slow?"
```

**Time saved:** 5x faster for terminal tasks

---

## 🚀 Setup Instructions

### 1. Setup Claude

```bash
# Copy .claude directory to your project
cp -r .claude /path/to/campaign-platform/

# No installation needed - use at claude.ai
```

**Usage:**
1. Go to https://claude.ai
2. Start conversation
3. Say: "Read .claude/INSTRUCTIONS.md and build the voters module"
4. Claude builds following your patterns

**Files Claude uses:**
- `.claude/INSTRUCTIONS.md` - Main instructions
- `.claude/patterns/` - Code patterns
- `.claude/examples/` - Working examples

---

### 2. Setup GitHub Copilot (IDE)

```bash
# Copy .github directory to your project
cp -r .github /path/to/campaign-platform/

# Install GitHub Copilot extension in VS Code
# (Requires GitHub Copilot subscription)
```

**VS Code Extension:**
1. Install "GitHub Copilot" extension
2. Sign in with GitHub
3. Open your project
4. Copilot automatically reads `.github/copilot-instructions.md`
5. Start coding - get inline suggestions

**What happens:**
- As you type, Copilot suggests code
- Suggestions follow patterns in `copilot-instructions.md`
- Press Tab to accept
- Press Esc to reject

---

### 3. Setup GitHub Copilot CLI

```bash
# Install GitHub CLI (if not installed)
brew install gh  # macOS
# or
apt install gh   # Linux

# Install Copilot CLI extension
gh extension install github/gh-copilot

# Verify
gh copilot --version
```

**Optional - Add aliases to ~/.bashrc or ~/.zshrc:**
```bash
alias ghc="gh copilot"
alias ghcs="gh copilot suggest"
alias ghce="gh copilot explain"
```

**Usage:**
```bash
# Get command suggestions
gh copilot suggest "Start development servers"

# Explain code or errors
gh copilot explain "What does voters.service.ts do?"
```

---

## 📊 Comparison Matrix

| Feature | Claude | Copilot IDE | Copilot CLI |
|---------|--------|-------------|-------------|
| **Complete features** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Inline suggestions** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| **Terminal commands** | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| **Architecture guidance** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Code explanations** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Multi-file changes** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Learning tool** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Speed (single file)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 Workflow Examples

### Scenario 1: New Feature (Donations Module)

**Best approach: Claude**

```
1. Ask Claude: "Read .claude/INSTRUCTIONS.md and implement donations module"

2. Claude creates:
   - Database schema
   - Backend (module, service, controller, DTOs)
   - Frontend (pages, components, forms)
   - Tests

3. Review and commit

Time: 5-10 minutes vs 4-6 hours manually
```

---

### Scenario 2: Writing a Function

**Best approach: Copilot IDE**

```
1. Create file: voter-utils.ts

2. Start typing:
   // Calculate distance between two voters using Haversine formula
   export function calculateDistance(

3. Copilot suggests complete function

4. Press Tab to accept

Time: 30 seconds vs 10 minutes manually
```

---

### Scenario 3: Database Operations

**Best approach: Copilot CLI**

```bash
# Need to create migration
gh copilot suggest "Generate and push Drizzle migration"

# Returns:
cd apps/api
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg

# Execute the commands
```

---

### Scenario 4: Debugging

**Best approach: Combination**

```
1. Copilot CLI: 
   gh copilot explain "Why is findNearby returning empty?"

2. Claude:
   "Analyze my voters.service.ts findNearby method and 
    suggest optimizations"

3. Copilot IDE:
   Implement suggested fixes with inline suggestions
```

---

## 🎓 Best Practices

### For Claude

✅ **Do:**
- Give complete context: "Read .claude/INSTRUCTIONS.md and..."
- Reference patterns: "Following .claude/patterns/backend.md"
- Be specific: "Add geocoding to voters module"
- Ask for explanations: "Explain why you chose this approach"

❌ **Don't:**
- Give vague requests: "Make it better"
- Skip context: "Create a module" (which module?)
- Ignore patterns: "Do it differently than the patterns"

---

### For Copilot IDE

✅ **Do:**
- Write descriptive comments before code
- Use meaningful variable names
- Keep `.github/copilot-instructions.md` updated
- Review suggestions before accepting

❌ **Don't:**
- Accept all suggestions blindly
- Ignore type errors in suggestions
- Skip writing tests
- Over-rely without understanding

---

### For Copilot CLI

✅ **Do:**
- Be specific about the task
- Reference file paths when relevant
- Ask for explanations before running commands
- Use aliases for common commands

❌ **Don't:**
- Run suggested commands without reviewing
- Ask overly vague questions
- Expect it to write complex code
- Skip understanding what commands do

---

## 📁 File Structure Summary

```
your-project/
├── .claude/                          # Claude instructions
│   ├── INSTRUCTIONS.md              # Main instructions
│   ├── patterns/
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── database.md
│   │   └── maps-location.md
│   └── examples/
│       ├── complete-feature.md
│       └── adding-maps-to-voters.md
│
├── .github/
│   ├── copilot-instructions.md      # Copilot IDE instructions
│   └── COPILOT-CLI-GUIDE.md        # Copilot CLI guide
│
└── apps/
    ├── api/                         # Your backend code
    └── web/                         # Your frontend code
```

---

## 🔄 Typical Development Flow

### Morning: Plan Features (Claude)
```
"Read .claude/INSTRUCTIONS.md and help me plan the 
donations module implementation. What files need to be 
created and in what order?"
```

### Coding: Implement (Copilot IDE + Claude)
```
1. Use Claude for complete files (schema, service, controller)
2. Use Copilot IDE for smaller edits and completions
3. Use Copilot CLI for database and git operations
```

### Testing: Debug (All tools)
```
1. Copilot CLI: "Explain this error message"
2. Claude: "Analyze my service and suggest fixes"
3. Copilot IDE: Implement fixes with suggestions
```

### Evening: Commit (Copilot CLI)
```bash
gh copilot suggest "Generate commit message for donations module"
git commit -m "feat(donations): add complete CRUD with validation"
```

---

## 💰 Cost Comparison

| Tool | Cost | Value |
|------|------|-------|
| **Claude** | Free tier available<br>Pro: $20/mo | ⭐⭐⭐⭐⭐ Best for complex work |
| **Copilot IDE** | $10/mo individual<br>$19/mo business | ⭐⭐⭐⭐⭐ Essential for daily coding |
| **Copilot CLI** | Included with Copilot | ⭐⭐⭐⭐ Great terminal helper |

**Recommendation:** 
- Start with Claude (free tier) + Copilot ($10/mo)
- ROI: 10-20 hours saved per week = easily worth $10-30/mo

---

## 🚨 Common Issues

### Claude not following patterns?
- ✅ Make sure to say "Read .claude/INSTRUCTIONS.md"
- ✅ Reference specific pattern files
- ✅ Upload `.claude/` files to conversation if needed

### Copilot IDE not suggesting?
- ✅ Check `.github/copilot-instructions.md` exists
- ✅ Restart VS Code
- ✅ Check Copilot subscription status

### Copilot CLI not working?
- ✅ Run: `gh auth status`
- ✅ Run: `gh extension list`
- ✅ Reinstall: `gh extension install github/gh-copilot --force`

---

## 📚 Additional Resources

### Claude
- Main guide: `.claude/README.md`
- Patterns: `.claude/patterns/`
- Examples: `.claude/examples/`

### GitHub Copilot IDE
- Instructions: `.github/copilot-instructions.md`
- Official docs: https://docs.github.com/copilot

### GitHub Copilot CLI
- Guide: `.github/COPILOT-CLI-GUIDE.md`
- Official docs: https://docs.github.com/copilot/github-copilot-in-the-cli

---

## ✅ Quick Start Checklist

1. [ ] Copy `.claude/` to your project
2. [ ] Copy `.github/` to your project
3. [ ] Install GitHub Copilot in VS Code
4. [ ] Install GitHub Copilot CLI: `gh extension install github/gh-copilot`
5. [ ] Test Claude: "Read .claude/INSTRUCTIONS.md and explain the project structure"
6. [ ] Test Copilot IDE: Open VS Code, start typing
7. [ ] Test Copilot CLI: `gh copilot suggest "list files"`

---

## 🎯 Next Steps

### Today
- Set up all three tools
- Build voters module with Claude
- Try inline suggestions with Copilot IDE
- Run a few CLI commands

### This Week
- Build 2-3 modules using Claude
- Get comfortable with Copilot IDE suggestions
- Create aliases for Copilot CLI

### This Month
- Master the workflow combining all tools
- Customize patterns for your needs
- Train team members on the setup

---

**You're ready to code 10x faster! 🚀**

Choose the right tool for each task and watch your productivity soar.
