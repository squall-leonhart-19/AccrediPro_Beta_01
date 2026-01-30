"use client";

import { Star } from "lucide-react";

interface TrustpilotBannerProps {
    /** Compact header bar style */
    variant?: "header" | "section" | "inline";
    /** Number of reviews to display */
    reviewCount?: number;
    /** Rating out of 5 */
    rating?: number;
}

// Featured testimonials from real Trustpilot reviews
const FEATURED_REVIEWS = [
    {
        name: "Jennifer R.",
        title: "RN, BSN",
        text: "Finally, something that actually works. Finished in one sitting and felt confident immediately.",
        verified: true,
    },
    {
        name: "Patricia M.",
        title: "PT",
        text: "I was skeptical but completed it in 67 minutes. Clear, practical, and directly applicable.",
        verified: true,
    },
    {
        name: "Michelle T.",
        title: "MA",
        text: "Wish I found this 5 years ago. Better than most expensive programs I've done.",
        verified: true,
    },
];

export function TrustpilotBanner({
    variant = "header",
    reviewCount = 1347,
    rating = 4.9,
}: TrustpilotBannerProps) {
    const stars = Array(5).fill(0);
    const trustpilotUrl = "https://www.trustpilot.com/review/accredipro.academy";

    if (variant === "header") {
        return (
            <a
                href={trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-4 bg-[#00b67a] hover:bg-[#00a36c] transition-colors"
            >
                <div className="flex items-center gap-1">
                    {stars.map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 fill-white text-white"
                        />
                    ))}
                </div>
                <span className="text-white font-bold text-sm">
                    {rating} from {reviewCount.toLocaleString()}+ Reviews
                </span>
                <span className="text-white/80 text-sm">on Trustpilot</span>
            </a>
        );
    }

    if (variant === "inline") {
        return (
            <a
                href={trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
                <div className="flex items-center gap-0.5">
                    {stars.map((_, i) => (
                        <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-[#00b67a] text-[#00b67a]"
                        />
                    ))}
                </div>
                <span className="font-medium">{rating}/5</span>
                <span className="text-gray-400">•</span>
                <span>{reviewCount.toLocaleString()}+ reviews on Trustpilot</span>
            </a>
        );
    }

    // Full section variant
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        {stars.map((_, i) => (
                            <Star
                                key={i}
                                className="w-6 h-6 fill-[#00b67a] text-[#00b67a]"
                            />
                        ))}
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                        {rating}/5 from {reviewCount.toLocaleString()}+ Reviews on{" "}
                        <a
                            href={trustpilotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00b67a] hover:underline"
                        >
                            Trustpilot
                        </a>
                    </p>
                </div>

                {/* Review Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURED_REVIEWS.map((review, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mb-3">
                                {stars.map((_, j) => (
                                    <Star
                                        key={j}
                                        className="w-4 h-4 fill-[#00b67a] text-[#00b67a]"
                                    />
                                ))}
                            </div>
                            {/* Quote */}
                            <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                            {/* Author */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {review.name}
                                    </p>
                                    <p className="text-gray-500 text-xs">{review.title}</p>
                                </div>
                                {review.verified && (
                                    <span className="text-xs text-[#00b67a] font-medium">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-8">
                    <a
                        href={trustpilotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00b67a] hover:underline font-medium"
                    >
                        Read all {reviewCount.toLocaleString()}+ reviews on Trustpilot →
                    </a>
                </div>
            </div>
        </section>
    );
}
