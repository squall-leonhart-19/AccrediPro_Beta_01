/**
 * Add 50 More CRO Graduate Stories
 * Focus: Income, First Clients, Certificates, Transformations
 * Run: npx tsx Zombie_Profiles/scripts/seed-50-more-stories.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADDITIONAL_STORIES = [
    // === INCOME STORIES (15) ===
    {
        postType: "income_milestone",
        content: `$15,000 MONTH 🤯

Never thought I'd type this. Ever.

Here's my Board Certified journey:
- Mini Diploma: FREE (thank you Sarah!)
- Scholarship for Board Cert: Best decision ever
- Month 1 certified: $2,100
- Month 6: $8,400
- Month 12: $15,000

I was an ER nurse making $6K/month working 60 hours.

Now I make $15K working 25 hours. From home. In yoga pants.

The scholarship after Mini Diploma changed everything. Board Certification = premium pricing.

Doctors refer to me now. DOCTORS. 

Take the scholarship. Get Board Certified. Build your dream. 💰`,
        likes: 489,
        comments: [
            { name: "Sarah M.", content: "$15K/month AND doctor referrals! This is what Board Certification unlocks. Your nursing background + Board Cert = unstoppable! 💛🔥", createdAt: "2026-01-21T09:00:00Z" },
            { name: "Jennifer M.", content: "ER nurse here too. This is my sign. Taking the scholarship TODAY.", createdAt: "2026-01-21T11:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Just hit 6 figures annualized as a Board Certified Practitioner 🎉

$8,400/month x 12 = $100,800/year

From: Corporate marketing drone @ $62K
To: Board Certified Practitioner @ $100K+

Timeline:
- Found Mini Diploma (free)
- Sarah offered scholarship
- Got Board Certified
- Built practice in 9 months

The Mini Diploma was the appetizer. Board Certification was the main course.

If you're debating the scholarship... just DO IT.

One year from now you'll wish you started today. 📈`,
        likes: 412,
        comments: [
            { name: "Sarah M.", content: "SIX FIGURES! From $62K corporate to $100K+ Board Certified! This is the transformation I live for. The scholarship investment paid off 100x! 💛", createdAt: "2026-01-19T10:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Broke $5K/month while still working my day job 🙌

Here's the part-time Board Certified income breakdown:
- 8 clients
- Average package: $650
- Hours worked: 15/week
- Total: $5,200

Still employed. Building on the side. Will quit soon.

The scholarship for Board Certification made this possible.

You don't need to quit your job to start. Start small. Grow big.

Mini Diploma → Scholarship → Board Cert → Freedom (coming soon!) 💪`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "$5K/month PART-TIME is incredible! The Board Certification gives you earning power. Soon you'll be ready to go full-time. So proud! 💛", createdAt: "2026-01-17T08:30:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Month 3 of Board Certified practice: $7,800 💰

Breaking it down:
- 6 private clients @ $400/session = $2,400
- 2 packages sold @ $2,200 = $4,400
- 1 group program @ $1,000 = $1,000

All from my home office. All while my kids are at school.

The Board Certification opened doors Mini Diploma alone never would.

Sarah's scholarship made it accessible. The training made me competent. The certificate made me credible.

Worth every penny. Every minute. Every lesson.`,
        likes: 356,
        comments: [
            { name: "Sarah M.", content: "$7.8K in month 3! Multiple revenue streams already! This is what the Business Accelerator teaches in Board Cert. You're CRUSHING it! 💛", createdAt: "2026-01-15T09:30:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Real numbers from a real practitioner:

Investment: Scholarship price for Board Certification
Return in Year 1: $54,000

ROI: Let me just say... INSANE.

I was scared of the "investment." Now I laugh at that fear.

My first client paid 1/3 of the scholarship cost.
By week 3, I was profitable.
By month 3, I was thriving.

The Mini Diploma shows you WHAT's possible.
The Board Certification makes it REAL.

Stop being scared. Start being Board Certified. 📈`,
        likes: 378,
        comments: [
            { name: "Sarah M.", content: "$54K in year 1! And this is just the beginning. Year 2 will be even bigger. The scholarship ROI speaks for itself! 💛🔥", createdAt: "2026-01-12T10:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Single mom income update 🙏

Before Board Certification: Retail manager @ $2,800/month
After Board Certification: Practitioner @ $6,200/month

Same hours. DOUBLE the income. Working from home.

I can pick up my kids from school now.
I can attend their soccer games.
I can be PRESENT.

The scholarship made Board Certification possible on a single mom budget.

Sarah believed in me when I didn't believe in myself.

To all the single moms considering this: YOU CAN DO IT. 💕`,
        likes: 423,
        comments: [
            { name: "Sarah M.", content: "Single mom, doubled income, AND more present for your kids?! This is EVERYTHING. The scholarship was made for women like you. So proud! 💛🙏", createdAt: "2026-01-10T11:00:00Z" },
            { name: "Diana S.", content: "Fellow single mom here. How did you study with kids?", createdAt: "2026-01-10T14:00:00Z" },
            { name: "Sarah M.", content: "@Diana - The Board Cert is self-paced! Study when kids are asleep. You've got this! 💛", createdAt: "2026-01-10T14:30:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `From teacher salary to practitioner salary:

Old: $52K/year (after 12 years!)
New: $52K in 6 MONTHS

That's double the annual income rate.

The path was simple:
1. Mini Diploma (free)
2. Scholarship for Board Certification
3. Built practice
4. Quit teaching this semester

My students inspired me to help people.
My Board Certification gave me the tools.

To all the teachers feeling stuck: there's another way. 🍎➡️💰`,
        likes: 367,
        comments: [
            { name: "Sarah M.", content: "$52K in 6 months = $104K annual rate! More than DOUBLE your teacher salary! The Board Certification was worth it, wasn't it? 💛", createdAt: "2026-01-08T09:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `Week 1 as Board Certified: $1,400
Week 2: $2,100
Week 3: $1,800
Week 4: $2,400

MONTH 1 TOTAL: $7,700 🎉

I didn't have a website.
I didn't have a fancy logo.
I just had my Board Certification + Facebook.

Posted "I'm officially Board Certified!" and the DMs flooded in.

Credentials → Trust → Clients → Income

The scholarship was the best investment. Bar none.`,
        likes: 389,
        comments: [
            { name: "Sarah M.", content: "$7.7K your FIRST MONTH with just Facebook! Credentials = trust = clients. The Board Certification pays for itself FAST! 💛🔥", createdAt: "2026-01-06T10:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `12 month Board Certified anniversary income report:

Month 1: $1,200
Month 3: $3,400
Month 6: $5,800
Month 9: $8,100
Month 12: $11,200

Average: $5,940/month
Total Year 1: $71,280

From ZERO to $71K in one year.

The Mini Diploma sparked the dream.
The scholarship made it real.
The Board Certification built the career.

To anyone who finished Mini Diploma: TAKE THE NEXT STEP. 🚀`,
        likes: 456,
        comments: [
            { name: "Sarah M.", content: "$71K in year 1! And your trajectory shows you'll hit $100K+ in year 2. The compound growth is beautiful. Happy anniversary! 💛🎉", createdAt: "2026-01-04T09:00:00Z" }
        ]
    },
    {
        postType: "income_milestone",
        content: `$3K month. I know it's not huge, but...

6 months ago I made $0 from health work.
I had zero credentials.
I had zero confidence.

Then: Mini Diploma → Scholarship → Board Certification

Now: $3K month. Working 12 hours/week. Part-time.

It's growing. Every month better than the last.

Small wins matter. Momentum is building.

To anyone feeling behind: $3K is still $3K more than before. Keep going. 💪`,
        likes: 267,
        comments: [
            { name: "Sarah M.", content: "$3K part-time is AMAZING! And you're just getting started. The foundation is set. The growth will come. So proud of you! 💛", createdAt: "2026-01-18T11:00:00Z" }
        ]
    },

    // === FIRST CLIENT STORIES (10) ===
    {
        postType: "first_client",
        content: `FIRST CLIENT SIGNED! 😭

$2,100 for 12-week package.

How it happened:
- Finished Mini Diploma
- Got Sarah's scholarship for Board Certification
- Got Board Certified last month
- Posted on Instagram: "I'm officially certified!"
- Friend's mom DM'd: "Can you help me?"

One post. One DM. $2,100.

Being Board Certified gave her CONFIDENCE to pay that much.

"I trust you because you're actually certified" - her exact words.

Mini Diploma → Scholarship → Board Cert → First client. The path works! 🙏`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "$2,100 first client from ONE Instagram post! The Board Certification = trust = premium pricing. This is what 'credentials matter' looks like! 💛", createdAt: "2026-01-20T10:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `First discovery call as Board Certified practitioner...

I was SHAKING. Imposter syndrome screaming.

But I used the script from the training. I asked the right questions. I LISTENED.

She signed a $1,500 package.

On the spot.

The Board Certification gave me the tools AND the confidence.

If you're nervous about getting clients - the training prepares you. Just follow the scripts.

Mini Diploma teaches you WHAT. Board Certification teaches you HOW. 💪`,
        likes: 278,
        comments: [
            { name: "Sarah M.", content: "You used the discovery call script from Board Cert training and it WORKED! That's exactly what it's for. So proud you pushed through the nerves! 💛", createdAt: "2026-01-16T09:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `First paying client came from... CHURCH! 😂

Mentioned to a friend after service that I'm now Board Certified.

Her response: "My daughter needs you. She's been suffering for years."

Booked a call that night. Signed $1,200 package that week.

Clients are EVERYWHERE. You just have to tell people what you do.

The Board Certification gave me something REAL to talk about.

"I'm Board Certified in Functional Medicine" opens doors that "I took a course" never would.`,
        likes: 256,
        comments: [
            { name: "Sarah M.", content: "Your community is full of potential clients! Church, neighbors, gym friends - everyone knows someone who's suffering. Board Certification = credibility! 💛", createdAt: "2026-01-14T11:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `Client #1: My skeptical sister 😅

She didn't believe in "this alternative stuff."

But she'd been dealing with bloating for 3 years. Doctors found nothing.

I said: "Let me help. Free. Just let me practice."

6 weeks later: Bloating GONE.

She paid me anyway. $500. And referred 3 friends.

Now I have 4 paying clients. All from ONE skeptic.

Board Certification gave me the knowledge to actually HELP.

Even skeptics can't argue with results.`,
        likes: 298,
        comments: [
            { name: "Sarah M.", content: "Skeptic sister → biggest referral source! Results speak louder than credentials. But credentials GOT you the chance. Love this! 💛", createdAt: "2026-01-12T10:30:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `My first client found me on the ASI Directory! 🎉

She searched for Board Certified practitioners in her area.

MY NAME CAME UP.

Because I'm Board Certified. Listed professionally. The real deal.

She said: "I specifically looked for someone with Board Certification. Not just a coach."

$400 for initial consult. $1,800 package signed.

Being listed in the directory as BOARD CERTIFIED = clients finding YOU.

Mini Diploma is great. Board Cert gets you in the directory. The directory gets you clients.`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "The ASI Directory is a goldmine! Clients actively searching for Board Certified practitioners = high-quality leads. This is the power of real credentials! 💛", createdAt: "2026-01-10T09:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `5 clients in 2 weeks post-certification 🤯

Here's what I did:
1. Posted "I'M BOARD CERTIFIED" on FB
2. Messaged 20 people I knew with health issues
3. Offered free discovery calls
4. Followed the sales scripts from training

Result:
- 8 discovery calls
- 5 signed packages
- $4,200 in the bank

The Board Certification training doesn't just teach health. It teaches BUSINESS.

Sarah thought of everything. 💪`,
        likes: 356,
        comments: [
            { name: "Sarah M.", content: "5 clients in 2 weeks using EXACTLY what we teach! The Business Accelerator in Board Cert = real results. You followed the system and it WORKED! 💛🔥", createdAt: "2026-01-08T10:00:00Z" }
        ]
    },
    {
        postType: "first_client",
        content: `First corporate client! 🏢

A local company hired me to do a wellness workshop. $1,500 for 2 hours.

They found me on LinkedIn.

They said: "We wanted someone Board Certified, not just a wellness coach."

CREDENTIALS MATTER.

This wouldn't have happened with just Mini Diploma completion.

Board Certification = professional opportunities.

The scholarship was the best $X I ever spent. (Can't even remember the exact amount because the ROI is infinite!) 📈`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "CORPORATE CLIENTS! $1500 for 2 hours! This is what Board Certification unlocks - professional opportunities that require REAL credentials. So proud! 💛", createdAt: "2026-01-06T11:00:00Z" }
        ]
    },

    // === CERTIFICATE STORIES (10) ===
    {
        postType: "certificate",
        content: `THE EMAIL CAME: BOARD CERTIFIED!! 🎓🎉

I'm literally crying typing this.

My journey:
- Found Mini Diploma on Instagram (FREE!)
- Finished all 9 lessons in 3 weeks
- Sarah offered scholarship for Board Certification
- Studied every evening for 4 months
- PASSED my Board exam!

I'm now officially a Board Certified Functional Medicine Practitioner.

This is REAL. These are REAL credentials.

To everyone still in Mini Diploma: finish it. Take the scholarship. This could be your email next. 💛`,
        likes: 445,
        comments: [
            { name: "Sarah M.", content: "CONGRATULATIONS!! 🎉 From Instagram scroll to Board Certified! You did the work. Welcome to the family of certified practitioners! 💛🙏", createdAt: "2026-01-22T09:00:00Z" }
        ]
    },
    {
        postType: "certificate",
        content: `Printed my Board Certification and FRAMED IT 🖼️

It's hanging in my new home office.

Every time I have a client call, I see it.

It reminds me: "You earned this. You're qualified. You belong here."

The Mini Diploma sparked the dream.
The scholarship made it possible.
The Board Certification made it official.

If you're doubting whether to pursue certification... LOOK at that frame. It's worth it.`,
        likes: 312,
        comments: [
            { name: "Sarah M.", content: "Frame it! You EARNED those credentials. Let it remind you every day that you're a real practitioner. So proud! 💛", createdAt: "2026-01-20T10:00:00Z" }
        ]
    },
    {
        postType: "certificate",
        content: `Passed my Board exam on the FIRST TRY! 🎉

Score: 92%

I was SO nervous. Studied like crazy.

But the training prepared me perfectly.

Here's my study routine:
- Watched each module twice
- Took detailed notes
- Did all practice quizzes
- Reviewed case studies
- Used the study guide

The scholarship gave me access. My effort gave me results.

Board Certified. Official. Ready to help people.

To everyone studying: YOU CAN DO THIS. The exam is fair if you do the work. 📚`,
        likes: 378,
        comments: [
            { name: "Sarah M.", content: "92% first try! Your dedication shows. The training works when you work it. CONGRATULATIONS and welcome to the certified family! 💛🎓", createdAt: "2026-01-18T11:00:00Z" }
        ]
    },
    {
        postType: "certificate",
        content: `Board Certified at 55 years old 🎓

They said I was too old.
They said start something new at this age is crazy.
They said just wait for retirement.

I didn't listen.

Mini Diploma: DONE
Scholarship: ACCEPTED
Board Certification: EARNED

Age is just a number. Credentials are forever.

To everyone over 50 thinking "it's too late" - it's NOT.

Get the Mini Diploma. Take the scholarship. Get Board Certified.

Your best chapter is ahead. 🙌`,
        likes: 423,
        comments: [
            { name: "Sarah M.", content: "55 is the PERFECT age! Your life experience + Board Certification = wisdom your clients desperately need. Age is your superpower! 💛", createdAt: "2026-01-16T09:30:00Z" }
        ]
    },
    {
        postType: "certificate",
        content: `Failed once. Passed today. BOARD CERTIFIED! 🎓

First attempt: 68% (needed 70%)

I cried. I almost quit.

Then Sarah messaged: "You're 2% away. You've got this."

Studied for 3 more weeks. Retook the exam.

Score: 84%

The scholarship includes retake. Sarah doesn't give up on us.

Failure is feedback. Keep going.

To anyone who failed: TRY AGAIN. Board Certification is worth the struggle. 💪`,
        likes: 356,
        comments: [
            { name: "Sarah M.", content: "From 68% to 84%! You turned failure into fuel. That resilience will serve your clients well. CONGRATULATIONS! 💛🙏", createdAt: "2026-01-14T10:00:00Z" }
        ]
    },
    {
        postType: "certificate",
        content: `My husband's reaction when I got Board Certified: 😭

He was skeptical when I started the Mini Diploma.

"Another online course?" he said.

But when I:
- Finished Mini Diploma (impressed)
- Got the scholarship (surprised)
- Studied every night (proud)
- PASSED the Board exam (tears)

He said: "I'm so proud of you. This is REAL."

Board Certification silences the doubters.

Now he tells everyone about his "Board Certified wife." 😊`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "Skeptical husband → biggest cheerleader! That's what REAL credentials do. They speak for themselves. So happy for you! 💛", createdAt: "2026-01-12T11:00:00Z" }
        ]
    },
    {
        postType: "certificate",
        content: `The moment I clicked "SUBMIT" on my Board exam...

My heart was POUNDING.

Waited 3 days for results.

Checked email obsessively.

Then it came: "Congratulations! You have successfully passed..."

SCREAMED. Cried. Called my mom.

From scrolling Instagram aimlessly to BOARD CERTIFIED PRACTITIONER.

The Mini Diploma was the spark.
The scholarship was the opportunity.
The Board Certification is the achievement.

I DID IT. You can too. 🎓`,
        likes: 398,
        comments: [
            { name: "Sarah M.", content: "That moment when you open the email... nothing like it! You EARNED this. Welcome to your new identity: Board Certified Practitioner! 💛🎉", createdAt: "2026-01-10T09:00:00Z" }
        ]
    },

    // === TRANSFORMATION STORIES (15) ===
    {
        postType: "transformation",
        content: `From receptionist to Board Certified Practitioner.

Old life:
- $15/hour
- No future
- Answering phones
- Someone else's dream

New life:
- $200+/hour (effective rate)
- Building MY practice
- Changing lives
- MY dream

The bridge?

Mini Diploma (free) → Scholarship → Board Certification

Sarah showed me what's possible. The training showed me how. The certificate makes it official.

If you feel stuck in a job you hate: there IS another way. 🦋`,
        likes: 378,
        comments: [
            { name: "Sarah M.", content: "From $15/hour to $200+/hour effective rate! From someone else's dream to YOUR dream! This is the transformation story I LIVE for! 💛", createdAt: "2026-01-21T10:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `6 months ago: Crying in my car after nursing shifts
Today: Board Certified Practitioner with my own hours

The burnout was real. 12-hour shifts. Short staffing. No breaks. Patients suffering, system failing.

I needed OUT.

Then I found the Mini Diploma. FREE. Eye-opening.

Sarah offered the scholarship. I said YES without hesitation.

Board Certification took 4 months. I studied before and after shifts.

Now I help people HEAL. Actually heal. Root causes, not band-aids.

Nursing skills + Board Certification = powerful combination.

To all the burnt-out nurses: your escape exists. Take it. 💛`,
        likes: 445,
        comments: [
            { name: "Sarah M.", content: "Burnt-out nurse → Board Certified Practitioner! Your clinical skills + FM training = POWERFUL. You're still a healer, just without the broken system! 💛🙏", createdAt: "2026-01-19T09:00:00Z" },
            { name: "Lisa P.", content: "ER nurse here, completely burned out. This is my sign. Starting Mini Diploma tonight.", createdAt: "2026-01-19T12:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `My doctor asked how I lost weight and reversed my prediabetes.

I said: "I learned functional medicine and healed myself first."

She said: "Are you a practitioner?"

I showed her my Board Certification.

She said: "Can I refer patients to you?"

From PATIENT → PRACTITIONER → getting REFERRALS from my own doctor.

The Mini Diploma taught me to heal myself.
The Board Certification made me official.

Now I help others do what I did. Full circle. 🙏`,
        likes: 467,
        comments: [
            { name: "Sarah M.", content: "Your own DOCTOR is referring patients to you! Because you're BOARD CERTIFIED. You healed yourself, then got credentialed to heal others. This is the ultimate story! 💛🔥", createdAt: "2026-01-17T10:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Corporate ladder → Board Certified freedom

What I gave up:
- $85K salary
- Health benefits
- "Security"
- My soul

What I gained:
- $95K+ potential (already on pace)
- Time freedom
- Work I love
- My LIFE back

The transition:
Mini Diploma while employed → Scholarship → Board Cert while employed → Built side practice → QUIT

It's possible. It's happening. I'm proof. 🚀`,
        likes: 389,
        comments: [
            { name: "Sarah M.", content: "On pace for MORE than corporate salary with TIME FREEDOM?! The Board Certification was your exit ticket. So proud you took the leap! 💛", createdAt: "2026-01-15T11:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `My kids don't recognize me anymore.

Old mom:
- Exhausted after work
- No energy for them
- Always stressed
- "Not now, mommy's tired"

New mom (Board Certified Practitioner):
- Energized from meaningful work
- Present and engaged
- Calm and fulfilled
- "Let's play!"

Same me. Different path.

Mini Diploma opened my eyes.
Board Certification opened my schedule.

Being Board Certified means I control my hours. I control my life.

Best gift I ever gave my kids: a happy mom. 💕`,
        likes: 412,
        comments: [
            { name: "Sarah M.", content: "\"Best gift I ever gave my kids: a happy mom\" - I'm CRYING. The Board Certification isn't just about career. It's about LIFE. 💛🙏", createdAt: "2026-01-13T09:30:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Before: Skeptical of "online certifications"
After: Board Certified with real clients and real income

I was the biggest skeptic. "Is this legit? Is it recognized? Will anyone take me seriously?"

Then I:
- Took Mini Diploma (free, surprisingly deep)
- Researched the Board Certification
- Talked to Sarah directly
- Made the leap

Now:
- Listed in professional directory
- Doctors refer to me
- Clients trust me
- Making $6K+/month

It's real. The certification is real. The income is real.

Take the leap, skeptics. I was you. 🙌`,
        likes: 334,
        comments: [
            { name: "Sarah M.", content: "Skeptic → believer → Board Certified! You did your research and found it's legit. Now you're living proof! 💛", createdAt: "2026-01-11T10:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Divorce → Board Certification → New Life

After my divorce, I had nothing:
- No career (stayed home for 15 years)
- No income
- No identity outside "wife"

I was terrified.

Then I found the Mini Diploma. Free. Something to fill my time.

It became my PURPOSE.

Sarah offered the scholarship. I had no excuse not to try.

18 months later: Board Certified. $5K+/month. New apartment. New life.

Sometimes the worst thing leads to the best thing.

To anyone going through hard times: invest in yourself. Get certified. 💛`,
        likes: 445,
        comments: [
            { name: "Sarah M.", content: "From having 'nothing' to Board Certified with $5K+/month! You didn't just survive the hard time - you TRANSFORMED through it. So incredibly proud! 💛🙏", createdAt: "2026-01-09T11:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `What my business card used to say: "Administrative Assistant"

What it says now: "Board Certified Functional Medicine Practitioner"

The difference? 
- Mini Diploma (free)
- Scholarship for Board Cert
- 4 months of dedication
- One exam

That's it. No 4-year degree. No $100K student loans.

A clear pathway that WORKS.

From admin → practitioner. From $40K → $80K+ trajectory.

Your title can change. Your income can change. You just have to START.

Mini Diploma is free. What's your excuse? 🚀`,
        likes: 367,
        comments: [
            { name: "Sarah M.", content: "New business card, new identity, new income trajectory! The Board Certification pathway is designed for career changers. You're proof it works! 💛", createdAt: "2026-01-07T09:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `3 years postpartum. Lost. Depressed. No identity.

"Mom" was all I was. And I was drowning.

The Mini Diploma gave me something for ME.

The scholarship gave me a goal.

The Board Certification gave me an IDENTITY.

Now? I'm a Board Certified Practitioner who's ALSO a mom.

Not "just" a mom. A practitioner AND a mom.

Both matter. Both are real.

To the moms feeling lost: you can do this. I did. 💜`,
        likes: 398,
        comments: [
            { name: "Sarah M.", content: "Finding yourself through Board Certification while being an amazing mom! You're showing your kids what's possible. So proud! 💛", createdAt: "2026-01-05T10:30:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Before and after, by the numbers:

BEFORE (burnt-out therapist):
- $3,800/month salary
- 40+ clients/week
- Compassion fatigue
- Barely surviving

AFTER (Board Certified FM Practitioner):
- $7,200/month (and growing)
- 12 clients/week
- Energized by work
- THRIVING

Same person. Different path.

Mini Diploma → Scholarship → Board Certification → Freedom

The credentials matter. The income is real. The life is better.

Make the switch. 🦋`,
        likes: 423,
        comments: [
            { name: "Sarah M.", content: "From 40 clients/week to 12 while DOUBLING your income?! This is the power of Board Certification. Less burnout, more money. 💛🔥", createdAt: "2026-01-03T09:00:00Z" }
        ]
    },
    {
        postType: "transformation",
        content: `Age 48: "I'm too old to change careers"
Age 49: Enrolled in Mini Diploma
Age 49.5: Board Certification scholarship accepted
Age 50: BOARD CERTIFIED 🎓
Age 50.5: $6K+/month practice

Never too old. Never too late.

The scholarship doesn't have an age limit.
The Board exam doesn't ask your birthday.
Clients don't care how old you are (they actually prefer wisdom!)

To everyone 45, 50, 55+: YOUR TIME IS NOW.

Mini Diploma is free. What are you waiting for? 🙌`,
        likes: 456,
        comments: [
            { name: "Sarah M.", content: "Started at 48, Board Certified at 50, thriving at 50.5! Age is EXPERIENCE. Your clients get WISDOM. Never too late! 💛🎉", createdAt: "2026-01-01T10:00:00Z" }
        ]
    }
];

async function main() {
    console.log("📝 Adding 50 more CRO-optimized graduate stories...\n");

    let profiles = await prisma.zombieProfile.findMany({
        where: { isGraduate: true, isActive: true },
        take: 100
    });
    console.log(`Found ${profiles.length} graduate profiles\n`);

    let created = 0;
    for (let i = 0; i < ADDITIONAL_STORIES.length; i++) {
        const story = ADDITIONAL_STORIES[i];
        const profile = profiles[(i + 21) % profiles.length]; // Offset to use different profiles

        const daysAgo = Math.floor(Math.random() * 90) + 1;
        const postedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        await prisma.graduatePost.create({
            data: {
                profileId: profile.id,
                postType: story.postType,
                content: story.content,
                likes: story.likes + Math.floor(Math.random() * 100),
                comments: story.comments as any,
                postedAt,
                isActive: true,
                isPinned: false
            }
        });

        console.log(`✓ ${story.postType}: ${profile.name}`);
        created++;
    }

    console.log(`\n✅ Added ${created} new stories (total now: ~71 stories)`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
