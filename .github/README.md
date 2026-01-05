# GitHub Copilot Configuration

This directory contains configuration for GitHub Copilot (IDE) and usage guide for Copilot CLI.

---

## 📁 Files

### `copilot-instructions.md`
**What:** Instructions for GitHub Copilot in your IDE (VS Code, etc.)  
**How it works:** Copilot automatically reads this file and uses it for context when suggesting code  
**Setup:** Just install GitHub Copilot extension in VS Code - no manual configuration needed  

### `COPILOT-CLI-GUIDE.md`
**What:** Complete guide for using GitHub Copilot CLI in the terminal  
**How it works:** You run commands like `gh copilot suggest "create module"`  
**Setup:** Install with `gh extension install github/gh-copilot`  

---

## 🚀 Quick Start

### Copilot in IDE (VS Code)

1. **Install extension:**
   - Open VS Code
   - Search for "GitHub Copilot"
   - Install and sign in

2. **Start coding:**
   - Copilot automatically reads `copilot-instructions.md`
   - Type comments or function names
   - Get intelligent suggestions
   - Press Tab to accept

**Example:**
```typescript
// Create a service to find voters near a location
export class VotersService {
  // [Copilot suggests the complete method]
```

---

### Copilot CLI (Terminal)

1. **Install:**
   ```bash
   gh extension install github/gh-copilot
   ```

2. **Use:**
   ```bash
   # Get suggestions
   gh copilot suggest "create NestJS module for donations"
   
   # Explain code
   gh copilot explain "what does voters.service.ts do?"
   ```

3. **Optional aliases:**
   ```bash
   alias ghcs="gh copilot suggest"
   alias ghce="gh copilot explain"
   ```

**Read full guide:** `COPILOT-CLI-GUIDE.md`

---

## 🎯 When to Use Each

### Use Copilot IDE for:
- ✅ Writing code (autocomplete functions, components)
- ✅ Inline refactoring
- ✅ Quick fixes
- ✅ Documentation generation

### Use Copilot CLI for:
- ✅ Terminal commands
- ✅ Git operations  
- ✅ Understanding errors
- ✅ Shell scripts
- ✅ Quick explanations

---

## 📊 How It Works

```
Your IDE reads copilot-instructions.md
     ↓
You start typing code
     ↓
Copilot suggests based on:
  - Your instructions
  - Project patterns
  - Current context
     ↓
You press Tab to accept (or ignore)
```

---

## 🔗 Related

- **Claude**: See `.claude/` directory for complete feature implementation
- **Full guide**: See `AI-TOOLS-SETUP.md` in project root
- **Patterns**: See `.claude/patterns/` for detailed code patterns

---

## 💡 Pro Tips

1. **Write good comments** - Copilot uses them for context
2. **Use descriptive names** - Better suggestions
3. **Keep this file updated** - Add new patterns as you develop
4. **Review suggestions** - Don't accept blindly
5. **Combine with Claude** - Use Claude for complex features, Copilot for details

---

**Ready to code faster! 🚀**

Start VS Code and watch Copilot help you code.
