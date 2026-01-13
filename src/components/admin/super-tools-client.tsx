"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Loader2,
    CheckCircle,
    RotateCcw,
    Unlock,
    ShieldAlert,
    User,
    BookOpen,
    Eye,
    ChevronDown,
    Layers,
    Users,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
    id: string;
    title: string;
    slug: string;
}

interface UserData {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    role: string;
    enrollments: {
        id: string;
        courseId: string;
        course: { title: string; slug: string };
        progress: number;
        completedLessons: number;
        totalLessons: number;
        status: string;
    }[];
    podMemberships?: {
        id: string;
        isCoach: boolean;
        lastActiveAt: string | null;
        pod: { id: string; name: string };
    }[];
}

interface SuperToolsClientProps {
    courses: Course[];
}

export function SuperToolsClient({ courses }: SuperToolsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    const [targetCourseId, setTargetCourseId] = useState("");
    const [modulesByCourse, setModulesByCourse] = useState<Record<string, { id: string; title: string; order: number }[]>>({});
    const [selectedModuleId, setSelectedModuleId] = useState<Record<string, string>>({});
    const [loadingModules, setLoadingModules] = useState<Record<string, boolean>>({});

    const fetchModulesForCourse = async (courseId: string) => {
        if (modulesByCourse[courseId]) return; // Already fetched
        setLoadingModules(prev => ({ ...prev, [courseId]: true }));
        try {
            const res = await fetch(`/api/admin/super-tools/modules?courseId=${courseId}`);
            if (res.ok) {
                const data = await res.json();
                setModulesByCourse(prev => ({ ...prev, [courseId]: data.modules }));
            }
        } catch (error) {
            console.error("Failed to fetch modules", error);
        } finally {
            setLoadingModules(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSelectedUser(null);
        try {
            const res = await fetch(`/api/admin/super-tools/search?q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.users || []);
                if (data.users && data.users.length === 0) {
                    toast.info("No users found matching your search.");
                }
            } else {
                toast.error("Search failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error performing search.");
        } finally {
            setIsSearching(false);
        }
    };

    const selectUser = (user: UserData) => {
        setSelectedUser(user);
        setSearchResults([]);
        setSearchQuery("");
    };

    const refreshUserData = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/super-tools/search?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.users && data.users[0]) {
                    setSelectedUser(data.users[0]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleGrantAccess = async () => {
        if (!selectedUser || !targetCourseId) return;

        setIsLoadingAction(true);
        const toastId = toast.loading("Granting access...");

        try {
            const res = await fetch("/api/admin/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.id, courseId: targetCourseId }),
            });

            if (res.ok) {
                toast.success("Access granted successfully!", { id: toastId });
                await refreshUserData(selectedUser.id);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to grant access", { id: toastId });
            }
        } catch (error) {
            toast.error("Error granting access", { id: toastId });
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleUpdateProgress = async (action: "complete_course" | "reset_course", courseId: string) => {
        if (!selectedUser) return;

        setIsLoadingAction(true);
        const actionText = action === "complete_course" ? "Completing course..." : "Resetting progress...";
        const toastId = toast.loading(actionText);

        try {
            const res = await fetch("/api/admin/super-tools/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    courseId: courseId,
                    action
                }),
            });

            if (res.ok) {
                toast.success(
                    action === "complete_course"
                        ? "Course marked as complete! Certificate should be available."
                        : "Course progress reset.",
                    { id: toastId }
                );
                await refreshUserData(selectedUser.id);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update progress", { id: toastId });
            }
        } catch (error) {
            toast.error("Error updating progress", { id: toastId });
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleCompleteToModule = async (courseId: string) => {
        if (!selectedUser) return;
        const moduleId = selectedModuleId[courseId];
        if (!moduleId) {
            toast.error("Please select a module first.");
            return;
        }

        setIsLoadingAction(true);
        const toastId = toast.loading("Setting progress...");

        try {
            const res = await fetch("/api/admin/super-tools/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    courseId,
                    action: "complete_to_module",
                    moduleId
                }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(data.message || "Progress updated!", { id: toastId });
                await refreshUserData(selectedUser.id);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update progress", { id: toastId });
            }
        } catch (error) {
            toast.error("Error updating progress", { id: toastId });
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleRemoveFromPod = async (membershipId: string, podName: string) => {
        if (!selectedUser) return;

        setIsLoadingAction(true);
        const toastId = toast.loading(`Removing from ${podName}...`);

        try {
            const res = await fetch("/api/admin/super-tools/pod", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    action: "remove_from_pod",
                    membershipId
                }),
            });

            if (res.ok) {
                toast.success(`Removed from ${podName}!`, { id: toastId });
                await refreshUserData(selectedUser.id);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to remove from pod", { id: toastId });
            }
        } catch (error) {
            toast.error("Error removing from pod", { id: toastId });
        } finally {
            setIsLoadingAction(false);
        }
    };

    return (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Left Column: Search & Selection */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Find User</CardTitle>
                        <CardDescription>Search by email or name</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="email@example.com"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button type="submit" disabled={isSearching}>
                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-4 space-y-2">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => selectUser(user)}
                                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user.avatar || ""} />
                                        <AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {selectedUser && (
                    <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-burgundy-100">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-4 border-white shadow-sm">
                                    <AvatarImage src={selectedUser.avatar || ""} />
                                    <AvatarFallback className="text-xl bg-burgundy-100 text-burgundy-700">
                                        {selectedUser.firstName?.[0] || selectedUser.email[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{selectedUser.firstName} {selectedUser.lastName}</CardTitle>
                                    <CardDescription>{selectedUser.email}</CardDescription>
                                    <Badge variant="outline" className="mt-2 text-xs">
                                        {selectedUser.role}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="pt-4 border-t">
                                    <Label className="mb-2 block">Grant Access to Course</Label>
                                    <div className="flex gap-2">
                                        <Select value={targetCourseId} onValueChange={setTargetCourseId}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select course..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={handleGrantAccess}
                                            disabled={!targetCourseId || isLoadingAction}
                                            size="sm"
                                        >
                                            {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Pod Memberships Section */}
                                {selectedUser.podMemberships && selectedUser.podMemberships.length > 0 && (
                                    <div className="pt-4 border-t">
                                        <Label className="mb-2 block flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Pod Memberships ({selectedUser.podMemberships.length})
                                        </Label>
                                        <div className="space-y-2">
                                            {selectedUser.podMemberships.map((membership) => (
                                                <div
                                                    key={membership.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{membership.pod.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {membership.isCoach ? "Coach" : "Member"}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                                        onClick={() => handleRemoveFromPod(membership.id, membership.pod.name)}
                                                        disabled={isLoadingAction}
                                                    >
                                                        {isLoadingAction ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3 h-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Column: Progress & Actions */}
            <div className="lg:col-span-2">
                {selectedUser ? (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-burgundy-600" />
                            Active Enrollments
                        </h2>

                        {selectedUser.enrollments.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-gray-500">
                                    <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No active enrollments found for this user.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            selectedUser.enrollments.map((enrollment) => (
                                <Card key={enrollment.id} className="overflow-hidden">
                                    <CardHeader className="bg-gray-50/50 pb-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <span className={enrollment.progress === 100 ? "text-green-600 font-medium" : ""}>
                                                        {enrollment.progress}% Complete
                                                    </span>
                                                    <span>•</span>
                                                    <span>{enrollment.completedLessons} / {enrollment.totalLessons} lessons</span>
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant={enrollment.progress === 100 ? "default" : "secondary"}
                                                className={enrollment.progress === 100 ? "bg-green-600 hover:bg-green-700" : ""}
                                            >
                                                {enrollment.status}
                                            </Badge>
                                        </div>
                                        <Progress value={enrollment.progress} className="h-2 mt-3" />
                                    </CardHeader>
                                    <CardContent className="p-4 bg-white">
                                        <div className="flex flex-wrap gap-3 justify-end">
                                            {/* Reset Progress Button */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
                                                        <RotateCcw className="w-4 h-4 mr-2" />
                                                        Reset Progress
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Reset Course Progress?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will reset progress to 0% and verify ALL completion records for this course.
                                                            Certificates will be invalidated. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleUpdateProgress("reset_course", enrollment.courseId)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Reset Everything
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            {/* Complete Course Button */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        disabled={enrollment.progress === 100}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Complete Course 100%
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Force Complete Course?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will mark all lessons as completed and generate the certificate immediately.
                                                            The user will receive a completion email.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleUpdateProgress("complete_course", enrollment.courseId)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Force Complete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>

                                        {/* Module-Level Progress Control */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Layers className="w-4 h-4 text-gray-500" />
                                                <Label className="text-sm font-medium text-gray-700">Set Progress to Module</Label>
                                            </div>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={selectedModuleId[enrollment.courseId] || ""}
                                                    onValueChange={(val) => {
                                                        setSelectedModuleId(prev => ({ ...prev, [enrollment.courseId]: val }));
                                                    }}
                                                    onOpenChange={() => fetchModulesForCourse(enrollment.courseId)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={loadingModules[enrollment.courseId] ? "Loading..." : "Select module..."} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {modulesByCourse[enrollment.courseId]?.map(mod => (
                                                            <SelectItem key={mod.id} value={mod.id}>
                                                                {mod.order}. {mod.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCompleteToModule(enrollment.courseId)}
                                                    disabled={!selectedModuleId[enrollment.courseId] || isLoadingAction}
                                                >
                                                    {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Complete all lessons up to and including the selected module</p>
                                        </div>

                                        {/* View as Student Link */}
                                        <div className="mt-3 flex justify-end">
                                            <a
                                                href={`/learn/${enrollment.course.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View Course
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                        <div className="text-center">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Search and select a user to manage their progress</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
