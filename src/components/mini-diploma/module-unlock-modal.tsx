"use client";

import { useEffect, useState } from "react";
import {
    Trophy, ArrowRight, Download, Sparkles, Lock,
    FileText, Users, Compass, Target, Heart,
    Map, CheckCircle, MessageSquare, Lightbulb,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Resource type matching diploma-configs
interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    type: "core" | "client" | "toolkit";
    icon: "FileText" | "Users" | "Compass" | "Target" | "Heart" | "Map" | "CheckCircle" | "MessageSquare" | "Lightbulb";
}

interface ModuleUnlockModalProps {
    moduleNumber: 1 | 2 | 3;
    unlockedResources: Resource[];
    totalUnlocked: number;
    totalResources: number;
    onContinue: () => void;
    onDismiss: () => void;
    firstName?: string;
}

const ICON_MAP = {
    FileText,
    Users,
    Compass,
    Target,
    Heart,
    Map,
    CheckCircle,
    MessageSquare,
    Lightbulb,
};

const MODULE_NAMES = {
    1: "Foundations",
    2: "Core Concepts",
    3: "Application",
};

const NEXT_MODULE_TEASERS = {
    1: "Complete Module 2 to unlock 4 more professional resources!",
    2: "Complete Module 3 to unlock your final 3 resources + certificate!",
    3: null, // No teaser after final module
};

export function ModuleUnlockModal({
    moduleNumber,
    unlockedResources,
    totalUnlocked,
    totalResources,
    onContinue,
    onDismiss,
    firstName = "there",
}: ModuleUnlockModalProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const [animateResources, setAnimateResources] = useState(false);

    useEffect(() => {
        // Animate resources appearing
        const timer = setTimeout(() => setAnimateResources(true), 300);
        // Hide confetti after animation
        const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);
        return () => {
            clearTimeout(timer);
            clearTimeout(confettiTimer);
        };
    }, []);

    const progressPercent = Math.round((totalUnlocked / totalResources) * 100);
    const isFinalModule = moduleNumber === 3;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-300"
            onClick={onDismiss}
        >
            <div
                className={cn(
                    "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden",
                    "animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Celebration Header */}
                <div
                    className="relative py-8 px-6 text-center overflow-hidden"
                    style={{
                        background: isFinalModule
                            ? "linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)"
                            : "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                    }}
                >
                    {/* Floating celebration icons */}
                    {showConfetti && (
                        <>
                            <div className="absolute top-2 left-4 text-3xl animate-bounce">🎉</div>
                            <div className="absolute top-4 right-6 text-2xl animate-bounce delay-100">⭐</div>
                            <div className="absolute bottom-2 left-1/4 text-2xl animate-bounce delay-200">📄</div>
                            <div className="absolute bottom-4 right-1/4 text-2xl animate-bounce delay-300">✨</div>
                        </>
                    )}

                    <div className={cn(
                        "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                        isFinalModule ? "bg-white/30" : "bg-white/20"
                    )}>
                        <Trophy className={cn("w-8 h-8", isFinalModule ? "text-burgundy-800" : "text-white")} />
                    </div>

                    <h2 className={cn(
                        "text-2xl font-black mb-2",
                        isFinalModule ? "text-burgundy-800" : "text-white"
                    )}>
                        🏆 Module {moduleNumber} Complete!
                    </h2>
                    <p className={cn(
                        "text-sm",
                        isFinalModule ? "text-burgundy-700" : "text-white/80"
                    )}>
                        {MODULE_NAMES[moduleNumber]} mastered, {firstName}!
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Unlock Announcement */}
                    <div className="text-center">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                            style={{
                                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(247, 231, 160, 0.3) 100%)",
                                color: "#8B6914",
                                border: "2px solid #d4af37"
                            }}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>{unlockedResources.length} New Resource{unlockedResources.length > 1 ? 's' : ''} Unlocked!</span>
                        </div>
                    </div>

                    {/* Unlocked Resources List */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Download className="w-4 h-4 text-emerald-600" />
                            Your New Resources
                        </h4>
                        <div className="space-y-2">
                            {unlockedResources.map((resource, index) => {
                                const IconComponent = ICON_MAP[resource.icon] || FileText;
                                const typeColor = resource.type === "core" ? "#722f37" : "#0891b2";

                                return (
                                    <a
                                        key={resource.id}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all group",
                                            animateResources
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 translate-x-4"
                                        )}
                                        style={{
                                            transitionDelay: `${index * 100}ms`,
                                            transitionDuration: "300ms"
                                        }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${typeColor}20` }}
                                        >
                                            <IconComponent className="w-4 h-4" style={{ color: typeColor }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">
                                                {resource.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-emerald-800">
                                Resources Unlocked
                            </span>
                            <span className="text-sm font-bold text-emerald-600">
                                {totalUnlocked}/{totalResources}
                            </span>
                        </div>
                        <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        {NEXT_MODULE_TEASERS[moduleNumber] && (
                            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {NEXT_MODULE_TEASERS[moduleNumber]}
                            </p>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={onContinue}
                        className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg"
                        style={{
                            background: isFinalModule
                                ? "linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)"
                                : "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                            color: isFinalModule ? "#4e1f24" : "white"
                        }}
                    >
                        {isFinalModule ? (
                            <>
                                Take Final Exam
                                <Trophy className="w-5 h-5 ml-2" />
                            </>
                        ) : (
                            <>
                                Continue to Module {moduleNumber + 1}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
