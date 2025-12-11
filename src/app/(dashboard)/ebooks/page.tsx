"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    Download,
    Search,
    Star,
    Package,
    ChevronRight,
    FileText,
    Users,
    CheckCircle,
    Eye,
    Lock,
    Sparkles,
    TrendingUp,
    Award,
    Heart,
    ShoppingCart,
    Gift,
    Zap,
    Library
} from "lucide-react";

// Categories
const CATEGORIES = [
    { id: "all", label: "All E-Books", icon: "📚" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
    { id: "hormones", label: "Hormones", icon: "🌸" },
    { id: "sleep", label: "Sleep", icon: "😴" },
    { id: "stress", label: "Stress & Mindfulness", icon: "🧘" },
    { id: "gut", label: "Gut Health", icon: "🍃" },
    { id: "business", label: "Business", icon: "💼" },
];

// Store E-Books - Some free, some paid
const STORE_EBOOKS = [
    {
        id: "gut-health-guide",
        title: "The Ultimate Gut Health Guide",
        description: "A comprehensive 40-page guide to healing your gut naturally. Includes meal plans, supplement protocols, and actionable lifestyle tips.",
        author: "AccrediPro Academy",
        pages: 40,
        rating: 4.9,
        reviews: 127,
        icon: "🥗",
        category: "gut",
        topics: ["Gut Health", "Nutrition", "Meal Plans"],
        price: 0,
        isFree: true,
        popular: true,
        readTime: "25 min"
    },
    {
        id: "hormone-balance",
        title: "Hormone Balance Blueprint",
        description: "Perfect for clients 35+ experiencing hormonal shifts. Covers natural balancing strategies, nutrition, and lifestyle modifications.",
        author: "Dr. Sarah Mitchell, NBC-HWC",
        pages: 35,
        rating: 4.8,
        reviews: 89,
        icon: "🌸",
        category: "hormones",
        topics: ["Hormones", "Women's Health", "Lifestyle"],
        price: 0,
        isFree: true,
        popular: true,
        readTime: "20 min"
    },
    {
        id: "sleep-optimization",
        title: "Sleep Optimization Handbook",
        description: "Help your clients transform their sleep quality with evidence-based strategies. Includes sleep tracking templates.",
        author: "AccrediPro Academy",
        pages: 28,
        rating: 4.9,
        reviews: 76,
        icon: "😴",
        category: "sleep",
        topics: ["Sleep", "Recovery", "Wellness"],
        price: 0,
        isFree: true,
        readTime: "15 min"
    },
    {
        id: "stress-mastery",
        title: "Stress Mastery Toolkit",
        description: "Equip your clients with practical tools to manage stress and build resilience. Ready-to-use exercises included.",
        author: "Michael Chen, CHC",
        pages: 32,
        rating: 4.7,
        reviews: 64,
        icon: "🧘",
        category: "stress",
        topics: ["Stress", "Mental Health", "Mindfulness"],
        price: 19,
        isFree: false,
        readTime: "18 min"
    },
    {
        id: "anti-inflammatory",
        title: "Anti-Inflammatory Food Guide",
        description: "Complete nutrition guide with shopping lists and recipes. Perfect for inflammation-related conditions.",
        author: "AccrediPro Academy",
        pages: 24,
        rating: 4.8,
        reviews: 52,
        icon: "🍃",
        category: "nutrition",
        topics: ["Nutrition", "Inflammation", "Recipes"],
        price: 15,
        isFree: false,
        readTime: "12 min"
    },
    {
        id: "detox-protocol",
        title: "7-Day Gentle Detox Protocol",
        description: "A safe, effective detox protocol your clients can follow at home. Includes daily schedules and shopping lists.",
        author: "Dr. Angela Rodriguez",
        pages: 30,
        rating: 4.8,
        reviews: 45,
        icon: "🌿",
        category: "nutrition",
        topics: ["Detox", "Cleanse", "Nutrition"],
        price: 27,
        isFree: false,
        readTime: "16 min"
    },
    {
        id: "mindful-eating",
        title: "Mindful Eating Mastery",
        description: "Transform your clients' relationship with food. Exercises, journal prompts, and practical strategies.",
        author: "Lisa Thompson, RD",
        pages: 36,
        rating: 4.6,
        reviews: 38,
        icon: "🧠",
        category: "stress",
        topics: ["Mindfulness", "Nutrition", "Psychology"],
        price: 22,
        isFree: false,
        readTime: "20 min"
    },
    {
        id: "coaching-business",
        title: "Build Your Coaching Empire",
        description: "Step-by-step guide to building a 6-figure health coaching business. Marketing, pricing, and client acquisition.",
        author: "Marcus Thompson",
        pages: 48,
        rating: 4.9,
        reviews: 112,
        icon: "💼",
        category: "business",
        topics: ["Business", "Marketing", "Sales"],
        price: 47,
        isFree: false,
        popular: true,
        readTime: "30 min"
    },
];

// Premium Bundles
const BUNDLES = [
    {
        id: "complete-wellness",
        title: "Complete Wellness Bundle",
        description: "Everything you need to run a professional coaching practice. All e-books plus exclusive templates and protocols.",
        author: "AccrediPro Academy",
        authorCredential: "NBHWC Accredited",
        includes: ["All 8 E-Books", "Client Intake Templates", "12 Protocol Templates", "Session Planning Guides", "Progress Tracking Sheets"],
        originalPrice: 297,
        price: 67,
        icon: "📚",
        popular: true,
        savings: "78% OFF",
        buyers: 1247
    },
    {
        id: "coaching-starter",
        title: "New Coach Starter Pack",
        description: "Essential templates designed for newly certified coaches. Start your practice with confidence and professionalism.",
        author: "Jennifer Adams",
        authorCredential: "NBC-HWC, 10+ years",
        includes: ["5 Core E-Books", "Discovery Call Script", "Client Onboarding Flow", "Pricing Calculator", "Session Templates"],
        originalPrice: 147,
        price: 37,
        icon: "🚀",
        savings: "75% OFF",
        buyers: 892
    },
    {
        id: "gut-health-pro",
        title: "Gut Health Specialist Bundle",
        description: "Become the go-to gut health expert. Advanced protocols, assessments, and client resources.",
        author: "Dr. Lisa Roberts",
        authorCredential: "Functional Medicine",
        includes: ["3 Gut Health E-Books", "GI Assessment Forms", "4-Week Protocol", "Elimination Diet Guide", "Supplement Protocols"],
        originalPrice: 197,
        price: 47,
        icon: "🔬",
        savings: "76% OFF",
        buyers: 634
    },
    {
        id: "business-growth",
        title: "Business Growth Accelerator",
        description: "Scale your coaching practice with proven marketing strategies, sales scripts, and automation templates.",
        author: "Marcus Thompson",
        authorCredential: "7-Figure Coach",
        includes: ["Business E-Book", "Marketing Templates", "Sales Scripts", "Email Sequences", "Social Media Kit"],
        originalPrice: 247,
        price: 57,
        icon: "📈",
        savings: "77% OFF",
        buyers: 456
    },
];

export default function EbooksStorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [activeTab, setActiveTab] = useState<"ebooks" | "bundles">("ebooks");

    const filteredEbooks = STORE_EBOOKS.filter(ebook => {
        const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const freeEbooks = filteredEbooks.filter(e => e.isFree);
    const paidEbooks = filteredEbooks.filter(e => !e.isFree);
    const popularEbooks = STORE_EBOOKS.filter(e => e.popular);

    const handleEnroll = (ebook: typeof STORE_EBOOKS[0]) => {
        if (ebook.isFree) {
            alert(`✅ "${ebook.title}" has been added to your library!\n\nGo to My Library to start reading.`);
        } else {
            alert(`🛒 Added "${ebook.title}" to cart for $${ebook.price}\n\n(Checkout coming soon!)`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero Header */}
                <div className="relative mb-10 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <Badge className="bg-gold-400 text-burgundy-900 border-0 font-semibold">E-Book Store</Badge>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            E-Books & Guides for Health Coaches
                        </h1>

                        <p className="text-lg text-white/90 max-w-2xl mb-6">
                            Professional resources to use with your clients.
                            <span className="text-gold-300 font-medium"> Get free e-books or unlock premium content!</span>
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a href="/my-library">
                                <Button className="bg-white text-burgundy-700 hover:bg-burgundy-50 font-semibold">
                                    <Library className="w-4 h-4 mr-2" /> Read My Books ({3})
                                </Button>
                            </a>
                            <div className="flex items-center gap-4 text-sm text-white/80">
                                <span><Gift className="w-4 h-4 inline mr-1" /> 3 Free E-Books</span>
                                <span><Star className="w-4 h-4 inline mr-1 text-gold-400" /> 4.8 Avg Rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Library Quick Access */}
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Library className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-emerald-900">You have 3 e-books in your library</p>
                            <p className="text-sm text-emerald-700">Continue reading where you left off</p>
                        </div>
                    </div>
                    <a href="/my-library">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            Open My Library <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </a>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("ebooks")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "ebooks" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                    >
                        <BookOpen className="w-4 h-4 inline mr-2" /> E-Books ({STORE_EBOOKS.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("bundles")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "bundles" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                    >
                        <Package className="w-4 h-4 inline mr-2" /> Premium Bundles ({BUNDLES.length})
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
                                placeholder="Search e-books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-5 rounded-xl border-gray-200"
                            />
                        </div>

                        {/* Most Popular Section */}
                        {selectedCategory === "all" && searchQuery === "" && (
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-burgundy-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Most Popular</h2>
                                    <Badge className="bg-burgundy-100 text-burgundy-700 border-0">Trending</Badge>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {popularEbooks.map((ebook) => (
                                        <div key={ebook.id} className="bg-gradient-to-br from-burgundy-50 to-pink-50 rounded-xl border border-burgundy-200 p-5 hover:shadow-lg transition-all">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-3xl">{ebook.icon}</span>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">{ebook.title}</h3>
                                                    <p className="text-xs text-gray-500">{ebook.author}</p>
                                                </div>
                                                {ebook.isFree ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-0">FREE</Badge>
                                                ) : (
                                                    <Badge className="bg-burgundy-600 text-white border-0">${ebook.price}</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                <span><Star className="w-3 h-3 inline text-yellow-500" />{ebook.rating}</span>
                                                <span>•</span>
                                                <span>{ebook.reviews} reviews</span>
                                            </div>
                                            <Button
                                                className={`w-full ${ebook.isFree ? "bg-emerald-600 hover:bg-emerald-700" : "bg-burgundy-600 hover:bg-burgundy-700"}`}
                                                onClick={() => handleEnroll(ebook)}
                                            >
                                                {ebook.isFree ? <><Gift className="w-4 h-4 mr-2" /> Get Free</> : <><ShoppingCart className="w-4 h-4 mr-2" /> Buy Now</>}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Free E-Books Section */}
                        {freeEbooks.length > 0 && (
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Gift className="w-5 h-5 text-emerald-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Free E-Books</h2>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-0">No cost</Badge>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {freeEbooks.map((ebook) => (
                                        <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <span className="text-4xl">{ebook.icon}</span>
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-0 font-semibold">FREE</Badge>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-burgundy-600">{ebook.title}</h3>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>
                                                <p className="text-xs text-burgundy-600 font-medium mb-3">By {ebook.author}</p>

                                                <div className="flex items-center text-xs text-gray-500 mb-4">
                                                    <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" />{ebook.rating}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{ebook.reviews} reviews</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{ebook.pages} pages</span>
                                                </div>

                                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleEnroll(ebook)}>
                                                    <Gift className="w-4 h-4 mr-2" /> Get Free Access
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Premium E-Books Section */}
                        {paidEbooks.length > 0 && (
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Premium E-Books</h2>
                                    <Badge className="bg-purple-100 text-purple-700 border-0">Unlock full access</Badge>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {paidEbooks.map((ebook) => (
                                        <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
                                            <div className="absolute top-4 right-4">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-start mb-4">
                                                    <span className="text-4xl">{ebook.icon}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-burgundy-600">{ebook.title}</h3>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>
                                                <p className="text-xs text-burgundy-600 font-medium mb-3">By {ebook.author}</p>

                                                <div className="flex items-center text-xs text-gray-500 mb-4">
                                                    <span><Star className="w-3 h-3 inline mr-1 text-yellow-500" />{ebook.rating}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{ebook.reviews} reviews</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{ebook.pages} pages</span>
                                                </div>

                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-2xl font-bold text-burgundy-600">${ebook.price}</span>
                                                    <span className="text-xs text-gray-400">one-time</span>
                                                </div>

                                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" onClick={() => handleEnroll(ebook)}>
                                                    <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Bundles Tab */}
                {activeTab === "bundles" && (
                    <>
                        {/* Most Popular Bundle */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-gold-500" />
                                <h2 className="text-xl font-bold text-gray-900">Best Value</h2>
                            </div>
                            {BUNDLES.filter(b => b.popular).map((bundle) => (
                                <div key={bundle.id} className="bg-gradient-to-r from-burgundy-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-burgundy-300 p-8">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="text-6xl">{bundle.icon}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="bg-burgundy-600 text-white border-0">🏆 BEST SELLER</Badge>
                                                <Badge className="bg-red-100 text-red-700 border-0">{bundle.savings}</Badge>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{bundle.title}</h3>
                                            <p className="text-gray-600 mb-2">{bundle.description}</p>
                                            <p className="text-sm text-burgundy-700 font-medium mb-4">By {bundle.author} • {bundle.authorCredential}</p>

                                            <div className="bg-white/60 rounded-xl p-4 mb-4">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">INCLUDES:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {bundle.includes.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" /> {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <span className="text-4xl font-bold text-burgundy-600">${bundle.price}</span>
                                                    <span className="text-xl text-gray-400 line-through ml-2">${bundle.originalPrice}</span>
                                                </div>
                                                <Button className="bg-burgundy-600 hover:bg-burgundy-700 px-8 py-6 text-lg" onClick={() => alert(`Bundle selected! Checkout coming soon.`)}>
                                                    <Zap className="w-5 h-5 mr-2" /> Get Bundle Now
                                                </Button>
                                                <span className="text-sm text-gray-500">{bundle.buyers.toLocaleString()} coaches bought this</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Other Bundles */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">All Premium Bundles</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {BUNDLES.filter(b => !b.popular).map((bundle) => (
                                    <div key={bundle.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all">
                                        <div className="flex items-start gap-4 mb-4">
                                            <span className="text-4xl">{bundle.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{bundle.title}</h3>
                                                <p className="text-sm text-burgundy-600">{bundle.author}</p>
                                                <p className="text-xs text-gray-500">{bundle.authorCredential}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>

                                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                            <p className="text-xs font-semibold text-gray-500 mb-2">INCLUDES:</p>
                                            <ul className="space-y-1">
                                                {bundle.includes.map((item, i) => (
                                                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl font-bold text-burgundy-600">${bundle.price}</span>
                                            <span className="text-lg text-gray-400 line-through">${bundle.originalPrice}</span>
                                            <Badge className="bg-red-100 text-red-700 border-0">{bundle.savings}</Badge>
                                        </div>

                                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" onClick={() => alert(`Bundle selected!`)}>
                                            <Package className="w-4 h-4 mr-2" /> Get This Bundle
                                        </Button>
                                        <p className="text-xs text-center text-gray-400 mt-2">{bundle.buyers.toLocaleString()} purchases</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Bottom CTA */}
                <div className="mt-12 bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Heart className="w-8 h-8 text-gold-300" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Need More Resources?</h2>
                                <p className="text-white/70">Check out our complete DFY resource library with meal plans, worksheets, and more</p>
                            </div>
                        </div>
                        <a href="/dfy-resources">
                            <Button className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold px-6 py-6 text-lg">
                                Browse DFY Resources <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
