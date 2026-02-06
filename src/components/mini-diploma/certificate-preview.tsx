"use client";

interface CertificatePreviewProps {
    firstName: string;
    lastName?: string;
    nicheLabel: string;
    lessonNumber: number;
    totalLessons: number;
}

export function CertificatePreview({
    firstName,
    nicheLabel,
    lessonNumber,
    totalLessons,
}: CertificatePreviewProps) {
    const remaining = totalLessons - lessonNumber;

    if (remaining <= 0) return null;

    return (
        <div className="relative mb-8">
            {/* Blurred certificate */}
            <div className="border border-gray-200 rounded-xl p-6 text-center blur-[2px] opacity-60 select-none">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">MINI DIPLOMA</p>
                <h3 className="text-lg font-serif text-gray-800 mb-1">Certificate of Completion</h3>
                <p className="text-xl font-bold text-gray-900 mb-1 font-serif">{firstName}</p>
                <p className="text-sm text-gray-600">{nicheLabel} — Foundations</p>
            </div>

            {/* Overlay badge */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                    Complete {remaining} more lesson{remaining > 1 ? 's' : ''} to unlock
                </span>
            </div>
        </div>
    );
}
