/**
 * Chat-to-Conversion Email Sequence
 * 
 * For leads who engaged in live chat but haven't purchased.
 * Uses A-B-A-B-C winning combination from inbox testing.
 * 
 * Recommended sequence:
 * - Day 0 (A): Warm follow-up
 * - Day 1 (B): Social proof  
 * - Day 2 (A): FAQ
 * - Day 3 (B): Risk reversal
 * - Day 5 (C): Clean goodbye
 */

export const CHAT_CONVERSION_EMAILS = [
    // Email 1 - Day 0: Warm Personal Follow-up (Version A)
    {
        order: 0,
        subject: "Re: following up on our conversation",
        delayDays: 0,
        delayHours: 2, // 2 hours after chat
        content: `{{firstName}},

It was great chatting with you earlier today.

I could tell from our conversation that you're serious about making a change - not just "thinking about it" like most people, but actually ready to do something about it.

<strong>That's rare. And it matters.</strong>

If there's anything I didn't answer clearly, or if you've thought of more questions since we talked, just reply to this email. I'm here.

I also want you to know: there's no pressure from me. This path isn't for everyone. But for the right person - someone like you, who's tired of the conventional approach and ready for something different - it can be genuinely transformational.

Whatever you decide, I'm glad we connected.

Sarah

P.S. If you're ready to take the next step, here's the link: https://sarah.accredipro.academy/checkout-fm-certification`,
    },

    // Email 2 - Day 1: Social Proof (Version B)
    {
        order: 1,
        subject: "Re: thought you'd want to see this",
        delayDays: 1,
        delayHours: 0,
        content: `{{firstName}},

I wanted to share something with you.

After our chat yesterday, I thought about what might help you decide. So I went back through recent student messages.

<strong>Here's what Jennifer from Ohio wrote last week:</strong>

"I was SO skeptical. I'd tried other programs before. But this was different - real clinical training, not just fluffy wellness content. I got my first paying client in month 2. Now I earn more from my practice than my corporate job paid. I wish I'd started sooner."

<strong>And this from Rosa in Texas:</strong>

"I was scared I was too old to learn something new. I'm 58. Turns out, my life experience was an advantage. Clients trust me BECAUSE of my age. I'm fully booked."

{{firstName}}, I'm sharing these because I want you to see yourself in them.

These aren't unicorns. They're regular women who decided to try.

Your choice, always.

Sarah`,
    },

    // Email 3 - Day 2: FAQ (Version A)
    {
        order: 2,
        subject: "Re: questions you might have",
        delayDays: 2,
        delayHours: 0,
        content: `{{firstName}},

I wanted to answer some questions you might be thinking about (even if you haven't asked them yet).

<strong>"How long does it take?"</strong>
8-12 weeks if you study 5-7 hours/week. It's self-paced, so you can go faster or slower.

<strong>"What if I'm not from a medical background?"</strong>
About 60% of our students aren't. We teach everything from the ground up.

<strong>"Can I really get clients?"</strong>
Yes. We include client acquisition training. Most students get their first paying client within 90 days of finishing.

<strong>"Is $997 a lot?"</strong>
For a certification that pays for itself with your first 2-3 clients? No. For something that changes your career trajectory? It's actually quite reasonable.

<strong>"What if it's not for me?"</strong>
30-day money-back guarantee. No risk.

Any other questions? Just hit reply.

Sarah

P.S. Enrollment link when you're ready: https://sarah.accredipro.academy/checkout-fm-certification`,
    },

    // Email 4 - Day 3: Risk Reversal (Version B)
    {
        order: 3,
        subject: "Re: about the risk",
        delayDays: 3,
        delayHours: 0,
        content: `{{firstName}},

Let me remove the risk for you.

<strong>Here's our guarantee:</strong>

Start the certification. If within 30 days you decide it's not for you - for any reason - email us and get a full refund. No questions. No hassle. No guilt trip.

<strong>So what's the actual risk?</strong>

If it works: New career. New income. New life trajectory.
If it doesn't: You get your money back. No harm done.

The only real risk is NOT trying - and spending another year wondering "what if."

{{firstName}}, I've been where you are. Scared to invest. Scared to fail. Scared to try.

The fear doesn't go away. You just learn that it's not a reason to stop.

https://sarah.accredipro.academy/checkout-fm-certification

Here when you're ready.

Sarah`,
    },

    // Email 5 - Day 5: Clean Goodbye (Version C)
    {
        order: 4,
        subject: "Re: goodbye for now",
        delayDays: 5,
        delayHours: 0,
        content: `{{firstName}},

Sale ends tonight. This is my last email.

<strong>Quick summary of what's on the table:</strong>

- Certified Functional Medicine Practitioner training
- 21 comprehensive modules
- Client acquisition system included
- $97 today, $497 after midnight
- 30-day money-back guarantee

<strong>What students typically achieve:</strong>

- First paying clients within 90 days
- $3,000-$12,000/month income potential
- Career you actually control

The decision is yours.

If it's a yes: https://sarah.accredipro.academy/checkout-fm-certification

If it's a no: Thank you for your time. I mean that sincerely.

All the best,
Sarah`,
    },
];

/**
 * Optin-Only Sequence
 * 
 * For leads who submitted optin form but never actually chatted.
 * These are "colder" leads who need more warming up.
 * Shorter sequence, lighter touch than chat leads.
 */
export const OPTIN_ONLY_EMAILS = [
    // Email 1 - Day 1: Gentle Welcome
    {
        order: 0,
        subject: "Re: welcome (did you see this?)",
        delayDays: 1,
        delayHours: 0,
        content: `{{firstName}},

I noticed you signed up on our site yesterday. Welcome!

I wanted to reach out personally because I have a question for you:

<strong>What brought you here?</strong>

Most people who find us are feeling one of these things:
- Burned out from their current career
- Curious about health coaching but unsure where to start
- Looking for more flexibility and control over their income
- Passionate about helping people heal naturally

Does any of that resonate?

I'd love to know more about what you're looking for. Just hit reply and tell me - I read every email personally.

Sarah

P.S. In the meantime, you might want to check out our free Mini Diploma. It's a great way to see if functional medicine is right for you: https://learn.accredipro.academy/fm-mini-diploma`,
    },

    // Email 2 - Day 3: Value-First
    {
        order: 1,
        subject: "Re: quick tip for you",
        delayDays: 3,
        delayHours: 0,
        content: `{{firstName}},

Here's something I wish someone had told me years ago:

<strong>You don't need a medical degree to help people get healthy.</strong>

I spent years thinking I wasn't "qualified" enough. That I needed more credentials, more education, more experience.

What I've learned is this: people don't need another doctor. They need someone who actually listens. Someone who looks at the whole picture. Someone who cares.

That's what functional medicine practitioners do. And that's exactly what our certification teaches.

If you're curious but not sure if it's for you, start with the free Mini Diploma. It's 3 lessons, takes about 2 hours total, and gives you a real taste of what this work looks like.

https://learn.accredipro.academy/fm-mini-diploma

No commitment. Just curiosity.

Sarah`,
    },

    // Email 3 - Day 7: Story + Soft CTA
    {
        order: 2,
        subject: "Re: Maria's story (worth reading)",
        delayDays: 7,
        delayHours: 0,
        content: `{{firstName}},

Quick story I think you'll appreciate:

Maria signed up just like you did. Curious but skeptical. She'd tried "online courses" before and they were always disappointing.

She almost didn't enroll. But something kept nagging at her.

<strong>Fast forward 8 months:</strong>

Maria now runs a thriving virtual practice. She sees clients from her dining room table. She makes more than she did at her corporate job - but works half the hours.

Last week she messaged me: "I can't believe I almost didn't do this."

Maria's not special (sorry, Maria). She's just someone who finally decided to try.

If you're still curious, the door is open:

https://sarah.accredipro.academy/checkout-fm-certification

No pressure. Just possibilities.

Sarah`,
    },

    // Email 4 - Day 14: Final touch
    {
        order: 3,
        subject: "Re: last email (honest)",
        delayDays: 14,
        delayHours: 0,
        content: `{{firstName}},

This is my last scheduled email.

I don't like being one of those people who fills up your inbox with daily "reminders" and "last chance" urgency.

<strong>Here's what I know:</strong>

You signed up because something about functional medicine interested you. That interest doesn't disappear - it just gets buried under everything else in life.

If you ever decide you want to explore this path, I'm here. The links work. The training is ready. The community is waiting.

<strong>If you never do</strong> - that's okay too. I hope you find what you're looking for, whatever that looks like.

Either way, thanks for letting me into your inbox for a while.

Sarah

P.S. If you ever want to chat, I'm at sarah@accredipro.academy. Real person. Real replies.`,
    },
];

/**
 * Lead scoring keywords for chat analysis
 * Used to prioritize hot leads
 */
export const LEAD_SCORING_KEYWORDS = {
    // 🔥 HOT (10 points each) - High purchase intent
    hot: [
        "price", "cost", "pricing", "how much",
        "enroll", "sign up", "signup", "register",
        "discount", "coupon", "deal", "offer", "sale",
        "payment plan", "installment", "pay",
        "start", "begin", "ready", "today",
        "buy", "purchase", "invest",
    ],

    // 🌡️ WARM (5 points each) - Considering
    warm: [
        "certificate", "certification", "accredited",
        "time", "how long", "duration", "schedule",
        "job", "career", "income", "earn", "money",
        "work from home", "remote", "flexible",
        "clients", "patients", "practice",
        "guarantee", "refund", "risk",
    ],

    // 🌱 COOL (2 points each) - Just curious  
    cool: [
        "what is", "tell me about", "information",
        "learn", "course", "training", "program",
        "health", "nutrition", "wellness",
        "functional medicine",
    ],

    // ❄️ COLD (0 points) - May not convert soon
    cold: [
        "unsubscribe", "stop", "not interested",
        "already have", "already enrolled",
        "just looking", "maybe later",
    ],
};

/**
 * Calculate lead score from chat messages
 */
export function calculateLeadScore(messages: string[]): {
    score: number;
    level: "HOT" | "WARM" | "COOL" | "COLD";
    matchedKeywords: string[];
} {
    const allText = messages.join(" ").toLowerCase();
    let score = 0;
    const matchedKeywords: string[] = [];

    // Check each category
    for (const keyword of LEAD_SCORING_KEYWORDS.hot) {
        if (allText.includes(keyword.toLowerCase())) {
            score += 10;
            matchedKeywords.push(`🔥 ${keyword}`);
        }
    }

    for (const keyword of LEAD_SCORING_KEYWORDS.warm) {
        if (allText.includes(keyword.toLowerCase())) {
            score += 5;
            matchedKeywords.push(`🌡️ ${keyword}`);
        }
    }

    for (const keyword of LEAD_SCORING_KEYWORDS.cool) {
        if (allText.includes(keyword.toLowerCase())) {
            score += 2;
            matchedKeywords.push(`🌱 ${keyword}`);
        }
    }

    for (const keyword of LEAD_SCORING_KEYWORDS.cold) {
        if (allText.includes(keyword.toLowerCase())) {
            score -= 5;
            matchedKeywords.push(`❄️ ${keyword}`);
        }
    }

    // Determine level
    let level: "HOT" | "WARM" | "COOL" | "COLD";
    if (score >= 20) level = "HOT";
    else if (score >= 10) level = "WARM";
    else if (score >= 0) level = "COOL";
    else level = "COLD";

    return { score, level, matchedKeywords };
}

/**
 * Re-engagement message template for 24-hour silence
 */
export const REENGAGEMENT_MESSAGE = `Hey {{firstName}}! Just checking in - I noticed we were chatting yesterday but didn't finish our conversation.

Did you have any other questions I can help with? I'm here if you need me!

No pressure - just wanted to make sure you didn't miss anything. 😊`;
