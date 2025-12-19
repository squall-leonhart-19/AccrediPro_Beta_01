"use client";

import { LessonWhatIsFMV4 } from "./lesson-what-is-fm-v4";
import { Lesson7BodySystems } from "./lesson-7-body-systems";
import { LessonUnfairAdvantage } from "./lesson-unfair-advantage";
import { LessonGutHealth } from "./lesson-gut-health";
import { LessonHormonesThyroid } from "./lesson-hormones-thyroid";
import { LessonConnectingDots } from "./lesson-connecting-dots";
import { LessonWorkingWithClients } from "./lesson-working-with-clients";
import { LessonBuildingPractice } from "./lesson-building-practice";
import { LessonYourNextStep } from "./lesson-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct lesson component based on lesson number
 * All lessons share the same Sarah chat format
 */
export function LessonRouter({
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
        isPaid: true, // User has paid if they're past lesson 1
    };

    switch (lessonNumber) {
        case 1:
            return <LessonWhatIsFMV4 {...commonProps} isPaid={false} />;
        case 2:
            return <Lesson7BodySystems {...commonProps} />;
        case 3:
            return <LessonUnfairAdvantage {...commonProps} />;
        case 4:
            return <LessonGutHealth {...commonProps} />;
        case 5:
            return <LessonHormonesThyroid {...commonProps} />;
        case 6:
            return <LessonConnectingDots {...commonProps} />;
        case 7:
            return <LessonWorkingWithClients {...commonProps} />;
        case 8:
            return <LessonBuildingPractice {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonWhatIsFMV4 {...commonProps} />;
    }
}
