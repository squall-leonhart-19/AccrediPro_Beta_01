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
            case "ACTIVE": return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
            case "PAUSED": return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
            default: return "bg-white/10 text-white/70 border border-white/20";
        }
    };

    // Get recent clients (last 5)
    const recentClients = clients.slice(0, 5);

    // Get upcoming tasks across all clients
    const allTasks = clients.flatMap((c) =>
        c.tasks.map((t) => ({ ...t, clientName: c.name, clientId: c.id }))
    ).slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a0c] via-[#2d1216] to-[#1a0a0c] p-4 lg:p-8">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#722f37]/20 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#d4af37]/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] shadow-lg shadow-[#d4af37]/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-3 py-1">
                            Coach Portal
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Welcome back!
                    </h1>
                    <p className="text-white/60 text-lg">
                        Here's what's happening with your coaching practice
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Clients", value: stats.totalClients, icon: Users, gradient: "from-blue-500 to-blue-600", href: "/coach/clients" },
                        { label: "Active Clients", value: stats.activeClients, icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", href: "/coach/clients" },
                        { label: "Pending Tasks", value: stats.pendingTasks, icon: Target, gradient: "from-amber-500 to-orange-500", href: "/coach/clients" },
                        { label: "Sessions This Week", value: stats.thisWeekSessions, icon: Calendar, gradient: "from-purple-500 to-purple-600", href: "/coach/clients" },
                    ].map((stat) => (
                        <Link key={stat.label} href={stat.href}>
                            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 cursor-pointer overflow-hidden">
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 to-[#d4af37]/0 group-hover:from-[#d4af37]/5 group-hover:to-transparent transition-all duration-300" />

                                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="relative text-4xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="relative text-sm text-white/50">{stat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Clients */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#722f37] to-[#5a252b]">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-bold text-white text-lg">Recent Clients</h3>
                            </div>
                            <Link href="/coach/clients">
                                <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#e8c547] hover:bg-[#d4af37]/10">
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        {recentClients.length > 0 ? (
                            <div className="space-y-3">
                                {recentClients.map((client) => (
                                    <Link key={client.id} href="/coach/clients">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#d4af37]/20 transition-all cursor-pointer">
                                            <Avatar className="h-10 w-10 border-2 border-[#722f37]/50">
                                                <AvatarFallback className="bg-gradient-to-br from-[#722f37] to-[#5a252b] text-white text-sm font-medium">
                                                    {getInitials(client.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">{client.name}</p>
                                                <p className="text-xs text-white/40">
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
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white/30" />
                                </div>
                                <p className="text-white/50 mb-4">No clients yet</p>
                                <Link href="/coach/clients">
                                    <Button className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0 shadow-lg shadow-[#722f37]/25">
                                        <Plus className="w-4 h-4 mr-2" /> Add First Client
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                                    <CheckSquare className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-bold text-white text-lg">Pending Tasks</h3>
                            </div>
                            <Link href="/coach/clients">
                                <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#e8c547] hover:bg-[#d4af37]/10">
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        {allTasks.length > 0 ? (
                            <div className="space-y-3">
                                {allTasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                        <div className="w-5 h-5 rounded-full border-2 border-amber-400/50 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{task.task}</p>
                                            <p className="text-xs text-white/40">{task.clientName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Award className="w-8 h-8 text-emerald-400" />
                                </div>
                                <p className="text-white/50">All caught up! No pending tasks.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8962e]">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-white text-lg">Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/coach/clients">
                                <div className="group p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center hover:bg-blue-500/20 hover:border-blue-500/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-white">Add Client</p>
                                </div>
                            </Link>
                            <Link href="/coach/profile">
                                <div className="group p-5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center hover:bg-purple-500/20 hover:border-purple-500/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                                        <ClipboardList className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-white">Edit Profile</p>
                                </div>
                            </Link>
                            <Link href="/coach/availability">
                                <div className="group p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-white">Set Availability</p>
                                </div>
                            </Link>
                            <Link href="/messages">
                                <div className="group p-5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl text-center hover:bg-[#d4af37]/20 hover:border-[#d4af37]/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center shadow-lg shadow-[#d4af37]/25 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-white">Messages</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
