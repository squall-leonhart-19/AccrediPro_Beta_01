"use client";

interface DashboardWrapperProps {
    children: React.ReactNode;
    userName?: string;
    userId?: string;
    hasCompletedOnboarding?: boolean;
}

/**
 * DashboardWrapper - Simplified wrapper for dashboard pages
 *
 * Note: The interactive tour is now handled by:
 * - InteractiveTour component on /start-here page
 * - Triggered via the "Take the Platform Tour" checklist item
 *
 * This keeps the onboarding flow cleaner with a single tour entry point.
 */
export function DashboardWrapper({ children }: DashboardWrapperProps) {
    return <>{children}</>;
}

export default DashboardWrapper;
