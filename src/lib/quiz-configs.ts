// Hormozi Quiz v2.0 - Emotional Arc Configuration
// 11 Questions + Contact Form + Results Screen
// Target Completion: 55-65% | Target Time: 3 minutes

// ============================================
// QUIZ TYPES
// ============================================

export type EmotionalPhase = 'EXCITEMENT' | 'PAIN' | 'DESIRE' | 'URGENCY' | 'REALITY' | 'COMMITMENT';

export interface QuizOption {
    value: string;
    label: string;
    iconName: string;
    description: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    subtitle: string;
    options: QuizOption[];
    emotionalPhase: EmotionalPhase;
    variableName: string; // Maps to RetellAI variable: {{pain_point}}, etc.
    closerNote?: string; // How Sarah uses this on the call
}

export interface QuizConfig {
    nicheSlug: string;
    nicheLabel: string;
    tagPrefix: string;
    questions: QuizQuestion[];
    completionRedirect: string;
    accentColor: string;
}

// ============================================
// FUNCTIONAL MEDICINE - HORMOZI EMOTIONAL ARC
// ============================================

const FUNCTIONAL_MEDICINE_HORMOZI: QuizConfig = {
    nicheSlug: "functional-medicine",
    nicheLabel: "Functional Medicine Certification",
    tagPrefix: "fm",
    accentColor: "#D4AF37", // Gold
    completionRedirect: "/results/scholarship",
    questions: [
        // ⭐ PHASE 1: EXCITEMENT (Q1-Q4) - Easy, fun, aspirational
        {
            id: "specialization",
            question: "Which area of Functional Medicine excites you most?",
            subtitle: "This helps us match you with the right program",
            emotionalPhase: "EXCITEMENT",
            variableName: "specialization",
            closerNote: "The word 'excites' is intentional. First interaction should be positive and aspirational.",
            options: [
                { value: "gut-health", label: "Gut Health and Digestive Wellness", iconName: "Activity", description: "Microbiome & digestive disorders" },
                { value: "hormonal-health", label: "Hormonal Health and Balance", iconName: "Heart", description: "Thyroid, adrenals & hormones" },
                { value: "stress-recovery", label: "Stress, Burnout and Adrenal Recovery", iconName: "Zap", description: "Chronic fatigue & burnout healing" },
                { value: "autoimmune", label: "Autoimmune and Inflammation", iconName: "Shield", description: "Immune system & chronic conditions" },
                { value: "weight-metabolic", label: "Weight Management and Metabolic Health", iconName: "Scale", description: "Metabolism & body composition" },
                { value: "exploring", label: "Not sure yet — I want to explore", iconName: "Compass", description: "Discover what fits you" },
            ],
        },
        {
            id: "background",
            question: "What best describes your current background?",
            subtitle: "We personalize the program based on your experience",
            emotionalPhase: "EXCITEMENT",
            variableName: "background",
            closerNote: "Determines which bonding path Sarah uses. Healthcare backgrounds get the ICU story.",
            options: [
                { value: "nurse", label: "Nurse or Nursing Assistant", iconName: "Stethoscope", description: "RN, LPN, CNA, etc." },
                { value: "doctor-pa-np", label: "Doctor, PA, or NP", iconName: "UserCheck", description: "MD, DO, PA-C, NP" },
                { value: "allied-health", label: "Allied Health (PT, OT, Dietitian)", iconName: "Activity", description: "Therapy & nutrition" },
                { value: "mental-health", label: "Mental Health Professional", iconName: "Brain", description: "Counselor, therapist, psychologist" },
                { value: "wellness-fitness", label: "Wellness or Fitness Professional", iconName: "Dumbbell", description: "Coach, trainer, yoga instructor" },
                { value: "career-change", label: "Other career — ready for a change", iconName: "Target", description: "New to healthcare" },
            ],
        },
        {
            id: "experience",
            question: "How would you describe your knowledge of Functional Medicine?",
            subtitle: "This helps us tailor the curriculum to your level",
            emotionalPhase: "EXCITEMENT",
            variableName: "experience",
            closerNote: "Makes them feel evaluated — adds legitimacy to the qualification frame.",
            options: [
                { value: "brand-new", label: "Brand new — just discovering this field", iconName: "Sparkles", description: "Curious beginner" },
                { value: "self-study", label: "I have done some research and self-study", iconName: "BookOpen", description: "Self-taught learner" },
                { value: "courses-workshops", label: "I have taken courses or workshops before", iconName: "GraduationCap", description: "Some formal training" },
                { value: "already-practicing", label: "I already work with clients using FM principles", iconName: "Users", description: "Active practitioner" },
            ],
        },
        {
            id: "motivation",
            question: "What is the main reason you want to get certified?",
            subtitle: "Understanding your 'why' helps us support you better",
            emotionalPhase: "EXCITEMENT",
            variableName: "motivation",
            closerNote: "If they pick 'burned out' Sarah mirrors with ICU story. 'Work from home' gets daughter story.",
            options: [
                { value: "help-people", label: "I want to help people heal naturally", iconName: "Heart", description: "Purpose-driven mission" },
                { value: "leave-job", label: "I want to leave my current job and work for myself", iconName: "LogOut", description: "Escape the grind" },
                { value: "add-services", label: "I want to add FM services to my existing practice", iconName: "Plus", description: "Expand offerings" },
                { value: "work-from-home", label: "I want the freedom to work from home on my own schedule", iconName: "Home", description: "Time with family" },
                { value: "burned-out", label: "I am burned out and need a new path", iconName: "Flame", description: "Ready for change" },
            ],
        },

        // 🔥 PHASE 2: PAIN (Q5) - They admit the problem themselves
        {
            id: "pain_point",
            question: "What frustrates you MOST about your current situation?",
            subtitle: "Be honest — this helps us understand where you're starting from",
            emotionalPhase: "PAIN",
            variableName: "pain_point",
            closerNote: "CRITICAL: Every answer is a pain statement they select themselves. 10x more powerful than being told.",
            options: [
                { value: "time-for-money", label: "I am trading time for money and it is not sustainable", iconName: "Clock", description: "Exhausting cycle" },
                { value: "stuck-no-path", label: "I feel stuck with no clear path forward", iconName: "HelpCircle", description: "No direction" },
                { value: "meant-for-more", label: "I know I am meant for more but I do not know how to get there", iconName: "Star", description: "Untapped potential" },
                { value: "exhausted-suffering", label: "I am exhausted and my health or relationships are suffering", iconName: "AlertTriangle", description: "Burnout is real" },
                { value: "no-credential", label: "I have the knowledge but no credential to back it up", iconName: "Award", description: "Need credibility" },
            ],
        },

        // 🚀 PHASE 3: DESIRE (Q6-Q7) - What they want
        {
            id: "start_timeline",
            question: "When would you ideally want to start your certification?",
            subtitle: "This helps us plan your scholarship review",
            emotionalPhase: "DESIRE",
            variableName: "start_timeline",
            closerNote: "'Immediately' and '30 days' are hot leads — call first. 'Just exploring' gets nurture sequence.",
            options: [
                { value: "immediately", label: "Immediately — I am ready now", iconName: "Zap", description: "Let's go!" },
                { value: "30-days", label: "Within the next 30 days", iconName: "Calendar", description: "Very soon" },
                { value: "1-3-months", label: "In 1 to 3 months", iconName: "Clock", description: "Planning ahead" },
                { value: "exploring", label: "Just exploring for now", iconName: "Search", description: "Researching options" },
            ],
        },
        {
            id: "income_goal",
            question: "What monthly income would make this certification worth it for you?",
            subtitle: "Think big — we'll show you how our practitioners get there",
            emotionalPhase: "DESIRE",
            variableName: "income_goal",
            closerNote: "No low option. Every answer is aspirational. Makes investment feel tiny compared to goal.",
            options: [
                { value: "3k-5k", label: "3,000 to 5,000 a month", iconName: "DollarSign", description: "Solid side income" },
                { value: "5k-10k", label: "5,000 to 10,000 a month", iconName: "TrendingUp", description: "Replace current income" },
                { value: "10k-15k", label: "10,000 to 15,000 a month", iconName: "Target", description: "Real financial freedom" },
                { value: "15k-plus", label: "15,000+ a month", iconName: "Rocket", description: "Build a thriving practice" },
            ],
        },

        // ⏰ PHASE 4: URGENCY (Q8) - Cost of inaction
        {
            id: "time_stuck",
            question: "How long have you been thinking about making a change like this?",
            subtitle: "Awareness of time passed helps you commit to action",
            emotionalPhase: "URGENCY",
            variableName: "time_stuck",
            closerNote: "THE GAP AMPLIFIER. If they pick 'over a year' they just admitted 12+ months stuck.",
            options: [
                { value: "less-than-month", label: "Less than a month", iconName: "Clock", description: "Brand new idea" },
                { value: "1-6-months", label: "1 to 6 months", iconName: "Calendar", description: "Been thinking about it" },
                { value: "6-12-months", label: "6 months to a year", iconName: "Hourglass", description: "Time keeps passing" },
                { value: "over-a-year", label: "Over a year — I keep putting it off", iconName: "AlertCircle", description: "Too long already" },
            ],
        },

        // 💡 PHASE 5: REALITY CHECK (Q9-Q10) - Gap creation + Dream
        {
            id: "current_income",
            question: "What is your current monthly income?",
            subtitle: "We use this to calculate your earning potential gap",
            emotionalPhase: "REALITY",
            variableName: "current_income",
            closerNote: "Placed AFTER income goal intentionally. Creates gap between dream and reality.",
            options: [
                { value: "under-3k", label: "Under 3,000 a month", iconName: "TrendingDown", description: "Room to grow" },
                { value: "3k-5k", label: "3,000 to 5,000 a month", iconName: "Minus", description: "Stable but stagnant" },
                { value: "5k-8k", label: "5,000 to 8,000 a month", iconName: "Activity", description: "Decent but want more" },
                { value: "over-8k", label: "Over 8,000 a month", iconName: "TrendingUp", description: "Good but not great" },
            ],
        },
        {
            id: "dream_life",
            question: "Imagine 12 months from now. You are certified, you have clients, and you are earning your goal income. What matters most to you about that life?",
            subtitle: "Close your eyes for a moment and really picture it",
            emotionalPhase: "REALITY",
            variableName: "dream_life",
            closerNote: "MAXIMUM emotional gap between present reality and desired future. Carries them through contact form.",
            options: [
                { value: "financial-freedom", label: "Financial freedom — no more living paycheck to paycheck", iconName: "Wallet", description: "Money stress gone" },
                { value: "time-freedom", label: "Time freedom — setting my own schedule and being present for family", iconName: "Users", description: "Be there for loved ones" },
                { value: "purpose", label: "Purpose — doing meaningful work that actually helps people heal", iconName: "Heart", description: "Make a difference" },
                { value: "independence", label: "Independence — no more answering to a boss or broken system", iconName: "Unlock", description: "Be your own boss" },
                { value: "all-above", label: "All of the above", iconName: "Star", description: "The complete transformation" },
            ],
        },

        // ✅ PHASE 6: COMMITMENT (Q11) - Lead scoring
        {
            id: "commitment",
            question: "If you qualify for the scholarship, how committed are you to starting?",
            subtitle: "This determines your priority in the scholarship review",
            emotionalPhase: "COMMITMENT",
            variableName: "commitment",
            closerNote: "'100 percent' and 'Very committed' get called first. 'Just seeing' goes to nurture sequence.",
            options: [
                { value: "100-percent", label: "100 percent — I am ready to invest in myself today", iconName: "CheckCircle", description: "All in" },
                { value: "very-committed", label: "Very committed — I just need the right opportunity", iconName: "Target", description: "Serious about this" },
                { value: "interested", label: "Interested but I have some questions first", iconName: "HelpCircle", description: "Need more info" },
                { value: "just-seeing", label: "Just seeing what is available", iconName: "Search", description: "Exploring" },
            ],
        },
    ],
};

// ============================================
// CONFIG REGISTRY
// ============================================
export const QUIZ_CONFIGS: Record<string, QuizConfig> = {
    "functional-medicine": FUNCTIONAL_MEDICINE_HORMOZI,
};

// Helper function to get config by portal slug
export function getQuizConfig(portalSlug: string): QuizConfig | null {
    return QUIZ_CONFIGS[portalSlug] || null;
}

// Get default config for standalone quiz page
export function getDefaultQuizConfig(): QuizConfig {
    return FUNCTIONAL_MEDICINE_HORMOZI;
}

// Calculate qualification score (82-94 range per spec)
export function calculateQualificationScore(answers: Record<string, string>): number {
    let baseScore = 85;

    // Boost for high commitment
    if (answers.commitment === '100-percent') baseScore += 6;
    else if (answers.commitment === 'very-committed') baseScore += 4;
    else if (answers.commitment === 'interested') baseScore += 1;

    // Boost for urgency
    if (answers.start_timeline === 'immediately') baseScore += 3;
    else if (answers.start_timeline === '30-days') baseScore += 2;

    // Cap at 94
    return Math.min(94, Math.max(82, baseScore));
}

// Get all variable mappings for RetellAI
export function getRetellVariables(answers: Record<string, string>): Record<string, string> {
    const config = getDefaultQuizConfig();
    const variables: Record<string, string> = {};

    for (const question of config.questions) {
        const answer = answers[question.id];
        if (answer) {
            // Find the label for the selected value
            const option = question.options.find(o => o.value === answer);
            variables[question.variableName] = option?.label || answer;
        }
    }

    return variables;
}
