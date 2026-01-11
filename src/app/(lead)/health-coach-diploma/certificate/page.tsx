import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MiniDiplomaCertificate } from "@/components/certificates/mini-diploma-certificate";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCertificateData(userId: string) {
    const [user, completionTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: "health-coach-lesson-complete:" },
            },
        }),
    ]);

    return {
        user,
        completedLessons: completionTags.length,
    };
}

export default async function CertificatePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { user, completedLessons } = await getCertificateData(session.user.id);
    if (!user) redirect("/login");

    const isComplete = completedLessons >= 9;
    const studentName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
    const certificateId = `HC-${session.user.id.slice(0, 8).toUpperCase()}`;

    if (!isComplete) {
        redirect("/health-coach-diploma");
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link href="/health-coach-diploma/complete" className="inline-flex items-center text-gray-600 hover:text-burgundy-600 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Completion
                </Link>

                {/* Use existing certificate component */}
                <MiniDiplomaCertificate
                    studentName={studentName}
                    diplomaTitle="Health Coaching"
                    completedDate={new Date().toISOString()}
                    certificateId={certificateId}
                />
            </div>
        </div>
    );
}
