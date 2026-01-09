"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    Circle,
    MessageSquare,
    Users,
    BookOpen,
    Target,
    ArrowRight,
    Sparkles,
} from "lucide-react";

interface StartHereTabProps {
    user: {
        firstName: string;
        hasCompletedOnboarding: boolean;
        hasProfilePhoto: boolean;
        learningGoal: string | null;
        focusAreas: string[];
    };
    onboardingData: {
        incomeGoal: string | null;
        timeline: string | null;
        situation: string | null;
        obstacles: string[];
        interests: string[];
    };
    enrollmentCount: number;
}

export function StartHereTab({ user, onboardingData, enrollmentCount }: StartHereTabProps) {
    // Define checklist items with completion logic
    const checklistItems = [
        {
            id: "profile",
            title: "Complete Your Profile",
            description: "Add your photo and bio to connect with peers",
            completed: user.hasProfilePhoto,
            link: "/profile",
            icon: Users,
        },
        {
            id: "onboarding",
            title: "Set Your Goals",
            description: "Tell us about your learning journey",
            completed: user.hasCompletedOnboarding,
            link: "/start-here/questions",
            icon: Target,
        },
        {
            id: "course",
            title: "Enroll in Your First Course",
            description: "Start your certification journey",
            completed: enrollmentCount > 0,
            link: "/catalog",
            icon: BookOpen,
        },
        {
            id: "coach",
            title: "Say Hi to Coach Sarah",
            description: "Your AI mentor is ready to help",
            completed: false, // We'd need to check messages
            link: "/messages",
            icon: MessageSquare,
        },
        {
            id: "community",
            title: "Introduce Yourself",
            description: "Join the community and meet fellow learners",
            completed: false, // We'd need to check posts
            link: "/community",
            icon: Users,
        },
    ];

    const completedCount = checklistItems.filter(item => item.completed).length;
    const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-burgundy-600 to-burgundy-700">
                <CardContent className="p-6 text-white">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-400/20 flex items-center justify-center border border-gold-400/30">
                            <Sparkles className="w-6 h-6 text-gold-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-1">
                                Welcome, {user.firstName}! 🎉
                            </h2>
                            <p className="text-burgundy-200 text-sm">
                                Let's get you started on your certification journey. Complete these steps to unlock your full potential.
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-burgundy-200">Getting Started Progress</span>
                            <span className="text-gold-400 font-semibold">{completedCount}/{checklistItems.length} Complete</span>
                        </div>
                        <div className="h-3 bg-burgundy-800/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Checklist */}
            <div className="space-y-3">
                {checklistItems.map((item, index) => (
                    <Card
                        key={item.id}
                        className={`transition-all ${item.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                {/* Completion Status */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.completed
                                        ? 'bg-green-100'
                                        : 'bg-gray-100'
                                    }`}>
                                    {item.completed ? (
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <span className="text-gray-500 font-bold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${item.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>

                                {/* Action */}
                                {!item.completed && (
                                    <Link href={item.link}>
                                        <Button size="sm" variant="outline" className="border-burgundy-200 text-burgundy-600 hover:bg-burgundy-50">
                                            <item.icon className="w-4 h-4 mr-2" />
                                            Start
                                        </Button>
                                    </Link>
                                )}
                                {item.completed && (
                                    <Badge className="bg-green-100 text-green-700 border-0">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Done
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Your Goals (if set) */}
            {onboardingData.incomeGoal && (
                <Card className="border-gold-200 bg-gold-50/50">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-gold-600" />
                            Your Goals
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {onboardingData.incomeGoal && (
                                <div>
                                    <p className="text-gray-500 text-xs">Income Goal</p>
                                    <p className="font-medium text-gray-900">{onboardingData.incomeGoal}</p>
                                </div>
                            )}
                            {onboardingData.timeline && (
                                <div>
                                    <p className="text-gray-500 text-xs">Timeline</p>
                                    <p className="font-medium text-gray-900">{onboardingData.timeline}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
