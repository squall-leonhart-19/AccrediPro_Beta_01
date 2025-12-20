/**
 * Practitioner Bundle Template (18-21 Modules, 100-140 Lessons)
 * Combined Advanced + Master certification - $497
 */

export interface PractitionerBundleConfig {
    nicheName: string;
    nicheSlug: string;
    category: string;
    categorySlug: string;
    targetAudience: string;
    keyBenefit: string;
    primaryProblem: string;
    advancedTopics: string[];
    masterTopics: string[];
    specializations: string[];
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

export function generatePractitionerBundle(config: PractitionerBundleConfig): {
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
        advancedTopics,
        masterTopics,
        specializations,
    } = config;

    return {
        course: {
            title: `${nicheName} Complete Practitioner Bundle™`,
            slug: `${nicheSlug}-practitioner-bundle`,
            description: `The complete ${nicheName} practitioner certification. This comprehensive bundle combines Advanced and Master level training for practitioners who want to achieve the highest level of expertise. 21 modules covering advanced protocols, complex cases, specializations, and mastery-level skills. Perfect for serious practitioners ready to become experts in ${nicheName}.`,
            shortDescription: `21 modules • 140 lessons • 30+ hours • Advanced + Master Certificates`,
            price: 497,
            duration: 108000, // 30 hours in seconds
        },
        modules: [
            // PART 1: ADVANCED CERTIFICATION (Modules 1-10)
            {
                title: `Module 1: Advanced ${nicheName} Principles`,
                description: `Deepen your understanding beyond foundation level`,
                lessons: [
                    { title: `Welcome to Advanced ${nicheName}`, description: `What sets advanced practitioners apart`, duration: 600 },
                    { title: `Advanced Physiology`, description: `Deeper understanding of body systems`, duration: 1200 },
                    { title: `Complex Root Cause Analysis`, description: `Multi-factorial case assessment`, duration: 1080 },
                    { title: `Advanced Client Psychology`, description: `Understanding client behavior patterns`, duration: 900 },
                    { title: `The Advanced Practitioner Mindset`, description: `Developing expertise and confidence`, duration: 720 },
                    { title: `Module 1 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 2: ${advancedTopics[0] || 'Advanced Assessment Techniques'}`,
                description: `Master sophisticated evaluation methods`,
                lessons: [
                    { title: `Advanced Health History Analysis`, description: `Finding hidden patterns in client history`, duration: 1080 },
                    { title: `Functional Testing Interpretation`, description: `Understanding specialized tests`, duration: 1200 },
                    { title: `Biomarker Analysis`, description: `Reading and interpreting markers`, duration: 1020 },
                    { title: `Pattern Recognition`, description: `Connecting dots across systems`, duration: 960 },
                    { title: `Creating Assessment Reports`, description: `Professional documentation`, duration: 840 },
                    { title: `Module 2 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 3: ${advancedTopics[1] || 'Advanced Protocols'}`,
                description: `Sophisticated intervention strategies`,
                lessons: [
                    { title: `Advanced Protocol Design`, description: `Creating comprehensive treatment plans`, duration: 1200 },
                    { title: `Layered Interventions`, description: `Sequencing multiple approaches`, duration: 1080 },
                    { title: `Supplement Protocols`, description: `Strategic supplementation strategies`, duration: 1020 },
                    { title: `Lifestyle Prescriptions`, description: `Detailed lifestyle recommendations`, duration: 900 },
                    { title: `Integration Strategies`, description: `Combining multiple modalities`, duration: 960 },
                    { title: `Module 3 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 4: Complex Case Management`,
                description: `Working with challenging multi-system cases`,
                lessons: [
                    { title: `Identifying Complex Cases`, description: `Recognizing multi-factorial presentations`, duration: 900 },
                    { title: `Prioritization in Complex Cases`, description: `Where to start when everything is wrong`, duration: 1080 },
                    { title: `Managing Multiple Interventions`, description: `Coordinating comprehensive protocols`, duration: 1020 },
                    { title: `When Progress Stalls`, description: `Troubleshooting stuck cases`, duration: 960 },
                    { title: `Complex Case Studies`, description: `Learning from challenging scenarios`, duration: 1200 },
                    { title: `Module 4 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 5: ${specializations[0] || 'Specialization Track 1'}`,
                description: `Deep expertise in a specific area`,
                lessons: [
                    { title: `Introduction to ${specializations[0] || 'This Specialization'}`, description: `Why this matters`, duration: 840 },
                    { title: `Key Concepts & Science`, description: `The evidence and research`, duration: 1080 },
                    { title: `Specialized Assessment`, description: `Evaluation specific to this area`, duration: 960 },
                    { title: `Targeted Protocols`, description: `Interventions for this specialization`, duration: 1020 },
                    { title: `Case Study: ${specializations[0] || 'Specialty'} Success`, description: `Real-world application`, duration: 900 },
                    { title: `Module 5 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 6: ${specializations[1] || 'Specialization Track 2'}`,
                description: `Another area of deep expertise`,
                lessons: [
                    { title: `Introduction to ${specializations[1] || 'This Specialization'}`, description: `Understanding this area`, duration: 840 },
                    { title: `Core Principles`, description: `Key concepts and frameworks`, duration: 1020 },
                    { title: `Assessment & Evaluation`, description: `Specialized evaluation methods`, duration: 960 },
                    { title: `Treatment Approaches`, description: `Targeted interventions`, duration: 1020 },
                    { title: `Advanced Application`, description: `Putting it all together`, duration: 900 },
                    { title: `Module 6 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 7: Advanced Client Communication`,
                description: `Master the art of client relationships`,
                lessons: [
                    { title: `Motivational Interviewing`, description: `Techniques that drive change`, duration: 960 },
                    { title: `Difficult Conversations`, description: `Navigating sensitive topics`, duration: 840 },
                    { title: `Building Client Buy-In`, description: `Getting clients committed`, duration: 780 },
                    { title: `Managing Expectations`, description: `Setting realistic goals`, duration: 720 },
                    { title: `Advanced Boundary Setting`, description: `Professional boundaries`, duration: 780 },
                    { title: `Module 7 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 8: Research & Evidence`,
                description: `Become an evidence-based practitioner`,
                lessons: [
                    { title: `Reading Research Papers`, description: `Understanding scientific literature`, duration: 1080 },
                    { title: `Evaluating Evidence`, description: `Quality assessment of studies`, duration: 960 },
                    { title: `Staying Current`, description: `Keeping up with new research`, duration: 720 },
                    { title: `Translating Research to Practice`, description: `Applying evidence to clients`, duration: 900 },
                    { title: `Module 8 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 9: Advanced Case Studies`,
                description: `Learn from complex real-world scenarios`,
                lessons: [
                    { title: `Case 1: Multi-System Dysfunction`, description: `Complex interrelated issues`, duration: 1200 },
                    { title: `Case 2: Treatment Resistance`, description: `When nothing seems to work`, duration: 1080 },
                    { title: `Case 3: Rapid Deterioration`, description: `Managing worsening cases`, duration: 1020 },
                    { title: `Case 4: Remarkable Recovery`, description: `Understanding exceptional outcomes`, duration: 960 },
                    { title: `Your Advanced Case Practice`, description: `Apply your learning`, duration: 840 },
                    { title: `Module 9 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 10: Advanced Certification Exam`,
                description: `Demonstrate your advanced competency`,
                lessons: [
                    { title: `Advanced Review Session`, description: `Comprehensive review`, duration: 1200 },
                    { title: `Exam Preparation`, description: `Final preparation`, duration: 600 },
                    { title: `Advanced Certification Exam`, description: `Complete your advanced assessment`, duration: 0, lessonType: 'QUIZ' },
                    { title: `Your Advanced Certificate`, description: `Access your credential`, duration: 300 },
                ],
            },
            // PART 2: MASTER CERTIFICATION (Modules 11-21)
            {
                title: `Module 11: Master-Level ${nicheName}`,
                description: `Entering the mastery phase`,
                lessons: [
                    { title: `Welcome to Master Level`, description: `What mastery means`, duration: 600 },
                    { title: `The Master Practitioner Identity`, description: `Becoming recognized as an expert`, duration: 840 },
                    { title: `${masterTopics[0] || 'Advanced Concept 1'}`, description: `Deep expertise topic`, duration: 1200 },
                    { title: `${masterTopics[1] || 'Advanced Concept 2'}`, description: `Another mastery topic`, duration: 1080 },
                    { title: `Module 11 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 12: Clinical Excellence`,
                description: `Achieving the highest standards`,
                lessons: [
                    { title: `Precision Protocols`, description: `Fine-tuned intervention design`, duration: 1080 },
                    { title: `Outcome Optimization`, description: `Maximizing client results`, duration: 1020 },
                    { title: `Efficiency in Practice`, description: `Getting results faster`, duration: 900 },
                    { title: `Quality Assurance`, description: `Maintaining excellence`, duration: 840 },
                    { title: `Module 12 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 13: Cutting Edge Developments`,
                description: `The latest in ${nicheName}`,
                lessons: [
                    { title: `Emerging Research`, description: `What's new in the field`, duration: 1080 },
                    { title: `New Modalities`, description: `Innovative approaches`, duration: 1020 },
                    { title: `Technology Integration`, description: `Using technology effectively`, duration: 960 },
                    { title: `Future Directions`, description: `Where the field is heading`, duration: 840 },
                    { title: `Module 13 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 14: ${specializations[2] || 'Master Specialization'}`,
                description: `Your master-level specialty area`,
                lessons: [
                    { title: `Deep Dive: ${specializations[2] || 'Master Specialty'}`, description: `Comprehensive exploration`, duration: 1200 },
                    { title: `Advanced Techniques`, description: `Master-level methods`, duration: 1080 },
                    { title: `Integration Strategies`, description: `Combining with your practice`, duration: 960 },
                    { title: `Expert Application`, description: `Putting it all together`, duration: 1020 },
                    { title: `Module 14 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 15: Teaching & Mentoring`,
                description: `Sharing your expertise with others`,
                lessons: [
                    { title: `The Practitioner as Educator`, description: `Teaching clients effectively`, duration: 840 },
                    { title: `Training Other Practitioners`, description: `Mentoring colleagues`, duration: 900 },
                    { title: `Creating Educational Content`, description: `Workshops and presentations`, duration: 960 },
                    { title: `Building Your Reputation`, description: `Becoming a recognized expert`, duration: 780 },
                    { title: `Module 15 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 16: Leadership in ${nicheName}`,
                description: `Leading the profession forward`,
                lessons: [
                    { title: `Thought Leadership`, description: `Contributing to the field`, duration: 840 },
                    { title: `Community Building`, description: `Creating practitioner networks`, duration: 780 },
                    { title: `Advocacy & Influence`, description: `Advancing the profession`, duration: 720 },
                    { title: `Legacy Building`, description: `Making lasting impact`, duration: 660 },
                    { title: `Module 16 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 17: Master Case Presentations`,
                description: `The most complex scenarios`,
                lessons: [
                    { title: `Master Case 1: The Impossible Case`, description: `Turning failures into successes`, duration: 1200 },
                    { title: `Master Case 2: Unexpected Complications`, description: `Navigating surprises`, duration: 1080 },
                    { title: `Master Case 3: Breakthrough Moments`, description: `Creating transformations`, duration: 1020 },
                    { title: `Your Master Case Presentation`, description: `Present your own case`, duration: 900 },
                    { title: `Module 17 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 18: Integrative Approaches`,
                description: `Combining modalities for best outcomes`,
                lessons: [
                    { title: `Multi-Modality Integration`, description: `Combining approaches`, duration: 1080 },
                    { title: `Working with Other Practitioners`, description: `Collaborative care`, duration: 900 },
                    { title: `Referral Networks`, description: `Building professional relationships`, duration: 780 },
                    { title: `The Integrative Protocol`, description: `Creating comprehensive plans`, duration: 960 },
                    { title: `Module 18 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 19: Practice Mastery`,
                description: `Running an exceptional practice`,
                lessons: [
                    { title: `Premium Positioning`, description: `Becoming a sought-after expert`, duration: 900 },
                    { title: `High-Touch Client Experience`, description: `Delivering exceptional service`, duration: 960 },
                    { title: `Scaling Your Impact`, description: `Helping more people`, duration: 840 },
                    { title: `Building a Legacy Practice`, description: `Creating lasting value`, duration: 780 },
                    { title: `Module 19 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 20: Master Practitioner Review`,
                description: `Comprehensive mastery integration`,
                lessons: [
                    { title: `Integrating Your Learning`, description: `Bringing it all together`, duration: 1200 },
                    { title: `Your Master Protocol`, description: `Creating your signature approach`, duration: 1080 },
                    { title: `Defining Your Expertise`, description: `Your unique value proposition`, duration: 840 },
                    { title: `Master Exam Preparation`, description: `Preparing for final assessment`, duration: 720 },
                    { title: `Module 20 Assessment`, description: `Test your understanding`, duration: 0, lessonType: 'QUIZ' },
                ],
            },
            {
                title: `Module 21: Master Certification & Graduation`,
                description: `Complete your master certification`,
                lessons: [
                    { title: `Final Review Session`, description: `Last preparation`, duration: 900 },
                    { title: `Master Certification Exam`, description: `Complete your master assessment`, duration: 0, lessonType: 'QUIZ' },
                    { title: `Your Master Certificate`, description: `Access your master credential`, duration: 300 },
                    { title: `Welcome to the Master Community`, description: `Joining the elite practitioners`, duration: 600 },
                    { title: `Your Path Forward`, description: `Next steps as a master practitioner`, duration: 600 },
                ],
            },
        ],
    };
}

// Default configurations
export const PRACTITIONER_BUNDLE_DEFAULTS = {
    advancedTopics: ['Advanced Assessment Techniques', 'Advanced Treatment Protocols'],
    masterTopics: ['Cutting-Edge Research', 'Expert Clinical Methods'],
    specializations: ['Complex Cases', 'Special Populations', 'Advanced Modalities'],
};
