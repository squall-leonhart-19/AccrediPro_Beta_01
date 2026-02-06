"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Users,
  Award,
  Sparkles,
  Loader2,
} from "lucide-react";

// ─── Brand (matches DFY intake exactly) ────────────────────────────
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  burgundyLight: "#9a4a54",
  gold: "#d4af37",
  goldLight: "#f7e7a0",
  goldDark: "#b8860b",
  cream: "#fdfbf7",
  goldMetallic:
    "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyGold: "linear-gradient(135deg, #722f37 0%, #d4af37 100%)",
};

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// ─── Confetti ──────────────────────────────────────────────────────
function useConfetti() {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#d4af37", "#f7e7a0", "#722f37", "#b8860b"] });
      setTimeout(() => confetti({ particleCount: 50, spread: 100, origin: { y: 0.5 }, colors: ["#d4af37", "#f7e7a0"] }), 200);
    });
  }, []);
}

// ─── Questions ─────────────────────────────────────────────────────
interface QuizOption {
  label: string;
  value: string;
  reaction: string;
}
interface QuizStep {
  id: number;
  pillar: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
}

const QUESTIONS: QuizStep[] = [
  {
    id: 1, pillar: "Current State",
    question: "Which best describes your current work situation?",
    subtitle: "Be honest — this helps us personalize your path.",
    options: [
      { label: "Burned out in healthcare/corporate", value: "burned-out", reaction: "You're not alone — 73% of our certified practitioners started exactly where you are." },
      { label: "Stay-at-home mom wanting more", value: "sahm", reaction: "Exactly like Grace, who built a $4,800/month practice around her kids' school schedule." },
      { label: "Already in wellness, wanting credentials", value: "wellness", reaction: "Smart move. Certification increases your earning potential by an average of 340%." },
      { label: "Exploring a complete career change", value: "career-change", reaction: "That takes courage. Angela was in the same spot 6 months ago — now she's fully booked." },
    ],
  },
  {
    id: 2, pillar: "Current State",
    question: "How often do you think about leaving your current situation?",
    options: [
      { label: "Every single day", value: "daily", reaction: "That feeling doesn't go away on its own. But it CAN become fuel for change." },
      { label: "A few times a week", value: "weekly", reaction: "That quiet whisper? It's trying to tell you something important." },
      { label: "When something frustrating happens", value: "sometimes", reaction: "Those moments of frustration are actually signals pointing you toward something better." },
      { label: "I'm already making moves", value: "already-moving", reaction: "You're ahead of the curve. Let's make sure you're on the fastest path." },
    ],
  },
  {
    id: 3, pillar: "Current State",
    question: "What's the biggest thing holding you back right now?",
    options: [
      { label: "I don't know where to start", value: "no-direction", reaction: "That's the #1 answer we hear. And it's exactly why this program exists." },
      { label: "Money is tight", value: "money", reaction: "I get it. That's why the enrollment fee is just $17 — not $17,000." },
      { label: "I'm not sure I'm qualified", value: "imposter", reaction: "Imposter syndrome is real. But 89% of our students had ZERO health background." },
      { label: "I don't have enough time", value: "time", reaction: "Our program is designed for busy women — just 1 hour a day for 7 days." },
    ],
  },
  {
    id: 4, pillar: "Desire",
    question: "Imagine 6 months from now — what does your ideal day look like?",
    subtitle: "Close your eyes for a second. Really picture it.",
    options: [
      { label: "Working from home on my own schedule", value: "home-schedule", reaction: "That's exactly what 2,400+ of our graduates are doing right now." },
      { label: "Helping clients transform their health", value: "helping-clients", reaction: "There's nothing more fulfilling. Our practitioners help 5-15 clients per week." },
      { label: "Making good money doing what I love", value: "income-passion", reaction: "Average first-year income for our certified practitioners: $4,200-$8,000/month." },
      { label: "Having freedom and flexibility", value: "freedom", reaction: "Freedom isn't a dream — it's a plan. And you're making yours right now." },
    ],
  },
  {
    id: 5, pillar: "Desire",
    question: "How much monthly income would help you feel financially safe?",
    options: [
      { label: "$2,000-$4,000/month", value: "2k-4k", reaction: "Very achievable. Most practitioners hit this within 60-90 days of certification." },
      { label: "$4,000-$6,000/month", value: "4k-6k", reaction: "This is our average. You'd need just 8-12 clients per week at $75-$100/session." },
      { label: "$6,000-$10,000/month", value: "6k-10k", reaction: "Absolutely possible with group programs and packages. Several of our grads earn this." },
      { label: "$10,000+/month", value: "10k-plus", reaction: "Our top earners hit this with premium packages + online courses. It starts with certification." },
    ],
  },
  {
    id: 6, pillar: "Desire",
    question: "Which area of health pulls at your heart the most?",
    subtitle: "2,847 women who chose Hormone Health are now certified.",
    options: [
      { label: "Hormone Health & Balance", value: "hormones", reaction: "The #1 most in-demand specialty. Women are desperate for real hormone help." },
      { label: "Gut Health & Digestion", value: "gut", reaction: "The gut is the foundation of everything. This specialty is booming." },
      { label: "Weight Management & Metabolism", value: "weight", reaction: "Beyond diets — real metabolic transformation. Clients will pay premium for this." },
      { label: "Energy & Fatigue Recovery", value: "energy", reaction: "Chronic fatigue affects 1 in 3 women. They need practitioners who understand root cause." },
    ],
  },
  {
    id: 7, pillar: "Belief",
    question: "What's the #1 thing stopping you from becoming a certified practitioner?",
    options: [
      { label: "I don't have a science background", value: "no-science", reaction: "Neither did 89% of our graduates. Our program is designed for complete beginners." },
      { label: "Other programs are too expensive", value: "cost", reaction: "Most programs charge $5,000-$15,000. Ours starts at $17. Not a typo." },
      { label: "I'm afraid I won't get clients", value: "no-clients", reaction: "We include our \"Your First Client\" blueprint — 73% land their first client within 30 days." },
      { label: "I tried before and it didn't work", value: "tried-before", reaction: "Different approach, different result. Our method is nothing like what you've tried." },
    ],
  },
  {
    id: 8, pillar: "Belief",
    question: "Have you ever looked into FM or health certifications before?",
    options: [
      { label: "Yes, but they were too expensive", value: "too-expensive", reaction: "The industry has a price problem. We believe certification shouldn't cost a mortgage payment." },
      { label: "Yes, but they took too long", value: "too-long", reaction: "2-4 year programs? Not here. Our fast-track gets you certified in days, not years." },
      { label: "No, this is brand new to me", value: "brand-new", reaction: "Perfect timing. You're discovering this at the ideal moment." },
      { label: "Yes, and I'm comparing options", value: "comparing", reaction: "Smart. Compare our results: 4,200+ certified, 89% career changers, $17 to start." },
    ],
  },
  {
    id: 9, pillar: "Belief",
    question: "How soon are you looking to make a change in your career?",
    options: [
      { label: "Immediately — I'm ready NOW", value: "now", reaction: "You're on track to qualify as a Level 1 Practitioner with $5K-$8K/month earning potential." },
      { label: "Within the next 1-3 months", value: "1-3-months", reaction: "Great timeline. You could be certified and seeing clients within weeks." },
      { label: "Within 6 months", value: "6-months", reaction: "That gives you plenty of time. But why wait when you can start for $17?" },
      { label: "Just exploring for now", value: "exploring", reaction: "No pressure. But your answers suggest you're more ready than you think." },
    ],
  },
  {
    id: 10, pillar: "Commitment",
    question: "If there was a way to get certified in under 2 weeks for less than $100 — would you take it seriously?",
    options: [
      { label: "Absolutely — that sounds perfect", value: "absolutely", reaction: "Good. Because that's exactly what this program delivers." },
      { label: "I'd be skeptical but interested", value: "skeptical", reaction: "Healthy skepticism. Check our 4,200+ success stories — then decide." },
      { label: "I'd need to see proof first", value: "need-proof", reaction: "Fair. You'll see real student results on the next page." },
      { label: "I'm not sure yet", value: "unsure", reaction: "That's okay. Your answers already tell me you'd thrive in this program." },
    ],
  },
  {
    id: 11, pillar: "Commitment",
    question: "How committed are you to making 2026 YOUR year?",
    subtitle: "The year everything changes.",
    options: [
      { label: "100% — I'm done waiting", value: "100-percent", reaction: "That's the energy. You're going to crush this." },
      { label: "Very committed, just need the right path", value: "very", reaction: "You just found it. Keep going." },
      { label: "Committed but scared", value: "scared", reaction: "Courage isn't the absence of fear — it's moving forward despite it." },
      { label: "Getting there", value: "getting-there", reaction: "Every journey starts with a single step. You've already taken several." },
    ],
  },
  {
    id: 12, pillar: "Commitment",
    question: "Would you dedicate just 1 hour a day for 7 days to change your career forever?",
    options: [
      { label: "Yes — 7 hours is nothing for a career change", value: "yes-7hrs", reaction: "That's all it takes. 7 hours to a whole new future." },
      { label: "I can probably find the time", value: "probably", reaction: "You definitely can. Early morning, lunch break, after kids are in bed — your choice." },
      { label: "It would be a stretch but I'd try", value: "stretch", reaction: "That commitment is all you need. We'll make every minute count." },
      { label: "I'm not sure about my schedule", value: "unsure-schedule", reaction: "It's completely self-paced. Start and stop whenever works for you." },
    ],
  },
];

// ─── Testimonials ──────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Susan M.", location: "Tampa, FL", text: "I was burned out after 15 years as a nurse... now I earn $6,200/month from home helping women with hormones.", afterQ: 3 },
  { name: "Angela R.", location: "Denver, CO", text: "I thought I needed $15,000 and 2 years of training... I was certified in a weekend and saw my first client the next week.", afterQ: 6 },
  { name: "Karen W.", location: "Nashville, TN", text: "I was skeptical and had tried other programs that wasted my money... I quit my hospital job in 90 days.", afterQ: 9 },
];

// ─── Stages ────────────────────────────────────────────────────────
type Stage = "intro" | "quiz" | "testimonial" | "accepted" | "email" | "result";

// Total steps for progress: intro + 12 questions + 3 testimonials = 16
const TOTAL_STEPS = 16;

export default function FMApplicationQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reaction, setReaction] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const fireConfetti = useConfetti();

  // Calculate which "step" we're on for the progress bar
  const getStepNumber = (): number => {
    if (stage === "intro") return 0;
    if (stage === "accepted" || stage === "email" || stage === "result") return TOTAL_STEPS;
    // quiz or testimonial
    const testimonialsBefore = TESTIMONIALS.filter((t) => t.afterQ <= currentQ).length;
    return 1 + currentQ + testimonialsBefore;
  };

  const progress = Math.round((getStepNumber() / TOTAL_STEPS) * 100);

  // ─── Handlers ───────────────────────────────────────────────────
  const selectAnswer = (value: string, reactionText: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: value }));
    setReaction(reactionText);
  };

  const handleNext = () => {
    setDirection(1);
    setReaction(null);

    if (stage === "intro") {
      if (!name.trim()) return;
      setStage("quiz");
      return;
    }

    if (stage === "testimonial") {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setStage("quiz");
      } else {
        setStage("accepted");
        setTimeout(() => fireConfetti(), 300);
      }
      return;
    }

    if (stage === "quiz") {
      if (!answers[currentQ]) return;
      const justAnswered = currentQ + 1;
      // Check for testimonial
      const testimonial = TESTIMONIALS.find((t) => t.afterQ === justAnswered);
      if (testimonial) {
        setStage("testimonial");
        return;
      }
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setStage("accepted");
        setTimeout(() => fireConfetti(), 300);
      }
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setReaction(null);

    if (stage === "quiz" && currentQ === 0) {
      setStage("intro");
      return;
    }

    if (stage === "testimonial") {
      setStage("quiz");
      return;
    }

    if (stage === "quiz" && currentQ > 0) {
      // Check if we need to go back through a testimonial
      const prevTestimonial = TESTIMONIALS.find((t) => t.afterQ === currentQ);
      if (prevTestimonial) {
        setStage("testimonial");
        setCurrentQ(currentQ - 1);
        return;
      }
      setCurrentQ(currentQ - 1);
    }

    if (stage === "accepted") {
      setCurrentQ(QUESTIONS.length - 1);
      setStage("quiz");
    }

    if (stage === "email") {
      setStage("accepted");
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    try {
      await fetch("/api/quiz-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, funnel: "fm-application", answers }),
      });
    } catch { /* still show result */ }
    setSubmitting(false);
    setStage("result");
  };

  // ─── Can proceed? ───────────────────────────────────────────────
  const canProceed = (): boolean => {
    if (stage === "intro") return !!name.trim();
    if (stage === "quiz") return !!answers[currentQ];
    if (stage === "testimonial") return true;
    return false;
  };

  // ─── Step key for animation ─────────────────────────────────────
  const animKey = `${stage}-${currentQ}`;

  // ─── Render content by stage ────────────────────────────────────
  const renderContent = () => {
    // ── INTRO ──────────────────────────────────────────────────
    if (stage === "intro") {
      return (
        <div className="space-y-5">
          {/* ASI Logo + Institute Header */}
          <div className="text-center space-y-3">
            <Image
              src="https://assets.accredipro.academy/fm-certification/ASI_LOGO-removebg-preview.png"
              alt="AccrediPro International Standards Institute"
              width={80}
              height={80}
              className="mx-auto"
            />
            <div>
              <h2 className="text-lg font-bold" style={{ color: BRAND.burgundy }}>
                AccrediPro International Standards Institute
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Accredited by CMA, CTAA & IPHM
              </p>
            </div>
          </div>

          {/* Accreditation Logos */}
          <div className="flex justify-center">
            <Image
              src="https://assets.accredipro.academy/fm-certification/All_Logos.png"
              alt="CMA, CTAA, IPHM Accredited"
              width={280}
              height={50}
              className="opacity-80"
            />
          </div>

          {/* Sarah Card */}
          <div
            className="rounded-2xl p-5 border-2"
            style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}40` }}
          >
            <div className="flex items-start gap-4">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah Mitchell"
                width={64}
                height={64}
                className="rounded-full border-3 object-cover flex-shrink-0 shadow-lg"
                style={{ borderColor: BRAND.gold }}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: BRAND.burgundy }}>
                  SENIOR ADMISSIONS ADVISOR
                </p>
                <p className="text-gray-900 font-bold">Hi! I&apos;m Sarah Mitchell 👋</p>
                <p className="text-gray-600 text-sm mt-1">
                  Before joining the Institute, I was a burned-out ER nurse and single mom. Functional Medicine changed everything — I now help women build $10K-15K/month practices from home.
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">
                  I&apos;ve personally guided 2,800+ women through this exact process.
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="relative mx-auto" style={{ maxWidth: 280 }}>
            <Image
              src="https://learn.accredipro.academy/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
              alt="Functional Medicine Certificate"
              width={280}
              height={200}
              className="rounded-lg shadow-lg border"
              style={{ borderColor: `${BRAND.gold}60` }}
            />
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-md"
              style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
              Verified Digital Credential
            </div>
          </div>

          {/* Assessment CTA */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>
              This 3-minute assessment reveals:
            </p>
            <div className="flex flex-col gap-1 text-sm text-gray-700">
              {[
                "✅ Your best-fit specialty",
                "✅ Your realistic earning potential",
                "✅ If you qualify for the ASI Institutional Scholarship",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="What's your first name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) handleNext(); }}
              className="w-full h-12 px-5 text-base md:text-lg border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-center"
              style={{ borderColor: name.trim() ? BRAND.gold : "#e5e7eb" }}
            />
          </div>

          {/* Trust Badges */}
          <div className="text-center flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 min</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% private</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 4,200+ certified</span>
          </div>
        </div>
      );
    }

    // ── TESTIMONIAL ────────────────────────────────────────────
    if (stage === "testimonial") {
      const testimonial = TESTIMONIALS.find((t) => t.afterQ === currentQ + 1);
      if (!testimonial) return null;

      return (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `${BRAND.gold}20` }}
            >
              <Star className="w-8 h-8" style={{ color: BRAND.gold }} />
            </div>
          </div>

          <div>
            <p className="text-lg italic leading-relaxed mb-4" style={{ color: BRAND.burgundy }}>
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <p className="font-semibold" style={{ color: BRAND.burgundy }}>{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
          </div>

          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-current" style={{ color: BRAND.gold }} />
            ))}
          </div>
        </div>
      );
    }

    // ── ACCEPTED ───────────────────────────────────────────────
    if (stage === "accepted") {
      return (
        <div className="space-y-6 text-center">
          <div className="relative inline-block">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
              style={{ background: BRAND.goldMetallic }}
            >
              <CheckCircle className="w-12 h-12" style={{ color: BRAND.burgundyDark }} />
            </div>
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
              style={{ background: BRAND.burgundy, color: "white" }}
            >
              Accepted
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: BRAND.burgundy }}>
            Congratulations{name ? `, ${name}` : ""}!
          </h2>
          <p className="text-gray-600 text-lg">
            You&apos;ve been <strong>accepted</strong> into the Functional Medicine Foundations Program.
          </p>
          <p className="text-sm text-gray-500">
            Only <strong>34% of applicants</strong> qualify. You&apos;re in that group.
          </p>

          <div
            className="p-4 rounded-xl text-left"
            style={{ backgroundColor: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}40` }}
          >
            <p className="font-semibold mb-2" style={{ color: BRAND.burgundy }}>What you&apos;ve unlocked:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {["3-lesson Functional Medicine Mini-Diploma", "Verified Digital Certificate", "\"Your First Client\" Blueprint", "Private Community Access"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: `${BRAND.burgundy}10`, color: BRAND.burgundy }}
            >
              <Users className="w-3 h-3" /> 12 spots remaining at this rate
            </span>
          </div>
        </div>
      );
    }

    // ── EMAIL ──────────────────────────────────────────────────
    if (stage === "email") {
      return (
        <div className="space-y-6">
          {/* Sarah Card */}
          <div
            className="rounded-2xl p-5 border-2"
            style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}40` }}
          >
            <div className="flex items-start gap-4">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah M."
                width={56}
                height={56}
                className="rounded-full border-2 object-cover flex-shrink-0 shadow-md"
                style={{ borderColor: BRAND.gold }}
              />
              <div>
                <p className="text-gray-900 font-bold">One last step{name ? `, ${name}` : ""}!</p>
                <p className="text-gray-600 text-sm mt-1">
                  I put together a custom certification plan just for you. Enter your email and I&apos;ll send it right over.
                </p>
              </div>
            </div>
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Your best email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
            className="w-full h-12 px-5 text-base md:text-lg border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-center"
            style={{ borderColor: email.includes("@") ? BRAND.gold : "#e5e7eb" }}
          />

          {/* What you get */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${BRAND.gold}08` }}>
            <p className="text-xs font-medium mb-2" style={{ color: BRAND.burgundy }}>You&apos;ll receive:</p>
            <ul className="space-y-1 text-xs text-gray-600">
              {["Your personalized practitioner profile", "Fast-track certification roadmap", "Income potential breakdown for your specialty"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: BRAND.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> We never spam. Unsubscribe anytime.
          </p>
        </div>
      );
    }

    // ── RESULT ─────────────────────────────────────────────────
    if (stage === "result") {
      return (
        <div className="space-y-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: BRAND.goldMetallic }}
          >
            <Award className="w-10 h-10" style={{ color: BRAND.burgundyDark }} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: BRAND.burgundy }}>
            You&apos;re In{name ? `, ${name}` : ""}!
          </h2>
          <p className="text-gray-600">
            Your certification plan has been sent to <strong>{email}</strong>.
          </p>

          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: `${BRAND.gold}08`, border: `2px solid ${BRAND.gold}` }}
          >
            <h3 className="font-bold text-lg mb-3" style={{ color: BRAND.burgundy }}>
              Ready to Start Right Now?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Begin your 3-lesson Functional Medicine Mini-Diploma today. Completely free — no credit card required.
            </p>
            <a
              href="/functional-medicine-mini-diploma"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 shadow-lg"
              style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
              Start Free Mini-Diploma <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: "4,200+", label: "Certified" },
              { val: "89%", label: "Career Changers" },
              { val: "7 Days", label: "To Certify" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── QUIZ QUESTION ──────────────────────────────────────────
    const q = QUESTIONS[currentQ];
    return (
      <div className="space-y-5">
        {/* Sarah reaction */}
        {reaction && (
          <div
            className="rounded-2xl p-4 border-2 flex items-start gap-3"
            style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}40` }}
          >
            <Image
              src={SARAH_AVATAR}
              alt="Sarah"
              width={36}
              height={36}
              className="rounded-full border-2 object-cover flex-shrink-0"
              style={{ borderColor: BRAND.gold }}
            />
            <p className="text-sm" style={{ color: BRAND.burgundy }}>{reaction}</p>
          </div>
        )}

        {/* Question header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {q.pillar && (
              <span
                className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ backgroundColor: `${BRAND.gold}15`, color: BRAND.burgundy }}
              >
                {q.pillar}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: BRAND.burgundyDark }}>
            {q.question}
          </h2>
          {q.subtitle && <p className="text-sm text-gray-500 mt-1">{q.subtitle}</p>}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = answers[currentQ] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value, opt.reaction)}
                className="w-full p-4 rounded-xl border-2 transition-all text-left"
                style={{
                  borderColor: isSelected ? BRAND.burgundy : "#e5e7eb",
                  backgroundColor: isSelected ? `${BRAND.burgundy}08` : "white",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: isSelected ? BRAND.burgundy : "#d1d5db" }}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.burgundy }} />
                    )}
                  </div>
                  <span className="font-medium" style={{ color: BRAND.burgundy }}>{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Time hint */}
        {currentQ >= 9 && (
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" style={{ color: BRAND.gold }} />
            Almost done — about 30 seconds left!
          </p>
        )}
      </div>
    );
  };

  // ─── Navigation button text ─────────────────────────────────────
  const getNextLabel = (): string => {
    if (stage === "intro") return "Let's Start";
    if (stage === "accepted") return "Claim My Spot — $17";
    if (stage === "testimonial") return "Continue";
    return "Next";
  };

  // ─── Full-screen result page (no card) ──────────────────────────
  if (stage === "result") {
    return (
      <div
        className="min-h-screen"
        style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}
      >
        <div className="py-6 md:py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#fff", boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}
            >
              <div className="px-5 py-3" style={{ background: BRAND.goldMetallic }}>
                <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>
                  Application Complete
                </span>
              </div>
              <div className="p-6 md:p-10">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Layout (DFY Intake style) ─────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}
    >
      <div className="py-6 md:py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Premium Card */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "#fff",
              boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)`,
            }}
          >
            {/* Gold Header */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: BRAND.goldMetallic }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>
                  Certification Assessment
                </span>
              </div>
              <span
                className="text-sm font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: `${BRAND.burgundyDark}20`, color: BRAND.burgundyDark }}
              >
                {stage === "intro" ? "Start" : stage === "accepted" || stage === "email" ? "Done" : `${currentQ + 1} / ${QUESTIONS.length}`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-1.5 bg-gray-100">
                <motion.div
                  className="h-full"
                  style={{ background: BRAND.burgundyGold }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <div className="absolute right-3 -bottom-5 text-xs text-gray-400 font-medium">
                {progress}% complete
              </div>
            </div>

            {/* Content + Nav */}
            <div className="p-6 md:p-10 pt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={animKey}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="min-h-[400px] md:min-h-[450px]"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-100">
                {stage !== "intro" ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors py-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {stage === "email" ? (
                  <Button
                    onClick={handleEmailSubmit}
                    disabled={!email.includes("@") || submitting}
                    size="lg"
                    className="h-12 px-8 text-base font-bold rounded-xl shadow-lg min-w-[160px]"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</>
                    ) : (
                      <>Send My Plan <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                ) : stage === "accepted" ? (
                  <Button
                    onClick={() => setStage("email")}
                    size="lg"
                    className="h-12 px-8 text-base font-bold rounded-xl shadow-lg min-w-[160px]"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    Claim My Spot — $17 <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    size="lg"
                    className="h-12 px-8 text-base font-bold rounded-xl shadow-lg transition-all min-w-[160px] disabled:opacity-50"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    {getNextLabel()} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
