"use client";

import { Zap, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickStartOptionProps {
    /** Callback when user selects quick start */
    onQuickStart: () => void;
    /** Callback when user selects full training */
    onFullTraining: () => void;
    /** User's first name */
    firstName?: string;
    /** Whether to show as card or inline */
    variant?: "card" | "inline" | "banner";
}

export function QuickStartOption({
    onQuickStart,
    onFullTraining,
    firstName = "there",
    variant = "card",
}: QuickStartOptionProps) {
    if (variant === "banner") {
        return (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Short on time?</p>
                            <p className="text-sm text-gray-600">
                                Complete Modules 1-3 in 15 min, finish rest later
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={onQuickStart}
                        variant="outline"
                        className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Quick Start (15 min)
                    </Button>
                </div>
            </div>
        );
    }

    if (variant === "inline") {
        return (
            <button
                onClick={onQuickStart}
                className="flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-800 transition-colors"
            >
                <Zap className="w-4 h-4" />
                <span>Short on time? Try Quick Start (15 min)</span>
                <ArrowRight className="w-3 h-3" />
            </button>
        );
    }

    // Card variant (default)
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 text-center">
                <p className="text-white font-bold">
                    <Zap className="w-5 h-5 inline mr-2" />
                    SHORT ON TIME RIGHT NOW?
                </p>
            </div>

            <div className="p-6 space-y-6">
                {/* Quick Start Option */}
                <div
                    className={cn(
                        "p-5 rounded-xl border-2 border-yellow-200 bg-yellow-50",
                        "hover:border-yellow-400 transition-colors cursor-pointer"
                    )}
                    onClick={onQuickStart}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                                ⚡ QUICK START (15 min)
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Complete Modules 1-3 now, finish the rest later.
                                You'll already know more than most practitioners.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    15 minutes
                                </span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    3 lessons
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-yellow-500 mt-3" />
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Full Training Option */}
                <div
                    className={cn(
                        "p-5 rounded-xl border-2 border-gray-200 bg-gray-50",
                        "hover:border-[#722f37] transition-colors cursor-pointer"
                    )}
                    onClick={onFullTraining}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#722f3715" }}
                        >
                            <Clock className="w-6 h-6 text-[#722f37]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                                📚 FULL TRAINING (67 min avg)
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Complete all 9 lessons and get your certificate today.
                                89% finish in one sitting.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    60-90 minutes
                                </span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    9 lessons + certificate
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#722f37] mt-3" />
                    </div>
                </div>

                {/* Pro tip */}
                <p className="text-center text-sm text-gray-500">
                    💡 <strong>Pro tip:</strong> Most people who start Quick Start end up finishing everything
                </p>
            </div>
        </div>
    );
}
