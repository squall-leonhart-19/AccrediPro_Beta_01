import prisma from "../src/lib/prisma";

async function createTestCourse() {
    try {
        // Get first user to be the instructor
        const user = await prisma.user.findFirst({
            select: { id: true, email: true }
        });

        if (!user) {
            console.log("No user found!");
            return;
        }

        console.log("Creating test course for certificate testing...\n");

        // Create test course
        const course = await prisma.course.create({
            data: {
                title: "Certificate Test Course",
                slug: "certificate-test-course",
                description: "A simple 1-lesson course to test certificate generation",
                shortDescription: "Test course for certificates",
                price: 0,
                isPublished: true,
                isFree: true,
                certificateType: "CERTIFICATION",
                difficulty: "BEGINNER",
                instructorId: user.id,
            },
        });

        // Create module
        const module = await prisma.module.create({
            data: {
                title: "Test Module",
                description: "The only module in this course",
                order: 1,
                isPublished: true,
                courseId: course.id,
            },
        });

        // Create lesson (without duration field)
        const lesson = await prisma.lesson.create({
            data: {
                title: "Complete This Lesson",
                description: "Complete this lesson to earn your certificate!",
                content: "Congratulations on completing this test lesson! Your certificate will be generated automatically.",
                order: 1,
                isPublished: true,
                type: "TEXT",
                moduleId: module.id,
            },
        });

        console.log("✅ Test Course Created!");
        console.log("   Title:", course.title);
        console.log("   Course ID:", course.id);
        console.log("   Module:", module.title);
        console.log("   Lesson:", lesson.title);
        console.log("\n📋 To Test:");
        console.log("   1. Go to /courses");
        console.log("   2. Enroll in 'Certificate Test Course'");
        console.log("   3. Complete the lesson");
        console.log("   4. Check /certificates for your new certificate!");
        console.log("   5. Check your email for congratulations message");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestCourse();
