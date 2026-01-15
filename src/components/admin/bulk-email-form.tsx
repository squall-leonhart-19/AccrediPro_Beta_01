"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, X } from "lucide-react";

interface BulkEmailFormProps {
  userStats: {
    totalUsers: number;
    enrolledUsers: number;
    completedUsers: number;
  };
}

interface StudentResult {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

export function BulkEmailForm({ userStats }: BulkEmailFormProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [templateStyle, setTemplateStyle] = useState("branded");
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

    if (recipientType === "single" && !singleStudentId) {
      setError("Please search and select a student");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          content,
          recipientType,
          templateStyle,
          singleUserId: recipientType === "single" ? singleStudentId : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send emails");
        return;
      }

      setSuccess(`Successfully sent to ${data.sentCount} recipient${data.sentCount === 1 ? "" : "s"}`);
      setSubject("");
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

      {/* Email Template Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Style
        </label>
        <select
          value={templateStyle}
          onChange={(e) => setTemplateStyle(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 bg-white"
        >
          <option value="branded">🏛️ Branded (Official - with logo & header)</option>
          <option value="personal">💬 Personal (Sarah style - plain text look)</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          {templateStyle === "branded"
            ? "Professional look with burgundy header, logo, and footer"
            : "Simple text style for higher inbox delivery"}
        </p>
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
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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

      <Input
        label="Subject"
        placeholder="Email subject line"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message
        </label>
        <textarea
          className="w-full min-h-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 bg-white"
          placeholder="Write your email content here... Use {firstName} for personalization."
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
          {loading ? "Sending..." : "Send Email"}
        </Button>
      </div>
    </form>
  );
}
