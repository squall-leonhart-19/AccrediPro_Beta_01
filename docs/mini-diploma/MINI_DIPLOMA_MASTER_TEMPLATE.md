# Mini Diploma Master Template

Use this template when creating a new Mini Diploma. Copy this file and rename it to `[diploma-name]-checklist.md`.

---

## 📋 Diploma Details

| Field | Value |
|-------|-------|
| **Name** | _e.g., Christian Coaching Mini Diploma_ |
| **Slug** | _e.g., `christian-coaching`_ |
| **Tag** | _e.g., `christian-coaching-mini`_ |
| **Target Audience** | _e.g., Faith-driven women_ |
| **Color Scheme** | Primary: `#______` / Accent: `#______` |
| **Meta Pixel ID** | _________________________ |

---

## 1. PRE-LAUNCH SETUP

- [ ] Tag/segment created in database
- [ ] Meta Pixel configured
- [ ] UTM parameters documented
- [ ] Course slug registered in API

---

## 2. LANDING PAGES

| Page | Route | Status |
|------|-------|--------|
| Main Landing | `/[slug]-mini-diploma` | ⬜ |
| Thank You | `/[slug]-mini-diploma/thank-you` | ⬜ |
| Qualification | `/[slug]-diploma/qualification` | ⬜ |
| Scholarship Offer | `/[slug]-diploma/scholarship` | ⬜ |
| Graduates | `/[slug]-diploma/graduates` | ⬜ |

**Landing Page Sections:**
- [ ] Urgency bar with countdown
- [ ] Hero with value prop
- [ ] Qualification form
- [ ] Sarah/Coach section
- [ ] 3 testimonials with photos
- [ ] Guarantee section
- [ ] Career path section
- [ ] "Your advantage" section
- [ ] Certificate preview
- [ ] "This is for you if" section
- [ ] 9 lessons overview
- [ ] Value stack
- [ ] FAQ section
- [ ] Final CTA
- [ ] Footer

---

## 3. ENROLLMENT

- [ ] API endpoint handles course slug
- [ ] Lead account auto-creation
- [ ] Session storage for user info
- [ ] Auto sign-in after form submit
- [ ] Redirect to qualification page

---

## 4. COURSE CONTENT

| Item | Description | Status |
|------|-------------|--------|
| Course in DB | Course record created | ⬜ |
| Lesson 1 | __________________ | ⬜ |
| Lesson 2 | __________________ | ⬜ |
| Lesson 3 | __________________ | ⬜ |
| Lesson 4 | __________________ | ⬜ |
| Lesson 5 | __________________ | ⬜ |
| Lesson 6 | __________________ | ⬜ |
| Lesson 7 | __________________ | ⬜ |
| Lesson 8 | __________________ | ⬜ |
| Lesson 9 | __________________ | ⬜ |

- [ ] Video content uploaded (if applicable)
- [ ] Progress tracking enabled
- [ ] Lesson completion tracking

---

## 5. EXAM & CERTIFICATION

- [ ] Final exam created
- [ ] Pass threshold set: ____%
- [ ] Certificate template designed
- [ ] Certificate image: `[SLUG]_CERTIFICATE.webp`
- [ ] PDF generation configured
- [ ] Certificate download working

---

## 5B. POST-EXAM SCHOLARSHIP OFFER PAGE

| Page | Route | Status |
|------|-------|--------|
| Scholarship Offer | `/[slug]-diploma/scholarship` | ⬜ |
| Checkout | `/checkout/board-certification` | ⬜ |

**Component:** `src/components/lead-portal/scholarship-offer-page.tsx`

**Page Sections:**
- [ ] Confetti celebration animation
- [ ] Score display + certificate preview
- [ ] "You qualify for scholarship" unlock
- [ ] Value stack ($8,576 → $997)
- [ ] 1-on-1 Mentorship until certified (100% guaranteed)
- [ ] Done-For-You Website
- [ ] DFY Client Acquisition Kit
- [ ] Time-limited bonuses (24h)
- [ ] Countdown timer (48h)
- [ ] Scarcity (X spots remaining)
- [ ] Mini Diploma vs Board Certified comparison table
- [ ] Graduate testimonials with income
- [ ] FAQ section (objection handling)
- [ ] Final CTA with guarantee
- [ ] Exit intent downsell ($497)

**Pricing Options:**
- [ ] Full payment: $997
- [ ] Payment plan: 3x $397
- [ ] Exit offer: $497

---

## 6. EMAIL SEQUENCES

### Nurturing (Pre-Completion)

| Email | Trigger | Subject Line | Status |
|-------|---------|--------------|--------|
| Welcome | Signup | _"Welcome! Start your Mini Diploma"_ | ⬜ |
| Reminder 1 | +4h no start | _"You haven't started yet..."_ | ⬜ |
| Reminder 2 | +12h | _"Only 36 hours left!"_ | ⬜ |
| Reminder 3 | +24h | _"24 hours remaining..."_ | ⬜ |
| Final Warning | +44h | _"4 hours left! ⏰"_ | ⬜ |

### Post-Completion (Scholarship)

| Email | Trigger | Subject Line | Status |
|-------|---------|--------------|--------|
| Congrats + Cert | Completion | _"🎓 You're Certified!"_ | ⬜ |
| Scholarship 1 | +24h | _"Sarah has a scholarship for you"_ | ⬜ |
| Scholarship 2 | +48h | _"Only X spots left..."_ | ⬜ |
| Last Chance | +72h | _"Final call for scholarship"_ | ⬜ |

### Recovery

| Email | Trigger | Subject Line | Status |
|-------|---------|--------------|--------|
| Expired | 48h expired | _"Your access expired, but..."_ | ⬜ |
| Winback | +7 days | _"Ready to try again?"_ | ⬜ |

---

## 7. SMS SEQUENCES

| SMS | Trigger | Message | Status |
|-----|---------|---------|--------|
| Welcome | Signup | _"Welcome! Start now: [link]"_ | ⬜ |
| Reminder | +24h not started | _"Your training expires soon!"_ | ⬜ |
| Completion | Finished | _"🎉 Check email for cert"_ | ⬜ |
| Scholarship | Post-completion | _"Sarah has a scholarship..."_ | ⬜ |

---

## 8. SCHOLARSHIP & UPSELL

- [ ] Scholarship page created
- [ ] Scholarship pricing set: $________
- [ ] Checkout page configured
- [ ] Link to Board Certification
- [ ] Countdown timer (48h/72h)
- [ ] Payment gateway connected

---

## 9. DM NURTURING

- [ ] Chat widget enabled on pages
- [ ] DM automation sequences
- [ ] Objection handling scripts ready
- [ ] High-intent follow-up process

---

## 10. GRADUATES COMMUNITY

- [ ] Graduates page: `/[slug]-diploma/graduates`
- [ ] Graduate stories seeded (50+)
- [ ] Zombie profiles with avatars
- [ ] Sarah M. comments on posts

---

## 11. SUPPORT & RECOVERY

- [ ] Help center articles
- [ ] Password reset flow
- [ ] "Can't log in" email template
- [ ] Support ticket tagging

---

## 🚀 LAUNCH CHECKLIST

Pre-Launch:
- [ ] All pages tested on mobile
- [ ] Form submission working
- [ ] Email sequences activated
- [ ] SMS sequences activated
- [ ] Tracking pixels firing
- [ ] Certificate generation tested

Post-Launch:
- [ ] Monitor conversions
- [ ] Check email deliverability
- [ ] Review drop-off points
- [ ] A/B test headlines

---

## 📊 TRACKING

| Metric | Goal | Actual |
|--------|------|--------|
| Landing → Optin | 40% | ___% |
| Optin → Start | 80% | ___% |
| Start → Complete | 70% | ___% |
| Complete → Scholarship | 20% | ___% |

---

## 📝 NOTES

_Add any diploma-specific notes here._
