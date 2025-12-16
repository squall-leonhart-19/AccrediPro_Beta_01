import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Enrolling admin in mini diploma...");

  // Find admin user
  const admin = await prisma.user.findUnique({
    where: { email: "admin@accredipro-certificate.com" },
  });

  if (!admin) {
    console.error("Admin user not found!");
    return;
  }

  console.log(`Found admin: ${admin.firstName} ${admin.lastName} (${admin.id})`);

  // Find the mini diploma course
  const miniDiploma = await prisma.course.findFirst({
    where: {
      slug: "mini-diploma-freebie"
    },
  });

  if (!miniDiploma) {
    console.error("Mini diploma course not found! Trying functional-medicine-mini-diploma...");

    const miniDiploma2 = await prisma.course.findFirst({
      where: {
        slug: "functional-medicine-mini-diploma"
      },
    });

    if (!miniDiploma2) {
      console.error("Neither mini diploma course found!");

      // List available courses
      const courses = await prisma.course.findMany({
        select: { id: true, title: true, slug: true },
        take: 20
      });
      console.log("Available courses:", courses);
      return;
    }

    // Use functional-medicine-mini-diploma
    await enrollInCourse(admin.id, miniDiploma2.id, miniDiploma2.title);
    return;
  }

  await enrollInCourse(admin.id, miniDiploma.id, miniDiploma.title);
}

async function enrollInCourse(userId: string, courseId: string, courseTitle: string) {
  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (existingEnrollment) {
    console.log(`Admin already enrolled in ${courseTitle}`);

    // Update to completed if not already
    if (existingEnrollment.status !== "COMPLETED") {
      await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: "COMPLETED",
          progress: 100,
          completedAt: new Date()
        },
      });
      console.log("Updated enrollment to COMPLETED status");
    }
    return;
  }

  // Create enrollment with completed status
  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      status: "COMPLETED",
      progress: 100,
      completedAt: new Date(),
    },
  });

  console.log(`Successfully enrolled admin in ${courseTitle}!`);
  console.log(`Enrollment ID: ${enrollment.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
