/**
 * FM BUYER SPRINT SEQUENCE
 * 
 * For PAID users ($297+ certification) - NOT leads/mini diploma
 * 
 * Trigger: purchase_fm_certification (webhook enrolls them)
 * Stop: When user completes Module 1 (switches off sprint mode)
 * 
 * Goal: Get them to CONSUME content in first 48h to prevent refund
 * 
 * Phase 1 (0-48h): VELOCITY SPRINT
 * - Email 1: Welcome + Start Module 1 NOW
 * - Email 2: What's inside Module 1 (6h later)
 * - Email 3: Social proof - "Students who start in 24h..." (24h)
 * - Email 4: Almost there - 1 lesson away (48h)
 * 
 * Key insight: Once they complete 1 full module, refund rate drops 70%+
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

const SARAH_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

const DASHBOARD_URL = "https://learn.accredipro.academy/dashboard";
const MODULE_1_URL = "https://learn.accredipro.academy/courses/functional-medicine-complete-certification";

export const FM_BUYER_SPRINT_SEQUENCE = [
    // ============================================
    // Email 1 - Hour 0: WELCOME + IMMEDIATE ACTION
    // ============================================
    {
        id: 1,
        phase: "sprint",
        day: 0,
        delayHours: 0,
        subject: "You're in! Here's your first step",
        content: cleanContent(`{{firstName}},

Congratulations - you just made one of the best decisions of your life.

You're now enrolled in the Complete Functional Medicine Certification.

But here's the thing: the practitioners who succeed aren't the ones who "plan to start Monday." They're the ones who start TODAY.

So here's what I want you to do right now:

1. Log into your dashboard: ${DASHBOARD_URL}
2. Click "Start Module 1"
3. Watch the first lesson (12 minutes)

That's it. Just one lesson.

By the end, you'll understand the ROOTS Method foundation that separates amateur health coaches from clinical-grade practitioners.

Your login:
Email: {{email}}
Password: Futurecoach2025 (change it in Settings)

Start here: ${MODULE_1_URL}

I'm so excited to have you in the community. You're going to love what's ahead.

${SARAH_SIGNATURE}

P.S. I'll check in tomorrow to see how you're doing. Any questions, just hit reply.`),
    },

    // ============================================
    // Email 2 - Hour 6: WHAT'S INSIDE MODULE 1
    // ============================================
    {
        id: 2,
        phase: "sprint",
        day: 0,
        delayHours: 6,
        subject: "What's inside Module 1 (spoiler alert)",
        content: cleanContent(`{{firstName}},

Quick check-in - did you start Module 1 yet?

If not, no judgment. Life gets busy.

But let me tell you what's waiting for you inside:

MODULE 1: THE ROOTS METHOD FOUNDATION
- Lesson 1: Why 95% of health advice fails (and what works)
- Lesson 2: The 5 Hidden Drivers model that changes everything
- Lesson 3: How to spot patterns doctors miss
- Lesson 4: Your first root-cause assessment framework

By the end of Module 1, you'll be able to look at someone's symptoms and see connections their doctor never mentioned.

It's the "aha moment" our practitioners talk about most.

Time to complete: ~45 minutes

Start Module 1: ${MODULE_1_URL}

See you in there.

${SARAH_SIGNATURE}`),
    },

    // ============================================
    // Email 3 - Hour 24: SOCIAL PROOF + URGENCY
    // ============================================
    {
        id: 3,
        phase: "sprint",
        day: 1,
        delayHours: 0,
        subject: "The students who finish Module 1 in 24 hours...",
        content: cleanContent(`{{firstName}},

I want to share something with you.

We've tracked thousands of students through this certification.

And here's what we found:

Students who complete Module 1 in the first 24 hours are 4x more likely to finish the entire certification and get their first paying client.

It's not about being smarter. It's about momentum.

The ones who "start tomorrow" usually don't start at all. Life gets in the way. The excitement fades. And 30 days later, they're still on Lesson 1.

Don't let that be you.

You paid for this. You made the decision. Now honor that decision with 45 minutes of focused action.

Module 1 is waiting: ${MODULE_1_URL}

One lesson. That's all it takes to change your trajectory.

${SARAH_SIGNATURE}

P.S. If you've already started - ignore this email and keep going! Reply with "STARTED" and I'll send you something special.`),
    },

    // ============================================
    // Email 4 - Hour 48: ALMOST THERE
    // ============================================
    {
        id: 4,
        phase: "sprint",
        day: 2,
        delayHours: 0,
        subject: "You're 1 lesson away from your first breakthrough",
        content: cleanContent(`{{firstName}},

It's been 48 hours since you enrolled.

Can I ask you something honestly?

Have you started yet?

Because if you haven't... I get it. We all have reasons:
- "I'll start when things calm down"
- "I need to find the right time"
- "I'm waiting until I can really focus"

But here's the truth: there's never a "right time."

There's only now.

The women who are now earning $5,000-$10,000/month as certified practitioners? They all started imperfectly. They started tired. They started busy. They started anyway.

Here's my challenge for you:

Open Module 1. Watch one lesson. Just one.

It's 12 minutes that could change everything.

Start now: ${MODULE_1_URL}

I believe in you, {{firstName}}. You made this investment for a reason. Trust yourself.

${SARAH_SIGNATURE}

P.S. If you're stuck or confused about anything, reply to this email. I read every response and I'll personally help you get unstuck.`),
    },
];

// Types
export type FMBuyerSprintEmail = typeof FM_BUYER_SPRINT_SEQUENCE[number];

// Sequence metadata
export const FM_BUYER_SPRINT_CONFIG = {
    sequenceId: "fm_buyer_sprint",
    name: "FM Certification Buyer Sprint",
    description: "0-48h velocity sequence for new $297+ buyers",
    triggerTag: "fm_certification_purchased",
    stopTag: "module_1_completed",
    emailCount: 4,
    durationDays: 2,
};
