import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MINI_DIPLOMA_DIR = path.join(process.cwd(), "Mini_Diploma");

// Function to strip MODULE COMPLETE and Continue sections from HTML
function cleanupHtmlContent(html: string): string {
  // Remove MODULE COMPLETE section
  let cleaned = html.replace(
    /<!-- Module Complete -->[\s\S]*?<\/div>\s*\n/gi,
    ''
  );

  // Remove the "Continue to Module X" CTA
  cleaned = cleaned.replace(
    /<!-- Next Module CTA -->[\s\S]*?<\/div>\s*\n/gi,
    ''
  );

  // Remove the final closing paragraph about modules complete
  cleaned = cleaned.replace(
    /<p style="text-align: center; color: #666; font-style: italic;">.*?(?:complete|done|down).*?<\/p>\s*/gi,
    ''
  );

  // Remove the congratulations section for module 3
  cleaned = cleaned.replace(
    /<!-- Congratulations -->[\s\S]*?<\/div>\s*\n/gi,
    ''
  );

  // Remove the final exam CTA
  cleaned = cleaned.replace(
    /<!-- Final Exam CTA -->[\s\S]*?<\/div>\s*\n/gi,
    ''
  );

  return cleaned;
}

async function main() {
  console.log("Updating Mini Diploma content...");

  // First, ensure Sarah coach exists
  let sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
  });

  if (!sarah) {
    console.log("Creating Sarah coach account...");
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("SarahCoach2024!", 12);

    sarah = await prisma.user.create({
      data: {
        email: "sarah@accredipro-certificate.com",
        firstName: "Sarah",
        lastName: "M.",
        role: "MENTOR",
        password: hashedPassword,
        isActive: true,
        emailVerified: new Date(),
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Your dedicated Functional Medicine Coach. I transformed my own health journey into a mission to help others. After 12 years as an ICU nurse, burnout led me to discover Functional Medicine - and it saved my life. Now I'm here to guide you every step of the way!",
      },
    });
    console.log(`Created Sarah: ${sarah.firstName} ${sarah.lastName}`);
  } else {
    // Update Sarah's lastName to "M."
    sarah = await prisma.user.update({
      where: { id: sarah.id },
      data: {
        lastName: "M.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    });
    console.log(`Updated Sarah to: ${sarah.firstName} ${sarah.lastName}`);
  }

  // Find the mini diploma course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-mini-diploma" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: true },
      },
    },
  });

  if (!course) {
    console.error("Mini diploma course not found!");
    return;
  }

  console.log(`Found course: ${course.title}`);

  // Update course coach to Sarah
  await prisma.course.update({
    where: { id: course.id },
    data: { coachId: sarah.id },
  });
  console.log(`Set course coach to: ${sarah.firstName} ${sarah.lastName}`);

  // Update each module's lesson content
  const htmlFiles: Record<number, string> = {
    0: "Module_0_Welcome.html",
    1: "Module_1_Root_Cause_Framework.html",
    2: "Module_2_Case_Study_Michelle.html",
    3: "Module_3_Your_Path_Forward.html",
  };

  for (const module of course.modules) {
    const htmlFile = htmlFiles[module.order];
    if (!htmlFile) continue;

    const filePath = path.join(MINI_DIPLOMA_DIR, htmlFile);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${htmlFile} - file not found`);
      continue;
    }

    let htmlContent = fs.readFileSync(filePath, "utf-8");

    // Clean up the HTML content
    htmlContent = cleanupHtmlContent(htmlContent);

    // Update all lessons in this module
    for (const lesson of module.lessons) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { content: htmlContent },
      });
      console.log(`Updated lesson: ${lesson.title}`);
    }
  }

  console.log("\nMini Diploma content update complete!");
  console.log(`- Coach: ${sarah.firstName} ${sarah.lastName}`);
  console.log("- Removed MODULE COMPLETE sections");
  console.log("- Removed Continue to Next Module CTAs");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
