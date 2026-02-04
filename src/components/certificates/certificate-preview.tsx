"use client";

import { Award } from "lucide-react";

interface CertificatePreviewProps {
    diplomaTitle: string;
    primaryColor?: string;
}

/**
 * Certificate Preview Component for Landing Pages
 * Matches the actual MiniDiplomaCertificate design
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
            <div className="absolute inset-3 border-2 border-[#D4AF37]/50 rounded-lg pointer-events-none" />

            <div className="relative text-center">
                {/* Header */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#722F37] to-[#8B3A42] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-[#D4AF37] font-bold text-sm">AP</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-[#722F37] tracking-wider">
                        ACCREDIPRO ACADEMY
                    </h2>
                </div>

                {/* Mini Diploma Badge */}
                <div className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#4a2c2c] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-1 shadow-md">
                    MINI DIPLOMA
                </div>
                <p className="text-[10px] text-gray-500 mb-4 italic">Level 0 – Foundations</p>

                {/* Title */}
                <h1 className="text-xl md:text-2xl font-serif font-bold text-[#722F37] mb-1">
                    Certificate of Completion
                </h1>
                <p className="text-gray-500 text-sm mb-3">This certifies that</p>

                {/* Placeholder Name */}
                <p className="text-xl md:text-2xl font-serif text-gray-800 border-b-2 inline-block px-6 pb-1 mb-3" style={{ borderColor: "#D4AF37" }}>
                    [Your Name Here]
                </p>

                {/* Description */}
                <p className="text-gray-600 text-xs max-w-xs mx-auto mb-1">
                    has successfully completed the
                </p>
                <p className="text-gray-700 text-xs max-w-xs mx-auto mb-2 font-medium">
                    Mini Diploma – Level 0 Foundations in
                </p>

                {/* Diploma Name */}
                <h3 className="text-lg md:text-xl font-bold text-[#722F37] mb-4">
                    {diplomaTitle}
                </h3>

                {/* Authority Line */}
                <p className="text-[10px] text-gray-500 mb-4 max-w-xs mx-auto leading-relaxed">
                    Aligned with the competency framework of<br />
                    <span className="font-semibold text-gray-700">AccrediPro International Standards Institute</span>
                </p>

                {/* Footer Info */}
                <div className="flex items-end justify-between max-w-xs mx-auto">
                    <div className="text-center">
                        <p className="text-[8px] text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                        <p className="text-[10px] text-gray-700">Upon Completion</p>
                    </div>

                    {/* Seal */}
                    <div className="w-12 h-12 border-2 border-[#D4AF37] rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-[#fffbf0]">
                        <Award className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[6px] text-[#D4AF37] uppercase tracking-wider mt-0.5 font-bold">Verified</span>
                    </div>

                    <div className="text-center">
                        <p className="text-[8px] text-gray-400 uppercase tracking-wider mb-0.5">Verified</p>
                        <p className="text-[10px] text-gray-700">ASI Accredited</p>
                    </div>
                </div>

                {/* Legal Disclaimer */}
                <p className="text-[8px] text-gray-400 mt-4 max-w-xs mx-auto leading-relaxed">
                    This certificate confirms completion of foundational training.
                    It does not confer professional certification or licensure.
                </p>
            </div>
        </div>
    );
}
