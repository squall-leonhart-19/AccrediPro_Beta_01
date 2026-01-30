"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Eye, Inbox, Tag, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Each email has 3 subject variants to test
const EMAIL_VARIANTS = [
    // STORY DAY 1
    {
        id: "story_day1",
        name: "Story Day 1: Kitchen Floor",
        day: 1,
        sequence: "Story",
        variants: [
            { id: "story_day1_a", subject: "Re: quick question about your journey" }, // Proven winner
            { id: "story_day1_b", subject: "just wanted to check in on you" }, // No Re:, personal
            { id: "story_day1_c", subject: "hey" }, // Ultra minimal
        ],
        content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way."

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that — it gave me back my hope.

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

With love,

Sarah`,
    },
    // STORY DAY 3
    {
        id: "story_day3",
        name: "Story Day 3: 3am Discovery",
        day: 3,
        sequence: "Story",
        variants: [
            { id: "story_day3_a", subject: "Re: about last night" }, // Curiosity
            { id: "story_day3_b", subject: "couldn't sleep" }, // Personal, relatable
            { id: "story_day3_c", subject: "3am" }, // Ultra short, mysterious
        ],
        content: `{{firstName}},

I want to tell you about the night everything changed for me.

It was 3am. My daughter was finally asleep after being sick for the third time that month. And I was sitting at the kitchen table, exhausted, scrolling through research papers I barely understood.

I felt so lost.

I'd tried everything the doctors suggested for her. For myself. For my clients. And nothing was really working. Not at the root level.

Then I stumbled onto this article about functional medicine. About looking for the WHY behind symptoms instead of just treating what shows up on the surface.

And I remember thinking: "This is it. This is what's been missing."

That night, I made a promise to myself.

I was going to learn this. Really learn it. Not just surface-level wellness tips, but the deep clinical understanding that actually changes lives.

It took time. It took sacrifice. There were nights I studied instead of slept. Weekends I practiced instead of rested.

But that decision — made at 3am in my pajamas with cold coffee — changed everything.

I'm sharing this because I know you're at your own crossroads right now.

You signed up for a reason. Maybe you haven't even fully admitted that reason to yourself yet. But something inside you knows there's more.

Trust that feeling.

Sarah`,
    },
    // STORY DAY 5
    {
        id: "story_day5",
        name: "Story Day 5: First Breakthrough",
        day: 5,
        sequence: "Story",
        variants: [
            { id: "story_day5_a", subject: "Re: she started crying" }, // Emotion hook
            { id: "story_day5_b", subject: "my first client win" }, // Direct
            { id: "story_day5_c", subject: "thought you'd want to know" }, // Personal
        ],
        content: `{{firstName}},

I'll never forget my first real breakthrough.

I'd been studying functional medicine for about 6 months. Still working my regular job. Still feeling like maybe this was all too much for me.

Then a client came in — let's call her Marie. She was 52, exhausted all the time, doctors had told her "it's just stress" and "you're getting older."

For the first time, I actually knew what to look for.

I asked different questions. I looked at her case through this new lens. And I saw something the doctors had missed.

When I shared my findings with her, she started crying.

"No one has ever explained it like this before," she said. "I thought I was going crazy."

We worked together on a protocol. Simple changes. Nothing extreme.

Six weeks later, she sent me an email: "I have energy again. I forgot what this felt like."

That was the moment I knew. This wasn't just education. This was transformation — for my clients AND for me.

I went from "maybe I can do this" to "I was MADE for this."

And I believe you have that moment waiting for you too.

Sarah`,
    },
    // STORY DAY 7
    {
        id: "story_day7",
        name: "Story Day 7: Daughter Noticed",
        day: 7,
        sequence: "Story",
        variants: [
            { id: "story_day7_a", subject: "mommy you smile more now" }, // Exact quote
            { id: "story_day7_b", subject: "Re: something my daughter said" }, // Re: format
            { id: "story_day7_c", subject: "this made me cry" }, // Emotional
        ],
        content: `{{firstName}},

There's a moment I come back to whenever I doubt myself.

It was about a year after I started practicing functional medicine. My business was growing. My health was better than it had been in a decade. But I was still wondering if I'd made the right choice.

Then one evening, my daughter said something that stopped me in my tracks.

I was making dinner — something I'd actually had energy to do for the first time in months — and she looked up at me and said:

"Mommy, you smile more now."

That was it. That was the moment I knew everything had been worth it.

The late nights studying.
The scary leap from "just a coach" to certified practitioner.
The moments of doubt when I wondered if I could really do this.

All of it led to THIS — being present, being healthy, being the mom I always wanted to be.

I don't know what your "moment" will look like. Maybe it's a client breakthrough. Maybe it's financial freedom. Maybe it's just feeling like YOU again.

But I know it's coming. And I can't wait for you to experience it.

Sarah`,
    },
    // STORY DAY 10
    {
        id: "story_day10",
        name: "Story Day 10: Why I Do This",
        day: 10,
        sequence: "Story",
        variants: [
            { id: "story_day10_a", subject: "Re: why I built this" }, // Re: format
            { id: "story_day10_b", subject: "i spent 27k learning this" }, // Shocking number
            { id: "story_day10_c", subject: "the real reason" }, // Curiosity
        ],
        content: `{{firstName}},

I've told you a lot about my journey. The kitchen floor moment. The 3am discovery. The first breakthrough.

But I haven't told you WHY I created this certification.

Here's the truth:

When I was learning functional medicine, I spent over $27,000 on different programs. Some were too basic. Some were too clinical for practical use. Some were taught by people who had never actually worked with clients.

It took me YEARS to piece together what actually works.

And I kept thinking: "Why isn't there ONE program that teaches everything — the clinical skills AND the business side? Why do we have to figure this out alone?"

So I built it.

I took everything I learned — the wins, the failures, the client breakthroughs, the business strategies — and put it into one comprehensive certification.

Not because I wanted to be an "expert." But because I didn't want anyone else to struggle the way I did.

You're here because something called you to this path.

My job is to make sure you have everything you need to succeed.

With love,

Sarah`,
    },
    // PROOF DAY 12
    {
        id: "proof_day12",
        name: "Proof Day 12: Diane (62, RN)",
        day: 12,
        sequence: "Proof",
        variants: [
            { id: "proof_day12_a", subject: "Re: she was 62 and skeptical" }, // Age + emotion
            { id: "proof_day12_b", subject: "35 years as a nurse then this" }, // Career pivot
            { id: "proof_day12_c", subject: "diane's story" }, // Simple name
        ],
        content: `{{firstName}},

I want to introduce you to Diane.

Diane was 62 when she found us. She'd been an RN for 35 years and was completely burned out. She loved helping people but hated the system.

She was skeptical. VERY skeptical.

"I've seen so many wellness fads come and go," she told me. "How is this different?"

I loved her honesty. I told her: "You have 35 years of clinical experience. This certification will give you the framework to use that experience in a completely new way."

She took the leap.

Fast forward 8 months: Diane now runs a thriving practice helping menopausal women. She charges $350/session and has a 3-month waitlist.

But here's what she told me that really stuck:

"For the first time in 35 years, I feel like I'm actually HELPING people — not just managing symptoms. And I'm home for dinner every night."

If Diane can do this at 62, after 35 years in a broken system...

What's possible for YOU?

Sarah`,
    },
    // PROOF DAY 15
    {
        id: "proof_day15",
        name: "Proof Day 15: Maria (Single Mom)",
        day: 15,
        sequence: "Proof",
        variants: [
            { id: "proof_day15_a", subject: "Re: single mom working 60 hours" }, // Relatable struggle
            { id: "proof_day15_b", subject: "she picks up her kids every day now" }, // Outcome
            { id: "proof_day15_c", subject: "maria replaced her income" }, // Result
        ],
        content: `{{firstName}},

Maria's story is the one I share most often.

She was a single mom with two kids, working as a personal trainer. She was making okay money but working 60+ hours a week. No time for her kids. No energy for herself.

"I can't afford to invest in myself right now," she told me.

I understood. I'd been there.

But I also knew: she couldn't afford NOT to.

Maria enrolled in the certification. She studied during nap times. She practiced on family members. She launched her practice while still training clients.

Within 6 months, she replaced her personal training income working HALF the hours.

Now? She makes $12,000/month, works 25 hours a week, and picks her kids up from school every day.

"I used to feel guilty choosing between work and my kids," she said. "Now I don't have to choose."

Maria wasn't special. She wasn't "good at business." She didn't have connections or savings or a partner to support her.

She just decided her family deserved better. And she made it happen.

What could YOUR life look like in 6 months?

Sarah`,
    },
    // PROOF DAY 18
    {
        id: "proof_day18",
        name: "Proof Day 18: Vicki (Yoga Teacher)",
        day: 18,
        sequence: "Proof",
        variants: [
            { id: "proof_day18_a", subject: "Re: from $45/class to $250/session" }, // Price jump
            { id: "proof_day18_b", subject: "vicki only teaches 2 classes now" }, // Lifestyle
            { id: "proof_day18_c", subject: "she had no medical background" }, // Objection crusher
        ],
        content: `{{firstName}},

Vicki was charging $45 per yoga class.

She loved teaching, but she was exhausted. Teaching 15+ classes a week just to make ends meet.

"I want to help people more deeply," she said. "But I don't have a medical background. Who am I to work with health issues?"

Sound familiar?

Here's what I told Vicki: You don't need a medical degree. You need a framework. You need confidence. And you need the right credentials.

Vicki completed our certification in 4 months while still teaching.

Then she launched her functional wellness practice.

Her first client paid $250 for a single session. That's more than 5 yoga classes.

Now she works with 12 private clients, teaches 2 yoga classes (for fun, not survival), and makes more in a week than she used to make in a month.

"I feel like a real practitioner now," she told me. "Not just someone teaching poses."

Vicki didn't have a medical background. She wasn't "qualified" on paper.

But she had heart. And she got the training she needed.

Sarah`,
    },
];

export default function InboxTestVariantsPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [sendingAll, setSendingAll] = useState(false);
    const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set(["story_day1"]));
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});
    const [previewContent, setPreviewContent] = useState<{ title: string; content: string } | null>(null);

    const sendVariant = async (emailId: string, variantId: string, subject: string, content: string) => {
        setSending(variantId);

        try {
            const res = await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject,
                    content: content.replace(/\{\{firstName\}\}/g, "Friend"),
                    emailId: variantId,
                }),
            });

            if (!res.ok) throw new Error("Failed to send");
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const sendAllVariants = async (email: typeof EMAIL_VARIANTS[0]) => {
        setSendingAll(true);

        for (const variant of email.variants) {
            await sendVariant(email.id, variant.id, variant.subject, email.content);
            await new Promise(r => setTimeout(r, 1000));
        }

        setSendingAll(false);
    };

    const markResult = (variantId: string, result: "inbox" | "promotion") => {
        setResults(prev => ({ ...prev, [variantId]: result }));
    };

    const toggleExpand = (emailId: string) => {
        setExpandedEmails(prev => {
            const next = new Set(prev);
            next.has(emailId) ? next.delete(emailId) : next.add(emailId);
            return next;
        });
    };

    const getSequenceColor = (sequence: string) => {
        switch (sequence) {
            case "Story": return "bg-pink-500";
            case "Proof": return "bg-blue-500";
            default: return "bg-gray-500";
        }
    };

    // Count results
    const inboxWins = Object.values(results).filter(r => r === "inbox").length;
    const promoCount = Object.values(results).filter(r => r === "promotion").length;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">🧪 Subject Line A/B Testing</h1>
                <p className="text-gray-600 mt-2">
                    3 variants per email. Send all variants → Check Gmail → Mark inbox/promo → Find winning patterns
                </p>
            </div>

            {/* Test Email + Results Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your@gmail.com"
                        className="flex-1"
                    />
                </div>

                {(inboxWins > 0 || promoCount > 0) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-100 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-700">{inboxWins}</p>
                            <p className="text-sm text-green-600">Primary Inbox ✅</p>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-orange-700">{promoCount}</p>
                            <p className="text-sm text-orange-600">Promotions 📦</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Email List with Variants */}
            <div className="space-y-4">
                {EMAIL_VARIANTS.map((email) => {
                    const isExpanded = expandedEmails.has(email.id);

                    return (
                        <div key={email.id} className="bg-white rounded-lg shadow overflow-hidden">
                            {/* Email Header */}
                            <button
                                onClick={() => toggleExpand(email.id)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full text-white", getSequenceColor(email.sequence))}>
                                        {email.sequence}
                                    </span>
                                    <span className="text-xs text-gray-500">Day {email.day}</span>
                                    <span className="font-medium text-gray-900">{email.name}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sendAllVariants(email);
                                    }}
                                    disabled={sendingAll}
                                    className="text-xs"
                                >
                                    {sendingAll ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
                                    Send All 3
                                </Button>
                            </button>

                            {/* Variants (expanded) */}
                            {isExpanded && (
                                <div className="border-t divide-y">
                                    {email.variants.map((variant, idx) => {
                                        const result = results[variant.id];

                                        return (
                                            <div
                                                key={variant.id}
                                                className={cn(
                                                    "px-4 py-3 flex items-center justify-between gap-4",
                                                    result === "inbox" && "bg-green-50",
                                                    result === "promotion" && "bg-orange-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <span className="text-sm font-bold text-gray-500 w-6">{String.fromCharCode(65 + idx)}.</span>
                                                    <span className="text-sm font-medium text-gray-900 truncate">{variant.subject}</span>
                                                    {result === "inbox" && (
                                                        <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full flex-shrink-0">✅ INBOX</span>
                                                    )}
                                                    {result === "promotion" && (
                                                        <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full flex-shrink-0">📦 PROMO</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {!result && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => markResult(variant.id, "inbox")}
                                                                className="text-xs border-green-500 text-green-700 hover:bg-green-50 h-7"
                                                            >
                                                                <Inbox className="w-3 h-3 mr-1" /> Inbox
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => markResult(variant.id, "promotion")}
                                                                className="text-xs border-orange-500 text-orange-700 hover:bg-orange-50 h-7"
                                                            >
                                                                <Tag className="w-3 h-3 mr-1" /> Promo
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setPreviewContent({ title: variant.subject, content: email.content })}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => sendVariant(email.id, variant.id, variant.subject, email.content)}
                                                        disabled={sending === variant.id}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        {sending === variant.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Mail className="w-3 h-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Preview Modal */}
            <Dialog open={!!previewContent} onOpenChange={() => setPreviewContent(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{previewContent?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                        {previewContent?.content.replace(/\{\{firstName\}\}/g, "Friend")}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
