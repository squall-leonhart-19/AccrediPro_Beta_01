"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Mail,
  User,
  Clock,
  RefreshCw,
  Search,
  Download,
  ExternalLink,
} from "lucide-react";

interface ChatOptin {
  id: string;
  visitorId: string;
  name: string;
  email: string | null;
  page: string;
  createdAt: string;
  messageCount?: number;
}

export default function ChatOptinsPage() {
  const [optins, setOptins] = useState<ChatOptin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOptins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chat-optins");
      const data = await res.json();
      setOptins(data.optins || []);
    } catch (error) {
      console.error("Failed to fetch optins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptins();
  }, []);

  const filteredOptins = optins.filter(
    (optin) =>
      optin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (optin.email && optin.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ["Name", "Email", "Page", "Date", "Messages"];
    const rows = filteredOptins.map((o) => [
      o.name,
      o.email || "",
      o.page,
      new Date(o.createdAt).toLocaleDateString(),
      o.messageCount || 0,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-optins-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const totalWithEmail = optins.filter((o) => o.email).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Optins</h1>
          <p className="text-gray-500">Leads captured from sales page live chat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOptins}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{optins.length}</p>
                <p className="text-gray-500 text-sm">Total Optins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalWithEmail}</p>
                <p className="text-gray-500 text-sm">With Email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {optins.length > 0
                    ? Math.round((totalWithEmail / optins.length) * 100)
                    : 0}
                  %
                </p>
                <p className="text-gray-500 text-sm">Email Capture Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Chat Optins</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredOptins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No results found" : "No chat optins yet"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOptins.map((optin) => (
                  <TableRow key={optin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium">{optin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {optin.email ? (
                        <a
                          href={`mailto:${optin.email}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {optin.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{optin.page}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-gray-400" />
                        {optin.messageCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatDate(optin.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/admin/live-chat?visitor=${optin.visitorId}`)
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
