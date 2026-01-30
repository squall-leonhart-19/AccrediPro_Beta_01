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
    enrolledAt?: string | null;
    portalSlug: string;
    diplomaName: string;
}

export function LeadOnboardingClient({
    firstName,
    completedLessons,
    enrolledAt,
    portalSlug,
}: LeadOnboardingClientProps) {
    // Map portal slug to diploma config key format
    const configKey = `${portalSlug}-diploma`;
    const config = DIPLOMA_CONFIGS[configKey];

    if (!config) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Portal Not Found</h1>
                    <p className="text-gray-600">The diploma portal &quot;{portalSlug}&quot; is not configured.</p>
                </div>
            </div>
        );
    }

    return (
        <LeadPortalDashboard
            firstName={firstName}
            completedLessons={completedLessons}
            config={config}
            enrolledAt={enrolledAt}
        />
    );
}
