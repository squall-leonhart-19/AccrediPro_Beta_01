/**
 * Foundation Certificate Template (12-15 Modules, 60-90 Lessons)
 * Core certification product - $147
 */

export interface FoundationConfig {
    nicheName: string;
    nicheSlug: string;
    category: string;
    categorySlug: string;
    targetAudience: string;
    keyBenefit: string;
    primaryProblem: string;
    // Additional context for deeper content
    rootCauses: string[];
    assessmentMethods: string[];
    treatmentApproaches: string[];
    specialPopulations: string[];
}

export interface LessonTemplate {
    title: string;
    description: string;
    duration: number;
    isFreePreview?: boolean;
    lessonType?: 'VIDEO' | 'TEXT' | 'QUIZ';
}

export interface ModuleTemplate {
    title: string;
    description: string;
    lessons: LessonTemplate[];
}

export function generateFoundationCertificate(config: FoundationConfig): {
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
        keyBenefit,
        primaryProblem,
        rootCauses,
        assessmentMethods,
        treatmentApproaches,
        specialPopulations
    } = config;

    return {
        course: {
            title: `Certified ${nicheName} Coach™`,
            slug: `${nicheSlug}-foundation-certificate`,
            description: `Become a Certified ${nicheName} Coach with this comprehensive certification program. Master the art and science of helping ${targetAudience} achieve ${keyBenefit}. 15 modules covering everything from foundational principles to client protocols and practice building. Fully accredited certification with digital badge.`,
            shortDescription: `15 modules • 90 lessons • 12+ hours • Foundation Certificate`,
            price: 147,
            duration: 43200, // 12 hours in seconds
        },
        modules: [
            // Module 1: Introduction & Foundations
            {
                title: `Module 1: Introduction to ${nicheName}`,
                description: `Build your foundational understanding of ${nicheName} and the certification journey ahead`,
                lessons: [
                    { title: `Welcome & Program Overview`, description: `Your journey to becoming a certified ${nicheName} Coach`, duration: 600, isFreePreview: true },
                    { title: `What is ${nicheName}?`, description: `Core definition, history, and evolution of ${nicheName}`, duration: 900 },
                    { title: `The ${nicheName} Practitioner Mindset`, description: `Developing the mindset of a successful practitioner`, duration: 720 },
                    { title: `Scope of Practice & Ethics`, description: `Understanding your role and professional boundaries`, duration: 840 },
                    { title: `The Science Behind ${nicheName}`, description: `Evidence-based foundations and research`, duration: 960 },
                    { title: `Module 1 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 2: Understanding the Problem
            {
                title: `Module 2: Understanding ${primaryProblem}`,
                description: `Deep dive into the problems your clients face`,
                lessons: [
                    { title: `The Scope of ${primaryProblem}`, description: `How widespread this issue is and who it affects`, duration: 720 },
                    { title: `Root Cause #1: ${rootCauses[0] || 'Lifestyle Factors'}`, description: `Understanding the first major contributing factor`, duration: 900 },
                    { title: `Root Cause #2: ${rootCauses[1] || 'Environmental Factors'}`, description: `Exploring environmental and external causes`, duration: 840 },
                    { title: `Root Cause #3: ${rootCauses[2] || 'Physiological Factors'}`, description: `The body systems involved`, duration: 900 },
                    { title: `The Mind-Body Connection`, description: `How mental and emotional factors contribute`, duration: 780 },
                    { title: `Module 2 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 3: Assessment & Evaluation
            {
                title: `Module 3: Client Assessment`,
                description: `Learn to properly assess and evaluate clients`,
                lessons: [
                    { title: `The Initial Consultation`, description: `Conducting effective first appointments`, duration: 960 },
                    { title: `${assessmentMethods[0] || 'Health History Analysis'}`, description: `Gathering comprehensive client information`, duration: 840 },
                    { title: `${assessmentMethods[1] || 'Symptom Evaluation'}`, description: `Understanding and categorizing symptoms`, duration: 780 },
                    { title: `Identifying Patterns`, description: `Connecting symptoms to root causes`, duration: 900 },
                    { title: `Documentation Best Practices`, description: `Proper record-keeping and notes`, duration: 600 },
                    { title: `Module 3 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 4: Core Principles & Framework
            {
                title: `Module 4: The ${nicheName} Framework`,
                description: `Master the core framework for ${nicheName} practice`,
                lessons: [
                    { title: `The 5-Step ${nicheName} Protocol`, description: `Your systematic approach to client care`, duration: 1080 },
                    { title: `Pillar 1: Assessment`, description: `Comprehensive evaluation strategies`, duration: 840 },
                    { title: `Pillar 2: Education`, description: `Empowering clients with knowledge`, duration: 780 },
                    { title: `Pillar 3: Implementation`, description: `Creating actionable plans`, duration: 900 },
                    { title: `Pillar 4: Support`, description: `Ongoing guidance and accountability`, duration: 720 },
                    { title: `Pillar 5: Optimization`, description: `Refining and improving outcomes`, duration: 780 },
                    { title: `Module 4 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 5: Treatment Approaches
            {
                title: `Module 5: ${treatmentApproaches[0] || 'Primary Interventions'}`,
                description: `Core therapeutic approaches in ${nicheName}`,
                lessons: [
                    { title: `Introduction to ${treatmentApproaches[0] || 'Primary Interventions'}`, description: `Overview and evidence base`, duration: 900 },
                    { title: `Practical Application`, description: `How to implement with clients`, duration: 1020 },
                    { title: `Customization for Individuals`, description: `Tailoring approaches to unique needs`, duration: 840 },
                    { title: `Common Challenges & Solutions`, description: `Troubleshooting typical obstacles`, duration: 780 },
                    { title: `Case Study: Successful Implementation`, description: `Real-world application example`, duration: 900 },
                    { title: `Module 5 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 6: Secondary Interventions
            {
                title: `Module 6: ${treatmentApproaches[1] || 'Supporting Strategies'}`,
                description: `Complementary approaches to enhance outcomes`,
                lessons: [
                    { title: `Introduction to ${treatmentApproaches[1] || 'Supporting Strategies'}`, description: `Why this approach matters`, duration: 840 },
                    { title: `Key Techniques & Methods`, description: `Practical implementation`, duration: 960 },
                    { title: `Integration with Primary Approaches`, description: `Creating synergistic protocols`, duration: 840 },
                    { title: `Monitoring Progress`, description: `Tracking and measuring outcomes`, duration: 720 },
                    { title: `Module 6 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 7: Lifestyle Factors
            {
                title: `Module 7: Lifestyle Optimization`,
                description: `Address lifestyle factors that impact ${nicheName} outcomes`,
                lessons: [
                    { title: `Sleep & Recovery`, description: `The foundation of wellness`, duration: 840 },
                    { title: `Stress Management`, description: `Practical stress reduction strategies`, duration: 900 },
                    { title: `Movement & Exercise`, description: `Appropriate physical activity recommendations`, duration: 780 },
                    { title: `Nutrition Fundamentals`, description: `Dietary considerations for ${nicheName}`, duration: 960 },
                    { title: `Environmental Factors`, description: `Optimizing the client's environment`, duration: 720 },
                    { title: `Module 7 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 8: Mind-Body Connection
            {
                title: `Module 8: The Mind-Body Connection`,
                description: `Integrate mental and emotional wellness into your practice`,
                lessons: [
                    { title: `The Mind-Body Link in ${nicheName}`, description: `How thoughts and emotions affect ${nicheName}`, duration: 900 },
                    { title: `Emotional Regulation Techniques`, description: `Tools for emotional balance`, duration: 840 },
                    { title: `Breathwork & Relaxation`, description: `Simple yet powerful techniques`, duration: 720 },
                    { title: `Mindfulness Applications`, description: `Practical mindfulness for clients`, duration: 780 },
                    { title: `Module 8 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 9: Special Populations
            {
                title: `Module 9: Working with ${specialPopulations[0] || 'Special Populations'}`,
                description: `Customize your approach for specific client groups`,
                lessons: [
                    { title: `Understanding ${specialPopulations[0] || 'Unique Needs'}`, description: `Special considerations and approaches`, duration: 900 },
                    { title: `Modified Protocols`, description: `Adapting your framework for this population`, duration: 960 },
                    { title: `Common Challenges`, description: `Typical issues and solutions`, duration: 780 },
                    { title: `Case Study: ${specialPopulations[0] || 'Special Population'} Success`, description: `Real-world transformation story`, duration: 840 },
                    { title: `Module 9 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 10: Protocol Development
            {
                title: `Module 10: Creating Client Protocols`,
                description: `Design comprehensive treatment plans`,
                lessons: [
                    { title: `Protocol Design Principles`, description: `Building effective treatment plans`, duration: 1020 },
                    { title: `Prioritization Strategies`, description: `What to address first and why`, duration: 840 },
                    { title: `Timeline Development`, description: `Realistic expectations and milestones`, duration: 780 },
                    { title: `Client Communication`, description: `Presenting protocols effectively`, duration: 720 },
                    { title: `Adjustments & Modifications`, description: `When and how to adapt protocols`, duration: 840 },
                    { title: `Module 10 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 11: Case Studies
            {
                title: `Module 11: Case Study Analysis`,
                description: `Learn from real-world client scenarios`,
                lessons: [
                    { title: `Case Study 1: The Classic Presentation`, description: `Analyzing a typical ${nicheName} case`, duration: 1080 },
                    { title: `Case Study 2: Complex Multi-Factor Case`, description: `When multiple issues intersect`, duration: 1020 },
                    { title: `Case Study 3: Resistant Case`, description: `Working with challenging clients`, duration: 960 },
                    { title: `Case Study 4: Rapid Transformation`, description: `When protocols work exceptionally well`, duration: 900 },
                    { title: `Your Case Analysis Practice`, description: `Apply your learning to new cases`, duration: 840 },
                    { title: `Module 11 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 12: Client Management
            {
                title: `Module 12: Professional Client Management`,
                description: `Excellence in client relationships and care`,
                lessons: [
                    { title: `Onboarding New Clients`, description: `Creating excellent first impressions`, duration: 780 },
                    { title: `Session Structure & Flow`, description: `Running effective client sessions`, duration: 840 },
                    { title: `Follow-Up Best Practices`, description: `Maintaining momentum between sessions`, duration: 720 },
                    { title: `Handling Difficult Situations`, description: `Navigating challenges professionally`, duration: 840 },
                    { title: `Client Retention Strategies`, description: `Building long-term relationships`, duration: 720 },
                    { title: `Module 12 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 13: Tools & Resources
            {
                title: `Module 13: Practitioner Tools & Resources`,
                description: `Essential resources for your practice`,
                lessons: [
                    { title: `Client Intake Forms`, description: `Essential documentation templates`, duration: 720 },
                    { title: `Assessment Tools`, description: `Questionnaires and evaluation forms`, duration: 780 },
                    { title: `Progress Tracking Systems`, description: `Monitoring client improvement`, duration: 720 },
                    { title: `Educational Materials`, description: `Resources for client education`, duration: 660 },
                    { title: `Technology & Apps`, description: `Digital tools to enhance your practice`, duration: 720 },
                    { title: `Module 13 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 14: Building Your Practice
            {
                title: `Module 14: Building Your ${nicheName} Practice`,
                description: `Launch and grow your certification-based business`,
                lessons: [
                    { title: `Defining Your Niche`, description: `Finding your ideal client within ${nicheName}`, duration: 840 },
                    { title: `Practice Models`, description: `Virtual, in-person, and hybrid options`, duration: 780 },
                    { title: `Pricing Your Services`, description: `Creating sustainable pricing structures`, duration: 900 },
                    { title: `Getting Your First Clients`, description: `Initial client acquisition strategies`, duration: 960 },
                    { title: `Professional Presence`, description: `Website, social media, and branding basics`, duration: 840 },
                    { title: `Module 14 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            // Module 15: Certification & Next Steps
            {
                title: `Module 15: Certification & Beyond`,
                description: `Complete your certification and plan your next steps`,
                lessons: [
                    { title: `Certification Review`, description: `Comprehensive program review`, duration: 1200 },
                    { title: `Exam Preparation`, description: `Preparing for your certification exam`, duration: 840 },
                    { title: `Certification Exam`, description: `Complete your certification assessment`, duration: 0, lessonType: 'QUIZ' },
                    { title: `Your Certificate & Badge`, description: `Accessing your credentials`, duration: 300 },
                    { title: `Continuing Education`, description: `Advanced certifications and specializations`, duration: 600 },
                    { title: `Your Next Steps`, description: `Action plan for the next 30 days`, duration: 600 },
                ],
            },
        ],
    };
}

// Default configurations for common niches
export const FOUNDATION_DEFAULTS = {
    rootCauses: ['Lifestyle Factors', 'Environmental Triggers', 'Physiological Imbalances'],
    assessmentMethods: ['Comprehensive Health History', 'Symptom Pattern Analysis'],
    treatmentApproaches: ['Core Therapeutic Interventions', 'Lifestyle Modifications'],
    specialPopulations: ['Women Over 40'],
};
