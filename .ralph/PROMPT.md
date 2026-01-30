# Task: Create Pet Nutrition & Wellness Mini Diploma

Create a new mini diploma for **Pet Nutrition & Wellness** using the `/new-mini-diploma` workflow.

## 🚨 CRITICAL: Read .ralph/fix_plan.md and follow the checklist!

1. Read `.ralph/fix_plan.md` - this is your task checklist
2. Execute each step in order
3. After completing each step, mark it as `[x]` in fix_plan.md
4. Continue until all items are marked complete

## Diploma Details
- **Topic**: Pet Nutrition & Wellness
- **slug**: `pet-nutrition-mini-diploma`
- **portal_slug**: `pet-nutrition`
- **tag_prefix**: `pet-nutrition`
- **display_name**: "Certified Pet Nutrition Specialist"
- **Primary Color**: `#047857` (emerald green)
- **Pixel**: BellaPetWellness (1532546858004361)

## Lesson Titles (from spec)
1. Pet Nutrition Foundations
2. Understanding Pet Food Labels
3. Species-Appropriate Diets
4. Common Nutritional Deficiencies
5. Natural Supplements for Pets
6. Weight Management Strategies
7. Life Stage Nutrition
8. Treating Health Issues with Diet
9. Your Next Step

## Template Source
Use `spiritual-healing-mini-diploma/page.tsx` as the exact template - it already has:
- CertificatePreview component (not static image)
- Proper form handling
- All sections (Meet Sarah, FAQ, Guarantee, etc.)

## Reference Files
- **Workflow**: `.agent/workflows/new-mini-diploma.md`
- **Email Templates**: `docs/mini-diploma/EMAIL_SEQUENCES.md`
- **Existing Sequences**: Use HEALTH_COACH fallback for now

## Success Criteria
- All items in .ralph/fix_plan.md marked [x]
- Landing page is 840+ lines (same as Spiritual Healing)
- Build passes (`npm run build`)
- Landing page at `/pet-nutrition-mini-diploma` works
- Portal functional at `/portal/pet-nutrition`

When complete, output EXIT_SIGNAL: true
