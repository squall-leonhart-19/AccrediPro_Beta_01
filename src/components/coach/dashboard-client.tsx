"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Users,
    Calendar,
    CheckSquare,
    ClipboardList,
    TrendingUp,
    ArrowRight,
    Plus,
    MessageSquare,
    Sparkles,
    Target,
    Award,
} from "lucide-react";

interface Client {
    id: string;
    name: string;
    status: string;
    tasks: Array<{ id: string; task: string }>;
    sessions: Array<{ id: string; date: Date }>;
}

interface Stats {
    totalClients: number;
    activeClients: number;
    pendingTasks: number;
    thisWeekSessions: number;
}

export function DashboardClient({ clients, stats }: { clients: Client[]; stats: Stats }) {
    const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "PAUSED": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // Get recent clients (last 5)
    const recentClients = clients.slice(0, 5);

    // Get upcoming tasks across all clients
    const allTasks = clients.flatMap((c) =>
        c.tasks.map((t) => ({ ...t, clientName: c.name, clientId: c.id }))
    ).slice(0, 5);

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-burgundy-100 text-burgundy-700 border border-burgundy-200 px-3 py-1">
                        Coach Portal
                    </Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back!
                </h1>
                <p className="text-gray-500 text-lg">
                    Here's what's happening with your coaching practice
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Clients", value: stats.totalClients, icon: Users, color: "bg-blue-500", href: "/coach/clients" },
                    { label: "Active Clients", value: stats.activeClients, icon: TrendingUp, color: "bg-emerald-500", href: "/coach/clients" },
                    { label: "Pending Tasks", value: stats.pendingTasks, icon: Target, color: "bg-amber-500", href: "/coach/clients" },
                    { label: "Sessions This Week", value: stats.thisWeekSessions, icon: Calendar, color: "bg-purple-500", href: "/coach/clients" },
                ].map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <div className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-burgundy-200 transition-all duration-300 cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4 shadow-md`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Clients */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-burgundy-100">
                                <Users className="w-4 h-4 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Recent Clients</h3>
                        </div>
                        <Link href="/coach/clients">
                            <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    {recentClients.length > 0 ? (
                        <div className="space-y-3">
                            {recentClients.map((client) => (
                                <Link key={client.id} href="/coach/clients">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-burgundy-50 border border-transparent hover:border-burgundy-100 transition-all cursor-pointer">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow">
                                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-sm font-medium">
                                                {getInitials(client.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{client.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {client.sessions.length} sessions • {client.tasks.length} tasks
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-4">No clients yet</p>
                            <Link href="/coach/clients">
                                <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" /> Add First Client
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100">
                                <CheckSquare className="w-4 h-4 text-amber-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Pending Tasks</h3>
                        </div>
                        <Link href="/coach/clients">
                            <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    {allTasks.length > 0 ? (
                        <div className="space-y-3">
                            {allTasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{task.task}</p>
                                        <p className="text-xs text-gray-500">{task.clientName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Award className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-gray-500">All caught up! No pending tasks.</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-burgundy-100">
                            <Sparkles className="w-4 h-4 text-burgundy-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/coach/clients">
                            <div className="group p-5 bg-blue-50 border border-blue-100 rounded-xl text-center hover:bg-blue-100 hover:border-blue-200 transition-all cursor-pointer">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Add Client</p>
                            </div>
                        </Link>
                        <Link href="/coach/profile">
                            <div className="group p-5 bg-purple-50 border border-purple-100 rounded-xl text-center hover:bg-purple-100 hover:border-purple-200 transition-all cursor-pointer">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Edit Profile</p>
                            </div>
                        </Link>
                        <Link href="/coach/availability">
                            <div className="group p-5 bg-emerald-50 border border-emerald-100 rounded-xl text-center hover:bg-emerald-100 hover:border-emerald-200 transition-all cursor-pointer">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Set Availability</p>
                            </div>
                        </Link>
                        <Link href="/messages">
                            <div className="group p-5 bg-amber-50 border border-amber-100 rounded-xl text-center hover:bg-amber-100 hover:border-amber-200 transition-all cursor-pointer">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Messages</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
