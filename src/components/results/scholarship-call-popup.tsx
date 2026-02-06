"use client";

import { useState, useEffect } from "react";
import { Phone, X, Loader2, CheckCircle, PhoneCall } from "lucide-react";

interface CallPopupProps {
    isOpen: boolean;
    onClose: () => void;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    quizData?: {
        specialization?: string;
        incomeGoal?: string;
        currentIncome?: string;
        background?: string;
        experience?: string;
        commitment?: string;
        startTimeline?: string;
    };
}

type CallState = "idle" | "calling" | "connected" | "error";

export function ScholarshipCallPopup({
    isOpen,
    onClose,
    firstName,
    lastName,
    email,
    phone,
    quizData,
}: CallPopupProps) {
    const [callState, setCallState] = useState<CallState>("idle");
    const [error, setError] = useState<string | null>(null);

    // Auto-trigger call when popup opens (if we have phone)
    useEffect(() => {
        if (isOpen && phone && callState === "idle") {
            triggerCall();
        }
    }, [isOpen, phone]);

    const triggerCall = async () => {
        if (!phone) {
            setError("No phone number available");
            return;
        }

        setCallState("calling");
        setError(null);

        try {
            const response = await fetch("/api/retellai/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    firstName,
                    lastName,
                    email,
                    specialization: quizData?.specialization,
                    incomeGoal: quizData?.incomeGoal,
                    currentIncome: quizData?.currentIncome,
                    background: quizData?.background,
                    experience: quizData?.experience,
                    commitment: quizData?.commitment,
                    startTimeline: quizData?.startTimeline,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to initiate call");
            }

            const data = await response.json();
            console.log("[Call] Initiated:", data);

            setCallState("connected");

            // Auto-close after 5 seconds
            setTimeout(() => {
                onClose();
            }, 5000);

        } catch (err) {
            console.error("[Call Error]", err);
            setError("Unable to connect call. Please try again.");
            setCallState("error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Calling State */}
                    {callState === "calling" && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
                                <PhoneCall className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Calling You Now...
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Answer your phone! Sarah is calling to discuss your scholarship.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-emerald-600">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Connecting...</span>
                            </div>
                        </>
                    )}

                    {/* Connected State */}
                    {callState === "connected" && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Call Connected! 📞
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Sarah is on the line. Answer your phone!
                            </p>
                            <p className="text-sm text-gray-500">
                                This popup will close automatically...
                            </p>
                        </>
                    )}

                    {/* Error State */}
                    {callState === "error" && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                                <Phone className="w-10 h-10 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Connection Issue
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {error || "Unable to connect. Please try again."}
                            </p>
                            <button
                                onClick={triggerCall}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </>
                    )}

                    {/* Idle State (no phone) */}
                    {callState === "idle" && !phone && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                                <Phone className="w-10 h-10 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                No Phone Number
                            </h2>
                            <p className="text-gray-600 mb-4">
                                We need your phone number to call you. Please complete the quiz with your phone number.
                            </p>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t">
                    <p className="text-xs text-center text-gray-500">
                        📞 Calling from: +1 (646) 362-1121 — AccrediPro
                    </p>
                </div>
            </div>
        </div>
    );
}
