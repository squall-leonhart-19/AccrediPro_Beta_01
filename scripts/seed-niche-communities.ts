
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// --- Data & Config ---

const NICHE_CONFIGS = [
    {
        slug: 'tr',
        name: 'Trauma & Recovery',
        topics: [
            { channel: 'QUESTIONS', title: "Somatic experiencing for CPTSD?", content: "Has anyone had success integrating somatic experiencing with clients dealing with CPTSD? I'm finding talk therapy hits a wall." },
            { channel: 'QUESTIONS', title: "Resources for attachment trauma", content: "Looking for book recommendations specifically on attachment trauma in adults. My client describes feeling 'unanchored'." },
            { channel: 'TIPS', title: "The power of 'glimmers'", content: "Just a reminder to help clients look for 'glimmers' - opposite of triggers. Micromoments of safety and connection. It's reshaping my practice." },
            { channel: 'WINS', title: "Client breakthrough after 6 months", content: "My client finally felt safe enough to close their eyes during our grounding exercise. It took 6 months of patience. Small wins are huge wins!" },
            { channel: 'INTRODUCTIONS', title: "Hi from a former social worker", content: "Transitioning from clinical social work to trauma-informed coaching. Hoping to find more freedom in how I support people here." },
            { channel: 'TIPS', title: "Polyvagal theory simplifier", content: "I found using the 'ladder' analogy for Polyvagal theory really helps clients understand their state shifts without getting bogged down in jargon." }
        ],
        keywords: ["safety", "nervous system", "grounding", "regulation", "healing", "patience", "connection", "body-based"]
    },
    {
        slug: 'mh',
        name: 'Mental Health & Wellness',
        topics: [
            { channel: 'QUESTIONS', title: "Supplements for anxiety support", content: "Beyond magnesium, what are your go-to gentle supports for high-functioning anxiety? (Disclaimer: I know we don't prescribe!)" },
            { channel: 'WINS', title: "Client off meds (with doctor's help)", content: "Celebrated with a client today who successfully tapered off SSRIs with her psychiatrist's support, using our lifestyle protocols as the safety net." },
            { channel: 'TIPS', title: "The gut-brain connection visual", content: "I drew a simple diagram of the vagus nerve connecting gut and brain for a client today. Their lightbulb moment was instant!" },
            { channel: 'INTRODUCTIONS', title: "Psych nurse turning coach", content: "Hi everyone! 15 years in psych nursing. Tired of the 'medicate and separate' model. Ready to help people truly thrive." },
            { channel: 'QUESTIONS', title: "Dealing with imposter syndrome", content: "How do you handle it when a client's issues feel too close to your own struggles? Feeling a bit of projection today." }
        ],
        keywords: ["anxiety", "mood", "balance", "holistic", "clarity", "focus", "resilience", "support"]
    },
    {
        slug: 'pf',
        name: 'Parenting & Family',
        topics: [
            { channel: 'QUESTIONS', title: "Picky eater or sensory issue?", content: "5yo client (well, mom is the client) won't touch anything green. How do you distinguish between behavioral picky eating and sensory texture issues?" },
            { channel: 'WINS', title: "Whole family sleeping through the night!", content: "After fixing the 3yo's gut health issues, he's finally sleeping. Mom called me crying tears of joy. Sleep is life!" },
            { channel: 'TIPS', title: "Hidden sugar in 'kids' foods'", content: "Compiled a list of 'healthy' kids snacks that have more sugar than a candy bar. Shocking. Sharing the PDF below." },
            { channel: 'INTRODUCTIONS', title: "Mom of 4, aiming to help others", content: "Hi! I'm a mom of 4. Navigated allergies and eczema with my crew. Now want to help other overwhelmed parents find answers." },
            { channel: 'QUESTIONS', title: "Teens and screen time detox", content: "Any strategies for a dopamine detox for teenagers that doesn't result in World War 3?" }
        ],
        keywords: ["kids", "sleep", "nutrition", "behavior", "school", "sensory", "connection", "routines"]
    },
    {
        slug: 'mb',
        name: 'Mind & Body',
        topics: [
            { channel: 'TIPS', title: "Breathwork vs. Meditation", content: "Found that for my high-stress clients, active breathwork is much more accessible than silent meditation. They need something to DO." },
            { channel: 'QUESTIONS', title: "Yoga for adrenal fatigue?", content: "Is Vinyasa too stimulating for someone in stage 3 adrenal dysfunction? Should I strictly recommend Yin or Restorative?" },
            { channel: 'WINS', title: "Chronic pain reduced by 50%", content: "Client with unexplained back pain realized it flares with emotional stress. We worked on the emotional root and the pain melted away." },
            { channel: 'INTRODUCTIONS', title: "Yoga teacher expanding practice", content: "Hello! Yoga teacher for 10 years. Realized physical movement wasn't enough without the nutrition and lifestyle piece." },
            { channel: 'TIPS', title: "Morning routine for non-morning people", content: "The '5-minute floor time' rule. Just roll onto the floor and stretch. Low barrier to entry!" }
        ],
        keywords: ["movement", "breath", "connection", "awareness", "flow", "energy", "stillness", "integration"]
    },
    {
        slug: 'pw',
        name: 'Pet Wellness',
        topics: [
            { channel: 'QUESTIONS', title: "Raw food transition for sensitive tummy", content: "My client wants to switch her Golden Retriever to raw, but he has a super sensitive stomach. Slow transition tips?" },
            { channel: 'WINS', title: "Itchy paws GONE!", content: "Removed chicken from a Bulldog's diet and added omega-3s. 3 weeks later, no more paw licking! The owner is ecstatic." },
            { channel: 'TIPS', title: "Bone broth for older cats", content: "Tip: Warm bone broth is a game changer for getting senior cats to hydrate and eat. Make sure it's onion/garlic free!" },
            { channel: 'INTRODUCTIONS', title: "Vet Tech to Pet Health Coach", content: "Hey! 8 years as a vet tech. Saw too many preventable chronic issues. here to focus on prevention and nutrition." },
            { channel: 'QUESTIONS', title: "CBD for separation anxiety?", content: "Anyone have a reliable brand or dosage guide for CBD for dogs with thunder anxiety?" }
        ],
        keywords: ["dog", "cat", "nutrition", "natural", "coat", "energy", "play", "comfort"]
    },
    {
        slug: 'hb',
        name: 'Herbalism',
        topics: [
            { channel: 'TIPS', title: "Nettle infusion vs. tea", content: "Reminder: A 4-hour infusion extracts way more minerals from Nettle than a 5-minute tea steep. My hair has never been thicker." },
            { channel: 'QUESTIONS', title: "Substitute for Ashwagandha?", content: "Client gets agitated on Ashwagandha (nightshade sensitivity?). What's your favorite non-nightshade adaptogen for calming?" },
            { channel: 'WINS', title: "Digestive bitters magic", content: "Simply adding bitters before meals resolved a client's 5-year bloating issue. Plants are powerful!" },
            { channel: 'INTRODUCTIONS', title: "Plant lover finding my path", content: "Always loved gardening. Now learning how to use these plants as medicine. So excited to be here!" },
            { channel: 'TIPS', title: "Harvesting Goldenrod", content: "It's Goldenrod season! Don't confuse it with Ragweed. Great for sinus support and kidneys." }
        ],
        keywords: ["tea", "tincture", "roots", "leaves", "healing", "nature", "wildcrafting", "remedies"]
    },
    {
        slug: 'wh',
        name: "Women's Health",
        topics: [
            { channel: 'QUESTIONS', title: "Seed cycling success rates?", content: "Has anyone seen real lab shifts with just seed cycling? Or is it mostly symptom relief?" },
            { channel: 'WINS', title: "Pregnant after 2 years trying!", content: "We focused on clearing detox pathways and fixing thyroid. client just got her positive test! 😭" },
            { channel: 'TIPS', title: "Tracking cycle as a vital sign", content: "Teaching clients that their period isn't a curse, it's a report card of their health. Reframing is everything." },
            { channel: 'INTRODUCTIONS', title: "Doula + Coach", content: "Hi! I'm a birth doula. Wanting to support women in the preconception and postpartum window more deeply." },
            { channel: 'QUESTIONS', title: "PCOS and dairy", content: "Is it essential to cut ALL dairy for PCOS, or is high-quality goat/sheep cheese okay? finding conflicting research." }
        ],
        keywords: ["cycle", "hormones", "balance", "flow", "fertility", "energy", "mood", "nutrition"]
    },
    {
        slug: 'gw',
        name: 'General Wellness',
        topics: [
            { channel: 'TIPS', title: "Hydration hack", content: "Celtic sea salt in water. Game changer for clients who drink a gallon but still feel thirsty." },
            { channel: 'QUESTIONS', title: "Standing desk fatigue", content: "Clients getting back pain from standing desks. Any specific anti-fatigue mats or protocols you recommend?" },
            { channel: 'WINS', title: "Small habits compound", content: "Client just focused on 2 things: sunlight in morning and no phone in bed. Lost 5lbs and anxiety dropped. Basics work!" },
            { channel: 'INTRODUCTIONS', title: "Curious about everything", content: "Hi! I'm interested in biohacking, longevity, and just feeling good. Excited to learn from you all." },
            { channel: 'TIPS', title: "Blue light blockers", content: "If you aren't wearing them after sunset, you're missing the easiest sleep hack. Get the red ones, not yellow!" }
        ],
        keywords: ["habits", "energy", "sleep", "water", "movement", "basics", "lifestyle", "optimization"]
    }
];

const SARAH_QUOTES = [
    "This is such a great insight! Thanks for sharing.",
    "Love this perspective. Keep going!",
    "So proud of the work you're doing.",
    "That's a huge win! Celebrating with you.",
    "Great question. It really depends on the bio-individuality of the client.",
    "Have you checked the resources in Module 4? There's a great guide on this!",
    "Community, any other thoughts on this?",
    "Spot on!",
    "This is the power of functional wellness right here."
];

// --- Helpers ---

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

const AVATAR_URLS = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face"
];

function generateZombieEmail() {
    return `zombie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@zombie.fake`;
}

// --- Main ---

async function main() {
    console.log('🌱 Starting Niche Community Seeding...');

    // 1. Get Coach Sarah
    let coach = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" }
    });

    if (!coach) {
        console.error("Coach Sarah not found. Please ensure she exists.");
        return;
    }

    // 2. Loop through each Niche
    for (const config of NICHE_CONFIGS) {
        console.log(`\nProcessing: ${config.name} (${config.slug})...`);

        // A. Find or Create Category
        let category = await prisma.category.findFirst({
            where: { slug: config.slug }
        });

        if (!category) {
            console.log(`  - Creating category ${config.name}...`);
            category = await prisma.category.create({
                data: {
                    name: config.name,
                    slug: config.slug,
                    description: `Community for ${config.name} students and practitioners`,
                    isActive: true
                }
            });
        }

        // B. Find or Create Community
        let community = await prisma.categoryCommunity.findFirst({
            where: { categoryId: category.id }
        });

        if (!community) {
            console.log(`  - Creating community for ${config.name}...`);
            community = await prisma.categoryCommunity.create({
                data: {
                    categoryId: category.id,
                    name: `${config.name} Community`,
                    description: `Connect with others in ${config.name}`,
                    welcomePost: `Welcome to the ${config.name} community!`,
                    coachId: coach.id,
                    isActive: true
                }
            });
        }

        // C. Ensure Default Channels Exist
        const channelTypes = ["INTRODUCTIONS", "WINS", "QUESTIONS", "TIPS"];
        const channelMap: Record<string, string> = {}; // Type -> ID

        for (const type of channelTypes) {
            // Find existing channel of this type for this category
            // Note: type is an enum, we need to query carefully or check based on convention
            let channel = await prisma.communityChannel.findFirst({
                where: {
                    categoryId: category.id,
                    type: type as any
                }
            });

            if (!channel) {
                console.log(`  - Creating channel ${type}...`);

                // Define name/emoji based on type
                let name = "Channel";
                let emoji = "📄";
                if (type === "INTRODUCTIONS") { name = "Introduce Yourself"; emoji = "👋"; }
                if (type === "WINS") { name = "Wins & Celebrations"; emoji = "🏆"; }
                if (type === "QUESTIONS") { name = "Questions & Support"; emoji = "💬"; }
                if (type === "TIPS") { name = "Tips & Resources"; emoji = "💡"; }

                channel = await prisma.communityChannel.create({
                    data: {
                        categoryId: category.id,
                        type: type as any,
                        name,
                        emoji,
                        slug: `${config.slug}-${type.toLowerCase()}`,
                        sortOrder: 0
                    }
                });
            }
            channelMap[type] = channel.id;
        }

        // D. Generate Posts
        console.log(`  - Generating posts...`);
        const TARGET_POSTS = 125; // Aim for ~125 per category
        let postsCreated = 0;

        // Use predefined topics first
        for (const topic of config.topics) {
            await createPost(topic.title, topic.content, category.slug, channelMap[topic.channel], community.id, config.keywords);
            postsCreated++;
        }

        // Fill the rest with generated content
        while (postsCreated < TARGET_POSTS) {
            const type = randomFrom(channelTypes);
            const { title, content } = generateContent(type, config.keywords, config.name);
            await createPost(title, content, category.slug, channelMap[type], community.id, config.keywords);
            postsCreated++;
        }
    }

    console.log('\n✅ Seeding Complete! Refresh the platform.');
}

// --- Content Generators ---

async function createPost(title: string, content: string, catSlug: string, channelId: string, communityId: string, keywords: string[]) {
    // Create a zombie
    const firstName = randomFrom(["Jen", "Mike", "Sarah", "David", "Jessica", "Amanda", "Chris", "Ashley", "Brian", "Nicole", "James", "Rachel"]);
    const lastName = randomFrom(["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"]);

    const user = await prisma.user.create({
        data: {
            email: generateZombieEmail(),
            firstName,
            lastName,
            role: UserRole.STUDENT,
            isFakeProfile: true,
            avatar: randomFrom(AVATAR_URLS)
        }
    });

    // Date stuff
    const daysAgo = randomInt(0, 60);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const post = await prisma.communityPost.create({
        data: {
            title,
            content,
            authorId: user.id,
            communityId,
            channelId,
            categoryId: catSlug, // Keep legacy field populated just in case
            viewCount: randomInt(50, 500),
            createdAt,
            updatedAt: createdAt
        }
    });

    // Random Sarah comment
    // Get coach again (inefficient in loop but safe)
    if (Math.random() > 0.7) {
        const coach = await prisma.user.findFirst({ where: { email: "sarah@accredipro-certificate.com" } });
        if (coach) {
            await prisma.postComment.create({
                data: {
                    content: randomFrom(SARAH_QUOTES),
                    postId: post.id,
                    authorId: coach.id,
                    createdAt: new Date(createdAt.getTime() + 1000 * 60 * 60) // 1 hour later
                }
            });
        }
    }
}

function generateContent(type: string, keywords: string[], niche: string): { title: string, content: string } {
    const keyword = randomFrom(keywords);

    if (type === "INTRODUCTIONS") {
        return {
            title: `Hello from ${randomFrom(["Texas", "California", "London", "Toronto", "Florida"])}!`,
            content: `Hi everyone! I'm so excited to join this ${niche} community. I've been interested in ${keyword} for a while and ready to dive deeper.`
        };
    }

    if (type === "WINS") {
        return {
            title: `Big win with ${keyword}!`,
            content: `Finally saw a breakthrough with a client regarding ${keyword}. It took a few weeks, but sticking to the protocol worked!`
        };
    }

    if (type === "QUESTIONS") {
        return {
            title: `Question about ${keyword}`,
            content: `I'm struggling to explain ${keyword} to a skeptical client. How do you usually approach this topic?`
        };
    }

    if (type === "TIPS") {
        return {
            title: `My favorite resource for ${keyword}`,
            content: `Just wanted to share a book/podcast I found about ${keyword}. It really helped clarify things for me!`
        };
    }

    return { title: "Hello", content: "Just saying hi!" };
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
