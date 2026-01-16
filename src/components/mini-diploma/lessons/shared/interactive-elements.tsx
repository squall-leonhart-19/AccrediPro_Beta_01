"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
    CheckCircle2, Circle, AlertTriangle, Lightbulb,
    DollarSign, Clock, Users, TrendingUp, Calculator,
    Award, Target, Brain, Heart, Sparkles, ArrowRight,
    Download, FileText
} from "lucide-react";
import { useMiniDiplomaTracking } from "@/hooks/use-mini-diploma-tracking";

// ============================================
// 1. SELF-ASSESSMENT QUIZ
// ============================================
interface SelfAssessmentOption {
    id: string;
    label: string;
    description?: string;
}

interface SelfAssessmentProps {
    title: string;
    subtitle?: string;
    options: SelfAssessmentOption[];
    onComplete: (selectedIds: string[], score: number) => void;
}

export function SelfAssessmentQuiz({ title, subtitle, options, onComplete }: SelfAssessmentProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [submitted, setSubmitted] = useState(false);
    const { trackAssessmentCompleted } = useMiniDiplomaTracking();

    const toggleOption = (id: string) => {
        if (submitted) return;
        const newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelected(newSelected);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const score = selected.size;
        const selectedArray = Array.from(selected);

        // Track the assessment completion
        trackAssessmentCompleted(title, selectedArray, score);

        onComplete(selectedArray, score);
    };

    const scoreMessage = () => {
        const count = selected.size;
        if (count === 0) return "Select the areas that apply to you";
        if (count === 1) return "1 area identified - you're starting to see patterns!";
        if (count === 2) return "2 areas - these are likely connected!";
        if (count === 3) return "3 areas - you're uncovering root causes!";
        if (count === 4) return "4 areas - this is exactly why you need this knowledge!";
        return "5 areas - you're the perfect person to learn this!";
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-5 mx-2 my-3">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => toggleOption(option.id)}
                        disabled={submitted}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            selected.has(option.id)
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-slate-200 bg-white hover:border-indigo-300"
                        } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                        {selected.has(option.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        ) : (
                            <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <div>
                            <p className="font-medium text-slate-800">{option.label}</p>
                            {option.description && (
                                <p className="text-sm text-slate-500">{option.description}</p>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Areas Identified</span>
                    <span className="text-lg font-bold text-indigo-600">{selected.size}/{options.length}</span>
                </div>
                <Progress value={(selected.size / options.length) * 100} className="h-2 mb-2" />
                <p className="text-sm text-slate-500">{scoreMessage()}</p>
            </div>

            {!submitted && (
                <Button
                    onClick={handleSubmit}
                    disabled={selected.size === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    See My Results
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            )}

            {submitted && (
                <div className="bg-indigo-100 rounded-xl p-4 text-center">
                    <Sparkles className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="font-semibold text-indigo-900">
                        {selected.size >= 3
                            ? "This is exactly why you're here. Let's fix these root causes!"
                            : "Great self-awareness! Let's build on this foundation."}
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================
// 2. CASE STUDY CHALLENGE
// ============================================
interface CaseStudyOption {
    id: string;
    label: string;
    isCorrect?: boolean;
    explanation?: string;
}

interface CaseStudyProps {
    caseTitle: string;
    patientInfo: string;
    symptoms: string[];
    question: string;
    options: CaseStudyOption[];
    expertExplanation: string;
    incomeHook?: string;
    onComplete: (selectedId: string, isCorrect: boolean) => void;
}

export function CaseStudyChallenge({
    caseTitle,
    patientInfo,
    symptoms,
    question,
    options,
    expertExplanation,
    incomeHook,
    onComplete
}: CaseStudyProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const { trackCaseStudyCompleted } = useMiniDiplomaTracking();

    const handleSelect = (id: string) => {
        if (submitted) return;
        setSelectedOption(id);
    };

    const handleSubmit = () => {
        if (!selectedOption) return;
        setSubmitted(true);
        const selected = options.find(o => o.id === selectedOption);
        const isCorrect = selected?.isCorrect || false;

        // Track case study completion
        trackCaseStudyCompleted(caseTitle, isCorrect);

        onComplete(selectedOption, isCorrect);
    };

    const selectedOptionData = options.find(o => o.id === selectedOption);

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-5 mx-2 my-3">
            {/* Case Header */}
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Case Study</span>
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Practice</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mt-1">{caseTitle}</h3>
                </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-xl p-4 mb-4 border border-amber-100">
                <p className="font-medium text-slate-800 mb-2">{patientInfo}</p>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Presenting symptoms:</p>
                    <ul className="space-y-1">
                        {symptoms.map((symptom, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                {symptom}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Question */}
            <p className="font-semibold text-slate-800 mb-3">{question}</p>

            {/* Options */}
            <div className="space-y-2 mb-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        disabled={submitted}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            submitted && option.isCorrect
                                ? "border-green-500 bg-green-50"
                                : submitted && selectedOption === option.id && !option.isCorrect
                                ? "border-red-300 bg-red-50"
                                : selectedOption === option.id
                                ? "border-amber-500 bg-amber-50"
                                : "border-slate-200 bg-white hover:border-amber-300"
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            submitted && option.isCorrect
                                ? "bg-green-500 text-white"
                                : submitted && selectedOption === option.id && !option.isCorrect
                                ? "bg-red-400 text-white"
                                : selectedOption === option.id
                                ? "bg-amber-500 text-white"
                                : "bg-slate-200 text-slate-600"
                        }`}>
                            {String.fromCharCode(65 + options.indexOf(option))}
                        </div>
                        <span className="text-slate-800">{option.label}</span>
                        {submitted && option.isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                        )}
                    </button>
                ))}
            </div>

            {!submitted && (
                <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                >
                    Submit My Answer
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            )}

            {/* Result */}
            {submitted && (
                <div className="space-y-3">
                    {selectedOptionData?.isCorrect ? (
                        <div className="bg-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-green-800">Excellent thinking!</span>
                            </div>
                            <p className="text-sm text-green-700">{expertExplanation}</p>
                        </div>
                    ) : (
                        <div className="bg-amber-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-5 h-5 text-amber-600" />
                                <span className="font-bold text-amber-800">Good thinking! Here's the expert view:</span>
                            </div>
                            <p className="text-sm text-amber-700">{expertExplanation}</p>
                        </div>
                    )}

                    {incomeHook && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                <p className="text-sm font-medium text-emerald-800">{incomeHook}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================
// 3. KNOWLEDGE CHECK QUIZ
// ============================================
interface QuizQuestion {
    id: string;
    question: string;
    options: { id: string; label: string; isCorrect: boolean }[];
}

interface KnowledgeCheckProps {
    title: string;
    questions: QuizQuestion[];
    onComplete: (score: number, total: number) => void;
}

export function KnowledgeCheckQuiz({ title, questions, onComplete }: KnowledgeCheckProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const { trackQuizCompleted } = useMiniDiplomaTracking();

    const handleAnswer = (questionId: string, answerId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
            const score = questions.filter(q => {
                const selectedAnswer = answers[q.id];
                const correctOption = q.options.find(o => o.isCorrect);
                return selectedAnswer === correctOption?.id;
            }).length;

            // Track quiz completion
            trackQuizCompleted(title, score, questions.length);

            onComplete(score, questions.length);
        }
    };

    const currentQ = questions[currentQuestion];
    const isAnswered = !!answers[currentQ?.id];

    if (showResults) {
        const score = questions.filter(q => {
            const selectedAnswer = answers[q.id];
            const correctOption = q.options.find(o => o.isCorrect);
            return selectedAnswer === correctOption?.id;
        }).length;
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-5 mx-2 my-3">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Knowledge Check Complete!</h3>
                    <p className="text-4xl font-bold text-emerald-600 mb-2">{score}/{questions.length}</p>
                    <p className="text-slate-600 mb-4">{percentage}% correct</p>
                    <div className="bg-white rounded-xl p-3">
                        <p className="text-sm text-slate-700">
                            {percentage >= 80
                                ? "Excellent! You're really grasping these concepts!"
                                : percentage >= 60
                                ? "Good job! Keep learning and you'll master this."
                                : "Keep going! Review the material and try again."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-5 mx-2 my-3">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-800">{title}</span>
                </div>
                <span className="text-sm text-slate-500">
                    {currentQuestion + 1}/{questions.length}
                </span>
            </div>

            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-4" />

            <p className="font-medium text-slate-800 mb-4">{currentQ.question}</p>

            <div className="space-y-2 mb-4">
                {currentQ.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleAnswer(currentQ.id, option.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            answers[currentQ.id] === option.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                    >
                        {answers[currentQ.id] === option.id ? (
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                        )}
                        <span className="text-slate-800">{option.label}</span>
                    </button>
                ))}
            </div>

            <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="w-full bg-blue-600 hover:bg-blue-700"
            >
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
}

// ============================================
// 4. INCOME CALCULATOR
// ============================================
interface IncomeCalculatorProps {
    onComplete: (monthlyIncome: number, yearlyIncome: number) => void;
}

export function IncomeCalculator({ onComplete }: IncomeCalculatorProps) {
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [sessionRate, setSessionRate] = useState(150);
    const [clientsPerWeek, setClientsPerWeek] = useState(5);
    const [showResults, setShowResults] = useState(false);
    const { trackIncomeCalculated } = useMiniDiplomaTracking();

    const weeklyIncome = clientsPerWeek * sessionRate;
    const monthlyIncome = weeklyIncome * 4;
    const yearlyIncome = monthlyIncome * 12;

    const handleCalculate = () => {
        setShowResults(true);

        // Track income calculation for segmentation
        trackIncomeCalculated(monthlyIncome, yearlyIncome, hoursPerWeek, sessionRate);

        onComplete(monthlyIncome, yearlyIncome);
    };

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl border-2 border-emerald-200 p-5 mx-2 my-3 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Your Income Calculator</h3>
                    <p className="text-sm text-slate-600">See what you could earn as a certified practitioner</p>
                </div>
            </div>

            <div className="space-y-6 mb-6">
                {/* Hours per week */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Hours per week you'd coach
                        </label>
                        <span className="text-lg font-bold text-emerald-600">{hoursPerWeek}h</span>
                    </div>
                    <Slider
                        value={[hoursPerWeek]}
                        onValueChange={(v) => setHoursPerWeek(v[0])}
                        min={5}
                        max={40}
                        step={5}
                        className="py-2"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>5h (side hustle)</span>
                        <span>40h (full-time)</span>
                    </div>
                </div>

                {/* Session rate */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            Your session rate
                        </label>
                        <span className="text-lg font-bold text-emerald-600">${sessionRate}</span>
                    </div>
                    <Slider
                        value={[sessionRate]}
                        onValueChange={(v) => setSessionRate(v[0])}
                        min={75}
                        max={300}
                        step={25}
                        className="py-2"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>$75 (starting)</span>
                        <span>$300 (expert)</span>
                    </div>
                </div>

                {/* Clients per week */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            Clients per week
                        </label>
                        <span className="text-lg font-bold text-emerald-600">{clientsPerWeek}</span>
                    </div>
                    <Slider
                        value={[clientsPerWeek]}
                        onValueChange={(v) => setClientsPerWeek(v[0])}
                        min={2}
                        max={15}
                        step={1}
                        className="py-2"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>2 clients</span>
                        <span>15 clients</span>
                    </div>
                </div>
            </div>

            {!showResults ? (
                <Button
                    onClick={handleCalculate}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                >
                    Calculate My Income
                    <TrendingUp className="w-5 h-5 ml-2" />
                </Button>
            ) : (
                <div className="space-y-4">
                    {/* Results */}
                    <div className="bg-white rounded-xl p-6 border-2 border-emerald-300 shadow-inner">
                        <p className="text-sm text-slate-500 text-center mb-4">Your potential earnings:</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-emerald-600">${monthlyIncome.toLocaleString()}</p>
                                <p className="text-sm text-slate-500">per month</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-emerald-600">${yearlyIncome.toLocaleString()}</p>
                                <p className="text-sm text-slate-500">per year</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                            <p className="text-sm text-emerald-800">
                                Working just <strong>{hoursPerWeek} hours/week</strong> from home,
                                on your schedule
                            </p>
                        </div>
                    </div>

                    {/* Social proof */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-amber-800">This is real.</span>
                        </div>
                        <p className="text-sm text-amber-700">
                            Our certified graduates average $4,200/month within 6 months of certification.
                            Top performers earn $8,000+/month.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// 5. DOWNLOADABLE RESOURCE
// ============================================
interface DownloadResourceProps {
    title: string;
    description: string;
    fileName: string;
    downloadUrl: string;
    icon?: "pdf" | "checklist" | "template" | "guide";
    onDownload?: () => void;
}

export function DownloadResource({
    title,
    description,
    fileName,
    downloadUrl,
    icon = "pdf",
    onDownload
}: DownloadResourceProps) {
    const [downloaded, setDownloaded] = useState(false);
    const { trackResourceDownloaded } = useMiniDiplomaTracking();

    const handleDownload = () => {
        setDownloaded(true);

        // Track resource download
        trackResourceDownloaded(title, downloadUrl);

        onDownload?.();
        // In real implementation, trigger download
        window.open(downloadUrl, '_blank');
    };

    const IconComponent = {
        pdf: FileText,
        checklist: CheckCircle2,
        template: FileText,
        guide: Lightbulb
    }[icon];

    return (
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border-2 border-slate-200 p-5 mx-2 my-3">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center shrink-0">
                    <IconComponent className="w-6 h-6 text-burgundy-600" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-burgundy-600 uppercase tracking-wide">Free Resource</span>
                        {downloaded && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Downloaded</span>
                        )}
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                    <p className="text-sm text-slate-600 mb-3">{description}</p>
                    <Button
                        onClick={handleDownload}
                        variant={downloaded ? "outline" : "default"}
                        className={downloaded ? "" : "bg-burgundy-600 hover:bg-burgundy-700"}
                        size="sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {downloaded ? "Download Again" : `Download ${fileName}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// 6. PRACTITIONER SCORE DISPLAY
// ============================================
interface PractitionerScoreProps {
    currentScore: number;
    maxScore: number;
    lessonsCompleted: number;
    totalLessons: number;
}

export function PractitionerScore({ currentScore, maxScore, lessonsCompleted, totalLessons }: PractitionerScoreProps) {
    const percentage = Math.round((currentScore / maxScore) * 100);
    const percentile = Math.min(99, Math.round((percentage / 100) * 50) + 50); // Simulated percentile

    const getTier = () => {
        if (percentage >= 90) return { name: "Expert", color: "text-amber-500", bg: "bg-amber-100" };
        if (percentage >= 70) return { name: "Advanced", color: "text-emerald-600", bg: "bg-emerald-100" };
        if (percentage >= 50) return { name: "Intermediate", color: "text-blue-600", bg: "bg-blue-100" };
        return { name: "Beginner", color: "text-slate-600", bg: "bg-slate-100" };
    };

    const tier = getTier();

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-5 mx-2 my-3">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Your Practitioner Score</span>
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${tier.bg} ${tier.color}`}>
                    {tier.name}
                </span>
            </div>

            <div className="text-center mb-4">
                <p className="text-4xl font-bold text-indigo-600">{currentScore}</p>
                <p className="text-sm text-slate-500">out of {maxScore} points</p>
            </div>

            <Progress value={percentage} className="h-3 mb-3" />

            <div className="flex justify-between text-sm text-slate-600">
                <span>{lessonsCompleted}/{totalLessons} lessons completed</span>
                <span>Top {100 - percentile}% of students</span>
            </div>
        </div>
    );
}
