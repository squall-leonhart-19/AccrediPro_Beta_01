"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DynamicExamComponent, ExamConfig } from "@/components/mini-diploma/dynamic-exam-component";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { Loader2, Award, ArrowRight, CheckCircle, Trophy } from "lucide-react";

// Import exam content files for all niches
import spiritualHealingExam from "@/components/mini-diploma/exams/content/spiritual-healing.json";
import functionalMedicineExam from "@/components/mini-diploma/exams/content/functional-medicine.json";
import adhdCoachingExam from "@/components/mini-diploma/exams/content/adhd-coaching.json";
import gutHealthExam from "@/components/mini-diploma/exams/content/gut-health.json";
import hormoneHealthExam from "@/components/mini-diploma/exams/content/hormone-health.json";
import energyHealingExam from "@/components/mini-diploma/exams/content/energy-healing.json";
import christianCoachingExam from "@/components/mini-diploma/exams/content/christian-coaching.json";
import reikiHealingExam from "@/components/mini-diploma/exams/content/reiki-healing.json";
import petNutritionExam from "@/components/mini-diploma/exams/content/pet-nutrition.json";
import holisticNutritionExam from "@/components/mini-diploma/exams/content/holistic-nutrition.json";
import nurseCoachExam from "@/components/mini-diploma/exams/content/nurse-coach.json";
import healthCoachExam from "@/components/mini-diploma/exams/content/health-coach.json";
import womensHormoneHealthExam from "@/components/mini-diploma/exams/content/womens-hormone-health.json";

// Map portal slugs to exam configs - all niches have custom exams
const EXAM_CONFIGS: Record<string, ExamConfig> = {
    "spiritual-healing": spiritualHealingExam as ExamConfig,
    "functional-medicine": functionalMedicineExam as ExamConfig,
    "adhd-coaching": adhdCoachingExam as ExamConfig,
    "gut-health": gutHealthExam as ExamConfig,
    "hormone-health": hormoneHealthExam as ExamConfig,
    "energy-healing": energyHealingExam as ExamConfig,
    "christian-coaching": christianCoachingExam as ExamConfig,
    "reiki-healing": reikiHealingExam as ExamConfig,
    "pet-nutrition": petNutritionExam as ExamConfig,
    "holistic-nutrition": holisticNutritionExam as ExamConfig,
    "nurse-coach": nurseCoachExam as ExamConfig,
    "health-coach": healthCoachExam as ExamConfig,
    "womens-hormone-health": womensHormoneHealthExam as ExamConfig,
};

// Premium gold gradient
const goldGradient = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

interface ExistingExamResult {
    hasPassed: boolean;
    bestScore: number;
    hasScholarship: boolean;
    activeCoupon: {
        code: string;
        expiresAt: string;
    } | null;
}

export default function ExamPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [firstName, setFirstName] = useState("there");
    const [userId, setUserId] = useState<string | undefined>();
    const [loading, setLoading] = useState(true);
    const [existingResult, setExistingResult] = useState<ExistingExamResult | null>(null);
    const [showExam, setShowExam] = useState(false);

    const portalConfig = getConfigByPortalSlug(slug);
    const examConfig = EXAM_CONFIGS[slug];

    // Check for existing exam results on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const userRes = await fetch(`/api/lead-onboarding/lesson-status?lesson=9&niche=${slug}`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setFirstName(userData.firstName || "there");
                    setUserId(userData.userId);
                }

                // Check for existing exam results
                const examCategory = slug === "functional-medicine" ? "fm-healthcare" : slug;
                const examRes = await fetch(`/api/mini-diploma/exam/submit?category=${examCategory}`);
                if (examRes.ok) {
                    const examData = await examRes.json();
                    if (examData.hasPassed) {
                        setExistingResult({
                            hasPassed: examData.hasPassed,
                            bestScore: examData.bestScore,
                            hasScholarship: examData.hasScholarship,
                            activeCoupon: examData.activeCoupon,
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to fetch data:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (!portalConfig) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Portal not found</h1>
                </div>
            </div>
        );
    }

    if (!examConfig) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Exam not available for this course yet</h1>
                    <p className="text-gray-600 mt-2">Please check back soon.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-burgundy-600" />
            </div>
        );
    }

    // Show existing result if exam already passed - redirect to certificate
    if (existingResult?.hasPassed && !showExam) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Success Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Gold Header */}
                        <div
                            className="p-6 text-center"
                            style={{ background: goldGradient }}
                        >
                            <Trophy className="w-16 h-16 mx-auto text-burgundy-900 mb-3" />
                            <h1 className="text-2xl font-bold text-burgundy-900">
                                You've Already Passed! 🎉
                            </h1>
                        </div>

                        <div className="p-8 text-center">
                            <div className="mb-8">
                                <p className="text-4xl font-black text-burgundy-700">{existingResult.bestScore}%</p>
                                <p className="text-gray-600 mt-2">Your score</p>
                            </div>

                            {/* Status badge */}
                            <div className="flex justify-center gap-3 mb-8">
                                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    Exam Passed
                                </span>
                            </div>

                            {/* Single action button */}
                            <button
                                onClick={() => router.push(`/portal/${slug}/certificate`)}
                                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                style={{ background: goldGradient, color: '#4E1F24' }}
                            >
                                View Your Certificate
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleExamComplete = async (score: number, scholarshipQualified: boolean) => {
        // Mark exam as passed
        try {
            await fetch("/api/lead-onboarding/exam-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    niche: slug,
                    score,
                    scholarshipQualified,
                }),
            });
        } catch (e) {
            console.error("Failed to record exam completion");
        }

        // Navigate to certificate page
        router.push(`/portal/${slug}/certificate`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Pre-exam badge */}
                <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium">
                        📚 {portalConfig.displayName}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Final Assessment</h1>
                    <p className="text-gray-600 mt-2">All lessons complete — now prove your knowledge!</p>
                </div>

                <DynamicExamComponent
                    firstName={firstName}
                    userId={userId}
                    config={examConfig}
                    onExamComplete={handleExamComplete}
                />
            </div>
        </div>
    );
}
