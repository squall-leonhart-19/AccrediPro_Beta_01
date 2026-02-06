"use client";

import { cn } from "@/lib/utils";

interface StatGridProps {
    children: React.ReactNode;
    cols?: 2 | 3 | 4 | 5;
    className?: string;
}

const COL_CLASSES: Record<number, string> = {
    2: "grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4",
    3: "grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4",
    4: "grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4",
    5: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4",
};

export function StatGrid({ children, cols = 4, className }: StatGridProps) {
    return (
        <div className={cn(COL_CLASSES[cols], className)}>
            {children}
        </div>
    );
}
