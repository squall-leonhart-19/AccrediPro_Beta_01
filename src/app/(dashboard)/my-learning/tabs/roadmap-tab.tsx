"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Map,
    Target,
    CheckCircle,
    Circle,
    ArrowRight,
    DollarSign,
    Sparkles,
    TrendingUp,
} from "lucide-react";

// Career Steps - Full inline display
const CAREER_STEPS = [
    {
        step: 1,
        title: "Certified Practitioner",
        subtitle: "Become Legitimate",
        description: "Get certified with clinical knowledge, ethical scope, and practitioner tools.",
        income: "$3K-$5K/mo",
        color: "emerald",
        tasks: ["Complete FM Certification", "Pass Foundation Exam", "Get client-ready materials"]
    },
    {
        step: 2,
        title: "Working Practitioner",
        subtitle: "Work With Real Clients",
        description: "Build your practice with client acquisition, branding, and income systems.",
        income: "$5K-$10K/mo",
        color: "amber",
        tasks: ["Get 3-5 paying clients", "Complete case studies", "Build referral network"]
    },
    {
        step: 3,
        title: "Advanced & Master",
        subtitle: "Gain Authority",
        description: "Handle complex cases, charge premium rates, become an industry expert.",
        income: "$10K-$30K/mo",
        color: "blue",
        tasks: ["Add 2+ specializations", "Raise rates to premium", "Develop signature method"]
    },
    {
        step: 4,
        title: "Business Scaler",
        subtitle: "Build Leverage",
        description: "Scale beyond 1:1 with teams, group programs, and passive income.",
        income: "$30K-$50K+/mo",
        color: "purple",
        tasks: ["Launch group program", "Build team", "Create passive income streams"]
    },
];

// This is the FULL Roadmap content embedded directly - no link-out needed
export function RoadmapTab() {
    // In a real implementation, this would receive data props from the server component
    // For now, showing the full layout with placeholder data
    const currentStep = 1;
    const progress = 35;

    return (
        <div className="space-y-6">
            {/* Header with Current Status */}
            <Card className="bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white border-0 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Left: Current Stage */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-gold-400" />
                                <span className="text-burgundy-200 text-sm">Your Career Roadmap</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">
                                Step {currentStep}: {CAREER_STEPS[currentStep - 1]?.title}
                            </h2>
                            <p className="text-burgundy-100 text-sm mb-4">
                                {CAREER_STEPS[currentStep - 1]?.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-burgundy-200">Step Progress</span>
                                    <span className="text-gold-400 font-bold">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-burgundy-500" />
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex gap-3 lg:flex-col">
                            <div className="bg-white/10 rounded-xl p-4 text-center min-w-[100px]">
                                <p className="text-2xl font-bold text-gold-400">{currentStep}/4</p>
                                <p className="text-xs text-burgundy-200">Current Step</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-center min-w-[100px]">
                                <p className="text-xl font-bold text-green-400">{CAREER_STEPS[currentStep - 1]?.income}</p>
                                <p className="text-xs text-burgundy-200">Income Target</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Career Ladder - Full Display */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-burgundy-600" />
                        Your 4-Step Career Ladder
                    </h3>
                    <Link href="/career-center">
                        <Button variant="outline" size="sm" className="border-burgundy-200 text-burgundy-600">
                            View Career Center
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {CAREER_STEPS.map((step) => {
                        const isCompleted = step.step < currentStep;
                        const isCurrent = step.step === currentStep;
                        const isLocked = step.step > currentStep;

                        return (
                            <Card
                                key={step.step}
                                className={`overflow-hidden transition-all ${isCurrent
                                        ? 'ring-2 ring-gold-400 shadow-lg'
                                        : isCompleted
                                            ? 'border-green-200 bg-green-50/50'
                                            : 'opacity-75'
                                    }`}
                            >
                                <CardContent className="p-4">
                                    {/* Step Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${isCompleted ? 'bg-green-500' :
                                                isCurrent ? 'bg-gold-500' :
                                                    step.color === "emerald" ? 'bg-emerald-400' :
                                                        step.color === "amber" ? 'bg-amber-400' :
                                                            step.color === "blue" ? 'bg-blue-400' : 'bg-purple-400'
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.step}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                                {isCurrent && (
                                                    <Badge className="bg-gold-100 text-gold-700 border-0 text-xs">
                                                        <Sparkles className="w-3 h-3 mr-1" />
                                                        YOU ARE HERE
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{step.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                                    {/* Income */}
                                    <div className="flex items-center gap-2 mb-3 p-2 bg-gold-50 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-gold-600" />
                                        <span className="text-sm font-semibold text-gold-700">{step.income}</span>
                                        <span className="text-xs text-gold-600">income potential</span>
                                    </div>

                                    {/* Tasks Checklist */}
                                    <div className="space-y-1.5">
                                        {step.tasks.map((task, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                {isCompleted ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-gray-300" />
                                                )}
                                                <span className={isCompleted ? 'text-green-700' : 'text-gray-600'}>
                                                    {task}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA for current step */}
                                    {isCurrent && (
                                        <Link href="/my-learning" className="mt-4 block">
                                            <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                                Continue Learning
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Personalized Next Steps */}
            <Card className="border-gold-200 bg-gradient-to-r from-gold-50 to-amber-50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                            <Target className="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Your Next Steps</h3>
                            <p className="text-sm text-gray-500">Personalized recommendations based on your progress</p>
                        </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-3">
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="font-medium text-gray-900 text-sm">📚 Complete Module 5</p>
                            <p className="text-xs text-gray-500">Gut Health Fundamentals</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="font-medium text-gray-900 text-sm">📝 Take Quiz #3</p>
                            <p className="text-xs text-gray-500">Nutritional Assessment</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="font-medium text-gray-900 text-sm">💬 Chat with Coach</p>
                            <p className="text-xs text-gray-500">Ask about next specialization</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
