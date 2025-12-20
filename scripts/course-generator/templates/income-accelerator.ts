/**
 * Income Accelerator Template (15 Modules, 75-90 Lessons)
 * Business & monetization course - $497
 * Same structure for ALL niches, just niche-specific examples
 */

export interface IncomeAcceleratorConfig {
    nicheName: string;
    nicheSlug: string;
    category: string;
    categorySlug: string;
    targetAudience: string;
    averageClientPrice: string; // e.g., "$500-$2,000 per client"
    potentialMonthlyIncome: string; // e.g., "$5,000-$15,000/month"
    typicalClientProblems: string[];
    serviceFormats: string[]; // e.g., ["1:1 Coaching", "Group Programs", "Online Courses"]
}

export interface LessonTemplate {
    title: string;
    description: string;
    duration: number;
    lessonType?: 'VIDEO' | 'TEXT' | 'QUIZ';
}

export interface ModuleTemplate {
    title: string;
    description: string;
    lessons: LessonTemplate[];
}

export function generateIncomeAccelerator(config: IncomeAcceleratorConfig): {
    course: {
        title: string;
        slug: string;
        description: string;
        shortDescription: string;
        price: number;
        duration: number;
    };
    modules: ModuleTemplate[];
} {
    const {
        nicheName,
        nicheSlug,
        targetAudience,
        averageClientPrice,
        potentialMonthlyIncome,
        typicalClientProblems,
        serviceFormats,
    } = config;

    return {
        course: {
            title: `${nicheName} Income Accelerator™`,
            slug: `${nicheSlug}-income-accelerator`,
            description: `Turn your ${nicheName} certification into a thriving business. Learn exactly how to attract clients, price your services, and build a practice earning ${potentialMonthlyIncome}. This step-by-step program gives you everything needed to monetize your expertise: client acquisition strategies, pricing psychology, sales conversations, and systems to scale. Includes done-for-you templates, scripts, and a 90-day launch plan.`,
            shortDescription: `15 modules • 85 lessons • 15+ hours • Business Launch Blueprint`,
            price: 497,
            duration: 54000, // 15 hours in seconds
        },
        modules: [
            // Module 1: Mindset & Vision
            {
                title: `Module 1: Your ${nicheName} Business Vision`,
                description: `Create clarity on your business and income goals`,
                lessons: [
                    { title: `Welcome to the Income Accelerator`, description: `What you'll achieve in this program`, duration: 600 },
                    { title: `The ${nicheName} Market Opportunity`, description: `Why now is the perfect time to start`, duration: 840 },
                    { title: `Your Income Vision`, description: `Setting realistic income goals`, duration: 720 },
                    { title: `The Practitioner vs Business Owner Mindset`, description: `Thinking like an entrepreneur`, duration: 780 },
                    { title: `Your 12-Month Income Roadmap`, description: `Mapping your path to ${potentialMonthlyIncome}`, duration: 900 },
                    { title: `Module 1 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 2: Niche & Ideal Client
            {
                title: `Module 2: Finding Your Ideal ${nicheName} Client`,
                description: `Get crystal clear on who you serve best`,
                lessons: [
                    { title: `Niching Down in ${nicheName}`, description: `Why specificity wins`, duration: 840 },
                    { title: `Your Ideal Client Avatar`, description: `Creating a detailed client profile`, duration: 960 },
                    { title: `Where Your Clients Are`, description: `Finding ${targetAudience} online and offline`, duration: 780 },
                    { title: `Understanding Client Pain Points`, description: `What ${targetAudience} desperately want solved`, duration: 900 },
                    { title: `Client Language & Messaging`, description: `Speaking their language`, duration: 720 },
                    { title: `Module 2 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 3: Your Signature Offer
            {
                title: `Module 3: Creating Your Signature ${nicheName} Offer`,
                description: `Package your expertise into irresistible offers`,
                lessons: [
                    { title: `What Makes an Offer Irresistible`, description: `The anatomy of high-converting offers`, duration: 900 },
                    { title: `Your Signature Transformation`, description: `Defining the outcome you deliver`, duration: 840 },
                    { title: `Packaging Your Services`, description: `${serviceFormats[0]} vs ${serviceFormats[1]} vs ${serviceFormats[2] || 'Products'}`, duration: 1020 },
                    { title: `The Value Stack`, description: `Adding perceived value to your offer`, duration: 780 },
                    { title: `Your Offer Naming & Positioning`, description: `Making it sound premium`, duration: 660 },
                    { title: `Creating Your First Offer`, description: `Workshop: Build your signature offer`, duration: 900 },
                    { title: `Module 3 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 4: Pricing Psychology
            {
                title: `Module 4: Pricing for Profit`,
                description: `Price your services to earn ${averageClientPrice} per client`,
                lessons: [
                    { title: `The Psychology of Premium Pricing`, description: `Why higher prices often convert better`, duration: 840 },
                    { title: `Calculating Your Worth`, description: `What your time and expertise are really worth`, duration: 780 },
                    { title: `Pricing Strategies for ${nicheName}`, description: `What top practitioners charge`, duration: 900 },
                    { title: `Session vs Package Pricing`, description: `Why packages win`, duration: 720 },
                    { title: `Payment Plans & Options`, description: `Making high-ticket accessible`, duration: 660 },
                    { title: `Setting Your Prices`, description: `Workshop: Price your offers`, duration: 780 },
                    { title: `Module 4 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 5: Online Presence
            {
                title: `Module 5: Building Your ${nicheName} Brand Online`,
                description: `Create a professional presence that attracts clients`,
                lessons: [
                    { title: `Your Professional Brand Identity`, description: `Positioning yourself as an expert`, duration: 780 },
                    { title: `Website Essentials`, description: `What your website needs (keep it simple)`, duration: 900 },
                    { title: `Social Media for ${nicheName} Practitioners`, description: `Which platforms and how to use them`, duration: 1020 },
                    { title: `Content That Attracts Clients`, description: `Creating content that converts`, duration: 960 },
                    { title: `Your Professional Bio & About Page`, description: `Telling your story`, duration: 660 },
                    { title: `Module 5 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 6: Lead Generation
            {
                title: `Module 6: Getting Clients Consistently`,
                description: `Fill your calendar with qualified leads`,
                lessons: [
                    { title: `The Client Acquisition Framework`, description: `How clients actually find you`, duration: 840 },
                    { title: `Organic Lead Generation`, description: `Free strategies that work`, duration: 1020 },
                    { title: `Lead Magnets for ${nicheName}`, description: `Free resources that attract buyers`, duration: 900 },
                    { title: `Referral Systems`, description: `Getting clients from existing clients`, duration: 780 },
                    { title: `Partnerships & Collaborations`, description: `Leveraging other people's audiences`, duration: 720 },
                    { title: `Introduction to Paid Ads`, description: `When and how to invest in ads`, duration: 840 },
                    { title: `Module 6 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 7: Sales Conversations
            {
                title: `Module 7: Discovery Calls That Convert`,
                description: `Turn inquiries into paying clients`,
                lessons: [
                    { title: `The Discovery Call Framework`, description: `A non-salesy approach that works`, duration: 1080 },
                    { title: `Qualifying Leads`, description: `Identifying who's ready to buy`, duration: 780 },
                    { title: `Asking the Right Questions`, description: `Questions that reveal readiness`, duration: 840 },
                    { title: `Presenting Your Offer`, description: `How to pitch without being pushy`, duration: 900 },
                    { title: `Handling Objections`, description: `Common objections and responses`, duration: 960 },
                    { title: `Closing with Confidence`, description: `Asking for the sale naturally`, duration: 720 },
                    { title: `Practice: Role Play Sessions`, description: `Practice your sales conversation`, duration: 600 },
                    { title: `Module 7 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 8: Client Onboarding
            {
                title: `Module 8: Onboarding & Client Experience`,
                description: `Deliver an exceptional client experience`,
                lessons: [
                    { title: `The Client Journey`, description: `Mapping the complete experience`, duration: 840 },
                    { title: `Seamless Onboarding`, description: `Making clients feel welcomed`, duration: 780 },
                    { title: `Setting Expectations`, description: `Starting the relationship right`, duration: 720 },
                    { title: `Your First Session`, description: `Making a powerful first impression`, duration: 900 },
                    { title: `Between-Session Support`, description: `Keeping clients engaged`, duration: 660 },
                    { title: `Module 8 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 9: Retention & Results
            {
                title: `Module 9: Getting Client Results & Renewals`,
                description: `Keep clients longer and get more referrals`,
                lessons: [
                    { title: `Maximizing Client Outcomes`, description: `Ensuring clients get transformation`, duration: 900 },
                    { title: `Progress Tracking & Milestones`, description: `Celebrating wins along the way`, duration: 720 },
                    { title: `The Renewal Conversation`, description: `Transitioning clients to next steps`, duration: 840 },
                    { title: `Creating Raving Fans`, description: `Clients who refer and testimonialize`, duration: 780 },
                    { title: `Getting Testimonials`, description: `Asking for and using social proof`, duration: 660 },
                    { title: `Module 9 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 10: Scaling with Groups
            {
                title: `Module 10: Scaling with Group Programs`,
                description: `Serve more clients without working more hours`,
                lessons: [
                    { title: `Why Group Programs`, description: `The economics of one-to-many`, duration: 780 },
                    { title: `Designing Your Group Program`, description: `Structure and curriculum`, duration: 960 },
                    { title: `Pricing Group Programs`, description: `What to charge for groups`, duration: 720 },
                    { title: `Launching Your Group`, description: `Filling your first group`, duration: 900 },
                    { title: `Running Effective Group Sessions`, description: `Facilitation skills`, duration: 840 },
                    { title: `Module 10 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 11: Digital Products
            {
                title: `Module 11: Creating Digital Products`,
                description: `Build passive income streams`,
                lessons: [
                    { title: `The Passive Income Opportunity`, description: `Products that sell while you sleep`, duration: 780 },
                    { title: `eBooks & Guides`, description: `Creating valuable downloadables`, duration: 840 },
                    { title: `Mini-Courses & Workshops`, description: `Small digital products`, duration: 900 },
                    { title: `Templates & Toolkits`, description: `Done-for-you resources`, duration: 720 },
                    { title: `Pricing Digital Products`, description: `What to charge`, duration: 660 },
                    { title: `Module 11 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 12: Systems & Automation
            {
                title: `Module 12: Systems That Scale`,
                description: `Build a business that runs smoothly`,
                lessons: [
                    { title: `The Tools You Need`, description: `Essential business tools`, duration: 840 },
                    { title: `Scheduling & Booking`, description: `Automating appointments`, duration: 720 },
                    { title: `Email & Follow-Up Systems`, description: `Nurturing leads automatically`, duration: 900 },
                    { title: `Payment & Client Management`, description: `Getting paid and organized`, duration: 780 },
                    { title: `Time Management for Practitioners`, description: `Structuring your week`, duration: 720 },
                    { title: `Module 12 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 13: Legal & Business Setup
            {
                title: `Module 13: Business Foundations`,
                description: `Set up your business properly`,
                lessons: [
                    { title: `Business Structure Basics`, description: `LLC, sole prop, and options`, duration: 780 },
                    { title: `Client Contracts`, description: `Protecting yourself legally`, duration: 840 },
                    { title: `Liability & Insurance`, description: `What coverage you need`, duration: 720 },
                    { title: `Financial Tracking`, description: `Managing income and expenses`, duration: 780 },
                    { title: `Module 13 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 14: Growth & Scaling
            {
                title: `Module 14: Scaling to ${potentialMonthlyIncome}`,
                description: `Grow beyond your first clients`,
                lessons: [
                    { title: `The ${potentialMonthlyIncome} Roadmap`, description: `What it takes to hit this milestone`, duration: 900 },
                    { title: `Increasing Client Value`, description: `Serving clients at higher prices`, duration: 840 },
                    { title: `Building Your Team`, description: `When to hire help`, duration: 780 },
                    { title: `Advanced Growth Strategies`, description: `Scaling beyond 1:1`, duration: 900 },
                    { title: `Staying Sustainable`, description: `Avoiding burnout while growing`, duration: 720 },
                    { title: `Module 14 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 15: Your 90-Day Launch Plan
            {
                title: `Module 15: Your 90-Day Launch Plan`,
                description: `Execute your plan and get your first clients`,
                lessons: [
                    { title: `Your Complete Business Blueprint`, description: `Summarizing everything`, duration: 900 },
                    { title: `Days 1-30: Foundation`, description: `Setting up your business`, duration: 1020 },
                    { title: `Days 31-60: Visibility`, description: `Getting seen and generating leads`, duration: 1020 },
                    { title: `Days 61-90: Clients`, description: `Closing your first paying clients`, duration: 1020 },
                    { title: `Income Accelerator Final Exam`, description: `Complete your assessment`, duration: 0, lessonType: 'QUIZ' },
                    { title: `Your Income Accelerator Certificate`, description: `Access your credential`, duration: 300 },
                    { title: `What's Next`, description: `Continuing your journey`, duration: 600 },
                ],
            },
        ],
    };
}

// Default configurations
export const INCOME_ACCELERATOR_DEFAULTS = {
    averageClientPrice: '$500-$2,000 per client',
    potentialMonthlyIncome: '$5,000-$15,000/month',
    typicalClientProblems: ['Health challenges', 'Seeking transformation', 'Ready for change'],
    serviceFormats: ['1:1 Coaching', 'Group Programs', 'Online Courses'],
};
