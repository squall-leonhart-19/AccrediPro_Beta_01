# AccrediPro Internationalization (i18n) Plan

## Overview

Transform AccrediPro into a global multi-language platform supporting English, Spanish, and German.

**Architecture:** Unified platform with path-prefix routing (`/es/dashboard`, `/de/dashboard`)

---

## Phase 1: Data Foundation (Day 1)

### User Model Updates

```prisma
model User {
  // Add fields
  preferredLanguage  String  @default("en")  // "en", "es", "de"
  country            String?                  // "US", "ES", "DE", "MX"
  timezone           String?                  // "America/New_York"
}
```

### Course Model Updates

```prisma
model Course {
  language  String  @default("en")  // Tag each course
}
```

### Community Model Updates

```prisma
model CommunityChannel {
  language  String  @default("en")  // Filter channels by language
}
```

---

## Phase 2: UI Translation (Days 2-3)

### Install next-intl

```bash
npm install next-intl
```

### File Structure

```
/messages
├── en.json    # Master (200 strings)
├── es.json    # Spanish translation
└── de.json    # German translation

/src/app
├── [locale]           # Dynamic locale segment
│   ├── dashboard
│   ├── courses
│   └── ...
└── middleware.ts      # Language detection
```

### Strings to Extract (~200)

| Area | Count |
|------|-------|
| Navigation | 30 |
| Dashboard | 50 |
| Course Player | 40 |
| Profile/Settings | 30 |
| Community | 20 |
| Chat | 20 |
| Errors/Messages | 10 |

---

## Phase 3: Content Filtering (Day 4)

### Course Catalog

```tsx
const courses = await prisma.course.findMany({
  where: { language: user.preferredLanguage }
})
```

### Community

```tsx
const channels = await prisma.communityChannel.findMany({
  where: { language: user.preferredLanguage }
})
```

### Sarah AI

- Sarah EN → English users
- Sarah ES → Spanish users  
- Sarah DE → German users

---

## Phase 4: Analytics Dashboard (Day 5)

### Admin Metrics

| Metric | Purpose |
|--------|---------|
| Users by language | Market segmentation |
| Users by country | Geographic distribution |
| Revenue by region | Business intelligence |
| Retention by cohort | Product-market fit |

---

## Language Detection Flow

```
First Visit (Guest)
    ↓
Detect browser Accept-Language header
    ↓
Show that language (fallback: English)
    ↓
User registers → Save to preferredLanguage
    ↓
User can change in Settings anytime
```

---

## URL Structure

| Language | URL Example |
|----------|-------------|
| English (default) | `learn.accredipro.academy/dashboard` |
| Spanish | `learn.accredipro.academy/es/dashboard` |
| German | `learn.accredipro.academy/de/dashboard` |

---

## Community Structure Per Language

### English Community
- #wins
- #graduates
- #introduce-yourself
- #functional-medicine
- #womens-health
- #gut-health
- #mental-wellness
- #nutrition
- #autism-spectrum
- #sleep-health
- #pediatric-health
- #chronic-conditions
- #anti-aging
- #business-practice

### Spanish Community (Translated Names)
- #victorias
- #graduados
- #presentate
- #medicina-funcional
- #salud-femenina
- #salud-intestinal
- #bienestar-mental
- #nutricion
- #espectro-autista
- #salud-del-sueno
- #salud-pediatrica
- #condiciones-cronicas
- #anti-envejecimiento
- #practica-profesional

### German Community (Translated Names)
- #erfolge
- #absolventen
- #vorstellung
- #funktionelle-medizin
- #frauengesundheit
- #darmgesundheit
- #mentale-gesundheit
- #ernahrung
- #autismus-spektrum
- #schlafgesundheit
- #kindergesundheit
- #chronische-erkrankungen
- #anti-aging
- #praxisaufbau

---

## What's Shared vs Per-Language

| Component | Shared | Per-Language |
|-----------|--------|--------------|
| User accounts | ✅ | |
| Purchase history | ✅ | |
| UI text (buttons, labels) | | ✅ |
| Course catalog | | ✅ (filtered) |
| Community channels | | ✅ (separate) |
| Sarah AI responses | | ✅ (Sarah ES, DE) |
| Certificates | | ✅ (mapped) |
| Zombie posts | | ✅ (generated in language) |

---

## Exit-Ready Analytics Fields

```typescript
// Track on every signup
{
  preferredLanguage: "es",
  country: "MX",           // From IP geolocation
  signupSource: "facebook_es_ad",
  utmCampaign: "fm_spanish_launch"
}
```

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Data Foundation | 1 day | Schema updates |
| 2. UI Translation | 2 days | next-intl + 3 languages |
| 3. Content Filtering | 1 day | Filtered courses/community |
| 4. Analytics | 1 day | Admin dashboard metrics |
| **Total** | **5 days** | Global platform |

---

## Dependencies

- `next-intl` — i18n library for Next.js
- Anthropic API — For translating strings
- IP Geolocation — For country detection on signup

---

## Status

- [ ] Phase 1: Data Foundation
- [ ] Phase 2: UI Translation
- [ ] Phase 3: Content Filtering
- [ ] Phase 4: Analytics Dashboard
