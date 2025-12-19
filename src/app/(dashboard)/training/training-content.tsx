"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    Play,
    Clock,
    CheckCircle,
    Lock,
    Award,
    ArrowRight,
    TrendingUp,
    Target,
    DollarSign,
    Zap,
    Shield,
    Gift,
    Briefcase,
    Globe,
    ExternalLink,
} from "lucide-react";
import { LiveQAChat } from "@/components/training/live-qa-chat";
import { trackCustomEvent, trackVideoWatch, trackInitiateCheckout } from "@/components/tracking/meta-pixel";

interface TrainingContentProps {
    userName: string;
    userId: string;
    hasCompletedMiniDiploma: boolean;
    miniDiplomaCategory?: string | null;
    isAdmin?: boolean;
    isEnrolledInMainCert?: boolean;
    hasCompletedVideo?: boolean;
}

export function TrainingContent({
    userName,
    userId,
    hasCompletedMiniDiploma,
    miniDiplomaCategory,
    isAdmin,
    isEnrolledInMainCert,
    hasCompletedVideo: initialHasCompletedVideo,
}: TrainingContentProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasCompletedVideo, setHasCompletedVideo] = useState(initialHasCompletedVideo || false);
    const lastTrackedPercent = useRef(0);

    // Admin bypass - always unlocked for admin
    const isUnlocked = isAdmin || hasCompletedMiniDiploma;

    // Should hide chat: enrolled in main cert OR completed video (70%+)
    const shouldHideChat = isEnrolledInMainCert || hasCompletedVideo;

    // Track CTA click for Meta Ads
    const handleCTAClick = () => {
        trackInitiateCheckout({
            content_name: "Full Certification",
            value: 997,
            currency: "USD",
        });
        trackCustomEvent("CTAClick", {
            button_location: "training_page",
            offer: "full_certification_997",
            video_percent_watched: lastTrackedPercent.current,
        });
        console.log("📊 Meta: CTAClick tracked");
    };

    // Track video progress via Wistia API
    useEffect(() => {
        if (!isPlaying || !userId) return;

        // Wait for Wistia to load
        const checkWistia = setInterval(() => {
            // @ts-ignore - Wistia global
            if (window.Wistia && window.Wistia.api) {
                clearInterval(checkWistia);

                // @ts-ignore
                const video = window.Wistia.api("3go641tx38");
                if (video) {
                    video.bind("percentwatchedchanged", (percent: number) => {
                        const percentInt = Math.floor(percent * 100);

                        // Track at milestones: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
                        const milestones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                        for (const milestone of milestones) {
                            if (percentInt >= milestone && lastTrackedPercent.current < milestone) {
                                lastTrackedPercent.current = milestone;

                                // Send to our API
                                fetch("/api/webhooks/wistia", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        userId,
                                        percentWatched: milestone,
                                        videoId: "3go641tx38",
                                    }),
                                }).then(() => {
                                    console.log(`📹 Tracked video progress: ${milestone}%`);
                                    if (milestone >= 70) {
                                        setHasCompletedVideo(true);
                                    }
                                }).catch(console.error);

                                // Track to Meta Pixel at key milestones
                                if ([25, 50, 70, 100].includes(milestone)) {
                                    trackVideoWatch("masterclass-training", milestone, 36 * 60); // 36 min video
                                    trackCustomEvent("VSLWatchMilestone", {
                                        video_id: "masterclass-training",
                                        percent_watched: milestone,
                                        milestone: `${milestone}%`,
                                    });
                                }
                            }
                        }
                    });
                }
            }
        }, 500);

        return () => clearInterval(checkWistia);
    }, [isPlaying, userId]);

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar - Clean Header */}
            <div className="bg-burgundy-700 border-b border-burgundy-800">
                <div className="max-w-[1800px] mx-auto px-3 sm:px-4 py-2 sm:py-3">
                    <div>
                        <h1 className="text-white font-bold text-sm sm:text-lg">
                            Free Training: How to Become a Certified Practitioner
                        </h1>
                        <p className="text-burgundy-200 text-xs">
                            Learn How to Start Your Career & Earn $5K-$10K/Month
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - Video + Chat */}
            <div className="max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="grid lg:grid-cols-[1fr_420px] gap-4 sm:gap-6">
                    {/* Left Column - Video Player */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Video Container */}
                        <div className="relative bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                            {/* Access Lock Overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                                    <div className="w-20 h-20 bg-burgundy-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                        <Lock className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 text-center">
                                        Complete Your Mini Diploma First
                                    </h3>
                                    <p className="text-gray-400 text-center mb-6 max-w-md">
                                        This exclusive training unlocks after you complete the free Mini Diploma.
                                    </p>
                                    <Link href="/courses/functional-medicine-mini-diploma">
                                        <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-8">
                                            <GraduationCap className="w-5 h-5 mr-2" />
                                            Start Free Mini Diploma
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Video Player */}
                            <div className="aspect-video">
                                {isPlaying && isUnlocked ? (
                                    <>
                                        <Script
                                            src="https://fast.wistia.com/assets/external/E-v1.js"
                                            strategy="afterInteractive"
                                        />
                                        <div
                                            className="wistia_embed wistia_async_3go641tx38 autoPlay=true videoFoam=true"
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-burgundy-900 relative">
                                        {/* Play Button */}
                                        {isUnlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button
                                                    onClick={() => setIsPlaying(true)}
                                                    className="relative z-10 group"
                                                >
                                                    <div className="w-24 h-24 bg-burgundy-600 rounded-full flex items-center justify-center group-hover:bg-burgundy-500 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                                        <Play className="w-10 h-10 text-white ml-1" />
                                                    </div>
                                                    <div className="absolute inset-0 w-24 h-24 bg-burgundy-500/50 rounded-full animate-ping" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Title Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                            <Badge className="bg-green-600 text-white border-0 mb-3">
                                                <Gift className="w-3 h-3 mr-1" />
                                                Free Training
                                            </Badge>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                How to Become a Certified Practitioner
                                            </h2>
                                            <p className="text-gray-300">
                                                Start your career & build a $5K-$10K/month practice
                                            </p>
                                        </div>

                                        {/* Duration */}
                                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4" />
                                            45 min
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile: Live Q&A Chat - Only show when video is playing */}
                        <div className="lg:hidden space-y-4">
                            {!isUnlocked ? (
                                <Card className="relative overflow-hidden border border-gray-200">
                                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
                                        <Lock className="w-8 h-8 text-white mb-3" />
                                        <p className="text-white font-medium text-center text-sm">Complete your Mini Diploma to unlock Live Q&A</p>
                                    </div>
                                    <CardContent className="p-4 opacity-50">
                                        <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                                            <p className="text-gray-400 text-sm">Live Q&A Chat</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : shouldHideChat ? (
                                /* Show only CTA when video completed or enrolled */
                                null
                            ) : isPlaying ? (
                                /* Only show chat when video is playing */
                                <LiveQAChat />
                            ) : null}

                            {/* Mobile CTA - Only show AFTER video watched */}
                            {hasCompletedVideo && (
                                <>
                                    <a
                                        href="https://www.fanbasis.com/agency-checkout/AccrediPro/XDNQW"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                        onClick={handleCTAClick}
                                    >
                                        <Button size="lg" className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold shadow-lg">
                                            <Gift className="w-5 h-5 mr-2" />
                                            Enroll Now - $997
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </a>

                                    {/* Mobile Trust Badges */}
                                    <div className="flex items-center justify-center gap-4 text-gray-500 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            <span>Secure</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            <span>Lifetime Access</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Award className="w-3 h-3" />
                                            <span>Accredited</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Income Stats - Only show after 70% video watched */}
                        {hasCompletedVideo && (
                            <Card className="border border-emerald-200 bg-emerald-50">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <span className="font-bold text-emerald-800">What Our Graduates Are Earning</span>
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
                                </CardContent>
                            </Card>
                        )}

                        {/* CTA - Desktop - Only show AFTER video watched */}
                        {hasCompletedVideo && (
                            <div className="hidden lg:block">
                                <Card className="border-2 border-burgundy-200 bg-burgundy-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-burgundy-100 rounded-2xl flex items-center justify-center">
                                                    <Gift className="w-7 h-7 text-burgundy-600" />
                                                </div>
                                                <div>
                                                    <Badge className="bg-burgundy-600 text-white border-0 mb-2">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        Graduate Special Offer
                                                    </Badge>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        Full Certification - <span className="text-burgundy-600">$997</span>
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Save $1,000 - Limited time for graduates only
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href="https://www.fanbasis.com/agency-checkout/AccrediPro/XDNQW"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={handleCTAClick}
                                            >
                                                <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold px-8 shadow-lg">
                                                    Enroll Now
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Live Q&A Chat (Desktop only) - Only shows when playing */}
                    <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start space-y-4">
                        {!isUnlocked ? (
                            <Card className="relative overflow-hidden border border-gray-200">
                                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8">
                                    <Lock className="w-10 h-10 text-white mb-4" />
                                    <p className="text-white font-semibold text-center mb-2">Live Q&A Locked</p>
                                    <p className="text-gray-300 text-sm text-center">Complete your Mini Diploma to access live chat with Sarah</p>
                                </div>
                                <CardContent className="p-4 opacity-30">
                                    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-400">Live Q&A Chat</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : shouldHideChat ? (
                            /* Show just CTA card when video completed or enrolled */
                            <Card className="border-2 border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-gold-50">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-burgundy-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start Your Journey?</h3>
                                    <p className="text-gray-600 text-sm mb-4">Join thousands of graduates building successful practices.</p>
                                    <a
                                        href="https://www.fanbasis.com/agency-checkout/AccrediPro/XDNQW"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                        onClick={handleCTAClick}
                                    >
                                        <Button size="lg" className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold shadow-lg">
                                            <Gift className="w-5 h-5 mr-2" />
                                            Enroll Now - $997
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        ) : isPlaying ? (
                            /* Only show chat when video is playing */
                            <LiveQAChat />
                        ) : (
                            /* Show placeholder when video not started */
                            <Card className="border border-gray-200 bg-gray-50">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Play className="w-8 h-8 text-burgundy-600 ml-1" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Live Q&A Chat</h3>
                                    <p className="text-gray-500 text-sm">Press play to start the training and unlock the live chat</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Trust Badges */}
                        <Card className="border border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-center gap-6 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-xs">Secure Checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-xs">Lifetime Access</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        <span className="text-xs">Accredited</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
