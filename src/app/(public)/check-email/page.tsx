"use client";

import { useState } from "react";

export default function CheckEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isValid: boolean;
    result: string;
    reason?: string;
    suggestedEmail?: string;
  } | null>(null);

  const checkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        isValid: false,
        result: "error",
        reason: "Connection error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
          <p className="text-gray-600 mt-2">
            Verify your email address before signing up
          </p>
        </div>

        <form onSubmit={checkEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setResult(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
              placeholder="your@email.com"
            />
          </div>

          {/* Result Display */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.isValid
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {result.isValid ? (
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Email looks good!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">
                      {result.reason || "This email address is not valid. Please check and try again."}
                    </span>
                  </div>
                  {result.suggestedEmail && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <span className="text-gray-700">Did you mean: </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(result.suggestedEmail!);
                          setResult(null);
                        }}
                        className="text-burgundy-600 font-semibold hover:underline"
                      >
                        {result.suggestedEmail}
                      </button>
                      <span className="text-gray-700">?</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-burgundy-600 text-white hover:bg-burgundy-700"
            }`}
          >
            {loading ? "Checking..." : "Check Email"}
          </button>
        </form>

        {result?.isValid && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <a
              href="/free-mini-diploma"
              className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue to Sign Up
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
