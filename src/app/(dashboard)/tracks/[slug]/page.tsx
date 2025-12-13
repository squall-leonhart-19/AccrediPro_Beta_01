import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TrackContent } from "./track-content";

// CRO-Optimized Track Data - Clean 4-Step Career Pathway
const TRACKS = {
    "functional-medicine": {
        slug: "functional-medicine",
        name: "Functional Medicine",
        fullName: "Functional Medicine Specialization Track",
        tagline: "Career Roadmap",
        heroTitle: "Become a Certified Functional Medicine Practitioner",
        heroDescription: "A complete professional pathway designed to take you from certification to scalable practice income.",
        icon: "Leaf",
        gradient: "from-burgundy-700 via-burgundy-600 to-burgundy-800",
        accentGradient: "from-gold-400 to-gold-500",
        bgColor: "bg-burgundy-50",
        borderColor: "border-burgundy-200",
        format: "100% Online · Self-Paced",
        access: "Lifetime Access",
        instructor: "Sarah Mitchell",
        instructorTitle: "Lead Functional Medicine Educator",
        // WHERE YOU ARE NOW - emotional anchor
        whereYouAreNow: {
            headline: "You've done the research. You know this is your path.",
            subtext: "But something's still missing...",
            painPoints: [
                "You're certified in something — but you don't feel clinically confident yet",
                "You're passionate about health — but unsure how to actually work professionally",
                "You're already helping people — but without structure, authority, or consistent income",
            ],
            resolution: "This roadmap shows you exactly how to go from where you are now → to a confident, income-generating practitioner.",
        },
        // Rating info
        rating: 4.9,
        totalReviews: 847,
        totalStudents: 2340,
        // Credentials earned across the track
        credentials: [
            "Certified Functional Medicine Health Coach",
            "Recognized FM Practitioner Status",
            "Advanced Practitioner Certification",
            "Master Practitioner Status",
        ],
        // The 4-Step Career Ladder
        steps: [
            {
                step: 1,
                color: "emerald",
                status: "available",
                stepLabel: "STEP 1",
                title: "CERTIFIED PRACTITIONER",
                subtitle: "The Main Course",
                name: "Functional Medicine Health Coach Certification",
                tagline: "Certification + Practitioner Status Included",
                slug: "functional-medicine-health-coach",
                price: "$997",
                priceValue: 997,
                accessNote: "Self-Paced · Lifetime Access",
                badge: "CERTIFICATION",
                // Question this step answers
                questionItAnswers: "Can I do this professionally?",
                // What this step represents
                represents: "I have the clinical knowledge, ethical scope, and tools to work as a Functional Medicine Practitioner.",
                // Core professional training (3 buckets)
                coreTraining: [
                    "Clinical foundations, functional labs, and protocols",
                    "Ethical scope, case management, and practitioner standards",
                    "Practice setup, accreditation, and professional readiness",
                ],
                // Course structure
                structure: {
                    modules: 21,
                    lessons: "150+",
                    includes: "Clinical + Practice Training",
                },
                // Income vision
                incomeVision: {
                    starting: "$3K–$5K/month",
                    fullTime: "$5K+/month",
                    note: "as a full-time practitioner",
                },
                ctaText: "This is the foundation of everything else.",
                isMainCourse: true,
            },
            {
                step: 2,
                color: "amber",
                status: "available",
                stepLabel: "STEP 2",
                title: "WORKING PRACTITIONER",
                subtitle: "Income in Motion",
                name: "Practice & Income Path",
                tagline: "Turn your certification into paying clients",
                slug: "practice-income-path",
                price: "$1,997",
                priceValue: 1997,
                accessNote: "Self-Paced · Lifetime Access",
                badge: "PRACTICE",
                // Question this step answers
                questionItAnswers: "Can I get real clients?",
                // What this step represents
                represents: "I'm turning my certification into real, consistent clients.",
                // Core professional training (3 buckets)
                coreTraining: [
                    "Practice setup, branding, and professional positioning",
                    "Client acquisition through ethical, referral-based strategies",
                    "Systems for retention, scaling, and sustainable income",
                ],
                // Course structure
                structure: {
                    modules: 12,
                    lessons: "60+",
                    includes: "Business + Marketing Training",
                },
                // Ethical frame
                ethicalFrame: {
                    intro: "This step is designed for practitioners who want clients, without pressure, hype, or aggressive marketing.",
                    values: ["Ethical", "Referral-based first", "Sustainable for real life"],
                },
                // Detailed curriculum
                curriculum: [
                    {
                        module: "Module 1-3",
                        title: "Practice Foundations",
                        topics: ["Professional branding", "Niche positioning", "Legal & business setup", "Pricing strategy"],
                    },
                    {
                        module: "Module 4-6",
                        title: "Client Acquisition",
                        topics: ["Organic lead generation", "Referral systems", "Partnership building", "Content strategy"],
                    },
                    {
                        module: "Module 7-9",
                        title: "Sales & Conversion",
                        topics: ["Discovery calls", "Ethical sales conversations", "Objection handling", "Enrollment process"],
                    },
                    {
                        module: "Module 10-12",
                        title: "Systems & Scaling",
                        topics: ["Client retention systems", "Automation tools", "Time management", "Early scaling foundations"],
                    },
                ],
                // What's included
                whatHappensHere: [
                    "Complete practice setup blueprint",
                    "Client acquisition playbook",
                    "Organic lead generation strategies",
                    "Referral & partnership systems",
                    "Sales conversation scripts",
                    "Client retention frameworks",
                    "Automation & systems templates",
                    "Weekly coaching calls (optional)",
                ],
                // Outcome visualization
                outcomeVisualization: [
                    "Signing clients consistently every month",
                    "Running structured paid programs",
                    "Building momentum and referrals",
                    "Working with dream clients",
                ],
                // Income vision
                incomeVision: {
                    starting: "$5K–$10K/month",
                    fullTime: "$10K+/month",
                    note: "with systems in place",
                },
                ctaText: "Turn your certification into consistent income.",
            },
            {
                step: 3,
                color: "blue",
                status: "launching",
                stepLabel: "STEP 3",
                title: "ADVANCED + MASTER",
                subtitle: "Senior-Level Track",
                name: "Advanced & Master Practitioner Track",
                tagline: "Opens after Step 1 completion",
                slug: "advanced-master-practitioner",
                price: "$2,997",
                priceValue: 2997,
                accessNote: "Launching Soon · Senior-Level",
                badge: "ADVANCED",
                // Question this step answers
                questionItAnswers: "Can I charge more and be taken seriously?",
                // What this step represents
                represents: "I operate at a higher professional tier and handle complex cases with confidence.",
                // Core professional training (3 buckets)
                coreTraining: [
                    "Advanced clinical protocols and complex case management",
                    "Premium positioning, authority building, and thought leadership",
                    "Teaching, mentoring, and institutional credibility",
                ],
                // Course structure
                structure: {
                    modules: "30+",
                    lessons: "200+",
                    includes: "Advanced + Master Bundle",
                    advanced: "14–16 modules",
                    master: "16–20 modules",
                    taughtBy: "NBHWC-certified coaches & industry leaders",
                },
                // Strategic note
                strategicNote: "This track opens only after Step 1 completion to maintain professional standards.",
                // Two-part curriculum
                advancedCurriculum: {
                    title: "Advanced Practitioner Track",
                    modules: "14–16 modules",
                    focus: "Clinical Depth & Complexity",
                    sections: [
                        {
                            section: "Section 1",
                            title: "Advanced Clinical Protocols",
                            topics: ["Complex hormone cases", "Multi-system dysfunction", "Advanced lab interpretation", "Specialty populations"],
                        },
                        {
                            section: "Section 2",
                            title: "Complex Case Management",
                            topics: ["Difficult client scenarios", "Co-morbidity management", "Referral networks", "Collaboration with MDs"],
                        },
                        {
                            section: "Section 3",
                            title: "Premium Practice",
                            topics: ["Premium pricing strategies", "High-ticket programs", "VIP client experiences", "Boutique practice model"],
                        },
                    ],
                },
                masterCurriculum: {
                    title: "Master Practitioner Track",
                    modules: "16–20 modules",
                    focus: "Leadership & Authority",
                    sections: [
                        {
                            section: "Section 1",
                            title: "Case Mastery",
                            topics: ["Expert-level case analysis", "Teaching complex cases", "Case study development", "Research integration"],
                        },
                        {
                            section: "Section 2",
                            title: "Authority Positioning",
                            topics: ["Thought leadership", "Speaking & media", "Publishing & content", "Industry recognition"],
                        },
                        {
                            section: "Section 3",
                            title: "Teaching & Mentoring",
                            topics: ["Curriculum development", "Mentoring practitioners", "Faculty opportunities", "Ethics at scale"],
                        },
                    ],
                },
                // What's included
                advancedIncludes: [
                    "Advanced clinical protocols",
                    "Complex case management frameworks",
                    "Premium pricing confidence",
                    "Specialty population training",
                    "MD collaboration strategies",
                ],
                masterIncludes: [
                    "Case mastery & expert analysis",
                    "Thought leadership development",
                    "Speaking & media training",
                    "Mentoring & teaching frameworks",
                    "Faculty pathway preparation",
                ],
                // Bundle benefits
                bundleBenefits: [
                    "Both tracks at discounted bundle price",
                    "Lifetime access to all content",
                    "Priority access to faculty opportunities",
                    "Exclusive mastermind community",
                    "Direct access to senior instructors",
                ],
                // Outcome visualization
                outcomeVisualization: [
                    "Handling the most complex cases with confidence",
                    "Charging premium rates ($500+/session)",
                    "Being sought after as an industry expert",
                    "Teaching and mentoring other practitioners",
                ],
                // Income vision
                incomeVision: {
                    advanced: "$10K–$20K/month",
                    master: "$20K–$30K+/month",
                    note: "with premium positioning",
                },
                ctaText: "Elevate to senior-level practitioner status.",
            },
            {
                step: 4,
                color: "burgundy",
                status: "available",
                stepLabel: "STEP 4",
                title: "BUSINESS SCALER",
                subtitle: "Private Mentorship",
                name: "Functional Medicine Business Acceleration",
                tagline: "By Application Only",
                slug: "business-acceleration",
                price: "Apply",
                priceValue: 0,
                accessNote: "Application Required",
                badge: "MENTORSHIP",
                isDoneForYou: true,
                // Question this step answers
                questionItAnswers: "Can I scale beyond my time?",
                // What this step represents
                represents: "I'm scaling beyond 1:1 and building leverage into my business.",
                // Core pillars (3 buckets)
                coreTraining: [
                    "Done-for-you business systems, funnels, and marketing",
                    "Team building, delegation, and operational scaling",
                    "Group programs, clinics, and leveraged income models",
                ],
                // Program structure
                structure: {
                    format: "Private Mentorship",
                    duration: "6-12 months",
                    includes: "Done-For-You + Strategy",
                },
                // What's included in mentorship
                mentorshipIncludes: {
                    doneForYou: [
                        "Complete funnel build & setup",
                        "Landing pages & sales pages",
                        "Email sequences & automation",
                        "Ad creative & copy",
                        "CRM & systems integration",
                    ],
                    strategy: [
                        "1:1 strategy calls (weekly/bi-weekly)",
                        "Custom scaling roadmap",
                        "Ads management guidance",
                        "Team hiring & training",
                        "Revenue optimization",
                    ],
                    support: [
                        "Private Slack/Voxer access",
                        "On-demand support",
                        "Monthly business reviews",
                        "Accountability check-ins",
                    ],
                },
                // Scaling models
                scalingModels: [
                    {
                        model: "Group Programs",
                        description: "Leverage your time with group coaching",
                        potential: "$20K–$50K/launch",
                    },
                    {
                        model: "Clinic/Team",
                        description: "Build a team of practitioners under you",
                        potential: "$30K–$100K/month",
                    },
                    {
                        model: "Digital Products",
                        description: "Courses, memberships, passive income",
                        potential: "$10K–$30K/month passive",
                    },
                    {
                        model: "Speaking/Corporate",
                        description: "High-ticket workshops & consulting",
                        potential: "$5K–$25K/engagement",
                    },
                ],
                // What happens here
                whatHappensHere: [
                    "Complete business built with you",
                    "Funnels & campaigns done-for-you",
                    "Paid ads execution (Meta/Google)",
                    "Team building & delegation systems",
                    "Group program creation",
                    "Clinic/practice expansion",
                    "Passive income development",
                    "Exit strategy planning (optional)",
                ],
                // Ideal for
                idealFor: [
                    "Practitioners earning $10K+/month ready to scale",
                    "Those who want done-for-you implementation",
                    "Busy practitioners who need systems built for them",
                    "Practitioners ready to hire team members",
                    "Those wanting to move beyond 1:1 client work",
                ],
                // Outcome visualization
                outcomeVisualization: [
                    "Running a scalable business with systems",
                    "Working fewer hours while earning more",
                    "Leading a team instead of doing everything yourself",
                    "Multiple revenue streams and leveraged income",
                ],
                // Income vision
                incomeVision: {
                    primary: "$30K–$50K/month",
                    potential: "$100K+/month",
                    note: "with systems and team",
                },
                // Application process
                applicationProcess: [
                    "Submit application form",
                    "Strategy call with team",
                    "Custom proposal & roadmap",
                    "Begin implementation",
                ],
                ctaText: "Scale beyond your time with done-for-you systems.",
            },
        ],
        // Future step (aspirational)
        futureStep: {
            title: "FACULTY / MENTOR STATUS",
            description: "Mentor other practitioners, teach inside AccrediPro, co-create programs, build institutional authority.",
            note: "Available to Master Practitioners",
        },
        // Done-for-you CTA
        doneForYou: {
            title: "Want Us To Build Your Practice?",
            subtitle: "Done-For-You Practice Building",
            description: "You focus on helping clients. We handle systems, marketing, funnels, and growth.",
            features: [
                "Complete practice setup",
                "Marketing systems",
                "Client acquisition funnels",
                "Ongoing mentorship",
            ],
            cta: "Apply for Private Mentorship",
            ctaLink: "https://calendly.com/accredipro/strategy-call",
        },
        // Coach info
        coach: {
            name: "Sarah Mitchell",
            title: "Lead Functional Medicine Educator",
            credentials: "NBHWC Certified · 15+ Years Experience",
            bio: "Sarah is a certified Functional Medicine practitioner who has trained hundreds of practitioners worldwide. Her approach combines clinical excellence with practical business guidance.",
        },
        // Success stories with income and ratings
        testimonials: [
            {
                name: "Jennifer R.",
                quote: "Within 6 months of completing Step 1, I was earning $5K/month working with clients part-time. The curriculum gave me everything I needed to feel confident.",
                role: "Certified FM Health Coach",
                income: "$5K+/month",
                step: 1,
                stepLabel: "Step 1 Graduate",
                rating: 5,
            },
            {
                name: "Michelle T.",
                quote: "Step 2's business training was the game-changer. I went from 'just certified' to running a real practice with paying clients within 90 days.",
                role: "Working Practitioner",
                income: "$8K/month",
                step: 2,
                stepLabel: "Step 2 Graduate",
                rating: 5,
            },
            {
                name: "David K.",
                quote: "The Advanced track took my practice to another level. I now handle complex cases and charge premium rates. Worth every investment.",
                role: "Advanced Practitioner",
                income: "$18K/month",
                step: 3,
                stepLabel: "Step 3 Graduate",
                rating: 5,
            },
        ],
    },
    "womens-health": {
        slug: "womens-health",
        name: "Women's Health",
        fullName: "Women's Health Specialization Track",
        tagline: "Career Roadmap",
        heroTitle: "Become a Certified Women's Health Coach",
        heroDescription: "Specialize in women's hormones, fertility, and lifecycle transitions.",
        motto: "Veritas et Excellentia",
        icon: "Heart",
        gradient: "from-burgundy-700 via-burgundy-600 to-burgundy-800",
        accentGradient: "from-gold-400 to-gold-500",
        bgColor: "bg-burgundy-50",
        borderColor: "border-burgundy-200",
        format: "100% Online · Self-Paced",
        access: "Lifetime Access",
        instructor: "Sarah Mitchell",
        instructorTitle: "Women's Health Specialist",
        credentials: [
            "Certified Women's Health Coach",
            "Hormone Health Specialist",
        ],
        steps: [
            {
                step: 1,
                color: "pink",
                status: "coming",
                stepLabel: "STEP 1",
                title: "HORMONE FOUNDATIONS",
                name: "Hormone Health Mini Diploma",
                slug: "hormone-health-foundations",
                price: "$297",
                priceValue: 297,
                accessNote: "Self-Paced · Lifetime Access",
                badge: "MINI_DIPLOMA",
                represents: "I understand female hormone fundamentals.",
                whatHappensHere: [
                    "Female hormone fundamentals",
                    "Cycle syncing strategies",
                    "Hormone balance protocols",
                    "Lifestyle interventions",
                ],
                incomeVision: {
                    starting: "Foundation for practice",
                },
            },
            {
                step: 2,
                color: "rose",
                status: "coming",
                stepLabel: "STEP 2",
                title: "CERTIFIED COACH",
                name: "Women's Health Certification",
                slug: "womens-health-certification",
                price: "$997",
                priceValue: 997,
                accessNote: "Self-Paced · Lifetime Access",
                badge: "CERTIFICATION",
                represents: "I'm a certified women's health professional.",
                whatHappensHere: [
                    "Complete hormone health coaching",
                    "Fertility & preconception",
                    "Perimenopause & menopause support",
                    "Client protocols & sessions",
                ],
                incomeVision: {
                    starting: "$5K–$10K/month",
                    note: "as a certified coach",
                },
            },
        ],
        coach: {
            name: "Sarah Mitchell",
            title: "Women's Health Specialist",
            credentials: "15+ Years Experience",
            bio: "Sarah specializes in women's hormonal health and has helped thousands of women reclaim their vitality.",
        },
        testimonials: [
            {
                name: "Amanda K.",
                quote: "Finally understood my hormones after years of confusion. Now I help other women do the same!",
                role: "Future Graduate",
            },
        ],
        doneForYou: {
            title: "Want Us To Build Your Practice?",
            subtitle: "Done-For-You Practice Building",
            description: "You focus on helping clients. We handle everything else.",
            features: ["Complete practice setup", "Marketing systems", "Client acquisition", "Ongoing support"],
            cta: "Book a Strategy Call",
            ctaLink: "https://calendly.com/accredipro/strategy-call",
        },
    },
    "coaching-business": {
        slug: "coaching-business",
        name: "Coaching Business",
        fullName: "Coaching Business Track",
        tagline: "Career Roadmap",
        heroTitle: "Build a Profitable Coaching Practice",
        heroDescription: "Transform your certification into consistent income with proven systems.",
        motto: "Veritas et Excellentia",
        icon: "TrendingUp",
        gradient: "from-burgundy-700 via-burgundy-600 to-burgundy-800",
        accentGradient: "from-gold-400 to-gold-500",
        bgColor: "bg-burgundy-50",
        borderColor: "border-burgundy-200",
        format: "100% Online · Self-Paced",
        access: "Lifetime Access",
        instructor: "Sarah Mitchell",
        instructorTitle: "Business Coach & Mentor",
        credentials: [
            "Business Foundations Certificate",
            "Client Attraction Mastery",
        ],
        steps: [
            {
                step: 1,
                color: "blue",
                status: "coming",
                stepLabel: "STEP 1",
                title: "BUSINESS FOUNDATIONS",
                name: "Coaching Business Foundations",
                slug: "coaching-business-foundations",
                price: "$197",
                priceValue: 197,
                accessNote: "Self-Paced · Lifetime Access",
                badge: "FOUNDATIONS",
                represents: "I have the business fundamentals to get started.",
                whatHappensHere: [
                    "Professional branding",
                    "Niche positioning",
                    "First client strategies",
                    "Pricing & offers",
                ],
                incomeVision: {
                    starting: "Get your first clients",
                },
            },
            {
                step: 2,
                color: "indigo",
                status: "coming",
                stepLabel: "STEP 2",
                title: "CLIENT MASTERY",
                name: "Client Attraction Mastery",
                slug: "client-attraction-mastery",
                price: "$497",
                priceValue: 497,
                accessNote: "Self-Paced · Lifetime Access",
                badge: "MASTERY",
                represents: "I consistently attract and convert clients.",
                whatHappensHere: [
                    "Lead generation systems",
                    "Sales conversations",
                    "Content marketing",
                    "Referral strategies",
                ],
                incomeVision: {
                    starting: "$5K–$10K/month",
                    note: "with consistent clients",
                },
            },
        ],
        coach: {
            name: "Sarah Mitchell",
            title: "Business Coach & Mentor",
            credentials: "Multiple 6-Figure Businesses",
            bio: "Sarah has built multiple six-figure coaching businesses and now teaches other coaches to do the same.",
        },
        testimonials: [
            {
                name: "Rachel M.",
                quote: "Within 3 months of completing the business track, I had my first $10k month!",
                role: "Future Graduate",
            },
        ],
        doneForYou: {
            title: "Want Us To Build Your Practice?",
            subtitle: "Done-For-You Practice Building",
            description: "You focus on helping clients. We handle everything else.",
            features: ["Complete practice setup", "Marketing systems", "Client acquisition", "Ongoing support"],
            cta: "Book a Strategy Call",
            ctaLink: "https://calendly.com/accredipro/strategy-call",
        },
    },
};

export async function generateStaticParams() {
    return Object.keys(TRACKS).map((slug) => ({ slug }));
}

async function getUserEnrollments(userId: string) {
    return prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true, status: true, progress: true },
    });
}

async function getCourseBySlugs(slugs: string[]) {
    return prisma.course.findMany({
        where: { slug: { in: slugs }, isPublished: true },
        select: {
            id: true,
            slug: true,
            title: true,
            isFree: true,
            price: true,
        },
    });
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const track = TRACKS[slug as keyof typeof TRACKS];

    if (!track) {
        notFound();
    }

    const session = await getServerSession(authOptions);

    const courseSlugs = track.steps
        .filter((step: { slug?: string }) => step.slug)
        .map((step: { slug?: string }) => step.slug as string);

    const [courses, enrollments] = await Promise.all([
        getCourseBySlugs(courseSlugs),
        session?.user?.id ? getUserEnrollments(session.user.id) : [],
    ]);

    const courseMap = new Map(courses.map((c) => [c.slug, c]));
    const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));

    const trackWithEnrollments = {
        ...track,
        steps: track.steps.map((step: { slug?: string }) => {
            const course = step.slug ? courseMap.get(step.slug) : null;
            return {
                ...step,
                courseId: course?.id || null,
                isEnrolled: course ? enrollmentMap.has(course.id) : false,
                progress: course ? enrollmentMap.get(course.id)?.progress || 0 : 0,
            };
        }),
    };

    return <TrackContent track={trackWithEnrollments} isLoggedIn={!!session?.user?.id} />;
}
