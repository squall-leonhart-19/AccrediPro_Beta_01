import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function resetPassword() {
  const email = "tortolialessio1997@gmail.com";
  const newPassword = "MiniDiploma2024!";
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`Password reset for ${user.email}`);
  console.log(`New password: ${newPassword}`);
}

resetPassword().then(() => process.exit(0)).catch(console.error);
