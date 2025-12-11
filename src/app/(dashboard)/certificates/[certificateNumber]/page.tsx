import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CertificateViewer } from "@/components/certificates/certificate-viewer";

interface Props {
    params: Promise<{ certificateNumber: string }>;
}

export default async function CertificateViewPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { certificateNumber: certNumber } = await params;

    // Fetch certificate for the logged-in user only
    const certificate = await prisma.certificate.findFirst({
        where: {
            certificateNumber: certNumber,
            userId: session.user.id, // Restored security check
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            course: {
                select: {
                    title: true,
                    certificateType: true,
                },
            },
        },
    });

    if (!certificate) {
        notFound();
    }

    const studentName = `${certificate.user.firstName || ""} ${certificate.user.lastName || ""}`.trim() || "Student";
    const courseTitle = certificate.course.title;
    const certificateNumber = certificate.certificateNumber;
    const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="animate-fade-in">
            <CertificateViewer
                studentName={studentName}
                courseTitle={courseTitle}
                certificateNumber={certificateNumber}
                issuedDate={issuedDate}
                certificateType={certificate.course.certificateType}
            />
        </div>
    );
}

