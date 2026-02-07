"use client";

import { LessonFoodAsMedicine } from "./lesson-1-food-as-medicine";
import { LessonMacronutrients } from "./lesson-2-macronutrients";
import { LessonMicronutrients } from "./lesson-3-micronutrients";
import { LessonAntiInflammatoryEating } from "./lesson-4-anti-inflammatory-eating";
import { LessonBloodSugarBalance } from "./lesson-5-blood-sugar-balance";
import { LessonGutNutritionConnection } from "./lesson-6-gut-nutrition-connection";
import { LessonPersonalizedNutrition } from "./lesson-7-personalized-nutrition";
import { LessonMindfulEating } from "./lesson-8-mindful-eating";
import { LessonYourNextStep } from "./lesson-9-your-next-step";

interface LessonRouterProps {
    lessonNumber: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

/**
 * Routes to the correct Holistic Nutrition lesson component based on lesson number
 */
export function HolisticNutritionLessonRouter({
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
            return <LessonFoodAsMedicine {...commonProps} />;
        case 2:
            return <LessonMacronutrients {...commonProps} />;
        case 3:
            return <LessonMicronutrients {...commonProps} />;
        case 4:
            return <LessonAntiInflammatoryEating {...commonProps} />;
        case 5:
            return <LessonBloodSugarBalance {...commonProps} />;
        case 6:
            return <LessonGutNutritionConnection {...commonProps} />;
        case 7:
            return <LessonPersonalizedNutrition {...commonProps} />;
        case 8:
            return <LessonMindfulEating {...commonProps} />;
        case 9:
            return <LessonYourNextStep {...commonProps} />;
        default:
            return <LessonFoodAsMedicine {...commonProps} />;
    }
}
