"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Lock,
    GraduationCap,
    Shield,
    Award,
    Globe,
    Building2,
    MapPin,
    ArrowRight,
    BadgeCheck,
    Sparkles,
} from "lucide-react";

// AccrediPro brand colors
const BRAND = {
    gold: "#D4AF37",
    goldLight: "#F5E6B8",
    burgundy: "#722F37",
    burgundyDark: "#5A252C",
};

// CTA - Redirect to private chat
const APPLY_URL = "/messages";

export function UniversityDegreesTeaser() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <div className="max-w-xl mx-auto text-center">

                {/* Lock Icon - Premium Gold */}
                <div className="mb-10">
                    <div
                        className="inline-flex items-center justify-center w-28 h-28 rounded-full"
                        style={{
                            background: `linear-gradient(145deg, ${BRAND.gold} 0%, #B8960C 100%)`,
                            boxShadow: `0 8px 32px ${BRAND.gold}40`,
                        }}
                    >
                        <Lock className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span
                            className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{
                                background: BRAND.goldLight,
                                color: BRAND.burgundy,
                            }}
                        >
                            Coming Soon
                        </span>
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{ color: BRAND.burgundy }}
                    >
                        University Degree Program
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                        Earn a <span style={{ color: BRAND.burgundy }} className="font-semibold">real accredited university degree</span> from the comfort of your home.
                        No relocation required.
                    </p>
                </div>

                {/* Trust Badges - Clean, minimal */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span>Internationally Recognized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span>Study From Anywhere</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span>Physical Diploma</span>
                    </div>
                </div>

                {/* CTA Button - Premium Gold */}
                <div className="mb-8">
                    <Link href={APPLY_URL}>
                        <Button
                            size="lg"
                            className="font-semibold text-base px-8 py-6 h-auto transition-all duration-300 hover:scale-105"
                            style={{
                                background: `linear-gradient(145deg, ${BRAND.gold} 0%, #C9A227 100%)`,
                                color: 'white',
                                boxShadow: `0 4px 20px ${BRAND.gold}50`,
                            }}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Request More Information
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <p className="text-gray-400 text-sm mt-4">
                        Limited spots available • By invitation only
                    </p>
                </div>

                {/* Exclusive Footer */}
                <div
                    className="inline-flex items-center gap-2 text-sm"
                    style={{ color: BRAND.burgundy }}
                >
                    <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
                    <span className="font-medium">Exclusive through AccrediPro</span>
                    <BadgeCheck className="w-4 h-4" style={{ color: BRAND.gold }} />
                </div>

            </div>
        </div>
    );
}
