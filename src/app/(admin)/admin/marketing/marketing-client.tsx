"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tags,
  Users,
  Mail,
  TrendingUp,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Send,
  MousePointer,
  CheckCircle,
  Loader2,
  Play,
  Pause,
  Clock,
  ArrowRight,
  UserPlus,
  Settings2,
  Zap,
  TestTube,
  LogOut,
  AlertCircle,
  Gift,
  Sparkles,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface MarketingTag {
  id: string;
  name: string;
  slug: string;
  category: string;
  color: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  userCount: number;
  createdAt: string;
}

interface Analytics {
  overview: {
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    complained: number;
    failed: number;
    deliveryRate: string;
    openRate: string;
    clickRate: string;
    bounceRate: string;
    unsubscribeRate: string;
    complainedRate: string;
    failedRate: string;
    subscriberCount: number;
  };
  topEmails: Array<{
    id: string;
    name: string;
    subject: string;
    sentCount: number;
    openCount: number;
    clickCount: number;
    openRate: string;
    clickRate: string;
  }>;
  tagStats: Array<{
    id: string;
    name: string;
    slug: string;
    category: string;
    color: string;
    userCount: number;
  }>;
}

interface SequenceEmail {
  id: string;
  subject: string;
  customSubject?: string;
  customContent?: string;
  delayDays: number;
  delayHours: number;
  order: number;
  isActive: boolean;
  sentCount: number;
  openCount: number;
  clickCount: number;
  requiresTagId?: string | null;
  skipIfTagId?: string | null;
}

interface Sequence {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  triggerType: string;
  courseCategory: string | null;
  fromName?: string;
  fromEmail?: string;
  totalEnrolled: number;
  totalCompleted: number;
  totalExited: number;
  exitOnReply: boolean;
  exitOnClick: boolean;
  createdAt: string;
  triggerTag: MarketingTag | null;
  exitTag: MarketingTag | null;
  emails: SequenceEmail[];
  emailCount: number;
  enrollmentCount: number;
}

const TAG_CATEGORIES = [
  { value: "STAGE", label: "Stage (Lifecycle)", color: "#3B82F6" },
  { value: "INTENT", label: "Intent", color: "#F97316" },
  { value: "BEHAVIOR", label: "Behavior", color: "#14B8A6" },
  { value: "SOURCE", label: "Source", color: "#722F37" },
  { value: "SUPPRESS", label: "Suppression", color: "#DC2626" },
  { value: "CUSTOM", label: "Custom", color: "#6B7280" },
];

const TRIGGER_TYPES = [
  { value: "TAG_ADDED", label: "When tag is added" },
  { value: "USER_REGISTERED", label: "When user registers" },
  { value: "MINI_DIPLOMA_STARTED", label: "Mini diploma started" },
  { value: "MINI_DIPLOMA_COMPLETED", label: "Mini diploma completed" },
  { value: "TRAINING_STARTED", label: "Training started" },
  { value: "COURSE_ENROLLED", label: "Course enrolled" },
  { value: "MANUAL", label: "Manual enrollment only" },
];

// Mini diploma categories for sequence targeting
const MINI_DIPLOMA_CATEGORIES = [
  { value: "functional-medicine", label: "Functional Medicine", color: "#10B981" },
  { value: "gut-health", label: "Gut Health", color: "#F59E0B" },
  { value: "hormone-health", label: "Hormone Health", color: "#EC4899" },
  { value: "womens-health", label: "Women's Health", color: "#8B5CF6" },
  { value: "holistic-nutrition", label: "Holistic Nutrition", color: "#06B6D4" },
  { value: "health-coach", label: "Health Coach", color: "#3B82F6" },
  { value: "nurse-coach", label: "Nurse Coach", color: "#EF4444" },
  { value: "autism", label: "Autism", color: "#14B8A6" },
];

export default function MarketingClient() {
  const [activeTab, setActiveTab] = useState("tags");
  const [tags, setTags] = useState<MarketingTag[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sequencesLoading, setSequencesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dialog states
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [showEditTag, setShowEditTag] = useState(false);
  const [showTagUsers, setShowTagUsers] = useState(false);
  const [selectedTag, setSelectedTag] = useState<MarketingTag | null>(null);
  const [tagUsers, setTagUsers] = useState<any[]>([]);

  // Sequence dialog states
  const [showCreateSequence, setShowCreateSequence] = useState(false);
  const [showEditSequence, setShowEditSequence] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showPreviewEmail, setShowPreviewEmail] = useState(false);
  const [showTestSequence, setShowTestSequence] = useState(false);
  const [showEnrollUser, setShowEnrollUser] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<SequenceEmail | null>(null);

  // Test sequence state
  const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
  const [testingSequence, setTestingSequence] = useState(false);
  const [sequencePreview, setSequencePreview] = useState<any>(null);

  // Enroll user state
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [enrollingAll, setEnrollingAll] = useState(false);
  const [subscribersTotal, setSubscribersTotal] = useState(0);
  const [showEnrollAllConfirm, setShowEnrollAllConfirm] = useState(false);

  // View enrollments state
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentCounts, setEnrollmentCounts] = useState({ ACTIVE: 0, COMPLETED: 0, EXITED: 0, PAUSED: 0 });
  const [showRemoveAllConfirm, setShowRemoveAllConfirm] = useState(false);
  const [removingAll, setRemovingAll] = useState(false);

  // Holiday campaign state
  const [holidayTestEmail, setHolidayTestEmail] = useState("at.seed019@gmail.com");
  const [sendingHolidayTest, setSendingHolidayTest] = useState<string | null>(null);
  const [showHolidayPreview, setShowHolidayPreview] = useState(false);
  const [holidayPreviewCampaign, setHolidayPreviewCampaign] = useState<string | null>(null);

  // Static nurture sequence states
  const [nurtureSequenceActive, setNurtureSequenceActive] = useState(true);
  const [showNurtureEnroll, setShowNurtureEnroll] = useState(false);
  const [nurtureEnrollEmail, setNurtureEnrollEmail] = useState("");
  const [nurtureEnrolling, setNurtureEnrolling] = useState(false);
  const [showNurtureEmailPreview, setShowNurtureEmailPreview] = useState(false);
  const [selectedNurtureEmail, setSelectedNurtureEmail] = useState<{ day: number; name: string; subject: string } | null>(null);
  const [showNurtureEmailEdit, setShowNurtureEmailEdit] = useState(false);
  const [nurtureEmailHtml, setNurtureEmailHtml] = useState("");
  const [loadingNurtureHtml, setLoadingNurtureHtml] = useState(false);
  const [nurtureEnrollCount, setNurtureEnrollCount] = useState(0);

  // View nurture enrollees state
  const [showNurtureEnrollees, setShowNurtureEnrollees] = useState(false);
  const [nurtureEnrollees, setNurtureEnrollees] = useState<any[]>([]);
  const [nurtureEnrolleesLoading, setNurtureEnrolleesLoading] = useState(false);

  // Full sequence test states
  const [showFullSequenceTest, setShowFullSequenceTest] = useState(false);
  const [fullSequenceTestEmail, setFullSequenceTestEmail] = useState("");
  const [fullSequenceTestRunning, setFullSequenceTestRunning] = useState(false);
  const [fullSequenceTestProgress, setFullSequenceTestProgress] = useState(0);
  const [fullSequenceTestTotal, setFullSequenceTestTotal] = useState(0);
  const [fullSequenceTestLog, setFullSequenceTestLog] = useState<string[]>([]);

  // Form state
  const [newTag, setNewTag] = useState({
    name: "",
    slug: "",
    category: "CUSTOM",
    color: "#6B7280",
    description: "",
  });

  const [newSequence, setNewSequence] = useState({
    name: "",
    description: "",
    triggerType: "TAG_ADDED",
    triggerTagId: "",
    exitTagId: "",
    exitOnReply: false,
    exitOnClick: false,
    fromName: "AccrediPro Academy",
    fromEmail: "noreply@accredipro.academy",
  });

  const [newEmail, setNewEmail] = useState({
    subject: "",
    delayDays: 0,
    delayHours: 0,
    htmlContent: "",
    requiresTagId: "",
    skipIfTagId: "",
  });

  const [editingEmail, setEditingEmail] = useState({
    id: "",
    subject: "",
    delayDays: 0,
    delayHours: 0,
    htmlContent: "",
    requiresTagId: "",
    skipIfTagId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTags();
    fetchSequences();
    fetchAnalytics();
  }, []);

  async function fetchTags() {
    try {
      const res = await fetch("/api/admin/marketing/tags");
      const data = await res.json();
      setTags(data.tags || []);

      // Update nurture sequence enrollment count from tag
      const nurtureTag = (data.tags || []).find((t: MarketingTag) =>
        t.name === "nurture-30-day" || t.slug === "nurture-30-day"
      );
      if (nurtureTag) {
        setNurtureEnrollCount(nurtureTag.userCount || 0);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/admin/marketing/analytics?days=30");
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }

  async function fetchSequences() {
    try {
      setSequencesLoading(true);
      const res = await fetch("/api/admin/marketing/sequences");
      const data = await res.json();
      setSequences(data.sequences || []);
    } catch (error) {
      console.error("Error fetching sequences:", error);
    } finally {
      setSequencesLoading(false);
    }
  }

  async function createSequence() {
    try {
      const res = await fetch("/api/admin/marketing/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSequence,
          triggerTagId: newSequence.triggerTagId && newSequence.triggerTagId !== "none" ? newSequence.triggerTagId : null,
          exitTagId: newSequence.exitTagId && newSequence.exitTagId !== "none" ? newSequence.exitTagId : null,
        }),
      });
      if (res.ok) {
        toast.success("Sequence created successfully");
        fetchSequences();
        setShowCreateSequence(false);
        setNewSequence({
          name: "",
          description: "",
          triggerType: "TAG_ADDED",
          triggerTagId: "",
          exitTagId: "",
          exitOnReply: false,
          exitOnClick: false,
          fromName: "AccrediPro Academy",
          fromEmail: "noreply@accredipro.academy",
        });
      }
    } catch (error) {
      console.error("Error creating sequence:", error);
      toast.error("Failed to create sequence");
    }
  }

  async function updateSequence() {
    if (!selectedSequence) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedSequence.name,
          description: selectedSequence.description,
          courseCategory: selectedSequence.courseCategory,
          isActive: selectedSequence.isActive,
          exitOnReply: selectedSequence.exitOnReply,
          exitOnClick: selectedSequence.exitOnClick,
        }),
      });
      if (res.ok) {
        toast.success("Sequence updated");
        fetchSequences();
        setShowEditSequence(false);
        setSelectedSequence(null);
      }
    } catch (error) {
      console.error("Error updating sequence:", error);
      toast.error("Failed to update sequence");
    }
  }

  async function toggleSequenceActive(seq: Sequence) {
    try {
      await fetch(`/api/admin/marketing/sequences/${seq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !seq.isActive }),
      });
      toast.success(seq.isActive ? "Sequence paused" : "Sequence activated");
      fetchSequences();
    } catch (error) {
      console.error("Error toggling sequence:", error);
    }
  }

  async function deleteSequence(sequenceId: string) {
    if (!confirm("Are you sure you want to delete this sequence? This will exit all active enrollments.")) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${sequenceId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Sequence deleted");
        fetchSequences();
      }
    } catch (error) {
      console.error("Error deleting sequence:", error);
    }
  }

  async function addEmailToSequence() {
    if (!selectedSequence) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newEmail.subject,
          htmlContent: newEmail.htmlContent,
          delayDays: newEmail.delayDays,
          delayHours: newEmail.delayHours,
          requiresTagId: newEmail.requiresTagId && newEmail.requiresTagId !== "none" ? newEmail.requiresTagId : null,
          skipIfTagId: newEmail.skipIfTagId && newEmail.skipIfTagId !== "none" ? newEmail.skipIfTagId : null,
        }),
      });
      if (res.ok) {
        toast.success("Email added to sequence");
        fetchSequences();
        setShowAddEmail(false);
        setNewEmail({ subject: "", delayDays: 0, delayHours: 0, htmlContent: "", requiresTagId: "", skipIfTagId: "" });
      }
    } catch (error) {
      console.error("Error adding email:", error);
      toast.error("Failed to add email");
    }
  }

  async function updateEmail() {
    if (!selectedSequence || !editingEmail.id) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/emails/${editingEmail.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: editingEmail.subject,
          htmlContent: editingEmail.htmlContent,
          delayDays: editingEmail.delayDays,
          delayHours: editingEmail.delayHours,
          requiresTagId: editingEmail.requiresTagId && editingEmail.requiresTagId !== "none" ? editingEmail.requiresTagId : null,
          skipIfTagId: editingEmail.skipIfTagId && editingEmail.skipIfTagId !== "none" ? editingEmail.skipIfTagId : null,
          isActive: editingEmail.isActive,
        }),
      });
      if (res.ok) {
        toast.success("Email updated");
        fetchSequences();
        setShowEditEmail(false);
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    }
  }

  async function deleteSequenceEmail(sequenceId: string, emailId: string) {
    if (!confirm("Are you sure you want to delete this email?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${sequenceId}/emails/${emailId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Email deleted");
        fetchSequences();
      }
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  }

  async function testSequence(sendEmail: boolean = false) {
    if (!selectedSequence) return;
    setTestingSequence(true);
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testEmail,
          sendFirstEmail: sendEmail,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        // API returns { sequence: {...}, testEmailSent, testEmailError }
        setSequencePreview(data.sequence);
        if (sendEmail && data.testEmailSent) {
          toast.success(`Test email sent to ${testEmail}`);
        } else if (sendEmail && data.testEmailError) {
          toast.error(`Failed to send: ${data.testEmailError}`);
        }
      } else {
        toast.error(data.error || "Failed to test sequence");
      }
    } catch (error) {
      console.error("Error testing sequence:", error);
      toast.error("Failed to test sequence");
    } finally {
      setTestingSequence(false);
    }
  }

  async function fetchSubscribers(search = "") {
    setSubscribersLoading(true);
    try {
      const res = await fetch(`/api/admin/marketing/subscribers?search=${encodeURIComponent(search)}&limit=50`);
      const data = await res.json();
      if (res.ok) {
        setSubscribers(data.subscribers || []);
        setSubscribersTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setSubscribersLoading(false);
    }
  }

  async function enrollUser() {
    if (!selectedSequence || !enrollEmail) return;
    setEnrolling(true);
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: enrollEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.firstEmailSent) {
          toast.success("User enrolled and first email sent!");
        } else if (data.firstEmailError) {
          toast.success(`User enrolled, but email failed: ${data.firstEmailError}`);
        } else {
          toast.success(data.message || "User enrolled successfully");
        }
        fetchSequences();
        setShowEnrollUser(false);
        setEnrollEmail("");
        setSelectedSubscribers([]);
      } else {
        toast.error(data.error || "Failed to enroll user");
      }
    } catch (error) {
      console.error("Error enrolling user:", error);
      toast.error("Failed to enroll user");
    } finally {
      setEnrolling(false);
    }
  }

  async function enrollSelected() {
    if (!selectedSequence || selectedSubscribers.length === 0) return;
    setEnrolling(true);
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/enroll-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedSubscribers, sendFirstEmail: true }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || `Enrolled ${data.enrolled} users`);
        fetchSequences();
        setShowEnrollUser(false);
        setSelectedSubscribers([]);
      } else {
        toast.error(data.error || "Failed to enroll users");
      }
    } catch (error) {
      console.error("Error enrolling users:", error);
      toast.error("Failed to enroll users");
    } finally {
      setEnrolling(false);
    }
  }

  async function enrollAllSubscribers() {
    if (!selectedSequence) return;
    setShowEnrollAllConfirm(false);
    setEnrollingAll(true);
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/enroll-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter: "all", sendFirstEmail: true }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || `Enrolled ${data.enrolled} users`);
        fetchSequences();
        setShowEnrollUser(false);
      } else {
        toast.error(data.error || "Failed to enroll users");
      }
    } catch (error) {
      console.error("Error enrolling all:", error);
      toast.error("Failed to enroll users");
    } finally {
      setEnrollingAll(false);
    }
  }

  async function fetchEnrollments(sequenceId: string) {
    setEnrollmentsLoading(true);
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${sequenceId}/enrollments`);
      const data = await res.json();
      if (res.ok) {
        setEnrollments(data.enrollments || []);
        setEnrollmentCounts(data.counts || { ACTIVE: 0, COMPLETED: 0, EXITED: 0, PAUSED: 0 });
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setEnrollmentsLoading(false);
    }
  }

  async function removeEnrollment(userId: string, permanent = false) {
    if (!selectedSequence) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [userId], permanent }),
      });
      if (res.ok) {
        toast.success(permanent ? "Enrollment deleted" : "User removed from sequence");
        fetchEnrollments(selectedSequence.id);
        fetchSequences();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing enrollment:", error);
      toast.error("Failed to remove user");
    }
  }

  async function removeAllEnrollments() {
    if (!selectedSequence) return;
    setShowRemoveAllConfirm(false);
    setRemovingAll(true);
    try {
      // Get all enrollment user IDs
      const userIds = enrollments.map(e => e.user.id);
      if (userIds.length === 0) {
        toast.error("No enrollments to remove");
        return;
      }

      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, permanent: true }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Removed ${data.removed || userIds.length} enrollments`);
        fetchEnrollments(selectedSequence.id);
        fetchSequences();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove enrollments");
      }
    } catch (error) {
      console.error("Error removing all enrollments:", error);
      toast.error("Failed to remove enrollments");
    } finally {
      setRemovingAll(false);
    }
  }

  // Nurture sequence enrollees functions
  async function fetchNurtureEnrollees() {
    setNurtureEnrolleesLoading(true);
    try {
      const res = await fetch(`/api/admin/marketing/nurture-enrollees`);
      const data = await res.json();
      setNurtureEnrollees(data.enrollees || []);
      setNurtureEnrollCount(data.enrollees?.length || 0);
    } catch (error) {
      console.error("Error fetching nurture enrollees:", error);
    } finally {
      setNurtureEnrolleesLoading(false);
    }
  }

  // Import/reset nurture emails from template
  async function importNurtureEmails() {
    if (!confirm("This will delete existing nurture emails and re-import all 17 emails with the latest content. Continue?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/import-nurture-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Imported ${data.emails?.length || 17} nurture emails`);
        fetchSequences();
      } else {
        toast.error(data.error || "Failed to import emails");
      }
    } catch (error) {
      console.error("Error importing nurture emails:", error);
      toast.error("Failed to import emails");
    }
  }

  // Generic import for any sequence
  async function importSequenceEmails(sequenceId: string, sequenceName: string) {
    if (!confirm(`This will delete existing emails and re-import from templates for "${sequenceName}". Continue?`)) return;
    try {
      const res = await fetch(`/api/admin/marketing/sequences/${sequenceId}/import-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Imported ${data.imported || 0} emails`);
        fetchSequences();
      } else {
        toast.error(data.error || "Failed to import emails");
      }
    } catch (error) {
      console.error("Error importing sequence emails:", error);
      toast.error("Failed to import emails");
    }
  }

  // Setup Chat Conversion Sequences
  const [settingUpChatSequences, setSettingUpChatSequences] = useState(false);

  async function setupChatSequences() {
    if (!confirm("This will create the Chat Conversion and Optin-Only sequences with all emails. Continue?")) return;
    setSettingUpChatSequences(true);
    try {
      const res = await fetch(`/api/admin/marketing/setup-chat-sequences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Created: ${data.sequencesCreated?.join(", ") || "sequences"} with ${data.emailsImported || 0} emails`);
        fetchSequences();
        fetchTags();
      } else {
        toast.error(data.error || "Failed to setup chat sequences");
      }
    } catch (error) {
      console.error("Error setting up chat sequences:", error);
      toast.error("Failed to setup chat sequences");
    } finally {
      setSettingUpChatSequences(false);
    }
  }

  // Backfill Chat Tags (temporary utility)
  const [backfillingChatTags, setBackfillingChatTags] = useState(false);

  async function backfillChatTags() {
    if (!confirm("This will apply chat_lead and optin_only tags to historical chat optins. Continue?")) return;
    setBackfillingChatTags(true);
    try {
      const res = await fetch(`/api/admin/marketing/backfill-chat-tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Backfill complete: ${data.chatLeadTagged} chat_lead + ${data.optinOnlyTagged} optin_only tagged`);
        fetchTags();
      } else {
        toast.error(data.error || "Failed to backfill tags");
      }
    } catch (error) {
      console.error("Error backfilling chat tags:", error);
      toast.error("Failed to backfill tags");
    } finally {
      setBackfillingChatTags(false);
    }
  }

  async function removeNurtureEnrollee(userId: string) {
    if (!confirm("Remove this user from the nurture sequence?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/nurture-enrollees`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("User removed from nurture sequence");
        fetchNurtureEnrollees();
        fetchTags();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing nurture enrollee:", error);
      toast.error("Failed to remove user");
    }
  }

  // Holiday campaign functions
  async function sendHolidayTestEmail(campaign: string, emailIndex: number) {
    if (!holidayTestEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    setSendingHolidayTest(`${campaign}-${emailIndex}`);

    // Map campaign + index to variant ID
    const variantMap: Record<string, number> = {
      "christmas-0": 30, // Christmas email 1
      "christmas-1": 31, // Christmas email 2
      "christmas-2": 32, // Christmas email 3
      "newyear-0": 33,   // New Year email 1
      "newyear-1": 34,   // New Year email 2
      "newyear-2": 35,   // New Year email 3
      "downsell-0": 27,  // Downsell email 1
      "downsell-1": 28,  // Downsell email 2
      "downsell-2": 29,  // Downsell email 3
    };

    const variantId = variantMap[`${campaign}-${emailIndex}`];

    try {
      const res = await fetch("/api/admin/marketing/inbox-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, testEmail: holidayTestEmail }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Test email sent! Check ${holidayTestEmail} inbox in 30-60 seconds`);
      } else {
        toast.error(data.error || "Failed to send test email");
      }
    } catch (error) {
      console.error("Error sending holiday test:", error);
      toast.error("Failed to send test email");
    } finally {
      setSendingHolidayTest(null);
    }
  }

  function openHolidayPreview(campaign: string) {
    setHolidayPreviewCampaign(campaign);
    setShowHolidayPreview(true);
  }

  async function createTag() {
    try {
      const res = await fetch("/api/admin/marketing/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });
      if (res.ok) {
        toast.success("Tag created");
        fetchTags();
        setShowCreateTag(false);
        setNewTag({ name: "", slug: "", category: "CUSTOM", color: "#6B7280", description: "" });
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }

  async function updateTag() {
    if (!selectedTag) return;
    try {
      const res = await fetch(`/api/admin/marketing/tags/${selectedTag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedTag.name,
          color: selectedTag.color,
          description: selectedTag.description,
        }),
      });
      if (res.ok) {
        toast.success("Tag updated");
        fetchTags();
        setShowEditTag(false);
        setSelectedTag(null);
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  }

  async function deleteTag(tagId: string) {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/tags/${tagId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Tag deleted");
        fetchTags();
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  }

  async function viewTagUsers(tag: MarketingTag) {
    setSelectedTag(tag);
    setShowTagUsers(true);
    try {
      const res = await fetch(`/api/admin/marketing/tags/${tag.id}`);
      const data = await res.json();
      setTagUsers(data.tag?.users || []);
    } catch (error) {
      console.error("Error fetching tag users:", error);
    }
  }

  function openEditEmail(seq: Sequence, email: SequenceEmail) {
    setSelectedSequence(seq);
    setSelectedEmail(email);
    setEditingEmail({
      id: email.id,
      subject: email.customSubject || email.subject || "",
      delayDays: email.delayDays,
      delayHours: email.delayHours,
      htmlContent: email.customContent || "",
      requiresTagId: email.requiresTagId || "",
      skipIfTagId: email.skipIfTagId || "",
      isActive: email.isActive,
    });
    setShowEditEmail(true);
  }

  function openPreviewEmail(seq: Sequence, email: SequenceEmail) {
    setSelectedSequence(seq);
    setSelectedEmail(email);
    setShowPreviewEmail(true);
  }

  // Filter tags
  const filteredTags = tags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group tags by category
  const tagsByCategory = TAG_CATEGORIES.map((cat) => ({
    ...cat,
    tags: filteredTags.filter((t) => t.category === cat.value),
  })).filter((cat) => cat.tags.length > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600">Manage tags, sequences, templates and email analytics</p>
        </div>
        <Button onClick={() => setShowCreateTag(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
        <Button
          variant="outline"
          onClick={setupChatSequences}
          disabled={settingUpChatSequences}
        >
          {settingUpChatSequences ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Setup Chat Sequences
        </Button>
        <Button
          variant="outline"
          onClick={backfillChatTags}
          disabled={backfillingChatTags}
        >
          {backfillingChatTags ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Backfill Chat Tags
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Send className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sent</p>
                <p className="text-lg font-bold">{analytics?.overview.totalSent || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Delivered</p>
                <p className="text-lg font-bold">{analytics?.overview.delivered || 0}</p>
                <p className="text-xs text-green-600">{analytics?.overview.deliveryRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Opened</p>
                <p className="text-lg font-bold">{analytics?.overview.opened || 0}</p>
                <p className="text-xs text-purple-600">{analytics?.overview.openRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <MousePointer className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Clicked</p>
                <p className="text-lg font-bold">{analytics?.overview.clicked || 0}</p>
                <p className="text-xs text-amber-600">{analytics?.overview.clickRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bounced</p>
                <p className="text-lg font-bold">{analytics?.overview.bounced || 0}</p>
                <p className="text-xs text-red-600">{analytics?.overview.bounceRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <LogOut className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Unsubscribed</p>
                <p className="text-lg font-bold">{analytics?.overview.unsubscribed || 0}</p>
                <p className="text-xs text-orange-600">{analytics?.overview.unsubscribeRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-100 rounded-lg">
                <Users className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Subscribers</p>
                <p className="text-lg font-bold">{analytics?.overview.subscriberCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Health Score</p>
                <p className="text-lg font-bold">{analytics?.overview.bounced === 0 && analytics?.overview.unsubscribed === 0 ? "100%" : `${Math.max(0, 100 - ((analytics?.overview.bounced || 0) + (analytics?.overview.unsubscribed || 0)) / Math.max(1, analytics?.overview.totalSent || 1) * 100).toFixed(0)}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border flex-wrap">
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Tags ({tags.length})
          </TabsTrigger>
          <TabsTrigger value="sequences" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Sequences ({sequences.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Holiday Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TAG_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : tagsByCategory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Tags className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No tags found</p>
              </CardContent>
            </Card>
          ) : (
            tagsByCategory.map((category) => (
              <Card key={category.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    {category.label}
                    <Badge variant="secondary" className="ml-2">{category.tags.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <div key={tag.id} className="group relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                        <span className="font-medium text-sm">{tag.name}</span>
                        <Badge variant="outline" className="text-xs">{tag.userCount}</Badge>
                        <div className="hidden group-hover:flex items-center gap-1 ml-2">
                          <button onClick={() => viewTagUsers(tag)} className="p-1 hover:bg-gray-200 rounded" title="View Users">
                            <Eye className="h-3 w-3 text-gray-500" />
                          </button>
                          <button onClick={() => { setSelectedTag(tag); setShowEditTag(true); }} className="p-1 hover:bg-gray-200 rounded" title="Edit">
                            <Edit className="h-3 w-3 text-gray-500" />
                          </button>
                          {!tag.isSystem && (
                            <button onClick={() => deleteTag(tag.id)} className="p-1 hover:bg-red-100 rounded" title="Delete">
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Sequences Tab */}
        <TabsContent value="sequences" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Email Sequences</h2>
              <p className="text-sm text-gray-500">Automated email series with conditions and triggers</p>
            </div>
            <Button onClick={() => setShowCreateSequence(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Sequence
            </Button>
          </div>


          {sequencesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : sequences.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Mail className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No sequences created yet</p>
                <Button onClick={() => setShowCreateSequence(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Sequence
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sequences.map((seq) => (
                <Card key={seq.id} className={!seq.isActive ? "opacity-60" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="text-lg">{seq.name}</CardTitle>
                          {seq.description && <CardDescription>{seq.description}</CardDescription>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={seq.isActive ? "default" : "secondary"} className={seq.isActive ? "bg-green-600 text-white" : ""}>{seq.isActive ? "Active" : "Paused"}</Badge>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedSequence(seq); setSequencePreview(null); setShowTestSequence(true); }} title="Test Sequence">
                          <TestTube className="h-4 w-4 mr-1" />Test
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedSequence(seq); setShowEnrollUser(true); }} title="Enroll User">
                          <UserPlus className="h-4 w-4 mr-1" />Enroll
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedSequence(seq); fetchEnrollments(seq.id); setShowEnrollments(true); }} title="View Enrolled Users">
                          <Users className="h-4 w-4 mr-1" />View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => importSequenceEmails(seq.id, seq.name)} title="Reset/Import Emails">
                          <RefreshCw className="h-4 w-4 mr-1" />Reset
                        </Button>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={seq.isActive}
                            onCheckedChange={() => toggleSequenceActive(seq)}
                          />
                          <span className="text-xs text-gray-500">{seq.isActive ? "On" : "Off"}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedSequence(seq); setShowEditSequence(true); }}>
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteSequence(seq.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-gray-500">Trigger:</span>
                        <Badge variant="outline" className="bg-amber-50">{TRIGGER_TYPES.find(t => t.value === seq.triggerType)?.label || seq.triggerType}</Badge>
                        {seq.triggerTag && <Badge variant="outline" style={{ borderColor: seq.triggerTag.color, color: seq.triggerTag.color }}>{seq.triggerTag.name}</Badge>}
                      </div>
                      {seq.courseCategory && (
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-purple-500" />
                          <span className="text-gray-500">Category:</span>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: MINI_DIPLOMA_CATEGORIES.find(c => c.value === seq.courseCategory)?.color || "#6B7280",
                              backgroundColor: `${MINI_DIPLOMA_CATEGORIES.find(c => c.value === seq.courseCategory)?.color}15`,
                              color: MINI_DIPLOMA_CATEGORIES.find(c => c.value === seq.courseCategory)?.color || "#6B7280"
                            }}
                          >
                            {MINI_DIPLOMA_CATEGORIES.find(c => c.value === seq.courseCategory)?.label || seq.courseCategory}
                          </Badge>
                        </div>
                      )}
                      {(seq.exitTag || seq.exitOnReply || seq.exitOnClick) && (
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4 text-red-500" />
                          <span className="text-gray-500">Exit:</span>
                          {seq.exitTag && <Badge variant="outline" style={{ borderColor: seq.exitTag.color, color: seq.exitTag.color }}>{seq.exitTag.name}</Badge>}
                          {seq.exitOnReply && <Badge variant="outline" className="bg-blue-50">On Reply</Badge>}
                          {seq.exitOnClick && <Badge variant="outline" className="bg-green-50">On Click</Badge>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><UserPlus className="h-4 w-4" />{seq.totalEnrolled || seq.enrollmentCount || 0} enrolled</span>
                      <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" />{seq.totalCompleted || 0} completed</span>
                      <span className="flex items-center gap-1"><LogOut className="h-4 w-4 text-orange-500" />{seq.totalExited || 0} exited</span>
                      <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{seq.emailCount} emails</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Email Steps</p>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedSequence(seq); setShowAddEmail(true); }}>
                          <Plus className="h-3 w-3 mr-1" />Add Email
                        </Button>
                      </div>
                      {seq.emails.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed">
                          <Mail className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">No emails in this sequence</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {seq.emails.map((email, index) => (
                            <div key={email.id} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${!email.isActive ? 'opacity-50' : ''}`}>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-medium text-sm">{index + 1}</div>
                                {index < seq.emails.length - 1 && <ArrowRight className="h-4 w-4 text-gray-300" />}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                <Clock className="h-3 w-3" />
                                {email.delayDays > 0 && `${email.delayDays}d `}
                                {email.delayHours > 0 && `${email.delayHours}h`}
                                {email.delayDays === 0 && email.delayHours === 0 && "Immediate"}
                              </div>
                              {(email.requiresTagId || email.skipIfTagId) && (
                                <div className="flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3 text-amber-500" />
                                  <span className="text-xs text-amber-600">Conditional</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{email.customSubject || email.subject || "Untitled"}</p>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{email.sentCount} sent</span>
                                <span className="text-green-600">{email.sentCount > 0 ? `${((email.openCount / email.sentCount) * 100).toFixed(0)}%` : "0%"} open</span>
                                <span className="text-blue-600">{email.sentCount > 0 ? `${((email.clickCount / email.sentCount) * 100).toFixed(0)}%` : "0%"} click</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openPreviewEmail(seq, email)} title="Preview">
                                  <Eye className="h-3 w-3 text-gray-400 hover:text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditEmail(seq, email)} title="Edit">
                                  <Edit className="h-3 w-3 text-gray-400 hover:text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteSequenceEmail(seq.id, email.id)} title="Delete">
                                  <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />Top Performing Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.topEmails && analytics.topEmails.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topEmails.map((email, index) => (
                      <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium">{index + 1}</span>
                          <div>
                            <p className="font-medium text-sm">{email.name}</p>
                            <p className="text-xs text-gray-500">{email.sentCount} sent</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{email.openRate}% open</p>
                          <p className="text-xs text-gray-500">{email.clickRate}% click</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No email data yet</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-blue-600" />Tag Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.tagStats && analytics.tagStats.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.tagStats.map((tag) => (
                      <div key={tag.id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                        <span className="flex-1 text-sm">{tag.name}</span>
                        <Badge variant="secondary">{tag.userCount}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No tag data yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Email Templates</h2>
              <p className="text-sm text-gray-500">Transactional and system email templates</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/admin/emails"}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Open Full Editor
            </Button>
          </div>

          {/* Template Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                  </div>
                  Account Emails
                </CardTitle>
                <CardDescription>Registration, welcome, password reset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Welcome Email
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Password Reset
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Login Credentials
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-green-600" />
                  </div>
                  Mini Diploma
                </CardTitle>
                <CardDescription>Free mini diploma email journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Welcome to Mini Diploma
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Module Completion
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Certificate Ready
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-amber-600" />
                  </div>
                  Engagement
                </CardTitle>
                <CardDescription>Re-engagement and notification emails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Inactivity Reminder
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    New Message Alert
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Coach Message
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-burgundy-50 to-amber-50 border-burgundy-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-burgundy-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-burgundy-800">Need to edit templates?</h3>
                  <p className="text-sm text-burgundy-700 mt-1">
                    Click &quot;Open Full Editor&quot; above to access the complete email template editor where you can preview, edit HTML, and send test emails.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holiday Campaigns Tab */}
        <TabsContent value="holidays" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Holiday Campaigns</h2>
              <p className="text-sm text-gray-500">Special promotional campaigns for holidays and seasonal events</p>
            </div>
          </div>

          {/* Test Email Input */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <Label className="whitespace-nowrap">Test Email:</Label>
                <Input
                  type="email"
                  value={holidayTestEmail}
                  onChange={(e) => setHolidayTestEmail(e.target.value)}
                  placeholder="your@gmail.com"
                  className="max-w-xs bg-white"
                />
                <p className="text-xs text-gray-500">Use for testing all holiday campaigns</p>
              </div>
            </CardContent>
          </Card>

          {/* Christmas Campaign - $997 Main Offer */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Gift className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      Christmas Campaign 2024
                      <Badge className="bg-red-500">Dec 23-26</Badge>
                    </CardTitle>
                    <CardDescription>$997 Full Certification - "Gift to Yourself" angle</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-600">Ready to Send</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 mb-2"><strong>Campaign Strategy:</strong></p>
                <p className="text-sm text-red-700">Target ALL graduates/leads who haven't purchased. Full $997 certification offer with holiday urgency. "Gift to yourself" emotional angle - self-investment, new year preparation, career transformation.</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">3-Email Sequence:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">1</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Dec 23 - "A gift that changes everything"</p>
                      <p className="text-xs text-gray-500">Holiday offer launch, $997 certification</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendHolidayTestEmail("christmas", 0)} disabled={sendingHolidayTest === "christmas-0"}>
                      {sendingHolidayTest === "christmas-0" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">2</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Dec 25 - "What I wished for myself"</p>
                      <p className="text-xs text-gray-500">Christmas morning email, personal story</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendHolidayTestEmail("christmas", 1)} disabled={sendingHolidayTest === "christmas-1"}>
                      {sendingHolidayTest === "christmas-1" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">3</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Dec 26 - "Final hours (deadline midnight)"</p>
                      <p className="text-xs text-gray-500">Final urgency, bonuses expire</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendHolidayTestEmail("christmas", 2)} disabled={sendingHolidayTest === "christmas-2"}>
                      {sendingHolidayTest === "christmas-2" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a href="/admin/marketing/inbox-test" className="inline-flex">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View in Inbox Test
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* New Year Campaign - $997 Main Offer */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      New Year Campaign 2025
                      <Badge className="bg-purple-500">Dec 30 - Jan 2</Badge>
                    </CardTitle>
                    <CardDescription>$997 Full Certification - "New Year, New Career" angle</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-600">Ready to Send</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-800 mb-2"><strong>Campaign Strategy:</strong></p>
                <p className="text-sm text-purple-700">Target ALL graduates/leads who haven't purchased. Full $997 certification. "2025 is YOUR year" angle - new beginnings, fresh start, career transformation. Forward-looking, ambitious tone.</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">3-Email Sequence:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">1</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Dec 30 - "Your 2025 resolution (with teeth)"</p>
                      <p className="text-xs text-gray-500">Resolution that actually works, career path</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendHolidayTestEmail("newyear", 0)} disabled={sendingHolidayTest === "newyear-0"}>
                      {sendingHolidayTest === "newyear-0" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">2</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Jan 1 - "Happy New Year + special offer"</p>
                      <p className="text-xs text-gray-500">New Year wishes, $997 certification offer</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendHolidayTestEmail("newyear", 1)} disabled={sendingHolidayTest === "newyear-1"}>
                      {sendingHolidayTest === "newyear-1" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">3</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Jan 2 - "Start 2025 strong (final hours)"</p>
                      <p className="text-xs text-gray-500">Final urgency, deadline midnight</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendHolidayTestEmail("newyear", 2)} disabled={sendingHolidayTest === "newyear-2"}>
                      {sendingHolidayTest === "newyear-2" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a href="/admin/marketing/inbox-test" className="inline-flex">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View in Inbox Test
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/marketing/inbox-test" className="block">
                  <div className="p-4 bg-burgundy-50 rounded-lg border border-burgundy-100 hover:bg-burgundy-100 transition-colors cursor-pointer">
                    <TestTube className="h-6 w-6 text-burgundy-600 mb-2" />
                    <p className="font-medium text-burgundy-900">Inbox Placement Test</p>
                    <p className="text-xs text-burgundy-600">Test all 35 email variants for Gmail Primary</p>
                  </div>
                </a>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Users className="h-6 w-6 text-gray-600 mb-2" />
                  <p className="font-medium text-gray-900">View Recipients</p>
                  <p className="text-xs text-gray-600">See who will receive holiday campaigns</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                  <BarChart3 className="h-6 w-6 text-gray-600 mb-2" />
                  <p className="font-medium text-gray-900">Campaign Analytics</p>
                  <p className="text-xs text-gray-600">View open rates, clicks, conversions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Tag Dialog */}
      <Dialog open={showCreateTag} onOpenChange={setShowCreateTag}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>Add a custom tag to segment your audience</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={newTag.name} onChange={(e) => { const name = e.target.value; const slug = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""); setNewTag({ ...newTag, name, slug }); }} placeholder="e.g., VIP Customer" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={newTag.slug} onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })} placeholder="e.g., vip_customer" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newTag.category} onValueChange={(v) => setNewTag({ ...newTag, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TAG_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={newTag.color} onChange={(e) => setNewTag({ ...newTag, color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={newTag.color} onChange={(e) => setNewTag({ ...newTag, color: e.target.value })} className="flex-1" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newTag.description} onChange={(e) => setNewTag({ ...newTag, description: e.target.value })} placeholder="What is this tag used for?" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTag(false)}>Cancel</Button>
            <Button onClick={createTag} disabled={!newTag.name || !newTag.slug}>Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={showEditTag} onOpenChange={setShowEditTag}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Tag</DialogTitle></DialogHeader>
          {selectedTag && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={selectedTag.name} onChange={(e) => setSelectedTag({ ...selectedTag, name: e.target.value })} /></div>
              <div><Label>Color</Label><div className="flex items-center gap-2"><input type="color" value={selectedTag.color} onChange={(e) => setSelectedTag({ ...selectedTag, color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" /><Input value={selectedTag.color} onChange={(e) => setSelectedTag({ ...selectedTag, color: e.target.value })} className="flex-1" /></div></div>
              <div><Label>Description</Label><Textarea value={selectedTag.description || ""} onChange={(e) => setSelectedTag({ ...selectedTag, description: e.target.value })} rows={2} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowEditTag(false)}>Cancel</Button><Button onClick={updateTag}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Tag Users Dialog */}
      <Dialog open={showTagUsers} onOpenChange={setShowTagUsers}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTag && (<><div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTag.color }} />{selectedTag.name}<Badge variant="secondary">{selectedTag.userCount} users</Badge></>)}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {tagUsers.length > 0 ? (
              <div className="divide-y">
                {tagUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">{user.firstName?.[0] || user.email[0].toUpperCase()}</div>
                      <div><p className="font-medium">{user.firstName} {user.lastName}</p><p className="text-sm text-gray-500">{user.email}</p></div>
                    </div>
                    <div className="text-right text-sm text-gray-500"><p>Tagged {new Date(user.taggedAt).toLocaleDateString()}</p>{user.source && <p className="text-xs">via {user.source}</p>}</div>
                  </div>
                ))}
              </div>
            ) : (<p className="text-center text-gray-500 py-8">No users with this tag</p>)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Sequence Dialog */}
      <Dialog open={showCreateSequence} onOpenChange={setShowCreateSequence}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Email Sequence</DialogTitle>
            <DialogDescription>Create an automated email series with triggers and conditions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div><Label>Sequence Name</Label><Input value={newSequence.name} onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })} placeholder="e.g., Welcome Series" /></div>
            <div><Label>Description</Label><Textarea value={newSequence.description} onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })} placeholder="What is this sequence for?" rows={2} /></div>
            <div className="border-t pt-4">
              <Label className="text-base font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" />Trigger Conditions</Label>
              <p className="text-xs text-gray-500 mb-3">When should users enter this sequence?</p>
              <div className="space-y-3">
                <div><Label>Trigger Type</Label><Select value={newSequence.triggerType} onValueChange={(v) => setNewSequence({ ...newSequence, triggerType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TRIGGER_TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent></Select></div>
                {newSequence.triggerType === "TAG_ADDED" && (
                  <div><Label>Trigger Tag</Label><Select value={newSequence.triggerTagId} onValueChange={(v) => setNewSequence({ ...newSequence, triggerTagId: v })}><SelectTrigger><SelectValue placeholder="Select a tag" /></SelectTrigger><SelectContent><SelectItem value="none">No trigger tag</SelectItem>{tags.map((tag) => (<SelectItem key={tag.id} value={tag.id}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />{tag.name}</div></SelectItem>))}</SelectContent></Select><p className="text-xs text-gray-500 mt-1">Users will be enrolled when this tag is added</p></div>
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <Label className="text-base font-semibold flex items-center gap-2"><LogOut className="h-4 w-4 text-red-500" />Exit Conditions</Label>
              <p className="text-xs text-gray-500 mb-3">When should users exit this sequence?</p>
              <div className="space-y-3">
                <div><Label>Exit Tag (Optional)</Label><Select value={newSequence.exitTagId} onValueChange={(v) => setNewSequence({ ...newSequence, exitTagId: v })}><SelectTrigger><SelectValue placeholder="Select a tag to exit users" /></SelectTrigger><SelectContent><SelectItem value="none">No exit tag</SelectItem>{tags.map((tag) => (<SelectItem key={tag.id} value={tag.id}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />{tag.name}</div></SelectItem>))}</SelectContent></Select><p className="text-xs text-gray-500 mt-1">Users will exit when this tag is added (e.g., after purchase)</p></div>
                <div className="flex items-center justify-between"><div><Label>Exit on Reply</Label><p className="text-xs text-gray-500">Remove user when they reply to an email</p></div><Switch checked={newSequence.exitOnReply} onCheckedChange={(checked) => setNewSequence({ ...newSequence, exitOnReply: checked })} /></div>
                <div className="flex items-center justify-between"><div><Label>Exit on CTA Click</Label><p className="text-xs text-gray-500">Remove user when they click a CTA link</p></div><Switch checked={newSequence.exitOnClick} onCheckedChange={(checked) => setNewSequence({ ...newSequence, exitOnClick: checked })} /></div>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreateSequence(false)}>Cancel</Button><Button onClick={createSequence} disabled={!newSequence.name}>Create Sequence</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sequence Dialog */}
      <Dialog open={showEditSequence} onOpenChange={setShowEditSequence}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Sequence</DialogTitle></DialogHeader>
          {selectedSequence && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={selectedSequence.name} onChange={(e) => setSelectedSequence({ ...selectedSequence, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={selectedSequence.description || ""} onChange={(e) => setSelectedSequence({ ...selectedSequence, description: e.target.value })} rows={2} /></div>
              <div>
                <Label>Mini Diploma Category</Label>
                <p className="text-xs text-gray-500 mb-2">Only enroll users from this mini diploma (leave empty for all)</p>
                <Select
                  value={selectedSequence.courseCategory || "all"}
                  onValueChange={(v) => setSelectedSequence({ ...selectedSequence, courseCategory: v === "all" ? null : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {MINI_DIPLOMA_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between"><div><Label>Active</Label><p className="text-xs text-gray-500">Enable/disable this sequence</p></div><Switch checked={selectedSequence.isActive} onCheckedChange={(checked) => setSelectedSequence({ ...selectedSequence, isActive: checked })} /></div>
              <div className="flex items-center justify-between"><div><Label>Exit on Reply</Label><p className="text-xs text-gray-500">Remove when user replies</p></div><Switch checked={selectedSequence.exitOnReply} onCheckedChange={(checked) => setSelectedSequence({ ...selectedSequence, exitOnReply: checked })} /></div>
              <div className="flex items-center justify-between"><div><Label>Exit on CTA Click</Label><p className="text-xs text-gray-500">Remove when user clicks CTA</p></div><Switch checked={selectedSequence.exitOnClick} onCheckedChange={(checked) => setSelectedSequence({ ...selectedSequence, exitOnClick: checked })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowEditSequence(false)}>Cancel</Button><Button onClick={updateSequence}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Email to Sequence Dialog */}
      <Dialog open={showAddEmail} onOpenChange={setShowAddEmail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add Email to Sequence</DialogTitle><DialogDescription>{selectedSequence && `Adding to: ${selectedSequence.name}`}</DialogDescription></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div><Label>Email Subject</Label><Input value={newEmail.subject} onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })} placeholder="e.g., Welcome to AccrediPro!" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Delay Days</Label><Input type="number" min="0" value={newEmail.delayDays} onChange={(e) => setNewEmail({ ...newEmail, delayDays: parseInt(e.target.value) || 0 })} /><p className="text-xs text-gray-500 mt-1">Days after previous email</p></div>
              <div><Label>Delay Hours</Label><Input type="number" min="0" max="23" value={newEmail.delayHours} onChange={(e) => setNewEmail({ ...newEmail, delayHours: parseInt(e.target.value) || 0 })} /><p className="text-xs text-gray-500 mt-1">Additional hours</p></div>
            </div>
            <div className="border-t pt-4">
              <Label className="text-sm font-semibold">Conditions (Optional)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div><Label className="text-xs">Only send if user has tag</Label><Select value={newEmail.requiresTagId} onValueChange={(v) => setNewEmail({ ...newEmail, requiresTagId: v })}><SelectTrigger><SelectValue placeholder="No requirement" /></SelectTrigger><SelectContent><SelectItem value="none">No requirement</SelectItem>{tags.map((tag) => (<SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>))}</SelectContent></Select></div>
                <div><Label className="text-xs">Skip if user has tag</Label><Select value={newEmail.skipIfTagId} onValueChange={(v) => setNewEmail({ ...newEmail, skipIfTagId: v })}><SelectTrigger><SelectValue placeholder="No skip rule" /></SelectTrigger><SelectContent><SelectItem value="none">No skip rule</SelectItem>{tags.map((tag) => (<SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>))}</SelectContent></Select></div>
              </div>
            </div>
            <div><Label>Email Content (HTML)</Label><Textarea value={newEmail.htmlContent} onChange={(e) => setNewEmail({ ...newEmail, htmlContent: e.target.value })} placeholder="<p>Hello {{firstName}},</p>..." rows={10} className="font-mono text-sm" /><p className="text-xs text-gray-500 mt-1">Placeholders: {"{{firstName}}"}, {"{{lastName}}"}, {"{{email}}"}, {"{{fullName}}"}</p></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddEmail(false)}>Cancel</Button><Button onClick={addEmailToSequence} disabled={!newEmail.subject}>Add Email</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={showEditEmail} onOpenChange={setShowEditEmail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Email</DialogTitle><DialogDescription>{selectedSequence && `In sequence: ${selectedSequence.name}`}</DialogDescription></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between"><div><Label>Active</Label><p className="text-xs text-gray-500">Enable/disable this email</p></div><Switch checked={editingEmail.isActive} onCheckedChange={(checked) => setEditingEmail({ ...editingEmail, isActive: checked })} /></div>
            <div><Label>Email Subject</Label><Input value={editingEmail.subject} onChange={(e) => setEditingEmail({ ...editingEmail, subject: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Delay Days</Label><Input type="number" min="0" value={editingEmail.delayDays} onChange={(e) => setEditingEmail({ ...editingEmail, delayDays: parseInt(e.target.value) || 0 })} /></div>
              <div><Label>Delay Hours</Label><Input type="number" min="0" max="23" value={editingEmail.delayHours} onChange={(e) => setEditingEmail({ ...editingEmail, delayHours: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="border-t pt-4">
              <Label className="text-sm font-semibold">Conditions</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div><Label className="text-xs">Only send if user has tag</Label><Select value={editingEmail.requiresTagId} onValueChange={(v) => setEditingEmail({ ...editingEmail, requiresTagId: v })}><SelectTrigger><SelectValue placeholder="No requirement" /></SelectTrigger><SelectContent><SelectItem value="none">No requirement</SelectItem>{tags.map((tag) => (<SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>))}</SelectContent></Select></div>
                <div><Label className="text-xs">Skip if user has tag</Label><Select value={editingEmail.skipIfTagId} onValueChange={(v) => setEditingEmail({ ...editingEmail, skipIfTagId: v })}><SelectTrigger><SelectValue placeholder="No skip rule" /></SelectTrigger><SelectContent><SelectItem value="none">No skip rule</SelectItem>{tags.map((tag) => (<SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>))}</SelectContent></Select></div>
              </div>
            </div>
            <div><Label>Email Content (HTML)</Label><Textarea value={editingEmail.htmlContent} onChange={(e) => setEditingEmail({ ...editingEmail, htmlContent: e.target.value })} rows={10} className="font-mono text-sm" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowEditEmail(false)}>Cancel</Button><Button onClick={updateEmail}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Email Dialog */}
      <Dialog open={showPreviewEmail} onOpenChange={setShowPreviewEmail}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader><DialogTitle>Email Preview</DialogTitle><DialogDescription>{selectedEmail && (selectedEmail.customSubject || selectedEmail.subject)}</DialogDescription></DialogHeader>
          {selectedEmail && (
            <div className="border rounded-lg overflow-hidden bg-gray-100">
              <div className="p-4 bg-white border-b">
                <p className="text-sm text-gray-500">Subject: <strong>{selectedEmail.customSubject || selectedEmail.subject}</strong></p>
                <p className="text-sm text-gray-500">Delay: {selectedEmail.delayDays}d {selectedEmail.delayHours}h</p>
              </div>
              <div className="p-4 overflow-auto max-h-[50vh]">
                <div className="bg-white rounded shadow-sm p-4" dangerouslySetInnerHTML={{ __html: selectedEmail.customContent || "<p>No content</p>" }} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { if (selectedEmail && selectedSequence) { openEditEmail(selectedSequence, selectedEmail); setShowPreviewEmail(false); } }}><Edit className="h-4 w-4 mr-2" />Edit Email</Button>
            <Button onClick={() => setShowPreviewEmail(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Sequence Dialog */}
      <Dialog open={showTestSequence} onOpenChange={setShowTestSequence}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><TestTube className="h-5 w-5" />Test Sequence: {selectedSequence?.name}</DialogTitle><DialogDescription>Send test emails individually or test the full sequence</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1"><Label>Test Email Address</Label><Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" /></div>
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={() => testSequence(false)} disabled={testingSequence}>{testingSequence ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4 mr-1" />}Preview</Button>
                <Button
                  onClick={async () => {
                    if (!testEmail || !selectedSequence) {
                      toast.error("Enter test email");
                      return;
                    }
                    setTestingSequence(true);
                    const emails = sequencePreview?.emails || selectedSequence.emails || [];
                    for (let i = 0; i < emails.length; i++) {
                      try {
                        const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/test`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ testEmail, emailIndex: i }),
                        });
                        if (res.ok) {
                          toast.success(`Email ${i + 1}/${emails.length} sent!`);
                        } else {
                          toast.error(`Email ${i + 1} failed`);
                        }
                        if (i < emails.length - 1) {
                          await new Promise(r => setTimeout(r, 1000));
                        }
                      } catch (e) {
                        toast.error(`Error on email ${i + 1}`);
                      }
                    }
                    setTestingSequence(false);
                    toast.success("Full sequence test complete!");
                  }}
                  disabled={testingSequence || !testEmail}
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                >
                  {testingSequence ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-1" />}
                  Test All ({(sequencePreview?.emails || selectedSequence?.emails || []).length})
                </Button>
              </div>
            </div>
            {sequencePreview && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4 max-h-[50vh] overflow-y-auto">
                <div className="flex items-center justify-between"><h3 className="font-semibold">Sequence Flow</h3><Badge>{sequencePreview.totalEmails || 0} emails</Badge></div>
                <div className="flex items-center gap-2 text-sm"><Zap className="h-4 w-4 text-amber-500" /><span>Trigger: {TRIGGER_TYPES.find(t => t.value === sequencePreview.triggerType)?.label || sequencePreview.triggerType}</span>{sequencePreview.triggerTag && <Badge variant="outline" style={{ borderColor: sequencePreview.triggerTag.color }}>{sequencePreview.triggerTag.name}</Badge>}</div>
                {(sequencePreview.exitTag || sequencePreview.exitOnReply || sequencePreview.exitOnClick) && (<div className="flex items-center gap-2 text-sm"><LogOut className="h-4 w-4 text-red-500" /><span>Exit:</span>{sequencePreview.exitTag && <Badge variant="outline">{sequencePreview.exitTag.name}</Badge>}{sequencePreview.exitOnReply && <Badge variant="outline">On Reply</Badge>}{sequencePreview.exitOnClick && <Badge variant="outline">On Click</Badge>}</div>)}
                <div className="space-y-3">
                  {sequencePreview.emails && sequencePreview.emails.length > 0 ? (
                    sequencePreview.emails.map((email: any, index: number) => (
                      <div key={email.id} className="flex gap-3">
                        <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-burgundy-600 text-white flex items-center justify-center text-sm font-medium">{index + 1}</div>{index < sequencePreview.emails.length - 1 && <div className="w-0.5 flex-1 bg-gray-300 mt-2" />}</div>
                        <div className="flex-1 pb-4">
                          <div className="bg-white rounded-lg border p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">{email.subject}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs"><Clock className="h-3 w-3 mr-1" />{email.totalDelayFormatted}</Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={testingSequence || !testEmail}
                                  onClick={async () => {
                                    if (!testEmail || !selectedSequence) return;
                                    try {
                                      const res = await fetch(`/api/admin/marketing/sequences/${selectedSequence.id}/test`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ testEmail, emailIndex: index }),
                                      });
                                      if (res.ok) {
                                        toast.success(`Email ${index + 1} sent to ${testEmail}!`);
                                      } else {
                                        toast.error("Failed to send test");
                                      }
                                    } catch (e) {
                                      toast.error("Error sending test");
                                    }
                                  }}
                                >
                                  <Send className="h-3 w-3 mr-1" />Send
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{(email.contentPreview || "").replace(/<[^>]*>/g, "")}...</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400"><span>{email.sentCount || 0} sent</span><span>{email.openCount || 0} opened</span><span>{email.clickCount || 0} clicked</span></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">No emails in this sequence</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowTestSequence(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enroll User Dialog */}
      <Dialog open={showEnrollUser} onOpenChange={(open) => { setShowEnrollUser(open); if (open) fetchSubscribers(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Enroll Users in Sequence</DialogTitle>
            <DialogDescription>{selectedSequence && `Enrolling in: ${selectedSequence.name}`}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Quick enroll by email */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <Label className="text-sm font-medium">Quick Enroll by Email</Label>
              <div className="flex gap-2 mt-2">
                <Input value={enrollEmail} onChange={(e) => setEnrollEmail(e.target.value)} placeholder="user@example.com" type="email" className="flex-1" />
                <Button onClick={enrollUser} disabled={enrolling || !enrollEmail} size="sm">
                  {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Subscriber search */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Search & Select Subscribers</Label>
                <span className="text-xs text-gray-500">{subscribersTotal} total subscribers</span>
              </div>
              <Input
                placeholder="Search by email or name..."
                value={subscriberSearch}
                onChange={(e) => { setSubscriberSearch(e.target.value); fetchSubscribers(e.target.value); }}
              />
              <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg">
                {subscribersLoading ? (
                  <div className="flex items-center justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
                ) : subscribers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">No subscribers found</div>
                ) : (
                  subscribers.map((sub) => (
                    <div key={sub.id} className={`flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${selectedSubscribers.includes(sub.id) ? "bg-burgundy-50" : ""}`} onClick={() => setSelectedSubscribers(prev => prev.includes(sub.id) ? prev.filter(id => id !== sub.id) : [...prev, sub.id])}>
                      <input type="checkbox" checked={selectedSubscribers.includes(sub.id)} readOnly className="h-4 w-4 rounded border-gray-300" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{sub.name}</p>
                        <p className="text-xs text-gray-500 truncate">{sub.email}</p>
                      </div>
                      {sub.tags?.length > 0 && (
                        <div className="flex gap-1">
                          {sub.tags.slice(0, 2).map((tag: any) => (
                            <span key={tag.id} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>{tag.name}</span>
                          ))}
                          {sub.tags.length > 2 && <span className="text-xs text-gray-400">+{sub.tags.length - 2}</span>}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {selectedSubscribers.length > 0 && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-burgundy-600 font-medium">{selectedSubscribers.length} selected</span>
                  <Button size="sm" onClick={enrollSelected} disabled={enrolling}>
                    {enrolling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    Enroll Selected
                  </Button>
                </div>
              )}
            </div>

            {selectedSequence && !selectedSequence.isActive && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>This sequence is paused. Activate it to start sending emails.</span>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEnrollUser(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => setShowEnrollAllConfirm(true)} disabled={enrollingAll} className="bg-burgundy-50 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-100">
              {enrollingAll ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Users className="h-4 w-4 mr-2" />}
              Enroll All ({subscribersTotal})
            </Button>
          </DialogFooter>

          {/* Enroll All Confirmation Dialog */}
          {showEnrollAllConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
              <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">⚠️ Confirm Bulk Enrollment</h3>
                <p className="text-slate-600 mb-4">
                  You are about to enroll <span className="font-bold text-burgundy-600">{subscribersTotal} subscribers</span> into the sequence:
                </p>
                <p className="font-semibold text-slate-900 mb-4 p-3 bg-slate-50 rounded-lg">
                  {selectedSequence?.name}
                </p>
                <p className="text-sm text-amber-600 mb-4">
                  This cannot be easily undone. Are you sure you want to proceed?
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowEnrollAllConfirm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={enrollAllSubscribers} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    Yes, Enroll All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Enrollments Dialog */}
      <Dialog open={showEnrollments} onOpenChange={setShowEnrollments}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Enrollments{selectedSequence && `: ${selectedSequence.name}`}</DialogTitle><DialogDescription>Users enrolled in this sequence and their tags</DialogDescription></DialogHeader>
          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className="bg-burgundy-50"><span className="text-burgundy-600">{enrollmentCounts.ACTIVE} Active</span></Badge>
            <Badge variant="outline" className="bg-blue-50"><span className="text-blue-600">{enrollmentCounts.COMPLETED} Completed</span></Badge>
            <Badge variant="outline" className="bg-red-50"><span className="text-red-600">{enrollmentCounts.EXITED} Exited</span></Badge>
          </div>
          <div className="flex-1 overflow-y-auto">
            {enrollmentsLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No enrollments yet</div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-600 font-medium">
                          {enrollment.user.name?.[0] || enrollment.user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{enrollment.user.name || enrollment.user.email}</p>
                          <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={enrollment.status === "ACTIVE" ? "default" : enrollment.status === "COMPLETED" ? "secondary" : "outline"} className={enrollment.status === "ACTIVE" ? "bg-burgundy-600 text-white" : enrollment.status === "COMPLETED" ? "bg-blue-500" : ""}>{enrollment.status}</Badge>
                        {enrollment.status === "ACTIVE" ? (
                          <Button variant="ghost" size="sm" onClick={() => removeEnrollment(enrollment.user.id, false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2">
                            <Trash2 className="h-3 w-3 mr-1" />Remove
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => removeEnrollment(enrollment.user.id, true)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2">
                            <Trash2 className="h-3 w-3 mr-1" />Delete
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {enrollment.user.tags && enrollment.user.tags.length > 0 ? (
                        enrollment.user.tags.map((tag: any) => (
                          <Badge key={tag.id} variant="outline" className="text-xs" style={{ borderColor: tag.color, color: tag.color }}>{tag.name}</Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      <span>Emails: {enrollment.emailsReceived || 0}/{enrollment.totalEmails || "?"}</span>
                      <span>Opened: {enrollment.emailsOpened || 0}</span>
                      <span>Clicked: {enrollment.emailsClicked || 0}</span>
                      {enrollment.nextSendAt && <span>Next: {new Date(enrollment.nextSendAt).toLocaleString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => setShowRemoveAllConfirm(true)} disabled={removingAll || enrollments.length === 0}>
              {removingAll ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Remove All ({enrollments.length})
            </Button>
            <Button variant="outline" onClick={() => setShowEnrollments(false)}>Close</Button>
          </DialogFooter>

          {/* Remove All Confirmation */}
          {showRemoveAllConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
              <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
                <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Remove All Enrollments</h3>
                <p className="text-slate-600 mb-4">
                  You are about to remove <span className="font-bold text-red-600">{enrollments.length} enrollments</span> from:
                </p>
                <p className="font-semibold text-slate-900 mb-4 p-3 bg-slate-50 rounded-lg">
                  {selectedSequence?.name}
                </p>
                <p className="text-sm text-red-600 mb-4">
                  This will permanently delete all enrollment records. This action cannot be undone!
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowRemoveAllConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={removeAllEnrollments}>
                    Yes, Remove All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Nurture Sequence Enroll Dialog */}
      <Dialog open={showNurtureEnroll} onOpenChange={setShowNurtureEnroll}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-burgundy-600" />
              Enroll User in Nurture Sequence
            </DialogTitle>
            <DialogDescription>
              Add a user to the 30-day Mini Diploma → Certification nurture sequence
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="enroll-email">Email Address</Label>
              <Input
                id="enroll-email"
                type="email"
                placeholder="user@example.com"
                value={nurtureEnrollEmail}
                onChange={(e) => setNurtureEnrollEmail(e.target.value)}
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                If the user doesn&apos;t exist, a new account will be created
              </p>
            </div>
            <div className="bg-burgundy-50 border border-burgundy-100 rounded-lg p-3">
              <p className="text-sm text-burgundy-700">
                <strong>Sequence:</strong> Mini Diploma → Certification
              </p>
              <p className="text-xs text-burgundy-600 mt-1">
                29 emails: 17 nurture + 3 downsell + 9 recovery
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> This adds a marketing tag to track enrollment.
                Actual emails are sent via scheduled jobs or manual triggers from Inbox Test.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNurtureEnroll(false); setNurtureEnrollEmail(""); }}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!nurtureEnrollEmail) {
                  toast.error("Please enter an email address");
                  return;
                }
                setNurtureEnrolling(true);
                try {
                  const res = await fetch("/api/admin/marketing/enroll", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: nurtureEnrollEmail, sequenceId: "nurture-30-day" })
                  });
                  const data = await res.json();
                  if (data.success) {
                    toast.success(
                      <div>
                        <p className="font-medium">Enrolled successfully!</p>
                        <p className="text-sm text-gray-600">User ID: {data.userId}</p>
                        <p className="text-sm text-gray-600">Tagged with: nurture-30-day</p>
                        {data.firstEmailSent && (
                          <p className="text-sm text-green-600 font-medium">✓ First email sent!</p>
                        )}
                        {data.firstEmailError && (
                          <p className="text-sm text-red-600">⚠ Email error: {data.firstEmailError}</p>
                        )}
                      </div>,
                      { duration: 5000 }
                    );
                    setShowNurtureEnroll(false);
                    setNurtureEnrollEmail("");
                    // Refresh tags to show updated count
                    fetchTags();
                  } else {
                    toast.error(data.error || "Failed to enroll user");
                    // Still close dialog and refresh
                    setShowNurtureEnroll(false);
                    setNurtureEnrollEmail("");
                    fetchTags();
                  }
                } catch (err) {
                  console.error("Enroll error:", err);
                  toast.error("Failed to enroll user");
                } finally {
                  setNurtureEnrolling(false);
                }
              }}
              disabled={nurtureEnrolling || !nurtureEnrollEmail}
            >
              {nurtureEnrolling ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enrolling...</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" />Enroll User</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nurture Email Preview Dialog */}
      <Dialog open={showNurtureEmailPreview} onOpenChange={setShowNurtureEmailPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-burgundy-600" />
              Email Preview
            </DialogTitle>
            {selectedNurtureEmail && (
              <DialogDescription>
                Day {selectedNurtureEmail.day}: {selectedNurtureEmail.name}
              </DialogDescription>
            )}
          </DialogHeader>
          {selectedNurtureEmail && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-medium">Sarah &lt;sarah@accredipro-certificate.com&gt;</p>
                  </div>
                  <Badge variant="outline">Day {selectedNurtureEmail.day}</Badge>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="font-medium text-lg">{selectedNurtureEmail.subject}</p>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-6 min-h-[200px]">
                <p className="text-gray-500 text-center">
                  Email content is managed in the code.<br />
                  <a href="/admin/marketing/inbox-test" className="text-burgundy-600 hover:underline mt-2 inline-block">
                    View full email preview in Inbox Test →
                  </a>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <a href="/admin/marketing/inbox-test">
              <Button variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                Open in Inbox Test
              </Button>
            </a>
            <Button onClick={() => setShowNurtureEmailPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nurture Email Edit/View HTML Dialog */}
      <Dialog open={showNurtureEmailEdit} onOpenChange={setShowNurtureEmailEdit}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-burgundy-600" />
              Email HTML Content
            </DialogTitle>
            {selectedNurtureEmail && (
              <DialogDescription>
                Day {selectedNurtureEmail.day}: {selectedNurtureEmail.name} - {selectedNurtureEmail.subject}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
            <div className="bg-gray-50 rounded-lg border p-3">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> These templates are stored in the codebase. Changes made here are for preview only.
                To permanently edit, update the email templates in <code className="bg-gray-200 px-1 rounded">src/lib/email-templates/</code>
              </p>
            </div>
            {loadingNurtureHtml ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-burgundy-600" />
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                {/* HTML Editor */}
                <div className="flex flex-col min-h-0">
                  <Label className="mb-2 text-sm font-medium">HTML Source</Label>
                  <Textarea
                    value={nurtureEmailHtml}
                    onChange={(e) => setNurtureEmailHtml(e.target.value)}
                    className="flex-1 font-mono text-xs resize-none min-h-[400px]"
                    placeholder="Loading email HTML..."
                  />
                </div>
                {/* Preview */}
                <div className="flex flex-col min-h-0">
                  <Label className="mb-2 text-sm font-medium">Preview</Label>
                  <div className="flex-1 border rounded-lg overflow-auto bg-white p-4 min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: nurtureEmailHtml }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(nurtureEmailHtml).then(() => toast.success("HTML copied to clipboard"))}>
              Copy HTML
            </Button>
            <a href="/admin/marketing/inbox-test">
              <Button variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                Open in Inbox Test
              </Button>
            </a>
            <Button onClick={() => setShowNurtureEmailEdit(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Sequence Test Dialog - Send all 17 emails with 1 second delay */}
      <Dialog open={showFullSequenceTest} onOpenChange={(open) => {
        if (!fullSequenceTestRunning) {
          setShowFullSequenceTest(open);
          if (!open) {
            setFullSequenceTestEmail("");
            setFullSequenceTestLog([]);
            setFullSequenceTestProgress(0);
          }
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-burgundy-600" />
              Test Full Nurture Sequence
            </DialogTitle>
            <DialogDescription>
              Send all 17 nurture emails with 1 second delay between each
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="full-test-email">Test Email Address</Label>
              <Input
                id="full-test-email"
                type="email"
                placeholder="your-email@example.com"
                value={fullSequenceTestEmail}
                onChange={(e) => setFullSequenceTestEmail(e.target.value)}
                disabled={fullSequenceTestRunning}
                className="mt-1.5"
              />
            </div>

            {fullSequenceTestRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sending emails...</span>
                  <span className="font-medium">{fullSequenceTestProgress}/{fullSequenceTestTotal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-burgundy-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(fullSequenceTestProgress / fullSequenceTestTotal) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {fullSequenceTestLog.length > 0 && (
              <div className="bg-gray-50 border rounded-lg p-3 max-h-48 overflow-y-auto">
                <div className="space-y-1 text-xs font-mono">
                  {fullSequenceTestLog.map((log, i) => (
                    <div key={i} className={log.includes("✓") ? "text-green-600" : log.includes("✗") ? "text-red-600" : "text-gray-600"}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <strong>Warning:</strong> This will send 17 real emails to the specified address.
                Make sure to use a test email address you have access to.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFullSequenceTest(false);
                setFullSequenceTestEmail("");
                setFullSequenceTestLog([]);
                setFullSequenceTestProgress(0);
              }}
              disabled={fullSequenceTestRunning}
            >
              {fullSequenceTestRunning ? "Running..." : "Cancel"}
            </Button>
            <Button
              onClick={async () => {
                if (!fullSequenceTestEmail) {
                  toast.error("Please enter an email address");
                  return;
                }

                setFullSequenceTestRunning(true);
                setFullSequenceTestTotal(17);
                setFullSequenceTestProgress(0);
                setFullSequenceTestLog([`Starting full sequence test to ${fullSequenceTestEmail}...`]);

                let successCount = 0;
                let failCount = 0;

                for (let variantId = 1; variantId <= 17; variantId++) {
                  try {
                    setFullSequenceTestLog(prev => [...prev, `Sending email ${variantId}/17...`]);

                    const res = await fetch("/api/admin/marketing/inbox-test", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ variantId, testEmail: fullSequenceTestEmail })
                    });

                    const data = await res.json();

                    if (res.ok && data.success) {
                      successCount++;
                      setFullSequenceTestLog(prev => [...prev, `✓ Email ${variantId} sent (Day ${data.day})`]);
                    } else {
                      failCount++;
                      setFullSequenceTestLog(prev => [...prev, `✗ Email ${variantId} failed: ${data.error || "Unknown error"}`]);
                    }
                  } catch (err) {
                    failCount++;
                    setFullSequenceTestLog(prev => [...prev, `✗ Email ${variantId} error: ${err instanceof Error ? err.message : "Network error"}`]);
                  }

                  setFullSequenceTestProgress(variantId);

                  // Wait 1 second before sending next email (except for the last one)
                  if (variantId < 17) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                  }
                }

                setFullSequenceTestLog(prev => [...prev, ``, `Completed: ${successCount} sent, ${failCount} failed`]);
                setFullSequenceTestRunning(false);

                if (failCount === 0) {
                  toast.success(`All 17 emails sent successfully to ${fullSequenceTestEmail}!`);
                } else if (successCount > 0) {
                  toast.warning(`${successCount}/17 emails sent. ${failCount} failed.`);
                } else {
                  toast.error("All emails failed to send");
                }
              }}
              disabled={fullSequenceTestRunning || !fullSequenceTestEmail}
            >
              {fullSequenceTestRunning ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending {fullSequenceTestProgress}/17...</>
              ) : (
                <><Send className="h-4 w-4 mr-2" />Send All 17 Emails</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nurture Enrollees Dialog */}
      <Dialog open={showNurtureEnrollees} onOpenChange={setShowNurtureEnrollees}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nurture Sequence Enrollees</DialogTitle>
            <DialogDescription>
              Users tagged with nurture-30-day and enrolled in the 30-day nurture sequence
            </DialogDescription>
          </DialogHeader>

          {nurtureEnrolleesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : nurtureEnrollees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No enrollees found</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-4">
                {nurtureEnrollees.length} total enrollees
              </p>
              {nurtureEnrollees.map((enrollee: any) => (
                <div key={enrollee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-medium text-sm">
                      {enrollee.firstName?.[0] || enrollee.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {enrollee.firstName} {enrollee.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{enrollee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {enrollee.enrolledAt && (
                      <span className="text-xs text-gray-400">
                        Enrolled: {new Date(enrollee.enrolledAt).toLocaleDateString()}
                      </span>
                    )}
                    {enrollee.currentEmailIndex !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Email {enrollee.currentEmailIndex + 1}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNurtureEnrollee(enrollee.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNurtureEnrollees(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
