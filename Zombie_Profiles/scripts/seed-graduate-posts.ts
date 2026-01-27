/**
 * Seed script for Graduate Channel zombie posts
 * Run with: npx tsx prisma/scripts/seed-graduate-posts.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// R2 Avatar URLs - Real faces
const AVATARS = [
    "https://assets.accredipro.academy/fm-certification/T1.webp",
    "https://assets.accredipro.academy/fm-certification/T2.webp",
    "https://assets.accredipro.academy/fm-certification/T3.webp",
    "https://assets.accredipro.academy/fm-certification/T4.webp",
    "https://assets.accredipro.academy/fm-certification/T5.webp",
    "https://assets.accredipro.academy/fm-certification/T6.webp",
    "https://assets.accredipro.academy/fm-certification/T7.webp",
    "https://assets.accredipro.academy/fm-certification/T8.webp",
    "https://assets.accredipro.academy/fm-certification/T9.webp",
    "https://assets.accredipro.academy/fm-certification/T10.webp",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_01.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_02.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_03.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_04.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_05.jpeg",
];

// 100 Graduate profiles with varied backgrounds
const PROFILES = [
    // Original 50
    { name: "Jennifer M.", location: "Austin, TX", background: "nurse", incomeLevel: "$6.2K/mo" },
    { name: "Sarah K.", location: "Denver, CO", background: "stay-at-home mom", incomeLevel: "$4.8K/mo" },
    { name: "Michelle R.", location: "Phoenix, AZ", background: "teacher", incomeLevel: "$5.5K/mo" },
    { name: "Amanda L.", location: "Seattle, WA", background: "corporate", incomeLevel: "$8.2K/mo" },
    { name: "Lisa P.", location: "San Diego, CA", background: "pharmacist", incomeLevel: "$8.9K/mo" },
    { name: "Rachel T.", location: "Nashville, TN", background: "fitness trainer", incomeLevel: "$7.1K/mo" },
    { name: "Brittany M.", location: "Miami, FL", background: "nutritionist", incomeLevel: "$6.1K/mo" },
    { name: "Stephanie H.", location: "Chicago, IL", background: "nurse", incomeLevel: "$9.4K/mo" },
    { name: "Nicole B.", location: "Boston, MA", background: "therapist", incomeLevel: "$7.8K/mo" },
    { name: "Christina W.", location: "Portland, OR", background: "yoga instructor", incomeLevel: "$5.2K/mo" },
    { name: "Diana S.", location: "Atlanta, GA", background: "mom", incomeLevel: "$4.5K/mo" },
    { name: "Maria T.", location: "Denver, CO", background: "healthcare admin", incomeLevel: "$6.8K/mo" },
    { name: "Ashley C.", location: "Dallas, TX", background: "corporate", incomeLevel: "$10.2K/mo" },
    { name: "Heather N.", location: "Charlotte, NC", background: "nurse", incomeLevel: "$7.5K/mo" },
    { name: "Kimberly J.", location: "Tampa, FL", background: "retail manager", incomeLevel: "$5.8K/mo" },
    { name: "Jessica F.", location: "Minneapolis, MN", background: "teacher", incomeLevel: "$6.4K/mo" },
    { name: "Lauren D.", location: "Raleigh, NC", background: "marketing", incomeLevel: "$8.1K/mo" },
    { name: "Emily R.", location: "San Francisco, CA", background: "tech", incomeLevel: "$11.5K/mo" },
    { name: "Megan A.", location: "Houston, TX", background: "mom", incomeLevel: "$5.1K/mo" },
    { name: "Tiffany L.", location: "Las Vegas, NV", background: "hospitality", incomeLevel: "$6.9K/mo" },
    { name: "Danielle K.", location: "Orlando, FL", background: "fitness", incomeLevel: "$7.2K/mo" },
    { name: "Amber W.", location: "Salt Lake City, UT", background: "mom", incomeLevel: "$4.2K/mo" },
    { name: "Vanessa M.", location: "Sacramento, CA", background: "admin", incomeLevel: "$5.6K/mo" },
    { name: "Crystal P.", location: "Indianapolis, IN", background: "nurse", incomeLevel: "$8.7K/mo" },
    { name: "Natalie S.", location: "Columbus, OH", background: "teacher", incomeLevel: "$5.9K/mo" },
    { name: "Brooke H.", location: "Kansas City, MO", background: "realtor", incomeLevel: "$9.8K/mo" },
    { name: "Courtney R.", location: "Oklahoma City, OK", background: "mom", incomeLevel: "$4.9K/mo" },
    { name: "Melissa T.", location: "Louisville, KY", background: "healthcare", incomeLevel: "$7.4K/mo" },
    { name: "Andrea B.", location: "Memphis, TN", background: "nurse", incomeLevel: "$8.3K/mo" },
    { name: "Whitney G.", location: "Albuquerque, NM", background: "yoga", incomeLevel: "$5.4K/mo" },
    { name: "Lindsey N.", location: "Tucson, AZ", background: "teacher", incomeLevel: "$6.1K/mo" },
    { name: "Samantha J.", location: "Fresno, CA", background: "mom", incomeLevel: "$4.7K/mo" },
    { name: "Rebecca L.", location: "Long Beach, CA", background: "corporate", incomeLevel: "$9.1K/mo" },
    { name: "Erica D.", location: "Virginia Beach, VA", background: "military spouse", incomeLevel: "$5.3K/mo" },
    { name: "Monica C.", location: "Milwaukee, WI", background: "nurse", incomeLevel: "$7.9K/mo" },
    { name: "Chelsea A.", location: "Cleveland, OH", background: "fitness", incomeLevel: "$6.5K/mo" },
    { name: "Kayla M.", location: "New Orleans, LA", background: "hospitality", incomeLevel: "$5.7K/mo" },
    { name: "Jasmine H.", location: "Baltimore, MD", background: "healthcare", incomeLevel: "$8.4K/mo" },
    { name: "Brittney S.", location: "Pittsburgh, PA", background: "teacher", incomeLevel: "$6.2K/mo" },
    { name: "Alexis R.", location: "Cincinnati, OH", background: "mom", incomeLevel: "$4.4K/mo" },
    { name: "Taylor W.", location: "St. Louis, MO", background: "marketing", incomeLevel: "$7.6K/mo" },
    { name: "Morgan K.", location: "Riverside, CA", background: "nurse", incomeLevel: "$8.8K/mo" },
    { name: "Paige T.", location: "Lexington, KY", background: "admin", incomeLevel: "$5.5K/mo" },
    { name: "Hannah B.", location: "Anchorage, AK", background: "mom", incomeLevel: "$6.3K/mo" },
    { name: "Kelsey N.", location: "Honolulu, HI", background: "yoga", incomeLevel: "$7.1K/mo" },
    { name: "Caitlin P.", location: "Boise, ID", background: "teacher", incomeLevel: "$5.8K/mo" },
    { name: "Julia M.", location: "Richmond, VA", background: "corporate", incomeLevel: "$9.5K/mo" },
    { name: "Grace L.", location: "Des Moines, IA", background: "nurse", incomeLevel: "$7.3K/mo" },
    { name: "Olivia S.", location: "Birmingham, AL", background: "mom", incomeLevel: "$4.6K/mo" },
    { name: "Emma R.", location: "Omaha, NE", background: "healthcare", incomeLevel: "$6.7K/mo" },
    // Additional 50 profiles for variety
    { name: "Patricia V.", location: "Scottsdale, AZ", background: "chiropractor", incomeLevel: "$12.4K/mo" },
    { name: "Sandra K.", location: "Jacksonville, FL", background: "esthetician", incomeLevel: "$5.9K/mo" },
    { name: "Katherine T.", location: "Charleston, SC", background: "mom", incomeLevel: "$4.1K/mo" },
    { name: "Laura H.", location: "Savannah, GA", background: "nurse", incomeLevel: "$7.6K/mo" },
    { name: "Nancy M.", location: "Fort Worth, TX", background: "accountant", incomeLevel: "$8.5K/mo" },
    { name: "Betty P.", location: "Spokane, WA", background: "mom", incomeLevel: "$4.3K/mo" },
    { name: "Margaret D.", location: "Knoxville, TN", background: "dietitian", incomeLevel: "$9.1K/mo" },
    { name: "Susan B.", location: "Grand Rapids, MI", background: "physical therapist", incomeLevel: "$10.8K/mo" },
    { name: "Dorothy L.", location: "Providence, RI", background: "massage therapist", incomeLevel: "$6.4K/mo" },
    { name: "Helen G.", location: "Newark, NJ", background: "corporate", incomeLevel: "$11.2K/mo" },
    { name: "Karen W.", location: "Little Rock, AR", background: "teacher", incomeLevel: "$5.2K/mo" },
    { name: "Donna F.", location: "Tulsa, OK", background: "mom", incomeLevel: "$4.8K/mo" },
    { name: "Carol A.", location: "Worcester, MA", background: "nurse", incomeLevel: "$8.1K/mo" },
    { name: "Ruth N.", location: "Bakersfield, CA", background: "retail", incomeLevel: "$5.4K/mo" },
    { name: "Sharon C.", location: "Reno, NV", background: "yoga instructor", incomeLevel: "$6.8K/mo" },
    { name: "Michelle E.", location: "Durham, NC", background: "research scientist", incomeLevel: "$9.7K/mo" },
    { name: "Laura J.", location: "Chesapeake, VA", background: "military spouse", incomeLevel: "$5.1K/mo" },
    { name: "Sarah B.", location: "Lubbock, TX", background: "nurse practitioner", incomeLevel: "$13.2K/mo" },
    { name: "Kimberly R.", location: "Laredo, TX", background: "mom", incomeLevel: "$4.5K/mo" },
    { name: "Deborah Y.", location: "Madison, WI", background: "professor", incomeLevel: "$8.9K/mo" },
    { name: "Jessica U.", location: "Chandler, AZ", background: "fitness", incomeLevel: "$7.4K/mo" },
    { name: "Shirley O.", location: "Baton Rouge, LA", background: "mom", incomeLevel: "$4.7K/mo" },
    { name: "Cynthia I.", location: "Irvine, CA", background: "tech", incomeLevel: "$12.1K/mo" },
    { name: "Angela Q.", location: "Shreveport, LA", background: "social worker", incomeLevel: "$6.2K/mo" },
    { name: "Melissa Z.", location: "Tacoma, WA", background: "nurse", incomeLevel: "$8.6K/mo" },
    { name: "Brenda X.", location: "Modesto, CA", background: "mom", incomeLevel: "$4.2K/mo" },
    { name: "Amy V.", location: "Fontana, CA", background: "healthcare admin", incomeLevel: "$7.8K/mo" },
    { name: "Anna C.", location: "Des Moines, IA", background: "librarian", incomeLevel: "$5.6K/mo" },
    { name: "Rebecca S.", location: "Moreno Valley, CA", background: "teacher", incomeLevel: "$6.1K/mo" },
    { name: "Virginia E.", location: "Glendale, AZ", background: "nurse", incomeLevel: "$8.2K/mo" },
    { name: "Kathleen D.", location: "Huntington Beach, CA", background: "yoga", incomeLevel: "$7.5K/mo" },
    { name: "Pamela F.", location: "Irving, TX", background: "corporate", incomeLevel: "$9.4K/mo" },
    { name: "Martha G.", location: "Fremont, CA", background: "pharmacist", incomeLevel: "$10.3K/mo" },
    { name: "Debra H.", location: "San Bernardino, CA", background: "mom", incomeLevel: "$4.9K/mo" },
    { name: "Amanda J.", location: "Oxnard, CA", background: "aesthetician", incomeLevel: "$6.7K/mo" },
    { name: "Stephanie K.", location: "Fayetteville, NC", background: "military spouse", incomeLevel: "$5.3K/mo" },
    { name: "Carolyn L.", location: "Yonkers, NY", background: "therapist", incomeLevel: "$9.8K/mo" },
    { name: "Christine M.", location: "Huntsville, AL", background: "engineer", incomeLevel: "$11.1K/mo" },
    { name: "Marie N.", location: "Aurora, CO", background: "nurse", incomeLevel: "$7.9K/mo" },
    { name: "Janet O.", location: "Montgomery, AL", background: "teacher", incomeLevel: "$5.7K/mo" },
    { name: "Catherine P.", location: "Akron, OH", background: "mom", incomeLevel: "$4.4K/mo" },
    { name: "Frances Q.", location: "Tallahassee, FL", background: "nutritionist", incomeLevel: "$7.2K/mo" },
    { name: "Ann R.", location: "Augusta, GA", background: "nurse", incomeLevel: "$8.4K/mo" },
    { name: "Joyce S.", location: "Overland Park, KS", background: "corporate", incomeLevel: "$10.6K/mo" },
    { name: "Diane T.", location: "Mobile, AL", background: "mom", incomeLevel: "$4.6K/mo" },
    { name: "Alice U.", location: "Grand Prairie, TX", background: "fitness", incomeLevel: "$6.9K/mo" },
    { name: "Julie V.", location: "Brownsville, TX", background: "teacher", incomeLevel: "$5.4K/mo" },
    { name: "Heather W.", location: "Tempe, AZ", background: "healthcare", incomeLevel: "$8.7K/mo" },
    { name: "Teresa X.", location: "Santa Clarita, CA", background: "mom", incomeLevel: "$5.1K/mo" },
    { name: "Doris Y.", location: "Pomona, CA", background: "nurse", incomeLevel: "$7.7K/mo" },
];

// Diverse, human-like posts
const POSTS = {
    certificate: [
        { content: `CERTIFIED!! 🎓\n\nI still can't believe it. 12 weeks ago I was sitting in my car after another exhausting shift, wondering if this was really it.\n\nToday I'm officially an ASI Certified Functional Medicine Practitioner.\n\nThank you Sarah and this entire community. You believed in me when I didn't believe in myself.`, likes: 147 },
        { content: `Just got the email... I PASSED! 🎉\n\nHonestly cried a little. At 47, I thought it was too late to start something new.\n\nTo everyone on the fence: it's not too late. The modules are incredible, and Sarah breaks everything down so clearly.\n\nOn to building my practice! 💪`, likes: 98 },
        { content: `IT'S OFFICIAL! I'm certified! 📜\n\nMy kids watched me study every night after they went to bed. My husband picked up extra duties so I could focus.\n\nThis certificate isn't just mine - it belongs to my whole family.\n\nNow let's make this investment worth it!`, likes: 134 },
        { content: `Passed with a 97%! 🙌\n\nNot gonna lie, I was TERRIFIED of the exam. But if you actually go through the modules (don't skip!), you know this stuff.\n\nThe gut health section alone changed how I think about EVERYTHING.\n\nSo grateful for this community.`, likes: 87 },
        { content: `From yoga instructor to Board Certified Practitioner.\n\nThe journey took me 14 weeks (went slow because life), but today I got the email.\n\nWhat hit me hardest during training: the "Clients From Scratch" module. I was so scared I'd never find clients. Now I have a waitlist.`, likes: 112 },
        { content: `CERTIFIED TODAY! And I'm still shaking.\n\nFor context: I'm a 52-year-old grandma who thought "technology" was sending emails. 😅\n\nIf I can do this online certification, ANYONE can.\n\nThe support from this community made all the difference.`, likes: 156 },
        { content: `Pharmacist for 18 years. Skeptic by nature.\n\nAlmost didn't sign up because "another certification won't change anything."\n\nI was wrong.\n\nJust completed my Board Certification and the difference is... I actually understand WHY things work now. Not just what to dispense.`, likes: 78 },
    ],
    first_client: [
        { content: `OMG you guys... I just booked my FIRST CLIENT! 😭\n\nShe's a referral from my neighbor. $175 for an initial consultation.\n\nMy hands were literally shaking during the intake call. But I knew my stuff! All those modules paid off.\n\nI'M ACTUALLY DOING THIS!!!`, likes: 189 },
        { content: `First paying client: ✅\n\nShe found me through the ASI directory. We talked for 90 minutes and she left with an actual plan.\n\nThe look on her face when things started clicking... THIS is why I did this.\n\n$200 in my pocket, but honestly I would have done it for free. Don't tell her that 😂`, likes: 124 },
        { content: `Guess who just got paid $225 to help someone feel better? THIS GIRL! 🙋‍♀️\n\nMy first client is a coworker who's been struggling with fatigue for years. We went through her labs using everything from Module 7.\n\nShe actually HUGGED me at the end. I'm not crying, you're crying.`, likes: 167 },
        { content: `First client story time:\n\nA friend of a friend heard I got certified. She's been dealing with gut issues for 5 years. Doctors keep saying "your labs are normal."\n\nDid a free discovery call using the template from Module 15.\n\nShe cried. Said no one had ever asked her those questions.\n\nSigned up for my 12-week program on the spot. $1,200.`, likes: 203 },
        { content: `Y'ALL. First client. First invoice. First payment received.\n\nI stared at that PayPal notification for like 5 minutes. $150 for helping someone understand their own health.\n\nI remember being scared I'd never get clients. Now I'm scared I won't have enough time for all of them 😅`, likes: 145 },
        { content: `Update: FIRST CLIENT SIGNED A 3-MONTH PACKAGE!!\n\n$1,800 total. She paid in full.\n\nI used the pricing calculator Sarah gave us and almost chickened out because it felt "too expensive." But she didn't even blink.\n\nLadies... charge your worth.`, likes: 178 },
    ],
    income_milestone: [
        { content: `$1,000 MONTH! 💰\n\nI know it's not much compared to some of you rockstars, but for me? This is HUGE.\n\n6 months ago I was terrified to even tell people I was studying this. Now I have 7 regular clients and a waitlist starting.\n\nThe Business Accelerator content was a game-changer.`, likes: 234 },
        { content: `Just calculated my earnings this month: $4,200\n\nI'm still working my day job, but I'm down to 3 days/week now. By summer, I'll be full-time in my practice.\n\nTo everyone starting out: it's slow at first. Then it's not. Trust the process. 📈`, likes: 187 },
        { content: `I need to share this because I'm SHOOK.\n\nHit $8,500 this month. That's more than my nursing salary. PART TIME.\n\nI'm not saying quit your job tomorrow. But if you're on the fence about investing in yourself... do it. The ROI is insane.`, likes: 267 },
        { content: `Income update because I promised myself I'd be transparent:\n\nMonth 1: $0 (building)\nMonth 3: $800\nMonth 6: $2,400\nMonth 9: $5,100\nMonth 12 (now): $9,200\n\nIt's not linear. Some months are slower. But the trajectory is UP. 📊`, likes: 312 },
        { content: `$6,800 THIS MONTH! 🎉\n\nBut here's what's even crazier: I worked maybe 18 hours/week.\n\nThe group programs Sarah taught us about? GAME. CHANGER. One hour with 6 people = 6x the impact.\n\nWhy didn't I do this sooner?!`, likes: 198 },
        { content: `First $10K month. I literally cannot believe I'm typing this.\n\n12 clients. Mix of 1:1 and group. Working from my home office while my kids are at school.\n\nI was a burned out teacher making $48K/year.\n\nNow I help women balance their hormones and I made more this month than I used to make in 3 months.`, likes: 356 },
        { content: `Six month income report:\n\nMonth 1: $400\nMonth 2: $1,100\nMonth 3: $2,800\nMonth 4: $4,200\nMonth 5: $5,600\nMonth 6: $7,400\n\nTotal: $21,500 working part-time.\n\nI quit my corporate job last week. 🙌`, likes: 289 },
    ],
    tip: [
        { content: `PSA for everyone in the modules right now:\n\nTake the assessments seriously. I know it's tempting to rush through, but the case studies in Modules 12-15 are GOLD.\n\nI literally use those frameworks with every client now.\n\nAlso: don't skip the Business Accelerator content. That's where the real magic is.`, likes: 156 },
        { content: `Quick tip that changed everything for me:\n\nStop trying to help EVERYONE. Pick your niche.\n\nI focus exclusively on women 40+ with thyroid issues now. My content is specific. My marketing is specific. My results are specific.\n\nGeneralist = invisible. Specialist = in demand.`, likes: 134 },
        { content: `For the nurses, pharmacists, and healthcare workers in here:\n\nI know it feels weird to "start over." You already have letters after your name.\n\nBut this certification fills the gaps. The root-cause thinking. The time with patients. The business skills.\n\nIt's not starting over. It's leveling up. 🏥`, likes: 178 },
        { content: `Something I wish I knew earlier:\n\nYou don't need a fancy website to start. You don't need perfect branding. You don't need 10K followers.\n\nYou need ONE client. Then another. Then another.\n\nI got my first 5 clients with no website, just conversations. Start before you're ready.`, likes: 145 },
        { content: `The module on inflammation was the one that made everything click for me.\n\nSuddenly I understood why my own health issues weren't getting better with conventional approaches.\n\nI've rewatched it 3 times. Sarah explains it so well. 🧠`, likes: 98 },
        { content: `To my fellow introverts:\n\nYes, you can do this. No, you don't need to be a social media influencer.\n\nMost of my clients come from:\n- Word of mouth (40%)\n- ASI Directory (35%)\n- Local networking (25%)\n\nZero dancing on TikTok required 😅`, likes: 212 },
        { content: `Pricing advice from someone who learned the hard way:\n\n1. Don't charge hourly - charge by outcome\n2. Packages > single sessions\n3. If no one says "that's expensive" you're too cheap\n4. Your first price is probably too low\n\nI doubled my rates 3 months in and got MORE clients. 🤯`, likes: 167 },
        { content: `Module 7 on lab interpretation is *chef's kiss*\n\nI had a client whose doctor said her thyroid was "fine" because TSH was 4.2.\n\nAfter learning functional ranges, I knew that wasn't optimal. We worked on her protocol and her energy is back.\n\nThis knowledge is POWER.`, likes: 123 },
    ],
    transformation: [
        { content: `6 months ago: Crying in the bathroom at work, wondering if this was my life forever.\n\nToday: Running a practice I love, helping people who actually WANT to get better, making more than my corporate salary.\n\nSame me. Different path. 🦋`, likes: 234 },
        { content: `My husband said something yesterday that made me tear up:\n\n"You're a completely different person. You're happy."\n\nHe's right. I didn't realize how much my job was killing me inside until I found something that fills me up instead.\n\nThis certification gave me my life back.`, likes: 289 },
        { content: `Before ASI: Anxious, burnt out, dreading Mondays\nAfter ASI: Energized, purposeful, excited about my work\n\nThe money is great. But honestly? The feeling of actually HELPING people is priceless.\n\nWhen clients message me that their energy is back... there's nothing like it. 💛`, likes: 198 },
        { content: `I used to think I was "too old" to change careers at 49.\n\nTurns out I just needed the right opportunity.\n\nTo anyone else thinking they missed their window: you didn't. Start now. Future you will be so grateful.`, likes: 267 },
        { content: `Plot twist nobody expected: The "stay at home mom" now has her own business.\n\nMy kids see me building something. They see me studying. They see me helping people.\n\nThat example is worth more than any paycheck. (Though the paychecks are nice too 😂)`, likes: 178 },
        { content: `One year ago today, I took the Mini Diploma quiz on a whim.\n\nToday:\n✓ Board Certified Practitioner\n✓ 14 active clients\n✓ $7K+/month income\n✓ Actually excited to work\n\nOne quiz. One decision. One year.\n\nLife can change fast when you bet on yourself.`, likes: 312 },
        { content: `Story time: How I went from "I can't afford this" to "I can't afford NOT to"\n\nWhen I saw the scholarship, I had $400 in checking. The certification was $297.\n\nSat there for an hour, terrified.\n\nThat was 10 months ago.\n\nThis month I made $8,400 helping women with gut health.`, likes: 345 },
    ],
    gratitude: [
        { content: `Just want to say THANK YOU to this community.\n\nWhen I was in Module 4 ready to quit, you all talked me off the ledge. When I got my first negative review, you reminded me it's part of the journey.\n\nI couldn't have done this alone. ❤️`, likes: 234 },
        { content: `Sarah, if you're reading this:\n\nThank you for making this accessible. Thank you for breaking down complex topics. Thank you for believing we could do this.\n\nYou changed my life. Not being dramatic. You actually changed my life. 🙏`, likes: 289 },
        { content: `Feeling grateful today.\n\nThis time last year I was stuck. No direction. No hope for change.\n\nNow I have a thriving practice, an amazing community, and a career that actually matters.\n\nIf you're early in the journey: keep going. It's SO worth it.`, likes: 198 },
        { content: `One year certified today! 🎂\n\nIn that time:\n- 52 clients helped\n- $64,000 earned\n- 0 regrets\n\nBest investment I ever made in myself. Bar none.`, likes: 312 },
        { content: `Shoutout to everyone in the mentorship calls.\n\nThose Wednesday sessions kept me going when I wanted to quit.\n\nSeeing your wins. Hearing your struggles. Knowing I wasn't alone.\n\nThis community is special. Don't take it for granted. 💕`, likes: 167 },
    ],
    question: [
        { content: `Quick question for those further along:\n\nHow do you handle clients who want to do EVERYTHING at once? I have someone who wants to change diet, start supplements, fix sleep, AND exercise all in week one.\n\nI know it's too much but she's so motivated! 🤔`, likes: 67 },
        { content: `Anyone else struggle with imposter syndrome even AFTER getting certified?\n\nI know my stuff. I've helped people. But sometimes I still feel like "who am I to give health advice?"\n\nPlease tell me this goes away 😅`, likes: 145 },
        { content: `Looking for recommendations:\n\nWhat software do you all use for client management? I'm outgrowing my spreadsheet situation.\n\nBonus if it does scheduling too! 📅`, likes: 89 },
        { content: `How long did it take you to feel "confident" with clients?\n\nI'm about 8 sessions in and still get nervous before each one. Does this get better?`, likes: 112 },
        { content: `For those doing group programs:\n\nHow many people do you include? I'm thinking of starting one but not sure what size is manageable.\n\nAlso - do you do them live or pre-recorded?`, likes: 78 },
        { content: `What's your intake process look like?\n\nI'm spending SO much time on initial consultations. Feel like I need to streamline but don't want to miss anything important.\n\nWould love to see what questionnaires you use!`, likes: 92 },
        { content: `Insurance question: Do any of you bill insurance or is everyone private pay?\n\nI've had a few clients ask and I'm not sure if it's worth the hassle. Thoughts?`, likes: 56 },
    ],
    // Additional post categories for variety
    win: [
        { content: `SMALL WIN but big for me:\n\nA client texted me unprompted to say her energy is back for the first time in 3 years.\n\nShe was told by 4 doctors there was "nothing wrong."\n\nThere was something wrong. We found it. We fixed it.\n\nThis is why we do this work. 💪`, likes: 234 },
        { content: `My client just called crying happy tears.\n\nHer labs came back and her thyroid markers are finally optimal after 8 months of working together.\n\nNo medication changes. Just root-cause work.\n\nI'm not crying, you're crying 😭`, likes: 189 },
        { content: `WIN: Just finished my 50th client session!\n\nWhen I started 6 months ago, I genuinely didn't think I'd get here.\n\nNow I have a practice, a purpose, and I'm actually making a difference.\n\nTo everyone just starting: KEEP GOING.`, likes: 267 },
        { content: `Y'ALL. My client just lost 30 pounds.\n\nNot through restriction. Not through willpower.\n\nThrough understanding her body. Fixing her gut. Balancing her hormones.\n\nThis approach WORKS. 🙌`, likes: 178 },
        { content: `Update on my most skeptical client:\n\nShe's now my biggest referral source. 😂\n\nShe came in with arms crossed, "prove it to me." Now she sends me a new person every month.\n\nResults speak louder than any marketing.`, likes: 145 },
        { content: `Got my first 5-star Google review today! 🌟\n\nClient wrote a whole paragraph about how I "actually listened" and "explained things clearly."\n\nThe bar is so low in healthcare and it makes me sad. But also motivated.`, likes: 123 },
        { content: `JUST DOUBLED my client roster in one month.\n\nHow? One Instagram post about gut health went mini-viral locally.\n\nThe content you create MATTERS. Even if it feels like no one's watching.`, likes: 198 },
    ],
    struggle: [
        { content: `Being real for a sec:\n\nThis month was HARD. Lost 2 clients (moved away), had a no-show, and my confidence took a hit.\n\nBut I'm still here. Still showing up. Still learning.\n\nTo anyone else having a tough month: you're not alone. 🤍`, likes: 289 },
        { content: `Imposter syndrome hit HARD today.\n\nHad a potential client who's worked with "real doctors" ask why she should trust me.\n\nIt stung. But it also reminded me that I need to be confident in what I bring to the table.\n\nWe're not replacing doctors. We're filling a gap.`, likes: 234 },
        { content: `Honest moment:\n\nI cried after a session today. Not because it went badly - because my client's story hit so close to home.\n\nSometimes this work is heavy.\n\nSelf-care isn't optional in this field. Lesson learned.`, likes: 167 },
        { content: `Had my first "difficult" client this week.\n\nNothing I suggested was right. Everything was "too hard." Complained about the price.\n\nEventually I had to say: "I'm not sure we're the right fit."\n\nBoundaries are hard but necessary. 🙏`, likes: 145 },
    ],
    advice: [
        { content: `BEST DECISION I MADE:\n\nOffering a free 15-min discovery call BEFORE booking paid sessions.\n\nFilters out people who aren't serious, gives me a chance to connect, and my conversion rate is 80%.\n\nIf you're not doing this, try it!`, likes: 189 },
        { content: `Took me too long to learn this:\n\nYou can't help everyone. And that's okay.\n\nSome people want a quick fix. Some aren't ready. Some need a different approach.\n\nLetting go of the "savior complex" made me a better practitioner.`, likes: 212 },
        { content: `For the new grads:\n\nDON'T wait until you feel "ready" to start getting clients.\n\nYou'll learn more from your first 10 clients than any course can teach you.\n\nStart messy. Improve as you go. ✨`, likes: 167 },
        { content: `Something that changed my practice:\n\nI stopped trying to fit into the "health coach" box.\n\nI'm not just a coach. I'm an educator. A detective. An advocate.\n\nDefine yourself on YOUR terms.`, likes: 134 },
        { content: `Weekly reminder that SEO is free marketing.\n\nI wrote 5 blog posts about thyroid health 4 months ago. Still getting clients from them every week.\n\nPlay the long game. 📈`, likes: 98 },
        { content: `To anyone scared of charging "too much":\n\nI just had a client tell me I should charge MORE because the value she got was "life-changing."\n\nWe often underestimate our worth. Charge what you're worth.`, likes: 178 },
        { content: `Hot take: You don't need to be on every social platform.\n\nI'm only on Instagram. That's it.\n\nPick ONE platform. Master it. Ignore the noise. 🎯`, likes: 145 },
        { content: `My #1 tip for new practitioners:\n\nASK. FOR. TESTIMONIALS.\n\nAfter every successful outcome, ask if they'd be willing to share their experience.\n\nSocial proof is everything in this business.`, likes: 167 },
    ],
    mindset: [
        { content: `3 years ago I was scared to talk about health on social media.\n\n"Who am I to give advice?"\n\nToday I have 3,000 followers and a full practice.\n\nThe fear doesn't go away. You just do it scared.`, likes: 234 },
        { content: `Mindset shift that changed everything:\n\nI stopped seeing other practitioners as competition.\n\nThey're colleagues. Resources. Friends.\n\nThere are SO many people who need help. More than enough for all of us.`, likes: 189 },
        { content: `"But what if I fail?"\n\nI used to ask myself this every day.\n\nNow I ask: "What if I succeed?"\n\nSame energy, different direction. Try it. 🌟`, likes: 156 },
        { content: `Real talk: Building a practice is hard.\n\nBut you know what's harder? Staying in a job that drains your soul.\n\nI'll take the hard-but-meaningful over easy-but-empty any day.`, likes: 278 },
        { content: `Stop waiting for permission.\n\nYou don't need anyone to tell you you're ready. You don't need more certifications. You don't need a bigger following.\n\nYou need to START.`, likes: 198 },
        { content: `Something I remind myself daily:\n\nI'm not in competition with anyone except who I was yesterday.\n\nCompare less. Create more. 💛`, likes: 167 },
    ],
    milestone: [
        { content: `🎉 1 YEAR ANNIVERSARY 🎉\n\nOne year ago today I officially launched my practice.\n\n365 days. 84 clients. Countless transformations.\n\nIf you're on day 1 or day 100, keep going. The other side is worth it.`, likes: 312 },
        { content: `Just hit 100 CLIENTS served! 🎊\n\nSome were one-time consults. Some became long-term clients. All taught me something.\n\nI remember when getting 10 felt impossible.\n\nDream bigger. Then execute.`, likes: 267 },
        { content: `Milestone: First client who was a DOCTOR.\n\nShe came to me for gut health guidance because conventional training didn't cover it.\n\nWe're not competing with doctors. We're collaborating.\n\nThis validation hit different. 🩺`, likes: 189 },
        { content: `Just paid off my car with practice income.\n\nNot a flex, just... wow.\n\n18 months ago I had $200 in my account and took a leap on this certification.\n\nNow I'm financially free AND helping people.\n\nDon't give up. ✨`, likes: 345 },
        { content: `WAITLIST ACTIVATED. 🚀\n\nI never thought I'd have MORE clients wanting to work with me than I have time for.\n\nThis is the problem I dreamed of having.\n\nRaising my rates next month. Growth is uncomfortable but necessary.`, likes: 223 },
    ],
};

// Comments
const COMMENT_TEMPLATES = [
    "This is exactly what I needed to hear today! 🙌",
    "So proud of you!! Congrats! 🎉",
    "Your story gives me hope. Thank you for sharing!",
    "GOALS!! Can't wait to be where you are!",
    "This made me tear up. You deserve this!",
    "The part about imposter syndrome... SO relatable",
    "Thank you for being transparent! This helps so much",
    "Saving this post for motivation!",
    "You're crushing it! 💪",
    "Love this community so much ❤️",
    "Needed to see this today. Thank you!",
    "This is amazing! Keep going! 🚀",
];

async function main() {
    console.log("🌱 Seeding graduate profiles and posts...\n");

    // Clear existing
    await prisma.graduatePost.deleteMany({});
    console.log("Cleared existing posts");

    // Create/update profiles
    const profiles: { id: string; name: string }[] = [];
    for (let i = 0; i < PROFILES.length; i++) {
        const profile = PROFILES[i];
        const avatar = AVATARS[i % AVATARS.length];
        const id = `graduate-${profile.name.toLowerCase().replace(/[^a-z]/g, "-")}`;

        const created = await prisma.zombieProfile.upsert({
            where: { id },
            update: {
                ...profile,
                avatar,
                personalityType: "leader",
                isGraduate: true,
                tier: 1,
            },
            create: {
                id,
                ...profile,
                avatar,
                personalityType: "leader",
                isGraduate: true,
                tier: 1,
            },
        });
        profiles.push({ id: created.id, name: created.name });
    }
    console.log(`Created/updated ${profiles.length} profiles\n`);

    // Create posts
    let postCount = 0;
    for (const [postType, postList] of Object.entries(POSTS)) {
        for (const post of postList) {
            const profile = profiles[postCount % profiles.length];
            const daysAgo = Math.floor(Math.random() * 90) + 1;
            const postedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

            // Generate comments
            const comments = [];
            const commentCount = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < commentCount; i++) {
                const commenter = profiles[(postCount + i + 1) % profiles.length];
                comments.push({
                    name: commenter.name,
                    content: COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)],
                    createdAt: new Date(postedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                });
            }

            await prisma.graduatePost.create({
                data: {
                    profile: { connect: { id: profile.id } },
                    postType,
                    content: post.content,
                    likes: post.likes + Math.floor(Math.random() * 50),
                    comments,
                    postedAt,
                    isActive: true,
                },
            });

            console.log(`  ✓ ${postType}: ${profile.name}`);
            postCount++;
        }
    }

    console.log(`\n✅ Created ${postCount} posts!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
