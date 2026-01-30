/**
 * UNIVERSAL BUYER RETENTION SYSTEM
 * 
 * Dynamic sequences that work for ANY course
 * Uses template variables: {{courseName}}, {{courseUrl}}, {{firstName}}, etc.
 * 
 * SEQUENCES:
 * 1. SPRINT (0-48h): 4 emails pushing first module completion
 * 2. MILESTONES: Module 1, Halfway, Complete, Certificate
 * 3. REMINDERS: 7d, 14d, 30d, 45d for stalled buyers
 */

// ============================================
// TYPES
// ============================================

export interface BuyerRetentionEmail {
    id: string;
    phase: 'sprint' | 'milestone' | 'reminder';
    day: number;
    delayHours: number;
    subject: string;
    content: string;
}

export interface CourseContext {
    firstName: string;
    email?: string;
    courseName: string;
    courseUrl: string;
    dashboardUrl: string;
    certificateUrl?: string;
    deadline?: string;
}

// ============================================
// SIGNATURE
// ============================================

const SARAH_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

// ============================================
// SPRINT SEQUENCE (0-48h)
// Get them to complete Module 1 FAST
// ============================================

export const SPRINT_SEQUENCE: BuyerRetentionEmail[] = [
    {
        id: "sprint_1",
        phase: "sprint",
        day: 0,
        delayHours: 0,
        subject: "You're in! Here's your first step",
        content: `{{firstName}},

Congratulations - you just made one of the best decisions of your life.

You're now enrolled in {{courseName}}.

But here's the thing: the practitioners who succeed aren't the ones who "plan to start Monday." They're the ones who start TODAY.

So here's what I want you to do right now:

1. Log into your dashboard: {{dashboardUrl}}
2. Click "Start Module 1"
3. Watch the first lesson (12 minutes)

That's it. Just one lesson.

By the end, you'll understand the core foundation that separates amateur health coaches from clinical-grade practitioners.

Start here: {{courseUrl}}

I'm so excited to have you in the community. You're going to love what's ahead.

${SARAH_SIGNATURE}

P.S. I'll check in tomorrow to see how you're doing. Any questions, just hit reply.`,
    },
    {
        id: "sprint_2",
        phase: "sprint",
        day: 0,
        delayHours: 6,
        subject: "What's inside Module 1",
        content: `{{firstName}},

Quick check-in - did you start Module 1 yet?

If not, no judgment. Life gets busy.

But let me tell you what's waiting for you inside Module 1:

- The core methodology that changes everything
- Key concepts most practitioners miss
- Your first practical framework
- The "aha moment" our graduates talk about most

By the end of Module 1, you'll already see health differently than before.

Time to complete: ~45 minutes

Start Module 1: {{courseUrl}}

See you in there.

${SARAH_SIGNATURE}`,
    },
    {
        id: "sprint_3",
        phase: "sprint",
        day: 1,
        delayHours: 0,
        subject: "Students who finish Module 1 in 24 hours...",
        content: `{{firstName}},

I want to share something with you.

We've tracked thousands of students through our certifications.

And here's what we found:

Students who complete Module 1 in the first 24 hours are 4x more likely to finish the entire certification and get their first paying client.

It's not about being smarter. It's about momentum.

The ones who "start tomorrow" usually don't start at all. Life gets in the way. The excitement fades. And 30 days later, they're still on Lesson 1.

Don't let that be you.

You paid for this. You made the decision. Now honor that decision with 45 minutes of focused action.

Module 1 is waiting: {{courseUrl}}

One lesson. That's all it takes to change your trajectory.

${SARAH_SIGNATURE}

P.S. If you've already started - ignore this and keep going! Reply with "STARTED" and I'll send you something special.`,
    },
    {
        id: "sprint_4",
        phase: "sprint",
        day: 2,
        delayHours: 0,
        subject: "You're 1 lesson away from your first breakthrough",
        content: `{{firstName}},

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

Start now: {{courseUrl}}

I believe in you, {{firstName}}. You made this investment for a reason. Trust yourself.

${SARAH_SIGNATURE}

P.S. If you're stuck or confused about anything, reply to this email. I read every response and I'll personally help you get unstuck.`,
    },
];

// ============================================
// MILESTONE EMAILS
// Celebrate progress, maintain momentum
// ============================================

export const MILESTONE_EMAILS: Record<string, BuyerRetentionEmail> = {
    module_1_complete: {
        id: "milestone_module_1",
        phase: "milestone",
        day: 0,
        delayHours: 0,
        subject: "Module 1 COMPLETE - you're already ahead",
        content: `{{firstName}},

You just completed Module 1.

Do you realize what that means?

You now understand more about this field than 95% of the population. You have the foundational knowledge that everything else builds on.

And here's what I want you to know: most people who buy courses never finish the first module. You already have.

That tells me something about you.

Module 2 is now unlocked. This is where it gets really good. You'll learn how to actually apply what you know to real situations.

Continue your training: {{courseUrl}}

Keep the momentum going, {{firstName}}. You're doing amazing.

${SARAH_SIGNATURE}

P.S. Quick tip: Students who complete Module 2 within 48 hours of Module 1 have the highest completion rates.`,
    },

    halfway_complete: {
        id: "milestone_halfway",
        phase: "milestone",
        day: 0,
        delayHours: 0,
        subject: "HALFWAY - you're ahead of 70% of students",
        content: `{{firstName}},

This is a big deal.

You just hit the halfway point in your certification.

I want to put this in perspective:

- 70% of online course buyers never finish Module 1
- 40% drop off by Module 3
- You're now in the top 30% of students

This isn't luck. This is discipline. This is commitment. This is who you are.

The finish line is closer than you think.

Keep going: {{courseUrl}}

${SARAH_SIGNATURE}

P.S. I see you showing up. You're exactly the kind of practitioner we love having.`,
    },

    course_complete: {
        id: "milestone_complete",
        phase: "milestone",
        day: 0,
        delayHours: 0,
        subject: "CONGRATULATIONS - You Did It!",
        content: `{{firstName}},

I don't have enough words.

YOU DID IT.

You completed {{courseName}}.

Do you understand how rare that is?

Less than 15% of people who start online courses finish them. You didn't just finish - you mastered the entire curriculum.

Here's what happens next:

1. YOUR CERTIFICATE IS READY
   Go claim it here: {{certificateUrl}}
   
2. ADD YOUR CREDENTIALS
   You can now add your certification to your name.
   
3. LINKEDIN BADGE
   Download your official badge and add it to your profile.

{{firstName}}, I'm genuinely proud of you.

This journey isn't easy. The material is dense. The commitment is real. And you showed up, lesson after lesson, until you finished.

That says everything about who you are.

Go claim your certificate: {{certificateUrl}}

Welcome to the certified practitioner community.

${SARAH_SIGNATURE}

P.S. This is just the beginning. There's so much more ahead.`,
    },

    certificate_claimed: {
        id: "milestone_certificate",
        phase: "milestone",
        day: 0,
        delayHours: 0,
        subject: "Your certificate is officially yours",
        content: `{{firstName}},

Your certificate is now official.

You are certified.

I want you to do something for me:

1. Print your certificate (or save the PDF somewhere visible)
2. Update your LinkedIn headline with your new credential
3. Tell ONE person in your life what you just accomplished

Why? Because external recognition reinforces internal belief.

The more you OWN this credential, the more confident you'll feel when you start talking to clients.

You're the real deal now.

${SARAH_SIGNATURE}`,
    },
};

// ============================================
// ENGAGEMENT REMINDERS
// For stalled/inactive buyers
// ============================================

export const REMINDER_EMAILS: Record<string, BuyerRetentionEmail & { triggerDays: number; preventTag: string }> = {
    no_login_7d: {
        id: "reminder_7d",
        phase: "reminder",
        day: 7,
        delayHours: 0,
        triggerDays: 7,
        preventTag: "reminder_7d_sent",
        subject: "Your course is waiting...",
        content: `{{firstName}},

I noticed you haven't logged in to {{courseName}} in a while.

Is everything okay?

I'm not going to guilt you - I know life gets crazy. But I also know you invested in this for a reason. And whatever that reason was, it's still valid.

Can I help with anything?

- Confused about where to start? Reply and I'll point you in the right direction.
- Feeling overwhelmed? I can help you create a realistic schedule.
- Technical issues? My team will fix it immediately.

Your course is here, waiting: {{dashboardUrl}}

Just one lesson today. That's all I'm asking.

${SARAH_SIGNATURE}`,
    },

    no_progress_14d: {
        id: "reminder_14d",
        phase: "reminder",
        day: 14,
        delayHours: 0,
        triggerDays: 14,
        preventTag: "reminder_14d_sent",
        subject: "I noticed you haven't continued...",
        content: `{{firstName}},

It's been 2 weeks since you made progress in your certification.

I'm reaching out because I care.

Here's the truth: every day that passes makes it harder to restart. The excitement fades. The urgency disappears. And before you know it, you're one of those people who "bought a course but never finished it."

That's not you.

You invested in this because you wanted something different. A new skill. A new career. A new way to help people.

That's still possible.

Here's my challenge: log in today and complete just ONE lesson.

Not the whole module. Just one lesson.

Login here: {{dashboardUrl}}

I'm rooting for you.

${SARAH_SIGNATURE}

P.S. If something specific is blocking you - reply and tell me what it is. I read every email personally.`,
    },

    stalled_30d: {
        id: "reminder_30d",
        phase: "reminder",
        day: 30,
        delayHours: 0,
        triggerDays: 30,
        preventTag: "reminder_30d_sent",
        subject: "Honest question for you...",
        content: `{{firstName}},

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

${SARAH_SIGNATURE}`,
    },

    dormant_45d: {
        id: "reminder_45d",
        phase: "reminder",
        day: 45,
        delayHours: 0,
        triggerDays: 45,
        preventTag: "reminder_45d_sent",
        subject: "Your enrollment status",
        content: `{{firstName}},

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

Login now: {{dashboardUrl}}

I know this sounds like "fake urgency." It's not. We genuinely can't support students who aren't engaged - it takes resources away from those who are.

Please log in.

${SARAH_SIGNATURE}`,
    },
};

// ============================================
// HELPER: Fill template variables
// ============================================

export function fillEmailTemplate(
    template: BuyerRetentionEmail,
    context: CourseContext
): { subject: string; content: string } {
    const replaceVars = (text: string): string => {
        return text
            .replace(/\{\{firstName\}\}/g, context.firstName)
            .replace(/\{\{email\}\}/g, context.email || '')
            .replace(/\{\{courseName\}\}/g, context.courseName)
            .replace(/\{\{courseUrl\}\}/g, context.courseUrl)
            .replace(/\{\{dashboardUrl\}\}/g, context.dashboardUrl)
            .replace(/\{\{certificateUrl\}\}/g, context.certificateUrl || 'https://learn.accredipro.academy/certificates')
            .replace(/\{\{deadline\}\}/g, context.deadline || '7 days');
    };

    return {
        subject: replaceVars(template.subject),
        content: replaceVars(template.content),
    };
}

// ============================================
// COURSE CONFIG MAP
// Returns course-specific URLs and names
// ============================================

export const COURSE_CONFIGS: Record<string, Omit<CourseContext, 'firstName' | 'email'>> = {
    "functional-medicine-complete-certification": {
        courseName: "Functional Medicine Certification",
        courseUrl: "https://learn.accredipro.academy/courses/functional-medicine-complete-certification",
        dashboardUrl: "https://learn.accredipro.academy/dashboard",
        certificateUrl: "https://learn.accredipro.academy/certificates",
    },
    "holistic-nutrition-coach-certification": {
        courseName: "Holistic Nutrition Coach Certification",
        courseUrl: "https://learn.accredipro.academy/courses/holistic-nutrition-coach-certification",
        dashboardUrl: "https://learn.accredipro.academy/dashboard",
        certificateUrl: "https://learn.accredipro.academy/certificates",
    },
    "womens-hormone-health-coach-certification": {
        courseName: "Women's Hormone Health Coach Certification",
        courseUrl: "https://learn.accredipro.academy/courses/womens-hormone-health-coach-certification",
        dashboardUrl: "https://learn.accredipro.academy/dashboard",
        certificateUrl: "https://learn.accredipro.academy/certificates",
    },
    "gut-health-microbiome-coach-certification": {
        courseName: "Gut Health & Microbiome Coach Certification",
        courseUrl: "https://learn.accredipro.academy/courses/gut-health-microbiome-coach-certification",
        dashboardUrl: "https://learn.accredipro.academy/dashboard",
        certificateUrl: "https://learn.accredipro.academy/certificates",
    },
    // Add more courses as needed...
};

// Get course context with fallback
export function getCourseContext(courseSlug: string, firstName: string, email?: string): CourseContext {
    const config = COURSE_CONFIGS[courseSlug] || {
        courseName: "Your Certification",
        courseUrl: `https://learn.accredipro.academy/courses/${courseSlug}`,
        dashboardUrl: "https://learn.accredipro.academy/dashboard",
        certificateUrl: "https://learn.accredipro.academy/certificates",
    };

    return {
        firstName,
        email,
        ...config,
    };
}
