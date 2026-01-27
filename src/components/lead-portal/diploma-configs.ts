import { DiplomaConfig } from "./LeadPortalDashboard";

// Configuration for all mini diploma portals
export const DIPLOMA_CONFIGS: Record<string, DiplomaConfig> = {
    "functional-medicine-diploma": {
        slug: "functional-medicine-diploma",
        name: "Functional Medicine Certification",
        shortName: "Functional Medicine",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Foundations",
                description: "Core principles of functional medicine",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Root Cause Medicine", duration: "8 min" },
                    { id: 2, title: "The Gut Foundation", duration: "7 min" },
                    { id: 3, title: "The Inflammation Connection", duration: "6 min" },
                ],
            },
            {
                id: 2,
                title: "Core Concepts",
                description: "Deep dive into key mechanisms",
                icon: "Target",
                lessons: [
                    { id: 4, title: "The Toxin Burden", duration: "7 min" },
                    { id: 5, title: "Stress & The HPA Axis", duration: "8 min" },
                    { id: 6, title: "Nutrient Deficiencies", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Application",
                description: "Putting it all into practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Functional Lab Interpretation", duration: "9 min" },
                    { id: 8, title: "Building Protocols", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
    },
    "womens-health-diploma": {
        slug: "womens-health-diploma",
        name: "Women's Health Certification",
        shortName: "Women's Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Hormone Foundations",
                description: "Understanding the female hormone system",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Hormone Symphony", duration: "8 min" },
                    { id: 2, title: "Estrogen & Progesterone", duration: "7 min" },
                    { id: 3, title: "The Menstrual Cycle", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Life Stages",
                description: "Hormones through the decades",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Perimenopause Essentials", duration: "8 min" },
                    { id: 5, title: "Menopause Mastery", duration: "8 min" },
                    { id: 6, title: "Post-Menopause Thriving", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Practical Application",
                description: "Working with real clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Nutrition for Hormones", duration: "9 min" },
                    { id: 8, title: "Lifestyle Protocols", duration: "8 min" },
                    { id: 9, title: "Your Coaching Practice", duration: "6 min" },
                ],
            },
        ],
    },
    "gut-health-diploma": {
        slug: "gut-health-diploma",
        name: "Gut Health Certification",
        shortName: "Gut Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Gut Foundations",
                description: "Understanding the digestive system",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Gut-Brain Connection", duration: "8 min" },
                    { id: 2, title: "Microbiome Basics", duration: "7 min" },
                    { id: 3, title: "Leaky Gut Explained", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Core Protocols",
                description: "Healing the gut naturally",
                icon: "Target",
                lessons: [
                    { id: 4, title: "The 5R Protocol", duration: "9 min" },
                    { id: 5, title: "Elimination Diets", duration: "7 min" },
                    { id: 6, title: "Probiotics & Prebiotics", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Client Work",
                description: "Applying protocols with clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Gut Testing Interpretation", duration: "8 min" },
                    { id: 8, title: "Personalized Protocols", duration: "8 min" },
                    { id: 9, title: "Building Your Practice", duration: "5 min" },
                ],
            },
        ],
    },
    "hormone-health-diploma": {
        slug: "hormone-health-diploma",
        name: "Hormone Health Certification",
        shortName: "Hormone Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Hormone Basics",
                description: "The endocrine system explained",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Endocrine System", duration: "8 min" },
                    { id: 2, title: "Key Hormone Players", duration: "7 min" },
                    { id: 3, title: "Hormone Imbalance Signs", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Hormone Optimization",
                description: "Natural hormone balancing",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Thyroid Health", duration: "9 min" },
                    { id: 5, title: "Adrenal Function", duration: "8 min" },
                    { id: 6, title: "Blood Sugar Balance", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Practitioner Skills",
                description: "Working with hormone clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Hormone Testing", duration: "8 min" },
                    { id: 8, title: "Protocol Development", duration: "8 min" },
                    { id: 9, title: "Your Next Steps", duration: "5 min" },
                ],
            },
        ],
    },
    "holistic-nutrition-diploma": {
        slug: "holistic-nutrition-diploma",
        name: "Holistic Nutrition Certification",
        shortName: "Holistic Nutrition",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Nutrition Foundations",
                description: "The science of whole foods nutrition",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Whole Foods Philosophy", duration: "8 min" },
                    { id: 2, title: "Macronutrient Balance", duration: "7 min" },
                    { id: 3, title: "Micronutrient Essentials", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Therapeutic Nutrition",
                description: "Food as medicine approaches",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Anti-Inflammatory Eating", duration: "8 min" },
                    { id: 5, title: "Detoxification Support", duration: "7 min" },
                    { id: 6, title: "Blood Sugar Protocols", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Client Practice",
                description: "Building your nutrition practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Nutrition Assessment", duration: "9 min" },
                    { id: 8, title: "Meal Planning Mastery", duration: "8 min" },
                    { id: 9, title: "Growing Your Practice", duration: "5 min" },
                ],
            },
        ],
    },
    "nurse-coach-diploma": {
        slug: "nurse-coach-diploma",
        name: "Nurse Coach Certification",
        shortName: "Nurse Coach",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Coaching Foundations",
                description: "From nurse to coach mindset shift",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Nurse Coach Model", duration: "8 min" },
                    { id: 2, title: "Coaching vs. Nursing", duration: "7 min" },
                    { id: 3, title: "Your Unique Value", duration: "6 min" },
                ],
            },
            {
                id: 2,
                title: "Coaching Skills",
                description: "Essential coaching techniques",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Active Listening", duration: "8 min" },
                    { id: 5, title: "Powerful Questions", duration: "7 min" },
                    { id: 6, title: "Goal Setting with Clients", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Business Building",
                description: "Starting your coaching practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Finding Your Niche", duration: "8 min" },
                    { id: 8, title: "Pricing & Packages", duration: "8 min" },
                    { id: 9, title: "Getting First Clients", duration: "6 min" },
                ],
            },
        ],
    },
    "health-coach-diploma": {
        slug: "health-coach-diploma",
        name: "Health Coach Certification",
        shortName: "Health Coaching",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Coaching Essentials",
                description: "Foundation of health coaching",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "What is Health Coaching?", duration: "7 min" },
                    { id: 2, title: "Behavior Change Science", duration: "8 min" },
                    { id: 3, title: "The Coaching Conversation", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Health Domains",
                description: "Key areas of health coaching",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Nutrition Coaching", duration: "8 min" },
                    { id: 5, title: "Movement & Exercise", duration: "7 min" },
                    { id: 6, title: "Stress & Sleep", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Building Your Practice",
                description: "Launch your coaching business",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Your Coaching Niche", duration: "8 min" },
                    { id: 8, title: "Client Sessions", duration: "9 min" },
                    { id: 9, title: "Marketing Yourself", duration: "6 min" },
                ],
            },
        ],
    },
    "christian-coaching-diploma": {
        slug: "christian-coaching-diploma",
        name: "Christian Life Coaching Certification",
        shortName: "Christian Coaching",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Welcome & Foundation",
                description: "Introduction to Christian life coaching",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Coaching Mindset", duration: "7 min" },
                    { id: 2, title: "Active Listening", duration: "6 min" },
                    { id: 3, title: "Powerful Questions", duration: "6 min" },
                ],
            },
            {
                id: 2,
                title: "The Faith Framework",
                description: "Biblical principles for coaching",
                icon: "Target",
                lessons: [
                    { id: 4, title: "The FAITH Framework", duration: "8 min" },
                    { id: 5, title: "Goal Setting with God", duration: "7 min" },
                    { id: 6, title: "Overcoming Obstacles", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Building Your Practice",
                description: "Turning your calling into a practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Finding Your Niche", duration: "7 min" },
                    { id: 8, title: "Pricing Your Services", duration: "6 min" },
                    { id: 9, title: "Your Next Steps", duration: "5 min" },
                ],
            },
        ],
    },
};
