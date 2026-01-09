"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Activity,
    Brain,
    Heart,
    Moon,
    Battery,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Save,
    Download,
    Zap,
} from "lucide-react";

interface QuizQuestion {
    id: string;
    text: string;
    category: "physical" | "emotional" | "cognitive" | "behavioral";
    hpaIndicator: boolean;
}

interface StressData {
    answers: Record<string, number>;
    notes: string;
    completedAt: string | null;
}

interface StressAssessmentQuizProps {
    onSave?: (data: StressData) => void;
    initialData?: Partial<StressData>;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    // Physical symptoms (HPA axis indicators)
    { id: "fatigue_morning", text: "I feel tired even after a full night's sleep", category: "physical", hpaIndicator: true },
    { id: "energy_crash", text: "I experience afternoon energy crashes (2-4pm)", category: "physical", hpaIndicator: true },
    { id: "salt_sugar", text: "I crave salt or sugar frequently", category: "physical", hpaIndicator: true },
    { id: "dizzy_standing", text: "I feel lightheaded when standing up quickly", category: "physical", hpaIndicator: true },
    { id: "muscle_tension", text: "I carry tension in my neck, shoulders, or jaw", category: "physical", hpaIndicator: false },

    // Emotional symptoms
    { id: "overwhelm", text: "I feel overwhelmed by everyday tasks", category: "emotional", hpaIndicator: false },
    { id: "irritable", text: "I become irritable or frustrated easily", category: "emotional", hpaIndicator: false },
    { id: "anxiety", text: "I feel anxious or worried most days", category: "emotional", hpaIndicator: false },
    { id: "motivation", text: "I lack motivation to do things I used to enjoy", category: "emotional", hpaIndicator: true },

    // Cognitive symptoms
    { id: "focus", text: "I have difficulty concentrating or focusing", category: "cognitive", hpaIndicator: false },
    { id: "memory", text: "I forget things more often than I used to", category: "cognitive", hpaIndicator: false },
    { id: "decisions", text: "I struggle to make decisions", category: "cognitive", hpaIndicator: false },
    { id: "racing_thoughts", text: "My mind races, especially at night", category: "cognitive", hpaIndicator: false },

    // Behavioral symptoms
    { id: "sleep_trouble", text: "I have trouble falling or staying asleep", category: "behavioral", hpaIndicator: true },
    { id: "caffeine", text: "I rely on caffeine to get through the day", category: "behavioral", hpaIndicator: true },
    { id: "exercise_skip", text: "I skip exercise due to exhaustion", category: "behavioral", hpaIndicator: false },
    { id: "social_withdraw", text: "I withdraw from friends and social activities", category: "behavioral", hpaIndicator: false },
    { id: "comfort_eating", text: "I eat for comfort rather than hunger", category: "behavioral", hpaIndicator: false },
];

const CATEGORY_INFO = {
    physical: { label: "Physical Symptoms", icon: Heart, color: "text-red-600", bgColor: "bg-red-50" },
    emotional: { label: "Emotional Signs", icon: Brain, color: "text-purple-600", bgColor: "bg-purple-50" },
    cognitive: { label: "Cognitive Impact", icon: Zap, color: "text-amber-600", bgColor: "bg-amber-50" },
    behavioral: { label: "Behavioral Patterns", icon: Activity, color: "text-blue-600", bgColor: "bg-blue-50" },
};

const getStressLevel = (score: number): { level: string; color: string; description: string } => {
    if (score <= 30) {
        return {
            level: "Low Stress",
            color: "text-green-600",
            description: "You're managing stress well. Continue healthy habits.",
        };
    } else if (score <= 50) {
        return {
            level: "Moderate Stress",
            color: "text-amber-600",
            description: "Some stress indicators present. Consider stress management techniques.",
        };
    } else if (score <= 70) {
        return {
            level: "High Stress",
            color: "text-orange-600",
            description: "Significant stress indicators. Lifestyle interventions recommended.",
        };
    } else {
        return {
            level: "Burnout Risk",
            color: "text-red-600",
            description: "Multiple burnout indicators. Professional support recommended.",
        };
    }
};

const getRecommendations = (score: number, answers: Record<string, number>, hpaScore: number): string[] => {
    const recommendations: string[] = [];

    // HPA axis specific
    if (hpaScore > 15) {
        recommendations.push("Consider adrenal function testing (cortisol saliva test)");
        recommendations.push("Support adrenal health with adaptogens (ashwagandha, rhodiola)");
    }

    // Sleep issues
    if ((answers["sleep_trouble"] || 0) >= 3 || (answers["racing_thoughts"] || 0) >= 3) {
        recommendations.push("Establish a consistent sleep routine (10pm bedtime)");
        recommendations.push("Try magnesium glycinate before bed for relaxation");
    }

    // Energy issues
    if ((answers["fatigue_morning"] || 0) >= 3 || (answers["energy_crash"] || 0) >= 3) {
        recommendations.push("Balance blood sugar with protein at each meal");
        recommendations.push("Consider B-vitamin complex for energy support");
    }

    // Caffeine dependency
    if ((answers["caffeine"] || 0) >= 3) {
        recommendations.push("Gradually reduce caffeine intake over 2-4 weeks");
        recommendations.push("Replace with herbal alternatives like matcha or adaptogenic coffee");
    }

    // General stress
    if (score > 50) {
        recommendations.push("Practice daily breathwork (box breathing, 4-7-8 technique)");
        recommendations.push("Consider meditation apps like Calm or Headspace");
        recommendations.push("Schedule regular 'white space' in your calendar");
    }

    if (score > 70) {
        recommendations.push("Prioritize restorative activities and say no to non-essential commitments");
        recommendations.push("Consider working with a therapist or counselor");
    }

    return recommendations.slice(0, 6);
};

export function StressAssessmentQuiz({
    onSave,
    initialData = {},
}: StressAssessmentQuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [saved, setSaved] = useState(false);

    const [data, setData] = useState<StressData>({
        answers: {},
        notes: "",
        completedAt: null,
        ...initialData,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("stress-assessment");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(prev => ({ ...prev, ...parsed }));
                if (parsed.completedAt) {
                    setShowResults(true);
                }
            } catch (e) {
                console.error("Error loading saved data:", e);
            }
        }
    }, []);

    // Auto-save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("stress-assessment", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    const updateAnswer = (questionId: string, value: number) => {
        setData(prev => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
        }));
        setSaved(false);
    };

    const calculateScore = (): number => {
        const answeredQuestions = Object.keys(data.answers).length;
        if (answeredQuestions === 0) return 0;

        const totalScore = Object.values(data.answers).reduce((sum, val) => sum + val, 0);
        const maxPossible = QUIZ_QUESTIONS.length * 4;
        return Math.round((totalScore / maxPossible) * 100);
    };

    const calculateHPAScore = (): number => {
        const hpaQuestions = QUIZ_QUESTIONS.filter(q => q.hpaIndicator);
        let score = 0;
        hpaQuestions.forEach(q => {
            score += data.answers[q.id] || 0;
        });
        return score;
    };

    const getCategoryScore = (category: string): number => {
        const categoryQuestions = QUIZ_QUESTIONS.filter(q => q.category === category);
        let score = 0;
        categoryQuestions.forEach(q => {
            score += data.answers[q.id] || 0;
        });
        return Math.round((score / (categoryQuestions.length * 4)) * 100);
    };

    const handleComplete = () => {
        setData(prev => ({ ...prev, completedAt: new Date().toISOString() }));
        setShowResults(true);
        localStorage.setItem("stress-assessment", JSON.stringify({
            ...data,
            completedAt: new Date().toISOString(),
        }));
    };

    const handleReset = () => {
        setData({ answers: {}, notes: "", completedAt: null });
        setCurrentQuestion(0);
        setShowResults(false);
        localStorage.removeItem("stress-assessment");
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(data);
        }
        localStorage.setItem("stress-assessment", JSON.stringify(data));
        setSaved(true);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const score = calculateScore();
        const hpaScore = calculateHPAScore();
        const stressInfo = getStressLevel(score);
        const recommendations = getRecommendations(score, data.answers, hpaScore);

        printWindow.document.write(`
            <html>
                <head>
                    <title>Stress Assessment Results</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
                        h2 { color: #7c2d12; margin-top: 30px; }
                        .score-box { background: #f9fafb; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0; }
                        .score { font-size: 64px; font-weight: bold; }
                        .low { color: #16a34a; }
                        .moderate { color: #d97706; }
                        .high { color: #ea580c; }
                        .burnout { color: #dc2626; }
                        .category-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                        .category-box { background: #f9fafb; padding: 15px; border-radius: 8px; }
                        .hpa-warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
                        .recommendations { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
                        .recommendations li { margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h1>Stress & Burnout Assessment</h1>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

                    <div class="score-box">
                        <div class="score ${score <= 30 ? 'low' : score <= 50 ? 'moderate' : score <= 70 ? 'high' : 'burnout'}">
                            ${score}%
                        </div>
                        <h2 style="margin: 10px 0 5px;">${stressInfo.level}</h2>
                        <p style="color: #6b7280;">${stressInfo.description}</p>
                    </div>

                    ${hpaScore > 15 ? `
                        <div class="hpa-warning">
                            <h3>HPA Axis Dysfunction Indicators</h3>
                            <p>Your responses suggest possible HPA axis dysregulation (adrenal fatigue pattern).
                            Score: ${hpaScore}/24. Consider functional testing and targeted support.</p>
                        </div>
                    ` : ""}

                    <h2>Category Breakdown</h2>
                    <div class="category-grid">
                        <div class="category-box">
                            <strong>Physical Symptoms</strong>
                            <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${getCategoryScore("physical")}%</div>
                        </div>
                        <div class="category-box">
                            <strong>Emotional Signs</strong>
                            <div style="font-size: 24px; font-weight: bold; color: #9333ea;">${getCategoryScore("emotional")}%</div>
                        </div>
                        <div class="category-box">
                            <strong>Cognitive Impact</strong>
                            <div style="font-size: 24px; font-weight: bold; color: #d97706;">${getCategoryScore("cognitive")}%</div>
                        </div>
                        <div class="category-box">
                            <strong>Behavioral Patterns</strong>
                            <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${getCategoryScore("behavioral")}%</div>
                        </div>
                    </div>

                    <div class="recommendations">
                        <h2>Personalized Recommendations</h2>
                        <ul>
                            ${recommendations.map(r => `<li>${r}</li>`).join("")}
                        </ul>
                    </div>

                    ${data.notes ? `
                        <h2>Additional Notes</h2>
                        <p>${data.notes}</p>
                    ` : ""}

                    <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
                        Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const score = calculateScore();
    const hpaScore = calculateHPAScore();
    const stressInfo = getStressLevel(score);
    const progress = Math.round((Object.keys(data.answers).length / QUIZ_QUESTIONS.length) * 100);
    const question = QUIZ_QUESTIONS[currentQuestion];

    if (showResults) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Stress Assessment Results</h1>
                                <p className="text-purple-100">Completed {data.completedAt ? new Date(data.completedAt).toLocaleDateString() : "today"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    {/* Main Score */}
                    <div className={`rounded-xl p-8 text-center ${
                        score <= 30 ? "bg-green-50" :
                        score <= 50 ? "bg-amber-50" :
                        score <= 70 ? "bg-orange-50" :
                        "bg-red-50"
                    }`}>
                        <div className={`text-6xl font-bold mb-2 ${stressInfo.color}`}>
                            {score}%
                        </div>
                        <h2 className={`text-2xl font-semibold ${stressInfo.color}`}>
                            {stressInfo.level}
                        </h2>
                        <p className="text-gray-600 mt-2">{stressInfo.description}</p>
                    </div>

                    {/* HPA Axis Warning */}
                    {hpaScore > 15 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-900">HPA Axis Dysfunction Indicators</h3>
                                <p className="text-amber-800 text-sm mt-1">
                                    Your responses suggest possible HPA axis dysregulation (commonly called &quot;adrenal fatigue&quot;).
                                    Score: {hpaScore}/24. This pattern is associated with chronic stress and may benefit from
                                    functional testing and targeted nutritional support.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Category Breakdown */}
                    <div>
                        <h3 className="font-semibold mb-4">Category Breakdown</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                                const catScore = getCategoryScore(key);
                                return (
                                    <div key={key} className={`${info.bgColor} rounded-xl p-4 text-center`}>
                                        <info.icon className={`w-6 h-6 mx-auto mb-2 ${info.color}`} />
                                        <div className={`text-2xl font-bold ${info.color}`}>{catScore}%</div>
                                        <div className="text-xs text-gray-600 mt-1">{info.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Personalized Recommendations
                        </h3>
                        <ul className="space-y-2">
                            {getRecommendations(score, data.answers, hpaScore).map((rec, i) => (
                                <li key={i} className="flex items-start gap-2 text-blue-800 text-sm">
                                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium">{i + 1}</span>
                                    </div>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Any additional observations or context..."
                            rows={3}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-xl">
                    <Button variant="outline" onClick={handleReset}>
                        Retake Quiz
                    </Button>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleDownloadPDF}>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Results
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Stress & Burnout Assessment</h1>
                            <p className="text-purple-100">Evaluate stress levels and HPA axis function</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{progress}%</div>
                        <div className="text-purple-200 text-sm">Complete</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-purple-800/50 rounded-full h-2">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${CATEGORY_INFO[question.category].bgColor} ${CATEGORY_INFO[question.category].color}`}>
                            {CATEGORY_INFO[question.category].label}
                        </span>
                        <span className="text-sm text-gray-500">
                            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {question.text}
                    </h2>

                    {/* Rating Options */}
                    <div className="grid grid-cols-5 gap-3">
                        {[
                            { value: 0, label: "Never" },
                            { value: 1, label: "Rarely" },
                            { value: 2, label: "Sometimes" },
                            { value: 3, label: "Often" },
                            { value: 4, label: "Always" },
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => updateAnswer(question.id, option.value)}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    data.answers[question.id] === option.value
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className={`text-2xl font-bold mb-1 ${
                                    data.answers[question.id] === option.value
                                        ? "text-purple-600"
                                        : "text-gray-400"
                                }`}>
                                    {option.value}
                                </div>
                                <div className="text-xs text-gray-500">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Dots */}
                <div className="flex gap-1 justify-center mt-6">
                    {QUIZ_QUESTIONS.map((q, i) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(i)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                i === currentQuestion
                                    ? "bg-purple-600 w-6"
                                    : data.answers[q.id] !== undefined
                                    ? "bg-purple-300"
                                    : "bg-gray-200"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-xl">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {saved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Saved</span>
                        </>
                    ) : (
                        <span>Auto-saving...</span>
                    )}
                </div>

                <div className="flex gap-3">
                    {currentQuestion === QUIZ_QUESTIONS.length - 1 ? (
                        <Button
                            onClick={handleComplete}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={Object.keys(data.answers).length < QUIZ_QUESTIONS.length}
                        >
                            View Results
                            <CheckCircle2 className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StressAssessmentQuiz;
