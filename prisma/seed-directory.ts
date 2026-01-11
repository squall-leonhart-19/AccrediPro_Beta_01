import { PrismaClient, CertificateType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Professional titles
const TITLES = [
    "Certified Functional Medicine Practitioner",
    "Board-Certified Holistic Health Coach",
    "Integrative Nutrition Specialist",
    "Clinical Wellness Consultant",
    "Certified Hormone Health Expert",
    "Functional Gut Health Specialist",
    "Registered Functional Nutritionist",
    "Mind-Body Wellness Practitioner",
    "Certified Integrative Health Coach",
    "Licensed Naturopathic Consultant",
    "Functional Medicine Health Coach",
    "Women's Health Specialist"
];

// Expanded specialties
const SPECIALTIES = [
    "Hormone Health", "Gut Health", "Autoimmune Support", "Weight Management",
    "Mental Wellness", "Fertility Support", "Postpartum Care", "Holistic Nutrition",
    "Functional Medicine", "Stress Management", "Sleep Optimization",
    "Thyroid Health", "Adrenal Fatigue", "Digestive Disorders", "Women's Health",
    "Anti-Aging", "Brain Health", "Blood Sugar Balance", "Chronic Fatigue",
    "Food Sensitivities", "Detox Support", "Inflammation", "PCOS", "Menopause",
    "Energy Optimization", "Immune Health", "Candida", "Leaky Gut"
];

// Career backgrounds for rich bios
const BACKGROUNDS = [
    "former registered nurse with 15+ years in hospital care",
    "corporate wellness consultant turned holistic practitioner",
    "physical therapist who expanded into functional medicine",
    "yoga instructor and certified nutrition specialist",
    "former executive who overcame chronic illness through functional medicine",
    "licensed dietitian with a focus on root-cause healing",
    "chiropractor who integrated functional medicine into practice",
    "mental health counselor specializing in mind-body connection",
    "former personal trainer now focused on metabolic health",
    "health coach certified in multiple therapeutic modalities",
    "former elementary school teacher passionate about women's health",
    "pharmacist who discovered the limitations of conventional medicine",
    "acupuncturist with additional training in functional nutrition"
];

const ACHIEVEMENTS = [
    "helped over 500 clients transform their health",
    "served more than 300 clients on their wellness journey",
    "guided 200+ women through hormone rebalancing",
    "worked with 400+ clients to restore gut health",
    "featured in Well+Good and MindBodyGreen",
    "developed proprietary hormone balancing protocols",
    "trained practitioners across 12 states",
    "pioneer in telehealth functional medicine",
    "created meal plans used by thousands",
    "authored multiple wellness guides",
    "speaker at national wellness conferences"
];

const APPROACHES = [
    "comprehensive lab testing combined with personalized protocols",
    "a unique blend of Eastern and Western healing traditions",
    "data-driven strategies with intuitive healing practices",
    "root-cause analysis paired with lifestyle optimization",
    "whole-person healing addressing mind, body, and spirit",
    "evidence-based protocols with compassionate support",
    "functional testing with sustainable lifestyle changes",
    "personalized nutrition and targeted supplementation"
];

const PASSIONS = [
    "helping busy professionals reclaim their vitality",
    "supporting women through hormonal transitions",
    "guiding clients from chronic illness to vibrant health",
    "teaching sustainable wellness habits for life",
    "empowering clients to become their own health advocates",
    "bridging the gap between conventional and alternative medicine",
    "helping moms regain their energy and joy"
];

function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateRichBio(firstName: string, specialties: string[], title: string): string {
    const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const achievement = ACHIEVEMENTS[Math.floor(Math.random() * ACHIEVEMENTS.length)];
    const approach = APPROACHES[Math.floor(Math.random() * APPROACHES.length)];
    const passion = PASSIONS[Math.floor(Math.random() * PASSIONS.length)];
    const yearsExp = Math.floor(Math.random() * 12) + 3;

    const mainSpec = specialties[0] || "holistic health";
    const secondSpec = specialties[1] || "wellness";

    const templates = [
        `As a ${background}, I've spent the past ${yearsExp} years ${passion}. My journey into ${mainSpec} began when I witnessed the limitations of conventional approaches. Today, I use ${approach} to help clients achieve lasting results. I've ${achievement}, and I'm passionate about making functional medicine accessible to everyone. When not working with clients, you'll find me hiking, cooking healing recipes, or enjoying time with my family.`,

        `With ${yearsExp} years of experience as a ${title}, I specialize in ${mainSpec} and ${secondSpec}. My practice is built on the belief that true healing requires ${approach}. I've ${achievement}, and my mission is ${passion}. Every client receives a personalized protocol designed for their unique biochemistry and lifestyle. I believe in treating the whole person, not just symptoms.`,

        `I'm a ${title} with a focus on ${mainSpec}. After my own health transformation, I dedicated my career to ${passion}. My approach combines ${approach}, helping clients finally get answers when traditional medicine has fallen short. Over ${yearsExp} years, I've ${achievement}. I offer both virtual and in-person consultations, and I love connecting with clients ready to take charge of their health journey.`,

        `Combining my background as a ${background} with advanced training in functional medicine, I help clients struggling with ${mainSpec} and ${secondSpec}. I believe ${approach} leads to the most sustainable results. Having ${achievement}, I'm committed to ${passion}. My ${yearsExp}-year practice is built on compassion, science, and a deep respect for the body's ability to heal.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

async function main() {
    console.log("🔄 Updating existing fake profiles to be directory-ready...\n");

    // First, delete only the directory-specific zombie profiles (the ones we created)
    // These have emails ending in @accredipro.fake or @accredipro.test
    const deleted = await prisma.user.deleteMany({
        where: {
            OR: [
                { email: { endsWith: "@accredipro.fake" } },
                { email: { endsWith: "@accredipro.test" } }
            ]
        }
    });
    console.log(`❌ Deleted ${deleted.count} directory-only zombie profiles.\n`);

    // Get existing community fake profiles (the ones with real avatars from CSV)
    const fakeProfiles = await prisma.user.findMany({
        where: {
            isFakeProfile: true,
            email: null // Community profiles have null email
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            location: true
        }
    });

    console.log(`📋 Found ${fakeProfiles.length} community fake profiles to update.\n`);

    if (fakeProfiles.length === 0) {
        console.log("⚠️ No community fake profiles found. Run seed-fake-profiles.ts first.");
        return;
    }

    // Get or create FM course
    let course = await prisma.course.findFirst({ where: { title: { contains: "Functional Medicine" } } });
    if (!course) {
        course = await prisma.course.create({
            data: {
                title: "Certified Functional Medicine Practitioner",
                slug: "certified-functional-medicine-practitioner",
                description: "Master functional medicine protocols.",
                price: 997,
                isPublished: true,
            }
        });
    }

    // Update 50 profiles to be directory-visible
    const profilesToUpdate = fakeProfiles.slice(0, 50);

    for (let i = 0; i < profilesToUpdate.length; i++) {
        const profile = profilesToUpdate[i];
        const firstName = profile.firstName || "Professional";
        const lastName = profile.lastName || "Member";

        // Generate unique slug
        const slugBase = `${firstName}-${lastName}`.toLowerCase().replace(/\s/g, '-');
        const slug = `${slugBase}-${Math.floor(Math.random() * 1000)}`;

        // Random 2-4 specialties
        const specs = getRandomItems(SPECIALTIES, Math.floor(Math.random() * 3) + 2);
        const title = TITLES[Math.floor(Math.random() * TITLES.length)];

        // Generate rich bio
        const bio = generateRichBio(firstName, specs, title);

        // 70% accepting clients
        const acceptingClients = Math.random() > 0.3;

        // Random creation date 6 months to 2 years ago
        const daysAgo = Math.floor(Math.random() * 540) + 180;
        const memberSince = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        // Update the profile
        await prisma.user.update({
            where: { id: profile.id },
            data: {
                slug,
                professionalTitle: title,
                specialties: specs,
                bio,
                acceptingClients,
                isPublicDirectory: true,
                createdAt: memberSince,
            }
        });

        // Check if enrollment exists
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: { userId: profile.id, courseId: course.id }
        });

        if (!existingEnrollment) {
            // Create enrollment
            await prisma.enrollment.create({
                data: {
                    userId: profile.id,
                    courseId: course.id,
                    status: "COMPLETED",
                    progress: 100,
                    enrolledAt: new Date(memberSince.getTime() - 30 * 24 * 60 * 60 * 1000),
                    completedAt: memberSince,
                }
            });
        }

        // Check if certificate exists
        const existingCert = await prisma.certificate.findFirst({
            where: { userId: profile.id, courseId: course.id }
        });

        if (!existingCert) {
            const certNum = `AP-${memberSince.getFullYear().toString().slice(-2)}${(memberSince.getMonth() + 1).toString().padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await prisma.certificate.create({
                data: {
                    certificateNumber: certNum,
                    userId: profile.id,
                    courseId: course.id,
                    type: CertificateType.CERTIFICATION,
                    issuedAt: memberSince,
                }
            });
        }

        console.log(`✓ ${firstName} ${lastName} - ${title.substring(0, 30)}...`);
    }

    console.log(`\n✅ Updated ${profilesToUpdate.length} profiles for the professionals directory!\n`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
