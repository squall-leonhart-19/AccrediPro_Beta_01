/**
 * Mini Diploma Completion Emails
 * Psychological triggers for each lesson milestone
 */

import { sendWelcomeEmail } from "@/lib/email";

// Lesson titles for functional medicine (can be extended for other niches)
const LESSON_TEASERS: Record<string, string[]> = {
    "functional-medicine": [
        "", // L0 placeholder
        "The Gut Connection - How your gut controls everything", // L2 teaser
        "The Stress-Hormone Axis - The hidden link to fatigue", // L3 teaser  
        "Thyroid Mastery - What doctors miss", // L4 teaser
        "Inflammation Deep Dive - The root of chronic disease", // L5 teaser
        "Detox Pathways - Cellular cleansing protocols", // L6 teaser
        "Mitochondrial Health - The energy crisis", // L7 teaser
        "The 5R Protocol - Your signature framework", // L8 teaser
        "Income Blueprint - From practitioner to profit", // L9 teaser
        "Certificate unlocked! 🎓", // Final teaser
    ],
};

export interface CompletionEmailData {
    firstName: string;
    email: string;
    lessonNumber: number;
    totalLessons: number;
    niche: string;
    nicheLabel: string;
    timeInvested?: number; // minutes
}

/**
 * Get the appropriate email template based on lesson number
 */
export function getCompletionEmailTemplate(data: CompletionEmailData) {
    const { lessonNumber, totalLessons, firstName, niche, nicheLabel } = data;
    const progress = Math.round((lessonNumber / totalLessons) * 100);
    const nextTeaser = LESSON_TEASERS[niche]?.[lessonNumber + 1] || "More exciting content";

    // Milestone emails with psychological triggers
    if (lessonNumber === 1) {
        // First lesson - COMMITMENT trigger
        return {
            subject: `🎉 You're IN, ${firstName}! Your certification journey begins`,
            template: "completion-l1",
            data: {
                headline: "You Just Did What 90% of People Never Do",
                subheadline: "You took action. That's what separates dreamers from practitioners.",
                bodyHtml: `
                    <p>Hi ${firstName},</p>
                    <p><strong>Congratulations!</strong> You just completed your first lesson in the ${nicheLabel} Mini Diploma.</p>
                    <p>Here's something most people don't know:</p>
                    <p style="background: #FFF8E1; padding: 16px; border-radius: 8px; border-left: 4px solid #FFA000;">
                        <strong>Only 23% of people</strong> who sign up for online courses ever complete the first lesson. 
                        You're already in the elite group. 🏆
                    </p>
                    <p>Next up: <strong>"${nextTeaser}"</strong></p>
                    <p>I'm so proud of you for starting this journey.</p>
                    <p>Your future clients are already out there, waiting for someone with your exact knowledge to help them.</p>
                    <p>Keep going!</p>
                    <p>— Sarah<br/>Your Personal Health Coach Mentor</p>
                `,
                ctaText: "Continue to Lesson 2 →",
                ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${niche}/lesson/2`,
            },
        };
    }

    if (lessonNumber === 3) {
        // 33% complete - PROGRESS BIAS trigger
        return {
            subject: `🎯 ${progress}% Certified! You're crushing it, ${firstName}`,
            template: "completion-l3",
            data: {
                headline: "You're 1/3 of the Way to Your Certificate!",
                subheadline: "Most people quit before here. NOT you.",
                bodyHtml: `
                    <p>Hi ${firstName},</p>
                    <p><strong>WOW!</strong> You just hit a major milestone — ${progress}% complete!</p>
                    <div style="background: linear-gradient(90deg, #722F37 ${progress}%, #E0E0E0 ${progress}%); height: 20px; border-radius: 10px; margin: 20px 0;"></div>
                    <p style="background: #E8F5E9; padding: 16px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                        <strong>Fun fact:</strong> Studies show that people who reach 33% completion are 
                        <strong>4x more likely</strong> to finish. You're on track! 📈
                    </p>
                    <p>At this point, you already know more than:</p>
                    <ul>
                        <li>✓ 95% of general practitioners about root cause medicine</li>
                        <li>✓ Most "wellness coaches" charging $100+/hour</li>
                        <li>✓ The average health-conscious consumer</li>
                    </ul>
                    <p>Next up: <strong>"${nextTeaser}"</strong></p>
                    <p>Keep the momentum going!</p>
                    <p>— Sarah</p>
                `,
                ctaText: "Continue Your Journey →",
                ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${niche}/lesson/4`,
            },
        };
    }

    if (lessonNumber === 5) {
        // 50% complete - SUNK COST + IDENTITY trigger
        return {
            subject: `🏆 HALFWAY HERO! ${firstName}, you're officially committed`,
            template: "completion-l5",
            data: {
                headline: "You're HALFWAY to Your Certificate! 🎉",
                subheadline: "You've invested too much to stop now.",
                bodyHtml: `
                    <p>Hi ${firstName},</p>
                    <p><strong>This is HUGE!</strong></p>
                    <p>You're officially <strong>50% of the way</strong> to becoming a certified ${nicheLabel} Practitioner.</p>
                    <div style="background: linear-gradient(90deg, #722F37 50%, #E0E0E0 50%); height: 24px; border-radius: 12px; margin: 20px 0;"></div>
                    <p style="background: #FFF3E0; padding: 16px; border-radius: 8px; border-left: 4px solid #FF9800;">
                        <strong>You've already invested ${data.timeInvested || 45}+ minutes</strong> in your future practice. 
                        That's not just time — that's transformation.
                    </p>
                    <p><strong>Identity shift moment:</strong></p>
                    <p>You're no longer "thinking about" becoming a health practitioner. You ARE one in training.</p>
                    <p>Imagine next month: scheduling your first paid consultation, introducing yourself as a certified practitioner, finally doing work that matters...</p>
                    <p>That's ${totalLessons - lessonNumber} lessons away.</p>
                    <p>— Sarah</p>
                `,
                ctaText: "I'm Committed - Continue →",
                ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${niche}/lesson/6`,
            },
        };
    }

    if (lessonNumber === 7) {
        // 77% complete - LOSS AVERSION + URGENCY trigger
        return {
            subject: `⚡ ${firstName}, you're SO close... don't let it slip away`,
            template: "completion-l7",
            data: {
                headline: "Only 2 Lessons Left!",
                subheadline: "Your certificate is practically within reach.",
                bodyHtml: `
                    <p>Hi ${firstName},</p>
                    <p><strong>You're ${progress}% there.</strong></p>
                    <p>Just TWO more lessons stand between you and your ${nicheLabel} Mini Diploma certificate.</p>
                    <div style="background: linear-gradient(90deg, #722F37 ${progress}%, #E0E0E0 ${progress}%); height: 24px; border-radius: 12px; margin: 20px 0;"></div>
                    <p style="background: #FFEBEE; padding: 16px; border-radius: 8px; border-left: 4px solid #F44336;">
                        <strong>A word of caution:</strong> This is where some people stop. 
                        Life gets busy. They get distracted. They come back months later and have to start over.
                        <br/><br/>
                        <strong>Don't be that person.</strong>
                    </p>
                    <p>You've come too far. Invested too much. Learned too much.</p>
                    <p>Next up: <strong>"${nextTeaser}"</strong> — This one's a game-changer.</p>
                    <p>Finish what you started.</p>
                    <p>— Sarah</p>
                `,
                ctaText: "Finish Strong →",
                ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${niche}/lesson/8`,
            },
        };
    }

    if (lessonNumber === totalLessons) {
        // 100% complete - ACHIEVEMENT + CELEBRATION trigger
        return {
            subject: `🎓 CONGRATULATIONS ${firstName}! You're NOW a Certified ${nicheLabel} Practitioner`,
            template: "completion-final",
            data: {
                headline: "YOU DID IT! 🎉🎓🏆",
                subheadline: `You are now a certified ${nicheLabel} Practitioner`,
                bodyHtml: `
                    <p>Hi ${firstName},</p>
                    <p><strong>I am SO incredibly proud of you!</strong></p>
                    <p>You've just completed the entire ${nicheLabel} Mini Diploma.</p>
                    <div style="background: linear-gradient(135deg, #722F37 0%, #B8860B 100%); padding: 24px; border-radius: 12px; text-align: center; color: white; margin: 20px 0;">
                        <h2 style="margin: 0; font-size: 24px;">Certificate Unlocked!</h2>
                        <p style="margin: 8px 0 0 0;">Download your official certificate now</p>
                    </div>
                    <p>Here's what you can do NOW:</p>
                    <ul>
                        <li>✓ Download and frame your certificate</li>
                        <li>✓ Add "Certified ${nicheLabel} Practitioner" to your bio</li>
                        <li>✓ Share your achievement on social media</li>
                        <li>✓ Start booking discovery calls with potential clients</li>
                    </ul>
                    <p style="background: #E8F5E9; padding: 16px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                        <strong>Did you know?</strong> Our certified practitioners report an average of 
                        <strong>$3,000-$8,000/month</strong> in additional income within their first 90 days of practice.
                    </p>
                    <p><strong>Ready to go deeper?</strong> Your Mini Diploma is just the beginning. 
                    Our full certification program covers advanced protocols, business building, and ongoing mentorship.</p>
                    <p>Congratulations again, ${firstName}. You earned this.</p>
                    <p>— Sarah<br/>Your Proud Mentor</p>
                `,
                ctaText: "Download My Certificate 🎓",
                ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${niche}/certificate`,
            },
        };
    }

    // Default for other lessons (2, 4, 6, 8) - lighter touch
    return {
        subject: `✅ Lesson ${lessonNumber} Complete! Keep going, ${firstName}`,
        template: "completion-default",
        data: {
            headline: `Lesson ${lessonNumber} Complete!`,
            subheadline: `${totalLessons - lessonNumber} lessons to go`,
            bodyHtml: `
                <p>Hi ${firstName},</p>
                <p>Great work completing Lesson ${lessonNumber}!</p>
                <p>You're <strong>${progress}%</strong> of the way to your certificate.</p>
                <p>Next up: <strong>"${nextTeaser}"</strong></p>
                <p>Keep up the momentum!</p>
                <p>— Sarah</p>
            `,
            ctaText: "Continue →",
            ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${niche}/lesson/${lessonNumber + 1}`,
        },
    };
}

/**
 * Send completion email for a lesson
 */
export async function sendCompletionEmail(data: CompletionEmailData) {
    const template = getCompletionEmailTemplate(data);

    // Use existing email infrastructure
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: data.email,
                subject: template.subject,
                template: template.template,
                data: template.data,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error("Failed to send completion email:", error);
        return false;
    }
}
