// Specialization Track Configurations
// Used for personalized roadmaps based on user opt-in tags

export interface SpecializationTrack {
    slug: string;
    name: string;
    fullName: string;
    tagline: string;
    icon: string;
    gradient: string;
    accentGradient: string;
    miniDiploma: {
        title: string;
        slug: string;
        description: string;
    };
    steps: {
        step: number;
        title: string;
        subtitle: string;
        description: string;
        incomeVision: string;
        courseSlugs: string[];
    }[];
    stateConfig: Record<string, {
        welcomeMessage: string;
        actionLabel: string;
        actionHref: string;
        motivation: string;
        nextUnlockTitle: string;
        nextUnlockBenefits: string[];
        idealFor: string[];
    }>;
}

// Default / Functional Medicine Track
export const FUNCTIONAL_MEDICINE_TRACK: SpecializationTrack = {
    slug: "functional-medicine",
    name: "Functional Medicine",
    fullName: "Functional Medicine Health Coach",
    tagline: "Transform lives through root-cause health optimization",
    icon: "Leaf",
    gradient: "from-emerald-600 to-emerald-700",
    accentGradient: "from-gold-400 to-gold-500",
    miniDiploma: {
        title: "Functional Medicine Mini Diploma",
        slug: "functional-medicine-mini-diploma",
        description: "Explore Functional Medicine fundamentals — completely free, no commitment.",
    },
    steps: [
        {
            step: 1,
            title: "Certified FM Practitioner",
            subtitle: "Become Legitimate",
            description: "Get certified with clinical knowledge, ethical scope, and practitioner tools.",
            incomeVision: "$3K–$5K/month",
            courseSlugs: ["functional-medicine-health-coach"],
        },
        {
            step: 2,
            title: "Working Practitioner",
            subtitle: "Work With Real Clients",
            description: "Build your practice with client acquisition, branding, and income systems.",
            incomeVision: "$5K–$10K/month",
            courseSlugs: ["practice-income-path"],
        },
        {
            step: 3,
            title: "Advanced & Master",
            subtitle: "Gain Authority",
            description: "Handle complex cases, charge premium rates, become an industry expert.",
            incomeVision: "$10K–$30K/month",
            courseSlugs: ["advanced-master-practitioner"],
        },
        {
            step: 4,
            title: "Business Scaler",
            subtitle: "Build Leverage",
            description: "Scale beyond 1:1 with teams, group programs, and passive income.",
            incomeVision: "$30K–$50K/month",
            courseSlugs: ["business-acceleration"],
        },
    ],
    stateConfig: {
        exploration: {
            welcomeMessage: "I'm so glad you're here. This is where your transformation into a Functional Medicine practitioner begins — at your own pace, with full support.",
            actionLabel: "Start My Free Mini Diploma",
            actionHref: "/courses/functional-medicine-mini-diploma",
            motivation: "Your Mini Diploma gives you a real taste of Functional Medicine. No credit card, no pressure — just clarity about your path.",
            nextUnlockTitle: "Step 1: Certified FM Practitioner",
            nextUnlockBenefits: [
                "Full clinical certification with practitioner status",
                "21 modules of professional training",
                "Income potential: $3K–$5K/month",
            ],
            idealFor: [
                "Career changers ready for a meaningful profession",
                "Health enthusiasts wanting to help others professionally",
                "Existing practitioners adding functional medicine",
            ],
        },
        step1_in_progress: {
            welcomeMessage: "You're doing amazing work on your Functional Medicine certification. Every lesson brings you closer to helping real clients.",
            actionLabel: "Continue My Training",
            actionHref: "/my-courses",
            motivation: "You're building real clinical skills in functional medicine. Keep going — your certification unlocks the ability to work with paying clients.",
            nextUnlockTitle: "Step 2: Practice & Income Path",
            nextUnlockBenefits: [
                "Client acquisition systems that actually work",
                "Ethical marketing without the sleaze",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Those who want to turn certification into real income",
                "Practitioners ready for their first paying clients",
                "Anyone wanting a sustainable, ethical practice",
            ],
        },
        step1_completed: {
            welcomeMessage: "Congratulations! You've earned your Functional Medicine certification. Now it's time to turn that knowledge into real income.",
            actionLabel: "Activate My Practice Path",
            actionHref: "/catalog",
            motivation: "You have the clinical foundation in FM. Now let's build the practice and income you deserve — ethically and sustainably.",
            nextUnlockTitle: "Step 2: Working Practitioner",
            nextUnlockBenefits: [
                "Complete practice setup blueprint",
                "Client attraction without paid ads",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Certified FM practitioners ready for real clients",
                "Those wanting consistent monthly income",
                "Anyone tired of trading time for money",
            ],
        },
        step2_in_progress: {
            welcomeMessage: "You're in the income-building phase now. This is where your FM practice starts to come together.",
            actionLabel: "Continue Building",
            actionHref: "/my-courses",
            motivation: "Every system you build now creates income for years to come. You're building something real.",
            nextUnlockTitle: "Step 3: Advanced & Master",
            nextUnlockBenefits: [
                "Handle complex FM cases others can't",
                "Charge premium rates ($300–$500+/session)",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "FM practitioners wanting to specialize deeper",
                "Those ready for premium positioning",
                "Anyone wanting to become the go-to FM expert",
            ],
        },
        step2_completed: {
            welcomeMessage: "Look how far you've come! Your FM foundation is solid. Ready to charge what you're truly worth?",
            actionLabel: "Explore Advanced Track",
            actionHref: "/tracks/functional-medicine",
            motivation: "The Advanced track is where FM practitioners become the experts everyone refers to — and pays premium for.",
            nextUnlockTitle: "Step 3: Advanced & Master",
            nextUnlockBenefits: [
                "Advanced clinical protocols",
                "Authority positioning in your market",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Successful FM practitioners ready to level up",
                "Those wanting to handle complex cases",
                "Anyone ready for expert-level income",
            ],
        },
        step3_available: {
            welcomeMessage: "You've earned this. The Advanced FM track is where practitioners become the experts everyone refers to.",
            actionLabel: "View Advanced & Master",
            actionHref: "/tracks/functional-medicine",
            motivation: "This is where you become the FM practitioner others look up to — and refer their hardest cases to.",
            nextUnlockTitle: "Step 3: Advanced & Master",
            nextUnlockBenefits: [
                "Complex case mastery",
                "Premium client attraction",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "FM practitioners ready for expert status",
                "Those wanting waitlist-worthy practices",
                "Anyone ready to be the best FM coach in their area",
            ],
        },
        step3_in_progress: {
            welcomeMessage: "You're in expert FM territory now. The skills you're building set you apart for years.",
            actionLabel: "Continue Advanced Training",
            actionHref: "/my-courses",
            motivation: "Every module deepens your FM expertise. You're becoming the practitioner others aspire to be.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you business systems",
                "Scale beyond 1:1 client work",
                "Income potential: $30K–$50K/month",
            ],
            idealFor: [
                "FM experts ready to scale their impact",
                "Those wanting passive income streams",
                "Anyone ready to build a real FM business",
            ],
        },
        step4_available: {
            welcomeMessage: "You've mastered FM practice. Now it's time to build something bigger — without burning out.",
            actionLabel: "Apply for Business Scaler",
            actionHref: "/tracks/functional-medicine#step-4",
            motivation: "Let's build systems that work for you, so you can help more people without sacrificing yourself.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you funnels and marketing",
                "Team building and delegation",
                "Income potential: $30K–$50K/month+",
            ],
            idealFor: [
                "Successful FM practitioners ready to scale",
                "Those wanting leverage and freedom",
                "Anyone building a legacy FM practice",
            ],
        },
        step4_active: {
            welcomeMessage: "You're in the scaling phase now. This is about leverage, freedom, and impact in Functional Medicine.",
            actionLabel: "Continue with Mentorship",
            actionHref: "/messages",
            motivation: "Focus on the systems that multiply your FM impact. Your mentor is here to help every step.",
            nextUnlockTitle: "Faculty & Mentor Status",
            nextUnlockBenefits: [
                "Teach and mentor other FM practitioners",
                "Build institutional authority",
                "Create lasting impact in functional medicine",
            ],
            idealFor: [
                "FM leaders ready to give back",
                "Those wanting to shape the industry",
                "Anyone building a legacy",
            ],
        },
    },
};

// Health Coach Track
export const HEALTH_COACH_TRACK: SpecializationTrack = {
    slug: "health-coach",
    name: "Health Coach",
    fullName: "Certified Health Coach",
    tagline: "Empower clients to achieve lasting wellness transformations",
    icon: "Heart",
    gradient: "from-rose-600 to-rose-700",
    accentGradient: "from-gold-400 to-gold-500",
    miniDiploma: {
        title: "Health Coaching Mini Diploma",
        slug: "health-coach-mini-diploma",
        description: "Discover what it takes to become a professional Health Coach — completely free.",
    },
    steps: [
        {
            step: 1,
            title: "Certified Health Coach",
            subtitle: "Become Legitimate",
            description: "Get certified with coaching skills, behavior change science, and client tools.",
            incomeVision: "$3K–$5K/month",
            courseSlugs: ["certified-health-coach"],
        },
        {
            step: 2,
            title: "Working Coach",
            subtitle: "Work With Real Clients",
            description: "Build your coaching practice with client acquisition and income systems.",
            incomeVision: "$5K–$10K/month",
            courseSlugs: ["practice-income-path"],
        },
        {
            step: 3,
            title: "Advanced & Master Coach",
            subtitle: "Gain Authority",
            description: "Master advanced coaching techniques and become an industry leader.",
            incomeVision: "$10K–$30K/month",
            courseSlugs: ["advanced-health-coach"],
        },
        {
            step: 4,
            title: "Business Scaler",
            subtitle: "Build Leverage",
            description: "Scale your coaching business with teams and group programs.",
            incomeVision: "$30K–$50K/month",
            courseSlugs: ["business-acceleration"],
        },
    ],
    stateConfig: {
        exploration: {
            welcomeMessage: "I'm so glad you're here. This is where your transformation into a Health Coach begins — at your own pace, with full support.",
            actionLabel: "Start My Free Mini Diploma",
            actionHref: "/courses/health-coach-mini-diploma",
            motivation: "Your Mini Diploma gives you a real taste of health coaching. No credit card, no pressure — just clarity about your path.",
            nextUnlockTitle: "Step 1: Certified Health Coach",
            nextUnlockBenefits: [
                "Full coaching certification with professional status",
                "Behavior change science & client psychology",
                "Income potential: $3K–$5K/month",
            ],
            idealFor: [
                "Empathetic people who love helping others",
                "Those passionate about wellness and lifestyle",
                "Career changers seeking meaningful work",
            ],
        },
        step1_in_progress: {
            welcomeMessage: "You're doing amazing work on your Health Coach certification. Every lesson brings you closer to transforming lives.",
            actionLabel: "Continue My Training",
            actionHref: "/my-courses",
            motivation: "You're building real coaching skills. Keep going — your certification unlocks the ability to work with paying clients.",
            nextUnlockTitle: "Step 2: Practice & Income Path",
            nextUnlockBenefits: [
                "Client acquisition systems that actually work",
                "Ethical marketing for coaches",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Those who want to turn certification into real income",
                "Coaches ready for their first paying clients",
                "Anyone wanting a sustainable coaching practice",
            ],
        },
        step1_completed: {
            welcomeMessage: "Congratulations! You've earned your Health Coach certification. Now it's time to turn that knowledge into real income.",
            actionLabel: "Activate My Practice Path",
            actionHref: "/catalog",
            motivation: "You have the coaching foundation. Now let's build the practice and income you deserve.",
            nextUnlockTitle: "Step 2: Working Coach",
            nextUnlockBenefits: [
                "Complete practice setup blueprint",
                "Client attraction without paid ads",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Certified coaches ready for real clients",
                "Those wanting consistent monthly income",
                "Anyone ready to coach professionally",
            ],
        },
        step2_in_progress: {
            welcomeMessage: "You're in the income-building phase now. This is where your coaching practice starts to come together.",
            actionLabel: "Continue Building",
            actionHref: "/my-courses",
            motivation: "Every system you build now creates income for years to come. You're building something real.",
            nextUnlockTitle: "Step 3: Advanced & Master Coach",
            nextUnlockBenefits: [
                "Advanced coaching techniques",
                "Charge premium rates ($200–$400+/session)",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Coaches wanting to deepen their skills",
                "Those ready for premium positioning",
                "Anyone wanting to become a master coach",
            ],
        },
        step2_completed: {
            welcomeMessage: "Look how far you've come! Your coaching foundation is solid. Ready to charge what you're truly worth?",
            actionLabel: "Explore Advanced Track",
            actionHref: "/tracks/health-coach",
            motivation: "The Advanced track is where coaches become the experts everyone refers to.",
            nextUnlockTitle: "Step 3: Advanced & Master Coach",
            nextUnlockBenefits: [
                "Advanced coaching methodologies",
                "Authority positioning in your market",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Successful coaches ready to level up",
                "Those wanting to master advanced techniques",
                "Anyone ready for expert-level income",
            ],
        },
        step3_available: {
            welcomeMessage: "You've earned this. The Advanced track is where coaches become master practitioners.",
            actionLabel: "View Advanced & Master",
            actionHref: "/tracks/health-coach",
            motivation: "This is where you become the coach others look up to — and refer their clients to.",
            nextUnlockTitle: "Step 3: Advanced & Master Coach",
            nextUnlockBenefits: [
                "Master-level coaching skills",
                "Premium client attraction",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Coaches ready for expert status",
                "Those wanting waitlist-worthy practices",
                "Anyone ready to be the best coach in their area",
            ],
        },
        step3_in_progress: {
            welcomeMessage: "You're in master coach territory now. The skills you're building set you apart.",
            actionLabel: "Continue Advanced Training",
            actionHref: "/my-courses",
            motivation: "Every module deepens your coaching expertise. You're becoming the coach others aspire to be.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you business systems",
                "Scale beyond 1:1 coaching",
                "Income potential: $30K–$50K/month",
            ],
            idealFor: [
                "Master coaches ready to scale",
                "Those wanting passive income streams",
                "Anyone ready to build a coaching empire",
            ],
        },
        step4_available: {
            welcomeMessage: "You've mastered coaching. Now it's time to build something bigger — without burning out.",
            actionLabel: "Apply for Business Scaler",
            actionHref: "/tracks/health-coach#step-4",
            motivation: "Let's build systems that work for you, so you can help more people.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you funnels and marketing",
                "Team building and delegation",
                "Income potential: $30K–$50K/month+",
            ],
            idealFor: [
                "Successful coaches ready to scale",
                "Those wanting leverage and freedom",
                "Anyone building a legacy coaching practice",
            ],
        },
        step4_active: {
            welcomeMessage: "You're in the scaling phase now. This is about leverage, freedom, and impact.",
            actionLabel: "Continue with Mentorship",
            actionHref: "/messages",
            motivation: "Focus on the systems that multiply your coaching impact. Your mentor is here to help.",
            nextUnlockTitle: "Faculty & Mentor Status",
            nextUnlockBenefits: [
                "Teach and mentor other coaches",
                "Build institutional authority",
                "Create lasting impact in health coaching",
            ],
            idealFor: [
                "Coaching leaders ready to give back",
                "Those wanting to shape the industry",
                "Anyone building a legacy",
            ],
        },
    },
};

// Menopause & Perimenopause Track
export const MENOPAUSE_TRACK: SpecializationTrack = {
    slug: "menopause",
    name: "Menopause & Perimenopause",
    fullName: "Menopause & Perimenopause Specialist",
    tagline: "Guide women through midlife transitions with confidence",
    icon: "Flower2",
    gradient: "from-fuchsia-600 to-fuchsia-700",
    accentGradient: "from-gold-400 to-gold-500",
    miniDiploma: {
        title: "Menopause Specialist Mini Diploma",
        slug: "menopause-mini-diploma",
        description: "Explore what it takes to become a Menopause Specialist — completely free.",
    },
    steps: [
        {
            step: 1,
            title: "Certified Menopause Specialist",
            subtitle: "Become Legitimate",
            description: "Get certified to support women through perimenopause and menopause with evidence-based protocols.",
            incomeVision: "$3K–$5K/month",
            courseSlugs: ["menopause-specialist-certification"],
        },
        {
            step: 2,
            title: "Working Specialist",
            subtitle: "Work With Real Clients",
            description: "Build your menopause-focused practice and attract your ideal clients.",
            incomeVision: "$5K–$10K/month",
            courseSlugs: ["practice-income-path"],
        },
        {
            step: 3,
            title: "Advanced Menopause Expert",
            subtitle: "Gain Authority",
            description: "Become the go-to expert for complex hormonal cases in your area.",
            incomeVision: "$10K–$30K/month",
            courseSlugs: ["advanced-menopause-specialist"],
        },
        {
            step: 4,
            title: "Business Scaler",
            subtitle: "Build Leverage",
            description: "Scale your practice with group programs and team members.",
            incomeVision: "$30K–$50K/month",
            courseSlugs: ["business-acceleration"],
        },
    ],
    stateConfig: {
        exploration: {
            welcomeMessage: "I'm so glad you're here. Millions of women need specialists like you to guide them through this transformative time.",
            actionLabel: "Start My Free Mini Diploma",
            actionHref: "/courses/menopause-mini-diploma",
            motivation: "Your Mini Diploma shows you exactly what menopause specialists do — and why this work matters so much.",
            nextUnlockTitle: "Step 1: Certified Menopause Specialist",
            nextUnlockBenefits: [
                "Evidence-based menopause protocols",
                "Hormone health fundamentals",
                "Income potential: $3K–$5K/month",
            ],
            idealFor: [
                "Women who've navigated their own menopause journey",
                "Health professionals wanting to specialize",
                "Anyone passionate about women's midlife health",
            ],
        },
        step1_in_progress: {
            welcomeMessage: "You're doing amazing work on your Menopause Specialist certification. Women need practitioners like you.",
            actionLabel: "Continue My Training",
            actionHref: "/my-courses",
            motivation: "You're building expertise that will transform women's lives during menopause. This matters.",
            nextUnlockTitle: "Step 2: Practice & Income Path",
            nextUnlockBenefits: [
                "Client acquisition for menopause specialists",
                "Marketing that attracts midlife women",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Those who want to turn certification into income",
                "Specialists ready for their first clients",
                "Anyone wanting to serve women professionally",
            ],
        },
        step1_completed: {
            welcomeMessage: "Congratulations! You're now a Certified Menopause Specialist. Time to help real women transform their experience.",
            actionLabel: "Activate My Practice Path",
            actionHref: "/catalog",
            motivation: "You have the expertise. Now let's build the practice that connects you with women who need you.",
            nextUnlockTitle: "Step 2: Working Specialist",
            nextUnlockBenefits: [
                "Complete practice setup blueprint",
                "Client attraction strategies for women 40+",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Certified specialists ready for real clients",
                "Those wanting to serve women consistently",
                "Anyone ready to make menopause care their career",
            ],
        },
        step2_in_progress: {
            welcomeMessage: "You're building your menopause practice now. This is where you start changing women's lives.",
            actionLabel: "Continue Building",
            actionHref: "/my-courses",
            motivation: "Every woman you help spreads the word. You're building something women desperately need.",
            nextUnlockTitle: "Step 3: Advanced Menopause Expert",
            nextUnlockBenefits: [
                "Complex hormonal case management",
                "Premium positioning in women's health",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Specialists wanting to go deeper",
                "Those ready for complex cases",
                "Anyone wanting expert-level recognition",
            ],
        },
        step2_completed: {
            welcomeMessage: "You've built a solid foundation. Ready to become the menopause expert everyone refers to?",
            actionLabel: "Explore Advanced Track",
            actionHref: "/tracks/menopause",
            motivation: "The Advanced track is where specialists become the experts women drive hours to see.",
            nextUnlockTitle: "Step 3: Advanced Menopause Expert",
            nextUnlockBenefits: [
                "Advanced hormonal protocols",
                "Authority in women's midlife health",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Successful specialists ready to level up",
                "Those wanting to handle complex cases",
                "Anyone ready for premium positioning",
            ],
        },
        step3_available: {
            welcomeMessage: "You've earned this. The Advanced track is where you become THE menopause expert in your area.",
            actionLabel: "View Advanced Track",
            actionHref: "/tracks/menopause",
            motivation: "Become the specialist other practitioners refer their hardest cases to.",
            nextUnlockTitle: "Step 3: Advanced Menopause Expert",
            nextUnlockBenefits: [
                "Complex case mastery",
                "Premium client attraction",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Specialists ready for expert status",
                "Those wanting waitlist-worthy practices",
                "Anyone ready to lead in menopause care",
            ],
        },
        step3_in_progress: {
            welcomeMessage: "You're becoming the menopause expert women need. This training sets you apart.",
            actionLabel: "Continue Advanced Training",
            actionHref: "/my-courses",
            motivation: "Every module deepens your expertise in women's hormonal health.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you business systems",
                "Group menopause programs",
                "Income potential: $30K–$50K/month",
            ],
            idealFor: [
                "Experts ready to scale their impact",
                "Those wanting to help more women",
                "Anyone building a menopause practice empire",
            ],
        },
        step4_available: {
            welcomeMessage: "You've mastered menopause care. Now it's time to scale your impact to help more women.",
            actionLabel: "Apply for Business Scaler",
            actionHref: "/tracks/menopause#step-4",
            motivation: "Build systems that let you serve more women without burning out.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you funnels and marketing",
                "Group program development",
                "Income potential: $30K–$50K/month+",
            ],
            idealFor: [
                "Successful specialists ready to scale",
                "Those wanting to reach more women",
                "Anyone building a legacy in women's health",
            ],
        },
        step4_active: {
            welcomeMessage: "You're in the scaling phase. Your expertise can now reach women you'll never meet personally.",
            actionLabel: "Continue with Mentorship",
            actionHref: "/messages",
            motivation: "Focus on building systems that multiply your impact on women's lives.",
            nextUnlockTitle: "Faculty & Mentor Status",
            nextUnlockBenefits: [
                "Train other menopause specialists",
                "Build authority in women's health",
                "Create lasting impact",
            ],
            idealFor: [
                "Leaders ready to train others",
                "Those wanting to shape menopause care",
                "Anyone building a legacy",
            ],
        },
    },
};

// Gut Health Track
export const GUT_HEALTH_TRACK: SpecializationTrack = {
    slug: "gut-health",
    name: "Gut Health",
    fullName: "Gut Health Specialist",
    tagline: "Transform health from the inside out through gut optimization",
    icon: "Activity",
    gradient: "from-teal-600 to-teal-700",
    accentGradient: "from-gold-400 to-gold-500",
    miniDiploma: {
        title: "Gut Health Mini Diploma",
        slug: "gut-health-mini-diploma",
        description: "Explore gut health fundamentals and the microbiome — completely free.",
    },
    steps: [
        {
            step: 1,
            title: "Certified Gut Health Specialist",
            subtitle: "Become Legitimate",
            description: "Get certified in gut health protocols, microbiome science, and digestive wellness.",
            incomeVision: "$3K–$5K/month",
            courseSlugs: ["gut-health-specialist-certification"],
        },
        {
            step: 2,
            title: "Working Specialist",
            subtitle: "Work With Real Clients",
            description: "Build your gut health practice with client acquisition and retention systems.",
            incomeVision: "$5K–$10K/month",
            courseSlugs: ["practice-income-path"],
        },
        {
            step: 3,
            title: "Advanced Gut Health Expert",
            subtitle: "Gain Authority",
            description: "Master complex gut cases and become the go-to expert in your area.",
            incomeVision: "$10K–$30K/month",
            courseSlugs: ["advanced-gut-health-specialist"],
        },
        {
            step: 4,
            title: "Business Scaler",
            subtitle: "Build Leverage",
            description: "Scale your practice with gut health programs and team members.",
            incomeVision: "$30K–$50K/month",
            courseSlugs: ["business-acceleration"],
        },
    ],
    stateConfig: {
        exploration: {
            welcomeMessage: "I'm so glad you're here. Gut health is transforming how we think about wellness — and you can be part of it.",
            actionLabel: "Start My Free Mini Diploma",
            actionHref: "/courses/gut-health-mini-diploma",
            motivation: "Your Mini Diploma shows you the science of gut health and why this specialization is in such high demand.",
            nextUnlockTitle: "Step 1: Certified Gut Health Specialist",
            nextUnlockBenefits: [
                "Microbiome science & gut protocols",
                "Digestive health assessment skills",
                "Income potential: $3K–$5K/month",
            ],
            idealFor: [
                "Those fascinated by the gut-health connection",
                "Health professionals wanting to specialize",
                "Anyone passionate about digestive wellness",
            ],
        },
        step1_in_progress: {
            welcomeMessage: "You're doing amazing work on your Gut Health certification. The microbiome is the future of health!",
            actionLabel: "Continue My Training",
            actionHref: "/my-courses",
            motivation: "You're building expertise in one of the most in-demand health specializations. Keep going!",
            nextUnlockTitle: "Step 2: Practice & Income Path",
            nextUnlockBenefits: [
                "Client acquisition for gut health specialists",
                "Marketing that attracts digestive health clients",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Those who want to turn certification into income",
                "Specialists ready for their first clients",
                "Anyone wanting to serve clients professionally",
            ],
        },
        step1_completed: {
            welcomeMessage: "Congratulations! You're now a Certified Gut Health Specialist. Time to help clients transform their health.",
            actionLabel: "Activate My Practice Path",
            actionHref: "/catalog",
            motivation: "You have the expertise. Now let's build the practice that connects you with clients who need gut health help.",
            nextUnlockTitle: "Step 2: Working Specialist",
            nextUnlockBenefits: [
                "Complete practice setup blueprint",
                "Client attraction strategies",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Certified specialists ready for real clients",
                "Those wanting consistent income",
                "Anyone ready to make gut health their career",
            ],
        },
        step2_in_progress: {
            welcomeMessage: "You're building your gut health practice now. Digestive wellness clients are everywhere!",
            actionLabel: "Continue Building",
            actionHref: "/my-courses",
            motivation: "Every client you help spreads the word. Gut health is a specialty that sells itself.",
            nextUnlockTitle: "Step 3: Advanced Gut Health Expert",
            nextUnlockBenefits: [
                "Complex gut case management",
                "Premium positioning in digestive health",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Specialists wanting to go deeper",
                "Those ready for complex cases",
                "Anyone wanting expert-level recognition",
            ],
        },
        step2_completed: {
            welcomeMessage: "You've built a solid gut health foundation. Ready to become the expert everyone refers to?",
            actionLabel: "Explore Advanced Track",
            actionHref: "/tracks/gut-health",
            motivation: "The Advanced track is where specialists become the experts clients travel to see.",
            nextUnlockTitle: "Step 3: Advanced Gut Health Expert",
            nextUnlockBenefits: [
                "Advanced gut protocols",
                "Authority in digestive health",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Successful specialists ready to level up",
                "Those wanting to handle complex cases",
                "Anyone ready for premium positioning",
            ],
        },
        step3_available: {
            welcomeMessage: "You've earned this. The Advanced track is where you become THE gut health expert in your area.",
            actionLabel: "View Advanced Track",
            actionHref: "/tracks/gut-health",
            motivation: "Become the specialist other practitioners refer their hardest cases to.",
            nextUnlockTitle: "Step 3: Advanced Gut Health Expert",
            nextUnlockBenefits: [
                "Complex case mastery",
                "Premium client attraction",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Specialists ready for expert status",
                "Those wanting waitlist-worthy practices",
                "Anyone ready to lead in gut health",
            ],
        },
        step3_in_progress: {
            welcomeMessage: "You're becoming the gut health expert clients need. This training sets you apart.",
            actionLabel: "Continue Advanced Training",
            actionHref: "/my-courses",
            motivation: "Every module deepens your expertise in digestive wellness.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you business systems",
                "Group gut health programs",
                "Income potential: $30K–$50K/month",
            ],
            idealFor: [
                "Experts ready to scale their impact",
                "Those wanting to help more clients",
                "Anyone building a gut health practice empire",
            ],
        },
        step4_available: {
            welcomeMessage: "You've mastered gut health. Now it's time to scale your impact to help more people.",
            actionLabel: "Apply for Business Scaler",
            actionHref: "/tracks/gut-health#step-4",
            motivation: "Build systems that let you serve more clients without burning out.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you funnels and marketing",
                "Group program development",
                "Income potential: $30K–$50K/month+",
            ],
            idealFor: [
                "Successful specialists ready to scale",
                "Those wanting to reach more clients",
                "Anyone building a legacy in gut health",
            ],
        },
        step4_active: {
            welcomeMessage: "You're in the scaling phase. Your gut health expertise can now reach people you'll never meet personally.",
            actionLabel: "Continue with Mentorship",
            actionHref: "/messages",
            motivation: "Focus on building systems that multiply your impact.",
            nextUnlockTitle: "Faculty & Mentor Status",
            nextUnlockBenefits: [
                "Train other gut health specialists",
                "Build authority in digestive wellness",
                "Create lasting impact",
            ],
            idealFor: [
                "Leaders ready to train others",
                "Those wanting to shape gut health care",
                "Anyone building a legacy",
            ],
        },
    },
};

// Women's Health Track
export const WOMENS_HEALTH_TRACK: SpecializationTrack = {
    slug: "womens-health",
    name: "Women's Health",
    fullName: "Women's Health Specialist",
    tagline: "Empower women at every life stage with holistic care",
    icon: "Sparkles",
    gradient: "from-pink-600 to-pink-700",
    accentGradient: "from-gold-400 to-gold-500",
    miniDiploma: {
        title: "Women's Health Mini Diploma",
        slug: "womens-health-mini-diploma",
        description: "Explore women's health specialization — completely free.",
    },
    steps: [
        {
            step: 1,
            title: "Certified Women's Health Specialist",
            subtitle: "Become Legitimate",
            description: "Get certified in women's hormones, fertility, and lifecycle health.",
            incomeVision: "$3K–$5K/month",
            courseSlugs: ["womens-health-specialist-certification"],
        },
        {
            step: 2,
            title: "Working Specialist",
            subtitle: "Work With Real Clients",
            description: "Build your women's health practice with client acquisition systems.",
            incomeVision: "$5K–$10K/month",
            courseSlugs: ["practice-income-path"],
        },
        {
            step: 3,
            title: "Advanced Women's Health Expert",
            subtitle: "Gain Authority",
            description: "Master complex women's health cases and become a recognized expert.",
            incomeVision: "$10K–$30K/month",
            courseSlugs: ["advanced-womens-health-specialist"],
        },
        {
            step: 4,
            title: "Business Scaler",
            subtitle: "Build Leverage",
            description: "Scale your practice with women's health programs and team.",
            incomeVision: "$30K–$50K/month",
            courseSlugs: ["business-acceleration"],
        },
    ],
    stateConfig: {
        exploration: {
            welcomeMessage: "I'm so glad you're here. Women need specialists who understand their unique health needs at every stage.",
            actionLabel: "Start My Free Mini Diploma",
            actionHref: "/courses/womens-health-mini-diploma",
            motivation: "Your Mini Diploma shows you the world of women's health — and why this work changes lives.",
            nextUnlockTitle: "Step 1: Certified Women's Health Specialist",
            nextUnlockBenefits: [
                "Women's hormonal health protocols",
                "Lifecycle health (fertility to menopause)",
                "Income potential: $3K–$5K/month",
            ],
            idealFor: [
                "Women passionate about women's health",
                "Health professionals wanting to specialize",
                "Anyone called to serve women holistically",
            ],
        },
        step1_in_progress: {
            welcomeMessage: "You're doing amazing work on your Women's Health certification. Women need practitioners like you!",
            actionLabel: "Continue My Training",
            actionHref: "/my-courses",
            motivation: "You're building expertise that will empower women at every life stage. This matters.",
            nextUnlockTitle: "Step 2: Practice & Income Path",
            nextUnlockBenefits: [
                "Client acquisition for women's health",
                "Marketing that attracts your ideal clients",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Those who want to turn certification into income",
                "Specialists ready for their first clients",
                "Anyone wanting to serve women professionally",
            ],
        },
        step1_completed: {
            welcomeMessage: "Congratulations! You're now a Certified Women's Health Specialist. Time to serve the women who need you.",
            actionLabel: "Activate My Practice Path",
            actionHref: "/catalog",
            motivation: "You have the expertise. Now let's build the practice that connects you with women who need you.",
            nextUnlockTitle: "Step 2: Working Specialist",
            nextUnlockBenefits: [
                "Complete practice setup blueprint",
                "Client attraction for women's health",
                "Income potential: $5K–$10K/month",
            ],
            idealFor: [
                "Certified specialists ready for real clients",
                "Those wanting to serve women consistently",
                "Anyone ready to make this their career",
            ],
        },
        step2_in_progress: {
            welcomeMessage: "You're building your women's health practice. Every woman you help creates ripples of change.",
            actionLabel: "Continue Building",
            actionHref: "/my-courses",
            motivation: "Women trust other women. Your practice will grow through the lives you transform.",
            nextUnlockTitle: "Step 3: Advanced Women's Health Expert",
            nextUnlockBenefits: [
                "Complex hormonal case management",
                "Premium positioning in women's health",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Specialists wanting to go deeper",
                "Those ready for complex cases",
                "Anyone wanting expert-level recognition",
            ],
        },
        step2_completed: {
            welcomeMessage: "You've built a solid foundation. Ready to become the women's health expert everyone refers to?",
            actionLabel: "Explore Advanced Track",
            actionHref: "/tracks/womens-health",
            motivation: "The Advanced track is where specialists become the experts women trust most.",
            nextUnlockTitle: "Step 3: Advanced Women's Health Expert",
            nextUnlockBenefits: [
                "Advanced hormonal protocols",
                "Authority in women's health",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Successful specialists ready to level up",
                "Those wanting to handle complex cases",
                "Anyone ready for premium positioning",
            ],
        },
        step3_available: {
            welcomeMessage: "You've earned this. The Advanced track is where you become THE women's health expert in your area.",
            actionLabel: "View Advanced Track",
            actionHref: "/tracks/womens-health",
            motivation: "Become the specialist other practitioners refer their complex cases to.",
            nextUnlockTitle: "Step 3: Advanced Women's Health Expert",
            nextUnlockBenefits: [
                "Complex case mastery",
                "Premium client attraction",
                "Income potential: $10K–$30K/month",
            ],
            idealFor: [
                "Specialists ready for expert status",
                "Those wanting waitlist-worthy practices",
                "Anyone ready to lead in women's health",
            ],
        },
        step3_in_progress: {
            welcomeMessage: "You're becoming the women's health expert that women need. This training sets you apart.",
            actionLabel: "Continue Advanced Training",
            actionHref: "/my-courses",
            motivation: "Every module deepens your expertise in women's wellness.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you business systems",
                "Group women's health programs",
                "Income potential: $30K–$50K/month",
            ],
            idealFor: [
                "Experts ready to scale their impact",
                "Those wanting to help more women",
                "Anyone building a women's health empire",
            ],
        },
        step4_available: {
            welcomeMessage: "You've mastered women's health. Now it's time to scale your impact to serve more women.",
            actionLabel: "Apply for Business Scaler",
            actionHref: "/tracks/womens-health#step-4",
            motivation: "Build systems that let you serve more women without burning out.",
            nextUnlockTitle: "Step 4: Business Scaler",
            nextUnlockBenefits: [
                "Done-for-you funnels and marketing",
                "Group program development",
                "Income potential: $30K–$50K/month+",
            ],
            idealFor: [
                "Successful specialists ready to scale",
                "Those wanting to reach more women",
                "Anyone building a legacy in women's health",
            ],
        },
        step4_active: {
            welcomeMessage: "You're in the scaling phase. Your expertise can now reach women you'll never meet personally.",
            actionLabel: "Continue with Mentorship",
            actionHref: "/messages",
            motivation: "Focus on building systems that multiply your impact on women's lives.",
            nextUnlockTitle: "Faculty & Mentor Status",
            nextUnlockBenefits: [
                "Train other women's health specialists",
                "Build authority in the field",
                "Create lasting impact",
            ],
            idealFor: [
                "Leaders ready to train others",
                "Those wanting to shape women's health care",
                "Anyone building a legacy",
            ],
        },
    },
};

// Tag to Track mapping
export const TAG_TO_TRACK: Record<string, SpecializationTrack> = {
    // Primary interest tags
    "interest:functional-medicine": FUNCTIONAL_MEDICINE_TRACK,
    "interest:health-coach": HEALTH_COACH_TRACK,
    "interest:menopause": MENOPAUSE_TRACK,
    "interest:perimenopause": MENOPAUSE_TRACK,
    "interest:gut-health": GUT_HEALTH_TRACK,
    "interest:womens-health": WOMENS_HEALTH_TRACK,

    // Lead opt-in tags (from mini-diplomas)
    "lead:functional-medicine": FUNCTIONAL_MEDICINE_TRACK,
    "lead:health-coach": HEALTH_COACH_TRACK,
    "lead:menopause": MENOPAUSE_TRACK,
    "lead:perimenopause": MENOPAUSE_TRACK,
    "lead:gut-health": GUT_HEALTH_TRACK,
    "lead:womens-health": WOMENS_HEALTH_TRACK,

    // Mini-diploma completion tags
    "completed:functional-medicine-mini-diploma": FUNCTIONAL_MEDICINE_TRACK,
    "completed:health-coach-mini-diploma": HEALTH_COACH_TRACK,
    "completed:menopause-mini-diploma": MENOPAUSE_TRACK,
    "completed:gut-health-mini-diploma": GUT_HEALTH_TRACK,
    "completed:womens-health-mini-diploma": WOMENS_HEALTH_TRACK,
};

// Get specialization track for a user based on their tags
export function getSpecializationTrack(userTags: string[]): SpecializationTrack {
    // Priority order: lead tags > interest tags > completed tags
    const priorityPrefixes = ["lead:", "interest:", "completed:"];

    for (const prefix of priorityPrefixes) {
        for (const tag of userTags) {
            if (tag.startsWith(prefix) && TAG_TO_TRACK[tag]) {
                return TAG_TO_TRACK[tag];
            }
        }
    }

    // Default to Functional Medicine if no matching tag
    return FUNCTIONAL_MEDICINE_TRACK;
}

// Get all available specialization tracks
export function getAllSpecializationTracks(): SpecializationTrack[] {
    return [
        FUNCTIONAL_MEDICINE_TRACK,
        HEALTH_COACH_TRACK,
        MENOPAUSE_TRACK,
        GUT_HEALTH_TRACK,
        WOMENS_HEALTH_TRACK,
    ];
}
