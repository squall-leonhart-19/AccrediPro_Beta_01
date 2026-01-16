/**
 * FM Mini Diploma NURTURE Sequence v4.0
 *
 * For users who START but haven't COMPLETED the mini diploma
 *
 * Trigger: lead:fm-healthcare-mini-diploma (on optin)
 * Stop: When user completes mini diploma (switches to completion sequence)
 *
 * OFFER: $297 ASI Graduate Scholarship
 * Total Value: $24,655
 * Only 3 scholarship spots per month (real scarcity)
 *
 * Track 2: 18 emails over 45 days
 *
 * Phase 1 (Days 0-10): VALUE - Build trust, encourage completion, NO selling
 * Phase 2 (Days 11-25): DESIRE - Show transformation, introduce offer softly
 * Phase 3 (Days 26-40): DECISION - Clear $297 offer, handle objections
 * Phase 4 (Days 41-45): RE-ENGAGE - Stay connected
 *
 * Key strategy: Get them to COMPLETE first, then convert
 */

function cleanContent(content: string): string {
    return content
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/—/g, '-')
        .trim();
}

const ASI_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

const CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw";
const MINI_DIPLOMA_URL = "{{MINI_DIPLOMA_URL}}";
const TRAINING_URL = "{{GRADUATE_TRAINING_URL}}";

export const FM_NURTURE_SEQUENCE_V4 = [
    // ============================================
    // PHASE 1: VALUE (Days 0-10) - Build Trust, Encourage Completion
    // ============================================

    // Email 1 - Day 0: Welcome
    {
        id: 1,
        phase: "value",
        day: 0,
        delayHours: 0,
        subject: "Re: your Functional Medicine access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of over 20,000 women who've started this journey - practitioners in 47 countries who decided they wanted more than surface-level health advice.

Your Functional Medicine Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Master Practitioners.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

This is the beginning of something.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    // Email 2 - Day 1: Sarah's Story
    {
        id: 2,
        phase: "value",
        day: 1,
        delayHours: 0,
        subject: "Re: my story (thought you'd relate)",
        content: cleanContent(`{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles - chronic fatigue, brain fog, hormonal chaos - I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom.

I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way."

That's when I found root-cause health. That's when I got certified.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of symptoms, how to design real protocols that worked.

But more than that - it gave me back my hope. And my identity.

I went from "Sarah who tries to help" to "Sarah, Board Certified Master Practitioner." That credential changed everything. Clients trusted me. I trusted myself.

And now? I get to live what once felt impossible: helping women transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path - because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}} - what made you curious about functional medicine? What's your story?

Hit reply. I want to hear it.

${ASI_SIGNATURE}`),
    },

    // Email 3 - Day 3: Why Generic Fails
    {
        id: 3,
        phase: "value",
        day: 3,
        delayHours: 0,
        subject: "Re: why the usual advice doesn't work",
        content: cleanContent(`{{firstName}},

I need to tell you about Linda.

She came to one of our Board Certified practitioners last year. 52 years old. Exhausted for three years straight. Brain fog so bad she'd forget words mid-sentence.

She'd seen four doctors. They all said the same thing:

"Your labs are normal."
"Try to sleep more."
"Maybe it's just stress."
"Have you considered antidepressants?"

By the time she found a certified practitioner, she was starting to believe them. Maybe it WAS all in her head. Maybe this was just what 52 felt like.

It wasn't.

Within 20 minutes of looking at her case through a root-cause lens, the practitioner found three things her doctors missed. Not because they were bad doctors - because they weren't trained to look.

Six weeks later, Linda texted: "I feel like myself again. I forgot what that even felt like."

Here's the thing, {{firstName}}:

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Balance your hormones" doesn't help when you don't know WHICH ones are off.
"Reduce stress" doesn't help when the stress is coming from inside.

This is what you're learning in your Mini Diploma. This is the difference between surface-level wellness and root-cause understanding.

Have you started your lessons yet?

${ASI_SIGNATURE}

P.S. Linda now refers everyone to ASI-certified practitioners. Her exact words: "The doctors kept me sick. A certified practitioner made me well."`),
    },

    // Email 4 - Day 5: Client Win Story
    {
        id: 4,
        phase: "value",
        day: 5,
        delayHours: 0,
        subject: "Re: something incredible happened",
        content: cleanContent(`{{firstName}},

I have to share something that happened this week.

One of our Board Certified practitioners, Michelle, just sent me this message:

"Sarah, my client Jennifer just called me crying. Good tears. She said her husband noticed she seems 'different' - more energy, more patient with the kids, more like herself. She's been struggling for 3 years. Doctors couldn't figure it out. We worked together for 6 weeks."

This is why I do this work.

Not the certificates. Not the income (though that's nice too). THIS.

That moment when someone who's been dismissed, ignored, or told "it's all in your head" finally gets answers.

Michelle is one of 1,247+ ASI-certified practitioners now helping women around the world. She got certified 8 months ago. Now she has a full practice.

But more importantly - she gets to have moments like this. Where she changes someone's life.

{{firstName}}, I don't know exactly why you signed up for this Mini Diploma. Maybe for yourself. Maybe for a family member. Maybe because something inside you said "I need to learn this."

Whatever the reason - trust that instinct.

Keep going with your lessons.

${ASI_SIGNATURE}

P.S. How are you finding the lessons so far?`),
    },

    // Email 5 - Day 7: Check-in
    {
        id: 5,
        phase: "value",
        day: 7,
        delayHours: 0,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

I've been thinking about you.

It's been a week since you started your Functional Medicine Mini Diploma, and I'm curious:

What's surprised you most so far?

When I ask our 1,247+ practitioners this question, the most common answers are:

1. "I had no idea about the 5 root causes of chronic disease" (most people only know two!)
2. "The gut-brain connection blew my mind"
3. "I realized half my 'normal' symptoms... aren't normal at all"

What about you?

Just hit reply and tell me one thing that made you go "wow."

${ASI_SIGNATURE}

P.S. If you haven't had a chance to dive in yet, no judgment. But try to carve out 15 minutes this week. It's worth it.`),
    },

    // Email 6 - Day 10: Progress Check
    {
        id: 6,
        phase: "value",
        day: 10,
        delayHours: 0,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How are you doing with your Mini Diploma?

If you're cruising through - amazing. You're joining the thousands of women who've completed this training.

If life got in the way - that's okay too. No judgment.

The women who finish this Mini Diploma tell me it changed how they see their own health. And how they relate to women around them who are struggling.

Even 10 minutes at a time counts.

What's one thing I can help you with right now?

${ASI_SIGNATURE}

P.S. If you've finished or are close - reply with "DONE" and I'll tell you about the special opportunity waiting for graduates.`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 11-25) - Show Transformation
    // ============================================

    // Email 7 - Day 12: Diane's Transformation
    {
        id: 7,
        phase: "desire",
        day: 12,
        delayHours: 0,
        subject: "Re: Diane's transformation",
        content: cleanContent(`{{firstName}},

I want to tell you what happened to Diane.

Diane was a nurse for 40 years. Burned out. Exhausted. Ready to quit healthcare entirely.

Then she got certified through ASI.

Month 1: Nervous but excited. Had no idea what she was doing. But she had knowledge now - and a credential that proved it.

Month 2: Posted in a Facebook group about helping with hormone issues. Five women messaged her asking for help.

Month 3: Three became paying clients. $250 each per session.

Month 6: Quit her nursing job.

Today: Diane works from home. Makes $8,000/month. Sees 8-10 clients a week.

Here's what changed:

Before: "Diane Smith, RN, Retired"
After: "Diane Smith, RN, FM-BC - Board Certified Master Practitioner"

That addition changed EVERYTHING.

And the best part? She's part of a 5-person accountability pod now. Daily check-ins. Women who understand. They've become her closest friends.

{{firstName}}, I'm telling you this because... maybe you see yourself in her?

${ASI_SIGNATURE}`),
    },

    // Email 8 - Day 15: Day in the Life
    {
        id: 8,
        phase: "desire",
        day: 15,
        delayHours: 0,
        subject: "Re: what my typical day looks like",
        content: cleanContent(`{{firstName}},

Want to know what my days look like now?

7:00am - Wake up naturally. Coffee. Read for 20 minutes.

8:00am - Check my accountability pod chat. Share my daily intention. Cheer on my pod members. We do this every single day - 5 of us, holding each other accountable.

9:00am - First client call. A woman in Texas with chronic symptoms. I sign my notes: "Sarah, FM-BC"

10:30am - Second call. A long-term client who's finally sleeping through the night. Happy tears.

12:00pm - Lunch at home.

1:00pm - Check the ASI Directory. Two new inquiries from women searching for practitioners.

3:30pm - Pick up my daughter from school.

Evening - Dinner together. Present. Not exhausted.

No commute. No 14-hour days. No asking permission.

I introduce myself differently now: "I'm Sarah, a Board Certified Master Practitioner specializing in functional medicine."

That sentence changed my income, my schedule, and my self-respect.

${ASI_SIGNATURE}

P.S. The daily pod check-ins? They're what keep me going. Knowing 4 other women are counting on me to show up.`),
    },

    // Email 9 - Day 18: The Full Picture
    {
        id: 9,
        phase: "desire",
        day: 18,
        delayHours: 0,
        subject: "Re: what most people don't know",
        content: cleanContent(`{{firstName}},

There's something most people don't know about becoming a certified practitioner.

It's not just about the knowledge (though you get plenty of that).

It's about what COMES WITH the certification:

THE CERTIFICATIONS ($8,291 value):
- Foundation Certificate (your first credential)
- Professional Certificate (charge $100+/hour)
- Board Certification (the $200/hr practitioner level)
- 9 International Accreditations (recognized in 35+ countries)

THE TRAINING ($4,494 value):
- 150-Hour DEPTH Method Clinical Training
- Functional Lab Interpretation Intensive
- Client Consultation Blueprint
- 50+ Complex Case Masterclasses (Hashimoto's, PCOS, SIBO, chronic fatigue, menopause)

THE SUPPORT ($4,894 value):
- 52 Weeks of Group Mentorship (weekly LIVE calls with me)
- Weekly Accountability Pod (your 5-person squad)
- Private Practitioner Community (1,247+ certified coaches)
- "Stuck? Text Sarah" Direct Access
- Monthly Hot Seat Case Reviews

THE PRACTICE-BUILDING ($3,985 value):
- Done-For-You Practice Website (LIVE in 48 hours - we build it!)
- 500+ Clinical Templates
- Lifetime Directory Listing (clients find YOU)
- "First 5 Clients" Attraction System
- Legal & Scope of Practice Kit
- Pricing & Packaging Guide

THE BONUSES ($2,991 value):
- Professional Brand Photo Session
- 90-Day Social Content Calendar
- Email Sequence Templates
- "Clients From Scratch" Workshop
- Lab Partner Discounts
- Certificate Frames + LinkedIn Badges

Total value: $24,655.

I'll tell you more about how to access all of this soon.

But first - are you close to finishing your Mini Diploma?

${ASI_SIGNATURE}`),
    },

    // Email 10 - Day 21: Graduate Training Invite
    {
        id: 10,
        phase: "desire",
        day: 21,
        delayHours: 0,
        subject: "Re: watch this (45 min training)",
        content: cleanContent(`{{firstName}},

I created something I think you'll find valuable.

It's called the Graduate Training - a 45-minute session where I walk you through:

- How practitioners like you are building $5K-$15K/month practices
- The exact certification path that leads to confident, credentialed practice
- What separates those who succeed from those who stay stuck
- The 3-tier certification system and what each level unlocks

This isn't a pitch - it's a vision of what's ahead.

Watch the Graduate Training: ${TRAINING_URL}

Watch it, and then tell me what you think.

${ASI_SIGNATURE}

P.S. If you've finished your Mini Diploma already, this is the perfect next step. If not, no pressure - come back to this when you're ready.`),
    },

    // Email 11 - Day 25: Two Paths
    {
        id: 11,
        phase: "desire",
        day: 25,
        delayHours: 0,
        subject: "Re: thinking about your decision",
        content: cleanContent(`{{firstName}},

Imagine it's one year from now.

Two versions of that moment:

PATH A: Nothing Changed

Same job. Same frustrations. The Mini Diploma sitting there, not leading anywhere.

On LinkedIn, your title is the same.
No pod. No daily check-ins with women who get it.

Not terrible. Just... the same.

PATH B: You Made a Decision

You're Board Certified. Three levels complete.

You introduce yourself: "Hi, I'm {{firstName}}, FM-BC - Board Certified Master Practitioner."

You're in the ASI Directory. Clients find YOU.

You have your 5-person accountability pod. Daily check-ins. Women who became your closest friends.

8 regular clients. $4,000-$8,000/month.

That feeling of "I'm meant for something more"? Gone. Because you're DOING it.

Both futures take the same 365 days to arrive.

The only difference is the decision you make now.

${ASI_SIGNATURE}

P.S. Which path do you want? Reply and tell me.`),
    },

    // ============================================
    // PHASE 3: DECISION (Days 26-40) - Clear $297 Offer
    // ============================================

    // Email 12 - Day 27: The Scholarship Offer
    {
        id: 12,
        phase: "decision",
        day: 27,
        delayHours: 0,
        subject: "Re: the ASI Graduate Scholarship",
        content: cleanContent(`{{firstName}},

I need to tell you about something special.

It's called the ASI Graduate Scholarship.

Every month, we award 3 scholarships to women who complete their Mini Diploma and score 95+ on the final assessment.

The scholarship gives you access to EVERYTHING - all $24,655 worth - for just $297.

THE CERTIFICATIONS ($8,291 value):
- Foundation + Professional + Board Certification
- 9 International Accreditations

THE TRAINING ($4,494 value):
- 150-Hour DEPTH Method Clinical Training
- Lab Interpretation + Case Masterclasses

THE SUPPORT ($4,894 value):
- 52 weeks mentorship with me
- Your 5-person accountability pod
- Private community access
- "Text Sarah" direct support

THE PRACTICE-BUILDING ($3,985 value):
- Done-for-you website (we build it!)
- 500+ clinical templates
- Directory listing (clients find you)
- "First 5 Clients" system

THE BONUSES ($2,991 value):
- Photo session, content calendar, email templates, and more

Total: $24,655
Scholarship Price: $297

Here's how it works:

1. Complete your Mini Diploma
2. Take the final assessment (10 questions)
3. Score 95+ and you qualify
4. Scholarship coupon valid for 24 hours

Only 3 spots per month. This isn't fake scarcity - we physically can't mentor more than 3 new practitioners at this level of support.

Finish your Mini Diploma: ${MINI_DIPLOMA_URL}

I'll be waiting on the other side.

${ASI_SIGNATURE}`),
    },

    // Email 13 - Day 30: Objection Crusher
    {
        id: 13,
        phase: "decision",
        day: 30,
        delayHours: 0,
        subject: "Re: the thing that's stopping you",
        content: cleanContent(`{{firstName}},

Let me address what might be holding you back:

"I don't have time."
- Self-paced. No live requirements.
- Most complete in 8-12 weeks.
- Daily pod check-ins take 5 minutes.
- We build your website FOR you while you learn.

"$297 is still money."
- Less than a nice dinner for two.
- 2 clients at $150 each = break even.
- Everything after = profit.
- HSA/FSA accepted.

"I'm not qualified."
- 38% of our practitioners had ZERO health background.
- The 150-hour training teaches you everything.
- Your accountability pod supports you daily.
- We literally hand you 500+ templates.

"What if I can't get clients?"
- ASI Directory brings passive leads (clients find YOU).
- "First 5 Clients" system shows exactly how.
- We build your website in 48 hours.
- 73% of practitioners say demand exceeds capacity.

"What if my family thinks I'm crazy?"
- They might. Until you start earning.
- 89% report increased family support after 3 months.

"What if it doesn't work?"
- 30-day money-back guarantee.
- Under 3% refund rate.

So what's REALLY stopping you?

Reply honestly. I want to help.

${ASI_SIGNATURE}`),
    },

    // Email 14 - Day 33: The ROI Math
    {
        id: 14,
        phase: "decision",
        day: 33,
        delayHours: 0,
        subject: "Re: the investment math",
        content: cleanContent(`{{firstName}},

Let's talk numbers.

The scholarship price is $297.

For context:
- Traditional health coaching certification: $5,000-$15,000
- Nursing school: $50,000+
- Other certification programs: $997-$2,997

What you get for $297:
- 3-tier certification (Foundation + Professional + Board)
- 9 international accreditations
- 150-hour clinical training
- 52 weeks of live mentorship
- Your 5-person accountability pod
- Done-for-you practice website
- 500+ clinical templates
- Directory listing
- Everything else ($24,655 total value)

The ROI math:

Most practitioners charge $150-$300 per session.

$297 / $150 = 2 clients.

TWO CLIENTS and you've made your money back.
Everything after that is profit.

Diane made $750 in her first month. Her investment paid back 2.5x before she even finished the training.

This isn't an expense. It's the best $297 you'll ever spend.

Finish your Mini Diploma to qualify: ${MINI_DIPLOMA_URL}

${ASI_SIGNATURE}`),
    },

    // Email 15 - Day 36: The Credential
    {
        id: 15,
        phase: "decision",
        day: 36,
        delayHours: 0,
        subject: "Re: the credential that changes everything",
        content: cleanContent(`{{firstName}},

Can I show you something?

BEFORE Certification:
"{{firstName}} - Interested in health"
- No title
- Clients hesitate
- Not listed anywhere
- Working alone

AFTER Certification:
"{{firstName}}, FM-BC - Board Certified Master Practitioner"
- Professional credential (9 international accreditations)
- Clients trust and pay $150-$300/session
- Listed in ASI Directory
- Daily support from your 5-person pod
- Website built FOR you

What you get:

3 CREDENTIALS:
- FM-FC (Foundation Certified)
- FM-CP (Certified Practitioner)
- FM-BC (Board Certified Master)

9 ACCREDITATIONS:
- CMA, IPHM, CPD, IAOTH + 5 more
- Recognized in 35+ countries

THE DIRECTORY:
Women searching for "certified functional medicine practitioner" find YOU.

THE POD:
5-person accountability squad. Daily check-ins. Lifetime friends.

THE VERIFICATION:
Anyone can verify your credential at accredipro.com/verify

Maria told me: "The day I updated my LinkedIn to show FM-BC was the day everything clicked. I wasn't 'trying to be' a practitioner. I WAS one."

You're not buying a course for $297.

You're becoming {{firstName}}, FM-BC - Board Certified Master Practitioner.

${ASI_SIGNATURE}`),
    },

    // Email 16 - Day 40: Ready When You Are
    {
        id: 16,
        phase: "decision",
        day: 40,
        delayHours: 0,
        subject: "Re: no pressure",
        content: cleanContent(`{{firstName}},

This is the last "offer" email for a while.

I've shared everything:
- The 3-tier certification path
- The 9 international accreditations
- The 150-hour clinical training
- The 52 weeks of mentorship
- The accountability pod
- The done-for-you website
- The 500+ templates
- The directory listing
- The $24,655 value for $297 scholarship

Now the decision is yours.

Here's what I know:

The women who succeed at this aren't the ones with the most money, time, or confidence.

They're the ones who decided.

If you're ready - finish your Mini Diploma, ace the assessment, and claim your scholarship.

If you're not ready - that's okay too. I'll keep sending value.

But I want to say one thing:

A year from now, you'll wish you had started today.

Whatever you decide, I believe in you.

${ASI_SIGNATURE}

P.S. Scholarship spots: 3 per month. Score required: 95+. Coupon valid: 24 hours. HSA/FSA accepted.

Finish your Mini Diploma: ${MINI_DIPLOMA_URL}`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 41-45)
    // ============================================

    // Email 17 - Day 43: Still Thinking
    {
        id: 17,
        phase: "reengage",
        day: 43,
        delayHours: 0,
        subject: "Re: still thinking about it?",
        content: cleanContent(`{{firstName}},

Just checking in.

47 women enrolled this week.

They're already matched with their pods. Already doing daily check-ins. Already starting their training.

I'm not saying this to pressure you.

Just... they were where you are a week ago.

If you're still thinking... if there's something specific holding you back...

Reply and tell me. I want to help.

${ASI_SIGNATURE}`),
    },

    // Email 18 - Day 45: Stay Connected
    {
        id: 18,
        phase: "reengage",
        day: 45,
        delayHours: 0,
        subject: "Re: let's stay connected",
        content: cleanContent(`{{firstName}},

It's been about 6 weeks since you started.

I hope you've found value in what you learned - even if you haven't finished the Mini Diploma yet.

The knowledge you've gained about root-cause health is yours forever.

Going forward, I'll send occasional emails. Tips, stories, resources. Just staying in touch.

And if you ever decide you want to become Board Certified - whether in a month, six months, or a year - the scholarship path is open:

1. Finish your Mini Diploma
2. Score 95+ on the assessment
3. Get $24,655 of value for $297

Thank you for being part of the ASI community, {{firstName}}.

Whenever you're ready to become {{firstName}}, FM-BC - you know where to find me.

${ASI_SIGNATURE}

---
AccrediPro Standards Institute
New York | Dubai | 1,247+ Practitioners Worldwide
The Gold Standard in Wellness Certification

Finish your Mini Diploma: ${MINI_DIPLOMA_URL}`),
    },
];

export type FMNurtureEmailV4 = typeof FM_NURTURE_SEQUENCE_V4[number];
