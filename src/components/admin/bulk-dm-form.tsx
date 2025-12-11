"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, UserCircle } from "lucide-react";

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

export function BulkDMForm({ userStats, coaches = [] }: BulkDMFormProps) {
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [senderId, setSenderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getRecipientCount = () => {
    switch (recipientType) {
      case "enrolled":
        return userStats.enrolledUsers;
      case "completed":
        return userStats.completedUsers;
      default:
        return userStats.totalUsers;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!senderId) {
      setError("Please select who should send this message");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/bulk-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, recipientType, senderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send messages");
        return;
      }

      setSuccess(`Successfully sent to ${data.sentCount} recipients`);
      setContent("");
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
          onChange={(e) => setRecipientType(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 bg-white"
        >
          <option value="all">All Students ({userStats.totalUsers})</option>
          <option value="enrolled">Currently Enrolled ({userStats.enrolledUsers})</option>
          <option value="completed">Completed Course ({userStats.completedUsers})</option>
        </select>
      </div>

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
          Will be sent to <strong>{getRecipientCount()}</strong> recipients
        </p>
        <Button type="submit" loading={loading}>
          <Send className="w-4 h-4 mr-2" />
          Send DM
        </Button>
      </div>
    </form>
  );
}
