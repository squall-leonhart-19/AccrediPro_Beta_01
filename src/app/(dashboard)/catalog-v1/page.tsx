"use client";

import Link from "next/link";
import { Sparkles, Users, Star, Shield, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CatalogHeaderVariant1() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <p className="text-center text-gray-500 mb-4">VARIANT 1: Classic Two-Column</p>

            {/* Header Variant 1 */}
            <div className="relative bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gold-400/20 backdrop-blur-sm flex items-center justify-center border border-gold-400/30">
                                <Sparkles className="w-6 h-6 text-gold-400" />
                            </div>
                            <div>
                                <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-1">
                                    Accredited Professional Training
                                </Badge>
                                <h1 className="text-2xl font-bold text-white">Course Catalog</h1>
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Users className="w-4 h-4 text-gold-400" />
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">3,370+</p>
                                    <p className="text-[10px] text-burgundy-200">Students</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">5.0/5.0</p>
                                    <p className="text-[10px] text-burgundy-200">1,344+ Reviews</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Shield className="w-4 h-4 text-gold-400" />
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">Accredited</p>
                                    <p className="text-[10px] text-burgundy-200">Certifications</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center space-x-4">
                <Link href="/catalog-v2"><Button variant="outline">View Variant 2</Button></Link>
                <Link href="/catalog-v5"><Button variant="outline">View Variant 5</Button></Link>
                <Link href="/catalog"><Button className="bg-burgundy-600">Back to Current</Button></Link>
            </div>
        </div>
    );
}
