"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClassicFunctionalMedicineLessonRouter } from "@/components/mini-diploma/lessons/functional-medicine/classic/lesson-router";
import { DynamicLessonRouter } from "@/components/mini-diploma/lessons/shared/dynamic-lesson-router";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";

// Niches that have dynamic JSON content (no chat widget)
const DYNAMIC_CONTENT_NICHES = ["spiritual-healing", "energy-healing", "christian-coaching", "gut-health", "reiki-healing", "adhd-coaching", "pet-nutrition"];

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const lessonId = parseInt(params.id as string);

    const [firstName, setFirstName] = useState("friend");
    const [userId, setUserId] = useState<string | undefined>();
    const [isCompleted, setIsCompleted] = useState(false);

    // Get config for this portal
    const config = getConfigByPortalSlug(slug);
    const totalLessons = config?.lessons.length || 9;

    useEffect(() => {
        if (!config) return;

        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/lead-onboarding/lesson-status?lesson=${lessonId}&niche=${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName || "friend");
                    setUserId(data.userId);
                    setIsCompleted(data.completed || false);

                    // If this is the last lesson and already completed + exam passed, redirect to complete page
                    if (lessonId === totalLessons && data.completed && data.examPassed) {
                        router.replace(`/portal/${slug}/complete`);
                    }
                }
            } catch (e) {
                console.error("Failed to check lesson status");
            }
        };
        fetchStatus();
    }, [lessonId, router, slug, config, totalLessons]);

    if (!config) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Portal not found</h1>
                <Link href="/dashboard">
                    <Button className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    if (lessonId < 1 || lessonId > totalLessons || isNaN(lessonId)) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Lesson not found</h1>
                <Link href={`/portal/${slug}`}>
                    <Button className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const handleComplete = async () => {
        try {
            const res = await fetch("/api/lead-onboarding/lesson-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, niche: slug }),
            });

            if (res.ok) {
                setIsCompleted(true);
            }
        } catch (e) {
            console.error("Failed to mark lesson complete");
        }
    };

    const handleNext = () => {
        if (lessonId < totalLessons) {
            router.push(`/portal/${slug}/lesson/${lessonId + 1}`);
        } else {
            router.push(`/portal/${slug}/exam`);
        }
    };

    // Use dynamic router for niches with JSON content (no chat widget)
    // Fall back to FM router for other niches (backward compatibility)
    if (DYNAMIC_CONTENT_NICHES.includes(slug)) {
        return (
            <DynamicLessonRouter
                portalSlug={slug}
                lessonNumber={lessonId}
                firstName={firstName}
                userId={userId}
                onComplete={handleComplete}
                onNext={handleNext}
                isCompleted={isCompleted}
            />
        );
    }

    // Fallback: Use FM lesson router for niches without custom JSON content
    return (
        <ClassicFunctionalMedicineLessonRouter
            lessonNumber={lessonId}
            firstName={firstName}
            userId={userId}
            onComplete={handleComplete}
            onNext={handleNext}
            isCompleted={isCompleted}
        />
    );
}

