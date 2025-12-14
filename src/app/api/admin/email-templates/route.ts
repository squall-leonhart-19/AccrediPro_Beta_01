import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailCategory } from "@prisma/client";

// GET - List all email templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as EmailCategory | null;

    const templates = await prisma.emailTemplate.findMany({
      where: category ? { category } : undefined,
      orderBy: [
        { category: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        subject: true,
        preheader: true,
        courseTag: true,
        placeholders: true,
        isActive: true,
        isSystem: true,
        sentCount: true,
        openCount: true,
        clickCount: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch email templates" },
      { status: 500 }
    );
  }
}

// POST - Create a new email template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      name,
      description,
      category,
      subject,
      preheader,
      htmlContent,
      textContent,
      courseTag,
      placeholders,
    } = body;

    // Validate required fields
    if (!slug || !name || !category || !subject || !htmlContent) {
      return NextResponse.json(
        { error: "Missing required fields: slug, name, category, subject, htmlContent" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A template with this slug already exists" },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        slug,
        name,
        description,
        category,
        subject,
        preheader,
        htmlContent,
        textContent,
        courseTag,
        placeholders: placeholders || [],
        isActive: true,
        isSystem: false,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating email template:", error);
    return NextResponse.json(
      { error: "Failed to create email template" },
      { status: 500 }
    );
  }
}
