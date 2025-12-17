"use client";

import { useState, useCallback, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { initMetaTracking, trackLead } from "@/lib/meta-tracking";

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

    try {
      const res = await fetch("/api/auth/register-freebie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Track Lead event to Meta
        trackLead(formData.email, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          content_name: "Mini Diploma",
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
            <svg className="w-4 h-4" fill="#F59E0B" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span><strong>4,200+</strong> students enrolled</span>
          </div>
        </div>

        {/* Professional Header Banner */}
        <div
          className="text-center py-2.5 px-4 rounded-xl mb-6 text-white font-extrabold text-sm tracking-wide"
          style={{ background: "linear-gradient(135deg, #722F37, #8B3D47)" }}
        >
          🎓 FREE FUNCTIONAL MEDICINE MINI DIPLOMA • OPEN TO ALL • LIMITED SPOTS
        </div>

        {/* Hero Section */}
        <section className="text-center py-5">
          <span
            className="inline-block rounded-full px-4 py-2 font-extrabold text-sm mb-4"
            style={{ background: "linear-gradient(180deg, #FDF2F4, #FAE5E8)", border: "1px solid #E8A0A8", color: "#722F37" }}
          >
            🎓 NO EXPERIENCE REQUIRED • CAREER-CHANGERS WELCOME
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight max-w-[900px] mx-auto" style={{ color: "#722F37" }}>
            Free Functional Medicine Mini Diploma — Open Enrollment
          </h1>

          <p className="text-base md:text-lg max-w-[820px] mx-auto mb-6" style={{ color: "#6B6E76", lineHeight: 1.6 }}>
            Discover the Foundations of Root-Cause Healing in 3 Days. Earn Your Mini Diploma • Pass the Final Exam • Unlock Your Graduation Pathway.
            Complete in 90 minutes or 3 days.
          </p>

          {/* Credentials Bar */}
          <div className="flex flex-wrap justify-center gap-2 max-w-[800px] mx-auto mb-6">
            {["✓ No Experience Required", "✓ Official Mini Diploma", "✓ 3-Day Training", "✓ 100% Free"].map((item, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: "#FDF2F4", border: "1px solid #E8A0A8", color: "#722F37" }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Stats Bar */}
          <div
            className="flex justify-between items-center max-w-[780px] mx-auto rounded-xl p-4 mb-7"
            style={{ background: "white", border: "1px solid #ECE8E2", boxShadow: "0 12px 28px rgba(0,0,0,.07)" }}
          >
            {[
              { number: "10,000+", label: "Students Enrolled" },
              { number: "$3k-$10k", label: "Potential Monthly" },
              { number: "90m", label: "Time to Complete" },
            ].map((stat, i) => (
              <div key={i} className="text-center flex-1">
                <span className="block text-xl md:text-2xl font-black" style={{ color: "#722F37" }}>{stat.number}</span>
                <span className="text-[0.7rem] uppercase tracking-wide" style={{ color: "#6B6E76" }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Certificate Preview */}
          <div
            className="max-w-[740px] mx-auto rounded-2xl overflow-hidden mb-7"
            style={{ border: "1px solid #ECE8E2", boxShadow: "0 20px 50px rgba(114,47,55,0.15)" }}
          >
            <div
              className="p-6 md:p-8 text-center relative"
              style={{ background: "linear-gradient(135deg, #fdfbf7, #fff9f0)" }}
            >
              {/* Gold border */}
              <div className="absolute inset-2 border-2 rounded-lg pointer-events-none" style={{ borderColor: "#C9A85C" }} />

              <Image
                src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
                alt="AccrediPro"
                width={120}
                height={30}
                className="mx-auto mb-4"
                unoptimized
              />
              <div className="text-[0.7rem] uppercase tracking-widest mb-2" style={{ color: "#888" }}>AccrediPro Academy</div>
              <div className="text-2xl font-extrabold mb-1" style={{ color: "#722F37" }}>Mini Diploma</div>
              <div className="text-sm mb-4" style={{ color: "#666" }}>This is to certify that</div>
              <div className="text-2xl font-bold italic mb-3" style={{ color: "#333" }}>Your Name Here</div>
              <div className="text-sm mb-5" style={{ color: "#555" }}>
                Has successfully completed the<br /><strong>Functional Medicine Foundations</strong><br />Mini Diploma Program
              </div>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #F4D35E, #C9A85C)", boxShadow: "0 4px 12px rgba(201,168,92,0.3)" }}
              >
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t gap-3" style={{ borderColor: "#E5E1D8" }}>
                <div className="text-left text-xs" style={{ color: "#888" }}>
                  <strong className="block" style={{ color: "#333" }}>Date Issued</strong>
                  December 2025
                </div>
                <div className="text-right text-xs" style={{ color: "#888" }}>
                  <strong className="block" style={{ color: "#333" }}>Certificate ID</strong>
                  #MD-XXXXX
                </div>
              </div>
            </div>
          </div>

          {/* Sarah Intro - Gold Background */}
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
              <h3 className="text-lg font-bold mb-2">Hi, I&apos;m Sarah — your mentor for the next 3 days 💕</h3>
              <p className="text-sm opacity-95 leading-relaxed">
                I&apos;ve helped 10,000+ students from all backgrounds discover the power of Functional Medicine. Whether you&apos;re a clinician or a health-seeker, I&apos;ll guide you through the root-cause framework and show you how to turn your passion into a thriving career.
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
            🎯 Who This Mini Diploma Is For
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #F4C976" }}>
              <h4 className="font-extrabold mb-3" style={{ color: "#722F37" }}>✓ This IS for you if:</h4>
              <ul className="space-y-2">
                {[
                  "Anyone passionate about health & healing",
                  "Women exploring a new purpose",
                  "People considering a career in wellness",
                  "Clinicians (RN, NP, PA, RD, PharmD, PT)",
                  "Those wanting to earn $500–$3,000/month helping others",
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
                  "People who refuse to study",
                  "People expecting overnight results without effort",
                  "Cynics and skeptics",
                  "People who don't care about wellness",
                  "Those looking for \"get rich quick\" schemes",
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
              What You&apos;ll Learn (3-Day Training • 90 Minutes Total)
            </h2>
            <p className="mb-5" style={{ color: "#6B6E76", fontSize: "0.95rem" }}>
              If you&apos;re passionate about healing, wellness, and helping others, this Mini Diploma gives you a real, accredited introduction to Functional Medicine. Learn the exact process behind $1,500–$3,000 client programs.
            </p>

            {/* Learning Items */}
            <ul className="space-y-3 mb-8">
              {[
                { title: "Day 1: Functional Medicine Foundations", desc: "Systems biology • FM matrix • Root cause vs symptoms • How practitioners uncover hidden causes of fatigue, gut issues, hormone imbalance & more." },
                { title: "Day 2: Case Studies & Clinical Pattern Recognition", desc: "Real case walk-through (Michelle, 42) • Gut-hormone-stress loop • How FM practitioners transform clients ethically & effectively." },
                { title: "Day 3: Your Practitioner Pathway & Income Potential", desc: "How FM practitioners earn $3K–$10K/month • 12-week transformation program model • The 3 certification pathways • Your next academic steps." },
                { title: "Earn Your Mini Diploma + Academic Credits", desc: "Score 92–96 points on the final exam to unlock your Mini Diploma." },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: "#FFF9F3", border: "1px solid #F1E7D8" }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                    style={{ background: "#722F37" }}
                  >
                    ✓
                  </span>
                  <div>
                    <div className="font-bold mb-1" style={{ color: "#1F2432" }}>{item.title}</div>
                    <div className="text-sm" style={{ color: "#666" }}>{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-extrabold mb-4" style={{ color: "#3C4B5A" }}>
              🎓 What Happens After You Enroll
            </h3>
            <p className="mb-5" style={{ color: "#6B6E76", fontSize: "0.95rem" }}>
              You&apos;ll get instant access to all 3 training modules. Complete them at your own pace, earn your Mini Diploma, and unlock your Graduation Training to see your certification pathway.
            </p>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="rounded-xl p-5" style={{ background: "#FDF2F4", border: "1px solid #E8A0A8" }}>
                <p className="italic mb-3" style={{ color: "#4A5568" }}>
                  &ldquo;I always knew I wanted to help people heal, but I didn&apos;t know where to start. This Mini Diploma opened my eyes to the science of Functional Medicine. I learned more in 3 days than I did in years of reading blogs. I&apos;m now on my way to becoming a certified coach!&rdquo;
                </p>
                <div className="font-extrabold" style={{ color: "#1F2432" }}>Amanda T.</div>
                <div className="text-sm" style={{ color: "#6B6E76" }}>Wellness Enthusiast & Career Changer</div>
              </div>
              <div className="rounded-xl p-5" style={{ background: "#FDF2F4", border: "1px solid #E8A0A8" }}>
                <p className="italic mb-3" style={{ color: "#4A5568" }}>
                  &ldquo;As a nurse, I was burnt out. I took this free intensive just to see if there was another way. The &apos;Day 2&apos; case study blew my mind—it showed me exactly how to treat the whole person, not just symptoms. I&apos;m so excited about my future again.&rdquo;
                </p>
                <div className="font-extrabold" style={{ color: "#1F2432" }}>Sarah J., RN</div>
                <div className="text-sm" style={{ color: "#6B6E76" }}>Registered Nurse & Aspiring Coach</div>
              </div>
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
                <h3 className="text-xl font-black mb-1" style={{ color: "#722F37" }}>Start the Mini Diploma</h3>
                <p className="text-sm" style={{ color: "#6B6E76" }}>100% Free • Instant Access</p>

                {/* Urgency Banner */}
                <div
                  className="rounded-lg p-2.5 mt-3 text-center"
                  style={{ background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)", border: "2px solid #E57373" }}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wide mb-1" style={{ color: "#C62828" }}>
                    🔥 Enrollment Closing Soon
                  </div>
                  <div className="text-xl font-black font-mono" style={{ color: "#B71C1C" }}>
                    {String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Value Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {["✓ 100% Free", "✓ Certificate", "✓ No Experience", "✓ Self-Paced"].map((pill, i) => (
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
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none ${
                      emailStatus === "valid" ? "border-green-500 bg-green-50" :
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
                        : "Get Free Instant Access"}
                </button>

                <p className="text-center text-xs" style={{ color: "#6B6E76" }}>
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                  We&apos;ll also send you helpful emails about functional medicine.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <p className="text-center text-sm mt-12 pt-8 border-t" style={{ color: "#9A9EA6", borderColor: "#ECE8E2" }}>
          © 2025 AccrediPro Academy • Functional Medicine Mini Diploma • Questions? Email info@coach.accredipro.academy
        </p>
      </main>
    </div>
  );
}
