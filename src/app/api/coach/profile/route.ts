import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch coach profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                bio: true,
                professionalTitle: true,
                qualifications: true,
                specialties: true,
                personalQuote: true,
                availabilityNote: true,
                acceptingClients: true,
                isPublicDirectory: true,
                website: true,
                socialLinks: true,
                slug: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("Fetch coach profile error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

// PUT - Update coach profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user has coach role
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!currentUser || !["ADMIN", "INSTRUCTOR", "MENTOR"].includes(currentUser.role)) {
            return NextResponse.json({ error: "Not authorized as coach" }, { status: 403 });
        }

        const body = await request.json();
        const {
            firstName,
            lastName,
            image,
            bio,
            professionalTitle,
            qualifications,
            specialties,
            personalQuote,
            availabilityNote,
            acceptingClients,
            isPublicDirectory,
            website,
            socialLinks,
            slug,
        } = body;

        // Validate slug uniqueness if provided
        if (slug) {
            const existingSlug = await prisma.user.findFirst({
                where: {
                    slug: slug,
                    NOT: { id: session.user.id },
                },
            });
            if (existingSlug) {
                return NextResponse.json({ error: "This profile URL is already taken" }, { status: 400 });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(firstName !== undefined && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(image !== undefined && { image }),
                ...(bio !== undefined && { bio }),
                ...(professionalTitle !== undefined && { professionalTitle }),
                ...(qualifications !== undefined && { qualifications }),
                ...(specialties !== undefined && { specialties }),
                ...(personalQuote !== undefined && { personalQuote }),
                ...(availabilityNote !== undefined && { availabilityNote }),
                ...(acceptingClients !== undefined && { acceptingClients }),
                ...(isPublicDirectory !== undefined && { isPublicDirectory }),
                ...(website !== undefined && { website }),
                ...(socialLinks !== undefined && { socialLinks }),
                ...(slug !== undefined && { slug }),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                bio: true,
                professionalTitle: true,
                qualifications: true,
                specialties: true,
                personalQuote: true,
                availabilityNote: true,
                acceptingClients: true,
                isPublicDirectory: true,
                website: true,
                socialLinks: true,
                slug: true,
            },
        });

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Update coach profile error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
