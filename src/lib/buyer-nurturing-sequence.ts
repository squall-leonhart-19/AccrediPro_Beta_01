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
        subject: "Re: the gap between learning and earning",
        preheader: "This is what separates the top 10%",
        hasCta: false,
        content: `{{firstName}},

Can I be honest with you about something?

There's a gap I see with almost every student.

They're learning. Doing the modules. Taking notes. <strong>But they're not BUILDING.</strong>

Learning without implementation = frustration.

It's like studying recipes for a year but never cooking.

The practitioners making $5k, $10k, $15k/month? They closed this gap fast.

They didn't just learn — they <strong>accelerated</strong>.

Tomorrow I'll show you what they did differently.

Sarah`,
    },

    {
        id: "pa_day13_stack",
        order: 7,
        day: 13,
        phase: 'pro_accelerator',
        subject: "Re: the pattern I keep seeing",
        preheader: "The stack that changes everything",
        hasCta: false,
        content: `{{firstName}},

Yesterday I told you about the gap between learning and earning.

Today, let me show you how the top 10% close it.

<strong>They get 4 things that most students don't:</strong>

<strong>1. Advanced Protocols</strong>
Not the basics — the stuff I paid $27k to learn over years. Complex cases. Premium clients. Real results.
<em>Value: $500 minimum</em>

<strong>2. Business Building Framework</strong>
How Kelly went from 0 followers to a WAITLIST in 90 days. The exact system.
<em>Value: $997</em>

<strong>3. Live Q&A Access</strong>
Stuck on something? Ask me directly. Get answers the same day. No more spinning your wheels alone.
<em>Value: $200/month</em>

<strong>4. Priority Support</strong>
Skip the line. Get unstuck fast. Have someone in your corner who's been there.
<em>Priceless</em>

<strong>Total value: $2,000+</strong>

Tomorrow I'll tell you how to get all of it.

Sarah`,
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

Remember everything I shared yesterday?

- Advanced Protocols ($500 value)
- Business Building Framework ($997 value)
- Live Q&A Access ($200/month value)
- Priority Support (priceless)

<strong>Total: $2,000+ in value</strong>

I bundled it all into one thing: <strong>Pro Accelerator</strong>.

And you can join for <strong>$297</strong>.

One payment. Lifetime access. Everything you need to go from learning to earning — fast.

This isn't for everyone. It's for the students who are SERIOUS. The ones who don't want to spend 2 years figuring it out on their own.

If that's you: https://sarah.accredipro.academy/up-masters

If not, no pressure. Keep going with the course. You'll still get results — just slower.

But if you want to accelerate... the door is open.

Sarah

P.S. Kelly, Maria, Diane — they all did Pro Accelerator. Just saying.`,
    },

    // ========================================
    // PHASE 4: DFY BUSINESS KIT VALUE STACK (Days 16-21)
    // ========================================

    {
        id: "dfy_day16_gap",
        order: 9,
        day: 16,
        phase: 'dfy_stack',
        subject: "Re: what I wish someone told me",
        preheader: "You're here to heal, not build websites",
        hasCta: false,
        content: `{{firstName}},

Let me ask you something.

<strong>Did you sign up for this to build websites? Design logos? Figure out email sequences?</strong>

No.

You signed up to <strong>help people</strong>. To transform lives. To finally use your gifts.

But here's what happens to most practitioners:

They finish learning... then spend 6 MONTHS on tech.

"I need a website first."
"I need to figure out my branding."
"I need to set up my booking system."

And 6 months later? Still no clients. Still "getting ready."

<strong>Imagine a store without a storefront.</strong> No sign. No window. Hidden in an alley. Would anyone find it?

That's what you are without a business presence.

But what if someone built everything FOR you?

More on that tomorrow.

Sarah`,
    },

    {
        id: "dfy_day17_website",
        order: 10,
        day: 17,
        phase: 'dfy_stack',
        subject: "Re: quick thought about visibility",
        preheader: "What a real website does for you",
        hasCta: false,
        content: `{{firstName}},

Let's talk about your storefront.

When someone hears about you, what do they do?

<strong>They Google you.</strong>

And if there's nothing there? No website? Just an Instagram with 47 followers?

<strong>They move on.</strong>

A professional website does three things:

1. <strong>Builds instant credibility</strong> — You look established, even if you're just starting
2. <strong>Works 24/7</strong> — People find you, learn about you, and book while you sleep
3. <strong>Commands premium prices</strong> — A $500/session practitioner LOOKS like a $500/session practitioner

Know what a good website costs if you hire a designer?

<strong>$2,000 - $5,000.</strong>

And that's before the revisions, the back-and-forth, the "that's not what I meant."

Imagine waking up to booking requests. From people who found you. Who already trust you. Who are ready to pay.

That's what a real website does.

Sarah`,
    },

    {
        id: "dfy_day18_system",
        order: 11,
        day: 18,
        phase: 'dfy_stack',
        subject: "Re: what if clients booked themselves?",
        preheader: "No more chasing clients",
        hasCta: false,
        content: `{{firstName}},

Here's what most practitioners do:

Someone expresses interest → They message back and forth for days → They manually send pricing → They wait for a response → They follow up → They follow up again → Client disappears

<strong>Exhausting.</strong>

Now here's what a real CLIENT SYSTEM does:

Someone expresses interest → They book a call automatically → They fill out intake forms before the call → They pay before you even meet → They show up ready

<strong>No chasing. No awkward money conversations. No ghosting.</strong>

The system does the work.

Know what a proper client system costs to set up?

- Software: $50-200/month
- Setup and configuration: $500-$1,000
- Integration with your calendar, payments, forms: Another $500

<strong>Total: $1,500+ to get it right</strong>

Or... you don't do it yourself.

More tomorrow.

Sarah`,
    },

    {
        id: "dfy_day19_branding",
        order: 12,
        day: 19,
        phase: 'dfy_stack',
        subject: "Re: first impressions matter",
        preheader: "Premium pricing requires premium presence",
        hasCta: false,
        content: `{{firstName}},

Quick question:

Would you pay $500/hr to someone whose Instagram looks like it was made in 5 minutes?

Whose "logo" is just text in a basic font?

Whose posts look like every other generic wellness account?

<strong>Neither would your clients.</strong>

Premium pricing requires premium presence.

That means:
- A real logo (not Canva's default)
- Consistent visual identity
- Professional social media templates
- Marketing materials that command respect

Know what that costs?

- Logo design: $300-$1,000
- Brand identity: $500-$2,000
- Social media templates: $200-$500
- Marketing materials: $300-$500

<strong>Total: $1,000+ minimum</strong>

And that's before the time you spend explaining what you want to designers who don't understand functional medicine.

<strong>What if you looked like you'd been doing this for years... from day one?</strong>

Sarah`,
    },

    {
        id: "dfy_day20_stack",
        order: 13,
        day: 20,
        phase: 'dfy_stack',
        subject: "Re: what changed for Maria",
        preheader: "The full stack revealed",
        hasCta: false,
        content: `{{firstName}},

Remember Maria? Single mom, two kids, $12k/month now?

Here's what she had when she launched:

<strong>Professional Website</strong>
Her own domain, her own brand, her own presence.
<em>Value: $3,000</em>

<strong>Client System</strong>
Booking, intake forms, payments — all automated.
<em>Value: $1,500</em>

<strong>Marketing Materials</strong>
Logo, brand identity, social templates.
<em>Value: $1,000</em>

<strong>Launch Strategy</strong>
Step-by-step plan to get her first clients.
<em>Value: $500</em>

<strong>Total value: $6,000+</strong>

She didn't build any of it. We built it FOR her.

While she was finishing the certification, her business was being built in the background.

Day she finished? She was READY. No 6-month "setup" phase. No tech overwhelm.

<strong>How much did she pay for all of this?</strong>

<strong>$397.</strong>

Tomorrow I'll tell you how to get the same thing.

Sarah`,
    },

    {
        id: "dfy_day21_offer",
        order: 14,
        day: 21,
        phase: 'dfy_stack',
        subject: "Re: your business, built this week",
        preheader: "Everything done for you",
        hasCta: true,
        ctaText: "Get DFY Business Kit",
        ctaLink: "https://sarah.accredipro.academy/up-3",
        content: `{{firstName}},

Let me make this simple.

<strong>The DFY Business Kit includes:</strong>

✓ Professional website (your name, your brand)
✓ Client booking + intake system
✓ Logo and visual identity
✓ Social media templates
✓ Marketing materials
✓ Launch strategy

<strong>Value: $6,000+</strong>
<strong>Your investment: $397</strong>

We build it. You focus on learning. By the time you're certified, your business is READY.

No tech headaches. No 6-month setup. No excuses.

If you want us to build everything for you: https://sarah.accredipro.academy/up-3

<strong>We only take a limited number of DFY clients each month</strong> (because we actually build everything by hand). So if this is calling to you, don't wait.

You're here to heal. Let us handle the rest.

Sarah

P.S. Maria, Kelly, Diane — they all got DFY. Their businesses were ready before they finished studying.`,
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
