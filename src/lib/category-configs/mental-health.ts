import {
    Heart,
    Brain,
    Shield,
    Users,
    Sparkles,
    Puzzle,
    HeartHandshake,
    Lightbulb,
} from "lucide-react";
import { CategoryConfig } from "./types";

/**
 * Mental-Health Category Config
 * Covers: NR (NARC Recovery), ND (Neurodiversity), GL (Grief & Loss) niches
 * Coach: Olivia
 */
export const mentalHealthConfig: CategoryConfig = {
    // Identity
    id: "mental-health",
    name: "Mental Health & Trauma Recovery",
    code: "MH",

    // Visual
    color: "blue",
    colorClasses: {
        bg: "bg-blue-700",
        bgGradient: "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700",
        text: "text-blue-700",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
    },

    // Career Paths
    careerPaths: [
        {
            id: "narc-recovery-coach",
            title: "Narcissistic Abuse Recovery Coach",
            subtitle: "Help survivors heal from toxic relationships",
            description: "Guide clients through trauma bond recovery, rebuilding self-worth, and creating healthy boundaries. Work with survivors of narcissistic abuse, gaslighting, and emotional manipulation.",
            icon: HeartHandshake,
            color: "rose",
            gradient: "from-rose-500 to-rose-600",
            income: "$60K – $140K",
            timeline: "6–12 months",
            clientTypes: "Abuse survivors, codependents, those leaving toxic relationships",
            deliveredThrough: [
                "NARC Recovery Certification (Step 1)",
                "Trauma Bond Specialist Track",
            ],
            ctaText: "Start NARC Track",
            ctaLink: "/tracks/narc-recovery",
        },
        {
            id: "autism-adhd-specialist",
            title: "Autism & ADHD Support Specialist",
            subtitle: "Empower neurodivergent individuals and their families",
            description: "Support autistic individuals, those with ADHD, and their families with coaching, strategies, and advocacy. High demand in schools, families, and adult diagnosis support.",
            icon: Puzzle,
            color: "purple",
            gradient: "from-purple-500 to-purple-600",
            income: "$50K – $120K",
            timeline: "8–14 months",
            clientTypes: "Neurodivergent adults, parents of ND children, schools",
            deliveredThrough: [
                "ADHD Support Specialist Certification",
                "Neurodiversity Family Coach Track",
            ],
            ctaText: "Explore ND Path",
            ctaLink: "/tracks/neurodiversity",
        },
        {
            id: "grief-loss-coach",
            title: "Grief & Loss Recovery Coach",
            subtitle: "Support those navigating life's most difficult transitions",
            description: "Help clients process grief from death, divorce, job loss, and major life changes. Provide compassionate support through the stages of grief and rebuilding.",
            icon: Heart,
            color: "slate",
            gradient: "from-slate-500 to-slate-600",
            income: "$45K – $100K",
            timeline: "6–10 months",
            clientTypes: "Bereaved individuals, divorcees, major life transitions",
            deliveredThrough: [
                "Grief & Loss Coach Certification",
                "Trauma-Informed Care Specialist",
            ],
            ctaText: "Start Grief Path",
            ctaLink: "/tracks/grief-loss",
        },
        {
            id: "trauma-specialist",
            title: "Trauma-Informed Wellness Coach",
            subtitle: "Integrate trauma-sensitive practices across all coaching",
            description: "Become an expert in nervous system regulation, somatic approaches, and trauma-informed care. Work with complex trauma, PTSD, and anxiety disorders.",
            icon: Brain,
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
            income: "$70K – $160K",
            timeline: "10–16 months",
            clientTypes: "PTSD, anxiety disorders, complex trauma survivors",
            deliveredThrough: [
                "Complete Mental Health Track (Steps 1–3)",
                "Somatic & Nervous System Specialist",
            ],
            ctaText: "View Trauma Track",
            ctaLink: "/tracks/mental-health#advanced",
        },
    ],

    // Success Stories
    successStories: [
        {
            name: "Rachel M.",
            role: "NARC Recovery Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg",
            quote: "I turned my own healing journey into a thriving practice. Now helping 20+ clients monthly.",
            income: "$84K/year",
            rating: 5,
        },
        {
            name: "Melissa K.",
            role: "Autism Family Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg",
            quote: "As an autism mom myself, I now guide other families. The certification gave me credibility.",
            income: "$72K/year",
            rating: 5,
        },
        {
            name: "Jennifer S.",
            role: "ADHD Success Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
            quote: "Helping adults finally understand their ADHD brain changed my life and theirs.",
            income: "$96K/year",
            rating: 5,
        },
        {
            name: "Diana P.",
            role: "Grief Support Specialist",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg",
            quote: "After losing my husband, I found purpose in helping others navigate loss.",
            income: "$66K/year",
            rating: 5,
        },
        {
            name: "Christine L.",
            role: "Trauma Recovery Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1235.jpeg",
            quote: "Complex trauma is my specialty. My clients feel truly seen for the first time.",
            income: "$108K/year",
            rating: 5,
        },
        {
            name: "Angela W.",
            role: "Codependency Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/89C2493E-DCEC-43FB-9A61-1FB969E45B6F_1_105_c.jpeg",
            quote: "From people-pleaser to empowered coach. Now running group programs for codependents.",
            income: "$120K/year",
            rating: 5,
        },
        {
            name: "Stephanie R.",
            role: "Child Loss Grief Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Cover-photo-for-Functional-Wellness.jpg",
            quote: "The most meaningful work I've ever done. Supporting bereaved parents is my calling.",
            income: "$78K/year",
            rating: 5,
        },
        {
            name: "Veronica H.",
            role: "Neurodivergent Adult Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/mini-diploma-functional-medicine.jpeg",
            quote: "Late-diagnosed autistic adults are my niche. There's so much demand for this work.",
            income: "$90K/year",
            rating: 5,
        },
    ],

    // Income Paths
    incomePaths: [
        {
            level: "Part-Time Coach",
            range: "$1K – $3K/month",
            description: "5–10 clients, flexible hours",
            step: "Step 1–2",
            stepColor: "blue",
            perfectFor: "Survivors turned coaches, school counselors expanding, social workers side-hustling",
        },
        {
            level: "Full-Time Coach",
            range: "$4K – $8K/month",
            description: "15–25 clients, full practice",
            step: "Step 2",
            stepColor: "purple",
            perfectFor: "Therapists adding coaching, stay-at-home parents, career changers with lived experience",
        },
        {
            level: "Group Programs",
            range: "$8K – $20K/month",
            description: "Support groups + courses",
            step: "Step 3",
            stepColor: "indigo",
            perfectFor: "Established coaches, speakers, authors, community builders",
        },
        {
            level: "Agency Owner",
            range: "$20K – $75K+/month",
            description: "Team of coaches, multiple programs",
            step: "Step 4",
            stepColor: "slate",
            perfectFor: "Leaders building mental health coaching practices, franchise models",
        },
    ],

    // Onboarding Interests
    onboardingInterests: [
        { id: "narc-abuse", label: "Narcissistic Abuse Recovery" },
        { id: "trauma-bonds", label: "Trauma Bonds & Codependency" },
        { id: "autism", label: "Autism Support" },
        { id: "adhd", label: "ADHD Coaching" },
        { id: "sensory-processing", label: "Sensory Processing" },
        { id: "grief-loss", label: "Grief & Loss" },
        { id: "anxiety", label: "Anxiety & Panic" },
        { id: "ptsd", label: "PTSD & Complex Trauma" },
        { id: "emotional-regulation", label: "Emotional Regulation" },
        { id: "nervous-system", label: "Nervous System Healing" },
        { id: "family-support", label: "Neurodivergent Family Support" },
        { id: "boundaries", label: "Boundaries & Self-Worth" },
    ],

    // Mapping
    nicheCodes: ["NR", "ND", "GL"],
    courseSlugs: [
        "narcissistic-abuse-recovery-coach",
        "nr-pro-advanced",
        "nr-pro-master",
        "nr-pro-practice",
        "certified-adhd-support-specialist",
        "nd-pro-advanced",
        "nd-pro-master",
        "nd-pro-practice",
        "grief-and-loss-coach",
        "gl-pro-advanced",
        "gl-pro-master",
        "gl-pro-practice",
    ],

    // Coach
    coachPersonaKey: "mental-health",

    // Stats
    stats: {
        certifiedCount: 892,
        avgMonthlyIncome: "$6K",
        rating: 4.9,
    },
};
