"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OnboardingWizard } from "@/components/ui/onboarding-wizard";
import {
    Sparkles,
    CheckCircle,
    BookOpen,
    GraduationCap,
    MessageSquare,
    Award,
    Play,
    ArrowRight,
    Rocket,
    Target,
    Heart,
    Map,
} from "lucide-react";

interface StartHereClientProps {
    user: {
        firstName: string | null;
        hasCompletedOnboarding: boolean;
        hasProfilePhoto: boolean;
        learningGoal: string | null;
    } | null;
    userId: string;
    enrollments: number;
    tourComplete: boolean;
}

export function StartHereClient({ user, userId, enrollments, tourComplete: initialTourComplete }: StartHereClientProps) {
    const [showQuestionsWizard, setShowQuestionsWizard] = useState(false);
    const [questionsCompleted, setQuestionsCompleted] = useState(user?.hasCompletedOnboarding || false);
    const [tourCompleted, setTourCompleted] = useState(initialTourComplete);

    // Check localStorage for completion statuses
    useEffect(() => {
        const localQuestionsComplete = localStorage.getItem(`onboarding-complete-${userId}`) === "true";
        const localTourComplete = localStorage.getItem(`tour-complete-${userId}`) === "true";

        if (localQuestionsComplete) {
            setQuestionsCompleted(true);
        }
        if (localTourComplete) {
            setTourCompleted(true);
        }
    }, [userId]);

    const handleQuestionsComplete = (data: any) => {
        setShowQuestionsWizard(false);
        setQuestionsCompleted(true);
    };

    // Calculate checklist progress
    const checklist = [
        {
            id: "tutorial",
            label: "Complete the Platform Tour",
            completed: tourCompleted,
            link: null,
            action: null,
        },
        {
            id: "questions",
            label: "Answer Personalization Questions",
            completed: questionsCompleted,
            link: null,
            action: () => setShowQuestionsWizard(true),
        },
        {
            id: "profile",
            label: "Add Your Profile Photo",
            completed: user?.hasProfilePhoto || false,
            link: "/profile",
            action: null,
        },
        {
            id: "explore",
            label: "Explore the Course Catalogue",
            completed: false,
            link: "/courses",
            action: null,
        },
        {
            id: "community",
            label: "Say Hi to the Community",
            completed: false,
            link: "/community",
            action: null,
        },
        {
            id: "coach",
            label: "Say Hi to Your Coach",
            completed: false,
            link: "/messages",
            action: null,
        },
    ];

    const completedCount = checklist.filter(item => item.completed).length;
    const progress = (completedCount / checklist.length) * 100;

    const quickLinks = [
        { href: "/courses", label: "Browse Courses", icon: BookOpen, color: "burgundy", description: "Explore our certifications" },
        { href: "/roadmap", label: "Your Roadmap", icon: Map, color: "blue", description: "See your learning path" },
        { href: "/messages", label: "Mentor Chat", icon: MessageSquare, color: "green", description: "Connect with your coach" },
        { href: "/community", label: "Community", icon: Heart, color: "pink", description: "Meet fellow students" },
    ];

    return (
        <>
            {/* Questions Wizard Modal */}
            {showQuestionsWizard && (
                <OnboardingWizard
                    onComplete={handleQuestionsComplete}
                    userName={user?.firstName || ""}
                    userId={userId}
                />
            )}

            <div className="space-y-8 animate-fade-in">
                {/* Welcome Hero */}
                <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-purple-700 border-0 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                    </div>
                    <CardContent className="p-8 lg:p-10 relative">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-gold-300 text-sm font-medium mb-4 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                                <Sparkles className="w-4 h-4" />
                                Welcome to AccrediPro Academy
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Let's Get You Started, {user?.firstName || "Future Coach"}! 🎉
                            </h1>
                            <p className="text-burgundy-100 text-lg mb-6">
                                Complete these quick steps to unlock your full learning experience.
                            </p>
                            <div className="flex items-center gap-4">
                                <Badge className="bg-gold-400 text-burgundy-900 text-sm px-3 py-1">
                                    <Rocket className="w-4 h-4 mr-1" />
                                    {completedCount}/{checklist.length} steps completed
                                </Badge>
                                <div className="flex-1 max-w-xs">
                                    <Progress value={progress} className="h-2 bg-white/20" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Getting Started Checklist */}
                    <div className="lg:col-span-2">
                        <Card className="card-premium">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-burgundy-100">
                                        <Target className="w-6 h-6 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Getting Started Checklist</h2>
                                        <p className="text-sm text-gray-500">Complete these steps to unlock your full potential</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {checklist.map((item, index) => {
                                        const stepNumber = index + 1;
                                        const content = (
                                            <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${item.completed
                                                ? "bg-green-50 border-green-200"
                                                : "bg-gray-50 border-gray-200 hover:border-burgundy-200 hover:bg-burgundy-50 cursor-pointer"
                                                }`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${item.completed
                                                    ? "bg-green-500 text-white"
                                                    : "bg-burgundy-600 text-white"
                                                    }`}>
                                                    {item.completed ? (
                                                        <CheckCircle className="w-5 h-5 text-white" />
                                                    ) : (
                                                        stepNumber
                                                    )}
                                                </div>
                                                <span className={`flex-1 font-medium ${item.completed ? "text-green-700 line-through" : "text-gray-900"
                                                    }`}>
                                                    {item.label}
                                                </span>
                                                {!item.completed && (
                                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        );

                                        if (item.action) {
                                            return (
                                                <div key={item.id} onClick={item.action}>
                                                    {content}
                                                </div>
                                            );
                                        } else if (item.link) {
                                            return (
                                                <Link key={item.id} href={item.link}>
                                                    {content}
                                                </Link>
                                            );
                                        } else {
                                            return <div key={item.id}>{content}</div>;
                                        }
                                    })}
                                </div>

                                {completedCount === checklist.length ? (
                                    <div className="mt-6 space-y-6">
                                        {/* Celebration Banner */}
                                        <div className="p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl text-white text-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20">
                                                <div className="absolute top-2 left-10 text-4xl">🎉</div>
                                                <div className="absolute top-8 right-16 text-3xl">⭐</div>
                                                <div className="absolute bottom-4 left-20 text-2xl">🏆</div>
                                                <div className="absolute bottom-2 right-10 text-4xl">🎊</div>
                                            </div>
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Award className="w-10 h-10 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">🎉 You're All Set!</h3>
                                                <p className="text-white/90 max-w-md mx-auto">
                                                    Congratulations! You've completed all getting started steps. You're ready to begin your journey!
                                                </p>
                                            </div>
                                        </div>

                                        {/* What's Next Section */}
                                        <div className="p-6 bg-gradient-to-br from-burgundy-50 to-purple-50 rounded-xl border border-burgundy-100">
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Rocket className="w-5 h-5 text-burgundy-600" />
                                                What's Next?
                                            </h3>
                                            <div className="grid gap-3">
                                                <Link href="/courses">
                                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-burgundy-300 hover:shadow-md transition-all cursor-pointer group">
                                                        <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center group-hover:bg-burgundy-200 transition-colors">
                                                            <GraduationCap className="w-6 h-6 text-burgundy-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">Start Your First Course</p>
                                                            <p className="text-sm text-gray-500">Begin your certification journey</p>
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* Video Introduction */}
                        <Card className="card-premium mt-6">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-burgundy-600" />
                                    Welcome Video
                                </h2>
                                <div className="aspect-video bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-burgundy-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-burgundy-700 transition-colors">
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </div>
                                        <p className="text-burgundy-600 font-medium">Watch our welcome video</p>
                                        <p className="text-sm text-gray-500">Learn what to expect from AccrediPro Academy</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Links */}
                        <Card className="card-premium">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                                <div className="space-y-3">
                                    {quickLinks.map((link) => (
                                        <Link key={link.href} href={link.href}>
                                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className={`p-2 rounded-lg bg-${link.color}-100`}>
                                                    <link.icon className={`w-5 h-5 text-${link.color}-600`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{link.label}</p>
                                                    <p className="text-xs text-gray-500">{link.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Need Help */}
                        <Card className="card-premium bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our team is here to support you every step of the way.
                                </p>
                                <Link href="/help">
                                    <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                        Contact Support
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Your Goal */}
                        {user?.learningGoal && (
                            <Card className="card-premium">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-burgundy-600" />
                                        Your Goal
                                    </h3>
                                    <Badge className="bg-burgundy-100 text-burgundy-700 capitalize">
                                        {user.learningGoal.replace(/_/g, " ")}
                                    </Badge>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
