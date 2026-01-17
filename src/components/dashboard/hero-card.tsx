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
        <Card
            className="border-0 overflow-hidden shadow-2xl"
            style={{
                background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 50%, #4e1f24 100%)'
            }}
        >
            <CardContent className="p-4 sm:p-6 relative">
                {/* Gold glow effect */}
                <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: '#d4af37' }}
                />

                {/* Main Content */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative">
                    {/* Left: Welcome with User Avatar */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* User Avatar - Gold border */}
                        <div
                            className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 rounded-full overflow-hidden"
                            style={{
                                border: '3px solid #d4af37',
                                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            {avatar ? (
                                <Image
                                    src={avatar}
                                    alt={firstName}
                                    width={72}
                                    height={72}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #722f37 0%, #4e1f24 100%)' }}
                                >
                                    <span className="text-2xl font-black" style={{ color: '#d4af37' }}>
                                        {initials}
                                    </span>
                                </div>
                            )}
                            {/* Online indicator */}
                            <span
                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
                                style={{ backgroundColor: '#22c55e', borderColor: '#4e1f24' }}
                            />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm" style={{ color: '#d4af37' }}>Welcome back</p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white capitalize tracking-tight">{firstName}</h1>
                        </div>
                    </div>

                    {/* Right: Income Potential - Premium Gold Metallic */}
                    <div className="w-full sm:w-auto">
                        <div
                            className="px-5 py-4 rounded-xl relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)',
                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#4e1f24' }}>Income Potential</p>
                            <p className="text-2xl sm:text-3xl font-black" style={{ color: '#4e1f24' }}>{incomeRange}</p>
                            <p className="text-xs mt-0.5 font-medium" style={{ color: '#722f37' }}>Based on your progress</p>
                        </div>
                    </div>
                </div>

                {/* Social Proof Bar - Premium */}
                <div className="mt-4 pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#22c55e' }} />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: '#22c55e' }} />
                        </span>
                        <span className="font-bold text-white">{liveFormatted}</span>
                        <span style={{ color: '#d4af37' }}>learning now</span>
                    </div>
                    <div className="w-px h-4 hidden sm:block" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: '#d4af37' }} />
                        <span className="font-bold text-white">{totalFormatted}</span>
                        <span className="hidden sm:inline" style={{ color: '#d4af37' }}>in community</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
