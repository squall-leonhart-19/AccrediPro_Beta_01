import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        // Initialize Anthropic inside handler to avoid build-time crash
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Fetch comprehensive user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                lastLoginAt: true,
                loginCount: true,
                leadSource: true,
                leadSourceDetail: true,
                miniDiplomaCategory: true,
                miniDiplomaCompletedAt: true,
                certificationGoal: true,
                learningGoal: true,
                experienceLevel: true,
                focusAreas: true,
                enrollments: {
                    select: {
                        course: { select: { title: true } },
                        progress: true,
                        status: true,
                        enrolledAt: true,
                        completedAt: true,
                    }
                },
                certificates: {
                    select: {
                        course: { select: { title: true } },
                        issuedAt: true,
                        createdAt: true,
                    }
                },
                tags: {
                    select: { value: true }
                },
                _count: {
                    select: {
                        progress: true,
                        certificates: true,
                        enrollments: true,
                    }
                }
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate key metrics
        const now = new Date();
        const createdAt = new Date(user.createdAt);
        const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

        const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
        const daysSinceLastLogin = lastLogin
            ? Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
            : null;

        const avgProgress = user.enrollments.length > 0
            ? Math.round(user.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / user.enrollments.length)
            : 0;

        const completedCourses = user.enrollments.filter(e => e.status === "COMPLETED").length;
        const tags = user.tags.map(t => t.value);

        // Build context for AI
        const context = `
USER PROFILE SUMMARY:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Signed up: ${daysSinceSignup} days ago (${createdAt.toLocaleDateString()})
- Last login: ${daysSinceLastLogin !== null ? `${daysSinceLastLogin} days ago` : 'Never logged in'}
- Total logins: ${user.loginCount}
- Lead source: ${user.leadSource || 'Unknown'} ${user.leadSourceDetail ? `(${user.leadSourceDetail})` : ''}

LEARNING JOURNEY:
- Learning goal: ${user.learningGoal || 'Not specified'}
- Certification goal: ${user.certificationGoal || 'Not specified'}
- Experience level: ${user.experienceLevel || 'Not specified'}
- Focus areas: ${user.focusAreas?.join(', ') || 'None'}
- Mini diploma category: ${user.miniDiplomaCategory || 'None'}
- Mini diploma completed: ${user.miniDiplomaCompletedAt ? 'Yes' : 'No'}

ENROLLMENTS (${user.enrollments.length} total):
${user.enrollments.map(e => `- ${e.course.title}: ${e.progress}% progress, Status: ${e.status}`).join('\n') || 'None'}

CERTIFICATES (${user.certificates.length} total):
${user.certificates.map(c => `- ${c.course.title} (issued: ${new Date(c.issuedAt || c.createdAt).toLocaleDateString()})`).join('\n') || 'None'}

MARKETING TAGS:
${tags.join(', ') || 'None'}

KEY METRICS:
- Average course progress: ${avgProgress}%
- Completed courses: ${completedCourses}/${user.enrollments.length}
- Total lesson progress entries: ${user._count.progress}
`;

        // Call Anthropic
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 800,
            system: `You are an expert customer success analyst for AccrediPro Academy, an online certification platform for health & wellness professionals. 

Your job is to analyze user data and provide:
1. A brief plain-English summary of who this user is and their journey
2. Key insights about their engagement level
3. Risk assessment (healthy, at-risk, churning)
4. 2-3 specific actionable recommendations for the admin team

Be concise but insightful. Use specific data points to support your analysis. Format with clear sections.`,
            messages: [
                {
                    role: "user",
                    content: `Analyze this user and provide insights:\n\n${context}`
                }
            ],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        const summary = textBlock?.type === "text" ? textBlock.text : "Unable to generate summary.";

        return NextResponse.json({
            success: true,
            summary,
            metrics: {
                daysSinceSignup,
                daysSinceLastLogin,
                avgProgress,
                completedCourses,
                totalEnrollments: user.enrollments.length,
                totalCertificates: user.certificates.length,
                totalTags: tags.length,
            }
        });
    } catch (error) {
        console.error("Error generating AI summary:", error);
        return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
    }
}
