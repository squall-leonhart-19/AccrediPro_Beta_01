"use client";

import { useState } from "react";
import { Loader2, Mail, Inbox, Tag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// PROBLEMATIC SUBJECTS from screenshot - need 3 variants each
const TESTS = [
    {
        id: "paths",
        original: "Re: 3 paths I've seen work",
        variants: [
            "Re: which path fits your life?",
            "Re: quick question about your goals",
            "Re: thinking about what you said",
        ],
    },
    {
        id: "maria_397",
        original: "Re: what Maria got for $397",
        variants: [
            "Re: Maria's story (you'll relate)",
            "Re: what changed for Maria",
            "Re: Maria asked me to share this",
        ],
    },
    {
        id: "500hr",
        original: "Re: looking like a $500/hr practitioner",
        variants: [
            "Re: how they spot a professional",
            "Re: first impressions matter",
            "Re: the credibility shortcut",
        ],
    },
    {
        id: "system",
        original: "Re: the system that runs while you sleep",
        variants: [
            "Re: what if clients booked themselves?",
            "Re: the setup I wish I had earlier",
            "Re: something I learned the hard way",
        ],
    },
    {
        id: "storefront",
        original: "Re: your storefront (without building it)",
        variants: [
            "Re: the online presence question",
            "Re: where clients find you",
            "Re: quick thought about visibility",
        ],
    },
    {
        id: "holding_back",
        original: "Re: the thing holding most practitioners back",
        variants: [
            "Re: what I wish someone told me",
            "Re: this might resonate with you",
            "Re: the common trap",
        ],
    },
    {
        id: "pro_accelerator",
        original: "Re: Pro Accelerator (for serious students)",
        variants: [
            "Re: for those who want to move faster",
            "Re: something for serious students",
            "Re: the next step when you're ready",
        ],
    },
    {
        id: "top_10",
        original: "Re: what the top 10% do differently",
        variants: [
            "Re: the pattern I keep seeing",
            "Re: what separates those who succeed",
            "Re: a pattern worth knowing",
        ],
    },
    {
        id: "mistake",
        original: "Re: the mistake I see most",
        variants: [
            "Re: something I keep noticing",
            "Re: a common misstep",
            "Re: thought you should know this",
        ],
    },
];

export default function SubjectTestPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});

    const sendTest = async (subject: string, id: string) => {
        setSending(id);
        try {
            await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject,
                    content: `This is a test email to check if the subject line lands in Primary inbox.\n\nSubject tested: ${subject}\n\nSarah`,
                    html: `<p>This is a test email to check if the subject line lands in Primary inbox.</p><p>Subject tested: ${subject}</p><p>Sarah</p>`,
                    emailId: id,
                }),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const mark = (id: string, result: "inbox" | "promotion") => setResults(prev => ({ ...prev, [id]: result }));

    const sendAllVariants = async () => {
        for (const test of TESTS) {
            for (let i = 0; i < test.variants.length; i++) {
                const id = `${test.id}_v${i + 1}`;
                await sendTest(test.variants[i], id);
                await new Promise(r => setTimeout(r, 500));
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">🧪 Subject Line A/B Test</h1>
            <p className="text-gray-500 mb-4">Testing variants for subjects that landed in Promotions</p>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="mb-3" />
                <Button onClick={sendAllVariants} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4 mr-2" /> Send All {TESTS.length * 3} Variants
                </Button>
            </div>

            {TESTS.map(test => (
                <div key={test.id} className="mb-6 bg-white rounded-lg shadow p-4">
                    <div className="mb-3 pb-3 border-b">
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">❌ PROMO</span>
                        <span className="ml-2 font-mono text-sm text-red-600">{test.original}</span>
                    </div>

                    {test.variants.map((variant, i) => {
                        const id = `${test.id}_v${i + 1}`;
                        const result = results[id];
                        return (
                            <div key={id} className={cn(
                                "flex items-center justify-between p-2 rounded mb-2",
                                result === "inbox" && "bg-green-50 border border-green-200",
                                result === "promotion" && "bg-orange-50 border border-orange-200",
                                !result && "bg-gray-50"
                            )}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">V{i + 1}</span>
                                    <span className="font-mono text-sm">{variant}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {result === "inbox" && <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">✅</span>}
                                    {result === "promotion" && <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">📦</span>}
                                    {!result && (
                                        <>
                                            <Button size="sm" variant="outline" onClick={() => mark(id, "inbox")} className="h-6 px-2 border-green-500 text-green-700"><Inbox className="w-3 h-3" /></Button>
                                            <Button size="sm" variant="outline" onClick={() => mark(id, "promotion")} className="h-6 px-2 border-orange-500 text-orange-700"><Tag className="w-3 h-3" /></Button>
                                        </>
                                    )}
                                    <Button size="sm" onClick={() => sendTest(variant, id)} disabled={sending === id} className="h-6 w-6 p-0">
                                        {sending === id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
