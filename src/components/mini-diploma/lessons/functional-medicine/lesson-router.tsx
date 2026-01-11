"use client";

import { LessonMeetYourHormones } from "./lesson-1-meet-your-hormones";
import { LessonMonthlyDance } from "./lesson-2-monthly-dance";
import { LessonHormonesGoneRogue } from "./lesson-3-hormones-gone-rogue";
import { LessonGutHormoneAxis } from "./lesson-4-gut-hormone-axis";
import { LessonThyroidEnergy } from "./lesson-5-thyroid-energy";
import { LessonStressAdrenals } from "./lesson-6-stress-adrenals";
import { LessonFoodAsMedicine } from "./lesson-7-food-as-medicine";
import { LessonLifeStageSupport } from "./lesson-8-life-stage-support";
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
 * All lessons share the same Sarah chat format
 */
export function WomensHealthLessonRouter({
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
            return <LessonMeetYourHormones {...commonProps} />;
        case 2:
            return <LessonMonthlyDance {...commonProps} />;
        case 3:
            return <LessonHormonesGoneRogue {...commonProps} />;
        case 4:
            return <LessonGutHormoneAxis {...commonProps} />;
        case 5:
            return <LessonThyroidEnergy {...commonProps} />;
        case 6:
            return <LessonStressAdrenals {...commonProps} />;
        case 7:
            return <LessonFoodAsMedicine {...commonProps} />;
        case 8:
            return <LessonLifeStageSupport {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonMeetYourHormones {...commonProps} />;
    }
}
