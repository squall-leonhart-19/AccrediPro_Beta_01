// Pre-Completion Pod Messages - Triggered by Lesson Progress (MILESTONE ONLY)
// These messages appear in the Circle Pod DURING the lesson phase (before exam)
// Goal: Bonding, social proof, completion motivation
// NOTE: Only milestone triggers to avoid spam (opt-in, L3, L5, L9, exam_passed + nudges)

export interface PreCompletionMessage {
    trigger: "optin" | "lesson_complete" | "exam_passed" | "never_logged" | "never_started" | "stuck_progress" | "exam_waiting" | "deadline_24h" | "deadline_6h" | "deadline_1h";
    lesson?: number;
    hoursAfterOptin?: number;
    hoursNoProgress?: number;
    hoursAfterLesson9?: number;
    hoursRemaining?: number;
    sarah: string;
    zombies: Array<{
        delay: string;
        options: string[];
    }>;
}

export const preCompletionMessages: PreCompletionMessage[] = [
    // ============ WELCOME (On Opt-in) - RETROACTIVE ============
    {
        trigger: "optin",
        lesson: 0,
        sarah: `🎉 Welcome to Cohort #47, {firstName}!

I'm Sarah Mitchell, your guide for the next 48 hours.

You've just joined something special - a small group of women who are serious about building a health coaching career.

Let's get to know each other! 

👋 Drop a quick intro below:
• Your name
• Where you're from  
• Why you're interested in functional medicine

I'll go first: I'm Sarah, 52, from Austin Texas. Former nurse who burnt out and found a better way. Now I help women like you do the same.

Your turn! And then... let's get started on Lesson 1! 💛

Sarah

P.S. - You have 48 hours to complete all 9 lessons + the exam. It's designed to be done in one focused sitting, but take breaks when you need them!`,
        zombies: [
            {
                delay: "retroactive-1h", options: [
                    "omg just joined too!! 🎉 I'm {zombieFirstName}, 48, from Ohio. Former ER nurse - 18 years. Burnt out so bad I collapsed at work. Found functional medicine when I was trying to fix my own thyroid issues. SO excited to be here!! who else is new?? 💕",
                ]
            },
            {
                delay: "retroactive-30min", options: [
                    "Hi Sarah!! I'm so nervous but excited too 🥹 Cant believe were actually doing this. Ive been thinking about getting certified for 2 years and finally just went for it. Anyone else feeling the same way??",
                ]
            },
        ]
    },

    // ============ LESSON 3 COMPLETE (33% MILESTONE) ============
    {
        trigger: "lesson_complete",
        lesson: 3,
        sarah: `🌟 ONE-THIRD COMPLETE!

{firstName}, you're making incredible progress.

3 lessons down. 6 to go. You're ahead of 80% of people who never even start.

The pricing lesson is next - it's one of my favorites. It changes how you think about money.

Keep that momentum!

Sarah 💛`,
        zombies: [
            {
                delay: "2min", options: [
                    "one third done!! 🙌 we're actually doing this @{firstName}!!",
                    "cant believe how fast this is going... thought it would take forever",
                ]
            },
            {
                delay: "8min", options: [
                    "the pricing lesson next 👀 I have so much money mindset stuff to work through honestly",
                    "just finished lesson 3! catching up to you @{firstName} 💪",
                ]
            },
        ]
    },

    // ============ LESSON 5 COMPLETE (HALFWAY - BIG MILESTONE) ============
    {
        trigger: "lesson_complete",
        lesson: 5,
        sarah: `🎉 HALFWAY POINT!

{firstName}, you're officially 5/9 lessons done!

Take a moment. Breathe. You're doing incredible.

This is usually where people quit. Not you. You're still here.

The back half is the FUN part - actually building your practice.

Quick breather, then → Lesson 6!

Sarah 💛`,
        zombies: [
            {
                delay: "2min", options: [
                    "HALFWAY!! @{firstName} we're doing it!! 😭💕",
                    "this is further than I got with any other course... actually finishing something for once lol",
                ]
            },
            {
                delay: "8min", options: [
                    "taking a 5 min break... coffee refill ☕ then pushing through!",
                    "the fact that were doing this together makes it so much easier honestly... would have quit alone",
                ]
            },
            {
                delay: "15min", options: [
                    "ok break over! lets gooo 💪",
                ]
            },
        ]
    },

    // ============ LESSON 9 COMPLETE (EXAM UNLOCKED) ============
    {
        trigger: "lesson_complete",
        lesson: 9,
        sarah: `🏆 ALL LESSONS COMPLETE!

{firstName}... you did it. Every single lesson. Done.

Your exam is now unlocked.

A few tips:
• 25 questions, multiple choice
• You need 80% to pass (20/25)
• No time limit - take your time
• You CAN retake if needed (but you won't need to 😉)

The exam is based on everything you learned. If you did the lessons, you'll pass.

I believe in you.

→ Take the exam when you're ready!

Sarah 💛`,
        zombies: [
            {
                delay: "1min", options: [
                    "IM SO NERVOUS 😭😭 but also ready??? @{firstName} are you going for the exam now??",
                ]
            },
            {
                delay: "8min", options: [
                    "ok taking a 10 min breather then doing the exam... need to calm my heart down lol",
                    "we did all the lessons so we know this stuff... we got this 💪",
                ]
            },
            {
                delay: "20min", options: [
                    "about to hit start on the exam... here we go 🙏",
                ]
            },
        ]
    },

    // ============ EXAM PASSED ============
    {
        trigger: "exam_passed",
        sarah: `🎉🎉🎉 {firstName}... YOU PASSED!!! 🎉🎉🎉

CONGRATULATIONS on completing your Mini-Diploma!

You are now CERTIFIED by the Accredited Standards Institute as a:

✨ FUNCTIONAL MEDICINE HEALTH COACH ✨

Your certificate is being generated and will be ready to download in your portal.

I am SO proud of you. You showed up. You did the work. You finished.

Take a moment to celebrate. Seriously. 

Tomorrow I'll share what comes next - how to actually BUILD your practice and start helping (and earning from) clients.

But for now... CELEBRATE! 🎉

With so much pride,
Sarah 💛`,
        zombies: [
            {
                delay: "30sec", options: [
                    "I PASSED TOO OMG 😭😭😭 @{firstName} WE DID IT!!! WERE CERTIFIED!!!",
                ]
            },
            {
                delay: "5min", options: [
                    "literally crying right now... never thought Id actually finish something like this 🥹💕",
                    "WE'RE OFFICIALLY FUNCTIONAL MEDICINE HEALTH COACHES!! this is REAL!!",
                ]
            },
            {
                delay: "15min", options: [
                    "just told my family... they're so proud 😭 my daughter said 'mom you actually did it!'",
                    "screenshot-ing my certificate the SECOND it's ready... this is going on my wall 🙌",
                ]
            },
            {
                delay: "30min", options: [
                    "cant stop smiling... Cohort #47 forever!! @{firstName} we made it together 💕",
                ]
            },
        ]
    },

    // ============ NUDGE: NEVER LOGGED IN (6h after opt-in) ============
    {
        trigger: "never_logged",
        hoursAfterOptin: 6,
        sarah: `Hey {firstName}! 👋

I noticed you signed up but haven't started your lessons yet.

Everything okay? 

Your 48-hour access window is ticking, and I really don't want you to miss out on getting certified.

Just click the link in your welcome email to get started. Lesson 1 takes about 10 minutes!

I'm here if you have any questions.

Sarah 💛`,
        zombies: [
            {
                delay: "15min", options: [
                    "hey @{firstName}!! did you get the email with the login?? I almost missed it in my spam folder 😅",
                    "girl come join us!! Im on lesson 4 already and its so good 💕",
                ]
            },
        ]
    },

    // ============ NUDGE: STUCK MID-LESSONS (12h no progress) ============
    {
        trigger: "stuck_progress",
        hoursNoProgress: 12,
        sarah: `Hey {firstName}! 👋

Just checking in - you were doing so well with the lessons!

Did something come up?

If you're feeling stuck or overwhelmed, reply to this message. I'm here to help.

Remember: Progress > Perfection. You don't have to be perfect, you just have to keep going.

One more lesson. That's all. Can you do one more?

With you,
Sarah 💛`,
        zombies: [
            {
                delay: "20min", options: [
                    "hey @{firstName} you doing okay?? miss you in here 💕 lets finish this together!",
                    "girl I know life gets crazy but DONT GIVE UP!! youre so close. one lesson at a time 🙌",
                ]
            },
        ]
    },

    // ============ NUDGE: 24h LEFT ============
    {
        trigger: "deadline_24h",
        hoursRemaining: 24,
        sarah: `⏰ {firstName}, important reminder...

You have 24 hours left in your access window.

I don't want you to lose this opportunity. You signed up for a reason.

If life got in the way and you need more time, just reply to this message. I'll extend your access.

But if you CAN finish today... let's do it!

Finish what you started 💪

Sarah 💛`,
        zombies: [
            {
                delay: "15min", options: [
                    "@{firstName} 24 hours left!! come on we can do this together 💕",
                    "dont let this opportunity slip!! you signed up for a reason... finish it 🙌",
                ]
            },
        ]
    },

    // ============ NUDGE: 1h LEFT (last chance) ============
    {
        trigger: "deadline_1h",
        hoursRemaining: 1,
        sarah: `⚠️ {firstName} - FINAL HOUR

Your access expires in 60 minutes.

If you want to continue, reply NOW with "EXTEND" and I'll give you 24 more hours.

No judgment. Life happens.

But I need to hear from you in the next hour, or your progress will be lost.

Reply "EXTEND" if you need more time.

Sarah`,
        zombies: [
            {
                delay: "2min", options: [
                    "@{firstName} REPLY TO SARAH!! dont lose your progress!! 😭",
                ]
            },
        ]
    },
];

// Helper to get message by trigger and lesson
export function getPreCompletionMessage(trigger: string, lesson?: number): PreCompletionMessage | undefined {
    return preCompletionMessages.find(m => {
        if (m.trigger !== trigger) return false;
        if (trigger === "lesson_complete" && m.lesson !== lesson) return false;
        return true;
    });
}

// Milestone lessons that trigger messages
export const MILESTONE_LESSONS = [3, 5, 9];

export default preCompletionMessages;
