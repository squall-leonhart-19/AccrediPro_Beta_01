"use client";

import { BookOpen, Quote, TrendingUp, Calendar, DollarSign, Heart, Star } from "lucide-react";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const timeline = [
    {
        month: "Before",
        title: "Rock Bottom",
        content: "12-hour shifts, chronic exhaustion, missed family events. Making $65K but feeling like my life wasn't my own.",
        metric: "$65K/year • 60+ hrs/week",
        color: "#ef4444",
    },
    {
        month: "Month 1",
        title: "Taking the Leap",
        content: "Started the certification while still working full-time. Studied 1 hour every morning before my shift.",
        metric: "Completed 40% of training",
        color: "#f59e0b",
    },
    {
        month: "Month 2",
        title: "First Client",
        content: "Posted about my journey on social media. A coworker's friend reached out asking for help with her fatigue issues.",
        metric: "1 client • $500 package",
        color: "#f59e0b",
    },
    {
        month: "Month 3",
        title: "Building Confidence",
        content: "Finished certification. Started offering free discovery calls. 3 more clients signed up through referrals.",
        metric: "4 clients • $2,000/month",
        color: "#22c55e",
    },
    {
        month: "Month 4",
        title: "Going Part-Time",
        content: "Cut nursing shifts to 3 days/week. Used the extra time to create a simple website and post content.",
        metric: "7 clients • $4,500/month",
        color: "#22c55e",
    },
    {
        month: "Month 5",
        title: "The Tipping Point",
        content: "Word of mouth exploded. Started a waitlist. Raised my prices for the first time.",
        metric: "10 clients • $6,800/month",
        color: "#22c55e",
    },
    {
        month: "Month 6",
        title: "Full-Time Coach",
        content: "Handed in my notice. Now work 20 hours/week from home. Present for my kids every single day.",
        metric: "12 clients • $8,200/month",
        color: "#8b5cf6",
    },
];

const testimonialQuotes = [
    {
        text: "The scariest part was believing it was possible. Once I took that first step, everything changed.",
        context: "On getting started",
    },
    {
        text: "I used to think coaching was 'fluffy.' Now I see it's the most impactful work I've ever done in healthcare.",
        context: "On the work",
    },
    {
        text: "My nursing experience wasn't a liability - it was my superpower. Clients trust me because I understand the body.",
        context: "On leveraging experience",
    },
];

export default function CaseStudyPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl p-3" style={{ background: GOLD_GRADIENT }}>
                            <BookOpen className="w-8 h-8" style={{ color: "#4e1f24" }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Lisa's Journey</h1>
                            <p className="text-white/60">From burnt-out nurse to thriving coach</p>
                        </div>
                    </div>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">$98K</p>
                        <p className="text-xs text-white/50">First Year Revenue</p>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">6 Months</p>
                        <p className="text-xs text-white/50">To Replace Income</p>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">20 hrs</p>
                        <p className="text-xs text-white/50">Work Week</p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                        The Journey
                    </h2>
                    <div className="space-y-4">
                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-4 rounded-xl"
                                style={{ background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${item.color}` }}
                            >
                                <div className="flex-shrink-0 w-20">
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: `${item.color}20`, color: item.color }}>
                                        {item.month}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-white/70 mb-2">{item.content}</p>
                                    <p className="text-xs text-amber-400 font-medium">{item.metric}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quotes */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Quote className="w-5 h-5 text-amber-400" />
                        In Lisa's Words
                    </h2>
                    <div className="space-y-4">
                        {testimonialQuotes.map((quote, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl"
                                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
                            >
                                <p className="text-white/90 italic mb-2">"{quote.text}"</p>
                                <p className="text-xs text-amber-400">{quote.context}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Takeaways */}
                <div className="p-6 rounded-xl mb-8" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        What Made Lisa Successful
                    </h2>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                            <span className="text-green-400">✓</span>
                            Started before she felt "ready" - imperfect action beats perfect planning
                        </li>
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                            <span className="text-green-400">✓</span>
                            Leveraged her existing network - first clients came from referrals
                        </li>
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                            <span className="text-green-400">✓</span>
                            Raised prices confidently once she saw results
                        </li>
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                            <span className="text-green-400">✓</span>
                            Invested in proper training - credibility matters
                        </li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="p-6 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Write Your Own Story?</h3>
                    <p className="text-white/60 mb-4">Lisa was exactly where you are 6 months ago</p>
                    <Link
                        href="#"
                        className="inline-block px-6 py-3 rounded-xl font-bold"
                        style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}
                    >
                        Start Your Journey
                    </Link>
                </div>
            </div>
        </div>
    );
}
