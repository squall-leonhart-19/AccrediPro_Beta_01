"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    Play,
    Clock,
    CheckCircle,
    Lock,
    Sparkles,
    DollarSign,
    Users,
    Award,
    ArrowRight,
    Star,
    TrendingUp,
    Target,
    Briefcase,
} from "lucide-react";

interface TrainingContentProps {
    userName: string;
    hasCompletedMiniDiploma: boolean;
    miniDiplomaCategory?: string | null;
}

export function TrainingContent({ userName, hasCompletedMiniDiploma, miniDiplomaCategory }: TrainingContentProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasWatched, setHasWatched] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(true);
        // In production, this would track video progress
        setTimeout(() => setHasWatched(true), 5000);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            {/* Page Header with Branding */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
                            alt="AccrediPro Academy"
                            width={56}
                            height={56}
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                </div>
                <Badge className="bg-gradient-to-r from-burgundy-100 to-gold-100 text-burgundy-700 mb-4 px-4 py-1">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Graduate Orientation
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Becoming a Certified Functional Medicine Practitioner
                </h1>
                <p className="text-xl text-burgundy-600 font-semibold mb-2">
                    Start Earning $5,000+ Monthly
                </p>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Welcome, {userName}! This exclusive training reveals the path to building a thriving practice as a certified practitioner.
                </p>
            </div>

            {/* Graduate Training Replay - Main Card */}
            <Card className={`overflow-hidden border-2 ${hasCompletedMiniDiploma ? "border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-purple-50" : "border-gray-200 bg-gray-50"}`}>
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-purple-700 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-gold-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Graduate Orientation Training
                            </h2>
                            <p className="text-burgundy-100 text-sm">
                                Your blueprint to a $5K+/month functional medicine practice
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6 space-y-6">
                    {/* Access Status */}
                    {!hasCompletedMiniDiploma ? (
                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <Lock className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="font-semibold text-amber-800">Unlocked after completing the Mini Diploma</p>
                                <p className="text-sm text-amber-700">Complete your free Mini Diploma to access this training.</p>
                            </div>
                            <Link href="/courses/functional-medicine-mini-diploma" className="ml-auto">
                                <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                                    Start Mini Diploma
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800">Unlocked after completing the Mini Diploma</p>
                                <p className="text-sm text-green-700">You have full access to this training. Watch anytime.</p>
                            </div>
                        </div>
                    )}

                    {/* Video Player Area */}
                    <div className={`relative aspect-video rounded-xl overflow-hidden ${!hasCompletedMiniDiploma ? "opacity-50" : ""}`}>
                        {isPlaying ? (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                {/* Placeholder for actual video embed */}
                                <div className="text-center text-white">
                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Video Player</p>
                                    <p className="text-sm text-gray-400">Embed your training video here</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-burgundy-800 to-purple-900 flex items-center justify-center relative">
                                {/* Thumbnail overlay */}
                                <div className="absolute inset-0 bg-black/20" />

                                {/* Play Button */}
                                <button
                                    onClick={handlePlayClick}
                                    disabled={!hasCompletedMiniDiploma}
                                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                                        hasCompletedMiniDiploma
                                            ? "bg-white/90 hover:bg-white hover:scale-105 cursor-pointer shadow-2xl"
                                            : "bg-white/50 cursor-not-allowed"
                                    }`}
                                >
                                    {hasCompletedMiniDiploma ? (
                                        <Play className="w-10 h-10 text-burgundy-700 ml-1" />
                                    ) : (
                                        <Lock className="w-8 h-8 text-gray-500" />
                                    )}
                                </button>

                                {/* Duration Badge */}
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4" />
                                    45 minutes
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-lg font-bold">Graduate Training</p>
                                    <p className="text-sm text-white/80">Your path to certification</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA Button */}
                    {hasCompletedMiniDiploma && !isPlaying && (
                        <div className="text-center">
                            <Button
                                size="lg"
                                onClick={handlePlayClick}
                                className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-8"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Watch Training Replay
                            </Button>
                            <p className="text-sm text-gray-500 mt-2">45-minute comprehensive training</p>
                        </div>
                    )}

                    {/* What You'll Learn */}
                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-burgundy-200 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="w-5 h-5 text-burgundy-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Your Certification Path</p>
                                <p className="text-sm text-gray-600">Step-by-step roadmap to success</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Build Your Practice</p>
                                <p className="text-sm text-gray-600">Get clients from day one</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gold-200 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-gold-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">$5K-$10K Monthly</p>
                                <p className="text-sm text-gray-600">Real income potential revealed</p>
                            </div>
                        </div>
                    </div>

                    {/* Income Stats */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                            <h3 className="font-bold text-emerald-800">What Our Graduates Are Earning</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-emerald-700">$5,000+</p>
                                <p className="text-xs text-emerald-600">First 3 Months</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-700">$8,000+</p>
                                <p className="text-xs text-emerald-600">After 6 Months</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-700">$120K+</p>
                                <p className="text-xs text-emerald-600">First Year Potential</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Progress Indicator (if watched) */}
            {hasWatched && (
                <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-green-800 text-lg">Training Complete!</h3>
                                <p className="text-green-700">You've watched the Graduate Training. Ready for your next step?</p>
                            </div>
                            <Link href="/challenges">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Start 7-Day Challenge <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Next Steps Card */}
            <Card className="border border-gray-200">
                <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-gold-500" />
                        Your Journey After This Training
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/challenges">
                            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:border-orange-300 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">7-Day Activation Challenge</p>
                                        <p className="text-sm text-gray-600">Your graduate gift - free access</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/roadmap">
                            <div className="p-4 bg-gradient-to-r from-burgundy-50 to-purple-50 rounded-xl border border-burgundy-200 hover:border-burgundy-300 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-burgundy-600 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">View Your Full Roadmap</p>
                                        <p className="text-sm text-gray-600">See all steps to certification</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Trust Note */}
            <div className="text-center text-sm text-gray-500">
                <p>Questions about your training? <Link href="/messages" className="text-burgundy-600 font-medium hover:underline">Chat with your mentor</Link></p>
            </div>
        </div>
    );
}
