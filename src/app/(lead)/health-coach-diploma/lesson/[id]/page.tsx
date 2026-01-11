"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { HealthCoachLessonRouter } from "@/components/mini-diploma/lessons/health-coach/lesson-router";

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = parseInt(params.id as string);

    const [firstName, setFirstName] = useState("friend");
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/lead-onboarding/lesson-status?lesson=${lessonId}&niche=health-coach`);
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName || "friend");
                    setIsCompleted(data.completed || false);
                }
            } catch (e) {
                console.error("Failed to check lesson status");
            }
        };
        fetchStatus();
    }, [lessonId]);

    if (lessonId < 1 || lessonId > 9 || isNaN(lessonId)) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Lesson not found</h1>
                <Link href="/health-coach-diploma">
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
                body: JSON.stringify({ lessonId, niche: "health-coach" }),
            });

            if (res.ok) {
                setIsCompleted(true);
            }
        } catch (e) {
            console.error("Failed to mark lesson complete");
        }
    };

    const handleNext = () => {
        if (lessonId < 9) {
            router.push(`/health-coach-diploma/lesson/${lessonId + 1}`);
        } else {
            router.push("/health-coach-diploma/complete");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/health-coach-diploma" className="flex items-center gap-2 text-gray-600 hover:text-burgundy-600">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <span className="text-sm text-gray-500">Lesson {lessonId} of 9</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <HealthCoachLessonRouter
                    lessonNumber={lessonId}
                    firstName={firstName}
                    onComplete={handleComplete}
                    onNext={handleNext}
                    isCompleted={isCompleted}
                />
            </div>
        </div>
    );
}
