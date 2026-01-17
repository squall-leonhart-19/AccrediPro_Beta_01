"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Award, ArrowRight, ArrowLeft, Heart, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FM_EXAM_QUESTIONS, type ExamAnswers } from "@/lib/fm-exam-questions";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface FMExamComponentProps {
    firstName?: string;
    onExamComplete: (score: number, scholarshipQualified: boolean) => void;
}

type ExamState = "intro" | "taking" | "submitting" | "results";

interface ExamResults {
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    scholarshipQualified: boolean;
    answers: ExamAnswers;
}

export function FMExamComponent({
    firstName = "there",
    onExamComplete,
}: FMExamComponentProps) {
    const [examState, setExamState] = useState<ExamState>("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<ExamAnswers>({});
    const [results, setResults] = useState<ExamResults | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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
                setExamState("taking");
            }
        } catch (error) {
            console.error("Exam submission error:", error);
            setExamState("taking");
        }
    };

    // Play Sarah's celebration voice message
    const playResultsAudio = async (score: number) => {
        try {
            setIsPlayingAudio(true);
            const response = await fetch("/api/tts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `Oh my gosh, ${firstName}! ${score} percent! I KNEW you could do it! You are officially in the top 5% of everyone who's ever taken this exam. I am SO incredibly proud of you right now. You've just qualified for our ASI Graduate Scholarship... this is huge! Click below to claim your spot... but hurry, we only have 3 scholarship spots available this month, and your coupon expires in 24 hours. You deserve this, ${firstName}. Let's make this happen!`,
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

    // Intro Screen with Sarah's personal touch
    if (examState === "intro") {
        return (
            <div className="bg-gradient-to-br from-burgundy-50 to-gold-50 rounded-2xl p-6 md:p-8 border-2 border-burgundy-200 shadow-lg">
                {/* Sarah's Personal Message */}
                <div className="flex items-start gap-4 mb-6 bg-white rounded-xl p-5 border border-burgundy-100">
                    <Image
                        src={SARAH_AVATAR}
                        alt="Sarah"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-burgundy-600 font-semibold">From Sarah, Your Coach</p>
                            <button
                                onClick={isPlayingAudio ? stopAudio : playIntroAudio}
                                className="flex items-center gap-1 text-xs text-burgundy-500 hover:text-burgundy-700 transition-colors"
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

                {/* Scholarship Info */}
                <div className="bg-gradient-to-r from-gold-100 to-gold-50 rounded-xl p-5 mb-6 border-2 border-gold-300">
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="w-6 h-6 text-gold-600" />
                        <h3 className="font-bold text-gold-800 text-lg">
                            ASI Graduate Scholarship
                        </h3>
                    </div>
                    <p className="text-gold-700 mb-3">
                        Complete this assessment and you'll qualify for our exclusive <span className="font-bold text-burgundy-600">$297 Graduate Scholarship</span> - that's <span className="font-bold">$24,358 in savings</span> on full board certification!
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gold-600">
                        <span className="inline-flex items-center gap-1 bg-gold-200 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Only 3 spots available this month
                        </span>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-burgundy-700">10</p>
                            <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-burgundy-700">No</p>
                            <p className="text-xs text-gray-500">Time Limit</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-burgundy-700">All 9</p>
                            <p className="text-xs text-gray-500">Lessons Covered</p>
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
                    className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white text-lg py-6"
                >
                    I'm Ready - Start My Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        );
    }

    // Submitting Screen
    if (examState === "submitting") {
        return (
            <div className="bg-white rounded-2xl p-8 border-2 border-burgundy-100 shadow-lg">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-burgundy-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-burgundy-800 mb-2">
                        Calculating Your Results...
                    </h2>
                    <p className="text-gray-600">
                        Sarah is reviewing your answers now!
                    </p>
                </div>
            </div>
        );
    }

    // Results Screen - Always scholarship qualified!
    if (examState === "results" && results) {
        return (
            <div className="bg-gradient-to-br from-gold-50 to-white rounded-2xl p-6 md:p-8 border-2 border-gold-300 shadow-lg">
                {/* Sarah's Celebration Message */}
                <div className="flex items-start gap-4 mb-6 bg-white rounded-xl p-5 border-2 border-gold-200">
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
                                className="flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700 transition-colors"
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
                            Oh my gosh, {firstName}! <span className="font-bold text-gold-600">{results.score}%</span>! I KNEW you could do it! You are officially in the <span className="font-bold text-burgundy-600">top 5%</span> of everyone who's ever taken this exam.
                        </p>
                        <p className="text-burgundy-600 font-semibold mt-2">
                            You've just qualified for the ASI Graduate Scholarship!
                        </p>
                    </div>
                </div>

                {/* Score Display */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-gold-200 to-gold-100 border-4 border-gold-400 mb-4"
                    >
                        <Award className="w-14 h-14 text-gold-600" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gold-600 mb-2">
                            SCHOLARSHIP QUALIFIED!
                        </h2>

                        <div className="text-5xl md:text-6xl font-black text-burgundy-800 my-4">
                            {results.score}/100
                        </div>

                        <p className="text-lg text-gray-600">
                            {results.correct} out of {results.total} correct
                        </p>
                    </motion.div>
                </div>

                {/* Scholarship Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-gold-100 via-gold-50 to-gold-100 rounded-xl p-6 mb-6 border-2 border-gold-400"
                >
                    <h3 className="text-xl font-bold text-gold-800 mb-3 text-center">
                        Your ASI Graduate Scholarship is Ready!
                    </h3>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-burgundy-700">
                            $24,655 value → <span className="text-gold-600">$297</span>
                        </p>
                        <p className="text-sm text-gold-600 font-semibold mt-1">
                            You save $24,358 (99% off)
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-burgundy-600">
                        <span className="inline-flex items-center gap-1 bg-burgundy-100 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Coupon expires in 24 hours
                        </span>
                    </div>
                </motion.div>

                <Button
                    onClick={handleContinue}
                    size="lg"
                    className="w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 text-burgundy-900 font-bold text-lg py-6"
                >
                    Claim Your Scholarship Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        );
    }

    // Taking Exam Screen
    return (
        <div className="bg-white rounded-2xl border-2 border-burgundy-100 shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-burgundy-50 px-4 py-3 border-b border-burgundy-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-burgundy-700">
                        Question {currentQuestion + 1} of {totalQuestions}
                    </span>
                    <span className="text-sm text-burgundy-600">
                        {answeredCount}/{totalQuestions} answered
                    </span>
                </div>
                <div className="w-full bg-burgundy-100 rounded-full h-2">
                    <div
                        className="bg-burgundy-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
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
                                                ? "border-burgundy-500 bg-burgundy-50 text-burgundy-900"
                                                : "border-gray-200 hover:border-burgundy-200 hover:bg-gray-50"
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                                                    isSelected
                                                        ? "bg-burgundy-600 text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                )}
                                            >
                                                {option.id.toUpperCase()}
                                            </span>
                                            <span>{option.text}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
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
                                "flex items-center gap-2",
                                allAnswered
                                    ? "bg-burgundy-600 hover:bg-burgundy-700"
                                    : "bg-gray-300"
                            )}
                        >
                            Submit Exam
                            <CheckCircle2 className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-burgundy-600 hover:bg-burgundy-700"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {questions.map((q, idx) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(idx)}
                            className={cn(
                                "w-8 h-8 rounded-full text-sm font-medium transition-all",
                                currentQuestion === idx
                                    ? "bg-burgundy-600 text-white"
                                    : answers[q.id]
                                    ? "bg-burgundy-100 text-burgundy-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
