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

// Checkout URL — single $97 front-end
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

// ─── Persona qualification data ───────────────────────────────────
const QUALIFICATION: Record<Persona, { percentile: string; rate: string }> = {
  "healthcare-pro": { percentile: "Top 6%", rate: "94%" },
  "health-coach": { percentile: "Top 12%", rate: "88%" },
  "corporate": { percentile: "Top 18%", rate: "82%" },
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

  // Show mobile sticky CTA only after scroll
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: B.cream }}>
      {/* ── Section 1: HERO — Qualification result (NO CTA) ── */}
      <HeroSection
        name={name}
        persona={persona}
        intent={intent}
        specLabel={spec.name}
        background={background}
        qualScore={props.qualScore || 92}
      />

      {/* ── Section 2: MICRO VSL — Sarah's personalized message ── */}
      <MicroVSLSection
        name={name}
        persona={persona}
        intent={intent}
        specialization={specialization}
        painPoint={painPoint}
        incomeGoal={incomeGoal}
        background={background}
      />

      {/* ── Section 3: PAIN MIRROR ── */}
      <PainMirrorSection painPoint={painPoint} persona={persona} />

      {/* ── Section 4: TRANSFORMATION STORY ── */}
      <TestimonialSection persona={persona} intent={intent} featured />

      {/* ── Section 5: VALUE STACK ── */}
      <ValueStackSection readiness={readiness} intent={intent} />

      {/* ── Section 6: FIRST CTA ── */}
      <CTASection
        name={name}
        specLabel={spec.name}
        intent={intent}
        timeline={timeline}
        checkoutLink={checkoutLink}
        position="first"
      />

      {/* ── Section 7: INCOME PROOF (hidden for personal intent) ── */}
      {intent !== "personal" && (
        <IncomeProofSection incomeGoal={incomeGoal} timeline={timeline} background={background} />
      )}

      {/* ── Section 8: ACCREDITATIONS & TRUST ── */}
      <AccreditationSection />

      {/* ── Section 9: SARAH'S STORY ── */}
      <SarahStorySection />

      {/* ── Section 10: FUTURE PACING ── */}
      <FuturePacingSection dreamLife={dreamLife} intent={intent} incomeGoal={incomeGoal} />

      {/* ── Section 11: MORE TESTIMONIALS ── */}
      <TestimonialSection persona={persona} intent={intent} featured={false} />

      {/* ── Section 12: FAQ ── */}
      <FAQSection persona={persona} intent={intent} />

      {/* ── Section 13: FINAL CTA ── */}
      <CTASection
        name={name}
        specLabel={spec.name}
        intent={intent}
        timeline={timeline}
        checkoutLink={checkoutLink}
        position="final"
      />

      {/* ── Mobile Sticky CTA — only after scroll ── */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden"
            style={{ background: "rgba(253,251,247,0.95)", backdropFilter: "blur(8px)", borderTop: `2px solid ${B.gold}40` }}
          >
            <a href={checkoutLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full h-14 text-lg font-bold rounded-xl" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
                Start My {spec.shortName} Certification — $97
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-center text-[10px] text-gray-400 mt-1">One-time payment &bull; 7-day guarantee &bull; Instant access</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacer for mobile sticky */}
      <div className="h-24 md:hidden" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MICRO VSL — Animated Sarah message (the scroll-stopper)
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

  // Build personalized message lines
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

  // Auto-start when scrolled into view
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

  // Reveal lines one by one
  useEffect(() => {
    if (!started) return;
    if (visibleLines >= lines.length) return;

    setIsTyping(true);
    const delay = visibleLines === 0 ? 800 : 1800; // first line faster
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
          {/* Video-style header bar */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: B.burgundyDark }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/80">Sarah&apos;s Assessment Review</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Message area */}
          <div className="p-5 md:p-8" style={{ background: `${B.cream}` }}>
            {!started ? (
              /* Play prompt */
              <button onClick={() => setStarted(true)} className="w-full flex flex-col items-center gap-4 py-6 group cursor-pointer">
                <div className="relative">
                  <Image src={SARAH_AVATAR} alt="Sarah M." width={80} height={80}
                    className="rounded-full border-3 object-cover shadow-lg" style={{ borderColor: B.gold }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" style={{ color: B.burgundy }} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold" style={{ color: B.burgundy }}>
                    Sarah reviewed your assessment
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Tap to see her personalized message</p>
                </div>
              </button>
            ) : (
              /* Animated message */
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-5">
                  <Image src={SARAH_AVATAR} alt="Sarah M." width={48} height={48}
                    className="rounded-full border-2 object-cover flex-shrink-0 shadow-md" style={{ borderColor: B.gold }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: B.burgundy }}>Sarah Mitchell</p>
                    <p className="text-xs text-gray-400">ASI Clinical Director</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {lines.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="rounded-xl px-4 py-3"
                      style={{
                        background: i === lines.length - 1 ? `${B.gold}12` : "#fff",
                        border: `1px solid ${i === lines.length - 1 ? B.gold + "40" : "#e5e7eb"}`,
                      }}
                    >
                      <p className="text-base text-gray-700 leading-relaxed">{line}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Typing indicator */}
                {isTyping && visibleLines < lines.length && (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-gray-400">Sarah is typing...</span>
                  </div>
                )}

                {/* Scroll prompt after all lines revealed */}
                {visibleLines >= lines.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center pt-4"
                  >
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
// Section Components
// ═══════════════════════════════════════════════════════════════════

function HeroSection({ name, persona, intent, specLabel, background, qualScore }: {
  name: string; persona: Persona; intent: Intent; specLabel: string; background: string; qualScore: number;
}) {
  const subhead = getHeroSubhead(persona, intent);
  const headlineText = intent === "personal"
    ? `${name}, You Pre-Qualify for ${specLabel} Mastery`
    : `${name}, You Pre-Qualify for ASI ${specLabel} Certification`;

  const bgLabels: Record<string, string> = {
    nurse: "Healthcare", doctor: "Medical", "allied-health": "Allied Health",
    "mental-health": "Mental Health", wellness: "Wellness", "career-change": "Career Changer",
  };

  return (
    <section className="px-4 pt-8 pb-6 md:pt-12 md:pb-8">
      <div className="max-w-2xl mx-auto text-center space-y-5">
        {/* ASI Logo */}
        <Image src={ASI_LOGO} alt="ASI" width={48} height={48} className="mx-auto" />

        {/* Qualification badges */}
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

        {/* Main headline */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: B.burgundyDark }}>
          {headlineText}
        </h1>

        {/* Persona subhead */}
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
          {subhead}
        </p>

        {/* Scroll indicator instead of CTA */}
        <div className="flex flex-col items-center gap-1 pt-2 text-gray-400">
          <p className="text-sm">Sarah reviewed your results</p>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function PainMirrorSection({ painPoint, persona }: { painPoint: PainPoint; persona: Persona }) {
  const pain = getPainMirror(painPoint, persona);

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
          {pain.headline}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {pain.subheadline}
        </p>
        <p className="text-base text-gray-500 leading-relaxed">
          {pain.expansion}
        </p>
        <p className="text-lg font-semibold" style={{ color: B.burgundy }}>
          You&apos;re not alone. Here&apos;s what changed for women in your exact situation...
        </p>
      </div>
    </section>
  );
}

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
            <div key={t.id} className="rounded-2xl p-6 border" style={{ background: "#fff", borderColor: `${B.gold}30` }}>
              <div className="flex items-start gap-4 mb-4">
                <Image
                  src={t.photo}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="rounded-full border-2 object-cover flex-shrink-0"
                  style={{ borderColor: B.gold }}
                />
                <div>
                  <p className="font-bold" style={{ color: B.burgundy }}>{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                  {t.monthlyIncome && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${B.success}15`, color: B.success }}>
                      {t.monthlyIncome}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed italic">
                &ldquo;{featured ? t.quote : t.highlightQuote}&rdquo;
              </p>
              <div className="flex gap-0.5 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" style={{ color: B.gold }} />
                ))}
              </div>
              {t.timeToResults && (
                <p className="text-xs text-gray-400 mt-2">Certified in {t.timeToResults}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueStackSection({ readiness, intent }: { readiness: Readiness; intent: Intent }) {
  const { heroItems, additionalItems } = getValueStack(readiness, intent);
  const allItems = [...heroItems, ...additionalItems];

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
          Everything Included for $97
        </h2>
        <p className="text-center text-gray-500">One payment. Lifetime access. No hidden fees.</p>

        <div className="space-y-3">
          {allItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{
                borderColor: i < heroItems.length ? B.gold : `${B.gold}20`,
                background: i < heroItems.length ? `${B.gold}08` : "#fff",
              }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: i < heroItems.length ? B.gold : B.success }} />
              <div>
                <p className="font-semibold text-base" style={{ color: B.burgundy }}>{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
                {item.value && (
                  <span className="inline-block mt-1 text-xs font-bold" style={{ color: B.gold }}>
                    Value: {item.value}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IncomeProofSection({ incomeGoal, timeline, background }: { incomeGoal: IncomeGoal; timeline: Timeline; background: string }) {
  const roi = getIncomeROI(incomeGoal);

  const timelineLabels: Record<string, string> = {
    immediately: "starting immediately",
    "30-days": "starting within 30 days",
    "1-3-months": "starting in 1-3 months",
    exploring: "once you begin",
  };

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-6 md:p-8 border" style={{ background: B.cream, borderColor: `${B.gold}30` }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: B.burgundyDark }}>
            {roi.headline}
          </h2>
          <div className="space-y-4 mt-6">
            <div className="text-center p-4 rounded-xl" style={{ background: `${B.gold}08` }}>
              <p className="text-3xl font-bold" style={{ color: B.burgundy }}>{roi.roiMath}</p>
              <p className="text-sm text-gray-500 mt-1">{roi.multiplier} return in your first year</p>
            </div>
            <p className="text-base text-gray-600">
              {roi.timeframe}
            </p>
            <p className="text-sm text-gray-500">
              You said {timelineLabels[timeline] || "you're ready"} — {roi.clientsNeeded}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccreditationSection() {
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: B.burgundyDark }}>
          Internationally Accredited — Verified &amp; Trusted
        </h2>
        <p className="text-gray-500">9 international accrediting bodies. Check each one yourself.</p>

        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ACCREDITATION_LOGOS}
            alt="9 International Accreditations"
            className="max-w-full h-auto opacity-90"
            style={{ maxHeight: 80 }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" style={{ color: B.gold }} /> 4.8/5 from 489+ reviews
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" style={{ color: B.burgundy }} /> 2,847+ certified
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" style={{ color: B.success }} /> 9 accreditations
          </span>
        </div>
      </div>
    </section>
  );
}

function CTASection({ name, specLabel, intent, timeline, checkoutLink, position }: {
  name: string; specLabel: string; intent: Intent; timeline: Timeline; checkoutLink: string; position: "first" | "final";
}) {
  const cta = getCTACopy(timeline, intent);
  const buttonText = intent === "personal"
    ? `Start My ${specLabel} Mastery — $97`
    : `Start My ${specLabel} Certification — $97`;

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: position === "final" ? B.cream : "#fff" }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {position === "final" ? (
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
            {name}, your {specLabel.toLowerCase()} certification is waiting.
          </h2>
        ) : (
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
            {cta.headline}
          </h2>
        )}

        <p className="text-lg text-gray-600">{cta.urgencyText}</p>

        <a href={checkoutLink} target="_blank" rel="noopener noreferrer">
          <Button className="h-16 px-10 text-xl font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
            {buttonText}
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Secure Checkout</span>
          <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> 7-Day Guarantee</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Instant Access</span>
        </div>
      </div>
    </section>
  );
}

function SarahStorySection() {
  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-6 md:p-8" style={{ background: B.cream, border: `1px solid ${B.gold}30` }}>
          <div className="flex items-start gap-4 mb-6">
            <Image
              src={SARAH_AVATAR}
              alt="Sarah Mitchell"
              width={80}
              height={80}
              className="rounded-full border-3 object-cover flex-shrink-0 shadow-lg"
              style={{ borderColor: B.gold }}
            />
            <div>
              <h3 className="text-xl font-bold" style={{ color: B.burgundy }}>Meet Sarah Mitchell</h3>
              <p className="text-sm text-gray-500">ASI Clinical Director &bull; Former ER Nurse</p>
            </div>
          </div>

          <div className="space-y-4 text-base text-gray-700 leading-relaxed">
            <p>
              For 14 years, I was an ER nurse. I loved helping people, but the system was breaking me.
              12-hour shifts, mandatory overtime, watching patients get worse because we only treated symptoms.
            </p>
            <p>
              Then Rebecca walked into my ER. Chronic fatigue, brain fog, weight gain — the same story
              I&apos;d heard hundreds of times. We ran labs. Everything was &ldquo;normal.&rdquo; I sent her home
              with a pamphlet. That was the system. And it haunted me.
            </p>
            <p>
              I found Functional Medicine, got certified, and for the first time I could actually help
              people like Rebecca. I found the root cause. I created protocols. She got better.
              Within 8 months, I had my own practice earning more than my ER salary — working from home,
              setting my own hours, as a single mom.
            </p>
            <p className="font-semibold" style={{ color: B.burgundy }}>
              I built this program because I wish someone had built it for me. Every module, every template,
              every protocol — it&apos;s the exact system I used to go from burned-out nurse to thriving
              practitioner. And now it&apos;s yours for $97.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FuturePacingSection({ dreamLife, intent, incomeGoal }: { dreamLife: DreamLife; intent: Intent; incomeGoal: IncomeGoal }) {
  const pacing = getFuturePacing(dreamLife, intent);
  const incomeLabel = INCOME_LABELS[incomeGoal] || "$5,000-$10,000";

  const body = pacing.body.replace(/\{\{INCOME_LABEL\}\}/g, incomeLabel);

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
          {pacing.headline}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          {body}
        </p>
      </div>
    </section>
  );
}

function FAQSection({ persona, intent }: { persona: Persona; intent: Intent }) {
  const faqs = getFAQItems(persona, intent);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-10 md:py-14" style={{ background: B.cream }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center" style={{ color: B.burgundyDark }}>
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: openIndex === i ? B.gold : "#e5e7eb" }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-base" style={{ color: B.burgundy }}>{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
                )}
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4"
                >
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
