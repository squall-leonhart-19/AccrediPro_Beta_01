"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    ArrowRight, ArrowLeft, Loader2,
    User, Mail, Phone, Heart, Sparkles, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types for form data
export interface SarahApplicationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    background: string;
    motivation: string;
    workCost: string;
    holdingBack: string;
    successGoal: string;
    timeAvailable: string;
    investmentRange: string;
    readiness: string;
}

interface SarahApplicationFormProps {
    onSubmit: (data: SarahApplicationData) => Promise<void>;
    onAccepted?: () => void; // Called when user clicks "Start Learning" after acceptance
    isSubmitting: boolean;
    isVerifying?: boolean;
    niche?: string; // Mini diploma niche slug for question customization
}

// Niche-specific overrides for ALL quiz questions and Sarah credentials
type QuestionOption = { value: string; label: string; icon: string };
type NicheOverride = {
    sarahCredentials: string;
    // Q1
    q1Options?: QuestionOption[];
    // Q2
    q2Title: string;
    q2Subtitle?: string;
    q2Options: QuestionOption[];
    // Q3
    q3Title?: string;
    q3Subtitle?: string;
    q3Options?: QuestionOption[];
    q3Testimonials?: Record<string, { quote: string; name: string; location: string }>;
    // Q4
    q4Options?: QuestionOption[];
    // Q5
    q5Options?: QuestionOption[];
    // Q7
    q7Subtitle?: string;
    q7Options?: QuestionOption[];
    // Q8
    q8Subtitle?: string;
};

const NICHE_OVERRIDES: Record<string, NicheOverride> = {
    "spiritual-healing": {
        sarahCredentials: "Clinical Director · 20+ Years in Spiritual Healing & Integrative Wellness",
        // Q1 — background options tailored to spiritual healing buyers
        q1Options: [
            { value: "healer", label: "Intuitive, empath, or natural healer", icon: "🔮" },
            { value: "wellness", label: "Yoga teacher, meditation guide, or wellness coach", icon: "🧘" },
            { value: "caregiver", label: "Caregiver, therapist, or counselor", icon: "💛" },
            { value: "transition", label: "Career transition or spiritual awakening", icon: "🦋" },
            { value: "other", label: "Other — I just feel called to this work", icon: "✨" },
        ],
        // Q2 — motivation
        q2Title: "Q2 — Why Spiritual Healing",
        q2Subtitle: "What's drawing you toward this work?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help people heal at the deepest spiritual level", icon: "💜" },
            { value: "own-journey", label: "I've been through my own spiritual awakening and want to guide others", icon: "🌱" },
            { value: "burnout", label: "I'm burned out and craving more meaningful, soul-aligned work", icon: "🔥" },
            { value: "flexibility", label: "I want flexible healing work I can build around my life", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to turn my spiritual gifts into a real career", icon: "✨" },
        ],
        // Q3 — what staying where you are is costing you
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT stepping into your calling, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "suppressing-gifts", label: "Suppressing gifts I know I'm meant to share", icon: "🙈" },
            { value: "exhausted", label: "Feeling drained by work that doesn't align with my soul", icon: "😰" },
            { value: "watching-others", label: "Watching others live their purpose while I stay stuck", icon: "👀" },
            { value: "feeling-stuck", label: "Knowing there's more for me but not taking the leap", icon: "🤷" },
            { value: "lost-myself", label: "Losing connection with my own spiritual path", icon: "🪞" },
            { value: "health-suffering", label: "My energy and wellbeing are suffering", icon: "💔" },
        ],
        q3Testimonials: {
            "suppressing-gifts": {
                quote: "I knew I had a gift since I was a child. The day I finally honored it, everything changed.",
                name: "Rachel, 46",
                location: "Colorado"
            },
            "exhausted": {
                quote: "My 9-to-5 was killing my spirit. Now I wake up excited to help people heal.",
                name: "Donna, 50",
                location: "Oregon"
            },
            "watching-others": {
                quote: "I kept seeing other women step into their calling. I finally said 'my turn.'",
                name: "Lisa, 43",
                location: "Virginia"
            },
            "feeling-stuck": {
                quote: "I waited 3 years. I wish I had started sooner. The clarity came the moment I said yes.",
                name: "Linda, 54",
                location: "Arizona"
            },
            "lost-myself": {
                quote: "I had forgotten who I really was. This journey brought me back to myself.",
                name: "Susan, 48",
                location: "California"
            },
            "health-suffering": {
                quote: "My body was screaming for alignment. When I found my purpose, the healing began.",
                name: "Karen, 41",
                location: "New Mexico"
            },
        },
        // Q4 — barriers
        q4Options: [
            { value: "unsure-where", label: "Unsure where to start or what's legitimate", icon: "🤔" },
            { value: "tried-before", label: "I've explored spiritual paths before but nothing stuck", icon: "😞" },
            { value: "self-doubt", label: "Wondering if my gifts are 'real enough' to help others", icon: "💭" },
            { value: "investment-concern", label: "Concerned about making the wrong investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I feel called and ready", icon: "✅" },
        ],
        // Q5 — success vision
        q5Options: [
            { value: "side-income", label: "Starting a healing practice on the side ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full healing practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving spiritual healing business ($10K+/month)", icon: "🚀" },
        ],
        // Q7 — investment framing
        q7Subtitle: "The Foundation Diploma is your starting point — it gives you the spiritual healing fundamentals.\n\nFor women who want to become certified spiritual healing practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        // Q8 — readiness vision
        q8Subtitle: "Imagine 8 weeks from now — certified in spiritual healing, working from home, helping others heal at the deepest level.\nIf everything I share feels right, are you ready to start?",
    },
    "energy-healing": {
        sarahCredentials: "Clinical Director · 20+ Years in Energy Healing & Holistic Wellness",
        q1Options: [
            { value: "healer", label: "Energy worker or intuitive healer", icon: "⚡" },
            { value: "wellness", label: "Wellness practitioner or bodyworker", icon: "🧘" },
            { value: "healthcare", label: "Healthcare or mental health professional", icon: "💛" },
            { value: "transition", label: "Career transition or seeking purpose", icon: "🦋" },
            { value: "other", label: "Other background — drawn to energy work", icon: "✨" },
        ],
        q2Title: "Q2 — Why Energy Healing",
        q2Subtitle: "What's drawing you toward energy work?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help people heal through energy work", icon: "⚡" },
            { value: "own-journey", label: "I've experienced energy healing myself and want to share it", icon: "🌱" },
            { value: "burnout", label: "I'm burned out and need more meaningful work", icon: "🔥" },
            { value: "flexibility", label: "I want flexible work I can build around my life", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready for a new chapter and this feels right", icon: "✨" },
        ],
    },
    "reiki-healing": {
        sarahCredentials: "Clinical Director · 20+ Years in Reiki & Energy Medicine",
        q1Options: [
            { value: "healer", label: "Reiki practitioner or energy worker", icon: "🙌" },
            { value: "wellness", label: "Massage therapist, yoga teacher, or bodyworker", icon: "🧘" },
            { value: "healthcare", label: "Healthcare or counseling professional", icon: "💛" },
            { value: "transition", label: "Career transition or spiritual awakening", icon: "🦋" },
            { value: "other", label: "Other — I feel called to Reiki", icon: "✨" },
        ],
        q2Title: "Q2 — Why Reiki Healing",
        q2Subtitle: "What's drawing you toward Reiki?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to become a certified Reiki practitioner", icon: "🙌" },
            { value: "own-journey", label: "I've experienced Reiki and want to share its benefits", icon: "🌱" },
            { value: "burnout", label: "I'm burned out and need more balanced, healing work", icon: "🔥" },
            { value: "flexibility", label: "I want flexible healing work from home", icon: "⏰" },
            { value: "new-chapter", label: "I feel called to Reiki and ready to start", icon: "✨" },
        ],
    },
    "adhd-coaching": {
        sarahCredentials: "Clinical Director · 20+ Years in ADHD Coaching & Neurodivergent Support",
        q1Options: [
            { value: "healthcare", label: "Therapist, counselor, or mental health professional", icon: "🩺" },
            { value: "educator", label: "Teacher, tutor, or school support specialist", icon: "📚" },
            { value: "wellness", label: "Coach, mentor, or wellness practitioner", icon: "🧘" },
            { value: "transition", label: "Career transition — personally touched by ADHD", icon: "🦋" },
            { value: "other", label: "Other — passionate about neurodivergent support", icon: "🧠" },
        ],
        q2Title: "Q2 — Why ADHD Coaching",
        q2Subtitle: "What's drawing you toward ADHD coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help ADHD adults build systems that actually work", icon: "🧠" },
            { value: "own-journey", label: "I have ADHD myself and want to help others like me", icon: "🌱" },
            { value: "burnout", label: "I see ADHD clients struggling and current solutions aren't enough", icon: "🔥" },
            { value: "flexibility", label: "I want flexible coaching work I can build around my life", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to specialize in a high-demand coaching niche", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT stepping into this work, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "watching-struggle", label: "Watching ADHD adults struggle with no real support", icon: "😰" },
            { value: "exhausted", label: "Feeling drained by work that doesn't use my natural gifts", icon: "💔" },
            { value: "feeling-stuck", label: "Knowing I could help but not having the framework", icon: "🤷" },
            { value: "watching-others", label: "Seeing other coaches thrive while I stay in my comfort zone", icon: "👀" },
            { value: "lost-myself", label: "Losing my own sense of purpose and direction", icon: "🪞" },
            { value: "health-suffering", label: "My own energy and wellbeing are declining", icon: "💔" },
        ],
        q3Testimonials: {
            "watching-struggle": { quote: "As a teacher, I watched brilliant ADHD kids fall through the cracks. Now I catch them.", name: "Dana, 44", location: "Illinois" },
            "exhausted": { quote: "My corporate job was killing my soul. ADHD coaching lit me back up.", name: "Tara, 39", location: "Colorado" },
            "feeling-stuck": { quote: "I knew I was meant to help people like me. The F.O.C.U.S. Method gave me the how.", name: "Alicia, 36", location: "Oregon" },
            "watching-others": { quote: "I scrolled past one too many coach success stories. I said 'that should be me.'", name: "Kim, 42", location: "Georgia" },
            "lost-myself": { quote: "I had lost my spark. Helping fellow ADHD brains lit it right back up.", name: "Jessica, 47", location: "Michigan" },
            "health-suffering": { quote: "My stress was through the roof. This career change literally saved my health.", name: "Monica, 41", location: "Texas" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure if ADHD coaching is a real career path", icon: "🤔" },
            { value: "tried-before", label: "I've looked into coaching before but never committed", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I know enough about ADHD to coach others", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the cost of getting certified", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to start", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting an ADHD coaching practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full ADHD coaching practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving ADHD coaching business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the ADHD coaching fundamentals.\n\nFor women who want to become certified ADHD coaches — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in ADHD coaching, working from home, helping neurodivergent adults build lives that actually work.\nIf everything I share feels right, are you ready to start?",
    },
    "christian-coaching": {
        sarahCredentials: "Clinical Director · 20+ Years in Faith-Based Coaching & Pastoral Counseling",
        q1Options: [
            { value: "ministry", label: "Pastor, minister, or church leader", icon: "⛪" },
            { value: "counselor", label: "Biblical counselor or faith-based therapist", icon: "📖" },
            { value: "wellness", label: "Wellness coach or life coach with faith foundation", icon: "🧘" },
            { value: "transition", label: "Career transition — called to serve through coaching", icon: "🦋" },
            { value: "other", label: "Other — feel led to faith-based coaching", icon: "✝️" },
        ],
        q2Title: "Q2 — Why Christian Coaching",
        q2Subtitle: "What's drawing you toward faith-based coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help people find purpose through faith-based coaching", icon: "✝️" },
            { value: "own-journey", label: "My own faith transformation drives me to help others", icon: "🌱" },
            { value: "burnout", label: "I'm burned out in ministry and need a new way to serve", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, purpose-driven work built around my calling", icon: "⏰" },
            { value: "new-chapter", label: "I feel called to integrate professional coaching with faith", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT stepping into your calling, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "suppressing-gifts", label: "Not using the spiritual gifts God gave me to their fullest", icon: "🙈" },
            { value: "exhausted", label: "Feeling drained by work that doesn't align with my calling", icon: "😰" },
            { value: "watching-others", label: "Watching others walk in their purpose while I hesitate", icon: "👀" },
            { value: "feeling-stuck", label: "Knowing God has more for me but not taking the step", icon: "🤷" },
            { value: "lost-myself", label: "Losing connection with my own sense of purpose", icon: "🪞" },
            { value: "health-suffering", label: "My joy and spiritual health are suffering", icon: "💔" },
        ],
        q3Testimonials: {
            "suppressing-gifts": { quote: "God gave me the gift of encouragement. Coaching let me finally use it professionally.", name: "Ruth, 48", location: "Tennessee" },
            "exhausted": { quote: "After 15 years in ministry, I was empty. Coaching filled my cup while serving others.", name: "Sharon, 52", location: "Alabama" },
            "watching-others": { quote: "Every time I saw someone step into their calling, I felt a nudge. I finally obeyed.", name: "Deborah, 45", location: "Georgia" },
            "feeling-stuck": { quote: "I prayed about it for 2 years. The peace came the moment I said yes.", name: "Mary, 50", location: "North Carolina" },
            "lost-myself": { quote: "I had drifted from my purpose. This brought me back to what God designed me for.", name: "Grace, 43", location: "Virginia" },
            "health-suffering": { quote: "My spirit was dry. Serving through coaching restored my joy.", name: "Hannah, 46", location: "Oklahoma" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure how faith-based coaching differs from secular", icon: "🤔" },
            { value: "tried-before", label: "I've explored coaching but never found a faith-based framework", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I'm qualified beyond my faith background", icon: "💭" },
            { value: "investment-concern", label: "Concerned about making the right investment", icon: "💰" },
            { value: "ready", label: "Nothing holding me back — I feel called and ready", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a faith-based coaching practice ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full Christian coaching practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving ministry-coaching business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the Christian coaching fundamentals.\n\nFor women who want to become certified faith-based coaches — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in Christian coaching, serving from home, helping people find purpose through faith-based transformation.\nIf everything I share feels right, are you ready to start?",
    },
    "gut-health": {
        sarahCredentials: "Clinical Director · 20+ Years in Gut Health & Functional Nutrition",
        q1Options: [
            { value: "healthcare", label: "Healthcare professional (RN, NP, dietitian)", icon: "🩺" },
            { value: "wellness", label: "Nutritionist, health coach, or wellness practitioner", icon: "🥗" },
            { value: "personal", label: "Personal gut health journey — want to help others", icon: "💪" },
            { value: "transition", label: "Career transition into digestive health", icon: "🦋" },
            { value: "other", label: "Other professional background", icon: "✨" },
        ],
        q2Title: "Q2 — Why Gut Health",
        q2Subtitle: "What's drawing you toward gut health coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help people heal their gut and transform their health", icon: "🌿" },
            { value: "own-journey", label: "I healed my own gut issues and want to help others do the same", icon: "🌱" },
            { value: "burnout", label: "I see clients with digestive issues and current solutions fail them", icon: "🔥" },
            { value: "flexibility", label: "I want flexible health coaching work I can build from home", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to specialize in the fastest-growing health niche", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT pursuing this path, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "watching-struggle", label: "Watching people suffer with gut issues that could be helped", icon: "😰" },
            { value: "exhausted", label: "Drained by work that doesn't align with my passion for nutrition", icon: "💔" },
            { value: "feeling-stuck", label: "Knowing I could make a difference but lacking the framework", icon: "🤷" },
            { value: "watching-others", label: "Seeing other health coaches thrive in this space", icon: "👀" },
            { value: "lost-myself", label: "Losing my drive while staying in a role that doesn't fulfill me", icon: "🪞" },
            { value: "health-suffering", label: "My own health and energy are declining", icon: "💔" },
        ],
        q3Testimonials: {
            "watching-struggle": { quote: "I watched my sister suffer for years. Now I help women like her every week.", name: "Angela, 44", location: "Florida" },
            "exhausted": { quote: "I was a nurse who was exhausted. Gut health coaching re-energized my entire career.", name: "Bethany, 48", location: "Ohio" },
            "feeling-stuck": { quote: "I read every gut health book. The R.E.S.E.T. Method turned knowledge into a real practice.", name: "Carla, 39", location: "Texas" },
            "watching-others": { quote: "I watched two friends launch gut health practices. I finally stopped watching.", name: "Diana, 42", location: "California" },
            "lost-myself": { quote: "I had lost my sense of purpose. Helping people heal their guts healed me too.", name: "Elena, 46", location: "Washington" },
            "health-suffering": { quote: "My own gut issues led me here. Now I'm certified and healthier than ever.", name: "Fatima, 37", location: "New York" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure if gut health coaching is a credible career", icon: "🤔" },
            { value: "tried-before", label: "I've studied nutrition but never turned it into a practice", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I know enough about the gut to coach others", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to start", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a gut health practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full gut health coaching practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving gut health business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the gut health coaching fundamentals.\n\nFor women who want to become certified gut health practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in gut health coaching, working from home, helping clients heal their digestion and transform their health.\nIf everything I share feels right, are you ready to start?",
    },
    "health-coach": {
        sarahCredentials: "Clinical Director · 20+ Years in Health Coaching & Preventive Wellness",
        q1Options: [
            { value: "healthcare", label: "Healthcare professional (RN, NP, PA, therapist)", icon: "🩺" },
            { value: "wellness", label: "Fitness trainer, yoga teacher, or wellness practitioner", icon: "🧘" },
            { value: "nutrition", label: "Nutritionist or dietary counselor", icon: "🥗" },
            { value: "transition", label: "Career transition into health and wellness", icon: "🦋" },
            { value: "other", label: "Other professional background", icon: "💼" },
        ],
        q2Title: "Q2 — Why Health Coaching",
        q2Subtitle: "What's drawing you toward health coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help people take control of their health proactively", icon: "💚" },
            { value: "own-journey", label: "My own health transformation inspired me to help others", icon: "🌱" },
            { value: "burnout", label: "I'm burnt out in healthcare and want more meaningful patient impact", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, location-independent work", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready for a purpose-driven second career", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT making this change, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "missing-family", label: "Missing family time because of rigid work schedules", icon: "🙈" },
            { value: "exhausted", label: "Coming home with nothing left to give", icon: "😰" },
            { value: "feeling-stuck", label: "Feeling stuck in a system that doesn't let me truly help people", icon: "🤷" },
            { value: "watching-others", label: "Seeing other health coaches build lives I want", icon: "👀" },
            { value: "lost-myself", label: "Losing my passion for health and wellness", icon: "🪞" },
            { value: "health-suffering", label: "Ironically, my own health is suffering from my current work", icon: "💔" },
        ],
        q3Testimonials: {
            "missing-family": { quote: "I missed my daughter's recital for a shift. That was the last time.", name: "Maria, 49", location: "Texas" },
            "exhausted": { quote: "I came home every night empty. Health coaching filled me back up.", name: "Christine, 46", location: "Michigan" },
            "feeling-stuck": { quote: "The healthcare system wouldn't let me spend time with patients. Coaching does.", name: "Sandra, 52", location: "California" },
            "watching-others": { quote: "My friend left nursing for coaching and doubled her income. I followed her.", name: "Jennifer, 44", location: "North Carolina" },
            "lost-myself": { quote: "I became a nurse to help people. Coaching let me do that again.", name: "Linda, 51", location: "Arizona" },
            "health-suffering": { quote: "The irony of a healthcare worker whose own health was failing. Coaching fixed both.", name: "Donna, 48", location: "Pennsylvania" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure where to start or what certification matters", icon: "🤔" },
            { value: "tried-before", label: "I've thought about coaching before but never committed", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I have enough expertise to coach", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the cost of training", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to start", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a health coaching practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full health coaching practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a high-demand health coaching business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the health coaching fundamentals.\n\nFor women who want to become certified health coaches — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified as a health coach, working from home, helping clients build healthier lives through proven coaching methods.\nIf everything I share feels right, are you ready to start?",
    },
    "holistic-nutrition": {
        sarahCredentials: "Clinical Director · 20+ Years in Holistic Nutrition & Integrative Wellness",
        q1Options: [
            { value: "healthcare", label: "Healthcare professional or registered dietitian", icon: "🩺" },
            { value: "wellness", label: "Wellness coach, yoga teacher, or fitness professional", icon: "🧘" },
            { value: "nutrition-passion", label: "Passionate about nutrition — self-taught knowledge", icon: "🥗" },
            { value: "transition", label: "Career transition into nutrition and wellness", icon: "🦋" },
            { value: "other", label: "Other background — drawn to holistic nutrition", icon: "🌿" },
        ],
        q2Title: "Q2 — Why Holistic Nutrition",
        q2Subtitle: "What's drawing you toward holistic nutrition?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help people heal through whole-food, evidence-based nutrition", icon: "🥗" },
            { value: "own-journey", label: "My own nutrition transformation changed my life and I want to share it", icon: "🌱" },
            { value: "burnout", label: "I'm tired of conventional diet advice that doesn't work", icon: "🔥" },
            { value: "flexibility", label: "I want flexible work helping people eat better", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to turn my nutrition knowledge into a career", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT pursuing this path, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "suppressing-gifts", label: "Not sharing the nutrition knowledge that could help so many", icon: "🙈" },
            { value: "exhausted", label: "Drained by work that doesn't align with my passion for food-as-medicine", icon: "😰" },
            { value: "watching-others", label: "Seeing others build nutrition practices while I stay stuck", icon: "👀" },
            { value: "feeling-stuck", label: "Knowing nutrition is my calling but not having the credential", icon: "🤷" },
            { value: "lost-myself", label: "Losing my own healthy habits while stuck in unfulfilling work", icon: "🪞" },
            { value: "health-suffering", label: "My energy and health are declining", icon: "💔" },
        ],
        q3Testimonials: {
            "suppressing-gifts": { quote: "Everyone came to me for nutrition advice anyway. Now I get paid for it.", name: "Sophia, 41", location: "California" },
            "exhausted": { quote: "I was a tired dietitian in a hospital. Private nutrition coaching gave me my life back.", name: "Nicole, 47", location: "Oregon" },
            "watching-others": { quote: "I watched nutrition influencers with less knowledge than me make six figures. I joined them.", name: "Priya, 38", location: "New Jersey" },
            "feeling-stuck": { quote: "I had the knowledge but not the credential. The W.H.O.L.E. Method changed that.", name: "Ashley, 43", location: "Colorado" },
            "lost-myself": { quote: "I was so busy I stopped cooking my own meals. Coaching brought me back to what I love.", name: "Tamara, 46", location: "Washington" },
            "health-suffering": { quote: "Teaching people about nutrition while neglecting my own — coaching fixed the irony.", name: "Megan, 40", location: "Texas" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure how holistic nutrition differs from standard dietetics", icon: "🤔" },
            { value: "tried-before", label: "I've studied nutrition but never built a practice", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I need a formal degree first", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to start", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a nutrition coaching practice ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full holistic nutrition practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving nutrition coaching business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the holistic nutrition fundamentals.\n\nFor women who want to become certified holistic nutrition practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in holistic nutrition, helping clients heal through food, building a practice you love.\nIf everything I share feels right, are you ready to start?",
    },
    "hormone-health": {
        sarahCredentials: "Clinical Director · 20+ Years in Hormone Health & Endocrine Wellness",
        q1Options: [
            { value: "healthcare", label: "Healthcare professional (RN, NP, PA)", icon: "🩺" },
            { value: "wellness", label: "Wellness coach, nutritionist, or naturopath", icon: "🧘" },
            { value: "personal", label: "Personal hormone journey — perimenopause or thyroid", icon: "💪" },
            { value: "transition", label: "Career transition into women's health", icon: "🦋" },
            { value: "other", label: "Other background — passionate about hormonal health", icon: "🌸" },
        ],
        q2Title: "Q2 — Why Hormone Health",
        q2Subtitle: "What's drawing you toward hormone health coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help women understand and balance their hormones", icon: "⚖️" },
            { value: "own-journey", label: "My own hormone struggles led me here and I want to help others", icon: "🌱" },
            { value: "burnout", label: "I'm frustrated watching women dismissed by conventional doctors", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, impactful coaching work from home", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to specialize in women's hormonal wellness", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT pursuing this path, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "watching-struggle", label: "Watching women suffer with hormones being told 'it's normal'", icon: "😰" },
            { value: "exhausted", label: "Drained by work that doesn't let me help women the way they need", icon: "💔" },
            { value: "feeling-stuck", label: "Having the knowledge but no credential to practice", icon: "🤷" },
            { value: "watching-others", label: "Seeing others build hormone health practices while I wait", icon: "👀" },
            { value: "lost-myself", label: "Losing my own hormonal balance while stuck in stressful work", icon: "🪞" },
            { value: "health-suffering", label: "My own body is screaming for attention", icon: "💔" },
        ],
        q3Testimonials: {
            "watching-struggle": { quote: "My doctor said 'just wait for menopause.' I refused to accept that for myself or my clients.", name: "Patricia, 49", location: "Arizona" },
            "exhausted": { quote: "As an OB nurse, I saw women ignored daily. Now they get the full hormone picture.", name: "Debra, 52", location: "Florida" },
            "feeling-stuck": { quote: "I had 10 years of hormone research but no credential. The B.A.L.A.N.C.E. Method gave me both.", name: "Lisa, 44", location: "California" },
            "watching-others": { quote: "I watched a colleague start a hormone practice and fill it in 30 days. I had to follow.", name: "Amanda, 41", location: "Texas" },
            "lost-myself": { quote: "I was so stressed my own hormones crashed. Coaching healed me and gave me a career.", name: "Rachel, 47", location: "Colorado" },
            "health-suffering": { quote: "My own perimenopause symptoms were a wake-up call. Now I help others with theirs.", name: "Karen, 50", location: "New York" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure if hormone coaching is within scope of practice", icon: "🤔" },
            { value: "tried-before", label: "I've researched hormones extensively but never certified", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I need a medical degree to coach on hormones", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing holding me back — I'm ready", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a hormone health practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full hormone health coaching practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving hormone wellness business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the hormone health coaching fundamentals.\n\nFor women who want to become certified hormone health practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in hormone health, working from home, helping women finally understand and balance their hormones.\nIf everything I share feels right, are you ready to start?",
    },
    "integrative-health": {
        sarahCredentials: "Clinical Director · 20+ Years in Integrative Health & Multi-Modal Healing",
        q1Options: [
            { value: "healthcare", label: "Healthcare professional (RN, NP, therapist)", icon: "🩺" },
            { value: "wellness", label: "Wellness coach, naturopath, or holistic practitioner", icon: "🧘" },
            { value: "clinical", label: "Clinical background wanting to add holistic approaches", icon: "🔬" },
            { value: "transition", label: "Career transition — bridging conventional and holistic", icon: "🦋" },
            { value: "other", label: "Other — passionate about integrative approaches", icon: "🌉" },
        ],
        q2Title: "Q2 — Why Integrative Health",
        q2Subtitle: "What's drawing you toward integrative health?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help clients with chronic conditions conventional medicine hasn't resolved", icon: "🌉" },
            { value: "own-journey", label: "I'm passionate about combining nutrition, herbs, and mind-body practices", icon: "🌱" },
            { value: "burnout", label: "I want to support patients with integrative approaches alongside treatment", icon: "🔥" },
            { value: "flexibility", label: "I'm exploring integrative health as a post-clinical career path", icon: "⏰" },
            { value: "new-chapter", label: "I want to be the bridge between conventional and holistic medicine", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT bridging this gap, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "watching-struggle", label: "Watching patients fall through the cracks between specialists", icon: "😰" },
            { value: "exhausted", label: "Drained by a fragmented system that treats symptoms not causes", icon: "💔" },
            { value: "feeling-stuck", label: "Knowing both approaches have value but nobody connects them", icon: "🤷" },
            { value: "watching-others", label: "Seeing integrative practitioners thrive while I stay conventional", icon: "👀" },
            { value: "lost-myself", label: "Losing my passion for healthcare in a broken system", icon: "🪞" },
            { value: "health-suffering", label: "My own health is declining from system-level frustration", icon: "💔" },
        ],
        q3Testimonials: {
            "watching-struggle": { quote: "28 years of nursing and I finally feel like I'm ACTUALLY helping people heal.", name: "Patricia, 50", location: "Ohio" },
            "exhausted": { quote: "The ER was killing me. Integrative health let me heal people AND myself.", name: "Rebecca, 48", location: "Pennsylvania" },
            "feeling-stuck": { quote: "Both sides had pieces of the puzzle. The B.R.I.D.G.E. Method let me put them together.", name: "Sandra, 45", location: "Oregon" },
            "watching-others": { quote: "A colleague started an integrative practice. She's happier and earning more. I followed.", name: "Laura, 43", location: "California" },
            "lost-myself": { quote: "I became a nurse to help people. Integrative health brought that dream back.", name: "Monica, 51", location: "New York" },
            "health-suffering": { quote: "The stress of conventional medicine was destroying me. This path healed both my patients and me.", name: "Teresa, 47", location: "Florida" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure how integrative health differs from functional medicine", icon: "🤔" },
            { value: "tried-before", label: "I've explored holistic approaches but never found a framework", icon: "😞" },
            { value: "self-doubt", label: "Wondering if doctors will take me seriously", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to bridge the gap", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting an integrative practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full integrative health practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving integrative practice ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the integrative health fundamentals.\n\nFor women who want to become certified integrative health practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in integrative health, bridging conventional and holistic medicine, with doctors referring patients to you.\nIf everything I share feels right, are you ready to start?",
    },
    "life-coaching": {
        sarahCredentials: "Clinical Director · 20+ Years in Life Coaching & Transformation Psychology",
        q1Options: [
            { value: "educator", label: "Teacher, professor, or education professional", icon: "📚" },
            { value: "corporate", label: "Corporate professional, manager, or HR", icon: "💼" },
            { value: "wellness", label: "Wellness coach, counselor, or therapist", icon: "🧘" },
            { value: "transition", label: "Career transition — people always come to me for advice", icon: "🦋" },
            { value: "other", label: "Other — I'm a natural helper and advice-giver", icon: "💬" },
        ],
        q2Title: "Q2 — Why Life Coaching",
        q2Subtitle: "What's drawing you toward life coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help professionals navigate transitions and find purpose", icon: "🎯" },
            { value: "own-journey", label: "I'm passionate about coaching women through confidence and self-worth", icon: "🌱" },
            { value: "burnout", label: "I want to specialize in relationship coaching and communication", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, purpose-driven work built around my life", icon: "⏰" },
            { value: "new-chapter", label: "I'm exploring life coaching as a second act career", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT stepping into your coaching calling, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "suppressing-gifts", label: "Not using my natural gift for helping people work through challenges", icon: "🙈" },
            { value: "exhausted", label: "Drained by work that doesn't use my people skills", icon: "😰" },
            { value: "watching-others", label: "Everyone already comes to me for advice — but I'm not getting paid", icon: "👀" },
            { value: "feeling-stuck", label: "Knowing I have the gift but not the framework or credential", icon: "🤷" },
            { value: "lost-myself", label: "Losing touch with my own sense of purpose and direction", icon: "🪞" },
            { value: "health-suffering", label: "My energy and motivation are fading in my current path", icon: "💔" },
        ],
        q3Testimonials: {
            "suppressing-gifts": { quote: "Everyone from students to parents came to me for 'the talk.' I finally made it official.", name: "Keisha, 38", location: "Maryland" },
            "exhausted": { quote: "12 years of teaching drained me. Coaching filled me back up with purpose.", name: "Tammy, 42", location: "Georgia" },
            "watching-others": { quote: "I was everyone's unpaid therapist. Now I'm a paid, certified life coach.", name: "Monica, 45", location: "Texas" },
            "feeling-stuck": { quote: "I had the empathy but not the method. The S.H.I.F.T. Method was the missing piece.", name: "Jasmine, 36", location: "California" },
            "lost-myself": { quote: "I had forgotten what excited me. Coaching reminded me.", name: "Diana, 48", location: "Florida" },
            "health-suffering": { quote: "My corporate stress was killing me. Coaching gave me both health and purpose.", name: "Sarah, 41", location: "New York" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure how coaching differs from therapy or counseling", icon: "🤔" },
            { value: "tried-before", label: "I've thought about coaching for years but never started", icon: "😞" },
            { value: "self-doubt", label: "Wondering if people will actually pay me to coach them", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to start coaching", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a coaching practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full life coaching practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving coaching business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the life coaching fundamentals.\n\nFor women who want to become certified life coaches — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified as a life coach, working from home, helping people close the gap between where they are and where they want to be.\nIf everything I share feels right, are you ready to start?",
    },
    "nurse-coach": {
        sarahCredentials: "Clinical Director · 20+ Years in Nurse Coaching & Holistic Patient Care",
        q1Options: [
            { value: "rn", label: "Registered Nurse (RN, BSN, MSN)", icon: "🩺" },
            { value: "lpn", label: "Licensed Practical Nurse (LPN/LVN)", icon: "💉" },
            { value: "np-pa", label: "Nurse Practitioner or Physician Assistant", icon: "🏥" },
            { value: "clinical", label: "Other clinical healthcare professional", icon: "🧬" },
            { value: "other", label: "Non-clinical — passionate about nurse coaching", icon: "💛" },
        ],
        q2Title: "Q2 — Why Nurse Coaching",
        q2Subtitle: "What's drawing you toward nurse coaching?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to use my nursing skills to truly transform patient outcomes", icon: "❤️" },
            { value: "own-journey", label: "I've seen the limits of bedside care and want to do more", icon: "🌱" },
            { value: "burnout", label: "I'm burned out from bedside nursing and need a new path", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, remote work that still uses my clinical skills", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready for a post-bedside career that still helps people heal", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about staying in your current role, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "missing-family", label: "Missing family time because of 12-hour shifts and holidays", icon: "🙈" },
            { value: "exhausted", label: "Coming home so exhausted I have nothing left for my own family", icon: "😰" },
            { value: "working-holidays", label: "Working nights, weekends, and holidays year after year", icon: "📅" },
            { value: "feeling-stuck", label: "Feeling like a cog in a broken healthcare machine", icon: "🤷" },
            { value: "lost-myself", label: "Losing the compassion that brought me to nursing", icon: "🪞" },
            { value: "health-suffering", label: "My own body is breaking down from the physical demands", icon: "💔" },
        ],
        q3Testimonials: {
            "missing-family": { quote: "I missed my son's first steps because I was on night shift. Never again.", name: "Maria, 46", location: "Texas" },
            "exhausted": { quote: "14 years of ER nursing broke me. Coaching rebuilt me — and I earn more.", name: "Christine, 49", location: "Michigan" },
            "working-holidays": { quote: "I worked Christmas for 11 years straight. Last year I was home. Coaching did that.", name: "Jennifer, 51", location: "North Carolina" },
            "feeling-stuck": { quote: "The system wouldn't let me spend more than 5 minutes per patient. Coaching does.", name: "Linda, 54", location: "Arizona" },
            "lost-myself": { quote: "I became a nurse to help people. Nurse coaching let me do that again — my way.", name: "Susan, 48", location: "California" },
            "health-suffering": { quote: "My back, my knees, my sleep — all wrecked from bedside. Coaching saved my body and my career.", name: "Donna, 50", location: "Pennsylvania" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure what nurse coaching actually looks like day-to-day", icon: "🤔" },
            { value: "tried-before", label: "I've thought about leaving bedside but never found the right path", icon: "😞" },
            { value: "self-doubt", label: "Wondering if my clinical skills translate to coaching", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment while supporting a family", icon: "💰" },
            { value: "ready", label: "Nothing specific — I know it's time to transition", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a nurse coaching practice per diem ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Replacing my nursing income with coaching ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Building a thriving nurse coaching business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the nurse coaching fundamentals.\n\nFor nurses who want to transition to coaching — earning $5–10K+ without bedside shifts — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified as a nurse coach, working from home, helping patients heal while your own body recovers from years of bedside.\nIf everything I share feels right, are you ready to start?",
    },
    "pet-nutrition": {
        sarahCredentials: "Clinical Director · 20+ Years in Animal Nutrition & Holistic Pet Wellness",
        q1Options: [
            { value: "vet", label: "Veterinarian, vet tech, or animal health professional", icon: "🐾" },
            { value: "pet-pro", label: "Dog trainer, groomer, or pet industry professional", icon: "🐕" },
            { value: "pet-parent", label: "Passionate pet parent with nutrition knowledge", icon: "❤️" },
            { value: "transition", label: "Career transition — love animals and want to help them", icon: "🦋" },
            { value: "other", label: "Other — drawn to holistic pet wellness", icon: "🌿" },
        ],
        q2Title: "Q2 — Why Pet Nutrition",
        q2Subtitle: "What's drawing you toward pet nutrition?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help pets live healthier, longer lives through proper nutrition", icon: "🐾" },
            { value: "own-journey", label: "I transformed my own pet's health through nutrition and want to help others", icon: "🌱" },
            { value: "burnout", label: "I'm frustrated by pet food industry misinformation", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, fulfilling work in the pet industry", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to turn my passion for animal wellness into a career", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT pursuing this path, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "watching-struggle", label: "Watching pet owners feed their animals food that's making them sick", icon: "😰" },
            { value: "exhausted", label: "Drained by work that keeps me away from my passion for animals", icon: "💔" },
            { value: "feeling-stuck", label: "Having the knowledge but no credential to advise professionally", icon: "🤷" },
            { value: "watching-others", label: "Seeing pet nutrition consultants build thriving practices", icon: "👀" },
            { value: "lost-myself", label: "Losing connection with what makes me happiest — helping animals", icon: "🪞" },
            { value: "health-suffering", label: "My own wellbeing suffers when I can't do what I love", icon: "💔" },
        ],
        q3Testimonials: {
            "watching-struggle": { quote: "I was a vet tech watching dogs eat garbage kibble. Now I fix their diets and save their lives.", name: "Brianna, 34", location: "Oregon" },
            "exhausted": { quote: "I left corporate to follow my passion. Best decision I ever made for me and for pets.", name: "Taylor, 40", location: "Colorado" },
            "feeling-stuck": { quote: "Everyone asked me what to feed their pets. Now I have the credential to answer professionally.", name: "Morgan, 37", location: "Washington" },
            "watching-others": { quote: "A friend started a pet nutrition practice earning $4K/month part-time. I had to join.", name: "Chelsea, 32", location: "California" },
            "lost-myself": { quote: "My desk job was soul-crushing. Working with animals every day brought me back to life.", name: "Allison, 43", location: "Texas" },
            "health-suffering": { quote: "My stress was through the roof until I found work that actually mattered to me.", name: "Stephanie, 38", location: "Florida" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure if pet nutrition consulting is a real career", icon: "🤔" },
            { value: "tried-before", label: "I've studied pet nutrition but never turned it into a business", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I need a veterinary degree", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I'm ready to help pets", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a pet nutrition practice part-time ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full pet nutrition consulting practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving pet wellness brand ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the pet nutrition fundamentals.\n\nFor animal lovers who want to become certified pet nutrition consultants — earning $3–8K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in pet nutrition, helping pet owners feed their animals properly, building a practice you absolutely love.\nIf everything I share feels right, are you ready to start?",
    },
    "womens-hormone-health": {
        sarahCredentials: "Clinical Director · 20+ Years in Women's Health & Hormonal Wellness",
        q1Options: [
            { value: "healthcare", label: "Healthcare professional (RN, NP, midwife)", icon: "🩺" },
            { value: "wellness", label: "Wellness coach, doula, or women's health advocate", icon: "🧘" },
            { value: "personal", label: "Personal menopause/hormone journey — want to help others", icon: "🌸" },
            { value: "transition", label: "Career transition into women's hormonal wellness", icon: "🦋" },
            { value: "other", label: "Other — passionate about women's health", icon: "💜" },
        ],
        q2Title: "Q2 — Why Women's Hormone Health",
        q2Subtitle: "What's drawing you toward women's hormonal wellness?\nBe honest — it helps me understand if we're right for each other.",
        q2Options: [
            { value: "help-heal", label: "I want to help women navigate perimenopause and menopause with confidence", icon: "🌺" },
            { value: "own-journey", label: "My own hormone journey inspired me to help others", icon: "🌱" },
            { value: "burnout", label: "I'm frustrated watching women suffer with hormones in silence", icon: "🔥" },
            { value: "flexibility", label: "I want flexible, meaningful work focused on women's health", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready to champion women's hormonal wellness professionally", icon: "✨" },
        ],
        q3Title: "Q3 — What This Has Been Costing You",
        q3Subtitle: "When you think about NOT stepping into this work, what's it really costing you?\nThis one matters. Take a moment.",
        q3Options: [
            { value: "watching-struggle", label: "Watching women suffer through menopause thinking it's 'just aging'", icon: "😰" },
            { value: "exhausted", label: "Drained by work that doesn't let me support women properly", icon: "💔" },
            { value: "feeling-stuck", label: "Having the empathy and knowledge but no framework to help", icon: "🤷" },
            { value: "watching-others", label: "Seeing menopause coaches thrive while I stay on the sidelines", icon: "👀" },
            { value: "lost-myself", label: "Losing my own hormonal balance in stressful, unfulfilling work", icon: "🪞" },
            { value: "health-suffering", label: "My own body is changing and I want to understand AND help others", icon: "💔" },
        ],
        q3Testimonials: {
            "watching-struggle": { quote: "My mother suffered through menopause alone. I won't let that happen to another woman.", name: "Catherine, 47", location: "Virginia" },
            "exhausted": { quote: "As a nurse in women's health, I had 5 minutes per patient. Coaching gives me an hour.", name: "Diane, 51", location: "Ohio" },
            "feeling-stuck": { quote: "I knew more about hormones than most doctors, but had no credential. The B.L.O.O.M. Method changed that.", name: "Barbara, 49", location: "California" },
            "watching-others": { quote: "A colleague became a menopause coach and has a waiting list. I signed up the next day.", name: "Janet, 44", location: "Texas" },
            "lost-myself": { quote: "I was going through perimenopause myself and nobody helped ME. Now I help every woman I meet.", name: "Nancy, 52", location: "Florida" },
            "health-suffering": { quote: "My own hot flashes and mood swings were the push I needed. Now I coach through them.", name: "Pamela, 48", location: "Illinois" },
        },
        q4Options: [
            { value: "unsure-where", label: "Not sure how hormone coaching works alongside doctors", icon: "🤔" },
            { value: "tried-before", label: "I've researched menopause extensively but never formalized it", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I need a clinical background first", icon: "💭" },
            { value: "investment-concern", label: "Concerned about the investment", icon: "💰" },
            { value: "ready", label: "Nothing holding me back — I'm ready to help women", icon: "✅" },
        ],
        q5Options: [
            { value: "side-income", label: "Starting a menopause coaching practice ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Building a full women's hormone health practice ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a thriving women's wellness business ($10K+/month)", icon: "🚀" },
        ],
        q7Subtitle: "The Foundation Diploma gives you the women's hormone health fundamentals.\n\nFor women who want to become certified hormone wellness practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        q8Subtitle: "Imagine 8 weeks from now — certified in women's hormone health, working from home, guiding women through menopause with confidence and compassion.\nIf everything I share feels right, are you ready to start?",
    },
};

// Brand colors - Premium professional palette
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdfbf7",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    goldBorder: "linear-gradient(135deg, #d4af37, #f7e7a0, #d4af37, #b8860b)",
    // Professional medical palette
    navy: "#1e3a5f",
    navyLight: "#2d4a6f",
    teal: "#0d6e6e",
    tealLight: "#0f8585",
    goldSubtle: "#f8f4e8",
};

// Testimonials matched to Q3 (workCost) answers
const COST_TESTIMONIALS: Record<string, { quote: string; name: string; location: string }> = {
    "missing-family": {
        quote: "I missed my son's first steps because I was on shift. That was the moment I knew something had to change.",
        name: "Maria, 52",
        location: "Texas"
    },
    "exhausted": {
        quote: "I came home every night with nothing left to give. My kids got the worst of me. Not anymore.",
        name: "Christine, 49",
        location: "Michigan"
    },
    "working-holidays": {
        quote: "I worked Christmas for 11 years straight. Last year I was home. That's what this gave me.",
        name: "Jennifer, 51",
        location: "North Carolina"
    },
    "feeling-stuck": {
        quote: "I kept waiting for the 'right time.' Turns out the right time was when I finally decided I deserved more.",
        name: "Linda, 54",
        location: "Arizona"
    },
    "lost-myself": {
        quote: "I didn't recognize myself anymore. This helped me find her again.",
        name: "Susan, 48",
        location: "California"
    },
    "health-suffering": {
        quote: "My body was telling me to stop. I finally listened.",
        name: "Donna, 50",
        location: "Pennsylvania"
    },
};

// Questions data — base (FM default), overridden per niche at runtime
function getQuestions(niche?: string) {
    const overrides = niche ? NICHE_OVERRIDES[niche] : undefined;
    return [
        // INTRO
        {
            id: "intro",
            type: "intro",
            step: 1,
        },
        // Q1 - Background (niche-customized)
        {
            id: "background",
            type: "radio",
            step: 2,
            field: "background",
            title: "Q1 — Your Background",
            subtitle: "Tell me a little about where you're coming from.\nThere's no \"right\" answer — I just want to understand your starting point.",
            options: overrides?.q1Options ?? [
                { value: "healthcare", label: "Healthcare professional (RN, LPN, NP, therapist)", icon: "🩺" },
                { value: "wellness", label: "Wellness practitioner or coach", icon: "🧘" },
                { value: "educator", label: "Educator or support professional", icon: "📚" },
                { value: "transition", label: "Career transition or returning to work", icon: "🦋" },
                { value: "other", label: "Other professional background", icon: "💼" },
            ],
        },
        // Q2 - Motivation (niche-customized)
        {
            id: "motivation",
            type: "radio",
            step: 3,
            field: "motivation",
            title: overrides?.q2Title ?? "Q2 — Why Functional Medicine",
            subtitle: overrides?.q2Subtitle ?? "What's drawing you toward this work?\nBe honest — it helps me understand if we're right for each other.",
            options: overrides?.q2Options ?? [
                { value: "help-heal", label: "I want to help people heal in ways traditional medicine can't", icon: "💚" },
                { value: "own-journey", label: "I've been through my own health journey and want to help others", icon: "🌱" },
                { value: "burnout", label: "I'm burned out and need more meaningful work", icon: "🔥" },
                { value: "flexibility", label: "I want flexible work I can build around my life", icon: "⏰" },
                { value: "new-chapter", label: "I'm ready for a new chapter and this feels right", icon: "✨" },
            ],
        },
        // Q3 - Work Costs (with testimonial, niche-customized)
        {
            id: "workCost",
            type: "radio-testimonial",
            step: 4,
            field: "workCost",
            title: overrides?.q3Title ?? "Q3 — What This Has Been Costing You",
            subtitle: overrides?.q3Subtitle ?? "When you think about staying where you are, what's it really costing you?\nThis one matters. Take a moment.",
            options: overrides?.q3Options ?? [
                { value: "missing-family", label: "Missing time with my kids or family", icon: "👨‍👩‍👧" },
                { value: "exhausted", label: "Being too exhausted to show up for the people I love", icon: "😰" },
                { value: "working-holidays", label: "Working nights, weekends, or holidays while life passes by", icon: "📅" },
                { value: "feeling-stuck", label: "Feeling stuck without knowing what the next chapter looks like", icon: "🤷" },
                { value: "lost-myself", label: "Losing touch with who I used to be", icon: "🪞" },
                { value: "health-suffering", label: "My health or wellbeing is suffering", icon: "💔" },
            ],
        },
        // Q4 - Holding Back (niche-customized)
        {
            id: "holdingBack",
            type: "radio",
            step: 5,
            field: "holdingBack",
            title: "Q4 — What's Been in the Way",
            subtitle: "What's stopped you from making a move until now?\nWhatever it is — you're not alone.",
            options: overrides?.q4Options ?? [
                { value: "unsure-where", label: "Unsure where to start or what's legitimate", icon: "🤔" },
                { value: "tried-before", label: "I've tried programs before that didn't deliver", icon: "😞" },
                { value: "self-doubt", label: "Wondering if I have what it takes", icon: "💭" },
                { value: "investment-concern", label: "Concerned about making the wrong investment", icon: "💰" },
                { value: "ready", label: "Nothing specific — I feel ready to move forward", icon: "✅" },
            ],
        },
        // Q5 - Success Goal (niche-customized)
        {
            id: "successGoal",
            type: "radio",
            step: 6,
            field: "successGoal",
            title: "Q5 — Where You Want to Take This",
            subtitle: "If we work together and it works out, what does success look like for you?\nDream a little. I want to know what you're building toward.",
            options: overrides?.q5Options ?? [
                { value: "side-income", label: "Building something meaningful on the side ($3–5K/month)", icon: "🌱" },
                { value: "replace-income", label: "Replacing my income over time ($5–10K/month)", icon: "📈" },
                { value: "full-practice", label: "Creating a full, sustainable practice ($10K+/month)", icon: "🚀" },
            ],
        },
        // Q6 - Time Available
        {
            id: "timeAvailable",
            type: "radio",
            step: 7,
            field: "timeAvailable",
            title: "Q6 — Time You Can Give This",
            subtitle: "How much time could you realistically dedicate each week?\nBe honest with yourself — I'd rather know now so I can guide you properly.",
            options: [
                { value: "few-hours", label: "⏰ A few hours, fitting it around life", icon: "" },
                { value: "part-time", label: "📅 Part-time focus (10–15 hours/week)", icon: "" },
                { value: "priority", label: "💪 Ready to make this a real priority", icon: "" },
            ],
        },
        // Q7 - Investment Range (niche-customized subtitle)
        {
            id: "investmentRange",
            type: "radio",
            step: 8,
            field: "investmentRange",
            title: "Q7 — Investment Readiness",
            subtitle: overrides?.q7Subtitle ?? "The Foundation Diploma is your starting point — it gives you the fundamentals.\n\nFor women who want to become certified practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
            options: overrides?.q7Options ?? [
                { value: "1k-3k", label: "$1,000 – $3,000 — Structured guidance with steady progress", icon: "📘" },
                { value: "3k-5k", label: "$3,000 – $5,000 — Comprehensive support for serious commitment", icon: "📗" },
                { value: "5k-plus", label: "$5,000+ — Full investment in building a sustainable practice", icon: "📕" },
            ],
            footer: "This isn't a commitment — it helps me understand what guidance is most relevant for you.",
        },
        // Q8 - Readiness (niche-customized subtitle)
        {
            id: "readiness",
            type: "radio",
            step: 9,
            field: "readiness",
            title: "Q8 — Last One",
            subtitle: overrides?.q8Subtitle ?? "Imagine 8 weeks from now — certified, working from home, present for the moments that matter.\nIf everything I share feels right, are you ready to start?",
            options: [
                { value: "ready", label: "✅ Yes — I'm ready to do this for myself (and my family)", icon: "" },
                { value: "need-time", label: "🤔 I'll need a little time to think", icon: "" },
                { value: "talk-partner", label: "👫 I'd want to talk it over with my partner first", icon: "" },
            ],
        },
        // CONTACT FORM
        {
            id: "contact",
            type: "contact",
            step: 10,
            title: "Almost There!",
            subtitle: "You're almost there, {name}! 💕\nWhere should I send your results?",
        },
    ];
}

export function SarahApplicationForm({ onSubmit, onAccepted, isSubmitting, isVerifying, niche }: SarahApplicationFormProps) {
    const QUESTIONS = getQuestions(niche);
    const nicheOverrides = niche ? NICHE_OVERRIDES[niche] : undefined;
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<SarahApplicationData>>({});
    const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
    const [applicationState, setApplicationState] = useState<"form" | "reviewing" | "accepted">("form");
    const [reviewPhase, setReviewPhase] = useState(0); // For animated review messages

    const totalSteps = QUESTIONS.length;
    const currentQuestion = QUESTIONS[step - 1];
    const progress = applicationState === "form" ? (step / totalSteps) * 100 : 100;

    const handleOptionSelect = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Show testimonial if Q3
        if (field === "workCost") {
            setSelectedTestimonial(value);
        }
    }, []);

    const handleNext = useCallback(() => {
        if (step < totalSteps) {
            setStep(step + 1);
            setSelectedTestimonial(null);
        }
    }, [step, totalSteps]);

    const handleBack = useCallback(() => {
        if (step > 1) {
            setStep(step - 1);
            setSelectedTestimonial(null);
        }
    }, [step]);

    const handleSubmit = async () => {
        await onSubmit(formData as SarahApplicationData);
        // Parent will handle redirect to portal (which shows welcome/review screen)
    };

    // Review messages
    const reviewMessages = [
        "Reading your application...",
        "Checking your background...",
        "Reviewing your goals...",
        "Making my decision..."
    ];

    const renderReviewing = () => (
        <motion.div
            key="reviewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
        >
            <div className="mb-8">
                <Image
                    src="/coach-sarah.webp"
                    alt="Sarah"
                    width={100}
                    height={100}
                    className="rounded-full mx-auto border-4 shadow-lg animate-pulse"
                    style={{ borderColor: BRAND.gold }}
                />
            </div>

            <div className="mb-6">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: BRAND.burgundy }} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    One moment, {formData.firstName}...
                </h3>
                <motion.p
                    key={reviewPhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-600"
                >
                    {reviewMessages[reviewPhase]}
                </motion.p>
            </div>

            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                I personally review every application to make sure we're a fit.
            </p>
        </motion.div>
    );

    const renderAccepted = () => (
        <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
        >
            {/* Celebration animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-6"
            >
                <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}>
                    <Check className="w-10 h-10 text-white" />
                </div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-black text-gray-900 mb-3"
            >
                🎉 Congratulations, {formData.firstName}!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-medium mb-6"
                style={{ color: BRAND.burgundy }}
            >
                AccrediPro Institute just accepted your application.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 max-w-md mx-auto text-left"
            >
                <p className="text-gray-700 italic mb-4">
                    "{formData.firstName}, based on your background and goals, I can already tell you're exactly the kind of woman I love working with. You're going to do amazing things."
                </p>
                <div className="flex items-center gap-3">
                    <Image
                        src="/coach-sarah.webp"
                        alt="Sarah"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-medium text-gray-900">Sarah Mitchell</p>
                        <p className="text-xs text-gray-500">Founder, AccrediPro Institute</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
            >
                <Button
                    onClick={onAccepted}
                    className="w-full h-14 text-lg font-bold"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Your First Lesson
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-gray-500">
                    ✨ Your spot is reserved for <span className="font-bold">48 hours</span>
                </p>
            </motion.div>
        </motion.div>
    );

    const renderIntro = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
        >
            <div className="mb-6">
                <Image
                    src="/coach-sarah.webp"
                    alt="Sarah"
                    width={80}
                    height={80}
                    className="rounded-full mx-auto border-3 shadow-lg"
                    style={{ borderColor: BRAND.gold }}
                />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hi{formData.firstName ? ` ${formData.firstName}` : ""}, it's Sarah.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
                I personally review every application to make sure AccrediPro Institute is the right fit — for you and for us.
                Not everyone is accepted, and that's intentional.
            </p>
            <p className="text-gray-500 text-sm mb-8">
                Just a few honest questions. Takes about 90 seconds.
            </p>
            <Button
                onClick={handleNext}
                className="h-14 px-10 text-lg font-bold"
                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
                Let's Begin
                <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
        </motion.div>
    );

    const renderRadio = (showTestimonial = false) => {
        const q = currentQuestion as any;
        const isSelected = (value: string) => formData[q.field as keyof SarahApplicationData] === value;
        return (
            <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="py-4"
            >
                {/* Premium Question Header */}
                <div className="mb-6">
                    <h3
                        className="text-2xl font-black mb-2"
                        style={{
                            background: BRAND.goldMetallic,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        {q.title}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{q.subtitle}</p>
                </div>

                <div className="space-y-3 mb-6">
                    {q.options?.map((opt: any) => (
                        <button
                            key={opt.value}
                            onClick={() => handleOptionSelect(q.field, opt.value)}
                            className={cn(
                                "w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 relative",
                                isSelected(opt.value)
                                    ? "bg-gradient-to-r from-[#722f37]/10 to-[#d4af37]/10 shadow-lg"
                                    : "bg-white hover:bg-gray-50"
                            )}
                            style={{
                                border: isSelected(opt.value)
                                    ? "2px solid transparent"
                                    : "2px solid #e5e7eb",
                                backgroundImage: isSelected(opt.value)
                                    ? `linear-gradient(white, white), ${BRAND.goldBorder}`
                                    : undefined,
                                backgroundOrigin: "border-box",
                                backgroundClip: isSelected(opt.value) ? "padding-box, border-box" : undefined,
                            }}
                        >
                            {opt.icon && <span className="text-xl">{opt.icon}</span>}
                            <span className={cn(
                                "font-medium",
                                isSelected(opt.value) ? "text-[#722f37]" : "text-gray-800"
                            )}>{opt.label}</span>
                            {isSelected(opt.value) && (
                                <div
                                    className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ background: BRAND.goldMetallic }}
                                >
                                    <Check className="w-4 h-4" style={{ color: BRAND.burgundyDark }} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Testimonial for Q3 */}
                {showTestimonial && selectedTestimonial && (() => {
                    const testimonials = nicheOverrides?.q3Testimonials ?? COST_TESTIMONIALS;
                    const t = testimonials[selectedTestimonial];
                    return t ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6"
                        >
                            <p className="text-gray-700 italic mb-2">
                                &quot;{t.quote}&quot;
                            </p>
                            <p className="text-sm text-gray-500">
                                — {t.name}, {t.location}
                            </p>
                        </motion.div>
                    ) : null;
                })()}

                {q.footer && (
                    <p className="text-xs text-gray-500 mb-6">{q.footer}</p>
                )}

                <div className="flex gap-3">
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} className="h-12 px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                        disabled={!formData[q.field as keyof SarahApplicationData]}
                        className="flex-1 h-12 font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Continue
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </motion.div>
        );
    };

    const renderContact = () => (
        <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-4"
        >
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                    <Sparkles className="w-4 h-4" />
                    Almost There!
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    You're almost there, {formData.firstName || "friend"}! 💕
                </h3>
                <p className="text-gray-600 text-sm mt-2">Where should I send your results?</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">First Name *</label>
                        <Input
                            value={formData.firstName || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="First"
                            className="h-12"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                        <Input
                            value={formData.lastName || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Last"
                            className="h-12"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                    <Input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="h-12"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (For access link + support) *</label>
                    <div className="flex">
                        <div className="flex items-center gap-1.5 px-3 h-12 bg-gray-100 border border-r-0 border-gray-200 rounded-l-md text-sm font-medium text-gray-700">
                            <span>🇺🇸</span>
                            <span>+1</span>
                        </div>
                        <Input
                            type="tel"
                            value={formData.phone || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(555) 123-4567"
                            className="h-12 rounded-l-none"
                        />
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6 mb-6">
                I personally read every single application. This goes directly to me — not a bot, not a VA. Just me, with a cup of tea, genuinely wanting to know if we're a fit. 💕
            </p>

            <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="h-12 px-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!formData.firstName || !formData.email || !formData.phone || isSubmitting || isVerifying}
                    className="flex-1 h-14 font-bold text-lg"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                            Verifying...
                        </>
                    ) : isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                            Creating Access...
                        </>
                    ) : (
                        <>
                            See If I Qualify
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );

    // Step progress for question steps (not intro or contact)
    const questionStep = currentQuestion.type === "intro" ? 0 :
        currentQuestion.type === "contact" ? 8 :
            (currentQuestion.step || step) - 1;
    const totalQuestionSteps = 8;
    const showStepProgress = applicationState === "form" && currentQuestion.type !== "intro";

    return (
        <div
            className="rounded-2xl shadow-2xl overflow-hidden"
            style={{
                background: "white",
                border: "3px solid transparent",
                backgroundImage: `linear-gradient(white, white), ${BRAND.goldBorder}`,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
            }}
        >
            {/* ═══════════════════════════════════════════════════════════════
                AUTHORITY HEADER — Logo + ASI Badge + Sarah Credentials
            ═══════════════════════════════════════════════════════════════ */}
            <div className="px-4 md:px-6 pt-4 pb-3" style={{ background: BRAND.goldSubtle, borderBottom: `1px solid ${BRAND.gold}30` }}>
                {/* Top Row: Logo + ASI Badge */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/ASI_LOGO-removebg-preview.png"
                            alt="AccrediPro Institute"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="font-bold text-sm" style={{ color: BRAND.burgundy }}>AccrediPro Institute</span>
                    </div>
                    {/* ASI Accreditation Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                            background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyLight})`,
                            color: "white"
                        }}
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4" />
                            <path d="M12 2L3 7v7c0 5.25 3.75 10.74 9 12 5.25-1.26 9-6.75 9-12V7l-9-5z" />
                        </svg>
                        ASI Accredited
                    </div>
                </div>

                {/* Sarah Credentials Row */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/coach-sarah.webp"
                        alt="Sarah Mitchell"
                        width={44}
                        height={44}
                        className="rounded-full shadow-md flex-shrink-0"
                        style={{ border: `2px solid ${BRAND.gold}` }}
                    />
                    <div>
                        <p className="font-semibold text-sm" style={{ color: BRAND.burgundy }}>Sarah Mitchell</p>
                        <p className="text-xs text-gray-500">{nicheOverrides?.sarahCredentials ?? "Clinical Director · 20+ Years in Functional Medicine"}</p>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STEP PROGRESS — Reduces anxiety, shows commitment
            ═══════════════════════════════════════════════════════════════ */}
            {showStepProgress && (
                <div className="px-4 md:px-6 py-3" style={{ background: "linear-gradient(to right, #fafafa, #f5f5f5)" }}>
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-medium text-gray-600">
                            Step {Math.min(questionStep, totalQuestionSteps)} of {totalQuestionSteps}
                        </span>
                        <span className="text-gray-400">
                            {questionStep >= totalQuestionSteps ? "Final step!" : "Almost there — just a few more questions"}
                        </span>
                    </div>
                    {/* Dot Progress Indicator */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalQuestionSteps }).map((_, i) => (
                            <div
                                key={i}
                                className="h-2 flex-1 rounded-full transition-all duration-300"
                                style={{
                                    background: i < questionStep ? BRAND.goldMetallic :
                                        i === questionStep - 1 ? BRAND.gold : "#e5e7eb"
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                SOCIAL PROOF — Subtle, not salesy
            ═══════════════════════════════════════════════════════════════ */}
            {applicationState === "form" && step === 1 && (
                <div className="px-4 md:px-6 py-2 text-center" style={{ background: "#fefefe", borderBottom: "1px solid #f0f0f0" }}>
                    <p className="text-xs text-gray-500">
                        <span className="text-amber-600">★★★★★</span>
                        {" "}4.9 on Trustpilot · <span className="font-medium text-gray-700">2,400+ women</span> have transformed their careers
                    </p>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MAIN CONTENT AREA
            ═══════════════════════════════════════════════════════════════ */}
            <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {applicationState === "reviewing" && renderReviewing()}
                    {applicationState === "accepted" && renderAccepted()}
                    {applicationState === "form" && currentQuestion.type === "intro" && renderIntro()}
                    {applicationState === "form" && currentQuestion.type === "radio" && renderRadio(false)}
                    {applicationState === "form" && currentQuestion.type === "radio-testimonial" && renderRadio(true)}
                    {applicationState === "form" && currentQuestion.type === "contact" && renderContact()}
                </AnimatePresence>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                TRUST FOOTER — Security + Legitimacy
            ═══════════════════════════════════════════════════════════════ */}
            <div className="px-4 md:px-6 py-4" style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0" }}>
                {/* Security Message */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
                    <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>Your information is secure and never shared</span>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mb-3">
                    {/* ASI Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white">
                        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L3 7v7c0 5.25 3.75 10.74 9 12 5.25-1.26 9-6.75 9-12V7l-9-5z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-[10px] font-medium text-gray-600">ASI</span>
                    </div>
                    {/* SSL Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white">
                        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <circle cx="12" cy="16" r="1" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <span className="text-[10px] font-medium text-gray-600">SSL</span>
                    </div>
                    {/* Trustpilot */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white">
                        <span className="text-[10px] text-amber-500">★</span>
                        <span className="text-[10px] font-medium text-gray-600">4.9</span>
                    </div>
                </div>

                {/* Company Details */}
                <p className="text-center text-[10px] text-gray-400">
                    AccrediPro Institute · Tampa, FL · Est. 2019
                </p>
            </div>
        </div>
    );
}
