/**
 * 30-Day High-CRO Email Sequence: Mini Diploma → $997 Certification
 *
 * Based on buyer research (1,318 real buyers):
 * - 35% Healthcare professionals (nurses, doctors, PAs) - burned out
 * - 37% Working full-time, dreaming of escape
 * - 13% Wellness practitioners wanting credentials
 * - Key motivations: Help people like me, financial relief, work from home freedom
 *
 * Sequence Strategy:
 * - Phase 1 (Days 0-3): Welcome & Connection - NO selling
 * - Phase 2 (Days 5-10): Education + First CTA - Show path, soft sell
 * - Phase 3 (Days 11-20): Desire + Objections - Handle barriers
 * - Phase 4 (Days 21-30): Close - Urgency, scarcity, final push
 */

import prisma from "../src/lib/prisma";

// Email content using inbox-safe subject lines
const NURTURE_EMAILS = [
  // ============================================
  // PHASE 1: WELCOME & CONNECTION (Days 0-3)
  // Goal: Build emotional connection, NO selling
  // ============================================
  {
    order: 1,
    delayDays: 0,
    delayHours: 0,
    subject: "{{firstName}}, your free Mini Diploma is ready",
    previewText: "Start your journey into functional medicine today",
    content: `Hey {{firstName}},

Welcome to AccrediPro! I'm so excited you're here.

Your **Free Mini Diploma in Functional Medicine** is ready and waiting for you inside the platform.

This isn't just another freebie that sits in your downloads folder. This is real training that gives you:

✨ **A taste of root-cause thinking** — how practitioners actually approach health differently

✨ **Your first credential** — a Mini Diploma you can be proud of

✨ **Clarity on your path** — is this right for you? You'll know by the end.

**[Start Your Mini Diploma Now →]{{MINI_DIPLOMA_URL}}**

I'll be here every step of the way. Just reply to this email if you have any questions — I read and respond to every single one.

Let's begin your transformation.

With love,
Sarah 💕

P.S. Check your messages inside the platform — I've left you a personal voice note welcoming you to our community.`,
    ctaType: "SOFT",
    ctaUrl: "{{MINI_DIPLOMA_URL}}",
  },
  {
    order: 2,
    delayDays: 1,
    delayHours: 0,
    subject: "Re: Can I share something personal?",
    previewText: "My story might sound familiar...",
    content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

**Inside, I felt like a fraud.**

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking:

*"There has to be more than this. There has to be a better way."*

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that — **it gave me back my hope.**

Hope that I could truly help my clients. Hope that I could build a career I loved. Hope that I could create a future for my family that didn't depend on burning out or "faking it."

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do. 🌱

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

**So tell me, {{firstName}} … what made you curious about functional medicine?**

Just hit reply — I'd love to hear your story.

With love,
Sarah 💕`,
    ctaType: "SOFT",
    ctaUrl: null,
  },
  {
    order: 3,
    delayDays: 3,
    delayHours: 0,
    subject: "{{firstName}}, this is why generic advice fails",
    previewText: "The real reason your clients aren't getting better",
    content: `{{firstName}},

Have you ever given someone advice you *knew* wasn't really going to help?

"Eat more vegetables."
"Drink more water."
"Try to reduce stress."

We've all said it. And we've all seen the look in their eyes — that polite nod that really means: *"That's not going to fix my problem."*

Here's what nobody tells you:

**Generic advice fails because it treats symptoms, not causes.**

When someone comes to you exhausted, inflamed, anxious, or stuck in a health plateau… telling them to "eat better" is like putting a bandaid on a broken leg.

The real questions are:
- *Why* are they so exhausted?
- *What's* driving the inflammation?
- *Where* is the breakdown actually happening?

This is the difference between surface-level wellness advice and **root-cause practice**.

And it's exactly what you're learning in your Mini Diploma.

**Have you started yours yet?**

If not, today is a perfect day to dive in. Even just the first lesson will shift how you think about health.

**[Continue Your Mini Diploma →]{{MINI_DIPLOMA_URL}}**

Tomorrow, I want to share the discovery that changed everything for me — and for thousands of our students.

Talk soon,
Sarah 💕`,
    ctaType: "SOFT",
    ctaUrl: "{{MINI_DIPLOMA_URL}}",
  },

  // ============================================
  // PHASE 2: EDUCATION + FIRST CTA (Days 5-10)
  // Goal: Show the path, build desire, introduce offer
  // ============================================
  {
    order: 4,
    delayDays: 5,
    delayHours: 0,
    subject: "Update: The discovery that changed everything",
    previewText: "Watch this 45-minute training to see what's possible",
    content: `{{firstName}},

I remember the exact moment everything clicked.

I was deep in my studies, learning about how the gut connects to the brain, how hormones influence mood, how toxins accumulate in ways that standard blood tests miss…

And suddenly I realized: **This is the missing piece.**

Not just for my clients — but for *me*. For my own health journey. For understanding why I'd felt stuck for so long.

That's when I knew: I had to share this with others.

Fast forward to today, and I've helped train thousands of practitioners who now confidently:

✅ Look beyond symptoms to find root causes
✅ Design protocols that actually work
✅ Build thriving practices helping people who've been dismissed by the system

**And I created a training to show you exactly what's possible.**

It's called the **Graduate Training** — a 45-minute session where I walk you through:

• How practitioners like you are building real income doing this work
• The exact certification path that leads to confident, credentialed practice
• What separates those who succeed from those who stay stuck

**[Watch the Graduate Training →]{{GRADUATE_TRAINING_URL}}**

This isn't a pitch — it's a vision of what's ahead. Watch it, and then tell me what you think.

Ready when you are,
Sarah 💕

P.S. If you've finished your Mini Diploma already, this is the perfect next step. If not, no pressure — come back to this when you're ready.`,
    ctaType: "MEDIUM",
    ctaUrl: "{{GRADUATE_TRAINING_URL}}",
  },
  {
    order: 5,
    delayDays: 7,
    delayHours: 0,
    subject: "Re: From burned-out nurse to $8k/month",
    previewText: "Diane's story might inspire you...",
    content: `{{firstName}},

I want you to meet Diane.

She came to us after 40 years as a nurse — accomplished, respected, but *completely burned out*.

Here's what she told me when she first reached out:

*"I love nursing, but I can't do the 5am alarms, the 2-hour commutes, the endless bureaucracy anymore. I want to help people on MY terms."*

Sound familiar?

Diane enrolled in our Functional Medicine Certification. At first, she worried:

"I'm older now — can I really learn something new?"
"Will anyone hire me without a medical degree?"
"Is this actually legitimate?"

Here's what happened:

**Month 1:** She completed her certification, feeling more confident than she had in years.

**Month 3:** She took on her first 3 paying clients — women with hormone issues who'd been dismissed by their doctors.

**Month 6:** She hit **$8,000/month** working from her home office, setting her own hours.

Now she says: *"I finally feel like I'm using everything I know — without sacrificing my health or my life to do it."*

**Diane isn't special.** (Sorry Diane! 😄)

She's a regular person who decided that the second half of her life would be different. Who invested in herself when it felt scary. Who trusted the process.

**And now she's living proof that this path works — at any age.**

Ready to see what's possible for you?

**[See the Full Certification Program →]{{CERTIFICATION_URL}}**

Cheering you on,
Sarah 💕

P.S. If you're a nurse, doctor, PA, or healthcare professional reading this — you're not alone. About 35% of our students come from medical backgrounds. You already have so much knowledge — we just add the missing pieces.`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 6,
    delayDays: 9,
    delayHours: 0,
    subject: "{{firstName}}, here's the roadmap",
    previewText: "See the complete path from where you are to where you want to be",
    content: `{{firstName}},

One of the biggest questions I get is: *"Sarah, how does this actually work? What's the path?"*

So let me show you the complete roadmap — from exactly where you are right now to becoming a confident, certified practitioner earning real income.

**STEP 0: Mini Diploma** (Free — You're here!)
↓
Your first taste of functional medicine. Understand root-cause thinking. Decide if this is right for you.

**STEP 1: Certified Practitioner** ($997)
↓
21 modules of professional training. Learn to work with clients confidently. Earn your certification.
💰 Income potential: $3K–$5K/month

**STEP 2: Practice & Income Path**
↓
Client acquisition systems. Ethical marketing. Build your real practice.
💰 Income potential: $5K–$10K/month

**STEP 3: Advanced & Master**
↓
Complex cases. Premium positioning. Become the go-to expert.
💰 Income potential: $10K–$30K/month

**STEP 4: Business Scaler**
↓
Done-for-you systems. Scale beyond 1:1 work. Build a legacy.
💰 Income potential: $30K–$50K/month+

---

**Most of our students start with Step 1** — the Certified Practitioner program at $997.

It's designed to take you from "I'm curious" to "I'm certified and confident" in a matter of weeks, not years.

**[See Everything Included in Step 1 →]{{CERTIFICATION_URL}}**

This is the investment that changes everything. And I'll be honest — $997 isn't small. But compared to years of traditional schooling or staying stuck where you are… it's the best ROI you'll ever get.

Tomorrow, I'll answer the #1 question everyone asks: "But how do I actually get clients?"

Stay tuned,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },

  // ============================================
  // PHASE 3: DESIRE + OBJECTIONS (Days 11-20)
  // Goal: Handle every objection, build urgency
  // ============================================
  {
    order: 7,
    delayDays: 11,
    delayHours: 0,
    subject: "Re: \"How do I actually get clients?\"",
    previewText: "The #1 question every new practitioner asks",
    content: `{{firstName}},

This is the #1 question I get:

*"Okay Sarah, I believe I could learn this. But how do I actually GET clients? I'm not a marketing expert."*

I get it. The fear of "build it and nobody comes" is real.

Here's the truth:

**You don't need to be a marketing expert. You need a system.**

Inside our certification program, we don't just teach you functional medicine — we teach you how to build a practice that attracts clients *to you*.

Here's what our students are doing:

✅ **The "Signature Talk" Method:** Give one simple 30-minute presentation (online or in-person) and generate 5-10 interested leads every time

✅ **The Referral Engine:** Turn your first happy client into a source of ongoing referrals without ever feeling sleazy

✅ **The Authority Builder:** Use your certification credential to position yourself as the go-to expert in your community

✅ **The No-Ads Approach:** Most of our students never spend a dollar on advertising. They build through relationships, content, and word-of-mouth.

One of our students, Kelly, was terrified of marketing.

She's a nurse practitioner with zero business experience. Within 3 months of certification, she had a waitlist for new clients — just from posting on Instagram about what she was learning and offering free 15-minute consultations.

**You don't need a fancy website. You don't need a million followers. You need a credential, confidence, and a simple system.**

We give you all three.

**[See the Complete Program →]{{CERTIFICATION_URL}}**

Ready to stop worrying about "how" and start building?

With you,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 8,
    delayDays: 13,
    delayHours: 0,
    subject: "Re: From yoga teacher to functional coach",
    previewText: "Vicki's transformation might surprise you",
    content: `{{firstName}},

Meet Vicki.

She wasn't a nurse or a doctor. She was a yoga teacher.

She loved helping people feel better in their bodies — but she kept hitting a wall. Students would come to her with chronic issues that yoga alone couldn't fix: gut problems, hormonal imbalances, unexplained fatigue.

*"I felt like I was only scratching the surface,"* she told me. *"I knew there was more I could offer, but I didn't have the training."*

When Vicki found our program, she was skeptical:

"I don't have a science degree. Can I really understand this?"
"Will clients take me seriously without a medical background?"
"Is this going to be too technical for me?"

Here's what actually happened:

**The training met her where she was.** We don't assume you have a medical degree — we teach from the ground up.

**Her yoga clients became her first functional clients.** The same people who trusted her for movement now trusted her for root-cause health guidance.

**She added $4,200/month to her income** without giving up yoga — just by adding functional coaching as a premium offering.

Now Vicki says: *"I'm finally the practitioner I always knew I could be. My clients get real results, and I feel confident explaining why."*

**You don't need a medical background.** About 25% of our students come from wellness fields — yoga, massage, nutrition, fitness. Your existing skills are a foundation, not a limitation.

**[See If This Path Fits You →]{{CERTIFICATION_URL}}**

Your background is an asset, not a barrier.

Believing in you,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 9,
    delayDays: 15,
    delayHours: 0,
    subject: "{{firstName}}, is this even legit?",
    previewText: "Let's talk about accreditation and credentials",
    content: `{{firstName}},

I know what you might be wondering:

*"Is this actually legitimate? Will people respect this credential? Or is this just another online certificate that means nothing?"*

Fair questions. Let me address them directly.

**Here's what makes AccrediPro different:**

✅ **Comprehensive Curriculum:** Our 21-module program covers everything from biochemistry to client protocols — not surface-level fluff.

✅ **Real Assessment:** You don't just watch videos. You complete case studies, pass assessments, and demonstrate real competency.

✅ **Verifiable Credentials:** Every certificate we issue has a unique verification number. Anyone can verify your credential on our public registry.

✅ **Professional Recognition:** Our graduates are working with clients, building practices, and earning respect in their communities — not hiding their credentials.

✅ **Ongoing Support:** You're not alone after certification. You get access to our community, continuing education, and direct support.

Here's what I believe:

**The credential matters — but what matters more is the transformation.**

After our program, you'll *know* you're qualified. You'll *feel* confident. And that confidence shows up in how you carry yourself, how you speak to clients, and how you build your practice.

Nobody can question your competence when you're getting people real results.

**[See Our Full Curriculum & Credentials →]{{CERTIFICATION_URL}}**

Your future clients are out there, waiting for someone who actually knows how to help them. That someone can be you.

With you,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 10,
    delayDays: 17,
    delayHours: 0,
    subject: "Re: \"I don't have time for this\"",
    previewText: "Let's talk about what's realistic",
    content: `{{firstName}},

I hear this one a lot:

*"Sarah, I'm working full-time / raising kids / already overwhelmed. I don't have time for another certification."*

I understand. More than you know.

When I started my journey, I was a single mom working long hours. "Time" wasn't something I had in abundance.

But here's what I've learned:

**The question isn't "Do I have time?" — it's "What am I making time for?"**

Our certification is designed for busy people:

📚 **Self-paced learning:** Study on your schedule — 5am before the kids wake up, 10pm after work, weekends when you have a moment. No live sessions required.

⏱️ **Realistic commitment:** Most students complete the program in 8-12 weeks, studying 5-7 hours per week. That's less than an hour a day.

📱 **Mobile-friendly:** Watch lessons on your phone during lunch breaks, commutes, or waiting in the pickup line.

🎯 **Progress-tracked:** The platform saves your progress. Start and stop whenever you need.

One student told me: *"I thought I didn't have time. Then I realized I was spending 2 hours a day scrolling Instagram. I traded that for studying and certified in 10 weeks."*

**Time isn't found. It's created.**

And when you're building something that will change your career, your income, and your life — that's worth creating time for.

**[See How the Program Works →]{{CERTIFICATION_URL}}**

You're closer than you think.

Rooting for you,
Sarah 💕`,
    ctaType: "MEDIUM",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 11,
    delayDays: 19,
    delayHours: 0,
    subject: "Update: Let's talk about the $997",
    previewText: "A real conversation about investment and ROI",
    content: `{{firstName}},

Let's have an honest conversation about money.

The Certified Practitioner program is **$997**.

For some people, that feels like a lot. I get it.

But let me share how I think about investments like this:

**The real question isn't "Can I afford this?" — it's "What's the cost of NOT doing this?"**

Let me show you the math:

📊 **Traditional certification programs:** $15,000-$50,000+
📊 **Years of school lost income:** $100,000+
📊 **Staying stuck in your current job:** Priceless frustration

Now compare that to:

💰 **Our program:** $997
💰 **Time to certification:** 8-12 weeks
💰 **Income potential after:** $3,000-$5,000/month (that's $36,000-$60,000/year)

**$997 pays for itself with your first 1-2 clients.**

Most of our students charge $200-$500 per session. At just 2-3 clients per month, you've covered your entire investment — and everything after that is profit.

But here's what matters more than the math:

**What's the cost of staying where you are?**

Another year of burning out?
Another year of feeling unfulfilled?
Another year of wondering "what if?"

I can't put a dollar amount on that.

**We also offer payment plans** — break it into manageable monthly payments if that works better for you.

**[See Pricing & Payment Options →]{{CERTIFICATION_URL}}**

This isn't an expense. It's an investment in a completely different life.

With love,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 12,
    delayDays: 21,
    delayHours: 0,
    subject: "Re: Single mom, 3 kids, now $12k/month",
    previewText: "Maria's story brought me to tears",
    content: `{{firstName}},

I want to tell you about Maria.

When she came to us, she was a single mom with three kids under 10. She was working a soul-crushing corporate job just to keep the lights on.

She told me: *"I cry in my car before work most days. I know I'm meant for something more, but I don't know how to get there."*

Maria had no health background. No business experience. No money saved.

What she had was **desperation to change** and **willingness to try**.

She scraped together the $997 using a payment plan. She studied while her kids slept. She gave up Netflix and gave that time to her future.

Here's what happened:

**Month 2:** Certified. Feeling more confident than she'd felt in years.

**Month 4:** First paying clients — women just like her, stressed moms with mystery symptoms.

**Month 8:** Left her corporate job. Income fully replaced.

**Month 12:** **$12,000/month.** Working from home. Present for her kids. Finally *breathing*.

She sent me this message recently:

*"Sarah, a year ago I was crying in my car. Yesterday, my daughter said 'Mommy, you seem so happy now.' I can't thank you enough."*

I still tear up reading that.

**Maria isn't special.** She's a regular person who decided her circumstances wouldn't define her future.

**If she can do it, so can you.**

**[Start Your Transformation →]{{CERTIFICATION_URL}}**

Your kids are watching. Your future self is waiting. What will you choose?

Believing in you always,
Sarah 💕

P.S. Maria now mentors other moms in our community. The ripple effect of one brave decision is incredible.`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },

  // ============================================
  // PHASE 4: CLOSE (Days 23-30)
  // Goal: Urgency, scarcity, final push
  // ============================================
  {
    order: 13,
    delayDays: 23,
    delayHours: 0,
    subject: "{{firstName}}, two paths ahead",
    previewText: "This is the decision that changes everything",
    content: `{{firstName}},

I want you to imagine two futures:

**Future A: One Year From Now (If Nothing Changes)**

You're still where you are today. Same job, same frustrations, same "someday I'll do something different." The Mini Diploma is collecting dust. The dream of helping people with root-cause medicine is still just a dream.

Not bad, necessarily. But also not the life you imagined.

**Future B: One Year From Now (If You Take Action)**

You're certified. You have clients. Maybe 5, maybe 15. You're earning extra income — maybe $2,000/month, maybe $8,000. You're working on your terms, helping people who actually get results.

You look in the mirror and feel *proud* of what you've built.

---

Here's the thing, {{firstName}}:

**Both futures require the same amount of time to arrive.**

365 days will pass either way.

The only difference is the decision you make *today*.

I'm not going to pressure you. I'm not going to create fake urgency.

But I am going to say this: **The best time to start was yesterday. The second best time is now.**

**[Choose Future B →]{{CERTIFICATION_URL}}**

I'll be here when you're ready.

With love and belief in your potential,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 14,
    delayDays: 25,
    delayHours: 0,
    subject: "Re: Your questions answered",
    previewText: "Everything you're still wondering, addressed",
    content: `{{firstName}},

Before you make your decision, let me answer the questions I hear most often:

**"What if I'm not smart enough?"**
Our program is designed for beginners. We break down complex topics into simple, digestible lessons. If you can watch a YouTube video and take notes, you can do this.

**"What if I fail?"**
You can retake any assessment. There's no time limit. We're here to help you succeed, not weed you out.

**"What if I can't get clients?"**
We teach client acquisition inside the program. Plus, you get lifetime access to our community where practitioners share what's working.

**"What if my family/friends think this is stupid?"**
They might not understand at first. That's okay. When you're earning money and helping people, they'll come around.

**"What if I invest and then life gets crazy?"**
Lifetime access. Come back whenever you can. The material isn't going anywhere.

**"Is there a guarantee?"**
We're so confident you'll love the program that we offer a 30-day money-back guarantee. If it's not right for you, just email us and we'll refund you. No questions asked.

**Still have questions?** Just reply to this email. I personally read and respond.

**Ready to join?**

**[Enroll Now →]{{CERTIFICATION_URL}}**

Nothing is holding you back except the decision itself.

Cheering for you,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 15,
    delayDays: 27,
    delayHours: 0,
    subject: "[IMPORTANT] Enrollment closing Friday",
    previewText: "Last chance to join the current cohort",
    content: `{{firstName}},

I have to be honest with you: **This week is your last chance to join the current enrollment period.**

After Friday at midnight, the doors close and you'll have to wait for the next opening.

I don't do fake scarcity. But I do run the program in cohorts so I can give proper attention to new students. When we're full, we're full.

**Here's what you get when you enroll by Friday:**

✅ Immediate access to all 21 modules
✅ Lifetime access (never expires)
✅ Private community of fellow practitioners
✅ Direct support from our mentor team
✅ Certificate upon completion
✅ 30-day money-back guarantee

**BONUS (This Week Only):**
🎁 Free access to the "Client Attraction Masterclass" ($297 value)
🎁 Priority placement in the graduate network

I want to see you inside, {{firstName}}.

**[Secure Your Spot Before Friday →]{{CERTIFICATION_URL}}**

Don't let this week pass without making a decision.

With urgency and love,
Sarah 💕

P.S. If cost is the barrier, remember we have payment plans available. Don't let that stop you.`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 16,
    delayDays: 28,
    delayHours: 0,
    subject: "Update: Bonus expires in 48 hours",
    previewText: "Your bonuses disappear at midnight Friday",
    content: `{{firstName}},

Quick reminder: **Your special bonuses expire in 48 hours.**

After Friday midnight:
❌ No more free Client Attraction Masterclass ($297 value)
❌ No more priority graduate network placement
❌ Enrollment closes until the next opening

I've already seen people who waited, missed the window, and then had to wait 6+ weeks for the next enrollment.

Don't be that person.

**What's really holding you back?**

If it's fear — that's normal. Everyone who's ever done something meaningful felt fear first.

If it's money — we have payment plans that break $997 into manageable chunks.

If it's time — the program is self-paced. 5-7 hours/week is all you need.

If it's doubt — that's exactly why we have a 30-day money-back guarantee. Zero risk.

**The only thing between you and your new future is a decision.**

**[Enroll Now + Claim Your Bonuses →]{{CERTIFICATION_URL}}**

I believe in you, {{firstName}}. Even if you don't believe in yourself yet.

With love and a little push,
Sarah 💕`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 17,
    delayDays: 29,
    delayHours: 0,
    subject: "{{firstName}}, final call",
    previewText: "This is it — the door closes tomorrow",
    content: `{{firstName}},

Tomorrow at midnight, the door closes.

No more emails. No more reminders. No more "I'll think about it."

Either you're in, or you're waiting for the next opportunity — whenever that is.

I want to leave you with one thought:

**A year from now, you'll wish you had started today.**

I've seen it so many times. The people who wait end up reaching out months later saying, "I should have just done it. I wasted so much time."

You've done the research. You've read the success stories. You've seen what's possible.

Now it's just about trusting yourself enough to take the leap.

**I'll catch you if you fall.** That's what the 30-day guarantee is for.

**[Take the Leap →]{{CERTIFICATION_URL}}**

This is your moment, {{firstName}}.

With all my love and belief,
Sarah 💕

P.S. If you're reading this and you've already decided yes — stop reading and go enroll. Future you will thank you.`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
  {
    order: 18,
    delayDays: 30,
    delayHours: 0,
    subject: "Notice: Door closing tonight",
    previewText: "Last chance — enrollment ends at midnight",
    content: `{{firstName}},

This is it.

**Tonight at midnight, enrollment closes.**

If you've been waiting for a sign, this is it.

If you've been "thinking about it," the time for thinking is over.

If you've been scared, that's okay — do it scared.

**[FINAL CALL: Enroll Before Midnight →]{{CERTIFICATION_URL}}**

I've done everything I can to show you what's possible. The success stories, the roadmap, the support system, the guarantee.

Now the decision is yours.

**Choose yourself, {{firstName}}.** Choose your future. Choose the life you've been imagining.

I'll be waiting to welcome you inside.

With love, hope, and belief in everything you can become,
Sarah 💕

P.S. The next 12 months will pass whether you take action or not. Make them count.

---

*This is the final email in this sequence. If you're not ready now, I understand. I hope our paths cross again when the timing is right. You can always reach me at sarah@accredipro.com.*`,
    ctaType: "HARD",
    ctaUrl: "{{CERTIFICATION_URL}}",
  },
];

async function main() {
  console.log("🚀 Seeding 30-Day Nurture Sequence...\n");

  // First, find or create the sequence
  const sequenceSlug = "mini-diploma-to-certification-30d";

  let sequence = await prisma.sequence.findUnique({
    where: { slug: sequenceSlug },
  });

  if (sequence) {
    console.log("📋 Found existing sequence, updating...");
    // Delete existing emails to replace them
    await prisma.sequenceEmail.deleteMany({
      where: { sequenceId: sequence.id },
    });
  } else {
    console.log("📋 Creating new sequence...");
    sequence = await prisma.sequence.create({
      data: {
        name: "Mini Diploma → Certification (30-Day Nurture)",
        slug: sequenceSlug,
        description: "High-CRO 30-day email sequence converting mini diploma leads to $997 certification buyers. Based on 1,318 real buyer research.",
        triggerType: "MINI_DIPLOMA_STARTED",
        isActive: true,
        isSystem: true,
        priority: 100,
      },
    });
  }

  console.log(`✅ Sequence ID: ${sequence.id}\n`);

  // Create all emails
  console.log("📧 Creating email sequence...\n");

  for (const email of NURTURE_EMAILS) {
    const created = await prisma.sequenceEmail.create({
      data: {
        sequenceId: sequence.id,
        order: email.order,
        delayDays: email.delayDays,
        delayHours: email.delayHours,
        customSubject: email.subject,
        customContent: email.content,
        isActive: true,
      },
    });

    console.log(`  ✅ Email ${email.order}: "${email.subject.substring(0, 50)}..." (Day ${email.delayDays})`);
  }

  console.log(`\n🎉 Created ${NURTURE_EMAILS.length} emails in the sequence!`);
  console.log("\n📊 Sequence Summary:");
  console.log("  • Phase 1 (Days 0-3): Welcome & Connection - 3 emails");
  console.log("  • Phase 2 (Days 5-10): Education + First CTA - 3 emails");
  console.log("  • Phase 3 (Days 11-21): Desire + Objections - 6 emails");
  console.log("  • Phase 4 (Days 23-30): Close - 6 emails");
  console.log("\n✨ Ready to convert!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
