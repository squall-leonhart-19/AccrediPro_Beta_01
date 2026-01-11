import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, MapPin, Globe, Calendar, Award, ExternalLink, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils"; // Assuming utils exists, or native

// Format date helper if import fails
const formatDateSafe = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(date);
};

interface ProfilePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { slug } = await params;
    const user = await prisma.user.findFirst({
        where: {
            isPublicDirectory: true,
            OR: [{ slug }, { id: slug }],
        },
    });

    if (!user) return { title: "Professional Not Found" };

    const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || "Professional";

    return {
        title: `${fullName} - Verified Professional | AccrediPro Directory`,
        description: user.bio || `View the professional profile of ${fullName}, a verified practitioner at AccrediPro.`,
    };
}

export default async function ProfessionalProfilePage({ params }: ProfilePageProps) {
    const { slug } = await params;

    // Fetch user with relations
    // Note: Adjust specific relations if schema slightly differs (e.g. certificates vs enrollments)
    const user = await prisma.user.findFirst({
        where: {
            isPublicDirectory: true,
            OR: [{ slug }, { id: slug }],
        },
        include: {
            certificates: {
                include: {
                    course: true,
                },
            },
            // Fallback to enrollments if certificates table is empty but courses are completed
            enrollments: {
                where: { status: "COMPLETED" },
                include: {
                    course: true,
                },
            },
        },
    });

    if (!user) {
        notFound();
    }

    const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || "AccrediPro Member";

    const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Deduplicate certificates/enrollments for display
    const credentials = [
        ...(user.certificates || []).map(c => ({
            id: c.id,
            title: c.course.title,
            date: c.issuedAt || c.createdAt,
            type: "Certificate",
            certNumber: c.certificateNumber
        })),
        ...(user.enrollments || []).map(e => ({
            id: e.id,
            title: e.course.title,
            date: e.completedAt || e.updatedAt,
            type: "Course Completion",
            certNumber: null
        }))
    ].filter((v, i, a) => a.findIndex(t => t.title === v.title) === i); // Uniq by title

    // Compute years of experience from createdAt
    const memberSince = user.createdAt;
    const yearsOfExperience = Math.max(1, Math.floor((Date.now() - new Date(memberSince).getTime()) / (365.25 * 24 * 60 * 60 * 1000)));

    // Generate services based on specialties
    const servicesOffered = [
        "Initial Health Assessment",
        "Personalized Wellness Protocol",
        "Follow-up Consultations",
        "Lab Test Interpretation",
        ...(user.specialties?.slice(0, 2).map(s => `${s} Coaching`) || [])
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ASI Header Bar */}
            <div className="bg-burgundy-900 text-white py-2">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-medium tracking-wide">AccrediPro Standards Institute — Verified Professional Directory</span>
                    </div>
                    <Link href="/professionals" className="text-xs text-gold-300 hover:text-gold-200">
                        ← Back to Directory
                    </Link>
                </div>
            </div>

            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* Avatar */}
                        <div className="relative">
                            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg ring-4 ring-gold-200">
                                <AvatarImage src={user.avatar || ""} alt={fullName} className="object-cover" />
                                <AvatarFallback className="bg-burgundy-900 text-gold-400 text-3xl font-bold font-serif">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 -right-3 bg-gold-400 text-burgundy-900 p-2 rounded-full border-4 border-white shadow-sm">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
                                    {fullName}
                                </h1>
                                {user.professionalTitle && (
                                    <Badge variant="secondary" className="bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-100 text-sm px-3 py-1">
                                        {user.professionalTitle}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                                {user.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gold-500" />
                                        {user.location}
                                    </div>
                                )}
                                {user.website && (
                                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-burgundy-600 transition-colors">
                                        <Globe className="w-4 h-4 text-gold-500" />
                                        Visit Website
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-gold-500" />
                                    ASI Verified Member
                                </div>
                            </div>

                            {/* Status */}
                            <div className="pt-2">
                                {user.acceptingClients !== false ? (
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Accepting New Clients
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
                                        Currently Fully Booked
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-burgundy-600 hover:bg-burgundy-700 gap-2 h-11 text-lg shadow-md">
                                <Mail className="w-4 h-4" />
                                Contact Professional
                            </Button>
                            {user.website && (
                                <Button variant="outline" className="w-full md:w-auto gap-2 border-gray-300">
                                    <ExternalLink className="w-4 h-4" />
                                    Book Consultation
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About */}
                        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold font-serif text-gray-900 mb-4 flex items-center gap-2">
                                About {user.firstName || "Me"}
                            </h2>
                            <div className="prose prose-burgundy max-w-none text-gray-600">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {user.bio || `${fullName} has not added a bio yet.`}
                                </p>
                            </div>
                        </section>

                        {/* Verification / Certificates */}
                        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Shield className="w-32 h-32" />
                            </div>
                            <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                                <Award className="w-5 h-5 text-gold-500" />
                                Verified Credentials
                            </h2>

                            {credentials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                    {credentials.map((cred) => (
                                        <div key={cred.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors group">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                                <Award className="w-6 h-6 text-gold-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-burgundy-700 transition-colors">{cred.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span className="bg-gold-100 text-burgundy-900 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Verified</span>
                                                    <span>•</span>
                                                    <span>{formatDateSafe(new Date(cred.date))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500 italic">
                                    No public credentials listed.
                                </div>
                            )}
                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* ASI Verification Seal */}
                        <Card className="p-6 bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white border-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gold-400/20 flex items-center justify-center border-2 border-gold-400">
                                        <Shield className="w-8 h-8 text-gold-400" />
                                    </div>
                                    <h3 className="text-lg font-bold font-serif text-gold-300">ASI Verified</h3>
                                    <p className="text-xs text-burgundy-200 uppercase tracking-widest mt-1">Accredited Professional</p>
                                </div>
                                <div className="space-y-2 text-sm border-t border-burgundy-700 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-burgundy-300">Member Since</span>
                                        <span className="text-white font-medium">{formatDateSafe(user.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-burgundy-300">Member ID</span>
                                        <span className="text-white font-mono text-xs">ASI-{user.id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-burgundy-300">Credentials</span>
                                        <span className="text-gold-400 font-medium">{credentials.length} Verified</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-burgundy-700 text-center">
                                    <Badge className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-bold text-xs uppercase tracking-wider">
                                        ✓ Identity Verified
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Specialties */}
                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center">
                                    <Award className="w-3.5 h-3.5 text-burgundy-600" />
                                </span>
                                Clinical Focus Areas
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.specialties && user.specialties.length > 0 ? (
                                    user.specialties.map((spec, i) => (
                                        <Badge key={i} variant="secondary" className="bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-700 font-medium py-1.5 px-3 border border-burgundy-200">
                                            {spec}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No specialties listed.</span>
                                )}
                            </div>
                        </Card>

                        {/* Professional Stats */}
                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center">
                                    <Calendar className="w-3.5 h-3.5 text-gold-600" />
                                </span>
                                Professional Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Years of Experience</span>
                                    <span className="font-bold text-burgundy-700">{yearsOfExperience}+ years</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Verified Credentials</span>
                                    <span className="font-bold text-burgundy-700">{credentials.length}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Consultation Type</span>
                                    <span className="font-bold text-green-600">Virtual & In-Person</span>
                                </div>
                            </div>
                        </Card>

                        {/* Services Offered */}
                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                </span>
                                Services Offered
                            </h3>
                            <ul className="space-y-2">
                                {servicesOffered.map((service, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {service}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {/* Availability Note */}
                        <Card className="p-6 bg-burgundy-900 text-white relative overflow-hidden border-none text-center">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <h3 className="font-bold font-serif text-lg mb-2 relative z-10">Interested in working with {user.firstName}?</h3>
                            <p className="text-burgundy-200 text-sm mb-4 relative z-10">
                                {user.acceptingClients !== false
                                    ? "Slots are currently available for new clients. Reach out to discuss your health goals."
                                    : "Currently working with a full roster. Check back later for availability."}
                            </p>
                            <Button variant="secondary" className="w-full bg-gold-400 text-burgundy-900 hover:bg-gold-300 border-none">
                                Send Inquiry
                            </Button>
                        </Card>

                    </div>

                </div>
            </div>
        </div>
    );
}
