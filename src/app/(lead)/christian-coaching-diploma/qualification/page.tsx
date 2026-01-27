"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, GraduationCap, Clock, Users, ArrowRight, Sparkles, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ChristianCoachingQualificationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userName = searchParams.get("name") || "there";

    const [step, setStep] = useState<"checking" | "approved" | "ready">("checking");
    const [progress, setProgress] = useState(0);

    // Calculate cohort info
    const cohortNumber = Math.floor((Date.now() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const cohortCloseDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const formattedDate = cohortCloseDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    useEffect(() => {
        // Step 1: Checking animation (0-100% in 3 seconds)
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 4;
            });
        }, 100);

        // After 3 seconds, show "approved"
        const approvedTimeout = setTimeout(() => {
            setStep("approved");
        }, 3000);

        // After 5 seconds, show "ready" (with CTA)
        const readyTimeout = setTimeout(() => {
            setStep("ready");
        }, 5000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(approvedTimeout);
            clearTimeout(readyTimeout);
        };
    }, []);

    const handleStart = () => {
        router.push("/christian-coaching-diploma");
    };

    // Auto-redirect after 15 seconds if they don't click
    useEffect(() => {
        if (step === "ready") {
            const autoRedirect = setTimeout(() => {
                handleStart();
            }, 15000);
            return () => clearTimeout(autoRedirect);
        }
    }, [step]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1e3a5f] to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    {/* Step 1: Checking Application */}
                    {step === "checking" && (
                        <motion.div
                            key="checking"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="mb-8">
                                <Image
                                    src="/asi-logo.png"
                                    alt="ASI"
                                    width={80}
                                    height={80}
                                    className="mx-auto mb-4 rounded-xl"
                                />
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                🙏 Reviewing Your Application...
                            </h1>

                            <p className="text-white/60 mb-8">
                                Please wait while we verify your eligibility
                            </p>

                            {/* Progress Bar */}
                            <div className="max-w-md mx-auto">
                                <div className="bg-white/10 rounded-full h-4 overflow-hidden mb-2">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#d4a574] to-[#c9956a]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="text-white/40 text-sm">{progress}%</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Approved! */}
                    {step === "approved" && (
                        <motion.div
                            key="approved"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-24 h-24 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle className="w-14 h-14 text-white" />
                            </motion.div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                ✝️ CONGRATULATIONS!
                            </h1>

                            <p className="text-xl text-[#d4a574] font-semibold">
                                You qualify for the Christian Life Coaching Certification
                            </p>
                        </motion.div>
                    )}

                    {/* Step 3: Ready to Start */}
                    {step === "ready" && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] p-6 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                                >
                                    <GraduationCap className="w-10 h-10 text-white" />
                                </motion.div>

                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Welcome, {userName}! 🙏
                                </h1>

                                <p className="text-blue-100">
                                    You've been accepted into the<br />
                                    <span className="text-[#d4a574] font-bold text-lg">
                                        ASI Christian Life Coaching Foundation Program
                                    </span>
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {/* Key Info */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
                                        <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-emerald-700">48 Hours</div>
                                        <div className="text-xs text-emerald-600">Access Starts NOW</div>
                                    </div>
                                    <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                                        <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-amber-700">Cohort #{cohortNumber}</div>
                                        <div className="text-xs text-amber-600">Closes {formattedDate}</div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Button
                                        onClick={handleStart}
                                        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] hover:from-[#162d4a] hover:to-[#1e3a5f] text-white shadow-lg"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        START YOUR FIRST LESSON
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>

                                {/* Social Proof */}
                                <div className="mt-4 text-center text-sm text-slate-500">
                                    <span className="text-emerald-600 font-semibold">✨ 1,247 faith-driven women</span> enrolled this month
                                </div>

                                {/* Sarah Welcome */}
                                <div className="mt-6 bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                    <Image
                                        src="/coaches/sarah-coach.webp"
                                        alt="Coach Sarah"
                                        width={48}
                                        height={48}
                                        className="rounded-full border-2 border-[#d4a574]"
                                    />
                                    <div>
                                        <div className="font-semibold text-slate-800">Coach Sarah 💬</div>
                                        <p className="text-sm text-slate-600">
                                            "Hey {userName}! I'm so blessed you've answered this calling. God has
                                            a plan for you, and I believe coaching is part of it. Lesson 1 takes
                                            just 5 minutes—let's discover it together!"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
