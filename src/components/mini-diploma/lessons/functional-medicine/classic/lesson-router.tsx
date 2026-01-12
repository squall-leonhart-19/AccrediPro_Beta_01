"use client";

import { ClassicLessonRootCauseMedicine } from "./lesson-1-root-cause-medicine";
import { ClassicLessonGutFoundation } from "./lesson-2-gut-foundation";
import { ClassicLessonInflammationConnection } from "./lesson-3-inflammation-connection";
import { ClassicLessonToxinBurden } from "./lesson-4-toxin-burden";
import { ClassicLessonStressHPA } from "./lesson-5-stress-hpa-axis";
import { ClassicLessonNutrientDeficiencies } from "./lesson-6-nutrient-deficiencies";
import { ClassicLessonLabInterpretation } from "./lesson-7-lab-interpretation";
import { ClassicLessonBuildingProtocols } from "./lesson-8-building-protocols";
import { ClassicLessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Classic Functional Medicine lesson component based on lesson number
 * 9-Lesson curriculum covering root-cause medicine foundations
 *
 * This is the TEXT-BASED version (classic format like main courses)
 */
export function ClassicFunctionalMedicineLessonRouter({
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
        totalLessons: 9,
    };

    switch (lessonNumber) {
        case 1:
            return <ClassicLessonRootCauseMedicine {...commonProps} />;
        case 2:
            return <ClassicLessonGutFoundation {...commonProps} />;
        case 3:
            return <ClassicLessonInflammationConnection {...commonProps} />;
        case 4:
            return <ClassicLessonToxinBurden {...commonProps} />;
        case 5:
            return <ClassicLessonStressHPA {...commonProps} />;
        case 6:
            return <ClassicLessonNutrientDeficiencies {...commonProps} />;
        case 7:
            return <ClassicLessonLabInterpretation {...commonProps} />;
        case 8:
            return <ClassicLessonBuildingProtocols {...commonProps} />;
        case 9:
            return <ClassicLessonYourNextStep {...commonProps} />;
        default:
            return <ClassicLessonRootCauseMedicine {...commonProps} />;
    }
}
