"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface BulkDMFormProps {
  userStats: {
    totalUsers: number;
    enrolledUsers: number;
    completedUsers: number;
  };
}

export function BulkDMForm({ userStats }: BulkDMFormProps) {
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState("all");
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
    setLoading(true);

    try {
      const response = await fetch("/api/admin/bulk-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, recipientType }),
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Recipients
        </label>
        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20"
        >
          <option value="all">All Students ({userStats.totalUsers})</option>
          <option value="enrolled">Currently Enrolled ({userStats.enrolledUsers})</option>
          <option value="completed">Completed Course ({userStats.completedUsers})</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message
        </label>
        <textarea
          className="w-full min-h-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20"
          placeholder="Write your direct message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
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
