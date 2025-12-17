"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    Search,
    Star,
    Package,
    ChevronRight,
    CheckCircle,
    Lock,
    Sparkles,
    TrendingUp,
    Award,
    ShoppingCart,
    Gift,
    Zap,
    Library,
    GraduationCap,
    FileText,
    Clock,
    Tag,
    ArrowRight,
    Users,
    X,
    Eye,
    ListOrdered,
} from "lucide-react";

// Categories for Functional Medicine
const CATEGORIES = [
    { id: "all", label: "All E-Books", icon: "📚" },
    { id: "core", label: "Core Guides", icon: "📘" },
    { id: "gut", label: "Gut Health", icon: "🍃" },
    { id: "hormones", label: "Hormones", icon: "🌸" },
    { id: "thyroid", label: "Thyroid", icon: "🦋" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
    { id: "inflammation", label: "Inflammation", icon: "🔥" },
];

// Functional Medicine E-Books - Core Guides
const CORE_EBOOKS = [
    {
        id: "practitioner-reality-playbook",
        title: "The Practitioner Reality Playbook",
        subtitle: "What They Don't Teach in Certification Programs",
        description: "The essential real-world guide for new functional medicine practitioners. This comprehensive playbook covers everything from setting up your practice and managing difficult clients to establishing healthy boundaries and building sustainable income. Written by practitioners who've been there, this guide helps you avoid the costly mistakes that derail most new practices.",
        price: 47,
        compareAtPrice: 67,
        graduatePrice: 37,
        pages: "48-60",
        readTime: "2-3 hours",
        icon: "📘",
        category: "core",
        topics: ["Practice Setup", "Client Management", "Boundaries", "Business Basics"],
        highlights: [
            "Reality check: What your first year really looks like",
            "7 mistakes that bankrupt new practitioners",
            "Scripts for handling difficult conversations",
            "Pricing strategies that actually work",
            "How to say no without guilt"
        ],
        chapters: 8,
        isBestseller: true,
        rating: 4.9,
        reviewCount: 127,
        tableOfContents: [
            "Chapter 1: The Reality of Starting a Practice",
            "Chapter 2: Setting Up Your Business Foundation",
            "Chapter 3: Pricing & Financial Planning",
            "Chapter 4: Managing Client Expectations",
            "Chapter 5: Handling Difficult Conversations",
            "Chapter 6: Boundaries That Protect Your Practice",
            "Chapter 7: Building Referral Networks",
            "Chapter 8: Long-term Sustainability"
        ]
    },
    {
        id: "first-client-guide",
        title: "From Certificate to Client",
        subtitle: "Your First 90 Days as a Practitioner",
        description: "A detailed step-by-step guide to landing and successfully working with your first paying clients. This practical resource includes ready-to-use intake forms, session scripts you can follow word-for-word, and proven follow-up templates. Perfect for practitioners who just finished their certification and want a clear roadmap to their first successful client outcomes.",
        price: 57,
        compareAtPrice: 77,
        graduatePrice: 47,
        pages: "60-75",
        readTime: "3-4 hours",
        icon: "🎯",
        category: "core",
        topics: ["Client Acquisition", "Intake Process", "Session Structure", "Follow-up Systems"],
        highlights: [
            "90-day launch roadmap",
            "Complete intake form templates",
            "First session script (word-for-word)",
            "Follow-up sequence templates",
            "Red flags to watch for in potential clients"
        ],
        chapters: 10,
        isBestseller: false,
        rating: 4.8,
        reviewCount: 89,
        tableOfContents: [
            "Chapter 1: Your 90-Day Launch Roadmap",
            "Chapter 2: Finding Your First Clients",
            "Chapter 3: The Discovery Call Framework",
            "Chapter 4: Intake Forms & Questionnaires",
            "Chapter 5: Your First Session Script",
            "Chapter 6: Building a Session Structure",
            "Chapter 7: Follow-up Systems That Work",
            "Chapter 8: Managing Client Progress",
            "Chapter 9: Identifying Red Flags Early",
            "Chapter 10: Templates & Resources"
        ]
    },
    {
        id: "scope-ethics-guide",
        title: "Scope of Practice & Ethics Guide",
        subtitle: "Protecting Yourself While Helping Clients",
        description: "Navigate the complex legal and ethical landscape of functional medicine practice with confidence. This essential guide helps you understand exactly what you can and cannot do, say, and recommend as a practitioner. Includes real-world scenarios, documentation templates, and clear guidelines for staying within your scope while maximizing your impact.",
        price: 37,
        compareAtPrice: 57,
        graduatePrice: 27,
        pages: "40-55",
        readTime: "2 hours",
        icon: "⚖️",
        category: "core",
        topics: ["Legal Boundaries", "Scope of Practice", "Documentation", "Liability Protection"],
        highlights: [
            "What you CAN and CANNOT say/recommend",
            "Documentation that protects you",
            "When to refer out (and to whom)",
            "Insurance and liability basics",
            "20+ real scenarios with guidance"
        ],
        chapters: 6,
        isBestseller: false,
        rating: 4.9,
        reviewCount: 156,
        tableOfContents: [
            "Chapter 1: Understanding Your Scope of Practice",
            "Chapter 2: Language That Protects You",
            "Chapter 3: Documentation Best Practices",
            "Chapter 4: When & How to Refer Out",
            "Chapter 5: Insurance & Liability Essentials",
            "Chapter 6: Real-World Scenario Guide"
        ]
    },
    {
        id: "case-walkthroughs",
        title: "Clinical Case Walkthroughs",
        subtitle: "10 Real Cases from Start to Resolution",
        description: "Follow along with 10 detailed, real-world case studies showing the complete practitioner journey from initial intake to successful client outcomes. Each case includes actual lab results with expert interpretations, protocol decisions with the reasoning behind them, and honest discussions of what went wrong along the way. The closest thing to mentorship without the mentor.",
        price: 67,
        compareAtPrice: 97,
        graduatePrice: 57,
        pages: "70-85",
        readTime: "4-5 hours",
        icon: "📋",
        category: "core",
        topics: ["Case Studies", "Lab Interpretation", "Protocol Design", "Clinical Reasoning"],
        highlights: [
            "10 complete case studies",
            "Lab results with interpretations",
            "Protocol decisions explained",
            "Client communication examples",
            "What went wrong and why"
        ],
        chapters: 12,
        isBestseller: true,
        rating: 5.0,
        reviewCount: 203,
        tableOfContents: [
            "Chapter 1: How to Use This Guide",
            "Chapter 2: Case 1 - Complex Fatigue & Adrenal Issues",
            "Chapter 3: Case 2 - Chronic Digestive Complaints",
            "Chapter 4: Case 3 - Hormone Imbalance Journey",
            "Chapter 5: Case 4 - Autoimmune Protocol",
            "Chapter 6: Case 5 - Weight Loss Resistance",
            "Chapter 7: Case 6 - Brain Fog & Cognitive Issues",
            "Chapter 8: Case 7 - Skin Conditions Protocol",
            "Chapter 9: Case 8 - Sleep & Mood Disorders",
            "Chapter 10: Case 9 - Multi-System Dysfunction",
            "Chapter 11: Case 10 - The Challenging Client",
            "Chapter 12: Clinical Decision-Making Framework"
        ]
    },
];

// Specialty E-Books
const SPECIALTY_EBOOKS = [
    {
        id: "gut-health-practitioner",
        title: "Gut Health Protocol Guide",
        subtitle: "Advanced Strategies for Practitioners",
        description: "A comprehensive deep-dive into gut health protocols for functional medicine practitioners. This guide covers SIBO (Small Intestinal Bacterial Overgrowth), dysbiosis, leaky gut syndrome, and more with specific testing methodologies and evidence-based treatment approaches. Learn to interpret complex lab results, design personalized protocols, and guide clients through gut healing journeys with confidence.",
        price: 67,
        compareAtPrice: 87,
        graduatePrice: 57,
        pages: "55-70",
        readTime: "3-4 hours",
        icon: "🍃",
        category: "gut",
        topics: ["SIBO", "Dysbiosis", "Leaky Gut", "Testing", "Protocols"],
        highlights: [
            "SIBO breath test interpretation",
            "Stool test analysis guide",
            "5R protocol customization",
            "Supplement selection criteria",
            "Diet protocol decision tree"
        ],
        chapters: 9,
        isBestseller: true,
        rating: 4.9,
        reviewCount: 178,
        tableOfContents: [
            "Chapter 1: Understanding the Gut Microbiome",
            "Chapter 2: SIBO - Testing, Types & Treatment",
            "Chapter 3: Comprehensive Stool Testing Analysis",
            "Chapter 4: Leaky Gut Protocols",
            "Chapter 5: The 5R Framework Deep-Dive",
            "Chapter 6: Supplement Selection Guide",
            "Chapter 7: Therapeutic Diet Protocols",
            "Chapter 8: Client Communication & Follow-up",
            "Chapter 9: Case Studies & Clinical Applications"
        ]
    },
    {
        id: "hormone-practitioner",
        title: "Hormone Optimization Handbook",
        subtitle: "Women's Hormones Across the Lifespan",
        description: "A comprehensive guide to supporting women's hormonal health from perimenopause through post-menopause. Learn to interpret advanced hormone testing, understand the nuances of female physiology, and design effective natural intervention protocols. This handbook bridges the gap between conventional endocrinology and functional medicine approaches to hormone balance.",
        price: 77,
        compareAtPrice: 97,
        graduatePrice: 67,
        pages: "65-80",
        readTime: "4 hours",
        icon: "🌸",
        category: "hormones",
        topics: ["Perimenopause", "Menopause", "Thyroid", "Adrenals", "Testing"],
        highlights: [
            "DUTCH test interpretation",
            "Thyroid panel deep-dive",
            "Natural intervention protocols",
            "Bioidentical hormone basics",
            "When to refer to endocrinology"
        ],
        chapters: 10,
        isBestseller: false,
        rating: 4.8,
        reviewCount: 134,
        tableOfContents: [
            "Chapter 1: Female Hormone Physiology 101",
            "Chapter 2: Advanced Hormone Testing Interpretation",
            "Chapter 3: DUTCH Test Mastery",
            "Chapter 4: Perimenopause Protocols",
            "Chapter 5: Menopause Support Strategies",
            "Chapter 6: Thyroid-Hormone Connections",
            "Chapter 7: Adrenal-Hormone Axis",
            "Chapter 8: Natural Intervention Protocols",
            "Chapter 9: Bioidentical Hormones Primer",
            "Chapter 10: When to Refer & Collaborate"
        ]
    },
    {
        id: "thyroid-practitioner",
        title: "Thyroid Mastery for Practitioners",
        subtitle: "Beyond TSH: Complete Assessment & Support",
        description: "Everything you need to know about supporting thyroid health as a functional medicine practitioner. This guide goes beyond basic TSH testing to cover comprehensive thyroid panel interpretation, evidence-based Hashimoto's protocols, T4-to-T3 conversion optimization, and how to work effectively alongside thyroid medications. Includes the iodine controversy and when supplementation helps vs harms.",
        price: 67,
        compareAtPrice: 87,
        graduatePrice: 57,
        pages: "50-65",
        readTime: "3 hours",
        icon: "🦋",
        category: "thyroid",
        topics: ["Full Thyroid Panel", "Hashimoto's", "Conversion Issues", "Medication Support"],
        highlights: [
            "Complete thyroid panel interpretation",
            "Hashimoto's autoimmune protocol",
            "Conversion optimization strategies",
            "Working alongside medication",
            "Iodine controversy explained"
        ],
        chapters: 8,
        isBestseller: false,
        rating: 4.9,
        reviewCount: 112,
        tableOfContents: [
            "Chapter 1: Thyroid Physiology Deep-Dive",
            "Chapter 2: Complete Thyroid Panel Interpretation",
            "Chapter 3: Understanding Hashimoto's",
            "Chapter 4: Autoimmune Thyroid Protocols",
            "Chapter 5: T4 to T3 Conversion Optimization",
            "Chapter 6: Working Alongside Medication",
            "Chapter 7: The Iodine Question",
            "Chapter 8: Case Studies & Clinical Pearls"
        ]
    },
    {
        id: "nutrition-protocols",
        title: "Clinical Nutrition Protocols",
        subtitle: "Evidence-Based Diet Interventions",
        description: "Master the most effective therapeutic diets used in functional medicine practice. This practical guide covers elimination diets, AIP (Autoimmune Protocol), low-FODMAP, anti-inflammatory protocols, and more. Learn exactly when to use each approach, how to guide clients through implementation, and what to do when dietary interventions don't produce expected results.",
        price: 57,
        compareAtPrice: 77,
        graduatePrice: 47,
        pages: "55-70",
        readTime: "3 hours",
        icon: "🥗",
        category: "nutrition",
        topics: ["Elimination Diet", "AIP", "Low-FODMAP", "Anti-Inflammatory", "Reintroduction"],
        highlights: [
            "Diet selection decision tree",
            "Client-ready meal plans",
            "Troubleshooting common issues",
            "Reintroduction protocols",
            "When diets don't work"
        ],
        chapters: 9,
        isBestseller: false,
        rating: 4.7,
        reviewCount: 98,
        tableOfContents: [
            "Chapter 1: Diet Selection Framework",
            "Chapter 2: The Elimination Diet Protocol",
            "Chapter 3: AIP Implementation Guide",
            "Chapter 4: Low-FODMAP for Practitioners",
            "Chapter 5: Anti-Inflammatory Protocols",
            "Chapter 6: Client Communication & Compliance",
            "Chapter 7: Reintroduction Strategies",
            "Chapter 8: Troubleshooting Diet Failures",
            "Chapter 9: Meal Plans & Resources"
        ]
    },
    {
        id: "inflammation-practitioner",
        title: "Chronic Inflammation Protocol Guide",
        subtitle: "Root Cause Approach to Systemic Inflammation",
        description: "Address the underlying causes of chronic inflammation with proven testing strategies, targeted lifestyle interventions, and evidence-based supplementation protocols. This comprehensive guide helps you identify hidden inflammation triggers, interpret key inflammatory markers, and design personalized anti-inflammatory protocols that address root causes rather than just symptoms.",
        price: 77,
        compareAtPrice: 97,
        graduatePrice: 67,
        pages: "60-75",
        readTime: "3-4 hours",
        icon: "🔥",
        category: "inflammation",
        topics: ["Inflammatory Markers", "Root Causes", "Anti-Inflammatory Protocols", "Lifestyle"],
        highlights: [
            "Key inflammatory markers explained",
            "Hidden inflammation triggers",
            "Anti-inflammatory supplement stacking",
            "Lifestyle intervention hierarchy",
            "Progress tracking metrics"
        ],
        chapters: 10,
        isBestseller: false,
        rating: 4.8,
        reviewCount: 87,
        tableOfContents: [
            "Chapter 1: Understanding Chronic Inflammation",
            "Chapter 2: Key Inflammatory Markers",
            "Chapter 3: Hidden Triggers Assessment",
            "Chapter 4: Diet & Inflammation Connection",
            "Chapter 5: Lifestyle Intervention Hierarchy",
            "Chapter 6: Anti-Inflammatory Supplements",
            "Chapter 7: Supplement Stacking Strategies",
            "Chapter 8: Protocol Design Framework",
            "Chapter 9: Progress Tracking Metrics",
            "Chapter 10: Case Studies & Applications"
        ]
    },
];

// Bundles
const BUNDLES = [
    {
        id: "practitioner-starter-kit",
        title: "Practitioner Starter Kit",
        subtitle: "Everything You Need to Launch",
        description: "All 4 core ebooks in one comprehensive bundle. The complete foundation for launching your functional medicine practice with confidence.",
        includedEbooks: ["practitioner-reality-playbook", "first-client-guide", "scope-ethics-guide", "case-walkthroughs"],
        includedTitles: ["The Practitioner Reality Playbook", "From Certificate to Client", "Scope of Practice & Ethics Guide", "Clinical Case Walkthroughs"],
        price: 147,
        compareAtPrice: 208,
        graduatePrice: 127,
        savings: 61,
        icon: "🎁",
        isBestseller: true,
        rating: 5.0,
        reviewCount: 312,
        buyers: 1247,
    },
    {
        id: "clinical-confidence-kit",
        title: "Clinical Confidence Kit",
        subtitle: "Master the Top 3 Client Concerns",
        description: "Gut health, hormones, and inflammation—the conditions you'll see most often. This bundle prepares you to handle them with confidence.",
        includedEbooks: ["gut-health-practitioner", "hormone-practitioner", "inflammation-practitioner"],
        includedTitles: ["Gut Health Protocol Guide", "Hormone Optimization Handbook", "Chronic Inflammation Protocol Guide"],
        price: 167,
        compareAtPrice: 221,
        graduatePrice: 147,
        savings: 54,
        icon: "💪",
        isBestseller: false,
        rating: 4.9,
        reviewCount: 156,
        buyers: 634,
    },
    {
        id: "complete-practitioner-library",
        title: "Complete Practitioner Library",
        subtitle: "Every E-Book We Offer",
        description: "All 9 ebooks: 4 core guides + 5 specialty protocols. The ultimate resource library for serious practitioners.",
        includedEbooks: ["practitioner-reality-playbook", "first-client-guide", "scope-ethics-guide", "case-walkthroughs", "gut-health-practitioner", "hormone-practitioner", "thyroid-practitioner", "nutrition-protocols", "inflammation-practitioner"],
        includedTitles: ["All 4 Core Guides", "All 5 Specialty Protocols", "Future Updates Included"],
        price: 297,
        compareAtPrice: 429,
        graduatePrice: 247,
        savings: 132,
        icon: "📚",
        isBestseller: false,
        rating: 5.0,
        reviewCount: 89,
        buyers: 412,
    },
];

// Simulate graduate status - in real app this comes from server
const IS_GRADUATE = false; // Would come from session/user data

export default function EbooksStorePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [activeTab, setActiveTab] = useState<"ebooks" | "bundles">("ebooks");
    const [isGraduate] = useState(IS_GRADUATE);
    const [previewEbook, setPreviewEbook] = useState<typeof CORE_EBOOKS[0] | null>(null);

    const allEbooks = [...CORE_EBOOKS, ...SPECIALTY_EBOOKS];

    const filteredEbooks = allEbooks.filter(ebook => {
        const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const bestsellers = allEbooks.filter(e => e.isBestseller);
    const coreEbooks = filteredEbooks.filter(e => CORE_EBOOKS.some(c => c.id === e.id));
    const specialtyEbooks = filteredEbooks.filter(e => SPECIALTY_EBOOKS.some(s => s.id === e.id));

    const handlePurchase = (item: typeof CORE_EBOOKS[0] | typeof BUNDLES[0], type: "ebook" | "bundle") => {
        const price = isGraduate ? item.graduatePrice : item.price;
        // Redirect to chat with Sarah with pre-filled message about interest in product
        const message = encodeURIComponent(`Hi Sarah! I'm interested in "${item.title}" ($${price}). Can you tell me more about it?`);
        router.push(`/messages?message=${message}`);
    };

    const getDisplayPrice = (item: typeof CORE_EBOOKS[0] | typeof BUNDLES[0]) => {
        return isGraduate ? item.graduatePrice : item.price;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Compact Header - Matching Catalog Style */}
            <div className="relative mb-6 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 rounded-xl overflow-hidden">
                <div className="relative z-10 px-5 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Icon + Title + Subtitle */}
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gold-400/20 flex items-center justify-center border border-gold-400/30 flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-gold-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-[10px]">
                                        Functional Medicine
                                    </Badge>
                                    {isGraduate && (
                                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-[10px]">
                                            <GraduationCap className="w-3 h-3 mr-1" />Graduate
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-xl font-bold text-white">
                                    E-Book <span className="text-gold-400">Library</span>
                                </h1>
                                <p className="text-xs text-burgundy-200 mt-0.5 max-w-md hidden sm:block">
                                    Expert guides, protocols, and resources for practitioners.
                                </p>
                            </div>
                        </div>

                        {/* Right: Stats + CTA */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <FileText className="w-3 h-3 mr-1.5 text-gold-400" />
                                    9 E-Books
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Package className="w-3 h-3 mr-1.5 text-gold-400" />
                                    3 Bundles
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Star className="w-3 h-3 mr-1.5 text-gold-400" />
                                    4.9 Rating
                                </Badge>
                            </div>
                            <a href="/my-library">
                                <Button size="sm" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold h-9">
                                    <Library className="w-4 h-4 mr-1.5" />
                                    My Library
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("ebooks")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "ebooks" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                    <BookOpen className="w-4 h-4 inline mr-2" /> E-Books ({allEbooks.length})
                </button>
                <button
                    onClick={() => setActiveTab("bundles")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "bundles" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                    <Package className="w-4 h-4" /> Bundles ({BUNDLES.length})
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs">Save up to $132</Badge>
                </button>
            </div>

            {/* E-Books Tab */}
            {activeTab === "ebooks" && (
                <>
                    {/* Categories */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? "bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search e-books by title or topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 py-5 rounded-xl border-gray-200"
                        />
                    </div>

                    {/* Core Guides Section */}
                    {coreEbooks.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-burgundy-600" />
                                <h2 className="text-xl font-bold text-gray-900">Core Practitioner Guides</h2>
                                <Badge className="bg-burgundy-100 text-burgundy-700 border-0">Foundation</Badge>
                            </div>
                            <p className="text-gray-600 mb-4">Essential knowledge every functional medicine practitioner needs. Start here.</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                {coreEbooks.map((ebook) => (
                                    <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-4xl">{ebook.icon}</span>
                                                    <div>
                                                        {ebook.isBestseller && (
                                                            <Badge className="bg-burgundy-600 text-white border-0 text-xs mb-1">BESTSELLER</Badge>
                                                        )}
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-burgundy-600">{ebook.title}</h3>
                                                        <p className="text-sm text-burgundy-600">{ebook.subtitle}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4">{ebook.description}</p>

                                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">WHAT YOU'LL LEARN:</p>
                                                <ul className="space-y-1">
                                                    {ebook.highlights.slice(0, 3).map((highlight, i) => (
                                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                            <CheckCircle className="w-4 h-4 text-burgundy-500 flex-shrink-0 mt-0.5" /> {highlight}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                <div className="flex items-center">
                                                    <span><FileText className="w-3 h-3 inline mr-1" /> {ebook.pages} pages</span>
                                                    <span className="mx-2">•</span>
                                                    <span><Clock className="w-3 h-3 inline mr-1" /> {ebook.readTime}</span>
                                                    <span className="mx-2">•</span>
                                                    <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" /> {ebook.rating} ({ebook.reviewCount})</span>
                                                </div>
                                                <button
                                                    onClick={() => setPreviewEbook(ebook)}
                                                    className="text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" /> Preview
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-2xl font-bold text-burgundy-700">${getDisplayPrice(ebook)}</span>
                                                    <span className="text-lg text-gray-400 line-through ml-2">${ebook.compareAtPrice}</span>
                                                    {isGraduate && (
                                                        <Badge className="bg-gold-100 text-gold-700 border-0 text-xs ml-2">Graduate Price</Badge>
                                                    )}
                                                </div>
                                                <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => handlePurchase(ebook, "ebook")}>
                                                    <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specialty Protocols Section */}
                    {specialtyEbooks.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-bold text-gray-900">Specialty Protocol Guides</h2>
                                <Badge className="bg-purple-100 text-purple-700 border-0">Advanced</Badge>
                            </div>
                            <p className="text-gray-600 mb-4">Deep-dive guides for specific conditions. Expand your clinical expertise.</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {specialtyEbooks.map((ebook) => (
                                    <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="text-3xl">{ebook.icon}</span>
                                                {ebook.isBestseller && (
                                                    <Badge className="bg-burgundy-600 text-white border-0 text-xs">BESTSELLER</Badge>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-burgundy-600">{ebook.title}</h3>
                                            <p className="text-sm text-burgundy-600 mb-3">{ebook.subtitle}</p>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>

                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {ebook.topics.slice(0, 3).map((topic) => (
                                                    <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                <div className="flex items-center">
                                                    <span><FileText className="w-3 h-3 inline mr-1" /> {ebook.pages}p</span>
                                                    <span className="mx-2">•</span>
                                                    <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" /> {ebook.rating}</span>
                                                </div>
                                                <button
                                                    onClick={() => setPreviewEbook(ebook)}
                                                    className="text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" /> Preview
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className="text-xl font-bold text-burgundy-700">${getDisplayPrice(ebook)}</span>
                                                    <span className="text-sm text-gray-400 line-through ml-2">${ebook.compareAtPrice}</span>
                                                </div>
                                            </div>

                                            <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" onClick={() => handlePurchase(ebook, "ebook")}>
                                                <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredEbooks.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500 mb-4">No e-books found matching your search</p>
                            <Button variant="outline" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
                                View All E-Books
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Bundles Tab */}
            {activeTab === "bundles" && (
                <>
                    {/* Bundle Explanation */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Gift className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Why Buy a Bundle?</h3>
                                <p className="text-gray-600 text-sm">
                                    Save up to <span className="font-bold text-purple-600">$132</span> compared to buying individually.
                                    Bundles include complementary guides that work together to build your expertise faster.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Best Value Bundle */}
                    {BUNDLES.filter(b => b.isBestseller).map((bundle) => (
                        <div key={bundle.id} className="mb-8 bg-gradient-to-r from-burgundy-50 via-burgundy-50/50 to-burgundy-50 rounded-2xl border-2 border-burgundy-300 p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-burgundy-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-xl">
                                🏆 BEST VALUE
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-6xl">{bundle.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{bundle.title}</h3>
                                            <p className="text-burgundy-700 font-medium">{bundle.subtitle}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6">{bundle.description}</p>

                                    <div className="bg-white/60 rounded-xl p-5 mb-6">
                                        <p className="text-sm font-semibold text-gray-500 mb-3">INCLUDES {bundle.includedEbooks.length} E-BOOKS:</p>
                                        <div className="grid md:grid-cols-2 gap-2">
                                            {bundle.includedTitles.map((title, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="w-4 h-4 text-burgundy-500" /> {title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>{bundle.rating} ({bundle.reviewCount} reviews)</span>
                                        <span className="mx-2">•</span>
                                        <Users className="w-4 h-4" />
                                        <span>{bundle.buyers.toLocaleString()} practitioners purchased</span>
                                    </div>
                                </div>

                                <div className="lg:w-80 bg-white rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="mb-2">
                                            <span className="text-4xl font-bold text-burgundy-700">${getDisplayPrice(bundle)}</span>
                                            <span className="text-xl text-gray-400 line-through ml-2">${bundle.compareAtPrice}</span>
                                        </div>
                                        <Badge className="bg-red-100 text-red-700 border-0">Save ${bundle.savings}</Badge>
                                        {isGraduate && (
                                            <Badge className="bg-gold-100 text-gold-700 border-0 ml-2">Graduate Price</Badge>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 py-6 text-lg mb-3"
                                        onClick={() => handlePurchase(bundle, "bundle")}
                                    >
                                        <Zap className="w-5 h-5 mr-2" /> Get This Bundle
                                    </Button>

                                    <p className="text-xs text-center text-gray-500">Instant download • Lifetime access</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Other Bundles */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4">All Bundles</h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {BUNDLES.filter(b => !b.isBestseller).map((bundle) => (
                            <div key={bundle.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-4xl">{bundle.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{bundle.title}</h3>
                                        <p className="text-sm text-burgundy-600">{bundle.subtitle}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>

                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">INCLUDES:</p>
                                    <ul className="space-y-1">
                                        {bundle.includedTitles.map((title, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-burgundy-500" /> {title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span>{bundle.rating}</span>
                                    <span>•</span>
                                    <span>{bundle.buyers.toLocaleString()} purchased</span>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl font-bold text-burgundy-700">${getDisplayPrice(bundle)}</span>
                                    <span className="text-lg text-gray-400 line-through">${bundle.compareAtPrice}</span>
                                    <Badge className="bg-red-100 text-red-700 border-0">Save ${bundle.savings}</Badge>
                                </div>

                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" onClick={() => handlePurchase(bundle, "bundle")}>
                                    <Package className="w-4 h-4 mr-2" /> Get This Bundle
                                </Button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Graduate Pricing CTA (if not graduate) */}
            {!isGraduate && (
                <div className="mt-12 bg-gradient-to-r from-gold-100 to-amber-100 rounded-2xl p-8 border border-gold-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gold-200 rounded-2xl flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 text-gold-700" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Unlock Graduate Pricing</h2>
                                <p className="text-gray-600">Complete your certification to save $10-20 on every e-book purchase</p>
                            </div>
                        </div>
                        <a href="/catalog">
                            <Button className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-6 text-lg">
                                View Certifications <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-8 bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <Library className="w-8 h-8 text-gold-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Ready to Start Reading?</h2>
                            <p className="text-white/70">Access your purchased e-books anytime in your library</p>
                        </div>
                    </div>
                    <a href="/my-library">
                        <Button className="bg-white text-burgundy-700 hover:bg-burgundy-50 font-semibold px-6 py-6 text-lg">
                            Open My Library <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </a>
                </div>
            </div>

            {/* E-Book Preview Modal */}
            {previewEbook && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewEbook(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white p-6 rounded-t-2xl">
                            <button
                                onClick={() => setPreviewEbook(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-start gap-4">
                                <span className="text-5xl">{previewEbook.icon}</span>
                                <div>
                                    <h2 className="text-2xl font-bold">{previewEbook.title}</h2>
                                    <p className="text-burgundy-200">{previewEbook.subtitle}</p>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                                        <span><FileText className="w-4 h-4 inline mr-1" /> {previewEbook.pages} pages</span>
                                        <span><Clock className="w-4 h-4 inline mr-1" /> {previewEbook.readTime}</span>
                                        <span><Star className="w-4 h-4 inline mr-1 text-gold-400" /> {previewEbook.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Full Description */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-burgundy-600" /> About This E-Book
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{previewEbook.description}</p>
                            </div>

                            {/* Table of Contents */}
                            {previewEbook.tableOfContents && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <ListOrdered className="w-5 h-5 text-burgundy-600" /> Table of Contents
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <ul className="space-y-2">
                                            {previewEbook.tableOfContents.map((chapter, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                                    <span className="w-6 h-6 bg-burgundy-100 text-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                                        {i + 1}
                                                    </span>
                                                    {chapter.replace(/^Chapter \d+:\s*/, '')}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* What You'll Learn */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-burgundy-600" /> What You'll Learn
                                </h3>
                                <ul className="space-y-2">
                                    {previewEbook.highlights.map((highlight, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Topics Covered */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-3">Topics Covered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {previewEbook.topics.map((topic) => (
                                        <Badge key={topic} variant="outline" className="bg-burgundy-50 text-burgundy-700 border-burgundy-200">
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing & CTA */}
                            <div className="border-t pt-6 flex items-center justify-between">
                                <div>
                                    <span className="text-3xl font-bold text-burgundy-700">${getDisplayPrice(previewEbook)}</span>
                                    <span className="text-lg text-gray-400 line-through ml-2">${previewEbook.compareAtPrice}</span>
                                    {isGraduate && (
                                        <Badge className="bg-gold-100 text-gold-700 border-0 text-xs ml-2">Graduate Price</Badge>
                                    )}
                                </div>
                                <Button
                                    className="bg-burgundy-600 hover:bg-burgundy-700 px-8"
                                    onClick={() => {
                                        handlePurchase(previewEbook, "ebook");
                                        setPreviewEbook(null);
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
