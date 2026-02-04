"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Award, ArrowRight, ArrowLeft, Heart, Volume2, VolumeX, AlertTriangle, RefreshCw, GraduationCap, FileText, User, Clock, Hash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Types for dynamic exam content
export interface ExamQuestion {
    id: number;
    question: string;
    lessonRef: number;
    options: { id: string; text: string }[];
    correctAnswer: string;
}

export interface ExamTestimonial {
    quote: string;
    name: string;
    location: string;
}

export interface ExamConfig {
    nichePrefix: string; // e.g., "SH" for spiritual healing, "FM" for functional medicine
    nicheLabel: string; // e.g., "Spiritual Healing Mini Diploma"
    nicheDisplayName: string; // e.g., "Spiritual Healing Specialist"
    examCategory?: string; // e.g., "adhd-coaching" - used for DB storage
    questions: ExamQuestion[];
    testimonials: ExamTestimonial[];
    passScore?: number; // default 80
    scholarshipScore?: number; // default 95
    hasMasterclass?: boolean; // FM has masterclass, others go to sales page
    salesPageUrl?: string; // Optional sales page URL
    postExamFlow?: "scholarship" | "trustpilot"; // default: "scholarship"
    trustpilotUrl?: string; // default: https://www.trustpilot.com/review/accredipro.academy
}

interface DynamicExamComponentProps {
    firstName?: string;
    userId?: string;
    config: ExamConfig;
    onExamComplete: (score: number, scholarshipQualified: boolean) => void;
}

type ExamState = "intro" | "taking" | "submitting" | "results" | "error";

interface ExamResults {
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    scholarshipQualified: boolean;
    answers: Record<number, string>;
}

// Generate a unique exam session ID
function generateExamId(prefix: string): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${dateStr}-${random}`;
}

export function DynamicExamComponent({
    firstName = "there",
    userId,
    config,
    onExamComplete,
}: DynamicExamComponentProps) {
    const [examState, setExamState] = useState<ExamState>("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<ExamResults | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [startTime, setStartTime] = useState<Date | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const passScore = config.passScore || 80;
    const scholarshipScore = config.scholarshipScore || 95;

    // Generate exam ID on mount
    const examId = useMemo(() => generateExamId(config.nichePrefix), [config.nichePrefix]);

    // Create a masked student ID from userId
    const studentId = useMemo(() => {
        if (!userId) return "STU-XXXXX";
        const hash = userId.slice(-6).toUpperCase();
        return `STU-${hash}`;
    }, [userId]);

    const questions = config.questions;
    const question = questions[currentQuestion];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === totalQuestions;

    // Play Sarah's intro voice message
    const playIntroAudio = useCallback(async () => {
        try {
            setIsPlayingAudio(true);
            const response = await fetch("/api/tts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `Hey ${firstName}! It's Sarah here. I am SO proud of you for making it this far. You've completed all 9 lessons, and now it's time for your final assessment. Don't worry... this is your moment to shine. Just take your time, trust what you've learned, and remember... I believe in you. You've got this!`,
                    voice: "sarah",
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                audioRef.current = new Audio(url);
                audioRef.current.onended = () => setIsPlayingAudio(false);
                audioRef.current.play();
            }
        } catch (error) {
            console.error("Failed to play intro audio:", error);
            setIsPlayingAudio(false);
        }
    }, [firstName]);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlayingAudio(false);
    }, []);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handleAnswer = useCallback((questionId: number, answerId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    }, []);

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setExamState("submitting");
        setErrorMessage("");

        try {
            // Calculate correct answers
            let correct = 0;
            questions.forEach(q => {
                if (answers[q.id] === q.correctAnswer) {
                    correct++;
                }
            });

            // Always generate score between 92-100 for positive experience
            const score = 92 + Math.floor(Math.random() * 9); // 92-100
            const passed = true; // Always pass
            const scholarshipQualified = true; // Always qualify

            // Also call API to record the result
            await fetch("/api/mini-diploma/exam/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    examType: config.examCategory || config.nichePrefix.toLowerCase(),
                    answers,
                    score,
                    passed,
                }),
            });

            setResults({
                score,
                correct,
                total: totalQuestions,
                passed,
                scholarshipQualified,
                answers,
            });
            setExamState("results");

            // Play celebration audio
            playResultsAudio(score);
        } catch (error) {
            console.error("Exam submission error:", error);
            setErrorMessage("Network error. Please check your connection and try again.");
            setExamState("error");
        }
    };

    const handleRetry = () => {
        setExamState("taking");
        setErrorMessage("");
    };

    // Play Sarah's celebration voice message
    const playResultsAudio = async (score: number) => {
        try {
            setIsPlayingAudio(true);
            const response = await fetch("/api/tts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `Oh my gosh, ${firstName}! ${score} out of 100! I KNEW you could do it! You are officially in the top 5% of everyone who's ever taken this exam. I am SO incredibly proud of you right now. You've just unlocked access to my exclusive masterclass... this is huge! Click below to watch it now... but hurry, your access expires in 24 hours. You deserve this, ${firstName}. Let's make this happen!`,
                    voice: "sarah",
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                audioRef.current = new Audio(url);
                audioRef.current.onended = () => setIsPlayingAudio(false);
                audioRef.current.play();
            }
        } catch (error) {
            console.error("Failed to play results audio:", error);
            setIsPlayingAudio(false);
        }
    };

    const handleContinue = () => {
        stopAudio();
        if (results) {
            onExamComplete(results.score, results.scholarshipQualified);
        }
    };

    // Premium Metallic Gold Gradient - inline style for true metallic look
    const metallicGoldGradient = "linear-gradient(135deg, rgb(212, 175, 55) 0%, rgb(247, 231, 160) 25%, rgb(212, 175, 55) 50%, rgb(184, 134, 11) 75%, rgb(212, 175, 55) 100%)";

    // Professional Exam Header Component - PREMIUM METALLIC GOLD
    const ExamHeader = ({ showLogo = true }: { showLogo?: boolean }) => (
        <div
            className="text-burgundy-900 px-6 py-4"
            style={{ background: metallicGoldGradient }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showLogo && (
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-amber-200">
                            <GraduationCap className="w-6 h-6 text-amber-700" />
                        </div>
                    )}
                    <div>
                        <h1 className="font-bold text-lg text-burgundy-900 drop-shadow-sm">ASI Board Examination</h1>
                        <p className="text-burgundy-800 text-xs font-medium">{config.nicheLabel}</p>
                    </div>
                </div>
                <div className="text-right text-xs">
                    <div className="flex items-center gap-1 text-burgundy-800">
                        <FileText className="w-3 h-3" />
                        <span>Exam ID: <span className="text-burgundy-900 font-mono font-bold">{examId}</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-burgundy-800 mt-1">
                        <User className="w-3 h-3" />
                        <span>Student: <span className="text-burgundy-900 font-mono font-bold">{studentId}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Error Screen
    if (examState === "error") {
        return (
            <div className="rounded-2xl overflow-hidden border-2 border-burgundy-200 shadow-xl">
                <ExamHeader />
                <div className="bg-white p-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Submission Error
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {errorMessage}
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                            <p className="text-sm text-amber-800">
                                <strong>Don't worry!</strong> Your answers have been saved. Click retry to submit again.
                            </p>
                        </div>
                        <Button
                            onClick={handleRetry}
                            className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Submission
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Intro Screen with Sarah's personal touch - PREMIUM METALLIC GOLD
    if (examState === "intro") {
        return (
            <div className="rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl">
                <ExamHeader />

                <div
                    className="p-6 md:p-8"
                    style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(247,231,160,0.12) 25%, rgba(255,255,255,0.95) 50%, rgba(247,231,160,0.1) 75%, rgba(212,175,55,0.06) 100%)" }}
                >
                    {/* Sarah's Personal Message */}
                    <div className="flex items-start gap-4 mb-6 bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-amber-300 shadow-md">
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0 ring-2 ring-amber-300"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-amber-700 font-semibold">From Sarah, Your Coach</p>
                                <button
                                    onClick={isPlayingAudio ? stopAudio : playIntroAudio}
                                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 transition-colors bg-amber-50 px-2 py-1 rounded-full"
                                >
                                    {isPlayingAudio ? (
                                        <>
                                            <VolumeX className="w-4 h-4" />
                                            Stop
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-4 h-4" />
                                            Listen
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {firstName}, I am SO proud of you for making it this far! You've completed all 9 lessons, and now it's time for your final assessment.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-2">
                                Don't worry - this is your moment to shine. Just take your time, trust what you've learned, and remember... <span className="text-amber-700 font-semibold">I believe in you</span>.
                            </p>
                            <p className="text-amber-700 font-medium mt-3 flex items-center gap-1">
                                <Heart className="w-4 h-4 text-pink-500" />
                                You've got this!
                            </p>
                        </div>
                    </div>

                    {/* Graduate Testimonials */}
                    <div className="bg-white rounded-xl p-5 mb-6 border border-amber-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-amber-600" />
                            What Our Graduates Say
                        </h3>
                        <div className="space-y-3">
                            {config.testimonials.slice(0, 2).map((testimonial, idx) => (
                                <div key={idx} className={`bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border-l-4 ${idx === 0 ? 'border-amber-500' : 'border-yellow-500'}`}>
                                    <p className="text-gray-700 text-sm italic">"{testimonial.quote}"</p>
                                    <p className={`text-xs mt-1 font-medium ${idx === 0 ? 'text-amber-700' : 'text-yellow-700'}`}>— {testimonial.name}, {testimonial.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exam Info Grid - GOLD */}
                    <div className="bg-white rounded-xl p-4 mb-6 border border-amber-200 shadow-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-amber-700">{totalQuestions}</p>
                                <p className="text-xs text-gray-500">Questions</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-amber-700">No</p>
                                <p className="text-xs text-gray-500">Time Limit</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-amber-700">All 9</p>
                                <p className="text-xs text-gray-500">Lessons</p>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                                    <Award className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-emerald-700">✓</p>
                                <p className="text-xs text-gray-500">Scholarship Ready</p>
                            </div>
                        </div>
                    </div>

                    {/* Start Button - PREMIUM METALLIC GOLD */}
                    <Button
                        onClick={() => {
                            stopAudio();
                            setStartTime(new Date()); // Start timer when exam begins
                            setExamState("taking");
                        }}
                        size="lg"
                        className="w-full text-burgundy-900 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-600/50"
                        style={{ background: metallicGoldGradient }}
                    >
                        I'm Ready - Start My Assessment
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    // Submitting Screen
    if (examState === "submitting") {
        return (
            <div className="rounded-2xl overflow-hidden border-2 border-burgundy-200 shadow-xl">
                <ExamHeader />
                <div className="bg-white p-8">
                    <div className="text-center">
                        <div className="relative">
                            <Loader2 className="w-20 h-20 text-burgundy-600 animate-spin mx-auto mb-4" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 text-burgundy-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-burgundy-800 mb-2">
                            Calculating Your Results...
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Sarah is reviewing your answers now!
                        </p>
                        <div className="bg-burgundy-50 rounded-lg p-3 max-w-xs mx-auto">
                            <p className="text-xs text-burgundy-600 font-mono">
                                Exam ID: {examId}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen - Trustpilot Review Request Flow
    if (examState === "results" && results && config.postExamFlow === "trustpilot") {
        const elapsedMinutes = startTime ? Math.max(1, Math.floor((new Date().getTime() - startTime.getTime()) / 60000)) : 1;
        const trustpilotUrl = config.trustpilotUrl || "https://www.trustpilot.com/review/accredipro.academy";

        return (
            <div className="rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl">
                {/* Gold Success Header - PREMIUM METALLIC */}
                <div
                    className="text-burgundy-900 px-6 py-4"
                    style={{ background: metallicGoldGradient }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-amber-200">
                                <Award className="w-6 h-6 text-amber-700" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-burgundy-900 drop-shadow-sm">EXAMINATION PASSED</h1>
                                <p className="text-burgundy-800 text-xs font-medium">Almost Certified!</p>
                            </div>
                        </div>
                        <div className="text-right text-xs">
                            <div className="flex items-center gap-1 text-burgundy-800">
                                <FileText className="w-3 h-3" />
                                <span>Exam: <span className="font-mono font-bold text-burgundy-900">{examId}</span></span>
                            </div>
                            <div className="flex items-center gap-1 text-burgundy-800 mt-1">
                                <User className="w-3 h-3" />
                                <span>Student: <span className="font-mono font-bold text-burgundy-900">{studentId}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gold-50 to-white p-6 md:p-8">
                    {/* Score Display */}
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-amber-500 mb-4 shadow-lg"
                            style={{ background: metallicGoldGradient }}
                        >
                            <div className="text-center">
                                <span className="text-3xl font-black text-burgundy-900 drop-shadow-sm">{results.score}</span>
                                <span className="text-sm text-burgundy-800 font-bold">/100</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-burgundy-700 mb-1">
                                🎓 Congratulations — You're Almost Officially Certified!
                            </h2>
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    {results.correct}/{results.total} Correct
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {elapsedMinutes} min
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sarah's Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-4 mb-6 bg-white rounded-xl p-5 border-2 border-emerald-200 shadow-sm"
                    >
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0 ring-4 ring-emerald-300"
                        />
                        <div className="flex-1">
                            <p className="text-emerald-600 font-semibold mb-2">Sarah here 💚</p>
                            <p className="text-gray-700 leading-relaxed">
                                I'm SO proud of you — <span className="font-bold text-gold-600">{results.score}/100</span>! Just one final step before your diploma is issued.
                            </p>
                        </div>
                    </motion.div>

                    {/* Steps Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-amber-50 via-gold-50 to-amber-50 rounded-xl p-6 mb-6 border-2 border-amber-300"
                    >
                        <h3 className="text-lg font-bold text-burgundy-800 mb-4 text-center">
                            ✨ How to Receive Your Official Mini Diploma
                        </h3>
                        <p className="text-gray-600 text-center text-sm mb-5">
                            Please complete these two quick steps so we can process and email your certificate within 24–48 hours:
                        </p>

                        {/* Step 1 */}
                        <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm">1</span>
                                <span className="font-semibold text-gray-800">Leave your honest review clicking the button below!</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 ml-11">
                                This helps me as a single Mum to improve all I created! 💚
                            </p>
                            <a
                                href={trustpilotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3 px-6 rounded-lg font-bold text-white bg-[#00b67a] hover:bg-[#009567] transition-colors shadow-md"
                            >
                                ⭐ Leave Trustpilot Review
                            </a>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-burgundy-600 text-white font-bold text-sm">2</span>
                                <span className="font-semibold text-gray-800">Send me a quick message on Heartbeat that says:</span>
                            </div>
                            <div className="ml-11">
                                <p className="text-lg font-bold text-burgundy-700 bg-burgundy-50 px-4 py-2 rounded-lg inline-block mb-2">
                                    "Review left ✅"
                                </p>
                                <p className="text-sm text-gray-600">
                                    — and your diploma will arrive by email in 24–48 hours.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Email Reminder */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center"
                    >
                        <p className="text-sm text-blue-700">
                            📧 Remember to check <strong>Spam</strong> or <strong>Promotions</strong> folders if you don't see it after 48 hours.
                        </p>
                    </motion.div>

                    {/* Thank You Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center"
                    >
                        <h4 className="font-bold text-burgundy-700 mb-2">Thank You for Being Part of This Journey 💚</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Your words — even just one sentence — help future students decide if this path is right for them and help me keep improving every class.
                        </p>
                        <p className="text-gray-700">
                            You've worked so hard. Take a deep breath, celebrate, and get ready to add <strong>"{config.nicheDisplayName}"</strong> to your name!
                        </p>
                        <p className="text-burgundy-600 font-semibold mt-4">
                            With pride,<br />
                            Sarah 💚
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Results Screen - Scholarship/Masterclass Flow (default)
    if (examState === "results" && results) {
        const elapsedMinutes = startTime ? Math.max(1, Math.floor((new Date().getTime() - startTime.getTime()) / 60000)) : 1;

        return (
            <div className="rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl">
                {/* Gold Success Header - PREMIUM METALLIC */}
                <div
                    className="text-burgundy-900 px-6 py-4"
                    style={{ background: metallicGoldGradient }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-amber-200">
                                <Award className="w-6 h-6 text-amber-700" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-burgundy-900 drop-shadow-sm">EXAMINATION PASSED</h1>
                                <p className="text-burgundy-800 text-xs font-medium">{config.hasMasterclass ? 'Masterclass Unlocked!' : 'Scholarship Unlocked!'}</p>
                            </div>
                        </div>
                        <div className="text-right text-xs">
                            <div className="flex items-center gap-1 text-burgundy-800">
                                <FileText className="w-3 h-3" />
                                <span>Exam: <span className="font-mono font-bold text-burgundy-900">{examId}</span></span>
                            </div>
                            <div className="flex items-center gap-1 text-burgundy-800 mt-1">
                                <User className="w-3 h-3" />
                                <span>Student: <span className="font-mono font-bold text-burgundy-900">{studentId}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gold-50 to-white p-6 md:p-8">
                    {/* Sarah's Celebration Message */}
                    <div className="flex items-start gap-4 mb-6 bg-white rounded-xl p-5 border-2 border-gold-200 shadow-sm">
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0 ring-4 ring-gold-300"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gold-600 font-semibold">Sarah is SO proud of you!</p>
                                <button
                                    onClick={isPlayingAudio ? stopAudio : () => playResultsAudio(results.score)}
                                    className="flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700 transition-colors bg-gold-50 px-2 py-1 rounded-full"
                                >
                                    {isPlayingAudio ? (
                                        <>
                                            <VolumeX className="w-4 h-4" />
                                            Stop
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-4 h-4" />
                                            Listen
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Oh my gosh, {firstName}! <span className="font-bold text-gold-600">{results.score}/100</span>! I KNEW you could do it! You are officially in the <span className="font-bold text-burgundy-600">top 5%</span> of everyone who's ever taken this exam.
                            </p>
                            <p className="text-burgundy-600 font-semibold mt-2">
                                {config.hasMasterclass
                                    ? "You've unlocked access to the exclusive masterclass!"
                                    : "You've unlocked an exclusive scholarship opportunity!"}
                            </p>
                        </div>
                    </div>

                    {/* Score Display */}
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-amber-500 mb-4 shadow-lg"
                            style={{ background: metallicGoldGradient }}
                        >
                            <div className="text-center">
                                <span className="text-4xl font-black text-burgundy-900 drop-shadow-sm">{results.score}</span>
                                <span className="text-sm text-burgundy-800 font-bold">/100</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gold-600 mb-2">
                                {config.hasMasterclass ? 'MASTERCLASS UNLOCKED!' : 'SCHOLARSHIP UNLOCKED!'}
                            </h2>

                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    {results.correct}/{results.total} Correct
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {elapsedMinutes} min
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Masterclass Unlocked Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-gold-100 via-gold-50 to-gold-100 rounded-xl p-6 mb-6 border-2 border-gold-400 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-gold-800 mb-3 text-center">
                            {config.hasMasterclass ? 'Your Exclusive Masterclass is Ready!' : 'Your 70% Scholarship is Reserved!'}
                        </h3>
                        <div className="text-center">
                            <p className="text-gray-700 mb-3">
                                {config.hasMasterclass
                                    ? "As a top performer, you've earned access to Sarah's exclusive live training where she reveals how our graduates are building 6-figure practices."
                                    : "Congratulations! Your exceptional exam score has qualified you for an exclusive 70% tuition scholarship on the full professional certification."}
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                {config.hasMasterclass ? (
                                    <>
                                        <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Live Training</span>
                                        <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Q&A Session</span>
                                        <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Graduate Secrets</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Full Certification</span>
                                        <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Business Training</span>
                                        <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Lifetime Access</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-burgundy-600">
                            <span className="inline-flex items-center gap-1 bg-burgundy-100 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                Access expires in 24 hours
                            </span>
                        </div>
                    </motion.div>

                    <Button
                        onClick={handleContinue}
                        size="lg"
                        className="w-full text-burgundy-900 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-600/50"
                        style={{ background: metallicGoldGradient }}
                    >
                        {config.hasMasterclass ? 'Unlock the Masterclass' : 'Claim Your Scholarship'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    // Taking Exam Screen
    return (
        <div className="rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl">
            <ExamHeader />

            {/* Progress Section - PREMIUM */}
            <div
                className="px-4 py-3 border-b border-amber-300/50"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(247,231,160,0.2) 50%, rgba(212,175,55,0.15) 100%)" }}
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-burgundy-800">
                        Question {currentQuestion + 1} of {totalQuestions}
                    </span>
                    <span className="text-sm font-medium text-burgundy-700">
                        {answeredCount}/{totalQuestions} answered
                    </span>
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-3 shadow-inner">
                    <div
                        className="h-3 rounded-full transition-all duration-300 shadow-sm"
                        style={{
                            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                            background: metallicGoldGradient
                        }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="bg-white p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Question Number Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded">
                                Q{currentQuestion + 1}
                            </span>
                            <span className="text-xs text-gray-500">
                                Lesson {question.lessonRef} Reference
                            </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                            {question.question}
                        </h3>

                        <div className="space-y-3">
                            {question.options.map((option) => {
                                const isSelected = answers[question.id] === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswer(question.id, option.id)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                                            isSelected
                                                ? "border-amber-500 text-burgundy-900 shadow-md"
                                                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/30"
                                        )}
                                        style={isSelected ? { background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(247,231,160,0.18) 50%, rgba(212,175,55,0.10) 100%)" } : {}}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    "flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all",
                                                    isSelected
                                                        ? "text-burgundy-900 shadow-md"
                                                        : "bg-gray-100 text-gray-600"
                                                )}
                                                style={isSelected ? { background: metallicGoldGradient } : {}}
                                            >
                                                {option.id.toUpperCase()}
                                            </span>
                                            <span className="flex-1">{option.text}</span>
                                            {isSelected && (
                                                <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation - PREMIUM METALLIC */}
            <div
                className="px-6 py-4 border-t border-amber-300/50"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(247,231,160,0.15) 50%, rgba(212,175,55,0.08) 100%)" }}
            >
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    {currentQuestion === totalQuestions - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={cn(
                                "flex items-center gap-2 px-6 border-2 border-amber-600/50 transition-all",
                                allAnswered
                                    ? "text-burgundy-900 font-bold shadow-md hover:shadow-lg"
                                    : "bg-gray-300"
                            )}
                            style={allAnswered ? { background: metallicGoldGradient } : {}}
                        >
                            Submit Exam
                            <CheckCircle2 className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="flex items-center gap-2 text-burgundy-900 font-bold border-2 border-amber-600/50 shadow-md hover:shadow-lg transition-all"
                            style={{ background: metallicGoldGradient }}
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Question Navigator - PREMIUM METALLIC */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {questions.map((q, idx) => {
                        const isActive = currentQuestion === idx;
                        const isAnswered = !!answers[q.id];
                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestion(idx)}
                                className={cn(
                                    "w-9 h-9 rounded-lg text-sm font-bold transition-all",
                                    isActive
                                        ? "text-burgundy-900 shadow-md ring-2 ring-amber-400"
                                        : isAnswered
                                            ? "text-amber-800 ring-2 ring-amber-300"
                                            : "bg-gray-100 text-gray-600 hover:bg-amber-50"
                                )}
                                style={isActive
                                    ? { background: metallicGoldGradient }
                                    : isAnswered
                                        ? { background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(247,231,160,0.25) 50%, rgba(212,175,55,0.15) 100%)" }
                                        : {}
                                }
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Exam Info Footer */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono">{examId}</span>
                    <span>{allAnswered ? "✓ All questions answered" : `${totalQuestions - answeredCount} remaining`}</span>
                </div>
            </div>
        </div>
    );
}
