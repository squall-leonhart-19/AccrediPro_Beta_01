import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// GET - List all knowledge base articles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const published = searchParams.get("published");

    const where: Record<string, unknown> = {};
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (published === "true") {
      where.isPublished = true;
    } else if (published === "false") {
      where.isPublished = false;
    }

    const articles = await prisma.knowledgeBaseArticle.findMany({
      where,
      orderBy: [
        { viewCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Failed to fetch knowledge base:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST - Generate a knowledge base article from resolved tickets
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ticketIds, category } = body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json({ error: "At least one ticket ID is required" }, { status: 400 });
    }

    // Fetch the resolved tickets with their messages
    const tickets = await prisma.supportTicket.findMany({
      where: {
        id: { in: ticketIds },
        status: { in: ["RESOLVED", "CLOSED"] },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (tickets.length === 0) {
      return NextResponse.json({ error: "No resolved tickets found with provided IDs" }, { status: 400 });
    }

    // Format tickets for AI processing
    const ticketSummaries = tickets.map(ticket => {
      const conversation = ticket.messages.map(m =>
        `${m.isFromCustomer ? "CUSTOMER" : "SUPPORT"}: ${m.content}`
      ).join("\n\n");

      return `
=== TICKET #${ticket.ticketNumber}: ${ticket.subject} ===
Category: ${ticket.category}
${conversation}
========================================`;
    }).join("\n\n");

    // Use Claude to generate the knowledge base article
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `You are creating a knowledge base article for a professional certification platform (AccrediPro LMS) based on resolved support tickets.

Analyze these resolved support tickets and create a helpful FAQ-style article:

${ticketSummaries}

Generate a JSON response with this structure:
{
  "title": "Clear, actionable title (e.g., 'How to Reset Your Password')",
  "question": "The common question customers have (written from customer perspective)",
  "answer": "A clear, step-by-step solution. Be warm and professional. Include specific instructions.",
  "keywords": ["array", "of", "search", "keywords"],
  "category": "${category || tickets[0].category}"
}

Important:
- Make the answer comprehensive but easy to follow
- Use numbered steps where appropriate
- Be friendly and professional (our audience is 40+ women in health/wellness)
- Include any relevant tips or common pitfalls
- The answer should help customers self-serve without needing support

Return ONLY the JSON, no other text.`
      }]
    });

    // Parse AI response
    const contentBlock = response.content[0];
    const aiText = contentBlock.type === 'text' ? contentBlock.text : '';
    let articleData;

    try {
      // Clean up the response (remove markdown code blocks if present)
      const cleanJson = aiText.replace(/```json\n?|\n?```/g, '').trim();
      articleData = JSON.parse(cleanJson);
    } catch {
      console.error("Failed to parse AI response:", aiText);
      return NextResponse.json({ error: "Failed to generate article content" }, { status: 500 });
    }

    // Generate slug from title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);

    // Check for existing slug
    const existingSlug = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug },
    });

    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    // Create the article
    const article = await prisma.knowledgeBaseArticle.create({
      data: {
        title: articleData.title,
        slug: finalSlug,
        question: articleData.question,
        answer: articleData.answer,
        category: articleData.category || category || "GENERAL",
        keywords: articleData.keywords || [],
        sourceTicketIds: ticketIds,
        generatedBy: "AI",
        isPublished: false, // Draft by default
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Failed to generate knowledge base article:", error);
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 });
  }
}
