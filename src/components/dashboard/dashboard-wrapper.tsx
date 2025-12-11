"use client";

import { useState, useEffect } from "react";
import { Walkthrough } from "@/components/onboarding/walkthrough";

interface DashboardWrapperProps {
    children: React.ReactNode;
    userName?: string;
    userId?: string;
    hasCompletedOnboarding?: boolean;
}

export function DashboardWrapper({ children, userName, userId, hasCompletedOnboarding }: DashboardWrapperProps) {
    const [showTour, setShowTour] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        // Use user-specific localStorage keys, with general fallback
        const tourComplete = localStorage.getItem(`tour-complete-${userId}`) === "true"
            || localStorage.getItem("tour-complete-general") === "true";

        // Show tour if not completed
        if (!tourComplete) {
            setShowTour(true);
        }

        setIsLoading(false);
    }, [userId]);

    const handleTourComplete = () => {
        if (userId) {
            localStorage.setItem(`tour-complete-${userId}`, "true");
        }
        localStorage.setItem("tour-complete-general", "true");
        setShowTour(false);
    };

    return (
        <>
            {showTour && !isLoading && (
                <Walkthrough
                    userName={userName || "Friend"}
                    userId={userId}
                    onComplete={handleTourComplete}
                />
            )}
            {children}
        </>
    );
}

export default DashboardWrapper;
