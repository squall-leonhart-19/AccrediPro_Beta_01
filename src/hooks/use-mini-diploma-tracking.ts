"use client";

import { useCallback } from "react";

type TrackingEvent =
    | "lesson_started"
    | "lesson_completed"
    | "assessment_completed"
    | "quiz_completed"
    | "case_study_completed"
    | "income_calculated"
    | "resource_downloaded"
    | "certificate_downloaded"
    | "score_updated";

interface TrackingProperties {
    lesson_id?: number;
    lesson_title?: string;
    score?: number;
    total?: number;
    assessment_type?: string;
    selected_options?: string[];
    monthly_income?: number;
    yearly_income?: number;
    resource_name?: string;
    resource_url?: string;
    duration_seconds?: number;
    practitioner_score?: number;
    [key: string]: any;
}

export function useMiniDiplomaTracking() {
    const track = useCallback(async (event: TrackingEvent, properties: TrackingProperties = {}) => {
        try {
            const response = await fetch("/api/track/mini-diploma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event,
                    properties: {
                        ...properties,
                        timestamp: new Date().toISOString(),
                    },
                }),
            });

            if (!response.ok) {
                console.error("[MiniDiplomaTracking] Failed to track event:", event);
            }
        } catch (error) {
            console.error("[MiniDiplomaTracking] Error tracking event:", event, error);
        }
    }, []);

    const trackLessonStarted = useCallback(
        (lessonId: number, lessonTitle: string) => {
            track("lesson_started", { lesson_id: lessonId, lesson_title: lessonTitle });
        },
        [track]
    );

    const trackLessonCompleted = useCallback(
        (lessonId: number, lessonTitle: string, durationSeconds?: number, practitionerScore?: number) => {
            track("lesson_completed", {
                lesson_id: lessonId,
                lesson_title: lessonTitle,
                duration_seconds: durationSeconds,
                practitioner_score: practitionerScore,
            });
        },
        [track]
    );

    const trackAssessmentCompleted = useCallback(
        (assessmentType: string, selectedOptions: string[], score: number) => {
            track("assessment_completed", {
                assessment_type: assessmentType,
                selected_options: selectedOptions,
                score,
            });
        },
        [track]
    );

    const trackQuizCompleted = useCallback(
        (quizTitle: string, score: number, total: number, lessonId?: number) => {
            track("quiz_completed", {
                lesson_id: lessonId,
                quiz_title: quizTitle,
                score,
                total,
                percentage: Math.round((score / total) * 100),
            });
        },
        [track]
    );

    const trackCaseStudyCompleted = useCallback(
        (caseTitle: string, isCorrect: boolean, lessonId?: number) => {
            track("case_study_completed", {
                lesson_id: lessonId,
                case_title: caseTitle,
                is_correct: isCorrect,
            });
        },
        [track]
    );

    const trackIncomeCalculated = useCallback(
        (monthlyIncome: number, yearlyIncome: number, hoursPerWeek?: number, sessionRate?: number) => {
            track("income_calculated", {
                monthly_income: monthlyIncome,
                yearly_income: yearlyIncome,
                hours_per_week: hoursPerWeek,
                session_rate: sessionRate,
            });
        },
        [track]
    );

    const trackResourceDownloaded = useCallback(
        (resourceName: string, resourceUrl: string, lessonId?: number) => {
            track("resource_downloaded", {
                lesson_id: lessonId,
                resource_name: resourceName,
                resource_url: resourceUrl,
            });
        },
        [track]
    );

    const trackCertificateDownloaded = useCallback(
        (practitionerScore: number, lessonsCompleted: number) => {
            track("certificate_downloaded", {
                practitioner_score: practitionerScore,
                lessons_completed: lessonsCompleted,
            });
        },
        [track]
    );

    return {
        track,
        trackLessonStarted,
        trackLessonCompleted,
        trackAssessmentCompleted,
        trackQuizCompleted,
        trackCaseStudyCompleted,
        trackIncomeCalculated,
        trackResourceDownloaded,
        trackCertificateDownloaded,
    };
}
