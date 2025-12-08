"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Mail,
  MessageSquare,
  BookOpen,
  Award,
  MoreVertical,
  UserPlus,
  Filter,
  Download,
  ChevronDown,
  X,
  GraduationCap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
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
  _count: {
    certificates: number;
    progress: number;
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Dialog states
  const [dmDialogOpen, setDmDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
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

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700",
    INSTRUCTOR: "bg-purple-100 text-purple-700",
    MENTOR: "bg-blue-100 text-blue-700",
    STUDENT: "bg-gray-100 text-gray-700",
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-burgundy-600 hover:bg-burgundy-700 gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="INSTRUCTOR">Instructors</option>
                <option value="MENTOR">Mentors</option>
                <option value="ADMIN">Admins</option>
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
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Bulk DM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Courses</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Certificates</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Active</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={roleColors[user.role] || roleColors.STUDENT}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {user.enrollments.length > 0 ? (
                            user.enrollments.slice(0, 2).map((enrollment) => (
                              <div key={enrollment.id} className="text-sm">
                                <span className="text-gray-900">{enrollment.course.title}</span>
                                <span className="text-gray-400 ml-2">
                                  ({Math.round(enrollment.progress)}%)
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No courses</span>
                          )}
                          {user.enrollments.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{user.enrollments.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-gold-500" />
                          <span className="font-medium">{user._count.certificates}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-burgundy-50">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-burgundy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {course.title}
                  </p>
                </div>
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
    </div>
  );
}
