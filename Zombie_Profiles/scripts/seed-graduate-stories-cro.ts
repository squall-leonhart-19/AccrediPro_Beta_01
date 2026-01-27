/**
 * Seed Graduate Stories with IMPROVED CRO
 * Funnel: Mini Diploma → Scholarship → Board Certification → Success
 * Run: npx tsx Zombie_Profiles/scripts/seed-graduate-stories-cro.ts
 */

import * as fs from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// CRO-optimized stories - Mini Diploma → Board Certification journey
const STORIES = [
    // TRANSFORMATION STORIES
    {
        postType: "transformation",
        content: `I'm shaking typing this. Just got the email - I'M BOARD CERTIFIED 🎓

18 months ago, I was a burnt-out Pilates instructor teaching 6 classes a day for $35/hour. My body was breaking down. My 47-year-old joints screamed at me every morning.

I kept telling clients "you need to fix your nutrition and stress" but I had ZERO tools to actually help them.

Then I found the Mini Diploma while doom-scrolling at 11pm. I almost scrolled past but something stopped me. It was FREE - so I thought why not?

Those 9 lessons changed everything. I suddenly understood WHY my clients weren't getting results.

When Sarah offered me a scholarship for the Board Certification, I knew I had to go all in. She believed in me before I believed in myself.

Now? I'm a Board Certified Functional Medicine Practitioner. I charge $350/session instead of $35. I'm making $7.4K/month working HALF the hours.

Mini Diploma → Board Certification → New life.

To anyone who just finished the Mini Diploma: TAKE THE SCHOLARSHIP. It's worth every penny (and then some).

#BoardCertified #CareerChange #ThankYouSarah`,
        likes: 342,
        comments: [
            { name: "Sarah M.", content: "I remember when you finished the Mini Diploma - you were SO hungry to learn more! The Board Certification was the obvious next step for you. Look at you now - $350/session! Your clients are getting a REAL practitioner. So proud! 💛", createdAt: "2026-01-15T14:22:00Z" },
            { name: "Michelle R.", content: "Wait there's a scholarship for Board Certification after the Mini Diploma?! I just finished lesson 7... 👀", createdAt: "2026-01-15T18:30:00Z" },
            { name: "Sarah M.", content: "@Michelle - Yes! Finish your Mini Diploma and check your email 😉 The scholarship makes it super accessible. 💛", createdAt: "2026-01-15T19:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `6 months ago: Crying in the bathroom at work, feeling stuck forever.
Today: Board Certified Practitioner making $8.2K/month.

Here's the journey:

STEP 1: Took the Mini Diploma (free, life-changing)
STEP 2: Sarah offered me scholarship for Board Certification
STEP 3: Studied every night after kids went to bed
STEP 4: PASSED my Board exam with 96%
STEP 5: Quit my corporate job

The Mini Diploma opened my eyes. The Board Certification gave me the CREDENTIALS to actually build a practice.

People ask "is the Board Certification worth it after the Mini Diploma?"

Let me answer with numbers:
- Investment: Scholarship pricing
- Return: $8.2K/month
- ROI: Infinite

Stop asking if it's worth it. Start asking how fast you can finish. 🚀`,
        likes: 387,
        comments: [
            { name: "Sarah M.", content: "From bathroom crying to $8.2K/month - this is the transformation I LIVE for. And you did it in 6 months! The Board Certification gave you the credibility to charge what you're worth. So proud! 💛", createdAt: "2026-01-10T09:00:00Z" },
            { name: "Jennifer L.", content: "This is exactly my situation right now. Stuck in corporate. Just finished Mini Diploma. Debating the Board... this convinced me.", createdAt: "2026-01-10T14:30:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `From stay-at-home mom to Board Certified Practitioner.

My journey:
- Started Mini Diploma during nap times
- Got hooked on the content (Sarah explains things SO well)
- Applied for scholarship when it was offered
- Studied for Board Certification between school drop-offs
- CERTIFIED 4 months later

Now my 12-year-old asks: "Mom, what do you do for work?"

I say: "I'm a Board Certified Functional Medicine Practitioner. I help women feel better when doctors can't figure out what's wrong."

Her response: "That's so cool."

$6.2K/month. From my home office. While still being there for my kids.

The Mini Diploma showed me what's possible. The Board Certification made it REAL.

To the moms debating whether to take the next step: DO IT. Your kids will be so proud. 💕`,
        likes: 298,
        comments: [
            { name: "Sarah M.", content: "Your daughter is watching you BUILD something. That's legacy work right there. Board Certified, working from home, being present for your kids - you have it all! 💛", createdAt: "2026-01-12T11:00:00Z" },
            { name: "Amanda L.", content: "Fellow mom here. Just finished Mini Diploma. How hard was the Board Certification with kids?", createdAt: "2026-01-12T14:30:00Z" },
            { name: "Sarah M.", content: "@Amanda - It's designed for busy women! Take it at your own pace. The scholarship makes it affordable. You've got this! 💛", createdAt: "2026-01-12T15:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Pharmacist for 15 years → Board Certified Functional Medicine Practitioner

Let me tell you about the wake-up call...

I was dispensing medications I knew wouldn't fix root causes. Same patients. Month after month. New symptoms. New prescriptions.

Then I found the Mini Diploma. FREE. Why not try it?

Those 9 lessons blew my mind. FINALLY someone explaining the WHY behind everything.

When the scholarship for Board Certification came, I didn't hesitate. I NEEDED those credentials.

Now I spend 60-90 minutes with each client. We find ANSWERS. We fix ROOT CAUSES.

Last month a client said: "You've done more for me in 8 weeks than 12 years of doctors."

That's the power of Board Certification. Real credentials. Real results.

The Mini Diploma opens your eyes. The Board Certification opens doors.`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "From pill counter to root cause detective! Your pharmacy background + Board Certification = POWERFUL combination. You understand both worlds now. So proud! 💛", createdAt: "2026-01-08T10:00:00Z" },
            { name: "Lisa P.", content: "Fellow pharmacist here - did you get the scholarship after Mini Diploma?", createdAt: "2026-01-08T15:00:00Z" },
            { name: "Sarah M.", content: "@Lisa - Yes! Complete your Mini Diploma and watch for the scholarship offer. It's designed for dedicated students like you! 💛", createdAt: "2026-01-08T15:30:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `52 years old. Career pivot. Board Certified.

"You're too old to start over" - my sister
"Just wait for retirement" - my husband
"Why risk it?" - my friends

I stopped listening.

Here's what happened:
1. Did Mini Diploma (free, eye-opening)
2. Sarah offered scholarship for Board Certification
3. Studied like my life depended on it
4. PASSED my Board exam
5. Built a waitlist of clients

6 months in: 14 active clients, $8.5K/month

Being Board Certified matters. Clients trust you. You can charge premium rates. You have REAL credentials.

Age isn't a barrier. The Mini Diploma is free. The Board scholarship makes certification accessible.

What's your excuse? 🙌`,
        likes: 356,
        comments: [
            { name: "Sarah M.", content: "52 is PERFECT timing! You've lived what your clients are going through. Board Certification + life experience = unstoppable combination. So proud of you! 💛", createdAt: "2026-01-05T09:30:00Z" },
            { name: "Patricia V.", content: "I'm 54 and this gave me the push. How do I get the scholarship after Mini Diploma?", createdAt: "2026-01-05T12:00:00Z" },
            { name: "Sarah M.", content: "@Patricia - Finish your Mini Diploma first! The scholarship offer comes after. Trust the process! 💛", createdAt: "2026-01-05T12:30:00Z" }
        ]
    },

    // FIRST CLIENT / INCOME STORIES
    {
        postType: "first_client",
        content: `First client as a Board Certified Practitioner: $350

Let me tell you how I got here...

Started with Mini Diploma (free). Learned SO much. Got hooked.

Sarah offered scholarship for Board Certification. I was nervous but said YES.

Studied for 3 months. Passed my Board exam. Got my official certification.

Posted on Facebook: "I'm officially Board Certified in Functional Medicine!"

My neighbor messaged: "Can you help my gut issues?"

$350 for initial consultation. She booked on the spot.

The Board Certification made ALL the difference. She said: "I trust you because you're actually CERTIFIED."

Credentials matter. The scholarship made it possible.

From Mini Diploma to Board Certified to $350 client in 4 months. 🙏`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "This is exactly why the Board Certification matters! Clients want to know you have CREDENTIALS. The scholarship makes it accessible, the certification makes you credible. So proud! 💛", createdAt: "2026-01-18T11:00:00Z" },
            { name: "Rachel T.", content: "$350 for first consultation?! I've been charging $150... Maybe I need that Board Certification 👀", createdAt: "2026-01-18T14:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `$10,000 MONTH as a Board Certified Practitioner 💰

Let me break down the journey:

Month 0: Started Mini Diploma (free)
Month 1: Finished Mini Diploma, got scholarship offer
Month 2-4: Board Certification studies
Month 5: PASSED, got certified
Month 6: First clients, $1,200
Month 7: $3,800
Month 8: $6,400
Month 9: $10,000 🎉

The Mini Diploma taught me WHAT to do.
The Board Certification taught me HOW to build a practice.

I was a burned out teacher making $48K/year. That's $4K/month.

Now I make $10K/month working part-time. From home.

Being Board Certified = premium pricing. Clients pay for CREDENTIALS.

Take the Mini Diploma. Get the scholarship. Get Board Certified. Change your life.`,
        likes: 423,
        comments: [
            { name: "Sarah M.", content: "$10K/month, 9 months from starting the Mini Diploma! This is what's possible when you commit. The Board Certification is the key that unlocks premium pricing. So unbelievably proud! 💛🔥", createdAt: "2026-01-08T09:00:00Z" },
            { name: "Christina W.", content: "Wait so after Mini Diploma there's a scholarship for Board Certification? How much is it?", createdAt: "2026-01-08T12:00:00Z" },
            { name: "Sarah M.", content: "@Christina - Focus on finishing your Mini Diploma first! The scholarship details come after. It's very accessible. 💛", createdAt: "2026-01-08T12:30:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Made back my Board Certification investment in ONE WEEK.

Here's the math:

Mini Diploma: FREE
Board Certification: Scholarship pricing
First client after certification: $350
Second client: $350
Third client: $450 (package)

Total week 1: $1,150

ROI: INSANE

I almost didn't take the scholarship. "Can I really afford it?"

Better question: "Can I afford NOT to?"

One week of clients paid it back. Everything after = pure profit.

If you finished your Mini Diploma and are debating the Board Certification...

The math doesn't lie. Do it. 📈`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "ONE WEEK to ROI! This is exactly why I created the scholarship - to remove the barrier. The Board Certification pays for itself SO fast. Congrats! 💛", createdAt: "2026-01-15T08:30:00Z" },
            { name: "Nicole B.", content: "This is the sign I needed. Just finished Mini Diploma yesterday. Taking the scholarship TODAY.", createdAt: "2026-01-15T10:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `6 month income report (full transparency):

Month 1 (Mini Diploma): $0 (learning)
Month 2-3 (Board Certification): $0 (studying)
Month 4 (just certified): $800
Month 5: $2,400
Month 6: $5,100

Total: $8,300 in 3 months of actual practice

Still working my day job. For now.

Here's what the Board Certification gave me:
✓ Credentials clients trust
✓ Confidence to charge premium
✓ Framework to run a real practice
✓ Community of certified practitioners

The Mini Diploma was the appetizer. The Board Certification is the main course.

If you're on the fence about the scholarship - just DO IT. 💪`,
        likes: 289,
        comments: [
            { name: "Sarah M.", content: "$8.3K in your first 3 months of practice! And still working your day job! The Board Certification gave you everything you needed to build real income on the side. Soon you'll be full-time! 💛", createdAt: "2026-01-18T11:00:00Z" }
        ]
    },

    // WIN STORIES
    {
        postType: "win",
        content: `My client just lost 30 pounds. Not through restriction - through ROOT CAUSE work.

She'd been dieting for 20 years. Nothing stuck.

I used everything from my Board Certification training. Gut health. Hormones. Inflammation.

8 weeks later: Down 30 pounds. Eating MORE than before.

She said: "I trusted you because you're Board Certified. You actually know what you're doing."

CREDENTIALS MATTER.

The Mini Diploma taught me the basics. The Board Certification made me a real practitioner.

When clients Google you, they want to see CERTIFIED.

Take the scholarship. Get the certification. Change lives. 🙌`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "30 pounds through ROOT CAUSE work! This is the difference between a coach and a Board Certified practitioner. You have DEPTH. So proud! 💛", createdAt: "2026-01-12T11:00:00Z" }
        ]
    },
    {
        postType: "win",
        content: `Client update that made me cry:

She came to me with 12 years of chronic pain. Fibromyalgia diagnosis. 4 medications. Zero hope.

8 months of working together (using everything from Board Certification training)...

She's off 3 medications. Sleeping through the night. Playing with grandkids again.

She hugged me and said: "You gave me my life back."

This is why I got Board Certified. This is why the scholarship was worth it.

The Mini Diploma opened my eyes. The Board Certification gave me the tools to actually HEAL people.

Different levels of impact. Trust me on this one. 🙏`,
        likes: 445,
        comments: [
            { name: "Sarah M.", content: "Off 3 medications! Playing with grandkids! This is LEGACY work. The Board Certification turned you into a real practitioner who changes lives. Crying reading this. 💛🙏", createdAt: "2026-01-16T09:00:00Z" }
        ]
    },

    // GRATITUDE STORIES
    {
        postType: "gratitude",
        content: `One year Board Certified today! 🎂

Let me share the numbers:
- 52 clients helped
- $64,000 earned
- 0 regrets

But more importantly...

Thank you Sarah for:
- Creating the Mini Diploma that changed my mindset
- Offering the scholarship that made Board Certification possible
- Building a community that supported me every step

I remember being scared to take the scholarship. "What if I fail?"

I didn't fail. I flourished.

To everyone who just finished Mini Diploma: THE SCHOLARSHIP IS WORTH IT.

Board Certification changed my life.

Grateful doesn't even begin to cover it. 🙏`,
        likes: 378,
        comments: [
            { name: "Sarah M.", content: "ONE YEAR! 52 clients! $64K! Happy anniversary! 🎉 I remember when you nervously asked about the scholarship. Look at you now. This is why I do what I do. 💛🙏", createdAt: "2026-01-20T10:00:00Z" },
            { name: "Diana S.", content: "How do I get the scholarship? Just finished Mini Diploma!", createdAt: "2026-01-20T12:00:00Z" },
            { name: "Sarah M.", content: "@Diana - Check your email! 😉💛", createdAt: "2026-01-20T12:15:00Z" }
        ]
    },
    {
        postType: "gratitude",
        content: `Thank you Sarah for believing in me before I believed in myself.

When I finished the Mini Diploma, I was still skeptical. "Can I really do this?"

You offered me the scholarship for Board Certification anyway.

You said: "You're ready. Trust me."

I trusted you. I took the leap.

Now I'm a Board Certified Practitioner with a full practice.

The Mini Diploma was the spark.
The scholarship was the opportunity.
The Board Certification was the transformation.

YOU were the catalyst.

Thank you for creating this pathway for women like me. 💛`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "You were always ready - you just needed someone to tell you. That's what this community is for. So proud of your Board Certification journey! 💛🙏", createdAt: "2026-01-15T09:00:00Z" }
        ]
    },

    // TIP / ADVICE STORIES
    {
        postType: "tip",
        content: `PSA for everyone who just finished Mini Diploma:

TAKE THE SCHOLARSHIP. GET BOARD CERTIFIED.

Here's why:

1. Credentials matter. Clients Google you.
2. The training is 10x deeper than Mini Diploma
3. You learn to actually RUN a practice
4. Premium pricing becomes possible
5. You join a community of real practitioners

I was nervous about the investment. Sarah's scholarship made it accessible.

ROI came in first month of practice.

Don't stay at Mini Diploma level. Level up to Board Certification.

Your future clients deserve a REAL practitioner. 💪`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "THIS! The Mini Diploma opens your eyes. The Board Certification opens doors. Credentials matter in this industry. So glad you made the leap! 💛", createdAt: "2026-01-18T08:30:00Z" }
        ]
    },
    {
        postType: "tip",
        content: `Quick pricing reality check:

WITHOUT Board Certification:
- "I'm a health coach" = $75-150/session
- Lower trust, harder to sell
- No credentials to back you up

WITH Board Certification:
- "I'm a Board Certified Practitioner" = $250-400/session
- Higher trust, easier to sell
- REAL credentials

Math: 2-3x the price = half the clients for same income

OR same clients = 2-3x the income

The scholarship for Board Certification is the best investment I made.

Credentials → Trust → Premium Pricing → Better life

Take the scholarship. Thank me later. 📈`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "The pricing difference is REAL. Board Certification = premium positioning. The scholarship makes it accessible to everyone. This is the way! 💛", createdAt: "2026-01-14T09:00:00Z" },
            { name: "Rebecca L.", content: "I've been charging $100 with just Mini Diploma... Time to get Board Certified!", createdAt: "2026-01-14T11:30:00Z" }
        ]
    },
    {
        postType: "advice",
        content: `Stop asking "should I get Board Certified?"

Start asking "how fast can I get Board Certified?"

Here's the thing:

Mini Diploma = Education
Board Certification = Career

You can know everything from Mini Diploma.
But without the certification, you're just "knowledgeable."

With Board Certification? You're a PRACTITIONER.

The scholarship makes it affordable.
The training makes you competent.
The certificate makes you credible.

I debated for 2 weeks. Wasted 2 weeks of income.

Take the scholarship. Get certified. Start earning.

Time is money. Literally. 💰`,
        likes: 289,
        comments: [
            { name: "Sarah M.", content: "\"Mini Diploma = Education, Board Certification = Career\" - THIS! I'm stealing that. The scholarship is there to remove the barrier. Use it! 💛", createdAt: "2026-01-12T09:30:00Z" }
        ]
    },

    // STRUGGLE / MINDSET STORIES
    {
        postType: "struggle",
        content: `Real talk: I failed my Board Certification exam. Twice.

First time: Devastated. Cried for days.
Second time: CRUSHED. Almost gave up.

Sarah messaged me: "You're not failing. You're learning. Try again."

Third time: PASSED with 94%.

Those "failures" made me a BETTER practitioner.

Here's the thing - the Mini Diploma is easy. Board Certification is harder. It's SUPPOSED to be.

The bar is high because the credential means something.

To anyone who failed: TRY AGAIN. The scholarship doesn't expire. Your future doesn't expire.

Fail forward. Get Board Certified. Change lives. 💪`,
        likes: 356,
        comments: [
            { name: "Sarah M.", content: "I remember those messages. Your determination was inspiring. Now you know the material DEEPLY. Your clients are lucky to have someone who worked this hard. 💛", createdAt: "2026-01-20T10:00:00Z" },
            { name: "Kimberly J.", content: "Taking Board exam tomorrow. This is exactly what I needed. Even if I fail, I'll try again!", createdAt: "2026-01-20T11:30:00Z" },
            { name: "Sarah M.", content: "@Kimberly - You've got this! And if you don't pass first time, it's okay. The scholarship includes retakes. 💛", createdAt: "2026-01-20T11:45:00Z" }
        ]
    },
    {
        postType: "mindset",
        content: `"I'll just stay at Mini Diploma level. The Board Certification is too much."

That was me 8 months ago.

Then I did the math:

Mini Diploma (free) + staying small = $0-2K/month maybe
Board Certification (scholarship) + real practice = $5-10K/month

The difference? One decision.

I took the scholarship. I got Board Certified. I built a real practice.

The Mini Diploma is the foundation. 
The Board Certification is the house.

You can't live in a foundation.

Build the house. Take the scholarship. 🏠`,
        likes: 298,
        comments: [
            { name: "Sarah M.", content: "\"You can't live in a foundation\" - PERFECT analogy. The Mini Diploma opens your eyes, the Board Certification builds your business. Love this! 💛", createdAt: "2026-01-16T08:30:00Z" }
        ]
    },

    // MORE VARIATIONS
    {
        postType: "certificate",
        content: `BOARD CERTIFIED!! 🎓🎉

The official email came today. I'm crying.

Journey recap:
- Found Mini Diploma randomly online (FREE)
- Finished all 9 lessons in 2 weeks
- Got scholarship offer from Sarah
- Studied for Board Certification for 3 months  
- PASSED my exam today!

I'm officially a Board Certified Functional Medicine Practitioner.

When I started the Mini Diploma, I never imagined this.

Sarah, thank you for creating this pathway. Thank you for the scholarship. Thank you for believing in us.

To everyone in Mini Diploma right now: THIS CAN BE YOU.

Finish the lessons. Take the scholarship. Get Board Certified.

Best decision I ever made. 💛`,
        likes: 412,
        comments: [
            { name: "Sarah M.", content: "CONGRATULATIONS!! 🎉🎉 From Mini Diploma student to Board Certified Practitioner! This is what it's all about. Your hard work paid off! Welcome to the certified practitioner family! 💛", createdAt: "2026-01-22T10:00:00Z" }
        ]
    },
    {
        postType: "win",
        content: `Got my first referral from a DOCTOR today.

She's an endocrinologist. Sent me a patient she couldn't help.

Why? Because I'm BOARD CERTIFIED.

She said: "I trust Board Certified practitioners. You have real credentials."

This would NEVER happen with just Mini Diploma completion.

The certification matters. The scholarship made it possible.

From "who are you?" to "doctor-referred practitioner" in 6 months.

Take the scholarship. Get Board Certified. Open doors you can't imagine. 🚀`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "DOCTOR REFERRALS! 🔥 This is the power of Board Certification. Real credentials = professional recognition. So proud! 💛", createdAt: "2026-01-25T09:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Replaced my full-time income in 4 months of Board Certified practice.

Numbers:
- Old corporate job: $5,200/month
- Month 1 certified: $1,800
- Month 2: $3,600
- Month 3: $5,400 (REPLACEMENT!)
- Month 4: $7,200 🎉

Quit my job last week.

The pathway:
Mini Diploma (free) → Scholarship → Board Certification → Freedom

Sarah made this accessible with the scholarship pricing.

Best investment I ever made. Period.

If you're debating the Board Certification after Mini Diploma - stop debating. The math works. 💰`,
        likes: 389,
        comments: [
            { name: "Sarah M.", content: "INCOME REPLACEMENT IN 4 MONTHS! And now you quit! This is the dream and you're living it. The Board Certification investment paid off 10x over. So proud! 💛🔥", createdAt: "2026-01-23T10:00:00Z" }
        ]
    }
];

async function main() {
    console.log("🧹 Clearing all existing graduate posts...");
    const deleted = await prisma.graduatePost.deleteMany({});
    console.log(`   Deleted ${deleted.count} existing posts`);

    console.log("\n🧟 Loading zombie profiles...");
    let profiles = await prisma.zombieProfile.findMany({
        where: { isGraduate: true, isActive: true },
        take: 100
    });
    console.log(`   Found ${profiles.length} graduate profiles`);

    console.log(`\n📝 Creating ${STORIES.length} CRO-optimized graduate stories...`);

    for (let i = 0; i < STORIES.length; i++) {
        const story = STORIES[i];
        const profile = profiles[i % profiles.length];

        const daysAgo = Math.floor(Math.random() * 60) + 1;
        const postedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        await prisma.graduatePost.create({
            data: {
                profileId: profile.id,
                postType: story.postType,
                content: story.content,
                likes: story.likes + Math.floor(Math.random() * 50),
                comments: story.comments as any,
                postedAt,
                isActive: true,
                isPinned: i < 3
            }
        });

        console.log(`   ✓ ${story.postType}: ${profile.name}`);
    }

    console.log(`\n✅ Done! Created ${STORIES.length} CRO-optimized stories`);
    console.log("   All stories now emphasize: Mini Diploma → Scholarship → Board Certification → Success");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
