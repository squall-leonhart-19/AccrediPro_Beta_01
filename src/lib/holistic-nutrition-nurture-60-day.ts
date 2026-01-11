/**
 * Holistic Nutrition Mini Diploma - 60-Day Nurture Sequence v3.0
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (WH-FC™ + WH-CP™ + WH-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons
 * - Sarah mentorship access
 * - My Circle Mastermind (5-person pod, DAILY check-ins)
 * - ASI Practitioner Directory listing
 * - Community access (20,000+ practitioners)
 * - LIFETIME ACCESS
 * 
 * BONUSES:
 * - Done-for-you business templates
 * - Client scripts & intake forms
 * - Pricing guides
 * 
 * ROI: 2 clients to break even
 * 
 * Phase 1 (Days 0-14): VALUE - Build trust, NO selling
 * Phase 2 (Days 15-30): DESIRE - Show transformation
 * Phase 3 (Days 31-45): DECISION - Clear $297 offer
 * Phase 4 (Days 46-60): RE-ENGAGE - Stay connected
 * 
 * Target: US Women 35-40+
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

export const HOLISTIC_NUTRITION_NURTURE_SEQUENCE = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    // Email 1 - Day 0: Welcome
    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Holistic Nutrition access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of over 20,000 women who've started this journey - practitioners in 47 countries who decided they wanted more than surface-level health advice.

Your Holistic Nutrition Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Master Practitioners.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

This is the beginning of something.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    // Email 2 - Day 1: Sarah's Story
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

I went from "Sarah who tries to help" to "Sarah, Board Certified Master Practitioner." The alphabet after my name changed everything. Clients trusted me. I trusted myself.

And now? I get to live what once felt impossible: helping women transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path - because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}} - what made you curious about women's health? What's your story?

Hit reply. I want to hear it.

With love,

${ASI_SIGNATURE}`),
    },

    // Email 3 - Day 3: Why Generic Fails
    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: why the usual advice doesn't work",
        content: cleanContent(`{{firstName}},

I need to tell you about Linda.

She came to one of our Board Certified practitioners last year. 52 years old. Exhausted for three years straight. Brain fog so bad she'd forget words mid-sentence.

She'd seen four doctors. They all said the same thing:

"Your labs are normal."
"Try to sleep more."
"Maybe it's just stress."
"Have you considered antidepressants?"

By the time she found a certified practitioner, she was starting to believe them. Maybe it WAS all in her head. Maybe this was just what 52 felt like.

It wasn't.

Within 20 minutes of looking at her case through a root-cause lens, the practitioner found three things her doctors missed. Not because they were bad doctors - because they weren't trained to look.

Six weeks later, Linda texted: "I feel like myself again. I forgot what that even felt like."

Here's the thing, {{firstName}}:

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Balance your hormones" doesn't help when you don't know WHICH ones are off.
"Reduce stress" doesn't help when the stress is coming from inside.

This is what you're learning in your Mini Diploma. This is the difference between surface-level wellness and root-cause understanding.

Have you started your lessons yet?

${ASI_SIGNATURE}

P.S. Linda now refers everyone to ASI-certified practitioners. Her exact words: "The doctors kept me sick. A certified practitioner made me well."`),
    },

    // Email 4 - Day 5: Client Win Story
    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: something incredible happened",
        content: cleanContent(`{{firstName}},

I have to share something that happened this week.

One of our Board Certified practitioners, Michelle, just sent me this message:

"Sarah, my client Jennifer just called me crying. Good tears. She said her husband noticed she seems 'different' - more energy, more patient with the kids, more like herself. She's been struggling for 3 years. Doctors couldn't figure it out. We worked together for 6 weeks."

This is why I do this work.

Not the certificates. Not the income (though that's nice too). THIS.

That moment when someone who's been dismissed, ignored, or told "it's all in your head" finally gets answers.

Michelle is one of 20,000+ ASI-certified practitioners now helping women around the world. She got certified 8 months ago. Now she has a full practice.

But more importantly - she gets to have moments like this. Where she changes someone's life.

{{firstName}}, I don't know exactly why you signed up for this Mini Diploma. Maybe for yourself. Maybe for a family member. Maybe because something inside you said "I need to learn this."

Whatever the reason - trust that instinct.

Keep going with your lessons.

${ASI_SIGNATURE}

P.S. How are you finding the lessons so far?`),
    },

    // Email 5 - Day 7: Engagement Question
    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

I've been thinking about you.

It's been a week since you started your Holistic Nutrition Mini Diploma, and I'm curious:

What's surprised you most so far?

When I ask our 20,000+ practitioners this question, the most common answers are:

1. "I had no idea about the four phases of the menstrual cycle" (most women only know two!)
2. "The gut-hormone connection blew my mind"
3. "I realized half my 'normal' symptoms... aren't normal at all"

What about you?

Just hit reply and tell me one thing that made you go "wow."

${ASI_SIGNATURE}

P.S. If you haven't had a chance to dive in yet, no judgment. But try to carve out 15 minutes this week. It's worth it.`),
    },

    // Email 6 - Day 10: Free Value Tip
    {
        id: 6,
        phase: "value",
        day: 10,
        subject: "Re: a tip most doctors don't know",
        content: cleanContent(`{{firstName}},

Quick health tip - something most doctors never mention:

Your thyroid and your blood sugar are connected.

If your blood sugar is constantly spiking and crashing, your body produces more cortisol to stabilize it.

High cortisol tells your thyroid: "Slow down. We're under stress."

Result? You feel tired, sluggish, brain-foggy... even if your thyroid labs look "normal."

This is what we call a "hidden driver" - something conventional medicine misses because they look at systems in isolation.

At ASI, we train practitioners to see these connections. It's why Board Certified practitioners get different results.

The fix isn't complicated:
- Eat protein with every meal (especially breakfast)
- Avoid the blood sugar rollercoaster
- Don't skip meals

Try it for one week and see how you feel.

${ASI_SIGNATURE}`),
    },

    // Email 7 - Day 12: Check-in
    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How are you doing with your Mini Diploma?

If you're cruising through - amazing. You're joining the 15,000+ women who've completed this training.

If life got in the way - that's okay too. No judgment.

The women who finish this Mini Diploma tell me it changed how they see their own health. And how they relate to women around them who are struggling.

Even 10 minutes at a time counts.

What's one thing I can help you with right now?

${ASI_SIGNATURE}

P.S. If you've finished or are close - reply with "DONE" and I'll send you something special about what comes next.`),
    },

    // Email 8 - Day 14: Two Weeks In
    {
        id: 8,
        phase: "value",
        day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started your Holistic Nutrition journey with AccrediPro Standards Institute.

I want to acknowledge something:

Learning this material isn't easy. It requires time, focus, and mental energy.

So wherever you are right now...

If you've finished: I'm SO proud of you. You now understand more about women's health than most people ever will. Your completion certificate is on its way.

And {{firstName}} - something shifted in you. You're not the same person who signed up two weeks ago. You understand things now. You see connections.

If you're still in progress: Keep going. You're building something valuable.

Whatever camp you're in:

I see you.
I believe in you.
I'm here if you need anything.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 15-30)
    // ============================================

    // Email 9 - Day 15: Diane's Transformation
    {
        id: 9,
        phase: "desire",
        day: 15,
        subject: "Re: Diane's transformation",
        content: cleanContent(`{{firstName}},

I want to tell you what happened to Diane after she got certified.

Diane was a nurse for 40 years. Burned out. Exhausted. Ready to quit healthcare entirely.

Then she got her 3-level certification through ASI.

Month 1: Nervous but excited. Had no idea what she was doing. But she had knowledge now - and a credential that proved it.

Month 2: Posted in a Facebook group about hormone health. Five women messaged her asking for help.

Month 3: Three became paying clients. $250 each for an hour of her time.

Month 6: Quit her nursing job. 

Today: Diane works from home. Makes $8,000/month. Sees 8-10 clients a week.

Here's what changed:

Before: "Diane Smith, RN, Retired"
After: "Diane Smith, RN, WH-BC - Board Certified Master Practitioner"

That little addition changed EVERYTHING.

And the best part? She's part of a 5-person Mastermind pod now. Daily check-ins. Women who understand. They've become her closest friends.

{{firstName}}, I'm telling you this because... maybe you see yourself in her?

${ASI_SIGNATURE}`),
    },

    // Email 10 - Day 18: Day in the Life
    {
        id: 10,
        phase: "desire",
        day: 18,
        subject: "Re: what my typical day looks like",
        content: cleanContent(`{{firstName}},

Want to know what my days look like now?

7:00am - Wake up naturally. Coffee. Read for 20 minutes.

8:00am - Check my Mastermind pod chat. Share my daily intention. Cheer on my pod members. We do this every single day - 5 of us, holding each other accountable.

9:00am - First client call. A woman in Texas with hormone symptoms. I sign my notes: "Sarah, WH-BC"

10:30am - Second call. A long-term client who's finally sleeping through the night. Happy tears.

12:00pm - Lunch at home.

1:00pm - Check the ASI Directory. Two new inquiries from women searching for practitioners.

3:30pm - Pick up my daughter from school.

Evening - Dinner together. Present. Not exhausted.

No commute. No 14-hour days. No asking permission.

I introduce myself differently now: "I'm Sarah, a Board Certified Master Practitioner specializing in women's health."

That sentence changed my income, my schedule, and my self-respect.

${ASI_SIGNATURE}

P.S. The daily Mastermind check-ins? They're what keep me going. Knowing 4 other women are counting on me to show up.`),
    },

    // Email 11 - Day 21: Common Questions
    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: questions you might be asking",
        content: cleanContent(`{{firstName}},

Let me answer the questions I know you're asking - with real data:

"Can I really do this?"

Yes. Our practitioner survey shows:
- 34% come from nursing/medical backgrounds
- 28% come from wellness (yoga, nutrition, coaching)
- 38% have NO health background at all

Background doesn't predict success. Commitment does.

"Am I too old?"

Our average practitioner age is 47. Diane was 62. Patricia was 58.

"Is this credential legitimate?"

ASI is incorporated in Delaware, with offices in New York and Dubai. Credentials recognized by CMA, CPD, and IPHM. Every certificate has a public verification ID.

"Will I actually get clients?"

73% of our practitioners say client demand exceeds their capacity.
The ASI Directory brings passive leads.
And your Mastermind pod becomes your referral network.

The only real failure is never starting.

${ASI_SIGNATURE}`),
    },

    // Email 12 - Day 24: Community + Mastermind
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
And you're learning alone.

That's why we created the My Circle Mastermind.

Here's how it works:

You get placed in a pod of 5 women. Your Circle.

Every single day:
- Morning intention sharing
- Quick wins and struggles
- Support and accountability
- Tips and resources

This isn't a generic Facebook group with 50,000 strangers.

This is YOUR 5. Women who understand. Who celebrate your first client with you. Who answer when you ask "has anyone dealt with this?"

Plus the ASI Directory where clients find YOU.

No one succeeds alone. I didn't. Diane didn't. Maria didn't.

${ASI_SIGNATURE}

P.S. The women in my original pod are now some of my closest friends. We still check in daily, 3 years later.`),
    },

    // Email 13 - Day 27: Two Paths
    {
        id: 13,
        phase: "desire",
        day: 27,
        subject: "Re: thinking about your decision",
        content: cleanContent(`{{firstName}},

Imagine it's one year from now. January 2027.

Two versions of that moment:

PATH A: Nothing Changed

Same job. Same frustrations. The Mini Diploma sitting there, not leading anywhere.

On LinkedIn, your title is the same.
No pod. No daily check-ins with women who get it.

Not terrible. Just... the same.

PATH B: You Made a Decision

You're Board Certified. Three levels complete: WH-FC, WH-CP, WH-BC.

You introduce yourself: "Hi, I'm {{firstName}}, WH-BC - Board Certified Master Practitioner."

You're in the ASI Directory. Clients find YOU.

You have your 5-person Mastermind pod. Daily accountability. Women who became your closest friends.

8 regular clients. $4,000-$6,000/month.

That feeling of "I'm meant for something more"? Gone. Because you're DOING it.

Both futures take the same 365 days to arrive.

The only difference is the decision you make now.

${ASI_SIGNATURE}

P.S. Which path do you want? Reply and tell me.`),
    },

    // Email 14 - Day 30: Personal Invitation
    {
        id: 14,
        phase: "desire",
        day: 30,
        subject: "Re: an invitation",
        content: cleanContent(`{{firstName}},

It's been a month since you started.

I want to personally invite you to take the next step.

If you've been curious about what comes after the Mini Diploma... if you've wondered what it would take to actually become certified and help women professionally...

Here's what's waiting for you:

The Complete Career Certification - $297

What's included:

ALL 3 CERTIFICATION LEVELS:
- WH-FC (Foundation Certified)
- WH-CP (Certified Practitioner)
- WH-BC (Board Certified Master)

THE TRAINING:
- 25+ in-depth lessons
- Clinical protocols
- Lab interpretation

THE COMMUNITY:
- My Circle Mastermind (5-person pod)
- DAILY check-ins and accountability
- 20,000+ practitioner network

CLIENT ACQUISITION:
- ASI Directory listing (clients find you)
- Sarah mentorship access
- LIFETIME ACCESS

BONUSES:
- Done-for-you business templates
- Client scripts and intake forms
- Pricing and packaging guides

Total value: $5,000+
You pay: $297

Ready to join? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Or just reply "tell me more" for the full details.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 3: DECISION (Days 31-45)
    // ============================================

    // Email 15 - Day 31: Full Roadmap
    {
        id: 15,
        phase: "decision",
        day: 31,
        subject: "Re: the complete roadmap",
        content: cleanContent(`{{firstName}},

Here's the complete path to becoming a Board Certified Master Practitioner:

STEP 0: Mini Diploma (Done)
You've already built the foundation.

STEP 1: Complete Career Certification ($297)
Everything you need in one package:

LEVEL 1: WH-FC - Foundation Certified
- Core principles
- Basic assessment skills
- Your first credential

LEVEL 2: WH-CP - Certified Practitioner
- Clinical depth
- Protocol design
- Advanced techniques

LEVEL 3: WH-BC - Board Certified Master
- Elite status
- Complex cases
- Full authority

PLUS:
- My Circle Mastermind (5-person pod with daily check-ins)
- ASI Directory listing
- Business templates (BONUS)
- Client scripts (BONUS)
- Pricing guides (BONUS)
- Sarah mentorship access
- LIFETIME ACCESS

What certified practitioners earn:
- Beginner: $2,000-$4,000/month
- Established: $5,000-$8,000/month
- Advanced: $8,000-$15,000/month

The math: $297 / $150 per session = 2 clients to break even.
TWO. CLIENTS.

Reply if you have questions.

${ASI_SIGNATURE}`),
    },

    // Email 16 - Day 34: The Investment
    {
        id: 16,
        phase: "decision",
        day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

Let's talk about the investment.

The Complete Career Certification is $297.

For context:
- Traditional health coaching cert: $5,000-$15,000
- Nursing school: $50,000+
- Other certification programs: $997-$2,997

What you get for $297:
- 3-level certification (FC + CP + BC)
- Board Certified Master title
- 25+ lessons
- My Circle Mastermind (daily accountability)
- ASI Directory listing
- Business templates (bonus)
- Client scripts (bonus)
- Pricing guides (bonus)
- Mentorship access
- LIFETIME access

Total value: $5,000+
You pay: $297

The ROI math:

Most practitioners charge $150-$300 per session.

$297 / $150 = 2 clients.

TWO CLIENTS and you've made your money back.
Everything after that is profit.

Diane made $750 in her first month. Her investment paid back 2.5x before she even finished.

This isn't an expense. It's the best $297 you'll ever spend.

Ready to start? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // Email 17 - Day 36: The Credential
    {
        id: 17,
        phase: "decision",
        day: 36,
        subject: "Re: the credential that changes everything",
        content: cleanContent(`{{firstName}},

Can I show you something?

BEFORE Certification:
"{{firstName}} - Health Enthusiast"
- No title
- Clients hesitate
- Not listed anywhere

AFTER Certification:
"{{firstName}}, WH-BC - Board Certified Master Practitioner"
- Professional credential (CMA, CPD, IPHM recognized)
- Clients trust and pay
- Listed in ASI Directory
- Daily support from your Mastermind pod

What you get:

3 CREDENTIALS:
- WH-FC (Foundation Certified)
- WH-CP (Certified Practitioner)
- WH-BC (Board Certified Master)

THE BADGE:
Display on LinkedIn, website, email signature.

THE DIRECTORY:
Women searching for "certified women's health practitioner" find YOU.

THE POD:
5-person Mastermind. Daily check-ins. Lifetime friends.

THE VERIFICATION:
Anyone can verify your credential at accredipro.com/verify

Maria told me: "The day I updated my LinkedIn to show WH-BC was the day everything clicked. I wasn't 'trying to be' a practitioner. I WAS one."

You're not buying a course for $297.

You're becoming {{firstName}}, WH-BC - Board Certified Master Practitioner.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // Email 18 - Day 38: Objection Crusher
    {
        id: 18,
        phase: "decision",
        day: 38,
        subject: "Re: the thing that's stopping you",
        content: cleanContent(`{{firstName}},

Let me address what might be holding you back:

"I don't have time."
- Self-paced. No live requirements.
- Most complete in 8-12 weeks.
- Daily Mastermind check-ins take 5 minutes.

"$297 is still money."
- Less than a nice dinner for two.
- 2 clients = break even.
- Everything after = profit.

"I'm not qualified."
- 38% of practitioners had ZERO health background.
- The training teaches you everything.
- Your Mastermind pod supports you daily.

"What if I can't get clients?"
- ASI Directory brings passive leads.
- 73% of practitioners say demand exceeds capacity.
- Your pod becomes your referral network.

"What if my family thinks I'm crazy?"
- They might. Until you start earning.
- 89% report increased family support after 3 months.

"What if it doesn't work?"
- 30-day money-back guarantee.
- Under 3% refund rate. 

So what's REALLY stopping you?

Reply honestly. I want to help.

${ASI_SIGNATURE}`),
    },

    // Email 19 - Day 40: The Mastermind
    {
        id: 19,
        phase: "decision",
        day: 40,
        subject: "Re: the daily check-ins that change everything",
        content: cleanContent(`{{firstName}},

Can I tell you about My Circle Mastermind?

Most certifications give you training and say "good luck."

We do something different.

When you enroll, you're matched with a pod of 5 women. Your Circle.

Here's what happens EVERY DAY:

MORNING: Share your intention
"Today I'm going to finish Module 3 and reach out to one potential client."

MIDDAY: Quick wins
"I just booked my first discovery call!"

EVENING: Accountability
"Did you do what you said you'd do? What's tomorrow?"

TIPS & RESOURCES: Shared constantly
"Here's the intake form I use - feel free to copy it."
"This is how I handled a difficult client today."

This isn't optional. This is what makes people succeed.

The women in your pod become your inner circle. They understand what you're building. They celebrate your wins. They pick you up when you're struggling.

Diane told me: "My pod texts more than my actual friends. We've become family."

When you enroll for $297, you don't just get training.

You get your 5.

${ASI_SIGNATURE}`),
    },

    // Email 20 - Day 42: The Directory
    {
        id: 20,
        phase: "decision",
        day: 42,
        subject: "Re: how clients find you",
        content: cleanContent(`{{firstName}},

Most certification programs teach you skills... then leave you to figure out clients.

We do something different.

When you complete certification, you're automatically listed in the ASI Practitioner Directory.

Here's how it works:

1. A woman in Dallas searches "certified women's health practitioner near me"

2. ASI Directory ranks high (we invest heavily in SEO)

3. She finds WH-BC practitioners in her area

4. She clicks your profile and sends an inquiry

5. You get an email: "New client request"

Our practitioners report:

Diane: "3 of my first 5 clients came from the directory."
Michelle: "2-3 inquiries per week. I don't do any marketing."
Kelly: "I stopped running ads. The directory is enough."

No cold calling. No dancing on TikTok. No awkward networking.

Just your profile, and women finding YOU.

This is included in your $297. No extra fee. No annual cost.

${ASI_SIGNATURE}`),
    },

    // Email 21 - Day 43: Guarantee
    {
        id: 21,
        phase: "decision",
        day: 43,
        subject: "Re: the guarantee",
        content: cleanContent(`{{firstName}},

30 days. No questions asked.

If you enroll and decide within 30 days that this isn't right for you - for ANY reason - email us and we'll refund every penny.

No hassle. No awkward conversation.

Why can I offer this?

Because the program works. Our refund rate is under 3%.

People start learning and realize: "This is incredible."
They connect with their pod and feel: "These are my people."
They finish their first module and think: "I can actually do this."

By the end of 30 days, most can't imagine NOT continuing.

But if you're in that 3%? Full refund. No drama.

There is no risk.

Either you love it and it changes your life.
Or you get your money back.

The only thing you lose by NOT trying? Time.

${ASI_SIGNATURE}`),
    },

    // Email 22 - Day 45: Ready When You Are
    {
        id: 22,
        phase: "decision",
        day: 45,
        subject: "Re: no pressure",
        content: cleanContent(`{{firstName}},

This is the last decision email for a while.

I've shared everything:
- The 3-level certification path
- The Board Certified Master title
- The My Circle Mastermind (daily check-ins)
- The ASI Directory
- The business templates (bonus)
- The $297 investment
- The 30-day guarantee

Now the decision is yours.

If you're ready - just reply "I'M IN" and I'll send the enrollment link.

When you enroll, here's what happens:

Day 1: Welcome. You're matched with your Mastermind pod.
Week 1: Core training begins. Daily pod check-ins start.
Week 4-8: Clinical depth. You're building real skills.
Week 8-12: Practice building. First clients.
Certification: You become {{firstName}}, WH-BC.

Your badge. Your directory listing. Your pod. Your career.

If you're not ready - that's okay too. I'll keep sending value.

But I want to say one thing:

The women who succeed at this aren't the ones with the most money, time, or confidence.

They're the ones who decided.

Whatever you decide, I believe in you.

${ASI_SIGNATURE}

P.S. $297. 2 clients to break even. 30-day guarantee. What's holding you back?

Enroll now: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 46-60)
    // ============================================

    // Email 23 - Day 48: Still Thinking
    {
        id: 23,
        phase: "reengage",
        day: 48,
        subject: "Re: still thinking about it?",
        content: cleanContent(`{{firstName}},

Just checking in.

47 women enrolled this week.

They're already matched with their pods. Already doing daily check-ins. Already starting Module 1.

I'm not saying this to pressure you.

Just... they were where you are a week ago.

If you're still thinking... if there's something specific holding you back...

Reply and tell me. I want to help.

${ASI_SIGNATURE}`),
    },

    // Email 24 - Day 52: Value Resource
    {
        id: 24,
        phase: "reengage",
        day: 52,
        subject: "Re: something you might find useful",
        content: cleanContent(`{{firstName}},

I put together something I thought you'd find valuable.

It's a breakdown of the 5 hormone patterns we see most often in women over 35. Signs to look for, questions to ask, basic support ideas.

If you want it, just reply with "HORMONES" and I'll send it over.

No strings. No pitch. Just value.

${ASI_SIGNATURE}

P.S. This is the kind of content our Board Certified practitioners use with clients daily.`),
    },

    // Email 25 - Day 56: What's New
    {
        id: 25,
        phase: "reengage",
        day: 56,
        subject: "Re: something new",
        content: cleanContent(`{{firstName}},

Quick update:

We just added new bonuses to the Career Certification:

- Complete perimenopause module
- Updated client intake templates
- New "first 5 clients" roadmap
- Additional Mastermind resources

523 practitioners using these already.

If you ever decide to join, all of this is included in your $297.

Just wanted you to know.

${ASI_SIGNATURE}`),
    },

    // Email 26 - Day 60: Stay Connected
    {
        id: 26,
        phase: "reengage",
        day: 60,
        subject: "Re: let's stay connected",
        content: cleanContent(`{{firstName}},

It's been two months since you started.

I hope you've found value in what you learned.

Even if you never go further - you now understand your own body better. That knowledge is yours forever.

Going forward, I'll send occasional emails. Tips, stories, resources. Just staying in touch.

And if you ever decide you want to become Board Certified - whether in a month, six months, or a year - the door is open.

$297. 3 levels. Daily Mastermind. Directory listing. Business templates.

Thank you for being part of the ASI community, {{firstName}}.

Whenever you're ready to become {{firstName}}, WH-BC - you know where to find me.

${ASI_SIGNATURE}

---
AccrediPro Standards Institute
New York | Dubai | 20,000+ Practitioners Worldwide
The Gold Standard in Wellness Certification

Enroll anytime: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw`),
    },
];

export type WHNurtureEmailV3 = typeof HOLISTIC_NUTRITION_NURTURE_SEQUENCE[number];
