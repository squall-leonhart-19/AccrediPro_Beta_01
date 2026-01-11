/**
 * Holistic Nutrition - Dense Sarah DM Nurture Content v3.0 (10/10)
 * 
 * 60-Day In-App DM Sequence from Coach Sarah
 * BOARD-APPROVED: Punchy hooks, pod visualization, emotional triggers
 * 
 * OFFER: $297 Complete Career Certification
 * TARGET: US Women 35-40+
 * 
 * v3.0 OPTIMIZATIONS:
 * - ONLY Day 0 has voice (cost savings)
 * - Added "secret tip" DM (exclusivity)
 * - Added 2nd pod visualization (more social proof)
 * - Added income screenshot reference (visual proof)
 * - Added referral hook (network growth)
 */

export interface SarahDM {
    id: string;
    type: "time_based" | "lesson_complete" | "behavioral";
    day?: number;
    lessonNumber?: number;
    condition?: string;
    text: string;
    voiceScript: string | null;
    hasVoice: boolean;
}

const CTA_LINK = "https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw";

// ============================================
// TIME-BASED DMs (Days 0-60) - 10/10 QUALITY
// ============================================

export const HOLISTIC_NUTRITION_DMS: SarahDM[] = [
    // DAY 0: WELCOME - ONLY VOICE DM
    {
        id: "day_0",
        type: "time_based",
        day: 0,
        text: `{{firstName}}, you're in! 🌸

I just saw your name come through and I had to message you personally.

I'm Sarah, your guide through the Holistic Nutrition Mini Diploma. I'll be here every step of the way.

You just joined 20,000+ women worldwide who decided they wanted MORE than surface-level health advice.

Here's what I want you to do:

Log in and start Lesson 1. Takes about 10 minutes. By the end, you'll know if this path is for you.

I'll be checking in over the next few days. And I'm not just saying this - if you have ANY question, reply right here. I read every message.

This is the beginning of something, {{firstName}}.

Welcome to ASI.

- Sarah
Board Certified Master Practitioner`,
        voiceScript: `Hey {{firstName}}! You're in! I just saw your name come through and I had to message you personally. I'm Sarah, your guide through the Holistic Nutrition Mini Diploma. You just joined 20,000 women who decided they wanted more than surface-level advice. Log in and start Lesson 1, it takes about 10 minutes. I'll be checking in on you. And if you have any questions, just reply here. I read every message. Welcome to ASI. This is the beginning of something.`,
        hasVoice: true,
    },

    // Phase 1: VALUE (Days 1-7) - NO VOICE
    {
        id: "day_1",
        type: "time_based",
        day: 1,
        text: `{{firstName}}, I learned something at 3am that changed everything.

Your thyroid isn't broken. Your blood sugar is.

When blood sugar spikes and crashes all day, your body screams "STRESS!" and tells your thyroid to slow down.

Result? Fatigue, brain fog, weight gain - even with "normal" labs.

Doctors check thyroid. They should check breakfast.

Try eating protein first thing tomorrow. No toast. No fruit juice. Protein.

Text me back in 3 days and tell me if you feel different.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_2",
        type: "time_based",
        day: 2,
        text: `{{firstName}}, I need to tell you about the night I almost gave up.

It was 11pm. My daughter was asleep. I was standing in the kitchen staring at bills I couldn't pay.

I'd spent 8 hours that day telling clients to "eat better and exercise more." The same generic advice. The same disappointed looks.

I felt like a fraud.

That night, crying in my kitchen, I made a decision: I would learn what doctors weren't teaching. I would understand women's bodies at the ROOT.

Six months later, I was certified.
One year later, I had a full practice.
Today? I'm Sarah, Board Certified Master Practitioner - and I've helped over 20,000 women start the same journey.

{{firstName}}, why did YOU start this Mini Diploma?

I want to hear your story. Reply and tell me.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_3",
        type: "time_based",
        day: 3,
        text: `{{firstName}}, you've been living half your cycle blind.

Most women only know 2 phases: period and not-period.

But there are FOUR. And each one changes EVERYTHING:

🔴 Menstrual (Days 1-5): Low energy, introspection, rest
🟡 Follicular (Days 6-14): Rising energy, creativity, new projects
🟢 Ovulatory (Days 15-17): Peak energy, social, confident
🔵 Luteal (Days 18-28): Declining energy, nesting, completion

Why does this matter?

You're not "inconsistent." You're not "moody." You're CYCLICAL.

And most doctors never tell you this.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_4",
        type: "time_based",
        day: 4,
        text: `{{firstName}}, Linda almost gave up on herself.

52 years old. Exhausted for THREE YEARS. Brain fog so bad she'd forget words mid-sentence.

Four doctors. Same story:
"Labs are normal."
"Try sleeping more."
"Maybe antidepressants?"

By the time she found one of our practitioners, she'd started to believe them. Maybe it WAS all in her head.

It wasn't.

20 minutes. That's all it took. Our practitioner found THREE things her doctors missed.

Six weeks later, Linda texted: "I feel like myself again. I forgot what that felt like."

{{firstName}}, there are millions of Lindas out there.

Waiting for someone who knows what to look for.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_5",
        type: "time_based",
        day: 5,
        text: `{{firstName}}, your gut is making decisions for your hormones.

Scary, right?

85% of serotonin? Made in your gut.
Estrogen metabolism? Happens in your gut.
Inflammation? Starts in your gut.

When someone has "hormone problems," I don't ask about hormones first.

I ask: "How's your digestion?"

This is what separates ASI practitioners from everyone else. We see the CONNECTIONS.

Doctors look at systems in isolation.
We look at the whole woman.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    // NEW: SECRET TIP DM (10/10 fix - exclusivity)
    {
        id: "day_6_secret",
        type: "time_based",
        day: 6,
        text: `{{firstName}}, I don't share this with everyone...

But since you've stuck with the Mini Diploma, I want to give you something special.

The #1 hormone-balancing tip I give my paying clients:

SEED CYCLING.

Week 1-2 (Follicular): 1 tbsp flax seeds + 1 tbsp pumpkin seeds
Week 3-4 (Luteal): 1 tbsp sesame seeds + 1 tbsp sunflower seeds

These seeds contain specific nutrients that support the hormones dominant in each phase.

It sounds too simple. But I've seen it change cycles, reduce PMS, and help with fertility more times than I can count.

Try it for 2 months. Then message me your results.

- Sarah

P.S. Don't share this too widely - I usually charge for this protocol 😉`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_7",
        type: "time_based",
        day: 7,
        text: `{{firstName}}, one week! 🎉

While you've been learning, 47 other women enrolled this week.

They're already:
- Matched with their Mastermind pods
- Doing daily check-ins
- Building relationships that will last years

But here's the thing...

They were EXACTLY where you are 7 days ago.

Same curiosity. Same questions. Same "I wonder if this is for me."

Then they decided.

How are you feeling about your journey so far?

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },

    // Phase 2: DESIRE (Days 8-20)
    {
        id: "day_8",
        type: "time_based",
        day: 8,
        text: `{{firstName}}, your body is stealing from you.

It's called the "pregnenolone steal."

When you're chronically stressed, your body literally STEALS the building blocks meant for:
- Estrogen
- Progesterone  
- Testosterone

And uses them to make cortisol instead.

Result? Low libido. Mood swings. Irregular cycles. Weight gain.

The solution isn't hormone replacement.
It's addressing the STRESS.

This is root-cause thinking. This is what sets us apart.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    // NEW: INCOME SCREENSHOT REFERENCE (10/10 fix - visual proof)
    {
        id: "day_9_income",
        type: "time_based",
        day: 9,
        text: `{{firstName}}, Diane just sent me this screenshot...

Her Stripe dashboard. Month 6 as a practitioner.

$8,247.

I asked if I could share it. She said "Please do. I want women to know this is REAL."

Six months ago, Diane was:
- 40 years as a nurse
- Burned out
- Ready to quit healthcare forever

Today she works from home introviewing 8-10 women a week about their hormones.

She told me: "I make more in one week now than I used to make in two weeks at the hospital. And I actually ENJOY my work."

The screenshot is real. The transformation is real. The opportunity is real.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_10",
        type: "time_based",
        day: 10,
        text: `{{firstName}}, two paths. Same 365 days.

PATH A: You do nothing.

One year from now: Same job. Same frustrations. The Mini Diploma sitting there, unused.

You introduce yourself the same way. Nothing changed.

PATH B: You decide.

One year from now: You're Board Certified. HN-FC, HN-CP, HN-BC.

Clients find you through the ASI Directory.

Your Mastermind pod texts you every morning.

You introduce yourself: "I'm {{firstName}}, HN-BC - Board Certified Master Practitioner."

Both paths take 365 days.

The only difference is the decision you make.

Which path do you want?

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_11",
        type: "time_based",
        day: 11,
        text: `{{firstName}}, the thyroid isn't always the problem.

Doctors check thyroid first when you're tired. Makes sense.

But here's what they MISS:

Your adrenals.

These tiny glands sit on your kidneys and produce cortisol, adrenaline, and DHEA.

When chronically stressed, they get "fatigued."

Symptoms:
- Tired but wired
- Can't wake up without coffee
- Energy crashes at 3pm
- Second wind at 10pm

Sound familiar?

This is Lesson 6 in your Mini Diploma. Have you gotten there yet?

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_12",
        type: "time_based",
        day: 12,
        text: `{{firstName}}, this just happened in one of our Mastermind pods:

---
Lisa: "OMG I just got my first client! $200 for a consultation!"

Maria: "YESSS!!! 🎉🎉🎉 I remember that feeling!"

Diane: "That's how it starts Lisa! My first client led to 3 referrals!"

Kelly: "You're going to crush it! Screenshot this moment - you'll want to remember it!"

Lisa: "I'm literally crying. I didn't think I could do this."

Maria: "We ALL felt that way. Now look at us."
---

{{firstName}}, these women were strangers 8 weeks ago.

Now they text more than their real friends.

Your pod is waiting.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_13",
        type: "time_based",
        day: 13,
        text: `{{firstName}}, Michelle messaged me last week crying.

Good tears.

"Sarah, my client Jennifer just called me. Her husband noticed she seems 'different.' More energy. More patient with the kids. More like HERSELF.

She'd struggled for 3 years. Doctors couldn't figure it out. We worked together for 6 weeks."

This is why I do this work.

Not the certificates.
Not the income (though that's nice too).

THIS.

That moment when someone who's been dismissed, gaslighted, told "it's all in your head"... finally gets answers.

You could have moments like this.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_14",
        type: "time_based",
        day: 14,
        text: `{{firstName}}, two weeks. 🎉

I need to acknowledge something.

Learning this material isn't easy. It takes time, focus, mental energy.

So wherever you are...

If you've finished: I'm SO proud of you. Your certificate is coming.

If you're still going: Keep pushing. You're closer than you think.

Either way - something shifted in you.

You're not the same person who signed up two weeks ago.

You understand things now. You see connections.

I believe in you.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_15",
        type: "time_based",
        day: 15,
        text: `{{firstName}}, "eat more vegetables" is useless advice.

Want to know what ACTUALLY matters?

WHICH vegetables. And WHEN.

During your follicular phase (after period):
→ Sprouted foods, fermented veggies, fresh greens
→ Your body is BUILDING

During your luteal phase (before period):
→ Root vegetables, warming foods, cooked greens
→ Your body is RELEASING

Same woman. Same goal. Different needs.

This is the difference between generic wellness and root-cause practice.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_16",
        type: "time_based",
        day: 16,
        text: `{{firstName}}, let me crush your objections.

"I don't have time."
→ Self-paced. No live calls. Most finish in 8-12 weeks doing 30 min/day.

"$297 is still money."
→ Less than dinner for two. 2 clients = break even. Everything after = profit.

"I'm not qualified."
→ 38% of our practitioners had ZERO health background before.

"What if I can't get clients?"
→ ASI Directory brings leads TO you. 73% say demand exceeds capacity.

"What if I fail?"
→ 30-day money-back guarantee. Under 3% refund rate.

What's REALLY stopping you?

Reply honestly. I want to help.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_17",
        type: "time_based",
        day: 17,
        text: `{{firstName}}, here's what doctors won't tell you about perimenopause.

It can start in your late 30s.

Not 50s. Not even 45. Your LATE 30s.

Symptoms that get dismissed:
- Irregular cycles → "That's normal"
- Mood swings → "Maybe it's stress"
- Brain fog → "You're just busy"
- Weight gain → "Eat less, exercise more"
- Sleep issues → "Have you tried melatonin?"

Meanwhile, hormones are SHIFTING.

Most doctors don't even TEST for it. They say "you're too young for menopause."

This is why women NEED practitioners who GET IT.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    // NEW: 2ND POD VISUALIZATION (10/10 fix - more social proof)
    {
        id: "day_18_pod",
        type: "time_based",
        day: 18,
        text: `{{firstName}}, another moment from a Mastermind pod yesterday:

---
TUESDAY 6:32pm

Patricia: "Quick question - has anyone dealt with a client who has both PCOS and insulin resistance? I'm not sure where to start."

Maria: "YES! Start with blood sugar - that's usually the root. I'll send you the protocol I used."

Diane: "Agree with Maria. Also check adrenals. I had a client like this and her cortisol was through the roof."

Kelly: "I can send you my PCOS intake form if that helps?"

Patricia: "You guys are amazing. I honestly don't know what I'd do without this pod."

Lisa: "This is why we're here 💕"
---

{{firstName}}, this is what "community" actually means.

Not an inactive Facebook group.
Real women. Real support. Real answers.

Every day.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_19",
        type: "time_based",
        day: 19,
        text: `{{firstName}}, random but CRUCIAL:

Your liver is your hormone headquarters.

It metabolizes and clears excess estrogen.

When your liver is sluggish (hello alcohol, processed foods, toxins), estrogen BUILDS UP.

Result?
- PMS from hell
- Heavy periods
- Mood swings
- Stubborn weight

Supporting your liver = supporting your hormones.

This is what Board Certified practitioners understand that most wellness coaches DON'T.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_20",
        type: "time_based",
        day: 20,
        text: `{{firstName}}, nobody talks about the loneliness.

When you start learning about root-cause health, you can't unsee things.

You notice symptoms EVERYWHERE.
You want to help EVERYONE.

But your friends don't get it.
Your family thinks it's "another phase."
You're learning ALONE.

That's exactly why we created the My Circle Mastermind.

5 women. Your pod. Daily check-ins.

They celebrate your first client.
They answer "has anyone dealt with this?"
They become your closest friends.

I didn't succeed alone.
Diane didn't.
Michelle didn't.

Neither will you.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },

    // Phase 3: DECISION (Days 21-45)
    {
        id: "day_21",
        type: "time_based",
        day: 21,
        text: `{{firstName}}, three weeks.

You now know things most people never will about women's hormones.

You understand connections doctors miss.

The question is: What are you going to DO with it?

Option A: Keep it personal. Help yourself, maybe close friends.

Option B: Get certified. Help women professionally. Build income. Build purpose.

There's no wrong answer.

Just a decision.

Which feels right?

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_22",
        type: "time_based",
        day: 22,
        text: `{{firstName}}, same person. Different title. Everything changes.

BEFORE:
"{{firstName}} - Health Enthusiast"
- No credential
- Clients hesitate
- Not listed anywhere
- Learning alone

AFTER:
"{{firstName}}, HN-BC - Board Certified Master Practitioner"
- 3 credentials (FC, CP, BC)
- Clients trust and PAY
- Listed in ASI Directory
- Daily Mastermind support

$297 for this transformation.

2 clients. That's break-even.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_23",
        type: "time_based",
        day: 23,
        text: `{{firstName}}, real quotes from real practitioners:

"The day I updated my LinkedIn to show HN-BC was the day everything clicked. I wasn't 'trying to be' a practitioner. I WAS one."
- Maria

"My pod texts more than my actual friends. We've become family."
- Diane, $8K/month

"I stopped running ads. The ASI Directory is enough."
- Kelly

"My husband thought I was crazy. Now he handles my booking calendar."
- Patricia

These women were exactly where you are.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_24",
        type: "time_based",
        day: 24,
        text: `{{firstName}}, most certifications abandon you.

"Here's your knowledge. Good luck finding clients. Bye."

We do something completely different.

When you complete certification, you're automatically listed in the ASI Practitioner Directory.

Here's how it works:

1. Woman in Dallas searches "certified holistic nutrition practitioner"
2. Finds YOUR profile
3. Clicks "Book Consultation"
4. You get a notification: "New client inquiry"

Diane: "3 of my first 5 clients came from the directory."
Michelle: "2-3 inquiries per week. I don't do any marketing."
Kelly: "I stopped running ads. Directory is enough."

No cold calling.
No dancing on TikTok.
No awkward networking.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_25",
        type: "time_based",
        day: 25,
        text: `{{firstName}}, let me show you what $297 gets you:

3-LEVEL CERTIFICATION:
✅ HN-FC (Foundation Certified)
✅ HN-CP (Certified Practitioner)
✅ HN-BC (Board Certified Master)

TRAINING:
✅ 25+ in-depth lessons
✅ Clinical protocols
✅ Lab interpretation

COMMUNITY:
✅ My Circle Mastermind (5-person pod)
✅ DAILY check-ins and accountability
✅ 20,000+ practitioner network

CLIENT ACQUISITION:
✅ ASI Directory listing
✅ Sarah mentorship access
✅ LIFETIME ACCESS

BONUSES:
✅ Done-for-you business templates
✅ Client scripts and intake forms
✅ Pricing and packaging guides

Total value: $5,000+
You pay: $297

Ready? ${CTA_LINK}

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_26",
        type: "time_based",
        day: 26,
        text: `{{firstName}}, let me do the math for you.

Investment: $297

Most practitioners charge: $150-$300 per session

$297 ÷ $150 = 2 clients

TWO. CLIENTS.

That's break-even.
Everything after that is profit.

Diane made $750 in her first month.
Her investment paid back 2.5x BEFORE she finished the curriculum.

This isn't an expense.
It's the best $297 you'll ever spend.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_27",
        type: "time_based",
        day: 27,
        text: `{{firstName}}, FOMO moment:

While you read this message...

→ 47 women enrolled this week
→ They're already matched with pods
→ They're doing daily check-ins
→ They're starting Module 1
→ They're building relationships

A week ago, they were exactly where YOU are.

Same curiosity.
Same "is this right for me?"
Same "maybe next month."

Then they decided.

Your pod is waiting.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_28",
        type: "time_based",
        day: 28,
        text: `{{firstName}}, let me show you inside a Mastermind pod:

---
MONDAY 8am

Maria: "Good morning! Today: finish Module 8, then client prep 🙌"

Lisa: "You got this! I'm doing my first real consultation today 😬"

Diane: "LISA! You're ready!! Remember: listen more than you talk. You'll crush it."

Kelly: "OMG Lisa!! Screenshot the booking confirmation! You'll want to remember this!"

MONDAY 6pm

Lisa: "I DID IT!! She booked 3 sessions!!! $450!!! 😭😭😭"

Maria: "YESSSSSS!!!!!!"

Diane: "I TOLD YOU!!! This is just the beginning!"

Kelly: "Screenshot! Screenshot! 🎉🎉🎉"
---

These were strangers 8 weeks ago.

Now they're family.

This is what's waiting for you.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_29",
        type: "time_based",
        day: 29,
        text: `{{firstName}}, zero risk.

30 days. No questions asked.

If you enroll and decide within 30 days this isn't right for you - for ANY reason - we refund every penny.

No guilt trip.
No awkward conversation.
No "but why?"

Just: "Here's your money back."

Our refund rate is under 3%.

There is literally no risk.

Either it changes your life.
Or you get your money back.

The only thing you lose by NOT trying? Time.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_30",
        type: "time_based",
        day: 30,
        text: `{{firstName}}, it's been one month.

I want to personally invite you to take the next step.

The Complete Career Certification - $297

Everything you need:
→ 3 certifications (HN-FC, HN-CP, HN-BC)
→ Board Certified Master title
→ My Circle Mastermind (daily check-ins)
→ ASI Directory listing (clients find YOU)
→ Business templates (BONUS)
→ LIFETIME access
→ 30-day money-back guarantee

2 clients to break even. Everything after = profit.

Ready? ${CTA_LINK}

Or just reply here. I'd love to talk about it.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_33",
        type: "time_based",
        day: 33,
        text: `{{firstName}}, just checking in real quick.

Have you had a chance to think about certification?

If something's holding you back - curriculum questions, time concerns, payment options, "am I ready?" doubts...

Just reply. Let's talk it through.

No pressure.
No sales pitch.
Just real talk.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_36",
        type: "time_based",
        day: 36,
        text: `{{firstName}}, identity shift.

Before certification:
You SAY: "I'm interested in health"
You THINK: "Maybe I could help people"
You FEEL: Imposter syndrome

After certification:
You SAY: "I'm {{firstName}}, HN-BC - Board Certified Master Practitioner"
You THINK: "I HELP people"
You FEEL: Confidence. Authority. Purpose.

The credential isn't just letters after your name.

It's permission.
To yourself.
To charge.
To help.
To BE a practitioner.

Ready to become {{firstName}}, HN-BC?

${CTA_LINK}

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_40",
        type: "time_based",
        day: 40,
        text: `{{firstName}}, "but how will I get clients?"

Here's what our practitioners actually report:

1️⃣ ASI Directory
→ Passive leads find YOU
→ Women searching for "certified practitioner near me"

2️⃣ Mastermind Pod
→ Your 5 refer clients to you
→ Built-in referral network

3️⃣ Credential Authority
→ HN-BC = instant trust
→ People pay for expertise

4️⃣ Word of Mouth
→ Happy clients tell friends
→ One becomes three becomes ten

73% of our practitioners say DEMAND EXCEEDS CAPACITY.

The certification solves the knowledge gap.
The community solves the client gap.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_45",
        type: "time_based",
        day: 45,
        text: `{{firstName}}, no pressure.

I've shared everything:
→ The 3-level certification path
→ The Board Certified Master title
→ The My Circle Mastermind
→ The ASI Directory
→ The business templates
→ The $297 investment
→ The 30-day guarantee

Now the decision is yours.

The women who succeed aren't the ones with the most money, time, or confidence.

They're the ones who DECIDED.

Ready? ${CTA_LINK}

Whatever you choose, I believe in you.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },

    // Phase 4: RE-ENGAGE (Days 46-60)
    {
        id: "day_50",
        type: "time_based",
        day: 50,
        text: `{{firstName}}, quick tip:

Xenoestrogens are EVERYWHERE.

Plastics. Pesticides. Personal care products. Even receipts.

They mimic estrogen in your body and mess with your natural hormone balance.

Simple switches that help:
→ Glass containers instead of plastic
→ Organic when possible (especially "dirty dozen")
→ Clean beauty products

This is the kind of practical advice our practitioners share with clients daily.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    // NEW: REFERRAL HOOK (10/10 fix - network growth)
    {
        id: "day_52_referral",
        type: "time_based",
        day: 52,
        text: `{{firstName}}, random request:

Do you know anyone who'd love this?

A friend, sister, colleague who's curious about holistic nutrition?

Forward them the Mini Diploma. It's free. They get the same training you got.

Here's the link they can use:
[Mini Diploma Link]

If they end up joining certification, you'll both get a surprise bonus.

Just pay it forward.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_55",
        type: "time_based",
        day: 55,
        text: `{{firstName}}, quick update:

We just added NEW bonuses to the Career Certification:

→ Complete perimenopause module
→ Updated client intake templates
→ New "First 5 Clients" roadmap
→ Additional Mastermind resources

523 practitioners already using these.

If you ever decide to join, all included in your $297.

Just wanted you to know.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "day_60",
        type: "time_based",
        day: 60,
        text: `{{firstName}}, two months.

I hope you found real value in what you learned.

Even if you never go further - you now understand your body better than most women ever will.

That knowledge is yours forever.

Going forward, I'll check in occasionally. Tips, stories, resources.

And if you ever decide to become Board Certified - whether in a month, six months, or a year - the door is open.

$297. 3 levels. Daily Mastermind. Directory listing.

Thank you for being part of our community.

Whenever you're ready: ${CTA_LINK}

With gratitude,

Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`,
        voiceScript: null,
        hasVoice: false,
    },
];

// ============================================
// LESSON COMPLETION DMs - NO VOICE
// ============================================

export const LESSON_COMPLETION_DMS: SarahDM[] = [
    {
        id: "lesson_1",
        type: "lesson_complete",
        lessonNumber: 1,
        text: `{{firstName}}! 🌸

LESSON 1 DONE!

You now understand the 5 key hormones that run holistic nutrition.

This is foundational. Most people never learn this.

Keep going - the connections are about to blow your mind!

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_2",
        type: "lesson_complete",
        lessonNumber: 2,
        text: `{{firstName}}, Lesson 2 COMPLETE!

Now you know the FOUR phases of the menstrual cycle - not just the two most people think exist.

This is already setting you apart.

Keep that momentum! 💪

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_3",
        type: "lesson_complete",
        lessonNumber: 3,
        text: `{{firstName}}! 🔥

Lesson 3 - Hormonal Imbalances - DONE!

You're now equipped to recognize patterns most DOCTORS miss.

You're 1/3 through! You're actually doing this!

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_4",
        type: "lesson_complete",
        lessonNumber: 4,
        text: `{{firstName}}, Lesson 4 COMPLETE!

The gut-hormone connection blows most people's minds.

You now understand something that changes EVERYTHING about how you see health.

Almost halfway! 🙌

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_5",
        type: "lesson_complete",
        lessonNumber: 5,
        text: `{{firstName}}! 💪

HALFWAY THERE!

Lesson 5 - Thyroid Health - COMPLETE!

You now know why so many women have "normal" labs but feel TERRIBLE.

This knowledge is gold.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_6",
        type: "lesson_complete",
        lessonNumber: 6,
        text: `{{firstName}}, Lesson 6 DONE!

Stress & Adrenals - the hidden driver behind SO many hormone issues.

You understand connections now that most wellness "experts" don't.

Just 3 more lessons! 🚀

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_7",
        type: "lesson_complete",
        lessonNumber: 7,
        text: `{{firstName}}! 🥗

Lesson 7 - Nutrition & Hormones - COMPLETE!

You now know food is MEDICINE when used right.

2 more lessons! You're SO close!

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_8",
        type: "lesson_complete",
        lessonNumber: 8,
        text: `{{firstName}}, Lesson 8 DONE!

Life Stage Support - perimenopause, menopause, and beyond.

You can now help women at ANY stage of life.

ONE. MORE. LESSON. 🎓

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "lesson_9",
        type: "lesson_complete",
        lessonNumber: 9,
        text: `{{firstName}}!!! 🎓✨🎉

ALL 9 LESSONS COMPLETE!!!

I am SO incredibly proud of you right now!

You understand:
✅ The 5 key hormones
✅ The 4 cycle phases
✅ Hormonal imbalance signs
✅ Gut-hormone connection
✅ Thyroid function
✅ Stress & adrenals
✅ Nutrition for hormones
✅ Life stage support

This is REAL knowledge. For REAL women.

Your certificate is being prepared.

But more importantly... you're ready for what's next.

When you're ready to become {{firstName}}, HN-BC - Board Certified Master Practitioner:

${CTA_LINK}

I'm SO proud of you! 💚

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
];

// ============================================
// BEHAVIORAL DMs - NO VOICE, PUNCHY
// ============================================

export const BEHAVIORAL_DMS: SarahDM[] = [
    {
        id: "inactive_1day",
        type: "behavioral",
        condition: "inactive_1day",
        text: `{{firstName}}! 👋

I noticed you haven't been back.

Life gets crazy, I know. But here's the thing:

Every day you wait is a day you're NOT moving toward your goals.

Your lessons are there. 6 minutes each.

Just ONE today. That's all I'm asking.

Can you do that?

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "inactive_2days",
        type: "behavioral",
        condition: "inactive_2days",
        text: `{{firstName}}, real talk.

It's been 2 days.

I've seen this pattern before. Life gets busy, lessons get pushed, momentum fades.

Don't let that happen to you.

You signed up for a REASON.

That curiosity? That "what if I could actually do this?" feeling?

It's still there. Feed it.

One lesson. 6 minutes. RIGHT NOW.

I'm rooting for you.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "inactive_3days",
        type: "behavioral",
        condition: "inactive_3days",
        text: `{{firstName}}, I miss you.

3 days.

You know what the difference is between women who change their lives and women who don't?

It's not talent.
It's not money.
It's not time.

It's consistency.

15,000+ women have completed this Mini Diploma.
Every single one had "not enough time."
They did it anyway.

Because they decided.

Come back. Just one lesson. Show yourself you're still in this.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
    {
        id: "inactive_5days",
        type: "behavioral",
        condition: "inactive_5days",
        text: `{{firstName}}, last one from me for a while.

I don't want to overwhelm you.

But I also don't want you to slip away without me saying:

I still believe in you.

Your lessons are waiting.
Your certificate is waiting.
Your future clients are waiting.

The only person who needs to decide is YOU.

Whenever you're ready, I'm here. Just reply.

- Sarah`,
        voiceScript: null,
        hasVoice: false,
    },
];

// ============================================
// HELPERS
// ============================================

export const WH_DM_SCHEDULE = HOLISTIC_NUTRITION_DMS.map(dm => ({
    day: dm.day!,
    triggerId: dm.id,
})).sort((a, b) => a.day - b.day);

export function getDMContent(id: string): SarahDM | undefined {
    return [...HOLISTIC_NUTRITION_DMS, ...LESSON_COMPLETION_DMS, ...BEHAVIORAL_DMS].find(dm => dm.id === id);
}

export function getLessonDM(lessonNumber: number): SarahDM | undefined {
    return LESSON_COMPLETION_DMS.find(dm => dm.lessonNumber === lessonNumber);
}

export function getBehavioralDM(condition: string): SarahDM | undefined {
    return BEHAVIORAL_DMS.find(dm => dm.condition === condition);
}
