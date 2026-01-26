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

const LICENSE_TYPES = [
  "RN",
  "PA",
  "NP",
  "PharmD",
  "PT",
  "OT",
  "RD",
  "LCSW",
  "DC",
  "LMT",
  "MD/DO",
  "Other",
];

const EMPLOYMENT_STATUS = [
  "Employed Full-Time",
  "Employed Part-Time",
  "Self-Employed/Private Practice",
  "Other",
];

const GOALS = [
  "Add side income to current job",
  "Transition to full-time coaching eventually",
  "Expand services in existing practice",
  "Explore if this path is right for me",
];

export default function FreeMiniDiplomaPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    licenseType: "",
    otherLicenseType: "",
    employmentStatus: "",
    goal: "",
    confirmLicense: false,
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

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Initialize Meta tracking on page load
  useEffect(() => {
    initMetaTracking();
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

    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    if (newEmail.includes("@") && newEmail.length >= 5) {
      const timeout = setTimeout(() => {
        validateEmail(newEmail);
      }, 800);
      setCheckTimeout(timeout);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailStatus === "invalid") {
      setError(emailError || "Please fix the email address before continuing.");
      return;
    }

    if (!formData.confirmLicense) {
      setError("Please confirm that you hold an active healthcare license.");
      return;
    }

    setLoading(true);
    setError("");

    const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone.replace(/\D/g, "")}` : "";

    try {
      const res = await fetch("/api/auth/register-freebie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          miniDiplomaCategory: "functional-medicine-clinician",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        trackLead(formData.email, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          content_name: "Mini Diploma - Licensed Clinician",
          phone: fullPhone,
        });

        setLoading(false);

        // Redirect directly to Module 1 to maximize starting rate
        // Credentials are sent via email
        window.location.href = "/my-mini-diploma";
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#1F2432" }}>Application Approved! 🎉</h2>
            <p className="mb-6" style={{ color: "#6B6E76" }}>
              Welcome to the December Cohort. Check your email for your access credentials.
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
              Access Your Training →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const faqs = [
    { q: "What can I legally do with this certification?", a: "This certification qualifies you to work as a Functional Medicine Health Coach — which means educating clients, providing lifestyle guidance, and supporting their health journey. You cannot diagnose, prescribe, or treat medical conditions (unless your underlying license allows it). Day 1 covers scope of practice in detail." },
    { q: "How is this different from IIN, FMCA, or IFM certifications?", a: "Those programs range from $3,000-$15,000+ and take 6-12 months. This intensive is designed specifically for licensed clinicians who already have clinical foundations. You don't need to relearn basic nutrition or health coaching — you need functional medicine frameworks and business strategy." },
    { q: "I'm a physician (MD/DO). Is this appropriate for me?", a: "Yes. Several MDs and DOs have completed this program. The coaching certification allows you to offer services outside insurance-based medicine — cash-pay consultations, longer appointments, root-cause protocols." },
    { q: "How long do I have to complete the intensive?", a: "There's no deadline. Once approved, you have lifetime access. Most participants complete it within 1-2 weeks." },
    { q: "What if I apply and I'm not approved?", a: "If your application doesn't meet our requirements (no active license, currently unemployed, etc.), we'll let you know and suggest alternative resources." },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#FDF8F6", fontFamily: "Inter, system-ui, sans-serif" }}>
      <main className="max-w-[1160px] mx-auto px-5 py-5">
        {/* Top Bar */}
        <div
          className="text-center py-2.5 px-4 rounded-xl mb-6 text-white font-bold text-sm tracking-wide"
          style={{ background: "linear-gradient(135deg, #722F37, #8B3D47)" }}
        >
          LICENSED HEALTHCARE PROFESSIONALS ONLY • 3-DAY INTENSIVE CERTIFICATION • 7 SPOTS REMAINING FOR DECEMBER COHORT
        </div>

        {/* Logo Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: "#ECE8E2" }}>
          <Image
            src="https://assets.accredipro.academy/migrated/Senza-titolo-Logo-1.png"
            alt="AccrediPro Academy"
            width={160}
            height={40}
            className="h-10 w-auto"
            unoptimized
          />
          <div className="flex items-center gap-2 text-sm mt-3 md:mt-0" style={{ color: "#6B6E76" }}>
            <span>🎓 Free Certification for RNs, PAs, NPs, PharmDs, PTs & Licensed Clinicians</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center py-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight max-w-[900px] mx-auto" style={{ color: "#722F37" }}>
            Add $5,000-$10,000/Month to Your Clinical Income — Without Leaving Your Current Position
          </h1>

          <p className="text-base md:text-lg max-w-[820px] mx-auto mb-6" style={{ color: "#6B6E76", lineHeight: 1.7 }}>
            This free 3-day intensive teaches licensed healthcare professionals how to build a functional medicine coaching practice alongside your existing career. Complete in 90 minutes total. Earn an internationally accredited certificate. Start seeing private clients within 60-90 days.
          </p>

          {/* Credentials Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <span className="text-sm font-semibold" style={{ color: "#6B6E76" }}>Accredited By:</span>
            {["CMA", "IPHM", "IAOTH", "CPD Certified"].map((badge, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#F4E9C8", color: "#92400E" }}>
                {badge}
              </span>
            ))}
          </div>

          {/* Stats Bar */}
          <div
            className="flex flex-col md:flex-row justify-between items-center max-w-[850px] mx-auto rounded-xl p-5 mb-6 gap-4"
            style={{ background: "white", border: "1px solid #ECE8E2", boxShadow: "0 12px 28px rgba(0,0,0,.07)" }}
          >
            {[
              { number: "1,800+", label: "Licensed Professionals Certified" },
              { number: "$5,200", label: "Average Monthly Side Income" },
              { number: "87%", label: "Report Clients Within 90 Days" },
            ].map((stat, i) => (
              <div key={i} className="text-center flex-1">
                <span className="block text-2xl md:text-3xl font-black" style={{ color: "#722F37" }}>{stat.number}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Cohort Notice */}
          <div className="max-w-[700px] mx-auto rounded-xl p-4 mb-6" style={{ background: "#FEF3C7", border: "2px solid #F59E0B" }}>
            <p className="font-bold mb-1" style={{ color: "#92400E" }}>⚠️ December Cohort: 7 Spots Remaining</p>
            <p className="text-sm" style={{ color: "#78350F" }}>
              Each cohort is limited to 50 participants to ensure quality feedback and community engagement. The December cohort closes when filled or on December 20th — whichever comes first.
            </p>
            <p className="text-xs mt-2" style={{ color: "#92400E" }}>Next cohort: January 15, 2025</p>
          </div>
        </section>

        {/* Sarah Introduction */}
        <section
          className="flex flex-col md:flex-row items-start gap-5 max-w-[900px] mx-auto rounded-xl p-6 mb-8 text-white"
          style={{ background: "linear-gradient(135deg, #C9A85C, #B8944E)" }}
        >
          <Image
            src="https://i.ibb.co/5hzyDsg0/coaching-thumbnail.jpg"
            alt="Sarah Mitchell"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full border-4 object-cover flex-shrink-0"
            style={{ borderColor: "white" }}
            unoptimized
          />
          <div>
            <h3 className="text-xl font-bold mb-3">Hi, I&apos;m Sarah Mitchell — your mentor for this intensive.</h3>
            <p className="text-sm opacity-95 leading-relaxed mb-3">
              I&apos;m a former ICU nurse who spent 12 years in hospital medicine before discovering functional medicine. When I started, I added $8,000/month coaching clients on my days off — before eventually transitioning full-time.
            </p>
            <p className="text-sm opacity-95 leading-relaxed">
              I&apos;ve now helped over 1,800 licensed healthcare professionals do the same thing. Not by abandoning their clinical careers, but by adding a coaching practice that uses the skills they already have.
            </p>
            <p className="text-sm mt-3 opacity-90">With care, Sarah 💕</p>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8 mt-8">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Who This Is For */}
            <section className="rounded-xl p-6" style={{ background: "white", border: "1px solid #E5E7EB" }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2432" }}>
                This Intensive Is Specifically Designed for Licensed Clinicians
              </h2>
              <p className="text-sm mb-5" style={{ color: "#6B6E76" }}>
                We created this program for healthcare professionals who want to help patients in ways the traditional system doesn&apos;t allow — while earning what their expertise is actually worth.
              </p>

              {/* Requirements */}
              <div className="rounded-lg p-4 mb-4" style={{ background: "#F0FDF4", border: "1px solid #86EFAC" }}>
                <p className="font-bold text-sm mb-3" style={{ color: "#166534" }}>To apply, you must have ALL of the following:</p>
                <ul className="space-y-2">
                  {[
                    "Active healthcare license — RN, PA, NP, PharmD, PT, OT, RD, LCSW, DC, or equivalent",
                    "Currently employed or in active practice — This is designed to complement your existing work",
                    "Genuine interest in building a coaching practice — You're ready to take action",
                    "Willingness to invest in yourself — The intensive is free, but building a real practice requires commitment",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#166534" }}>
                      <span className="font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not For You */}
              <div className="rounded-lg p-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <p className="font-bold text-sm mb-3" style={{ color: "#991B1B" }}>This is NOT the right fit if:</p>
                <ul className="space-y-2">
                  {[
                    "You don't have an active healthcare license or clinical credentials",
                    "You're currently unemployed and looking for immediate income (this takes 60-90 days to build)",
                    "You're just browsing free content with no intention of building a practice",
                    "You're looking for a \"get rich quick\" opportunity — this requires real work",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#991B1B" }}>
                      <span className="font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* What You'll Learn */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2432" }}>
                What You&apos;ll Learn in the 3-Day Intensive
              </h2>
              <p className="text-sm mb-5" style={{ color: "#6B6E76" }}>
                Complete all content in one 90-minute session, or spread across 3 days at your own pace. Designed for busy clinicians who want depth without fluff.
              </p>

              <div className="space-y-4">
                {[
                  { day: "Day 1", title: "Functional Medicine Framework for Clinicians", time: "~30 min", items: ["The 7 core body systems and how they interconnect", "Root cause vs. symptom management — the clinical difference", "Scope of practice: Coach vs. Clinician (critical legal distinctions)", "How to position yourself as complementary to MDs, not competitive"] },
                  { day: "Day 2", title: "Clinical Assessment & Protocol Design", time: "~30 min", items: ["Comprehensive intake templates (yours to keep and use)", "Health history framework for functional medicine clients", "How to review labs ethically as a coach (what you can and can't say)", "Protocol development within scope of practice"] },
                  { day: "Day 3", title: "Building Your $5,000-$10,000/Month Practice", time: "~30 min", items: ["Where to find your first 5-10 clients (most are closer than you think)", "Pricing strategies: Why $200-$400/session is standard", "Package design: One-time sessions vs. 12-week programs", "Legal structure, liability insurance, and business basics"] },
                ].map((module, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold text-white" style={{ background: "#722F37" }}>{module.day}</span>
                      <span className="text-xs text-gray-500">{module.time}</span>
                    </div>
                    <h3 className="font-bold mb-2" style={{ color: "#1F2432" }}>{module.title}</h3>
                    <ul className="space-y-1">
                      {module.items.map((item, j) => (
                        <li key={j} className="text-sm flex items-start gap-2" style={{ color: "#6B6E76" }}>
                          <span style={{ color: "#722F37" }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2432" }}>What Licensed Professionals Are Saying</h2>
              <div className="space-y-4">
                {[
                  { quote: "I completed Sarah's intensive on a Saturday morning between shifts. Within 90 days, I added $6,200/month seeing 12 functional medicine clients at $250/session — just 12 hours/week on weekends.", name: "Jennifer K., PA-C", role: "Family Medicine PA + Functional Medicine Consultant, Pennsylvania" },
                  { quote: "As a pharmacist stuck behind the counter, I was dying inside. Sarah's intensive showed me how to use my clinical knowledge to actually help people heal. I now make $4,800/month helping patients safely optimize medications through root-cause protocols.", name: "Michael R., PharmD", role: "Retail Pharmacist + Functional Medicine Coach, Texas" },
                  { quote: "I was skeptical — another free certification that's really just a sales pitch? This wasn't. The scope of practice module alone was worth my time. I learned exactly what I can and can't do as a coach vs. using my NP license.", name: "Rachel T., NP-C", role: "Family Nurse Practitioner + Hormone Health Coach, Florida" },
                  { quote: "After 18 years as a PT, I was burned out on insurance reimbursements. Sarah's intensive gave me a framework to offer cash-pay functional medicine consultations. I added $3,800/month within 60 days.", name: "David M., DPT", role: "Physical Therapist + Functional Movement Coach, California" },
                ].map((t, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "#FDF2F4", border: "1px solid #E8A0A8" }}>
                    <p className="text-sm italic mb-3" style={{ color: "#4A5568" }}>&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-bold text-sm" style={{ color: "#1F2432" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#6B6E76" }}>{t.role}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2432" }}>Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-3 font-medium flex justify-between items-center"
                      style={{ color: "#1F2432" }}
                    >
                      {faq.q}
                      <span className="text-xl">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm" style={{ color: "#6B6E76" }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:sticky lg:top-5 h-fit">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #FDF8F6 100%)",
                border: "2px solid #722F37",
                boxShadow: "0 16px 48px rgba(114,47,55,0.12)"
              }}
            >
              <div className="text-center mb-5 pb-4 border-b" style={{ borderColor: "#ECE8E2" }}>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#722F37" }}>Apply for the Free 3-Day Intensive</h3>
                <p className="text-xs" style={{ color: "#6B6E76" }}>December cohort: 7 spots remaining</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>First Name*</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>Last Name*</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>Email Address*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${emailStatus === "valid" ? "border-green-500 bg-green-50" : emailStatus === "invalid" ? "border-red-500 bg-red-50" : ""}`}
                    style={{ borderColor: emailStatus === "idle" ? "#D1D5DB" : undefined }}
                  />
                  {emailStatus === "invalid" && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>Phone Number*</label>
                  <div className="flex gap-2">
                    <select value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })} className="px-2 py-2 rounded-lg border text-sm w-24" style={{ borderColor: "#D1D5DB" }}>
                      {COUNTRY_CODES.map((c) => (<option key={`${c.country}-${c.code}`} value={c.code}>{c.flag} {c.code}</option>))}
                    </select>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }} placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>Healthcare License Type*</label>
                  <select required value={formData.licenseType} onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }}>
                    <option value="">Select your license</option>
                    {LICENSE_TYPES.map((lic) => (<option key={lic} value={lic}>{lic}</option>))}
                  </select>
                </div>

                {formData.licenseType === "Other" && (
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>Please specify your license*</label>
                    <input type="text" required value={formData.otherLicenseType} onChange={(e) => setFormData({ ...formData, otherLicenseType: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }} placeholder="e.g., Chiropractor, Acupuncturist" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>Current Employment Status*</label>
                  <select required value={formData.employmentStatus} onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }}>
                    <option value="">Select status</option>
                    {EMPLOYMENT_STATUS.map((status) => (<option key={status} value={status}>{status}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1F2432" }}>What&apos;s your primary goal?*</label>
                  <select required value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#D1D5DB" }}>
                    <option value="">Select goal</option>
                    {GOALS.map((goal) => (<option key={goal} value={goal}>{goal}</option>))}
                  </select>
                </div>

                <label className="flex items-start gap-2 mt-3">
                  <input type="checkbox" checked={formData.confirmLicense} onChange={(e) => setFormData({ ...formData, confirmLicense: e.target.checked })} className="mt-1" />
                  <span className="text-xs" style={{ color: "#6B6E76" }}>I confirm I hold an active healthcare license and meet the requirements listed above.</span>
                </label>

                {error && <div className="rounded-lg p-2 text-xs" style={{ background: "#FEF2F2", color: "#991B1B" }}>{error}</div>}

                <button
                  type="submit"
                  disabled={loading || loggingIn || emailStatus === "invalid" || emailStatus === "checking"}
                  className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: loading || loggingIn ? "#D1D5DB" : "linear-gradient(135deg, #722F37, #5C262D)" }}
                >
                  {loggingIn ? "Approving..." : loading ? "Submitting..." : "Submit Application →"}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-xs" style={{ color: "#6B6E76" }}>🔒 Your information is secure and never shared</p>
                  <p className="text-xs" style={{ color: "#6B6E76" }}>📋 Applications reviewed within 24 hours</p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Income Disclaimer */}
        <p className="text-center text-xs mt-10 max-w-[800px] mx-auto" style={{ color: "#9A9EA6" }}>
          Income figures represent results reported by surveyed graduates who completed certification and actively built practices. Individual results vary based on effort, location, specialty, and time invested. This certification does not guarantee income.
        </p>

        {/* Footer */}
        <p className="text-center text-sm mt-6 pt-6 border-t" style={{ color: "#9A9EA6", borderColor: "#ECE8E2" }}>
          © 2025 AccrediPro Academy • <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link> • <Link href="/terms" className="hover:underline">Terms of Service</Link> • Contact: info@coach.accredipro.academy
        </p>
      </main>
    </div>
  );
}
