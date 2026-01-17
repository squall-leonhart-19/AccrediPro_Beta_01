"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";
import { FMExamComponent } from "@/components/mini-diploma/fm-exam-component";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, BookOpen } from "lucide-react";

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

    const sections: LessonSection[] = [
        {
            type: 'intro',
            content: `{name}, you made it. You completed all 9 lessons. I'm genuinely proud of you. Before we talk about what's next, I want to show you what's POSSIBLE. Not theory. Not hype. REAL numbers from real graduates who started exactly where you are.`,
        },
        {
            type: 'heading',
            content: '"What If I Fail?"',
        },
        {
            type: 'text',
            content: `Let me address the elephant in the room. The fear that keeps most people stuck. What if you invest in certification and it doesn't work out?`,
        },
        {
            type: 'list',
            content: 'Let\'s Do the Math:',
            items: [
                'Full certification investment: $297',
                'Average session rate after certification: $175',
                'Sessions needed to break even: 2',
                'Time to get 2 clients: Usually 2-4 weeks',
            ],
        },
        {
            type: 'callout',
            content: `TWO clients. That's all it takes to recover your investment. Everything after that? Pure upside. Compare that to a college degree ($50,000+) or even a weekend seminar ($2,000+). This is one of the lowest-risk career investments you can make.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Income: What Graduates Actually Earn',
        },
        {
            type: 'text',
            content: `Here are REAL numbers from our graduate community. These aren't the outliers - these are typical results for people who actually implement.`,
        },
        {
            type: 'list',
            content: '6 MONTHS IN (Part-Time):',
            items: [
                'Clients: 5-8',
                'Rate: $150-175/session',
                'Hours: 8-12/week',
                'Monthly income: $1,500-3,000',
            ],
        },
        {
            type: 'list',
            content: '12 MONTHS IN (Growing):',
            items: [
                'Clients: 10-15',
                'Rate: $175-225/session',
                'Hours: 15-20/week',
                'Monthly income: $3,500-5,500',
            ],
        },
        {
            type: 'list',
            content: '24 MONTHS IN (Established):',
            items: [
                'Clients: 12-20',
                'Rate: $200-300/session',
                'Hours: 15-25/week',
                'Monthly income: $5,000-8,000+',
                'Often have waitlists',
            ],
        },
        {
            type: 'key-point',
            content: `Notice: These are PART-TIME numbers. Most graduates work 15-20 hours/week and earn $4,000-6,000/month. That's $50-75/hour effective rate. More than most corporate jobs. With flexibility. Doing work that matters.`,
        },
        {
            type: 'heading',
            content: 'Real Story: Diana, 53 - The Skeptic Who Made It',
        },
        {
            type: 'quote',
            content: `"I was the biggest skeptic. 'This won't work for me.' 'I'm too old.' 'Nobody will pay me.' 'I don't have time.' Every excuse in the book. My daughter finally said: 'Mom, stop talking about it and just do it.' So I did. Month 1: 0 clients. Panic. Month 2: 2 clients from church. $300 total. Month 3: 4 clients. $700. I almost quit. Month 6: 8 clients. $2,400. I stopped making excuses. Month 12: 14 clients. $4,900. I gave my corporate job 2 weeks notice. Month 24 (now): 18 clients. $6,800/month. 22 hours/week. Complete control of my schedule. At 53, I started over. At 55, I have the career I always wanted. The only failure would have been not trying." - Diana M., Georgia | ASI Graduate 2022`,
        },
        {
            type: 'heading',
            content: 'What You\'ve Learned',
        },
        {
            type: 'list',
            content: 'Your New Knowledge:',
            items: [
                'Root cause thinking - the 5 causes behind all chronic disease',
                'Gut health - why it\'s the foundation of everything',
                'Inflammation - the silent killer and how to address it',
                'Toxins - environmental health in a poisoned world',
                'Stress & hormones - the burnout epidemic and HPA axis',
                'Nutrients - what doctors miss in lab reviews',
                'Lab interpretation - functional vs. conventional ranges',
                'Client acquisition - the 90-day path to paying clients',
            ],
        },
        {
            type: 'callout',
            content: `You now know more about root-cause health than most conventionally trained healthcare providers. Seriously. They learn disease treatment. You learned disease PREVENTION and ROOT CAUSE resolution.`,
            style: 'success',
        },
    ];

    const keyTakeaways = [
        '2 clients at $175/session = full certification investment recovered',
        'Typical 12-month graduate: 10-15 clients, $175-225/session, $3,500-5,500/month',
        'Part-time (15-20 hrs/week) can generate $4,000-6,000/month',
        'You now know more about root-cause health than most healthcare providers',
        'The world needs more people who understand functional medicine',
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

        // Redirect to completion page with score info
        const params = new URLSearchParams({
            score: score.toString(),
            scholarship: scholarshipQualified ? "1" : "0",
        });
        router.push(`/functional-medicine-diploma/complete?${params.toString()}`);
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
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
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
        );
    }

    // Show lesson with custom completion behavior
    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Income Potential"
            lessonSubtitle="Real numbers from real graduates"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            // Don't pass onComplete/onNext - we handle it custom
            onComplete={() => {}}
            onNext={handleProceedToExam}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/functional-medicine-diploma"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
