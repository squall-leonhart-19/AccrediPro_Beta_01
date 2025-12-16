# Challenges Feature - Reactivation Guide

## Status: TEMPORARILY HIDDEN
**Hidden Date:** December 16, 2024
**Expected Reactivation:** December 21-23, 2024 (5-7 days from hiding)

## Why It Was Hidden
The Challenges feature (7-Day Practitioner Activation Challenge) was temporarily removed because the challenge videos are not yet ready. Videos are expected to arrive in 5-7 days.

## What Was Hidden

### 1. Sidebar Navigation
**File:** `src/components/layout/dashboard-nav.tsx`
```typescript
// Line 46-48 - Uncomment to re-enable:
// { href: "/challenges", label: "Challenges", icon: Flame, tourId: "challenges" },
```

### 2. Roadmap Steps
**File:** `src/app/(dashboard)/roadmap/roadmap-content.tsx`

**Uncomment the ACTIVATION_CHALLENGE constant (lines 100-114):**
```typescript
const ACTIVATION_CHALLENGE = {
    step: 0.75,
    id: "activation-challenge",
    title: "Practitioner Activation Challenge",
    subtitle: "7 Days • Graduate Gift",
    description: "Experience what this path actually feels like — short daily videos, reflections, and guidance.",
    incomeVision: "Confidence",
    color: "amber",
    slug: "/challenges",
    isGift: true,
    mindset: "I can see myself doing this.",
};
```

**Update the allSteps array (line 395):**
```typescript
// Change from:
const allSteps = [MINI_DIPLOMA, GRADUATE_TRAINING, ...steps];

// Change to:
const allSteps = [MINI_DIPLOMA, GRADUATE_TRAINING, ACTIVATION_CHALLENGE, ...steps];
```

### 3. Interactive Tour
**File:** `src/components/ui/interactive-tour.tsx`
```typescript
// Lines 83-95 - Uncomment to re-enable:
{
    id: "challenges",
    title: "7-Day Challenge",
    description: "Start your journey with our FREE 7-day activation challenge! It's the perfect way to experience the platform and kickstart your learning.",
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    emoji: "🔥",
    targetSelector: "[data-tour='challenges']",
    position: "bottom-right",
    action: "click",
    actionText: "Click Challenges",
},
```

## Reactivation Checklist

When videos are ready, follow these steps:

- [ ] Uncomment sidebar nav item in `dashboard-nav.tsx`
- [ ] Uncomment ACTIVATION_CHALLENGE constant in `roadmap-content.tsx`
- [ ] Add ACTIVATION_CHALLENGE back to allSteps array in `roadmap-content.tsx`
- [ ] Uncomment tour step in `interactive-tour.tsx`
- [ ] Upload challenge videos to the platform
- [ ] Test the challenges feature end-to-end
- [ ] Delete this reminder file (optional)

## Pages That Still Exist (Not Removed)
- `/challenges` page - still exists but not linked
- `/challenges/[slug]` - challenge detail pages still exist
- `/api/challenges` - API endpoints still work
- Challenge database tables - still in place

The feature is fully functional, just not discoverable from the UI.

## Contact
If you have questions about reactivating this feature, check the code comments marked:
```
// TEMPORARILY HIDDEN - Re-enable when videos arrive
// See: /docs/CHALLENGES_REACTIVATION.md
```
