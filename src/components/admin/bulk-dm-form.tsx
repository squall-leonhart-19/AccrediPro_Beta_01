"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, UserCircle, Search, X } from "lucide-react";

interface Coach {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: string;
}

interface BulkDMFormProps {
  userStats: {
    totalUsers: number;
    enrolledUsers: number;
    completedUsers: number;
  };
  coaches?: Coach[];
}

interface StudentResult {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

export function BulkDMForm({ userStats, coaches = [] }: BulkDMFormProps) {
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [senderId, setSenderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Single student selection
  const [singleStudentId, setSingleStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getRecipientCount = () => {
    switch (recipientType) {
      case "enrolled":
        return userStats.enrolledUsers;
      case "completed":
        return userStats.completedUsers;
      case "single":
        return selectedStudent ? 1 : 0;
      default:
        return userStats.totalUsers;
    }
  };

  // Search students by email or name
  const searchStudents = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `/api/admin/users/search?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
        setShowDropdown(true);
      }
    } catch {
      console.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchStudents(value);
  };

  const selectStudent = (student: StudentResult) => {
    setSelectedStudent(student);
    setSingleStudentId(student.id);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const clearSelectedStudent = () => {
    setSelectedStudent(null);
    setSingleStudentId("");
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!senderId) {
      setError("Please select who should send this message");
      return;
    }

    if (recipientType === "single" && !singleStudentId) {
      setError("Please search and select a student");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/bulk-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          recipientType,
          senderId,
          singleUserId: recipientType === "single" ? singleStudentId : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send messages");
        return;
      }

      setSuccess(`Successfully sent to ${data.sentCount} recipient${data.sentCount === 1 ? "" : "s"}`);
      setContent("");
      if (recipientType === "single") {
        clearSelectedStudent();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCoach = coaches.find((c) => c.id === senderId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Sender Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Send As <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 appearance-none bg-white pr-10"
            required
          >
            <option value="">Select sender...</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.firstName} {coach.lastName} ({coach.role})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <UserCircle className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        {selectedCoach && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-purple-50 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarImage src={selectedCoach.avatar || undefined} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                {selectedCoach.firstName?.charAt(0)}
                {selectedCoach.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                {selectedCoach.firstName} {selectedCoach.lastName}
              </p>
              <p className="text-xs text-gray-500">{selectedCoach.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recipients */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Recipients
        </label>
        <select
          value={recipientType}
          onChange={(e) => {
            setRecipientType(e.target.value);
            if (e.target.value !== "single") {
              clearSelectedStudent();
            }
          }}
          className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 bg-white"
        >
          <option value="single">🎯 Single Student (Test)</option>
          <option value="all">All Students ({userStats.totalUsers})</option>
          <option value="enrolled">Currently Enrolled ({userStats.enrolledUsers})</option>
          <option value="completed">Completed Course ({userStats.completedUsers})</option>
        </select>
      </div>

      {/* Single Student Search */}
      {recipientType === "single" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Search Student by Email or Name
          </label>
          {selectedStudent ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedStudent.avatar || undefined} />
                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                  {selectedStudent.firstName?.charAt(0) || "?"}
                  {selectedStudent.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-sm">
                <p className="font-medium text-gray-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
                <p className="text-xs text-gray-500">{selectedStudent.email}</p>
              </div>
              <button
                type="button"
                onClick={clearSelectedStudent}
                className="p-1 hover:bg-green-100 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Type email or name to search..."
                  className="w-full h-10 rounded-md border border-gray-300 px-3 pl-9 text-sm focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 bg-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-burgundy-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => selectStudent(student)}
                      className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar || undefined} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                          {student.firstName?.charAt(0) || "?"}
                          {student.lastName?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                  No students found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message
        </label>
        <textarea
          className="w-full min-h-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 bg-white"
          placeholder="Write your direct message here... Use {firstName} for personalization."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          Available placeholders: {"{firstName}"}, {"{lastName}"}, {"{email}"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Will be sent to <strong>{getRecipientCount()}</strong> recipient{getRecipientCount() === 1 ? "" : "s"}
        </p>
        <Button type="submit" disabled={loading || (recipientType === "single" && !singleStudentId)}>
          <Send className="w-4 h-4 mr-2" />
          {loading ? "Sending..." : "Send DM"}
        </Button>
      </div>
    </form>
  );
}
