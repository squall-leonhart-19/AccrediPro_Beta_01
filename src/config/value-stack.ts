/**
 * No-Brainer Offer Value Stack Configuration
 * 
 * Hormozi-style price anchoring with $14,365 total value
 * Used across quiz results, scholarship chat, and checkout pages
 */

// ═══════════════════════════════════════════════════════════════════
// VALUE STACK CATEGORIES
// ═══════════════════════════════════════════════════════════════════

export interface ValueItem {
    name: string;
    value: number;
    description?: string;
    included: boolean;
}

export interface ValueCategory {
    title: string;
    emoji: string;
    items: ValueItem[];
    subtotal: number;
}

// ═══════════════════════════════════════════════════════════════════
// CORE CERTIFICATIONS
// ═══════════════════════════════════════════════════════════════════

export const CORE_CERTIFICATIONS: ValueCategory = {
    title: "Core Certifications",
    emoji: "🎓",
    items: [
        { name: "Practitioner Certification (Level 1)", value: 997, included: true },
        { name: "Advanced Practitioner (Level 2)", value: 997, included: true },
        { name: "Master Practitioner (Level 3)", value: 997, included: true },
    ],
    subtotal: 2991,
};

// ═══════════════════════════════════════════════════════════════════
// ALL 9 SPECIALIZATIONS
// ═══════════════════════════════════════════════════════════════════

export const SPECIALIZATIONS: ValueCategory = {
    title: "All 9 Specializations",
    emoji: "📚",
    items: [
        { name: "Hormone Health & Balance", value: 297, included: true },
        { name: "Gut Health & Restoration", value: 297, included: true },
        { name: "Metabolic & Weight Optimization", value: 297, included: true },
        { name: "Burnout & Stress Recovery", value: 297, included: true },
        { name: "Autoimmune & Immune Support", value: 297, included: true },
        { name: "Thyroid Optimization", value: 297, included: true },
        { name: "Brain & Cognitive Health", value: 297, included: true },
        { name: "Sleep & Circadian Health", value: 297, included: true },
        { name: "Anti-Inflammatory Protocols", value: 297, included: true },
    ],
    subtotal: 2673,
};

// ═══════════════════════════════════════════════════════════════════
// BUSINESS SYSTEM (How to get clients + money)
// ═══════════════════════════════════════════════════════════════════

export const BUSINESS_SYSTEM: ValueCategory = {
    title: "Business System",
    emoji: "💼",
    items: [
        { name: "Client Acquisition System", value: 497, description: "Step-by-step to first 10 clients", included: true },
        { name: "30-Day Social Media Calendar", value: 197, description: "Done-for-you content", included: true },
        { name: "Email Sequences (5 campaigns)", value: 297, description: "Welcome, nurture, re-engagement", included: true },
        { name: "Discovery Call Scripts", value: 197, description: "Exactly what to say to close", included: true },
        { name: "Sales Page Templates", value: 197, description: "High-converting copy", included: true },
        { name: "Pricing & Offer Frameworks", value: 197, description: "How to charge $200/hr", included: true },
    ],
    subtotal: 1582,
};

// ═══════════════════════════════════════════════════════════════════
// COACH WORKSPACE (Client management)
// ═══════════════════════════════════════════════════════════════════

export const COACH_WORKSPACE: ValueCategory = {
    title: "Coach Workspace",
    emoji: "🖥️",
    items: [
        { name: "Client Management Portal", value: 497, description: "Track all clients in one dashboard", included: true },
        { name: "Session Notes Templates", value: 97, description: "Professional documentation", included: true },
        { name: "Progress Tracker System", value: 97, description: "Show clients their transformation", included: true },
        { name: "Protocol Library (10+ protocols)", value: 297, description: "Ready-to-use clinical protocols", included: true },
        { name: "Intake Forms (Done-for-you)", value: 97, description: "Professional onboarding", included: true },
    ],
    subtotal: 1085,
};

// ═══════════════════════════════════════════════════════════════════
// LEGAL & COMPLIANCE
// ═══════════════════════════════════════════════════════════════════

export const LEGAL_COMPLIANCE: ValueCategory = {
    title: "Legal & Compliance",
    emoji: "⚖️",
    items: [
        { name: "Client Agreement Templates", value: 197, description: "Lawyer-reviewed contracts", included: true },
        { name: "Liability Waiver Templates", value: 197, description: "Protect yourself legally", included: true },
        { name: "HIPAA Compliance Guide", value: 97, description: "What you need to know", included: true },
        { name: "Informed Consent Forms", value: 97, description: "Professional + protective", included: true },
        { name: "Scope of Practice Guidelines", value: 97, description: "Stay in your lane legally", included: true },
    ],
    subtotal: 685,
};

// ═══════════════════════════════════════════════════════════════════
// COMMUNITY & SUPPORT
// ═══════════════════════════════════════════════════════════════════

export const COMMUNITY_SUPPORT: ValueCategory = {
    title: "Community & Support",
    emoji: "👥",
    items: [
        { name: "Private Practitioner Community", value: 497, description: "Network with 2,847+ practitioners", included: true },
        { name: "Weekly Live Q&A Calls", value: 997, description: "Get answers in real-time", included: true },
        { name: "Case Study Library", value: 297, description: "Learn from real client cases", included: true },
        { name: "Peer Accountability Groups", value: 197, description: "Stay on track with others", included: true },
    ],
    subtotal: 1988,
};

// ═══════════════════════════════════════════════════════════════════
// 1:1 MENTORSHIP WITH SARAH
// ═══════════════════════════════════════════════════════════════════

export const MENTORSHIP: ValueCategory = {
    title: "1:1 Mentorship with Sarah",
    emoji: "👩‍🏫",
    items: [
        { name: "Welcome Onboarding", value: 197, description: "Personalized game plan", included: true },
        { name: "Weekly Check-ins Until Certified", value: 997, description: "Sarah guides you through", included: true },
        { name: "Business Launch Support", value: 297, description: "Get your first client strategy", included: true },
        { name: "90-Day Success Review", value: 197, description: "Are you hitting goals?", included: true },
    ],
    subtotal: 1688,
};

// ═══════════════════════════════════════════════════════════════════
// DONE-FOR-YOU ASSETS
// ═══════════════════════════════════════════════════════════════════

export const DFY_ASSETS: ValueCategory = {
    title: "Done-For-You Assets",
    emoji: "📦",
    items: [
        { name: "Professional Bio Templates", value: 97, description: "Look credible instantly", included: true },
        { name: "Website Copy (fill-in-blank)", value: 197, description: "Launch without a copywriter", included: true },
        { name: "Marketing Swipe Files", value: 197, description: "Ads, emails, posts — done", included: true },
        { name: "Client Testimonial Templates", value: 97, description: "Get social proof fast", included: true },
        { name: "Certificate Display Graphics", value: 97, description: "Show off your credentials", included: true },
    ],
    subtotal: 685,
};

// ═══════════════════════════════════════════════════════════════════
// BONUSES (Limited time)
// ═══════════════════════════════════════════════════════════════════

export const BONUSES: ValueCategory = {
    title: "Limited Time Bonuses",
    emoji: "🎁",
    items: [
        { name: "Lab Interpretation Cheat Sheets", value: 197, description: "Quick reference guides", included: true },
        { name: "Supplement Protocol Database", value: 297, description: "What to recommend + why", included: true },
        { name: "Recipe & Meal Plan Templates", value: 197, description: "Give clients actionable plans", included: true },
        { name: "Client Onboarding Automation", value: 297, description: "Set it and forget it", included: true },
    ],
    subtotal: 988,
};

// ═══════════════════════════════════════════════════════════════════
// COMPLETE VALUE STACK
// ═══════════════════════════════════════════════════════════════════

export const VALUE_STACK: ValueCategory[] = [
    CORE_CERTIFICATIONS,
    SPECIALIZATIONS,
    BUSINESS_SYSTEM,
    COACH_WORKSPACE,
    LEGAL_COMPLIANCE,
    COMMUNITY_SUPPORT,
    MENTORSHIP,
    DFY_ASSETS,
    BONUSES,
];

export const TOTAL_VALUE = VALUE_STACK.reduce((sum, cat) => sum + cat.subtotal, 0);
// Should equal $14,365

// ═══════════════════════════════════════════════════════════════════
// PERSONALIZED VALUE STACK (based on quiz answers)
// ═══════════════════════════════════════════════════════════════════

export interface PersonalizedValueStack {
    chosenSpecialization: string;
    practiceType: string;
    clientStrategy: string;
    missingSkill: string;
    incomeGoal: string;
    categories: ValueCategory[];
    totalValue: number;
    personalHighlights: string[];
}

/**
 * Generate personalized value stack based on quiz answers
 */
export function getPersonalizedValueStack(quizData: {
    specialization?: string;
    practiceType?: string; // virtual, in-person, hybrid
    clientAcquisition?: string;
    missingSkill?: string;
    incomeGoal?: string;
}): PersonalizedValueStack {
    const { specialization, practiceType, clientAcquisition, missingSkill, incomeGoal } = quizData;

    // Build personalized highlights based on what they chose
    const personalHighlights: string[] = [];

    if (specialization) {
        const specName = getSpecializationName(specialization);
        personalHighlights.push(`✅ ${specName} Specialization — your passion area`);
    }

    if (clientAcquisition === "struggle" || clientAcquisition === "no-clients") {
        personalHighlights.push("✅ Client Acquisition System — exactly what you need");
    }

    if (missingSkill === "framework") {
        personalHighlights.push("✅ 5-Phase Clinical Framework — fills your skill gap");
    }

    if (missingSkill === "confidence") {
        personalHighlights.push("✅ 1:1 Mentorship — builds your confidence");
    }

    if (missingSkill === "credibility") {
        personalHighlights.push("✅ ASI Certification — the credibility you're looking for");
    }

    if (practiceType === "virtual") {
        personalHighlights.push("✅ Virtual Practice Templates — work from anywhere");
    }

    return {
        chosenSpecialization: specialization || "",
        practiceType: practiceType || "",
        clientStrategy: clientAcquisition || "",
        missingSkill: missingSkill || "",
        incomeGoal: incomeGoal || "",
        categories: VALUE_STACK,
        totalValue: TOTAL_VALUE,
        personalHighlights,
    };
}

/**
 * Get human-readable specialization name
 */
function getSpecializationName(value: string): string {
    const map: Record<string, string> = {
        "hormone-health": "Hormone Health & Balance",
        "gut-restoration": "Gut Health & Restoration",
        "metabolic-optimization": "Metabolic & Weight Optimization",
        "burnout-recovery": "Burnout & Stress Recovery",
        "autoimmune-support": "Autoimmune & Immune Support",
        "other-specialty": "Custom Specialty Track",
    };
    return map[value] || value;
}

// ═══════════════════════════════════════════════════════════════════
// FORMATTED VALUE STACK FOR DISPLAY
// ═══════════════════════════════════════════════════════════════════

/**
 * Get formatted value stack for chat message
 */
export function getValueStackForChat(): string {
    let output = `Here's what you're getting:\n\n`;

    for (const category of VALUE_STACK) {
        output += `${category.emoji} **${category.title}**\n`;
        for (const item of category.items) {
            output += `   • ${item.name} ($${item.value})\n`;
        }
        output += `   → Subtotal: $${category.subtotal.toLocaleString()}\n\n`;
    }

    output += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `**TOTAL VALUE: $${TOTAL_VALUE.toLocaleString()}**\n\n`;
    output += `The Institute has approved a scholarship for you.\n`;
    output += `You just tell me what you can invest today.`;

    return output;
}

/**
 * Get compact value stack (for quick display)
 */
export function getCompactValueStack(): string {
    return `🎓 3-Level Certification ($2,991)
📚 All 9 Specializations ($2,673)
💼 Business System ($1,582)
🖥️ Coach Workspace ($1,085)
⚖️ Legal Templates ($685)
👥 Community Access ($1,988)
👩‍🏫 1:1 Mentorship ($1,688)
📦 Done-For-You Assets ($685)
🎁 Bonuses ($988)

━━━━━━━━━━━━━━━━━━━━━━
TOTAL VALUE: $${TOTAL_VALUE.toLocaleString()}`;
}
