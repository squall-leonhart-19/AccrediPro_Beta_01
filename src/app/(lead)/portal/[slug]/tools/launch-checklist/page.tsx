"use client";

import { useState } from "react";
import { CheckSquare, CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const checklistCategories = [
    {
        id: "legal",
        title: "Legal & Business Setup",
        description: "Protect yourself and look professional",
        items: [
            { id: "legal-1", task: "Register your business (LLC or Sole Prop)", link: null },
            { id: "legal-2", task: "Get business liability insurance", link: "https://www.hiscox.com" },
            { id: "legal-3", task: "Create client intake forms", link: null },
            { id: "legal-4", task: "Draft coaching agreement/contract", link: null },
            { id: "legal-5", task: "Set up separate business bank account", link: null },
        ],
    },
    {
        id: "tech",
        title: "Tech & Tools",
        description: "The essentials (keep it simple!)",
        items: [
            { id: "tech-1", task: "Set up scheduling tool (Calendly/Acuity)", link: "https://calendly.com" },
            { id: "tech-2", task: "Create Zoom account for video calls", link: "https://zoom.us" },
            { id: "tech-3", task: "Choose payment processor (Stripe/Square)", link: "https://stripe.com" },
            { id: "tech-4", task: "Set up email marketing (ConvertKit/Mailchimp)", link: "https://convertkit.com" },
            { id: "tech-5", task: "Get project management tool (Notion/Trello)", link: "https://notion.so" },
        ],
    },
    {
        id: "online",
        title: "Online Presence",
        description: "How people find and trust you",
        items: [
            { id: "online-1", task: "Create/update LinkedIn profile for coaching", link: null },
            { id: "online-2", task: "Create/update Instagram bio", link: null },
            { id: "online-3", task: "Build simple landing page (Carrd/Squarespace)", link: "https://carrd.co" },
            { id: "online-4", task: "Write your 'About' story (2 paragraphs)", link: null },
            { id: "online-5", task: "Create professional headshot", link: null },
        ],
    },
    {
        id: "offers",
        title: "Offers & Pricing",
        description: "What you sell and for how much",
        items: [
            { id: "offers-1", task: "Define your signature package (3-6 sessions)", link: null },
            { id: "offers-2", task: "Set your package price (use our calculator!)", link: null },
            { id: "offers-3", task: "Create simple sales page or PDF", link: null },
            { id: "offers-4", task: "Write 3 testimonial request templates", link: null },
            { id: "offers-5", task: "Define your payment terms (upfront/split)", link: null },
        ],
    },
    {
        id: "content",
        title: "Content & Lead Gen",
        description: "Attract your first clients",
        items: [
            { id: "content-1", task: "Write 10 content ideas for your niche", link: null },
            { id: "content-2", task: "Create your lead magnet (checklist/guide)", link: null },
            { id: "content-3", task: "Set up email welcome sequence (3 emails)", link: null },
            { id: "content-4", task: "Post your first 'what I do' announcement", link: null },
            { id: "content-5", task: "Message 10 people who might need help", link: null },
        ],
    },
    {
        id: "systems",
        title: "Client Systems",
        description: "Deliver a great experience",
        items: [
            { id: "systems-1", task: "Create client welcome email template", link: null },
            { id: "systems-2", task: "Build client tracking spreadsheet/doc", link: null },
            { id: "systems-3", task: "Write session prep questions", link: null },
            { id: "systems-4", task: "Create follow-up email templates", link: null },
            { id: "systems-5", task: "Set up testimonial request process", link: null },
        ],
    },
];

export default function LaunchChecklistPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [completedItems, setCompletedItems] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(["legal"]);

    const toggleItem = (itemId: string) => {
        setCompletedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const totalItems = checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    const progressPercent = Math.round((completedItems.length / totalItems) * 100);

    const getCategoryProgress = (categoryId: string) => {
        const category = checklistCategories.find(c => c.id === categoryId);
        if (!category) return 0;
        const completed = category.items.filter(item => completedItems.includes(item.id)).length;
        return Math.round((completed / category.items.length) * 100);
    };

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl p-3" style={{ background: GOLD_GRADIENT }}>
                            <CheckSquare className="w-8 h-8" style={{ color: "#4e1f24" }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Business Launch Checklist</h1>
                            <p className="text-white/60">Everything you need to start your coaching business</p>
                        </div>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="p-6 rounded-xl mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="font-bold text-white">Launch Readiness</h2>
                            <p className="text-white/50 text-sm">{completedItems.length} of {totalItems} tasks complete</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold" style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {progressPercent}%
                            </p>
                        </div>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%`, background: GOLD_GRADIENT }}
                        />
                    </div>
                    {progressPercent === 100 && (
                        <p className="text-green-400 text-center mt-3 font-semibold">🎉 You're ready to launch!</p>
                    )}
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    {checklistCategories.map((category) => {
                        const categoryProgress = getCategoryProgress(category.id);
                        const isExpanded = expandedCategories.includes(category.id);

                        return (
                            <div
                                key={category.id}
                                className="rounded-xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-10 h-10">
                                            <svg className="w-10 h-10 -rotate-90">
                                                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                                <circle
                                                    cx="20" cy="20" r="16" fill="none"
                                                    stroke={categoryProgress === 100 ? "#22c55e" : "#D4AF37"}
                                                    strokeWidth="3"
                                                    strokeDasharray={`${categoryProgress} 100`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                                {categoryProgress}%
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-white">{category.title}</h3>
                                            <p className="text-sm text-white/50">{category.description}</p>
                                        </div>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-white/40" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-white/40" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-2">
                                        {category.items.map((item) => {
                                            const isCompleted = completedItems.includes(item.id);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(item.id)}
                                                        className="flex-shrink-0"
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-white/30" />
                                                        )}
                                                    </button>
                                                    <span className={`flex-1 text-sm ${isCompleted ? "text-white/50 line-through" : "text-white/80"}`}>
                                                        {item.task}
                                                    </span>
                                                    {item.link && (
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-amber-400 hover:text-amber-300"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Check Off 'Get Certified'?</h3>
                    <p className="text-white/60 mb-4">That's the most important box to tick</p>
                    <Link
                        href="#"
                        className="inline-block px-6 py-3 rounded-xl font-bold"
                        style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}
                    >
                        Learn How to Get Certified
                    </Link>
                </div>
            </div>
        </div>
    );
}
