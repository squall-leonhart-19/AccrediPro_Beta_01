"use client";

import { Lesson1RootCause } from "./lesson-1-root-cause";
import { Lesson2Gut } from "./lesson-2-gut";
import { Lesson3Inflammation } from "./lesson-3-inflammation";
import { Lesson4Toxins } from "./lesson-4-toxins";
import { Lesson5Stress } from "./lesson-5-stress";
import { Lesson6Labs } from "./lesson-6-labs";
import { Lesson7Protocols } from "./lesson-7-protocols";
import { Lesson8Clients } from "./lesson-8-clients";
import { Lesson9Income } from "./lesson-9-income";

interface LessonRouterV2Props {
    lessonId: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    totalScore?: number;
}

/**
 * Lesson Router V2 for Functional Medicine Mini Diploma
 *
 * New high-intent curriculum with:
 * - Self-assessment quizzes
 * - Case study challenges
 * - Knowledge checks
 * - Income calculator
 * - Downloadable resources
 * - Career-focused messaging
 */
export function LessonRouterV2({
    lessonId,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
    totalScore = 0,
}: LessonRouterV2Props) {
    const commonProps = {
        totalLessons: 9,
        firstName,
        onComplete,
        onNext,
        isCompleted,
    };

    switch (lessonId) {
        case 1:
            return <Lesson1RootCause lessonNumber={1} {...commonProps} />;
        case 2:
            return <Lesson2Gut lessonNumber={2} {...commonProps} />;
        case 3:
            return <Lesson3Inflammation lessonNumber={3} {...commonProps} />;
        case 4:
            return <Lesson4Toxins lessonNumber={4} {...commonProps} />;
        case 5:
            return <Lesson5Stress lessonNumber={5} {...commonProps} />;
        case 6:
            return <Lesson6Labs lessonNumber={6} {...commonProps} />;
        case 7:
            return <Lesson7Protocols lessonNumber={7} {...commonProps} />;
        case 8:
            return <Lesson8Clients lessonNumber={8} {...commonProps} />;
        case 9:
            return <Lesson9Income lessonNumber={9} {...commonProps} totalScore={totalScore} />;
        default:
            return <Lesson1RootCause lessonNumber={1} {...commonProps} />;
    }
}

// Lesson metadata for dashboard display
export const FM_LESSONS_V2 = [
    {
        id: 1,
        title: "Why Root Cause Medicine Wins",
        subtitle: "The paradigm shift that changes everything",
        duration: "8 min",
        hasAssessment: true,
    },
    {
        id: 2,
        title: "The Gut Connection",
        subtitle: "Fix the gut, fix 70% of issues",
        duration: "10 min",
        hasQuiz: true,
        hasDownload: true,
    },
    {
        id: 3,
        title: "The Inflammation Blueprint",
        subtitle: "The silent killer most practitioners miss",
        duration: "10 min",
        hasCaseStudy: true,
    },
    {
        id: 4,
        title: "The Toxin Reality",
        subtitle: "Your clients are poisoned. Here's proof.",
        duration: "10 min",
        hasQuiz: true,
        hasDownload: true,
    },
    {
        id: 5,
        title: "Stress & Hormones Decoded",
        subtitle: "Why cortisol is destroying health",
        duration: "10 min",
        hasCaseStudy: true,
    },
    {
        id: 6,
        title: "Lab Interpretation Secrets",
        subtitle: "What doctors miss - how YOU won't",
        duration: "10 min",
        hasQuiz: true,
        hasDownload: true,
    },
    {
        id: 7,
        title: "Building Client Protocols",
        subtitle: "Your $300 session starts here",
        duration: "12 min",
        hasCaseStudy: true,
    },
    {
        id: 8,
        title: "Finding Your First Clients",
        subtitle: "3 strategies that actually work",
        duration: "10 min",
        hasQuiz: true,
        hasDownload: true,
    },
    {
        id: 9,
        title: "Your Income Calculator",
        subtitle: "Graduate today. Start earning tomorrow.",
        duration: "8 min",
        hasCalculator: true,
        hasDownload: true,
    },
];
