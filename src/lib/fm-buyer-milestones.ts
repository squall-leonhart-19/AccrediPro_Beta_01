/**
 * FM PROGRESS MILESTONE EMAILS
 * 
 * Triggered by course progress events
 * 
 * Goal: Celebrate wins, maintain momentum, reduce drop-off
 * 
 * Milestones:
 * - Module 1 Complete: First win celebration
 * - Module 3 Complete: Halfway momentum boost
 * - 100% Complete: Congratulations + certificate
 * - Certificate Claimed: Future teaser (for upsell later)
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
const COURSE_URL = "https://learn.accredipro.academy/courses/functional-medicine-complete-certification";
const CERTIFICATE_URL = "https://learn.accredipro.academy/certificates";

export const FM_PROGRESS_MILESTONES = {
    // ============================================
    // MODULE 1 COMPLETE
    // ============================================
    module_1_complete: {
        id: "module_1_complete",
        triggerTag: "module_1_completed",
        subject: "Module 1 COMPLETE - you're already ahead",
        content: cleanContent(`{{firstName}},

You just completed Module 1.

Do you realize what that means?

You now understand more about root-cause health than 95% of the population. You can explain the ROOTS Method. You know why conventional approaches fail.

This is the foundation everything else builds on.

And here's what I want you to know: most people who buy courses never finish the first module. You already have.

That tells me something about you.

MODULE 2 is now unlocked: Clinical Assessment Frameworks

This is where it gets really good. You'll learn how to actually apply what you know to real clients. The "aha moments" multiply from here.

Continue your training: ${COURSE_URL}

Keep the momentum going, {{firstName}}. You're doing amazing.

${SARAH_SIGNATURE}

P.S. Quick tip: Students who complete Module 2 within 48 hours of Module 1 have the highest completion rates. Just saying.`),
    },

    // ============================================
    // MODULE 3 COMPLETE (HALFWAY)
    // ============================================
    module_3_complete: {
        id: "module_3_complete",
        triggerTag: "module_3_completed",
        subject: "HALFWAY - you're ahead of 70% of students",
        content: cleanContent(`{{firstName}},

This is a big deal.

You just hit the halfway point in your certification.

I want to put this in perspective:

- 70% of online course buyers never finish Module 1
- 40% drop off by Module 3
- You're now in the top 30% of students

This isn't luck. This is discipline. This is commitment. This is who you are.

Here's what's coming next:

Module 4: Advanced Protocol Design
Module 5: Client Communication Mastery
Module 6: Practice Building Foundations

Each module builds on the last. By Module 6, you'll have everything you need to start working with real clients.

Keep going: ${COURSE_URL}

The finish line is closer than you think.

${SARAH_SIGNATURE}

P.S. I see you in the community portal. You're exactly the kind of practitioner we love having. Keep showing up.`),
    },

    // ============================================
    // 100% COMPLETE
    // ============================================
    course_complete: {
        id: "course_complete",
        triggerTag: "course_completed",
        subject: "CONGRATULATIONS - You Did It!",
        content: cleanContent(`{{firstName}},

I don't have enough words.

YOU DID IT.

You completed the entire Functional Medicine Certification.

Do you understand how rare that is?

Less than 15% of people who start online courses finish them. You didn't just finish - you mastered 150+ hours of clinical training.

Here's what happens next:

1. YOUR CERTIFICATE IS READY
   Go claim it here: ${CERTIFICATE_URL}
   
2. ADD YOUR CREDENTIALS
   You can now add "FM-CP" (Functional Medicine Certified Practitioner) to your name.
   
3. LINKEDIN BADGE
   Download your official badge and add it to your profile.

{{firstName}}, I'm genuinely proud of you.

This journey isn't easy. The material is dense. The commitment is real. And you showed up, lesson after lesson, until you finished.

That says everything about who you are.

Go claim your certificate: ${CERTIFICATE_URL}

Welcome to the certified practitioner community.

${SARAH_SIGNATURE}

P.S. This is just the beginning. There's so much more ahead. I'll be in touch about what's next - but for now, celebrate this win. You earned it.`),
    },

    // ============================================
    // CERTIFICATE CLAIMED
    // ============================================
    certificate_claimed: {
        id: "certificate_claimed",
        triggerTag: "certificate_claimed",
        subject: "Your certificate is officially yours",
        content: cleanContent(`{{firstName}},

Your certificate is now official.

You are a Certified Functional Medicine Practitioner.

I want you to do something for me:

1. Print your certificate (or save the PDF somewhere visible)
2. Update your LinkedIn headline with "FM-CP"
3. Tell ONE person in your life what you just accomplished

Why? Because external recognition reinforces internal belief.

The more you OWN this credential, the more confident you'll feel when you start talking to clients.

Now... what's next?

Most practitioners at this stage ask:
- "How do I get my first client?"
- "What should I charge?"
- "How do I set up my practice?"

We have resources for all of this inside the community.

But I also want to share something exclusive with you soon - something for practitioners who've proven they're serious (like you).

Stay tuned. And again - congratulations.

You're the real deal now.

${SARAH_SIGNATURE}`),
    },
};

// ============================================
// ENGAGEMENT REMINDERS (Stalled Buyers)
// ============================================

export const FM_ENGAGEMENT_REMINDERS = {
    // 7 days no login
    no_login_7d: {
        id: "no_login_7d",
        triggerDays: 7,
        checkType: "last_login",
        preventTag: "reminder_7d_sent",
        subject: "Your course is waiting...",
        content: cleanContent(`{{firstName}},

I noticed you haven't logged in to your Functional Medicine Certification in a while.

Is everything okay?

I'm not going to guilt you - I know life gets crazy. But I also know you invested in this for a reason. And whatever that reason was, it's still valid.

Can I help with anything?

- Confused about where to start? Reply and I'll point you in the right direction.
- Feeling overwhelmed? I can help you create a realistic schedule.
- Technical issues? My team will fix it immediately.

Your course is here, waiting: ${DASHBOARD_URL}

Just one lesson today. That's all I'm asking.

${SARAH_SIGNATURE}`),
    },

    // 14 days no progress
    no_progress_14d: {
        id: "no_progress_14d",
        triggerDays: 14,
        checkType: "last_progress",
        preventTag: "reminder_14d_sent",
        subject: "I noticed you haven't started Module 2...",
        content: cleanContent(`{{firstName}},

It's been 2 weeks since you made progress in your certification.

I'm reaching out because I care.

Here's the truth: every day that passes makes it harder to restart. The excitement fades. The urgency disappears. And before you know it, you're one of those people who "bought a course but never finished it."

That's not you.

You invested in this because you wanted something different. A new skill. A new career. A new way to help people.

That's still possible.

Here's my challenge: log in today and complete just ONE lesson.

Not the whole module. Just one lesson.

Login here: ${DASHBOARD_URL}

I'm rooting for you.

${SARAH_SIGNATURE}

P.S. If something specific is blocking you - reply and tell me what it is. I read every email personally.`),
    },

    // 30 days stalled
    stalled_30d: {
        id: "stalled_30d",
        triggerDays: 30,
        checkType: "last_progress",
        preventTag: "reminder_30d_sent",
        subject: "Honest question for you...",
        content: cleanContent(`{{firstName}},

Honest question: do you still want to do this?

It's been 30 days since you made progress in your certification.

I'm not asking to shame you. I'm asking because the answer matters.

If the answer is YES - then something is in the way. Time, energy, clarity, something. Reply to this email and tell me what it is. I'll help you figure it out.

If the answer is NO - that's okay too. Not everyone is meant to be a practitioner. But at least be honest with yourself about it.

What I don't want is for you to be stuck in limbo. Half-committed. Thinking about it but not doing it. That's the worst place to be.

Choose one:
- REPLY "YES I WANT THIS" - and I'll help you get back on track
- REPLY "NO I'M DONE" - and I'll stop emailing you about it

No judgment either way.

But the decision is yours.

${SARAH_SIGNATURE}`),
    },

    // 45 days dormant - urgency
    dormant_45d: {
        id: "dormant_45d",
        triggerDays: 45,
        checkType: "last_progress",
        preventTag: "reminder_45d_sent",
        subject: "Your enrollment ends in 7 days",
        content: cleanContent(`{{firstName}},

I have to tell you something important.

Inactive enrollments are reviewed monthly. Students with no progress for 45+ days are moved to "paused" status.

You're on that list.

This doesn't mean you lose your course forever. But it does mean:
- You'll lose access to live mentorship sessions
- Your accountability pod spot gets reassigned
- You'll need to request reactivation to continue

I don't want that for you.

Here's how to stay active:

1. Log in before {{deadline}}
2. Complete any lesson (even a 5-minute one)
3. That resets your 45-day timer

Login now: ${DASHBOARD_URL}

I know this sounds like "fake urgency." It's not. We genuinely can't support students who aren't engaged - it takes resources away from those who are.

Please log in.

${SARAH_SIGNATURE}`),
    },
};

// Types
export type FMProgressMilestone = typeof FM_PROGRESS_MILESTONES[keyof typeof FM_PROGRESS_MILESTONES];
export type FMEngagementReminder = typeof FM_ENGAGEMENT_REMINDERS[keyof typeof FM_ENGAGEMENT_REMINDERS];
