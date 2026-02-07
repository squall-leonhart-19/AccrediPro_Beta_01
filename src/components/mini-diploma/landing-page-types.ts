// Types for the shared Niche Mini Diploma Landing Page component

export interface NicheLandingConfig {
    nicheId: string;
    nicheSlug: string;        // e.g., "gut-health-mini-diploma"
    displayName: string;       // e.g., "Gut Health"
    courseSlug: string;        // for API optin call
    portalSlug: string;        // for redirect after signin e.g., "gut-health"

    brand: {
        primary: string;
        primaryDark: string;
        primaryLight: string;
    };

    hero: {
        badge: string;
        headline: string;
        subheadline: string;
        socialProofCount: string;
        socialProofLabel: string;
        enrolledToday: number;
    };

    sarah: {
        quoteHeadline: string;
        paragraphs: string[];
        credentials: string;
    };

    testimonials: {
        sectionHeadline: string;
        sectionSubheadline: string;
        stories: {
            name: string;
            age: string;
            income: string;
            before: string;
            story: string;
            avatar: string;
        }[];
    };

    careerPath: {
        practitionerTitle: string;
        description: string;
        benefits: string[];
        incomeRange: string;
        perSession: string;
        clientsPerMonth: string;
    };

    advantages: {
        sectionHeadline: string;
        sectionDescription: string;
        cards: {
            iconName: "Stethoscope" | "BookOpen" | "Heart" | "Brain" | "Shield" | "Users" | "Sparkles" | "Zap" | "Globe" | "Star";
            title: string;
            desc: string;
        }[];
    };

    thisIsForYou: {
        loveIt: string[];
        notRightNow: string[];
    };

    lessons: {
        num: number;
        title: string;
        desc: string;
    }[];

    valueStack: {
        items: { item: string; value: string }[];
        totalValue: string;
        forLabel: string;
    };

    faq: {
        sectionTitle: string;
        items: { q: string; a: string }[];
    };

    certificateTitle: string;

    finalCta: {
        headline: string;
        highlightedPart: string;
        subheadline: string;
    };

    tracking: {
        contentName: string;
        contentId: string;
        pixelId: string;
    };
}
