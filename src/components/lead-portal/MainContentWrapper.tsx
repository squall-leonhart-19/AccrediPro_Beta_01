"use client";

import { useSidebar } from "@/contexts/sidebar-context";

interface MainContentWrapperProps {
    children: React.ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
    const { isCollapsed, isLessonPage } = useSidebar();

    // When sidebar is collapsed on lesson pages, remove the left padding
    const shouldRemovePadding = isLessonPage && isCollapsed;

    return (
        <main className={`pt-14 lg:pt-0 transition-all duration-300 ${shouldRemovePadding ? "lg:pl-0" : "lg:pl-64"}`}>
            <div className="min-h-screen">
                {children}
            </div>
        </main>
    );
}
