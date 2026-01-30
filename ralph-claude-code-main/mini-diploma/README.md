# Mini Diploma Documentation

All documentation for the Mini Diploma funnel system.

---

## 📁 Documentation Files

| File | Purpose |
|------|---------|
| [NEW_DIPLOMA_CHECKLIST.md](./NEW_DIPLOMA_CHECKLIST.md) | **START HERE** - Complete automation-ready checklist |
| [MINI_DIPLOMA_MASTER_TEMPLATE.md](./MINI_DIPLOMA_MASTER_TEMPLATE.md) | Marketing/sales page checklist |
| [EMAIL_SEQUENCES.md](./EMAIL_SEQUENCES.md) | Email sequence templates |

---

## 🏗️ Architecture Overview

### Dynamic Portal Route Pattern
All portals use a single dynamic route: `/portal/[slug]`

```
/portal/functional-medicine     → Functional Medicine portal
/portal/christian-coaching      → Christian Coaching portal
/portal/womens-health           → Women's Health portal
...
```

### Auto-Generated Routes
Once added to the registry, these routes are automatically available:

| Route | Description |
|-------|-------------|
| `/portal/[slug]` | Main dashboard |
| `/portal/[slug]/lesson/[id]` | Lesson pages (1-9) |
| `/portal/[slug]/profile` | Student profile |
| `/portal/[slug]/graduates` | Graduate stories |
| `/portal/[slug]/career-roadmap` | Post-completion path |
| `/portal/[slug]/certificate` | Certificate generation |
| `/portal/[slug]/chat` | Coach Sarah chat |

---

## 🧩 Key Source Files

| File | Purpose |
|------|---------|
| `src/lib/mini-diploma-registry.ts` | **Central config** - lessons, slugs, sequences |
| `src/lib/[diploma]-dms.ts` | 60-day Sarah DM sequences |
| `src/lib/[diploma]-nurture-60-day.ts` | 60-day email sequences |
| `src/app/api/mini-diploma/optin/route.ts` | Opt-in API (5 config locations) |
| `src/app/api/auth/get-redirect/route.ts` | Post-login redirect logic |
| `src/components/lead-portal/LeadSidebar.tsx` | Portal navigation |
| `src/components/lead-portal/diploma-configs.ts` | Dashboard UI config |

---

## 📋 Active Diplomas

| Diploma | Portal Slug | Course Slug | Status |
|---------|-------------|-------------|--------|
| Functional Medicine | `functional-medicine` | `functional-medicine-mini-diploma` | ✅ Live |
| Women's Health | `womens-health` | `womens-health-mini-diploma` | ✅ Live |
| Gut Health | `gut-health` | `gut-health-mini-diploma` | ✅ Live |
| Hormone Health | `hormone-health` | `hormone-health-mini-diploma` | ✅ Live |
| Holistic Nutrition | `holistic-nutrition` | `holistic-nutrition-mini-diploma` | ✅ Live |
| Nurse Coach | `nurse-coach` | `nurse-coach-mini-diploma` | ✅ Live |
| Health Coach | `health-coach` | `health-coach-mini-diploma` | ✅ Live |
| Christian Coaching | `christian-coaching` | `christian-coaching-mini-diploma` | ✅ Live |

---

## 📊 Funnel Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  LANDING PAGE (/[slug]-mini-diploma)                            │
│  • Opt-in form (firstName, lastName, email)                     │
│  • Auto-creates lead account                                    │
│  • Auto-login with signIn("credentials")                        │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PORTAL DASHBOARD (/portal/[slug])                              │
│  • 9 lessons (3 modules)                                        │
│  • Progress tracking                                            │
│  • Sarah DMs (60-day sequence)                                  │
│  • Email nurture (60-day sequence)                              │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMPLETION → FINAL EXAM                                        │
│  • Pass threshold (typically 70%)                               │
│  • Certificate generation                                       │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  CAREER ROADMAP (/portal/[slug]/career-roadmap)                 │
│  • Scholarship offer                                            │
│  • Checkout → Board Certification ($297-$997)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ➕ Adding a New Diploma

**See:** [NEW_DIPLOMA_CHECKLIST.md](./NEW_DIPLOMA_CHECKLIST.md)

### Quick Summary:
1. Add lessons to `mini-diploma-registry.ts`
2. Add config entry to registry
3. Add to optin API (5 locations)
4. Add to auth get-redirect
5. Create opt-in landing page
6. Add to next.config.ts
7. Create course in database
8. Create Stripe checkout link
9. Test!

### Estimated Time:
- With custom DMs/emails: 4-8 hours
- With fallback sequences: 2-4 hours

---

## 🎨 Brand Colors

| Diploma | Primary | Accent |
|---------|---------|--------|
| Functional Medicine | `#722f37` (burgundy) | `#d4af37` (gold) |
| Christian Coaching | `#1e3a5f` (navy) | `#d4a574` (gold) |
| Women's Health | `#722f37` (burgundy) | `#d4af37` (gold) |
| Others | Inherit from FM | Inherit from FM |

---

## 🔄 Legacy Route Handling

Old routes like `/functional-medicine-diploma/lesson/3` are automatically redirected to the new pattern via `next.config.ts`.

```typescript
// next.config.ts redirects
{
    source: '/:slug-diploma/:path*',
    destination: '/portal/:slug/:path*',
    permanent: true,
}
```
