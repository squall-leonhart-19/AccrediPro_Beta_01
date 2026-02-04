"use client";

import { useState } from "react";
import { Receipt, DollarSign, Clock, Users, Sparkles, Copy, Check } from "lucide-react";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const pricingScripts = [
    {
        id: "confidence",
        title: "Price Confidence Script",
        context: "When stating your price",
        script: `"My [Package Name] is $[PRICE].

That includes [brief list of what's included].

Most of my clients see [specific result] within [timeframe].

Would you like me to walk you through how it works?"

[PAUSE - Let them respond. Don't fill the silence.]`,
    },
    {
        id: "objection-expensive",
        title: "Handling 'Too Expensive'",
        context: "When they say it costs too much",
        script: `"I totally understand - it's a real investment.

Can I ask you something? What's it costing you right now NOT to solve this?

[Let them answer]

If you could solve [their problem] and get [desired outcome], what would that be worth to you over the next year?

My clients tell me they wish they'd invested sooner."`,
    },
    {
        id: "objection-think",
        title: "Handling 'I Need to Think'",
        context: "When they want to think about it",
        script: `"Of course! That's a big decision.

What specifically do you want to think about? Is it the investment, the timing, or something else?

[Let them answer - address the real objection]

Would it help if I sent you [resource/testimonial] to look at while you decide?

Just know that my next intake is [date] - so if you want to start then, let me know by [deadline]."`,
    },
    {
        id: "objection-partner",
        title: "Handling 'Ask My Partner'",
        context: "When they need to consult someone",
        script: `"Absolutely - that's important!

What do you think they'll want to know?

[Help them prepare the conversation]

Would it help if I sent you a summary you can share with them? I can include [results/testimonials] that might answer their questions.

When do you think you'll have a chance to talk? I'll follow up after that."`,
    },
];

export default function PricingWorksheetPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Interactive pricing calculator
    const [hourlyTarget, setHourlyTarget] = useState(150);
    const [sessionLength, setSessionLength] = useState(60);
    const [sessionsPerPackage, setSessionsPerPackage] = useState(6);

    const packagePrice = Math.round((hourlyTarget * sessionLength / 60) * sessionsPerPackage);
    const perSessionPrice = Math.round(packagePrice / sessionsPerPackage);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl p-3" style={{ background: GOLD_GRADIENT }}>
                            <Receipt className="w-8 h-8" style={{ color: "#4e1f24" }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Pricing Your Services</h1>
                            <p className="text-white/60">Premium pricing strategies & objection scripts</p>
                        </div>
                    </div>
                </div>

                {/* Interactive Price Builder */}
                <div className="p-6 rounded-xl mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                        Package Price Builder
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="text-white/60 text-sm mb-2 block">Target Hourly Rate</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                                <input
                                    type="number"
                                    value={hourlyTarget}
                                    onChange={(e) => setHourlyTarget(Number(e.target.value))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-8 py-3 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-white/60 text-sm mb-2 block">Session Length (min)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <input
                                    type="number"
                                    value={sessionLength}
                                    onChange={(e) => setSessionLength(Number(e.target.value))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-10 py-3 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-white/60 text-sm mb-2 block">Sessions per Package</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <input
                                    type="number"
                                    value={sessionsPerPackage}
                                    onChange={(e) => setSessionsPerPackage(Number(e.target.value))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-10 py-3 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg text-center" style={{ background: GOLD_GRADIENT }}>
                            <p className="text-sm font-medium mb-1" style={{ color: "#4e1f24" }}>Package Price</p>
                            <p className="text-3xl font-bold" style={{ color: "#4e1f24" }}>${packagePrice.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-lg text-center bg-white/10">
                            <p className="text-sm text-white/60 mb-1">Per Session</p>
                            <p className="text-3xl font-bold text-white">${perSessionPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Pricing Tip */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 mb-8">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-200/90 text-sm">
                            <strong>Pro tip:</strong> Never quote an hourly rate. Always package your services. "$150/hour" sounds like an expense. "$1,800 for 6 sessions" sounds like an investment.
                        </p>
                    </div>
                </div>

                {/* Objection Scripts */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">Objection Handling Scripts</h2>
                    <div className="space-y-4">
                        {pricingScripts.map((script) => (
                            <div
                                key={script.id}
                                className="rounded-xl p-4"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-white">{script.title}</h3>
                                        <p className="text-xs text-amber-400">{script.context}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(script.script, script.id)}
                                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        {copiedId === script.id ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-white/60" />
                                        )}
                                    </button>
                                </div>
                                <pre className="p-3 rounded-lg bg-black/30 text-white/80 text-sm whitespace-pre-wrap font-sans">
                                    {script.script}
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Charge What You're Worth?</h3>
                    <p className="text-white/60 mb-4">Get certified and start building your premium practice</p>
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
