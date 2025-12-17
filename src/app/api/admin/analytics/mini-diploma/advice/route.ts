import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface FunnelData {
    signups: number;
    started: number;
    completed: number;
    watchedTraining: number;
    enrolled: number;
    avgTimeToComplete: number;
    avgScore: number;
    dropoffPoints: { module: string; dropRate: number }[];
}

/**
 * POST /api/admin/analytics/mini-diploma/advice
 * Generate AI optimization advice based on funnel data
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data: FunnelData = await request.json();

        // Calculate rates
        const startRate = data.signups > 0 ? (data.started / data.signups) * 100 : 0;
        const completionRate = data.started > 0 ? (data.completed / data.started) * 100 : 0;
        const trainingRate = data.completed > 0 ? (data.watchedTraining / data.completed) * 100 : 0;
        const enrollRate = data.watchedTraining > 0 ? (data.enrolled / data.watchedTraining) * 100 : 0;

        const insights: string[] = [];
        const recommendations: string[] = [];
        let priority: "high" | "medium" | "low" = "low";

        // Start Rate Analysis
        if (startRate < 40) {
            priority = "high";
            insights.push(`Critical: Only ${startRate.toFixed(0)}% of signups start the course. This is below the 60% benchmark.`);
            recommendations.push("Send a more compelling welcome email with clear next steps within 1 hour of signup.");
            recommendations.push("Add a progress indicator on the dashboard showing Day 1 is unlocked and ready.");
            recommendations.push("Consider adding an SMS reminder 24 hours after signup for users who haven't started.");
        } else if (startRate < 60) {
            if (priority !== "high") priority = "medium";
            insights.push(`Start rate of ${startRate.toFixed(0)}% is below the 60% target.`);
            recommendations.push("Test different welcome email subject lines to improve open rates.");
            recommendations.push("Add urgency messaging: 'Your spot in the December cohort is reserved for 48 hours.'");
        } else {
            insights.push(`✓ Strong start rate of ${startRate.toFixed(0)}% - users are engaging with content.`);
        }

        // Completion Rate Analysis
        if (completionRate < 30) {
            priority = "high";
            insights.push(`Critical: Only ${completionRate.toFixed(0)}% complete the course. Major drop-off detected.`);
            recommendations.push("Review which module has highest drop-off and simplify or shorten that content.");
            recommendations.push("Add progress celebration emails after each module completion.");
            recommendations.push("Enable 'Continue where you left off' notifications after 48 hours of inactivity.");
        } else if (completionRate < 50) {
            if (priority !== "high") priority = "medium";
            insights.push(`Completion rate of ${completionRate.toFixed(0)}% is below the 50% target.`);
            recommendations.push("Add a coach message at the halfway point encouraging completion.");
            recommendations.push("Test shorter lesson formats - current average may be too long.");
        } else {
            insights.push(`✓ Healthy completion rate of ${completionRate.toFixed(0)}%.`);
        }

        // Drop-off Point Analysis
        const highDropoffModules = data.dropoffPoints.filter(p => p.dropRate > 25);
        if (highDropoffModules.length > 0) {
            insights.push(`Drop-off hotspots detected: ${highDropoffModules.map(m => m.module).join(", ")}.`);
            recommendations.push(`Review and improve content in: ${highDropoffModules[0].module}. Consider adding more engagement elements.`);
        }

        // Training Watch Rate
        if (trainingRate < 50) {
            insights.push(`Only ${trainingRate.toFixed(0)}% of completers watch the training video.`);
            recommendations.push("Make the training video more prominent on the completion page.");
            recommendations.push("Send a personalized video invitation from Sarah after mini diploma completion.");
        }

        // Enroll Rate
        if (enrollRate < 5) {
            insights.push(`Conversion to paid is ${enrollRate.toFixed(1)}% - room for improvement.`);
            recommendations.push("Add a limited-time bonus offer for graduates who enroll within 72 hours.");
            recommendations.push("Test a payment plan option - $997 upfront may be a barrier.");
            recommendations.push("Add more social proof: testimonials from graduates earning $5K+/month.");
        } else if (enrollRate < 10) {
            insights.push(`Paid conversion at ${enrollRate.toFixed(1)}% is decent but can improve.`);
            recommendations.push("A/B test different CTA copy on the training page.");
        } else {
            insights.push(`✓ Strong ${enrollRate.toFixed(1)}% conversion rate from training watchers to paid.`);
        }

        // Time to complete analysis
        if (data.avgTimeToComplete > 14) {
            insights.push(`Average completion time is ${data.avgTimeToComplete} days - users may be losing momentum.`);
            recommendations.push("Consider daily email nudges for users taking longer than 7 days.");
        } else if (data.avgTimeToComplete < 2) {
            insights.push(`Users complete quickly (${data.avgTimeToComplete} days) - high engagement!`);
        }

        // General recommendations if things look good
        if (priority === "low" && recommendations.length < 2) {
            recommendations.push("Funnel is performing well. Focus on increasing traffic to the opt-in page.");
            recommendations.push("Consider testing different ad angles to acquire higher-intent leads.");
        }

        return NextResponse.json({
            insights,
            recommendations,
            priority,
        });
    } catch (error) {
        console.error("Error generating advice:", error);
        return NextResponse.json({ error: "Failed to generate advice" }, { status: 500 });
    }
}
