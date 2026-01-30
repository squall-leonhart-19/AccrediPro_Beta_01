import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import { WH_NURTURE_60_DAY_V3 } from "@/lib/wh-nurture-60-day-v3";
import { FM_COMPLETION_SEQUENCE } from "@/lib/fm-completion-sequence";
import { FM_NURTURE_SEQUENCE_V4 } from "@/lib/fm-nurture-sequence-v4";

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

  // Email 2 - Day 1: Sarah's Story (Deep Emotional Version for 35-40+ Women)
  {
    id: 2,
    name: "Email 2: Sarah's Story",
    day: 1,
    originalSubject: "Re: Can I share something personal?",
    subject: "Re: my story (thought you'd relate)",
    content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

<strong>Inside, I felt like a fraud.</strong>

I loved helping people, but when clients came to me with real struggles - chronic fatigue, brain fog, autoimmune symptoms - I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom.

I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: <strong>"There has to be more than this. There has to be a better way."</strong>

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

<strong>But more than that - it gave me back my hope.</strong>

Hope that I could truly help my clients. Hope that I could build a career I loved. Hope that I could create a future for my family that didn't depend on burning out or "faking it."

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do.

That's why I'm so passionate about this path - because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}} - what made you curious about functional medicine? What's your story?

Hit reply. I want to hear it.

With love,

Sarah

P.S. This path changed everything for me. I can't wait to see what it does for you.`,
  },

  // Email 3 - Day 3: The "Aha" Moment (Why Generic Advice Fails)
  {
    id: 3,
    name: "Email 3: Why generic advice fails",
    day: 3,
    originalSubject: "{{firstName}}, this is why generic advice fails",
    subject: "Re: why the usual advice doesn't work",
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
    content: `{{firstName}},

Quick check-in from me.

I noticed you signed up for your free Mini Diploma yesterday, but I haven't seen you log in yet.

Is everything okay?

Sometimes the welcome email goes to spam (check your promotions tab if you're on Gmail). Or maybe you just got busy - happens to all of us.

Here's your login link in case you need it:
https://learn.accredipro.academy/login

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
https://learn.accredipro.academy/login
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

Login here: https://learn.accredipro.academy/login
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
    content: `{{firstName}},

I saw you logged in! That's awesome.

But I also noticed you haven't started Lesson 1 yet.

I totally get it. Sometimes we log in to "check things out" and then life happens. A notification pings. The kids need something. You tell yourself "I'll do it later."

<strong>Later never comes.</strong>

So here's my challenge for you:

Right now - before you close this email - click over and watch just the first 5 minutes of Lesson 1.

Not the whole thing. Just 5 minutes.

I promise by minute 3, you'll want to keep going. The content is that good.

Start here: https://learn.accredipro.academy/my-mini-diploma

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

https://learn.accredipro.academy/my-mini-diploma

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

https://learn.accredipro.academy/my-mini-diploma

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

Continue here: https://learn.accredipro.academy/my-mini-diploma

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

Continue here: https://learn.accredipro.academy/my-mini-diploma

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
    content: `{{firstName}},

This is my last email about your Mini Diploma.

Three weeks ago, you were making progress. Now your account is sitting at {{progress}}% complete, and I have no idea if you're ever coming back.

<strong>I don't want to be annoying. So I'll make this simple:</strong>

If you want to finish - and I think part of you does, or you would've unsubscribed by now - then go finish.

https://learn.accredipro.academy/my-mini-diploma

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

  // ============================================
  // MILESTONE COMPLETION EMAILS - Progress Nudges
  // Triggered when user completes Day 1, 2, 3 of Mini Diploma
  // ============================================

  // Milestone 1 - Day 1 Complete
  {
    id: 45,
    name: "Milestone: Day 1 Complete",
    day: 1,
    originalSubject: "Great job on Day 1!",
    subject: "Re: just wanted to say...",
    content: `{{firstName}},

Just noticed you finished Day 1 - wanted to say nice work!

You now know more about root-cause health than most people learn in their entire lives. Seriously.

<strong>Day 2 is where it gets really interesting:</strong>

You'll learn the 7 Body Systems framework - the same approach that helps practitioners earn $5-10k/month helping people truly heal.

It only takes about 30 minutes. Perfect for lunch break or after dinner.

Your progress: <strong>1/3 days complete</strong>

Keep going: https://learn.accredipro.academy/my-mini-diploma

You're doing great,
Sarah

P.S. Most people who finish Day 1 go on to complete the whole thing. You're already ahead of the curve.`,
  },

  // Milestone 2 - Day 2 Complete
  {
    id: 46,
    name: "Milestone: Day 2 Complete",
    day: 2,
    originalSubject: "Almost there!",
    subject: "Re: Day 2 done!",
    content: `{{firstName}}!

You did it - Day 2 complete!

You now understand the 7 Body Systems framework. That's not nothing - it's actually a pretty big deal.

<strong>One more day to go.</strong>

Day 3 covers:
- How to create real protocols that work
- The business side (yes, you can earn real money doing this)
- Your path to certification

Then a quick final exam, and you'll officially be a <strong>Mini Diploma Graduate</strong>.

Your certificate is waiting - just one more push!

https://learn.accredipro.academy/my-mini-diploma

Almost there,
Sarah

P.S. I'm genuinely excited for you. The final exam is easier than you think, and graduates consistently tell me Day 3 is their favorite.`,
  },

  // Milestone 3 - Day 3 Complete (Take Exam!)
  {
    id: 47,
    name: "Milestone: Day 3 Complete (Take Exam)",
    day: 3,
    originalSubject: "Time for your final exam!",
    subject: "Re: you did it!",
    content: `{{firstName}},

ALL THREE DAYS COMPLETE!

You've learned more about functional medicine in 3 days than most people do in months of reading random articles online.

<strong>One thing left: Your Final Exam</strong>

Don't stress - it's designed to help you succeed:
- Just 10 questions
- Based on what you learned
- You can retake if needed

Pass it, and you'll get:
- Your official <strong>Mini Diploma Certificate</strong>
- A credential you can proudly share
- Access to what comes next (hint: it's exciting)

Go take your exam now: https://learn.accredipro.academy/my-mini-diploma

I'll be sending your certificate the moment you pass.

So proud of you,
Sarah

P.S. 96% of people who reach this point pass on their first try. You've got this.`,
  },

  // ============================================
  // CHAT-TO-CONVERSION SEQUENCE
  // For people who engaged in live chat but haven't purchased
  // Branded HTML with Re: subject strategy
  // 5 emails (immediate, day 1, day 2, day 3, final) x 3 versions each
  // ============================================

  // ===== CHAT CONVERSION EMAIL 1: IMMEDIATE FOLLOW-UP (Same Day) =====

  // Version A - Warm & Personal
  {
    id: 48,
    name: "Chat Conversion 1A: Same Day - Warm Personal",
    day: 0,
    originalSubject: "following up on our chat...",
    subject: "Re: following up on our conversation",
    content: `{{firstName}},

It was great chatting with you earlier today.

I could tell from our conversation that you're serious about making a change - not just "thinking about it" like most people, but actually ready to do something about it.

<strong>That's rare. And it matters.</strong>

If there's anything I didn't answer clearly, or if you've thought of more questions since we talked, just reply to this email. I'm here.

I also want you to know: there's no pressure from me. This path isn't for everyone. But for the right person - someone like you, who's tired of the conventional approach and ready for something different - it can be genuinely transformational.

Whatever you decide, I'm glad we connected.

Sarah

P.S. If you're ready to take the next step, here's the link: https://sarah.accredipro.academy/checkout-fm-certification`,
  },

  // Version B - Curiosity-Driven
  {
    id: 49,
    name: "Chat Conversion 1B: Same Day - Curiosity",
    day: 0,
    originalSubject: "one thing I forgot to mention...",
    subject: "Re: one thing I forgot to mention",
    content: `{{firstName}},

After we chatted, I realized there's something I forgot to tell you.

<strong>Most people who are where you are right now have the same worry:</strong>

"Can I actually do this? Is this really going to work for ME?"

I had that same fear when I started. Every single one of our successful graduates had it too.

Here's what I've learned: The fear doesn't go away until you start. Then it turns into something else - confidence.

Maria was terrified when she enrolled. Now she earns $12,000/month.
Diane thought she was "too old" at 62. Now she has her own practice.
Kelly had zero business experience. Now she has a waitlist.

<strong>Fear is normal. It's not a reason to stop - it's a sign you're at the edge of something big.</strong>

If you want to talk more about this, just reply. I'm here.

Sarah`,
  },

  // Version C - Direct & Value-Focused
  {
    id: 50,
    name: "Chat Conversion 1C: Same Day - Direct Value",
    day: 0,
    originalSubject: "quick summary from our chat",
    subject: "Re: quick summary",
    content: `{{firstName}},

Thanks for taking the time to chat with me today.

<strong>Here's what I heard from you:</strong>

You're tired of the conventional approach. You know there's something more. And you're ready to do the work - you just want to make sure this is the right path.

<strong>Here's what I want you to know:</strong>

The certification isn't magic. It's work. Real training that takes 8-12 weeks to complete properly.

But it works. Our graduates consistently earn $3,000-$12,000/month helping people who've been failed by the conventional system.

The question isn't whether it works. The question is whether you're ready to do the work.

Based on our chat - I think you are.

If you have more questions, hit reply. Otherwise, here's where to start:

https://sarah.accredipro.academy/checkout-fm-certification

Sarah`,
  },

  // ===== CHAT CONVERSION EMAIL 2: DAY 1 FOLLOW-UP =====

  // Version A - Story-Based
  {
    id: 51,
    name: "Chat Conversion 2A: Day 1 - Story",
    day: 1,
    originalSubject: "thinking about you...",
    subject: "Re: been thinking about our conversation",
    content: `{{firstName}},

I woke up this morning thinking about our chat yesterday.

Not because I'm trying to sell you something. But because something you said stuck with me.

<strong>You reminded me of myself, three years ago.</strong>

I was in the same place - curious about functional medicine, unsure if it was right for me, wondering if I could actually make it work.

What I didn't know then, that I know now:

The hesitation I felt wasn't wisdom. It was fear dressed up as caution.

The "right time" I was waiting for? It never came. I just eventually decided to stop waiting.

<strong>{{firstName}}, I'm not going to tell you what to do.</strong> But I will say this: the women who succeed in this work aren't special. They're just the ones who decided to try.

If you want to talk more, I'm here.

Sarah`,
  },

  // Version B - Social Proof
  {
    id: 52,
    name: "Chat Conversion 2B: Day 1 - Social Proof",
    day: 1,
    originalSubject: "what other students say...",
    subject: "Re: thought you'd want to see this",
    content: `{{firstName}},

I wanted to share something with you.

After our chat yesterday, I thought about what might help you decide. So I went back through recent student messages.

<strong>Here's what Jennifer from Ohio wrote last week:</strong>

"I was SO skeptical. I'd tried other programs before. But this was different - real clinical training, not just fluffy wellness content. I got my first paying client in month 2. Now I earn more from my practice than my corporate job paid. I wish I'd started sooner."

<strong>And this from Rosa in Texas:</strong>

"I was scared I was too old to learn something new. I'm 58. Turns out, my life experience was an advantage. Clients trust me BECAUSE of my age. I'm fully booked."

{{firstName}}, I'm sharing these because I want you to see yourself in them.

These aren't unicorns. They're regular women who decided to try.

Your choice, always.

Sarah`,
  },

  // Version C - Objection Crusher
  {
    id: 53,
    name: "Chat Conversion 2C: Day 1 - Objection Crusher",
    day: 1,
    originalSubject: "the fear you didn't mention...",
    subject: "Re: the thing you didn't say",
    content: `{{firstName}},

Can I be honest with you about something?

When we chatted yesterday, I sensed there was something you weren't quite saying.

I could be wrong. But usually when someone is clearly interested but hasn't enrolled, there's a fear underneath.

<strong>Let me take a guess at what it might be:</strong>

- "What if I invest time and money and it doesn't work?"
- "What if I can't actually get clients?"
- "What if I'm not smart enough to learn this?"
- "What if my family thinks I'm crazy?"

{{firstName}}, every single one of our successful graduates had at least one of those fears.

<strong>Here's what I know:</strong>

The fear is real. But it's not predictive. The women who succeed aren't fearless - they're the ones who feel the fear and do it anyway.

If any of this resonates, just reply and tell me what's holding you back. I might be able to help.

Sarah`,
  },

  // ===== CHAT CONVERSION EMAIL 3: DAY 2 FOLLOW-UP =====

  // Version A - FAQ-Based
  {
    id: 54,
    name: "Chat Conversion 3A: Day 2 - FAQ",
    day: 2,
    originalSubject: "questions I usually get...",
    subject: "Re: questions you might have",
    content: `{{firstName}},

I wanted to answer some questions you might be thinking about (even if you haven't asked them yet).

<strong>"How long does it take?"</strong>
8-12 weeks if you study 5-7 hours/week. It's self-paced, so you can go faster or slower.

<strong>"What if I'm not from a medical background?"</strong>
About 60% of our students aren't. We teach everything from the ground up.

<strong>"Can I really get clients?"</strong>
Yes. We include client acquisition training. Most students get their first paying client within 90 days of finishing.

<strong>"Is $997 a lot?"</strong>
For a certification that pays for itself with your first 2-3 clients? No. For something that changes your career trajectory? It's actually quite reasonable.

<strong>"What if it's not for me?"</strong>
30-day money-back guarantee. No risk.

Any other questions? Just hit reply.

Sarah

P.S. Enrollment link when you're ready: https://sarah.accredipro.academy/checkout-fm-certification`,
  },

  // Version B - Challenge-Based
  {
    id: 55,
    name: "Chat Conversion 3B: Day 2 - Challenge",
    day: 2,
    originalSubject: "can I ask you something real?",
    subject: "Re: honest question for you",
    content: `{{firstName}},

I have a real question for you. Not a sales question - a life question.

<strong>A year from now, where do you want to be?</strong>

Be honest with yourself.

Same job? Same routine? Same frustrations about wanting more but not knowing how to get there?

Or somewhere different?

I ask because I see this all the time: people who are curious, interested, even excited - but they never pull the trigger. A year passes. Nothing changes. They're still "thinking about it."

<strong>{{firstName}}, thinking doesn't change anything. Doing does.</strong>

I'm not saying the certification is definitely right for you. Maybe it's not.

But if some part of you knows you need a change - and you felt something click during our chat - then maybe the "thinking" phase is over.

Maybe it's time to decide.

Just my two cents. No pressure either way.

Sarah`,
  },

  // Version C - Future Vision
  {
    id: 56,
    name: "Chat Conversion 3C: Day 2 - Future Vision",
    day: 2,
    originalSubject: "imagining your future...",
    subject: "Re: picture this",
    content: `{{firstName}},

Close your eyes for a second. (Well, after you read this.)

<strong>Picture yourself one year from now:</strong>

You wake up without an alarm. No commute. You check your schedule - three client calls today, each paying $200-$400.

You're helping people who've been dismissed by every doctor they've seen. You're the one who finally listened. Who actually helped.

Your bank account looks different. So does your stress level. So does the way your family talks about "Mom's work."

<strong>This isn't fantasy. This is what our graduates actually describe.</strong>

The path from where you are now to that picture? It starts with a decision.

The certification takes 8-12 weeks. First clients usually come within 90 days of finishing. Full practice? 6-12 months.

One year. That's all it takes to be living a completely different life.

The question is: will you start?

Sarah`,
  },

  // ===== CHAT CONVERSION EMAIL 4: DAY 3 FOLLOW-UP =====

  // Version A - Urgency + Scarcity
  {
    id: 57,
    name: "Chat Conversion 4A: Day 3 - Urgency",
    day: 3,
    originalSubject: "the sale ends soon...",
    subject: "Re: wanted to let you know",
    content: `{{firstName}},

Quick heads up.

The New Year Sale (80% OFF the certification) ends in 48 hours.

After that, the price goes back to $497.

I'm not big on pressure tactics. If you're not ready, you're not ready. But if you ARE ready, and you're just procrastinating...

<strong>This is your sign to stop.</strong>

$97 vs $497 is a significant difference. That's the cost of a nice dinner vs. the cost of a plane ticket.

The training is the same either way. The only difference is when you decide.

https://sarah.accredipro.academy/checkout-fm-certification

If you have questions before deciding, hit reply. I'll answer today.

Sarah`,
  },

  // Version B - Risk Reversal
  {
    id: 58,
    name: "Chat Conversion 4B: Day 3 - Risk Reversal",
    day: 3,
    originalSubject: "about your risk...",
    subject: "Re: about the risk",
    content: `{{firstName}},

Let me remove the risk for you.

<strong>Here's our guarantee:</strong>

Start the certification. If within 30 days you decide it's not for you - for any reason - email us and get a full refund. No questions. No hassle. No guilt trip.

<strong>So what's the actual risk?</strong>

If it works: New career. New income. New life trajectory.
If it doesn't: You get your money back. No harm done.

The only real risk is NOT trying - and spending another year wondering "what if."

{{firstName}}, I've been where you are. Scared to invest. Scared to fail. Scared to try.

The fear doesn't go away. You just learn that it's not a reason to stop.

https://sarah.accredipro.academy/checkout-fm-certification

Here when you're ready.

Sarah`,
  },

  // Version C - Last Chance Personal
  {
    id: 59,
    name: "Chat Conversion 4C: Day 3 - Last Chance",
    day: 3,
    originalSubject: "my final thoughts...",
    subject: "Re: final thoughts from me",
    content: `{{firstName}},

This will probably be my last email about this.

I don't like being pushy, and you've heard what I have to say.

<strong>But before I go quiet, I want you to know something:</strong>

I believe in you.

Not in a cheesy motivational-poster way. But in a "I've talked to hundreds of women like you and I know what you're capable of" way.

The women who succeed in this work aren't more talented than you. They're not smarter. They just decided to try.

<strong>{{firstName}}, you could be one of them.</strong>

Or you could close this email, go back to your day, and keep wondering.

Both are valid choices. But only one of them leads somewhere new.

If you want in: https://sarah.accredipro.academy/checkout-fm-certification

If not, I understand. And I hope our paths cross again.

With genuine respect,
Sarah`,
  },

  // ===== CHAT CONVERSION EMAIL 5: FINAL (Day 5) =====

  // Version A - Last Call Urgent
  {
    id: 60,
    name: "Chat Conversion 5A: Final - Last Call",
    day: 5,
    originalSubject: "last call...",
    subject: "Re: final notice",
    content: `{{firstName}},

The New Year Sale ends tonight at midnight.

After that, the price goes from $97 to $497.

<strong>I'm not going to recap everything. You know what this is. You know what it offers.</strong>

The only question is: are you going to do something about it, or are you going to let another opportunity pass?

No judgment either way. Only you know what's right for you.

If you're in: https://sarah.accredipro.academy/checkout-fm-certification

If not: I'll stop emailing. No hard feelings.

Whatever you decide, I hope 2025 is your year.

Sarah`,
  },

  // Version B - Supportive Close
  {
    id: 61,
    name: "Chat Conversion 5B: Final - Supportive Close",
    day: 5,
    originalSubject: "one last thing...",
    subject: "Re: before I go",
    content: `{{firstName}},

This is my last email about the certification. I promise.

<strong>I wanted to leave you with this:</strong>

Whatever you decide - enroll, don't enroll, do something else entirely - you have my respect.

Making changes is hard. Considering changes is hard. Even reading these emails takes time and energy you could spend elsewhere.

The fact that you're still here, still reading, still thinking about it... that says something good about you.

<strong>If you're ready to start:</strong> https://sarah.accredipro.academy/checkout-fm-certification

<strong>If you're not ready yet:</strong> Your curiosity won't disappear. When the time is right, you'll know.

Either way, I'm rooting for you.

Sarah

P.S. The sale ends tonight. Just so you know.`,
  },

  // Version C - Clean Goodbye
  {
    id: 62,
    name: "Chat Conversion 5C: Final - Clean Goodbye",
    day: 5,
    originalSubject: "goodbye (for now)",
    subject: "Re: goodbye for now",
    content: `{{firstName}},

Sale ends tonight. This is my last email.

<strong>Quick summary of what's on the table:</strong>

- Certified Functional Medicine Practitioner training
- 21 comprehensive modules
- Client acquisition system included
- $97 today, $497 after midnight
- 30-day money-back guarantee

<strong>What students typically achieve:</strong>

- First paying clients within 90 days
- $3,000-$12,000/month income potential
- Career you actually control

The decision is yours.

If it's a yes: https://sarah.accredipro.academy/checkout-fm-certification

If it's a no: Thank you for your time. I mean that sincerely.

All the best,
Sarah`,
  },

  // ============================================
  // MINI DIPLOMA LEAD SEQUENCE - 9 Emails
  // Women's Health lead nurture flow
  // IDs: 100-108
  // ============================================

  // Mini Diploma 1: Welcome
  {
    id: 100,
    name: "Mini Diploma 1: Welcome",
    day: 0,
    section: "mini_diploma",
    originalSubject: "Welcome to your Mini Diploma",
    subject: "Re: your Women's Health access",
    content: `{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

Your FREE Women's Health Mini Diploma is ready - you can start right now.

Here's what you're getting:
- 9 quick lessons (about 6 minutes each)
- Real knowledge about hormones, cycles, and women's health
- Your own certificate when you finish
- 7 days of access

This isn't like other freebies that sit in your downloads folder. This is real training.

Start Lesson 1 now: https://learn.accredipro.academy/womens-health-diploma

I also left you a personal voice message inside. Check your Messages when you log in.

Got questions? Just reply to this email.

Sarah`,
  },

  // Welcome V02
  {
    id: 100.2,
    name: "Welcome V02",
    day: 0,
    section: "mini_diploma",
    originalSubject: "Welcome to your Mini Diploma",
    subject: "Your login details to AccrediPro Academy",
    useHtmlBranding: true,
    content: `Hey {{firstName}}!

I'm SO excited you're here! Your Women's Health & Hormones Mini Diploma is ready.

Here's how to access your lessons:

YOUR LOGIN DETAILS:
Email: {{email}}
Password: coach2026

Save these! You can change your password anytime.

What you'll learn with me:
- The 5 key female hormones
- The 4 phases of your cycle
- Signs of hormonal imbalance
- The gut-hormone connection
- Nutrition for balance

Start Your First Lesson: https://learn.accredipro.academy/womens-health-diploma

Important: You have 7 days to complete your mini diploma. Complete all 9 lessons to earn your certificate!

I'll be chatting with you inside the lessons!

Sarah`,
  },

  // Welcome V03
  {
    id: 100.3,
    name: "Welcome V03 (Re:)",
    day: 0,
    section: "mini_diploma",
    originalSubject: "Re: Welcome",
    subject: "Re: Your login details to AccrediPro Academy",
    useHtmlBranding: true,
    content: `Hey {{firstName}}!

I'm SO excited you're here! Your Women's Health & Hormones Mini Diploma is ready.

Here's how to access your lessons:

YOUR LOGIN DETAILS:
Email: {{email}}
Password: coach2026

Save these! You can change your password anytime.

What you'll learn with me:
- The 5 key female hormones
- The 4 phases of your cycle
- Signs of hormonal imbalance
- The gut-hormone connection
- Nutrition for balance

Start Your First Lesson: https://learn.accredipro.academy/womens-health-diploma

Important: You have 7 days to complete your mini diploma. Complete all 9 lessons to earn your certificate!

I'll be chatting with you inside the lessons!

Sarah`,
  },

  // Welcome V04
  {
    id: 100.4,
    name: "Welcome V04 (Login Details)",
    day: 0,
    section: "mini_diploma",
    originalSubject: "Your login details",
    subject: "Your login details to AccrediPro Academy",
    useHtmlBranding: true,
    content: `Hey {{firstName}}!

I'm SO excited you're here! Your Women's Health & Hormones Mini Diploma is ready.

Here's how to access your lessons:

YOUR LOGIN DETAILS:
Email: {{email}}
Password: coach2026

Save these! You can change your password anytime.

What you'll learn with me:
- The 5 key female hormones
- The 4 phases of your cycle
- Signs of hormonal imbalance
- The gut-hormone connection
- Nutrition for balance

Start Your First Lesson: https://learn.accredipro.academy/womens-health-diploma

Important: You have 7 days to complete your mini diploma. Complete all 9 lessons to earn your certificate!

I'll be chatting with you inside the lessons!

Sarah`,
  },

  // Welcome V05
  {
    id: 100.5,
    name: "Welcome V05 (Simple)",
    day: 0,
    section: "mini_diploma",
    originalSubject: "Your access",
    subject: "Your login details to AccrediPro Academy",
    useHtmlBranding: true,
    content: `Hey {{firstName}}!

I'm SO excited you're here! Your Women's Health & Hormones Mini Diploma is ready.

Here's how to access your lessons:

YOUR LOGIN DETAILS:
Email: {{email}}
Password: coach2026

Save these! You can change your password anytime.

What you'll learn with me:
- The 5 key female hormones
- The 4 phases of your cycle
- Signs of hormonal imbalance
- The gut-hormone connection
- Nutrition for balance

Start Your First Lesson: https://learn.accredipro.academy/womens-health-diploma

Important: You have 7 days to complete your mini diploma. Complete all 9 lessons to earn your certificate!

I'll be chatting with you inside the lessons!

Sarah`,
  },

  // Mini Diploma 2: Day 1 Start Nudge
  {
    id: 101,
    name: "Mini Diploma 2: Day 1 Start",
    day: 1,
    section: "mini_diploma",
    originalSubject: "Have you started yet?",
    subject: "Re: quick question",
    content: `{{firstName}},

Just checking in - have you had a chance to start your Mini Diploma yet?

I know life gets busy. But here's the thing: Lesson 1 takes just 6 minutes. That's shorter than your morning coffee break.

Once you start, you'll understand why hormones affect EVERYTHING - your energy, mood, weight, sleep, even your skin.

Your access is active for 7 days. Let's not waste it.

Start now: https://learn.accredipro.academy/womens-health-diploma

I left you a voice message inside too - give it a listen.

Sarah`,
  },

  // Mini Diploma 3: Day 2 Momentum
  {
    id: 102,
    name: "Mini Diploma 3: Day 2 Momentum",
    day: 2,
    section: "mini_diploma",
    originalSubject: "12 minutes = 2 lessons",
    subject: "Re: following up",
    content: `{{firstName}},

I noticed you haven't started your lessons yet - is everything okay?

I get it. Starting something new can feel overwhelming. But I want you to know:

2 lessons = just 12 minutes total.

That's it. In 12 minutes, you'll already be ahead of 90% of people who sign up for free courses and never even open them.

You signed up for a reason. That curiosity matters. Don't let it fade.

Start Lesson 1 now: https://learn.accredipro.academy/womens-health-diploma

If something's blocking you, just reply and tell me. I'm here to help.

Sarah`,
  },

  // Mini Diploma 4: Lesson 3 Halfway
  {
    id: 103,
    name: "Mini Diploma 4: Lesson 3 Halfway",
    day: 3,
    section: "mini_diploma",
    originalSubject: "You're halfway there!",
    subject: "Re: you're halfway there",
    content: `{{firstName}},

You just completed Lesson 3 - you're officially HALFWAY through your Mini Diploma.

I'm so proud of you right now.

Most people who download free courses never even start. But you? You're DOING the work. That tells me something about you.

What you've learned so far:
- The 5 key female hormones
- The 4 menstrual cycle phases
- Signs of hormonal imbalances

And the best stuff is coming up in Lessons 4-6.

Keep going: https://learn.accredipro.academy/womens-health-diploma

You've got this.

Sarah`,
  },

  // Mini Diploma 5: Lesson 6 Two-Thirds
  {
    id: 104,
    name: "Mini Diploma 5: Lesson 6 Complete",
    day: 4,
    section: "mini_diploma",
    originalSubject: "Only 3 lessons left!",
    subject: "Re: only 3 lessons left",
    content: `{{firstName}},

Lesson 6 DONE. You're two-thirds through your Mini Diploma.

You now know more about women's health than most people ever will:
- Hormones and cycles
- Gut-hormone connection
- Thyroid function
- Stress and adrenals

Only 3 more lessons until your certificate.

Can you finish today? I think you can.

Go get it: https://learn.accredipro.academy/womens-health-diploma

So proud of you,
Sarah`,
  },

  // Mini Diploma 6: Day 4 Urgency
  {
    id: 105,
    name: "Mini Diploma 6: 3 Days Left",
    day: 4,
    section: "mini_diploma",
    originalSubject: "3 days left on your access",
    subject: "Re: 3 days left",
    content: `{{firstName}},

Quick heads up - your access to the Women's Health Mini Diploma expires in just 3 days.

You've got a few lessons left. Each one is only about 6 minutes - you can totally finish this.

Don't miss out on your certificate.

I know you're busy. But imagine how you'll feel when you've actually FINISHED something. When you have that certificate to show for it.

Start now: https://learn.accredipro.academy/womens-health-diploma

I'm here cheering you on,
Sarah`,
  },

  // Mini Diploma 7: Day 5 48h
  {
    id: 106,
    name: "Mini Diploma 7: 48 Hours Left",
    day: 5,
    section: "mini_diploma",
    originalSubject: "48 HOURS left!",
    subject: "Re: 48 hours left",
    content: `{{firstName}},

Your access expires in just 48 HOURS.

You've still got a few lessons to go. Each one is only 6 minutes.

I really don't want you to miss getting your certificate. You came so far just to stop now?

Finish tonight? I believe in you.

Go now: https://learn.accredipro.academy/womens-health-diploma

Sarah`,
  },

  // Mini Diploma 8: Day 6 Final
  {
    id: 107,
    name: "Mini Diploma 8: Last Day",
    day: 6,
    section: "mini_diploma",
    originalSubject: "LAST DAY",
    subject: "Re: last day",
    content: `{{firstName}},

This is it. LAST DAY.

Your access expires tomorrow and your certificate is so close.

Just a few more lessons. You can do this TODAY.

Each lesson is 6 minutes. That's less time than scrolling your phone.

Your certificate is waiting: https://learn.accredipro.academy/womens-health-diploma

Don't let this slip away,
Sarah

PS: If you're already done, ignore this. But if not - GO FINISH.`,
  },

  // Mini Diploma 9: All Complete
  {
    id: 108,
    name: "Mini Diploma 9: Certificate Ready",
    day: 7,
    section: "mini_diploma",
    originalSubject: "YOUR CERTIFICATE IS READY!",
    subject: "Re: your certificate is ready",
    content: `{{firstName}},

YOU DID IT. All 9 lessons COMPLETE.

I am so incredibly proud of you right now.

You now understand:
- The 5 key female hormones
- The 4 menstrual cycle phases
- Hormonal imbalance signs
- The gut-hormone connection
- Thyroid function
- Stress and adrenals
- Nutrition for hormone balance
- Life stage support

This is REAL knowledge that will help REAL women - starting with YOU.

Your certificate is ready: https://learn.accredipro.academy/womens-health-diploma/certificate

As a graduate, you also get:
- 30 days of continued access
- 20% off our full certification program
- Access to the Graduate Training video

Thank you for learning with me. I can't wait to see what you do with this knowledge.

With so much pride,
Sarah

PS: The full certification goes much deeper. If you want to actually help clients and build a practice, let's talk. Just reply to this email.`,
  },
  // ============================================
  // MINI DIPLOMA NURTURING SEQUENCE - 21 Emails
  // Women's Health → WH Career Accelerator ($997)
  // IDs: 200-220
  // ============================================

  // Nurture 1: Welcome (Day 0)
  {
    id: 200,
    name: "Nurture 1: Welcome + Value Stack",
    day: 0,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Welcome to your Mini Diploma",
    subject: "Re: your Women's Health access",
    content: `{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

Your FREE Women's Health Mini Diploma is ready - you can start right now.

<strong>Your Login Details:</strong>
Email: {{email}}
Password: coach2026

Login here: https://learn.accredipro.academy/login

What you're getting:
- 9 quick lessons on hormones, cycles, and women's health
- Real clinical knowledge (not surface-level fluff)
- Your own certificate when you finish
- 7 days to complete

This isn't like those PDFs that sit in your downloads folder. This is real training.

When you finish, I'll tell you about the full certification path - where women like you are building practices, helping clients, and earning $5K-$12K/month.

But first, let's get you through your Mini Diploma.

Start Lesson 1 now: https://learn.accredipro.academy/womens-health-diploma

I also left you a personal voice message inside. Check Messages when you log in.

Got questions? Just reply.

Sarah`,
  },

  // Nurture 2: Sarah's Story (Day 1)
  {
    id: 201,
    name: "Nurture 2: Sarah's WH Story",
    day: 1,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "My hormone journey",
    subject: "Re: my story (thought you'd relate)",
    content: `{{firstName}},

Can I tell you something personal?

The Moment That Changed Everything

I was 47. Exhausted. Couldn't sleep. Brain fog so bad I'd forget words mid-sentence. Mood swings that made me feel like a stranger in my own body.

My doctor said: "It's just stress. Try to relax."

I knew something was wrong. I FELT it. But nobody would listen.

So I started researching. Hormones. Perimenopause. The things nobody taught us about our own bodies.

And suddenly, everything made sense.

The exhaustion wasn't weakness. The mood swings weren't personality flaws. The weight gain wasn't lack of willpower.

It was my hormones. And once I understood that, I could actually DO something about it.

That's why I created this training. Because every woman deserves to understand her own body.

How's your Mini Diploma going? Have you started yet?

If not, Lesson 1 takes just 6 minutes. Start here: https://learn.accredipro.academy/womens-health-diploma

Sarah

P.S. Hit reply and tell me - what made you curious about women's health? What's YOUR story?`,
  },

  // Nurture 3: Why Generic Advice Fails (Day 3)
  {
    id: 202,
    name: "Nurture 3: Linda's Story",
    day: 3,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Why nothing worked for Linda",
    subject: "Re: why the usual advice doesn't work",
    content: `{{firstName}},

I need to tell you about Linda.

She came to me at 52. Exhausted for three years. Brain fog so bad she'd forget her own thoughts.

She'd seen four doctors. They all said the same thing:
- "Your labs are normal."
- "Try to sleep more."
- "Maybe it's just stress."
- "Have you considered antidepressants?"

Sound familiar?

Within 20 minutes of looking at her case through a root-cause lens, I found three things her doctors missed.

It wasn't that they were bad doctors. They just weren't trained to look.

Six weeks later, Linda texted me: "I feel like myself again. I forgot what that even felt like."

This is what you're learning in your Mini Diploma.

Not surface-level wellness advice. Real understanding of what's happening in your body - and what to do about it.

Keep going: https://learn.accredipro.academy/womens-health-diploma

Sarah`,
  },

  // Nurture 4: Graduate Training (Day 5)
  {
    id: 203,
    name: "Nurture 4: The Discovery",
    day: 5,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "The training that changed everything",
    subject: "Re: the training I mentioned",
    content: `{{firstName}},

Remember my story about the exhaustion and brain fog at 47?

There's a part I didn't share.

After I figured out my own health, I couldn't stop learning. I went deep into women's hormones, perimenopause, menopause, the gut-hormone connection.

And then I started helping other women.

Friends first. Then friends of friends. Then women I'd never met who found me through referrals.

Suddenly I had a practice. Clients who trusted me. Income coming in on my terms.

All because I understood something most doctors miss.

I Made Something For You

It's called the Graduate Training. 45 minutes. No fluff.

I walk you through:
- How practitioners like you are building real income helping women with hormones
- The exact certification path from curious to confident
- What separates those who succeed from those who stay stuck
- Real numbers - what our graduates actually earn

Watch it when you can focus. Not while cooking dinner.

First finish your Mini Diploma. Then watch this.

Sarah

P.S. If you're already done with the Mini Diploma, let me know! I want to hear how it went.`,
  },

  // Nurture 5: Diane's Story (Day 7)
  {
    id: 204,
    name: "Nurture 5: Diane's Story",
    day: 7,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "62-year-old nurse, $8K/month",
    subject: "Re: Diane's story (burned-out nurse)",
    content: `{{firstName}},

I want to tell you about Diane.

She was a nurse for 40 years. Accomplished. Respected. And completely burned out.

The day she called me, she said:

"Sarah, I love helping people. But I can't do this anymore. The 5am alarms. The 14-hour shifts. I'm 62 years old and I'm tired."

Then she said something that broke my heart:

"But what else can I do? I'm too old to start over."

Have you ever felt that? Too far down one path to change direction?

I asked her: "What if you're not starting over? What if you're taking everything you know and finally using it properly?"

Here's what happened:

Month 1: Certified. First time in years she felt like she was learning something that mattered.

Month 3: First three clients. Women with hormone issues who'd been dismissed by doctors.

Month 6: $8,000/month. Working from home. No 5am alarms. No commute.

Diane is 62. She's building the practice she should have had all along.

What about you?

Sarah

P.S. About 35% of our students come from medical backgrounds. If that's you, you're not starting from zero.`,
  },

  // Nurture 6: The Roadmap (Day 9)
  {
    id: 205,
    name: "Nurture 6: The Roadmap",
    day: 9,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Your complete path",
    subject: "Re: your complete roadmap",
    content: `{{firstName}},

I hate vague promises.

"Change your life!" "Find your purpose!" Cool. But HOW?

Here's the actual roadmap:

STEP 0: Mini Diploma (You're Here)
- Learn the fundamentals
- Earn your first credential
- Time: A few hours

STEP 1: WH Certification ($997)
- Full clinical training
- Foundation + Advanced + Master + Practice
- DFY website included
- Time: 8-12 weeks

STEP 2: Board Certification (Included)
- Practicum hours
- Advanced cases
- BC-WHP credential

What This Actually Looks Like:

Maria: Single mom, now $12K/month
Diane: 62 years old, $8K/month
Kelly: Zero business experience, now has a waitlist

They're not special. They just got trained properly.

$997 pays for itself with your first 2-3 clients.

But I'll talk more about that later. First - have you finished your Mini Diploma?

Sarah`,
  },

  // Nurture 7: How to Get Clients (Day 11)
  {
    id: 206,
    name: "Nurture 7: Kelly's Waitlist",
    day: 11,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "How Kelly got a waitlist",
    subject: "Re: getting clients (the real answer)",
    content: `{{firstName}},

Kelly messaged me three months after getting certified:

"Sarah, I have a WAITLIST. I've never had a waitlist for anything in my life."

Here's the thing about Kelly:

Zero business experience. Terrified of marketing. She told me: "I don't have a following. I don't know how to sell."

So how did she build a waitlist in 90 days?

The Simple System:

1. She posted what she was learning
"I learned something wild today about how hormones affect sleep. Never knew this before."
Friends started asking questions.

2. She offered free 15-minute calls
People who get value in 15 minutes want to pay for more.

3. She let her first clients talk
They referred friends. Those friends became clients.

That's it. No fancy funnel. No paid ads.

Your network IS your market. You already know women struggling with hormone issues. You just don't have the tools to help them yet.

When you do? You're not selling - you're serving.

We give you the whole system inside the certification.

Sarah`,
  },

  // NEW: Community Momentum (Day 12)
  {
    id: 207,
    name: "Nurture 8: Community Momentum",
    day: 12,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "What happened this week",
    subject: "Re: what happened this week",
    content: `{{firstName}},

Quick update on what happened in our community this week:

- 47 new practitioners enrolled
- 12 graduates got their first paying clients
- 3 practitioners hit $10K/month
- 156 women are learning alongside you right now

Some messages from this week:

Jennifer (Texas): "Just booked my 5th client. This is real."

Amanda (California): "I was terrified to start. Now I have a waitlist."

Lisa (Ohio): "Hit $6K this month. Quit my job next week."

This isn't some small thing, {{firstName}}. This is a movement.

Women all over the country are building practices, helping clients, creating income on their terms.

You're not alone in this. There's a whole community waiting for you.

Ready to join them?

Sarah

P.S. Still working on your Mini Diploma? No rush - but don't miss out on the momentum.`,
  },

  // Nurture 9: Vicki's Story (Day 13)
  {
    id: 208,
    name: "Nurture 9: Vicki's Transformation",
    day: 13,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Yoga teacher → WH practitioner",
    subject: "Re: Vicki's transformation",
    content: `{{firstName}},

If you've ever thought "But I don't have a medical background" - this is for you.

Vicki was a yoga teacher.

Her students would come to class exhausted, struggling with issues yoga couldn't touch. Hormone chaos. Gut problems. Brain fog.

She'd say something supportive. But inside, she felt helpless.

"I felt like I was only scratching the surface. Like I was giving people an hour of relief in a life of struggle."

When she found our program, she almost didn't enroll.

Her fears:
- "I don't have a science degree. Can I understand this?"
- "Will anyone take me seriously?"
- "What if I fail?"

Here's what happened:

Month 2: Her yoga students became her first clients. They already trusted her.

Month 4: $4,200/month added income. Didn't give up yoga - just added coaching.

Month 6: Raising prices. Getting referrals from people she'd never met.

About 25% of our students come from wellness backgrounds. You're not starting from zero.

Sarah`,
  },

  // Nurture 10: Is This Legit? (Day 15)
  {
    id: 209,
    name: "Nurture 10: Is This Legit?",
    day: 15,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Let's be honest",
    subject: "Re: about our accreditation",
    content: `{{firstName}},

I know what you might be thinking:

"Is this actually legitimate? Or just another online certificate that means nothing?"

Fair question.

What We're NOT:
- A weekend workshop with a PDF
- A glorified YouTube playlist
- A program where everyone passes because they paid

What We Actually Are:

Full Clinical Training
- 21 modules of real knowledge
- Lab interpretation, protocol design, client assessment

Real Assessment
- You don't just watch videos
- Case studies, exams, demonstrated competency

Verifiable Credentials
- Every certificate has a verification number
- Public registry anyone can check

Graduates Who Actually Practice
- Building businesses
- Helping clients
- Charging real money

But here's what actually matters:

After this program, you won't wonder "Am I qualified?" You'll KNOW you are.

That confidence? Clients feel it.

Sarah`,
  },

  // NEW: Even If You've Failed Before (Day 16)
  {
    id: 210,
    name: "Nurture 11: Even If You've Failed",
    day: 16,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "If you've tried before",
    subject: "Re: if you've tried other programs",
    content: `{{firstName}},

I need to address something.

If you've tried other courses before and they didn't work - I get it.

Maybe you bought a certification that was mostly fluff.
Maybe you finished but didn't know what to do next.
Maybe you invested money and time... and nothing changed.

That's not your fault.

Most programs give you information but not transformation. They teach you ABOUT health, but not how to BUILD a practice.

Here's what's different:

1. We don't leave you hanging
Full training PLUS business-in-a-box. Website, marketing, intake forms - built for you.

2. You're not alone
Weekly live calls. Accountability pod. Coach Sarah AI 24/7.

3. We have skin in the game
Income guarantee. If you do the work and don't hit your goals, we keep supporting you FREE.

Jennifer told me: "I'd failed at two other certifications. I almost didn't try again. Now I'm earning more than my old nursing job."

Past failures don't define your future.

This time is different.

Sarah`,
  },

  // Nurture 12: Time Objection (Day 17)
  {
    id: 211,
    name: "Nurture 12: Time Objection",
    day: 17,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "About the time commitment",
    subject: "Re: about the time commitment",
    content: `{{firstName}},

Let me guess what you're thinking:

"This sounds great, Sarah. But I don't have time."

I hear this every day.

Here's the truth:

Nobody "finds" time. You make time for what matters.

How much time this week did you spend:
- Scrolling Instagram?
- Watching Netflix?
- Lying awake at 2am worrying about your future?

If you have 45 minutes a day to worry about your life, you have 45 minutes a day to change it.

How the program works:

Self-Paced
Study at 5am. Study at 10pm. Study on lunch breaks. No live sessions required.

5-7 Hours Per Week
Less than an hour a day. Most finish in 8-12 weeks.

Mobile-Friendly
Watch on your phone in the pickup line. Listen while cooking.

Rachel enrolled while working full-time with two kids under 5. She finished in 11 weeks. Two months later, she had her first client.

Time is what you make it.

Sarah`,
  },

  // Nurture 13: Money Talk (Day 19)
  {
    id: 212,
    name: "Nurture 13: The Investment",
    day: 19,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Let's talk about $997",
    subject: "Re: the investment question",
    content: `{{firstName}},

Let's have an honest conversation about money.

The WH certification is $997.

I'm not going to pretend that's nothing.

So let's do real math:

Traditional health certifications: $15,000-$50,000
Nursing/medical school: $100,000+
Time investment: 2-6 YEARS

Our program:
- Investment: $997
- Time: 8-12 weeks
- PLUS: DFY website, marketing, AI coach, directory listing - all included

The Return:

Most graduates charge $200-$500 per session.

$997 / $250 per session = 4 clients to break even.

After that? Everything is profit.

Maria earns $12K/month. Her $997 paid back in week one.
Diane earns $8K/month. Her $997 paid back in month one.

Payment Plans Available:
- 3 payments of $349
- 6 payments of $179

What's the cost of NOT doing this?

Another year stuck?
Another year watching others build the life you want?

Ready when you are: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Sarah`,
  },

  // NEW: Future Pacing (Day 20)
  {
    id: 213,
    name: "Nurture 14: Future Pacing",
    day: 20,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "What if it works?",
    subject: "Re: what if it actually works",
    content: `{{firstName}},

Close your eyes for a second. (Read this first, then close them.)

Imagine it's one year from today.

You wake up without an alarm. No commute. No boss.

You check your calendar - three client calls today. Women who found you because you HELP people like them.

Your phone buzzes. A client thanking you for changing her life. Her energy is back. Her hormones are balanced. She feels like herself again.

You helped her do that.

After your calls, you pick up your daughter from school. On time. Because your schedule is YOURS.

Your bank account shows the deposit from this week's sessions: $2,400.

This isn't a fantasy. This is Maria's Tuesday. Diane's Wednesday. Kelly's every day.

Now open your eyes.

You have two choices:

Path A: This time next year, you're in the same place. Same frustration. Same "what if."

Path B: This time next year, you're the practitioner in that visualization.

The only difference between Path A and Path B is a decision.

Ready to decide: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Sarah`,
  },

  // Nurture 15: Maria's Story (Day 21)
  {
    id: 214,
    name: "Nurture 15: Maria's Journey",
    day: 21,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Single mom, now $12K/month",
    subject: "Re: Maria's journey (single mom)",
    content: `{{firstName}},

I need to tell you about Maria.

Single mom. Three kids. Working nights at a call center.

When she enrolled, she literally didn't have $997. She signed up for the payment plan - $179/month - terrified the whole time.

Her husband had left. Bills were overwhelming. She was one crisis away from falling apart.

"Sarah, I don't know if I can do this," she told me. "But I can't stay where I am."

Here's what happened:

Month 2: Finished certification. First time she felt proud of herself in years.

Month 4: First three clients. Women who reminded her of her own mother.

Month 6: $5,000/month. Quit the call center job.

Month 12: $12,000/month. Her kids tell their friends their mom helps people feel better.

The $179/month terrified her. Now she earns that in 45 minutes.

She told me: "The investment wasn't an expense. It was the down payment on a different life."

Is today your Day 1?

Sarah`,
  },

  // Nurture 16: Two Paths (Day 23)
  {
    id: 215,
    name: "Nurture 16: Two Paths",
    day: 23,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Two paths ahead",
    subject: "Re: thinking about your decision",
    content: `{{firstName}},

I want to try something with you.

There are two versions of you one year from now.

Version A:
Same job. Same frustration. Same knowing you could be doing more.
Looking back and thinking: "I wish I had just tried."

Version B:
Helping women every week. Making real impact.
Income that gives you freedom. Schedule that gives you time.
Looking back and thinking: "I'm so glad I decided."

Both versions are real. Both are possible.

The only difference is what you decide right now.

Not "someday." Not "when I'm ready." Right now.

Maria was terrified when she enrolled. Now she makes $12K/month.
Diane thought she was too old. Now she works from home at 62.
Kelly had zero business experience. Now she has a waitlist.

They weren't special. They just decided.

What will you decide?

Sarah

P.S. If you're reading this and thinking "I should do this" - listen to that voice. It's trying to tell you something.`,
  },

  // NEW: Permission to Invest (Day 24)
  {
    id: 216,
    name: "Nurture 17: Permission to Invest",
    day: 24,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "You're allowed to want this",
    subject: "Re: a quick reminder",
    content: `{{firstName}},

Can I tell you something?

You're allowed to invest in yourself.

I know that might sound obvious. But for women - especially women over 40 - it often isn't.

We're trained to put everyone else first. Kids. Partners. Parents. Work.

Our dreams? "Someday." "When the kids are older." "When we have more money."

I've watched so many women almost enroll... then stop because they felt guilty spending $997 on themselves.

Meanwhile, they spend that much on everyone else without thinking twice.

So let me say this clearly:

You are allowed to want more for yourself.
You are allowed to invest in your future.
You are allowed to put yourself first for once.

This isn't selfish. It's necessary.

Because when you build something meaningful, everyone around you benefits too.

Your kids see a mom who goes after what she wants.
Your partner sees someone who believes in herself.
Your clients get a practitioner who actually cares.

You deserve this, {{firstName}}.

And I'll be here when you're ready.

Sarah`,
  },

  // Nurture 18: FAQ (Day 25)
  {
    id: 217,
    name: "Nurture 18: FAQ",
    day: 25,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Your questions answered",
    subject: "Re: your questions (answered)",
    content: `{{firstName}},

Before you decide, let me answer the questions I know you're asking:

"How long does it take?"
8-12 weeks, 5-7 hours per week. Self-paced.

"What if I don't have a medical background?"
25% of our students come from wellness backgrounds (yoga, massage, nutrition). The training meets you where you are.

"What if I'm too old?"
Diane is 62. She makes $8K/month. You're not too old.

"How do I get clients?"
We give you the complete system: website, marketing templates, referral engine. Kelly had a waitlist in 90 days with zero business experience.

"What if it doesn't work for me?"
Income guarantee. Do the work, and if you don't hit your goals, we keep supporting you FREE until you do.

"What's included in $997?"
- Full WH certification (Foundation + Advanced + Master + Practice)
- Board certification path included
- DFY website
- AI Coach Sarah (lifetime)
- Practitioner directory (lifetime)
- Live mentorship
- Accountability pod
- Templates vault
- Private community (lifetime)

Total value: $28,000+. Your investment: $997.

Any other questions? Just reply.

Sarah`,
  },

  // Nurture 19: Closing Friday (Day 27)
  {
    id: 218,
    name: "Nurture 19: Closing Friday",
    day: 27,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Enrollment closing Friday",
    subject: "Re: enrollment closing Friday",
    content: `{{firstName}},

I need to tell you something important.

This enrollment period closes Friday at midnight.

I know you've seen this kind of thing before. "HURRY! LIMITED TIME!"

But here's why I actually close enrollment:

When it's always open, people don't start. "I'll do it next month." And next month becomes never.

So I close enrollment. Not to pressure you. To give you a real decision point.

What happens Friday:
- Enrollment closes for this round
- The bonus package disappears
- Next enrollment is... I don't know when

What's on the table:

Full WH Certification Program
- All credentials included
- DFY website + marketing
- Lifetime AI coach + directory
- Investment: $997

If you've been waiting for a sign, this is it.

Ready: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Not ready: That's okay. Just know this offer won't be here Monday.

Sarah`,
  },

  // Nurture 20: 48 Hours (Day 28)
  {
    id: 219,
    name: "Nurture 20: 48 Hours",
    day: 28,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "48 hours left",
    subject: "Re: 48 hours left",
    content: `{{firstName}},

Quick one.

48 hours.

That's how much time you have before:
- Bonuses disappear
- Enrollment closes
- Next opportunity is months away

I'm not going to pretend I know what's right for you.

But I've learned something:

The women who succeed are the ones who stop waiting for perfect conditions.

They don't wait until they have more time. (They never do.)
They don't wait until they have more money. (There's always something.)
They don't wait until they feel "ready." (Nobody ever does.)

They just decide.

Ready to decide: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Sarah`,
  },

  // Nurture 21: Final Call (Day 29)
  {
    id: 220,
    name: "Nurture 21: Final Call",
    day: 29,
    section: "mini_diploma_nurturing",
    useHtmlBranding: true,
    originalSubject: "Final call",
    subject: "Re: final call",
    content: `{{firstName}},

This is my last email.

Tonight at midnight, enrollment closes.

No more reminders. No more "think about it."

You've read the stories. Diane at 62. Maria as a single mom. Kelly with no business experience.

You've seen the roadmap. Mini Diploma to Certified Practitioner to real income.

You know the investment. $997. Pays for itself with 2-3 clients.

The only question left is:

Are you going to do this?

If yes: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

If no: Thank you for being here. I mean that. Not everyone takes action, and that's okay.

But if there's even a small part of you that's saying "I should do this"...

Listen to that voice.

Whatever you decide, I'm rooting for you.

Sarah

P.S. The bonuses expire at midnight. The enrollment closes. And this version of the offer is gone.

If you're in: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

If not: I'll stop emailing. No hard feelings.

I hope this is your year.`,
  },

  // ============================================
  // BUYER RETENTION EMAILS - Post-Purchase Sequences
  // Test which subjects land in Primary for existing buyers
  // ============================================

  // Sprint Email 1: Day 0 - Welcome
  {
    id: 300,
    name: "Buyer Sprint 1: Welcome",
    day: 0,
    section: "buyer_retention",
    originalSubject: "You're in! Here's your first step",
    subject: "Re: your access is ready",
    content: `{{firstName}},

Congratulations - you just made one of the best decisions of your life.

You're now enrolled in Functional Medicine Certification.

But here's the thing: the practitioners who succeed aren't the ones who "plan to start Monday." They're the ones who start TODAY.

So here's what I want you to do right now:

1. Log into your dashboard: https://learn.accredipro.academy/dashboard
2. Click "Start Module 1"
3. Complete the first lesson (12 minutes)

That's it. Just one lesson.

I'm so excited to have you in the community.

Sarah

P.S. I'll check in tomorrow to see how you're doing.`,
  },
  {
    id: 301,
    name: "Buyer Sprint 1 - V2: Personal",
    day: 0,
    section: "buyer_retention",
    originalSubject: "welcome + your login",
    subject: "Re: welcome",
    content: `{{firstName}},

You're in.

I just saw your name come through and wanted to say welcome personally.

Your dashboard is ready: https://learn.accredipro.academy/dashboard

Just start Module 1 when you're ready. No rush - but sooner is better.

Talk soon.

Sarah`,
  },
  {
    id: 302,
    name: "Buyer Sprint 1 - V3: Ultra Short",
    day: 0,
    section: "buyer_retention",
    originalSubject: "you're all set",
    subject: "Re: you're all set",
    content: `{{firstName}},

All set! Your course is ready.

Start here: https://learn.accredipro.academy/dashboard

Any questions, just reply.

Sarah`,
  },

  // 7-Day Reminder Variants - WARM & CARING
  {
    id: 310,
    name: "Buyer 7d: V1 Thinking of you",
    day: 7,
    section: "buyer_retention",
    originalSubject: "thinking of you",
    subject: "Re: thinking of you",
    content: `{{firstName}},

Just thinking about you and wanted to reach out.

How are you doing? How's everything going?

I know life can get busy - trust me, I've been there. Some weeks just fly by.

If you've had a chance to start, I'd love to hear how it's going. And if you haven't yet - no worries at all. Your course is there whenever you're ready.

Is there anything I can help with?

Sending you good energy today.

Sarah`,
  },
  {
    id: 311,
    name: "Buyer 7d: V2 Checking in",
    day: 7,
    section: "buyer_retention",
    originalSubject: "checking in on you",
    subject: "Re: checking in on you",
    content: `{{firstName}},

Hey - just wanted to check in and see how you're doing.

No agenda here. Just genuinely curious how life is treating you.

Your course is ready whenever you are. No rush, no pressure.

If you want to chat about anything, just reply. I love hearing from you.

Sarah`,
  },
  {
    id: 312,
    name: "Buyer 7d: V3 Here for you",
    day: 7,
    section: "buyer_retention",
    originalSubject: "here for you",
    subject: "Re: here for you",
    content: `{{firstName}},

Just a quick note to let you know I'm here if you need anything.

Sometimes we just need a friendly voice. I'm that voice if you want it.

Whenever you're ready to dive in, I'll be here.

Take care of yourself.

Sarah`,
  },

  // 14-Day Reminder Variants - WARM & SUPPORTIVE
  {
    id: 320,
    name: "Buyer 14d: V1 Still thinking of you",
    day: 14,
    section: "buyer_retention",
    originalSubject: "still thinking of you",
    subject: "Re: still thinking of you",
    content: `{{firstName}},

I've been thinking about you.

It's been a couple weeks and I just wanted to see how you're doing. How's life?

I know from experience that sometimes the timing just isn't right. That's okay. Your course isn't going anywhere.

But I also know sometimes we just need a little nudge. A reminder that we can do this.

If you're feeling overwhelmed about where to start, just reply. I love helping people figure out their next step.

No pressure from me. Just support.

Sarah`,
  },
  {
    id: 321,
    name: "Buyer 14d: V2 No pressure",
    day: 14,
    section: "buyer_retention",
    originalSubject: "no pressure",
    subject: "Re: no pressure at all",
    content: `{{firstName}},

I hope you're well.

Just wanted you to know - there's absolutely no pressure from me.

Life gets busy. Things come up. I totally understand.

Whenever you're ready, your spot is saved. I'll be here.

Virtual hug your way.

Sarah`,
  },
  {
    id: 322,
    name: "Buyer 14d: V3 Sending love",
    day: 14,
    section: "buyer_retention",
    originalSubject: "sending love",
    subject: "Re: sending love your way",
    content: `{{firstName}},

I haven't forgotten about you.

Life has a way of taking us in unexpected directions sometimes. Maybe things got busy. Maybe something came up.

All of that is okay.

I'm not here to pressure you. I'm here because I genuinely care about the women in our community.

Whenever you're ready - whether that's next week or next month - I'll be here.

With love,

Sarah`,
  },
];


// GET - Return all variants info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if requesting a specific variant
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variantId');

    if (variantId) {
      const parsedId = parseInt(variantId);
      // Check EMAIL_VARIANTS first, then WH v2 (IDs 300+)
      let variant: any = EMAIL_VARIANTS.find(v => v.id === parsedId);
      if (!variant && parsedId >= 300) {
        const whIndex = parsedId - 300;
        const whEmail = WH_NURTURE_60_DAY_V3[whIndex];
        if (whEmail) {
          variant = {
            id: parsedId,
            name: `WH v2 Email ${whEmail.id}: Day ${whEmail.day}`,
            day: whEmail.day,
            originalSubject: whEmail.subject,
            subject: whEmail.subject,
            content: whEmail.content,
            section: "wh_nurture_v2",
          };
        }
      }
      if (!variant) {
        return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      }

      // Generate full HTML for preview
      let personalizedContent = variant.content.replace(/\{\{firstName\}\}/g, "{{firstName}}");

      // Replace CTA button placeholder if present
      if ((variant as any).useCtaButton) {
        personalizedContent = personalizedContent.replace(
          '{{CTA_BUTTON}}',
          '<a href="https://accredipro.academy" style="display:inline-block;background:#722F37;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Watch the Free Training</a>'
        );
      }

      let htmlContent: string;

      if ((variant as any).useHtmlBranding) {
        const formattedContent = personalizedContent
          .split('\n\n')
          .map(p => `<p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
          .join('');

        htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
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
          <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182, New York, NY 10020</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
      } else {
        htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#222;">
${personalizedContent.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}
</body>
</html>`;
      }

      return NextResponse.json({
        id: variant.id,
        name: variant.name,
        day: variant.day,
        subject: variant.subject,
        originalSubject: variant.originalSubject,
        content: variant.content,
        html: htmlContent,
      });
    }

    // Return list of all variants (including WH Nurture v2 and FM sequences)
    // Convert WH v2 emails to the expected format with IDs 300+
    const whV2Emails = WH_NURTURE_60_DAY_V3.map((email, index) => ({
      id: 300 + index,
      name: `WH v2 Email ${email.id}: Day ${email.day}`,
      day: email.day,
      originalSubject: email.subject,
      subject: email.subject,
      content: email.content,
      section: "wh_nurture_v2",
    }));

    // Convert FM Completion emails to the expected format with IDs 400+
    const fmCompletionEmails = FM_COMPLETION_SEQUENCE.map((email, index) => ({
      id: 400 + index,
      name: `FM Completion ${email.id}: Day ${email.day} (${email.phase})`,
      day: email.day,
      originalSubject: email.subject,
      subject: email.subject,
      content: email.content,
      section: "fm_completion",
    }));

    // Convert FM Nurture v4 emails to the expected format with IDs 500+
    const fmNurtureEmails = FM_NURTURE_SEQUENCE_V4.map((email, index) => ({
      id: 500 + index,
      name: `FM Nurture ${email.id}: Day ${email.day} (${email.phase})`,
      day: email.day,
      originalSubject: email.subject,
      subject: email.subject,
      content: email.content,
      section: "fm_nurture_v4",
    }));

    const allVariants = [...EMAIL_VARIANTS, ...whV2Emails, ...fmCompletionEmails, ...fmNurtureEmails];

    return NextResponse.json({
      variants: allVariants.map(v => ({
        id: v.id,
        name: v.name,
        day: v.day,
        originalSubject: v.originalSubject,
        subject: v.subject,
        contentPreview: v.content.substring(0, 150) + "...",
        section: (v as any).section || null,
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

    // Check EMAIL_VARIANTS, WH v2 emails, and FM sequences
    let variant: any = EMAIL_VARIANTS.find(v => v.id === variantId);

    // WH v2 emails (300-399)
    if (!variant && variantId >= 300 && variantId < 400) {
      const whIndex = variantId - 300;
      const whEmail = WH_NURTURE_60_DAY_V3[whIndex];
      if (whEmail) {
        variant = {
          id: variantId,
          name: `WH v2 Email ${whEmail.id}: Day ${whEmail.day}`,
          day: whEmail.day,
          originalSubject: whEmail.subject,
          subject: whEmail.subject,
          content: whEmail.content,
          section: "wh_nurture_v2",
        };
      }
    }

    // FM Completion emails (400-499)
    if (!variant && variantId >= 400 && variantId < 500) {
      const fmIndex = variantId - 400;
      const fmEmail = FM_COMPLETION_SEQUENCE[fmIndex];
      if (fmEmail) {
        variant = {
          id: variantId,
          name: `FM Completion ${fmEmail.id}: Day ${fmEmail.day}`,
          day: fmEmail.day,
          originalSubject: fmEmail.subject,
          subject: fmEmail.subject,
          content: fmEmail.content,
          section: "fm_completion",
        };
      }
    }

    // FM Nurture v4 emails (500+)
    if (!variant && variantId >= 500) {
      const fmIndex = variantId - 500;
      const fmEmail = FM_NURTURE_SEQUENCE_V4[fmIndex];
      if (fmEmail) {
        variant = {
          id: variantId,
          name: `FM Nurture ${fmEmail.id}: Day ${fmEmail.day}`,
          day: fmEmail.day,
          originalSubject: fmEmail.subject,
          subject: fmEmail.subject,
          content: fmEmail.content,
          section: "fm_nurture_v4",
        };
      }
    }
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
              <a href="https://learn.accredipro.academy/unsubscribe" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
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
