import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const FAILED_USERS = [
    { email: "sharonlknight@outlook.com", firstName: "Sharon", lastName: "Knight" },
    { email: "smk52588@gmail.com", firstName: "Student", lastName: "" },
    { email: "theresakinney549@gmail.com", firstName: "Theresa", lastName: "Kinney" },
    { email: "kimboggess@mac.com", firstName: "Kim", lastName: "Boggess" },
    { email: "withinyogaandwellness@gmail.com", firstName: "Ryann", lastName: "Donahoe" },
];

const FM_PRO_PACK_TAGS = [
    "functional_medicine_complete_certification_purchased",
    "clickfunnels_purchase",
];

async function main() {
    const passwordHash = await bcrypt.hash("Futurecoach2025", 12);

    // Get FM Certification course
    const fmCourse = await prisma.course.findFirst({
        where: { slug: "functional-medicine-complete-certification" },
        select: { id: true, title: true },
    });

    if (!fmCourse) {
        console.error("❌ FM Certification course not found!");
        return;
    }

    console.log(`Found course: ${fmCourse.title} (${fmCourse.id})`);

    for (const userData of FAILED_USERS) {
        const email = userData.email.toLowerCase().trim();

        try {
            // Create or find user - ONLY use basic fields
            let user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        passwordHash,
                        role: "STUDENT",
                        isActive: true,
                        emailVerified: new Date(),
                        leadSource: "ClickFunnels",
                        leadSourceDetail: "FM Certification (Manual Recovery)",
                    },
                    select: { id: true, email: true }
                });
                console.log(`✅ Created user: ${email}`);
            } else {
                console.log(`⏭️ User exists: ${email}`);
            }

            // Enroll in FM Certification
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: { userId_courseId: { userId: user.id, courseId: fmCourse.id } },
            });

            if (!existingEnrollment) {
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: fmCourse.id,
                        status: "ACTIVE",
                        progress: 0,
                    },
                });
                console.log(`  📚 Enrolled in FM Certification`);
            } else {
                console.log(`  📚 Already enrolled`);
            }

            // Add tags
            for (const tag of FM_PRO_PACK_TAGS) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag } },
                    update: {},
                    create: { userId: user.id, tag },
                });
            }
            console.log(`  🏷️ Tags added`);

        } catch (error) {
            console.error(`❌ Error for ${email}:`, error);
        }
    }

    console.log("\n✅ Done!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
