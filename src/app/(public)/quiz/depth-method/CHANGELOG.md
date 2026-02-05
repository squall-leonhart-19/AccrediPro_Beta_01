# DEPTH Method Quiz - Changelog & Documentation

## Overview
This quiz is the main entry point for the scholarship "Pay What You Can" funnel. Users complete 12 questions, then are directed to a personalized results page where they can chat with Sarah about scholarships.

## Quiz Flow
1. **Intro** - User enters first name
2. **12 Questions** - With persona-specific reactions and testimonials
3. **Opt-in** - Collects email, last name, phone
4. **Reviewing** - Animated "reviewing application" sequence
5. **Qualified** - Shows qualification score, auto-redirects to results page

## Results Pages (5 variations)
- `/results/healthcare` - Healthcare professionals (nurses, PAs, etc.)
- `/results/coach` - Health coaches, trainers
- `/results/corporate` - Corporate career changers
- `/results/mom` - Stay-at-home moms
- `/results/career-change` - Other backgrounds

---

## Changes Made (February 2026)

### Session 1 - Scholarship Funnel Optimization

#### Removed Scary $4,997 Price
- **Problem**: The $4,997 price anchor was scaring people away
- **Solution**: Replaced with "Pay What You Can Afford" messaging
- **Files Changed**:
  - All 5 results pages (healthcare, mom, career-change, corporate, coach)
  - Admin scholarships panel (`scholarships-client.tsx`)
  - Auto-approve API route
  - Recovery email API route
  - FM mini-diploma page

#### Added Hero Scholarship Box
- Added consistent scholarship hero section to ALL results pages
- Includes:
  - "Scholarship Program" badge
  - "Pay What You Can Afford" headline
  - "94% of Applicants Get Approved" badge
  - Trustpilot 4.9 rating inline
  - Hero CTA with trust badges

#### Value Stack Update
- Changed value stack items from prices ($4,997, $2,500, etc.) to "Included" badges
- Removed "$19,979 Total Value" crossed-out price
- Updated styling from line-through gray to gold "Included" badge

#### Quiz Welcome Message (Option B)
- Updated Sarah's welcome message to be clearer about Functional Medicine Practitioner career
- Removed example amounts ($50, $100, $500) from scholarship ask
- Added "I'll call the Institute right now" messaging

#### Audio Welcome Feature
- Created `/api/scholarship/welcome-audio/route.ts` for ElevenLabs TTS
- Sarah's cloned voice welcomes user by name
- Auto-plays 2.5 seconds after first message appears
- Added detailed logging for debugging
- Fixed audio preloading with `canplaythrough` event

#### Chat Improvements
- Added "Sarah is typing..." indicator with animated dots
- Added exit-intent popup warning
- Fixed chat sync - all messages now save to DB for admin
- Made URLs clickable in chat messages
- Added `renderMessageWithLinks()` helper

#### Mobile Chat Fixes
- Changed height to `100dvh` for proper mobile viewport
- Added `pb-[env(safe-area-inset-bottom)]` for iOS safe area
- Set `fontSize: 16px` to prevent iOS auto-zoom on focus
- Added `inputMode` and `autoComplete` attributes
- Added `scrollIntoView` on focus for mobile keyboard

#### Admin Panel Updates
- Removed $4,997 from response templates
- Fixed CSV export (removed file system writes for Vercel)
- Added clickable links in chat view

#### FOMO Elements Added
- "Don't close this page" warning banner
- "X claimed today" counter in sticky bar
- Scholarship success stories (testimonials)

#### Payment Links Config
- Created `/src/config/scholarship-payment-links.ts`
- Pre-configured Fanbasis links for $10-$997 amounts
- Helper functions: `findClosestPaymentLink()`, `getPaymentLink()`, `parseAmountFromMessage()`

---

## Quiz Questions Summary

| # | Pillar | Question |
|---|--------|----------|
| 1 | Your Profile | What best describes you right now? |
| 2 | Your Profile | How much are you currently earning per month from health and wellness work? |
| 3 | Dream Outcome | What's your income goal for the next 12 months? |
| 4 | Experience | Have you worked directly with clients on their health before? |
| 5 | Clinical Readiness | When a client presents with fatigue, brain fog, and weight gain - how confident are you identifying the root cause? |
| 6 | Clinical Readiness | Have you ever wanted to order and interpret functional lab panels for your clients? |
| 7 | Past Investment | Have you invested in health or wellness certifications before? |
| 8 | Gap Analysis | What's the #1 thing missing from your current skill set? |
| 9 | Commitment | Would you watch a 20-minute training video each day if it meant earning $10K+/month within 6 months? |
| 10 | Vision | If you were earning $10K+/month as a certified practitioner 6 months from now - what would that change for you? |
| 11 | Specialization | Which area of functional medicine calls to you the most? |
| 12 | Readiness | If accepted into the ASI DEPTH Method program, how soon could you start? |

---

## Key Files

### Quiz
- `src/app/(public)/quiz/depth-method/page.tsx` - Main quiz component

### Results Pages
- `src/app/(public)/results/healthcare/page.tsx`
- `src/app/(public)/results/mom/page.tsx`
- `src/app/(public)/results/career-change/page.tsx`
- `src/app/(public)/results/corporate/page.tsx`
- `src/app/(public)/results/coach/page.tsx`

### Chat Component
- `src/components/results/scholarship-chat.tsx` - Main scholarship chat widget

### APIs
- `src/app/api/quiz-funnel/route.ts` - Saves quiz submissions
- `src/app/api/chat/sales/route.ts` - Saves chat messages
- `src/app/api/scholarship/welcome-audio/route.ts` - ElevenLabs TTS for Sarah

### Admin
- `src/app/(admin)/admin/scholarships/scholarships-client.tsx` - Admin chat panel

---

## TODO / Future Improvements

- [ ] Add NeverBounce email validation to quiz
- [ ] Implement Retell AI for phone calls (higher CVR)
- [ ] Add comparison table (IIN $6k, FDN $3k, etc.)
- [ ] Create custom checkout page before Fanbasis redirect
- [ ] Track payment completions with webhooks
