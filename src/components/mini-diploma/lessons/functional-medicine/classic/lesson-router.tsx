"use client";

import { ClassicLessonFoundation } from "./lesson-1-foundation";
import { ClassicLessonDEPTHMethod } from "./lesson-2-depth-method";
import { ClassicLessonFirstClients } from "./lesson-3-first-clients";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    userId?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Classic Functional Medicine lesson component based on lesson number
 * 3-Lesson curriculum:
 *   1. Foundation — What is FM, 5 root causes, scope of practice
 *   2. The D.E.P.T.H. Method™ — Discover, Evaluate, Pinpoint, Transform, Heal
 *   3. How To Get Your First Clients — Warm market strategy, pricing, certification value
 */
export function ClassicFunctionalMedicineLessonRouter({
    lessonNumber,
    firstName,
    userId,
    onComplete,
    onNext,
    isCompleted,
}: LessonRouterProps) {
    const commonProps = {
        firstName,
        userId,
        onComplete,
        onNext,
        isCompleted,
        lessonNumber,
        totalLessons: 3,
    };

    switch (lessonNumber) {
        case 1:
            return <ClassicLessonFoundation {...commonProps} />;
        case 2:
            return <ClassicLessonDEPTHMethod {...commonProps} />;
        case 3:
            return <ClassicLessonFirstClients {...commonProps} />;
        default:
            return <ClassicLessonFoundation {...commonProps} />;
    }
}
