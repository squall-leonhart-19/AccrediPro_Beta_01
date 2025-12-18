/**
 * Shared nurture email templates - SINGLE SOURCE OF TRUTH
 * 
 * This is the exact content from inbox-test EMAIL_VARIANTS (emails 1-17).
 * Used by:
 * - /api/admin/marketing/import-nurture-emails (main nurture sequence)
 * - /api/admin/marketing/sequences/[id]/import-emails (any sequence's _default)
 */

export const NURTURE_EMAILS = [
    // Email 1 - Day 0: Welcome (Warm, Personal, Sets Expectations)
    {
        order: 0,
        subject: "Re: your free Mini Diploma access",
        delayDays: 0,
        delayHours: 0,
        content: `{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

<strong>Your Free Mini Diploma in Functional Medicine is ready</strong> - you can start right now if you want.

But before you dive in, I need to tell you something important:

<strong>This isn't like other freebies.</strong>

You know those PDFs that sit in your downloads folder collecting digital dust? Those "free courses" that are really just 45-minute sales pitches?

This isn't that.

This is <strong>real training</strong>. The same foundational content our certified practitioners learned. By the end, you'll understand root-cause thinking in a way that changes how you see health forever.

You'll also earn an actual credential - a Mini Diploma you can be proud of.

<strong>Here's what I want you to do:</strong>

Log into the platform and start Lesson 1. It takes about 20 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days to see how you're doing. And {{firstName}} - if you have ANY questions, just hit reply. I read and respond to every single email.

This is the beginning of something big.

Sarah

P.S. Check your messages inside the platform - I've left you a personal voice note. I want you to hear my voice before we really get started.`,
    },

    // Email 2 - Day 1: Sarah's Story (Deep Storytelling Version)
    {
        order: 1,
        subject: "Re: my story (thought you'd relate)",
        delayDays: 1,
        delayHours: 0,
        content: `{{firstName}},

Can I tell you something I don't share with everyone?

<strong>The Kitchen Floor Moment</strong>

It was 11pm on a Tuesday. My daughter was finally asleep. I was sitting on my kitchen floor, bills spread around me, calculator in hand.

The numbers didn't add up. Again.

I'd just worked a 12-hour day at a job that was slowly killing me. Gave the same generic advice I'd given a hundred times: "Eat more vegetables. Drink more water. Try to reduce stress."

I knew it wasn't helping anyone. And I couldn't even take my own advice - I was exhausted, inflamed, running on coffee and anxiety.

<strong>I looked at my reflection in the microwave door and didn't recognize myself.</strong>

When did I become this tired, defeated person? When did "helping people" start feeling like a lie I told myself to get through the day?

Have you ever felt that way, {{firstName}}? That gap between who you are and who you wanted to become?

<strong>The Moment Everything Changed</strong>

That night, I couldn't sleep. I started researching at 2am. Functional medicine. Root-cause health. A different approach.

And something clicked.

For the first time, I understood WHY I felt so stuck. Why my clients weren't getting better. Why the advice I'd been giving was like putting band-aids on broken legs.

<strong>It wasn't that I was bad at my job. I just didn't have the right tools.</strong>

Fast forward three years: I work from home. I set my own hours. I help people who've been dismissed by every doctor they've seen. And my daughter? She tells her friends her mom "helps people feel better."

That's worth everything.

<strong>I'm telling you this because...</strong>

If you're where I was - tired, stuck, wondering if there's more - I need you to know: there is.

The Mini Diploma you're taking right now? It's the first step on the same path I walked.

So tell me, {{firstName}} - what made you curious about functional medicine? What's YOUR kitchen floor moment?

Hit reply. I want to hear your story.

Sarah

P.S. I still have that microwave. Every time I see my reflection in it now, I smile. Crazy how much can change.`,
    },

    // Email 3 - Day 3: The "Aha" Moment (Why Generic Advice Fails)
    {
        order: 2,
        subject: "Re: why the usual advice doesn't work",
        delayDays: 3,
        delayHours: 0,
        content: `{{firstName}},

I need to tell you about Linda.

She came to me last year. 52 years old. Exhausted for three years straight. Brain fog so bad she'd forget words mid-sentence.

<strong>She'd seen four doctors.</strong> They all said the same thing:

"Your labs are normal."
"Try to sleep more."
"Maybe it's just stress."
"Have you considered antidepressants?"

By the time she found me, she was starting to believe them. Maybe it WAS all in her head. Maybe this was just what 52 felt like.

<strong>It wasn't.</strong>

Within 20 minutes of looking at her case through a functional lens, I found three things her doctors missed. Not because they were bad doctors - because they weren't trained to look.

Six weeks later, Linda texted me: <strong>"I feel like myself again. I forgot what that even felt like."</strong>

<strong>Here's the thing, {{firstName}}:</strong>

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Reduce stress" doesn't help when the stress is coming from inside (inflammation, blood sugar, hormones).
"Exercise more" doesn't help when your adrenals are shot and exercise makes you worse.

The real questions are:
- <strong>Why</strong> is she exhausted? (not "she's exhausted, give her caffeine")
- <strong>What's driving</strong> the inflammation? (not "here's an anti-inflammatory")
- <strong>Where</strong> is the breakdown happening? (not "let's mask the symptoms")

This is what you're learning in your Mini Diploma. This is the difference between surface-level wellness advice and <strong>root-cause practice</strong>.

Have you started yours yet?

If not, today's a good day. Even the first lesson will change how you see health forever.

<strong>Quick question:</strong> Have you ever had a "Linda moment" - where you KNEW something was wrong but couldn't figure out what? Reply and tell me about it.

Sarah

P.S. Linda now refers me clients. Her exact words: "I tell everyone - the doctors kept me sick, Sarah made me well."`,
    },

    // Email 4 - Day 5: The Graduate Training (Soft Pitch)
    {
        order: 3,
        subject: "Re: the training I mentioned",
        delayDays: 5,
        delayHours: 0,
        content: `{{firstName}},

Remember the kitchen floor moment I told you about?

There's a part I didn't share.

<strong>The 3am Discovery</strong>

That night, after crying on my kitchen floor, I couldn't sleep. I went down a rabbit hole - functional medicine, integrative health, root-cause approaches.

At 3am, I found a training video. Some woman I'd never heard of, talking about how she went from burned-out health coach to running a thriving practice from home.

I almost clicked away. "Yeah right," I thought. "Another scam."

But something made me keep watching.

She talked about how the gut connects to the brain. How hormones affect everything. How standard blood tests miss 80% of what's actually happening in the body.

<strong>And suddenly, I understood why I'd been failing.</strong>

It wasn't that I was bad at helping people. I just didn't have the right training. I was trying to solve advanced problems with beginner tools.

That video changed my life.

<strong>Now I've Made One For You</strong>

It's called the Graduate Training. 45 minutes. No fluff.

I walk you through:
- How practitioners like you are building <strong>real income</strong> doing this work
- The exact <strong>certification path</strong> from curious to confident
- What separates those who succeed from those who stay stuck
- <strong>Real numbers</strong> - what our graduates actually earn

This isn't a pitch disguised as training. It's the same roadmap I wish someone had shown me on that kitchen floor night.

<strong>One thing I ask:</strong>

Watch it when you can actually focus. Not while cooking dinner or half-watching TV. This deserves your full attention.

And after you watch it, hit reply and tell me what you think. I want to hear your honest reaction.

Sarah

P.S. If you haven't finished your Mini Diploma yet, do that first. The Graduate Training will make more sense once you've got that foundation.`,
    },

    // Email 5 - Day 7: Diane's Story (Burned-Out Nurse - Deep Version)
    {
        order: 4,
        subject: "Re: Diane's story (burned-out nurse)",
        delayDays: 7,
        delayHours: 0,
        content: `{{firstName}},

I want to tell you about Diane.

Not the Instagram highlight reel. The real story.

<strong>40 Years, One Breaking Point</strong>

Diane was a nurse for 40 years. Forty. Years.

She'd held dying patients' hands. Comforted terrified families. Worked double shifts during the pandemic while her own health fell apart.

She was accomplished. Respected. And completely, utterly burned out.

The day she called me, she'd just worked a 14-hour shift. Her voice was hoarse. She said:

<strong>"Sarah, I love helping people. But I can't do this anymore. The 5am alarms. The 2-hour commutes. The bureaucracy that keeps me from actually HELPING anyone. I'm 62 years old and I'm tired."</strong>

Then she said something that broke my heart:

"But what else can I do? I'm too old to start over."

Have you ever felt that, {{firstName}}? Too far down one path to change direction?

<strong>The Question That Changed Everything</strong>

I asked her: "Diane, what if 'starting over' wasn't the right frame? What if you're not leaving nursing behind - you're taking everything you know and finally using it properly?"

Silence.

Then: "What do you mean?"

<strong>Here's what happened next:</strong>

Diane enrolled. She was terrified. Her first week, she messaged me:

"I'm reading about the gut-brain connection and I'm ANGRY. Why didn't they teach us this in nursing school? I've been telling patients to 'reduce stress' for 40 years when their inflammation was driving everything."

<strong>Month 1:</strong> Certified. For the first time in years, she felt like she was learning something that actually mattered.

<strong>Month 3:</strong> First three clients. Women with hormone issues who'd been dismissed by their doctors. Diane knew EXACTLY how they felt - she'd dismissed patients the same way before she knew better.

<strong>Month 6:</strong> <strong>$8,000/month.</strong> Working from her home office. Setting her own hours. No 5am alarms. No commute.

<strong>What Diane Says Now</strong>

"I finally feel like I'm using everything I know - without sacrificing my health or my life to do it. I wish I'd found this 20 years ago. But I'm grateful I found it at all."

<strong>Here's why I'm telling you this, {{firstName}}:</strong>

If you've ever thought you're "too old" to change - you're not.
If you've ever thought your background doesn't translate - it does.
If you've ever felt like you have so much to give but no good way to give it - there IS a way.

Diane is 62. She's building the practice she should have had all along.

What about you?

Sarah

P.S. About 35% of our students come from medical backgrounds - nurses, doctors, PAs. If that's you, you're not starting from zero. You're adding the missing piece to everything you already know.`,
    },

    // Email 6 - Day 9: The Roadmap (Clear Path)
    {
        order: 5,
        subject: "Re: your complete roadmap",
        delayDays: 9,
        delayHours: 0,
        content: `{{firstName}},

Can I be honest with you?

I hate vague promises.

"Change your life!" "Find your purpose!" "Make money doing what you love!"

Cool. But HOW?

When I was sitting on that kitchen floor, I didn't need inspiration. I needed a <strong>map</strong>. A clear path from "stuck and miserable" to "confident and earning."

So that's what I'm giving you today.

<strong>The Complete Roadmap</strong>

Here's exactly how this works - no fluff, just facts:

<strong>STEP 0: Mini Diploma (Free - You're Here)</strong>
This is your "try before you buy." You learn root-cause thinking. You earn a real credential. You decide if this path is for you.
Time: 2-3 hours total

<strong>STEP 1: Certified Practitioner ($997)</strong>
This is where everything changes. 21 modules of real training. Not surface-level wellness fluff - actual clinical knowledge.
- How to assess clients properly
- Lab interpretation that goes beyond "normal" ranges
- Protocol design that actually works
- Confidence to charge for your expertise
Time: 8-12 weeks | Income potential: <strong>$3,000-$5,000/month</strong>

<strong>STEP 2: Practice Builder (Included)</strong>
Most certifications leave you hanging after the training. We don't.
- Client acquisition systems
- Ethical marketing that doesn't feel gross
- How to build a practice that fits YOUR life
Income potential: <strong>$5,000-$10,000/month</strong>

<strong>STEP 3: Advanced Practitioner (Optional)</strong>
For those who want to go deeper.
- Complex cases
- Premium positioning
- Become THE expert in your area
Income potential: <strong>$10,000-$30,000/month</strong>

<strong>Here's What This Actually Looks Like:</strong>

Maria started at Step 0 (just like you). One year later: <strong>$12,000/month</strong>, working from home, waiting list of clients.

Diane started at Step 0 at age 62. Six months later: <strong>$8,000/month</strong>, no more 5am alarms.

Kelly started at Step 0 with zero business experience. Now: <strong>Fully booked practice</strong>, clients finding HER.

<strong>The Question You're Probably Asking</strong>

"But Sarah, $997 is a lot of money."

I know. Here's how I think about it:

- Traditional health certifications: $15,000-$50,000
- Years of school (and lost income): $100,000+
- Staying stuck for another year: Priceless frustration

$997 pays for itself with <strong>your first 2-3 clients</strong>. Everything after that is profit.

But I'll talk more about the investment in a few days. First, I want to answer the #1 question everyone asks:

<strong>"How do I actually get clients?"</strong>

That's tomorrow's email. Don't miss it.

Sarah

P.S. Look at that roadmap again. You're at Step 0. The question isn't "if" you can reach Step 1, 2, or 3 - it's whether you'll decide to.`,
    },

    // Email 7 - Day 11: How to Get Clients (The Real Answer)
    {
        order: 6,
        subject: "Re: getting clients (the real answer)",
        delayDays: 11,
        delayHours: 0,
        content: `{{firstName}},

I need to tell you about Kelly.

She sent me this message three months after getting certified:

<strong>"Sarah, I have a WAITLIST. I don't know what to do with a waitlist. I've never had a waitlist for anything in my life."</strong>

Here's the thing about Kelly:

She's a nurse practitioner. Zero business experience. Terrified of "marketing." She told me during enrollment: "I don't have an audience. I don't have a following. I don't know how to sell anything."

<strong>So how did she build a waitlist in 90 days?</strong>

<strong>The Simple System That Works</strong>

Kelly didn't run ads. Didn't build a fancy website. Didn't become an Instagram influencer.

She did three things:

<strong>1. She Posted What She Was Learning</strong>

Every few days, she'd share something from her training. Not salesy stuff. Just: "I learned something wild today about how gut bacteria affects anxiety. Never knew this before."

Her friends started asking questions. Then friends of friends.

<strong>2. She Offered Free 15-Minute Calls</strong>

Not consultations. Not sales calls. Just "Hey, if you're dealing with [specific thing], I'll chat with you for 15 minutes about what might be going on."

Guess what? People who get value in 15 minutes want to pay for more.

<strong>3. She Let Her First Clients Talk</strong>

When someone got results, she asked: "Would you mind telling a friend who might be struggling with something similar?"

They did. Those friends became clients. Those clients referred more friends.

That's it. No fancy funnel. No paid ads. No dancing on TikTok.

<strong>Why This Works (Especially for Women 40+)</strong>

Here's what most "business gurus" don't understand:

Your network IS your market. You already know people who are struggling with health issues. You just don't have the tools to help them yet.

Once you do? You're not "selling" - you're serving.

And when you help someone who's been dismissed by every doctor they've seen? <strong>They tell everyone.</strong>

<strong>What We Give You</strong>

Inside the certification, you don't just learn functional medicine. You get:

- The "Signature Talk" method (generate 5-10 leads from one 30-minute presentation)
- The Referral Engine (turn happy clients into your marketing team)
- Done-for-you scripts and templates
- The exact posts that worked for Kelly and others

You don't need to be good at marketing. You need a system that works even if you hate marketing.

We give you that system.

<strong>Question for you, {{firstName}}:</strong>

Do you know three people who are struggling with their health right now - exhausted, frustrated, not getting answers from their doctors?

Think about them for a second.

Now imagine being the one who finally helps them.

That's what we're building toward.

Sarah

P.S. Kelly's waitlist problem? She solved it by raising her prices. Twice. She now charges $400/session and people still line up. That's what happens when you actually help people.`,
    },

    // Email 8 - Day 13: Vicki's Story (No Medical Background)
    {
        order: 7,
        subject: "Re: Vicki's transformation",
        delayDays: 13,
        delayHours: 0,
        content: `{{firstName}},

I want to tell you about Vicki. Especially if you've ever thought: <strong>"But I don't have a medical background."</strong>

<strong>The Yoga Teacher's Frustration</strong>

Vicki wasn't a nurse. Wasn't a doctor. She was a yoga teacher.

For years, she helped people breathe better, move better, feel better in their bodies. She loved it.

But something kept nagging at her.

Students would come to class exhausted, inflamed, struggling with issues yoga couldn't touch. Gut problems. Hormonal chaos. Brain fog that no amount of meditation could clear.

<strong>They'd say: "Vicki, I feel a little better after class, but then I go home and... nothing changes."</strong>

She'd nod and say something supportive. But inside, she felt helpless.

"I felt like I was only scratching the surface," she told me. "Like I was giving people an hour of relief in a life of struggle. And I knew - KNEW - there was more I could offer. But I didn't have the training."

Have you ever felt that, {{firstName}}? Like you know you could help more, but something's missing?

<strong>The Fear That Almost Stopped Her</strong>

When Vicki found our program, she almost didn't enroll.

Her objections:
- "I don't have a science degree. Can I actually understand this?"
- "Will anyone take me seriously without medical credentials?"
- "What if it's too technical? What if I fail?"

I talked to her on the phone. She was crying by the end.

"I've wanted to do something like this for ten years," she said. "But I keep telling myself I'm not qualified."

I asked her: "Vicki, do your yoga students trust you?"

"Yes."

"Do they ask you for health advice even though you're 'just' a yoga teacher?"

"All the time."

<strong>"Then you're already more qualified than you think. You just need the tools."</strong>

<strong>What Actually Happened</strong>

Vicki enrolled. And here's what she discovered:

The training met her where she was. We don't assume you have a medical degree. We teach from the ground up - biochemistry made simple, not intimidating.

By week 4, she messaged me: "I just explained the gut-brain connection to my husband and HE understood it. If I can explain it, I can teach it."

<strong>Month 2:</strong> Her yoga students became her first clients. They already trusted her. Now she could actually help them.

<strong>Month 4:</strong> She added <strong>$4,200/month</strong> to her income. Didn't give up yoga - just added functional coaching as a premium offering.

<strong>Month 6:</strong> She raised her prices. Started getting referrals from people she'd never met.

<strong>What Vicki Says Now</strong>

"I'm finally the practitioner I always knew I could be. My clients get real results. And when they ask me 'why does this work?' - I can actually explain it. That confidence? It changes everything."

<strong>Here's What This Means For You</strong>

About 25% of our students come from wellness backgrounds. Yoga teachers, massage therapists, nutritionists, fitness coaches, health coaches.

You're not starting from zero. You're starting from a foundation of trust and caring. We just add the missing piece - the clinical knowledge that turns "I wish I could help" into "I know exactly what to do."

<strong>Quick question:</strong>

Have you ever had someone ask you for health advice and felt like you couldn't really help them the way you wanted to?

Reply and tell me about it. I'd love to hear.

Sarah

P.S. Vicki's yoga students now call her their "health guru." Same people, same trust - just way more impact. Your people are waiting too.`,
    },

    // Email 9 - Day 15: Is This Legit? (Addressing Skepticism)
    {
        order: 8,
        subject: "Re: about our accreditation",
        delayDays: 15,
        delayHours: 0,
        content: `{{firstName}},

Can we have an honest conversation?

I know what you might be thinking. I'd be thinking it too.

<strong>"Is this actually legitimate? Or is this just another online certificate that means nothing?"</strong>

Fair question. Let me answer it directly.

<strong>First, Let Me Tell You What We're NOT</strong>

We're not a weekend workshop that hands you a PDF and calls you "certified."

We're not a glorified YouTube playlist with a fancy name.

We're not one of those programs where everyone passes because the only requirement is paying.

<strong>Here's What We Actually Are</strong>

<strong>21 Comprehensive Modules</strong>
This isn't surface-level wellness content. We cover biochemistry, lab interpretation, protocol design, clinical assessment. Real knowledge that takes months to learn, not hours.

<strong>Real Assessment</strong>
You don't just watch videos. You complete case studies. You pass exams. You demonstrate actual competency. About 15% of students need to retake assessments - because we actually have standards.

<strong>Verifiable Credentials</strong>
Every certificate has a unique verification number. Anyone can look you up in our public registry and confirm your qualification. Try doing that with most "online certifications."

<strong>Graduates Who Actually Practice</strong>
Our graduates aren't hiding their credentials in a drawer. They're working with clients, building practices, charging real money - and getting real results.

<strong>But Here's What Actually Matters</strong>

Credentials are important. But you know what matters more?

<strong>Confidence.</strong>

After this program, you won't be wondering "Am I qualified?" You'll KNOW you are.

You'll be able to explain complex health concepts in simple terms. You'll look at a case and know exactly what questions to ask. You'll design protocols that actually work.

And that confidence? Clients can feel it. It's the difference between "maybe you should see a doctor about that" and "here's what's happening in your body, and here's what we're going to do about it."

<strong>The Real Test</strong>

Don't take my word for it. Look at our graduates.

Diane: 40 years as a nurse, now running her own practice at 62.
Kelly: Zero business experience, now has a waitlist.
Vicki: Yoga teacher background, added $4,200/month to her income.
Maria: Single mom with no health background, now earning $12,000/month.

<strong>They're not special.</strong> They just got trained properly and did the work.

The credential gave them permission to start. The knowledge gave them confidence to succeed.

<strong>One More Thing</strong>

I've had people ask: "But will doctors respect this?"

Here's what I tell them:

You're not trying to be a doctor. You're filling a gap that doctors CAN'T fill - the time, attention, and root-cause approach that the medical system doesn't provide.

Most of our graduates get referrals FROM doctors who know their patients need something they can't offer in a 15-minute appointment.

That's not competition. That's collaboration.

What other questions do you have about the program? Hit reply - I answer every email personally.

Sarah

P.S. Still skeptical? Good. Skeptics make the best students - they actually pay attention. Your skepticism isn't a red flag, it's a green one.`,
    },

    // Email 10 - Day 17: Time Objection (The Truth About Busy)
    {
        order: 9,
        subject: "Re: about the time commitment",
        delayDays: 17,
        delayHours: 0,
        content: `{{firstName}},

Let me guess what you're thinking:

<strong>"This sounds great, Sarah. But I don't have time."</strong>

I hear this every single day. And I get it - I really do.

You're working full-time. Maybe raising kids. Already overwhelmed. The idea of adding ANYTHING to your plate feels impossible.

Here's what I want to tell you.

<strong>The Myth of "Finding Time"</strong>

When I started my journey, I was a single mom working 50+ hour weeks. "Time" was the last thing I had.

But here's what I learned:

<strong>Nobody "finds" time. You make time for what matters.</strong>

Be honest with yourself for a second. How much time did you spend this week:
- Scrolling Instagram?
- Watching Netflix?
- Lying awake at 2am worrying about your future?

I'm not judging. I did all of those things. But here's the truth:

If you have 45 minutes a day to worry about your life, you have 45 minutes a day to change it.

<strong>How The Program Actually Works</strong>

This isn't a rigid classroom schedule. It's designed for busy women:

<strong>Self-Paced</strong>
Study at 5am before the kids wake up. Study at 10pm after they're asleep. Study on your lunch break. Study on the weekend. There are zero live sessions required.

<strong>5-7 Hours Per Week</strong>
That's less than an hour a day. Most students finish in 8-12 weeks. Some take longer - and that's fine. You have lifetime access.

<strong>Mobile-Friendly</strong>
Watch lessons on your phone while waiting in the pickup line. Listen while you cook dinner. I've had students complete entire modules in their car (parked, obviously).

<strong>Progress Saved</strong>
Stop mid-lesson if the baby cries. Pick up exactly where you left off. The platform remembers everything.

<strong>What Rachel Told Me</strong>

Rachel enrolled while working full-time as an accountant with two kids under 5.

Her husband said: "When are you going to have time for this?"

Her response: "I'll find it."

She studied during nap times. During her lunch break. After the kids went to bed - the time she used to spend scrolling her phone.

<strong>She finished in 11 weeks.</strong>

Two months later, she had her first paying client. Six months later, she'd reduced her accounting hours to part-time. Now she's fully transitioned.

She told me: "I thought I didn't have time. The truth is, I didn't have time NOT to do this. Every day I stayed stuck was a day I wasn't building the life I wanted."

<strong>The Real Question</strong>

{{firstName}}, the question isn't "Do I have time?"

The question is: <strong>"What am I making time FOR?"</strong>

Another year of the same routine?
Or something that actually leads somewhere?

Time will pass either way. 365 days from now, you'll be 365 days older.

The only question is: Will you be in the same place?

Sarah

P.S. Maria studied while her three kids slept. She'd text me at midnight: "Just finished Module 7!" One year later: $12,000/month. Time is what you make it.`,
    },

    // Email 11 - Day 19: Money Talk (The Investment)
    {
        order: 10,
        subject: "Re: the investment question",
        delayDays: 19,
        delayHours: 0,
        content: `{{firstName}},

Let's have an honest conversation about money.

The Certified Practitioner program is <strong>$997</strong>.

I'm not going to pretend that's nothing. For a lot of people, that's a significant amount of money.

So let's actually talk about it.

<strong>The Question You're Really Asking</strong>

When someone says "I can't afford this," they're usually asking one of two questions:

1. "Is this worth it?" (Will I actually get a return on this investment?)
2. "Can I make this work?" (How do I find the money?)

Let me answer both.

<strong>Question 1: Is This Worth It?</strong>

Let's do real math.

<strong>The Cost of Traditional Routes:</strong>
- Health coaching certification: $5,000-$15,000
- Nutrition degree: $30,000-$80,000+
- Nursing/medical school: $100,000+
- Time investment: 2-6 YEARS

<strong>The Cost of Our Program:</strong>
- Investment: $997
- Time: 8-12 weeks
- Lifetime access: Included

<strong>The Return on Investment:</strong>

Most graduates charge <strong>$200-$500 per client session</strong>.

$997 / $250 per session = <strong>4 clients to break even</strong>.

After that? Everything is profit.

Maria earns $12,000/month. Her investment paid back in her <strong>first week</strong> of taking clients.

Diane earns $8,000/month. Her investment paid back in her <strong>first month</strong>.

Kelly charges $400/session and has a waitlist. Her investment paid back <strong>twice over</strong> in month one.

<strong>Question 2: How Do I Make This Work?</strong>

If $997 upfront feels like too much, we have options:

<strong>Payment Plan:</strong>
- 3 payments of $349
- 6 payments of $179

No credit check. No interest. Just manageable monthly amounts.

<strong>The Harder Question</strong>

But here's what I really want you to think about, {{firstName}}:

<strong>What's the cost of NOT doing this?</strong>

Not in dollars. In life.

Another year of being stuck?
Another year of knowing you could be doing more?
Another year of watching other people build the life you want?

I can't put a price tag on that. But you know what it feels like.

<strong>A Story About Investment</strong>

When Maria enrolled, she literally didn't have $997. She was a single mom. Bills were tight.

She called me and said: "Sarah, I want to do this, but I don't know where the money will come from."

I asked her: "If you DON'T do this, where will you be in a year?"

Silence.

Then: "The same place I am now."

She signed up for the payment plan. Figured out $179/month. Was terrified the whole time.

Twelve months later, she was earning $12,000/month and crying happy tears at the coffee shop with her daughter.

<strong>She told me: "The $997 was the best money I ever spent. It wasn't an expense - it was the down payment on a different life."</strong>

I'm not saying that to pressure you. I'm saying it because it's true.

What questions do you have? Reply and ask me anything.

Sarah

P.S. If money is genuinely the barrier - not fear dressed up as a money objection, but actual financial constraint - reply and tell me. We'll figure something out.`,
    },

    // Email 12 - Day 21: Maria's Full Story (Master Testimonial)
    {
        order: 11,
        subject: "Re: Maria's journey (single mom)",
        delayDays: 21,
        delayHours: 0,
        content: `{{firstName}},

I need to tell you about Maria.

Not the highlight reel. The real story.

<strong>The Breaking Point</strong>

It was a Tuesday night. Maria was sitting on her kitchen floor at 11pm, bills spread around her, kids finally asleep.

She'd just worked a 10-hour day at a job she hated. Sat in traffic for two hours. Microwaved dinner for her three kids because she was too exhausted to cook.

And now she was staring at numbers that didn't add up. Again.

<strong>She told me later: "I remember looking at my reflection in the microwave door and not recognizing myself. When did I become this tired, defeated person?"</strong>

Maybe you've had a moment like that, {{firstName}}? Where you suddenly realize - this isn't the life you imagined?

Maria was 43. Single mom. Three kids under 10. No health background. No savings. Just a desperate feeling that there had to be something more.

<strong>The Almost-Quit Moment</strong>

When Maria enrolled, she was terrified.

Week 3, everything fell apart. Her youngest got sick. Work exploded with a deadline. She hadn't touched the training in 6 days.

She sent me a voice message at 2am: <strong>"Sarah, I think I made a mistake. Who am I kidding? I'm too old for this. Too tired. I should just get a refund and accept that this is my life."</strong>

I called her the next morning.

"Maria," I said, "that voice telling you to quit? That's not wisdom. That's fear. And fear has kept you stuck for how long?"

Silence. Then: "Fifteen years."

"So what's another 8 weeks of trying something different?"

She stayed.

<strong>The First Win</strong>

I'll never forget the text she sent me. 11:47pm on a Thursday.

"SARAH. My friend Lisa - you know, the one with the brain fog? She just texted me. Her energy is back. She's sleeping through the night for the first time in 3 years. <strong>She said I changed her life.</strong> ME. I did that."

I still have that screenshot saved.

That was Maria's first $150. But it wasn't about the money. It was the moment she realized: <strong>I actually know what I'm doing. I can help people.</strong>

<strong>The Transformation</strong>

Fast forward 6 months. Maria called me crying.

"I just quit my job," she whispered.

"And?" I asked.

"And I'm terrified. And <strong>I've never been happier.</strong>"

By month 8, she was earning <strong>$8,000/month</strong> from her dining room table. By month 12, <strong>$12,000</strong>. Waiting list of clients. Setting her own hours. Actually being there when her kids got home from school.

But here's what gets me, {{firstName}}:

Last month, Maria sent me a photo. Her and her daughter at a coffee shop - a "no reason" Tuesday morning date.

The caption: <strong>"A year ago I was crying on my kitchen floor. Today my daughter said, 'Mommy, you seem so happy now.' I couldn't answer. I just hugged her."</strong>

<strong>Why I'm Telling You This</strong>

Maria isn't special.

She didn't have advantages you don't have. She wasn't smarter or younger or less busy. She was a 43-year-old exhausted single mom who was terrified and almost quit in week 3.

The only difference between Maria then and Maria now?

<strong>She made one decision.</strong>

She decided that her circumstances wouldn't write the rest of her story.

{{firstName}}, I don't know what your kitchen floor moment looks like. Maybe it's the car. The bathroom mirror. The 3am ceiling-stare.

But I know you're reading this for a reason.

<strong>So let me ask you directly: What would your life look like one year from now if you made the same decision Maria made?</strong>

Just hit reply and tell me. I read every single response.

Sarah

P.S. Maria's daughter is now 8. She tells everyone her mom "helps people feel better." And Maria? She told me that's worth more than any amount of money. <strong>But the $12k/month doesn't hurt either.</strong>`,
    },

    // Email 13 - Day 23: Two Paths (The Visualization)
    {
        order: 12,
        subject: "Re: thinking about your decision",
        delayDays: 23,
        delayHours: 0,
        content: `{{firstName}},

I want to try something with you.

Close your eyes for a second. (Well, read this first, THEN close your eyes.)

<strong>Imagine It's December 2026</strong>

You're sitting somewhere comfortable. Maybe your couch. Maybe a coffee shop. A full year has passed.

Now I want you to imagine two different versions of that moment:

<strong>Future A: You Didn't Take Action</strong>

It's a year from now. Nothing has changed.

Same job. Same frustrations. Same Sunday night dread about Monday morning.

The Mini Diploma you started? You never finished it. Or maybe you did, but it's just sitting there - another certificate in a drawer.

You still scroll past posts about functional medicine and think "I should do something with that." But you never do.

Your health is probably the same. Maybe worse. The stress hasn't gone anywhere.

And that dream of helping people, working for yourself, building something meaningful? It's still just a dream.

Not terrible. Just... the same.

<strong>Future B: You Made A Decision</strong>

It's a year from now. Everything is different.

You're certified. You've been for months now. The nervousness you felt at the start feels like a distant memory.

You have clients. Maybe 5. Maybe 15. Women who come to you frustrated and leave with answers. Women who text you "I feel like myself again" and make you cry happy tears.

You're earning money doing this. Maybe $2,000/month. Maybe $8,000. Maybe more. Depends on how hard you went.

You work on YOUR schedule. From YOUR home. On YOUR terms.

And that feeling of "I'm meant for something more"? It's gone. Because you're finally doing the more.

<strong>Here's The Thing, {{firstName}}</strong>

Both of those futures take the same amount of time to arrive.

365 days will pass either way.

You'll be one year older no matter what.

The only difference? The decision you make now.

<strong>I'm Not Going To Pressure You</strong>

I don't believe in fake scarcity or manipulation.

But I do believe in truth. And the truth is:

Every day you wait is a day you're NOT building the life you want.

The best time to start was a year ago. The second best time is right now.

<strong>A Question To Sit With</strong>

{{firstName}}, if you imagine yourself a year from now and nothing has changed... how does that feel?

Now imagine yourself a year from now having taken the leap. Certified. Helping people. Earning.

Which version do you want to be?

Reply and tell me. I genuinely want to know.

Sarah

P.S. Maria told me: "I wish I'd started five years earlier. But I'm grateful I didn't wait another five." Don't let Future A become your story.`,
    },

    // Email 14 - Day 25: FAQ (Objection Crusher)
    {
        order: 13,
        subject: "Re: your questions (answered)",
        delayDays: 25,
        delayHours: 0,
        content: `{{firstName}},

Before you decide anything, I want to answer the questions I know you're asking.

Not because I'm trying to "overcome your objections" (I hate that sales-y language).

But because I've heard these same questions from thousands of women, and you deserve honest answers.

<strong>"What if I'm not smart enough?"</strong>

Let me tell you about Patricia. She's 58. Hasn't been in school since the 1980s. Told me on our first call: "Sarah, I barely passed high school chemistry. I don't know if my brain can do this."

She certified in 9 weeks. Now she explains biochemistry to her clients better than most doctors.

Here's the truth: <strong>This isn't hard. It's just NEW.</strong> We break everything down into simple, digestible pieces. If you can follow a recipe, you can do this.

<strong>"What if I fail?"</strong>

You can retake any assessment as many times as you need. There's no time limit. No one is grading you on a curve.

We're not trying to weed people out. We're trying to help you succeed.

And honestly? The only way to "fail" is to not try at all.

<strong>"What if I can't get clients?"</strong>

This is the big one, right?

Here's what I'll say: We don't just teach you functional medicine and then say "good luck!"

You get:
- Done-for-you client acquisition systems
- Scripts and templates that actually work
- A community of practitioners sharing what's working for THEM
- Support from our team when you're stuck

Kelly had zero business experience. She has a waitlist now.
Vicki was "just a yoga teacher." She added $4,200/month.
Maria knew nothing about marketing. She earns $12,000/month.

<strong>None of them were "natural" business people. They just followed the system.</strong>

<strong>"What if my family thinks this is stupid?"</strong>

They might. At first.

Diane's husband rolled his eyes when she enrolled. Three months later, when she replaced her nursing income working from home, he stopped rolling his eyes.

Maria's mom said she was "throwing money away." Now her mom tells everyone about her "successful daughter."

<strong>The people who doubt you now will be your biggest cheerleaders later.</strong> They just can't see what you see yet.

<strong>"What if I invest and then life gets crazy?"</strong>

You get lifetime access. Forever.

Start now. Pause when you need to. Pick up where you left off. We're not going anywhere, and neither is your access.

Several of our students took 6+ months to finish due to life circumstances. They're all certified now and it doesn't matter one bit how long it took.

<strong>"Is there a guarantee?"</strong>

Yes. <strong>30 days, no questions asked.</strong>

If you go through the first 7 modules and feel like this isn't right for you - for ANY reason - email us and we'll refund every penny.

I can offer this because I know the program works. Our refund rate is under 3%. Not because we make it hard to refund - we don't. But because people get results.

<strong>"What if I'm still not sure?"</strong>

That's okay. Really.

I'm not here to pressure you into something you're not ready for.

But I will say this: <strong>Waiting until you're "sure" is just another word for waiting forever.</strong>

Maria wasn't sure. Diane wasn't sure. Kelly wasn't sure.

They enrolled anyway. And they figured out the "sure" part along the way.

What other questions do you have? Reply and ask me anything. I answer every email.

Sarah

P.S. The guarantee means there's literally zero risk. Worst case: you try it, it's not for you, you get your money back. Best case: your entire life changes. Seems worth trying.`,
    },

    // Email 15 - Day 27: Closing Friday (Real Urgency)
    {
        order: 14,
        subject: "Re: enrollment closing Friday",
        delayDays: 27,
        delayHours: 0,
        content: `{{firstName}},

I need to tell you something important.

<strong>This enrollment period closes Friday at midnight.</strong>

I know you've seen this kind of thing before. "Doors closing!" "Last chance!" It usually feels like marketing nonsense.

But let me explain why this is real:

<strong>Why We Run Cohorts</strong>

I don't just sell access to a platform and disappear.

Every new cohort gets:
- Personal attention from our mentor team
- Active Q&A support
- Community engagement

I can only do that properly with limited group sizes. When we're full, I close enrollment so I can actually serve the people inside.

<strong>What You Get By Friday</strong>

If you enroll before midnight Friday:

<strong>THE CORE PROGRAM:</strong>
- All 21 training modules
- Lifetime access (no expiration)
- Certificate upon completion
- Verifiable credential in our registry

<strong>THE SUPPORT:</strong>
- Private community of practitioners
- Direct access to our mentor team
- Q&A calls with experts

<strong>THE GUARANTEE:</strong>
- 30 days, no questions asked
- If it's not right for you, full refund

<strong>THIS WEEK'S BONUSES (Disappear Friday):</strong>
- Client Attraction Masterclass (<strong>$297 value</strong>) - FREE
- Done-For-You Protocol Templates (<strong>$197 value</strong>) - FREE
- Priority placement in graduate network

<strong>Total bonus value: $494</strong> - gone after Friday.

<strong>A Word About Waiting</strong>

I've had women email me the Monday after enrollment closes:

"Sarah, I meant to sign up. Can you let me in?"

And I have to say no. Because the next cohort doesn't start for weeks. Sometimes months.

I don't want that to be you.

<strong>Here's What I Know</strong>

If you've read this far - all the way through a sequence about functional medicine certification - you're not just casually curious.

Something in you wants this.

The question is whether you'll let that something win, or whether you'll let fear talk you out of it again.

<strong>I'm not going to pressure you.</strong> But I am going to tell you the truth:

The only thing standing between you and a completely different life is a decision.

Make it before Friday.

Sarah

P.S. If you have questions, reply RIGHT NOW. I'm here this week specifically to help people who are on the fence. Let me answer whatever's holding you back.`,
    },

    // Email 16 - Day 28: 48 Hours (Last Chance Setup)
    {
        order: 15,
        subject: "Re: 48 hours left",
        delayDays: 28,
        delayHours: 0,
        content: `{{firstName}},

This is a quick one.

<strong>48 hours.</strong>

That's how much time you have before:

- The $494 in bonuses disappear
- Enrollment closes
- The next cohort doesn't start for weeks (maybe months)

<strong>I Know What's Happening In Your Head</strong>

You're thinking about it. You've been thinking about it for days.

Part of you wants to do this. Part of you is scared.

And there's probably a voice saying: "I'll do it next time. When things calm down. When I have more money. When I'm more ready."

Can I tell you something?

<strong>That voice is a liar.</strong>

Things won't calm down. You'll never feel "ready." And "next time" has a way of becoming "never."

I'm not saying that to guilt you. I'm saying it because I've heard from hundreds of women who said "I'll do it later" and then emailed me a year later saying:

<strong>"I wish I'd started when I first heard about this. I wasted a whole year."</strong>

<strong>Let Me Be Direct</strong>

What's really holding you back?

<strong>If it's fear:</strong>
Normal. Everyone feels it. Maria was terrified. Diane was terrified. Kelly was terrified. They did it anyway. Fear is not a stop sign - it's a sign you're about to do something that matters.

<strong>If it's money:</strong>
We have payment plans. $179/month. That's less than most people spend on coffee and subscriptions they don't even use.

<strong>If it's time:</strong>
5-7 hours a week. Self-paced. Watch on your phone during lunch. Study after the kids go to bed. You have the same 24 hours as everyone else - it's about what you choose to do with them.

<strong>If it's doubt:</strong>
That's what the 30-day guarantee is for. Try it. If it's not right, get your money back. Zero risk.

<strong>If it's "I'm not sure":</strong>
You'll never be sure. Certainty is a myth. The only way to know if this is right is to try it.

<strong>48 Hours, {{firstName}}</strong>

Saturday morning, this email will be irrelevant. The bonuses will be gone. The doors will be closed.

And you'll either be inside, starting your journey...

Or outside, wondering "what if?"

Make the decision.

Sarah

P.S. I've never had someone regret enrolling. I've had plenty regret waiting. Which story do you want to be?`,
    },

    // Email 17 - Day 29: Final Call (The Last Email)
    {
        order: 16,
        subject: "Re: final call",
        delayDays: 29,
        delayHours: 0,
        content: `{{firstName}},

This is my last email.

<strong>Tonight at midnight, enrollment closes.</strong>

No more reminders. No more "think about it." No more "maybe later."

You're either in, or you're waiting for the next opportunity - whenever that is.

<strong>Before You Go, I Want To Say This</strong>

I don't know your full story, {{firstName}}.

I don't know what brought you to that first Mini Diploma page. I don't know what you're struggling with. I don't know what you dream about when no one's watching.

But I do know this:

<strong>You didn't read 17 emails from a stranger by accident.</strong>

Something in you resonates with this path. Something in you knows you're meant for more than where you are right now.

The question is: Will you let that something win?

<strong>What I've Learned</strong>

In all the years I've been doing this, I've never had someone enroll and say: "I wish I hadn't done this."

But I've had hundreds of women email me months later saying:

"I wish I'd done this sooner."
"I can't believe I almost talked myself out of it."
"Why did I wait so long?"

<strong>Don't be one of them.</strong>

<strong>The Math One More Time</strong>

Investment: <strong>$997</strong> (or $179/month)
Time: <strong>8-12 weeks</strong>
Risk: <strong>Zero</strong> (30-day guarantee)
Upside: <strong>A completely different life</strong>

Maria: $12,000/month
Diane: $8,000/month
Kelly: Waitlist of clients
Vicki: $4,200/month added income

<strong>These are real women. This is what's possible.</strong>

<strong>My Promise To You</strong>

If you join tonight, I promise:

- I will personally welcome you to the community
- You will have every resource you need to succeed
- You will not be alone in this
- And if it's truly not right for you, you'll get every penny back

<strong>There is no risk. Only possibility.</strong>

<strong>Final Thought</strong>

A year from now, you'll be a year older either way.

The only question is whether you'll be in the same place... or somewhere completely different.

<strong>This is your moment, {{firstName}}.</strong>

I hope I see you inside.

Sarah

P.S. If you're reading this and you've already decided yes - stop reading. Close this email. Go enroll right now. The "perfect moment" doesn't exist. This moment is perfect enough.

<strong>Doors close at midnight. This is it.</strong>`,
    },
];

export type NurtureEmail = typeof NURTURE_EMAILS[number];
