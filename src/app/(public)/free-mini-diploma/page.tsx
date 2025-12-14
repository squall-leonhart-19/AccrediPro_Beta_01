"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

// Standard password for freebie users - must match register-freebie API
const FREEBIE_PASSWORD = "Futurecoach2025";

export default function FreeMiniDiplomaPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [suggestedEmail, setSuggestedEmail] = useState("");

  // Email validation states
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [emailError, setEmailError] = useState("");
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced email validation
  const validateEmail = useCallback(async (email: string) => {
    if (!email || email.length < 5 || !email.includes("@")) {
      setEmailStatus("idle");
      setEmailError("");
      return;
    }

    setEmailStatus("checking");
    setEmailError("");

    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.isValid) {
        setEmailStatus("valid");
        setEmailError("");
        setSuggestedEmail("");
      } else {
        setEmailStatus("invalid");
        setEmailError(data.reason || "This email address is not valid.");
        if (data.suggestedEmail) {
          setSuggestedEmail(data.suggestedEmail);
        }
      }
    } catch {
      // On error, allow submission (don't block user)
      setEmailStatus("idle");
      setEmailError("");
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    setEmailStatus("idle");
    setEmailError("");
    setSuggestedEmail("");

    // Clear previous timeout
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    // Debounce: wait 800ms after user stops typing
    if (newEmail.includes("@") && newEmail.length >= 5) {
      const timeout = setTimeout(() => {
        validateEmail(newEmail);
      }, 800);
      setCheckTimeout(timeout);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if email is invalid
    if (emailStatus === "invalid") {
      setError(emailError || "Please fix the email address before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register-freebie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Registration successful - auto-login the user
        setLoading(false);
        setLoggingIn(true);

        // If existing user, just redirect to login page
        if (data.isExisting) {
          setSuccess(true);
          setLoggingIn(false);
          return;
        }

        // New user - auto-login with credentials
        const loginResult = await signIn("credentials", {
          email: formData.email.toLowerCase().trim(),
          password: FREEBIE_PASSWORD,
          redirect: false,
        });

        if (loginResult?.ok) {
          // Redirect to dashboard
          window.location.href = "/dashboard";
        } else {
          // Login failed, show success page with manual login option
          setSuccess(true);
          setLoggingIn(false);
        }
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        if (data.suggestedEmail) {
          setSuggestedEmail(data.suggestedEmail);
        } else {
          setSuggestedEmail("");
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
      setLoggingIn(false);
    }
  };

  const useSuggestedEmail = () => {
    setFormData({ ...formData, email: suggestedEmail });
    setSuggestedEmail("");
    setEmailError("");
    setEmailStatus("idle");
    setError("");
    // Re-validate the suggested email
    setTimeout(() => validateEmail(suggestedEmail), 100);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-burgundy-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You're In!</h2>
          <p className="text-gray-600 mb-6">
            Check your email for your login details. Your free Mini Diploma is waiting for you inside.
          </p>
          <div className="bg-burgundy-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-burgundy-800">
              <strong>Your login email:</strong> {formData.email}<br />
              <strong>Your password:</strong> Futurecoach2025
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block w-full bg-burgundy-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-burgundy-700 transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
            alt="AccrediPro Academy"
            className="h-10 w-auto"
          />
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">4,200+ students</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Benefits */}
          <div>
            <span className="inline-block bg-burgundy-100 text-burgundy-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              100% FREE TRAINING
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Get Your Free<br />
              <span className="text-burgundy-600">Mini Diploma</span><br />
              in Functional Medicine
            </h1>
            <p className="text-lg text-gray-600 mb-6 md:mb-8">
              Start your journey into functional medicine with our comprehensive mini-course.
              Join 4,200+ women learning the foundations that are transforming healthcare.
            </p>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Complete Video Training</h3>
                  <p className="text-gray-600 text-sm md:text-base">Step-by-step lessons covering functional medicine essentials</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Certificate of Completion</h3>
                  <p className="text-gray-600 text-sm md:text-base">Earn your official Mini Diploma badge upon finishing</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lifetime Access</h3>
                  <p className="text-gray-600 text-sm md:text-base">Learn at your own pace, forever</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-burgundy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Voice Message from Sarah</h3>
                  <p className="text-gray-600 text-sm md:text-base">Your coach will personally welcome you with an audio message</p>
                </div>
              </div>
            </div>

            {/* Social Proof - Mobile Hidden */}
            <div className="hidden md:block mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Trusted by health professionals worldwide</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">4.9/5 from 847 reviews</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white text-center py-2 px-4 rounded-lg mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 rounded-t-2xl">
              <p className="text-sm font-medium">Limited Time: Get instant access today</p>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Start Your Journey Free</h2>
              <p className="text-gray-600 mt-2">Enter your details for instant access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                    placeholder="Sarah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                    placeholder="Johnson"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 ${
                      emailStatus === "valid"
                        ? "border-green-500 bg-green-50"
                        : emailStatus === "invalid"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                    }`}
                    placeholder="sarah@example.com"
                  />
                  {/* Status indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailStatus === "checking" && (
                      <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {emailStatus === "valid" && (
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {emailStatus === "invalid" && (
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Email validation feedback */}
                {emailStatus === "checking" && (
                  <p className="text-sm text-gray-500 mt-1">Verifying email...</p>
                )}
                {emailStatus === "valid" && (
                  <p className="text-sm text-green-600 mt-1">Email verified!</p>
                )}
                {emailStatus === "invalid" && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">{emailError}</p>
                    {suggestedEmail && (
                      <p className="text-sm text-gray-700 mt-1">
                        Did you mean:{" "}
                        <button
                          type="button"
                          onClick={useSuggestedEmail}
                          className="text-burgundy-600 font-semibold hover:underline"
                        >
                          {suggestedEmail}
                        </button>
                        ?
                      </p>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || loggingIn || emailStatus === "invalid" || emailStatus === "checking"}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  loading || loggingIn || emailStatus === "invalid" || emailStatus === "checking"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-burgundy-600 text-white hover:bg-burgundy-700"
                }`}
              >
                {loggingIn
                  ? "Logging you in..."
                  : loading
                    ? "Creating Your Account..."
                    : emailStatus === "checking"
                      ? "Verifying Email..."
                      : "Get Free Access Now"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy.
                We'll also send you helpful emails about functional medicine.
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-burgundy-600 font-semibold hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-sm font-medium">No Spam, Ever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 9.172a4 4 0 015.656 0L12 10.343l1.172-1.171a4 4 0 115.656 5.656L12 21.656l-6.828-6.828a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Instant Access</span>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-8 max-w-2xl mx-auto text-center">
            <blockquote className="text-gray-600 italic">
              &ldquo;This mini diploma opened my eyes to functional medicine. Sarah&apos;s personal approach made me feel supported from day one.&rdquo;
            </blockquote>
            <p className="mt-3 text-sm text-gray-500">- Jennifer M., Certified Health Coach</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
