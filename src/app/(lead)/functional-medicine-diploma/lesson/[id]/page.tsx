"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClassicFunctionalMedicineLessonRouter } from "@/components/mini-diploma/lessons/functional-medicine/classic/lesson-router";

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = parseInt(params.id as string);

    const [firstName, setFirstName] = useState("friend");
    const [userId, setUserId] = useState<string | undefined>();
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/lead-onboarding/lesson-status?lesson=${lessonId}&niche=functional-medicine`);
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName || "friend");
                    setUserId(data.userId);
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
                <Link href="/functional-medicine-diploma">
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
                body: JSON.stringify({ lessonId, niche: "functional-medicine" }),
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
            router.push(`/functional-medicine-diploma/lesson/${lessonId + 1}`);
        } else {
            router.push("/functional-medicine-diploma/complete");
        }
    };

    // Classic text-based lesson component handles its own header/navigation
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
