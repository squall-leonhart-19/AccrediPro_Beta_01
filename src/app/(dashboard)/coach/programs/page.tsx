import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles, Star, ArrowRight } from "lucide-react";

const PROGRAMS = [
    { name: "21-Day Gut Reset Protocol", price: "$197", category: "Gut Health", icon: "🌿", popular: true },
    { name: "Hormone Balance Blueprint", price: "$247", category: "Hormone Health", icon: "⚖️", popular: false },
    { name: "Detox & Cleanse Program", price: "$147", category: "Detox", icon: "✨", popular: false },
    { name: "Stress & Adrenal Recovery", price: "$197", category: "Stress", icon: "🧘", popular: true },
    { name: "Weight Loss Transformation", price: "$297", category: "Weight Loss", icon: "🎯", popular: false },
    { name: "Sleep Optimization System", price: "$147", category: "Sleep", icon: "😴", popular: false },
    { name: "Autoimmune Protocol", price: "$297", category: "Autoimmune", icon: "🛡️", popular: true },
    { name: "Fertility Support Program", price: "$347", category: "Fertility", icon: "🌸", popular: false },
    { name: "Menopause Transition Guide", price: "$247", category: "Women's Health", icon: "🦋", popular: false },
];

export default async function CoachProgramsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-burgundy-100 text-burgundy-700 border border-burgundy-200 px-3 py-1">
                            Programs Library
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Done-For-You Programs</h1>
                    <p className="text-gray-500 text-lg">Professional protocols ready to use with your clients</p>
                </div>
                <Link href="/programs">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                        <ExternalLink className="w-4 h-4 mr-2" /> View Full Library
                    </Button>
                </Link>
            </div>

            {/* Programs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {PROGRAMS.map((program, i) => (
                    <div
                        key={i}
                        className="group relative bg-white p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-burgundy-200 transition-all duration-300"
                    >
                        {program.popular && (
                            <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-0 shadow">
                                <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                            </Badge>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
                                {program.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{program.name}</p>
                                <p className="text-sm text-gray-500">{program.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="text-xl font-bold text-burgundy-600">{program.price}</span>
                            <Link href="/programs">
                                <Button size="sm" variant="outline" className="text-burgundy-600 border-burgundy-200 hover:bg-burgundy-50">
                                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            <span className="text-amber-300 font-medium">Premium Access</span>
                        </div>
                        <h3 className="font-bold text-2xl mb-2">Unlock All 50+ Programs</h3>
                        <p className="text-white/80">
                            Get instant access to our complete library of done-for-you client programs,
                            including worksheets, meal plans, and supplement guides.
                        </p>
                    </div>
                    <Link href="/programs">
                        <Button className="bg-white text-burgundy-700 hover:bg-gray-100 font-semibold px-8">
                            Browse All Programs <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
