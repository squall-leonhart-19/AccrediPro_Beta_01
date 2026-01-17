"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Award, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FM_EXAM_QUESTIONS, type ExamQuestion, type ExamAnswers } from "@/lib/fm-exam-questions";

interface FMExamComponentProps {
    firstName?: string;
    onExamComplete: (score: number, scholarshipQualified: boolean) => void;
    onSkipExam?: () => void;
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
    onSkipExam,
}: FMExamComponentProps) {
    const [examState, setExamState] = useState<ExamState>("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<ExamAnswers>({});
    const [results, setResults] = useState<ExamResults | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const questions = FM_EXAM_QUESTIONS;
    const question = questions[currentQuestion];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === totalQuestions;

    const handleAnswer = useCallback((questionId: number, answerId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    }, []);

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setShowExplanation(false);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
            setShowExplanation(false);
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
            } else {
                console.error("Exam submission failed:", data.error);
                setExamState("taking");
            }
        } catch (error) {
            console.error("Exam submission error:", error);
            setExamState("taking");
        }
    };

    const handleContinue = () => {
        if (results) {
            onExamComplete(results.score, results.scholarshipQualified);
        }
    };

    // Intro Screen
    if (examState === "intro") {
        return (
            <div className="bg-gradient-to-br from-burgundy-50 to-gold-50 rounded-2xl p-6 md:p-8 border-2 border-burgundy-200 shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burgundy-100 mb-4">
                        <Award className="w-8 h-8 text-burgundy-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-burgundy-800 mb-2">
                        Final Assessment
                    </h2>
                    <p className="text-burgundy-600 text-lg">
                        {firstName}, you're one step away from your Mini Diploma!
                    </p>
                </div>

                <div className="bg-white rounded-xl p-5 mb-6 border border-burgundy-100">
                    <h3 className="font-semibold text-burgundy-700 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        About This Exam
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-burgundy-500 font-bold">1.</span>
                            <span>10 questions covering all 9 lessons</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-burgundy-500 font-bold">2.</span>
                            <span>No time limit - take your time</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-burgundy-500 font-bold">3.</span>
                            <span>70% to pass (7/10 correct)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-burgundy-500 font-bold">4.</span>
                            <span>You can review and change answers before submitting</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-r from-gold-100 to-gold-50 rounded-xl p-5 mb-6 border-2 border-gold-300">
                    <h3 className="font-bold text-gold-800 mb-2 text-lg">
                        ASI Graduate Scholarship
                    </h3>
                    <p className="text-gold-700">
                        Score <span className="font-bold text-burgundy-600">95% or higher</span> (9-10 correct) and you'll qualify for the exclusive
                        <span className="font-bold text-burgundy-600"> $297 ASI Graduate Scholarship</span> - a $24,358 savings on full board certification!
                    </p>
                    <p className="text-sm text-gold-600 mt-2 italic">
                        Only 3 scholarship spots available per month. This is real scarcity.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => setExamState("taking")}
                        size="lg"
                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white text-lg py-6"
                    >
                        Start Exam
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    {onSkipExam && (
                        <button
                            onClick={onSkipExam}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Skip exam and continue (no scholarship)
                        </button>
                    )}
                </div>
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
                        Submitting Your Exam...
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we calculate your results.
                    </p>
                </div>
            </div>
        );
    }

    // Results Screen
    if (examState === "results" && results) {
        const isScholarshipQualified = results.scholarshipQualified;

        return (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 border-2 border-burgundy-100 shadow-lg">
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className={cn(
                            "inline-flex items-center justify-center w-24 h-24 rounded-full mb-4",
                            isScholarshipQualified ? "bg-gold-100" : results.passed ? "bg-green-100" : "bg-red-100"
                        )}
                    >
                        {isScholarshipQualified ? (
                            <Award className="w-12 h-12 text-gold-600" />
                        ) : results.passed ? (
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        ) : (
                            <XCircle className="w-12 h-12 text-red-600" />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">
                            {isScholarshipQualified ? (
                                <span className="text-gold-600">SCHOLARSHIP QUALIFIED!</span>
                            ) : results.passed ? (
                                <span className="text-green-600">You Passed!</span>
                            ) : (
                                <span className="text-red-600">Not Quite</span>
                            )}
                        </h2>

                        <div className="text-5xl md:text-6xl font-black text-burgundy-800 my-4">
                            {results.score}/100
                        </div>

                        <p className="text-lg text-gray-600">
                            {results.correct} out of {results.total} correct
                        </p>
                    </motion.div>
                </div>

                {isScholarshipQualified ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-gold-100 via-gold-50 to-gold-100 rounded-xl p-6 mb-6 border-2 border-gold-400"
                    >
                        <h3 className="text-xl font-bold text-gold-800 mb-3 text-center">
                            You Qualified for the ASI Graduate Scholarship!
                        </h3>
                        <p className="text-gold-700 text-center mb-4">
                            {firstName}, your score of <span className="font-bold">{results.score}%</span> puts you in the top 5% of all exam takers.
                            You've earned access to our exclusive <span className="font-bold">$297 Graduate Scholarship</span>.
                        </p>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-burgundy-700">
                                $24,655 value → <span className="text-gold-600">$297</span>
                            </p>
                            <p className="text-sm text-gold-600 font-semibold mt-1">
                                You save $24,358 (99% off)
                            </p>
                        </div>
                    </motion.div>
                ) : results.passed ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-green-50 rounded-xl p-5 mb-6 border border-green-200"
                    >
                        <p className="text-green-700 text-center">
                            Congratulations on passing! You've demonstrated solid understanding of functional medicine principles.
                            {results.score < 95 && (
                                <span className="block mt-2 text-sm">
                                    Score 95% or higher to qualify for the $297 scholarship. You can retake the exam.
                                </span>
                            )}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-red-50 rounded-xl p-5 mb-6 border border-red-200"
                    >
                        <p className="text-red-700 text-center">
                            Don't worry! Review the lessons and try again. You need 70% (7/10) to pass.
                        </p>
                    </motion.div>
                )}

                <Button
                    onClick={handleContinue}
                    size="lg"
                    className={cn(
                        "w-full text-lg py-6",
                        isScholarshipQualified
                            ? "bg-gold-600 hover:bg-gold-700 text-white"
                            : "bg-burgundy-600 hover:bg-burgundy-700 text-white"
                    )}
                >
                    {isScholarshipQualified ? "Claim Your Scholarship" : "Continue"}
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
