#!/bin/zsh
cd /Users/pochitino/Desktop/accredipro-lms

# Use the correct Claude Code binary path
CLAUDE_BIN="/Users/pochitino/Library/Application Support/Claude/claude-code/2.1.30/claude"

exec "$CLAUDE_BIN" --dangerously-skip-permissions -p "You are Ralph, the autonomous agent. Your mission is to generate Circle Pod 45-day curriculum for ALL mini diploma niches.

READ THESE FILES FIRST:
1. .ralph/fix_plan.md - Your task checklist
2. .agent/workflows/new-mini-diploma.md - Step 6 specifically (Circle Pod)

TEMPLATE FILES (copy and adapt per niche):
- src/data/masterclass-spiritual-healing-days-1-8.ts
- src/data/masterclass-spiritual-healing-days-9-23.ts  
- src/data/masterclass-spiritual-healing-days-24-45.ts
- src/data/zombies/sh-rachel.json
- src/data/sarah-knowledge/spiritual-healing.json

PROCESS THESE 12 NICHES SEQUENTIALLY:
1. energy-healing
2. reiki-healing
3. adhd-coaching
4. christian-coaching
5. gut-health
6. health-coach
7. holistic-nutrition
8. hormone-health
9. integrative-health
10. life-coaching
11. nurse-coach
12. pet-nutrition

FOR EACH NICHE:
1. Create zombie persona JSON in src/data/zombies/
2. Create Sarah knowledge JSON in src/data/sarah-knowledge/ (check if already exists first!)
3. Create 3 curriculum files: masterclass-{niche}-days-1-8.ts, days-9-23.ts, days-24-45.ts in src/data/
4. Update src/app/api/admin/seed-templates/route.ts to import and route the niche
5. Update fix_plan.md marking items as [x]

IMPORTANT RULES:
- Content must be NICHE-SPECIFIC, not placeholder replacements
- Each zombie needs unique name, backstory, writing style
- Skip image and audio generation
- Run npm run build after every 2-3 niches to verify
- When ALL done, output EXIT_SIGNAL block

START NOW. Read fix_plan.md first."
