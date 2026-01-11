import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProfessionalCard } from "@/components/directory/professional-card";
import { DirectorySearch } from "@/components/directory/directory-search";
import { Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Find a Professional | AccrediPro Standards Institute",
    description: "Connect with verified functional medicine practitioners and certified coaches.",
};

// Force dynamic rendering since we depend on searchParams
export const dynamic = "force-dynamic";

interface ProfessionalsPageProps {
    searchParams: Promise<{
        q?: string;
        loc?: string;
    }>;
}

export default async function ProfessionalsPage({ searchParams }: ProfessionalsPageProps) {
    const params = await searchParams;
    const query = params.q || "";
    const location = params.loc || "";

    // Build Prisma Where Clause
    const where: any = {
        isPublicDirectory: true,
    };

    if (query) {
        where.AND = [
            {
                OR: [
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                    { bio: { contains: query, mode: "insensitive" } },
                    { professionalTitle: { contains: query, mode: "insensitive" } },
                    // Specialties search is tricky with case sensitivity in arrays, skipping for now or exact match
                    { specialties: { has: query } },
                ],
            },
        ];
    }

    if (location) {
        if (!where.AND) where.AND = [];
        where.AND.push({
            location: { contains: location, mode: "insensitive" },
        });
    }

    const professionals = await prisma.user.findMany({
        where,
        take: 50, // Limit for MVP
        orderBy: {
            createdAt: "desc", // Newest first? Or randomize? Newest is fine for now.
        },
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-burgundy-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm animate-fade-in">
                        <Users className="w-6 h-6 text-gold-400 mr-2" />
                        <span className="text-gold-100 font-medium tracking-wide text-sm uppercase">Official Directory</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
                        Find Your <span className="text-gold-400 italic">Expert</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Connect with verified graduates of the AccrediPro Standards Institute.
                        Discover holistic practitioners tailored to your health journey.
                    </p>
                </div>

                {/* Decorative bottom wave or border could go here */}
                <div className="h-2 bg-gold-500 w-full absolute bottom-0"></div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">

                {/* Search Component */}
                <DirectorySearch />

                {/* Results Grid */}
                <div className="mt-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 font-serif">
                            Verified Professionals
                            <span className="ml-3 text-sm font-sans font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {professionals.length} Result{professionals.length !== 1 ? 's' : ''}
                            </span>
                        </h2>
                    </div>

                    {professionals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {professionals.map((pro) => (
                                <ProfessionalCard key={pro.id} professional={pro} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                            <div className="bg-white mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Users className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                We couldn't find any matches for your search. Try adjusting your keywords or location filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
