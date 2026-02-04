import prisma from "@/lib/prisma";

/**
 * Seed the 30-day Masterclass templates for Functional Medicine niche.
 * 
 * Each day has:
 * - Sarah's message (with optional audio URL)
 * - Zombie messages (staggered throughout day)
 * - Gap topic that creates need for paid product
 */
export async function seedMasterclassTemplates() {
    const templates = [
        // DAY 1: Getting Clients
        {
            nicheCategory: "functional-medicine",
            dayNumber: 1,
            lessonTitle: "How Practitioners Get Their First Client in 7 Days",
            sarahMessage: `Good morning {firstName}! 🌟

Welcome to Day 1 of your Private Practitioner Masterclass!

I'm SO excited you scored 90%+ on your exam - that tells me you're serious about this.

Today's lesson: **How real practitioners land their first paying client in 7 days or less.**

Here's the truth most people don't tell you: Getting clients isn't about having the fanciest website or the most certifications. It's about ONE thing...

**Being visible to the RIGHT people at the RIGHT time.**

I'll show you exactly how to do that.

Watch for today's video lesson, and feel free to reply if you have any questions!

— Sarah 💕`,
            zombieMessages: [
                { hour: 2, content: "Hey {firstName}! Saw you passed the exam too! Congrats! 🎉 This masterclass is incredible so far" },
                { hour: 6, content: "Did you watch Sarah's Day 1 lesson? The part about being visible to the right people really hit me..." },
            ],
            gapTopic: "client_acquisition",
            gapDescription: "Need a system to consistently attract clients",
            includesOffer: false,
        },

        // DAY 2: Professional Website
        {
            nicheCategory: "functional-medicine",
            dayNumber: 2,
            lessonTitle: "The Website That Converts: What Creates Trust",
            sarahMessage: `Morning {firstName}! ☀️

Day 2 - let's talk about something that trips up MOST new practitioners...

**Your online presence.**

Here's what I've learned after helping hundreds of students launch: The practitioners who succeed aren't the ones with the BEST clinical knowledge...

They're the ones who LOOK professional from day one.

Your potential clients are making snap judgments. In less than 3 seconds, they decide: "Is this person legit?"

Today I'm breaking down:
- The 5 elements every practitioner website MUST have
- Why your Instagram bio might be costing you clients
- The #1 trust killer (hint: it's not what you think)

Check the lesson and let me know what resonates!

— Sarah`,
            zombieMessages: [
                { hour: 1, content: "Oof, Sarah's lesson today made me realize my Instagram looks SO unprofessional 😬" },
                { hour: 5, content: "I don't even have a website yet... do you? Feeling a bit behind" },
                { hour: 8, content: "How are you feeling about all this? I'm excited but also a little overwhelmed lol" },
            ],
            gapTopic: "website",
            gapDescription: "Need a professional website to look credible",
            includesOffer: false,
        },

        // DAY 3: Pricing Framework
        {
            nicheCategory: "functional-medicine",
            dayNumber: 3,
            lessonTitle: "Pricing Your Services: The $150/hr Framework",
            sarahMessage: `{firstName}, let's talk money 💰

Day 3 is about something people feel uncomfortable discussing: **PRICING.**

Here's what I want you to know upfront: You deserve to be paid well for the transformation you provide.

But I also know the voice in your head saying: "Who am I to charge that much?"

Today I'm sharing my exact pricing framework - the same one I teach to practitioners who now charge $150-300/hour.

Key insights:
- Why charging too little HURTS your clients
- The psychology of premium pricing
- How to structure packages that sell

One important note: To charge premium prices, you need to LOOK like a premium provider. This is where credentials matter...

Watch today's lesson and tell me: What's holding you back from charging what you're worth?

— Sarah 💕`,
            zombieMessages: [
                { hour: 2, content: "Okay Day 3 got me thinking... I have NO idea what to charge 😅" },
                { hour: 7, content: "Sarah mentioned needing credentials to charge premium... makes sense. I wonder if the Level 1 certification helps with that?" },
            ],
            gapTopic: "pricing_credentials",
            gapDescription: "Need professional credentials to justify premium pricing",
            includesOffer: false,
        },

        // DAY 4: Legal Protection
        {
            nicheCategory: "functional-medicine",
            dayNumber: 4,
            lessonTitle: "Legal Protection: The #1 Mistake New Practitioners Make",
            sarahMessage: `{firstName}, today's lesson is serious. But important. ⚠️

**Day 4: The legal stuff no one talks about.**

I've seen too many passionate practitioners get their dreams crushed because they didn't protect themselves legally.

Real talk: When you work with clients on their health, you carry liability. One unhappy client, one misunderstanding, one scope-of-practice violation...

...and everything you've built can disappear.

Today I'm covering:
- Consent forms you MUST have before working with anyone
- Scope of practice boundaries (what you can/can't do)
- The insurance question
- Client agreements that protect you

This isn't meant to scare you. It's meant to PREPARE you.

The good news? When you have the right protections in place, you can serve clients with complete confidence.

Watch today's lesson carefully.

— Sarah`,
            zombieMessages: [
                { hour: 1, content: "Okay Day 4 freaked me out a little... I hadn't thought about the legal stuff at all 😰" },
                { hour: 4, content: "Do you have any legal forms set up? I literally have nothing..." },
                { hour: 9, content: "Sarah mentioned client agreements and consent forms. I wouldn't even know where to start writing those" },
            ],
            gapTopic: "legal_protection",
            gapDescription: "Need proper legal documents to protect practice",
            includesOffer: false,
        },

        // DAY 5: Sales Scripts
        {
            nicheCategory: "functional-medicine",
            dayNumber: 5,
            lessonTitle: "Your First Discovery Call: The Script That Closes",
            sarahMessage: `{firstName}! Day 5 is one of my favorites 🎯

Today: **How to have discovery calls that convert WITHOUT being salesy.**

This is where so many practitioners freeze up. You're great at helping people with health... but SELLING feels icky, right?

I get it. I felt the same way.

Here's what changed everything for me: Selling isn't convincing. Selling is SERVING.

When you have a conversation framework that genuinely helps people see their own transformation, closing becomes natural.

Today I'm giving you:
- My exact 30-minute discovery call structure
- The questions that uncover true motivation
- How to present your offer without feeling pushy
- What to say when they need "time to think"

After today, you'll never dread sales calls again.

— Sarah 💕`,
            zombieMessages: [
                { hour: 2, content: "The sales call script is 🔥 I've literally been avoiding calls because I didn't know what to say" },
                { hour: 7, content: "Have you ever done a discovery call before? I'm nervous but Sarah's framework makes it seem less scary" },
            ],
            gapTopic: "sales_systems",
            gapDescription: "Need sales scripts and call frameworks",
            includesOffer: false,
        },

        // DAY 6: Getting Found
        {
            nicheCategory: "functional-medicine",
            dayNumber: 6,
            lessonTitle: "Getting Found: Google, LinkedIn & Referrals",
            sarahMessage: `Day 6, {firstName}! 🌍

Today we talk about **visibility** - how do people actually FIND you?

You can be the best practitioner in the world... but if no one knows you exist, you can't help anyone.

Today's lesson covers:
- Google Business Profile (free and SO underrated)
- LinkedIn optimization for practitioners
- How to turn every client into 3 referrals
- The social media strategy that works

One thing I want you to notice: All of these strategies work BETTER when you have a professional presence set up first (website, credentials, etc.)

It's all connected.

Let me know what visibility strategy excites you most!

— Sarah`,
            zombieMessages: [
                { hour: 3, content: "I don't even have a Google Business Profile 😬 Adding that to my to-do list" },
                { hour: 6, content: "My LinkedIn is basically empty... need to work on that" },
                { hour: 10, content: "Everything Sarah teaches makes sense but I feel like I need to get SO MUCH set up before I can really start" },
            ],
            gapTopic: "visibility_profiles",
            gapDescription: "Need professional profiles and SEO setup",
            includesOffer: false,
        },

        // DAY 7: Case Study (Zombie's Success)
        {
            nicheCategory: "functional-medicine",
            dayNumber: 7,
            lessonTitle: "From Foundation to First Client: A Real Story",
            sarahMessage: `{firstName}, Day 7 is special 🌟

Today I'm sharing a real story from someone just like you.

She started exactly where you are - Foundation certification complete, excited but unsure about next steps.

Within 30 days of getting the full setup (website, legal protection, credentials), she landed her first paying client at $200 for a 6-week program.

Within 60 days? She had 4 clients and was earning $2,400/month on the side of her day job.

Today's lesson breaks down:
- Her exact journey and timeline
- What she did first (and why)
- The mistakes she avoided
- Her advice for you

The gap between where you are and where she is? It's smaller than you think.

Watch today's lesson. I think it'll inspire you.

— Sarah 💕`,
            zombieMessages: [
                { hour: 1, content: "Okay that case study hit different... she was literally just like us a few weeks ago" },
                { hour: 5, content: "I've been thinking a lot about this. Like, what's actually stopping us from doing what she did?" },
                { hour: 8, content: "Did Sarah mention anything to you about the full certification? I'm curious what that actually includes" },
            ],
            gapTopic: "implementation_gap",
            gapDescription: "Success is close but need full implementation support",
            includesOffer: false,
        },

        // DAY 8: SCHOLARSHIP REVEAL
        {
            nicheCategory: "functional-medicine",
            dayNumber: 8,
            lessonTitle: "A Special Announcement for High Achievers",
            sarahMessage: `{firstName}, I have something important to share with you. 🎓

Over the past 7 days, you've learned:
✓ How practitioners get clients
✓ What creates trust and credibility
✓ How to price your services
✓ Legal protection essentials
✓ Sales call frameworks
✓ Visibility strategies
✓ A real success story

Here's what I've been holding back...

I've shown you WHAT to do. But I haven't shown you HOW to implement it all.

That's intentional. Because implementation is where most people get stuck.

**Today I'm opening something special for high achievers like you.**

Because you scored 90%+ on your Foundation exam, AccrediPro University has approved you for the **High Achiever Scholarship**.

This gives you access to the complete "Certified & Earning" package - everything you need to be certified, legally protected, with a professional website live, and ready for paying clients.

Normal price: $1,997
**Your scholarship price: $497 + 6 monthly payments**

I'll send details shortly. This scholarship is only available for 7 days.

— Sarah 💕`,
            zombieMessages: [
                { hour: 1, content: "OMG did you see Sarah's message?! She mentioned a scholarship for people who scored 90%+ 👀" },
                { hour: 4, content: "I'm looking at the Certified & Earning package... it's literally everything we've been talking about needing" },
                { hour: 8, content: "I'm seriously considering it. The payment plan makes it pretty doable honestly" },
            ],
            gapTopic: "scholarship_reveal",
            gapDescription: "Scholarship opportunity revealed - limited time",
            includesOffer: true,
            offerType: "scholarship_reveal",
        },

        // DAY 9-14: Scholarship window continues...
        // (Adding key days)

        // DAY 11: Zombie Buys
        {
            nicheCategory: "functional-medicine",
            dayNumber: 11,
            lessonTitle: "Building Your Client Pipeline",
            sarahMessage: `Day 11, {firstName}! 

Today's lesson: Creating a steady flow of potential clients (not just random inquiries).

A pipeline means you're never desperate for the next client. You always have people moving toward working with you.

Key concepts:
- The awareness → interest → trust → buy journey
- Where to focus your energy at each stage
- Weekly activities that compound over time

This is the difference between "waiting for clients" and "choosing clients."

— Sarah`,
            zombieMessages: [
                { hour: 1, content: "Okay so... I did it! 💫 I enrolled in the full Certified & Earning program!!" },
                { hour: 3, content: "I'm SO nervous but also excited. Already got access to the legal templates and they're sending my website draft this week" },
                { hour: 7, content: "Have you decided what you're doing? No pressure, just curious! Would be cool to go through this together 😊" },
            ],
            gapTopic: "client_pipeline",
            gapDescription: "Need systematic approach to client acquisition",
            includesOffer: true,
            offerType: "scholarship_reminder",
        },

        // DAY 14: Scholarship Expires
        {
            nicheCategory: "functional-medicine",
            dayNumber: 14,
            lessonTitle: "Scaling Beyond 1:1 Sessions",
            sarahMessage: `{firstName}, important reminder...

Today's lesson is about scaling beyond 1:1 work - group programs, digital products, passive income.

But first: **Your High Achiever Scholarship expires at midnight tonight.**

If you've been thinking about the Certified & Earning package, today is the last day for the $497 + payment plan pricing.

After tonight: $1,997 full price.

I don't say this to pressure you. I say it because I've seen too many people "wait until later" and never take action.

The practitioners who succeed? They move fast when opportunities present themselves.

Whatever you decide, I'm here for you.

— Sarah 💕`,
            zombieMessages: [
                { hour: 2, content: "Just a heads up - Sarah said the scholarship thing expires tonight. So glad I locked it in already!" },
                { hour: 6, content: "My website draft came in and it looks SO professional. I literally cried a little 😭" },
                { hour: 10, content: "No pressure at all, but did you decide about the scholarship? Just don't want you to miss out if you were interested!" },
            ],
            gapTopic: "scaling",
            gapDescription: "Scholarship expires - final opportunity",
            includesOffer: true,
            offerType: "scholarship_expiring",
        },

        // DAY 22: Zombie First Client
        {
            nicheCategory: "functional-medicine",
            dayNumber: 22,
            lessonTitle: "Advanced: Email Sequences That Convert",
            sarahMessage: `Day 22, {firstName}!

Today we're going advanced: Email nurture sequences.

Most practitioners think email is "old school." They're wrong.

Email is where trust compounds. Where relationships deepen. Where $500 clients become $5,000 clients.

Today's lesson covers automated sequences that work while you sleep.

— Sarah`,
            zombieMessages: [
                { hour: 2, content: "UPDATE: I GOT MY FIRST CLIENT!!! 🎉🎉🎉" },
                { hour: 4, content: "She found me through my new Google Business Profile and we just finished our first session. I charged $150 and it felt SO natural using Sarah's framework!" },
                { hour: 8, content: "I literally cannot believe this is happening. 3 weeks ago I had nothing set up. Now I'm a PAID practitioner. Still processing 😭" },
            ],
            gapTopic: "email_marketing",
            gapDescription: "Need email systems for client nurture",
            includesOffer: false,
        },
    ];

    console.log(`[SEED] Creating ${templates.length} masterclass templates...`);

    for (const template of templates) {
        await prisma.masterclassTemplate.upsert({
            where: {
                nicheCategory_dayNumber: {
                    nicheCategory: template.nicheCategory,
                    dayNumber: template.dayNumber,
                },
            },
            update: template,
            create: template,
        });
        console.log(`[SEED] Created template for Day ${template.dayNumber}: ${template.lessonTitle}`);
    }

    console.log(`[SEED] Complete. ${templates.length} templates created.`);
}

// Also create a generic "all" category for niches without specific templates
export async function seedGenericTemplates() {
    // Copy FM templates to "all" category as fallback
    const fmTemplates = await prisma.masterclassTemplate.findMany({
        where: { nicheCategory: "functional-medicine" },
    });

    for (const template of fmTemplates) {
        await prisma.masterclassTemplate.upsert({
            where: {
                nicheCategory_dayNumber: {
                    nicheCategory: "all",
                    dayNumber: template.dayNumber,
                },
            },
            update: {
                lessonTitle: template.lessonTitle,
                sarahMessage: template.sarahMessage,
                zombieMessages: template.zombieMessages,
                gapTopic: template.gapTopic,
                gapDescription: template.gapDescription,
                includesOffer: template.includesOffer,
                offerType: template.offerType,
            },
            create: {
                nicheCategory: "all",
                dayNumber: template.dayNumber,
                lessonTitle: template.lessonTitle,
                sarahMessage: template.sarahMessage,
                zombieMessages: template.zombieMessages,
                gapTopic: template.gapTopic,
                gapDescription: template.gapDescription,
                includesOffer: template.includesOffer,
                offerType: template.offerType,
            },
        });
    }

    console.log(`[SEED] Created "all" fallback templates.`);
}
