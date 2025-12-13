import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

// Locked certificates for FOMO
const LOCKED_CERTIFICATES = [
  { title: "Gut Health Specialist", category: "gut-health", level: 3 },
  { title: "Hormone Specialist Certification", category: "hormones", level: 2 },
  { title: "Trauma-Informed Practitioner", category: "trauma", level: 2 },
  { title: "Functional Medicine Master Track", category: "functional-medicine", level: 4 },
  { title: "Neurodiversity Advanced Coach", category: "autism", level: 3 },
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

  // Group certificates by track/category
  const groupedCertificates: Record<string, typeof certificates> = {};
  certificates.forEach(cert => {
    const category = cert.course.category?.slug || "general";
    if (!groupedCertificates[category]) {
      groupedCertificates[category] = [];
    }
    groupedCertificates[category].push(cert);
  });

  // Calculate progress stats
  const totalCertificates = certificates.length + (user?.miniDiplomaCompletedAt ? 1 : 0);
  const practitionerLevel = certificates.filter(c => getCertificateLevel(c.type) >= 2).length;

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
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">My Certificates & Credentials</h1>
            <p className="text-burgundy-100 text-lg">
              Your professional credentials hub - view, download, and share your achievements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Student Credential ID Card - TOP */}
      {user && (
        <Card className="bg-gradient-to-r from-burgundy-50 via-white to-gold-50 border-burgundy-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-12 h-12 text-gold-400" />
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
              <p className="text-2xl font-bold text-blue-600">0/{LOCKED_CERTIFICATES.length}</p>
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
      {(user?.miniDiplomaCompletedAt || certificates.length > 0) ? (
        <div className="space-y-6">
          {/* Mini Diploma */}
          {user?.miniDiplomaCompletedAt && user?.miniDiplomaCategory && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-burgundy-600" />
                Exploration Track
              </h2>
              <Card className="overflow-hidden border-2 border-gold-200">
                <div className="grid md:grid-cols-2">
                  {/* Certificate Preview */}
                  <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-32 h-32 border-4 border-gold-400 rounded-full" />
                      <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-gold-400 rounded-full" />
                    </div>

                    <div className="relative text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gold-400 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-burgundy-800" />
                      </div>
                      <Badge className="bg-purple-500 text-white border-0 mb-3">
                        Pre-Step: Exploration
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">
                        {categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory}
                      </h3>
                      <p className="text-gold-300 font-medium">Mini Diploma</p>
                      <p className="text-burgundy-200 text-sm mt-3">
                        Certificate #MD-{user.miniDiplomaCategory.toUpperCase().slice(0, 3)}-{new Date(user.miniDiplomaCompletedAt).getFullYear()}
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
                        certificateId={`MD-${user.miniDiplomaCategory.toUpperCase().slice(0, 3)}-${new Date(user.miniDiplomaCompletedAt).getFullYear()}`}
                      />
                      <TranscriptDownloadButton
                        studentName={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                        certificateTitle={`${categoryLabels[user.miniDiplomaCategory]} Mini Diploma`}
                        certificateId={`MD-${user.miniDiplomaCategory.toUpperCase().slice(0, 3)}-${new Date(user.miniDiplomaCompletedAt).getFullYear()}`}
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

          {/* Course Certificates by Category */}
          {Object.entries(groupedCertificates).map(([category, certs]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-burgundy-600" />
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)} Track
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {certs.map((certificate) => {
                  const level = getCertificateLevel(certificate.type);
                  const totalLessons = certificate.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                  const skills = getSkillsForCertificate(certificate.course.category?.slug || null);
                  const instructor = certificate.course.coach
                    ? `${certificate.course.coach.firstName} ${certificate.course.coach.lastName}`
                    : "AccrediPro Team";

                  return (
                    <Card key={certificate.id} className="overflow-hidden border-2 border-gold-200">
                      {/* Certificate Preview */}
                      <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-32 h-32 border-4 border-gold-400 rounded-full" />
                        </div>

                        {/* Level Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gold-400 text-burgundy-900 font-bold shadow-lg">
                            Level {level}: {getCertificateLevelLabel(level)}
                          </Badge>
                        </div>

                        <div className="relative text-center pt-4">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gold-400 rounded-full flex items-center justify-center">
                            <Award className="w-8 h-8 text-burgundy-800" />
                          </div>
                          <h3 className="text-xl font-bold mb-1">{certificate.course.title}</h3>
                          <p className="text-burgundy-200 text-sm">
                            #{certificate.certificateNumber}
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
                            {skills.slice(0, 4).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 border-0 text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {skills.length > 4 && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-0 text-xs">
                                +{skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(certificate.issuedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{certificate.course.duration ? `${Math.round(certificate.course.duration / 60)}h` : "Self-paced"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <BookOpen className="w-3 h-3" />
                            <span>{totalLessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{instructor}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t">
                          <Link href={`/certificates/${certificate.certificateNumber}`}>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/certificates/${certificate.certificateNumber}`}>
                            <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </Link>
                          <TranscriptDownloadButton
                            studentName={`${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()}
                            certificateTitle={certificate.course.title}
                            certificateId={certificate.certificateNumber}
                            issuedDate={certificate.issuedAt.toISOString()}
                            totalHours={certificate.course.duration ? Math.round(certificate.course.duration / 60) : stats.totalHours}
                            skills={skills}
                            instructor={instructor}
                          />
                        </div>

                        {/* Share */}
                        <div className="pt-2">
                          <CertificateShareButtons
                            certificateTitle={certificate.course.title}
                            certificateUrl={`${process.env.NEXT_PUBLIC_APP_URL || ''}/verify/${certificate.certificateNumber}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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
            <Link href="/courses">
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Locked Certificates - FOMO Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-400" />
          Unlock More Credentials
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {LOCKED_CERTIFICATES.map((cert, index) => (
            <Card key={index} className="overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer group">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 text-white text-center relative">
                <div className="absolute inset-0 bg-black/20" />
                <Lock className="w-8 h-8 mx-auto mb-2 relative z-10" />
                <p className="text-xs font-medium relative z-10">Level {cert.level}</p>
              </div>
              <CardContent className="p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-1 line-clamp-2">{cert.title}</h4>
                <Link href="/roadmap">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-burgundy-600 group-hover:bg-burgundy-50">
                    Unlock
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
              <Link href="/courses">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
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
