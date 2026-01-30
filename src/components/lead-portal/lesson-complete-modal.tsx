"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Coffee, Sparkles, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonCompleteModalProps {
    /** Lesson number just completed */
    lessonNumber: number;
    /** Lesson title */
    lessonTitle: string;
    /** Total lessons in the course */
    totalLessons: number;
    /** Callback when user continues to next lesson */
    onContinue: () => void;
    /** Callback when user wants a break */
    onTakeBreak?: () => void;
    /** User's first name */
    firstName?: string;
    /** Whether this is a module-ending lesson (3, 6, 9) */
    isModuleEnd?: boolean;
}

// Value anchors for lessons
const LESSON_VALUES = [
    "understanding root-cause medicine",
    "gut health fundamentals",
    "inflammation science",
    "toxin burden assessment",
    "stress response",
    "nutrient deficiencies",
    "lab interpretation",
    "protocol building",
    "practice development",
];

const CELEBRATION_EMOJIS = ["🎉", "⭐", "🔥", "💪", "🚀", "✨", "🏆", "💫", "🌟"];

export function LessonCompleteModal({
    lessonNumber,
    lessonTitle,
    totalLessons,
    onContinue,
    onTakeBreak,
    firstName = "there",
    isModuleEnd = false,
}: LessonCompleteModalProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const lessonsRemaining = totalLessons - lessonNumber;
    const progressPercent = Math.round((lessonNumber / totalLessons) * 100);
    const isComplete = lessonNumber >= totalLessons;

    useEffect(() => {
        // Hide confetti after 3 seconds
        const timeout = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timeout);
    }, []);

    const moduleNumber = Math.ceil(lessonNumber / 3);
    const valueAnchor = LESSON_VALUES[lessonNumber - 1] || "this key concept";
    const emoji = CELEBRATION_EMOJIS[(lessonNumber - 1) % CELEBRATION_EMOJIS.length];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
            <div
                className={cn(
                    "relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden",
                    "animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                )}
            >
                {/* Celebration Header */}
                <div
                    className="relative py-8 px-6 text-center overflow-hidden"
                    style={{
                        background: isComplete
                            ? "linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)"
                            : "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                    }}
                >
                    {/* Floating emojis */}
                    {showConfetti && (
                        <>
                            <div className="absolute top-2 left-4 text-3xl animate-bounce">{emoji}</div>
                            <div className="absolute top-4 right-6 text-2xl animate-bounce delay-100">⭐</div>
                            <div className="absolute bottom-2 left-1/4 text-2xl animate-bounce delay-200">🔥</div>
                            <div className="absolute bottom-4 right-1/4 text-2xl animate-bounce delay-300">💪</div>
                        </>
                    )}

                    <div className={cn(
                        "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                        isComplete ? "bg-white/30" : "bg-white/20"
                    )}>
                        {isComplete ? (
                            <Trophy className="w-8 h-8 text-white" />
                        ) : (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-white mb-2">
                        {isComplete ? "🎉 You Did It!" : `✅ Lesson ${lessonNumber} Complete!`}
                    </h2>
                    <p className="text-white/80 text-sm">{lessonTitle}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Progress Update */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span>{progressPercent}% complete — {lessonsRemaining} lessons to go</span>
                        </div>
                    </div>

                    {/* Value Anchor + Social Proof */}
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                        <p className="text-green-800 text-sm">
                            <strong>You now understand {valueAnchor}</strong> better than 90% of practitioners.
                            {isModuleEnd && (
                                <span className="block mt-1 text-green-700">
                                    🎯 Module {moduleNumber} complete! You're crushing it.
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Value Comparison */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>This lesson alone costs <strong>$47</strong> in most programs</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={onContinue}
                            className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                            }}
                        >
                            {isComplete ? (
                                <>
                                    Claim My Certificate
                                    <Trophy className="w-5 h-5 ml-2" />
                                </>
                            ) : (
                                <>
                                    Continue to Lesson {lessonNumber + 1}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>

                        {!isComplete && onTakeBreak && (
                            <button
                                onClick={onTakeBreak}
                                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                            >
                                <Coffee className="w-4 h-4" />
                                Take a 5-minute break
                            </button>
                        )}
                    </div>

                    {/* Encouragement */}
                    {!isComplete && (
                        <p className="text-center text-sm text-gray-500">
                            {lessonsRemaining <= 3
                                ? `🏁 Only ${lessonsRemaining} more lesson${lessonsRemaining === 1 ? "" : "s"}! You've got this, ${firstName}!`
                                : `🔥 Keep the momentum going, ${firstName}!`}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
