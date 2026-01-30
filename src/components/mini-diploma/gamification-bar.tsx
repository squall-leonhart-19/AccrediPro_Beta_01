"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Users, Clock, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface GamificationBarProps {
    lessonNumber: number;
    totalLessons: number;
    firstName?: string;
    onComplete?: () => void;
    justCompleted?: boolean;
}

// Fake social proof data
const TODAYS_COMPLETIONS = [47, 52, 39, 61, 45, 58, 43, 55, 49, 38];

export function GamificationBar({
    lessonNumber,
    totalLessons,
    firstName = "friend",
    onComplete,
    justCompleted = false,
}: GamificationBarProps) {
    const [streak, setStreak] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0); // in minutes
    const [showBadge, setShowBadge] = useState(false);
    const [todaysCompletions, setTodaysCompletions] = useState(127);

    const progress = (lessonNumber / totalLessons) * 100;

    // Simulate streak and time from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Get streak from localStorage
        const lastLesson = localStorage.getItem("last_lesson_date");
        const storedStreak = parseInt(localStorage.getItem("lesson_streak") || "1");
        const storedTime = parseInt(localStorage.getItem("total_time") || "0");

        const today = new Date().toDateString();
        if (lastLesson === today) {
            setStreak(storedStreak);
        } else {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastLesson === yesterday) {
                setStreak(storedStreak + 1);
            } else {
                setStreak(1);
            }
        }

        setTimeSpent(storedTime + Math.floor(Math.random() * 5) + 3); // Add 3-8 min per lesson

        // Random today's completions
        setTodaysCompletions(TODAYS_COMPLETIONS[Math.floor(Math.random() * TODAYS_COMPLETIONS.length)] + lessonNumber * 10);
    }, [lessonNumber]);

    // Fire confetti when lesson completed
    useEffect(() => {
        if (justCompleted) {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 }
            });

            // Show badge for milestone lessons
            if (lessonNumber === 3 || lessonNumber === 5 || lessonNumber === 7 || lessonNumber === totalLessons) {
                setShowBadge(true);
                setTimeout(() => setShowBadge(false), 4000);
            }

            // Update localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("last_lesson_date", new Date().toDateString());
                localStorage.setItem("lesson_streak", streak.toString());
                localStorage.setItem("total_time", timeSpent.toString());
            }
        }
    }, [justCompleted, lessonNumber, streak, timeSpent, totalLessons]);

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getMilestoneText = () => {
        if (lessonNumber === totalLessons) return "🎉 Mini Diploma Complete!";
        if (lessonNumber >= totalLessons * 0.75) return "Almost there! 🏃‍♀️";
        if (lessonNumber >= totalLessons * 0.5) return "Halfway champion! 🎯";
        if (lessonNumber >= totalLessons * 0.33) return "Great momentum! 💪";
        return "Great start! 🌟";
    };

    return (
        <div className="bg-white border-b border-gray-100">
            {/* Container to match content width */}
            <div className="max-w-4xl mx-auto">
                {/* Main Progress Bar */}
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold" style={{ color: '#722F37' }}>
                                Lesson {lessonNumber} of {totalLessons}
                            </span>
                            <span className="text-xs text-gray-500">
                                {getMilestoneText()}
                            </span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: '#722F37' }}>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Stats Row */}
                <div className="px-4 pb-3">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        {/* Streak */}
                        <div className="flex items-center gap-1 text-orange-600">
                            <Flame className="w-4 h-4" />
                            <span className="font-semibold">{streak} day streak</span>
                        </div>

                        {/* Time Invested */}
                        <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(timeSpent)} invested</span>
                        </div>

                        {/* Social Proof - hide on very small screens */}
                        <div className="hidden sm:flex items-center gap-1 text-emerald-600">
                            <Users className="w-4 h-4" />
                            <span>{todaysCompletions} completed today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Badge Popup */}
            <AnimatePresence>
                {showBadge && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Achievement Unlocked!</p>
                                <p className="text-sm text-amber-100">
                                    {lessonNumber === totalLessons
                                        ? "🏆 Mini Diploma Graduate"
                                        : lessonNumber >= 7
                                            ? "⭐ Expert Level"
                                            : lessonNumber >= 5
                                                ? "🎯 Halfway Hero"
                                                : "🌟 Quick Learner"}
                                </p>
                            </div>
                            <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
