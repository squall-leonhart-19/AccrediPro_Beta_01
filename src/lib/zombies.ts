/**
 * Zombie Profiles System
 * AI-controlled personas for social proof, study pods, success feed
 */

// Zombie personality types
export type ZombiePersonality = "leader" | "struggler" | "questioner" | "buyer";

// Coach Sarah M. - the ONLY coach
export const COACH_SARAH = {
    name: "Coach Sarah M.",
    email: "sarah@accredipro-certificate.com",
    avatar: "https://assets.accredipro.academy/fm-certification/Sarah-M.webp",
};

// Student avatar URLs (real-looking faces)
const STUDENT_AVATARS = [
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=9",
    "https://i.pravatar.cc/150?img=16",
    "https://i.pravatar.cc/150?img=20",
    "https://i.pravatar.cc/150?img=23",
    "https://i.pravatar.cc/150?img=25",
    "https://i.pravatar.cc/150?img=26",
    "https://i.pravatar.cc/150?img=29",
    "https://i.pravatar.cc/150?img=32",
    "https://i.pravatar.cc/150?img=38",
    "https://i.pravatar.cc/150?img=41",
    "https://i.pravatar.cc/150?img=47",
];

// Pre-defined zombie profiles - MUST MATCH pod-scripts-v2.ts characters!
// These are the 5 core pod members that appear in all scripted messages
export const ZOMBIE_PROFILES = [
    // LEADERS - Gina T. and Amber L. from scripts
    {
        name: "Gina T.",
        location: "California",
        personalityType: "leader" as ZombiePersonality,
        backstory: "Started 6 weeks ago, crushing it, very encouraging",
        avatar: "https://assets.accredipro.academy/fm-certification/Gina-T.webp",
    },
    {
        name: "Amber L.",
        location: "Texas",
        personalityType: "leader" as ZombiePersonality,
        backstory: "Supportive, gives great advice about pacing",
        avatar: "https://assets.accredipro.academy/fm-certification/Amber-L.webp",
    },

    // QUESTIONER - Cheryl W. from scripts
    {
        name: "Cheryl W.",
        location: "Florida",
        personalityType: "questioner" as ZombiePersonality,
        backstory: "Was nervous at first, loves gut health, asks great questions",
        avatar: "https://assets.accredipro.academy/fm-certification/Cheryl-W.webp",
    },

    // STRUGGLER - Lisa K. from scripts
    {
        name: "Lisa K.",
        location: "Oregon",
        personalityType: "struggler" as ZombiePersonality,
        backstory: "Working full-time, slower pace but persistent",
        avatar: "https://assets.accredipro.academy/fm-certification/Lisa-K.webp",
    },

    // BUYER - Denise P. from scripts
    {
        name: "Denise P.",
        location: "Colorado",
        personalityType: "buyer" as ZombiePersonality,
        backstory: "Invested in Pro early, gets certified Day 14, first client Day 25",
        avatar: "https://assets.accredipro.academy/fm-certification/Denise-P.webp",
    },
];

// Pod name generator
export const POD_NAMES = [
    "Rising Stars",
    "The Achievers",
    "Wellness Warriors",
    "Health Champions",
    "Future Practitioners",
    "The Transformers",
    "Healing Heroes",
    "Wellness Pioneers",
    "The Empowered",
    "Success Squad",
];

// Get random pod name
export function getRandomPodName(): string {
    return POD_NAMES[Math.floor(Math.random() * POD_NAMES.length)];
}

// Get zombies for a pod - returns the consistent 5 script characters
// Order: Gina (leader), Amber (leader), Cheryl (questioner), Lisa (struggler), Denise (buyer)
export function getZombiesForPod(count: number = 5): typeof ZOMBIE_PROFILES {
    // Return all 5 core characters - they match the scripts exactly
    return ZOMBIE_PROFILES.slice(0, count);
}

// Progress curves - how fast zombies progress (day -> progress %)
export const PROGRESS_CURVES: Record<ZombiePersonality, number[]> = {
    leader: [5, 12, 22, 35, 50, 65, 78, 89, 95, 100],
    struggler: [2, 5, 8, 12, 20, 35, 55, 75, 90, 100],
    questioner: [3, 10, 20, 30, 42, 55, 68, 80, 92, 100],
    buyer: [8, 20, 35, 55, 70, 82, 90, 95, 98, 100],
};

// Get zombie progress for a given day
export function getZombieProgress(personality: ZombiePersonality, daysSinceEnrollment: number): number {
    const curve = PROGRESS_CURVES[personality];
    const weekIndex = Math.min(Math.floor(daysSinceEnrollment / 7), curve.length - 1);
    return curve[weekIndex];
}

// Scripted messages for pods
export const POD_SCRIPTS = {
    welcome: {
        leader: [
            "Hey everyone! 🎉 So excited to be in this pod with you all! Let's crush it together!",
            "Welcome to the team! I'm all in on this certification. Who else is pumped? 💪",
        ],
        struggler: [
            "Hi everyone! A bit nervous but ready to learn. Looking forward to connecting!",
            "Just getting started... hoping I can keep up with everyone!",
        ],
        questioner: [
            "Hello team! Quick question - has anyone done Module 1 yet? Any tips?",
            "Hi! I'm curious what everyone's goals are with this certification?",
        ],
        buyer: [
            "Hey team! Just signed up and I'm ready to go fast! Anyone else going for Pro?",
            "Excited to be here! I upgraded to the full package - let's accelerate! 🚀",
        ],
    },
    progress: {
        leader: [
            "Just finished Module 3! 🎯 The hormone section is amazing.",
            "45% done already! Can't stop learning. This stuff is life-changing.",
            "Hit 50% today! Anyone else finding the gut health section fascinating?",
        ],
        struggler: [
            "Finally caught up on Module 2! Took me a few extra days but feeling good now.",
            "Making progress! Slow and steady wins the race, right? 😅",
            "Had a tough week but got back on track. This pod keeps me accountable!",
        ],
        questioner: [
            "Quick question for the group - how are you all taking notes? Any tips?",
            "Did anyone else find the quiz tricky? I reviewed it twice.",
            "I'm wondering if we should do a study session together?",
        ],
        buyer: [
            "The Pro modules are SO good! Totally worth the upgrade.",
            "Just got access to the business modules - game changer! 💰",
            "If anyone's on the fence about upgrading, just do it. Trust me.",
        ],
    },
    upsellResponse: {
        leader: [
            "I'm IN! 🙋‍♀️ Already signed up!",
            "Just grabbed it! So excited for the advanced content!",
            "Registered! Let's goooo 🚀",
        ],
        struggler: [
            "Thinking about it... is it really worth it?",
            "I'm on the fence but seeing everyone join is making me reconsider...",
        ],
        questioner: [
            "What exactly is included? I want to make sure it's right for me.",
            "Has anyone done it before? Would love to hear experiences.",
        ],
        buyer: [
            "Already in! Best investment I've made in myself 💯",
            "Just purchased! Only 2 spots left now! 👀",
            "Done! Couldn't miss this opportunity!",
        ],
    },
    milestones: {
        certified: [
            "I DID IT!! 🎓 Officially certified! Thank you all for the support!",
            "CERTIFIED!! 🎉 Can't believe I actually finished! This pod made it possible!",
        ],
        firstClient: [
            "OMG! Got my first paying client today! $150 for a consultation! 💰",
            "It happened! First client signed up! I'm actually doing this!",
        ],
        income500: [
            "Just hit $500 in my practice this month! It's really happening! 💵",
            "$500 milestone reached! Still can't believe I'm getting paid to help people!",
        ],
        income1000: [
            "One THOUSAND dollars!! 🎉 This certification paid for itself and then some!",
            "$1K this month! Never thought I'd say that! 🚀",
        ],
    },
};

// Get random scripted message
export function getScriptedMessage(
    category: keyof typeof POD_SCRIPTS,
    personality: ZombiePersonality
): string {
    const categoryMessages = POD_SCRIPTS[category];
    if (!categoryMessages) return "";

    const messages = categoryMessages[personality];
    if (!messages || messages.length === 0) return "";

    return messages[Math.floor(Math.random() * messages.length)];
}

// Success event types for Success Feed
export const SUCCESS_EVENT_MESSAGES = {
    certified: (name: string) => `🎓 ${name} just got CERTIFIED!`,
    milestone_500: (name: string) => `💰 ${name} earned their first $500!`,
    milestone_1000: (name: string) => `💰 ${name} hit $1,000/month!`,
    milestone_5000: (name: string) => `🚀 ${name} reached $5,000/month!`,
    streak_7: (name: string) => `🔥 ${name} hit a 7-day streak!`,
    streak_14: (name: string) => `🔥 ${name} hit a 14-day streak!`,
    streak_30: (name: string) => `🔥 ${name} hit a 30-day streak!`,
    first_client: (name: string) => `🎉 ${name} got their first client!`,
    course_complete: (name: string, courseTitle: string) => `📚 ${name} completed ${courseTitle}!`,
};
