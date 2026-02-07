"use client";

import { LessonMeetYourHormones } from "./lesson-1-meet-your-hormones";
import { LessonTheMenstrualCycle } from "./lesson-2-the-menstrual-cycle";
import { LessonHormonalImbalances } from "./lesson-3-hormonal-imbalances";
import { LessonTheThyroidConnection } from "./lesson-4-the-thyroid-connection";
import { LessonAdrenalHealth } from "./lesson-5-adrenal-health";
import { LessonPerimenopauseAndMenopause } from "./lesson-6-perimenopause-and-menopause";
import { LessonHormoneTesting } from "./lesson-7-hormone-testing";
import { LessonNaturalBalancing } from "./lesson-8-natural-balancing";
import { LessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Hormone Health lesson component based on lesson number
 */
export function HormoneHealthLessonRouter({
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
            return <LessonMeetYourHormones {...commonProps} />;
        case 2:
            return <LessonTheMenstrualCycle {...commonProps} />;
        case 3:
            return <LessonHormonalImbalances {...commonProps} />;
        case 4:
            return <LessonTheThyroidConnection {...commonProps} />;
        case 5:
            return <LessonAdrenalHealth {...commonProps} />;
        case 6:
            return <LessonPerimenopauseAndMenopause {...commonProps} />;
        case 7:
            return <LessonHormoneTesting {...commonProps} />;
        case 8:
            return <LessonNaturalBalancing {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonMeetYourHormones {...commonProps} />;
    }
}
