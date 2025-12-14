import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 17 NURTURE SEQUENCE EMAILS - Optimized for Gmail Primary Inbox
 *
 * PROVEN PATTERNS (from testing):
 * - "Re:" prefix = PRIMARY (5/5 tests)
 * - "Fwd:" prefix = PRIMARY (1/1 tests)
 * - Questions without prefix = PROMOTIONS
 * - Vague subjects = PROMOTIONS
 * - "Can I ask..." = SPAM (overused)
 *
 * ALL SUBJECTS NOW USE Re: OR Fwd: ONLY
 */

// Helper to strip emojis and clean content
function cleanContent(content: string): string {
  return content
    // Remove ALL emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
    // Remove markdown bold
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove markdown italic
    .replace(/\*([^*]+)\*/g, '$1')
    // Replace fancy quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Replace em dash
    .replace(/—/g, '-')
    // Clean up "With love, Sarah" signatures
    .replace(/With love,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/Cheering for you,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/Believing in you,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/Rooting for you,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/With you,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/Ready when you are,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/Stay tuned,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/Talk soon,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/With urgency and love,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/With love and a little push,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/With love and belief in your potential,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/With all my love and belief,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .replace(/With love, hope, and belief in everything you can become,\s*\nSarah\s*[^\n]*/g, 'Sarah')
    .trim();
}

const EMAIL_VARIANTS = [
  // ============================================
  // 17 NURTURE SEQUENCE EMAILS - MAX CRO VERSION
  // Deep storytelling, engagement hooks, women 40+ optimized
  // ============================================

  // Email 1 - Day 0: Welcome (Warm, Personal, Sets Expectations)
  {
    id: 1,
    name: "Email 1: Welcome + Mini Diploma",
    day: 0,
    originalSubject: "{{firstName}}, your free Mini Diploma is ready",
    subject: "Re: your free Mini Diploma access",
    useHtmlBranding: true,
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
    id: 2,
    name: "Email 2: Sarah's Story",
    day: 1,
    originalSubject: "Re: Can I share something personal?",
    subject: "Re: my story (thought you'd relate)",
    useHtmlBranding: true,
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
    id: 3,
    name: "Email 3: Why generic advice fails",
    day: 3,
    originalSubject: "{{firstName}}, this is why generic advice fails",
    subject: "Re: why the usual advice doesn't work",
    useHtmlBranding: true,
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
    id: 4,
    name: "Email 4: The discovery",
    day: 5,
    originalSubject: "Update: The discovery that changed everything",
    subject: "Re: the training I mentioned",
    useHtmlBranding: true,
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
    id: 5,
    name: "Email 5: Diane's story",
    day: 7,
    originalSubject: "Re: From burned-out nurse to $8k/month",
    subject: "Re: Diane's story (burned-out nurse)",
    useHtmlBranding: true,
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
    id: 6,
    name: "Email 6: The roadmap",
    day: 9,
    originalSubject: "{{firstName}}, here's the roadmap",
    subject: "Re: your complete roadmap",
    useHtmlBranding: true,
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
    id: 7,
    name: "Email 7: How to get clients",
    day: 11,
    originalSubject: "Re: \"How do I actually get clients?\"",
    subject: "Re: getting clients (the real answer)",
    useHtmlBranding: true,
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
    id: 8,
    name: "Email 8: Vicki's story",
    day: 13,
    originalSubject: "Re: From yoga teacher to functional coach",
    subject: "Re: Vicki's transformation",
    useHtmlBranding: true,
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
    id: 9,
    name: "Email 9: Is this legit?",
    day: 15,
    originalSubject: "{{firstName}}, is this even legit?",
    subject: "Re: about our accreditation",
    useHtmlBranding: true,
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
    id: 10,
    name: "Email 10: Time objection",
    day: 17,
    originalSubject: "Re: \"I don't have time for this\"",
    subject: "Re: about the time commitment",
    useHtmlBranding: true,
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
    id: 11,
    name: "Email 11: Money talk",
    day: 19,
    originalSubject: "Update: Let's talk about the $997",
    subject: "Re: the investment question",
    useHtmlBranding: true,
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
    id: 12,
    name: "Email 12: Maria's story",
    day: 21,
    originalSubject: "Re: Single mom, 3 kids, now $12k/month",
    subject: "Re: Maria's journey (single mom)",
    useHtmlBranding: true,
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
    id: 13,
    name: "Email 13: Two paths",
    day: 23,
    originalSubject: "{{firstName}}, two paths ahead",
    subject: "Re: thinking about your decision",
    useHtmlBranding: true,
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
    id: 14,
    name: "Email 14: FAQ",
    day: 25,
    originalSubject: "Re: Your questions answered",
    subject: "Re: your questions (answered)",
    useHtmlBranding: true,
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
    id: 15,
    name: "Email 15: Closing Friday",
    day: 27,
    originalSubject: "[IMPORTANT] Enrollment closing Friday",
    subject: "Re: enrollment closing Friday",
    useHtmlBranding: true,
    useCtaButton: true,
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

{{CTA_BUTTON}}

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
    id: 16,
    name: "Email 16: 48 hours",
    day: 28,
    originalSubject: "Update: Bonus expires in 48 hours",
    subject: "Re: 48 hours left",
    useHtmlBranding: true,
    useCtaButton: true,
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

{{CTA_BUTTON}}

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
    id: 17,
    name: "Email 17: Final call",
    day: 29,
    originalSubject: "{{firstName}}, final call",
    subject: "Re: final call",
    useHtmlBranding: true,
    useCtaButton: true,
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

{{CTA_BUTTON}}

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
  // ============================================
  // TEST VARIANTS - HTML BRANDING & CTA LINKS
  // ============================================
  // Email 18 - Sarah's Story WITH HTML Branding (compare to Email 2)
  {
    id: 18,
    name: "TEST: Sarah's Story + HTML Branding",
    day: 1,
    originalSubject: "Testing HTML branding impact",
    subject: "Re: my story (thought you'd relate)",
    useHtmlBranding: true, // Flag for HTML template
    content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles - chronic fatigue, brain fog, autoimmune symptoms - I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking:

"There has to be more than this. There has to be a better way."

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that - it gave me back my hope.

Hope that I could truly help my clients. Hope that I could build a career I loved. Hope that I could create a future for my family that didn't depend on burning out or "faking it."

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path - because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}}... what made you curious about functional medicine?

Just hit reply - I'd love to hear your story.

Sarah`,
  },
  // Email 19 - With CTA Link to sales page
  {
    id: 19,
    name: "TEST: Email with CTA Link",
    day: 5,
    originalSubject: "Testing CTA link impact",
    subject: "Re: the training I mentioned",
    content: `{{firstName}},

I remember the exact moment everything clicked.

I was deep in my studies, learning about how the gut connects to the brain, how hormones influence mood, how toxins accumulate in ways that standard blood tests miss...

And suddenly I realized: This is the missing piece.

Not just for my clients - but for me. For my own health journey. For understanding why I'd felt stuck for so long.

That's when I knew: I had to share this with others.

Fast forward to today, and I've helped train thousands of practitioners who now confidently:

- Look beyond symptoms to find root causes
- Design protocols that actually work
- Build thriving practices helping people who've been dismissed by the system

And I created a training to show you exactly what's possible.

It's called the Graduate Training - a 45-minute session where I walk you through:

- How practitioners like you are building real income doing this work
- The exact certification path that leads to confident, credentialed practice
- What separates those who succeed from those who stay stuck

Watch the free training here: https://accredipro.academy

This isn't a pitch - it's a vision of what's ahead. Watch it, and then tell me what you think.

Sarah

P.S. If you've finished your Mini Diploma already, this is the perfect next step. If not, no pressure - come back to this when you're ready.`,
  },
  // Email 20 - With styled CTA button (HTML)
  {
    id: 20,
    name: "TEST: Email with CTA Button (HTML)",
    day: 5,
    originalSubject: "Testing CTA button impact",
    subject: "Re: the training I mentioned",
    useCtaButton: true, // Flag for CTA button
    content: `{{firstName}},

I remember the exact moment everything clicked.

I was deep in my studies, learning about how the gut connects to the brain, how hormones influence mood, how toxins accumulate in ways that standard blood tests miss...

And suddenly I realized: This is the missing piece.

That's when I knew: I had to share this with others.

I created a training to show you exactly what's possible - a 45-minute session where I walk you through how practitioners like you are building real income doing this work.

{{CTA_BUTTON}}

This isn't a pitch - it's a vision of what's ahead.

Sarah`,
  },
  // Email 21 - Full branded + CTA button (the ultimate test)
  {
    id: 21,
    name: "TEST: Full Branding + CTA Button",
    day: 5,
    originalSubject: "Testing full branding + button",
    subject: "Re: the training I mentioned",
    useHtmlBranding: true,
    useCtaButton: true,
    content: `{{firstName}},

I remember the exact moment everything clicked.

I was deep in my studies, learning about how the gut connects to the brain, how hormones influence mood, how toxins accumulate in ways that standard blood tests miss...

And suddenly I realized: This is the missing piece.

That's when I knew: I had to share this with others.

I created a training to show you exactly what's possible - a 45-minute session where I walk you through how practitioners like you are building real income doing this work.

{{CTA_BUTTON}}

This isn't a pitch - it's a vision of what's ahead.

Sarah`,
  },
  // Email 22 - Full branded + multiple links
  {
    id: 22,
    name: "TEST: Branding + Multiple Links",
    day: 9,
    originalSubject: "Testing multiple links",
    subject: "Re: your complete roadmap",
    useHtmlBranding: true,
    content: `{{firstName}},

One of the biggest questions I get is: "Sarah, how does this actually work? What's the path?"

So let me show you the complete roadmap:

STEP 1: Mini Diploma (Free - You're here!)
Your first taste of functional medicine.

STEP 2: Certified Practitioner ($997)
Watch the training: https://accredipro.academy/training

STEP 3: Advanced Certification
Learn more: https://accredipro.academy/advanced

STEP 4: Master Practitioner
Details here: https://accredipro.academy/master

Most of our students start with Step 2 - the Certified Practitioner program.

Ready to take the next step? https://accredipro.academy

Sarah`,
  },
  // Email 23 - Without Re: prefix (control test)
  {
    id: 23,
    name: "TEST: NO Re: prefix (control)",
    day: 1,
    originalSubject: "Testing without Re: prefix",
    subject: "my story (thought you'd relate)",
    useHtmlBranding: true,
    content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

That's when I found integrative and functional medicine.

It gave me back my hope.

So tell me, {{firstName}}... what made you curious about functional medicine?

Just hit reply - I'd love to hear your story.

Sarah`,
  },
  // Email 24 - Urgency/scarcity language test
  {
    id: 24,
    name: "TEST: Urgency Language",
    day: 27,
    originalSubject: "Testing urgency words",
    subject: "Re: enrollment closing Friday",
    useHtmlBranding: true,
    content: `{{firstName}},

I have to be honest with you: This week is your last chance to join.

After Friday at midnight, the doors close.

Here's what you get when you enroll by Friday:

- Immediate access to all 21 modules
- Lifetime access (never expires)
- Private community of fellow practitioners
- 30-day money-back guarantee

BONUS (This Week Only):
- Free Client Attraction Masterclass ($297 value)

Don't let this week pass without making a decision.

Sarah`,
  },
  // ============================================
  // EDGE CASE TESTS - Long Form & Sales Heavy
  // ============================================
  // Email 25 - MASTER TESTIMONIAL TEMPLATE - Deep Storytelling for Women 40+ CRO
  {
    id: 25,
    name: "TEST: Master Testimonial (Deep Story)",
    day: 21,
    originalSubject: "Testing deep storytelling",
    subject: "Re: Maria's full story (you need to hear this)",
    useHtmlBranding: true,
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
  // Email 26 - Price-heavy sales email with $997, guarantees, bonuses + BOLD KEYWORDS
  {
    id: 26,
    name: "TEST: Price Heavy + Bold Keywords",
    day: 27,
    originalSubject: "Testing price/sales + bold",
    subject: "Re: everything included (and the guarantee)",
    useHtmlBranding: true,
    useCtaButton: true,
    content: `{{firstName}},

I want to be completely transparent about what you're getting and what it costs.

The Certified Functional Medicine Practitioner Program is <strong>$997</strong>.

Here's exactly what that includes:

<strong>CORE PROGRAM ($1,497 Value):</strong>
- 21 comprehensive training modules
- Biochemistry fundamentals made simple
- Lab interpretation mastery
- Protocol design frameworks
- Client consultation systems
- Case study library (50+ real cases)

<strong>CERTIFICATION ($497 Value):</strong>
- Official certification upon completion
- Digital credential badge
- Verifiable certificate number
- Listing in our graduate directory

<strong>BONUSES (This Week Only - $891 Value):</strong>
- Client Attraction Masterclass ($297 value)
- Done-For-You Protocol Templates ($197 value)
- Private Community Access ($197 value)
- Monthly Q&A Calls ($200 value)

<strong>Total Value: $2,885</strong>
<strong>Your Investment: $997</strong>

That's <strong>$1,888 in savings</strong>.

<strong>BUT HERE'S WHAT MATTERS MORE THAN THE PRICE:</strong>

<strong>The 30-Day Money-Back Guarantee</strong>

If you go through the first 7 modules and feel like this isn't right for you - for ANY reason - email us and we'll <strong>refund every penny</strong>. No hoops. No guilt. No questions asked.

I can offer this because I've seen what happens when people commit. The refund rate is under 3%. Not because we make it hard - we don't. But because <strong>the program actually works</strong>.

<strong>THE REAL MATH:</strong>

$997 seems like a lot until you do the math:

Most graduates charge <strong>$200-$500 per client session</strong>.
At just 2-3 clients per month, your investment is paid back.
<strong>Everything after that is profit.</strong>

Maria hit <strong>$8,000/month</strong> within 6 months.
Diane hit <strong>$8,000/month</strong> within 6 months.
Kelly has a <strong>waiting list</strong> of clients.

$997 turns into <strong>$36,000-$60,000+ per year</strong> in potential income.

That's a <strong>36x-60x return on investment</strong>.

<strong>PAYMENT PLANS AVAILABLE:</strong>

If $997 upfront is too much right now, we have payment plans:
- <strong>3 payments of $349</strong>
- <strong>6 payments of $179</strong>

No credit check. No interest. Just manageable monthly payments.

{{CTA_BUTTON}}

<strong>Enrollment closes Friday at midnight.</strong>

After that, the bonuses disappear and you'll have to wait for the next enrollment period.

I've given you everything I can. The decision is yours.

Sarah

P.S. Remember: <strong>30-day guarantee means zero risk</strong>. Try it. If it's not for you, you get your money back. But I think once you start, you won't look back.`,
  },

  // ============================================
  // SCHOLARSHIP DOWNSELL SEQUENCE (Days 35-37)
  // For non-buyers after main nurture ends
  // $497 special scholarship offer
  // ============================================

  // Email 27 - Day 35: Scholarship Offer Introduction
  {
    id: 27,
    name: "Downsell 1: Scholarship Offer",
    day: 35,
    originalSubject: "I noticed you didn't join",
    subject: "Re: a special opportunity",
    useHtmlBranding: true,
    content: `{{firstName}},

I noticed you didn't join us during the enrollment period.

And I want you to know - <strong>I completely understand.</strong>

Maybe it wasn't the right time. Maybe the investment felt like too much. Maybe life just got in the way.

Whatever the reason, I'm not here to pressure you. I'm here because I genuinely believe you have what it takes to do this work.

<strong>That's why I'm reaching out with something special.</strong>

<strong>The Scholarship Program</strong>

I've reserved a small number of scholarship spots for people who completed the Mini Diploma but couldn't make the full investment work.

Instead of the normal $997, scholarship recipients pay just <strong>$497</strong>.

You get everything:
- All 21 training modules
- Lifetime access
- Full certification upon completion
- Private community access
- 30-day money-back guarantee

<strong>The only difference is the price.</strong>

<strong>Why Am I Doing This?</strong>

Because I know what it's like to want something and have money be the barrier.

When I was sitting on that kitchen floor, crying over bills, I couldn't have afforded $997 either. If someone had offered me a scholarship, it would have changed my life even sooner.

I want to be that person for you.

<strong>Here's the Catch</strong>

These scholarship spots are genuinely limited. I can only offer this to a small number of people because it takes significant resources away from our normal operations.

The scholarship expires in <strong>48 hours</strong>. After that, the price goes back to $997 - and I won't be able to offer this again.

If you've been waiting for a sign, {{firstName}}... this is it.

Hit reply if you have any questions. Or if you're ready, the scholarship link is below.

Sarah

P.S. I'm not doing this to create fake urgency. The 48-hour window is real. After that, I have to offer these spots to the next group waiting. <strong>Don't let this one slip by.</strong>`,
  },

  // Email 28 - Day 36: Why I Created the Scholarship
  {
    id: 28,
    name: "Downsell 2: Why Scholarships Exist",
    day: 36,
    originalSubject: "Why I created the scholarship",
    subject: "Re: why I created scholarships",
    useHtmlBranding: true,
    content: `{{firstName}},

I want to tell you why scholarships exist in our program.

<strong>Her Name Was Teresa</strong>

About two years ago, a woman named Teresa reached out to me. She'd completed the Mini Diploma. She was excited, engaged, asked smart questions.

But when enrollment opened, she didn't join.

I followed up. Her response broke my heart:

<strong>"Sarah, I want this more than anything. But I'm a single mom working two jobs. $997 might as well be $10,000. I just can't make it work right now."</strong>

I stared at that email for an hour.

Here was a woman who had everything it takes - the passion, the intelligence, the drive. The only thing standing between her and a completely different life was $500.

That didn't seem right.

<strong>So I Made a Decision</strong>

I called Teresa. I told her I'd created a scholarship spot for her. Half price. Same program. Same certification.

She cried on the phone.

<strong>Eight months later, she was earning $6,000/month from her home office.</strong> Both those extra jobs? Gone. More time with her kids. A career she actually loved.

All because of a $500 difference.

<strong>Now I do this regularly.</strong>

Not for everyone. But for people who've shown they have what it takes - who completed the Mini Diploma, who engaged with the content, who I can see have the potential.

People like you, {{firstName}}.

<strong>24 Hours Left</strong>

The scholarship I offered you expires tomorrow at midnight.

<strong>$497 instead of $997.</strong>

Same program. Same certification. Same 30-day guarantee.

The only difference is the price - and the deadline.

I can't extend this. I can't offer it again later. When these spots are gone, they're gone.

If you've been on the fence, now's the time to decide.

Reply if you have questions. I'm here.

Sarah

P.S. Teresa now refers me more students than anyone else. She always says the same thing: <strong>"The scholarship changed my life. I want others to have the same chance."</strong> Let me give you that chance too.`,
  },

  // Email 29 - Day 37: Final Scholarship Call
  {
    id: 29,
    name: "Downsell 3: Final Scholarship Call",
    day: 37,
    originalSubject: "Scholarship expires tonight",
    subject: "Re: scholarship expires midnight",
    useHtmlBranding: true,
    useCtaButton: true,
    content: `{{firstName}},

This is my last email about the scholarship.

<strong>Tonight at midnight, it expires.</strong>

$497 becomes $997. The scholarship spot goes to someone else. And I won't be able to offer this to you again.

<strong>I'm Not Going to Re-Sell You</strong>

You know what this program is. You completed the Mini Diploma. You've read all my emails.

Either this is right for you, or it isn't.

What I will say is this:

<strong>Every person who's taken the scholarship and done the work has told me the same thing:</strong>

"I wish I'd done it sooner."
"I can't believe I almost didn't."
"Best decision I ever made."

Not a single regret. Not one.

<strong>The Math One Last Time</strong>

Investment: <strong>$497</strong> (scholarship price)
Normal price: $997
You save: <strong>$500</strong>

What you get:
- All 21 training modules
- Lifetime access
- Full certification
- Private community
- 30-day guarantee

What it leads to:
- $200-$500 per client session
- Your investment back in <strong>2-3 clients</strong>
- $3,000-$12,000/month potential within 6-12 months

<strong>Zero risk. Maximum upside.</strong>

{{CTA_BUTTON}}

<strong>{{firstName}}, Here's What I Know</strong>

You didn't read all these emails by accident. Something in you wants this.

The only question is whether you'll let that part of you win tonight.

Or whether you'll let the doubt and the fear talk you out of it one more time.

I've done everything I can. The rest is up to you.

<strong>Scholarship expires midnight. This is it.</strong>

I hope I see you inside.

Sarah

P.S. If money is genuinely the last barrier, reply to this email. I mean it. Let's figure something out. But do it before midnight - after that, my hands are tied.`,
  },

  // ============================================
  // CHRISTMAS CAMPAIGN (Dec 23-26)
  // $997 Full Certification - "Gift to Yourself" angle
  // ============================================

  // Email 30 - Dec 23: Christmas Offer Launch
  {
    id: 30,
    name: "Christmas 1: A Gift That Changes Everything",
    day: 0,
    originalSubject: "A gift that changes everything",
    subject: "Re: a Christmas gift for yourself",
    useHtmlBranding: true,
    content: `{{firstName}},

This Christmas, I want to talk about a different kind of gift.

Not the kind wrapped in paper. Not the kind that ends up forgotten in a drawer by February.

<strong>The kind that actually changes your life.</strong>

<strong>What If You Gave Yourself Permission?</strong>

Permission to finally pursue that thing you've been thinking about.
Permission to invest in yourself the way you invest in everyone else.
Permission to stop waiting for the "perfect time" that never comes.

That's what I want to give you this Christmas: <strong>permission.</strong>

<strong>The Christmas Gift to Yourself</strong>

You completed the Mini Diploma. You did the work. You proved you have what it takes.

Now it's time to take the next step.

<strong>The Certified Functional Medicine Practitioner program is open for enrollment.</strong>

This is your chance to turn everything you've learned into a real career. A real income. A real transformation - not just for yourself, but for the people you'll help.

<strong>What You Get:</strong>

- All 21 training modules (lifetime access)
- Full certification upon completion
- Private community of practitioners
- Business-building strategies included
- <strong>30-day money-back guarantee</strong>

<strong>Investment: $997</strong>

That's less than what you'll earn from your first 2-3 clients.

<strong>Why Christmas?</strong>

Because it's a time for reflection. For gratitude. For thinking about the year ahead.

And because I remember my first Christmas after I made this change. Sitting by the tree with my daughter, knowing that the coming year would be different. Knowing I had a path. Knowing I wasn't stuck anymore.

I want that for you.

<strong>Holiday Bonus (Dec 23-26 only):</strong>
Enroll during the Christmas window and get priority access to our January live Q&A training sessions - normally reserved for our founding members.

This is my Christmas gift to you - the chance to change your 2025.

Will you accept it?

Sarah

P.S. Don't let another year go by wondering "what if." This Christmas, give yourself something that actually matters.`,
  },

  // Email 31 - Dec 25: Christmas Morning Story
  {
    id: 31,
    name: "Christmas 2: What I Wished For Myself",
    day: 0,
    originalSubject: "What I wished for myself (Christmas morning)",
    subject: "Re: what I wished for (Merry Christmas)",
    useHtmlBranding: true,
    content: `{{firstName}},

Merry Christmas.

I hope this finds you warm, surrounded by people you love (or enjoying some much-needed quiet).

<strong>I want to tell you about a Christmas from a few years ago.</strong>

It was early morning. My daughter was still asleep. I was sitting by the tree in the dark, watching the lights blink, thinking about the year ahead.

I made a wish.

Not the magical, blow-out-the-candles kind. A real one. A quiet promise to myself:

<strong>"This year, I'm going to stop waiting. I'm going to bet on myself."</strong>

I didn't know exactly what that meant yet. But I knew I was tired of wanting something different and doing nothing about it.

That wish led me to functional medicine. To this work. To a life I genuinely love.

<strong>{{firstName}}, What Do You Wish For?</strong>

Not the safe wishes. Not the "I hope things get better" wishes.

The real ones. The ones you're almost afraid to admit, even to yourself.

A career that actually means something?
Financial freedom on your own terms?
The confidence that comes from knowing your work changes lives?

Those aren't fantasies. They're possibilities. Real ones.

<strong>The Certification Is Waiting</strong>

You've already done the hard part - completing the Mini Diploma, showing you have the interest and commitment.

Now the question is: will you follow through?

<strong>$997. Full program. Lifetime access. 30-day guarantee.</strong>

If there's any part of you that's been wanting to make this leap... maybe this is your year to stop waiting.

Not because I'm telling you to. But because <strong>you've been telling yourself to</strong>, and you finally have a reason to listen.

<strong>The holiday enrollment window closes tomorrow.</strong>

Whatever you decide, I'm grateful you're here. I'm grateful you read these emails. I'm grateful for whatever led you to the Mini Diploma in the first place.

Merry Christmas, {{firstName}}. I hope this year brings you everything you've been quietly wishing for.

Sarah

P.S. Tomorrow is the last day for Christmas enrollment with the bonus live Q&A access. If you're ready to make 2025 different, this is your moment.`,
  },

  // Email 32 - Dec 26: Final Christmas Call
  {
    id: 32,
    name: "Christmas 3: Final Hours (Deadline Midnight)",
    day: 0,
    originalSubject: "Christmas enrollment closes tonight",
    subject: "Re: enrollment closes tonight",
    useHtmlBranding: true,
    useCtaButton: true,
    content: `{{firstName}},

The Christmas enrollment window closes tonight at midnight.

<strong>After that, the holiday bonus (live Q&A access) disappears.</strong>

I'm not going to give you a long sales pitch. You know what this is. You know what you get.

What I want to say instead is this:

<strong>The women who take this leap always tell me the same thing.</strong>

Not "I wish I had more information."
Not "I wish I had more time to decide."

They say: <strong>"I wish I had done this sooner."</strong>

Every. Single. One.

Because the cost of waiting isn't just money. It's time. It's another year of wondering "what if." It's watching other people build the life you want while you stay stuck.

<strong>What You're Deciding Tonight</strong>

- Investment: <strong>$997</strong>
- Return: First 2-3 clients pay for entire program
- Includes: Full certification, lifetime access, community
- Guarantee: <strong>30 days, full refund if not right for you</strong>
- Holiday bonus: Priority live Q&A access (tonight only)

Zero risk. Maximum upside.

{{CTA_BUTTON}}

<strong>One Question To Ask Yourself</strong>

What will January 1st feel like if you don't do this?

Will you be excited about the year ahead? Or will you be making the same "next year" promises you made last year?

<strong>You have until midnight to decide.</strong>

I hope you choose yourself.

Sarah

P.S. If you're reading this and you've already decided yes - stop reading. Go enroll. The perfect moment doesn't exist. This moment is good enough.`,
  },

  // ============================================
  // NEW YEAR CAMPAIGN (Dec 30 - Jan 2)
  // $997 Full Certification - "New Year, New Career" angle
  // ============================================

  // Email 33 - Dec 30: New Year Resolution Setup
  {
    id: 33,
    name: "New Year 1: Your 2025 Resolution (With Teeth)",
    day: 0,
    originalSubject: "Your 2025 resolution (with teeth)",
    subject: "Re: your 2025 resolution",
    useHtmlBranding: true,
    content: `{{firstName}},

Let me guess your New Year's resolution:

"Eat healthier."
"Exercise more."
"Reduce stress."
"Be happier."

How'd I do?

<strong>Here's the problem with those resolutions:</strong>

They're vague. They're reactive. And by February, they're forgotten.

I want to propose a different kind of resolution for 2025.

<strong>Not "feel better." But "build something that matters."</strong>

Not "make more money." But <strong>"create a career I actually love."</strong>

Not "help people." But <strong>"become someone who can actually change lives."</strong>

<strong>That's a resolution with teeth.</strong>

<strong>Why 2025 Is Different</strong>

Every year, people make resolutions about being "better." And every year, most of them fail.

You know why?

Because "better" isn't a destination. It's a direction. And directions without maps lead nowhere.

What if instead, you made a resolution with a <strong>clear path</strong>?

- Step 1: Get certified in functional medicine (8-12 weeks)
- Step 2: Help your first client (month 2-3)
- Step 3: Build a real practice (month 3-6)
- Step 4: Replace or exceed your current income (month 6-12)

<strong>That's not a vague hope. That's a plan.</strong>

<strong>The Certified Practitioner Program</strong>

I'm opening enrollment for the new year.

<strong>Investment: $997</strong>

- All 21 training modules (lifetime access)
- Full certification upon completion
- Private community of practitioners
- Business-building strategies included
- <strong>30-day money-back guarantee</strong>

That's less than what you'll earn from your first 2-3 clients.

<strong>New Year Bonus (Dec 30 - Jan 2):</strong>
Enroll during the New Year window and get priority access to our 2025 live Q&A training sessions - exclusive to this enrollment period.

If you've been waiting for the right time to do this... the right time is the start of a new year.

<strong>What do you want 2025 to look like?</strong>

Sarah

P.S. "New Year, new me" is a cliche. But "New Year, new career" is a strategy. Let me show you how.`,
  },

  // Email 34 - Jan 1: Happy New Year + Offer
  {
    id: 34,
    name: "New Year 2: Happy New Year + Special Offer",
    day: 0,
    originalSubject: "Happy New Year + certification",
    subject: "Re: Happy New Year",
    useHtmlBranding: true,
    content: `{{firstName}},

<strong>Happy New Year.</strong>

2025 is here. A blank page. A fresh start. 365 days of possibility.

I'm not going to ask what your resolution is. I'm going to ask something more important:

<strong>What are you going to DO about it?</strong>

Because resolutions without action are just wishes. And wishes don't change lives.

<strong>One Year From Now</strong>

Imagine it's January 1st, 2026.

You're looking back on 2025. What do you see?

<strong>Option A:</strong>
Another year that looked a lot like the last one. Same job. Same frustrations. Same "next year I'll change things."

<strong>Option B:</strong>
A year where you finally took the leap. You got certified. You helped your first clients. You started building something that actually matters. You're ending the year earning money doing work you love.

<strong>Which version do you want to be living?</strong>

<strong>The Certified Practitioner Program</strong>

I'm making it as easy as possible to choose Option B.

<strong>$997. Full program. Lifetime access. 30-day guarantee.</strong>

Here's what you get:
- All 21 training modules
- Lifetime access (no expiration)
- Full certification upon completion
- Private community of practitioners
- Business-building strategies included
- 30-day money-back guarantee

Plus the New Year bonus: priority access to 2025 live Q&A sessions.

<strong>No risk. No excuses. Just a chance to make this year different.</strong>

<strong>A Question</strong>

{{firstName}}, what's really stopping you?

If it's money - $997 pays for itself with your first 2-3 clients.
If it's time - you have 365 days ahead of you.
If it's fear - everyone feels that. It's not a reason to stop.
If it's doubt - that's what the 30-day guarantee is for.

<strong>The only thing that can really stop you is you.</strong>

So what's it going to be?

Sarah

P.S. Tomorrow is the last day for the New Year enrollment bonus. If you're going to do this, do it now. Start 2025 with momentum.`,
  },

  // Email 35 - Jan 2: Final New Year Call
  {
    id: 35,
    name: "New Year 3: Start 2025 Strong (Final Hours)",
    day: 0,
    originalSubject: "Start 2025 strong (final hours)",
    subject: "Re: final hours for enrollment",
    useHtmlBranding: true,
    useCtaButton: true,
    content: `{{firstName}},

This is it. The New Year enrollment window closes tonight.

<strong>After midnight, the bonus (live Q&A access) disappears.</strong>

I've given you all the information. I've shared the stories. I've explained what's possible.

Now it's just you and a decision.

<strong>Here's What I Know About You</strong>

You completed the Mini Diploma. That means you're not a tire-kicker. You're serious.

You've read these emails. All of them. That means something in you resonates with this path.

You're still here, reading this right now. That means you haven't said no.

<strong>So what are you waiting for?</strong>

<strong>What You're Deciding Tonight</strong>

Investment: <strong>$997</strong>
Return: First 2-3 clients pay for entire program
Guarantee: 30 days, no questions asked

What you build:
- A real certification
- A skill that helps people
- A career you control
- Income potential: $3,000-$12,000+/month

New Year bonus: Priority 2025 live Q&A access (tonight only)

<strong>Your investment pays for itself with your first 2-3 clients.</strong>

Everything after that is profit. And freedom. And a life you actually chose.

{{CTA_BUTTON}}

<strong>{{firstName}}, This Is Your Moment</strong>

2025 just started. You have the whole year ahead of you.

The question is: What will you do with it?

Will you let January 2nd pass like any other day?

Or will you make it <strong>the day everything changed?</strong>

The choice is yours. But you have to make it before midnight.

<strong>This is the last email. The last chance. The final call.</strong>

I hope I see you inside.

Sarah

P.S. A year from now, you'll be a year older. The only question is whether you'll be in the same place... or somewhere completely different. <strong>Make the decision. Make it now.</strong>`,
  },

  // ============================================
  // RECOVERY SEQUENCE 1: NEVER LOGGED IN
  // For people who opted in but never logged in
  // Personal, warm, Sarah voice - "Hey I noticed you haven't started"
  // Days 1, 3, 7 after optin with no login
  // ============================================

  // Recovery 1A - Day 1 (No Login): Gentle Check-in
  {
    id: 36,
    name: "Recovery 1A: Never logged in - Day 1",
    day: 1,
    originalSubject: "{{firstName}}, did you get in okay?",
    subject: "Re: checking in",
    useHtmlBranding: false,
    content: `{{firstName}},

Quick check-in from me.

I noticed you signed up for your free Mini Diploma yesterday, but I haven't seen you log in yet.

Is everything okay?

Sometimes the welcome email goes to spam (check your promotions tab if you're on Gmail). Or maybe you just got busy - happens to all of us.

Here's your login link in case you need it:
https://app.accredipro.academy/login

Your email: {{email}}
Your password: Futurecoach2025

The Mini Diploma is sitting there ready for you. First lesson takes about 20 minutes. You could probably do it during lunch or before bed tonight.

No pressure - just wanted to make sure you didn't miss it.

Sarah

P.S. If something went wrong with your account or you need help, just hit reply. I'm here.`,
  },

  // Recovery 1B - Day 3 (No Login): What's Holding You Back
  {
    id: 37,
    name: "Recovery 1B: Never logged in - Day 3",
    day: 3,
    originalSubject: "{{firstName}}, what's holding you back?",
    subject: "Re: haven't forgotten about you",
    useHtmlBranding: false,
    content: `{{firstName}},

Still haven't seen you log in, and honestly - I'm curious why.

No judgment here. I've signed up for things and never started them too. Sometimes life gets in the way. Sometimes we're not sure if it's worth our time.

But here's the thing:

You took the time to sign up. Something about functional medicine interested you enough to do that.

<strong>That curiosity doesn't go away. It just gets buried under everything else.</strong>

So let me ask you directly: What's holding you back?

- Is it time? (The first lesson is 20 minutes. That's it.)
- Is it doubt? (Wondering if it's actually useful?)
- Is it tech issues? (Can't log in? Let me help.)
- Is it something else?

Hit reply and tell me. I read every single email.

Your Mini Diploma isn't going anywhere - but your motivation might. There's no better time than right now.

Sarah

P.S. Login details again:
https://app.accredipro.academy/login
Email: {{email}}
Password: Futurecoach2025`,
  },

  // Recovery 1C - Day 7 (No Login): Last Gentle Nudge
  {
    id: 38,
    name: "Recovery 1C: Never logged in - Day 7",
    day: 7,
    originalSubject: "{{firstName}}, I'm going to stop emailing soon",
    subject: "Re: one last thing",
    useHtmlBranding: false,
    content: `{{firstName}},

This is my last check-in about your Mini Diploma.

I don't want to be one of those annoying people who keeps emailing when you're clearly not interested. If functional medicine isn't right for you, no hard feelings at all.

But I also don't want you to miss something that could genuinely help you - especially when it's completely free.

<strong>Here's what I know about you:</strong>

A week ago, you were curious enough about functional medicine to sign up. Something resonated with you.

That same curiosity is probably still there, buried under work stress and daily obligations and the 47 other tabs open in your brain.

<strong>I'm not asking you to commit to anything big.</strong>

I'm asking you to give it 20 minutes. Watch the first lesson. See if it clicks.

If it doesn't - close the tab and never think about it again. But if it does?

That 20 minutes could be the start of something that changes your whole trajectory.

Your choice.

Login here: https://app.accredipro.academy/login
Email: {{email}}
Password: Futurecoach2025

I'll stop reaching out after this. But your account will stay active whenever you're ready.

Sarah

P.S. Life is short. The things we're "going to get to someday" often never happen. Maybe today is your someday?`,
  },

  // ============================================
  // RECOVERY SEQUENCE 2: NEVER STARTED
  // For people who logged in but never started Mini Diploma
  // They got in but didn't click play on first lesson
  // Days 2, 5, 10 after first login with 0% progress
  // ============================================

  // Recovery 2A - Day 2 (Logged but 0%): You're So Close
  {
    id: 39,
    name: "Recovery 2A: Never started - Day 2",
    day: 2,
    originalSubject: "{{firstName}}, you're SO close",
    subject: "Re: you logged in (almost there!)",
    useHtmlBranding: false,
    content: `{{firstName}},

I saw you logged in! That's awesome.

But I also noticed you haven't started Lesson 1 yet.

I totally get it. Sometimes we log in to "check things out" and then life happens. A notification pings. The kids need something. You tell yourself "I'll do it later."

<strong>Later never comes.</strong>

So here's my challenge for you:

Right now - before you close this email - click over and watch just the first 5 minutes of Lesson 1.

Not the whole thing. Just 5 minutes.

I promise by minute 3, you'll want to keep going. The content is that good.

Start here: https://app.accredipro.academy/my-mini-diploma

You already did the hard part (signing up, logging in). This is the easy part - just press play.

Sarah

P.S. The first lesson explains WHY conventional health advice fails so many people. It's an eye-opener. You'll see health differently after watching it.`,
  },

  // Recovery 2B - Day 5 (Logged but 0%): What Are You Waiting For
  {
    id: 40,
    name: "Recovery 2B: Never started - Day 5",
    day: 5,
    originalSubject: "{{firstName}}, honest question",
    subject: "Re: quick honest question",
    useHtmlBranding: false,
    content: `{{firstName}},

Can I ask you something honestly?

You signed up for the Mini Diploma. You logged in. But you haven't started.

What are you waiting for?

I'm not being sarcastic - I genuinely want to know. Because something is keeping you from pressing play, and I'd love to help you figure out what it is.

Here are some things I hear from people who stall:

<strong>"I don't have 2 hours free"</strong>
You don't need 2 hours. Each lesson is 15-20 minutes. Do one today. Another tomorrow. No rush.

<strong>"What if it's too complicated?"</strong>
It's not. I designed this for beginners. If you can follow a recipe, you can follow this.

<strong>"I'm not sure I can really do this"</strong>
That's fear talking, not logic. You won't know until you try.

<strong>"I'll start Monday / next week / when things calm down"</strong>
Things never calm down. There's always a reason to wait. The only real question is: do you want this or not?

If the answer is no - totally fine. Unsubscribe and I'll never bother you again.

But if the answer is yes, or even "maybe"...

Then stop reading this email and go watch Lesson 1.

https://app.accredipro.academy/my-mini-diploma

I believe in you more than you believe in yourself right now.

Sarah`,
  },

  // Recovery 2C - Day 10 (Logged but 0%): The Uncomfortable Truth
  {
    id: 41,
    name: "Recovery 2C: Never started - Day 10",
    day: 10,
    originalSubject: "{{firstName}}, the uncomfortable truth",
    subject: "Re: something uncomfortable",
    useHtmlBranding: false,
    content: `{{firstName}},

I'm going to say something uncomfortable.

You signed up for a free Mini Diploma in functional medicine. You logged into the platform. And for 10 days, you haven't started.

<strong>This pattern probably isn't new for you.</strong>

I don't say that to be harsh. I say it because I've been there. Signing up for things. Getting excited. Then... nothing.

It's not laziness. It's not stupidity. It's something deeper.

<strong>It's the voice that says you'll fail, so why bother trying.</strong>

That voice has kept a lot of good people stuck in lives that don't fit them anymore.

Here's what I want you to consider:

What if you spent just 20 minutes today doing something your future self would thank you for?

Not because it's easy. Not because you feel ready. But because you deserve more than another year of wondering "what if."

Your Mini Diploma is still there. Lesson 1 is still waiting.

https://app.accredipro.academy/my-mini-diploma

The only thing standing between you and starting is a single click.

<strong>What would it feel like to just... do it?</strong>

I hope you find out.

Sarah

P.S. This is my last email about starting. After this, I'll assume you're not interested. But if you ever change your mind - your account is always there. I'm rooting for you either way.`,
  },

  // ============================================
  // RECOVERY SEQUENCE 3: ABANDONED (INCOMPLETE)
  // For people who started but never finished Mini Diploma
  // They watched some lessons but stopped progressing
  // Days 7, 14, 21 after last activity with <100% progress
  // ============================================

  // Recovery 3A - Day 7 (Abandoned): Where Did You Go?
  {
    id: 42,
    name: "Recovery 3A: Abandoned - Day 7",
    day: 7,
    originalSubject: "{{firstName}}, where did you go?",
    subject: "Re: noticed you disappeared",
    useHtmlBranding: false,
    content: `{{firstName}},

I noticed you were making progress on your Mini Diploma, and then... you disappeared.

You're at {{progress}}% complete. So close!

What happened?

No judgment - I know how life gets. One day you're on a roll, the next day something comes up, and suddenly a week has passed.

But I want you to think about something:

<strong>You've already invested the time to get this far.</strong>

That time doesn't disappear if you don't finish. But it also doesn't become a credential, a new skill, or a foundation for something bigger.

You're literally {{lessonsLeft}} lessons away from completing your Mini Diploma and earning your certificate.

What if you finished one lesson today?

Just one. 15 minutes. You probably waste that much time scrolling social media anyway (no judgment - we all do).

Continue here: https://app.accredipro.academy/my-mini-diploma

The hard part is already behind you. Let's finish what you started.

Sarah

P.S. When you complete the Mini Diploma, something cool unlocks. I'll tell you more once you get there.`,
  },

  // Recovery 3B - Day 14 (Abandoned): The Unfinished Feeling
  {
    id: 43,
    name: "Recovery 3B: Abandoned - Day 14",
    day: 14,
    originalSubject: "{{firstName}}, about unfinished things",
    subject: "Re: something on my mind",
    useHtmlBranding: false,
    content: `{{firstName}},

Do you know what's funny about unfinished things?

They take up mental space even when you're not thinking about them.

That half-read book on your nightstand. The project you started and never completed. The course sitting at {{progress}}% in your account.

<strong>Part of your brain knows it's there. And it nags at you.</strong>

Not loudly. Just a quiet whisper: "You should finish that."

Here's the thing: finishing takes less energy than carrying the weight of "unfinished."

Your Mini Diploma is {{lessonsLeft}} lessons from complete. That's probably 2-3 hours total. Less time than a Netflix movie.

And when it's done, that quiet nagging goes away. In its place: a certificate, new knowledge, and the satisfaction of following through.

<strong>Which sounds better to you?</strong>

Continue here: https://app.accredipro.academy/my-mini-diploma

You've already done the hard work. Let's close this loop.

Sarah

P.S. Every person who's ever built something meaningful has felt the urge to quit halfway through. The ones who succeed aren't different - they just keep going anyway.`,
  },

  // Recovery 3C - Day 21 (Abandoned): Your Last Chance
  {
    id: 44,
    name: "Recovery 3C: Abandoned - Day 21",
    day: 21,
    originalSubject: "{{firstName}}, your last chance to finish",
    subject: "Re: before I let this go",
    useHtmlBranding: false,
    content: `{{firstName}},

This is my last email about your Mini Diploma.

Three weeks ago, you were making progress. Now your account is sitting at {{progress}}% complete, and I have no idea if you're ever coming back.

<strong>I don't want to be annoying. So I'll make this simple:</strong>

If you want to finish - and I think part of you does, or you would've unsubscribed by now - then go finish.

https://app.accredipro.academy/my-mini-diploma

{{lessonsLeft}} lessons. A few hours. That's it.

On the other side is:
- Your Mini Diploma certificate
- The foundation for understanding root-cause health
- Access to the next step (something graduates rave about)
- The simple satisfaction of completing what you started

If you don't want to finish - that's okay too. I'll stop emailing. No hard feelings.

But {{firstName}}, can I be honest?

<strong>I don't think you're the kind of person who quits things.</strong>

I think you're the kind of person who gets busy, gets distracted, and sometimes needs a gentle kick to get back on track.

Consider this your gentle kick.

Finish what you started. Your future self will thank you.

Sarah

P.S. A lot of people who complete the Mini Diploma tell me it was a turning point for them. Not the content alone - but the act of finishing. Of proving to themselves they could follow through. That shift in self-trust is worth more than any certificate.`,
  },
];

// GET - Return all variants info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      variants: EMAIL_VARIANTS.map(v => ({
        id: v.id,
        name: v.name,
        day: v.day,
        originalSubject: v.originalSubject,
        subject: v.subject,
        contentPreview: v.content.substring(0, 150) + "...",
      })),
    });
  } catch (error) {
    console.error("Error getting variants:", error);
    return NextResponse.json({ error: "Failed to get variants" }, { status: 500 });
  }
}

// POST - Send a specific variant to test email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { variantId, testEmail } = body;

    if (!testEmail) {
      return NextResponse.json({ error: "Test email is required" }, { status: 400 });
    }

    const maxVariantId = Math.max(...EMAIL_VARIANTS.map(v => v.id));
    if (!variantId || variantId < 1 || variantId > maxVariantId) {
      return NextResponse.json({ error: `Invalid variant ID (1-${maxVariantId})` }, { status: 400 });
    }

    const variant = EMAIL_VARIANTS.find(v => v.id === variantId);
    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    console.log(`📧 INBOX TEST - Sending Email ${variantId} (Day ${variant.day}): "${variant.subject}" to ${testEmail}`);

    // Replace {{firstName}} with "Test"
    let personalizedContent = variant.content.replace(/\{\{firstName\}\}/g, "Test");

    // Replace CTA button placeholder if present
    if ((variant as any).useCtaButton) {
      personalizedContent = personalizedContent.replace(
        '{{CTA_BUTTON}}',
        '<a href="https://accredipro.academy" style="display:inline-block;background:#722F37;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Watch the Free Training</a>'
      );
    }

    let htmlContent: string;

    // Check if this variant uses HTML branding (logo, colors, etc.)
    if ((variant as any).useHtmlBranding) {
      // Full branded HTML template - matching AccrediPro email style
      const formattedContent = personalizedContent
        .split('\n\n')
        .map(p => `<p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
        .join('');

      htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if mso]>
    <style type="text/css">
      body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="display:none;font-size:1px;color:#f5f5f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">My journey from burned-out single mom to thriving practitioner...</div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          ${formattedContent}
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
          <p style="margin: 0; color: #999; font-size: 11px;">(At Rockefeller Center)</p>
          <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182</p>
          <p style="margin: 0; color: #999; font-size: 11px;">New York, NY 10020</p>
          <p style="margin: 0 0 15px 0; color: #999; font-size: 11px;">United States</p>
          <p style="margin: 0; color: #bbb; font-size: 10px; font-style: italic;">Veritas Et Excellentia - Truth and Excellence in Education</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #bbb; font-size: 10px;">
              This email is from AccrediPro Academy.<br/>
              You're receiving this because of your account activity.
            </p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://app.accredipro.academy/unsubscribe" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  </body>
</html>`;
    } else {
      // Minimal HTML wrapper (default - for inbox delivery)
      htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#222;">
${personalizedContent.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}
</body>
</html>`;
    }

    // Plain text version
    const textContent = personalizedContent.replace(/{{CTA_BUTTON}}/g, 'Watch the free training: https://accredipro.academy');

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Sarah <info@accredipro-certificate.com>",
      to: testEmail,
      subject: variant.subject,
      html: htmlContent,
      text: textContent,
      replyTo: "info@accredipro-certificate.com",
    });

    if (error) {
      console.error(`❌ Email ${variantId} failed:`, error);
      return NextResponse.json({
        success: false,
        error: error.message,
        variant: variant.name,
      }, { status: 500 });
    }

    console.log(`✅ Email ${variantId} sent successfully to ${testEmail}`);

    return NextResponse.json({
      success: true,
      variantId,
      variantName: variant.name,
      day: variant.day,
      subject: variant.subject,
      sentTo: testEmail,
      resendId: data?.id,
    });

  } catch (error) {
    console.error("Error sending test variant:", error);
    return NextResponse.json({ error: "Failed to send test" }, { status: 500 });
  }
}
