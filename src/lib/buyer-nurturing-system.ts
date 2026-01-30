/**
 * BUYER NURTURING SYSTEM v1.0
 * 
 * Universal for ALL certifications (FM, WH, etc.)
 * Goal: Build trust → Sell Pro Accelerator ($297) & DFY Kit ($397)
 * 
 * SEQUENCES:
 * 1. STORY (Day 1-10) - Sarah's journey, build bond
 * 2. PROOF (Day 12-22) - Success stories
 * 3. PAIN SEED (Day 24-28) - Why they need DFY
 * 4. DFY LAUNCH (Day 30-35) - Open spots, scarcity
 * 5. MILESTONE - Pro Accelerator at 50%+ and 100%
 */

// ============================================
// TYPES
// ============================================

export interface NurtureEmail {
    id: string;
    sequence: 'story' | 'proof' | 'pain_seed' | 'dfy_launch' | 'milestone';
    day: number;
    delayHours: number;
    subject: string;
    content: string;
    cta?: {
        text: string;
        url: string;
    };
    preventTag?: string;
}

// ============================================
// CTA LINKS (Template Variables)
// ============================================

export const CTA_LINKS = {
    dashboard: '{{dashboardUrl}}',
    course: '{{courseUrl}}',
    proAccelerator: 'https://learn.accredipro.academy/pro-accelerator',
    dfyKit: 'https://learn.accredipro.academy/dfy-kit',
    community: 'https://learn.accredipro.academy/community',
};

// ============================================
// SIGNATURE
// ============================================

const SARAH = `Sarah 💕`;

// ============================================
// 1. STORY SEQUENCE (Day 1-10)
// Sarah's journey - build deep emotional bond
// ============================================

export const STORY_SEQUENCE: NurtureEmail[] = [
    {
        id: "story_day1",
        sequence: "story",
        day: 1,
        delayHours: 24,
        subject: "Re: can I share something personal?",
        content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way." 💔

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that — it gave me back my hope.

Hope that I could truly help my clients. Hope that I could build a career I loved. Hope that I could create a future for my family that didn't depend on burning out or "faking it."

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do. 🌱

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

So tell me, {{firstName}} … what made you curious about {{certificationName}}?

With love,

${SARAH}`,
    },
    {
        id: "story_day3",
        sequence: "story",
        day: 3,
        delayHours: 72,
        subject: "Re: the night everything changed",
        content: `{{firstName}},

I want to tell you about the night everything changed for me.

It was 3am. My daughter was finally asleep after being sick for the third time that month. And I was sitting at the kitchen table, exhausted, scrolling through research papers I barely understood.

I felt so lost.

I'd tried everything the doctors suggested for her. For myself. For my clients. And nothing was really working. Not at the root level.

Then I stumbled onto this article about functional medicine. About looking for the WHY behind symptoms instead of just treating what shows up on the surface.

And I remember thinking: "This is it. This is what's been missing."

That night, I made a promise to myself:

I was going to learn this. Really learn it. Not just surface-level wellness tips, but the deep clinical understanding that actually changes lives.

It took time. It took sacrifice. There were nights I studied instead of slept. Weekends I practiced instead of rested.

But that decision — made at 3am in my pajamas with cold coffee — changed everything.

My daughter got better. My clients started getting real results. And for the first time, I felt like I actually knew what I was doing.

I'm sharing this because I know you're at your own crossroads right now.

You signed up for {{certificationName}} for a reason. Maybe you haven't even fully admitted that reason to yourself yet. But something inside you knows there's more.

Trust that feeling. 💕

I'm so glad you're here.

${SARAH}`,
    },
    {
        id: "story_day5",
        sequence: "story",
        day: 5,
        delayHours: 120,
        subject: "Re: she texted me crying",
        content: `{{firstName}},

I'll never forget the text I got from my first "real" client.

Her name was Rebecca. 47 years old. She'd been to 6 doctors over 3 years. Spent over $15,000 on tests and specialists. And everyone kept telling her the same thing:

"Your labs look fine. It's probably stress."

But she wasn't fine. Brain fog so bad she couldn't remember her kids' schedules. Fatigue that made her cancel plans every weekend. Joint pain that kept her up at night.

She found me through a friend. Honestly, I was terrified. What if I couldn't help her either?

But I put everything I'd learned into practice. We looked at things nobody had tested. We found patterns everyone had missed. We worked together for 12 weeks.

And then came the text:

"Sarah, I just went for a walk. A REAL walk. 3 miles. I haven't done that in 4 years. I'm sitting on a bench crying. But they're happy tears. Thank you for not giving up on me."

I sat in my car and cried too.

That's the moment I knew this was my life's work. Not just helping people "feel better" — but giving them back the lives they thought they'd lost.

You're going to have a Rebecca too, {{firstName}}.

Someone who's given up hope. Someone who's been told there's nothing wrong. Someone who just needs ONE person to see them, believe them, and actually know what to do.

That person is going to find you. And you're going to change their life.

Keep going. This matters more than you know. 🌟

${SARAH}`,
    },
    {
        id: "story_day7",
        sequence: "story",
        day: 7,
        delayHours: 168,
        subject: "Re: my daughter noticed first",
        content: `{{firstName}},

My daughter was the first one to notice.

I was making dinner one evening — something I'd actually had energy to do for the first time in months — and she looked up at me and said:

"Mommy, you seem so happy now."

I had to turn away so she wouldn't see me cry.

For years, she'd watched me struggle. Watched me come home exhausted. Watched me stress about bills, about clients, about whether I was good enough.

And now she was watching me build something real.

A career I loved. Income that felt sustainable. Work that actually mattered.

She's older now, and just last month she told me: "Mom, because of you, I believe I can do anything."

THAT is why I do this, {{firstName}}.

Not just for me. Not just for my clients. But for everyone watching us — our kids, our partners, our friends — who need to see that it's possible to build something meaningful.

Your journey through {{certificationName}} isn't just about you.

It's about everyone you'll help.
It's about everyone who's watching you.
It's about the ripple effect of one person choosing to go deeper.

I see you. I believe in you. And I'm honored to be part of your journey.

With so much love,

${SARAH}`,
    },
    {
        id: "story_day10",
        sequence: "story",
        day: 10,
        delayHours: 240,
        subject: "Re: this is why I do this",
        content: `{{firstName}},

People sometimes ask me why I do this.

Why I spend hours creating courses. Why I answer emails at midnight. Why I care so much about people I've never met.

The answer is simple:

Because someone did it for me.

When I was struggling, someone believed in me. Someone gave me the knowledge I needed. Someone saw my potential when I couldn't see it myself.

And now it's my turn.

Every time I see a student complete their certification... every time I hear about a client whose life was changed... every time someone messages me saying "you helped me believe in myself again"...

I remember that moment on the kitchen floor. The tears. The fear. The feeling that nothing would ever change.

And I'm so grateful it did.

I'm not special, {{firstName}}. I'm not smarter or braver than anyone else. I'm just someone who made a decision and kept going.

You're doing the same thing right now.

And someday, YOU'LL be the one who helps someone else find their way.

That's the real magic of this work. It multiplies.

Thank you for being part of this community. Thank you for trusting this process. Thank you for showing up.

I'm cheering for you every single day.

${SARAH}

P.S. How's the course going? Hit reply and let me know — I read every single response myself. 💕`,
    },
];

// ============================================
// 2. PROOF SEQUENCE (Day 12-22)
// Success stories - show what's possible
// ============================================

export const PROOF_SEQUENCE: NurtureEmail[] = [
    {
        id: "proof_day12",
        sequence: "proof",
        day: 12,
        delayHours: 288,
        subject: "Re: 40 years nursing... and then this",
        content: `{{firstName}},

I want to tell you about Diane.

Diane was an RN for 40 years. Hospital shifts. Night rotations. The physical and emotional toll of caring for everyone except herself.

At 62, she was burned out. Her body hurt. Her spirit was tired. And she'd started to believe that "maybe it's too late to start something new."

She found us and enrolled in her certification — not really believing anything would come of it. Just hoping.

Three months later, she sent me this:

"Sarah, I just closed my 8th client this month. I'm making $8,000/month working from my living room. I see people on MY schedule. I use everything I learned in 40 years of nursing, but now I actually have time to HELP them. I didn't think this was possible at my age. I was wrong."

Diane works 25 hours a week now. From home. Wearing yoga pants. Helping people with the deep health issues she always wished she could address in the hospital.

She's 63 years old. She started from zero. And she did it.

{{firstName}}, if you've ever thought "I'm too old" or "I missed my window" or "it's too late for me"...

I want you to remember Diane.

It's not too late. It's never too late.

You've got this.

${SARAH}`,
    },
    {
        id: "proof_day15",
        sequence: "proof",
        day: 15,
        delayHours: 360,
        subject: "Re: from kitchen floor to $12k/month",
        content: `{{firstName}},

I met Maria at a conference two years ago.

She came up to me after my session, and I could tell she'd been crying. She pulled me aside and whispered:

"My story is just like yours. Single mom. Kitchen floor. Feeling like a fraud. I didn't know anyone else understood."

She'd enrolled in her certification the week before. No clients. No website. No idea how she was going to pay rent next month.

I told her the same thing I'm telling you now:

"Just keep going. One lesson at a time. One day at a time. Trust the process."

Last month, Maria sent me her income report.

$12,400 in client revenue. From her dining room table. While her kids do homework next to her.

She wrote: "I went from crying on the floor to crying from joy. Same kitchen. Completely different life."

Maria isn't a marketing genius. She doesn't have a fancy website. She's not on Instagram every day.

She just learned real skills, believed she could help people, and showed up consistently.

That's it. That's the whole secret.

You're on the same path right now. Keep walking.

${SARAH}`,
    },
    {
        id: "proof_day18",
        sequence: "proof",
        day: 18,
        delayHours: 432,
        subject: "Re: 'I have no medical background'",
        content: `{{firstName}},

"I don't have a medical background. Who am I to help people with their health?"

That was Vicki's first message to me after enrolling.

She was a yoga teacher. Loved wellness. Knew something was missing from the "just do more yoga" advice she was giving.

But she was terrified. She didn't have letters after her name. She hadn't been to nursing school. She felt like an imposter before she even started.

I told her: "The certification gives you the knowledge. The clients don't care about your background — they care about results."

Fast forward 8 months.

Vicki now runs a gut health specialty practice. Her clients are referred by local naturopaths and functional medicine doctors. She charges $1,200 per 3-month program.

Last month: $4,200 in income. Part-time. From her spare bedroom.

She wrote me recently: "I can't believe I almost didn't do this because I felt 'unqualified.' The training gave me everything I needed. I just had to trust it."

{{firstName}}, whatever story is in your head about why you "can't" do this...

Vicki had the same story. Diane had the same story. Maria had the same story.

They did it anyway.

So can you.

${SARAH}`,
    },
    {
        id: "proof_day21",
        sequence: "proof",
        day: 21,
        delayHours: 504,
        subject: "Re: what they ALL had in common",
        content: `{{firstName}},

Diane (62, RN) — $8,000/month
Maria (single mom) — $12,400/month
Vicki (yoga teacher) — $4,200/month

Different ages. Different backgrounds. Different starting points.

But they all had ONE thing in common.

They finished what they started.

That's it. That's the difference.

They didn't have secret advantages. They didn't have rich spouses. They didn't have marketing degrees.

They just kept going when it got hard. They showed up when they didn't feel like it. They trusted the process when they couldn't see results yet.

Most people who enroll in certification programs never finish.

Life gets busy. Doubt creeps in. The excitement fades.

But the ones who transform their lives? They're the ones who push through anyway.

{{firstName}}, you're inside {{certificationName}} right now to change your life. You made that decision for a reason.

Don't let that reason fade.

One lesson at a time. One day at a time. You've got this.

${SARAH}

P.S. How are you doing with the course? Reply and let me know — I'm here for you. 💕`,
    },
];

// ============================================
// 3. PAIN SEED SEQUENCE (Day 24-28)
// Set up why they need DFY
// ============================================

export const PAIN_SEED_SEQUENCE: NurtureEmail[] = [
    {
        id: "pain_day24",
        sequence: "pain_seed",
        day: 24,
        delayHours: 576,
        subject: "Re: honest question for you",
        content: `{{firstName}},

Can I ask you something honestly?

After you finish your certification... then what?

I ask because I've watched this pattern 1,247 times now:

Week 1 after certification: "I need a website first." Spend hours researching. Squarespace? Wix? WordPress? Get overwhelmed.

Week 2: "Maybe I'll just focus on intake forms." Download 12 templates from Pinterest. None designed for what you do. Try to Frankenstein them together.

Week 3: "I should probably have contracts and legal documents..." Google "coaching agreement template." Get scared by legal jargon. Pay $400 for something generic.

Week 4: "I'll just focus on social media to build an audience..." Stare at blank screen. Write something. Delete it. Post nothing.

Month 2: No website. No systems. No content. No clients. Lots of doubt.

Month 3: "Maybe this isn't for me..."

{{firstName}}, I'm not telling you this to scare you.

I'm telling you because I REFUSE to let this happen to you.

The certification gives you the KNOWLEDGE.

But knowledge without ACTION is just... potential.

I have something I'm working on that I think might help. I'll share more in a few days.

For now, just know: I see the gap. I'm building the bridge.

More soon.

${SARAH}`,
    },
    {
        id: "pain_day26",
        sequence: "pain_seed",
        day: 26,
        delayHours: 624,
        subject: "Re: two types of coaches",
        content: `{{firstName}},

I've noticed there are two types of coaches in the world:

**Type 1: The DIY Coach**
- Spends 200+ hours building their own website
- Creates intake forms from scratch (gets them wrong)
- Writes all their own copy (sounds like everyone else)
- Figures out legal documents alone (terrifying)
- Takes 6-12 months to launch
- Often burns out before seeing clients

**Type 2: The "Done-For-You" Coach**
- Gets everything built FOR them
- Launches within 48 hours
- Focuses all energy on actually HELPING clients
- Starts earning immediately
- Built on proven systems that work

Here's the thing:

Type 1 isn't "more dedicated" — they're just choosing a harder path.

Type 2 isn't "taking shortcuts" — they're being strategic with limited time and energy.

We all have the same 24 hours in a day.

The question is: Do you want to spend those hours building a website... or building a practice?

Something to think about. More soon.

${SARAH}`,
    },
    {
        id: "pain_day28",
        sequence: "pain_seed",
        day: 28,
        delayHours: 672,
        subject: "Re: a thought I had about you",
        content: `{{firstName}},

I was thinking about you last night.

About where you are in your journey. About what's ahead.

And I had this thought:

What if the "hard part" didn't have to be hard?

What if someone just... handed you everything?

- A professional website, already built
- Complete intake forms, designed for what you do
- Legal documents, ready to go
- Session templates, proven to work
- 30 days of content, written for you
- Email sequences, just copy and send
- Discovery call scripts, word-for-word

What if you could wake up tomorrow and just... START?

Not "someday."
Not "when I figure out the website."
Not "after I get everything organized."

TOMORROW.

{{firstName}}, I'm opening something special in 2 days.

Only a handful of spots. Everything I described above, built for you and handed to you.

Keep an eye on your inbox.

${SARAH}`,
    },
];

// ============================================
// 4. DFY LAUNCH SEQUENCE (Day 30-35)
// Open spots with scarcity
// ============================================

export const DFY_LAUNCH_SEQUENCE: NurtureEmail[] = [
    {
        id: "dfy_day30",
        sequence: "dfy_launch",
        day: 30,
        delayHours: 720,
        subject: "Re: opening 10 spots tomorrow",
        content: `{{firstName}},

Quick heads up:

Tomorrow morning, I'm opening 10 spots for our Complete Done-For-You Business Kit.

Everything you need to launch your practice — built and handed to you:

✓ Professional website (built within 48 hours)
✓ Complete intake system
✓ Legal documents bundle
✓ 10 protocol templates
✓ 31 email sequences
✓ 30 days of social content
✓ Discovery call script
✓ Pricing & packaging templates

Total value: $9,900+

Price: $397

ONE time. Everything delivered. Launch THIS week.

Only 10 spots because we physically build each website personally.

If you've been thinking "I want to do this but I don't know how to get everything set up"...

Tomorrow is your answer.

I'll send you the link in the morning.

${SARAH}`,
    },
    {
        id: "dfy_day31",
        sequence: "dfy_launch",
        day: 31,
        delayHours: 744,
        preventTag: "dfy_spots_open_sent",
        subject: "Re: your spot is ready",
        content: `{{firstName}},

It's time.

The Complete Done-For-You Business Kit is open — but only 10 spots.

Here's what you get:

🌐 Professional website — built for you in 48 hours
📋 Complete intake system — 7 forms and assessments
📝 Legal documents bundle — contracts, disclaimers, policies
🧬 Protocol templates — 10 major conditions
📧 Email sequences — 31 emails, ready to send
📱 30-day content kit — posts, carousels, hashtags
📊 Session management toolkit — notes, trackers
📚 Client education handouts — 20+ professional PDFs
📞 Discovery call script — word-for-word
💰 Pricing templates — packages structured and ready

**Total market value: $9,900+**
**Your investment: $397**

One payment. Everything delivered. Launch this week.

Claim your spot here: ${CTA_LINKS.dfyKit}

The last time I opened spots, they were gone in 48 hours.

Don't wait and wish you'd grabbed one.

${SARAH}

P.S. The website ALONE is worth more than $397. Get quotes from 3 designers and you'll see. You're getting that PLUS everything else. This is absurd value and we both know it.`,
        cta: {
            text: "Claim Your Spot",
            url: CTA_LINKS.dfyKit,
        },
    },
    {
        id: "dfy_day33",
        sequence: "dfy_launch",
        day: 33,
        delayHours: 792,
        preventTag: "dfy_7_spots_sent",
        subject: "Re: 7 spots left",
        content: `{{firstName}},

Just a quick update:

We're down to 7 spots.

3 went in the first 6 hours.

I wanted to share what Lisa said after she got her kit:

"Before this, I spent $8,000 trying to get my business set up. Hired 3 different freelancers. Wasted 4 months. Started over twice. If I'd had this kit from the beginning, I would have saved $7,600 and a year of my life."

{{firstName}}, you're going to launch your practice eventually.

The question is: Do you want to do it the hard way or the easy way?

Hard way: 4-6 months figuring it out. $3,000-10,000 in random freelancers. Lots of stress and second-guessing.

Easy way: $397. Everything done. Launch in 48 hours.

Claim one of the remaining spots: ${CTA_LINKS.dfyKit}

7 left as of this morning. May be fewer by the time you read this.

${SARAH}`,
        cta: {
            text: "Get Your DFY Kit",
            url: CTA_LINKS.dfyKit,
        },
    },
    {
        id: "dfy_day35",
        sequence: "dfy_launch",
        day: 35,
        delayHours: 840,
        preventTag: "dfy_final_sent",
        subject: "Re: closing tonight",
        content: `{{firstName}},

This is it.

The Done-For-You Business Kit closes tonight at midnight.

After that, I don't know when we'll open spots again. Could be months.

If you've been on the fence...
If you've been thinking "I'll figure it out myself"...
If you've been waiting for the "right time"...

This IS the right time.

$397 for everything you need to launch this week:

✓ Website built for you
✓ Intake system
✓ Legal docs
✓ Protocols
✓ Emails
✓ Content
✓ Scripts
✓ Templates

One client covers this investment. ONE.

And then you have the systems forever.

Last chance: ${CTA_LINKS.dfyKit}

Whatever you decide, I support you. But I didn't want you to miss this and regret it later.

With love,

${SARAH}

P.S. After tonight, this page disappears. Don't be the person who comes back in 6 months wishing they'd clicked yes today.`,
        cta: {
            text: "Claim Your Spot Before Midnight",
            url: CTA_LINKS.dfyKit,
        },
    },
];

// ============================================
// 5. MILESTONE SEQUENCE (Progress-Based)
// Pro Accelerator pitch at 50% and 100%
// ============================================

export const MILESTONE_UPSELL_EMAILS: Record<string, NurtureEmail> = {
    progress_50_pro: {
        id: "milestone_50_pro",
        sequence: "milestone",
        day: 0,
        delayHours: 0,
        preventTag: "pro_accelerator_50_sent",
        subject: "Re: you've proven you're serious",
        content: `{{firstName}},

I just saw you hit 50% in your certification.

This tells me something important about you:

You're not a dabbler. You're not "just browsing." You're actually DOING the work.

That's rare. Most people never make it this far.

And because you've proven you're serious, I want to tell you about something that's only offered to students who've reached this milestone:

**Pro Accelerator™**

This is the advanced track — where we go from "competent" to "DANGEROUS."

What's inside:
- 20 additional modules (120 lessons)
- Advanced Clinical Track — handle complex cases others can't
- Master Practitioner Track — become THE expert
- Practice & Income Path — actually get clients and scale
- 3 additional certifications included

Here's the truth:

Basic certification makes you capable of helping people.

Pro Accelerator makes you the practitioner who handles the $2,500-5,000 cases. The one doctors refer to. The one with a waitlist.

Normal price: $1,997

For you, right now, because you've shown you're serious:

**$297** (one-time)

This offer is only available to students who've hit 50%+ progress. It won't show up on our regular website.

See what's inside: ${CTA_LINKS.proAccelerator}

You've already done the hardest part — getting started and staying consistent.

Pro Accelerator is how you multiply everything you've already built.

${SARAH}

P.S. Michelle (49) was THIS close to skipping this. Now she's at $18,000/month handling complex cases she would have referred out before. The advanced training was the difference.`,
        cta: {
            text: "Unlock Pro Accelerator",
            url: CTA_LINKS.proAccelerator,
        },
    },

    completion_pro: {
        id: "milestone_100_pro",
        sequence: "milestone",
        day: 0,
        delayHours: 0,
        preventTag: "pro_accelerator_100_sent",
        subject: "Re: what's next for you?",
        content: `{{firstName}},

YOU DID IT! 🎉

I'm so, so proud of you. You completed your entire certification.

Take a moment to really feel this. You did something most people never do.

Now... what's next?

I want to be real with you:

What you've learned gives you a FOUNDATION. But if you want to:

- Handle the complex cases (the ones that pay $2,500-5,000)
- Get doctors and practitioners referring to YOU
- Build to $10,000-20,000/month
- Become THE expert in your area

You need the advanced training.

That's what Pro Accelerator™ is for.

20 modules. 120 lessons. Complete clinical AND business mastery.

AND the Complete Done-For-You Business Kit — so you can launch immediately.

For graduates only:

**Pro Accelerator: $297** (normally $1,997)
**DFY Business Kit: $397** (normally $997)
**BUNDLE BOTH: $597** (save $97)

You've proven you finish what you start. Now let's make sure you actually BUILD what you've learned.

See the options: ${CTA_LINKS.proAccelerator}

Whatever you decide, I'm proud of you. But don't stop at the starting line — you've got so much further to go.

${SARAH}

P.S. Karen (55, RN) went from $72K/year nursing to $180K/year coaching after completing Pro Accelerator. The certification gave her the foundation. The advanced training gave her the income.`,
        cta: {
            text: "See Your Options",
            url: CTA_LINKS.proAccelerator,
        },
    },
};

// ============================================
// ALL SEQUENCES COMBINED
// ============================================

export const ALL_NURTURE_EMAILS = {
    story: STORY_SEQUENCE,
    proof: PROOF_SEQUENCE,
    pain_seed: PAIN_SEED_SEQUENCE,
    dfy_launch: DFY_LAUNCH_SEQUENCE,
    milestone: MILESTONE_UPSELL_EMAILS,
};

// ============================================
// SCHEDULE SUMMARY
// ============================================

export const NURTURE_SCHEDULE = {
    // Story Arc (Day 1-10)
    story: [1, 3, 5, 7, 10],

    // Success Stories (Day 12-21)
    proof: [12, 15, 18, 21],

    // Pain Seed (Day 24-28)
    pain_seed: [24, 26, 28],

    // DFY Launch (Day 30-35)
    dfy_launch: [30, 31, 33, 35],

    // Milestones (triggered by progress)
    milestone: ['50%', '100%'],
};

// ============================================
// TEMPLATE VARIABLES
// ============================================

export const TEMPLATE_VARIABLES = {
    '{{firstName}}': 'Student first name',
    '{{certificationName}}': 'Name of certification (e.g., "Functional Medicine Certification")',
    '{{dashboardUrl}}': 'URL to student dashboard',
    '{{courseUrl}}': 'URL to current course',
};
