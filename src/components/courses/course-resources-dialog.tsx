"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  FileText,
  File,
  FileSpreadsheet,
  Image,
  Link2,
  Music,
  Loader2,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  size: number | null;
  lessonTitle: string;
  moduleTitle: string;
}

interface CourseResourcesDialogProps {
  courseId: string;
  courseName: string;
  trigger?: React.ReactNode;
}

const resourceIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  DOCUMENT: File,
  SPREADSHEET: FileSpreadsheet,
  IMAGE: Image,
  AUDIO: Music,
  LINK: Link2,
  OTHER: File,
};

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CourseResourcesDialog({
  courseId,
  courseName,
  trigger,
}: CourseResourcesDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState("");

  const fetchResources = async () => {
    if (resources.length > 0) return; // Already fetched

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/courses/${courseId}/resources`);
      if (!response.ok) throw new Error("Failed to fetch resources");
      const data = await response.json();
      setResources(data.resources);
    } catch {
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // Group resources by module
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.moduleTitle]) {
      acc[resource.moduleTitle] = [];
    }
    acc[resource.moduleTitle].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) fetchResources();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
            <Download className="w-4 h-4 mr-2" />
            Course Resources
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-burgundy-600" />
            </div>
            Course Resources
          </DialogTitle>
          <DialogDescription>
            Download materials for {courseName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchResources}>
                Try Again
              </Button>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No downloadable resources available for this course yet.</p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {Object.entries(groupedResources).map(([moduleTitle, moduleResources]) => (
                <div key={moduleTitle}>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {moduleTitle}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {moduleResources.length} file{moduleResources.length > 1 ? "s" : ""}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {moduleResources.map((resource) => {
                      const ResourceIcon = resourceIcons[resource.type] || File;
                      return (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200 group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:bg-burgundy-50 group-hover:border-burgundy-200 transition-colors">
                            <ResourceIcon className="w-5 h-5 text-gray-500 group-hover:text-burgundy-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {resource.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {resource.lessonTitle}
                              {resource.size && ` • ${formatFileSize(resource.size)}`}
                            </p>
                          </div>
                          {resource.type === "LINK" ? (
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
                          ) : (
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
