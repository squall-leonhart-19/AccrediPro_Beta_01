"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Download,
    ExternalLink,
    BookOpen,
    Video,
    Headphones,
    FileSpreadsheet,
} from "lucide-react";

// Resource categories
const RESOURCE_CATEGORIES = [
    {
        id: "guides",
        title: "Study Guides",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-600",
        resources: [
            { title: "FM Certification Study Guide", type: "PDF", size: "2.4 MB" },
            { title: "Exam Preparation Checklist", type: "PDF", size: "156 KB" },
            { title: "Quick Reference Cards", type: "PDF", size: "890 KB" },
        ],
    },
    {
        id: "templates",
        title: "Practice Templates",
        icon: FileSpreadsheet,
        color: "bg-green-100 text-green-600",
        resources: [
            { title: "Client Intake Form Template", type: "DOCX", size: "45 KB" },
            { title: "Health History Questionnaire", type: "PDF", size: "320 KB" },
            { title: "Session Notes Template", type: "DOCX", size: "28 KB" },
        ],
    },
    {
        id: "recordings",
        title: "Masterclass Recordings",
        icon: Video,
        color: "bg-purple-100 text-purple-600",
        resources: [
            { title: "Building Your Practice", type: "Video", duration: "45 min" },
            { title: "Client Communication Mastery", type: "Video", duration: "32 min" },
            { title: "Marketing for Practitioners", type: "Video", duration: "58 min" },
        ],
    },
    {
        id: "audio",
        title: "Audio Resources",
        icon: Headphones,
        color: "bg-orange-100 text-orange-600",
        resources: [
            { title: "Meditation for Practitioners", type: "Audio", duration: "15 min" },
            { title: "Weekly Motivation", type: "Podcast", duration: "25 min" },
        ],
    },
];

export function ResourcesTab() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Learning Resources</h2>
                    <p className="text-sm text-gray-500">
                        Downloadable guides, templates, and bonus content for your certification journey.
                    </p>
                </div>
                <Badge className="bg-burgundy-100 text-burgundy-700 border-0">
                    {RESOURCE_CATEGORIES.reduce((acc, cat) => acc + cat.resources.length, 0)} Resources
                </Badge>
            </div>

            {/* Resource Categories */}
            <div className="grid gap-6 md:grid-cols-2">
                {RESOURCE_CATEGORIES.map((category) => (
                    <Card key={category.id} className="overflow-hidden">
                        <div className={`px-4 py-3 ${category.color} border-b`}>
                            <div className="flex items-center gap-2">
                                <category.icon className="w-5 h-5" />
                                <h3 className="font-semibold">{category.title}</h3>
                                <Badge variant="outline" className="ml-auto text-xs">
                                    {category.resources.length}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {category.resources.map((resource, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {resource.type} • {'size' in resource ? resource.size : resource.duration}
                                                </p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Coming Soon Banner */}
            <Card className="bg-gradient-to-r from-burgundy-50 to-gold-50 border-burgundy-100">
                <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-burgundy-800 mb-2">
                        More Resources Coming Soon! 📚
                    </h3>
                    <p className="text-sm text-burgundy-600 mb-4">
                        We're constantly adding new study materials, templates, and exclusive content for our students.
                    </p>
                    <Link href="/messages">
                        <Button variant="outline" className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-100">
                            Request a Resource
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
