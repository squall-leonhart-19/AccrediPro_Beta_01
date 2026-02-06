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
  Phone,
  Mail,
  User,
  TrendingUp,
  Volume2,
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

// ─── Persona types ─────────────────────────────────────────────────
type Persona = "healthcare-pro" | "health-coach" | "corporate" | "stay-at-home-mom" | "other-passionate";

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 1: Persona-specific testimonials
// ═══════════════════════════════════════════════════════════════════
interface Testimonial { name: string; role: string; text: string; photo: string; afterQ: number }

const TESTIMONIALS_BY_PERSONA: Record<Persona, Testimonial[]> = {
  "healthcare-pro": [
    { name: "Dr. Karen L.", role: "Former Family Practice - Now FM Certified Practitioner", text: "As a nurse for 18 years, I thought I knew clinical medicine. The program showed me a whole new level. I left the hospital and now earn $11K/month running my own functional practice.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 3 },
    { name: "Margaret S.", role: "PA to Clinical Practitioner", text: "I was exhausted from the hospital grind. Now I set my own hours, see clients I actually want to help, and earn MORE than my PA salary. The certification changed everything.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 6 },
    { name: "Carolyn R.", role: "Former ICU Nurse, Age 54", text: "I used my nursing background to fast-track through the program. Within 60 days I had my first 5 paying clients. My hospital colleagues can't believe the transformation.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 9 },
  ],
  "health-coach": [
    { name: "Margaret S.", role: "Health Coach to Clinical Practitioner", text: "Before the certification I was a health coach charging $50/session and struggling to fill my calendar. Now: $9K/month with a waitlist. The ASI certification gave me the credibility I was missing.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 3 },
    { name: "Dr. Karen L.", role: "Yoga Teacher to FM Certified Practitioner", text: "I had years of wellness experience but no clinical framework. The certification gave me the structure to charge $200/session instead of $40 for yoga classes. Total game-changer.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 6 },
    { name: "Carolyn R.", role: "Nutritionist to Certified Specialist", text: "Every coach should upgrade to FM Certification. My nutrition coaching was good but limited. Now I can run labs, create clinical protocols, and clients see me as a real authority.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 9 },
  ],
  "corporate": [
    { name: "Carolyn R.", role: "Former Marketing Director, Age 52", text: "I left my corporate job at 49 with zero health credentials. The certification gave me everything - the clinical skills, the business framework, the confidence. Now earning $7K/month and fully booked.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 3 },
    { name: "Margaret S.", role: "Ex-Finance Manager to Practitioner", text: "My corporate project management skills turned out to be my secret weapon. I launched my practice like a business from day one. The certification gave me the clinical side - I brought the business acumen.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 6 },
    { name: "Dr. Karen L.", role: "Former HR Executive to Clinical Director", text: "Everyone thought I was crazy leaving a 6-figure corporate salary. 8 months later, I matched it with my own practice and actually love Monday mornings again.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
  "stay-at-home-mom": [
    { name: "Margaret S.", role: "Stay-at-Home Mom to Certified Practitioner", text: "I studied during nap times and after bedtime. Within 4 months I was certified. Now I see clients 3 days a week while my kids are at school and earn $6K/month. Best decision I ever made.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 3 },
    { name: "Carolyn R.", role: "Mom of 3 to FM Certified Practitioner", text: "I felt invisible for years - just 'someone's mom.' The certification gave me my identity back. I built my practice from my kitchen table and now my kids tell their friends 'my mom helps people heal.'", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 6 },
    { name: "Dr. Karen L.", role: "Former SAHM, Now Earning $8K/Month", text: "My husband was skeptical. Then my first month I earned $3K working part-time. Now I contribute more to our family than I ever did before kids. The program fits around family life perfectly.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
  "other-passionate": [
    { name: "Carolyn R.", role: "Career Changer, Age 52", text: "I was skeptical after wasting money on other programs. Now I'm earning $7K/month and fully booked. Started from zero at age 49. No health background needed - The program teaches everything.", photo: TESTIMONIAL_PHOTOS.carolyn, afterQ: 3 },
    { name: "Margaret S.", role: "Teacher to Clinical Practitioner", text: "I had no medical background at all - I was a high school teacher. The program broke everything down so clearly. My teaching skills actually help me explain protocols to clients beautifully.", photo: TESTIMONIAL_PHOTOS.margaret, afterQ: 6 },
    { name: "Dr. Karen L.", role: "Complete Career Change at 47", text: "I proved everyone wrong. No degree in health, no clinical experience, nothing. Just passion and FM Certification. 6 months later: certified, confident, and earning more than my previous career.", photo: TESTIMONIAL_PHOTOS.karen, afterQ: 9 },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 2: Persona-aware Sarah reactions for Q2-Q12
// ═══════════════════════════════════════════════════════════════════
// Key = "q{questionIndex}-{answerValue}", value = persona overrides
const PERSONA_REACTIONS: Record<Persona, Record<string, string>> = {
  "healthcare-pro": {
    // Q2 - Income
    "q1-0": "Most healthcare professionals start at zero in private practice - but your clinical training means you'll ramp up 2x faster than average.",
    "q1-under-2k": "With your clinical background, you should be earning 5-6x that. FM Certification bridges that gap immediately.",
    "q1-2k-5k": "Solid for a nurse or PA side-hustling. But with FM Certification, your clinical credibility means you can realistically double this within 60 days.",
    "q1-over-5k": "Outstanding. Healthcare professionals at your level typically scale to $15-25K/month with FM Certification because you already have the clinical instincts.",
    // Q3 - Income goal
    "q2-5k": "Very achievable for someone with your clinical background. Most healthcare professionals hit $5K within their first 60 days.",
    "q2-10k": "Perfect target. Nurses and PAs who add FM Certification typically earn 2-3x their hospital salary within 6 months.",
    "q2-20k": "With your medical training plus FM Certification, $20K/month is realistic. You'd add group protocols and physician referral networks.",
    "q2-50k-plus": "Clinical directors with your background build multi-practitioner clinics. The program gives you the framework to scale beyond just you.",
    // Q4 - Experience
    "q3-active-clients": "Having active patients/clients means you can start applying ASI protocols immediately. Your clinical experience is a massive accelerator.",
    "q3-past-clients": "Your clinical experience doesn't expire. The program gives you a modern framework to re-enter with more confidence and higher rates.",
    "q3-informal": "Even informal health guidance from a healthcare professional carries weight. The program formalizes what you already do naturally.",
    "q3-no-experience": "Your healthcare training IS experience. You understand anatomy, physiology, and patient care. The program adds the functional medicine layer.",
    // Q5 - Clinical readiness
    "q4-very-confident": "Expected from someone with your clinical training. The program adds the functional medicine lens to your existing diagnostic skills.",
    "q4-somewhat": "Your medical training gives you the foundation. The program adds the root-cause framework that conventional medicine often misses.",
    "q4-not-very": "That's actually common in conventional healthcare. You were trained to treat symptoms, not root causes. FM Certification fills that exact gap.",
    "q4-refer-out": "What if you WERE the specialist? With your clinical background, adding functional medicine skills makes you the complete practitioner.",
    // Q6 - Labs
    "q5-already-doing": "Excellent - most healthcare professionals have some lab experience. The program takes it to functional interpretation, which is a different skill entirely.",
    "q5-want-to-learn": "You already understand lab values from your healthcare training. The program teaches you the functional ranges and clinical decision-making.",
    "q5-open-to-it": "Your medical background means you'll pick this up faster than anyone. You already speak the language of labs.",
    "q5-not-sure": "As a healthcare professional, lab skills will feel natural. It's the same data you've worked with, just interpreted through a functional lens.",
    // Q9 - Commitment
    "q8-absolutely": "With your clinical discipline and training, 20 minutes a day will feel easy. Healthcare professionals are built for this kind of focused learning.",
    "q8-yes-work": "Many of our nurses and PAs study between shifts or on days off. The program is designed for healthcare schedules.",
    "q8-rearrange": "Shift work actually helps - you can batch study on your days off. Many nurses complete the program faster than expected.",
    "q8-not-sure": "Even 3-4 sessions per week works. Many of our healthcare professionals study on their days off and finish in under 8 weeks.",
    // Q10 - Vision
    "q9-leave-job": "67% of our healthcare graduates left hospital/clinic jobs within a year. No more 12-hour shifts, no more burnout, full autonomy.",
    "q9-security": "Imagine earning MORE than your nursing/PA salary, but working half the hours and actually choosing your patients.",
    "q9-fulfillment": "Remember why you went into healthcare? The program lets you practice medicine the way you always wanted - actually helping people heal.",
    "q9-all-above": "Healthcare professionals who make this switch don't just change careers - they rediscover why they went into medicine in the first place.",
  },
  "health-coach": {
    "q1-0": "That's surprising for a coach - but it means you haven't been limited by a 'coaching ceiling' yet. FM Certification removes all ceilings.",
    "q1-under-2k": "That's the classic coaching trap - trading time for too little money. FM Certification means you charge 3-4x more per session.",
    "q1-2k-5k": "Solid for coaching, but you're hitting the ceiling. Coaches who upgrade to FM Certification clinical certification typically 3x their income.",
    "q1-over-5k": "You're already a successful coach. The program takes you from 'coach' to 'clinical practitioner' - and your rates follow.",
    "q2-5k": "Very achievable. Coaches who add FM Certification see an average 3x income increase because clinical > coaching in perceived value.",
    "q2-10k": "That's the sweet spot for upgraded coaches. You already know how to work with clients - The program gives you the clinical authority to charge more.",
    "q2-20k": "Coaches who add group clinical programs and lab interpretation hit $20K+ regularly. Your coaching skills are the delivery system.",
    "q2-50k-plus": "Think clinic director. Your coaching background plus FM clinical skills plus team leverage. It's the proven path.",
    "q3-active-clients": "Perfect! You can immediately upsell existing coaching clients to clinical packages. Most coaches 2x their client value overnight.",
    "q3-past-clients": "Your coaching skills are transferable. The program adds the clinical dimension that makes clients see you as an authority, not just a coach.",
    "q3-informal": "Coaching friends and family IS experience. You already have the empathy and communication skills - The program adds clinical structure.",
    "q3-no-experience": "Your coaching training gives you client communication skills that clinical people often lack. That's actually a huge advantage.",
    "q4-very-confident": "Impressive for a coach! The program will formalize that intuition into a repeatable clinical framework with evidence-based protocols.",
    "q4-somewhat": "Most coaches can identify surface-level causes. The program takes you deeper - to the hormonal, gut, and metabolic root causes.",
    "q4-not-very": "That's exactly the gap between coaching and clinical practice. FM Certification bridges it with a systematic 5-phase framework.",
    "q4-refer-out": "What if you WERE the referral? Coaches who upgrade to clinical practitioners keep their clients AND charge 3x more.",
    "q5-already-doing": "You're ahead of 99% of coaches. The program will systematize your lab skills and give you clinical-grade interpretation frameworks.",
    "q5-want-to-learn": "This is THE skill that separates $50/hr coaches from $200/hr practitioners. The program teaches it step by step.",
    "q5-open-to-it": "Lab interpretation is what turns a coach into a clinician. It's the single biggest upgrade you can make to your practice.",
    "q5-not-sure": "As a coach, adding lab skills doubles your value proposition. Clients want someone who can test, not just guess.",
    "q8-absolutely": "With your coaching discipline, you'll love the bite-sized modules. Many coaches say The program is the best investment they've made.",
    "q8-yes-work": "The program fits around client sessions. Many coaches study in the morning before their first client.",
    "q8-rearrange": "Your coaching schedule is already flexible. Even squeezing in 20 minutes between clients adds up fast.",
    "q8-not-sure": "Self-paced means self-scheduled. Many coaches do 3-4 intensive sessions per week instead of daily. Works just as well.",
    "q9-leave-job": "You're already your own boss as a coach - now imagine earning 3x more doing clinical work you're truly passionate about.",
    "q9-security": "Financial stability that coaching alone rarely provides. Clinical practitioners have predictable, premium income streams.",
    "q9-fulfillment": "You already help people as a coach. Imagine the fulfillment of actually SOLVING their root-cause health issues, not just supporting them.",
    "q9-all-above": "Coaches who upgrade to FM Certification don't just earn more - they transform from 'wellness supporter' to 'clinical authority.' Complete identity shift.",
  },
  "corporate": {
    "q1-0": "Starting from zero is actually powerful - no bad habits, no limiting beliefs about what health professionals 'should' charge. Your corporate mindset is an advantage.",
    "q1-under-2k": "You're just getting started. Corporate professionals who go all-in with FM Certification typically scale faster because you think in systems, not sessions.",
    "q1-2k-5k": "Not bad for a side-hustle! But your corporate skills deserve more. The program gives you the clinical credibility to build a real business.",
    "q1-over-5k": "Impressive for someone transitioning. Your business acumen is clearly working. The program adds clinical expertise to accelerate even further.",
    "q2-5k": "Very achievable. Most corporate professionals who complete FM Certification replace their previous income within 90 days of certification.",
    "q2-10k": "$10K/month is realistic within 6 months. Your project management and professional skills give you a massive advantage in building a practice.",
    "q2-20k": "Think like a CEO, not a practitioner. Your corporate experience in building systems and managing teams translates directly to a multi-revenue practice.",
    "q2-50k-plus": "Your corporate mind thinks at scale - that's rare in wellness. FM Certification plus your business skills is the formula for building a real company.",
    "q3-active-clients": "Already working with clients while in corporate? That drive is exactly what predicts success in FM Certification.",
    "q3-past-clients": "Your professional skills are fully transferable. The program adds the clinical expertise - you already have the business foundation.",
    "q3-informal": "Helping friends and family with health already shows you have the instinct. The program gives you the framework to monetize that passion.",
    "q3-no-experience": "31% of our highest earners came from corporate with zero health experience. Your professional skills are the unfair advantage nobody talks about.",
    "q4-very-confident": "That's unusual for someone from corporate - you've clearly been studying. The program will formalize and certify that knowledge.",
    "q4-somewhat": "You're already ahead of most career changers. The program takes your self-study and gives it clinical structure and accreditation.",
    "q4-not-very": "Expected for a career change - and totally fine. The the ASI clinical framework teaches everything from the ground up, step by step.",
    "q4-refer-out": "Right now, yes. But imagine being the expert everyone refers TO. Your corporate credibility plus FM Certification is a powerful combination.",
    "q5-already-doing": "You've been studying ahead - that corporate work ethic is showing. The program will formalize your lab knowledge with clinical protocols.",
    "q5-want-to-learn": "Lab interpretation is learnable - it's like learning to read financial statements. Structured, logical, and your analytical mind will love it.",
    "q5-open-to-it": "Think of lab interpretation like data analysis for the body. Your corporate analytical skills translate perfectly.",
    "q5-not-sure": "It sounds intimidating but it's really not. If you can read a spreadsheet, you can learn to read a lab panel. The program makes it systematic.",
    "q8-absolutely": "That corporate discipline will serve you well. 20 minutes a day is less than your commute used to be.",
    "q8-yes-work": "You can study during lunch, on the train, whenever. Many corporate professionals study during their notice period.",
    "q8-rearrange": "That willingness to restructure your schedule shows you're serious about this career change. That's exactly what our top earners did.",
    "q8-not-sure": "The program is fully self-paced. Many career changers batch their study on weekends while still working their corporate job.",
    "q9-leave-job": "That's the dream of every corporate professional we work with. No more office politics, no more ceiling. 67% achieve it within 12 months.",
    "q9-security": "Financial security WITHOUT the corporate stress. No more layoff anxiety, no more politics. Income YOU control.",
    "q9-fulfillment": "Imagine trading pointless meetings for meaningful client sessions where you genuinely transform someone's health. That's the FM practitioner career change.",
    "q9-all-above": "Corporate professionals who make this leap don't just change jobs - they transform their entire quality of life. That's what FM Certification delivers.",
  },
  "stay-at-home-mom": {
    "q1-0": "Most moms in our program start at zero. That's not a limitation - it's a clean slate. And you'll be amazed at how fast you can build when motivated.",
    "q1-under-2k": "Even earning something while managing a household shows incredible drive. The program can turn that side income into a real practice.",
    "q1-2k-5k": "Earning $2-5K while raising kids? That takes serious hustle. The program gives you the clinical authority to double that working the SAME hours.",
    "q1-over-5k": "That's remarkable while managing a family! You clearly have the drive. FM Certification will take your earning to the next tier.",
    "q2-5k": "Totally achievable around a family schedule. Most mom practitioners work 3 days/week and hit $5K/month within 90 days of certification.",
    "q2-10k": "$10K/month working around school hours is absolutely doable. Our mom practitioners are proof. You don't need 40 hours a week.",
    "q2-20k": "Ambitious and possible. Moms who add virtual group programs can earn $20K+ while only working during school hours. The program shows you how.",
    "q2-50k-plus": "Think big. Some of our mom practitioners built full practices with team members. Your organizational skills from running a household? That's CEO training.",
    "q3-active-clients": "Working with clients while managing a household? That's incredibly impressive. The program gives you clinical tools to serve them even better.",
    "q3-past-clients": "Life got busy with the kids - totally understandable. The program is designed to restart your career at a higher level, on YOUR schedule.",
    "q3-informal": "Every mom is an informal health advisor - for your kids, your mom friends, your family. The program turns that natural instinct into a real career.",
    "q3-no-experience": "Your life experience as a mom IS relevant. Empathy, patience, multitasking, problem-solving - those are clinical superpowers that can't be taught.",
    "q4-very-confident": "That's impressive! You've clearly been studying. The program will give you the certification to match your knowledge.",
    "q4-somewhat": "Your instincts are strong - probably from all those late-night Google searches about your kids' health. The program turns that curiosity into clinical skill.",
    "q4-not-very": "Completely normal. You haven't had formal training yet. The program starts from the foundation and builds step by step, designed for beginners.",
    "q4-refer-out": "What if other moms referred THEIR friends to YOU? That's what happens when a caring mom adds clinical certification. Referrals explode.",
    "q5-already-doing": "You've been self-studying labs? That's incredible initiative. The program will formalize everything and give you confidence to use it professionally.",
    "q5-want-to-learn": "Lab interpretation sounds scary but it's completely learnable. Many of our mom practitioners say it's their favorite part of the program.",
    "q5-open-to-it": "Imagine being the mom who can actually READ your kids' lab results and know what they mean. The program gives you that superpower.",
    "q5-not-sure": "It's simpler than you think. If you can follow a recipe, you can follow a lab interpretation framework. The program makes it step-by-step.",
    "q8-absolutely": "20 minutes during nap time, after bedtime, during school hours - our mom practitioners find the time because the results are so worth it.",
    "q8-yes-work": "Many moms study during nap time or after the kids go to bed. 20 minutes is less time than scrolling social media.",
    "q8-rearrange": "That willingness to carve out time for YOURSELF shows you're ready. Your kids will see a mom building something incredible.",
    "q8-not-sure": "The program is completely self-paced. Some moms do 3 sessions a week instead of daily. There's no pressure - only progress.",
    "q9-leave-job": "You're already not in a 9-to-5 - you're in a 24/7 job called motherhood. The program gives you a career that works WITH your family, not against it.",
    "q9-security": "Imagine contributing $5-10K/month to your family while being fully present for your kids. No daycare needed. No guilt. That's the FM practitioner life.",
    "q9-fulfillment": "Beyond 'just a mom' - imagine your kids seeing you help people heal, earn your own income, and build something meaningful. What a role model.",
    "q9-all-above": "FM Certified moms get it all - income, identity, flexibility, fulfillment. You don't have to choose between family and career. That's the whole point.",
  },
  "other-passionate": {
    "q1-0": "Starting from zero with pure passion is the best starting point. 38% of our top performers had non-traditional backgrounds. You're in good company.",
    "q1-under-2k": "You've already started earning from your passion - that's more than most. The program gives you the certification to charge what you're really worth.",
    "q1-2k-5k": "Building income from a non-traditional background shows real entrepreneurial spirit. The program adds the clinical credibility to scale further.",
    "q1-over-5k": "Earning $5K+ from a non-traditional path? That's exceptional. FM Certification will accelerate your growth even further.",
    "q2-5k": "Totally achievable regardless of background. 38% of our practitioners who hit $5K/month came from non-health fields.",
    "q2-10k": "Your unique background is actually an advantage. You bring fresh perspective that traditional health professionals lack.",
    "q2-20k": "Ambitious and proven. Non-traditional backgrounds often build the most creative, successful practices because you think differently.",
    "q2-50k-plus": "Love that mindset. The most innovative practices in our network were built by people from non-traditional backgrounds. Think different, earn different.",
    "q3-active-clients": "Already working with clients from a non-traditional starting point? That shows incredible initiative. The program adds the clinical structure.",
    "q3-past-clients": "Your experience hasn't disappeared. The program gives you a fresh framework to re-enter with clinical-grade credibility.",
    "q3-informal": "Helping people informally IS experience. Your passion and empathy are the foundation. The program adds the clinical framework on top.",
    "q3-no-experience": "38% of our top performers had zero experience. Passion + the ASI clinical framework = a proven formula regardless of background.",
    "q4-very-confident": "That's incredible for someone without a traditional health background. You've clearly done your homework. The program certifies that knowledge.",
    "q4-somewhat": "Self-taught knowledge shows dedication. The program turns that passion-driven learning into a structured, certified clinical skill set.",
    "q4-not-very": "Completely expected and completely fine. The program was designed to take passionate beginners and create confident clinical practitioners.",
    "q4-refer-out": "Soon, people will be referring TO you. Your unique perspective plus FM Certification is a combination clients actively seek out.",
    "q5-already-doing": "Self-studying labs from a non-traditional background? That's the kind of initiative that predicts success in FM Certification.",
    "q5-want-to-learn": "Lab interpretation is 100% learnable from scratch. The program breaks it down into simple, logical steps. No medical degree required.",
    "q5-open-to-it": "It's one of the most empowering skills you can learn. Imagine reading a lab panel and knowing exactly what's going on. The program teaches that.",
    "q5-not-sure": "It sounds more intimidating than it is. Our most successful lab interpreters include a former teacher and a former artist. The program makes it accessible.",
    "q8-absolutely": "That passion-driven commitment is exactly what predicts success. 20 minutes a day of focused learning leads to life-changing results.",
    "q8-yes-work": "The program adapts to your schedule. Many of our non-traditional practitioners study in the evenings or on weekends.",
    "q8-rearrange": "That willingness to restructure your life shows you're serious about this transformation. Our top earners all started with that same decision.",
    "q8-not-sure": "Completely self-paced. Even 3-4 sessions per week works. The key is consistency, not intensity.",
    "q9-leave-job": "Imagine replacing your current work with something you're genuinely passionate about. That's not a fantasy - 67% of our practitioners achieve it.",
    "q9-security": "Financial stability doing work you love. No more wondering 'what if.' No more feeling stuck in the wrong career.",
    "q9-fulfillment": "Picture it: every day you wake up excited, knowing you're transforming lives using skills you built from pure passion. That's the FM practitioner life.",
    "q9-all-above": "People from non-traditional backgrounds often have the biggest transformations because they're not just changing careers - they're finally becoming who they were meant to be.",
  },
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 3: Persona-specific reviewing steps
// ═══════════════════════════════════════════════════════════════════
const REVIEW_STEPS_BY_PERSONA: Record<Persona, string[]> = {
  "healthcare-pro": [
    "Validating clinical credentials...",
    "Submitting to ASI Scholarship Review Board...",
    "Matching clinical skills to ASI curriculum...",
    "Checking Healthcare Fast-Track cohort availability...",
    "Verifying scholarship eligibility...",
    "Case #" + Math.floor(1400 + Math.random() * 200) + " — Assessment complete!",
  ],
  "health-coach": [
    "Analyzing coaching experience...",
    "Submitting to ASI Scholarship Review Board...",
    "Matching coaching skills to clinical framework...",
    "Checking Coach-to-Clinical cohort availability...",
    "Calculating income upgrade projection...",
    "Case #" + Math.floor(1400 + Math.random() * 200) + " — Assessment complete!",
  ],
  "corporate": [
    "Evaluating transferable professional skills...",
    "Submitting to ASI Scholarship Review Board...",
    "Analyzing career transition readiness...",
    "Checking Career Transition cohort availability...",
    "Verifying qualification for ASI fast-track...",
    "Case #" + Math.floor(1400 + Math.random() * 200) + " — Assessment complete!",
  ],
  "stay-at-home-mom": [
    "Analyzing schedule flexibility...",
    "Submitting to ASI Scholarship Review Board...",
    "Evaluating empathy and communication strengths...",
    "Checking Flexible Schedule cohort availability...",
    "Calculating part-time earning potential...",
    "Case #" + Math.floor(1400 + Math.random() * 200) + " — Assessment complete!",
  ],
  "other-passionate": [
    "Analyzing passion and motivation profile...",
    "Submitting to ASI Scholarship Review Board...",
    "Matching learning style to ASI curriculum...",
    "Checking next available cohort...",
    "Verifying eligibility for certification...",
    "Case #" + Math.floor(1400 + Math.random() * 200) + " — Assessment complete!",
  ],
};

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

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 6: Persona-specific optin bullets
// ═══════════════════════════════════════════════════════════════════
const OPTIN_BULLETS: Record<Persona, string[]> = {
  "healthcare-pro": [
    "Your clinical skills gap analysis + ASI fast-track timeline",
    "Personalized healthcare-to-practitioner transition roadmap",
    "Scholarship eligibility review (average approval: 94%)",
  ],
  "health-coach": [
    "Your coach-to-clinical upgrade assessment from ASI",
    "Personalized income growth roadmap (3x average increase)",
    "52 CEU hours accreditation verification",
  ],
  "corporate": [
    "Your career transition readiness report from ASI",
    "Personalized corporate-to-practitioner roadmap",
    "Access to 2,847+ certified practitioner network",
  ],
  "stay-at-home-mom": [
    "Your family-friendly study schedule + earning timeline",
    "Personalized part-time practice launch roadmap",
    "Flexible Schedule cohort availability check",
  ],
  "other-passionate": [
    "Your qualification status + Practitioner Type reveal",
    "Personalized ASI certification roadmap",
    "Scholarship eligibility assessment (73% acceptance rate)",
  ],
};

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC LAYER 7: Persona-specific question subtitles
// ═══════════════════════════════════════════════════════════════════
const PERSONA_SUBTITLES: Record<Persona, Record<number, string>> = {
  "healthcare-pro": {
    1: "Your clinical salary is your baseline. FM practitioners earn 2-3x their hospital salary.",
    3: "Your medical training is already a head start. This measures how much we can accelerate you.",
    5: "As a healthcare professional, you already have lab exposure. This is about functional interpretation.",
    8: "Between shifts? Days off? Many nurses complete FM Certification faster than expected.",
    13: "Healthcare professionals typically have the financial stability for career investment. This helps us match you with the right tier.",
    14: "Many nurses and PAs use continuing education budgets or savings. What's your approach?",
  },
  "health-coach": {
    1: "Be honest. This helps us show you the income gap between coaching and clinical practice.",
    3: "Your coaching skills are the foundation. This measures your readiness for clinical work.",
    5: "This is THE skill that separates $50/hr coaches from $200/hr clinical practitioners.",
    8: "That's one morning session before your first client. Our coaches love this format.",
    13: "Most coaches invest in themselves regularly. This helps us understand your current capacity.",
    14: "Coaches who invest in certification see 3x ROI. How would you approach this investment?",
  },
  "corporate": {
    1: "Most career changers start at zero - and that's actually the best place to start.",
    3: "Your corporate discipline will serve you well here. This is about clinical readiness, not corporate skills.",
    5: "Think of lab panels like financial statements for the body. Your analytical mind will love this.",
    8: "That's your lunch break, or your commute. Many corporate professionals study while still employed.",
    13: "Career changers often have savings or severance. This helps us understand your investment readiness.",
    14: "Think of this like any professional development investment. What's realistic for you?",
  },
  "stay-at-home-mom": {
    1: "No judgment here. Many of our most successful practitioners started earning $0.",
    3: "Your life experience with kids, family health, and empathy counts more than you think.",
    5: "Imagine actually understanding your kids' lab results. This skill changes everything - personally and professionally.",
    8: "That's one nap time session. Our mom practitioners love this bite-sized format.",
    13: "Many moms use family budgets or personal savings. Be honest about your situation.",
    14: "This is an investment in your family's future. How would you approach the financing?",
  },
  "other-passionate": {
    1: "Starting from zero with passion is actually our favorite starting point.",
    3: "No health background needed. This measures your instincts and willingness to learn.",
    5: "Lab interpretation sounds intimidating but it's completely learnable from scratch.",
    8: "20 minutes of focused learning. Many of our top performers studied in the evenings.",
    13: "Passion-driven learners find a way. This helps us understand what options to offer you.",
    14: "Consider this an investment in your new career. What approach feels right?",
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
  {
    id: 1, pillar: "Your Profile",
    question: "What best describes you right now?",
    subtitle: "This helps us determine if you're a fit for the program.",
    options: [
      { label: "Healthcare professional (nurse, PA, medical assistant, etc.)", value: "healthcare-pro", reaction: "Excellent. Healthcare professionals have a 94% acceptance rate into our program. Your clinical background is a major advantage.", strength: "strong" },
      { label: "Health coach, trainer, or wellness practitioner", value: "health-coach", reaction: "Great foundation. Coaches who upgrade to ASI clinical certification see an average 3x increase in income.", strength: "strong" },
      { label: "Corporate professional ready for a career change", value: "corporate", reaction: "You'd be surprised - 31% of our highest earners came from corporate. Your professional skills are a MASSIVE advantage in building a practice.", strength: "good" },
      { label: "Stay-at-home mom looking to build something meaningful", value: "stay-at-home-mom", reaction: "Some of our most successful practitioners are moms who started studying during nap time. Your empathy and life experience are clinical superpowers.", strength: "good" },
      { label: "Other background - but passionate about health & wellness", value: "other-passionate", reaction: "Passion is the #1 predictor of success in our program. 38% of our top performers had non-traditional backgrounds.", strength: "good" },
    ],
  },
  {
    id: 2, pillar: "Your Profile",
    question: "How much are you currently earning per month from health and wellness work?",
    subtitle: "Be honest. This helps us calculate your earning potential.",
    options: [
      { label: "Nothing yet - I haven't started", value: "0", reaction: "That's actually the best place to start. No bad habits, no ceiling. Our top earners started from zero.", strength: "good" },
      { label: "Under $2,000/month", value: "under-2k", reaction: "You're leaving serious money on the table. The average ASI practitioner earns 4-5x that within 6 months.", strength: "good" },
      { label: "$2,000 - $5,000/month", value: "2k-5k", reaction: "Solid base. But you're ready for the next level. ASI practitioners at your stage typically double within 90 days.", strength: "strong" },
      { label: "Over $5,000/month", value: "over-5k", reaction: "Impressive. You're already ahead of 90% of wellness professionals. FM Certification could take you to $15-25K/month.", strength: "strong" },
    ],
  },
  {
    id: 3, pillar: "Dream Outcome",
    question: "What's your income goal for the next 12 months?",
    subtitle: "Think big. We'll tell you if it's realistic based on your profile.",
    options: [
      { label: "$5,000/month - replace my current income", value: "5k", reaction: "Very achievable. 73% of our practitioners hit $5K/month within their first 90 days of certification.", strength: "strong" },
      { label: "$10,000/month - real financial freedom", value: "10k", reaction: "That's our sweet spot. The average ASI FM practitioner earns $8-12K/month within 6 months.", strength: "strong" },
      { label: "$20,000/month - build a serious practice", value: "20k", reaction: "Ambitious but proven. Practitioners who add group programs and courses hit $20K+ regularly.", strength: "strong" },
      { label: "$50,000+/month - I want to build an empire", value: "50k-plus", reaction: "That's the mindset of a future clinical director. It requires leverage - and we'll show you exactly how.", strength: "strong" },
    ],
  },
  {
    id: 4, pillar: "Experience",
    question: "Have you worked directly with clients on their health before?",
    options: [
      { label: "Yes - I have active clients right now", value: "active-clients", reaction: "Perfect. You can start applying ASI protocols with your existing clients immediately after certification.", strength: "strong" },
      { label: "Yes, but I stopped or took a break", value: "past-clients", reaction: "The skills don't disappear. The program will give you the framework and confidence to restart stronger.", strength: "good" },
      { label: "Only informally - friends, family", value: "informal", reaction: "That counts more than you think. You already have the instinct. The program gives you the clinical structure.", strength: "good" },
      { label: "No direct experience yet", value: "no-experience", reaction: "Don't worry - 38% of our top performers had zero experience. The the ASI clinical framework teaches everything from scratch.", strength: "developing" },
    ],
  },
  {
    id: 5, pillar: "Clinical Readiness",
    question: "When a client presents with fatigue, brain fog, and weight gain - how confident are you identifying the root cause?",
    subtitle: "Be honest. This is what separates coaches from clinical practitioners.",
    options: [
      { label: "Very confident - I have a systematic approach", value: "very-confident", reaction: "That's rare. Let's see if FM Certification can add clinical expertise to what you already have.", strength: "strong" },
      { label: "Somewhat - I can identify some causes", value: "somewhat", reaction: "Good instincts. The program turns that intuition into a repeatable 5-phase clinical framework.", strength: "good" },
      { label: "Not very - I'd need to research", value: "not-very", reaction: "Honest answer. That's exactly the gap The program was designed to fill. This is learnable.", strength: "developing" },
      { label: "I'd refer them to someone else", value: "refer-out", reaction: "What if YOU were the someone else? That's what ASI certification makes possible.", strength: "developing" },
    ],
  },
  {
    id: 6, pillar: "Clinical Readiness",
    question: "Have you ever wanted to order and interpret functional lab panels for your clients?",
    subtitle: "Lab interpretation is the #1 skill that separates $50/hr coaches from $200/hr practitioners.",
    options: [
      { label: "Yes - I already do this or I'm learning", value: "already-doing", reaction: "You're ahead of 95% of applicants. The program will systematize and elevate your lab skills.", strength: "strong" },
      { label: "Yes, but I have no idea where to start", value: "want-to-learn", reaction: "Module 7-9 of The program is entirely focused on labs. Our practitioners go from zero to confidently ordering panels.", strength: "good" },
      { label: "I hadn't considered it, but it sounds powerful", value: "open-to-it", reaction: "It IS powerful. Lab interpretation is the difference between guessing and knowing. The program teaches both.", strength: "good" },
      { label: "I'm not sure that's for me", value: "not-sure", reaction: "Hmm. We'll need to see strong results on the remaining questions. Lab skills are central to the FM Certification.", strength: "developing" },
    ],
  },
  {
    id: 7, pillar: "Past Investment",
    question: "Have you invested in health or wellness certifications before?",
    options: [
      { label: "Yes, multiple - and they were disappointing", value: "multiple-disappointed", reaction: "You're not alone. Most programs sell theory without clinical application. That's exactly why ASI was created.", strength: "good" },
      { label: "Yes, one or two - got some value", value: "some-value", reaction: "Good foundation. The program builds on everything you've already learned and takes it to clinical level.", strength: "good" },
      { label: "Yes, spent $5K+ and still feel unprepared", value: "spent-5k-plus", reaction: "That's the industry's dirty secret. Expensive doesn't mean effective. The program delivers real clinical skills for a fraction of the cost.", strength: "good" },
      { label: "No - this would be my first certification", value: "first-time", reaction: "Then you're starting with the gold standard. No bad habits to unlearn. Clean slate, best possible foundation.", strength: "strong" },
    ],
  },
  {
    id: 8, pillar: "Gap Analysis",
    question: "What's the #1 thing missing from your current skill set?",
    subtitle: "Understanding your gap helps us determine your readiness.",
    options: [
      { label: "A real clinical framework - not just theory", value: "framework", reaction: "That's the exact gap FM Certification fills. A 5-phase clinical system: Discover, Evaluate, Pinpoint, Transform, Heal.", strength: "strong" },
      { label: "Confidence to charge premium prices", value: "confidence", reaction: "ASI certification IS that confidence. Our practitioners charge $150-250/hour without hesitation.", strength: "strong" },
      { label: "A proven system to actually get clients", value: "client-system", reaction: "Our Business Setup System is included. 73% of graduates land their first paying clients within 30 days.", strength: "strong" },
      { label: "Credibility and recognized credentials", value: "credibility", reaction: "That's what ASI accreditation provides. A nationally recognized certification that commands respect.", strength: "strong" },
    ],
  },
  {
    id: 9, pillar: "Commitment",
    question: "Would you watch a 20-minute training video each day if it meant earning $10K+/month within 6 months?",
    subtitle: "That's all the FM Certification requires. 20 minutes a day.",
    options: [
      { label: "Absolutely - that's a no-brainer", value: "absolutely", reaction: "That's the answer of someone who's going to succeed. 20 minutes a day. Life-changing results.", strength: "strong" },
      { label: "Yes, I can make that work", value: "yes-work", reaction: "Great. The program is fully self-paced. You can watch during lunch, before bed, whenever works.", strength: "strong" },
      { label: "I'd need to rearrange things, but yes", value: "rearrange", reaction: "That willingness to prioritize yourself is exactly what our top earners have in common.", strength: "good" },
      { label: "I'm not sure about daily commitment", value: "not-sure", reaction: "It doesn't have to be daily. Even 3-4 times a week works. The program adapts to your pace.", strength: "developing" },
    ],
  },
  {
    id: 10, pillar: "Vision",
    question: "If you were earning $10K+/month as a certified practitioner 6 months from now - what would that change for you?",
    subtitle: "Close your eyes for a moment and really picture it.",
    options: [
      { label: "I'd finally leave my 9-to-5 and work for myself", value: "leave-job", reaction: "Freedom. That's what 67% of our practitioners achieved within their first year. It's real.", strength: "strong" },
      { label: "Financial security and peace of mind for my family", value: "security", reaction: "That stability changes everything. No more stress about bills. No more saying no to what matters.", strength: "strong" },
      { label: "I'd feel confident, fulfilled, and doing meaningful work", value: "fulfillment", reaction: "Imagine waking up excited every morning, knowing you're genuinely transforming lives. That's the FM practitioner life.", strength: "strong" },
      { label: "All of the above - I want the complete transformation", value: "all-above", reaction: "That's exactly what ASI certification delivers. Not just income - a complete life and career transformation.", strength: "strong" },
    ],
  },
  {
    id: 11, pillar: "Specialization",
    question: "Which area of functional medicine calls to you the most?",
    subtitle: "This determines your Practitioner Type and specialization path.",
    options: [
      { label: "Hormone Health & Balance", value: "hormone-health", reaction: "The #1 most in-demand specialty. Women are desperate for qualified hormone practitioners.", strength: "strong" },
      { label: "Gut Health & Restoration", value: "gut-restoration", reaction: "The foundation of all health. Gut specialists command premium rates and never lack clients.", strength: "strong" },
      { label: "Metabolic & Weight Optimization", value: "metabolic-optimization", reaction: "Beyond basic diets - real metabolic transformation. One of the highest-paying specialties.", strength: "strong" },
      { label: "Burnout & Stress Recovery", value: "burnout-recovery", reaction: "1 in 3 professional women suffer burnout. The demand for qualified burnout practitioners is exploding.", strength: "strong" },
      { label: "Autoimmune & Immune Support", value: "autoimmune-support", reaction: "Complex cases need clinical practitioners. This is advanced-level, premium-rate work.", strength: "strong" },
      { label: "Other specialty (tell us your passion)", value: "other-specialty", reaction: "Love it! We'll map your unique focus to our specialty tracks. Your personal passion becomes your competitive edge.", strength: "strong" },
    ],
  },
  {
    id: 12, pillar: "Career Path",
    question: "Which ASI certification level interests you?",
    subtitle: "The ASI Functional Medicine career path has 4 levels - each unlocks higher earning potential.",
    options: [
      { label: "⭐ Level 1: Certified Practitioner ($2K-$5K/month)", value: "level-1", reaction: "Perfect starting point. Level 1 Practitioners earn $2K-$5K/month working part-time. Foundation of everything.", strength: "strong" },
      { label: "⭐⭐ Level 2: Advanced Practitioner ($5K-$8K/month)", value: "level-2", reaction: "Next tier. Advanced Practitioners add lab interpretation and specialized protocols. $5K-$8K/month is typical.", strength: "strong" },
      { label: "⭐⭐⭐ Level 3: Master Practitioner ($8K-$15K/month)", value: "level-3", reaction: "Expert level. Masters run group programs, mentor others, and earn $8K-$15K/month consistently.", strength: "strong" },
      { label: "⭐⭐⭐⭐ Level 4: Fellow / Clinical Director ($15K+/month)", value: "level-4", reaction: "Leadership tier. Fellows train practitioners, run clinics, and earn $15K-$30K+ monthly.", strength: "strong" },
    ],
  },
  {
    id: 13, pillar: "Client Acquisition",
    question: "How do you currently get clients or plan to get them?",
    subtitle: "Be honest — this helps us understand where we can help most.",
    options: [
      { label: "Referrals only (word of mouth)", value: "referrals", reaction: "That's the best kind! Our Business Setup System helps you 10x those referrals with proven frameworks.", strength: "strong" },
      { label: "Social media marketing", value: "social-media", reaction: "Great start! We include advanced social strategies specifically for health practitioners.", strength: "strong" },
      { label: "I have a website or funnel", value: "website-funnel", reaction: "You're ahead of 80%! We'll help you optimize and scale what's already working.", strength: "strong" },
      { label: "I struggle to get clients consistently", value: "struggle", reaction: "That's EXACTLY why we include the Business Setup System. 73% of grads get clients in their first 30 days.", strength: "good" },
      { label: "I don't have any clients yet", value: "no-clients", reaction: "Perfect starting point. You'll launch with our proven client acquisition framework from day one.", strength: "good" },
    ],
  },
  {
    id: 14, pillar: "Financial Qualification",
    question: "How would you describe your current financial situation?",
    subtitle: "This helps us determine what support options you may qualify for.",
    options: [
      { label: "Comfortable - I have savings set aside for personal development", value: "comfortable", reaction: "Excellent. Applicants with financial readiness qualify for our priority enrollment track.", strength: "strong" },
      { label: "Stable - I could invest but would need to budget carefully", value: "stable", reaction: "That's responsible thinking. Most of our successful practitioners started with a careful budget plan.", strength: "strong" },
      { label: "Tight - but I'm committed to making this work", value: "tight", reaction: "Commitment matters more than circumstances. We have options for determined applicants.", strength: "good" },
      { label: "Struggling - I need the most affordable option possible", value: "struggling", reaction: "I appreciate your honesty. Let's see if you qualify for our hardship scholarship program...", strength: "developing" },
    ],
  },
  {
    id: 15, pillar: "Financial Qualification",
    question: "If accepted, how would you approach the investment in your certification?",
    subtitle: "Understanding your investment approach helps us match you with the right program tier.",
    options: [
      { label: "I already have funds set aside for professional development", value: "funds-ready", reaction: "Outstanding! Applicants with ready funds qualify for our VIP fast-track enrollment.", strength: "strong" },
      { label: "I would use savings or credit for the right opportunity", value: "savings-credit", reaction: "That's the mindset of someone who takes their future seriously. Strong qualifier.", strength: "strong" },
      { label: "I would need a payment plan to make it work", value: "payment-plan", reaction: "We offer flexible payment options for qualified applicants. Let's continue your assessment.", strength: "good" },
      { label: "I'm not sure how I would fund it yet", value: "unsure-funding", reaction: "Hmm. Financial readiness is part of our qualification criteria. We'll factor this into your assessment.", strength: "developing" },
    ],
  },
  {
    id: 16, pillar: "Readiness",
    question: "If accepted into the ASI Functional Medicine Practitioner Certification, how soon could you start?",
    subtitle: "Limited spots per cohort to ensure quality mentorship. Current cohort: 47/50 filled.",
    options: [
      { label: "I could start this week", value: "this-week", reaction: "Excellent! Immediate starters have a 94% completion rate. Let me check availability...", strength: "strong" },
      { label: "Within the next 2 weeks", value: "2-weeks", reaction: "Perfect timing with our next intake window. Strong qualifier.", strength: "strong" },
      { label: "Within the next month", value: "1-month", reaction: "We can reserve a spot for qualified applicants. Let's continue your assessment...", strength: "good" },
      { label: "I need to plan, but I'm committed", value: "planning", reaction: "Commitment noted. We'll factor timeline into your qualification score.", strength: "good" },
      { label: "I need to save up first - maybe 3-6 months", value: "save-up", reaction: "I understand. We'll add you to our waitlist and reach out when you're ready.", strength: "developing" },
    ],
  },
  {
    id: 17, pillar: "Final Qualification",
    question: "Based on your answers, we're evaluating your qualification status...",
    subtitle: `📋 QUALIFICATION CRITERIA
━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Background & Experience
✓ Clinical Readiness Score
✓ Commitment Level
✓ Financial Qualification
✓ Start Timeline

⚡ Only 27% of applicants qualify
━━━━━━━━━━━━━━━━━━━━━━━━━

Click below to reveal your qualification status:`,
    options: [
      { label: "🎯 REVEAL MY QUALIFICATION STATUS", value: "reveal-status", reaction: "Processing your qualification assessment... This could change everything.", strength: "strong" },
      { label: "I want to speak with someone first", value: "speak-first", reaction: "Of course. Let's get you connected with Sarah who can answer your questions and review your qualification.", strength: "good" },
      { label: "I'm not ready to find out yet", value: "not-ready", reaction: "I understand. When you're ready, your assessment will be here waiting.", strength: "developing" },
    ],
  },
];




// ─── Types ─────────────────────────────────────────────────────────
type Stage = "intro" | "quiz" | "testimonial" | "optin" | "reviewing" | "qualified" | "result";
const TOTAL_STEPS = 21; // Now 17 questions + intro + optin + reviewing + qualified

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
  const [showExitPopup, setShowExitPopup] = useState(false);
  const exitPopupShown = useRef(false);
  // Audio removed from quiz - now plays only in scholarship chat
  const [direction, setDirection] = useState(1);
  const [reviewStep, setReviewStep] = useState(0);
  const [optinTimer, setOptinTimer] = useState(900);
  const fireConfetti = useConfetti();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const practitionerTypeKey = answers[10] || "hormone-health";
  const practitionerType = PRACTITIONER_TYPES[practitionerTypeKey] || PRACTITIONER_TYPES["hormone-health"];
  const incomeGoal = answers[2] || "10k";
  const currentRole = (answers[0] || "other-passionate") as Persona;

  // Dynamic data based on persona
  const testimonials = TESTIMONIALS_BY_PERSONA[currentRole] || TESTIMONIALS_BY_PERSONA["other-passionate"];
  const reviewSteps = REVIEW_STEPS_BY_PERSONA[currentRole] || REVIEW_STEPS_BY_PERSONA["other-passionate"];
  const qualFraming = QUALIFICATION_FRAMING[currentRole] || QUALIFICATION_FRAMING["other-passionate"];
  const cohort = COHORT_NAMES[currentRole] || COHORT_NAMES["other-passionate"];
  const optinBullets = OPTIN_BULLETS[currentRole] || OPTIN_BULLETS["other-passionate"];
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

  // Optin countdown timer
  useEffect(() => {
    if (stage === "optin") {
      timerRef.current = setInterval(() => {
        setOptinTimer((prev) => (prev <= 0 ? 0 : prev - 1));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  // Exit-intent detection (desktop: mouse leaves top, mobile: visibility change)
  useEffect(() => {
    if (stage === "result" || stage === "qualified" || stage === "reviewing") return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitPopupShown.current && stage !== "intro") {
        exitPopupShown.current = true;
        setShowExitPopup(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !exitPopupShown.current && stage !== "intro") {
        exitPopupShown.current = true;
        setShowExitPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
    }, 700);
    return () => clearInterval(interval);
  }, [stage, fireConfetti, reviewSteps.length]);

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
    if (stage === "optin" || stage === "reviewing" || stage === "qualified" || stage === "result") return TOTAL_STEPS;
    const testimonialsBefore = testimonials.filter((t) => t.afterQ <= currentQ).length;
    return 1 + currentQ + testimonialsBefore;
  };
  const progress = Math.round((getStepNumber() / TOTAL_STEPS) * 100);

  const selectAnswer = (value: string, _reactionText: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: value }));
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

  // Audio removed from quiz - now plays only in scholarship chat (see scholarship-chat.tsx)

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
      else { setStage("optin"); }
      return;
    }
    if (stage === "quiz") {
      if (!answers[currentQ]) return;
      const justAnswered = currentQ + 1;
      const testimonial = testimonials.find((t) => t.afterQ === justAnswered);
      if (testimonial) { setStage("testimonial"); return; }
      if (currentQ < QUESTIONS.length - 1) { setCurrentQ(currentQ + 1); }
      else { setStage("optin"); }
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setReaction(null);
    if (stage === "quiz" && currentQ === 0) { setStage("intro"); return; }
    if (stage === "testimonial") { setStage("quiz"); return; }
    if (stage === "quiz" && currentQ > 0) {
      const prevTestimonial = testimonials.find((t) => t.afterQ === currentQ);
      if (prevTestimonial) { setStage("testimonial"); setCurrentQ(currentQ - 1); return; }
      setCurrentQ(currentQ - 1);
    }
    if (stage === "optin") { setCurrentQ(QUESTIONS.length - 1); setStage("quiz"); }
  };

  const handleOptinSubmit = async () => {
    if (!email || !email.includes("@") || !lastName.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/quiz-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, lastName, email, phone,
          funnel: "fm-certification",
          answers,
          practitionerType: practitionerTypeKey,
          incomeGoal,
          currentRole,
        }),
      });
    } catch { /* still proceed */ }
    setSubmitting(false);
    setReviewStep(0);
    setStage("reviewing");
  };

  const handleSeeResults = () => {
    setStage("result");
    const params = new URLSearchParams({
      name, lastName, email,
      type: practitionerTypeKey,
      goal: incomeGoal,
      role: currentRole,
      // Pass ALL quiz answers for hyper-personalization
      currentIncome: answers[1] || "",        // Q2: current income
      experience: answers[3] || "",            // Q4: client experience
      clinicalReady: answers[4] || "",         // Q5: clinical readiness
      labInterest: answers[5] || "",           // Q6: lab interest
      pastCerts: answers[6] || "",             // Q7: past certifications
      missingSkill: answers[7] || "",          // Q8: missing skill
      commitment: answers[8] || "",            // Q9: commitment
      vision: answers[9] || "",                // Q10: vision
      careerPathLevel: answers[11] || "",      // Q12: career path level
      clientAcquisition: answers[12] || "",    // Q13: client acquisition
      financialSituation: answers[13] || "",   // Q14: financial situation (NEW)
      investmentPriority: answers[14] || "",   // Q15: investment priority (NEW)
      startTimeline: answers[15] || "",        // Q16: start timeline
      qualificationChoice: answers[16] || "",  // Q17: final qualification choice
    });

    const route = ROLE_ROUTES[currentRole] || "/results/career-change";
    setTimeout(() => { window.location.href = `${route}?${params.toString()}`; }, 1500);
  };

  const canProceed = (): boolean => {
    if (stage === "intro") return !!name.trim();
    if (stage === "quiz") return !!answers[currentQ];
    if (stage === "testimonial") return true;
    return false;
  };

  const animKey = `${stage}-${currentQ}`;

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
        <div className="space-y-4">
          {/* Qualification-First Announcement */}
          <div
            className="text-center p-3 rounded-xl border-2"
            style={{ backgroundColor: `${BRAND.burgundy}08`, borderColor: `${BRAND.burgundy}30` }}
          >
            <p className="text-sm font-bold" style={{ color: BRAND.burgundy }}>
              ⚡ Only <span className="underline">27% of applicants</span> qualify to become ASI-Certified Functional Medicine Practitioners.
            </p>
          </div>

          {/* ASI Logo + Institute Header */}
          <div className="text-center space-y-2">
            <Image
              src="https://assets.accredipro.academy/fm-certification/ASI_LOGO-removebg-preview.png"
              alt="AccrediPro International Standards Institute"
              width={70}
              height={70}
              className="mx-auto"
            />
            <div>
              <h2 className="text-base font-bold" style={{ color: BRAND.burgundy }}>
                AccrediPro International Standards Institute
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">
                9 International Accreditations
              </p>
            </div>
          </div>

          {/* Accreditation Logos */}
          <div className="flex justify-center">
            <Image
              src="https://assets.accredipro.academy/fm-certification/All_Logos.png"
              alt="CMA, CTAA, IPHM, IIOHT, CPD, IGCT, IHTCP, ICAHP, IAOTH"
              width={300}
              height={55}
              className="opacity-85"
            />
          </div>

          {/* Accreditation Text List */}
          <div className="text-center">
            <p className="text-[9px] text-gray-400 leading-relaxed">
              CMA • CTAA • IPHM • IIOHT • CPD • IGCT • IHTCP • ICAHP • IAOTH
            </p>
          </div>

          {/* Sarah Card */}
          <div
            className="rounded-2xl p-4 border-2"
            style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}40` }}
          >
            <div className="flex items-start gap-3">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah Mitchell"
                width={56}
                height={56}
                className="rounded-full border-2 object-cover flex-shrink-0 shadow-lg"
                style={{ borderColor: BRAND.gold }}
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: BRAND.burgundy }}>
                  SENIOR ADMISSIONS ADVISOR
                </p>
                <p className="text-gray-900 font-bold text-sm">Hi! I&apos;m Sarah Mitchell 👋</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  Before joining the Institute, I was a burned-out ER nurse and single mom. Functional Medicine changed everything — I now help women build $10K-15K/month practices from home.
                </p>
                <p className="text-gray-500 text-[10px] mt-1.5 italic">
                  I&apos;ve personally guided 2,800+ women through this exact process.
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="relative mx-auto" style={{ maxWidth: 240 }}>
            <Image
              src="https://learn.accredipro.academy/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
              alt="Functional Medicine Certificate"
              width={240}
              height={170}
              className="rounded-lg shadow-lg border"
              style={{ borderColor: `${BRAND.gold}60` }}
            />
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap"
              style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
              Verified Digital Credential
            </div>
          </div>

          {/* Assessment CTA */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>
              This 3-minute assessment determines:
            </p>
            <div className="flex flex-col gap-0.5 text-sm text-gray-700">
              <span>🎯 If you have what it takes to become an FM Practitioner</span>
              <span>📊 Your qualification score vs. other applicants</span>
              <span>⚡ Your eligibility for priority enrollment</span>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="What's your first name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) handleNext(); }}
              className="w-full px-4 py-3 rounded-xl border-2 text-center text-lg focus:outline-none transition-colors"
              style={{ borderColor: name ? BRAND.gold : "#e5e7eb", background: name ? `${BRAND.gold}08` : "white" }}
            />
            <Button
              onClick={() => name.trim() && handleNext()}
              disabled={!name.trim()}
              className="group w-full h-14 text-lg font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
              style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center justify-center">
                See If I Qualify <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 min</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% private</span>
            <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 4,200+ certified</span>
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
          {testimonial.afterQ === 9 && (
            <div className="p-4 rounded-xl text-left" style={{ backgroundColor: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}40` }}>
              <p className="text-sm font-semibold mb-1" style={{ color: BRAND.burgundy }}>Your results so far:</p>
              <p className="text-sm text-gray-600">You&apos;re showing strong clinical potential. Just 3 more questions to confirm your Practitioner Type and qualification status!</p>
            </div>
          )}
        </div>
      );
    }

    // ── OPTIN (DYNAMIC bullets per persona) ──
    if (stage === "optin") {
      return (
        <div className="space-y-5">
          {/* Timer Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${BRAND.burgundy}10`, color: BRAND.burgundy }}>
              <Clock className="w-3 h-3" /> Results expire in {formatTimer(optinTimer)}
            </div>
          </div>

          {/* Sarah Message */}
          <div className="rounded-xl p-4 border" style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}30` }}>
            <div className="flex items-start gap-3">
              <Image src={SARAH_AVATAR} alt="Sarah M." width={48} height={48} className="rounded-full border-2 object-cover flex-shrink-0 shadow-md" style={{ borderColor: BRAND.gold }} />
              <div>
                <p className="text-gray-900 text-sm font-bold">Sarah M.</p>
                <p className="text-gray-600 text-xs mt-1">
                  &quot;{name}, your assessment is complete! 🎉 Enter your details below so I can send your personalized certification roadmap.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CERTIFICATE_IMG} alt="Your Certificate" className="w-full rounded-lg shadow-lg border border-gray-200" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                Your Certificate Awaits
              </div>
            </div>
          </div>

          {/* Form with Full Gold Metallic Frame */}
          <div className="rounded-2xl overflow-hidden" style={{ background: BRAND.goldMetallic, padding: "3px" }}>
            <div className="bg-white rounded-xl p-4 space-y-3">
              {/* First Name (readonly) */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={name} readOnly className="w-full h-11 pl-10 pr-4 text-sm border-2 rounded-xl bg-gray-50 text-gray-600 font-medium" style={{ borderColor: `${BRAND.gold}40` }} />
              </div>
              {/* Last Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all bg-white"
                  style={{ borderColor: lastName.trim() ? BRAND.gold : "#e5e7eb" }} />
              </div>
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Your best email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all bg-white"
                  style={{ borderColor: email.includes("@") ? BRAND.gold : "#e5e7eb" }} />
              </div>
              {/* Phone with US Flag + +1 */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-base">🇺🇸</span>
                  <span className="text-gray-500 font-medium text-sm">+1</span>
                </div>
                <input type="tel" placeholder="(555) 123-4567" value={phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d\s()-]/g, "");
                    setPhone(cleaned);
                  }}
                  className="w-full h-11 pl-[4.5rem] pr-4 text-sm border-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all bg-white"
                  style={{ borderColor: phone.trim() ? BRAND.gold : "#e5e7eb" }} />
              </div>
              <p className="text-xs text-gray-500 text-center">📱 We&apos;ll text you your results + exclusive bonuses</p>
            </div>
          </div>

          {/* DYNAMIC optin bullets */}
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${BRAND.gold}08` }}>
            <p className="text-[10px] font-medium mb-1.5" style={{ color: BRAND.burgundy }}>You&apos;ll receive:</p>
            <ul className="space-y-1 text-[10px] text-gray-600">
              {optinBullets.map((item) => (
                <li key={item} className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: BRAND.gold }} />{item}</li>
              ))}
            </ul>
          </div>

          {/* DYNAMIC scarcity */}
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${BRAND.burgundy}08` }}>
            <p className="text-[11px] font-bold" style={{ color: BRAND.burgundy }}>
              ⚡ Only {cohort.spots} spots left in the {cohort.name}
            </p>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
            <Lock className="w-3 h-3" />
            <span>100% private • No spam ever • Unsubscribe anytime</span>
          </div>
        </div>
      );
    }

    // ── REVIEWING (DYNAMIC steps per persona) ──
    if (stage === "reviewing") {
      return (
        <div className="space-y-8 py-10">
          <div className="text-center">
            <Image src={ASI_LOGO} alt="ASI" width={64} height={64} className="mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1" style={{ color: BRAND.burgundyDark }}>Reviewing Your Assessment</h2>
            <p className="text-sm text-gray-500">{name}, please wait while we analyze your profile...</p>
          </div>
          <div className="space-y-3 max-w-xs mx-auto">
            {reviewSteps.map((step, i) => (
              <motion.div key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= reviewStep ? 1 : 0.3, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {i < reviewStep ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: BRAND.gold }} />
                ) : i === reviewStep ? (
                  <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" style={{ color: BRAND.burgundy }} />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#e5e7eb" }} />
                )}
                <span className={`text-sm ${i <= reviewStep ? "text-gray-800 font-medium" : "text-gray-400"}`}>{step}</span>
              </motion.div>
            ))}
          </div>
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: BRAND.burgundyGold }}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.round((reviewStep / (reviewSteps.length - 1)) * 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }} />
            </div>
          </div>
          {reviewStep >= 4 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs font-medium" style={{ color: BRAND.burgundy }}>
              Checking eligibility...
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
        {/* Sarah is typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 border flex items-start gap-3" style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}30` }}
          >
            <Image src={SARAH_AVATAR} alt="Sarah" width={36} height={36} className="rounded-full border-2 object-cover flex-shrink-0" style={{ borderColor: BRAND.gold }} />
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-sm font-medium" style={{ color: BRAND.burgundy }}>Sarah is typing</span>
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: BRAND.burgundy, animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: BRAND.burgundy, animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: BRAND.burgundy, animationDelay: "300ms" }} />
              </span>
            </div>
          </motion.div>
        )}
        {reaction && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 border flex items-start gap-3" style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}30` }}
          >
            <Image src={SARAH_AVATAR} alt="Sarah" width={36} height={36} className="rounded-full border-2 object-cover flex-shrink-0" style={{ borderColor: BRAND.gold }} />
            <div>
              <p className="text-sm" style={{ color: BRAND.burgundy }}>{reaction}</p>
              {answers[currentQ] && (() => {
                const opt = q.options.find(o => o.value === answers[currentQ]);
                if (!opt) return null;
                return (
                  <p className="text-[10px] mt-1 font-medium flex items-center gap-1" style={{ color: opt.strength === "strong" ? "#16a34a" : opt.strength === "good" ? BRAND.gold : "#9ca3af" }}>
                    {opt.strength === "strong" && <><TrendingUp className="w-3 h-3" /> Strong match - top performer profile</>}
                    {opt.strength === "good" && <><CheckCircle className="w-3 h-3" /> Good - matches qualified applicant profile</>}
                    {opt.strength === "developing" && <><Sparkles className="w-3 h-3" /> Noted - we&apos;ll evaluate holistically</>}
                  </p>
                );
              })()}
            </div>
          </motion.div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.gold}15`, color: BRAND.burgundy }}>{q.pillar}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: BRAND.burgundyDark }}>{q.question}</h2>
          {dynamicSubtitle && <p className="text-sm text-gray-500 mt-1">{dynamicSubtitle}</p>}
        </div>
        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = answers[currentQ] === opt.value;
            return (
              <button key={opt.value} onClick={() => selectAnswer(opt.value, opt.reaction)}
                className="w-full p-4 rounded-xl border-2 transition-all text-left"
                style={{ borderColor: isSelected ? BRAND.burgundy : "#e5e7eb", backgroundColor: isSelected ? `${BRAND.burgundy}08` : "white" }}>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isSelected ? BRAND.burgundy : "#d1d5db" }}>
                    {isSelected && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.burgundy }} />}
                  </div>
                  <span className="font-medium text-sm" style={{ color: BRAND.burgundy }}>{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        {currentQ >= 9 && (
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
    return "Next";
  };

  // ─── Reviewing / Result layout ────────────────────────────────
  if (stage === "reviewing" || stage === "result") {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}>
        <div className="py-6 md:py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff", boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}>
              <div className="px-5 py-3" style={{ background: BRAND.goldMetallic }}>
                <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>
                  {stage === "reviewing" ? "Processing Assessment..." : "Redirecting..."}
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
      {/* Exit-Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowExitPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ border: `3px solid ${BRAND.gold}` }}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl">⏰</div>
                <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>
                  Wait! Don&apos;t lose your progress!
                </h3>
                <p className="text-gray-600 text-sm">
                  You&apos;re <strong>{progress}% done</strong> with your assessment. Just a few more questions to see if you qualify for a scholarship!
                </p>
                <div className="pt-2 space-y-3">
                  <Button
                    onClick={() => setShowExitPopup(false)}
                    className="w-full h-12 text-base font-bold rounded-xl"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                  >
                    Continue My Assessment
                  </Button>
                  <button
                    onClick={() => setShowExitPopup(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    I&apos;ll come back later
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  ⚠️ Your answers will NOT be saved if you leave
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-6 md:py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff", boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ background: BRAND.goldMetallic }}>
              <span className="text-sm font-bold flex items-center gap-2" style={{ color: BRAND.burgundyDark }}>
                <Stethoscope className="w-4 h-4" /> ASI Clinical Assessment
              </span>
              <span className="text-sm font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${BRAND.burgundyDark}20`, color: BRAND.burgundyDark }}>
                {stage === "intro" ? "Start" : stage === "optin" ? "Final Step" : `${currentQ + 1} / ${QUESTIONS.length}`}
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
                {stage === "optin" ? (
                  <Button onClick={handleOptinSubmit}
                    disabled={!email.includes("@") || !lastName.trim() || !phone.trim() || submitting}
                    size="lg"
                    className="group h-12 px-8 text-base font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 min-w-[160px] disabled:opacity-50 relative overflow-hidden"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center">
                      {submitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</> : <>Review My Assessment <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>}
                    </span>
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={!canProceed()} size="lg"
                    className="group h-12 px-8 text-base font-bold rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 min-w-[160px] disabled:opacity-50 relative overflow-hidden"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center">
                      {getNextLabel()} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
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
