"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Package,
    Search,
    Star,
    CheckCircle,
    Lock,
    Sparkles,
    Award,
    ShoppingCart,
    Zap,
    FileText,
    Users,
    ChevronRight,
    Briefcase,
    Heart,
    Brain,
    Flame,
    Target,
    Rocket,
    Crown,
    Gift,
    Eye,
    X,
    ListOrdered,
    Clock,
    DollarSign,
    TrendingUp,
    Shield,
    GraduationCap,
} from "lucide-react";

// ============================================
// CATEGORY 1: CORE CLIENT PROGRAMS
// ============================================
const CORE_PROGRAMS = [
    {
        id: "fm-4-week-jumpstart",
        title: "FM 4-Week Jumpstart Program",
        subtitle: "Perfect Entry Program for First Clients",
        description: "Give your first clients a professional, structured experience from day one. This done-for-you program includes everything you need to deliver results and build confidence as a new practitioner. Ideal for intro offers, discovery packages, or getting your first 'yes'.",
        type: "Core Program",
        badge: "ENTRY LEVEL",
        badgeColor: "bg-blue-600",
        icon: "🚀",
        price: 397,
        compareAtPrice: 597,
        clientPricing: "$600–$1,200",
        includes: [
            "4 weekly session plans with agendas",
            "Client workbook (PDF, white-label)",
            "Lifestyle & nutrition checklists",
            "Coach session agenda templates",
            "Progress tracker spreadsheet",
            "White-label rights included"
        ],
        bestFor: ["First clients", "Intro offers", "Building confidence"],
        deliveryTime: "Instant download",
        format: "PDF + Editable templates",
        rating: 4.9,
        reviewCount: 156,
        buyers: 892,
    },
    {
        id: "fm-8-week-transformation",
        title: "FM 8-Week Complete Transformation",
        subtitle: "The Gold Standard Core Program",
        description: "This is the program most successful FM practitioners use as their main 1:1 offer. Comprehensive, professional, and proven to deliver results. Everything is done-for-you—just add your expertise and start transforming lives.",
        type: "Core Program",
        badge: "BESTSELLER",
        badgeColor: "bg-burgundy-600",
        icon: "⭐",
        price: 697,
        compareAtPrice: 997,
        clientPricing: "$1,500–$3,000+",
        includes: [
            "8 detailed session plans",
            "Client workbook (50+ pages)",
            "Lifestyle reset framework",
            "Habit & compliance tracking tools",
            "Mid-program review template",
            "Coach implementation guide",
            "Email templates for each week",
            "White-label rights included"
        ],
        bestFor: ["Main 1:1 offer", "Serious transformation clients", "Building recurring revenue"],
        deliveryTime: "Instant download",
        format: "PDF + Editable templates + Video guides",
        rating: 5.0,
        reviewCount: 312,
        buyers: 1547,
        isBestseller: true,
    },
    {
        id: "fm-12-week-deep",
        title: "FM 12-Week Deep Transformation",
        subtitle: "Premium Program for Complex Cases",
        description: "For clients with chronic issues who need deeper support. This premium program positions you as a serious practitioner capable of handling complex cases. Includes advanced protocols and long-term habit building systems.",
        type: "Core Program",
        badge: "PREMIUM",
        badgeColor: "bg-purple-600",
        icon: "💎",
        price: 997,
        compareAtPrice: 1497,
        clientPricing: "$2,500–$5,000+",
        includes: [
            "12 comprehensive session plans",
            "Advanced client workbook (75+ pages)",
            "Deeper lifestyle layer protocols",
            "Long-term habit building system",
            "Outcome tracking dashboard",
            "Case documentation templates",
            "Client progress reports",
            "Renewal & continuation framework"
        ],
        bestFor: ["Chronic conditions", "Complex cases", "Premium positioning"],
        deliveryTime: "Instant download",
        format: "PDF + Editable templates + Video guides",
        rating: 4.9,
        reviewCount: 189,
        buyers: 634,
    },
    {
        id: "fm-6-month-mastery",
        title: "FM 6-Month Mastery System",
        subtitle: "Flagship High-Ticket Program",
        description: "Your ultimate flagship offer. This 6-month system is designed for practitioners ready to work with high-ticket clients on deep, lasting transformation. Includes retainer-style structure and full client journey systems.",
        type: "Flagship Program",
        badge: "HIGH-TICKET",
        badgeColor: "bg-gold-600",
        icon: "👑",
        price: 1997,
        compareAtPrice: 2997,
        clientPricing: "$5,000–$10,000+",
        includes: [
            "24 session plans (bi-weekly)",
            "Full client journey system",
            "Long-term progress tracking",
            "Retainer-style structure",
            "Coach SOPs & workflows",
            "Client offboarding flows",
            "Renewal & upsell sequences",
            "VIP client experience templates"
        ],
        bestFor: ["High-ticket clients", "Long-term care", "Premium practice positioning"],
        deliveryTime: "Instant download",
        format: "Complete business system",
        rating: 5.0,
        reviewCount: 87,
        buyers: 234,
    },
];

// ============================================
// CATEGORY 2: SPECIALTY CLIENT KITS
// ============================================
const SPECIALTY_KITS = [
    {
        id: "gut-reset-kit",
        title: "Gut Reset Kit",
        subtitle: "4R Framework Done-For-You",
        description: "Complete gut health program using the proven 4R framework. Perfect add-on to any core program or standalone specialty offer.",
        icon: "🍃",
        price: 297,
        compareAtPrice: 447,
        clientPricing: "$400–$800",
        includes: [
            "4R framework client guide",
            "Gut health education materials",
            "Food lists & meal plans",
            "Lifestyle modification tools",
            "Coaching conversation guides"
        ],
        category: "Digestive Health",
        rating: 4.9,
        reviewCount: 234,
    },
    {
        id: "hormone-balance-kit",
        title: "Hormone Balance Kit",
        subtitle: "Female Hormone Support System",
        description: "Help women understand and optimize their hormones naturally. Includes cycle-syncing strategies and lifestyle alignment tools.",
        icon: "🌸",
        price: 247,
        compareAtPrice: 397,
        clientPricing: "$350–$700",
        includes: [
            "Female hormone education guide",
            "Cycle & lifestyle alignment tools",
            "Coaching conversation guides",
            "Symptom tracking templates",
            "Nutrition protocols"
        ],
        category: "Women's Health",
        rating: 4.8,
        reviewCount: 178,
    },
    {
        id: "menopause-support-kit",
        title: "Menopause Support Kit",
        subtitle: "Navigate the Transition with Confidence",
        description: "Comprehensive support system for women navigating perimenopause and menopause. Lifestyle strategies and client reassurance tools.",
        icon: "🦋",
        price: 197,
        compareAtPrice: 297,
        clientPricing: "$300–$600",
        includes: [
            "Menopause symptom support guide",
            "Lifestyle strategies workbook",
            "Client reassurance tools",
            "Hot flash management protocols",
            "Sleep optimization guides"
        ],
        category: "Women's Health",
        rating: 4.9,
        reviewCount: 145,
    },
    {
        id: "blood-sugar-kit",
        title: "Blood Sugar Balance Kit",
        subtitle: "Insulin Resistance Support System",
        description: "Help clients stabilize blood sugar naturally. Includes nutrition behavior coaching tools and progress tracking systems.",
        icon: "📊",
        price: 197,
        compareAtPrice: 297,
        clientPricing: "$300–$600",
        includes: [
            "Insulin resistance education",
            "Nutrition behavior coaching tools",
            "Blood sugar tracking sheets",
            "Meal timing protocols",
            "Lifestyle modification guides"
        ],
        category: "Metabolic Health",
        rating: 4.8,
        reviewCount: 167,
    },
    {
        id: "adrenal-recovery-kit",
        title: "Cortisol & Adrenal Recovery Kit",
        subtitle: "Stress Physiology Support System",
        description: "Address the root cause of burnout and fatigue. Comprehensive stress physiology education and nervous system regulation tools.",
        icon: "⚡",
        price: 297,
        compareAtPrice: 447,
        clientPricing: "$400–$800",
        includes: [
            "Stress physiology education",
            "Nervous system regulation tools",
            "Energy recovery plans",
            "Sleep optimization protocols",
            "Lifestyle stress audit"
        ],
        category: "Stress & Energy",
        rating: 4.9,
        reviewCount: 198,
    },
    {
        id: "nervous-system-kit",
        title: "Nervous System Reset Kit",
        subtitle: "Vagal Tone & Regulation System",
        description: "Help clients regulate their nervous system for better health outcomes. Includes breath work practices and daily routines.",
        icon: "🧠",
        price: 247,
        compareAtPrice: 347,
        clientPricing: "$350–$700",
        includes: [
            "Vagal tone education guide",
            "Breath & regulation practices",
            "Client daily routines",
            "Stress response tracking",
            "Relaxation protocols"
        ],
        category: "Stress & Energy",
        rating: 4.8,
        reviewCount: 156,
    },
    {
        id: "weight-loss-fm-kit",
        title: "Weight Loss FM Kit",
        subtitle: "Root-Cause Approach to Weight",
        description: "Move beyond calories with a functional medicine approach to weight. Addresses emotional eating and metabolic dysfunction.",
        icon: "⚖️",
        price: 247,
        compareAtPrice: 397,
        clientPricing: "$400–$800",
        includes: [
            "Root-cause weight assessment",
            "Emotional eating tools",
            "Progress frameworks",
            "Metabolic support protocols",
            "Behavior change guides"
        ],
        category: "Weight Management",
        rating: 4.7,
        reviewCount: 189,
    },
];

// ============================================
// CATEGORY 3: PRACTITIONER BUSINESS KITS
// ============================================
const BUSINESS_KITS = [
    {
        id: "practitioner-launch-kit",
        title: "Practitioner Launch Kit",
        subtitle: "Everything to Start Your Practice",
        description: "Remove all the setup friction. This kit gives you every document, form, and template you need to look professional from day one. Just customize and launch.",
        icon: "📋",
        badge: "ESSENTIAL",
        badgeColor: "bg-green-600",
        price: 497,
        compareAtPrice: 997,
        includes: [
            "Coaching agreement (legal template)",
            "Scope of practice document",
            "Informed consent forms",
            "Comprehensive intake forms",
            "Session notes templates",
            "Welcome packet for clients",
            "Offboarding documentation",
            "Professional email templates"
        ],
        rating: 5.0,
        reviewCount: 456,
        buyers: 2134,
        isPopular: true,
    },
    {
        id: "authority-website-kit",
        title: "Authority Website Kit",
        subtitle: "DFY Website Copy & Structure",
        description: "Professional website copy that positions you as an authority. Every page written with compliance in mind. Just paste into your website builder.",
        icon: "🌐",
        badge: "PREMIUM",
        badgeColor: "bg-purple-600",
        price: 2497,
        compareAtPrice: 4000,
        includes: [
            "Homepage copy (conversion-optimized)",
            "Services page copy",
            "About page structure & copy",
            "Booking page language",
            "Compliance wording throughout",
            "SEO-optimized meta descriptions",
            "Call-to-action templates",
            "Testimonial display frameworks"
        ],
        rating: 4.9,
        reviewCount: 123,
        buyers: 567,
    },
    {
        id: "client-acquisition-system",
        title: "Client Acquisition System",
        subtitle: "DFY Marketing & Lead Generation",
        description: "A complete marketing system to attract and convert ideal clients. Includes lead magnets, email sequences, and booking automation.",
        icon: "🎯",
        badge: "GROWTH",
        badgeColor: "bg-blue-600",
        price: 3497,
        compareAtPrice: 6000,
        includes: [
            "Lead magnet (PDF guide)",
            "Landing page copy",
            "5-email nurture sequence",
            "Booking automation scripts",
            "Social media templates",
            "Discovery call script",
            "Follow-up sequences",
            "Referral request templates"
        ],
        rating: 4.9,
        reviewCount: 89,
        buyers: 312,
    },
];

// ============================================
// CATEGORY 4: ACCELERATOR BUNDLES
// ============================================
const ACCELERATOR_BUNDLES = [
    {
        id: "practice-launch-accelerator",
        title: "FM Practice Launch Accelerator",
        subtitle: "6-Month Program — Everything to Launch & Start Earning",
        description: "The complete done-for-you package to launch your practice and start earning immediately. We handle ALL the setup—you just focus on helping people. Includes core program, business setup, website, social media templates, and full marketing campaigns ready to go.",
        icon: "🚀",
        badge: "6-MONTH PROGRAM",
        badgeColor: "bg-gradient-to-r from-burgundy-600 to-gold-500",
        price: 7500,
        compareAtPrice: 12000,
        savings: 4500,
        duration: "6 Months",
        earningGuarantee: "$5,000+ in first 90 days or extended support FREE",
        includes: [
            "Practitioner Launch Kit ($497 value)",
            "8-Week Core Program ($697 value)",
            "Authority Website Kit — FULLY DONE FOR YOU ($2,497 value)",
            "30-Day Social Media Content Calendar — DONE FOR YOU",
            "Email Marketing Campaigns — FULLY WRITTEN",
            "Lead Magnet Funnel — READY TO LAUNCH",
            "Client Onboarding Automation — SET UP FOR YOU",
            "1:1 Implementation Call + Strategy Session",
            "Private Community Access",
            "90-Day Priority Support"
        ],
        highlights: [
            "We build your website — you just approve",
            "We write your emails — you just send",
            "We create your social posts — you just publish",
            "We design your funnels — you just launch"
        ],
        includedProducts: ["practitioner-launch-kit", "fm-8-week-transformation", "authority-website-kit"],
        rating: 5.0,
        reviewCount: 67,
        buyers: 189,
    },
    {
        id: "growth-accelerator",
        title: "FM Growth Accelerator",
        subtitle: "12-Month Program — Scale to $10K+ Months GUARANTEED",
        description: "For practitioners ready to scale to a full-time income. This is the ULTIMATE done-for-you system. We handle EVERYTHING—website, marketing, ads, social media, email campaigns, client systems. You focus 100% on helping people transform their health. We handle ALL the business.",
        icon: "👑",
        badge: "12-MONTH PROGRAM",
        badgeColor: "bg-gradient-to-r from-gold-500 to-gold-600",
        price: 14997,
        compareAtPrice: 25000,
        savings: 10003,
        duration: "12 Months",
        earningGuarantee: "$10,000+/month by month 6 or 6 months FREE extended support",
        includes: [
            "EVERYTHING in Launch Accelerator ($7,500 value)",
            "Client Acquisition System — FULLY DONE FOR YOU ($3,497 value)",
            "3 Specialty Kits of Your Choice ($750 value)",
            "12-Week Deep Program ($997 value)",
            "90-Day Social Media Calendar — WE CREATE IT ALL",
            "Complete Email Marketing System — 52 WEEKS OF EMAILS WRITTEN",
            "Paid Ads Campaign Setup — FB/IG ADS READY TO RUN",
            "Lead Generation Funnels — FULLY BUILT",
            "Client CRM Setup — AUTOMATED FOLLOW-UPS",
            "Referral Program Templates — DONE FOR YOU",
            "Monthly Strategy Calls (12 total)",
            "12-Month Priority Support + Slack Access"
        ],
        highlights: [
            "FULLY DONE FOR YOU — We handle everything",
            "90 days of social media posts CREATED FOR YOU",
            "52 weeks of email campaigns PRE-WRITTEN",
            "Paid ads campaigns READY TO LAUNCH",
            "You focus on clients — WE HANDLE THE REST"
        ],
        includedProducts: ["practice-launch-accelerator", "client-acquisition-system", "fm-12-week-deep"],
        rating: 5.0,
        reviewCount: 34,
        buyers: 78,
    },
];

// User access simulation (in production, from session)
const USER_ACCESS = {
    level: "STEP_1", // MINI_DIPLOMA | STEP_1 | ADVANCED
    isCertified: true,
};

export default function ClientProgramLibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"core" | "specialty" | "business" | "accelerators">("core");
    const [previewItem, setPreviewItem] = useState<typeof CORE_PROGRAMS[0] | typeof SPECIALTY_KITS[0] | typeof BUSINESS_KITS[0] | null>(null);

    const canAccess = USER_ACCESS.level !== "MINI_DIPLOMA";

    const handlePurchase = (item: { title: string; price: number }) => {
        if (!canAccess) {
            alert("🔒 Complete your Step 1 Certification to unlock the Client Program Library!\n\nThese done-for-you resources are available to certified practitioners.");
            return;
        }
        alert(`🛒 Added "${item.title}" to cart for $${item.price.toLocaleString()}\n\n(Checkout coming soon!)`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Hero Header with Logo */}
            <div className="relative mb-10 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                            {/* Logo Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                    </svg>
                                </div>
                                <div>
                                    <Badge className="bg-gold-400 text-burgundy-900 border-0 font-bold mb-1">Done-For-You Resources</Badge>
                                    <p className="text-sm text-burgundy-200">AccrediPro Academy</p>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Client Program Library
                            </h1>

                            <p className="text-lg text-burgundy-100 max-w-2xl mb-6">
                                Professional, done-for-you programs and business kits.
                                <span className="text-gold-300 font-medium"> Start earning faster with client-ready assets.</span>
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-6">
                                <span className="flex items-center gap-1"><Package className="w-4 h-4 text-gold-400" /> {CORE_PROGRAMS.length + SPECIALTY_KITS.length + BUSINESS_KITS.length}+ Resources</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-gold-400" /> 743+ practitioners using</span>
                                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold-400" /> 4.9 Avg Rating</span>
                            </div>

                            {/* Value Proposition */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-lg">
                                <p className="text-sm font-medium text-gold-300 mb-2">Why DFY Resources?</p>
                                <ul className="text-sm text-white/80 space-y-1">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Start earning immediately after certification</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Look professional from Day 1</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> White-label rights included</li>
                                </ul>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full md:w-80">
                            <p className="text-sm font-semibold text-gold-300 mb-4">Practitioner Results</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80 text-sm">Avg. client pricing:</span>
                                    <span className="font-bold text-white">$1,500+</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80 text-sm">Time to first client:</span>
                                    <span className="font-bold text-white">2-4 weeks</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80 text-sm">ROI on resources:</span>
                                    <span className="font-bold text-green-400">10-50x</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20">
                                <p className="text-xs text-white/60 italic">"I made back my investment with my first client!" — Sarah M.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Access Notice for Mini Diploma */}
            {!canAccess && (
                <div className="mb-6 bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Unlock Full Access</p>
                            <p className="text-sm text-gray-600">Complete your Step 1 Certification to access DFY resources</p>
                        </div>
                    </div>
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                        View Certification <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setActiveTab("core")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "core" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                    <Target className="w-4 h-4" /> Core Programs ({CORE_PROGRAMS.length})
                </button>
                <button
                    onClick={() => setActiveTab("specialty")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "specialty" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                    <Sparkles className="w-4 h-4" /> Specialty Kits ({SPECIALTY_KITS.length})
                </button>
                <button
                    onClick={() => setActiveTab("business")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "business" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                    <Briefcase className="w-4 h-4" /> Business Kits ({BUSINESS_KITS.length})
                </button>
                <button
                    onClick={() => setActiveTab("accelerators")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "accelerators" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                    <Rocket className="w-4 h-4" /> Accelerators ({ACCELERATOR_BUNDLES.length})
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs">Save $10K+</Badge>
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Search programs, kits, and resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-5 rounded-xl border-gray-200"
                />
            </div>

            {/* ==================== CORE PROGRAMS TAB ==================== */}
            {activeTab === "core" && (
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-burgundy-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Core Client Programs</h2>
                            <p className="text-gray-600">The backbone of every successful FM practice. Pick your signature offer.</p>
                        </div>
                    </div>

                    {/* Programs Grid */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {CORE_PROGRAMS.map((program) => (
                            <div key={program.id} className={`bg-white rounded-2xl border ${program.isBestseller ? "border-burgundy-300 ring-2 ring-burgundy-100" : "border-gray-100"} overflow-hidden hover:shadow-xl transition-all group relative`}>
                                {program.isBestseller && (
                                    <div className="absolute top-0 right-0 bg-burgundy-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-xl z-10">
                                        ⭐ BESTSELLER
                                    </div>
                                )}
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{program.icon}</span>
                                            <div>
                                                <Badge className={`${program.badgeColor} text-white border-0 text-xs mb-1`}>{program.badge}</Badge>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-burgundy-600">{program.title}</h3>
                                                <p className="text-sm text-burgundy-600">{program.subtitle}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">{program.description}</p>

                                    {/* Client Pricing Highlight */}
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="text-xs text-green-700 font-medium">Your clients pay you:</p>
                                                <p className="text-lg font-bold text-green-700">{program.clientPricing}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What's Included */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">WHAT'S INCLUDED:</p>
                                        <ul className="space-y-1">
                                            {program.includes.slice(0, 4).map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-burgundy-500 flex-shrink-0 mt-0.5" /> {item}
                                                </li>
                                            ))}
                                            {program.includes.length > 4 && (
                                                <li className="text-sm text-burgundy-600 font-medium">+ {program.includes.length - 4} more...</li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" /> {program.rating}</span>
                                            <span>•</span>
                                            <span>{program.buyers?.toLocaleString()}+ purchased</span>
                                        </div>
                                        <button
                                            onClick={() => setPreviewItem(program)}
                                            className="text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" /> Preview
                                        </button>
                                    </div>

                                    {/* Pricing & CTA */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="text-2xl font-bold text-burgundy-700">${program.price}</span>
                                            <span className="text-lg text-gray-400 line-through ml-2">${program.compareAtPrice}</span>
                                        </div>
                                        <Button
                                            className={`${canAccess ? "bg-burgundy-600 hover:bg-burgundy-700" : "bg-gray-400"}`}
                                            onClick={() => handlePurchase(program)}
                                        >
                                            {canAccess ? <><ShoppingCart className="w-4 h-4 mr-2" /> Get Program</> : <><Lock className="w-4 h-4 mr-2" /> Unlock</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================== SPECIALTY KITS TAB ==================== */}
            {activeTab === "specialty" && (
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Specialty Client Kits</h2>
                            <p className="text-gray-600">Problem-specific add-ons to enhance your core programs.</p>
                        </div>
                    </div>

                    {/* Kits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SPECIALTY_KITS.map((kit) => (
                            <div key={kit.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-3xl">{kit.icon}</span>
                                        <Badge variant="outline" className="text-xs">{kit.category}</Badge>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-burgundy-600">{kit.title}</h3>
                                    <p className="text-sm text-burgundy-600 mb-2">{kit.subtitle}</p>
                                    <p className="text-gray-600 text-sm mb-3">{kit.description}</p>

                                    {/* What's Included Preview */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">INCLUDES:</p>
                                        <ul className="space-y-1">
                                            {kit.includes.slice(0, 3).map((item, i) => (
                                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                                    <CheckCircle className="w-3 h-3 text-burgundy-500 flex-shrink-0 mt-0.5" /> {item}
                                                </li>
                                            ))}
                                            {kit.includes.length > 3 && (
                                                <li className="text-xs text-burgundy-600 font-medium">+ {kit.includes.length - 3} more...</li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Client Pricing */}
                                    <div className="bg-green-50 rounded-lg p-2 mb-3 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-700">Client pricing: <strong>{kit.clientPricing}</strong></span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" /> {kit.rating}</span>
                                            <span>•</span>
                                            <span>{kit.reviewCount} reviews</span>
                                        </div>
                                        <button
                                            onClick={() => setPreviewItem(kit)}
                                            className="text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" /> Preview
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div>
                                            <span className="text-xl font-bold text-burgundy-700">${kit.price}</span>
                                            <span className="text-sm text-gray-400 line-through ml-2">${kit.compareAtPrice}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className={`${canAccess ? "bg-burgundy-600 hover:bg-burgundy-700" : "bg-gray-400"}`}
                                            onClick={() => handlePurchase(kit)}
                                        >
                                            {canAccess ? "Add to Cart" : <Lock className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================== BUSINESS KITS TAB ==================== */}
            {activeTab === "business" && (
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Practitioner Business Kits</h2>
                            <p className="text-gray-600">DFY infrastructure for your practice. Remove all setup friction.</p>
                        </div>
                    </div>

                    {/* Business Kits */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {BUSINESS_KITS.map((kit) => (
                            <div key={kit.id} className={`bg-white rounded-2xl border ${kit.isPopular ? "border-green-300 ring-2 ring-green-100" : "border-gray-100"} overflow-hidden hover:shadow-xl transition-all relative`}>
                                {kit.isPopular && (
                                    <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-xl">
                                        🔥 POPULAR
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">{kit.icon}</span>
                                        <Badge className={`${kit.badgeColor} text-white border-0 text-xs`}>{kit.badge}</Badge>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{kit.title}</h3>
                                    <p className="text-sm text-burgundy-600 mb-3">{kit.subtitle}</p>
                                    <p className="text-gray-600 text-sm mb-4">{kit.description}</p>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">INCLUDES:</p>
                                        <ul className="space-y-1">
                                            {kit.includes.slice(0, 5).map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {item}
                                                </li>
                                            ))}
                                            {kit.includes.length > 5 && (
                                                <li className="text-sm text-burgundy-600 font-medium">+ {kit.includes.length - 5} more...</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" /> {kit.rating}</span>
                                            <span>•</span>
                                            <span>{kit.buyers?.toLocaleString()}+ purchased</span>
                                        </div>
                                        <button
                                            onClick={() => setPreviewItem(kit)}
                                            className="text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" /> Preview
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-2xl font-bold text-burgundy-700">${kit.price.toLocaleString()}</span>
                                                <span className="text-lg text-gray-400 line-through ml-2">${kit.compareAtPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Button
                                            className={`w-full ${canAccess ? "bg-burgundy-600 hover:bg-burgundy-700" : "bg-gray-400"}`}
                                            onClick={() => handlePurchase(kit)}
                                        >
                                            {canAccess ? <><ShoppingCart className="w-4 h-4 mr-2" /> Get Business Kit</> : <><Lock className="w-4 h-4 mr-2" /> Unlock Access</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================== ACCELERATORS TAB ==================== */}
            {activeTab === "accelerators" && (
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-gold-100 rounded-xl flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-burgundy-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Accelerator Bundles</h2>
                            <p className="text-gray-600">Maximum value packages for serious practitioners ready to scale. <span className="text-burgundy-600 font-semibold">We handle EVERYTHING — you just help people.</span></p>
                        </div>
                    </div>

                    {/* DFY Banner */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-bold text-green-800">100% DONE-FOR-YOU</p>
                                <p className="text-sm text-green-700">Website, Social Media, Email Campaigns, Ads, Funnels — We create it ALL. You focus on helping clients.</p>
                            </div>
                        </div>
                    </div>

                    {/* Accelerator Bundles */}
                    {ACCELERATOR_BUNDLES.map((bundle) => (
                        <div key={bundle.id} className="bg-gradient-to-r from-burgundy-50 via-white to-gold-50 rounded-2xl border-2 border-burgundy-200 p-8 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 ${bundle.badgeColor} text-white px-6 py-2 text-sm font-bold rounded-bl-2xl`}>
                                {bundle.badge}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-6xl">{bundle.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{bundle.title}</h3>
                                            <p className="text-burgundy-600 font-medium">{bundle.subtitle}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4">{bundle.description}</p>

                                    {/* Earning Guarantee */}
                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-xl p-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-green-800 uppercase">Earning Guarantee</p>
                                                <p className="text-lg font-bold text-green-700">{bundle.earningGuarantee}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DFY Highlights */}
                                    {"highlights" in bundle && (
                                        <div className="bg-burgundy-50 border border-burgundy-200 rounded-xl p-4 mb-6">
                                            <p className="text-sm font-bold text-burgundy-800 mb-3 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> DONE-FOR-YOU HIGHLIGHTS:
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {bundle.highlights.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-burgundy-700 font-medium">
                                                        <CheckCircle className="w-4 h-4 text-burgundy-500" /> {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white/80 rounded-xl p-5 mb-6">
                                        <p className="text-sm font-semibold text-gray-500 mb-3">EVERYTHING INCLUDED:</p>
                                        <div className="grid md:grid-cols-2 gap-2">
                                            {bundle.includes.map((item, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span><Star className="w-4 h-4 inline mr-1 text-yellow-500" /> {bundle.rating} ({bundle.reviewCount} reviews)</span>
                                        <span>•</span>
                                        <span><Users className="w-4 h-4 inline mr-1" /> {bundle.buyers} practitioners enrolled</span>
                                        <span>•</span>
                                        <span><Clock className="w-4 h-4 inline mr-1" /> {bundle.duration}</span>
                                    </div>
                                </div>

                                <div className="lg:w-80 bg-white rounded-xl p-6 shadow-lg">
                                    {/* Duration Badge */}
                                    <div className="text-center mb-4">
                                        <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-sm px-4 py-1 mb-3">
                                            <Clock className="w-3 h-3 inline mr-1" /> {bundle.duration} Program
                                        </Badge>
                                        <div className="mb-2">
                                            <span className="text-4xl font-bold text-burgundy-700">${bundle.price.toLocaleString()}</span>
                                            <span className="text-xl text-gray-400 line-through ml-2">${bundle.compareAtPrice.toLocaleString()}</span>
                                        </div>
                                        <Badge className="bg-red-100 text-red-700 border-0 text-lg px-4 py-1">
                                            Save ${bundle.savings.toLocaleString()}
                                        </Badge>
                                    </div>

                                    <Button
                                        className={`w-full py-6 text-lg mb-3 ${canAccess ? "bg-burgundy-600 hover:bg-burgundy-700" : "bg-gray-400"}`}
                                        onClick={() => handlePurchase(bundle)}
                                    >
                                        {canAccess ? <><Zap className="w-5 h-5 mr-2" /> Get Accelerator</> : <><Lock className="w-5 h-5 mr-2" /> Unlock Access</>}
                                    </Button>

                                    {/* Contact Coach CTA */}
                                    <Button
                                        variant="outline"
                                        className="w-full py-4 mb-3 border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50"
                                    >
                                        <Users className="w-4 h-4 mr-2" /> Contact Your Coach
                                    </Button>

                                    <p className="text-xs text-center text-gray-500 mb-3">Questions? Chat with your coach first.</p>

                                    <div className="pt-3 border-t border-gray-100 space-y-2">
                                        <p className="text-xs text-gray-500 text-center">
                                            💳 Payment plans available
                                        </p>
                                        <p className="text-xs text-green-600 text-center font-medium">
                                            ✓ Earning Guarantee Included
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Not Sure Where to Start?</h2>
                            <p className="text-white/70">Chat with your coach and we'll recommend the right resources for you.</p>
                        </div>
                    </div>
                    <Button className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-semibold px-8 py-6 text-lg">
                        Chat with Your Coach <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>

            {/* AccrediPro Branding Footer */}
            <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 bg-burgundy-600 rounded flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        </svg>
                    </div>
                    <span>AccrediPro Academy • Client Program Library</span>
                </div>
            </div>

            {/* Preview Modal */}
            {previewItem && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white p-6 rounded-t-2xl">
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-start gap-4">
                            <span className="text-5xl">{previewItem.icon}</span>
                            <div>
                                <h2 className="text-2xl font-bold">{previewItem.title}</h2>
                                <p className="text-burgundy-200">{previewItem.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-2">About This Resource</h3>
                            <p className="text-gray-600 leading-relaxed">{previewItem.description}</p>
                        </div>

                        {"clientPricing" in previewItem && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="text-sm text-green-700">Your clients will pay you:</p>
                                        <p className="text-2xl font-bold text-green-700">{previewItem.clientPricing}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3">What's Included</h3>
                            <ul className="space-y-2">
                                {previewItem.includes.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {"bestFor" in previewItem && (
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-3">Best For</h3>
                                <div className="flex flex-wrap gap-2">
                                    {previewItem.bestFor.map((item) => (
                                        <Badge key={item} variant="outline" className="bg-burgundy-50 text-burgundy-700 border-burgundy-200">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pricing & CTA */}
                        <div className="border-t pt-6 flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-bold text-burgundy-700">${previewItem.price.toLocaleString()}</span>
                                <span className="text-lg text-gray-400 line-through ml-2">${previewItem.compareAtPrice.toLocaleString()}</span>
                            </div>
                            <Button
                                className={`px-8 ${canAccess ? "bg-burgundy-600 hover:bg-burgundy-700" : "bg-gray-400"}`}
                                onClick={() => {
                                    handlePurchase(previewItem);
                                    setPreviewItem(null);
                                }}
                            >
                                {canAccess ? <><ShoppingCart className="w-4 h-4 mr-2" /> Get This Resource</> : <><Lock className="w-4 h-4 mr-2" /> Unlock Access</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
