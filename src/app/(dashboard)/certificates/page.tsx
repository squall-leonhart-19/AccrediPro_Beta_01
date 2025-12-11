import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, ExternalLink, Calendar, BookOpen, GraduationCap } from "lucide-react";
import { MiniDiplomaDownloadButton } from "@/components/certificates/mini-diploma-download-button";

async function getCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
          slug: true,
          certificateType: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });
}

async function getUserMiniDiploma(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      miniDiplomaCategory: true,
      miniDiplomaCompletedAt: true,
    },
  });
}

const categoryLabels: Record<string, string> = {
  "functional-medicine": "Functional Medicine",
  "gut-health": "Gut Health",
  "autism": "Autism & Neurodevelopment",
  "hormones": "Women's Hormones",
};

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [certificates, user] = await Promise.all([
    getCertificates(session.user.id),
    getUserMiniDiploma(session.user.id),
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCertificateLabel = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return "Certification";
      case "MINI_DIPLOMA":
        return "Mini Diploma";
      default:
        return "Certificate of Completion";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-8 lg:p-10 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <Award className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">My Certificates</h1>
            <p className="text-burgundy-100 text-lg">
              View and download your earned certificates and achievements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* All Certificates Grid - unified layout */}
      {(user?.miniDiplomaCompletedAt || certificates.length > 0) ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mini Diploma Certificate Card */}
          {user?.miniDiplomaCompletedAt && user?.miniDiplomaCategory && (
            <Card className="card-hover overflow-hidden h-full flex flex-col">
              {/* Certificate Preview */}
              <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border-4 border-gold-400 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-gold-400 rounded-full" />
                </div>

                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gold-400 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-burgundy-800" />
                  </div>
                  <Badge variant="secondary" className="bg-gold-400/20 text-gold-200 border-0 mb-3">
                    Mini Diploma
                  </Badge>
                  <h3 className="text-xl font-bold">
                    {categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory}
                  </h3>
                  <p className="text-burgundy-200 text-sm mt-2">
                    Certificate #MD-{user.miniDiplomaCategory.toUpperCase().slice(0, 3)}-{new Date(user.miniDiplomaCompletedAt).getFullYear()}
                  </p>
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-end">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Issued
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatDate(user.miniDiplomaCompletedAt)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Link href="/my-mini-diploma/complete" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <MiniDiplomaDownloadButton
                      studentName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Graduate'}
                      diplomaTitle={`${categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory} Mini Diploma`}
                      completedDate={user.miniDiplomaCompletedAt.toISOString()}
                      certificateId={`MD-${user.miniDiplomaCategory.toUpperCase().slice(0, 3)}-${new Date(user.miniDiplomaCompletedAt).getFullYear()}-${user.miniDiplomaCategory.slice(-4).toUpperCase()}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Certificates */}
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="card-hover overflow-hidden h-full flex flex-col">
              {/* Certificate Preview */}
              <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border-4 border-gold-400 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-gold-400 rounded-full" />
                </div>

                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gold-400 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-burgundy-800" />
                  </div>
                  <Badge variant="secondary" className="bg-gold-400/20 text-gold-200 border-0 mb-3">
                    {getCertificateLabel(certificate.type)}
                  </Badge>
                  <h3 className="text-xl font-bold">{certificate.course.title}</h3>
                  <p className="text-burgundy-200 text-sm mt-2">
                    Certificate #{certificate.certificateNumber}
                  </p>
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-end">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Issued
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatDate(certificate.issuedAt)}
                    </span>
                  </div>

                  {certificate.expiresAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Expires
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatDate(certificate.expiresAt)}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t">
                    <Link
                      href={`/certificates/${certificate.certificateNumber}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link
                      href={`/certificates/${certificate.certificateNumber}`}
                      className="flex-1"
                    >
                      <Button variant="default" size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No certificates yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete a course to earn your first certificate. Certificates are
              automatically issued when you finish all lessons.
            </p>
            <Link href="/courses">
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Verification Info */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-burgundy-100 rounded-lg">
              <Award className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Certificate Verification
              </h3>
              <p className="text-sm text-gray-600">
                All AccrediPro certificates come with a unique verification number.
                Anyone can verify your certificate authenticity using our public
                verification page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
