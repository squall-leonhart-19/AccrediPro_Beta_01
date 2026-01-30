"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Buyer Nurturing Emails - All 18 emails
const BUYER_NURTURING_EMAILS = [
    // STORY SEQUENCE (Day 1-10)
    {
        id: "story_day1",
        name: "Story Day 1: Kitchen Floor",
        day: 1,
        sequence: "Story",
        subject: "Re: can I share something personal?",
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
        subject: "Re: the night everything changed",
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
        subject: "Re: my first real breakthrough",
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
        subject: "Re: when my daughter noticed",
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
        subject: "Re: why I created this",
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
        subject: "Re: she was 62 and skeptical",
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
        subject: "Re: single mom, two kids",
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
        subject: "Re: from $45/class to $250/session",
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
        subject: "Re: what they all have in common",
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
        subject: "Re: then what?",
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
        subject: "Re: two types of practitioners",
        content: `{{firstName}},

I've noticed there are two types of practitioners:

TYPE 1: The Strugglers
They spend 6+ months trying to figure out business stuff on their own.
They DIY their website (it looks... okay).
They write their own intake forms (missing key questions).
They create their own protocols from scratch (reinventing the wheel).
They eventually launch... exhausted, underconfident, and unsure if any of it is "right."

TYPE 2: The Fast-Launcers
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
        subject: "Re: what if everything was ready?",
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
        subject: "Re: opening 10 spots tomorrow",
        content: `{{firstName}},

Quick heads up:

Tomorrow morning, I'm opening 10 spots for our Complete Done-For-You Business Kit.

Everything you need to launch your practice — built and handed to you:

✓ Professional website (built within 48 hours)
✓ Complete intake system
✓ Legal documents bundle
✓ 10 protocol templates
✓ 31 email sequences
✓ 30 days of social content
✓ Discovery call script
✓ Pricing & packaging templates

Total value: $9,900+

Price: $397

ONE time. Everything delivered. Launch THIS week.

Only 10 spots because we physically build each website personally.

I'll send you the link in the morning.

Sarah`,
    },
    {
        id: "dfy_day31",
        name: "DFY Day 31: DOORS OPEN",
        day: 31,
        sequence: "DFY Launch",
        subject: "Re: it's open (10 spots)",
        content: `{{firstName}},

It's open.

10 spots for the Complete Done-For-You Business Kit.

Here's exactly what you get:

✓ Custom Professional Website - Built within 48 hours
✓ Complete Intake System - Forms, questionnaires, automation
✓ Legal Documents Bundle - Liability waivers, consent forms, policies
✓ 10 Protocol Templates - Ready-to-use with your clients
✓ 31 Email Sequences - Client nurturing on autopilot
✓ 30 Days Social Content - Posts, stories, captions done
✓ Discovery Call Script - Convert prospects to clients
✓ Pricing & Packaging Guide - Know exactly what to charge

Total Value: $9,900+

Your Investment: $397 (one-time)

This is everything you need to launch a professional practice THIS WEEK instead of struggling for months trying to figure it all out.

Secure your spot: https://learn.accredipro.academy/dfy-kit

Only 10 spots. We build each website personally. When they're gone, they're gone.

Sarah

P.S. The website ALONE is worth more than $397. You're getting that PLUS everything else.`,
    },
    {
        id: "dfy_day33",
        name: "DFY Day 33: 7 Spots Left",
        day: 33,
        sequence: "DFY Launch",
        subject: "Re: 7 spots left",
        content: `{{firstName}},

Quick update:

3 spots claimed already.

7 remaining.

The Done-For-You Business Kit ($397):
- Custom website (built in 48 hours)
- Complete intake system
- Legal docs bundle
- 10 protocol templates
- 31 email sequences
- 30 days social content
- Discovery call script
- Pricing guide

This is the difference between launching THIS WEEK vs struggling for months.

Grab your spot: https://learn.accredipro.academy/dfy-kit

Sarah

P.S. Every day without your business set up is a day you're not helping clients. A day you're not making income. How many more days do you want to wait?`,
    },
    {
        id: "dfy_day35",
        name: "DFY Day 35: FINAL CALL",
        day: 35,
        sequence: "DFY Launch",
        subject: "Re: final call (3 spots)",
        content: `{{firstName}},

This is the final call.

3 spots left for the Done-For-You Business Kit.

After these are gone, the next opening won't be for 4-6 weeks (we need time to build the websites).

$397 for everything:
- Custom website (48-hour delivery)
- Intake system
- Legal bundle
- Protocol templates
- Email sequences
- Social content
- Scripts & guides

Launch THIS week or wait another month+.

Your choice.

Final spots: https://learn.accredipro.academy/dfy-kit

Rooting for you either way.

Sarah

P.S. Whatever you decide, I'm proud of you for being here. But if that little voice inside is saying "do it" — listen to it. That voice is usually right.`,
    },

    // MILESTONE UPSELLS (Pro Accelerator)
    {
        id: "milestone_50",
        name: "Milestone 50%: Pro Accelerator",
        day: 0,
        sequence: "Milestone",
        subject: "Re: you've proven you're serious",
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

Normal price: $1,997

For you, right now, because you've shown you're serious:
**$297** (one-time)

See what's inside: https://learn.accredipro.academy/pro-accelerator

Sarah

P.S. Michelle (49) was THIS close to skipping this. Now she's at $18,000/month handling complex cases she would have referred out before.`,
    },
    {
        id: "milestone_100",
        name: "Milestone 100%: What's Next?",
        day: 0,
        sequence: "Milestone",
        subject: "Re: what's next for you?",
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

For graduates only:

Pro Accelerator: $297 (normally $1,997)
DFY Business Kit: $397 (normally $997)
BUNDLE BOTH: $597 (save $97)

You've proven you finish what you start. Now let's make sure you BUILD what you've learned.

See the options: https://learn.accredipro.academy/pro-accelerator

Whatever you decide, I'm proud of you.

Sarah

P.S. Karen (55, RN) went from $72K/year nursing to $180K/year coaching after Pro Accelerator. The certification gave her the foundation. The advanced training gave her the income.`,
    },
];

export default function InboxTestBuyerNurturingPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [sendingAll, setSendingAll] = useState(false);
    const [results, setResults] = useState<{ id: string; success: boolean; error?: string }[]>([]);
    const [previewEmail, setPreviewEmail] = useState<typeof BUYER_NURTURING_EMAILS[0] | null>(null);

    const sendEmail = async (email: typeof BUYER_NURTURING_EMAILS[0]) => {
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
                setResults(prev => [...prev, { id: email.id, success: true }]);
            } else {
                const data = await res.json();
                setResults(prev => [...prev, { id: email.id, success: false, error: data.error }]);
            }
        } catch (err) {
            setResults(prev => [...prev, { id: email.id, success: false, error: String(err) }]);
        } finally {
            setSending(null);
        }
    };

    const sendAllEmails = async () => {
        setSendingAll(true);
        setResults([]);

        for (const email of BUYER_NURTURING_EMAILS) {
            await sendEmail(email);
            await new Promise(r => setTimeout(r, 2500)); // 2.5s delay between emails
        }

        setSendingAll(false);
    };

    const getSequenceColor = (sequence: string) => {
        switch (sequence) {
            case "Story": return "bg-pink-100 text-pink-700";
            case "Proof": return "bg-blue-100 text-blue-700";
            case "Pain Seed": return "bg-orange-100 text-orange-700";
            case "DFY Launch": return "bg-green-100 text-green-700";
            case "Milestone": return "bg-purple-100 text-purple-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Buyer Nurturing Emails</h1>
                <p className="text-gray-600 mt-2">18 emails across 5 sequences: Story, Proof, Pain Seed, DFY Launch, Milestone</p>
            </div>

            {/* Test Email Input */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                </label>
                <div className="flex gap-4">
                    <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your@email.com"
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
                                Sending ({results.length}/{BUYER_NURTURING_EMAILS.length})
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send All (18 emails)
                            </>
                        )}
                    </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Send All sends each email with a 2.5-second delay.
                </p>
            </div>

            {/* Results Summary */}
            {results.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <p className="text-sm font-medium">
                        Results: {results.filter(r => r.success).length} sent, {results.filter(r => !r.success).length} failed
                    </p>
                </div>
            )}

            {/* Email List */}
            <div className="space-y-4">
                {BUYER_NURTURING_EMAILS.map((email) => {
                    const result = results.find(r => r.id === email.id);

                    return (
                        <div
                            key={email.id}
                            className={`bg-white rounded-lg shadow p-5 border-l-4 ${result?.success ? "border-l-green-500" :
                                    result?.success === false ? "border-l-red-500" :
                                        "border-l-gray-200"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSequenceColor(email.sequence)}`}>
                                            {email.sequence}
                                        </span>
                                        <span className="text-sm text-gray-500">Day {email.day}</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{email.name}</h3>
                                    <p className="text-sm text-purple-600 font-medium mt-1">{email.subject}</p>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {email.content.substring(0, 150)}...
                                    </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewEmail(email)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => sendEmail(email)}
                                        disabled={sending === email.id || sendingAll}
                                    >
                                        {sending === email.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Mail className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {result?.success === false && result.error && (
                                <p className="text-sm text-red-600 mt-2">Error: {result.error}</p>
                            )}
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
                            <div>
                                <p className="text-sm font-medium text-gray-500">Subject</p>
                                <p className="text-lg font-semibold text-purple-600">{previewEmail.subject}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-2">Content</p>
                                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                                    {previewEmail.content}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
