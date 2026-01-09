"use client";

import { CheckCircle, Lock, Play, Loader2 } from "lucide-react";
import Link from "next/link";

interface Step {
    id: number;
    title: string;
    completed: boolean;
}

interface LeadStepChecklistProps {
    steps: Step[];
    currentStep: number;
    progress: number;
    lessonBaseUrl: string; // e.g., "/womens-health-diploma/lesson"
}

export function LeadStepChecklist({
    steps,
    currentStep,
    progress,
    lessonBaseUrl
}: LeadStepChecklistProps) {
    const getLessonNumber = (stepId: number): number | null => {
        // Steps 3-11 are lessons 1-9
        if (stepId >= 3 && stepId <= 11) {
            return stepId - 2;
        }
        return null;
    };

    const getStepUrl = (step: Step): string | null => {
        const lessonNumber = getLessonNumber(step.id);
        if (lessonNumber) {
            return `${lessonBaseUrl}/${lessonNumber}`;
        }
        return null;
    };

    const getStepStatus = (step: Step): "completed" | "current" | "locked" => {
        if (step.completed) return "completed";
        if (step.id === currentStep) return "current";
        return "locked";
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold">Your Mini Diploma Journey</h2>
                    <span className="text-2xl font-bold">{progress}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-burgundy-200 text-sm mt-2">
                    {steps.filter(s => s.completed).length} of {steps.length} steps completed
                </p>
            </div>

            {/* Steps List */}
            <div className="divide-y divide-gray-100">
                {steps.map((step) => {
                    const status = getStepStatus(step);
                    const stepUrl = getStepUrl(step);
                    const isSpecialStep = step.id <= 2 || step.id === 12;

                    const stepContent = (
                        <div
                            className={`flex items-center gap-4 p-4 transition-colors ${status === "completed"
                                    ? "bg-emerald-50/50"
                                    : status === "current"
                                        ? "bg-burgundy-50"
                                        : "bg-gray-50/50"
                                }`}
                        >
                            {/* Step Number/Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${status === "completed"
                                    ? "bg-emerald-500 text-white"
                                    : status === "current"
                                        ? "bg-burgundy-600 text-white"
                                        : "bg-gray-200 text-gray-400"
                                }`}>
                                {status === "completed" ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : status === "locked" ? (
                                    <Lock className="w-4 h-4" />
                                ) : (
                                    step.id
                                )}
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium ${status === "completed"
                                        ? "text-emerald-700"
                                        : status === "current"
                                            ? "text-burgundy-700"
                                            : "text-gray-400"
                                    }`}>
                                    {step.title}
                                </h3>
                                {status === "current" && !isSpecialStep && (
                                    <p className="text-xs text-burgundy-500 mt-0.5">
                                        Ready to start →
                                    </p>
                                )}
                            </div>

                            {/* Action */}
                            <div className="flex-shrink-0">
                                {status === "completed" && !isSpecialStep && stepUrl && (
                                    <span className="text-xs text-emerald-600 font-medium">
                                        Review
                                    </span>
                                )}
                                {status === "current" && !isSpecialStep && (
                                    <div className="w-8 h-8 rounded-full bg-burgundy-600 flex items-center justify-center">
                                        <Play className="w-4 h-4 text-white ml-0.5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );

                    // Wrap in link if it's a lesson step
                    if (stepUrl && (status === "completed" || status === "current")) {
                        return (
                            <Link
                                key={step.id}
                                href={stepUrl}
                                className="block hover:bg-gray-50 transition-colors"
                            >
                                {stepContent}
                            </Link>
                        );
                    }

                    return <div key={step.id}>{stepContent}</div>;
                })}
            </div>
        </div>
    );
}
