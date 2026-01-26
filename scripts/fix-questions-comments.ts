import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Different Sarah answer styles - storytelling, direct, emotional, practical
const SARAH_ANSWERS: { keywords: string; answers: string[] }[] = [
  {
    keywords: "earn|income|money|salary|afford|997|invest",
    answers: [
      `Oh I LOVE this question because I get to share some real numbers!

Let me tell you about Maria. She joined us 14 months ago as a burned-out nurse making $68K. She was skeptical - I mean, who wouldn't be?

Fast forward to today: Maria made $14,200 last month working 4 days a week from her home office. She took her kids to school every morning and picked them up every afternoon. No more 12-hour shifts. No more missing soccer games.

But here's the thing - Maria didn't get there overnight. Month 1? She made $0. Month 2? $800. Month 3? $2,400. It built from there.

The $997 investment? She made it back by her 6th week in practice.

What I tell everyone: this isn't a get-rich-quick thing. It's a build-something-real thing. The practitioners who succeed are the ones who show up consistently, even when it's hard.

Does that help put things in perspective? Happy to share more specific examples if you want! 💚`,

      `Real talk time.

I'm not going to give you some polished marketing answer. You deserve honesty.

Some graduates make $3K/month part-time. Some make $20K/month full-time. Some make $500/month because they're barely trying. The range is HUGE.

What determines where you fall?
- How many hours you actually put in
- Whether you follow the business training (most people skip it - don't be most people)
- Your niche choice
- How comfortable you get with sales conversations

The $997? Here's how I think about it: One client at $300/session for 4 sessions = $1,200. Investment recouped.

But if you're not going to put in the work? Save your money. Seriously. This only works if YOU work.

What's your actual goal with this? That'll help me give you a more specific answer.`,

      `Can I share something personal?

When I started, I charged $75 per session. SEVENTY-FIVE DOLLARS. I was terrified to charge more.

My mentor (who I'm forever grateful for) looked at my pricing and said "Sarah, you're telling clients your expertise is worth less than a nice dinner out. Is that true?"

It wasn't true. And your expertise won't be worth $75 either.

Our graduates typically start around $150-200/session and within 6 months move to $300-400. The ones who implement the group program model? They're hitting $5K-8K per group.

The investment question always comes down to this: Do you believe in yourself enough to bet on yourself?

I believed in myself when I had no proof it would work. Now I have plenty of proof. The question is whether you're ready to create your own proof.

What's really holding you back? Let's talk about it.`
    ]
  },
  {
    keywords: "medical background|degree|RN|MS|credentials|letters|nurse|doctor",
    answers: [
      `Okay, story time!

Jennifer was a kindergarten teacher for 22 years. TWENTY-TWO YEARS of finger painting and ABCs. Zero medical anything.

She joined feeling like a complete fraud. "Who am I to talk about health?" she kept asking.

Know what happened? Her first three clients were ALL teachers. Why? Because she UNDERSTOOD their world - the exhaustion, the getting sick constantly from kids, the stress of parent conferences, the emotional labor.

Her "lack" of medical background? It became her STRENGTH. She wasn't talking down to people with fancy terminology. She was speaking their language.

She now has a 6-month waitlist. Teachers fly in from other states to work with her.

The letters after your name don't heal people. Connection does. Understanding does. And you have DECADES of life experience that creates connection.

What's your background? I bet there's a goldmine there you haven't seen yet.`,

      `Short answer: No.

Longer answer: Some of our most successful practitioners have ZERO medical background. And honestly? Sometimes that's an advantage.

Here's why: People with medical backgrounds often have to UNLEARN the "treat symptoms" mentality. They've been trained to think a certain way. It can actually slow them down.

You? You're a blank slate. You'll learn functional medicine the RIGHT way from day one.

We literally assume you know nothing when you start. The curriculum builds from ground zero. If you can read and follow instructions, you can do this.

The real question isn't "Am I qualified?" - it's "Am I willing to learn?"

Are you?`,

      `I need to be direct with you because I think you're selling yourself short.

Your life experience IS a credential. Your struggles ARE qualifications. Your empathy IS expertise.

Clients don't hire letters. They hire PEOPLE. People who understand them. People who've been where they are. People who genuinely care.

I've seen PhDs fail miserably at this because they couldn't connect with real humans. I've seen high school grads build six-figure practices because they truly SAW their clients.

Stop asking if you're qualified. Start asking: "Do I care enough about helping people to learn what I need to learn?"

If the answer is yes, you're more qualified than most.`
    ]
  },
  {
    keywords: "time|hours|busy|schedule|fit|balance|week|kids|family|work",
    answers: [
      `Okay, let me introduce you to Denise.

Denise is a single mom of FOUR kids. Ages 6, 9, 12, and 15. She works full-time as an office manager. She's also caring for her aging mother who lives with her.

When Denise told me she wanted to do this program, I honestly wondered how she'd manage. But she said something I'll never forget:

"Sarah, I've been putting everyone else first for 20 years. This is the first time I'm investing in ME. I'll figure it out."

And she did.

She studied during her lunch breaks - 30 minutes a day. She did audio lessons while cooking dinner. She took notes on her phone during her kids' sports practices.

It took her 11 months instead of 6. So what? She finished. She's now seeing clients on Saturday mornings and two evenings a week. She made $3,400 last month.

The time exists. It's hiding in the margins of your day. The question is: Is this important enough to find it?`,

      `Real numbers for a real life:

- 30 min/day = 3.5 hours/week = finish in ~10 months
- 1 hour/day = 7 hours/week = finish in ~5 months
- 2 hours/day = 14 hours/week = finish in ~3 months

That's it. That's the math.

Most lessons are 15-20 minutes. You can do one lesson while your coffee brews. One while you're on the treadmill. One during your kid's soccer practice.

It's not about finding a magic 3-hour block. It's about finding 20 minutes, six times.

The audio format means you can "study" while doing dishes, commuting, walking the dog, folding laundry. Your ears are free even when your hands aren't.

What does your typical day look like? I can help you find the hidden pockets.`,

      `I'm going to push back on something.

"I don't have time" usually means "This isn't a priority yet."

And that's OKAY. Maybe right now isn't the right time. Maybe six months from now is better. I'd rather you wait and succeed than start and quit.

But if you're feeling called to this - if it keeps coming back to you - then "I don't have time" might just be fear talking.

I finished my certification while working 50+ hours a week, going through a divorce, and raising two teenagers. I'm not saying that to brag. I'm saying: I know what "busy" feels like. It's still possible.

What would you have to give up to make this work? TV? Social media scrolling? Sleep (temporarily)? Is this dream worth that sacrifice?

Only you can answer that.`
    ]
  },
  {
    keywords: "imposter|confidence|ready|scared|afraid|nervous|doubt|who am i",
    answers: [
      `Can I tell you a secret?

I still get imposter syndrome. ME. After 10+ years. After helping hundreds of practitioners. After building a multi-six-figure practice.

Last month I was invited to speak at a conference. My first thought? "They must have made a mistake. They meant to invite someone else."

That voice never fully goes away. The difference is now I recognize it for what it is: my brain trying to keep me safe by keeping me small.

You know what's on the other side of imposter syndrome? EVERYTHING you want.

Every successful person I know has felt exactly what you're feeling. The ones who succeed aren't the ones without fear - they're the ones who act DESPITE the fear.

You're not broken. You're not uniquely unqualified. You're just human.

What specifically is your imposter brain telling you? Let's shine some light on that monster.`,

      `Let me ask you something that might sound weird:

What if your imposter syndrome is actually a GOOD sign?

Think about it. The people who should be worried are the ones who think they already know everything. The ones with zero self-doubt. Those are the dangerous practitioners.

Your doubt? It means you care. It means you want to do this RIGHT. It means you'll actually pay attention, study hard, and put clients first.

I don't want confident students. I want humble students who are hungry to learn.

You being scared doesn't disqualify you. It might actually be your greatest qualification.`,

      `I'm going to tell you what my mentor told me when I was drowning in self-doubt:

"Sarah, confidence isn't something you FIND. It's something you BUILD. One tiny action at a time."

You don't need to feel confident to start. You need to start to feel confident.

First lesson → small confidence boost
First quiz passed → another boost
First practice session → bigger boost
First real client → major boost

It compounds. But it has to START somewhere.

The version of you on the other side of this certification? She's going to look back at this moment and smile. She's going to wish she could tell you it was worth every scared moment.

I believe in that future version of you. Do you?`
    ]
  },
  {
    keywords: "old|age|51|52|47|50|starting over|too late|young people",
    answers: [
      `Oh honey, let me tell you about my friend Barbara.

Barbara started this certification at 63. SIXTY-THREE. Her kids thought she was having a midlife crisis (a late one, she joked).

Two years later, Barbara has the most successful practice in her cohort. Know why?

Her clients TRUST her. They look at her silver hair and her smile lines and they think "This woman has LIVED. She's seen things. She gets it."

She's not competing with 28-year-olds on Instagram. She's serving 50+ women who want someone who understands hot flashes and empty nest syndrome and caring for aging parents. Someone who's BEEN THERE.

Your age isn't a limitation. It's positioning.

The wellness industry is obsessed with youth. But CLIENTS? They want wisdom. They want someone who won't be shocked by their problems. They want someone who's walked the hard roads.

That's you.

What age are you, if you don't mind me asking?`,

      `Quick math:

Life expectancy: ~80+ years
Your current age: ~50ish
Time left: 30+ YEARS

That's not "starting over at the end." That's starting a whole new chapter with three decades to write it.

My 73-year-old aunt just learned to use Instagram. My 81-year-old neighbor started oil painting. What exactly is "too old"?

Some of the most successful practitioners in our community are 50+. They have something younger people simply cannot have: LIVED EXPERIENCE.

You're not too old. You might actually be exactly the right age.`,

      `I need to challenge this "too old" thinking because it's a LIE our society tells us.

At 51, Colonel Sanders started KFC.
At 52, Julia Child published her first cookbook.
At 65, Nelson Mandela became president.

You're not "too old." You're exactly the right age to finally do what you've always wanted.

Here's what I've noticed: Our 50+ graduates often finish FASTER than the younger ones. Why? Because they're done with excuses. They're done waiting. They have clarity and focus that comes from life experience.

Stop seeing your age as a disadvantage. It's your secret weapon.`
    ]
  },
  {
    keywords: "alone|support|family|husband|spouse|partner|friends|understand",
    answers: [
      `I need to tell you about something that happened in our community last week.

A member posted at 2am (her time) that she was having a panic attack about a client session the next morning. She felt completely unprepared and alone.

By 2:30am, she had 11 responses.

By 3am, someone had jumped on a quick video call with her.

By morning, she'd received two detailed scripts for how to handle the session, three encouraging voice messages, and one very long text from someone who'd been through the exact same thing.

She nailed her session.

THAT'S what this community is. We're your people. We get it when others don't.

Your family might not understand right now. That's okay. They don't have to be your support system for this. WE are.

What are you struggling with right now? Let's get you some support.`,

      `Real talk: Most successful people I know did NOT have family support when they started.

My husband thought I was crazy when I left nursing. "You're throwing away your career for WHAT?" he said.

You know what changed his mind? Results. When he saw my first $10K month, suddenly it wasn't crazy anymore. When I was home for dinner every night instead of working 12-hour shifts, suddenly it made sense.

You don't need permission. You don't need everyone to understand. You need to trust yourself enough to prove them wrong.

This community will be your support while you build that proof. We've all been there.`,

      `"They don't understand."

You know what? They might never understand. And that's okay.

Some people will only support things they can see and touch. They need proof. They need guarantees. They can't imagine doing something brave and uncertain.

That's their limitation, not yours.

Find your people HERE. We understand. We believe. We've done it or we're doing it.

Let your family love you in the ways they can. But don't let their fear become your cage.

You're not alone. You have 3,000+ people in this community who GET IT.`
    ]
  },
  {
    keywords: "finish|complete|give up|quit|online course|never finish|dust",
    answers: [
      `Okay I hear you and I'm going to be VERY honest.

If you buy this and treat it like every other online course? Yeah, it'll collect dust.

Here's what makes this different - but ONLY if you use it:

1. We have live mentor calls. People actually ASKING where you are if you disappear.
2. The community is insanely active. Someone will notice if you go quiet.
3. The modules are SHORT. No 2-hour lectures that make you want to cry.
4. There's a clear path. You always know exactly what's next.
5. Real career outcome. This isn't just "learning" - it's building something.

But none of that matters if YOU don't show up.

Why did those other courses fail for you? What actually happened? Understanding that pattern will tell us if this will be different.`,

      `Let me flip this question:

What if you don't start because you're afraid you won't finish... and then you never get what you actually want?

The fear of not finishing is keeping you from ever beginning. That's the real trap.

Here's my deal with you: If you start and you're struggling, you TELL me. You post in the community. You reach out. We don't let people disappear here.

But you have to let us help you.

Will you commit to that? Not to finishing - just to asking for help when you're stuck?`,

      `Those other courses you didn't finish - were they things you actually WANTED? Or just things you thought you SHOULD do?

Because here's the truth: You finish things you care about. You abandon things that aren't actually aligned with what you want.

If functional medicine is genuinely calling to you - if you feel it in your bones - you'll finish this. Because it MATTERS to you.

If you're doing this because it seems like a good idea or someone else thinks you should... maybe explore that first.

What is it about this path that pulled you here?`
    ]
  },
  {
    keywords: "different|health coach|difference|legit|scam|real|worth it",
    answers: [
      `Oh this is such an important distinction! Let me break it down.

Health coaches (in general) focus on habits and accountability. "Drink more water. Exercise. Sleep better." Important stuff! But surface level.

Functional Medicine practitioners dig DEEPER. We ask WHY.

Why can't she sleep? Oh, her cortisol curve is inverted.
Why is he always tired? Oh, his thyroid isn't converting T4 to T3.
Why can't she lose weight? Oh, her insulin is through the roof.

We learn to read labs. Understand root causes. Create protocols that actually ADDRESS the underlying problem, not just mask symptoms.

The difference? Health coaches make people feel supported. Functional medicine practitioners actually help people HEAL.

Both valuable. Very different scope.

Does that help clarify?`,

      `Short version: Health coaches = habits. FM practitioners = root causes.

Longer version:

Health coaching certifications are typically 3-6 months, surface level, and don't include clinical training.

This certification is 12+ months (depending on your pace), goes DEEP into biological systems, includes lab interpretation, and prepares you for actual clinical practice.

It's the difference between "Have you tried eating less sugar?" and "Based on your labs, your insulin is elevated and your cortisol pattern suggests HPA axis dysfunction. Here's a comprehensive protocol."

Different level entirely.

What draws you to functional medicine specifically vs. just health coaching?`,

      `Let me be blunt: there's a lot of garbage out there.

"Become a coach in 30 days!" - garbage
"No studying required!" - garbage
"Make $10K in your first month!" - garbage

This program is RIGOROUS. It takes most people 6-12 months. You will study. You will be tested. You will be challenged.

But when you finish? You actually KNOW things. You can actually HELP people. You have legitimate credentials recognized in 30+ countries.

Cheap and easy gets cheap and easy results.

This is neither cheap nor easy. That's by design.

What matters more to you - fast or actually competent?`
    ]
  }
];

// Diverse zombie comments - different lengths, tones, styles
const ZOMBIE_COMMENTS_POOL = [
  // Short supportive
  "This. All of this. 👆",
  "Needed to hear this today.",
  "Sarah always knows what to say.",
  "YES! 💯",
  "Saving this comment forever.",
  "Wow.",
  "Crying reading this.",
  "THANK YOU.",
  "This hit different.",
  "Bookmark. Screenshot. Print.",

  // Medium personal stories
  "I asked this EXACT same question 8 months ago. Now I have 6 clients and just quit my corporate job. The fear never fully goes away, but the results speak for themselves.",
  "Can I just say - I was you a year ago. Same doubts. Same questions. Same fears. I started anyway. Best decision I ever made.",
  "My husband rolled his eyes when I enrolled. Last month he apologized and said he was proud of me. Results change minds.",
  "I had the same worry! What helped me was breaking it into tiny pieces. One lesson. Then another. Before I knew it, I was halfway done.",
  "OMG yes. I remember posting something almost identical. Fast forward 10 months and everything is different. Trust the process!",
  "Reading your question is like reading my journal from last year. You're going to be okay. Better than okay.",
  "I was the biggest skeptic. Asked a million questions. Annoyed everyone with my doubts. Then I just... started. And here I am.",

  // Longer detailed stories
  `Can I share my story? I was a 53-year-old paralegal with zero health background. ZERO. I thought I was too old, too inexperienced, too everything.

Three things changed for me:
1. The curriculum actually TEACHES you. No assumptions.
2. The community catches you when you stumble.
3. Sarah is literally always there.

I certified in 9 months. I now work with lawyers and legal professionals dealing with burnout. My past "unrelated" career became my niche.

You're not too anything. You're exactly right.`,

  `Real talk - I almost quit three times during the program.

Time 1: Month 2, felt overwhelmed. Posted here at midnight crying. Had 8 responses by morning, including a video message from another student.

Time 2: Month 5, family emergency. Had to pause for 6 weeks. Expected to feel behind. Community kept me updated and welcomed me back like I never left.

Time 3: Right before certification. Massive imposter syndrome. Sarah did a 30-minute call with me. I passed with a 94%.

This community is different. We actually care.`,

  `I need to tell you something that might sound harsh but it's true:

A year ago I was in your exact position. Same question. Same fears. Same "what ifs."

You know what the difference is between me then and me now? I STARTED.

That's it. That's the whole secret.

The fear didn't go away. I just stopped letting it make decisions for me.

Whatever is holding you back - I promise it looks bigger than it actually is.`,

  // Questions and engagement
  "What's your current situation? Like work and family? Happy to share how I made it work with similar circumstances!",
  "Have you done any other certifications before? Curious what your comparison is.",
  "What specialty are you thinking about? I might be able to connect you with someone in that niche!",

  // Humor and personality
  "Not me reading this at 2am instead of sleeping like a normal person 😂 But seriously, great question.",
  "Okay who's cutting onions in here? These responses are too much. 😭",
  "BRB sending this to past me who spent 6 months overthinking instead of just starting.",
  "Me: *has the same fear* Also me: *does it anyway* Also also me: *succeeds* The end. 😂",
  "Plot twist: The fear doesn't go away. You just learn to high-five it on the way by.",

  // Specific encouragements
  "Fun fact: The fact that you're even asking means you're more self-aware than most. That's going to serve you SO well with clients.",
  "The practitioners who fail aren't the ones who ask questions. They're the ones who THINK they know everything. You're doing it right.",
  "I stalked this community for 4 months before enrolling. Wish I hadn't waited. But I also needed that time. Trust your timing.",
];

// Sarah's replies to zombie comments
const SARAH_REPLIES_TO_ZOMBIES = [
  "THIS right here! Thank you for sharing - stories like yours are exactly why I do this work. 💚",
  "Can I screenshot this and share with people who are on the fence? This is GOLD.",
  "You just made my whole day. Seeing your transformation has been one of my greatest joys.",
  "I remember when you first joined! Look at you now! So incredibly proud. 🎉",
  "And THIS is why I say community is everything. Thank you for being such a beautiful part of it.",
  "Stop, I'm going to cry! You've worked SO hard for this.",
  "This is the content I wish I could show everyone who's hesitating. REAL results from REAL people.",
  "I love that you're paying it forward like this. That's what this community is all about.",
  "You're proof that the path works. Thank you for being so open about your journey.",
];

async function main() {
  console.log("Creating rich, varied comments for ALL Questions Everyone Has posts...\n");

  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
  });

  if (!sarah) {
    console.error("Sarah not found!");
    return;
  }

  const zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "accredipro.academy" }
    },
    take: 200,
  });

  console.log(`Found ${zombies.length} zombie profiles`);

  const questionsPosts = await prisma.communityPost.findMany({
    where: { categoryId: "questions" },
    select: { id: true, title: true, content: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${questionsPosts.length} question posts\n`);

  let totalComments = 0;
  let zombieIdx = 0;
  let zombieCommentIdx = 0;

  for (let postIdx = 0; postIdx < questionsPosts.length; postIdx++) {
    const post = questionsPosts[postIdx];

    await prisma.postComment.deleteMany({ where: { postId: post.id } });

    const postText = (post.title + " " + post.content).toLowerCase();
    const postDate = new Date(post.createdAt);

    // Find matching Sarah answer
    let sarahAnswer = "";
    for (const answerSet of SARAH_ANSWERS) {
      const keywords = answerSet.keywords.split("|");
      if (keywords.some(kw => postText.includes(kw.toLowerCase()))) {
        // Pick a random answer from the set, but try to distribute them
        sarahAnswer = answerSet.answers[postIdx % answerSet.answers.length];
        break;
      }
    }

    if (!sarahAnswer) {
      // Generic but varied answers
      const genericAnswers = [
        `I love that you asked this. Honestly.

The fact that you're thinking deeply about this decision tells me you're going to be great at this. The practitioners who struggle are the ones who rush in without questioning anything.

What I want you to know: Every fear you're feeling? Every doubt? Totally normal. Totally expected. And totally NOT a sign that you shouldn't do this.

It's just your brain trying to keep you safe. Brains are weird like that.

What's the ONE thing that would make you feel more confident about this decision? Let's talk about it specifically.`,

        `Can I be honest? I see myself in your question.

Years ago I was asking the same things. Wondering the same doubts. And I wish someone had told me what I'm about to tell you:

Your questions don't mean you're not ready. They mean you're being thoughtful. They mean you care about doing this right.

The only "wrong" here would be letting fear make your decisions.

What does your gut tell you? Not your fear brain - your GUT?`,

        `Beautiful question, and I see SO many people resonating with it.

Here's the truth nobody talks about: EVERYONE feels this way at the start. The people who succeed aren't the fearless ones - they're the ones who felt everything you're feeling and started anyway.

You're not behind. You're not uniquely unqualified. You're just at the beginning of something new.

And beginnings are always wobbly.

What support do you need to take the next step? We're here for it.`
      ];
      sarahAnswer = genericAnswers[postIdx % genericAnswers.length];
    }

    // Sarah's main comment
    const sarahCommentDate = new Date(postDate.getTime() + (1 + Math.random() * 3) * 60 * 60 * 1000);

    const sarahComment = await prisma.postComment.create({
      data: {
        postId: post.id,
        authorId: sarah.id,
        content: sarahAnswer,
        likeCount: 50 + Math.floor(Math.random() * 80),
        createdAt: sarahCommentDate,
        updatedAt: sarahCommentDate,
      },
    });
    totalComments++;

    // Add varied zombie replies to Sarah (2-5)
    const numZombieReplies = 2 + Math.floor(Math.random() * 4);
    let lastReplyDate = sarahCommentDate;

    for (let i = 0; i < numZombieReplies; i++) {
      const replyDate = new Date(lastReplyDate.getTime() + (15 + Math.random() * 120) * 60 * 1000);
      const zombieComment = ZOMBIE_COMMENTS_POOL[zombieCommentIdx % ZOMBIE_COMMENTS_POOL.length];
      zombieCommentIdx++;

      const zombieReply = await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId: zombies[zombieIdx % zombies.length].id,
          parentId: sarahComment.id,
          content: zombieComment,
          likeCount: 5 + Math.floor(Math.random() * 40),
          createdAt: replyDate,
          updatedAt: replyDate,
        },
      });
      totalComments++;
      zombieIdx++;
      lastReplyDate = replyDate;

      // Sarah sometimes replies to zombie comments (30% chance)
      if (Math.random() < 0.3) {
        const sarahReplyDate = new Date(replyDate.getTime() + (10 + Math.random() * 60) * 60 * 1000);
        const sarahReplyContent = SARAH_REPLIES_TO_ZOMBIES[Math.floor(Math.random() * SARAH_REPLIES_TO_ZOMBIES.length)];

        await prisma.postComment.create({
          data: {
            postId: post.id,
            authorId: sarah.id,
            parentId: zombieReply.id,
            content: sarahReplyContent,
            likeCount: 20 + Math.floor(Math.random() * 30),
            createdAt: sarahReplyDate,
            updatedAt: sarahReplyDate,
          },
        });
        totalComments++;
        lastReplyDate = sarahReplyDate;
      }
    }

    // Add standalone zombie comments (1-3)
    const numStandalone = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numStandalone; i++) {
      const standaloneDate = new Date(lastReplyDate.getTime() + (30 + Math.random() * 180) * 60 * 1000);
      const standaloneContent = ZOMBIE_COMMENTS_POOL[zombieCommentIdx % ZOMBIE_COMMENTS_POOL.length];
      zombieCommentIdx++;

      await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId: zombies[zombieIdx % zombies.length].id,
          content: standaloneContent,
          likeCount: 10 + Math.floor(Math.random() * 35),
          createdAt: standaloneDate,
          updatedAt: standaloneDate,
        },
      });
      totalComments++;
      zombieIdx++;
    }

    console.log(`✓ ${post.title.slice(0, 50)}...`);
  }

  console.log(`\n✅ Created ${totalComments} rich, varied comments across ${questionsPosts.length} posts`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
