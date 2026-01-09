"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClientIntakeForm } from "@/components/resources/templates/ClientIntakeForm";
import { ProtocolBuilder } from "@/components/resources/templates/ProtocolBuilder";
import { PricingCalculator } from "@/components/resources/templates/PricingCalculator";
import { GutHealthTracker } from "@/components/resources/templates/GutHealthTracker";
import { NutritionAssessment } from "@/components/resources/templates/NutritionAssessment";
import { StressAssessmentQuiz } from "@/components/resources/templates/StressAssessmentQuiz";
import { HormoneSymptomChecker } from "@/components/resources/templates/HormoneSymptomChecker";
import { BloodSugarTracker } from "@/components/resources/templates/BloodSugarTracker";
import { LabResultsCalculator } from "@/components/resources/templates/LabResultsCalculator";
import {
    ClipboardList,
    FileText,
    Calculator,
    ChevronLeft,
    Sparkles,
    Heart,
    Utensils,
    Activity,
    Target,
    TrendingUp,
    TestTube,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
    {
        id: "intake",
        name: "Client Intake Form",
        icon: ClipboardList,
        description: "Collect comprehensive client health history and goals",
        color: "from-burgundy-500 to-burgundy-600"
    },
    {
        id: "protocol",
        name: "Protocol Builder",
        icon: FileText,
        description: "Create personalized health protocols step-by-step",
        color: "from-emerald-500 to-emerald-600"
    },
    {
        id: "pricing",
        name: "Pricing Calculator",
        icon: Calculator,
        description: "Calculate ideal pricing based on income goals",
        color: "from-blue-500 to-blue-600"
    },
    {
        id: "gut-health",
        name: "Gut Health Tracker",
        icon: Heart,
        description: "Track digestive symptoms and monitor trends",
        color: "from-burgundy-500 to-burgundy-600"
    },
    {
        id: "nutrition",
        name: "Nutrition Assessment",
        icon: Utensils,
        description: "Evaluate dietary habits and patterns",
        color: "from-green-500 to-green-600"
    },
    {
        id: "stress",
        name: "Stress Assessment Quiz",
        icon: Activity,
        description: "Evaluate stress levels and HPA function",
        color: "from-purple-500 to-purple-600"
    },
    {
        id: "hormones",
        name: "Hormone Symptom Checker",
        icon: Target,
        description: "Map symptoms to hormone imbalances",
        color: "from-pink-500 to-pink-600"
    },
    {
        id: "blood-sugar",
        name: "Blood Sugar Tracker",
        icon: TrendingUp,
        description: "Log glucose readings with trends",
        color: "from-blue-500 to-cyan-600"
    },
    {
        id: "lab-results",
        name: "Lab Results Calculator",
        icon: TestTube,
        description: "Compare conventional vs. optimal ranges",
        color: "from-teal-500 to-cyan-600"
    },
];

function ResourcesContent() {
    const searchParams = useSearchParams();
    const toolParam = searchParams.get("tool");
    const [activeTemplate, setActiveTemplate] = useState<string | null>(toolParam);

    // Sync with URL param
    useEffect(() => {
        setActiveTemplate(toolParam);
    }, [toolParam]);

    if (activeTemplate === "intake") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <ClientIntakeForm
                        practitionerName="Your Name"
                        practiceName="Your Practice"
                    />
                </div>
            </div>
        );
    }

    if (activeTemplate === "protocol") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <ProtocolBuilder practitionerName="Your Name" />
                </div>
            </div>
        );
    }

    if (activeTemplate === "pricing") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <PricingCalculator />
                </div>
            </div>
        );
    }

    if (activeTemplate === "gut-health") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <GutHealthTracker />
                </div>
            </div>
        );
    }

    if (activeTemplate === "nutrition") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <NutritionAssessment />
                </div>
            </div>
        );
    }

    if (activeTemplate === "stress") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <StressAssessmentQuiz />
                </div>
            </div>
        );
    }

    if (activeTemplate === "hormones") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <HormoneSymptomChecker />
                </div>
            </div>
        );
    }

    if (activeTemplate === "blood-sugar") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <BloodSugarTracker />
                </div>
            </div>
        );
    }

    if (activeTemplate === "lab-results") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/my-library/course-materials">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Course Materials
                        </Button>
                    </Link>
                    <LabResultsCalculator />
                </div>
            </div>
        );
    }

    // Default: show template selection grid
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <Link href="/my-library/course-materials">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Course Materials
                    </Button>
                </Link>

                <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Practice-Building Tools</h1>
                            <p className="text-burgundy-100 mt-1">Professional resources to grow your practice</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TEMPLATES.map((template) => (
                        <Link key={template.id} href={`/my-library/resources?tool=${template.id}`}>
                            <div className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition-all border border-gray-100 hover:border-burgundy-200 h-full group cursor-pointer">
                                <div className={`w-14 h-14 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <template.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-lg group-hover:text-burgundy-600 transition-colors">{template.name}</h3>
                                <p className="text-gray-500 text-sm mt-2">{template.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                        💡 Pro Tip
                    </h3>
                    <p className="text-amber-800 text-sm mt-1">
                        These tools auto-save your progress and can generate professional PDFs to share with clients!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResourceDemoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 animate-spin rounded-full border-4 border-gray-200 border-t-burgundy-600" />
            </div>
        }>
            <ResourcesContent />
        </Suspense>
    );
}
