"use client";

import Link from "next/link";
import { Sparkles, Users, Star, Shield, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CatalogHeaderVariant2() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <p className="text-center text-gray-500 mb-4">VARIANT 2: Horizontal Single Row</p>

            {/* Header Variant 2 - Ultra compact single row */}
            <div className="relative bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 rounded-xl overflow-hidden">
                <div className="relative z-10 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Icon + Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gold-400/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-gold-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Build Your Career</h1>
                                <p className="text-xs text-burgundy-200">Health & Wellness Certifications</p>
                            </div>
                        </div>

                        {/* Center: Stats as pills */}
                        <div className="hidden md:flex items-center gap-2">
                            <Badge className="bg-white/10 text-white border-0 px-3 py-1">
                                <Users className="w-3 h-3 mr-1.5 text-gold-400" />
                                3,370+ Students
                            </Badge>
                            <Badge className="bg-white/10 text-white border-0 px-3 py-1">
                                <Star className="w-3 h-3 mr-1.5 text-gold-400 fill-gold-400" />
                                5.0 • 1,344+ Reviews
                            </Badge>
                            <Badge className="bg-white/10 text-white border-0 px-3 py-1">
                                <Shield className="w-3 h-3 mr-1.5 text-gold-400" />
                                Accredited
                            </Badge>
                        </div>

                        {/* Right: CTA */}
                        <Link href="/roadmap">
                            <Button size="sm" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold">
                                <Target className="w-4 h-4 mr-1" />
                                View Roadmap
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center space-x-4">
                <Link href="/catalog-v1"><Button variant="outline">View Variant 1</Button></Link>
                <Link href="/catalog-v5"><Button variant="outline">View Variant 5</Button></Link>
                <Link href="/catalog"><Button className="bg-burgundy-600">Back to Current</Button></Link>
            </div>
        </div>
    );
}
