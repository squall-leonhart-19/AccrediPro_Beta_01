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
    Activity,
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
    const inProgress = enrollments.filter(e => e.status === "ACTIVE" || e.status === "NOT_STARTED");
    const completed = enrollments.filter(e => e.status === "COMPLETED");

    // Calculate most recently accessed for Resume
    const lastAccessed = [...enrollments]
        .sort((a, b) => {
            // Sort by lastAccessedAt if available, otherwise fallback (simple sort here)
            // Ideally we need lastAccessedAt in the type, but for now we assume API order or use progress
            return b.progress - a.progress;
        })[0];

    const userFirstName = "Student"; // Would ideally come from session/props

    if (enrollments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                    <BookOpen className="w-12 h-12 text-burgundy-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Your Learning Journey Begins Here</h3>
                <p className="text-gray-500 max-w-md mb-8 text-lg">
                    You haven't enrolled in any courses yet. Explore our catalog to find your first certification and start your career transformation.
                </p>
                <Link href="/catalog">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                        Explore Catalog <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Hero / Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-burgundy-900 to-burgundy-800 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        Welcome back to your studies
                    </h2>
                    <p className="text-burgundy-100 text-lg max-w-2xl mb-8">
                        Continue where you left off and keep building your momentum. You're on the path to mastery.
                    </p>

                    {/* Quick Resume for Top Course */}
                    {lastAccessed && lastAccessed.status !== "COMPLETED" && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl max-w-3xl hover:bg-white/15 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-amber-300 text-sm font-medium mb-2">
                                        <Clock className="w-4 h-4" /> Resuming
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{lastAccessed.course.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-burgundy-100 mb-3">
                                        <span>{lastAccessed.completedLessons} of {lastAccessed.totalLessons} Lessons</span>
                                        <span>•</span>
                                        <span>{lastAccessed.progress}% Complete</span>
                                    </div>
                                    <Progress value={lastAccessed.progress} className="h-2 bg-white/20" />
                                    {/* Override progress indicator color if possible, else standard */}
                                </div>
                                <Link href={`/courses/${lastAccessed.course.slug}`}>
                                    <Button className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg">
                                        <Play className="w-4 h-4 mr-2 fill-current" /> Resume Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* In Progress Section */}
            {inProgress.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-burgundy-600" />
                            Current Courses
                        </h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {inProgress.map((enrollment) => (
                            <CourseCard key={enrollment.id} enrollment={enrollment} variant="active" />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Section */}
            {completed.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                            <Award className="w-6 h-6 text-green-600" />
                            Certifications Earned
                        </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {completed.map((enrollment) => (
                            <CourseCard key={enrollment.id} enrollment={enrollment} variant="completed" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CourseCard({ enrollment, variant }: { enrollment: Enrollment, variant: "active" | "completed" }) {
    const isCompleted = variant === "completed";

    return (
        <Card className="group overflow-hidden border-gray-100 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Course Thumbnail */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                {enrollment.course.thumbnail ? (
                    <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <BookOpen className="w-12 h-12 opacity-50" />
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Category Badge */}
                {enrollment.course.category && (
                    <Badge
                        className="absolute top-4 left-4 text-xs font-semibold shadow-sm border-none backdrop-blur-md"
                        style={{
                            backgroundColor: enrollment.course.category.color || '#6b21a8',
                            color: 'white'
                        }}
                    >
                        {enrollment.course.category.name}
                    </Badge>
                )}

                {/* Status Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    {isCompleted ? (
                        <div className="flex items-center gap-2 text-green-300 font-medium">
                            <CheckCircle className="w-4 h-4" /> Completed
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-medium text-white/90">
                                <span>{enrollment.progress}% Complete</span>
                                <span>{enrollment.completedLessons}/{enrollment.totalLessons} Lessons</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-1.5 bg-white/30" />
                        </div>
                    )}
                </div>
            </div>

            <CardContent className="p-6">
                <h4 className="text-lg font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-burgundy-700 transition-colors height-[3.5rem]">
                    {enrollment.course.title}
                </h4>

                {/* Action Button */}
                <Link href={`/courses/${enrollment.course.slug}`} className="block mt-auto">
                    <Button
                        className={`w-full group-hover:translate-x-1 transition-all ${isCompleted
                            ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                            : 'bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-md hover:shadow-lg'
                            }`}
                        variant={isCompleted ? "outline" : "default"}
                    >
                        {isCompleted ? (
                            <>
                                <Award className="w-4 h-4 mr-2" />
                                View Certificate
                            </>
                        ) : (
                            <>
                                Continue Learning
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
