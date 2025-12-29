
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = "blablarog1234@gmail.com";
    console.log(`Processing enrollment for: ${email}`);

    // 1. Upsert User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            firstName: "Blabla",
            lastName: "Rog",
            passwordHash: "placeholder", // Won't be able to login with password unless set properly, but fine for test
            role: "STUDENT",
        }
    });
    console.log(`User ID: ${user.id}`);

    // 2. Add Tags
    const tags = [
        "fm_pro_practice_path_purchased",
        "fm_pro_master_depth_purchased",
        "fm_pro_advanced_clinical_purchased",
        "clickfunnels_purchase",
        "functional_medicine_complete_certification_purchased"
    ];

    for (const tag of tags) {
        await prisma.userTag.upsert({
            where: { userId_tag: { userId: user.id, tag } },
            update: {},
            create: { userId: user.id, tag }
        });
        console.log(`Added Tag: ${tag}`);
    }

    // 3. Encode Course Slugs to Enroll
    // Based on tags
    const targetSlugs = [
        "functional-medicine-complete-certification", // Main
        "fm-pro-advanced-clinical", // L2
        "fm-pro-master-depth",      // L3
        "fm-pro-practice-path"      // L4
    ];

    console.log("Enrolling in courses...");

    for (const slug of targetSlugs) {
        const course = await prisma.course.findFirst({
            where: { slug }
        });

        if (!course) {
            console.error(`❌ Course NOT FOUND: ${slug}`);
            // Try fuzzy?
            const fuzzy = await prisma.course.findFirst({
                where: { slug: { contains: slug.replace('fm-', ''), mode: 'insensitive' } }
            });
            if (fuzzy) {
                console.log(`   Found fuzzy match: ${fuzzy.slug}`);
                await enroll(user.id, fuzzy.id, fuzzy.title);
            }
            continue;
        }

        await enroll(user.id, course.id, course.title);
    }
}

async function enroll(userId: string, courseId: string, title: string) {
    const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: {
            userId,
            courseId,
            status: "ACTIVE",
            progress: 0
        }
    });
    console.log(`✅ Enrolled in: ${title}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
