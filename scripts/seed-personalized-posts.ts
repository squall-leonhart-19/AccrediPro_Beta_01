import prisma from "../src/lib/prisma";

/**
 * Seed Personalized Community Posts
 * 
 * Creates unique, human-sounding posts based on each zombie's:
 * - Bio (extracted story, years experience)
 * - Specialties (Gut Health, Hormones, etc.)
 * - Professional title
 * - Location
 * 
 * Different writing styles, tones, emotions per post
 */

// ============================================
// WINS POST TEMPLATES - Various writing styles
// ============================================
interface PostTemplate {
    titleTemplate: string;
    contentTemplate: string;
    style: 'excited' | 'grateful' | 'reflective' | 'casual' | 'professional' | 'emotional';
}

const WINS_TEMPLATES: PostTemplate[] = [
    // EXCITED style
    {
        titleTemplate: "omg you guys... {YEARS} years and I'm STILL learning new stuff 😭",
        contentTemplate: `<p>so after {YEARS} years as a {TITLE}, you'd think I'd have it figured out right??</p>
<p>WRONG.</p>
<p>Module 5's section on {SPECIALTY1} literally broke my brain. I've been helping clients in {CITY} focus on diet this whole time and completely underestimating the deeper issues.</p>
<p>Had a long-term client with {SPECIALTY2} symptoms that just wouldn't quit. We'd tried everything. Then after Sarah's lesson I was like... wait.</p>
<p>Focused on {SPECIALTY1} for 6 weeks. Her markers dropped 40%. 🤯</p>
<p>{CLIENTS}+ clients later and I'm still learning. This is why I love this work. 💕</p>`,
        style: 'excited'
    },
    // GRATEFUL style
    {
        titleTemplate: "my own health journey led me here... and now look 🥹",
        contentTemplate: `<p>I need to share this because it's been a JOURNEY.</p>
<p>Before becoming a {TITLE}, I was the patient. {SPECIALTY1} issues so bad I thought I'd never feel normal again. Doctors in {CITY} kept telling me my labs were "fine."</p>
<p>Sound familiar? Yeah. That's why I do what I do now.</p>
<p>This week I hit a milestone - {CLIENTS}+ clients helped. And most of them found me through word of mouth.</p>
<p>Sarah always says "your story is your marketing." She was SO right.</p>
<p>I don't hide my struggles. And women with similar conditions DM me like "finally someone who GETS it."</p>
<p>Your health struggles aren't a weakness - they're your superpower ❤️</p>`,
        style: 'grateful'
    },
    // EMOTIONAL style
    {
        titleTemplate: "Just helped client #{CLIENTS} and I'm SOBBING",
        contentTemplate: `<p>I literally just finished a call with client #{CLIENTS} and I can't stop crying</p>
<p>{YEARS} years ago I got certified thinking "maybe I'll help a few friends."</p>
<p>Now I'm sitting in my home office in {CITY} with actual paying clients who trust me with their health.</p>
<p>Today's client? A woman who was told by her doctor to "just deal with it." She'd been struggling with {SPECIALTY1} for years.</p>
<p>We worked on {SPECIALTY2}, inflammation, and her stress response.</p>
<p>She texted me yesterday saying she finally feels like herself again.</p>
<p>THIS is why we do this. Not for the money. For these moments. 💕</p>`,
        style: 'emotional'
    },
    // CASUAL style
    {
        titleTemplate: "from {BACKGROUND} to FM coach... best decision EVER",
        contentTemplate: `<p>real talk: {YEARS} years ago I was just a {BACKGROUND}</p>
<p>I had clients/patients who would do everything right - eat clean, exercise, sleep well - and STILL feel like garbage</p>
<p>and I'd be like "idk try more of the same thing??" 🤦‍♀️</p>
<p>then I learned about functional medicine and it was like putting on glasses for the first time</p>
<p>NOW when a client in {CITY} comes to me with {SPECIALTY1} issues I actually know what to look for</p>
<p>Last month I made more than I did in my old career. Working HALF the hours. From my living room.</p>
<p>{CLIENTS}+ clients later, my only regret is not doing this sooner 💪</p>`,
        style: 'casual'
    },
    // PROFESSIONAL style
    {
        titleTemplate: "{YEARS} years of experience taught me something powerful",
        contentTemplate: `<p>As a {TITLE} specializing in {SPECIALTY1}, I've worked with over {CLIENTS} clients in the {CITY} area.</p>
<p>But here's what I've learned that textbooks never taught me:</p>
<p>The root cause is almost NEVER what the client thinks it is.</p>
<p>A client came to me last month convinced her issue was {SPECIALTY2}. After our comprehensive intake, we discovered it was actually related to {SPECIALTY1}.</p>
<p>6 weeks later? Symptoms resolved.</p>
<p>The certification gave me the clinical knowledge. But Sarah's coaching gave me the framework to actually FIND root causes.</p>
<p>To my fellow practitioners: trust the process. The answers are there if you know where to look.</p>`,
        style: 'professional'
    },
    // MORE EXCITED
    {
        titleTemplate: "I'M OFFICIALLY BOOKED OUT FOR 3 MONTHS 🎉🎉🎉",
        contentTemplate: `<p>AHHHHHH I have to share this because I literally cannot believe it</p>
<p>When I started as a {TITLE} in {CITY} {YEARS} years ago, I was terrified no one would pay me</p>
<p>I remember my first discovery call - my hands were SHAKING</p>
<p>Now?? I have a WAITLIST. People are booking 3 months out because they specifically want to work with someone who understands {SPECIALTY1}.</p>
<p>{CLIENTS}+ clients later and I still pinch myself</p>
<p>To everyone just starting out: IT GETS EASIER. Your people are out there. Keep showing up. Keep posting. Keep learning.</p>
<p>Sarah was right - consistency beats talent every single time 🙌</p>`,
        style: 'excited'
    },
    // REFLECTIVE
    {
        titleTemplate: "looking back at where I started vs now... wow",
        contentTemplate: `<p>Feeling reflective today so I wanted to share...</p>
<p>{YEARS} years ago I was burned out, questioning everything, wondering if there was more to health than what I'd learned.</p>
<p>Now I'm a {TITLE} in {CITY} with {CLIENTS}+ clients who trust me with their health journeys.</p>
<p>The biggest shift? Learning that {SPECIALTY1} and {SPECIALTY2} are connected in ways I never imagined.</p>
<p>Sarah always says "the body is not separate systems - it's one integrated whole."</p>
<p>Once I truly understood that, everything changed - for me AND my clients.</p>
<p>If you're in the early stages feeling lost - keep going. The clarity comes. I promise. 💛</p>`,
        style: 'reflective'
    },
    // EMOTIONAL 2
    {
        titleTemplate: "a client just said something that made me ugly cry 😭",
        contentTemplate: `<p>I need to share this text I got from a client today:</p>
<p><em>"You're the first person who actually listened to me. My doctor dismissed me for years. You changed my life."</em></p>
<p>I'm not going to lie - I ugly cried in my home office for 20 minutes.</p>
<p>This woman came to me defeated. {SPECIALTY1} issues that no one could figure out. She'd been to so many specialists in {CITY}.</p>
<p>We focused on {SPECIALTY2}, root causes Sarah taught us about, and within 3 months she feels like a new person.</p>
<p>THIS is why I became a {TITLE}. Not for the income. For moments like this.</p>
<p>{CLIENTS}+ clients in and I'm still in awe that I get to do this work. 💕</p>`,
        style: 'emotional'
    },
    // CASUAL 2
    {
        titleTemplate: "ok so wild thing happened today lol",
        contentTemplate: `<p>y'all aren't gonna believe this</p>
<p>so I'm at the grocery store in {CITY} right? just buying spinach, minding my business</p>
<p>this woman taps my shoulder and goes "are you the {SPECIALTY1} coach from Instagram??"</p>
<p>turns out she's been following me for 6 months and just booked a discovery call YESTERDAY</p>
<p>like... what are the odds?? 😂</p>
<p>we ended up talking in the produce section for 20 minutes about {SPECIALTY2} lol</p>
<p>after {YEARS} years and {CLIENTS}+ clients, stuff like this still blows my mind</p>
<p>this community is everywhere. we're making a difference. even at the grocery store 🥬</p>`,
        style: 'casual'
    },
    // GRATEFUL 2
    {
        titleTemplate: "hit a milestone today and had to share 🙏",
        contentTemplate: `<p>Feeling incredibly grateful today...</p>
<p>When I first became a {TITLE} in {CITY}, I set a goal to help 100 people with {SPECIALTY1}.</p>
<p>Today I realized I've officially helped {CLIENTS}+ clients. More than I ever imagined.</p>
<p>Some highlights from this journey:</p>
<ul>
<li>Clients who finally got answers after years of "you're fine"</li>
<li>Women who got their energy back and can play with their kids again</li>
<li>People who said I was the first practitioner who actually listened</li>
</ul>
<p>None of this would have happened without Sarah's program and this supportive community.</p>
<p>To everyone still working toward their goals - your milestone is coming. Keep going. 🙌</p>`,
        style: 'grateful'
    }
];

// ============================================
// GRADUATES POST TEMPLATES
// ============================================
const GRADUATES_TEMPLATES: PostTemplate[] = [
    {
        titleTemplate: "I'M OFFICIALLY CERTIFIED!!! 🎓🎓🎓",
        contentTemplate: `<p>IT'S OFFICIAL!!! I passed my certification exam!!!</p>
<p>After {YEARS} years of working in {BACKGROUND}, I finally took the leap and got my functional medicine certification.</p>
<p>Not gonna lie - there were moments I wanted to quit. Module 4 almost broke me lol 😅</p>
<p>But here I am. {TITLE} certified. Ready to help people with {SPECIALTY1} in {CITY}.</p>
<p>To everyone still in the program - KEEP GOING. It's so worth it. The moment you get that email saying you passed... 🥹</p>
<p>Thank you Sarah and this whole community. I couldn't have done it without you. 💕</p>`,
        style: 'excited'
    },
    {
        titleTemplate: "just got my certificate in the mail and I'm crying 😭",
        contentTemplate: `<p>I opened my mailbox today and saw it.</p>
<p>The physical certificate. With MY NAME on it.</p>
<p>I'm officially a certified {TITLE}.</p>
<p>This has been a dream of mine for so long. Finally understanding {SPECIALTY1} and {SPECIALTY2} at a deep level. Finally being able to actually HELP people in {CITY} instead of just guessing.</p>
<p>I'm framing this immediately. It's going right on my office wall.</p>
<p>To everyone still studying - this moment is coming. Visualize it. Work for it. It'll happen. 🎓</p>`,
        style: 'emotional'
    },
    {
        titleTemplate: "passed my exam on the first try!!",
        contentTemplate: `<p>Ok I was SO nervous but I passed my certification exam on the first try!!</p>
<p>Not gonna flex too hard because that Module 3 stuff on {SPECIALTY1} almost got me 😂</p>
<p>But here I am! Certified and ready to start helping clients in {CITY}.</p>
<p>My study tips if anyone's taking the exam soon:</p>
<ul>
<li>Review Sarah's case studies - they're gold</li>
<li>Focus on understanding WHY, not just memorizing</li>
<li>Take practice tests until you're bored</li>
<li>Trust yourself - you know more than you think</li>
</ul>
<p>YOU GOT THIS 💪</p>`,
        style: 'casual'
    },
    {
        titleTemplate: "at {AGE}, I proved it's never too late to start 🎓",
        contentTemplate: `<p>A lot of people told me I was "too old" to start a new career.</p>
<p>Well... I just got certified as a {TITLE}. At {AGE}.</p>
<p>After {YEARS} years in {BACKGROUND}, I decided I wanted MORE. I wanted to actually help people with {SPECIALTY1} instead of just managing symptoms.</p>
<p>The certification process wasn't easy. But nothing worth doing ever is.</p>
<p>To everyone who thinks they're "too old" - you're not. Your experience is an ASSET. Your wisdom matters. Go get certified.</p>
<p>See you on the other side 💛</p>`,
        style: 'reflective'
    },
    {
        titleTemplate: "from zero knowledge to CERTIFIED in {MONTHS} months",
        contentTemplate: `<p>When I started this journey, I knew NOTHING about functional medicine.</p>
<p>I'd heard about {SPECIALTY1} and {SPECIALTY2} but had no idea how it all connected.</p>
<p>{MONTHS} months later? I'm a certified {TITLE}.</p>
<p>The program taught me:</p>
<ul>
<li>How to read labs properly (not just "normal" vs "abnormal")</li>
<li>Root cause frameworks that actually work</li>
<li>How to create personalized protocols</li>
<li>Business basics to actually get clients</li>
</ul>
<p>Ready to start my practice in {CITY}. Watch this space! 🚀</p>`,
        style: 'professional'
    }
];

// ============================================
// QUESTIONS POST TEMPLATES  
// ============================================
const QUESTIONS_TEMPLATES: PostTemplate[] = [
    {
        titleTemplate: "ok dumb question but... {SPECIALTY1} and {SPECIALTY2} connection?",
        contentTemplate: `<p>Hi everyone! I'm a {TITLE} in {CITY} and I have what might be a dumb question...</p>
<p>I have a client presenting with {SPECIALTY1} issues but I'm also seeing signs of {SPECIALTY2}.</p>
<p>Sarah mentioned in Module 4 that these can be connected but I'm not seeing the full picture yet.</p>
<p>Has anyone worked with a case like this? What was your approach?</p>
<p>Would love any insights! 🙏</p>`,
        style: 'casual'
    },
    {
        titleTemplate: "how do you handle clients who won't follow the protocol?",
        contentTemplate: `<p>Need some advice here...</p>
<p>I'm a {TITLE} working with a client on {SPECIALTY1}. She came to me desperate for help.</p>
<p>Created a whole protocol. She agreed to everything. Then... she's not actually doing it.</p>
<p>Still eating gluten. Still not taking the supplements. Then complaining that nothing is working. 😩</p>
<p>How do you all handle this? I don't want to be harsh but also... the protocol only works if you DO it?</p>
<p>Any scripts or approaches that have worked for you? I'm in {CITY} if anyone wants to chat.</p>`,
        style: 'reflective'
    },
    {
        titleTemplate: "pricing question - am I charging enough?",
        contentTemplate: `<p>So I've been a {TITLE} for {YEARS} years now, working mostly with {SPECIALTY1} clients in {CITY}.</p>
<p>I'm currently charging $150/session and I'm fully booked.</p>
<p>My question: is that a sign I should raise my prices?</p>
<p>I've helped {CLIENTS}+ clients so I have the experience. But raising prices makes me nervous.</p>
<p>What do you all charge? How did you decide when to raise rates?</p>
<p>Thanks in advance! 🙏</p>`,
        style: 'professional'
    },
    {
        titleTemplate: "anyone dealt with {SPECIALTY1} + mold exposure?",
        contentTemplate: `<p>Hey fam! Got a tricky case here...</p>
<p>Client in {CITY} with classic {SPECIALTY1} symptoms. We've tried everything - gut protocols, elimination diet, stress work.</p>
<p>Then she mentioned her apartment had water damage last year. 👀</p>
<p>I'm thinking mold exposure. But this isn't my specialty area.</p>
<p>Anyone have experience with {SPECIALTY2} complicated by mold? What testing do you recommend? What's the protocol?</p>
<p>DMs open too if anyone has resources!</p>`,
        style: 'casual'
    },
    {
        titleTemplate: "what CRM do you all use?",
        contentTemplate: `<p>Quick question for the group...</p>
<p>I'm a {TITLE} with {CLIENTS}+ active clients now and I'm drowning in spreadsheets 😅</p>
<p>Looking for a CRM that can handle:</p>
<ul>
<li>Client intake forms</li>
<li>Appointment scheduling</li>
<li>Protocol tracking</li>
<li>Invoicing</li>
</ul>
<p>What do you all use and love? Bonus points if it's affordable - I'm not rolling in cash just yet lol</p>
<p>Based in {CITY} if anyone wants to grab virtual coffee and share tips!</p>`,
        style: 'casual'
    }
];

// ============================================
// TIPS POST TEMPLATES
// ============================================
const TIPS_TEMPLATES: PostTemplate[] = [
    {
        titleTemplate: "game-changing tip for {SPECIALTY1} clients 💡",
        contentTemplate: `<p>After {YEARS} years as a {TITLE} and {CLIENTS}+ clients, I've learned something that changed my practice:</p>
<p><strong>Always check {SPECIALTY2} in {SPECIALTY1} cases.</strong></p>
<p>I know Sarah mentions this in Module 4 but I didn't fully GET it until I saw it repeatedly in my {CITY} clients.</p>
<p>The connection is:</p>
<ul>
<li>Root cause is often not what you think</li>
<li>Systems are interconnected</li>
<li>Addressing the underlying issue resolves multiple symptoms</li>
</ul>
<p>Hope this helps someone! Happy to elaborate in the comments 💕</p>`,
        style: 'professional'
    },
    {
        titleTemplate: "the intake question that changed everything",
        contentTemplate: `<p>Quick tip that has been a GAME CHANGER for my practice...</p>
<p>I added one question to my intake form:</p>
<p><strong>"What did your health look like BEFORE your symptoms started?"</strong></p>
<p>This one question has revealed SO much. Stressful life events. Antibiotic use. Mold exposure. Travel. Trauma.</p>
<p>As a {TITLE} specializing in {SPECIALTY1}, this helps me find root cause so much faster.</p>
<p>Try it with your next client in {CITY} or wherever you are! Let me know if it helps 🙏</p>`,
        style: 'casual'
    },
    {
        titleTemplate: "how I explain {SPECIALTY1} to confused clients",
        contentTemplate: `<p>Hey! Wanted to share an analogy that's been working great...</p>
<p>When clients in {CITY} come to me confused about {SPECIALTY1}, I explain it like this:</p>
<p>"Your body is like a bucket. Stressors are water pouring in. When the bucket overflows, you get symptoms."</p>
<p>"Our job is to find what's filling the bucket and remove it, while also making the bucket bigger."</p>
<p>They GET it immediately. No more glazed-over eyes when I talk about {SPECIALTY2}!</p>
<p>Feel free to steal this explanation - it's helped me with {CLIENTS}+ clients now. 💛</p>`,
        style: 'casual'
    },
    {
        titleTemplate: "free resource I found for {SPECIALTY1} protocols",
        contentTemplate: `<p>Sharing this because I wish someone had told ME sooner...</p>
<p>Found an amazing free resource for {SPECIALTY1} protocols that complements what Sarah teaches perfectly.</p>
<p>It's helped me with multiple {CITY} clients dealing with {SPECIALTY2} complications.</p>
<p>The key insights:</p>
<ul>
<li>Step-by-step protocols you can customize</li>
<li>Lab interpretation guidelines</li>
<li>Supplement recommendations</li>
</ul>
<p>DM me if you want the link! Didn't want to just post it in case that's against the rules.</p>
<p>Happy to help - we're all in this together as {TITLE}s! 🙏</p>`,
        style: 'professional'
    },
    {
        titleTemplate: "my morning routine that keeps me sane",
        contentTemplate: `<p>Ok this is less clinical but important...</p>
<p>After {YEARS} years as a {TITLE} and {CLIENTS}+ clients, I was heading toward burnout.</p>
<p>What saved me was establishing a non-negotiable morning routine:</p>
<ul>
<li>30 min walk before opening emails</li>
<li>No client calls before 10am</li>
<li>10 min meditation (Calm app is my fav)</li>
<li>Big glass of water before coffee</li>
</ul>
<p>I practice what I preach about {SPECIALTY1} for myself too!</p>
<p>What routines keep you sane, {CITY} practitioners? Curious what works for others 💛</p>`,
        style: 'casual'
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Extract years from bio
function extractYears(bio: string | null): number {
    if (!bio) return Math.floor(Math.random() * 8) + 2;
    const match = bio.match(/(\d+)\+?\s*years?/i);
    return match ? parseInt(match[1]) : Math.floor(Math.random() * 8) + 2;
}

// Extract client count from bio  
function extractClients(bio: string | null): number {
    if (!bio) return (Math.floor(Math.random() * 4) + 1) * 100;
    const match = bio.match(/(\d+)\+?\s*clients?/i);
    return match ? parseInt(match[1]) : (Math.floor(Math.random() * 4) + 1) * 100;
}

// Extract background from bio
function extractBackground(bio: string | null): string {
    const backgrounds = [
        "personal trainer", "registered nurse", "corporate executive",
        "teacher", "stay-at-home mom", "office manager", "therapist",
        "yoga instructor", "nutritionist", "medical assistant"
    ];
    if (!bio) return backgrounds[Math.floor(Math.random() * backgrounds.length)];

    if (bio.includes("nurse") || bio.includes("RN")) return "registered nurse";
    if (bio.includes("trainer")) return "personal trainer";
    if (bio.includes("counselor") || bio.includes("therapist")) return "mental health counselor";
    if (bio.includes("corporate")) return "corporate professional";

    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

// Get random template
function randomTemplate<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Get city from location
function getCity(location: string | null): string {
    if (!location) return "my city";
    return location.split(",")[0].trim();
}

// Random date in last 6 months
function randomDate(): Date {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    return new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
}

// Random counts
function randomViews(): number { return Math.floor(Math.random() * 800) + 100; }
function randomLikes(): number { return Math.floor(Math.random() * 80) + 10; }

// Fill template with data
function fillTemplate(template: PostTemplate, zombie: any): { title: string; content: string } {
    const years = extractYears(zombie.bio);
    const clients = extractClients(zombie.bio);
    const background = extractBackground(zombie.bio);
    const city = getCity(zombie.location);
    const specialties = (zombie.specialties as string[]) || ["Gut Health", "Hormone Balance"];
    const specialty1 = specialties[0] || "Gut Health";
    const specialty2 = specialties[1] || specialties[0] || "Hormone Balance";
    const title = zombie.professionalTitle || "Health Coach";
    const age = Math.floor(Math.random() * 20) + 40; // 40-60
    const months = Math.floor(Math.random() * 8) + 4; // 4-12 months

    let postTitle = template.titleTemplate
        .replace(/{YEARS}/g, String(years))
        .replace(/{SPECIALTY1}/g, specialty1)
        .replace(/{SPECIALTY2}/g, specialty2)
        .replace(/{CITY}/g, city)
        .replace(/{CLIENTS}/g, String(clients))
        .replace(/{TITLE}/g, title)
        .replace(/{BACKGROUND}/g, background)
        .replace(/{AGE}/g, String(age))
        .replace(/{MONTHS}/g, String(months));

    let postContent = template.contentTemplate
        .replace(/{YEARS}/g, String(years))
        .replace(/{SPECIALTY1}/g, specialty1)
        .replace(/{SPECIALTY2}/g, specialty2)
        .replace(/{CITY}/g, city)
        .replace(/{CLIENTS}/g, String(clients))
        .replace(/{TITLE}/g, title)
        .replace(/{BACKGROUND}/g, background)
        .replace(/{AGE}/g, String(age))
        .replace(/{MONTHS}/g, String(months));

    return { title: postTitle, content: postContent };
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
    console.log("🚀 Starting personalized community post seeding...\n");

    // Get all zombies with profile data
    const zombies = await prisma.user.findMany({
        where: { isFakeProfile: true },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            bio: true,
            specialties: true,
            professionalTitle: true,
            location: true,
        },
    });

    console.log(`📊 Found ${zombies.length} zombie profiles\n`);

    if (zombies.length === 0) {
        console.log("❌ No zombie profiles found!");
        return;
    }

    // Shuffle zombies
    const shuffled = [...zombies].sort(() => Math.random() - 0.5);

    // Distribution per category (using first 10 categories proportionally)
    const POST_COUNTS = {
        wins: 150,      // ~150 per run
        graduates: 80,  // ~80 per run  
        questions: 60,  // ~60 per run
        tips: 40,       // ~40 per run
    };

    let totalCreated = 0;
    let zombieIndex = 0;

    // Create WINS posts
    console.log("\n🏆 Creating Wins posts...");
    for (let i = 0; i < POST_COUNTS.wins && zombieIndex < shuffled.length; i++) {
        const zombie = shuffled[zombieIndex++];
        const template = randomTemplate(WINS_TEMPLATES);
        const { title, content } = fillTemplate(template, zombie);

        await prisma.communityPost.create({
            data: {
                title,
                content,
                categoryId: "wins",
                authorId: zombie.id,
                createdAt: randomDate(),
                viewCount: randomViews(),
                likeCount: randomLikes(),
            },
        });
        totalCreated++;
        if ((i + 1) % 25 === 0) console.log(`  ✅ Created ${i + 1} wins posts...`);
    }
    console.log(`  ✅ Created ${POST_COUNTS.wins} wins posts`);

    // Create GRADUATES posts
    console.log("\n🎓 Creating Graduates posts...");
    for (let i = 0; i < POST_COUNTS.graduates && zombieIndex < shuffled.length; i++) {
        const zombie = shuffled[zombieIndex++];
        const template = randomTemplate(GRADUATES_TEMPLATES);
        const { title, content } = fillTemplate(template, zombie);

        await prisma.communityPost.create({
            data: {
                title,
                content,
                categoryId: "graduates",
                authorId: zombie.id,
                createdAt: randomDate(),
                viewCount: randomViews(),
                likeCount: randomLikes(),
            },
        });
        totalCreated++;
        if ((i + 1) % 20 === 0) console.log(`  ✅ Created ${i + 1} graduates posts...`);
    }
    console.log(`  ✅ Created ${POST_COUNTS.graduates} graduates posts`);

    // Create QUESTIONS posts
    console.log("\n❓ Creating Questions posts...");
    for (let i = 0; i < POST_COUNTS.questions && zombieIndex < shuffled.length; i++) {
        const zombie = shuffled[zombieIndex++];
        const template = randomTemplate(QUESTIONS_TEMPLATES);
        const { title, content } = fillTemplate(template, zombie);

        await prisma.communityPost.create({
            data: {
                title,
                content,
                categoryId: "questions",
                authorId: zombie.id,
                createdAt: randomDate(),
                viewCount: randomViews(),
                likeCount: randomLikes(),
            },
        });
        totalCreated++;
        if ((i + 1) % 15 === 0) console.log(`  ✅ Created ${i + 1} questions posts...`);
    }
    console.log(`  ✅ Created ${POST_COUNTS.questions} questions posts`);

    // Create TIPS posts
    console.log("\n💡 Creating Tips posts...");
    for (let i = 0; i < POST_COUNTS.tips && zombieIndex < shuffled.length; i++) {
        const zombie = shuffled[zombieIndex++];
        const template = randomTemplate(TIPS_TEMPLATES);
        const { title, content } = fillTemplate(template, zombie);

        await prisma.communityPost.create({
            data: {
                title,
                content,
                categoryId: "tips",
                authorId: zombie.id,
                createdAt: randomDate(),
                viewCount: randomViews(),
                likeCount: randomLikes(),
            },
        });
        totalCreated++;
        if ((i + 1) % 10 === 0) console.log(`  ✅ Created ${i + 1} tips posts...`);
    }
    console.log(`  ✅ Created ${POST_COUNTS.tips} tips posts`);

    console.log(`\n🎉 DONE! Created ${totalCreated} personalized posts!`);
    console.log(`Used ${zombieIndex} zombie profiles`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
