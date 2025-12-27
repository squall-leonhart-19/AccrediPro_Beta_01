# Launch Steps - Certification Deployment

This folder contains all configuration and scripts needed to launch new certifications.

## Files

| File | Purpose |
|------|---------|
| `certifications.json` | Master config for all 8-pixel certifications |
| `../prisma/seed-certification.ts` | Seeder script to inject courses to DB |

## Quick Launch

### 1. Generate Course Content
```bash
cd tools/course-generator
python turbo_generator.py "Narcissistic Abuse Recovery Coach"
```

### 2. Seed to Database
```bash
npx ts-node prisma/seed-certification.ts narc-recovery-coach
```

### 3. Add Webhook Mapping
Edit `src/app/api/webhooks/clickfunnels/route.ts` and add:
```typescript
"narc-certification": "narc-recovery-coach-certification",
"narc-pro-accelerator": ["narc-pro-advanced-clinical", "narc-pro-master-depth", "narc-pro-practice-path"],
```

### 4. Deploy
```bash
git add .
git commit -m "Add NARC Recovery Coach certification"
git push
```

## Certification Registry

| Slug | Status | Lessons |
|------|--------|---------|
| `narc-recovery-coach` | ✅ Generated | 332 |
| `christian-life-coach` | ⏳ Pending | - |
| `life-coach` | ⏳ Pending | - |
| `grief-loss-coach` | ⏳ Pending | - |
| `energy-healing` | ⏳ Pending | - |
| `conscious-parenting` | ⏳ Pending | - |
| `pet-wellness` | ⏳ Pending | - |
| `lgbtq-life-coach` | ⏳ Pending | - |
