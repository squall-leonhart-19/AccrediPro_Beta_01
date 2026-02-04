"use client";

import { useState } from "react";
import { Users, Mail, MessageCircle, Phone, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const templates = [
    {
        id: "cold-dm",
        title: "Cold DM Script",
        category: "Instagram/LinkedIn",
        icon: MessageCircle,
        template: `Hey {name}! 👋

I noticed you're into [their interest/niche] and wanted to reach out.

I help [target audience] overcome [specific problem] through functional medicine coaching.

I just published a free guide on [relevant topic] - would you like me to send it over?

No pressure either way! 💛`,
    },
    {
        id: "warm-email",
        title: "Warm Lead Email",
        category: "Email",
        icon: Mail,
        template: `Subject: Quick question about [their situation]

Hi {name},

I came across your [post/comment/profile] about [topic] and it really resonated with me.

I work with [target audience] who struggle with [specific problem]. Many of my clients come to me feeling [emotion] about [situation].

Would you be open to a 15-minute call to see if I might be able to help?

Either way, here's a free resource I think you'd find valuable: [link]

Warmly,
[Your name]`,
    },
    {
        id: "discovery-call",
        title: "Discovery Call Outline",
        category: "Phone/Zoom",
        icon: Phone,
        template: `DISCOVERY CALL FRAMEWORK (15-20 min)

1. RAPPORT (2 min)
"Thanks for taking the time! Before we dive in, tell me a bit about yourself..."

2. CURRENT SITUATION (5 min)
"What's going on with your [health/energy/etc] right now?"
"How long has this been happening?"
"What have you tried so far?"

3. DESIRED OUTCOME (3 min)
"If we could wave a magic wand, what would your ideal outcome look like?"
"How would that change your life?"

4. GAP & COST (3 min)
"What do you think is holding you back?"
"What will it cost you if nothing changes?"

5. OFFER (5 min)
"Based on what you've shared, I think I can help. Here's how my program works..."
[Present your offer]

6. CLOSE
"What questions do you have?"
"Are you ready to get started?"`,
    },
    {
        id: "follow-up",
        title: "Follow-Up Sequence",
        category: "Email",
        icon: Mail,
        template: `DAY 1 (Post-call):
"Great chatting today! As promised, here's [resource]. Let me know if you have any questions about getting started."

DAY 3:
"Hey {name}! Just checking in. Any thoughts on what we discussed? Happy to answer any questions."

DAY 7:
"Hi {name}, I know life gets busy! Just wanted to let you know I'm holding a spot for you. Ready when you are 💛"

DAY 14:
"Final check-in! I'm opening spots to my waitlist next week. If you want to lock in your current rate, now's the time. No pressure either way - I'm here when you're ready."`,
    },
];

export default function ClientBlueprintPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>("cold-dm");

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
                            <Users className="w-8 h-8" style={{ color: "#4e1f24" }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Client Attraction Blueprint</h1>
                            <p className="text-white/60">Copy-paste templates to land your first clients</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-amber-200/90 text-sm">
                                <strong>Pro tip:</strong> Personalize each template with specific details about the person you're reaching out to. Generic messages get ignored - specific ones get responses.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Templates */}
                <div className="space-y-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="rounded-xl overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <button
                                onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg p-2 bg-white/10">
                                        <template.icon className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-white">{template.title}</h3>
                                        <p className="text-sm text-white/50">{template.category}</p>
                                    </div>
                                </div>
                                <ArrowRight className={`w-5 h-5 text-white/40 transition-transform ${expandedId === template.id ? "rotate-90" : ""}`} />
                            </button>

                            {expandedId === template.id && (
                                <div className="px-4 pb-4">
                                    <div className="relative">
                                        <pre className="p-4 rounded-lg bg-black/30 text-white/80 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                                            {template.template}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(template.template, template.id)}
                                            className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                            {copiedId === template.id ? (
                                                <Check className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-white/60" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Put These Into Action?</h3>
                    <p className="text-white/60 mb-4">Get certified and start attracting your ideal clients</p>
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
