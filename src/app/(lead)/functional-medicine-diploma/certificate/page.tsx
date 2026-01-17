import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MiniDiplomaCertificate } from "@/components/certificates/mini-diploma-certificate";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCertificateData(userId: string) {
    const [user, examData] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
            },
        }),
        // Check if exam is passed - this is the real requirement for certificate
        prisma.miniDiplomaExam.findFirst({
            where: {
                userId,
                passed: true,
            },
            select: {
                id: true,
                passed: true,
                score: true,
                createdAt: true,
            },
        }),
    ]);

    return {
        user,
        examData,
    };
}

export default async function CertificatePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { user, examData } = await getCertificateData(session.user.id);
    if (!user) redirect("/login");

    // Must have passed exam to view certificate
    if (!examData?.passed) {
        redirect("/functional-medicine-diploma");
    }

    const studentName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
    // Use exam date for certificate, not current date
    const completedDate = examData.createdAt.toISOString();
    // Generate certificate ID based on exam
    const certificateId = `FM-${examData.createdAt.toISOString().slice(0, 10).replace(/-/g, '')}-${examData.id.slice(-6).toUpperCase()}`;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link href="/functional-medicine-diploma/complete" className="inline-flex items-center text-gray-600 hover:text-burgundy-600 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Completion
                </Link>

                {/* Use existing certificate component */}
                <MiniDiplomaCertificate
                    studentName={studentName}
                    diplomaTitle="ASI Functional Medicine Foundation"
                    completedDate={completedDate}
                    certificateId={certificateId}
                />
            </div>
        </div>
    );
}
