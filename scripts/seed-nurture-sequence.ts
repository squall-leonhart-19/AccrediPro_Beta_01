import prisma from "../src/lib/prisma";

// 17 NURTURE SEQUENCE EMAILS
const EMAIL_VARIANTS = [
  {
    id: 1,
    name: "Email 1: Welcome + Mini Diploma",
    day: 0,
    subject: "Re: your free Mini Diploma access",
    content: `{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

**Your Free Mini Diploma in Functional Medicine is ready** - you can start right now if you want.

But before you dive in, I need to tell you something important:

**This isn't like other freebies.**

You know those PDFs that sit in your downloads folder collecting digital dust? Those "free courses" that are really just 45-minute sales pitches?

This isn't that.

This is **real training**. The same foundational content our certified practitioners learned. By the end, you'll understand root-cause thinking in a way that changes how you see health forever.

You'll also earn an actual credential - a Mini Diploma you can be proud of.

**Here's what I want you to do:**

Log into the platform and start Lesson 1. It takes about 20 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days to see how you're doing. And {{firstName}} - if you have ANY questions, just hit reply. I read and respond to every single email.

This is the beginning of something big.

Sarah

P.S. Check your messages inside the platform - I've left you a personal voice note. I want you to hear my voice before we really get started.`,
  },
  {
    id: 2,
    name: "Email 2: Sarah's Story",
    day: 1,
    subject: "Re: my story (thought you'd relate)",
    content: `{{firstName}},

Can I tell you something I don't share with everyone?

**The Kitchen Floor Moment**

It was 11pm on a Tuesday. My daughter was finally asleep. I was sitting on my kitchen floor, bills spread around me, calculator in hand.

The numbers didn't add up. Again.

I'd just worked a 12-hour day at a job that was slowly killing me. Gave the same generic advice I'd given a hundred times: "Eat more vegetables. Drink more water. Try to reduce stress."

I knew it wasn't helping anyone. And I couldn't even take my own advice - I was exhausted, inflamed, running on coffee and anxiety.

**I looked at my reflection in the microwave door and didn't recognize myself.**

When did I become this tired, defeated person? When did "helping people" start feeling like a lie I told myself to get through the day?

Have you ever felt that way, {{firstName}}? That gap between who you are and who you wanted to become?

**The Moment Everything Changed**

That night, I couldn't sleep. I started researching at 2am. Functional medicine. Root-cause health. A different approach.

And something clicked.

For the first time, I understood WHY I felt so stuck. Why my clients weren't getting better. Why the advice I'd been giving was like putting band-aids on broken legs.

**It wasn't that I was bad at my job. I just didn't have the right tools.**

Fast forward three years: I work from home. I set my own hours. I help people who've been dismissed by every doctor they've seen. And my daughter? She tells her friends her mom "helps people feel better."

That's worth everything.

**I'm telling you this because...**

If you're where I was - tired, stuck, wondering if there's more - I need you to know: there is.

The Mini Diploma you're taking right now? It's the first step on the same path I walked.

So tell me, {{firstName}} - what made you curious about functional medicine? What's YOUR kitchen floor moment?

Hit reply. I want to hear your story.

Sarah

P.S. I still have that microwave. Every time I see my reflection in it now, I smile. Crazy how much can change.`,
  },
  {
    id: 3,
    name: "Email 3: Why generic advice fails",
    day: 3,
    subject: "Re: why the usual advice doesn't work",
    content: `{{firstName}},

I need to tell you about Linda.

She came to me last year. 52 years old. Exhausted for three years straight. Brain fog so bad she'd forget words mid-sentence.

**She'd seen four doctors.** They all said the same thing:

"Your labs are normal."
"Try to sleep more."
"Maybe it's just stress."
"Have you considered antidepressants?"

By the time she found me, she was starting to believe them. Maybe it WAS all in her head. Maybe this was just what 52 felt like.

**It wasn't.**

Within 20 minutes of looking at her case through a functional lens, I found three things her doctors missed. Not because they were bad doctors - because they weren't trained to look.

Six weeks later, Linda texted me: **"I feel like myself again. I forgot what that even felt like."**

**Here's the thing, {{firstName}}:**

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Reduce stress" doesn't help when the stress is coming from inside (inflammation, blood sugar, hormones).
"Exercise more" doesn't help when your adrenals are shot and exercise makes you worse.

The real questions are:
- **Why** is she exhausted? (not "she's exhausted, give her caffeine")
- **What's driving** the inflammation? (not "here's an anti-inflammatory")
- **Where** is the breakdown happening? (not "let's mask the symptoms")

This is what you're learning in your Mini Diploma. This is the difference between surface-level wellness advice and **root-cause practice**.

Have you started yours yet?

If not, today's a good day. Even the first lesson will change how you see health forever.

**Quick question:** Have you ever had a "Linda moment" - where you KNEW something was wrong but couldn't figure out what? Reply and tell me about it.

Sarah

P.S. Linda now refers me clients. Her exact words: "I tell everyone - the doctors kept me sick, Sarah made me well."`,
  },
  {
    id: 4,
    name: "Email 4: The discovery",
    day: 5,
    subject: "Re: the training I mentioned",
    content: `{{firstName}},

Remember the kitchen floor moment I told you about?

There's a part I didn't share.

**The 3am Discovery**

That night, after crying on my kitchen floor, I couldn't sleep. I went down a rabbit hole - functional medicine, integrative health, root-cause approaches.

At 3am, I found a training video. Some woman I'd never heard of, talking about how she went from burned-out health coach to running a thriving practice from home.

I almost clicked away. "Yeah right," I thought. "Another scam."

But something made me keep watching.

She talked about how the gut connects to the brain. How hormones affect everything. How standard blood tests miss 80% of what's actually happening in the body.

**And suddenly, I understood why I'd been failing.**

It wasn't that I was bad at helping people. I just didn't have the right training. I was trying to solve advanced problems with beginner tools.

That video changed my life.

**Now I've Made One For You**

It's called the Graduate Training. 45 minutes. No fluff.

I walk you through:
- How practitioners like you are building **real income** doing this work
- The exact **certification path** from curious to confident
- What separates those who succeed from those who stay stuck
- **Real numbers** - what our graduates actually earn

This isn't a pitch disguised as training. It's the same roadmap I wish someone had shown me on that kitchen floor night.

**One thing I ask:**

Watch it when you can actually focus. Not while cooking dinner or half-watching TV. This deserves your full attention.

And after you watch it, hit reply and tell me what you think. I want to hear your honest reaction.

Sarah

P.S. If you haven't finished your Mini Diploma yet, do that first. The Graduate Training will make more sense once you've got that foundation.`,
  },
  {
    id: 5,
    name: "Email 5: Diane's story",
    day: 7,
    subject: "Re: Diane's story (burned-out nurse)",
    content: `{{firstName}},

I want to tell you about Diane.

Not the Instagram highlight reel. The real story.

**40 Years, One Breaking Point**

Diane was a nurse for 40 years. Forty. Years.

She'd held dying patients' hands. Comforted terrified families. Worked double shifts during the pandemic while her own health fell apart.

She was accomplished. Respected. And completely, utterly burned out.

The day she called me, she'd just worked a 14-hour shift. Her voice was hoarse. She said:

**"Sarah, I love helping people. But I can't do this anymore. The 5am alarms. The 2-hour commutes. The bureaucracy that keeps me from actually HELPING anyone. I'm 62 years old and I'm tired."**

Then she said something that broke my heart:

"But what else can I do? I'm too old to start over."

Have you ever felt that, {{firstName}}? Too far down one path to change direction?

**The Question That Changed Everything**

I asked her: "Diane, what if 'starting over' wasn't the right frame? What if you're not leaving nursing behind - you're taking everything you know and finally using it properly?"

She got quiet.

**3 Months Later**

Diane certified with us. Started seeing clients from her spare bedroom. First month: $2,400. Second month: $4,100. By month six: $8,000.

But here's what she told me recently that made me tear up:

**"Sarah, for 40 years I worked in healthcare. But I never felt like a healer until now."**

Now she works 25 hours a week. No commute. No 5am alarms. Her granddaughter asks her to explain "how the body works" - and she has time to answer.

**I'm sharing this because...**

If you're worried you're too old, too late, too far down another path - you're not.

Diane thought she was too old at 62. Now she's 64 and having the best years of her professional life.

The only thing standing between where you are and where you want to be is the right training and the decision to start.

You've already started. You're in the Mini Diploma. You're reading these emails. That takes courage.

What's your next step?

Sarah

P.S. Diane told me I could share her story. She wants other nurses to know there's another way. If you're in healthcare and feeling stuck, hit reply - I have something specific for you.`,
  },
  {
    id: 6,
    name: "Email 6: What we actually teach",
    day: 10,
    subject: "Re: what you'll actually learn",
    content: `{{firstName}},

I get this question a lot:

"Sarah, what do I ACTUALLY learn in the certification?"

Fair question. Let me break it down.

**The 6 Pillars We Cover:**

1. **Gut Health & the Microbiome**
Not just "eat more fiber." We're talking SIBO, leaky gut, the gut-brain axis, and how to actually test and interpret results.

2. **Hormones Beyond the Basics**
Thyroid, adrenals, sex hormones - and how they all talk to each other. Why you can't fix one without understanding the others.

3. **Blood Chemistry Analysis**
How to look at standard labs and see what doctors miss. The functional ranges that matter. Red flags that require referral.

4. **Nutrition as Medicine**
Not generic meal plans. Targeted nutrition protocols for specific conditions. What actually works vs. wellness trends.

5. **Toxins & Detoxification**
Environmental factors most practitioners ignore. How to safely support detox pathways without making things worse.

6. **The Business of Practice**
How to actually get clients. Pricing. Positioning. Building a practice that supports your life, not consumes it.

**Here's What's Different:**

Most programs teach you theory. We teach you what to DO.

Every module has case studies. Real protocols. The exact questions to ask, tests to consider, and frameworks to follow.

You'll finish knowing not just WHAT functional medicine is, but HOW to practice it.

**Quick story:**

One of our graduates, Rachel, told me: "I've done other certifications. They made me feel smart but not confident. This one made me feel ready."

That's the goal.

If you're wondering whether this is right for you - have you finished your Mini Diploma yet? That's the best way to test-drive our teaching style.

Any questions? Hit reply. I'm here.

Sarah`,
  },
  {
    id: 7,
    name: "Email 7: FAQ - honest answers",
    day: 12,
    subject: "Re: questions about the certification",
    content: `{{firstName}},

Let me answer the questions people are afraid to ask.

**"How long does it take?"**

The certification is self-paced. Most students finish in 4-6 months studying a few hours per week. Some go faster, some slower. Life happens - we get it.

**"Do I need a medical background?"**

No. We have nurses, health coaches, nutritionists, yoga teachers, personal trainers - even complete career changers. The training assumes no prior knowledge and builds from foundations.

**"Can I actually make money doing this?"**

Yes. Our graduates charge $150-500 per session. Many build to $5-10k/month within their first year. Some replace full-time incomes. Results vary based on effort, but the opportunity is real.

**"Is this recognized?"**

We're accredited and our credential is respected in the functional medicine space. You'll be qualified to see clients, develop protocols, and practice professionally.

**"What if I'm not good with tech?"**

If you can use email, you can do this. The platform is simple. We have tutorials for everything. And our support team is genuinely helpful (not just a chatbot).

**"What if I fail?"**

You won't. The program is designed for success. Pass rates are high. And if you're struggling, we help you - we don't just watch you fail.

**"Is this a scam?"**

I get why you might wonder. The internet is full of garbage programs. Here's the difference: we have hundreds of graduates who've built real careers. Real testimonials. Real results. I'll introduce you to some if you want.

**The question you should actually be asking:**

"What's it costing me to NOT move forward?"

Every month you wait is another month in the same place.

Have more questions? Hit reply. No question is too basic or too skeptical.

Sarah

P.S. If you haven't finished your Mini Diploma, do that first. It'll answer a lot of these questions better than I can.`,
  },
  {
    id: 8,
    name: "Email 8: The investment",
    day: 14,
    subject: "Re: the certification investment",
    content: `{{firstName}},

Let's talk money.

The full FMCP certification is $2,997.

I know that's not nothing. So let me break down what you're actually getting:

**What's Included:**

- 12 comprehensive modules with video lessons
- Case studies and practical protocols
- Lifetime access to all materials
- Private community of practitioners
- Monthly live Q&A calls (recorded if you miss them)
- Certificate upon completion
- Business-building bonus training
- 1-year of continued support

**The Math:**

If you see just 6 clients at $150 each, you've covered the investment. That's it. Six clients.

Most of our graduates get their first paying client within 60 days of starting.

**Payment Options:**

- Pay in full: $2,997 (best value)
- Payment plan: 6 monthly payments of $550

We want this accessible. The payment plan exists because I remember being on that kitchen floor, not knowing how I'd afford anything extra.

**What This Investment Gets You:**

A new career path. Flexible income. The ability to help people in ways that actually matter. Freedom from burnout, commutes, and bosses who don't get it.

**What Staying Stuck Costs You:**

Another year in the same place. Same frustrations. Same wondering "what if."

I can't make this decision for you, {{firstName}}. But I can tell you: the practitioners who move forward are the ones who stop waiting for the "perfect time."

The perfect time is a myth. There's just now.

Interested? Reply and I'll send you the enrollment link with all the details.

Sarah

P.S. If the investment is a genuine barrier, reply and tell me. I may be able to help.`,
  },
  {
    id: 9,
    name: "Email 9: Urgency - why now matters",
    day: 17,
    subject: "Fwd: something I need to tell you",
    content: `{{firstName}},

I need to be honest with you about something.

**Every Week, People Tell Me:**

"I'll do it next month."
"When things calm down."
"After the holidays/summer/kids go back to school."
"Once I have more saved."

And I get it. Life is busy. Money is tight. Change is scary.

But here's what I've noticed after years of doing this:

**"Later" usually means "never."**

Not because people don't want it. But because later never comes. There's always another reason to wait.

**The People Who Succeed?**

They're not more talented. Not smarter. Not richer.

They just decided to start before they felt ready.

Diane (the nurse I told you about) enrolled while still working full-time. She found hours she didn't know she had.

Rachel enrolled while raising three kids. She studied during nap times and after bedtime.

Maria enrolled while dealing with her own health issues. The training actually helped her understand what was going on.

**None of them had perfect circumstances. They just started.**

**What's Actually Holding You Back?**

Is it money? We have payment plans.
Is it time? The program is self-paced.
Is it fear? That's the only real obstacle. And fear doesn't go away by waiting - it goes away by doing.

I've watched too many people stay stuck because they were waiting for permission they already had.

You don't need anyone's permission to change your life.

You just need to decide.

Are you ready?

Sarah

P.S. The Graduate Training I mentioned earlier - have you watched it yet? If not, that's your next step. No commitment, just information.`,
  },
  {
    id: 10,
    name: "Email 10: Objection handling",
    day: 20,
    subject: "Re: the reasons people don't enroll",
    content: `{{firstName}},

Can I be real with you?

After 7+ years of doing this, I've heard every reason not to enroll.

Some are valid concerns that we can address. Others are fear dressed up as logic.

Let me go through the most common ones:

**"I don't have time."**

The program is self-paced. Students average 5-7 hours per week. That's one less Netflix binge. One less hour scrolling. The time exists - it's about priorities.

**"I can't afford it."**

I understand tight finances. But consider: the certification pays for itself with just a few clients. And staying stuck has its own cost - in income, fulfillment, and opportunities.

**"I'm not sure I can do this."**

Imposter syndrome is real. But here's the truth: if you can learn, you can do this. We've certified people with no medical background who now run successful practices.

**"What if it doesn't work for me?"**

Valid concern. That's why we have the Mini Diploma - so you can experience our teaching before committing. And our graduate success rate speaks for itself.

**"I need to think about it more."**

Sometimes that's true. But often, "thinking about it" is just delayed action. What specific information would actually help you decide?

**"My spouse/family won't support it."**

Have a real conversation with them. Show them the numbers. Explain the vision. Most resistance comes from not understanding the opportunity.

**Here's My Challenge:**

Write down your specific concern. The real one. Then hit reply and send it to me.

I'll give you an honest response. No sales pressure, just truth.

Because either this is right for you, and we should address what's holding you back. Or it's not right for you, and I'd rather you know that now.

What's really stopping you?

Sarah`,
  },
  {
    id: 11,
    name: "Email 11: Success story roundup",
    day: 23,
    subject: "Re: what other students are saying",
    content: `{{firstName}},

I want to introduce you to some people.

Not the "perfect success stories." Real people with real results.

**Jennifer - Former Teacher**

"I was burned out after 15 years in the classroom. I didn't know what else I could do. Now I work with clients from my home office, set my own hours, and make more than I did teaching. The kids I help with gut issues thank me more than any student ever did."

**Maria - Career Changer at 55**

"Everyone told me I was too old to start something new. I enrolled anyway. Within 8 months, I had a full client roster and a waiting list. Age isn't a barrier - it's an asset. My life experience is what makes me good at this."

**Rachel - Busy Mom of 3**

"I did the training during nap times and after bedtime. Was it hard? Yes. Was it worth it? 1000%. I now make $6k/month working 20 hours a week. I'm present for my kids AND building something meaningful."

**David - The Skeptic**

"I almost didn't enroll because I'd been burned by other programs. But something about this one felt different. The content is deep. The community is real. I paid off my investment in the first 2 months."

**What They Have in Common:**

- None had "perfect" circumstances
- All felt scared before starting
- All took action anyway
- All say it was the best decision they made

**What's Your Story Going to Be?**

A year from now, you could be one of these people. Or you could be exactly where you are now.

The choice is yours.

Sarah

P.S. If you want to talk to any of these graduates directly, let me know. They're happy to share their experience.`,
  },
  {
    id: 12,
    name: "Email 12: The crossroads",
    day: 26,
    subject: "Re: the decision in front of you",
    content: `{{firstName}},

You're at a crossroads.

I know that sounds dramatic. But it's true.

**Path 1: Stay Where You Are**

Keep doing what you're doing. Same income. Same frustrations. Same wondering "what if."

A year from now, nothing changes. You're older, but not further along.

**Path 2: Take the Leap**

Enroll in the certification. Put in the work. Build something new.

A year from now, you're a certified practitioner. You have clients. You're making money doing work that matters.

**There Is No Path 3**

There's no option where you don't decide. Inaction IS a decision. It's choosing Path 1 by default.

**What's Keeping You on Path 1?**

Fear? Doubt? Money? Time?

All of those are solvable. Every single one.

But they only get solved if you're willing to face them.

**The Truth About Change:**

It's never comfortable. Never convenient. Never "the right time."

The people who transform their lives aren't fearless - they're afraid AND they do it anyway.

**So Here's My Question:**

Which path are you choosing?

If it's Path 2, reply to this email and say "I'm ready." I'll send you everything you need to get started.

If it's Path 1, that's okay too. But be honest with yourself about why.

Sarah

P.S. I chose Path 2 on that kitchen floor night. Terrified. Uncertain. But unwilling to stay stuck. Best decision I ever made.`,
  },
  {
    id: 13,
    name: "Email 13: Payment plan details",
    day: 28,
    subject: "Re: making it affordable",
    content: `{{firstName}},

If money is what's holding you back, let me help.

**The Full Picture:**

Certification: $2,997

**Option 1: Pay in Full**
One payment of $2,997
Best value - you save on payment plan fees

**Option 2: 6-Month Payment Plan**
6 payments of $550
Total: $3,300
Makes it accessible without breaking the bank

**Option 3: Extended Plan (Limited)**
12 payments of $290
Total: $3,480
For those who need maximum flexibility

**Let's Do the Math:**

Monthly payment (6-month plan): $550
Average client session fee: $150-250

You need 3-4 clients per month to cover your payment.
Most students get their first client within 60 days.
By the time you're done paying, you're already profitable.

**Why We Offer Payment Plans:**

Because I remember being broke. I remember counting coins for groceries. I remember wanting something better but not knowing how to afford it.

If the certification can change your life (and it can), money shouldn't be what stops you.

**One Thing to Consider:**

The payment plan means you start learning NOW while paying over time. By month 3, you could be seeing clients while still in training.

Your future self is paying for a certification that's already working.

**Ready to Choose?**

Reply with "payment plan" and I'll send you the enrollment link with all options.

Sarah

P.S. If even the payment plan is a stretch, tell me. I may be able to work something out. I'd rather find a way than have you miss this opportunity.`,
  },
  {
    id: 14,
    name: "Email 14: Deadline approaching",
    day: 30,
    subject: "Re: enrollment closing soon",
    content: `{{firstName}},

I need to let you know - enrollment for this cohort closes soon.

**Why Cohorts?**

We run the certification in groups so students go through together. You get live Q&A calls with your cohort. Community support. Accountability.

When enrollment closes, it closes. The next cohort won't start for another few months.

**What This Means For You:**

If you've been thinking about this, now is decision time.

Not "I'll decide later." Now.

**Quick Recap of What You Get:**

- 12 comprehensive training modules
- Case studies and practical protocols
- Lifetime access to all materials
- Private community membership
- Monthly live Q&A calls
- Certificate upon completion
- Business-building bonus training
- 1-year continued support

**Investment:**
- Pay in full: $2,997
- Payment plan: 6 x $550

**What Happens If You Wait:**

You'll miss this cohort. You'll wait months for the next one. And honestly? If you don't act now, you probably won't act later.

I've seen it too many times. The energy fades. Life gets in the way. The window closes.

**If You're Ready:**

Reply "I'm in" and I'll send you the enrollment link.

If you have last-minute questions, reply with those instead. I'm here.

Sarah

P.S. Remember Diane? She almost waited for the next cohort. Last-minute decision to enroll changed her life. Don't wait.`,
  },
  {
    id: 15,
    name: "Email 15: Last chance",
    day: 32,
    subject: "Re: last day to join us",
    content: `{{firstName}},

This is it.

Enrollment closes tonight at midnight.

**I'm Not Going to Pressure You.**

Either this is right for you, or it isn't.

But I want to make sure you're making this decision clearly - not from fear, not from inertia, not from "I'll do it later."

**Ask Yourself:**

- Do you want to help people at a deeper level?
- Do you want flexible income you control?
- Do you want to finally use your passion for health professionally?
- Do you want to stop settling for "good enough"?

If the answer is yes, what are you waiting for?

**If Money Is the Issue:**

We have payment plans. Reply and let's figure it out.

**If Time Is the Issue:**

You have the same 24 hours as everyone else. It's about priorities.

**If Fear Is the Issue:**

Feel the fear. Enroll anyway. That's literally how every success story starts.

**After Tonight:**

Enrollment closes. The cohort begins without you. The next opportunity is months away.

And you'll wonder what would have happened if you'd just said yes.

**Don't Let That Be Your Story.**

Reply "I'm ready" and let's do this.

Sarah

P.S. Whatever you decide, I'm grateful you've been reading these emails. If this isn't your time, I hope our paths cross again when it is.`,
  },
  {
    id: 16,
    name: "Email 16: Post-deadline check-in",
    day: 35,
    subject: "Re: checking in on you",
    content: `{{firstName}},

The cohort started, but I wanted to check in on you.

**No Pressure. Just Curiosity.**

What happened? What held you back?

I'm asking because I genuinely want to understand - not to convince you, but to know.

Was it:
- Money? (Tell me more - maybe we can figure something out)
- Timing? (When would be better?)
- Doubt? (About what specifically?)
- Something else? (I'm all ears)

**Here's What I've Learned:**

The people who reply to this email usually end up enrolling in a future cohort. Not because I convince them - because getting their concerns out in the open helps them see clearly.

**And If You've Moved On:**

That's okay too. Maybe this isn't your path. Maybe the timing really isn't right. Maybe something better is coming.

I just don't want you to fade away without understanding why.

**So Hit Reply.**

One sentence is fine. Tell me what's really going on.

I read every response.

Sarah

P.S. The Mini Diploma is still yours. If you haven't finished it, there's no expiration. Maybe completing it will clarify things.`,
  },
  {
    id: 17,
    name: "Email 17: Future opportunity",
    day: 45,
    subject: "Re: something coming up",
    content: `{{firstName}},

Quick note.

We're opening enrollment for the next cohort soon.

I'm not going to send you 15 emails about it. But I wanted you to know - if you've been thinking about this, the opportunity is coming back around.

**What's Changed Since We Last Talked?**

Maybe your circumstances are different now.
Maybe you've had time to think.
Maybe you're more ready than you were.

Or maybe nothing's changed, and that's okay too.

**Either Way:**

When enrollment opens, I'll let you know. One email. Clear information. No pressure.

If you want to be first to know (with any early-bird bonuses), reply "interested" and I'll make sure you're on the list.

If you want me to stop emailing you about the certification, reply "stop" and I will. No hard feelings.

**Until Then:**

Keep learning. Keep growing. The Mini Diploma is still there if you want to finish it.

And I'm still here if you have questions.

Sarah

P.S. Whatever you decide, I hope you find the path that's right for you. Sometimes it's with us, sometimes it's somewhere else. But I hope you find it.`,
  },
];

async function main() {
  console.log("Creating nurture sequence...");

  // First, find or create the nurture-30-day marketing tag
  let nurtureTag = await prisma.marketingTag.findFirst({
    where: {
      OR: [
        { slug: "nurture-30-day" },
        { name: "nurture-30-day" },
      ],
    },
  });

  if (!nurtureTag) {
    nurtureTag = await prisma.marketingTag.create({
      data: {
        name: "nurture-30-day",
        slug: "nurture-30-day",
        category: "STAGE",
        description: "30-day nurture email sequence",
        color: "#722F37",
      },
    });
    console.log("Created nurture-30-day tag");
  } else {
    console.log("Found existing nurture-30-day tag");
  }

  // Check if sequence already exists
  let sequence = await prisma.sequence.findFirst({
    where: {
      OR: [
        { slug: "nurture-30-day" },
        { name: { contains: "nurture", mode: "insensitive" } },
      ],
    },
  });

  if (sequence) {
    console.log("Sequence already exists:", sequence.name);
    // Delete existing emails to replace them
    await prisma.sequenceEmail.deleteMany({
      where: { sequenceId: sequence.id },
    });
    console.log("Cleared existing emails");
  } else {
    // Create the sequence
    sequence = await prisma.sequence.create({
      data: {
        name: "30-Day Nurture Sequence",
        slug: "nurture-30-day",
        description: "17-email nurture sequence for new Mini Diploma students",
        triggerType: "TAG_ADDED",
        triggerTagId: nurtureTag.id,
        isActive: true,
      },
    });
    console.log("Created sequence:", sequence.name);
  }

  // Create all the emails
  for (let i = 0; i < EMAIL_VARIANTS.length; i++) {
    const email = EMAIL_VARIANTS[i];
    await prisma.sequenceEmail.create({
      data: {
        sequenceId: sequence.id,
        customSubject: email.subject,
        customContent: email.content,
        delayDays: email.day,
        delayHours: 0,
        order: i,
        isActive: true,
      },
    });
    console.log(`Created email ${i + 1}: ${email.name} (Day ${email.day})`);
  }

  console.log("\n✅ Nurture sequence created successfully!");
  console.log(`Total emails: ${EMAIL_VARIANTS.length}`);
  console.log(`Sequence ID: ${sequence.id}`);
  console.log(`Trigger tag: ${nurtureTag.name}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
