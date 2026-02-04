"use client";

import { useState } from "react";
import { FileText, Clock, ChevronDown, ChevronUp, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const sessionPhases = [
    {
        id: "opening",
        title: "Opening & Connection",
        duration: "5 minutes",
        content: [
            {
                type: "script",
                label: "Welcome",
                text: `"Hi [Name]! It's so good to see you. How are you feeling today?"

[Wait for response, acknowledge genuinely]

"Before we dive in, I want to check in... any wins or challenges since our last session that you'd like to share?"`,
            },
            {
                type: "tip",
                text: "Make eye contact, smile warmly. Your energy sets the tone for the entire session.",
            },
        ],
    },
    {
        id: "review",
        title: "Progress Review",
        duration: "10 minutes",
        content: [
            {
                type: "script",
                label: "Check-in Questions",
                text: `"Let's look at what we worked on last time. How did [specific action item] go?"

"On a scale of 1-10, how would you rate your [energy/sleep/digestion] this week?"

"What worked well? What felt challenging?"`,
            },
            {
                type: "tip",
                text: "Take notes on specific numbers. Tracking progress over time builds trust and shows results.",
            },
        ],
    },
    {
        id: "exploration",
        title: "Deep Exploration",
        duration: "20 minutes",
        content: [
            {
                type: "script",
                label: "Probing Questions",
                text: `"Tell me more about [issue they mentioned]..."

"When you experience [symptom], what else is happening in your life?"

"I'm curious - what do you think your body is trying to tell you?"

"If we could solve just ONE thing today, what would make the biggest difference for you?"`,
            },
            {
                type: "tip",
                text: "Listen 80%, talk 20%. Your job is to guide discovery, not lecture. Silence is powerful.",
            },
        ],
    },
    {
        id: "teaching",
        title: "Education & Insight",
        duration: "10 minutes",
        content: [
            {
                type: "script",
                label: "Educational Framework",
                text: `"Based on what you're sharing, here's what I'm seeing..."

"There's a connection between [root cause] and [symptom] that most people don't realize..."

"The science shows that when we [intervention], we can expect [outcome]. Does that make sense?"`,
            },
            {
                type: "tip",
                text: "Keep it simple. One key insight is better than overwhelming with information.",
            },
        ],
    },
    {
        id: "action",
        title: "Action Planning",
        duration: "10 minutes",
        content: [
            {
                type: "script",
                label: "Commitment Questions",
                text: `"What's ONE thing you're willing to commit to this week?"

"On a scale of 1-10, how confident are you that you can do this? What would make it a 10?"

"What might get in the way? How will you handle that?"

"I'm going to send you [resource]. Can you commit to [specific action] before our next call?"`,
            },
            {
                type: "tip",
                text: "Small, specific commitments beat vague big ones every time.",
            },
        ],
    },
    {
        id: "closing",
        title: "Powerful Close",
        duration: "5 minutes",
        content: [
            {
                type: "script",
                label: "Closing Script",
                text: `"Before we wrap up, what's your biggest takeaway from today?"

"You've made incredible progress. I'm really proud of how you [specific thing they did well]."

"Same time next week? I'm excited to hear how [action item] goes."

"Remember - you've got this. Reach out if you need anything before then. 💛"`,
            },
            {
                type: "tip",
                text: "End on a high note. Reinforce their capability and your belief in them.",
            },
        ],
    },
];

export default function SessionScriptPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [expandedPhases, setExpandedPhases] = useState<string[]>(["opening"]);

    const togglePhase = (phaseId: string) => {
        setExpandedPhases(prev =>
            prev.includes(phaseId)
                ? prev.filter(id => id !== phaseId)
                : [...prev, phaseId]
        );
    };

    const expandAll = () => setExpandedPhases(sessionPhases.map(p => p.id));
    const collapseAll = () => setExpandedPhases([]);

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl p-3" style={{ background: GOLD_GRADIENT }}>
                            <FileText className="w-8 h-8" style={{ color: "#4e1f24" }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Sample Session Script</h1>
                            <p className="text-white/60">60-minute coaching session framework</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span className="text-white/80 text-sm">Total: 60 minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-white/80 text-sm">6 phases</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={expandAll} className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/70 hover:bg-white/20">
                                Expand All
                            </button>
                            <button onClick={collapseAll} className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/70 hover:bg-white/20">
                                Collapse All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Session Flow */}
                <div className="space-y-3">
                    {sessionPhases.map((phase, index) => (
                        <div
                            key={phase.id}
                            className="rounded-xl overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <button
                                onClick={() => togglePhase(phase.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}>
                                        {index + 1}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-white">{phase.title}</h3>
                                        <p className="text-sm text-amber-400/80">{phase.duration}</p>
                                    </div>
                                </div>
                                {expandedPhases.includes(phase.id) ? (
                                    <ChevronUp className="w-5 h-5 text-white/40" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-white/40" />
                                )}
                            </button>

                            {expandedPhases.includes(phase.id) && (
                                <div className="px-4 pb-4 space-y-3">
                                    {phase.content.map((item, i) => (
                                        <div key={i}>
                                            {item.type === "script" && (
                                                <div className="rounded-lg bg-black/30 p-4">
                                                    <p className="text-xs text-amber-400 font-semibold mb-2 uppercase">{item.label}</p>
                                                    <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">{item.text}</pre>
                                                </div>
                                            )}
                                            {item.type === "tip" && (
                                                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-amber-200/80 text-sm">{item.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Run Sessions Like This?</h3>
                    <p className="text-white/60 mb-4">Get certified and learn the full framework</p>
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
