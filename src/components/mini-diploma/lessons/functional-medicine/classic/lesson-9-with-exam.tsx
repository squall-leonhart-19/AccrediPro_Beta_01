"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";
import { FMExamComponent } from "@/components/mini-diploma/fm-exam-component";
import { SarahChatPanel } from "@/components/mini-diploma/sarah-chat-panel";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, BookOpen, MessageCircle, X } from "lucide-react";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    userId?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

type LessonState = "lesson" | "exam-intro" | "exam";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * Lesson 9 with integrated final exam
 *
 * Flow:
 * 1. User reads lesson content
 * 2. Instead of "Continue" button, shows "Take Final Exam" CTA
 * 3. User takes 10-question exam
 * 4. Score 95+: Scholarship qualified -> redirects to completion page with offer
 * 5. Score <95: Still completes, redirects to completion page without scholarship
 */
export function ClassicLessonYourNextStepWithExam({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    userId,
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const router = useRouter();
    const [lessonState, setLessonState] = useState<LessonState>("lesson");
    const [chatOpen, setChatOpen] = useState(false);

    const sections: LessonSection[] = [
        {
            type: 'intro',
            content: `{name}, you made it. You completed all 9 lessons. I'm genuinely proud of you. Before we talk about what's next, I want to show you what's POSSIBLE. Not theory. Not hype. REAL income potential from certified practitioners who started exactly where you are.`,
        },
        {
            type: 'heading',
            content: 'Your Income Potential: The FULL Picture',
        },
        {
            type: 'text',
            content: `Here's what certified functional medicine practitioners actually earn. These aren't cherry-picked outliers - these are the FOUR income tiers we see across our graduate community:`,
        },
        {
            type: 'list',
            content: '🌱 TIER 1: Side Hustle ($3K-$8K/month)',
            items: [
                '5-10 clients • 10-15 hours/week • $150-175/session',
                'Perfect for: People keeping their day job',
                'Timeline: Achievable within 3-6 months',
                'Example: Nancy from Illinois - $4,900/month working 12 hrs/week',
            ],
        },
        {
            type: 'list',
            content: '🚀 TIER 2: Full Income Replacement ($10K-$15K/month)',
            items: [
                '15-25 clients • 20-25 hours/week • $175-250/session',
                'Perfect for: Those ready to quit their 9-5',
                'Timeline: Achievable within 12-18 months',
                'Example: Diana from Georgia - $8,500/month (quit corporate at 53)',
            ],
        },
        {
            type: 'list',
            content: '💎 TIER 3: Premium Practice ($20K-$35K/month)',
            items: [
                '20-40 clients • Group programs • $250-400/session',
                'Perfect for: Those building a recognized brand',
                'Timeline: Achievable within 2-3 years',
                'Includes group coaching, courses, and premium packages',
            ],
        },
        {
            type: 'list',
            content: '👑 TIER 4: Empire Builder ($50K-$100K+/month)',
            items: [
                'Team of coaches • Online courses • Retreats • Speaking',
                'Perfect for: Those who want to scale beyond 1-on-1',
                'Timeline: 3-5 years of committed growth',
                'Example: Top graduates running 6-7 figure practices',
            ],
        },
        {
            type: 'key-point',
            content: `Where you land depends on YOUR ambition, YOUR hours, and YOUR commitment. The certification opens ALL these doors. You choose which one to walk through.`,
        },
        {
            type: 'heading',
            content: 'The Math That Changes Everything',
        },
        {
            type: 'list',
            content: 'Your Investment vs. Return:',
            items: [
                'Full certification investment: $297',
                'ONE session at $175 = 60% of investment recovered',
                'TWO sessions = FULL investment recovered + profit',
                'Sessions needed to hit $10K/month: Just 50-60 (about 15/week)',
            ],
        },
        {
            type: 'callout',
            content: `Compare this to ANY other career path: Medical school ($250K+, 8+ years). MBA ($100K+, 2 years). Even trade school ($15K+, 6+ months). For $297 and focused effort, you can build a $100K+/year practice. This is the lowest-risk, highest-upside career investment you'll ever make.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Story: From Skeptic to $8,500/Month',
        },
        {
            type: 'quote',
            content: `"I was the biggest skeptic. 'This won't work for me.' 'I'm too old.' 'Nobody will pay me.' Every excuse in the book. My daughter finally said: 'Mom, stop talking about it and just do it.' Month 1: 0 clients. Panic. Month 3: 4 clients. $700. Month 6: 8 clients. $2,400. Month 12: 14 clients. $4,900. I gave notice. Month 24: 18 clients + group program. $8,500/month. 22 hours/week. At 53, I started over. At 55, I have the career I always wanted. The only failure would have been not trying." - Diana M., Georgia | ASI Graduate 2022`,
        },
        {
            type: 'heading',
            content: 'What You\'ve Learned (And Why It\'s Valuable)',
        },
        {
            type: 'list',
            content: 'Your New Knowledge Is Worth $$$:',
            items: [
                'Root cause thinking - what doctors spend 7+ years NOT learning',
                'Gut health - the foundation 90% of practitioners miss',
                'Inflammation - the silent killer clients NEED help with',
                'Toxins - a growing crisis creating massive demand',
                'Stress & hormones - burnout epidemic = endless clients',
                'Lab interpretation - functional ranges = competitive edge',
                'Client acquisition - the business side most "healers" ignore',
            ],
        },
        {
            type: 'callout',
            content: `You now know more about root-cause health than most conventionally trained healthcare providers. They learned disease TREATMENT. You learned disease PREVENTION and ROOT CAUSE resolution. That knowledge is worth $100K+/year to the right clients.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Your Next Step: Get Fully Certified',
        },
        {
            type: 'text',
            content: `This Mini Diploma gave you the foundation. The FULL Functional Medicine Certification is what separates you from everyone else:`,
        },
        {
            type: 'list',
            content: 'Full Certification Includes:',
            items: [
                '✅ Advanced protocols and complete frameworks',
                '✅ Video masterclasses with in-depth case studies',
                '✅ Client intake templates and business systems',
                '✅ Marketing playbook to fill your practice',
                '✅ Private community of certified practitioners',
                '✅ Lifetime updates as the field evolves',
                '✅ Official ASI certificate to display',
            ],
        },
        {
            type: 'key-point',
            content: `Certified practitioners command 3x higher rates ($175-300/session vs $50-75 for "wellness coaches"). The certification pays for itself with your FIRST client. Everything after is pure profit.`,
        },
    ];

    const keyTakeaways = [
        'Income Tier 1: $3K-8K/month (side hustle, 10-15 hrs/week)',
        'Income Tier 2: $10K-15K/month (full income replacement)',
        'Income Tier 3+: $20K-50K+/month (premium practice, group programs)',
        'Full certification investment recovered in just 2 client sessions',
        'Certified practitioners earn 3x more than uncertified wellness coaches',
    ];

    // Handle exam completion
    const handleExamComplete = useCallback(async (score: number, scholarshipQualified: boolean) => {
        // Mark lesson as complete
        if (onComplete) {
            await onComplete();
        }

        // Call the mini-diploma complete API
        try {
            await fetch("/api/mini-diploma/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
        } catch (e) {
            console.error("Failed to call complete API:", e);
        }

        // Always redirect to scholarship VSL page (masterclass)
        router.push("/scholarship");
    }, [onComplete, router]);

    // Handle proceeding to exam
    const handleProceedToExam = useCallback(() => {
        setLessonState("exam");
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // If showing exam
    if (lessonState === "exam") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex">
                {/* Main Content */}
                <div className="flex-1 py-8">
                    <div className="max-w-3xl mx-auto px-4">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-100 rounded-full text-burgundy-700 text-sm font-medium mb-4">
                                <BookOpen className="w-4 h-4" />
                                Functional Medicine Mini Diploma
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Final Assessment
                            </h1>
                            <p className="text-slate-600 mt-2">
                                Lesson 9 of 9 Complete - Now prove your knowledge!
                            </p>
                        </div>

                        {/* Exam Component */}
                        <FMExamComponent
                            firstName={firstName}
                            userId={userId}
                            onExamComplete={handleExamComplete}
                        />
                    </div>
                </div>

                {/* RIGHT SIDEBAR - Sarah Chat - Desktop LG+ */}
                <aside className="hidden lg:flex w-[340px] flex-shrink-0 border-l border-gray-200 flex-col h-screen sticky top-0 bg-white">
                    <SarahChatPanel userName={firstName} />
                </aside>

                {/* MOBILE: Floating Chat Button */}
                <button
                    onClick={() => setChatOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-burgundy-600 to-rose-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    style={{ display: chatOpen ? "none" : "flex" }}
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                        💬
                    </span>
                </button>

                {/* MOBILE: Chat Overlay */}
                {chatOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-50 bg-black/50"
                        onClick={() => setChatOpen(false)}
                    >
                        <div
                            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-burgundy-600 to-rose-600 text-white">
                                <span className="font-semibold flex items-center gap-2">
                                    💬 Chat with Sarah
                                </span>
                                <button
                                    onClick={() => setChatOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <SarahChatPanel userName={firstName} onClose={() => setChatOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Show lesson - onNext will go to /exam page (handled by lesson page)
    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Income Potential"
            lessonSubtitle="Real numbers from real graduates"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext} // This goes to /portal/{slug}/exam
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/functional-medicine-diploma"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
