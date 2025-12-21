"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle2, ArrowRight, Loader2, GraduationCap, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExitPopupProps {
    onClose: () => void;
    isOpen: boolean;
}

export function FMExitPopup({ onClose, isOpen }: ExitPopupProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/fm-preview/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // Redirect to dashboard on success
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                    <X className="h-4 w-4 text-slate-500" />
                </button>

                {/* Header with Sarah */}
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-6 text-white">
                    <div className="flex items-start gap-4">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah Mitchell"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg shrink-0"
                        />
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Wait! Get Module 0 & 1 FREE
                            </h2>
                            <p className="text-burgundy-100 text-sm leading-relaxed">
                                Before you go, let me give you the first 2 modules completely free.
                                See for yourself why 2,000+ healthcare professionals chose this path.
                            </p>
                            <p className="text-white/80 text-sm mt-2 font-medium">— Sarah Mitchell</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100 outline-none transition-all"
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100 outline-none transition-all"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                                Phone Number (US/Canada)
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 font-medium">
                                    +1
                                </span>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100 outline-none transition-all"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Creating Your Access...
                            </>
                        ) : (
                            <>
                                Get Free Access
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </>
                        )}
                    </Button>

                    {/* Benefits */}
                    <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="h-4 w-4 text-olive-500 shrink-0" />
                            <span>Instant access to Module 0 & 1</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="h-4 w-4 text-olive-500 shrink-0" />
                            <span>Earn your first mini-certificate</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="h-4 w-4 text-olive-500 shrink-0" />
                            <span>No credit card required</span>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-burgundy-500" />
                                <span>2,000+ enrolled</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <GraduationCap className="h-4 w-4 text-burgundy-500" />
                                <span>9 accreditations</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-burgundy-500" />
                                <span>~2 hours</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Hook to detect exit intent
export function useExitIntent(delay: number = 2000) {
    const [showPopup, setShowPopup] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if popup was already shown in this session
        const alreadyShown = sessionStorage.getItem("fm_exit_popup_shown");
        if (alreadyShown) {
            setHasShown(true);
            return;
        }

        // Wait for delay before enabling exit intent
        const timeout = setTimeout(() => {
            const handleMouseLeave = (e: MouseEvent) => {
                // Only trigger if mouse leaves from the top of the page
                if (e.clientY <= 0 && !hasShown) {
                    setShowPopup(true);
                    setHasShown(true);
                    sessionStorage.setItem("fm_exit_popup_shown", "true");
                    document.removeEventListener("mouseleave", handleMouseLeave);
                }
            };

            document.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                document.removeEventListener("mouseleave", handleMouseLeave);
            };
        }, delay);

        return () => clearTimeout(timeout);
    }, [delay, hasShown]);

    const closePopup = () => setShowPopup(false);
    const openPopup = () => setShowPopup(true);

    return { showPopup, closePopup, openPopup, hasShown };
}
