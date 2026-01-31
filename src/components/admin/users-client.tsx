"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  Sparkles,
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
  Shield,
  UserCog,
  RotateCcw,
  Copy,
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
import { useImpersonation } from "@/components/admin/impersonation-banner";

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
  // Mini diploma progress (calculated from lesson completion tags)
  miniDiplomaProgressPercent?: number;
  miniDiplomaProgress?: Record<string, number>;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface UsersClientProps {
  courses: Course[];
}

export function UsersClient({ courses }: UsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [globalStats, setGlobalStats] = useState<any>({ total: 0, student: 0, instructor: 0, admin: 0 });

  // Pagination state
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  // Change Email Dialog state
  const [emailChangeDialogOpen, setEmailChangeDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  // Change Name Dialog state
  const [nameChangeDialogOpen, setNameChangeDialogOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [changingName, setChangingName] = useState(false);

  // Activity tab states for dispute resolution
  const [detailTab, setDetailTab] = useState<"overview" | "tags" | "activity" | "ai">("overview");
  const [activityData, setActivityData] = useState<any>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

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
    confirmPassword: "",
    role: "STUDENT",
    tags: [] as string[],
  });
  const [createUserError, setCreateUserError] = useState("");
  const [createUserSuccess, setCreateUserSuccess] = useState(false);
  const [createUserTagSearch, setCreateUserTagSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Add tag state
  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [addingTag, setAddingTag] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  // Reset Mini Diploma state
  const [resettingMiniDiploma, setResettingMiniDiploma] = useState(false);

  // Clone user state
  const [cloningUser, setCloningUser] = useState(false);

  // Mark as Disputed state
  const [markingDisputed, setMarkingDisputed] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  // Impersonation
  const { startImpersonation, loading: impersonating } = useImpersonation();

  const handleImpersonate = async (userId: string) => {
    await startImpersonation(userId);
  };

  // Enrollment dialog state
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [enrollingCourses, setEnrollingCourses] = useState(false);

  // Send Login Email Dialog state
  const [loginEmailDialogOpen, setLoginEmailDialogOpen] = useState(false);
  const [targetLoginEmail, setTargetLoginEmail] = useState("");
  const [sendingLoginEmail, setSendingLoginEmail] = useState(false);

  // Common tags for quick selection
  const COMMON_TAGS = [
    "fm_free_mini_diploma_lead", // Grants mini-diploma access!
    "source:mini-diploma-freebie",
    "source:functional-medicine",
    "enrolled_functional_medicine",
    "enrolled_health_coach",
    "lead:hot",
    "lead:warm",
    "lead:cold",
    "vip_customer",
    "needs_support",
    "upsell_candidate",
    "referral_partner",
    "mini_diploma_started",
    "mini_diploma_completed",
    "dfy_purchased",           // DFY package purchased
    "dfy_intake_completed",    // DFY intake form submitted
  ];

  // Tag packs for one-click application
  const TAG_PACKS = {
    "FM Pro Pack": [
      "fm_pro_practice_path_purchased",
      "fm_pro_master_depth_purchased",
      "fm_pro_advanced_clinical_purchased",
      "clickfunnels_purchase",
      "functional_medicine_complete_certification_purchased",
    ],
  };

  // Fetch users from API
  const fetchUsers = useCallback(async (page: number, resetList = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (statusFilter === "ACTIVE") params.set("status", "active");
      if (statusFilter === "INACTIVE") params.set("status", "inactive");
      if (statusFilter === "ACTIVE") params.set("status", "active");
      if (statusFilter === "INACTIVE") params.set("status", "inactive");

      // Check query params for direct ID link
      const userIdParam = searchParams.get("userId");
      if (userIdParam && !resetList && page === 1 && !search && roleFilter === "ALL" && statusFilter === "ALL") {
        // Only apply if looking for specific user on initial load
        params.set("userId", userIdParam);
      }
      const res = await fetch(`/api/admin/users/list?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (resetList || page === 1) {
          setUsers(data.users);
        } else {
          setUsers((prev) => [...prev, ...data.users]);
        }
        setPagination(data.pagination);
        if (data.stats) setGlobalStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter, searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers(1, true);
  }, [debouncedSearch, roleFilter, statusFilter, fetchUsers]);

  // Auto-open user if linked via ID
  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId && users.length === 1 && users[0].id === userId && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, searchParams, selectedUser]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.hasMore && !loadingMore && !loading) {
          fetchUsers(pagination.page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pagination, loadingMore, loading, fetchUsers]);

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
      const res = await fetch(`/api/admin/user-activity?userId=${userId}`, {
        cache: "no-store",
        headers: { "Pragma": "no-cache" }
      });
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
          legalAcceptance: data.legalAcceptance || null,
          registrationEvidence: data.registrationEvidence || null,
          fraudRisk: data.fraudRisk || null,
          loginHistory: data.loginHistory || [],
          enrollments: data.enrollments || [],
          lessonProgress: data.lessonProgress || [],
          certificates: data.certificates || [],
          activityLogs: data.activityLogs || [],
          payments: data.payments || [],
          quizAttempts: data.quizAttempts || [],
          resourceDownloads: data.resourceDownloads || [],
          emailSends: data.emailSends || [],
          supportTickets: data.supportTickets || [],
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

  // Only apply ENROLLED/NOT_ENROLLED filters locally (others are server-side)
  const filteredUsers = users.filter((user) => {
    if (statusFilter === "ENROLLED") return user.enrollments.length > 0;
    if (statusFilter === "NOT_ENROLLED") return user.enrollments.length === 0;
    return true;
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
        fetchUsers(1, true); // Refresh user list
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

  const handleEnrollUser = async (userId: string, courseIds: string[]) => {
    if (courseIds.length === 0) return;

    setEnrollingCourses(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const courseId of courseIds) {
        const response = await fetch("/api/admin/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId }),
        });
        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      setEnrollDialogOpen(false);
      setSelectedUser(null);
      setSelectedCourses([]);
      setCourseSearch("");
      fetchUsers(1, true); // Refresh user list

      if (errorCount > 0) {
        alert(`Enrolled in ${successCount} courses. ${errorCount} failed (may already be enrolled).`);
      }
    } catch (error) {
      console.error("Failed to enroll user:", error);
    } finally {
      setEnrollingCourses(false);
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

  const openSendLoginDialog = (user: User) => {
    setSelectedUser(user);
    setTargetLoginEmail(user.email);
    setLoginEmailDialogOpen(true);
  };

  const handleSendLoginEmail = async () => {
    if (!selectedUser) return;
    setSendingLoginEmail(true);
    try {
      const response = await fetch("/api/admin/users/send-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: targetLoginEmail || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login credentials sent successfully!");
        setLoginEmailDialogOpen(false);
        setTargetLoginEmail("");
        setSelectedUser(null);
      } else {
        alert(data.error || "Failed to send login credentials");
      }
    } catch (error) {
      console.error("Failed to send login email:", error);
      alert("An error occurred while sending login credentials");
    } finally {
      setSendingLoginEmail(false);
    }
  };

  const openEnrollDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedCourses([]);
    setCourseSearch("");
    setEnrollDialogOpen(true);
  };

  const openDetailDialog = (user: User) => {
    setSelectedUser(user);
    setDetailTab("overview");
    setActivityData(null);
    setAiSummary(null);
    setDetailDialogOpen(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordDialogOpen(true);
  };

  const openEmailChangeDialog = (user: User) => {
    setSelectedUser(user);
    setNewUserEmail(user.email);
    setEmailChangeDialogOpen(true);
  };

  const handleEmailChange = async () => {
    if (!selectedUser || !newUserEmail.trim()) return;
    if (newUserEmail === selectedUser.email) {
      alert("Email is the same as current");
      return;
    }

    setChangingEmail(true);
    try {
      const response = await fetch("/api/admin/users/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newEmail: newUserEmail.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Email updated successfully");
        setEmailChangeDialogOpen(false);
        setSelectedUser(null);
        fetchUsers(1, true); // Refresh user list
      } else {
        alert(data.error || "Failed to update email");
      }
    } catch (error) {
      console.error("Failed to update email:", error);
      alert("An error occurred while updating the email");
    } finally {
      setChangingEmail(false);
    }
  };

  const openNameChangeDialog = (user: User) => {
    setSelectedUser(user);
    setNewFirstName(user.firstName || "");
    setNewLastName(user.lastName || "");
    setNameChangeDialogOpen(true);
  };

  const handleNameChange = async () => {
    if (!selectedUser) return;
    if (!newFirstName.trim() && !newLastName.trim()) {
      alert("Please enter at least a first or last name");
      return;
    }

    setChangingName(true);
    try {
      const response = await fetch("/api/admin/users/name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          firstName: newFirstName.trim(),
          lastName: newLastName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Name updated successfully");
        setNameChangeDialogOpen(false);
        setSelectedUser(null);
        fetchUsers(1, true); // Refresh user list
      } else {
        alert(data.error || "Failed to update name");
      }
    } catch (error) {
      console.error("Failed to update name:", error);
      alert("An error occurred while updating the name");
    } finally {
      setChangingName(false);
    }
  };

  const openKnowledgeDialog = async (user: User) => {
    setSelectedUser(user);
    setKnowledgeBaseContent("Loading...");
    setKnowledgeDialogOpen(true);

    try {
      const res = await fetch(`/api/admin/users/knowledge?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setKnowledgeBaseContent(data.knowledgeBase || "");
      } else {
        setKnowledgeBaseContent("Failed to load knowledge base.");
      }
    } catch (err) {
      console.error("Failed to fetch knowledge base:", err);
      setKnowledgeBaseContent("Error loading knowledge base.");
    }
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
        fetchUsers(1, true); // Refresh user list
      }
    } catch (error) {
      console.error("Failed to change role:", error);
    } finally {
      setChangingRole(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password) return;

    // Validate password confirmation
    if (newUserData.password !== newUserData.confirmPassword) {
      setCreateUserError("Passwords do not match");
      return;
    }

    if (newUserData.password.length < 8) {
      setCreateUserError("Password must be at least 8 characters");
      return;
    }

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
            confirmPassword: "",
            role: "STUDENT",
            tags: [],
          });
          fetchUsers(1, true); // Refresh user list
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
    setSelectedTags([]);
    setTagSearch("");
    setAddTagDialogOpen(true);
    fetchExistingTags();
  };

  const handleAddTag = async () => {
    if (!selectedUser || selectedTags.length === 0) return;
    setAddingTag(true);
    try {
      let successCount = 0;
      for (const tag of selectedTags) {
        const response = await fetch("/api/admin/users/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedUser.id,
            tag: tag.trim(),
          }),
        });
        if (response.ok) {
          successCount++;
        }
      }
      if (successCount > 0) {
        setAddTagDialogOpen(false);
        setSelectedTags([]);
        fetchUsers(1, true); // Refresh user list
        if (successCount < selectedTags.length) {
          alert(`Added ${successCount} of ${selectedTags.length} tags. Some may have already existed.`);
        }
      } else {
        alert("Failed to add tags");
      }
    } catch (error) {
      console.error("Failed to add tags:", error);
      alert("Failed to add tags");
    } finally {
      setAddingTag(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleResetMiniDiploma = async (user: User) => {
    if (!confirm(`Reset Mini Diploma progress for ${user.firstName || user.email}? This will clear all lesson progress.`)) {
      return;
    }
    setResettingMiniDiploma(true);
    try {
      const response = await fetch("/api/admin/users/reset-mini-diploma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Mini Diploma progress reset! Cleared ${data.deleted.lessons} lessons.`);
        fetchUsers(1, true); // Refresh user list
      } else {
        alert(data.error || "Failed to reset progress");
      }
    } catch (error) {
      console.error("Failed to reset Mini Diploma:", error);
      alert("Failed to reset progress");
    } finally {
      setResettingMiniDiploma(false);
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
        fetchUsers(1, true); // Refresh user list
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
    SUPPORT: "bg-teal-100 text-teal-700 border-teal-200",
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => window.open("/api/admin/export/users?format=csv", "_blank")}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Users (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("/api/admin/export/users?format=csv&includeEnrollments=true", "_blank")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Export with Enrollments
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("/api/admin/export/users?format=csv&includeTags=true", "_blank")}
              >
                <Tag className="w-4 h-4 mr-2" />
                Export with Tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => window.open(`/api/admin/export/users?format=csv&role=${roleFilter !== "ALL" ? roleFilter : ""}`, "_blank")}
              >
                <Users className="w-4 h-4 mr-2" />
                Export Current Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setCreateUserDialogOpen(true)}
            className="bg-burgundy-600 hover:bg-burgundy-700 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards - Updated with Role Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.student}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-semibold">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.instructor}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-semibold">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{globalStats.admin}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Filters & Search */}
      < Card >
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
      </Card >

      {/* Bulk Actions Bar */}
      {
        selectedUsers.length > 0 && (
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
        )
      }

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? "Loading users..." : `Showing ${filteredUsers.length} of ${pagination?.totalCount ?? users.length} users`}
        </p>
      </div>

      {/* Users Table */}
      <Card className="">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading users...</span>
            </div>
          ) : (
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
                            ) : user.miniDiplomaProgressPercent && user.miniDiplomaProgressPercent > 0 ? (
                              <>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Mini Diploma</span>
                                  <span className="font-medium text-emerald-600">{user.miniDiplomaProgressPercent}%</span>
                                </div>
                                <Progress value={user.miniDiplomaProgressPercent} className="h-1.5" />
                                {user.miniDiplomaProgress && Object.entries(user.miniDiplomaProgress).map(([niche, count]) => (
                                  <div key={niche} className="text-xs text-gray-500">
                                    {niche}: {count}/9 lessons
                                  </div>
                                ))}
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
                                <DropdownMenuItem
                                  onClick={() => openSendLoginDialog(user)}
                                  className="cursor-pointer"
                                >
                                  <Mail className="w-4 h-4 mr-2 text-burgundy-600" />
                                  Send Login Credentials
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
                                {/* Impersonate User - only show for non-admin roles */}
                                {!["ADMIN", "SUPERUSER"].includes(user.role) && (
                                  <DropdownMenuItem
                                    onClick={() => handleImpersonate(user.id)}
                                    className="cursor-pointer bg-amber-50 text-amber-700"
                                  >
                                    <UserCog className="w-4 h-4 mr-2 text-amber-600" />
                                    Impersonate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openPasswordDialog(user)}
                                  className="cursor-pointer"
                                >
                                  <Lock className="w-4 h-4 mr-2 text-burgundy-600" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEmailChangeDialog(user)}
                                  className="cursor-pointer"
                                >
                                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                  Change Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openNameChangeDialog(user)}
                                  className="cursor-pointer"
                                >
                                  <Users className="w-4 h-4 mr-2 text-teal-600" />
                                  Change Name
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
                                <DropdownMenuItem
                                  onClick={() => handleResetMiniDiploma(user)}
                                  disabled={resettingMiniDiploma}
                                  className="cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Reset Mini Diploma
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={async () => {
                                    if (!confirm(`Clone ${user.firstName} ${user.lastName}'s account? This will:\n\n1. Rename old account to _BROKEN\n2. Create fresh account with same email\n3. Copy all enrollments, tags, progress\n\nNew password: Futurecoach2025`)) return;
                                    setCloningUser(true);
                                    try {
                                      const res = await fetch('/api/admin/users/clone', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ sourceEmail: user.email })
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        alert(`✅ Cloned successfully!\n\nNew password: ${data.newPassword}\nCloned: ${data.cloned.enrollments} enrollments, ${data.cloned.marketingTags} tags`);
                                        fetchUsers(1, true); // Refresh user list
                                      } else {
                                        alert(`❌ Clone failed: ${data.error}`);
                                      }
                                    } catch (e) {
                                      alert(`❌ Clone error: ${e}`);
                                    } finally {
                                      setCloningUser(false);
                                    }
                                  }}
                                  disabled={cloningUser}
                                  className="cursor-pointer text-purple-600 focus:text-purple-600 focus:bg-purple-50"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Clone Account (Fix Login Issues)
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
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="py-4">
            {loadingMore && (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading more users...</span>
              </div>
            )}
            {pagination && !pagination.hasMore && filteredUsers.length > 0 && (
              <p className="text-center text-sm text-gray-500">
                Showing all {pagination.totalCount} users
              </p>
            )}
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
              <div className="relative">
                <Input
                  type={showChangePassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 chars)"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  {showChangePassword ? (
                    <Eye className="h-4 w-4 text-gray-400" />
                  ) : (
                    <div className="relative">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <div className="absolute top-1/2 left-[-2px] right-[-2px] h-[1.5px] bg-gray-400 rotate-45 transform -translate-y-1/2" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type={showChangePassword ? "text" : "password"}
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
                <button
                  onClick={async () => {
                    setDetailTab("ai");
                    if (!aiSummary && !loadingAiSummary) {
                      setLoadingAiSummary(true);
                      try {
                        const res = await fetch("/api/admin/super-tools/ai-summary", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: selectedUser.id }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setAiSummary(data.summary);
                        } else {
                          setAiSummary("Failed to generate AI summary. Please try again.");
                        }
                      } catch (error) {
                        setAiSummary("Error generating summary.");
                      } finally {
                        setLoadingAiSummary(false);
                      }
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${detailTab === "ai" ? "border-burgundy-600 text-burgundy-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Summary
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
                            <p className="text-blue-600 font-bold text-lg">{Math.round((activityData.stats.totalTimeSpent || 0) / 60)}m</p>
                            <p className="text-gray-500 text-xs">Time Spent on Platform</p>
                          </div>
                          <div>
                            <p className="text-blue-600 font-bold text-lg">{activityData.stats.certificatesEarned}</p>
                            <p className="text-gray-500 text-xs">Certificates</p>
                          </div>
                        </div>
                      </div>

                      {/* Dispute Defense & Chargeback Protection */}
                      <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 shadow-sm mt-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-700" />
                            <div>
                              <h3 className="text-sm font-bold text-blue-900">🛡️ Dispute Defense & Chargeback Protection</h3>
                              <p className="text-xs text-blue-700">Official audit log for payment dispute evidence.</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Generate and download evidence PDF
                              const evidenceText = `
================================================================================
                        DISPUTE EVIDENCE REPORT
================================================================================
Document ID: EVD-${Date.now()}-${selectedUser?.id?.slice(0, 8)}
Generated: ${new Date().toISOString()}

USER INFORMATION
----------------
Name: ${selectedUser?.firstName} ${selectedUser?.lastName}
Email: ${selectedUser?.email}
Account Created: ${activityData.stats.accountCreated ? new Date(activityData.stats.accountCreated).toLocaleString() : 'N/A'}

LEGAL ACCEPTANCE (TERMS OF SERVICE)
------------------------------------
TOS Accepted: ${activityData.legalAcceptance?.tosAcceptedAt ? new Date(activityData.legalAcceptance.tosAcceptedAt).toLocaleString() : 'MISSING'}
TOS Version: ${activityData.legalAcceptance?.tosVersion || '1.0'}
Refund Policy Accepted: ${activityData.legalAcceptance?.refundPolicyAcceptedAt ? new Date(activityData.legalAcceptance.refundPolicyAcceptedAt).toLocaleString() : 'MISSING'}

Full Terms: https://learn.accredipro.academy/terms-of-service
Full Refund Policy: https://learn.accredipro.academy/refund-policy

REFUND POLICY CUSTOMER AGREED TO:
---------------------------------
"ALL SALES ARE FINAL. NO REFUNDS.
Due to the immediate-access nature of Digital Products, you expressly 
acknowledge and agree that:
- You waive any right to request a refund for any reason whatsoever
- You waive any right to cancel your purchase after payment processing
- You waive any right to initiate a payment dispute or chargeback
- You waive any right to claim non-delivery after receiving access"
(Source: Terms of Service, Article IV)

REGISTRATION EVIDENCE
---------------------
IP Address: ${activityData.registrationEvidence?.ip || 'Not Captured'}
Device: ${activityData.registrationEvidence?.device || 'Unknown'}
User Agent: ${activityData.registrationEvidence?.userAgent || 'Not Captured'}

PLATFORM ACTIVITY
-----------------
Total Logins: ${activityData.stats.totalLogins || 0}
First Login: ${activityData.stats.firstLogin ? new Date(activityData.stats.firstLogin).toLocaleString() : 'Never'}
Last Access: ${activityData.stats.lastLogin ? new Date(activityData.stats.lastLogin).toLocaleString() : 'Never'}
Time Spent on Platform: ${Math.round((activityData.stats.totalTimeSpent || 0) / 60)} minutes
Lessons Completed: ${activityData.stats.lessonsCompleted || 0}
Certificates Earned: ${activityData.stats.certificatesEarned || 0}

PAYMENT HISTORY
---------------
${activityData.payments?.map((p: any) => `- $${p.amount} ${p.currency} on ${new Date(p.createdAt).toLocaleString()} (${p.productName || 'N/A'})`).join('\n') || 'No payments'}

LOGIN HISTORY (Last 10)
-----------------------
${activityData.loginHistory?.slice(0, 10).map((l: any) => `- ${new Date(l.createdAt).toLocaleString()} from ${l.ipAddress || 'N/A'} (${l.device || 'Unknown'}) - ${l.country || 'Unknown location'}`).join('\n') || 'No login history'}

SUPPORT TICKETS
---------------
${activityData.supportTickets?.length === 0 ? '✅ No support tickets or complaints filed.' : activityData.supportTickets?.map((t: any) => `- #${t.ticketNumber}: ${t.subject} (${t.status})`).join('\n')}

---
This document was automatically generated and serves as official evidence for payment dispute resolution.

================================================================================
                         SUMMARY OF EVIDENCE
================================================================================

${activityData.legalAcceptance?.tosAcceptedAt ? '✅ CUSTOMER ACCEPTED TERMS OF SERVICE' : '⚠️ TOS not recorded'}
${activityData.stats.totalLogins > 0 ? '✅ CUSTOMER ACCESSED THE PRODUCT (' + Math.round((activityData.stats.totalTimeSpent || 0) / 60) + ' min)' : '⚠️ No login'}
${activityData.supportTickets?.length === 0 ? '❌ CUSTOMER NEVER CONTACTED SUPPORT BEFORE DISPUTING' : '✅ Support contacted'}

================================================================================
                            CONCLUSION
================================================================================

This dispute should be DENIED because:
- Product was delivered as promised
- Customer accessed and used the product
- Customer agreed to "All Sales Final" policy at checkout
- Customer bypassed merchant dispute resolution process
- No evidence of fraud or non-delivery

================================================================================
                         COMPANY INFORMATION
================================================================================

AccrediPro LLC - A Wyoming Limited Liability Company
1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801, United States
Email: info@accredipro.academy | Web: https://learn.accredipro.academy
Terms: https://learn.accredipro.academy/terms-of-service

================================================================================
                              `.trim();

                              const blob = new Blob([evidenceText], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `dispute-evidence-${selectedUser?.email}-${new Date().toISOString().split('T')[0]}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Evidence
                          </Button>
                          {/* Download PDF Evidence */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(`/api/admin/users/${selectedUser?.id}/dispute-evidence/pdf?reason=general`, '_blank');
                            }}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            PDF Evidence
                          </Button>
                          {/* Mark as Disputed Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!selectedUser) return;
                              const reason = prompt('Enter dispute/chargeback reason (optional):') || 'Chargeback filed';
                              if (!confirm(`⚠️ Mark ${selectedUser.firstName} ${selectedUser.lastName} as DISPUTED?\n\nThis will:\n- Block account access\n- Suppress all emails\n- Deactivate the account\n\nReason: ${reason}`)) return;
                              setMarkingDisputed(true);
                              try {
                                const res = await fetch(`/api/admin/users/${selectedUser.id}/mark-disputed`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ reason })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert(`✅ User marked as disputed!\n\nEffects:\n${data.effects.join('\n')}`);
                                  fetchUsers(1, true);
                                } else {
                                  alert(`❌ Failed: ${data.error}`);
                                }
                              } catch (e) {
                                alert(`❌ Error: ${e}`);
                              } finally {
                                setMarkingDisputed(false);
                              }
                            }}
                            disabled={markingDisputed}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {markingDisputed ? 'Marking...' : 'Mark as Disputed'}
                          </Button>
                        </div>

                        {/* Fraud Risk Warning */}
                        {activityData.fraudRisk?.isMismatch && (
                          <div className={`p-3 rounded-lg mb-4 ${activityData.fraudRisk.riskLevel === 'high'
                            ? 'bg-red-100 border border-red-300'
                            : 'bg-yellow-100 border border-yellow-300'
                            }`}>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className={`w-5 h-5 ${activityData.fraudRisk.riskLevel === 'high' ? 'text-red-600' : 'text-yellow-600'
                                }`} />
                              <span className={`text-sm font-semibold ${activityData.fraudRisk.riskLevel === 'high' ? 'text-red-800' : 'text-yellow-800'
                                }`}>
                                {activityData.fraudRisk.message}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          {/* Left Col: Evidence Data */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Legal Acceptance</p>
                              <div className="mt-1 p-3 bg-white rounded border border-blue-100">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-600 text-xs">TOS Status:</span>
                                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${activityData.legalAcceptance?.tosAcceptedAt ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {activityData.legalAcceptance?.tosAcceptedAt ? "ACCEPTED" : "MISSING"}
                                  </span>
                                </div>
                                <p className="font-mono text-sm font-bold text-blue-800 break-all">
                                  {activityData.legalAcceptance?.tosAcceptedAt
                                    ? new Date(activityData.legalAcceptance.tosAcceptedAt).toLocaleString()
                                    : "No Record Found"}
                                </p>
                                {activityData.legalAcceptance?.tosVersion && (
                                  <p className="text-xs text-gray-400 mt-1">Version: {activityData.legalAcceptance.tosVersion}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Registration Evidence</p>
                              <div className="mt-1 p-3 bg-white rounded border border-blue-100 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-gray-600 text-xs">IP Address:</p>
                                    <p className="font-mono text-xs font-bold text-blue-800">
                                      {activityData.registrationEvidence?.ip || "Not Captured"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 text-xs">Device:</p>
                                    <p className="font-mono text-xs text-gray-800 truncate" title={activityData.registrationEvidence?.userAgent}>
                                      {activityData.registrationEvidence?.device || "Unknown"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-gray-600 text-xs">User Agent:</p>
                                  <p className="font-mono text-[10px] text-gray-500 break-all leading-tight">
                                    {activityData.registrationEvidence?.userAgent || "Not Captured"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Col: Timeline */}
                          <div className="space-y-2">
                            <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Chronological Audit</p>
                            <div className="bg-white rounded border border-gray-200 divide-y">
                              <div className="p-3 flex justify-between items-center bg-gray-50">
                                <span className="text-gray-600 text-xs font-semibold">Account Created</span>
                                <span className="font-mono text-xs">{new Date(activityData.stats.accountCreated).toLocaleString()}</span>
                              </div>
                              <div className="p-3 flex justify-between items-center">
                                <span className="text-gray-600 text-xs">First Login</span>
                                <span className="font-mono text-xs text-green-700 font-medium">
                                  {activityData.stats.firstLogin ? new Date(activityData.stats.firstLogin).toLocaleString() : "Never"}
                                </span>
                              </div>
                              <div className="p-3 flex justify-between items-center">
                                <span className="text-gray-600 text-xs">Last Access</span>
                                <span className="font-mono text-xs">
                                  {activityData.stats.lastLogin ? new Date(activityData.stats.lastLogin).toLocaleString() : "Never"}
                                </span>
                              </div>
                              <div className="p-3 flex justify-between items-center">
                                <span className="text-gray-600 text-xs">Total Login Sessions</span>
                                <span className="font-mono text-xs">{activityData.stats.totalLogins} times</span>
                              </div>
                              <div className="p-3 flex justify-between items-center">
                                <span className="text-gray-600 text-xs">Time Spent on Platform</span>
                                <span className="font-mono text-xs text-blue-600 font-bold">{Math.round((activityData.stats.totalTimeSpent || 0) / 60)} minutes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* NEW: Community & Mentorship Evidence (Usufruct) */}
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-purple-600" />
                          <p className="text-sm font-semibold text-purple-900">Community & Mentorship Evidence (Usufruct)</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded border border-purple-100 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Mentorship Access</p>
                            <p className="text-lg font-bold text-purple-700 mt-1">
                              {activityData.stats.mentorshipMessages || 0}
                            </p>
                            <p className="text-xs text-gray-500">Private messages exchanged</p>
                          </div>
                          <div className="bg-white p-3 rounded border border-purple-100 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Community Participation</p>
                            <p className="text-lg font-bold text-purple-700 mt-1">
                              {activityData.stats.communityMessages || 0}
                            </p>
                            <p className="text-xs text-gray-500">Pod interactions & posts</p>
                          </div>
                          <div className="bg-white p-3 rounded border border-purple-100 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Assigned Circle</p>
                            <p className="text-sm font-bold text-purple-700 mt-1 truncate" title={activityData.stats.podName || "No Pod Assigned"}>
                              {activityData.stats.podName || "No Pod Assigned"}
                            </p>
                            <p className="text-xs text-gray-500">Current Cohort/Pod Membership</p>
                          </div>
                        </div>
                      </div>

                      {/* NEW: Payment History */}
                      {activityData.payments && activityData.payments.length > 0 && (
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <p className="text-sm font-semibold text-emerald-800 mb-3">💳 Payment History ({activityData.payments.length})</p>
                          <div className="max-h-48 overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-emerald-100 sticky top-0">
                                <tr>
                                  <th className="text-left p-2">Date</th>
                                  <th className="text-left p-2">Amount</th>
                                  <th className="text-left p-2">Product</th>
                                  <th className="text-left p-2">Card</th>
                                  <th className="text-left p-2">IP</th>
                                  <th className="text-left p-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activityData.payments.map((payment: any) => (
                                  <tr key={payment.id} className="border-t hover:bg-emerald-50">
                                    <td className="p-2 font-mono">{new Date(payment.createdAt).toLocaleString()}</td>
                                    <td className="p-2 font-bold">${Number(payment.amount).toFixed(2)} {payment.currency}</td>
                                    <td className="p-2">{payment.productName || payment.productSku || "-"}</td>
                                    <td className="p-2 font-mono">{payment.cardBrand} ****{payment.cardLast4}</td>
                                    <td className="p-2 font-mono">{payment.ipAddress || "N/A"}</td>
                                    <td className="p-2">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${payment.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                        payment.status === "REFUNDED" ? "bg-yellow-100 text-yellow-700" :
                                          payment.status === "CHARGEBACK" ? "bg-red-100 text-red-700" :
                                            "bg-gray-100 text-gray-700"
                                        }`}>{payment.status}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* NEW: Quiz Attempts */}
                      {activityData.quizAttempts && activityData.quizAttempts.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-3">📝 Quiz Attempts ({activityData.quizAttempts.length})</p>
                          <div className="max-h-36 overflow-y-auto border rounded-lg">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="text-left p-2">Quiz</th>
                                  <th className="text-left p-2">Score</th>
                                  <th className="text-left p-2">Passed</th>
                                  <th className="text-left p-2">Completed</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activityData.quizAttempts.map((q: any) => (
                                  <tr key={q.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{q.quiz?.title || "Quiz"}</td>
                                    <td className="p-2 font-mono">{q.score}%</td>
                                    <td className="p-2">{q.passed ? <span className="text-green-600">✓ Pass</span> : <span className="text-red-600">✗ Fail</span>}</td>
                                    <td className="p-2 font-mono">{q.completedAt ? new Date(q.completedAt).toLocaleString() : "In progress"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* NEW: Resource Downloads */}
                      {activityData.resourceDownloads && activityData.resourceDownloads.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-3">📥 Resource Downloads ({activityData.resourceDownloads.length})</p>
                          <div className="max-h-36 overflow-y-auto border rounded-lg">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="text-left p-2">Resource</th>
                                  <th className="text-left p-2">Type</th>
                                  <th className="text-left p-2">Downloaded</th>
                                  <th className="text-left p-2">IP</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activityData.resourceDownloads.map((dl: any) => (
                                  <tr key={dl.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{dl.resource?.title || "Resource"}</td>
                                    <td className="p-2">{dl.resource?.type || "-"}</td>
                                    <td className="p-2 font-mono">{new Date(dl.createdAt).toLocaleString()}</td>
                                    <td className="p-2 font-mono">{dl.ipAddress || "N/A"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

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

                      {/* NEW: Email Sends - Communication Evidence */}
                      {activityData.emailSends && activityData.emailSends.length > 0 && (
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <p className="text-sm font-semibold text-indigo-800 mb-3">📧 Email Communications ({activityData.emailSends.length})</p>
                          <div className="max-h-36 overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-indigo-100 sticky top-0">
                                <tr>
                                  <th className="text-left p-2">Subject</th>
                                  <th className="text-left p-2">Sent</th>
                                  <th className="text-left p-2">Delivered</th>
                                  <th className="text-left p-2">Opened</th>
                                  <th className="text-left p-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activityData.emailSends.map((email: any) => (
                                  <tr key={email.id} className="border-t hover:bg-indigo-50">
                                    <td className="p-2 truncate max-w-[200px]" title={email.subject}>{email.subject}</td>
                                    <td className="p-2 font-mono">{email.sentAt ? new Date(email.sentAt).toLocaleString() : "-"}</td>
                                    <td className="p-2">{email.deliveredAt ? <span className="text-green-600">✓</span> : "-"}</td>
                                    <td className="p-2">{email.openedAt ? <span className="text-green-600">✓</span> : "-"}</td>
                                    <td className="p-2">
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${email.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                        email.status === "OPENED" ? "bg-blue-100 text-blue-700" :
                                          email.status === "BOUNCED" ? "bg-red-100 text-red-700" :
                                            "bg-gray-100 text-gray-700"
                                        }`}>{email.status}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* NEW: Support Tickets - Communication Evidence */}
                      {activityData.supportTickets && activityData.supportTickets.length > 0 ? (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm font-semibold text-orange-800 mb-3">🎫 Support Tickets ({activityData.supportTickets.length})</p>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {activityData.supportTickets.map((ticket: any) => (
                              <div key={ticket.id} className="p-3 bg-white rounded border">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium text-sm">#{ticket.ticketNumber}: {ticket.subject}</p>
                                    <p className="text-xs text-gray-500">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                                  </div>
                                  <span className={`px-1.5 py-0.5 rounded text-xs ${ticket.status === "CLOSED" || ticket.status === "RESOLVED" ? "bg-green-100 text-green-700" :
                                    ticket.status === "NEW" ? "bg-blue-100 text-blue-700" :
                                      "bg-yellow-100 text-yellow-700"
                                    }`}>{ticket.status}</span>
                                </div>
                                {ticket.messages && ticket.messages.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-500">{ticket.messages.length} messages:</p>
                                    {ticket.messages.slice(0, 3).map((msg: any, i: number) => (
                                      <div key={i} className={`text-xs p-2 rounded ${msg.isFromCustomer ? "bg-gray-100" : "bg-blue-50"}`}>
                                        <span className="font-medium">{msg.isFromCustomer ? "Customer" : "Staff"}: </span>
                                        <span className="text-gray-600">{msg.content.substring(0, 100)}...</span>
                                      </div>
                                    ))}
                                    {ticket.messages.length > 3 && (
                                      <p className="text-xs text-gray-400">+{ticket.messages.length - 3} more messages</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-green-800">✅ No Support Tickets</p>
                          <p className="text-xs text-green-600">No cancellation or complaint requests on file.</p>
                        </div>
                      )}

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

              {detailTab === "ai" && (
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">AI-Powered User Analysis</h3>
                    </div>
                    {loadingAiSummary ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        <span className="ml-3 text-purple-700">Analyzing user data...</span>
                      </div>
                    ) : aiSummary ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                          {aiSummary}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={async () => {
                            setLoadingAiSummary(true);
                            setAiSummary(null);
                            try {
                              const res = await fetch("/api/admin/super-tools/ai-summary", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ userId: selectedUser.id }),
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setAiSummary(data.summary);
                              }
                            } catch (error) {
                              setAiSummary("Error regenerating summary.");
                            } finally {
                              setLoadingAiSummary(false);
                            }
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Regenerate Summary
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Click the AI Summary tab to analyze this user.
                      </div>
                    )}
                  </div>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-burgundy-600" />
              Enroll in Courses
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Select courses for{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                  {" "}({selectedUser.email})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const notEnrolledCourses = courses
                  .filter(c => !selectedUser?.enrollments?.some(e => e.course.id === c.id))
                  .map(c => c.id);
                setSelectedCourses(notEnrolledCourses);
              }}
              className="text-xs"
            >
              Select All Available
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Select FM Pro Pack courses
                const fmProSlugs = ['functional-medicine-complete-certification', 'fm-pro-advanced-clinical', 'fm-pro-master-depth', 'fm-pro-practice-path'];
                const fmProIds = courses.filter(c => fmProSlugs.includes(c.slug)).map(c => c.id);
                setSelectedCourses(prev => [...new Set([...prev, ...fmProIds])]);
              }}
              className="text-xs"
            >
              + FM Pro Pack (4)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCourses([])}
              className="text-xs"
            >
              Clear Selection
            </Button>
          </div>

          {/* Selected Count */}
          {selectedCourses.length > 0 && (
            <div className="text-sm text-burgundy-600 font-medium">
              {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
            </div>
          )}

          {/* Course List */}
          <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-2">
            {courses
              .filter(course =>
                course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                course.slug.toLowerCase().includes(courseSearch.toLowerCase())
              )
              .map((course) => {
                const isEnrolled = selectedUser?.enrollments?.some(e => e.course.id === course.id);
                const isSelected = selectedCourses.includes(course.id);

                return (
                  <label
                    key={course.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${isEnrolled
                      ? 'bg-green-50 border border-green-200 opacity-60'
                      : isSelected
                        ? 'bg-burgundy-50 border border-burgundy-300'
                        : 'hover:bg-gray-50 border border-transparent'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected || isEnrolled}
                      disabled={isEnrolled}
                      onChange={(e) => {
                        if (isEnrolled) return;
                        if (e.target.checked) {
                          setSelectedCourses(prev => [...prev, course.id]);
                        } else {
                          setSelectedCourses(prev => prev.filter(id => id !== course.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isEnrolled ? 'text-green-700' : 'text-gray-900'}`}>
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{course.slug}</p>
                    </div>
                    {isEnrolled && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                        Enrolled
                      </Badge>
                    )}
                  </label>
                );
              })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEnrollDialogOpen(false);
                setSelectedCourses([]);
                setCourseSearch("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handleEnrollUser(selectedUser.id, selectedCourses)}
              disabled={selectedCourses.length === 0 || enrollingCourses}
              className="bg-burgundy-600 hover:bg-burgundy-700"
            >
              {enrollingCourses
                ? "Enrolling..."
                : `Enroll in ${selectedCourses.length} Course${selectedCourses.length !== 1 ? 's' : ''}`
              }
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
                  <SelectItem value="SUPPORT">Support (Read-Only)</SelectItem>
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
        if (open) {
          fetchExistingTags();
          setCreateUserTagSearch("");
        } else {
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newUserData.password}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Min 8 characters"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4 text-gray-400" />
                        ) : (
                          <div className="relative">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <div className="absolute top-1/2 left-[-2px] right-[-2px] h-[1.5px] bg-gray-400 rotate-45 transform -translate-y-1/2" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={newUserData.confirmPassword}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm password"
                        className={`pr-10 ${newUserData.confirmPassword && newUserData.password !== newUserData.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <Eye className="h-4 w-4 text-gray-400" />
                        ) : (
                          <div className="relative">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <div className="absolute top-1/2 left-[-2px] right-[-2px] h-[1.5px] bg-gray-400 rotate-45 transform -translate-y-1/2" />
                          </div>
                        )}
                      </Button>
                    </div>
                    {newUserData.confirmPassword && newUserData.password !== newUserData.confirmPassword && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                  </div>
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
                      <SelectItem value="SUPPORT">Support (Read-Only)</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Selection with Search */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Apply Tags (optional)
                  </Label>

                  {/* Search existing tags or add custom */}
                  <div className="flex gap-2">
                    <Input
                      value={createUserTagSearch}
                      onChange={(e) => setCreateUserTagSearch(e.target.value)}
                      placeholder="Search or type custom tag..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && createUserTagSearch.trim()) {
                          e.preventDefault();
                          const newTag = createUserTagSearch.trim();
                          if (!newUserData.tags.includes(newTag)) {
                            setNewUserData(prev => ({
                              ...prev,
                              tags: [...prev.tags, newTag]
                            }));
                          }
                          setCreateUserTagSearch("");
                        }
                      }}
                    />
                    {createUserTagSearch.trim() && !existingTags.includes(createUserTagSearch.trim()) && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newTag = createUserTagSearch.trim();
                          if (!newUserData.tags.includes(newTag)) {
                            setNewUserData(prev => ({
                              ...prev,
                              tags: [...prev.tags, newTag]
                            }));
                          }
                          setCreateUserTagSearch("");
                        }}
                        className="whitespace-nowrap"
                      >
                        + Add "{createUserTagSearch.trim()}"
                      </Button>
                    )}
                  </div>

                  {/* Existing tags from database */}
                  {loadingTags ? (
                    <div className="text-center py-2 text-gray-500 text-sm">Loading tags...</div>
                  ) : (
                    <div className="max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50 mb-2">
                      <div className="flex flex-wrap gap-2">
                        {existingTags.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-1 w-full">No existing tags. Type above to add new tags.</p>
                        ) : existingTags
                          .filter((tag) => tag.toLowerCase().includes(createUserTagSearch.toLowerCase()))
                          .length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-1 w-full">No tags match. Press Enter or click + to add custom tag.</p>
                        ) : (
                          existingTags
                            .filter((tag) => tag.toLowerCase().includes(createUserTagSearch.toLowerCase()))
                            .map((tag) => (
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
                                className={`px-2 py-1 text-xs rounded-full border transition-colors ${newUserData.tags.includes(tag)
                                  ? "bg-burgundy-100 border-burgundy-300 text-burgundy-700"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-burgundy-50 hover:border-burgundy-200"
                                  }`}
                              >
                                {tag}
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tag Packs - One-click bundles */}
                  <p className="text-xs text-gray-500 mt-2 font-semibold">📦 Tag Packs (one-click):</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.entries(TAG_PACKS).map(([packName, packTags]) => {
                      const allSelected = packTags.every(tag => newUserData.tags.includes(tag));
                      return (
                        <button
                          key={packName}
                          type="button"
                          onClick={() => {
                            setNewUserData(prev => {
                              if (allSelected) {
                                // Remove all pack tags
                                return {
                                  ...prev,
                                  tags: prev.tags.filter(t => !packTags.includes(t))
                                };
                              } else {
                                // Add all pack tags (avoiding duplicates)
                                const newTags = [...prev.tags];
                                packTags.forEach(tag => {
                                  if (!newTags.includes(tag)) {
                                    newTags.push(tag);
                                  }
                                });
                                return { ...prev, tags: newTags };
                              }
                            });
                          }}
                          className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-all font-medium ${allSelected
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-gradient-to-r from-burgundy-50 to-burgundy-100 border-burgundy-300 text-burgundy-700 hover:border-burgundy-500"
                            }`}
                        >
                          {allSelected ? "✓ " : "🏷️ "}{packName} ({packTags.length} tags)
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick select common tags */}
                  <p className="text-xs text-gray-500 mt-2">Quick select:</p>
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
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${newUserData.tags.includes(tag)
                          ? "bg-burgundy-100 border-burgundy-300 text-burgundy-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Selected tags display */}
                  {newUserData.tags.length > 0 && (
                    <div className="p-2 bg-burgundy-50 border border-burgundy-200 rounded-lg mt-2">
                      <p className="text-xs text-burgundy-700 mb-1"><strong>{newUserData.tags.length} tag(s) selected:</strong></p>
                      <div className="flex flex-wrap gap-1">
                        {newUserData.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-burgundy-100 text-burgundy-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
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
                      confirmPassword: "",
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
                  disabled={creatingUser || !newUserData.email || !newUserData.password || !newUserData.confirmPassword}
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
              Add Tags
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <span>
                  Add tags to{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                  {" "}(click multiple to select)
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Search existing tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search & Select Tags
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
                <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
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
                            onClick={() => toggleTag(tag)}
                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${selectedTags.includes(tag)
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200"
                              }`}
                          >
                            {selectedTags.includes(tag) && "✓ "}{tag}
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

            {/* Custom tag input */}
            <div className="space-y-2">
              <Label htmlFor="tagInput">Add custom tag</Label>
              <div className="flex gap-2">
                <Input
                  id="tagInput"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Type custom tag and press Add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagSearch.trim() && !selectedTags.includes(tagSearch.trim())) {
                      e.preventDefault();
                      setSelectedTags(prev => [...prev, tagSearch.trim()]);
                      setTagSearch('');
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (tagSearch.trim() && !selectedTags.includes(tagSearch.trim())) {
                      setSelectedTags(prev => [...prev, tagSearch.trim()]);
                      setTagSearch('');
                    }
                  }}
                  disabled={!tagSearch.trim() || selectedTags.includes(tagSearch.trim())}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected tags display */}
            {selectedTags.length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 mb-2">
                  <strong>Selected ({selectedTags.length}):</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-green-100 border border-green-300 text-green-700 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
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
              disabled={addingTag || selectedTags.length === 0}
            >
              {addingTag ? "Adding..." : `Add ${selectedTags.length} Tag${selectedTags.length !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Login Credentials Dialog */}
      <Dialog open={loginEmailDialogOpen} onOpenChange={setLoginEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-burgundy-600" />
              Send Login Credentials
            </DialogTitle>
            <DialogDescription>
              This will reset the user&apos;s password to <strong>Futurecoach2025</strong> and email them new login instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Recipient Email</Label>
              <Input
                id="login-email"
                value={targetLoginEmail}
                onChange={(e) => setTargetLoginEmail(e.target.value)}
                placeholder="user@example.com"
              />
              <p className="text-xs text-gray-500">
                Update this only if the user needs to login with a different email.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLoginEmailDialogOpen(false)}
              disabled={sendingLoginEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendLoginEmail}
              disabled={sendingLoginEmail || !targetLoginEmail.trim()}
              className="bg-burgundy-600 hover:bg-burgundy-700"
            >
              {sendingLoginEmail ? "Sending..." : "Send Credentials"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Change Dialog */}
      <Dialog open={emailChangeDialogOpen} onOpenChange={setEmailChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Update email for {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmail">Current Email</Label>
              <Input
                id="currentEmail"
                value={selectedUser?.email || ""}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="newemail@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <p className="text-xs text-orange-600">
              ⚠️ Changing the email will update all associated accounts and logins.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEmailChangeDialogOpen(false)}
              disabled={changingEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmailChange}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={changingEmail || !newUserEmail.trim() || newUserEmail === selectedUser?.email}
            >
              {changingEmail ? "Updating..." : "Update Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Name Change Dialog */}
      <Dialog open={nameChangeDialogOpen} onOpenChange={setNameChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Name</DialogTitle>
            <DialogDescription>
              Update name for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newFirstName">First Name</Label>
              <Input
                id="newFirstName"
                placeholder="First name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newLastName">Last Name</Label>
              <Input
                id="newLastName"
                placeholder="Last name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNameChangeDialogOpen(false)}
              disabled={changingName}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNameChange}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={changingName || (!newFirstName.trim() && !newLastName.trim())}
            >
              {changingName ? "Updating..." : "Update Name"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
