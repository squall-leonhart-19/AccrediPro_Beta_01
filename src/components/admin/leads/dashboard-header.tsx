"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    breadcrumbs?: Breadcrumb[];
    actions?: React.ReactNode;
    filters?: React.ReactNode;
    className?: string;
}

export function DashboardHeader({ title, subtitle, breadcrumbs, actions, filters, className }: DashboardHeaderProps) {
    return (
        <div className={cn("bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-5 lg:py-6 mb-6", className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1.5 mb-3">
                    {breadcrumbs.map((crumb, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
                            {crumb.href ? (
                                <Link href={crumb.href} className="text-white/60 hover:text-white text-sm transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-white text-sm font-medium">{crumb.label}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Title + Actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img src="/asi-logo.png" alt="ASI" className="w-10 h-10 lg:w-12 lg:h-12" />
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
                        <p className="text-[#C9A227] text-xs lg:text-sm">{subtitle}</p>
                    </div>
                </div>
                {actions && (
                    <div className="flex flex-wrap gap-2">
                        {actions}
                    </div>
                )}
            </div>

            {/* Filters row */}
            {filters && (
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    {filters}
                </div>
            )}
        </div>
    );
}
