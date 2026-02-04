"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Award, ArrowRight, ArrowLeft, Heart, Volume2, VolumeX, AlertTriangle, RefreshCw, GraduationCap, FileText, User, Clock, Hash, BookOpen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FM_EXAM_QUESTIONS, type ExamAnswers } from "@/lib/fm-exam-questions";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";
const ASI_LOGO = "/asi-logo.png";

interface FMExamComponentProps {
    firstName?: string;
    userId?: string;
    onExamComplete: (score: number, scholarshipQualified: boolean) => void;
}

type ExamState = "intro" | "taking" | "submitting" | "results" | "error";

interface ExamResults {
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    scholarshipQualified: boolean;
    answers: ExamAnswers;
}

// Generate a unique exam session ID
function generateExamId(): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FM-${dateStr}-${random}`;
}

export function FMExamComponent({
    firstName = "there",
    userId,
    onExamComplete,
}: FMExamComponentProps) {
    const [examState, setExamState] = useState<ExamState>("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<ExamAnswers>({});
    const [results, setResults] = useState<ExamResults | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [startTime] = useState<Date>(new Date());
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Generate exam ID on mount
    const examId = useMemo(() => generateExamId(), []);

    // Create a masked student ID from userId
    const studentId = useMemo(() => {
        if (!userId) return "STU-XXXXX";
        const hash = userId.slice(-6).toUpperCase();
        return `STU-${hash}`;
    }, [userId]);

    const questions = FM_EXAM_QUESTIONS;
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
            const response = await fetch("/api/mini-diploma/exam/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    examType: "fm-healthcare",
                    answers,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResults({
                    score: data.score,
                    correct: data.correct,
                    total: data.total,
                    passed: data.passed,
                    scholarshipQualified: data.scholarshipQualified,
                    answers,
                });
                setExamState("results");

                // Play celebration audio
                playResultsAudio(data.score);
            } else {
                console.error("Exam submission failed:", data.error);
                setErrorMessage(data.error || "Something went wrong. Please try again.");
                setExamState("error");
            }
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

    // Premium color palette matching ASI ebook design
    const goldGradient = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";
    const burgundyGradient = "linear-gradient(180deg, #722F37 0%, #5C1F2A 100%)";

    // Professional Exam Header Component - PREMIUM ASI INSTITUTIONAL DESIGN
    const ExamHeader = ({ showLogo = true, variant = "default" }: { showLogo?: boolean; variant?: "default" | "success" }) => (
        <div className="relative overflow-hidden">
            {/* Decorative corner flourishes */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/40 rounded-tr-lg pointer-events-none" />

            {/* Main header with gold gradient */}
            <div
                className="px-6 py-5 relative"
                style={{ background: variant === "success" ? goldGradient : burgundyGradient }}
            >
                {/* Subtle radial glow overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15) 0%, transparent 60%)' }}
                />

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        {showLogo && (
                            <div className="relative">
                                {/* Official seal design */}
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                                    style={{
                                        background: variant === "success" ? burgundyGradient : goldGradient,
                                        border: '3px solid rgba(212, 175, 55, 0.6)'
                                    }}
                                >
                                    <GraduationCap className={`w-7 h-7 ${variant === "success" ? "text-amber-300" : "text-burgundy-900"}`} />
                                </div>
                                {/* Seal ring */}
                                <div className="absolute -inset-1 rounded-full border border-amber-400/30 pointer-events-none" />
                            </div>
                        )}
                        <div>
                            <p className={`text-xs font-semibold tracking-widest uppercase mb-1 ${variant === "success" ? "text-burgundy-700" : "text-amber-300/90"}`}>
                                ASI Standards Institute
                            </p>
                            <h1 className={`font-bold text-xl tracking-tight ${variant === "success" ? "text-burgundy-900" : "text-white"}`}>
                                {variant === "success" ? "Examination Complete" : "Board Examination"}
                            </h1>
                            <p className={`text-sm font-medium ${variant === "success" ? "text-burgundy-700" : "text-amber-100/80"}`}>
                                Level 0 — Foundations Assessment
                            </p>
                        </div>
                    </div>

                    {/* Exam credentials box */}
                    <div
                        className="rounded-lg px-4 py-2.5 text-xs space-y-1.5 shadow-inner"
                        style={{
                            background: variant === "success" ? 'rgba(92, 31, 42, 0.9)' : 'rgba(0,0,0,0.25)',
                            border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}
                    >
                        <div className="flex items-center gap-2 text-amber-200">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Exam: <span className="text-white font-mono font-bold tracking-wide">{examId}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-200">
                            <User className="w-3.5 h-3.5" />
                            <span>Student: <span className="text-white font-mono font-bold tracking-wide">{studentId}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gold accent line */}
            <div
                className="h-1"
                style={{ background: goldGradient }}
            />
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

    // Intro Screen with Sarah's personal touch - PREMIUM DESIGN
    if (examState === "intro") {
        return (
            <div
                className="rounded-2xl overflow-hidden shadow-2xl relative"
                style={{
                    border: '3px solid #D4AF37',
                    boxShadow: '0 25px 50px -12px rgba(114, 47, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3)'
                }}
            >
                <ExamHeader />

                <div className="bg-gradient-to-br from-burgundy-50 via-white to-amber-50 p-6 md:p-8 relative">
                    {/* Subtle pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #722F37 2px, transparent 0)', backgroundSize: '50px 50px' }}
                    />
                    {/* Sarah's Personal Message */}
                    <div className="flex items-start gap-4 mb-6 bg-white rounded-xl p-5 border border-burgundy-100 shadow-sm">
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0 ring-2 ring-burgundy-200"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-burgundy-600 font-semibold">From Sarah, Your Coach</p>
                                <button
                                    onClick={isPlayingAudio ? stopAudio : playIntroAudio}
                                    className="flex items-center gap-1 text-xs text-burgundy-500 hover:text-burgundy-700 transition-colors bg-burgundy-50 px-2 py-1 rounded-full"
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
                                Don't worry - this is your moment to shine. Just take your time, trust what you've learned, and remember... <span className="text-burgundy-600 font-semibold">I believe in you</span>.
                            </p>
                            <p className="text-burgundy-600 font-medium mt-3 flex items-center gap-1">
                                <Heart className="w-4 h-4 text-pink-500" />
                                You've got this!
                            </p>
                        </div>
                    </div>

                    {/* Graduate Testimonials */}
                    <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-burgundy-600" />
                            What Our Graduates Say
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-lg p-3 border-l-4 border-burgundy-500">
                                <p className="text-gray-700 text-sm italic">"I was so nervous but the exam covered exactly what we learned. Passed on my first try!"</p>
                                <p className="text-xs text-burgundy-600 mt-1 font-medium">— Jennifer R., Texas</p>
                            </div>
                            <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-lg p-3 border-l-4 border-gold-500">
                                <p className="text-gray-700 text-sm italic">"Trust Sarah's lessons. If you paid attention, you already know everything you need."</p>
                                <p className="text-xs text-gold-600 mt-1 font-medium">— Diana M., Georgia</p>
                            </div>
                        </div>
                    </div>

                    {/* Exam Info Grid */}
                    <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-burgundy-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-burgundy-600 mb-1">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-burgundy-700">10</p>
                                <p className="text-xs text-gray-500">Questions</p>
                            </div>
                            <div className="p-3 bg-burgundy-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-burgundy-600 mb-1">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-burgundy-700">No</p>
                                <p className="text-xs text-gray-500">Time Limit</p>
                            </div>
                            <div className="p-3 bg-burgundy-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-burgundy-600 mb-1">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-burgundy-700">All 9</p>
                                <p className="text-xs text-gray-500">Lessons</p>
                            </div>
                            <div className="p-3 bg-burgundy-50 rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-burgundy-600 mb-1">
                                    <Award className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-burgundy-700">95%</p>
                                <p className="text-xs text-gray-500">To Qualify</p>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <Button
                        onClick={() => {
                            stopAudio();
                            setExamState("taking");
                        }}
                        size="lg"
                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white text-lg py-6 shadow-lg"
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

    // Results Screen - Always scholarship qualified - PREMIUM ASI DESIGN
    if (examState === "results" && results) {
        const elapsedMinutes = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);

        return (
            <div
                className="rounded-2xl overflow-hidden shadow-2xl relative"
                style={{
                    border: '3px solid #D4AF37',
                    boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.35), 0 0 0 1px rgba(212, 175, 55, 0.3)'
                }}
            >
                {/* Decorative corner flourishes */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-300/60 rounded-tl-lg pointer-events-none z-20" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-300/60 rounded-tr-lg pointer-events-none z-20" />

                {/* Success Header - Premium Gold */}
                <ExamHeader variant="success" />

                {/* Celebration Banner */}
                <div
                    className="px-6 py-4 text-center relative overflow-hidden"
                    style={{ background: burgundyGradient }}
                >
                    {/* Confetti effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'25\' cy=\'15\' r=\'3\' fill=\'%23D4AF37\'/%3E%3Ccircle cx=\'75\' cy=\'35\' r=\'2\' fill=\'%23F7E7A0\'/%3E%3Ccircle cx=\'50\' cy=\'80\' r=\'2.5\' fill=\'%23D4AF37\'/%3E%3Ccircle cx=\'15\' cy=\'60\' r=\'2\' fill=\'%23F7E7A0\'/%3E%3Ccircle cx=\'85\' cy=\'70\' r=\'3\' fill=\'%23D4AF37\'/%3E%3C/svg%3E")',
                        backgroundSize: '100px 100px'
                    }} />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-2" style={{ background: goldGradient, color: '#4E1F24' }}>
                            <Award className="w-4 h-4" />
                            LEVEL 0 — FOUNDATIONS COMPLETE
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Congratulations, {firstName}!</h2>
                        <p className="text-amber-200 text-sm mt-1">You've successfully completed your foundation assessment</p>
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
                                You've unlocked access to the exclusive masterclass!
                            </p>
                        </div>
                    </div>

                    {/* Score Display */}
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-gold-200 to-gold-100 border-4 border-gold-400 mb-4 shadow-lg"
                        >
                            <div className="text-center">
                                <span className="text-4xl font-black text-burgundy-800">{results.score}</span>
                                <span className="text-sm text-burgundy-600">/100</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gold-600 mb-2">
                                MASTERCLASS UNLOCKED!
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
                            Your Exclusive Masterclass is Ready!
                        </h3>
                        <div className="text-center">
                            <p className="text-gray-700 mb-3">
                                As a top performer, you've earned access to Sarah's exclusive live training where she reveals how our graduates are building 6-figure practices.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Live Training</span>
                                <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Q&A Session</span>
                                <span className="bg-white px-3 py-1 rounded-full text-burgundy-600 border border-burgundy-200">Graduate Secrets</span>
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
                        className="w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 text-burgundy-900 font-bold text-lg py-6 shadow-lg"
                    >
                        Unlock the Masterclass
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    // Taking Exam Screen - PREMIUM ASI INSTITUTIONAL DESIGN
    return (
        <div
            className="rounded-2xl overflow-hidden shadow-2xl relative"
            style={{
                border: '3px solid #D4AF37',
                boxShadow: '0 25px 50px -12px rgba(114, 47, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3)'
            }}
        >
            {/* Decorative corner flourishes */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none z-20">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-20">
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
            </div>

            <ExamHeader />

            {/* Progress Section - Premium Gold themed */}
            <div
                className="px-6 py-5 relative"
                style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FDF6E3 50%, #FEF3C7 100%)' }}
            >
                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #D4AF37 2px, transparent 0)', backgroundSize: '50px 50px' }}
                />

                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                            style={{ background: burgundyGradient }}
                        >
                            <span className="text-amber-200 font-bold text-sm">{currentQuestion + 1}</span>
                        </div>
                        <span className="text-base font-semibold text-burgundy-800">
                            Question {currentQuestion + 1} of {totalQuestions}
                        </span>
                    </div>
                    <div
                        className="px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
                        style={{ background: goldGradient, color: '#4E1F24' }}
                    >
                        {answeredCount}/{totalQuestions} answered
                    </div>
                </div>

                {/* Progress bar with enhanced styling */}
                <div className="relative z-10">
                    <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden shadow-inner border border-amber-200/50">
                        <div
                            className="h-3 rounded-full transition-all duration-500 relative"
                            style={{
                                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                                background: goldGradient
                            }}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Card - Enhanced Premium Styling */}
            <div className="bg-white p-6 md:p-8 relative">
                {/* Subtle background pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23722F37\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                    >
                        {/* Question Number Badge - Enhanced */}
                        <div className="flex items-center gap-3 mb-5">
                            <span
                                className="text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                                style={{ background: burgundyGradient, color: '#F7E7A0' }}
                            >
                                Question {currentQuestion + 1}
                            </span>
                            <span className="text-xs text-burgundy-500 font-medium flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                Based on Lesson {question.lessonRef}
                            </span>
                        </div>

                        {/* Question text with premium typography */}
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed tracking-tight">
                            {question.question}
                        </h3>

                        {/* Answer Options - Premium Cards */}
                        <div className="space-y-3">
                            {question.options.map((option) => {
                                const isSelected = answers[question.id] === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswer(question.id, option.id)}
                                        className={cn(
                                            "w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 group",
                                            isSelected
                                                ? "border-burgundy-500 bg-gradient-to-r from-burgundy-50 to-rose-50 text-burgundy-900 shadow-md"
                                                : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50 hover:shadow-sm"
                                        )}
                                        style={isSelected ? { boxShadow: '0 4px 14px -3px rgba(114, 47, 55, 0.25)' } : undefined}
                                    >
                                        <span className="flex items-center gap-4">
                                            <span
                                                className={cn(
                                                    "flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all flex-shrink-0",
                                                    isSelected
                                                        ? "shadow-md"
                                                        : "bg-gray-100 text-gray-600 group-hover:bg-burgundy-100 group-hover:text-burgundy-700"
                                                )}
                                                style={isSelected ? { background: burgundyGradient, color: '#F7E7A0' } : undefined}
                                            >
                                                {option.id.toUpperCase()}
                                            </span>
                                            <span className="flex-1 text-base">{option.text}</span>
                                            {isSelected && (
                                                <CheckCircle2 className="w-6 h-6 text-burgundy-600 flex-shrink-0" />
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer - Premium ASI Styling */}
            <div
                className="px-6 py-6 relative"
                style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FDF6E3 50%, #FEF3C7 100%)' }}
            >
                {/* Decorative bottom flourishes */}
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 border-2 border-burgundy-300 hover:bg-burgundy-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    {currentQuestion === totalQuestions - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all",
                                allAnswered
                                    ? "text-burgundy-900 shadow-lg hover:shadow-xl hover:scale-105"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            )}
                            style={allAnswered ? {
                                background: goldGradient,
                                boxShadow: '0 6px 20px -5px rgba(212, 175, 55, 0.5)'
                            } : undefined}
                        >
                            Submit Exam
                            <CheckCircle2 className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-burgundy-900 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                            style={{
                                background: goldGradient,
                                boxShadow: '0 4px 14px -3px rgba(212, 175, 55, 0.4)'
                            }}
                        >
                            Next Question
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Question Navigator - Enhanced Gold Design */}
                <div className="mt-6 relative z-10">
                    <p className="text-xs text-burgundy-600 font-medium text-center mb-3">Quick Navigation</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {questions.map((q, idx) => {
                            const isAnswered = !!answers[q.id];
                            const isCurrent = currentQuestion === idx;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={cn(
                                        "w-10 h-10 rounded-full text-sm font-bold transition-all relative",
                                        isCurrent ? "shadow-md" : "shadow-sm hover:shadow-md hover:scale-105"
                                    )}
                                    style={isCurrent
                                        ? { background: goldGradient, color: '#4E1F24' }
                                        : isAnswered
                                            ? { background: burgundyGradient, color: '#F7E7A0' }
                                            : { background: 'white', color: '#6B7280', border: '2px solid #E5E7EB' }
                                    }
                                >
                                    {idx + 1}
                                    {isAnswered && !isCurrent && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Exam Info Footer - Premium */}
                <div className="mt-5 pt-4 border-t border-amber-200/50 flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center gap-2 text-burgundy-600">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-mono font-medium">{examId}</span>
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-full font-medium",
                        allAnswered
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                    )}>
                        {allAnswered ? "✓ All questions answered" : `${totalQuestions - answeredCount} questions remaining`}
                    </div>
                </div>
            </div>
        </div>
    );
}
