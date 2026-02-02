/**
 * Certified Spiritual Healing Specialist Mini Diploma - 60-Day Nurture Sequence
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (SH-FC™ + SH-CP™ + SH-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on energy work, chakra healing, spiritual counseling
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
 * Target: US Women 35-55+ seeking spiritual growth and healing careers
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

export const SPIRITUAL_HEALING_NURTURE_SEQUENCE = [
    // ============================================
    // PHASE 1: VALUE (Days 0-14) - NO SELLING
    // ============================================

    // Email 1 - Day 0: Welcome
    {
        id: 1,
        phase: "value",
        day: 0,
        subject: "Re: your Certified Spiritual Healing Specialist access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands of women who've started this sacred journey - practitioners in 47 countries who understand that true healing happens at the soul level.

Your Certified Spiritual Healing Specialist Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Master Practitioners in spiritual healing modalities.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is calling you.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

The universe brought you here for a reason.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    // Email 2 - Day 1: Sarah's Story
    {
        id: 2,
        phase: "value",
        day: 1,
        subject: "Re: my spiritual awakening (thought you'd relate)",
        content: cleanContent(`{{firstName}},

Can I tell you about the moment everything changed for me?

Five years ago, I was going through the darkest period of my life. A painful divorce, health issues, and a sense that something was deeply wrong - but I couldn't name it.

Traditional therapy helped some. Medicine managed symptoms. But nothing touched the emptiness I felt inside.

Then I discovered spiritual healing.

I remember my first energy session. The practitioner didn't just treat my body - she saw my SOUL. She found blockages I'd been carrying since childhood. Pain I'd buried so deep I'd forgotten it was there.

Within weeks, I felt lighter. Within months, I felt reborn.

That's when I knew: this is what I'm meant to do. Not just heal myself, but help others find their way back to wholeness.

The training gave me structure. The certification gave me credibility. But the CALLING - that was already inside me. Just like it's inside you.

So tell me, {{firstName}} - what brought you here? What healing are you seeking?

Hit reply. I want to hear your story.

With love and light,

${ASI_SIGNATURE}`),
    },

    // Email 3 - Day 3: Why Spiritual Healing Works
    {
        id: 3,
        phase: "value",
        day: 3,
        subject: "Re: why traditional approaches often fall short",
        content: cleanContent(`{{firstName}},

I need to tell you about Catherine.

She came to one of our Board Certified practitioners last year. 48 years old. Successful career. Beautiful family. 

But inside? She was falling apart.

Anxiety that wouldn't stop. A constant feeling of being "unseen." Crying in the shower so her kids wouldn't hear.

She'd tried everything: therapy, medication, meditation apps, self-help books. Nothing worked for long.

When she found a certified spiritual healing practitioner, she was skeptical. "New age stuff," she thought.

But within 30 minutes of her first session, she was sobbing. Not from pain - from RELIEF. Because for the first time, someone was addressing what she'd always known:

Her suffering wasn't just in her mind. It was in her SPIRIT.

Here's what {{firstName}} - conventional approaches often fail because they only address the physical or psychological. But we are spiritual beings having a human experience. When the soul is wounded, no pill can fix it.

This is what you're learning in your Mini Diploma. This is the difference between surface-level help and deep, lasting transformation.

Have you started your lessons yet?

${ASI_SIGNATURE}

P.S. Catherine now leads women's healing circles. Her exact words: "Therapy kept me functioning. Spiritual healing brought me back to life."`),
    },

    // Email 4 - Day 5: Client Win Story
    {
        id: 4,
        phase: "value",
        day: 5,
        subject: "Re: something beautiful happened",
        content: cleanContent(`{{firstName}},

I have to share something that happened this week.

One of our Board Certified practitioners, Grace, just sent me this message:

"Sarah, my client broke down in happy tears today. She said for the first time in 20 years, she doesn't feel like she's carrying her mother's pain anymore. The ancestral healing work we did - it FREED her."

This is why I do this work.

Not the certificates. Not the income (though that matters too). THIS.

That moment when someone who's been carrying invisible burdens finally feels LIGHT again.

Grace is one of thousands of ASI-certified spiritual healing practitioners now helping people around the world. She got certified 10 months ago. Now she has a thriving practice.

But more importantly - she gets to witness miracles. Daily.

{{firstName}}, I don't know exactly why you signed up for this Mini Diploma. Maybe you're seeking your own healing. Maybe you've always felt called to this work. Maybe someone you love needs help no doctor can provide.

Whatever the reason - trust that intuition.

Keep going with your lessons.

${ASI_SIGNATURE}

P.S. How are you finding the lessons so far? What's resonating?`),
    },

    // Email 5 - Day 7: Engagement Question
    {
        id: 5,
        phase: "value",
        day: 7,
        subject: "Re: quick question for you",
        content: cleanContent(`{{firstName}},

I've been thinking about you.

It's been a week since you started your Certified Spiritual Healing Specialist Mini Diploma, and I'm curious:

What's surprised you most so far?

When I ask our practitioners this question, the most common answers are:

1. "I had no idea there were so many modalities - chakra work, energy clearing, soul retrieval..."
2. "The connection between emotional pain and physical illness made so much sense"
3. "I realized the intuitive gifts I thought were 'weird' are actually my greatest strengths"

What about you?

Just hit reply and tell me one thing that made you go "wow."

${ASI_SIGNATURE}

P.S. If you haven't had a chance to dive in yet, no judgment. But try to carve out 15 minutes this week. Your soul is waiting.`),
    },

    // Email 6 - Day 10: Free Value Tip
    {
        id: 6,
        phase: "value",
        day: 10,
        subject: "Re: a simple grounding technique most people miss",
        content: cleanContent(`{{firstName}},

Quick spiritual healing tip - something simple but powerful:

Most people try to "raise their vibration" before they're grounded.

It's like trying to fly without roots.

When you're ungrounded, you might feel:
- Scattered and anxious
- Unable to focus
- Disconnected from your body
- Easily overwhelmed by others' energy

The fix takes 2 minutes:

Stand barefoot if possible. Visualize roots growing from your feet deep into the earth. Feel the earth's energy rising up through you. Breathe.

Sound simple? It is. And it changes EVERYTHING.

This is what we call "spiritual hygiene" - daily practices that keep your energy clean and your spirit strong.

At ASI, we train practitioners to master these fundamentals before moving to advanced techniques. It's why our certified practitioners get different results.

Try this for one week and notice what shifts.

${ASI_SIGNATURE}`),
    },

    // Email 7 - Day 12: Check-in
    {
        id: 7,
        phase: "value",
        day: 12,
        subject: "Re: checking in on your journey",
        content: cleanContent(`{{firstName}},

Just wanted to check in.

How are you doing with your Mini Diploma?

If you're moving through it - beautiful. You're joining thousands of women who've completed this sacred training.

If life got in the way - that's okay too. Spirit works on its own timeline.

The women who finish this Mini Diploma tell me it changed how they see themselves. How they understand their gifts. How they connect with others who are suffering.

Even 10 minutes at a time counts. Every lesson plants a seed.

What's one thing I can help you with right now?

${ASI_SIGNATURE}

P.S. If you've finished or are close - reply with "COMPLETE" and I'll share what comes next on this path.`),
    },

    // Email 8 - Day 14: Two Weeks In
    {
        id: 8,
        phase: "value",
        day: 14,
        subject: "Re: two weeks on your spiritual path",
        content: cleanContent(`{{firstName}},

It's been two weeks since you started your Certified Spiritual Healing Specialist journey with AccrediPro Standards Institute.

I want to acknowledge something:

This material asks a lot of you. Not just time - but PRESENCE. Opening to things you may have been taught to dismiss or hide.

So wherever you are right now...

If you've finished: I'm so honored to walk this path with you. You now understand more about spiritual healing than most people ever will. Your completion certificate is on its way.

And {{firstName}} - something awakened in you. You're not the same person who signed up two weeks ago. You're remembering who you really are.

If you're still in progress: Keep going. You're answering a call that's been waiting for you.

Whatever camp you're in:

I see you.
I believe in your gifts.
I'm here if you need anything.

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 2: DESIRE (Days 15-30)
    // ============================================

    // Email 9 - Day 15: Practitioner Transformation
    {
        id: 9,
        phase: "desire",
        day: 15,
        subject: "Re: how Luna found her calling",
        content: cleanContent(`{{firstName}},

I want to tell you what happened to Luna after she got certified.

Luna was a corporate accountant for 22 years. Successful on paper. Empty inside.

She'd always felt things others didn't. Sensed energy. Had intuitive knowing she'd learned to suppress because it didn't fit the corporate world.

Then she got her 3-level spiritual healing certification through ASI.

Month 1: Terrified but alive. Finally learning to trust her gifts instead of hide them.

Month 2: Offered free sessions to friends. Word spread. "How do you know these things about me?"

Month 3: Four paying clients. $200 each for energy clearing and spiritual guidance.

Month 6: Left accounting.

Today: Luna works from home. Sees 12-15 clients a week. Makes more than she did in corporate - with 100x the fulfillment.

Here's what changed:

Before: "Luna Chen, CPA"
After: "Luna Chen, SH-BC - Board Certified Spiritual Healing Practitioner"

That title gave her permission to be who she always was.

{{firstName}}, I'm sharing this because... maybe you see yourself in her story?

${ASI_SIGNATURE}`),
    },

    // Email 10 - Day 18: Day in the Life
    {
        id: 10,
        phase: "desire",
        day: 18,
        subject: "Re: what my days look like now",
        content: cleanContent(`{{firstName}},

Want to know what my days look like as a spiritual healing practitioner?

6:30am - Wake naturally. Meditation. Connect with my guides. Set intentions.

8:00am - Check my Mastermind pod chat. Share my morning reflection. Hold space for my pod members' shares.

9:00am - First client session. A woman processing grief after a devastating loss. I witness. I hold space. I facilitate healing that goes beyond words.

11:00am - Second session. Chakra clearing and energy alignment. Client texts later: "I feel 10 pounds lighter."

1:00pm - Sacred pause. Lunch in stillness.

2:00pm - Check the ASI Directory. Two new inquiries from people seeking certified practitioners.

3:30pm - Content creation. Sharing wisdom. Planting seeds.

Evening - Present. Grounded. ALIVE.

No fluorescent lights. No soul-crushing meetings. No pretending to be someone I'm not.

I introduce myself differently now: "I'm Sarah, a Board Certified Spiritual Healing Practitioner."

That sentence changed everything.

${ASI_SIGNATURE}

P.S. The daily Mastermind check-ins? They're my anchor. Knowing 4 other women on this path are walking with me.`),
    },

    // Email 11 - Day 21: Common Questions
    {
        id: 11,
        phase: "desire",
        day: 21,
        subject: "Re: questions you might be asking",
        content: cleanContent(`{{firstName}},

Let me answer the questions I know you're asking:

"But is spiritual healing legitimate?"

ASI is incorporated in Delaware, with offices in New York and Dubai. Credentials recognized by CMA, CPD, and IPHM. Every certificate has a public verification ID. You'll have real, verifiable credentials - not woo-woo fluff.

"Will people pay for this?"

The wellness industry is $5.6 trillion. More people than ever are seeking alternative healing. 73% of our practitioners say client demand exceeds their capacity.

"Can I do this without special gifts?"

Spiritual sensitivity can be developed. Our training awakens and strengthens intuitive abilities. Luna thought she "wasn't psychic enough." Now she channels messages that change lives.

"Am I too old to start?"

Our average practitioner age is 47. Many start in their 50s and 60s. Life experience becomes your greatest asset.

"What if my family doesn't understand?"

They might not. At first. But when they see the transformation in you - and then in your clients - understanding comes.

The only real barrier is not starting.

${ASI_SIGNATURE}`),
    },

    // Email 12 - Day 24: Community + Mastermind
    {
        id: 12,
        phase: "desire",
        day: 24,
        subject: "Re: the sacred circle nobody talks about",
        content: cleanContent(`{{firstName}},

Can I tell you the part of this journey nobody talks about?

The isolation.

When you wake up to spiritual truth, you can't unsee it. You sense things everywhere. You want to help everyone.

But most people don't get it.
Your friends think you've gone "woo-woo."
Your family worries about you.
And you're walking this path alone.

That's why we created the My Circle Mastermind.

Here's how it works:

You get placed in a pod of 5 soul sisters. Your Sacred Circle.

Every single day:
- Morning intention sharing
- Spiritual insights and downloads
- Support through client challenges
- Celebration of breakthroughs

This isn't a Facebook group with 50,000 strangers.

This is YOUR 5. Women who understand energetic boundaries. Who celebrate when you clear generational trauma. Who hold space when the work gets heavy.

Plus the ASI Directory where seekers find YOU.

No one walks this path alone. I didn't. Luna didn't. Grace didn't.

${ASI_SIGNATURE}

P.S. The women in my original pod are now my soul family. We still share daily, 3 years later.`),
    },

    // Email 13 - Day 27: Two Paths
    {
        id: 13,
        phase: "desire",
        day: 27,
        subject: "Re: two futures from this moment",
        content: cleanContent(`{{firstName}},

Imagine it's one year from now.

Two versions of that moment:

PATH A: Nothing Changed

Same life. Same longing. The Mini Diploma a distant memory you meant to do something with.

Still sensing things you can't explain. Still hiding your gifts.

Not terrible. Just... unfulfilled.

PATH B: You Made a Decision

You're Board Certified. Three levels complete: SH-FC, SH-CP, SH-BC.

You introduce yourself: "Hi, I'm {{firstName}}, SH-BC - Board Certified Spiritual Healing Practitioner."

You're in the ASI Directory. Seekers find YOU.

You have your 5-person Sacred Circle. Daily spiritual connection. Women who became your soul family.

10 clients seeking healing. $4,000-$7,000/month. Doing work that matters.

That feeling of "I'm meant for something more"? Gone. Because you're LIVING it.

Both futures take the same 365 days to arrive.

The only difference is the choice you make now.

${ASI_SIGNATURE}

P.S. The universe is waiting for your answer. Which path do you choose?`),
    },

    // Email 14 - Day 30: Personal Invitation
    {
        id: 14,
        phase: "desire",
        day: 30,
        subject: "Re: a sacred invitation",
        content: cleanContent(`{{firstName}},

It's been a month since you started.

I want to personally invite you to take the next step on your spiritual path.

If you've felt called to something more... if you've wondered what it would take to become a certified spiritual healing practitioner...

Here's what's waiting for you:

The Complete Career Certification - $297

What's included:

ALL 3 CERTIFICATION LEVELS:
- SH-FC (Foundation Certified)
- SH-CP (Certified Practitioner)
- SH-BC (Board Certified Master)

THE TRAINING:
- 25+ in-depth lessons
- Energy healing protocols
- Chakra balancing techniques
- Spiritual counseling methods

THE COMMUNITY:
- My Circle Mastermind (5-person Sacred Circle)
- DAILY spiritual check-ins
- 20,000+ practitioner network

CLIENT ACQUISITION:
- ASI Directory listing (seekers find you)
- Sarah mentorship access
- LIFETIME ACCESS

BONUSES:
- Session templates
- Client intake forms
- Pricing and packaging guides

Total value: $5,000+
You pay: $297

Ready to answer the call? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Or just reply "tell me more."

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
        subject: "Re: the complete path",
        content: cleanContent(`{{firstName}},

Here's the complete path to becoming a Board Certified Spiritual Healing Practitioner:

STEP 0: Mini Diploma (Done)
You've already built the foundation.

STEP 1: Complete Career Certification ($297)
Everything you need in one sacred package:

LEVEL 1: SH-FC - Foundation Certified
- Core spiritual healing principles
- Basic energy work
- Your first credential

LEVEL 2: SH-CP - Certified Practitioner
- Advanced modalities
- Chakra mastery
- Client protocols

LEVEL 3: SH-BC - Board Certified Master
- Elite practitioner status
- Complex case handling
- Full spiritual authority

PLUS:
- My Circle Mastermind (5-person Sacred Circle with daily check-ins)
- ASI Directory listing
- Session templates (BONUS)
- Client scripts (BONUS)
- Business guides (BONUS)
- Sarah mentorship access
- LIFETIME ACCESS

What certified practitioners earn:
- Beginning: $2,500-$4,500/month
- Established: $5,000-$8,000/month
- Advanced: $8,000-$15,000/month

The math: $297 / $175 per session = 2 clients to break even.
TWO. CLIENTS.

Reply if you have questions.

${ASI_SIGNATURE}`),
    },

    // Email 16 - Day 34: The Investment
    {
        id: 16,
        phase: "decision",
        day: 34,
        subject: "Re: the investment in your calling",
        content: cleanContent(`{{firstName}},

Let's talk about the investment.

The Complete Career Certification is $297.

For context:
- Traditional energy healing training: $3,000-$10,000
- Spiritual counseling programs: $5,000-$15,000
- Other certification programs: $997-$2,997

What you get for $297:
- 3-level certification (FC + CP + BC)
- Board Certified Master title
- 25+ lessons
- My Circle Mastermind (daily spiritual connection)
- ASI Directory listing
- Session templates (bonus)
- Client scripts (bonus)
- Pricing guides (bonus)
- Mentorship access
- LIFETIME access

Total value: $5,000+
You pay: $297

The ROI:

Most spiritual healing practitioners charge $150-$250 per session.

$297 / $150 = 2 clients.

TWO SESSIONS and you've made your money back.
Everything after that is abundance.

Luna made $800 in her first month. Her investment returned 2.7x before she finished the training.

This isn't an expense. It's an investment in your divine purpose.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

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
"{{firstName}} - Spiritual Seeker"
- No title
- Clients unsure
- No credibility

AFTER Certification:
"{{firstName}}, SH-BC - Board Certified Spiritual Healing Practitioner"
- Professional credential (CMA, CPD, IPHM recognized)
- Clients trust and pay premium
- Listed in ASI Directory
- Daily support from your Sacred Circle

What you get:

3 CREDENTIALS:
- SH-FC (Foundation Certified)
- SH-CP (Certified Practitioner)
- SH-BC (Board Certified Master)

THE BADGE:
Display on LinkedIn, website, email signature.

THE DIRECTORY:
People searching for "certified spiritual healing practitioner" find YOU.

THE CIRCLE:
5-person Mastermind. Daily check-ins. Soul family.

THE VERIFICATION:
Anyone can verify your credential at accredipro.com/verify

Grace told me: "The day I updated my website to show SH-BC was the day I stopped explaining myself. I wasn't 'into spiritual stuff.' I was a certified professional."

You're not buying a course for $297.

You're becoming {{firstName}}, SH-BC - Board Certified Spiritual Healing Practitioner.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // Email 18 - Day 38: Objection Crusher
    {
        id: 18,
        phase: "decision",
        day: 38,
        subject: "Re: what might be holding you back",
        content: cleanContent(`{{firstName}},

Let me address what might be stopping you:

"I don't have time."
- Self-paced. No live requirements.
- Most complete in 8-12 weeks.
- Daily Mastermind takes 5 minutes.

"$297 feels like a lot."
- Less than most weekend workshops.
- 2 sessions = break even.
- Your calling is worth investing in.

"I'm not 'gifted' enough."
- Spiritual abilities can be developed.
- The training awakens dormant gifts.
- Your Circle supports your growth.

"What if I can't get clients?"
- ASI Directory brings passive leads.
- 73% of practitioners exceed capacity.
- Your Circle becomes your referral network.

"My family won't understand."
- They might not. At first.
- But transformation is undeniable.
- 89% report increased support after 3 months.

"What if spiritual healing isn't 'real'?"
- Tell that to the lives we've changed.
- Tell that to Catherine, Luna, Grace.
- The proof is in the healing.

So what's REALLY stopping you?

Reply honestly. I want to help.

${ASI_SIGNATURE}`),
    },

    // Email 19 - Day 40: The Mastermind
    {
        id: 19,
        phase: "decision",
        day: 40,
        subject: "Re: the daily connection that changes everything",
        content: cleanContent(`{{firstName}},

Can I tell you about My Circle Mastermind?

Most certifications give you training and say "good luck."

We do something sacred.

When you enroll, you're matched with a pod of 5 soul sisters. Your Sacred Circle.

Every day, these women:
- Share morning intentions
- Process spiritual downloads
- Support each other through challenges
- Celebrate breakthroughs and transformations

This isn't checking in with strangers.

This is DAILY connection with women who get it.

When a client session brings up your own stuff
When you doubt your gifts
When you witness something that shakes you

Your Circle holds you.

Maria told me: "The Mastermind alone is worth more than $297. I've never felt so spiritually supported."

This is the difference between studying spiritual healing and LIVING as a spiritual healer.

The certification teaches you.
The Circle sustains you.

Ready to find your Circle? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // Email 20 - Day 42: Social Proof
    {
        id: 20,
        phase: "decision",
        day: 42,
        subject: "Re: what certified practitioners are saying",
        content: cleanContent(`{{firstName}},

Here's what our Board Certified Spiritual Healing Practitioners are experiencing:

GRACE, 54, Former Teacher:
"I went from feeling lost to fully aligned. The certification gave me structure. The Circle gave me soul family. I now facilitate healing that I once thought was reserved for 'special' people."

LUNA, 47, Former Accountant:
"My first paying client cried and said I saw things her therapist never touched. That's when I knew this was real. 6 months in: 12 weekly clients, $6,500/month, complete fulfillment."

MAYA, 39, Stay-at-Home Mom:
"I always felt different. Sensitive. 'Too much.' This training taught me those are my GIFTS. Now I help other sensitive souls. My kids are proud of me for the first time."

CATHERINE, 51, Corporate Refugee:
"I thought success meant corner offices. Now success means facilitating someone's breakthrough. And yes, I make more money too. But the meaning? Priceless."

These women aren't special. They're not chosen. They simply decided.

Just like you can decide today.

${ASI_SIGNATURE}`),
    },

    // Email 21 - Day 44: Last Chance
    {
        id: 21,
        phase: "decision",
        day: 44,
        subject: "Re: the calling doesn't go away",
        content: cleanContent(`{{firstName}},

I need to be honest with you.

That pull you feel toward spiritual healing? It's not going away.

I've talked to women who waited years. Who had the Mini Diploma. Who felt called but didn't answer.

And you know what they all say?

"I wish I'd started sooner."

The calling gets louder, not quieter.

Every day you wait is:
- A client who doesn't find you
- A healing that doesn't happen
- Your gifts staying dormant

I'm not trying to pressure you. This has to be your choice.

But I want you to make that choice consciously. Not by default.

The Complete Certification: $297
Two sessions to break even.
And a lifetime of purpose.

If you feel it, trust it: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // ============================================
    // PHASE 4: RE-ENGAGE (Days 46-60)
    // ============================================

    // Email 22 - Day 48: Still Here
    {
        id: 22,
        phase: "re-engage",
        day: 48,
        subject: "Re: still here for you",
        content: cleanContent(`{{firstName}},

I haven't heard from you in a while.

That's okay. Everyone's journey is different.

I just wanted you to know: I'm still here. The door is still open. Your path is still waiting.

Maybe now isn't the time. Maybe life is full. Maybe fear is loud.

Whatever is true, I honor it.

But when you're ready - whether that's tomorrow or a year from now - the certification will be here. I'll be here.

Your gifts aren't going anywhere.

With love,

${ASI_SIGNATURE}`),
    },

    // Email 23 - Day 52: Resource Share
    {
        id: 23,
        phase: "re-engage",
        day: 52,
        subject: "Re: something that might help",
        content: cleanContent(`{{firstName}},

I wanted to share something with you - no strings attached.

A simple exercise for when you feel energetically heavy:

Close your eyes. Imagine a column of white light descending from above, entering through your crown. Feel it moving through your body, gently pushing out anything that isn't yours - absorbed emotions, others' energy, stress.

See it flowing out through your feet, into the earth. The earth transmutes it. You feel lighter.

Breathe. Thank your guides. Open your eyes.

Takes 2 minutes. Works every time.

This is from Lesson 7 of the certification, but I wanted you to have it now.

Because I believe you're on this path - whether certified or not.

${ASI_SIGNATURE}`),
    },

    // Email 24 - Day 56: Reconnection
    {
        id: 24,
        phase: "re-engage",
        day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

I was thinking about you today.

About that moment when you first signed up for the Mini Diploma. Something called you. Something whispered "this matters."

That voice? It's still there. Still whispering.

Maybe louder than before.

I don't know what your journey looks like right now. But I know this:

The spiritual healing path isn't going anywhere. Women are seeking help that conventional approaches can't provide. And there are never enough certified practitioners.

If you ever want to continue the conversation - about the certification, about the work, about anything - just reply.

I'm here.

${ASI_SIGNATURE}`),
    },

    // Email 25 - Day 60: Final Message
    {
        id: 25,
        phase: "re-engage",
        day: 60,
        subject: "Re: one final thought",
        content: cleanContent(`{{firstName}},

This is my last scheduled message in this sequence.

I want to leave you with something:

You found your way to spiritual healing for a reason. Whether you ever pursue certification or not - that calling is real. Those intuitive gifts are real. That longing for meaningful work is real.

Whatever path you take from here, I hope you:
- Trust your spiritual knowing
- Use your gifts in whatever way feels right
- Remember that healing is always possible

If someday the time is right for certification, you know where to find me: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Until then, I'm sending you light and love on your journey.

Thank you for being part of this community, even briefly.

With gratitude,

${ASI_SIGNATURE}

P.S. I believe in you. I believe in your gifts. I believe you're meant for something beautiful.`),
    },
];

export type SpiritualHealingNurtureEmail = typeof SPIRITUAL_HEALING_NURTURE_SEQUENCE[number];
