/**
 * FM Mini Diploma COMPLETION Sequence
 *
 * For users who COMPLETE the mini diploma exam (score 95+)
 *
 * Trigger: mini_diploma_fm_healthcare:completed
 *
 * OFFER: $297 ASI Graduate Scholarship
 * Total Value: $24,655
 *
 * Track 1: 7 emails over 30 days (conversion-focused)
 *
 * Key mechanics:
 * - 24h scholarship urgency (Email 1-2)
 * - Grace period at $497 (Email 3)
 * - Webinar/training invite (Email 5)
 * - Long-tail re-engagement (Email 6-7)
 * - "Only 3 spots monthly" scarcity (real)
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
const GRACE_CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw"; // Update if different
const TRAINING_URL = "{{GRADUATE_TRAINING_URL}}";

export const FM_COMPLETION_SEQUENCE = [
    // ============================================
    // Email 1 - Day 0: SCHOLARSHIP QUALIFIED (24h Urgency)
    // ============================================
    {
        id: 1,
        phase: "conversion",
        day: 0,
        delayHours: 0,
        subject: "Re: you qualified for the ASI Graduate Scholarship",
        content: cleanContent(`{{firstName}},

You did it.

You just scored {{examScore}}/100 on your Functional Medicine exam.

That puts you in the top 5% of everyone who's ever taken this assessment.

And because of your score, you've qualified for something special:

THE ASI GRADUATE SCHOLARSHIP

{{firstName}}, we only award 3 of these per month.

Here's what the scholarship unlocks - everything for just $297:

THE CERTIFICATIONS ($8,291 value):
- Foundation Certificate (your first credential in 30 days)
- Professional Certificate (charge $100+/hour)
- Board Certification (the $200/hr practitioner level)
- 9 International Accreditations (CMA, IPHM, CPD, IAOTH + 5 more)

THE TRAINING ($4,494 value):
- 150-Hour DEPTH Method Clinical Training
- Functional Lab Interpretation Intensive
- Client Consultation Blueprint
- 50+ Complex Case Masterclasses

THE SUPPORT ($4,894 value):
- 52 Weeks of Group Mentorship with me (weekly LIVE calls)
- Weekly Accountability Pod (your 5-person squad)
- Private Practitioner Community (1,247+ certified coaches)
- "Stuck? Text Sarah" Direct Access
- Monthly Hot Seat Case Reviews

THE PRACTICE-BUILDING ($3,985 value):
- Done-For-You Practice Website (LIVE in 48 hours)
- 500+ Clinical Templates
- Lifetime Directory Listing
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

Total Value: $24,655
Your Scholarship Price: $297
You Save: $24,358 (99%)

{{firstName}}, your scholarship coupon expires in 24 HOURS.

This isn't fake urgency. We physically cannot mentor more than 3 new practitioners per month at this level of support.

Claim your scholarship: ${CHECKOUT_URL}

I'm so proud of what you accomplished today.

${ASI_SIGNATURE}

P.S. HSA/FSA accepted. Instant access. Secure checkout.`),
    },

    // ============================================
    // Email 2 - Day 1: 12 HOURS LEFT
    // ============================================
    {
        id: 2,
        phase: "conversion",
        day: 1,
        delayHours: 0,
        subject: "Re: 12 hours left on your scholarship",
        content: cleanContent(`{{firstName}},

Your ASI Graduate Scholarship expires in 12 hours.

After that, the $297 price is gone. The next scholarship won't be available until next month - and there's no guarantee you'll qualify again.

I want you to imagine something:

It's 6 months from now. You're a Board Certified Practitioner. You have your first 5 clients. You're earning $150-300 per session.

That version of you started with THIS decision.

Quick reminder of what's waiting:

- 3 Certifications (Foundation + Professional + Board)
- 9 International Accreditations
- 150-Hour DEPTH Method Training
- 52 weeks of live mentorship with me
- Your 5-person accountability pod
- Done-for-you practice website
- 500+ clinical templates
- Everything you need to get your first clients

$24,655 value. $297 today. 12 hours left.

Claim it now: ${CHECKOUT_URL}

I don't want you to miss this.

${ASI_SIGNATURE}

P.S. If you're reading this and wondering "is this real?" - yes. I believe in making this accessible to women who've proven they're serious. Your exam score proved it.`),
    },

    // ============================================
    // Email 3 - Day 2: SCHOLARSHIP EXPIRED (Grace Period $497)
    // ============================================
    {
        id: 3,
        phase: "grace",
        day: 2,
        delayHours: 0,
        subject: "Re: your scholarship expired (but...)",
        content: cleanContent(`{{firstName}},

Your 24-hour scholarship expired.

The $297 price is gone.

But I talked to my team, and we agreed to extend you a ONE-TIME grace offer:

Instead of full price, you can still enroll for $497.

That's still $24,158 in savings.

Why am I doing this?

Because you scored {{examScore}}/100. You clearly have what it takes. And I'd hate to see timing be the only thing that stops you.

This grace period lasts 48 hours. After that, it's full price or wait for next month's scholarship (which isn't guaranteed).

Everything is still included:
- All 3 certification levels
- 9 international accreditations
- 150-hour clinical training
- 52 weeks mentorship
- Your accountability pod
- Done-for-you website
- 500+ templates
- The entire $24,655 package

$497 grace period: ${GRACE_CHECKOUT_URL}

I know you're meant for this, {{firstName}}.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // Email 4 - Day 5: PERSONAL CHECK-IN
    // ============================================
    {
        id: 4,
        phase: "nurture",
        day: 5,
        delayHours: 0,
        subject: "Re: what happened?",
        content: cleanContent(`{{firstName}},

I noticed you didn't enroll.

No judgment - I'm genuinely curious what held you back.

Was it:
- The timing? (Life is crazy, I get it)
- The money? (Even $297 can feel like a lot)
- Uncertainty? (Will this actually work for me?)
- Something else I'm not seeing?

I ask because I've helped thousands of women go from "curious about functional medicine" to "earning $5,000-$10,000/month helping clients."

And I've noticed the ones who succeed aren't always the smartest or most qualified.

They're the ones who made a decision when they were scared.

{{firstName}}, you scored in the top 5% on that exam. You understand this material. You have what it takes.

The only question is: are you going to use it?

If you're still interested, just reply to this email. Tell me what's on your mind. I read every response personally.

${ASI_SIGNATURE}

P.S. Our next live mentorship cohort starts soon. If you want in, now's the time to talk.`),
    },

    // ============================================
    // Email 5 - Day 7: TRAINING INVITATION
    // ============================================
    {
        id: 5,
        phase: "nurture",
        day: 7,
        delayHours: 0,
        subject: "Re: watch this (45 min training)",
        content: cleanContent(`{{firstName}},

I created something I think you'll love.

It's a 45-minute training called "The Graduate Roadmap" - where I walk through exactly how our certified practitioners are building $5K-$15K/month practices.

No pitch. No gimmicks. Just the actual path.

You'll see:
- The 3 certification levels and what each unlocks
- How the mentorship + pod system works
- Real income numbers from real graduates
- The exact steps from "certified" to "clients paying you"

I made this for people like you - women who've proven they understand the material but haven't taken the next step yet.

Watch it here: ${TRAINING_URL}

After you watch, if you have questions, just reply. I'm here.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // Email 6 - Day 14: STILL THINKING
    // ============================================
    {
        id: 6,
        phase: "reengage",
        day: 14,
        delayHours: 0,
        subject: "Re: still thinking about it?",
        content: cleanContent(`{{firstName}},

Two weeks ago, you scored {{examScore}}/100 on your Functional Medicine exam.

I'm still thinking about you.

You clearly have the knowledge. The question is whether you'll do something with it.

I want to share what's happening right now in our community:

- Jennifer (certified 4 months ago) just hit $6,200/month
- Diane (certified 8 months ago) quit her nursing job
- Michelle (certified 6 weeks ago) got her first paying client

They all started exactly where you are.

The difference? They decided.

If the scholarship timing didn't work out, I understand. But the door isn't closed forever.

Reply with "INTERESTED" and I'll tell you about our next enrollment window.

Or if you've moved on, that's okay too. No hard feelings.

Just wanted you to know - I'm still here.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // Email 7 - Day 30: DOOR STILL OPEN
    // ============================================
    {
        id: 7,
        phase: "reengage",
        day: 30,
        delayHours: 0,
        subject: "Re: the door is still open",
        content: cleanContent(`{{firstName}},

It's been a month since you completed your Mini Diploma.

I wanted to send one last note.

The knowledge you gained - root-cause thinking, the 5 hidden drivers, how to actually help people instead of giving generic advice - that's yours forever.

But knowledge without action is just... information.

I've watched too many talented women let this sit. They tell themselves "someday" and then someday never comes.

You scored {{examScore}}/100, {{firstName}}. You're not one of those people.

Whenever you're ready to turn that knowledge into income, into impact, into a career you're proud of - the certification path is here.

$297 scholarship spots open monthly for qualified graduates like you.

Just reply "READY" and I'll send you the details for the next enrollment window.

Or don't. No pressure. I just didn't want you to think the door had closed.

It hasn't.

${ASI_SIGNATURE}

---
AccrediPro Standards Institute
New York | Dubai | 1,247+ Practitioners Worldwide
The Gold Standard in Wellness Certification`),
    },
];

export type FMCompletionEmail = typeof FM_COMPLETION_SEQUENCE[number];
