"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, Smartphone } from "lucide-react";
import Image from "next/image";

export default function TicketFeedbackPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const ticketNumber = params.ticketNumber as string;
    const initialRating = searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : 0;

    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (rating === 0) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/tickets/${ticketNumber}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    ratingComment: comment,
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to submit feedback");
            }
        } catch (err) {
            console.error("Feedback submit error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-[#722F37]">Thank You!</CardTitle>
                        <CardDescription className="text-lg">
                            Your feedback helps us improve our support.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <p className="text-gray-500 mb-6">You can now close this window.</p>
                        <Button variant="outline" onClick={() => window.close()}>
                            Close Window
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="mb-8 relative w-48 h-12">
                {/* Placeholder for Logo - assuming one exists in public layout or similar */}
                {/* <Image src="/logo.png" fill alt="AccrediPro" className="object-contain" /> */}
                <h1 className="text-2xl font-serif font-bold text-[#722F37]">AccrediPro</h1>
            </div>

            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#722F37]">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">How was our support?</CardTitle>
                    <CardDescription>
                        Ticket #{ticketNumber}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= rating ? "fill-yellow-400 text-yellow-500" : "fill-gray-100 text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="text-center text-sm font-medium text-gray-500 min-h-[20px]">
                        {rating === 5 && "Excellent!"}
                        {rating === 4 && "Great!"}
                        {rating === 3 && "Average"}
                        {rating === 2 && "Poor"}
                        {rating === 1 && "Very Poor"}
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Any additional comments? (Optional)
                        </label>
                        <Textarea
                            placeholder="Tell us what went well or how we can improve..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="resize-none min-h-[100px]"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="w-full bg-[#722F37] hover:bg-[#5a2436] text-white py-6 text-lg"
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </CardContent>
            </Card>

            <div className="mt-8 text-center text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved.
            </div>
        </div>
    );
}
