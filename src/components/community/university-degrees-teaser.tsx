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
    Clock,
    Users,
    Star,
    CheckCircle,
    Crown,
    CalendarCheck,
} from "lucide-react";

// AccrediPro brand colors
const BRAND = {
    gold: "#D4AF37",
    goldLight: "#F5E6B8",
    burgundy: "#722F37",
    burgundyDark: "#5A252C",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
};

// CTA - Redirect to private chat
const APPLY_URL = "/messages";

export function UniversityDegreesTeaser() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Full-Screen Hero with Elegant Background */}
            <div
                className="min-h-screen flex flex-col relative"
                style={{
                    background: `linear-gradient(135deg, ${BRAND.burgundyDark} 0%, #1a0a0c 50%, #0d0305 100%)`,
                }}
            >
                {/* Elegant Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
                            backgroundSize: '64px 64px'
                        }}
                    />
                </div>

                {/* Gold Glow Effects */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] opacity-20"
                    style={{ backgroundColor: BRAND.gold }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
                    style={{ backgroundColor: BRAND.gold }}
                />

                {/* Top Bar - AccrediPro International */}
                <div className="relative z-10 py-4 px-6 border-b" style={{ borderColor: `${BRAND.gold}20` }}>
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ background: BRAND.goldMetallic }}
                            >
                                <Shield className="w-6 h-6" style={{ color: BRAND.burgundyDark }} />
                            </div>
                            <div>
                                <div className="font-bold tracking-tight" style={{ color: BRAND.gold }}>
                                    ACCREDIPRO INTERNATIONAL
                                </div>
                                <div className="text-xs tracking-widest text-gray-400">
                                    UNIVERSITY DEGREE DIVISION
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
                                London • Dubai • New York
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content - Centered */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">

                        {/* Exclusive Badge */}
                        <div className="mb-8">
                            <div
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                                style={{
                                    background: `${BRAND.gold}15`,
                                    border: `1px solid ${BRAND.gold}40`,
                                }}
                            >
                                <Crown className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span className="text-sm font-semibold tracking-wide" style={{ color: BRAND.gold }}>
                                    EXCLUSIVE PARTNERSHIP • APPLICATION ONLY
                                </span>
                                <Lock className="w-4 h-4" style={{ color: BRAND.gold }} />
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="block text-white">Earn a</span>
                            <span
                                className="block bg-clip-text text-transparent"
                                style={{ backgroundImage: BRAND.goldMetallic }}
                            >
                                Real University Degree
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                            Fully accredited. Internationally recognized.
                            <br className="hidden md:block" />
                            Study from home. No relocation required.
                        </p>

                        {/* Limited Spots Alert */}
                        <div
                            className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-12"
                            style={{
                                background: `${BRAND.burgundy}80`,
                                border: `1px solid ${BRAND.burgundy}`,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4 text-red-400" />
                                <span className="text-sm font-semibold text-red-300">
                                    2026 COHORT: ONLY 3 SPOTS REMAINING
                                </span>
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid md:grid-cols-4 gap-6 mb-12">
                            {[
                                { icon: GraduationCap, title: "BSc & MSc", subtitle: "Accredited Degrees" },
                                { icon: Globe, title: "45+ Countries", subtitle: "Global Recognition" },
                                { icon: Building2, title: "UK Universities", subtitle: "Top Institutions" },
                                { icon: Award, title: "Physical Diploma", subtitle: "Mailed Worldwide" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-xl text-center"
                                    style={{
                                        background: `linear-gradient(180deg, ${BRAND.gold}08 0%, transparent 100%)`,
                                        border: `1px solid ${BRAND.gold}20`,
                                    }}
                                >
                                    <item.icon className="w-8 h-8 mx-auto mb-3" style={{ color: BRAND.gold }} />
                                    <div className="font-bold text-white">{item.title}</div>
                                    <div className="text-sm text-gray-400">{item.subtitle}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="mb-12">
                            <Link href={APPLY_URL}>
                                <Button
                                    size="lg"
                                    className="font-bold text-lg px-12 py-8 h-auto transition-all duration-300 hover:scale-105 shadow-2xl"
                                    style={{
                                        background: BRAND.goldMetallic,
                                        color: BRAND.burgundyDark,
                                        boxShadow: `0 8px 40px ${BRAND.gold}40`,
                                    }}
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Apply for 2026 Cohort
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <p className="text-gray-500 text-sm mt-4">
                                By invitation only • Requires portfolio review
                            </p>
                        </div>

                        {/* Process Steps */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
                            {[
                                { step: "1", text: "Submit Application" },
                                { step: "2", text: "Portfolio Review" },
                                { step: "3", text: "Admissions Interview" },
                                { step: "4", text: "Begin Your Degree" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-400">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                                    >
                                        {item.step}
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Bottom Section - Stats & Trust */}
                <div
                    className="relative z-10 py-8 px-6 border-t"
                    style={{
                        borderColor: `${BRAND.gold}20`,
                        background: `linear-gradient(180deg, transparent 0%, ${BRAND.burgundyDark}40 100%)`,
                    }}
                >
                    <div className="max-w-6xl mx-auto">
                        {/* Stats Row */}
                        <div className="grid md:grid-cols-4 gap-8 mb-6 text-center">
                            {[
                                { value: "£8,500", label: "Starting Investment" },
                                { value: "2-3 Years", label: "Flexible Duration" },
                                { value: "100% Online", label: "Study From Home" },
                                { value: "3 Spots", label: "Yearly Cohort" },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-2xl font-bold" style={{ color: BRAND.gold }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Trust Footer */}
                        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500 pt-6 border-t" style={{ borderColor: `${BRAND.gold}10` }}>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span>Exclusive through AccrediPro International</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span>UK Government Recognized</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span>Since 2019</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
