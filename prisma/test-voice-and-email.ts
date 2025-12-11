import { config } from "dotenv";
config({ path: ".env.local", override: true }); // Load .env.local with override

import prisma from "../src/lib/prisma";
import OpenAI from "openai";
import { Resend } from "resend";

async function main() {
    const targetEmail = "at.seed019@gmail.com";

    // Find Admin
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    if (!admin) {
        console.log("❌ No admin found!");
        return;
    }
    console.log(`👤 Found Admin: ${admin.email} (${admin.firstName})`);

    // Find target user
    const targetUser = await prisma.user.findUnique({
        where: { email: targetEmail },
    });

    if (!targetUser) {
        console.log(`❌ User ${targetEmail} not found`);
        return;
    }
    console.log(`👤 Found User: ${targetUser.email} (${targetUser.firstName})`);

    // === TEST 1: Generate Voice with OpenAI TTS ===
    console.log("\n🎙️ Testing OpenAI TTS...");
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.log("❌ OPENAI_API_KEY not set!");
    } else {
        try {
            const openai = new OpenAI({ apiKey });
            const voiceText = `Hey ${targetUser.firstName || "there"}! This is a test voice message from AccrediPro. Just checking that the voice generation is working correctly!`;

            const mp3Response = await openai.audio.speech.create({
                model: "tts-1",
                voice: "nova",
                input: voiceText,
                response_format: "mp3",
            });

            const buffer = Buffer.from(await mp3Response.arrayBuffer());
            const voiceUrl = `data:audio/mp3;base64,${buffer.toString("base64")}`;
            const wordCount = voiceText.split(/\s+/).length;
            const voiceDuration = Math.ceil((wordCount / 150) * 60);

            console.log(`✅ Voice generated! Duration: ${voiceDuration}s, Size: ${buffer.length} bytes`);

            // Send message from Admin
            await prisma.message.create({
                data: {
                    senderId: admin.id,
                    receiverId: targetUser.id,
                    content: `🎙️ ${voiceText}`,
                    messageType: "DIRECT",
                    attachmentUrl: voiceUrl,
                    attachmentType: "voice", // Changed from "ai_voice" to "voice" - UI expects "voice"
                    voiceDuration: voiceDuration,
                    isAiVoice: true,
                },
            });
            console.log(`✅ Voice DM sent from Admin to ${targetEmail}!`);
        } catch (error) {
            console.error("❌ TTS Error:", error);
        }
    }

    // === TEST 2: Send Email with Resend ===
    console.log("\n📧 Testing Resend email...");
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    if (!resendKey) {
        console.log("❌ RESEND_API_KEY not set!");
    } else if (!fromEmail) {
        console.log("❌ FROM_EMAIL not set!");
    } else {
        console.log(`   Using FROM: ${fromEmail}`);
        console.log(`   Sending TO: ${targetEmail}`);

        try {
            const resend = new Resend(resendKey);
            const result = await resend.emails.send({
                from: fromEmail,
                to: targetEmail,
                subject: "🧪 Test Email from Mini Diploma System",
                html: `
                    <h1>Test Email</h1>
                    <p>This is a test email to verify the email system is working.</p>
                    <p>If you receive this, email is configured correctly!</p>
                    <p>Time: ${new Date().toISOString()}</p>
                `,
            });
            console.log(`✅ Email sent! Result:`, result);
        } catch (error) {
            console.error("❌ Email Error:", error);
        }
    }

    console.log("\n🎉 Done! Check:");
    console.log("   - Private Mentor Chat for voice DM from Admin");
    console.log("   - Email inbox for test email");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
