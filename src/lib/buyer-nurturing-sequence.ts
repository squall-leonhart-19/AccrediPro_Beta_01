/**
 * BUYER NURTURING SEQUENCE - 8 Emails
 * 
 * Post-purchase sequence for new customers.
 * All subjects A/B tested and proven to land in PRIMARY inbox.
 * 
 * Strategy: Personal relationship building before upsell
 * - Days 1-7: Story + connection building
 * - Days 10-18: Social proof + transformation stories
 * 
 * CTA Link: {{ctaLink}} - replaced dynamically based on course/offer
 */

export interface BuyerNurtureEmail {
    id: string;
    order: number;
    day: number;
    subject: string;
    preheader: string;
    content: string;
    hasCta: boolean;
    ctaText?: string;
}

export const BUYER_NURTURING_SEQUENCE: BuyerNurtureEmail[] = [
    // ========================================
    // DAY 1: Sarah's Story - Connection
    // ========================================
    {
        id: "buyer_day1",
        order: 0,
        day: 1,
        subject: "Re: quick question about your journey",
        preheader: "I was thinking about you",
        hasCta: false,
        content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

<strong>Inside, I felt like a fraud.</strong>

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way."

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

<strong>But more than that — it gave me back my hope.</strong>

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

With love,

Sarah

P.S. How are you doing with the course so far? Hit reply and let me know — I read every response personally.`,
    },

    // ========================================
    // DAY 3: Linda's Story - Relatability
    // ========================================
    {
        id: "buyer_day3",
        order: 1,
        day: 3,
        subject: "Re: Linda's story (you'll relate)",
        preheader: "She was 52 and exhausted",
        hasCta: false,
        content: `{{firstName}},

I need to tell you about Linda.

She came to me last year. <strong>52 years old. Exhausted for three years straight.</strong>

Brain fog so bad she'd forget her own phone number. Doctors kept saying "it's just stress" and "you're getting older."

Sound familiar?

By the time she found me, she was starting to believe them. Maybe it WAS all in her head.

<strong>It wasn't.</strong>

Within 20 minutes of looking at her case through a functional lens, I found three things her doctors missed. Not because they were bad doctors — because they weren't trained to look.

We worked together for 8 weeks. Simple protocol. Nothing extreme.

Last month, she sent me this message:

<strong>"Sarah, I forgot what having energy felt like. I thought that version of me was just... gone forever. But she's back."</strong>

I'm sharing this because I know you're at your own crossroads right now.

You signed up for a reason. Maybe you haven't even fully admitted that reason to yourself yet. But something inside you knows there's more.

Trust that feeling.

Sarah

P.S. Have you had a chance to watch Lesson 2 yet? The root-cause framework we cover there is exactly what helped me help Linda.`,
    },

    // ========================================
    // DAY 5: Marie's Story - First Breakthrough
    // ========================================
    {
        id: "buyer_day5",
        order: 2,
        day: 5,
        subject: "Re: she started crying in my office",
        preheader: "Marie was 52 and had given up hope",
        hasCta: false,
        content: `{{firstName}},

I'll never forget my first real breakthrough.

I'd been studying functional medicine for about 6 months. Still working my regular job. Still feeling like maybe this was all too much for me.

Then a client came in — let's call her Marie. She was 52, exhausted all the time, doctors had told her "it's just stress" and "you're getting older."

For the first time, I actually knew what to look for.

I asked different questions. I looked at her case through this new lens. And I saw something the doctors had missed.

<strong>When I shared my findings with her, she started crying.</strong>

"No one has ever explained it like this before," she said. "I thought I was going crazy."

We worked together on a protocol. Simple changes. Nothing extreme.

Six weeks later, she sent me an email: <strong>"I have energy again. I forgot what this felt like."</strong>

That was the moment I knew. This wasn't just education. This was transformation — for my clients AND for me.

I went from "maybe I can do this" to "I was MADE for this."

And I believe you have that moment waiting for you too.

Sarah

P.S. You're in the right place. Keep going.`,
    },

    // ========================================
    // DAY 7: Emma (Daughter) Story - Emotional Peak
    // ========================================
    {
        id: "buyer_day7",
        order: 3,
        day: 7,
        subject: "Re: my daughter said 4 words",
        preheader: "And everything changed",
        hasCta: false,
        content: `{{firstName}},

There's a moment I come back to whenever I doubt myself.

It was about a year after I started practicing functional medicine. My business was growing. My health was better than it had been in a decade. But I was still wondering if I'd made the right choice.

Then one evening, Emma said something that stopped me in my tracks.

I was making dinner — something I'd actually had energy to do for the first time in months — and she looked up at me and said:

<strong>"Mommy, you smile more now."</strong>

Four words. That was it. That was the moment I knew everything had been worth it.

The late nights studying.
The scary leap from "just a coach" to certified practitioner.
The moments of doubt when I wondered if I could really do this.

All of it led to THIS — being present, being healthy, being the mom I always wanted to be.

I don't know what your "moment" will look like, {{firstName}}. Maybe it's a client breakthrough. Maybe it's financial freedom. Maybe it's just feeling like YOU again.

But I know it's coming. And I can't wait for you to experience it.

Sarah

P.S. How is the course going? I'd love to hear what's resonating with you so far.`,
    },

    // ========================================
    // DAY 10: Why I Built This - Investment Story
    // ========================================
    {
        id: "buyer_day10",
        order: 4,
        day: 10,
        subject: "Re: I spent $27k learning this",
        preheader: "So you don't have to",
        hasCta: true,
        ctaText: "See your next step",
        content: `{{firstName}},

I've told you a lot about my journey. The kitchen floor moment. The 3am discovery. The first breakthrough.

But I haven't told you WHY I created this certification.

<strong>Here's the truth:</strong>

When I was learning functional medicine, I spent over $27,000 on different programs. Some were too basic. Some were too clinical for practical use. Some were taught by people who had never actually worked with clients.

It took me YEARS to piece together what actually works.

And I kept thinking: "Why isn't there ONE program that teaches everything — the clinical skills AND the business side? Why do we have to figure this out alone?"

<strong>So I built it.</strong>

I took everything I learned — the wins, the failures, the client breakthroughs, the business strategies — and put it into one comprehensive certification.

Not because I wanted to be an "expert." But because I didn't want anyone else to struggle the way I did.

You're here because something called you to this path.

My job is to make sure you have everything you need to succeed.

With love,

Sarah

P.S. When you're ready to take the next step, I'm here: {{ctaLink}}`,
    },

    // ========================================
    // DAY 12: Diane's Story - Social Proof
    // ========================================
    {
        id: "buyer_day12",
        order: 5,
        day: 12,
        subject: "Re: Diane was 62 and skeptical",
        preheader: "35 years as a nurse, then this happened",
        hasCta: true,
        ctaText: "Start your transformation",
        content: `{{firstName}},

I want to introduce you to Diane.

Diane was 62 when she found us. She'd been an RN for 35 years and was completely burned out. She loved helping people but hated the system.

<strong>She was skeptical. VERY skeptical.</strong>

"I've seen so many wellness fads come and go," she told me. "How is this different?"

I loved her honesty. I told her: "You have 35 years of clinical experience. This certification will give you the framework to use that experience in a completely new way."

She took the leap.

<strong>Fast forward 8 months:</strong> Diane now runs a thriving practice helping menopausal women. She charges $350/session and has a 3-month waitlist.

But here's what she told me that really stuck:

"For the first time in 35 years, I feel like I'm actually HELPING people — not just managing symptoms. And I'm home for dinner every night."

If Diane can do this at 62, after 35 years in a broken system...

<strong>What's possible for YOU, {{firstName}}?</strong>

Sarah

P.S. Ready to see what's next? {{ctaLink}}`,
    },

    // ========================================
    // DAY 15: Maria's Story - Transformation
    // ========================================
    {
        id: "buyer_day15",
        order: 6,
        day: 15,
        subject: "Re: Maria was working 60 hours",
        preheader: "Single mom, two kids, now $12k/month",
        hasCta: true,
        ctaText: "See how she did it",
        content: `{{firstName}},

Maria's story is the one I share most often.

She was a single mom with two kids, working as a personal trainer. She was making okay money but <strong>working 60+ hours a week</strong>. No time for her kids. No energy for herself.

"I can't afford to invest in myself right now," she told me.

I understood. I'd been there.

But I also knew: she couldn't afford NOT to.

Maria enrolled in the certification. She studied during nap times. She practiced on family members. She launched her practice while still training clients.

<strong>Within 6 months, she replaced her personal training income working HALF the hours.</strong>

Now? She makes $12,000/month, works 25 hours a week, and picks her kids up from school every day.

"I used to feel guilty choosing between work and my kids," she said. "Now I don't have to choose."

Maria wasn't special. She wasn't "good at business." She didn't have connections or savings or a partner to support her.

She just decided her family deserved better. And she made it happen.

<strong>What could YOUR life look like in 6 months, {{firstName}}?</strong>

Sarah

P.S. If Maria's story resonates with you, here's your next step: {{ctaLink}}`,
    },

    // ========================================
    // DAY 18: Vicki's Story - Objection Handling
    // ========================================
    {
        id: "buyer_day18",
        order: 7,
        day: 18,
        subject: "Re: Vicki had no medical background",
        preheader: "That didn't stop her",
        hasCta: true,
        ctaText: "Take the next step",
        content: `{{firstName}},

I need to tell you about Vicki.

Especially if you've ever thought: <strong>"But I don't have a medical background."</strong>

Vicki was a yoga teacher. Teaching 15+ classes a week just to make ends meet. Exhausted. Burnt out.

"I want to help people more deeply," she said. "But I don't have a medical background. Who am I to work with health issues?"

Sound familiar?

Here's what I told her: You don't need a medical degree. You need a framework. You need confidence. And you need the right credentials.

<strong>Vicki completed our certification in 4 months while still teaching.</strong>

Then she launched her functional wellness practice. Her yoga students became her first clients — they already trusted her.

Now she works with 12 private clients, teaches 2 yoga classes (for fun, not survival), and has more freedom than ever.

"I feel like a real practitioner now," she told me. "Not just someone teaching poses."

Vicki didn't have a medical background. She wasn't "qualified" on paper.

But she had heart. And she got the training she needed.

<strong>What about you, {{firstName}}?</strong>

Sarah

P.S. Your background isn't a barrier — it's a foundation. Ready? {{ctaLink}}`,
    },
];

export default BUYER_NURTURING_SEQUENCE;
