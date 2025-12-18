/**
 * Recovery Email Templates - SINGLE SOURCE OF TRUTH
 * 
 * 9 Re-engagement emails across 3 sequences:
 * 1. Never Logged In (1A, 1B, 1C) - Days 1, 3, 7
 * 2. Never Started (2A, 2B, 2C) - Days 2, 5, 10
 * 3. Abandoned Learning (3A, 3B, 3C) - Days 7, 14, 21
 * 
 * All follow Sarah's personal, conversational tone.
 */

// ==================== SEQUENCE 1: NEVER LOGGED IN ====================
// Trigger: User registered but hasn't logged in yet

export const NEVER_LOGGED_IN_EMAILS = [
    // 1A - Day 1: Friendly reminder
    {
        order: 0,
        subject: "Re: did you see this? (your access)",
        delayDays: 1,
        delayHours: 0,
        content: `{{firstName}},

Quick check-in.

I noticed you signed up for your free Mini Diploma in Functional Medicine, but I don't see you in the platform yet.

<strong>Your access is ready and waiting.</strong>

I know life gets busy. Things fall through the cracks. But I wanted to make sure you didn't miss this.

Here's why it matters:

The Mini Diploma isn't just another freebie. It's actual training - the same foundational content our certified practitioners learned. And you'll earn a real credential at the end.

<strong>It takes about 20 minutes to complete the first lesson.</strong>

Just log in when you have a moment: https://learn.accredipro.academy

If you're having any trouble accessing your account, just reply to this email. I'll help you get sorted.

Sarah

P.S. I also left you a personal voice message inside the platform. I think you'll like it.`,
    },

    // 1B - Day 3: Curiosity hook
    {
        order: 1,
        subject: "Re: quick question about your Mini Diploma",
        delayDays: 3,
        delayHours: 0,
        content: `{{firstName}},

Can I ask you something?

What made you sign up for the Mini Diploma in the first place?

Was it curiosity about functional medicine? A feeling that you could be doing more with your career? A personal health journey that sparked something?

<strong>I'm genuinely curious.</strong> Because whatever brought you here - it matters.

And I want to make sure nothing's standing in your way.

<strong>Common reasons people don't log in:</strong>

- "I'm not sure I have time" → The first lesson takes 20 minutes
- "I'm not sure I'm qualified" → You don't need any background - we start from scratch
- "I'm afraid I'll get overwhelmed" → We break everything into small, digestible pieces
- "I forgot my password" → Easy fix - just reply and I'll help

<strong>If none of those apply, tell me what's really going on.</strong> I read every reply.

Your access is still waiting: https://learn.accredipro.academy

Sarah

P.S. No pressure. Just checking in because I care about the people who signed up.`,
    },

    // 1C - Day 7: Urgency
    {
        order: 2,
        subject: "Re: last chance to activate your access",
        delayDays: 7,
        delayHours: 0,
        content: `{{firstName}},

I'll be honest with you.

<strong>You've had access to your Mini Diploma for a week now, and you haven't logged in once.</strong>

I'm not saying this to guilt you. I'm saying it because I've seen this pattern before.

People sign up with good intentions. Life gets in the way. The login email gets buried. Days become weeks. Weeks become months.

And that spark that made you curious about functional medicine? It fades.

<strong>I don't want that for you.</strong>

Here's what I know about the people who do log in:

- 85% of them finish the first lesson in one sitting
- Most of them message me afterward saying "I wish I'd started sooner"
- Many of them go on to become certified practitioners

<strong>You're one login away from joining them.</strong>

This is my last reminder, {{firstName}}. After this, I have to assume you're not interested.

But if you are interested - even a little - please just log in. Start Lesson 1. See how you feel.

Your access link: https://learn.accredipro.academy

Still here if you need anything.

Sarah

P.S. If something's holding you back that I haven't addressed, please reply and tell me. I want to help.`,
    },
];

// ==================== SEQUENCE 2: NEVER STARTED LEARNING ====================
// Trigger: User logged in but has 0% progress

export const NEVER_STARTED_EMAILS = [
    // 2A - Day 2: Remove friction
    {
        order: 0,
        subject: "Re: the first lesson takes 5 minutes",
        delayDays: 2,
        delayHours: 0,
        content: `{{firstName}},

I see you logged in. That's great!

But I noticed you haven't started your first lesson yet.

<strong>Can I let you in on a secret?</strong>

The first lesson takes about 5 minutes. Seriously. It's designed to be quick and engaging - just enough to give you a taste of what functional medicine is really about.

Most people finish it and immediately want more.

<strong>Here's what you'll learn in Lesson 1:</strong>

- Why "eat better and exercise" doesn't work for most people
- The single biggest thing the medical system gets wrong
- What functional medicine does differently

No pressure. No overwhelm. Just 5 minutes.

Start Lesson 1: https://learn.accredipro.academy/my-mini-diploma

I'll be checking in to see how it went.

Sarah

P.S. If you're already overwhelmed with other things in life, I get it. Just bookmark this email and come back when you have a quiet moment.`,
    },

    // 2B - Day 5: Social proof
    {
        order: 1,
        subject: "Re: most people start here...",
        delayDays: 5,
        delayHours: 0,
        content: `{{firstName}},

Want to know what most people tell me after they complete their Mini Diploma?

<strong>"I can't believe I almost didn't start."</strong>

I hear it all the time. People who procrastinated for days, weeks, sometimes months - finally started, and immediately wondered why they waited.

<strong>Here's what Jennifer said last week:</strong>

"Sarah, I kept putting it off because I thought I needed a medical background. Turns out, I didn't need anything except curiosity. The first lesson hooked me, and I finished the whole thing in one weekend. Best decision I made all year."

<strong>Jennifer didn't have a medical background.</strong> She was a yoga teacher who wanted to offer more to her clients.

Whatever your background is, {{firstName}} - it's enough. You don't need to be a doctor. You don't need a science degree. You just need to start.

The first lesson is waiting for you: https://learn.accredipro.academy/my-mini-diploma

Start today. Future you will thank you.

Sarah

P.S. Jennifer is now a certified practitioner earning $4,200/month doing what she loves. It all started with that first lesson.`,
    },

    // 2C - Day 10: Direct question
    {
        order: 2,
        subject: "Re: still interested in functional medicine?",
        delayDays: 10,
        delayHours: 0,
        content: `{{firstName}},

I want to ask you directly:

<strong>Are you still interested in functional medicine?</strong>

It's okay if the answer is no. Life changes. Priorities shift. Maybe this isn't the right time for you.

But if the answer is yes - even a "maybe yes" - I need you to know something:

<strong>You've had access to free training for 10 days and haven't started.</strong>

I'm not judging. I'm just being honest. Because I've seen what happens when people keep putting things off:

- The curiosity fades
- The access expires
- Another year goes by
- Nothing changes

<strong>If you're still curious, please just start.</strong>

One lesson. Five minutes. See how you feel.

If functional medicine isn't for you, you'll know. And you can close this chapter knowing you tried.

But if it IS for you? You might be starting something that changes your entire life.

Start your first lesson: https://learn.accredipro.academy/my-mini-diploma

This is my last check-in, {{firstName}}. I hope I see you inside.

Sarah

P.S. If something specific is holding you back, reply and tell me. Sometimes talking about it helps.`,
    },
];

// ==================== SEQUENCE 3: ABANDONED LEARNING ====================
// Trigger: User started but stopped (no activity for X days)

export const ABANDONED_LEARNING_EMAILS = [
    // 3A - Day 7: Personal check-in
    {
        order: 0,
        subject: "Re: noticed you haven't been back",
        delayDays: 7,
        delayHours: 0,
        content: `{{firstName}},

I noticed something and wanted to check in.

<strong>You started your Mini Diploma - which is amazing! - but you haven't been back in about a week.</strong>

Is everything okay?

I'm not asking to pressure you. I'm asking because I genuinely care what happens to the people in my community.

<strong>Here are the most common reasons people pause:</strong>

1. <strong>Life got busy</strong> → Totally normal. The lessons will be here when you're ready.

2. <strong>Something confused you</strong> → Reply and tell me. I can explain it differently.

3. <strong>You're not sure if this is right for you</strong> → That's what the Mini Diploma is for - to help you decide.

4. <strong>You feel overwhelmed</strong> → The lessons are short. Just do one at a time.

<strong>Whatever the reason, it's valid.</strong>

But I want you to know: you were making progress. You were learning something valuable. And you were heading somewhere good.

Don't let one busy week turn into weeks, then months, then never.

Pick up where you left off: https://learn.accredipro.academy/my-mini-diploma

I'm here if you need anything.

Sarah

P.S. The platform saves your progress. You won't lose anything - just log back in and continue.`,
    },

    // 3B - Day 14: Remind of progress
    {
        order: 1,
        subject: "Re: where did you leave off?",
        delayDays: 14,
        delayHours: 0,
        content: `{{firstName}},

Two weeks ago, you were learning about functional medicine.

<strong>You were making progress. You were curious. You were moving forward.</strong>

What happened?

I ask because I've been where you are. I've started things with good intentions, gotten distracted, and watched weeks slip by.

<strong>Here's what I learned:</strong>

The longer you wait, the harder it is to start again. Not because the content gets harder - but because the momentum fades.

Right now, you still remember what you learned. You still have that spark of curiosity.

<strong>If you wait another two weeks?</strong> You'll have to start over from the beginning. Not technically - but mentally. The connection will be lost.

<strong>So here's what I want you to do:</strong>

Log in today. Just for 10 minutes. Pick up where you left off.

You don't have to finish the whole thing. Just reconnect with what you started.

Continue your Mini Diploma: https://learn.accredipro.academy/my-mini-diploma

Your progress is still there. Your lessons are still waiting. And that credential is still within reach.

Don't let two weeks become two months.

Sarah

P.S. Fun fact: the people who come back after a break often tell me they're MORE motivated than before. Sometimes you just need to step away and come back fresh.`,
    },

    // 3C - Day 21: Final message
    {
        order: 2,
        subject: "Re: your Mini Diploma is waiting",
        delayDays: 21,
        delayHours: 0,
        content: `{{firstName}},

This is my last email about your Mini Diploma.

<strong>Three weeks ago, you started something important.</strong>

You took the time to sign up. You logged in. You began learning about functional medicine. You were on your way to earning a real credential.

And then... life happened. Or something else. I don't know what.

<strong>But I do know this:</strong>

Your Mini Diploma is still waiting for you. Your progress is saved. The lessons haven't changed. The credential is still there.

<strong>The only thing missing is you.</strong>

I'm not going to guilt you into finishing. That's not how I operate. But I am going to tell you the truth:

Every week that passes, it gets harder to come back. The spark fades. The intention weakens. The "someday" becomes "never."

<strong>If functional medicine is something you want to explore - even a little bit - please don't let this be another thing you meant to do but didn't.</strong>

Finish what you started: https://learn.accredipro.academy/my-mini-diploma

You were closer than you think.

Still believing in you,

Sarah

P.S. If you've decided this isn't for you, that's completely okay. I just wanted to make sure you had every chance to finish what you started. Whatever you choose, I wish you well.`,
    },
];

// Combined export for easy access
export const RECOVERY_EMAILS = {
    neverLoggedIn: NEVER_LOGGED_IN_EMAILS,
    neverStarted: NEVER_STARTED_EMAILS,
    abandonedLearning: ABANDONED_LEARNING_EMAILS,
};

export type RecoveryEmail = typeof NEVER_LOGGED_IN_EMAILS[number];
