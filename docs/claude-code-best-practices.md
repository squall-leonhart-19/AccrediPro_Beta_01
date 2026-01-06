# How Boris Cherny (Creator of Claude Code) Actually Uses It

## 13 Practical Moves for Better Results

---

## 1️⃣ Run Multiple Claudes in Parallel
- Run 5+ terminal sessions at once
- Number the tabs for easy tracking
- Use system notifications (iTerm2) so sessions run while you work elsewhere
- **Tip:** Start with 2 sessions - one for "refactor", one for "tests"

---

## 2️⃣ Mix Local and Web Sessions
- Keep several browser sessions alongside local ones (5-10)
- Web UI at `claude.ai/code`
- Start sessions on phone for later
- **Terminal:** when you need tools and git
- **Web:** cleaner view, mobile access

---

## 3️⃣ Pick One Model and Stick With It
- Uses Opus 4.5 with thinking for almost everything
- Slower per request, but less back-and-forth = faster end-to-end
- **Tip:** Commit to one model for a week, measure re-prompting

---

## 4️⃣ Treat CLAUDE.md as Living Team Memory
- Shared `CLAUDE.md` in git
- Update every time Claude gets something wrong
- Short, focused, updated in PRs
- ~2000 tokens covering: commands, code style, UI/content, state management, logging, error handling, debugging, PR template

### Example CLAUDE.md:
```markdown
# Bash commands
- pnpm test --filter <name>: run a focused test
- pnpm lint: run lint before pushing

# Code style
- Prefer early returns over nested ifs
- Use named exports

# Workflow
- Write tests first for non-trivial changes
- Update docs when behaviour changes
```

---

## 5️⃣ Start in Plan Mode, Then Auto-Accept
- Begin in **Plan mode** (Shift+Tab twice)
- Iterate on the plan BEFORE any code changes
- Once plan is solid → switch to **auto-accept edits**
- Plan = safety rail, Auto-accept = accelerator
- **Tip:** Treat "plan quality" as the real work

---

## 6️⃣ Turn Inner-Loop Prompts into Slash Commands
- Any prompt you repeat → slash command
- Reduces friction + lets Claude call the same workflow
- Keep command files in git (team shares them)
- Use inline bash to pre-compute context

### Example Slash Command:
```yaml
---
description: Prep a clean commit and push a PR
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git push:*)
---

# Context
- Status: !`git status -sb`
- Diff: !`git diff --stat`

# Task
Draft a commit message, commit, and push the current branch.
```

---

## 7️⃣ Promote Recurring Roles into Subagents
- Use subagents for repeatable tasks (code simplification, e2e verification)
- Keeps main thread focused
- Each subagent = clear mandate

### Example Subagent:
```yaml
---
name: verify-app
description: Runs the app, checks key flows, reports issues.
tools: Bash, Read
model: inherit
---

Verify the app changes using the project's standard commands.
Report failures with exact error output and reproduction steps.
```

---

## 8️⃣ Use Hooks for Deterministic Last 10%
- **PostToolUse hook** to format code automatically
- Turn "do this most of the time" into "do this every time"
- Avoids CI noise

### Example Hook:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npm run format" }
        ]
      }
    ]
  }
}
```

---

## 9️⃣ Pre-Allow Safe Tools (Don't Default to YOLO)
- Avoid skipping permissions by default
- Pre-allow small set of trusted tools via `/permissions`
- Shared settings in `.claude/settings.json`
- **Tip:** Create a "safe allowlist" and review monthly

---

## 🔟 Plug Claude into Real Systems via MCP
- Connect Claude to Slack, BigQuery, Sentry using MCP
- Share config in `.mcp.json`
- Claude becomes a workflow hub
- **Tip:** Start with ONE system that removes a daily annoyance

---

## 1️⃣1️⃣ Add Background Verification for Long Tasks
- Set Claude to verify work when it finishes
- Use background agents, Stop hooks, or plugins (ralph-wiggum)
- Run with relaxed permission modes in sandbox
- **Tip:** Add a Stop hook that runs smoke test + posts summary

---

## 1️⃣2️⃣ Give Claude a Verification Loop (THE MULTIPLIER)
**Most important tip!**

When Claude can check outputs, quality jumps dramatically:
- Single command (`pnpm test --filter ...`)
- Small test suite
- UI check in browser (Claude Chrome extension)
- "Review pass" by different subagent

---

## 1️⃣3️⃣ Share Team Skills Intentionally
- Use shared skills where it makes sense
- Allow personal tweaks
- **Team-critical** = shared (in git)
- **Personal preference** = local (home directory)

---

## 🚀 Starter Kit (Copy Today)

1. Short `CLAUDE.md` with commands, style, workflow rules
2. One slash command for most common loop
3. One subagent for verification/review
4. One hook that removes CI noise

---

## 📅 One-Week Adoption Plan

| Day | Action |
|-----|--------|
| 1 | Create minimal CLAUDE.md with 2 do/don't rules |
| 2 | Turn one repetitive prompt into slash command |
| 3 | Add verification subagent, run after every change |
| 4 | Add formatting hook |
| 5 | Audit permissions, tighten allowlist |
| 6 | Connect one MCP tool |
| 7 | Review what saved time, remove what didn't |

---

## ⚠️ Common Pitfalls

- **Over-automation too early:** Start with ONE command or hook
- **Skipping verification:** If you can't verify, you're gambling
- **Messy parallelism:** Label sessions, keep tasks independent
- **Bloated memory files:** Keep CLAUDE.md short, review often

---

## 🔗 References

- [Claude Code Docs: Terminal notifications](https://code.claude.com/docs/en/terminal-config#iterm-2-system-notifications)
- [Claude Code Docs: Slash commands](https://code.claude.com/docs/en/slash-commands)
- [Claude Code Docs: Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Docs: Hooks guide](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code Docs: Skills](https://code.claude.com/docs/en/skills)
- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

---

## 🎯 10 Claude Skills That Actually Work

### Development
1. **Superpowers** - `/brainstorm`, `/write-plan`, `/execute-plan` workflow
2. **MCP Builder** - Generates MCP server boilerplate (80% setup reduction)
3. **Webapp Testing** - Playwright automation
4. **Systematic Debugging** - Root cause → hypotheses → fixes → docs

### Productivity
5. **Rube MCP Connector** - Connect to 500+ apps via ONE server
6. **Document Suite** - Word/Excel/PowerPoint/PDF creation with proper formatting

### Creative
7. **Theme Factory** - Brand guidelines → automatic artifact styling
8. **Algorithmic Art** - p5.js generative art from descriptions
9. **Slack GIF Creator** - Custom animated GIFs

### Teams
10. **Brand Guidelines** - Multiple brand management

---

*Source: Boris Cherny's thread + JP's Medium article (Jan 2026)*
