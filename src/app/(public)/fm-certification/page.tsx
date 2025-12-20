"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    GraduationCap, CheckCircle2, Clock, Users, Award,
    Shield, MessageCircle, BookOpen, ArrowRight,
    ChevronDown, ChevronUp, Star, Heart, Zap,
    TrendingUp, Target, Play, Sparkles, X,
    HeartHandshake, Laptop, Quote, Calendar,
    Brain, Flame, Activity, Leaf, Sun, Moon, Dumbbell,
    Stethoscope, LayoutDashboard, Video, AlertCircle, Timer,
    Gift, Infinity, DollarSign, Lock, BadgeCheck, Globe2, Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Verified working student profile images from accredipro.academy
const ALL_STUDENT_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1131.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1136.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_4848-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1168.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_0607.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2733.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/dgp03315.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2615.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_0153.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Alternative-Health.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
];

// Verified testimonial avatars - unique headshots for each testimonial (12 total)
const TESTIMONIAL_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1131.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_7064.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3104.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6694.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2257.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/dgp03315.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2615.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_0153.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/FBCover.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Alternative-Health.jpg",
];

// Function to get random avatars
const getRandomAvatars = (count: number, exclude: number[] = []) => {
    const available = ALL_STUDENT_AVATARS.filter((_, i) => !exclude.includes(i));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Get random avatar index
const getRandomAvatarIndex = (exclude: number[] = []) => {
    const available = ALL_STUDENT_AVATARS.map((_, i) => i).filter(i => !exclude.includes(i));
    return available[Math.floor(Math.random() * available.length)];
};

// Complete curriculum with 21 modules (0-20) - with lesson titles and proprietary methods
const CURRICULUM_MODULES = [
    // Phase 0: Orientation (No certificate)
    {
        number: 0, title: "Welcome & Professional Orientation", certificate: null,
        lessons: ["Welcome to Your Certification Journey", "How to Navigate the Course Platform", "Meet Your Community & Mentors", "Setting Yourself Up for Success"],
        description: "Get oriented and ready for your transformation journey", icon: GraduationCap,
        method: null, phase: "Orientation"
    },
    // Phase 1: Core Foundations (Modules 1-4)
    {
        number: 1, title: "Functional Medicine Foundations", certificate: "Certified in FM Foundations",
        lessons: ["Introduction to Functional Medicine", "What Is Functional Medicine & Why It Matters", "Systems Biology and Root-Cause Thinking", "The Functional Medicine Timeline", "The Functional Medicine Matrix", "The Power of the Patient Story", "Conventional vs Functional Approach", "Case Studies: Seeing the Whole Picture"],
        description: "Master the core principles that set functional medicine apart", icon: BookOpen,
        method: "R.O.O.T.S.™ Framework", methodMeaning: "Recognize, Origin, Optimize, Transform, Sustain", phase: "Core Foundations"
    },
    {
        number: 2, title: "Health Coaching Mastery", certificate: "Certified Health Coach",
        lessons: ["The Art & Science of Health Coaching", "Building Therapeutic Rapport", "Motivational Interviewing Fundamentals", "Powerful Questioning Techniques", "Active Listening and Reflection", "Navigating Resistance & Barriers", "Creating Accountability Systems", "Facilitating Lasting Behavior Change"],
        description: "Communication skills that transform client outcomes", icon: MessageCircle,
        method: "C.O.A.C.H.™ Method", methodMeaning: "Connect, Outcomes, Accountability, Change, Hold", phase: "Core Foundations"
    },
    {
        number: 3, title: "Functional Assessment & Case Analysis", certificate: "Certified Clinical Assessor",
        lessons: ["The Comprehensive Health History", "Symptom Questionnaires & Scoring", "The 90-Minute Intake Session", "Timeline and Antecedents", "Identifying Triggers & Mediators", "Physical Signs & Observations", "Prioritizing Client Concerns", "Creating the Clinical Picture"],
        description: "Properly evaluate clients and understand root causes", icon: Stethoscope,
        method: null, phase: "Core Foundations"
    },
    {
        number: 4, title: "Ethics, Scope & Professional Practice", certificate: "Certified in Professional Ethics",
        lessons: ["Understanding Scope of Practice", "What Health Coaches Can & Cannot Do", "Legal Considerations by Region", "When to Refer to Medical Professionals", "Red Flags & Warning Signs", "Documentation & Record Keeping", "Professional Ethics & Boundaries", "Building Referral Networks"],
        description: "Protect yourself and clients with proper boundaries", icon: Shield,
        method: null, phase: "Core Foundations"
    },
    // Phase 2: Clinical Specializations (Modules 5-17)
    {
        number: 5, title: "Functional Nutrition", certificate: "Certified Functional Nutritionist",
        lessons: ["Foundations of Functional Nutrition", "The Elimination Diet Protocol", "Anti-Inflammatory Nutrition", "Blood Sugar Balance & Glycemic Control", "Therapeutic Diets Overview", "Nutrient Density & Food Quality", "Personalized Nutrition Strategies", "Meal Planning & Implementation", "Case Study: Nutrition Protocol Design"],
        description: "Use food as powerful medicine to transform lives", icon: Leaf, highlight: true,
        method: "F.U.E.L.™ Protocol", methodMeaning: "Foundations, Unique needs, Eliminate triggers, Layer therapeutics", phase: "Clinical Specializations"
    },
    {
        number: 6, title: "Gut Health & Microbiome", certificate: "Certified Gut Health Specialist",
        lessons: ["Digestive System Anatomy & Function", "The Microbiome & Its Impact", "Intestinal Permeability (Leaky Gut)", "SIBO: Small Intestinal Bacterial Overgrowth", "The 5R Gut Healing Protocol", "Gut-Brain Connection", "Digestive Support Strategies", "Gut Health Protocols", "Case Study: Gut Restoration"],
        description: "Where 80% of health issues begin — and healing happens", icon: Activity, highlight: true,
        method: "G.U.T.S.™ Protocol", methodMeaning: "Gather history, Uncover causes, Treat (5R), Sustain", phase: "Clinical Specializations"
    },
    {
        number: 7, title: "Stress, Adrenals & Nervous System", certificate: "Certified Stress & Adrenal Specialist",
        lessons: ["The Stress Response System", "HPA Axis Dysfunction", "Cortisol Patterns & Testing", "Adrenal Fatigue vs Adrenal Dysfunction", "Nervous System Regulation", "Vagus Nerve & Parasympathetic Tone", "Stress Resilience Building", "Adrenal Support Protocols", "Case Study: Stress Recovery"],
        description: "The stress connection most practitioners miss", icon: Brain,
        method: "C.A.L.M.™ Protocol", methodMeaning: "Cortisol, Adrenal assessment, Lifestyle, Mind-body", phase: "Clinical Specializations"
    },
    {
        number: 8, title: "Sleep & Circadian Health", certificate: "Certified Sleep & Circadian Specialist",
        lessons: ["Sleep Architecture & Stages", "Circadian Rhythm Biology", "Common Sleep Disorders", "Insomnia Assessment & Approaches", "Light Exposure & Melatonin", "Sleep Hygiene Optimization", "Sleep & Hormone Connections", "Sleep Improvement Protocols", "Case Study: Sleep Restoration"],
        description: "Master the foundation of all health and healing", icon: Moon,
        method: "R.E.S.T.™ Protocol", methodMeaning: "Rhythm, Environment, Support, Track", phase: "Clinical Specializations"
    },
    {
        number: 9, title: "Women's Hormone Health", certificate: "Certified Women's Hormone Specialist",
        lessons: ["Female Hormone Fundamentals", "The Menstrual Cycle Phases", "Estrogen Dominance", "Progesterone & Its Importance", "PMS & PMDD", "Cycle Syncing Strategies", "Hormone Testing for Women", "Women's Hormone Protocols", "Case Study: Hormone Balance"],
        description: "Support women's unique hormonal journeys", icon: Heart, highlight: true,
        method: "C.Y.C.L.E.™ Method", methodMeaning: "Cycle map, Your hormones, Correct, Lifestyle, Evaluate", phase: "Clinical Specializations"
    },
    {
        number: 10, title: "Perimenopause & Menopause", certificate: "Certified Menopause Specialist",
        lessons: ["Understanding Perimenopause", "The Menopause Transition", "Common Menopause Symptoms", "Hot Flashes & Night Sweats", "Bone Health & Osteoporosis Prevention", "HRT: Risks & Benefits", "Natural Approaches to Menopause", "Menopause Support Protocols", "Case Study: Menopause Transition"],
        description: "Guide women through life's most challenging transition", icon: Flame, highlight: true,
        method: "T.H.R.I.V.E.™ Protocol", methodMeaning: "Transition, Hormones, Restore, Implement, Vitality, Evolve", phase: "Clinical Specializations"
    },
    {
        number: 11, title: "Thyroid Health", certificate: "Certified Thyroid Health Specialist",
        lessons: ["Thyroid Anatomy & Function", "Thyroid Hormone Production & Conversion", "Hypothyroidism: Causes & Symptoms", "Hashimoto's Thyroiditis", "Comprehensive Thyroid Testing", "Functional vs Conventional Thyroid Ranges", "Thyroid & Other Systems", "Thyroid Support Protocols", "Case Study: Thyroid Optimization"],
        description: "Address the most underdiagnosed condition in healthcare", icon: Zap, highlight: true,
        method: "S.H.I.F.T.™ Protocol", methodMeaning: "Screen, Hidden triggers, Inflammation, Fix foundations, Track", phase: "Clinical Specializations"
    },
    {
        number: 12, title: "Metabolic Health & Weight", certificate: "Certified Weight Management Specialist",
        lessons: ["Metabolic Health Fundamentals", "Insulin Resistance & Sensitivity", "Metabolic Syndrome", "Weight Loss Resistance", "Leptin & Hunger Hormones", "Metabolic Flexibility", "Body Composition vs Scale Weight", "Metabolic Health Protocols", "Case Study: Metabolic Reset"],
        description: "Why traditional weight loss fails and what actually works", icon: Dumbbell,
        method: "B.U.R.N.™ Protocol", methodMeaning: "Baseline, Underlying drivers, Reset, Nourish", phase: "Clinical Specializations"
    },
    {
        number: 13, title: "Autoimmunity & Inflammation", certificate: "Certified Autoimmune Specialist",
        lessons: ["The Immune System Overview", "Autoimmune Disease Mechanisms", "Chronic Inflammation Pathways", "Common Autoimmune Conditions", "Triggers of Autoimmunity", "The Autoimmune-Gut Connection", "Anti-Inflammatory Strategies", "Autoimmune Support Protocols", "Case Study: Autoimmune Recovery"],
        description: "Cutting-edge knowledge most providers don't have", icon: Activity, highlight: true,
        method: "F.L.A.R.E.™ Protocol", methodMeaning: "Find triggers, Lower inflammation, Address gut, Restore tolerance, Evolve", phase: "Clinical Specializations"
    },
    {
        number: 14, title: "Mental Health & Brain Function", certificate: "Certified Brain Health Specialist",
        lessons: ["Brain Health Fundamentals", "Neurotransmitter Basics", "The Gut-Brain Axis", "Anxiety from a Functional Perspective", "Depression & Mood Support", "Cognitive Function & Brain Fog", "Neuroinflammation", "Brain Health Protocols", "Case Study: Mental Wellness"],
        description: "The gut-brain connection and mental wellness", icon: Brain,
        method: "M.I.N.D.™ Method", methodMeaning: "Map symptoms, Inflammation, Nutrients, Daily practices", phase: "Clinical Specializations"
    },
    {
        number: 15, title: "Cardiometabolic Health", certificate: "Certified Heart Health Specialist",
        lessons: ["Cardiovascular System Overview", "Understanding Lipid Panels", "Beyond LDL: Advanced Lipid Markers", "Blood Pressure Regulation", "Inflammation & Heart Disease", "Insulin Resistance & Cardiovascular Risk", "Heart-Healthy Nutrition", "Cardiometabolic Protocols", "Case Study: Heart Health"],
        description: "Life-saving knowledge to protect and heal hearts", icon: Heart,
        method: "H.E.A.R.T.™ Protocol", methodMeaning: "History, Evaluate markers, Address causes, Restore, Track", phase: "Clinical Specializations"
    },
    {
        number: 16, title: "Energy & Mitochondrial Health", certificate: "Certified Energy & Fatigue Specialist",
        lessons: ["Cellular Energy Production", "Mitochondrial Function", "Root Causes of Fatigue", "Chronic Fatigue Syndrome", "Nutrient Cofactors for Energy", "Oxidative Stress & Antioxidants", "Exercise & Mitochondrial Health", "Energy Optimization Protocols", "Case Study: Energy Restoration"],
        description: "Address the root causes of chronic fatigue", icon: Sun,
        method: "S.P.A.R.K.™ Protocol", methodMeaning: "Source drain, Power up, Address oxidation, Restore, Keep monitoring", phase: "Clinical Specializations"
    },
    {
        number: 17, title: "Detox & Environmental Health", certificate: "Certified Detox Specialist",
        lessons: ["Detoxification Fundamentals", "Phase 1 & Phase 2 Liver Detox", "Environmental Toxins & Exposures", "Heavy Metals & Testing", "Mold & Mycotoxins", "Reducing Toxic Load", "Supporting Detox Pathways", "Safe Detox Protocols", "Case Study: Detoxification"],
        description: "Reduce toxic burden in today's toxic world", icon: Leaf,
        method: "C.L.E.A.N.™ Protocol", methodMeaning: "Capacity, Lighten load, Enhance pathways, Add support, Nourish", phase: "Clinical Specializations"
    },
    // Phase 3: Advanced Application (Modules 18-19)
    {
        number: 18, title: "Functional Lab Interpretation", certificate: "Certified Lab Interpretation Specialist",
        lessons: ["Introduction to Lab Interpretation", "CBC: Complete Blood Count", "CMP: Comprehensive Metabolic Panel", "Lipid Panel Deep Dive", "Thyroid Panel Interpretation", "Hormone Testing", "Functional Ranges vs Conventional Ranges", "Creating Lab-Based Protocols"],
        description: "Read labs like a functional medicine expert", icon: Shield,
        method: "D.E.C.O.D.E.™ Method", methodMeaning: "Deep dive, Evaluate, Connect symptoms, Optimal ranges, Design intervention, Evaluate progress", phase: "Advanced Application"
    },
    {
        number: 19, title: "Protocol Building & Program Design", certificate: "Certified Protocol Designer",
        lessons: ["Principles of Protocol Design", "Prioritizing Interventions", "Supplement Recommendations Within Scope", "Creating Nutrition Protocols", "Lifestyle Intervention Design", "Program Structure & Phases", "Tracking Progress & Adjustments", "Protocol Templates & Examples"],
        description: "Put it ALL together into custom client protocols", icon: Target,
        method: "C.R.E.A.T.E.™ Method", methodMeaning: "Compile, Rank priorities, Establish timeline, Action steps, Track, Evolve", phase: "Advanced Application"
    },
    // Phase 4: Business & Career (Module 20)
    {
        number: 20, title: "Building Your Functional Medicine Practice", certificate: "Certified FM Practitioner (Complete)",
        lessons: ["Starting Your Practice", "Defining Your Niche", "Pricing Your Services", "Creating Packages & Programs", "Marketing Fundamentals", "Social Media & Content Strategy", "Discovery Calls & Enrollment", "Building a Sustainable Practice"],
        description: "Launch and grow your successful practice", icon: TrendingUp, highlight: true,
        method: "S.C.A.L.E.™ Method", methodMeaning: "Structure, Clients, Automation, Leverage, Expand", phase: "Business & Career"
    },
];

// Accreditation data
const ACCREDITATIONS = [
    { abbr: "CMA", name: "Complementary Medical Association", desc: "Global flagship, 106+ countries", year: "1993" },
    { abbr: "IPHM", name: "International Practitioners of Holistic Medicine", desc: "Executive Provider status, insurance eligibility", year: "" },
    { abbr: "CPD", name: "Continuing Professional Development", desc: "80+ CEU hours for recertification", year: "" },
    { abbr: "IAOTH", name: "International Association of Therapists", desc: "10,000+ practitioner network", year: "" },
    { abbr: "ICAHP", name: "Intl. Community for Alternative & Holistic Professionals", desc: "Evidence-based verification", year: "" },
    { abbr: "IGCT", name: "International Guild of Complementary Therapists", desc: "Prestige guild recognition", year: "" },
    { abbr: "CTAA", name: "Complementary Therapists Accredited Association", desc: "UK practice & NHS recognition", year: "" },
    { abbr: "IHTCP", name: "Intl. Holistic Therapists & Course Providers", desc: "Curriculum quality verified", year: "" },
    { abbr: "IIOHT", name: "International Institute of Holistic Therapists", desc: "Institute-level academic standards", year: "" },
];

// FAQ Component with rich answers
const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left hover:text-burgundy-700 transition-colors">
                <span className="font-medium text-slate-800 pr-4 text-lg">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-burgundy-600 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
            </button>
            {isOpen && <div className="pb-5 text-slate-600 leading-relaxed">{answer}</div>}
        </div>
    );
};

// Enhanced Testimonial with specifics - uses random avatars
const TestimonialCard = ({ quote, name, role, before, after, timeframe, income, avatarSrc }: {
    quote: string; name: string; role: string; before?: string; after?: string; timeframe?: string; income?: string; avatarSrc: string
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-burgundy-200 transition-all">
        <Quote className="h-6 w-6 text-burgundy-200 mb-3" />
        {before && after && (
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <p className="text-xs font-semibold text-red-600 mb-1">BEFORE</p>
                    <p className="text-sm text-slate-700">{before}</p>
                </div>
                <div className="bg-olive-50 rounded-lg p-3 border border-olive-100">
                    <p className="text-xs font-semibold text-olive-600 mb-1">AFTER</p>
                    <p className="text-sm text-slate-700">{after}</p>
                </div>
            </div>
        )}
        <p className="text-slate-700 leading-relaxed mb-4 italic">"{quote}"</p>
        {(timeframe || income) && (
            <div className="flex gap-3 mb-4">
                {timeframe && (
                    <span className="inline-flex items-center gap-1 bg-burgundy-50 text-burgundy-700 px-2 py-1 rounded text-xs font-medium">
                        <Clock className="h-3 w-3" /> {timeframe}
                    </span>
                )}
                {income && (
                    <span className="inline-flex items-center gap-1 bg-olive-50 text-olive-700 px-2 py-1 rounded text-xs font-medium">
                        <TrendingUp className="h-3 w-3" /> {income}
                    </span>
                )}
            </div>
        )}
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />)}
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <Image src={avatarSrc} alt={name} width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white" />
            <div>
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{role}</p>
            </div>
        </div>
    </div>
);

// Module Accordion Card with Lessons, Method, and Certificate Preview
const ModuleAccordion = ({ module }: { module: typeof CURRICULUM_MODULES[0] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = module.icon;

    return (
        <div className={`relative bg-white rounded-2xl border transition-all ${isOpen ? 'shadow-lg ring-2 ring-burgundy-100' : 'hover:shadow-md'} ${module.highlight ? 'border-burgundy-200' : 'border-slate-100'}`}>
            {module.highlight && (
                <div className="absolute -top-2 -right-2 bg-burgundy-600 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">Popular</div>
            )}

            {/* Header - Always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-start gap-3 text-left"
            >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${module.highlight ? 'bg-burgundy-100' : 'bg-cream-100'}`}>
                    <Icon className={`h-5 w-5 ${module.highlight ? 'text-burgundy-600' : 'text-burgundy-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-bold text-burgundy-600">Module {module.number}</span>
                        <span className="text-xs text-slate-400">{module.lessons.length} lessons</span>
                        {module.method && (
                            <span className="text-[10px] font-bold bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded">{module.method}</span>
                        )}
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{module.title}</h4>
                    <p className="text-xs text-slate-500">{module.description}</p>
                </div>
                <div className="shrink-0 mt-1">
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-burgundy-600" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {isOpen && (
                <div className="px-4 pb-4 border-t border-slate-100">
                    {/* Method Badge */}
                    {module.method && module.methodMeaning && (
                        <div className="mt-3 mb-3 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-lg p-3 border border-burgundy-100">
                            <p className="text-xs font-semibold text-burgundy-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-gold-500" />
                                Proprietary Method:
                            </p>
                            <p className="font-bold text-burgundy-800 text-sm">{module.method}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{module.methodMeaning}</p>
                        </div>
                    )}

                    {/* Lessons List */}
                    <div className="mt-3 mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lessons Included:</p>
                        <div className="space-y-1.5">
                            {module.lessons.map((lesson, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-5 h-5 rounded-full bg-cream-100 flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-bold text-burgundy-600">{i + 1}</span>
                                    </div>
                                    <span className="truncate">{lesson}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certificate Preview - only show if module has a certificate */}
                    {module.certificate ? (
                        <div className="bg-gradient-to-br from-cream-50 to-gold-50 rounded-xl p-3 border border-gold-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Award className="h-3 w-3 text-gold-500" />
                                Certificate You'll Earn:
                            </p>
                            <div className="bg-white rounded-lg p-3 border-2 border-gold-300 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-100/50 rounded-full -mr-8 -mt-8" />
                                <div className="relative flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center shrink-0">
                                        <span className="text-gold-400 font-bold text-xs">AP</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Certificate of Completion</p>
                                        <p className="font-bold text-burgundy-700 text-sm">{module.certificate}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                                            <Shield className="h-2.5 w-2.5" />
                                            Verifiable credential with unique ID
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                Orientation module — no certificate (prepares you for certification)
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Recent Enrollment Toast - with randomized avatars
const RecentEnrollmentToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState(0);

    // Randomize enrollment data on component mount
    const [enrollments] = useState(() => {
        const names = [
            { name: 'Dr. Sarah K.', location: 'Texas' },
            { name: 'Michelle R.', location: 'California' },
            { name: 'Jennifer L.', location: 'Florida' },
            { name: 'Amanda P.', location: 'New York' },
            { name: 'Linda M.', location: 'Arizona' },
            { name: 'Patricia H.', location: 'Colorado' },
            { name: 'Nancy W.', location: 'Georgia' },
            { name: 'Karen B.', location: 'Ohio' },
        ];
        const times = ['2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '21 min ago'];

        // Shuffle and pick 5
        const shuffled = [...names].sort(() => Math.random() - 0.5).slice(0, 5);
        return shuffled.map((item, i) => ({
            ...item,
            time: times[i % times.length],
            avatarIndex: Math.floor(Math.random() * ALL_STUDENT_AVATARS.length)
        }));
    });

    useEffect(() => {
        const initialTimeout = setTimeout(() => {
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, 8000);
        const interval = setInterval(() => {
            setCurrentEnrollment(prev => (prev + 1) % enrollments.length);
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, 35000);
        return () => { clearTimeout(initialTimeout); clearInterval(interval); };
    }, [enrollments.length]);

    if (!visible) return null;
    const enrollment = enrollments[currentEnrollment];

    return (
        <div className="fixed bottom-24 left-4 z-40 animate-slide-up lg:bottom-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 flex items-center gap-3 max-w-sm">
                <Image src={ALL_STUDENT_AVATARS[enrollment.avatarIndex]} alt={enrollment.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{enrollment.name} from {enrollment.location}</p>
                    <p className="text-xs text-slate-500">Enrolled in Full Certification • {enrollment.time}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
            </div>
        </div>
    );
};

// Sticky CTA (Mobile + Desktop)
const StickyCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 800);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-2xl p-3 animate-slide-up">
                <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                    <div>
                        <p className="text-slate-400 text-xs line-through">$497</p>
                        <p className="text-xl font-black text-burgundy-700">$197</p>
                    </div>
                    <a href="https://sarah.accredipro.academy/checkout-fm-certification" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white font-bold py-3 rounded-lg text-sm">
                            Get Certified Now <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </a>
                </div>
            </div>
            {/* Desktop Floating Button */}
            <div className="hidden lg:block fixed bottom-6 right-6 z-50 animate-slide-up">
                <a href="https://sarah.accredipro.academy/checkout-fm-certification">
                    <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 px-6 rounded-xl shadow-2xl text-base">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Get Certified — $197
                    </Button>
                </a>
            </div>
        </>
    );
};

export default function FMCertificationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-white pb-20 lg:pb-0">
            <StickyCTA />
            <RecentEnrollmentToast />

            <style jsx global>{`
                @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>

            {/* Christmas Urgency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                    <span className="font-bold flex items-center gap-2">
                        🎄 Christmas Special: Save $300!
                    </span>
                    <span className="hidden sm:block">|</span>
                    <span className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span>Ends December 26th</span>
                    </span>
                    <span className="hidden sm:block">|</span>
                    <span className="font-semibold text-yellow-300">Only 23 spots left at this price</span>
                </div>
            </div>

            {/* Trustpilot Widget */}
            <div className="bg-white py-2 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
                    <div className="trustpilot-widget" data-locale="en-US" data-template-id="5419b6ffb0d04a076446a9af" data-businessunit-id="68c1ac85e89f387ad19f7817" data-style-height="20px" data-style-width="100%" data-token="73ab2ab9-e3e9-4746-b2df-4f148e213f2c">
                        <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">Trustpilot</a>
                    </div>
                </div>
            </div>

            {/* Hero Section - NEW COPY */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
                    {/* Target Audience Badge */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-4 py-2 shadow-sm">
                            <Stethoscope className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-semibold text-burgundy-700">For Nurses, NPs, PAs, MDs & Licensed Healthcare Professionals</span>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4 leading-tight">
                        Become a <span className="text-burgundy-700">Certified<br className="sm:hidden" /> Functional Medicine Practitioner</span>
                    </h1>

                    {/* Value Proposition */}
                    <p className="text-lg sm:text-xl text-center text-slate-700 mb-6 max-w-3xl mx-auto">
                        Add <span className="font-bold text-olive-700">$10,000–$15,000+/month</span> helping patients actually heal — <span className="font-semibold">without quitting your job.</span>
                    </p>

                    {/* Bundle Image */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/12/FunctionalMedicinePractictioner.jpeg"
                            alt="Functional Medicine Practitioner Certification Bundle"
                            width={800}
                            height={500}
                            className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white"
                        />
                    </div>

                    {/* Key Benefits */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-4 mb-6">
                        <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-olive-100">
                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                            <span className="font-medium text-slate-800 text-sm whitespace-nowrap">21 specializations + 18 proprietary methods</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-olive-100">
                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                            <span className="font-medium text-slate-800 text-sm whitespace-nowrap">Personal mentorship until certified</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-olive-100">
                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                            <span className="font-medium text-slate-800 text-sm whitespace-nowrap">Most graduates earning within 90 days</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6">
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                            <span className="font-bold text-slate-800">4.9</span>
                            <span className="text-slate-500 text-sm">(823)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Users className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">1,447</span>
                            <span className="text-slate-500 text-sm">enrolled</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">168</span>
                            <span className="text-slate-500 text-sm">lessons</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Award className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">80+</span>
                            <span className="text-slate-500 text-sm">CEU</span>
                        </div>
                    </div>

                    {/* VSL Video */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                            <iframe
                                src="https://player.vimeo.com/video/1134216854?badge=0&autopause=0&player_id=0&app_id=58479"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Certification Overview"
                            />
                        </div>
                    </div>

                    {/* Social Proof before CTA */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                            {[
                                "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1131.jpg",
                                "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1136.jpeg",
                                "https://accredipro.academy/wp-content/uploads/2025/12/IMG_4848-1.jpg",
                                "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
                                "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
                            ].map((src, i) => (
                                <Image key={i} src={src} alt="Certified practitioner" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                            ))}
                        </div>
                        <span className="text-sm text-slate-700 font-semibold">Join <span className="text-burgundy-700">1,447+ practitioners</span> already certified</span>
                    </div>

                    {/* CTA with Payment Plan */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href="https://sarah.accredipro.academy/checkout-fm-certification">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Start Your Certification Now
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">
                                <span className="line-through text-slate-400 text-base">$497</span>
                                <span className="text-burgundy-700 ml-2">$197</span>
                                <span className="text-slate-500 text-sm ml-2">one-time</span>
                            </p>
                            <p className="text-sm text-slate-500">
                                or <span className="font-semibold">2 × $109/month</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-olive-600" />30-day guarantee</span>
                        <span className="flex items-center gap-1"><Infinity className="h-4 w-4 text-olive-600" />Lifetime access</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-olive-600" />Self-paced</span>
                        <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-olive-600" />Start today</span>
                    </div>
                </div>
            </section>

            {/* The Pain Cycle - What You're Experiencing Now */}
            <section className="py-12 sm:py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-red-600 font-semibold mb-2 uppercase tracking-wide">Sound Familiar?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            The Pain Cycle You're Stuck In
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            You became a healthcare provider to help people heal. But somewhere along the way, the system broke your spirit.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { emoji: "😓", pain: "10-minute visits", desc: "Rushed. No time to actually listen or understand the root cause." },
                            { emoji: "📋", pain: "Symptom chasing", desc: "Prescribe, refer, repeat. Never addressing what's really wrong." },
                            { emoji: "💸", pain: "Insurance handcuffs", desc: "Reimbursements dictate care. You can't practice the way you know works." },
                            { emoji: "🔥", pain: "Burnout", desc: "Exhausted, undervalued, and wondering if this is all there is." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 text-center">
                                <span className="text-4xl block mb-3">{item.emoji}</span>
                                <h3 className="font-bold text-slate-900 mb-2">{item.pain}</h3>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Real Quotes from Before */}
                    <div className="bg-gradient-to-r from-red-50 to-slate-50 rounded-2xl p-6 border border-red-100">
                        <p className="text-red-700 font-semibold mb-4 text-center flex items-center justify-center gap-2">
                            <Quote className="h-4 w-4" />
                            What Our Students Said BEFORE They Found Functional Medicine:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { quote: "I was so burned out after 25 years in hospitals. I knew there had to be a better way to actually help people.", name: "Karen M., ARNP" },
                                { quote: "I watched my patients leave with prescriptions that would never fix their problems. It broke my heart.", name: "Sarah M., RN" },
                                { quote: "10-minute visits. No time to listen. I felt like a prescription machine, not a healer.", name: "Maria S., PA-C" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 border border-slate-100">
                                    <p className="text-slate-700 text-sm italic mb-2">"{item.quote}"</p>
                                    <p className="text-slate-500 text-xs font-medium">— {item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* The 3-Pillar Solution */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-olive-600 font-semibold mb-2 uppercase tracking-wide">The Solution</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            3 Pillars That Transform Your Career
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            AccrediPro isn't just education — it's a complete system for becoming a successful functional medicine practitioner.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-burgundy-50 to-cream-50 rounded-2xl p-6 border border-burgundy-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <Brain className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <div className="inline-flex items-center gap-1 bg-burgundy-100 text-burgundy-700 px-2 py-1 rounded text-xs font-bold mb-3">
                                PILLAR 1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Clinical Mastery</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                21 modules covering every major health condition. Proprietary protocols. Evidence-based methods you can apply immediately.
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />Thyroid, Gut, Hormones, Autoimmune</li>
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />18 proprietary frameworks</li>
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />Real case studies included</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-gold-50 to-cream-50 rounded-2xl p-6 border border-gold-200 hover:shadow-lg transition-all ring-2 ring-gold-300">
                            <div className="w-14 h-14 rounded-xl bg-gold-100 flex items-center justify-center mb-4">
                                <Award className="h-7 w-7 text-gold-600" />
                            </div>
                            <div className="inline-flex items-center gap-1 bg-gold-200 text-gold-800 px-2 py-1 rounded text-xs font-bold mb-3">
                                PILLAR 2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Credentials</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                22 verifiable certificates. 9 international accreditations. Credentials that command respect and premium rates.
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />Master FM Practitioner cert</li>
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />21 specialty certificates</li>
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />80+ CEU hours included</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-olive-50 to-cream-50 rounded-2xl p-6 border border-olive-200 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-olive-100 flex items-center justify-center mb-4">
                                <TrendingUp className="h-7 w-7 text-olive-600" />
                            </div>
                            <div className="inline-flex items-center gap-1 bg-olive-100 text-olive-700 px-2 py-1 rounded text-xs font-bold mb-3">
                                PILLAR 3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Business Launch</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                Personal mentorship. Coach Workspace CRM. Marketing templates. Everything to get your first paying clients.
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />1:1 mentor until certified</li>
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />Built-in practice tools</li>
                                <li className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-olive-600" />Pricing & marketing help</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Fit Check */}
            <section className="py-8 bg-cream-50 border-y border-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-olive-50 rounded-2xl p-6 border border-olive-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-olive-600" />
                                This Certification Is Perfect If You:
                            </h3>
                            <ul className="space-y-2 text-slate-700 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0 mt-0.5" />Are a licensed healthcare professional (RN, NP, PA, MD, DC, RD, etc.)</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0 mt-0.5" />Want to earn $10–15K+/month helping clients actually heal</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0 mt-0.5" />Are tired of symptom-chasing and want root-cause solutions</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0 mt-0.5" />Can commit 3–5 hours/week to learning and applying</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0 mt-0.5" />Want evidence-based methods, not guesswork</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <X className="h-5 w-5 text-red-500" />
                                This Is NOT For You If:
                            </h3>
                            <ul className="space-y-2 text-slate-700 text-sm">
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />You want passive income without working with clients</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />You're looking for a medical degree replacement</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />You don't plan to actually help people get results</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />You expect instant results without effort</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accreditation Logos - MOVED UP FOR LEGITIMACY */}
            <section className="py-6 bg-slate-50 border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-center text-xs text-slate-500 mb-3 uppercase tracking-wide font-medium">
                        Recognized by 9 International Accreditation Bodies • 80+ CEU • Insurance Eligible
                    </p>
                    <Image src="/all-logos.png" alt="Accredited by CMA, IPHM, CPD, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT" width={900} height={100} className="w-full max-w-4xl mx-auto h-auto" />
                </div>
            </section>

            {/* What Makes AccrediPro Different */}
            <section className="py-12 sm:py-16 bg-burgundy-900 text-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-gold-400 font-semibold mb-2 uppercase tracking-wide">What Makes Us Different</p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            21 Certifications + Master Certification
                        </h2>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                            Instead of one generic credential, you graduate with a <span className="text-gold-400 font-semibold">portfolio of focused specializations</span>. Each module = 1 certificate.
                        </p>
                    </div>

                    {/* Specialty Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {["Thyroid Specialist", "Gut Health Specialist", "Women's Hormone Specialist", "Autoimmune Specialist", "Menopause Specialist", "Metabolic Health Coach", "Functional Nutritionist", "Brain Health Specialist", "+ 13 more"].map((cert, i) => (
                            <span key={i} className="bg-burgundy-700/50 text-white px-3 py-1.5 rounded-full text-sm font-medium border border-burgundy-500">
                                {cert}
                            </span>
                        ))}
                    </div>

                    {/* Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                            <p className="text-red-400 font-semibold mb-3 flex items-center gap-2"><X className="h-5 w-5" /> Other Programs</p>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />One generic "Health Coach" certificate</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />No specialization options</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />Left alone after enrollment</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />No business or career support</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-burgundy-800 to-burgundy-900 rounded-2xl p-5 border border-burgundy-500 ring-2 ring-gold-400/30">
                            <p className="text-gold-400 font-semibold mb-3 flex items-center gap-2"><Star className="h-5 w-5" /> AccrediPro Academy</p>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" /><strong>21 specialized certificates</strong> — one per module</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />Certified in Thyroid, Hormones, Gut Health & more</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />Private 1:1 mentorship until certified</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />Complete business & career launch support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Market Comparison Table */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Market Comparison</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Why AccrediPro is the New Frontier</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            See how we compare to other leading Functional Medicine certification programs.
                        </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto bg-cream-50 rounded-2xl shadow-xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-burgundy-700 text-white">
                                    <th className="px-4 py-4 font-semibold rounded-tl-xl">Feature</th>
                                    <th className="px-4 py-4 font-bold text-center bg-burgundy-600">
                                        <div className="flex flex-col items-center">
                                            <span className="text-gold-400">AccrediPro</span>
                                            <span className="text-sm font-normal text-burgundy-200">$197</span>
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-center">
                                        <div className="flex flex-col items-center">
                                            <span>FMCA</span>
                                            <span className="text-sm font-normal text-burgundy-200">$7,200-$9,000</span>
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-center">
                                        <div className="flex flex-col items-center">
                                            <span>IFM</span>
                                            <span className="text-sm font-normal text-burgundy-200">$15,000+</span>
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-center rounded-tr-xl">
                                        <div className="flex flex-col items-center">
                                            <span>IIN</span>
                                            <span className="text-sm font-normal text-burgundy-200">$6,499</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { feature: "Investment", accredipro: "$197", fmca: "$7,200-$9,000", ifm: "$15,000+", iin: "$6,499" },
                                    { feature: "Specialty Certificates", accredipro: "21 Certifications", fmca: "1 Certificate", ifm: "1 Certificate", iin: "1 Certificate" },
                                    { feature: "1:1 Personal Mentorship", accredipro: true, fmca: false, ifm: false, iin: false },
                                    { feature: "Career Launch Support", accredipro: true, fmca: "Limited", ifm: false, iin: "Limited" },
                                    { feature: "Lifetime Access", accredipro: true, fmca: "1 Year", ifm: "Event-based", iin: "1 Year" },
                                    { feature: "Coach Workspace (CRM)", accredipro: true, fmca: false, ifm: false, iin: false },
                                    { feature: "Private Community", accredipro: "1,400+ members", fmca: true, ifm: true, iin: true },
                                    { feature: "CEU Hours", accredipro: "80+", fmca: "40-50", ifm: "Varies", iin: "Varies" },
                                    { feature: "International Accreditations", accredipro: "9 Bodies", fmca: "2-3", ifm: "1", iin: "1" },
                                    { feature: "Self-Paced", accredipro: true, fmca: "Cohort-based", ifm: "In-person", iin: "Cohort-based" },
                                    { feature: "Money-Back Guarantee", accredipro: "30 days", fmca: "7 days", ifm: "None", iin: "7 days" },
                                ].map((row, i) => (
                                    <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-cream-50'}`}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{row.feature}</td>
                                        <td className="px-4 py-3 text-center bg-burgundy-50/50">
                                            {typeof row.accredipro === 'boolean' ? (
                                                row.accredipro ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                                            ) : (
                                                <span className="font-semibold text-burgundy-700">{row.accredipro}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {typeof row.fmca === 'boolean' ? (
                                                row.fmca ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                                            ) : row.fmca}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {typeof row.ifm === 'boolean' ? (
                                                row.ifm ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                                            ) : row.ifm}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {typeof row.iin === 'boolean' ? (
                                                row.iin ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                                            ) : row.iin}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Value Highlight */}
                    <div className="mt-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-2xl p-6 text-center">
                        <p className="text-lg mb-2 text-burgundy-900">
                            <span className="font-bold">Get 45x more value</span> than traditional programs
                        </p>
                        <p className="text-burgundy-800 text-sm">
                            Same quality education. 21 specialty certifications. Personal mentorship. Career support. <span className="font-bold">For 1/40th the price.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Fast Proof Strip - MOVED UP for fast trust */}
            <section className="py-6 bg-slate-900">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        {[
                            { emoji: "🩺", role: "RN", result: "$6.2K/mo", time: "in 4 months" },
                            { emoji: "🩺", role: "PA", result: "$16.5K/mo", time: "hybrid practice" },
                            { emoji: "🩺", role: "MD", result: "+$8K/mo", time: "integrative add-on" },
                            { emoji: "🩺", role: "RD", result: "$150/hr", time: "cash-pay clients" },
                        ].map((proof, i) => (
                            <div key={i} className="flex items-center justify-center gap-2 text-white">
                                <span className="text-lg">{proof.emoji}</span>
                                <span className="font-bold text-burgundy-300">{proof.role}</span>
                                <span className="text-white">→</span>
                                <span className="font-bold text-gold-400">{proof.result}</span>
                                <span className="text-slate-400 text-sm">{proof.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Outcome Math - MOVED UP */}
            <section className="py-10 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">How Practitioners Reach $10K/Month</h2>
                        <p className="text-slate-600">This isn't hype — it's simple math.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { formula: "10 clients", multiplier: "× $1,000 programs", result: "= $10K/mo", desc: "3-month transformation packages" },
                            { formula: "20 sessions", multiplier: "× $125/week each", result: "= $10K/mo", desc: "Weekly 1:1 coaching clients" },
                            { formula: "15 clients", multiplier: "× $750 group program", result: "= $11.25K/mo", desc: "One group launch per month" },
                        ].map((path, i) => (
                            <div key={i} className="bg-olive-50 rounded-xl p-4 text-center border border-olive-100">
                                <p className="text-olive-700 font-bold">{path.formula}</p>
                                <p className="text-slate-600 text-sm">{path.multiplier}</p>
                                <p className="text-2xl font-black text-olive-600 my-2">{path.result}</p>
                                <p className="text-xs text-slate-500">{path.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <a href="#pricing">
                            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50 font-semibold">
                                👉 Get Started — $197
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Master Certificate + Sample Certificates Section - ENHANCED */}
            <section className="py-16 sm:py-24 bg-gradient-to-b from-cream-50 via-white to-cream-50">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header with Impact */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gold-100 border border-gold-300 rounded-full px-5 py-2 mb-4">
                            <Award className="h-5 w-5 text-gold-600" />
                            <span className="text-sm font-bold text-gold-800">YOUR MASTER CREDENTIAL</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Become a <span className="text-burgundy-700">Certified Functional Medicine Practitioner</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Walk away with the most comprehensive credential portfolio in functional medicine — <strong className="text-slate-800">22 certifications total.</strong>
                        </p>
                    </div>

                    {/* Value Comparison Banner */}
                    <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-2xl p-6 mb-12 text-center text-white">
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-gold-400">22</p>
                                <p className="text-sm text-burgundy-200">Total Certifications</p>
                            </div>
                            <div className="hidden sm:block w-px bg-burgundy-500" />
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-gold-400">80+</p>
                                <p className="text-sm text-burgundy-200">CEU Hours</p>
                            </div>
                            <div className="hidden sm:block w-px bg-burgundy-500" />
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-gold-400">9</p>
                                <p className="text-sm text-burgundy-200">Accreditation Bodies</p>
                            </div>
                            <div className="hidden sm:block w-px bg-burgundy-500" />
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-gold-400">Lifetime</p>
                                <p className="text-sm text-burgundy-200">Validity</p>
                            </div>
                        </div>
                    </div>

                    {/* Master Certificate - Larger, More Impactful */}
                    <div className="max-w-5xl mx-auto mb-12">
                        <div className="relative bg-gradient-to-br from-gold-100 via-cream-50 to-gold-50 rounded-3xl p-4 sm:p-8 border-2 border-gold-300 shadow-2xl">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-burgundy-600 text-white rounded-full px-6 py-2 shadow-lg z-10">
                                <p className="text-sm font-bold flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-gold-400" />
                                    Master Certification
                                </p>
                            </div>
                            <Image
                                src="/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                                alt="Certified Functional Medicine Practitioner Certificate"
                                width={1000}
                                height={750}
                                className="w-full rounded-xl shadow-lg"
                            />
                            <div className="mt-6 flex flex-wrap justify-center gap-4">
                                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gold-200">
                                    <Shield className="h-4 w-4 text-olive-600" />
                                    <span className="text-sm font-medium text-slate-700">Unique verification ID</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gold-200">
                                    <BadgeCheck className="h-4 w-4 text-olive-600" />
                                    <span className="text-sm font-medium text-slate-700">9 accreditation logos</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gold-200">
                                    <Linkedin className="h-4 w-4 text-olive-600" />
                                    <span className="text-sm font-medium text-slate-700">LinkedIn verifiable</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plus 21 Specialty Certs - Bigger Impact */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-burgundy-100 border border-burgundy-200 rounded-full px-6 py-3 mb-6">
                            <span className="text-2xl font-bold text-burgundy-700">+</span>
                            <span className="text-lg font-bold text-burgundy-800">21 Specialty Certificates</span>
                        </div>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            One certificate for each clinical module you complete. Display your expertise in specific conditions and health areas.
                        </p>
                    </div>

                    {/* Sample Module Certificates Grid - Enhanced */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {[
                            { name: "Gut Health Specialist", icon: Activity, students: "847 certified" },
                            { name: "Thyroid Health Specialist", icon: Zap, students: "923 certified" },
                            { name: "Women's Hormone Specialist", icon: Heart, students: "756 certified" },
                            { name: "Autoimmune Specialist", icon: Flame, students: "612 certified" },
                        ].map((cert, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border-2 border-gold-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-100 to-gold-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center">
                                            <cert.icon className="h-6 w-6 text-burgundy-600" />
                                        </div>
                                        <Award className="h-8 w-8 text-gold-500" />
                                    </div>
                                    <p className="text-xs text-burgundy-600 uppercase tracking-wide font-semibold mb-1">Certificate of Completion</p>
                                    <p className="font-bold text-slate-900 text-lg mb-3">{cert.name}</p>
                                    <div className="pt-3 border-t border-gold-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Shield className="h-3.5 w-3.5 text-olive-600" />
                                            <span>Verified Credential</span>
                                        </div>
                                        <span className="text-xs text-olive-600 font-medium">{cert.students}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-slate-600 font-medium mb-10">
                        ...plus <span className="text-burgundy-700 font-bold">17 more specialty certificates</span>, one for each module!
                    </p>

                    {/* What Your Credentials Include - Detailed */}
                    <div className="bg-gradient-to-br from-slate-900 to-burgundy-900 rounded-3xl p-8 sm:p-10 text-white">
                        <h3 className="text-2xl font-bold text-center mb-8">What Your Credentials Include</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Award, title: "Master Certification", desc: "Certified Functional Medicine Practitioner designation with unique ID" },
                                { icon: BookOpen, title: "21 Specialty Certificates", desc: "One for each clinical module — Thyroid, Gut, Hormones, Autoimmune & more" },
                                { icon: Clock, title: "80+ CEU Hours", desc: "Meets continuing education requirements for nurses, NPs, and health professionals" },
                                { icon: Globe2, title: "9 Accreditation Logos", desc: "CMA, IPHM, CPD, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT" },
                                { icon: Linkedin, title: "LinkedIn Verification", desc: "Digital badges and verification page to share with potential clients" },
                                { icon: Infinity, title: "Lifetime Validity", desc: "Your certifications never expire — no renewal fees, ever" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-burgundy-700/50 flex items-center justify-center shrink-0">
                                        <item.icon className="h-6 w-6 text-gold-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white mb-1">{item.title}</p>
                                        <p className="text-sm text-burgundy-200">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof */}
                        <div className="mt-10 pt-8 border-t border-burgundy-700 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="flex -space-x-2">
                                {[
                                    "https://accredipro.academy/wp-content/uploads/2025/12/Peak-Health-VIP-087.jpg",
                                    "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
                                    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
                                    "https://accredipro.academy/wp-content/uploads/2025/12/Headshot_Mirjana-1.jpg",
                                    "https://accredipro.academy/wp-content/uploads/2025/12/1-1.jpg",
                                ].map((src, i) => (
                                    <Image key={i} src={src} alt="" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-burgundy-800 object-cover" />
                                ))}
                            </div>
                            <p className="text-burgundy-200">
                                Join our growing community of <span className="font-bold text-white">certified practitioners</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Complete Curriculum Accordion */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Curriculum</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">21 Modules. 20 Certifications.</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Complete all modules to earn 20 verifiable certificates. Click to see lessons and proprietary frameworks.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CURRICULUM_MODULES.map((module) => (
                            <ModuleAccordion key={module.number} module={module} />
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-200 rounded-xl px-6 py-3">
                            <p className="text-gold-800 font-bold">168 Lessons • 60+ Hours • 80+ CEU</p>
                        </div>
                    </div>

                    {/* Micro CTA after Curriculum */}
                    <div className="text-center mt-6">
                        <a href="#pricing">
                            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50 font-semibold text-sm">
                                👉 Get Certified for $197 (23 Spots Left)
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Also AccrediPro Section - Accreditations Detail */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Also AccrediPro</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            9 Global Accreditations
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Practice in 30+ countries. Qualify for professional liability insurance. Credentials recognized worldwide.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {ACCREDITATIONS.map((acc, i) => (
                            <div key={i} className="bg-gradient-to-br from-cream-50 to-white rounded-xl p-4 border border-cream-200 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-burgundy-600 text-white font-bold px-2.5 py-1 rounded text-sm">{acc.abbr}</span>
                                    <BadgeCheck className="h-5 w-5 text-olive-600" />
                                </div>
                                <p className="font-semibold text-slate-800 text-sm mb-1">{acc.name}</p>
                                <p className="text-xs text-slate-500">{acc.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Key Benefits of Accreditations */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {[
                            { icon: Globe2, title: "Global Mobility", desc: "Practice in 30+ countries" },
                            { icon: Shield, title: "Insurance Access", desc: "Qualify for liability coverage" },
                            { icon: Award, title: "Premium Credibility", desc: "Command higher rates" },
                            { icon: Infinity, title: "Lifetime Validity", desc: "Certificates never expire" },
                        ].map((item, i) => {
                            const Icon = item.icon || Shield;
                            return (
                                <div key={i} className="flex items-center gap-3 bg-olive-50 rounded-lg px-4 py-3 border border-olive-100">
                                    <Shield className="h-5 w-5 text-olive-600 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Micro CTA after Accreditations */}
                    <div className="text-center mt-6">
                        <a href="#pricing">
                            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50 font-semibold text-sm">
                                👉 Secure Your Spot — $197
                            </Button>
                        </a>
                    </div>

                </div>
            </section>

            {/* What You Get - with Images */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Access</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need to Succeed</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: LayoutDashboard, title: "Full Dashboard Access", desc: "Your personal learning portal with progress tracking, certificates, and all resources.", badge: "Lifetime access" },
                            { icon: HeartHandshake, title: "Private Mentorship", desc: "Personal coach guides you — answers questions, provides feedback, celebrates wins.", badge: "Until certified" },
                            { icon: Laptop, title: "Coach Workspace", desc: "Professional client management. Track clients, create protocols, manage your practice.", badge: "Built-in tools" },
                            { icon: TrendingUp, title: "Career Launch Support", desc: "Your coach helps plan your career — pricing, niching, getting first clients.", badge: "$5K-$20K/month" },
                            { icon: Users, title: "Private Community", desc: "1,400+ practitioners sharing wins, asking questions, collaborating together.", badge: "Lifetime access" },
                            { icon: Video, title: "Coaching Tips & Stories", desc: "Weekly insights from Sarah and successful graduates. Real strategies that work.", badge: "Ongoing" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center mb-3">
                                    <item.icon className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm mb-2">{item.desc}</p>
                                <span className="text-burgundy-600 font-semibold text-xs">{item.badge}</span>
                            </div>
                        ))}
                    </div>

                    {/* Portal Screenshot */}
                    <div className="mt-10 text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Learning Portal</h3>
                        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">Everything in one place.</p>
                        <Image src="/portal.webp" alt="AccrediPro Learning Portal" width={1200} height={700} className="w-full rounded-2xl shadow-2xl border border-slate-200" />
                    </div>
                </div>
            </section>

            {/* Coach Workspace Deep Dive */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-4 py-2 mb-4">
                                <Laptop className="h-4 w-4 text-burgundy-600" />
                                <span className="text-sm font-semibold text-burgundy-700">Included: Coach Workspace</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                Run Your Entire Practice From One Dashboard
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Most coaches pay $50-$200/month for separate CRM tools. Yours is built-in — professional from day one.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Users, title: "Client Management", desc: "Track all clients, their progress, notes, and history in one place" },
                                    { icon: BookOpen, title: "Protocol Builder", desc: "Create custom nutrition, supplement, and lifestyle protocols" },
                                    { icon: Calendar, title: "Session Scheduling", desc: "Built-in calendar with automatic reminders" },
                                    { icon: MessageCircle, title: "Secure Messaging", desc: "HIPAA-friendly communication with clients" },
                                    { icon: Target, title: "Progress Tracking", desc: "Visual dashboards showing client outcomes" },
                                    { icon: DollarSign, title: "Invoice & Payments", desc: "Send invoices, accept payments, track revenue" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-olive-100 flex items-center justify-center shrink-0">
                                            <item.icon className="h-5 w-5 text-olive-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-sm text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-gold-50 rounded-xl p-4 border border-gold-200">
                                <p className="text-gold-800 font-semibold text-sm flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Value: $1,200+/year in software costs — included FREE
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-burgundy-100 to-gold-50 rounded-3xl p-4">
                                <Image
                                    src="/portal.webp"
                                    alt="Coach Workspace Dashboard"
                                    width={600}
                                    height={400}
                                    className="w-full rounded-2xl shadow-lg"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Practitioners using Workspace:</p>
                                <p className="text-xl font-bold text-burgundy-700">1,200+</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bonus Section - Personal from Sarah */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-burgundy-900 to-burgundy-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <Image src="/coaches/sarah-coach.webp" alt="Sarah Mitchell" width={80} height={80} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg" />
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Today, I'm Giving You These 6 Bonuses
                        </h2>
                        <p className="text-lg text-burgundy-200 max-w-2xl mx-auto">
                            I created these specifically for my students — because I know exactly what you'll need to succeed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: "Client Intake Templates", value: "$97", desc: "Professional forms ready to use with your first client" },
                            { title: "Protocol Builder Toolkit", value: "$147", desc: "Create custom protocols for any condition" },
                            { title: "Pricing & Packages Guide", value: "$47", desc: "Exactly how to price your services for profit" },
                            { title: "Marketing Starter Kit", value: "$97", desc: "Social media templates, bio scripts, and more" },
                            { title: "First Client Script", value: "$47", desc: "Word-for-word script for your discovery call" },
                            { title: "Graduate Resource Vault", value: "$62", desc: "Ongoing resources as the field evolves" },
                        ].map((bonus, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <Gift className="h-5 w-5 text-gold-400" />
                                    <span className="text-gold-400 font-bold text-sm">{bonus.value} value</span>
                                </div>
                                <h3 className="font-bold text-white mb-1">{bonus.title}</h3>
                                <p className="text-sm text-burgundy-200">{bonus.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-burgundy-200">
                            Total Bonus Value: <span className="text-gold-400 font-bold text-xl">$497</span> — <span className="text-white font-semibold">Yours FREE</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Sarah's Story - Enhanced with Bridge to Testimonials */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-100 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-6">
                        <Image src="/coaches/sarah-coach.webp" alt="Sarah Mitchell" width={100} height={100} className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-burgundy-100 mb-3" />
                        <p className="text-burgundy-600 font-semibold uppercase tracking-wide text-sm">Your Lead Coach</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">I'll Be With You Every Step</h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                        <div className="space-y-3 text-slate-600">
                            <p><strong className="text-slate-800">12 years as an ER nurse.</strong> I watched patients leave with prescriptions that would never fix their problems.</p>
                            <p>Then <span className="text-burgundy-700 font-semibold">I got sick.</span> Thyroid. Gut issues. Autoimmune symptoms. Doctors said "normal." I knew it wasn't.</p>
                            <p>Functional medicine healed me — and gave me purpose. Now I help practitioners just like you launch their own practices.</p>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-xl border-l-4 border-burgundy-600">
                            <p className="text-burgundy-800 font-semibold">"I don't just hand you a course and disappear. I mentor you personally until you're certified and confident."</p>
                            <p className="text-slate-600 text-sm mt-1">— Sarah Mitchell, Lead Coach</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
                            <div><p className="text-xl font-bold text-burgundy-700">12+</p><p className="text-xs text-slate-500">Years as RN</p></div>
                            <div><p className="text-xl font-bold text-burgundy-700">1,447</p><p className="text-xs text-slate-500">Practitioners</p></div>
                            <div><p className="text-xl font-bold text-burgundy-700">97%</p><p className="text-xs text-slate-500">Completion</p></div>
                        </div>
                    </div>

                    {/* Bridge to Testimonials */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-600 text-lg mb-2">But don't just take my word for it...</p>
                        <h3 className="text-2xl font-bold text-slate-900">Here's What My Certified Students Say:</h3>
                    </div>
                </div>
            </section>

            {/* Testimonials - 12 Diverse Cases */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Real Transformations</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">1,447 Practitioners Certified</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Nurses, NPs, PAs, MDs, chiropractors, nutritionists, career changers — all thriving.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Testimonial 1 - ARNP */}
                        <TestimonialCard
                            quote="Sarah's mentorship changed everything. She helped me launch my practice. Got my first paying client within 2 weeks of finishing."
                            name="Karen Mitchell, ARNP"
                            role="Former ER Nurse, Now FM Practitioner"
                            before="Burned out, 25 years in hospitals"
                            after="Working 20 hrs/week from home"
                            timeframe="Certified in 4 months"
                            income="$6,200/month"
                            avatarSrc={TESTIMONIAL_AVATARS[0]}
                        />
                        {/* Testimonial 2 - PA */}
                        <TestimonialCard
                            quote="As a PA, I was frustrated by 10-minute visits. Now I spend an hour with each client and actually help them heal. Income doubled."
                            name="Maria Santos, PA-C"
                            role="Physician Assistant, California"
                            before="10-min visits, $110K/year"
                            after="$200K+/year, meaningful work"
                            timeframe="Completed in 5 months"
                            income="$16,500/month"
                            avatarSrc={TESTIMONIAL_AVATARS[1]}
                        />
                        {/* Testimonial 3 - RN Thyroid Specialist */}
                        <TestimonialCard
                            quote="I work with Hashimoto's clients exclusively now. The specialized certificates prove I actually know my stuff. Clients pay premium rates."
                            name="Patricia Smith, RN"
                            role="Thyroid & Autoimmune Specialist"
                            before="No niche, charging $50/session"
                            after="Thyroid specialist, $175/session"
                            timeframe="First client in 3 weeks"
                            income="$9,800/month"
                            avatarSrc={TESTIMONIAL_AVATARS[2]}
                        />
                        {/* Testimonial 4 - NP Gut Health */}
                        <TestimonialCard
                            quote="The gut health module alone was worth 10x the price. I've helped clients reverse IBS, SIBO, and digestive issues that docs couldn't fix."
                            name="Lisa Rodriguez, NP"
                            role="Gut Health Specialist, Texas"
                            before="General NP, overwhelmed"
                            after="Specialized practice, waiting list"
                            timeframe="6 months to certification"
                            income="$11,400/month"
                            avatarSrc={TESTIMONIAL_AVATARS[3]}
                        />
                        {/* Testimonial 5 - Career Changer */}
                        <TestimonialCard
                            quote="Zero healthcare background. Sarah believed in me when I didn't believe in myself. Now I have 12 clients and quit my corporate job."
                            name="Amanda Chen"
                            role="Former Corporate, Now FM Coach"
                            before="Stuck in 9-5, unfulfilled"
                            after="Own schedule, helping people"
                            timeframe="Career change in 5 months"
                            income="$7,200/month"
                            avatarSrc={TESTIMONIAL_AVATARS[4]}
                        />
                        {/* Testimonial 6 - MD */}
                        <TestimonialCard
                            quote="I'm an MD and this program taught me more about root-cause medicine than medical school. Now I combine both approaches for my patients."
                            name="Dr. Jennifer Walsh, MD"
                            role="Integrative Family Medicine"
                            before="Conventional medicine only"
                            after="Integrative practice, premium rates"
                            timeframe="Certified in 4 months"
                            income="Added $8K/month"
                            avatarSrc={TESTIMONIAL_AVATARS[5]}
                        />
                        {/* Testimonial 7 - Chiropractor */}
                        <TestimonialCard
                            quote="Added functional medicine to my chiropractic practice. Patient retention tripled because I can now address nutrition and hormones too."
                            name="Dr. Tiffany Nelson, DC"
                            role="Chiropractor, Colorado"
                            before="Adjustments only"
                            after="Full wellness practice"
                            timeframe="Completed in 3 months"
                            income="$14,200/month"
                            avatarSrc={TESTIMONIAL_AVATARS[6]}
                        />
                        {/* Testimonial 8 - Dietitian */}
                        <TestimonialCard
                            quote="As a dietitian, I knew nutrition. But this taught me the 'why' behind everything. Clients get better results and refer everyone they know."
                            name="Michelle Davis, RD"
                            role="Registered Dietitian, Ohio"
                            before="Insurance reimbursements"
                            after="Cash-pay practice, $150/hr"
                            timeframe="5 months to certification"
                            income="$8,900/month"
                            avatarSrc={TESTIMONIAL_AVATARS[7]}
                        />
                        {/* Testimonial 9 - LVN */}
                        <TestimonialCard
                            quote="I thought I needed more letters after my name. Turns out I needed the right training. Now I help women with hormone issues full-time."
                            name="Ines Martinez, LVN"
                            role="Women's Hormone Specialist"
                            before="LVN, underpaid, overworked"
                            after="Own practice, $125/session"
                            timeframe="Certified in 6 months"
                            income="$6,500/month"
                            avatarSrc={TESTIMONIAL_AVATARS[8]}
                        />
                        {/* Testimonial 10 - Personal Trainer */}
                        <TestimonialCard
                            quote="Personal training wasn't enough. Clients needed nutrition and lifestyle help too. Now I offer complete transformation packages at $3K each."
                            name="Tammie Johnson"
                            role="Former Personal Trainer"
                            before="Training only, $60/session"
                            after="Full wellness packages, $3K+"
                            timeframe="4 months to certification"
                            income="$10,200/month"
                            avatarSrc={TESTIMONIAL_AVATARS[9]}
                        />
                        {/* Testimonial 11 - Pharmacist */}
                        <TestimonialCard
                            quote="20 years filling prescriptions. Now I help people get OFF medications using root-cause approaches. This is what healing looks like."
                            name="Sandra Lambert, PharmD"
                            role="Former Pharmacist, Now FM Coach"
                            before="Dispensing meds, no satisfaction"
                            after="Helping people heal naturally"
                            timeframe="Certified in 5 months"
                            income="$7,800/month"
                            avatarSrc={TESTIMONIAL_AVATARS[10]}
                        />
                        {/* Testimonial 12 - Stay-at-Home Mom */}
                        <TestimonialCard
                            quote="Started while my kids were in school. Sarah made it feel possible. Now I work 15 hours a week and outearn my old corporate salary."
                            name="Rachel Thompson"
                            role="Former Stay-at-Home Mom"
                            before="No income, wanted purpose"
                            after="15 hrs/week, full income"
                            timeframe="6 months to first client"
                            income="$5,400/month part-time"
                            avatarSrc={TESTIMONIAL_AVATARS[11]}
                        />
                    </div>

                    {/* Micro CTA after Testimonials */}
                    <div className="text-center mt-8">
                        <a href="#pricing">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg">
                                👉 Continue — Get Certified for $197
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* First 7 Days Section - MOVED BEFORE PRICING */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-olive-50 border border-olive-200 rounded-full px-4 py-2 mb-4">
                            <Calendar className="h-4 w-4 text-olive-600" />
                            <span className="text-sm font-semibold text-olive-700">Your Quick Start</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">What Your First 7 Days Look Like</h2>
                        <p className="text-lg text-slate-600">You won't be left wondering "now what?" — here's exactly what happens.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { day: "Day 1", title: "Portal Access + Coach Intro", desc: "Login, meet your mentor, get your personalized study plan", icon: Laptop },
                            { day: "Day 2-3", title: "Complete FM Foundations", desc: "Finish your first module + earn your first certificate", icon: BookOpen },
                            { day: "Day 4-5", title: "Apply to a Real Case", desc: "Practice protocols on a mock client or real friend/family", icon: Users },
                            { day: "Day 6-7", title: "Map Your First Offer", desc: "Draft your service package with coach guidance", icon: Target },
                        ].map((step, i) => (
                            <div key={i} className="bg-gradient-to-br from-cream-50 to-white rounded-2xl p-5 border border-cream-200 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center">
                                        <step.icon className="h-4 w-4 text-burgundy-600" />
                                    </div>
                                    <span className="text-xs font-bold text-burgundy-600 uppercase tracking-wide">{step.day}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
                                <p className="text-xs text-slate-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm mb-4">By day 7, you'll have your first certificate AND a draft service offer. Most students are ahead of 95% of "certified coaches" before the first week ends.</p>
                    </div>
                </div>
            </section>

            {/* If You Don't Act - Loss Aversion (KEPT - just before pricing) */}
            <section className="py-10 bg-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg mb-4 text-center">If You Don't Add Functional Medicine to Your Practice...</h3>
                        <div className="grid sm:grid-cols-3 gap-4 text-center">
                            {[
                                { icon: "😓", text: "Patients keep cycling symptoms — and you keep feeling powerless" },
                                { icon: "⏰", text: "You stay time-limited and insurance-dependent" },
                                { icon: "🏃", text: "Others in your market differentiate first — and attract the clients you wanted" },
                            ].map((item, i) => (
                                <div key={i} className="p-4">
                                    <span className="text-3xl mb-2 block">{item.icon}</span>
                                    <p className="text-slate-600 text-sm">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-slate-500 text-sm mt-4 pt-4 border-t border-slate-100">
                            The cost of waiting isn't $197 — it's the clients and income you lose every month you delay.
                        </p>
                    </div>
                </div>
            </section>

            {/* Complete Offer Stack */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Offer Stack</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything You Get Today</h2>
                        <p className="text-lg text-slate-600">Here's the full breakdown of what's included in your certification.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {[
                                { item: "21-Module Clinical Training (168 Lessons)", value: "$2,497", desc: "Complete functional medicine education covering thyroid, gut, hormones, autoimmune, and more" },
                                { item: "22 Verifiable Certificates", value: "$1,100", desc: "Master FM Practitioner cert + 21 specialty certificates — one per module" },
                                { item: "80+ CEU Hours", value: "$400", desc: "Meets continuing education requirements for nurses, NPs, and health professionals" },
                                { item: "Personal 1:1 Mentorship", value: "$997", desc: "Sarah guides you personally until certified — questions, feedback, career support" },
                                { item: "Coach Workspace (Practice CRM)", value: "$1,200/yr", desc: "Client management, protocol builder, scheduling, invoicing — all built-in" },
                                { item: "18 Proprietary Protocols", value: "$497", desc: "Ready-to-use clinical frameworks: R.O.O.T.S.™, G.U.T.S.™, C.Y.C.L.E.™, and more" },
                                { item: "Career Launch Toolkit", value: "$297", desc: "Pricing guides, marketing templates, first client scripts" },
                                { item: "Private Community Access", value: "$197/yr", desc: "1,400+ practitioners — get answers, referrals, and support" },
                                { item: "6 Bonus Resources", value: "$497", desc: "Client intake templates, protocol builder, marketing kit, and more" },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-cream-50 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{row.item}</p>
                                        <p className="text-sm text-slate-500">{row.desc}</p>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="font-bold text-burgundy-600">{row.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-50 p-4 border-t-2 border-slate-200">
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-slate-900 text-lg">Total Value:</p>
                                <p className="text-2xl font-black text-burgundy-700">$7,682+</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-slate-600 mb-2">Your investment today:</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-3xl text-slate-400 line-through">$497</span>
                            <span className="text-5xl font-black text-burgundy-700">$197</span>
                        </div>
                        <p className="text-olive-600 font-semibold mt-2">Save $300 — Christmas Special</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-12 sm:py-16 bg-gradient-to-b from-white to-cream-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-4 py-2 mb-4">
                            <Users className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-semibold text-burgundy-700">Limited Enrollment — Only 23 Mentorship Spots Available</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Secure Your Spot Now</h2>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border-2 border-burgundy-100 overflow-hidden max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 px-6 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <GraduationCap className="h-5 w-5 text-gold-400" />
                                <span className="text-gold-400 font-semibold uppercase tracking-wide text-sm">Certified FM Practitioner</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <span className="text-white/60 line-through text-3xl">$497</span>
                                <span className="text-6xl font-black text-white">$197</span>
                            </div>
                            <p className="text-burgundy-200 text-sm mb-3">one-time payment</p>
                            <div className="inline-block bg-burgundy-600/50 rounded-lg px-4 py-2 border border-burgundy-500">
                                <p className="text-white font-medium">or <span className="font-bold">2 × $109/month</span></p>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* What's Included */}
                            <div className="mb-6">
                                <p className="font-semibold text-slate-800 mb-3 text-center">Everything Included:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "21 modules (168 lessons)",
                                        "21 specialty certificates",
                                        "Master FM Practitioner cert",
                                        "60+ hours, 80+ CEU",
                                        "Private 1:1 mentorship",
                                        "Coach Workspace access",
                                        "Career launch support",
                                        "6 bonuses ($497 value)",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />{item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key Benefits Row */}
                            <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-slate-100">
                                <div className="text-center">
                                    <Infinity className="h-5 w-5 text-burgundy-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-slate-800">Lifetime Access</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="h-5 w-5 text-burgundy-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-slate-800">Self-Paced</p>
                                </div>
                                <div className="text-center">
                                    <HeartHandshake className="h-5 w-5 text-burgundy-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-slate-800">Personal Mentorship</p>
                                </div>
                            </div>

                            {/* Behavioral Scarcity Note */}
                            <div className="bg-burgundy-50 rounded-xl p-4 mb-6 border border-burgundy-100">
                                <p className="text-burgundy-800 text-sm font-medium mb-2 text-center">Why Enrollment is Limited:</p>
                                <ul className="text-burgundy-700 text-xs space-y-1">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-burgundy-600 shrink-0" />1:1 mentorship is capped (I personally guide each student)</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-burgundy-600 shrink-0" />Assignment reviews and feedback are personalized</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-burgundy-600 shrink-0" />Certification validation is manual, not automated</li>
                                </ul>
                            </div>

                            <a href="https://sarah.accredipro.academy/checkout-fm-certification" className="block">
                                <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 rounded-xl text-lg shadow-lg">
                                    <GraduationCap className="h-5 w-5 mr-2" />
                                    Start My Certification — $197
                                </Button>
                            </a>

                            {/* Killer Lines - Remove hidden funnel fear */}
                            <div className="bg-olive-50 rounded-lg p-3 mt-4 border border-olive-100">
                                <p className="text-olive-800 text-xs text-center font-medium">
                                    ✔️ $197 is the full certification price • ✔️ No upsells required to get certified
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-olive-600" />30-day money-back guarantee</span>
                                <span>•</span>
                                <span>Instant access</span>
                                <span>•</span>
                                <span>Start today</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-6 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="flex -space-x-2">
                                {[...ALL_STUDENT_AVATARS].sort(() => Math.random() - 0.5).slice(0, 6).map((src, i) => (
                                    <Image key={i} src={src} alt="Student" width={32} height={32} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                                ))}
                            </div>
                            <p className="text-slate-600 text-sm"><strong className="text-slate-800">1,447</strong> practitioners certified</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Questions?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-6">
                        <FAQItem
                            question="How long does the certification take?"
                            answer={<>Most students complete in <strong>3-6 months</strong> studying 3-5 hours per week. Some finish faster (8 weeks with intensive study), others take longer. You have <strong>lifetime access</strong> — go at your pace. Your coach helps create a realistic timeline for your schedule.</>}
                        />
                        <FAQItem
                            question="Do I really get 21 separate certificates?"
                            answer={<>Yes! Each module awards its own specialty certificate: <strong>Thyroid Health Specialist, Gut Health Specialist, Women's Hormone Specialist, Autoimmune Specialist</strong>, etc. Plus the master <strong>Certified Functional Medicine Practitioner</strong> credential. That's 22 credentials total.</>}
                        />
                        <FAQItem
                            question="Can I work with clients after certification?"
                            answer={<>Absolutely. You'll graduate as a <strong>Certified Functional Medicine Health Coach</strong> — qualified to work with clients on nutrition, lifestyle, and wellness. Many graduates get their first paying client within <strong>2-4 weeks</strong> of finishing. Your coach helps with pricing, niching, and marketing.</>}
                        />
                        <FAQItem
                            question="How is the private mentorship delivered?"
                            answer={<>Your personal coach messages you directly through the portal. They <strong>check on your progress weekly</strong>, answer questions, help you through challenging modules, and support you in launching your practice. It's like having a business partner — not just a course you're left alone with.</>}
                        />
                        <FAQItem
                            question="Is $197 really the full price? What's the catch?"
                            answer={<><strong>Yes. $197 is the full price. No upsells required to get certified.</strong> Advanced group coaching and mentorship intensives are available but completely optional — not required to earn your credentials. We keep pricing accessible because we want more practitioners in this field. Plus <strong>30-day money-back guarantee</strong> — if it's not right, you get a full refund.</>}
                        />
                        <FAQItem
                            question="How much can I earn as a certified practitioner?"
                            answer={<>Our graduates are earning <strong>$5K-$8K/month part-time</strong> (8-12 clients), <strong>$10K-$15K/month full-time</strong> (18-30 clients), and <strong>$20K-$25K+/month</strong> with group programs. Session rates range from $125-$250+. The field is growing 15%+ annually — there's high demand.</>}
                        />
                        <FAQItem
                            question="What's the Coach Workspace?"
                            answer={<>A professional client management system built into your dashboard. <strong>Track client progress, create custom protocols, manage appointments</strong>, and run your entire practice from one place. It's designed specifically for FM practitioners — so you look professional from day one.</>}
                        />
                    </div>
                </div>
            </section>

            {/* Guarantee */}
            <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-olive-50 to-white rounded-3xl p-8 border-2 border-olive-200">
                        {/* Company Logo */}
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
                            alt="AccrediPro Academy"
                            width={80}
                            height={80}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">100% Money-Back Guarantee</h2>
                        <p className="text-slate-600 mb-4 max-w-xl mx-auto">
                            Enroll today, explore the content, meet your coach. If it's not right for you, email us within 30 days for a full refund. No questions asked.
                        </p>
                        <p className="text-xl font-bold text-olive-700">Your investment is completely protected.</p>
                    </div>
                </div>
            </section>

            {/* Professional Footer - Brand Colors */}
            <footer className="bg-gradient-to-b from-burgundy-900 to-burgundy-950 text-white">
                {/* Gold Accent Strip */}
                <div className="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

                {/* Main Footer Content */}
                <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-burgundy-700 to-burgundy-800 rounded-xl flex items-center justify-center border border-gold-400/30">
                                    <span className="text-gold-400 font-bold text-lg">AP</span>
                                </div>
                                <div>
                                    <span className="font-bold text-lg block">AccrediPro</span>
                                    <span className="text-gold-400 text-xs font-medium">ACADEMY</span>
                                </div>
                            </div>
                            <p className="text-cream-200 text-sm mb-4">
                                The world's most accessible Functional Medicine certification.
                            </p>
                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                <a href="https://www.facebook.com/accredipro" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-burgundy-800/50 hover:bg-gold-400 hover:text-burgundy-900 border border-burgundy-700 flex items-center justify-center transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="https://www.instagram.com/accredipro.academy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-burgundy-800/50 hover:bg-gold-400 hover:text-burgundy-900 border border-burgundy-700 flex items-center justify-center transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                </a>
                                <a href="https://www.youtube.com/@accredipro" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-burgundy-800/50 hover:bg-gold-400 hover:text-burgundy-900 border border-burgundy-700 flex items-center justify-center transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                                <a href="https://www.linkedin.com/company/accredipro" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-burgundy-800/50 hover:bg-gold-400 hover:text-burgundy-900 border border-burgundy-700 flex items-center justify-center transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-bold mb-4 text-gold-400 text-sm uppercase tracking-wide">Company</h4>
                            <ul className="space-y-2.5 text-sm text-cream-200">
                                <li><a href="/about" className="hover:text-gold-400 transition-colors">About Us</a></li>
                                <li><a href="https://learn.accredipro.academy/accreditation" className="hover:text-gold-400 transition-colors">Accreditations</a></li>
                                <li><a href="/faculty" className="hover:text-gold-400 transition-colors">Faculty</a></li>
                                <li><a href="/reviews" className="hover:text-gold-400 transition-colors">Student Reviews</a></li>
                                <li><a href="mailto:support@accredipro.academy" className="hover:text-gold-400 transition-colors">Contact Support</a></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-bold mb-4 text-gold-400 text-sm uppercase tracking-wide">Resources</h4>
                            <ul className="space-y-2.5 text-sm text-cream-200">
                                <li><a href="/blog" className="hover:text-gold-400 transition-colors">Latest News / Blog</a></li>
                                <li><a href="/functional-nutrition-guide" className="hover:text-gold-400 transition-colors">Functional Nutrition Guide</a></li>
                                <li><a href="/career-webinar" className="hover:text-gold-400 transition-colors">Career Webinar</a></li>
                                <li><a href="/graduate-directory" className="hover:text-gold-400 transition-colors">Graduate Directory</a></li>
                                <li><a href="https://learn.accredipro.academy/login" className="hover:text-gold-400 transition-colors">Student Portal</a></li>
                            </ul>
                        </div>

                        {/* Stay Updated */}
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-bold mb-4 text-gold-400 text-sm uppercase tracking-wide">Stay Updated</h4>
                            <p className="text-cream-200 text-sm mb-3">Get exclusive discounts and free resources.</p>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 bg-burgundy-800/50 border border-burgundy-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-cream-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                                />
                                <button className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                            {/* App Store Buttons */}
                            <p className="text-cream-400 text-xs mb-2">Download Learning App:</p>
                            <div className="flex gap-2">
                                <a href="https://play.google.com/store/apps/details?id=com.accredipro.academy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-burgundy-800/50 hover:bg-burgundy-700 border border-burgundy-700 rounded-lg px-3 py-1.5 transition-colors">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.807 1.626L15.5 12l2.198-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                                    <span className="text-xs font-medium">Play Store</span>
                                </a>
                                <a href="https://apps.apple.com/app/accredipro-academy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-burgundy-800/50 hover:bg-burgundy-700 border border-burgundy-700 rounded-lg px-3 py-1.5 transition-colors">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                                    <span className="text-xs font-medium">App Store</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Accreditation Badges */}
                    <div className="border-t border-burgundy-800/50 pt-8">
                        <p className="text-center text-xs text-gold-400/80 mb-4 uppercase tracking-wide font-medium">Internationally Accredited by 9 Organizations</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["CMA", "IPHM", "CPD", "IAOTH", "ICAHP", "IGCT", "CTAA", "IHTCP", "IIOHT"].map((acc, i) => (
                                <span key={i} className="bg-burgundy-800/30 border border-gold-400/20 px-3 py-1.5 rounded-lg text-xs font-medium text-cream-200">{acc}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-burgundy-800/50 bg-burgundy-950 py-5">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-300">
                            <p>© 2025 AccrediPro Academy. All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <a href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
                                <a href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</a>
                                <a href="/refund-policy" className="hover:text-gold-400 transition-colors">Refund Policy</a>
                            </div>
                        </div>
                        <p className="text-center text-xs text-cream-500 mt-4">
                            *Income ranges represent goals of certified practitioners. Results vary based on effort, background, and dedication.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
