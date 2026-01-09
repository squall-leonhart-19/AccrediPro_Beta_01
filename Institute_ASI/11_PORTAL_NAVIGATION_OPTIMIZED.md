# AccrediPro Portal Navigation - Optimized Structure v2

> **Board Decision:** January 2026  
> **Previous:** 17 sidebar sections → **New:** 7 sections (60% reduction)

---

## Final Navigation Structure

```
┌────────────────────────────────────────┐
│  📊 Dashboard                          │
│  🎯 My Learning                        │
│  💬 Coach Sarah                        │
│  👥 My Circle                          │
│  🏆 My Certifications                  │
│  🚀 Practice & Earn           🔒       │
│  ⚙️ Settings                           │
├────────────────────────────────────────┤
│  🩺 Coach Panel (role-based)           │  ← ADMIN/INSTRUCTOR/MENTOR only
└────────────────────────────────────────┘
```

---

## 1. 📊 Dashboard
*"The Command Center"*

| Widget | Purpose |
|--------|---------|
| Coach Sarah Card | *"Hey [Name]! You left off at Module 3..."* + [Continue] CTA |
| Progress Ring | Visual: "65% to FM-FC™" |
| My Circle Activity | 3 recent cohort posts (social proof) |
| Quick Actions | [Resume Learning] [Talk to Sarah] [View Circle] |
| Streak Counter | 🔥 5-day streak (gamification) |

**❌ NO upgrade prompts on Dashboard** — This is motivation, not sales.

---

## 2. 🎯 My Learning
*"The Workshop"*

### Tabs:
- **My Courses** — Active certifications with progress
- **Catalog** — Browse additional certifications
- **Resources** — Downloads for current cert

### Contents:
| Element | Details |
|---------|---------|
| Active Certification Card | FM-FC™ with progress bar, current module |
| Curriculum View | Expandable modules → lessons with ✅ checkmarks |
| Exam Section | Locked until 100% lessons, then prominent CTA |
| Resources | Downloads, PDFs, worksheets |
| Upgrade Banner | *"Ready for CP™? Unlock advanced training"* ← **Upsell lives HERE** |

---

## 3. 💬 Coach Sarah
*"The Relationship"* (formerly "Private Mentor Chat")

| Feature | Purpose |
|---------|---------|
| Chat Interface | Full conversation history with Sarah |
| Quick Topics | [Study Plan] [Exam Prep] [I'm Stuck] [Motivation] |
| Personalized Insights | Sarah references progress: *"You crushed Module 2!"* |
| 24/7 Badge | Reassurance: *"I'm always here"* |
| Daily Standup | Sarah asks: *"What's your goal today?"* |

**This is THE differentiator.** Sidebar label = "Coach Sarah" (warm, branded).

---

## 4. 👥 My Circle
*"The Tribe"*

| Tab | Contents |
|-----|----------|
| Feed | Cohort posts, wins, questions |
| Members | Spring 2026 classmates (50 people) |
| Leaderboard | Progress rankings (friendly competition) |
| Study Groups | Zoom sessions, accountability partners |
| Announcements | Cohort-wide updates |

**Post-graduation:** Alumni Circle access (BC-™ members only)

---

## 5. 🏆 My Certifications
*"The Trophy Room"*

| Element | Details |
|---------|---------|
| Earned Credentials | Visual badge cards with issued date |
| Download Certificate | PDF + high-res image |
| Share to LinkedIn | One-click badge share |
| Verify Link | Public URL: `verify.accredipro.institute/[ID]` |
| CE Credits Tracker | 6/12 credits, renewal date |
| Next Level Teaser | *"You have FM-FC™ → Unlock FM-CP™"* |

**This is the CELEBRATION zone.** Make it feel like a trophy case.

---

## 6. 🚀 Practice & Earn
*"The AccrediPro Practice Suite"* (formerly Career Services + Client Program Library)

### Tabs:
| Tab | Contents |
|-----|----------|
| **Career Center** | Directory profile, job board, networking |
| **Client Programs** | Protocol templates, program builders (merged from Client Program Library) |
| **Practice Toolkit** | Client intake forms, resources, templates |
| **Done-For-You** | Website ($997), Branding ($497) — upsells |

### What's Merged Here:
| Old Sidebar Item | New Location |
|------------------|--------------|
| Career Center | Practice & Earn → Career Center tab |
| Client Program Library | Practice & Earn → Client Programs tab |
| Programs (DFY) | Practice & Earn → Done-For-You tab |

### 🔒 Progressive Disclosure:
- **LOCKED** until 50% certification complete
- Teaser: *"Complete 50% to unlock practice tools"*
- Full access after certification

---

## 7. ⚙️ Settings
*"The Utility Closet"*

| Section | Contents |
|---------|----------|
| Profile | Name, photo, email, bio |
| Notifications | Email preferences, in-app alerts |
| Billing | Payment methods, invoices |
| Security | Password, 2FA |
| Help & Support | FAQ, contact, tickets |

---

## 8. 🩺 Coach Panel (Role-Based)
*For ADMIN, INSTRUCTOR, MENTOR roles only*

| Section | Contents |
|---------|----------|
| Coach Workspace | Student progress, messaging dashboard |
| Student Management | Cohort views, progress tracking |
| Pod Analytics | Engagement metrics |
| Pod Messages | Broadcast messaging |

**Visibility:** Only appears for users with coach/admin roles.

---

## Key Design Principles

### 1. Progressive Disclosure (Bezos)
| User Stage | Visible Sections |
|------------|------------------|
| Week 1 | Dashboard, My Learning, Coach Sarah, My Circle, Settings |
| 50%+ Complete | + Practice & Earn unlocks |
| Certified | + My Certifications populated |

### 2. Naming Warmth
| Old Label | New Label | Why |
|-----------|-----------|-----|
| Private Mentor Chat | Coach Sarah | Personal, branded |
| Community | My Circle | Intimate, tribe-feel |
| Certificates | My Certifications | Ownership |
| Career Services | Practice & Earn | Outcome-focused |

### 3. Upsell Placement
- **❌ Dashboard** — Never. This is motivation.
- **✅ My Learning** — Yes. Intent is highest here.
- **✅ My Certifications** — "Next Level" teaser.
- **✅ Practice & Earn** — DFY services upsell.

### 4. AI-Driven Discovery
Coach Sarah proactively suggests:
- New certifications when 80%+ complete
- Practice & Earn when certified
- Study groups when stuck

---

## Comparison: Before vs After

| Metric | Before | After |
|--------|--------|-------|
| Sidebar Items | 17 | 7 (+1 role-based) |
| Cognitive Load | High | Low |
| User Confusion | Frequent | Minimal |
| Path to Core Action | Unclear | Direct |

### Items Consolidated:
| Old Items | New Location |
|-----------|--------------|
| My Courses + Start Here + Roadmap | **My Learning** |
| Ebooks + My Library + Professional Library | **My Learning → Catalog** |
| Career Center + Client Program Library + Programs | **Practice & Earn** |
| Coach Practice + Coach Workspace | **Coach Panel** (role-based) |
| Profile + Billing + Help | **Settings** |
| Messages | **Coach Sarah** (renamed) |
| Community | **My Circle** (renamed) |

---

## Implementation Mapping

| Old Route | New Location | Action |
|-----------|--------------|--------|
| `/dashboard` | Dashboard | Keep |
| `/my-courses` | My Learning → My Courses | Merge |
| `/start-here` | My Learning → My Courses | Merge |
| `/catalog` | My Learning → Catalog | Tab |
| `/my-personal-roadmap-by-coach-sarah` | My Learning | Integrate |
| `/messages` | Coach Sarah | Rename |
| `/community` | My Circle | Rename |
| `/my-circle` | My Circle | Keep (primary) |
| `/certificates` | My Certifications | Keep |
| `/career-center` | Practice & Earn → Career | Tab |
| `/programs` | Practice & Earn → Client Programs | Tab |
| `/ebooks` | My Learning → Catalog | Merge |
| `/my-library` | My Learning → Resources | Merge |
| `/profile` | Settings → Profile | Tab |
| `/help` | Settings → Help & Support | Tab |
| `/coach/workspace` | Coach Panel | Role-based |

---

## Target Audience
**35+ US Women** pursuing career transformation through professional certification.

---

*Document updated: January 8, 2026*  
*Board: Zuckerberg (Scale), Bezos (Customer), Musk (First Principles), Altman (AI)*
