import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

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
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Done-For-You Programs</h1>
                    <p className="text-gray-500">Professional protocols ready to use with your clients</p>
                </div>
                <Link href="/programs">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                        <ExternalLink className="w-4 h-4 mr-2" /> View Full Library
                    </Button>
                </Link>
            </div>

            {/* Programs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {PROGRAMS.map((program, i) => (
                    <div
                        key={i}
                        className="relative bg-white p-6 border border-gray-200 rounded-2xl hover:border-burgundy-200 hover:shadow-lg transition-all"
                    >
                        {program.popular && (
                            <Badge className="absolute top-4 right-4 bg-gold-500 text-white border-0">Popular</Badge>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-4xl">{program.icon}</span>
                            <div>
                                <p className="font-semibold text-gray-900">{program.name}</p>
                                <p className="text-sm text-gray-500">{program.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="text-xl font-bold text-burgundy-600">{program.price}</span>
                            <Link href="/programs">
                                <Button size="sm" variant="outline" className="text-burgundy-600 border-burgundy-200 hover:bg-burgundy-50">
                                    View Details
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
                        <h3 className="font-bold text-2xl mb-2">Unlock All 50+ Programs</h3>
                        <p className="text-burgundy-200">
                            Get instant access to our complete library of done-for-you client programs,
                            including worksheets, meal plans, and supplement guides.
                        </p>
                    </div>
                    <Link href="/programs">
                        <Button className="bg-white text-burgundy-700 hover:bg-gold-50 font-semibold px-8">
                            Browse All Programs →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
