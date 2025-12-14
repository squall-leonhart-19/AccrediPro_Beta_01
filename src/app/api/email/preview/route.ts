import { NextRequest, NextResponse } from "next/server";
import { generateEmailPreview, EmailType } from "@/lib/email";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const emailType = searchParams.get("type") as EmailType;

  if (!emailType) {
    return NextResponse.json(
      { error: "Email type is required" },
      { status: 400 }
    );
  }

  try {
    const html = generateEmailPreview(emailType);

    // Return HTML directly for iframe preview
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Email preview error:", error);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
