import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserStoryClient } from "./user-story-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getUserData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            phone: true,
            location: true,
            lastLoginAt: true,
            createdAt: true,
            hasCompletedOnboarding: true,
            userType: true,
            role: true,
        },
    });

    if (!user) return null;

    // Get segment
    const segment = await prisma.oracleSegment.findUnique({
        where: { userId },
    });

    // Get recent events
    const events = await prisma.oracleEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    // Get actions
    const actions = await prisma.oracleAction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    // Get enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                select: { id: true, title: true },
            },
        },
    });

    // Get certificates
    const certificates = await prisma.certificate.findMany({
        where: { userId },
        select: { id: true, courseId: true, createdAt: true },
    });

    return {
        user,
        segment,
        events,
        actions,
        enrollments,
        certificates,
    };
}

export default async function UserStoryPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;
    const data = await getUserData(id);

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
                </div>
            }>
                <UserStoryClient data={data} />
            </Suspense>
        </div>
    );
}
