"use client";

import { LessonWhatIsHealthCoaching? } from "./lesson-1-what-is-health-coaching?";
import { LessonCoreCoachingCompetencies } from "./lesson-2-core-coaching-competencies";
import { LessonTheWellnessWheel } from "./lesson-3-the-wellness-wheel";
import { LessonGoalSettingAndActionPlans } from "./lesson-4-goal-setting-and-action-plans";
import { LessonMotivationalInterviewing } from "./lesson-5-motivational-interviewing";
import { LessonNutritionFoundations } from "./lesson-6-nutrition-foundations";
import { LessonStressAndLifestyle } from "./lesson-7-stress-and-lifestyle";
import { LessonBuildingYourPractice } from "./lesson-8-building-your-practice";
import { LessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Health Coach lesson component based on lesson number
 */
export function HealthCoachLessonRouter({
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
            return <LessonWhatIsHealthCoaching? {...commonProps} />;
        case 2:
            return <LessonCoreCoachingCompetencies {...commonProps} />;
        case 3:
            return <LessonTheWellnessWheel {...commonProps} />;
        case 4:
            return <LessonGoalSettingAndActionPlans {...commonProps} />;
        case 5:
            return <LessonMotivationalInterviewing {...commonProps} />;
        case 6:
            return <LessonNutritionFoundations {...commonProps} />;
        case 7:
            return <LessonStressAndLifestyle {...commonProps} />;
        case 8:
            return <LessonBuildingYourPractice {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonWhatIsHealthCoaching? {...commonProps} />;
    }
}
