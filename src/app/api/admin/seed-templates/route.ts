import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { days9to23 } from "@/data/masterclass-days-9-23";
import { days24to45 } from "@/data/masterclass-days-24-45";
// Spiritual Healing curriculum
import { shDays1to8 } from "@/data/masterclass-spiritual-healing-days-1-8";
import { shDays9to23 } from "@/data/masterclass-spiritual-healing-days-9-23";
import { shDays24to45 } from "@/data/masterclass-spiritual-healing-days-24-45";
// Energy Healing curriculum
import { ehDays1to8 } from "@/data/masterclass-energy-healing-days-1-8";
import { ehDays9to23 } from "@/data/masterclass-energy-healing-days-9-23";
import { ehDays24to45 } from "@/data/masterclass-energy-healing-days-24-45";
// Reiki Healing curriculum
import { rkDays1to8 } from "@/data/masterclass-reiki-healing-days-1-8";
import { rkDays9to23 } from "@/data/masterclass-reiki-healing-days-9-23";
import { rkDays24to45 } from "@/data/masterclass-reiki-healing-days-24-45";
// ADHD Coaching curriculum
import { adhdDays1to8 } from "@/data/masterclass-adhd-coaching-days-1-8";
import { adhdDays9to23 } from "@/data/masterclass-adhd-coaching-days-9-23";
import { adhdDays24to45 } from "@/data/masterclass-adhd-coaching-days-24-45";
// Christian Coaching curriculum
import { ccDays1to8 } from "@/data/masterclass-christian-coaching-days-1-8";
import { ccDays9to23 } from "@/data/masterclass-christian-coaching-days-9-23";
import { ccDays24to45 } from "@/data/masterclass-christian-coaching-days-24-45";
// Gut Health curriculum
import { ghDays1to8 } from "@/data/masterclass-gut-health-days-1-8";
import { ghDays9to23 } from "@/data/masterclass-gut-health-days-9-23";
import { ghDays24to45 } from "@/data/masterclass-gut-health-days-24-45";
// Health Coach curriculum
import { hcDays1to8 } from "@/data/masterclass-health-coach-days-1-8";
import { hcDays9to23 } from "@/data/masterclass-health-coach-days-9-23";
import { hcDays24to45 } from "@/data/masterclass-health-coach-days-24-45";
// Holistic Nutrition curriculum
import { hnDays1to8 } from "@/data/masterclass-holistic-nutrition-days-1-8";
import { hnDays9to23 } from "@/data/masterclass-holistic-nutrition-days-9-23";
import { hnDays24to45 } from "@/data/masterclass-holistic-nutrition-days-24-45";
// Hormone Health curriculum
import { hhDays1to8 } from "@/data/masterclass-hormone-health-days-1-8";
import { hhDays9to23 } from "@/data/masterclass-hormone-health-days-9-23";
import { hhDays24to45 } from "@/data/masterclass-hormone-health-days-24-45";
// Integrative Health curriculum
import { ihDays1to8 } from "@/data/masterclass-integrative-health-days-1-8";
import { ihDays9to23 } from "@/data/masterclass-integrative-health-days-9-23";
import { ihDays24to45 } from "@/data/masterclass-integrative-health-days-24-45";
// Life Coaching curriculum
import { lcDays1to8 } from "@/data/masterclass-life-coaching-days-1-8";
import { lcDays9to23 } from "@/data/masterclass-life-coaching-days-9-23";
import { lcDays24to45 } from "@/data/masterclass-life-coaching-days-24-45";
// Nurse Coach curriculum
import { ncDays1to8 } from "@/data/masterclass-nurse-coach-days-1-8";
import { ncDays9to23 } from "@/data/masterclass-nurse-coach-days-9-23";
import { ncDays24to45 } from "@/data/masterclass-nurse-coach-days-24-45";
// Pet Nutrition curriculum
import { pnDays1to8 } from "@/data/masterclass-pet-nutrition-days-1-8";
import { pnDays9to23 } from "@/data/masterclass-pet-nutrition-days-9-23";
import { pnDays24to45 } from "@/data/masterclass-pet-nutrition-days-24-45";
// Women's Hormone Health curriculum
import { whhDays1to8 } from "@/data/masterclass-womens-hormone-health-days-1-8";
import { whhDays9to23 } from "@/data/masterclass-womens-hormone-health-days-9-23";
import { whhDays24to45 } from "@/data/masterclass-womens-hormone-health-days-24-45";

/**
 * GET - Check current templates
 */
export async function GET() {
    try {
        const templates = await prisma.masterclassTemplate.findMany({
            select: { id: true, dayNumber: true, nicheCategory: true, gapTopic: true },
            orderBy: { dayNumber: "asc" },
        });
        const total = await prisma.masterclassTemplate.count();
        return NextResponse.json({ total, templates });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// Days 1-8 defined in this file (too large to import)
const days1to8 = [
    // Day 0 - WELCOME (shows immediately on opt-in)
    {
        day: 0, gap: "welcome", sarahAudioUrl: "/audio/fm/day-0-welcome.mp3", sarah: `🎉 {firstName}! Welcome to your Mini-Diploma journey!

I'm Sarah Mitchell and I am SO excited you're here.

Over the next 45 days, I'll personally guide you through everything you need to become a certified health practitioner.

WHAT TO EXPECT:
• Daily lessons (short, actionable)
• Downloadable resources
• Our private community of amazing women
• My personal support

Quick logistics:
📱 Check here daily for new lessons
📎 Download resources in the portal
💬 Chat with our community below

This isn't just another course. It's the START of your new career.

And you're not alone - there are incredible women in this group who will support you every step of the way.

Tomorrow: Your first REAL lesson (Your Story Is Your #1 Asset).

So glad you're here! 💛

Sarah Mitchell
Founder, AccrediPro Academy`,
        zombies: [
            {
                minHour: 0, maxHour: 0, options: [
                    "YAY welcome {firstName}!! 🎉 I'm Jennifer - former burnt-out nurse, now health coach making $4,200/month. So excited to have you here! You're going to LOVE this journey 💕",
                ]
            },
            {
                minHour: 0, maxHour: 1, options: [
                    "hey girl!! Welcome to the fam 🙌 I started exactly where you are 8 months ago... if I can do this SO CAN YOU! ask questions anytime - we're all here for each other",
                    "omg another new person!! love seeing this group grow 💕 @{firstName} you're in the right place. trust the process!",
                ]
            },
            {
                minHour: 1, maxHour: 3, options: [
                    "lol I remember my first day being so nervous 😅 now I have 14 clients and a waitlist... stick with it!",
                    "Sarah saved my life honestly. I was crying every night from burnout... now I do work that actually matters 🥹",
                    "welcome welcome!! the daily lessons are SO good - actually do the action items and youll be amazed where you are in 45 days 💪",
                ]
            },
        ]
    },

    {
        day: 1, gap: "story-superpower", sarahAudioUrl: "/audio/fm/day-1-story.mp3", sarah: `Good morning {firstName}! ☀️

TODAY'S LESSON: Your Story Is Your #1 Asset

Here's what I wish someone told me years ago...

You don't need a fancy degree. You don't need 10 years of experience. You don't need to be a doctor.

Your STORY - your health struggles, your weight journey, your hormonal nightmare, your burnout, your autoimmune battle - THAT is what makes clients trust you.

Think about it honestly:

Would you rather work with a 25-year-old who read about menopause in a textbook... or a 52-year-old who actually LIVED through it?

Exactly.

Your "mess" becomes your MESSAGE.
Your "test" becomes your TESTIMONY.

🎯 TODAY'S ACTION:
Write down 3 health struggles you've overcome. These become your "I understand you" stories.

📎 Download: "Origin Story Worksheet" in your portal Resources

Tomorrow: How to find your FIRST 3 CLIENTS (they're already in your life).

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "omg this hit so hard 😭 my thyroid journey is literally why women trust me now",
                    "never thought my divorce health spiral would actually HELP my career 🥹",
                    "my weight loss story is what clients connect to most!",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "I was so scared to share my story but my first client said thats why she chose ME",
                    "my burnout at 45 became my biggest business asset... wild how life works",
                    "just did the worksheet... I have 6 struggles not 3 😅",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "this lesson changed everything. stopped hiding my past and clients started coming",
                    "clients want someone whos LIVED it, not just studied it 💪",
                    "@{firstName} did you download the worksheet?? its really good!",
                ]
            },
        ]
    },

    {
        day: 2, gap: "first-3-clients", sarah: `Hey {firstName}! 👋

TODAY'S LESSON: Your First 3 Clients Are Already In Your Life

Stop scrolling Instagram looking for strangers.

1️⃣ THE NEIGHBOR - The woman who mentioned she's tired all the time

2️⃣ THE CHURCH/GYM/BOOK CLUB FRIEND - Someone who's seen your transformation

3️⃣ THE FAMILY MEMBER'S FRIEND - Your sister's coworker, daughter's friend

THE EXACT SCRIPT:
"Hey [name], I know you've been struggling with [their issue]. I'm building my health practice and looking for 3 people to work with. Would you be open to a free 20-minute chat?"

No fancy marketing. No dancing on TikTok.

🎯 TODAY'S ACTION:
Text ONE person today with the script above.

📎 Download: "First Clients Finder Worksheet" in Resources

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "I literally got my first client from my BOOK CLUB 😂",
                    "my neighbor became my first paying client and referred 3 more!!",
                    "the script feels so natural... not salesy at all 🤞",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "sent the text to my sister's friend... she said YES immediately 😭",
                    "no dancing on tiktok hahahaha thank god 😂",
                    "omg I was making this SO complicated before",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "@{firstName} did you text anyone yet?? the hardest part is hitting send!",
                    "just made my list... I have 8 people not 5! never realized how many ask me questions",
                    "this is so different from what I thought marketing was 💕",
                ]
            },
        ]
    },

    {
        day: 3, gap: "pricing", sarah: `Morning {firstName}! ☀️

TODAY'S LESSON: Charging What You're Worth

Let me guess... you're thinking "I should do this for free until I'm more experienced"

Here's the TRUTH:
❌ FREE clients don't show up
❌ FREE clients don't follow protocols
❌ FREE clients don't get results

✅ PAYING clients are invested
✅ PAYING clients do the work
✅ PAYING clients become testimonials

When someone PAYS, they PAY ATTENTION.

THE PRICING FRAMEWORK:
• Discovery Call: FREE (15-20 min)
• Single Session: $97-$150
• 4-Week Package: $297-$397
• 3-Month Program: $997-$1,497

🎯 TODAY'S ACTION:
Decide on your first package price. Say it out loud 5 times.

📎 Download: "Pricing Calculator" in Resources

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "the paying attention thing is SO TRUE. my free clients never did the work 😩",
                    "I charged $297 and was shaking... she said yes without hesitating lol",
                    "when someone pays they pay attention 🔥",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "raised my prices last month and NO ONE complained",
                    "my husband keeps saying I dont charge enough 😅",
                    "started at $197 now at $397. clients are BETTER at higher prices??",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "$297 is literally 2 target trips 😂",
                    "said my price out loud... felt weird but powerful 💪",
                    "@{firstName} whats your first package price??",
                ]
            },
        ]
    },

    {
        day: 4, gap: "legal", sarah: `Hey {firstName}! 👋

TODAY'S LESSON: Legal Protection Made Simple

All you actually need:

✅ 1. CLIENT INTAKE FORM - Health history, symptoms, goals

✅ 2. INFORMED CONSENT - "I am not a doctor. This is not medical advice."

✅ 3. SCOPE OF PRACTICE - You recommend lifestyle changes, NOT diagnose or prescribe

THAT'S IT.

You don't need an LLC (nice later), expensive insurance (get it when earning), or a lawyer.

🎯 TODAY'S ACTION:
Download the templates. Add your name. Done.

📎 Downloads in Resources:
• "Client Intake Form" (PDF)
• "Informed Consent Template" (DOC)

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "oh thank god... I thought I needed a lawyer 😅",
                    "the templates are PERFECT. added my name and done",
                    "legal stuff gave me anxiety but this is simple!",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "my sister is a lawyer and said these templates are solid 👏",
                    "having consent form makes ME feel more confident",
                    "scope doc is great... know exactly what I can say now",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "customized my intake form! took 10 minutes",
                    "@{firstName} get the templates!! theyre in resources",
                    "I was overcomplicating everything 🙌",
                ]
            },
        ]
    },

    {
        day: 5, gap: "tech", sarah: `Morning {firstName}! ☀️

TODAY'S LESSON: Tech for Non-Techy Women

Your ENTIRE tech stack to start:

📅 CALENDLY (free) - Clients book themselves
💳 STRIPE/PAYPAL (free) - Get paid online
📝 GOOGLE DOCS (free) - Forms, notes, protocols
📱 ZOOM (free) - Video calls

THAT'S IT. 4 free tools.

You can run a $3k/month business with these.

🎯 TODAY'S ACTION:
Set up Calendly. Add 2-3 time slots. Takes 10 minutes.

📎 Download: "15-Minute Tech Setup Guide" in Resources

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "CALENDLY IS LIFECHANGING 😍 clients book themselves now",
                    "I thought I needed a website first... just need calendly and paypal lol",
                    "15 minute setup for real! did it during coffee ☕",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "my daughter helped me... honestly not that hard",
                    "stripe was easier than expected! first payment yesterday 💰",
                    "no website yet and I have 4 clients... just START",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "@{firstName} did you set up calendly yet??",
                    "love that we use free tools... was about to spend $500 on website stuff 😅",
                    "tech was my biggest excuse... actually pretty simple 💪",
                ]
            },
        ]
    },

    {
        day: 6, gap: "marketing", sarah: `Hey {firstName}! 👋

TODAY'S LESSON: Marketing for Women 40+

YOUR IDEAL CLIENTS ARE NOT ON TIKTOK.

They're:
📌 In Facebook groups for menopause, thyroid, weight loss
📌 At YMCA, church, book clubs
📌 Looking for someone they TRUST

YOUR MARKETING:
1️⃣ FACEBOOK - Join health groups. Add value. No pitching.
2️⃣ REFERRAL CARDS - Leave at gyms, doctors offices
3️⃣ LOCAL TALKS - Speak at church, library, women's groups
4️⃣ COFFEE CHATS - 2 women/week. Just connect.

No algorithms. No hashtags.

🎯 TODAY'S ACTION:
Join 2 Facebook groups for your niche. Introduce yourself.

📎 Download: "Referral Card Template" in Resources

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "THANK GOD no dancing on tiktok 😂 facebook is my people",
                    "my first 5 clients all came from facebook groups. ZERO from instagram",
                    "coffee chats work SO well... hired me on the spot!",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "referral card idea is genius! putting at gym and nail salon",
                    "did a free talk at church... 3 clients from ONE event 🙌",
                    "joined menopause fb group... 2 people already DMd me!",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "local marketing is so much better for our age group",
                    "@{firstName} have you joined fb groups yet??",
                    "no dancing no hashtags... just helping real people 💕",
                ]
            },
        ]
    },

    {
        day: 7, gap: "imposter-syndrome", sarah: `Morning {firstName}! ☀️

WEEK 1 COMPLETE! 🎉

Let's address that voice...

"Who am I to charge money for this?"
"What if I'm not good enough?"
"I'm too old to start"

HERE'S THE TRUTH:

🔥 You need to know MORE than your client. You do.

🔥 "Expert" is relative. To a struggling woman, YOU are the expert.

🔥 Your age is an ADVANTAGE. Who wants health advice from a 23-year-old?

THE IMPOSTER TEST:
Would the "you" from 5 years ago have KILLED for your current knowledge?

YES → You're qualified to help someone 5 years behind you.

🎯 TODAY'S ACTION:
Write 3 things you know now that you wish you knew 5 years ago.

📎 Download: "Expertise Inventory Worksheet" in Resources

Proud of you,
Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "the 5 years ago test... 😭 wow I would have paid anything for what I know now",
                    "imposter syndrome has been my biggest block. this hit HARD",
                    "our age is our superpower 💪",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "saying I dont know let me research has made clients trust me MORE",
                    "I know more than women who need my help... even if I dont know everything",
                    "week 1 DONE! never thought Id make it this far 😅",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "@{firstName} congrats on week 1!! proud of you!",
                    "imposter voice never fully goes away but now I have tools 💕",
                    "been thinking 2 years... finally actually doing it!",
                ]
            },
        ]
    },

    {
        day: 8, gap: "scholarship-intro", sarahAudioUrl: "/audio/fm/day-8-scholarship.mp3", sarah: `🎉 {firstName}! BIG NEWS...

THE CAREER ACCELERATOR SCHOLARSHIP

I'm opening 3 spots THIS WEEK for this group.

WHAT'S INCLUDED:
✅ FULL CERTIFICATION - Official ASI credential
✅ DONE-FOR-YOU MATERIALS - Website, forms, protocols
✅ WEEKLY GROUP CALLS - Ask me anything
✅ PRIVATE COMMUNITY - 200+ women
✅ 1:1 SUPPORT - Direct access

Normal: $997
SCHOLARSHIP: $297

Less than $1/day for a full year of support.

For women who've shown up consistently. That's you.

More details tomorrow...

Sarah 💛`,
        zombies: [
            {
                minHour: 1, maxHour: 3, options: [
                    "wait WHAT. $297 for everything?? 😱",
                    "I did the accelerator and it changed EVERYTHING. worth 10x",
                    "scholarship spots go SO fast... dont sleep on this!",
                ]
            },
            {
                minHour: 4, maxHour: 6, options: [
                    "weekly calls alone are worth it... Sarah answers questions LIVE",
                    "done for you materials saved me 50 hours of work",
                    "finally!! been waiting for scholarship to open 🙌",
                ]
            },
            {
                minHour: 7, maxHour: 10, options: [
                    "$297 is literally 1 client 😅",
                    "@{firstName} considering the scholarship?? accountability partner!",
                    "definitely applying this round. procrastinated last time and regretted it 😩",
                ]
            },
        ]
    },
];

/**
 * POST - Seed ALL 45 days of hyper-value masterclass curriculum
 * Query params:
 *   ?niche=functional-medicine (default, uses generic "all" category)
 *   ?niche=spiritual-healing (uses spiritual-healing specific content)
 */
export async function POST(req: NextRequest) {
    try {
        const niche = req.nextUrl.searchParams.get("niche") || "functional-medicine";

        let allTemplates: typeof days1to8;
        let nicheCategory: string;

        switch (niche) {
            case "spiritual-healing":
                allTemplates = [...shDays1to8, ...shDays9to23, ...shDays24to45];
                nicheCategory = "spiritual-healing";
                break;
            case "energy-healing":
                allTemplates = [...ehDays1to8, ...ehDays9to23, ...ehDays24to45];
                nicheCategory = "energy-healing";
                break;
            case "reiki-healing":
                allTemplates = [...rkDays1to8, ...rkDays9to23, ...rkDays24to45];
                nicheCategory = "reiki-healing";
                break;
            case "adhd-coaching":
                allTemplates = [...adhdDays1to8, ...adhdDays9to23, ...adhdDays24to45];
                nicheCategory = "adhd-coaching";
                break;
            case "christian-coaching":
                allTemplates = [...ccDays1to8, ...ccDays9to23, ...ccDays24to45];
                nicheCategory = "christian-coaching";
                break;
            case "gut-health":
                allTemplates = [...ghDays1to8, ...ghDays9to23, ...ghDays24to45];
                nicheCategory = "gut-health";
                break;
            case "health-coach":
                allTemplates = [...hcDays1to8, ...hcDays9to23, ...hcDays24to45];
                nicheCategory = "health-coach";
                break;
            case "holistic-nutrition":
                allTemplates = [...hnDays1to8, ...hnDays9to23, ...hnDays24to45];
                nicheCategory = "holistic-nutrition";
                break;
            case "hormone-health":
                allTemplates = [...hhDays1to8, ...hhDays9to23, ...hhDays24to45];
                nicheCategory = "hormone-health";
                break;
            case "integrative-health":
                allTemplates = [...ihDays1to8, ...ihDays9to23, ...ihDays24to45];
                nicheCategory = "integrative-health";
                break;
            case "life-coaching":
                allTemplates = [...lcDays1to8, ...lcDays9to23, ...lcDays24to45];
                nicheCategory = "life-coaching";
                break;
            case "nurse-coach":
                allTemplates = [...ncDays1to8, ...ncDays9to23, ...ncDays24to45];
                nicheCategory = "nurse-coach";
                break;
            case "pet-nutrition":
                allTemplates = [...pnDays1to8, ...pnDays9to23, ...pnDays24to45];
                nicheCategory = "pet-nutrition";
                break;
            case "womens-hormone-health":
                allTemplates = [...whhDays1to8, ...whhDays9to23, ...whhDays24to45];
                nicheCategory = "womens-hormone-health";
                break;
            default:
                // Default: use functional medicine / generic curriculum
                allTemplates = [...days1to8, ...days9to23, ...days24to45];
                nicheCategory = "all";
        }

        let created = 0;
        let updated = 0;

        for (const t of allTemplates) {
            const existing = await prisma.masterclassTemplate.findFirst({
                where: { nicheCategory, dayNumber: t.day },
            });

            const data = {
                nicheCategory,
                dayNumber: t.day,
                sarahMessage: t.sarah,
                zombieMessages: t.zombies,
                gapTopic: t.gap,
                lessonTitle: `Day ${t.day}: ${t.gap.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`,
                // Include sarahAudioUrl if present
                ...((t as any).sarahAudioUrl && { sarahAudioUrl: (t as any).sarahAudioUrl }),
            };

            if (existing) {
                await prisma.masterclassTemplate.update({
                    where: { id: existing.id },
                    data,
                });
                updated++;
            } else {
                await prisma.masterclassTemplate.create({ data });
                created++;
            }
        }

        return NextResponse.json({
            success: true,
            niche,
            nicheCategory,
            message: `Created ${created} new, updated ${updated} existing templates for ${niche}.`,
            totalDays: allTemplates.length,
        });
    } catch (error) {
        console.error("[SEED TEMPLATES] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
