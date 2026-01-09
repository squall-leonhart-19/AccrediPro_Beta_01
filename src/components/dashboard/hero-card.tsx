"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface HeroCardProps {
    firstName: string;
    avatar?: string | null;
    incomeRange: string;
    liveFormatted: string;
    totalFormatted: string;
}

export function HeroCard({
    firstName,
    avatar,
    incomeRange,
    liveFormatted,
    totalFormatted,
}: HeroCardProps) {
    // Get initials for fallback avatar
    const initials = firstName.charAt(0).toUpperCase();

    return (
        <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-800 to-burgundy-900 border-0 overflow-hidden shadow-lg">
            <CardContent className="p-4 sm:p-6">
                {/* Main Content - Stack on mobile, row on desktop */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Welcome with User Avatar */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* User Avatar - Circular with gradient border */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-0.5">
                                <div className="w-full h-full rounded-full overflow-hidden bg-burgundy-800">
                                    {avatar ? (
                                        <Image
                                            src={avatar}
                                            alt={firstName}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-600 to-burgundy-700">
                                            <span className="text-xl sm:text-2xl font-bold text-gold-400">
                                                {initials}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Online indicator */}
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-burgundy-800 rounded-full"></span>
                        </div>
                        <div>
                            <p className="text-burgundy-200 text-xs sm:text-sm">Welcome back</p>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white capitalize">{firstName}</h1>
                        </div>
                    </div>

                    {/* Right: Income Potential - Full width on mobile */}
                    <div className="w-full sm:w-auto">
                        <div className="px-4 py-3 sm:px-5 bg-gradient-to-r from-gold-400/20 to-gold-500/20 backdrop-blur-sm rounded-xl border border-gold-400/30">
                            <p className="text-gold-200 text-xs uppercase tracking-wide">Income Potential</p>
                            <p className="text-xl sm:text-2xl font-bold text-gold-100">{incomeRange}</p>
                            <p className="text-gold-300 text-xs mt-0.5">Based on your progress</p>
                        </div>
                    </div>
                </div>

                {/* Social Proof Bar */}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-white font-semibold">{liveFormatted}</span>
                        <span className="text-burgundy-200">learning now</span>
                    </div>
                    <div className="w-px h-4 bg-white/20 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gold-400" />
                        <span className="text-white font-semibold">{totalFormatted}</span>
                        <span className="text-burgundy-200 hidden sm:inline">in community</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
