"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2, CheckCircle, AlertCircle, FolderOpen } from "lucide-react";

interface ImportResult {
  success: boolean;
  data?: {
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    modulesCreated: number;
    lessonsCreated: number;
    categoryName: string;
  };
  error?: string;
}

export function CourseImportDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const [formData, setFormData] = useState({
    courseFolderPath: "",
    categoryName: "",
    price: "",
    certificateType: "CERTIFICATION",
    coachEmail: "",
  });

  const handleImport = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/import-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, data: data.data });
        router.refresh();
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Import failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      courseFolderPath: "",
      categoryName: "",
      price: "",
      certificateType: "CERTIFICATION",
      coachEmail: "",
    });
    setResult(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Import Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Course from Folder</DialogTitle>
          <DialogDescription>
            Import a course from a folder containing course_data.json and HTML lesson files.
          </DialogDescription>
        </DialogHeader>

        {result?.success ? (
          <div className="py-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Course Imported Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                {result.data?.courseTitle}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 rounded-lg p-4 w-full">
                <div>
                  <p className="text-gray-500">Modules</p>
                  <p className="font-semibold">{result.data?.modulesCreated}</p>
                </div>
                <div>
                  <p className="text-gray-500">Lessons</p>
                  <p className="font-semibold">{result.data?.lessonsCreated}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-semibold">{result.data?.categoryName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-semibold text-green-600">Published</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                  onClick={() => {
                    router.push(`/courses/${result.data?.courseSlug}`);
                    setOpen(false);
                  }}
                >
                  View Course
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {result?.error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{result.error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="courseFolderPath">Course Folder Path *</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="courseFolderPath"
                  placeholder="/path/to/course/folder"
                  value={formData.courseFolderPath}
                  onChange={(e) =>
                    setFormData({ ...formData, courseFolderPath: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">
                Full path to folder containing course_data.json and Modules folder
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryName">Category *</Label>
              <Input
                id="categoryName"
                placeholder="e.g., Functional Medicine"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="997"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select
                  value={formData.certificateType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, certificateType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETION">Completion</SelectItem>
                    <SelectItem value="CERTIFICATION">Certification</SelectItem>
                    <SelectItem value="MINI_DIPLOMA">Mini Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coachEmail">Coach (Email or Name)</Label>
              <Input
                id="coachEmail"
                placeholder="e.g., Sarah or coach@example.com"
                value={formData.coachEmail}
                onChange={(e) =>
                  setFormData({ ...formData, coachEmail: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Optional. Will be assigned as the course coach.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={loading || !formData.courseFolderPath || !formData.categoryName}
                className="bg-burgundy-600 hover:bg-burgundy-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Course
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
