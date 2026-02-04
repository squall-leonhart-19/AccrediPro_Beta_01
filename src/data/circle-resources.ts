// Circle Pod Resources - Time-locked interactive tools
// Unlocked progressively, gifted by Sarah in Circle Pod messages
// NOTE: Messages are universal - work for ALL mini diplomas

export const CIRCLE_RESOURCES = [
    {
        id: "income-calculator",
        name: "Income Calculator",
        icon: "DollarSign",
        description: "Calculate your earning potential",
        unlockAfterMinutes: 30, // +30 min after opt-in
        sarahGiftMessage: `Oh and {firstName} - I almost forgot! 💛

Here's something that changed everything for my early students...

It's an Income Calculator I built. Just plug in your hours, rates, and it shows you exactly how much you could make as a Certified Practitioner.

Most people are shocked 😄

→ Check it out in your Resources sidebar!`,
    },
    {
        id: "niche-quiz",
        name: "Niche Clarity Quiz",
        icon: "Target",
        description: "Find your perfect specialty",
        unlockAfterMinutes: 120, // +2 hours
        sarahGiftMessage: `{firstName}, quick thing for you! 🎯

I created a quiz that helps you discover your ideal niche... 

It only takes 2 minutes and tells you exactly which specialty fits YOUR background and passions.

I wish I had this when I started!

→ It's in your Resources now - go take it! 💛`,
    },
    {
        id: "pricing-tool",
        name: "Client Pricing Tool",
        icon: "Calculator",
        description: "Price your services confidently",
        unlockAfterMinutes: 360, // +6 hours
        sarahGiftMessage: `Okay {firstName} - time for my SECRET WEAPON 🔥

This is my Client Pricing Tool. 

It helps you figure out exactly what to charge based on your income goals, hours, and services. No more guessing!

This tool alone is worth more than most courses tbh 😄

→ Go play with it in Resources!`,
    },
    {
        id: "roadmap",
        name: "90-Day Roadmap",
        icon: "Map",
        description: "Plan your first 90 days",
        unlockAfterMinutes: 720, // +12 hours
        sarahGiftMessage: `Special gift for you {firstName} 🎁

I just unlocked your 90-Day Launch Roadmap...

This is the exact step-by-step plan I give my private coaching clients ($2,500 value btw).

Week by week, it tells you exactly what to focus on to go from certified → getting your first paying client.

→ It's waiting in your Resources sidebar!

This is the stuff that actually works 💛`,
    },
    // HIGH-INTENT RESOURCES (18h - 72h)
    {
        id: "client-blueprint",
        name: "Client Attraction Blueprint",
        icon: "Users",
        description: "Templates to land your first clients",
        unlockAfterMinutes: 1080, // +18 hours
        sarahGiftMessage: `{firstName} - this one's a game changer 🚀

I just unlocked your Client Attraction Blueprint...

It's a complete template library: email scripts, DM templates, discovery call outlines - everything you need to sign your first clients.

My students use these word-for-word and close deals within DAYS.

→ Go grab it from your Resources!`,
    },
    {
        id: "session-script",
        name: "Sample Session Script",
        icon: "FileText",
        description: "See exactly what a real session looks like",
        unlockAfterMinutes: 1440, // +24 hours
        sarahGiftMessage: `Okay {firstName} this is HUGE 💛

I just unlocked something I normally only share with my private clients...

It's my actual Session Script - the exact flow I use when coaching clients.

You'll see exactly what to say, what questions to ask, and how to structure your sessions like a pro.

→ It's in your Resources now. Study it. Use it. Own it! 🔥`,
    },
    {
        id: "case-study",
        name: "Case Study: Lisa's Journey",
        icon: "BookOpen",
        description: "Real transformation story with numbers",
        unlockAfterMinutes: 1800, // +30 hours
        sarahGiftMessage: `{firstName}, I want you to meet Lisa... 💛

Just unlocked her full case study for you.

Lisa was a nurse burned out from 12-hour shifts. 6 months after certification, she replaced her income working 20 hours/week.

I documented EVERYTHING: her doubts, her breakthrough, her exact numbers.

This could be you.

→ Read her story in Resources!`,
    },
    {
        id: "pricing-worksheet",
        name: "Pricing Your Services",
        icon: "Receipt",
        description: "Premium pricing strategies & scripts",
        unlockAfterMinutes: 2160, // +36 hours
        sarahGiftMessage: `{firstName} - confession time 🙈

When I started, I undercharged MASSIVELY. Like embarrassingly low.

I don't want that for you. So I just unlocked my Pricing Worksheet...

It includes the exact scripts I use to confidently quote $2,000+ packages. No more awkward price talks!

→ This one's in your Resources now 💛`,
    },
    {
        id: "5k-planner",
        name: "Your First $5K Month",
        icon: "TrendingUp",
        description: "Step-by-step planner to hit $5K",
        unlockAfterMinutes: 2880, // +48 hours
        sarahGiftMessage: `This is it {firstName} 🔥

I just unlocked the tool that changed everything for my most successful students...

Your First $5K Month Planner.

It breaks down exactly: how many clients you need, what to charge, what to offer, and what to do each week.

Most people who complete this hit $5K within 90 days of certification.

→ It's ready for you in Resources. This is the one.`,
    },
    {
        id: "launch-checklist",
        name: "Business Launch Checklist",
        icon: "CheckSquare",
        description: "Everything you need to launch",
        unlockAfterMinutes: 4320, // +72 hours
        sarahGiftMessage: `{firstName}, final gift from me 🎁

This is my complete Business Launch Checklist.

Legal stuff, tech setup, social profiles, booking systems, pricing pages - literally EVERYTHING you need to launch a real coaching business.

I spent 5 years figuring this out. You get it in one document.

→ Go get it. And let me know when you're ready to take this seriously 💛`,
    },
];

// Get resource by ID
export function getResource(id: string) {
    return CIRCLE_RESOURCES.find(r => r.id === id);
}

// Check if resource is unlocked based on minutes since opt-in
export function isResourceUnlocked(resourceId: string, minutesSinceOptin: number): boolean {
    const resource = getResource(resourceId);
    if (!resource) return false;
    return minutesSinceOptin >= resource.unlockAfterMinutes;
}

// Get all resources with unlock status
export function getResourcesWithStatus(unlockedIds: string[], minutesSinceOptin: number) {
    return CIRCLE_RESOURCES.map(r => ({
        ...r,
        isUnlocked: unlockedIds.includes(r.id),
        minutesUntilUnlock: Math.max(0, r.unlockAfterMinutes - minutesSinceOptin),
    }));
}

export default CIRCLE_RESOURCES;
