
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailParam);
    const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
    const [message, setMessage] = useState("");

    // Auto-fill from URL if present
    useEffect(() => {
        if (emailParam) setEmail(emailParam);
    }, [emailParam]);

    const handleUnsubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("LOADING");
        setMessage("");

        try {
            const res = await fetch("/api/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus("SUCCESS");
            } else {
                setStatus("ERROR");
                setMessage("Something went wrong. Please try again.");
            }
        } catch (err) {
            setStatus("ERROR");
            setMessage("Failed to connect. Please check your internet.");
        }
    };

    if (status === "SUCCESS") {
        return (
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribed Successfully</h1>
                <p className="text-gray-600 mb-8">
                    You (`{email}`) have been removed from our mailing list. You will no longer receive marketing emails from AccrediPro Academy.
                </p>
                <Link
                    href="/login"
                    className="inline-block bg-[#722F37] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8B3A42] transition-colors"
                >
                    Return to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
                <img
                    src="/ASI_LOGO.png"
                    alt="AccrediPro"
                    className="h-12 mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900">Unsubscribe</h1>
                <p className="text-gray-500 mt-2">
                    Enter your email address to stop receiving updates.
                </p>
            </div>

            <form onSubmit={handleUnsubscribe} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#722F37] focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {status === "ERROR" && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "LOADING"}
                    className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === "LOADING" ? "Processing..." : "Unsubscribe Me"}
                </button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-400">
                You can always resubscribe by creating a new account or contacting support.
            </p>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
                <UnsubscribeContent />
            </Suspense>
        </div>
    );
}
