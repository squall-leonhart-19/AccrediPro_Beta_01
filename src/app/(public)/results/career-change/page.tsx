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
  Activity,
  FlaskConical,
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
  ArrowUpRight,
  Gift,
  XCircle,
  CalendarClock,
  Ban,
  Timer,
  MessageCircle,
  Download,
  Laptop,
  Users2,
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
const CERT_IMG = "https://learn.accredipro.academy/FUNCTIONAL_MEDICINE_CERTIFICATE.webp";
const FM_BUNDLE_IMG = "https://assets.accredipro.academy/fm-certification/FM-BUNDLE-IMG.png";
const COACH_WORKSPACE_IMG = "https://assets.accredipro.academy/fm-certification/coach-workspace.png";
const COMMUNITY_IMG = "https://assets.accredipro.academy/fm-certification/community.png";
const LOGOS = "/all-logos.png";
const SARAH = "/coaches/sarah-coach.webp";
const T_KAREN = "/assets/migrated/TESTIMONIAL_03.jpg";
const T_MARGARET = "/assets/migrated/TESTIMONIAL_01.jpg";
const T_CAROLYN = "/assets/migrated/TESTIMONIAL_02.jpg";

// ─── Practitioner config ───────────────────────────────────────────
const PRACT: Record<string, { label: string; specialization: string; icon: typeof Activity; desc: string; modules: string[]; clients: string }> = {
  "hormone-health": {
    label: "Functional Medicine Certification",
    specialization: "Hormone Health",
    icon: Activity,
    desc: "Help women optimize hormones, navigate menopause, and restore balance using clinical protocols.",
    modules: ["Hormone Panel Interpretation", "Menopause & Perimenopause Protocols", "PCOS Root-Cause Framework", "Thyroid Optimization System", "HRT Alternative Protocols"],
    clients: "women struggling with menopause, PCOS, thyroid issues, and hormonal imbalance",
  },
  "gut-restoration": {
    label: "Functional Medicine Certification",
    specialization: "Gut Restoration",
    icon: FlaskConical,
    desc: "Master the gut-body connection and help clients heal digestive issues using root-cause protocols.",
    modules: ["GI-MAP & Stool Analysis", "SIBO/IMO Clinical Protocols", "Leaky Gut Repair Framework", "Microbiome Restoration System", "Food Sensitivity Clinical Testing"],
    clients: "clients with IBS, SIBO, bloating, food sensitivities, and chronic digestive issues",
  },
  "metabolic-optimization": {
    label: "Functional Medicine Certification",
    specialization: "Metabolic Optimization",
    icon: Zap,
    desc: "Help clients transform their metabolism, manage weight, and optimize energy through clinical protocols.",
    modules: ["Metabolic Panel Deep-Dive", "Insulin Resistance Reversal", "Thyroid-Metabolism Connection", "Clinical Weight Management", "Energy Optimization Protocols"],
    clients: "clients battling weight resistance, fatigue, metabolic syndrome, and energy crashes",
  },
  "burnout-recovery": {
    label: "Functional Medicine Certification",
    specialization: "Burnout Recovery",
    icon: Brain,
    desc: "Help high-achieving women recover from adrenal fatigue and chronic burnout using evidence-based protocols.",
    modules: ["HPA Axis Assessment", "Cortisol Rhythm Analysis", "Adrenal Recovery Protocols", "Nervous System Regulation", "Burnout-to-Vitality Framework"],
    clients: "high-achieving women suffering from chronic fatigue, adrenal dysfunction, and burnout",
  },
  "autoimmune-support": {
    label: "Functional Medicine Certification",
    specialization: "Autoimmune Support",
    icon: Stethoscope,
    desc: "Help clients manage autoimmune conditions naturally using the DEPTH Method clinical framework.",
    modules: ["Autoimmune Panel Interpretation", "Trigger Identification System", "Anti-Inflammatory Protocols", "Immune Modulation Framework", "Flare Prevention Strategies"],
    clients: "clients with Hashimoto's, RA, lupus, MS, and other autoimmune conditions",
  },
};

const INCOME_MAP: Record<string, { label: string; monthly: number; yearly: number }> = {
  "5k": { label: "$5,000/month", monthly: 5000, yearly: 60000 },
  "10k": { label: "$10,000/month", monthly: 10000, yearly: 120000 },
  "20k": { label: "$20,000/month", monthly: 20000, yearly: 240000 },
  "50k-plus": { label: "$50,000+/month", monthly: 50000, yearly: 600000 },
};

const CURRENT_INCOME_MAP: Record<string, { label: string; monthly: number }> = {
  "0": { label: "$0", monthly: 0 },
  "under-2k": { label: "under $2K", monthly: 1500 },
  "2k-5k": { label: "$2K-$5K", monthly: 3500 },
  "over-5k": { label: "$5K+", monthly: 6000 },
};

// Scholarship model — no checkout page, chat-based sales

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
function CareerChangeResultsInner() {
  const sp = useSearchParams();

  // Core params
  const firstName = sp.get("name") || "Friend";
  const lastName = sp.get("lastName") || "";
  const email = sp.get("email") || "";
  const typeKey = sp.get("type") || "hormone-health";
  const goalKey = sp.get("goal") || "10k";
  const role = sp.get("role") || "other-passionate";

  // ALL quiz answers for hyper-personalization
  const currentIncome = sp.get("currentIncome") || "0";
  const experience = sp.get("experience") || "no-experience";
  const clinicalReady = sp.get("clinicalReady") || "not-very";
  const labInterest = sp.get("labInterest") || "want-to-learn";
  const pastCerts = sp.get("pastCerts") || "first-time";
  const missingSkill = sp.get("missingSkill") || "framework";
  const commitment = sp.get("commitment") || "absolutely";
  const vision = sp.get("vision") || "all-above";
  const startTimeline = sp.get("startTimeline") || "2-weeks";

  const pract = PRACT[typeKey] || PRACT["hormone-health"];
  const PractIcon = pract.icon;
  const income = INCOME_MAP[goalKey] || INCOME_MAP["10k"];
  const curIncome = CURRENT_INCOME_MAP[currentIncome] || CURRENT_INCOME_MAP["0"];

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(startTimeline === "this-week" ? 1200 : 1800);
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
    type: typeKey, goal: goalKey, role, currentIncome, experience,
    clinicalReady, labInterest, pastCerts, missingSkill, commitment, vision, startTimeline,
  };

  const openScholarshipChat = () => {
    if (typeof window !== "undefined" && (window as any).__openScholarshipChat) {
      (window as any).__openScholarshipChat();
    }
  };

  const sessionsNeeded = Math.ceil(income.monthly / 800);
  const weeklyClients = Math.ceil(sessionsNeeded / 4);
  const incomeGap = income.monthly - curIncome.monthly;
  const yearlyLoss = incomeGap * 12;

  // Urgency intensity based on Q12
  const urgencySpots = startTimeline === "this-week" ? 3 : startTimeline === "2-weeks" ? 5 : 7;
  const urgencyText = startTimeline === "this-week"
    ? `URGENT: Only ${urgencySpots} scholarship spots left — chat with Sarah now`
    : `${urgencySpots} scholarship spots remaining — ${fmt(countdown)}`;

  // ─── Dynamic hero subtitle based on Q8 (missing skill) ──────────
  const heroSubtitle: Record<string, string> = {
    "framework": `You said you're missing a real clinical framework. DEPTH gives you the exact 5-phase system — Discover, Evaluate, Pinpoint, Transform, Heal — that transforms your coaching practice into a ${income.label} clinical business.`,
    "confidence": `You said you need confidence to charge premium prices. The ASI certification IS that confidence. When clients see those credentials, you'll command $150-250/session without hesitation.`,
    "client-system": `You said you need a proven system to get clients. Our Business Setup System is included — and 73% of certified practitioners land their first premium clients within 30 days of certification.`,
    "credibility": `You said you need credibility and recognized credentials. ASI accreditation gives you the clinical legitimacy that separates you from every other "wellness coach" out there — and justifies premium rates.`,
  };

  // ─── Dynamic Sarah message based on Q10 (vision) ────────────────
  const sarahVision: Record<string, string> = {
    "leave-job": `I can see it in your answers — you're ready to go full-time with your coaching practice. I made that leap 4 years ago and it was terrifying. But ${firstName}, within 6 months I was earning more than I ever dreamed possible working 20 hours a week. 67% of our certified practitioners go full-time within a year. Your spot is waiting.`,
    "security": `Financial security — that's what drove me too. I spent years building other people's businesses while barely scraping by. Now I have savings, investments, and zero financial anxiety. ${firstName}, your coaching skills are worth so much more than you're currently charging. DEPTH shows you how to capture that value.`,
    "fulfillment": `You got into coaching to help people transform — not to be another generic "wellness coach" lost in the noise. I felt the same frustration. ${firstName}, DEPTH lets you practice at a clinical level that gets REAL results. Real root-cause work. Real transformation. Real fulfillment. That's worth more than any paycheck.`,
    "all-above": `Freedom, security, AND fulfillment — you want the complete transformation. I did too, ${firstName}. And I got it. Built my practice from scratch, now I earn more working less and actually love what I do. Your coaching experience makes you the perfect candidate. The only question is whether you'll take the step.`,
  };

  // ─── Dynamic timeline based on Q4 (experience) + Q12 ───────────
  const timelineWeeks: Record<string, number> = {
    "active-clients": 3,
    "past-clients": 5,
    "informal": 6,
    "no-experience": 7,
  };
  const certWeeks = timelineWeeks[experience] || 6;
  const clientsTimeline = experience === "active-clients" ? "immediately — with your existing patients/clients" : experience === "past-clients" ? "within 2-3 weeks of certification" : "within 30 days of certification";

  // ─── Dynamic clinical framing based on Q5 ───────────────────────
  const clinicalFraming: Record<string, { headline: string; body: string }> = {
    "very-confident": { headline: "Sharpen Your Clinical Edge", body: `You said you're already confident identifying root causes. DEPTH doesn't start from zero with you — it adds the functional medicine lens, the lab interpretation protocols, and the clinical decision-making framework that takes your existing coaching skills to a truly clinical level.` },
    "somewhat": { headline: "Turn Instinct Into Certainty", body: `You said you can identify SOME causes — that means your coaching instincts are already working. DEPTH gives you the systematic 5-phase framework that turns "I think it might be..." into "I know exactly what's happening and here's the protocol." That confidence gap is worth $100K+/year.` },
    "not-very": { headline: "Bridge the Root-Cause Gap", body: `You said you'd need to research to identify root causes — that's the reality for most coaches without clinical training. That's the EXACT gap DEPTH was built to fill. In 4-6 weeks, you'll have a systematic framework for every complex case.` },
    "refer-out": { headline: "Become the Expert They Refer TO", body: `You said you'd refer complex cases to someone else. What if YOU were that someone else? With DEPTH certification, other coaches will actively refer their toughest cases TO you. That's not a fantasy — it's what our certified practitioners experience every day.` },
  };
  const clinicalMsg = clinicalFraming[clinicalReady] || clinicalFraming["not-very"];

  // ─── Dynamic past cert section based on Q7 ──────────────────────
  const showPastCertSection = pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus" || pastCerts === "some-value";
  const pastCertContent: Record<string, { headline: string; intro: string }> = {
    "multiple-disappointed": { headline: `${firstName}, You Said You've Been Burned Before`, intro: `You told us you've invested in multiple coaching certifications and they were disappointing. We hear this from 50%+ of coaches who come to us. Here's why DEPTH is different from everything you've tried:` },
    "spent-5k-plus": { headline: `${firstName}, You've Already Spent $5K+ on Coaching Programs`, intro: `That's a lot of money for "still feeling unprepared." You're not alone — the coaching industry is full of expensive fluff with no clinical application. Here's why DEPTH coaches earn their investment back within 60 days:` },
    "some-value": { headline: `Good Foundation — But You're Ready for Clinical Grade`, intro: `You said your past certifications gave you SOME value. DEPTH doesn't compete with those — it builds on top of them and takes you from "certified coach" to "clinical practitioner" with the protocols, lab skills, and business system those programs never taught.` },
  };

  // ─── FAQs (dynamic based on all answers) ──────────────────────────
  const faqs = [
    { q: "How does this differ from other coaching certifications?", a: "DEPTH isn't another generic coaching cert. It's a clinical methodology — complete with lab interpretation, protocol building, and root-cause analysis. You'll have the skills to work with complex cases that other coaches have to refer out. That's what commands premium rates." },
    { q: "Do I need a medical background to enroll?", a: "Absolutely not. The DEPTH Method was designed for coaches without medical training. We break down clinical concepts in plain English and give you step-by-step protocols to follow. Many of our top performers came from zero clinical background." },
    ...(pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus" ? [{ q: "I've wasted money on certifications before. How is THIS different?", a: "Most programs sell theory. DEPTH delivers a clinical framework you can apply immediately — real protocols, real lab interpretation, real client systems. Plus, our Business Setup System helps you land paying clients within 30 days. That's why 73% of graduates do. And with the 7-day money-back guarantee, you risk nothing." }] : []),
    { q: "Will this actually help me get clients?", a: "Yes. The Business Setup System is included and teaches you exactly how to attract and convert premium clients. 73% of our coaches land their first paying client within 30 days of certification. The credential + the system = results." },
    ...(experience === "no-experience" ? [{ q: "I haven't worked with clients directly yet — is that okay?", a: "Absolutely. 38% of our top performers started with zero direct client experience. Your passion for helping people IS your foundation. DEPTH adds the clinical framework, and the Business Setup System teaches you exactly how to attract and serve clients." }] : []),
    { q: "Can I legally work with clients after this certification?", a: "Yes. As a coach (not a doctor), you're not diagnosing or treating diseases — you're supporting clients with education, protocols, and lifestyle optimization. DEPTH teaches you to work ethically and legally while delivering powerful results." },
    ...(commitment === "not-sure" || commitment === "rearrange" ? [{ q: "What if I can't study every day?", a: "The program is 100% self-paced. You don't need to study daily — even 3-4 sessions per week works great. Many of our coaches study during lunch breaks or after the kids are asleep. There's no deadline pressure, only progress." }] : []),
    { q: "Is this lifetime access or a subscription?", a: "Lifetime access. Once you enroll, you have unlimited access forever — including all future updates, new protocols, and community features. No recurring fees, no expiration date, no surprise charges. It's yours for life." },
    { q: "Is this a one-time payment?", a: "Yes. This is a one-time investment with no hidden fees or ongoing subscriptions. Through Sarah's scholarship program, you pay what you can — and that's it. You'll never be charged again for this certification." },
    { q: "Is the program self-paced?", a: "100% self-paced. There are no live class schedules or deadlines to keep up with. Study whenever works for you — the material is always there when you are. Most graduates finish in 8-12 weeks at just 20 minutes per day." },
    { q: "What if I already have other certifications?", a: "DEPTH stacks on top of what you already have. Your existing certifications gave you a foundation — DEPTH gives you the clinical edge that separates you from every other coach in your niche. Many of our top performers had 2-3 certifications before DEPTH." },
  ];

  // ─── CTA Button — opens scholarship chat ────────────────────────
  const CTAButton = ({ className = "", variant = "gold" }: { className?: string; variant?: "gold" | "burgundy" }) => (
    <button onClick={openScholarshipChat} className={`block w-full ${className}`}>
      <div className={`w-full h-14 sm:h-16 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all px-4 sm:px-6 flex items-center justify-center cursor-pointer`}
        style={{ background: variant === "burgundy" ? B.burgundy : B.goldMetallic, color: variant === "burgundy" ? "white" : B.burgundyDark }}>
        <span className="sm:hidden">Apply for Scholarship</span>
        <span className="hidden sm:inline">Apply for Your ASI Scholarship — Chat with Sarah</span>
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 flex-shrink-0" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${B.cream} 0%, #f5f0e8 30%, ${B.cream} 100%)` }}>

      {/* ═══ STICKY URGENCY BAR (dynamic intensity from Q12) — clickable ═══ */}
      <div onClick={openScholarshipChat} className="sticky top-0 z-50 py-2 sm:py-2.5 px-3 sm:px-4 text-center shadow-md cursor-pointer hover:opacity-90 transition-opacity" style={{ background: startTimeline === "this-week" ? B.burgundy : B.goldMetallic }}>
        <p className="text-xs sm:text-sm font-bold" style={{ color: startTimeline === "this-week" ? "white" : B.burgundyDark }}>
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 -mt-0.5" />
          <span className="sm:hidden">{urgencySpots} spots — Apply Now</span>
          <span className="hidden sm:inline">{urgencyText}</span>
        </p>
      </div>

      {/* ═══ TRUSTPILOT WIDGET (client-only to avoid hydration mismatch from Trustpilot script) ═══ */}
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

        {/* ═══ SECTION 1: HERO (dynamic subtitle from Q8) ═══ */}
        <Section>
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2" style={{ background: B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2" style={{ color: B.burgundyDark }}>
              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> <span className="hidden sm:inline">ASI Clinical Assessment —</span> Results
            </span>
            <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: `${B.burgundyDark}20`, color: B.burgundyDark }}>
              Career Change Track
            </span>
          </div>

          <SectionInner className="text-center space-y-5 sm:space-y-6">
            <Image src={ASI_LOGO} alt="ASI" width={72} height={72} className="mx-auto w-14 h-14 sm:w-[72px] sm:h-[72px]" />

            <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: `${B.burgundy}10`, color: B.burgundy }}>
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> For Career Changers
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.15]" style={{ color: B.burgundyDark }}>
              {firstName}, Your New Wellness Career Could Be Worth {income.label}
              <br />
              <span style={{ color: B.burgundy }}>Here&apos;s the Missing Piece.</span>
            </h1>

            {/* DYNAMIC subtitle from Q8 missing skill */}
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              {heroSubtitle[missingSkill] || heroSubtitle["framework"]}
            </p>

            {/* Practitioner badge */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
              <PractIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> {pract.label} — Specialized in {pract.specialization}
            </motion.div>

            {/* Certificate */}
            <div className="flex justify-center pt-2">
              <div className="relative w-full max-w-sm">
                <Image src={CERT_IMG} alt="Your Certificate" width={560} height={400} className="rounded-xl shadow-2xl border-2" style={{ borderColor: `${B.gold}60` }} />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap" style={{ background: B.burgundy, color: "white" }}>
                  Specialized in {pract.specialization}
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-gray-500 italic pt-2">ASI {pract.label} — stacks with your RN/PA/MA, doubling your clinical value and opening private practice doors.</p>

            {/* SCHOLARSHIP OFFER - No scary price anchor */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto p-5 sm:p-6 rounded-2xl border-2 shadow-lg" style={{ borderColor: B.gold, background: `linear-gradient(135deg, ${B.gold}08 0%, white 50%, ${B.gold}08 100%)` }}>
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: B.gold }}>🎉 Scholarship Program</p>
                <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: B.burgundy }}>Pay What You Can Afford</p>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                  Name your investment. If you qualify, the Institute covers the rest. No loans. No debt. Just opportunity.
                </p>
                <p className="text-sm sm:text-base font-bold px-4 py-2 rounded-lg inline-block" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
                  🏛️ 94% of Applicants Get Approved
                </p>
              </div>
              <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-4 pt-3 border-t" style={{ borderColor: `${B.gold}20` }}>
                <Sparkles className="w-3 h-3 inline mr-1" style={{ color: B.gold }} />
                <strong>Limited Lifetime Opportunity</strong> — One payment, access forever, no subscriptions, no renewals
              </p>
            </motion.div>

            {/* Trustpilot inline */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <div key={s} className="w-4 h-4 flex items-center justify-center" style={{ backgroundColor: "#00b67a" }}>
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">Excellent 4.9</span>
              <span className="text-xs text-gray-400">• 1,197+ reviews on Trustpilot</span>
            </div>

            {/* ★★★ HERO CTA — ABOVE THE FOLD ★★★ */}
            <div className="pt-2 space-y-3">
              <CTAButton className="max-w-md mx-auto" />
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" style={{ color: B.gold }} /> 7-Day Money-Back</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" style={{ color: "#22c55e" }} /> 94% Approval Rate</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" style={{ color: B.burgundy }} /> No Credit Card Required</span>
              </div>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 2: "YOU TOLD US" CALLOUT (from Q2 current income) ═══ */}
        <Section bg={`${B.gold}08`}>
          <SectionInner className="space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <Image src={SARAH} alt="Sarah M." width={48} height={48} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 object-cover shadow-md flex-shrink-0" style={{ borderColor: B.gold }} />
              <div>
                <p className="font-bold text-sm" style={{ color: B.burgundy }}>Sarah reviewed your assessment:</p>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                  {currentIncome === "0" && `"${firstName}, you told me you're currently earning $0 from health & wellness work. That actually puts you in a powerful position — no bad habits, no low-rate clients to "upgrade." You're starting with a clean slate and your clinical training as your foundation. Let me show you exactly how to go from $0 to ${income.label}."`}
                  {currentIncome === "under-2k" && `"${firstName}, you said you're earning under $2K/month. With your clinical background, you should be earning 5-10x that. The gap between ${curIncome.label}/month and ${income.label} isn't about working harder — it's about having the right certification and framework. Let me show you the bridge."`}
                  {currentIncome === "2k-5k" && `"${firstName}, $2K-$5K/month is solid — but with your healthcare credentials? You're leaving serious money on the table. Your clinical training makes you worth $200+/session, not $50. DEPTH closes that gap. I've seen nurses go from exactly where you are to ${income.label} in under 6 months."`}
                  {currentIncome === "over-5k" && `"${firstName}, you're already earning $5K+ — impressive for a healthcare professional. But here's what I know: DEPTH certification could take you from $5K to ${income.label} because you'll add functional medicine protocols, lab interpretation, and group programs. The ceiling disappears."`}
                </p>
              </div>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 3: PAIN POINTS ═══ */}
        <Section>
          <SectionInner className="space-y-5 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
              {firstName}, Does This Sound Like You?
            </h2>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {[
                { emoji: "😤", title: "Competing with thousands of identical coaches", desc: `Every day, more coaches flood your niche with the same generic advice.${currentIncome === "0" || currentIncome === "under-2k" ? " You're fighting for scraps while they undercut your prices." : ""} Without clinical differentiation, you're just another voice in the noise.` },
                { emoji: "💊", title: "Referring out your best opportunities", desc: `When clients come to you with complex cases — hormones, gut issues, fatigue — you have to send them somewhere else.${clinicalReady === "refer-out" || clinicalReady === "not-very" ? " You FEEL it — but you don't have the functional framework yet to help them." : " You KNOW there's a better way."} Those referrals could be $200/hr sessions.` },
                { emoji: "💸", title: "Certifications that didn't pay off", desc: `You've invested in programs, courses, maybe even multiple certifications.${pastCerts === "spent-5k-plus" ? " You even told us you've spent $5K+ on other certifications and STILL feel unprepared." : ""} But none of them gave you the clinical edge to command premium rates.` },
                { emoji: "🔒", title: "Impostor syndrome holding you back", desc: `You KNOW you're good at what you do.${vision === "leave-job" ? " You said you want to go full-time — but something's holding you back." : ""} But without proper clinical training, you hesitate to charge what you're worth. The confidence gap is costing you thousands.` },
              ].map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-4 sm:p-5 rounded-xl border bg-white shadow-sm" style={{ borderColor: `${B.burgundy}15` }}>
                  <div className="text-2xl mb-2">{p.emoji}</div>
                  <h3 className="font-bold mb-1 text-sm sm:text-base" style={{ color: B.burgundy }}>{p.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-500 italic">If you felt a knot in your stomach reading any of that — you&apos;re in the right place.</p>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 4: COST OF INACTION (dynamic from Q2 current income) ═══ */}
        <Section bg={B.redSoft}>
          <SectionInner className="space-y-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2 -mt-1" style={{ color: "#dc2626" }} />
              The Cost of Doing Nothing
            </h2>

            <p className="text-center text-sm text-gray-600">
              {firstName}, if you close this page and keep coaching without clinical tools, here&apos;s what the next 12 months look like:
            </p>

            <div className="space-y-3">
              {[
                { icon: Timer, text: `2,080+ more hours of hospital shifts at your current rate`, color: "#dc2626" },
                { icon: DollarSign, text: `$${yearlyLoss.toLocaleString()} in lost income you'll NEVER recover`, color: "#dc2626" },
                { icon: CalendarClock, text: `Another year of someone else controlling your schedule, your patients, your income`, color: "#dc2626" },
                { icon: Ban, text: `Watching LESS qualified people earn 3-5x more because they have the right certification`, color: "#dc2626" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white shadow-sm border border-red-100">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                    <span className="text-xs sm:text-sm text-gray-700">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 sm:p-5 rounded-xl border-2 text-center" style={{ borderColor: B.burgundy, background: `${B.burgundy}08` }}>
              <p className="text-sm font-bold" style={{ color: B.burgundy }}>
                {currentIncome === "0" ? "Every month you wait" : `The gap between ${curIncome.label}/month and ${income.label}`} is not a someday problem.
                <br />It&apos;s a <span className="underline">${yearlyLoss.toLocaleString()}/year</span> problem. Starting today.
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 italic">
              You spent 4+ years in nursing school to earn $28/hr. DEPTH takes {certWeeks} weeks and leads to $200/hr. The ROI isn&apos;t even comparable.
            </p>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 5: BEFORE → AFTER ═══ */}
        <Section bg={`${B.burgundy}06`}>
          <SectionInner className="space-y-5 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Your Life Before vs. After Certification
            </h2>

            <div className="space-y-3">
              {[
                { before: `Earning ${curIncome.label}/mo, capped`, after: `Earning ${income.label}, uncapped` },
                { before: '"Take this prescription and come back"', after: '"Let me find the actual root cause"' },
                { before: "12-hour shifts, no autonomy", after: `${experience === "active-clients" ? "3-4 hour" : "4-hour"} days, YOUR schedule` },
                { before: clinicalReady === "refer-out" ? "Referring complex cases to others" : "Following hospital protocols you disagree with", after: "Being the specialist everyone refers TO" },
                { before: "Burned out, questioning your career", after: "Fulfilled, doing medicine the RIGHT way" },
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-3 sm:p-4 rounded-xl bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="sm:flex-1 sm:text-right">
                      <span className="text-xs sm:text-sm text-gray-400 line-through">{t.before}</span>
                    </div>
                    <div className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center flex-shrink-0 shadow" style={{ background: B.goldMetallic }}>
                      <ArrowRight className="w-4 h-4" style={{ color: B.burgundyDark }} />
                    </div>
                    <div className="sm:flex-1 flex items-center gap-2">
                      <div className="sm:hidden w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: B.goldMetallic }}>
                        <ArrowRight className="w-3 h-3" style={{ color: B.burgundyDark }} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold" style={{ color: B.burgundy }}>{t.after}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ MID-PAGE CTA ═══ */}
        <div className="space-y-2">
          <CTAButton />
          <p className="text-center text-[10px] text-gray-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 7-Day Money-Back Guarantee</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> Pay What You Can</span>
          </p>
        </div>

        {/* ═══ SECTION 6: CLINICAL EDGE (dynamic from Q5 clinical readiness) ═══ */}
        <Section>
          <SectionInner className="space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: B.goldMetallic }}>
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: B.burgundyDark }} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: B.burgundyDark }}>{clinicalMsg.headline}</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{clinicalMsg.body}</p>
              </div>
            </div>

            {labInterest === "already-doing" && (
              <div className="p-3 sm:p-4 rounded-xl border" style={{ backgroundColor: `${B.gold}08`, borderColor: `${B.gold}30` }}>
                <p className="text-xs sm:text-sm" style={{ color: B.burgundy }}>
                  <Sparkles className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: B.gold }} />
                  <strong>You&apos;re ahead of 95% of applicants.</strong> You said you&apos;re already learning lab interpretation. DEPTH will systematize and elevate your skills to clinical-grade functional interpretation.
                </p>
              </div>
            )}
            {labInterest === "want-to-learn" && (
              <div className="p-3 sm:p-4 rounded-xl border" style={{ backgroundColor: `${B.gold}08`, borderColor: `${B.gold}30` }}>
                <p className="text-xs sm:text-sm" style={{ color: B.burgundy }}>
                  <Sparkles className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: B.gold }} />
                  <strong>Lab interpretation is THE income multiplier.</strong> You said you want to learn — Modules 7-9 cover everything from ordering panels to clinical decision-making. Your healthcare background means you already speak the language.
                </p>
              </div>
            )}
          </SectionInner>
        </Section>

        {/* ═══ SECTION 7: TESTIMONIALS (personalized by quiz) ═══ */}
        <Section>
          <SectionInner className="space-y-5 sm:space-y-6">
            {/* Warm bonding header — personalized to quiz answers */}
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: B.gold }}>You&apos;re Not Alone In This</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
                Hear From Healthcare Women{" "}
                <span className="underline decoration-2" style={{ textDecorationColor: B.gold, color: B.burgundy }}>Exactly Like You</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
                {currentIncome === "0" || currentIncome === "under-2k"
                  ? `They started where you are right now — ${curIncome.label}/month, unsure if this was even possible. Read their words. You'll feel like they're talking directly to you.`
                  : currentIncome === "over-5k"
                  ? `They were already earning well — but they felt the same ceiling you feel. Here's what happened when they added DEPTH to their clinical career.`
                  : `They were in your exact shoes — career changers earning ${curIncome.label}/month, wondering if there was something more. There was.`
                }
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* ─── Testimonial 1: Karen — personalized to experience + income ─── */}
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-5 sm:p-6 md:p-8 rounded-2xl border bg-white shadow-md" style={{ borderColor: `${B.gold}30` }}>
                {/* Match badge */}
                {(experience === "active-clients" || experience === "past-clients") && (
                  <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold w-fit" style={{ background: `${B.gold}12`, color: B.burgundy }}>
                    <Heart className="w-3 h-3" style={{ color: B.gold }} /> Her story sounds familiar? She was just like you.
                  </div>
                )}
                <div className="flex items-start gap-3 sm:gap-4">
                  <Image src={T_KAREN} alt="Karen L." width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 object-cover shadow-lg flex-shrink-0" style={{ borderColor: B.gold }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" style={{ color: B.gold }} />)}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;I was a family practice nurse for <strong>18 years</strong>. Eighteen. I loved my patients, I loved the work, but I hit a wall. The hospital kept adding responsibilities, cutting staff, and I was making the same $32/hour I made five years ago. I remember sitting in my car after a 14-hour shift, crying, thinking <em>&apos;there has to be something more than this.&apos;</em>&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;I found ASI on a Sunday night. I almost didn&apos;t sign up — I&apos;d been burned by two other certifications before{pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus" ? " (sound familiar?)" : ""}. But something about the clinical framework felt <em>real</em>. Not fluffy wellness coaching — actual root-cause protocols I could use with real patients.&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed font-medium" style={{ color: B.burgundy }}>
                        &ldquo;Within 4 weeks I was applying DEPTH protocols with my first private clients. Within 3 months I handed in my hospital resignation. Now? <strong>I earn $11,400/month</strong>, I work {experience === "active-clients" ? "about 20 hours a week" : "3-4 hour days"}, and I actually practice medicine the way I always dreamed. My nurse friends think I&apos;m crazy. My bank account thinks I&apos;m a genius.&rdquo;
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${B.gold}20` }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm sm:text-base" style={{ color: B.burgundy }}>Karen L.</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">Former Family Practice Nurse, 18 years • Age 47</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
                            Before: $32/hr hospital
                          </div>
                          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold" style={{ background: `${B.gold}15`, color: B.burgundy }}>
                            <ArrowUpRight className="w-3 h-3 inline mr-0.5 -mt-0.5" /> Now: $11,400/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ─── Testimonial 2: Margaret — personalized to vision + commitment ─── */}
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="p-5 sm:p-6 md:p-8 rounded-2xl border bg-white shadow-md" style={{ borderColor: `${B.gold}30` }}>
                {vision === "leave-job" && (
                  <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold w-fit" style={{ background: `${B.gold}12`, color: B.burgundy }}>
                    <Heart className="w-3 h-3" style={{ color: B.gold }} /> She wanted to leave her job too — just like you told us.
                  </div>
                )}
                {vision === "fulfillment" && (
                  <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold w-fit" style={{ background: `${B.gold}12`, color: B.burgundy }}>
                    <Heart className="w-3 h-3" style={{ color: B.gold }} /> She wanted fulfillment — just like you told us.
                  </div>
                )}
                <div className="flex items-start gap-3 sm:gap-4">
                  <Image src={T_MARGARET} alt="Margaret S." width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 object-cover shadow-lg flex-shrink-0" style={{ borderColor: B.gold }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" style={{ color: B.gold }} />)}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;I need to be honest with you — when I clicked &apos;enroll,&apos; my hands were shaking. I was a PA for 9 years. My husband thought I was having a midlife crisis. My mom said &apos;why would you leave a perfectly good job?&apos; Everyone around me thought I was making the biggest mistake of my life.&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;But here&apos;s what nobody understood: I was <strong>dying inside</strong>. 14-hour shifts. 8 minutes per patient. Watching people leave with prescriptions I knew wouldn&apos;t fix the real problem. I came home too exhausted to play with my kids. I was a shell of myself. {vision === "leave-job" || vision === "fulfillment" ? "If you're reading this and you FEEL that — I SEE you." : "I bet some of you know exactly what I mean."}&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;DEPTH gave me my life back. Not overnight — I won&apos;t lie to you. I studied 20 minutes during my kids&apos; nap time{commitment === "rearrange" || commitment === "not-sure" ? " (even when I felt too tired)" : ""}. I practiced protocols on weekends. It took me about 5 weeks to certify. But the day I walked into my hospital for the <em>last time</em>... I cried again. Happy tears this time.&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed font-medium" style={{ color: B.burgundy }}>
                        &ldquo;Now I set my OWN hours. I see 3-4 clients a day, max. I&apos;m home for school pickup every day. I earn more than my PA salary — I won&apos;t share exact numbers, but let&apos;s just say my husband stopped asking questions. <strong>If I can do it at 42 with two kids, you can do it too.</strong> I promise.&rdquo;
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${B.gold}20` }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm sm:text-base" style={{ color: B.burgundy }}>Margaret S.</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">Former Physician Assistant, 9 years • Mom of 2 • Age 42</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
                            Before: 14-hr shifts, dying inside
                          </div>
                          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold" style={{ background: `${B.gold}15`, color: B.burgundy }}>
                            <ArrowUpRight className="w-3 h-3 inline mr-0.5 -mt-0.5" /> Now: Own practice, own hours
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ─── Testimonial 3: Carolyn — personalized to age/fear + past certs ─── */}
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="p-5 sm:p-6 md:p-8 rounded-2xl border bg-white shadow-md" style={{ borderColor: `${B.gold}30` }}>
                {(experience === "no-experience" || experience === "informal") && (
                  <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold w-fit" style={{ background: `${B.gold}12`, color: B.burgundy }}>
                    <Heart className="w-3 h-3" style={{ color: B.gold }} /> She had no functional medicine experience either — look at her now.
                  </div>
                )}
                {(pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus") && (
                  <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold w-fit" style={{ background: `${B.gold}12`, color: B.burgundy }}>
                    <Heart className="w-3 h-3" style={{ color: B.gold }} /> She was burned by other certs too — then she found DEPTH.
                  </div>
                )}
                <div className="flex items-start gap-3 sm:gap-4">
                  <Image src={T_CAROLYN} alt="Carolyn R." width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 object-cover shadow-lg flex-shrink-0" style={{ borderColor: B.gold }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" style={{ color: B.gold }} />)}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;I&apos;m going to tell you something embarrassing: I was 54 years old, sitting on my couch, scrolling through this EXACT page you&apos;re looking at right now — and I almost closed the tab. I thought, &apos;I&apos;m too old. It&apos;s too late. This is for younger women.&apos; I&apos;m SO glad I didn&apos;t close it.&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;I&apos;d been an ICU nurse for 22 years. {pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus" ? "I'd already spent over $6,000 on two other certifications that promised the world and delivered PowerPoint slides. I was DONE trusting programs." : "I'd never done any certification outside of nursing. The idea of starting something new at my age terrified me."} My back hurt. My spirit was broken. I was counting down the years until retirement and dreading every single one of them.&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#374151" }}>
                        &ldquo;The DEPTH framework clicked for me because it felt like <em>real medicine</em> — not coaching, not woo-woo, not another Instagram certification. Real clinical protocols. Real lab interpretation. Things my ICU brain could latch onto. I certified in 5 weeks studying during my days off.&rdquo;
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed font-medium" style={{ color: B.burgundy }}>
                        &ldquo;Within 60 days of certification I had <strong>5 paying clients</strong>. Within 4 months, 14 clients. My hospital colleagues — some of them 20 years younger — are asking ME how I did it. I tell every single one of them: <strong>&apos;It&apos;s never too late. I started at 54 and it was the best decision of my life.&apos;</strong> If you&apos;re reading this and you&apos;re scared — do it scared. I did.&rdquo;
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${B.gold}20` }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm sm:text-base" style={{ color: B.burgundy }}>Carolyn R.</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">Former ICU Nurse, 22 years • Started at age 54</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold" style={{ background: `${B.burgundy}10`, color: B.burgundy }}>
                            Before: Counting to retirement
                          </div>
                          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold" style={{ background: `${B.gold}15`, color: B.burgundy }}>
                            <ArrowUpRight className="w-3 h-3 inline mr-0.5 -mt-0.5" /> Now: 14 clients, 5 weeks in
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* "I'm not the only one" bonding line */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-center p-4 sm:p-5 rounded-2xl border-2" style={{ borderColor: B.gold, background: `${B.gold}06` }}>
              <p className="text-sm sm:text-base font-medium" style={{ color: B.burgundy }}>
                {firstName}, these aren&apos;t influencers or fitness models.
                <br className="hidden sm:block" />{" "}
                These are <strong>real nurses, real PAs, real healthcare women</strong> — just like you.
                <br className="hidden sm:block" />{" "}
                They were scared. They did it anyway. <strong>Now it&apos;s your turn.</strong>
              </p>
            </motion.div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 8: PAST CERT RECOVERY (conditional from Q7) ═══ */}
        {showPastCertSection && (
          <Section bg={`${B.burgundy}06`}>
            <SectionInner className="space-y-5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
                {pastCertContent[pastCerts]?.headline}
              </h2>

              <p className="text-sm text-gray-600 text-center">{pastCertContent[pastCerts]?.intro}</p>

              <div className="space-y-3">
                {[
                  { old: "Theory-heavy, no clinical application", depth: "Real protocols you apply with real clients from Week 1" },
                  { old: "No lab interpretation training", depth: "Modules 7-9: complete functional lab ordering and interpretation" },
                  { old: "No business/client acquisition system", depth: "Business Setup System included — 73% land paying clients in 30 days" },
                  { old: "Generic coaching framework", depth: "5-phase DEPTH clinical framework: Discover, Evaluate, Pinpoint, Transform, Heal" },
                  { old: "No recognized accreditation", depth: "ASI-accredited certification that stacks with your RN/PA credentials" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="p-3 sm:p-4 rounded-xl bg-white shadow-sm border" style={{ borderColor: `${B.gold}20` }}>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4">
                      <div className="sm:flex-1 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-gray-400 line-through">{item.old}</span>
                      </div>
                      <div className="sm:flex-1 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: B.gold }} />
                        <span className="text-xs sm:text-sm font-medium" style={{ color: B.burgundy }}>{item.depth}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {pastCerts === "spent-5k-plus" && (
                <p className="text-center text-xs text-gray-500 italic">
                  Plus, the 7-day money-back guarantee means if THIS doesn&apos;t feel different from Day 1, you pay nothing. Zero risk.
                </p>
              )}
            </SectionInner>
          </Section>
        )}

        {/* ═══ SECTION 9: WHO THIS IS NOT FOR ═══ */}
        <Section>
          <SectionInner className="space-y-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Who This is <span className="underline">NOT</span> For
            </h2>
            <p className="text-center text-xs sm:text-sm text-gray-500">We turn away 60%+ of applicants. This program is exclusive for a reason.</p>

            <div className="space-y-2">
              {[
                "People looking for a \"get rich quick\" scheme with zero effort",
                "Anyone unwilling to study 20 minutes a day (or at least 3-4x per week)",
                "People who want to sell supplements, not help clients heal",
                "Those who aren't genuinely passionate about functional medicine",
                "Anyone not willing to follow a proven clinical framework",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 sm:p-3">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-500">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border-2" style={{ borderColor: B.gold, background: `${B.gold}08` }}>
              <p className="text-xs sm:text-sm font-medium text-center" style={{ color: B.burgundy }}>
                <CheckCircle className="w-4 h-4 inline mr-1 -mt-0.5" style={{ color: B.gold }} />
                {firstName}, based on your assessment — you passed.{" "}
                {commitment === "absolutely" ? "Your commitment level scored in the top tier." :
                 commitment === "yes-work" ? "Your willingness to make it work shows you're serious." :
                 "Your dedication to rearranging your schedule shows real commitment."}
                {" "}You&apos;re exactly who this program was built for.
              </p>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 10: SPECIALIZATION + WHY NURSES ═══ */}
        <Section>
          <div className="px-4 sm:px-6 py-3" style={{ background: B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-2" style={{ color: B.burgundyDark }}>
              <PractIcon className="w-4 h-4 flex-shrink-0" /> {pract.label} — {pract.specialization} Specialization
            </span>
          </div>
          <SectionInner className="space-y-5">
            <p className="text-sm sm:text-base text-gray-600">{pract.desc}</p>
            <p className="text-xs sm:text-sm text-gray-500">With your {pract.label} specialized in {pract.specialization}, you&apos;ll work with {pract.clients}.</p>

            <div className="space-y-2">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: B.burgundy }}>Key Modules in Your Specialization:</p>
              {pract.modules.map((m, i) => (
                <div key={i} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg" style={{ backgroundColor: `${B.gold}08` }}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
                    {i + 1}
                  </div>
                  <span className="text-xs sm:text-sm font-medium" style={{ color: B.burgundy }}>{m}</span>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 rounded-xl border" style={{ backgroundColor: `${B.burgundy}06`, borderColor: `${B.burgundy}15` }}>
              <p className="text-xs sm:text-sm" style={{ color: B.burgundy }}>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 -mt-0.5" style={{ color: B.gold }} />
                <strong>Your Clinical Advantage:</strong> Based on your assessment, you&apos;ll complete this specialization in approximately <strong>{certWeeks} weeks</strong> and have your first paying clients {clientsTimeline}.
              </p>
            </div>

            {/* Full 20-Module Curriculum Accordion */}
            <details className="group rounded-xl border overflow-hidden" style={{ borderColor: `${B.gold}40` }}>
              <summary className="flex items-center justify-between gap-2 p-3 sm:p-4 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" style={{ color: B.burgundy }} />
                  <span className="text-xs sm:text-sm font-bold" style={{ color: B.burgundy }}>View Full 20-Module Curriculum</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 sm:p-4 bg-gray-50 space-y-1.5">
                {[
                  "Functional Medicine Foundations",
                  "Health Coaching Mastery",
                  "Functional Assessment & Case Analysis",
                  "Ethics, Scope & Professional Practice",
                  "Functional Nutrition",
                  "Gut Health & Microbiome",
                  "Stress, Adrenals & Nervous System",
                  "Sleep & Circadian Health",
                  "Women's Hormone Health",
                  "Perimenopause & Menopause",
                  "Thyroid Health",
                  "Metabolic Health & Weight",
                  "Autoimmunity & Inflammation",
                  "Mental Health & Brain Function",
                  "Cardiometabolic Health",
                  "Energy & Mitochondrial Health",
                  "Detox & Environmental Health",
                  "Functional Lab Interpretation",
                  "Protocol Building & Program Design",
                  "Building Your FM Practice",
                ].map((module, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
                      {i + 1}
                    </div>
                    <span className="text-[11px] sm:text-xs text-gray-700">{module}</span>
                    <CheckCircle className="w-3 h-3 ml-auto text-green-500 flex-shrink-0" />
                  </div>
                ))}
                <p className="text-[10px] text-center text-gray-500 pt-2">Each module includes video lessons, clinical protocols, and a completion certificate.</p>
              </div>
            </details>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 11: INCOME MATH ═══ */}
        <Section bg={`${B.burgundy}06`}>
          <SectionInner className="space-y-5 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
              The Math: {curIncome.label}/mo {"->"} {income.label}
            </h2>
            <p className="text-center text-xs sm:text-sm text-gray-500">Simple, realistic numbers based on our healthcare graduate data.</p>

            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-white shadow-sm border" style={{ borderColor: `${B.gold}30` }}>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3" style={{ color: B.burgundy }}>Income Stream 1: Private Sessions</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">{weeklyClients} clients/week x $200/session x 4 weeks</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Average DEPTH practitioner rate: $150-250/session</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold whitespace-nowrap" style={{ color: B.burgundy }}>${(weeklyClients * 200 * 4).toLocaleString()}/mo</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-white shadow-sm border" style={{ borderColor: `${B.gold}30` }}>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3" style={{ color: B.burgundy }}>Income Stream 2: Group Programs</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">1 group program x 10 clients x $497</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">8-week {typeKey === "hormone-health" ? "hormone reset" : typeKey === "gut-restoration" ? "gut healing" : "health transformation"} programs are the most popular</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold whitespace-nowrap" style={{ color: B.burgundy }}>$4,970/mo</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl shadow-md border-2" style={{ borderColor: B.gold, background: `${B.gold}08` }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                  <div>
                    <p className="text-sm font-bold" style={{ color: B.burgundy }}>Combined Monthly Potential</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">Sessions + Group Programs</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold" style={{ color: B.burgundy }}>{income.label}+</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                <div className="p-3 sm:p-4 rounded-xl bg-white text-center shadow-sm border" style={{ borderColor: "#e5e7eb" }}>
                  <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Your Current</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-400 line-through">{curIncome.label}/mo</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400">Capped. Exhausting.</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl text-center shadow-md border-2" style={{ borderColor: B.gold, background: `${B.gold}08` }}>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: B.burgundy }}>With DEPTH</p>
                  <p className="text-lg sm:text-xl font-bold" style={{ color: B.burgundy }}>{income.label}</p>
                  <p className="text-[9px] sm:text-[10px]" style={{ color: B.burgundy }}>Uncapped. Flexible.</p>
                </div>
              </div>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ MID-PAGE CTA 2 ═══ */}
        <div className="space-y-2">
          <CTAButton />
          <p className="text-center text-[10px] text-gray-400">Scholarships available now — chat with Sarah to check eligibility</p>
        </div>

        {/* ═══ SECTION 12: VALUE STACK ═══ */}
        <Section>
          <div className="px-4 sm:px-6 py-3" style={{ background: B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold" style={{ color: B.burgundyDark }}>Everything Inside the DEPTH Method Certification</span>
          </div>
          <SectionInner className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { icon: BookOpen, title: "20-Module Clinical Curriculum", desc: "From foundations to advanced lab interpretation — complete clinical training", value: "Included" },
                { icon: GraduationCap, title: "ASI-Accredited Certification", desc: "Nationally recognized credential that stacks with your RN/PA", value: "Included" },
                { icon: FlaskConical, title: "Functional Lab Training", desc: labInterest === "already-doing" ? "Systematize and elevate your existing lab skills to clinical grade" : "Learn to order and interpret real lab panels — the #1 income multiplier", value: "Included" },
                { icon: DollarSign, title: "Business Setup System", desc: missingSkill === "client-system" ? "You said this is exactly what you need — client acquisition done for you" : "Client acquisition, pricing strategy, and practice launch — done for you", value: "Included" },
                { icon: Users, title: "1-on-1 Mentorship Access", desc: "Personal guidance from ASI clinical directors including Sarah M.", value: "Included" },
                { icon: Target, title: "Done-For-You Protocols", desc: `Ready-to-use ${pract.specialization.toLowerCase()} templates for every client type`, value: "Included" },
                { icon: Package, title: "Physical Welcome Kit", desc: "Certificate, practitioner badge, and branded materials mailed to your door", value: "Included" },
                { icon: Infinity, title: "Lifetime Access + Updates", desc: "All future curriculum updates and community access included forever", value: "Included" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white border shadow-sm" style={{ borderColor: `${B.gold}20` }}>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${B.gold}15` }}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: B.burgundy }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-xs sm:text-sm" style={{ color: B.burgundy }}>{item.title}</p>
                        <p className="text-[10px] sm:text-xs font-bold whitespace-nowrap" style={{ color: B.gold }}>{item.value}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 text-center space-y-4" style={{ borderColor: B.gold, background: `${B.gold}08` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.gold }}>ASI Scholarship Program</p>
              <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: B.burgundy }}>Pay What You Can Afford</p>
              <div className="pt-2">
                <p className="text-sm text-gray-600 max-w-md mx-auto">The Institute believes in accessibility. Name your investment — if approved, we cover the difference.</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  Tell Sarah what you can invest and she&apos;ll check if the institute can cover the difference through a scholarship.
                </p>
              </div>
              <CTAButton variant="burgundy" />
              <p className="text-[10px] text-gray-400 italic">No obligation. No pressure. Just an honest conversation with Sarah about what works for you.</p>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ FM BUNDLE IMAGE ═══ */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-xl border-2 max-w-3xl mx-auto" style={{ borderColor: B.gold }}>
          <Image src={FM_BUNDLE_IMG} alt="Functional Medicine Certification Bundle" width={1200} height={800} className="w-full h-auto" />
        </motion.div>

        {/* ═══ SECTION 13: BONUSES ═══ */}
        <Section bg={`${B.gold}08`}>
          <div className="px-4 sm:px-6 py-3" style={{ background: B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-2" style={{ color: B.burgundyDark }}>
              <Gift className="w-4 h-4" /> Career Change Track Bonuses (Included Free)
            </span>
          </div>
          <SectionInner className="space-y-3">
            {[
              { title: "Coach-to-Practitioner Upgrade Blueprint", desc: vision === "leave-job" ? "You said you want to go full-time. This is the EXACT step-by-step guide for scaling your practice safely and successfully." : "The complete roadmap for transitioning from 'wellness coach' to 'clinical practitioner' — with premium pricing to match.", value: "$497" },
              { title: "Coach Referral Network System", desc: "Scripts, templates, and strategies to build a referral network with other coaches, practitioners, and healthcare providers.", value: "$397" },
              { title: "Niche Authority Positioning Kit", desc: "Position yourself as THE expert in your specialization — not just another coach. Includes bio templates, social proof strategies, and authority marketing blueprints.", value: "$297" },
              { title: "First 5 Premium Clients Accelerator", desc: experience === "active-clients" ? "Upgrade your existing clients to premium DEPTH packages using these upsell scripts and templates." : experience === "no-experience" ? "The exact outreach templates to go from ZERO clients to your first 5 premium-paying clients." : "The exact launch sequence our top coaches used to book their first 5 premium clients.", value: "$397" },
              { title: "1-on-1 Private Mentor Chat with Sarah", desc: "Direct access to Coach Sarah M. for personalized guidance, protocol questions, and business advice — right inside your student dashboard.", value: "$1,497", icon: MessageCircle },
              { title: "Clinical Resources & Protocol Library", desc: "Downloadable intake forms, lab interpretation guides, supplement protocols, client handouts, and practice templates — ready to use with your first client.", value: "$697", icon: Download },
            ].map((bonus, i) => {
              const BonusIcon = bonus.icon || Gift;
              return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white shadow-sm border" style={{ borderColor: `${B.gold}30` }}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: B.goldMetallic }}>
                  <BonusIcon className="w-4 h-4" style={{ color: B.burgundyDark }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-xs sm:text-sm" style={{ color: B.burgundy }}>{bonus.title}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 whitespace-nowrap">FREE <span className="line-through">{bonus.value}</span></p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{bonus.desc}</p>
                </div>
              </motion.div>
              );
            })}

            {/* BONUS #13: Coach Workspace Portal */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="rounded-2xl overflow-hidden border-2 bg-white shadow-lg" style={{ borderColor: B.gold }}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: B.goldMetallic }}>
                      <Laptop className="w-4 h-4" style={{ color: B.burgundyDark }} />
                    </div>
                    <p className="font-bold text-sm sm:text-base" style={{ color: B.burgundy }}>BONUS #13: Coach Workspace Portal</p>
                  </div>
                  <p className="text-xs font-bold text-gray-400 whitespace-nowrap">FREE <span className="line-through">$497</span></p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Your complete digital coaching command center — manage clients, track progress, and deliver protocols all in one beautiful platform. No more juggling spreadsheets and random tools.</p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${B.gold}30` }}>
                  <Image src={COACH_WORKSPACE_IMG} alt="Coach Workspace Portal" width={800} height={500} className="w-full h-auto" />
                </div>
              </div>
            </motion.div>

            {/* BONUS #14: Private Community */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
              className="rounded-2xl overflow-hidden border-2 bg-white shadow-lg" style={{ borderColor: B.gold }}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: B.goldMetallic }}>
                      <Users2 className="w-4 h-4" style={{ color: B.burgundyDark }} />
                    </div>
                    <p className="font-bold text-sm sm:text-base" style={{ color: B.burgundy }}>BONUS #14: Private Community of 1,247+ Coaches</p>
                  </div>
                  <p className="text-xs font-bold text-gray-400 whitespace-nowrap">FREE <span className="line-through">$997</span></p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Join our exclusive community of certified functional medicine coaches. Get support, share wins, ask questions, and network with practitioners who understand your journey. This is where the magic happens!</p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${B.gold}30` }}>
                  <Image src={COMMUNITY_IMG} alt="Private Community of Coaches" width={800} height={500} className="w-full h-auto" />
                </div>
              </div>
            </motion.div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 14: WHAT HAPPENS NEXT (dynamic timeline) ═══ */}
        <Section>
          <SectionInner className="space-y-5 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center" style={{ color: B.burgundyDark }}>
              What Happens After You Enroll
            </h2>
            <p className="text-center text-xs sm:text-sm text-gray-500">Your personalized path: enrollment to earning in {certWeeks + 4} weeks.</p>

            <div className="space-y-3">
              {[
                { step: "1", title: "Immediate Access (Today)", desc: `Log in to your clinical dashboard, receive your welcome kit, and meet your mentor within 24 hours.${startTimeline === "this-week" ? " You said you're ready to start THIS week — let's go." : ""}`, icon: Zap },
                { step: "2", title: `Complete ${pract.specialization} Track (${certWeeks} weeks)`, desc: `Follow your personalized specialization track at your own pace — 20 min/day.${commitment === "absolutely" ? " With your commitment level, you'll likely finish even faster." : ""}`, icon: BookOpen },
                { step: "3", title: "Get Certified", desc: "Pass your clinical assessment, receive your ASI-accredited certificate, and get listed in the practitioner directory.", icon: GraduationCap },
                { step: "4", title: `Land Clients & Reach ${income.label}`, desc: `Use the Business Setup System to land your first paying clients ${clientsTimeline}. Our certified practitioners average ${income.label} within 90 days.`, icon: DollarSign },
              ].map((s, i) => {
                const StepIcon = s.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border shadow-sm" style={{ borderColor: `${B.gold}20` }}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: B.goldMetallic }}>
                      <span className="text-sm sm:text-base font-extrabold" style={{ color: B.burgundyDark }}>{s.step}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm sm:text-base flex items-center gap-1.5" style={{ color: B.burgundy }}>
                        <StepIcon className="w-4 h-4 flex-shrink-0" style={{ color: B.gold }} /> {s.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 15: GUARANTEE ═══ */}
        <Section>
          <SectionInner className="text-center space-y-4 sm:space-y-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ background: B.goldMetallic }}>
              <Shield className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: B.burgundyDark }} />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
              The &ldquo;Try It Risk-Free&rdquo; Guarantee
            </h2>

            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
              {pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus"
                ? `${firstName}, you said you've been burned by certifications before. That's why we make this simple: enroll today, go through the first week of training, and if you don't feel this is COMPLETELY different from everything you've tried — email us and we'll refund every penny. No questions, no hoops, no hard feelings.`
                : `Enroll today, go through the first week of training, and if you don't feel this is the best clinical education you've ever received — email us and we'll refund every penny. No questions, no hoops, no hard feelings.`
              }
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm mx-auto">
              {[
                { val: "7 Days", label: "Full Refund Window" },
                { val: "Zero", label: "Questions Asked" },
                { val: "100%", label: "Money Back" },
              ].map((g) => (
                <div key={g.label} className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: `${B.gold}08` }}>
                  <div className="text-sm sm:text-lg font-bold" style={{ color: B.burgundy }}>{g.val}</div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500">{g.label}</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 italic">We can offer this because 97% of career changers who start — stay. The training speaks for itself.</p>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 16: SARAH'S PERSONAL MESSAGE (dynamic from Q10 vision) ═══ */}
        <Section bg={`${B.gold}08`}>
          <SectionInner>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image src={SARAH} alt="Sarah M." width={72} height={72} className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full border-3 object-cover shadow-lg flex-shrink-0 self-center sm:self-start" style={{ borderColor: B.gold }} />
              <div className="space-y-3">
                <div>
                  <p className="font-bold" style={{ color: B.burgundy }}>Sarah M. <span className="text-gray-400 font-normal text-sm">- ASI Certified Clinical Director</span></p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400">Coach turned Practitioner, 8 years</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {firstName}, as a coach who made this exact transition myself, I know exactly what you&apos;re feeling. The frustration of giving great advice but feeling like you lack the clinical edge. The imposter syndrome when clients have complex cases.
                </p>
                <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: B.burgundy }}>
                  {sarahVision[vision] || sarahVision["all-above"]}
                </p>
              </div>
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 17: OBJECTION CRUSHER (right before final CTA) ═══ */}
        <Section>
          <SectionInner className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Still on the fence? Let&apos;s address that.
            </h2>

            <div className="space-y-3">
              {[
                { objection: `"But I'm earning ${curIncome.label}/mo — can I afford this?"`, crush: `Can you afford NOT to? You're losing $${Math.round(incomeGap).toLocaleString()}/month — that's $${yearlyLoss.toLocaleString()}/year — by NOT having this certification. Plus, payment plans are available.` },
                { objection: `"What if I'm too ${experience === "no-experience" ? "inexperienced" : "busy"} to start?"`, crush: experience === "no-experience" ? "38% of our top performers started with zero experience. Your healthcare training IS your experience. DEPTH adds the functional framework." : `The program is 20 min/day, fully self-paced. Many nurses study between shifts. ${commitment === "absolutely" ? "And you said 20 min/day is a no-brainer for you." : "It fits around ANY schedule."}` },
                { objection: '"What if I fail?"', crush: `You have a 7-day money-back guarantee. If it's not right, you get every penny back. But with your clinical background and a 94% healthcare acceptance rate — the odds are overwhelmingly in your favor, ${firstName}.` },
                { objection: '"Is this a subscription? Will I get charged again?"', crush: "No. One-time investment, lifetime access. No recurring fees, no annual renewals, no hidden charges. Once you're in, you're in — including all future updates, new protocols, and community access. Forever." },
                { objection: '"I don\'t have time — I work 12-hour shifts."', crush: `It's 100% self-paced. 20 minutes a day, on YOUR schedule. No live classes, no deadlines. Study at 2am after a night shift or on your day off. ${commitment === "absolutely" ? "You already said 20 min/day is doable — that's all it takes." : "Most nurses finish in 8-12 weeks without changing their schedule."}` },
                { objection: '"Do I need a medical degree or specific license?"', crush: "No medical degree required. The DEPTH certification is designed for career changers AND career changers. Nurses, PAs, career changers, nutritionists — even women with zero clinical background have graduated and built practices earning $8K+/month." },
                { objection: '"What if it\'s just another certification that collects dust?"', crush: `This isn't theory — it's a business-in-a-box. You get the clinical training AND the Business Setup System that 73% of graduates used to land paying clients within 30 days. ${pastCerts === "multiple-disappointed" || pastCerts === "spent-5k-plus" ? "You've been burned before. This is different because we don't stop at certification — we help you earn from it." : "We don't stop at certification — we help you earn from it."}` },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-3 sm:p-4 rounded-xl bg-white border shadow-sm" style={{ borderColor: `${B.gold}20` }}>
                  <p className="text-xs sm:text-sm font-bold text-gray-500 italic mb-1.5">{item.objection}</p>
                  <p className="text-xs sm:text-sm" style={{ color: B.burgundy }}>{item.crush}</p>
                </motion.div>
              ))}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 18: FAQ ═══ */}
        <Section>
          <SectionInner className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center" style={{ color: B.burgundyDark }}>
              Questions Healthcare Professionals Ask
            </h2>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: `${B.gold}20` }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3 sm:p-4 text-left">
                    <span className="font-bold text-xs sm:text-sm pr-3 sm:pr-4" style={{ color: B.burgundy }}>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </SectionInner>
        </Section>

        {/* ═══ SECTION 19: FINAL CTA ═══ */}
        <Section>
          <div className="px-4 sm:px-6 py-3" style={{ background: startTimeline === "this-week" ? B.burgundy : B.goldMetallic }}>
            <span className="text-xs sm:text-sm font-bold" style={{ color: startTimeline === "this-week" ? "white" : B.burgundyDark }}>
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 -mt-0.5" /> {startTimeline === "this-week" ? "URGENT — Your Cohort Starts This Week" : "Limited Availability — Career Change Track Cohort"}
            </span>
          </div>
          <SectionInner className="text-center space-y-5 sm:space-y-6">
            <Image src={ASI_LOGO} alt="ASI" width={56} height={56} className="mx-auto w-12 h-12 sm:w-14 sm:h-14" />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: B.burgundyDark }}>
              {firstName}, Your Spot Is Reserved for {fmt(countdown)}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
              {vision === "leave-job" && `You said you want to leave your 9-to-5. This is the fastest path. ${urgencySpots} spots left in the Career Change Track.`}
              {vision === "security" && `You want financial security for your family. Every day you wait is another day of uncertainty. ${urgencySpots} spots left.`}
              {vision === "fulfillment" && `You want to do medicine the RIGHT way. Stop settling for a system that doesn't serve you or your patients. ${urgencySpots} spots left.`}
              {vision === "all-above" && `Freedom. Security. Fulfillment. You want it all — and DEPTH delivers. But only ${urgencySpots} spots remain in this cohort.`}
              {!["leave-job", "security", "fulfillment", "all-above"].includes(vision) && `You've invested years in your clinical education. This is the final piece — the framework that turns your training into ${income.label}. ${urgencySpots} spots left.`}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
              {[
                { val: income.label.replace("/month", ""), label: "Monthly Target" },
                { val: `${certWeeks} Weeks`, label: "To Certify" },
                { val: "94%", label: "Accept Rate" },
              ].map((s) => (
                <div key={s.label} className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: `${B.gold}08` }}>
                  <div className="text-sm sm:text-lg font-bold" style={{ color: B.burgundy }}>{s.val}</div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <CTAButton />

            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 7-Day Money-Back</span>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> Scholarships Available</span>
              <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> ASI Accredited</span>
            </div>

            <p className="text-[10px] sm:text-[11px] font-medium" style={{ color: B.burgundy }}>
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Only {urgencySpots} scholarship spots remaining this cohort. Chat with Sarah now to check your eligibility.
            </p>
          </SectionInner>
        </Section>

        {/* ═══ TRUST FOOTER ═══ */}
        <div className="text-center space-y-4 pb-8 pt-2">
          <div className="flex flex-wrap items-center justify-center gap-2 py-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <div key={s} className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center" style={{ backgroundColor: "#00b67a" }}>
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                </div>
              ))}
            </div>
            <div className="text-[10px] sm:text-xs">
              <span className="font-bold text-gray-800">Excellent 4.9</span>
              <span className="text-gray-400 mx-1">|</span>
              <span className="text-gray-500">1,197+ reviews</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">Trustpilot</span>
          </div>

          <div>
            <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider mb-2 font-medium">Accredited by ASI &amp; Backed by</p>
            <Image src={LOGOS} alt="Accreditation partners" width={800} height={40} className="w-full max-w-xs sm:max-w-md mx-auto h-auto opacity-60" />
          </div>
        </div>
      </div>

      {/* ═══ SCHOLARSHIP CHAT WIDGET ═══ */}
      <ScholarshipChat
        firstName={firstName}
        lastName={lastName}
        email={email}
        quizData={scholarshipQuizData}
        page="healthcare-results"
      />
    </div>
  );
}

export default function CareerChangeResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fdfbf7" }}>
        <p className="text-gray-400">Loading your results...</p>
      </div>
    }>
      <CareerChangeResultsInner />
    </Suspense>
  );
}
