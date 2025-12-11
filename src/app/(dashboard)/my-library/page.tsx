"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Download,
    Search,
    ChevronRight,
    FileText,
    CheckCircle,
    Bookmark,
    Eye,
    ChevronLeft,
    Share2,
    ArrowLeft,
    BookmarkCheck,
    Clock,
    PlayCircle,
    CheckCircle2,
    Circle,
    List,
    Filter,
    BookMarked,
    Library,
    Sparkles
} from "lucide-react";

// Categories
const CATEGORIES = [
    { id: "all", label: "All", icon: "📚" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
    { id: "hormones", label: "Hormones", icon: "🌸" },
    { id: "sleep", label: "Sleep", icon: "😴" },
    { id: "stress", label: "Stress", icon: "🧘" },
    { id: "gut", label: "Gut Health", icon: "🍃" },
];

// My Library E-Books (Unlocked content)
const MY_EBOOKS = [
    {
        id: "gut-health-guide",
        title: "The Ultimate Gut Health Guide",
        description: "Share this 40-page guide with clients working on digestive health. Includes meal plans, supplement protocols, and actionable lifestyle tips.",
        author: "AccrediPro Academy",
        pages: 40,
        icon: "🥗",
        category: "gut",
        topics: ["Gut Health", "Nutrition", "Meal Plans"],
        readTime: "25 min",
        unlockedDate: "2024-11-15",
        chapters: [
            {
                title: "Introduction",
                readTime: "3 min",
                content: `Welcome to the Ultimate Gut Health Guide. This comprehensive resource will help you understand the fundamentals of digestive wellness and implement practical strategies for healing your gut naturally.

Your gut is often called the "second brain" for good reason. It contains over 100 million neurons and produces 95% of your body's serotonin. When your gut is healthy, you feel better mentally, physically, and emotionally.

In this guide, you'll learn:
• The fundamentals of gut microbiome health
• Foods that heal and foods that harm
• A complete 4-week gut reset protocol
• Supplement recommendations for gut healing
• Lifestyle factors that impact digestive wellness

Let's begin your journey to optimal gut health.`
            },
            {
                title: "Chapter 1: Understanding Your Gut",
                readTime: "5 min",
                content: `Your gut microbiome is home to trillions of bacteria that play a crucial role in your overall health. These microorganisms help you:

• Digest food and absorb nutrients
• Produce essential vitamins (B12, K, folate)
• Regulate your immune system (70% lives in your gut!)
• Communicate with your brain via the gut-brain axis
• Protect against harmful pathogens

Signs of an unhealthy gut include:
- Bloating and gas after meals
- Irregular bowel movements
- Food sensitivities
- Skin issues (acne, eczema)
- Fatigue and brain fog
- Mood imbalances

The good news? Your microbiome can shift and improve within just 24-48 hours of dietary changes. Let's explore how to optimize your gut health through food.`
            },
            {
                title: "Chapter 2: Foods That Heal",
                readTime: "6 min",
                content: `The right foods can transform your gut health. Here's your comprehensive guide to gut-healing nutrition:

FOODS TO EMBRACE:
🥬 Fiber-Rich Vegetables: Leafy greens, broccoli, artichokes, asparagus
🫐 Prebiotic Foods: Garlic, onions, leeks, bananas, oats
🥛 Fermented Foods: Sauerkraut, kimchi, kefir, yogurt, kombucha
🍖 Bone Broth: Rich in collagen and amino acids for gut lining repair
🐟 Omega-3 Rich Fish: Salmon, sardines, mackerel

FOODS TO MINIMIZE:
❌ Refined sugars and artificial sweeteners
❌ Processed foods and seed oils
❌ Excessive alcohol
❌ Gluten (if sensitive)
❌ Dairy (if intolerant)

MEAL TIMING TIPS:
• Leave 4-5 hours between meals for the migrating motor complex
• Avoid eating 3 hours before bed
• Practice mindful eating - chew thoroughly
• Start meals with bitter foods to stimulate digestion`
            },
            {
                title: "Chapter 3: The 4-Week Protocol",
                readTime: "7 min",
                content: `WEEK 1: ELIMINATION PHASE
Remove inflammatory foods completely:
- No gluten, dairy, sugar, alcohol, caffeine
- Focus on whole, unprocessed foods
- Keep a detailed food and symptom journal
- Stay hydrated (half your body weight in ounces)

WEEK 2: HEAL & SEAL
- Introduce gut-healing nutrients daily
- Morning: Bone broth or collagen peptides
- Supplements: L-Glutamine (5g), Zinc Carnosine
- Add slippery elm or marshmallow root tea

WEEK 3: REPOPULATE
- Add in fermented foods daily
- Start a high-quality probiotic (50B+ CFU)
- Include prebiotic fiber at each meal
- Continue all Week 2 protocols

WEEK 4: REINTRODUCE
- Add back one food group every 3 days
- Note any reactions in your journal
- Establish your personal "yes" and "no" foods
- Create your sustainable maintenance plan

Remember: Healing takes time. Be patient with your body.`
            },
            {
                title: "Chapter 4: Supplement Guide",
                readTime: "4 min",
                content: `ESSENTIAL GUT-HEALING SUPPLEMENTS:

1. L-GLUTAMINE (5-10g daily)
   - Primary fuel for intestinal cells
   - Repairs gut lining
   - Best taken on empty stomach

2. ZINC CARNOSINE (75-150mg daily)
   - Supports mucosal lining
   - Reduces inflammation
   - Take with meals

3. PROBIOTIC (50 billion+ CFU)
   - Multi-strain formula
   - Refrigerated for potency
   - Take away from antibiotics

4. DIGESTIVE ENZYMES
   - Take with protein-heavy meals
   - Helps break down food
   - Reduces bloating

5. OMEGA-3 FISH OIL (2-3g EPA/DHA)
   - Reduces gut inflammation
   - Supports gut barrier
   - Choose molecularly distilled

BONUS: Consider adding colostrum, collagen peptides, and slippery elm for additional support.

Always consult with a healthcare provider before starting supplements.`
            },
        ]
    },
    {
        id: "hormone-balance",
        title: "Hormone Balance Blueprint",
        description: "Perfect for clients 35+ experiencing hormonal shifts. Covers natural balancing strategies, nutrition, and lifestyle modifications.",
        author: "Dr. Sarah Mitchell, NBC-HWC",
        pages: 35,
        icon: "🌸",
        category: "hormones",
        topics: ["Hormones", "Women's Health", "Lifestyle"],
        readTime: "20 min",
        unlockedDate: "2024-11-20",
        chapters: [
            { title: "Introduction", readTime: "2 min", content: "Hormones are the body's chemical messengers, controlling everything from metabolism to mood. This guide will help you understand hormonal health and implement natural balancing strategies for your clients experiencing hormonal shifts.\n\nWhether you're working with women navigating perimenopause, clients with thyroid imbalances, or anyone struggling with hormonal symptoms, this blueprint gives you the knowledge and tools you need." },
            { title: "Chapter 1: Hormone Basics", readTime: "5 min", content: "Understanding estrogen, progesterone, testosterone, cortisol, and thyroid hormones. How they interact and why balance matters. The HPA axis and stress response.\n\nKey hormones covered:\n• Estrogen - The feminizing hormone\n• Progesterone - The calming hormone\n• Testosterone - For energy and libido\n• Cortisol - The stress hormone\n• Thyroid - The metabolism regulator" },
            { title: "Chapter 2: Nutrition for Hormones", readTime: "6 min", content: "Foods that support hormonal health: cruciferous vegetables, healthy fats, quality proteins. What to avoid: sugar, processed foods, excess caffeine. Meal timing and blood sugar balance.\n\nThe Blood Sugar-Hormone Connection:\nWhen blood sugar spikes and crashes, it triggers cortisol release, which disrupts all other hormones. Stabilizing blood sugar is step one." },
            { title: "Chapter 3: Lifestyle Factors", readTime: "4 min", content: "Sleep optimization for hormone health. Stress management techniques. Exercise recommendations for hormonal balance. Environmental toxins to avoid.\n\nSleep is when your body produces growth hormone and repairs tissues. Poor sleep = poor hormones." },
            { title: "Chapter 4: Supplement Support", readTime: "3 min", content: "Key supplements for hormonal health: Vitex, DIM, Maca, Magnesium. When to use adaptogens. Working with a healthcare provider.\n\nTop Adaptogens:\n• Ashwagandha - For cortisol balance\n• Maca - For energy and libido\n• Rhodiola - For stress resilience" },
        ]
    },
    {
        id: "sleep-optimization",
        title: "Sleep Optimization Handbook",
        description: "Help your clients transform their sleep quality with evidence-based strategies. Includes sleep tracking templates and bedtime routines.",
        author: "AccrediPro Academy",
        pages: 28,
        icon: "😴",
        category: "sleep",
        topics: ["Sleep", "Recovery", "Wellness"],
        readTime: "15 min",
        unlockedDate: "2024-12-01",
        chapters: [
            { title: "Introduction", readTime: "2 min", content: "Quality sleep is the foundation of health. This handbook provides science-backed strategies to help your clients achieve restorative sleep night after night.\n\nWithout quality sleep, every other health intervention you recommend will be less effective. Sleep is where healing happens." },
            { title: "Chapter 1: Sleep Science", readTime: "4 min", content: "Understanding sleep cycles, circadian rhythms, and what happens when we don't get enough rest. The 4 stages of sleep and why each matters.\n\nStage 1: Light sleep - transition\nStage 2: Light sleep - memory consolidation\nStage 3: Deep sleep - physical restoration\nREM: Dream sleep - mental restoration" },
            { title: "Chapter 2: The Perfect Bedtime Routine", readTime: "5 min", content: "Step-by-step evening routines that prepare the body and mind for deep sleep. Light exposure, temperature, and timing considerations.\n\nThe 10-3-2-1-0 Rule:\n• 10 hours before bed: No more caffeine\n• 3 hours before bed: No more food/alcohol\n• 2 hours before bed: No more work\n• 1 hour before bed: No more screens\n• 0: The number of times you hit snooze" },
            { title: "Chapter 3: Sleep Environment", readTime: "4 min", content: "Optimizing your bedroom for sleep: temperature, darkness, sound. The best mattresses and pillows. Electronics and EMF considerations.\n\nIdeal sleep temperature: 65-68°F (18-20°C)\nDarkness: Complete blackout or sleep mask\nSound: White noise or silence" },
        ]
    },
];

// Types for progress tracking
interface ReadingProgress {
    [ebookId: string]: {
        currentChapter: number;
        completedChapters: number[];
        lastRead: string;
        started: boolean;
    };
}

export default function MyLibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [savedEbooks, setSavedEbooks] = useState<string[]>([]);
    const [readingEbook, setReadingEbook] = useState<typeof MY_EBOOKS[0] | null>(null);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [showTOC, setShowTOC] = useState(false);
    const [readingProgress, setReadingProgress] = useState<ReadingProgress>({});
    const [activeTab, setActiveTab] = useState<"all" | "inprogress" | "completed">("all");

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("library-saved");
        const progress = localStorage.getItem("library-progress");
        if (saved) setSavedEbooks(JSON.parse(saved));
        if (progress) setReadingProgress(JSON.parse(progress));
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("library-saved", JSON.stringify(savedEbooks));
    }, [savedEbooks]);

    useEffect(() => {
        localStorage.setItem("library-progress", JSON.stringify(readingProgress));
    }, [readingProgress]);

    const toggleSaved = (ebookId: string) => {
        setSavedEbooks(prev =>
            prev.includes(ebookId)
                ? prev.filter(id => id !== ebookId)
                : [...prev, ebookId]
        );
    };

    const markChapterComplete = (ebookId: string, chapterIndex: number) => {
        setReadingProgress(prev => {
            const existing = prev[ebookId] || { currentChapter: 0, completedChapters: [], lastRead: "", started: false };
            const completed = existing.completedChapters.includes(chapterIndex)
                ? existing.completedChapters
                : [...existing.completedChapters, chapterIndex];
            return {
                ...prev,
                [ebookId]: {
                    ...existing,
                    completedChapters: completed,
                    lastRead: new Date().toISOString(),
                    started: true,
                }
            };
        });
    };

    const updateCurrentChapter = (ebookId: string, chapterIndex: number) => {
        setReadingProgress(prev => ({
            ...prev,
            [ebookId]: {
                ...prev[ebookId] || { completedChapters: [], started: false },
                currentChapter: chapterIndex,
                lastRead: new Date().toISOString(),
                started: true,
            }
        }));
        setCurrentChapter(chapterIndex);
    };

    const startReading = (ebook: typeof MY_EBOOKS[0]) => {
        const progress = readingProgress[ebook.id];
        const resumeChapter = progress?.currentChapter || 0;
        setReadingEbook(ebook);
        setCurrentChapter(resumeChapter);
        setReadingProgress(prev => ({
            ...prev,
            [ebook.id]: {
                ...prev[ebook.id] || { completedChapters: [] },
                currentChapter: resumeChapter,
                lastRead: new Date().toISOString(),
                started: true,
            }
        }));
    };

    const getEbookProgress = (ebookId: string, totalChapters: number): number => {
        const progress = readingProgress[ebookId];
        if (!progress) return 0;
        return Math.round((progress.completedChapters.length / totalChapters) * 100);
    };

    const isEbookComplete = (ebookId: string, totalChapters: number): boolean => {
        const progress = readingProgress[ebookId];
        if (!progress) return false;
        return progress.completedChapters.length === totalChapters;
    };

    const filteredEbooks = MY_EBOOKS.filter(ebook => {
        const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;

        if (activeTab === "inprogress") {
            const progress = readingProgress[ebook.id];
            return matchesSearch && matchesCategory && progress?.started && !isEbookComplete(ebook.id, ebook.chapters.length);
        }
        if (activeTab === "completed") {
            return matchesSearch && matchesCategory && isEbookComplete(ebook.id, ebook.chapters.length);
        }
        return matchesSearch && matchesCategory;
    });

    const inProgressCount = MY_EBOOKS.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).length;
    const completedCount = MY_EBOOKS.filter(e => isEbookComplete(e.id, e.chapters.length)).length;

    // READING VIEW
    if (readingEbook) {
        const ebookProgress = readingProgress[readingEbook.id] || { completedChapters: [], currentChapter: 0 };
        const isChapterComplete = ebookProgress.completedChapters.includes(currentChapter);

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Reading Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" onClick={() => { setReadingEbook(null); setCurrentChapter(0); setShowTOC(false); }}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
                                </Button>
                                <div className="hidden md:flex items-center gap-3">
                                    <span className="text-2xl">{readingEbook.icon}</span>
                                    <div>
                                        <h1 className="font-bold text-gray-900">{readingEbook.title}</h1>
                                        <p className="text-sm text-gray-500">
                                            {ebookProgress.completedChapters.length} of {readingEbook.chapters.length} chapters
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowTOC(!showTOC)}>
                                    <List className="w-4 h-4 mr-2" /> Contents
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => alert("Downloading PDF...")}>
                                    <Download className="w-4 h-4 mr-2" /> PDF
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => alert("Share link copied!")}>
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-2" />
                        </div>
                    </div>
                </div>

                {/* TOC Drawer */}
                {showTOC && (
                    <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setShowTOC(false)}>
                        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Table of Contents</h2>
                                <Button variant="ghost" size="sm" onClick={() => setShowTOC(false)}>✕</Button>
                            </div>

                            <div className="mb-4">
                                <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-3" />
                                <p className="text-xs text-gray-400 mt-1">
                                    {ebookProgress.completedChapters.length} of {readingEbook.chapters.length} complete
                                </p>
                            </div>

                            <div className="space-y-2">
                                {readingEbook.chapters.map((chapter, i) => {
                                    const isComplete = ebookProgress.completedChapters.includes(i);
                                    const isCurrent = i === currentChapter;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => { updateCurrentChapter(readingEbook.id, i); setShowTOC(false); }}
                                            className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3 ${isCurrent ? "bg-burgundy-100 border-2 border-burgundy-300" : "bg-gray-50 hover:bg-gray-100"}`}
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : isCurrent ? <PlayCircle className="w-5 h-5 text-burgundy-600" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-medium ${isCurrent ? "text-burgundy-700" : "text-gray-900"}`}>{chapter.title}</p>
                                                <p className="text-xs text-gray-500 mt-1"><Clock className="w-3 h-3 inline mr-1" />{chapter.readTime}</p>
                                            </div>
                                            {isComplete && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Done</Badge>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reading Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Chapter Sidebar */}
                        <div className="hidden lg:block w-72 flex-shrink-0">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-28">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Chapters</p>
                                <div className="space-y-1">
                                    {readingEbook.chapters.map((chapter, i) => {
                                        const isComplete = ebookProgress.completedChapters.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => updateCurrentChapter(readingEbook.id, i)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${currentChapter === i ? "bg-burgundy-100 text-burgundy-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                                            >
                                                {isComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                                                <span className="truncate">{chapter.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>Progress</span>
                                        <span>{getEbookProgress(readingEbook.id, readingEbook.chapters.length)}%</span>
                                    </div>
                                    <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-2" />
                                </div>
                            </div>
                        </div>

                        {/* Reading Area */}
                        <div className="flex-1 max-w-3xl">
                            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
                                <div className="flex items-center justify-between mb-6">
                                    <Badge variant="outline">Chapter {currentChapter + 1} of {readingEbook.chapters.length}</Badge>
                                    <span className="text-xs text-gray-500"><Clock className="w-3 h-3 inline mr-1" />{readingEbook.chapters[currentChapter].readTime}</span>
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-8">{readingEbook.chapters[currentChapter].title}</h2>

                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                        {readingEbook.chapters[currentChapter].content}
                                    </p>
                                </div>

                                {/* Mark Complete */}
                                <div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {isChapterComplete ? "✅ Chapter completed!" : "Finished reading?"}
                                    </span>
                                    {!isChapterComplete && (
                                        <Button size="sm" onClick={() => markChapterComplete(readingEbook.id, currentChapter)} className="bg-emerald-600 hover:bg-emerald-700">
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
                                        </Button>
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-between mt-8 pt-8 border-t border-gray-100">
                                    <Button variant="outline" onClick={() => updateCurrentChapter(readingEbook.id, Math.max(0, currentChapter - 1))} disabled={currentChapter === 0}>
                                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            markChapterComplete(readingEbook.id, currentChapter);
                                            if (currentChapter === readingEbook.chapters.length - 1) {
                                                alert("🎉 Congratulations! You've completed this e-book!");
                                            } else {
                                                updateCurrentChapter(readingEbook.id, currentChapter + 1);
                                            }
                                        }}
                                        className="bg-burgundy-600 hover:bg-burgundy-700"
                                    >
                                        {currentChapter === readingEbook.chapters.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIBRARY VIEW
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="relative mb-10 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Library className="w-7 h-7 text-white" />
                            </div>
                            <Badge className="bg-gold-400 text-burgundy-900 border-0 font-semibold">Your Collection</Badge>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">My Library</h1>

                        <p className="text-lg text-white/90 max-w-2xl mb-6">
                            Your unlocked e-books, guides, and resources.
                            <span className="text-gold-300 font-medium"> Read, track progress, and share with clients!</span>
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <BookOpen className="w-4 h-4" /> {MY_EBOOKS.length} E-Books
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <PlayCircle className="w-4 h-4" /> {inProgressCount} In Progress
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <CheckCircle2 className="w-4 h-4" /> {completedCount} Completed
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Reading Section */}
                {inProgressCount > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-burgundy-600" /> Continue Reading
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {MY_EBOOKS.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).map((ebook) => {
                                const progress = getEbookProgress(ebook.id, ebook.chapters.length);
                                const lastChapter = readingProgress[ebook.id]?.currentChapter || 0;
                                return (
                                    <div key={ebook.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => startReading(ebook)}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{ebook.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{ebook.title}</h3>
                                                <p className="text-xs text-gray-500">Chapter {lastChapter + 1}</p>
                                            </div>
                                        </div>
                                        <Progress value={progress} className="h-1.5 mb-2" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{progress}% complete</span>
                                            <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 h-7 text-xs">
                                                <PlayCircle className="w-3 h-3 mr-1" /> Resume
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setActiveTab("all")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "all" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        All ({MY_EBOOKS.length})
                    </button>
                    <button onClick={() => setActiveTab("inprogress")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "inprogress" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        <PlayCircle className="w-4 h-4 inline mr-1" /> In Progress ({inProgressCount})
                    </button>
                    <button onClick={() => setActiveTab("completed")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "completed" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        <CheckCircle2 className="w-4 h-4 inline mr-1" /> Completed ({completedCount})
                    </button>
                </div>

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
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search your library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 py-5 rounded-xl border-gray-200"
                    />
                </div>

                {/* E-Books Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEbooks.map((ebook) => {
                        const progress = getEbookProgress(ebook.id, ebook.chapters.length);
                        const isComplete = isEbookComplete(ebook.id, ebook.chapters.length);
                        const hasStarted = readingProgress[ebook.id]?.started;

                        return (
                            <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-4xl">{ebook.icon}</span>
                                        <div className="flex items-center gap-2">
                                            {isComplete && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">✓ Complete</Badge>}
                                            {!isComplete && progress > 0 && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{progress}%</Badge>}
                                            <Button variant="ghost" size="sm" onClick={() => toggleSaved(ebook.id)} className={savedEbooks.includes(ebook.id) ? "text-burgundy-600" : "text-gray-400"}>
                                                {savedEbooks.includes(ebook.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-burgundy-600 transition-colors">{ebook.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>
                                    <p className="text-xs text-burgundy-600 font-medium mb-3">By {ebook.author}</p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {ebook.topics.slice(0, 2).map((topic) => (
                                            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <span><FileText className="w-3 h-3 inline mr-1" />{ebook.chapters.length} chapters</span>
                                        <span className="mx-2">•</span>
                                        <span><Clock className="w-3 h-3 inline mr-1" />{ebook.readTime}</span>
                                    </div>

                                    {progress > 0 && !isComplete && (
                                        <div className="mb-3">
                                            <Progress value={progress} className="h-1.5" />
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-burgundy-600 hover:bg-burgundy-700" onClick={() => startReading(ebook)}>
                                            {isComplete ? <><Eye className="w-4 h-4 mr-2" /> Read Again</> : hasStarted ? <><PlayCircle className="w-4 h-4 mr-2" /> Continue</> : <><BookOpen className="w-4 h-4 mr-2" /> Start Reading</>}
                                        </Button>
                                        <Button variant="outline" onClick={() => alert("Downloading PDF...")}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredEbooks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4">No e-books found</p>
                        <Button variant="outline" onClick={() => { setActiveTab("all"); setSelectedCategory("all"); setSearchQuery(""); }}>
                            View All E-Books
                        </Button>
                    </div>
                )}

                {/* Get More CTA */}
                <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Want More E-Books?</h2>
                                <p className="text-white/80">Browse our store for premium guides and bundles</p>
                            </div>
                        </div>
                        <a href="/ebooks">
                            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-6 py-6 text-lg">
                                Browse E-Book Store <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
