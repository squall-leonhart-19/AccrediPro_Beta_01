"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    Users,
    Plus,
    Search,
    Calendar,
    CheckSquare,
    Phone,
    Mail,
    X,
    Loader2,
    ClipboardList,
    TrendingUp,
    Activity,
    Heart,
    Target,
    Zap,
    Video,
    Send,
    Edit,
    Trash2,
    MessageSquare,
    Save,
    ChevronRight,
} from "lucide-react";

interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    notes: string | null;
    tags: string[];
    status: string;
    primaryConcerns?: string | null;
    healthGoals?: string | null;
    currentHealth?: string | null;
    conditions?: string[];
    medications?: string[];
    supplements?: string[];
    allergies?: string[];
    surgeries?: string | null;
    familyHistory?: string | null;
    dietType?: string | null;
    sleepHours?: number | null;
    exerciseFreq?: string | null;
    stressLevel?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    occupation?: string | null;
    startDate?: Date | null;
    packageType?: string | null;
    assessments?: any[];
    sessions: Array<{ id: string; date: Date; notes?: string | null; sessionType?: string | null }>;
    tasks: Array<{ id: string; task: string; dueDate?: Date | null; completed?: boolean }>;
    protocols: Array<{ id: string; name: string; status: string }>;
    _count: { sessions: number; tasks: number; protocols: number };
}

// Templates
const SESSION_TEMPLATES = [
    { id: "initial", name: "Initial Consultation", duration: 60, icon: "🎯" },
    { id: "followup", name: "Follow-up Session", duration: 45, icon: "🔄" },
    { id: "checkin", name: "Quick Check-in", duration: 20, icon: "✅" },
    { id: "deep-dive", name: "Deep Dive Session", duration: 90, icon: "🧠" },
];

const PROTOCOL_TEMPLATES = [
    {
        id: "gut-reset",
        name: "28-Day Gut Reset",
        category: "Digestive",
        icon: "🥗",
        weeks: 4,
        description: "Comprehensive gut healing protocol.",
    },
    {
        id: "hormone-balance",
        name: "Hormone Harmony Protocol",
        category: "Hormonal",
        icon: "⚖️",
        weeks: 8,
        description: "Holistic hormone balancing approach.",
    },
    {
        id: "stress-recovery",
        name: "Adrenal Recovery Program",
        category: "Stress",
        icon: "🧘",
        weeks: 6,
        description: "Restore adrenal function and energy.",
    },
];

const INTAKE_FORMS = [
    { id: "health-history", name: "Health History Questionnaire", icon: "📋" },
    { id: "lifestyle", name: "Lifestyle Assessment", icon: "🏃" },
    { id: "nutrition", name: "Nutrition & Diet Intake", icon: "🥗" },
    { id: "goals", name: "Goals & Vision Worksheet", icon: "🎯" },
    { id: "consent", name: "Coaching Agreement & Consent", icon: "✍️" },
];

export function ClientsPageClient({ clients: initialClients }: { clients: Client[] }) {
    const [clients, setClients] = useState(initialClients);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showAddClient, setShowAddClient] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Modal states
    const [showAddSession, setShowAddSession] = useState(false);
    const [showAssignProtocol, setShowAssignProtocol] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showSendForm, setShowSendForm] = useState(false);

    // Form states
    const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", notes: "" });
    const [newSession, setNewSession] = useState({ type: "", date: "", notes: "" });
    const [newTask, setNewTask] = useState({ task: "", dueDate: "" });
    const [clientNotes, setClientNotes] = useState("");
    const [selectedProtocol, setSelectedProtocol] = useState<typeof PROTOCOL_TEMPLATES[0] | null>(null);

    // Health profile editing state
    const [editingHealth, setEditingHealth] = useState(false);
    const [healthForm, setHealthForm] = useState({
        primaryConcerns: "",
        healthGoals: "",
        currentHealth: "",
        conditions: [] as string[],
        medications: [] as string[],
        supplements: [] as string[],
        allergies: [] as string[],
        surgeries: "",
        familyHistory: "",
        dietType: "",
        sleepHours: 7,
        exerciseFreq: "",
        stressLevel: "",
        dateOfBirth: "",
        gender: "",
        occupation: "",
    });
    const [savingHealth, setSavingHealth] = useState(false);

    // Update notes when client changes
    useEffect(() => {
        if (selectedClient) {
            setClientNotes(selectedClient.notes || "");
        }
    }, [selectedClient?.id]);

    // Update health form when client changes
    useEffect(() => {
        if (selectedClient) {
            setHealthForm({
                primaryConcerns: selectedClient.primaryConcerns || "",
                healthGoals: selectedClient.healthGoals || "",
                currentHealth: selectedClient.currentHealth || "",
                conditions: selectedClient.conditions || [],
                medications: selectedClient.medications || [],
                supplements: selectedClient.supplements || [],
                allergies: selectedClient.allergies || [],
                surgeries: selectedClient.surgeries || "",
                familyHistory: selectedClient.familyHistory || "",
                dietType: selectedClient.dietType || "",
                sleepHours: selectedClient.sleepHours || 7,
                exerciseFreq: selectedClient.exerciseFreq || "",
                stressLevel: selectedClient.stressLevel || "",
                dateOfBirth: selectedClient.dateOfBirth ? new Date(selectedClient.dateOfBirth).toISOString().split('T')[0] : "",
                gender: selectedClient.gender || "",
                occupation: selectedClient.occupation || "",
            });
            setEditingHealth(false);
        }
    }, [selectedClient?.id]);

    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
            case "PAUSED": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
            case "COMPLETED": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
            default: return "bg-white/10 text-white/70 border-white/20";
        }
    };

    // Handlers
    const handleAddClient = async () => {
        if (!newClient.name.trim()) return;
        setSaving(true);
        try {
            const res = await fetch("/api/coach/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newClient),
            });
            const data = await res.json();
            if (data.success) {
                setClients([data.data, ...clients]);
                setShowAddClient(false);
                setNewClient({ name: "", email: "", phone: "", notes: "" });
                toast.success("Client added successfully!");
            }
        } catch (error) {
            toast.error("Failed to add client");
        } finally {
            setSaving(false);
        }
    };

    const handleAddSession = async () => {
        if (!selectedClient || !newSession.type || !newSession.date) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/coach/clients/${selectedClient.id}/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionType: newSession.type,
                    date: newSession.date,
                    notes: newSession.notes,
                    duration: SESSION_TEMPLATES.find(t => t.name === newSession.type)?.duration || 45,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSelectedClient(prev => prev ? { ...prev, sessions: [data.data, ...prev.sessions] } : null);
                setShowAddSession(false);
                setNewSession({ type: "", date: "", notes: "" });
                toast.success("Session logged!");
            }
        } catch (error) {
            toast.error("Failed to log session");
        } finally {
            setSaving(false);
        }
    };

    const handleAssignProtocol = async () => {
        if (!selectedClient || !selectedProtocol) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/coach/clients/${selectedClient.id}/protocols`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: selectedProtocol.name,
                    description: selectedProtocol.description,
                    steps: [],
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSelectedClient(prev => prev ? { ...prev, protocols: [data.data, ...prev.protocols] } : null);
                setShowAssignProtocol(false);
                setSelectedProtocol(null);
                toast.success("Protocol assigned!");
            }
        } catch (error) {
            toast.error("Failed to assign protocol");
        } finally {
            setSaving(false);
        }
    };

    const handleAddTask = async () => {
        if (!selectedClient || !newTask.task.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/coach/clients/${selectedClient.id}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
            const data = await res.json();
            if (data.success) {
                setSelectedClient(prev => prev ? { ...prev, tasks: [data.data, ...prev.tasks] } : null);
                setShowAddTask(false);
                setNewTask({ task: "", dueDate: "" });
                toast.success("Task added!");
            }
        } catch (error) {
            toast.error("Failed to add task");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedClient) return;
        setSaving(true);
        try {
            await fetch(`/api/coach/clients/${selectedClient.id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: clientNotes }),
            });
            toast.success("Notes saved!");
        } catch (error) {
            toast.error("Failed to save notes");
        } finally {
            setSaving(false);
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        if (!selectedClient) return;
        try {
            await fetch(`/api/coach/clients/${selectedClient.id}/tasks`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId, completed: true }),
            });
            setSelectedClient(prev => prev ? {
                ...prev,
                tasks: prev.tasks.filter(t => t.id !== taskId)
            } : null);
            toast.success("Task completed!");
        } catch (error) {
            toast.error("Failed to complete task");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a0c] via-[#2d1216] to-[#1a0a0c] p-4 lg:p-8">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#722f37]/20 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#d4af37]/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] shadow-lg shadow-[#d4af37]/20">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-3 py-1">
                            Client Management
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">My Clients</h1>
                    <p className="text-white/60 text-lg">Manage your coaching clients and their progress</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Client List Sidebar */}
                    <div className="w-full lg:w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 h-fit lg:sticky lg:top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Clients ({clients.length})</h3>
                            <Button size="sm" onClick={() => setShowAddClient(true)} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#d4af37]/50"
                            />
                        </div>

                        {/* Client List */}
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {filteredClients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={cn(
                                        "w-full p-3 rounded-xl text-left transition-all border",
                                        selectedClient?.id === client.id
                                            ? "bg-[#d4af37]/10 border-[#d4af37]/30"
                                            : "hover:bg-white/5 border-transparent hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-[#722f37]/50">
                                            <AvatarFallback className="bg-gradient-to-br from-[#722f37] to-[#5a252b] text-white text-sm">
                                                {getInitials(client.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{client.name}</p>
                                            <p className="text-xs text-white/40 truncate">{client.email}</p>
                                        </div>
                                        <Badge className={cn("text-xs border", getStatusColor(client.status))}>{client.status}</Badge>
                                    </div>
                                </button>
                            ))}
                            {filteredClients.length === 0 && (
                                <div className="text-center py-8">
                                    <Users className="w-10 h-10 mx-auto mb-2 text-white/30" />
                                    <p className="text-sm text-white/50">No clients found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Client Detail */}
                    <div className="flex-1">
                        {selectedClient ? (
                            <div className="space-y-6">
                                {/* Client Header */}
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#722f37] via-[#8b3a44] to-[#722f37] p-6 text-white relative overflow-hidden">
                                        {/* Decorative glow */}
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 blur-3xl rounded-full" />
                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16 ring-4 ring-white/20 border-2 border-[#d4af37]/30">
                                                    <AvatarFallback className="bg-gradient-to-br from-[#d4af37] to-[#b8962e] text-white text-xl font-bold">
                                                        {getInitials(selectedClient.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                                                    <div className="flex items-center gap-4 mt-1 text-white/70 text-sm">
                                                        {selectedClient.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedClient.email}</span>}
                                                        {selectedClient.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedClient.phone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className={cn("border", getStatusColor(selectedClient.status))}>{selectedClient.status}</Badge>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-4 divide-x divide-white/5 bg-white/5">
                                        {[
                                            { label: "Sessions", value: selectedClient._count.sessions, icon: Calendar, color: "text-blue-400" },
                                            { label: "Tasks", value: selectedClient.tasks.length, icon: CheckSquare, color: "text-amber-400" },
                                            { label: "Protocols", value: selectedClient._count.protocols, icon: ClipboardList, color: "text-purple-400" },
                                            { label: "Progress", value: "—", icon: TrendingUp, color: "text-emerald-400" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="p-4 text-center">
                                                <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                                <p className="text-xs text-white/50">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tabs */}
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                                        <TabsTrigger value="overview" className="rounded-lg px-4 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"><Activity className="w-4 h-4 mr-2" />Overview</TabsTrigger>
                                        <TabsTrigger value="health" className="rounded-lg px-4 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"><Heart className="w-4 h-4 mr-2" />Health Profile</TabsTrigger>
                                        <TabsTrigger value="sessions" className="rounded-lg px-4 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"><Calendar className="w-4 h-4 mr-2" />Sessions</TabsTrigger>
                                        <TabsTrigger value="tasks" className="rounded-lg px-4 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"><CheckSquare className="w-4 h-4 mr-2" />Tasks</TabsTrigger>
                                        <TabsTrigger value="notes" className="rounded-lg px-4 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"><Edit className="w-4 h-4 mr-2" />Notes</TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="mt-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Quick Actions */}
                                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-[#d4af37]" />Quick Actions
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button variant="outline" onClick={() => setShowAddSession(true)} className="h-auto py-3 flex-col gap-1 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 text-white">
                                                        <Video className="w-5 h-5 text-blue-400" /><span className="text-xs">Log Session</span>
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setShowSendForm(true)} className="h-auto py-3 flex-col gap-1 bg-[#722f37]/20 border-[#722f37]/30 hover:bg-[#722f37]/30 hover:border-[#722f37]/40 text-white">
                                                        <Send className="w-5 h-5 text-[#d4af37]" /><span className="text-xs">Send Form</span>
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setShowAssignProtocol(true)} className="h-auto py-3 flex-col gap-1 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/30 text-white">
                                                        <ClipboardList className="w-5 h-5 text-purple-400" /><span className="text-xs">Assign Protocol</span>
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setShowAddTask(true)} className="h-auto py-3 flex-col gap-1 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 text-white">
                                                        <CheckSquare className="w-5 h-5 text-amber-400" /><span className="text-xs">Add Task</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Health Summary */}
                                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                    <Target className="w-5 h-5 text-[#d4af37]" />Health Goals
                                                </h3>
                                                {selectedClient.healthGoals ? (
                                                    <p className="text-sm text-white/70">{selectedClient.healthGoals}</p>
                                                ) : (
                                                    <p className="text-sm text-white/40">No health goals set</p>
                                                )}
                                                {selectedClient.primaryConcerns && (
                                                    <div className="mt-4 pt-4 border-t border-white/10">
                                                        <p className="text-xs font-medium text-white/50 mb-2">Primary Concerns</p>
                                                        <p className="text-sm text-white/70">{selectedClient.primaryConcerns}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pending Tasks */}
                                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 md:col-span-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        <CheckSquare className="w-5 h-5 text-amber-400" />Pending Tasks
                                                    </h3>
                                                    <Button size="sm" variant="ghost" onClick={() => setShowAddTask(true)} className="text-[#d4af37] hover:text-[#e8c547] hover:bg-[#d4af37]/10">
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                {selectedClient.tasks.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedClient.tasks.map((task) => (
                                                            <div key={task.id} className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                                <button
                                                                    onClick={() => handleCompleteTask(task.id)}
                                                                    className="w-5 h-5 rounded-full border-2 border-amber-400/50 hover:bg-amber-500/30 transition-colors"
                                                                />
                                                                <p className="text-sm font-medium text-white flex-1">{task.task}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-white/40 text-center py-4">No pending tasks</p>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Health Profile Tab */}
                                    <TabsContent value="health" className="mt-6">
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="font-bold text-white text-xl">Health Profile</h3>
                                                    <p className="text-sm text-white/50">Complete health information for {selectedClient.name}</p>
                                                </div>
                                                {!editingHealth ? (
                                                    <Button onClick={() => setEditingHealth(true)} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                                                        <Edit className="w-4 h-4 mr-2" /> Edit Profile
                                                    </Button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" onClick={() => setEditingHealth(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">Cancel</Button>
                                                        <Button
                                                            className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0"
                                                            disabled={savingHealth}
                                                            onClick={async () => {
                                                                setSavingHealth(true);
                                                                try {
                                                                    const res = await fetch(`/api/coach/clients/${selectedClient.id}/health`, {
                                                                        method: "PUT",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify(healthForm),
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.success) {
                                                                        setSelectedClient(prev => prev ? { ...prev, ...data.data } : null);
                                                                        setEditingHealth(false);
                                                                        toast.success("Health profile saved!");
                                                                    } else {
                                                                        toast.error(data.error || "Failed to save");
                                                                    }
                                                                } catch (error) {
                                                                    toast.error("Failed to save health profile");
                                                                } finally {
                                                                    setSavingHealth(false);
                                                                }
                                                            }}
                                                        >
                                                            {savingHealth ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                                            Save Profile
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {!editingHealth ? (
                                                /* View Mode */
                                                <div className="space-y-6">
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div className="p-4 bg-[#722f37]/20 border border-[#722f37]/30 rounded-xl">
                                                            <p className="text-xs font-medium text-[#d4af37] mb-1">Primary Concerns</p>
                                                            <p className="text-sm text-white">{selectedClient.primaryConcerns || "Not specified"}</p>
                                                        </div>
                                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                            <p className="text-xs font-medium text-emerald-400 mb-1">Health Goals</p>
                                                            <p className="text-sm text-white">{selectedClient.healthGoals || "Not specified"}</p>
                                                        </div>
                                                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                                            <p className="text-xs font-medium text-blue-400 mb-1">Current Health Status</p>
                                                            <p className="text-sm text-white">{selectedClient.currentHealth || "Not specified"}</p>
                                                        </div>
                                                    </div>

                                                    {/* Medical History */}
                                                    <div>
                                                        <h4 className="font-semibold text-white mb-3">Medical History</h4>
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                                                <p className="text-xs font-medium text-white/50 mb-2">Conditions</p>
                                                                {(selectedClient.conditions?.length ?? 0) > 0 ? (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {selectedClient.conditions?.map((c, i) => (
                                                                            <Badge key={i} variant="outline" className="text-xs bg-white/5 border-white/20 text-white">{c}</Badge>
                                                                        ))}
                                                                    </div>
                                                                ) : <p className="text-sm text-white/40">None listed</p>}
                                                            </div>
                                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                                                <p className="text-xs font-medium text-white/50 mb-2">Allergies</p>
                                                                {(selectedClient.allergies?.length ?? 0) > 0 ? (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {selectedClient.allergies?.map((a, i) => (
                                                                            <Badge key={i} variant="outline" className="text-xs bg-red-500/10 border-red-500/30 text-red-300">{a}</Badge>
                                                                        ))}
                                                                    </div>
                                                                ) : <p className="text-sm text-white/40">None listed</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Lifestyle */}
                                                    <div>
                                                        <h4 className="font-semibold text-white mb-3">Lifestyle</h4>
                                                        <div className="grid md:grid-cols-4 gap-4">
                                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                                                                <p className="text-2xl font-bold text-[#d4af37]">{selectedClient.sleepHours || "-"}</p>
                                                                <p className="text-xs text-white/50">Hours Sleep</p>
                                                            </div>
                                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                                                                <p className="text-lg font-semibold text-white">{selectedClient.dietType || "-"}</p>
                                                                <p className="text-xs text-white/50">Diet Type</p>
                                                            </div>
                                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                                                                <p className="text-lg font-semibold text-white">{selectedClient.exerciseFreq || "-"}</p>
                                                                <p className="text-xs text-white/50">Exercise</p>
                                                            </div>
                                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                                                                <p className="text-lg font-semibold text-white">{selectedClient.stressLevel || "-"}</p>
                                                                <p className="text-xs text-white/50">Stress Level</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Edit Mode */
                                                <div className="space-y-6">
                                                    <div className="grid md:grid-cols-1 gap-4">
                                                        <div>
                                                            <Label className="text-white/70">Primary Concerns</Label>
                                                            <Textarea
                                                                value={healthForm.primaryConcerns}
                                                                onChange={(e) => setHealthForm({...healthForm, primaryConcerns: e.target.value})}
                                                                placeholder="What are the client's main health concerns?"
                                                                rows={2}
                                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-white/70">Health Goals</Label>
                                                            <Textarea
                                                                value={healthForm.healthGoals}
                                                                onChange={(e) => setHealthForm({...healthForm, healthGoals: e.target.value})}
                                                                placeholder="What does the client want to achieve?"
                                                                rows={2}
                                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-white mb-3">Lifestyle</h4>
                                                        <div className="grid md:grid-cols-4 gap-4">
                                                            <div>
                                                                <Label className="text-white/70">Diet Type</Label>
                                                                <Select value={healthForm.dietType} onValueChange={(v) => setHealthForm({...healthForm, dietType: v})}>
                                                                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select diet" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Standard">Standard</SelectItem>
                                                                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                                                        <SelectItem value="Vegan">Vegan</SelectItem>
                                                                        <SelectItem value="Keto">Keto</SelectItem>
                                                                        <SelectItem value="Paleo">Paleo</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-white/70">Sleep Hours</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="24"
                                                                    value={healthForm.sleepHours}
                                                                    onChange={(e) => setHealthForm({...healthForm, sleepHours: parseInt(e.target.value) || 0})}
                                                                    className="bg-white/5 border-white/10 text-white"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-white/70">Exercise Frequency</Label>
                                                                <Select value={healthForm.exerciseFreq} onValueChange={(v) => setHealthForm({...healthForm, exerciseFreq: v})}>
                                                                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="None">None</SelectItem>
                                                                        <SelectItem value="1-2x/week">1-2x/week</SelectItem>
                                                                        <SelectItem value="3-4x/week">3-4x/week</SelectItem>
                                                                        <SelectItem value="Daily">Daily</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-white/70">Stress Level</Label>
                                                                <Select value={healthForm.stressLevel} onValueChange={(v) => setHealthForm({...healthForm, stressLevel: v})}>
                                                                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select level" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Low">Low</SelectItem>
                                                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                                                        <SelectItem value="High">High</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Sessions Tab */}
                                    <TabsContent value="sessions" className="mt-6">
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-bold text-white">Session History</h3>
                                                <Button size="sm" onClick={() => setShowAddSession(true)} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0">
                                                    <Plus className="w-4 h-4 mr-2" /> Log Session
                                                </Button>
                                            </div>
                                            {selectedClient.sessions.length > 0 ? (
                                                <div className="space-y-3">
                                                    {selectedClient.sessions.map((session, i) => (
                                                        <div key={session.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 transition-all">
                                                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                                                <Calendar className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-white">{session.sessionType || `Session #${selectedClient.sessions.length - i}`}</p>
                                                                <p className="text-sm text-white/50">{new Date(session.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                                                                onClick={async () => {
                                                                    if (!confirm("Delete this session?")) return;
                                                                    try {
                                                                        await fetch(`/api/coach/clients/${selectedClient.id}/sessions?itemId=${session.id}`, { method: "DELETE" });
                                                                        setSelectedClient(prev => prev ? {
                                                                            ...prev,
                                                                            sessions: prev.sessions.filter(s => s.id !== session.id),
                                                                        } : null);
                                                                        toast.success("Session deleted");
                                                                    } catch (error) {
                                                                        toast.error("Failed to delete session");
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                                        <Calendar className="w-8 h-8 text-blue-400" />
                                                    </div>
                                                    <p className="text-white/50 mb-4">No sessions recorded yet</p>
                                                    <Button onClick={() => setShowAddSession(true)} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0">
                                                        <Plus className="w-4 h-4 mr-2" /> Log First Session
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Tasks Tab */}
                                    <TabsContent value="tasks" className="mt-6">
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-bold text-white">Tasks</h3>
                                                <Button size="sm" onClick={() => setShowAddTask(true)} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0">
                                                    <Plus className="w-4 h-4 mr-2" /> Add Task
                                                </Button>
                                            </div>
                                            {selectedClient.tasks.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedClient.tasks.map((task) => (
                                                        <div key={task.id} className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                            <button
                                                                onClick={() => handleCompleteTask(task.id)}
                                                                className="w-6 h-6 rounded-full border-2 border-amber-400/50 hover:bg-amber-500/30 transition-colors flex-shrink-0"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-white">{task.task}</p>
                                                                {task.dueDate && (
                                                                    <p className="text-xs text-white/50">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                                        <CheckSquare className="w-8 h-8 text-amber-400" />
                                                    </div>
                                                    <p className="text-white/50 mb-4">No tasks yet</p>
                                                    <Button onClick={() => setShowAddTask(true)} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0">
                                                        <Plus className="w-4 h-4 mr-2" /> Add First Task
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Notes Tab */}
                                    <TabsContent value="notes" className="mt-6">
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-white">Session Notes</h3>
                                                <Button onClick={handleSaveNotes} disabled={saving} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0">
                                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                                    Save Notes
                                                </Button>
                                            </div>
                                            <Textarea
                                                value={clientNotes}
                                                onChange={(e) => setClientNotes(e.target.value)}
                                                placeholder="Add notes about this client..."
                                                rows={12}
                                                className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        ) : (
                            /* No Client Selected */
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <Users className="w-10 h-10 text-white/30" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Select a Client</h3>
                                <p className="text-white/50 mb-6">Choose a client from the list to view their details</p>
                                <Button onClick={() => setShowAddClient(true)} className="bg-gradient-to-r from-[#722f37] to-[#8b3a44] hover:from-[#8b3a44] hover:to-[#a04550] text-white border-0 shadow-lg shadow-[#722f37]/25">
                                    <Plus className="w-4 h-4 mr-2" /> Add New Client
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Client Modal */}
            {showAddClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Client</h3>
                            <button onClick={() => setShowAddClient(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label>Client Name *</Label>
                                <Input value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} placeholder="Full name" />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} placeholder="email@example.com" />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} placeholder="(555) 123-4567" />
                            </div>
                            <div>
                                <Label>Initial Notes</Label>
                                <Textarea value={newClient.notes} onChange={(e) => setNewClient({...newClient, notes: e.target.value})} placeholder="Any initial notes..." rows={3} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowAddClient(false)}>Cancel</Button>
                            <Button onClick={handleAddClient} disabled={saving || !newClient.name.trim()} className="bg-burgundy-600 hover:bg-burgundy-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Add Client
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Session Modal */}
            {showAddSession && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Log Session</h3>
                            <button onClick={() => setShowAddSession(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label>Session Type</Label>
                                <Select value={newSession.type} onValueChange={(v) => setNewSession({...newSession, type: v})}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        {SESSION_TEMPLATES.map((t) => (
                                            <SelectItem key={t.id} value={t.name}>{t.icon} {t.name} ({t.duration}min)</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Input type="date" value={newSession.date} onChange={(e) => setNewSession({...newSession, date: e.target.value})} />
                            </div>
                            <div>
                                <Label>Notes</Label>
                                <Textarea value={newSession.notes} onChange={(e) => setNewSession({...newSession, notes: e.target.value})} placeholder="Session notes..." rows={3} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowAddSession(false)}>Cancel</Button>
                            <Button onClick={handleAddSession} disabled={saving || !newSession.type || !newSession.date} className="bg-burgundy-600 hover:bg-burgundy-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Log Session
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTask && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add Task</h3>
                            <button onClick={() => setShowAddTask(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label>Task *</Label>
                                <Input value={newTask.task} onChange={(e) => setNewTask({...newTask, task: e.target.value})} placeholder="What needs to be done?" />
                            </div>
                            <div>
                                <Label>Due Date</Label>
                                <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowAddTask(false)}>Cancel</Button>
                            <Button onClick={handleAddTask} disabled={saving || !newTask.task.trim()} className="bg-burgundy-600 hover:bg-burgundy-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Add Task
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Protocol Modal */}
            {showAssignProtocol && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Assign Protocol</h3>
                            <button onClick={() => setShowAssignProtocol(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-3">
                            {PROTOCOL_TEMPLATES.map((protocol) => (
                                <button
                                    key={protocol.id}
                                    onClick={() => setSelectedProtocol(protocol)}
                                    className={cn(
                                        "w-full p-4 rounded-xl text-left transition-all border-2",
                                        selectedProtocol?.id === protocol.id
                                            ? "border-burgundy-500 bg-burgundy-50"
                                            : "border-gray-200 hover:border-burgundy-200"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{protocol.icon}</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">{protocol.name}</p>
                                            <p className="text-sm text-gray-500">{protocol.category} • {protocol.weeks} weeks</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowAssignProtocol(false)}>Cancel</Button>
                            <Button onClick={handleAssignProtocol} disabled={saving || !selectedProtocol} className="bg-burgundy-600 hover:bg-burgundy-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Assign Protocol
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Form Modal */}
            {showSendForm && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Send Form to {selectedClient.name}</h3>
                            <button onClick={() => setShowSendForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        {!selectedClient.email ? (
                            <div className="text-center py-8">
                                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-gray-600 mb-2">No email address for this client</p>
                                <p className="text-sm text-gray-400">Add an email to send intake forms</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {INTAKE_FORMS.map((form) => (
                                    <button
                                        key={form.id}
                                        onClick={async () => {
                                            setSaving(true);
                                            try {
                                                const res = await fetch("/api/coach/intake-forms", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ clientId: selectedClient.id, formType: form.id }),
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    toast.success(`${form.name} sent to ${selectedClient.email}!`);
                                                    setShowSendForm(false);
                                                } else {
                                                    toast.error(data.error || "Failed to send form");
                                                }
                                            } catch (error) {
                                                toast.error("Failed to send form");
                                            } finally {
                                                setSaving(false);
                                            }
                                        }}
                                        disabled={saving}
                                        className="w-full p-4 rounded-xl text-left transition-all border border-gray-200 hover:border-burgundy-200 hover:bg-burgundy-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{form.icon}</span>
                                            <p className="font-medium text-gray-900">{form.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <Button variant="outline" onClick={() => setShowSendForm(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
