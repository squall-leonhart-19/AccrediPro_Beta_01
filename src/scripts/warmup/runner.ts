import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// CONFIGURATION
// ==========================================

const TARGET_EMAILS = [
    "alessio.tortoli@digitalseeduae.com",
    "tortolialessio1997@gmail.com",
    "at.seed019@gmail.com",
    "alessiotortoli@gmail.com",
    "alessio.tortoli19@gmail.com"
];

// Burst timing
const STEP_DELAY_MS = 2000; // 2 seconds between emails in the sequence
const LOOP_DELAY_MS = 10 * 60 * 1000; // 10 minutes wait after finishing the sequence

// The 17-Step Sequence
const SEQUENCE = [
    { subject: "Re: your free Mini Diploma access", body: "Hi, seeing if you got in okay? Let me know." },
    { subject: "Re: my story (thought you'd relate)", body: "Just wanted to share a bit about how I started. It wasn't easy..." },
    { subject: "Re: why the usual advice doesn't work", body: "Most people focus on symptoms, but the root cause is different." },
    { subject: "Re: the training I mentioned", body: "Here is that info on the training we discussed." },
    { subject: "Re: Diane's story (burned-out nurse)", body: "Diane was exactly where you are. Here is what she did." },
    { subject: "Re: your complete roadmap", body: "Mapping out the next 6 months looks like this..." },
    { subject: "Re: getting clients (the real answer)", body: "Finding clients isn't about ads, strictly. It's about trust." },
    { subject: "Re: Vicki's transformation", body: "Another quick win to share with you." },
    { subject: "Re: about our accreditation", body: "Yes, we are fully accredited by the major boards." },
    { subject: "Re: about the time commitment", body: "You can do this in about 5-7 hours a week." },
    { subject: "Re: the investment question", body: "Let's break down the ROI on this career path." },
    { subject: "Re: Maria's journey (single mom)", body: "Maria did this while raising two kids. Truly inspiring." },
    { subject: "Re: thinking about your decision", body: "Any other questions holding you back?" },
    { subject: "Re: your questions (answered)", body: "Compiling the top questions I get here." },
    { subject: "Re: enrollment closing Friday", body: "Just a heads up, we are closing the cohort soon." },
    { subject: "Re: 48 hours left", body: "Two days left to join us." },
    { subject: "Re: final call", body: "This is it. Hope to see you inside." }
];

const SENDER_EMAIL = process.env.FROM_EMAIL || "AccrediPro Academy <info@accredipro-certificate.com>";

// ==========================================
// SCRIPT LOGIC
// ==========================================

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("🔥 STARTING BURST WARMUP SCRIPT");
    console.log(`📧 Targets: ${TARGET_EMAILS.length} emails`);
    console.log(`� Sequence: ${SEQUENCE.length} steps`);
    console.log(`⚡ Speed: 1 email every ${STEP_DELAY_MS / 1000}s`);
    console.log(`💤 Cooldown: ${LOOP_DELAY_MS / 1000 / 60} minutes between loops`);

    if (!process.env.RESEND_API_KEY) {
        console.error("❌ ERROR: RESEND_API_KEY not found in .env.local");
        process.exit(1);
    }

    let loopCount = 0;

    while (true) {
        loopCount++;
        console.log(`\n=== 🔁 LOOP #${loopCount} STARTED ===`);

        for (let i = 0; i < SEQUENCE.length; i++) {
            const step = SEQUENCE[i];
            // Rotate through target emails
            const targetEmail = TARGET_EMAILS[i % TARGET_EMAILS.length];

            console.log(`  [${i + 1}/${SEQUENCE.length}] Sending "${step.subject}" -> ${targetEmail}`);

            try {
                const { data, error } = await resend.emails.send({
                    from: SENDER_EMAIL,
                    to: targetEmail,
                    subject: step.subject,
                    html: `<p>${step.body}</p><br><p>--<br>AccrediPro Team</p>`,
                    text: `${step.body}\n\n--\nAccrediPro Team`
                });

                if (error) console.error(`    ❌ Failed: ${error.message}`);
                // else console.log(`    ✅ Sent: ${data?.id}`);

            } catch (err) {
                console.error(`    ❌ Exception: ${err}`);
            }

            // Wait 2s
            await sleep(STEP_DELAY_MS);
        }

        console.log(`\n=== 💤 COOLING DOWN FOR 10 MINUTES ===`);
        await sleep(LOOP_DELAY_MS);
    }
}

main().catch(console.error);
