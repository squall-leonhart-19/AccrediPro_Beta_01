# Women's Health Mini Diploma — Complete Email Sequence

> Last Updated: January 10, 2026

## Email Systems Overview

WH Mini Diploma uses **TWO email systems**:

1. **MINI_DIPLOMA_EMAILS** (`/api/test-email/route.ts`) — Plain text nudges
2. **sendWHReminder*Email** (`/lib/email.ts`) — Branded HTML reminders

The **lead-engagement cron** handles DMs + nudges (Day 0-6).
The **send-wh-reminder-emails cron** handles branded HTML emails.

---

## Complete Email Sequence

### Day 0: Welcome
**Trigger:** Immediately after optin
**Subject:** `Re: your Women's Health access, {firstName}`

```
{firstName},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

Your FREE Women's Health Mini Diploma is ready - you can start right now.

Here's what you're getting:
- 9 quick lessons (about 6 minutes each)
- Real knowledge about hormones, cycles, and women's health
- Your own certificate when you finish
- 7 days of access

This isn't like other freebies that sit in your downloads folder. This is real training.

Start Lesson 1 now: [LINK]

I also left you a personal voice message inside. Check your Messages when you log in.

Got questions? Just reply to this email.

Sarah
```

---

### Day 1: Not Started Nudge
**Trigger:** Day 1, 0 lessons complete
**Subject:** `Re: quick question, {firstName}`

```
{firstName},

Just checking in - have you had a chance to start your Mini Diploma yet?

I know life gets busy. But here's the thing: Lesson 1 takes just 6 minutes. That's shorter than your morning coffee break.

Once you start, you'll understand why hormones affect EVERYTHING - your energy, mood, weight, sleep, even your skin.

Your access is active for 7 days. Let's not waste it.

Start now: [LINK]

I left you a voice message inside too - give it a listen.

Sarah
```

---

### Day 2: Momentum Nudge
**Trigger:** Day 2, still no lessons
**Subject:** `Re: following up, {firstName}`

```
{firstName},

I noticed you haven't started your lessons yet - is everything okay?

I get it. Starting something new can feel overwhelming. But I want you to know:

2 lessons = just 12 minutes total.

That's it. In 12 minutes, you'll already be ahead of 90% of people who sign up for free courses and never even open them.

You signed up for a reason. That curiosity matters. Don't let it fade.

Start Lesson 1 now: [LINK]

If something's blocking you, just reply and tell me. I'm here to help.

Sarah
```

---

### Day 3: Progress Celebration (if started)
**Trigger:** Day 3, has some progress
**Subject:** `Keep going {firstName}! {remaining} lessons to your certificate`

```
You're doing great, {firstName}!

You've completed {completedLessons} of 9 lessons - that's real progress!

Just {remaining} more lessons to go before you earn your Women's Health certificate.

[Progress bar: {completedLessons}/9]

Keep the momentum going! Each lesson is like a chat with me.

[Continue Learning Button]

You've got this!
Sarah
```

---

### Lesson 3 Complete: Halfway!
**Trigger:** Completes lesson 3
**Subject:** `Re: you're halfway there, {firstName}`

```
{firstName},

You just completed Lesson 3 - you're officially HALFWAY through your Mini Diploma.

I'm so proud of you right now.

Most people who download free courses never even start. But you? You're DOING the work. That tells me something about you.

What you've learned so far:
- The 5 key female hormones
- The 4 menstrual cycle phases
- Signs of hormonal imbalances

And the best stuff is coming up in Lessons 4-6.

Keep going: [LINK]

You've got this.

Sarah
```

---

### Lesson 6 Complete: Almost There
**Trigger:** Completes lesson 6
**Subject:** `Re: only 3 lessons left, {firstName}`

```
{firstName},

Lesson 6 DONE. You're two-thirds through your Mini Diploma.

You now know more about women's health than most people ever will:
- Hormones and cycles
- Gut-hormone connection
- Thyroid function
- Stress and adrenals

Only 3 more lessons until your certificate.

Can you finish today? I think you can.

Go get it: [LINK]

So proud of you,
Sarah
```

---

### Day 4: 3 Days Left
**Trigger:** Day 4, not completed
**Subject:** `Re: 3 days left, {firstName}`

```
{firstName},

Quick heads up - your access to the Women's Health Mini Diploma expires in just 3 days.

You've got {lessonsRemaining} lessons left. Each one is only about 6 minutes - you can totally finish this.

Don't miss out on your certificate.

I know you're busy. But imagine how you'll feel when you've actually FINISHED something. When you have that certificate to show for it.

Start now: [LINK]

I'm here cheering you on,
Sarah
```

---

### Day 5: 48 Hours (Urgency)
**Trigger:** Day 5, not completed
**Subject:** `Re: 48 hours left, {firstName}` / `{firstName}, only 2 days left to complete!`

```
{firstName},

Your access expires in just 48 HOURS.

You've still got {lessonsRemaining} lessons to go. Each one is only 6 minutes.

I really don't want you to miss getting your certificate. You came so far just to stop now?

Finish tonight? I believe in you.

Go now: [LINK]

Sarah
```

---

### Day 6: Final Day
**Trigger:** Day 6, not completed
**Subject:** `FINAL DAY {firstName}! Your access expires tomorrow`

```
{firstName}, this is it. LAST DAY.

Your access expires tomorrow and your certificate is so close.

Just {lessonsRemaining} more lessons. You can do this TODAY.

Each lesson is 6 minutes. That's less time than scrolling your phone.

Your certificate is waiting: [LINK]

Don't let this slip away,
Sarah

PS: If you're already done, ignore this. But if not - GO FINISH.
```

---

### Day 7+: Expired
**Trigger:** Access expired, not completed
**Subject:** `{firstName}, your access has ended`

```
{firstName}, your access has ended

Your 7-day access to the Women's Health Mini Diploma has expired.

I know life gets busy, and sometimes timing just isn't right. But I don't want you to miss out on understanding your hormones and health.

[Options to re-enroll or upgrade]

Sarah
```

---

### ALL COMPLETE! 🎉
**Trigger:** 9/9 lessons completed
**Subject:** `Re: you did it, {firstName}!`

```
{firstName},

YOU DID IT. All 9 lessons COMPLETE.

I am so incredibly proud of you right now.

You now understand:
- The 5 key female hormones
- The 4 menstrual cycle phases
- Hormonal imbalance signs
- The gut-hormone connection
- Thyroid function
- Stress and adrenals
- Nutrition for hormone balance
- Life stage support

This is REAL knowledge that will help REAL women - starting with YOU.

YOUR CERTIFICATE IS COMING!

Within the next 24 hours, you'll receive:
- Your official certificate via email
- Access to it in your portal
- 30 days of continued graduate access

Thank you for learning with me. I can't wait to see what you do with this knowledge.

With so much pride,
Sarah

PS: Want to learn how to turn this knowledge into a $10K/month income? Just reply with "." and I'll send you the roadmap.
```

---

### 24h After Completion: Certificate Ready
**Trigger:** Cron job 24h after `miniDiplomaCompletedAt`
**Subject:** `🎓 Your Certificate is Ready, {firstName}!`

Branded HTML email with:
- Certificate download link
- Certificate number
- Congratulations message
- **$1,000 Graduate Scholarship** to Career Accelerator
- "Reply '.' to get your personalized roadmap" CTA

---

## Post-Completion Nurture (Days 2-15)

**File:** `/lib/wh-nurture-emails.ts`

These emails go to graduates AFTER the 24h certificate email:

### Email 1 - Day 2: The Bigger Picture
**Subject:** `Re: now that you've got your certificate...`

Ask them what they want to DO with the knowledge. Introduce income potential. Reply "." CTA.

### Email 2 - Day 4: Michelle's Story
**Subject:** `Re: she started exactly where you are`

Success story of Michelle: Mini Diploma graduate → $6,400/month in 6 months. Reply "." CTA.

### Email 3 - Day 6: The Income Reality
**Subject:** `Re: the income question`

Real math: $150-$500/session, 4-6 clients/week = $3,200-$9,600/month. Where to find clients (they already know them). Reply "." CTA.

### Email 4 - Day 9: Objection Crusher
**Subject:** `Re: the thing holding you back`

Address objections: time, money, qualifications, fear of failure. 30-day guarantee mention. Reply "." CTA.

### Email 5 - Day 12: Scholarship Deadline
**Subject:** `Re: your $1,000 scholarship`

Scholarship reminder. Normal: $3,997. Graduate: $2,997. Payment plans available. Direct CTA.

### Email 6 - Day 15: Final Soft Touch
**Subject:** `Re: still thinking about it?`

Final email. Two paths visualization (6 months: changed vs same). Reply "ready" CTA.

---

## DM Triggers (Sarah Auto-Messages)

| Trigger | When | Message |
|---------|------|---------|
| `wh_access_expiring` | 2 days before expiry | "Only 2 days left!" |
| `wh_access_expiring` | 1 day before expiry | "This is your last day!" |
| `wh_inactive_reminder` | Inactive 2 days | "Is everything okay?" |
| `wh_inactive_reminder` | Inactive 3 days | "Miss you!" |
| `wh_certificate_ready` | 24h after completion | "Your certificate is ready!" |

---

## Important Notes

1. **FM nurture sequence DISABLED** for WH leads — it was sending FM pricing/offers
2. **Certificate link removed** from completion email — cert comes 24h later
3. **Offer aligned** to $1,000 scholarship (not "20% off")
4. **No fake cohort urgency** — removed "enrollment closes Friday" language
