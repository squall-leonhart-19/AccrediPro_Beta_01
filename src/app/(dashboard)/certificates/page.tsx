import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as crypto from "crypto";

// Generate a stable certificate ID based on user ID and completion date
function generateStableCertificateId(userId: string, category: string, completedAt: Date): string {
  const year = completedAt.getFullYear();
  const categoryCode = category.toUpperCase().slice(0, 3);
  // Create a stable hash from user ID
  const hash = crypto.createHash('md5').update(userId).digest('hex').slice(0, 6).toUpperCase();
  return `MD-${categoryCode}-${year}-${hash}`;
}
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Download,
  ExternalLink,
  Calendar,
  BookOpen,
  GraduationCap,
  FileText,
  Share2,
  Star,
  Lock,
  ChevronRight,
  Target,
  Clock,
  CheckCircle,
  Shield,
  Sparkles,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import { MiniDiplomaDownloadButton } from "@/components/certificates/mini-diploma-download-button";
import { CertificateShareButtons } from "@/components/certificates/certificate-share-buttons";
import { TranscriptDownloadButton } from "@/components/certificates/transcript-download-button";
import { ModuleCertificateCard } from "@/components/certificates/module-certificate-card";
import { MarkCertificatesRead } from "@/components/certificates/mark-certificates-read";

// Certificate level definitions
const CERTIFICATE_LEVELS = [
  { level: 1, title: "Certification", description: "Foundation knowledge", icon: Award },
  { level: 2, title: "Practitioner", description: "Working with clients", icon: GraduationCap },
  { level: 3, title: "Specialist", description: "Advanced expertise", icon: Star },
  { level: 4, title: "Master Coach", description: "Industry authority", icon: Trophy },
];

// Skills earned per certificate type
const SKILLS_BY_CERTIFICATE: Record<string, string[]> = {
  "functional-medicine": [
    "Root-cause analysis",
    "Functional assessment",
    "Health coaching methodology",
    "Client intake protocols",
    "Lifestyle intervention design",
  ],
  "gut-health": [
    "Gut-brain axis understanding",
    "Digestive health assessment",
    "Microbiome fundamentals",
    "Elimination diet protocols",
    "Gut restoration strategies",
  ],
  "autism": [
    "Neurodevelopmental foundations",
    "Sensory processing understanding",
    "Family support strategies",
    "Behavioral assessment",
    "Holistic intervention planning",
  ],
  "hormones": [
    "Hormonal health foundations",
    "Menstrual cycle coaching",
    "Perimenopause support",
    "Stress hormone management",
    "Fertility awareness methods",
  ],
  default: [
    "Evidence-based coaching",
    "Client communication",
    "Health assessment",
    "Goal setting",
    "Progress monitoring",
  ],
};

// FM Specializations - Coming Soon
const FM_SPECIALIZATIONS_PREVIEW = [
  {
    title: "Functional Nutrition Specialist",
    category: "nutrition",
    badge: "CORE",
    income: "$60K - $150K",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
  },
  {
    title: "Gut Health & Microbiome",
    category: "gut-health",
    badge: "HIGH DEMAND",
    income: "$70K - $180K",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=200&fit=crop",
  },
  {
    title: "Women's Hormones Expert",
    category: "hormones",
    badge: "TRENDING",
    income: "$80K - $200K",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
  },
  {
    title: "Stress & Nervous System",
    category: "stress",
    badge: "GROWING",
    income: "$60K - $140K",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop",
  },
  {
    title: "Thyroid & Metabolism",
    category: "thyroid",
    badge: "EVERGREEN",
    income: "$65K - $160K",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
  },
];

async function getCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          certificateType: true,
          duration: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          modules: {
            select: {
              id: true,
              lessons: {
                select: { id: true },
              },
            },
          },
          coach: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      module: {
        select: {
          id: true,
          title: true,
          order: true,
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
      id: true,
      firstName: true,
      lastName: true,
      miniDiplomaCategory: true,
      miniDiplomaCompletedAt: true,
      createdAt: true,
    },
  });
}

async function getUserStats(userId: string) {
  const [totalWatchTime, completedLessons, badges] = await Promise.all([
    prisma.lessonProgress.aggregate({
      where: { userId },
      _sum: { watchTime: true },
    }),
    prisma.lessonProgress.count({
      where: { userId, isCompleted: true },
    }),
    prisma.userBadge.count({
      where: { userId },
    }),
  ]);

  return {
    totalHours: Math.round((totalWatchTime._sum.watchTime || 0) / 3600),
    completedLessons,
    badges,
  };
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

  const [certificates, user, stats] = await Promise.all([
    getCertificates(session.user.id),
    getUserMiniDiploma(session.user.id),
    getUserStats(session.user.id),
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCertificateLevel = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return 1;
      case "MINI_DIPLOMA":
        return 0;
      case "PRACTITIONER":
        return 2;
      case "SPECIALIST":
        return 3;
      case "MASTER":
        return 4;
      default:
        return 1;
    }
  };

  const getCertificateLevelLabel = (level: number) => {
    const levelData = CERTIFICATE_LEVELS.find(l => l.level === level);
    return levelData?.title || "Certificate";
  };

  const getSkillsForCertificate = (category: string | null) => {
    if (!category) return SKILLS_BY_CERTIFICATE.default;
    return SKILLS_BY_CERTIFICATE[category] || SKILLS_BY_CERTIFICATE.default;
  };

  // Group ALL certificates by course (both module mini-diplomas and course certificates)
  const certificatesByCourse: Record<string, {
    courseTitle: string;
    courseSlug: string;
    moduleCerts: typeof certificates;
    courseCert: typeof certificates[0] | null;
  }> = {};

  certificates.forEach(cert => {
    const courseId = cert.courseId;
    if (!certificatesByCourse[courseId]) {
      certificatesByCourse[courseId] = {
        courseTitle: cert.course.title,
        courseSlug: cert.course.slug,
        moduleCerts: [],
        courseCert: null,
      };
    }
    if (cert.moduleId) {
      certificatesByCourse[courseId].moduleCerts.push(cert);
    } else {
      certificatesByCourse[courseId].courseCert = cert;
    }
  });

  // Sort module certs by module order within each course
  Object.values(certificatesByCourse).forEach(course => {
    course.moduleCerts.sort((a, b) => (a.module?.order || 0) - (b.module?.order || 0));
  });

  // Calculate progress stats
  const totalCertificates = certificates.length + (user?.miniDiplomaCompletedAt ? 1 : 0);
  const practitionerLevel = certificates.filter(c => getCertificateLevel(c.type) >= 2).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mark certificate notifications as read when visiting this page */}
      <MarkCertificatesRead />

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
              Your professional credential hub — track progress, download certificates, and showcase your expertise to clients
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Student Credential ID Card - TOP */}
      {user && (
        <Card className="bg-gradient-to-r from-burgundy-50 via-white to-gold-50 border-burgundy-200 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 relative">
                {session.user.image ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-4 border-gold-400/50">
                    <img
                      src={session.user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-xl flex items-center justify-center shadow-lg border-4 border-gold-400/50">
                    <span className="text-3xl font-bold text-gold-400">
                      {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <Shield className="w-4 h-4 text-burgundy-800" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="bg-gold-100 text-gold-700 border-0 mb-2">AccrediPro Student ID</Badge>
                <h3 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Student ID: AP-{user.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(user.createdAt)}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge className="bg-burgundy-100 text-burgundy-700">{totalCertificates} Certificates</Badge>
                  <Badge className="bg-green-100 text-green-700">{stats.badges} Badges</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview Bar */}
      <Card className="border-gold-200 bg-gradient-to-r from-gold-50 to-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-gold-600" />
              Your Learning Progress
            </h3>
            <Badge className="bg-gold-100 text-gold-700 border-0">
              {totalCertificates} Certificates Earned
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-burgundy-600">{totalCertificates}</p>
              <p className="text-xs text-gray-500">Core Certifications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{practitionerLevel}</p>
              <p className="text-xs text-gray-500">Practitioner Tracks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0/{FM_SPECIALIZATIONS_PREVIEW.length}</p>
              <p className="text-xs text-gray-500">Specializations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.badges}</p>
              <p className="text-xs text-gray-500">Badges Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Certificates Section */}
      {(user?.miniDiplomaCompletedAt || Object.keys(certificatesByCourse).length > 0) ? (
        <div className="space-y-6">
          {/* Mini Diploma */}
          {user?.miniDiplomaCompletedAt && user?.miniDiplomaCategory && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-burgundy-600" />
                Exploration Track
                <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
              </h2>
              <Card className="overflow-hidden border-2 border-gold-200 shadow-lg">
                <div className="grid md:grid-cols-2">
                  {/* Certificate Preview - Premium Look */}
                  <div className="bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900 p-8 text-white relative overflow-hidden min-h-[320px] flex items-center justify-center">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0">
                      {/* Corner Ornaments */}
                      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-gold-400/40" />
                      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-gold-400/40" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-gold-400/40" />
                      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-gold-400/40" />
                      {/* Center Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 bg-gold-400/10 rounded-full blur-3xl" />
                      </div>
                    </div>

                    <div className="relative text-center z-10">
                      {/* AccrediPro Logo/Badge */}
                      <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold-300 to-gold-500 rounded-full flex items-center justify-center shadow-xl border-2 border-gold-200/50">
                          <GraduationCap className="w-8 h-8 text-burgundy-900" />
                        </div>
                      </div>

                      {/* Certificate Text */}
                      <p className="text-gold-400/80 text-xs uppercase tracking-[0.3em] mb-1">AccrediPro Certifies</p>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {user.firstName} {user.lastName}
                      </h3>

                      <p className="text-burgundy-200 text-sm mb-3">has successfully completed the</p>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 mb-3">
                        <h4 className="text-lg font-bold text-gold-300">
                          {categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory}
                        </h4>
                        <p className="text-gold-400 text-sm font-medium">Mini Diploma</p>
                      </div>

                      <p className="text-burgundy-300 text-xs mt-2">
                        Certificate #{generateStableCertificateId(user.id, user.miniDiplomaCategory, user.miniDiplomaCompletedAt)}
                      </p>
                      <p className="text-burgundy-300 text-xs">
                        Issued: {formatDate(user.miniDiplomaCompletedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-6 space-y-5">
                    {/* Skills Earned */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-gold-500" />
                        Skills Earned
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {getSkillsForCertificate(user.miniDiplomaCategory).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-burgundy-50 text-burgundy-700 border-0">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Issued</p>
                        <p className="font-medium">{formatDate(user.miniDiplomaCompletedAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Level</p>
                        <p className="font-medium">Pre-Step (Exploration)</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t">
                      <Link href="/my-mini-diploma/complete">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <MiniDiplomaDownloadButton
                        studentName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Graduate'}
                        diplomaTitle={`${categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory} Mini Diploma`}
                        completedDate={user.miniDiplomaCompletedAt.toISOString()}
                        certificateId={generateStableCertificateId(user.id, user.miniDiplomaCategory, user.miniDiplomaCompletedAt)}
                      />
                      <TranscriptDownloadButton
                        studentName={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                        certificateTitle={`${categoryLabels[user.miniDiplomaCategory]} Mini Diploma`}
                        certificateId={generateStableCertificateId(user.id, user.miniDiplomaCategory, user.miniDiplomaCompletedAt)}
                        issuedDate={user.miniDiplomaCompletedAt.toISOString()}
                        totalHours={stats.totalHours}
                        skills={getSkillsForCertificate(user.miniDiplomaCategory)}
                        isMiniDiploma={true}
                      />
                    </div>

                    {/* Share Buttons */}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Share Your Achievement</p>
                      <CertificateShareButtons
                        certificateTitle={`${categoryLabels[user.miniDiplomaCategory]} Mini Diploma`}
                        certificateUrl={`${process.env.NEXT_PUBLIC_APP_URL || ''}/my-mini-diploma/complete`}
                      />
                    </div>

                    {/* Unlock Full Certification CTA */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-lg p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-gold-400" />
                        <p className="text-sm font-bold">Ready to Become a Certified Practitioner?</p>
                      </div>
                      <p className="text-xs text-burgundy-200 mb-3">
                        Unlock the full {categoryLabels[user.miniDiplomaCategory]} certification to practice professionally with clients and earn 9x accredited credentials.
                      </p>
                      <Link href="/roadmap">
                        <Button size="sm" className="w-full bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold">
                          Unlock Full Certification & Become a Practitioner
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Certificates grouped by Course */}
          {Object.entries(certificatesByCourse).map(([courseId, courseData]) => (
            <div key={courseId} className="space-y-4">
              {/* Course Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-burgundy-600" />
                  {courseData.courseTitle}
                </h2>
                <Badge className="bg-burgundy-100 text-burgundy-700">
                  {courseData.moduleCerts.length} Module{courseData.moduleCerts.length !== 1 ? 's' : ''} Completed
                  {courseData.courseCert && ' + Final Certificate'}
                </Badge>
              </div>

              {/* Module Certificates - Compact Cards */}
              {courseData.moduleCerts.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {courseData.moduleCerts
                    .filter(cert => cert.module?.order !== 0) // Skip Module 0
                    .map((cert) => (
                    <ModuleCertificateCard
                      key={cert.id}
                      studentName={`${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || 'Student'}
                      moduleTitle={cert.module?.title || 'Module'}
                      courseName={cert.course.title}
                      completedDate={cert.issuedAt.toISOString()}
                      certificateId={cert.certificateNumber}
                    />
                  ))}
                </div>
              )}

              {/* Final Course Certificate (if earned) */}
              {courseData.courseCert && (
                <Card className="overflow-hidden border-2 border-gold-200">
                  {/* Certificate Preview */}
                  <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-32 h-32 border-4 border-gold-400 rounded-full" />
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gold-400 text-burgundy-900 font-bold shadow-lg">
                        Master Certificate
                      </Badge>
                    </div>

                    <div className="relative text-center pt-4">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gold-400 rounded-full flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-burgundy-800" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{courseData.courseCert.course.title}</h3>
                      <p className="text-burgundy-200 text-sm">
                        #{courseData.courseCert.certificateNumber}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    {/* Skills Earned */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold-500" />
                        Skills Earned
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {getSkillsForCertificate(courseData.courseCert.course.category?.slug || null).slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 border-0 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(courseData.courseCert.issuedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{courseData.courseCert.course.duration ? `${Math.round(courseData.courseCert.course.duration / 60)}h` : "Self-paced"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <BookOpen className="w-3 h-3" />
                        <span>{courseData.courseCert.course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{courseData.courseCert.course.coach ? `${courseData.courseCert.course.coach.firstName} ${courseData.courseCert.course.coach.lastName}` : "AccrediPro Team"}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t">
                      <Link href={`/certificates/${courseData.courseCert.certificateNumber}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/certificates/${courseData.courseCert.certificateNumber}`}>
                        <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </Link>
                      <TranscriptDownloadButton
                        studentName={`${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()}
                        certificateTitle={courseData.courseCert.course.title}
                        certificateId={courseData.courseCert.certificateNumber}
                        issuedDate={courseData.courseCert.issuedAt.toISOString()}
                        totalHours={courseData.courseCert.course.duration ? Math.round(courseData.courseCert.course.duration / 60) : stats.totalHours}
                        skills={getSkillsForCertificate(courseData.courseCert.course.category?.slug || null)}
                        instructor={courseData.courseCert.course.coach ? `${courseData.courseCert.course.coach.firstName} ${courseData.courseCert.course.coach.lastName}` : "AccrediPro Team"}
                      />
                    </div>

                    {/* Share */}
                    <div className="pt-2">
                      <CertificateShareButtons
                        certificateTitle={courseData.courseCert.course.title}
                        certificateUrl={`${process.env.NEXT_PUBLIC_APP_URL || ''}/verify/${courseData.courseCert.certificateNumber}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
            <Link href="/catalog">
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Locked Certificates - Unlock to Earn */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            Certificates to Unlock
            <Badge className="bg-purple-100 text-purple-700 text-xs">Grow Your Credentials</Badge>
          </h2>
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="text-burgundy-600">
              Browse All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Functional Medicine Certification",
              level: "Practitioner",
              hours: "40+ Hours",
              image: "/certificates_img/FUNCTIONAL_MEDICINE_CERTIFICATE.webp",
              badge: "Most Popular",
              price: "$1,997",
              slug: "functional-medicine-complete-certification"
            },
            {
              title: "Gut Health Specialist",
              level: "Specialist",
              hours: "30+ Hours",
              image: "/certificates_img/GUT_HEALTH_CERTIFICATE.webp",
              badge: "High Demand",
              price: "$1,497",
              slug: "gut-health-certification"
            },
            {
              title: "Women's Hormone Health",
              level: "Specialist",
              hours: "35+ Hours",
              image: "/certificates_img/WOMENS_HEALTH_CERTIFICATE.webp",
              badge: "Trending",
              price: "$1,697",
              slug: "womens-hormone-health-certification"
            },
          ].map((cert, index) => (
            <Link key={index} href={`/courses/${cert.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full border-2 border-gray-100 hover:border-burgundy-200 relative">
                {/* Locked Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <div className="absolute top-3 right-3 z-20">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale-[30%] group-hover:grayscale-0"
                  />
                  <Badge className="absolute top-3 left-3 bg-gold-400 text-burgundy-900 text-[10px] font-bold z-20">
                    {cert.badge}
                  </Badge>
                </div>

                <CardContent className="p-4 relative z-20 bg-white">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-burgundy-700 transition-colors">
                      {cert.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Badge variant="secondary" className="bg-burgundy-50 text-burgundy-700 text-[10px]">
                      {cert.level}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {cert.hours}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-burgundy-600">{cert.price}</span>
                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white text-xs h-8 px-3 group-hover:bg-gold-500 group-hover:text-burgundy-900 transition-colors">
                      Unlock <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-burgundy-600 border-0 text-white overflow-hidden">
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Unlock All Certifications</h3>
                  <p className="text-purple-200 text-sm">Save up to 40% with our certification bundles</p>
                </div>
              </div>
              <Link href="/catalog">
                <Button className="bg-white text-burgundy-700 hover:bg-gold-100 font-bold whitespace-nowrap">
                  View Bundles <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FM Specializations - Coming Soon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-500" />
            FM Specializations
            <Badge className="bg-amber-100 text-amber-700 text-xs">Coming Soon</Badge>
          </h2>
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="text-burgundy-600">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FM_SPECIALIZATIONS_PREVIEW.map((spec, index) => (
            <Link key={index} href="/catalog">
              <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full">
                <div className="aspect-[2/1] relative overflow-hidden">
                  <img
                    src={spec.image}
                    alt={spec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-gold-400 text-burgundy-900 text-[10px]">
                    {spec.badge}
                  </Badge>
                  <Badge className="absolute bottom-2 right-2 bg-white/90 text-gray-900 text-[10px]">
                    Coming Soon
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{spec.title}</h4>
                  <p className="text-xs text-green-600 font-medium">{spec.income}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>


      {/* Career Center Integration */}
      <Card className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Advance Your Career</h3>
              <p className="text-burgundy-200">View your personalized career path and unlock your next certification</p>
            </div>
            <div className="flex gap-3">
              <Link href="/roadmap">
                <Button variant="secondary" className="bg-white text-burgundy-700 hover:bg-white/90">
                  <Target className="w-4 h-4 mr-2" />
                  View Career Path
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" className="bg-white text-gray-900 border-white hover:bg-gray-100">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Certifications
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Info */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-burgundy-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Certificate Verification
              </h3>
              <p className="text-sm text-gray-600">
                All AccrediPro certificates come with a unique verification number.
                Anyone can verify your certificate authenticity using our public verification page.
                Share your credentials with confidence - they&apos;re backed by 9x international accreditations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
