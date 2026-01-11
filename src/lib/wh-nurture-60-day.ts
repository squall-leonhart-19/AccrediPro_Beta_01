/**
 * Women's Health Mini Diploma - 60-Day Nurture Sequence
 * 
 * Based on Board Analysis (Jan 2026):
 * - Phase 1 (Days 0-14): VALUE - Build trust, NO selling
 * - Phase 2 (Days 15-30): DESIRE - Show transformation
 * - Phase 3 (Days 31-45): DECISION - Clear offer
 * - Phase 4 (Days 46-60): RE-ENGAGE - Stay connected
 * 
 * Target: US Women 35-40+
 * Product: Career Accelerator ($2,997 with $1,000 scholarship = $1,997)
 */

// Helper to clean content
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

export const WH_NURTURE_60_DAY = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    // Email 1 - Day 0: Welcome
    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Women's Health access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

Your Women's Health Mini Diploma is ready - you can start right now if you want.

But before you dive in, I need to tell you something important:

This isn't like other free courses.

This is real training. By the end, you'll understand hormones, cycles, and women's health in a way that changes how you see your own body forever.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days to see how you're doing. And {{firstName}} - if you have ANY questions, just hit reply. I read and respond to every single email.

This is the beginning of something.

Sarah

P.S. Check your messages inside the portal - I've left you a personal voice note.`),
    },

    // Email 2 - Day 1: Sarah's Story (Emotional Version)
    {
        id: 2,
        phase: "value",
        day: 1,
        subject: "Re: my story (thought you'd relate)",
        content: cleanContent(`{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles - chronic fatigue, brain fog, autoimmune symptoms - I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom.

I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way."

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that - it gave me back my hope.

Hope that I could truly help my clients. Hope that I could build a career I loved. Hope that I could create a future for my family that didn't depend on burning out or "faking it."

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path - because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}} - what made you curious about women's health? What's your story?

Hit reply. I want to hear it.

With love,

Sarah`),
    },

    // Email 3 - Day 3: Why Generic Advice Fails (Linda Story)
    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: why the usual advice doesn't work",
        content: cleanContent(`{{firstName}},

I need to tell you about Linda.

She came to me last year. 52 years old. Exhausted for three years straight. Brain fog so bad she'd forget words mid-sentence.

She'd seen four doctors. They all said the same thing:

"Your labs are normal."
"Try to sleep more."
"Maybe it's just stress."
"Have you considered antidepressants?"

By the time she found me, she was starting to believe them. Maybe it WAS all in her head. Maybe this was just what 52 felt like.

It wasn't.

Within 20 minutes of looking at her case through a root-cause lens, I found three things her doctors missed. Not because they were bad doctors - because they weren't trained to look.

Six weeks later, Linda texted me: "I feel like myself again. I forgot what that even felt like."

Here's the thing, {{firstName}}:

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Balance your hormones" doesn't help when you don't know WHICH ones are off.
"Reduce stress" doesn't help when the stress is coming from inside (inflammation, blood sugar, thyroid).

The real questions are:
- WHY is she exhausted? (not "she's exhausted, give her caffeine")
- WHAT'S driving the symptoms? (not "here's a pill to mask it")
- WHERE is the breakdown happening? (not "let's guess and hope")

This is what you're learning in your Mini Diploma. This is the difference between surface-level wellness advice and actually understanding what's happening.

Have you started your lessons yet? Even Lesson 1 will change how you see health forever.

Quick question: Have you ever had a "Linda moment" - where you KNEW something was wrong but couldn't figure out what? Reply and tell me about it.

Sarah`),
    },

    // Email 4 - Day 5: Client Win Story (Pure Value)
    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: something incredible happened",
        content: cleanContent(`{{firstName}},

I have to share something that happened this week.

One of our graduates, Michelle, just sent me this message:

"Sarah, my client Jennifer just called me crying. Good tears. She said her husband noticed she seems 'different' - more energy, more patient with the kids, more like herself. She's been struggling with exhaustion and mood swings for 3 years. Doctors couldn't figure it out. We worked together for 6 weeks."

This is why I do this work.

Not the certificates. Not the income (though that's nice too). THIS.

That moment when someone who's been dismissed, ignored, or told "it's all in your head" finally gets answers.

When they feel like themselves again.
When their family notices the difference.
When they realize - I'm not crazy. Something WAS wrong. And now I know what it is.

Jennifer's transformation took Michelle 6 weeks of work. Probably 8-10 hours total. And it changed Jennifer's entire quality of life.

That's the power of understanding root causes.

{{firstName}}, I don't know exactly why you signed up for this Mini Diploma. Maybe for yourself. Maybe for a family member. Maybe because something inside you said "I need to learn this."

Whatever the reason - trust that instinct.

Keep going with your lessons. The knowledge you're building matters.

And if you ever want to talk about what you're learning, just hit reply. I read every email.

Cheering you on,

Sarah

P.S. How are you finding the lessons so far? Any favorites?`),
    },

    // Email 5 - Day 7: Engagement Question
    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

I've been thinking about you.

It's been a week since you started your Women's Health Mini Diploma, and I'm curious:

What's surprised you most so far?

Maybe it was learning about the four phases of the menstrual cycle (most women only know two).

Maybe it was understanding how the gut affects hormones (this blows everyone's mind).

Maybe it was realizing how many "normal" symptoms... aren't actually normal.

Whatever it is - I'd love to hear.

Just hit reply and tell me one thing that made you go "wow, I didn't know that."

I read and respond to every email personally.

Sarah

P.S. If you haven't had a chance to dive in yet, no judgment. Life happens. But try to carve out 15 minutes this week - just Lesson 1. It's worth it.`),
    },

    // Email 6 - Day 10: Free Value Tip (No Pitch)
    {
        id: 6,
        phase: "value",
        day: 10,
        subject: "Re: a tip most doctors don't know",
        content: cleanContent(`{{firstName}},

Quick health tip I wanted to share - something most doctors never mention:

Your thyroid and your blood sugar are connected.

If your blood sugar is constantly spiking and crashing (hello, afternoon energy slump), your body produces more cortisol to stabilize it.

High cortisol tells your thyroid: "Slow down. We're under stress."

Result? You feel tired, sluggish, brain-foggy... even if your thyroid labs look "normal."

This is why I see women diagnosed as "just tired" or "probably stressed" when there's actually something going on.

The fix isn't complicated:
- Eat protein with every meal (especially breakfast)
- Avoid the blood sugar rollercoaster (processed carbs + sugar)
- Don't skip meals (for women especially, this matters)

Try it for one week and see how you feel.

This kind of connection - understanding how systems interact - is what you're building in your Mini Diploma. Keep going.

Sarah

P.S. Did you know? The thyroid affects energy, mood, weight, hair, skin, digestion, and even fertility. One little butterfly-shaped gland, so much impact.`),
    },

    // Email 7 - Day 12: Mini Diploma Check-in
    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How are you doing with your Mini Diploma?

If you're cruising through - amazing. You're building knowledge that will serve you for life.

If you've gotten stuck or life got in the way - that's okay too. No judgment here.

Here's what I know:

The women who finish this Mini Diploma tell me it changed how they see their own health. And how they relate to the women around them who are struggling.

Even if you can only do 10 minutes at a time - that counts.

You have 7 days of access from when you started. If you need more time, just reply and let me know. We can figure something out.

What's one thing I can help you with right now?

Sarah

P.S. If you've finished or are close to finishing - reply with "DONE" and I'll send you something special.`),
    },

    // Email 8 - Day 14: Congratulations / Struggle Split
    {
        id: 8,
        phase: "value",
        day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started your Women's Health journey.

I want to acknowledge something:

Learning this material isn't easy. It requires time, focus, and mental energy - things that are in short supply for most of us.

So wherever you are right now...

If you've finished your Mini Diploma: I'm SO proud of you. You now understand more about women's health than most people ever will. Your certificate should be arriving in the next 24 hours.

If you're in progress: Keep going. You're building something valuable. Even completing one more lesson this week puts you ahead.

If you haven't started yet: It's not too late. But your access won't last forever. If this matters to you, make time for it.

Whatever camp you're in, I want you to know:

I see you.
I believe in you.
And I'm here if you need anything.

Just hit reply.

Sarah

P.S. The women who finish this Mini Diploma often tell me it was the first step toward something bigger. Let's make sure you get to that first step.`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 15-30) - Build desire
    // ============================================

    // Email 9 - Day 15: Graduate Spotlight
    {
        id: 9,
        phase: "desire",
        day: 15,
        subject: "Re: what Diane did next",
        content: cleanContent(`{{firstName}},

Remember Diane?

The burned-out nurse I mentioned a few emails ago?

I want to tell you what happened after she finished her training.

Month 1: She was nervous. Excited. Had no idea what she was doing. But she knew more than she realized.

Month 2: She posted in a Facebook group about thyroid health. Just shared something she'd learned. Five women messaged her asking for help.

Month 3: Three of those women became paying clients. They paid her $200 each for an hour of her time.

Month 6: She quit her nursing job. Not because she hated nursing - but because she could finally help people the way she always wanted to. On her own terms.

Today: Diane works from home. Makes $8,000/month. Sees 8-10 clients a week, all from referrals.

Her husband? He used to roll his eyes when she'd study late at night. Now he tells everyone about his wife "the health expert."

Here's what Diane told me:

"I wish I'd done this 20 years ago. But I'm grateful I didn't wait another year."

{{firstName}}, I'm not telling you Diane's story to sell you something.

I'm telling you because... maybe you see yourself in her?

Maybe you've felt stuck. Overworked. Underpaid. Knowing you could do more, but not sure how.

If that's you, I just want you to know: there IS a path forward.

And it starts with the foundation you're building right now.

Sarah

P.S. Diane still uses her nursing knowledge every day. She didn't abandon her experience - she elevated it.`),
    },

    // Email 10 - Day 18: Day in the Life
    {
        id: 10,
        phase: "desire",
        day: 18,
        subject: "Re: what my typical day looks like",
        content: cleanContent(`{{firstName}},

Want to know what my days look like now?

I get asked this a lot, so I thought I'd share.

7:00am - Wake up naturally (no alarm). Make coffee. Read for 20 minutes.

8:00am - Get my daughter ready for school. Actually BE there for breakfast, not rushing out the door.

9:00am - First client call. A woman in Texas struggling with hormone symptoms. We review her labs, talk through what's going on, plan next steps.

10:30am - Second call. Follow-up with a long-term client who's finally sleeping through the night after 4 years of insomnia. She cries happy tears. I might too.

12:00pm - Lunch. At home. Not rushing to a break room. Not eating in my car.

1:00pm - Admin stuff. Emails. Planning. 

2:30pm - Record content. Answer community questions.

3:30pm - Pick up my daughter from school. Hear about her day while it's still fresh.

Evening - Dinner together. Present. Not exhausted.

No commute. No 14-hour days. No asking permission to take a day off.

This isn't about being lazy. I work hard. I love what I do.

But I work on MY terms. For people I choose. Solving problems that matter.

That's the real reward.

{{firstName}}, I don't share this to brag. I share it because this life felt impossible to me once too.

And now I get to help other women build it for themselves.

Something to think about.

Sarah`),
    },

    // Email 11 - Day 21: Common Questions / Fears
    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: questions you might be asking",
        content: cleanContent(`{{firstName}},

I've been doing this long enough to know what you might be thinking.

Not objections. Just... questions. Honest ones.

Let me try to answer a few:

"Can I really do this?"

Yes. I've seen yoga teachers, accountants, stay-at-home moms, nurses, and corporate execs all succeed. The only requirement is caring about helping people and being willing to learn.

"Isn't the health space saturated?"

The wellness space? Maybe. But truly trained practitioners who understand root causes? There's a shortage. The demand is huge and growing.

"What if my family thinks this is silly?"

They might. At first. Until they see you actually helping people. Until they see you earning income. Until they realize you were right.

"Am I too old to start?"

Diane was 62. Patricia was 58. Maria was a single mom at 43. Your age isn't a barrier - it's an asset. Life experience matters in this work.

"What if I try and fail?"

Here's my honest answer: you might struggle. Everyone does at the start. But "failure" in this context means... what? Learning something new? Discovering what works and what doesn't? 

That's not failure. That's the process.

The only real failure is never starting.

{{firstName}}, I'm not trying to convince you of anything. I'm just being honest.

If you have other questions, just reply. I read every email.

Sarah`),
    },

    // Email 12 - Day 24: Community Preview
    {
        id: 12,
        phase: "desire",
        day: 24,
        subject: "Re: the part nobody talks about",
        content: cleanContent(`{{firstName}},

Can I tell you the part of this journey nobody talks about?

The loneliness.

When you start learning about root-cause health, you can't unsee things. You notice symptoms everywhere. You want to help everyone.

But your friends don't get it.
Your family thinks it's "another phase."
And you're learning alone, in your living room, wondering if anyone else feels this way.

That's why community matters.

I'm not talking about a generic Facebook group with 50,000 strangers.

I'm talking about a small group of women who are on the same path. Who understand the late-night study sessions. Who celebrate your first client with you. Who answer when you ask "has anyone dealt with this?"

That's what our practitioners have.

A private community. Weekly Q&A calls. Direct access to mentors who've been where you are.

No one succeeds alone. I didn't. Diane didn't. Maria didn't.

We all needed people who understood.

If you ever move beyond the Mini Diploma, that's what's waiting. A tribe. A support system. A group of women who get it.

Just thought you should know.

Sarah

P.S. One of my favorite things is watching women in the community help each other. Last week, a new student asked a question about thyroid labs. Three graduates answered within an hour, with detailed insights. That's what we've built.`),
    },

    // Email 13 - Day 27: Two Paths
    {
        id: 13,
        phase: "desire",
        day: 27,
        subject: "Re: thinking about your decision",
        content: cleanContent(`{{firstName}},

I want to try something with you.

Imagine it's exactly one year from now. January 2027.

You're sitting somewhere comfortable. Maybe your couch. Maybe a coffee shop. A full year has passed.

Now imagine two versions of that moment:

PATH A: Nothing Changed

It's a year from now. Same job. Same frustrations. Same Sunday night dread.

The Mini Diploma you did? Maybe you used some of it for yourself. But it's sitting there, not really leading anywhere.

You still think "I should do something more with my health knowledge." But you never do.

Not terrible. Just... the same.

PATH B: You Made a Decision

It's a year from now. Everything is different.

You're trained. Certified. Helping women who used to be just like you - exhausted, confused, dismissed by doctors.

You have clients. Maybe 5, maybe 10. Women who text you "I finally feel like myself again."

You're earning money from work that matters. Maybe $2,000/month. Maybe $8,000. Depends on how hard you went.

You work when you want, from where you want.

And that feeling of "I'm meant for something more"? It's gone. Because you're doing it.

Here's the thing, {{firstName}}:

Both of those futures take the same amount of time to arrive.

365 days will pass either way.

The only difference is the decision you make now.

I'm not here to pressure you. But I am here to be honest.

Reply and tell me: which path do you want?

Sarah`),
    },

    // Email 14 - Day 30: Personal Invitation
    {
        id: 14,
        phase: "desire",
        day: 30,
        subject: "Re: an invitation",
        content: cleanContent(`{{firstName}},

It's been a month since you started your Women's Health journey.

I want to personally invite you to take the next step.

Not a sales pitch. An invitation.

If you've been curious about what comes after the Mini Diploma... if you've wondered what it would take to actually help other women with their health... if you've thought "maybe I could do this"...

Then I want to share the full path with you.

It's called the Career Accelerator.

I won't go into all the details in this email. But here's what it includes:

- Full certification in Women's Health
- Practice-building training (how to actually get clients)
- Community of practitioners supporting each other
- Direct mentorship access
- Done-for-you templates, scripts, and systems

As a Mini Diploma graduate, you have access to a special offer that isn't available to the public.

If you're curious, just reply with "tell me more" and I'll send you the full details.

No pressure. No countdown timers. No "this expires tonight."

Just an open door, whenever you're ready.

Sarah

P.S. If now isn't the right time, that's okay too. Just know the door is open.`),
    },

    // ============================================
    // PHASE 3: DECISION (Days 31-45) - Clear offer
    // ============================================

    // Email 15 - Day 31: The Full Roadmap
    {
        id: 15,
        phase: "decision",
        day: 31,
        subject: "Re: the complete roadmap",
        content: cleanContent(`{{firstName}},

You asked about the next step. Here it is.

The Complete Roadmap:

STEP 0: Mini Diploma (Done)
You've already built the foundation. You understand root-cause thinking. You've proven you can learn this.

STEP 1: Career Accelerator
This is where everything changes. Full certification plus practice-building in one program.

What's included:
- 21 comprehensive training modules
- Women's health deep dive (hormones, fertility, menopause)
- Lab interpretation that goes beyond "normal"
- Protocol design for real clients
- Business training: how to get clients, price your services, build income
- Private community of practitioners
- Weekly Q&A calls
- Lifetime access

Time: Self-paced. Most complete in 8-12 weeks.

STEP 2: Practice Building
You don't just learn - you build. By the end, you'll have:
- Your signature offer
- Client acquisition system
- Confidence to charge real money

Income potential: $3,000-$10,000/month depending on how much you work.

STEP 3: Advanced (Optional)
For those who want to go deeper. Complex cases. Premium positioning. Higher income.

The question isn't "can you do this?" 

You've already proven you can learn. The Mini Diploma showed that.

The question is: do you want to?

Reply if you have questions. I'm here.

Sarah`),
    },

    // Email 16 - Day 34: Investment Breakdown
    {
        id: 16,
        phase: "decision",
        day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

Let's talk about the investment.

The Career Accelerator is $2,997.

But as a Mini Diploma graduate, you have a $1,000 scholarship.

Your price: $1,997.

Is that a lot of money? For most people, yes.

Let me share how I think about it:

The Comparison:
- Traditional health coaching cert: $5,000-$15,000
- Nursing/medical school: $50,000-$150,000
- Staying stuck for another year: Priceless frustration

The Math:
Most practitioners charge $150-$400 per session.

$1,997 / $200 per session = 10 clients to break even.

After that? Profit.

Diane recovered her investment in her first month of seeing clients.
Maria recovered it in her first week.
Michelle recovered it before she even finished the training (from her first 3 clients).

The Real Cost:
But here's what I want you to think about, {{firstName}}:

What's the cost of NOT doing this?

Another year of the same routine?
Another year of knowing you could do more?
Another year of watching others build the life you want?

I can't put a dollar amount on that. But you know what it feels like.

Payment Options:
If $1,997 upfront is too much, we have payment plans:
- 3 payments of $699
- 6 payments of $349

No credit check. No interest.

Questions? Reply and ask me anything.

Sarah

P.S. The $1,000 scholarship is real. It's for Mini Diploma graduates only. It won't last forever, but there's no fake countdown.`),
    },

    // Email 17 - Day 37: Objection Crusher
    {
        id: 17,
        phase: "decision",
        day: 37,
        subject: "Re: the thing that's stopping you",
        content: cleanContent(`{{firstName}},

I've talked to thousands of women at this stage.

And I know there's probably something holding you back.

Let me guess:

"I don't have time."
The program is self-paced. 5-7 hours per week. Study at 5am or 11pm. On your phone in line at the grocery store. There are no live requirements.

Maria studied while her 3 kids slept. She finished in 10 weeks.

"I can't afford it."
Payment plans are available. $349/month for 6 months. That's $11/day.

And here's the thing: this isn't an expense. It's an investment that pays you back within months.

"I'm not qualified."
You finished the Mini Diploma. You can learn this. The certification isn't harder - it's deeper.

"What if I fail?"
You can retake any assessment unlimited times. And you have lifetime access. There's no failing - just going at your own pace.

"My family will think I'm crazy."
They might. Until you start earning. Until you start helping people. Until they realize you were right.

"What if this is a scam?"
Fair question. Our graduates are practicing right now. Earning real money. Helping real people. You can verify any of this.

So what's REALLY stopping you?

Reply and tell me honestly. I want to help.

Sarah`),
    },

    // Email 18 - Day 40: Payment Plan Emphasis
    {
        id: 18,
        phase: "decision",
        day: 40,
        subject: "Re: making it work",
        content: cleanContent(`{{firstName}},

I want to talk about something real.

Money.

For a lot of women, it's not that they don't WANT to do this. It's that the investment feels scary.

I get it. I've been there.

So let me break down the options:

Option 1: Pay in Full - $1,997
(That's $2,997 minus your $1,000 graduate scholarship)

Option 2: 3 Monthly Payments - $699/month
Same total. Spread over 3 months.

Option 3: 6 Monthly Payments - $349/month
That's about $11/day. Less than lunch.

No credit check. No interest. No judgment.

Here's What I Want You To Know:

Maria signed up for the payment plan. She didn't have $1,997 sitting around. She was a single mom with three kids.

She figured out $349/month. It was tight. But she made it work.

Ten months later? She's earning $12,000/month.

The investment paid itself back 60x over.

I'm not saying that to pressure you. I'm saying it because it's true.

If cost is the barrier - not fear, not timing, but actual cost - reply and tell me. We might be able to work something out.

Sarah

P.S. The women who hesitate longest aren't the ones who can't afford it. They're the ones who are scared. And that's okay. Fear is part of it. But it shouldn't be the thing that stops you.`),
    },

    // Email 19 - Day 43: Guarantee Emphasis
    {
        id: 19,
        phase: "decision",
        day: 43,
        subject: "Re: the guarantee",
        content: cleanContent(`{{firstName}},

I want to tell you about our guarantee.

30 days. No questions asked.

If you enroll and decide within the first 30 days that this isn't right for you - for ANY reason - email us and we'll refund every penny.

No hassle. No awkward conversation. No guilt.

Why can I offer this?

Because the program works.

Our refund rate is under 3%. Not because we make it hard to refund - we don't. But because people get results.

They start learning and realize: "Oh. This is actually incredible."

They connect with the community and feel: "These are my people."

They finish their first module and think: "I can actually do this."

By the end of 30 days, most people can't imagine NOT continuing.

But if you're in that 3% who genuinely feels it's not right? That's okay. We'll give you your money back with zero drama.

So here's what I want you to understand:

There is no risk.

Either you love it and it changes your life. Or you don't and you get your money back.

The only thing you lose by NOT trying? Time. And the possibility of what could be.

Think about it.

Sarah`),
    },

    // Email 20 - Day 45: Ready When You Are
    {
        id: 20,
        phase: "decision",
        day: 45,
        subject: "Re: no pressure",
        content: cleanContent(`{{firstName}},

This is the last email I'll send about the Career Accelerator for a while.

I've shared the roadmap.
I've shared the investment.
I've shared the guarantee.
I've shared the stories.

Now the decision is yours.

If you're ready - the door is open. Your graduate scholarship is waiting. Just reply and say "I'm in" and I'll send you the enrollment link.

If you're not ready - that's okay too. I won't keep pushing. I'll just keep sending you valuable content about women's health. We'll stay connected.

But I do want to say one thing:

The women who succeed at this aren't the ones who had the most money, the most time, or the most confidence.

They're the ones who decided.

Despite the fear. Despite the uncertainty. Despite the voices telling them they couldn't.

They decided that their future was worth betting on.

That's the only difference.

Whatever you decide, I believe in you.

Sarah

P.S. If you enroll this week and want a quick welcome call with me personally, just reply after you sign up. I'd love to meet you.`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 46-60)
    // ============================================

    // Email 21 - Day 48: Still Thinking Check-in
    {
        id: 21,
        phase: "reengage",
        day: 48,
        subject: "Re: still thinking about it?",
        content: cleanContent(`{{firstName}},

Just checking in.

I know I said I wouldn't push. And I won't.

But I wanted to leave this door open:

If you're still thinking about the Career Accelerator... if you have questions you haven't asked... if there's something specific holding you back...

Reply and tell me.

Sometimes the thing we need most is just someone to talk it through with.

I'm here. No pressure.

Sarah`),
    },

    // Email 22 - Day 52: New Resource
    {
        id: 22,
        phase: "reengage",
        day: 52,
        subject: "Re: something you might find useful",
        content: cleanContent(`{{firstName}},

I put together something I thought you might find valuable.

It's a quick breakdown of the 5 hormone patterns I see most often in women over 35. Signs to look for, questions to ask, and basic support ideas.

Nothing complicated. Just practical information you can use.

If you want it, just reply with "HORMONES" and I'll send it over.

(No sales pitch attached. Just value.)

Sarah`),
    },

    // Email 23 - Day 56: What's New
    {
        id: 23,
        phase: "reengage",
        day: 56,
        subject: "Re: something new",
        content: cleanContent(`{{firstName}},

Quick update for you.

We just added new content to the Career Accelerator:

- A complete module on perimenopause and menopause support
- Client intake templates that our most successful practitioners use
- A new "first 5 clients" roadmap for getting started faster

If you ever decide to join, these are waiting for you.

Your graduate scholarship is still available.

Just wanted you to know.

Sarah`),
    },

    // Email 24 - Day 60: Stay Connected
    {
        id: 24,
        phase: "reengage",
        day: 60,
        subject: "Re: let's stay connected",
        content: cleanContent(`{{firstName}},

It's been two months since you started your Women's Health Mini Diploma.

I hope you've found value in what you learned.

Even if you never go further than the Mini Diploma - you now understand your own body better. You can recognize symptoms. You know questions to ask.

That matters.

Going forward, I'll send you occasional emails. Tips, stories, resources. Nothing overwhelming. Just staying in touch.

And if you ever decide you want to take the next step - whether that's in a month, six months, or a year - the door will still be open.

Your graduate scholarship will be there. The community will be there. I'll be there.

Thank you for being here, {{firstName}}.

I mean that.

Sarah

P.S. Whenever you're ready, you know where to find me. Just reply.`),
    },
];

export type WHNurtureEmail = typeof WH_NURTURE_60_DAY[number];
