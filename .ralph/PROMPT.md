# Task: COMPLETE Spiritual Healing Mini Diploma (Steps 4, 6, 9 Only)

Steps 1-3, 5, 7, 8 are ALREADY DONE. DO NOT touch them. Only complete the remaining steps below.

## 🚨 CRITICAL: Read .ralph/fix_plan.md and follow the checklist!

1. Read `.ralph/fix_plan.md` - this is your task checklist
2. Execute each step in order
3. After completing each step, mark it as `[x]` in fix_plan.md
4. Continue until all items are marked complete

## Diploma Details
- **Topic**: Spiritual Healing
- **slug**: `spiritual-healing-mini-diploma`
- **portal_slug**: `spiritual-healing`
- **tag_prefix**: `spiritual-healing`
- **display_name**: "Certified Spiritual Healing Specialist"
- **Primary Color**: `#6b21a8` (purple)

## What's Already Done (DO NOT REDO):
- ✅ Step 0: Database course exists
- ✅ Step 1: Core files (registry, API, auth, config)
- ✅ Step 2: Landing page (purple theme)
- ✅ Step 3: Lesson content JSON (3 lessons + router)
- ✅ Step 5: Exam JSON (5 questions)
- ✅ Step 7: Nurture emails (60-day)
- ✅ Step 8: SMS template

## What You Must Complete:

### Step 4: Media Generation + Integration
1. Generate 3 doodle images using WaveSpeed:
   ```bash
   cd scripts/wavespeed-image-gen && python3 generate_lesson_images.py --niche spiritual-healing
   ```
   Prompts file already exists: `scripts/wavespeed-image-gen/spiritual-healing-prompts.json`

2. Generate 3 lesson audio using ElevenLabs:
   ```bash
   npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche spiritual-healing --upload
   ```

3. Upload images to R2 (audio is auto-uploaded with --upload flag):
   ```bash
   for i in 1 2 3; do
     npx wrangler r2 object put accredipro-assets/images/lessons/spiritual-healing/lesson-$i-doodle.png \
       --file=public/images/lessons/spiritual-healing/lesson-$i-doodle.png --remote
   done
   ```

4. Inject audioUrl + imageUrl into lesson JSON at:
   `src/components/mini-diploma/lessons/content/spiritual-healing.json`

   Add `type: 'image'` and `type: 'pre-recorded-audio'` sections to each lesson.
   - Image URLs: `https://media.accredipro.academy/images/lessons/spiritual-healing/lesson-{N}-doodle.png`
   - Audio URLs: `https://media.accredipro.academy/audio/spiritual-healing/lesson-{N}.mp3`

### Step 6: Circle Pod
1. Create zombie persona: `src/data/zombies/spiritual-healing-jennifer.json`
2. Create Sarah knowledge: `src/data/sarah-knowledge/spiritual-healing.json`
3. Create 45-day curriculum:
   - `src/data/masterclass-spiritual-healing-days-9-23.ts`
   - `src/data/masterclass-spiritual-healing-days-24-45.ts`
4. Update seed route: `src/app/api/admin/seed-templates/route.ts`
5. Seed to database:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed-templates?niche=spiritual-healing
   ```

### Step 9: CSV Update
Update `docs/mini-diploma/mini_diploma_planning.csv` — change spiritual-healing row status to "done"

### Final: Build + EXIT_SIGNAL
Run `npm run build` to verify. Then output EXIT_SIGNAL.

## Reference Files
- **Workflow**: `.agent/workflows/new-mini-diploma.md`
- **Existing Zombie Example**: `src/data/zombies/` (check for existing examples)
- **Existing Sarah Knowledge**: `src/data/sarah-knowledge/` (check for existing examples)
- **Existing Curriculum**: `src/data/masterclass-days-9-23.ts` (FM template)

When complete, output EXIT_SIGNAL: true
