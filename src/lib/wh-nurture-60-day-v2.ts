/**
 * Women's Health Mini Diploma - 60-Day Nurture Sequence v2.0
 * 
 * ENHANCED with ASI Psychological Triggers:
 * - 🏛️ Authority: AccrediPro Standards Institute positioning
 * - 🎓 Credentialing: WH-FC™ title throughout
 * - 👥 Social Proof: 20,000+ practitioners, 47 countries
 * - 🦋 Identity: "Become Maria Smith, WH-FC™"
 * - ⏳ Scarcity: 50 spots per cohort
 * - 🤝 Belonging: ASI Practitioner Network
 * - 📍 Directory: Clients FIND you
 * 
 * Phase 1 (Days 0-14): VALUE - Build trust, NO selling
 * Phase 2 (Days 15-30): DESIRE - Show transformation
 * Phase 3 (Days 31-45): DECISION - Clear offer
 * Phase 4 (Days 46-60): RE-ENGAGE - Stay connected
 * 
 * Target: US Women 35-40+
 * Product: Career Accelerator ($2,997 - $1,000 scholarship = $1,997)
 * Credential: WH-FC™ (Women's Health - Foundation Certified)
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

// Standard signature for all emails
const ASI_SIGNATURE = `
Sarah
Certified Practitioner & Lead Instructor
AccrediPro Standards Institute`;

const ASI_PS_LINE = `Certified by AccrediPro Standards Institute | New York | Dubai | 20,000+ Practitioners Worldwide`;

export const WH_NURTURE_60_DAY_V2 = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    // Email 1 - Day 0: Welcome (+ Authority + Social Proof)
    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Women's Health access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of over 20,000 women who've started this journey - practitioners in 47 countries who decided they wanted more than surface-level health advice.

Your Women's Health Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies professional practitioners.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days to see how you're doing. And {{firstName}} - if you have ANY questions, just hit reply. I read and respond to every single email personally.

This is the beginning of something.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    // Email 2 - Day 1: Sarah's Story (+ Identity + Credentialing)
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

I loved helping people, but when clients came to me with real struggles - chronic fatigue, brain fog, hormonal chaos - I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom.

I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way."

That's when I found root-cause health. That's when I got certified.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of symptoms, how to design real protocols that worked.

But more than that - it gave me back my hope. And my identity.

I went from "Sarah who tries to help" to "Sarah, Certified Practitioner." The alphabet after my name changed everything. Clients trusted me. I trusted myself.

And now? I get to live what once felt impossible: helping women transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path - because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}} - what made you curious about women's health? What's your story?

Hit reply. I want to hear it.

With love,

${ASI_SIGNATURE}`),
    },

    // Email 3 - Day 3: Why Generic Fails (+ Authority)
    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: why the usual advice doesn't work",
        content: cleanContent(`{{firstName}},

I need to tell you about Linda.

She came to one of our ASI-certified practitioners last year. 52 years old. Exhausted for three years straight. Brain fog so bad she'd forget words mid-sentence.

She'd seen four doctors. They all said the same thing:

"Your labs are normal."
"Try to sleep more."
"Maybe it's just stress."
"Have you considered antidepressants?"

By the time she found a certified practitioner, she was starting to believe them. Maybe it WAS all in her head. Maybe this was just what 52 felt like.

It wasn't.

Within 20 minutes of looking at her case through a root-cause lens - the way we train at ASI - the practitioner found three things her doctors missed. Not because they were bad doctors - because they weren't trained to look.

Six weeks later, Linda texted: "I feel like myself again. I forgot what that even felt like."

Here's the thing, {{firstName}}:

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Balance your hormones" doesn't help when you don't know WHICH ones are off.
"Reduce stress" doesn't help when the stress is coming from inside (inflammation, blood sugar, thyroid).

This is what you're learning in your Mini Diploma. This is the difference between surface-level wellness and root-cause understanding.

Have you started your lessons yet? Even Lesson 1 will change how you see health forever.

${ASI_SIGNATURE}

P.S. Linda now refers everyone she knows to ASI-certified practitioners. Her exact words: "The doctors kept me sick. A certified practitioner made me well."`),
    },

    // Email 4 - Day 5: Client Win Story (+ Social Proof + Credential)
    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: something incredible happened",
        content: cleanContent(`{{firstName}},

I have to share something that happened this week.

One of our certified practitioners, Michelle (WH-FC certified), just sent me this message:

"Sarah, my client Jennifer just called me crying. Good tears. She said her husband noticed she seems 'different' - more energy, more patient with the kids, more like herself. She's been struggling with exhaustion and mood swings for 3 years. Doctors couldn't figure it out. We worked together for 6 weeks."

This is why I do this work.

Not the certificates. Not the income (though that's nice too). THIS.

That moment when someone who's been dismissed, ignored, or told "it's all in your head" finally gets answers.

Michelle is one of 20,000+ ASI-certified practitioners now helping women around the world. She got certified 8 months ago. Now she has a full practice and a waitlist.

But more importantly - she gets to have moments like this. Where she changes someone's life. Where a husband notices his wife is "different." Where a family gets their mom back.

{{firstName}}, I don't know exactly why you signed up for this Mini Diploma. Maybe for yourself. Maybe for a family member. Maybe because something inside you said "I need to learn this."

Whatever the reason - trust that instinct.

Keep going with your lessons. The knowledge you're building matters.

${ASI_SIGNATURE}

P.S. How are you finding the lessons so far? Any favorites?`),
    },

    // Email 5 - Day 7: Engagement Question (+ Social Proof)
    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

I've been thinking about you.

It's been a week since you started your Women's Health Mini Diploma, and I'm curious:

What's surprised you most so far?

When I ask our 20,000+ practitioners this question, the most common answers are:

1. "I had no idea about the four phases of the menstrual cycle" (most women only know two!)
2. "The gut-hormone connection blew my mind"
3. "I realized half my 'normal' symptoms... aren't normal at all"

What about you? What made you go "wow, I didn't know that"?

Just hit reply and tell me. I personally read every response.

${ASI_SIGNATURE}

P.S. If you haven't had a chance to dive in yet, no judgment. Life happens. But try to carve out 15 minutes this week - just Lesson 1. It's worth it.`),
    },

    // Email 6 - Day 10: Free Value Tip (+ Authority)
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

This is what we call a "hidden driver" - something conventional medicine misses because they look at systems in isolation.

At ASI, we train practitioners to see these connections. It's why our certified practitioners get different results than generic health coaches.

The fix isn't complicated:
- Eat protein with every meal (especially breakfast)
- Avoid the blood sugar rollercoaster
- Don't skip meals (for women especially, this matters)

Try it for one week and see how you feel.

This kind of connected thinking is what you're building in your Mini Diploma. Keep going.

${ASI_SIGNATURE}`),
    },

    // Email 7 - Day 12: Mini Diploma Check-in (+ Scarcity + Social Proof)
    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How are you doing with your Mini Diploma?

If you're cruising through - amazing. You're joining the 15,000+ women who've completed this training.

If you've gotten stuck or life got in the way - that's okay too. No judgment here.

Here's what I know:

The women who finish this Mini Diploma tell me it changed how they see their own health. And how they relate to the women around them who are struggling.

Even if you can only do 10 minutes at a time - that counts.

Quick reminder: Your access is limited. If you need more time, just reply and let me know. We can figure something out.

What's one thing I can help you with right now?

${ASI_SIGNATURE}

P.S. If you've finished or are close to finishing - reply with "DONE" and I'll send you something special about what comes next.`),
    },

    // Email 8 - Day 14: Congratulations / Identity Hook
    {
        id: 8,
        phase: "value",
        day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started your Women's Health journey with AccrediPro Standards Institute.

I want to acknowledge something:

Learning this material isn't easy. It requires time, focus, and mental energy - things that are in short supply for most of us.

So wherever you are right now...

If you've finished your Mini Diploma: I'm SO proud of you. You now understand more about women's health than most people ever will. Your completion certificate is on its way.

And {{firstName}} - something shifted in you. You're not the same person who signed up two weeks ago. You understand things now. You see connections. You're becoming someone who can actually help.

If you're still in progress: Keep going. You're building something valuable.

If you haven't started yet: It's not too late. But don't let this opportunity slip away.

Whatever camp you're in, I want you to know:

I see you.
I believe in you.
And I'm here if you need anything.

Just hit reply.

${ASI_SIGNATURE}

P.S. The women who finish this Mini Diploma often tell me it was the first step toward becoming someone new. Someone with real knowledge. Someone who can help. Let's make sure you get there.`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 15-30) - Build desire
    // ============================================

    // Email 9 - Day 15: Graduate Spotlight + Credential
    {
        id: 9,
        phase: "desire",
        day: 15,
        subject: "Re: Diane's transformation (WH-FC)",
        content: cleanContent(`{{firstName}},

Remember I mentioned Diane in an earlier email?

I want to tell you what happened after she got certified.

Diane was a nurse for 40 years. Burned out. Exhausted. Ready to quit healthcare entirely.

Then she got her WH-FC certification through ASI.

Month 1: She was nervous. Excited. Had no idea what she was doing. But she had knowledge now - and a credential that proved it.

Month 2: She posted in a Facebook group about hormone health. Just shared something she'd learned. Five women messaged her asking for help.

Month 3: Three of those women became paying clients. They paid her $250 each for an hour of her time.

Month 6: She quit her nursing job. Not because she hated nursing - but because she could finally help women the way she always wanted to. On her own terms.

Today: Diane works from home. Makes $8,000/month. Sees 8-10 clients a week, all from referrals.

Here's what changed for Diane:

Before: "Diane Smith, RN, Retired"
After: "Diane Smith, RN, WH-FC - Certified Women's Health Practitioner"

That little addition changed EVERYTHING. How clients saw her. How she saw herself.

Her husband? He used to roll his eyes when she'd study late at night. Now he tells everyone about his wife "the health expert."

{{firstName}}, I'm not telling you Diane's story to sell you something.

I'm telling you because... maybe you see yourself in her?

Maybe you've felt stuck. Overworked. Underpaid. Knowing you could do more, but not sure how.

If that's you, I just want you to know: there IS a path forward.

${ASI_SIGNATURE}`),
    },

    // Email 10 - Day 18: Day in the Life + Identity
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

9:00am - First client call. A woman in Texas struggling with hormone symptoms. We review her case, talk through what's going on, plan next steps. I sign my notes: "Sarah, WH-FC"

10:30am - Second call. Follow-up with a long-term client who's finally sleeping through the night after 4 years of insomnia. She cries happy tears. I might too.

12:00pm - Lunch. At home. Not rushing to a break room.

1:00pm - Check the ASI Practitioner Directory. Three new inquiry requests came in from women searching for certified practitioners in my area. I respond to each one.

2:30pm - Record content. Answer community questions from fellow practitioners.

3:30pm - Pick up my daughter from school. Hear about her day while it's still fresh.

Evening - Dinner together. Present. Not exhausted.

No commute. No 14-hour days. No asking permission to take a day off.

I introduce myself differently now: "I'm Sarah, a certified practitioner specializing in women's health." That sentence changed my income, my schedule, and my self-respect.

This isn't about being lazy. I work hard. I love what I do.

But I work on MY terms. For people I choose. Solving problems that matter.

That's the real reward.

${ASI_SIGNATURE}

P.S. When I updated my LinkedIn to show "WH-FC | Certified Women's Health Practitioner" - that was the day I felt like I'd made it.`),
    },

    // Email 11 - Day 21: Common Questions + Authority + Stats
    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: questions you might be asking",
        content: cleanContent(`{{firstName}},

I've been doing this long enough to know what you might be thinking.

Not objections. Just... questions. Honest ones.

Let me try to answer a few with real data from our 20,000+ practitioners:

"Can I really do this?"

Yes. Our practitioner survey shows:
- 34% come from nursing/medical backgrounds
- 28% come from wellness (yoga, nutrition, coaching)
- 38% have NO health background at all

Background doesn't predict success. Commitment does.

"Isn't the health space saturated?"

The wellness space? Maybe. But ASI-certified practitioners who understand root causes? There's a massive shortage. 73% of our graduates say demand exceeds their capacity.

"What if my family thinks this is silly?"

They might. At first. Until they see you actually helping people. Until they see you earning. Our survey shows: 89% of practitioners report increased family support after their first 3 months of practice.

"Am I too old to start?"

Our average practitioner age is 47. Diane was 62. Patricia was 58. Maria was a single mom at 43. Your age isn't a barrier - it's an asset. Life experience matters in this work.

"Is this credential legitimate?"

ASI is incorporated in Delaware, with offices in New York and Dubai. Our credentials are recognized by CMA, CPD, and IPHM. Every certificate has a unique verification ID that anyone can look up.

The only real failure is never starting.

${ASI_SIGNATURE}`),
    },

    // Email 12 - Day 24: Community + Directory Benefit
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
And you're learning alone, wondering if anyone else feels this way.

That's why the ASI Practitioner Network matters.

I'm not talking about a generic Facebook group with 50,000 strangers.

I'm talking about a tight community of 20,000+ certified practitioners across 47 countries. Women who understand the late-night study sessions. Who celebrate your first client with you. Who answer when you ask "has anyone dealt with this?"

And here's something most people don't realize:

When you're WH-FC certified, you're listed in the ASI Practitioner Directory.

That means women searching for "Women's Health Practitioner in [your city]" can FIND you. Without you spending a dollar on ads.

Diane got her first 3 clients from the directory alone.
Michelle gets 2-3 inquiries per week from directory searches.
Kelly stopped all her marketing - the directory brings enough leads.

No one succeeds alone. I didn't. Diane didn't. Maria didn't.

We all needed a community who understood. And a directory that brought clients to us.

${ASI_SIGNATURE}

P.S. Our private community has weekly Q&A calls where you can ask anything. Plus direct access to mentors who've been where you are.`),
    },

    // Email 13 - Day 27: Two Paths + Identity Transformation
    {
        id: 13,
        phase: "desire",
        day: 27,
        subject: "Re: thinking about your decision",
        content: cleanContent(`{{firstName}},

I want to try something with you.

Imagine it's exactly one year from now. January 2027.

You're sitting somewhere comfortable. A full year has passed.

Now imagine two versions of that moment:

PATH A: Nothing Changed

It's a year from now. Same job. Same frustrations. Same Sunday night dread.

The Mini Diploma you did? Maybe you used some of it for yourself. But it's sitting there, not really leading anywhere.

On LinkedIn, your title is the same.
Your income is the same.
When people ask what you do, you give the same answer.

Not terrible. Just... the same.

PATH B: You Made a Decision

It's a year from now. Everything is different.

You're WH-FC certified. You introduce yourself differently now:

"Hi, I'm {{firstName}}, WH-FC - I'm a Certified Women's Health Practitioner."

That sentence changed everything.

You're in the ASI directory. Clients find YOU. Last week, three women reached out just from searching.

You have 8 regular clients. Women who text you "I finally feel like myself again."

You're earning $4,000-$6,000/month from work that matters.

On LinkedIn, the alphabet after your name says it all: WH-FC.

And that feeling of "I'm meant for something more"? It's gone. Because you're DOING it.

Here's the thing, {{firstName}}:

Both of those futures take the same amount of time to arrive.

365 days will pass either way.

The only difference is the decision you make now.

${ASI_SIGNATURE}

P.S. Which path do you want? Reply and tell me. I genuinely want to know.`),
    },

    // Email 14 - Day 30: Personal Invitation + ASI Authority
    {
        id: 14,
        phase: "desire",
        day: 30,
        subject: "Re: an invitation",
        content: cleanContent(`{{firstName}},

It's been a month since you started your Women's Health journey with AccrediPro Standards Institute.

I want to personally invite you to take the next step.

Not a sales pitch. An invitation.

If you've been curious about what comes after the Mini Diploma... if you've wondered what it would take to actually help other women professionally... if you've thought "maybe I could become certified"...

Then I want to share the full path with you.

It's called the ASI Career Accelerator.

Here's what it includes:

- Full WH-FC Certification (your professional credential)
- Practice-building training (how to actually get clients)
- ASI Practitioner Directory listing (clients find YOU)
- Community access (20,000+ practitioners worldwide)
- Direct mentorship from certified practitioners
- Done-for-you templates, scripts, and systems

As a Mini Diploma graduate, you qualify for a $1,000 scholarship that isn't available to the public.

If you're curious, just reply with "tell me more" and I'll send you the full details.

No pressure. No countdown timers. No "this expires tonight."

Just an open door to becoming {{firstName}}, WH-FC.

Whenever you're ready.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 3: DECISION (Days 31-45)
    // ============================================

    // Email 15 - Day 31: Full Roadmap + Credential Emphasis
    {
        id: 15,
        phase: "decision",
        day: 31,
        subject: "Re: the complete roadmap to WH-FC",
        content: cleanContent(`{{firstName}},

You asked about the next step. Here it is.

The Complete Roadmap to WH-FC Certification:

STEP 0: Mini Diploma (Done)
You've already built the foundation. You understand root-cause thinking. You've proven you can learn this.

STEP 1: ASI Career Accelerator
This is where you become certified. Where you earn your WH-FC credential.

What's included:
- 21 comprehensive training modules
- Women's health deep dive (hormones, fertility, menopause)
- Lab interpretation beyond "normal" ranges
- Protocol design for real clients
- Business training: get clients, price services, build income
- ASI Practitioner Directory listing
- Private community of 20,000+ practitioners
- Weekly Q&A calls with mentor access
- Lifetime access

Time: Self-paced. Most complete in 8-12 weeks.

STEP 2: Practice Building (Included)
By the end, you'll have:
- Your WH-FC credential and verification ID
- Your professional badge for LinkedIn, website, emails
- Your listing in the ASI Practitioner Directory
- Your signature offer
- Your client acquisition system
- Confidence to charge real money

What certified practitioners earn:
- Beginner (0-6 months): $2,000-$4,000/month
- Established (6-12 months): $5,000-$8,000/month
- Advanced (12+ months): $8,000-$15,000/month

The question isn't "can you do this?"

You've already proven you can learn. The Mini Diploma showed that.

The question is: do you want to become {{firstName}}, WH-FC?

Reply if you have questions.

${ASI_SIGNATURE}`),
    },

    // Email 16 - Day 34: Investment + Scarcity
    {
        id: 16,
        phase: "decision",
        day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

Let's talk about the investment to become WH-FC certified.

The ASI Career Accelerator is $2,997.

But as a Mini Diploma graduate, you have a $1,000 scholarship.

Your price: $1,997.

One thing I should mention:

We only certify 50 practitioners per cohort.

Not because we want to be exclusive - but because we want to give everyone proper support, mentorship, and attention.

The current cohort has limited spots remaining.

Let me share how I think about the investment:

The Comparison:
- Traditional health coaching cert: $5,000-$15,000
- Nursing/medical school: $50,000-$150,000
- Staying stuck for another year: Priceless frustration

The Math:
Our certified practitioners charge $150-$400 per session.

$1,997 / $200 per session = 10 clients to break even.

After that? Profit.

Diane recovered her investment in month one.
Maria recovered it in week one.
Michelle recovered it before she finished (from her first clients during training).

The Real Cost:
What's the cost of NOT doing this?

Another year of the same routine?
Another year of knowing you could do more?
Another year of watching others become certified while you wait?

Payment Options:
If $1,997 upfront is too much:
- 3 payments of $699
- 6 payments of $349

No credit check. No interest.

Questions? Reply and ask me anything.

${ASI_SIGNATURE}

P.S. The $1,000 scholarship is real. It's for Mini Diploma graduates only. Once the cohort fills, you'd have to wait for the next one.`),
    },

    // NEW Email 17 - Day 36: The Credential That Changes Everything
    {
        id: 17,
        phase: "decision",
        day: 36,
        subject: "Re: the credential that changes everything",
        content: cleanContent(`{{firstName}},

Can I show you something?

This is the transformation I see over and over:

BEFORE WH-FC Certification:
"{{firstName}} - Health Enthusiast"
- No title to use professionally
- Clients hesitate to pay
- Not listed anywhere
- Introduces herself as "interested in health"

AFTER WH-FC Certification:
"{{firstName}}, WH-FC - Certified Women's Health Practitioner"
- Professional credential recognized by CMA, CPD, IPHM
- Clients trust and pay immediately
- Listed in ASI Directory (clients find HER)
- Introduces herself as a certified professional

That little change - those letters after your name - it transforms EVERYTHING.

Here's what WH-FC gives you:

The Credential: "WH-FC" - Women's Health Foundation Certified
You can legally use this title. On your website. LinkedIn. Business cards. Email signature.

The Badge: Professional digital badge you can display anywhere
Shows you're verified. Links to your credential page.

The Directory Listing: You appear in ASI's public practitioner search
Women looking for "certified women's health practitioner near me" can FIND you.

The Verification Page: Anyone can verify your credential
https://accredipro.com/verify/[YOUR-ID]
Shows your name, credential, status, issue date.

The Identity: You become someone new
You're not "interested in women's health" anymore. You're a certified practitioner. The way you carry yourself changes. The way others see you changes.

Maria told me: "The day I updated my LinkedIn to show WH-FC was the day everything clicked. I wasn't 'trying to be' a practitioner anymore. I WAS one."

You're not buying a course.
You're becoming a new person with a new identity and a new career.

Ready to become {{firstName}}, WH-FC?

Just reply.

${ASI_SIGNATURE}`),
    },

    // Email 18 - Day 38: Objection Crusher + Data
    {
        id: 18,
        phase: "decision",
        day: 38,
        subject: "Re: the thing that's stopping you",
        content: cleanContent(`{{firstName}},

I've talked to thousands of women at this stage.

Let me address what might be holding you back - with real data from our 20,000+ practitioners:

"I don't have time."
Our practitioner survey: 67% of certified practitioners work full-time jobs AND completed certification.
Average study time: 5-7 hours/week
Format: 100% self-paced. No live requirements.
Maria studied while her 3 kids slept. Finished in 10 weeks.

"I can't afford it."
Payment plan: $349/month for 6 months = $11/day
ROI: Average practitioner earns back investment in first 6 clients
Guarantee: 30 days, full refund, no questions (under 3% refund rate)

"I'm not qualified."
38% of our practitioners had ZERO health background before ASI
You finished the Mini Diploma. You can learn this.
The certification goes deeper, not harder.

"What if I can't get clients?"
73% of practitioners say client demand exceeds their capacity
ASI Directory brings passive leads (you're listed for free)
Client acquisition system included in training

"My family will think I'm crazy."
Survey: 89% report increased family support after 3 months
They're skeptical now. They'll be proud later.

"What if this is a scam?"
ASI: Delaware corporation, offices in NYC and Dubai
Accredited by: CMA, CPD, IPHM
20,000+ certified practitioners worldwide
Every credential has public verification ID

So what's REALLY stopping you?

Reply honestly. I want to help.

${ASI_SIGNATURE}`),
    },

    // Email 19 - Day 40: Payment Plan + FOMO
    {
        id: 19,
        phase: "decision",
        day: 40,
        subject: "Re: making it work",
        content: cleanContent(`{{firstName}},

I want to talk about something real.

Money.

For a lot of women, it's not that they don't WANT to become certified. It's that the investment feels scary.

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

While you're reading this email, other women are deciding.

Yesterday alone, 23 women enrolled in the Career Accelerator.

They're not smarter than you. Not less busy. Not richer.

They just decided that becoming certified was worth it.

Maria signed up for the payment plan as a single mom with three kids. She figured out $349/month. It was tight.

Ten months later? She's earning $12,000/month.

The investment paid itself back 60x over.

If cost is genuinely the barrier - not fear, but actual cost - reply and tell me. We might be able to work something out.

${ASI_SIGNATURE}

P.S. Our current cohort has limited spots. I don't say that to pressure you - it's just the reality. When it fills, you'd need to wait for the next one.`),
    },

    // Email 20 - Day 42: The Directory (NEW - Client Acquisition)
    {
        id: 20,
        phase: "decision",
        day: 42,
        subject: "Re: how clients find you",
        content: cleanContent(`{{firstName}},

Can I tell you about the ASI Practitioner Directory?

Most certification programs teach you skills... then leave you to figure out how to get clients.

We do something different.

When you become WH-FC certified, you're automatically listed in our public Practitioner Directory.

Here's how it works:

1. A woman in Dallas searches Google for "certified women's health practitioner near me"

2. The ASI Directory ranks high (we've invested heavily in SEO)

3. She finds three WH-FC practitioners in the Dallas area

4. She clicks your profile, sees your credentials, and sends an inquiry

5. You get an email: "New client request from ASI Directory"

This isn't theoretical. Our practitioners report:

Diane: "3 of my first 5 clients came from directory searches"
Michelle: "I get 2-3 inquiries per week. I don't do any marketing."
Kelly: "I stopped running Facebook ads. The directory is enough."

Average certified practitioner: 4-7 directory inquiries per month

These are warm leads. Women actively searching for certified help.

No cold calling. No dancing on TikTok. No awkward networking.

Just your profile in the directory, and women finding YOU.

This alone - the passive client acquisition - is worth more than the investment.

${ASI_SIGNATURE}

P.S. Your directory listing goes live within 48 hours of certification. No extra fee. No annual cost. Included forever.`),
    },

    // Email 21 - Day 43: Guarantee
    {
        id: 21,
        phase: "decision",
        day: 43,
        subject: "Re: the guarantee",
        content: cleanContent(`{{firstName}},

I want to tell you about our guarantee.

30 days. No questions asked.

If you enroll and decide within the first 30 days that this isn't right for you - for ANY reason - email us and we'll refund every penny.

No hassle. No awkward conversation. No guilt.

Why can I offer this?

Because ASI stands behind every credential we issue.

Our refund rate is under 3%. Not because we make it hard - we don't. But because people get results.

They start learning and realize: "Oh. This is actually incredible."

They connect with the community and feel: "These are my people."

They finish their first module and think: "I can actually become WH-FC."

By the end of 30 days, most people can't imagine NOT continuing.

But if you're in that 3%? That's okay. Full refund, no drama.

So here's what I want you to understand:

There is no risk.

Either you love it, get certified, and it changes your life.

Or you don't, and you get your money back.

The only thing you lose by NOT trying? Time. And the possibility of becoming {{firstName}}, WH-FC.

${ASI_SIGNATURE}`),
    },

    // Email 22 - Day 45: Ready When You Are + Identity Close
    {
        id: 22,
        phase: "decision",
        day: 45,
        subject: "Re: no pressure",
        content: cleanContent(`{{firstName}},

This is the last email I'll send about the Career Accelerator for a while.

I've shared the roadmap.
I've shared the WH-FC credential.
I've shared the investment.
I've shared the directory.
I've shared the guarantee.
I've shared the stories.

Now the decision is yours.

If you're ready - the door is open. Your $1,000 scholarship is waiting.

Just reply and say "I'm in" and I'll send you the enrollment link.

When you enroll, here's what happens:

Day 1: Welcome to ASI. You're officially a WH-FC candidate.
Week 1-4: Core training. You're building real knowledge.
Week 5-8: Clinical depth. You're becoming dangerous (in the best way).
Week 9-12: Practice building. You're getting your first clients.
Certification Day: You become {{firstName}}, WH-FC.

Your badge goes live. Your directory listing goes live. You're in.

If you're not ready - that's okay too. I won't keep pushing. I'll just keep sending valuable content. We'll stay connected.

But I do want to say one thing:

The women who succeed at this aren't the ones with the most money, time, or confidence.

They're the ones who decided.

Despite the fear. Despite the uncertainty. Despite the voices.

They decided their future was worth betting on.

That's it.

Whatever you decide, I believe in you.

${ASI_SIGNATURE}

P.S. If you enroll this week, reply after you sign up and I'll schedule a personal welcome call with you.`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 46-60)
    // ============================================

    // Email 23 - Day 48: Still Thinking + FOMO
    {
        id: 23,
        phase: "reengage",
        day: 48,
        subject: "Re: still thinking about it?",
        content: cleanContent(`{{firstName}},

Just checking in.

I know I said I wouldn't push. And I won't.

But I wanted you to know:

47 women enrolled in the Career Accelerator this week.

They're already in the community. Already starting Module 1. Already on the path to WH-FC.

I'm not saying this to make you feel bad.

I'm saying it because... they were where you are a week ago. Thinking. Wondering. Asking the same questions.

The only difference? They decided.

If you're still thinking... if you have questions you haven't asked... if there's something specific holding you back...

Reply and tell me.

Sometimes the thing we need most is just someone to talk it through with.

I'm here. No pressure.

${ASI_SIGNATURE}`),
    },

    // Email 24 - Day 52: New Resource (Value)
    {
        id: 24,
        phase: "reengage",
        day: 52,
        subject: "Re: something you might find useful",
        content: cleanContent(`{{firstName}},

I put together something I thought you'd find valuable.

It's from our ASI clinical team - a breakdown of the 5 hormone patterns we see most often in women over 35.

Signs to look for, questions to ask, and basic support ideas.

Nothing complicated. Just practical information you can use for yourself or women you know.

If you want it, just reply with "HORMONES" and I'll send it over.

No strings attached. No sales pitch. Just value.

${ASI_SIGNATURE}

P.S. This is the kind of content our WH-FC practitioners use with clients every day. Figured you'd appreciate a preview.`),
    },

    // Email 25 - Day 56: What's New
    {
        id: 25,
        phase: "reengage",
        day: 56,
        subject: "Re: something new",
        content: cleanContent(`{{firstName}},

Quick update for you.

We just added new content to the Career Accelerator:

- Complete module on perimenopause and menopause support
- Client intake templates (523 practitioners using these now)
- Updated "first 5 clients" roadmap
- New case studies from recent graduates

The program keeps getting better based on what our 20,000+ practitioners tell us works.

If you ever decide to join, all of this is waiting for you.

Your $1,000 graduate scholarship is still available.

Just wanted you to know.

${ASI_SIGNATURE}`),
    },

    // Email 26 - Day 60: Stay Connected + Identity Hook
    {
        id: 26,
        phase: "reengage",
        day: 60,
        subject: "Re: let's stay connected",
        content: cleanContent(`{{firstName}},

It's been two months since you started your Women's Health Mini Diploma with AccrediPro Standards Institute.

I hope you've found value in what you learned.

Even if you never go further - you now understand your own body better. You can recognize symptoms. You know questions to ask. That knowledge is yours forever.

Going forward, I'll send you occasional emails. Tips, stories, resources. Nothing overwhelming. Just staying in touch.

And if you ever decide you want to become WH-FC certified - whether that's in a month, six months, or a year - the door will be open.

Your graduate scholarship will be there.
The community will be there.
The directory will be there.
I'll be there.

Thank you for being part of the ASI community, {{firstName}}.

I mean that.

And whenever you're ready to become {{firstName}}, WH-FC - you know where to find me.

Just reply.

${ASI_SIGNATURE}

---
AccrediPro Standards Institute
New York | Dubai | 20,000+ Practitioners Worldwide
The Gold Standard in Wellness Certification`),
    },
];

export type WHNurtureEmailV2 = typeof WH_NURTURE_60_DAY_V2[number];
