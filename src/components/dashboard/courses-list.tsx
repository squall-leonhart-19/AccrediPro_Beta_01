"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronRight } from "lucide-react";

interface Enrollment {
    id: string;
    status: string;
    progress: number;
    course: {
        slug: string;
        title: string;
    };
}

interface CoursesListProps {
    enrollments: Enrollment[];
}

export function CoursesList({ enrollments }: CoursesListProps) {
    if (enrollments.length === 0) {
        return (
            <Card className="card-premium">
                <CardContent className="p-8 sm:p-10 text-center">
                    <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-burgundy-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Start your certification journey today</p>
                    <Link href="/my-personal-roadmap-by-coach-sarah">
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">View Roadmap</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-600" />
                        Your Courses
                    </h2>
                    <Link href="/my-courses">
                        <Button variant="ghost" size="sm" className="text-burgundy-600 text-xs sm:text-sm">
                            View All <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {/* Show 2 courses on mobile, 3 on desktop */}
                    {enrollments.slice(0, 3).map((enrollment, index) => {
                        const courseTitle = enrollment.course.title.toLowerCase();
                        const isCertification = courseTitle.includes("certification");
                        const stepLabel = isCertification ? "CERTIFICATION" : "TRAINING";

                        return (
                            <Link
                                key={enrollment.id}
                                href={`/courses/${enrollment.course.slug}`}
                                className={index >= 2 ? 'hidden sm:block' : ''}
                            >
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 border border-transparent hover:border-burgundy-100 transition-all group">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="text-[10px] sm:text-xs border-0 bg-burgundy-100 text-burgundy-700">
                                                {stepLabel}
                                            </Badge>
                                            {enrollment.status === "COMPLETED" && (
                                                <Badge className="bg-green-100 text-green-700 border-0 text-[10px] sm:text-xs">✓ Done</Badge>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-gray-900 truncate text-sm">
                                            {enrollment.course.title}
                                        </h3>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <Progress value={enrollment.progress} className="h-1.5 flex-1" />
                                            <span className="text-xs font-semibold text-burgundy-600">
                                                {Math.round(enrollment.progress)}%
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-burgundy-500 flex-shrink-0" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
