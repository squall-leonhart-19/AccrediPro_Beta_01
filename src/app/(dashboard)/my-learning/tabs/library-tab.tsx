"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    ExternalLink,
    BookMarked,
    Sparkles,
} from "lucide-react";

// This tab links to the full /my-library page with 5,351 lines of ebook content
export function LibraryTab() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Your Library</h2>
                    <p className="text-sm text-gray-500">
                        Premium ebooks, guides, and reference materials included with your certification.
                    </p>
                </div>
                <Link href="/my-library">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                        Open Full Library
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Featured Ebooks Preview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-burgundy-100 to-burgundy-50 flex items-center justify-center">
                        <BookMarked className="w-12 h-12 text-burgundy-300" />
                    </div>
                    <CardContent className="p-4">
                        <Badge className="bg-gold-100 text-gold-700 border-0 mb-2">BESTSELLER</Badge>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                            The Practitioner Reality Playbook
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            What they don't teach in certification programs
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                        <BookMarked className="w-12 h-12 text-emerald-300" />
                    </div>
                    <CardContent className="p-4">
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-2">CLINICAL</Badge>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                            Clinical Case Walkthroughs
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            10 real cases from start to resolution
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <BookMarked className="w-12 h-12 text-blue-300" />
                    </div>
                    <CardContent className="p-4">
                        <Badge className="bg-blue-100 text-blue-700 border-0 mb-2">ESSENTIAL</Badge>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                            Scope of Practice & Ethics Guide
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Protecting yourself while helping clients
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* CTA to full library */}
            <Card className="bg-gradient-to-r from-burgundy-50 to-gold-50 border-burgundy-100">
                <CardContent className="p-6 text-center">
                    <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-burgundy-800 mb-2">
                        Your Complete Library Awaits
                    </h3>
                    <p className="text-sm text-burgundy-600 mb-4">
                        Access 12+ premium ebooks, clinical guides, and reference materials.
                    </p>
                    <Link href="/my-library">
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Open Library
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
