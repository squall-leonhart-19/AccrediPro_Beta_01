"use client";

import { useState, useCallback, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { initMetaTracking, trackLead } from "@/lib/meta-tracking";

// Standard password for freebie users - must match register-freebie API
const FREEBIE_PASSWORD = "Futurecoach2025";

// Country codes for phone field
const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", label: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada" },
  { code: "+44", country: "UK", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", label: "New Zealand" },
];

export default function FreeMiniDiplomaPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [suggestedEmail, setSuggestedEmail] = useState("");
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 58 });

  // Email validation states
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [emailError, setEmailError] = useState("");
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize Meta tracking on page load
  useEffect(() => {
    initMetaTracking();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            return { minutes: 14, seconds: 58 };
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

    // Combine phone with country code
    const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone.replace(/\D/g, "")}` : "";

    try {
      const res = await fetch("/api/auth/register-freebie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Track Lead event to Meta
        trackLead(formData.email, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          content_name: "Mini Diploma",
          phone: fullPhone,
        });

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

  // Success State
  if (success) {
    return (
      <div className="min-h-screen" style={{ background: "#FDF8F6", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2" style={{ borderColor: "#722F37" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#DEF7EC" }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#059669">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#1F2432" }}>You&apos;re In!</h2>
            <p className="mb-6" style={{ color: "#6B6E76" }}>
              Check your email for your login details. Your free Mini Diploma is waiting for you inside.
            </p>
            <div className="rounded-lg p-4 mb-6 text-left" style={{ background: "#FDF2F4" }}>
              <p className="text-sm" style={{ color: "#722F37" }}>
                <strong>Your login email:</strong> {formData.email}<br />
                <strong>Your password:</strong> Futurecoach2025
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #722F37, #5C262D)" }}
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FDF8F6", fontFamily: "Inter, system-ui, sans-serif" }}>
      <main className="max-w-[1160px] mx-auto px-5 py-5">
        {/* Logo Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: "#ECE8E2" }}>
          <Image
            src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
            alt="AccrediPro Academy"
            width={160}
            height={40}
            className="h-10 w-auto"
            unoptimized
          />
          <div className="flex items-center gap-2 text-sm mt-3 md:mt-0" style={{ color: "#6B6E76" }}>
            <span>FREE TRAINING • 9 LESSONS • CERTIFICATE INCLUDED</span>
          </div>
        </div>

        {/* Professional Header Banner */}
        <div
          className="text-center py-2.5 px-4 rounded-xl mb-6 text-white font-extrabold text-sm tracking-wide"
          style={{ background: "linear-gradient(135deg, #722F37, #8B3D47)" }}
        >
          🎓 Free Training for Healthcare Professionals & Career Changers
        </div>

        {/* Hero Section */}
        <section className="text-center py-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight max-w-[900px] mx-auto" style={{ color: "#722F37" }}>
            Burned Out From a Healthcare System That&apos;s Broken? Here&apos;s Your Way Out.
          </h1>

          <p className="text-base md:text-lg max-w-[820px] mx-auto mb-6" style={{ color: "#6B6E76", lineHeight: 1.6 }}>
            This free training reveals how a $72k burned-out ER nurse became a $144k/year Functional Medicine Practitioner — working just 3 days a week, actually helping people heal.
          </p>

          {/* Hero Bullets */}
          <div className="max-w-[700px] mx-auto text-left mb-6">
            <ul className="space-y-2">
              {[
                "9 lessons — complete in 2-3 hours at your own pace",
                "Real case study: Michelle's complete $72k → $144k transformation story",
                "The Functional Timeline — the #1 clinical tool practitioners use to find root causes",
                "Income calculator to see your realistic earning potential",
                "Official Mini Diploma certificate upon completion",
                "Clear next steps if you decide to pursue full certification",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#4A5568" }}>
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Bar */}
          <div
            className="flex justify-between items-center max-w-[780px] mx-auto rounded-xl p-4 mb-7"
            style={{ background: "white", border: "1px solid #ECE8E2", boxShadow: "0 12px 28px rgba(0,0,0,.07)" }}
          >
            {[
              { number: "10,000+", label: "Healthcare Professionals" },
              { number: "9", label: "Lessons" },
              { number: "$100-300/hr", label: "Practitioner Rate" },
            ].map((stat, i) => (
              <div key={i} className="text-center flex-1">
                <span className="block text-xl md:text-2xl font-black" style={{ color: "#722F37" }}>{stat.number}</span>
                <span className="text-[0.7rem] uppercase tracking-wide" style={{ color: "#6B6E76" }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Honest Callout Box */}
          <div
            className="max-w-[800px] mx-auto rounded-xl p-5 mb-7 text-left"
            style={{ background: "#FFF5EC", border: "2px solid #F4C976" }}
          >
            <h3 className="font-extrabold mb-2" style={{ color: "#92400E" }}>Let&apos;s be direct:</h3>
            <p className="text-sm" style={{ color: "#78350F" }}>
              This is not a &quot;get rich quick&quot; scheme. Building a Functional Medicine practice takes 3-6 months of real work.
              Our full certification program costs $997 — this free training will help you decide if that investment is right for you.
              No pressure, no obligation. But if you&apos;re not open to investing in your education eventually, this probably isn&apos;t for you.
            </p>
          </div>

          {/* Sarah Intro */}
          <div
            className="flex flex-col md:flex-row items-center gap-5 max-w-[900px] mx-auto rounded-xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #C9A85C, #B8944E)" }}
          >
            <Image
              src="https://i.ibb.co/5hzyDsg0/coaching-thumbnail.jpg"
              alt="Sarah"
              width={85}
              height={85}
              className="w-20 h-20 rounded-full border-3 object-cover flex-shrink-0"
              style={{ borderWidth: "3px", borderColor: "white" }}
              unoptimized
            />
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-2">Hi, I&apos;m Sarah — I&apos;ll be your guide for this training 💕</h3>
              <p className="text-sm opacity-95 leading-relaxed">
                I&apos;ve spent 20+ years in functional medicine and integrative health. I&apos;ve helped thousands of women escape the exact situation you might be in right now — burned out, frustrated with a system that doesn&apos;t work.
                I&apos;ll be honest with you: this isn&apos;t for everyone. If you&apos;re a healthcare professional ready to explore a different path — or a career changer serious about building something meaningful — this training will show you exactly what&apos;s possible.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility Section */}
        <section
          className="rounded-xl p-6 my-8 max-w-[1000px] mx-auto"
          style={{ background: "linear-gradient(135deg, #FFF5EC, #FFEFD5)", border: "2px solid #F4C976" }}
        >
          <h3 className="text-center font-extrabold text-lg md:text-xl mb-5" style={{ color: "#1F2432" }}>
            🎯 Is This Training Right for You?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #F4C976" }}>
              <h4 className="font-extrabold mb-3" style={{ color: "#722F37" }}>✓ This IS for you if:</h4>
              <ul className="space-y-2">
                {[
                  "You're a licensed healthcare professional (RN, NP, PA, RD, PharmD, PT, MD, DO) feeling burned out",
                  "You're 40+ and ready for a meaningful second career",
                  "You've seen conventional medicine fail — for yourself, patients, or loved ones",
                  "You're open to investing in professional certification ($997) if it's right for you",
                  "You can commit 2-3 hours to complete this training seriously",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#6B6E76" }}>
                    <span className="text-green-600 font-black">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #F4C976" }}>
              <h4 className="font-extrabold mb-3" style={{ color: "#D94B4B" }}>✗ This is NOT for you if:</h4>
              <ul className="space-y-2">
                {[
                  "You're looking for \"passive income\" or a get-rich-quick scheme",
                  "You're not willing to eventually invest in your education ($997)",
                  "You need income in the next 30 days — building a practice takes 3-6 months",
                  "You just want free content with no intention of taking action",
                  "You're happy with the current healthcare system",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#6B6E76" }}>
                    <span style={{ color: "#D94B4B" }} className="font-black">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Two Column Grid */}
        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-7 mt-8">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "#722F37" }}>
              What You&apos;ll Learn in the Mini Diploma
            </h2>
            <p className="mb-5" style={{ color: "#6B6E76", fontSize: "0.95rem" }}>
              9 lessons across 3 modules — complete at your own pace
            </p>

            {/* Module Cards */}
            <div className="space-y-4 mb-8">
              {[
                {
                  module: "Module 1",
                  title: "The 'Sick Care' Crisis & Your Second Act",
                  desc: "Why the healthcare system is failing 60% of Americans with chronic illness — and why YOUR life experience is exactly what's needed to fix it.",
                  lessons: ["The Sick Care Crisis", "The Rise of Functional Medicine", "Why YOU Are the Solution"],
                  time: "~37 minutes"
                },
                {
                  module: "Module 2",
                  title: "The Proof — Michelle's $144k Story",
                  desc: "Follow a real nurse who escaped the system. Her exact journey from $72,000/year and miserable to $144,000/year working 3 days a week.",
                  lessons: ["Meet Michelle", "The Turning Point", "The First Client Win"],
                  time: "~37 minutes"
                },
                {
                  module: "Module 3",
                  title: "The Education — The Functional Timeline",
                  desc: "Learn the #1 clinical tool that separates root-cause practitioners from symptom-chasers. You'll actually use this tool on yourself.",
                  lessons: ["The Problem with Conventional Medicine", "The Functional Timeline", "Your Turn: Create Your Own Timeline"],
                  time: "~41 minutes"
                },
              ].map((mod, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: "#FFF9F3", border: "1px solid #F1E7D8" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: "#722F37", color: "white" }}>{mod.module}</span>
                    <span className="text-xs" style={{ color: "#6B6E76" }}>{mod.time}</span>
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: "#1F2432" }}>{mod.title}</h4>
                  <p className="text-sm mb-3" style={{ color: "#6B6E76" }}>{mod.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {mod.lessons.map((lesson, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded" style={{ background: "#FDF2F4", color: "#722F37" }}>
                        • {lesson}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <h3 className="text-xl font-extrabold mb-4" style={{ color: "#3C4B5A" }}>
              What Students Are Saying
            </h3>
            <div className="space-y-4">
              {[
                { quote: "I've been a nurse for 18 years. I was completely burned out — thinking about leaving healthcare entirely. This training showed me there's another way to use my skills. The case study in Module 2 made me cry. I finally see a future I'm excited about.", name: "Sarah J., RN", role: "Registered Nurse, 18 years" },
                { quote: "I'm 52 and was worried I was too old to start something new. This training showed me that my age and life experience are actually my biggest advantages. Women my age WANT to work with someone who understands them.", name: "Jennifer K.", role: "Career Changer, Former Marketing Executive" },
                { quote: "I was skeptical. I've bought wellness courses before that were all fluff. This was different — real clinical tools, real case studies, real numbers. No hype. Sarah's approach is refreshingly honest.", name: "Amanda T., PharmD", role: "Pharmacist" },
              ].map((t, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: "#FDF2F4", border: "1px solid #E8A0A8" }}>
                  <p className="italic mb-3" style={{ color: "#4A5568" }}>&ldquo;{t.quote}&rdquo;</p>
                  <div className="font-extrabold" style={{ color: "#1F2432" }}>{t.name}</div>
                  <div className="text-sm" style={{ color: "#6B6E76" }}>{t.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:sticky lg:top-5">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #FDF8F6 100%)",
                border: "2px solid #722F37",
                boxShadow: "0 16px 48px rgba(114,47,55,0.12)"
              }}
            >
              {/* Form Header */}
              <div className="text-center mb-5 pb-5 border-b-2" style={{ borderColor: "#ECE8E2" }}>
                <h3 className="text-xl font-black mb-1" style={{ color: "#722F37" }}>Request Your Free Access</h3>
                <p className="text-sm" style={{ color: "#6B6E76" }}>100% Free • No Credit Card Required</p>

                {/* Urgency Banner */}
                <div
                  className="rounded-lg p-2.5 mt-3 text-center"
                  style={{ background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)", border: "2px solid #E57373" }}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wide mb-1" style={{ color: "#C62828" }}>
                    🔥 Limited Spots Available
                  </div>
                  <div className="text-xl font-black font-mono" style={{ color: "#B71C1C" }}>
                    {String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Value Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {["✓ 100% Free", "✓ Certificate", "✓ No Experience Required"].map((pill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: "#FDF2F4", border: "1px solid #E8A0A8", color: "#722F37" }}
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1F2432" }}>First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                      style={{ borderColor: "#D1D5DB" }}
                      placeholder="Sarah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1F2432" }}>Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                      style={{ borderColor: "#D1D5DB" }}
                      placeholder="Johnson"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1F2432" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none ${emailStatus === "valid" ? "border-green-500 bg-green-50" :
                        emailStatus === "invalid" ? "border-red-500 bg-red-50" : ""
                      }`}
                    style={{ borderColor: emailStatus === "idle" ? "#D1D5DB" : undefined }}
                    placeholder="sarah@example.com"
                  />

                  {/* Email Status */}
                  {emailStatus === "checking" && (
                    <p className="text-sm mt-1" style={{ color: "#6B6E76" }}>Verifying email...</p>
                  )}
                  {emailStatus === "valid" && (
                    <p className="text-sm mt-1 text-green-600">Email verified!</p>
                  )}
                  {emailStatus === "invalid" && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600">{emailError}</p>
                      {suggestedEmail && (
                        <p className="text-sm mt-1" style={{ color: "#1F2432" }}>
                          Did you mean:{" "}
                          <button
                            type="button"
                            onClick={useSuggestedEmail}
                            className="font-semibold hover:underline"
                            style={{ color: "#722F37" }}
                          >
                            {suggestedEmail}
                          </button>
                          ?
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone Field with Country Code */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1F2432" }}>
                    Phone <span className="font-normal text-gray-500">(Optional — for text reminders)</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="px-3 py-3 rounded-lg border transition-all focus:outline-none w-28"
                      style={{ borderColor: "#D1D5DB" }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.country}-${c.code}`} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none"
                      style={{ borderColor: "#D1D5DB" }}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg p-3 text-sm" style={{ background: "#FFF5F5", color: "#D94B4B" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || loggingIn || emailStatus === "invalid" || emailStatus === "checking"}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: loading || loggingIn || emailStatus === "invalid" || emailStatus === "checking"
                      ? "#D1D5DB"
                      : "linear-gradient(135deg, #722F37, #5C262D)"
                  }}
                >
                  {loggingIn
                    ? "Logging you in..."
                    : loading
                      ? "Creating Your Account..."
                      : emailStatus === "checking"
                        ? "Verifying Email..."
                        : "Request Free Access →"}
                </button>

                <p className="text-center text-xs" style={{ color: "#6B6E76" }}>
                  🔒 Secure & Private • Instant Access After Signup
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Income Disclaimer */}
        <p className="text-center text-xs mt-8 max-w-[800px] mx-auto" style={{ color: "#9A9EA6" }}>
          *Income figures represent results of successful graduates who completed our full certification program and built active practices.
          Results vary based on effort, location, and business development. The free Mini Diploma provides education only — earning potential
          comes from completing full certification and building a client base over 3-6+ months.
        </p>

        {/* Footer */}
        <p className="text-center text-sm mt-8 pt-8 border-t" style={{ color: "#9A9EA6", borderColor: "#ECE8E2" }}>
          © 2025 AccrediPro Academy • <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link> • <Link href="/terms" className="hover:underline">Terms of Service</Link> • Questions? Email info@coach.accredipro.academy
        </p>
      </main>
    </div>
  );
}
