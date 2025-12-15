import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Lock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

async function getResourcesData(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  resources: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return { enrollments };
}

const resourceTypeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  SPREADSHEET: FileSpreadsheet,
  DOCUMENT: FileText,
  OTHER: File,
};

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { enrollments } = await getResourcesData(session.user.id);

  // Gather all resources from enrolled courses
  const resourcesByCourse = enrollments.map((enrollment) => {
    const resources = enrollment.course.modules.flatMap((module) =>
      module.lessons.flatMap((lesson) =>
        lesson.resources.map((resource) => ({
          ...resource,
          lessonTitle: lesson.title,
          moduleTitle: module.title,
        }))
      )
    );
    return {
      course: enrollment.course,
      resources,
    };
  });

  const totalResources = resourcesByCourse.reduce((acc, c) => acc + c.resources.length, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <CardContent className="p-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <FolderOpen className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Resources</h1>
              <p className="text-burgundy-200">
                Download templates, worksheets, and tools
              </p>
            </div>
          </div>
          <p className="text-burgundy-100 max-w-2xl">
            Download templates, worksheets, checklists, coaching tools, protocols, meal plans, and
            worksheets designed to support your learning experience.
          </p>
          {totalResources > 0 && (
            <Badge className="mt-4 bg-gold-400 text-burgundy-900">
              {totalResources} resources available
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Resources by Course */}
      {enrollments.length === 0 ? (
        <Card className="card-premium">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Available</h3>
            <p className="text-gray-500 mb-4">
              Enroll in a course to access downloadable resources.
            </p>
            <Link href="/catalog">
              <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                Browse Courses
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resourcesByCourse.map(({ course, resources }) => (
            <Card key={course.id} className="card-premium">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-burgundy-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {resources.length} resource{resources.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {resources.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p>No resources available for this course yet.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {resources.map((resource) => {
                      const Icon = resourceTypeIcons[resource.type] || File;
                      return (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-burgundy-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{resource.title}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {resource.moduleTitle} • {resource.lessonTitle}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4 text-gray-500" />
                          </Button>
                        </a>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resource Categories Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gold-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Templates</h4>
            <p className="text-sm text-gray-500">
              Ready-to-use templates for coaching sessions
            </p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Worksheets</h4>
            <p className="text-sm text-gray-500">
              Printable worksheets for client exercises
            </p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <File className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Protocols</h4>
            <p className="text-sm text-gray-500">
              Evidence-based protocols and guides
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
