"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Search,
  Mail,
  MessageSquare,
  BookOpen,
  Award,
  MoreVertical,
  UserPlus,
  Download,
  Bot, // Import Bot icon
  GraduationCap,
  Flame,
  Star,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Activity,
  Target,
  TrendingUp,
  Trash2,
  AlertTriangle,
  Tag,
  Lock,
  Phone,
  UserCog,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  leadSource: string | null;
  leadSourceDetail: string | null;
  knowledgeBase?: string | null; // Add knowledgeBase type
  // Onboarding lead data
  hasCompletedOnboarding: boolean;
  learningGoal: string | null;
  experienceLevel: string | null;
  focusAreas: string[];
  bio: string | null;
  enrollments: {
    id: string;
    progress: number;
    status: string;
    course: {
      id: string;
      title: string;
      slug: string;
    };
  }[];
  streak: UserStreak | null;
  tags: {
    id: string;
    tag: string;
    value: string | null;
    createdAt: Date;
  }[];
  _count: {
    certificates: number;
    progress: number;
    receivedMessages: number;
    sentMessages: number;
  };
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface UsersClientProps {
  users: User[];
  courses: Course[];
}

export function UsersClient({ users, courses }: UsersClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Dialog states
  const [dmDialogOpen, setDmDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deletingUsers, setDeletingUsers] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState<string[]>([]);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Knowledge Base Dialog state
  const [knowledgeDialogOpen, setKnowledgeDialogOpen] = useState(false);
  const [knowledgeBaseContent, setKnowledgeBaseContent] = useState("");
  const [savingKnowledge, setSavingKnowledge] = useState(false);

  // Activity tab states for dispute resolution
  const [detailTab, setDetailTab] = useState<"overview" | "tags" | "activity">("overview");
  const [activityData, setActivityData] = useState<any>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Role change state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [changingRole, setChangingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Create user state
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "STUDENT",
    tags: [] as string[],
  });
  const [createUserError, setCreateUserError] = useState("");
  const [createUserSuccess, setCreateUserSuccess] = useState(false);

  // Add tag state
  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [addingTag, setAddingTag] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  // Common tags for quick selection
  const COMMON_TAGS = [
    "enrolled_functional_medicine",
    "enrolled_health_coach",
    "lead:hot",
    "lead:warm",
    "lead:cold",
    "vip_customer",
    "needs_support",
    "upsell_candidate",
    "referral_partner",
  ];

  // Fetch existing tags when dialog opens
  const fetchExistingTags = async () => {
    setLoadingTags(true);
    try {
      const res = await fetch("/api/admin/users/tags");
      if (res.ok) {
        const data = await res.json();
        setExistingTags(data.tags || []);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const fetchUserActivity = async (userId: string) => {
    console.log('Fetching activity for user:', userId);
    setLoadingActivity(true);
    try {
      const res = await fetch(`/api/admin/user-activity?userId=${userId}`);
      console.log('Activity API response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Activity data received:', data);
        // Ensure data has default values
        setActivityData({
          stats: data.stats || {
            totalLogins: 0,
            firstLogin: null,
            lastLogin: null,
            accountCreated: new Date().toISOString(),
            lessonsCompleted: 0,
            totalWatchTime: 0,
            certificatesEarned: 0,
          },
          loginHistory: data.loginHistory || [],
          enrollments: data.enrollments || [],
          lessonProgress: data.lessonProgress || [],
          certificates: data.certificates || [],
          activityLogs: data.activityLogs || [],
        });
      } else {
        console.error('Activity API error:', res.status);
        // Set empty data so UI shows "no data" instead of loading forever
        setActivityData({
          stats: { totalLogins: 0, firstLogin: null, lastLogin: null, accountCreated: new Date().toISOString(), lessonsCompleted: 0, totalWatchTime: 0, certificatesEarned: 0 },
          loginHistory: [],
          enrollments: [],
          lessonProgress: [],
          certificates: [],
          activityLogs: [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      // Set empty data on error
      setActivityData({
        stats: { totalLogins: 0, firstLogin: null, lastLogin: null, accountCreated: new Date().toISOString(), lessonsCompleted: 0, totalWatchTime: 0, certificatesEarned: 0 },
        loginHistory: [],
        enrollments: [],
        lessonProgress: [],
        certificates: [],
        activityLogs: [],
      });
    } finally {
      setLoadingActivity(false);
    }
  };

  // Auto-fetch activity data when activity tab is selected
  useEffect(() => {
    if (detailTab === "activity" && selectedUser && !activityData && !loadingActivity) {
      fetchUserActivity(selectedUser.id);
    }
  }, [detailTab, selectedUser, activityData, loadingActivity]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.isActive) ||
      (statusFilter === "INACTIVE" && !user.isActive) ||
      (statusFilter === "ENROLLED" && user.enrollments.length > 0) ||
      (statusFilter === "NOT_ENROLLED" && user.enrollments.length === 0);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleBulkDM = async () => {
    if (selectedUsers.length === 0) return;
    const message = prompt("Enter message to send to selected users:");
    if (!message) return;

    try {
      const response = await fetch("/api/admin/bulk-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers, message }),
      });
      if (response.ok) {
        alert(`Message sent to ${selectedUsers.length} users!`);
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Failed to send bulk DM:", error);
    }
  };

  const handleDeleteUsers = async () => {
    if (usersToDelete.length === 0) return;
    setDeletingUsers(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: usersToDelete }),
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setUsersToDelete([]);
        setSelectedUsers([]);
        setSelectedUser(null);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete users");
      }
    } catch (error) {
      console.error("Failed to delete users:", error);
      alert("Failed to delete users");
    } finally {
      setDeletingUsers(false);
    }
  };

  const openDeleteDialog = (userIds: string[]) => {
    setUsersToDelete(userIds);
    setDeleteDialogOpen(true);
  };

  const handleEnrollUser = async (userId: string, courseId: string) => {
    try {
      const response = await fetch("/api/admin/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId }),
      });
      if (response.ok) {
        setEnrollDialogOpen(false);
        setSelectedUser(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to enroll user:", error);
    }
  };

  const handleSendDM = async () => {
    if (!selectedUser || !messageContent.trim()) return;
    setSendingMessage(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: messageContent,
        }),
      });
      if (response.ok) {
        setDmDialogOpen(false);
        setMessageContent("");
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to send DM:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedUser || !emailSubject.trim() || !emailContent.trim()) return;
    setSendingMessage(true);
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: selectedUser.email,
          subject: emailSubject,
          content: emailContent,
        }),
      });
      if (response.ok) {
        setEmailDialogOpen(false);
        setEmailSubject("");
        setEmailContent("");
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const openDmDialog = (user: User) => {
    setSelectedUser(user);
    setDmDialogOpen(true);
  };

  const openEmailDialog = (user: User) => {
    setSelectedUser(user);
    setEmailDialogOpen(true);
  };

  const openEnrollDialog = (user: User) => {
    setSelectedUser(user);
    setEnrollDialogOpen(true);
  };

  const openDetailDialog = (user: User) => {
    setSelectedUser(user);
    setDetailTab("overview");
    setActivityData(null);
    setDetailDialogOpen(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordDialogOpen(true);
  };

  const openKnowledgeDialog = (user: User) => {
    setSelectedUser(user);
    setKnowledgeBaseContent(user.knowledgeBase || "");
    setKnowledgeDialogOpen(true);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setChangingRole(true);
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: selectedRole,
        }),
      });
      if (response.ok) {
        setRoleDialogOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to change role:", error);
    } finally {
      setChangingRole(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password) return;
    setCreatingUser(true);
    setCreateUserError("");
    setCreateUserSuccess(false);
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserData.email,
          password: newUserData.password,
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          role: newUserData.role,
          tags: newUserData.tags,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setCreateUserSuccess(true);
        setTimeout(() => {
          setCreateUserDialogOpen(false);
          setCreateUserSuccess(false);
          setNewUserData({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            role: "STUDENT",
            tags: [],
          });
          router.refresh();
        }, 1500);
      } else {
        setCreateUserError(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      setCreateUserError("Network error. Please try again.");
    } finally {
      setCreatingUser(false);
    }
  };

  const openAddTagDialog = (user: User) => {
    setSelectedUser(user);
    setNewTag("");
    setTagSearch("");
    setAddTagDialogOpen(true);
    fetchExistingTags();
  };

  const handleAddTag = async () => {
    if (!selectedUser || !newTag.trim()) return;
    setAddingTag(true);
    try {
      const response = await fetch("/api/admin/users/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          tag: newTag.trim(),
        }),
      });
      if (response.ok) {
        setAddTagDialogOpen(false);
        setNewTag("");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add tag");
      }
    } catch (error) {
      console.error("Failed to add tag:", error);
      alert("Failed to add tag");
    } finally {
      setAddingTag(false);
    }
  };

  const handleSaveKnowledge = async () => {
    if (!selectedUser) return;
    setSavingKnowledge(true);
    try {
      // we reuse the profile API but we need to pass userId?
      // No, the profile API uses session.user.id. 
      // We need a NEW admin endpoint or modify the profile endpoint to accept userId if ADMIN.
      // Or we create /api/admin/users/knowledge endpoint.
      // Let's create a new endpoint /api/admin/users/knowledge for clarity.
      const response = await fetch("/api/admin/users/knowledge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          knowledgeBase: knowledgeBaseContent,
        }),
      });

      if (response.ok) {
        alert("Knowledge base updated successfully");
        setKnowledgeDialogOpen(false);
        router.refresh(); // Refresh to update the user list data
      } else {
        alert("Failed to update knowledge base");
      }
    } catch (error) {
      console.error("Failed to update knowledge base:", error);
      alert("Error updating knowledge base");
    } finally {
      setSavingKnowledge(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedUser) return;
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/admin/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully");
        setPasswordDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setSelectedUser(null);
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("An error occurred while updating the password");
    } finally {
      setChangingPassword(false);
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 border-red-200",
    INSTRUCTOR: "bg-purple-100 text-purple-700 border-purple-200",
    MENTOR: "bg-blue-100 text-blue-700 border-blue-200",
    STUDENT: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(date);
  };

  // Calculate stats
  const totalStudents = users.filter((u) => u.role === "STUDENT").length;
  const activeStudents = users.filter((u) => u.role === "STUDENT" && u.enrollments.length > 0).length;
  const completedCertificates = users.reduce((acc, u) => acc + u._count.certificates, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all users in your platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => setCreateUserDialogOpen(true)}
            className="bg-burgundy-600 hover:bg-burgundy-700 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-burgundy-50 to-white border-burgundy-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-burgundy-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Learners</p>
                <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gold-50 to-white border-gold-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Certificates Issued</p>
                <p className="text-2xl font-bold text-gray-900">{completedCertificates}</p>
              </div>
              <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-gold-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrollment Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 text-gray-700"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="INSTRUCTOR">Instructors</option>
                <option value="MENTOR">Mentors</option>
                <option value="ADMIN">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 text-gray-700"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="NOT_ENROLLED">Not Enrolled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="bg-burgundy-50 border-burgundy-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-burgundy-700 font-medium">
                {selectedUsers.length} user(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDM}
                  className="gap-2 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Bulk DM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(selectedUsers)}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                  className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-100"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Users Table */}
      <Card className="">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Engagement</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
                  const avgProgress = user.enrollments.length > 0
                    ? Math.round(user.enrollments.reduce((acc, e) => acc + Number(e.progress), 0) / user.enrollments.length)
                    : 0;
                  const completedCourses = user.enrollments.filter((e) => e.status === "COMPLETED").length;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            {user.phone && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-green-500" />
                                {user.phone}
                              </p>
                            )}
                            {user.leadSource && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                via {user.leadSource}{user.leadSourceDetail ? ` - ${user.leadSourceDetail}` : ""}
                              </p>
                            )}
                            {user.tags && user.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Tag className="w-3 h-3 text-purple-500" />
                                <span className="text-xs text-purple-600">{user.tags.length} tag{user.tags.length > 1 ? "s" : ""}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <Badge className={`border ${roleColors[user.role] || roleColors.STUDENT}`}>
                            {user.role}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="text-xs text-gray-500">{user.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2 min-w-[140px]">
                          {user.enrollments.length > 0 ? (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{user.enrollments.length} course(s)</span>
                                <span className="font-medium text-burgundy-600">{avgProgress}%</span>
                              </div>
                              <Progress value={avgProgress} className="h-1.5" />
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3 text-gold-500" />
                                  {user._count.certificates}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3 text-green-500" />
                                  {completedCourses} done
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Not enrolled</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 min-w-[100px]">
                          {user.streak ? (
                            <>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="font-medium">{user.streak.currentStreak} day streak</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Star className="w-3 h-3 text-gold-500" />
                                <span>{user.streak.totalPoints.toLocaleString()} points</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">No activity</span>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{user._count.sentMessages + user._count.receivedMessages} messages</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            {formatRelativeTime(user.lastLoginAt)}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Joined {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailDialog(user)}
                            className="hover:bg-burgundy-50 text-gray-600 hover:text-burgundy-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-burgundy-50">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white">
                              <DropdownMenuItem
                                onClick={() => openEmailDialog(user)}
                                className="cursor-pointer"
                              >
                                <Mail className="w-4 h-4 mr-2 text-burgundy-600" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDmDialog(user)}
                                className="cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4 mr-2 text-burgundy-600" />
                                Send Direct Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openEnrollDialog(user)}
                                className="cursor-pointer"
                              >
                                <GraduationCap className="w-4 h-4 mr-2 text-burgundy-600" />
                                Enroll in Course
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDetailDialog(user)}
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2 text-burgundy-600" />
                                View Full Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { openDetailDialog(user); setTimeout(() => setDetailTab("activity"), 100); }}
                                className="cursor-pointer bg-blue-50 text-blue-700"
                              >
                                🛡️ View Activity (Disputes)
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openPasswordDialog(user)}
                                className="cursor-pointer"
                              >
                                <Lock className="w-4 h-4 mr-2 text-burgundy-600" />
                                Change Password
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openRoleDialog(user)}
                                className="cursor-pointer"
                              >
                                <UserCog className="w-4 h-4 mr-2 text-purple-600" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openAddTagDialog(user)}
                                className="cursor-pointer"
                              >
                                <Tag className="w-4 h-4 mr-2 text-green-600" />
                                Add Tag
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openKnowledgeDialog(user)}
                                className="cursor-pointer"
                              >
                                <Bot className="w-4 h-4 mr-2 text-indigo-600" />
                                Manage AI Knowledge
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog([user.id])}
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.firstName} {selectedUser?.lastName}.
              This will immediately update their login credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 chars)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              disabled={changingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="bg-burgundy-600 hover:bg-burgundy-700"
              disabled={changingPassword || !newPassword || !confirmPassword}
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Knowledge Base Dialog */}
      <Dialog open={knowledgeDialogOpen} onOpenChange={setKnowledgeDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage AI Knowledge Base</DialogTitle>
            <DialogDescription>
              Edit the custom knowledge base for {selectedUser?.firstName} {selectedUser?.lastName}.
              The AI will use this information when generating replies for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={knowledgeBaseContent}
              onChange={(e) => setKnowledgeBaseContent(e.target.value)}
              placeholder="Enter protocols, FAQs, pricing, etc..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setKnowledgeDialogOpen(false)}
              disabled={savingKnowledge}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveKnowledge}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={savingKnowledge}
            >
              {savingKnowledge ? "Saving..." : "Save Knowledge Base"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog - Enhanced with Activity Tab for Disputes */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedUser && (
                <>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedUser.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                      {`${selectedUser.firstName?.charAt(0) || ""}${selectedUser.lastName?.charAt(0) || ""}`.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                    <p className="text-sm text-gray-500 font-normal">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-sm text-gray-500 font-normal flex items-center gap-1">
                        <Phone className="w-3 h-3 text-green-500" />
                        {selectedUser.phone}
                      </p>
                    )}
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <>
              {/* Tabs */}
              <div className="flex border-b mt-4">
                <button
                  onClick={() => setDetailTab("overview")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${detailTab === "overview" ? "border-burgundy-600 text-burgundy-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setDetailTab("tags")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${detailTab === "tags" ? "border-burgundy-600 text-burgundy-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  🏷️ Tags
                  {selectedUser.tags && selectedUser.tags.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{selectedUser.tags.length}</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDetailTab("activity");
                    if (!activityData && !loadingActivity) {
                      fetchUserActivity(selectedUser.id);
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${detailTab === "activity" ? "border-burgundy-600 text-burgundy-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  🛡️ Activity & Disputes
                </button>
              </div>

              {detailTab === "overview" && (
                <div className="space-y-6 mt-4">
                  {/* User Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-burgundy-600">{selectedUser.enrollments.length}</p>
                      <p className="text-xs text-gray-500">Courses</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gold-600">{selectedUser._count.certificates}</p>
                      <p className="text-xs text-gray-500">Certificates</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{selectedUser.streak?.currentStreak || 0}</p>
                      <p className="text-xs text-gray-500">Day Streak</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedUser.streak?.totalPoints || 0}</p>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Role</p>
                      <Badge className={`mt-1 border ${roleColors[selectedUser.role]}`}>{selectedUser.role}</Badge>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="mt-1 font-medium">{selectedUser.isActive ? "Active" : "Inactive"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Joined</p>
                      <p className="mt-1 font-medium">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Login</p>
                      <p className="mt-1 font-medium">{formatRelativeTime(selectedUser.lastLoginAt)}</p>
                    </div>
                    {selectedUser.leadSource && (
                      <>
                        <div>
                          <p className="text-gray-500">Lead Source</p>
                          <p className="mt-1 font-medium">{selectedUser.leadSource}</p>
                        </div>
                        {selectedUser.leadSourceDetail && (
                          <div>
                            <p className="text-gray-500">Source Detail</p>
                            <p className="mt-1 font-medium">{selectedUser.leadSourceDetail}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Onboarding Lead Data */}
                  {selectedUser.hasCompletedOnboarding && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-green-800 mb-3">📋 Onboarding Data</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedUser.learningGoal && (
                          <div>
                            <p className="text-gray-500">Learning Goal</p>
                            <p className="mt-1 font-medium capitalize">{selectedUser.learningGoal.replace(/_/g, " ")}</p>
                          </div>
                        )}
                        {selectedUser.experienceLevel && (
                          <div>
                            <p className="text-gray-500">Experience Level</p>
                            <p className="mt-1 font-medium capitalize">{selectedUser.experienceLevel}</p>
                          </div>
                        )}
                        {selectedUser.focusAreas && selectedUser.focusAreas.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Focus Areas</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedUser.focusAreas.map((area, i) => (
                                <Badge key={i} className="bg-burgundy-100 text-burgundy-700 text-xs">{area}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedUser.bio && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Bio</p>
                            <p className="mt-1 text-gray-700">{selectedUser.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Tags */}
                  {selectedUser.tags && selectedUser.tags.length > 0 && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-purple-800 mb-3">🏷️ Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            className={`text-xs ${tag.tag.startsWith("lead:")
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : tag.tag.startsWith("interest:")
                                ? "bg-green-100 text-green-700 border-green-200"
                                : tag.tag.startsWith("completed:")
                                  ? "bg-gold-100 text-gold-700 border-gold-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                          >
                            {tag.tag}
                            {tag.value && ` (${tag.value})`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enrolled Courses */}
                  {selectedUser.enrollments.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">Enrolled Courses</p>
                      <div className="space-y-2">
                        {selectedUser.enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-burgundy-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-burgundy-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{enrollment.course.title}</p>
                                <p className="text-xs text-gray-500">{enrollment.status}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24">
                                <Progress value={Number(enrollment.progress)} className="h-2" />
                              </div>
                              <span className="text-sm font-medium text-burgundy-600 w-12 text-right">
                                {Math.round(Number(enrollment.progress))}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "tags" && (
                <div className="space-y-6 mt-4">
                  {/* Tag Statistics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{selectedUser.tags?.length || 0}</p>
                      <p className="text-xs text-gray-500">Total Tags</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedUser.tags?.filter(t => t.tag.startsWith("enrolled_")).length || 0}</p>
                      <p className="text-xs text-gray-500">Enrollments</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedUser.tags?.filter(t => t.tag.includes("completed")).length || 0}</p>
                      <p className="text-xs text-gray-500">Completions</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{selectedUser.tags?.filter(t => t.tag.startsWith("training_video_")).length || 0}</p>
                      <p className="text-xs text-gray-500">Video Progress</p>
                    </div>
                  </div>

                  {/* All Tags Grouped */}
                  {selectedUser.tags && selectedUser.tags.length > 0 ? (
                    <div className="space-y-4">
                      {/* Enrollment Tags */}
                      {selectedUser.tags.filter(t => t.tag.startsWith("enrolled_")).length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-blue-800 mb-3">📚 Enrollment Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.tags.filter(t => t.tag.startsWith("enrolled_")).map(tag => (
                              <Badge key={tag.id} className="bg-blue-100 text-blue-700 border-blue-200">
                                {tag.tag.replace("enrolled_", "")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mini Diploma Tags */}
                      {selectedUser.tags.filter(t => t.tag.includes("mini_diploma") || t.tag.startsWith("graduate_")).length > 0 && (
                        <div className="p-4 bg-gold-50 rounded-lg border border-gold-200">
                          <p className="text-sm font-semibold text-gold-800 mb-3">🎓 Mini Diploma Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.tags.filter(t => t.tag.includes("mini_diploma") || t.tag.startsWith("graduate_")).map(tag => (
                              <Badge key={tag.id} className="bg-gold-100 text-gold-700 border-gold-200">
                                {tag.tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Module Completion Tags */}
                      {selectedUser.tags.filter(t => t.tag.startsWith("module_")).length > 0 && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-green-800 mb-3">✅ Module Completion Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.tags.filter(t => t.tag.startsWith("module_")).map(tag => (
                              <Badge key={tag.id} className="bg-green-100 text-green-700 border-green-200">
                                {tag.tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Video Progress Tags */}
                      {selectedUser.tags.filter(t => t.tag.startsWith("training_video_")).length > 0 && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm font-semibold text-purple-800 mb-3">📹 Video Progress Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.tags.filter(t => t.tag.startsWith("training_video_")).sort((a, b) => {
                              const numA = parseInt(a.tag.split("_").pop() || "0");
                              const numB = parseInt(b.tag.split("_").pop() || "0");
                              return numA - numB;
                            }).map(tag => (
                              <Badge key={tag.id} className="bg-purple-100 text-purple-700 border-purple-200">
                                {tag.tag.replace("training_video_", "")}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other Tags */}
                      {selectedUser.tags.filter(t =>
                        !t.tag.startsWith("enrolled_") &&
                        !t.tag.includes("mini_diploma") &&
                        !t.tag.startsWith("graduate_") &&
                        !t.tag.startsWith("module_") &&
                        !t.tag.startsWith("training_video_")
                      ).length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-800 mb-3">🏷️ Other Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.tags.filter(t =>
                              !t.tag.startsWith("enrolled_") &&
                              !t.tag.includes("mini_diploma") &&
                              !t.tag.startsWith("graduate_") &&
                              !t.tag.startsWith("module_") &&
                              !t.tag.startsWith("training_video_")
                            ).map(tag => (
                              <Badge key={tag.id} className="bg-gray-100 text-gray-700 border-gray-200">
                                {tag.tag}
                                {tag.value && ` (${tag.value})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tag Timeline */}
                      <div className="p-4 bg-white rounded-lg border">
                        <p className="text-sm font-semibold text-gray-900 mb-3">📅 Tag Timeline</p>
                        <div className="max-h-48 overflow-y-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="text-left p-2">Tag</th>
                                <th className="text-left p-2">Applied At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...selectedUser.tags].sort((a, b) =>
                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                              ).map(tag => (
                                <tr key={tag.id} className="border-t hover:bg-gray-50">
                                  <td className="p-2 font-medium">{tag.tag}</td>
                                  <td className="p-2 font-mono text-gray-500">{new Date(tag.createdAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No tags applied to this user yet</p>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "activity" && (
                <div className="space-y-6 mt-4">
                  {loadingActivity ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-burgundy-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-gray-500">Loading activity data...</p>
                    </div>
                  ) : activityData ? (
                    <>
                      {/* Dispute Summary Banner */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800 mb-2">🛡️ Dispute Evidence Summary</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-blue-600 font-bold text-lg">{activityData.stats.totalLogins}</p>
                            <p className="text-gray-500 text-xs">Total Logins</p>
                          </div>
                          <div>
                            <p className="text-blue-600 font-bold text-lg">{activityData.stats.lessonsCompleted}</p>
                            <p className="text-gray-500 text-xs">Lessons Completed</p>
                          </div>
                          <div>
                            <p className="text-blue-600 font-bold text-lg">{Math.round(activityData.stats.totalWatchTime / 60)}m</p>
                            <p className="text-gray-500 text-xs">Watch Time</p>
                          </div>
                          <div>
                            <p className="text-blue-600 font-bold text-lg">{activityData.stats.certificatesEarned}</p>
                            <p className="text-gray-500 text-xs">Certificates</p>
                          </div>
                        </div>
                      </div>

                      {/* Key Dates */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900 mb-3">📅 Key Dates (Dispute Evidence)</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Account Created</p>
                            <p className="font-mono text-xs">{new Date(activityData.stats.accountCreated).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">First Login</p>
                            <p className="font-mono text-xs">{activityData.stats.firstLogin ? new Date(activityData.stats.firstLogin).toLocaleString() : "Never"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Login</p>
                            <p className="font-mono text-xs">{activityData.stats.lastLogin ? new Date(activityData.stats.lastLogin).toLocaleString() : "Never"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Login Count</p>
                            <p className="font-mono text-xs">{activityData.stats.totalLogins} times</p>
                          </div>
                        </div>
                      </div>

                      {/* Login History */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">🔐 Login History (Last 50)</p>
                        <div className="max-h-48 overflow-y-auto border rounded-lg">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="text-left p-2">Date/Time</th>
                                <th className="text-left p-2">IP Address</th>
                                <th className="text-left p-2">Device</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityData.loginHistory.length > 0 ? activityData.loginHistory.map((login: any, i: number) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                  <td className="p-2 font-mono">{new Date(login.createdAt).toLocaleString()}</td>
                                  <td className="p-2 font-mono">{login.ipAddress || "N/A"}</td>
                                  <td className="p-2 truncate max-w-[200px]" title={login.userAgent}>{login.device || login.browser || "Unknown"}</td>
                                </tr>
                              )) : (
                                <tr><td colSpan={3} className="p-4 text-center text-gray-400">No login history</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Course Access & Enrollments */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">📚 Course Enrollments & Access</p>
                        <div className="space-y-2">
                          {activityData.enrollments.length > 0 ? activityData.enrollments.map((e: any) => (
                            <div key={e.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{e.course.title}</p>
                                  <p className="text-xs text-gray-500">Status: <span className="font-medium">{e.status}</span></p>
                                </div>
                                <Badge variant="outline" className="text-xs">{Math.round(Number(e.progress))}% complete</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                                <p>Enrolled: <span className="font-mono">{new Date(e.enrolledAt).toLocaleString()}</span></p>
                                <p>Last Access: <span className="font-mono">{e.lastAccessedAt ? new Date(e.lastAccessedAt).toLocaleString() : "Never"}</span></p>
                              </div>
                            </div>
                          )) : (
                            <p className="text-gray-400 text-center py-4">No enrollments</p>
                          )}
                        </div>
                      </div>

                      {/* Lesson Progress */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">📖 Lesson Progress (Last 50)</p>
                        <div className="max-h-48 overflow-y-auto border rounded-lg">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="text-left p-2">Lesson</th>
                                <th className="text-left p-2">Course</th>
                                <th className="text-left p-2">Completed</th>
                                <th className="text-left p-2">Watch Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityData.lessonProgress.length > 0 ? activityData.lessonProgress.map((lp: any, i: number) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                  <td className="p-2">{lp.lesson.title}</td>
                                  <td className="p-2 text-gray-500">{lp.lesson.module?.course?.title}</td>
                                  <td className="p-2">
                                    {lp.isCompleted ? (
                                      <span className="text-green-600">✓ {lp.completedAt ? new Date(lp.completedAt).toLocaleDateString() : "Yes"}</span>
                                    ) : (
                                      <span className="text-gray-400">In progress</span>
                                    )}
                                  </td>
                                  <td className="p-2 font-mono">{lp.watchTime ? `${Math.round(lp.watchTime / 60)}m` : "0m"}</td>
                                </tr>
                              )) : (
                                <tr><td colSpan={4} className="p-4 text-center text-gray-400">No lesson progress</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Certificates Issued */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">🏆 Certificates Issued</p>
                        <div className="space-y-2">
                          {activityData.certificates.length > 0 ? activityData.certificates.map((cert: any) => (
                            <div key={cert.id} className="p-3 bg-gold-50 rounded-lg border border-gold-200 text-sm flex justify-between">
                              <div>
                                <p className="font-medium text-gold-800">{cert.course.title}</p>
                                <p className="text-xs text-gray-500">Certificate #{cert.certificateNumber}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-mono text-xs">{new Date(cert.issuedAt).toLocaleString()}</p>
                              </div>
                            </div>
                          )) : (
                            <p className="text-gray-400 text-center py-4">No certificates issued</p>
                          )}
                        </div>
                      </div>

                      {/* Activity Logs (Downloads, etc.) */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">📥 Activity Logs (Downloads & Actions)</p>
                        <div className="max-h-48 overflow-y-auto border rounded-lg">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="text-left p-2">Action</th>
                                <th className="text-left p-2">Resource</th>
                                <th className="text-left p-2">Date/Time</th>
                                <th className="text-left p-2">IP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityData.activityLogs && activityData.activityLogs.length > 0 ? activityData.activityLogs.map((log: any, i: number) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                  <td className="p-2 font-medium">{log.action}</td>
                                  <td className="p-2">{log.metadata?.resourceName || log.metadata?.type || "-"}</td>
                                  <td className="p-2 font-mono">{new Date(log.createdAt).toLocaleString()}</td>
                                  <td className="p-2 font-mono">{log.ipAddress || "N/A"}</td>
                                </tr>
                              )) : (
                                <tr><td colSpan={4} className="p-4 text-center text-gray-400">No activity logs yet</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Click the Activity tab to load dispute data</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => selectedUser && openEmailDialog(selectedUser)}>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button onClick={() => selectedUser && openDmDialog(selectedUser)} className="bg-burgundy-600 hover:bg-burgundy-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send DM Dialog */}
      <Dialog open={dmDialogOpen} onOpenChange={setDmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-burgundy-600" />
              Send Direct Message
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Send a message to{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendDM}
              disabled={sendingMessage || !messageContent.trim()}
              className="bg-burgundy-600 hover:bg-burgundy-700"
            >
              {sendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-burgundy-600" />
              Send Email
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Send an email to{" "}
                  <strong>{selectedUser.email}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <Textarea
              placeholder="Email content..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={sendingMessage || !emailSubject.trim() || !emailContent.trim()}
              className="bg-burgundy-600 hover:bg-burgundy-700"
            >
              {sendingMessage ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enroll in Course Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-burgundy-600" />
              Enroll in Course
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Select a course to enroll{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => selectedUser && handleEnrollUser(selectedUser.id, course.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-burgundy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate group-hover:text-burgundy-700">
                    {course.title}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEnrollDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {usersToDelete.length === 1 ? (
                <span>
                  Are you sure you want to delete this user? This will permanently remove:
                </span>
              ) : (
                <span>
                  Are you sure you want to delete <strong>{usersToDelete.length} users</strong>? This will permanently remove:
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700 space-y-1">
            <p>• All course enrollments and progress</p>
            <p>• All certificates earned</p>
            <p>• All messages sent and received</p>
            <p>• All badges and achievements</p>
            <p>• All community posts and comments</p>
            <p className="font-semibold pt-2">⚠️ This action cannot be undone!</p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUsersToDelete([]);
              }}
              disabled={deletingUsers}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUsers}
              disabled={deletingUsers}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingUsers ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {usersToDelete.length === 1 ? "Delete User" : `Delete ${usersToDelete.length} Users`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-purple-600" />
              Change User Role
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Change the role for{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>{" "}
                  ({selectedUser.email})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Role</Label>
              <Badge className={`border ${selectedUser ? roleColors[selectedUser.role] : ""}`}>
                {selectedUser?.role}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>New Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="MENTOR">Mentor</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialogOpen(false)}
              disabled={changingRole}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeRole}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={changingRole || selectedRole === selectedUser?.role}
            >
              {changingRole ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createUserDialogOpen} onOpenChange={(open) => {
        setCreateUserDialogOpen(open);
        if (!open) {
          setCreateUserError("");
          setCreateUserSuccess(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-burgundy-600" />
              Create New User
            </DialogTitle>
            <DialogDescription>
              Add a new user to the platform with their login credentials.
            </DialogDescription>
          </DialogHeader>

          {/* Success Message */}
          {createUserSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">User Created Successfully!</p>
                <p className="text-sm text-green-600">The user can now login with their credentials.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {createUserError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {createUserError}
            </div>
          )}

          {!createUserSuccess && (
            <>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUserData.firstName}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUserData.lastName}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={newUserData.role}
                    onValueChange={(value) => setNewUserData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="MENTOR">Mentor</SelectItem>
                      <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Apply Tags (optional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setNewUserData(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag]
                          }));
                        }}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                          newUserData.tags.includes(tag)
                            ? "bg-burgundy-100 border-burgundy-300 text-burgundy-700"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {newUserData.tags.length > 0 && (
                    <p className="text-xs text-gray-500">{newUserData.tags.length} tag(s) selected</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreateUserDialogOpen(false);
                    setCreateUserError("");
                    setNewUserData({
                      email: "",
                      firstName: "",
                      lastName: "",
                      password: "",
                      role: "STUDENT",
                      tags: [],
                    });
                  }}
                  disabled={creatingUser}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                  disabled={creatingUser || !newUserData.email || !newUserData.password}
                >
                  {creatingUser ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={addTagDialogOpen} onOpenChange={setAddTagDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-green-600" />
              Add Tag
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Add a tag to{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Search existing tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Existing Tags
              </Label>
              <Input
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search tags..."
                className="mb-2"
              />
              {loadingTags ? (
                <div className="text-center py-4 text-gray-500 text-sm">Loading tags...</div>
              ) : (
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {existingTags.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-2">No existing tags found</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {existingTags
                        .filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setNewTag(tag)}
                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                              newTag === tag
                                ? "bg-green-100 border-green-300 text-green-700"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      {existingTags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase())).length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-2 w-full">No tags match your search</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Common quick tags */}
            <div className="space-y-2">
              <Label>Quick Select (Common Tags)</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewTag(tag)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      newTag === tag
                        ? "bg-green-100 border-green-300 text-green-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom tag input */}
            <div className="space-y-2">
              <Label htmlFor="tagInput">Or enter custom tag</Label>
              <Input
                id="tagInput"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., vip_customer, referral:john"
              />
            </div>

            {/* Selected tag display */}
            {newTag && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Selected tag:</strong> {newTag}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTagDialogOpen(false)}
              disabled={addingTag}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTag}
              className="bg-green-600 hover:bg-green-700"
              disabled={addingTag || !newTag.trim()}
            >
              {addingTag ? "Adding..." : "Add Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
