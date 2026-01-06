import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Public help center search/browse
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (category && category !== "ALL") {
      where.category = category;
    }

    // Search in title, question, answer, and keywords
    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { title: { contains: searchLower, mode: "insensitive" } },
        { question: { contains: searchLower, mode: "insensitive" } },
        { answer: { contains: searchLower, mode: "insensitive" } },
        { keywords: { has: searchLower } },
      ];
    }

    const articles = await prisma.knowledgeBaseArticle.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        question: true,
        answer: true,
        category: true,
        viewCount: true,
        helpfulCount: true,
      },
      orderBy: [
        { helpfulCount: "desc" },
        { viewCount: "desc" },
      ],
      take: 50,
    });

    // Get category counts
    const categories = await prisma.knowledgeBaseArticle.groupBy({
      by: ["category"],
      where: { isPublished: true },
      _count: { category: true },
    });

    return NextResponse.json({
      articles,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch help center:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
