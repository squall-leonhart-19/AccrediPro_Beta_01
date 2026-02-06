"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, ExternalLink, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    type Lead,
    STATUS_STYLES,
    STATUS_LABELS,
    formatCurrency,
    formatDate,
} from "./metric-types";

interface LeadsTableProps {
    leads: Lead[];
    showNicheColumn?: boolean;
    title?: string;
    description?: string;
    pageSize?: number;
}

export function LeadsTable({ leads, showNicheColumn = true, title, description, pageSize = 50 }: LeadsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [visibleCount, setVisibleCount] = useState(pageSize);

    const filteredLeads = useMemo(() => {
        return leads
            .filter((lead) => {
                const matchesSearch =
                    searchQuery === "" ||
                    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === "newest") return new Date(b.optinDate || "").getTime() - new Date(a.optinDate || "").getTime();
                if (sortBy === "oldest") return new Date(a.optinDate || "").getTime() - new Date(b.optinDate || "").getTime();
                if (sortBy === "progress") return b.progress - a.progress;
                if (sortBy === "revenue") return b.revenue - a.revenue;
                return 0;
            });
    }, [leads, searchQuery, statusFilter, sortBy]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle>{title || `${filteredLeads.length} Leads`}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by email or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="REFUNDED">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="progress">Progress</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto -mx-6 px-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lead</TableHead>
                                {showNicheColumn && <TableHead className="hidden sm:table-cell">Niche</TableHead>}
                                <TableHead className="hidden md:table-cell">Optin</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right hidden sm:table-cell">Revenue</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.slice(0, visibleCount).map((lead) => (
                                <TableRow key={lead.id} className={cn(lead.isStuck ? "bg-amber-50" : "")}>
                                    <TableCell>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {lead.firstName} {lead.lastName}
                                                {lead.isStuck && <Clock className="inline w-3 h-3 ml-1 text-amber-500" />}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                                        </div>
                                    </TableCell>
                                    {showNicheColumn && (
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="outline" className="text-xs whitespace-nowrap">{lead.categoryLabel}</Badge>
                                        </TableCell>
                                    )}
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-xs">{formatDate(lead.optinDate)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-20 sm:w-24">
                                            <div className="flex items-center gap-1.5">
                                                <Progress value={lead.progress} className="h-1.5 sm:h-2 flex-1" />
                                                <span className="text-xs shrink-0">{lead.progress}%</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400">{lead.lessonsCompleted}/9</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(STATUS_STYLES[lead.status], "text-xs whitespace-nowrap")}>
                                            {STATUS_LABELS[lead.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right hidden sm:table-cell">
                                        {lead.revenue > 0 ? (
                                            <span className="text-sm font-medium text-green-600">{formatCurrency(lead.revenue)}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Link href={`/admin/users/${lead.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Profile">
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/live-chat?user=${lead.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Chat">
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {filteredLeads.length > visibleCount && (
                    <div className="text-center mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVisibleCount(prev => prev + pageSize)}
                        >
                            Load More ({filteredLeads.length - visibleCount} remaining)
                        </Button>
                    </div>
                )}
                {filteredLeads.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No leads match your filters</p>
                )}
            </CardContent>
        </Card>
    );
}
