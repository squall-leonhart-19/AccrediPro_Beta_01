import { PrismaClient, CertificateType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TITLES = [
    "Certified Functional Medicine Practitioner",
    "Board-Certified Holistic Health Coach",
    "Integrative Nutrition Specialist",
    "Clinical Wellness Consultant",
    "Certified Hormone Health Expert",
    "Functional Gut Health Specialist",
    "Women's Health Specialist",
    "Mind-Body Wellness Practitioner",
    "Functional Medicine Health Coach",
    "Licensed Naturopathic Consultant"
];

const SPECIALTIES = [
    "Hormone Health", "Gut Health", "Autoimmune Support", "Weight Management",
    "Mental Wellness", "Fertility Support", "Holistic Nutrition", "Functional Medicine",
    "Stress Management", "Sleep Optimization", "Thyroid Health", "Adrenal Fatigue",
    "Digestive Disorders", "Women's Health", "Brain Health", "Blood Sugar Balance",
    "Chronic Fatigue", "Energy Optimization", "Inflammation", "Menopause",
    "PCOS Support", "Detox Protocols", "Immune Health"
];

const BACKGROUNDS = [
    "former registered nurse with 15+ years in hospital care",
    "corporate wellness consultant turned holistic practitioner",
    "physical therapist who expanded into functional medicine",
    "certified yoga instructor and nutrition specialist",
    "licensed dietitian with a root-cause healing focus",
    "mental health counselor specializing in mind-body connection",
    "health coach certified in multiple therapeutic modalities",
    "former personal trainer now focused on metabolic health",
    "pharmacist who discovered natural healing approaches"
];

const ACHIEVEMENTS = [
    "helped over 500 clients transform their health",
    "served more than 300 clients on their wellness journey",
    "guided 200+ women through hormone rebalancing",
    "worked with 400+ clients to restore gut health",
    "trained practitioners across multiple states",
    "created personalized protocols that changed lives"
];

function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateBio(firstName: string, specialties: string[], title: string): string {
    const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const achievement = ACHIEVEMENTS[Math.floor(Math.random() * ACHIEVEMENTS.length)];
    const yearsExp = Math.floor(Math.random() * 10) + 3;
    const mainSpec = specialties[0] || "holistic health";
    const secondSpec = specialties[1] || "wellness";

    const templates = [
        `As a ${background}, I've spent the past ${yearsExp} years helping clients achieve optimal health. My focus on ${mainSpec} began when I witnessed the limitations of conventional approaches. I've ${achievement}, and I'm passionate about making functional medicine accessible to everyone. I use evidence-based protocols with a whole-person approach.`,

        `With ${yearsExp} years of experience as a ${title}, I specialize in ${mainSpec} and ${secondSpec}. My practice is built on the belief that true healing requires treating the whole person. I've ${achievement}. Every client receives a personalized protocol designed for their unique biochemistry and lifestyle.`,

        `I'm a ${title} dedicated to helping clients struggling with ${mainSpec}. After my own health transformation, I committed to ${achievement}. My approach combines evidence-based science with compassionate support, helping clients finally get answers when traditional medicine has fallen short.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

async function main() {
    console.log("🔄 Updating EXISTING fake profiles for directory...\n");

    // Get existing fake profiles that have WP avatars
    const fakeProfiles = await prisma.user.findMany({
        where: {
            isFakeProfile: true,
            email: null,
            avatar: { not: null }
        },
        take: 50, // Update 50 for directory
        select: { id: true, firstName: true, lastName: true, avatar: true }
    });

    console.log(`Found ${fakeProfiles.length} profiles to update\n`);

    // Get FM course
    const course = await prisma.course.findFirst({
        where: { title: { contains: "Functional Medicine" } }
    });

    for (const profile of fakeProfiles) {
        const firstName = profile.firstName || "Professional";
        const lastName = profile.lastName || "Member";
        const slugBase = `${firstName}-${lastName}`.toLowerCase().replace(/\s/g, "-");
        const slug = `${slugBase}-${Math.floor(Math.random() * 1000)}`;

        const specs = getRandomItems(SPECIALTIES, Math.floor(Math.random() * 3) + 2);
        const title = TITLES[Math.floor(Math.random() * TITLES.length)];
        const bio = generateBio(firstName, specs, title);
        const acceptingClients = Math.random() > 0.3;

        // Update with professional info
        await prisma.user.update({
            where: { id: profile.id },
            data: {
                slug,
                professionalTitle: title,
                specialties: specs,
                bio,
                acceptingClients,
                isPublicDirectory: true
            }
        });

        // Create enrollment if course exists
        if (course) {
            const existing = await prisma.enrollment.findFirst({
                where: { userId: profile.id, courseId: course.id }
            });
            if (!existing) {
                await prisma.enrollment.create({
                    data: {
                        userId: profile.id,
                        courseId: course.id,
                        status: "COMPLETED",
                        progress: 100,
                        completedAt: new Date()
                    }
                });
            }

            const existingCert = await prisma.certificate.findFirst({
                where: { userId: profile.id, courseId: course.id }
            });
            if (!existingCert) {
                await prisma.certificate.create({
                    data: {
                        certificateNumber: `AP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                        userId: profile.id,
                        courseId: course.id,
                        type: CertificateType.CERTIFICATION,
                        issuedAt: new Date()
                    }
                });
            }
        }

        console.log(`✓ ${firstName} ${lastName} - ${title.substring(0, 35)}...`);
    }

    console.log(`\n✅ Updated ${fakeProfiles.length} EXISTING profiles for directory!`);
    console.log("These profiles keep their original WP avatar images.\n");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
