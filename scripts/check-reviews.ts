import prisma from "../src/lib/prisma";

async function main() {
  const reviews = await prisma.courseReview.findMany({
    include: { course: { select: { title: true, slug: true } } },
    take: 10
  });
  console.log('Reviews found:', reviews.length);
  reviews.forEach(r => console.log(`  ${r.course.title} - ${r.rating} stars`));

  // Check for the specific course
  const fmCourse = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    select: { id: true, title: true }
  });
  console.log('\nFM Course:', fmCourse?.title);

  if (fmCourse) {
    const fmReviews = await prisma.courseReview.findMany({
      where: { courseId: fmCourse.id, isPublic: true },
      take: 5
    });
    console.log('Reviews for FM course:', fmReviews.length);
  }

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, certificateType: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });
  console.log('\nCourses (by createdAt):');
  courses.forEach((c, i) => console.log(`  ${i+1}. ${c.certificateType} - ${c.title}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
