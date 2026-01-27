# 🧟 Zombie Profiles - Consolidated Registry

> AccrediPro AI-Generated User Profiles for Social Proof

---

## 📊 Inventory Summary

| Source | Count | Location |
|--------|-------|----------|
| **R2 Avatars** | 1,000 | `https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-*.png` |
| **Local Images** | 325 | `/docs/User_Profile_img/` |
| **DB Profiles** | 328 | `ZombieProfile` table |
| **Graduate Posts Profiles** | 102 | `/prisma/scripts/seed-graduate-posts.ts` |
| **Chat Profiles** | 10 | `/prisma/scripts/seed-zombie-chat.ts` |
| **Chat Templates** | 495 | `/prisma/seeds/zombie-chat-templates.ts` |

---

## 📁 Folder Structure

```
Zombie_Profiles/
├── README.md           # This file
├── avatars/            # Avatar image assets info
├── scripts/            # Generation & management scripts
├── data/               # CSV exports and JSON data
└── docs/               # Documentation
```

---

## 🖼️ Avatar Assets

### R2 Cloud Storage (1,000 images)
- **Bucket:** `accredipro-assets`
- **Path:** `avatars/zombie-{cuid}.png`
- **Public URL:** `https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/`
- **Format:** PNG, AI-generated
- **API Access:** Use credentials in `.env`

### Local Images (325 images)
- **Location:** `/docs/User_Profile_img/`
- **Naming:** `user_{age}_{scene}_{timestamp}.png`
- **Demographics:** Women aged 40-65
- **Scenes:** 109 unique scene types

---

## 🗄️ Database Model

```prisma
model ZombieProfile {
  id              String   @id @default(cuid())
  name            String
  avatar          String?
  location        String?         // US State
  personalityType String          // leader, struggler, questioner, buyer
  progressCurve   Json?           // Day-by-day progress pattern
  backstory       String?         // Short bio
  background      String?         // nurse, mom, teacher, corporate
  incomeLevel     String?         // "$6.2K/mo" for graduates
  tier            Int @default(2) // 1=active, 2=moderate, 3=occasional
  isGraduate      Boolean @default(false)
  isActive        Boolean @default(true)
  createdAt       DateTime @default(now())
}
```

---

## 🎭 Personality Types

| Type | Description | Example Message |
|------|-------------|-----------------|
| **Leader** | Enthusiastic, shares wins | "Just finished module 3! 🎉" |
| **Struggler** | Relatable challenges | "Module 2 was tough but worth it" |
| **Questioner** | Asks good questions | "Has anyone tried the gut protocol?" |
| **Buyer** | Testimonial-ready | "Best investment I've made!" |

---

## 📍 Locations (US States)

Texas, California, Florida, New York, Ohio, Pennsylvania, Illinois, Georgia, North Carolina, Michigan, Arizona, Washington, Colorado, Tennessee, Virginia, Oregon, Minnesota, Wisconsin, Massachusetts, Indiana, South Carolina

---

## 🏥 Background Categories

- `nurse` / `pharmacist` / `therapist` - Healthcare workers
- `mom` / `stay-at-home mom` - Mothers
- `teacher` / `professor` - Educators
- `corporate` / `marketing` / `tech` - Business professionals
- `yoga instructor` / `fitness trainer` - Wellness
- `military spouse` - Military families

---

## 💰 Income Levels (Graduates)

Range: `$4.1K/mo` to `$13.2K/mo`

Most common: `$5K-8K/mo`

---

## 🔧 Related Scripts

| Script | Purpose |
|--------|---------|
| `/prisma/scripts/seed-zombie-chat.ts` | Seed chat profiles |
| `/prisma/scripts/seed-graduate-posts.ts` | Seed 102 graduate profiles |
| `/prisma/seeds/zombie-chat-templates.ts` | 495 chat message templates |
| `/docs/User_Profile_img/generate_user_profiles.py` | Generate new avatar images |
| `/scripts/update-zombie-avatars-r2.ts` | Update R2 avatar URLs |

---

## 📈 Scaling Plan

| Phase | Zombies | Status |
|-------|---------|--------|
| Current | 653 | ✅ Ready |
| Phase 2 | 1,000 | 🔄 In progress (R2 has 1,000 avatars) |
| Phase 3 | 2,500 | ⏳ For multi-niche scaling |

---

## 🔗 Quick Links

- [Original Registry](/docs/ZOMBIE_PROFILES_REGISTRY.md)
- [Pod Scripts](/docs/pod-scripts/)
- [CRO System](/docs/mini-diploma-cro-system/)
- [Zombie Profiles Docs](/docs/zombie-profiles/)

---

## ⚡ Quick Usage

### Get Random Zombie
```typescript
const zombie = await prisma.zombieProfile.findFirst({
  where: { isActive: true },
  orderBy: { createdAt: 'asc' },
  skip: Math.floor(Math.random() * totalZombies)
});
```

### Get Graduate for Channel
```typescript
const graduate = await prisma.zombieProfile.findFirst({
  where: { isActive: true, isGraduate: true }
});
```

### Get by Personality
```typescript
const leader = await prisma.zombieProfile.findFirst({
  where: { isActive: true, personalityType: 'leader' }
});
```
