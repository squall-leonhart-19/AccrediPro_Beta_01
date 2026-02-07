"use client";

import { ClassicLessonBase, LessonSection } from "./classic-lesson-base";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Import lesson content JSON files
import energyHealingContent from "../content/energy-healing.json";
import christianCoachingContent from "../content/christian-coaching.json";
import gutHealthContent from "../content/gut-health.json";
import reikiHealingContent from "../content/reiki-healing.json";
import adhdCoachingContent from "../content/adhd-coaching.json";
import petNutritionContent from "../content/pet-nutrition.json";
import hormoneHealthContent from "../content/hormone-health.json";
import holisticNutritionContent from "../content/holistic-nutrition.json";
import nurseCoachContent from "../content/nurse-coach.json";
import healthCoachContent from "../content/health-coach.json";
import womensHormoneHealthContent from "../content/womens-hormone-health.json";
import spiritualHealingContent from "../content/spiritual-healing.json";

// Type for lesson content structure
interface LessonData {
    id: number;
    title: string;
    subtitle: string;
    readingTime?: string;
    sections: LessonSection[];
    keyTakeaways: string[];
}

interface NicheContent {
    niche: string;
    nicheLabel: string;
    baseUrl: string;
    courseSlug: string;
    lessons: LessonData[];
}

// Map portal slugs to their lesson content
const LESSON_CONTENT: Record<string, NicheContent> = {
    "energy-healing": energyHealingContent as NicheContent,
    "christian-coaching": christianCoachingContent as NicheContent,
    "gut-health": gutHealthContent as NicheContent,
    "reiki-healing": reikiHealingContent as NicheContent,
    "adhd-coaching": adhdCoachingContent as NicheContent,
    "pet-nutrition": petNutritionContent as NicheContent,
    "hormone-health": hormoneHealthContent as NicheContent,
    "holistic-nutrition": holisticNutritionContent as NicheContent,
    "nurse-coach": nurseCoachContent as NicheContent,
    "health-coach": healthCoachContent as NicheContent,
    "womens-hormone-health": womensHormoneHealthContent as NicheContent,
    "spiritual-healing": spiritualHealingContent as NicheContent,
};

interface DynamicLessonRouterProps {
    portalSlug: string;
    lessonNumber: number;
    firstName?: string;
    userId?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function DynamicLessonRouter({
    portalSlug,
    lessonNumber,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted = false,
}: DynamicLessonRouterProps) {
    // Get content for this niche
    const content = LESSON_CONTENT[portalSlug];

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Lesson Content Not Found</h1>
                    <p className="text-gray-600 mb-4">
                        Lesson content for &quot;{portalSlug}&quot; is not yet available.
                    </p>
                    <Link href={`/portal/${portalSlug}`}>
                        <Button>Back to Portal</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Get the specific lesson
    const lesson = content.lessons.find(l => l.id === lessonNumber);

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Lesson Not Found</h1>
                    <p className="text-gray-600 mb-4">
                        Lesson {lessonNumber} does not exist.
                    </p>
                    <Link href={`/portal/${portalSlug}`}>
                        <Button>Back to Portal</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle={lesson.title}
            lessonSubtitle={lesson.subtitle}
            totalLessons={content.lessons.length}
            readingTime={lesson.readingTime}
            sections={lesson.sections}
            keyTakeaways={lesson.keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche={content.niche}
            nicheLabel={content.nicheLabel}
            baseUrl={content.baseUrl}
            courseSlug={content.courseSlug}
            showChat={false} // No chat for mini diplomas
        />
    );
}
