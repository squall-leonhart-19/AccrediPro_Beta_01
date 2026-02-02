/**
 * Certified Reiki Practitioner Mini Diploma - 60-Day Nurture Sequence
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (RK-FC™ + RK-CP™ + RK-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on Reiki principles, energy channeling, distance healing
 * - Sarah mentorship access
 * - My Circle Mastermind (5-person pod, DAILY check-ins)
 * - ASI Practitioner Directory listing
 * - Community access (20,000+ practitioners)
 * - LIFETIME ACCESS
 * 
 * Phase 1 (Days 0-14): VALUE - Build trust, NO selling
 * Phase 2 (Days 15-30): DESIRE - Show transformation
 * Phase 3 (Days 31-45): DECISION - Clear $297 offer
 * Phase 4 (Days 46-60): RE-ENGAGE - Stay connected
 */

function cleanContent(content: string): string {
    return content
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/—/g, '-')
        .trim();
}

const ASI_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

export const REIKI_HEALING_NURTURE_SEQUENCE = [
    {
        id: 1, phase: "value", day: 0,
        subject: "Re: your Certified Reiki Practitioner access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands who've begun this beautiful journey - practitioners in 47 countries who understand the healing power of universal life force energy.

Your Certified Reiki Practitioner Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Reiki Masters.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll feel the energy of this path calling you forward.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

The universe brought you to Reiki for a reason. Let's discover it together.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    {
        id: 2, phase: "value", day: 1,
        subject: "Re: my first Reiki experience",
        content: cleanContent(`{{firstName}},

Can I share something personal?

The first time I received Reiki, I was skeptical. Deeply skeptical.

A friend had been raving about it for months. "Just try it," she said. "What do you have to lose?"

I went thinking I'd prove it was nothing. That I'd feel nothing.

Instead, within minutes of the practitioner placing her hands near my head, I felt HEAT. Real, tangible warmth flowing through me. My mind quieted. My body relaxed. And tears started streaming down my face - not from sadness, but from... release.

Something shifted that I couldn't explain. Pain I'd carried for years suddenly felt lighter.

That was the day I went from skeptic to believer. And eventually, from believer to practitioner.

The training gave me structure. The certification gave me credibility. But the CONNECTION to Reiki energy - that was already there waiting to be activated.

Just like it's waiting in you.

So tell me, {{firstName}} - what drew you to Reiki? What's your story?

Hit reply. I genuinely want to know.

${ASI_SIGNATURE}`),
    },

    {
        id: 3, phase: "value", day: 3,
        subject: "Re: the science behind Reiki",
        content: cleanContent(`{{firstName}},

You might be wondering: Is Reiki actually real?

Here's what we know:

The human body generates electromagnetic fields. Your heart alone creates an electrical field measurable feet away. Research at institutions like Cleveland Clinic has studied biofield therapies. Studies show Reiki reduces anxiety, decreases pain perception, and promotes relaxation.

But beyond science - there are millions of personal testimonies. Including mine.

I worked with a woman named Patricia who'd had chronic migraines for 15 years. Doctors, medications, specialists - nothing helped for long.

In our first session, I could feel energy blockage around her neck and temples. Stuck energy that needed to flow.

Three sessions later, her migraines decreased by 70%.

Was it placebo? Was it energy? Does it matter, if it WORKS?

This is what you're learning in your Mini Diploma. Real techniques. Real energy. Real results.

${ASI_SIGNATURE}`),
    },

    {
        id: 4, phase: "value", day: 5,
        subject: "Re: something beautiful this week",
        content: cleanContent(`{{firstName}},

I have to share what one of our practitioners experienced.

Maya, who got certified 8 months ago, sent me this:

"Sarah, my client just finished her fourth session. When she came to me, she hadn't slept more than 4 hours straight in years. Last night she slept 8 hours. She WOKE UP RESTED. She burst into tears and said 'I forgot what this felt like.' This is why I do Reiki."

This is the gift of Reiki.

Not replacing medicine. Not making claims we can't keep. Simply: channeling universal energy to support the body's natural healing process.

Maya helps her clients through:
- Relaxation response activation
- Energy blockage clearing
- Stress and tension release
- Support for emotional processing

The results speak for themselves.

{{firstName}}, keep going with your lessons. This sacred practice is waiting for you.

${ASI_SIGNATURE}`),
    },

    {
        id: 5, phase: "value", day: 7,
        subject: "Re: how are you feeling?",
        content: cleanContent(`{{firstName}},

It's been a week since you started your Certified Reiki Practitioner Mini Diploma.

What's resonating with you so far?

Common answers I hear:

1. "I finally understand what Reiki actually IS"
2. "The hand positions make so much sense now"
3. "I can feel energy when I tune in - it's real"

What about you?

Hit reply and share one thing that clicked.

${ASI_SIGNATURE}

P.S. If you haven't started yet, no judgment. But try to carve out 15 minutes this week. Reiki will meet you where you are.`),
    },

    {
        id: 6, phase: "value", day: 10,
        subject: "Re: a simple self-Reiki practice",
        content: cleanContent(`{{firstName}},

Quick Reiki tip you can use today:

Place your hands gently over your heart. Close your eyes. Set the intention to channel universal life force energy to yourself.

Breathe slowly. Feel the warmth building in your palms. Stay here for 2-3 minutes.

Notice: Are your hands getting warmer? Do you feel gentle pulsing? Is your body relaxing?

This is self-Reiki. Simple. Powerful. Available anytime.

At ASI, we teach self-practice FIRST because a practitioner who can't give themselves Reiki can't truly give it to others.

Try this daily for a week. Notice what shifts.

${ASI_SIGNATURE}`),
    },

    {
        id: 7, phase: "value", day: 12,
        subject: "Re: checking in",
        content: cleanContent(`{{firstName}},

How's your Reiki journey going?

If you're flowing through the lessons - wonderful.

If life got in the way - Reiki understands. It's patient.

The women who complete this Mini Diploma tell me they feel something "click" - like remembering something they always knew.

Even 10 minutes at a time counts.

What can I help you with?

${ASI_SIGNATURE}

P.S. Reply "DONE" if you've finished, and I'll share what's next.`),
    },

    {
        id: 8, phase: "value", day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started.

I want to acknowledge: learning Reiki asks you to trust something you can't see. That takes courage.

Wherever you are:

If you've finished: I'm honored. You now understand Reiki at a deeper level than most ever will.

If you're in progress: Keep going. The energy is guiding you.

I see your potential.
I believe in your gifts.
I'm here.

${ASI_SIGNATURE}`),
    },

    // PHASE 2: DESIRE
    {
        id: 9, phase: "desire", day: 15,
        subject: "Re: Maya's transformation",
        content: cleanContent(`{{firstName}},

Let me tell you about Maya.

Maya was a graphic designer. Creative, successful, stressed.

She'd always been drawn to healing but thought "that's not me." Until she couldn't ignore it anymore.

Then she got certified through ASI.

Month 1: Terrified but excited. Finally had permission to explore her gifts.
Month 2: Started offering sessions to friends. Word spread fast.
Month 3: Five paying clients. $175 each.
Month 6: Transitioned out of design.

Today: Maya sees 15 clients weekly. Works from a peaceful home studio. Makes more than she did in corporate.

Before: "Maya - Graphic Designer"
After: "Maya, RK-BC - Board Certified Reiki Practitioner"

That credential changed everything.

Do you see yourself in her?

${ASI_SIGNATURE}`),
    },

    {
        id: 10, phase: "desire", day: 18,
        subject: "Re: my daily practice",
        content: cleanContent(`{{firstName}},

What my days look like now:

7:00am - Self-Reiki. Meditation. Prepare my energy.
8:00am - Mastermind pod check-in. Daily intentions with my 5.
9:00am - First client. Distance Reiki for someone across the country.
10:30am - In-person session. A woman processing grief.
12:00pm - Lunch. Rest.
2:00pm - Final session of the day.
3:00pm - Done. Present for my life.

No commute. No office politics. No soul-drain.

"I'm Sarah, a Board Certified Reiki Practitioner."

That sentence represents freedom.

${ASI_SIGNATURE}`),
    },

    {
        id: 11, phase: "desire", day: 21,
        subject: "Re: your questions answered",
        content: cleanContent(`{{firstName}},

Questions you might have:

"Is Reiki certification legitimate?"
ASI credentials are recognized by CMA, CPD, IPHM. Public verification available.

"Will people pay for Reiki?"
73% of our practitioners say demand exceeds capacity.

"Do I need special abilities?"
Everyone can channel Reiki. It's not about being gifted - it's about being open.

"Am I too old/new?"
Our average age is 47. Maya started at 41.

"What if no one believes in it?"
They don't need to believe. They need to FEEL.

The only obstacle is not starting.

${ASI_SIGNATURE}`),
    },

    {
        id: 12, phase: "desire", day: 24,
        subject: "Re: the circle that supports you",
        content: cleanContent(`{{firstName}},

What nobody tells you about becoming a Reiki practitioner:

It can feel isolating.

Your old friends don't understand.
You're holding space for others - but who holds space for YOU?

That's why we created My Circle Mastermind.

5 fellow Reiki practitioners. Your sacred circle.

Daily:
- Morning energy check-ins
- Session discussions
- Support and celebration

This is YOUR 5. Women who understand.

No one succeeds alone.

${ASI_SIGNATURE}`),
    },

    {
        id: 13, phase: "desire", day: 27,
        subject: "Re: two paths",
        content: cleanContent(`{{firstName}},

One year from now. Two possibilities:

PATH A: Same life. Same wondering. Reiki still calling but unanswered.

PATH B: Board Certified. RK-FC, RK-CP, RK-BC complete.

"Hi, I'm {{firstName}}, RK-BC - Board Certified Reiki Practitioner."

12 clients weekly. $5,000+/month. Work that fills your soul.

Both futures take 365 days.

The difference is your decision now.

${ASI_SIGNATURE}`),
    },

    {
        id: 14, phase: "desire", day: 30,
        subject: "Re: an invitation",
        content: cleanContent(`{{firstName}},

Complete Career Certification - $297

3 levels: RK-FC, RK-CP, RK-BC
25+ lessons
My Circle Mastermind
ASI Directory listing
All bonuses
LIFETIME access

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // PHASE 3: DECISION
    {
        id: 15, phase: "decision", day: 31,
        subject: "Re: the complete path",
        content: cleanContent(`{{firstName}},

Path to Board Certified Reiki Practitioner:

Level 1: RK-FC - Foundation
Level 2: RK-CP - Practitioner
Level 3: RK-BC - Board Certified

Plus Mastermind, directory, bonuses, lifetime access.

$297 / $150 = 2 clients to break even.

${ASI_SIGNATURE}`),
    },

    {
        id: 16, phase: "decision", day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

$297.

Traditional Reiki training: $500-$2,000 per level.
Other programs: $997-$3,000.

You get: 3 levels, certification, Mastermind, directory, bonuses, lifetime access.

2 clients = break even.

Maya made $525 her first month.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 17, phase: "decision", day: 36,
        subject: "Re: the credential",
        content: cleanContent(`{{firstName}},

Before: "{{firstName}} - Reiki curious"
After: "{{firstName}}, RK-BC - Board Certified Reiki Practitioner"

Professional credential. ASI Directory listing. Daily Mastermind support.

Public verification at accredipro.com/verify.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 18, phase: "decision", day: 38,
        subject: "Re: what's stopping you",
        content: cleanContent(`{{firstName}},

"No time." - Self-paced. Most finish in 8-12 weeks.
"$297 is money." - 2 clients = covered.
"Not sure I'm sensitive enough." - Reiki sensitivity develops with practice.
"What if nobody pays?" - 73% say demand exceeds capacity.

What's really stopping you?

Reply. Let's talk.

${ASI_SIGNATURE}`),
    },

    {
        id: 19, phase: "decision", day: 40,
        subject: "Re: the Mastermind",
        content: cleanContent(`{{firstName}},

My Circle Mastermind: 5 fellow Reiki practitioners.

Daily check-ins.
Energy support.
Lifetime bonds.

"The Mastermind alone is worth $297." - Maya

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 20, phase: "decision", day: 42,
        subject: "Re: what practitioners say",
        content: cleanContent(`{{firstName}},

MAYA, 44: "15 clients weekly. More fulfilled than ever."
PATRICIA, 52: "Clients travel from other states for my sessions."
JENNIFER, 38: "Left my corporate job. No regrets."

They decided. You can too.

${ASI_SIGNATURE}`),
    },

    {
        id: 21, phase: "decision", day: 44,
        subject: "Re: the call doesn't fade",
        content: cleanContent(`{{firstName}},

That pull toward Reiki? It doesn't go away.

Women who waited say: "I wish I'd started sooner."

$297. Two clients to break even. A lifetime of purpose.

If you feel it: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // PHASE 4: RE-ENGAGE
    {
        id: 22, phase: "re-engage", day: 48,
        subject: "Re: still here",
        content: cleanContent(`{{firstName}},

Still here. Door still open. Reiki still waiting.

When you're ready, I'll be here.

${ASI_SIGNATURE}`),
    },

    {
        id: 23, phase: "re-engage", day: 52,
        subject: "Re: a gift for you",
        content: cleanContent(`{{firstName}},

Quick Reiki technique:

Place hands over your solar plexus. Intend universal energy to flow. Breathe. Feel warmth. Stay 3 minutes.

Simple. Powerful. Yours.

${ASI_SIGNATURE}`),
    },

    {
        id: 24, phase: "re-engage", day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

Thinking of you today.

That first moment you signed up - something called you.

Still calling.

If you want to talk about anything, reply.

${ASI_SIGNATURE}`),
    },

    {
        id: 25, phase: "re-engage", day: 60,
        subject: "Re: final thought",
        content: cleanContent(`{{firstName}},

Last scheduled message.

Reiki found you for a reason. Your gifts are real. Your calling is real.

If someday the time is right: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

With love and light,

${ASI_SIGNATURE}`),
    },
];

export type ReikiHealingNurtureEmail = typeof REIKI_HEALING_NURTURE_SEQUENCE[number];
