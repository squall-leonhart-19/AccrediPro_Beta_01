/**
 * Women's Health Nurture Email Sequence
 * 
 * Post-completion nurture for WH Mini Diploma graduates.
 * Leads them toward Career Accelerator with $1,000 scholarship offer.
 * 
 * Sent AFTER the 24h certificate email (so starting Day 2 post-completion)
 */

export const WH_NURTURE_EMAILS = [
    // Email 1 - Day 2: The Bigger Picture
    {
        order: 0,
        delayDays: 2,
        subject: "Re: now that you've got your certificate...",
        content: `{{firstName}},

Congratulations again on completing your Women's Health Mini Diploma!

Now I want to ask you something important:

What are you going to DO with this knowledge?

Because here's the thing...

You just learned what 90% of women (and even most doctors) don't understand about hormones, cycles, and women's health.

You could:
- Use it for yourself and your family (totally valid!)
- Help friends who are struggling
- Or... turn it into something bigger

I've seen women take exactly what you just learned and build $5,000-$15,000/month practices helping other women.

Not because they had fancy degrees. But because they had the RIGHT knowledge and knew how to use it.

Is that something you'd want to explore?

Just reply with "." if you're curious. I'll send you the roadmap.

Sarah`
    },

    // Email 2 - Day 4: Michelle's Story
    {
        order: 1,
        delayDays: 4,
        subject: "Re: she started exactly where you are",
        content: `{{firstName}},

Let me tell you about Michelle.

She completed the same Mini Diploma you just finished. Same starting point. Same doubts.

"I'm not a doctor."
"Who would pay ME for health advice?"
"I'm too old to start something new."

Sound familiar?

Here's what happened:

MONTH 1: She got certified through our Career Accelerator. Same foundation you have, just deeper.

MONTH 2: Her first client found her through a Facebook post. $200 for a 90-minute session.

MONTH 3: That client told her sister. And her coworker. And her neighbor.

MONTH 6: $6,400/month. All from her dining room table.

TODAY: She has a waitlist. Charges $350/session. Works 20 hours a week.

Michelle isn't special. She's just like you - curious about women's health, tired of the system that fails women, wanting something more.

The difference? She took the next step.

Want to know what that step looked like?

Reply "." and I'll show you.

Sarah

PS: Michelle still references the Mini Diploma content. She calls it "the foundation everything else is built on."`
    },

    // Email 3 - Day 6: The Income Reality
    {
        order: 2,
        delayDays: 6,
        subject: "Re: the income question",
        content: `{{firstName}},

Let's talk numbers.

I know you're wondering: "Can I actually make money doing this?"

Here's the reality:

Our certified practitioners charge between $150-$500 per session.

Most see 3-5 clients per week when starting out.

Do the math:
- 4 clients/week × $200/session = $3,200/month
- 4 clients/week × $350/session = $5,600/month
- 6 clients/week × $400/session = $9,600/month

And that's 1:1 only. Add group programs? Online courses? Corporate wellness?

It scales.

"But Sarah, where do I find clients?"

You already know them.

Your sister with the hormone issues.
Your friend with the exhaustion her doctor can't explain.
Your coworker with the thyroid symptoms.

They're LOOKING for someone like you. Someone who actually listens. Someone who understands root causes.

You're closer than you think.

Want the full breakdown of how this works?

Reply "." and I'll send the Career Accelerator details.

Sarah`
    },

    // Email 4 - Day 9: The Objection Email
    {
        order: 3,
        delayDays: 9,
        subject: "Re: the thing holding you back",
        content: `{{firstName}},

Can I be honest with you?

If you're still reading these emails, you're interested. But something's holding you back.

Let me guess:

"I don't have time."
- The Career Accelerator is self-paced. 5-7 hours/week. Study at 5am or 11pm. Your choice.

"I can't afford it."
- You have a $1,000 graduate scholarship. Plus payment plans exist.

"I'm not qualified."
- You just proved you can learn this. The full certification goes deeper, not harder.

"What if I fail?"
- 30-day guarantee. If it's not for you, full refund. Zero risk.

"Who would hire ME?"
- Women are desperate for practitioners who understand what you already understand. They'll find YOU.

Here's what I know, {{firstName}}:

The only real thing holding you back is the decision.

Everything else is noise.

Ready to cut through it?

Reply "." and let's talk about what's really going on.

Sarah`
    },

    // Email 5 - Day 12: The Scholarship Deadline
    {
        order: 4,
        delayDays: 12,
        subject: "Re: your $1,000 scholarship",
        content: `{{firstName}},

Quick reminder:

Your $1,000 Graduate Scholarship doesn't last forever.

As a Mini Diploma graduate, you unlocked this special offer to the Career Accelerator program.

What you get:
- Full certification (21 modules)
- Practice-building training
- Done-for-you client systems
- Community of practitioners
- Lifetime access

Normal price: $3,997
Your graduate price: $2,997 (save $1,000)

Payment plans available if needed.

This isn't pressure. It's information.

The scholarship is real. The deadline is real.

If you're in, you're in. If not, no hard feelings.

But don't let this expire and then email me saying "I wish I'd done it."

I'd rather you decide now, one way or the other.

Message me in the portal or reply here if you have questions.

Sarah

PS: If cost is genuinely the barrier, reply and tell me. We might be able to work something out.`
    },

    // Email 6 - Day 15: Final Soft Touch
    {
        order: 5,
        delayDays: 15,
        subject: "Re: still thinking about it?",
        content: `{{firstName}},

This is my last email about the Career Accelerator.

I don't want to be annoying. If this isn't for you right now, I respect that.

But before I stop asking, I want you to imagine something:

It's 6 months from now.

You took the leap. You got certified.

You have 4 clients who adore you. Women who've been dismissed by doctors for years. Women who finally feel heard.

You're earning $3,000-$5,000/month on your schedule.

Your family is proud. Your clients are grateful. YOU are fulfilled.

How does that feel?

Now imagine the other path.

6 months from now. Nothing's changed. Same job. Same frustrations. Same "I'll do it later."

Which version do you want?

If it's version one, you know what to do.

Go to your portal. Look at the Career Accelerator offer. Use your scholarship before it expires.

Or just reply "ready" and I'll personally walk you through enrollment.

Whatever you decide, I'm proud of you for finishing the Mini Diploma.

Sarah`
    },
];

export type WHNurtureEmail = typeof WH_NURTURE_EMAILS[number];
