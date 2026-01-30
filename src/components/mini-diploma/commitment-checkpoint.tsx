"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Target, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommitmentCheckpointProps {
    firstName: string;
    lessonNumber: number;
    totalLessons: number;
    onCommit: () => void;
    onDismiss: () => void;
}

/**
 * Commitment checkpoint modal shown after completing lesson 3
 * Uses commitment/consistency psychological principle
 */
export function CommitmentCheckpoint({
    firstName,
    lessonNumber,
    totalLessons,
    onCommit,
    onDismiss,
}: CommitmentCheckpointProps) {
    const [isVisible, setIsVisible] = useState(false);
    const progress = Math.round((lessonNumber / totalLessons) * 100);

    // Animate in after a short delay
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCommit = () => {
        // Store commitment in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("mini_diploma_committed", "true");
            localStorage.setItem("mini_diploma_commit_date", new Date().toISOString());
        }
        onCommit();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "bg-black/50" : "bg-transparent pointer-events-none"
                }`}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
            >
                {/* Header */}
                <div className="p-6 text-center border-b">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 mx-auto flex items-center justify-center mb-4">
                        <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        You're {progress}% There, {firstName}! 🎯
                    </h2>
                    <p className="text-gray-600">
                        You've completed {lessonNumber} of {totalLessons} lessons. That's more than most people ever do.
                    </p>
                </div>

                {/* Progress visualization */}
                <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-amber-600">{progress}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Started</span>
                        <span>🎓 Certificate</span>
                    </div>
                </div>

                {/* Commitment message */}
                <div className="p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-900 font-medium mb-1">
                                    Research shows that people who make a commitment are 3x more likely to finish.
                                </p>
                                <p className="text-amber-800 text-sm">
                                    Take a moment to commit to yourself. Your future clients are counting on you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits list */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Only <strong>{totalLessons - lessonNumber} more lessons</strong> until your certificate</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>You'll have <strong>real credentials</strong> to share with clients</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Join <strong>2,847+ certified practitioners</strong> worldwide</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleCommit}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-4 rounded-xl"
                        >
                            <span className="flex items-center justify-center gap-2">
                                💪 I'm Committed to Finishing!
                            </span>
                        </Button>
                        <button
                            onClick={onDismiss}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
