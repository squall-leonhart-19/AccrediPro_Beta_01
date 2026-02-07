"use client";

import { LessonRootCauseMedicine } from "./lesson-1-root-cause-medicine";
import { LessonGutFoundation } from "./lesson-2-gut-foundation";
import { LessonInflammationConnection } from "./lesson-3-inflammation-connection";
import { LessonToxinBurden } from "./lesson-4-toxin-burden";
import { LessonStressHPA } from "./lesson-5-stress-hpa-axis";
import { LessonNutrientDeficiencies } from "./lesson-6-nutrient-deficiencies";
import { LessonLabInterpretation } from "./lesson-7-lab-interpretation";
import { LessonBuildingProtocols } from "./lesson-8-building-protocols";
import { LessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Functional Medicine lesson component based on lesson number
 * 3-Lesson curriculum covering root-cause medicine foundations
 */
export function FunctionalMedicineLessonRouter({
    lessonNumber,
    firstName,
    onComplete,
    onNext,
    isCompleted,
}: LessonRouterProps) {
    const commonProps = {
        firstName,
        onComplete,
        onNext,
        isCompleted,
        lessonNumber,
        totalLessons: 3,
    };

    switch (lessonNumber) {
        case 1:
            return <LessonRootCauseMedicine {...commonProps} />;
        case 2:
            return <LessonGutFoundation {...commonProps} />;
        case 3:
            return <LessonInflammationConnection {...commonProps} />;
        case 4:
            return <LessonToxinBurden {...commonProps} />;
        case 5:
            return <LessonStressHPA {...commonProps} />;
        case 6:
            return <LessonNutrientDeficiencies {...commonProps} />;
        case 7:
            return <LessonLabInterpretation {...commonProps} />;
        case 8:
            return <LessonBuildingProtocols {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonRootCauseMedicine {...commonProps} />;
    }
}
