"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Send,
  Eye,
  CheckCircle,
  Zap,
  GraduationCap,
  MessageSquare,
  Clock,
  Settings,
  Search,
  Rocket,
  Target,
  Award,
  ChevronDown,
  ChevronRight,
  Book,
  Pencil,
  Save,
  X,
  Code,
  Info,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Types
interface EmailTemplate {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  subject: string;
  preheader: string | null;
  htmlContent?: string;
  placeholders: string[];
  courseTag: string | null;
  isActive: boolean;
  isSystem: boolean;
  sentCount: number;
  openCount: number;
  clickCount: number;
  updatedAt: string;
}

// Category configuration
const CATEGORY_CONFIG: Record<string, { name: string; icon: React.ComponentType<{ className?: string }>; color: string; description: string }> = {
  ACCOUNT: {
    name: "Account",
    icon: Settings,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Registration and account management emails",
  },
  MINI_DIPLOMA: {
    name: "Mini Diploma",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700 border-green-200",
    description: "Free mini diploma learning journey emails",
  },
  GRADUATE: {
    name: "Graduate Journey",
    icon: Rocket,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Post mini-diploma training and challenge emails",
  },
  CERTIFICATION: {
    name: "Certification & Billing",
    icon: Award,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    description: "Course enrollment, payment and certificate emails",
  },
  ENGAGEMENT: {
    name: "Engagement",
    icon: MessageSquare,
    color: "bg-pink-100 text-pink-700 border-pink-200",
    description: "Communication and re-engagement emails",
  },
  RESOURCES: {
    name: "Resources & Achievements",
    icon: Book,
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    description: "eBooks, badges, and achievements",
  },
  MARKETING: {
    name: "Marketing",
    icon: Target,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    description: "Course updates and announcements",
  },
};

// Placeholder descriptions for help text
const PLACEHOLDER_DESCRIPTIONS: Record<string, string> = {
  firstName: "User's first name",
  lastName: "User's last name",
  email: "User's email address",
  loginUrl: "Dashboard login URL",
  resetUrl: "Password reset URL",
  startUrl: "Course/diploma start URL",
  category: "Mini diploma category name",
  courseName: "Full course name",
  courseTitle: "Course title",
  moduleTitle: "Module title",
  moduleUrl: "Module access URL",
  nextModuleUrl: "Next module URL",
  progress: "Progress percentage (e.g., 45)",
  trainingUrl: "Training page URL",
  challengeUrl: "Challenge page URL",
  dayNumber: "Challenge day number",
  dayTitle: "Challenge day title",
  badgeUrl: "Badge/library URL",
  certificationUrl: "Full certification page URL",
  certificateNumber: "Certificate ID number",
  downloadUrl: "Download URL for certificate/ebook",
  verificationUrl: "Certificate verification URL",
  productName: "Purchased product name",
  amount: "Payment amount (e.g., $2,997.00)",
  transactionId: "Payment transaction ID",
  purchaseDate: "Purchase date formatted",
  courseUrl: "Course access URL",
  coachName: "Coach's name",
  messagePreview: "Preview of coach message",
  messageUrl: "Messages page URL",
  daysSinceActive: "Days since last activity",
  ebookTitle: "eBook title",
  libraryUrl: "My Library URL",
  badgeName: "Badge name",
  badgeDescription: "Badge description",
  updateTitle: "Course update title",
  updateDescription: "Course update description",
  announcementTitle: "Announcement title",
  announcementContent: "Announcement HTML content",
  ctaText: "Call-to-action button text",
  ctaUrl: "Call-to-action URL",
  preheader: "Email preheader text",
  unsubscribeUrl: "Unsubscribe link URL",
};

export default function EmailsClient() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(Object.keys(CATEGORY_CONFIG));
  const [activeTab, setActiveTab] = useState("transactional");

  // Edit state
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editFormData, setEditFormData] = useState<{
    subject: string;
    preheader: string;
    htmlContent: string;
  }>({ subject: "", preheader: "", htmlContent: "" });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Test state
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testingTemplateId, setTestingTemplateId] = useState<string | null>(null);

  // Preview state
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/email-templates");
      const data = await response.json();
      if (data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Fetch single template with full content for editing
  const fetchTemplateForEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${id}`);
      const data = await response.json();
      if (data.template) {
        setEditingTemplate(data.template);
        setEditFormData({
          subject: data.template.subject || "",
          preheader: data.template.preheader || "",
          htmlContent: data.template.htmlContent || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
    }
  };

  // Save template changes
  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/admin/email-templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: editFormData.subject,
          preheader: editFormData.preheader,
          htmlContent: editFormData.htmlContent,
        }),
      });

      if (response.ok) {
        setSaveMessage({ type: "success", text: "Template saved successfully!" });
        fetchTemplates(); // Refresh list
        setTimeout(() => {
          setEditingTemplate(null);
          setSaveMessage(null);
        }, 1500);
      } else {
        const data = await response.json();
        setSaveMessage({ type: "error", text: data.error || "Failed to save template" });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save template" });
    } finally {
      setSaving(false);
    }
  };

  // Send test email
  const handleSendTest = async (templateId: string) => {
    if (!testEmailAddress) {
      setTestResult({ success: false, message: "Please enter an email address" });
      return;
    }

    setSendingTest(true);
    setTestResult(null);
    setTestingTemplateId(templateId);

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail: testEmailAddress }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult({ success: true, message: `Test email sent to ${testEmailAddress}` });
      } else {
        setTestResult({ success: false, message: data.error || "Failed to send test email" });
      }
    } catch {
      setTestResult({ success: false, message: "Failed to send test email" });
    } finally {
      setSendingTest(false);
    }
  };

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>);

  // Filter templates by search
  const filteredCategories = Object.entries(templatesByCategory)
    .map(([category, temps]) => ({
      category,
      templates: temps.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          t.slug.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.templates.length > 0);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-burgundy-600" />
          <span className="text-gray-600">Loading email templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Email Templates
          </h1>
          <p className="text-gray-500 mt-1">
            Edit, preview and test all email templates - changes are saved to database
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchTemplates}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Templates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{templates.length}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{Object.keys(templatesByCategory).length}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{templates.filter(t => t.isActive).length}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Placeholders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{Object.keys(PLACEHOLDER_DESCRIPTIONS).length}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholders Reference */}
      <Card className="bg-gradient-to-r from-burgundy-50 to-amber-50 border-burgundy-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-burgundy-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-burgundy-800">Dynamic Placeholders</h3>
              <p className="text-sm text-burgundy-700 mt-1">
                Use <code className="bg-burgundy-100 px-1 rounded">{"{{placeholderName}}"}</code> in your templates.
                Available: <span className="font-medium">{Object.keys(PLACEHOLDER_DESCRIPTIONS).slice(0, 8).join(", ")}</span>...
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-burgundy-700 p-0 h-auto ml-1">
                      View all {Object.keys(PLACEHOLDER_DESCRIPTIONS).length} placeholders
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Available Placeholders</DialogTitle>
                      <DialogDescription>
                        Use these in your email templates with {"{{placeholder}}"} syntax
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {Object.entries(PLACEHOLDER_DESCRIPTIONS).map(([key, desc]) => (
                        <div key={key} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                          <code className="bg-burgundy-100 text-burgundy-700 px-2 py-0.5 rounded text-sm font-mono flex-shrink-0">
                            {`{{${key}}}`}
                          </code>
                          <span className="text-sm text-gray-600">{desc}</span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="transactional" className="gap-2 data-[state=active]:bg-white">
              <Zap className="w-4 h-4" />
              All Templates
              <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">
                {templates.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2 data-[state=active]:bg-white">
              <Target className="w-4 h-4" />
              Marketing
              <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
                Coming
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>

        <TabsContent value="transactional" className="space-y-4">
          {templates.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
                <p className="text-gray-600 mb-4">
                  Email templates need to be seeded into the database. Run the seed command:
                </p>
                <code className="bg-gray-100 px-3 py-2 rounded text-sm">
                  npx tsx prisma/seed-email-templates.ts
                </code>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map(({ category, templates: categoryTemplates }) => {
              const config = CATEGORY_CONFIG[category] || {
                name: category,
                icon: Mail,
                color: "bg-gray-100 text-gray-700",
                description: "",
              };
              const CategoryIcon = config.icon;
              const isExpanded = expandedCategories.includes(category);

              return (
                <Collapsible
                  key={category}
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color.split(' ')[0]}`}>
                            <CategoryIcon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{config.name}</h3>
                            <p className="text-sm text-gray-500">{config.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className={config.color}>
                            {categoryTemplates.length} emails
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t">
                        {categoryTemplates.map((template, idx) => (
                          <div
                            key={template.id}
                            className={`p-4 flex items-center justify-between ${
                              idx !== categoryTemplates.length - 1 ? 'border-b' : ''
                            } hover:bg-gray-50/50`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-burgundy-600" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                <p className="text-sm text-gray-500 truncate">{template.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {template.placeholders.length > 0 && (
                                <Badge variant="outline" className="text-xs gap-1 hidden lg:flex">
                                  <Code className="w-3 h-3" />
                                  {template.placeholders.length} vars
                                </Badge>
                              )}

                              {/* Preview Button */}
                              <Dialog open={previewTemplateId === template.id} onOpenChange={(open) => setPreviewTemplateId(open ? template.id : null)}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Preview</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Eye className="w-5 h-5 text-burgundy-600" />
                                      Preview: {template.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Subject: {template.subject}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="flex-1 overflow-auto border rounded-lg bg-gray-100 p-2">
                                    <iframe
                                      src={`/api/admin/email-templates/${template.id}/preview`}
                                      className="w-full h-[500px] bg-white rounded border-0"
                                      title={`Preview: ${template.name}`}
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* Edit Button */}
                              <Dialog
                                open={editingTemplate?.id === template.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    fetchTemplateForEdit(template.id);
                                  } else {
                                    setEditingTemplate(null);
                                    setSaveMessage(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Pencil className="w-5 h-5 text-burgundy-600" />
                                      Edit: {template.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Edit the email subject, preheader, and HTML content
                                    </DialogDescription>
                                  </DialogHeader>

                                  {editingTemplate ? (
                                    <div className="flex-1 overflow-auto space-y-4 mt-4">
                                      {/* Subject Line */}
                                      <div className="space-y-2">
                                        <Label htmlFor="subject">Subject Line</Label>
                                        <Input
                                          id="subject"
                                          value={editFormData.subject}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, subject: e.target.value }))}
                                          placeholder="Email subject line..."
                                        />
                                      </div>

                                      {/* Preheader */}
                                      <div className="space-y-2">
                                        <Label htmlFor="preheader">Preheader Text</Label>
                                        <Input
                                          id="preheader"
                                          value={editFormData.preheader}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, preheader: e.target.value }))}
                                          placeholder="Preview text shown in inbox..."
                                        />
                                        <p className="text-xs text-gray-500">This appears as preview text in email clients</p>
                                      </div>

                                      {/* Available Placeholders */}
                                      <div className="bg-gray-50 rounded-lg p-3 border">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Available Placeholders:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {editingTemplate.placeholders.map((p) => (
                                            <code
                                              key={p}
                                              className="bg-burgundy-100 text-burgundy-700 px-2 py-0.5 rounded text-xs cursor-pointer hover:bg-burgundy-200"
                                              onClick={() => {
                                                setEditFormData(prev => ({
                                                  ...prev,
                                                  htmlContent: prev.htmlContent + `{{${p}}}`
                                                }));
                                              }}
                                              title={PLACEHOLDER_DESCRIPTIONS[p] || p}
                                            >
                                              {`{{${p}}}`}
                                            </code>
                                          ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Click to insert at cursor position</p>
                                      </div>

                                      {/* HTML Content */}
                                      <div className="space-y-2">
                                        <Label htmlFor="htmlContent">HTML Content</Label>
                                        <Textarea
                                          id="htmlContent"
                                          value={editFormData.htmlContent}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                                          placeholder="Enter email HTML content..."
                                          className="font-mono text-sm min-h-[400px]"
                                        />
                                      </div>

                                      {/* Save Message */}
                                      {saveMessage && (
                                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                                          saveMessage.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                        }`}>
                                          {saveMessage.type === "success" ? (
                                            <CheckCircle className="w-4 h-4" />
                                          ) : (
                                            <AlertCircle className="w-4 h-4" />
                                          )}
                                          {saveMessage.text}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-64">
                                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                                    </div>
                                  )}

                                  <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditingTemplate(null);
                                        setSaveMessage(null);
                                      }}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleSaveTemplate}
                                      disabled={saving}
                                      className="bg-burgundy-600 hover:bg-burgundy-700"
                                    >
                                      {saving ? (
                                        <>
                                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="w-4 h-4 mr-2" />
                                          Save Changes
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* Test Button */}
                              <Dialog
                                onOpenChange={(open) => {
                                  if (!open) {
                                    setTestResult(null);
                                    setTestingTemplateId(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="default" size="sm" className="gap-1 bg-burgundy-600 hover:bg-burgundy-700">
                                    <Send className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Test</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Send className="w-5 h-5 text-burgundy-600" />
                                      Test: {template.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Send a test email to verify the template
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-4 mt-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge className={CATEGORY_CONFIG[template.category]?.color || "bg-gray-100"}>
                                          {CATEGORY_CONFIG[template.category]?.name || template.category}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">{template.description}</p>
                                      <p className="text-xs text-gray-400 mt-2">
                                        Subject: {template.subject}
                                      </p>
                                    </div>

                                    <div className="space-y-3">
                                      <Label>Recipient Email Address</Label>
                                      <Input
                                        type="email"
                                        placeholder="Enter your email address..."
                                        value={testEmailAddress}
                                        onChange={(e) => setTestEmailAddress(e.target.value)}
                                      />
                                      <Button
                                        onClick={() => handleSendTest(template.id)}
                                        disabled={sendingTest}
                                        className="w-full gap-2 bg-burgundy-600 hover:bg-burgundy-700"
                                      >
                                        {sendingTest && testingTemplateId === template.id ? (
                                          <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Sending...
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-4 h-4" />
                                            Send Test Email
                                          </>
                                        )}
                                      </Button>

                                      {testResult && testingTemplateId === template.id && (
                                        <div
                                          className={`p-3 rounded-lg text-sm ${
                                            testResult.success
                                              ? "bg-green-50 text-green-700 border border-green-200"
                                              : "bg-red-50 text-red-700 border border-red-200"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            {testResult.success ? (
                                              <CheckCircle className="w-4 h-4" />
                                            ) : (
                                              <Clock className="w-4 h-4" />
                                            )}
                                            {testResult.message}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}

          {filteredCategories.length === 0 && templates.length > 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-500">Try adjusting your search query</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card className="border-2 border-dashed border-amber-200 bg-amber-50/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Marketing Emails Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                We&apos;re building a powerful marketing email system with campaign management,
                A/B testing, and advanced audience segmentation.
              </p>
              <Badge className="bg-amber-100 text-amber-700">In Development</Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
