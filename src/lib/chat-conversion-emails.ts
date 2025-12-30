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
 * Optin-Only Sequence (Scaffold)
 * 
 * For leads who submitted the optin form but never actually chatted.
 * These are "colder" leads who need more warming up.
 * 
 * TODO: Add email content later
 */
export const OPTIN_ONLY_EMAILS: Array<{
    order: number;
    subject: string;
    delayDays: number;
    delayHours: number;
    content: string;
}> = [
        // Placeholder - emails to be written later
    ];
