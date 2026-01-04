/**
 * Pod Scripts System
 * Humanized, scheduled + triggered messages for Study Pods
 */

// Types
export type MessageTrigger =
    | "scheduled"
    | "student_complete_lesson"
    | "student_complete_module"
    | "student_inactive_3days"
    | "student_hit_25_percent"
    | "student_hit_50_percent"
    | "student_hit_75_percent"
    | "student_certified"
    | "student_first_login"
    | "student_chat_message";

export interface PodScript {
    id: string;
    trigger: MessageTrigger;
    dayOffset?: number; // For scheduled messages (days since enrollment)
    senderType: "coach" | "leader" | "struggler" | "questioner" | "buyer";
    messages: string[]; // Array to pick randomly
    offerTag?: string; // If this message leads to upsell
    delay?: number; // Minutes to wait before posting (for realism)
}

// ============================================
// SCHEDULED MESSAGES (Based on enrollment date)
// ============================================

export const SCHEDULED_SCRIPTS: PodScript[] = [
    // DAY 0 - Welcome
    {
        id: "welcome_coach",
        trigger: "scheduled",
        dayOffset: 0,
        senderType: "coach",
        delay: 0,
        messages: [
            "Welcome to your Study Pod, everyone! 🎉 I'm Coach Sarah, and I'll be supporting you on this journey. This is your accountability crew - we learn together, celebrate together, and push each other to finish strong. Let's introduce ourselves!",
            "Hey team! 👋 Welcome to AccrediPro! I'm Coach Sarah, your dedicated mentor. This pod is YOUR support system. Ask questions, share wins, and let's get you certified FAST. Who's ready to transform their life? Drop a 🙋 below!",
        ],
    },
    {
        id: "welcome_leader",
        trigger: "scheduled",
        dayOffset: 0,
        senderType: "leader",
        delay: 12, // 12 minutes after coach
        messages: [
            "Hi everyone! 🙋‍♀️ I'm SO excited to start this journey! I've been wanting to do this certification for months. Finally taking action! Who else is pumped? 💪",
            "Hey pod fam! Just enrolled today and I'm already hooked. Can't wait to learn together! What made you all decide to start?",
        ],
    },
    {
        id: "welcome_struggler",
        trigger: "scheduled",
        dayOffset: 0,
        senderType: "struggler",
        delay: 45,
        messages: [
            "Hi everyone! A bit nervous honestly... I work full-time so I'm worried about keeping up. But seeing you all is motivating! 💪",
            "Hey! I'm here! Took me a while to actually hit 'enroll' but here we are. Hoping this pod keeps me accountable 😅",
        ],
    },
    {
        id: "welcome_questioner",
        trigger: "scheduled",
        dayOffset: 0,
        senderType: "questioner",
        delay: 90,
        messages: [
            "Hi team! Quick question - has anyone taken a look at the curriculum yet? I'm curious which modules are the most important 🤔",
            "Hello! So excited to meet you all. Does anyone know how long each module typically takes? Want to plan my schedule!",
        ],
    },

    // DAY 1 - First Progress
    {
        id: "day1_leader",
        trigger: "scheduled",
        dayOffset: 1,
        senderType: "leader",
        delay: 0,
        messages: [
            "Just finished Module 1! 🎯 The intro is really well done. Already learned so much about the foundations. Can't stop won't stop! 🔥",
            "OMG the first module is SO good! I literally took 3 pages of notes. This certification is going to change everything 📚",
        ],
    },
    {
        id: "day1_coach",
        trigger: "scheduled",
        dayOffset: 1,
        senderType: "coach",
        delay: 120,
        messages: [
            "Love seeing the energy! 🙌 Day 1 is in the books. Remember: consistency beats intensity. Even 30 minutes a day adds up fast. You've got this!",
            "Great start everyone! Pro tip: The first week is about building the habit. Set a specific time each day for your learning. Morning works best for most students 🌅",
        ],
    },

    // DAY 3 - Building Momentum
    {
        id: "day3_leader",
        trigger: "scheduled",
        dayOffset: 3,
        senderType: "leader",
        delay: 0,
        messages: [
            "25% done already! 🎉 The hormone section in Module 2 is mind-blowing. Finally understanding why I've felt off all these years...",
            "Module 2 complete! The gut-brain connection stuff is fascinating. Can't wait to help people with this knowledge 🧠",
        ],
    },
    {
        id: "day3_struggler",
        trigger: "scheduled",
        dayOffset: 3,
        senderType: "struggler",
        delay: 180,
        messages: [
            "Finally caught up on Module 1! Took me a few extra days cuz work was crazy but I'm here! Slow progress is still progress right? 💪",
            "Made it through the first module! Not gonna lie, had to rewatch a few videos but now it's clicking. Thanks for the encouragement everyone!",
        ],
    },
    {
        id: "day3_buyer",
        trigger: "scheduled",
        dayOffset: 3,
        senderType: "buyer",
        delay: 300,
        messages: [
            "Hey team! Did anyone see there's a Pro version with extra business modules? I'm tempted... the client acquisition stuff looks 🔥",
            "So I looked ahead at the Pro content and wow... the income strategies section alone would be worth it. Anyone else considering upgrading?",
        ],
    },

    // DAY 5 - First Win Celebration
    {
        id: "day5_leader",
        trigger: "scheduled",
        dayOffset: 5,
        senderType: "leader",
        delay: 0,
        messages: [
            "40% complete! 📊 At this pace I'll be certified in 2 weeks! Already told my family about my new career plan. They're so supportive!",
            "Halfway through Module 3 and I'm blown away. This is the education I wish I had 10 years ago. Better late than never! 🙌",
        ],
    },
    {
        id: "day5_questioner",
        trigger: "scheduled",
        dayOffset: 5,
        senderType: "questioner",
        delay: 120,
        messages: [
            "Question for @Coach Sarah - after certification, what's the typical timeline to get first clients? I'm already thinking ahead!",
            "Has anyone else started thinking about their niche? I'm torn between focusing on women's health or gut issues 🤔",
        ],
    },
    {
        id: "day5_coach",
        trigger: "scheduled",
        dayOffset: 5,
        senderType: "coach",
        delay: 180,
        messages: [
            "Great question! Most of our graduates get their first paying client within 30 days of certification. Some even start during training! The key is starting to build your audience NOW while you learn 📈",
            "Love the forward thinking! Your niche usually picks YOU. Whatever health challenge you've personally overcome often becomes your specialty. Clients connect with authenticity! ❤️",
        ],
    },

    // DAY 7 - First Week Celebration + Soft Upsell
    {
        id: "day7_coach",
        trigger: "scheduled",
        dayOffset: 7,
        senderType: "coach",
        delay: 0,
        offerTag: "pro_accelerator",
        messages: [
            "🎉 ONE WEEK DOWN! I'm so proud of this pod! You've all shown amazing commitment. Quick announcement: For top performers (that's you!), I'm opening 5 spots for our Pro Accelerator track. It includes advanced business modules and priority certification. DM me if interested!",
            "Week 1 complete! You all are crushing it! 🙌 Special opportunity: I'm selecting 5 students from this cohort for our Pro Accelerator program. Faster certification + business toolkit + direct coaching access. Limited spots - reply if you want details!",
        ],
    },
    {
        id: "day7_buyer",
        trigger: "scheduled",
        dayOffset: 7,
        senderType: "buyer",
        delay: 15,
        offerTag: "pro_accelerator",
        messages: [
            "I'm IN! 🙋‍♀️ Just signed up. The business modules are exactly what I need. Thanks Sarah!! 🚀",
            "Already registered! The ROI on this is a no-brainer. If I can get to $5K/month faster, totally worth it 💰",
        ],
    },
    {
        id: "day7_leader",
        trigger: "scheduled",
        dayOffset: 7,
        senderType: "leader",
        delay: 45,
        offerTag: "pro_accelerator",
        messages: [
            "Same! Just grabbed mine. Only 3 spots left now 👀 Anyone else considering it?",
            "Count me in too! I want every advantage I can get. This is my year! 🔥",
        ],
    },
    {
        id: "day7_struggler",
        trigger: "scheduled",
        dayOffset: 7,
        senderType: "struggler",
        delay: 90,
        messages: [
            "Wow you guys are fast! I'm still catching up but this is tempting... @Sarah is it okay if I'm not as far along?",
            "Hmm I'm on the fence... is it really worth the extra investment? I'm already stretching my budget 🤔",
        ],
    },
    {
        id: "day7_coach_followup",
        trigger: "scheduled",
        dayOffset: 7,
        senderType: "coach",
        delay: 120,
        messages: [
            "Absolutely! The Pro track is designed to accelerate wherever you are. And honestly, the business modules help you earn back the investment within your first few clients. It's an investment in your future income! 💪",
            "Great question! The Pro content is actually designed to help you monetize faster. Most Pro students break even within their first month of practice. Think of it as startup capital for your new career! 📈",
        ],
    },

    // DAY 10 - Midway Check-in
    {
        id: "day10_leader",
        trigger: "scheduled",
        dayOffset: 10,
        senderType: "leader",
        delay: 0,
        messages: [
            "60% DONE! 🎯 I can actually see the finish line now. Module 4 on nutrition was life-changing. Already applied some tips to my own diet!",
            "Just passed the 60% mark! The quiz for Module 4 was tricky but I got 92%! This stuff is really clicking now 🧠",
        ],
    },
    {
        id: "day10_struggler",
        trigger: "scheduled",
        dayOffset: 10,
        senderType: "struggler",
        delay: 180,
        messages: [
            "Finally hit 40%! I know I'm behind you all but I'm committed. This pod keeps me going even on tough days ❤️",
            "Slow and steady! Just finished Module 2. The gut health section actually helped me understand my own digestive issues. This is so personal to me now 💪",
        ],
    },
    {
        id: "day10_coach",
        trigger: "scheduled",
        dayOffset: 10,
        senderType: "coach",
        delay: 240,
        messages: [
            "Look at this progress! 🙌 Remember: this isn't a race. Whether you finish in 2 weeks or 6 weeks, you'll have the same powerful certification. The goal is COMPLETION, not speed. Keep going!",
            "So proud of everyone! Pro tip: If you're feeling stuck, rewatch the videos at 1.5x speed for review. And don't skip the quizzes - they really cement the knowledge! 📚",
        ],
    },

    // DAY 14 - Two Week Upsell
    {
        id: "day14_buyer",
        trigger: "scheduled",
        dayOffset: 14,
        senderType: "buyer",
        delay: 0,
        offerTag: "coaching",
        messages: [
            "UPDATE: I just hit 80%! And the Pro business modules... WOW. I already have a plan for my first 3 clients. Worth every penny! 🚀",
            "Pro Accelerator update: The client acquisition module alone is gold. I've started building my email list already. Can't wait to launch! 💰",
        ],
    },
    {
        id: "day14_coach",
        trigger: "scheduled",
        dayOffset: 14,
        senderType: "coach",
        delay: 60,
        offerTag: "done_for_you",
        messages: [
            "Love seeing this! 🙌 For those interested in an even faster path, we have a Done-For-You package where we set up your entire practice - website, booking system, client materials. Only 3 spots/month. DM for details!",
        ],
    },
    {
        id: "day14_leader",
        trigger: "scheduled",
        dayOffset: 14,
        senderType: "leader",
        delay: 120,
        messages: [
            "I'm looking into that! Having everything set up would save me so much time. Anyone else considering the DFY package?",
        ],
    },

    // DAY 21 - Certification Push
    {
        id: "day21_leader",
        trigger: "scheduled",
        dayOffset: 21,
        senderType: "leader",
        delay: 0,
        messages: [
            "I DID IT!!! 🎓 Just passed my final exam! CERTIFIED!! I can't believe it - 3 weeks ago I was just dreaming about this. Now I'm officially a Functional Medicine Practitioner! 😭🎉",
            "CERTIFIED!! 🎓🎉 OMG I'm literally crying. This pod made it possible. Thank you all for the support and motivation! Time to change some lives! 💪",
        ],
    },
    {
        id: "day21_coach",
        trigger: "scheduled",
        dayOffset: 21,
        senderType: "coach",
        delay: 30,
        messages: [
            "CONGRATULATIONS!!! 🎊🎉 I'm SO proud of you! Your certificate will be emailed within 24 hours. Now the real journey begins - go help people heal! Who's next?! 👀",
            "YES!!! 🙌 This is what it's all about! You've just transformed your career and your life. Can't wait to hear about your first client! Welcome to the practitioner family! 🎓",
        ],
    },
    {
        id: "day21_struggler",
        trigger: "scheduled",
        dayOffset: 21,
        senderType: "struggler",
        delay: 180,
        messages: [
            "WOW congratulations!!! 🎉 This is so inspiring. I'm at 65% now - seeing you finish gives me so much motivation. I WILL be next! 💪",
            "So happy for you!! 😭 This gives me hope. I'm still working through Module 5 but I'm not giving up. This pod is everything!",
        ],
    },

    // DAY 28 - Income Milestone
    {
        id: "day28_leader",
        trigger: "scheduled",
        dayOffset: 28,
        senderType: "leader",
        delay: 0,
        messages: [
            "UPDATE: Got my first paying client today! $175 for a 90-minute consultation! 💰 It's happening!! Can't believe I'm actually getting PAID to help people!",
            "OMG IT HAPPENED! First client session today - she paid $150 and we're booking a follow-up! I made back almost the cost of the course already! 🚀",
        ],
    },
    {
        id: "day28_coach",
        trigger: "scheduled",
        dayOffset: 28,
        senderType: "coach",
        delay: 60,
        messages: [
            "This is EXACTLY why we do this! 🙌 First client is always the hardest - now you know you can do this. Aim for 3 clients this week! The momentum is building! 💪",
            "YESSSS! 🎉 First client is the breakthrough moment! Now rinse and repeat. Your $5K month is closer than you think! So proud of you! 💰",
        ],
    },

    // DAY 35 - Income Update
    {
        id: "day35_buyer",
        trigger: "scheduled",
        dayOffset: 35,
        senderType: "buyer",
        delay: 0,
        messages: [
            "Income update: $850 this month from 6 clients! 💵 The Pro business strategies are paying off. On track for $2K+ next month!",
            "Milestone: Just crossed $1,000 in my first month! 🎉 Used the pricing strategy from the Pro modules - charging $200/session and clients are happy to pay! 💰",
        ],
    },
    {
        id: "day35_leader",
        trigger: "scheduled",
        dayOffset: 35,
        senderType: "leader",
        delay: 120,
        messages: [
            "WOWWW that's amazing! I'm at $500 so far with 4 clients. Trying to get to $1K by end of month. This certification is ACTUALLY paying off! 🙌",
        ],
    },
];

// ============================================
// TRIGGERED MESSAGES (Based on student actions)
// ============================================

export const TRIGGERED_SCRIPTS: PodScript[] = [
    // Student completes first lesson
    {
        id: "first_lesson_leader",
        trigger: "student_complete_lesson",
        senderType: "leader",
        delay: 5,
        messages: [
            "Yay! Another lesson done! The first few really set the foundation 🎯",
            "Nice progress! I remember that lesson - it really hooked me! 📚",
        ],
    },

    // Student completes a module
    {
        id: "module_complete_coach",
        trigger: "student_complete_module",
        senderType: "coach",
        delay: 3,
        messages: [
            "Module complete! 🎉 Excellent work! Keep that momentum going!",
            "Another module DOWN! 💪 You're crushing it! The next one is even better!",
        ],
    },
    {
        id: "module_complete_leader",
        trigger: "student_complete_module",
        senderType: "leader",
        delay: 15,
        messages: [
            "Woohoo! Module done! 🙌 High five! We're all in this together!",
            "Nice!! I just finished that one too - the quiz was tricky but so worth it! 🎯",
        ],
    },

    // Student inactive for 3 days
    {
        id: "inactive_coach",
        trigger: "student_inactive_3days",
        senderType: "coach",
        delay: 0,
        messages: [
            "Hey! Missing you in here! 💕 Everything okay? Remember, even 15 minutes of progress counts. We're here for you!",
            "Just checking in! 👋 You got this - pick up where you left off. Your pod is rooting for you!",
        ],
    },
    {
        id: "inactive_struggler",
        trigger: "student_inactive_3days",
        senderType: "struggler",
        delay: 60,
        messages: [
            "Hey! I was slipping too but came back. It's never too late to pick up! We're in this together! 💪",
            "I took a break last week too - life happens! But getting back on track feels SO good. You got this!",
        ],
    },

    // Student hits 25%
    {
        id: "25_percent_coach",
        trigger: "student_hit_25_percent",
        senderType: "coach",
        delay: 5,
        messages: [
            "25% COMPLETE! 🎯 You've built real momentum. The hardest part (starting) is behind you!",
            "Quarter way there! 🙌 This is where habits form. You're officially on the path to certification!",
        ],
    },

    // Student hits 50%
    {
        id: "50_percent_coach",
        trigger: "student_hit_50_percent",
        senderType: "coach",
        delay: 5,
        messages: [
            "HALFWAY!!! 🎊 50% complete! You're in the home stretch now. So proud of you!",
            "50% MILESTONE! 🏆 More than halfway to your new career! Keep pushing!",
        ],
    },
    {
        id: "50_percent_leader",
        trigger: "student_hit_50_percent",
        senderType: "leader",
        delay: 30,
        messages: [
            "Yes!! Halfway!! 🙌 The second half goes even faster, trust me!",
            "Woohoo! 50%! We should celebrate these wins! You're crushing it! 🎉",
        ],
    },

    // Student hits 75%
    {
        id: "75_percent_coach",
        trigger: "student_hit_75_percent",
        senderType: "coach",
        delay: 5,
        messages: [
            "75% DONE!! 🔥 You can taste the finish line! Just a little more push and you'll be CERTIFIED!",
            "THREE QUARTERS! 🎯 The certification is in sight. You've got this! Don't stop now!",
        ],
    },
    {
        id: "75_percent_all",
        trigger: "student_hit_75_percent",
        senderType: "leader",
        delay: 45,
        messages: [
            "Almost there!! The final modules are the best - all the practical stuff! 💪",
        ],
    },

    // Student gets certified
    {
        id: "certified_coach",
        trigger: "student_certified",
        senderType: "coach",
        delay: 2,
        messages: [
            "🎓🎉 CERTIFIED!!! CONGRATULATIONS!!! I'm SO incredibly proud of you! You did it! Welcome to the practitioner family! Your certificate will be emailed within 24 hours. NOW GO CHANGE LIVES!! 💪❤️",
        ],
    },
    {
        id: "certified_all",
        trigger: "student_certified",
        senderType: "leader",
        delay: 10,
        messages: [
            "YESSSS!! 🎊🎉 CONGRATULATIONS!! This is so amazing! We're so proud of you!! 🙌",
        ],
    },

    // Student sends a chat message (AI response)
    {
        id: "student_chat_coach",
        trigger: "student_chat_message",
        senderType: "coach",
        delay: 30, // 30 min delay feels realistic for coach
        messages: [
            "Great question! Let me help with that...", // Will be replaced by AI
        ],
    },
];

// Helper to get random message from script
export function getRandomMessage(script: PodScript): string {
    return script.messages[Math.floor(Math.random() * script.messages.length)];
}

// Get scripts for a specific day
export function getScheduledScriptsForDay(dayOffset: number): PodScript[] {
    return SCHEDULED_SCRIPTS.filter(s => s.dayOffset === dayOffset);
}

// Get scripts for a trigger
export function getTriggeredScripts(trigger: MessageTrigger): PodScript[] {
    return TRIGGERED_SCRIPTS.filter(s => s.trigger === trigger);
}
