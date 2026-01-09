"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Users,
    Clock,
    Star,
    ArrowRight,
} from "lucide-react";
import { useState } from "react";

interface Course {
    id: string;
    slug: string;
    title: string;
    thumbnail: string | null;
    category: { name: string; color: string | null } | null;
    _count: { enrollments: number };
}

interface CatalogTabProps {
    courses: Course[];
}

export function CatalogTab({ courses }: CatalogTabProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Get unique categories
    const categories = Array.from(
        new Set(courses.map(c => c.category?.name).filter(Boolean))
    ) as string[];

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || course.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search certifications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={selectedCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                        className={selectedCategory === null ? "bg-burgundy-600" : ""}
                    >
                        All
                    </Button>
                    {categories.slice(0, 4).map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className={selectedCategory === cat ? "bg-burgundy-600" : ""}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <CatalogCourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CatalogCourseCard({ course }: { course: Course }) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Thumbnail */}
            <div className="relative h-36 bg-gradient-to-br from-burgundy-100 to-burgundy-50">
                {course.thumbnail && (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                )}
                {course.category && (
                    <Badge
                        className="absolute top-2 left-2 text-xs"
                        style={{
                            backgroundColor: course.category.color || '#6b21a8',
                            color: 'white'
                        }}
                    >
                        {course.category.name}
                    </Badge>
                )}
            </div>

            <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-burgundy-600 transition-colors">
                    {course.title}
                </h4>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course._count.enrollments.toLocaleString()} enrolled
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                        4.9
                    </span>
                </div>

                {/* CTA */}
                <Link href={`/courses/${course.slug}`}>
                    <Button
                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white"
                        size="sm"
                    >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
