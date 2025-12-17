"use client";

import Link from "next/link";
import { Sparkles, Users, Star, Shield, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CatalogHeaderVariant5() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <p className="text-center text-gray-500 mb-4">VARIANT 5: Frosted Glass Stats</p>

            {/* Header Variant 5 - Frosted glass card on right */}
            <div className="relative bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-500 rounded-full blur-2xl" />
                </div>

                <div className="relative z-10 p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left: Badge + Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400/30 to-gold-500/20 flex items-center justify-center border border-gold-400/30">
                                <Sparkles className="w-5 h-5 text-gold-400" />
                            </div>
                            <div>
                                <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-[10px] mb-1">
                                    Accredited Training
                                </Badge>
                                <h1 className="text-xl font-bold text-white">Health & Wellness Certifications</h1>
                            </div>
                        </div>

                        {/* Right: Frosted glass stats + CTA */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1.5 text-white">
                                        <Users className="w-3.5 h-3.5 text-gold-400" />
                                        <span className="font-semibold">3,370+</span>
                                        <span className="text-burgundy-200 text-xs">Students</span>
                                    </span>
                                    <span className="text-burgundy-400">•</span>
                                    <span className="flex items-center gap-1.5 text-white">
                                        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                                        <span className="font-semibold">5.0</span>
                                        <span className="text-burgundy-200 text-xs">1,344+ Reviews</span>
                                    </span>
                                    <span className="text-burgundy-400">•</span>
                                    <span className="flex items-center gap-1.5 text-white">
                                        <Shield className="w-3.5 h-3.5 text-gold-400" />
                                        <span className="font-semibold text-xs">Accredited</span>
                                    </span>
                                </div>
                            </div>
                            <Link href="/roadmap">
                                <Button size="sm" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold h-10">
                                    <Target className="w-4 h-4 mr-1" />
                                    Roadmap
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center space-x-4">
                <Link href="/catalog-v1"><Button variant="outline">View Variant 1</Button></Link>
                <Link href="/catalog-v2"><Button variant="outline">View Variant 2</Button></Link>
                <Link href="/catalog"><Button className="bg-burgundy-600">Back to Current</Button></Link>
            </div>
        </div>
    );
}
