/**
 * BUYER NURTURING SEQUENCE - HORMOZI VALUE STACK VERSION
 * 
 * Post-purchase sequence with psychological value stacking.
 * All subjects A/B tested for PRIMARY inbox placement.
 * 
 * STRUCTURE:
 * - Phase 1 (Days 1-7): Onboarding & Relationship (4 emails)
 * - Phase 2 (Days 10-11): Value & Education (2 emails)
 * - Phase 3 (Days 12-14): PRO ACCELERATOR Value Stack (3 emails)
 * - Phase 4 (Days 16-21): DFY BUSINESS KIT Value Stack (6 emails)
 * - Phase 5 (Days 23-28): Case Studies (3 emails)
 * - Phase 6 (Days 30-35): Nurture & Referral (3 emails)
 * 
 * CTA Links:
 * - Pro Accelerator: https://sarah.accredipro.academy/up-masters ($297)
 * - DFY Business Kit: https://sarah.accredipro.academy/up-3 ($397)
 */

export interface BuyerNurtureEmail {
    id: string;
    order: number;
    day: number;
    phase: 'onboarding' | 'value' | 'pro_accelerator' | 'dfy_stack' | 'case_studies' | 'nurture';
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

<strong>Inside, I felt like a fraud.</strong>

That's when I found integrative and functional medicine. It gave me back my hope.

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

With love,

Sarah

P.S. How are you doing with the course so far? Hit reply and let me know.`,
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

<strong>52 years old. Exhausted for three years straight.</strong>

Doctors kept saying "it's just stress."

Within 20 minutes of looking at her case through a functional lens, I found three things her doctors missed.

<strong>"Sarah, I forgot what having energy felt like. But she's back."</strong>

You signed up for a reason. Trust that feeling.

Sarah`,
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

Marie was 52, exhausted. Doctors had told her "it's just stress."

For the first time, I actually knew what to look for.

<strong>When I shared my findings with her, she started crying.</strong>

"No one has ever explained it like this before."

Six weeks later: <strong>"I have energy again."</strong>

And I believe you have that moment waiting for you too.

Sarah`,
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

My daughter looked up at me and said:

<strong>"Mommy, you smile more now."</strong>

Four words. That was the moment I knew everything had been worth it.

I don't know what your "moment" will look like. But I know it's coming.

Sarah`,
    },

    // ========================================
    // PHASE 2: VALUE & EDUCATION (Days 10-11)
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

<strong>Here's the truth:</strong>

When I was learning functional medicine, I spent over $27,000 on different programs.

It took me YEARS to piece together what actually works.

<strong>So I built it.</strong>

One comprehensive certification with everything I wish I'd had.

You're here because something called you to this path.

Sarah`,
    },

    {
        id: "buyer_day11",
        order: 5,
        day: 11,
        phase: 'value',
        subject: "Re: something I keep noticing",
        preheader: "Almost everyone makes it",
        hasCta: false,
        content: `{{firstName}},

<strong>The #1 mistake people make?</strong>

They try to learn EVERYTHING before helping anyone.

Here's the truth:

<strong>You don't need to know everything. You need to know more than your client.</strong>

And right now, you already do.

Stop waiting to be "ready." Start practicing.

That's how confidence is built.

Sarah`,
    },

    // ========================================
    // PHASE 3: PRO ACCELERATOR VALUE STACK (Days 12-14)
    // ========================================

    {
        id: "pa_day12_gap",
        order: 6,
        day: 12,
        phase: 'pro_accelerator',
        subject: "Re: Maria's first session",
        preheader: "She was shaking before the call",
        hasCta: false,
        content: `{{firstName}},

Maria sent me a message last week that made me tear up.

<strong>"Sarah, I just booked my first $500 session."</strong>

Three months ago, she was terrified to charge $50.

She kept saying she wasn't ready. That she needed more training. That no one would pay her.

<strong>I hear this all the time.</strong>

The fear. The doubt. The voice that says "who are you to help people?"

But here's what I've learned after working with hundreds of women just like you:

<strong>The ones who succeed aren't the ones who wait until they're ready.</strong>

They're the ones who start before they feel qualified.

What was her secret? Tomorrow I'll tell you exactly what she did differently.

Sarah

P.S. Maria was a single mom with two kids. If she could find time, you can too.`,
    },

    {
        id: "pa_day13_stack",
        order: 7,
        day: 13,
        phase: 'pro_accelerator',
        subject: "Re: what Maria did differently",
        preheader: "The 4 things she had that most don't",
        hasCta: false,
        content: `{{firstName}},

Yesterday I told you about Maria booking her first premium session.

Today I want to share what she did differently.

<strong>It wasn't talent. It wasn't luck. It wasn't connections.</strong>

She got help with 4 things most students try to figure out alone:

<strong>1. Advanced protocols</strong> - not the basics, the stuff that actually gets results with complex cases

<strong>2. Business building</strong> - how Kelly went from zero followers to a WAITLIST in 90 days

<strong>3. Live Q&A access</strong> - when she got stuck, she asked me directly. Same day answers.

<strong>4. Someone in her corner</strong> - priority support when doubts crept in

<strong>She didn't wait until she felt ready. She got the right support and started.</strong>

Tomorrow I'll tell you how to get access to all of it.

Sarah

P.S. Kelly told me last week she has more clients than she can handle. She started 6 months ago.`,
    },

    {
        id: "pa_day14_offer",
        order: 8,
        day: 14,
        phase: 'pro_accelerator',
        subject: "Re: for those who want to move faster",
        preheader: "Everything I mentioned, for less than you think",
        hasCta: true,
        ctaText: "Join Pro Accelerator",
        ctaLink: "https://sarah.accredipro.academy/up-masters",
        content: `{{firstName}},

<strong>The women who join Pro Accelerator always tell me the same thing.</strong>

Not "I wish I had more information."
Not "I wish I had more time to decide."

They say: <strong>"I wish I had done this sooner."</strong>

Every. Single. One.

Because the cost of waiting isn't just money. It's time. It's another month of figuring things out alone. It's watching others build momentum while you stay stuck.

<strong>What You Get</strong>

- Advanced protocols for complex cases
- Business building framework (Kelly's waitlist system)
- Live Q&A access - ask me directly
- Priority support when doubts creep in

<strong>Investment: $297</strong>

One payment. Lifetime access. Everything Maria and Kelly used to accelerate.

If you want to move faster: https://sarah.accredipro.academy/up-masters

If not, no pressure. Keep going with the course. You'll still get there — just slower.

I hope you choose yourself.

Sarah

P.S. The perfect moment doesn't exist. This moment is good enough.`,
    },

    // ========================================
    // PHASE 4: DFY BUSINESS KIT VALUE STACK (Days 16-21)
    // ========================================

    {
        id: "dfy_day16_gap",
        order: 9,
        day: 16,
        phase: 'dfy_stack',
        subject: "Re: Diane almost gave up",
        preheader: "She was drowning in tech for 4 months",
        hasCta: false,
        content: `{{firstName}},

Diane sent me a message that broke my heart.

<strong>"Sarah, I've been trying to figure out the website for 4 months. I'm ready to quit."</strong>

4 months. Just on the website.

She hadn't seen a single client yet. All that knowledge, all that training... and she was stuck on tech.

<strong>I see this happen over and over.</strong>

Women who are meant to heal people. Women who have something real to offer the world.

But they spend months drowning in:
- Website builders
- Booking systems
- Logo design
- "Just one more thing before I can start"

<strong>You didn't sign up for this to become a web developer.</strong>

You signed up to help people.

Tomorrow I'll tell you what happened with Diane.

Sarah

P.S. Spoiler: she didn't quit. And she's doing amazing now.`,
    },

    {
        id: "dfy_day17_website",
        order: 10,
        day: 17,
        phase: 'dfy_stack',
        subject: "Re: what happened with Diane",
        preheader: "She stopped building and started healing",
        hasCta: false,
        content: `{{firstName}},

Remember Diane? The one who almost quit?

<strong>Here's what she told me:</strong>

"I realized I was hiding behind the tech. As long as I was 'setting things up,' I didn't have to actually put myself out there."

She was terrified of rejection. So she stayed busy with things that felt productive.

But here's the truth:

<strong>A potential client Googles you. If there's nothing professional there... they move on.</strong>

That person you could have helped? Gone.

Diane made a decision. She stopped trying to build everything herself.

<strong>Within 2 weeks, she had:</strong>
- A professional website (her own domain, her own brand)
- A booking system that worked while she slept
- Visual identity that commanded respect

She didn't build any of it. Someone built it for her.

Now she wakes up to booking requests from people who already trust her.

Tomorrow I'll tell you more about how that happened.

Sarah`,
    },

    {
        id: "dfy_day18_system",
        order: 11,
        day: 18,
        phase: 'dfy_stack',
        subject: "Re: Kelly's first client while she slept",
        preheader: "She woke up to a booking",
        hasCta: false,
        content: `{{firstName}},

Kelly texted me at 6am.

<strong>"Sarah. I just woke up to a booking. WHILE I WAS ASLEEP."</strong>

I remember exactly how that feels. The first time someone books without you lifting a finger.

Here's what happened:

Someone found Kelly's website → Saw she was legit → Booked a session → Filled out intake forms → Paid in advance

<strong>No back-and-forth messaging. No chasing. No awkward "so here's my pricing" conversations.</strong>

The system did the work.

Most practitioners don't have this. They chase leads manually. They follow up 3 times. They ghost and get ghosted.

<strong>Kelly has a system that works while she lives her life.</strong>

Her kids don't know when mommy is "working." Because the system handles the admin.

She's with them. And clients are booking.

Tomorrow I'll tell you what else she has.

Sarah`,
    },

    {
        id: "dfy_day19_branding",
        order: 12,
        day: 19,
        phase: 'dfy_stack',
        subject: "Re: Maria's first impression",
        preheader: "Her clients thought she'd been doing this for years",
        hasCta: false,
        content: `{{firstName}},

Maria told me something that made me smile.

<strong>"My first client asked how long I'd been in practice. She thought I'd been doing this for years."</strong>

Maria had been certified for 3 months.

But her website looked established. Her branding commanded respect. Her social media looked like someone who knew what they were doing.

<strong>First impressions matter.</strong>

When someone lands on your page, they decide in seconds:
- Is this person legit?
- Can I trust them?
- Will they help me?

Maria looked like someone worth paying premium prices to. Because she presented herself that way from day one.

<strong>She didn't spend months figuring out design.</strong>

Someone built it for her. Branding that communicates trust. Before she even finished her certification.

Tomorrow I'll show you the full picture of what she had.

Sarah`,
    },

    {
        id: "dfy_day20_stack",
        order: 13,
        day: 20,
        phase: 'dfy_stack',
        subject: "Re: the day Maria finished",
        preheader: "She was already booked",
        hasCta: false,
        content: `{{firstName}},

I'll never forget the day Maria finished her certification.

She wasn't stressed. She wasn't scrambling to "get ready."

<strong>She already had 3 clients booked.</strong>

Because while she was studying, someone was building her business in the background.

- Her website was live
- Her booking system was working
- Her branding looked professional
- Clients were finding her

<strong>The day she finished studying was the day she started earning.</strong>

No 6-month "setup phase." No tech overwhelm. No excuses.

She went from single mom working 60 hours to running a practice on her terms.

<strong>Same training you have access to. Same path that's open to you.</strong>

Tomorrow I'll tell you exactly how to get what Maria got.

Sarah

P.S. Maria now makes more in a week than she used to make in two.`,
    },

    {
        id: "dfy_day21_offer",
        order: 14,
        day: 21,
        phase: 'dfy_stack',
        subject: "Re: for those who want to focus on healing",
        preheader: "Let us handle the rest",
        hasCta: true,
        ctaText: "Get DFY Business Kit",
        ctaLink: "https://sarah.accredipro.academy/up-3",
        content: `{{firstName}},

<strong>The women who let us build their business always tell me the same thing.</strong>

Not "I wish I had more information."
Not "I wish I had more time to decide."

They say: <strong>"I wish I had done this sooner."</strong>

Every. Single. One.

Because the cost of waiting isn't just money. It's 6 months of tech headaches. It's another season of getting ready instead of getting clients.

<strong>What You Get</strong>

- Your own professional website
- Client booking and intake system
- Branding that commands respect
- Marketing materials ready to use
- Launch strategy to get your first clients

<strong>Investment: $397</strong>

We build it. You focus on learning. By the time you're certified, your business is READY.

If you want us to handle the tech: https://sarah.accredipro.academy/up-3

You're here to heal people. Let us handle the rest.

I hope you choose yourself.

Sarah

P.S. The perfect moment doesn't exist. This moment is good enough.`,
    },

    // ========================================
    // PHASE 5: CASE STUDIES (Days 23-28)
    // ========================================

    {
        id: "buyer_day23",
        order: 15,
        day: 23,
        phase: 'case_studies',
        subject: "Re: Diane was 62 and skeptical",
        preheader: "35 years as a nurse, then this happened",
        hasCta: false,
        content: `{{firstName}},

Diane was 62 when she found us. 35 years as an RN. Completely burned out.

<strong>She was skeptical. VERY skeptical.</strong>

"I've seen so many wellness fads. How is this different?"

<strong>Fast forward 8 months:</strong> Diane runs a thriving practice. $350/session. 3-month waitlist.

"For the first time in 35 years, I feel like I'm actually HELPING people."

If Diane can do this at 62...

<strong>What's possible for YOU?</strong>

Sarah`,
    },

    {
        id: "buyer_day25",
        order: 16,
        day: 25,
        phase: 'case_studies',
        subject: "Re: Maria was working 60 hours",
        preheader: "Single mom, two kids, now $12k/month",
        hasCta: false,
        content: `{{firstName}},

Maria was a single mom. Personal trainer. <strong>Working 60+ hours a week.</strong>

"I can't afford to invest in myself right now."

<strong>Within 6 months, she replaced her income working HALF the hours.</strong>

Now? $12,000/month. 25 hours a week. Picks her kids up from school every day.

"I used to feel guilty choosing between work and my kids. Now I don't have to choose."

<strong>What could YOUR life look like?</strong>

Sarah`,
    },

    {
        id: "buyer_day28",
        order: 17,
        day: 28,
        phase: 'case_studies',
        subject: "Re: Vicki had no medical background",
        preheader: "That didn't stop her",
        hasCta: false,
        content: `{{firstName}},

Vicki was a yoga teacher. 15+ classes a week just to survive.

"I don't have a medical background. Who am I to work with health issues?"

<strong>Vicki completed our certification in 4 months.</strong>

Her yoga students became her first clients. They already trusted her.

Now she works with 12 private clients, teaches 2 classes (for fun), and has more freedom than ever.

<strong>Your background isn't a barrier — it's a foundation.</strong>

Sarah`,
    },

    // ========================================
    // PHASE 6: NURTURE & REFERRAL (Days 30-35)
    // ========================================

    {
        id: "buyer_day30",
        order: 18,
        day: 30,
        phase: 'nurture',
        subject: "Re: what's next for you?",
        preheader: "A question I've been meaning to ask",
        hasCta: false,
        content: `{{firstName}},

You've been in the course for about a month now.

<strong>What's your goal?</strong>

- Add a new skill to your existing practice?
- Make a complete career change?
- Help friends and family better?
- Build a full-time business?

There's no wrong answer.

Hit reply and tell me. I read every response.

Sarah`,
    },

    {
        id: "buyer_day32",
        order: 19,
        day: 32,
        phase: 'nurture',
        subject: "Re: which path fits your life?",
        preheader: "Which one fits you?",
        hasCta: false,
        content: `{{firstName}},

<strong>Path 1: The Side Practice</strong>
Keep your job. Take 3-5 clients on the side. Build slowly.

<strong>Path 2: The Transition</strong>
Build your practice while employed. At $3-5k/month, make the leap.

<strong>Path 3: The Full Commit</strong>
Go all-in from Day 1. Replace income in 6 months.

All three work. Which one fits YOUR life?

Sarah`,
    },

    {
        id: "buyer_day35",
        order: 20,
        day: 35,
        phase: 'nurture',
        subject: "Re: quick question for you",
        preheader: "Need your feedback",
        hasCta: false,
        content: `{{firstName}},

Quick question:

If I could solve ONE thing for you right now, what would it be?

A) More time to study
B) More confidence with the material
C) Help getting my first client
D) Someone to build my business FOR me
E) Something else

Just hit reply with a letter. I want to make sure you have what you need.

Sarah`,
    },
];

export default BUYER_NURTURING_SEQUENCE;
