import {
    Heart,
    Zap,
    Briefcase,
    Leaf,
    Brain,
    Shield,
    Moon,
    Droplets,
    Apple,
    Sparkles,
} from "lucide-react";
import { CategoryConfig } from "./types";

/**
 * FM-Health Category Config
 * Covers: FM, HN, WH, IM niches
 * Coach: Sarah M.
 */
export const fmHealthConfig: CategoryConfig = {
    // Identity
    id: "fm-health",
    name: "Health & Functional Medicine",
    code: "FM",

    // Visual
    color: "burgundy",
    colorClasses: {
        bg: "bg-burgundy-700",
        bgGradient: "bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700",
        text: "text-burgundy-700",
        border: "border-burgundy-200",
        badge: "bg-burgundy-100 text-burgundy-700",
    },

    // Career Paths (from existing FM specializations)
    careerPaths: [
        {
            id: "health-coach",
            title: "Functional Medicine Health Coach",
            subtitle: "Transform lives through root-cause health coaching",
            description: "Help clients identify and address the underlying causes of their health issues using functional medicine principles. Work with clients on nutrition, lifestyle, and behavior change.",
            icon: Heart,
            color: "burgundy",
            gradient: "from-burgundy-500 to-burgundy-600",
            income: "$50K – $120K",
            timeline: "6–12 months",
            clientTypes: "Chronic fatigue, digestive issues, weight management",
            deliveredThrough: [
                "14-Module FM Certification (Step 1)",
                "Health Coaching Core Specialization",
            ],
            ctaText: "Start FM Track",
            ctaLink: "/tracks/functional-medicine",
        },
        {
            id: "nutrition-specialist",
            title: "Functional Nutrition Specialist",
            subtitle: "Master dietary protocols and therapeutic nutrition",
            description: "Specialize in creating personalized nutrition plans, elimination diets, and food-as-medicine protocols. High demand in gut health and metabolic conditions.",
            icon: Zap,
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
            income: "$60K – $150K",
            timeline: "8–14 months",
            clientTypes: "Gut issues, autoimmune, blood sugar, weight loss",
            deliveredThrough: [
                "FM Certification + Nutrition Modules",
                "Gut Health or Metabolic Specialization",
            ],
            ctaText: "Explore Nutrition Path",
            ctaLink: "/tracks/functional-medicine",
        },
        {
            id: "wellness-entrepreneur",
            title: "Wellness Practice Owner",
            subtitle: "Build a thriving coaching business with multiple revenue streams",
            description: "Go beyond 1:1 coaching to build courses, group programs, and eventually a team of coaches. Create passive income and impact thousands.",
            icon: Briefcase,
            color: "purple",
            gradient: "from-purple-500 to-purple-600",
            income: "$80K – $250K+",
            timeline: "12–18 months",
            clientTypes: "Corporate wellness, online audiences, group coaching",
            deliveredThrough: [
                "Complete any FM Specialization (Steps 1–3)",
                "Business Scaler Program (Step 4)",
            ],
            ctaText: "View Business Scaler",
            ctaLink: "/tracks/functional-medicine#step-4",
        },
    ],

    // Success Stories
    successStories: [
        {
            name: "Tiffany R.",
            role: "FM Health Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg",
            quote: "I went from corporate burnout to $8K/month in just 6 months. Best decision ever!",
            income: "$96K/year",
            rating: 5,
        },
        {
            name: "Addison T.",
            role: "Gut Health Specialist",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg",
            quote: "The certification gave me the credibility I needed. Now I have a waitlist!",
            income: "$120K/year",
            rating: 5,
        },
        {
            name: "Martha W.",
            role: "Hormone Health Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
            quote: "Finally helping women with PCOS and perimenopause. My clients love me!",
            income: "$84K/year",
            rating: 5,
        },
        {
            name: "Teresa L.",
            role: "Nutrition Specialist",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg",
            quote: "Left my corporate job at 45. Now earning more helping people heal.",
            income: "$108K/year",
            rating: 5,
        },
        {
            name: "Emilia F.",
            role: "Wellness Practitioner",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1235.jpeg",
            quote: "Started with zero experience. Now running my own virtual practice!",
            income: "$72K/year",
            rating: 5,
        },
        {
            name: "Janet H.",
            role: "FM Business Owner",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/89C2493E-DCEC-43FB-9A61-1FB969E45B6F_1_105_c.jpeg",
            quote: "Built a team of 3 coaches. AccrediPro gave me the blueprint!",
            income: "$180K/year",
            rating: 5,
        },
        {
            name: "Ashley E.",
            role: "Stress & HPA Coach",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Cover-photo-for-Functional-Wellness.jpg",
            quote: "Helping burned-out executives reclaim their health. So fulfilling!",
            income: "$96K/year",
            rating: 5,
        },
        {
            name: "Luna C.",
            role: "Autoimmune Specialist",
            avatar: "https://accredipro.academy/wp-content/uploads/2025/12/mini-diploma-functional-medicine.jpeg",
            quote: "Complex cases, premium rates. The advanced training was worth it!",
            income: "$144K/year",
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
            stepColor: "emerald",
            perfectFor: "Stay-at-home moms, nurses looking for side income, corporate professionals testing the waters",
        },
        {
            level: "Full-Time Coach",
            range: "$5K – $10K/month",
            description: "15–25 clients, full practice",
            step: "Step 2",
            stepColor: "amber",
            perfectFor: "Career changers, burned-out healthcare workers, retired professionals seeking purpose",
        },
        {
            level: "Group Programs",
            range: "$10K – $25K/month",
            description: "Courses + group coaching",
            step: "Step 3",
            stepColor: "blue",
            perfectFor: "Established coaches ready to scale, educators, wellness entrepreneurs seeking leverage",
        },
        {
            level: "Agency Owner",
            range: "$25K – $100K+/month",
            description: "Team of coaches, multiple programs",
            step: "Step 4",
            stepColor: "burgundy",
            perfectFor: "Ambitious entrepreneurs, former business owners, leaders ready to build a wellness empire",
        },
    ],

    // Onboarding Interests
    onboardingInterests: [
        { id: "gut-health", label: "Gut Health & Digestion" },
        { id: "hormone-balance", label: "Hormone Balance" },
        { id: "womens-health", label: "Women's Health" },
        { id: "weight-management", label: "Weight Management" },
        { id: "functional-nutrition", label: "Functional Nutrition" },
        { id: "mental-wellness", label: "Mental Wellness & Anxiety" },
        { id: "stress-burnout", label: "Stress & Burnout" },
        { id: "sleep", label: "Sleep Optimization" },
        { id: "autoimmune", label: "Autoimmune Conditions" },
        { id: "sports-nutrition", label: "Sports & Fitness Nutrition" },
        { id: "anti-aging", label: "Anti-Aging & Longevity" },
        { id: "holistic-wellness", label: "Holistic Wellness" },
    ],

    // Mapping
    nicheCodes: ["FM", "HN", "WH", "IM"],
    courseSlugs: [
        "functional-medicine-complete-certification",
        "fm-preview",
        "fm-pro-advanced-clinical",
        "fm-pro-master-depth",
        "fm-pro-practice-path",
        "certified-holistic-nutrition-coach",
        "hn-pro-advanced",
        "hn-pro-master",
        "hn-pro-practice",
        "women-s-hormone-health-coach",
        "wh-pro-advanced",
        "wh-pro-master",
        "wh-pro-practice",
        "integrative-medicine-practitioner",
        "im-pro-advanced",
        "im-pro-master",
        "im-pro-practice",
    ],

    // Coach
    coachPersonaKey: "fm-health",

    // Stats
    stats: {
        certifiedCount: 1447,
        avgMonthlyIncome: "$8K",
        rating: 4.9,
    },
};
