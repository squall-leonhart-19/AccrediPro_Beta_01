"use client";

import { LessonIntroductionToGutHealth } from "./lesson-1-introduction-to-gut-health";
import { LessonTheMicrobiome } from "./lesson-2-the-microbiome";
import { LessonLeakyGutSyndrome } from "./lesson-3-leaky-gut-syndrome";
import { LessonSiboAndDysbiosis } from "./lesson-4-sibo-and-dysbiosis";
import { LessonTheGutBrainAxis } from "./lesson-5-the-gut-brain-axis";
import { LessonDigestiveEnzymesAndHcl } from "./lesson-6-digestive-enzymes-and-hcl";
import { LessonHealingProtocols } from "./lesson-7-healing-protocols";
import { LessonFoodSensitivities } from "./lesson-8-food-sensitivities";
import { LessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Gut Health lesson component based on lesson number
 */
export function GutHealthLessonRouter({
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
            return <LessonIntroductionToGutHealth {...commonProps} />;
        case 2:
            return <LessonTheMicrobiome {...commonProps} />;
        case 3:
            return <LessonLeakyGutSyndrome {...commonProps} />;
        case 4:
            return <LessonSiboAndDysbiosis {...commonProps} />;
        case 5:
            return <LessonTheGutBrainAxis {...commonProps} />;
        case 6:
            return <LessonDigestiveEnzymesAndHcl {...commonProps} />;
        case 7:
            return <LessonHealingProtocols {...commonProps} />;
        case 8:
            return <LessonFoodSensitivities {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonIntroductionToGutHealth {...commonProps} />;
    }
}
