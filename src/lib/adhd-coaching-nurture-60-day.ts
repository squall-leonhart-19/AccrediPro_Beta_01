/**
 * Certified ADHD Coach Mini Diploma - 60-Day Nurture Sequence
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (AD-FC™ + AD-CP™ + AD-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on ADHD coaching, executive function, neurodivergent support
 * - Sarah mentorship access
 * - My Circle Mastermind (5-person pod, DAILY check-ins)
 * - ASI Practitioner Directory listing
 * - Community access (20,000+ practitioners)
 * - LIFETIME ACCESS
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

export const ADHD_COACHING_NURTURE_SEQUENCE = [
    {
        id: 1, phase: "value", day: 0,
        subject: "Re: your Certified ADHD Coach access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands who understand that ADHD brains aren't broken - they just need the right support. Practitioners in 47 countries helping neurodivergent minds thrive.

Your Certified ADHD Coach Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified ADHD Coaches.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is calling you.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

Whether you have ADHD yourself or love someone who does - you're in the right place.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    {
        id: 2, phase: "value", day: 1,
        subject: "Re: why I'm passionate about ADHD coaching",
        content: cleanContent(`{{firstName}},

Can I tell you something personal?

I wasn't diagnosed with ADHD until I was 38.

For decades, I thought I was lazy. Undisciplined. "Too much" for people. I lost jobs, relationships, and so much self-esteem.

Every planner failed. Every system collapsed. Every promise I made to "try harder" ended in shame.

Then I got diagnosed. And then - I got COACHED.

The difference was night and day. My therapist helped me understand my past. My ADHD coach helped me BUILD MY FUTURE. She taught me systems that WORKED for my brain. Not neurotypical advice repackaged - actual ADHD strategies.

Within months, I was functioning better than I ever had. Not despite my ADHD - in many ways, BECAUSE of how I learned to work with it.

That's when I knew: I need to help others like me.

The training gave me structure. The certification gave me credibility. But the PASSION - that came from lived experience.

So tell me, {{firstName}} - what brought you here? Is it personal? Someone you love?

Hit reply. I want to hear.

${ASI_SIGNATURE}`),
    },

    {
        id: 3, phase: "value", day: 3,
        subject: "Re: why ADHD coaching is different",
        content: cleanContent(`{{firstName}},

I need to explain something important:

ADHD coaching is NOT therapy.
It's NOT medication management.
It's NOT just "being an accountability partner."

ADHD coaching is a specialized skill set for helping neurodivergent brains:
- Build systems that work WITH their wiring
- Overcome executive function challenges
- Develop emotional regulation strategies
- Create sustainable habits and routines
- Overcome shame and build self-trust

Traditional life coaching often fails people with ADHD because it assumes a neurotypical brain. "Just make a schedule!" "Just break it into steps!" "Just do it NOW!"

That advice is useless - often harmful - for ADHD brains.

Our Board Certified ADHD Coach, Katie, works with a client named Jason. Jason is brilliant - ran a successful business. But couldn't follow through on anything personal. Bills went unpaid. Relationships suffered.

Within 8 weeks of specialized ADHD coaching, Jason had systems in place that worked. Not shame-based motivation - BRAIN-BASED strategies.

This is what you're learning in your Mini Diploma.

${ASI_SIGNATURE}`),
    },

    {
        id: 4, phase: "value", day: 5,
        subject: "Re: transformation I witnessed this week",
        content: cleanContent(`{{firstName}},

I have to share what happened this week.

Katie, one of our Board Certified ADHD Coaches, sent me this:

"Sarah, my client just got promoted. SIX MONTHS AGO she was on a performance improvement plan at work - she couldn't meet deadlines, forgot meetings, was overwhelmed constantly. After working together on ADHD-specific strategies, she's thriving. Her boss said she's 'like a different person.' She's not different - she just finally has the right support."

This is what ADHD coaching does.

It doesn't "fix" people. It helps them stop fighting against their brains and start working WITH them.

Katie helps clients through:
- Executive function coaching
- External structure building
- Emotional regulation techniques
- Time blindness strategies
- Rejection sensitivity support

The transformation is real.

{{firstName}}, keep going with your lessons. We need more coaches who GET IT.

${ASI_SIGNATURE}`),
    },

    {
        id: 5, phase: "value", day: 7,
        subject: "Re: how's it going?",
        content: cleanContent(`{{firstName}},

It's been a week since you started your Certified ADHD Coach Mini Diploma.

What's resonating with you?

Common answers:

1. "I finally understand WHY my brain (or my kid's brain) works this way"
2. "The difference between therapy and coaching clicked"
3. "These strategies actually make sense for ADHD"

What about you?

Hit reply and share one thing that made you go "yes!"

${ASI_SIGNATURE}

P.S. If you haven't started yet - I get it. ADHD is ironic like that. But try 10 minutes. Just start.`),
    },

    {
        id: 6, phase: "value", day: 10,
        subject: "Re: a technique for executive function",
        content: cleanContent(`{{firstName}},

Quick ADHD coaching technique:

The "External Brain" strategy.

ADHD brains struggle with working memory. We forget things the moment we look away. So instead of fighting it - EXTERNALIZE.

- If it's not written down, it doesn't exist
- Use visual cues (sticky notes where you'll see them)
- Set alarms for EVERYTHING (including alarms to remind you to set alarms)
- Never trust "I'll remember" - you won't

I teach my clients: "Your brain is not a storage unit. It's a processor. Give it external hard drives."

This single shift changes everything.

Try it this week. Notice what happens.

${ASI_SIGNATURE}`),
    },

    {
        id: 7, phase: "value", day: 12,
        subject: "Re: checking in",
        content: cleanContent(`{{firstName}},

How's your ADHD coaching journey going?

If you're making progress - amazing.

If you got distracted, started 5 other things, and are just seeing this email - welcome back. No judgment. I understand.

The women who complete this Mini Diploma tell me it changes how they see ADHD. Not as a deficit - as a DIFFERENCE that needs different support.

What can I help you with?

${ASI_SIGNATURE}

P.S. Reply "DONE" if you've finished, and I'll share what's next.`),
    },

    {
        id: 8, phase: "value", day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

Two weeks since you started.

Wherever you are:

If finished: You now understand ADHD coaching at a deeper level than most. Your brain understands these challenges - that's your superpower.

If in progress: Keep going at YOUR pace. There's no "behind."

I see your potential.
I believe in your calling.
I'm here.

${ASI_SIGNATURE}`),
    },

    // PHASE 2: DESIRE
    {
        id: 9, phase: "desire", day: 15,
        subject: "Re: Katie's story",
        content: cleanContent(`{{firstName}},

Let me tell you about Katie.

Katie has ADHD herself. For years, she thought that disqualified her from helping others. "How can I coach when I can't even organize my own life?"

Then she realized: her LIVED EXPERIENCE was her greatest asset.

She got certified through ASI.

Month 1: Finally understood frameworks that worked for HER brain - and could teach others.
Month 2: Started coaching friends. They saw results fast.
Month 3: Four paying clients at $150/session.
Month 6: Thriving practice. Mostly ADHD adults who'd given up on traditional coaching.

Today: Katie sees 12 clients weekly. She works from home. She uses ADHD-friendly systems. She makes $6,000+/month.

Before: "Katie - struggling with ADHD"
After: "Katie, AD-BC - Board Certified ADHD Coach"

Her lived experience became her credential.

${ASI_SIGNATURE}`),
    },

    {
        id: 10, phase: "desire", day: 18,
        subject: "Re: what my days look like",
        content: cleanContent(`{{firstName}},

My typical day as an ADHD coach:

9:00am - First session. A college student struggling with executive function.
10:30am - Second session. A professional woman diagnosed later in life.
12:00pm - Movement break. ADHD brains need transitions.
1:00pm - Mastermind check-in. My 5 fellow coaches.
2:00pm - Last session. A mom learning to support her ADHD child.
3:00pm - Done.

Short sessions. Movement breaks. Done by early afternoon.

Why? Because I designed my practice for MY ADHD brain.

That's the beauty - you create what works for YOU.

${ASI_SIGNATURE}`),
    },

    {
        id: 11, phase: "desire", day: 21,
        subject: "Re: questions answered",
        content: cleanContent(`{{firstName}},

Your questions, answered:

"Is ADHD coaching recognized?"
ASI credentials are CMA, CPD, IPHM recognized. Public verification available.

"Do I need to have ADHD?"
No. But if you do, it's an asset, not a liability.

"Will people pay for this?"
ADHD coaching is in HIGH demand. 73% of our practitioners say demand exceeds capacity. There aren't enough coaches who GET it.

"Am I too scattered to coach others?"
You're not too scattered. You're undertrained. The certification teaches systems that work for ADHD brains - including yours.

"What if I can't finish the training?"
It's self-paced. No deadlines. And the irony of ADHD coaches not finishing ADHD training isn't lost on us - we designed it FOR you.

${ASI_SIGNATURE}`),
    },

    {
        id: 12, phase: "desire", day: 24,
        subject: "Re: the support you need",
        content: cleanContent(`{{firstName}},

Here's what nobody tells you about ADHD coaching:

It's lonely doing it alone.

Who do you talk to about strategies?
Who understands when a client ghosts because... ADHD?
Who holds YOU accountable?

That's why we have My Circle Mastermind.

5 fellow ADHD coaches. Your pod.

Daily:
- Body doubling accountability
- Strategy sharing
- Client discussions
- Mutual support

Women who GET IT. Who understand when you say "I lost track of time" or "my brain won't start."

This is your tribe.

${ASI_SIGNATURE}`),
    },

    {
        id: 13, phase: "desire", day: 27,
        subject: "Re: two paths",
        content: cleanContent(`{{firstName}},

One year from now:

PATH A: Same life. Still fascinated by ADHD. Still not coaching.

PATH B: Board Certified. AD-FC, AD-CP, AD-BC.

"I'm {{firstName}}, AD-BC - Board Certified ADHD Coach."

10+ clients. $4,000-$7,000/month. Actually helping people like you.

Both futures take 365 days.

${ASI_SIGNATURE}`),
    },

    {
        id: 14, phase: "desire", day: 30,
        subject: "Re: ready to get certified?",
        content: cleanContent(`{{firstName}},

Complete Career Certification - $297

3 levels: AD-FC, AD-CP, AD-BC
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
        subject: "Re: the path",
        content: cleanContent(`{{firstName}},

Board Certified ADHD Coach path:

Level 1: AD-FC - Foundation
Level 2: AD-CP - Practitioner
Level 3: AD-BC - Board Certified

Plus Mastermind, directory, bonuses, lifetime access.

$297 / $150 = 2 clients to break even.

${ASI_SIGNATURE}`),
    },

    {
        id: 16, phase: "decision", day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

$297.

Other ADHD coaching programs: $2,000-$7,000.
Traditional ICF certification: $5,000+.

You get: 3 levels, certification, Mastermind, directory, bonuses, lifetime access.

2 clients = break even.

Katie made $600 her first month.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 17, phase: "decision", day: 36,
        subject: "Re: the credential",
        content: cleanContent(`{{firstName}},

Before: "{{firstName}} - interested in ADHD"
After: "{{firstName}}, AD-BC - Board Certified ADHD Coach"

Credential. Directory listing. Mastermind support.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 18, phase: "decision", day: 38,
        subject: "Re: objections",
        content: cleanContent(`{{firstName}},

"I can't focus long enough to finish." - Self-paced. Bite-sized. ADHD-friendly design.
"$297 is hard." - 2 clients covers it.
"I'm too disorganized." - The training TEACHES organization for ADHD brains.
"What if I forget clients?" - We teach external systems.

What's really stopping you?

${ASI_SIGNATURE}`),
    },

    {
        id: 19, phase: "decision", day: 40,
        subject: "Re: the Mastermind",
        content: cleanContent(`{{firstName}},

My Circle Mastermind: 5 fellow ADHD coaches.

Daily check-ins. Body doubling. Lifetime bonds.

"The Mastermind keeps me accountable. ADHD brains need external support - this IS mine." - Katie

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 20, phase: "decision", day: 42,
        subject: "Re: testimonials",
        content: cleanContent(`{{firstName}},

KATIE, 39: "12 clients weekly. This is the first thing I've finished in years."
JASON'S COACH: "My clients' lives transform. So did mine."
PARENT COACH: "I help parents understand their ADHD kids. I wish my parents had this."

They decided. You can too.

${ASI_SIGNATURE}`),
    },

    {
        id: 21, phase: "decision", day: 44,
        subject: "Re: the call",
        content: cleanContent(`{{firstName}},

That pull toward ADHD coaching? It doesn't go away.

People who understand ADHD are desperately needed.

$297. Two clients. A lifetime of purpose.

https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // PHASE 4: RE-ENGAGE
    {
        id: 22, phase: "re-engage", day: 48,
        subject: "Re: still here",
        content: cleanContent(`{{firstName}},

Still here. Door open.

Did you forget about this? It's okay - ADHD brain. Consider this your reminder.

When you're ready, I'm here.

${ASI_SIGNATURE}`),
    },

    {
        id: 23, phase: "re-engage", day: 52,
        subject: "Re: a technique",
        content: cleanContent(`{{firstName}},

Quick strategy:

"Habit stacking" - attach new behaviors to existing routines.

Already brush your teeth? Put your vitamins next to your toothbrush.
Already make coffee? Put your planner next to the coffee maker.

Don't create new routines - piggyback on existing ones.

ADHD-friendly. Works.

${ASI_SIGNATURE}`),
    },

    {
        id: 24, phase: "re-engage", day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

Thought of you today.

Something called you to ADHD coaching.

Still calling?

Reply if you want to chat.

${ASI_SIGNATURE}`),
    },

    {
        id: 25, phase: "re-engage", day: 60,
        subject: "Re: final note",
        content: cleanContent(`{{firstName}},

Last scheduled message.

Your interest in ADHD coaching is valid. Your potential is real. Whether you pursue certification or not.

If someday the time is right: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

You've got this.

${ASI_SIGNATURE}`),
    },
];

export type ADHDCoachingNurtureEmail = typeof ADHD_COACHING_NURTURE_SEQUENCE[number];
