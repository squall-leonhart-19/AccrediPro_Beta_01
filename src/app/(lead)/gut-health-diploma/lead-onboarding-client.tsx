"use client";

import { LeadPortalDashboard } from "@/components/lead-portal/LeadPortalDashboard";
import { DIPLOMA_CONFIGS } from "@/components/lead-portal/diploma-configs";

interface LeadOnboardingClientProps {
    firstName: string;
    userAvatar?: string | null;
    watchedVideo: boolean;
    completedQuestions: boolean;
    completedLessons: number[];
    steps: { id: number; title: string; completed: boolean }[];
    currentStep: number;
    progress: number;
}

export function LeadOnboardingClient({
    firstName,
    completedLessons,
}: LeadOnboardingClientProps) {
    const config = DIPLOMA_CONFIGS["gut-health-diploma"];

    return (
        <LeadPortalDashboard
            firstName={firstName}
            completedLessons={completedLessons}
            config={config}
        />
    );
}
