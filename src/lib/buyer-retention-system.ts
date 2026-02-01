/**
 * MAXIMUM BUYER RETENTION SYSTEM v2.0
 * 
 * Hormozi-style engagement with warm copy for 35/40+ women
 * ~25 unique email triggers covering ALL scenarios
 * 
 * SEQUENCES:
 * 1. SPRINT (Day 0-5) - Everyone gets, push to start
 * 2. RECOVERY (Day 3-30) - No login at all
 * 3. STALLED (Day 3-14) - Login but no progress
 * 4. MILESTONE - Celebrate completion achievements
 * 5. RE-ENGAGEMENT - Welcome back after absence
 */

// ============================================
// TYPES
// ============================================

export interface BuyerRetentionEmail {
    id: string;
    sequence: 'sprint' | 'recovery' | 'stalled' | 'milestone' | 'reengagement';
    trigger: string;
    delayHours: number;
    subject: string;
    content: string;
    preventTag?: string;
}

// ============================================
// TEMPLATE HELPERS
// ============================================

export function fillTemplateVariables(content: string, vars: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
}

// ============================================
// SIGNATURE - Simple for Primary Inbox
// ============================================

const SARAH = `Sarah`;

// ============================================
// BRANDED HTML WRAPPER - Subtle Professional Footer
// ============================================

export function wrapInBrandedTemplate(content: string, vars: { firstName: string; dashboardUrl: string }): string {
    // Convert plain text line breaks to HTML
    const htmlContent = content
        .replace(/\n\n/g, '</p><p style="margin: 0 0 16px 0;">')
        .replace(/\n/g, '<br>');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1f2937;">
                                ${htmlContent}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <img src="https://learn.accredipro.academy/ASI_LOGO-removebg-preview.png" alt="AccrediPro Academy" style="height: 64px; width: auto; margin: 0 auto 12px auto; display: block;" />
                                        <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280;">
                                            Professional Certification Programs
                                        </p>
                                        <p style="margin: 0; font-size: 12px;">
                                            <a href="${vars.dashboardUrl}" style="color: #7c3aed; text-decoration: none;">Access Your Dashboard</a>
                                            <span style="color: #d1d5db; margin: 0 8px;">|</span>
                                            <span style="color: #9ca3af;">Questions? Just reply to this email</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                
                <!-- Unsubscribe -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <tr>
                        <td style="padding: 16px; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 11px; color: #9ca3af;">
                                AccrediPro Academy • 45 Rockefeller Plaza, New York, NY 10111
                            </p>
                            <p style="margin: 0; font-size: 11px;">
                                <a href="https://learn.accredipro.academy/unsubscribe" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
                                <span style="color: #d1d5db; margin: 0 4px;">•</span>
                                <a href="https://learn.accredipro.academy/preferences" style="color: #9ca3af; text-decoration: underline;">Email Preferences</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ============================================
// 1. SPRINT SEQUENCE (Everyone gets these)
// Push them to start within 72 hours
// ============================================

export const SPRINT_SEQUENCE: BuyerRetentionEmail[] = [
    {
        id: "sprint_0h",
        sequence: "sprint",
        trigger: "purchase",
        delayHours: 0,
        subject: "Re: your access is ready",
        content: `{{firstName}},

You're in! I'm so excited for you.

Your course is ready and waiting for you.

When you get a chance, log in and check out the first lesson. Most people finish it in about 15 minutes - it's a great way to get started.

Here's your dashboard: {{dashboardUrl}}

I'll be here if you need anything. Just hit reply anytime.

Welcome to the community!

${SARAH}`,
    },
    {
        id: "sprint_2h",
        sequence: "sprint",
        trigger: "auto",
        delayHours: 2,
        subject: "Re: quick hello",
        content: `{{firstName}},

Just wanted to pop in and say hi!

Did you get a chance to check out your course yet? No rush at all - just curious how things are going.

If you have any questions about where to start, I'm here.

${SARAH}`,
    },
    {
        id: "sprint_day1",
        sequence: "sprint",
        trigger: "auto",
        delayHours: 24,
        subject: "Re: thinking about you",
        content: `{{firstName}},

Good morning!

I was just thinking about you and wanted to check in. How's everything going?

The first lesson is waiting whenever you're ready. It covers some really beautiful foundational concepts that I think you'll love.

No pressure - just excited for you to experience it.

${SARAH}`,
    },
    {
        id: "sprint_day2",
        sequence: "sprint",
        trigger: "auto",
        delayHours: 48,
        subject: "Re: a little something",
        content: `{{firstName}},

Hey there!

I hope you're having a good week so far.

If you've started the course - amazing! I'd love to hear what you think.

If you haven't had a chance yet - totally okay. Life happens. Your course isn't going anywhere.

Just wanted you to know I'm thinking of you.

${SARAH}`,
    },
    {
        id: "sprint_day3",
        sequence: "sprint",
        trigger: "auto",
        delayHours: 72,
        subject: "Re: one thing I've noticed",
        content: `{{firstName}},

I've noticed something interesting over the years.

The students who end up absolutely loving this journey? They often start with just one small step.

Not the whole course. Not even a whole module. Just one lesson.

There's something magical about taking that first step. Everything feels more real after that.

Whenever you're ready: {{dashboardUrl}}

Cheering you on!

${SARAH}`,
    },
    {
        id: "sprint_day5",
        sequence: "sprint",
        trigger: "auto",
        delayHours: 120,
        subject: "Re: before the weekend",
        content: `{{firstName}},

Hey! Hope you have something nice planned for the weekend.

Just wanted to send you a little note before things get busy.

If you get a quiet moment this weekend, the first lesson would be perfect for a cozy morning with coffee. Just a thought!

Either way, I hope you have a wonderful few days.

${SARAH}`,
    },
];

// ============================================
// 2. RECOVERY SEQUENCE (No login at all)
// Warm outreach for people who never logged in
// ============================================

export const RECOVERY_SEQUENCE: BuyerRetentionEmail[] = [
    {
        id: "recovery_3d",
        sequence: "recovery",
        trigger: "no_login_3d",
        delayHours: 72,
        preventTag: "recovery_3d_sent",
        subject: "Re: everything okay?",
        content: `{{firstName}},

Hey, I just wanted to check - is everything okay?

I noticed you haven't had a chance to log in yet, and I wanted to make sure nothing went wrong on our end.

Sometimes emails land in spam, or links don't work, or life just gets crazy busy. Totally normal!

If you're having any trouble at all, just reply to this email. I'm here to help.

Your course is waiting here: {{dashboardUrl}}

${SARAH}`,
    },
    {
        id: "recovery_5d",
        sequence: "recovery",
        trigger: "no_login_5d",
        delayHours: 120,
        preventTag: "recovery_5d_sent",
        subject: "Re: here for you",
        content: `{{firstName}},

I hope you're doing well!

I wanted to let you know - there's no timeline or pressure here. Your course is yours, and it'll be ready whenever the time feels right for you.

Some people dive in right away. Some wait for a quieter season. Both are totally valid.

If there's anything I can do to make getting started easier, I'd love to help. Just hit reply.

Thinking of you!

${SARAH}`,
    },
    {
        id: "recovery_7d",
        sequence: "recovery",
        trigger: "no_login_7d",
        delayHours: 168,
        preventTag: "recovery_7d_sent",
        subject: "Re: thinking of you",
        content: `{{firstName}},

Just a little note to say I'm thinking of you.

I know life can pull us in a million directions. Work, family, everything in between.

I just wanted you to know - you're not forgotten here. Your spot is saved. Your course is ready. And I'm still cheering you on, even from the sidelines.

Whenever you're ready, I'll be here.

With warmth,

${SARAH}`,
    },
    {
        id: "recovery_14d",
        sequence: "recovery",
        trigger: "no_login_14d",
        delayHours: 336,
        preventTag: "recovery_14d_sent",
        subject: "Re: still here for you",
        content: `{{firstName}},

Hi there!

It's been a couple of weeks, and I just wanted to send you a little hello.

I'm not going anywhere, and neither is your course. Everything is saved and waiting.

If you ever want to chat about where to start, or if something is making it hard to begin, I'm just an email away. No judgment, just support.

Wishing you all the best.

${SARAH}`,
    },
    {
        id: "recovery_30d",
        sequence: "recovery",
        trigger: "no_login_30d",
        delayHours: 720,
        preventTag: "recovery_30d_sent",
        subject: "Re: sending love your way",
        content: `{{firstName}},

Hi love,

It's been about a month, and I wanted to reach out one more time.

I think about the women in our community all the time - including you, even if we haven't connected much yet.

I don't know what's happening in your world right now, but I hope you're taking care of yourself. Whatever you're dealing with - you've got this.

Your course will always be here. And so will I.

Sending you so much love today.

${SARAH}`,
    },
];

// ============================================
// 3. STALLED SEQUENCE (Login but no progress)
// For people who signed in but didn't complete anything
// ============================================

export const STALLED_SEQUENCE: BuyerRetentionEmail[] = [
    {
        id: "stalled_3d",
        sequence: "stalled",
        trigger: "login_no_progress_3d",
        delayHours: 72,
        preventTag: "stalled_3d_sent",
        subject: "Re: can I help?",
        content: `{{firstName}},

I saw you logged in - yay! That's a great first step.

I wanted to check in because I know sometimes getting started can feel... big. Like, where do you even begin?

If you're feeling stuck or overwhelmed, I totally get it. Here's my suggestion: just start with Lesson 1. Don't think about the whole course. Just one lesson.

If something specific is blocking you, hit reply and tell me. I love problem-solving!

${SARAH}`,
    },
    {
        id: "stalled_5d",
        sequence: "stalled",
        trigger: "login_no_progress_5d",
        delayHours: 120,
        preventTag: "stalled_5d_sent",
        subject: "Re: stuck on something?",
        content: `{{firstName}},

Just checking in again!

I wanted to see if there's anything that's making it hard to get started. Sometimes it's technical stuff, sometimes it's feeling overwhelmed, sometimes it's just... life.

Whatever it is, I've probably seen it before and can help.

What would make this easier for you? I'm all ears.

${SARAH}`,
    },
    {
        id: "stalled_7d",
        sequence: "stalled",
        trigger: "login_no_progress_7d",
        delayHours: 168,
        preventTag: "stalled_7d_sent",
        subject: "Re: no pressure",
        content: `{{firstName}},

Hey there!

I wanted to pop in and say - there's zero pressure from me. Truly.

Some people start right away. Some take their time. There's no wrong way to do this.

I just want you to know that whenever the moment feels right, everything is ready for you. And if you need any support, I'm here.

You've got this, on your own timeline.

${SARAH}`,
    },
    {
        id: "stalled_14d",
        sequence: "stalled",
        trigger: "login_no_progress_14d",
        delayHours: 336,
        preventTag: "stalled_14d_sent",
        subject: "Re: whenever you're ready",
        content: `{{firstName}},

Just a gentle hello!

I know you peeked into the course a while back. I just wanted to let you know - your progress is saved, your spot is secure, and nothing has changed.

Whenever the timing feels right, you can pick right up where you left off.

No rush. No pressure. Just possibility.

Thinking of you!

${SARAH}`,
    },
];

// ============================================
// 4. MILESTONE SEQUENCE (Celebrate achievements)
// Sent when they complete key milestones
// ============================================

export const MILESTONE_EMAILS: Record<string, BuyerRetentionEmail> = {
    module_1_complete: {
        id: "milestone_module1",
        sequence: "milestone",
        trigger: "module_1_complete",
        delayHours: 0,
        subject: "Re: you did it!",
        content: `{{firstName}},

You just finished Module 1!

I'm so proud of you. Seriously. Taking that first step is often the hardest part, and you did it.

How are you feeling? I'd love to know what stood out to you most.

The momentum you've built is real. Module 2 is just as good - I can't wait for you to experience it.

But for now, just celebrate this win. You earned it!

${SARAH}`,
    },

    progress_25: {
        id: "milestone_25",
        sequence: "milestone",
        trigger: "progress_25_percent",
        delayHours: 0,
        subject: "Re: look how far you've come",
        content: `{{firstName}},

Quarter of the way there!

You're making amazing progress, and I wanted to take a moment to celebrate that.

Do you remember how it felt when you first started? Look at you now - concepts are clicking, things are making sense, and you're building real knowledge.

Keep going! But also, take a breath and appreciate how far you've come.

So proud of you!

${SARAH}`,
    },

    progress_50: {
        id: "milestone_50",
        sequence: "milestone",
        trigger: "progress_50_percent",
        delayHours: 0,
        subject: "Re: halfway there!",
        content: `{{firstName}},

You're at the halfway point!

This is a big deal. A lot of people never make it this far in any course. But here you are - consistent, committed, and doing the work.

I'm genuinely so excited for what's ahead of you. The second half builds on everything you've learned, and it's where things really start to click.

You're doing incredible.

${SARAH}`,
    },

    progress_90: {
        id: "milestone_90",
        sequence: "milestone",
        trigger: "progress_90_percent",
        delayHours: 0,
        subject: "Re: almost at the finish line",
        content: `{{firstName}},

You're so close!

90% complete. I can barely contain my excitement for you.

The finish line is right there. A few more lessons and you'll have done something most people only dream about.

You've put in the work. Now let's finish this thing.

I'll be here cheering when you cross that finish line!

${SARAH}`,
    },

    completion: {
        id: "milestone_complete",
        sequence: "milestone",
        trigger: "course_complete",
        delayHours: 0,
        subject: "Re: congratulations!",
        content: `{{firstName}},

YOU DID IT!

I am SO incredibly proud of you. You just completed the entire certification.

Think about where you started. Think about every lesson, every concept, every moment of growth. You did all of that.

This isn't just a certificate - it's proof that you follow through. That you invest in yourself. That you finish what you start.

Your certificate will be in your dashboard soon.

But more importantly - you're now part of something bigger. A community of practitioners who are making a real difference in people's lives.

Welcome to the next chapter.

With so much love and pride,

${SARAH}`,
    },
};

// ============================================
// 5. RE-ENGAGEMENT (Welcome back!)
// For students who return after being away
// ============================================

export const REENGAGEMENT_EMAILS: Record<string, BuyerRetentionEmail> = {
    return_after_7d: {
        id: "reengagement_7d",
        sequence: "reengagement",
        trigger: "return_after_7d_absence",
        delayHours: 0,
        subject: "Re: so good to see you back!",
        content: `{{firstName}},

You're back!

I noticed you logged in today, and it made me smile. Welcome back!

Life has a way of pulling us in different directions sometimes. But here you are, showing up for yourself again.

Everything is right where you left it. Your progress is saved. You can pick up whenever you're ready.

If you need any help getting re-oriented, just reply to this email. I'm here!

So glad to have you back.

${SARAH}`,
    },
};

// ============================================
// ALL SEQUENCES COMBINED (for cron job)
// ============================================

export const ALL_BUYER_EMAILS = {
    sprint: SPRINT_SEQUENCE,
    recovery: RECOVERY_SEQUENCE,
    stalled: STALLED_SEQUENCE,
    milestone: MILESTONE_EMAILS,
    reengagement: REENGAGEMENT_EMAILS,
};

// ============================================
// TRIGGER CONDITIONS (for cron job logic)
// ============================================

export const TRIGGER_CONDITIONS = {
    // Recovery: No login at all
    no_login_3d: { condition: 'never_logged_in', days: 3 },
    no_login_5d: { condition: 'never_logged_in', days: 5 },
    no_login_7d: { condition: 'never_logged_in', days: 7 },
    no_login_14d: { condition: 'never_logged_in', days: 14 },
    no_login_30d: { condition: 'never_logged_in', days: 30 },

    // Stalled: Login but no progress
    login_no_progress_3d: { condition: 'logged_in_no_progress', days: 3 },
    login_no_progress_5d: { condition: 'logged_in_no_progress', days: 5 },
    login_no_progress_7d: { condition: 'logged_in_no_progress', days: 7 },
    login_no_progress_14d: { condition: 'logged_in_no_progress', days: 14 },

    // Milestone: Percentage complete
    module_1_complete: { condition: 'module_complete', module: 1 },
    progress_25_percent: { condition: 'progress_percent', percent: 25 },
    progress_50_percent: { condition: 'progress_percent', percent: 50 },
    progress_90_percent: { condition: 'progress_percent', percent: 90 },
    course_complete: { condition: 'progress_percent', percent: 100 },

    // Re-engagement
    return_after_7d_absence: { condition: 'returned_after_absence', days: 7 },
};
