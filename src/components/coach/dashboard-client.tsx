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
            case "ACTIVE": return "bg-green-100 text-green-700";
            case "PAUSED": return "bg-yellow-100 text-yellow-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Get recent clients (last 5)
    const recentClients = clients.slice(0, 5);

    // Get upcoming tasks across all clients
    const allTasks = clients.flatMap((c) =>
        c.tasks.map((t) => ({ ...t, clientName: c.name, clientId: c.id }))
    ).slice(0, 5);

    return (
        <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-500">Here's what's happening with your coaching practice</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Clients", value: stats.totalClients, icon: Users, color: "blue", href: "/coach/clients" },
                    { label: "Active Clients", value: stats.activeClients, icon: TrendingUp, color: "green", href: "/coach/clients" },
                    { label: "Pending Tasks", value: stats.pendingTasks, icon: CheckSquare, color: "orange", href: "/coach/clients" },
                    { label: "Sessions This Week", value: stats.thisWeekSessions, icon: Calendar, color: "purple", href: "/coach/clients" },
                ].map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                            <stat.icon className={`w-6 h-6 text-${stat.color}-500 mb-3`} />
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Clients */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Recent Clients</h3>
                        <Link href="/coach/clients">
                            <Button variant="ghost" size="sm" className="text-burgundy-600">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    {recentClients.length > 0 ? (
                        <div className="space-y-3">
                            {recentClients.map((client) => (
                                <Link key={client.id} href="/coach/clients">
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-sm">
                                                {getInitials(client.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{client.name}</p>
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
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500 mb-4">No clients yet</p>
                            <Link href="/coach/clients">
                                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                    <Plus className="w-4 h-4 mr-2" /> Add First Client
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Pending Tasks</h3>
                        <Link href="/coach/clients">
                            <Button variant="ghost" size="sm" className="text-burgundy-600">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    {allTasks.length > 0 ? (
                        <div className="space-y-3">
                            {allTasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <div className="w-5 h-5 rounded-full border-2 border-orange-300 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{task.task}</p>
                                        <p className="text-xs text-gray-500">{task.clientName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500">All caught up! No pending tasks.</p>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/coach/clients">
                            <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer">
                                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                <p className="text-sm font-medium text-blue-900">Add Client</p>
                            </div>
                        </Link>
                        <Link href="/coach/profile">
                            <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer">
                                <ClipboardList className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                <p className="text-sm font-medium text-purple-900">Edit Profile</p>
                            </div>
                        </Link>
                        <Link href="/coach/availability">
                            <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors cursor-pointer">
                                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                <p className="text-sm font-medium text-green-900">Set Availability</p>
                            </div>
                        </Link>
                        <Link href="/messages">
                            <div className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-colors cursor-pointer">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                                <p className="text-sm font-medium text-amber-900">Messages</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
