/**
 * Seed 77 Graduate Stories with Zombie Profiles
 * Run: npx tsx Zombie_Profiles/scripts/seed-new-graduate-stories.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Story templates - each one unique, compelling, CRO-optimized
const STORIES = [
    // TRANSFORMATION STORIES (15)
    {
        postType: "transformation",
        content: `I'm shaking typing this. Just got the email - I'M CERTIFIED 🎓

18 months ago, I was a burnt-out Pilates instructor teaching 6 classes a day for $35/hour. My body was breaking down. My 47-year-old joints screamed at me every morning.

I kept telling clients "you need to fix your nutrition and stress" but I had ZERO tools to actually help them do that. I felt like a fraud.

Then I saw an ad for this program while doom-scrolling at 11pm. I almost scrolled past but something stopped me.

The mini diploma changed EVERYTHING.

Now? I've transitioned to health coaching. I charge $350/session instead of $35. I work with 12 women vs teaching to 30 strangers. I'm making $7.4K/month working HALF the hours.

To anyone who's scared to make the jump - your future self is begging you to do it.

#Certified #CareerChange #FunctionalMedicine`,
        likes: 287,
        comments: [
            { name: "Sarah M.", content: "I remember your first message to me - 'I don't know if I can do this.' Look at you now! Your clients are SO lucky to have someone who truly understands both movement AND the deeper health piece. 💛", createdAt: "2026-01-15T14:22:00Z" },
            { name: "Michelle R.", content: "The part about feeling like a fraud hit me so hard. Now I have TOOLS. Congrats! 🎉", createdAt: "2026-01-15T18:30:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `6 months ago: Crying in the bathroom at work, wondering if this was my life forever.

Today: Running a practice I love, helping people who actually WANT to get better, making more than my corporate salary.

Same me. Different path. 🦋

The scariest part was telling my husband I wanted to quit my stable job. He was skeptical. My parents thought I was crazy.

But I knew in my gut this was meant for me.

Module by module, I transformed. Not just my career - my MINDSET.

Now I wake up excited to work. My kids see me building something meaningful. My husband is my biggest cheerleader.

If you're stuck in a job that's killing your soul - there IS another way.`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "Same you, different path - that's beautifully said. You didn't need to become someone else. You just needed the right vehicle for who you already ARE. 💛", createdAt: "2026-01-10T09:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Plot twist nobody expected: The "stay at home mom" now has her own business.

My kids see me building something. They see me studying. They see me helping people.

3 years ago I lost my identity. I was "just mom." Nothing wrong with that, but I wanted MORE.

When I started this certification, I studied during nap time. During soccer practice. After bedtime when everyone else was watching TV.

My 12-year-old asked me last week: "Mom, what do you do for work now?"

I said: "I help women feel better when doctors can't figure out what's wrong."

Her response: "That's so cool. Can I do that when I grow up?"

THAT right there. That's worth everything.

$6.2K/month is great. But modeling entrepreneurship for my daughters? Priceless. 💕`,
        likes: 298,
        comments: [
            { name: "Sarah M.", content: "Your daughter wanting to follow in your footsteps - I'm literally crying. THIS is generational impact. This is legacy. So proud of you! 🙏💛", createdAt: "2026-01-12T11:00:00Z" },
            { name: "Jennifer L.", content: "The nap time studying is SO relatable. You're proof it can be done! 💪", createdAt: "2026-01-12T14:30:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Before: Pharmacist for 15 years. Counting pills. Watching people get sicker on medication after medication.

After: Functional medicine practitioner. Finding ROOT CAUSES. Watching people actually HEAL.

I almost didn't make the switch. The pharmacy salary was comfortable. The benefits were good. The schedule was predictable.

But my soul was dying.

Every day I dispensed medications I knew wouldn't fix the underlying problem. I watched the same patients come back month after month with new symptoms, new prescriptions.

Now? I spend 60-90 minutes with each client. We dig DEEP. We find answers.

Last month a client said: "You've done more for me in 8 weeks than 12 years of doctors."

That's why I made the leap. And I'd do it again in a heartbeat.`,
        likes: 276,
        comments: [
            { name: "Sarah M.", content: "From pill counter to root cause detective! Your pharmacy background makes you SUCH a powerful practitioner. You understand the system from the inside. That perspective is invaluable. 💛", createdAt: "2026-01-08T10:00:00Z" },
            { name: "Lisa P.", content: "Fellow pharmacist here - your story is exactly why I enrolled. Can't wait to make the same transition! 🙌", createdAt: "2026-01-08T15:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `At 52, I completely pivoted careers. They said I was crazy.

"You're too old to start over."
"Just wait for retirement."
"Why would you leave a stable job?"

I stopped listening.

Here's what they don't tell you about being 50+ in this field:

- Clients TRUST you more. You've LIVED through perimenopause, health scares, the whole thing.
- Your life experience is an ASSET, not a liability.
- You have wisdom that 30-year-olds simply don't have yet.

6 months in: 14 active clients, $8.5K/month, and a waitlist starting.

Age is not a barrier. It's a superpower.

To everyone worried about starting "late" - GO. Your future self will thank you. 🙌`,
        likes: 341,
        comments: [
            { name: "Sarah M.", content: "52 is NOT late, it's PERFECT timing! You've lived what your clients are going through. That empathy and understanding can't be taught in any course. You EARNED it. 💛", createdAt: "2026-01-05T09:30:00Z" },
            { name: "Patricia V.", content: "I'm 54 and this just gave me the push I needed. Starting Module 1 tonight! 🙏", createdAt: "2026-01-05T12:00:00Z" }
        ]
    },

    // FIRST CLIENT STORIES (12)
    {
        postType: "first_client",
        content: `📣 UPDATE: Just finished my 10th paying client session!

But let me tell you about client #1 because it almost broke me...

Her name is Diane. She messaged me 3 days after I got certified. I was TERRIFIED. Imposter syndrome was screaming "who are you to help anyone??"

I almost told her I wasn't ready.

But I thought about everything I learned. The protocols. The frameworks. I took a deep breath and said yes.

First session: 90 minutes. She'd been struggling with bloating and fatigue for 8 years. Doctors said she was "fine."

Spoiler: She wasn't fine. We found multiple root causes.

She cried during that session. Not sad crying - RELIEVED crying. She said "no one has ever asked me these questions before."

I cried in my car after she left.

The ripple effect is real. All because I said yes when I was scared.`,
        likes: 342,
        comments: [
            { name: "Sarah M.", content: "\"No one has ever asked me these questions before\" - this is EXACTLY why we do this work. The gap in conventional healthcare is massive. YOU are filling it. Keep going! 🙏💛", createdAt: "2026-01-10T09:15:00Z" },
            { name: "Amanda L.", content: "I'm in Module 12 feeling the same imposter syndrome. This gives me hope 💕", createdAt: "2026-01-10T14:22:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `OMG you guys... I just booked my FIRST CLIENT! 😭

She's a referral from my neighbor. $175 for an initial consultation.

My hands were literally shaking during the intake call. But I knew my stuff! All those modules paid off.

I'M ACTUALLY DOING THIS!!!

The best part? She already wants to book a 12-week program. That's $2,100 when she signs.

From zero clients to potential $2,275 in income... in one week of actually putting myself out there.

Sarah was right - the clients are there. You just have to LET them find you.`,
        likes: 189,
        comments: [
            { name: "Sarah M.", content: "FROM YOUR NEIGHBOR! This is how it starts - one conversation, one connection, one life changed. Then word spreads. Welcome to your new career! 🔥💛", createdAt: "2026-01-18T11:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `First client story time:

A friend of a friend heard I got certified. She's been dealing with gut issues for 5 years. Doctors keep saying "your labs are normal."

Did a free discovery call using the template from Module 15.

She cried. Said no one had ever listened like that.

Signed up for my 12-week gut healing program on the spot. $1,800.

EIGHTEEN HUNDRED DOLLARS. From ONE conversation.

I was so nervous I almost undercharged. Almost said "$900."

But I remembered what Sarah taught us about pricing to value. Her health is worth more than $1,800. My knowledge is worth more than $1,800.

Charge your worth, ladies. 💪`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "YOU HELD YOUR PRICE! That's the hardest part and you did it! The confidence will only grow from here. So proud of you! 💛", createdAt: "2026-01-14T10:30:00Z" },
            { name: "Nicole B.", content: "This just convinced me to raise my package price. Thank you for sharing! 🙌", createdAt: "2026-01-14T13:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `Y'ALL. First client. First invoice. First payment received.

I stared at that PayPal notification for like 5 minutes. $200 for helping someone understand their own health.

She's a coworker who's been struggling with brain fog for years. I used the intake process from Module 7 and she kept saying "why didn't my doctor ever ask me this?"

BECAUSE THEY DON'T HAVE TIME. We do.

I remember being scared I'd never get clients. Now I have 3 booked for next week.

It's happening. It's actually happening. 🙏`,
        likes: 198,
        comments: [
            { name: "Sarah M.", content: "That first PayPal notification hits different, doesn't it? This is the start of something beautiful. Keep going! 💛", createdAt: "2026-01-20T08:30:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `Just signed my 5th client and I only got certified 3 WEEKS ago!

Here's what's working:
- Posted on my personal Facebook (scary but worth it)
- Messaged 10 people I knew struggled with health issues
- Offered 3 free discovery calls to practice

Result: 5 paying clients. $3,200 already invoiced.

The demand is REAL. Women are desperate for someone who will actually LISTEN.

If you're waiting to feel "ready" - stop. Start now. Learn by doing.`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "5 clients in 3 weeks! You followed the exact framework from Module 16.This is proof it works when you work it. Amazing! 🔥💛", createdAt: "2026-01-16T09:00:00Z" },
            { name: "Rachel T.", content: "Love this! Messaging people directly was scary for me too but it WORKS. Congrats! 💪", createdAt: "2026-01-16T11:30:00Z" }
        ]
    },

    // INCOME MILESTONE STORIES (15)
    {
        postType: "income_milestone",
        content: `2025 INCOME REPORT 📊

September (certified): $1,200
October: $3,800
November: $6,400
December: $9,700

TOTAL: $21,100 in 4 months

AND I still sold real estate part-time until November.

December I worked with 14 clients. Average package: $2,100. I worked maybe 25 hours/week. From my spare bedroom. In yoga pants.

My last year in full-time real estate? $87K working 60+ hours/week.

I made a QUARTER of that in 4 MONTHS working PART-TIME.

January goal: $12K month
2026 goal: Replace my entire real estate income

The math works. Trust the process. 📈`,
        likes: 456,
        comments: [
            { name: "Sarah M.", content: "From realtor to almost $10K/mo in 4 months?! And you're just getting started. The difference: you're changing LIVES, not just closing deals. So proud! 🔥💛", createdAt: "2026-01-02T10:30:00Z" },
            { name: "Christina W.", content: "Wait $2,100 for an 8-week package? I've been charging $800. Time to raise prices 😅", createdAt: "2026-01-02T14:00:00Z" },
            { name: "Sarah M.", content: "@Christina – Yes! Module 17 - pricing to value, not time. You've got this! 💪", createdAt: "2026-01-02T16:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `$10,000 MONTH! 💰

I literally cannot believe I'm typing this.

12 clients. Mix of 1:1 and group. Working from my home office while my kids are at school.

I was a burned out teacher making $48K/year.

Now I help women balance their hormones and I made more THIS MONTH than I used to make in 3 months.

The best part? I love what I do. I wake up EXCITED to work.

When was the last time you were excited to go to work?

This certification didn't just change my income. It changed my entire LIFE.`,
        likes: 389,
        comments: [
            { name: "Sarah M.", content: "From $48K/year teaching to $10K in ONE MONTH?! And doing work that actually energizes you? This is the transformation I love seeing. You earned every penny! 💛", createdAt: "2026-01-08T09:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `$1,000 MONTH!

I know it's not much compared to some of you rockstars, but for me? This is HUGE.

6 months ago I was terrified to even tell people I was studying this. Now I have 7 regular clients and a waitlist starting.

The Business Accelerator content was a game-changer. I had no idea how to actually GET clients before that.

Slow and steady wins the race. Every month is better than the last.

To everyone just starting: your $1K month is coming. Keep going. 📈`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "EVERY dollar counts! This $1K is the foundation. From here, it only grows. You've proven to yourself it's possible. That's worth more than any amount! 💛", createdAt: "2026-01-12T10:00:00Z" },
            { name: "Diana S.", content: "This is exactly where I want to be! Thanks for the encouragement 🙏", createdAt: "2026-01-12T12:30:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Made back my certification investment in ONE WEEK.

Let that sink in.

$297 for the scholarship. First client paid $350.

ROI: Infinite.

I almost didn't sign up because "I can't afford it." The irony is HILARIOUS now.

If you're on the fence because of money - do the math. ONE client pays you back. Everything after that is profit.

Best investment I ever made in myself. Bar none.`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "ONE WEEK! This is why we offer the scholarship pricing. The ROI is insane when you actually put in the work. You're living proof! 🔥💛", createdAt: "2026-01-15T08:30:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Six month income report (for transparency):

Month 1: $400
Month 2: $1,100
Month 3: $2,800
Month 4: $4,200
Month 5: $5,600
Month 6: $7,400

Total: $21,500 working PART-TIME.

I quit my corporate job last week. 🙌

The compound growth is real. It's slow at first. Then it snowballs.

If month 1 is discouraging - it's NORMAL. The momentum builds. Just don't quit.`,
        likes: 378,
        comments: [
            { name: "Sarah M.", content: "I love the transparency! This is EXACTLY what realistic growth looks like. Not overnight success - compound effort over time. You're now full-time in your dream career! 💛", createdAt: "2026-01-18T11:00:00Z" },
            { name: "Heather N.", content: "Month 1: $400 gives me so much hope. I'm in month 2 with $600 so I'm on track! 💪", createdAt: "2026-01-18T14:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `$6,800 THIS MONTH! 🎉

But here's what's even crazier: I worked maybe 18 hours/week.

The group programs Sarah taught us about? GAME. CHANGER.

One hour with 6 people = 6x the impact. Same work, bigger reach, more income.

Why didn't I start groups sooner?! Oh right, I was scared no one would sign up.

They signed up. 12 spots filled in 48 hours.

Stop underestimating the demand for what you offer.`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "Group programs are the unlock! Same expertise, leveraged delivery. You cracked the code. Now teach the others! 🔥💛", createdAt: "2026-01-20T09:30:00Z" }
        ]
    },

    // WIN STORIES (10)
    {
        postType: "win",
        content: `SMALL WIN but big for me:

A client texted me unprompted to say her energy is back for the first time in 3 years.

She was told by 4 doctors there was "nothing wrong."

There WAS something wrong. We found it. We fixed it.

Root cause medicine. It actually works.

This is why we do this work. 💪`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "4 doctors missed it. YOU found it. This is the power of actually listening and asking the right questions. Amazing work! 💛", createdAt: "2026-01-14T10:00:00Z" }
        ]
    },
    {
        postType: "win",
        content: `My client just called crying happy tears.

Her labs came back and her thyroid markers are finally optimal after 8 months of working together.

No medication changes. Just root-cause work.

Her endocrinologist is "baffled."

I'm not baffled. I just paid attention to what conventional medicine ignores.

Functional medicine isn't magic. It's just THOROUGH. 🙏`,
        likes: 298,
        comments: [
            { name: "Sarah M.", content: "\"Baffled\" doctors make me smile. They're not baffled by what you did - they're baffled they never thought to do it themselves. Keep changing lives! 💛", createdAt: "2026-01-16T09:00:00Z" }
        ]
    },
    {
        postType: "win",
        content: `Y'ALL. My client just lost 30 pounds.

Not through restriction. Not through willpower.

Through understanding her body. Fixing her gut. Balancing her hormones.

This approach WORKS.

She'd been dieting for 20 years. Nothing ever stuck.

We fixed the ROOT CAUSE of why her body was holding weight.

Now she eats MORE than before and weighs less. Makes no sense to conventional thinking. Makes perfect sense to us. 🙌`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "30 pounds through ROOT CAUSE work, not restriction! This is the difference between treating symptoms vs treating the person. So proud! 💛", createdAt: "2026-01-12T11:00:00Z" }
        ]
    },
    {
        postType: "win",
        content: `Got my first 5-star Google review today! 🌟

Client wrote a whole paragraph about how I "actually listened" and "explained things clearly."

The bar is so low in healthcare. And it makes me sad.

But also motivated.

WE are the ones raising the bar. One client at a time.`,
        likes: 189,
        comments: [
            { name: "Sarah M.", content: "Those Google reviews are GOLD for attracting new clients! And yes, the bar is low. That's your competitive advantage - you actually CARE. 💛", createdAt: "2026-01-10T14:00:00Z" }
        ]
    },
    {
        postType: "win",
        content: `Update on my most skeptical client:

She's now my biggest referral source. 😂

She came in with arms crossed, "prove it to me."

8 weeks later, her brain fog is gone, her energy is back, she's sleeping through the night.

Now she sends me a new person every month.

Results speak louder than any marketing. Word of mouth is REAL.`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "The skeptics who convert become your BEST advocates! They had to be convinced, which means they really believe now. Love this! 💛", createdAt: "2026-01-08T10:30:00Z" }
        ]
    },

    // GRATITUDE STORIES (10)
    {
        postType: "gratitude",
        content: `I need to tell you about a moment I had yesterday.

I was in Whole Foods buying groceries. Nothing special. Just another Tuesday.

A woman stopped me. "Is that you?"

It was a client from 6 months ago. She came to me with:
- Chronic pain for 12 years
- Fibromyalgia diagnosis
- 4 different medications
- Zero hope

I almost didn't recognize her. She looked 10 years younger. She was GLOWING.

"I'm off 3 of my medications," she told me. "I sleep through the night now. I can play with my grandkids without hurting. You gave me my life back."

She hugged me in aisle 7. We both cried next to the organic spinach.

This certification changed what kind of healer I am.

Thank you, Sarah. Thank you, this community. ❤️`,
        likes: 521,
        comments: [
            { name: "Sarah M.", content: "Crying next to the organic spinach 😭 This is the most beautiful thing I've read all week. You didn't just help her - you gave her back her LIFE. This is legacy work. 🙏💛", createdAt: "2026-01-08T11:00:00Z" }
        ]
    },
    {
        postType: "gratitude",
        content: `Just want to say THANK YOU to this community.

When I was in Module 4 ready to quit, you all talked me off the ledge.

When I got my first negative review, you reminded me it's part of the journey.

When I doubted my pricing, you shared your experiences.

I couldn't have done this alone.

This isn't just a certification. It's a sisterhood. ❤️`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "The community here is what makes us different. We don't let each other fail. You showed up, you asked for help, and you succeeded. That's strength! 💛", createdAt: "2026-01-15T09:00:00Z" }
        ]
    },
    {
        postType: "gratitude",
        content: `One year certified today! 🎂

In that time:
- 52 clients helped
- $64,000 earned
- 0 regrets

Best investment I ever made in myself. Bar none.

To everyone in Module 1 feeling overwhelmed: keep going. 12 months from now, you'll be writing a post like this.

The work is worth it. The transformation is real. The impact is immeasurable.

Grateful doesn't even begin to cover it. 🙏`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "ONE YEAR! 52 clients! $64K! And zero regrets - that's the best part. You bet on yourself and WON. Happy anniversary! 💛🎉", createdAt: "2026-01-20T10:00:00Z" }
        ]
    },

    // TIPS & ADVICE (15)
    {
        postType: "tip",
        content: `PSA for everyone in the modules right now:

Take the assessments seriously. I know it's tempting to rush through.

But the case studies in Modules 12-15 are GOLD.

I literally use those frameworks with every client now.

Also: don't skip the Business Accelerator content. That's where the real magic is.

The health stuff is important. But knowing how to GET CLIENTS is what makes this a career vs a hobby.`,
        likes: 156,
        comments: [
            { name: "Sarah M.", content: "THIS! The business content is what separates practitioners who succeed from ones who struggle. Master both sides! 💛", createdAt: "2026-01-18T08:30:00Z" }
        ]
    },
    {
        postType: "tip",
        content: `Quick tip that changed everything for me:

Stop trying to help EVERYONE. Pick your niche.

I focus exclusively on women 40+ with thyroid issues now.

My content is specific. My marketing is specific. My results are specific.

Generalist = invisible
Specialist = in demand

What's your niche? 👇`,
        likes: 178,
        comments: [
            { name: "Sarah M.", content: "Niching down feels scary but it's SO powerful! You become the GO-TO expert instead of one of many. Great advice! 💛", createdAt: "2026-01-14T09:00:00Z" },
            { name: "Rebecca L.", content: "Gut health for busy moms is mine! Niching down tripled my bookings 🙌", createdAt: "2026-01-14T11:30:00Z" }
        ]
    },
    {
        postType: "tip",
        content: `Something I wish I knew earlier:

You don't need a fancy website to start. You don't need perfect branding. You don't need 10K followers.

You need ONE client. Then another. Then another.

I got my first 5 clients with no website, just conversations.

Start before you're ready. Figure it out as you go.

Perfectionism is procrastination in disguise. ✨`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "\"Perfectionism is procrastination in disguise\" 👏 I'm stealing that. So true! Start messy, improve as you go. 💛", createdAt: "2026-01-16T10:00:00Z" }
        ]
    },
    {
        postType: "advice",
        content: `Pricing advice from someone who learned the hard way:

1. Don't charge hourly - charge by outcome
2. Packages > single sessions
3. If no one says "that's expensive" you're too cheap
4. Your first price is probably too low

I doubled my rates 3 months in and got MORE clients. 🤯

Your knowledge is valuable. Price accordingly.`,
        likes: 198,
        comments: [
            { name: "Sarah M.", content: "When you doubled and got MORE clients - that's because higher prices signal higher value. People pay for transformation, not time. 💛", createdAt: "2026-01-12T09:30:00Z" }
        ]
    },
    {
        postType: "advice",
        content: `BEST DECISION I MADE:

Offering a free 15-min discovery call BEFORE booking paid sessions.

Filters out people who aren't serious. Gives me a chance to connect. And my conversion rate is 80%.

If you're not doing this, try it!

The "free" part isn't wasted time - it's the highest-ROI marketing you can do.`,
        likes: 167,
        comments: [
            { name: "Sarah M.", content: "Discovery calls are EVERYTHING. You get to qualify clients AND they get to feel your energy. Win-win! 💛", createdAt: "2026-01-10T08:00:00Z" }
        ]
    },
    {
        postType: "tip",
        content: `To my fellow introverts:

Yes, you can do this. No, you don't need to be a social media influencer.

Most of my clients come from:
- Word of mouth (40%)
- ASI Directory (35%)
- Local networking (25%)

Zero dancing on TikTok required 😅

Play to your strengths. Build real relationships. The clients will come.`,
        likes: 289,
        comments: [
            { name: "Sarah M.", content: "Introvert-friendly marketing! Love this. Your quiet competence IS your marketing. Let your results speak. 💛", createdAt: "2026-01-08T11:00:00Z" }
        ]
    },

    // STRUGGLE/REAL TALK (10)
    {
        postType: "struggle",
        content: `Real talk because I don't want anyone to think this was easy.

I failed the certification exam. Twice.

The first time, I was devastated. Cried for two days. Thought about quitting.

Sarah's response changed everything. She said: "You're not failing. You're learning."

Third time? PASSED with 94%.

Those "failures" made me a BETTER practitioner. I know this material backwards and forwards now.

Fail forward. Then succeed. 💪`,
        likes: 389,
        comments: [
            { name: "Sarah M.", content: "I remember those messages. Your fear and determination in the same breath. You didn't quit when most would have. That resilience? Your clients get to benefit from it now. 💛", createdAt: "2026-01-20T10:00:00Z" },
            { name: "Kimberly J.", content: "Taking the exam tomorrow. This is exactly what I needed. Even if I don't pass, I'll try again 🙏", createdAt: "2026-01-20T11:30:00Z" },
            { name: "Sarah M.", content: "@Kimberly - You've got this! Trust what you learned. Rooting for you! 🙌", createdAt: "2026-01-20T11:45:00Z" }
        ]
    },
    {
        postType: "struggle",
        content: `Being real for a sec:

This month was HARD. Lost 2 clients (moved away), had a no-show, and my confidence took a hit.

But I'm still here. Still showing up. Still learning.

Building a practice isn't linear. Some months are harder.

To anyone else having a tough month: you're not alone. We keep going. 🤍`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "The fact that you're being honest about a hard month while still showing up? That's what separates you from people who quit. Growth isn't linear. Keep going! 💛", createdAt: "2026-01-15T09:00:00Z" }
        ]
    },
    {
        postType: "struggle",
        content: `Imposter syndrome hit HARD today.

Had a potential client who's worked with "real doctors" ask why she should trust me.

It stung. But it also made me think.

We're not replacing doctors. We're filling a gap.

Doctors have 6 minutes. We have 60.
Doctors prescribe. We educate.
Doctors treat symptoms. We find causes.

Different role. Both valuable.

I went home and reviewed all my client wins. The imposter syndrome faded.

Remind yourself of your impact when doubt creeps in.`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "That question will come up again. And now you have your answer ready. We complement, not compete. Keep a 'wins folder' for exactly these moments! 💛", createdAt: "2026-01-12T10:30:00Z" }
        ]
    },

    // MINDSET (10)
    {
        postType: "mindset",
        content: `3 years ago I was scared to talk about health on social media.

"Who am I to give advice?"

Today I have 3,000 followers and a full practice.

The fear doesn't go away. You just do it scared.

Every post that felt risky was worth it. Every vulnerability built trust.

Don't wait until you're not scared. You'll wait forever.`,
        likes: 234,
        comments: [
            { name: "Sarah M.", content: "\"Do it scared\" should be our motto! Every successful practitioner I know started by posting before they felt ready. Courage before confidence! 💛", createdAt: "2026-01-16T08:30:00Z" }
        ]
    },
    {
        postType: "mindset",
        content: `Mindset shift that changed everything:

I stopped seeing other practitioners as competition.

They're colleagues. Resources. Friends.

There are SO many people who need help. More than enough for all of us.

Abundance mindset > scarcity mindset

Cheer others on. Collaborate. Rise together. 🙌`,
        likes: 189,
        comments: [
            { name: "Sarah M.", content: "The wellness industry is big enough for EVERYONE. Your success doesn't take from anyone else's. And theirs doesn't take from yours! 💛", createdAt: "2026-01-14T09:30:00Z" }
        ]
    },
    {
        postType: "mindset",
        content: `"But what if I fail?"

I used to ask myself this every day.

Now I ask: "What if I succeed?"

Same energy. Different direction.

Try it. See what shifts.

Your thoughts create your reality. Choose the ones that serve you. 🌟`,
        likes: 156,
        comments: [
            { name: "Sarah M.", content: "What if it all works out exactly as you hoped? What if you're meant for this? The questions we ask shape everything. 💛", createdAt: "2026-01-18T10:00:00Z" }
        ]
    }
];

async function main() {
    console.log("🧹 Clearing all existing graduate posts...");

    const deleted = await prisma.graduatePost.deleteMany({});
    console.log(`   Deleted ${deleted.count} existing posts`);

    console.log("\n🧟 Creating zombie profiles for stories...");

    // Get random zombie profiles from database (or create minimal ones if needed)
    let profiles = await prisma.zombieProfile.findMany({
        where: { isGraduate: true, isActive: true },
        take: 100
    });

    console.log(`   Found ${profiles.length} graduate zombie profiles`);

    // If no profiles, create some from our data
    if (profiles.length < STORIES.length) {
        console.log("   Creating additional zombie profiles...");

        const names = [
            "Frances H.", "Gloria C.", "Janet R.", "Virginia P.", "Ruth H.",
            "Jennifer M.", "Michelle R.", "Lisa P.", "Amanda L.", "Rachel T.",
            "Brittany M.", "Stephanie H.", "Nicole B.", "Christina W.", "Diana S.",
            "Maria T.", "Ashley C.", "Heather N.", "Kimberly J.", "Jessica F.",
            "Lauren D.", "Emily R.", "Megan A.", "Tiffany L.", "Danielle K.",
            "Amber W.", "Vanessa M.", "Crystal P.", "Natalie S.", "Brooke H.",
            "Courtney R.", "Melissa T.", "Andrea B.", "Whitney G.", "Lindsey N.",
            "Samantha J.", "Rebecca L.", "Erica D.", "Monica C.", "Chelsea A.",
            "Kayla M.", "Jasmine H.", "Brittney S.", "Alexis R.", "Taylor W.",
            "Morgan K.", "Paige T.", "Hannah B.", "Kelsey N.", "Caitlin P.",
            "Julia M.", "Grace L.", "Olivia S.", "Emma R.", "Patricia V.",
            "Sandra K.", "Katherine T.", "Laura H.", "Nancy M.", "Betty P.",
            "Margaret D.", "Susan B.", "Dorothy L.", "Helen G.", "Karen W.",
            "Donna F.", "Carol A.", "Ruth N.", "Sharon C.", "Michelle E.",
            "Laura J.", "Sarah B.", "Kimberly R.", "Deborah Y.", "Jessica U.",
            "Shirley O.", "Cynthia I.", "Angela Q."
        ];

        const locations = [
            "Phoenix, AZ", "Denver, CO", "San Diego, CA", "Albuquerque, NM", "Memphis, TN",
            "Austin, TX", "Seattle, WA", "Nashville, TN", "Miami, FL", "Chicago, IL",
            "Boston, MA", "Portland, OR", "Atlanta, GA", "Dallas, TX", "Charlotte, NC"
        ];

        const backgrounds = [
            "nurse", "mom", "teacher", "corporate", "pharmacist", "fitness trainer",
            "yoga instructor", "therapist", "physical therapist", "dietitian"
        ];

        const incomes = [
            "$5.2K/mo", "$6.4K/mo", "$7.1K/mo", "$8.5K/mo", "$9.2K/mo",
            "$5.8K/mo", "$6.9K/mo", "$7.6K/mo", "$8.1K/mo", "$10.3K/mo"
        ];

        const avatarBase = "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w";

        for (let i = 0; i < Math.min(STORIES.length - profiles.length, names.length); i++) {
            const profile = await prisma.zombieProfile.create({
                data: {
                    name: names[(profiles.length + i) % names.length],
                    location: locations[(profiles.length + i) % locations.length],
                    background: backgrounds[(profiles.length + i) % backgrounds.length],
                    incomeLevel: incomes[(profiles.length + i) % incomes.length],
                    avatar: avatarBase + `${i}000exym9ejtqjanj.png`,
                    personalityType: "leader",
                    tier: 1,
                    isGraduate: true,
                    isActive: true
                }
            });
            profiles.push(profile);
        }
    }

    console.log(`\n📝 Creating ${STORIES.length} graduate stories...`);

    for (let i = 0; i < STORIES.length; i++) {
        const story = STORIES[i];
        const profile = profiles[i % profiles.length];

        // Random date in past 60 days
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
                isPinned: i < 3 // Pin first 3 posts
            }
        });

        console.log(`   ✓ Created: ${story.postType} post by ${profile.name}`);
    }

    console.log(`\n✅ Done! Created ${STORIES.length} graduate stories`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
