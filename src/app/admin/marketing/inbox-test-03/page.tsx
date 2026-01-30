"use client";

import { useState } from "react";
import { Loader2, Mail, Inbox, Tag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 10 VARIANTS for showing money - testing what lands in Primary
const MONEY_TESTS = [
    {
        id: "v1_dollar_sign",
        label: "$500/hr (standard)",
        subject: "Re: quick tip for you",
        content: `Friend,

Quick thing I noticed about premium clients.

They don't care about price. They care about results.

Maria charges $500/hr now. When she started? She was terrified to ask for $50.

What changed wasn't her skills. It was her confidence.

Sarah`,
    },
    {
        id: "v2_spelled_out",
        label: "five hundred per hour (spelled)",
        subject: "Re: quick tip for you",
        content: `Friend,

Quick thing I noticed about premium clients.

They don't care about price. They care about results.

Maria charges five hundred per hour now. When she started? She was terrified to ask for fifty.

What changed wasn't her skills. It was her confidence.

Sarah`,
    },
    {
        id: "v3_k_notation",
        label: "5k/month (k notation)",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria hit 5k months working part time.

Not because she's special. Because she stopped waiting to feel ready.

She started before she felt "qualified."

Same training you have access to right now.

Sarah`,
    },
    {
        id: "v4_per_session",
        label: "$350/session",
        subject: "Re: quick tip for you",
        content: `Friend,

Diane charges $350 per session.

She's 62. Started with zero experience in this field.

Her clients? They come back month after month.

Because results speak louder than credentials.

Sarah`,
    },
    {
        id: "v5_12k_month",
        label: "$12k/month",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria makes $12k/month now.

Single mom. Two kids. Works 25 hours a week.

How? She stopped trading time for money.

She built systems that work while she's with her kids.

Sarah`,
    },
    {
        id: "v6_income_vague",
        label: "replaced her income (no number)",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria replaced her full-time income.

Working half the hours.

As a single mom with two kids.

She didn't have special skills. She had a system.

Same system you have access to.

Sarah`,
    },
    {
        id: "v7_thousands",
        label: "thousands per month",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria makes thousands per month now.

Single mom. Two kids. Works part time.

When she started, she thought she wasn't qualified.

Turns out, she just needed the right roadmap.

Sarah`,
    },
    {
        id: "v8_premium_no_numbers",
        label: "premium clients (no $)",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria works with premium clients now.

The kind who value transformation over "deals."

She used to be terrified to charge what she's worth.

Now? She has a waitlist.

What changed wasn't her training. It was her confidence.

Sarah`,
    },
    {
        id: "v9_six_figures",
        label: "six-figure practice",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria built a six-figure practice.

Working part time. As a single mom.

She didn't start with experience. She started with commitment.

The training gave her the skills. She did the rest.

Sarah`,
    },
    {
        id: "v10_waitlist",
        label: "waitlist + booked solid (no money)",
        subject: "Re: quick tip for you",
        content: `Friend,

Maria has a 3-month waitlist now.

Clients find HER. She doesn't chase them.

When she started, she wondered if anyone would ever pay her.

Now she turns people away.

Same path is open for you.

Sarah`,
    },
];

export default function MoneyTestPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});

    const sendTest = async (test: (typeof MONEY_TESTS)[0]) => {
        setSending(test.id);
        try {
            const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#222;">
                <p style="margin:0 0 14px 0;">${test.content.replace(/\n\n/g, '</p><p style="margin:0 0 14px 0;">').replace(/\n/g, '<br>')}</p>
            </body></html>`;

            await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject: test.subject,
                    content: test.content,
                    html,
                    emailId: test.id,
                }),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const sendAll = async () => {
        for (const test of MONEY_TESTS) {
            await sendTest(test);
            await new Promise(r => setTimeout(r, 500));
        }
    };

    const mark = (id: string, result: "inbox" | "promotion") => setResults(prev => ({ ...prev, [id]: result }));

    const inboxCount = Object.values(results).filter(r => r === "inbox").length;
    const promoCount = Object.values(results).filter(r => r === "promotion").length;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">💰 Money Format Test</h1>
            <p className="text-gray-500 mb-4">Testing 10 ways to mention money - which lands in Primary?</p>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="mb-3" />
                <Button onClick={sendAll} className="w-full bg-green-600 hover:bg-green-700 mb-3">
                    <Send className="w-4 h-4 mr-2" /> Send All 10 Variants
                </Button>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 rounded p-3 text-center"><p className="text-xl font-bold text-green-700">{inboxCount}</p><p className="text-xs">Inbox ✅</p></div>
                    <div className="bg-orange-100 rounded p-3 text-center"><p className="text-xl font-bold text-orange-700">{promoCount}</p><p className="text-xs">Promo 📦</p></div>
                </div>
            </div>

            {MONEY_TESTS.map(test => {
                const result = results[test.id];
                return (
                    <div key={test.id} className={cn(
                        "bg-white rounded-lg shadow p-4 mb-3 border-l-4",
                        result === "inbox" && "border-l-green-500 bg-green-50",
                        result === "promotion" && "border-l-orange-500 bg-orange-50",
                        !result && "border-l-gray-200"
                    )}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">{test.label}</span>
                            <div className="flex items-center gap-1">
                                {result === "inbox" && <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">✅ INBOX</span>}
                                {result === "promotion" && <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">📦 PROMO</span>}
                                {!result && (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => mark(test.id, "inbox")} className="h-6 px-2 border-green-500 text-green-700"><Inbox className="w-3 h-3" /></Button>
                                        <Button size="sm" variant="outline" onClick={() => mark(test.id, "promotion")} className="h-6 px-2 border-orange-500 text-orange-700"><Tag className="w-3 h-3" /></Button>
                                    </>
                                )}
                                <Button size="sm" onClick={() => sendTest(test)} disabled={sending === test.id} className="h-6 w-6 p-0">
                                    {sending === test.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">{test.content}</pre>
                    </div>
                );
            })}
        </div>
    );
}
