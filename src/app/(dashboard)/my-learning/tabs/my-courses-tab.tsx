"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Play,
    CheckCircle,
    Clock,
    BookOpen,
    Award,
    ArrowRight,
} from "lucide-react";

interface Enrollment {
    id: string;
    status: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    course: {
        id: string;
        slug: string;
        title: string;
        thumbnail: string | null;
        category: { name: string; color: string | null } | null;
    };
}

interface MyCoursesTabProps {
    enrollments: Enrollment[];
}

export function MyCoursesTab({ enrollments }: MyCoursesTabProps) {
    const inProgress = enrollments.filter(e => e.status === "ACTIVE");
    const completed = enrollments.filter(e => e.status === "COMPLETED");

    if (enrollments.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-4">Browse our catalog to find your first certification.</p>
                <Link href="/catalog">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                        Explore Catalog
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* In Progress Section */}
            {inProgress.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        In Progress ({inProgress.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {inProgress.map((enrollment) => (
                            <CourseCard key={enrollment.id} enrollment={enrollment} />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Section */}
            {completed.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Completed ({completed.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completed.map((enrollment) => (
                            <CourseCard key={enrollment.id} enrollment={enrollment} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CourseCard({ enrollment }: { enrollment: Enrollment }) {
    const isCompleted = enrollment.status === "COMPLETED";

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Course Thumbnail */}
            <div className="relative h-32 bg-gradient-to-br from-burgundy-100 to-burgundy-50">
                {enrollment.course.thumbnail && (
                    <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Category Badge */}
                {enrollment.course.category && (
                    <Badge
                        className="absolute top-2 left-2 text-xs"
                        style={{
                            backgroundColor: enrollment.course.category.color || '#6b21a8',
                            color: 'white'
                        }}
                    >
                        {enrollment.course.category.name}
                    </Badge>
                )}
                {/* Status Badge */}
                <Badge
                    className={`absolute top-2 right-2 text-xs ${isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                >
                    {isCompleted ? (
                        <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                        </>
                    ) : (
                        <>
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                        </>
                    )}
                </Badge>
            </div>

            <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {enrollment.course.title}
                </h4>

                {/* Progress */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{enrollment.completedLessons}/{enrollment.totalLessons} Lessons</span>
                        <span>{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                </div>

                {/* Action Button */}
                <Link href={`/courses/${enrollment.course.slug}`}>
                    <Button
                        className={`w-full ${isCompleted
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-burgundy-600 hover:bg-burgundy-700 text-white'
                            }`}
                        size="sm"
                    >
                        {isCompleted ? (
                            <>
                                <Award className="w-4 h-4 mr-2" />
                                View Certificate
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Continue Learning
                            </>
                        )}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
