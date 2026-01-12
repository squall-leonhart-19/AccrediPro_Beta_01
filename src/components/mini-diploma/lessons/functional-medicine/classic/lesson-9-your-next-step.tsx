"use client";

import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function ClassicLessonYourNextStep({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        {
            type: 'intro',
            content: `{name}!! You made it! I'm so proud of you for completing this Mini Diploma! In just a short time, you've learned more about root-cause medicine than most conventionally trained doctors ever will.`,
        },
        {
            type: 'heading',
            content: 'What You\'ve Accomplished',
        },
        {
            type: 'list',
            content: 'Your new knowledge includes:',
            items: [
                'The 5 root causes of chronic disease',
                'Why the gut is the foundation of health',
                'How inflammation drives disease',
                'The toxin burden we all carry',
                'Stress and HPA axis dysfunction',
                'Hidden nutrient deficiencies',
                'Functional vs. conventional lab interpretation',
                'How to build effective protocols',
            ],
        },
        {
            type: 'callout',
            content: `This is just the beginning. There's so much more depth to explore in each of these areas - and the full certification gives you that mastery.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Your Options Now',
        },
        {
            type: 'list',
            content: 'Three paths forward:',
            items: [
                'Download your Mini Diploma Certificate - Share it on LinkedIn!',
                'Continue to Full Certification - Become Board Certified',
                'Join our Community - Connect with 20,000+ practitioners',
            ],
        },
        {
            type: 'heading',
            content: 'The Complete Career Certification',
        },
        {
            type: 'text',
            content: `The Complete Career Certification takes you from curious learner to confident, credentialed practitioner. Here's what's included:`,
        },
        {
            type: 'list',
            content: 'Full certification includes:',
            items: [
                '3-Level Certification (FM-FC, FM-CP, FM-BC)',
                '25+ in-depth lessons',
                'Clinical protocols and case studies',
                'Functional lab interpretation mastery',
                'My Circle Mastermind (5-person pod, DAILY check-ins)',
                'ASI Practitioner Directory listing',
                'Done-for-you business templates',
                'Sarah mentorship access',
                'LIFETIME ACCESS',
            ],
        },
        {
            type: 'heading',
            content: 'The Investment',
        },
        {
            type: 'key-point',
            content: `The investment is just $297 - less than 2 client sessions once you're certified. Average practitioners charge $150-300 per session. That means 2 clients and you've broken even. Everything after that is profit + purpose.`,
        },
        {
            type: 'quote',
            content: `{name}, you have something special. The fact that you finished this training shows you're serious about helping others and building a meaningful career in health coaching.`,
        },
        {
            type: 'heading',
            content: 'Congratulations!',
        },
        {
            type: 'text',
            content: `I'd love to continue this journey with you. Your certificate is ready to download, and I'll be here when you're ready for the next step. Check out the full certification whenever you're ready to transform your passion into a professional practice.`,
        },
    ];

    const keyTakeaways = [
        'You\'ve completed a comprehensive introduction to Functional Medicine',
        'Download and share your Mini Diploma Certificate',
        'The full certification provides deeper training and credentials',
        'Board certification opens doors to professional practice',
        'Your investment pays back after just 2 client sessions',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a Certified Functional Medicine Practitioner"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/functional-medicine-diploma"
        />
    );
}
