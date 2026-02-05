"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  Award,
  Sparkles,
  Loader2,
  Lock,
  Phone,
  Mail,
  User,
  Heart,
  TrendingUp,
} from "lucide-react";

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

const SARAH_AVATAR = "/coaches/sarah-coach.webp";
const ASI_LOGO = "/asi-logo-transparent.png";
const ACCREDITATION_LOGOS = "/all-logos.png";

// Testimonial photos for dynamic reactions
const TESTIMONIAL_PHOTOS = {
  grace: "/assets/migrated/TESTIMONIAL_03.jpg",
  michelle: "/assets/migrated/TESTIMONIAL_01.jpg",
  jennifer: "/assets/migrated/TESTIMONIAL_02.jpg",
  amanda: "/assets/migrated/TESTIMONIAL_03.jpg",
  susan: "/assets/migrated/TESTIMONIAL_01.jpg",
  angela: "/assets/migrated/TESTIMONIAL_02.jpg",
  karen: "/assets/migrated/TESTIMONIAL_03.jpg",
};

// ─── Confetti ──────────────────────────────────────────────────────
function useConfetti() {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#d4af37", "#f7e7a0", "#722f37", "#b8860b"] });
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 }, colors: ["#d4af37", "#f7e7a0"] }), 200);
    });
  }, []);
}

// ─── Persona types ─────────────────────────────────────────────────
type Persona = "healthcare-pro" | "health-coach" | "corporate" | "stay-at-home-mom" | "other-passionate";

// ─── Niche/Specialization mapping ─────────────────────────────────
const NICHE_LABELS: Record<string, string> = {
  "hormone-health": "Hormone Health",
  "gut-health": "Gut Health",
  "weight-metabolism": "Weight & Metabolism",
  "energy-burnout": "Energy & Burnout Recovery",
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC TESTIMONIALS BY PERSONA (shown after Q3, Q6, Q9)
// ═══════════════════════════════════════════════════════════════════
interface Testimonial { name: string; role: string; text: string; photo: string; afterQ: number }

const TESTIMONIALS_BY_PERSONA: Record<Persona, Testimonial[]> = {
  "healthcare-pro": [
    { name: "Susan M.", role: "Former ICU Nurse, California", text: "I was exactly where you are, {{NAME}}. Burned out, wondering if there was more. Now I'm earning $6,200/month helping women balance their hormones — all from my living room.", photo: TESTIMONIAL_PHOTOS.susan, afterQ: 3 },
    { name: "Angela R.", role: "LPN turned FM Practitioner, Texas", text: "I thought I needed a $15,000 program and 2 years of school. Sarah's path cost me less than dinner out — and I was certified in a weekend. Best decision I ever made.", photo: TESTIMONIAL_PHOTOS.angela, afterQ: 6 },
    { name: "Karen T.", role: "Single Mom of 3, Florida", text: "I was skeptical — I'd tried other programs before. But within 90 days of starting with Sarah, I quit my hospital job. I never thought I'd say that. This actually works.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
  "health-coach": [
    { name: "Susan M.", role: "Health Coach to Clinical Practitioner", text: "Before this, I was charging $50/session and struggling. Now I'm earning $6,200/month with a waitlist. The certification gave me the credibility I was missing.", photo: TESTIMONIAL_PHOTOS.susan, afterQ: 3 },
    { name: "Angela R.", role: "Yoga Teacher Turned Practitioner", text: "I had wellness experience but no clinical framework. This gave me the structure to charge $200/session instead of $40 for yoga classes.", photo: TESTIMONIAL_PHOTOS.angela, afterQ: 6 },
    { name: "Karen T.", role: "Nutrition Coach to FM Specialist", text: "Every coach should upgrade to clinical. My coaching was good but limited. Now I can create real protocols, and clients see me as an authority.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
  "corporate": [
    { name: "Susan M.", role: "Former Marketing Director, Age 52", text: "I left my corporate job at 49 with zero health credentials. This gave me everything — the skills, the framework, the confidence. Now earning $7K/month.", photo: TESTIMONIAL_PHOTOS.susan, afterQ: 3 },
    { name: "Angela R.", role: "Ex-Finance Manager to Practitioner", text: "My corporate project management skills turned out to be my secret weapon. I launched my practice like a business from day one.", photo: TESTIMONIAL_PHOTOS.angela, afterQ: 6 },
    { name: "Karen T.", role: "Former HR Executive to Clinical Director", text: "Everyone thought I was crazy leaving a 6-figure salary. 8 months later, I matched it with my own practice and actually love Mondays again.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
  "stay-at-home-mom": [
    { name: "Susan M.", role: "Stay-at-Home Mom to Certified Practitioner", text: "I studied during nap times. Within 4 months I was certified. Now I see clients 3 days a week while my kids are at school and earn $6K/month.", photo: TESTIMONIAL_PHOTOS.susan, afterQ: 3 },
    { name: "Angela R.", role: "Mom of 3 to FM Practitioner", text: "I felt invisible for years - just 'someone's mom.' This gave me my identity back. I built my practice from my kitchen table.", photo: TESTIMONIAL_PHOTOS.angela, afterQ: 6 },
    { name: "Karen T.", role: "Former SAHM, Now Earning $8K/Month", text: "My husband was skeptical. Then my first month I earned $3K working part-time. Now I contribute more to our family than ever.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
  "other-passionate": [
    { name: "Susan M.", role: "Career Changer, Age 52", text: "I was skeptical after wasting money on other programs. Now I'm earning $7K/month and fully booked. Started from zero at age 49.", photo: TESTIMONIAL_PHOTOS.susan, afterQ: 3 },
    { name: "Angela R.", role: "Teacher to Clinical Practitioner", text: "I had no medical background - I was a high school teacher. Everything was broken down so clearly. My teaching skills help me explain protocols beautifully.", photo: TESTIMONIAL_PHOTOS.angela, afterQ: 6 },
    { name: "Karen T.", role: "Complete Career Change at 47", text: "I proved everyone wrong. No degree in health, no clinical experience, nothing. Just passion. 6 months later: certified and earning more than my previous career.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// PERSONA-SPECIFIC REVIEWING STEPS
// ═══════════════════════════════════════════════════════════════════
const REVIEW_STEPS_BY_PERSONA: Record<Persona, string[]> = {
  "healthcare-pro": [
    "Validating clinical credentials...",
    "Analyzing healthcare experience...",
    "Matching to FM Foundations pathway...",
    "Checking Healthcare cohort availability...",
    "Verifying acceptance status...",
    "Application complete!",
  ],
  "health-coach": [
    "Analyzing coaching experience...",
    "Evaluating upgrade potential...",
    "Matching to FM Foundations pathway...",
    "Checking Coach cohort availability...",
    "Calculating certification timeline...",
    "Application complete!",
  ],
  "corporate": [
    "Evaluating professional skills...",
    "Mapping career transition readiness...",
    "Matching to FM Foundations pathway...",
    "Checking Transition cohort availability...",
    "Verifying qualification status...",
    "Application complete!",
  ],
  "stay-at-home-mom": [
    "Analyzing schedule flexibility...",
    "Matching family-friendly pathway...",
    "Evaluating empathy strengths...",
    "Checking Flexible cohort availability...",
    "Calculating part-time potential...",
    "Application complete!",
  ],
  "other-passionate": [
    "Analyzing passion profile...",
    "Evaluating unique advantages...",
    "Matching to FM Foundations pathway...",
    "Checking next available cohort...",
    "Verifying eligibility...",
    "Application complete!",
  ],
};

// ═══════════════════════════════════════════════════════════════════
// QUALIFICATION FRAMING BY PERSONA
// ═══════════════════════════════════════════════════════════════════
const QUALIFICATION_FRAMING: Record<Persona, { percentile: string; acceptance: string }> = {
  "healthcare-pro": { percentile: "Top 6%", acceptance: "94% acceptance rate for healthcare professionals" },
  "health-coach": { percentile: "Top 12%", acceptance: "Your coaching experience accelerates certification by 40%" },
  "corporate": { percentile: "Top 18%", acceptance: "Corporate professionals build the most efficient practices" },
  "stay-at-home-mom": { percentile: "Top 14%", acceptance: "Mom practitioners have the highest client retention rates" },
  "other-passionate": { percentile: "Top 20%", acceptance: "Non-traditional backgrounds bring fresh perspective" },
};

// ═══════════════════════════════════════════════════════════════════
// COHORT NAMING BY PERSONA
// ═══════════════════════════════════════════════════════════════════
const COHORT_NAMES: Record<Persona, { name: string; spots: number }> = {
  "healthcare-pro": { name: "Healthcare Fast-Track", spots: 7 },
  "health-coach": { name: "Coach Upgrade", spots: 9 },
  "corporate": { name: "Career Transition", spots: 9 },
  "stay-at-home-mom": { name: "Flexible Schedule", spots: 11 },
  "other-passionate": { name: "Foundations", spots: 14 },
};

// ═══════════════════════════════════════════════════════════════════
// OPTIN BULLETS BY PERSONA
// ═══════════════════════════════════════════════════════════════════
const OPTIN_BULLETS: Record<Persona, string[]> = {
  "healthcare-pro": [
    "Your personalized practitioner profile",
    "Your certification fast-track roadmap",
    "The exact steps to start earning this month",
  ],
  "health-coach": [
    "Your coach-to-clinical upgrade assessment",
    "Your income growth roadmap (3x projection)",
    "The exact steps to start earning this month",
  ],
  "corporate": [
    "Your career transition readiness report",
    "Your corporate-to-practitioner roadmap",
    "The exact steps to start earning this month",
  ],
  "stay-at-home-mom": [
    "Your family-friendly study schedule",
    "Your part-time practice launch roadmap",
    "The exact steps to start earning this month",
  ],
  "other-passionate": [
    "Your qualification status revealed",
    "Your personalized certification roadmap",
    "The exact steps to start earning this month",
  ],
};

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS (from FM_QUIZ_SPEC.md - 12 questions)
// ═══════════════════════════════════════════════════════════════════
interface QuizOption {
  label: string;
  value: string;
  reaction: string;
  reactionName?: string;
  reactionPhoto?: string;
}
interface QuizStep {
  id: number;
  pillar: string;
  question: string;
  options: QuizOption[];
}

const QUESTIONS: QuizStep[] = [
  // PILLAR 1: Current State (Pain Amplification)
  {
    id: 1, pillar: "Current State",
    question: "{{NAME}}, how would you describe your current work situation?",
    options: [
      { label: "Burned out, exhausted, dreading every shift", value: "burned-out", reaction: "Exactly like Grace, a former ICU nurse from Ohio who felt the same way. She's now earning $7,200/month from home.", reactionName: "Grace", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Getting by, but deeply unfulfilled", value: "getting-by", reaction: "That's how Michelle described it too. 6 months later, she left her clinic and never looked back.", reactionName: "Michelle", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "It's okay, but I know I'm capable of more", value: "capable-more", reaction: "Jennifer said the same thing. She knew she was meant for more. Now she runs her own practice.", reactionName: "Jennifer", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "I'm already building something on the side", value: "building-side", reaction: "Love that, {{NAME}}! Amanda was in the same spot — we helped her go full-time in 60 days.", reactionName: "Amanda", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  {
    id: 2, pillar: "Current State",
    question: "Be honest with me, {{NAME}} — how often do you think about leaving your current career?",
    options: [
      { label: "Every single day — I can't stop thinking about it", value: "every-day", reaction: "Lisa told me the exact same thing. That constant feeling? It's trying to tell you something, {{NAME}}.", reactionName: "Lisa", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Weekly — it crosses my mind more than I'd like", value: "weekly", reaction: "Barbara was there too. Those weekly thoughts turned into her new career.", reactionName: "Barbara", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "Monthly — usually after a rough shift", value: "monthly", reaction: "Patricia said the rough shifts were her wake-up call. Now she chooses her own hours.", reactionName: "Patricia", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "Rarely — I'm just exploring my options", value: "rarely", reaction: "Smart to explore early, {{NAME}}! Sandra wishes she had started looking sooner.", reactionName: "Sandra", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  {
    id: 3, pillar: "Current State",
    question: "I hear you, {{NAME}}. What's the BIGGEST thing holding you back from making a change right now?",
    options: [
      { label: "I don't know where to start", value: "dont-know-start", reaction: "{{NAME}}, Nancy felt completely lost too. That's exactly why I created this path — to make it simple.", reactionName: "Nancy", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "I'm scared of losing income stability", value: "scared-income", reaction: "Betty was a single mom terrified of losing income. She kept her job until her side income replaced it.", reactionName: "Betty", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "I don't have the right credentials", value: "no-credentials", reaction: "Dorothy thought the same thing! She had no formal training — now she's board-certified.", reactionName: "Dorothy", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "I don't have enough time", value: "no-time", reaction: "Helen was working doubles and raising 2 kids. She did this in 1 hour a day. You can too.", reactionName: "Helen", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  // PILLAR 2: Desire Clarity (Future Pacing)
  {
    id: 4, pillar: "Desire Clarity",
    question: "Close your eyes for a second, {{NAME}}... Imagine it's 6 months from now. What does your IDEAL day look like?",
    options: [
      { label: "Working from home, setting my own schedule", value: "work-from-home", reaction: "Margaret dropped her kids at school, made coffee, and logged 3 client calls by noon. That's her Tuesday now.", reactionName: "Margaret", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Earning $5K+ helping clients I actually care about", value: "earning-5k", reaction: "Ruth hit $5K in her third month. She cried happy tears — first time in years.", reactionName: "Ruth", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "Location freedom — laptop and wifi is all I need", value: "location-freedom", reaction: "Sharon took her practice to Costa Rica last month. Laptop, wifi, and happy clients.", reactionName: "Sharon", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "Still in healthcare, but with meaning and less burnout", value: "meaningful-healthcare", reaction: "Donna still works with patients — but now they THANK her. No more being just a number.", reactionName: "Donna", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  {
    id: 5, pillar: "Desire Clarity",
    question: "{{NAME}}, if you could wake up 6 months from now earning predictable income from home — how much would you need to feel safe leaving your job?",
    options: [
      { label: "$3,000 - $5,000/month", value: "3k-5k", reaction: "Carol hit $4,200 in month 2. Said it felt 'too easy.' {{NAME}}, this is absolutely within reach.", reactionName: "Carol", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "$5,000 - $8,000/month", value: "5k-8k", reaction: "Judy's goal was $6K. She hit $8,400 by month 4. The demand for this is REAL.", reactionName: "Judy", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "$8,000 - $12,000/month", value: "8k-12k", reaction: "Deborah scaled to $11K by adding group programs. It's a full business now.", reactionName: "Deborah", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "$12,000+/month", value: "12k-plus", reaction: "Cynthia built a team. She's at $18K/month now. Started exactly where you are.", reactionName: "Cynthia", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  {
    id: 6, pillar: "Desire Clarity",
    question: "If you could help women in ONE specific area, {{NAME}}, what pulls at your heart the most?",
    options: [
      { label: "Hormone balance & women's health", value: "hormone-health", reaction: "Brenda chose hormones too. She says it's the most rewarding work of her life. 2,847 women who chose Hormone Health are now certified.", reactionName: "Brenda", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Gut health & digestion issues", value: "gut-health", reaction: "Amy specialized in gut health — the demand is INSANE right now. 1,923 gut health practitioners certified.", reactionName: "Amy", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "Weight loss & metabolism struggles", value: "weight-metabolism", reaction: "Shirley helps women lose weight naturally. Her waitlist is 3 months long. 2,156 metabolism specialists certified.", reactionName: "Shirley", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "Energy, fatigue & burnout recovery", value: "energy-burnout", reaction: "Anna helps burned-out women like us. She gets it. So will your clients. 1,742 burnout recovery coaches certified.", reactionName: "Anna", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  // PILLAR 3: Belief Gap (Objection Surfacing)
  {
    id: 7, pillar: "Belief Gap",
    question: "{{NAME}}, what's the #1 thing you believe is stopping you from becoming a certified practitioner?",
    options: [
      { label: "It takes too long (years of school)", value: "too-long", reaction: "Kathy thought the same thing. She was certified in 9 days — while still working full-time.", reactionName: "Kathy", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "It costs too much ($10K+ programs)", value: "too-expensive", reaction: "Diane spent $127 total. Not $10K. Not $5K. $127. And she's earning $6K/month now.", reactionName: "Diane", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "I'm not sure I'm qualified", value: "not-qualified", reaction: "Janet was a medical assistant with no degree. She's now a certified practitioner with a waiting list.", reactionName: "Janet", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "I don't know how to get clients", value: "no-clients", reaction: "Frances got her first 3 clients in week 1 using our templates. I'll show you exactly how.", reactionName: "Frances", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  {
    id: 8, pillar: "Belief Gap",
    question: "Be honest with me, {{NAME}} — have you looked into Functional Medicine certifications before?",
    options: [
      { label: "Yes, but they were too expensive", value: "looked-expensive", reaction: "Virginia almost paid $8,500 for IIN. Then she found us. Same certification, fraction of the cost.", reactionName: "Virginia", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Yes, but they took way too long", value: "looked-too-long", reaction: "Joyce didn't have 2 years. She had 2 weeks. That's all she needed with our path.", reactionName: "Joyce", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "No, I didn't know where to look", value: "didnt-know", reaction: "Marie was lost too. Said finding us felt like 'finally finding the door.'", reactionName: "Marie", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "No, I just discovered this recently", value: "just-discovered", reaction: "Perfect timing, {{NAME}}! Theresa found us at exactly the right moment too.", reactionName: "Theresa", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  {
    id: 9, pillar: "Belief Gap",
    question: "How soon are you looking to make a real change, {{NAME}}?",
    options: [
      { label: "Immediately — I'm ready NOW", value: "immediately", reaction: "Alice said the same thing. 30 days later, she had quit her job. The 'ready NOW' energy is powerful.", reactionName: "Alice", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Within 1-3 months", value: "1-3-months", reaction: "Jean gave herself 90 days. Hit her income goal in 60. You might surprise yourself, {{NAME}}.", reactionName: "Jean", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "Within 6 months", value: "6-months", reaction: "Kathryn planned for 6 months. Started earning at month 2. Plans change when results come fast.", reactionName: "Kathryn", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "Just researching for now", value: "researching", reaction: "Sara was 'just researching' for 6 months. She says she wishes she started sooner.", reactionName: "Sara", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
  // PILLAR 4: Commitment Test (Intent Qualification)
  {
    id: 10, pillar: "Commitment",
    question: "{{NAME}}, if I could show you a way to get certified in under 2 weeks — without quitting your job, for less than $100 — would you take it seriously?",
    options: [
      { label: "YES — I'm ready to invest in myself", value: "yes-ready", reaction: "That's the energy, {{NAME}}! Paula said YES too — and within 30 days, her life was completely different.", reactionName: "Paula", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Maybe — show me what you've got", value: "maybe", reaction: "Christina was a 'maybe' — totally fair. By the end of week 1, she was ALL in.", reactionName: "Christina", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "Probably not — I'm still skeptical", value: "skeptical", reaction: "Lauren was skeptical too. She needed proof. I'll show you everything, {{NAME}}.", reactionName: "Lauren", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "No — I'm not ready", value: "not-ready", reaction: "No pressure, {{NAME}}. Let's see if the full picture changes your mind.", reactionName: "", reactionPhoto: "" },
    ],
  },
  {
    id: 11, pillar: "Commitment",
    question: "Here's the real question, {{NAME}}: How committed are you to making 2026 YOUR year?",
    options: [
      { label: "100% — I'm making this happen no matter what", value: "100-percent", reaction: "Melissa had that same fire. 2026 WAS her year. I believe it can be yours too, {{NAME}}.", reactionName: "Melissa", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "80% — I just need the right roadmap", value: "80-percent", reaction: "Stephanie just needed clarity. Once she had the roadmap, she went to 100% instantly.", reactionName: "Stephanie", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "50% — I'm interested but still unsure", value: "50-percent", reaction: "Rebecca was 50/50. Said seeing other women's results pushed her over the edge.", reactionName: "Rebecca", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "Just browsing for now", value: "browsing", reaction: "That's okay, {{NAME}}. Sometimes clarity comes from seeing what's possible.", reactionName: "", reactionPhoto: "" },
    ],
  },
  {
    id: 12, pillar: "Commitment",
    question: "Last one, {{NAME}}... Would you be willing to dedicate just 1 hour per day for the next 7 days to build your new career?",
    options: [
      { label: "Absolutely — I'll make the time", value: "absolutely", reaction: "That's all it takes, {{NAME}}. Carolyn did exactly 1 hour a day. Changed her whole life.", reactionName: "Carolyn", reactionPhoto: TESTIMONIAL_PHOTOS.grace },
      { label: "Probably — if the content is worth it", value: "probably", reaction: "Christine thought the same. Said every minute was worth it — pure value, no fluff.", reactionName: "Christine", reactionPhoto: TESTIMONIAL_PHOTOS.michelle },
      { label: "Maybe — depends on my schedule", value: "maybe-schedule", reaction: "Rachel squeezed it in during lunch breaks. Where there's a will, there's a way.", reactionName: "Rachel", reactionPhoto: TESTIMONIAL_PHOTOS.jennifer },
      { label: "No — I really don't have time", value: "no-time", reaction: "Kelly was the busiest person I know — 3 kids, night shifts. She still made it work.", reactionName: "Kelly", reactionPhoto: TESTIMONIAL_PHOTOS.amanda },
    ],
  },
];

// ─── Types ─────────────────────────────────────────────────────────
type Stage = "intro" | "quiz" | "testimonial" | "checkpoint" | "teaser" | "optin" | "reviewing" | "qualified" | "result";
const TOTAL_STEPS = 18; // Includes intro, testimonials, checkpoints, teaser

// ─── Persona Detection Question (hidden - based on which quiz they clicked) ─────
// For now, we detect based on Q1 answer mapping
const PERSONA_FROM_SITUATION: Record<string, Persona> = {
  "burned-out": "healthcare-pro",
  "getting-by": "health-coach",
  "capable-more": "corporate",
  "building-side": "other-passionate",
};

// ─── Route mapping ─────────────────────────────────────────────────
const ROLE_ROUTES: Record<string, string> = {
  "healthcare-pro": "/results/mini-diploma/healthcare",
  "health-coach": "/results/mini-diploma/coach",
  "corporate": "/results/mini-diploma/corporate",
  "stay-at-home-mom": "/results/mini-diploma/mom",
  "other-passionate": "/results/mini-diploma/career-change",
};

export default function MiniDiplomaQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reaction, setReaction] = useState<{ text: string; name?: string; photo?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [reviewStep, setReviewStep] = useState(0);
  const [optinTimer, setOptinTimer] = useState(900);
  const [detectedPersona, setDetectedPersona] = useState<Persona>("other-passionate");
  const fireConfetti = useConfetti();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Derived values
  const nicheKey = answers[5] || "hormone-health";
  const nicheLabel = NICHE_LABELS[nicheKey] || "Hormone Health";
  const incomeGoal = answers[4] || "5k-8k";

  // Dynamic data based on persona
  const testimonials = TESTIMONIALS_BY_PERSONA[detectedPersona] || TESTIMONIALS_BY_PERSONA["other-passionate"];
  const reviewSteps = REVIEW_STEPS_BY_PERSONA[detectedPersona] || REVIEW_STEPS_BY_PERSONA["other-passionate"];
  const qualFraming = QUALIFICATION_FRAMING[detectedPersona] || QUALIFICATION_FRAMING["other-passionate"];
  const cohort = COHORT_NAMES[detectedPersona] || COHORT_NAMES["other-passionate"];
  const optinBullets = OPTIN_BULLETS[detectedPersona] || OPTIN_BULLETS["other-passionate"];

  // Calculate progress (starts at 20% per spec)
  const calculateProgress = () => {
    if (stage === "intro") return 20;
    const baseProgress = 20;
    const progressPerQ = 68 / QUESTIONS.length; // 68% for questions (20 to 88)
    const qProgress = baseProgress + (currentQ * progressPerQ);
    if (stage === "optin" || stage === "reviewing") return 92;
    if (stage === "qualified") return 100;
    return Math.min(qProgress, 88);
  };

  // Replace {{NAME}} in text
  const personalize = (text: string) => text.replace(/\{\{NAME\}\}/g, name || "Friend");

  // Optin countdown timer
  useEffect(() => {
    if (stage === "optin") {
      timerRef.current = setInterval(() => {
        setOptinTimer((prev) => (prev <= 0 ? 0 : prev - 1));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Reviewing animation
  useEffect(() => {
    if (stage !== "reviewing") return;
    const interval = setInterval(() => {
      setReviewStep((prev) => {
        if (prev >= reviewSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("qualified");
            fireConfetti();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [stage, reviewSteps.length, fireConfetti]);

  // Handle answer selection
  const handleAnswer = (value: string) => {
    const q = QUESTIONS[currentQ];
    const opt = q.options.find((o) => o.value === value);

    // Update persona detection based on Q1
    if (currentQ === 0) {
      const detected = PERSONA_FROM_SITUATION[value] || "other-passionate";
      setDetectedPersona(detected);
    }

    setAnswers((prev) => ({ ...prev, [currentQ]: value }));

    if (opt) {
      setReaction({
        text: personalize(opt.reaction),
        name: opt.reactionName,
        photo: opt.reactionPhoto,
      });
    }

    // After showing reaction, proceed
    setTimeout(() => {
      setReaction(null);
      setDirection(1);

      // Check for testimonial insertion after Q3, Q6, Q9
      const testimonial = testimonials.find((t) => t.afterQ === currentQ + 1);
      if (testimonial) {
        setStage("testimonial");
        return;
      }

      // Check for checkpoint after Q3 (micro-commitment #1)
      if (currentQ === 2) {
        setStage("checkpoint");
        return;
      }

      // Check for checkpoint after Q9 (micro-commitment #2 + teaser)
      if (currentQ === 8) {
        setStage("checkpoint");
        return;
      }

      // After last question, go to optin
      if (currentQ >= QUESTIONS.length - 1) {
        setStage("optin");
        return;
      }

      setCurrentQ((prev) => prev + 1);
    }, 2500);
  };

  // Go back
  const handleBack = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ((prev) => prev - 1);
    }
  };

  // Continue from testimonial
  const continueFromTestimonial = () => {
    setStage("quiz");
    setDirection(1);
    setCurrentQ((prev) => prev + 1);
  };

  // Continue from checkpoint
  const continueFromCheckpoint = () => {
    // After checkpoint at Q3, show testimonial
    if (currentQ === 2) {
      const testimonial = testimonials.find((t) => t.afterQ === 3);
      if (testimonial) {
        setStage("testimonial");
        return;
      }
    }
    // After checkpoint at Q9, show teaser then continue
    if (currentQ === 8) {
      setStage("teaser");
      return;
    }
    setStage("quiz");
    setDirection(1);
    setCurrentQ((prev) => prev + 1);
  };

  // Continue from teaser
  const continueFromTeaser = () => {
    // Show testimonial after Q9
    const testimonial = testimonials.find((t) => t.afterQ === 9);
    if (testimonial) {
      setStage("testimonial");
      return;
    }
    setStage("quiz");
    setDirection(1);
    setCurrentQ((prev) => prev + 1);
  };

  // Submit optin
  const handleOptinSubmit = async () => {
    if (!email) return;
    setSubmitting(true);

    try {
      await fetch("/api/chat/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: name,
          lastName,
          email,
          phone,
          source: "mini-diploma-quiz",
          quizData: { ...answers, persona: detectedPersona, niche: nicheKey },
        }),
      });
    } catch (e) {
      console.error("Optin error:", e);
    }

    setSubmitting(false);
    setReviewStep(0);
    setStage("reviewing");
  };

  // Navigate to results
  const goToResults = () => {
    const route = ROLE_ROUTES[detectedPersona] || ROLE_ROUTES["other-passionate"];
    const params = new URLSearchParams({
      name,
      lastName,
      email,
      phone,
      niche: nicheKey,
      incomeGoal,
      persona: detectedPersona,
      ...Object.fromEntries(Object.entries(answers).map(([k, v]) => [`q${k}`, v])),
    });
    window.location.href = `${route}?${params.toString()}`;
  };

  // ─── RENDER ──────────────────────────────────────────────────────
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(180deg, ${BRAND.cream} 0%, #f5f0e8 50%, ${BRAND.cream} 100%)` }}>

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b" style={{ borderColor: `${BRAND.gold}30` }}>
        <div className="h-2" style={{ background: `${BRAND.gold}20` }}>
          <motion.div
            className="h-full"
            style={{ background: BRAND.goldMetallic }}
            initial={{ width: "20%" }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: BRAND.burgundy }}>FM Foundations Application</span>
          <span className="text-gray-500">{Math.round(calculateProgress())}% complete</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>

            {/* ═══ INTRO STAGE ═══ */}
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Sarah's Photo */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <Image
                        src={SARAH_AVATAR}
                        alt="Sarah"
                        width={100}
                        height={100}
                        className="rounded-full border-4 shadow-lg object-cover"
                        style={{ borderColor: BRAND.gold }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ background: BRAND.goldMetallic }}>
                        <span className="text-sm">👋</span>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-4 text-center">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      <em>&quot;Hey there! 👋 I&apos;m Sarah — a former burned-out ER nurse and single mum who was missing my kids&apos; school plays just to survive another double shift.</em>
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      <em>I found a better path through Functional Medicine... and I think you could too.</em>
                    </p>
                    <p className="text-sm sm:text-base font-medium leading-relaxed" style={{ color: BRAND.burgundy }}>
                      <em>This is the same Foundations program our highest-earning practitioners started with. Not everyone qualifies — but let&apos;s see if YOU do.</em>
                    </p>
                    <p className="text-sm sm:text-base text-gray-700">
                      <em>First, what&apos;s your name?&quot;</em>
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter your first name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 text-center text-lg focus:outline-none transition-colors"
                      style={{ borderColor: name ? BRAND.gold : "#e5e7eb", background: name ? `${BRAND.gold}08` : "white" }}
                    />
                    <Button
                      onClick={() => name.trim() && setStage("quiz")}
                      disabled={!name.trim()}
                      className="group w-full h-14 text-lg font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
                      style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative flex items-center justify-center">
                        Start My Application <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                      ))}
                    </div>
                    <span>2,847+ women have started their journey</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ QUIZ STAGE ═══ */}
            {stage === "quiz" && (
              <motion.div
                key={`quiz-${currentQ}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Sarah Avatar + Question */}
                  <div className="flex items-start gap-4">
                    <Image
                      src={SARAH_AVATAR}
                      alt="Sarah"
                      width={56}
                      height={56}
                      className="rounded-full border-2 shadow object-cover flex-shrink-0"
                      style={{ borderColor: BRAND.gold }}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Question {currentQ + 1} of {QUESTIONS.length}</p>
                      <h2 className="text-lg sm:text-xl font-bold" style={{ color: BRAND.burgundyDark }}>
                        {personalize(QUESTIONS[currentQ].question)}
                      </h2>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {QUESTIONS[currentQ].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        disabled={!!reaction}
                        className="w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-70"
                        style={{
                          borderColor: answers[currentQ] === opt.value ? BRAND.gold : "#e5e7eb",
                          background: answers[currentQ] === opt.value ? `${BRAND.gold}10` : "white",
                        }}
                      >
                        <span className="text-sm sm:text-base" style={{ color: BRAND.burgundyDark }}>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Reaction */}
                  <AnimatePresence>
                    {reaction && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-xl border"
                        style={{ background: `${BRAND.gold}08`, borderColor: `${BRAND.gold}30` }}
                      >
                        <div className="flex items-start gap-3">
                          {reaction.photo && (
                            <Image
                              src={reaction.photo}
                              alt={reaction.name || ""}
                              width={40}
                              height={40}
                              className="rounded-full border-2 object-cover flex-shrink-0"
                              style={{ borderColor: BRAND.gold }}
                            />
                          )}
                          <div className="flex-1">
                            {reaction.name && (
                              <p className="text-xs font-medium mb-1" style={{ color: BRAND.burgundy }}>{reaction.name}&apos;s story:</p>
                            )}
                            <p className="text-sm text-gray-700 italic">&quot;{reaction.text}&quot;</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Back Button */}
                  {currentQ > 0 && !reaction && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ TESTIMONIAL STAGE ═══ */}
            {stage === "testimonial" && (
              <motion.div
                key="testimonial"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {(() => {
                    const testimonial = testimonials.find((t) => t.afterQ === currentQ + 1);
                    if (!testimonial) return null;
                    return (
                      <>
                        <div className="flex justify-center">
                          <Image
                            src={testimonial.photo}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="rounded-full border-4 shadow-lg object-cover"
                            style={{ borderColor: BRAND.gold }}
                          />
                        </div>
                        <div className="text-center space-y-3">
                          <p className="text-base sm:text-lg text-gray-700 italic leading-relaxed">
                            &quot;{personalize(testimonial.text)}&quot;
                          </p>
                          <div>
                            <p className="font-bold" style={{ color: BRAND.burgundy }}>{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${BRAND.gold}15`, color: BRAND.burgundy }}>
                            <CheckCircle className="w-3 h-3" /> Verified Graduate
                          </div>
                        </div>
                        <Button
                          onClick={continueFromTestimonial}
                          className="group w-full h-12 font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                          style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <span className="relative flex items-center justify-center">
                            Continue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* ═══ CHECKPOINT STAGE (Micro-commitment) ═══ */}
            {stage === "checkpoint" && (
              <motion.div
                key="checkpoint"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex justify-center">
                    <Image
                      src={SARAH_AVATAR}
                      alt="Sarah"
                      width={80}
                      height={80}
                      className="rounded-full border-4 shadow-lg object-cover"
                      style={{ borderColor: BRAND.gold }}
                    />
                  </div>
                  <div className="text-center space-y-4">
                    {currentQ === 2 ? (
                      <>
                        <p className="text-base sm:text-lg text-gray-700 italic">
                          &quot;{name}, it sounds like you&apos;re ready for something different. I&apos;ve seen so many women in your exact situation transform their lives.
                        </p>
                        <p className="text-base sm:text-lg font-medium italic" style={{ color: BRAND.burgundy }}>
                          Ready to see what&apos;s possible for YOU?&quot;
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base sm:text-lg text-gray-700 italic">
                          &quot;{name}, you&apos;re almost there! Just 3 more questions to see if you qualify for our certification path.
                        </p>
                        <p className="text-base sm:text-lg font-medium italic" style={{ color: BRAND.burgundy }}>
                          Based on what you&apos;ve shared, I&apos;m already seeing a lot of potential here. 💛&quot;
                        </p>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={continueFromCheckpoint}
                    className="group w-full h-12 font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center">
                      {currentQ === 2 ? "Yes, Show Me" : "Let's Finish This"} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ TEASER STAGE (Results Preview at 88%) ═══ */}
            {stage === "teaser" && (
              <motion.div
                key="teaser"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: BRAND.goldMetallic }}>
                    <Sparkles className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">{name}, based on your answers so far...</p>
                    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: BRAND.burgundyDark }}>
                      You&apos;re on track to qualify as a
                    </h3>
                    <p className="text-lg font-bold" style={{ color: BRAND.burgundy }}>
                      Level 1 Functional Medicine Practitioner
                    </p>
                    <p className="text-base text-gray-600">
                      with earning potential of <strong style={{ color: BRAND.burgundy }}>$5,000 - $8,000/month</strong>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">Just 3 more questions to confirm your qualification!</p>
                  <Button
                    onClick={continueFromTeaser}
                    className="group w-full h-12 font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center">
                      Continue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ OPTIN STAGE ═══ */}
            {stage === "optin" && (
              <motion.div
                key="optin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Sarah */}
                  <div className="flex items-start gap-4">
                    <Image
                      src={SARAH_AVATAR}
                      alt="Sarah"
                      width={56}
                      height={56}
                      className="rounded-full border-2 shadow object-cover flex-shrink-0"
                      style={{ borderColor: BRAND.gold }}
                    />
                    <div className="flex-1">
                      <p className="text-sm sm:text-base text-gray-700 italic">
                        &quot;{name}, I put together a custom certification plan just for you based on your answers.
                      </p>
                      <p className="text-sm sm:text-base text-gray-700 italic mt-2">
                        Enter your best email and I&apos;ll send you:&quot;
                      </p>
                    </div>
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2">
                    {optinBullets.map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: BRAND.gold }} />
                        <span className="text-sm text-gray-700">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Your best email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                        style={{ borderColor: email ? BRAND.gold : "#e5e7eb" }}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone (optional - for SMS updates)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                        style={{ borderColor: phone ? BRAND.gold : "#e5e7eb" }}
                      />
                    </div>
                    <Button
                      onClick={handleOptinSubmit}
                      disabled={!email || submitting}
                      className="group w-full h-14 text-lg font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
                      style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative flex items-center justify-center">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Show My Results, Sarah! <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                      </span>
                    </Button>
                  </div>

                  {/* Trust */}
                  <p className="text-center text-xs text-gray-400 italic">
                    This is just between us — no spam, I promise. 💛
                  </p>
                </div>
              </motion.div>
            )}

            {/* ═══ REVIEWING STAGE ═══ */}
            {stage === "reviewing" && (
              <motion.div
                key="reviewing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin" style={{ color: BRAND.gold }} />
                    <h3 className="text-lg font-bold" style={{ color: BRAND.burgundyDark }}>Reviewing Your Application...</h3>
                  </div>
                  <div className="space-y-3">
                    {reviewSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {i <= reviewStep ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: BRAND.gold }} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                        )}
                        <span className={`text-sm ${i <= reviewStep ? "text-gray-700" : "text-gray-400"}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ QUALIFIED STAGE (Application Accepted!) ═══ */}
            {stage === "qualified" && (
              <motion.div
                key="qualified"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{ borderColor: `${BRAND.gold}40` }}
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Celebration Header */}
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg" style={{ background: BRAND.goldMetallic }}>
                      <CheckCircle className="w-10 h-10" style={{ color: BRAND.burgundyDark }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider" style={{ color: BRAND.gold }}>Application Status</p>
                      <h2 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: BRAND.burgundyDark }}>
                        ✅ Application Accepted
                      </h2>
                    </div>
                  </div>

                  {/* Sarah's Message */}
                  <div className="flex items-start gap-3">
                    <Image
                      src={SARAH_AVATAR}
                      alt="Sarah"
                      width={48}
                      height={48}
                      className="rounded-full border-2 object-cover flex-shrink-0"
                      style={{ borderColor: BRAND.gold }}
                    />
                    <div className="flex-1 p-4 rounded-xl" style={{ background: `${BRAND.gold}08` }}>
                      <p className="text-sm text-gray-700 italic">
                        &quot;Congratulations, {name}! 🎉 Based on your answers, you&apos;ve been <strong>accepted</strong> into the <strong>FM Foundations Program</strong> — the exact starting point used by practitioners now earning $5K-$8K/month.
                      </p>
                      <p className="text-sm text-gray-700 italic mt-2">
                        Only <strong>34% of applicants</strong> qualify. You&apos;re in that group.&quot;
                      </p>
                    </div>
                  </div>

                  {/* Qualification Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl text-center" style={{ background: `${BRAND.burgundy}08` }}>
                      <p className="text-xl font-bold" style={{ color: BRAND.burgundy }}>{qualFraming.percentile}</p>
                      <p className="text-xs text-gray-500">of applicants</p>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: `${BRAND.gold}10` }}>
                      <p className="text-xl font-bold" style={{ color: BRAND.burgundy }}>{nicheLabel}</p>
                      <p className="text-xs text-gray-500">specialization</p>
                    </div>
                  </div>

                  {/* Scarcity */}
                  <div className="p-3 rounded-xl text-center" style={{ background: `${BRAND.burgundy}08` }}>
                    <p className="text-sm font-medium" style={{ color: BRAND.burgundy }}>
                      ⚡ {cohort.spots} spots remaining in the {cohort.name} Cohort
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={goToResults}
                    className="group w-full h-14 text-lg font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center">
                      Claim My Spot <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Your spot is reserved for 15 minutes</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src={ASI_LOGO} alt="ASI" width={24} height={24} className="opacity-60" />
          <span className="text-xs text-gray-400">AccrediPro Standards Institute</span>
        </div>
        <p className="text-[10px] text-gray-400">© 2026 AccrediPro Academy. All rights reserved.</p>
      </div>
    </div>
  );
}
