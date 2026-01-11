"use client";

import { LessonFromBedsideToBusiness } from "./lesson-1-from-bedside-to-business";
import { LessonTheCoachingMindset } from "./lesson-2-the-coaching-mindset";
import { LessonBurnoutRecovery } from "./lesson-3-burnout-recovery";
import { LessonCoreCoachingSkills } from "./lesson-4-core-coaching-skills";
import { LessonHealthBehaviorChange } from "./lesson-5-health-behavior-change";
import { LessonBuildingYourPractice } from "./lesson-6-building-your-practice";
import { LessonMarketingForNurses } from "./lesson-7-marketing-for-nurses";
import { LessonLegalAndEthicalConsiderations } from "./lesson-8-legal-and-ethical-considerations";
import { LessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Nurse Life Coach lesson component based on lesson number
 */
export function NurseCoachLessonRouter({
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
            return <LessonFromBedsideToBusiness {...commonProps} />;
        case 2:
            return <LessonTheCoachingMindset {...commonProps} />;
        case 3:
            return <LessonBurnoutRecovery {...commonProps} />;
        case 4:
            return <LessonCoreCoachingSkills {...commonProps} />;
        case 5:
            return <LessonHealthBehaviorChange {...commonProps} />;
        case 6:
            return <LessonBuildingYourPractice {...commonProps} />;
        case 7:
            return <LessonMarketingForNurses {...commonProps} />;
        case 8:
            return <LessonLegalAndEthicalConsiderations {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonFromBedsideToBusiness {...commonProps} />;
    }
}
