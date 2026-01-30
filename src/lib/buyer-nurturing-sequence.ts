/**
 * BUYER NURTURING SEQUENCE - EXTENDED 35+ DAYS
 * 
 * Post-purchase sequence for new customers.
 * All subjects A/B tested and proven to land in PRIMARY inbox.
 * 
 * PHASES:
 * - Phase 1 (Days 1-7): Onboarding & Relationship
 * - Phase 2 (Days 10-18): Value & Education  
 * - Phase 3 (Days 20-28): More Case Studies
 * - Phase 4 (Days 30-35): Soft Upsell Intro
 * 
 * BEHAVIORAL TRIGGERS (separate sequences):
 * - Pro Accelerator: 50%+ completion, NOT purchased
 * - DFY Rescue: 3+ days inactive, NOT purchased
 * 
 * CTA Links:
 * - Pro Accelerator: https://sarah.accredipro.academy/up-masters ($297)
 * - DFY Business Kit: https://sarah.accredipro.academy/up-3 ($397)
 */

export interface BuyerNurtureEmail {
    id: string;
    order: number;
    day: number;
    phase: 'onboarding' | 'value' | 'case_studies' | 'soft_upsell';
    subject: string;
    preheader: string;
    content: string;
    hasCta: boolean;
    ctaText?: string;
    ctaLink?: string;
}

export const BUYER_NURTURING_SEQUENCE: BuyerNurtureEmail[] = [
    // ========================================
    // PHASE 1: ONBOARDING & RELATIONSHIP (Days 1-7)
    // ========================================

    {
        id: "buyer_day1",
        order: 0,
        day: 1,
        phase: 'onboarding',
        subject: "Re: quick question about your journey",
        preheader: "I was thinking about you",
        hasCta: false,
        content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

<strong>Inside, I felt like a fraud.</strong>

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do.

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces.

<strong>But more than that — it gave me back my hope.</strong>

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

With love,

Sarah

P.S. How are you doing with the course so far? Hit reply and let me know — I read every response personally.`,
    },

    {
        id: "buyer_day3",
        order: 1,
        day: 3,
        phase: 'onboarding',
        subject: "Re: Linda's story (you'll relate)",
        preheader: "She was 52 and exhausted",
        hasCta: false,
        content: `{{firstName}},

I need to tell you about Linda.

She came to me last year. <strong>52 years old. Exhausted for three years straight.</strong>

Brain fog so bad she'd forget her own phone number. Doctors kept saying "it's just stress" and "you're getting older."

By the time she found me, she was starting to believe them. Maybe it WAS all in her head.

<strong>It wasn't.</strong>

Within 20 minutes of looking at her case through a functional lens, I found three things her doctors missed.

Last month, she sent me this message:

<strong>"Sarah, I forgot what having energy felt like. But she's back."</strong>

You signed up for a reason. Trust that feeling.

Sarah

P.S. Have you had a chance to watch Lesson 2 yet? The root-cause framework there is exactly what helped me help Linda.`,
    },

    {
        id: "buyer_day5",
        order: 2,
        day: 5,
        phase: 'onboarding',
        subject: "Re: she started crying in my office",
        preheader: "Marie was 52 and had given up hope",
        hasCta: false,
        content: `{{firstName}},

I'll never forget my first real breakthrough.

A client came in — Marie. 52, exhausted all the time. Doctors had told her "it's just stress."

For the first time, I actually knew what to look for.

<strong>When I shared my findings with her, she started crying.</strong>

"No one has ever explained it like this before," she said.

Six weeks later: <strong>"I have energy again. I forgot what this felt like."</strong>

I went from "maybe I can do this" to "I was MADE for this."

And I believe you have that moment waiting for you too.

Sarah

P.S. You're in the right place. Keep going.`,
    },

    {
        id: "buyer_day7",
        order: 3,
        day: 7,
        phase: 'onboarding',
        subject: "Re: my daughter said 4 words",
        preheader: "And everything changed",
        hasCta: false,
        content: `{{firstName}},

There's a moment I come back to whenever I doubt myself.

It was about a year after I started practicing functional medicine. My business was growing. But I was still wondering if I'd made the right choice.

Then one evening, my daughter said something that stopped me.

I was making dinner and she looked up at me:

<strong>"Mommy, you smile more now."</strong>

Four words. That was the moment I knew everything had been worth it.

The late nights studying. The scary leap from "just a coach" to certified practitioner. All of it led to THIS.

I don't know what your "moment" will look like, {{firstName}}. But I know it's coming.

Sarah

P.S. How is the course going? I'd love to hear what's resonating with you so far.`,
    },

    // ========================================
    // PHASE 2: VALUE & EDUCATION (Days 10-18)
    // ========================================

    {
        id: "buyer_day10",
        order: 4,
        day: 10,
        phase: 'value',
        subject: "Re: I spent $27k learning this",
        preheader: "So you don't have to",
        hasCta: false,
        content: `{{firstName}},

I haven't told you WHY I created this certification.

<strong>Here's the truth:</strong>

When I was learning functional medicine, I spent over $27,000 on different programs. Some were too basic. Some were too clinical for practical use. Some were taught by people who had never actually worked with clients.

It took me YEARS to piece together what actually works.

<strong>So I built it.</strong>

I took everything I learned — the wins, the failures, the client breakthroughs — and put it into one comprehensive certification.

Not because I wanted to be an "expert." But because I didn't want anyone else to struggle the way I did.

You're here because something called you to this path.

My job is to make sure you have everything you need to succeed.

With love,

Sarah`,
    },

    {
        id: "buyer_day12",
        order: 5,
        day: 12,
        phase: 'value',
        subject: "Re: Diane was 62 and skeptical",
        preheader: "35 years as a nurse, then this happened",
        hasCta: false,
        content: `{{firstName}},

I want to tell you about Diane.

Diane was 62 when she found us. 35 years as an RN. Completely burned out.

<strong>She was skeptical. VERY skeptical.</strong>

"I've seen so many wellness fads come and go," she said. "How is this different?"

I told her: "You have 35 years of clinical experience. This certification will give you the framework to use that experience in a completely new way."

She took the leap.

<strong>Fast forward 8 months:</strong> Diane runs a thriving practice helping menopausal women. $350/session. 3-month waitlist.

"For the first time in 35 years, I feel like I'm actually HELPING people — not just managing symptoms."

If Diane can do this at 62...

<strong>What's possible for YOU?</strong>

Sarah`,
    },

    {
        id: "buyer_day14",
        order: 6,
        day: 14,
        phase: 'value',
        subject: "Re: the mistake I see most",
        preheader: "Almost everyone makes it",
        hasCta: false,
        content: `{{firstName}},

After working with hundreds of students, I've noticed something.

<strong>The #1 mistake people make?</strong>

They try to learn EVERYTHING before helping anyone.

They think: "I need to finish all the modules. Then read more books. Then get more certifications. THEN maybe I'll be ready."

Sound familiar?

Here's the truth:

<strong>You don't need to know everything. You need to know more than your client.</strong>

And right now, you already do.

The woman struggling with brain fog? You can help her.
The mom exhausted from running on empty? You can help her.
The professional who's been dismissed by doctors? You can help her.

Stop waiting to be "ready." Start practicing.

That's how confidence is built. Not by consuming more — by DOING more.

Sarah

P.S. Even just 25% through the course, you know more about root-cause health than most people ever will.`,
    },

    {
        id: "buyer_day16",
        order: 7,
        day: 16,
        phase: 'value',
        subject: "Re: what I wish someone told me",
        preheader: "Would have saved me years",
        hasCta: false,
        content: `{{firstName}},

If I could go back and tell myself one thing when I started, it would be this:

<strong>"Your first client doesn't need you to be perfect. They need you to CARE."</strong>

I spent so much time worrying:
- What if I don't know the answer?
- What if they ask something I haven't learned yet?
- What if I'm not good enough?

But here's what I discovered:

Clients don't come to you for perfection. They come because they're SEEN. Because someone finally listens. Because you take the time their doctor doesn't have.

Your caring is your superpower.

The knowledge? That grows. The protocols? They become second nature.

But the heart you bring — that's already there.

Trust it.

Sarah`,
    },

    {
        id: "buyer_day18",
        order: 8,
        day: 18,
        phase: 'value',
        subject: "Re: Vicki had no medical background",
        preheader: "That didn't stop her",
        hasCta: false,
        content: `{{firstName}},

I need to tell you about Vicki.

Especially if you've ever thought: <strong>"But I don't have a medical background."</strong>

Vicki was a yoga teacher. Teaching 15+ classes a week just to make ends meet. Exhausted. Burnt out.

"I want to help people more deeply," she said. "But I don't have a medical background. Who am I to work with health issues?"

Sound familiar?

<strong>Vicki completed our certification in 4 months while still teaching.</strong>

Her yoga students became her first clients — they already trusted her.

Now she works with 12 private clients, teaches 2 yoga classes (for fun), and has more freedom than ever.

"I feel like a real practitioner now."

Vicki didn't have a medical background. She wasn't "qualified" on paper.

But she had heart. And she got the training she needed.

<strong>What about you?</strong>

Sarah`,
    },

    // ========================================
    // PHASE 3: MORE CASE STUDIES (Days 20-28)
    // ========================================

    {
        id: "buyer_day20",
        order: 9,
        day: 20,
        phase: 'case_studies',
        subject: "Re: Maria was working 60 hours",
        preheader: "Single mom, two kids, now $12k/month",
        hasCta: false,
        content: `{{firstName}},

Maria's story is the one I share most often.

Single mom with two kids. Personal trainer. <strong>Working 60+ hours a week.</strong> No time for her kids. No energy for herself.

"I can't afford to invest in myself right now," she told me.

I understood. I'd been there.

But I also knew: she couldn't afford NOT to.

Maria studied during nap times. Practiced on family members. Launched her practice while still training clients.

<strong>Within 6 months, she replaced her income working HALF the hours.</strong>

Now? $12,000/month. 25 hours a week. Picks her kids up from school every day.

"I used to feel guilty choosing between work and my kids. Now I don't have to choose."

Maria wasn't special. She wasn't "good at business." She didn't have connections or savings.

She just decided her family deserved better.

<strong>What could YOUR life look like in 6 months?</strong>

Sarah`,
    },

    {
        id: "buyer_day22",
        order: 10,
        day: 22,
        phase: 'case_studies',
        subject: "Re: the RN who quit the hospital",
        preheader: "After 22 years, she walked away",
        hasCta: false,
        content: `{{firstName}},

Jennifer spent 22 years as an ER nurse.

She was good at it. Really good. But every year, she felt more like a cog in a machine.

15-minute appointments. Impossible patient loads. Watching the same people come back with the same problems because no one had time to find the root cause.

"I became a nurse to HELP people," she told me. "But I spend more time on paperwork than patients."

When she found us, she was skeptical. Another certification?

But this was different.

<strong>This showed her HOW to use 22 years of clinical experience in a completely new way.</strong>

6 months later, Jennifer quit the hospital.

Now she runs a practice from her spare bedroom. Works with 15 patients (not hundreds). Actually has TIME to help them.

"I finally feel like the nurse I went to school to become."

If you're in healthcare and feeling burned out — you're not alone. And there's another way.

Sarah`,
    },

    {
        id: "buyer_day24",
        order: 11,
        day: 24,
        phase: 'case_studies',
        subject: "Re: she was 58 and scared",
        preheader: "Too old to start over?",
        hasCta: false,
        content: `{{firstName}},

Carol almost didn't enroll.

58 years old. Recently divorced. Starting completely over.

"Sarah, I'm too old for this," she said. "Who's going to hire a 58-year-old with no experience?"

I asked her: "Carol, when you help a friend with a health problem, do they listen to you?"

"Yes, but—"

"Do they come back and ask more questions?"

"Always."

"Then you're not starting from zero. You're starting with trust."

<strong>8 months later:</strong> Carol has a full practice. Her clients are mostly women 50+. They PREFER someone who understands their stage of life.

"My age isn't a liability," she told me. "It's my biggest asset. My clients trust me because I GET them."

If you've ever thought you're "too old" — you're not.

You're exactly the right age for the people who need you most.

Sarah`,
    },

    {
        id: "buyer_day26",
        order: 12,
        day: 26,
        phase: 'case_studies',
        subject: "Re: what my students ask most",
        preheader: "Honest answers",
        hasCta: false,
        content: `{{firstName}},

After working with hundreds of students, I've heard every question.

Here are the most common — and my honest answers:

<strong>"How long until I get my first client?"</strong>
Most students get their first paying client within 2-3 months of finishing. Some sooner (Kelly had clients WHILE studying). The key: don't wait until you feel "ready."

<strong>"Can I really do this without medical credentials?"</strong>
About 40% of our graduates have no medical background. Yoga teachers, life coaches, personal trainers, corporate professionals. Your credential comes from our certification + your results.

<strong>"What if I don't have time?"</strong>
The average student studies 5-7 hours/week. Many have full-time jobs and kids. If you have 1 hour/day, you have time.

<strong>"Is this legitimate?"</strong>
Every certificate has a verification number. We have a public registry. Our graduates build real practices with real clients.

<strong>"What if I fail?"</strong>
You can't fail. You can only quit. And as long as you keep going, you won't.

What questions do YOU have? Hit reply. I answer every one.

Sarah`,
    },

    {
        id: "buyer_day28",
        order: 13,
        day: 28,
        phase: 'case_studies',
        subject: "Re: the yoga teacher who tripled income",
        preheader: "Same clients, new offering",
        hasCta: false,
        content: `{{firstName}},

Remember Vicki? The yoga teacher who felt stuck?

Here's the part I didn't tell you.

Vicki didn't get NEW clients when she finished. She went back to her EXISTING students.

"Hey, I just completed a functional medicine certification. I'm offering full health assessments now. Would you be interested?"

<strong>12 of them said yes immediately.</strong>

Same people who trusted her for yoga. Now trusting her for something deeper.

She charges $300/session. Her yoga classes were $25/class.

<strong>That's 12x the income per hour.</strong>

Here's what I want you to understand:

You already have people in your life who trust you. Friends who ask health questions. Colleagues who vent about their symptoms. Family members who wish they had answers.

They're your first clients. You just don't see them that way yet.

By the time you finish this certification, you will.

Sarah`,
    },

    // ========================================
    // PHASE 4: SOFT UPSELL INTRO (Days 30-35)
    // ========================================

    {
        id: "buyer_day30",
        order: 14,
        day: 30,
        phase: 'soft_upsell',
        subject: "Re: what's next for you?",
        preheader: "A question I've been meaning to ask",
        hasCta: false,
        content: `{{firstName}},

Can I ask you something?

You've been in the course for about a month now.

I'm curious: <strong>what's your goal?</strong>

Are you looking to:
- Add a new skill to your existing practice?
- Make a complete career change?
- Help friends and family better?
- Build a full-time business?

There's no wrong answer. But knowing your goal helps me point you in the right direction.

Because after you finish the certification, there are a few paths forward. And the best one depends on where you want to go.

Hit reply and tell me. I read every response.

Sarah

P.S. If you're not sure yet — that's okay too. Just tell me what you're thinking.`,
    },

    {
        id: "buyer_day32",
        order: 15,
        day: 32,
        phase: 'soft_upsell',
        subject: "Re: 3 paths I've seen work",
        preheader: "Which one fits you?",
        hasCta: false,
        content: `{{firstName}},

After watching hundreds of students graduate, I've noticed 3 patterns.

<strong>Path 1: The Side Practice</strong>
Keep your current job. Take 3-5 clients on the side. Build slowly, keep the security.
Best for: People who love their job but want more meaning.

<strong>Path 2: The Transition</strong>
Build your practice while employed. Once you hit $3-5k/month, make the leap.
Best for: People ready to leave but need a financial bridge.

<strong>Path 3: The Full Commit</strong>
Go all-in from Day 1. Build fast, hustle hard, replace income in 6 months or less.
Best for: People with savings or spousal support, ready to bet on themselves.

All three work. I've seen success stories from each.

The question is: which one fits YOUR life right now?

Knowing that helps you move with intention instead of just hoping things work out.

Sarah

P.S. There's no judgment. Diane (the 62-year-old nurse) started with Path 1. Maria (the single mom) did Path 2. Both ended up at the same place — just different timelines.`,
    },

    {
        id: "buyer_day35",
        order: 16,
        day: 35,
        phase: 'soft_upsell',
        subject: "Re: quick question for you",
        preheader: "Need your feedback",
        hasCta: false,
        content: `{{firstName}},

Quick question:

If I could wave a magic wand and solve ONE thing for you right now, what would it be?

A) More time to study
B) More confidence with the material
C) Help getting my first client
D) Someone to build my business FOR me
E) Something else (reply and tell me!)

Just hit reply with a letter. 

I'm asking because I want to make sure you have everything you need to succeed. And sometimes the best way to help is to just ASK.

Talk soon,

Sarah`,
    },
];

// ========================================
// BEHAVIORAL TRIGGER: PRO ACCELERATOR SEQUENCE
// Trigger: 50%+ completion AND has NOT purchased pro-accelerator
// ========================================

export const PRO_ACCELERATOR_SEQUENCE: BuyerNurtureEmail[] = [
    {
        id: "pa_trigger_1",
        order: 0,
        day: 0,
        phase: 'soft_upsell',
        subject: "Re: you're doing amazing",
        preheader: "I noticed your progress",
        hasCta: true,
        ctaText: "See Pro Accelerator",
        ctaLink: "https://sarah.accredipro.academy/up-masters",
        content: `{{firstName}},

I just noticed — you're over halfway through the certification!

<strong>That puts you ahead of 80% of people who start online courses.</strong>

Most people quit. You didn't.

That tells me something about you. You're serious. You're committed. And you're going to succeed at this.

So I want to share something with you.

For students like you — the ones who actually DO the work — I created something special called the <strong>Pro Accelerator</strong>.

It's for people who are ready to move faster:
- Advanced protocols
- Business building frameworks
- Live Q&A access
- Priority support

This isn't for everyone. It's for the ones who are already proving themselves.

Like you.

If you want to see what's inside: https://sarah.accredipro.academy/up-masters

No pressure. Just wanted you to know it exists.

Sarah

P.S. Seriously — I'm proud of you. Keep going.`,
    },

    {
        id: "pa_trigger_2",
        order: 1,
        day: 2,
        phase: 'soft_upsell',
        subject: "Re: what students like you do next",
        preheader: "The pattern I've noticed",
        hasCta: true,
        ctaText: "Join Pro Accelerator",
        ctaLink: "https://sarah.accredipro.academy/up-masters",
        content: `{{firstName}},

I've watched hundreds of students complete this certification.

And there's a pattern.

The ones who accelerate fastest? They don't just finish the course. <strong>They get mentorship.</strong>

Kelly (the nurse with the waitlist)? Pro Accelerator student.
Maria (the single mom earning $12k/month)? Pro Accelerator.
Diane (62, 3-month waitlist)? Pro Accelerator.

It's not a coincidence.

The course gives you the knowledge. The Pro Accelerator gives you the <strong>speed</strong>.

You're already proving you're serious. This is how you capitalize on that momentum.

Details here: https://sarah.accredipro.academy/up-masters

Sarah`,
    },

    {
        id: "pa_trigger_3",
        order: 2,
        day: 4,
        phase: 'soft_upsell',
        subject: "Re: last thought on this",
        preheader: "Then I'll leave you alone",
        hasCta: true,
        ctaText: "See Pro Accelerator",
        ctaLink: "https://sarah.accredipro.academy/up-masters",
        content: `{{firstName}},

I've mentioned the Pro Accelerator twice.

This is the last time I'll bring it up.

<strong>Here's what it comes down to:</strong>

You can absolutely succeed with just the certification. Many have.

But if you want to move faster — get clients sooner, build confidence quicker, avoid the mistakes I made — Pro Accelerator is the shortcut.

$297. One-time investment.

Compare that to the months of trial and error it saves.

Your call: https://sarah.accredipro.academy/up-masters

Either way, I'm proud of how far you've come.

Sarah

P.S. If money is genuinely tight, just reply and tell me. We'll figure something out.`,
    },
];

// ========================================
// BEHAVIORAL TRIGGER: DFY RESCUE SEQUENCE
// Trigger: 3+ days inactive OR <20% progress after Day 14, AND has NOT purchased DFY
// ========================================

export const DFY_RESCUE_SEQUENCE: BuyerNurtureEmail[] = [
    {
        id: "dfy_trigger_1",
        order: 0,
        day: 0,
        phase: 'soft_upsell',
        subject: "Re: I noticed you've been busy",
        preheader: "No judgment, just checking in",
        hasCta: true,
        ctaText: "See Done-For-You option",
        ctaLink: "https://sarah.accredipro.academy/up-3",
        content: `{{firstName}},

I noticed you haven't logged in for a bit.

No judgment. Life gets crazy. I've been there.

But I wanted to check in — is everything okay?

Sometimes when students go quiet, it's because:
- Life got in the way (totally normal)
- They're feeling overwhelmed (also normal)
- They're wondering if they made the right choice (very normal)

If any of that is you, I want you to know: <strong>you're not behind. You can pick up exactly where you left off.</strong>

And if the issue is time...

I actually created something for people in exactly your situation. It's called the <strong>Done-For-You Business Kit</strong>.

Instead of building everything yourself, we build it FOR you. Your website, your client materials, your marketing — all done.

If you're busy and want the shortcut: https://sarah.accredipro.academy/up-3

But honestly — I just wanted to make sure you're okay. Hit reply and let me know?

Sarah`,
    },

    {
        id: "dfy_trigger_2",
        order: 1,
        day: 2,
        phase: 'soft_upsell',
        subject: "Re: let me do the hard part for you",
        preheader: "What if you didn't have to build it?",
        hasCta: true,
        ctaText: "Get DFY Business Kit",
        ctaLink: "https://sarah.accredipro.academy/up-3",
        content: `{{firstName}},

Can I be honest with you?

The certification? You can do that in your own time.

But building a business? <strong>That's where people get stuck.</strong>

Website. Branding. Client intake forms. Marketing materials. Social media. Pricing. Contracts.

It's overwhelming. And most people never get past it.

That's why I created the <strong>Done-For-You Business Kit</strong>.

<strong>We build EVERYTHING for you:</strong>
- Professional website
- Client intake system
- Marketing templates
- Social media assets
- Email sequences
- Pricing strategy

You focus on the learning. We handle the building.

By the time you're certified, your business is READY.

No more "I'll figure out the website later."
No more "I don't know what to charge."
No more waiting to launch.

Details here: https://sarah.accredipro.academy/up-3

This is the shortcut for busy people.

Sarah`,
    },

    {
        id: "dfy_trigger_3",
        order: 2,
        day: 4,
        phase: 'soft_upsell',
        subject: "Re: this might be easier",
        preheader: "For people who'd rather just launch",
        hasCta: true,
        ctaText: "Get DFY Business Kit",
        ctaLink: "https://sarah.accredipro.academy/up-3",
        content: `{{firstName}},

Some people love building things from scratch.

<strong>And some people would rather just LAUNCH.</strong>

If you're the second type, I get it. I am too.

That's why the Done-For-You Business Kit exists.

$397. One payment. We build your entire business infrastructure while you focus on the certification.

<strong>What you get:</strong>
✓ Custom website (your name, your brand)
✓ Client management system
✓ Done-for-you marketing materials
✓ Social media templates
✓ Email sequences that convert
✓ Pricing and packaging strategy

By the time you finish learning, you're ready to take clients. No delay. No excuses.

If that sounds like you: https://sarah.accredipro.academy/up-3

Either way, I'm here for you.

Sarah

P.S. Most DFY students get their first paying client within 30 days of finishing. The infrastructure is THAT important.`,
    },
];

export default BUYER_NURTURING_SEQUENCE;
