import prisma from "../src/lib/prisma";

async function main() {
  console.log("Checking existing certificates...\n");

  const certificates = await prisma.certificate.findMany({
    include: {
      course: { select: { title: true, slug: true } },
      module: { select: { title: true, order: true } },
      user: { select: { firstName: true, lastName: true, email: true } }
    },
    orderBy: { issuedAt: "desc" },
    take: 20
  });

  console.log(`Found ${certificates.length} certificates:\n`);

  certificates.forEach((cert, i) => {
    console.log(`${i + 1}. ${cert.type} - ${cert.certificateNumber}`);
    console.log(`   User: ${cert.user.firstName} ${cert.user.lastName} (${cert.user.email})`);
    console.log(`   Course: ${cert.course.title}`);
    console.log(`   Module: ${cert.module?.title || 'N/A (Course Certificate)'}`);
    console.log(`   Score: ${cert.score}%`);
    console.log(`   Issued: ${cert.issuedAt}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
