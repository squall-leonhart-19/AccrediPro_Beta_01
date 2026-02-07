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
  Stethoscope,
  FlaskConical,
  Zap,
  Activity,
  Brain,
  Lock,
  Mail,
  Phone,
  User,
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
const CERTIFICATE_IMG = "/FUNCTIONAL_MEDICINE_CERTIFICATE.webp";
const BUNDLE_IMG = "https://assets.accredipro.academy/fm-certification/FM-BUNDLE-IMG.png";
const ACCREDITATION_LOGOS = "/all-logos.png";

const TESTIMONIAL_PHOTOS = {
  karen: "/assets/migrated/TESTIMONIAL_03.jpg",
  margaret: "/assets/migrated/TESTIMONIAL_01.jpg",
  carolyn: "/assets/migrated/TESTIMONIAL_02.jpg",
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

// ─── Practitioner Types ────────────────────────────────────────────
const PRACTITIONER_TYPES: Record<string, { label: string; icon: typeof Stethoscope; description: string }> = {
  "hormone-health": { label: "Hormone Health Specialist", icon: Activity, description: "Help women optimize hormones, navigate menopause, and restore balance using clinical protocols." },
  "gut-restoration": { label: "Gut Restoration Specialist", icon: FlaskConical, description: "Master the gut-body connection and help clients heal digestive issues using root-cause protocols." },
  "metabolic-optimization": { label: "Metabolic Optimization Specialist", icon: Zap, description: "Help clients transform their metabolism, manage weight, and optimize energy through clinical protocols." },
  "burnout-recovery": { label: "Burnout Recovery Specialist", icon: Brain, description: "Help high-achieving women recover from adrenal fatigue and chronic burnout using evidence-based protocols." },
  "autoimmune-support": { label: "Autoimmune Support Specialist", icon: Stethoscope, description: "Help clients manage autoimmune conditions naturally using the FM Certification clinical framework." },
  "other-specialty": { label: "Custom Specialty Path", icon: Sparkles, description: "Tell us your passion and we'll map it to our specialty tracks. Your unique focus becomes your competitive advantage." },
};

// ─── Specialization → Practitioner Type mapping ──────────────────
const SPEC_TO_PRACT: Record<string, string> = {
  "gut-health": "gut-restoration",
  "hormone-health": "hormone-health",
  "burnout": "burnout-recovery",
  "autoimmune": "autoimmune-support",
  "metabolic": "metabolic-optimization",
  "explore": "other-specialty",
};

// ─── Background → Persona mapping ─────────────────────────────────
const BACKGROUND_TO_PERSONA: Record<string, Persona> = {
  "nurse": "healthcare-pro",
  "doctor": "healthcare-pro",
  "allied-health": "healthcare-pro",
  "mental-health": "health-coach",
  "wellness": "health-coach",
  "career-change": "other-passionate",
};

// ─── Persona types ─────────────────────────────────────────────────
type Persona = "healthcare-pro" | "health-coach" | "corporate" | "stay-at-home-mom" | "other-passionate";

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 1: Persona-specific testimonials
// ═══════════════════════════════════════════════════════════════════
interface Testimonial { name: string; role: string; text: string; photo: string; afterQ: number }

const TESTIMONIALS_BY_PERSONA: Record<Persona, Testimonial[]> = {
  "healthcare-pro": [
    { name: "Dr. Karen L.", role: "Former Family Practice - Now FM Certified Practitioner", text: "As a nurse for 18 years, I thought I knew clinical medicine. The program showed me a whole new level. I left the hospital and now earn $11K/month running my own functional practice.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 3 },
    { name: "Margaret S.", role: "PA to Clinical Practitioner", text: "I was exhausted from the hospital grind. Now I set my own hours, see clients I actually want to help, and earn MORE than my PA salary. The certification changed everything.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 8 },
    { name: "Carolyn R.", role: "Former ICU Nurse, Age 54", text: "I used my nursing background to fast-track through the program. Within 60 days I had my first 5 paying clients. My hospital colleagues can't believe the transformation.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 13 },
  ],
  "health-coach": [
    { name: "Margaret S.", role: "Health Coach to Clinical Practitioner", text: "Before the certification I was a health coach charging $50/session and struggling to fill my calendar. Now: $9K/month with a waitlist. The ASI certification gave me the credibility I was missing.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 3 },
    { name: "Dr. Karen L.", role: "Yoga Teacher to FM Certified Practitioner", text: "I had years of wellness experience but no clinical framework. The certification gave me the structure to charge $200/session instead of $40 for yoga classes. Total game-changer.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 8 },
    { name: "Carolyn R.", role: "Nutritionist to Certified Specialist", text: "Every coach should upgrade to FM Certification. My nutrition coaching was good but limited. Now I can run labs, create clinical protocols, and clients see me as a real authority.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 13 },
  ],
  "corporate": [
    { name: "Carolyn R.", role: "Former Marketing Director, Age 52", text: "I left my corporate job at 49 with zero health credentials. The certification gave me everything - the clinical skills, the business framework, the confidence. Now earning $7K/month and fully booked.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 3 },
    { name: "Margaret S.", role: "Ex-Finance Manager to Practitioner", text: "My corporate project management skills turned out to be my secret weapon. I launched my practice like a business from day one. The certification gave me the clinical side - I brought the business acumen.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 8 },
    { name: "Dr. Karen L.", role: "Former HR Executive to Clinical Director", text: "Everyone thought I was crazy leaving a 6-figure corporate salary. 8 months later, I matched it with my own practice and actually love Monday mornings again.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 13 },
  ],
  "stay-at-home-mom": [
    { name: "Margaret S.", role: "Stay-at-Home Mom to Certified Practitioner", text: "I studied during nap times and after bedtime. Within 4 months I was certified. Now I see clients 3 days a week while my kids are at school and earn $6K/month. Best decision I ever made.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 3 },
    { name: "Carolyn R.", role: "Mom of 3 to FM Certified Practitioner", text: "I felt invisible for years - just 'someone's mom.' The certification gave me my identity back. I built my practice from my kitchen table and now my kids tell their friends 'my mom helps people heal.'", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 8 },
    { name: "Dr. Karen L.", role: "Former SAHM, Now Earning $8K/Month", text: "My husband was skeptical. Then my first month I earned $3K working part-time. Now I contribute more to our family than I ever did before kids. The program fits around family life perfectly.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 13 },
  ],
  "other-passionate": [
    { name: "Carolyn R.", role: "Career Changer, Age 52", text: "I was skeptical after wasting money on other programs. Now I'm earning $7K/month and fully booked. Started from zero at age 49. No health background needed - The program teaches everything.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 3 },
    { name: "Margaret S.", role: "Teacher to Clinical Practitioner", text: "I had no medical background at all - I was a high school teacher. The program broke everything down so clearly. My teaching skills actually help me explain protocols to clients beautifully.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 8 },
    { name: "Dr. Karen L.", role: "Complete Career Change at 47", text: "I proved everyone wrong. No degree in health, no clinical experience, nothing. Just passion and FM Certification. 6 months later: certified, confident, and earning more than my previous career.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 13 },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 2: Persona-aware Sarah reactions
// ═══════════════════════════════════════════════════════════════════
// Key = "q{questionIndex}-{answerValue}", value = persona overrides
// These override the base reaction when persona is known (after Q1-Q2)
const PERSONA_REACTIONS: Record<Persona, Record<string, string>> = {
  "healthcare-pro": {
    // Q6 (index 5) - Income Goal
    "q5-3k-5k": "Very achievable for someone with your clinical background. Most healthcare professionals hit $5K within their first 60 days.",
    "q5-5k-10k": "Perfect target. Nurses and PAs who add FM Certification typically earn 2-3x their hospital salary within 6 months.",
    "q5-10k-15k": "With your medical training plus FM Certification, $15K/month is realistic within 12 months.",
    "q5-15k-plus": "Clinical directors with your background build multi-practitioner clinics. The program gives you the framework to scale.",
    // Q9 (index 8) - Pain Point
    "q8-time-for-money": "12-hour shifts, rotating schedules, no autonomy over your time. FM breaks that cycle completely.",
    "q8-stuck": "You're stuck in a system that undervalues you. FM Certification is the exit plan.",
    "q8-exhausted": "Healthcare burnout is real — and FM is the antidote. You deserve better.",
    // Q10 (index 9) - Current Income
    "q9-under-3k": "With your clinical background, you should be earning 5-6x that. FM Certification bridges that gap immediately.",
    "q9-over-8k": "Outstanding. Healthcare professionals at your level typically scale to $15-25K/month with FM Certification.",
  },
  "health-coach": {
    "q5-3k-5k": "Very achievable. Coaches who add clinical certification see 3x income because clinical > coaching in perceived value.",
    "q5-5k-10k": "That's the sweet spot for upgraded coaches. You already know how to work with clients — the program adds clinical authority.",
    "q5-10k-15k": "Coaches who add group clinical programs and lab interpretation hit $15K+ regularly.",
    "q5-15k-plus": "Think clinic director. Coaching background plus FM clinical skills plus team leverage. It's the proven path.",
    "q8-time-for-money": "The classic coaching trap — trading time for too little money. FM Certification means 3-4x more per session.",
    "q8-no-credential": "You already help people as a coach. FM Certification makes you the authority clients are looking for.",
    "q9-under-3k": "That's the coaching ceiling. Clinical practitioners break right through it.",
    "q9-over-8k": "You're already a successful coach. FM Certification takes you from 'coach' to 'clinical practitioner.'",
  },
  "corporate": {
    "q5-3k-5k": "Very achievable. Most corporate professionals replace their previous income within 90 days of certification.",
    "q5-5k-10k": "$10K/month is realistic within 6 months. Your project management skills give you a massive advantage.",
    "q5-10k-15k": "Think like a CEO, not a practitioner. Your corporate experience translates directly to a multi-revenue practice.",
    "q5-15k-plus": "Your corporate mind thinks at scale — that's rare in wellness. FM plus business skills is the formula.",
    "q8-stuck": "Stuck in a system that promotes politics over purpose. FM gives you complete autonomy.",
    "q8-meant-for-more": "You ARE meant for more than quarterly reviews and office politics. Your professional skills are an unfair advantage.",
    "q9-over-8k": "Impressive. FM practitioners match corporate salaries working half the hours — and they actually love their work.",
  },
  "stay-at-home-mom": {
    "q5-3k-5k": "Totally achievable around a family schedule. Most mom practitioners work 3 days/week and hit $5K within 90 days.",
    "q5-5k-10k": "$10K/month working around school hours is absolutely doable. Our mom practitioners are proof.",
    "q5-10k-15k": "Ambitious and possible. Moms who add virtual group programs earn $15K+ during school hours.",
    "q5-15k-plus": "Think big. Some of our mom practitioners built full practices with team members.",
    "q8-exhausted": "Running a household is exhausting enough. You deserve work that energizes you instead of draining you.",
    "q8-stuck": "Feeling stuck as 'just a mom' is real. FM gives you a career that works WITH your family.",
    "q9-under-3k": "Most moms in our program start at zero. That's not a limitation — it's a clean slate.",
  },
  "other-passionate": {
    "q5-3k-5k": "Totally achievable regardless of background. 38% of our practitioners who hit $5K/month came from non-health fields.",
    "q5-5k-10k": "Your unique background is actually an advantage. Fresh perspective that traditional health professionals lack.",
    "q5-10k-15k": "Non-traditional backgrounds often build the most creative, successful practices.",
    "q5-15k-plus": "The most innovative practices in our network were built by people from non-traditional backgrounds.",
    "q8-meant-for-more": "That inner knowing is powerful. 38% of our top performers felt exactly the same way before starting.",
    "q8-no-credential": "You already know how to help people. FM Certification makes it official.",
    "q9-under-3k": "Starting from zero with pure passion is the best starting point. You're in good company.",
  },
};

// (Reviewing steps removed — replaced by inline ANALYZE_STEPS in component)

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 4: Persona-specific qualification framing
// ═══════════════════════════════════════════════════════════════════
const QUALIFICATION_FRAMING: Record<Persona, { percentile: string; reason: string }> = {
  "healthcare-pro": { percentile: "Top 6%", reason: "Your clinical background places you in our highest acceptance tier. Healthcare professionals qualify at a 94% rate." },
  "health-coach": { percentile: "Top 12%", reason: "Your coaching experience accelerates certification by 40%. You already have the client-facing skills most people lack." },
  "corporate": { percentile: "Top 18%", reason: "Your professional and analytical skills are rarer than you think in wellness. Corporate switchers build the most efficient practices." },
  "stay-at-home-mom": { percentile: "Top 14%", reason: "Your empathy, patience, and life experience scored exceptionally. Mom practitioners have the highest client retention rates." },
  "other-passionate": { percentile: "Top 20%", reason: "Your passion score ranked in the highest bracket. Non-traditional backgrounds bring the fresh perspective this field needs." },
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 5: Persona-specific scarcity/cohort naming
// ═══════════════════════════════════════════════════════════════════
const COHORT_NAMES: Record<Persona, { name: string; spots: number }> = {
  "healthcare-pro": { name: "Healthcare Fast-Track Cohort", spots: 7 },
  "health-coach": { name: "Coach-to-Clinical Upgrade Cohort", spots: 9 },
  "corporate": { name: "Career Transition Cohort", spots: 9 },
  "stay-at-home-mom": { name: "Flexible Schedule Cohort", spots: 11 },
  "other-passionate": { name: "Q1 2026 Open Cohort", spots: 14 },
};

// (Optin bullets removed — email capture is now a single-field inline step)

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 7: Persona-specific question subtitles
// ═══════════════════════════════════════════════════════════════════
// Keys = question index in new 16-question order
const PERSONA_SUBTITLES: Record<Persona, Record<number, string>> = {
  "healthcare-pro": {
    5: "Your clinical salary is your baseline. FM practitioners earn 2-3x their hospital salary.",
    8: "Healthcare professionals feel this deeply. Be honest — it matters for your results.",
    9: "This helps us show you the real income gap FM Certification closes.",
  },
  "health-coach": {
    5: "Be honest. This helps us show you the income gap between coaching and clinical practice.",
    6: "This is what separates $50/hr coaches from $200/hr clinical practitioners.",
    8: "Coaches feel this frustration more than anyone. What's YOUR biggest pain?",
  },
  "corporate": {
    5: "Most career changers dream bigger than they realize. What would change your life?",
    8: "Your corporate frustrations are fuel for transformation. What hurts most?",
    9: "This helps us show the real ROI of FM Certification for career changers.",
  },
  "stay-at-home-mom": {
    5: "No judgment here. This helps us create a realistic earning path that fits your life.",
    8: "Moms feel this deeply. Be honest — your results page will reflect YOUR reality.",
    9: "Many of our most successful mom practitioners started earning $0. Wherever you are is perfect.",
  },
  "other-passionate": {
    5: "Starting from zero with passion is actually our favorite starting point.",
    8: "This frustration is exactly what drives the biggest transformations.",
    9: "Wherever you're starting, your unique background is an asset.",
  },
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 8: Persona-specific certificate subtitle
// ═══════════════════════════════════════════════════════════════════
const CERT_SUBTITLE: Record<Persona, string> = {
  "healthcare-pro": "This credential stacks with your RN/PA/MA - doubling your clinical value and opening private practice doors.",
  "health-coach": "Upgrade from coach to clinical practitioner. This is the credential your clients have been waiting for you to get.",
  "corporate": "Your ticket out of corporate. This certification replaces degrees with demonstrated clinical competence.",
  "stay-at-home-mom": "Work from home, set your own hours, earn $5-10K+/month while being fully present for your family.",
  "other-passionate": "Proof that passion + the right framework beats traditional credentials. Your unique path starts here.",
};

// ═══════════════════════════════════════════════════════════════════
// QUESTIONS (base — reactions are overridden dynamically)
// ═══════════════════════════════════════════════════════════════════
interface QuizOption { label: string; value: string; reaction: string; strength: "strong" | "good" | "developing" }
interface QuizStep { id: number; pillar: string; question: string; subtitle?: string; options: QuizOption[] }

const QUESTIONS: QuizStep[] = [
  // ═══════════════════════════════════════════════════════════════════
  // BLOCK 1: IDENTITY (Q1-Q3) — DMN Activation, Dopamine Priming
  // Answerable in <2 seconds. Zero thinking. Pure self-recognition.
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 1, pillar: "Identity",
    question: "What best describes your life right now?",
    subtitle: "This helps us personalize everything for you.",
    options: [
      { label: "I'm working full-time but dreaming of something more", value: "working-fulltime", reaction: "You're in the right place. Women in your exact situation are our highest achievers.", strength: "strong" },
      { label: "I'm in a health/wellness career and want to go deeper", value: "wellness-career", reaction: "Amazing! You already have the foundation. Let's take it to the next level.", strength: "strong" },
      { label: "I'm ready for a complete career change", value: "career-change", reaction: "That takes courage — and 31% of our highest earners made that exact leap.", strength: "strong" },
      { label: "I'm a mom ready for my next chapter", value: "mom-next-chapter", reaction: "Moms bring the most incredible empathy and drive to this work.", strength: "strong" },
      { label: "I'm retired and looking for my next purpose", value: "retired-purpose", reaction: "What a beautiful chapter to write. Your life experience is your biggest asset.", strength: "strong" },
    ],
  },
  {
    id: 2, pillar: "Background",
    question: "What's your background?",
    subtitle: "This helps us understand your starting point.",
    options: [
      { label: "Nurse or Nursing Assistant", value: "nurse", reaction: "Excellent! Healthcare professionals have a 94% acceptance rate. Your clinical background is a major advantage.", strength: "strong" },
      { label: "Doctor, PA, or NP", value: "doctor", reaction: "Your medical training is a massive advantage. FM certification adds a whole new dimension to your practice.", strength: "strong" },
      { label: "Allied Health (PT, OT, Dietitian, etc.)", value: "allied-health", reaction: "Great foundation! Your healthcare experience translates directly to FM practice.", strength: "strong" },
      { label: "Mental Health Professional", value: "mental-health", reaction: "The mind-body connection is central to FM. Your background is incredibly valuable.", strength: "strong" },
      { label: "Wellness or Fitness Professional", value: "wellness", reaction: "Perfect base to build on! Coaches who upgrade to clinical certification see 3x income increases.", strength: "good" },
      { label: "Other career — ready for a change", value: "career-change", reaction: "You'd be surprised — 31% of our highest earners came from other careers. Your professional skills are a massive advantage.", strength: "good" },
    ],
  },
  {
    id: 3, pillar: "Motivation",
    question: "What brought you here today?",
    subtitle: "Every reason is a valid reason.",
    options: [
      { label: "I want to help people heal naturally", value: "help-people", reaction: "That's what it's all about. You'll have the tools to actually transform lives.", strength: "strong" },
      { label: "I want to leave my job and work for myself", value: "leave-job", reaction: "Freedom. That's what 67% of our practitioners achieved within their first year.", strength: "strong" },
      { label: "I want to add FM to my existing practice", value: "add-services", reaction: "Smart move! Adding FM services typically doubles or triples practice revenue.", strength: "strong" },
      { label: "I want the freedom to work from home", value: "work-from-home", reaction: "That's exactly what this certification enables. Set your own hours, work from anywhere.", strength: "strong" },
      { label: "I'm burned out and need a new path", value: "burned-out", reaction: "Burnout is the #1 reason women come to us. FM is the antidote — purpose-driven work on YOUR terms.", strength: "strong" },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════
  // BLOCK 2: AWARENESS (Q4-Q5) — Surface past failures + fears
  // Before building the dream, acknowledge where they've been stuck.
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 4, pillar: "Experience",
    question: "What have you already tried?",
    subtitle: "No judgment — this helps us understand your journey.",
    options: [
      { label: "Other certifications or courses that didn't deliver", value: "other-certs", reaction: "You invested money and time and didn't get results. That's not your fault — it's the program's. This one is different.", strength: "strong" },
      { label: "Coaching programs or mentorships", value: "coaching", reaction: "Coaching gives motivation but rarely gives clinical skills. FM Certification gives you both.", strength: "strong" },
      { label: "Self-study — YouTube, books, podcasts", value: "self-study", reaction: "You clearly have the drive. What you're missing is the structured clinical framework and the credential.", strength: "good" },
      { label: "Nothing yet — this is my first step", value: "nothing-yet", reaction: "A clean slate is powerful. No bad habits to unlearn. You're starting with the right program first.", strength: "strong" },
    ],
  },
  {
    id: 5, pillar: "Mindset",
    question: "What's your biggest fear about starting something new?",
    subtitle: "Be honest — everyone has one.",
    options: [
      { label: "I'm worried it's too late for me", value: "too-late", reaction: "Our average graduate is 47. Our oldest is 68. She now earns $6K/month. It is NEVER too late.", strength: "strong" },
      { label: "I'm not sure I can afford it", value: "afford", reaction: "We hear this a lot. That's exactly why we created the scholarship program — so finances don't stop anyone.", strength: "good" },
      { label: "I don't know if I have enough time", value: "no-time", reaction: "20 minutes a day. That's it. Most women study during lunch breaks or after the kids go to bed.", strength: "strong" },
      { label: "I'm afraid I'm not smart enough or qualified", value: "not-qualified", reaction: "If you can learn to drive a car, you can learn functional medicine. The program is designed for beginners.", strength: "strong" },
      { label: "I've been burned before by programs that overpromise", value: "burned-before", reaction: "That skepticism is healthy. That's why we have 9 accreditations, 2,847+ graduates, and a 7-day money-back guarantee.", strength: "strong" },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════
  // BLOCK 3: DESIRE (Q6-Q8) — Dream Building, Emotional Peak
  // Now that she's engaged, build the dream. Future self visualization.
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 6, pillar: "Income Goal",
    question: "What monthly income would change your life?",
    subtitle: "Dream big — there's no wrong answer here.",
    options: [
      { label: "$3,000 to $5,000 a month", value: "3k-5k", reaction: "Very achievable. 73% of our practitioners hit this within their first 90 days.", strength: "strong" },
      { label: "$5,000 to $10,000 a month", value: "5k-10k", reaction: "That's our sweet spot. The average practitioner earns $8-12K/month within 6 months.", strength: "strong" },
      { label: "$10,000 to $15,000 a month", value: "10k-15k", reaction: "Ambitious and very doable. That's what our top practitioners earn working from home.", strength: "strong" },
      { label: "$15,000+ a month", value: "15k-plus", reaction: "That's the mindset of a future clinical director. Practitioners who add group programs hit this regularly.", strength: "strong" },
    ],
  },
  {
    id: 7, pillar: "Specialization",
    question: "Which area of health excites you most?",
    subtitle: "There's no wrong answer — what calls to you?",
    options: [
      { label: "Gut Health and Digestive Wellness", value: "gut-health", reaction: "Great choice! Gut health is the foundation of all wellness. Our gut specialists are in massive demand.", strength: "strong" },
      { label: "Hormonal Health and Balance", value: "hormone-health", reaction: "Perfect! Women are desperate for qualified hormone practitioners. This is our #1 most in-demand specialty.", strength: "strong" },
      { label: "Stress, Burnout and Adrenal Recovery", value: "burnout", reaction: "So needed right now! 1 in 3 professional women suffer from burnout. The demand is exploding.", strength: "strong" },
      { label: "Autoimmune and Inflammation", value: "autoimmune", reaction: "Complex cases need clinical practitioners. This is advanced-level, premium-rate work.", strength: "strong" },
      { label: "Weight Management and Metabolic Health", value: "metabolic", reaction: "Beyond basic diets — real metabolic transformation. One of the highest-paying specialties.", strength: "strong" },
      { label: "Not sure yet — I want to explore", value: "explore", reaction: "That's perfect! We'll help you discover your ideal niche during the program.", strength: "good" },
    ],
  },
  {
    id: 8, pillar: "Dream Life",
    question: "Imagine 12 months from now — certified, with clients, earning your goal income. What matters most?",
    subtitle: "Close your eyes for a second and picture it...",
    options: [
      { label: "Time freedom — setting my own schedule", value: "time-freedom", reaction: "Being there for every school pickup, every soccer game. That's the practitioner life.", strength: "strong" },
      { label: "Financial freedom — never stress about money again", value: "financial-freedom", reaction: "Imagine never stressing about bills again. That peace of mind changes everything.", strength: "strong" },
      { label: "Purpose and meaning — doing work that matters", value: "purpose", reaction: "Waking up excited every morning, knowing you're genuinely transforming lives. That feeling is real.", strength: "strong" },
      { label: "The complete transformation — all of the above", value: "complete-transformation", reaction: "That's exactly what this certification delivers. Not just income — a complete life transformation.", strength: "strong" },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════
  // BLOCK 4: PAIN + REALITY (Q9-Q11) — Contrast, Urgency
  // Dream is built. Now create contrast with current reality.
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 9, pillar: "Pain Point",
    question: "What frustrates you MOST about your current situation?",
    subtitle: "Be honest with yourself...",
    options: [
      { label: "I'm trading time for money and it's not sustainable", value: "time-for-money", reaction: "That's the worst feeling. You're stuck on a treadmill that never stops. FM breaks that cycle.", strength: "strong" },
      { label: "I feel stuck with no clear path forward", value: "stuck", reaction: "You can see where you want to be but there's no roadmap. Until now.", strength: "strong" },
      { label: "I know I'm meant for more but don't know how to get there", value: "meant-for-more", reaction: "That inner knowing is real. The gap between your potential and your reality — that's what we close.", strength: "strong" },
      { label: "I'm exhausted and my health or relationships are suffering", value: "exhausted", reaction: "The thing you're sacrificing is the thing you're supposed to be protecting. Let's fix that.", strength: "strong" },
      { label: "I have the knowledge but no credential to back it up", value: "no-credential", reaction: "You KNOW you can help people. You just can't prove it. ASI certification gives you that credibility.", strength: "strong" },
    ],
  },
  {
    id: 10, pillar: "Current Income",
    question: "What is your current monthly income?",
    subtitle: "This helps us understand the gap between where you are and where you want to be.",
    options: [
      { label: "Under $3,000 a month", value: "under-3k", reaction: "Noted. The gap between where you are and where you want to be — that's exactly what this certification closes.", strength: "good" },
      { label: "$3,000 to $5,000 a month", value: "3k-5k", reaction: "Solid base. But you deserve more. Let's see what we can build.", strength: "good" },
      { label: "$5,000 to $8,000 a month", value: "5k-8k", reaction: "Not bad — but imagine doubling that while working half the hours.", strength: "strong" },
      { label: "Over $8,000 a month", value: "over-8k", reaction: "Impressive! You're already ahead. FM certification takes you to the next level.", strength: "strong" },
    ],
  },
  {
    id: 11, pillar: "Commitment",
    question: "How much time can you realistically dedicate per week?",
    subtitle: "There's no wrong answer — the program adapts to YOUR schedule.",
    options: [
      { label: "20 minutes a day — I'll make it work", value: "20-min", reaction: "That's all it takes. 20 minutes a day is exactly how the program is designed.", strength: "strong" },
      { label: "About an hour a day", value: "1-hour", reaction: "With that commitment, you could be certified in as little as 4 weeks. Impressive dedication.", strength: "strong" },
      { label: "Weekends only", value: "weekends", reaction: "Weekend warriors are some of our most focused students. Quality over quantity.", strength: "good" },
      { label: "I'll find the time — this matters to me", value: "find-time", reaction: "That determination is everything. Women who say this have a 91% completion rate.", strength: "strong" },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════
  // ─── EMAIL CAPTURE HAPPENS HERE (between Q11 and Q12) ─────────
  // 11 micro-commitments invested. Deep trust built. Email feels natural.
  // ═══════════════════════════════════════════════════════════════════
  // BLOCK 5: COMMITMENT (Q12-Q16) — Qualifying, Final Segmentation
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 12, pillar: "Purpose",
    question: "Who would benefit most from your new skills?",
    subtitle: "This shapes how we personalize your certification path.",
    options: [
      { label: "My future clients — I want to build a practice", value: "clients", reaction: "You're already thinking like a practitioner. That mindset is half the battle.", strength: "strong" },
      { label: "My family — I want to protect their health", value: "family", reaction: "There's no greater motivation than family. You'll have clinical tools most doctors don't.", strength: "strong" },
      { label: "Myself — I need to heal my own body first", value: "myself", reaction: "Heal yourself first, then help others. That's exactly how the best practitioners are born.", strength: "strong" },
      { label: "My community — I want to make a bigger impact", value: "community", reaction: "Community health is where functional medicine has the biggest impact. You'll be a leader.", strength: "strong" },
    ],
  },
  {
    id: 13, pillar: "Readiness",
    question: "What do you already have set up?",
    subtitle: "This helps us personalize your certification path.",
    options: [
      { label: "Nothing yet — I'm starting completely fresh", value: "nothing", reaction: "A blank slate is actually powerful. We'll build everything for you from the ground up.", strength: "good" },
      { label: "Business name or social media presence", value: "name-social", reaction: "You've already started! The certification gives you the clinical credibility to match your brand.", strength: "good" },
      { label: "I already see clients", value: "have-clients", reaction: "Perfect! You can immediately apply what you learn. Your existing clients will see the difference.", strength: "strong" },
      { label: "I have everything — just need the training", value: "have-everything", reaction: "You're ready for takeoff. The certification is the final piece of your puzzle.", strength: "strong" },
    ],
  },
  {
    id: 14, pillar: "Timeline",
    question: "When would you ideally want to start?",
    subtitle: "This helps us understand your readiness.",
    options: [
      { label: "Immediately — I'm ready now", value: "immediately", reaction: "Immediate starters have a 94% completion rate. That energy is everything.", strength: "strong" },
      { label: "Within the next 30 days", value: "30-days", reaction: "Perfect timing. You'll be certified before most people finish a Netflix series.", strength: "strong" },
      { label: "In 1 to 3 months", value: "1-3-months", reaction: "We can reserve your spot. Let's finish and see your full results.", strength: "good" },
      { label: "Just exploring for now", value: "exploring", reaction: "That's okay! Let's see what your personalized path looks like.", strength: "developing" },
    ],
  },
  {
    id: 15, pillar: "Reflection",
    question: "How would you feel if you looked back a year from now and hadn't started?",
    subtitle: "Take a moment with this one...",
    options: [
      { label: "Devastated — I'd deeply regret not taking action", value: "devastated", reaction: "That feeling you just had? That's your answer. Don't let future-you down.", strength: "strong" },
      { label: "Frustrated — another year of the same thing", value: "frustrated", reaction: "A year from now, you'll wish you started today. Every single graduate says this.", strength: "strong" },
      { label: "Fine — but I know I'd always wonder 'what if'", value: "what-if", reaction: "The 'what if' is the question that haunts people for decades. Let's answer it now.", strength: "good" },
      { label: "I'd find another way eventually", value: "another-way", reaction: "Maybe. But the women who are earning $8K+/month right now all started with a single step.", strength: "developing" },
    ],
  },
  {
    id: 16, pillar: "Intent",
    question: "Are you doing this to build a business, for personal growth, or both?",
    subtitle: "Final question — this shapes your entire results page.",
    options: [
      { label: "Build a business — help people AND earn income", value: "business", reaction: "Entrepreneurial spirit! Your results page will include income projections and business tools.", strength: "strong" },
      { label: "Personal growth — heal myself and loved ones", value: "personal", reaction: "Beautiful. Your results will focus on deep clinical knowledge and personal mastery.", strength: "strong" },
      { label: "Both — learn first, maybe business later", value: "both", reaction: "Smart approach. We'll show you both paths so you can decide on your own terms.", strength: "strong" },
    ],
  },
];




// ═══════════════════════════════════════════════════════════════════
// CONDITIONAL INSERTS — light branching based on quiz answers
// These appear between questions when specific conditions are met.
// ═══════════════════════════════════════════════════════════════════
interface ConditionalInsert {
  id: string;
  afterQ: number; // question index (0-based) that triggers this
  condition: (answers: Record<number, string>) => boolean;
  type: "question" | "reassurance";
  pillar?: string;
  question?: string;
  subtitle?: string;
  options?: QuizOption[];
  sarahMessage?: string;
  stats?: { label: string; value: string }[];
}

const CONDITIONAL_INSERTS: ConditionalInsert[] = [
  // ── After Q2 (background): Career changers get a follow-up ──────
  {
    id: "career-leaving",
    afterQ: 1,
    condition: (a) => a[1] === "career-change",
    type: "question",
    pillar: "Background",
    question: "What career are you transitioning from?",
    subtitle: "This helps us show you how your professional skills transfer directly.",
    options: [
      { label: "Corporate / Office / Management", value: "corporate", reaction: "Corporate skills translate beautifully — project management, communication, leadership. You're ahead of 80% of new practitioners.", strength: "strong" },
      { label: "Education / Teaching", value: "education", reaction: "Teachers make exceptional practitioners. You already know how to explain complex concepts simply — that's a clinical superpower.", strength: "strong" },
      { label: "Retail / Service / Hospitality", value: "service", reaction: "Customer-facing experience is gold. You already know how to read people and make them feel seen.", strength: "strong" },
      { label: "Creative / Arts / Freelance", value: "creative", reaction: "Creative thinkers build the most unique, memorable practices. Your brain works differently — that's your edge.", strength: "strong" },
      { label: "Something else entirely", value: "other-career", reaction: "Every career builds transferable skills. You'd be surprised how much of your experience applies directly.", strength: "good" },
    ],
  },
  // ── After Q5 (biggest fear = afford): Financial reassurance ─────
  {
    id: "afford-reassurance",
    afterQ: 4,
    condition: (a) => a[4] === "afford",
    type: "reassurance",
    sarahMessage: "I hear you, {name}. Finances are a real concern — and I respect that you're thinking about it seriously. Here's what I want you to know before we continue...",
    stats: [
      { label: "Average ROI timeline", value: "87% of graduates earn back their full investment within 60 days" },
      { label: "Scholarship available", value: "Up to 70% tuition reduction for qualified applicants like you" },
      { label: "Flexible start", value: "Start for as little as $100 — full access from day one" },
    ],
  },
  // ── After Q5 (biggest fear = burned before): Trust-building ─────
  {
    id: "burned-credibility",
    afterQ: 4,
    condition: (a) => a[4] === "burned-before",
    type: "reassurance",
    sarahMessage: "I completely understand your skepticism, {name}. You've invested in programs before and been let down. Here's why ASI is fundamentally different...",
    stats: [
      { label: "9 International Accreditations", value: "Recognized by CPD, IPHM, CMA and 6 more — not self-certified" },
      { label: "2,847+ Verified Graduates", value: "Real women, real results, across 14 countries" },
      { label: "7-Day Money-Back Guarantee", value: "Full refund, no questions asked — because we know you'll stay" },
      { label: "4.8/5 Independent Rating", value: "Verified by third-party review platforms, not our own website" },
    ],
  },
];

// ─── Types ─────────────────────────────────────────────────────────
type Stage = "intro" | "quiz" | "testimonial" | "conditional" | "email-capture" | "analyzing" | "qualified" | "result";
const TOTAL_STEPS = 20; // 16 questions + intro + email-capture + analyzing + qualified

// ─── Route mapping ─────────────────────────────────────────────────
const ROLE_ROUTES: Record<string, string> = {
  "healthcare-pro": "/results/healthcare",
  "health-coach": "/results/coach",
  "corporate": "/results/corporate",
  "stay-at-home-mom": "/results/mom",
  "other-passionate": "/results/career-change",
};

export default function FMCertificationQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reaction, setReaction] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [currentConditional, setCurrentConditional] = useState<string | null>(null);
  const [conditionalAnswers, setConditionalAnswers] = useState<Record<string, string>>({});
  const [shownConditionals, setShownConditionals] = useState<Record<string, boolean>>({});
  const fireConfetti = useConfetti();

  const practitionerTypeKey = SPEC_TO_PRACT[answers[6]] || "hormone-health";
  const practitionerType = PRACTITIONER_TYPES[practitionerTypeKey] || PRACTITIONER_TYPES["hormone-health"];
  const incomeGoal = answers[5] || "5k-10k";
  // Persona: Q1 (life situation) overrides for mom/career-change, else use Q2 (background)
  const currentRole: Persona = answers[0] === "mom-next-chapter" ? "stay-at-home-mom"
    : answers[0] === "career-change" ? "other-passionate"
    : (BACKGROUND_TO_PERSONA[answers[1]] || "other-passionate");

  // Dynamic data based on persona
  const testimonials = TESTIMONIALS_BY_PERSONA[currentRole] || TESTIMONIALS_BY_PERSONA["other-passionate"];
  const qualFraming = QUALIFICATION_FRAMING[currentRole] || QUALIFICATION_FRAMING["other-passionate"];
  const cohort = COHORT_NAMES[currentRole] || COHORT_NAMES["other-passionate"];
  const certSubtitle = CERT_SUBTITLE[currentRole] || CERT_SUBTITLE["other-passionate"];

  // Get dynamic reaction: persona-specific override or base
  const getReaction = (qIndex: number, answerValue: string): string => {
    const personaReactions = PERSONA_REACTIONS[currentRole];
    const key = `q${qIndex}-${answerValue}`;
    if (personaReactions && personaReactions[key]) return personaReactions[key];
    const q = QUESTIONS[qIndex];
    const opt = q?.options.find((o) => o.value === answerValue);
    return opt?.reaction || "";
  };

  // Get dynamic subtitle: persona-specific override or base
  const getSubtitle = (qIndex: number): string | undefined => {
    const personaSubs = PERSONA_SUBTITLES[currentRole];
    if (personaSubs && personaSubs[qIndex]) return personaSubs[qIndex];
    return QUESTIONS[qIndex]?.subtitle;
  };

  // Track quiz page view + per-question progress
  const visitorIdRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reuse existing visitorId or create new one
    let vid = sessionStorage.getItem("quiz_visitor_id");
    if (!vid) {
      vid = `qv_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`;
      sessionStorage.setItem("quiz_visitor_id", vid);
    }
    visitorIdRef.current = vid;

    // Only fire initial page view once per session
    const tracked = sessionStorage.getItem("quiz_start_tracked");
    if (tracked) return;

    const params = new URLSearchParams(window.location.search);
    const v = params.get("v") || "A";

    fetch("/api/quiz/track-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: vid, variant: v, page: "depth-method", questionReached: 0 }),
    }).catch(() => {});

    sessionStorage.setItem("quiz_start_tracked", "1");
  }, []);

  // Analyzing animation — 5 steps over ~5 seconds, then qualified
  const ANALYZE_STEPS = [
    "Analyzing your answers...",
    "Matching your specialization...",
    "Calculating qualification score...",
    "Building your personalized path...",
    `${name}, your certification path is ready!`,
  ];

  useEffect(() => {
    if (stage !== "analyzing") return;
    const interval = setInterval(() => {
      setAnalyzeStep((prev) => {
        if (prev >= ANALYZE_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("qualified");
            fireConfetti();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, fireConfetti]);

  // Auto-redirect after qualified stage (2 seconds)
  useEffect(() => {
    if (stage !== "qualified") return;
    const redirectTimer = setTimeout(() => {
      handleSeeResults();
    }, 2000);
    return () => clearTimeout(redirectTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const getStepNumber = (): number => {
    if (stage === "intro") return 0;
    if (stage === "conditional") return 1 + currentQ + 1; // sits between the triggering Q and next Q
    if (stage === "email-capture") return TOTAL_STEPS - 2; // after all 16 questions, before analyzing+qualified
    if (stage === "analyzing" || stage === "qualified" || stage === "result") return TOTAL_STEPS;
    const testimonialsBefore = testimonials.filter((t) => t.afterQ <= currentQ).length;
    return 1 + currentQ + testimonialsBefore;
  };
  const progress = Math.round((getStepNumber() / TOTAL_STEPS) * 100);

  const selectAnswer = (value: string, _reactionText: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: value }));

    // Track question progress (fire-and-forget)
    if (visitorIdRef.current) {
      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      fetch("/api/quiz/track-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: visitorIdRef.current,
          variant: urlParams?.get("v") || "A",
          page: "depth-method",
          questionReached: currentQ + 1, // Q answered (1-indexed)
        }),
      }).catch(() => {});
    }

    // Show "Sarah is typing..." for 1.2 seconds before showing reaction
    setReaction(null);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Use dynamic persona-aware reaction (skip for Q1 since persona not set yet)
      if (currentQ === 0) {
        const opt = QUESTIONS[0].options.find((o) => o.value === value);
        setReaction(opt?.reaction || "");
      } else {
        setReaction(getReaction(currentQ, value));
      }
    }, 1200);
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return;
    // Fire-and-forget — don't block the quiz flow
    fetch("/api/quiz-funnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, lastName, email, phone,
        funnel: "fm-certification",
        answers,
        conditionalAnswers,
        practitionerType: practitionerTypeKey,
        incomeGoal,
        currentRole,
      }),
    }).catch(() => {});
  };

  // Shared logic: after a question is "done" (including any conditional), proceed to next step
  const proceedAfterQuestion = (qIndex: number) => {
    const justAnswered = qIndex + 1;
    const testimonial = testimonials.find((t) => t.afterQ === justAnswered);
    if (testimonial) { setStage("testimonial"); return; }
    if (qIndex < QUESTIONS.length - 1) { setCurrentQ(qIndex + 1); setStage("quiz"); }
    else { setStage("email-capture"); } // Last question → contact capture
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
      if (currentQ < QUESTIONS.length - 1) { setCurrentQ(currentQ + 1); setStage("quiz"); }
      else { setStage("email-capture"); } // Last question testimonial → contact capture
      return;
    }
    if (stage === "conditional") {
      const insert = CONDITIONAL_INSERTS.find((c) => c.id === currentConditional);
      if (!insert) return;
      if (insert.type === "question" && !conditionalAnswers[insert.id]) return;
      setShownConditionals((prev) => ({ ...prev, [insert.id]: true }));
      setCurrentConditional(null);
      proceedAfterQuestion(currentQ);
      return;
    }
    if (stage === "email-capture") {
      if (!email || !email.includes("@") || !phone || phone.length < 7) return;
      handleEmailSubmit();
      setStage("analyzing");
      return;
    }
    if (stage === "quiz") {
      if (!answers[currentQ]) return;
      // Check for conditional inserts before proceeding
      const conditional = CONDITIONAL_INSERTS.find(
        (c) => c.afterQ === currentQ && c.condition(answers) && !shownConditionals[c.id]
      );
      if (conditional) {
        setCurrentConditional(conditional.id);
        setStage("conditional");
        return;
      }
      proceedAfterQuestion(currentQ);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setReaction(null);
    if (stage === "quiz" && currentQ === 0) { setStage("intro"); return; }
    if (stage === "conditional") { setCurrentConditional(null); setStage("quiz"); return; }
    if (stage === "testimonial") { setStage("quiz"); return; }
    if (stage === "email-capture") { setStage("quiz"); return; } // currentQ is still last question
    if (stage === "quiz" && currentQ > 0) {
      const prevTestimonial = testimonials.find((t) => t.afterQ === currentQ);
      if (prevTestimonial) { setStage("testimonial"); setCurrentQ(currentQ - 1); return; }
      setCurrentQ(currentQ - 1);
    }
    if (stage === "analyzing") { setStage("email-capture"); } // Back from analyzing → contact capture
  };

  // Read variant from URL for A/B testing (e.g. /quiz/depth-method?v=B)
  const urlVariant = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("v") || "A"
    : "A";

  const handleSeeResults = () => {
    setStage("result");
    // Store phone in sessionStorage (not URL) for Retell integration
    if (typeof window !== "undefined") {
      sessionStorage.setItem("quiz_phone", phone);
      sessionStorage.setItem("quiz_lastName", lastName);
    }
    const params = new URLSearchParams({
      name, lastName, email,
      type: practitionerTypeKey,
      role: currentRole,
      variant: urlVariant,
      // All 16 quiz answers — neuroscience-optimized order
      lifeSituation: answers[0] || "",     // Q1: Life situation (identity)
      background: answers[1] || "",        // Q2: Background
      motivation: answers[2] || "",        // Q3: What brought you here
      triedBefore: answers[3] || "",       // Q4: What have you tried
      biggestFear: answers[4] || "",       // Q5: Biggest fear
      incomeGoal: answers[5] || "",        // Q6: Income goal
      specialization: answers[6] || "",    // Q7: Specialization
      dreamLife: answers[7] || "",         // Q8: Dream life
      painPoint: answers[8] || "",         // Q9: Pain point
      currentIncome: answers[9] || "",     // Q10: Current income
      weeklyHours: answers[10] || "",      // Q11: Weekly time commitment
      whoBenefits: answers[11] || "",      // Q12: Who benefits
      readiness: answers[12] || "",        // Q13: Readiness (what's set up)
      timeline: answers[13] || "",         // Q14: Timeline
      reflection: answers[14] || "",       // Q15: Year from now reflection
      intent: answers[15] || "",           // Q16: Business/personal/both
      // Conditional branching answers
      careerLeaving: conditionalAnswers["career-leaving"] || "",
    });

    const route = ROLE_ROUTES[currentRole] || "/results/career-change";
    setTimeout(() => { window.location.href = `${route}?${params.toString()}`; }, 1500);
  };

  const canProceed = (): boolean => {
    if (stage === "intro") return !!name.trim();
    if (stage === "quiz") return !!answers[currentQ];
    if (stage === "testimonial") return true;
    if (stage === "conditional") {
      const insert = CONDITIONAL_INSERTS.find((c) => c.id === currentConditional);
      if (insert?.type === "reassurance") return true;
      return !!conditionalAnswers[insert?.id || ""];
    }
    if (stage === "email-capture") return !!lastName.trim() && !!email && email.includes("@") && !!phone && phone.length >= 7;
    return false;
  };

  const animKey = `${stage}-${currentQ}-${currentConditional || ""}`;

  const strongCount = Object.entries(answers).reduce((count, [qIdx, val]) => {
    const q = QUESTIONS[parseInt(qIdx)];
    const opt = q?.options.find((o) => o.value === val);
    return count + (opt?.strength === "strong" ? 1 : 0);
  }, 0);
  const qualScore = Math.min(Math.round((strongCount / QUESTIONS.length) * 100) + 15, 98);

  // ─── Render ─────────────────────────────────────────────────────
  const renderContent = () => {

    // ── INTRO ──
    if (stage === "intro") {
      return (
        <div className="space-y-6">
          {/* Institute Logo + Title */}
          <div className="text-center space-y-3">
            <Image src={ASI_LOGO} alt="ASI" width={56} height={56} className="mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: BRAND.burgundyDark }}>
              Functional Medicine Certification — Eligibility Assessment
            </h2>
            <p className="text-base text-gray-500 max-w-md mx-auto">
              Find out if you qualify for our internationally accredited FM Certification program.
            </p>
          </div>

          {/* What This Assessment Determines */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: `${BRAND.gold}06`, borderColor: `${BRAND.gold}30` }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: BRAND.burgundy }}>
              This 5-minute assessment determines:
            </p>
            <div className="flex flex-col gap-2.5 text-base text-gray-700">
              <span className="flex items-center gap-2.5"><CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: BRAND.gold }} /> Your best-fit clinical specialization</span>
              <span className="flex items-center gap-2.5"><CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: BRAND.gold }} /> Your projected earning potential</span>
              <span className="flex items-center gap-2.5"><CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: BRAND.gold }} /> Your eligibility for scholarship pricing</span>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-4">
            <label className="text-base font-medium text-center block" style={{ color: BRAND.burgundyDark }}>
              Enter your first name to begin
            </label>
            <input
              type="text"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) handleNext(); }}
              className="w-full px-5 py-4 rounded-xl border-2 text-center text-lg focus:outline-none transition-colors"
              style={{ borderColor: name ? BRAND.gold : "#e5e7eb", background: name ? `${BRAND.gold}08` : "white" }}
            />
            <Button
              onClick={() => name.trim() && handleNext()}
              disabled={!name.trim()}
              className="group w-full h-16 text-xl font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
              style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center justify-center">
                See If I Qualify <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          {/* Accreditation + Social Proof */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ACCREDITATION_LOGOS} alt="Accreditations" className="h-8 opacity-60" />
            </div>
            <p className="text-sm text-gray-400">
              9 international accreditations &bull; 2,847+ graduates &bull; 4.8/5 rating
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 min</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> 100% confidential</span>
          </div>
        </div>
      );
    }

    // ── TESTIMONIAL (DYNAMIC per persona) ──
    if (stage === "testimonial") {
      const testimonial = testimonials.find((t) => t.afterQ === currentQ + 1);
      if (!testimonial) return null;
      return (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <Image src={testimonial.photo} alt={testimonial.name} width={80} height={80} className="rounded-full border-3 object-cover shadow-lg" style={{ borderColor: BRAND.gold }} />
          </div>
          <div>
            <p className="text-lg italic leading-relaxed mb-4" style={{ color: BRAND.burgundy }}>&ldquo;{testimonial.text}&rdquo;</p>
            <p className="font-semibold" style={{ color: BRAND.burgundy }}>{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-5 h-5 fill-current" style={{ color: BRAND.gold }} />))}
          </div>
          {testimonial.afterQ === 13 && (
            <div className="p-4 rounded-xl text-left" style={{ backgroundColor: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}40` }}>
              <p className="text-sm font-semibold mb-1" style={{ color: BRAND.burgundy }}>Your results so far:</p>
              <p className="text-sm text-gray-600">You&apos;re showing strong clinical potential. Just 3 more questions to confirm your Practitioner Type and qualification status!</p>
            </div>
          )}
        </div>
      );
    }

    // ── CONDITIONAL INSERT (branching step) ──
    if (stage === "conditional") {
      const insert = CONDITIONAL_INSERTS.find((c) => c.id === currentConditional);
      if (!insert) return null;

      if (insert.type === "question") {
        const selectedValue = conditionalAnswers[insert.id];
        return (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ backgroundColor: `${BRAND.gold}15`, color: BRAND.burgundy }}>{insert.pillar}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: BRAND.burgundyDark }}>{insert.question}</h2>
              {insert.subtitle && <p className="text-base text-gray-500 mt-2">{insert.subtitle}</p>}
            </div>
            <div className="space-y-3">
              {insert.options?.map((opt) => {
                const isSelected = selectedValue === opt.value;
                return (
                  <button key={opt.value} onClick={() => setConditionalAnswers((prev) => ({ ...prev, [insert.id]: opt.value }))}
                    className="w-full p-5 rounded-xl border-2 transition-all text-left"
                    style={{ borderColor: isSelected ? BRAND.burgundy : "#e5e7eb", backgroundColor: isSelected ? `${BRAND.burgundy}08` : "white" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isSelected ? BRAND.burgundy : "#d1d5db" }}>
                        {isSelected && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: BRAND.burgundy }} />}
                      </div>
                      <span className="font-medium text-base" style={{ color: BRAND.burgundy }}>{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      // ── Reassurance type (Sarah message + stats) ──
      return (
        <div className="space-y-6">
          <div className="rounded-xl p-4 border" style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}30` }}>
            <div className="flex items-start gap-3">
              <Image src={SARAH_AVATAR} alt="Sarah M." width={48} height={48} className="rounded-full border-2 object-cover flex-shrink-0 shadow-md" style={{ borderColor: BRAND.gold }} />
              <div>
                <p className="text-gray-900 text-sm font-bold">Sarah M.</p>
                <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                  &quot;{insert.sarahMessage?.replace("{name}", name)}&quot;
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {insert.stats?.map((stat) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}30` }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#2AA97B" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>{stat.label}</p>
                  <p className="text-xs text-gray-600">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    // ── CONTACT CAPTURE (after all 16 questions — "Where should we send your results?") ──
    if (stage === "email-capture") {
      const allFilled = lastName.trim() && email.includes("@") && phone.length >= 7;
      return (
        <div className="space-y-5">
          {/* Sarah Message */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}30` }}>
            <div className="flex items-start gap-3">
              <Image src={SARAH_AVATAR} alt="Sarah" width={48} height={48} className="rounded-full border-2 object-cover flex-shrink-0 shadow-md" style={{ borderColor: BRAND.gold }} />
              <div>
                <p className="text-gray-900 text-sm font-bold">Sarah M.</p>
                <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                  &quot;{name}, you&apos;ve completed the assessment! Your results look very promising. Where should I send your personalized certification path?&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-xl font-bold" style={{ color: BRAND.burgundyDark }}>Where should we send your results?</h2>
            <p className="text-sm text-gray-500 mt-1">Your certification coach will also call to review your personalized path.</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Last Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all bg-white"
                style={{ borderColor: lastName.trim() ? BRAND.gold : "#e5e7eb" }}
                autoFocus
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Your best email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all bg-white"
                style={{ borderColor: email.includes("@") ? BRAND.gold : "#e5e7eb" }}
              />
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && allFilled) handleNext(); }}
                  className="w-full h-14 pl-12 pr-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all bg-white"
                  style={{ borderColor: phone.length >= 7 ? BRAND.gold : "#e5e7eb" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 pl-1">Your certification coach will call to review your results</p>
            </div>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>100% private — we never share your information</span>
          </div>
        </div>
      );
    }

    // ── ANALYZING RESULTS (Neural insight primer — 5 seconds) ──
    if (stage === "analyzing") {
      const specLabel = PRACTITIONER_TYPES[practitionerTypeKey]?.label || "Functional Medicine";
      const bgLabels: Record<string, string> = {
        nurse: "Nursing", doctor: "Medical", "allied-health": "Allied Health",
        "mental-health": "Mental Health", wellness: "Wellness", "career-change": "Career Transition",
      };
      const bgLabel = bgLabels[answers[1]] || "Your Background";
      const incomeLabels: Record<string, string> = {
        "3k-5k": "$3K-$5K/mo", "5k-10k": "$5K-$10K/mo", "10k-15k": "$10K-$15K/mo", "15k-plus": "$15K+/mo",
      };
      const incLabel = incomeLabels[answers[5]] || "$5K-$10K/mo";
      const readyLabels: Record<string, string> = {
        nothing: "Starting Fresh (full DFY package)", "name-social": "Brand Started",
        "have-clients": "Active Clients", "have-everything": "Ready to Launch",
      };
      const readyLabel = readyLabels[answers[12]] || "Starting Fresh";

      const summaryStats = [
        { label: "Specialization Match", value: specLabel, pct: "98% fit" },
        { label: "Background", value: bgLabel, pct: "94% acceptance rate" },
        { label: "Income Goal", value: incLabel, pct: "achievable in 8-12 months" },
        { label: "Readiness", value: readyLabel, pct: "package included" },
      ];

      return (
        <div className="space-y-8 py-8">
          <div className="text-center">
            <Image src={ASI_LOGO} alt="ASI" width={64} height={64} className="mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1" style={{ color: BRAND.burgundyDark }}>
              {analyzeStep < 2 ? "Analyzing your answers..." : `Here's what we found:`}
            </h2>
            <p className="text-sm text-gray-500">{name}, please wait...</p>
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: BRAND.burgundyGold }}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.round((analyzeStep / (ANALYZE_STEPS.length - 1)) * 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }} />
            </div>
          </div>

          {/* Summary stats — reveal one by one after step 1 */}
          {analyzeStep >= 2 && (
            <div className="space-y-3 max-w-sm mx-auto">
              {summaryStats.map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: analyzeStep >= i + 2 ? 1 : 0, y: analyzeStep >= i + 2 ? 0 : 10 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}30` }}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#2AA97B" }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>{stat.label}: {stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.pct}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Final message */}
          {analyzeStep >= ANALYZE_STEPS.length - 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-base font-semibold" style={{ color: BRAND.burgundy }}>
              {name}, your personalized certification path is ready...
            </motion.p>
          )}
        </div>
      );
    }

    // ── QUALIFIED (DYNAMIC qualification framing, cert subtitle, scarcity) ──
    if (stage === "qualified") {
      const PractIcon = practitionerType.icon;
      return (
        <div className="space-y-5 text-center py-4">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ background: BRAND.goldMetallic }}>
              <PractIcon className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap" style={{ background: BRAND.burgundy, color: "white" }}>You Qualify!</div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: BRAND.burgundy }}>{name}, You Qualify!</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
            <PractIcon className="w-4 h-4" /> {practitionerType.label}
          </div>

          {/* Qualification Score - compact */}
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}40` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: BRAND.burgundy }}>Qualification Score</span>
              <span className="text-xs font-bold" style={{ color: BRAND.burgundy }}>{qualScore}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: BRAND.burgundyGold }}
                initial={{ width: 0 }} animate={{ width: `${qualScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }} />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              <span className="font-bold" style={{ color: BRAND.burgundy }}>{qualFraming.percentile}</span> of applicants
            </p>
          </div>

          {/* Loading indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: BRAND.burgundy }} />
            <span>Preparing your scholarship page...</span>
          </div>
        </div>
      );
    }

    // ── RESULT (after redirect) ──
    if (stage === "result") {
      return (
        <div className="space-y-5 text-center py-6">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: BRAND.burgundy }} />
          <p className="text-sm text-gray-600">Redirecting to your personalized certification page...</p>
        </div>
      );
    }

    // ── QUIZ QUESTION (DYNAMIC subtitles + reactions) ──
    const q = QUESTIONS[currentQ];
    const dynamicSubtitle = getSubtitle(currentQ);
    return (
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ backgroundColor: `${BRAND.gold}15`, color: BRAND.burgundy }}>{q.pillar}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: BRAND.burgundyDark }}>{q.question}</h2>
          {dynamicSubtitle && <p className="text-base text-gray-500 mt-2">{dynamicSubtitle}</p>}
        </div>
        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = answers[currentQ] === opt.value;
            return (
              <button key={opt.value} onClick={() => selectAnswer(opt.value, opt.reaction)}
                className="w-full p-5 rounded-xl border-2 transition-all text-left"
                style={{ borderColor: isSelected ? BRAND.burgundy : "#e5e7eb", backgroundColor: isSelected ? `${BRAND.burgundy}08` : "white" }}>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isSelected ? BRAND.burgundy : "#d1d5db" }}>
                    {isSelected && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: BRAND.burgundy }} />}
                  </div>
                  <span className="font-medium text-base" style={{ color: BRAND.burgundy }}>{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        {currentQ >= 14 && (
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" style={{ color: BRAND.gold }} /> Almost done - your Practitioner Type is about to be revealed!
          </p>
        )}
      </div>
    );
  };

  const getNextLabel = (): string => {
    if (stage === "intro") return "See If I Qualify";
    if (stage === "testimonial") return "Continue";
    if (stage === "conditional") {
      const insert = CONDITIONAL_INSERTS.find((c) => c.id === currentConditional);
      return insert?.type === "reassurance" ? "I Understand — Continue" : "Next";
    }
    if (stage === "email-capture") return "Get My Results";
    if (stage === "quiz" && currentQ === QUESTIONS.length - 1) return "See My Results";
    return "Next";
  };

  // ─── Analyzing / Result layout ────────────────────────────────
  if (stage === "analyzing" || stage === "result") {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}>
        <div className="py-6 md:py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff", boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}>
              <div className="px-5 py-3" style={{ background: BRAND.goldMetallic }}>
                <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>
                  {stage === "analyzing" ? "Analyzing Your Results..." : "Redirecting..."}
                </span>
              </div>
              <div className="p-6 md:p-10">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Qualified layout ──────────────────────────────────────────
  if (stage === "qualified") {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}>
        <div className="py-6 md:py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff", boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}>
              <div className="px-5 py-3" style={{ background: BRAND.goldMetallic }}>
                <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>Assessment Complete - You Qualify!</span>
              </div>
              <div className="p-6 md:p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Layout ────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}>
      <div className="py-6 md:py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff", boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ background: BRAND.goldMetallic }}>
              <span className="text-sm font-bold flex items-center gap-2" style={{ color: BRAND.burgundyDark }}>
                <Stethoscope className="w-4 h-4" /> ASI Clinical Assessment
              </span>
              <span className="text-sm font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${BRAND.burgundyDark}20`, color: BRAND.burgundyDark }}>
                {stage === "intro" ? "Start" : stage === "email-capture" ? "Almost Done" : stage === "conditional" ? `${currentQ + 1} / ${QUESTIONS.length}` : `${currentQ + 1} / ${QUESTIONS.length}`}
              </span>
            </div>
            <div className="relative">
              <div className="h-1.5 bg-gray-100">
                <motion.div className="h-full" style={{ background: BRAND.burgundyGold }}
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
              </div>
              <div className="absolute right-3 -bottom-5 text-xs text-gray-400 font-medium">{progress}% complete</div>
            </div>
            <div className="p-6 md:p-10 pt-10">
              <AnimatePresence mode="wait">
                <motion.div key={animKey}
                  initial={{ opacity: 0, x: direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }} className="min-h-[400px] md:min-h-[450px]">
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-100">
                {stage !== "intro" ? (
                  <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors py-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}
                <Button onClick={handleNext} disabled={!canProceed()} size="lg"
                  className="group h-12 px-8 text-base font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 min-w-[160px] disabled:opacity-50 relative overflow-hidden"
                  style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center justify-center">
                    {getNextLabel()} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
