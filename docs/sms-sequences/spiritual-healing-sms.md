# Spiritual Healing Mini Diploma - SMS Sequence for GHL

> **Copy these messages into GoHighLevel automation workflows**

---

## PRE-COMPLETION SEQUENCE (Maximize Starts & Completion)

### SMS 1: Welcome (Trigger: Opt-in - Immediate)
```
Hey {{contact.first_name}}! Your Spiritual Healing certification access is ready.

Start Lesson 1 now -> https://learn.accredipro.academy/portal/spiritual-healing

You have 48 hours. Let's do this!
- Sarah
```
**GHL Tag Trigger:** `spiritual-healing-opted-in`

---

### SMS 2: Nudge if No Start (Trigger: 3 hours, no lesson started)
```
{{contact.first_name}}, 53 people just started their Spiritual Healing certification today.

Your spot is waiting -> https://learn.accredipro.academy/portal/spiritual-healing

Don't miss out!
```
**GHL Tag Trigger:** `spiritual-healing-opted-in` AND NOT `spiritual-healing-lesson-complete:1`
**Delay:** 3 hours after SMS 1

---

### SMS 3: First Lesson Complete (Trigger: Completed Lesson 1)
```
Nice work {{contact.first_name}}! Lesson 1 done!

Keep the momentum - Lesson 2 covers soul-level healing foundations -> https://learn.accredipro.academy/portal/spiritual-healing/lesson/2

You're in the top 30% for speed!
```
**GHL Tag Trigger:** `spiritual-healing-lesson-complete:1`

---

### SMS 4: Stalled Mid-Journey (Trigger: 24h no progress, between lesson 2-8)
```
{{contact.first_name}}, you stopped at Lesson {{custom.current_lesson}}.

Pick up where you left off -> https://learn.accredipro.academy/portal/spiritual-healing

You're already {{custom.progress}}% done - don't quit now!
```
**GHL Tag Trigger:** `spiritual-healing-stalled`
**Set via automation:** Check for no new lesson tags in 24h

---

### SMS 5: Almost Done Push (Trigger: Completed Lesson 7, hasn't finished)
```
{{contact.first_name}}! Just 2 lessons left until your Spiritual Healing certificate!

Finish strong -> https://learn.accredipro.academy/portal/spiritual-healing/lesson/8

93% of people who reach Lesson 7 complete. You're SO close!
```
**GHL Tag Trigger:** `spiritual-healing-lesson-complete:7` AND NOT `spiritual-healing-exam-passed`

---

## POST-COMPLETION SEQUENCE (CRO - Convert to Paid)

### SMS 6: Certificate Ready (Trigger: 1 hour after exam passed)
```
{{contact.first_name}}, your Spiritual Healing certificate is ready!

Download it here -> https://learn.accredipro.academy/portal/spiritual-healing/certificate

You earned this! Share it on LinkedIn.
```
**GHL Tag Trigger:** `spiritual-healing-exam-passed`
**Delay:** 1 hour

---

### SMS 7: Upgrade Teaser (Trigger: 4 hours after completion)
```
{{contact.first_name}}, congrats again on your certification!

Ready to go PRO and become a Board Certified Spiritual Healer earning $150-250/session?

For the next 24h, get 70% off -> https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y
```
**Delay:** 4 hours after SMS 6

---

### SMS 8: Social Proof Push (Trigger: 12 hours after completion)
```
{{contact.first_name}}, 3 people from your cohort just upgraded to the full Spiritual Healing Board Certification.

They're already building their client list.

Your 70% discount expires in 12h -> https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y
```
**Delay:** 12 hours after SMS 6

---

### SMS 9: Spiritual Angle Push (Trigger: 18 hours after completion)
```
{{contact.first_name}}, your spiritual gifts are meant to serve others.

Grace went from burned out nurse to thriving healer earning $7K/month.

Your calling is waiting -> https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y
```
**Delay:** 18 hours after SMS 6

---

### SMS 10: Final CRO (Trigger: 23 hours after completion)
```
Last chance {{contact.first_name}}!

Your exclusive 70% discount expires in 1 hour.

$997 -> $297 ends at midnight -> https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

This won't come back.
```
**Delay:** 23 hours after SMS 6

---

## GHL CUSTOM FIELDS NEEDED

| Field Name | Type | Description |
|------------|------|-------------|
| `current_lesson` | Number | Last completed lesson (1-9) |
| `progress` | Number | Percentage complete (lessons/9 * 100) |
| `opted_in_at` | Date | Timestamp of opt-in |

---

## TAG REFERENCE

| Tag | When Applied |
|-----|--------------|
| `spiritual-healing-opted-in` | On opt-in form submission |
| `spiritual-healing-lesson-complete:1` | After completing lesson 1 |
| `spiritual-healing-lesson-complete:X` | After completing lesson X (1-9) |
| `spiritual-healing-stalled` | 24h with no progress (automation) |
| `spiritual-healing-exam-passed` | Passed final exam |
| `spiritual-healing-purchased` | Bought full certification |

---

## URLS TO CONFIGURE

| Purpose | URL |
|---------|-----|
| Portal Home | `https://learn.accredipro.academy/portal/spiritual-healing` |
| Lesson X | `https://learn.accredipro.academy/portal/spiritual-healing/lesson/X` |
| Certificate | `https://learn.accredipro.academy/portal/spiritual-healing/certificate` |
| CRO Checkout | `https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y` |
