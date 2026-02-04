"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Award,
  Sparkles,
  Lock,
  Users,
  TrendingUp,
  AlertTriangle,
  Play,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Brand ─────────────────────────────────────────────────────────
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

const ASI_LOGO = "/asi-logo-transparent.png";
const CERTIFICATE_IMG = "/certificate-preview.png";
const ACCREDITATION_LOGOS = "/all-logos.png";
const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// ─── Types ─────────────────────────────────────────────────────────
export interface PersonaContent {
  /** Persona identifier */
  slug: string;
  /** Short tag shown at top, e.g. "For Healthcare Professionals" */
  tagline: string;
  /** Main hero headline (use {name} as placeholder) */
  headline: string;
  /** Sub-headline under the main headline */
  subheadline: string;
  /** The specific pain points for this persona (3-4 items) */
  painPoints: { emoji: string; title: string; description: string }[];
  /** What changes after certification (3-4 items) */
  transformation: { before: string; after: string }[];
  /** Testimonial specific to this persona */
  testimonial: {
    name: string;
    role: string;
    beforeRole: string;
    text: string;
    photo: string;
    income: string;
  };
  /** Why this persona is a perfect fit (3-4 bullet reasons) */
  whyYou: string[];
  /** Specific income framing for this persona */
  incomeFraming: string;
  /** CTA button text */
  ctaText: string;
  /** Urgency message */
  urgency: string;
  /** Objection handling FAQ items (3-4) */
  faqs: { question: string; answer: string }[];
}

// ─── Practitioner Types ────────────────────────────────────────────
const PRACTITIONER_LABELS: Record<string, string> = {
  "hormone-health": "Hormone Health Specialist",
  "gut-restoration": "Gut Restoration Specialist",
  "metabolic-optimization": "Metabolic Optimization Specialist",
  "burnout-recovery": "Burnout Recovery Specialist",
  "autoimmune-support": "Autoimmune Support Specialist",
};

const INCOME_LABELS: Record<string, string> = {
  "5k": "$5,000/month",
  "10k": "$10,000/month",
  "20k": "$20,000/month",
  "50k-plus": "$50,000+/month",
};

// ─── Checkout URL ──────────────────────────────────────────────────
const CHECKOUT_URL = "https://accredipro.academy/checkout/fm-certification";

// ─── Component ─────────────────────────────────────────────────────
export default function ResultsPageLayout({
  persona,
}: {
  persona: PersonaContent;
}) {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("name") || "Friend";
  const lastName = searchParams.get("lastName") || "";
  const email = searchParams.get("email") || "";
  const practitionerType = searchParams.get("type") || "hormone-health";
  const incomeGoal = searchParams.get("goal") || "10k";
  const role = searchParams.get("role") || "";

  const practitionerLabel =
    PRACTITIONER_LABELS[practitionerType] || "Certified Clinical Practitioner";
  const incomeLabel = INCOME_LABELS[incomeGoal] || "$10,000/month";

  const [spotsLeft] = useState(() => Math.floor(Math.random() * 5) + 19); // 19-23
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(1800); // 30 min
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((p) => (p <= 0 ? 0 : p - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const checkoutHref = `${CHECKOUT_URL}?name=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&type=${practitionerType}&goal=${incomeGoal}&role=${role}`;

  const headline = persona.headline.replace("{name}", firstName);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)`,
      }}
    >
      {/* Sticky urgency bar */}
      <div
        className="sticky top-0 z-50 py-2 px-4 text-center text-sm font-bold shadow-md"
        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
      >
        <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
        Your spot expires in {formatCountdown(countdown)} - Only {spotsLeft}{" "}
        spots remain in the Q1 2026 Cohort
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-10">
        {/* ═══ SECTION 1: Hero ═══ */}
        <section className="text-center space-y-5">
          <Image
            src={ASI_LOGO}
            alt="AccrediPro Standards Institute"
            width={72}
            height={72}
            className="mx-auto"
          />
          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              backgroundColor: `${BRAND.burgundy}10`,
              color: BRAND.burgundy,
            }}
          >
            <Award className="w-3.5 h-3.5" /> {persona.tagline}
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ color: BRAND.burgundyDark }}
          >
            {headline}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {persona.subheadline}
          </p>

          {/* Practitioner Type Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg shadow-lg"
            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
          >
            <Sparkles className="w-5 h-5" /> Your Match: {practitionerLabel}
          </motion.div>

          <p className="text-sm text-gray-500">
            Income target:{" "}
            <span className="font-bold" style={{ color: BRAND.burgundy }}>
              {incomeLabel}
            </span>{" "}
            - We&apos;ll show you exactly how to get there.
          </p>
        </section>

        {/* ═══ SECTION 2: Certificate Preview ═══ */}
        <section className="flex justify-center">
          <div className="relative w-full max-w-sm">
            <Image
              src={CERTIFICATE_IMG}
              alt="Your ASI Certificate"
              width={560}
              height={400}
              className="rounded-xl shadow-2xl border-2"
              style={{ borderColor: `${BRAND.gold}60` }}
            />
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap"
              style={{ background: BRAND.burgundy, color: "white" }}
            >
              {practitionerLabel}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: Pain Points ═══ */}
        <section className="space-y-5">
          <h2
            className="text-2xl md:text-3xl font-bold text-center"
            style={{ color: BRAND.burgundyDark }}
          >
            {firstName}, Does This Sound Familiar?
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {persona.painPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl border bg-white shadow-sm"
                style={{ borderColor: `${BRAND.burgundy}15` }}
              >
                <div className="text-2xl mb-2">{p.emoji}</div>
                <h3
                  className="font-bold mb-1"
                  style={{ color: BRAND.burgundy }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 4: Before → After Transformation ═══ */}
        <section
          className="p-6 md:p-8 rounded-2xl"
          style={{
            backgroundColor: `${BRAND.burgundy}08`,
            border: `1px solid ${BRAND.burgundy}15`,
          }}
        >
          <h2
            className="text-2xl font-bold text-center mb-6"
            style={{ color: BRAND.burgundyDark }}
          >
            Your Life Before vs. After Certification
          </h2>
          <div className="space-y-4">
            {persona.transformation.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm"
              >
                <div className="flex-1 text-right">
                  <span className="text-sm text-gray-500 line-through">
                    {t.before}
                  </span>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow"
                  style={{ background: BRAND.goldMetallic }}
                >
                  <ArrowRight
                    className="w-5 h-5"
                    style={{ color: BRAND.burgundyDark }}
                  />
                </div>
                <div className="flex-1">
                  <span
                    className="text-sm font-bold"
                    style={{ color: BRAND.burgundy }}
                  >
                    {t.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 5: Testimonial ═══ */}
        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-center"
            style={{ color: BRAND.burgundyDark }}
          >
            Real Results From Someone Just Like You
          </h2>
          <div
            className="p-6 rounded-2xl border bg-white shadow-lg"
            style={{ borderColor: `${BRAND.gold}40` }}
          >
            <div className="flex items-start gap-4">
              <Image
                src={persona.testimonial.photo}
                alt={persona.testimonial.name}
                width={72}
                height={72}
                className="rounded-full border-3 object-cover shadow-lg flex-shrink-0"
                style={{ borderColor: BRAND.gold }}
              />
              <div className="flex-1">
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-current"
                      style={{ color: BRAND.gold }}
                    />
                  ))}
                </div>
                <p
                  className="text-base italic leading-relaxed mb-3"
                  style={{ color: BRAND.burgundy }}
                >
                  &ldquo;{persona.testimonial.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold" style={{ color: BRAND.burgundy }}>
                      {persona.testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {persona.testimonial.beforeRole} &rarr;{" "}
                      {persona.testimonial.role}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: `${BRAND.gold}15`,
                      color: BRAND.burgundy,
                    }}
                  >
                    Now earning {persona.testimonial.income}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 6: Why You're a Perfect Fit ═══ */}
        <section
          className="p-6 md:p-8 rounded-2xl"
          style={{
            background: `${BRAND.gold}08`,
            border: `1px solid ${BRAND.gold}30`,
          }}
        >
          <h2
            className="text-2xl font-bold text-center mb-1"
            style={{ color: BRAND.burgundyDark }}
          >
            Why Your Background Is a Superpower
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            {persona.incomeFraming}
          </p>
          <div className="space-y-3">
            {persona.whyYou.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm"
              >
                <CheckCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: BRAND.gold }}
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 7: What's Included ═══ */}
        <section className="space-y-5">
          <h2
            className="text-2xl md:text-3xl font-bold text-center"
            style={{ color: BRAND.burgundyDark }}
          >
            Everything You Get Inside the DEPTH Method Certification
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                icon: "📚",
                title: "20-Module Clinical Curriculum",
                desc: "From foundations to advanced lab interpretation",
              },
              {
                icon: "🎓",
                title: "ASI-Accredited Certification",
                desc: "Nationally recognized practitioner credential",
              },
              {
                icon: "🧪",
                title: "Functional Lab Training",
                desc: "Learn to order and interpret real lab panels",
              },
              {
                icon: "💼",
                title: "Business Setup System",
                desc: "Client acquisition, pricing, and practice launch",
              },
              {
                icon: "🤝",
                title: "1-on-1 Mentorship Access",
                desc: "Personal guidance from ASI clinical directors",
              },
              {
                icon: "📋",
                title: "Done-For-You Protocols",
                desc: "Ready-to-use clinical templates for every specialty",
              },
              {
                icon: "🏆",
                title: "Physical Welcome Kit",
                desc: "Certificate, badge, and branded materials mailed to you",
              },
              {
                icon: "♾️",
                title: "Lifetime Access",
                desc: "All future updates and community access included",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border shadow-sm"
                style={{ borderColor: `${BRAND.gold}20` }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: BRAND.burgundy }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 8: Sarah's Personal Message ═══ */}
        <section
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: `${BRAND.gold}08`,
            borderColor: `${BRAND.gold}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <Image
              src={SARAH_AVATAR}
              alt="Sarah M."
              width={64}
              height={64}
              className="rounded-full border-2 object-cover flex-shrink-0 shadow-lg"
              style={{ borderColor: BRAND.gold }}
            />
            <div>
              <p className="font-bold text-sm" style={{ color: BRAND.burgundy }}>
                Sarah M.{" "}
                <span className="text-gray-400 font-normal">
                  - ASI Certified Clinical Director
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {firstName}, I reviewed your assessment personally. Your profile
                shows real potential as a {practitionerLabel}. I&apos;ve seen
                hundreds of women in your exact situation go on to build
                thriving practices earning {incomeLabel} and beyond. The only
                question is whether you&apos;ll take the next step. I hope you
                do - there&apos;s a spot waiting for you.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 9: FAQ / Objection Handling ═══ */}
        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-center"
            style={{ color: BRAND.burgundyDark }}
          >
            Questions You Might Have
          </h2>
          <div className="space-y-2">
            {persona.faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white overflow-hidden shadow-sm"
                style={{ borderColor: `${BRAND.gold}20` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: BRAND.burgundy }}
                  >
                    {faq.question}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 text-sm text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 10: Final CTA ═══ */}
        <section
          className="p-6 md:p-10 rounded-2xl text-center space-y-5"
          style={{
            background: "white",
            boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)`,
          }}
        >
          <Image
            src={ASI_LOGO}
            alt="ASI"
            width={56}
            height={56}
            className="mx-auto"
          />
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: BRAND.burgundyDark }}
          >
            {firstName}, Your Spot Is Reserved
          </h2>
          <p className="text-gray-600">
            {persona.urgency}
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { val: "$5-10K+", label: "Monthly Income" },
              { val: "30 Days", label: "To Certify" },
              { val: "73%", label: "Clients in 30d" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${BRAND.gold}08` }}
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: BRAND.burgundy }}
                >
                  {s.val}
                </div>
                <div className="text-[10px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          <a href={checkoutHref}>
            <Button
              size="lg"
              className="w-full max-w-md h-16 text-lg font-bold rounded-xl shadow-xl"
              style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
              {persona.ctaText} <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </a>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> 7-Day Money-Back Guarantee
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secure Checkout
            </span>
          </div>

          <p
            className="text-xs font-medium"
            style={{ color: BRAND.burgundy }}
          >
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Only {spotsLeft} spots remaining - {persona.urgency.split(".")[0]}.
          </p>
        </section>

        {/* ═══ Trustpilot + Accreditation ═══ */}
        <section className="text-center space-y-4 pb-8">
          {/* Trustpilot */}
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className="w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "#00b67a" }}
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                </div>
              ))}
            </div>
            <div className="text-xs">
              <span className="font-bold text-gray-800">Excellent 4.9</span>
              <span className="text-gray-400 mx-1">|</span>
              <span className="text-gray-500">Based on 1,197+ reviews</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400">
              Trustpilot
            </span>
          </div>

          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-2 font-medium">
              Accredited by ASI &amp; Backed by
            </p>
            <Image
              src={ACCREDITATION_LOGOS}
              alt="Accreditation partners"
              width={800}
              height={40}
              className="w-full max-w-md mx-auto h-auto opacity-60"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
