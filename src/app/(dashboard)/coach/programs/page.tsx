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
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a0c] via-[#2d1216] to-[#1a0a0c] p-4 lg:p-8">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#722f37]/20 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#d4af37]/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] shadow-lg shadow-[#d4af37]/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-3 py-1">
                                Programs Library
                            </Badge>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Done-For-You Programs</h1>
                        <p className="text-white/60 text-lg">Professional protocols ready to use with your clients</p>
                    </div>
                    <Link href="/programs">
                        <Button className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0 shadow-lg shadow-[#722f37]/25">
                            <ExternalLink className="w-4 h-4 mr-2" /> View Full Library
                        </Button>
                    </Link>
                </div>

                {/* Programs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {PROGRAMS.map((program, i) => (
                        <div
                            key={i}
                            className="group relative bg-white/5 backdrop-blur-xl p-6 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300"
                        >
                            {program.popular && (
                                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-white border-0 shadow-lg shadow-[#d4af37]/25">
                                    <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                                </Badge>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl">
                                    {program.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{program.name}</p>
                                    <p className="text-sm text-white/50">{program.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                <span className="text-xl font-bold text-[#d4af37]">{program.price}</span>
                                <Link href="/programs">
                                    <Button size="sm" variant="outline" className="text-[#d4af37] border-[#d4af37]/30 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 bg-transparent">
                                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#722f37] via-[#8b3a44] to-[#722f37] rounded-2xl p-8 text-white">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/20 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4af37]/10 blur-3xl rounded-full" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                                <span className="text-[#d4af37] font-medium">Premium Access</span>
                            </div>
                            <h3 className="font-bold text-2xl mb-2">Unlock All 50+ Programs</h3>
                            <p className="text-white/70">
                                Get instant access to our complete library of done-for-you client programs,
                                including worksheets, meal plans, and supplement guides.
                            </p>
                        </div>
                        <Link href="/programs">
                            <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e8c547] hover:to-[#d4af37] text-[#1a0a0c] font-semibold px-8 shadow-lg shadow-[#d4af37]/25">
                                Browse All Programs <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
