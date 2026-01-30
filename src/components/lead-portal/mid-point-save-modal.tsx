"use client";

import { useState } from "react";
import { Clock, MessageSquare, ArrowRight, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MidPointSaveModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Callback when user wants to continue now */
    onContinueNow: () => void;
    /** Callback when user requests a reminder */
    onRequestReminder: (timing: "2h" | "tomorrow") => void;
    /** User's first name */
    firstName?: string;
    /** Current lesson number */
    currentLesson: number;
    /** Total lessons */
    totalLessons: number;
}

export function MidPointSaveModal({
    isOpen,
    onClose,
    onContinueNow,
    onRequestReminder,
    firstName = "there",
    currentLesson,
    totalLessons,
}: MidPointSaveModalProps) {
    const [selectedOption, setSelectedOption] = useState<"2h" | "tomorrow" | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    if (!isOpen) return null;

    const lessonsRemaining = totalLessons - currentLesson;
    const progressPercent = Math.round((currentLesson / totalLessons) * 100);

    const handleRequestReminder = async (timing: "2h" | "tomorrow") => {
        setSelectedOption(timing);
        setIsRequesting(true);
        await onRequestReminder(timing);
        setIsRequesting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
            <div
                className={cn(
                    "relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden",
                    "animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                )}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Header */}
                <div
                    className="py-8 px-6 text-center"
                    style={{ background: "linear-gradient(135deg, #f8f4e8 0%, #fff 100%)" }}
                >
                    <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-yellow-100">
                        <Clock className="w-7 h-7 text-yellow-600" />
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-2">
                        Taking a break, {firstName}?
                    </h2>
                    <p className="text-gray-600">
                        You're <strong>{progressPercent}% done</strong> — just {lessonsRemaining} lessons left!
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Stats reminder */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center text-sm text-blue-800">
                        <p>
                            <strong>89% of people who reach this point finish.</strong>
                            <br />
                            Don't let your progress go to waste!
                        </p>
                    </div>

                    {/* Reminder Options */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Want me to text you a reminder?
                        </p>

                        <button
                            onClick={() => handleRequestReminder("2h")}
                            disabled={isRequesting}
                            className={cn(
                                "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                                selectedOption === "2h"
                                    ? "border-[#722f37] bg-[#722f3710]"
                                    : "border-gray-200 hover:border-[#722f3750] hover:bg-gray-50"
                            )}
                        >
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            <span className="flex-1 text-sm font-medium text-gray-700">
                                Text me in 2 hours
                            </span>
                            {selectedOption === "2h" && (
                                <span className="text-xs text-green-600 font-medium">✓ Scheduled</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleRequestReminder("tomorrow")}
                            disabled={isRequesting}
                            className={cn(
                                "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                                selectedOption === "tomorrow"
                                    ? "border-[#722f37] bg-[#722f3710]"
                                    : "border-gray-200 hover:border-[#722f3750] hover:bg-gray-50"
                            )}
                        >
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            <span className="flex-1 text-sm font-medium text-gray-700">
                                Text me tomorrow morning
                            </span>
                            {selectedOption === "tomorrow" && (
                                <span className="text-xs text-green-600 font-medium">✓ Scheduled</span>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Continue Now CTA */}
                    <Button
                        onClick={onContinueNow}
                        className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg"
                        style={{
                            background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                        }}
                    >
                        I'll Finish Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    {/* Time estimate */}
                    <p className="text-center text-sm text-gray-500">
                        ⏱️ Only <strong>{lessonsRemaining * 7} minutes</strong> left to complete
                    </p>
                </div>
            </div>
        </div>
    );
}
