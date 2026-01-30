"use client";

import { Award } from "lucide-react";

interface CertificatePreviewProps {
    diplomaTitle: string;
    primaryColor?: string;
}

/**
 * Certificate Preview Component for Landing Pages
 * Shows a non-personalized certificate mock with the diploma title
 */
export function CertificatePreview({
    diplomaTitle,
    primaryColor = "#722f37" // Default burgundy
}: CertificatePreviewProps) {
    return (
        <div
            className="bg-gradient-to-br from-[#fdfbf7] to-[#fff9f0] p-6 md:p-8 relative rounded-xl shadow-lg"
            style={{
                backgroundImage: `linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%)`
            }}
        >
            {/* Decorative Border */}
            <div
                className="absolute inset-3 border rounded-lg pointer-events-none"
                style={{ borderColor: `${primaryColor}30` }}
            />

            <div className="relative text-center">
                {/* Header */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
                    >
                        <span className="text-gold-400 font-bold text-sm" style={{ color: "#d4af37" }}>AP</span>
                    </div>
                    <h2
                        className="text-lg md:text-xl font-bold tracking-wider"
                        style={{ color: primaryColor }}
                    >
                        ACCREDIPRO ACADEMY
                    </h2>
                </div>

                {/* Mini Diploma Badge */}
                <div className="inline-block bg-gradient-to-r from-[#d4af37] to-[#e5c158] text-gray-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Mini Diploma
                </div>

                {/* Title */}
                <h1
                    className="text-xl md:text-2xl font-serif font-bold mb-1"
                    style={{ color: primaryColor }}
                >
                    Certificate of Completion
                </h1>
                <p className="text-gray-500 text-sm mb-4">This is to certify that</p>

                {/* Placeholder Name */}
                <p
                    className="text-xl md:text-2xl font-serif text-gray-800 border-b-2 inline-block px-6 pb-1 mb-4"
                    style={{ borderColor: "#d4af37" }}
                >
                    [Your Name Here]
                </p>

                {/* Description */}
                <p className="text-gray-600 text-xs max-w-xs mx-auto mb-3">
                    has successfully completed the foundational training in
                </p>

                {/* Diploma Name */}
                <h3
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: primaryColor }}
                >
                    {diplomaTitle}
                </h3>

                {/* Footer Info */}
                <div className="flex items-end justify-between max-w-xs mx-auto">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                        <p className="text-xs text-gray-700">Upon Completion</p>
                    </div>

                    {/* Seal */}
                    <div
                        className="w-12 h-12 border-2 rounded-full flex flex-col items-center justify-center"
                        style={{ borderColor: "#d4af37" }}
                    >
                        <Award className="w-5 h-5" style={{ color: "#d4af37" }} />
                        <span className="text-[6px] uppercase tracking-wider mt-0.5" style={{ color: "#b8860b" }}>Certified</span>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Verified</p>
                        <p className="text-xs text-gray-700">ASI Accredited</p>
                    </div>
                </div>

                {/* Motto */}
                <p className="text-[10px] text-gray-400 italic mt-4">
                    Veritas Et Excellentia — Truth and Excellence
                </p>
            </div>
        </div>
    );
}
