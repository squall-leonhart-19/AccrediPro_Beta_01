/**
 * Certified Energy Healing Practitioner Mini Diploma - 60-Day Nurture Sequence
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (EH-FC™ + EH-CP™ + EH-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on energy work, aura cleansing, chakra balancing, Reiki foundations
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
 * 
 * Target: US Women 35-55+ seeking energy healing careers
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

export const ENERGY_HEALING_NURTURE_SEQUENCE = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Certified Energy Healing Practitioner access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands of women who've started this transformative journey - practitioners in 47 countries who understand that everything is energy - and energy can be healed.

Your Certified Energy Healing Practitioner Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Master Practitioners in energy medicine.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if energy healing is your calling.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

Energy flows where attention goes. You put your attention here for a reason.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    {
        id: 2,
        phase: "value",
        day: 1,
        subject: "Re: my first experience with energy healing",
        content: cleanContent(`{{firstName}},

Can I tell you about the first time I experienced real energy healing?

I was skeptical. Deeply skeptical.

I'd heard the words - chakras, auras, energy blockages - and honestly? I thought it was a bit out there.

But I was also desperate. Chronic pain that doctors couldn't explain. Fatigue that sleep couldn't fix. A heaviness I couldn't shake.

A friend dragged me to an energy healing session. "Just try it," she said.

Fifteen minutes in, the practitioner - without me saying a word - put her hands near my heart and said: "There's a lot of grief here. Old grief. You're still carrying it."

I burst into tears. Because she was right. Grief I'd never processed. Pain I'd buried.

Over the next hour, something shifted. Not in my imagination - in my BODY. The heaviness lifted. The pain decreased.

That was the day I went from skeptic to believer. And eventually, from believer to practitioner.

So tell me, {{firstName}} - what brought you to energy healing? What's calling you to this work?

Hit reply. I genuinely want to know.

${ASI_SIGNATURE}`),
    },

    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: the science behind energy healing",
        content: cleanContent(`{{firstName}},

I need to tell you something that might surprise you.

Energy healing isn't just "woo-woo." There's actual science behind it.

Every cell in your body produces electromagnetic energy. Your heart generates an electrical field that can be measured FEET away from your body. Research at the HeartMath Institute has documented how one person's energy field affects another's.

When you feel "drained" around certain people? That's not imagination. It's measurable.

When you sense "heavy" energy in a room? That's not imagination either.

Energy practitioners are trained to sense, assess, and shift these energy patterns. We don't guess - we're taught systematic approaches to identify where energy is blocked and how to restore flow.

Our Board Certified practitioner, Rebecca, worked with a woman named Lisa who'd had chronic fatigue for 7 years. Doctors found nothing wrong.

In their first session, Rebecca identified significant energy blockages around Lisa's throat and solar plexus - related to years of not speaking her truth and suppressing her power.

Three sessions later, Lisa's energy was transformed. The "unexplainable" fatigue? Finally lifting.

This is what you're learning in your Mini Diploma. Real techniques. Real results.

${ASI_SIGNATURE}`),
    },

    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: incredible breakthrough this week",
        content: cleanContent(`{{firstName}},

I have to share what happened with one of our practitioners this week.

Amanda, who got her Board Certification 8 months ago, sent me this:

"Sarah, my client just finished her 6th session. When she started, she could barely leave her house - crippling anxiety, no energy, isolated for years. Today she told me she went to a community event. On her own. And actually ENJOYED it. She said something shifted at the energetic level that therapy never touched."

This is why energy healing matters.

Traditional approaches address the mind. Medicine addresses the body. But humans are also ENERGY beings. And when the energy system is blocked, ignored, or damaged - nothing else fully works.

Amanda helps her clients by:
- Clearing energy blockages in the subtle body
- Balancing chakras that are over or under-active
- Releasing stored trauma from the energy field
- Teaching clients to maintain their own energy hygiene

The results speak for themselves.

{{firstName}}, keep going with your lessons. This knowledge changes everything.

${ASI_SIGNATURE}`),
    },

    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

It's been a week since you started your Certified Energy Healing Practitioner Mini Diploma.

What's resonating most with you so far?

When I ask our practitioners this question, the most common answers are:

1. "I always felt energy but didn't have words for it - now I do"
2. "The chakra system explanation finally made sense"
3. "I realize I've been doing energy work intuitively my whole life"

What about you?

Just hit reply and share one thing that clicked.

${ASI_SIGNATURE}

P.S. If you haven't started yet, no judgment. But try to carve out 15 minutes this week. The first lesson alone will shift your understanding.`),
    },

    {
        id: 6,
        phase: "value",
        day: 10,
        subject: "Re: a grounding technique you need",
        content: cleanContent(`{{firstName}},

Quick energy healing tip that transforms everything:

Most people try to do energy work while ungrounded.

It's like trying to channel electricity without a ground wire. Unstable. Draining. Sometimes even dangerous.

Signs you're ungrounded:
- Feeling spacey or scattered
- Unable to focus for long
- Easily overwhelmed by others' emotions
- Fatigue after being around people

Here's a quick grounding practice:

Stand or sit with feet flat on floor. Visualize roots growing from your feet, reaching deep into the earth's core. Feel the earth's stable energy rising up through those roots, filling your body. You become a channel - anchored, stable, clear.

30 seconds. Transforms everything.

This is Lesson 4 material, but I wanted you to have it now.

At ASI, we teach grounding FIRST because it protects both practitioner and client. It's why our certified healers don't burn out.

Try it daily this week. Notice the difference.

${ASI_SIGNATURE}`),
    },

    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How's your energy healing journey going?

If you're flowing through the lessons - wonderful. You're joining thousands who've completed this training.

If life interrupted - that's okay. Energy work happens at its own pace.

The women who complete this Mini Diploma tell me: "I finally understand what I've been feeling my whole life."

That understanding is worth everything.

Even 10 minutes at a time counts. Energy builds.

What can I help you with right now?

${ASI_SIGNATURE}

P.S. If you've finished - reply "DONE" and I'll share what's next on your path.`),
    },

    {
        id: 8,
        phase: "value",
        day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started your Certified Energy Healing Practitioner journey.

I want to acknowledge something:

Learning to work with energy requires opening parts of yourself you may have kept closed. It takes courage.

So wherever you are right now...

If you've finished: I'm honored to witness your awakening. You now understand energy healing at a deeper level than most ever will.

And {{firstName}} - you're not the same person who started two weeks ago. Something calibrated in you.

If you're still in progress: Keep going. Each lesson builds on the last.

Whatever camp you're in:

I see your potential.
I believe in your gifts.
I'm here if you need anything.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 15-30)
    // ============================================

    {
        id: 9,
        phase: "desire",
        day: 15,
        subject: "Re: how Amanda transformed her life",
        content: cleanContent(`{{firstName}},

I want to tell you about Amanda's journey.

Amanda was a massage therapist for 15 years. Good at her work, but something was missing.

Clients would say things like: "I felt something more than just the massage" or "How do you do that with your hands?"

She didn't know how to answer. She just knew SOMETHING was happening beyond the physical.

Then she got certified in energy healing through ASI.

Month 1: Finally had vocabulary for what she'd always done intuitively. Mind blown.

Month 2: Started integrating energy work into her massage practice. Clients noticed immediately.

Month 3: Raised her prices. Clients happily paid. Wait list formed.

Month 6: Transitioned to purely energy work. No more sore hands. Higher income.

Today: Amanda sees 12 clients weekly. $175/session. Fully booked. More fulfilled than ever.

Here's what changed:

Before: "Amanda, LMT - Massage Therapist"
After: "Amanda, LMT, EH-BC - Board Certified Energy Healing Practitioner"

That credential legitimized what she'd always felt.

{{firstName}}, do you see yourself in her story?

${ASI_SIGNATURE}`),
    },

    {
        id: 10,
        phase: "desire",
        day: 18,
        subject: "Re: a typical day in my practice",
        content: cleanContent(`{{firstName}},

Want to know what my days look like as an energy healing practitioner?

7:00am - Wake naturally. Morning meditation. Clear my own energy field.

8:00am - Check my Mastermind pod chat. Share intentions. Support my fellow practitioners.

9:00am - First session. A woman processing the energy of a toxic workplace. I help her release what isn't hers.

10:30am - Second session. Chakra balancing for a client preparing for major life transition.

12:00pm - Lunch. Rest. Recharge.

1:30pm - Third session. Long-distance energy work for a client in another state (yes, it works remotely).

3:00pm - Check ASI Directory. Respond to new inquiries.

4:00pm - Done for the day.

No commute. No drama. No desk I hate.

I introduce myself: "I'm Sarah, a Board Certified Energy Healing Practitioner."

That sentence represents everything I dreamed of.

${ASI_SIGNATURE}

P.S. The Mastermind check-ins? They keep me centered. Knowing 4 other healers have my back.`),
    },

    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: questions you might be asking",
        content: cleanContent(`{{firstName}},

Let me answer what I know you're wondering:

"Is energy healing actually legitimate?"

ASI is incorporated in Delaware, with offices in New York and Dubai. Credentials recognized by CMA, CPD, and IPHM. Every certificate has public verification.

"Will people actually pay for this?"

Energy healing is one of the fastest growing wellness modalities. 73% of our practitioners say demand exceeds their capacity.

"Do I need special gifts?"

Everyone has the ability to sense and direct energy. It can be developed with training. Amanda thought she "wasn't sensitive enough." Now she conducts sessions people travel across the country for.

"Am I too old/too new to this?"

Our average practitioner age is 47. Some start at 60+. Others at 25. It doesn't matter.

"What if my family thinks it's weird?"

They might. At first. Until they experience your work. Until they see your transformation.

The only real failure is ignoring the call.

${ASI_SIGNATURE}`),
    },

    {
        id: 12,
        phase: "desire",
        day: 24,
        subject: "Re: the community nobody talks about",
        content: cleanContent(`{{firstName}},

Here's what nobody tells you about becoming an energy healer:

It can be lonely.

You start sensing energy everywhere. You see patterns others miss. You want to help people who don't even know they need it.

But your old friends don't understand.
Your family thinks it's "a phase."
You're walking a path that feels solitary.

That's why we created the My Circle Mastermind.

When you enroll, you're matched with 5 fellow energy healers. Your Circle.

Every day:
- Morning energy check-ins
- Client case discussions
- Technique sharing
- Mutual support and celebration

This isn't a random Facebook group.

This is YOUR 5. Women who speak your language. Who understand when you say "her energy was all over the place." Who celebrate your first paid session.

Plus the ASI Directory where clients find YOU.

No one succeeds alone. Amanda didn't. Rebecca didn't. I didn't.

${ASI_SIGNATURE}

P.S. My original Circle? Still checking in daily, 3 years later. Soul sisters now.`),
    },

    {
        id: 13,
        phase: "desire",
        day: 27,
        subject: "Re: two possible futures",
        content: cleanContent(`{{firstName}},

Imagine it's one year from now.

Two versions of that moment:

PATH A: Nothing Changed

Same life. Same curiosity about energy healing. The Mini Diploma unfinished or unused.

Still feeling energy you don't know what to do with. Still wondering "what if."

Not bad. Just... unchanged.

PATH B: You Made a Decision

You're Board Certified. Three levels complete: EH-FC, EH-CP, EH-BC.

You introduce yourself: "Hi, I'm {{firstName}}, EH-BC - Board Certified Energy Healing Practitioner."

You're in the ASI Directory. Clients find YOU.

You have your 5-person Mastermind Circle. Daily support. Fellow healers who became friends.

10 clients weekly. $4,000-$7,000/month. Work that lights you up.

That calling you felt? Fully answered.

Both futures take the same 365 days.

The only difference is your decision now.

${ASI_SIGNATURE}`),
    },

    {
        id: 14,
        phase: "desire",
        day: 30,
        subject: "Re: an invitation from my heart",
        content: cleanContent(`{{firstName}},

It's been a month since you started.

I want to personally invite you to take the next step.

If you've felt called to energy healing... if you've wondered what it takes to do this professionally...

Here's what's waiting:

The Complete Career Certification - $297

What's included:

ALL 3 CERTIFICATION LEVELS:
- EH-FC (Foundation Certified)
- EH-CP (Certified Practitioner)
- EH-BC (Board Certified Master)

THE TRAINING:
- 25+ in-depth lessons
- Chakra balancing protocols
- Aura clearing techniques
- Remote energy work methods

THE COMMUNITY:
- My Circle Mastermind (5-person pod)
- DAILY practitioner check-ins
- 20,000+ practitioner network

CLIENT ACQUISITION:
- ASI Directory listing
- Sarah mentorship access
- LIFETIME ACCESS

BONUSES:
- Session templates
- Client intake forms
- Pricing guides

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Or reply "tell me more."

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 3: DECISION (Days 31-45)
    // ============================================

    {
        id: 15,
        phase: "decision",
        day: 31,
        subject: "Re: the complete certification roadmap",
        content: cleanContent(`{{firstName}},

Here's the complete path to becoming a Board Certified Energy Healing Practitioner:

STEP 0: Mini Diploma (Done)
You've got the foundation.

STEP 1: Complete Career Certification ($297)

LEVEL 1: EH-FC - Foundation Certified
- Energy anatomy basics
- Sensing and assessment
- Your first credential

LEVEL 2: EH-CP - Certified Practitioner
- Advanced techniques
- Chakra mastery
- Client protocols

LEVEL 3: EH-BC - Board Certified Master
- Elite practitioner status
- Complex cases
- Full authority

PLUS:
- My Circle Mastermind (daily check-ins)
- ASI Directory listing
- Business templates (BONUS)
- Client scripts (BONUS)
- Sarah mentorship access
- LIFETIME ACCESS

What practitioners earn:
- Beginning: $2,500-$4,500/month
- Established: $5,000-$8,000/month
- Advanced: $8,000-$15,000/month

The math: $297 / $175 = 2 clients to break even.

Reply with questions.

${ASI_SIGNATURE}`),
    },

    {
        id: 16,
        phase: "decision",
        day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

Let's talk about $297.

For context:
- Weekend energy healing workshops: $500-$2,000
- Reiki certification (single level): $200-$500
- Full energy healing programs: $2,000-$10,000

What you get for $297:
- 3-level certification
- Board Certified title
- 25+ lessons
- My Circle Mastermind
- ASI Directory listing
- All bonuses
- LIFETIME access

Total value: $5,000+
You pay: $297

The ROI:

Energy healers typically charge $125-$250/session.

$297 / $125 = 2-3 clients.

THREE CLIENTS and you've covered the investment.
Everything after that is profit - and purpose.

Amanda made over $500 in her first month of practice. Her investment paid back before she even finished certification.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 17,
        phase: "decision",
        day: 36,
        subject: "Re: the credential that matters",
        content: cleanContent(`{{firstName}},

BEFORE:
"{{firstName}} - Interested in energy healing"
- No credential
- Clients skeptical
- No listings

AFTER:
"{{firstName}}, EH-BC - Board Certified Energy Healing Practitioner"
- Professional credential (CMA, CPD, IPHM recognized)
- Clients trust and pay
- Listed in ASI Directory
- Daily Mastermind support

What you get:

3 CREDENTIALS:
- EH-FC
- EH-CP
- EH-BC

THE BADGE:
Display anywhere - LinkedIn, website, business cards.

THE DIRECTORY:
People searching "certified energy healer" find YOU.

THE CIRCLE:
5-person Mastermind. Daily connection. Lasting bonds.

THE VERIFICATION:
Public verification at accredipro.com/verify

Rebecca told me: "When I could say 'I'm Board Certified,' everything shifted. I wasn't explaining myself anymore. I was credentialed."

For $297, you become {{firstName}}, EH-BC.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 18,
        phase: "decision",
        day: 38,
        subject: "Re: what might be stopping you",
        content: cleanContent(`{{firstName}},

Let me address what might be holding you back:

"I don't have time."
- Self-paced. No live requirements.
- Most complete in 8-12 weeks.
- Daily Mastermind takes 5 minutes.

"$297 is money."
- Less than most workshops.
- 2-3 clients = break even.
- LIFETIME access.

"I'm not sure I'm sensitive enough."
- Energy sensitivity can be developed.
- The training awakens it.
- Your Circle supports growth.

"What if nobody pays me?"
- ASI Directory brings leads.
- 73% of practitioners exceed capacity.
- Your Circle refers clients.

"My family won't understand."
- They might not initially.
- Results speak louder than explanations.

"Is energy healing even real?"
- Ask Amanda's clients.
- Ask Rebecca's clients.
- Experience answers doubt.

What's really stopping you?

Reply honestly. I want to help.

${ASI_SIGNATURE}`),
    },

    {
        id: 19,
        phase: "decision",
        day: 40,
        subject: "Re: the daily support that changes everything",
        content: cleanContent(`{{firstName}},

About the My Circle Mastermind:

Most certifications give you content and wave goodbye.

We do something different.

You're matched with 5 fellow energy healers. Your Circle.

Every day:
- Morning intentions
- Energy updates
- Client discussions
- Celebration and support

This isn't posting to strangers.

This is DAILY connection with women who understand what you're experiencing.

When you feel a client's energy and need to process it...
When you doubt yourself...
When you have a breakthrough...

Your Circle holds you.

Amanda told me: "The Mastermind alone is worth the $297. I've never felt so understood."

The certification teaches you.
The Circle sustains you.

Ready for your Circle? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 20,
        phase: "decision",
        day: 42,
        subject: "Re: what our practitioners say",
        content: cleanContent(`{{firstName}},

What Board Certified Energy Healing Practitioners experience:

AMANDA, 43, Former Massage Therapist:
"I always felt 'something more' happening during massage. Now I know what it was and how to channel it intentionally. 12 clients weekly, never going back."

REBECCA, 51, Former Nurse:
"Medicine helped bodies. Energy healing helps SOULS. The certification gave me structure for what I'd felt intuitively. My clients call me their 'energy detective.'"

JENNIFER, 38, Former Corporate:
"I left a 6-figure job that was killing my soul. Now I make a similar income doing work that feeds my soul. The credential opened doors."

MARIA, 55, Former Teacher:
"I thought I was too old to start something new. Turns out, my life experience makes me a BETTER healer. Clients trust me immediately."

None of them are special. They simply decided.

Just like you can decide today.

${ASI_SIGNATURE}`),
    },

    {
        id: 21,
        phase: "decision",
        day: 44,
        subject: "Re: the pull doesn't go away",
        content: cleanContent(`{{firstName}},

That pull you feel toward energy healing?

It doesn't go away.

I've talked to women who waited years. Who felt it. Who ignored it.

Know what they all say?

"I wish I'd started sooner."

The calling gets louder, not quieter.

Every day you wait is:
- A client who doesn't find you
- Energy healing that doesn't happen
- Your gifts untapped

Not pressuring you. It must be your choice.

But make the choice consciously. Not by default.

Complete Certification: $297
Two clients to break even.
A lifetime of purpose.

If you feel it, trust it: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 46-60)
    // ============================================

    {
        id: 22,
        phase: "re-engage",
        day: 48,
        subject: "Re: still here for you",
        content: cleanContent(`{{firstName}},

Haven't heard from you in a while.

That's okay. Everyone's timeline is different.

Just wanted you to know: I'm still here. The door is open. Your path is waiting.

Maybe now isn't the time. Maybe life is full. Maybe doubt is loud.

Whatever is true, I honor it.

When you're ready - the certification will be here. I'll be here.

Your energy gifts aren't going anywhere.

With love,

${ASI_SIGNATURE}`),
    },

    {
        id: 23,
        phase: "re-engage",
        day: 52,
        subject: "Re: something for you",
        content: cleanContent(`{{firstName}},

Wanted to share something - no strings attached.

A simple energy clearing practice:

Close your eyes. Visualize brilliant golden light above your head. See it descending through your crown, filling every cell. As it moves down, it gently pushes out any energy that isn't yours - absorbed emotions, others' stress, old residue.

See the unwanted energy flowing down through your feet, into the earth. The earth transmutes it. You feel lighter, clearer.

Breathe. Thank the light. Open your eyes.

Takes 2 minutes. Transforms your state.

This is from the certification training, but I wanted you to have it now.

Because you're on this path - whether certified or not.

${ASI_SIGNATURE}`),
    },

    {
        id: 24,
        phase: "re-engage",
        day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

I was thinking about you today.

About when you first signed up. Something called you to energy healing. Something said "this matters."

That voice is still there.

Maybe louder now.

I don't know what your journey looks like. But I know this:

Energy healing is needed more than ever. People are stressed, depleted, disconnected from their own energy. And there are never enough trained practitioners.

If you want to continue this conversation - about certification, about the work, about anything - just reply.

I'm here.

${ASI_SIGNATURE}`),
    },

    {
        id: 25,
        phase: "re-engage",
        day: 60,
        subject: "Re: one final message",
        content: cleanContent(`{{firstName}},

This is my last scheduled message in this sequence.

I want to leave you with this:

You found your way to energy healing for a reason. Whether you ever pursue certification or not - the calling is real. Your sensitivity is real. The longing for meaningful work is real.

Whatever path you take, I hope you:
- Trust your energy awareness
- Use your gifts however feels right
- Remember that healing is always possible

If someday the time is right: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Until then, sending you balanced, radiant energy.

Thank you for being part of this community.

With gratitude,

${ASI_SIGNATURE}

P.S. I believe in your gifts. I believe you're meant for something beautiful.`),
    },
];

export type EnergyHealingNurtureEmail = typeof ENERGY_HEALING_NURTURE_SEQUENCE[number];
