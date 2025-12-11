import { config } from "dotenv";
config({ path: ".env.local", override: true });

import prisma from "../src/lib/prisma";

async function main() {
    const targetEmail = "at.seed019@gmail.com";

    // Reset completion so we can test again
    const user = await prisma.user.update({
        where: { email: targetEmail },
        data: {
            miniDiplomaCompletedAt: null,
            graduateOfferDeadline: null,
            hasCertificateBadge: false,
        },
    });

    console.log("✅ Reset completion status for:", targetEmail);
    console.log("   Now go to /my-mini-diploma and click 'Test Complete'");
    console.log("   You should receive:");
    console.log("   - 🎙️ Voice DM from Sarah (with audio player!)");
    console.log("   - 🔔 2 notifications");
    console.log("   - 📧 Completion email");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
