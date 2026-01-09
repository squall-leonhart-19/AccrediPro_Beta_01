"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    BookOpen,
    GraduationCap,
    Play,
    ShoppingBag,
    MessageCircle,
    Award,
    Lock,
    TrendingUp,
    Clock,
    Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
    description: string | null;
    shortDescription: string | null;
    price: number | null;
    isFree: boolean;
    isFeatured: boolean;
    duration: number | null;
    certificateType: string | null;
}

interface Enrollment {
    courseId: string;
    progress: number;
    status: string;
}

interface CoursesClientProps {
    courses: Course[];
    enrollments: Enrollment[];
}

// Fallback thumbnail for courses without images
const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop";

export function CoursesClient({ courses, enrollments }: CoursesClientProps) {
    const [activeTab, setActiveTab] = useState("my-courses");

    // Split courses into enrolled vs available
    const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

    const enrolledCourses = courses.filter(c => enrolledCourseIds.has(c.id));
    const availableCourses = courses.filter(c => !enrolledCourseIds.has(c.id));

    // Get enrollment progress for a course
    const getProgress = (courseId: string) => {
        const enrollment = enrollments.find(e => e.courseId === courseId);
        return enrollment?.progress || 0;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                <p className="text-gray-600">
                    Your enrolled certifications and available programs
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="my-courses" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        My Courses
                        {enrolledCourses.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                {enrolledCourses.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="browse" className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Browse More
                        {availableCourses.length > 0 && (
                            <Badge variant="outline" className="ml-1 h-5 px-1.5 text-xs">
                                {availableCourses.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* MY COURSES TAB */}
                <TabsContent value="my-courses" className="mt-0">
                    {enrolledCourses.length === 0 ? (
                        <Card className="p-8 text-center border-dashed">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-burgundy-100 flex items-center justify-center">
                                    <GraduationCap className="w-8 h-8 text-burgundy-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">No courses yet</h3>
                                    <p className="text-gray-600 mt-1">
                                        Start your certification journey today!
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setActiveTab("browse")}
                                    className="mt-2 bg-burgundy-600 hover:bg-burgundy-700"
                                >
                                    Browse Certifications
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course) => {
                                const progress = getProgress(course.id);
                                return (
                                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-emerald-100">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gray-100">
                                            <Image
                                                src={course.thumbnail || DEFAULT_THUMBNAIL}
                                                alt={course.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Progress overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                <div className="flex items-center justify-between text-white text-sm mb-1">
                                                    <span>{progress}% complete</span>
                                                    {progress === 100 && (
                                                        <Badge className="bg-emerald-500 text-white">
                                                            <Award className="w-3 h-3 mr-1" />
                                                            Completed
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Progress value={progress} className="h-2 bg-white/30" />
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            {/* Course Type Badge */}
                                            {course.certificateType && (
                                                <Badge variant="outline" className="mb-2 text-emerald-700 border-emerald-300 bg-emerald-50">
                                                    <GraduationCap className="w-3 h-3 mr-1" />
                                                    {course.certificateType.replace(/_/g, ' ')}
                                                </Badge>
                                            )}

                                            {/* Title */}
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                                                {course.title}
                                            </h3>

                                            {/* Duration */}
                                            {course.duration && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                                                    <Clock className="w-4 h-4" />
                                                    {course.duration} hours
                                                </p>
                                            )}

                                            {/* CTA */}
                                            <Link href={`/learning/${course.slug}`}>
                                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    {progress === 0 ? "Start Learning" : progress === 100 ? "Review Course" : "Continue Learning"}
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {/* BROWSE MORE TAB */}
                <TabsContent value="browse" className="mt-0">
                    {availableCourses.length === 0 ? (
                        <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Star className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">You have access to all courses!</h3>
                                    <p className="text-gray-600 mt-1">
                                        Amazing! You're enrolled in our complete catalog.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <>
                            {/* Upgrade CTA Banner */}
                            <Card className="mb-6 p-5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 border-0 text-white">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Ready to advance your career?</h3>
                                            <p className="text-burgundy-200 text-sm">
                                                Talk with Coach Sarah to find the right certification for you
                                            </p>
                                        </div>
                                    </div>
                                    <Link href="/coach-sarah">
                                        <Button className="bg-white text-burgundy-700 hover:bg-burgundy-50 whitespace-nowrap">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Talk with Sarah
                                        </Button>
                                    </Link>
                                </div>
                            </Card>

                            {/* Available Courses Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availableCourses.map((course) => (
                                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gray-100">
                                            <Image
                                                src={course.thumbnail || DEFAULT_THUMBNAIL}
                                                alt={course.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {course.isFeatured && (
                                                <Badge className="absolute top-2 right-2 bg-gold-400 text-burgundy-900">
                                                    Featured
                                                </Badge>
                                            )}
                                            {/* Locked overlay */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <div className="bg-white rounded-full p-3">
                                                    <Lock className="w-6 h-6 text-burgundy-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            {/* Course Type Badge */}
                                            {course.certificateType && (
                                                <Badge variant="outline" className="mb-2 text-burgundy-700 border-burgundy-300 bg-burgundy-50">
                                                    <GraduationCap className="w-3 h-3 mr-1" />
                                                    {course.certificateType.replace(/_/g, ' ')}
                                                </Badge>
                                            )}

                                            {/* Title */}
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                                                {course.title}
                                            </h3>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 mb-3">
                                                {course.isFree ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700">Free</Badge>
                                                ) : course.price ? (
                                                    <span className="font-bold text-burgundy-700">${course.price}</span>
                                                ) : (
                                                    <span className="text-gray-500">Contact for pricing</span>
                                                )}
                                            </div>

                                            {/* CTA - Talk with Sarah */}
                                            <Link href="/coach-sarah">
                                                <Button variant="outline" className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50">
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Talk with Sarah
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
