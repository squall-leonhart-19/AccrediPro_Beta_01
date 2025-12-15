import prisma from "../src/lib/prisma";

async function updateCourses() {
  console.log("Updating courses...");

  // Delete the Test Course Beta 001
  const testCourse = await prisma.course.findFirst({
    where: {
      OR: [
        { title: { contains: "Test Course Beta" } },
        { slug: { contains: "test-course" } },
      ],
    },
  });

  if (testCourse) {
    console.log(`Deleting test course: ${testCourse.title}`);
    await prisma.course.delete({
      where: { id: testCourse.id },
    });
    console.log("Test course deleted!");
  } else {
    console.log("No test course found to delete.");
  }

  // Update the main certification course
  const mainCourse = await prisma.course.findFirst({
    where: {
      OR: [
        { title: { contains: "Functional Medicine" } },
        { slug: { contains: "functional-medicine" } },
      ],
    },
  });

  if (mainCourse) {
    console.log(`Updating course: ${mainCourse.title}`);
    await prisma.course.update({
      where: { id: mainCourse.id },
      data: {
        title: "Certified Functional Medicine Practitioner",
        shortDescription: "AccrediPro is the first professional practitioner pathway designed to issue one verified certificate for every completed specialization module — allowing you to build a multi-disciplinary functional medicine profile over time.",
        description: "Instead of a single, generic credential, you graduate with a portfolio of focused certifications that reflect your real expertise and professional growth. Each module builds your professional identity as a Functional Medicine Practitioner.",
      },
    });
    console.log("Course updated!");
  } else {
    console.log("Main course not found.");
  }

  // List all remaining courses
  const allCourses = await prisma.course.findMany({
    select: { id: true, title: true, slug: true },
  });
  console.log("\nAll courses:");
  allCourses.forEach((c) => console.log(`- ${c.title} (${c.slug})`));
}

updateCourses()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
