import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, Calendar, User, BookOpen } from "lucide-react";

async function getCertificate(certificateNumber: string) {
  return prisma.certificate.findUnique({
    where: { certificateNumber },
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
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateNumber: string }>;
}) {
  const { certificateNumber } = await params;
  const certificate = await getCertificate(certificateNumber);

  if (!certificate) {
    notFound();
  }

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
        return "Professional Certification";
      case "MINI_DIPLOMA":
        return "Mini Diploma";
      default:
        return "Certificate of Completion";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-gold-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-burgundy-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">AP</span>
          </div>
          <h1 className="text-2xl font-bold text-burgundy-800">AccrediPro</h1>
          <p className="text-gray-600">Certificate Verification</p>
        </div>

        {/* Verification Status */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-800">
                  Verified Certificate
                </h2>
                <p className="text-green-700">
                  This certificate is authentic and was issued by AccrediPro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Details */}
        <Card className="overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-8 text-white text-center relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-40 h-40 border-4 border-gold-400 rounded-full" />
              <div className="absolute bottom-4 left-4 w-32 h-32 border-4 border-gold-400 rounded-full" />
            </div>

            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gold-400 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-burgundy-800" />
              </div>
              <Badge variant="secondary" className="bg-gold-400/20 text-gold-200 border-0 mb-4">
                {getCertificateLabel(certificate.type)}
              </Badge>
              <h3 className="text-2xl font-bold mb-2">{certificate.course.title}</h3>
              <p className="text-burgundy-200">
                has been awarded to
              </p>
              <p className="text-3xl font-bold mt-2">
                {certificate.user.firstName} {certificate.user.lastName}
              </p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="flex items-center gap-2 text-gray-500">
                  <User className="w-5 h-5" />
                  Recipient
                </span>
                <span className="font-medium text-gray-900">
                  {certificate.user.firstName} {certificate.user.lastName}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="flex items-center gap-2 text-gray-500">
                  <BookOpen className="w-5 h-5" />
                  Course
                </span>
                <span className="font-medium text-gray-900">
                  {certificate.course.title}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-5 h-5" />
                  Issued Date
                </span>
                <span className="font-medium text-gray-900">
                  {formatDate(certificate.issuedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <span className="flex items-center gap-2 text-gray-500">
                  <Award className="w-5 h-5" />
                  Certificate Number
                </span>
                <span className="font-mono text-sm font-medium text-gray-900">
                  {certificate.certificateNumber}
                </span>
              </div>

              {certificate.expiresAt && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-5 h-5" />
                    Valid Until
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatDate(certificate.expiresAt)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                This certificate verifies that the above-named individual has
                successfully completed the requirements for the stated program at
                AccrediPro.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>AccrediPro - Veritas Et Excellentia</p>
          <p>Truth and Excellence in Education</p>
        </div>
      </div>
    </div>
  );
}
