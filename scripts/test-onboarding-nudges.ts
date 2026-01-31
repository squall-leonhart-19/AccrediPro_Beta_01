// Quick script to send test onboarding nudge emails
import { sendEmail, personalEmailWrapper } from "@/lib/email";

const testEmail = "at.seed019@gmail.com";

const NUDGE_TEMPLATES = [
    {
        subject: "[TEST NUDGE 1] Quick thing, Test User...",
        content: `Hey Test User,

I noticed you haven't finished setting up your profile yet.

Adding a photo and a short bio helps me understand your goals better – and makes our community feel more connected.

Takes 30 seconds: <a href="https://learn.accredipro.academy/settings" style="color: #8B1538; font-weight: bold;">Complete Your Profile →</a>

– Sarah

P.S. I love seeing who I'm working with! 📸`,
    },
    {
        subject: "[TEST NUDGE 2] I'm right here if you need me",
        content: `Hey Test User,

Just wanted to remind you – you can message me anytime.

Whether you have questions about the curriculum, need help with a concept, or just want to chat about your goals... I'm here.

<a href="https://learn.accredipro.academy/messages" style="color: #8B1538; font-weight: bold;">Send Me a Message →</a>

Talk soon,
Sarah

P.S. No question is too small! 💬`,
    },
    {
        subject: "[TEST NUDGE 3] Your first lesson takes 5 mins",
        content: `Hey Test User,

I've been checking in and noticed you haven't started your first lesson yet.

I get it – life is busy. But here's the thing: your first lesson literally takes 5 minutes and sets the foundation for everything.

Ready to start? <a href="https://learn.accredipro.academy/courses" style="color: #8B1538; font-weight: bold;">Start Your First Lesson →</a>

Rooting for you,
Sarah

P.S. You've got this! 🌟`,
    },
    {
        subject: "[TEST NUDGE 4] The community is waiting for you",
        content: `Hey Test User,

Quick one – have you introduced yourself in the community yet?

It's a simple post and a great way to connect with others on the same path. Plus, the accountability and support are game-changers.

<a href="https://learn.accredipro.academy/community" style="color: #8B1538; font-weight: bold;">Introduce Yourself →</a>

See you in there?
Sarah

P.S. Everyone's super welcoming. No pressure, just support! 🤝`,
    },
];

async function sendTestNudges() {
    console.log(`Sending ${NUDGE_TEMPLATES.length} test nudge emails to ${testEmail}...`);

    for (let i = 0; i < NUDGE_TEMPLATES.length; i++) {
        const { subject, content } = NUDGE_TEMPLATES[i];
        console.log(`\n[${i + 1}/${NUDGE_TEMPLATES.length}] Sending: ${subject}`);

        try {
            const result = await sendEmail({
                to: testEmail,
                subject,
                html: personalEmailWrapper(content.replace(/\n/g, "<br>")),
                type: "transactional",
            });

            if (result.success) {
                console.log(`  ✅ Sent successfully!`);
            } else {
                console.log(`  ❌ Failed: ${result.error}`);
            }
        } catch (error: any) {
            console.log(`  ❌ Error: ${error.message}`);
        }

        // Small delay between emails
        await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("\n✅ All test nudges sent!");
}

sendTestNudges();
