"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Eye, Inbox, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// All 18 Buyer Nurturing Emails with Inbox-Optimized Subjects
const ALL_NURTURING_EMAILS = [
    // STORY SEQUENCE (Day 1-10)
    {
        id: "story_day1",
        name: "Story Day 1: Kitchen Floor",
        day: 1,
        sequence: "Story",
        subject: "Re: quick question about your journey",
        content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way." 💔

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that — it gave me back my hope.

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do. 🌱

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

With love,

Sarah 💕`,
    },
    {
        id: "story_day3",
        name: "Story Day 3: 3am Discovery",
        day: 3,
        sequence: "Story",
        subject: "Re: wanted to tell you something",
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

Trust that feeling. 💕

Sarah`,
    },
    {
        id: "story_day5",
        name: "Story Day 5: First Breakthrough",
        day: 5,
        sequence: "Story",
        subject: "Re: this reminded me of you",
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

And {{firstName}}, I believe you have that moment waiting for you too.

Sarah`,
    },
    {
        id: "story_day7",
        name: "Story Day 7: Daughter Noticed",
        day: 7,
        sequence: "Story",
        subject: "Re: something I noticed about you",
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

But I know it's coming. And I can't wait for you to experience it. 💕

Sarah`,
    },
    {
        id: "story_day10",
        name: "Story Day 10: Why I Do This",
        day: 10,
        sequence: "Story",
        subject: "Re: your question from earlier",
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

Sarah 💕`,
    },

    // PROOF SEQUENCE (Day 12-21)
    {
        id: "proof_day12",
        name: "Proof Day 12: Diane (62, RN)",
        day: 12,
        sequence: "Proof",
        subject: "Re: thought you'd want to hear this",
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
    {
        id: "proof_day15",
        name: "Proof Day 15: Maria (Single Mom)",
        day: 15,
        sequence: "Proof",
        subject: "Re: had to share this with you",
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
    {
        id: "proof_day18",
        name: "Proof Day 18: Vicki (Yoga Teacher)",
        day: 18,
        sequence: "Proof",
        subject: "Re: you asked about this before",
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
    {
        id: "proof_day21",
        name: "Proof Day 21: The Common Thread",
        day: 21,
        sequence: "Proof",
        subject: "Re: what I noticed about your progress",
        content: `{{firstName}},

Over the past week, I've shared stories with you. Diane (62, RN). Maria (single mom). Vicki (yoga teacher).

Different ages. Different backgrounds. Different starting points.

But they all have ONE thing in common:

They decided they were worth the investment.

Not "when I have more money." Not "when my kids are older." Not "when things calm down."

NOW.

They bet on themselves when it wasn't comfortable. When it wasn't convenient. When there were a thousand reasons to wait.

And that decision changed everything.

I'm not sharing these stories to pressure you.

I'm sharing them because I see something in YOU.

The same spark I saw in Diane, Maria, and Vicki.

The question is: what are you going to do with it?

Whatever you decide, I'm proud of you for being here.

Sarah 💕`,
    },

    // PAIN SEED SEQUENCE (Day 24-28)
    {
        id: "pain_day24",
        name: "Pain Day 24: Then What?",
        day: 24,
        sequence: "Pain Seed",
        subject: "Re: checking in on your next steps",
        content: `{{firstName}},

Can I ask you something honest?

Let's say you complete this certification. You learn the clinical skills. You understand root cause analysis. You can create real protocols.

Then what?

Because here's what I've seen happen too many times:

Amazing practitioners with incredible knowledge... who have no idea how to actually BUILD a business.

They struggle with:
- How do I find clients?
- What do I charge?
- How do I set up intake forms?
- What about legal stuff?
- How do I market myself without feeling gross?

And they end up either undercharging, overworking, or giving up entirely.

That's not going to be you.

But it DOES mean thinking ahead. Building systems now. Having the business infrastructure ready BEFORE you need it.

That's why I want to tell you about something we created for exactly this problem...

But that's for tomorrow.

For now, just think about: what would it look like to launch your practice with everything ALREADY set up?

Sarah`,
    },
    {
        id: "pain_day26",
        name: "Pain Day 26: Two Types",
        day: 26,
        sequence: "Pain Seed",
        subject: "Re: quick thought about your situation",
        content: `{{firstName}},

I've noticed there are two types of practitioners:

TYPE 1: The Strugglers
They spend 6+ months trying to figure out business stuff on their own.
They DIY their website (it looks... okay).
They write their own intake forms (missing key questions).
They create their own protocols from scratch (reinventing the wheel).
They eventually launch... exhausted, underconfident, and unsure if any of it is "right."

TYPE 2: The Fast-Launchers
They invest in done-for-you systems.
They have a professional website within 48 hours.
They use proven intake forms and legal templates.
They follow tested protocols.
They launch FAST — confident, credible, and ready to serve clients.

Same certification. Same skills. WILDLY different outcomes.

The difference isn't talent. It's infrastructure.

Most practitioners lose 6-12 months struggling with the business side.

That's 6-12 months of NOT helping clients. NOT making income. NOT building the life they enrolled for.

There's a better way. I'll share it tomorrow.

Sarah`,
    },
    {
        id: "pain_day28",
        name: "Pain Day 28: What If?",
        day: 28,
        sequence: "Pain Seed",
        subject: "Re: your question about getting started",
        content: `{{firstName}},

What if everything was already done for you?

I mean EVERYTHING:
✓ Professional website (custom built)
✓ Complete intake system
✓ Legal documents (liability waivers, consent forms)
✓ 10 ready-to-use protocol templates
✓ 31 email sequences for client nurturing
✓ 30 days of social media content
✓ Discovery call scripts
✓ Pricing and packaging templates

What if you could focus on what you LOVE — helping clients — instead of drowning in business logistics?

What if you could launch THIS WEEK instead of "someday"?

This is exactly what our Done-For-You Business Kit provides.

Everything built. Everything handed to you. Everything ready to use immediately.

I'm opening spots in 2 days. Very limited (we physically build each website ourselves).

Keep an eye on your inbox.

Sarah`,
    },

    // DFY LAUNCH SEQUENCE (Day 30-35)
    {
        id: "dfy_day30",
        name: "DFY Day 30: Coming Tomorrow",
        day: 30,
        sequence: "DFY Launch",
        subject: "Re: following up on our conversation",
        content: `{{firstName}},

Quick heads up:

Tomorrow morning, I'm opening a few spots for our Complete Done-For-You Business Kit.

Everything you need to launch your practice — built and handed to you:

✓ Professional website (built within 48 hours)
✓ Complete intake system
✓ Legal documents bundle
✓ 10 protocol templates
✓ 31 email sequences
✓ 30 days of social content
✓ Discovery call script
✓ Pricing & packaging templates

This is legitimately everything you need to go from "learning" to "launching" — fast.

Only a handful of spots because we physically build each website personally.

I'll send you the link in the morning.

Sarah`,
    },
    {
        id: "dfy_day31",
        name: "DFY Day 31: DOORS OPEN",
        day: 31,
        sequence: "DFY Launch",
        subject: "Re: here's the link you asked for",
        content: `{{firstName}},

It's ready.

Here's the link for the Complete Done-For-You Business Kit:

https://learn.accredipro.academy/dfy-kit

What you get:

✓ Custom Professional Website - Built within 48 hours
✓ Complete Intake System - Forms, questionnaires, automation
✓ Legal Documents Bundle - Liability waivers, consent forms, policies
✓ 10 Protocol Templates - Ready-to-use with your clients
✓ 31 Email Sequences - Client nurturing on autopilot
✓ 30 Days Social Content - Posts, stories, captions done
✓ Discovery Call Script - Convert prospects to clients
✓ Pricing & Packaging Guide - Know exactly what to charge

This is everything you need to launch a professional practice THIS WEEK instead of struggling for months trying to figure it all out.

Secure your spot: https://learn.accredipro.academy/dfy-kit

Sarah`,
    },
    {
        id: "dfy_day33",
        name: "DFY Day 33: Following Up",
        day: 33,
        sequence: "DFY Launch",
        subject: "Re: did you see my last message?",
        content: `{{firstName}},

Just wanted to follow up on the Done-For-You Business Kit.

A few spots have been claimed already, and I wanted to make sure you saw the link.

Quick reminder of what's included:
- Custom website (built in 48 hours)
- Complete intake system
- Legal docs bundle
- 10 protocol templates
- 31 email sequences
- 30 days social content
- Discovery call script
- Pricing guide

This is the difference between launching THIS WEEK vs struggling for months.

Here's the link: https://learn.accredipro.academy/dfy-kit

Sarah`,
    },
    {
        id: "dfy_day35",
        name: "DFY Day 35: FINAL CALL",
        day: 35,
        sequence: "DFY Launch",
        subject: "Re: one last thing before I go",
        content: `{{firstName}},

This is my last message about the Done-For-You Business Kit.

A few spots are still available. After these are gone, the next opening won't be for 4-6 weeks (we need time to build the websites).

Everything you need to launch:
- Custom website (48-hour delivery)
- Intake system
- Legal bundle
- Protocol templates
- Email sequences
- Social content
- Scripts & guides

Here's the link if you want it: https://learn.accredipro.academy/dfy-kit

Either way, I'm rooting for you.

Sarah`,
    },

    // MILESTONE UPSELLS (Pro Accelerator)
    {
        id: "milestone_50",
        name: "Milestone 50%: Pro Accelerator",
        day: 0,
        sequence: "Milestone",
        subject: "Re: noticed something about your account",
        content: `{{firstName}},

I just saw you hit 50% in your certification.

This tells me something important about you: you're not a dabbler. You're not "just browsing." You're actually DOING the work.

That's rare. Most people never make it this far.

And because you've proven you're serious, I want to tell you about something that's only offered to students who've reached this milestone:

**Pro Accelerator™**

This is the advanced track — where we go from "competent" to "DANGEROUS good."

20 modules. 120 lessons. Complete clinical AND business mastery.

What's included:
- Advanced lab interpretation
- Complex case management
- High-ticket client acquisition
- Referral network building
- Practice scaling systems

For serious students only.

See what's inside: https://learn.accredipro.academy/pro-accelerator

Sarah`,
    },
    {
        id: "milestone_100",
        name: "Milestone 100%: What's Next?",
        day: 0,
        sequence: "Milestone",
        subject: "Re: congratulations on your achievement",
        content: `{{firstName}},

YOU DID IT! 🎉

I'm so, so proud of you. You completed your entire certification.

Take a moment to really feel this. You did something most people never do.

Now... what's next?

What you've learned gives you a FOUNDATION. But if you want to:
- Handle the complex cases (the ones that pay $2,500-5,000)
- Get doctors and practitioners referring to YOU
- Build to $10,000-20,000/month
- Become THE expert in your area

You need the advanced training. That's what Pro Accelerator™ is for.

You've proven you finish what you start. Now let's make sure you BUILD what you've learned.

See the options: https://learn.accredipro.academy/pro-accelerator

Whatever you decide, I'm proud of you.

Sarah`,
    },
];

export default function InboxTestBuyerNurturingPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [sendingAll, setSendingAll] = useState(false);
    const [results, setResults] = useState<Record<string, { sent: boolean; placement?: "inbox" | "promotion" }>>({});
    const [previewEmail, setPreviewEmail] = useState<typeof ALL_NURTURING_EMAILS[0] | null>(null);

    const sendEmail = async (email: typeof ALL_NURTURING_EMAILS[0]) => {
        setSending(email.id);

        try {
            const res = await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject: email.subject,
                    content: email.content.replace(/\{\{firstName\}\}/g, "Friend"),
                    emailId: email.id,
                }),
            });

            if (res.ok) {
                setResults(prev => ({ ...prev, [email.id]: { sent: true } }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const sendAllEmails = async () => {
        setSendingAll(true);
        setResults({});

        for (const email of ALL_NURTURING_EMAILS) {
            await sendEmail(email);
            await new Promise(r => setTimeout(r, 3000)); // 3s delay
        }

        setSendingAll(false);
    };

    const markPlacement = (emailId: string, placement: "inbox" | "promotion") => {
        setResults(prev => ({
            ...prev,
            [emailId]: { ...prev[emailId], sent: true, placement }
        }));
    };

    const getSequenceColor = (sequence: string) => {
        switch (sequence) {
            case "Story": return "bg-pink-500";
            case "Proof": return "bg-blue-500";
            case "Pain Seed": return "bg-orange-500";
            case "DFY Launch": return "bg-green-500";
            case "Milestone": return "bg-purple-500";
            default: return "bg-gray-500";
        }
    };

    const inboxCount = Object.values(results).filter(r => r.placement === "inbox").length;
    const promoCount = Object.values(results).filter(r => r.placement === "promotion").length;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📧 All 18 Buyer Nurturing Emails</h1>
                <p className="text-gray-600 mt-2">
                    Inbox-optimized subjects using winning formula: <code className="bg-gray-100 px-2 py-1 rounded">Re: [conversational question about THEM]</code>
                </p>
            </div>

            {/* Test Email Input */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Gmail Test Address
                </label>
                <div className="flex gap-4">
                    <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your@gmail.com"
                        className="flex-1"
                    />
                    <Button
                        onClick={sendAllEmails}
                        disabled={sendingAll || !testEmail}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {sendingAll ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending ({Object.keys(results).length}/{ALL_NURTURING_EMAILS.length})
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send All 18 Emails
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Results Summary */}
            {(inboxCount > 0 || promoCount > 0) && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">📊 Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-100 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-700">{inboxCount}</p>
                            <p className="text-sm text-green-600">Primary Inbox ✅</p>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-orange-700">{promoCount}</p>
                            <p className="text-sm text-orange-600">Promotions 📦</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Email List */}
            <div className="space-y-3">
                {ALL_NURTURING_EMAILS.map((email) => {
                    const result = results[email.id];

                    return (
                        <div
                            key={email.id}
                            className={`bg-white rounded-lg shadow p-4 border-l-4 transition-all ${result?.placement === "inbox"
                                    ? "border-l-green-500 bg-green-50"
                                    : result?.placement === "promotion"
                                        ? "border-l-orange-500 bg-orange-50"
                                        : result?.sent
                                            ? "border-l-blue-400 bg-blue-50"
                                            : "border-l-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white ${getSequenceColor(email.sequence)}`}>
                                            {email.sequence}
                                        </span>
                                        <span className="text-xs text-gray-500">Day {email.day}</span>
                                        {result?.placement === "inbox" && (
                                            <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">
                                                ✅ INBOX
                                            </span>
                                        )}
                                        {result?.placement === "promotion" && (
                                            <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">
                                                📦 PROMO
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-medium text-gray-900 truncate">{email.subject}</p>
                                    <p className="text-xs text-gray-500 truncate">{email.name}</p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {result?.sent && !result?.placement && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => markPlacement(email.id, "inbox")}
                                                className="border-green-500 text-green-700 hover:bg-green-50 text-xs px-2"
                                            >
                                                <Inbox className="w-3 h-3 mr-1" /> Inbox
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => markPlacement(email.id, "promotion")}
                                                className="border-orange-500 text-orange-700 hover:bg-orange-50 text-xs px-2"
                                            >
                                                <Tag className="w-3 h-3 mr-1" /> Promo
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setPreviewEmail(email)}
                                        className="text-xs px-2"
                                    >
                                        <Eye className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => sendEmail(email)}
                                        disabled={sending === email.id || sendingAll}
                                        className="text-xs px-3"
                                    >
                                        {sending === email.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : result?.sent ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <Mail className="w-3 h-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Preview Modal */}
            <Dialog open={!!previewEmail} onOpenChange={() => setPreviewEmail(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{previewEmail?.name}</DialogTitle>
                    </DialogHeader>
                    {previewEmail && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-500">Subject</p>
                                <p className="text-xl font-bold text-purple-700">{previewEmail.subject}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-2">Content</p>
                                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                                    {previewEmail.content.replace(/\{\{firstName\}\}/g, "Friend")}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
