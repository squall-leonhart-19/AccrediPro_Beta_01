"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    HeartPulse, AlertTriangle, XCircle, Ghost,
    Users, Loader2, RefreshCw, Mail, Calendar,
    TrendingUp, TrendingDown
} from "lucide-react";
import { toast } from "sonner";

interface UserHealth {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    avatar: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    _count: {
        enrollments: number;
        certificates: number;
    };
}

interface HealthData {
    stats: {
        healthy: number;
        atRisk: number;
        churning: number;
        lost: number;
        total: number;
        newUsersLast30: number;
    };
    users: {
        healthy: UserHealth[];
        atRisk: UserHealth[];
        churning: UserHealth[];
        lost: UserHealth[];
    };
    thresholds: {
        healthy: number;
        atRisk: number;
        churning: number;
    };
}

type Segment = "healthy" | "atRisk" | "churning" | "lost";

const segmentConfig = {
    healthy: {
        label: "Healthy",
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        icon: HeartPulse,
        description: "Logged in within 7 days, making progress"
    },
    atRisk: {
        label: "At Risk",
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        icon: AlertTriangle,
        description: "No login for 7-30 days"
    },
    churning: {
        label: "Churning",
        color: "bg-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: XCircle,
        description: "No login for 30-60 days, high risk"
    },
    lost: {
        label: "Lost",
        color: "bg-gray-500",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
        icon: Ghost,
        description: "No login for 60+ days or never logged in"
    }
};

export default function HealthDashboardClient() {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/super-tools/health");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                toast.error("Failed to load health data");
            }
        } catch (error) {
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (date: Date | null) => {
        if (!date) return "Never";
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "Yesterday";
        if (diff < 7) return `${diff} days ago`;
        if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
        return `${Math.floor(diff / 30)} months ago`;
    };

    const getInitials = (firstName: string | null, lastName: string | null) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 text-gray-500">
                Failed to load health data.
                <Button variant="outline" onClick={fetchData} className="ml-2">
                    Retry
                </Button>
            </div>
        );
    }

    const healthRate = data.stats.total > 0
        ? Math.round((data.stats.healthy / data.stats.total) * 100)
        : 0;

    const selectedUsers = selectedSegment ? data.users[selectedSegment] : [];
    const config = selectedSegment ? segmentConfig[selectedSegment] : null;

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Total Users */}
                <Card className="p-4 bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 opacity-80" />
                        <div>
                            <div className="text-3xl font-bold">{data.stats.total}</div>
                            <div className="text-xs text-burgundy-200">Total Users</div>
                        </div>
                    </div>
                </Card>

                {/* Health Segments */}
                {(Object.keys(segmentConfig) as Segment[]).map((segment) => {
                    const cfg = segmentConfig[segment];
                    const count = data.stats[segment];
                    const Icon = cfg.icon;
                    const isSelected = selectedSegment === segment;

                    return (
                        <Card
                            key={segment}
                            className={`p-4 cursor-pointer transition-all ${isSelected
                                    ? `${cfg.bgColor} ${cfg.borderColor} border-2 shadow-lg`
                                    : "hover:shadow-md hover:border-gray-300"
                                }`}
                            onClick={() => setSelectedSegment(isSelected ? null : segment)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${cfg.color} bg-opacity-20 flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${cfg.textColor}`} />
                                </div>
                                <div>
                                    <div className={`text-2xl font-bold ${cfg.textColor}`}>{count}</div>
                                    <div className="text-xs text-gray-600">{cfg.label}</div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Health Rate Indicator */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Overall Health Rate</h3>
                        <p className="text-sm text-gray-500">Percentage of users in healthy segment</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {healthRate >= 50 ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-2xl font-bold ${healthRate >= 50 ? "text-green-600" : "text-red-600"}`}>
                            {healthRate}%
                        </span>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="h-full flex">
                        <div
                            className="bg-green-500 transition-all"
                            style={{ width: `${(data.stats.healthy / data.stats.total) * 100}%` }}
                        />
                        <div
                            className="bg-yellow-500 transition-all"
                            style={{ width: `${(data.stats.atRisk / data.stats.total) * 100}%` }}
                        />
                        <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${(data.stats.churning / data.stats.total) * 100}%` }}
                        />
                        <div
                            className="bg-gray-500 transition-all"
                            style={{ width: `${(data.stats.lost / data.stats.total) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>🟢 Healthy</span>
                    <span>🟡 At Risk</span>
                    <span>🔴 Churning</span>
                    <span>⚫ Lost</span>
                </div>
            </Card>

            {/* Selected Segment Users */}
            {selectedSegment && config && (
                <Card className={`p-6 ${config.bgColor} ${config.borderColor} border`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <config.icon className={`w-6 h-6 ${config.textColor}`} />
                            <div>
                                <h3 className={`font-semibold ${config.textColor}`}>{config.label} Users</h3>
                                <p className="text-sm text-gray-600">{config.description}</p>
                            </div>
                        </div>
                        <Badge className={`${config.color} text-white`}>
                            {selectedUsers.length} users
                        </Badge>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedUsers.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No users in this segment</p>
                        ) : (
                            selectedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={user.avatar || ""} />
                                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                                                {getInitials(user.firstName, user.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(user.lastLoginAt)}
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {user._count.enrollments} courses
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {user._count.certificates} certs
                                            </Badge>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-8">
                                            <Mail className="w-3 h-3 mr-1" />
                                            Contact
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">{data.stats.newUsersLast30}</div>
                            <div className="text-xs text-gray-500">New users (30 days)</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">
                                {data.stats.atRisk + data.stats.churning}
                            </div>
                            <div className="text-xs text-gray-500">Need attention now</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh Data"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
