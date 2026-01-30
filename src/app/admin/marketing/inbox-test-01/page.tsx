"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Eye, Inbox, Tag, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// PROVEN INBOX WINNERS
const PROVEN_EMAILS = [
    {
        id: "story_day1",
        name: "Day 1",
        day: 1,
        subject: "Re: quick question about your journey",
        preheader: "I was thinking about you",
        content: `{{firstName}}, Can I tell you a little bit of my story? A few years ago, I was a single mom trying to keep everything together. <strong>Inside, I felt like a fraud.</strong> That's when I found integrative and functional medicine. <strong>It gave me back my hope.</strong> With love, Sarah`,
    },
    {
        id: "story_day3",
        name: "Day 3",
        day: 3,
        subject: "Re: Linda's story (you'll relate)",
        preheader: "She was 52 and exhausted",
        content: `{{firstName}}, I need to tell you about Linda. <strong>52 years old. Exhausted for three years straight.</strong> "Sarah, I forgot what having energy felt like. But she's back." Trust that feeling. Sarah`,
    },
    {
        id: "story_day5",
        name: "Day 5",
        day: 5,
        subject: "Re: she started crying in my office",
        preheader: "Marie was 52 and had given up hope",
        content: `{{firstName}}, <strong>When I shared my findings with her, she started crying.</strong> "No one has ever explained it like this before." Six weeks later: <strong>"I have energy again."</strong> Sarah`,
    },
    {
        id: "story_day10",
        name: "Day 10",
        day: 10,
        subject: "Re: I spent $27k learning this",
        preheader: "So you don't have to",
        content: `{{firstName}}, <strong>Here's the truth:</strong> When I was learning functional medicine, I spent over $27,000 on different programs. <strong>So I built it.</strong> One comprehensive certification. With love, Sarah`,
    },
    {
        id: "proof_day12",
        name: "Day 12",
        day: 12,
        subject: "Re: Diane was 62 and skeptical",
        preheader: "35 years as a nurse, then this happened",
        content: `{{firstName}}, Diane was 62 when she found us. <strong>Fast forward 8 months:</strong> She charges $350/session and has a 3-month waitlist. Sarah`,
    },
    {
        id: "proof_day15",
        name: "Day 15",
        day: 15,
        subject: "Re: Maria was working 60 hours",
        preheader: "Single mom, two kids, now $12k/month",
        content: `{{firstName}}, Maria was a single mom, <strong>working 60+ hours a week</strong>. <strong>Within 6 months, she replaced her income working HALF the hours.</strong> Sarah`,
    },
];

// DAY 7 - WINNER: "Re: my daughter said 4 words"
const DAY7_VARIANTS = [
    {
        id: "day7_a",
        name: "Day 7 - A (WINNER)",
        day: 7,
        subject: "Re: my daughter said 4 words",
        preheader: "And everything changed",
        content: `{{firstName}}, My daughter looked up at me and said: <strong>"Mommy, you smile more now."</strong> Four words. That was it. What will your moment look like? Sarah`,
    },
    {
        id: "day7_b",
        name: "Day 7 - B",
        day: 7,
        subject: "Re: something my daughter noticed",
        preheader: "She was only 6 years old",
        content: `{{firstName}}, My daughter looked up at me and said: <strong>"Mommy, you smile more now."</strong> Four words. That was it. Sarah`,
    },
    {
        id: "day7_c",
        name: "Day 7 - C",
        day: 7,
        subject: "Re: checking in (personal note)",
        preheader: "Something happened I need to tell you",
        content: `{{firstName}}, My daughter looked up at me and said: <strong>"Mommy, you smile more now."</strong> Four words. What will your moment look like? Sarah`,
    },
];

// DAY 18 - NEW VARIANTS (no dollar signs!)
const DAY18_VARIANTS = [
    {
        id: "day18_a",
        name: "Day 18 - A",
        day: 18,
        subject: "Re: Vicki was teaching 15 classes", // Like Maria 60 hours
        preheader: "Every week, just to survive",
        content: `{{firstName}}, I need to tell you about Vicki. She was teaching <strong>15+ yoga classes a week</strong> just to make ends meet. "I want to help people more deeply. But I don't have a medical background." <strong>Vicki completed our certification in 4 months.</strong> Now she works with 12 private clients and has more freedom than ever. "I feel like a real practitioner now." Sarah`,
    },
    {
        id: "day18_b",
        name: "Day 18 - B",
        day: 18,
        subject: "Re: Vicki had no medical background", // Like Diane skeptical
        preheader: "That didn't stop her",
        content: `{{firstName}}, I need to tell you about Vicki. <strong>"But I don't have a medical background."</strong> Sound familiar? <strong>Vicki completed our certification in 4 months.</strong> Now she works with 12 private clients. "I feel like a real practitioner now." Sarah`,
    },
    {
        id: "day18_c",
        name: "Day 18 - C",
        day: 18,
        subject: "Re: what Vicki told me", // Simple personal
        preheader: "She almost gave up",
        content: `{{firstName}}, I need to tell you about Vicki. She was teaching 15+ yoga classes a week. "Who am I to work with health issues?" <strong>Vicki completed our certification in 4 months.</strong> Now 12 private clients. "I feel like a real practitioner now." Sarah`,
    },
];

export default function InboxTestPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});
    const [previewEmail, setPreviewEmail] = useState<any>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["day18"]));

    const sendEmail = async (email: any) => {
        setSending(email.id);
        try {
            const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <div style="display:none;">${email.preheader}</div>
                <p style="line-height:1.6;color:#333;">${email.content.replace(/\{\{firstName\}\}/g, "Friend")}</p>
            </body></html>`;

            await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject: email.subject,
                    content: email.content.replace(/\{\{firstName\}\}/g, "Friend"),
                    html,
                    emailId: email.id,
                }),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const sendAll = async (emails: any[]) => {
        for (const email of emails) {
            await sendEmail(email);
            await new Promise(r => setTimeout(r, 1000));
        }
    };

    const mark = (id: string, result: "inbox" | "promotion") => setResults(prev => ({ ...prev, [id]: result }));
    const toggle = (section: string) => setExpanded(prev => {
        const next = new Set(prev);
        next.has(section) ? next.delete(section) : next.add(section);
        return next;
    });

    const inboxCount = Object.values(results).filter(r => r === "inbox").length;
    const promoCount = Object.values(results).filter(r => r === "promotion").length;

    const Row = ({ email }: { email: any }) => {
        const result = results[email.id];
        return (
            <div className={cn("bg-white rounded-lg p-3 mb-2 border-l-4", result === "inbox" && "border-l-green-500 bg-green-50", result === "promotion" && "border-l-orange-500 bg-orange-50", !result && "border-l-gray-200")}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{email.subject}</div>
                        <div className="text-xs text-gray-400 italic">{email.preheader}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        {result === "inbox" && <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">✅</span>}
                        {result === "promotion" && <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">📦</span>}
                        {!result && (
                            <>
                                <Button size="sm" variant="outline" onClick={() => mark(email.id, "inbox")} className="h-7 px-2 border-green-500 text-green-700"><Inbox className="w-3 h-3" /></Button>
                                <Button size="sm" variant="outline" onClick={() => mark(email.id, "promotion")} className="h-7 px-2 border-orange-500 text-orange-700"><Tag className="w-3 h-3" /></Button>
                            </>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setPreviewEmail(email)} className="h-7 w-7 p-0"><Eye className="w-3 h-3" /></Button>
                        <Button size="sm" onClick={() => sendEmail(email)} disabled={sending === email.id} className="h-7 w-7 p-0">
                            {sending === email.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📧 Inbox A/B Test - Day 18</h1>

            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="mb-3" />
                {(inboxCount > 0 || promoCount > 0) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-100 rounded p-3 text-center"><p className="text-xl font-bold text-green-700">{inboxCount}</p><p className="text-xs">Inbox ✅</p></div>
                        <div className="bg-orange-100 rounded p-3 text-center"><p className="text-xl font-bold text-orange-700">{promoCount}</p><p className="text-xs">Promo 📦</p></div>
                    </div>
                )}
            </div>

            {/* DAY 18 VARIANTS */}
            <div className="mb-4">
                <button onClick={() => toggle("day18")} className="w-full flex items-center justify-between bg-blue-100 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2">
                        {expanded.has("day18") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-bold text-blue-800">🧪 Day 18 - 3 NEW Variants (no $$ signs)</span>
                    </div>
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); sendAll(DAY18_VARIANTS); }} className="bg-blue-600 text-xs">
                        <Send className="w-3 h-3 mr-1" /> Send All 3
                    </Button>
                </button>
                {expanded.has("day18") && DAY18_VARIANTS.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* DAY 7 WINNERS */}
            <div className="mb-4">
                <button onClick={() => toggle("day7")} className="w-full flex items-center gap-2 bg-green-100 rounded-lg p-3 mb-2">
                    {expanded.has("day7") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="font-bold text-green-800">✅ Day 7 Winners (all inbox)</span>
                </button>
                {expanded.has("day7") && DAY7_VARIANTS.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* PROVEN */}
            <div>
                <button onClick={() => toggle("proven")} className="w-full flex items-center gap-2 bg-gray-100 rounded-lg p-3 mb-2">
                    {expanded.has("proven") ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="font-bold text-gray-700">📋 Proven Winners (6/6)</span>
                </button>
                {expanded.has("proven") && PROVEN_EMAILS.map(e => <Row key={e.id} email={e} />)}
            </div>

            <Dialog open={!!previewEmail} onOpenChange={() => setPreviewEmail(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{previewEmail?.subject}</DialogTitle>
                    </DialogHeader>
                    <div className="text-xs text-gray-500 italic mb-2">Preheader: {previewEmail?.preheader}</div>
                    <div className="bg-gray-50 rounded p-4 text-sm" dangerouslySetInnerHTML={{ __html: previewEmail?.content?.replace(/\{\{firstName\}\}/g, "Friend") || "" }} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
