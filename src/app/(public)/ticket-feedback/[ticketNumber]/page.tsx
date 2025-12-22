"use client";

import { useState, use } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TicketFeedbackPage({
  params,
}: {
  params: Promise<{ ticketNumber: string }>;
}) {
  const { ticketNumber } = use(params);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/tickets/${ticketNumber}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit rating");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6B2C40] to-[#4a1f2d] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve our support.
          </p>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-8 h-8",
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                )}
              />
            ))}
          </div>
          <a
            href="https://learn.accredipro.academy"
            className="text-[#6B2C40] hover:underline font-medium"
          >
            Return to AccrediPro Academy
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6B2C40] to-[#4a1f2d] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How was your support experience?
          </h1>
          <p className="text-gray-600">
            Ticket #{ticketNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-colors",
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  )}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-gray-600">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}

          {/* Email Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email you used for the ticket"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={3}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-[#6B2C40] hover:bg-[#5a2436]"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your feedback is anonymous and helps us improve.
        </p>
      </div>
    </div>
  );
}
