"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Star,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowDown,
  Lock,
  GraduationCap,
  Users,
  Play,
  Volume2,
  Clock,
  Sparkles,
  Zap,
  Gift,
  BookOpen,
  Target,
  FileText,
  MessageCircle,
  Globe,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPainMirror,
  getFuturePacing,
  getHeroSubhead,
  getValueStack,
  getIncomeROI,
  getFAQItems,
  getCTACopy,
  getSpecializationLabel,
  getCertIsForCards,
  getTwoChoices,
  getPSClosers,
  type Persona,
  type Intent,
  type PainPoint,
  type DreamLife,
  type Readiness,
  type Timeline,
  type IncomeGoal,
  type Specialization,
} from "@/data/dynamic-copy";
import {
  getTestimonialsForPersona,
  getFeaturedTestimonial,
  getDetailedTestimonials,
  type Testimonial,
} from "@/data/testimonials-bank";

// ─── Brand Colors ─────────────────────────────────────────────────
const B = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#f7e7a0",
  cream: "#fdfbf7",
  goldMetallic:
    "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  success: "#2AA97B",
};

const SARAH_AVATAR = "/coaches/sarah-coach.webp";
const ASI_LOGO = "/asi-logo-transparent.png";
const ACCREDITATION_LOGOS = "/all-logos.png";
const BUNDLE_IMG = "https://assets.accredipro.academy/fm-certification/FM-BUNDLE-IMG.png";
const SARAH_LARGE = "https://assets.accredipro.academy/fm-certification/Sarah-M.webp";
const CERT_BANNER = "https://assets.accredipro.academy/fm-certification/CERTIFICATIONS_ACC-1.webp";
const CERT_IMG = "https://learn.accredipro.academy/FUNCTIONAL_MEDICINE_CERTIFICATE.webp";
const ALL_LOGOS = "https://learn.accredipro.academy/_next/image?url=%2Fall-logos.png&w=1200&q=75";

const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-fm-certification";

// ─── Props ────────────────────────────────────────────────────────
export interface PersonalizedSalesPageProps {
  name: string;
  email: string;
  persona: Persona;
  intent: Intent;
  specialization: Specialization;
  painPoint: PainPoint;
  dreamLife: DreamLife;
  readiness: Readiness;
  timeline: Timeline;
  incomeGoal: IncomeGoal;
  currentIncome: string;
  background: string;
  motivation: string;
  lifeSituation: string;
  qualScore?: number;
}

const QUALIFICATION: Record<Persona, { percentile: string; rate: string }> = {
  "healthcare-pro": { percentile: "Top 6%", rate: "94%" },
  "health-coach": { percentile: "Top 12%", rate: "88%" },
  corporate: { percentile: "Top 18%", rate: "82%" },
  "stay-at-home-mom": { percentile: "Top 14%", rate: "86%" },
  "other-passionate": { percentile: "Top 20%", rate: "80%" },
};

// ─── Main Component ───────────────────────────────────────────────
export function PersonalizedSalesPage(props: PersonalizedSalesPageProps) {
  const {
    name,
    email,
    persona,
    intent,
    specialization,
    painPoint,
    dreamLife,
    readiness,
    timeline,
    incomeGoal,
    background,
  } = props;

  const spec = getSpecializationLabel(specialization);
  const checkoutLink = `${CHECKOUT_URL}?prefilled_email=${encodeURIComponent(email)}`;

  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Countdown timer
  const [countdown, setCountdown] = useState(1800);
  useEffect(() => {
    const t = setInterval(() => setCountdown((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const [spotsLeft] = useState(() => Math.floor(Math.random() * 5) + 3);

  return (
    <div className="min-h-screen" style={{ background: B.cream }}>
      {/* S1: Sticky Urgency Bar */}
      <div
        className="sticky top-0 z-50 py-2.5 px-4 text-center shadow-md"
        style={{ background: B.goldMetallic, color: B.burgundyDark }}
      >
        <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 flex-wrap">
          <Clock className="w-3.5 h-3.5 hidden sm:inline" />
          SCHOLARSHIP EXPIRES IN{" "}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-mono">
            {formatTime(countdown)}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Only {spotsLeft} spots remaining</span>
        </p>
      </div>

      {/* S2: Trustpilot Widget */}
      <TrustpilotBar />

      {/* S3: Hero Section */}
      <HeroSection
        name={name}
        persona={persona}
        intent={intent}
        specLabel={spec.name}
        background={background}
        qualScore={props.qualScore || 92}
        incomeGoal={incomeGoal}
        painPoint={painPoint}
        dreamLife={dreamLife}
        timeline={timeline}
      />

      {/* S4: Scholarship Announcement */}
      <ScholarshipAnnouncement
        name={name}
        specLabel={spec.name}
        incomeGoal={incomeGoal}
        dreamLife={dreamLife}
        persona={persona}
        intent={intent}
      />

      {/* S5: Bundle Image */}
      <BundleImageSection />

      {/* S6: First CTA */}
      <CTASection
        name={name}
        specLabel={spec.name}
        shortName={spec.shortName}
        intent={intent}
        timeline={timeline}
        checkoutLink={checkoutLink}
        position="first"
      />

      {/* S7: Micro VSL */}
      <MicroVSLSection
        name={name}
        persona={persona}
        intent={intent}
        specialization={specialization}
        painPoint={painPoint}
        incomeGoal={incomeGoal}
        background={background}
      />

      {/* S8: Pain Mirror */}
      <PainMirrorSection painPoint={painPoint} persona={persona} />

      {/* S9: Cert Is For */}
      <CertIsForSection persona={persona} />

      {/* S10: Featured Testimonial */}
      <TestimonialSection persona={persona} intent={intent} featured />

      {/* S11: Two Choices */}
      <TwoChoicesSection persona={persona} />

      {/* S12: 20-Module Curriculum */}
      <CurriculumSection />

      {/* S13: Bonuses */}
      <BonusesSection />

      {/* S14: Value Stack */}
      <ValueStackSection readiness={readiness} intent={intent} />

      {/* S15: Career Pathways */}
      <CareerPathwaysSection />

      {/* S16: Income Proof */}
      {intent !== "personal" && (
        <IncomeProofSection incomeGoal={incomeGoal} timeline={timeline} background={background} />
      )}

      {/* S17: Mid CTA */}
      <CTASection
        name={name}
        specLabel={spec.name}
        shortName={spec.shortName}
        intent={intent}
        timeline={timeline}
        checkoutLink={checkoutLink}
        position="mid"
      />

      {/* S18: Detailed Testimonials */}
      <DetailedTestimonialsSection persona={persona} />

      {/* S19: Accreditation */}
      <AccreditationSection />

      {/* S20: Sarah's Story */}
      <SarahStorySection />

      {/* S21: Future Pacing */}
      <FuturePacingSection dreamLife={dreamLife} intent={intent} incomeGoal={incomeGoal} />

      {/* S22: Alumni Support */}
      <AlumniSupportSection />

      {/* S23: More Testimonials */}
      <TestimonialSection persona={persona} intent={intent} featured={false} />

      {/* S24: FAQ */}
      <FAQSection persona={persona} intent={intent} />

      {/* S25: P.S. Closers */}
      <PSClosersSection persona={persona} specialization={specialization} />

      {/* S26: Final CTA */}
      <CTASection
        name={name}
        specLabel={spec.name}
        shortName={spec.shortName}
        intent={intent}
        timeline={timeline}
        checkoutLink={checkoutLink}
        position="final"
        spotsLeft={spotsLeft}
      />

      {/* Enrollment Toasts */}
      <EnrollmentToasts />

      {/* Mobile Sticky CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden"
            style={{
              background: "rgba(253,251,247,0.97)",
              backdropFilter: "blur(8px)",
              borderTop: `2px solid ${B.gold}40`,
              paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            }}
          >
            <a href={checkoutLink} target="_blank" rel="noopener noreferrer">
              <Button
                className="w-full h-14 text-base font-bold rounded-xl"
                style={{ background: B.goldMetallic, color: B.burgundyDark }}
              >
                Start My {spec.shortName} Certification — $97
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-center text-[10px] text-gray-400 mt-1">
              One-time payment &bull; 7-day guarantee &bull; Instant access
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-24 md:hidden" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S2: TRUSTPILOT BAR
// ═══════════════════════════════════════════════════════════════════

function TrustpilotBar() {
  useEffect(() => {
    if (typeof window !== "undefined" && !document.querySelector("script[src*='tp.widget.bootstrap']")) {
      const s = document.createElement("script");
      s.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div className="bg-gray-50 border-b border-gray-200 py-2 px-4">
      <div className="max-w-2xl mx-auto flex justify-center">
        <div
          className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="5419b6ffb0d04a076446a9af"
          data-businessunit-id="68c1ac85e89f387ad19f7817"
          data-style-height="40"
          data-style-width="100%"
          data-token="97dc2424-ea04-41e1-9243-4410327fcd73"
        >
          <a
            href="https://www.trustpilot.com/review/accredipro.academy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S3: HERO SECTION
// ═══════════════════════════════════════════════════════════════════

function HeroSection({
  name, persona, intent, specLabel, background, qualScore, incomeGoal, painPoint, dreamLife, timeline,
}: {
  name: string; persona: Persona; intent: Intent; specLabel: string; background: string; qualScore: number;
  incomeGoal: IncomeGoal; painPoint: PainPoint; dreamLife: DreamLife; timeline: Timeline;
}) {
  const bgLabels: Record<string, string> = {
    nurse: "Healthcare", doctor: "Medical", "allied-health": "Allied Health",
    "mental-health": "Mental Health", wellness: "Wellness", "career-change": "Career Changer",
  };

  const incomeLabels: Record<string, string> = {
    "3k-5k": "$3,000-$5,000", "5k-10k": "$5,000-$10,000",
    "10k-15k": "$10,000-$15,000", "15k-plus": "$15,000+",
  };

  const painLabels: Record<string, string> = {
    "time-for-money": "trading time for money",
    stuck: "feeling stuck with no clear path forward",
    "meant-for-more": "knowing you\u2019re meant for more",
    exhausted: "being exhausted and burned out",
    "no-credential": "having the knowledge but no credential",
  };

  const dreamLabels: Record<string, string> = {
    "time-freedom": "time freedom",
    "financial-freedom": "financial freedom",
    purpose: "purpose and meaning",
    "complete-transformation": "a complete life transformation",
    independence: "independence",
    "all-above": "the complete transformation",
  };

  const timelineLabels: Record<string, string> = {
    immediately: "start immediately",
    "30-days": "start within 30 days",
    "1-3-months": "start within 1-3 months",
    exploring: "explore your options",
  };

  const personaFromLabels: Record<string, string> = {
    "healthcare-pro": "burned-out healthcare professional",
    "health-coach": "undercharging health coach",
    corporate: "unfulfilled corporate professional",
    "stay-at-home-mom": "stay-at-home mom ready for her next chapter",
    "other-passionate": "passionate career changer",
  };

  const incomeLabel = incomeLabels[incomeGoal] || "$5,000-$10,000";
  const painLabel = painLabels[painPoint] || "wanting something more";
  const dreamLabel = dreamLabels[dreamLife] || "a complete life transformation";
  const timelineLabel = timelineLabels[timeline] || "start when you\u2019re ready";
  const personaFrom = personaFromLabels[persona] || "someone ready for change";

  // Hormozi headline: outcome-first, not credential-first
  const headlineText = intent === "personal"
    ? `${name}, Your Path to Mastering ${specLabel} Starts Here`
    : `${name}, Your Path to ${incomeLabel}/Month as a ${specLabel} Specialist Starts Here`;

  // Transformation subhead: pain → promise using THEIR words
  const transformationLine = intent === "personal"
    ? `You said you\u2019re tired of ${painLabel}. You want ${dreamLabel}. And you want to ${timelineLabel}.`
    : `You said you\u2019re tired of ${painLabel}. You want ${dreamLabel}. And you want to ${timelineLabel}.`;

  // Bridge: persona-specific "from X → to Y"
  const bridgeLine = intent === "personal"
    ? `We built this certification path specifically for ${bgLabels[background]?.toLowerCase() || "people"} like you \u2014 so you can master the clinical framework that transforms your health and your family\u2019s.`
    : `We built this certification path specifically for ${bgLabels[background]?.toLowerCase() || "people"} like you \u2014 so you can go from ${personaFrom} to earning ${incomeLabel}/month from home in 6 months or less.`;

  return (
    <section className="px-4 pt-8 pb-6 md:pt-12 md:pb-8">
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <Image src={ASI_LOGO} alt="ASI" width={48} height={48} className="mx-auto" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${B.success}15`, color: B.success }}>
            <CheckCircle className="w-3 h-3 inline mr-1" /> {bgLabels[background] || "Qualified"} Accepted
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${B.gold}15`, color: B.burgundy }}>
            <Award className="w-3 h-3 inline mr-1" /> {qualScore}% Match
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
            <Shield className="w-3 h-3 inline mr-1" /> 9 Accreditations
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight" style={{ color: B.burgundyDark }}>
          {headlineText}
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          {transformationLine}
        </p>

        <p className="text-sm sm:text-base font-medium leading-relaxed max-w-xl mx-auto" style={{ color: B.burgundy }}>
          {bridgeLine}
        </p>

        {/* VSL Embed */}
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 mx-auto max-w-xl" style={{ borderColor: `${B.gold}60` }}>
          <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
            <iframe
              src="https://player.vimeo.com/video/1114478868?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Sarah's Message"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S4: SCHOLARSHIP ANNOUNCEMENT
// ═══════════════════════════════════════════════════════════════════

function ScholarshipAnnouncement({
  name, specLabel, incomeGoal, dreamLife, persona, intent,
}: {
  name: string; specLabel: string; incomeGoal: IncomeGoal; dreamLife: DreamLife; persona: Persona; intent: Intent;
}) {
  const incomeLabels: Record<string, string> = {
    "3k-5k": "$3K-$5K/month", "5k-10k": "$5K-$10K/month",
    "10k-15k": "$10K-$15K/month", "15k-plus": "$15K+/month",
  };

  const dreamLabels: Record<string, string> = {
    "time-freedom": "set your own schedule and be there for what matters",
    "financial-freedom": "never stress about money again",
    purpose: "do work that genuinely transforms lives",
    "complete-transformation": "transform your income, your schedule, and your purpose",
    independence: "build something that\u2019s entirely yours",
    "all-above": "transform everything \u2014 income, freedom, and purpose",
  };

  const incomeLabel = incomeLabels[incomeGoal] || "$5K-$10K/month";
  const dreamLabel = dreamLabels[dreamLife] || "transform your life";

  // Persona-specific value prop under the price
  const valueProps: Record<string, string> = {
    "healthcare-pro": `Your clinical background + this certification = ${incomeLabel} from home. No more 12-hour shifts.`,
    "health-coach": `Go from undercharging coach to Board-Certified practitioner earning ${incomeLabel}. Same passion, 3x the income.`,
    corporate: `Your corporate skills + FM Certification = a practice earning ${incomeLabel}. Work for yourself, on your terms.`,
    "stay-at-home-mom": `Study during nap time, certified in 12 weeks, earning ${incomeLabel} around your family\u2019s schedule.`,
    "other-passionate": `Turn your passion into ${incomeLabel}. No medical background needed \u2014 just the drive you already have.`,
  };

  const personalValueProp = `Master clinical functional medicine and ${dreamLabel}. The deepest health education available for $97.`;

  return (
    <section className="px-4 py-8 md:py-12" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
          style={{ background: `${B.success}15`, color: B.success }}
        >
          <Sparkles className="w-4 h-4" /> YOUR SCORE UNLOCKED SOMETHING SPECIAL
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black" style={{ color: B.burgundyDark }}>
          {name}, You QUALIFY For The
          <br />
          <span style={{ color: B.burgundy }}>AccrediPro Scholarship</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-600 font-medium">
          Functional Medicine Practitioner Certification + <span className="font-bold" style={{ color: B.burgundy }}>{specLabel} Specialist</span>
        </p>

        <div
          className="relative inline-block rounded-2xl px-8 sm:px-12 py-8 border-4"
          style={{ borderColor: B.gold, background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}
        >
          <p className="text-gray-500 text-base mb-1">
            Instead of <span className="line-through font-bold">$2,997</span>
          </p>
          <div className="text-5xl sm:text-6xl md:text-7xl font-black" style={{ color: B.success }}>
            $97
          </div>
          <p className="text-sm sm:text-base text-gray-700 mt-3 max-w-sm mx-auto leading-relaxed font-medium">
            {intent === "personal" ? personalValueProp : (valueProps[persona] || valueProps["other-passionate"])}
          </p>
          <p className="text-gray-500 mt-2 text-xs">One-time payment &bull; Lifetime access &bull; 7-day guarantee</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm mt-3">
            <Zap className="w-4 h-4" />
            Save $2,900 — As a {specLabel} track student
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-lg mx-auto">
          {["One-Time", "Self-Paced", "Lifetime", "4 Certs", "Daily Help", "Updates"].map((t) => (
            <span
              key={t}
              className="bg-white border rounded-full px-2 py-1.5 text-[10px] sm:text-xs font-bold text-center"
              style={{ borderColor: B.gold, color: B.burgundy }}
            >
              ✓ {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S5: BUNDLE IMAGE
// ═══════════════════════════════════════════════════════════════════

function BundleImageSection() {
  return (
    <section className="px-4 pb-8" style={{ background: "#fff" }}>
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl overflow-hidden border-2 shadow-xl" style={{ borderColor: B.gold }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUNDLE_IMG} alt="FM Certification Bundle" className="w-full h-auto" />
        </div>
        {/* Social proof stats */}
        <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm text-gray-500">
          <span className="flex items-center gap-1"><Star className="w-4 h-4" style={{ color: B.gold }} /> 4.8/5 rating</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" style={{ color: B.burgundy }} /> 2,847+ graduates</span>
          <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" style={{ color: B.success }} /> 9 accreditations</span>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S6/S17/S26: CTA SECTION (reusable)
// ═══════════════════════════════════════════════════════════════════

function CTASection({
  name, specLabel, shortName, intent, timeline, checkoutLink, position, spotsLeft,
}: {
  name: string; specLabel: string; shortName: string; intent: Intent; timeline: Timeline;
  checkoutLink: string; position: "first" | "mid" | "final"; spotsLeft?: number;
}) {
  const cta = getCTACopy(timeline, intent);
  const buttonText = `YES — Start My ${shortName} Certification for $97`;

  return (
    <section className="px-4 py-8 md:py-12" style={{ background: position === "final" ? B.burgundyDark : position === "mid" ? "#fff" : B.cream }}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        {position === "final" ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {name}, Your Spot Is Reserved.
              <br />
              <span style={{ color: B.gold }}>Let Sarah Help You Master This.</span>
            </h2>
            <p className="text-white/70 text-base">
              Daily mentorship until certified. 20 modules. 14 bonuses. 9 accreditations.
              <strong className="text-white"> 7-day money-back guarantee.</strong>
            </p>
          </>
        ) : position === "mid" ? (
          <>
            <div className="inline-block rounded-2xl px-8 py-6 border-2" style={{ borderColor: B.gold, background: `${B.gold}08` }}>
              <p className="text-gray-500 text-sm">Scholarship Price</p>
              <p className="text-gray-400 line-through text-lg">$2,997</p>
              <p className="text-4xl font-black" style={{ color: B.success }}>$97</p>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-green-50 border border-green-200">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-green-800 text-sm">100% Money-Back Guarantee</p>
                <p className="text-xs text-green-600">7 days to try it. Not satisfied? Full refund.</p>
              </div>
            </div>
          </>
        ) : (
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: B.burgundyDark }}>
            {cta.headline}
          </h2>
        )}

        <a href={checkoutLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button
            className="w-full max-w-md mx-auto h-auto py-4 sm:py-5 text-sm sm:text-base md:text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all whitespace-normal leading-tight"
            style={{ background: B.goldMetallic, color: B.burgundyDark }}
          >
            <span className="flex items-center justify-center gap-2">
              <span>{buttonText}</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </span>
          </Button>
        </a>

        {position === "first" && (
          <p className="text-sm text-gray-500">{cta.urgencyText}</p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: position === "final" ? "rgba(255,255,255,0.6)" : "#9ca3af" }}>
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Secure</span>
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 7-Day Guarantee</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Instant Access</span>
          <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> 9 Accreditations</span>
        </div>

        {position === "final" && spotsLeft && (
          <p className="text-sm text-white/50">
            Only {spotsLeft} scholarship spots remaining. Your seat is being saved. 🌿
          </p>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S7: MICRO VSL — Animated Sarah message
// ═══════════════════════════════════════════════════════════════════

const INCOME_LABELS: Record<string, string> = {
  "3k-5k": "$3,000-$5,000", "5k-10k": "$5,000-$10,000",
  "10k-15k": "$10,000-$15,000", "15k-plus": "$15,000+",
};

const PAIN_LABELS: Record<string, string> = {
  "time-for-money": "trading time for money",
  stuck: "feeling stuck with no clear path",
  "meant-for-more": "knowing you're meant for more",
  exhausted: "being exhausted and burned out",
  "no-credential": "having knowledge but no credential",
};

function MicroVSLSection({ name, persona, intent, specialization, painPoint, incomeGoal, background }: {
  name: string; persona: Persona; intent: Intent; specialization: Specialization;
  painPoint: PainPoint; incomeGoal: IncomeGoal; background: string;
}) {
  const [started, setStarted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const qual = QUALIFICATION[persona] || QUALIFICATION["other-passionate"];
  const specLabel = getSpecializationLabel(specialization);
  const incomeLabel = INCOME_LABELS[incomeGoal] || "$5,000-$10,000";
  const painLabel = PAIN_LABELS[painPoint] || "wanting something more";

  const lines = [
    `${name}, I just reviewed your clinical assessment.`,
    `You scored in the ${qual.percentile} of all applicants — ${qual.rate} acceptance rate for your profile.`,
    intent === "personal"
      ? `Your interest in ${specLabel.name.toLowerCase()} tells me you're serious about deep clinical knowledge.`
      : `Your ${specLabel.name.toLowerCase()} specialization is one of the highest-demand tracks in our program.`,
    `I see you're ${painLabel}. I know exactly how that feels — I was there too.`,
    intent === "personal"
      ? `This program will give you the clinical framework to truly understand and address root causes.`
      : `The women in your exact situation who completed this certification are now earning ${incomeLabel}/month.`,
    `I've built your complete certification path below. Read through it — then let's talk.`,
  ];

  useEffect(() => {
    if (started) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || visibleLines >= lines.length) return;
    setIsTyping(true);
    const delay = visibleLines === 0 ? 800 : 1800;
    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
      setIsTyping(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, visibleLines, lines.length]);

  return (
    <section ref={sectionRef} className="px-4 py-8 md:py-12" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${B.gold}40`, boxShadow: `0 4px 24px ${B.gold}15` }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: B.burgundyDark }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/80">Sarah&apos;s Assessment Review</span>
            </div>
            <Volume2 className="w-3.5 h-3.5 text-white/50" />
          </div>
          <div className="p-5 md:p-8" style={{ background: B.cream }}>
            {!started ? (
              <button onClick={() => setStarted(true)} className="w-full flex flex-col items-center gap-4 py-6 group cursor-pointer">
                <div className="relative">
                  <Image src={SARAH_AVATAR} alt="Sarah M." width={80} height={80} className="rounded-full border-3 object-cover shadow-lg" style={{ borderColor: B.gold }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" style={{ color: B.burgundy }} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold" style={{ color: B.burgundy }}>Sarah reviewed your assessment</p>
                  <p className="text-sm text-gray-500 mt-1">Tap to see her personalized message</p>
                </div>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-5">
                  <Image src={SARAH_AVATAR} alt="Sarah M." width={48} height={48} className="rounded-full border-2 object-cover flex-shrink-0 shadow-md" style={{ borderColor: B.gold }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: B.burgundy }}>Sarah Mitchell</p>
                    <p className="text-xs text-gray-400">ASI Clinical Director</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {lines.slice(0, visibleLines).map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                      className="rounded-xl px-4 py-3"
                      style={{ background: i === lines.length - 1 ? `${B.gold}12` : "#fff", border: `1px solid ${i === lines.length - 1 ? B.gold + "40" : "#e5e7eb"}` }}>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{line}</p>
                    </motion.div>
                  ))}
                </div>
                {isTyping && visibleLines < lines.length && (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">Sarah is typing...</span>
                  </div>
                )}
                {visibleLines >= lines.length && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center pt-4">
                    <ArrowDown className="w-5 h-5 mx-auto text-gray-300 animate-bounce" />
                    <p className="text-sm text-gray-400 mt-1">Keep scrolling to see your full certification path</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S8: PAIN MIRROR
// ═══════════════════════════════════════════════════════════════════

function PainMirrorSection({ painPoint, persona }: { painPoint: PainPoint; persona: Persona }) {
  const pain = getPainMirror(painPoint, persona);
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>{pain.headline}</h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{pain.subheadline}</p>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{pain.expansion}</p>
        <p className="text-base sm:text-lg font-semibold" style={{ color: B.burgundy }}>
          You&apos;re not alone. Here&apos;s what changed for women in your exact situation...
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S9: CERT IS FOR
// ═══════════════════════════════════════════════════════════════════

function CertIsForSection({ persona }: { persona: Persona }) {
  const rawCards = getCertIsForCards(persona);
  // Sort matching cards FIRST so user sees "THIS IS YOU" at top
  const cards = [...rawCards].sort((a, b) => (a.matchesPersona === b.matchesPersona ? 0 : a.matchesPersona ? -1 : 1));
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
          This Certification Is For...
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative p-5 rounded-xl border-2 text-center transition-all"
              style={{
                borderColor: card.matchesPersona ? B.burgundy : `${B.gold}40`,
                background: card.matchesPersona ? `${B.burgundy}08` : "#fff",
                boxShadow: card.matchesPersona ? `0 4px 20px ${B.burgundy}15` : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {card.matchesPersona && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: B.burgundy }}>
                  ← THIS IS YOU
                </span>
              )}
              <div className="text-3xl mb-3">{card.icon}</div>
              <h4 className="font-bold text-sm mb-2" style={{ color: B.burgundy }}>{card.title}</h4>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S10/S23: TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════

function TestimonialSection({ persona, intent, featured }: { persona: Persona; intent: Intent; featured: boolean }) {
  const testimonials = featured
    ? [getFeaturedTestimonial(persona, intent)].filter(Boolean) as Testimonial[]
    : getTestimonialsForPersona(persona, intent, 3);
  if (!testimonials.length) return null;

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: featured ? "#fff" : B.cream }}>
      <div className="max-w-2xl mx-auto space-y-6">
        {!featured && (
          <h2 className="text-2xl font-bold text-center" style={{ color: B.burgundyDark }}>
            More Stories From Women Like You
          </h2>
        )}
        <div className="space-y-6">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl p-5 sm:p-6 border" style={{ background: "#fff", borderColor: `${B.gold}30` }}>
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <Image src={t.photo} alt={t.name} width={64} height={64} className="rounded-full border-2 object-cover flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16" style={{ borderColor: B.gold }} />
                <div>
                  <p className="font-bold text-sm sm:text-base" style={{ color: B.burgundy }}>{t.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{t.role}</p>
                  {t.monthlyIncome && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${B.success}15`, color: B.success }}>
                      {t.monthlyIncome}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                &ldquo;{featured ? t.quote : t.highlightQuote}&rdquo;
              </p>
              <div className="flex gap-0.5 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-4 h-4 fill-current" style={{ color: B.gold }} />))}
              </div>
              {t.timeToResults && <p className="text-xs text-gray-400 mt-2">Certified in {t.timeToResults}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S11: TWO CHOICES
// ═══════════════════════════════════════════════════════════════════

function TwoChoicesSection({ persona }: { persona: Persona }) {
  const choices = getTwoChoices(persona);
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
          Two Choices (Let&apos;s Be Real)
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl p-5 sm:p-6 shadow-md" style={{ background: "#FFF0F0", border: "2px solid #FFB0B0" }}>
            <h3 className="text-lg font-bold text-red-700 mb-4">Stay Surface-Level ❌</h3>
            <ul className="space-y-3">
              {choices.bad.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-800/80">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-5 sm:p-6 shadow-md" style={{ background: "#F0FFF4", border: `2px solid ${B.success}` }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: B.success }}>Master Functional Medicine ✅</h3>
            <ul className="space-y-3">
              {choices.good.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800/80">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.success }} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S12: CURRICULUM (20 modules)
// ═══════════════════════════════════════════════════════════════════

const MODULES = [
  { num: 1, name: "Functional Medicine Foundations", tag: "", lessons: ["What is Functional Medicine & Why It Matters Now", "The FM Paradigm Shift: From Symptoms to Root Causes", "Core Principles of Functional Medicine Practice", "Your Role as a Functional Medicine Coach"], insight: "This module alone separates you from 95% of wellness coaches." },
  { num: 2, name: "Health Coaching Mastery", tag: "", lessons: ["The Art of Asking Powerful Questions", "Motivational Interviewing for Behavior Change", "Building Trust & Client Compliance", "Managing Resistance & Difficult Conversations"], insight: "Clients don't pay for information — they pay for transformation." },
  { num: 3, name: "Functional Assessment & Case Analysis", tag: "", lessons: ["Comprehensive Health Intake Systems", "Timeline Mapping: Uncovering Hidden Triggers", "Symptom Pattern Recognition", "Building Your Clinical Hypothesis"], insight: "This is where you start thinking like a clinician." },
  { num: 4, name: "Ethics, Scope & Professional Practice", tag: "", lessons: ["Legal Scope of Practice for FM Coaches", "When to Refer: Working with Medical Teams", "Documentation & Liability Protection", "Building Referral Networks with MDs"], insight: "This module protects you legally AND opens doors." },
  { num: 5, name: "Functional Nutrition", tag: "HIGH DEMAND", lessons: ["Therapeutic Diets: Elimination, AIP, Low-FODMAP", "Nutrient Deficiency Assessment", "Food Sensitivities vs. Allergies vs. Intolerances", "Personalized Nutrition Protocol Design"], insight: "Nutrition coaching alone can charge $150-250/session." },
  { num: 6, name: "Gut Health & Microbiome", tag: "80% OF CASES", lessons: ["The Gut as the Foundation of Health", "SIBO, Leaky Gut & Dysbiosis Protocols", "Interpreting Stool Tests & GI Maps", "The 5R Gut Healing Framework"], insight: "80% of your clients will have gut issues. Master this module." },
  { num: 7, name: "Stress, Adrenals & Nervous System", tag: "", lessons: ["HPA Axis Dysfunction Explained", "Burnout Recovery Protocols", "Nervous System Regulation Techniques", "Cortisol Testing & Interpretation"], insight: "Every burnt-out professional is a potential client." },
  { num: 8, name: "Sleep & Circadian Health", tag: "", lessons: ["Sleep Architecture & Why It Matters", "Circadian Rhythm Optimization", "Root Causes of Insomnia", "Sleep Protocols That Actually Work"], insight: "Fix sleep and you fix 50% of health issues." },
  { num: 9, name: "Women's Hormone Health", tag: "$150+/SESSION", lessons: ["Female Hormone Basics: Estrogen, Progesterone, Testosterone", "Menstrual Cycle Optimization", "PMS, PCOS & Endometriosis Protocols", "Hormone Testing Interpretation"], insight: "Women's hormones is the fastest-growing niche." },
  { num: 10, name: "Perimenopause & Menopause", tag: "MASSIVE MARKET", lessons: ["Understanding Hormonal Transitions", "Hot Flashes, Night Sweats & Brain Fog Solutions", "Natural vs. HRT Approaches", "Long-Term Health Optimization Post-Menopause"], insight: "50 million US women are in perimenopause/menopause right now." },
  { num: 11, name: "Thyroid Health", tag: "MOST MISDIAGNOSED", lessons: ["Complete Thyroid Panel Interpretation", "Hashimoto's & Autoimmune Thyroid Protocols", "Thyroid-Gut-Adrenal Connection", "Supporting Clients on Thyroid Medication"], insight: "60% of thyroid patients are undiagnosed." },
  { num: 12, name: "Metabolic Health & Weight", tag: "", lessons: ["Insulin Resistance & Blood Sugar Mastery", "Why Diets Fail: The Metabolic Truth", "Sustainable Weight Loss Protocols", "Metabolic Testing Interpretation"], insight: "Weight loss is a $78B industry with broken solutions." },
  { num: 13, name: "Autoimmunity & Inflammation", tag: "GROWING 15%/YR", lessons: ["Autoimmunity Fundamentals & Triggers", "The Autoimmune Protocol (AIP) Deep Dive", "Managing Flares & Achieving Remission", "Inflammatory Marker Interpretation"], insight: "Autoimmune disease affects 50M Americans." },
  { num: 14, name: "Mental Health & Brain Function", tag: "", lessons: ["The Gut-Brain Axis Explained", "Nutritional Psychiatry Foundations", "Anxiety & Depression Root Causes", "Cognitive Function & Brain Fog Protocols"], insight: "Functional approaches to anxiety and depression are life-changing." },
  { num: 15, name: "Cardiometabolic Health", tag: "", lessons: ["Beyond Cholesterol: Advanced Lipid Analysis", "Blood Pressure Root Cause Approach", "Heart Health Nutrition Protocols", "Cardiovascular Risk Assessment"], insight: "Heart disease is #1 killer. FM coaches save lives." },
  { num: 16, name: "Energy & Mitochondrial Health", tag: "", lessons: ["Mitochondria: Your Cellular Powerhouses", "Chronic Fatigue Syndrome Protocols", "Energy Optimization Strategies", "Testing for Mitochondrial Dysfunction"], insight: "Fatigue is the #1 complaint. Restore energy, become their hero." },
  { num: 17, name: "Detox & Environmental Health", tag: "", lessons: ["Understanding Toxic Load", "Phase 1 & 2 Liver Detoxification", "Safe Detox Protocols (Not Fads)", "Environmental Toxin Assessment"], insight: "Evidence-based detox — not juice cleanse nonsense." },
  { num: 18, name: "Functional Lab Interpretation", tag: "PREMIUM SKILL", lessons: ["Reading Labs Like a Clinician", "Optimal vs. Standard Ranges", "Comprehensive Metabolic Panel Mastery", "Creating Lab-Based Protocols"], insight: "This skill commands premium fees. Explain labs better than their doctor." },
  { num: 19, name: "Protocol Building & Program Design", tag: "", lessons: ["Creating Custom Client Protocols", "Supplement Selection & Dosing", "Program Sequencing & Timing", "Tracking Progress & Adjusting Plans"], insight: "Design protocols that actually work and build your reputation." },
  { num: 20, name: "Building Your FM Practice", tag: "BUSINESS LAUNCH", lessons: ["Pricing Your Services ($100-250/session)", "Attracting Your Ideal Clients", "Marketing Without Being Salesy", "Scaling to $10K/Month & Beyond"], insight: "Most certifications leave you broke. This one builds your business." },
];

function CurriculumSection() {
  const [openModule, setOpenModule] = useState<number | null>(null);
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: B.burgundyDark }}>
            Complete 20-Module Curriculum: The D.E.P.T.H. Method™
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Master the complete functional medicine framework. Earn a certificate for each module. 9 international accreditations included.
          </p>
        </div>
        <div className="space-y-2">
          {MODULES.map((mod) => (
            <div key={mod.num} className="rounded-xl border overflow-hidden" style={{ borderColor: `${B.gold}30` }}>
              <button
                onClick={() => setOpenModule(openModule === mod.num ? null : mod.num)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${B.burgundy}12`, color: B.burgundy }}>
                    {mod.num}
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate">{mod.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="hidden sm:flex items-center gap-1 text-[10px] font-medium" style={{ color: B.gold }}>
                    <CheckCircle className="w-3.5 h-3.5" /> Cert
                  </span>
                  {mod.tag && (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
                      {mod.tag}
                    </span>
                  )}
                  {openModule === mod.num ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>
              {openModule === mod.num && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: `${B.gold}20` }}>
                  <ul className="space-y-2 mt-3">
                    {mod.lessons.map((l, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.success }} />
                        Lesson {i + 1}: {l}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 p-3 rounded-lg text-xs italic" style={{ background: `${B.gold}08`, color: B.burgundy }}>
                    <strong>Sarah&apos;s Insight:</strong> &ldquo;{mod.insight}&rdquo;
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center p-4 rounded-xl font-bold text-sm" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
          20 Modules &bull; 20 Certificates &bull; 9 International Accreditations
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S13: BONUSES ($4,959 value)
// ═══════════════════════════════════════════════════════════════════

const BONUSES = [
  { title: "30 Days FREE Personal Mentorship With Sarah", value: "$997", desc: "Daily check-ins, lab interpretation reviews, case study support, clinical confidence building" },
  { title: "Complete Lab Interpretation Cheat Sheets", value: "$197", desc: "Thyroid panel interpreter, gut test decoder, hormone panel guide, nutrient marker reference" },
  { title: "The Clinical Reasoning Workbook", value: "$197", desc: "20+ real client cases with structured exercises and clinical reasoning frameworks" },
  { title: "Client Communication Scripts", value: "$247", desc: "Word-for-word scripts for discussing lab results, recommending protocols, handling scope boundaries" },
  { title: "Functional Medicine Matrix Masterclass", value: "$197", desc: "Deep-dive on FM matrix for identifying triggers, mediators, and body system connections" },
  { title: "Protocol Design Templates", value: "$197", desc: "Plug-and-play templates for Hashimoto's, SIBO, PCOS, adrenal fatigue, chronic fatigue" },
  { title: "Premium Positioning Guide ($50→$150/hr)", value: "$197", desc: "Pricing strategies, package structures, marketing language for FM specialists" },
  { title: "FM Research Library", value: "$397", desc: "Curated collection of FM studies, protocols, and clinical references organized by condition" },
  { title: "Progress Tracking Systems", value: "$197", desc: "Tools for monitoring biomarker improvements, symptom resolution, and functional capacity" },
  { title: "90-Day Clinical Mastery Roadmap", value: "$197", desc: "Daily action steps from certification to confident practitioner" },
  { title: "Systems Thinking for Root Cause Analysis", value: "$247", desc: "Mental models for seeing connections others miss and designing cascading improvements" },
  { title: "Autoimmune Protocol Deep Dive", value: "$197", desc: "Advanced training for Hashimoto's, RA, Celiac — inflammation cascades and immune modulation" },
  { title: "FREE Coach Workspace Portal", value: "$497", desc: "Digital coaching command center — manage clients, track progress, deliver protocols" },
  { title: "Private Community of 1,247+ Coaches", value: "$997", desc: "Exclusive community for support, wins, questions, networking — lifetime access" },
];

function BonusesSection() {
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: `${B.gold}20` }}>
            <Gift className="w-4 h-4" style={{ color: B.gold }} />
            <span className="text-sm font-bold" style={{ color: B.burgundy }}>INCLUDED FREE WITH YOUR ENROLLMENT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: B.burgundyDark }}>
            Your Complete Bonus Collection
          </h2>
        </div>
        <div className="space-y-3">
          {BONUSES.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl border bg-white"
              style={{ borderColor: i < 3 ? B.gold : `${B.gold}20` }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm" style={{ color: B.burgundy }}>{b.title}</p>
                  <span className="text-xs text-gray-400 line-through whitespace-nowrap">{b.value}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 text-center font-bold" style={{ background: B.burgundyDark, color: B.gold }}>
          Total Bonus Value: $4,959 — Yours FREE When You Enroll Today
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S14: VALUE STACK
// ═══════════════════════════════════════════════════════════════════

function ValueStackSection({ readiness, intent }: { readiness: Readiness; intent: Intent }) {
  const { heroItems, additionalItems } = getValueStack(readiness, intent);
  const allItems = [...heroItems, ...additionalItems];
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
          Everything Included for $97
        </h2>
        <p className="text-center text-gray-500">One payment. Lifetime access. No hidden fees.</p>
        <div className="space-y-3">
          {allItems.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{ borderColor: i < heroItems.length ? B.gold : `${B.gold}20`, background: i < heroItems.length ? `${B.gold}08` : "#fff" }}>
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: i < heroItems.length ? B.gold : B.success }} />
              <div>
                <p className="font-semibold text-sm sm:text-base" style={{ color: B.burgundy }}>{item.label}</p>
                <p className="text-xs sm:text-sm text-gray-500">{item.description}</p>
                {item.value && <span className="inline-block mt-1 text-xs font-bold" style={{ color: B.gold }}>Value: {item.value}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S15: CAREER PATHWAYS
// ═══════════════════════════════════════════════════════════════════

function CareerPathwaysSection() {
  const paths = [
    { percent: "48%", label: "Private Practice", desc: "One-on-one FM coaching" },
    { percent: "26%", label: "Hybrid Model", desc: "Add to existing practice" },
    { percent: "18%", label: "Group Programs", desc: "Gut healing, hormone protocols" },
    { percent: "8%", label: "Corporate Wellness", desc: "Employee health optimization" },
  ];
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
          Career Pathways for FM Coaches
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paths.map((p) => (
            <div key={p.label} className="text-center p-5 rounded-xl bg-white border" style={{ borderColor: `${B.gold}40` }}>
              <p className="text-3xl sm:text-4xl font-black" style={{ color: B.burgundy }}>{p.percent}</p>
              <p className="font-bold text-sm mt-2" style={{ color: B.burgundyDark }}>{p.label}</p>
              <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">
          Most coaches work part-time (15-20 hours/week) from home earning premium rates
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S16: INCOME PROOF
// ═══════════════════════════════════════════════════════════════════

function IncomeProofSection({ incomeGoal, timeline, background }: { incomeGoal: IncomeGoal; timeline: Timeline; background: string }) {
  const roi = getIncomeROI(incomeGoal);
  const timelineLabels: Record<string, string> = {
    immediately: "starting immediately", "30-days": "starting within 30 days",
    "1-3-months": "starting in 1-3 months", exploring: "once you begin",
  };
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-5 sm:p-8 border" style={{ background: B.cream, borderColor: `${B.gold}30` }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: B.burgundyDark }}>{roi.headline}</h2>
          <div className="space-y-4 mt-6">
            <div className="text-center p-4 rounded-xl" style={{ background: `${B.gold}08` }}>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: B.burgundy }}>{roi.roiMath}</p>
              <p className="text-sm text-gray-500 mt-1">{roi.multiplier} return in your first year</p>
            </div>
            <p className="text-sm sm:text-base text-gray-600">{roi.timeframe}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              You said {timelineLabels[timeline] || "you're ready"} — {roi.clientsNeeded}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S18: DETAILED TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════

function DetailedTestimonialsSection({ persona }: { persona: Persona }) {
  const testimonials = getDetailedTestimonials(persona, 6);
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
          Real Results From Real Graduates
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl p-5 border bg-white shadow-sm" style={{ borderColor: `${B.gold}30` }}>
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.largePhoto} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: B.gold }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: B.burgundy }}>
                    {t.name}{t.credential ? `, ${t.credential}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic leading-relaxed mb-3">
                &ldquo;{t.detailedQuote}&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs">
                {t.monthlyIncome && (
                  <span className="px-2 py-1 rounded-full font-bold" style={{ background: `${B.success}15`, color: B.success }}>
                    {t.monthlyIncome}
                  </span>
                )}
                {t.timeToResults && <span className="text-gray-400">Results in {t.timeToResults}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S19: ACCREDITATION
// ═══════════════════════════════════════════════════════════════════

function AccreditationSection() {
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* ASI Institute Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Image src={ASI_LOGO} alt="ASI" width={40} height={40} />
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: B.burgundy }}>AccrediPro International</p>
              <p className="text-xs text-gray-500">Standards Institute</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: B.burgundyDark }}>
            Internationally Accredited — Verified &amp; Trusted
          </h2>
        </div>

        {/* Certificate Image */}
        <div className="max-w-sm mx-auto">
          <div className="rounded-2xl overflow-hidden border-2 shadow-xl" style={{ borderColor: B.gold }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CERT_IMG} alt="Functional Medicine Certificate" className="w-full h-auto" />
          </div>
        </div>

        {/* Accreditation Logos */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ALL_LOGOS} alt="Accreditation Logos" className="max-w-full h-auto" style={{ maxHeight: 60 }} />
        </div>

        {/* 9 Accreditation Names */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: B.burgundy }}>
            Backed by 9 International Certifications
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["CMA", "IPHM", "CPD", "IAOTH", "ICAHP", "IGCT", "CTAA", "IHTCP", "IIOHT"].map((cert) => (
              <span key={cert} className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border" style={{ borderColor: B.gold, color: B.burgundy, background: `${B.gold}08` }}>
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Cert Banner */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CERT_BANNER} alt="9 International Accreditations" className="max-w-full h-auto" style={{ maxHeight: 100 }} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Star className="w-4 h-4" style={{ color: B.gold }} /> 4.8/5 from 489+ reviews</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" style={{ color: B.burgundy }} /> 2,847+ graduates</span>
          <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" style={{ color: B.success }} /> 9 accreditations</span>
        </div>

        {/* Second Trustpilot placement */}
        <div className="pt-4">
          <div
            className="trustpilot-widget"
            data-locale="en-US"
            data-template-id="5419b6ffb0d04a076446a9af"
            data-businessunit-id="68c1ac85e89f387ad19f7817"
            data-style-height="40"
            data-style-width="100%"
            data-token="97dc2424-ea04-41e1-9243-4410327fcd73"
          >
            <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">Trustpilot</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S20: SARAH'S STORY (expanded)
// ═══════════════════════════════════════════════════════════════════

function SarahStorySection() {
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-5 sm:p-8" style={{ background: B.cream, border: `1px solid ${B.gold}30` }}>
          <div className="flex items-start gap-4 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SARAH_LARGE} alt="Sarah Mitchell" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 object-cover flex-shrink-0 shadow-lg" style={{ borderColor: B.gold }} />
            <div>
              <h3 className="text-xl font-bold" style={{ color: B.burgundy }}>Hi, I&apos;m Sarah — Your Personal Mentor</h3>
              <p className="text-sm text-gray-500">ASI Clinical Director &bull; Former ER Nurse</p>
            </div>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              Twenty years ago, I was a basic health coach giving the same generic advice everyone else gave: &ldquo;eat more vegetables, drink more water, reduce stress.&rdquo; And you know what? My clients stayed sick.
            </p>
            <p>
              That changed when I discovered functional medicine — the systematic approach to finding root causes instead of managing symptoms. Suddenly I could help clients who&apos;d been struggling for years because I finally understood how to connect the dots between their gut, hormones, thyroid, and chronic symptoms.
            </p>
            <p>
              Within 8 months, I had my own practice earning more than my ER salary — working from home, setting my own hours, as a single mom.
            </p>
            <div className="p-4 rounded-xl" style={{ background: `${B.gold}08`, border: `1px solid ${B.gold}30` }}>
              <p className="font-bold text-sm mb-2" style={{ color: B.burgundy }}>
                Here&apos;s what I know for sure after training 1,247+ coaches:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.gold }} /> Your desire to help people goes deeper than surface-level wellness tips</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.gold }} /> You CAN master FM principles without going back to school for 4+ years</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.gold }} /> Clients WILL pay $75-200/hour when you can solve problems other coaches can&apos;t</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.gold }} /> Working 15-20 hours a week from home is completely possible</li>
              </ul>
            </div>
            <p className="font-semibold" style={{ color: B.burgundy }}>
              I built this program because I wish someone had built it for me. Every module, every template, every protocol — it&apos;s the exact system I used. And now it&apos;s yours for $97.
            </p>
            <p className="text-sm text-gray-500 italic">
              I&apos;ll personally walk beside you through every step. Daily check-ins. Answering your questions. You&apos;ll never feel alone. 🌿
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S21: FUTURE PACING
// ═══════════════════════════════════════════════════════════════════

function FuturePacingSection({ dreamLife, intent, incomeGoal }: { dreamLife: DreamLife; intent: Intent; incomeGoal: IncomeGoal }) {
  const pacing = getFuturePacing(dreamLife, intent);
  const incomeLabel = INCOME_LABELS[incomeGoal] || "$5,000-$10,000";
  const body = pacing.body.replace(/\{\{INCOME_LABEL\}\}/g, incomeLabel);

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: B.burgundyDark }}>{pacing.headline}</h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">{body}</p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S22: ALUMNI SUPPORT
// ═══════════════════════════════════════════════════════════════════

function AlumniSupportSection() {
  const items = [
    { icon: "📚", title: "Monthly Advanced Case Studies", desc: "New case study reviews every month covering complex scenarios and advanced protocols (free forever)" },
    { icon: "🎓", title: "Quarterly Expert Trainings", desc: "Recorded trainings from FM doctors, researchers, and specialists (included at no cost)" },
    { icon: "💼", title: "Business Growth Resources", desc: "Ongoing training in client acquisition, marketing, pricing, and practice management" },
    { icon: "🤝", title: "Lifetime Community Access", desc: "Stay connected with 1,247+ coaches for support, consultations, and networking" },
    { icon: "🆕", title: "Free Course Updates Forever", desc: "As FM research evolves and new protocols emerge, you automatically get all updates" },
    { icon: "📧", title: "Direct Mentor Support", desc: "Get specific questions answered by Sarah and guest experts through our mentorship platform" },
  ];
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.burgundyDark }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: B.gold }}>
          Ongoing Alumni Support & Development
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-bold text-sm mb-1" style={{ color: B.gold }}>{item.title}</h4>
              <p className="text-xs text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S24: FAQ
// ═══════════════════════════════════════════════════════════════════

function FAQSection({ persona, intent }: { persona: Persona; intent: Intent }) {
  const faqs = getFAQItems(persona, intent);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center" style={{ color: B.burgundyDark }}>Your Questions Answered</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: openIndex === i ? B.gold : "#e5e7eb" }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-sm sm:text-base pr-4" style={{ color: B.burgundy }}>{faq.question}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 flex-shrink-0 text-gray-400" /> : <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />}
              </button>
              {openIndex === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.2 }} className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// S25: P.S. CLOSERS
// ═══════════════════════════════════════════════════════════════════

function PSClosersSection({ persona, specialization }: { persona: Persona; specialization: Specialization }) {
  const closers = getPSClosers(persona, specialization);
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto space-y-8">
        {closers.map((closer, i) => (
          <div key={i} className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold" style={{ color: B.burgundyDark }}>
              P.{i === 0 ? "S." : "P.S."} — {closer.headline}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{closer.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ENROLLMENT TOASTS
// ═══════════════════════════════════════════════════════════════════

const FAKE_ENROLLMENTS = [
  { name: "Jennifer K.", state: "California" },
  { name: "Sarah M.", state: "Texas" },
  { name: "Michelle R.", state: "Florida" },
  { name: "Amanda L.", state: "New York" },
  { name: "Patricia W.", state: "Ohio" },
  { name: "Linda S.", state: "Georgia" },
  { name: "Karen D.", state: "Illinois" },
  { name: "Jessica B.", state: "Virginia" },
];

function EnrollmentToasts() {
  const [toast, setToast] = useState<{ name: string; state: string; minutes: number } | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const showToast = () => {
      const enrollment = FAKE_ENROLLMENTS[indexRef.current % FAKE_ENROLLMENTS.length];
      indexRef.current++;
      setToast({ ...enrollment, minutes: Math.floor(Math.random() * 12) + 1 });
      setTimeout(() => setToast(null), 5000);
    };

    const initialDelay = setTimeout(() => {
      showToast();
      const interval = setInterval(showToast, Math.random() * 15000 + 25000);
      return () => clearInterval(interval);
    }, 20000);

    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-28 md:bottom-6 left-4 z-40 max-w-xs"
        >
          <div className="bg-white rounded-xl shadow-xl border p-3 flex items-center gap-3" style={{ borderColor: `${B.gold}40` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${B.success}15` }}>
              <CheckCircle className="w-5 h-5" style={{ color: B.success }} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {toast.name} from {toast.state}
              </p>
              <p className="text-xs text-gray-500">
                Just enrolled in FM Certification! {toast.minutes} min ago
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
