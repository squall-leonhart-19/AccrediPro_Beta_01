"use client";

import { Award, Lock, GraduationCap } from "lucide-react";

interface CertificatePreviewProps {
    firstName: string;
    lastName?: string;
    nicheLabel: string;
    lessonNumber: number;
    totalLessons: number;
}

/**
 * Grayed out certificate preview showing what they'll earn
 * Creates anticipation and goal visualization
 */
export function CertificatePreview({
    firstName,
    lastName = "",
    nicheLabel,
    lessonNumber,
    totalLessons,
}: CertificatePreviewProps) {
    const progress = Math.round((lessonNumber / totalLessons) * 100);
    const isComplete = lessonNumber >= totalLessons;

    return (
        <div className="relative">
            {/* Certificate mockup */}
            <div
                className={`relative border-2 rounded-xl p-8 text-center transition-all duration-500 ${isComplete
                        ? "border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50"
                        : "border-gray-200 bg-gray-50 grayscale opacity-70"
                    }`}
            >
                {/* Lock overlay */}
                {!isComplete && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl z-10">
                        <div className="text-center">
                            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                                Complete {totalLessons - lessonNumber} more lesson{totalLessons - lessonNumber > 1 ? 's' : ''} to unlock
                            </p>
                            <div className="mt-3 w-40 mx-auto">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Certificate content */}
                <div className={!isComplete ? "opacity-50" : ""}>
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Certificate text */}
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                        AccrediPro International Standards Institute
                    </p>
                    <h3 className="text-xl font-serif text-gray-800 mb-1">
                        Certificate of Completion
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        This is to certify that
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-2 font-serif">
                        {firstName} {lastName}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                        has successfully completed the
                    </p>
                    <p className="text-lg font-semibold" style={{ color: '#722F37' }}>
                        {nicheLabel} Mini Diploma
                    </p>

                    {/* Decorative elements */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <GraduationCap className="w-4 h-4" />
                            <span>Verified Credential</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Motivational text below */}
            {!isComplete && (
                <p className="text-center text-sm text-gray-600 mt-4 italic">
                    "This will be yours in just {totalLessons - lessonNumber} more lessons..."
                </p>
            )}
        </div>
    );
}
