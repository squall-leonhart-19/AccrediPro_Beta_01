"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    FolderOpen,
    Download,
    Search,
    FileText,
    Utensils,
    ClipboardList,
    Users,
    Briefcase,
    Share2,
    BookOpen,
    Filter,
    ExternalLink,
} from "lucide-react";

interface ResourceFile {
    id: string;
    name: string;
    url: string;
    fileType: string;
    size: number | null;
}

interface Resource {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    category: string;
    accessLevel: string;
    downloadCount: number;
    files: ResourceFile[];
}

interface ResourcesClientProps {
    resources: Resource[];
}

const CATEGORIES = [
    { value: "ALL", label: "All Resources", icon: FolderOpen },
    { value: "COACHING_PROGRAM", label: "Coaching Programs", icon: BookOpen },
    { value: "MEAL_PLAN", label: "Meal Plans", icon: Utensils },
    { value: "PROTOCOL", label: "Protocols", icon: ClipboardList },
    { value: "CLIENT_MATERIALS", label: "Client Materials", icon: Users },
    { value: "BUSINESS_TEMPLATES", label: "Business Templates", icon: Briefcase },
    { value: "SOCIAL_MEDIA", label: "Social Media", icon: Share2 },
    { value: "WORKSHEETS", label: "Worksheets", icon: FileText },
];

const CATEGORY_COLORS: Record<string, string> = {
    COACHING_PROGRAM: "bg-purple-100 text-purple-700 border-purple-200",
    MEAL_PLAN: "bg-green-100 text-green-700 border-green-200",
    PROTOCOL: "bg-blue-100 text-blue-700 border-blue-200",
    CLIENT_MATERIALS: "bg-orange-100 text-orange-700 border-orange-200",
    BUSINESS_TEMPLATES: "bg-pink-100 text-pink-700 border-pink-200",
    SOCIAL_MEDIA: "bg-cyan-100 text-cyan-700 border-cyan-200",
    WORKSHEETS: "bg-yellow-100 text-yellow-700 border-yellow-200",
    OTHER: "bg-gray-100 text-gray-700 border-gray-200",
};

export function ResourcesClient({ resources }: ResourcesClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResources = resources.filter((resource) => {
        const matchesCategory =
            selectedCategory === "ALL" || resource.category === selectedCategory;
        const matchesSearch =
            !searchQuery ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDownload = async (resource: Resource, file: ResourceFile) => {
        // Track download
        await fetch("/api/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resourceId: resource.id }),
        });
        // Open file
        window.open(file.url, "_blank");
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">DFY Resources</h1>
                        <p className="text-gray-500">Done-for-you templates & materials</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.value;
                    return (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-burgundy-600 text-white shadow-md"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-burgundy-200 hover:bg-burgundy-50"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                    <div
                        key={resource.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-burgundy-100 transition-all overflow-hidden group"
                    >
                        {/* Thumbnail */}
                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                            {resource.thumbnail ? (
                                <img
                                    src={resource.thumbnail}
                                    alt={resource.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FileText className="w-16 h-16 text-gray-300" />
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Badge className={cn("text-xs", CATEGORY_COLORS[resource.category])}>
                                    {resource.category.replace(/_/g, " ")}
                                </Badge>
                                {resource.accessLevel !== "FREE" && (
                                    <Badge variant="outline" className="text-xs">
                                        {resource.accessLevel}
                                    </Badge>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-burgundy-700 transition-colors">
                                {resource.title}
                            </h3>

                            {resource.description && (
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {resource.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    {resource.downloadCount} downloads
                                </span>
                                <div className="flex gap-2">
                                    {resource.files.slice(0, 2).map((file) => (
                                        <Button
                                            key={file.id}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDownload(resource, file)}
                                            className="gap-1 text-xs"
                                        >
                                            <Download className="w-3 h-3" />
                                            {file.fileType.toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Resources Found</h3>
                    <p className="text-gray-500">
                        {searchQuery
                            ? "Try adjusting your search"
                            : "Resources will appear here when available"}
                    </p>
                </div>
            )}
        </div>
    );
}
