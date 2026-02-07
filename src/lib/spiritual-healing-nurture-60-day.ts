/**
 * Certified Spiritual Healing Practitioner Mini Diploma - 60-Day Nurture Sequence
 *
 * OFFER: $297 Complete Career Certification
 *
 * What's Included:
 * - 3-Level Certification (SH-FC + SH-CP + SH-BC)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on spiritual healing, intuitive development, soul-centered practice
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
 * Target: US Women 35-55+ seeking spiritual healing careers
 */

function cleanContent(content: string): string {
    return content
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/["\u201C\u201D]/g, '"')
        .replace(/['\u2018\u2019]/g, "'")
        .replace(/\u2014/g, '-')
        .trim();
}

const ASI_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

export const SPIRITUAL_HEALING_NURTURE_SEQUENCE = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Certified Spiritual Healing Practitioner access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands of women who've started this sacred journey - practitioners who understand that true healing begins at the soul level.

Your Certified Spiritual Healing Practitioner Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Master Practitioners in spiritual healing.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if spiritual healing is your calling.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

When the soul is ready, the path appears. You're here for a reason.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    {
        id: 2,
        phase: "value",
        day: 1,
        subject: "Re: the 3 signs your spiritual gifts are ready to serve others",
        content: cleanContent(`{{firstName}},

After working with thousands of spiritual healers, I've noticed 3 signs that someone's gifts are ready to become a calling:

1. You feel other people's emotions - even when they haven't said a word. You walk into a room and sense the heaviness. You meet someone and just KNOW something is off. People call you "too sensitive." But you're not too sensitive. You're spiritually attuned.

2. People already come to you for comfort. Friends, family, even strangers open up to you. They say things like "I don't know why I'm telling you this." It happens because your spirit creates a safe space that draws people in.

3. You feel a pull toward something bigger. A quiet knowing that you're meant for more. Not in an ego way - in a soul way. Like there's work you came here to do, and every day you don't do it, something feels incomplete.

If you recognized yourself in even one of those signs, {{firstName}}, it's not a coincidence that you're here.

Your sensitivity isn't a burden. It's your greatest qualification.

The question isn't whether you have the gift. It's whether you'll answer the call.

${ASI_SIGNATURE}`),
    },

    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: what is spiritual healing, really?",
        content: cleanContent(`{{firstName}},

Let me clear something up.

Spiritual healing isn't about religion. It isn't about crystals or candles (though those can be lovely). It isn't about being "perfect" or having all the answers.

Spiritual healing is the practice of connecting with a person's deepest self - their soul, their spirit, their essence - and helping them release what no longer serves them.

It works at a level that traditional approaches often miss.

Therapy addresses the mind. Medicine addresses the body. But spiritual healing addresses the SOUL - the place where our deepest wounds live, and where our deepest transformation begins.

When someone carries grief they can't name... when anxiety has no logical source... when they feel disconnected from themselves... that's a spiritual wound. And it needs a spiritual healer.

Our Board Certified practitioner, Grace, worked with a woman named Diana who'd been to 4 therapists over 10 years. Good therapists. She understood her patterns intellectually.

But nothing shifted.

In their first spiritual healing session, Grace guided Diana into a space of deep inner stillness. What emerged was a core wound Diana had never accessed through talk alone - a profound disconnection from her own worthiness.

Three sessions later, Diana said: "For the first time in my life, I feel whole."

That's spiritual healing. That's the work waiting for you.

${ASI_SIGNATURE}`),
    },

    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: I almost quit before I found spiritual healing",
        content: cleanContent(`{{firstName}},

I need to be honest with you about something.

Before I found spiritual healing, I was lost.

I'd tried everything. Self-help books. Workshops. Retreats. I even considered going back to school for counseling. Nothing fit.

I knew I was meant to help people heal. I KNEW it in my bones. But every path I tried felt like wearing someone else's shoes.

Then I discovered spiritual healing - not the watered-down version you see on social media, but the real, structured practice of soul-level transformation.

And everything clicked.

For the first time, I had language for what I'd always felt. I had a framework for the intuitive knowing I'd carried my whole life. I had a path that honored my gifts instead of asking me to suppress them.

Was I scared? Absolutely. I worried people would judge me. I worried I wasn't "spiritual enough." I worried I was too old to start something new.

But the calling was louder than the fear.

{{firstName}}, if you're feeling that same pull - that quiet voice saying "this is it" - please don't ignore it. That voice has been waiting for you to listen.

${ASI_SIGNATURE}`),
    },

    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

It's been a week since you started your Certified Spiritual Healing Practitioner Mini Diploma.

What's resonating most with you so far?

When I ask our practitioners this question, the most common answers are:

1. "I always knew I was meant to heal - now I have a path"
2. "The connection between spiritual and emotional healing finally makes sense"
3. "I realize I've been doing spiritual work intuitively my whole life"

What about you?

Just hit reply and share one thing that clicked.

${ASI_SIGNATURE}

P.S. If you haven't started yet, no judgment. But try to carve out 15 minutes this week. The first lesson alone will shift your understanding.`),
    },

    {
        id: 6,
        phase: "value",
        day: 10,
        subject: "Re: a centering practice every healer needs",
        content: cleanContent(`{{firstName}},

Quick spiritual healing technique that transforms your practice:

Most people try to do healing work while carrying everyone else's energy.

It's like trying to pour from an empty cup. Draining. Exhausting. Sometimes even harmful.

Signs you're carrying energy that isn't yours:
- Feeling heavy after conversations
- Mood shifts with no clear cause
- Exhaustion that sleep doesn't fix
- Absorbing others' anxiety or sadness

Here's a centering practice I teach every practitioner:

Close your eyes. Place one hand on your heart. Take three slow breaths. On each exhale, silently say: "I release what is not mine." Feel the weight lifting. On your next inhale, say: "I call my own energy back to me." Feel yourself returning to your center - clear, grounded, whole.

One minute. Transforms everything.

This is core curriculum material, but I wanted you to have it now.

At ASI, we teach energetic boundaries FIRST because they protect both practitioner and client. It's why our certified healers don't burn out.

Try it three times today. Notice the difference.

${ASI_SIGNATURE}`),
    },

    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on you",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How's your spiritual healing journey going?

If you're flowing through the lessons - wonderful. You're joining thousands who've completed this training.

If life interrupted - that's okay. Spiritual growth has its own timing.

The women who complete this Mini Diploma tell me: "I finally understand my purpose."

That understanding is worth everything.

Even 10 minutes at a time counts. The soul doesn't rush.

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

It's been two weeks since you started your Certified Spiritual Healing Practitioner journey.

I want to acknowledge something:

Learning to work at the soul level requires opening parts of yourself you may have kept protected for years. It takes courage.

So wherever you are right now...

If you've finished: I'm honored to witness your awakening. You now understand spiritual healing at a deeper level than most ever will.

And {{firstName}} - you're not the same person who started two weeks ago. Something shifted in your spirit.

If you're still in progress: Keep going. Each lesson builds on the last.

Whatever camp you're in:

I see your gifts.
I believe in your calling.
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
        subject: "Re: how Grace went from burned out nurse to thriving healer",
        content: cleanContent(`{{firstName}},

I want to tell you about Grace's journey.

Grace was a hospice nurse for 18 years. She held hands with the dying. She comforted families in their darkest hours. She was everyone's rock.

But inside? She was crumbling.

The weight of all that grief. The spiritual questions her medical training couldn't answer. The feeling that she was meant to help people in a different way.

Then she got certified in spiritual healing through ASI.

Month 1: Finally had a framework for the intuitive gifts she'd always used with patients. Everything made sense.

Month 2: Started offering spiritual healing sessions on weekends. Word spread fast.

Month 3: Wait list formed. Clients were finding her through the ASI Directory.

Month 6: Left nursing. Full-time spiritual healing practice. Zero regrets.

Today: Grace sees 15 clients weekly. $150/session. More fulfilled than she's ever been. And she sleeps soundly - because she's not carrying everyone else's pain anymore.

Here's what changed:

Before: "Grace, RN - Hospice Nurse"
After: "Grace, RN, SH-BC - Board Certified Spiritual Healing Practitioner"

That credential gave structure to what she'd always felt.

{{firstName}}, do you see yourself in her story?

${ASI_SIGNATURE}`),
    },

    {
        id: 10,
        phase: "desire",
        day: 18,
        subject: "Re: why spiritual healers earn MORE than therapists",
        content: cleanContent(`{{firstName}},

This might surprise you.

Board Certified spiritual healers often earn MORE than traditional therapists.

Here's why:

1. No insurance company tells you what to charge. You set your own rates.

2. Sessions are deeply transformative - clients see results faster, so they value the work MORE.

3. There's a massive supply gap. Millions of people are searching for spiritual healing. Very few practitioners are properly certified.

4. You don't need a 4-year degree. You need skill, certification, and compassion - things you may already have.

What spiritual healing practitioners earn:

- Beginning (first 3 months): $2,500-$4,500/month
- Established (6-12 months): $5,000-$8,000/month
- Advanced (12+ months): $8,000-$15,000/month

And this is with 10-15 clients per week. Not 40. Not burning out.

Grace told me: "I made more in my first full month of spiritual healing than my best month in nursing. And I worked half the hours."

A typical day:

9:00am - Morning meditation and intention setting
10:00am - Client session (soul-level healing for grief)
11:30am - Client session (spiritual alignment for life transition)
1:00pm - Lunch and self-care
2:30pm - Client session (remote - works beautifully for spiritual work)
4:00pm - Done for the day

No commute. No corporate politics. No soul-crushing bureaucracy.

Just meaningful work that lights you up.

${ASI_SIGNATURE}`),
    },

    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: your clients are looking for you right now",
        content: cleanContent(`{{firstName}},

Right now, in your area, people are searching:

"spiritual healer near me"
"soul healing practitioner"
"spiritual healing for grief"
"holistic spiritual counseling"

They're looking for someone exactly like you.

But they need to find you. And they need to trust you.

That's what certification does.

It's the difference between:
"I do spiritual healing" (skepticism)
and
"I'm a Board Certified Spiritual Healing Practitioner through ASI" (trust)

Let me answer what I know you're wondering:

"Is spiritual healing actually legitimate?"

ASI is incorporated in Delaware, with offices in New York and Dubai. Credentials recognized by CMA, CPD, and IPHM. Every certificate has public verification.

"Will people actually pay for this?"

Spiritual healing is one of the fastest growing wellness modalities. 73% of our practitioners say demand exceeds their capacity.

"Do I need to be psychic or have special powers?"

No. Spiritual healing is a skill that can be developed through proper training. You don't need to see auras or hear spirits. You need presence, compassion, and technique.

"Am I too old to start?"

Our average practitioner age is 47. Many start at 55+. Life experience makes you a BETTER healer. Clients trust wisdom.

The only real question is: will you answer the call?

${ASI_SIGNATURE}`),
    },

    {
        id: 12,
        phase: "desire",
        day: 24,
        subject: "Re: the meditation that changed Lisa's entire practice",
        content: cleanContent(`{{firstName}},

Here's what nobody tells you about becoming a spiritual healer:

It can be lonely.

You start sensing things others miss. You see patterns beneath the surface. You feel called to help people who don't even know they need it.

But your old friends don't understand.
Your family thinks it's "a phase."
You're walking a path that feels solitary.

That's why we created the My Circle Mastermind.

When you enroll, you're matched with 5 fellow spiritual healers. Your Circle.

Every day:
- Morning intentions and spiritual check-ins
- Client case discussions
- Technique sharing and practice
- Mutual support and celebration

Lisa, one of our practitioners, shared a meditation practice with her Circle that transformed everything. It was a simple grounding meditation she'd developed - 5 minutes of connecting with divine source before each session.

Her entire Circle adopted it. Within a month, all five reported deeper sessions, clearer intuition, and less energetic fatigue.

Lisa said: "My Circle didn't just support my practice - they elevated it. We grow together."

This isn't a random Facebook group.

This is YOUR 5. Women who speak your language. Who understand when you say "her soul was crying." Who celebrate your first paid session. Who hold space for YOU.

No one succeeds alone in this work. Grace didn't. Lisa didn't. I didn't.

${ASI_SIGNATURE}

P.S. My original Circle? Still checking in daily, 3 years later. Soul sisters in the truest sense.`),
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

Same life. Same curiosity about spiritual healing. The Mini Diploma unfinished or unused.

Still feeling that pull you can't explain. Still sensing things others miss. Still wondering "what if."

Not bad. Just... unchanged.

PATH B: You Made a Decision

You're Board Certified. Three levels complete: SH-FC, SH-CP, SH-BC.

You introduce yourself: "Hi, I'm {{firstName}}, SH-BC - Board Certified Spiritual Healing Practitioner."

You're in the ASI Directory. Clients find YOU.

You have your 5-person Mastermind Circle. Daily support. Fellow healers who became soul sisters.

10 clients weekly. $4,000-$7,000/month. Work that feeds your spirit.

That calling you felt? Fully answered. That gift you carried? Finally honored.

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

If you've felt called to spiritual healing... if you've wondered what it takes to do this professionally...

Here's what's waiting:

The Complete Career Certification - $297

What's included:

ALL 3 CERTIFICATION LEVELS:
- SH-FC (Foundation Certified)
- SH-CP (Certified Practitioner)
- SH-BC (Board Certified Master)

THE TRAINING:
- 25+ in-depth lessons
- Intuitive development protocols
- Soul-level healing techniques
- Remote spiritual healing methods

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

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

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

Here's the complete path to becoming a Board Certified Spiritual Healing Practitioner:

STEP 0: Mini Diploma (Done)
You've got the foundation.

STEP 1: Complete Career Certification ($297)

LEVEL 1: SH-FC - Foundation Certified
- Spiritual healing foundations
- Intuitive development
- Your first credential

LEVEL 2: SH-CP - Certified Practitioner
- Advanced techniques
- Soul-level healing protocols
- Client session frameworks

LEVEL 3: SH-BC - Board Certified Master
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

The math: $297 / $150 = 2 clients to break even.

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
- Weekend spiritual workshops: $500-$2,000
- Intuitive development programs: $1,500-$5,000
- Full spiritual healing certifications: $3,000-$10,000

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

Spiritual healers typically charge $125-$250/session.

$297 / $125 = 2-3 clients.

THREE CLIENTS and you've covered the investment.
Everything after that is profit - and purpose.

Grace made over $600 in her first month of practice. Her investment paid back before she even finished certification.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

${ASI_SIGNATURE}`),
    },

    {
        id: 17,
        phase: "decision",
        day: 36,
        subject: "Re: the credential that changes everything",
        content: cleanContent(`{{firstName}},

BEFORE:
"{{firstName}} - Interested in spiritual healing"
- No credential
- Clients skeptical
- No listings

AFTER:
"{{firstName}}, SH-BC - Board Certified Spiritual Healing Practitioner"
- Professional credential (CMA, CPD, IPHM recognized)
- Clients trust and pay
- Listed in ASI Directory
- Daily Mastermind support

What you get:

3 CREDENTIALS:
- SH-FC
- SH-CP
- SH-BC

THE BADGE:
Display anywhere - LinkedIn, website, business cards.

THE DIRECTORY:
People searching "certified spiritual healer" find YOU.

THE CIRCLE:
5-person Mastermind. Daily connection. Lasting bonds.

THE VERIFICATION:
Public verification at accredipro.com/verify

Grace told me: "When I could say 'I'm Board Certified,' the energy shifted completely. I wasn't justifying my work anymore. I was credentialed."

For $297, you become {{firstName}}, SH-BC.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

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

"$297 is a lot right now."
- Less than most workshops.
- 2-3 clients = break even.
- LIFETIME access.

"I'm not sure I'm spiritual enough."
- Spiritual healing is a skill, not a personality type.
- The training develops your gifts.
- Your Circle supports your growth.

"What if nobody pays me?"
- ASI Directory brings leads.
- 73% of practitioners exceed capacity.
- Your Circle refers clients.

"My family won't understand."
- They might not initially.
- Results speak louder than explanations.
- Your transformation will inspire them.

"What if I'm not good enough?"
- You've been doing this work intuitively for years.
- The certification gives structure to your natural gifts.
- Every healer starts with doubt. The best ones start anyway.

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

You're matched with 5 fellow spiritual healers. Your Circle.

Every day:
- Morning intentions
- Spiritual check-ins
- Client discussions
- Celebration and support

This isn't posting to strangers.

This is DAILY connection with women who understand what you're experiencing.

When you feel a client's grief and need to process it...
When you doubt your intuition...
When you have a breakthrough that nobody else would understand...

Your Circle holds space for you.

Grace told me: "The Mastermind alone is worth the $297. I've never felt so spiritually supported."

The certification teaches you.
The Circle sustains you.

Ready for your Circle? https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

${ASI_SIGNATURE}`),
    },

    {
        id: 20,
        phase: "decision",
        day: 42,
        subject: "Re: what our practitioners say",
        content: cleanContent(`{{firstName}},

What Board Certified Spiritual Healing Practitioners experience:

GRACE, 48, Former Hospice Nurse:
"I held hands with the dying for 18 years. Now I help the living heal at the soul level. The certification gave me structure for gifts I'd always had. 15 clients weekly, and I've never felt more alive."

LISA, 52, Former Yoga Instructor:
"Yoga opened the door. Spiritual healing walked me through it. My clients go deeper in one session than they did in years of practice. The credential made people take my work seriously."

MARIA, 41, Former Social Worker:
"I kept hitting walls in traditional social work. The system couldn't address spiritual wounds. Now I can. My clients call me their 'soul guide.' I've never been happier."

DIANE, 57, Started from Scratch:
"I thought 57 was too late to start something new. It wasn't. My life experience makes clients trust me instantly. I wish I'd done this 10 years ago."

None of them are special. They simply decided.

Just like you can decide today.

${ASI_SIGNATURE}`),
    },

    {
        id: 21,
        phase: "decision",
        day: 44,
        subject: "Re: the calling doesn't go away",
        content: cleanContent(`{{firstName}},

That pull you feel toward spiritual healing?

It doesn't go away.

I've talked to women who waited years. Who felt it. Who ignored it.

Know what they all say?

"I wish I'd started sooner."

The calling gets louder, not quieter.

Every day you wait is:
- A soul that doesn't find healing
- A client who keeps searching
- Your gifts left unhonored

Not pressuring you. It must be your choice.

But make the choice consciously. Not by default.

Complete Certification: $297
Two clients to break even.
A lifetime of purpose.

If you feel it, trust it: https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

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

That's okay. Every soul has its own timing.

Just wanted you to know: I'm still here. The door is open. Your path is waiting.

Maybe now isn't the time. Maybe life is full. Maybe doubt is loud.

Whatever is true, I honor it.

When you're ready - the certification will be here. I'll be here.

Your spiritual gifts aren't going anywhere.

With love,

${ASI_SIGNATURE}`),
    },

    {
        id: 23,
        phase: "re-engage",
        day: 52,
        subject: "Re: 70% off expires tonight - here's what you're missing",
        content: cleanContent(`{{firstName}},

I don't do this often, but I wanted to give you one more chance at something special.

Right now, the Complete Spiritual Healing Career Certification is available at 70% off.

$997 value for just $297.

Here's what you're missing if you don't act:

- 3 board-level certifications (SH-FC, SH-CP, SH-BC)
- 25+ lessons on soul-level healing
- Your own My Circle Mastermind (5 women who become your soul sisters)
- ASI Directory listing (clients find YOU)
- Sarah mentorship access
- LIFETIME access

Grace enrolled at this price. She made her investment back in her first 2 weeks of practice.

Lisa enrolled at this price. She now earns more than she did in 15 years of yoga instruction.

This pricing won't come back after tonight.

If the calling is still there: https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

${ASI_SIGNATURE}

P.S. I believe your gifts are meant to serve others. But the decision is yours.`),
    },

    {
        id: 24,
        phase: "re-engage",
        day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

I was thinking about you today.

About when you first signed up. Something called your spirit to this work. Something said "this matters."

That voice is still there.

Maybe louder now.

I don't know what your journey looks like. But I know this:

Spiritual healing is needed more than ever. People are anxious, disconnected, searching for meaning. And there are never enough trained practitioners.

The world doesn't need more advice. It needs more healers.

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

You found your way to spiritual healing for a reason. Whether you ever pursue certification or not - the calling is real. Your gifts are real. The longing for soul-level work is real.

Whatever path you take, I hope you:
- Trust your spiritual intuition
- Use your gifts however feels right
- Remember that healing is always possible

If someday the time is right: https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y

Until then, sending you peace, light, and deep spiritual nourishment.

Thank you for being part of this community.

With gratitude,

${ASI_SIGNATURE}

P.S. I believe in your gifts. I believe you're meant for sacred, beautiful work.`),
    },
];

export type SpiritualHealingNurtureEmail = typeof SPIRITUAL_HEALING_NURTURE_SEQUENCE[number];
