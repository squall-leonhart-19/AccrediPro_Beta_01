"use client";

import { useState } from "react";
import { Loader2, Mail, Inbox, Tag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Testing the CHRISTMAS EMAIL FORMAT with different money amounts
// The Christmas email with $997 landed in inbox - let's replicate the format
const FORMAT_TESTS = [
    {
        id: "christmas_clone_997",
        label: "Christmas format - $997 (original)",
        subject: "Re: thinking about what you said",
        content: `Friend,

I keep thinking about something.

<strong>The women who take this leap always tell me the same thing.</strong>

Not "I wish I had more information."
Not "I wish I had more time to decide."

They say: <strong>"I wish I had done this sooner."</strong>

Every. Single. One.

Because the cost of waiting isn't just money. It's time. It's another year of wondering "what if." It's watching other people build the life you want while you stay stuck.

<strong>What You're Deciding</strong>

- Investment: <strong>$997</strong>
- Return: First 2-3 clients pay for entire program
- Includes: Full certification, lifetime access, community
- Guarantee: <strong>30 days, full refund if not right for you</strong>

Zero risk. Maximum upside.

<strong>One Question To Ask Yourself</strong>

What will next month feel like if you don't do this?

Will you be excited about the path ahead? Or will you be making the same "next year" promises you made last year?

I hope you choose yourself.

Sarah

P.S. The perfect moment doesn't exist. This moment is good enough.`,
    },
    {
        id: "christmas_clone_297",
        label: "Christmas format - $297 (Pro Accelerator)",
        subject: "Re: thinking about what you said",
        content: `Friend,

I keep thinking about something.

<strong>The students who accelerate always tell me the same thing.</strong>

Not "I wish I had more information."
Not "I wish I had more time to decide."

They say: <strong>"I wish I had done this sooner."</strong>

Every. Single. One.

Because the cost of waiting isn't just money. It's time. It's another month of figuring things out alone. It's watching others build momentum while you stay stuck.

<strong>What Pro Accelerator Gives You</strong>

- Investment: <strong>$297</strong>
- Return: Skip months of trial and error
- Includes: Advanced protocols, business framework, live Q&A
- Guarantee: <strong>30 days, full refund if not right for you</strong>

Zero risk. Maximum upside.

<strong>One Question To Ask Yourself</strong>

What will next month feel like if you keep going alone?

Will you be making progress? Or still figuring out the basics?

I hope you choose yourself.

Sarah

P.S. The perfect moment doesn't exist. This moment is good enough.`,
    },
    {
        id: "christmas_clone_397",
        label: "Christmas format - $397 (DFY)",
        subject: "Re: thinking about what you said",
        content: `Friend,

I keep thinking about something.

<strong>The practitioners who let us build their business always tell me the same thing.</strong>

Not "I wish I had more information."
Not "I wish I had more time to decide."

They say: <strong>"I wish I had done this sooner."</strong>

Every. Single. One.

Because the cost of waiting isn't just money. It's 6 months of tech headaches. It's another season of getting ready instead of getting clients.

<strong>What The DFY Business Kit Gives You</strong>

- Investment: <strong>$397</strong>
- Return: Your business, built and ready
- Includes: Website, client system, branding, launch strategy
- Guarantee: <strong>30 days, full refund if not right for you</strong>

Zero risk. Maximum upside.

<strong>One Question To Ask Yourself</strong>

What will next month feel like if you're still setting up tech?

Will you be seeing clients? Or still "getting ready"?

I hope you choose yourself.

Sarah

P.S. The perfect moment doesn't exist. This moment is good enough.`,
    },
    {
        id: "emotional_story_500",
        label: "Emotional story with $500/session",
        subject: "Re: Maria's message to me",
        content: `Friend,

Maria sent me a message yesterday that made me tear up.

<strong>"Sarah, I just booked my first $500 session."</strong>

Three months ago, she was terrified to charge $50.

She kept saying she wasn't ready. That she needed more training. That no one would pay her.

<strong>I hear this all the time.</strong>

The fear. The doubt. The voice that says "who are you to help people?"

But here's what I've learned after working with hundreds of women just like you:

<strong>The ones who succeed aren't the ones who wait until they're ready.</strong>

They're the ones who start before they feel qualified.

Maria didn't have special skills. She had the same training you have access to right now.

The difference? She decided to trust herself.

<strong>What are you waiting for?</strong>

Sarah

P.S. Maria was a single mom with two kids. If she could find time, you can too.`,
    },
    {
        id: "emotional_no_money",
        label: "Emotional story - NO money mentioned",
        subject: "Re: Maria's message to me",
        content: `Friend,

Maria sent me a message yesterday that made me tear up.

<strong>"Sarah, I just had a client tell me I changed her life."</strong>

Three months ago, Maria was terrified. She kept saying she wasn't ready. That she needed more training. That no one would listen to her.

<strong>I hear this all the time.</strong>

The fear. The doubt. The voice that says "who are you to help people?"

But here's what I've learned after working with hundreds of women just like you:

<strong>The ones who succeed aren't the ones who wait until they're ready.</strong>

They're the ones who start before they feel qualified.

Maria didn't have special skills. She had the same training you have access to right now.

The difference? She decided to trust herself.

<strong>What are you waiting for?</strong>

Sarah

P.S. Maria was a single mom with two kids. If she could find time, you can too.`,
    },
];

export default function FormatTestPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});

    const sendTest = async (test: (typeof FORMAT_TESTS)[0]) => {
        setSending(test.id);
        try {
            // Use the EXACT same HTML format as successful Christmas emails
            const formattedContent = test.content
                .split('\n\n')
                .map(p => `<p style="margin: 0 0 14px 0;">${p.replace(/\n/g, '<br>')}</p>`)
                .join('');

            const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#222;">
${formattedContent}
</body>
</html>`;

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
        for (const test of FORMAT_TESTS) {
            await sendTest(test);
            await new Promise(r => setTimeout(r, 500));
        }
    };

    const mark = (id: string, result: "inbox" | "promotion") => setResults(prev => ({ ...prev, [id]: result }));

    const inboxCount = Object.values(results).filter(r => r === "inbox").length;
    const promoCount = Object.values(results).filter(r => r === "promotion").length;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">🎄 Christmas Format Clones</h1>
            <p className="text-gray-500 mb-4">Testing the winning Christmas email format with different prices</p>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="mb-3" />
                <Button onClick={sendAll} className="w-full bg-green-600 hover:bg-green-700 mb-3">
                    <Send className="w-4 h-4 mr-2" /> Send All 5 Format Tests
                </Button>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 rounded p-3 text-center"><p className="text-xl font-bold text-green-700">{inboxCount}</p><p className="text-xs">Inbox ✅</p></div>
                    <div className="bg-orange-100 rounded p-3 text-center"><p className="text-xl font-bold text-orange-700">{promoCount}</p><p className="text-xs">Promo 📦</p></div>
                </div>
            </div>

            {FORMAT_TESTS.map(test => {
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
                        <div className="text-xs text-gray-500 mb-2">Subject: {test.subject}</div>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-2 max-h-40 overflow-y-auto">{test.content}</pre>
                    </div>
                );
            })}
        </div>
    );
}
