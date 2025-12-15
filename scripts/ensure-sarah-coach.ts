import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function ensureSarahCoach() {
  console.log("Checking for Sarah coach account...");

  // Check if Sarah exists
  let sarah = await prisma.user.findFirst({
    where: {
      email: "sarah@accredipro-certificate.com",
    },
  });

  if (sarah) {
    console.log("✅ Sarah coach account exists:");
    console.log(`   ID: ${sarah.id}`);
    console.log(`   Email: ${sarah.email}`);
    console.log(`   Name: ${sarah.firstName} ${sarah.lastName}`);
    console.log(`   Role: ${sarah.role}`);
    return sarah;
  }

  console.log("Creating Sarah coach account...");

  // Create Sarah
  const hashedPassword = await bcrypt.hash("SarahCoach2024!", 12);

  sarah = await prisma.user.create({
    data: {
      email: "sarah@accredipro-certificate.com",
      firstName: "Sarah",
      lastName: "Mitchell",
      role: "MENTOR",
      password: hashedPassword,
      isActive: true,
      emailVerified: new Date(),
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Your dedicated Functional Medicine Coach. I'm here to support you every step of the way on your certification journey!",
    },
  });

  console.log("✅ Created Sarah coach account:");
  console.log(`   ID: ${sarah.id}`);
  console.log(`   Email: ${sarah.email}`);

  return sarah;
}

ensureSarahCoach()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
