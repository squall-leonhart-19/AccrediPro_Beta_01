"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Heart,
  Zap,
  Brain,
  Users,
  DollarSign,
  BookOpen,
  GraduationCap,
  BadgeCheck,
  Package,
  Infinity,
  Target,
  Gift,
  MessageCircle,
  Download,
} from "lucide-react";
import { ScholarshipChat } from "@/components/results/scholarship-chat";

// ─── Brand ─────────────────────────────────────────────────────────
const B = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#f7e7a0",
  goldDark: "#b8860b",
  cream: "#fdfbf7",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyGold: "linear-gradient(135deg, #722f37 0%, #d4af37 100%)",
  redSoft: "#fef2f2",
};

const ASI_LOGO = "/asi-logo-transparent.png";
const SARAH = "/coaches/sarah-coach.webp";
const T_KAREN = "/assets/migrated/TESTIMONIAL_03.jpg";
const T_MARGARET = "/assets/migrated/TESTIMONIAL_01.jpg";
const T_CAROLYN = "/assets/migrated/TESTIMONIAL_02.jpg";

// ─── Niche config ───────────────────────────────────────────────
const NICHE_CONFIG: Record<string, { label: string; icon: typeof Heart; desc: string }> = {
  "hormone-health": {
    label: "Hormone Health",
    icon: Heart,
    desc: "Help women optimize hormones, navigate menopause, and restore balance.",
  },
  "gut-health": {
    label: "Gut Health",
    icon: Stethoscope,
    desc: "Master the gut-body connection and help clients heal digestive issues.",
  },
  "weight-metabolism": {
    label: "Weight & Metabolism",
    icon: Zap,
    desc: "Help clients transform their metabolism and manage weight naturally.",
  },
  "energy-burnout": {
    label: "Energy & Burnout Recovery",
    icon: Brain,
    desc: "Help women recover from fatigue and chronic burnout.",
  },
};

const INCOME_MAP: Record<string, { label: string; monthly: number }> = {
  "3k-5k": { label: "$3,000 - $5,000/month", monthly: 4000 },
  "5k-8k": { label: "$5,000 - $8,000/month", monthly: 6500 },
  "8k-12k": { label: "$8,000 - $12,000/month", monthly: 10000 },
  "12k-plus": { label: "$12,000+/month", monthly: 15000 },
};

// ─── Section component ─────────────────────────────────────────────
function Section({ children, className = "", bg = "white", id }: { children: React.ReactNode; className?: string; bg?: string; id?: string }) {
  return (
    <section id={id} className={`rounded-2xl overflow-hidden shadow-lg ${className}`} style={{ background: bg, border: `1px solid ${B.gold}20` }}>
      {children}
    </section>
  );
}

function SectionInner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 sm:p-6 md:p-10 ${className}`}>{children}</div>;
}

// ─── Main ──────────────────────────────────────────────────────────
function MiniDiplomaHealthcareResultsInner() {
  const sp = useSearchParams();

  // Core params
  const firstName = sp.get("name") || "Friend";
  const lastName = sp.get("lastName") || "";
  const email = sp.get("email") || "";
  const nicheKey = sp.get("niche") || "hormone-health";
  const incomeGoalKey = sp.get("incomeGoal") || "5k-8k";
  const persona = sp.get("persona") || "healthcare-pro";

  // Quiz answers
  const q0 = sp.get("q0") || ""; // work situation
  const q2 = sp.get("q2") || ""; // holding back
  const q6 = sp.get("q6") || ""; // belief barrier
  const q8 = sp.get("q8") || ""; // urgency
  const q9 = sp.get("q9") || ""; // commitment level
  const q11 = sp.get("q11") || ""; // time commitment

  const niche = NICHE_CONFIG[nicheKey] || NICHE_CONFIG["hormone-health"];
  const NicheIcon = niche.icon;
  const incomeGoal = INCOME_MAP[incomeGoalKey] || INCOME_MAP["5k-8k"];

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(900); // 15 min
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    timerRef.current = setInterval(() => setCountdown((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Scholarship quiz data for chat widget
  const scholarshipQuizData = {
    product: "mini-diploma",
    niche: nicheKey,
    incomeGoal: incomeGoalKey,
    persona,
    q0, q2, q6, q8, q9, q11,
  };

  const openScholarshipChat = () => {
    if (typeof window !== "undefined" && (window as any).__openScholarshipChat) {
      (window as any).__openScholarshipChat();
    }
  };

  // Dynamic content based on quiz answers
  const urgencyLevel = q8 === "immediately" ? "high" : q8 === "1-3-months" ? "medium" : "low";
  const urgencySpots = urgencyLevel === "high" ? 3 : urgencyLevel === "medium" ? 5 : 7;

  const holdingBackMsg: Record<string, string> = {
    "dont-know-start": "You said you didn't know where to start. The FM Foundations Mini Diploma is EXACTLY that starting point — step 1 of a proven path.",
    "scared-income": "You mentioned being scared of losing income. That's why we designed this as a side-project that builds while you keep your current job.",
    "no-credentials": "You said you don't have credentials. That ends TODAY. This mini diploma is your first recognized credential in functional medicine.",
    "no-time": "You said time is your barrier. The Mini Diploma is just 3 lessons — completable in a weekend. No excuses, just results.",
  };

  // FAQs
  const faqs = [
    { q: "What exactly is the FM Foundations Mini Diploma?", a: "It's a 3-lesson introductory program that gives you the foundational knowledge of functional medicine. You'll receive a digital certificate upon completion and access to our private community. It's the same starting point our highest-earning practitioners used." },
    { q: "How long does it take to complete?", a: "Most students complete it in a weekend (5-7 hours total). It's self-paced, so you can go faster or slower depending on your schedule." },
    { q: "Is this recognized/accredited?", a: "Yes. The FM Foundations Mini Diploma is issued by the AccrediPro Standards Institute (ASI). It's Level 0 of our certification pathway — the foundation for the full DEPTH Method certification." },
    { q: "What happens after I complete the Mini Diploma?", a: "You'll have the option to continue to the full DEPTH Method Certification (Level 1-3) at a discounted rate. Many of our top practitioners started exactly where you are now." },
    { q: "Is there a money-back guarantee?", a: "Absolutely. If you complete the program and don't feel it was worth every penny, just email us within 7 days and we'll refund you in full. No questions asked." },
  ];

  // ─── CTA Button — opens scholarship chat ────────────────────────
  const CTAButton = ({ className = "", variant = "gold" }: { className?: string; variant?: "gold" | "burgundy" }) => (
    <button onClick={openScholarshipChat} className={`block w-full ${className}`}>
      <div className={`w-full h-14 sm:h-16 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all px-4 sm:px-6 flex items-center justify-center cursor-pointer`}
        style={{ background: variant === "burgundy" ? B.burgundy : B.goldMetallic, color: variant === "burgundy" ? "white" : B.burgundyDark }}>
        <span className="sm:hidden">Get My Mini Diploma</span>
        <span className="hidden sm:inline">Get My FM Foundations Mini Diploma — Chat with Sarah</span>
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 flex-shrink-0" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${B.cream} 0%, #f5f0e8 30%, ${B.cream} 100%)` }}>

      {/* ═══ STICKY URGENCY BAR ═══ */}
      <div onClick={openScholarshipChat} className="sticky top-0 z-50 py-2 sm:py-2.5 px-3 sm:px-4 text-center shadow-md cursor-pointer hover:opacity-90 transition-opacity" style={{ background: urgencyLevel === "high" ? B.burgundy : B.goldMetallic }}>
        <p className="text-xs sm:text-sm font-bold" style={{ color: urgencyLevel === "high" ? "white" : B.burgundyDark }}>
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 -mt-0.5" />
          <span className="sm:hidden">{urgencySpots} spots — Claim Now</span>
          <span className="hidden sm:inline">{urgencySpots} scholarship spots remaining for Mini Diploma — {fmt(countdown)}</span>
        </p>
      </div>

      {/* ═══ TRUSTPILOT WIDGET ═══ */}
      {mounted && (
        <div className="bg-white py-2 border-b" style={{ borderColor: `${B.gold}15` }}>
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
            <div
              className="trustpilot-widget"
              data-locale="en-US"
              data-template-id="5419b6ffb0d04a076446a9af"
              data-businessunit-id="68c1ac85e89f387ad19f7817"
              data-style-height="20px"
              data-style-width="100%"
              data-token="73ab2ab9-e3e9-4746-b2df-4f148e213f2c"
            >
              <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">Trustpilot</a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl lg:max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-14 space-y-6 sm:space-y-8">

        {/* ═══ SECTION 1: HERO ═══ */}
        <Section>
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2" style={{ background: B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2" style={{ color: B.burgundyDark }}>
              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> <span className="hidden sm:inline">FM Foundations —</span> Application Accepted
            </span>
            <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: `${B.burgundyDark}20`, color: B.burgundyDark }}>
              Healthcare Track
            </span>
          </div>

          <SectionInner className="text-center space-y-5 sm:space-y-6">
            <Image src={ASI_LOGO} alt="ASI" width={72} height={72} className="mx-auto w-14 h-14 sm:w-[72px] sm:h-[72px]" />

            <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: `${B.burgundy}10`, color: B.burgundy }}>
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> For Healthcare Professionals
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.15]" style={{ color: B.burgundyDark }}>
              {firstName}, You&apos;ve Been Accepted Into
              <br />
              <span style={{ color: B.burgundy }}>FM Foundations Mini Diploma</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              The exact starting point our highest-earning healthcare practitioners used before going full-time. Level 0 of your functional medicine journey begins here.
            </p>

            {/* Niche badge */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
              <NicheIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Specialization: {niche.label}
            </motion.div>

            <CTAButton className="max-w-md mx-auto" />

            <p className="text-xs text-gray-400">Only 34% of applicants qualify. Your spot is reserved for {fmt(countdown)}.</p>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 2: PERSONALIZED CALLOUT ═══ */}
        {holdingBackMsg[q2] && (
          <Section bg={`${B.gold}08`}>
            <SectionInner>
              <div className="flex items-start gap-4">
                <Image src={SARAH} alt="Sarah" width={56} height={56} className="rounded-full border-2 object-cover flex-shrink-0 shadow" style={{ borderColor: B.gold }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: B.burgundy }}>Sarah saw your answer...</p>
                  <p className="text-sm text-gray-700 mt-1">{holdingBackMsg[q2]}</p>
                </div>
              </div>
            </SectionInner>
          </Section>
        )}

        {/* ═══ SECTION 3: WHAT'S INSIDE ═══ */}
        <Section>
          <div className="px-4 sm:px-6 py-3" style={{ background: B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-2" style={{ color: B.burgundyDark }}>
              <BookOpen className="w-4 h-4" /> What&apos;s Inside the Mini Diploma
            </span>
          </div>
          <SectionInner className="space-y-4">
            <p className="text-sm text-gray-600">Everything you need to understand functional medicine foundations and take your first step toward certification:</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: BookOpen, title: "9 Foundation Lessons", desc: "Core functional medicine principles broken down into bite-sized lessons" },
                { icon: GraduationCap, title: "Digital Certificate", desc: "Official FM Foundations certificate to add to your credentials" },
                { icon: Users, title: "Private Community Access", desc: "Join 1,247+ practitioners in our exclusive support community" },
                { icon: Target, title: "Your First Client Blueprint", desc: "Step-by-step guide to landing your first paying client" },
                { icon: Download, title: "Downloadable Resources", desc: "Intake forms, scripts, and templates you can use immediately" },
                { icon: MessageCircle, title: "Direct Access to Sarah", desc: "Ask questions and get guidance as you learn" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border" style={{ borderColor: `${B.gold}20` }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: B.goldMetallic }}>
                      <Icon className="w-4 h-4" style={{ color: B.burgundyDark }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: B.burgundy }}>{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <CTAButton className="mt-4" />
          </SectionInner>
        </Section>

        {/* ═══ SECTION 4: TESTIMONIALS ═══ */}
        <Section>
          <SectionInner className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Healthcare Professionals Who Started Here
            </h2>
            <p className="text-center text-sm text-gray-500">They took the same first step you&apos;re about to take.</p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: "Susan M.", role: "Former ICU Nurse", text: "I started with the Mini Diploma while still working night shifts. 6 months later, I left the hospital. Now earning $6,200/month from home.", photo: T_MARGARET, earnings: "$6,200/mo" },
                { name: "Karen T.", role: "PA to Practitioner", text: "The Mini Diploma gave me the foundation I needed. I was skeptical, but within 90 days I had quit my clinic job. This actually works.", photo: T_KAREN, earnings: "$8,400/mo" },
                { name: "Angela R.", role: "LPN turned FM Specialist", text: "I thought I needed a $15,000 program. Sarah's path cost me less than dinner out — and changed my entire career.", photo: T_CAROLYN, earnings: "$7,100/mo" },
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-white border shadow-sm" style={{ borderColor: `${B.gold}20` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Image src={t.photo} alt={t.name} width={48} height={48} className="rounded-full border-2 object-cover" style={{ borderColor: B.gold }} />
                    <div>
                      <p className="font-bold text-sm" style={{ color: B.burgundy }}>{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-3">&quot;{t.text}&quot;</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Now earning:</span>
                    <span className="font-bold text-sm" style={{ color: B.burgundy }}>{t.earnings}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 5: THE PATH ═══ */}
        <Section bg={`${B.burgundy}06`}>
          <SectionInner className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Your Path: Mini Diploma → Full Certification
            </h2>

            <div className="space-y-3">
              {[
                { step: "Level 0", title: "FM Foundations Mini Diploma", desc: "Where you start. 3 lessons, digital certificate, community access.", status: "You are here", highlight: true },
                { step: "Level 1-3", title: "DEPTH Method Full Certification", desc: "20 modules, clinical protocols, lab interpretation, business system.", status: "Optional upgrade", highlight: false },
                { step: "Result", title: `Earning ${incomeGoal.label}`, desc: `Working with clients in ${niche.label}, setting your own schedule.`, status: "Your goal", highlight: false },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${s.highlight ? "bg-white shadow-md" : "bg-white/50"}`}
                  style={{ borderColor: s.highlight ? B.gold : `${B.gold}20` }}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow ${s.highlight ? "" : "opacity-60"}`} style={{ background: B.goldMetallic }}>
                    <span className="text-xs font-bold" style={{ color: B.burgundyDark }}>{s.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm" style={{ color: B.burgundy }}>{s.title}</p>
                      {s.highlight && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: B.goldMetallic, color: B.burgundyDark }}>← {s.status}</span>}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <CTAButton />
          </SectionInner>
        </Section>

        {/* ═══ SECTION 6: SARAH'S MESSAGE ═══ */}
        <Section bg={`${B.gold}08`}>
          <SectionInner>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image src={SARAH} alt="Sarah M." width={72} height={72} className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full border-3 object-cover shadow-lg flex-shrink-0 self-center sm:self-start" style={{ borderColor: B.gold }} />
              <div className="space-y-3">
                <div>
                  <p className="font-bold" style={{ color: B.burgundy }}>Sarah M. <span className="text-gray-400 font-normal text-sm">- ASI Clinical Director</span></p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400">Former ER Nurse, 12 years</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {firstName}, as a healthcare professional myself, I know what you&apos;re going through. The exhaustion. The frustration. The feeling that there must be something more.
                </p>
                <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: B.burgundy }}>
                  The Mini Diploma is exactly how I started. It&apos;s not just education — it&apos;s your first step toward freedom. I&apos;ll be with you every step of the way. Let&apos;s chat and figure out what scholarship amount works for you. 💛
                </p>
              </div>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 7: GUARANTEE ═══ */}
        <Section>
          <SectionInner className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ background: B.goldMetallic }}>
              <Shield className="w-8 h-8" style={{ color: B.burgundyDark }} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: B.burgundyDark }}>
              7-Day Money-Back Guarantee
            </h2>

            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Complete the Mini Diploma. If you don&apos;t feel it was worth every penny, email us within 7 days and we&apos;ll refund you in full. No questions, no hoops, no hard feelings.
            </p>

            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
              {[
                { val: "7 Days", label: "Full Refund" },
                { val: "Zero", label: "Questions" },
                { val: "100%", label: "Money Back" },
              ].map((g) => (
                <div key={g.label} className="p-2 rounded-lg" style={{ backgroundColor: `${B.gold}08` }}>
                  <div className="text-sm font-bold" style={{ color: B.burgundy }}>{g.val}</div>
                  <div className="text-[9px] text-gray-500">{g.label}</div>
                </div>
              ))}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 8: FAQ ═══ */}
        <Section>
          <SectionInner className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Common Questions
            </h2>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: `${B.gold}20` }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-sm" style={{ color: B.burgundy }}>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-3 sm:p-4 bg-gray-50 text-sm text-gray-600">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 9: FINAL CTA ═══ */}
        <Section>
          <SectionInner className="text-center space-y-5">
            <div className="p-3 rounded-xl" style={{ background: urgencyLevel === "high" ? `${B.burgundy}10` : `${B.gold}15` }}>
              <p className="text-sm font-bold" style={{ color: B.burgundy }}>
                <AlertTriangle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                {urgencySpots} scholarship spots remaining — Your spot reserved for {fmt(countdown)}
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
              Ready to Take the First Step, {firstName}?
            </h2>

            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Chat with Sarah to claim your scholarship spot. She&apos;ll answer any questions and help you get started today.
            </p>

            <CTAButton variant="burgundy" className="max-w-md mx-auto" />

            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="w-3 h-3" /> 7-Day Guarantee
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" /> Complete in a Weekend
              </div>
            </div>
          </SectionInner>
        </Section>

      </div>

      {/* ═══ SCHOLARSHIP CHAT WIDGET ═══ */}
      <ScholarshipChat
        firstName={firstName}
        lastName={lastName}
        email={email}
        quizData={scholarshipQuizData}
      />
    </div>
  );
}

export default function MiniDiplomaHealthcareResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fdfbf7" }}>
        <p className="text-gray-400">Loading your results...</p>
      </div>
    }>
      <MiniDiplomaHealthcareResultsInner />
    </Suspense>
  );
}
